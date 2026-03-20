# שאלות נפוצות {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email frequently asked questions" class="rounded-lg" />


## תוכן העניינים {#table-of-contents}

* [התחלה מהירה](#quick-start)
* [הקדמה](#introduction)
  * [מה זה Forward Email](#what-is-forward-email)
  * [מי משתמש ב-Forward Email](#who-uses-forward-email)
  * [מה ההיסטוריה של Forward Email](#what-is-forward-emails-history)
  * [כמה מהירה השירות הזה](#how-fast-is-this-service)
* [לקוחות דואר אלקטרוני](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [מכשירים ניידים](#mobile-devices)
  * [הגדרת Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [הגדרת Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [הגדרת msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [לקוחות דואר שורת פקודה](#command-line-email-clients)
  * [הגדרת דואר ב-Windows](#windows-email-configuration)
  * [הגדרת Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [איך לשלוח דואר בשם באמצעות Gmail](#how-to-send-mail-as-using-gmail)
  * [מהו המדריך החינמי הישן לשליחת דואר בשם באמצעות Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [הגדרת ניתוב Gmail מתקדמת](#advanced-gmail-routing-configuration)
  * [הגדרת ניתוב Outlook מתקדמת](#advanced-outlook-routing-configuration)
* [פתרון בעיות](#troubleshooting)
  * [למה אני לא מקבל את מיילי הבדיקה](#why-am-i-not-receiving-my-test-emails)
  * [איך להגדיר את לקוח הדואר שלי לעבוד עם Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [למה המיילים שלי נוחתים בספאם ובזבל ואיך לבדוק את מוניטין הדומיין שלי](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [מה לעשות אם אני מקבל מיילי ספאם](#what-should-i-do-if-i-receive-spam-emails)
  * [למה מיילי הבדיקה שנשלחים אליי ב-Gmail מופיעים כ"חשודים"]( #why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [האם אפשר להסיר את via forwardemail dot net ב-Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [ניהול נתונים](#data-management)
  * [איפה ממוקמים השרתים שלכם](#where-are-your-servers-located)
  * [איך לייצא ולגבות את תיבת הדואר שלי](#how-do-i-export-and-backup-my-mailbox)
  * [איך לייבא ולהעביר את תיבת הדואר הקיימת שלי](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [איך להשתמש באחסון תואם S3 לגיבויים](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [איך להמיר גיבויי SQLite לקבצי EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [האם אתם תומכים באירוח עצמי](#do-you-support-self-hosting)
* [הגדרת דואר אלקטרוני](#email-configuration)
  * [איך להתחיל ולהגדיר העברת דואר](#how-do-i-get-started-and-set-up-email-forwarding)
  * [האם אפשר להשתמש בכמה שרתי MX להעברה מתקדמת](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [איך להגדיר מענה חופשה (מענה אוטומטי מחוץ למשרד)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [איך להגדיר SPF עבור Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [איך להגדיר DKIM עבור Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [איך להגדיר DMARC עבור Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [איך לצפות בדוחות DMARC](#how-do-i-view-dmarc-reports)
  * [איך לחבר ולהגדיר את אנשי הקשר שלי](#how-do-i-connect-and-configure-my-contacts)
  * [איך לחבר ולהגדיר את היומנים שלי](#how-do-i-connect-and-configure-my-calendars)
  * [איך להוסיף יומנים נוספים ולנהל יומנים קיימים](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [איך לחבר ולהגדיר משימות ותזכורות](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [למה אני לא יכול ליצור משימות ב-macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [איך להגדיר Tasks.org באנדרואיד](#how-do-i-set-up-tasksorg-on-android)
  * [איך להגדיר SRS עבור Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [איך להגדיר MTA-STS עבור Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [איך להוסיף תמונת פרופיל לכתובת הדואר שלי](#how-do-i-add-a-profile-picture-to-my-email-address)
* [תכונות מתקדמות](#advanced-features)
  * [האם אתם תומכים בניוזלטרים או רשימות דיוור לשיווק בדואר](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [האם אתם תומכים בשליחת דואר באמצעות API](#do-you-support-sending-email-with-api)
  * [האם אתם תומכים בקבלת דואר באמצעות IMAP](#do-you-support-receiving-email-with-imap)
  * [האם אתם תומכים ב-POP3](#do-you-support-pop3)
  * [האם אתם תומכים ביומנים (CalDAV)](#do-you-support-calendars-caldav)
  * [האם אתם תומכים במשימות ותזכורות (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [האם אתם תומכים באנשי קשר (CardDAV)](#do-you-support-contacts-carddav)
  * [האם אתם תומכים בשליחת דואר באמצעות SMTP](#do-you-support-sending-email-with-smtp)
  * [האם אתם תומכים ב-OpenPGP/MIME, הצפנה מקצה לקצה ("E2EE"), ו-Web Key Directory ("WKD")] (#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [האם אתם תומכים בהצפנת S/MIME](#do-you-support-smime-encryption)
  * [האם אתם תומכים בסינון דואר באמצעות Sieve](#do-you-support-sieve-email-filtering)
  * [האם אתם תומכים ב-MTA-STS](#do-you-support-mta-sts)
  * [האם אתם תומכים במפתחות גישה ו-WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [האם אתם תומכים בפרקטיקות מיטביות לדואר אלקטרוני](#do-you-support-email-best-practices)
  * [האם אתם תומכים ב-webhooks לבאונס](#do-you-support-bounce-webhooks)
  * [האם אתם תומכים ב-webhooks](#do-you-support-webhooks)
  * [האם אתם תומכים בביטויים רגולריים או regex](#do-you-support-regular-expressions-or-regex)
  * [מהם מגבלות ה-SMTP היוצא שלכם](#what-are-your-outbound-smtp-limits)
  * [האם אני צריך אישור כדי להפעיל SMTP](#do-i-need-approval-to-enable-smtp)
  * [מהם הגדרות תצורת שרת ה-SMTP שלכם](#what-are-your-smtp-server-configuration-settings)
  * [מהם הגדרות תצורת שרת ה-IMAP שלכם](#what-are-your-imap-server-configuration-settings)
  * [מהם הגדרות תצורת שרת ה-POP3 שלכם](#what-are-your-pop3-server-configuration-settings)
  * [איך להגדיר גילוי אוטומטי של דואר עבור הדומיין שלי](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [אבטחה](#security-1)
  * [טכניקות חיזוק שרת מתקדמות](#advanced-server-hardening-techniques)
  * [האם יש לכם תעודות SOC 2 או ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [האם אתם משתמשים בהצפנת TLS להעברת דואר](#do-you-use-tls-encryption-for-email-forwarding)
  * [האם אתם שומרים על כותרות אימות הדואר](#do-you-preserve-email-authentication-headers)
  * [האם אתם שומרים על כותרות הדואר המקוריות ומונעים זיוף](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [איך אתם מגנים מפני ספאם והתעללות](#how-do-you-protect-against-spam-and-abuse)
  * [האם אתם מאחסנים תוכן דואר על הדיסק](#do-you-store-email-content-on-disk)
  * [האם תוכן הדואר יכול להיחשף בזמן קריסות מערכת](#can-email-content-be-exposed-during-system-crashes)
  * [מי יש לו גישה לתשתית הדואר שלכם](#who-has-access-to-your-email-infrastructure)
  * [אילו ספקי תשתית אתם משתמשים](#what-infrastructure-providers-do-you-use)
  * [האם אתם מציעים הסכם עיבוד נתונים (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [איך אתם מטפלים בהודעות פריצות נתונים](#how-do-you-handle-data-breach-notifications)
  * [האם אתם מציעים סביבת בדיקה](#do-you-offer-a-test-environment)
  * [האם אתם מספקים כלים לניטור והתראות](#do-you-provide-monitoring-and-alerting-tools)
  * [איך אתם מבטיחים זמינות גבוהה](#how-do-you-ensure-high-availability)
  * [האם אתם עומדים בדרישות סעיף 889 של חוק הסמכת ההגנה הלאומית (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [פרטים מערכתיים וטכניים](#system-and-technical-details)
  * [האם אתם מאחסנים מיילים ותוכנם](#do-you-store-emails-and-their-contents)
  * [איך מערכת העברת הדואר שלכם פועלת](#how-does-your-email-forwarding-system-work)
  * [איך אתם מעבדים מייל להעברה](#how-do-you-process-an-email-for-forwarding)
  * [איך אתם מטפלים בבעיות מסירת דואר](#how-do-you-handle-email-delivery-issues)
  * [איך אתם מתמודדים עם חסימת כתובות ה-IP שלכם](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [מהן כתובות הפוסטמאסטר](#what-are-postmaster-addresses)
  * [מהן כתובות no-reply](#what-are-no-reply-addresses)
  * [מהן כתובות ה-IP של השרת שלכם](#what-are-your-servers-ip-addresses)
  * [האם יש לכם רשימת הרשאות (allowlist)](#do-you-have-an-allowlist)
  * [אילו סיומות דומיין כלולות ברשימת ההרשאות כברירת מחדל](#what-domain-name-extensions-are-allowlisted-by-default)
  * [מה הקריטריונים שלכם לרשימת ההרשאות](#what-is-your-allowlist-criteria)
  * [אילו סיומות דומיין אפשר להשתמש בחינם](#what-domain-name-extensions-can-be-used-for-free)
  * [האם יש לכם רשימת אפור (greylist)](#do-you-have-a-greylist)
  * [האם יש לכם רשימת חסימה (denylist)](#do-you-have-a-denylist)
  * [האם יש לכם הגבלת קצב](#do-you-have-rate-limiting)
  * [איך אתם מגנים מפני backscatter](#how-do-you-protect-against-backscatter)
  * [מניעת באונסים ממיילרים ידועים](#prevent-bounces-from-known-mail-from-spammers)
  * [מניעת באונסים מיותרים להגנה מפני backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [איך אתם קובעים טביעת אצבע של מייל](#how-do-you-determine-an-email-fingerprint)
  * [האם אפשר להעביר מיילים לפורטים אחרים מלבד 25 (למשל אם ספק האינטרנט חסם את פורט 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [האם זה תומך בסימן הפלוס + עבור כינויים ב-Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [האם זה תומך בתת-דומיינים](#does-it-support-sub-domains)
  * [האם זה מעביר את כותרות המייל שלי](#does-this-forward-my-emails-headers)
  * [האם זה נבדק היטב](#is-this-well-tested)
  * [האם אתם מעבירים הודעות וקודי תגובה של SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [איך אתם מונעים ספאמרים ומבטיחים מוניטין טוב להעברת דואר](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [איך אתם מבצעים חיפושי DNS על שמות דומיין](#how-do-you-perform-dns-lookups-on-domain-names)
* [חשבון וחשבוניות](#account-and-billing)
  * [האם אתם מציעים אחריות להחזר כספי בתכניות בתשלום](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [אם אני משנה תכנית, האם אתם מחשבים פרופורציה ומחזירים את ההפרש](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [האם אפשר להשתמש בשירות העברת הדואר הזה כשרת MX "גיבוי" או "מחליף"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [האם אפשר להשבית כינויים ספציפיים](#can-i-disable-specific-aliases)
  * [האם אפשר להעביר מיילים למספר נמענים](#can-i-forward-emails-to-multiple-recipients)
  * [האם אפשר שיהיו לי כמה נמענים כלליים גלובליים](#can-i-have-multiple-global-catch-all-recipients)
  * [האם יש מגבלה מקסימלית על מספר כתובות הדואר שאני יכול להעביר לכל כינוי](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [האם אפשר להעביר מיילים ברקורסיה](#can-i-recursively-forward-emails)
  * [האם אנשים יכולים להסיר או להירשם להעברת הדואר שלי ללא רשותי](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [איך זה בחינם](#how-is-it-free)
  * [מה המגבלה המקסימלית על גודל מייל](#what-is-the-max-email-size-limit)
  * [האם אתם מאחסנים לוגים של מיילים](#do-you-store-logs-of-emails)
  * [האם אתם מאחסנים לוגים של שגיאות](#do-you-store-error-logs)
  * [האם אתם קוראים את המיילים שלי](#do-you-read-my-emails)
  * [האם אפשר "לשלוח דואר בשם" ב-Gmail עם זה](#can-i-send-mail-as-in-gmail-with-this)
  * [האם אפשר "לשלוח דואר בשם" ב-Outlook עם זה](#can-i-send-mail-as-in-outlook-with-this)
  * [האם אפשר "לשלוח דואר בשם" ב-Apple Mail ו-iCloud Mail עם זה](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [האם אפשר להעביר מיילים ללא הגבלה עם זה](#can-i-forward-unlimited-emails-with-this)
  * [האם אתם מציעים דומיינים ללא הגבלה במחיר אחד](#do-you-offer-unlimited-domains-for-one-price)
  * [אילו שיטות תשלום אתם מקבלים](#which-payment-methods-do-you-accept)
* [משאבים נוספים](#additional-resources)
## התחלה מהירה {#quick-start}

כדי להתחיל עם Forward Email:

1. **צור חשבון** ב-[forwardemail.net/register](https://forwardemail.net/register)

2. **הוסף ואמת את הדומיין שלך** תחת [My Account → Domains](/my-account/domains)

3. **הוסף וקבע תצורה של כינויים/תיבות דואר אלקטרוני** תחת [My Account → Domains](/my-account/domains) → Aliases

4. **בדוק את ההגדרות שלך** על ידי שליחת אימייל לאחד מהכינויים החדשים שלך

> \[!TIP]
> שינויים ב-DNS יכולים לקחת עד 24-48 שעות להתפשט ברחבי העולם, אך לרוב הם נכנסים לתוקף הרבה יותר מהר.

> \[!IMPORTANT]
> לשיפור יכולת המסירה, אנו ממליצים להגדיר רשומות [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), ו-[DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## מבוא {#introduction}

### מה זה Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email מתאים לאנשים פרטיים, עסקים קטנים ומפתחים שרוצים כתובות אימייל מקצועיות ללא העלות והתחזוקה של פתרון אירוח דואר מלא.

Forward Email הוא **ספק שירות דואר אלקטרוני מלא תכונות** ו-**ספק אירוח דואר אלקטרוני לדומיינים מותאמים אישית**.

זהו השירות החינמי והקוד הפתוח היחיד, ומאפשר לך להשתמש בכתובות דואר אלקטרוני עם דומיין מותאם אישית ללא המורכבות של הקמה ותחזוקה של שרת דואר משלך.

השירות שלנו מפנה מיילים שנשלחים לדומיין המותאם אישית שלך לחשבון הדואר הקיים שלך – ואתה אפילו יכול להשתמש בנו כספק אירוח דואר ייעודי.

תכונות מרכזיות של Forward Email:

* **דואר אלקטרוני עם דומיין מותאם אישית**: השתמש בכתובות דואר מקצועיות עם שם הדומיין שלך
* **רמת חינם**: הפניית דואר בסיסית ללא עלות
* **פרטיות משופרת**: אנחנו לא קוראים את המיילים שלך ולא מוכרים את הנתונים שלך
* **קוד פתוח**: כל קוד המקור שלנו זמין ב-GitHub
* **תמיכה ב-SMTP, IMAP ו-POP3**: יכולות מלאות לשליחה וקבלה של דואר אלקטרוני
* **הצפנה מקצה לקצה**: תמיכה ב-OpenPGP/MIME
* **כינויים כלליים מותאמים אישית**: צור כינויים ללא הגבלה

אתה יכול להשוות אותנו ל-56+ ספקי שירות דואר אלקטרוני אחרים ב-[דף ההשוואה שלנו](/blog/best-email-service).

> \[!TIP]
> למד עוד על Forward Email על ידי קריאת [המסמך הטכני החינמי שלנו](/technical-whitepaper.pdf)

### מי משתמש ב-Forward Email {#who-uses-forward-email}

אנו מספקים שירות אירוח דואר והפניית דואר ל-500,000+ דומיינים ולמשתמשים הבולטים הבאים:

| לקוח                                   | מקרה בוחן                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| האקדמיה הימית של ארה"ב                  | [:page_facing_up: מקרה בוחן](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: מקרה בוחן](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: מקרה בוחן](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: מקרה בוחן](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: מקרה בוחן](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: מקרה בוחן](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: מקרה בוחן](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| אוניברסיטת קיימברידג'                   | [:page_facing_up: מקרה בוחן](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| אוניברסיטת מרילנד                       | [:page_facing_up: מקרה בוחן](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| אוניברסיטת וושינגטון                    | [:page_facing_up: מקרה בוחן](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| אוניברסיטת טאפטס                        | [:page_facing_up: מקרה בוחן](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: מקרה בוחן](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| ממשלת דרום אוסטרליה                     |                                                                                                          |
| ממשלת הרפובליקה הדומיניקנית             |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: מקרה בוחן](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### מהי ההיסטוריה של Forward Email {#what-is-forward-emails-history}

אתה יכול ללמוד עוד על Forward Email ב[דף האודות שלנו](/about).

### כמה מהירה השירות הזה {#how-fast-is-this-service}

> \[!NOTE]
> המערכת שלנו מתוכננת למהירות ואמינות, עם מספר שרתים מיותרים כדי להבטיח שהאימיילים שלך יגיעו במהירות.

Forward Email מספק הודעות עם עיכוב מינימלי, בדרך כלל בתוך שניות מקבלת ההודעה.

מדדי ביצועים:

* **זמן אספקה ממוצע**: פחות מ-5-10 שניות מקבלת ההודעה להעברה ([ראה את דף המעקב שלנו זמן לתיבת הדואר "TTI"](/tti))
* **זמינות**: זמינות שירות של 99.9%+
* **תשתית גלובלית**: שרתים ממוקמים אסטרטגית לניתוב מיטבי
* **קנה מידה אוטומטי**: המערכת שלנו מתרחבת בתקופות שיא של אימיילים

אנו פועלים בזמן אמת, בניגוד לספקים אחרים שתלויים בתורים עם עיכוב.

איננו כותבים לדיסק או שומרים לוגים – עם [החריג של שגיאות](#do-you-store-error-logs) ו[SMTP יוצא](#do-you-support-sending-email-with-smtp) (ראה את [מדיניות הפרטיות שלנו](/privacy)).

הכל נעשה בזיכרון ו[קוד המקור שלנו ב-GitHub](https://github.com/forwardemail).


## לקוחות דואר אלקטרוני {#email-clients}

### Thunderbird {#thunderbird}

1. צור כינוי חדש ויצר סיסמה בלוח הבקרה של Forward Email
2. פתח את Thunderbird ועבור ל- **Edit → Account Settings → Account Actions → Add Mail Account**
3. הזן את שמך, כתובת Forward Email והסיסמה
4. לחץ על **Configure manually** והזן:
   * נכנס: IMAP, `imap.forwardemail.net`, פורט 993, SSL/TLS
   * יוצא: SMTP, `smtp.forwardemail.net`, פורט 465, SSL/TLS (מומלץ; פורט 587 עם STARTTLS נתמך גם כן)
5. לחץ על **Done**

### Microsoft Outlook {#microsoft-outlook}

1. צור כינוי חדש ויצר סיסמה בלוח הבקרה של Forward Email
2. עבור ל- **File → Add Account**
3. הזן את כתובת Forward Email ולחץ על **Connect**
4. בחר ב- **Advanced options** וסמן **Let me set up my account manually**
5. בחר ב- **IMAP** והזן:
   * נכנס: `imap.forwardemail.net`, פורט 993, SSL
   * יוצא: `smtp.forwardemail.net`, פורט 465, SSL/TLS (מומלץ; פורט 587 עם STARTTLS נתמך גם כן)
   * שם משתמש: כתובת האימייל המלאה שלך
   * סיסמה: הסיסמה שיצרת
6. לחץ על **Connect**

### Apple Mail {#apple-mail}

1. צור כינוי חדש ויצר סיסמה בלוח הבקרה של Forward Email
2. עבור ל- **Mail → Preferences → Accounts → +**
3. בחר ב- **Other Mail Account**
4. הזן את שמך, כתובת Forward Email והסיסמה
5. עבור הגדרות השרת, הזן:
   * נכנס: `imap.forwardemail.net`
   * יוצא: `smtp.forwardemail.net`
   * שם משתמש: כתובת האימייל המלאה שלך
   * סיסמה: הסיסמה שיצרת
6. לחץ על **Sign In**

### eM Client {#em-client}

1. צור כינוי חדש ויצר סיסמה בלוח הבקרה של Forward Email
2. פתח את eM Client ועבור ל- **Menu → Accounts → + Add Account**
3. לחץ על **Mail** ואז בחר ב- **Other**
4. הזן את כתובת Forward Email ולחץ על **Next**
5. הזן את הגדרות השרת הבאות:
   * **שרת נכנס**: `imap.forwardemail.net`
   * **שרת יוצא**: `smtp.forwardemail.net`
6. הזן את כתובת האימייל המלאה שלך כ- **User name** ואת הסיסמה שיצרת כ- **Password** עבור שני השרתים הנכנס והיוצא.
7. eM Client יבדוק את החיבור. לאחר שהבדיקה תעבור, לחץ על **Next**.
8. הזן את שמך ובחר שם לחשבון.
9. לחץ על **Finish**.

### מכשירים ניידים {#mobile-devices}

עבור iOS:

1. עבור ל- **Settings → Mail → Accounts → Add Account → Other**
2. הקש על **Add Mail Account** והזן את פרטיך
3. עבור הגדרות השרת, השתמש באותן הגדרות IMAP ו-SMTP כמפורט למעלה

עבור Android:

1. עבור ל- **Settings → Accounts → Add Account → Personal (IMAP)**
2. הזן את כתובת Forward Email והסיסמה
3. עבור הגדרות השרת, השתמש באותן הגדרות IMAP ו-SMTP כמפורט למעלה

### הגדרת Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

אתה יכול להגדיר את Sendmail להעביר אימיילים דרך שרתי SMTP של Forward Email. זוהי הגדרה נפוצה למערכות ישנות או יישומים שתלויים ב-Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן התקנה משוער:</strong>
  <span>פחות מ-20 דקות</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    זה דורש תוכנית בתשלום עם גישה ל-SMTP מופעלת.
  </span>
</div>

#### Configuration {#configuration}

1. ערוך את הקובץ `sendmail.mc` שלך, שנמצא בדרך כלל ב-`/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. הוסף את השורות הבאות כדי להגדיר את ה-smart host והאימות:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. צור את קובץ האימות `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. הוסף את פרטי ההתחברות שלך ל-Forward Email לקובץ `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. צור את מסד הנתונים של האימות ואבטח את הקבצים:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. בנה מחדש את תצורת Sendmail והפעל מחדש את השירות:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testing {#testing}

שלח דואר אלקטרוני לבדיקה כדי לוודא את התצורה:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay Configuration {#exim4-smtp-relay-configuration}

Exim4 הוא MTA פופולרי במערכות מבוססות Debian. ניתן להגדיר אותו להשתמש ב-Forward Email כ-smarthost.

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
    זה דורש תוכנית בתשלום עם גישה ל-SMTP מופעלת.
  </span>
</div>

#### Configuration {#configuration-1}

1. הפעל את כלי התצורה של Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. בחר את האפשרויות הבאות:
   * **סוג כללי של תצורת דואר:** דואר שנשלח דרך smarthost; מתקבל דרך SMTP או fetchmail
   * **שם דואר מערכת:** your.hostname
   * **כתובות IP להאזנה לחיבורים נכנסים של SMTP:** 127.0.0.1 ; ::1
   * **יעדים אחרים לקבלת דואר:** (השאר ריק)
   * **דומיינים להעברת דואר עבורם:** (השאר ריק)
   * **כתובת IP או שם מארח של ה-smarthost היוצא:** smtp.forwardemail.net::465
   * **להסתיר את שם הדואר המקומי בדואר היוצא?** לא
   * **לשמור על מספר מינימלי של שאילתות DNS (Dial-on-Demand)?** לא
   * **שיטת משלוח לדואר מקומי:** פורמט Mbox ב-/var/mail/
   * **לפצל את התצורה לקבצים קטנים?** לא

3. ערוך את הקובץ `passwd.client` כדי להוסיף את פרטי ההתחברות שלך:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. הוסף את השורה הבאה:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. עדכן את התצורה והפעל מחדש את Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testing {#testing-1}

שלח דואר אלקטרוני לבדיקה:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP Client Configuration {#msmtp-smtp-client-configuration}

msmtp הוא לקוח SMTP קל משקל, שימושי לשליחת מיילים מתוך סקריפטים או יישומי שורת פקודה.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן התקנה משוער:</strong>
  <span>פחות מ-10 דקות</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    זה דורש תוכנית בתשלום עם גישה ל-SMTP מופעלת.
  </span>
</div>

#### תצורה {#configuration-2}

1. צור או ערוך את קובץ התצורה של msmtp ב-`~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. הוסף את התצורה הבאה:

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

3. הגדר הרשאות נכונות לקובץ התצורה:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### בדיקה {#testing-2}

שלח דואר אלקטרוני לבדיקה:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### לקוחות דואר שורת פקודה {#command-line-email-clients}

לקוחות דואר פופולריים בשורת הפקודה כמו [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), ו-[Alpine](https://alpine.x10.mx/alpine/release/) יכולים להיות מוגדרים להשתמש בשרתי ה-SMTP של Forward Email לשליחת דואר. התצורה תהיה דומה להגדרת `msmtp`, שבה תספק את פרטי שרת ה-SMTP ואת האישורים שלך בקבצי התצורה המתאימים (`.muttrc`, `.neomuttrc`, או `.pinerc`).

### תצורת דואר ב-Windows {#windows-email-configuration}

למשתמשי Windows, ניתן להגדיר לקוחות דואר פופולריים כמו **Microsoft Outlook** ו-**eM Client** באמצעות הגדרות IMAP ו-SMTP המסופקות בחשבון Forward Email שלך. לשימוש בשורת פקודה או סקריפטים, ניתן להשתמש ב-cmdlet של PowerShell `Send-MailMessage` (אף על פי שהוא נחשב מיושן) או בכלי SMTP קל משקל כמו [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### תצורת ריליי SMTP ל-Postfix {#postfix-smtp-relay-configuration}

ניתן להגדיר את Postfix להעביר דואר דרך שרתי ה-SMTP של Forward Email. זה שימושי ליישומי שרת שצריכים לשלוח דואר אלקטרוני.

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
    זה דורש תוכנית בתשלום עם גישה ל-SMTP מופעלת.
  </span>
</div>

#### התקנה {#installation}

1. התקן את Postfix בשרת שלך:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. במהלך ההתקנה, בחר "Internet Site" כאשר תתבקש לבחור סוג תצורה.

#### תצורה {#configuration-3}

1. ערוך את קובץ התצורה הראשי של Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. הוסף או שנה את ההגדרות הבאות:

```
# תצורת ריליי SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. צור את קובץ סיסמת SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. הוסף את אישורי Forward Email שלך:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. אבטח ו-hash את קובץ הסיסמה:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. הפעל מחדש את Postfix:

```bash
sudo systemctl restart postfix
```

#### בדיקה {#testing-3}

בדוק את התצורה שלך על ידי שליחת דואר אלקטרוני לבדיקה:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### כיצד לשלוח דואר בשם באמצעות Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן התקנה משוער:</strong>
  <span>פחות מ-10 דקות</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    התחלה:
  </strong>
  <span>
    אם עקבת אחר ההוראות למעלה תחת <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">איך להתחיל ולהגדיר העברת דואר אלקטרוני</a>, אז תוכל להמשיך לקרוא למטה.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אנא ודא שקראת את <a href="/terms" class="alert-link" target="_blank">תנאי השימוש</a>, <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a>, ו-<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">מגבלות SMTP יוצאות</a> – השימוש שלך נחשב לאישור והסכמה.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה מפתח, אז עיין ב-<a class="alert-link" href="/email-api#outbound-emails" target="_blank">תיעוד API הדואר האלקטרוני</a> שלנו.
  </span>
</div>

1. עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> הגדרת SMTP יוצא ופעל לפי הוראות ההתקנה

2. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>)

3. לחץ על <strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> ליד הכינוי שנוצר זה עתה. העתק ללוח והעבר לאחסון מאובטח את הסיסמה שנוצרה המוצגת על המסך.

4. עבור אל [Gmail](https://gmail.com) ותחת [הגדרות <i class="fa fa-angle-right"></i> חשבונות וייבוא <i class="fa fa-angle-right"></i> שלח דואר בשם](https://mail.google.com/mail/u/0/#settings/accounts), לחץ על "הוסף כתובת דואר אלקטרוני נוספת"

5. כאשר תתבקש להזין "שם", הזן את השם שברצונך שיופיע כ"שולח" בדואר האלקטרוני שלך (למשל "לינוס טורוולדס").

6. כאשר תתבקש להזין "כתובת דואר אלקטרוני", הזן את כתובת הדואר המלאה של כינוי שיצרת תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>)

7. בטל את הסימון של "טפל ככינוי"

8. לחץ על "שלב הבא" כדי להמשיך

9. כאשר תתבקש להזין "שרת SMTP", הזן <code>smtp.forwardemail.net</code> ושנה את הפורט ל-<code>465</code>

10. כאשר תתבקש להזין "שם משתמש", הזן את כתובת הדואר המלאה של כינוי שיצרת תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>)

11. כאשר תתבקש להזין "סיסמה", הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> בשלב 3 למעלה

12. בחר את כפתור הרדיו עבור "חיבור מאובטח באמצעות SSL"

13. לחץ על "הוסף חשבון" כדי להמשיך

14. פתח לשונית חדשה ב-[Gmail](https://gmail.com) והמתן להגעת דואר האימות שלך (תקבל קוד אימות המאשר שאתה הבעלים של כתובת הדואר שאתה מנסה "לשלוח דואר בשם")

15. כאשר הוא יגיע, העתק והדבק את קוד האימות בהנחיה שקיבלת בשלב הקודם
16. לאחר שסיימת את זה, חזור למייל ולחץ על הקישור כדי "לאשר את הבקשה". סביר להניח שתצטרך לבצע את הצעד הזה ואת הצעד הקודם כדי שהמייל יוגדר כראוי.

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

### מהו המדריך ללא מורשת לשליחת דואר בשם באמצעות Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">חשוב:</strong> מדריך ללא מורשת זה אינו בתוקף מאז מאי 2023 מכיוון ש<a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">כעת אנו תומכים ב-SMTP יוצא</a>. אם תשתמש במדריך למטה, אז <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">זה יגרום למייל היוצא שלך</a> להופיע כ-"<span class="notranslate text-danger font-weight-bold">דרך forwardemail dot net</span>" ב-Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן הערכה להגדרה:</strong>
  <span>פחות מ-10 דקות</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    התחלה:
  </strong>
  <span>
    אם עקבת אחר ההוראות למעלה תחת <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">איך להתחיל ולהגדיר העברת דואר</a>, אז תוכל להמשיך לקרוא למטה.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. עליך להפעיל את [אימות דו-שלבי של Gmail][gmail-2fa] כדי שזה יעבוד. בקר ב-<https://www.google.com/landing/2step/> אם לא הפעלת אותו.

2. לאחר שהפעלת את האימות הדו-שלבי (או אם כבר היה מופעל), בקר ב-<https://myaccount.google.com/apppasswords>.

3. כאשר תתבקש לבחור "בחר את האפליקציה והמכשיר עבורם ברצונך ליצור סיסמת אפליקציה":
   * בחר "Mail" מתפריט הנפתח של "בחר אפליקציה"
   * בחר "Other" מתפריט הנפתח של "בחר מכשיר"
   * כאשר תתבקש להזין טקסט, הזן את כתובת המייל של הדומיין המותאם אישית שלך שממנו אתה מפנה (למשל <code><hello@example.com></code> - זה יעזור לך לעקוב במקרה שאתה משתמש בשירות זה עבור חשבונות מרובים)

4. העתק את הסיסמה ללוח הגזירים שנוצרה אוטומטית
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       חשוב:
     </strong>
     <span>
       אם אתה משתמש ב-G Suite, בקר בלוח הניהול שלך <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">אפליקציות <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> הגדרות ל-Gmail <i class="fa fa-angle-right"></i> הגדרות</a> וודא שסימנת "אפשר למשתמשים לשלוח דואר דרך שרת SMTP חיצוני...". יהיה עיכוב מסוים עד שהשינוי יופעל, אז אנא המתן כמה דקות.
     </span>
   </div>

5. עבור ל-[Gmail](https://gmail.com) ותחת [הגדרות <i class="fa fa-angle-right"></i> חשבונות וייבוא <i class="fa fa-angle-right"></i> שלח דואר בשם](https://mail.google.com/mail/u/0/#settings/accounts), לחץ על "הוסף כתובת דואר אלקטרוני נוספת"

6. כאשר תתבקש להזין "שם", הזן את השם שברצונך שיופיע כ"שולח" במייל שלך (למשל "Linus Torvalds")

7. כאשר תתבקש להזין "כתובת דואר אלקטרוני", הזן את כתובת המייל עם הדומיין המותאם אישית שהשתמשת בו למעלה (למשל <code><hello@example.com></code>)
8. בטל את הסימון של "טפל ככינוי"

9. לחץ על "Next Step" כדי להמשיך

10. כאשר תתבקש להזין "SMTP Server", הזן <code>smtp.gmail.com</code> והשאר את הפורט כ-<code>587</code>

11. כאשר תתבקש להזין "Username", הזן את החלק של כתובת הג'ימייל שלך ללא החלק <span>gmail.com</span> (למשל רק "user" אם האימייל שלי הוא <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        חשוב:
      </strong>
      <span>
        אם החלק של "Username" מתמלא אוטומטית, אז <u><strong>תצטרך לשנות זאת</strong></u> לחלק של שם המשתמש בכתובת הג'ימייל שלך במקום.
      </span>
    </div>

12. כאשר תתבקש להזין "Password", הדבק מהלוח את הסיסמה שיצרת בשלב 2 למעלה

13. השאר את כפתור הרדיו מסומן עבור "Secured connection using TLS"

14. לחץ על "Add Account" כדי להמשיך

15. פתח לשונית חדשה ב-[Gmail](https://gmail.com) והמתן להגעת מייל האימות שלך (תקבל קוד אימות המאשר שאתה הבעלים של כתובת האימייל שאתה מנסה "Send Mail As")

16. ברגע שהוא מגיע, העתק והדבק את קוד האימות בהנחיה שקיבלת בשלב הקודם

17. לאחר שעשית זאת, חזור למייל ולחץ על הקישור כדי "לאשר את הבקשה". סביר להניח שתצטרך לבצע את שלב זה ואת השלב הקודם כדי שהאימייל יוגדר כראוי.

</div>

### הגדרת ניתוב מתקדם בג'ימייל {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן הערכה להגדרה:</strong>
  <span>15-30 דקות</span>
</div>

אם ברצונך להגדיר ניתוב מתקדם בג'ימייל כך שכינויים שלא תואמים לתיבת דואר יועברו לשרתים של Forward Email, בצע את השלבים הבאים:

1. היכנס לקונסולת הניהול של גוגל ב-[admin.google.com](https://admin.google.com)
2. עבור אל **Apps → Google Workspace → Gmail → Routing**
3. לחץ על **Add Route** והגדר את ההגדרות הבאות:

**הגדרות נמען יחיד:**

* בחר "Change envelope recipient" והזן את כתובת הג'ימייל הראשית שלך
* סמן "Add X-Gm-Original-To header with original recipient"

**תבניות נמען למעטפה:**

* הוסף תבנית שתתאים לכל תיבות הדואר הלא קיימות (למשל, `.*@yourdomain.com`)

**הגדרות שרת דואר:**

* בחר "Route to host" והזן `mx1.forwardemail.net` כשרת הראשי
* הוסף את `mx2.forwardemail.net` כשרת גיבוי
* הגדר פורט ל-25
* בחר "Require TLS" לאבטחה

4. לחץ על **Save** כדי ליצור את הנתיב

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    תצורה זו תעבוד רק עבור חשבונות Google Workspace עם דומיינים מותאמים אישית, לא עבור חשבונות ג'ימייל רגילים.
  </span>
</div>

### הגדרת ניתוב מתקדם באאוטלוק {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן הערכה להגדרה:</strong>
  <span>15-30 דקות</span>
</div>

למשתמשי Microsoft 365 (לשעבר Office 365) שרוצים להגדיר ניתוב מתקדם כך שכינויים שלא תואמים לתיבת דואר יועברו לשרתים של Forward Email:

1. היכנס למרכז הניהול של Microsoft 365 ב-[admin.microsoft.com](https://admin.microsoft.com)
2. עבור אל **Exchange → Mail flow → Rules**
3. לחץ על **Add a rule** ובחר **Create a new rule**
4. תן שם לכלל שלך (למשל, "Forward non-existent mailboxes to Forward Email")
5. תחת **Apply this rule if**, בחר:
   * "The recipient address matches..."
   * הזן תבנית שתתאים לכל הכתובות בדומיין שלך (למשל, `*@yourdomain.com`)
6. תחת **Do the following**, בחר:
   * "Redirect the message to..."
   * בחר "The following mail server"
   * הזן `mx1.forwardemail.net` ופורט 25
   * הוסף את `mx2.forwardemail.net` כשרת גיבוי
7. תחת **Except if**, בחר:
   * "The recipient is..."
   * הוסף את כל תיבות הדואר הקיימות שלך שאינן אמורות להיות מנותבות
8. הגדר את עדיפות הכלל כדי לוודא שהוא רץ לאחר כללי זרימת דואר אחרים
9. לחץ על **Save** כדי להפעיל את הכלל
## פתרון בעיות {#troubleshooting}

### למה אני לא מקבל את מיילי הבדיקה שלי {#why-am-i-not-receiving-my-test-emails}

אם אתה שולח מייל בדיקה לעצמך, ייתכן שהוא לא יופיע בתיבת הדואר הנכנס שלך כי יש לו את אותו כותרת "Message-ID".

זו בעיה ידועה מאוד, והיא משפיעה גם על שירותים כמו Gmail.  <a href="https://support.google.com/a/answer/1703601">כאן התשובה הרשמית של Gmail לגבי בעיה זו</a>.

אם הבעיות ממשיכות, סביר להניח שמדובר בבעיה בהפצת DNS. תצטרך להמתין קצת יותר ולנסות שוב (או לנסות להגדיר ערך TTL נמוך יותר ברשומות <strong class="notranslate">TXT</strong> שלך).

**עדיין יש בעיות?**  אנא <a href="/help">צור איתנו קשר</a> כדי שנוכל לעזור לחקור את הבעיה ולמצוא פתרון מהיר.

### איך להגדיר את לקוח הדואר האלקטרוני שלי לעבוד עם Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  השירות שלנו עובד עם לקוחות דואר אלקטרוני פופולריים כגון:
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
  שם המשתמש שלך הוא כתובת האימייל של הכינוי שלך והסיסמה היא מ- <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("סיסמה רגילה").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
  <span>אם אתה משתמש ב-Thunderbird, ודא ש-"Connection security" מוגדר ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"Normal password".</span>
</div>

| סוג  |         שם מארח         |         פרוטוקול        |                                            פורטים                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **מועדף**      |                                      `993` ו-`2993`                                        |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **מומלץ**        | `465` ו-`2465` ל-SSL/TLS (מומלץ) או `587`, `2587`, `2525`, ו-`25` ל-STARTTLS               |

### למה המיילים שלי נוחתים בספאם ובזבל ואיך אני יכול לבדוק את מוניטין הדומיין שלי {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
<section> זה מדריך עבורך אם הדואר היוצא שלך משתמש בשרתים שלנו SMTP (למשל `smtp.forwardemail.net`) (או מועבר דרך `mx1.forwardemail.net` או `mx2.forwardemail.net`) והוא מגיע לתיקיית דואר זבל או דואר לא רצוי של הנמענים.

אנו עוקבים באופן שגרתי אחרי [כתובות ה-IP שלנו](#what-are-your-servers-ip-addresses) מול [כל רשימות ה-DNS המוכרות](#how-do-you-handle-your-ip-addresses-becoming-blocked), **לכן סביר להניח שמדובר בבעיה ספציפית למוניטין הדומיין**.

מיילים יכולים להגיע לתיקיות דואר זבל ממספר סיבות:

1. **חוסר אימות**: הגדר רשומות [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), ו-[DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **מוניטין דומיין**: דומיינים חדשים לרוב יש להם מוניטין ניטרלי עד שהם בונים היסטוריית שליחה.

3. **טריגרים בתוכן**: מילים או ביטויים מסוימים יכולים להפעיל מסנני דואר זבל.

4. **דפוסי שליחה**: עליות פתאומיות בנפח המיילים יכולות להיראות חשודות.

אתה יכול לנסות להשתמש באחד או יותר מהכלים הבאים כדי לבדוק את מוניטין הדומיין והקטגוריזציה שלו:

#### כלים לבדיקה של מוניטין ורשימות חסימה {#reputation-and-blocklist-check-tools}

| שם הכלי                                   | URL                                                          | סוג                    |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| משוב קטגוריזציה של דומיינים ב-Cloudflare   | <https://radar.cloudflare.com/domains/feedback>              | קטגוריזציה            |
| בודק מוניטין IP ודומיין של Spamhaus         | <https://check.spamhaus.org/>                                | DNSBL                  |
| מרכז מוניטין IP ודומיין של Cisco Talos      | <https://talosintelligence.com/reputation_center>            | מוניטין                |
| חיפוש מוניטין IP ודומיין של Barracuda       | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| בדיקת רשימות שחורות של MX Toolbox          | <https://mxtoolbox.com/blacklists.aspx>                      | רשימה שחורה           |
| כלים לניהול דואר של Google Postmaster       | <https://www.gmail.com/postmaster/>                          | מוניטין                |
| מרכז השולחים של Yahoo                       | <https://senders.yahooinc.com/>                              | מוניטין                |
| בדיקת רשימות שחורות של MultiRBL.valli.org  | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | מוניטין                |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| רמות 1, 2 ו-3 של UCEPROTECT                  | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| backscatterer.org של UCEPROTECT               | <https://www.backscatterer.org/>                             | הגנה מפני backscatter  |
| whitelisted.org של UCEPROTECT                 | <https://www.whitelisted.org/> (דורש תשלום)                  | DNSWL                  |

#### טפסי בקשה להסרת IP לפי ספק {#ip-removal-request-forms-by-provider}

אם כתובת ה-IP שלך נחסמה על ידי ספק דואר מסוים, השתמש בטופס ההסרה המתאים או צור קשר לפי הרשימה הבאה:

| ספק                                   | טופס הסרה / יצירת קשר                                                                                     | הערות                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | טופס יצירת קשר לשולחים בכמות גדולה          |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | פורטל הסרת IP של Office 365                   |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | מרכז השולחים של Yahoo                         |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple משתמשת ב-Proofpoint למוניטין IP         |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | בדיקת IP והסרה ב-Proofpoint                   |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | חיפוש מוניטין והסרה ב-Barracuda               |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | בקשת איפוס Cloudmark CSI                      |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | טופס בקשה להסרת חסימה GoDaddy                 |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | בקשת הסרת IP Comcast                          |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | פנה לתמיכת Spectrum להסרה                      |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | דואר אלקטרוני לבקשת הסרה                      |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | דואר אלקטרוני לבקשת הסרה                      |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | משתמש ב-Cloudfilter                           |
| Windstream                             | `abuse@windstream.net`                                                                                     | דואר אלקטרוני לבקשת הסרה                      |
| t-online.de (גרמניה)                  | `tobr@rx.t-online.de`                                                                                      | דואר אלקטרוני לבקשת הסרה                      |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | השתמש בטופס יצירת קשר או במייל `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | טופס יצירת קשר של GMX                         |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | פורטל מנהל דואר Mail.ru                        |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | פורטל מנהל דואר Yandex                         |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | בקשת הוספה לרשימת לבנה של QQ Mail (סינית)    |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | פורטל מנהל דואר Netease                        |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | יצירת קשר דרך קונסולת Alibaba Cloud           |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | קונסולת AWS SES > הסרת מרשימות שחורות         |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | יצירת קשר עם תמיכת SendGrid                   |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | משתמש ברשימות שחורות צד שלישי - פנה ל-RBL הספציפי |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | יצירת קשר עם תמיכת Fastmail                   |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | יצירת קשר עם תמיכת Zoho                       |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | יצירת קשר עם תמיכת Proton                      |
| Tutanota                               | <https://tutanota.com/support>                                                                             | יצירת קשר עם תמיכת Tutanota                    |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | יצירת קשר עם תמיכת Hushmail                    |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | יצירת קשר עם תמיכת Mailbox.org                 |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | יצירת קשר עם תמיכת Posteo                      |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | יצירת קשר עם תמיכת DuckDuckGo                  |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | יצירת קשר עם תמיכת Sonic                       |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | יצירת קשר עם תמיכת Telus                       |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | יצירת קשר עם תמיכת Vodafone                    |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | יצירת קשר עם תמיכת Spark NZ                    |
| UOL/BOL (ברזיל)                       | <https://ajuda.uol.com.br/>                                                                                | יצירת קשר עם תמיכת UOL (פורטוגזית)             |
| Libero (איטליה)                       | <https://aiuto.libero.it/>                                                                                 | יצירת קשר עם תמיכת Libero (איטלקית)            |
| Telenet (בלגיה)                      | <https://www2.telenet.be/en/support/>                                                                      | יצירת קשר עם תמיכת Telenet                     |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | יצירת קשר עם תמיכת עסקים של Facebook           |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | יצירת קשר עם תמיכת LinkedIn                    |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | יצירת קשר עם תמיכת Groups.io                   |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | כלי שולחים של Vade Secure                      |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | יצירת קשר עם תמיכת Cloudflare                  |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | יצירת קשר עם תמיכת Hornetsecurity              |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | יצירת קשר דרך ספק האירוח                        |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | יצירת קשר עם תמיכת Mail2World                   |
> \[!TIP]
> התחל עם נפח נמוך של אימיילים איכותיים כדי לבנות מוניטין חיובי לפני שליחה בנפחים גדולים יותר.

> \[!IMPORTANT]
> אם הדומיין שלך נמצא ברשימה שחורה, לכל רשימה שחורה יש תהליך הסרה משלה. בדוק את האתרים שלהם להוראות.

> \[!TIP]
> אם אתה זקוק לעזרה נוספת או מגלה שאנו מסומנים בטעות כספאם על ידי ספק שירות אימייל מסוים, אנא <a href="/help">צור קשר איתנו</a>.

### מה עלי לעשות אם אני מקבל אימיילים ספאם {#what-should-i-do-if-i-receive-spam-emails}

עליך להסיר את עצמך מרשימת התפוצה (אם אפשרי) ולחסום את השולח.

אנא אל תדווח על ההודעה כספאם, אלא העבר אותה למערכת מניעת ההתעללות המנוהלת ידנית וממוקדת פרטיות שלנו.

**כתובת האימייל שאליה יש להעביר ספאם היא:** <abuse@forwardemail.net>

### מדוע אימיילי הבדיקה שאני שולח לעצמי בג'ימייל מופיעים כ"חשודים" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

אם אתה רואה הודעת שגיאה זו בג'ימייל כשאתה שולח בדיקה לעצמך, או כאשר אדם שאתה שולח לו אימייל עם הכינוי שלך רואה אימייל ממך בפעם הראשונה, אז **אנא אל תדאג** – זו תכונת בטיחות מובנית של ג'ימייל.

אתה יכול פשוט ללחוץ על "נראה בטוח". לדוגמה, אם תשלח הודעת בדיקה באמצעות תכונת שליחת אימייל בשם (למישהו אחר), הם לא יראו הודעה זו.

עם זאת, אם הם כן רואים הודעה זו, זה בגלל שהם רגילים לראות את האימיילים שלך מגיעים מ-<john@gmail.com> במקום מ-<john@customdomain.com> (רק דוגמה). ג'ימייל יזהיר את המשתמשים כדי לוודא שהכל בטוח למקרה הצורך, ואין דרך לעקוף זאת.

### האם ניתן להסיר את via forwardemail dot net בג'ימייל {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

נושא זה קשור ל[בעיה ידועה בג'ימייל שבה מופיעה מידע נוסף ליד שם השולח](https://support.google.com/mail/answer/1311182).

מאז מאי 2023 אנו תומכים בשליחת אימייל עם SMTP כתוספת לכל המשתמשים בתשלום – מה שאומר שניתן להסיר את <span class="notranslate">via forwardemail dot net</span> בג'ימייל.

שים לב שנושא זה מיועד במיוחד למשתמשים בתכונת [כיצד לשלוח אימייל בשם באמצעות ג'ימייל](#how-to-send-mail-as-using-gmail).

אנא עיין בסעיף על [האם אתם תומכים בשליחת אימייל עם SMTP](#do-you-support-sending-email-with-smtp) להוראות הגדרה.


## ניהול נתונים {#data-management}

### היכן ממוקמים השרתים שלכם {#where-are-your-servers-located}

> \[!TIP]
> אנו עשויים בקרוב להודיע על מיקום מרכז הנתונים שלנו באיחוד האירופי המופעל תחת [forwardemail.eu](https://forwardemail.eu). הירשם לדיון בכתובת <https://github.com/orgs/forwardemail/discussions/336> לקבלת עדכונים.

השרתים שלנו ממוקמים בעיקר בדנבר, קולורדו – ראה <https://forwardemail.net/ips> לרשימת כתובות ה-IP המלאה שלנו.

תוכל ללמוד על מעבדי המשנה שלנו בדפי [GDPR](/gdpr), [DPA](/dpa), ו-[פרטיות](/privacy).

### כיצד לייצא ולגבות את תיבת הדואר שלי {#how-do-i-export-and-backup-my-mailbox}

בכל עת תוכל לייצא את תיבות הדואר שלך בפורמטים של [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), או [SQLite](https://en.wikipedia.org/wiki/SQLite) מוצפנים.

גש ל-<a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים <i class="fa fa-angle-right"></i> הורדת גיבוי ובחר את סוג פורמט הייצוא המועדף עליך.

תקבל במייל קישור להורדת הייצוא לאחר סיום התהליך.

שים לב שקישור ההורדה של הייצוא פג תוקף לאחר 4 שעות מטעמי אבטחה.

אם אתה צריך לבדוק את פורמטי ה-EML או Mbox שייצאת, כלים בקוד פתוח אלו עשויים להיות שימושיים:

| שם              | פורמט | פלטפורמה     | כתובת GitHub                                        |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | כל הפלטפורמות | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | כל הפלטפורמות | <https://github.com/s0ph1e/eml-reader>              |
בנוסף, אם אתה צריך להמיר קובץ Mbox לקובץ EML, תוכל להשתמש ב-<https://github.com/noelmartinon/mboxzilla>.

### איך אני מייבא ומעביר את תיבת הדואר הקיימת שלי {#how-do-i-import-and-migrate-my-existing-mailbox}

אתה יכול בקלות לייבא את הדואר האלקטרוני שלך ל-Forward Email (למשל באמצעות [Thunderbird](https://www.thunderbird.net)) עם ההוראות למטה:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    עליך לעקוב אחרי כל השלבים הבאים כדי לייבא את הדואר האלקטרוני הקיים שלך.
  </span>
</div>

1. ייצא את הדואר האלקטרוני שלך מספק הדואר הקיים שלך:

   | ספק דואר אלקטרוני | פורמט ייצוא                                  | הוראות ייצוא                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">טיפ:</strong> <span>אם אתה משתמש ב-Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">פורמט ייצוא PST</a>), תוכל פשוט לעקוב אחרי ההוראות תחת "אחר" למטה. עם זאת, סיפקנו קישורים להמרת PST לפורמט MBOX/EML בהתבסס על מערכת ההפעלה שלך:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba עבור Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst עבור Windows cygwin</a> – (למשל <code>readpst -u -o $OUT_DIR $IN_DIR</code> כאשר מחליפים את <code>$OUT_DIR</code> ו-<code>$IN_DIR</code> בנתיבי תיקיית הפלט ותיקיית הקלט בהתאמה).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst עבור Ubuntu/Linux</a> – (למשל <code>sudo apt-get install readpst</code> ואז <code>readpst -u -o $OUT_DIR $IN_DIR</code>, כאשר מחליפים את <code>$OUT_DIR</code> ו-<code>$IN_DIR</code> בנתיבי תיקיית הפלט ותיקיית הקלט בהתאמה).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst עבור macOS (דרך brew)</a> – (למשל <code>brew install libpst</code> ואז <code>readpst -u -o $OUT_DIR $IN_DIR</code>, כאשר מחליפים את <code>$OUT_DIR</code> ו-<code>$IN_DIR</code> בנתיבי תיקיית הפלט ותיקיית הקלט בהתאמה).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter עבור Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | אחר           | [השתמש ב-Thunderbird](https://www.thunderbird.net) | הגדר את חשבון הדואר הקיים שלך ב-Thunderbird ואז השתמש בתוסף [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) כדי לייצא ולייבא את הדואר האלקטרוני שלך.  **ייתכן שתוכל גם פשוט להעתיק/להדביק או לגרור/לשחרר מיילים בין חשבון אחד לאחר.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. הורד, התקן ופתח את [Thunderbird](https://www.thunderbird.net).

3. צור חשבון חדש באמצעות כתובת האימייל המלאה של הכינוי שלך (למשל <code><you@yourdomain.com></code>) והסיסמה שנוצרה עבורך.  <strong>אם עדיין אין לך סיסמה שנוצרה, אז <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">עיין בהוראות ההגדרה שלנו</a></strong>.

4. הורד והתקן את תוסף [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) ל-Thunderbird.

5. צור תיקייה מקומית חדשה ב-Thunderbird, ואז לחץ עליה עם הכפתור הימני → בחר באפשרות `ImportExportTools NG` → בחר `Import mbox file` (לפורמט ייצוא MBOX) – או – `Import messages` / `Import all messages from a directory` (לפורמט ייצוא EML).

6. גרור/שחרר מהתיקייה המקומית לתיקיית IMAP חדשה (או קיימת) ב-Thunderbird שאליה ברצונך להעלות הודעות לאחסון IMAP עם השירות שלנו.  זה יבטיח שהן מגובות אונליין עם אחסון מוצפן SQLite שלנו.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>
       אם אינך בטוח כיצד לייבא ל-Thunderbird, תוכל לעיין בהוראות הרשמיות בכתובת <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> ו- <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    לאחר שסיימת את תהליך הייצוא והייבוא, ייתכן שתרצה גם להפעיל העברה אוטומטית בחשבון האימייל הקיים שלך ולהגדיר תגובה אוטומטית להודיע לשולחים שיש לך כתובת אימייל חדשה (למשל אם השתמשת בעבר ב-Gmail וכעת אתה משתמש באימייל עם שם הדומיין המותאם שלך).
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

### איך להשתמש באחסון תואם S3 משל עצמי לגיבויים {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

משתמשים בתוכנית בתשלום יכולים להגדיר ספק אחסון תואם [S3](https://en.wikipedia.org/wiki/Amazon_S3) משלהם על בסיס דומיין עבור גיבויים ב-IMAP/SQLite.  משמעות הדבר היא שגיבויי תיבת הדואר המוצפנים שלך יכולים להישמר בתשתית שלך במקום (או בנוסף ל) האחסון המוגדר כברירת מחדל שלנו.

הספקים הנתמכים כוללים את [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces), וכל שירות תואם S3 אחר.

#### הגדרה {#setup}

1. צור דלי **פרטי** עם ספק אחסון תואם S3 שלך. הדלי חייב לא להיות נגיש לציבור.
2. צור אישורי גישה (מזהה מפתח גישה ומפתח גישה סודי) עם הרשאות קריאה/כתיבה לדלי.
3. עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות מתקדמות <i class="fa fa-angle-right"></i> אחסון תואם S3 מותאם אישית.
4. סמן **"הפעל אחסון תואם S3 מותאם אישית"** ומלא את כתובת ה-URL של נקודת הקצה, מזהה מפתח הגישה, מפתח הגישה הסודי, האזור ושם הדלי.
5. לחץ על **"בדוק חיבור"** כדי לאמת את האישורים שלך, גישת הדלי והרשאות הכתיבה.
6. לחץ על **"שמור"** כדי להחיל את ההגדרות.

#### איך הגיבויים עובדים {#how-backups-work}

גיבויים מופעלים אוטומטית עבור כל כינוי IMAP מחובר. שרת ה-IMAP בודק את כל החיבורים הפעילים פעם בשעה ושולח גיבוי עבור כל כינוי מחובר. נעילת Redis מונעת הפעלת גיבויים כפולים בתוך 30 דקות זה מזה, והגיבוי בפועל מדולג אם גיבוי מוצלח כבר הושלם בתוך 24 השעות האחרונות (אלא אם כן הגיבוי נדרש במפורש על ידי משתמש להורדה).
גיבויים יכולים גם להיות מופעלים ידנית על ידי לחיצה על **"Download Backup"** עבור כל כינוי בלוח הבקרה. גיבויים ידניים תמיד מתבצעים ללא קשר לחלון הזמן של 24 השעות.

תהליך הגיבוי פועל כך:

1. מסד הנתונים SQLite מועתק באמצעות `VACUUM INTO`, שיוצר צילום מצב עקבי ללא הפרעה לחיבורים פעילים ושומר על הצפנת מסד הנתונים.
2. קובץ הגיבוי מאומת על ידי פתיחתו לאישור שההצפנה עדיין תקפה.
3. מחושב ערך SHA-256 ומשווה אותו לגיבוי הקיים באחסון. אם הערך תואם, ההעלאה מדולגת (אין שינויים מאז הגיבוי האחרון).
4. הגיבוי מועלה ל-S3 באמצעות העלאה מרובת חלקים דרך הספרייה [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. נוצר URL חתום להורדה (בתוקף ל-4 שעות) ונשלח בדוא"ל למשתמש.

#### פורמטי גיבוי {#backup-formats}

נתמכים שלושה פורמטים של גיבוי:

| פורמט    | סיומת     | תיאור                                                                       |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | צילום מצב של מסד נתונים SQLite מוצפן גולמי (ברירת מחדל לגיבויים אוטומטיים של IMAP) |
| `mbox`   | `.zip`    | קובץ ZIP מוגן בסיסמה המכיל תיבת דואר בפורמט mbox                            |
| `eml`    | `.zip`    | קובץ ZIP מוגן בסיסמה המכיל קבצי `.eml` נפרדים לכל הודעה                     |

> **טיפ:** אם יש לך קבצי גיבוי `.sqlite` ואתה רוצה להמיר אותם לקבצי `.eml` באופן מקומי, השתמש בכלי ה-CLI העצמאי שלנו **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. הוא עובד על Windows, Linux ו-macOS ואינו דורש חיבור לרשת.

#### שמות קבצים ומבנה מפתחות {#file-naming-and-key-structure}

בעת שימוש ב**אחסון S3 מותאם אישית**, קבצי הגיבוי נשמרים עם קידומת תאריך-זמן בפורמט [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) כך שכל גיבוי נשמר כאובייקט נפרד. זה נותן לך היסטוריית גיבויים מלאה בדלי שלך.

מבנה המפתח הוא:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

לדוגמה:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` הוא ה-ObjectId של הכינוי ב-MongoDB. ניתן למצוא אותו בדף הגדרות הכינוי או דרך ה-API.

בעת שימוש ב**אחסון ברירת המחדל (מערכתי)**, המפתח הוא שטוח (למשל `65a31c53c36b75ed685f3fda.sqlite`) וכל גיבוי מחליף את הקודם.

> **הערה:** מאחר שאחסון S3 מותאם אישית שומר את כל גרסאות הגיבוי, השימוש באחסון יגדל עם הזמן. אנו ממליצים להגדיר [כללי מחזור חיים](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) בדלי שלך כדי לפקוע אוטומטית גיבויים ישנים (למשל למחוק אובייקטים שגילם מעל 30 או 90 יום).

#### בעלות על נתונים ומדיניות מחיקה {#data-ownership-and-deletion-policy}

הדלי המותאם אישית שלך ב-S3 נמצא בשליטתך המלאה. אנו **אף פעם לא מוחקים או משנים** קבצים בדלי המותאם אישית שלך — לא כאשר כינוי נמחק, לא כאשר דומיין מוסר, ולא במהלך פעולות ניקוי. אנו רק כותבים קבצי גיבוי חדשים לדלי שלך.

משמעות הדבר:

* **מחיקת כינוי** — כאשר אתה מוחק כינוי, אנו מסירים את הגיבוי רק מאחסון ברירת המחדל שלנו. כל הגיבויים שנכתבו בעבר לדלי המותאם אישית שלך נשארים ללא שינוי.
* **הסרת דומיין** — הסרת דומיין אינה משפיעה על קבצים בדלי המותאם אישית שלך.
* **ניהול שמירה** — אתה אחראי על ניהול האחסון בדלי שלך, כולל הגדרת כללי מחזור חיים לפקיעת גיבויים ישנים.

אם תבטל את אחסון S3 המותאם אישית או תחזור לאחסון ברירת המחדל שלנו, הקבצים הקיימים בדלי שלך יישמרו. גיבויים עתידיים פשוט ייכתבו לאחסון ברירת המחדל שלנו.

#### אבטחה {#security}

* מזהה מפתח הגישה וסיסמת הגישה שלך **מוצפנים במנוחה** באמצעות [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) לפני שמירתם במסד הנתונים שלנו. הם מפוענחים רק בזמן ריצה בעת ביצוע פעולות גיבוי.
* אנו מאמתים אוטומטית שהדלי שלך **אינו נגיש לציבור**. אם מתגלה דלי ציבורי, התצורה תידחה בעת השמירה. אם נגישות ציבורית מתגלה בזמן הגיבוי, אנו חוזרים לאחסון ברירת המחדל ומודיעים לכל מנהלי הדומיין בדוא"ל.
* האישורים מאומתים בעת השמירה באמצעות קריאת [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) כדי לוודא שהדלי קיים והאישורים נכונים. אם האימות נכשל, אחסון S3 מותאם אישית מבוטל אוטומטית.
* כל קובץ גיבוי כולל ערך SHA-256 במטא-דאטה של S3, המשמש לזיהוי מסדי נתונים ללא שינוי ולהימנעות מהעלאות מיותרות.
#### הודעות שגיאה {#error-notifications}

אם גיבוי נכשל בעת שימוש באחסון S3 מותאם אישית שלך (למשל עקב אישורים שפג תוקפם או בעיית חיבור), כל מנהלי הדומיין יקבלו הודעת דואר אלקטרוני. הודעות אלו מוגבלות בקצב של פעם כל 6 שעות כדי למנוע התראות כפולות. אם הדלי שלך מזוהה כנגיש לציבור בזמן הגיבוי, המנהלים יקבלו הודעה פעם ביום.

#### API {#api}

ניתן גם להגדיר אחסון S3 מותאם אישית דרך ה-API:

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

כדי לבדוק את החיבור דרך ה-API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### איך להמיר גיבויי SQLite לקבצי EML {#how-do-i-convert-sqlite-backups-to-eml-files}

אם הורדת או שמרת גיבויי SQLite (או מהאחסון המוגדר כברירת מחדל שלנו או מה-[דלי S3 מותאם אישית שלך](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), תוכל להמיר אותם לקבצי `.eml` סטנדרטיים באמצעות כלי ה-CLI העצמאי שלנו **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. קבצי EML ניתנים לפתיחה עם כל לקוח דואר אלקטרוני ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) וכו') או לייבוא לשרתים אחרים.

#### התקנה {#installation-1}

ניתן להוריד בינארי מוכן מראש (ללא צורך ב-[Node.js](https://github.com/nodejs/node)) או להריץ ישירות עם [Node.js](https://github.com/nodejs/node):

**בינאריים מוכנים מראש** — הורד את הגרסה העדכנית ביותר לפלטפורמה שלך מ-[GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| פלטפורמה | ארכיטקטורה  | קובץ                                 |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **משתמשי macOS:** לאחר ההורדה, ייתכן שתצטרכו להסיר את תכונת הסגר לפני הרצת הבינארי:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (החלף את `./convert-sqlite-to-eml-darwin-arm64` בנתיב האמיתי של הקובץ שהורדת.)

> **משתמשי Linux:** לאחר ההורדה, ייתכן שתצטרכו להפוך את הבינארי להרצה:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (החלף את `./convert-sqlite-to-eml-linux-x64` בנתיב האמיתי של הקובץ שהורדת.)

**מהמקור** (דורש [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### שימוש {#usage}

הכלי תומך במצב אינטראקטיבי ובמצב לא אינטראקטיבי.

**מצב אינטראקטיבי** — הרץ ללא ארגומנטים ותתבקש להזין את כל הקלטים:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - המרת גיבוי SQLite ל-EML
  ========================================

  נתיב לקובץ גיבוי SQLite: /path/to/backup.sqlite
  סיסמת IMAP/כינוי: ********
  נתיב ZIP פלט [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**מצב לא אינטראקטיבי** — העבר ארגומנטים דרך דגלי שורת הפקודה לסקריפטים ואוטומציה:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| דגל                | תיאור                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | נתיב לקובץ גיבוי SQLite מוצפן                                                   |
| `--password <pass>` | סיסמת IMAP/כינוי לפענוח                                                        |
| `--output <path>`   | נתיב פלט לקובץ ZIP (ברירת מחדל: נוצר אוטומטית עם חותמת זמן ISO 8601)          |
| `--help`            | הצג הודעת עזרה                                                                |
#### פורמט הפלט {#output-format}

הכלי מייצר ארכיון ZIP מוגן בסיסמה (מוצפן AES-256) המכיל:

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

קבצי EML מאורגנים לפי תיקיית תיבת הדואר. סיסמת ה-ZIP זהה לסיסמת ה-IMAP/כינוי שלך. כל קובץ `.eml` הוא הודעת דואר אלקטרוני סטנדרטית לפי [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) עם כותרות מלאות, טקסט גוף וקבצים מצורפים שהורכבו מחדש מבסיס הנתונים SQLite.

#### איך זה עובד {#how-it-works}

1. פותח את בסיס הנתונים SQLite המוצפן באמצעות סיסמת ה-IMAP/כינוי שלך (תומך גם ב[ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) וגם ב[AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. קורא את טבלת Mailboxes כדי לגלות את מבנה התיקיות.
3. עבור כל הודעה, מפענח את ה-mimeTree (שמור כ-JSON דחוס ב[Brotli](https://github.com/google/brotli)) מטבלת Messages.
4. מרכיב מחדש את קובץ ה-EML המלא על ידי הליכה בעץ MIME ושליפת גופי הקבצים המצורפים מטבלת Attachments.
5. אורז את הכל לארכיון ZIP מוגן בסיסמה באמצעות [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### האם אתם תומכים באירוח עצמי {#do-you-support-self-hosting}

כן, החל ממרץ 2025, אנו תומכים באפשרות אירוח עצמי. קרא את הבלוג [כאן](https://forwardemail.net/blog/docs/self-hosted-solution). עיין במדריך [אירוח עצמי](https://forwardemail.net/self-hosted) כדי להתחיל. ולמי שמעוניין בגרסה מפורטת יותר שלב אחר שלב ראה את המדריכים שלנו ל[אובונטו](https://forwardemail.net/guides/selfhosted-on-ubuntu) או [דביאן](https://forwardemail.net/guides/selfhosted-on-debian).


## הגדרת דואר אלקטרוני {#email-configuration}

### איך מתחילים ומגדירים העברת דואר אלקטרוני {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">זמן הערכה להגדרה:</strong>
  <span>פחות מ-10 דקות</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    התחלה:
  </strong>
  <span>
    קרא בעיון ופעל לפי השלבים מאחד עד שמונה המפורטים למטה. ודא להחליף את כתובת הדואר <code>user@gmail.com</code> בכתובת שאליה ברצונך להעביר דואר (אם היא לא מדויקת כבר). באופן דומה, ודא להחליף את <code>example.com</code> בשם הדומיין המותאם שלך (אם הוא לא מדויק כבר).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">אם כבר רשמת את שם הדומיין שלך במקום כלשהו, עליך לדלג לחלוטין על שלב זה ולעבור לשלב שני! אחרת תוכל <a href="/domain-registration" rel="noopener noreferrer">להקליק כאן כדי לרשום את שם הדומיין שלך</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  האם אתה זוכר איפה רשמת את הדומיין שלך? ברגע שתזכור זאת, פעל לפי ההוראות למטה:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    עליך לפתוח לשונית חדשה ולהתחבר לרשם הדומיין שלך. תוכל בקלות להקליק על "Registrar" למטה כדי לעשות זאת אוטומטית. בלשונית החדשה הזו, עליך לנווט לעמוד ניהול ה-DNS ברשם שלך – וסיפקנו את שלבי הניווט שלב אחר שלב בעמודת "Steps to Configure". לאחר שנכנסת לעמוד זה בלשונית החדשה, תוכל לחזור ללשונית זו ולהמשיך לשלב שלוש למטה.
    <strong class="font-weight-bold">אל תסגור את הלשונית שנפתחה עדיין; תזדקק לה בשלבים הבאים!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>רשם</th>
      <th>שלבים להגדרה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> מרכז דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> ערוך הגדרות DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> השרתים שלי <i class="fa fa-angle-right"></i> ניהול דומיין <i class="fa fa-angle-right"></i> מנהל DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ל-ROCK: התחבר <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> (הקליק על סמל ▼ ליד ניהול) <i class="fa fa-angle-right"></i> DNS
      <br />
      ל-LEGACY: התחבר <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> עורך אזור <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> ניהול</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> רשת <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> עוד <i class="fa fa-angle-right"></i> ניהול דומיין</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> במצב כרטיס, לחץ נהל על הדומיין שלך <i class="fa fa-angle-right"></i> במצב רשימה, לחץ על סמל ההגדרות <i class="fa fa-angle-right"></i> DNS &amp; Nameservers <i class="fa fa-angle-right"></i> רשומות DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> צפה</a>
      </td>
      <td>התחבר <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> נהל <i class="fa fa-angle-right"></i> (הקליק על סמל ההגדרות) <i class="fa fa-angle-right"></i> לחץ על DNS &amp; Nameservers בתפריט השמאלי</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> לוח בקרה <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> נהל דומיינים <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> סקירה כללית <i class="fa fa-angle-right"></i> נהל <i class="fa fa-angle-right"></i> עורך פשוט <i class="fa fa-angle-right"></i> רשומות</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> ניהול <i class="fa fa-angle-right"></i> ערוך את האזור</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> צפה</a>
      </td>
      <td>התחבר <i class="fa fa-angle-right"></i> נהל את הדומיינים שלי <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> נהל DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> צפה</a>
      </td>
      <td>התחבר <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> הגדר DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> צפה</a>
      </td>
      <td>התחבר <i class="fa fa-angle-right"></i> רשימת דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> נהל <i class="fa fa-angle-right"></i> DNS מתקדם</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> הגדר DNS של Netlify</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> מנהל חשבון <i class="fa fa-angle-right"></i> שמות הדומיינים שלי <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> נהל <i class="fa fa-angle-right"></i> שנה לאן הדומיין מפנה <i class="fa fa-angle-right"></i> DNS מתקדם</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> צפה</a>
      </td>
      <td>התחבר <i class="fa fa-angle-right"></i> דומיינים מנוהלים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> הגדרות DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> תפריט הבית <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i>
הגדרות מתקדמות <i class="fa fa-angle-right"></i> רשומות מותאמות</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>שימוש ב-CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> עמוד דומיינים <i class="fa fa-angle-right"></i> (בחר את הדומיין שלך) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> עמוד דומיינים <i class="fa fa-angle-right"></i> (הקליק על סמל <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> בחר נהל רשומות DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>התחבר <i class="fa fa-angle-right"></i> דומיינים <i class="fa fa-angle-right"></i> הדומיינים שלי</td>
    </tr>
    <tr>
      <td>אחר</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">חשוב:</strong> לא רואה את שם הרשם שלך ברשימה כאן? פשוט חפש באינטרנט "איך לשנות רשומות DNS ב-$REGISTRAR" (החלף את $REGISTRAR בשם הרשם שלך – לדוגמה "איך לשנות רשומות DNS ב-GoDaddy" אם אתה משתמש ב-GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">באמצעות עמוד ניהול ה-DNS של הרשם שלך (הלשונית השנייה שפתחת), הגדר את רשומות "MX" הבאות:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    שים לב שלא צריכים להיות רשומות MX אחרות מוגדרות. שתי הרשומות המוצגות למטה חייבות להתקיים. ודא שאין טעויות כתיב; ושיש לך את mx1 ו-mx2 מאויתות נכון. אם כבר היו רשומות MX קיימות, אנא מחק אותן לחלוטין.
    ערך ה-"TTL" לא חייב להיות 3600, הוא יכול להיות ערך נמוך או גבוה יותר במידת הצורך.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>עדיפות</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">באמצעות דף ניהול ה-DNS של הרשם שלך (הלשונית השנייה שפתחת), הגדר את רשומת/רשומות <strong class="notranslate">TXT</strong> הבאות:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה בתכנית בתשלום, עליך לדלג לחלוטין על שלב זה ולעבור לשלב חמישי! אם אינך בתכנית בתשלום, כתובות הדואר המועברות שלך יהיו ניתנות לחיפוש פומבי – עבור אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> ושדרג את הדומיין שלך לתכנית בתשלום אם תרצה. אם ברצונך ללמוד עוד על תכניות בתשלום ראה את דף ה<a rel="noopener noreferrer" href="/private-business-email" class="alert-link">תמחור</a> שלנו. אחרת תוכל להמשיך לבחור אחד או יותר שילובים מהאפשרות א' ועד אפשרות ו' המפורטות למטה.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    אפשרות א':
  </strong>
  <span>
    אם אתה מעביר את כל המיילים מהדומיין שלך, (למשל "all@example.com", "hello@example.com", וכו') לכתובת ספציפית "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    טיפ:
  </strong>
  <span>
    ודא להחליף את הערכים למעלה בעמודת "ערך" עם כתובת הדוא"ל שלך. ערך ה-"TTL" לא חייב להיות 3600, הוא יכול להיות ערך נמוך או גבוה יותר במידת הצורך. ערך TTL נמוך יותר יבטיח שכל שינוי עתידי שתעשה ברשומות ה-DNS שלך יתפשט מהר יותר ברחבי האינטרנט – חשוב על זה כמה זמן זה יישמר בזיכרון המטמון (בשניות). תוכל ללמוד עוד על <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL בוויקיפדיה</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    אפשרות ב':
  </strong>
  <span>
    אם אתה רק צריך להעביר כתובת דוא"ל אחת (למשל <code>hello@example.com</code> ל-<code>user@gmail.com</code>; זה גם יעביר אוטומטית "hello+test@example.com" ל-"user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    אפשרות ג:
  </strong>
  <span>
    אם אתם מפנים מספר מיילים, תרצו להפריד ביניהם באמצעות פסיק:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    אפשרות ד:
  </strong>
  <span>
    ניתן להגדיר כמות אינסופית של מיילים להפניה – רק וודאו שלא לעבור 255 תווים בשורה אחת ושהשורה מתחילה תמיד ב-"forward-email=". דוגמה מוצגת למטה:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    אפשרות ה:
  </strong>
  <span>
    ניתן גם לציין שם דומיין ברשומת <strong class="notranslate">TXT</strong> כדי להגדיר הפניה גלובלית של כינויים (למשל "user@example.com" יופנה ל-"user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    אפשרות ו:
  </strong>
  <span>
    ניתן אפילו להשתמש ב-webhooks ככינוי גלובלי או אישי להפניית מיילים. ראו את הדוגמה ואת הסעיף המלא על webhooks שכותרתו <a href="#do-you-support-webhooks" class="alert-link">האם אתם תומכים ב-webhooks</a> למטה.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    אפשרות G:
  </strong>
  <span>
    ניתן אפילו להשתמש בביטויים רגולריים ("regex") להתאמת כינויים ולטיפול בהחלפות להפניית מיילים. ראה את הדוגמאות והקטע המלא על regex שכותרתו <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">האם אתם תומכים בביטויים רגולריים או regex</a> למטה.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>צריך regex מתקדם עם החלפה?</strong> ראה את הדוגמאות והקטע המלא על regex שכותרתו <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">האם אתם תומכים בביטויים רגולריים או regex</a> למטה.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה פשוטה:</strong> אם אני רוצה שכל המיילים שנשלחים ל-`linus@example.com` או ל-`torvalds@example.com` יופנו ל-`user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
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
    חשוב:
  </strong>
  <span>
    חוקי הפניית catch-all יכולים להיקרא גם "מעבר-דרך".
    משמעות הדבר היא שמיילים נכנסים שתואמים לפחות חוק הפניית ספציפי אחד ישמשו במקום ה-catch-all.
    חוקים ספציפיים כוללים כתובות מייל וביטויים רגולריים.
    <br /><br />
    לדוגמה:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    מיילים שנשלחים ל-<code>hello@example.com</code> **לא** יופנו ל-<code>second@gmail.com</code> (catch-all) עם תצורה זו, ובמקום זאת יגיעו רק ל-<code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">באמצעות דף ניהול ה-DNS של הרשם שלך (הלשונית השנייה שפתחת), הגדר בנוסף את רשומת <strong class="notranslate">TXT</strong> הבאה:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה משתמש ב-Gmail (למשל שלח מייל בשם) או ב-G Suite, תצטרך להוסיף <code>include:_spf.google.com</code> לערך שלמעלה, לדוגמה:
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
    אם כבר יש לך שורה דומה עם "v=spf1", תצטרך להוסיף <code>include:spf.forwardemail.net</code> ממש לפני כל רשומת "include:host.com" קיימת ולפני ה-" -all" באותה שורה, לדוגמה:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    שים לב שיש הבדל בין "-all" ל-"~all". ה-"-" מציין שבדיקת SPF תיכשל אם לא תתאים, וה-"~" מציין שבדיקת SPF תיכשל ברכות. אנו ממליצים להשתמש בגישה של "-all" כדי למנוע זיוף דומיין.
    <br /><br />
    ייתכן שתצטרך גם לכלול את רשומת SPF של המארח ממנו אתה שולח מייל (למשל Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">אמת את רשומות ה-DNS שלך באמצעות כלי "Verify Records" הזמין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות.

</li><li class="mb-2 mb-md-3 mb-lg-5">שלח דואר אלקטרוני ניסיוני כדי לוודא שזה עובד. שים לב שייתכן שייקח זמן עד שרשומות ה-DNS שלך יתפשטו.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
  <span>
  </span>
    אם אינך מקבל מיילים ניסיוניים, או מקבל מייל ניסיוני שאומר "היזהר עם ההודעה הזו", עיין בתשובות עבור <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">מדוע אינני מקבל את המיילים הניסיוניים שלי</a> ו- <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">מדוע המיילים הניסיוניים שנשלחים אליי בג'ימייל מוצגים כ"חשודים"</a> בהתאמה.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">אם ברצונך "לשלוח דואר בשם" מג'ימייל, תצטרך <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">לצפות בסרטון זה</a></strong>, או לעקוב אחר השלבים תחת <a href="#how-to-send-mail-as-using-gmail">כיצד לשלוח דואר בשם באמצעות ג'ימייל</a> למטה.

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
    תוספות אופציונליות מפורטות למטה. שים לב שהתוספות הללו הן אופציונליות לחלוטין ואינן בהכרח נחוצות. רצינו לפחות לספק לך מידע נוסף אם יש צורך.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    תוספת אופציונלית:
  </strong>
  <span>
    אם אתה משתמש בתכונה <a class="alert-link" href="#how-to-send-mail-as-using-gmail">כיצד לשלוח דואר בשם באמצעות ג'ימייל</a>, ייתכן שתרצה להוסיף את עצמך לרשימת אישור. ראה <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">הוראות אלו מג'ימייל</a> בנושא זה.
  </span>
</div>

### האם ניתן להשתמש בכמה שרתי MX והחלפות עבור העברה מתקדמת {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

כן, אך **עליך לרשום רק שרת MX אחד ברשומות ה-DNS שלך**.

אל תנסה להשתמש ב"עדיפות" כאמצעי להגדיר כמה שרתי MX.

במקום זאת, עליך להגדיר את שרת ה-MX הקיים שלך להעביר דואר עבור כל כינויים שאינם תואמים לשרתים של השירות שלנו (`mx1.forwardemail.net` ו/או `mx2.forwardemail.net`).

אם אתה משתמש ב-Google Workspace ואתה רוצה להעביר את כל הכינויים שאינם תואמים לשירות שלנו, ראה <https://support.google.com/a/answer/6297084>.

אם אתה משתמש ב-Microsoft 365 (Outlook) ואתה רוצה להעביר את כל הכינויים שאינם תואמים לשירות שלנו, ראה <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> ו- <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### כיצד להגדיר משיב חופשה (משיב אוטומטי מחוץ למשרד) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

גש ל- <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים ויצר או ערוך את הכינוי שברצונך להגדיר עבורו משיב חופשה אוטומטי.
יש לך את היכולת להגדיר תאריך התחלה, תאריך סיום, נושא והודעה, ולהפעיל או להשבית זאת בכל עת:

* נושא והודעה בטקסט פשוט נתמכים כרגע (אנו משתמשים בחבילת `striptags` פנימית להסרת כל HTML).
* הנושא מוגבל ל-100 תווים.
* ההודעה מוגבלת ל-1000 תווים.
* ההגדרה דורשת תצורת SMTP יוצא (למשל, תצטרך להגדיר רשומות DKIM, DMARC ו-Return-Path ב-DNS).
  * עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההגדרה.
* לא ניתן להפעיל את המענה לחופשה על שמות דומיין ווניטי גלובליים (למשל, [כתובות חד-פעמיות](/disposable-addresses) אינן נתמכות).
* לא ניתן להפעיל את המענה לחופשה עבור כינויים עם תווים כלליים/תפיסת הכל (`*`) או ביטויים רגולריים.

בניגוד למערכות דואר כמו `postfix` (למשל, שמשתמשות בהרחבת סינון חופשה `sieve`) – Forward Email מוסיף אוטומטית את חתימת DKIM שלך, מגן מפני בעיות חיבור בעת שליחת תגובות חופשה (למשל, עקב בעיות חיבור SSL/TLS נפוצות ושרתים ישנים), ואפילו תומך ב-Open WKD ו-PGP להצפנת תגובות חופשה.

<!--
* כדי למנוע שימוש לרעה, יחויב זיכוי SMTP יוצא אחד עבור כל הודעת מענה חופשה שנשלחת.
  * כל החשבונות בתשלום כוללים כברירת מחדל 300 זיכויים ליום. אם אתה זקוק לכמות גדולה יותר, אנא צור קשר.
-->

1. אנו שולחים רק פעם אחת לכל שולח [ברשימת ההרשאה](#do-you-have-an-allowlist) כל 4 ימים (מה שדומה להתנהגות של Gmail).

   * מטמון Redis שלנו משתמש בטביעת אצבע של `alias_id` ו-`sender`, כאשר `alias_id` הוא מזהה הכינוי ב-MongoDB ו-`sender` הוא או כתובת ה-From (אם ברשימת ההרשאה) או דומיין השורש בכתובת ה-From (אם לא ברשימת ההרשאה). לפשטות, תוקף טביעת האצבע במטמון מוגדר ל-4 ימים.

   * הגישה שלנו להשתמש בדומיין השורש המנותח בכתובת ה-From עבור שולחים שאינם ברשימת ההרשאה מונעת שימוש לרעה משולחים יחסית לא מוכרים (למשל, שחקנים זדוניים) ששולחים הצפות של הודעות מענה חופשה.

2. אנו שולחים רק כאשר MAIL FROM ו/או From אינם ריקים ואינם מכילים (בלי תלות באותיות) [שם משתמש של מנהל דואר](#what-are-postmaster-addresses) (החלק לפני ה-@ באימייל).

3. איננו שולחים אם להודעה המקורית היו כל הכותרות הבאות (בלי תלות באותיות):

   * כותרת `auto-submitted` עם ערך שאינו שווה ל-`no`.
   * כותרת `x-auto-response-suppress` עם ערך של `dr`, `autoreply`, `auto-reply`, `auto_reply`, או `all`
   * כותרת `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, או `x-auto-respond` (ללא תלות בערך).
   * כותרת `precedence` עם ערך של `bulk`, `autoreply`, `auto-reply`, `auto_reply`, או `list`.

4. איננו שולחים אם כתובת ה-MAIL FROM או From מסתיימת ב-`+donotreply`, `-donotreply`, `+noreply`, או `-noreply`.

5. איננו שולחים אם החלק של שם המשתמש בכתובת From היה `mdaemon` והייתה כותרת `X-MDDSN-Message` ללא תלות באותיות.

6. איננו שולחים אם הייתה כותרת `content-type` ללא תלות באותיות מסוג `multipart/report`.

### איך להגדיר SPF עבור Forward Email {#how-do-i-set-up-spf-for-forward-email}

באמצעות דף ניהול ה-DNS של הרשם שלך, הגדר את רשומת <strong class="notranslate">TXT</strong> הבאה:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה משתמש ב-Gmail (למשל, שלח דואר בשם) או ב-G Suite, תצטרך להוסיף <code>include:_spf.google.com</code> לערך שלמעלה, לדוגמה:
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
    אם אתה משתמש ב-Microsoft Outlook או Live.com, תצטרך להוסיף <code>include:spf.protection.outlook.com</code> לרשומת ה-SPF <strong class="notranslate">TXT</strong> שלך, לדוגמה:
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
    אם כבר יש לך שורה דומה עם "v=spf1", תצטרך להוסיף <code>include:spf.forwardemail.net</code> ממש לפני כל רשומת "include:host.com" קיימת ולפני ה-" -all" באותה שורה, לדוגמה:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    שים לב שיש הבדל בין "-all" ל-"~all". ה-"-" מציין שבדיקת SPF תיכשל אם לא תתאים, וה-"~" מציין שבדיקת SPF תיכשל ברכות (SOFTFAIL). אנו ממליצים להשתמש בגישה של "-all" כדי למנוע זיוף דומיין.
    <br /><br />
    ייתכן שתצטרך גם לכלול את רשומת ה-SPF של השרת ממנו אתה שולח דואר (למשל Outlook).
  </span>
</div>

### איך להגדיר DKIM עבור Forward Email {#how-do-i-set-up-dkim-for-forward-email}

גש ל- <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההגדרה.

### איך להגדיר DMARC עבור Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

גש ל- <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההגדרה.

### איך לצפות בדוחות DMARC {#how-do-i-view-dmarc-reports}

Forward Email מספק לוח מחוונים מקיף לדוחות DMARC שמאפשר לך לנטר את ביצועי אימות הדואר האלקטרוני שלך בכל הדומיינים שלך מממשק אחד.

**מהם דוחות DMARC?**

דוחות DMARC (אימות, דיווח והתאמה מבוססי דומיין) הם קבצי XML שנשלחים על ידי שרתי דואר מקבלים שמספרים לך כיצד האימיילים שלך מאומתים. דוחות אלו עוזרים לך להבין:

* כמה מיילים נשלחים מהדומיין שלך
* האם המיילים עוברים אימות SPF ו-DKIM
* אילו פעולות מבצעים שרתי הקבלה (קבלה, הסגרה, או דחייה)
* אילו כתובות IP שולחות מייל בשם הדומיין שלך

**איך לגשת לדוחות DMARC**

גש ל- <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דוחות DMARC</a> כדי לצפות בלוח המחוונים שלך. ניתן גם לגשת לדוחות ספציפיים לדומיין מ- <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> על ידי לחיצה על כפתור "DMARC" לצד כל דומיין.

**תכונות לוח המחוונים**

לוח המחוונים של דוחות DMARC מספק:

* **מדדי סיכום**: סך הדוחות שהתקבלו, סך ההודעות שנותחו, שיעור התאמת SPF, שיעור התאמת DKIM, ושיעור ההצלחה הכולל
* **גרף הודעות לאורך זמן**: מגמת ויזואלית של נפח הדואר ושיעורי האימות ב-30 הימים האחרונים
* **סיכום התאמה**: גרף דונאט המציג את התפלגות ההתאמה בין SPF ל-DKIM
* **החלטת הודעות**: גרף עמודות מצטברות המציג כיצד שרתי הקבלה טיפלו בהודעות שלך (קבלה, הסגרה, או דחייה)
* **טבלת דוחות אחרונים**: רשימה מפורטת של דוחות DMARC בודדים עם אפשרויות סינון ודפדוף
* **סינון לפי דומיין**: סינון דוחות לפי דומיין ספציפי בעת ניהול מספר דומיינים
**למה זה חשוב**

עבור ארגונים המנהלים מספר דומיינים (כמו חברות גדולות, ארגונים ללא מטרות רווח או סוכנויות), דוחות DMARC הם חיוניים עבור:

* **זיהוי שולחים לא מורשים**: זיהוי אם מישהו מזייף את הדומיין שלך
* **שיפור מסירת המיילים**: הבטחת שהאימיילים הלגיטימיים שלך עוברים אימות
* **מעקב אחר תשתית המייל**: מעקב אחרי אילו שירותים וכתובות IP שולחים בשמך
* **ציות**: שמירה על נראות לאימות המיילים לצורכי ביקורת אבטחה

בניגוד לשירותים אחרים שדורשים כלים נפרדים למעקב DMARC, Forward Email כולל עיבוד והצגת דוחות DMARC כחלק מהחשבון שלך ללא עלות נוספת.

**דרישות**

* דוחות DMARC זמינים רק בתכניות בתשלום
* על הדומיין שלך להיות מוגדר עם DMARC (ראה [איך להגדיר DMARC עבור Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* הדוחות נאספים אוטומטית כאשר שרתי דואר נכנס שולחים אותם לכתובת הדיווח DMARC שהגדרת

**דוחות דואר אלקטרוני שבועיים**

משתמשים בתכניות בתשלום מקבלים אוטומטית סיכומי דוחות DMARC שבועיים בדואר האלקטרוני. דוא"לים אלו כוללים:

* סטטיסטיקות סיכום עבור כל הדומיינים שלך
* שיעורי התאמה של SPF ו-DKIM
* פירוט מצב ההודעה (מאושר, בבידוד, נדחה)
* הארגונים המדווחים המובילים (Google, Microsoft, Yahoo וכו')
* כתובות IP עם בעיות התאמה שעשויות לדרוש טיפול
* קישורים ישירים ללוח הבקרה של דוחות DMARC שלך

דוחות שבועיים נשלחים אוטומטית ואינם ניתנים לביטול בנפרד מהודעות דואר אחרות.

### איך מחברים ומגדירים את אנשי הקשר שלי {#how-do-i-connect-and-configure-my-contacts}

**להגדרת אנשי הקשר, השתמש בכתובת CardDAV של:** `https://carddav.forwardemail.net` (או פשוט `carddav.forwardemail.net` אם הלקוח שלך מאפשר זאת)

### איך מחברים ומגדירים את היומנים שלי {#how-do-i-connect-and-configure-my-calendars}

**להגדרת היומן, השתמש בכתובת CalDAV של:** `https://caldav.forwardemail.net` (או פשוט `caldav.forwardemail.net` אם הלקוח שלך מאפשר זאת)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### איך מוסיפים יומנים נוספים ומנהלים יומנים קיימים {#how-do-i-add-more-calendars-and-manage-existing-calendars}

אם ברצונך להוסיף יומנים נוספים, פשוט הוסף כתובת יומן חדשה של: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**ודא להחליף את `calendar-name` בשם היומן הרצוי שלך**)

ניתן לשנות את שם וצבע היומן לאחר יצירתו – פשוט השתמש באפליקציית היומן המועדפת עליך (למשל Apple Mail או [Thunderbird](https://thunderbird.net)).

### איך מחברים ומגדירים משימות ותזכורות {#how-do-i-connect-and-configure-tasks-and-reminders}

**להגדרת משימות ותזכורות, השתמש באותה כתובת CalDAV כמו ליומנים:** `https://caldav.forwardemail.net` (או פשוט `caldav.forwardemail.net` אם הלקוח שלך מאפשר זאת)

משימות ותזכורות יופרדו אוטומטית מאירועי היומן לאוסף ייעודי בשם "Reminders" או "Tasks".

**הוראות הגדרה לפי פלטפורמה:**

**macOS/iOS:**

1. הוסף חשבון CalDAV חדש בהעדפות מערכת > חשבונות אינטרנט (או הגדרות > חשבונות ב-iOS)
2. השתמש בשרת `caldav.forwardemail.net`
3. הזן את הכינוי שלך ב-Forward Email ואת הסיסמה שנוצרה
4. לאחר ההגדרה, תראה את אוספי "Calendar" ו-"Reminders"
5. השתמש באפליקציית Reminders ליצירה וניהול משימות

**אנדרואיד עם Tasks.org:**

1. התקן את Tasks.org מחנות Google Play או F-Droid
2. עבור להגדרות > סינכרון > הוסף חשבון > CalDAV
3. הזן את השרת: `https://caldav.forwardemail.net`
4. הזן את הכינוי שלך ב-Forward Email ואת הסיסמה שנוצרה
5. Tasks.org יגלה אוטומטית את יומני המשימות שלך

**Thunderbird:**

1. התקן את התוסף Lightning אם לא מותקן כבר
2. צור יומן חדש מסוג "CalDAV"
3. השתמש בכתובת: `https://caldav.forwardemail.net`
4. הזן את פרטי ההתחברות שלך ב-Forward Email
5. אירועים ומשימות יהיו זמינים בממשק היומן

### למה אני לא יכול ליצור משימות באפליקציית Reminders ב-macOS {#why-cant-i-create-tasks-in-macos-reminders}
אם יש לך בעיות ביצירת משימות ב-macOS Reminders, נסה את שלבי פתרון הבעיות הבאים:

1. **בדוק את הגדרת החשבון**: ודא שחשבון CalDAV שלך מוגדר כראוי עם `caldav.forwardemail.net`

2. **אמת לוחות שנה נפרדים**: עליך לראות גם "Calendar" וגם "Reminders" בחשבונך. אם אתה רואה רק "Calendar", ייתכן שתמיכת המשימות עדיין לא הופעלה במלואה.

3. **רענן את החשבון**: נסה להסיר ולהוסיף מחדש את חשבון CalDAV שלך ב-System Preferences > Internet Accounts

4. **בדוק את חיבור השרת**: בדוק שאתה יכול לגשת ל-`https://caldav.forwardemail.net` בדפדפן שלך

5. **אמת את האישורים**: ודא שאתה משתמש באימייל האליאס הנכון ובסיסמה שנוצרה (לא בסיסמת החשבון שלך)

6. **כפה סנכרון**: באפליקציית Reminders, נסה ליצור משימה ואז לרענן את הסנכרון ידנית

**בעיות נפוצות:**

* **"Reminders calendar not found"**: ייתכן שהשרת צריך רגע כדי ליצור את אוסף ה-Reminders בגישה הראשונה
* **משימות לא מסונכרנות**: בדוק ששני המכשירים משתמשים באותם אישורי חשבון CalDAV
* **תוכן מעורבב**: ודא שהמשימות נוצרות בלוח השנה "Reminders", לא בלוח הכללי "Calendar"

### איך להגדיר את Tasks.org באנדרואיד {#how-do-i-set-up-tasksorg-on-android}

Tasks.org הוא מנהל משימות קוד פתוח פופולרי שעובד מצוין עם תמיכת המשימות של Forward Email ב-CalDAV.

**התקנה והגדרה:**

1. **התקן את Tasks.org**:
   * מחנות Google Play: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * מ-F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **הגדר סנכרון CalDAV**:
   * פתח את Tasks.org
   * עבור ל-☰ תפריט > הגדרות > סנכרון
   * הקש על "Add Account"
   * בחר "CalDAV"

3. **הזן את הגדרות Forward Email**:
   * **כתובת השרת**: `https://caldav.forwardemail.net`
   * **שם משתמש**: אליאס Forward Email שלך (למשל, `you@yourdomain.com`)
   * **סיסמה**: הסיסמה שנוצרה לאליאס שלך
   * הקש על "Add Account"

4. **גילוי חשבון**:
   * Tasks.org יגלה אוטומטית את לוחות המשימות שלך
   * עליך לראות את אוסף "Reminders"
   * הקש על "Subscribe" כדי לאפשר סנכרון ללוח המשימות

5. **בדוק סנכרון**:
   * צור משימת בדיקה ב-Tasks.org
   * בדוק שהיא מופיעה בלקוחות CalDAV אחרים (כמו macOS Reminders)
   * אמת שהשינויים מסונכרנים בשני הכיוונים

**תכונות זמינות:**

* ✅ יצירה ועריכת משימות
* ✅ תאריכי יעד ותזכורות
* ✅ השלמת משימות ומצב
* ✅ רמות עדיפות
* ✅ משימות משנה והיררכיית משימות
* ✅ תגיות וקטגוריות
* ✅ סנכרון דו-כיווני עם לקוחות CalDAV אחרים

**פתרון בעיות:**

* אם לא מופיעים לוחות משימות, נסה לרענן ידנית בהגדרות Tasks.org
* ודא שיצרת לפחות משימה אחת בשרת (ניתן ליצור אחת קודם ב-macOS Reminders)
* בדוק את חיבור הרשת ל-`caldav.forwardemail.net`

### איך להגדיר SRS עבור Forward Email {#how-do-i-set-up-srs-for-forward-email}

אנו מגדירים אוטומטית את [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – אין צורך שתעשה זאת בעצמך.

### איך להגדיר MTA-STS עבור Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

אנא עיין ב-[החלק שלנו על MTA-STS](#do-you-support-mta-sts) לקבלת מידע נוסף.

### איך להוסיף תמונת פרופיל לכתובת האימייל שלי {#how-do-i-add-a-profile-picture-to-my-email-address}

אם אתה משתמש ב-Gmail, עקוב אחר השלבים הבאים:

1. עבור ל-<https://google.com> ויצא מכל חשבונות האימייל
2. לחץ על "Sign In" ובתפריט הנפתח לחץ על "other account"
3. בחר "Use another account"
4. בחר "Create account"
5. בחר "Use my current email address instead"
6. הזן את כתובת האימייל של הדומיין המותאם שלך
7. קבל את מייל האימות שנשלח לכתובת האימייל שלך
8. הזן את קוד האימות מהמייל הזה
9. השלם את פרטי הפרופיל עבור חשבון Google החדש שלך
10. הסכים לכל מדיניות הפרטיות ותנאי השימוש
11. עבור ל-<https://google.com> ובפינה הימנית העליונה, לחץ על סמל הפרופיל שלך, ולחץ על כפתור "change"
12. העלה תמונה או אווטאר חדש לחשבונך
13. השינויים ייקחו בערך 1-2 שעות להתעדכן, אך לפעמים זה יכול להיות מהיר מאוד.
14. שלח מייל בדיקה ותמונת הפרופיל אמורה להופיע.
## תכונות מתקדמות {#advanced-features}

### האם אתם תומכים בניוזלטרים או רשימות דיוור למיילים שקשורים לשיווק {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

כן, ניתן לקרוא עוד בכתובת <https://forwardemail.net/guides/newsletter-with-listmonk>.

שימו לב שבכדי לשמור על מוניטין ה-IP ולהבטיח הגעה, ל-Forward Email יש תהליך סקירה ידני על בסיס דומיין עבור **אישור ניוזלטר**. שלחו מייל ל-<support@forwardemail.net> או פתחו [בקשת עזרה](https://forwardemail.net/help) לאישור. בדרך כלל זה לוקח פחות מ-24 שעות, כאשר רוב הבקשות מאושרות תוך 1-2 שעות. בעתיד הקרוב אנו שואפים להפוך תהליך זה לאוטומטי עם בקרות ספאם נוספות והתראות. תהליך זה מבטיח שהמיילים שלכם יגיעו לתיבת הדואר הנכנס והודעותיכם לא יסומנו כספאם.

### האם אתם תומכים בשליחת מייל באמצעות API {#do-you-support-sending-email-with-api}

כן, מאז מאי 2023 אנו תומכים בשליחת מייל באמצעות API כתוספת לכל המשתמשים בתשלום.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">תנאי השימוש</a>, <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a>, ו-<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">מגבלות SMTP יוצאות</a> &ndash; השימוש שלכם נחשב לאישור והסכמה.
  </span>
</div>

אנא עיינו בסעיף שלנו על [מיילים](/email-api#outbound-emails) בתיעוד ה-API שלנו לאפשרויות, דוגמאות ותובנות נוספות.

כדי לשלוח מייל יוצא עם ה-API שלנו, עליכם להשתמש בטוקן ה-API שלכם הזמין תחת [האבטחה שלי](/my-account/security).

### האם אתם תומכים בקבלת מייל באמצעות IMAP {#do-you-support-receiving-email-with-imap}

כן, מאז 16 באוקטובר 2023 אנו תומכים בקבלת מייל דרך IMAP כתוספת לכל המשתמשים בתשלום.  **אנא קראו את המאמר המעמיק שלנו** על [איך פועל מאפיין אחסון תיבת דואר מוצפנת SQLite שלנו](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אנא ודאו שקראתם את <a href="/terms" class="alert-link" target="_blank">תנאי השימוש</a> ו-<a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> &ndash; השימוש שלכם נחשב לאישור והסכמה.
  </span>
</div>

1. צרו כינוי חדש לדומיין שלכם תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>)

2. לחצו על <strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> ליד הכינוי שנוצר זה עתה. העתיקו ללוח והחזיקו את הסיסמה שנוצרה בצורה מאובטחת המוצגת על המסך.

3. באמצעות אפליקציית המייל המועדפת עליכם, הוסיפו או הגדירו חשבון עם הכינוי החדש שיצרתם (למשל <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אנו ממליצים להשתמש ב-<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, או <a href="/blog/open-source" class="alert-link" target="_blank">חלופה קוד פתוח וממוקדת פרטיות</a>.</span>
   </div>

4. כאשר תתבקשו להזין שם שרת IMAP, הזינו `imap.forwardemail.net`

5. כאשר תתבקשו להזין פורט שרת IMAP, הזינו `993` (SSL/TLS) – ראו [פורט IMAP חלופי](/faq#what-are-your-imap-server-configuration-settings) אם יש צורך
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אם אתם משתמשים ב-Thunderbird, ודאו ש-"אבטחת חיבור" מוגדרת ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"סיסמה רגילה".</span>
   </div>
6. כאשר תתבקש להזין סיסמת שרת IMAP, הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> בשלב 2 למעלה

7. **שמור את ההגדרות שלך** – אם יש לך בעיות, אנא <a href="/help">צור קשר איתנו</a>

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

### האם אתם תומכים ב-POP3 {#do-you-support-pop3}

כן, החל מ-4 בדצמבר 2023 אנו תומכים ב-[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) כתוספת לכל המשתמשים בתשלום.  **אנא קרא את המאמר המעמיק שלנו** על [איך פועל תכונת אחסון תיבת דואר מוצפנת SQLite שלנו](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אנא ודא שקראת את <a href="/terms" class="alert-link" target="_blank">תנאי השימוש</a> ואת <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a> שלנו &ndash; השימוש שלך נחשב לאישור והסכמה.
  </span>
</div>

1. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>)

2. לחץ על <strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> לצד הכינוי החדש שנוצר. העתק ללוח והעבר לאחסון מאובטח את הסיסמה שנוצרה המוצגת על המסך.

3. באמצעות אפליקציית הדואר המועדפת עליך, הוסף או הגדר חשבון עם הכינוי החדש שיצרת (למשל <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אנו ממליצים להשתמש ב-<a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, או <a href="/blog/open-source" class="alert-link" target="_blank">חלופה קוד פתוח וממוקדת פרטיות</a>.</span>
   </div>

4. כאשר תתבקש להזין שם שרת POP3, הזן `pop3.forwardemail.net`

5. כאשר תתבקש להזין פורט שרת POP3, הזן `995` (SSL/TLS) – ראה [פורטים חלופיים ל-POP3](/faq#what-are-your-pop3-server-configuration-settings) במידת הצורך
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אם אתה משתמש ב-Thunderbird, ודא ש-"אבטחת חיבור" מוגדר ל-"SSL/TLS" ושיטת האימות מוגדרת ל-"סיסמה רגילה".</span>
   </div>

6. כאשר תתבקש להזין סיסמת שרת POP3, הדבק את הסיסמה מ-<strong class="text-success"><i class="fa fa-key"></i> יצירת סיסמה</strong> בשלב 2 למעלה

7. **שמור את ההגדרות שלך** – אם יש לך בעיות, אנא <a href="/help">צור קשר איתנו</a>

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

### האם אתם תומכים ביומנים (CalDAV) {#do-you-support-calendars-caldav}

כן, החל מ-5 בפברואר 2024 הוספנו תכונה זו. השרת שלנו הוא `caldav.forwardemail.net` ומנוטר גם בדף ה-<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">סטטוס</a>.
הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך פורט `443` (HTTPS).

| התחברות | דוגמה                      | תיאור                                                                                                                                                                                    |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com`         | כתובת האימייל של כינוי שקיים לדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>.               |
| סיסמה   | `************************` | סיסמה שנוצרה ספציפית לכינוי.                                                                                                                                                            |

כדי להשתמש בתמיכה בלוח שנה, ה-**משתמש** חייב להיות כתובת האימייל של כינוי שקיים לדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> – וה-**סיסמה** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

### האם אתם תומכים במשימות ותזכורות (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

כן, החל מ-14 באוקטובר 2025 הוספנו תמיכה ב-CalDAV VTODO למשימות ותזכורות. זה משתמש באותו שרת כמו התמיכה שלנו בלוח שנה: `caldav.forwardemail.net`.

שרת ה-CalDAV שלנו תומך גם באירועים בלוח שנה (VEVENT) וגם ברכיבי משימות (VTODO) באמצעות **לוחות שנה מאוחדים**. משמעות הדבר שכל לוח שנה יכול להכיל גם אירועים וגם משימות, ומספק גמישות מקסימלית ותאימות מלאה בין כל לקוחות CalDAV.

**איך לוחות שנה ורשימות פועלים:**

* **כל לוח שנה תומך גם באירועים וגם במשימות** - ניתן להוסיף אירועים, משימות, או שניהם לכל לוח שנה
* **רשימות תזכורות של אפל** - כל רשימה שתיצור ב-Apple Reminders הופכת ללוח שנה נפרד בשרת
* **לוחות שנה מרובים** - ניתן ליצור כמה לוחות שנה שתרצה, כל אחד עם שם, צבע וארגון משלו
* **סינכרון בין לקוחות** - משימות ואירועים מסונכרנים בצורה חלקה בין כל הלקוחות התואמים

**לקוחות משימות נתמכים:**

* **macOS Reminders** - תמיכה מלאה ונייטיבית ביצירת משימות, עריכה, השלמה וסינכרון
* **iOS Reminders** - תמיכה מלאה ונייטיבית בכל מכשירי iOS
* **Tasks.org (אנדרואיד)** - מנהל משימות קוד פתוח פופולרי עם סינכרון CalDAV
* **Thunderbird** - תמיכה במשימות ולוח שנה בלקוח הדואר השולחני
* **כל מנהל משימות תואם CalDAV** - תמיכה ברכיב VTODO סטנדרטי

**תכונות משימות נתמכות:**

* יצירה, עריכה ומחיקה של משימות
* תאריכי יעד ותאריכי התחלה
* סטטוס השלמת משימה (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* רמות עדיפות למשימות
* משימות חוזרות
* תיאורים והערות למשימות
* סינכרון בין מכשירים מרובים
* משימות משנה עם מאפיין RELATED-TO
* תזכורות למשימות עם VALARM

פרטי ההתחברות זהים לאלו של תמיכת לוח השנה:

| התחברות | דוגמה                      | תיאור                                                                                                                                                                                    |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com`         | כתובת האימייל של כינוי שקיים לדומיין ב-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>.               |
| סיסמה   | `************************` | סיסמה שנוצרה ספציפית לכינוי.                                                                                                                                                            |

**הערות חשובות:**

* **כל רשימת תזכורות היא לוח שנה נפרד** - כשאתה יוצר רשימה חדשה ב-Apple Reminders, נוצרת לוח שנה חדש בשרת CalDAV
* **משתמשי Thunderbird** - תצטרך להירשם ידנית לכל לוח שנה/רשימה שברצונך לסנכרן, או להשתמש בכתובת הבית של לוח השנה: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **משתמשי אפל** - גילוי לוחות השנה מתבצע אוטומטית, כך שכל לוחות השנה והרשימות שלך יופיעו ב-Calendar.app וב-Reminders.app
* **לוחות שנה מאוחדים** - כל לוחות השנה תומכים גם באירועים וגם במשימות, ומאפשרים לך גמישות בארגון הנתונים שלך
### האם אתם תומכים באנשי קשר (CardDAV) {#do-you-support-contacts-carddav}

כן, החל מ-12 ביוני 2025 הוספנו תכונה זו. השרת שלנו הוא `carddav.forwardemail.net` ומנוטר גם בדף הסטטוס שלנו <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך פורט `443` (HTTPS).

| התחברות | דוגמה                     | תיאור                                                                                                                                                                                    |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com`         | כתובת האימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a>.                  |
| סיסמה    | `************************` | סיסמה שנוצרה ספציפית לכינוי.                                                                                                                                                            |

כדי להשתמש בתמיכה באנשי קשר, ה**משתמש** חייב להיות כתובת האימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> – וה**סיסמה** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

### האם אתם תומכים בשליחת אימייל עם SMTP {#do-you-support-sending-email-with-smtp}

כן, מאז מאי 2023 אנו תומכים בשליחת אימייל עם SMTP כתוספת לכל המשתמשים בתשלום.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אנא ודא שקראת את <a href="/terms" class="alert-link" target="_blank">תנאי השימוש</a>, <a href="/privacy" class="alert-link" target="_blank">מדיניות הפרטיות</a>, ו-<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">מגבלות SMTP יוצא</a> &ndash; השימוש שלך נחשב לאישור והסכמה.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה משתמש בג'ימייל, עיין במדריך שלנו <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">שליחת דואר ככתובת מותאמת בג'ימייל</a>. אם אתה מפתח, עיין בתיעוד ה-<a class="alert-link" href="/email-api#outbound-emails" target="_blank">API של האימייל</a>.
  </span>
</div>

1. עבור אל <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> הגדרות <i class="fa fa-angle-right"></i> תצורת SMTP יוצא ופעל לפי הוראות ההגדרה

2. צור כינוי חדש לדומיין שלך תחת <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>)

3. לחץ על <strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> ליד הכינוי שנוצר זה עתה. העתק ללוח הגזירים שלך ושמור בבטחה את הסיסמה שנוצרה המוצגת על המסך.

4. באמצעות אפליקציית האימייל המועדפת עליך, הוסף או הגדר חשבון עם הכינוי החדש שיצרת (למשל <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אנו ממליצים להשתמש ב- <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, או <a href="/blog/open-source" class="alert-link" target="_blank">חלופה קוד פתוח וממוקדת פרטיות</a>.</span>
   </div>
5. כאשר תתבקש להזין שם שרת SMTP, הזן `smtp.forwardemail.net`

6. כאשר תתבקש להזין פורט של שרת SMTP, הזן `465` (SSL/TLS) – ראה [פורטים חלופיים ל-SMTP](/faq#what-are-your-smtp-server-configuration-settings) אם יש צורך
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אם אתה משתמש ב-Thunderbird, ודא ש"Connection security" מוגדר ל-"SSL/TLS" וששיטת האימות מוגדרת ל-"Normal password".</span>
   </div>

7. כאשר תתבקש להזין סיסמת שרת SMTP, הדבק את הסיסמה מ- <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> בשלב 3 למעלה

8. **שמור את ההגדרות ושלח את המייל הבדיקה הראשון שלך** – אם יש לך בעיות, אנא <a href="/help">צור קשר</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    שים לב שבכדי לשמור על מוניטין כתובת ה-IP ולהבטיח מסירה, יש לנו תהליך סקירה ידני על בסיס דומיין לאישור SMTP יוצא. תהליך זה בדרך כלל לוקח פחות מ-24 שעות, כאשר רוב הבקשות מאושרות בתוך 1-2 שעות. בעתיד הקרוב אנו שואפים להפוך תהליך זה לאוטומטי עם בקרות ספאם נוספות והתראות. תהליך זה מבטיח שהמיילים שלך יגיעו לתיבת הדואר הנכנס והודעותיך לא יסומנו כספאם.
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

### האם אתם תומכים ב-OpenPGP/MIME, הצפנה מקצה לקצה ("E2EE"), ו-Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

כן, אנו תומכים ב-[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [הצפנה מקצה לקצה ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), ובגילוי מפתחות ציבוריים באמצעות [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). ניתן להגדיר OpenPGP באמצעות [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) או [לאחסן את המפתחות שלך בעצמך](https://wiki.gnupg.org/WKDHosting) (עיין ב-[gist זה להגדרת שרת WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* חיפושי WKD נשמרים במטמון למשך שעה אחת כדי להבטיח מסירה בזמן → לכן אם הוספת, שינית או הסרת את מפתח WKD שלך, אנא שלח לנו מייל ל-`support@forwardemail.net` עם כתובת המייל שלך כדי שננקות את המטמון ידנית.
* אנו תומכים בהצפנת PGP להודעות שמועברות דרך חיפוש WKD או באמצעות מפתח PGP שהועלה בממשק שלנו.
* מפתחות שהועלו מקבלים עדיפות כל עוד תיבת הסימון של PGP מופעלת/מסומנת.
* הודעות שנשלחות ל-webhooks כרגע אינן מוצפנות ב-PGP.
* אם יש לך מספר כינויים התואמים לכתובת העברה נתונה (למשל regex/wildcard/שילוב מדויק) ואם יותר מאחד מהם מכיל מפתח PGP שהועלה ויש PGP מסומן → אז נשלח לך מייל התראה על שגיאה ולא נצפין את ההודעה עם מפתח ה-PGP שהועלה. זה נדיר מאוד ובדרך כלל חל רק על משתמשים מתקדמים עם כללי כינויים מורכבים.
* **הצפנת PGP לא תיושם על העברת מייל דרך שרתי MX שלנו אם השולח היה עם מדיניות DMARC של דחייה. אם אתה זקוק להצפנת PGP על *כל* הדואר, אנו ממליצים להשתמש בשירות IMAP שלנו ולהגדיר את מפתח ה-PGP שלך לכינוי שלך עבור דואר נכנס.**

**אתה יכול לאמת את הגדרת Web Key Directory שלך ב-<https://wkd.chimbosonic.com/> (קוד פתוח) או ב-<https://www.webkeydirectory.com/> (קנייני).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    הצפנה אוטומטית:
  </strong>
  <span>אם אתה משתמש ב-<a href="#do-you-support-sending-email-with-smtp" class="alert-link">שירות SMTP היוצא שלנו</a> ושולח הודעות לא מוצפנות, אז ננסה אוטומטית להצפין הודעות על בסיס כל נמען באמצעות <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    עליך לבצע את כל השלבים הבאים כדי לאפשר OpenPGP עבור שם הדומיין המותאם אישית שלך.
  </span>
</div>

1. הורד והתקן את התוסף המומלץ של לקוח הדואר האלקטרוני שלך למטה:

   | לקוח דואר אלקטרוני | פלטפורמה | תוסף מומלץ                                                                                                                                                                         | הערות                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird        | שולחן עבודה | [הגדר OpenPGP ב-Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | ל-Thunderbird יש תמיכה מובנית ב-OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                               |
   | Gmail              | דפדפן    | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני)                                                                               | Gmail אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                     |
   | Apple Mail         | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                       | Apple Mail אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                                        |
   | Apple Mail         | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) או [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (רישיון קנייני)                              | Apple Mail אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [PGPro](https://github.com/opensourceios/PGPro/) או [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                     |
   | Outlook            | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                       | לקוח הדואר של Outlook לשולחן העבודה אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                               |
   | Outlook            | דפדפן    | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני)                                                                               | לקוח הדואר של Outlook בדפדפן אינו תומך ב-OpenPGP, אך ניתן להוריד את התוסף בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                             |
   | Android            | מובייל   | [OpenKeychain](https://www.openkeychain.org/) או [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                    | [לקוחות דואר אנדרואיד](/blog/open-source/android-email-clients) כגון [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) ו-[FairEmail](https://github.com/M66B/FairEmail) תומכים בתוסף בקוד פתוח [OpenKeychain](https://www.openkeychain.org/). ניתן גם להשתמש בתוסף בקוד פתוח (רישוי קנייני) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email).                                      |
   | Google Chrome      | דפדפן    | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני)                                                                               | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                            |
   | Mozilla Firefox    | דפדפן    | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני)                                                                               | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                            |
   | Microsoft Edge     | דפדפן    | [Mailvelope](https://mailvelope.com/)                                                                                                                                              | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                             |
   | Brave              | דפדפן    | [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download) (רישיון קנייני)                                                                               | ניתן להוריד את תוסף הדפדפן בקוד פתוח [Mailvelope](https://mailvelope.com/) או [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                            |
   | Balsa              | שולחן עבודה | [הגדר OpenPGP ב-Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                              | ל-Balsa יש תמיכה מובנית ב-OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                     |
   | KMail              | שולחן עבודה | [הגדר OpenPGP ב-KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                  | ל-KMail יש תמיכה מובנית ב-OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                     |
   | GNOME Evolution    | שולחן עבודה | [הגדר OpenPGP ב-Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                                | ל-GNOME Evolution יש תמיכה מובנית ב-OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                           |
   | Terminal           | שולחן עבודה | [הגדר gpg ב-Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                            | ניתן להשתמש בכלי שורת הפקודה בקוד פתוח [gpg](https://www.gnupg.org/download/) כדי ליצור מפתח חדש משורת הפקודה.                                                                                                                                                                                                                                                                                                                       |
2. פתח את התוסף, צור את המפתח הציבורי שלך, וקבע את תצורת לקוח הדוא"ל שלך לשימוש בו.

3. העלה את המפתח הציבורי שלך בכתובת <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>אתה יכול לבקר ב- <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> כדי לנהל את המפתח שלך בעתיד.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       תוספת אופציונלית:
     </strong>
     <span>
       אם אתה משתמש בשירות <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">אחסון מוצפן (IMAP/POP3)</a> שלנו ורוצה שכל הדוא"ל המאוחסן במסד הנתונים SQLite שלך (כבר מוצפן) יהיה מוצפן עם המפתח הציבורי שלך, עבור אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> ערוך <i class="fa fa-angle-right"></i> OpenPGP והעלה את המפתח הציבורי שלך.
     </span>
   </div>

4. הוסף רשומת `CNAME` חדשה לשם הדומיין שלך (למשל `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>שם/מארח/כינוי</th>
         <th class="text-center">TTL</th>
         <th>סוג</th>
         <th>תשובה/ערך</th>
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
       טיפ:
     </strong>
     <span>אם הכינוי שלך משתמש ב- <a class="alert-link" href="/disposable-addresses" target="_blank">דומיינים זמניים/ווניטי</a> שלנו (למשל <code>hideaddress.net</code>), תוכל לדלג על שלב זה.</span>
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

### האם אתם תומכים בהצפנת S/MIME {#do-you-support-smime-encryption}

כן, אנו תומכים בהצפנת [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) כפי שמוגדר ב-[RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME מספק הצפנה מקצה לקצה באמצעות תעודות X.509, הנתמכות באופן נרחב על ידי לקוחות דוא"ל ארגוניים.

אנו תומכים בתעודות RSA ו-ECC (קריפטוגרפיית עקומה אליפטית):

* **תעודות RSA**: מינימום 2048 ביט, מומלץ 4096 ביט
* **תעודות ECC**: עקומות NIST P-256, P-384, ו-P-521

כדי להגדיר הצפנת S/MIME עבור הכינוי שלך:

1. השג תעודת S/MIME מרשות תעודות מהימנה (CA) או צור תעודה חתומה עצמית לצורך בדיקה.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       טיפ:
     </strong>
     <span>תעודות S/MIME חינמיות זמינות מספקים כמו <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> או <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. ייצא את התעודה שלך בפורמט PEM (רק התעודה הציבורית, לא המפתח הפרטי).

3. עבור אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים (למשל <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> ערוך <i class="fa fa-angle-right"></i> S/MIME והעלה את התעודה הציבורית שלך.
4. לאחר ההגדרה, כל המיילים הנכנסים לכתובת החילופית שלך יוצפנו באמצעות תעודת S/MIME שלך לפני האחסון או ההעברה.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       הערה:
     </strong>
     <span>
       הצפנת S/MIME מיושמת על הודעות נכנסות שאינן מוצפנות כבר. אם ההודעה כבר מוצפנת באמצעות OpenPGP או S/MIME, היא לא תוצפן מחדש.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       חשוב:
     </strong>
     <span>
       הצפנת S/MIME לא תיושם על העברת מייל דרך שרתי ה-MX שלנו אם השולח קבע מדיניות DMARC של דחייה. אם אתה זקוק להצפנת S/MIME על <em>כל</em> הדואר, אנו ממליצים להשתמש בשירות ה-IMAP שלנו ולהגדיר את תעודת ה-S/MIME שלך עבור הכתובת החילופית לקבלת דואר נכנס.
     </span>
   </div>

לקוחות המייל הבאים כוללים תמיכה מובנית ב-S/MIME:

| לקוח מייל         | פלטפורמה | הערות                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | תמיכה מובנית ב-S/MIME. עבור אל Mail > Preferences > Accounts > החשבון שלך > Trust כדי להגדיר תעודות.             |
| Apple Mail        | iOS      | תמיכה מובנית ב-S/MIME. עבור אל Settings > Mail > Accounts > החשבון שלך > Advanced > S/MIME כדי להגדיר.             |
| Microsoft Outlook | Windows  | תמיכה מובנית ב-S/MIME. עבור אל File > Options > Trust Center > Trust Center Settings > Email Security כדי להגדיר.  |
| Microsoft Outlook | macOS    | תמיכה מובנית ב-S/MIME. עבור אל Tools > Accounts > Advanced > Security כדי להגדיר.                                  |
| Thunderbird       | Desktop  | תמיכה מובנית ב-S/MIME. עבור אל Account Settings > End-To-End Encryption > S/MIME כדי להגדיר.                       |
| GNOME Evolution   | Desktop  | תמיכה מובנית ב-S/MIME. עבור אל Edit > Preferences > Mail Accounts > החשבון שלך > Security כדי להגדיר.              |
| KMail             | Desktop  | תמיכה מובנית ב-S/MIME. עבור אל Settings > Configure KMail > Identities > הזהות שלך > Cryptography כדי להגדיר.       |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      מזל טוב!
    </strong>
    <span>
      הגדרת בהצלחה את הצפנת S/MIME עבור הכתובת החילופית שלך.
    </span>
  </div>
</div>

### האם אתם תומכים בסינון מיילים באמצעות Sieve {#do-you-support-sieve-email-filtering}

כן! אנו תומכים בסינון מיילים באמצעות [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) כפי שמוגדר ב-[RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve היא שפת סקריפטים חזקה ומאוחדת לסינון מיילים בצד השרת, המאפשרת לארגן, לסנן ולהגיב להודעות נכנסות באופן אוטומטי.

#### הרחבות Sieve נתמכות {#supported-sieve-extensions}

אנו תומכים במערך מקיף של הרחבות Sieve:

| הרחבה                      | RFC                                                                                     | תיאור                                            |
| -------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                 | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | לארכוב הודעות לתיקיות ספציפיות                   |
| `reject` / `ereject`       | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | לדחות הודעות עם שגיאה                              |
| `vacation`                 | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | תגובות חופשה/מחוץ למשרד אוטומטיות                |
| `vacation-seconds`         | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | פרקי זמן מדויקים לתגובות חופשה                     |
| `imap4flags`               | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | הגדרת דגלי IMAP (\Seen, \Flagged וכו')             |
| `envelope`                 | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | בדיקת שולח/נמען במעטפה                            |
| `body`                     | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | בדיקת תוכן גוף ההודעה                             |
| `variables`                | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | אחסון ושימוש במשתנים בסקריפטים                     |
| `relational`               | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | השוואות יחסיות (גדול מ-, קטן מ-)                   |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                            | השוואות מספריות                                   |
| `copy`                     | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | העתקת הודעות תוך הפניה מחדש                        |
| `editheader`               | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | הוספה או מחיקה של כותרות הודעה                      |
| `date`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | בדיקת ערכי תאריך/שעה                              |
| `index`                    | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | גישה להופעות ספציפיות בכותרת                       |
| `regex`                    | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | התאמת ביטוי רגולרי                                |
| `enotify`                  | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | שליחת התראות (למשל, mailto:)                       |
| `environment`              | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | גישה למידע סביבתי                                 |
| `mailbox`                  | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | בדיקת קיום תיבת דואר, יצירת תיבות דואר            |
| `special-use`              | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | ארכוב לתיבות דואר לשימוש מיוחד (\Junk, \Trash)     |
| `duplicate`                | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | זיהוי הודעות כפולות                               |
| `ihave`                    | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | בדיקת זמינות הרחבה                                |
| `subaddress`               | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | גישה לחלקי כתובת user+detail                      |
#### הרחבות שלא נתמכות {#extensions-not-supported}

ההרחבות הבאות אינן נתמכות כרגע:

| הרחבה                                                        | סיבה                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `include`                                                    | סיכון אבטחה (הזרקת סקריפטים) ודורש אחסון סקריפטים גלובלי          |
| `mboxmetadata` / `servermetadata`                            | דורש תמיכה בהרחבת IMAP METADATA                                    |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | טיפול מורכב בעץ MIME שטרם יושם                                    |

#### דוגמאות לסקריפטים של Sieve {#example-sieve-scripts}

**לסווג ניוזלטרים לתיקייה:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**תשובה אוטומטית בזמן חופשה:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "אני כרגע מחוץ למשרד ואענה כשאשוב.";
```

**סימון הודעות ממקור חשוב:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**דחיית ספאם עם נושאים ספציפיים:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "ההודעה נדחתה עקב תוכן ספאם.";
}
```

#### ניהול סקריפטים של Sieve {#managing-sieve-scripts}

ניתן לנהל את סקריפטי ה-Sieve שלכם בכמה דרכים:

1. **ממשק אינטרנט**: גשו ל- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים <i class="fa fa-angle-right"></i> סקריפטים של Sieve כדי ליצור ולנהל סקריפטים.

2. **פרוטוקול ManageSieve**: התחברו באמצעות כל לקוח התומך ב-ManageSieve (כמו תוסף Sieve של Thunderbird או [sieve-connect](https://github.com/philpennock/sieve-connect)) לכתובת `imap.forwardemail.net`. השתמשו ביציאה `2190` עם STARTTLS (מומלץ לרוב הלקוחות) או ביציאה `4190` עם TLS מרומז.

3. **API**: השתמשו ב-[REST API](/api#sieve-scripts) שלנו לניהול סקריפטים בתכנות.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    הערה:
  </strong>
  <span>
    סינון Sieve מתבצע על הודעות נכנסות לפני שהן נשמרות בתיבת הדואר שלכם. הסקריפטים מבוצעים לפי סדר עדיפות, והפעולה הראשונה שתואמת קובעת כיצד ההודעה מטופלת.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    אבטחה:
  </strong>
  <span>
    לצורך אבטחה, פעולות הפניה מוגבלות ל-10 לכל סקריפט ו-100 ליום. תגובות חופשה מוגבלות בקצב כדי למנוע שימוש לרעה.
  </span>
</div>

### האם אתם תומכים ב-MTA-STS {#do-you-support-mta-sts}

כן, מאז 2 במרץ 2023 אנו תומכים ב-[MTA-STS](https://www.hardenize.com/blog/mta-sts). ניתן להשתמש ב-[תבנית זו](https://github.com/jpawlowski/mta-sts.template) אם ברצונכם להפעיל זאת בדומיין שלכם.

ההגדרות שלנו זמינות בפומבי ב-GitHub בכתובת <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### האם אתם תומכים ב-passkeys ו-WebAuthn {#do-you-support-passkeys-and-webauthn}

כן! מאז 13 בדצמבר 2023 הוספנו תמיכה ב-passkeys [עקב ביקוש גבוה](https://github.com/orgs/forwardemail/discussions/182).

Passkeys מאפשרים לכם להיכנס בצורה מאובטחת ללא צורך בסיסמה ואימות דו-שלבי.

ניתן לאמת את זהותכם באמצעות מגע, זיהוי פנים, סיסמה מבוססת מכשיר או PIN.

אנו מאפשרים לנהל עד 30 passkeys בו-זמנית, כך שתוכלו להיכנס עם כל המכשירים שלכם בקלות.

למידע נוסף על passkeys בקישורים הבאים:

* [התחברו לאפליקציות ואתרים עם passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [השתמשו ב-passkeys כדי להיכנס לאפליקציות ואתרים באייפון](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [מאמר ויקיפדיה על Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### האם אתם תומכים בפרקטיקות הטובות ביותר לדואר אלקטרוני {#do-you-support-email-best-practices}

כן. יש לנו תמיכה מובנית ב-SPF, DKIM, DMARC, ARC ו-SRS בכל התכניות. בנוסף, עבדנו רבות עם המחברים המקוריים של המפרטים הללו ומומחים נוספים לדואר אלקטרוני כדי להבטיח שלמות ואחוזי מסירה גבוהים.

### האם אתם תומכים ב-webhooks להחזרות (bounce) {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
    מחפשים תיעוד על webhooks לדואר אלקטרוני? ראו <a href="/faq#do-you-support-webhooks" class="alert-link">האם אתם תומכים ב-webhooks?</a> למידע נוסף.
  <span>
  </span>
</div>

כן, החל מ-14 באוגוסט 2024 הוספנו תכונה זו. כעת ניתן לגשת אל חשבוני → דומיינים → הגדרות → כתובת URL ל-webhook להחזרות ולהגדיר כתובת `http://` או `https://` אליה נשלח בקשת `POST` בכל פעם שדואר יוצא דרך SMTP חוזר.

זה שימושי לניהול ומעקב אחר דואר יוצא דרך SMTP – וניתן להשתמש בו לשמירת מנויים, הסרה מרשימות, וזיהוי מתי מתרחשות החזרות.

ה-payload של webhook להחזרות נשלח כ-JSON עם התכונות הבאות:

* `email_id` (מחרוזת) - מזהה הדואר התואם לדואר ב-חשבוני → דואר (SMTP יוצא)
* `list_id` (מחרוזת) - ערך כותרת `List-ID` (לא תלוי רישיות), אם קיים, מהדואר המקורי היוצא
* `list_unsubscribe` (מחרוזת) - ערך כותרת `List-Unsubscribe` (לא תלוי רישיות), אם קיים, מהדואר המקורי היוצא
* `feedback_id` (מחרוזת) - ערך כותרת `Feedback-ID` (לא תלוי רישיות), אם קיים, מהדואר המקורי היוצא
* `recipient` (מחרוזת) - כתובת הדואר של הנמען שהחזרה או שגיאה התרחשה עבורו
* `message` (מחרוזת) - הודעת שגיאה מפורטת עבור ההחזרה
* `response` (מחרוזת) - הודעת תגובת SMTP
* `response_code` (מספר) - קוד תגובת SMTP מפורש
* `truth_source` (מחרוזת) - אם קוד התגובה הגיע ממקור מהימן, ערך זה יכיל את שם הדומיין הראשי (למשל `google.com` או `yahoo.com`)
* `bounce` (אובייקט) - אובייקט המכיל את התכונות הבאות המפרטות את מצב ההחזרה והדחייה
  * `action` (מחרוזת) - פעולה של ההחזרה (למשל `"reject"`)
  * `message` (מחרוזת) - סיבת ההחזרה (למשל `"Message Sender Blocked By Receiving Server"`)
  * `category` (מחרוזת) - קטגוריית ההחזרה (למשל `"block"`)
  * `code` (מספר) - קוד מצב ההחזרה (למשל `554`)
  * `status` (מחרוזת) - קוד ההחזרה מתוך הודעת התגובה (למשל `5.7.1`)
  * `line` (מספר) - מספר שורה מפורש, אם קיים, [מרשימת ניתוח ההחזרות של Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (למשל `526`)
* `headers` (אובייקט) - זוגות מפתח-ערך של כותרות עבור הדואר היוצא
* `bounced_at` (מחרוזת) - תאריך בפורמט [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) למועד בו התרחשה שגיאת ההחזרה

לדוגמה:

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

הנה כמה הערות נוספות לגבי webhooks להחזרות:

* אם ה-payload של ה-webhook מכיל ערך `list_id`, `list_unsubscribe`, או `feedback_id`, יש לנקוט בפעולה מתאימה להסרת ה-`recipient` מהרשימה במידת הצורך.
  * אם ערך `bounce.category` היה אחד מ-`"block"`, `"recipient"`, `"spam"`, או `"virus"`, יש להסיר את המשתמש מהרשימה בוודאות.
* אם יש צורך לאמת את ה-payload של ה-webhook (כדי לוודא שהוא אכן מגיע מהשרת שלנו), ניתן [לפתור את כתובת ה-IP של הלקוח מרחוק באמצעות חיפוש הפוך](https://nodejs.org/api/dns.html#dnspromisesreverseip) – היא צריכה להיות `smtp.forwardemail.net`.
  * ניתן גם לבדוק את כתובת ה-IP מול [כתובות ה-IP שפרסמנו](#what-are-your-servers-ip-addresses).
  * גשו אל חשבוני → דומיינים → הגדרות → מפתח אימות חתימת webhook לקבלת מפתח ה-webhook שלכם.
    * ניתן לסובב מפתח זה בכל עת מסיבות אבטחה.
    * חשבו והשוו את ערך `X-Webhook-Signature` מבקשת ה-webhook שלנו עם הערך המחושב של הגוף באמצעות מפתח זה. דוגמה כיצד לעשות זאת זמינה ב-[פוסט זה ב-Stack Overflow](https://stackoverflow.com/a/68885281).
  * ראו את הדיון ב-<https://github.com/forwardemail/free-email-forwarding/issues/235> למידע נוסף.
* נחכה עד `5` שניות לתגובה מכתובת ה-webhook שלכם עם קוד סטטוס `200`, וננסה שוב עד `1` פעם.
* אם נגלה שכתובת ה-webhook שלכם מכילה שגיאה בעת ניסיון לשלוח אליה בקשה, נשלח לכם מייל נימוס פעם בשבוע.
### האם אתם תומכים ב-webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
    מחפשים תיעוד על bounce webhooks? ראו <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">האם אתם תומכים ב-bounce webhooks?</a> לקבלת תובנות נוספות.
  <span>
  </span>
</div>

כן, מאז 15 במאי 2020 הוספנו תכונה זו. אתם יכולים פשוט להוסיף webhook(s) בדיוק כמו שהייתם עושים עם כל נמען! אנא ודאו כי יש לכם את הפרוטוקול "http" או "https" כמקדים בכתובת ה-URL של ה-webhook.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    הגנת פרטיות משופרת:
  </strong>
  <span>
    אם אתם בתכנית בתשלום (שכוללת הגנת פרטיות משופרת), אנא גשו ל- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> ולחצו על "כינויים" לצד הדומיין שלכם כדי להגדיר את ה-webhooks שלכם. אם תרצו ללמוד עוד על תכניות בתשלום ראו את דף ה- <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">תמחור</a>. אחרת, תוכלו להמשיך לעקוב אחר ההוראות למטה.
  </span>
</div>

אם אתם בתכנית החינמית, פשוט הוסיפו רשומת DNS <strong class="notranslate">TXT</strong> חדשה כפי שמוצג למטה:

לדוגמה, אם אני רוצה שכל המיילים שנשלחים ל- `alias@example.com` יועברו לנקודת בדיקה חדשה של [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

או אולי אתם רוצים שכל המיילים שנשלחים ל- `example.com` יועברו לנקודת הקצה הזו:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**הנה הערות נוספות לגבי webhooks:**

* אם אתם צריכים לאמת את מטעני ה-webhook (כדי לוודא שהם אכן מגיעים מהשרת שלנו), תוכלו [לפתור את כתובת ה-IP של הלקוח מרחוק באמצעות חיפוש הפוך](https://nodejs.org/api/dns.html#dnspromisesreverseip) – היא צריכה להיות או `mx1.forwardemail.net` או `mx2.forwardemail.net`.
  * תוכלו גם לבדוק את ה-IP מול [כתובות ה-IP שפרסמנו](#what-are-your-servers-ip-addresses).
  * אם אתם בתכנית בתשלום, גשו ל- החשבון שלי → דומיינים → הגדרות → מפתח אימות מטען חתימת webhook כדי לקבל את מפתח ה-webhook שלכם.
    * ניתן לסובב מפתח זה בכל עת מסיבות אבטחה.
    * חשבו והשוו את ערך `X-Webhook-Signature` מבקשת ה-webhook שלנו עם הערך המחושב של הגוף באמצעות מפתח זה. דוגמה כיצד לעשות זאת זמינה ב-[פוסט זה ב-Stack Overflow](https://stackoverflow.com/a/68885281).
  * ראו את הדיון ב- <https://github.com/forwardemail/free-email-forwarding/issues/235> לקבלת תובנות נוספות.
* אם webhook אינו מגיב עם קוד סטטוס `200`, נשמור את תגובתו ב-[יומן השגיאות שנוצר](#do-you-store-error-logs) – דבר שיכול לסייע בניפוי שגיאות.
* בקשות HTTP ל-webhook ינסו מחדש עד 3 פעמים בכל ניסיון חיבור SMTP, עם זמן מקסימלי של 60 שניות לכל בקשת POST לנקודת הקצה. **שימו לב שזה לא אומר שהוא מנסה רק 3 פעמים**, הוא ימשיך לנסות לאורך זמן על ידי שליחת קוד SMTP 421 (שמציין לשולח לנסות שוב מאוחר יותר) לאחר ניסיון POST HTTP כושל שלישי. משמעות הדבר היא שהמייל ינסה שוב ושוב במשך ימים עד שיתקבל קוד סטטוס 200.
* ננסה אוטומטית מחדש בהתבסס על קודי הסטטוס והשגיאה ברירת המחדל המשמשים ב-[שיטת הניסיון של superagent](https://ladjs.github.io/superagent/#retrying-requests) (אנו המתחזקים).
* אנו מקבצים יחד בקשות HTTP ל-webhook לאותה נקודת קצה בבקשה אחת במקום במספר בקשות כדי לחסוך משאבים ולהאיץ את זמן התגובה. לדוגמה, אם תשלחו מייל ל- <webhook1@example.com>, <webhook2@example.com>, ו- <webhook3@example.com>, וכולם מוגדרים לפגוע באותה כתובת URL מדויקת של נקודת הקצה, תתבצע בקשה אחת בלבד. אנו מקבצים לפי התאמה מדויקת של נקודת הקצה עם שוויון מוחלט.
* שימו לב שאנו משתמשים בשיטת "simpleParser" של ספריית [mailparser](https://nodemailer.com/extras/mailparser/) כדי לפרש את ההודעה לאובייקט ידידותי ל-JSON.
* ערך המייל הגולמי כמחרוזת ניתן בתכונה "raw".
* תוצאות האימות ניתנות כתכונות "dkim", "spf", "arc", "dmarc", ו-"bimi".
* כותרות המייל המפורשות ניתנות כתכונה "headers" – אך שימו לב שניתן להשתמש גם ב-"headerLines" להקל על איטרציה ופרסינג.
* הנמענים המקובצים עבור webhook זה מקובצים יחד וניתנים כתכונה "recipients".
* מידע על סשן SMTP ניתן כתכונה "session". זה מכיל מידע על שולח ההודעה, זמן ההגעה של ההודעה, HELO, ושם המארח של הלקוח. ערך שם המארח של הלקוח כ- `session.clientHostname` הוא או ה-FQDN (מחיפוש PTR הפוך) או `session.remoteAddress` עטוף בסוגריים (למשל `"[127.0.0.1]"`).
* אם אתם צריכים דרך מהירה לקבל את ערך `X-Original-To`, תוכלו להשתמש בערך של `session.recipient` (ראו דוגמה למטה). הכותרת `X-Original-To` היא כותרת שאנו מוסיפים להודעות לצורך ניפוי שגיאות עם הנמען המקורי (לפני העברת המסכה) של ההודעה.
* אם אתם צריכים להסיר תכונות `attachments` ו/או `raw` מגוף המטען, פשוט הוסיפו `?attachments=false`, `?raw=false`, או `?attachments=false&raw=false` לכתובת נקודת הקצה של ה-webhook שלכם כפרמטר מחרוזת שאילתה (למשל `https://example.com/webhook?attachments=false&raw=false`).
* אם יש קבצים מצורפים, הם יתווספו למערך `attachments` עם ערכי Buffer. תוכלו לפרש אותם חזרה לתוכן באמצעות גישה ב-JavaScript כגון:
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

### האם אתם תומכים בביטויים רגולריים או regex {#do-you-support-regular-expressions-or-regex}

כן, מאז 27 בספטמבר 2021 הוספנו תכונה זו. ניתן פשוט לכתוב ביטויים רגולריים ("regex") להתאמת כינויים ולביצוע החלפות.

כינויים הנתמכים על ידי ביטויים רגולריים הם כאלו שמתחילים ב-`/` ומסתיימים ב-`/` והנמענים שלהם הם כתובות אימייל או webhooks. הנמענים יכולים גם לכלול תמיכה בהחלפות regex (למשל `$1`, `$2`).

אנו תומכים בשני דגלים של ביטויים רגולריים כולל `i` ו-`g`. דגל אי-רגישות לאותיות `i` הוא ברירת מחדל קבועה ותמיד נאכף. דגל הגלובלי `g` ניתן להוספה על ידך על ידי הוספת `/g` בסוף הביטוי.

שים לב שאנו גם תומכים ב- <a href="#can-i-disable-specific-aliases">תכונת כינויים מושבתים</a> עבור חלק הנמען עם התמיכה בביטויים רגולריים.

ביטויים רגולריים אינם נתמכים ב- <a href="/disposable-addresses" target="_blank">דומיינים גלובליים זמניים</a> (כיוון שזה עלול להיות פרצת אבטחה).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    הגנת פרטיות משופרת:
  </strong>
  <span>
    אם אתה נמצא בתוכנית בתשלום (שכוללת הגנת פרטיות משופרת), אנא עבור אל <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> ולחץ על "כינויים" לצד הדומיין שלך כדי להגדיר כינויים, כולל כאלו עם ביטויים רגולריים. אם ברצונך ללמוד עוד על תוכניות בתשלום ראה את דף ה- <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">תמחור</a> שלנו.
  </span>
</div>

#### דוגמאות להגנת פרטיות משופרת {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם כינוי</th>
      <th>השפעה</th>
      <th>בדיקה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>אימיילים ל-`linus@example.com` או `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">צפה בבדיקה ב-RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>אימיילים ל-`24highst@example.com` או `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">צפה בבדיקה ב-RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
    כדי לבדוק את אלה ב- <a href="https://regexr.com" class="alert-link">RegExr</a>, כתוב את הביטוי בתיבת הטקסט העליונה, ואז הקלד דוגמת כינוי בתיבת הטקסט שמתחת. אם זה מתאים, זה יהפוך לכחול.
  <span>
  </span>
</div>

#### דוגמאות לתוכנית החינמית {#examples-for-the-free-plan}

אם אתה בתוכנית החינמית, פשוט הוסף רשומת DNS <strong class="notranslate">TXT</strong> חדשה באמצעות אחת או יותר מהדוגמאות שסופקו למטה:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה פשוטה:</strong> אם אני רוצה שכל האימיילים שנשלחים ל-`linus@example.com` או `torvalds@example.com` יועברו ל-`user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמת החלפת שם פרטי ושם משפחה:</strong> דמיין שכל כתובות האימייל של החברה שלך הן בפורמט `firstname.lastname@example.com`. אם אני רוצה שכל האימיילים שנשלחים לפורמט `firstname.lastname@example.com` יועברו ל-`firstname.lastname@company.com` עם תמיכה בהחלפות (<a href="https://regexr.com/66hnu" class="alert-link">צפה בבדיקה ב-RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה להחלפת סינון סימן פלוס:</strong> אם אני רוצה שכל המיילים שנשלחים ל-`info@example.com` או ל-`support@example.com` יועברו ל-`user+info@gmail.com` או ל-`user+support@gmail.com` בהתאמה (עם תמיכה בהחלפה) (<a href="https://regexr.com/66ho7" class="alert-link">צפה במבחן ב-RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה להחלפת מחרוזת שאילתה ב-webhook:</strong> אולי תרצה שכל המיילים שנשלחים ל-`example.com` יגיעו ל<a href="#do-you-support-webhooks" class="alert-link">webhook</a> ויכילו מפתח דינמי במחרוזת השאילתה בשם "to" עם הערך של חלק שם המשתמש בכתובת המייל (<a href="https://regexr.com/66ho4" class="alert-link">צפה במבחן ב-RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה לדחייה שקטה:</strong> אם אתה רוצה שכל המיילים שתואמים לתבנית מסוימת יושבתו וידחו בשקט (נראה לשולח כאילו ההודעה נשלחה בהצלחה, אך למעשה ההודעה לא מגיעה לשום מקום) עם קוד סטטוס `250` (ראה <a href="#can-i-disable-specific-aliases" class="alert-link">האם ניתן להשבית כינויים ספציפיים</a>), פשוט השתמש באותה שיטה עם סימן קריאה יחיד "!". זה מציין לשולח שההודעה נמסרה בהצלחה, אך למעשה היא לא הגיעה לשום מקום (למשל חור שחור או `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה לדחייה רכה:</strong> אם אתה רוצה שכל המיילים שתואמים לתבנית מסוימת יושבתו וידחו בדחייה רכה עם קוד סטטוס `421` (ראה <a href="#can-i-disable-specific-aliases" class="alert-link">האם ניתן להשבית כינויים ספציפיים</a>), פשוט השתמש באותה שיטה עם שני סימני קריאה "!!". זה מציין לשולח לנסות לשלוח את המייל שוב, והמיילים לכינוי זה ינסו להישלח מחדש במשך כ-5 ימים ואז יידחו לצמיתות.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>דוגמה לדחייה מוחלטת:</strong> אם ברצונך שכל האימיילים התואמים לתבנית מסוימת יושבתו וידחו בדחייה מוחלטת עם קוד סטטוס `550` (ראה <a href="#can-i-disable-specific-aliases" class="alert-link">האם ניתן להשבית כינויים ספציפיים</a>), פשוט השתמש באותה שיטה עם שלוש סימני קריאה "!!!". זה מציין לשולח שגיאה קבועה והאימיילים לא ינסו שוב, הם יידחו עבור כינוי זה.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/שרת/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
    סקרן איך לכתוב ביטוי רגולרי או צריך לבדוק את ההחלפה שלך? אתה יכול לגשת לאתר הבדיקה החינמי של ביטויים רגולריים <a href="https://regexr.com" class="alert-link">RegExr</a> בכתובת <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### מהן מגבלות ה-SMTP היוצאות שלך {#what-are-your-outbound-smtp-limits}

אנחנו מגבילים משתמשים ודומיינים ל-300 הודעות SMTP יוצאות ליום אחד. זה בממוצע מעל 9000 אימיילים בחודש קלנדרי. אם אתה צריך לעבור את הכמות הזו או שיש לך אימיילים גדולים באופן עקבי, אנא [צור קשר](https://forwardemail.net/help).

### האם אני צריך אישור כדי להפעיל SMTP {#do-i-need-approval-to-enable-smtp}

כן, שים לב שבכדי לשמור על מוניטין ה-IP ולהבטיח הגעה, ל-Forward Email יש תהליך סקירה ידני על בסיס דומיין לאישור SMTP יוצא. שלח אימייל ל-<support@forwardemail.net> או פתח [בקשת עזרה](https://forwardemail.net/help) לאישור. בדרך כלל זה לוקח פחות מ-24 שעות, כאשר רוב הבקשות מאושרות תוך 1-2 שעות. בעתיד הקרוב אנו שואפים להפוך תהליך זה לאוטומטי עם בקרות ספאם נוספות והתראות. תהליך זה מבטיח שהאימיילים שלך יגיעו לתיבת הדואר הנכנס והודעותיך לא יסומנו כספאם.

### מהן הגדרות תצורת שרת ה-SMTP שלך {#what-are-your-smtp-server-configuration-settings}

השרת שלנו הוא `smtp.forwardemail.net` ומפוקח גם בדף הסטטוס שלנו <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך הפורטים `465` ו-`2465` עבור SSL/TLS (מומלץ) ו-`587`, `2587`, `2525`, ו-`25` עבור TLS (STARTTLS).

**מאוקטובר 2025**, אנו תומכים כעת בחיבורים **TLS 1.0 ישן** בפורטים `2455` (SSL/TLS) ו-`2555` (STARTTLS) עבור מכשירים ישנים כגון מדפסות, סורקים, מצלמות, ולקוחות אימייל ישנים שאינם תומכים בגרסאות TLS מודרניות. פורטים אלו ניתנים כחלופה לג'ימייל, יאהו, אאוטלוק וספקים אחרים שהפסיקו לתמוך בפרוטוקולי TLS ישנים.

> \[!CAUTION]
> **תמיכה ב-TLS 1.0 ישן (פורט 2455 ו-2555)**: פורטים אלו משתמשים בפרוטוקול TLS 1.0 המיושן שיש לו פגיעויות אבטחה ידועות (BEAST, POODLE). השתמש בפורטים אלו רק אם המכשיר שלך ממש לא יכול לתמוך ב-TLS 1.2 ומעלה. אנו ממליצים בחום לעדכן את קושחת המכשיר או לעבור ללקוחות אימייל מודרניים מתי שניתן. פורטים אלו מיועדים אך ורק לתאימות חומרה ישנה (מדפסות ישנות, סורקים, מצלמות, מכשירי IoT).

|                                     פרוטוקול                                     | שם מארח                |            פורטים            |        IPv4        |        IPv6        | הערות                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **מומלץ**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS מודרני 1.2+ (מומלץ)          |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | נתמך (מומלץ פורט SSL/TLS `465`)  |
|                             `SSL/TLS` **ישן בלבד**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 רק למכשירים ישנים |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **ישן בלבד** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 רק למכשירים ישנים |
| התחברות | דוגמה                      | תיאור                                                                                                                                                                                    |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com`         | כתובת אימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>.               |
| סיסמה   | `************************` | כינוי                                                                                                                                                                                    |

כדי לשלוח אימייל יוצא באמצעות SMTP, **משתמש SMTP** חייב להיות כתובת האימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> – ו-**סיסמת SMTP** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

אנא עיין ב-[האם אתם תומכים בשליחת אימייל עם SMTP](#do-you-support-sending-email-with-smtp) להוראות שלב אחר שלב.

### מהן הגדרות תצורת שרת ה-IMAP שלכם {#what-are-your-imap-server-configuration-settings}

השרת שלנו הוא `imap.forwardemail.net` ומפוקח גם בדף הסטטוס שלנו <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך הפורטים `993` ו-`2993` עבור SSL/TLS.

|         פרוטוקול         | שם מארח                 |     פורטים    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **מועדף**      | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| התחברות | דוגמה                      | תיאור                                                                                                                                                                                    |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com`         | כתובת אימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>.               |
| סיסמה   | `************************` | סיסמה שנוצרה ספציפית לכינוי.                                                                                                                                                            |

כדי להתחבר עם IMAP, **משתמש IMAP** חייב להיות כתובת האימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> – ו-**סיסמת IMAP** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

אנא עיין ב-[האם אתם תומכים בקבלת אימייל עם IMAP](#do-you-support-receiving-email-with-imap) להוראות שלב אחר שלב.

### מהן הגדרות תצורת שרת ה-POP3 שלכם {#what-are-your-pop3-server-configuration-settings}

השרת שלנו הוא `pop3.forwardemail.net` ומפוקח גם בדף הסטטוס שלנו <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">status page</a>.

הוא תומך גם ב-IPv4 וגם ב-IPv6 וזמין דרך הפורטים `995` ו-`2995` עבור SSL/TLS.

|         פרוטוקול         | שם מארח                 |     פורטים    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **מועדף**      | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| התחברות | דוגמה                      | תיאור                                                                                                                                                                                   |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| שם משתמש | `user@example.com`         | כתובת האימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>.               |
| סיסמה   | `************************` | סיסמה שנוצרה ספציפית לכינוי.                                                                                                                                                            |

כדי להתחבר עם POP3, ה-**משתמש POP3** חייב להיות כתובת האימייל של כינוי שקיים לדומיין ב- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> – ו-**סיסמת IMAP** חייבת להיות סיסמה שנוצרה ספציפית לכינוי.

אנא עיין ב-[האם אתם תומכים ב-POP3](#do-you-support-pop3) לקבלת הוראות שלב אחר שלב.

### כיצד להגדיר גילוי אוטומטי של אימייל לדומיין שלי {#how-do-i-set-up-email-autodiscovery-for-my-domain}

גילוי אוטומטי של אימייל מאפשר ללקוחות אימייל כגון **Thunderbird**, **Apple Mail**, **Microsoft Outlook**, ומכשירים ניידים לזהות אוטומטית את הגדרות השרת הנכונות של IMAP, SMTP, POP3, CalDAV ו-CardDAV כאשר משתמש מוסיף את חשבון האימייל שלו. זה מוגדר על ידי [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (אימייל) ו-[RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) ומשתמש ברשומות DNS SRV.

Forward Email מפרסם רשומות גילוי אוטומטי ב-`forwardemail.net`. ניתן להוסיף רשומות SRV ישירות לדומיין שלך, או להשתמש בגישת CNAME פשוטה יותר.

#### אפשרות א: רשומות CNAME (הפשוטה ביותר) {#option-a-cname-records-simplest}

הוסף את שתי רשומות ה-CNAME האלה ל-DNS של הדומיין שלך. זה מפקיד את הגילוי האוטומטי לשרתים של Forward Email:

|  סוג  | שם/מארח       | יעד/ערך                      |
| :---: | -------------- | ---------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

הרשומה `autoconfig` משמשת על ידי **Thunderbird** ולקוחות מבוססי Mozilla אחרים. הרשומה `autodiscover` משמשת על ידי **Microsoft Outlook**.

#### אפשרות ב: רשומות SRV (ישירות) {#option-b-srv-records-direct}

אם אתה מעדיף להוסיף את הרשומות ישירות (או שספק ה-DNS שלך לא תומך ב-CNAME בתת-דומיינים), הוסף את רשומות ה-SRV האלה לדומיין שלך:

| סוג  | שם/מארח           | עדיפות | משקל | פורט | יעד/ערך                   | מטרה                                  |
| :--: | ------------------ | :----: | :---: | :--: | ------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`      |   0    |  1    |  993 | `imap.forwardemail.net`   | IMAP על SSL/TLS (מועדף)               |
|  SRV | `_imap._tcp`       |   0    |  0    |  0   | `.`                       | IMAP טקסט פשוט מושבת                 |
|  SRV | `_submissions._tcp`|   0    |  1    |  465 | `smtp.forwardemail.net`   | שליחת SMTP (SSL/TLS, מומלץ)           |
|  SRV | `_submission._tcp` |   5    |  1    |  587 | `smtp.forwardemail.net`   | שליחת SMTP (STARTTLS)                  |
|  SRV | `_pop3s._tcp`      |  10    |  1    |  995 | `pop3.forwardemail.net`   | POP3 על SSL/TLS                      |
|  SRV | `_pop3._tcp`       |   0    |  0    |  0   | `.`                       | POP3 טקסט פשוט מושבת                 |
|  SRV | `_caldavs._tcp`    |   0    |  1    |  443 | `caldav.forwardemail.net` | CalDAV על TLS (לוחות שנה)             |
|  SRV | `_caldav._tcp`     |   0    |  0    |  0   | `.`                       | CalDAV טקסט פשוט מושבת               |
|  SRV | `_carddavs._tcp`   |   0    |  1    |  443 | `carddav.forwardemail.net`| CardDAV על TLS (אנשי קשר)              |
|  SRV | `_carddav._tcp`    |   0    |  0    |  0   | `.`                       | CardDAV טקסט פשוט מושבת              |
> \[!NOTE]
> ל-IMAP יש ערך עדיפות נמוך יותר (0) מאשר ל-POP3 (10), מה שמורה ללקוחות הדואר להעדיף IMAP על פני POP3 כאשר שניהם זמינים. הרשומות עם יעד של `.` (נקודה בודדת) מציינות שגרסאות הטקסט הפשוט (שאינן מוצפנות) של הפרוטוקולים הללו מושבתות בכוונה לפי [RFC 6186 Section 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). רשומות ה-SRV של CalDAV ו-CardDAV עוקבות אחרי [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) לגילוי אוטומטי של לוח שנה ופרטי קשר.

#### אילו לקוחות דואר תומכים בגילוי אוטומטי? {#which-email-clients-support-autodiscovery}

| לקוח               | דואר אלקטרוני                                   | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | רשומות `autoconfig` CNAME או SRV                 | רשומות `autoconfig` XML או SRV (RFC 6764) |
| Apple Mail (macOS) | רשומות SRV (RFC 6186)                            | רשומות SRV (RFC 6764)                     |
| Apple Mail (iOS)   | רשומות SRV (RFC 6186)                            | רשומות SRV (RFC 6764)                     |
| Microsoft Outlook  | רשומות `autodiscover` CNAME או `_autodiscover._tcp` SRV | לא נתמך                                  |
| GNOME (Evolution)  | רשומות SRV (RFC 6186)                            | רשומות SRV (RFC 6764)                     |
| KDE (KMail)        | רשומות SRV (RFC 6186)                            | רשומות SRV (RFC 6764)                     |
| eM Client          | `autoconfig` או `autodiscover`                    | רשומות SRV (RFC 6764)                     |

> \[!TIP]
> עבור התאימות הטובה ביותר בין כל הלקוחות, אנו ממליצים להשתמש ב**אפשרות א'** (רשומות CNAME) בשילוב עם רשומות SRV מ**אפשרות ב'**. גישת ה-CNAME בלבד מכסה את רוב לקוחות הדואר. רשומות ה-SRV של CalDAV/CardDAV מבטיחות שגם לקוחות לוח שנה ופרטי קשר יוכלו לגלות אוטומטית את הגדרות השרת שלכם.


## אבטחה {#security-1}

### טכניקות מתקדמות לחיזוק השרת {#advanced-server-hardening-techniques}

> \[!TIP]
> למידע נוסף על תשתית האבטחה שלנו עיינו ב[דף האבטחה שלנו](/security).

Forward Email מיישמת טכניקות רבות לחיזוק השרת כדי להבטיח את אבטחת התשתית והנתונים שלכם:

1. **אבטחת רשת**:
   * חומת אש IP tables עם כללים מחמירים
   * Fail2ban להגנה מפני התקפות כוח גס
   * ביקורות אבטחה סדירות ובדיקות חדירה
   * גישה מנהלית רק דרך VPN

2. **חיזוק מערכת**:
   * התקנת חבילות מינימלית
   * עדכוני אבטחה סדירים
   * SELinux במצב אכיפה
   * השבתת גישת SSH לשורש
   * אימות מבוסס מפתח בלבד

3. **אבטחת יישומים**:
   * כותרות מדיניות אבטחת תוכן (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * כותרות הגנה מפני XSS
   * אפשרויות מסגרת וכותרות מדיניות מפנה
   * ביקורות תלות סדירות

4. **הגנת נתונים**:
   * הצפנת דיסק מלאה עם LUKS
   * ניהול מפתחות מאובטח
   * גיבויים סדירים עם הצפנה
   * שיטות למזעור נתונים

5. **ניטור ותגובה**:
   * זיהוי חדירות בזמן אמת
   * סריקות אבטחה אוטומטיות
   * רישום וניתוח מרכזי
   * נהלי תגובה לאירועים

> \[!IMPORTANT]
> נהלי האבטחה שלנו מתעדכנים באופן רציף כדי להתמודד עם איומים ופגיעויות מתפתחות.

> \[!TIP]
> עבור אבטחה מקסימלית, אנו ממליצים להשתמש בשירות שלנו עם הצפנה מקצה לקצה באמצעות OpenPGP.

### האם יש לכם תעודות SOC 2 או ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email פועלת על תשתית המסופקת על ידי תת-מעבדים מוסמכים כדי להבטיח עמידה בסטנדרטים תעשייתיים.

Forward Email אינה מחזיקה ישירות בתעודות SOC 2 Type II או ISO 27001. עם זאת, השירות פועל על תשתית המסופקת על ידי תת-מעבדים מוסמכים:

* **DigitalOcean**: מוסמכת SOC 2 Type II ו-SOC 3 Type II (נבדקה על ידי Schellman & Company LLC), מוסמכת ISO 27001 במספר מרכזי נתונים. פרטים: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: מוסמך SOC 2+ (HIPAA), תעודות ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. פרטים: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: תואם SOC 2 (יש לפנות ישירות ל-DataPacket לקבלת תעודה), ספק תשתיות ברמת ארגונית (מיקום דנבר). פרטים: <https://www.datapacket.com/datacenters/denver>

Forward Email פועל לפי שיטות עבודה מומלצות בתעשייה לבדיקות אבטחה ומעורב באופן קבוע עם חוקרי אבטחה עצמאיים. מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### האם אתם משתמשים בהצפנת TLS להעברת אימיילים {#do-you-use-tls-encryption-for-email-forwarding}

כן. Forward Email מחייבת TLS 1.2+ לכל החיבורים (HTTPS, SMTP, IMAP, POP3) ומיישמת MTA-STS לתמיכה משופרת ב-TLS. היישום כולל:

* אכיפת TLS 1.2+ לכל חיבורי האימייל
* החלפת מפתחות ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) לסודיות מושלמת קדימה
* חבילות הצפנה מודרניות עם עדכוני אבטחה שוטפים
* תמיכה ב-HTTP/2 לשיפור ביצועים ואבטחה
* HSTS (HTTP Strict Transport Security) עם טעינה מוקדמת בדפדפנים מרכזיים
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** לאכיפת TLS מחמירה

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**יישום MTA-STS**: Forward Email מיישמת אכיפה מחמירה של MTA-STS בקוד. כאשר מתרחשות שגיאות TLS ואכיפת MTA-STS פעילה, המערכת מחזירה קודי סטטוס SMTP 421 כדי להבטיח שהאימיילים ינסו להישלח שוב מאוחר יותר במקום להישלח באופן לא מאובטח. פרטי היישום:

* זיהוי שגיאות TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* אכיפת MTA-STS בעזר send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

אימות צד שלישי: <https://www.hardenize.com/report/forwardemail.net/1750312779> מציג דירוג "טוב" לכל אמצעי האבטחה של TLS וההעברה.

### האם אתם שומרים על כותרות אימות האימייל {#do-you-preserve-email-authentication-headers}

כן. Forward Email מיישמת ושומרת באופן מקיף על כותרות אימות האימייל:

* **SPF (Sender Policy Framework)**: מיושם ונשמר כראוי
* **DKIM (DomainKeys Identified Mail)**: תמיכה מלאה עם ניהול מפתחות תקין
* **DMARC**: אכיפת מדיניות לאימיילים שנכשלו באימות SPF או DKIM
* **ARC**: למרות שלא מפורט במפורש, ציוני הציות המושלמים של השירות מצביעים על טיפול מקיף בכותרות אימות

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

אימות: מבחן הדואר של Internet.nl מציג ציון 100/100 במיוחד עבור יישום "SPF, DKIM, ו-DMARC". הערכת Hardenize מאשרת דירוג "טוב" ל-SPF ו-DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### האם אתם שומרים על כותרות האימייל המקוריות ומונעים זיופים {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email מיישמת הגנה מתקדמת נגד זיופים למניעת שימוש לרעה באימייל.

Forward Email שומרת על כותרות האימות המקוריות תוך יישום הגנה מקיפה נגד זיופים דרך קוד ה-MX:

* **שמירת כותרות**: כותרות האימות המקוריות נשמרות במהלך ההעברה
* **מניעת זיופים**: אכיפת מדיניות DMARC מונעת זיוף כותרות על ידי דחיית אימיילים שנכשלו באימות SPF או DKIM
* **מניעת הזרקת כותרות**: אימות קלט וניקוי באמצעות ספריית striptags
* **הגנה מתקדמת**: זיהוי פישינג מתקדם עם גילוי זיופים, מניעת התחזות ומערכות התראה למשתמשים

**פרטי יישום MX**: הלוגיקה המרכזית לעיבוד האימייל מטופלת בקוד שרת ה-MX, בפרט:

* מטפל הנתונים הראשי של MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* סינון אימייל שרירותי (מניעת זיופים): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

העזר `isArbitrary` מיישם כללי מניעת זיופים מתקדמים הכוללים זיהוי התחזות לדומיין, ביטויים חסומים ודפוסי פישינג שונים.
### איך אתם מגנים מפני ספאם והתעללות {#how-do-you-protect-against-spam-and-abuse}

Forward Email מיישם הגנה רב-שכבתית מקיפה:

* **הגבלת קצב**: מיושמת על ניסיונות אימות, נקודות קצה של API, וחיבורים SMTP
* **בידוד משאבים**: בין משתמשים כדי למנוע השפעה ממשתמשים בעלי נפח גבוה
* **הגנה מפני DDoS**: הגנה רב-שכבתית דרך מערכת Shield של DataPacket ו-Cloudflare
* **קנה מידה אוטומטי**: התאמת משאבים דינמית בהתאם לביקוש
* **מניעת התעללות**: בדיקות מניעת התעללות ספציפיות למשתמש וחסימה מבוססת hash לתוכן זדוני
* **אימות דואר אלקטרוני**: פרוטוקולי SPF, DKIM, DMARC עם זיהוי מתקדם של פישינג

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (פרטי הגנת DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### האם אתם מאחסנים תוכן דואר אלקטרוני בדיסק {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email משתמש בארכיטקטורת אפס-ידע שמונעת כתיבת תוכן הדואר האלקטרוני לדיסק.

* **ארכיטקטורת אפס-ידע**: תיבות דואר SQLite מוצפנות בנפרד משמעותן ש-Forward Email אינו יכול לגשת לתוכן הדואר
* **עיבוד בזיכרון**: עיבוד הדואר מתבצע כולו בזיכרון, ללא אחסון בדיסק
* **אין רישום תוכן**: "איננו רושמים או מאחסנים תוכן דואר אלקטרוני או מטא-נתונים בדיסק"
* **הצפנה בסביבה מבודדת**: מפתחות ההצפנה לעולם אינם מאוחסנים בדיסק בטקסט ברור

**ראיות מקוד MX**: שרת MX מעבד דואר כולו בזיכרון ללא כתיבת תוכן לדיסק. המטפל הראשי בעיבוד הדואר מדגים גישה זו בזיכרון: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (תקציר)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (פרטי אפס-ידע)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (הצפנה בסביבה מבודדת)

### האם תוכן הדואר האלקטרוני עלול להיחשף בעת קריסות מערכת {#can-email-content-be-exposed-during-system-crashes}

לא. Forward Email מיישם אמצעי הגנה מקיפים מפני חשיפת נתונים בעת קריסות:

* **כיבוי Core Dumps**: מונע חשיפת זיכרון בעת קריסות
* **כיבוי זיכרון החלפה (Swap)**: מושבת לחלוטין למניעת חילוץ נתונים רגישים מקבצי החלפה
* **ארכיטקטורה בזיכרון**: תוכן הדואר קיים רק בזיכרון נדיף במהלך העיבוד
* **הגנת מפתחות הצפנה**: מפתחות לעולם אינם מאוחסנים בדיסק בטקסט ברור
* **אבטחה פיזית**: דיסקים מוצפנים ב-LUKS v2 מונעים גישה פיזית לנתונים
* **כיבוי אחסון USB**: מונע חילוץ נתונים לא מורשה

**טיפול בשגיאות לבעיות מערכת**: Forward Email משתמש בפונקציות עזר `isCodeBug` ו-`isTimeoutError` כדי להבטיח שאם מתרחשות בעיות חיבור למסד נתונים, בעיות רשת/DNS/רשימות חסימה, או בעיות חיבור לשרתי על, המערכת מחזירה קודי סטטוס SMTP 421 כדי להבטיח שהדואר ינסה להישלח שוב מאוחר יותר במקום לאבד או לחשוף אותו.

פרטי מימוש:

* סיווג שגיאות: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* טיפול בשגיאות timeout בעיבוד MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

מקור: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### מי יש לו גישה לתשתית הדואר האלקטרוני שלכם {#who-has-access-to-your-email-infrastructure}

Forward Email מיישם בקרות גישה מקיפות לצוות ההנדסה המינימלי של 2-3 אנשים עם דרישות 2FA מחמירות:

* **בקרת גישה מבוססת תפקידים**: עבור חשבונות צוות עם הרשאות מבוססות משאבים
* **עקרון ההרשאה המינימלית**: מיושם בכל המערכות
* **הפרדת תפקידים**: בין תפקידים תפעוליים
* **ניהול משתמשים**: משתמשים נפרדים לפריסה ול-devops עם הרשאות מובחנות
* **כיבוי כניסת root**: מחייב גישה דרך חשבונות מאומתים כראוי
* **2FA מחמיר**: ללא 2FA מבוסס SMS עקב סיכון להתקפות MiTM - רק אפליקציות או טוקנים חומרתיים
* **רישום ביקורת מקיף**: עם טשטוש נתונים רגישים
* **זיהוי אנומליות אוטומטי**: לדפוסי גישה חריגים
* **סקירות אבטחה תקופתיות**: של יומני גישה
* **מניעת התקפות Evil Maid**: אחסון USB מושבת ואמצעי אבטחה פיזית נוספים
מקורות:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (בקרות הרשאה)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (אבטחת רשת)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (מניעת התקפת משרתת רעה)

### אילו ספקי תשתית אתם משתמשים בהם {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email משתמשת במספר מעבדי משנה לתשתית עם תעודות תאימות מקיפות.

פרטים מלאים זמינים בדף התאימות שלנו ל-GDPR: <https://forwardemail.net/gdpr>

**מעבדי משנה עיקריים לתשתית:**

| ספק              | מוסמך במסגרת פרטיות נתונים | דף תאימות GDPR                                                                         |
| ---------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ כן                       | <https://www.cloudflare.com/trust-hub/gdpr/>                                           |
| **DataPacket**   | ❌ לא                       | <https://www.datapacket.com/privacy-policy>                                            |
| **DigitalOcean** | ❌ לא                       | <https://www.digitalocean.com/legal/gdpr>                                              |
| **GitHub**       | ✅ כן                       | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ לא                       | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                        |

**תעודות מפורטות:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (נבדק על ידי Schellman & Company LLC)
* מוסמך ISO 27001 במספר מרכזי נתונים
* תואם PCI-DSS
* מוסמך CSA STAR Level 1
* מוסמך APEC CBPR PRP
* פרטים: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* מוסמך SOC 2+ (HIPAA)
* תואם PCI Merchant
* מוסמך CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* פרטים: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* תואם SOC 2 (יש לפנות ישירות ל-DataPacket לקבלת תעודה)
* תשתית ברמת ארגון (מיקום דנבר)
* הגנה מפני DDoS באמצעות ערימת אבטחת מידע Shield
* תמיכה טכנית 24/7
* רשת גלובלית ב-58 מרכזי נתונים
* פרטים: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* מוסמך במסגרת פרטיות נתונים (EU-U.S., Swiss-U.S., ו-UK Extension)
* אירוח קוד מקור, CI/CD, וניהול פרויקטים
* הסכם הגנת נתונים של GitHub זמין
* פרטים: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**מעבדי תשלום:**

* **Stripe**: מוסמך במסגרת פרטיות נתונים - <https://stripe.com/legal/privacy-center>
* **PayPal**: לא מוסמך DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### האם אתם מציעים הסכם עיבוד נתונים (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

כן, Forward Email מציעה הסכם עיבוד נתונים (DPA) מקיף שניתן לחתום עליו במסגרת הסכם הארגוני שלנו. עותק של ה-DPA שלנו זמין בכתובת: <https://forwardemail.net/dpa>

**פרטי ה-DPA:**

* מכסה תאימות ל-GDPR ולמסגרות EU-US/Swiss-US Privacy Shield
* מתקבל אוטומטית עם הסכמתכם לתנאי השירות שלנו
* אין צורך בחתימה נפרדת עבור DPA סטנדרטי
* הסדרי DPA מותאמים זמינים דרך רישיון ארגוני

**מסגרת תאימות GDPR:**
ה-DPA שלנו מפרט את התאימות ל-GDPR וכן את דרישות העברת הנתונים הבינלאומיות. מידע מלא זמין בכתובת: <https://forwardemail.net/gdpr>

ללקוחות ארגוניים הזקוקים לתנאי DPA מותאמים או להסדרים חוזיים ספציפיים, ניתן לטפל בכך דרך תוכנית **רישיון ארגוני (250$/חודש)** שלנו.

### כיצד אתם מטפלים בהודעות על פרצות אבטחה {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> ארכיטקטורת הידע האפסית של Forward Email מגבילה משמעותית את השפעת הפרצה.
* **חשיפת נתונים מוגבלת**: אין גישה לתוכן דואר אלקטרוני מוצפן עקב ארכיטקטורת אפס-ידע  
* **איסוף נתונים מינימלי**: רק מידע בסיסי על המנוי ורישומי IP מוגבלים לצרכי אבטחה  
* **מסגרות תת-מעבדים**: DigitalOcean, GitHub ו-Vultr מנהלים נהלי תגובה לאירועים התואמים ל-GDPR  

**מידע על נציג GDPR:**  
Forward Email מינה נציגי GDPR בהתאם לסעיף 27:  

**נציג האיחוד האירופי:**  
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0  

**נציג בריטניה:**  
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF  

ללקוחות ארגוניים הזקוקים ל-SLA ספציפיים להודעת הפרות, יש לדון בכך כחלק מהסכם **רישיון ארגוני**.  

מקורות:  

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>  
* <https://forwardemail.net/gdpr>  

### האם אתם מציעים סביבת בדיקה {#do-you-offer-a-test-environment}  

התיעוד הטכני של Forward Email אינו מתאר במפורש מצב סנדבוקס ייעודי. עם זאת, גישות בדיקה אפשריות כוללות:  

* **אפשרות אירוח עצמי**: יכולות אירוח עצמי מקיפות ליצירת סביבות בדיקה  
* **ממשק API**: פוטנציאל לבדיקות תכנותיות של תצורות  
* **קוד פתוח**: קוד פתוח ב-100% מאפשר ללקוחות לבחון את לוגיקת ההעברה  
* **ריבוי דומיינים**: תמיכה בריבוי דומיינים עשויה לאפשר יצירת דומיין בדיקה  

ללקוחות ארגוניים הזקוקים ליכולות סנדבוקס פורמליות, יש לדון בכך כחלק מהסדר **רישיון ארגוני**.  

מקור: <https://github.com/forwardemail/forwardemail.net> (פרטי סביבת פיתוח)  

### האם אתם מספקים כלי ניטור והתראות {#do-you-provide-monitoring-and-alerting-tools}  

Forward Email מספק ניטור בזמן אמת עם מגבלות מסוימות:  

**זמין:**  

* **ניטור מסירה בזמן אמת**: מדדי ביצועים גלויים לציבור עבור ספקי דואר אלקטרוני מרכזיים  
* **התראות אוטומטיות**: צוות ההנדסה מקבל התראה כאשר זמני המסירה חורגים מ-10 שניות  
* **ניטור שקוף**: מערכות ניטור בקוד פתוח ב-100%  
* **ניטור תשתיות**: זיהוי חריגות אוטומטי ורישום ביקורת מקיף  

**מגבלות:**  

* אינטגרציות webhook או התראות סטטוס מסירה מבוססות API ללקוחות אינן מתועדות במפורש  

ללקוחות ארגוניים הזקוקים ל-webhooks מפורטים לסטטוס מסירה או אינטגרציות ניטור מותאמות, ייתכן שיכולות אלו זמינות במסגרת הסדרי **רישיון ארגוני**.  

מקורות:  

* <https://forwardemail.net> (תצוגת ניטור בזמן אמת)  
* <https://github.com/forwardemail/forwardemail.net> (מימוש ניטור)  

### כיצד אתם מבטיחים זמינות גבוהה {#how-do-you-ensure-high-availability}  

> \[!IMPORTANT]  
> Forward Email מיישם רדונדנס מקיף על פני מספר ספקי תשתית.  

* **תשתית מבוזרת**: מספר ספקים (DigitalOcean, Vultr, DataPacket) באזורים גאוגרפיים שונים  
* **איזון עומסים גאוגרפי**: איזון עומסים מבוסס Cloudflare עם מיקום גאוגרפי וכשל אוטומטי  
* **קנה מידה אוטומטי**: התאמת משאבים דינמית בהתאם לביקוש  
* **הגנה רב-שכבתית מפני DDoS**: באמצעות מערכת Shield של DataPacket ו-Cloudflare  
* **רדונדנס של שרתים**: מספר שרתים לכל אזור עם כשל אוטומטי  
* **שכפול מסדי נתונים**: סינכרון נתונים בזמן אמת בין מיקומים מרובים  
* **ניטור והתראות**: ניטור 24/7 עם תגובה אוטומטית לאירועים  

**התחייבות לזמינות**: זמינות שירות של 99.9%+ עם ניטור שקוף זמין ב-<https://forwardemail.net>  

מקורות:  

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>  
* <https://www.datapacket.com/datacenters/denver>  

### האם אתם עומדים בדרישות סעיף 889 של חוק הסמכת ההגנה הלאומית (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}  

> \[!IMPORTANT]  
> Forward Email עומד במלואו בדרישות סעיף 889 באמצעות בחירה זהירה של שותפי תשתית.  

כן, Forward Email הוא **תואם לסעיף 889**. סעיף 889 של חוק הסמכת ההגנה הלאומית (NDAA) אוסר על סוכנויות ממשלתיות להשתמש או להתקשר עם גופים המשתמשים בציוד תקשורת ומעקב וידאו מחברות מסוימות (Huawei, ZTE, Hikvision, Dahua, ו-Hytera).
**כיצד Forward Email משיגה תאימות לסעיף 889:**

Forward Email מסתמכת בלעדית על שני ספקי תשתית מרכזיים, שאף אחד מהם אינו משתמש בציוד האסור לפי סעיף 889:

1. **Cloudflare**: השותף הראשי שלנו לשירותי רשת ואבטחת דואר אלקטרוני  
2. **DataPacket**: הספק הראשי שלנו לתשתית שרתים (המשתמש אך ורק בציוד של Arista Networks ו-Cisco)  
3. **ספקי גיבוי**: ספקי הגיבוי שלנו Digital Ocean ו-Vultr מאושרים בנוסף בכתב ככפופים לסעיף 889.

**התחייבות Cloudflare**: Cloudflare מצהירה במפורש בקוד ההתנהגות שלה כלפי צדדים שלישיים כי אינה משתמשת בציוד תקשורת, מוצרי פיקוח וידאו או שירותים של ישויות האסורות לפי סעיף 889.

**מקרה שימוש ממשלתי**: תאימותנו לסעיף 889 אושרה כאשר **האקדמיה הימית של ארה"ב** בחרה ב-Forward Email לצרכי העברת דואר אלקטרוני מאובטחת, ודורשת תיעוד של תקני התאימות הפדרליים שלנו.

לפרטים מלאים על מסגרת התאימות הממשלתית שלנו, כולל תקנות פדרליות רחבות יותר, קראו את מחקר המקרה המקיף שלנו: [שירות דואר אלקטרוני ממשלתי פדרלי תואם סעיף 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## פרטי מערכת וטכניים {#system-and-technical-details}

### האם אתם מאחסנים מיילים ותוכנם {#do-you-store-emails-and-their-contents}

לא, איננו כותבים לדיסק או מאחסנים לוגים – למעט [שגיאות](#do-you-store-error-logs) ו-[SMTP יוצא](#do-you-support-sending-email-with-smtp) (ראו את [מדיניות הפרטיות שלנו](/privacy)).

הכל מתבצע בזיכרון ו-[קוד המקור שלנו ב-GitHub](https://github.com/forwardemail).

### כיצד פועל מערכת העברת הדואר האלקטרוני שלכם {#how-does-your-email-forwarding-system-work}

דואר אלקטרוני מתבסס על [פרוטוקול SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). פרוטוקול זה מורכב מפקודות שנשלחות לשרת (שברוב המקרים פועל על פורט 25). יש חיבור ראשוני, לאחריו השולח מציין מי השולח ("MAIL FROM"), אחר כך לאן הדואר מיועד ("RCPT TO"), ולבסוף את הכותרות וגוף המייל עצמו ("DATA"). זרימת מערכת העברת הדואר שלנו מתוארת ביחס לכל פקודת SMTP להלן:

* חיבור ראשוני (ללא שם פקודה, לדוגמה `telnet example.com 25`) - זהו החיבור הראשוני. אנו בודקים שולחים שאינם ברשימת ההרשאה שלנו [allowlist](#do-you-have-an-allowlist) מול רשימת הדחייה שלנו [denylist](#do-you-have-a-denylist). לבסוף, אם שולח אינו ברשימת ההרשאה, אנו בודקים אם הוא נמצא ב-[greylist](#do-you-have-a-greylist).

* `HELO` - מציין ברכה לזיהוי שם המארח המלא (FQDN), כתובת ה-IP או שם מטפל הדואר של השולח. ערך זה יכול להיות מזויף, לכן איננו מסתמכים עליו ומשתמשים במקום זאת בחיפוש הפוך של שם המארח לפי כתובת ה-IP של החיבור.

* `MAIL FROM` - מציין את כתובת השולח במעטפה של המייל. אם מוזן ערך, הוא חייב להיות כתובת דואר אלקטרוני תקנית לפי RFC 5322. ערכים ריקים מותרים. אנו [בודקים כאן עבור backscatter](#how-do-you-protect-against-backscatter), וגם בודקים את MAIL FROM מול רשימת הדחייה שלנו [denylist](#do-you-have-a-denylist). לבסוף, אנו בודקים שולחים שאינם ברשימת ההרשאה עבור הגבלת קצב (ראו את הסעיף על [הגבלת קצב](#do-you-have-rate-limiting) ו-[רשימת ההרשאה](#do-you-have-an-allowlist) למידע נוסף).

* `RCPT TO` - מציין את הנמען/ים של המייל. אלו חייבים להיות כתובות דואר אלקטרוני תקניות לפי RFC 5322. אנו מאפשרים עד 50 נמענים במעטפה לכל הודעה (זה שונה מכותרת "To" במייל). אנו גם בודקים כאן כתובת תקינה של [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") להגנה מפני זיופים עם שם הדומיין של SRS שלנו.

* `DATA` - זהו החלק המרכזי בשירות שלנו שמעבד מייל. ראו את הסעיף [כיצד אתם מעבדים מייל להעברה](#how-do-you-process-an-email-for-forwarding) למידע נוסף.
### איך אתם מעבדים אימייל להעברה {#how-do-you-process-an-email-for-forwarding}

קטע זה מתאר את התהליך שלנו הקשור לפקודת פרוטוקול SMTP `DATA` בקטע [איך מערכת העברת האימיילים שלכם עובדת](#how-does-your-email-forwarding-system-work) למעלה – זה איך אנו מעבדים את הכותרות, גוף ההודעה, האבטחה, קובעים לאן יש להעביר את ההודעה, ואיך אנו מטפלים בחיבורים.

1. אם ההודעה חורגת מהגודל המקסימלי של 50 מגה-בייט, היא נדחית עם קוד שגיאה 552.

2. אם ההודעה לא כללה כותרת "From", או אם כל אחד מהערכים בכותרת "From" לא היו כתובות אימייל תקניות לפי RFC 5322, היא נדחית עם קוד שגיאה 550.

3. אם ההודעה כללה יותר מ-25 כותרות "Received", נקבע שהיא נתקעה בלולאת הפניה, והיא נדחית עם קוד שגיאה 550.

4. באמצעות טביעת האצבע של האימייל (ראה הקטע על [טביעת אצבע](#how-do-you-determine-an-email-fingerprint)), נבדוק אם ההודעה נשלחה מחדש יותר מ-5 ימים (מה שמתאים להתנהגות ברירת המחדל של postfix [default postfix behavior](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), ואם כן, היא תידחה עם קוד שגיאה 550.

5. אנו מאחסנים בזיכרון את התוצאות מסריקת האימייל באמצעות [Spam Scanner](https://spamscanner.net).

6. אם היו תוצאות כלשהן מסריקות Spam Scanner, ההודעה נדחית עם קוד שגיאה 554. תוצאות אלו כוללות רק את מבחן GTUBE בזמן כתיבת שורות אלו. ראו <https://spamassassin.apache.org/gtube/> למידע נוסף.

7. נוסיף את הכותרות הבאות להודעה לצורך איתור באגים ומניעת שימוש לרעה:

   * `Received` - נוסיף את כותרת Received הסטנדרטית עם כתובת ה-IP ומארח המקור, סוג ההעברה, מידע על חיבור TLS, תאריך/שעה, ונמען.
   * `X-Original-To` - הנמען המקורי של ההודעה:
     * זה שימושי לקביעת היכן האימייל נמסר במקור (בנוסף לכותרת "Received").
     * נוסף על בסיס כל נמען בזמן IMAP ו/או העברה מוסווית (כדי להגן על הפרטיות).
   * `X-Forward-Email-Website` - מכיל קישור לאתר שלנו בכתובת <https://forwardemail.net>
   * `X-Forward-Email-Version` - גרסת [SemVer](https://semver.org/) הנוכחית מתוך `package.json` של קוד המקור שלנו.
   * `X-Forward-Email-Session-ID` - ערך מזהה סשן המשמש לצורכי איתור באגים (חל רק בסביבות לא ייצור).
   * `X-Forward-Email-Sender` - רשימה מופרדת בפסיקים הכוללת את כתובת MAIL FROM המקורית (אם לא הייתה ריקה), את שם המארח ההפוך PTR של הלקוח (אם קיים), ואת כתובת ה-IP של השולח.
   * `X-Forward-Email-ID` - חל רק על SMTP יוצא ומתאים למזהה האימייל המאוחסן ב-My Account → Emails
   * `X-Report-Abuse` - עם הערך `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - עם הערך `abuse@forwardemail.net`.
   * `X-Complaints-To` - עם הערך `abuse@forwardemail.net`.

8. לאחר מכן נבדוק את ההודעה עבור [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), ו-[DMARC](https://en.wikipedia.org/wiki/DMARC).

   * אם ההודעה נכשלה ב-DMARC והדומיין כלל מדיניות דחייה (למשל `p=reject` [הייתה במדיניות DMARC](https://wikipedia.org/wiki/DMARC)), היא נדחית עם קוד שגיאה 550. בדרך כלל מדיניות DMARC לדומיין נמצאת ברשומת <strong class="notranslate">TXT</strong> של תת-הדומיין `_dmarc` (למשל `dig _dmarc.example.com txt`).
   * אם ההודעה נכשלה ב-SPF והדומיין כלל מדיניות כישלון מוחלט (למשל `-all` במדיניות SPF במקום `~all` או ללא מדיניות כלל), היא נדחית עם קוד שגיאה 550. בדרך כלל מדיניות SPF לדומיין נמצאת ברשומת <strong class="notranslate">TXT</strong> של הדומיין הראשי (למשל `dig example.com txt`). ראו קטע זה למידע נוסף על [שליחת דואר בשם Gmail](#can-i-send-mail-as-in-gmail-with-this) בנוגע ל-SPF.
9. כעת אנו מעבדים את הנמענים של ההודעה כפי שנאספו מפקודת `RCPT TO` בסעיף [איך מערכת ההעברה של האימייל שלך עובדת](#how-does-your-email-forwarding-system-work) למעלה. עבור כל נממען, אנו מבצעים את הפעולות הבאות:

   * אנו מחפשים את רשומות <strong class="notranslate">TXT</strong> של שם הדומיין (החלק אחרי הסימן `@`, לדוגמה `example.com` אם כתובת האימייל הייתה `test@example.com`). לדוגמה, אם הדומיין הוא `example.com` אנו מבצעים חיפוש DNS כמו `dig example.com txt`.
   * אנו מנתחים את כל רשומות ה-<strong class="notranslate">TXT</strong> שמתחילות ב-`forward-email=` (תוכניות חינמיות) או `forward-email-site-verification=` (תוכניות בתשלום). שים לב שאנו מנתחים את שתיהן, כדי לעבד אימיילים בזמן שמשתמש משדרג או מוריד תוכניות.
   * מתוך רשומות ה-<strong class="notranslate">TXT</strong> המנותחות, אנו עוברים עליהן כדי לחלץ את תצורת ההעברה (כמתואר בסעיף [איך להתחיל ולהגדיר העברת אימייל](#how-do-i-get-started-and-set-up-email-forwarding) למעלה). שים לב שאנו תומכים רק בערך אחד של `forward-email-site-verification=`, ואם מסופקים יותר מאחד, תתרחש שגיאת 550 והשולח יקבל החזרה עבור נמען זה.
   * באופן רקורסיבי אנו עוברים על תצורת ההעברה שחולצה כדי לקבוע העברה גלובלית, העברה מבוססת ביטויים רגולריים, וכל תצורות ההעברה הנתמכות האחרות – שהן כעת ידועות כ"כתובות העברה" שלנו.
   * עבור כל כתובת העברה, אנו תומכים בחיפוש רקורסיבי אחד (שיתחיל את סדרת הפעולות הזו מחדש על הכתובת הנתונה). אם נמצא התאמה רקורסיבית, אז התוצאה ההורה תוסר מכתובות ההעברה, והילדים יתווספו.
   * כתובות ההעברה מנותחות לייחודיות (כיוון שאיננו רוצים לשלוח כפילויות לכתובת אחת או ליצור חיבורים מיותרים של לקוח SMTP).
   * עבור כל כתובת העברה, אנו מחפשים את שם הדומיין שלה מול נקודת הקצה של ה-API שלנו `/v1/max-forwarded-addresses` (כדי לקבוע לכמה כתובות הדומיין מורשה להעביר אימייל לכל כינוי, לדוגמה 10 כברירת מחדל – ראה את הסעיף על [מגבלה מקסימלית על העברה לכל כינוי](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). אם מגבלה זו מופרזת, תתרחש שגיאת 550 והשולח יקבל החזרה עבור נמען זה.
   * אנו מחפשים את ההגדרות של הנמען המקורי מול נקודת הקצה של ה-API שלנו `/v1/settings`, התומכת בחיפוש עבור משתמשים בתשלום (עם גיבוי למשתמשים חינמיים). זה מחזיר אובייקט תצורה עבור הגדרות מתקדמות של `port` (מספר, לדוגמה `25`), `has_adult_content_protection` (בוליאני), `has_phishing_protection` (בוליאני), `has_executable_protection` (בוליאני), ו-`has_virus_protection` (בוליאני).
   * בהתבסס על הגדרות אלו, אנו בודקים את תוצאות סורק הספאם ואם מתרחשות שגיאות, ההודעה נדחית עם קוד שגיאה 554 (לדוגמה אם `has_virus_protection` מופעל, נבדוק את תוצאות סורק הספאם עבור וירוסים). שים לב שכל משתמשי התוכנית החינמית יהיו רשומים לבדיקה נגד תוכן למבוגרים, פישינג, קבצים ניתנים להרצה ווירוסים. כברירת מחדל, כל משתמשי התוכנית בתשלום רשומים גם כן, אך תצורה זו ניתנת לשינוי בדף ההגדרות של דומיין בלוח הבקרה של Forward Email).

10. עבור כל כתובות ההעברה של כל נמען שעובד, אנו מבצעים את הפעולות הבאות:

    * הכתובת נבדקת מול [רשימת הדחייה](#do-you-have-a-denylist), ואם היא מופיעה שם, תתרחש שגיאת 421 (מציין לשולח לנסות שוב מאוחר יותר).
    * אם הכתובת היא webhook, אנו מגדירים בוליאני עבור פעולות עתידיות (ראה למטה – אנו מקבצים יחד webhooks דומים כדי לבצע בקשת POST אחת במקום מספר בקשות למשלוח).
    * אם הכתובת היא כתובת אימייל, אנו מנתחים את המארח עבור פעולות עתידיות (ראה למטה – אנו מקבצים יחד מארחים דומים כדי לבצע חיבור אחד במקום מספר חיבורים נפרדים למשלוח).
11. אם אין נמענים ואין החזרות, אז אנו מגיבים עם שגיאת 550 של "נמענים לא חוקיים".

12. אם יש נמענים, אז אנו עוברים עליהם (מקובצים יחד לפי אותו מארח) ומספקים את המיילים. ראה את הסעיף [כיצד אתם מטפלים בבעיות מסירת דואר אלקטרוני](#how-do-you-handle-email-delivery-issues) למטה לקבלת תובנות נוספות.

    * אם מתרחשות שגיאות בעת שליחת המיילים, אז נשמור אותן בזיכרון לעיבוד מאוחר יותר.
    * ניקח את קוד השגיאה הנמוך ביותר (אם יש) משיגור המיילים – ונשתמש בו כקוד התגובה לפקודת `DATA`. משמעות הדבר היא שמיילים שלא נמסרו ינסו להישלח שוב בדרך כלל על ידי השולח המקורי, בעוד שמיילים שכבר נמסרו לא יישלחו שוב בפעם הבאה שההודעה תישלח (כיוון שאנו משתמשים ב-[Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * אם לא התרחשה אף שגיאה, אז נשלח קוד סטטוס SMTP 250 מוצלח.
    * החזרה (bounce) מוגדרת כהחזרת מסירה כלשהי שגורמת לקוד סטטוס שהוא >= 500 (כשלונות קבועים).

13. אם לא התרחשה החזרה (כשלונות קבועים), אז נחזיר קוד סטטוס SMTP של קוד השגיאה הנמוך ביותר מכשלונות לא קבועים (או קוד סטטוס 250 מוצלח אם לא היו כאלה).

14. אם התרחשה החזרה, אז נשלח מיילי החזרה ברקע לאחר החזרת הקוד הנמוך ביותר מכל קודי השגיאה לשולח. עם זאת, אם קוד השגיאה הנמוך ביותר הוא >= 500, אז לא נשלח מיילי החזרה. זאת מכיוון שאם היינו עושים זאת, השולחים היו מקבלים מייל החזרה כפול (למשל אחד מ-MTA היוצא שלהם, כמו Gmail – וגם אחד מאיתנו). ראה את הסעיף על [כיצד אתם מגנים מפני backscatter](#how-do-you-protect-against-backscatter) למטה לקבלת תובנות נוספות.

### כיצד אתם מטפלים בבעיות מסירת דואר אלקטרוני {#how-do-you-handle-email-delivery-issues}

שים לב שנבצע "Friendly-From" רק אם מדיניות DMARC של השולח לא עברה ו- DKIM לא היה מיושר עם כותרת "From". משמעות הדבר היא שנשנה את כותרת "From" בהודעה, נגדיר "X-Original-From", ונגדיר גם "Reply-To" אם לא היה מוגדר כבר. כמו כן, נסגור מחדש את חותם ARC על ההודעה לאחר שינוי הכותרות הללו.

אנו גם משתמשים בניתוח חכם של הודעות שגיאה בכל רמות המערכת שלנו – בקוד שלנו, בבקשות DNS, פנימיות Node.js, בקשות HTTP (למשל 408, 413, ו-429 ממופים לקוד תגובת SMTP 421 אם הנמען הוא webhook), ותשובות שרת הדואר (למשל תגובות עם "defer" או "slowdown" ינסו שוב כ-421).

הלוגיקה שלנו פשוטה מאוד והיא גם תנסה שוב במקרה של שגיאות SSL/TLS, בעיות חיבור ועוד. המטרה היא למקסם את המסירה לכל הנמענים עבור תצורת העברה.

אם הנמען הוא webhook, אז נאפשר זמן המתנה של 60 שניות לסיום הבקשה עם עד 3 ניסיונות חוזרים (סה"כ 4 בקשות לפני כישלון). שים לב שאנו מפענחים נכון את קודי השגיאה 408, 413, ו-429 וממפים אותם לקוד תגובת SMTP 421.

אחרת, אם הנמען הוא כתובת דואר אלקטרוני, ננסה לשלוח את המייל עם TLS אופורטוניסטי (ננסה להשתמש ב-STARTTLS אם זמין בשרת הדואר של הנמען). אם מתרחשת שגיאת SSL/TLS בעת ניסיון השליחה, ננסה לשלוח את המייל ללא TLS (ללא שימוש ב-STARTTLS).

אם מתרחשות שגיאות DNS או חיבור, נחזיר לפקודת `DATA` קוד תגובת SMTP 421, אחרת אם יש שגיאות ברמה >= 500, יישלחו החזרות.

אם נגלה ששרת דואר שאנו מנסים לספק אליו חוסם אחד או יותר מכתובות ה-IP של שרתי הדואר שלנו (למשל באמצעות טכנולוגיה כלשהי למניעת ספאם), נשלח קוד תגובת SMTP 421 לשולח כדי שינסה שוב מאוחר יותר (ואנו נקבל התראה על הבעיה כדי שנוכל לנסות לפתור אותה לפני הניסיון הבא).

### כיצד אתם מטפלים בכתובות ה-IP שלכם כאשר הן נחסמות {#how-do-you-handle-your-ip-addresses-becoming-blocked}
אנו עוקבים באופן שגרתי אחרי כל רשימות הסירוב המרכזיות של DNS ואם כתובות ה-IP של שרתי החלפת הדואר ("MX") שלנו מופיעות ברשימת סירוב מרכזית, נסיר אותן מרשומת ה-DNS A הרלוונטית בסיבוב אם אפשרי עד שהבעיה תיפתר.

בעת כתיבת שורות אלו, אנו מופיעים גם בכמה רשימות אישור DNS, ואנו מתייחסים ברצינות למעקב אחרי רשימות סירוב. אם אתם מבחינים בבעיות לפני שנוכל לפתור אותן, אנא הודיעו לנו בכתב בכתובת <support@forwardemail.net>.

כתובות ה-IP שלנו זמינות לציבור, [ראו את הסעיף הזה למטה לקבלת תובנות נוספות](#what-are-your-servers-ip-addresses).

### מהן כתובות הפוסטמאסטר {#what-are-postmaster-addresses}

כדי למנוע החזרות שגויות ושליחת הודעות מענה חופשה לתיבות דואר לא מנוטרות או לא קיימות, אנו מתחזקים רשימה של שמות משתמש בסגנון mailer-daemon:

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
* [וכל כתובת no-reply](#what-are-no-reply-addresses)

ראו [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) לקבלת תובנות נוספות על האופן שבו רשימות כאלה משמשות ליצירת מערכות דואר אלקטרוני יעילות.

### מהן כתובות no-reply {#what-are-no-reply-addresses}

שמות משתמש בדואר אלקטרוני השווים לאחד מהבאים (בלי תלות באותיות גדולות או קטנות) נחשבים לכתובות no-reply:

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

רשימה זו מתוחזקת [כפרויקט קוד פתוח ב-GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### מהן כתובות ה-IP של השרת שלך {#what-are-your-servers-ip-addresses}

אנו מפרסמים את כתובות ה-IP שלנו בכתובת <https://forwardemail.net/ips>.

### האם יש לכם רשימת אישור {#do-you-have-an-allowlist}

כן, יש לנו [רשימת סיומות שמות דומיין](#what-domain-name-extensions-are-allowlisted-by-default) שמאושרות כברירת מחדל ורשימת אישור דינמית, מטמון ומסתובבת המבוססת על [קריטריונים מחמירים](#what-is-your-allowlist-criteria).

כל הדומיינים, האימיילים וכתובות ה-IP של לקוחות משלמים נבדקים אוטומטית מול רשימת הסירוב שלנו כל שעה – מה שמתריע למנהלים שיכולים להתערב ידנית במידת הצורך.

בנוסף, אם אחד מהדומיינים שלך או כתובות האימייל שלו מופיעים ברשימת סירוב (למשל בשל שליחת ספאם, וירוסים או עקב התקפות התחזות) – מנהלי הדומיין (אתה) ומנהלי הצוות שלנו יקבלו הודעה בדואר אלקטרוני מידית. אנו ממליצים בחום שתגדיר [DMARC](#how-do-i-set-up-dmarc-for-forward-email) כדי למנוע זאת.

### אילו סיומות שמות דומיין מאושרות כברירת מחדל {#what-domain-name-extensions-are-allowlisted-by-default}

סיומות שמות הדומיין הבאות נחשבות לאושרו כברירת מחדל (לא משנה אם הן ברשימת הפופולריות של Umbrella או לא):

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
בנוסף, [תחומי על ברנדיים ותאגידיים](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) אלו מותרים כברירת מחדל (למשל `apple` עבור `applecard.apple` עבור דפי חשבון בנק של Apple Card):

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
נכון ל-18 במרץ 2025 הוספנו גם את הטריטוריות הצרפתיות שמעבר לים לרשימה זו ([לפי בקשת GitHub זו](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

נכון ל-8 ביולי 2025 הוספנו את המדינות הספציפיות לאירופה הבאות:

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

באוקטובר 2025 הוספנו גם את <code class="notranslate">cz</code> (הרפובליקה הצ'כית) בעקבות ביקוש.

לא כללנו במפורש את `ru` ו-`ua` עקב פעילות ספאם גבוהה.

### מה הקריטריונים שלך לרשימת ההרשאות {#what-is-your-allowlist-criteria}

יש לנו רשימה סטטית של [סיומות שמות דומיין שמורשות כברירת מחדל](#what-domain-name-extensions-are-allowlisted-by-default) – ואנחנו גם מתחזקים רשימת הרשאות דינמית, מטמון מתגלגל, המבוססת על הקריטריונים המחמירים הבאים:

* דומיין השולח הראשי חייב להיות של [סיומת שם דומיין התואמת לרשימה שאנו מציעים בתוכנית החינמית שלנו](#what-domain-name-extensions-can-be-used-for-free) (עם התוספת של `biz` ו-`info`). אנו כוללים גם התאמות חלקיות ל-`edu`, `gov`, ו-`mil`, כגון `xyz.gov.au` ו-`xyz.edu.au`.
* דומיין השולח הראשי חייב להיות בין 100,000 הדומיינים הראשיים הייחודיים המובילים לפי תוצאות מנותחות מרשימת הפופולריות של [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* דומיין השולח הראשי חייב להיות בין 50,000 התוצאות המובילות של דומיינים ראשיים ייחודיים המופיעים לפחות ב-4 מתוך 7 הימים האחרונים של UPL (~50%+).
* דומיין השולח הראשי לא חייב להיות [מסווג](https://radar.cloudflare.com/categorization-feedback/) כתוכן למבוגרים או תוכנת זדון על ידי Cloudflare.
* לדומיין השולח הראשי חייבים להיות רשומות A או MX מוגדרות.
* לדומיין השולח הראשי חייבות להיות לפחות אחת מהרשומות הבאות: רשומת A, רשומת MX, רשומת DMARC עם `p=reject` או `p=quarantine`, או רשומת SPF עם מאפיין `-all` או `~all`.

אם הקריטריונים הללו מתקיימים, דומיין השולח הראשי יישמר במטמון למשך 7 ימים. שים לב שהמשימה האוטומטית שלנו רצה מדי יום – לכן זוהי רשימת הרשאות מתגלגלת שמתעדכנת מדי יום.

המשימה האוטומטית שלנו תוריד את 7 הימים הקודמים של UPL בזיכרון, תחלץ אותם, ואז תנתח בזיכרון לפי הקריטריונים המחמירים שלמעלה.

דומיינים פופולריים בזמן כתיבת שורות אלו כגון Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, ועוד – כלולים כמובן.
אם אתה שולח שאינו ברשימת ההרשאה שלנו, אז בפעם הראשונה ששם הדומיין המלא (FQDN) או כתובת ה-IP שלך ישלחו אימייל, תיחסם [rate limited](#do-you-have-rate-limiting) ו-[greylisted](#do-you-have-a-greylist). שים לב שזו פרקטיקה סטנדרטית שהתקבלה כתקן אימייל. רוב לקוחות שרתי האימייל ינסו לשלוח מחדש אם הם מקבלים שגיאת הגבלת קצב או רשימת אפור (למשל קוד סטטוס שגיאה 421 או ברמת 4xx).

**שים לב כי שולחים ספציפיים כגון `a@gmail.com`, `b@xyz.edu`, ו-`c@gov.au` עדיין יכולים להיות [denylisted](#do-you-have-a-denylist)** (למשל אם אנו מזהים אוטומטית ספאם, פישינג או תוכנות זדוניות מהשולחים הללו).

### אילו סיומות שמות דומיין ניתן להשתמש בחינם {#what-domain-name-extensions-can-be-used-for-free}

מיום 31 במרץ 2023 אכפנו כלל ספאם כולל חדש כדי להגן על המשתמשים והשירות שלנו.

הכלל החדש מאפשר שימוש רק בסיומות שמות הדומיין הבאות בתכנית החינמית שלנו:

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
### האם יש לכם רשימת אפור {#do-you-have-a-greylist}

כן, יש לנו מדיניות [רשימת אפור למיילים](https://en.wikipedia.org/wiki/Greylisting_\(email\)) מאוד רפה. רשימת האפור חלה רק על שולחים שאינם ברשימת ההרשאה שלנו ונשמרת במטמון שלנו למשך 30 יום.

לכל שולח חדש, אנו מאחסנים מפתח במסד הנתונים Redis שלנו למשך 30 יום עם ערך שמוגדר לזמן ההגעה הראשוני של הבקשה הראשונה שלו. לאחר מכן אנו דוחים את המייל שלו עם קוד סטטוס retry 450 ומאפשרים לו לעבור רק לאחר שעברו 5 דקות.

אם הוא המתין בהצלחה 5 דקות מזמן ההגעה הראשוני הזה, אז המיילים שלו יתקבלו ולא יקבלו את קוד הסטטוס 450 הזה.

המפתח מורכב או מדומיין השורש המלא (FQDN) או מכתובת ה-IP של השולח. משמעות הדבר היא שכל תת-דומיין שעובר את רשימת האפור גם יעבור עבור דומיין השורש, ולהפך (זו המשמעות של מדיניות "רפה מאוד").

לדוגמה, אם מייל מגיע מ-`test.example.com` לפני שנראה מייל מ-`example.com`, אז כל מייל מ-`test.example.com` ו/או `example.com` יצטרך להמתין 5 דקות מזמן ההגעה הראשוני של החיבור. איננו גורמים ל-`test.example.com` ו-`example.com` להמתין כל אחד את תקופת 5 הדקות שלו (מדיניות רשימת האפור שלנו חלה ברמת דומיין השורש).

שימו לב שרשימת האפור אינה חלה על שולחים שנמצאים ברשימת ההרשאה שלנו [allowlist](#do-you-have-an-allowlist) (למשל Meta, Amazon, Netflix, Google, Microsoft בזמן כתיבת שורות אלו).

### האם יש לכם רשימת חסימה {#do-you-have-a-denylist}

כן, אנו מפעילים רשימת חסימה משלנו ומעדכנים אותה אוטומטית בזמן אמת ובאופן ידני בהתבסס על פעילות ספאם ופעילות זדונית שזוהתה.

אנו גם מושכים את כל כתובות ה-IP מרשימת החסימה UCEPROTECT Level 1 בכתובת <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> כל שעה ומזינים אותה לרשימת החסימה שלנו עם תוקף של 7 ימים.

שולחים שנמצאים ברשימת החסימה יקבלו קוד שגיאה 421 (מציין לשולח לנסות שוב מאוחר יותר) אם הם [אינם ברשימת ההרשאה](#do-you-have-an-allowlist).

על ידי שימוש בקוד סטטוס 421 במקום 554, ניתן להפחית חיובים שגויים פוטנציאליים בזמן אמת ואז ההודעה יכולה להימסר בהצלחה בניסיון הבא.

**זה מתוכנן שונה משירותי דואר אחרים**, שבהם אם אתה נמצא ברשימת חסימה, מתרחשת תקלה קשה וקבועה. לעיתים קשה לבקש מהשולחים לנסות שוב הודעות (במיוחד מארגונים גדולים), ולכן גישה זו נותנת בערך 5 ימים מהניסיון הראשוני של המייל לשולח, לנמען או לנו להתערב ולהקל על הבעיה (על ידי בקשת הסרת חסימה).

כל בקשות הסרת חסימה מנוטרות בזמן אמת על ידי מנהלים (למשל כדי שחיובים שגויים חוזרים יוכלו להיות מורשים לצמיתות על ידי מנהלים).

בקשות להסרת חסימה ניתן לבקש בכתובת <https://forwardemail.net/denylist>. משתמשים בתשלום מקבלים את בקשות ההסרה שלהם מעובדות מיידית, בעוד שמשתמשים ללא תשלום צריכים להמתין שמנהלים יעבדו את בקשתם.

שולחים שזוהו כמשדרים ספאם או תוכן וירוס יתווספו לרשימת החסימה בגישה הבאה:

1. ה-[טביעת האצבע הראשונית של ההודעה](#how-do-you-determine-an-email-fingerprint) מוכנסת לרשימת האפור עם זיהוי ספאם או חסימה מרשימת חסימה של שולח "מהימן" (למשל `gmail.com`, `microsoft.com`, `apple.com`).
   * אם השולח היה ברשימת ההרשאה, ההודעה מוכנסת לרשימת האפור לשעה אחת.
   * אם השולח אינו ברשימת ההרשאה, ההודעה מוכנסת לרשימת האפור ל-6 שעות.
2. אנו מפענחים מפתחות לרשימת החסימה מתוך מידע מהשולח ומההודעה, ולכל אחד מהמפתחות האלה אנו יוצרים (אם לא קיים כבר) מונה, מגדילים אותו ב-1 ושומרים במטמון ל-24 שעות.
   * עבור שולחים ברשימת ההרשאה:
     * מוסיפים מפתח לכתובת המייל של "MAIL FROM" במעטפה אם עברה SPF או ללא SPF, ולא הייתה [כתובת פוסטמסטר](#what-are-postmaster-addresses) או [כתובת no-reply](#what-are-no-reply-addresses).
     * אם כותרת "From" הייתה ברשימת ההרשאה, מוסיפים מפתח לכתובת המייל בכותרת "From" אם עברה SPF או עברה ו-DKIM מיושר.
     * אם כותרת "From" לא הייתה ברשימת ההרשאה, מוסיפים מפתח לכתובת המייל בכותרת "From" ולשם הדומיין המנותח השורש שלה.
   * עבור שולחים שאינם ברשימת ההרשאה:
     * מוסיפים מפתח לכתובת המייל של "MAIL FROM" במעטפה אם עברה SPF.
     * אם כותרת "From" הייתה ברשימת ההרשאה, מוסיפים מפתח לכתובת המייל בכותרת "From" אם עברה SPF או עברה ו-DKIM מיושר.
     * אם כותרת "From" לא הייתה ברשימת ההרשאה, מוסיפים מפתח לכתובת המייל בכותרת "From" ולשם הדומיין המנותח השורש שלה.
     * מוסיפים מפתח לכתובת ה-IP המרוחקת של השולח.
     * מוסיפים מפתח לשם המארח שנפתר על ידי לקוח באמצעות חיפוש הפוך מכתובת ה-IP של השולח (אם יש).
     * מוסיפים מפתח לדומיין השורש של שם המארח שנפתר על ידי הלקוח (אם יש, ואם שונה משם המארח שנפתר).
3. אם המונה מגיע ל-5 עבור שולח ומפתח שאינם ברשימת ההרשאה, אנו מוסיפים את המפתח לרשימת החסימה ל-30 יום ונשלח מייל לצוות התלונות שלנו. מספרים אלה עשויים להשתנות ועדכונים ישתקפו כאן ככל שנעקוב אחר התלונות.
4. אם המונה מגיע ל-10 עבור שולח ומפתח ברשימת ההרשאה, אנו מוסיפים את המפתח לרשימת החסימה ל-7 ימים ונשלח מייל לצוות התלונות שלנו. מספרים אלה עשויים להשתנות ועדכונים ישתקפו כאן ככל שנעקוב אחר התלונות.
> **הערה:** בעתיד הקרוב נציג ניטור מוניטין. ניטור מוניטין יחושב במקום זאת מתי יש להכניס שולח לרשימה שחורה בהתבסס על סף אחוזים (בניגוד למונה פשוט כפי שצויין לעיל).

### האם יש לכם הגבלת קצב {#do-you-have-rate-limiting}

הגבלת קצב שולח היא או לפי הדומיין השורש שנלקח מבדיקת PTR הפוכה על כתובת ה-IP של השולח – או אם זה לא מניב תוצאה, אז פשוט משתמשים בכתובת ה-IP של השולח. שימו לב שאנו מתייחסים לזה כ`Sender` להלן.

שרת ה-MX שלנו מוגבל יומית עבור דואר נכנס המתקבל עבור [אחסון IMAP מוצפן](/blog/docs/best-quantum-safe-encrypted-email-service):

* במקום להגביל קצב דואר נכנס המתקבל על בסיס כינוי בודד (למשל `you@yourdomain.com`) – אנו מגבילים קצב לפי שם הדומיין של הכינוי עצמו (למשל `yourdomain.com`). זה מונע מ`Senders` להציף את תיבות הדואר של כל הכינויים בדומיין שלך בבת אחת.
* יש לנו מגבלות כלליות החלות על כל ה`Senders` בשירות שלנו ללא קשר לנמען:
  * `Senders` שאנו מחשיבים כ"מהימנים" כמקור אמת (למשל `gmail.com`, `microsoft.com`, `apple.com`) מוגבלים לשליחת 100 גיגה-בייט ליום.
  * `Senders` שהם [ברשימת ההרשאה](#do-you-have-an-allowlist) מוגבלים לשליחת 10 גיגה-בייט ליום.
  * כל שאר ה`Senders` מוגבלים לשליחת 1 גיגה-בייט ו/או 1000 הודעות ליום.
* יש לנו מגבלה ספציפית לכל `Sender` ו-`yourdomain.com` של 1 גיגה-בייט ו/או 1000 הודעות יומיות.

שרת ה-MX גם מגביל הודעות שמועברות לנמען אחד או יותר דרך הגבלת קצב – אך זה חל רק על `Senders` שאינם ב[רשימת ההרשאה](#do-you-have-an-allowlist):

* אנו מאפשרים עד 100 חיבורים לשעה, לכל דומיין שורש FQDN של `Sender` שזוהה (או) כתובת ה-IP המרוחקת של `Sender` (אם אין PTR הפוך זמין), ולכל נמען במעטפה. אנו מאחסנים את המפתח להגבלת הקצב כ-hash קריפטוגרפי במסד הנתונים Redis שלנו.

* אם אתה שולח דואר דרך המערכת שלנו, אנא ודא שיש לך PTR הפוך מוגדר לכל כתובות ה-IP שלך (אחרת כל דומיין שורש FQDN ייחודי או כתובת IP שאתה שולח מהם יוגבל בקצב).

* שים לב שאם אתה שולח דרך מערכת פופולרית כמו Amazon SES, אז לא תחווה הגבלת קצב מכיוון ש(בעת כתיבת שורות אלו) Amazon SES מופיע ברשימת ההרשאה שלנו.

* אם אתה שולח מדומיין כמו `test.abc.123.example.com`, אז הגבלת הקצב תוטל על `example.com`. רבים מהספאמרים משתמשים במאות תת-דומיינים כדי לעקוף מסנני ספאם נפוצים שמגבילים קצב רק לפי שמות מארח ייחודיים במקום לפי דומיין שורש FQDN ייחודי.

* `Senders` שעוברים את הגבלת הקצב יידחו עם שגיאה 421.

שרת ה-IMAP וה-SMTP שלנו מגבילים את הכינויים שלך מלהחזיק יותר מ-`60` חיבורים בו-זמניים.

שרת ה-MX שלנו מגביל שולחים [שאינם ברשימת ההרשאה](#do-you-have-an-allowlist) מלהקים יותר מ-10 חיבורים בו-זמניים (עם תפוגת מטמון של 3 דקות למונה, המשקפת את זמן ההמתנה של הסוקט שלנו של 3 דקות).

### איך אתם מגנים מפני backscatter {#how-do-you-protect-against-backscatter}

החזרות שגויות או ספאם החזרות (המכונה "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") עלולות לגרום למוניטין שלילי לכתובות ה-IP של השולח.

אנו נוקטים שני צעדים כדי להגן מפני backscatter, המפורטים בסעיפים הבאים [מניעת החזרות משולחים ידועים ב-MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) ו-[מניעת החזרות מיותרות להגנה מפני backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) להלן.

### מניעת החזרות משולחים ידועים ב-MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

אנו מושכים את הרשימה מ-[Backscatter.org](https://www.backscatterer.org/) (מופעל על ידי [UCEPROTECT](https://www.uceprotect.net/)) בכתובת <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> כל שעה ומזינים אותה למסד הנתונים Redis שלנו (אנו גם משווים את ההבדלים מראש; למקרה שהוסרו כתובות IP שצריך לכבד).
אם MAIL FROM ריק או שווה (בלי תלות באותיות גדולות/קטנות) לאחד מכתובות [postmaster](#what-are-postmaster-addresses) (החלק לפני ה-@ באימייל), אז נבדוק אם כתובת ה-IP של השולח תואמת לאחת מהרשימה הזו.

אם כתובת ה-IP של השולח מופיעה ברשימה (ואינה ב-[רשימת ההרשאות שלנו](#do-you-have-an-allowlist)), אז נשלח שגיאה 554 עם ההודעה `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`.  נקבל התראה אם שולח מופיע גם ברשימת Backscatterer וגם ברשימת ההרשאות שלנו כדי שנוכל לפתור את הבעיה במידת הצורך.

הטכניקות המתוארות בסעיף זה עומדות בהמלצת "מצב בטוח" בכתובת <https://www.backscatterer.org/?target=usage> – שם אנו בודקים את כתובת ה-IP של השולח רק אם תנאים מסוימים כבר התקיימו.

### מניעת החזרות מיותרות להגנה מפני backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

החזרות הן אימיילים שמצביעים על כך שההעברה של האימייל נכשלה לחלוטין אצל הנמען והאימייל לא ינסה להישלח שוב.

סיבה נפוצה להופעה ברשימת Backscatterer היא החזרות מוטעות או ספאם החזרות, ולכן עלינו להגן מפני זה בכמה דרכים:

1. אנו שולחים רק כאשר מתרחשות שגיאות בקוד סטטוס >= 500 (כאשר ניסיונות העברת האימייל נכשלו, לדוגמה Gmail מחזיר שגיאה ברמת 500).

2. אנו שולחים רק פעם אחת (אנו משתמשים במפתח טביעת אצבע של ההחזרה ומאחסנים אותו במטמון כדי למנוע שליחת כפילויות). טביעת האצבע היא מפתח שהוא טביעת האצבע של ההודעה בשילוב עם גיבוב של כתובת ההחזרה וקוד השגיאה שלה. ראו את הסעיף על [טביעת אצבע](#how-do-you-determine-an-email-fingerprint) לקבלת תובנות נוספות על חישוב טביעת האצבע של ההודעה. טביעות אצבע של החזרות שנשלחו בהצלחה יפוגו לאחר 7 ימים במטמון Redis שלנו.

3. אנו שולחים רק כאשר MAIL FROM ו/או From אינם ריקים ואינם מכילים (בלי תלות באותיות) שם משתמש [postmaster](#what-are-postmaster-addresses) (החלק לפני ה-@ באימייל).

4. איננו שולחים אם להודעה המקורית היו כל אחד מהכותרות הבאות (בלי תלות באותיות):

   * כותרת `auto-submitted` עם ערך שאינו שווה ל-`no`.
   * כותרת `x-auto-response-suppress` עם ערך של `dr`, `autoreply`, `auto-reply`, `auto_reply`, או `all`
   * כותרת `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, או `x-auto-respond` (ללא תלות בערך).
   * כותרת `precedence` עם ערך של `bulk`, `autoreply`, `auto-reply`, `auto_reply`, או `list`.

5. איננו שולחים אם כתובת האימייל ב-MAIL FROM או From מסתיימת ב-`+donotreply`, `-donotreply`, `+noreply`, או `-noreply`.

6. איננו שולחים אם החלק של שם המשתמש בכתובת From היה `mdaemon` והייתה כותרת `X-MDDSN-Message` ללא תלות באותיות.

7. איננו שולחים אם הייתה כותרת `content-type` ללא תלות באותיות עם הערך `multipart/report`.

### איך קובעים טביעת אצבע של אימייל {#how-do-you-determine-an-email-fingerprint}

טביעת האצבע של אימייל משמשת לקביעת ייחודיות של אימייל ולמניעת שליחת הודעות כפולות ושליחת [החזרות כפולות](#prevent-unnecessary-bounces-to-protect-against-backscatter).

טביעת האצבע מחושבת מהרשימה הבאה:

* שם המארח FQDN או כתובת IP שפתר הלקוח
* ערך כותרת `Message-ID` (אם קיים)
* ערך כותרת `Date` (אם קיים)
* ערך כותרת `From` (אם קיים)
* ערך כותרת `To` (אם קיים)
* ערך כותרת `Cc` (אם קיים)
* ערך כותרת `Subject` (אם קיים)
* ערך `Body` (אם קיים)

### האם ניתן להעביר אימיילים לפורטים אחרים מ-25 (למשל אם ספק האינטרנט שלי חסם את פורט 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

כן, מאז 5 במאי 2020 הוספנו תכונה זו. כרגע התכונה ספציפית לדומיין, ולא ספציפית לכינוי. אם אתם צריכים שהיא תהיה ספציפית לכינוי, אנא צרו קשר כדי ליידע אותנו בצרכים שלכם.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    הגנת פרטיות משופרת:
  </strong>
  <span>
    אם אתם בתוכנית בתשלום (שכוללת הגנת פרטיות משופרת), אנא עברו ל- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a>, לחצו על "הגדרות" ליד הדומיין שלכם, ואז לחצו על "הגדרות". אם תרצו ללמוד עוד על תוכניות בתשלום ראו את דף ה- <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">תמחור</a> שלנו. אחרת תוכלו להמשיך לעקוב אחרי ההוראות למטה.
  </span>
</div>
אם אתם בתוכנית החינמית, פשוט הוסיפו רשומת DNS <strong class="notranslate">TXT</strong> חדשה כפי שמוצג למטה, אך שנו את הפורט מ-25 לפורט שתבחרו.

לדוגמה, אם אני רוצה שכל המיילים שנשלחים ל-`example.com` יועברו לנמענים עם פורט SMTP של 1337 במקום 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
    התרחיש הנפוץ ביותר להגדרת העברת פורט מותאמת הוא כאשר רוצים להעביר את כל המיילים שנשלחים ל-example.com לפורט שונה ב-example.com, במקום פורט SMTP הסטנדרטי 25. כדי להגדיר זאת, פשוט הוסיפו את רשומת <strong class="notranslate">TXT</strong> catch-all הבאה.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### האם זה תומך בסימן הפלוס + לכינויים בג'ימייל {#does-it-support-the-plus--symbol-for-gmail-aliases}

כן, בהחלט.

### האם זה תומך בתת-דומיינים {#does-it-support-sub-domains}

כן, בהחלט. במקום להשתמש ב-"@", ".", או ריק כשם/מארח/כינוי, פשוט השתמשו בשם תת-הדומיין כערך במקום.

אם אתם רוצים ש-`foo.example.com` יפנה מיילים, הזינו `foo` כערך שם/מארח/כינוי בהגדרות ה-DNS שלכם (גם עבור רשומות MX וגם עבור <strong class="notranslate">TXT</strong>).

### האם זה מעביר את כותרות המייל שלי {#does-this-forward-my-emails-headers}

כן, בהחלט.

### האם זה נבדק היטב {#is-this-well-tested}

כן, יש לו בדיקות שנכתבו עם [ava](https://github.com/avajs/ava) ויש גם כיסוי קוד.

### האם אתם מעבירים הודעות וקודי תגובה של SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

כן, בהחלט. לדוגמה, אם אתם שולחים מייל ל-`hello@example.com` והוא רשום להעברה ל-`user@gmail.com`, אז הודעת התגובה וקוד ה-SMTP משרת ה-"gmail.com" יוחזרו במקום שרת הפרוקסי ב-"mx1.forwardemail.net" או "mx2.forwardemail.net".

### איך אתם מונעים ספאמרים ומבטיחים מוניטין טוב להעברת מיילים {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

ראו את הסעיפים שלנו על [איך עובד מערכת העברת המייל שלכם](#how-does-your-email-forwarding-system-work), [איך אתם מטפלים בבעיות מסירת מיילים](#how-do-you-handle-email-delivery-issues), ו-[איך אתם מטפלים בכתובות ה-IP שלכם כשהן נחסמות](#how-do-you-handle-your-ip-addresses-becoming-blocked) למעלה.

### איך אתם מבצעים חיפושי DNS על שמות דומיין {#how-do-you-perform-dns-lookups-on-domain-names}

יצרנו פרויקט תוכנה בקוד פתוח :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) ומשתמשים בו לחיפושי DNS. שרתי ה-DNS ברירת המחדל הם `1.1.1.1` ו-`1.0.0.1`, והשאילתות ל-DNS מתבצעות דרך [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") בשכבת היישום.

:tangerine: [Tangerine](https://github.com/tangerine) משתמש בשירות ה-DNS הפרטי לצרכנים של [CloudFlare כברירת מחדל][cloudflare-dns].


## חשבון וחשבוניות {#account-and-billing}

### האם אתם מציעים אחריות להחזר כספי בתוכניות בתשלום {#do-you-offer-a-money-back-guarantee-on-paid-plans}

כן! החזרים אוטומטיים מתבצעים כאשר אתם משדרגים, מורידים או מבטלים את החשבון שלכם בתוך 30 ימים מהתחלת התוכנית. זה חל רק על לקוחות בפעם הראשונה.
### אם אני משנה תוכניות, האם אתם מחשבים פרופורציה ומחזירים את ההפרש {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

איננו מחשבים פרופורציה ואיננו מחזירים את ההפרש כאשר אתה משנה תוכניות. במקום זאת, אנו ממירים את משך הזמן הנותר מתאריך תפוגת התוכנית הקיימת שלך למשך הקרוב ביותר בתוכנית החדשה שלך (מעוגל כלפי מטה לפי חודשים).

שים לב שאם תשדרג או תוריד דרגה בין תוכניות בתשלום בתוך חלון של 30 יום מאז שהתחלת תוכנית בתשלום, אז נחזיר אוטומטית את הסכום המלא מהתוכנית הקיימת שלך.

### האם אפשר להשתמש בשירות העברת הדואר הזה כשרת MX "גיבוי" או "מחליף" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

לא, זה לא מומלץ, כי אפשר להשתמש רק בשרת החלפת דואר אחד בכל פעם. גיבויים בדרך כלל לא מנסים שוב בגלל תצורות עדיפות שגויות ושרתות דואר שאינן מכבדות בדיקת עדיפות החלפת MX.

### האם אפשר להשבית כינויים ספציפיים {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה בתוכנית בתשלום, עליך לגשת ל- <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים <i class="fa fa-angle-right"></i> ערוך כינוי <i class="fa fa-angle-right"></i> הסר סימון מתיבת הסימון "פעיל" <i class="fa fa-angle-right"></i> המשך.
  </span>
</div>

כן, פשוט ערוך את רשומת ה-DNS <strong class="notranslate">TXT</strong> שלך והוסף לפני הכינוי סימן קריאה אחד, שניים או שלושה (ראה למטה).

שים לב ש*עליך* לשמור על המיפוי ":" כי זה נדרש אם תחליט אי פעם לכבות זאת (וזה גם משמש לייבוא אם תשדרג לאחת מהתוכניות בתשלום שלנו).

**לדחייה שקטה (נראה לשולח כאילו ההודעה נשלחה בהצלחה, אך למעשה ההודעה לא מגיעה לשום מקום) (קוד סטטוס `250`):** אם תוסיף לפני כינוי "!" (סימן קריאה יחיד) אז יוחזר קוד סטטוס מוצלח `250` לשולחים שמנסים לשלוח לכתובת זו, אך המיילים עצמם לא יגיעו לשום מקום (למשל חור שחור או `/dev/null`).

**לדחייה רכה (קוד סטטוס `421`):** אם תוסיף לפני כינוי "!!" (שני סימני קריאה) אז יוחזר קוד שגיאה רכה `421` לשולחים שמנסים לשלוח לכתובת זו, והמיילים ינסו להישלח שוב עד 5 ימים לפני דחייה והחזרה.

**לדחייה קשה (קוד סטטוס `550`):** אם תוסיף לפני כינוי "!!!" (שלושה סימני קריאה) אז יוחזר קוד שגיאה קבוע `550` לשולחים שמנסים לשלוח לכתובת זו והמיילים יידחו ויחזרו.

לדוגמה, אם אני רוצה שכל המיילים שנשלחים ל-`alias@example.com` יפסיקו לעבור ל-`user@gmail.com` וידחו ויחזרו (למשל להשתמש בשלושה סימני קריאה):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
  <span>
    אפשר גם לשכתב את כתובת הנמען המועברת ל-"nobody@forwardemail.net" פשוט, מה שיפנה את זה ל-nobody כפי בדוגמה למטה.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
  <span>
    אם אתם רוצים אבטחה מוגברת, תוכלו גם להסיר את החלק ":user@gmail.com" (או ":nobody@forwardemail.net"), ולהשאיר רק "!!!alias" כפי בדוגמה למטה.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### האם אפשר להעביר מיילים למספר נמענים {#can-i-forward-emails-to-multiple-recipients}

כן, בהחלט. פשוט ציינו מספר נמענים ברשומות <strong class="notranslate">TXT</strong> שלכם.

לדוגמה, אם אני רוצה שמייל שנשלח ל-`hello@example.com` יועבר ל-`user+a@gmail.com` ו-`user+b@gmail.com`, אז רשומת ה-<strong class="notranslate">TXT</strong> שלי תיראה כך:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

או, תוכלו לציין אותם בשתי שורות נפרדות, כמו זו:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

זה תלוי בכם!

### האם אפשר שיהיו מספר נמענים כלליים גלובליים {#can-i-have-multiple-global-catch-all-recipients}

כן, אפשר. פשוט ציינו מספר נמענים כלליים גלובליים ברשומות <strong class="notranslate">TXT</strong> שלכם.

לדוגמה, אם אני רוצה שכל מייל שנשלח ל-`*@example.com` (הכוכבית משמעותה שזה כלל כללי aka catch-all) יועבר ל-`user+a@gmail.com` ו-`user+b@gmail.com`, אז רשומת ה-<strong class="notranslate">TXT</strong> שלי תיראה כך:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

או, תוכלו לציין אותם בשתי שורות נפרדות, כמו זו:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>שם/מארח/כינוי</th>
      <th class="text-center">TTL</th>
      <th>סוג</th>
      <th>תשובה/ערך</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", או ריק</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
זה תלוי בך!

### האם יש מגבלה מקסימלית על מספר כתובות האימייל שאני יכול להעביר לכל כינוי {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

כן, המגבלה ברירת המחדל היא 10. זה לא אומר שאתה יכול להחזיק רק 10 כינויים בדומיין שלך. אתה יכול להחזיק כמה כינויים שתרצה (כמות בלתי מוגבלת). המשמעות היא שאתה יכול להעביר כינוי אחד ל-10 כתובות אימייל ייחודיות בלבד. תוכל להחזיק `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (מ-1 עד 10) – וכל האימיילים ל-`hello@example.com` יועברו ל-`user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (מ-1 עד 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    טיפ:
  </strong>
  <span>
    צריכים יותר מ-10 נמענים לכל כינוי? שלחו לנו אימייל ונשמח להגדיל את המגבלה בחשבונכם.
  </span>
</div>

### האם ניתן להעביר אימיילים באופן רקורסיבי {#can-i-recursively-forward-emails}

כן, ניתן, אך עדיין עליך לעמוד במגבלה המקסימלית. אם יש לך `hello:linus@example.com` ו-`linus:user@gmail.com`, אז אימיילים ל-`hello@example.com` יועברו ל-`linus@example.com` ו-`user@gmail.com`. שים לב שתופיע שגיאה אם תנסה להעביר אימיילים באופן רקורסיבי מעבר למגבלה המקסימלית.

### האם אנשים יכולים להסיר או להירשם להעברת האימייל שלי ללא רשותי {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

אנו משתמשים באימות רשומות MX ו-<strong class="notranslate">TXT</strong>, לכן אם תוסיף את רשומות ה-MX וה-<strong class="notranslate">TXT</strong> המתאימות לשירות זה, אז אתה רשום. אם תסיר אותן, אז אתה לא רשום. אתה בעלים של הדומיין וניהול ה-DNS שלך, אז אם מישהו אחר יש לו גישה לכך זו בעיה.

### איך זה בחינם {#how-is-it-free}

Forward Email מציע שכבת שירות חינמית באמצעות שילוב של פיתוח קוד פתוח, תשתית יעילה ותכניות בתשלום אופציונליות התומכות בשירות.

השכבה החינמית שלנו נתמכת על ידי:

1. **פיתוח קוד פתוח**: בסיס הקוד שלנו הוא קוד פתוח, המאפשר תרומות מהקהילה ותפעול שקוף.

2. **תשתית יעילה**: אופטמיזציה של המערכות שלנו לטיפול בהעברת אימיילים עם מינימום משאבים.

3. **תכניות פרימיום בתשלום**: משתמשים הזקוקים לתכונות נוספות כמו שליחת SMTP, קבלת IMAP, או אפשרויות פרטיות משופרות מנויים לתכניות בתשלום.

4. **מגבלות שימוש סבירות**: לשכבה החינמית יש מדיניות שימוש הוגנת למניעת ניצול לרעה.

> \[!NOTE]
> אנו מחויבים לשמור על העברת אימייל בסיסית בחינם תוך הצעת תכונות פרימיום למשתמשים עם צרכים מתקדמים יותר.

> \[!TIP]
> אם השירות שלנו חשוב לך, שקול לשדרג לתכנית בתשלום כדי לתמוך בפיתוח ותחזוקה שוטפים.

### מהי המגבלה המקסימלית על גודל האימייל {#what-is-the-max-email-size-limit}

ברירת המחדל שלנו היא מגבלת גודל של 50MB, הכוללת תוכן, כותרות וקבצים מצורפים. שים לב ששירותים כמו Gmail ו-Outlook מאפשרים רק מגבלת גודל של 25MB, ואם תחרוג מהמגבלה בעת שליחה לכתובות אצל ספקים אלו תקבל הודעת שגיאה.

שגיאה עם קוד תגובה מתאים תוחזר אם יחרגו מגבלת גודל הקובץ.

### האם אתם שומרים יומני אימיילים {#do-you-store-logs-of-emails}

לא, איננו כותבים לדיסק או שומרים יומנים – למעט [שגיאות](#do-you-store-error-logs) ו-[SMTP יוצא](#do-you-support-sending-email-with-smtp) (ראה את [מדיניות הפרטיות שלנו](/privacy)).

הכל מתבצע בזיכרון ו-[קוד המקור שלנו ב-GitHub](https://github.com/forwardemail).

### האם אתם שומרים יומני שגיאות {#do-you-store-error-logs}

**כן. ניתן לגשת ליומני השגיאות תחת [החשבון שלי → יומנים](/my-account/logs) או [החשבון שלי → דומיינים](/my-account/domains).**

מאז פברואר 2023, אנו שומרים יומני שגיאות עבור קודי תגובת SMTP `4xx` ו-`5xx` לתקופה של 7 ימים – הכוללים את שגיאת ה-SMTP, מעטפה וכותרות האימייל (איננו שומרים את גוף האימייל או קבצים מצורפים).
יומני שגיאות מאפשרים לך לבדוק אם חסרים מיילים חשובים ולהפחית זיהוי שגוי של דואר זבל עבור [הדומיינים שלך](/my-account/domains). הם גם משאב מצוין לאיתור תקלות עם [webhooks של דואר אלקטרוני](#do-you-support-webhooks) (מכיוון שיומני השגיאות מכילים את תגובת נקודת הקצה של ה-webhook).

יומני שגיאות עבור [הגבלת קצב](#do-you-have-rate-limiting) ו-[רשימת אפור](#do-you-have-a-greylist) אינם נגישים מכיוון שהחיבור מסתיים מוקדם (למשל לפני שניתן להעביר את הפקודות `RCPT TO` ו-`MAIL FROM`).

ראה את [מדיניות הפרטיות שלנו](/privacy) למידע נוסף.

### האם אתם קוראים את המיילים שלי {#do-you-read-my-emails}

לא, בהחלט לא. ראה את [מדיניות הפרטיות שלנו](/privacy).

שירותי העברת דואר אלקטרוני רבים אחרים מאחסנים ועלולים לקרוא את המייל שלך. אין סיבה שמיילים מועברים יישמרו לאחסון בדיסק – ולכן תכננו את הפתרון הראשון בקוד פתוח שעושה הכל בזיכרון בלבד.

אנו מאמינים שלך יש זכות לפרטיות ואנו מכבדים זאת בקפידה. הקוד שמופעל על השרת הוא [תוכנה בקוד פתוח ב-GitHub](https://github.com/forwardemail) לשקיפות ולבניית אמון.

### האם אני יכול "לשלוח מייל בשם" בג'ימייל עם זה {#can-i-send-mail-as-in-gmail-with-this}

כן! מאז 2 באוקטובר 2018 הוספנו תכונה זו. ראה את [איך לשלוח מייל בשם באמצעות ג'ימייל](#how-to-send-mail-as-using-gmail) למעלה!

כדאי גם להגדיר את רשומת SPF עבור ג'ימייל בקונפיגורציית ה-DNS שלך ברשומת <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה משתמש בג'ימייל (למשל Send Mail As) או ב-G Suite, תצטרך להוסיף <code>include:_spf.google.com</code> לרשומת SPF <strong class="notranslate">TXT</strong> שלך, לדוגמה:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### האם אני יכול "לשלוח מייל בשם" באאוטלוק עם זה {#can-i-send-mail-as-in-outlook-with-this}

כן! מאז 2 באוקטובר 2018 הוספנו תכונה זו. פשוט עיין בשני הקישורים של מיקרוסופט למטה:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

כדאי גם להגדיר את רשומת SPF עבור אאוטלוק בקונפיגורציית ה-DNS שלך ברשומת <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    חשוב:
  </strong>
  <span>
    אם אתה משתמש ב-Microsoft Outlook או Live.com, תצטרך להוסיף <code>include:spf.protection.outlook.com</code> לרשומת SPF <strong class="notranslate">TXT</strong> שלך, לדוגמה:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### האם אני יכול "לשלוח מייל בשם" באפל מייל ו-iCloud Mail עם זה {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

אם אתה מנוי ל-iCloud+, תוכל להשתמש בדומיין מותאם אישית. [השירות שלנו גם תואם לאפל מייל](#apple-mail).

אנא ראה <https://support.apple.com/en-us/102540> למידע נוסף.

### האם אני יכול להעביר מיילים ללא הגבלה עם זה {#can-i-forward-unlimited-emails-with-this}

כן, עם זאת, שולחים "יחסית לא מוכרים" מוגבלים ל-100 חיבורים לשעה לכל שם מארח או IP. ראה את הסעיף על [הגבלת קצב](#do-you-have-rate-limiting) ו-[רשימת אפור](#do-you-have-a-greylist) למעלה.

במונח "יחסית לא מוכרים", אנו מתכוונים לשולחים שאינם מופיעים ב-[רשימת ההרשאה](#do-you-have-an-allowlist).

אם מגבלה זו תעבור, נשלח קוד תגובה 421 שאומר לשרת הדואר של השולח לנסות שוב מאוחר יותר.

### האם אתם מציעים דומיינים ללא הגבלה במחיר אחד {#do-you-offer-unlimited-domains-for-one-price}

כן. ללא קשר לתכנית שבה אתה נמצא, תשלם רק תעריף חודשי אחד – שמכסה את כל הדומיינים שלך.
### אילו שיטות תשלום אתם מקבלים {#which-payment-methods-do-you-accept}

Forward Email מקבל את שיטות התשלום הבאות לתשלום חד-פעמי או חודשי/רבעוני/שנתי:

1. **כרטיסי אשראי/חיוב/העברות בנקאיות**: ויזה, מאסטרקארד, אמריקן אקספרס, דיסקבר, JCB, דיינרס קלאב, וכו'.
2. **PayPal**: חברו את חשבון ה-PayPal שלכם לתשלומים קלים
3. **מטבעות קריפטוגרפיים**: אנו מקבלים תשלומים דרך תשלומי סטייבל-קוין של Stripe ברשתות Ethereum, Polygon ו-Solana

> \[!NOTE]
> אנו מאחסנים מידע מוגבל על תשלומים בשרתים שלנו, הכולל רק מזהי תשלום והפניות ל-[Stripe](https://stripe.com/global) ו-[PayPal](https://www.paypal.com) של עסקאות, לקוחות, מנויים ומזהי תשלום.

> \[!TIP]
> לפרטיות מקסימלית, שקלו להשתמש בתשלומים במטבעות קריפטוגרפיים.

כל התשלומים מעובדים בצורה מאובטחת דרך Stripe או PayPal. פרטי התשלום שלכם לעולם אינם מאוחסנים בשרתים שלנו.


## משאבים נוספים {#additional-resources}

> \[!TIP]
> המאמרים שלנו למטה מתעדכנים באופן קבוע עם מדריכים, טיפים ומידע טכני חדש. בדקו לעיתים קרובות לתוכן העדכני ביותר.

* [מחקרי מקרה ותיעוד למפתחים](/blog/docs)
* [משאבים](/resources)
* [מדריכים](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
