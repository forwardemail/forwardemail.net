# שאלות נפוצות {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

תוכן עניינים {##

* [התחלה מהירה](#quick-start)
* [מָבוֹא](#introduction)
  * [מהו דוא"ל העברת דוא"ל](#what-is-forward-email)
  * [מי משתמש בדוא"ל העברת דוא"ל](#who-uses-forward-email)
  * [מהי היסטוריית העברת דוא"ל](#what-is-forward-emails-history)
  * [כמה מהיר השירות הזה](#how-fast-is-this-service)
* [לקוחות דוא"ל](#email-clients)
  * [Thunderbird](#thunderbird)
  * [מיקרוסופט אאוטלוק](#microsoft-outlook)
  * [אפל מייל](#apple-mail)
  * [מכשירים ניידים](#mobile-devices)
  * [איך לשלוח דואר כ-"דרך ג'ימייל"](#how-to-send-mail-as-using-gmail)
  * [מהו המדריך החינמי מדור קודם ל"שלח דואר כ" באמצעות Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [תצורת ניתוב מתקדמת של Gmail](#advanced-gmail-routing-configuration)
  * [תצורת ניתוב מתקדמת של Outlook](#advanced-outlook-routing-configuration)
* [פתרון בעיות](#troubleshooting)
  * [למה אני לא מקבל את מיילי הבדיקה שלי](#why-am-i-not-receiving-my-test-emails)
  * [כיצד אוכל להגדיר את תוכנת הדוא"ל שלי לעבוד עם העברת דוא"ל](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [למה האימיילים שלי מגיעים לספאם ולדואר זבל ואיך אני יכול לבדוק את המוניטין של הדומיין שלי?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [מה עליי לעשות אם אני מקבל הודעות דואר זבל](#what-should-i-do-if-i-receive-spam-emails)
  * [מדוע הודעות הדוא"ל לניסיון שנשלחו אליי בג'ימייל מוצגות כ"חשודות"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [האם ניתן להסיר את ה-via forwardemail dot net ב-Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [ניהול נתונים](#data-management)
  * [היכן ממוקמים השרתים שלכם](#where-are-your-servers-located)
  * [כיצד אוכל לייצא ולגבות את תיבת הדואר שלי](#how-do-i-export-and-backup-my-mailbox)
  * [כיצד אוכל לייבא ולהעביר את תיבת הדואר הקיימת שלי](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [האם אתה תומך באירוח עצמי](#do-you-support-self-hosting)
* [תצורת דוא"ל](#email-configuration)
  * [איך מתחילים ומגדירים העברת דוא"ל](#how-do-i-get-started-and-set-up-email-forwarding)
  * [האם ניתן להשתמש במספר מרכזיות ושרתים של MX לצורך העברה מתקדמת](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [כיצד אוכל להגדיר משיב חופשה (משיב אוטומטי מחוץ למשרד)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [כיצד אוכל להגדיר SPF עבור העברת דוא"ל](#how-do-i-set-up-spf-for-forward-email)
  * [כיצד ניתן להגדיר DKIM עבור העברת דוא"ל](#how-do-i-set-up-dkim-for-forward-email)
  * [כיצד אוכל להגדיר DMARC עבור העברת דוא"ל](#how-do-i-set-up-dmarc-for-forward-email)
  * [איך אני מחבר ומגדיר את אנשי הקשר שלי](#how-do-i-connect-and-configure-my-contacts)
  * [כיצד ניתן לחבר ולקבוע את תצורת היומנים שלי](#how-do-i-connect-and-configure-my-calendars)
  * [כיצד ניתן להוסיף עוד יומנים ולנהל יומנים קיימים](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [כיצד אוכל להגדיר SRS עבור העברת דוא"ל](#how-do-i-set-up-srs-for-forward-email)
  * [כיצד אוכל להגדיר MTA-STS עבור העברת דוא"ל](#how-do-i-set-up-mta-sts-for-forward-email)
  * [איך אני מוסיף תמונת פרופיל לכתובת המייל שלי](#how-do-i-add-a-profile-picture-to-my-email-address)
* [תכונות מתקדמות](#advanced-features)
  * [האם אתם תומכים בניוזלטרים או ברשימות תפוצה עבור דוא"ל שיווקי](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [האם אתם תומכים בשליחת דוא"ל באמצעות API](#do-you-support-sending-email-with-api)
  * [האם אתם תומכים בקבלת דוא"ל באמצעות IMAP](#do-you-support-receiving-email-with-imap)
  * [האם אתם תומכים ב-POP3](#do-you-support-pop3)
  * [האם אתם תומכים בלוחות שנה (CalDAV)?](#do-you-support-calendars-caldav)
  * [האם אתם תומכים באנשי קשר (CardDAV)](#do-you-support-contacts-carddav)
  * [האם אתם תומכים בשליחת דוא"ל באמצעות SMTP](#do-you-support-sending-email-with-smtp)
  * [האם אתם תומכים ב-OpenPGP/MIME, הצפנה מקצה לקצה ("E2EE") ומדריך מפתחות אינטרנט ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [האם אתה תומך ב-MTA-STS](#do-you-support-mta-sts)
  * [האם אתם תומכים במפתחות וב-WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [האם אתם תומכים בשיטות עבודה מומלצות בדוא"ל](#do-you-support-email-best-practices)
  * [האם אתם תומכים ב-webhooks של bounce](#do-you-support-bounce-webhooks)
  * [האם אתם תומכים ב-webhooks](#do-you-support-webhooks)
  * [האם אתם תומכים בביטויים רגולריים או בביטויים רגולריים?](#do-you-support-regular-expressions-or-regex)
  * [מהן מגבלות ה-SMTP היוצא שלך](#what-are-your-outbound-smtp-limits)
  * [האם אני צריך אישור כדי להפעיל SMTP](#do-i-need-approval-to-enable-smtp)
  * [מהן הגדרות התצורה של שרת ה-SMTP שלך](#what-are-your-smtp-server-configuration-settings)
  * [מהן הגדרות התצורה של שרת ה-IMAP שלך](#what-are-your-imap-server-configuration-settings)
  * [מהן הגדרות התצורה של שרת ה-POP3 שלך](#what-are-your-pop3-server-configuration-settings)
  * [תצורת ממסר SMTP של Postfix](#postfix-smtp-relay-configuration)
* [בִּטָחוֹן](#security)
  * [טכניקות הקשחת שרתים מתקדמות](#advanced-server-hardening-techniques)
  * [האם יש לך הסמכות SOC 2 או ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [האם אתם משתמשים בהצפנת TLS להעברת דוא"ל](#do-you-use-tls-encryption-for-email-forwarding)
  * [האם אתם שומרים על כותרות אימות דוא"ל](#do-you-preserve-email-authentication-headers)
  * [האם אתם שומרים על כותרות דוא"ל מקוריות ומונעים זיופים?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [כיצד אתם מגנים מפני ספאם וניצול לרעה](#how-do-you-protect-against-spam-and-abuse)
  * [האם אתם מאחסנים תוכן דוא"ל בדיסק](#do-you-store-email-content-on-disk)
  * [האם תוכן דוא"ל יכול להיחשף במהלך קריסות מערכת](#can-email-content-be-exposed-during-system-crashes)
  * [למי יש גישה לתשתית הדוא"ל שלך](#who-has-access-to-your-email-infrastructure)
  * [אילו ספקי תשתית אתם משתמשים בהם](#what-infrastructure-providers-do-you-use)
  * [האם אתם מציעים הסכם עיבוד נתונים (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [כיצד אתם מטפלים בהודעות על פרצות נתונים](#how-do-you-handle-data-breach-notifications)
  * [האם אתם מציעים סביבת בדיקה](#do-you-offer-a-test-environment)
  * [האם אתם מספקים כלי ניטור והתרעה](#do-you-provide-monitoring-and-alerting-tools)
  * [כיצד מבטיחים זמינות גבוהה](#how-do-you-ensure-high-availability)
  * [האם אתם פועלים בהתאם לסעיף 889 של חוק הרשאות ההגנה הלאומית (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [פרטים טכניים ומערכתיים](#system-and-technical-details)
  * [האם אתם מאחסנים מיילים ואת תוכנם](#do-you-store-emails-and-their-contents)
  * [כיצד פועלת מערכת העברת הדוא"ל שלכם](#how-does-your-email-forwarding-system-work)
  * [איך מעבדים אימייל לצורך העברה](#how-do-you-process-an-email-for-forwarding)
  * [כיצד אתם מטפלים בבעיות משלוח דוא"ל](#how-do-you-handle-email-delivery-issues)
  * [איך אתם מטפלים בחסימה של כתובות ה-IP שלכם](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [מהן כתובות מנהל הדואר](#what-are-postmaster-addresses)
  * [מהן כתובות ללא מענה](#what-are-no-reply-addresses)
  * [מהן כתובות ה-IP של השרת שלך](#what-are-your-servers-ip-addresses)
  * [האם יש לך רשימת היתרים](#do-you-have-an-allowlist)
  * [אילו סיומות שם דומיין נמצאות ברשימת ההיתרים כברירת מחדל](#what-domain-name-extensions-are-allowlisted-by-default)
  * [מהם קריטריוני רשימת ההיתרים שלך](#what-is-your-allowlist-criteria)
  * [אילו סיומות שמות דומיין ניתן להשתמש בהן בחינם](#what-domain-name-extensions-can-be-used-for-free)
  * [האם יש לך רשימה אפורה?](#do-you-have-a-greylist)
  * [האם יש לך רשימת סירובים](#do-you-have-a-denylist)
  * [האם יש לך הגבלת תעריף](#do-you-have-rate-limiting)
  * [איך מגנים מפני פיזור לאחור](#how-do-you-protect-against-backscatter)
  * [מניעת החזרות של דואר זבל ידוע](#prevent-bounces-from-known-mail-from-spammers)
  * [מניעת קפיצות מיותרות כדי להגן מפני פיזור אחורי](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [איך מזהים טביעת אצבע של דוא"ל](#how-do-you-determine-an-email-fingerprint)
  * [האם ניתן להעביר אימיילים לפורטים אחרים מלבד 25 (למשל, אם ספק האינטרנט שלי חסם את פורט 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [האם זה תומך בסמל הפלוס + עבור כינויים ב-Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [האם זה תומך בתת-דומיינים](#does-it-support-sub-domains)
  * [האם זה מעביר את כותרות האימייל שלי?](#does-this-forward-my-emails-headers)
  * [האם זה נבדק היטב](#is-this-well-tested)
  * [האם אתם מעבירים הודעות וקודי תגובה של SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [כיצד מונעים ספאמרים ומבטיחים מוניטין טוב של העברת דוא"ל](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [כיצד מבצעים חיפושי DNS על שמות דומיין](#how-do-you-perform-dns-lookups-on-domain-names)
* [חשבון וחיוב](#account-and-billing)
  * [האם אתם מציעים אחריות להחזר כספי על תוכניות בתשלום?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [אם אני מחליף תוכניות, האם אתם מחלקים את ההפרש באופן יחסי ומחזירים אותו?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [האם אני יכול להשתמש בשירות העברת הדוא"ל הזה כשרת MX "חלופה" או "חלופה"?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [האם אני יכול להשבית כינויים ספציפיים](#can-i-disable-specific-aliases)
  * [האם ניתן להעביר מיילים למספר נמענים](#can-i-forward-emails-to-multiple-recipients)
  * [האם אוכל לקבל מספר נמענים גלובליים מסוג "capture all"](#can-i-have-multiple-global-catch-all-recipients)
  * [האם יש מגבלה מקסימלית על מספר כתובות הדוא"ל שאליהן אני יכול להעביר הודעות לפי כינוי](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [האם ניתן להעביר מיילים באופן רקורסיבי](#can-i-recursively-forward-emails)
  * [האם אנשים יכולים לבטל את הרישום שלי או לרשום את העברת הדוא"ל שלי ללא רשותי](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [איך זה בחינם](#how-is-it-free)
  * [מהו גודל האימייל המקסימלי המותר](#what-is-the-max-email-size-limit)
  * [האם אתם שומרים יומני אימיילים](#do-you-store-logs-of-emails)
  * [האם אתם מאחסנים יומני שגיאות](#do-you-store-error-logs)
  * [האם אתה קורא את האימיילים שלי](#do-you-read-my-emails)
  * [האם אני יכול "לשלוח דואר כ" ב-Gmail עם זה?](#can-i-send-mail-as-in-gmail-with-this)
  * [האם ניתן לשלוח דואר כ-"באאוטלוק" עם זה?](#can-i-send-mail-as-in-outlook-with-this)
  * [האם ניתן "לשלוח דואר כ" ב-Apple Mail וב-iCloud Mail בעזרת זה?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [האם אני יכול להעביר אימיילים ללא הגבלה עם זה](#can-i-forward-unlimited-emails-with-this)
  * [האם אתם מציעים דומיינים ללא הגבלה במחיר אחד](#do-you-offer-unlimited-domains-for-one-price)
  * [אילו אמצעי תשלום אתם מקבלים](#which-payment-methods-do-you-accept)
* [משאבים נוספים](#additional-resources)

## התחלה מהירה {#quick-start}

כדי להתחיל עם העברת דוא"ל:

1. **צור חשבון** ב-[forwardemail.net/register](https://forwardemail.net/register)

2. **הוסף ואמת את הדומיין שלך** תחת [החשבון שלי → דומיינים](/my-account/domains)

3. **הוספה והגדרה של כינויי דוא"ל/תיבות דואר** תחת [החשבון שלי → דומיינים](/my-account/domains) → כינויים

4. **בדוק את ההגדרה שלך** על ידי שליחת דוא"ל לאחד מהשמות הבדויים החדשים שלך

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## מבוא {#introduction}

### מהי דוא"ל עתידי {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email הוא **ספק שירותי דוא"ל מלא** ו**ספק אירוח דוא"ל עבור שמות דומיין מותאמים אישית**.

זהו השירות החינמי והפתוח היחיד, והוא מאפשר לך להשתמש בכתובות דוא"ל עם דומיין מותאמות אישית ללא המורכבות של הגדרה ותחזוקה של שרת דוא"ל משלך.

השירות שלנו מעביר אימיילים שנשלחים לדומיין המותאם אישית שלך לחשבון האימייל הקיים שלך - ואתה יכול אפילו להשתמש בנו כספק אירוח האימייל הייעודי שלך.

תכונות עיקריות של העברת דוא"ל:

* **דוא"ל דומיין מותאם אישית**: השתמש בכתובות דוא"ל מקצועיות עם שם הדומיין שלך
* **רמה חינמית**: העברת דוא"ל בסיסית ללא עלות
* **פרטיות משופרת**: איננו קוראים את הדוא"ל שלך או מוכרים את הנתונים שלך
* **קוד פתוח**: כל בסיס הקוד שלנו זמין ב-GitHub
* **תמיכה ב-SMTP, IMAP ו-POP3**: יכולות מלאות לשליחה וקבלה של דוא"ל
* **הצפנה מקצה לקצה**: תמיכה ב-OpenPGP/MIME
* **כינויים מותאמים אישית הכוללים**: צור כינויי דוא"ל ללא הגבלה

ניתן להשוות אותנו ליותר מ-56 ספקי שירותי דוא"ל אחרים ב-[דף השוואת הדוא"ל שלנו](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### מי משתמש בהעברת דוא"ל {#who-uses-forward-email}

אנו מספקים שירותי אירוח דוא"ל והעברת דוא"ל ליותר מ-500,000 דומיינים ולמשתמשים הבולטים הבאים:

| לָקוּחַ | מקרה בוחן |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| האקדמיה הימית של ארה"ב | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| קנוני | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| משחקי נטפליקס |  |
| קרן לינוקס | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| קרן PHP |  |
| רדיו פוקס ניוז |  |
| מכירות פרסומות של דיסני |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| אובונטו | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| לְשַׁחְרֵר | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| לובונטו | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| אוניברסיטת קיימברידג' | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| אוניברסיטת מרילנד | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| אוניברסיטת וושינגטון | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| אוניברסיטת טאפטס | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| מכללת סוורת'מור | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| ממשלת דרום אוסטרליה |  |
| ממשלת הרפובליקה הדומיניקנית |  |
| פליי.io |  |
| מלונות RCD |  |
| אייזק ז. שלוטר (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| דיוויד היינמאייר הנסון (רובי און ריילס) |  |

### מהי היסטוריית העברת דוא"ל {#what-is-forward-emails-history}

ניתן למצוא מידע נוסף על העברת דוא"ל ב-[דף אודות שלנו](/about).

### כמה מהיר השירות הזה {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

העברת דוא"ל שולחת הודעות עם עיכוב מינימלי, בדרך כלל תוך שניות מקבלתן.

מדדי ביצועים:

* **זמן אספקה ממוצע**: פחות מ-5-10 שניות מקבלה ועד העברה ([ראה את דף ניטור "TTI" של זמן הגעה לתיבת דואר נכנס](/tti))
* **זמן פעולה**: זמינות שירות של 99.9%+
* **תשתית גלובלית**: שרתים הממוקמים אסטרטגית לניתוב אופטימלי
* **התאמת קנה מידה אוטומטית**: המערכת שלנו מתרחבת בתקופות שיא של דוא"ל

אנו פועלים בזמן אמת, בניגוד לספקים אחרים אשר מסתמכים על תורים מושהים.

איננו כותבים לדיסק או מאחסנים יומני רישום – עם [למעט שגיאות](#do-you-store-error-logs) ו-[SMTP יוצא](#do-you-support-sending-email-with-smtp) (ראו את [מדיניות פרטיות](/privacy) שלנו).

הכל נעשה בזיכרון ו-[קוד המקור שלנו נמצא ב-GitHub](https://github.com/forwardemail).

## לקוחות דוא"ל {#email-clients}

### ת'אנדרבירד {#thunderbird}

1. צור כינוי חדש וצור סיסמה בלוח המחוונים של העברת דוא"ל
2. פתח את Thunderbird ועבור אל **עריכה ← הגדרות חשבון ← פעולות חשבון ← הוסף חשבון דוא"ל**
3. הזן את שמך, כתובת הדוא"ל להעברה והסיסמה
4. לחץ על **הגדרה ידנית** והזן:
* נכנס: IMAP, `imap.forwardemail.net`, יציאה 993, SSL/TLS
* יוצא: SMTP, `smtp.forwardemail.net`, יציאה 587, STARTTLS
5. לחץ על **סיום**

### מיקרוסופט אאוטלוק {#microsoft-outlook}

1. צור כינוי חדש וצור סיסמה בלוח המחוונים של העברת דוא"ל
2. עבור אל **קובץ ← הוסף חשבון**
3. הזן את כתובת הדוא"ל שלך להעברת דוא"ל ולחץ על **התחבר**
4. בחר **אפשרויות מתקדמות** ובחר **תן לי להגדיר את החשבון שלי באופן ידני**
5. בחר **IMAP** והזן:
* נכנס: `imap.forwardemail.net`, יציאה 993, SSL
* יוצא: `smtp.forwardemail.net`, יציאה 587, TLS
* שם משתמש: כתובת הדוא"ל המלאה שלך
* סיסמה: הסיסמה שנוצרה
6. לחץ על **התחבר**

### אפל מייל {#apple-mail}

1. צור כינוי חדש וצור סיסמה בלוח המחוונים של העברת דוא"ל
2. עבור אל **דואר ← העדפות ← חשבונות ← +**
3. בחר **חשבון דואר אחר**
4. הזן את שמך, כתובת הדוא"ל להעברה והסיסמה שלך
5. עבור הגדרות השרת, הזן:
* נכנס: `imap.forwardemail.net`
* יוצא: `smtp.forwardemail.net`
* שם משתמש: כתובת הדוא"ל המלאה שלך
* סיסמה: הסיסמה שנוצרה
6. לחץ על **התחברות**

### מכשירים ניידים {#mobile-devices}

עבור iOS:

1. עבור אל **הגדרות ← דואר ← חשבונות ← הוסף חשבון ← אחר**
2. הקש על **הוסף חשבון דואר** והזן את הפרטים שלך
3. עבור הגדרות השרת, השתמש באותן הגדרות IMAP ו-SMTP כמו לעיל

עבור אנדרואיד:

1. עבור אל **הגדרות ← חשבונות ← הוסף חשבון ← אישי (IMAP)**
2. הזן את כתובת הדוא"ל שלך להעברה ואת הסיסמה
3. עבור הגדרות השרת, השתמש באותן הגדרות IMAP ו-SMTP כמו לעיל

### כיצד לשלוח דואר כ- באמצעות Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">זמן התקנה משוער:</strong>
<span>פחות מ-10 דקות</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
תחילת העבודה:
</strong>
<span>
אם עקבת אחר ההוראות לעיל תחת <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">כיצד אוכל להתחיל ולהגדיר העברת דוא"ל</a>, תוכל להמשיך לקרוא למטה.
</span>
</div>

<div id="שלח-מייל-כתוכן">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">התנאים</a> שלנו, <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> שלנו, ואת <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">מגבלות ה-SMTP היוצא</a> שלנו & השימוש שלכם נחשב כהכרה והסכמה.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתה מפתח, עיין ב<a class="alert-link" href="/email-api#outbound-emails" target="_blank">מסמכי ה-API של הדוא"ל</a> שלנו.
</span>
</div>

1. עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i>הגדרות <i class="fa fa-angle-right"></i>תצורת SMTP יוצא ופעל לפי הוראות ההתקנה.

2. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (לדוגמה <code><hello@example.com></code>)

3. לחצו על <strong class="text-success"><i class="fa fa-key"></i>צור סיסמה</strong> ליד הכינוי החדש שנוצר. העתיקו ללוח שלכם ושמרו בצורה מאובטחת את הסיסמה שנוצרה המוצגת על המסך.

4. עבור אל [Gmail](https://gmail.com) ותחת [הגדרות <i class="fa fa-angle-right"></i> חשבונות וייבוא <i class="fa fa-angle-right"></i> שלח דואר כ](https://mail.google.com/mail/u/0/#settings/accounts), לחץ על "הוסף כתובת דוא"ל נוספת"

5. כאשר תתבקשו להזין "שם", הזינו את השם שברצונכם שהאימייל שלכם יוצג כ"מאת" (לדוגמה, "לינוס טורוואלדס").

6. כאשר תתבקשו להזין "כתובת דוא"ל", הזינו את כתובת הדוא"ל המלאה של כינוי שיצרתם תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (לדוגמה <code><hello@example.com></code>)

7. בטל את הסימון של "התייחס כאל שם בדוי"

8. לחצו על "השלב הבא" כדי להמשיך

9. כאשר תתבקש להזין "שרת SMTP", הזן <code>smtp.forwardemail.net</code> והשאר את הפורט כ- <code>587</code>

10. כאשר תתבקשו להזין "שם משתמש", הזינו את כתובת הדוא"ל המלאה של כינוי שיצרתם תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (לדוגמה <code><hello@example.com></code>)

11. כאשר תתבקש להזין "סיסמה", הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> בשלב 3 לעיל.

12. השאר את כפתור הבחירה מסומן עבור "חיבור מאובטח באמצעות TLS"

13. לחץ על "הוסף חשבון" כדי להמשיך

14. פתחו כרטיסייה חדשה ב-[Gmail](https://gmail.com) והמתנו להגעת אימייל האימות (תקבלו קוד אימות המאשר שאתם הבעלים של כתובת האימייל שאתם מנסים "לשלוח דואר בשם")

15. לאחר הגעתו, העתיקו והדביקו את קוד האימות כפי שקיבלת בשלב הקודם

16. לאחר שתסיים זאת, חזור לאימייל ולחץ על הקישור כדי "לאשר את הבקשה". סביר להניח שתצטרך לבצע את שלב זה ואת השלב הקודם כדי שהאימייל יוגדר כהלכה.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

</div>

### מהו המדריך החינמי הישן ל"שלח דואר כ" באמצעות Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">חשוב:</strong> מדריך חינמי זה הוצא משימוש החל ממאי 2023 מכיוון ש-<a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we תומך כעת ב-SMTP יוצא</a>. אם תשתמש במדריך שלהלן, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this יגרום לדוא"ל היוצא שלך</a> להראות "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" ב-Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">זמן התקנה משוער:</strong>
<span>פחות מ-10 דקות</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
תחילת העבודה:
</strong>
<span>
אם עקבת אחר ההוראות לעיל תחת <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">כיצד אוכל להתחיל ולהגדיר העברת דוא"ל</a>, תוכל להמשיך לקרוא למטה.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="כיצד לשלוח דואר כ-Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>"

<div id="מדריך-חינמי-ל-מורשה">

1. עליך להפעיל את [אימות דו-שלבי של Gmail][gmail-2fa] כדי שזה יעבוד. בקר ב- <https://www.google.com/landing/2step/> אם עדיין לא הפעלת אותו.

2. לאחר שאימות דו-שלבי מופעל (או אם כבר הפעלתם אותו), בקרו ב-<https://myaccount.google.com/apppasswords>.

3. כאשר תתבקשו "בחרו את האפליקציה והמכשיר שעבורם ברצונכם ליצור את סיסמת האפליקציה":
* בחרו "דואר" תחת התפריט הנפתח עבור "בחרו אפליקציה"
* בחרו "אחר" תחת התפריט הנפתח עבור "בחרו מכשיר"
* כאשר תתבקשו להזין טקסט, הזינו את כתובת הדוא"ל של הדומיין המותאם אישית שלכם שממנה אתם מעבירים (לדוגמה <code><hello@example.com></code> - זה יעזור לכם לעקוב אם אתם משתמשים בשירות זה עבור מספר חשבונות)

4. העתיקו את הסיסמה ללוח שלכם שנוצר אוטומטית
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-G Suite, בקרו בלוח הניהול שלכם <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">אפליקציות <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> עבור Gmail <i class="fa fa-angle-right"></i> הגדרות</a> וודאו שסמנו את האפשרות "אפשר למשתמשים לשלוח דואר דרך שרת SMTP חיצוני...". יהיה עיכוב מסוים עד להפעלת שינוי זה, לכן אנא המתינו מספר דקות.
</span>
</div>

5. עבור אל [Gmail](https://gmail.com) ותחת [הגדרות <i class="fa fa-angle-right"></i> חשבונות וייבוא <i class="fa fa-angle-right"></i> שלח דואר כ](https://mail.google.com/mail/u/0/#settings/accounts), לחץ על "הוסף כתובת דוא"ל נוספת"

6. כאשר תתבקשו להזין "שם", הזינו את השם שברצונכם שהאימייל שלכם יוצג כ"מאת" (לדוגמה, "לינוס טורוואלדס")

7. כאשר תתבקשו להזין "כתובת דוא"ל", הזינו את כתובת הדוא"ל עם הדומיין המותאם אישית בו השתמשתם למעלה (לדוגמה <code><hello@example.com></code>)

8. בטל את הסימון של "התייחס כאל שם בדוי"

9. לחץ על "השלב הבא" כדי להמשיך

10. כאשר תתבקש להזין "שרת SMTP", הזן <code>smtp.gmail.com</code> והשאר את הפורט כ- <code>587</code>

11. כאשר תתבקשו להזין "שם משתמש", הזינו את החלק של כתובת ה-Gmail שלכם ללא החלק <span>gmail.com</span> (לדוגמה, רק "משתמש" אם כתובת הדוא"ל שלי היא <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם החלק של "שם משתמש" מולא אוטומטית, <u><strong>תצטרכו לשנות זאת</strong></u> לחלק של שם המשתמש בכתובת ה-Gmail שלכם במקום זאת.
</span>
</div>

12. כאשר תתבקשו להזין "סיסמה", הדבקו מהלוח את הסיסמה שיצרתם בשלב 2 לעיל.

13. השאר את כפתור הבחירה מסומן עבור "חיבור מאובטח באמצעות TLS"

14. לחץ על "הוסף חשבון" כדי להמשיך

15. פתחו כרטיסייה חדשה ב-[Gmail](https://gmail.com) והמתנו להגעת אימייל האימות שלכם (תקבלו קוד אימות המאשר שאתם הבעלים של כתובת האימייל שאתם מנסים "לשלוח דואר בשם")

16. לאחר הגעתו, העתיקו והדביקו את קוד האימות כפי שקיבלת בשלב הקודם

17. לאחר שתסיים זאת, חזור לאימייל ולחץ על הקישור כדי "לאשר את הבקשה". סביר להניח שתצטרך לבצע את שלב זה ואת השלב הקודם כדי שהאימייל יוגדר כהלכה.

</div>

### הגדרות ניתוב מתקדמות של Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">זמן התקנה משוער:</strong> <span>15-30 דקות</span>
</div>

אם ברצונך להגדיר ניתוב מתקדם ב-Gmail כך שכינויים שאינם תואמים לתיבת דואר יעבירו לבורסות הדואר של Forward Email, בצע את השלבים הבאים:

1. התחברו למסוף ניהול המנהלים של גוגל שלכם בכתובת [admin.google.com](https://admin.google.com)
2. עברו אל **אפליקציות ← Google Workspace ← Gmail ← מסלול**
3. לחצו על **הוספת מסלול** והגדירו את ההגדרות הבאות:

**הגדרות נמען יחיד:**

* בחר "שנה נמען מעטפה" והזן את כתובת ה-Gmail הראשית שלך
* סמן את "הוסף כותרת X-Gm-Original-To עם הנמען המקורי"

**דפוסי נמען מעטפה:**

* הוסף תבנית שתואמת את כל תיבות הדואר שאינן קיימות (לדוגמה, `.*@yourdomain.com`)

**הגדרות שרת דוא"ל:**

* בחר "נתב למארח" והזן `mx1.forwardemail.net` כשרת הראשי
* הוסף `mx2.forwardemail.net` כשרת הגיבוי
* הגדר פורט ל-25
* בחר "דרוש TLS" לצורך אבטחה

4. לחצו על **שמור** כדי ליצור את המסלול

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
תצורה זו תעבוד רק עבור חשבונות Google Workspace עם דומיינים מותאמים אישית, לא עבור חשבונות Gmail רגילים.
</span>
</div>

### תצורת ניתוב מתקדמת של Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">זמן התקנה משוער:</strong> <span>15-30 דקות</span>
</div>

עבור משתמשי Microsoft 365 (לשעבר Office 365) שרוצים להגדיר ניתוב מתקדם כך שכינויים שאינם תואמים לתיבת דואר יעבירו להחלפות דואר של Forward Email:

1. התחבר למרכז הניהול של Microsoft 365 בכתובת [admin.microsoft.com](https://admin.microsoft.com)
2. עבור אל **Exchange ← זרימת דואר ← כללים**
3. לחץ על **הוסף כלל** ובחר **צור כלל חדש**
4. תן שם לכלל שלך (לדוגמה, "העבר תיבות דואר שאינן קיימות להעברת דואר אלקטרוני")
5. תחת **החל כלל זה אם**, בחר:
* "כתובת הנמען תואמת ל..."
* הזן תבנית התואמת את כל הכתובות בדומיין שלך (לדוגמה, `*@yourdomain.com`)
6. תחת **בצע את הפעולות הבאות**, בחר:
* "הפנה את ההודעה אל..."
* בחר "שרת הדואר הבא"
* הזן `mx1.forwardemail.net` ויציאה 25
* הוסף `mx2.forwardemail.net` כשרת גיבוי
7. תחת **למעט אם**, בחר:
* "הנמען הוא..."
* הוסף את כל תיבות הדואר הקיימות שלך שלא אמורות להיות הועבר
8. הגדר את עדיפות הכלל כדי להבטיח שהוא יפעל לאחר כללי זרימת דואר אחרים
9. לחץ על **שמור** כדי להפעיל את הכלל

## פתרון בעיות {#troubleshooting}

### למה אני לא מקבל את הודעות הדוא"ל שלי לבדיקה {#why-am-i-not-receiving-my-test-emails}

אם אתם שולחים לעצמכם אימייל ניסיון, ייתכן שהוא לא יופיע בתיבת הדואר הנכנס שלכם מכיוון שיש לו את אותה כותרת "Message-ID".

זוהי בעיה ידועה, והיא משפיעה גם על שירותים כמו Gmail. <a href="https://support.google.com/a/answer/1703601">Here" היא התשובה הרשמית של Gmail בנוגע לבעיה זו</a>.

אם תמשיך להיתקל בבעיות, סביר להניח שמדובר בבעיה בהתפשטות DNS. תצטרך להמתין עוד קצת ולנסות שוב (או לנסות להגדיר ערך TTL נמוך יותר ברשומות ה-<strong class="notranslate">TXT</strong> שלך).

**עדיין נתקלים בבעיות?** אנא <a href="/help">צרו איתנו קשר</a> כדי שנוכל לעזור לחקור את הבעיה ולמצוא פתרון מהיר.

### כיצד אוכל להגדיר את תוכנת הדוא"ל שלי לעבודה עם העברת דוא"ל {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
השירות שלנו עובד עם תוכנות דוא"ל פופולריות כגון:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">אפל</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">חלונות</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> אנדרואיד&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> לינוקס&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> שולחן עבודה</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> מוזילה פיירפוקס</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">ספארי</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i>גוגל כרום</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i>טרמינל</a></li>
</ul>
</div>

<div class="alert alert-primary">
שם המשתמש שלך הוא כתובת הדוא"ל של הכינוי שלך והסיסמה היא מ-<strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> ("סיסמה רגילה").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אם אתם משתמשים ב-Thunderbird, ודאו ש"אבטחת החיבור" מוגדרת ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"סיסמה רגילה".</span>
</div>

| סוּג | שם מארח | פּרוֹטוֹקוֹל | נמלים |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **מועדף** | `993` ו-`2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **מועדף** או TLS (STARTTLS) | `465` ו-`2465` עבור SSL/TLS (או) `587`, `2587`, `2525`, ו-`25` עבור TLS (STARTTLS) |

### מדוע האימיילים שלי מגיעים לספאם ולדואר זבל וכיצד אוכל לבדוק את מוניטין הדומיין שלי {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

סעיף זה ידריך אותך אם הדואר היוצא שלך משתמש בשרתי ה-SMTP שלנו (לדוגמה, `smtp.forwardemail.net`) (או מועבר דרך `mx1.forwardemail.net` או `mx2.forwardemail.net`) והוא מועבר לתיקיית הספאם או הדואר הזבל של הנמענים.

אנו עוקבים באופן שוטף אחר [כתובות IP](#what-are-your-servers-ip-addresses) שלנו מול [כל רשימות דחיית ה-DNS המכובדות](#how-do-you-handle-your-ip-addresses-becoming-blocked), **לכן סביר להניח שמדובר בבעיה ספציפית למוניטין של הדומיין**.

מיילים יכולים להגיע לתיקיות ספאם מכמה סיבות:

1. **אימות חסר**: הגדר רשומות [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ו-[DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **מוניטין של דומיין**: לדומיינים חדשים יש לעיתים קרובות מוניטין ניטרלי עד שהם יוצרים היסטוריית שליחה.

3. **גורמים מעוררי תוכן**: מילים או ביטויים מסוימים עלולים להפעיל מסנני ספאם.

4. **דפוסי שליחה**: עלייה פתאומית בנפח הדוא"ל יכולה להיראות חשודה.

ניתן לנסות להשתמש באחד או יותר מהכלים הבאים כדי לבדוק את המוניטין והקטגוריזציה של הדומיין שלך:

| שם הכלי | URL | סוּג |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| משוב על סיווג דומיינים ב-Cloudflare | <https://radar.cloudflare.com/domains/feedback> | סיווג |
| בודק IP ודומיין של Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center> | מוֹנֵיטִין |
| חיפוש IP ומוניטין של דומיין של Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| בדיקת רשימה שחורה של ארגז הכלים של MX | <https://mxtoolbox.com/blacklists.aspx> | רשימה שחורה |
| Google Postmaster Tools | <https://www.gmail.com/postmaster/> | מוֹנֵיטִין |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | מוֹנֵיטִין |
| בדיקת רשימה שחורה של MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| ציון השולח | <https://senderscore.org/act/blocklist-remover/> | מוֹנֵיטִין |
| הערכה | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| הסרת IP של Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | הֲסָרָה |
| הסרת IP של Cloudmark | <https://csi.cloudmark.com/en/reset/> | הֲסָרָה |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| הסרת IP של Microsoft Outlook ו-Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | הֲסָרָה |
| רמות 1, 2 ו-3 של UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| backscatterer.org של UCEPROTECT | <https://www.backscatterer.org/> | הגנה מפני פיזור אחורי |
| ה-whitelisted.org של UCEPROTECT | <https://www.whitelisted.org/> (בתשלום) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | הֲסָרָה |
| AOL/Verizon (לדוגמה `[IPTS04]`) | <https://senders.yahooinc.com/> | הֲסָרָה |
| קוקס תקשורת | `unblock.request@cox.net` | הֲסָרָה |
| t-online.de (גרמנית/T-Mobile) | `tobr@rx.t-online.de` | הֲסָרָה |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### מה עליי לעשות אם אני מקבל הודעות דואר זבל {#what-should-i-do-if-i-receive-spam-emails}

עליך לבטל את המנוי שלך מרשימת התפוצה (אם אפשר) ולחסום את השולח.

אנא אל תדווחו על ההודעה כספאם, אלא העבירו אותה למערכת למניעת ניצול לרעה שאורגנה באופן ידני ומתמקדת בפרטיות.

כתובת הדוא"ל אליה יש להעביר דואר זבל היא: <abuse@forwardemail.net>

### מדוע הודעות הדוא"ל לניסיון שנשלחו אליי ב-Gmail מוצגות כ"חשודות" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

אם אתם רואים את הודעת השגיאה הזו ב-Gmail כשאתם שולחים לעצמכם הודעת בדיקה, או כשאדם שאתם שולחים לו אימייל עם הכינוי שלכם רואה אימייל מכם בפעם הראשונה, אז **אל דאגה** – שכן זוהי תכונת בטיחות מובנית של Gmail.

ניתן פשוט ללחוץ על "נראה בטוח". לדוגמה, אם הייתם שולחים הודעת ניסיון באמצעות התכונה "שלח דואר כ" (למישהו אחר), הוא לא יראה את ההודעה הזו.

עם זאת, אם הם רואים את ההודעה הזו, זה בגלל שהם היו רגילים לראות את האימיילים שלך מגיעים מ-<john@gmail.com> במקום מ-<john@customdomain.com> (רק דוגמה). ג'ימייל יתריע בפני המשתמשים רק כדי לוודא שהדברים בטוחים למקרה שאין פתרון עוקף.

### האם ניתן להסיר את ה-via forwardemail dot net ב-Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

נושא זה קשור ל-[בעיה מוכרת ב-Gmail שבה מידע נוסף מופיע ליד שם השולח](https://support.google.com/mail/answer/1311182).

החל ממאי 2023 אנו תומכים בשליחת דוא"ל עם SMTP כתוסף לכל המשתמשים בתשלום - מה שאומר שניתן להסיר את <span class="notranslate">via forwardemail dot net</span> ב-Gmail.

שימו לב שנושא שאלות נפוצות זה מיועד ספציפית למשתמשים בתכונה [איך לשלוח דואר כ-"דרך ג'ימייל"](#how-to-send-mail-as-using-gmail).

אנא עיין בסעיף [האם אתם תומכים בשליחת דוא"ל באמצעות SMTP](#do-you-support-sending-email-with-smtp) לקבלת הוראות תצורה.

## ניהול נתונים {#data-management}

### היכן ממוקמים השרתים שלך {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

השרתים שלנו ממוקמים בעיקר בדנוור, קולורדו – ראה <https://forwardemail.net/ips> לרשימה המלאה של כתובות ה-IP שלנו.

באפשרותך ללמוד על מעבדי המשנה שלנו בדפים [GDPR](/gdpr), [DPA](/dpa) ו- [פְּרָטִיוּת](/privacy) שלנו.

### כיצד אוכל לייצא ולגבות את תיבת הדואר שלי {#how-do-i-export-and-backup-my-mailbox}

בכל עת תוכל לייצא את תיבות הדואר שלך בפורמטים [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), או [SQLite](https://en.wikipedia.org/wiki/SQLite) מוצפנים.

עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i>כינויים <i class="fa fa-angle-right"></i> הורד גיבוי ובחר את סוג פורמט הייצוא המועדף עליך.

יישלח אליך בדוא"ל קישור להורדת הייצוא לאחר השלמתו.

שים לב שקישור הורדת הייצוא הזה פג תוקף לאחר 4 שעות מסיבות אבטחה.

אם עליך לבדוק את פורמטי ה-EML או ה-Mbox שיוצאו, כלי קוד פתוח אלה עשויים להיות שימושיים:

| שֵׁם | פוּרמָט | פּלַטפוֹרמָה | כתובת אתר של גיטהאב |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer | Mbox | חלונות | <https://github.com/ename/mboxviewer> |
| mbox-web-viewer | Mbox | כל הפלטפורמות | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | חלונות | <https://github.com/ayamadori/EmlReader> |
| מציג אימיילים | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader | EML | כל הפלטפורמות | <https://github.com/s0ph1e/eml-reader> |

בנוסף, אם עליך להמיר קובץ Mbox לקובץ EML, תוכל להשתמש ב- <https://github.com/noelmartinon/mboxzilla>.

### כיצד אוכל לייבא ולהעביר את תיבת הדואר הקיימת שלי {#how-do-i-import-and-migrate-my-existing-mailbox}

ניתן לייבא בקלות את האימייל שלך ל"העברת אימייל" (למשל, באמצעות [Thunderbird](https://www.thunderbird.net)) לפי ההוראות הבאות:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
עליך לבצע את כל השלבים הבאים כדי לייבא את האימייל הקיים שלך.
</span>
</div>

1. ייצוא האימייל שלך מספק האימייל הקיים שלך:

| ספק דוא"ל | פורמט ייצוא | הוראות ייצוא |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| הַשׁקָפָה | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">טיפ:</strong> <span>אם אתם משתמשים ב-Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">פורמט ייצוא PST</a>), תוכלו פשוט לבצע את ההוראות תחת "אחר" למטה. עם זאת, סיפקנו קישורים למטה להמרת PST לפורמט MBOX/EML בהתבסס על מערכת ההפעלה שלך:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba עבור Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst עבור Windows cygwin</a> – (לדוגמה, <code>readpst -u -o $OUT_DIR $IN_DIR</code> מחליף את <code>$OUT_DIR</code> ו-<code>$IN_DIR</code> בספריית הפלט ובספריית הקלט). נתיבים בהתאמה).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst עבור אובונטו/לינוקס</a> – (לדוגמה, <code>sudo apt-get install readpst</code> ולאחר מכן <code>readpst -u -o $OUT_DIR $IN_DIR</code>, תוך החלפת <code>$OUT_DIR</code> ו-<code>$IN_DIR</code> בנתיבי ספריית הפלט ובנתיבי ספריית הקלט בהתאמה).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst עבור macOS (דרך brew)</a> – (לדוגמה, <code>brew install libpst</code> ולאחר מכן <code>readpst -u -o $OUT_DIR $IN_DIR</code>, תוך החלפת <code>$OUT_DIR</code> ו- <code>$IN_DIR</code> עם נתיבי ספריית הפלט וספריית הקלט בהתאמה).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">ממיר PST עבור Windows (GitHub)</a></li></ul><br /></span></div> |
| אפל מייל | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| דואר פרוטון | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| טוטנוטה | EML | <https://github.com/crepererum-oss/tatutanatata> |
| לַחשׁוֹב | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| זוהו | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| אַחֵר | [Use Thunderbird](https://www.thunderbird.net) | הגדר את חשבון הדוא"ל הקיים שלך ב-Thunderbird ולאחר מכן השתמש בתוסף [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) כדי לייצא ולייבא את הדוא"ל שלך. **ייתכן שתוכל גם פשוט להעתיק/להדביק או לגרור/לשחרר דוא"ל בין חשבון אחד למשנהו.** |

2. הורד, התקן ופתח את [Thunderbird](https://www.thunderbird.net).

3. צור חשבון חדש באמצעות כתובת הדוא"ל המלאה של הכינוי שלך (לדוגמה <code><you@yourdomain.com></code>) והסיסמה שיצרת. <strong>אם עדיין אין לך סיסמה שיצרת, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">עיין בהוראות ההתקנה שלנו</a></strong>.

4. הורד והתקן את התוסף [ייבוא וייצוא כלים של](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) של Thunderbird.

5. צור תיקייה מקומית חדשה ב-Thunderbird, ולאחר מכן לחץ לחיצה ימנית עליה ← בחר באפשרות `ImportExportTools NG` → בחר `Import mbox file` (לפורמט ייצוא MBOX) – או – `Import messages` / `Import all messages from a directory` (לפורמט ייצוא EML).

6. גרור/שחרר מהתיקייה המקומית לתיקיית IMAP חדשה (או קיימת) ב-Thunderbird שאליה ברצונך להעלות הודעות באחסון IMAP עם השירות שלנו. פעולה זו תבטיח שהן יגובו באופן מקוון עם אחסון SQLite מוצפן שלנו.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
אם אינך בטוח כיצד לייבא לתוך Thunderbird, תוכל לעיין בהוראות הרשמיות בכתובות <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> ו- <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
לאחר שתשלים את תהליך הייצוא והייבוא, ייתכן שתרצה גם להפעיל העברה בחשבון הדוא"ל הקיים שלך ולהגדיר מענה אוטומטי שיודיע לשולחים שיש לך כתובת דוא"ל חדשה (לדוגמה, אם השתמשת בעבר ב-Gmail וכעת אתה משתמש בדוא"ל עם שם הדומיין המותאם אישית שלך).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

### האם אתם תומכים באירוח עצמי {#do-you-support-self-hosting}

כן, החל ממרץ 2025, אנו תומכים באפשרות של אירוח עצמי. קראו את הבלוג [כָּאן](https://forwardemail.net/blog/docs/self-hosted-solution). בדקו את [מדריך באירוח עצמי](https://forwardemail.net/self-hosted) כדי להתחיל. ולמי שמעוניין בגרסה מפורטת יותר שלב אחר שלב, עיינו במדריכים שלנו המבוססים על [אובונטו](https://forwardemail.net/guides/selfhosted-on-ubuntu) או [דביאן](https://forwardemail.net/guides/selfhosted-on-debian).

## הגדרת דוא"ל {#email-configuration}

### איך מתחילים ומגדירים העברת דוא"ל {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">זמן התקנה משוער:</strong>
<span>פחות מ-10 דקות</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
תחילת העבודה:
</strong>
<span>
קרא בעיון ובצע את שלבים 1 עד 8 המפורטים להלן. הקפד להחליף את כתובת הדוא"ל <code>user@gmail.com</code> בכתובת הדוא"ל שאליה ברצונך להעביר הודעות דוא"ל (אם היא עדיין לא מדויקת). באופן דומה, הקפד להחליף את <code>example.com</code> בשם הדומיין המותאם אישית שלך (אם הוא עדיין לא מדויק).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">אם כבר רשמת את שם הדומיין שלך איפשהו, עליך לדלג לחלוטין על שלב זה ולעבור לשלב השני! אחרת תוכל <a href="/domain-registration" rel="noopener noreferrer">ללחוץ כאן כדי לרשום את שם הדומיין שלך</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
האם אתה זוכר היכן רשמת את הדומיין שלך? לאחר שתזכור זאת, פעל לפי ההוראות הבאות:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
עליך לפתוח כרטיסייה חדשה ולהיכנס לרשם הדומיינים שלך. תוכל ללחוץ בקלות על "רשם הדומיינים" שלך למטה כדי לעשות זאת באופן אוטומטי. בכרטיסייה החדשה הזו, עליך לנווט לדף ניהול ה-DNS אצל הרשם שלך - וסיפקנו את שלבי הניווט שלב אחר שלב למטה תחת העמודה "שלבים להגדרה". לאחר שניווטת לדף זה בכרטיסייה החדשה, תוכל לחזור לכרטיסייה זו ולהמשיך לשלב שלוש למטה.
<strong class="font-weight-bold">אל תסגור את הכרטיסייה הפתוחה עדיין; תזדקק לה לשלבים עתידיים!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>רשם</th> <th>שלבים להגדרה</th>
</tr> </thead> <tbody> <tr> <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> מרכז דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> עריכת הגדרות DNS</td>
</tr> <tr> <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon מסלול 53</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> אזורים מתארחים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> השרתים שלי <i class="fa fa-angle-right"></i> ניהול דומיינים <i class="fa fa-angle-right"></i> מנהל DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ל-ROCK: התחברות <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> (לחץ על סמל ▼ שליד כדי לנהל) <i class="fa fa-angle-right"></i> DNS
<br />
לגרסה מדור קודם: התחברות <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> עורך אזורים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS בקלות</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> ניהול</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> רשת <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> (בחר הדומיין שלך) <i class="fa fa-angle-right"></i> עוד <i class="fa fa-angle-right"></i> ניהול דומיין</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> בתצוגת כרטיס, לחץ על ניהול בדומיין שלך <i class="fa fa-angle-right"></i> בתצוגת רשימה, לחץ על סמל גלגל השיניים <i class="fa fa-angle-right"></i> DNS ושרתי שמות <i class="fa fa-angle-right"></i> רשומות DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> צפייה</a>
</td>
<td>התחברות <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> ניהול <i class="fa fa-angle-right"></i> (לחץ על סמל גלגל השיניים) <i class="fa fa-angle-right"></i> לחץ על DNS ושרתי שמות בתפריט השמאלי</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> פאנל <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> ניהול דומיינים <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> סקירה כללית <i class="fa fa-angle-right"></i> ניהול <i class="fa fa-angle-right"></i> עורך פשוט <i class="fa fa-angle-right"></i> רשומות</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> ניהול <i class="fa fa-angle-right"></i> עריכת האזור</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> צפייה</a>
</td>
<td>התחברות <i class="fa fa-angle-right"></i> ניהול הדומיינים שלי <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> ניהול DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google דומיינים</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> צפייה</a>
</td>
<td>התחברות <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> הגדרת DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i>צפייה</a>
</td>
<td>התחברות <i class="fa fa-angle-right"></i> רשימת דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> נהל <i class="fa fa-angle-right"></i> DNS מתקדם</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> הגדרת DNS של Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network פתרונות</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> מנהל חשבון <i class="fa fa-angle-right"></i> שמות הדומיין שלי <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> נהל <i class="fa fa-angle-right"></i> שנה היכן הדומיין מצביע <i class="fa fa-angle-right"></i> DNS מתקדם</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> צפה</a>
</td>
<td>התחברות <i class="fa fa-angle-right"></i> דומיינים מנוהלים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> DNS הגדרות</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> תפריט ראשי <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i>
הגדרות מתקדמות <i class="fa fa-angle-right"></i> רשומות מותאמות אישית</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's עכשיו</a></td>
<td>שימוש בממשק שורת פקודה של "now" <i class="fa fa-angle-right"></i> <code>now dns הוסף [דומיין] '@' MX [ערך-רשומה] [עדיפות]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> דף דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> דף דומיינים <i class="fa fa-angle-right"></i> (לחץ על סמל <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> בחר ניהול רשומות DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>התחברות <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> הדומיינים שלי</td>
</tr>
<tr>
<td>אחר</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">חשוב:</strong> לא רואה את שם הרשם שלך רשום כאן? פשוט חפש באינטרנט "כיצד לשנות רשומות DNS ב-$REGISTRAR" (החלפת $REGISTRAR בשם הרשם שלך &ndash; לדוגמה "כיצד לשנות רשומות DNS ב-GoDaddy" אם אתם משתמשים ב-GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">באמצעות דף ניהול ה-DNS של הרשם שלכם (הכרטיסייה השנייה שפתחתם), הגדר את רשומות ה-"MX" הבאות:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
שימו לב שלא אמורות להיות רשומות MX אחרות. שתי הרשומות המוצגות להלן חייבות להתקיים. ודאו שאין שגיאות כתיב; וששני הרשומות mx1 ו-mx2 מאויתות נכון. אם כבר היו רשומות MX שקיימות, אנא מחקו אותן לחלוטין.
ערך ה-"TTL" אינו חייב להיות 3600, הוא יכול להיות ערך נמוך או גבוה יותר במידת הצורך.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>עדיפות</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td>MX</td> <td>0</td> <td><code>mx1.forwardemail.net</code></td> </tr> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td>
<td>MX</td> <td>0</td> <td><code>mx2.forwardemail.net</code></td> </tr> </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">באמצעות דף ניהול ה-DNS של הרשם שלך (הכרטיסייה השנייה שפתחת), הגדר את רשומת ה-<strong class="notranslate">TXT</strong> הבאה:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם בתוכנית בתשלום, עליכם לדלג לחלוטין על שלב זה ולעבור לשלב חמש! אם אינכם בתוכנית בתשלום, הכתובות שהועברו אליכם יהיו ניתנות לחיפוש באופן ציבורי - עברו אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> ושדרגו את הדומיין שלכם לתוכנית בתשלום אם תרצו. אם תרצו ללמוד עוד על תוכניות בתשלום, עיינו בדף <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">התמחור</a> שלנו. אחרת, תוכלו להמשיך לבחור שילוב אחד או יותר מאפשרות א' עד אפשרות ו' המפורטים להלן. </span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות א':
</strong>
<span>
אם אתם מעבירים את כל האימיילים מהדומיין שלכם, (לדוגמה "all@example.com", "hello@example.com", וכו') לכתובת ספציפית "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=user@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
ודאו שאתם מחליפים את הערכים לעיל בעמודה "ערך" בכתובת הדוא"ל שלכם. ערך ה-"TTL" אינו חייב להיות 3600, הוא יכול להיות ערך נמוך או גבוה יותר במידת הצורך. ערך TTL נמוך יותר יבטיח שכל שינוי עתידי שבוצע ברשומות ה-DNS שלכם יופץ ברחבי האינטרנט מהר יותר - חשבו על זה כמשך הזמן שבו הן יישמרו במטמון (בשניות). אתם יכולים ללמוד עוד על <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL בוויקיפדיה</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות ב':
</strong>
<span>
אם אתם צריכים להעביר רק כתובת דוא"ל אחת (לדוגמה, <code>hello@example.com</code> אל <code>user@gmail.com</code>; פעולה זו תעביר גם את "hello+test@example.com" אל "user+test@gmail.com" באופן אוטומטי):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות ג':
</strong>
<span>
אם אתם מעבירים מספר הודעות דוא"ל, מומלץ להפריד ביניהן באמצעות פסיק:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות ד':
</strong>
<span>
ניתן להגדיר מספר בלתי מוגבל של הודעות דוא"ל להעברת דוא"ל - רק ודאו שלא תעטפו יותר מ-255 תווים בשורה אחת ותתחילו כל שורה ב-"forward-email=". דוגמה לכך מוצגת להלן:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td>
<td class="notranslate">טקסט</td> <td> <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">טקסט</td> <td> <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">טקסט</td> <td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
</td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות ה':
</strong>
<span>
ניתן גם לציין שם דומיין ברשומת ה-<strong class="notranslate">TXT</strong> שלך כדי לקבל העברה גלובלית של כינויים (לדוגמה, "user@example.com" יועבר אל "user@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=example.net</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות ו':
</strong>
<span>
ניתן אפילו להשתמש ב-webhooks ככינוי גלובלי או אישי להעברת אימיילים. ראה את הדוגמה והסעיף המלא בנושא webhooks שכותרתו <a href="#do-you-support-webhooks" class="alert-link">האם אתם תומכים ב-webhooks</a> למטה.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
אפשרות G:
</strong>
<span>
ניתן אפילו להשתמש בביטויים רגולריים ("regex") להתאמת כינויים ולטיפול בהחלפות להעברת מיילים. ראה את הדוגמאות ואת הסעיף המלא על regex שכותרתו <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">האם אתה תומך בביטויים רגולריים או ב-regex</a> למטה.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>זקוקים לביטוי רגולרי מתקדם עם החלפה?</strong> עיינו בדוגמאות ובסעיף המלא בנושא ביטוי רגולרי שכותרתו <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">האם אתם תומכים בביטויים רגולריים או בביטויים רגולריים</a> למטה.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה פשוטה:</strong> אם אני רוצה שכל האימיילים שמגיעים ל-`linus@example.com` או `torvalds@example.com` יועברו ל-`user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
כללי העברה מסוג catch-all יכולים להיחשב גם כ"fallthrough".
משמעות הדבר היא שהודעות דוא"ל נכנסות התואמות לפחות כלל העברה ספציפי אחד ישמשו במקום כלל ההעברה הכללי.
כללים ספציפיים כוללים כתובות דוא"ל וביטויים רגולריים.
<br /><br />
לדוגמה:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
הודעות דוא"ל שנשלחו אל <code>hello@example.com</code> **לא** יועברו אל <code>second@gmail.com</code> (catch-all) עם תצורה זו, ובמקום זאת יועברו רק אל <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">באמצעות דף ניהול ה-DNS של הרשם שלך (הכרטיסייה השנייה שפתחת), הגדר בנוסף את רשומת ה-<strong class="notranslate">TXT</strong> הבאה:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-Gmail (לדוגמה, Send Mail As) או ב-G Suite, תצטרכו להוסיף <code>include:_spf.google.com</code> לערך שלמעלה, לדוגמה:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
אם כבר יש לכם שורה דומה עם "v=spf1", תצטרכו להוסיף <code>include:spf.forwardemail.net</code> ממש לפני כל רשומה קיימת של "include:host.com" ולפני "-all" באותה שורה, לדוגמה:
<br /><br />
<code>v=spf1 ו- include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
שימו לב שיש הבדל בין "-all" ל-"~all". ה-"-" מציין שבדיקת SPF אמורה להיכשל אם היא אינה תואמת, ו-"~" מציין שבדיקת SPF אמורה להיכשל ב-SOFTFAIL. אנו ממליצים להשתמש בגישת "-all" כדי למנוע זיוף דומיין.
<br /><br />
ייתכן שתצטרכו גם לכלול את רשומת ה-SPF עבור כל מארח שממנו אתם שולחים דואר (לדוגמה, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">אמת את רשומות ה-DNS שלך באמצעות הכלי "אימות רשומות" הזמין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרת.

שלח אימייל ניסיון כדי לאשר שזה עובד. שים לב שייתכן שיחלוף זמן מה עד שרשומות ה-DNS שלך יתפשטו.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
</span>
אם אינך מקבל/ת הודעות דוא"ל לניסיון, או מקבל/ת הודעה דוא"ל לניסיון שאומרת "היזהר/י עם הודעה זו", עיין/י בתשובות ל-<a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">מדוע איני מקבל/ת את הודעות הדוא"ל לניסיון</a> ו-<a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">מדוע הודעות הדוא"ל לניסיון שנשלחו אליי ב-Gmail מוצגות כ"חשודות"</a> בהתאמה.
</div>

אם ברצונך "לשלוח דואר כ" מ-Gmail, תצטרך <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">לצפות בסרטון זה</a></strong>, או לבצע את השלבים המופיעים תחת <a href="#how-to-send-mail-as-using-gmail">How לשליחת דואר כ"באמצעות Gmail</a> להלן.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
תוספות אופציונליות מפורטות להלן. שימו לב שתוספות אלו הן אופציונליות לחלוטין וייתכן שאינן נחוצות. רצינו לפחות לספק לכם מידע נוסף במידת הצורך.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
תוסף אופציונלי:
</strong>
<span>
אם אתם משתמשים בתכונה <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How כדי לשלוח דואר כ- באמצעות Gmail</a>, ייתכן שתרצו להוסיף את עצמכם לרשימת היתרים. עיינו ב<a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">הוראות אלה של Gmail</a> בנושא זה.
</span>
</div>

### האם ניתן להשתמש במספר בורסות MX ושרתים לצורך העברה מתקדמת {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

כן, אבל **צריכה להיות רק בורסת MX אחת רשומה ברשומות ה-DNS שלך**.

אל תנסה להשתמש ב-"Priority" כדרך להגדרת מספר בורסות MX.

במקום זאת, עליך להגדיר את בורסת ה-MX הקיימת שלך כך שתעביר דואר עבור כל הכינויים שאינם תואמים לבורסות השירות שלנו (`mx1.forwardemail.net` ו/או `mx2.forwardemail.net`).

אם אתם משתמשים ב-Google Workspace וברצונכם להעביר את כל הכינויים שאינם תואמים לשירות שלנו, עיינו ב-<https://support.google.com/a/answer/6297084>.

אם אתם משתמשים ב-Microsoft 365 (Outlook) וברצונכם להעביר את כל הכינויים שאינם תואמים לשירות שלנו, עיינו ב-<https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> וב-<https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### כיצד אוכל להגדיר מענה אוטומטי לחופשה (מחוץ למשרד) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> כינויים וצר או ערוך את הכינוי שברצונך להגדיר עבורו מענה אוטומטי לחופשה.

יש לך את היכולת להגדיר תאריך התחלה, תאריך סיום, נושא והודעה, ולהפעיל או להשבית אותם בכל עת:

* נושא והודעה בטקסט רגיל נתמכים כעת (אנו משתמשים בחבילת `striptags` באופן פנימי כדי להסיר כל HTML).
* הנושא מוגבל ל-100 תווים.
* ההודעה מוגבלת ל-1000 תווים.
* ההתקנה דורשת תצורת SMTP יוצא (לדוגמה, תצטרך להגדיר רשומות DKIM, DMARC ו-Return-Path DNS).
* עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההתקנה.
* לא ניתן להפעיל את תוכנת ה-Vacation Responder בשמות דומיין גלובליים (לדוגמה, [כתובות חד פעמיות](/disposable-addresses) אינם נתמכים).
לא ניתן להפעיל את תו החופשה עבור כינויים עם תווים כלליים/ביטויים כלליים (`*`) וגם לא עבור ביטויים רגולריים.

בניגוד למערכות דואר אלקטרוני כמו `postfix` (למשל, המשתמשות בתוסף סינון החופשות `sieve`) – Forward Email מוסיף אוטומטית את חתימת ה-DKIM שלך, מאבטח בעיות חיבור בעת שליחת תגובות חופשה (למשל, עקב בעיות חיבור נפוצות של SSL/TLS ושרתים מתוחזקים מדור קודם), ואף תומך בהצפנת Open WKD ו-PGP עבור תגובות חופשה.

<!--
* על מנת למנוע שימוש לרעה, ינוכה זיכוי SMTP יוצא אחד עבור כל הודעת מענה חופשה שנשלחת.
* כל החשבונות בתשלום כוללים 300 זיכויים ליום כברירת מחדל. אם אתם זקוקים לסכום גדול יותר, אנא צרו איתנו קשר.
-->

1. אנו שולחים הודעה פעם אחת בלבד לכל [רשימת היתרים](#do-you-have-an-allowlist) שולח כל 4 ימים (בדומה להתנהגות של Gmail).

* מטמון Redis שלנו משתמש בטביעת אצבע של `alias_id` ו-`sender`, בעוד ש-`alias_id` הוא מזהה MongoDB הכינוי ו-`sender` הוא כתובת ה-From (אם היא רשומה ברשימת ההיתרים) או דומיין הבסיס בכתובת ה-From (אם לא רשומה ברשימת ההיתרים). לשם הפשטות, תוקף טביעת האצבע הזו במטמון נקבע ל-4 ימים.

* הגישה שלנו, המשתמשת בדומיין הבסיסי המותח בכתובת "מאת" עבור שולחים שאינם ברשימת ההיתרים, מונעת שימוש לרעה מצד שולחים לא מוכרים יחסית (למשל, גורמים זדוניים) מלציף הודעות מענה חופשה.

2. אנו שולחים רק כאשר ה-MAIL FROM ו/או From אינם ריקים ואינם מכילים (ללא תלות באותיות גדולות/קטנות) [שם המשתמש של postmaster](#what-are-postmaster-addresses) (החלק שלפני ה-@ בהודעת דוא"ל).

3. איננו שולחים אם ההודעה המקורית הכילה אחת מהכותרות הבאות (לא תלויות רישיות):

* כותרת של `auto-submitted` עם ערך שאינו שווה ל-`no`. * כותרת של `x-auto-response-suppress` עם ערך של `dr`, `autoreply`, `auto-reply`, `auto_reply`, או `all`
* כותרת של `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, או `x-auto-respond` (ללא קשר לערך).
* כותרת של `precedence` עם ערך של `bulk`, `autoreply`, `auto-reply`, `auto_reply`, או `list`.

4. איננו שולחים אם כתובת הדוא"ל MAIL FROM או From מסתיימת ב-`+donotreply`, `-donotreply`, `+noreply`, או `-noreply`.

5. איננו שולחים אם חלק שם המשתמש של כתובת הדוא"ל "מאת" היה `mdaemon` והיה לו כותרת שאינה תלוית רישיות של `X-MDDSN-Message`.

6. איננו שולחים אם הייתה כותרת `content-type` שאינה רגישה לאותיות גדולות/קטנות של `multipart/report`.

### כיצד אוכל להגדיר SPF עבור דוא"ל מורחב {#how-do-i-set-up-spf-for-forward-email}

באמצעות דף ניהול ה-DNS של הרשם שלך, הגדר את רשומת ה-<strong class="notranslate">TXT</strong> הבאה:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-Gmail (לדוגמה, Send Mail As) או ב-G Suite, תצטרכו להוסיף <code>include:_spf.google.com</code> לערך שלמעלה, לדוגמה:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-Microsoft Outlook או ב-Live.com, תצטרכו להוסיף <code>include:spf.protection.outlook.com</code> לרשומת SPF <strong class="notranslate">TXT</strong> שלכם, לדוגמה:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
אם כבר יש לכם שורה דומה עם "v=spf1", תצטרכו להוסיף <code>include:spf.forwardemail.net</code> ממש לפני כל רשומה קיימת של "include:host.com" ולפני "-all" באותה שורה, לדוגמה:
<br /><br />
<code>v=spf1 ו- include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
שימו לב שיש הבדל בין "-all" ל-"~all". ה-"-" מציין שבדיקת SPF אמורה להיכשל אם היא אינה תואמת, ו-"~" מציין שבדיקת SPF אמורה להיכשל ב-SOFTFAIL. אנו ממליצים להשתמש בגישת "-all" כדי למנוע זיוף דומיין.
<br /><br />
ייתכן שתצטרכו גם לכלול את רשומת ה-SPF עבור כל מארח שממנו אתם שולחים דואר (לדוגמה, Outlook).
</span>
</div>

### כיצד אוכל להגדיר DKIM עבור העברת דוא"ל {#how-do-i-set-up-dkim-for-forward-email}

עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההגדרה.

### כיצד אוכל להגדיר DMARC עבור העברת דוא"ל {#how-do-i-set-up-dmarc-for-forward-email}

עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההגדרה.

### איך אני מחבר ומגדיר את אנשי הקשר שלי {#how-do-i-connect-and-configure-my-contacts}

**כדי להגדיר את אנשי הקשר שלך, השתמש בכתובת האתר של CardDAV של:** `https://carddav.forwardemail.net` (או פשוט `carddav.forwardemail.net` אם הלקוח שלך מאפשר זאת)**

### כיצד ניתן לחבר ולקבוע את תצורת היומנים שלי {#how-do-i-connect-and-configure-my-calendars}

**כדי להגדיר את היומן שלך, השתמש בכתובת האתר של CalDAV של:** `https://caldav.forwardemail.net` (או פשוט `caldav.forwardemail.net` אם הלקוח שלך מאפשר זאת)**

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="דוגמה להגדרת לוח שנה של CalDAV Thunderbird להעברת דוא"ל" />

### כיצד ניתן להוסיף עוד יומנים ולנהל יומנים קיימים {#how-do-i-add-more-calendars-and-manage-existing-calendars}

אם תרצו להוסיף יומנים נוספים, פשוט הוסיפו כתובת URL חדשה ליומן: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**ודאו להחליף את `calendar-name` בשם היומן הרצוי**)

ניתן לשנות את שם וצבע לוח שנה לאחר יצירתו – פשוט השתמשו באפליקציית לוח השנה המועדפת עליכם (למשל, Apple Mail או [Thunderbird](https://thunderbird.net)).

### כיצד אוכל להגדיר SRS עבור העברת דוא"ל {#how-do-i-set-up-srs-for-forward-email}

אנו מגדירים אוטומטית את [תוכנית כתיבה מחדש של השולח](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – אינך צריך לעשות זאת בעצמך.

### כיצד אוכל להגדיר MTA-STS עבור העברת דוא"ל {#how-do-i-set-up-mta-sts-for-forward-email}

אנא עיינו ב-[המדור שלנו על MTA-STS](#do-you-support-mta-sts) לקבלת תובנות נוספות.

### איך אני מוסיף תמונת פרופיל לכתובת הדוא"ל שלי {#how-do-i-add-a-profile-picture-to-my-email-address}

אם אתם משתמשים ב-Gmail, בצעו את השלבים הבאים:

1. עבור אל <https://google.com> והתנתק מכל חשבונות הדוא"ל
2. לחץ על "כניסה" ובתפריט הנפתח לחץ על "חשבון אחר"
3. בחר "השתמש בחשבון אחר"
4. בחר "צור חשבון"
5. בחר "השתמש בכתובת הדוא"ל הנוכחית שלי במקום זאת"
6. הזן את כתובת הדוא"ל של שם הדומיין המותאם אישית שלך
7. אחזר את דוא"ל האימות שנשלח לכתובת הדוא"ל שלך
8. הזן את קוד האימות מהדוא"ל הזה
9. מלא את פרטי הפרופיל עבור חשבון Google החדש שלך
10. הסכים לכל מדיניות הפרטיות ותנאי השימוש
11. עבור אל <https://google.com> ובפינה הימנית העליונה, לחץ על סמל הפרופיל שלך ולחץ על כפתור "שנה"
12. העלה תמונה או אווטאר חדשים עבור החשבון שלך
13. השינויים ייקח כ-1-2 שעות להטמעה, אך לפעמים הם עשויים להיות מהירים מאוד.
14. שלח דוא"ל ניסיון ותמונת הפרופיל אמורה להופיע.

## תכונות מתקדמות {#advanced-features}

### האם אתם תומכים בניוזלטרים או ברשימות תפוצה עבור דוא"ל שיווקי? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

כן, ניתן לקרוא עוד בכתובת <https://forwardemail.net/guides/newsletter-with-listmonk>.

שימו לב שעל מנת לשמור על מוניטין IP ולהבטיח את יכולת המסירה, ל-Forward Email יש תהליך בדיקה ידני על בסיס כל דומיין לאישור **ניוזלטר**. שלחו דוא"ל לכתובת <support@forwardemail.net> או פתחו [בקשת עזרה](https://forwardemail.net/help) לאישור. תהליך זה אורך בדרך כלל פחות מ-24 שעות, כאשר רוב הבקשות מטופלות תוך 1-2 שעות. בעתיד הקרוב אנו שואפים להפוך את התהליך הזה למיידי עם בקרות נוספות והתראות על ספאם. תהליך זה מבטיח שהאימיילים שלכם יגיעו לתיבת הדואר הנכנס וההודעות שלכם לא יסומנו כספאם.

### האם אתם תומכים בשליחת דוא"ל באמצעות API {#do-you-support-sending-email-with-api}

כן, החל ממאי 2023 אנו תומכים בשליחת דוא"ל עם API כתוסף לכל המשתמשים בתשלום.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">התנאים</a> שלנו, <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> שלנו, ואת <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">מגבלות ה-SMTP היוצא</a> שלנו & השימוש שלכם נחשב כהכרה והסכמה.
</span>
</div>

אנא עיינו בסעיף שלנו בנושא [אימיילים](/email-api#outbound-emails) בתיעוד ה-API שלנו לקבלת אפשרויות, דוגמאות ותובנות נוספות.

כדי לשלוח דוא"ל יוצא באמצעות ה-API שלנו, עליך להשתמש באסימון ה-API שלך הזמין תחת [האבטחה שלי](/my-account/security).

### האם אתם תומכים בקבלת דוא"ל באמצעות IMAP {#do-you-support-receiving-email-with-imap}

כן, החל מ-16 באוקטובר 2023 אנו תומכים בקבלת דוא"ל דרך IMAP כתוסף עבור כל המשתמשים בתשלום. **אנא קראו את המאמר המעמיק שלנו** בנושא [כיצד פועלת תכונת אחסון תיבת הדואר המוצפנת שלנו של SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="הוראות-imap">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">תנאים</a> ואת <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> שלנו & השימוש שלכם נחשב כהכרה והסכמה.
</span>
</div>

1. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (לדוגמה <code><hello@example.com></code>)

2. לחצו על <strong class="text-success"><i class="fa fa-key"></i>צור סיסמה</strong> ליד הכינוי החדש שנוצר. העתיקו ללוח שלכם ושמרו בצורה מאובטחת את הסיסמה שנוצרה המוצגת על המסך.

3. באמצעות יישום הדוא"ל המועדף עליך, הוסף או הגדר חשבון עם הכינוי החדש שיצרת (לדוגמה <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אנו ממליצים להשתמש ב-<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, או <a href="/blog/open-source" class="alert-link" target="_blank">חלופה בקוד פתוח המתמקדת בפרטיות</a>.</span>
</div>

4. כאשר תתבקש להזין שם שרת IMAP, הזן `imap.forwardemail.net`

5. כאשר תתבקשו להזין יציאת שרת IMAP, הזינו `993` (SSL/TLS) – ראו [יציאות IMAP חלופיות](/faq#what-are-your-imap-server-configuration-settings) במידת הצורך
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אם אתם משתמשים ב-Thunderbird, ודאו ש"אבטחת החיבור" מוגדרת ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"סיסמה רגילה".</span>
</div>

6. כאשר תתבקש להזין את סיסמת שרת ה-IMAP, הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> בשלב 2 לעיל.

7. **שמור את ההגדרות שלך** – אם אתה נתקל בבעיות, אנא <a href="/help">צור איתנו קשר</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

</div>

### האם אתה תומך ב-POP3 {#do-you-support-pop3}

כן, החל מ-4 בדצמבר 2023 אנו תומכים ב-[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) כתוסף לכל המשתמשים בתשלום. **אנא קראו את המאמר המעמיק שלנו** בנושא [כיצד פועלת תכונת אחסון תיבת הדואר המוצפנת שלנו של SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="הוראות-pop3">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">תנאים</a> ואת <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> שלנו & השימוש שלכם נחשב כהכרה והסכמה.
</span>
</div>

1. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (לדוגמה <code><hello@example.com></code>)

2. לחצו על <strong class="text-success"><i class="fa fa-key"></i>צור סיסמה</strong> ליד הכינוי החדש שנוצר. העתיקו ללוח שלכם ושמרו בצורה מאובטחת את הסיסמה שנוצרה המוצגת על המסך.

3. באמצעות יישום הדוא"ל המועדף עליך, הוסף או הגדר חשבון עם הכינוי החדש שיצרת (לדוגמה <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אנו ממליצים להשתמש ב-<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, או <a href="/blog/open-source" class="alert-link" target="_blank">חלופה בקוד פתוח המתמקדת בפרטיות</a>.</span>
</div>

4. כאשר תתבקש להזין שם שרת POP3, הזן `pop3.forwardemail.net`

5. כאשר תתבקשו להזין יציאת שרת POP3, הזינו `995` (SSL/TLS) – ראו [יציאות POP3 חלופיות](/faq#what-are-your-pop3-server-configuration-settings) במידת הצורך
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אם אתם משתמשים ב-Thunderbird, ודאו ש"אבטחת החיבור" מוגדרת ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"סיסמה רגילה".</span>
</div>

6. כאשר תתבקש להזין את סיסמת שרת ה-POP3, הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> בשלב 2 לעיל.

7. **שמור את ההגדרות שלך** – אם אתה נתקל בבעיות, אנא <a href="/help">צור איתנו קשר</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

</div>

### האם אתם תומכים בלוחות שנה (CalDAV) {#do-you-support-calendars-caldav}

כן, החל מ-5 בפברואר 2024 הוספנו תכונה זו. השרת שלנו הוא `caldav.forwardemail.net` והוא גם מנוטר ב<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">דף הסטטוס</a> שלנו.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך פורט `443` ‏(HTTPS).

| כְּנִיסָה לַמַעֲרֶכֶת | דוּגמָה | תֵאוּר |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com` | כתובת דוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>. |
| סִיסמָה | `************************` | סיסמה שנוצרה ספציפית לשם חיבה. |

כדי להשתמש בתמיכה בלוח שנה, ה- **משתמש** חייב להיות כתובת הדוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">דומיינים של החשבון שלי</a> – וה- **סיסמה** חייבת להיות סיסמה ספציפית לכינוי שנוצרה.

### האם אתם תומכים באנשי קשר (CardDAV) {#do-you-support-contacts-carddav}

כן, החל מ-12 ביוני 2025 הוספנו תכונה זו. השרת שלנו הוא `carddav.forwardemail.net` והוא גם מנוטר ב<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">דף הסטטוס</a> שלנו.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך פורט `443` ‏(HTTPS).

| כְּנִיסָה לַמַעֲרֶכֶת | דוּגמָה | תֵאוּר |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com` | כתובת דוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>. |
| סִיסמָה | `************************` | סיסמה שנוצרה ספציפית לשם חיבה. |

כדי להשתמש בתמיכה באנשי קשר, ה- **משתמש** חייב להיות כתובת הדוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">דומיינים של החשבון שלי <i class="fa fa-angle-right"></i></a> – וה- **סיסמה** חייבת להיות סיסמה ספציפית לכינוי שנוצרה.

### האם אתם תומכים בשליחת דוא"ל באמצעות SMTP {#do-you-support-sending-email-with-smtp}

כן, החל ממאי 2023 אנו תומכים בשליחת דוא"ל עם SMTP כתוסף לכל המשתמשים בתשלום.

<div id="הוראות-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">התנאים</a> שלנו, <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> שלנו, ואת <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">מגבלות ה-SMTP היוצא</a> שלנו - השימוש שלכם נחשב כהכרה והסכמה.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-Gmail, עיינו במדריך <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">שלחו דואר כ-Gmail</a> שלנו. אם אתם מפתחים, עיינו במסמכי <a class="alert-link" href="/email-api#outbound-emails" target="_blank">ממשק ה-API של דוא"ל</a> שלנו.
</span>
</div>

1. עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i>הגדרות <i class="fa fa-angle-right"></i>תצורת SMTP יוצא ופעל לפי הוראות ההתקנה.

2. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (לדוגמה <code><hello@example.com></code>)

3. לחצו על <strong class="text-success"><i class="fa fa-key"></i>צור סיסמה</strong> ליד הכינוי החדש שנוצר. העתיקו ללוח שלכם ושמרו בצורה מאובטחת את הסיסמה שנוצרה המוצגת על המסך.

4. באמצעות יישום הדוא"ל המועדף עליך, הוסף או הגדר חשבון עם הכינוי החדש שיצרת (לדוגמה <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אנו ממליצים להשתמש ב-<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, או <a href="/blog/open-source" class="alert-link" target="_blank">חלופה בקוד פתוח המתמקדת בפרטיות</a>.</span>
</div>

5. כאשר תתבקש להזין שם שרת SMTP, הזן `smtp.forwardemail.net`

6. כאשר תתבקשו להזין יציאת שרת SMTP, הזינו `465` (SSL/TLS) – ראו [פורטי SMTP חלופיים](/faq#what-are-your-smtp-server-configuration-settings) במידת הצורך
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אם אתם משתמשים ב-Thunderbird, ודאו ש"אבטחת החיבור" מוגדרת ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"סיסמה רגילה".</span>
</div>

7. כאשר תתבקש להזין את סיסמת שרת ה-SMTP, הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> בשלב 3 לעיל.

8. **שמור את ההגדרות שלך ושלח את אימייל הניסיון הראשון שלך** – אם אתה נתקל בבעיות, אנא <a href="/help">צור איתנו קשר</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
שימו לב שעל מנת לשמור על מוניטין ה-IP ולהבטיח את יכולת המסירה, יש לנו תהליך בדיקה ידני על בסיס כל דומיין לאישור SMTP יוצא. זה בדרך כלל לוקח פחות מ-24 שעות, כאשר רוב הבקשות מטופלות תוך 1-2 שעות. בעתיד הקרוב אנו שואפים להפוך את התהליך הזה למיידי עם בקרות ספאם נוספות והתראות. תהליך זה מבטיח שהאימיילים שלכם יגיעו לתיבת הדואר הנכנס וההודעות שלכם לא יסומנו כספאם.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

</div>

### האם אתה תומך ב-OpenPGP/MIME, הצפנה מקצה לקצה ("E2EE") ומדריך מפתחות אינטרנט ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

כן, אנו תומכים ב-[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [הצפנה מקצה לקצה ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), ובגילוי מפתחות ציבוריים באמצעות [מדריך מפתחות אינטרנט ("WKD")](https://wiki.gnupg.org/WKD). ניתן להגדיר את OpenPGP באמצעות [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) או [אחסון עצמי של המפתחות שלך](https://wiki.gnupg.org/WKDHosting) (ראו [עיקרון זה להגדרת שרת WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* חיפושי WKD נשמרים במטמון למשך שעה אחת כדי להבטיח מסירה בזמן של דוא"ל → לכן, אם תוסיפו, תשנו או תסירו את מפתח ה-WKD שלכם, אנא שלחו לנו דוא"ל לכתובת `support@forwardemail.net` עם כתובת הדוא"ל שלכם כדי שנוכל לנקות את המטמון באופן ידני.
* אנו תומכים בהצפנת PGP עבור הודעות המועברות דרך חיפוש WKD או באמצעות מפתח PGP שהועלה בממשק שלנו.
* מפתחות שהועלו גוברים כל עוד תיבת הסימון PGP מופעלת/מסומנת.
* הודעות הנשלחות ל-webhooks אינן מוצפנות כעת באמצעות PGP.
* אם יש לכם מספר כינויים התואמים לכתובת העברה נתונה (למשל, regex/wildcard/exact combo) ואם יותר מאחד מהם מכיל מפתח PGP שהועלה ו-PGP מסומן →, נשלח לכם דוא"ל התראת שגיאה ולא נצפין את ההודעה עם מפתח ה-PGP שהעליתם. זה נדיר מאוד ובדרך כלל חל רק על משתמשים מתקדמים עם כללי כינויים מורכבים.
**הצפנת PGP לא תחול על העברת דוא"ל דרך שרתי ה-MX שלנו אם לשולח הייתה מדיניות DMARC של דחייה. אם אתם זקוקים להצפנת PGP על *כל* הדואר, אנו ממליצים להשתמש בשירות IMAP שלנו ולהגדיר את מפתח ה-PGP שלכם עבור הכינוי שלכם לדואר נכנס.**

ניתן לאמת את הגדרת מדריך מפתחות האינטרנט שלך בכתובת <https://wkd.chimbosonic.com/> (קוד פתוח) או <https://www.webkeydirectory.com/> (קנייני).

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
הצפנה אוטומטית:
</strong>
<span>אם אתם משתמשים בשירות <a href="#do-you-support-sending-email-with-smtp" class="alert-link">SMTP היוצא</a> שלנו ושולחים הודעות לא מוצפנות, ננסה להצפין הודעות באופן אוטומטי על בסיס נמען באמצעות <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
עליך לבצע את כל השלבים הבאים כדי להפעיל את OpenPGP עבור שם הדומיין המותאם אישית שלך.
</span>
</div>

1. הורידו והתקינו את התוסף המומלץ של תוכנת הדוא"ל שלכם למטה:

| לקוח דוא"ל | פּלַטפוֹרמָה | תוסף מומלץ | הערות |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | שולחן עבודה | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | ל-Thunderbird יש תמיכה מובנית ב-OpenPGP. |
| Gmail | דפדפן | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני) | Gmail אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download). |
| אפל מייל | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| אפל מייל | iOS | [PGPro](https://github.com/opensourceios/PGPro/) או [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (רישיון קנייני) | Apple Mail אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [PGPro](https://github.com/opensourceios/PGPro/) או [FlowCrypt](https://flowcrypt.com/download). |
| הַשׁקָפָה | חלונות | [gpg4win](https://www.gpg4win.de/index.html) | תוכנת הדואר השולחנית של Outlook אינה תומכת ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [gpg4win](https://www.gpg4win.de/index.html). |
| הַשׁקָפָה | דפדפן | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני) | תוכנת הדואר המבוססת על האינטרנט של Outlook אינה תומכת ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download). |
| דְמוּי אָדָם | נייד | [OpenKeychain](https://www.openkeychain.org/) או [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) כגון [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) ו-[FairEmail](https://github.com/M66B/FairEmail) שניהם תומכים בתוסף קוד פתוח [OpenKeychain](https://www.openkeychain.org/). לחלופין, ניתן להשתמש בתוסף קוד פתוח (ברישוי קנייני) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| גוגל כרום | דפדפן | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני) | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download). |
| מוזילה פיירפוקס | דפדפן | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני) | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download). |
| מיקרוסופט אדג' | דפדפן | [Mailvelope](https://mailvelope.com/) | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/). |
| אַמִיץ | דפדפן | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני) | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download). |
| בלסה | שולחן עבודה | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | ל-Balsa יש תמיכה מובנית ב-OpenPGP. |
| KMail | שולחן עבודה | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | ל-KMail יש תמיכה מובנית ב-OpenPGP. |
| אבולוציה של GNOME | שולחן עבודה | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | ל-GNOME Evolution יש תמיכה מובנית ב-OpenPGP. |
| מָסוֹף | שולחן עבודה | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | ניתן להשתמש בקובץ [gpg command line tool](https://www.gnupg.org/download/) בקוד פתוח כדי ליצור מפתח חדש משורת הפקודה. |

2. פתחו את התוסף, צרו את המפתח הציבורי שלכם והגדירו את תוכנת הדוא"ל שלכם לשימוש בו.

3. העלה את המפתח הציבורי שלך לכתובת <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>תוכל לבקר ב-<a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> כדי לנהל את המפתח שלך בעתיד.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
תוסף אופציונלי:
</strong>
<span>
אם אתם משתמשים בשירות האחסון המוצפן שלנו (IMAP/POP3) שלנו וברצונכם שכל הדוא"ל המאוחסן במסד הנתונים SQLite (שכבר מוצפן) שלכם יוצפן באמצעות המפתח הציבורי שלכם, גשו אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i>כינויים (לדוגמה <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> ערוך את <i class="fa fa-angle-right"></i> OpenPGP והעלה את המפתח הציבורי שלך.
</span>
</div>

4. הוסף רשומת `CNAME` חדשה לשם הדומיין שלך (לדוגמה, `example.com`):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><code>openpgpkey</code></td> <td class="text-center">3600</td> <td class="notranslate">CNAME</td> <td><code>wkd.keys.openpgp.org</code></td> </tr> </tbody> </table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>אם הכינוי שלך משתמש בדומיינים <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable</a> שלנו (לדוגמה <code>hideaddress.net</code>), תוכל לדלג על שלב זה.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
מזל טוב!
</strong>
<span>
השלמת בהצלחה את כל השלבים.
</span>
</div>
</div>

### האם אתה תומך ב-MTA-STS {#do-you-support-mta-sts}

כן, החל מ-2 במרץ 2023 אנו תומכים ב-[MTA-STS](https://www.hardenize.com/blog/mta-sts). באפשרותך להשתמש ב-[תבנית זו](https://github.com/jpawlowski/mta-sts.template) אם ברצונך להפעיל אותו בדומיין שלך.

ניתן למצוא את התצורה שלנו באופן ציבורי ב-GitHub בכתובת <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### האם אתם תומכים במפתחות וב-WebAuthn {#do-you-support-passkeys-and-webauthn}

כן! החל מ-13 בדצמבר 2023 הוספנו תמיכה במפתחות [עקב ביקוש גבוה](https://github.com/orgs/forwardemail/discussions/182).

סיסמות מאפשרות לך להתחבר בצורה מאובטחת ללא צורך בסיסמה ואימות דו-שלבי.

ניתן לאמת את זהותך באמצעות מגע, זיהוי פנים, סיסמה מבוססת מכשיר או קוד סודי.

אנו מאפשרים לך לנהל עד 30 סיסמות בו זמנית, כך שתוכל להתחבר בקלות מכל המכשירים שלך.

למידע נוסף על סיסמאות, בקרו בקישורים הבאים:

* [היכנס לאפליקציות ולאתרי האינטרנט שלך באמצעות סיסמות](https://support.google.com/android/answer/14124480?hl=en) (גוגל)
* [שימוש בסיסמות כדי להתחבר לאפליקציות ואתרי אינטרנט ב-iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (אפל)
* [ערך בוויקיפדיה על מפתחות סיסמה](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### האם אתם תומכים בשיטות עבודה מומלצות בנוגע לדוא"ל {#do-you-support-email-best-practices}

כן. יש לנו תמיכה מובנית ב-SPF, DKIM, DMARC, ARC ו-SRS בכל התוכניות. עבדנו גם בהרחבה עם המחברים המקוריים של מפרטים אלה ועם מומחי דוא"ל אחרים כדי להבטיח שלמות ומסירה גבוהה.

### האם אתם תומכים ב-webhooks של ניתוק (bounce webhooks) {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
מחפשים תיעוד על webhooks לדוא"ל? ראו <a href="/faq#do-you-support-webhooks" class="alert-link">האם אתם תומכים ב-webhooks?</a> למידע נוסף.
<span>
</span>
</div>

כן, החל מ-14 באוגוסט 2024 הוספנו תכונה זו. כעת ניתן לגשת לחשבון שלי ← דומיינים ← הגדרות ← כתובת URL של Webhook חוזרת ולהגדיר כתובת URL של `http://` או `https://` שאליה נשלח בקשה של `POST` בכל פעם שהודעות דוא"ל SMTP יוצאות חוזרות.

זה שימושי עבורך לניהול ומעקב אחר ה-SMTP היוצא שלך - וניתן להשתמש בו כדי לשמור על מנויים, לבטל הסכמה ולזהות מתי מתרחשות חזרות.

מטענים של webhook של Bounce נשלחים כ-JSON עם המאפיינים הבאים:

* `email_id` (מחרוזת) - מזהה דוא"ל התואם לדוא"ל ב"החשבון שלי" → "דוא"ל" (SMTP יוצא)
* `list_id` (מחרוזת) - ערך הכותרת `List-ID` (לא רגיש לאותיות גדולות/קטנות), אם קיים, מהדוא"ל היוצא המקורי
* `list_unsubscribe` (מחרוזת) - ערך הכותרת `List-Unsubscribe` (לא רגיש לאותיות גדולות/קטנות), אם קיים, מהדוא"ל היוצא המקורי
* `feedback_id` (מחרוזת) - ערך הכותרת `Feedback-ID` (לא רגיש לאותיות גדולות/קטנות), אם קיים, מהדוא"ל היוצא המקורי
* `recipient` (מחרוזת) - כתובת הדוא"ל של הנמען שהוחזר או שקיבל שגיאה
* `message` (מחרוזת) - הודעת שגיאה מפורטת עבור הניתור
* `response` (מחרוזת) - הודעת תגובת ה-SMTP
* `response_code` (מספר) - קוד תגובת ה-SMTP שעבר ניתוח
* `truth_source` (מחרוזת) - אם קוד התגובה הגיע ממקור מהימן, ערך זה יאוכלס בשם הדומיין הבסיסי (לדוגמה `google.com` או `yahoo.com`)
* `bounce` (אובייקט) - אובייקט המכיל את המאפיינים הבאים המפרטים את סטטוס הניתור והדחייה
* `action` (מחרוזת) - פעולת ניתור (לדוגמה `"reject"`)
* `message` (מחרוזת) - סיבת ניתור (לדוגמה `"Message Sender Blocked By Receiving Server"`)
* `category` (מחרוזת) - קטגוריית ניתור (לדוגמה `"block"`)
* `code` (מספר) - קוד סטטוס ניתור (לדוגמה `554`)
* `status` (מחרוזת) - קוד ניתור מהודעת תגובה (לדוגמה `5.7.1`)
* `line` (מספר) - מספר שורה מנותח, אם קיים, [מרשימת ניתוח יציאות של Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (לדוגמה `526`)
* `headers` (אובייקט) - זוג ערכי מפתח של כותרות עבור הדוא"ל היוצא
* `bounced_at` (מחרוזת) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) מעוצב תאריך בו התרחשה שגיאת הניתור החוזר

לְדוּגמָה:

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

הנה כמה הערות נוספות בנוגע ל-webhooks של bounce:

* אם מטען ה-webhook מכיל ערך `list_id`, `list_unsubscribe`, או `feedback_id`, עליך לנקוט בפעולה מתאימה כדי להסיר את `recipient` מהרשימה במידת הצורך.
* אם הערך `bounce.category` היה אחד `"block"`, `"recipient"`, `"spam"`, או `"virus"`, עליך בהחלט להסיר את המשתמש מהרשימה.
* אם עליך לאמת עומסי webhook (כדי לוודא שהם אכן מגיעים מהשרת שלנו), תוכל להשתמש ב-[פתרון כתובת ה-IP של הלקוח המרוחק ושם המארח של הלקוח באמצעות חיפוש הפוך](https://nodejs.org/api/dns.html#dnspromisesreverseip) – זה אמור להיות `smtp.forwardemail.net`.
* תוכל גם לבדוק את כתובת ה-IP מול [כתובות ה-IP שפרסמנו](#what-are-your-servers-ip-addresses).
* עבור אל החשבון שלי ← דומיינים ← הגדרות ← מפתח אימות עומס חתימת Webhook כדי לקבל את מפתח ה-webhook שלך.
* תוכל לסובב מפתח זה בכל עת מסיבות אבטחה.
* חשב והשווה את הערך `X-Webhook-Signature` מבקשת ה-webhook שלנו עם ערך הגוף המחושב באמצעות מפתח זה. דוגמה כיצד לעשות זאת זמינה ב-[פוסט Stack Overflow הזה](https://stackoverflow.com/a/68885281).
* עיין בדיון ב-<https://github.com/forwardemail/free-email-forwarding/issues/235> לקבלת תובנות נוספות.
* נמתין עד `5` שניות עד שנקודת הקצה של ה-webhook שלך תגיב עם קוד סטטוס `200`, וננסה שוב עד `1`.
* אם נזהה שכתובת האתר של ה-webhook הנפתחת שלך מכילה שגיאה בזמן שאנו מנסים לשלוח אליה בקשה, נשלח לך אימייל מחמיא פעם בשבוע.

### האם אתם תומכים ב-webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
מחפש תיעוד על webhooks של bounce? ראה <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">האם אתם תומכים ב-webhooks של bounce?</a> לקבלת תובנות נוספות.
<span>
</span>
</div>

כן, החל מ-15 במאי 2020 הוספנו תכונה זו. ניתן פשוט להוסיף webhook(ים) בדיוק כפי שהייתם עושים עם כל נמען! אנא ודאו שפרוטוקול "http" או "https" מופיע בקידומת כתובת האתר של ה-webhook.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
הגנה משופרת על פרטיות:
</strong>
<span>
אם אתם בתוכנית בתשלום (הכוללת הגנה משופרת על פרטיות), אנא גשו אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> ולחצו על "כינויים" ליד הדומיין שלכם כדי להגדיר את webhooks שלכם. אם תרצו ללמוד עוד על תוכניות בתשלום, עיינו בדף <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">התמחור</a> שלנו. אחרת, תוכלו להמשיך לפעול לפי ההוראות שלהלן.
</span>
</div>

אם אתם בתוכנית החינמית, פשוט הוסיפו רשומת DNS חדשה <strong class="notranslate">TXT</strong> כפי שמוצג להלן:

לדוגמה, אם אני רוצה שכל האימיילים שמגיעים אל `alias@example.com` יועברו לנקודת קצה חדשה של בדיקה [סל בקשות](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

או שאולי אתם רוצים שכל האימיילים שמגיעים אל `example.com` יועברו לנקודת קצה זו:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

**להלן הערות נוספות בנוגע ל-webhooks:**

* אם עליכם לאמת עומסי webhook (כדי לוודא שהם אכן מגיעים מהשרת שלנו), תוכלו להשתמש ב-[פתרון כתובת ה-IP של הלקוח המרוחק ושם המארח של הלקוח באמצעות חיפוש הפוך](https://nodejs.org/api/dns.html#dnspromisesreverseip) – זה צריך להיות `mx1.forwardemail.net` או `mx2.forwardemail.net`.
* תוכלו גם לבדוק את כתובת ה-IP מול [כתובות ה-IP שפרסמנו](#what-are-your-servers-ip-addresses).
* אם אתם בתוכנית בתשלום, גשו לחשבון שלי ← דומיינים ← הגדרות ← מפתח אימות עומס חתימת Webhook כדי לקבל את מפתח ה-webhook שלכם.
* תוכלו לסובב מפתח זה בכל עת מסיבות אבטחה.
* חשבו והשוו את הערך `X-Webhook-Signature` מבקשת ה-webhook שלנו עם ערך הגוף המחושב באמצעות מפתח זה. דוגמה כיצד לעשות זאת זמינה ב-[פוסט Stack Overflow הזה](https://stackoverflow.com/a/68885281).
* עיינו בדיון ב-<https://github.com/forwardemail/free-email-forwarding/issues/235> לקבלת תובנות נוספות.
* אם Webhook אינו מגיב עם קוד סטטוס `200`, נאחסן את תגובתו בקובץ [נוצר יומן שגיאות](#do-you-store-error-logs) – דבר שימושי לאיתור שגיאות.
* בקשות HTTP של Webhook ינסו שוב עד 3 פעמים בכל ניסיון חיבור SMTP, עם זמן קצוב מקסימלי של 60 שניות לכל בקשת POST של נקודת קצה. **שימו לב שזה לא אומר שהוא ינסה שוב רק 3 פעמים**, הוא למעשה ינסה שוב ברציפות לאורך זמן על ידי שליחת קוד SMTP של 421 (המצביע לשולח על ניסיון חוזר מאוחר יותר) לאחר ניסיון בקשת ה-HTTP POST השלישי שנכשל. משמעות הדבר היא שהאימייל ינסה שוב ברציפות במשך ימים עד להשגת קוד סטטוס 200.
* ננסה שוב באופן אוטומטי בהתבסס על קודי הסטטוס וקודי השגיאה המוגדרים כברירת מחדל המשמשים ב-[שיטת ניסיון חוזר של סוכן-על](https://ladjs.github.io/superagent/#retrying-requests) (אנחנו המתחזקים).
* אנו מקבצים בקשות HTTP של Webhook לאותה נקודת קצה בבקשה אחת במקום במספר) על מנת לחסוך משאבים ולהאיץ את זמן התגובה. לדוגמה, אם תשלחו אימייל אל <webhook1@example.com>, <webhook2@example.com> ו-<webhook3@example.com>, וכל אלה מוגדרים להגיע לאותה כתובת URL *מדויקת* של נקודת הקצה, אז תתבצע רק בקשה אחת. אנו מקבצים יחד לפי התאמה מדויקת של נקודת הקצה עם שוויון קפדני.
* שימו לב שאנו משתמשים בשיטת "simpleParser" של ספריית [mailparser](https://nodemailer.com/extras/mailparser/) כדי לנתח את ההודעה לאובייקט ידידותי ל-JSON.
* ערך אימייל גולמי כמחרוזת ניתן כמאפיין "raw".
* תוצאות אימות ניתנות כמאפיינים "dkim", "spf", "arc", "dmarc" ו-"bimi".
* כותרות האימייל המותחות ניתנות כמאפיין "headers" - אך שימו לב שניתן להשתמש ב-"headerLines" לצורך איטרציה וניתוח קלים יותר.
* הנמענים המקובצים עבור webhook זה מקובצים יחד וניתנים כמאפיין "recipients".
* פרטי סשן ה-SMTP ניתנים כמאפיין "session". זה מכיל מידע על שולח ההודעה, זמן ההגעה של ההודעה, HELO ושם מארח הלקוח. ערך שם מארח הלקוח כ-`session.clientHostname` הוא או ה-FQDN (מחיפוש PTR הפוך) או שהוא `session.remoteAddress` עטוף בסוגריים (לדוגמה `"[127.0.0.1]"`).
* אם אתם זקוקים לדרך מהירה לקבל את הערך של `X-Original-To`, תוכלו להשתמש בערך של `session.recipient` (ראו דוגמה למטה). הכותרת `X-Original-To` היא כותרת שאנו מוסיפים להודעות לצורך איתור באגים עם הנמען המקורי (לפני העברה מוסתרת) עבור ההודעה. * אם עליך להסיר את המאפיינים `attachments` ו/או `raw` מגוף המטען, פשוט הוסף `?attachments=false`, `?raw=false`, או `?attachments=false&raw=false` לנקודת הקצה של ה-webhook שלך כפרמטר מחרוזת שאילתה (לדוגמה, `https://example.com/webhook?attachments=false&raw=false`).
* אם ישנם קבצים מצורפים, הם יצורפו למערך `attachments` עם ערכי Buffer. ניתן לנתח אותם בחזרה לתוכן באמצעות גישה עם JavaScript כגון:

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
טיפ:
</strong>
סקרנים איך נראית בקשת webhook מהודעות דוא"ל שהועברו? כללנו דוגמה למטה עבורכם!
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

### האם אתה תומך בביטויים רגולריים או בביטויים רגולריים {#do-you-support-regular-expressions-or-regex}

כן, החל מ-27 בספטמבר 2021 הוספנו תכונה זו. ניתן פשוט לכתוב ביטויים רגולריים ("regex") לצורך התאמת כינויים וביצוע החלפות.

כינויים הנתמכים על ידי ביטויים רגולריים הם כאלה שמתחילים ב-`/` ומסתיימים ב-`/` והנמענים שלהם הם כתובות דוא"ל או Webhooks. הנמענים יכולים לכלול גם תמיכה בהחלפת ביטויים רגולריים (למשל `$1`, `$2`).

אנו תומכים בשני דגלי ביטוי רגולרי, כולל `i` ו-`g`. הדגל שאינו תלוי רישיות של `i` הוא ברירת מחדל קבועה והוא נאכף תמיד. ניתן להוסיף את הדגל הגלובלי `g` על ידי הוספת הסיומת `/` עם `/g`.

שים לב שאנו תומכים גם בתכונת <a href="#can-i-disable-specific-aliases">disabled" כינוי</a> עבור חלק הנמען עם תמיכת ה-regex שלנו.

ביטויים רגולריים אינם נתמכים ב-<a href="/disposable-addresses" target="_blank">דומיינים גלובליים מסוג vanity</a> (מכיוון שזו עלולה להיות פגיעות אבטחה).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
הגנה משופרת על פרטיות:
</strong>
<span>
אם אתם בתוכנית בתשלום (הכוללת הגנה משופרת על פרטיות), אנא גשו אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> ולחצו על "כינויים" ליד הדומיין שלכם כדי להגדיר ביטויים רגולריים. אם תרצו ללמוד עוד על תוכניות בתשלום, עיינו בדף <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">התמחור</a> שלנו. אחרת, תוכלו להמשיך לפעול לפי ההוראות שלהלן.
</span>
</div>

אם אתם בתוכנית החינמית, פשוט הוסיפו רשומת DNS חדשה <strong class="notranslate">TXT</strong> באמצעות אחת או יותר מהדוגמאות המופיעות להלן:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה פשוטה:</strong> אם אני רוצה שכל האימיילים שמגיעים אל `linus@example.com` או `torvalds@example.com` יועברו אל `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה להחלפת שם פרטי ושם משפחה:</strong> דמיינו שכל כתובות הדוא"ל של החברה שלכם הן מהתבנית `firstname.lastname@example.com`. אם אני רוצה שכל האימיילים שמגיעים לתבנית `firstname.lastname@example.com` יועברו ל-`firstname.lastname@company.com` עם תמיכה בהחלפה (<a href="https://regexr.com/66hnu" class="alert-link">הצג בדיקה ב-RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה להחלפה באמצעות סינון סמלים פלוס:</strong> אם אני רוצה שכל האימיילים שמגיעים ל-`info@example.com` או `support@example.com` יועברו ל-`user+info@gmail.com` או `user+support@gmail.com` בהתאמה (עם תמיכה בהחלפה) (<a href="https://regexr.com/66ho7" class="alert-link">הצג בדיקה ב-RegExr</a>):
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה להחלפת מחרוזת שאילתה ב-Webhook:</strong> אולי אתה רוצה שכל האימיילים שמגיעים ל-`example.com` יגיעו ל-<a href="#do-you-support-webhooks" class="alert-link">webhook</a> ויהיו בעלי מפתח מחרוזת שאילתה דינמי של "to" עם ערך של חלק שם המשתמש של כתובת האימייל (<a href="https://regexr.com/66ho4" class="alert-link">הצג בדיקה ב-RegExr</a>):
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה לדחייה שקטה:</strong> אם ברצונך שכל האימיילים התואמים לתבנית מסוימת יושבתו ויידחו בשקט (נראה לשולח כאילו ההודעה נשלחה בהצלחה, אך למעשה לא מגיעה לשום מקום) עם קוד סטטוס `250` (ראה <a href="#can-i-disable-specific-aliases" class="alert-link">האם ניתן להשבית כינויים ספציפיים</a>), פשוט השתמש באותה גישה עם סימן קריאה יחיד "!". זה מציין לשולח שההודעה נשלחה בהצלחה, אך למעשה לא הגיעה לשום מקום (למשל, חור שחור או `/dev/null`).
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה לדחייה רכה:</strong> אם ברצונך שכל האימיילים התואמים לתבנית מסוימת יושבתו ויידחו רכה עם קוד סטטוס `421` (ראה <a href="#can-i-disable-specific-aliases" class="alert-link">האם ניתן להשבית כינויים ספציפיים</a>), פשוט השתמש באותה גישה עם סימן קריאה כפול "!!". זה מציין לשולח לנסות שוב את האימייל שלו, ואימיילים לכינוי זה ייבדקו שוב במשך כ-5 ימים ולאחר מכן ידחו לצמיתות.
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>דוגמה לדחייה קשה:</strong> אם ברצונך שכל האימיילים התואמים לתבנית מסוימת יושבתו ויידחו באופן קשה עם קוד סטטוס `550` (ראה <a href="#can-i-disable-specific-aliases" class="alert-link">האם ניתן להשבית כינויים ספציפיים</a>), פשוט השתמש באותה גישה עם סימן קריאה משולש "!!!". זה מציין לשולח שגיאה קבועה ואימיילים לא ינסו שוב, הם יידחו עבור כינוי זה.
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td> </tr> </tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
סקרנים לדעת כיצד לכתוב ביטוי רגולרי או צריכים לבדוק את ההחלפה שלכם? אתם יכולים לגשת לאתר האינטרנט החינמי לבדיקת ביטויים רגולריים <a href="https://regexr.com" class="alert-link">RegExr</a> בכתובת <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### מהן מגבלות ה-SMTP היוצא שלך {#what-are-your-outbound-smtp-limits}

אנו מגבילים משתמשים ודומיינים ל-300 הודעות SMTP יוצאות ביום. ממוצע זה הוא מעל 9000 אימיילים בחודש קלנדרי. אם אתם צריכים לחרוג מכמות זו או שיש לכם אימיילים גדולים באופן עקבי, אנא [צרו קשר](https://forwardemail.net/help).

### האם אני צריך אישור כדי להפעיל SMTP {#do-i-need-approval-to-enable-smtp}

כן, שימו לב שעל מנת לשמור על מוניטין ה-IP ולהבטיח את יכולת המסירה, ל-Forward Email יש תהליך סקירה ידני על בסיס כל דומיין לאישור SMTP יוצא. שלחו דוא"ל לכתובת <support@forwardemail.net> או פתחו [בקשת עזרה](https://forwardemail.net/help) לאישור. תהליך זה אורך בדרך כלל פחות מ-24 שעות, כאשר רוב הבקשות מטופלות תוך 1-2 שעות. בעתיד הקרוב אנו שואפים להפוך את התהליך הזה למיידי עם בקרות נוספות והתראות על ספאם. תהליך זה מבטיח שהאימיילים שלכם יגיעו לתיבת הדואר הנכנס וההודעות שלכם לא יסומנו כספאם.

### מהן הגדרות התצורה של שרת ה-SMTP שלך {#what-are-your-smtp-server-configuration-settings}

השרת שלנו הוא `smtp.forwardemail.net` והוא גם מנוטר ב<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">דף הסטטוס</a> שלנו.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך הפורטים `465` ו- `2465` עבור SSL/TLS ו- `587`, `2587`, `2525`, ו- `25` עבור TLS ‏(STARTTLS).

| פּרוֹטוֹקוֹל | שם מארח | נמלים | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **מועדף** | `smtp.forwardemail.net` | `465`, `2465` | :סימן_וי_לבן: | :סימן_וי_לבן: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :סימן_וי_לבן: | :סימן_וי_לבן: |

| כְּנִיסָה לַמַעֲרֶכֶת | דוּגמָה | תֵאוּר |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com` | כתובת דוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>. |
| סִיסמָה | `************************` | סיסמה שנוצרה ספציפית לשם חיבה. |

כדי לשלוח דוא"ל יוצא באמצעות SMTP, **משתמש ה-SMTP** חייב להיות כתובת הדוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">דומיינים של <i class="fa fa-angle-right"></i> של החשבון שלי</a> – וסיסמת ה-**SMTP** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

אנא עיין ב-[האם אתם תומכים בשליחת דוא"ל באמצעות SMTP](#do-you-support-sending-email-with-smtp) לקבלת הוראות שלב אחר שלב.

### מהן הגדרות התצורה של שרת ה-IMAP שלך {#what-are-your-imap-server-configuration-settings}

השרת שלנו הוא `imap.forwardemail.net` והוא גם מנוטר ב<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">דף הסטטוס</a> שלנו.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך הפורטים `993` ו- `2993` עבור SSL/TLS.

| פּרוֹטוֹקוֹל | שם מארח | נמלים | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **מועדף** | `imap.forwardemail.net` | `993`, `2993` | :סימן_וי_לבן: | :סימן_וי_לבן: |

| כְּנִיסָה לַמַעֲרֶכֶת | דוּגמָה | תֵאוּר |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com` | כתובת דוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>. |
| סִיסמָה | `************************` | סיסמה שנוצרה ספציפית לשם חיבה. |

כדי להתחבר באמצעות IMAP, **משתמש ה-IMAP** חייב להיות כתובת הדוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">דומיינים של החשבון שלי<i class="fa fa-angle-right"></i></a> – ו-**סיסמת ה-IMAP** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

אנא עיין ב-[האם אתם תומכים בקבלת דוא"ל באמצעות IMAP](#do-you-support-receiving-email-with-imap) לקבלת הוראות שלב אחר שלב.

### מהן הגדרות התצורה של שרת ה-POP3 שלך {#what-are-your-pop3-server-configuration-settings}

השרת שלנו הוא `pop3.forwardemail.net` והוא גם מנוטר ב<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">דף הסטטוס</a> שלנו.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך הפורטים `995` ו- `2995` עבור SSL/TLS.

| פּרוֹטוֹקוֹל | שם מארח | נמלים | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **מועדף** | `pop3.forwardemail.net` | `995`, `2995` | :סימן_וי_לבן: | :סימן_וי_לבן: |

| כְּנִיסָה לַמַעֲרֶכֶת | דוּגמָה | תֵאוּר |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com` | כתובת דוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>. |
| סִיסמָה | `************************` | סיסמה שנוצרה ספציפית לשם חיבה. |

כדי להתחבר באמצעות POP3, **משתמש POP3** חייב להיות כתובת הדוא"ל של כינוי שקיים עבור הדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">דומיינים של החשבון שלי <i class="fa fa-angle-right"></i></a> – וסיסמת ה-**IMAP** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

אנא עיין ב-[האם אתם תומכים ב-POP3](#do-you-support-pop3) לקבלת הוראות שלב אחר שלב.

### תצורת ממסר SMTP של Postfix {#postfix-smtp-relay-configuration}

ניתן להגדיר את Postfix להעביר אימיילים דרך שרתי ה-SMTP של Forward Email. זה שימושי עבור יישומי שרת שצריכים לשלוח אימיילים.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">זמן התקנה משוער:</strong>
<span>פחות מ-15 דקות</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
זה דורש תוכנית בתשלום עם גישת SMTP מופעלת.
</span>
</div>

#### התקנה {#installation}

1. התקנת Postfix בשרת שלך:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. במהלך ההתקנה, בחר "אתר אינטרנט" כאשר תתבקש להזין את סוג התצורה.

#### תצורה {#configuration}

1. ערוך את קובץ התצורה הראשי של Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. הוסף או שנה את ההגדרות הבאות:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. צור את קובץ סיסמת ה-SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. הוסף את פרטי ההעברה שלך לדוא"ל:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. אבטחו וגיבבו את קובץ הסיסמה:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. הפעל מחדש את Postfix:

```bash
sudo systemctl restart postfix
```

#### בדיקות {#testing}

בדוק את התצורה שלך על ידי שליחת דוא"ל ניסיון:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## אבטחה {#security}

### טכניקות מתקדמות להקשחת שרתים {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

"Forward Email" מיישמת טכניקות רבות להקשחת שרתים כדי להבטיח את אבטחת התשתית שלנו והנתונים שלך:

1. **אבטחת רשת**:
* חומת אש עם טבלאות IP ותקנות נוקשות
* Fail2ban להגנה מפני כוח גס (brute force)
* ביקורות אבטחה ובדיקות חדירה תקופתיות
* גישת ניהול ל-VPN בלבד

2. **הקשחת מערכת**:
* התקנה מינימלית של חבילות
* עדכוני אבטחה שוטפים
* SELinux במצב אכיפה
* גישת SSH root מושבתת
* אימות מבוסס מפתח בלבד

3. **אבטחת יישומים**:
* כותרות מדיניות אבטחת תוכן (CSP)
* אבטחת תעבורה קפדנית של HTTPS (HSTS)
* כותרות הגנה של XSS
* אפשרויות מסגרת וכותרות מדיניות מפנה
* ביקורות תלויות תקופתיות

4. **הגנה על נתונים**:
* הצפנת דיסק מלאה עם LUKS
* ניהול מפתחות מאובטח
* גיבויים קבועים עם הצפנה
* שיטות מזעור נתונים

5. **ניטור ותגובה**:
* זיהוי חדירות בזמן אמת
* סריקת אבטחה אוטומטית
* רישום וניתוח מרכזיים
* נהלי תגובה לאירועים

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### האם יש לך הסמכות SOC 2 או ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

לשירות "העברת דוא"ל" אין ישירות הסמכות SOC 2 Type II או ISO 27001. עם זאת, השירות פועל על תשתית המסופקת על ידי מעבדי משנה מוסמכים:

* **DigitalOcean**: הסמכת SOC 2 Type II ו-SOC 3 Type II (מבוקר על ידי Schellman & Company LLC), הסמכת ISO 27001 במרכזי נתונים מרובים. פרטים: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: מוסמך SOC 2+ (HIPAA), אישורי ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. פרטים: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: תואם SOC 2 (צרו קשר ישירות עם DataPacket לקבלת הסמכה), ספק תשתית ברמה ארגונית (מיקום דנבר). פרטים: <https://www.datapacket.com/datacenters/denver>

"העברת דוא"ל" פועלת לפי שיטות העבודה המומלצות בתעשייה לביקורות אבטחה ומקיימת שיתוף פעולה קבוע עם חוקרי אבטחה עצמאיים. מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### האם אתה משתמש בהצפנת TLS להעברת דוא"ל {#do-you-use-tls-encryption-for-email-forwarding}

כן. העברת דוא"ל אוכפת בקפדנות את TLS 1.2+ עבור כל החיבורים (HTTPS, SMTP, IMAP, POP3) ומיישמת MTA-STS לתמיכה משופרת ב-TLS. היישום כולל:

* אכיפת TLS 1.2+ לכל חיבורי הדוא"ל
* החלפת מפתחות ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) לסודיות קדימה מושלמת
* חבילות הצפנה מודרניות עם עדכוני אבטחה שוטפים
* תמיכה ב-HTTP/2 לשיפור הביצועים והאבטחה
* HSTS (HTTP Strict Transport Security) עם טעינה מראש בדפדפנים העיקריים
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** לאכיפת TLS קפדנית

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**הטמעת MTA-STS**: העברת דוא"ל מיישמת אכיפה קפדנית של MTA-STS בבסיס הקוד. כאשר מתרחשות שגיאות TLS ו-MTA-STS נאכף, המערכת מחזירה 421 קודי סטטוס של SMTP כדי להבטיח שאימיילים יעברו ניסיון חוזר מאוחר יותר במקום שיישלחו בצורה לא מאובטחת. פרטי הטמעה:

* זיהוי שגיאות TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* אכיפת MTA-STS בעוזר שליחת דוא"ל: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

אימות צד שלישי: <https://www.hardenize.com/report/forwardemail.net/1750312779> מציג דירוגים "טוב" עבור כל TLS ואמצעי אבטחת התעבורה.

### האם אתם שומרים על כותרות אימות דוא"ל {#do-you-preserve-email-authentication-headers}

כן. העברת דוא"ל מיישמת ושומרת באופן מקיף כותרות אימות דוא"ל:

* **SPF (מסגרת מדיניות שולחים)**: מיושם ונשמר כראוי
* **DKIM (דואר מזהה מפתחות דוא"ל)**: תמיכה מלאה עם ניהול מפתחות תקין
* **DMARC**: אכיפת מדיניות עבור הודעות דוא"ל שנכשלות באימות SPF או DKIM
* **ARC**: למרות שלא פורטו במפורש, ציוני התאימות המושלמים של השירות מצביעים על טיפול מקיף בכותרות אימות

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

אימות: מבחן הדואר של Internet.nl מראה ציון 100/100 במיוחד עבור יישום "SPF, DKIM ו-DMARC". הערכת Hardenize מאשרת דירוגים "טוב" עבור SPF ו-DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### האם אתם שומרים על כותרות דוא"ל מקוריות ומונעים זיופים? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

העברת דוא"ל שומרת על כותרות דוא"ל מקוריות תוך יישום הגנה מקיפה מפני זיופים דרך בסיס הקוד של MX:

* **שימור כותרת**: כותרות אימות מקוריות נשמרות במהלך העברה
* **מניעת זיופים**: אכיפת מדיניות DMARC מונעת זיוף כותרות על ידי דחיית הודעות דוא"ל שנכשלות באימות SPF או DKIM
* **מניעת הזרקת כותרות**: אימות וחיטוי קלט באמצעות ספריית striptags
* **הגנה מתקדמת**: זיהוי פישינג מתוחכם עם זיהוי זיופים, מניעת התחזות ומערכות התראות למשתמש

**פרטי יישום MX**: לוגיקת עיבוד הדוא"ל המרכזית מטופלת על ידי בסיס הקוד של שרת ה-MX, ובפרט:

* מטפל נתוני MX ראשי: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* סינון דוא"ל שרירותי (נגד זיופים): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

העוזר `isArbitrary` מיישם כללי הגנה מתוחכמים נגד זיופים, כולל זיהוי התחזות לדומיין, ביטויים חסומים ודפוסי פישינג שונים.

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### כיצד אתם מגנים מפני ספאם וניצול לרעה {#how-do-you-protect-against-spam-and-abuse}

העברת דוא"ל מיישמת הגנה מקיפה מרובת שכבות:

* **הגבלת קצב**: מוחלת על ניסיונות אימות, נקודות קצה של API וחיבורי SMTP
* **בידוד משאבים**: בין משתמשים כדי למנוע השפעה ממשתמשים בנפח גבוה
* **הגנה מפני DDoS**: הגנה רב-שכבתית באמצעות מערכת Shield של DataPacket ו-Cloudflare
* **קנה מידה אוטומטי**: התאמת משאבים דינמית המבוססת על דרישה
* **מניעת שימוש לרעה**: בדיקות מניעת שימוש לרעה ספציפיות למשתמש וחסימה מבוססת גיבוב עבור תוכן זדוני
* **אימות דוא"ל**: פרוטוקולי SPF, DKIM, DMARC עם זיהוי פישינג מתקדם

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (פרטי הגנה מפני DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### האם אתם מאחסנים תוכן דוא"ל בדיסק {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **ארכיטקטורת אפס ידע**: תיבות דואר של SQLite מוצפנות בנפרד פירושן שדואר אלקטרוני מורחב אינו יכול לגשת לתוכן הדוא"ל
* **עיבוד בזיכרון**: עיבוד הדוא"ל מתרחש כולו בזיכרון, תוך הימנעות מאחסון בדיסק
* **ללא רישום תוכן**: "איננו רושמים או מאחסנים תוכן או מטא-דאטה של דוא"ל בדיסק"
* **הצפנה בארגז חול**: מפתחות הצפנה לעולם אינם מאוחסנים בדיסק בטקסט רגיל

**ראיות לבסיס קוד MX**: שרת ה-MX מעבד מיילים לחלוטין בזיכרון מבלי לכתוב תוכן לדיסק. מטפל עיבוד הדוא"ל הראשי מדגים גישה זו בזיכרון: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (תקציר)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (פרטי אפס ידע)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (הצפנה בארגז חול)

### האם תוכן דוא"ל יכול להיחשף במהלך קריסות מערכת {#can-email-content-be-exposed-during-system-crashes}

לא. העברת דוא"ל מיישמת אמצעי הגנה מקיפים מפני חשיפת נתונים הקשורה לקריסות:

* **Core Dumps מושבתים**: מונע חשיפת זיכרון במהלך קריסות
* **Swap Memory מושבת**: מושבת לחלוטין כדי למנוע חילוץ נתונים רגישים מקבצי swap
* **In-Memory Architecture**: תוכן דוא"ל קיים רק בזיכרון נדיף במהלך העיבוד
* **Encryption Key Protection**: מפתחות לעולם לא מאוחסנים בדיסק בטקסט רגיל
* **Physical Security**: דיסקים מוצפנים של LUKS v2 מונעים גישה פיזית לנתונים
* **USB Storage מושבת**: מונע חילוץ נתונים לא מורשה

**טיפול בשגיאות בבעיות מערכת**: העברת דוא"ל משתמשת בפונקציות העזר `isCodeBug` ו- `isTimeoutError` כדי להבטיח שאם מתרחשות בעיות קישוריות למסד נתונים, בעיות ברשת/רשימת חסימות DNS או בעיות קישוריות במעלה הזרם, המערכת מחזירה קודי סטטוס SMTP 421 כדי להבטיח שאימיילים ינסו לשלוח אותם מאוחר יותר ולא יאבדו או יחשפו.

פרטי יישום:

* סיווג שגיאה: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* טיפול בשגיאות פסק זמן בעיבוד MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### למי יש גישה לתשתית הדוא"ל שלך {#who-has-access-to-your-email-infrastructure}

Forward Email מיישמת בקרות גישה מקיפות לצוות ההנדסה המינימלי שלה, המונה 2-3 אנשים, עם דרישות 2FA מחמירות:

* **בקרת גישה מבוססת תפקידים**: עבור חשבונות צוות עם הרשאות מבוססות משאבים
* **עקרון ההרשאות הנמוכות ביותר**: מיושם בכל המערכות
* **הפרדת תפקידים**: בין תפקידים תפעוליים
* **ניהול משתמשים**: הפרדת משתמשים בפריסה ו-devops עם הרשאות נפרדות
* **התחברות Root מושבתת**: כופה גישה דרך חשבונות מאומתים כראוי
* **2FA קפדני**: אין 2FA מבוסס SMS עקב סיכון להתקפות MiTM - רק אסימוני אפליקציה או חומרה
* **רישום ביקורת מקיף**: עם הסרת נתונים רגישים
* **זיהוי אנומליות אוטומטי**: עבור דפוסי גישה חריגים
* **סקירות אבטחה תקופתיות**: של יומני גישה
* **מניעת התקפות Evil Maid**: אחסון USB מושבת ואמצעי אבטחה פיזיים אחרים

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (בקרות הרשאה)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (אבטחת רשת)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (מניעת התקפת "Evil Maid")

### אילו ספקי תשתית אתה משתמש בהם {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

פרטים מלאים זמינים בדף התאימות שלנו לתקנות ה-GDPR: <https://forwardemail.net/gdpr>

**מעבדי משנה ראשיים של התשתית:**

| ספק | מסגרת פרטיות נתונים מוסמכת | דף תאימות GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **קלאודפליי** | ✅ כן | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **חבילת נתונים** | ❌ לא | <https://www.datapacket.com/privacy-policy> |
| **אוקיינוס דיגיטלי** | ❌ לא | <https://www.digitalocean.com/legal/gdpr> |
| **וולטר** | ❌ לא | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**הסמכות מפורטות:**

**אוקיינוס דיגיטלי**

* SOC 2 Type II ו-SOC 3 Type II (מבוקר על ידי Schellman & Company LLC)
* מוסמך ISO 27001 במרכזי נתונים מרובים
* תואם PCI-DSS
* מוסמך CSA STAR Level 1
* מוסמך APEC CBPR PRP
* פרטים: <https://www.digitalocean.com/trust/certification-reports>

**וולטר**

* מוסמך SOC 2+ (HIPAA)
* תואם לתקן PCI Merchant
* מוסמך CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* פרטים: <https://www.vultr.com/legal/compliance/>

**חבילת נתונים**

* תאימות SOC 2 (צרו קשר ישירות עם DataPacket לקבלת הסמכה)
* תשתית ברמה ארגונית (מיקום דנבר)
* הגנה מפני DDoS באמצעות מחסנית אבטחת הסייבר של Shield
* תמיכה טכנית 24/7
* רשת עולמית ב-58 מרכזי נתונים
* פרטים: <https://www.datapacket.com/datacenters/denver>

**מעבדי תשלומים:**

* **Stripe**: מאושר על ידי מסגרת פרטיות הנתונים - <https://stripe.com/legal/privacy-center>
* **PayPal**: לא מאושר על ידי DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### האם אתם מציעים הסכם עיבוד נתונים (DPA)? {#do-you-offer-a-data-processing-agreement-dpa}

כן, Forward Email מציעה הסכם עיבוד נתונים (DPA) מקיף שניתן לחתום עליו עם הסכם הארגון שלנו. עותק של ה-DPA שלנו זמין בכתובת: <https://forwardemail.net/dpa>

**פרטי הסכם הגנה על מידע:**

* מכסה תאימות ל-GDPR ומסגרות מגן הפרטיות של האיחוד האירופי-ארה"ב/שוויץ-ארה"ב
* מתקבל אוטומטית בעת הסכמה לתנאי השירות שלנו
* אין צורך בחתימה נפרדת עבור הסכם הגנה על מידע סטנדרטי
* הסדרי הסכם הגנה על מידע מותאמים אישית זמינים דרך רישיון ארגוני

**מסגרת תאימות ל-GDPR:**
הסכם עיבוד הנתונים שלנו מפרט את תאימות ה-GDPR וכן את דרישות העברת הנתונים הבינלאומיות. מידע מלא זמין בכתובת: <https://forwardemail.net/gdpr>

עבור לקוחות ארגוניים הזקוקים לתנאי DPA מותאמים אישית או להסדרים חוזיים ספציפיים, ניתן לטפל בהם באמצעות תוכנית **רישיון ארגוני (250 דולר לחודש)** שלנו.

### כיצד אתם מטפלים בהודעות על פרצות נתונים {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **חשיפה מוגבלת לנתונים**: לא ניתן לגשת לתוכן דוא"ל מוצפן עקב ארכיטקטורת אפס ידע
* **איסוף נתונים מינימלי**: רק מידע בסיסי על המנוי ויומני IP מוגבלים לצורך אבטחה
* **מסגרות מעבד משנה**: DigitalOcean ו-Vultr מתקיימות נהלי תגובה לאירועים תואמי GDPR

**מידע על נציג GDPR:**
Forward Email מינתה נציגי GDPR בהתאם לסעיף 27:

**נציג האיחוד האירופי:**
Osano International Compliance Services Limited
לידי: LFHC
3 Dublin Landings, North Wall Quay
דבלין 1, D01C4E0

**נציג בבריטניה:**
Osano UK Compliance LTD
לידי: LFHC
רחוב פאונטיין 42-46, בלפסט
אנטרים, BT1 - 5EF

עבור לקוחות ארגוניים הזקוקים להסכמי רמת שירות ספציפיים בנוגע לדיווח על הפרות גישה, יש לדון בהם כחלק מהסכם **רישיון ארגוני**.

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### האם אתם מציעים סביבת בדיקה {#do-you-offer-a-test-environment}

התיעוד הטכני של "העברת דוא"ל" אינו מתאר במפורש מצב "ארגז חול" ייעודי. עם זאת, גישות בדיקה אפשריות כוללות:

* **אפשרות אירוח עצמי**: יכולות אירוח עצמי מקיפות ליצירת סביבות בדיקה
* **ממשק API**: פוטנציאל לבדיקות תכנותיות של תצורות
* **קוד פתוח**: קוד קוד פתוח לחלוטין מאפשר ללקוחות לבחון את לוגיקת ההעברה
* **דומיינים מרובים**: תמיכה בדומיינים מרובים עשויה לאפשר יצירת דומיין בדיקה

עבור לקוחות ארגוניים הזקוקים ליכולות ארגז חול רשמיות, יש לדון בכך כחלק מהסדר **רישיון ארגוני**.

מקור: <https://github.com/forwardemail/forwardemail.net> (פרטי סביבת פיתוח)

### האם אתם מספקים כלי ניטור והתראות {#do-you-provide-monitoring-and-alerting-tools}

העברת דוא"ל מספקת ניטור בזמן אמת עם כמה מגבלות:

**זָמִין:**

* **ניטור מסירה בזמן אמת**: מדדי ביצועים גלויים לציבור עבור ספקי דוא"ל גדולים
* **התראות אוטומטיות**: צוות ההנדסה מקבל התראה כאשר זמני המסירה עולים על 10 שניות
* **ניטור שקוף**: מערכות ניטור קוד פתוח לחלוטין
* **ניטור תשתיות**: זיהוי אנומליות אוטומטי ורישום מקיף של ביקורת

**מגבלות:**

* Webhooks הפונים ללקוחות או הודעות סטטוס משלוח מבוססות API אינן מתועדות במפורש

עבור לקוחות ארגוניים הזקוקים ל-webhooks מפורטים של סטטוס אספקה או אינטגרציות ניטור מותאמות אישית, יכולות אלו עשויות להיות זמינות באמצעות הסכמי **רישיון ארגוני**.

מקורות:

* <https://forwardemail.net> (תצוגת ניטור בזמן אמת)
* <https://github.com/forwardemail/forwardemail.net> (יישום ניטור)

### כיצד מבטיחים זמינות גבוהה {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **תשתית מבוזרת**: ספקים מרובים (DigitalOcean, Vultr, DataPacket) על פני אזורים גיאוגרפיים
* **איזון עומסים גיאוגרפי**: איזון עומסים מבוסס Cloudflare עם גיבוי אוטומטי
* **קנה מידה אוטומטי**: התאמת משאבים דינמית המבוססת על דרישה
* **הגנה רב-שכבתית מפני DDoS**: באמצעות מערכת Shield של DataPacket ו-Cloudflare
* **יתירות שרתים**: שרתים מרובים בכל אזור עם גיבוי אוטומטי
* **שכפול מסד נתונים**: סנכרון נתונים בזמן אמת על פני מיקומים מרובים
* **ניטור והתראות**: ניטור 24/7 עם תגובה אוטומטית לאירועים

**התחייבות לזמן פעולה**: זמינות שירות של 99.9%+ עם ניטור שקוף זמין בכתובת <https://forwardemail.net>

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### האם אתה עומד בדרישות סעיף 889 של חוק הרשאות ההגנה הלאומית (NDAA)? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

כן, העברת דוא"ל עומדת בדרישות **סעיף 889**. סעיף 889 בחוק הרשאות ההגנה הלאומי (NDAA) אוסר על סוכנויות ממשלתיות להשתמש או להתקשר עם גופים המשתמשים בציוד תקשורת ומעקב וידאו מחברות ספציפיות (Huawei, ZTE, Hikvision, Dahua ו-Hytera).

**כיצד דוא"ל המשך משיג תאימות לסעיף 889:**

העברת דוא"ל מסתמכת אך ורק על שני ספקי תשתית מרכזיים, שאף אחד מהם אינו משתמש בציוד אסור לפי סעיף 889:

1. **Cloudflare**: השותף העיקרי שלנו לשירותי רשת ואבטחת דוא"ל
2. **DataPacket**: הספק העיקרי שלנו לתשתית שרתים (באמצעות ציוד של Arista Networks ו-Cisco באופן בלעדי)
3. **ספקי גיבוי**: ספקי הגיבוי שלנו של Digital Ocean ו-Vultr מאושרים בנוסף בכתב כעומדים בתקן סעיף 889.

**התחייבות Cloudflare**: Cloudflare מצהירה במפורש בקוד ההתנהגות של צד שלישי כי היא אינה משתמשת בציוד תקשורת, מוצרי מעקב וידאו או שירותים מכל ישות אסורה לפי סעיף 889.

**מקרה שימוש ממשלתי**: תאימותנו לתקנות סעיף 889 אומתה כאשר **אקדמיה ימית ארה"ב** בחרה ב"העברת דוא"ל" (Forward Email) עבור צורכי העברת הדוא"ל המאובטחת שלה, תוך דרישה לתיעוד של תקני התאימות הפדרליים שלנו.

לפרטים מלאים על מסגרת הציות הממשלתית שלנו, כולל תקנות פדרליות רחבות יותר, קראו את מחקר המקרה המקיף שלנו: [שירות הדוא"ל של הממשל הפדרלי תואם לסעיף 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## פרטים טכניים ומערכת {#system-and-technical-details}

### האם אתם מאחסנים אימיילים ותוכנם? {#do-you-store-emails-and-their-contents}

לא, אנחנו לא כותבים לדיסק או מאחסנים יומני רישום – עם [למעט שגיאות](#do-you-store-error-logs) ו-[SMTP יוצא](#do-you-support-sending-email-with-smtp) (ראו את [מדיניות פרטיות](/privacy) שלנו).

הכל נעשה בזיכרון ו-[קוד המקור שלנו נמצא ב-GitHub](https://github.com/forwardemail).

### כיצד פועלת מערכת העברת הדוא"ל שלך {#how-does-your-email-forwarding-system-work}

דוא"ל מסתמך על [פרוטוקול SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). פרוטוקול זה מורכב מפקודות הנשלחות לשרת (הפועל לרוב על פורט 25). יש חיבור ראשוני, לאחר מכן השולח מציין ממי הדוא"ל מגיע ("MAIL FROM"), לאחר מכן לאן הוא מגיע ("RCPT TO"), ולבסוף הכותרות וגוף הדוא"ל עצמו ("DATA"). זרימת מערכת העברת הדוא"ל שלנו מתוארת ביחס לכל פקודת פרוטוקול SMTP להלן:

* חיבור ראשוני (ללא שם פקודה, לדוגמה `telnet example.com 25`) - זהו החיבור הראשוני. אנו בודקים שולחים שאינם נמצאים ב-[רשימת היתרים](#do-you-have-an-allowlist) שלנו מול [רשימת הסירובים](#do-you-have-a-denylist) שלנו. לבסוף, אם שולח אינו ברשימת ההיתרים שלנו, אנו בודקים אם הוא היה [ברשימה אפורה](#do-you-have-a-greylist).

* `HELO` - קוד זה מציין ברכה לזיהוי ה-FQDN, כתובת ה-IP או שם מטפל הדואר של השולח. ערך זה יכול להיות מזויף, לכן איננו מסתמכים על נתונים אלה ובמקום זאת משתמשים בחיפוש שם מארח הפוך של כתובת ה-IP של החיבור.

* `MAIL FROM` - ערך זה מציין את כתובת הדואר המוגשת במעטפה של האימייל. אם מוזן ערך, הוא חייב להיות כתובת דוא"ל חוקית מסוג RFC 5322. ערכים ריקים מותרים. אנו [בדיקת פיזור אחורי](#how-do-you-protect-against-backscatter) כאן, וגם בודקים את ה-MAIL FROM מול ה-[רשימת הסירובים](#do-you-have-a-denylist) שלנו. לבסוף, אנו בודקים שולחים שאינם ברשימת ההיתרים לצורך הגבלת תעריפים (ראו את הסעיף בנושא [הגבלת קצב](#do-you-have-rate-limiting) ו-[רשימת היתרים](#do-you-have-an-allowlist) למידע נוסף).

* `RCPT TO` - קוד זה מציין את הנמענים של האימייל. אלה חייבות להיות כתובות אימייל תקפות מסוג RFC 5322. אנו מתירים עד 50 נמעני מעטפה לכל הודעה (זה שונה מכותרת ה"אל" באימייל). אנו בודקים גם כתובת [תוכנית כתיבה מחדש של השולח](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") תקפה כאן כדי להגן מפני זיופים עם שם הדומיין SRS שלנו.

* `DATA` - זהו החלק המרכזי של השירות שלנו, אשר מעבד דוא"ל. עיין בסעיף [איך מעבדים אימייל לצורך העברה](#how-do-you-process-an-email-for-forwarding) להלן לקבלת תובנות נוספות.

### כיצד מעבדים אימייל לצורך העברה {#how-do-you-process-an-email-for-forwarding}

סעיף זה מתאר את התהליך שלנו הקשור לפקודת פרוטוקול ה-SMTP `DATA` בסעיף [כיצד פועלת מערכת העברת הדוא"ל שלכם](#how-does-your-email-forwarding-system-work) לעיל – זהו האופן שבו אנו מעבדים את הכותרות, הגוף והאבטחה של אימייל, קובעים לאן יש לשלוח אותו וכיצד אנו מטפלים בחיבורים.

1. אם ההודעה חורגת מהגודל המרבי של 50 מגה-בייט, היא נדחית עם קוד שגיאה 552.

2. אם ההודעה לא הכילה כותרת "From", או אם אחד מהערכים בכותרת "From" אינו כתובות דוא"ל חוקיות של RFC 5322, היא נדחית עם קוד שגיאה 550.

3. אם להודעה היו יותר מ-25 כותרות "התקבל", נקבע שהיא נתקעה בלולאת הפניה מחדש, והיא נדחתה עם קוד שגיאה 550.

4. באמצעות טביעת האצבע של האימייל (ראו את הסעיף בנושא [טביעות אצבע](#how-do-you-determine-an-email-fingerprint)), נבדוק אם בוצע ניסיון לשלוח מחדש את ההודעה במשך יותר מ-5 ימים (מה שתואם ל-[התנהגות ברירת מחדל של תיקון פוסט](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), ואם כן, היא תידחה עם קוד שגיאה 550.

5. אנו מאחסנים בזיכרון את תוצאות סריקת האימייל באמצעות [סורק ספאם](https://spamscanner.net).

6. אם היו תוצאות שרירותיות מסורק הספאם, הוא נדחה עם קוד שגיאה 554. תוצאות שרירותיות כוללות רק את בדיקת GTUBE נכון למועד כתיבת שורות אלה. ראה <https://spamassassin.apache.org/gtube/> למידע נוסף.

7. נוסיף את הכותרות הבאות להודעה למטרות ניפוי שגיאות ומניעת שימוש לרעה:

* `Received` - אנו מוסיפים את כותרת ה-Received הסטנדרטית הזו עם כתובת IP ומארח של המקור, סוג השידור, פרטי חיבור TLS, תאריך/שעה ונמען.
* `X-Original-To` - הנמען המקורי של ההודעה:
* זה שימושי לקביעת היכן נמסרה הודעת דוא"ל במקור (בנוסף לכותרת "Received").
* זה נוסף על בסיס נמען בנפרד בזמן IMAP ו/או העברה מוסתרת (על מנת להגן על הפרטיות).
* `X-Forward-Email-Website` - מכיל קישור לאתר האינטרנט שלנו <https://forwardemail.net>
* `X-Forward-Email-Version` - הגרסה הנוכחית של [SemVer](https://semver.org/) מ-`package.json` של בסיס הקוד שלנו.
* `X-Forward-Email-Session-ID` - ערך מזהה סשן המשמש למטרות ניפוי באגים (חל רק בסביבות שאינן סביבות ייצור).
* `X-Forward-Email-Sender` - רשימה מופרדת בפסיקים המכילה את כתובת המעטפה המקורית של MAIL FROM (אם היא לא הייתה ריקה), את ה-FQDN של לקוח PTR הפוך (אם קיים) ואת כתובת ה-IP של השולח.
* `X-Forward-Email-ID` - זה חל רק על SMTP יוצא ומקושר למזהה הדוא"ל המאוחסן בחשבון שלי → דוא"ל.
* `X-Report-Abuse` - עם ערך של `abuse@forwardemail.net`.
* `X-Report-Abuse-To` - עם ערך של `abuse@forwardemail.net`.
* `X-Complaints-To` - עם ערך של `abuse@forwardemail.net`.

8. לאחר מכן נבדוק את ההודעה עבור [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), ו-[DMARC](https://en.wikipedia.org/wiki/DMARC).

* אם ההודעה נכשלה ב-DMARC ולדומיין הייתה מדיניות דחייה (לדוגמה, `p=reject` [היה במדיניות DMARC](https://wikipedia.org/wiki/DMARC)), היא נדחית עם קוד שגיאה 550. בדרך כלל ניתן למצוא מדיניות DMARC עבור דומיין ברשומת <strong class="notranslate">TXT</strong> של תת-דומיין `_dmarc` (לדוגמה, `dig _dmarc.example.com txt`).
* אם ההודעה נכשלה ב-SPF ולדומיין הייתה מדיניות כשל קשה (לדוגמה, `-all` היה במדיניות SPF בניגוד ל-`~all` או ללא מדיניות כלל), היא נדחית עם קוד שגיאה 550. בדרך כלל, ניתן למצוא מדיניות SPF עבור דומיין ברשומת ה-<strong class="notranslate">TXT</strong> עבור דומיין הבסיס (לדוגמה, `dig example.com txt`). עיין בסעיף זה למידע נוסף על [שליחת דואר כמו בג'ימייל](#can-i-send-mail-as-in-gmail-with-this) בנוגע ל-SPF.

9. כעת אנו מעבדים את נמעני ההודעה כפי שנאספו מהפקודה `RCPT TO` בסעיף [כיצד פועלת מערכת העברת הדוא"ל שלכם](#how-does-your-email-forwarding-system-work) לעיל. עבור כל נמען, אנו מבצעים את הפעולות הבאות:

* אנו מחפשים את רשומות ה-<strong class="notranslate">TXT</strong> של שם הדומיין (החלק שאחרי הסמל `@`, לדוגמה `example.com` אם כתובת הדוא"ל הייתה `test@example.com`). לדוגמה, אם הדומיין הוא `example.com` אנו מבצעים חיפוש DNS כגון `dig example.com txt`.
* אנו מנתחים את כל רשומות ה-<strong class="notranslate">TXT</strong> שמתחילות ב-`forward-email=` (תוכניות חינמיות) או `forward-email-site-verification=` (תוכניות בתשלום). שימו לב שאנו מנתחים את שתיהן, על מנת לעבד דוא"ל בזמן שמשתמש משדרג או משדרג תוכניות. * מרשומות ה-<strong class="notranslate">TXT</strong> המותחות, אנו מבצעים איטרציות עליהן כדי לחלץ את תצורת ההעברה (כמתואר בסעיף [איך מתחילים ומגדירים העברת דוא"ל](#how-do-i-get-started-and-set-up-email-forwarding) לעיל). שימו לב שאנו תומכים רק בערך `forward-email-site-verification=` אחד, ואם יסופק יותר מאחד, תתרחש שגיאת 550 והשולח יקבל הודעה חוזרת עבור נמען זה.
* באופן רקורסיבי אנו מבצעים איטרציות על תצורת ההעברה שחולצה כדי לקבוע העברה גלובלית, העברה מבוססת ביטוי רגולרי וכל תצורות ההעברה הנתמכות האחרות - המכונות כעת "כתובות ההעברה" שלנו.
* עבור כל כתובת העברה, אנו תומכים בחיפוש רקורסיבי אחד (אשר יתחיל את סדרת הפעולות הזו מחדש על הכתובת הנתונה). אם נמצאה התאמה רקורסיבית, תוצאת האב תוסר מכתובות ההעברה, והצאצאים יתווספו.
* כתובות העברה מנותחות לייחודיות (מכיוון שאנחנו לא רוצים לשלוח כפילויות לכתובת אחת או ליצור חיבורי לקוח SMTP מיותרים נוספים).
* עבור כל כתובת העברה, אנו מחפשים את שם הדומיין שלה מול נקודת הקצה של ה-API שלנו `/v1/max-forwarded-addresses` (על מנת לקבוע לכמה כתובות הדומיין רשאי להעביר דוא"ל לפי כינוי, לדוגמה 10 כברירת מחדל - ראו את הסעיף על [מגבלה מקסימלית על העברה לפי כינוי](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). אם חורגים ממגבלה זו, תתרחש שגיאה 550 והשולח יקבל הודעה חוזרת עבור נמען זה.
* אנו מחפשים את הגדרות הנמען המקורי מול נקודת הקצה של ה-API שלנו `/v1/settings`, התומכת בחיפוש עבור משתמשים בתשלום (עם גיבוי עבור משתמשים חינמיים). פעולה זו מחזירה אובייקט תצורה עבור הגדרות מתקדמות עבור `port` (מספר, לדוגמה `25`), `has_adult_content_protection` (בוליאני), `has_phishing_protection` (בוליאני), `has_executable_protection` (בוליאני), ו-`has_virus_protection` (בוליאני).
* בהתבסס על הגדרות אלו, אנו בודקים את תוצאות סריקת הספאם, ואם מתרחשות שגיאות כלשהן, ההודעה נדחית עם קוד שגיאה 554 (לדוגמה, אם `has_virus_protection` מופעל, נבדוק את תוצאות סריקת הספאם לאיתור וירוסים). שימו לב שכל משתמשי התוכנית החינמית יקבלו אישור לבדיקות נגד תוכן למבוגרים, פישינג, קבצי הרצה ווירוסים. כברירת מחדל, כל משתמשי התוכנית בתשלום רשומים גם הם, אך ניתן לשנות תצורה זו תחת דף ההגדרות עבור דומיין בלוח המחוונים של העברת דוא"ל).

10. עבור כל כתובת העברה של נמען שעברה עיבוד, אנו מבצעים את הפעולות הבאות:

* הכתובת נבדקת מול ה-[רשימת הסירובים](#do-you-have-a-denylist) שלנו, ואם היא רשומה, אז יופיע קוד שגיאה 421 (מציין לשולח לנסות שוב מאוחר יותר).
* אם הכתובת היא webhook, אז נגדיר ערך בוליאני לפעולות עתידיות (ראה להלן - אנו מקבצים יחד webhooks דומים כדי לבצע בקשת POST אחת לעומת מספר בקשות למשלוח).
* אם הכתובת היא כתובת דוא"ל, אז אנו מנתחים את המארח לפעולות עתידיות (ראה להלן - אנו מקבצים יחד מארחים דומים כדי ליצור חיבור אחד לעומת מספר חיבורים בודדים למשלוח).

11. אם אין נמענים ואין החזרות, נגיב עם שגיאה 550 של "נמענים לא חוקיים".

12. אם ישנם נמענים, אנו עוברים עליהם שוב ושוב (מקובצים יחד על ידי אותו מארח) ומספקים את האימיילים. עיין בסעיף [כיצד אתם מטפלים בבעיות משלוח דוא"ל](#how-do-you-handle-email-delivery-issues) להלן לקבלת תובנות נוספות.

* אם מתרחשות שגיאות כלשהן בעת שליחת מיילים, נאחסן אותן בזיכרון לעיבוד מאוחר יותר.
* ניקח את קוד השגיאה הנמוך ביותר (אם קיים) משליחת מיילים - ונשתמש בו כקוד התגובה לפקודה `DATA`. משמעות הדבר היא שמיילים שלא נמסרו בדרך כלל יישלחו שוב על ידי השולח המקורי, אך מיילים שכבר נמסרו לא יישלחו שוב בפעם הבאה שההודעה תישלח (כפי שאנו משתמשים ב-[טביעות אצבע](#how-do-you-determine-an-email-fingerprint)).
* אם לא אירעו שגיאות, נשלח קוד סטטוס תגובה מוצלח של 250 ב-SMTP.
* ניסיון מסירה מוחזר נחשב לכל ניסיון מסירה שמביא לקוד סטטוס של >= 500 (כשלים קבועים).

13. אם לא התרחשו החזרות (כשלים קבועים), נחזיר קוד סטטוס תגובת SMTP של קוד השגיאה הנמוך ביותר מכשלים לא קבועים (או קוד סטטוס מוצלח של 250 אם לא היו כאלה).

14. אם אכן התרחשו הודעות החזרה, נשלח הודעות החזרה ברקע לאחר שנחזיר לשולח את קוד השגיאה הנמוך ביותר מבין כל קוד השגיאה. עם זאת, אם קוד השגיאה הנמוך ביותר הוא >= 500, לא נשלח הודעות החזרה. הסיבה לכך היא שאם כן, השולחים יקבלו הודעות החזרה כפולות (למשל, אחת מ-MTA היוצא שלהם, כגון Gmail - וגם אחת מאיתנו). עיין בסעיף [איך מגנים מפני פיזור לאחור](#how-do-you-protect-against-backscatter) להלן לקבלת תובנות נוספות.

### כיצד אתם מטפלים בבעיות משלוח דוא"ל {#how-do-you-handle-email-delivery-issues}

שים לב שאנו נבצע שכתוב "Friendly-From" על המיילים אם ורק אם מדיניות ה-DMARC של השולח לא עברה ולא היו חתימות DKIM מיושרות עם הכותרת "מאת".  המשמעות היא שנשנה את הכותרת "מאת" בהודעה, נגדיר "X-Original-From", וגם נגדיר "Reply-To" אם היא לא הוגדרה כבר.  אנו גם נסגור מחדש את חותמת ARC בהודעה לאחר שינוי הכותרות הללו.

אנו משתמשים גם בניתוח חכם של הודעות שגיאה בכל רמה של המחסנית שלנו - בקוד שלנו, בקשות DNS, רכיבים פנימיים של Node.js, בקשות HTTP (למשל 408, 413 ו-429 ממופות לקוד תגובת ה-SMTP 421 אם הנמען הוא webhook), ותגובות שרת דואר (למשל תגובות עם "defer" או "slowdown" יעברו ניסיון חוזר כשגיאות 421).

הלוגיקה שלנו חסינה מפני תופעות לוואי (dummy proof) והיא תנסה שוב גם לאתר שגיאות SSL/TLS, בעיות חיבור ועוד. המטרה של בדיקת תופעות לוואי היא למקסם את יכולת המסירה לכל הנמענים עבור תצורת העברה.

אם הנמען הוא Webhook, נאפשר פסק זמן של 60 שניות להשלמת הבקשה עם עד 3 ניסיונות חוזרים (כלומר 4 בקשות בסך הכל לפני כישלון). שימו לב שאנו מנתחים נכון את קודי השגיאה 408, 413 ו-429 וממפים אותם לקוד תגובה של SMTP 421.

אחרת, אם הנמען הוא כתובת דוא"ל, ננסה לשלוח את הדוא"ל עם TLS אופורטוניסטי (אנו מנסים להשתמש ב-STARTTLS אם הוא זמין בשרת הדוא"ל של הנמען). אם מתרחשת שגיאת SSL/TLS בעת ניסיון לשלוח את הדוא"ל, ננסה לשלוח את הדוא"ל ללא TLS (מבלי להשתמש ב-STARTTLS).

אם מתרחשות שגיאות DNS או חיבור כלשהן, נחזיר לפקודת `DATA` קוד תגובה של SMTP של 421, אחרת אם יש שגיאות ברמה של >= 500, יישלחו הודעות החזרה (bounces).

אם נזהה ששרת דוא"ל שאליו אנו מנסים לשלוח הודעות חסום אחת או יותר מכתובות ה-IP של חילופי הדואר שלנו (למשל, על ידי טכנולוגיה כלשהי בה הם משתמשים לדחיית שולחי דואר זבל), נשלח קוד תגובה SMTP של 421 כדי שהשולח ינסה שוב את ההודעה שלו מאוחר יותר (ונקבל התראה על הבעיה כדי שנוכל לפתור אותה לפני הניסיון הבא).

### כיצד אתה מטפל בחסימת כתובות ה-IP שלך {#how-do-you-handle-your-ip-addresses-becoming-blocked}

אנו עוקבים באופן שוטף אחר כל רשימות מניעות ה-DNS העיקריות, ואם אחת מכתובות ה-IP של חילופי הדואר שלנו ("MX") רשומה ברשימת מניעות מרכזית, נסיר אותה מרשומת DNS A הרלוונטית במידת האפשר עד שהבעיה תיפתר.

נכון למועד כתיבת שורות אלה, אנו רשומים גם במספר רשימות היתרים של DNS, ואנו מתייחסים ברצינות לניטור רשימות דחייה. אם אתם נתקלים בבעיות כלשהן לפני שתהיה לנו הזדמנות לפתור אותן, אנא הודיעו לנו בכתב לכתובת <support@forwardemail.net>.

כתובות ה-IP שלנו זמינות לציבור, [עיין בסעיף זה למטה לקבלת תובנות נוספות](#what-are-your-servers-ip-addresses).

### מהן כתובות של מנהלי דואר {#what-are-postmaster-addresses}

על מנת למנוע הקפצות מכוונות שגויות ושליחת הודעות מגיבים לחופשה לתיבות דואר לא מפוקחות או לא קיימות, אנו מנהלים רשימה של שמות משתמש דואר-דימון:

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
* [וכל כתובת ללא מענה](#what-are-no-reply-addresses)

ראה [RFC 5320 סעיף 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) לקבלת תובנות נוספות כיצד רשימות כגון אלה משמשות ליצירת מערכות דוא"ל יעילות.

### מהן כתובות ללא מענה {#what-are-no-reply-addresses}

שמות משתמש בדוא"ל השווים לאחת מהאפשרויות הבאות (ללא תלות באותיות גדולות/קטנות) נחשבים לכתובות שאינן ניתנות למענה:

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

רשימה זו מתוחזקת על ידי [כפרויקט קוד פתוח ב-GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### מהן כתובות ה-IP של השרת שלך {#what-are-your-servers-ip-addresses}

אנו מפרסמים את כתובות ה-IP שלנו בכתובת <https://forwardemail.net/ips>.

### האם יש לך רשימת היתרים {#do-you-have-an-allowlist}

כן, יש לנו [רשימת סיומות שמות דומיין](#what-domain-name-extensions-are-allowlisted-by-default) שמופיע ברשימת היתרים כברירת מחדל ורשימת היתרים דינמית, המאוחסנת במטמון ומתגלגלת המבוססת על [קריטריונים מחמירים](#what-is-your-allowlist-criteria).

כל האימיילים, הדומיינים והנמענים של לקוחות בתוכניות בתשלום מתווספים אוטומטית לרשימת ההיתרים שלנו.

### אילו סיומות שם דומיין רשומות כברירת מחדל ברשימת ההיתרים {#what-domain-name-extensions-are-allowlisted-by-default}

סיומות שמות הדומיין הבאות נחשבות כרשומות ברשימת היתרים כברירת מחדל (בין אם הן נמצאות ברשימת הפופולריות של Umbrella ובין אם לאו):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">חינוך</code></li> <li class="list-inline-item"><code class="notranslate">ממשל</code></li> <li class="list-inline-item"><code class="notranslate">מיליון</code></li> <li class="list-inline-item"><code class="notranslate">אינטרנט</code></li> <li class="list-inline-item"><code class="notranslate">ארפא</code></li> <li class="list-inline-item"><code class="notranslate">דני.אס</code></li> <li class="list-inline-item"><code class="notranslate">פד.אס</code></li> <li class="list-inline-item"><code class="notranslate">אס.אס</code></li> <li class="list-inline-item"><code class="notranslate">kids.us</code></li> <li class="list-inline-item"><code class="notranslate">nsn.us</code></li> <li class="list-inline-item"><code class="notranslate">ak.us</code></li> <li class="list-inline-item"><code class="notranslate">al.us</code></li> <li class="list-inline-item"><code class="notranslate">ar.us</code></li> <li class="list-inline-item"><code class="notranslate">as.us</code></li> <li class="list-inline-item"><code class="notranslate">az.us</code></li> <li class="list-inline-item"><code class="notranslate">ca.us</code></li> <li class="list-inline-item"><code class="notranslate">co.us</code></li> <li class="list-inline-item"><code class="notranslate">ct.us</code></li> <li class="list-inline-item"><code class="notranslate">dc.us</code></li> <li class="list-inline-item"><code class="notranslate">de.us</code></li> <li class="list-inline-item"><code class="notranslate">fl.us</code></li> <li class="list-inline-item"><code class="notranslate">ga.us</code></li> <li class="list-inline-item"><code class="notranslate">gu.us</code></li> <li class="list-inline-item"><code class="notranslate">hi.us</code></li> <li class="list-inline-item"><code class="notranslate">ia.us</code></li> <li class="list-inline-item"><code class="notranslate">id.us</code></li> <li class="list-inline-item"><code class="notranslate">il.us</code></li> <li class="list-inline-item"><code class="notranslate">in.us</code></li> <li class="list-inline-item"><code class="notranslate">ks.us</code></li> <li class="list-inline-item"><code class="notranslate">ky.us</code></li> <li class="list-inline-item"><code class="notranslate">la.us</code></li> <li class="list-inline-item"><code class="notranslate">ma.us</code></li> <li class="list-inline-item"><code class="notranslate">md.us</code></li> <li class="list-inline-item"><code class="notranslate">me.us</code></li> <li class="list-inline-item"><code class="notranslate">mi.us</code></li> <li class="list-inline-item"><code class="notranslate">mn.us</code></li> <li class="list-inline-item"><code class="notranslate">mo.us</code></li> <li class="list-inline-item"><code class="notranslate">ms.us</code></li> <li class="list-inline-item"><code class="notranslate">mt.us</code></li> <li class="list-inline-item"><code class="notranslate">nc.us</code></li> <li class="list-inline-item"><code class="notranslate">nd.us</code></li> <li class="list-inline-item"><code class="notranslate">ne.us</code></li> <li class="list-inline-item"><code class="notranslate">nh.us</code></li> <li class="list-inline-item"><code class="notranslate">nm.us</code></li> <li class="list-inline-item"><code class="notranslate">nv.us</code></li> <li class="list-inline-item"><code class="notranslate">ny.us</code></li> <li class="list-inline-item"><code class="notranslate">oh.us</code></li> <li class="list-inline-item"><code class="notranslate">ok.us</code></li> <li class="list-inline-item"><code class="notranslate">or.us</code></li> <li class="list-inline-item"><code class="notranslate">pa.us</code></li> <li class="list-inline-item"><code class="notranslate">pr.us</code></li> <li class="list-inline-item"><code class="notranslate">ri.us</code></li> <li class="list-inline-item"><code class="notranslate">sc.us</code></li> <li class="list-inline-item"><code class="notranslate">sd.us</code></li> <li class="list-inline-item"><code class="notranslate">tn.us</code></li> <li class="list-inline-item"><code class="notranslate">tx.us</code></li> <li class="list-inline-item"><code class="notranslate">ut.us</code></li> <li class="list-inline-item"><code class="notranslate">va.us</code></li> <li class="list-inline-item"><code class="notranslate">vi.us</code></li> <li class="list-inline-item"><code class="notranslate">vt.us</code></li> <li class="list-inline-item"><code class="notranslate">wa.us</code></li> <li class="list-inline-item"><code class="notranslate">wi.us</code></li> <li class="list-inline-item"><code class="notranslate">wv.us</code></li> <li class="list-inline-item"><code class="notranslate">wy.us</code></li> <li class="list-inline-item"><code class="notranslate">mil.tt</code></li> <li class="list-inline-item"><code class="notranslate">edu.tt</code></li> <li class="list-inline-item"><code class="notranslate">edu.tr</code></li> <li class="list-inline-item"><code class="notranslate">edu.ua</code></li> <li class="list-inline-item"><code class="notranslate">edu.au</code></li> <li class="list-inline-item"><code class="notranslate">ac.at</code></li> <li class="list-inline-item"><code class="notranslate">edu.br</code></li> <li class="list-inline-item"><code class="notranslate">ac.nz</code></li> <li class="list-inline-item"><code class="notranslate">school.nz</code></li> <li class="list-inline-item"><code class="notranslate">cri.nz</code></li> <li class="list-inline-item"><code class="notranslate">health.nz</code></li> <li class="list-inline-item"><code class="notranslate">mil.nz</code></li> <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li> <li class="list-inline-item"><code class="notranslate">ac.in</code></li> <li class="list-inline-item"><code class="notranslate">edu.in</code></li> <li class="list-inline-item"><code class="notranslate">mil.in</code></li> <li class="list-inline-item"><code class="notranslate">ac.jp</code></li> <li class="list-inline-item"><code class="notranslate">ed.jp</code></li> <li class="list-inline-item"><code class="notranslate">lg.jp</code></li> <li class="list-inline-item"><code class="notranslate">ac.za</code></li> <li class="list-inline-item"><code class="notranslate">edu.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.za</code></li> <li class="list-inline-item"><code class="notranslate">school.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li> <li class="list-inline-item"><code class="notranslate">sch.lk</code></li> <li class="list-inline-item"><code class="notranslate">edu.lk</code></li> <li class="list-inline-item"><code class="notranslate">ac.th</code></li> <li class="list-inline-item"><code class="notranslate">mi.th</code></li> <li class="list-inline-item"><code class="notranslate">admin.ch</code></li> <li class="list-inline-item"><code class="notranslate">canada.ca</code></li> <li class="list-inline-item"><code class="notranslate">gc.ca</code></li> <li class="list-inline-item"><code class="notranslate">go.id</code></li> <li class="list-inline-item"><code class="notranslate">go.jp</code></li> <li class="list-inline-item"><code class="notranslate">go.ke</code></li> <li class="list-inline-item"><code class="notranslate">go.kr</code></li> <li class="list-inline-item"><code class="notranslate">go.th</code></li> <li class="list-inline-item"><code class="notranslate">gob.ar</code></li> <li class="list-inline-item"><code class="notranslate">gob.cl</code></li> <li class="list-inline-item"><code class="notranslate">gob.es</code></li> <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li> <li class="list-inline-item"><code class="notranslate">gov.af</code></li> <li class="list-inline-item"><code class="notranslate">gov.ai</code></li> <li class="list-inline-item"><code class="notranslate">gov.al</code></li> <li class="list-inline-item"><code class="notranslate">gov.am</code></li> <li class="list-inline-item"><code class="notranslate">gov.ao</code></li> <li class="list-inline-item"><code class="notranslate">gov.au</code></li> <li class="list-inline-item"><code class="notranslate">gov.aw</code></li> <li class="list-inline-item"><code class="notranslate">gov.ax</code></li> <li class="list-inline-item"><code class="notranslate">gov.az</code></li> <li class="list-inline-item"><code class="notranslate">gov.bd</code></li> <li class="list-inline-item"><code class="notranslate">gov.be</code></li> <li class="list-inline-item"><code class="notranslate">gov.bg</code></li> <li class="list-inline-item"><code class="notranslate">gov.bm</code></li> <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>--> <li class="list-inline-item"><code class="notranslate">gov.by</code></li> <li class="list-inline-item"><code class="notranslate">gov.cl</code></li> <li class="list-inline-item"><code class="notranslate">gov.cn</code></li> <li class="list-inline-item"><code class="notranslate">gov.co</code></li> <li class="list-inline-item"><code class="notranslate">gov.cy</code></li> <li class="list-inline-item"><code class="notranslate">gov.cz</code></li> <li class="list-inline-item"><code class="notranslate">gov.dz</code></li> <li class="list-inline-item"><code class="notranslate">gov.eg</code></li> <li class="list-inline-item"><code class="notranslate">gov.fi</code></li> <li class="list-inline-item"><code class="notranslate">gov.fk</code></li> <li class="list-inline-item"><code class="notranslate">gov.gg</code></li> <li class="list-inline-item"><code class="notranslate">gov.gr</code></li> <li class="list-inline-item"><code class="notranslate">gov.hk</code></li> <li class="list-inline-item"><code class="notranslate">gov.hr</code></li> <li class="list-inline-item"><code class="notranslate">gov.hu</code></li> <li class="list-inline-item"><code class="notranslate">gov.ie</code></li> <li class="list-inline-item"><code class="notranslate">gov.il</code></li> <li class="list-inline-item"><code class="notranslate">gov.im</code></li> <li class="list-inline-item"><code class="notranslate">gov.in</code></li> <li class="list-inline-item"><code class="notranslate">gov.iq</code></li> <li class="list-inline-item"><code class="notranslate">gov.ir</code></li> <li class="list-inline-item"><code class="notranslate">gov.it</code></li> <li class="list-inline-item"><code class="notranslate">gov.je</code></li> <li class="list-inline-item"><code class="notranslate">gov.kp</code></li> <li class="list-inline-item"><code class="notranslate">gov.krd</code></li> <li class="list-inline-item"><code class="notranslate">gov.ky</code></li> <li class="list-inline-item"><code class="notranslate">gov.kz</code></li> <li class="list-inline-item"><code class="notranslate">gov.lb</code></li> <li class="list-inline-item"><code class="notranslate">gov.lk</code></li> <li class="list-inline-item"><code class="notranslate">gov.lt</code></li> <li class="list-inline-item"><code class="notranslate">gov.lv</code></li> <li class="list-inline-item"><code class="notranslate">gov.ma</code></li> <li class="list-inline-item"><code class="notranslate">gov.mm</code></li> <li class="list-inline-item"><code class="notranslate">gov.mo</code></li> <li class="list-inline-item"><code class="notranslate">gov.mt</code></li> <li class="list-inline-item"><code class="notranslate">gov.my</code></li> <li class="list-inline-item"><code class="notranslate">gov.ng</code></li> <li class="list-inline-item"><code class="notranslate">gov.np</code></li> <li class="list-inline-item"><code class="notranslate">gov.ph</code></li> <li class="list-inline-item"><code class="notranslate">gov.pk</code></li> <li class="list-inline-item"><code class="notranslate">gov.pl</code></li> <li class="list-inline-item"><code class="notranslate">gov.pt</code></li> <li class="list-inline-item"><code class="notranslate">gov.py</code></li> <li class="list-inline-item"><code class="notranslate">gov.ro</code></li> <li class="list-inline-item"><code class="notranslate">gov.ru</code></li> <li class="list-inline-item"><code class="notranslate">gov.scot</code></li> <li class="list-inline-item"><code class="notranslate">gov.se</code></li> <li class="list-inline-item"><code class="notranslate">gov.sg</code></li> <li class="list-inline-item"><code class="notranslate">gov.si</code></li> <li class="list-inline-item"><code class="notranslate">gov.sk</code></li> <li class="list-inline-item"><code class="notranslate">gov.tr</code></li> <li class="list-inline-item"><code class="notranslate">gov.tt</code></li> <li class="list-inline-item"><code class="notranslate">gov.tw</code></li> <li class="list-inline-item"><code class="notranslate">gov.ua</code></li> <li class="list-inline-item"><code class="notranslate">gov.uk</code></li> <li class="list-inline-item"><code class="notranslate">gov.vn</code></li> <li class="list-inline-item"><code class="notranslate">gov.wales</code></li> <li class="list-inline-item"><code class="notranslate">gov.za</code></li> <li class="list-inline-item"><code class="notranslate">government.pn</code></li> <li class="list-inline-item"><code class="notranslate">govt.nz</code></li> <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>--> <li class="list-inline-item"><code class="notranslate">gv.at</code></li> <li class="list-inline-item"><code class="notranslate">ac.uk</code></li> <li class="list-inline-item"><code class="notranslate">bl.uk</code></li> <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li> <li class="list-inline-item"><code class="notranslate">mod.uk</code></li> <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li> <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li> <li class="list-inline-item"><code class="notranslate">police.uk</code></li> <li class="list-inline-item"><code class="notranslate">rct.uk</code></li> <li class="list-inline-item"><code class="notranslate">royal.uk</code></li> <li class="list-inline-item"><code class="notranslate">sch.uk</code></li> <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

בנוסף, [מותג ודומיינים ברמה עליונה של החברה](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) אלה מופיעים ברשימת היתרים כברירת מחדל (לדוגמה, `apple` עבור `applecard.apple` עבור דפי חשבון בנק של Apple Card):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">aaa</code></li> <li class="list-inline-item"><code class="notranslate">aarp</code></li> <li class="list-inline-item"><code class="notranslate">abarth</code></li> <li class="list-inline-item"><code class="notranslate">abb</code></li> <li class="list-inline-item"><code class="notranslate">abbott</code></li> <li class="list-inline-item"><code class="notranslate">abbvie</code></li> <li class="list-inline-item"><code class="notranslate">abc</code></li> <li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li> <li class="list-inline-item"><code class="notranslate">aeg</code></li> <li class="list-inline-item"><code class="notranslate">atna</code></li> <li class="list-inline-item"><code class="notranslate">afl</code></li> <li class="list-inline-item"><code class="notranslate">agakhan</code></li> <li class="list-inline-item"><code class="notranslate">aig</code></li> <li class="list-inline-item"><code class="notranslate">aigo</code></li> <li class="list-inline-item"><code class="notranslate">איירבוס</code></li> <li class="list-inline-item"><code class="notranslate">איירטל</code></li> <li class="list-inline-item"><code class="notranslate">אקדן</code></li> <li class="list-inline-item"><code class="notranslate">אלפארומאו</code></li> <li class="list-inline-item"><code class="notranslate">אליבאבא</code></li> <li class="list-inline-item"><code class="notranslate">אליפיי</code></li> <li class="list-inline-item"><code class="notranslate">אלפיננזה</code></li> <li class="list-inline-item"><code class="notranslate">אלסטייט</code></li> <li class="list-inline-item"><code class="notranslate">אלי</code></li> <li class="list-inline-item"><code class="notranslate">אלסטום</code></li> <li class="list-inline-item"><code class="notranslate">אמזון</code></li> <li class="list-inline-item"><code class="notranslate">אמריקן אקספרס</code></li> <li class="list-inline-item"><code class="notranslate">אמריקן אקספרס</code></li> <li class="list-inline-item"><code class="notranslate">אמריקן אקספרס</code></li> <li class="list-inline-item"><code class="notranslate">אמריקן אקספרס</code></li> <li class="list-inline-item"><code class="notranslate">אמריקן אקספרס</code></li> <li class="list-inline-item"><code class="notranslate">אנדרואיד</code></li> <li class="list-inline-item"><code class="notranslate">אנז</code></li> <li class="list-inline-item"><code class="notranslate">אאול</code></li> <li class="list-inline-item"><code class="notranslate">אפל</code></li> <li class="list-inline-item"><code class="notranslate">אקוורל</code></li> <li class="list-inline-item"><code class="notranslate">ארמקו</code></li> <li class="list-inline-item"><code class="notranslate">אאודי</code></li> <li class="list-inline-item"><code class="notranslate">אוספוסט</code></li> <li class="list-inline-item"><code class="notranslate">אוס</code></li> <li class="list-inline-item"><code class="notranslate">אקסה</code></li> <li class="list-inline-item"><code class="notranslate">תכלת</code></li> <li class="list-inline-item"><code class="notranslate">באידו</code></li> <li class="list-inline-item"><code class="notranslate">בננה רפובליק</code></li> <li class="list-inline-item"><code class="notranslate">ברקלייקארד</code></li> <li class="list-inline-item"><code class="notranslate">ברקליס</code></li> <li class="list-inline-item"><code class="notranslate">כדורסל</code></li> <li class="list-inline-item"><code class="notranslate">באוהאוס</code></li> <li class="list-inline-item"><code class="notranslate">בי.בי.סי.</code></li> <li class="list-inline-item"><code class="notranslate">בי.בי.סי.</code></li> <li class="list-inline-item"><code class="notranslate">בי.בי.סי.</code></li> <li class="list-inline-item"><code class="notranslate">בי.בי.סי.</code></li> <li class="list-inline-item"><code class="notranslate">bbva</code></li> <li class="list-inline-item"><code class="notranslate">bcg</code></li> <li class="list-inline-item"><code class="notranslate">בנטלי</code></li> <li class="list-inline-item"><code class="notranslate">בהארטי</code></li> <li class="list-inline-item"><code class="notranslate">בינג</code></li> <li class="list-inline-item"><code class="notranslate">בלאנקו</code></li> <li class="list-inline-item"><code class="notranslate">בלומברג</code></li> <li class="list-inline-item"><code class="notranslate">bms</code></li> <li class="list-inline-item"><code class="notranslate">bmw</code></li> <li class="list-inline-item"><code class="notranslate">bnl</code></li> <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li> <li class="list-inline-item"><code class="notranslate">boehringer</code></li> <li class="list-inline-item"><code class="notranslate">bond</code></li> <li class="list-inline-item"><code class="notranslate">הזמנה</code></li> <li class="list-inline-item"><code class="notranslate">בוש</code></li> <li class="list-inline-item"><code class="notranslate">בוסטיק</code></li> <li class="list-inline-item"><code class="notranslate">ברידסקו</code></li> <li class="list-inline-item"><code class="notranslate">ברידג'סטון</code></li> <li class="list-inline-item"><code class="notranslate">בראדר</code></li> <li class="list-inline-item"><code class="notranslate">בוגאטי</code></li> <li class="list-inline-item"><code class="notranslate">קאלווינקליין</code></li> <li class="list-inline-item"><code class="notranslate">קאנון</code></li> <li class="list-inline-item"><code class="notranslate">קפיטאלון</code></li> <li class="list-inline-item"><code class="notranslate">קרוואן</code></li> <li class="list-inline-item"><code class="notranslate">קרטייה</code></li> <li class="list-inline-item"><code class="notranslate">cba</code></li> <li class="list-inline-item"><code class="notranslate">cbn</code></li> <li class="list-inline-item"><code class="notranslate">cbre</code></li> <li class="list-inline-item"><code class="notranslate">cbs</code></li> <li class="list-inline-item"><code class="notranslate">cern</code></li> <li class="list-inline-item"><code class="notranslate">cfa</code></li> <li class="list-inline-item"><code class="notranslate">שאנל</code></li> <li class="list-inline-item"><code class="notranslate">צ'ייס</code></li> <li class="list-inline-item"><code class="notranslate">צ'ינטאי</code></li> <li class="list-inline-item"><code class="notranslate">כרום</code></li> <li class="list-inline-item"><code class="notranslate">קרייזלר</code></li> <li class="list-inline-item"><code class="notranslate">ציפריאני</code></li> <li class="list-inline-item"><code class="notranslate">סיסקו</code></li> <li class="list-inline-item"><code class="notranslate">מצודה</code></li> <li class="list-inline-item"><code class="notranslate">citi</code></li> <li class="list-inline-item"><code class="notranslate">citic</code></li> <li class="list-inline-item"><code class="notranslate">clubmed</code></li> <li class="list-inline-item"><code class="notranslate">comcast</code></li> <li class="list-inline-item"><code class="notranslate">commbank</code></li> <li class="list-inline-item"><code class="notranslate">קרדיטיוניון</code></li> <li class="list-inline-item"><code class="notranslate">כתר</code></li> <li class="list-inline-item"><code class="notranslate">crs</code></li> <li class="list-inline-item"><code class="notranslate">csc</code></li> <li class="list-inline-item"><code class="notranslate">קויזינלה</code></li> <li class="list-inline-item"><code class="notranslate">דאבור</code></li> <li class="list-inline-item"><code class="notranslate">דאטסון</code></li> <li class="list-inline-item"><code class="notranslate">סוחר</code></li> <li class="list-inline-item"><code class="notranslate">דל</code></li> <li class="list-inline-item"><code class="notranslate">דלויט</code></li> <li class="list-inline-item"><code class="notranslate">דלתא</code></li> <li class="list-inline-item"><code class="notranslate">דלתא</code></li> <li class="list-inline-item"><code class="notranslate">dhl</code></li> <li class="list-inline-item"><code class="notranslate">דיסקבר</code></li> <li class="list-inline-item"><code class="notranslate">דיש</code></li> <li class="list-inline-item"><code class="notranslate">דנפ</code></li> <li class="list-inline-item"><code class="notranslate">דונלופ</code></li> <li class="list-inline-item"><code class="notranslate">דופונט</code></li> <li class="list-inline-item"><code class="notranslate">דוואג</code></li> <li class="list-inline-item"><code class="notranslate">אדקה</code></li> <li class="list-inline-item"><code class="notranslate">אמריק</code></li> <li class="list-inline-item"><code class="notranslate">אפסון</code></li> <li class="list-inline-item"><code class="notranslate">אריקסון</code></li> <li class="list-inline-item"><code class="notranslate">ארני</code></li> <li class="list-inline-item"><code class="notranslate">ביטוח</code></li> <li class="list-inline-item"><code class="notranslate">אטיסלט</code></li> <li class="list-inline-item"><code class="notranslate">אירוויזיון</code></li> <li class="list-inline-item"><code class="notranslate">everbank</code></li> <li class="list-inline-item"><code class="notranslate">extraspace</code></li> <li class="list-inline-item"><code class="notranslate">fage</code></li> <li class="list-inline-item"><code class="notranslate">fairwinds</code></li> <li class="list-inline-item"><code class="notranslate">farmers</code></li> <li class="list-inline-item"><code class="notranslate">fedex</code></li> <li class="list-inline-item"><code class="notranslate">פרארי</code></li> <li class="list-inline-item"><code class="notranslate">פררו</code></li> <li class="list-inline-item"><code class="notranslate">פיאט</code></li> <li class="list-inline-item"><code class="notranslate">פידליטי</code></li> <li class="list-inline-item"><code class="notranslate">פיירסטון</code></li> <li class="list-inline-item"><code class="notranslate">פירמדייל</code></li> <li class="list-inline-item"><code class="notranslate">פליקר</code></li> <li class="list-inline-item"><code class="notranslate">פלייר</code></li> <li class="list-inline-item"><code class="notranslate">פלסמידט</code></li> <li class="list-inline-item"><code class="notranslate">פורד</code></li> <li class="list-inline-item"><code class="notranslate">פוקס</code></li> <li class="list-inline-item"><code class="notranslate">פרזניוס</code></li> <li class="list-inline-item"><code class="notranslate">פורקס</code></li> <li class="list-inline-item"><code class="notranslate">צפרדעים</code></li> <li class="list-inline-item"><code class="notranslate">פרונטיר</code></li> <li class="list-inline-item"><code class="notranslate">פוג'יטסו</code></li> <li class="list-inline-item"><code class="notranslate">פוג'יקסרוקס</code></li> <li class="list-inline-item"><code class="notranslate">גאלו</code></li> <li class="list-inline-item"><code class="notranslate">גאלופ</code></li> <li class="list-inline-item"><code class="notranslate">פער</code></li> <li class="list-inline-item"><code class="notranslate">gibiz</code></li> <li class="list-inline-item"><code class="notranslate">גיה</code></li> <li class="list-inline-item"><code class="notranslate">מתן</code></li> <li class="list-inline-item"><code class="notranslate">גלו</code></li> <li class="list-inline-item"><code class="notranslate">גלובו</code></li> <li class="list-inline-item"><code class="notranslate">ג'ימייל</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li> <li class="list-inline-item"><code class="notranslate">gmx</code></li> <li class="list-inline-item"><code class="notranslate">גודאדי</code></li> <li class="list-inline-item"><code class="notranslate">גולדפוינט</code></li> <li class="list-inline-item"><code class="notranslate">גודייר</code></li> <li class="list-inline-item"><code class="notranslate">גוגל</code></li> <li class="list-inline-item"><code class="notranslate">גוגל</code></li> <li class="list-inline-item"><code class="notranslate">גריינג'ר</code></li> <li class="list-inline-item"><code class="notranslate">גרדיאן</code></li> <li class="list-inline-item"><code class="notranslate">גוצ'י</code></li> <li class="list-inline-item"><code class="notranslate">hbo</code></li> <li class="list-inline-item"><code class="notranslate">hdfc</code></li> <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li> <li class="list-inline-item"><code class="notranslate">הרמס</code></li> <li class="list-inline-item"><code class="notranslate">היסאמיצו</code></li> <li class="list-inline-item"><code class="notranslate">היטאצ'י</code></li> <li class="list-inline-item"><code class="notranslate">hkt</code></li> <li class="list-inline-item"><code class="notranslate">הונדה</code></li> <li class="list-inline-item"><code class="notranslate">הוניוול</code></li> <li class="list-inline-item"><code class="notranslate">הוטמייל</code></li> <li class="list-inline-item"><code class="notranslate">הוס</code></li> <li class="list-inline-item"><code class="notranslate">הייאט</code></li> <li class="list-inline-item"><code class="notranslate">יונדאי</code></li> <li class="list-inline-item"><code class="notranslate">ibm</code></li> <li class="list-inline-item"><code class="notranslate">ieee</code></li> <li class="list-inline-item"><code class="notranslate">ifm</code></li> <li class="list-inline-item"><code class="notranslate">ikano</code></li> <li class="list-inline-item"><code class="notranslate">imdb</code></li> <li class="list-inline-item"><code class="notranslate">אינפיניטי</code></li> <li class="list-inline-item"><code class="notranslate">אינטל</code></li> <li class="list-inline-item"><code class="notranslate">אינטיל</code></li> <li class="list-inline-item"><code class="notranslate">אינטואיט</code></li> <li class="list-inline-item"><code class="notranslate">אייפירנגה</code></li> <li class="list-inline-item"><code class="notranslate">iselect</code></li> <li class="list-inline-item"><code class="notranslate">איטאו</code></li> <li class="list-inline-item"><code class="notranslate">איבקו</code></li> <li class="list-inline-item"><code class="notranslate">יגואר</code></li> <li class="list-inline-item"><code class="notranslate">ג'אווה</code></li> <li class="list-inline-item"><code class="notranslate">ג'אווה</code></li> <li class="list-inline-item"><code class="notranslate">ג'אווה</code></li> class="notranslate">jcp</code></li> <li class="list-inline-item"><code class="notranslate">ג'יפ</code></li> <li class="list-inline-item"><code class="notranslate">ג'יי.פי. מורגן</code></li> <li class="list-inline-item"><code class="notranslate">ג'וניפר</code></li> <li class="list-inline-item"><code class="notranslate">kddi</code></li> <li class="list-inline-item"><code class="notranslate">מלונות קרי</code></li> <li class="list-inline-item"><code class="notranslate">לוגיסטיקות קרי</code></li> <li class="list-inline-item"><code class="notranslate">נכסי קרי</code></li> <li class="list-inline-item"><code class="notranslate">נכסי קרי</code></li> <li class="list-inline-item"><code class="notranslate">kfh</code></li> <li class="list-inline-item"><code class="notranslate">קיה</code></li> <li class="list-inline-item"><code class="notranslate">קינדר</code></li> <li class="list-inline-item"><code class="notranslate">קינדל</code></li> <li class="list-inline-item"><code class="notranslate">קומטסו</code></li> <li class="list-inline-item"><code class="notranslate">kpmg</code></li> <li class="list-inline-item"><code class="notranslate">קרד</code></li> <li class="list-inline-item"><code class="notranslate">קבוצת קוד</code></li> <li class="list-inline-item"><code class="notranslate">lacaixa</code></li> <li class="list-inline-item"><code class="notranslate">לדברוקס</code></li> <li class="list-inline-item"><code class="notranslate">למבורגיני</code></li> <li class="list-inline-item"><code class="notranslate">לנקסטר</code></li> <li class="list-inline-item"><code class="notranslate">לנצ'יה</code></li> <li class="list-inline-item"><code class="notranslate">לנקום</code></li> <li class="list-inline-item"><code class="notranslate">לנד רובר</code></li> <li class="list-inline-item"><code class="notranslate">לנקסס</code></li> <li class="list-inline-item"><code class="notranslate">לסאל</code></li> <li class="list-inline-item"><code class="notranslate">לטרוב</code></li> <li class="list-inline-item"><code class="notranslate">לדס</code></li> <li class="list-inline-item"><code class="notranslate">לקלר</code></li> <li class="list-inline-item"><code class="notranslate">לגו</code></li> <li class="list-inline-item"><code class="notranslate">ליאיון</code></li> <li class="list-inline-item"><code class="notranslate">לקסוס</code></li> <li class="list-inline-item"><code class="notranslate">לידל</code></li> <li class="list-inline-item"><code class="notranslate">סגנון חיים</code></li> <li class="list-inline-item"><code class="notranslate">לילי</code></li> <li class="list-inline-item"><code class="notranslate">לינקולן</code></li> <li class="list-inline-item"><code class="notranslate">ליפסי</code></li> <li class="list-inline-item"><code class="notranslate">ליקסיל</code></li> <li class="list-inline-item"><code class="notranslate">לוקוס</code></li> <li class="list-inline-item"><code class="notranslate">לוטה</code></li> <li class="list-inline-item"><code class="notranslate">lpl</code></li> <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li> <li class="list-inline-item"><code class="notranslate">לונדבק</code></li> <li class="list-inline-item"><code class="notranslate">לופין</code></li> <li class="list-inline-item"><code class="notranslate">מייס</code></li> <li class="list-inline-item"><code class="notranslate">מייף</code></li> <li class="list-inline-item"><code class="notranslate">איש</code></li> <li class="list-inline-item"><code class="notranslate">מנגו</code></li> <li class="list-inline-item"><code class="notranslate">מריוט</code></li> <li class="list-inline-item"><code class="notranslate">מזראטי</code></li> <li class="list-inline-item"><code class="notranslate">מאטל</code></li> <li class="list-inline-item"><code class="notranslate">מקינזי</code></li> <li class="list-inline-item"><code class="notranslate">מטלייף</code></li> <li class="list-inline-item"><code class="notranslate">מיקרוסופט</code></li> <li class="list-inline-item"><code class="notranslate">מיני</code></li> <li class="list-inline-item"><code class="notranslate">מיט</code></li> <li class="list-inline-item"><code מיצובישי</code></li> <li class="list-inline-item"><code class="notranslate">MLB</code></li> <li class="list-inline-item"><code class="notranslate">MMA</code></li> <li class="list-inline-item"><code class="notranslate">מונאש</code></li> <li class="list-inline-item"><code class="notranslate">מורמון</code></li> <li class="list-inline-item"><code class="notranslate">מוטו</code></li> <li class="list-inline-item"><code class="notranslate">מוביסטאר</code></li> <li class="list-inline-item"><code class="notranslate">msd</code></li> <li class="list-inline-item"><code class="notranslate">mtn</code></li> <li class="list-inline-item"><code class="notranslate">mtr</code></li> <li class="list-inline-item"><code class="notranslate">הדדית</code></li> <li class="list-inline-item"><code class="notranslate">nadex</code></li> <li class="list-inline-item"><code class="notranslate">ארצית</code></li> <li class="list-inline-item"><code class="notranslate">טבעית</code></ li> <li class="list-inline-item"><code class="notranslate">nba</code></li> <li class="list-inline-item"><code class="notranslate">nec</code></li> <li class="list-inline-item"><code class="notranslate">נטפליקס</code></li> <li class="list-inline-item"><code class="notranslate">נייסטר</code></li> <li class="list-inline-item"><code class="notranslate">ניוהולנד</code></li> <li class="list-inline-item"><code class="notranslate">nfl</code></li> <li class="list-inline-item"><code class="notranslate">nhk</code></li> <li class="list-inline-item"><code class="notranslate">ניקו</code></li> <li class="list-inline-item"><code class="notranslate">נייקי</code></li> <li class="list-inline-item"><code class="notranslate">ניקון</code></li> <li class="list-inline-item"><code class="notranslate">ניסאן</code></li> <li class="list-inline-item"><code class="notranslate">ניסאי</code></li> <li class="list-inline-item"><code class="notranslate">נוקיה</code></li> <li class="list-inline-item"><code class="notranslate">נורת'ווסטרןמוטואל</code></li> <li class="list-inline-item"><code class="notranslate">נורטון</code></li> <li class="list-inline-item"><code class="notranslate">nra</code></li> <li class="list-inline-item"><code class="notranslate">ntt</code></li> <li class="list-inline-item"><code class="notranslate">obi</code></li> <li class="list-inline-item"><code class="notranslate">אופיס</code></li> <li class="list-inline-item"><code class="notranslate">אומגה</code></li> <li class="list-inline-item"><code class="notranslate">אורקל</code></li> <li class="list-inline-item"><code class="notranslate">תפוז</code></li> <li class="list-inline-item"><code class="notranslate">אוצוקה</code></li> <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>--> <li class="list-inline-item"><code class="notranslate">פנסוניק</code></li> <li class="list-inline-item"><code class="notranslate">pccw</code></li> <li class="list-inline-item"><code class="notranslate">פייזר</code></li> <li class="list-inline-item"><code class="notranslate">פיליפס</code></li> <li class="list-inline-item"><code class="notranslate">פיג'ה</code></li> <li class="list-inline-item"><code class="notranslate">פיקטט</code></li> <li class="list-inline-item"><code class="notranslate">פינג</code></li> <li class="list-inline-item"><code class="notranslate">פיוניר</code></li> <li class="list-inline-item"><code class="notranslate">שחק</code></li> <li class="list-inline-item"><code class="notranslate">פלייסטיישן</code></li> <li class="list-inline-item"><code class="notranslate">פול</code></li> <li class="list-inline-item"><code class="notranslate">משטר</code></li> <li class="list-inline-item"><code class="notranslate">פרקסי</code></li> <li class="list-inline-item"><code class="notranslate">פרוגרסיבי</code></li> <li class="list-inline-item"><code class="notranslate">פרו</code></li> <li class="list-inline-item"><code class="notranslate">פרודנשל</code></li> <li class="list-inline-item"><code class="notranslate">pwc</code></li> <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>--> <li class="list-inline-item"><code class="notranslate">qvc</code></li> <li class="list-inline-item"><code class="notranslate">רדסטון</code></li> <li class="list-inline-item"><code class="notranslate">רילינס</code></li> <li class="list-inline-item"><code class="notranslate">רקסרות'</code></li> <li class="list-inline-item"><code class="notranslate">ריקו</code></li> <li class="list-inline-item"><code class="notranslate">אחריות</code></li> <li class="list-inline-item"><code class="notranslate">רושר</code></li> <li class="list-inline-item"><code class="notranslate">רוג'רס</code></li> <li class="list-inline-item"><code class="notranslate">rwe</code></li> <li class="list-inline-item"><code class="notranslate">בטיחות</code></li> <li class="list-inline-item"><code class="notranslate">סאקורה</code></li> <li class="list-inline-item"><code class="notranslate">סמסונג</code></li> <li class="list-inline-item"><code class="notranslate">סנדוויק</code></li> <li class="list-inline-item"><code class="notranslate">סנדוויק קורומנט</code></li> <li class="list-inline-item"><code class="notranslate">סאנופי</code></li> <li class="list-inline-item"><code class="notranslate">סאפ</code></li> <li class="list-inline-item"><code class="notranslate">סאקסו</code></li> <li class="list-inline-item"><code class="notranslate">סבי</code></li> <!--<li class="list-inline-item"><code class="notranslate">סבס</code></li>--> <li class="list-inline-item"><code class="notranslate">סקא</code></li> <li class="list-inline-item"><code class="notranslate">סקא</code></li> <li class="list-inline-item"><code class="notranslate">סקא</code></li> class="notranslate">שאפלר</code></li> <li class="list-inline-item"><code class="notranslate">שמידט</code></li> <li class="list-inline-item"><code class="notranslate">שוורץ</code></li> <li class="list-inline-item"><code class="notranslate">ג'ונסון</code></li> <li class="list-inline-item"><code class="notranslate">סקור</code></li> <li class="list-inline-item"><code class="notranslate">מושב</code></li> <li class="list-inline-item"><code class="notranslate">סנר</code></li> <li class="list-inline-item"><code class="notranslate">סס</code></li> <li class="list-inline-item"><code class="notranslate">לתפור</code></li> <li class="list-inline-item"><code class="notranslate">שבע</code></li> <li class="list-inline-item"><code class="notranslate">sfr</code></li> <li class="list-inline-item"><code class="notranslate">לחפש</code></li> <li class="list-inline-item"><code class="notranslate">שנגרילה</code></li> <li class="list-inline-item"><code class="notranslate">שארפ</code></li> <li class="list-inline-item"><code class="notranslate">שו</code></li> <li class="list-inline-item"><code class="notranslate">קליפה</code></li> <li class="list-inline-item"><code class="notranslate">שריראם</code></li>
<li class="list-inline-item"><code class="notranslate">סינא</code></li> <li class="list-inline-item"><code class="notranslate">סקיי</code></li> <li class="list-inline-item"><code class="notranslate">סקייפ</code></li> <li class="list-inline-item"><code class="notranslate">סמארט</code></li> <li class="list-inline-item"><code class="notranslate">סנפק</code></li> <li class="list-inline-item"><code class="notranslate">סופטבנק</code></li> <li class="list-inline-item"><code class="notranslate">סוהו</code></li> <li class="list-inline-item"><code class="notranslate">סוני</code></li> <li class="list-inline-item"><code class="notranslate">ראייה</code></li> <li class="list-inline-item"><code class="notranslate">סטאדה</code></li> <li class="list-inline-item"><code class="notranslate">סטייפלס</code></li> <li class="list-inline-item"><code class="notranslate">סטאר</code></li> <li class="list-inline-item"><code class="notranslate">סטארהאב</code></li> <li class="list-inline-item"><code class="notranslate">בנק המדינה</code></li> <li class="list-inline-item"><code class="notranslate">סטייטפארם</code></li> <li class="list-inline-item"><code class="notranslate">סטאטויל</code></li> <li class="list-inline-item"><code class="notranslate">stc</code></li> <li class="list-inline-item"><code class="notranslate">stcgroup</code></li> <li class="list-inline-item"><code class="notranslate">סוזוקי</code></li> <li class="list-inline-item"><code class="notranslate">swatch</code></li> <li class="list-inline-item"><code class="notranslate">swiftcover</code></li> <li class="list-inline-item"><code class="notranslate">סימנטק</code></li> <li class="list-inline-item"><code class="notranslate">טאובאו</code></li> <li class="list-inline-item"><code class="notranslate">טרגט</code></li> <li class="list-inline-item"><code class="notranslate">טאטמוטורס</code></li> <li class="list-inline-item"><code class="notranslate">טדק</code></li> <li class="list-inline-item"><code class="notranslate">טלסיטי</code></li> <li class="list-inline-item"><code class="notranslate">טלפוניקה</code></li> <li class="list-inline-item"><code class="notranslate">טמאסק</code></li> <li class="list-inline-item"><code class="notranslate">טבע</code></li> <li class="list-inline-item"><code class="notranslate">טיפאני</code></li> <li class="list-inline-item"><code class="notranslate">טג'קס</code></li> <li class="list-inline-item"><code class="notranslate">טוריי</code></li> <li class="list-inline-item"><code class="notranslate">טושיבה</code></li> <li class="list-inline-item"><code class="notranslate">סה"כ</code></li> <li class="list-inline-item"><code class="notranslate">טויוטה</code></li> <li class="list-inline-item"><code class="notranslate">טרוולצ'ר</code></li> <li class="list-inline-item"><code class="notranslate">מטיילים</code></li> <li class="list-inline-item"><code class="notranslate">טויוטה</code></li> <li class="list-inline-item"><code class="notranslate">טלוויזיות</code></li> <li class="list-inline-item"><code class="notranslate">ubs</code></li> <li class="list-inline-item"><code class="notranslate">unicom</code></li> <li class="list-inline-item"><code class="notranslate">uol</code></li> <li class="list-inline-item"><code class="notranslate">ups</code></li> <li class="list-inline-item"><code class="notranslate">ואנגארד</code></li> <li class="list-inline-item"><code class="notranslate">וריסיין</code></li> <li class="list-inline-item"><code class="notranslate">ויג</code></li> <li class="list-inline-item"><code class="notranslate">ויקינג</code></li> <li class="list-inline-item"><code class="notranslate">בתול</code></li>
<li class="list-inline-item"><code class="notranslate">ויזה</code></li> <li class="list-inline-item"><code class="notranslate">ויסטה</code></li> <li class="list-inline-item"><code class="notranslate">ויסטהפרינט</code></li> <li class="list-inline-item"><code class="notranslate">ויבו</code></li> <li class="list-inline-item"><code class="notranslate">פולקסווגן</code></li> <li class="list-inline-item"><code class="notranslate">וולוו</code></li> <li class="list-inline-item"><code class="notranslate">וולמארט</code></li> <li class="list-inline-item"><code class="notranslate">וולטר</code></li> <li class="list-inline-item"><code class="notranslate">ערוץ מזג אוויר</code></li> <li class="list-inline-item"><code class="notranslate">וובר</code></li> <li class="list-inline-item"><code class="notranslate">סכר</code></li> <li class="list-inline-item"><code class="notranslate">ויליאם היל</code></li> <li class="list-inline-item"><code class="notranslate">חלונות</code></li> <li class="list-inline-item"><code class="notranslate">wme</code></li> <li class="list-inline-item"><code class="notranslate">וולטרסקלוור</code></li> <li class="list-inline-item"><code class="notranslate">וודסייד</code></li> <li class="list-inline-item"><code class="notranslate">wtc</code></li> <li class="list-inline-item"><code class="notranslate">xbox</code></li> <li class="list-inline-item"><code class="notranslate">xerox</code></li> <li class="list-inline-item"><code class="notranslate">xfinity</code></li> <li class="list-inline-item"><code class="notranslate">yahoo</code></li> <li class="list-inline-item"><code class="notranslate">yamaxun</code></li> <li class="list-inline-item"><code class="notranslate">yandex</code></li> <li class="list-inline-item"><code class="notranslate">yodobashi</code></li> <li class="list-inline-item"><code class="notranslate">יוטיוב</code></li>
<li class="list-inline-item"><code class="notranslate">זאפוס</code></li>
<li class="list-inline-item"><code class="notranslate">זארה</code></li>
<li class="list-inline-item"><code class="notranslate">זיפו</code></li>
</ul>

החל מ-18 במרץ 2025 הוספנו לרשימה זו גם את הטריטוריות הצרפתיות מעבר לים הבאות ([לפי בקשת GitHub זו](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">bzh</code></li> <li class="list-inline-item"><code class="notranslate">gf</code></li> <li class="list-inline-item"><code class="notranslate">gp</code></li> <li class="list-inline-item"><code class="notranslate">mq</code></li> <li class="list-inline-item"><code class="notranslate">nc</code></li> <li class="list-inline-item"><code class="notranslate">pf</code></li> <li class="list-inline-item"><code class="notranslate">pm</code></li> <li class="list-inline-item"><code class="notranslate">re</code></li> <li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

החל מ-8 ביולי 2025 הוספנו את המדינות הספציפיות לאירופה הבאות:

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">ax</code></li> <li class="list-inline-item"><code class="notranslate">bg</code></li> <li class="list-inline-item"><code class="notranslate">fo</code></li> <li class="list-inline-item"><code class="notranslate">gi</code></li> <li class="list-inline-item"><code class="notranslate">gr</code></li> <li class="list-inline-item"><code class="notranslate">hr</code></li> <li class="list-inline-item"><code class="notranslate">hu</code></li> <li class="list-inline-item"><code class="notranslate">lt</code></li> <li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

לא כללנו במפורש את `cz`, `ru`, ו-`ua` עקב פעילות ספאם גבוהה.

### מהם קריטריוני רשימת ההיתרים שלך {#what-is-your-allowlist-criteria}

יש לנו רשימה סטטית של [סיומות שם דומיין רשומות כברירת מחדל](#what-domain-name-extensions-are-allowlisted-by-default) – ואנחנו גם מתחזקים רשימת היתרים דינמית, מאוחסנת במטמון ומתגלגלת המבוססת על הקריטריונים המחמירים הבאים:

* דומיין השורש של השולח חייב להיות של [סיומת שם הדומיין שתואמת לרשימה שאנו מציעים בתוכנית החינמית שלנו](#what-domain-name-extensions-can-be-used-for-free) (עם תוספת של `biz` ו-`info`). אנו כוללים גם התאמות חלקיות של `edu`, `gov`, ו-`mil`, כגון `xyz.gov.au` ו-`xyz.edu.au`.
* דומיין השורש של השולח חייב להיות בין 100,000 התוצאות המובילות של דומיין השורש הייחודי שנבדקו מ-[רשימת פופולריות של מטריות](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* דומיין השורש של השולח חייב להיות בין 50,000 התוצאות המובילות של דומייני שורש ייחודיים המופיעים בלפחות 4 מתוך 7 הימים האחרונים של UPL (\~50%+).
* דומיין הבסיס של השולח אינו יכול להיות [מסווג](https://radar.cloudflare.com/categorization-feedback/) כתוכן למבוגרים או תוכנה זדונית על ידי Cloudflare.
* דומיין הבסיס של השולח חייב להיות בעל רשומות A או MX מוגדרות.
* דומיין הבסיס של השולח חייב להיות בעל רשומה/ות A, רשומה/ות MX, רשומת DMARC עם `p=reject` או `p=quarantine`, או רשומת SPF עם אישור `-all` או `~all`.

אם קריטריון זה מתקיים, דומיין הבסיס של השולח יאוחסן במטמון למשך 7 ימים. שימו לב שהמשימה האוטומטית שלנו פועלת מדי יום - לכן זהו מטמון מתגלגל של רשימת היתרים שמתעדכן מדי יום.

העבודה האוטומטית שלנו תוריד את קבצי ה-UPL בזיכרון של 7 הימים הקודמים, תפתח אותם ולאחר מכן תנתח את הקבצים בזיכרון בהתאם לקריטריונים המחמירים לעיל.

דומיינים פופולריים בזמן כתיבת שורות אלה כגון גוגל, יאהו, מיקרוסופט, אמזון, מטא, טוויטר, נטפליקס, ספוטיפיי ועוד - כלולים כמובן.

אם אתה שולח שאינו ברשימת ההיתרים שלנו, אז בפעם הראשונה שדומיין הבסיס של ה-FQDN או כתובת ה-IP שלך שולחים אימייל, תסווג כ-[שיעור מוגבל](#do-you-have-rate-limiting) ו-[ברשימה אפורה](#do-you-have-a-greylist). שים לב שזהו נוהג סטנדרטי שאומץ כסטנדרט אימייל. רוב לקוחות שרת האימייל ינסו לנסות שוב אם יקבלו שגיאת מגבלת קצב או רשימה אפורה (למשל, קוד סטטוס שגיאה ברמה 421 או 4xx).

**שימו לב ששולחים ספציפיים כגון `a@gmail.com`, `b@xyz.edu`, ו-`c@gov.au` עדיין יכולים להיות [נדחה ברשימה](#do-you-have-a-denylist)** (לדוגמה, אם נזהה אוטומטית ספאם, פישינג או תוכנות זדוניות מאותם שולחים).**

### אילו סיומות שם דומיין ניתן להשתמש בהן בחינם {#what-domain-name-extensions-can-be-used-for-free}

החל מ-31 במרץ 2023 אכפנו כלל חדש נגד ספאם כדי להגן על המשתמשים והשירות שלנו.

כלל חדש זה מאפשר שימוש רק בסיומות שמות הדומיין הבאות בתוכנית החינמית שלנו:

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">ac</code></li> <li class="list-inline-item"><code class="notranslate">ad</code></li> <li class="list-inline-item"><code class="notranslate">ag</code></li> <li class="list-inline-item"><code class="notranslate">ai</code></li> <li class="list-inline-item"><code class="notranslate">al</code></li> <li class="list-inline-item"><code class="notranslate">am</code></li> <li class="list-inline-item"><code class="notranslate">app</code></li> <li class="list-inline-item"><code class="notranslate">as</code></li> <li class="list-inline-item"><code class="notranslate">ב</code></li> <li class="list-inline-item"><code class="notranslate">au</code></li> <li class="list-inline-item"><code class="notranslate">ba</code></li> <li class="list-inline-item"><code class="notranslate">להיות</code></li> <li class="list-inline-item"><code class="notranslate">br</code></li> <li class="list-inline-item"><code class="notranslate">על ידי</code></li> <li class="list-inline-item"><code class="notranslate">ca</code></li> <li class="list-inline-item"><code class="notranslate">cc</code></li> <li class="list-inline-item"><code class="notranslate">cd</code></li> <li class="list-inline-item"><code class="notranslate">ch</code></li> <li class="list-inline-item"><code class="notranslate">ck</code></li> <li class="list-inline-item"><code class="notranslate">co</code></li> <li class="list-inline-item"><code class="notranslate">com</code></li> <li class="list-inline-item"><code class="notranslate">de</code></li> <li class="list-inline-item"><code class="notranslate">dev</code></li> <li class="list-inline-item"><code class="notranslate">dj</code></li> <li class="list-inline-item"><code class="notranslate">dk</code></li> <li class="list-inline-item"><code class="notranslate">ee</code></li> <li class="list-inline-item"><code class="notranslate">es</code></li> <li class="list-inline-item"><code class="notranslate">eu</code></li> <li class="list-inline-item"><code class="notranslate">משפחה</code></li> <li class="list-inline-item"><code class="notranslate">fi</code></li> <li class="list-inline-item"><code class="notranslate">fm</code></li> <li class="list-inline-item"><code class="notranslate">fr</code></li> <li class="list-inline-item"><code class="notranslate">gg</code></li> <li class="list-inline-item"><code class="notranslate">gl</code></li> <li class="list-inline-item"><code class="notranslate">id</code></li> <li class="list-inline-item"><code class="notranslate">ie</code></li> <li class="list-inline-item"><code class="notranslate">il</code></li> <li class="list-inline-item"><code class="notranslate">im</code></li> <li class="list-inline-item"><code class="notranslate">in</code></li> <li class="list-inline-item"><code class="notranslate">io</code></li> <li class="list-inline-item"><code class="notranslate">ir</code></li> <li class="list-inline-item"><code class="notranslate">is</code></li> <li class="list-inline-item"><code class="notranslate">זה</code></li> <li class="list-inline-item"><code class="notranslate">אני</code></li> <li class="list-inline-item"><code class="notranslate">יפן</code></li> <li class="list-inline-item"><code class="notranslate">קישור</code></li> <li class="list-inline-item"><code class="notranslate">קורס</code></li> <li class="list-inline-item"><code class="notranslate">לה</code></li> <li class="list-inline-item"><code class="notranslate">לי</code></li> <li class="list-inline-item"><code class="notranslate">לב</code></li> <li class="list-inline-item"><code class="notranslate">לב</code></li> <li class="list-inline-item"><code class="notranslate">ly</code></li> <li class="list-inline-item"><code class="notranslate">md</code></li> <li class="list-inline-item"><code class="notranslate">me</code></li> <li class="list-inline-item"><code class="notranslate">mn</code></li> <li class="list-inline-item"><code class="notranslate">ms</code></li> <li class="list-inline-item"><code class="notranslate">mu</code></li> <li class="list-inline-item"><code class="notranslate">mx</code></li> <li class="list-inline-item"><code class="notranslate">net</code></li> <li class="list-inline-item"><code class="notranslate">ni</code></li> <li class="list-inline-item"><code class="notranslate">nl</code></li> <li class="list-inline-item"><code class="notranslate">לא</code></li> <li class="list-inline-item"><code class="notranslate">נו</code></li> <li class="list-inline-item"><code class="notranslate">nz</code></li> <li class="list-inline-item"><code class="notranslate">org</code></li> <li class="list-inline-item"><code class="notranslate">pl</code></li> <li class="list-inline-item"><code class="notranslate">pr</code></li> <li class="list-inline-item"><code class="notranslate">pt</code></li> <li class="list-inline-item"><code class="notranslate">pw</code></li> <li class="list-inline-item"><code class="notranslate">rs</code></li> <li class="list-inline-item"><code class="notranslate">sc</code></li> <li class="list-inline-item"><code class="notranslate">se</code></li> <li class="list-inline-item"><code class="notranslate">sh</code></li> <li class="list-inline-item"><code class="notranslate">si</code></li> <li class="list-inline-item"><code class="notranslate">sm</code></li> <li class="list-inline-item"><code class="notranslate">sr</code></li> <li class="list-inline-item"><code class="notranslate">st</code></li> <li class="list-inline-item"><code class="notranslate">tc</code></li> <li class="list-inline-item"><code class="notranslate">tm</code></li> <li class="list-inline-item"><code class="notranslate">ל</code></li> <li class="list-inline-item"><code class="notranslate">טלוויזיה</code></li> <li class="list-inline-item"><code class="notranslate">בריטניה</code></li> <li class="list-inline-item"><code class="notranslate">ארה"ב</code></li> <li class="list-inline-item"><code class="notranslate">ארה"ב</code></li> <li class="list-inline-item"><code class="notranslate">יו-זילנד</code></li> <li class="list-inline-item"><code class="notranslate">vc</code></li> <li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### האם יש לך רשימה אפורה {#do-you-have-a-greylist}

כן, יש לנו מדיניות [רשימה אפורה של אימיילים](https://en.wikipedia.org/wiki/Greylisting_\(email\)) רופפת מאוד. רשימת הודעות אפורה חלה רק על שולחים שאינם ברשימת ההיתרים שלנו ונשארת במטמון שלנו למשך 30 יום.

עבור כל שולח חדש, אנו מאחסנים מפתח במסד הנתונים של Redis שלנו למשך 30 יום עם ערך המוגדר לזמן ההגעה הראשוני של הבקשה הראשונה שלהם. לאחר מכן אנו דוחים את האימייל שלהם עם קוד סטטוס ניסיון חוזר של 450 ומאפשרים לו לעבור רק לאחר שעברו 5 דקות.

אם הם המתינו בהצלחה 5 דקות ממועד ההגעה הראשוני הזה, האימיילים שלהם יתקבלו והם לא יקבלו את קוד הסטטוס 450 הזה.

המפתח מורכב מדומיין הבסיס של ה-FQDN או מכתובת ה-IP של השולח. משמעות הדבר היא שכל תת-דומיין שעובר את הרשימה האפורה יעבור גם לדומיין הבסיס, ולהיפך (זו הכוונה במדיניות "רפה מאוד").

לדוגמה, אם אימייל מגיע מ-`test.example.com` לפני שאנחנו רואים אימייל שמגיע מ-`example.com`, אז כל אימייל מ-`test.example.com` ו/או `example.com` יצטרך להמתין 5 דקות ממועד ההגעה הראשוני של החיבור. אנחנו לא גורמים גם ל-`test.example.com` וגם ל-`example.com` להמתין כל אחד לפרקי זמן משלו של 5 דקות (מדיניות הרשימה האפורה שלנו חלה ברמת הדומיין הבסיסי).

שים לב שרשימה אפורה אינה חלה על אף שולח ב-[רשימת היתרים](#do-you-have-an-allowlist) שלנו (למשל, Meta, Amazon, Netflix, Google, Microsoft נכון למועד כתיבת שורות אלה).

### האם יש לך רשימת דחייה {#do-you-have-a-denylist}

כן, אנו מפעילים רשימת דחייה משלנו ומעדכנים אותה באופן אוטומטי בזמן אמת ובאופן ידני על סמך ספאם ופעילות זדונית שזוהו.

אנו גם שולפים את כל כתובות ה-IP מרשימת המניעים של UCEPROTECT Level 1 בכתובת <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> בכל שעה ומזינים אותן לרשימת המניעים שלנו עם תוקף של 7 ימים.

שולחים שנמצאים ברשימת המניעים יקבלו קוד שגיאה 421 (מציין לשולח לנסות שוב מאוחר יותר) אם הם [לא נמצאים ברשימת ההיתרים](#do-you-have-an-allowlist).

באמצעות קוד סטטוס 421 במקום קוד סטטוס 554, ניתן למנוע תוצאות חיוביות שגויות אפשריות בזמן אמת ולאחר מכן ניתן להעביר את ההודעה בהצלחה בניסיון הבא.

**זה תוכנן בניגוד לשירותי דואר אחרים**, שבהם אם אתה נמצא ברשימת חסימה, מתרחשת כשל קשה וקבוע. לעתים קרובות קשה לבקש מהשולחים לנסות שוב הודעות (במיוחד מארגונים גדולים), ולכן גישה זו נותנת בערך 5 ימים מניסיון הדוא"ל הראשוני לשולח, לנמען או לנו להתערב ולפתור את הבעיה (על ידי בקשה להסרת רשימת חסימה).

כל בקשות ההסרה מרשימת דחייה מנוטרות בזמן אמת על ידי מנהלים (למשל, כך שתוצאות חיוביות שגויות חוזרות ונשנות יוכלו להיכלל ברשימת היתרים לצמיתות על ידי מנהלים).

ניתן לבקש בקשות להסרת קבצים מרשימת דחייה בכתובת <https://forwardemail.net/denylist>. משתמשים בתשלום יקבלו עיבוד מיידי של בקשות הסרת קבצים מרשימת דחייה, בעוד שמשתמשים שאינם בתשלום חייבים להמתין עד שמנהלים יעבדו את בקשתם.

שולחים שיזוהו כשליחת תוכן ספאם או וירוס יתווספו לרשימת המניעים בגישה הבאה:

1. ה-[טביעת אצבע של ההודעה הראשונית](#how-do-you-determine-an-email-fingerprint) מופיע ברשימה אפורה בעת זיהוי ספאם או רשימת חסימה משולח "מהימן" (לדוגמה, `gmail.com`, `microsoft.com`, `apple.com`).
* אם השולח היה ברשימת היתרים, ההודעה מופיעה ברשימה אפורה למשך שעה אחת.
* אם השולח אינו מופיע ברשימת היתרים, ההודעה מופיעה ברשימה אפורה למשך 6 שעות.
2. אנו מנתחים מפתחות רשימת דחייה ממידע מהשולח ומההודעה, ועבור כל אחד מהמפתחות הללו אנו יוצרים (אם עדיין אין כזה) מונה, מעלים אותו ב-1 ומאחסנים אותו במטמון למשך 24 שעות.
* עבור שולחים ברשימת היתרים:
* הוסיפו מפתח עבור כתובת הדוא"ל של המעטפה "MAIL FROM" אם היה לה SPF עובר או ללא SPF, והיא לא הייתה [שם משתמש של postmaster](#what-are-postmaster-addresses) או [שם משתמש ללא תשובה](#what-are-no-reply-addresses).
* אם כותרת "From" הייתה ברשימת היתרים, הוסיפו מפתח עבור כתובת הדוא"ל של כותרת "From" אם היה לה SPF עובר או DKIM עובר ומיושר.
* אם כותרת "From" לא הייתה ברשימת היתרים, הוסיפו מפתח עבור כתובת הדוא"ל של כותרת "From" ושם הדומיין המנותח בבסיס שלה.
* עבור שולחים שאינם ברשימת היתרים:
* הוסיפו מפתח עבור כתובת הדוא"ל של המעטפה "MAIL FROM" אם היה לה SPF עובר.
* אם כותרת "From" הייתה ברשימת היתרים, הוסיפו מפתח עבור כתובת הדוא"ל של כותרת "From" אם היה לה SPF עובר או DKIM עובר ומיושר.
* אם כותרת "From" לא הייתה ברשימת היתרים, הוסיפו מפתח עבור כתובת הדוא"ל של כותרת "From" ושם הדומיין המנותח בבסיס שלה.
* הוסף מפתח עבור כתובת ה-IP המרוחקת של השולח.
* הוסף מפתח עבור שם המארח שזוהה על ידי הלקוח על ידי חיפוש הפוך מכתובת ה-IP של השולח (אם קיים).
* הוסף מפתח עבור הדומיין הבסיסי של שם המארח שזוהה על ידי הלקוח (אם קיים, ואם הוא שונה משם המארח שזוהה על ידי הלקוח).
3. אם המונה מגיע ל-5 עבור שולח ומפתח שאינם ברשימת ההיתרים, אנו דוחים את המפתח ל-30 יום ונשלח אימייל לצוות ההתעללות שלנו. מספרים אלה עשויים להשתנות ועדכונים ישתקפו כאן בזמן שאנו עוקבים אחר התעללות.
4. אם המונה מגיע ל-10 עבור שולח ומפתח ברשימת ההיתרים, אנו דוחים את המפתח ל-7 ימים ונשלח אימייל לצוות ההתעללות שלנו. מספרים אלה עשויים להשתנות ועדכונים ישתקפו כאן בזמן שאנו עוקבים אחר התעללות.

> **הערה:** בעתיד הקרוב נציג ניטור מוניטין. ניטור מוניטין יחשב במקום זאת מתי לדחות הוספה של שולח לרשימה על סמך סף אחוזים (בניגוד למונה בסיסי כפי שצוין לעיל).

### האם יש לך הגבלת קצב {#do-you-have-rate-limiting}

הגבלת קצב השולח היא על ידי דומיין הבסיס המנתח מחיפוש PTR הפוך על כתובת ה-IP של השולח - או שאם זה לא מניב תוצאה, אז היא פשוט משתמשת בכתובת ה-IP של השולח. שים לב שאנו מתייחסים לזה כ-`Sender` להלן.

לשרתי ה-MX שלנו יש מגבלות יומיות על דואר נכנס שמתקבל עבור [אחסון IMAP מוצפן](/blog/docs/best-quantum-safe-encrypted-email-service):

* במקום להגביל את התעריף של דואר נכנס המתקבל על בסיס כינויים אישיים (למשל `you@yourdomain.com`) – אנו מגבילים את התעריף לפי שם הדומיין של הכינוי עצמו (למשל `yourdomain.com`). זה מונע מ-`Senders` להציף את תיבות הדואר הנכנס של כל הכינויים בדומיין שלך בו זמנית.
* יש לנו מגבלות כלליות החלות על כל `Senders` בשירות שלנו ללא קשר לנמען:
* `Senders` שאנו מחשיבים כ"מהימנים" כמקור אמת (למשל `gmail.com`, `microsoft.com`, `apple.com`) מוגבלים לשליחת 100 ג'יגה-בייט ליום.
* `Senders` שהם [רשימת היתרים](#do-you-have-an-allowlist) מוגבלים לשליחת 10 ג'יגה-בייט ליום.
* כל שאר `Senders` מוגבלים לשליחת 1 ג'יגה-בייט ו/או 1000 הודעות ליום.
* יש לנו מגבלה ספציפית של 1 ג'יגה-בייט ו/או 1000 הודעות ליום לכל `Sender` ו-`yourdomain.com`.

שרתי ה-MX גם מגבילים את העברת ההודעות לנמען אחד או יותר באמצעות הגבלת קצב - אך זה חל רק על `Senders` שאינו על [רשימת היתרים](#do-you-have-an-allowlist):

אנו מתירים רק עד 100 חיבורים לשעה, לכל תחום שורש FQDN `Sender` (או) `Sender` כתובת IP מרוחקת (אם אין PTR הפוך זמין), ולכל נמען מעטפה. אנו מאחסנים את המפתח להגבלת קצב כגיבוב קריפטוגרפי במסד הנתונים של Redis שלנו.

* אם אתם שולחים דוא"ל דרך המערכת שלנו, אנא ודאו שהגדרתם PTR הפוך עבור כל כתובות ה-IP שלכם (אחרת כל דומיין FQDN או כתובת IP ייחודית שתשלחו ממנה תהיה מוגבלת בתדירות).

* שימו לב שאם אתם שולחים דרך מערכת פופולרית כמו Amazon SES, לא תוגבל קצב העברת הכספים מכיוון ש(נכון לכתיבת שורות אלה) Amazon SES מופיע ברשימת ההיתרים שלנו.

* אם אתם שולחים מדומיין כגון `test.abc.123.example.com`, אזי מגבלת התעריף תוטל על `example.com`. שולחי ספאם רבים משתמשים במאות תת-דומיינים כדי לעקוף מסנני ספאם נפוצים שמגבילים את התעריף רק שמות מארחים ייחודיים במקום דומייני שורש FQDN ייחודיים.

* `Senders` שחורגים ממגבלת הקצב יידחו עם שגיאת 421.

שרתי ה-IMAP וה-SMTP שלנו מגבילים את הכינויים שלך מלקיים יותר מ-`60` חיבורים בו זמנית.

שרתי ה-MX שלנו מגבילים את [לא ברשימת ההיתרים](#do-you-have-an-allowlist) שולחים מלהקים יותר מ-10 חיבורים בו זמנית (עם תפוגת מטמון של 3 דקות עבור המונה, המשקפת את זמן הקצוב שלנו ל-socket של 3 דקות).

### כיצד ניתן להגן מפני פיזור לאחור {#how-do-you-protect-against-backscatter}

החזרות שגויות או ספאם של החזרות (הידוע בשם "[פיזור אחורי](https://en.wikipedia.org/wiki/Backscatter_\(email\))") עלולות לגרום לפגיעות במוניטין של כתובות ה-IP של השולח.

אנו נוקטים בשני צעדים כדי להגן מפני פיזור לאחור, המפורטים בסעיפים [מניעת החזרות של דואר זבל ידוע](#prevent-bounces-from-known-mail-from-spammers) ו- [מניעת קפיצות מיותרות כדי להגן מפני פיזור אחורי](#prevent-unnecessary-bounces-to-protect-against-backscatter) להלן.

### מניעת החזרות של דואר אלקטרוני ידוע משולחי ספאם {#prevent-bounces-from-known-mail-from-spammers}

אנו שולפים את הרשימה מ-[Backscatter.org](https://www.backscatterer.org/) (מופעל על ידי [UCEPROTECT](https://www.uceprotect.net/)) בכתובת <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> בכל שעה ומזינים אותה למסד הנתונים של Redis שלנו (אנו גם משווים את ההפרש מראש; במקרה שהוסרו כתובות IP שיש לכבד).

אם ה-MAIL FROM ריק או שווה ל- (ללא תלות באותיות גדולות/קטנות) כל אחד מה-[כתובות מנהל הדואר](#what-are-postmaster-addresses) (החלק שלפני ה-@ בהודעת דוא"ל), נבדוק אם כתובת ה-IP של השולח תואמת לאחד מהרשימה הזו.

אם כתובת ה-IP של השולח רשומה (ואינה ב-[רשימת היתרים](#do-you-have-an-allowlist) שלנו), אנו שולחים שגיאת 554 עם ההודעה `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. נקבל התראה אם שולח נמצא גם ברשימת Backscatterer וגם ברשימת ההיתרים שלנו כדי שנוכל לפתור את הבעיה במידת הצורך.

הטכניקות המתוארות בסעיף זה פועלות בהתאם להמלצת "מצב בטוח" ב-<https://www.backscatterer.org/?target=usage> – שם אנו בודקים את כתובת ה-IP של השולח רק אם תנאים מסוימים כבר מולאו.

### מניעת קפיצות מיותרות כדי להגן מפני פיזור לאחור {#prevent-unnecessary-bounces-to-protect-against-backscatter}

הודעות דוא"ל חוזרות הן הודעות דוא"ל המצביעות על כך שהעברת הדוא"ל לנמען נכשלה לחלוטין ולא ייעשה ניסיון חוזר.

סיבה נפוצה להופעה ברשימת Backscatterer היא ניתוקי חוצות שגויות או ספאם של ניתוקי חוצות, לכן עלינו להגן מפני כך בכמה דרכים:

1. אנו שולחים רק כאשר מתרחשות שגיאות קוד סטטוס של >= 500 (כאשר ניסיון העברה של אימיילים נכשל, לדוגמה, Gmail מגיב עם שגיאה ברמה 500).

2. אנו שולחים רק פעם אחת, ופעם אחת בלבד (אנו משתמשים במפתח טביעת אצבע של יציאה מחושב (bounce finger key) ומאחסנים אותו במטמון כדי למנוע שליחת כפילויות). טביעת האצבע של היציאה היא מפתח שהוא טביעת האצבע של ההודעה בשילוב עם גיבוב (hash) של כתובת היציאה וקוד השגיאה שלה). עיין בסעיף [טביעות אצבע](#how-do-you-determine-an-email-fingerprint) לקבלת תובנות נוספות לגבי אופן חישוב טביעת האצבע של ההודעה. טביעות אצבע של יציאה שנשלחו בהצלחה יפוגו לאחר 7 ימים במטמון Redis שלנו.

3. אנו שולחים רק כאשר השדות MAIL FROM ו/או From אינם ריקים ואינם מכילים (ללא תלות באותיות גדולות/קטנות) [שם המשתמש של postmaster](#what-are-postmaster-addresses) (החלק שלפני ה-@ בהודעת דוא"ל).

4. איננו שולחים אם ההודעה המקורית הכילה אחת מהכותרות הבאות (לא תלויות רישיות):

* כותרת של `auto-submitted` עם ערך שאינו שווה ל-`no`. * כותרת של `x-auto-response-suppress` עם ערך של `dr`, `autoreply`, `auto-reply`, `auto_reply`, או `all`
* כותרת של `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, או `x-auto-respond` (ללא קשר לערך).
* כותרת של `precedence` עם ערך של `bulk`, `autoreply`, `auto-reply`, `auto_reply`, או `list`.

5. איננו שולחים אם כתובת הדוא"ל MAIL FROM או From מסתיימת ב-`+donotreply`, `-donotreply`, `+noreply`, או `-noreply`.

6. איננו שולחים אם חלק שם המשתמש של כתובת הדוא"ל "מאת" היה `mdaemon` והיה לו כותרת שאינה תלוית רישיות של `X-MDDSN-Message`.

7. איננו שולחים אם הייתה כותרת `content-type` שאינה רגישה לאותיות גדולות/קטנות של `multipart/report`.

### כיצד ניתן לזהות טביעת אצבע של דוא"ל {#how-do-you-determine-an-email-fingerprint}

טביעת האצבע של אימייל משמשת לקביעת ייחודיותה ולמניעת מסירת הודעות כפולות ושליחה של [החזרות כפולות](#prevent-unnecessary-bounces-to-protect-against-backscatter).

טביעת האצבע מחושבת מהרשימה הבאה:

* שם מארח או כתובת IP של FQDN שפותחו על ידי הלקוח
* ערך כותרת `Message-ID` (אם קיים)
* ערך כותרת `Date` (אם קיים)
* ערך כותרת `From` (אם קיים)
* ערך כותרת `To` (אם קיים)
* ערך כותרת `Cc` (אם קיים)
* ערך כותרת `Subject` (אם קיים)
* ערך `Body` (אם קיים)

### האם ניתן להעביר אימיילים לפורטים אחרים מלבד 25 (לדוגמה, אם ספק האינטרנט שלי חסם את פורט 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

כן, החל מ-5 במאי 2020 הוספנו תכונה זו. כרגע התכונה ספציפית לדומיין, בניגוד לכינוי. אם אתם זקוקים לכינוי ספציפי, אנא צרו איתנו קשר כדי ליידע אותנו על הצרכים שלכם.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
הגנה משופרת על פרטיות:
</strong>
<span>
אם אתם בתוכנית בתשלום (הכוללת הגנה משופרת על פרטיות), אנא גשו אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>, לחצו על "הגדרה" ליד הדומיין שלכם ולאחר מכן לחצו על "הגדרות". אם תרצו ללמוד עוד על תוכניות בתשלום, עיינו בדף <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">התמחור</a> שלנו. אחרת, תוכלו להמשיך לפעול לפי ההוראות שלהלן.
</span>
</div>

אם אתם בתוכנית החינמית, פשוט הוסיפו רשומת DNS חדשה <strong class="notranslate">TXT</strong> כפי שמוצג למטה, אך שנו את הפורט מ-25 לפורט שתבחרו.

לדוגמה, אם אני רוצה שכל האימיילים שמגיעים אל `example.com` יועברו ליציאת ה-SMTP של נמעני הכינוי 1337 במקום 25:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email-port=1337</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
התרחיש הנפוץ ביותר להגדרת העברת פורטים מותאמת אישית הוא כאשר ברצונך להעביר את כל האימיילים שמגיעים לכתובת example.com לפורט אחר בכתובת example.com, שאינו תקן ה-SMTP של פורט 25. כדי להגדיר זאת, פשוט הוסף את רשומת ה-<strong class="notranslate">TXT</strong> הבאה.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=example.com</code></td> </tr> </tbody>
</table>

### האם זה תומך בסמל הפלוס + עבור כינויים של Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

כן, בהחלט.

### האם זה תומך בתת-דומיינים {#does-it-support-sub-domains}

כן, בהחלט. במקום להשתמש ב-"@", ".", או ריק כשם/מארח/כינוי, פשוט השתמשו בשם תת-הדומיין כערך.

אם ברצונך ש-`foo.example.com` יעביר אימיילים, הזן `foo` כערך השם/מארח/כינוי בהגדרות ה-DNS שלך (גם עבור רשומות MX וגם עבור רשומות <strong class="notranslate">TXT</strong>).

### האם זה מעביר את כותרות האימייל שלי {#does-this-forward-my-emails-headers}

כן, בהחלט.

### האם זה נבדק היטב {#is-this-well-tested}

כן, יש לו בדיקות שנכתבו עם [ava](https://github.com/avajs/ava) וגם כיסוי קוד.

### האם אתם מעבירים הודעות וקודי תגובה של SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

כן, בהחלט. לדוגמה, אם אתם שולחים אימייל אל `hello@example.com` והוא רשום להעברה אל `user@gmail.com`, אז הודעת התגובה של ה-SMTP והקוד משרת ה-SMTP "gmail.com" יוחזרו במקום שרת ה-proxy ב-"mx1.forwardemail.net" או "mx2.forwardemail.net".

### כיצד מונעים ספאמרים ומבטיחים מוניטין טוב של העברת דוא"ל {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

עיין בסעיפים שלנו בנושא [כיצד פועלת מערכת העברת הדוא"ל שלכם](#how-does-your-email-forwarding-system-work), [כיצד אתם מטפלים בבעיות משלוח דוא"ל](#how-do-you-handle-email-delivery-issues), ו-[איך אתם מטפלים בחסימה של כתובות ה-IP שלכם](#how-do-you-handle-your-ip-addresses-becoming-blocked) לעיל.

### כיצד מבצעים חיפושי DNS על שמות דומיין {#how-do-you-perform-dns-lookups-on-domain-names}

יצרנו פרויקט תוכנה בקוד פתוח בשם :tangerine: [מַנדָרִינָה](https://github.com/forwardemail/tangerine) ומשתמשים בו לחיפושי DNS. שרתי ה-DNS המוגדרים כברירת מחדל הם `1.1.1.1` ו-`1.0.0.1`, ושאילתות DNS מתבצעות דרך [DNS דרך HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") בשכבת האפליקציה.

:tangerine: [מַנדָרִינָה](https://github.com/tangerine) משתמש ב[שירות DNS לצרכנים של CloudFlare, שמתמקד קודם כל בפרטיות, כברירת מחדל][cloudflare-dns].

## חשבון וחיוב {#account-and-billing}

### האם אתם מציעים אחריות להחזר כספי על תוכניות בתשלום {#do-you-offer-a-money-back-guarantee-on-paid-plans}

כן! החזרים אוטומטיים מתרחשים בעת שדרוג, שדרוג לאחור או ביטול החשבון תוך 30 יום מתחילת התוכנית. זה חל רק על לקוחות חדשים.

### אם אני מחליף תוכניות, האם אתם משלמים את ההפרש באופן יחסי ומחזירים אותו? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

איננו מבצעים חישוב יחסי ואיננו מחזירים את ההפרש בעת מעבר לתוכנית. במקום זאת, אנו ממירים את משך הזמן שנותר מתאריך התפוגה של התוכנית הקיימת שלך למשך הזמן הקרוב ביותר לתוכנית החדשה שלך (מעוגל כלפי מטה לפי חודש).

שים לב שאם תשדרג או תרד בין תוכניות בתשלום בתוך חלון זמן של 30 יום מאז תחילת תוכנית בתשלום, נחזיר לך באופן אוטומטי את מלוא הסכום מהתוכנית הקיימת.

### האם אני יכול להשתמש בשירות העברת הדוא"ל הזה כשרת MX "חלופה" או "חלופה" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

לא, זה לא מומלץ, מכיוון שניתן להשתמש רק בשרת דואר אחד בכל פעם. בדרך כלל לא מנסים שוב להשתמש בשרתים חלופיים עקב הגדרות עדיפות שגויות ושרתי דואר שאינם מכבדים את בדיקת העדיפות של MX exchange.

### האם ניתן להשבית כינויים ספציפיים {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם בתוכנית בתשלום, עליכם לעבור אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים <i class="fa fa-angle-right"></i> עריכת כינוי <i class="fa fa-angle-right"></i> בטל את הסימון בתיבת הסימון "פעיל" <i class="fa fa-angle-right"></i> המשך.
</span>
</div>

כן, פשוט ערוך את רשומת ה-<strong class="notranslate">TXT</strong> של ה-DNS שלך והוסף לפני הכינוי סימן קריאה אחד, שניים או שלושה (ראה להלן).

שימו לב שעליכם *לשמור* את המיפוי ":", מכיוון שהוא נדרש אם אי פעם תחליטו לכבות אותו (והוא משמש גם לייבוא אם תשדרגו לאחת מהתוכניות בתשלום שלנו).

**לדחייה שקטה (נראה לשולח כאילו ההודעה נשלחה בהצלחה, אך למעשה לא מגיעה לשום מקום) (קוד סטטוס `250`):** אם תוסיף קידומת "!" (סימן קריאה יחיד) לכינוי, ההודעה תחזיר קוד סטטוס מוצלח של `250` לשולחים המנסים לשלוח לכתובת זו, אך האימיילים עצמם לא יגיעו לשום מקום (לדוגמה, חור שחור או `/dev/null`).

**לדחייה רכה (קוד סטטוס `421`):** אם תוסיף קידומת "!!" (סימן קריאה כפול) לכינוי, יוחזר קוד סטטוס שגיאה רכה של `421` לשולחים המנסים לשלוח לכתובת זו, ודחייה חוזרת תתבצע לעיתים קרובות עד 5 ימים לפני דחייה והחזרה.

**לדחייה קשה (קוד סטטוס `550`):** אם תוסיף קידומת "!!!" (סימן קריאה משולש) לכינוי, יוחזר קוד סטטוס שגיאה קבוע של `550` לשולחים המנסים לשלוח לכתובת זו והאימיילים יידחו ויוחזרו.

לדוגמה, אם אני רוצה שכל האימיילים שמגיעים אל `alias@example.com` יפסיקו לזרום דרך `user@gmail.com` ויידחו ויוחזרו (למשל, השתמשו בשלושה סימני קריאה):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias:user@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
ניתן גם לכתוב מחדש את כתובת הנמען שהועבר פשוט ל-"nobody@forwardemail.net", מה שינתב אותו ל-nobody כמו בדוגמה למטה.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
אם אתם רוצים אבטחה מוגברת, תוכלו גם להסיר את החלק ":user@gmail.com" (או ":nobody@forwardemail.net"), ולהשאיר רק את "!!!alias" כמו בדוגמה למטה.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias</code></td> </tr> </tbody>
</table>

### האם ניתן להעביר אימיילים למספר נמענים {#can-i-forward-emails-to-multiple-recipients}

כן, בהחלט. פשוט ציין מספר נמענים ברשומות ה-<strong class="notranslate">טקסט</strong> שלך.

לדוגמה, אם אני רוצה שאימייל שמגיע לכתובת `hello@example.com` יועבר ל-`user+a@gmail.com` ול-`user+b@gmail.com`, אז רשומת ה-<strong class="notranslate">TXT</strong> שלי תיראה כך:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr> </tbody>
</table>

לחלופין, ניתן לציין אותם בשתי שורות נפרדות, כגון זו:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=hello:user+a@gmail.com</code></td> </tr> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">טקסט</td> <td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

זה תלוי בך!

### האם ניתן לכלול מספר נמענים גלובליים מסוג "captch-all" {#can-i-have-multiple-global-catch-all-recipients}

כן, אתה יכול. פשוט ציין מספר נמענים גלובליים מרובים ברשומות ה-<strong class="notranslate">TXT</strong> שלך.

לדוגמה, אם אני רוצה שכל אימייל שמגיע ל-`*@example.com` (הכוכבית משמעה תו כללי, כלומר קביעה כללית) יועבר ל-`user+a@gmail.com` ול-`user+b@gmail.com`, אז רשומת ה-<strong class="notranslate">TXT</strong> שלי תיראה כך:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td> </tr> </tbody>
</table>

לחלופין, ניתן לציין אותם בשתי שורות נפרדות, כגון זו:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>שם/מארח/כינוי</th> <th class="text-center">TTL</th> <th>סוג</th> <th>תשובה/ערך</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=user+a@gmail.com</code></td> </tr> <tr> <td><em>@, ".", או ריק</em></td> <td class="text-center">3600</td> <td class="notranslate">טקסט</td> <td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

זה תלוי בך!

### האם יש מגבלה מקסימלית על מספר כתובות הדוא"ל שאליהן אני יכול להעביר הודעות לפי כינוי {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

כן, מגבלת ברירת המחדל היא 10. זה לא אומר שאתה יכול להכיל רק 10 כינויים בשם הדומיין שלך. אתה יכול להכיל כמה כינויים שתרצה (מספר בלתי מוגבל). משמעות הדבר היא שאתה יכול להעביר כינוי אחד בלבד ל-10 כתובות דוא"ל ייחודיות. אתה יכול להכיל `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, ... (מ-1-10) - וכל דוא"ל אל `hello@example.com` יועבר אל `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, ... (מ-1-10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
טיפ:
</strong>
<span>
צריכים יותר מ-10 נמענים לכל כינוי? שלחו לנו אימייל ונשמח להגדיל את מגבלת החשבונות שלכם.
</span>
</div>

### האם ניתן להעביר אימיילים באופן רקורסיבי {#can-i-recursively-forward-emails}

כן, אתה יכול, אך עדיין עליך לדבוק במגבלה המקסימלית. אם יש לך `hello:linus@example.com` ו-`linus:user@gmail.com`, אז אימיילים אל `hello@example.com` יועברו אל `linus@example.com` ו-`user@gmail.com`. שים לב שתוזרק שגיאה אם תנסה להעביר אימיילים באופן רקורסיבי מעבר למגבלה המקסימלית.

### האם אנשים יכולים לבטל את הרישום או לרשום את העברת הדוא"ל שלי ללא רשותי {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

אנו משתמשים באימות רשומות MX ו-<strong class="notranslate">TXT</strong>, לכן אם תוסיפו את רשומות ה-MX וה-<strong class="notranslate">TXT</strong> המתאימות לשירות זה, אז אתם רשומים. אם תסירו אותן, אז אתם לא רשומים. יש לכם בעלות על הדומיין שלכם וניהול ה-DNS, כך שאם למישהו יש גישה אליו, זו בעיה.

### איך זה בחינם {#how-is-it-free}

Forward Email מציעה שכבה חינמית באמצעות שילוב של פיתוח בקוד פתוח, תשתית יעילה ותוכניות בתשלום אופציונליות התומכות בשירות.

הרמה החינמית שלנו נתמכת על ידי:

1. **פיתוח קוד פתוח**: בסיס הקוד שלנו הוא קוד פתוח, המאפשר תרומות מהקהילה ותפעול שקוף.

2. **תשתית יעילה**: אופטימיזציה של המערכות שלנו לטיפול בהעברת דוא"ל עם משאבים מינימליים.

3. **תוכניות פרימיום בתשלום**: משתמשים הזקוקים לתכונות נוספות כמו שליחת SMTP, קבלת IMAP או אפשרויות פרטיות משופרות נרשמים לתוכניות בתשלום שלנו.

4. **מגבלות שימוש סבירות**: לרמה החינמית יש מדיניות שימוש הוגן למניעת שימוש לרעה.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### מהו גודל האימייל המקסימלי המותר {#what-is-the-max-email-size-limit}

אנו מגבילים כברירת מחדל את גודל הקבצים ל-50MB, הכולל תוכן, כותרות וקבצים מצורפים. שימו לב ששירותים כמו Gmail ו-Outlook מאפשרים מגבלת גודל של 25MB בלבד, ואם תחרגו מהמגבלה בעת שליחת כתובות אצל ספקים אלה תקבלו הודעת שגיאה.

מוחזרת שגיאה עם קוד התגובה המתאים אם חורגים ממגבלת גודל הקובץ.

### האם אתם מאחסנים יומני דוא"ל {#do-you-store-logs-of-emails}

לא, אנחנו לא כותבים לדיסק או מאחסנים יומני רישום – עם [למעט שגיאות](#do-you-store-error-logs) ו-[SMTP יוצא](#do-you-support-sending-email-with-smtp) (ראו את [מדיניות פרטיות](/privacy) שלנו).

הכל נעשה בזיכרון ו-[קוד המקור שלנו נמצא ב-GitHub](https://github.com/forwardemail).

### האם אתם מאחסנים יומני שגיאות {#do-you-store-error-logs}

כן. ניתן לגשת ליומני שגיאות תחת [החשבון שלי → יומנים](/my-account/logs) או [החשבון שלי → דומיינים](/my-account/domains).

החל מפברואר 2023, אנו מאחסנים יומני שגיאות עבור קודי תגובה של SMTP `4xx` ו- `5xx` למשך 7 ימים - המכילים את שגיאת ה-SMTP, המעטפה וכותרות הדוא"ל (אנחנו **לא** מאחסנים את גוף הדוא"ל או את הקבצים המצורפים).

יומני שגיאות מאפשרים לך לבדוק אם חסרים הודעות דוא"ל חשובות ולצמצם תוצאות חיוביות שגויות של ספאם עבור [הדומיינים שלך](/my-account/domains). הם גם משאב נהדר לאיתור בעיות עם [וובים של דוא"ל](#do-you-support-webhooks) (מכיוון שיומני השגיאות מכילים את תגובת נקודת הקצה של webhook).

יומני שגיאות עבור [הגבלת קצב](#do-you-have-rate-limiting) ו-[רשימה אפורה](#do-you-have-a-greylist) אינם נגישים מכיוון שהחיבור מסתיים מוקדם (למשל, לפני שניתן להעביר את הפקודות `RCPT TO` ו-`MAIL FROM`).

למידע נוסף, עיין ב-[מדיניות פרטיות](/privacy) שלנו.

### האם אתה קורא את האימיילים שלי {#do-you-read-my-emails}

לא, בהחלט לא. ראה את [מדיניות פרטיות](/privacy) שלנו.

שירותי העברת דוא"ל רבים אחרים מאחסנים ויכולים לקרוא את הדוא"ל שלך. אין סיבה שדוא"ל מועבר צריך להיות מאוחסן בכונן קשיח - ולכן עיצבנו את פתרון הקוד הפתוח הראשון שעושה את הכל בזיכרון.

אנו מאמינים שמגיעה לך הזכות לפרטיות ואנו מכבדים אותה בקפדנות. הקוד שנפרס בשרת הוא [תוכנה בקוד פתוח ב-GitHub](https://github.com/forwardemail) לשם שקיפות ובניית אמון.

### האם ניתן "לשלוח דואר כ" ב-Gmail עם {#can-i-send-mail-as-in-gmail-with-this} זה?

כן! החל מ-2 באוקטובר 2018 הוספנו תכונה זו. ראה [איך לשלוח דואר כ-"דרך ג'ימייל"](#how-to-send-mail-as-using-gmail) לעיל!

עליך גם להגדיר את רשומת ה-SPF עבור Gmail ברשומת ה-<strong class="notranslate">TXT</strong> של תצורת ה-DNS שלך.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-Gmail (לדוגמה, Send Mail As) או ב-G Suite, תצטרכו להוסיף <code>include:_spf.google.com</code> לרשומת SPF <strong class="notranslate">TXT</strong> שלכם, לדוגמה:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### האם ניתן "לשלוח דואר כ" באאוטלוק עם {#can-i-send-mail-as-in-outlook-with-this} זה?

כן! החל מ-2 באוקטובר 2018 הוספנו תכונה זו. פשוט עיינו בשני הקישורים הבאים ממיקרוסופט:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

עליך גם להגדיר את רשומת SPF עבור Outlook ברשומת ה-<strong class="notranslate">TXT</strong> של תצורת ה-DNS שלך.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
חשוב:
</strong>
<span>
אם אתם משתמשים ב-Microsoft Outlook או ב-Live.com, תצטרכו להוסיף <code>include:spf.protection.outlook.com</code> לרשומת SPF <strong class="notranslate">TXT</strong> שלכם, לדוגמה:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### האם ניתן "לשלוח דואר כ" ב-Apple Mail וב-iCloud Mail עם {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} זה?

אם אתם מנויים ל-iCloud+‎, תוכלו להשתמש בדומיין מותאם אישית. [השירות שלנו תואם גם ל-Apple Mail](#apple-mail).

למידע נוסף, אנא עיינו ב-<https://support.apple.com/en-us/102540>.

### האם ניתן להעביר אימיילים ללא הגבלה באמצעות {#can-i-forward-unlimited-emails-with-this}

כן, אולם שולחים "יחסית לא ידועים" מוגבלים ל-100 חיבורים לשעה לכל שם מארח או IP. ראה את הסעיף [הגבלת קצב](#do-you-have-rate-limiting) ו-[רשימה אפורה](#do-you-have-a-greylist) לעיל.

כשאנחנו אומרים "יחסית לא ידוע", אנחנו מתכוונים לשולחים שאינם מופיעים ב-[רשימת היתרים](#do-you-have-an-allowlist).

אם חורגים ממגבלה זו, אנו שולחים קוד תגובה 421 המורה לשרת הדואר של השולח לנסות שוב מאוחר יותר.

### האם אתם מציעים דומיינים ללא הגבלה במחיר אחד {#do-you-offer-unlimited-domains-for-one-price}

כן. ללא קשר לתוכנית שבה אתם בוחרים, תשלמו רק תעריף חודשי אחד – המכסה את כל הדומיינים שלכם.

### אילו אמצעי תשלום אתם מקבלים {#which-payment-methods-do-you-accept}

העברת דוא"ל מקבלת את שיטות התשלום החד-פעמיות או החודשיות/רבעוניות/שנתיות הבאות:

1. **כרטיסי אשראי/חיוב/העברות בנקאיות**: ויזה, מאסטרקארד, אמריקן אקספרס, דיסקבר, JCB, דיינרס קלאב וכו'.
2. **פייפאל**: חברו את חשבון הפייפאל שלכם לתשלומים קלים
3. **מטבעות קריפטוגרפיים**: אנו מקבלים תשלומים באמצעות stablecoin של Stripe ברשתות Ethereum, Polygon ו-Solana

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

כל התשלומים מעובדים בצורה מאובטחת דרך Stripe או PayPal. פרטי התשלום שלך לעולם לא נשמרים בשרתים שלנו.

## משאבים נוספים {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [מקרי בוחן ותיעוד למפתחים](/blog/docs)
* [אֶמְצָעִי](/resources)
* [מדריכים](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/