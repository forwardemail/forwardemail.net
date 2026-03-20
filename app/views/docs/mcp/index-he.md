# שרת Forward Email MCP {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="שרת Forward Email MCP" class="rounded-lg" />

<p class="lead mt-3">
  <strong>תקציר:</strong> <a href="https://github.com/forwardemail/mcp-server">שרת MCP בקוד פתוח שלנו</a> מאפשר לעוזרי AI כמו Claude, ChatGPT, Cursor ו-Windsurf לנהל את הדוא"ל, הדומיינים, הכינויים, אנשי הקשר והלוחות שלך באמצעות שפה טבעית. כל 68 נקודות הקצה של ה-API מוצגות ככלי MCP. הוא פועל מקומית דרך <code>npx @forwardemail/mcp-server</code> — האישורים שלך לעולם לא עוזבים את המחשב שלך.
</p>


## תוכן העניינים {#table-of-contents}

* [מה זה MCP?](#what-is-mcp)
* [התחלה מהירה](#quick-start)
  * [קבלת מפתח API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [לקוחות MCP נוספים](#other-mcp-clients)
* [אימות](#authentication)
  * [אימות מפתח API](#api-key-auth)
  * [אימות כינוי](#alias-auth)
  * [יצירת סיסמת כינוי](#generating-an-alias-password)
* [כל 68 הכלים](#all-68-tools)
  * [חשבון (אימות מפתח API או כינוי)](#account-api-key-or-alias-auth)
  * [דומיינים (מפתח API)](#domains-api-key)
  * [כינויים (מפתח API)](#aliases-api-key)
  * [דוא"ל — SMTP יוצא (מפתח API; Send תומך בשניהם)](#emails--outbound-smtp-api-key-send-supports-both)
  * [הודעות — IMAP (אימות כינוי)](#messages--imap-alias-auth)
  * [תיקיות — IMAP (אימות כינוי)](#folders--imap-alias-auth)
  * [אנשי קשר — CardDAV (אימות כינוי)](#contacts--carddav-alias-auth)
  * [לוחות שנה — CalDAV (אימות כינוי)](#calendars--caldav-alias-auth)
  * [אירועי לוח שנה — CalDAV (אימות כינוי)](#calendar-events--caldav-alias-auth)
  * [סקריפטים של Sieve (מפתח API)](#sieve-scripts-api-key)
  * [סקריפטים של Sieve (אימות כינוי)](#sieve-scripts-alias-auth)
  * [חברי דומיין והזמנות (מפתח API)](#domain-members-and-invites-api-key)
  * [סיסמאות Catch-All (מפתח API)](#catch-all-passwords-api-key)
  * [יומנים (מפתח API)](#logs-api-key)
  * [הצפנה (ללא אימות)](#encrypt-no-auth)
* [20 מקרים לשימוש מעשי](#20-real-world-use-cases)
  * [1. מיון דוא"ל](#1-email-triage)
  * [2. אוטומציה של הגדרת דומיין](#2-domain-setup-automation)
  * [3. ניהול כינויים בכמות גדולה](#3-bulk-alias-management)
  * [4. ניטור קמפיין דוא"ל](#4-email-campaign-monitoring)
  * [5. סנכרון וניקוי אנשי קשר](#5-contact-sync-and-cleanup)
  * [6. ניהול לוח שנה](#6-calendar-management)
  * [7. אוטומציה של סקריפט Sieve](#7-sieve-script-automation)
  * [8. קליטת צוות](#8-team-onboarding)
  * [9. ביקורת אבטחה](#9-security-auditing)
  * [10. הגדרת העברת דוא"ל](#10-email-forwarding-setup)
  * [11. חיפוש וניתוח תיבת דואר נכנס](#11-inbox-search-and-analysis)
  * [12. ארגון תיקיות](#12-folder-organization)
  * [13. סיבוב סיסמאות](#13-password-rotation)
  * [14. הצפנת רשומות DNS](#14-dns-record-encryption)
  * [15. ניתוח יומן משלוחים](#15-delivery-log-analysis)
  * [16. ניהול רב-דומיינים](#16-multi-domain-management)
  * [17. קונפיגורציית Catch-All](#17-catch-all-configuration)
  * [18. ניהול הזמנות דומיין](#18-domain-invite-management)
  * [19. בדיקת אחסון S3](#19-s3-storage-testing)
  * [20. הרכבת טיוטת דוא"ל](#20-email-draft-composition)
* [דוגמאות לפקודות](#example-prompts)
* [משתני סביבה](#environment-variables)
* [אבטחה](#security)
* [שימוש תכנותי](#programmatic-usage)
* [קוד פתוח](#open-source)


## מה זה MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) הוא תקן פתוח שפותח על ידי Anthropic שמאפשר למודלים של AI לקרוא לכלים חיצוניים בצורה מאובטחת. במקום להעתיק ולהדביק תגובות API לחלון שיחה, MCP נותן למודל גישה ישירה ומובנית לשירותים שלך.

שרת ה-MCP שלנו עוטף את כל [Forward Email API](/email-api) — כל נקודת קצה, כל פרמטר — ומציג אותם ככלים שכל לקוח התואם MCP יכול להשתמש בהם. השרת פועל מקומית על המחשב שלך באמצעות תקשורת stdio. האישורים שלך נשארים במשתני הסביבה שלך ולעולם אינם נשלחים למודל ה-AI.


## התחלה מהירה {#quick-start}

### קבלת מפתח API {#get-an-api-key}
1. היכנס ל-[חשבון Forward Email שלך](/my-account/domains).
2. עבור אל **החשבון שלי** → **אבטחה** → **מפתחות API**.
3. צור מפתח API חדש והעתק אותו.

### Claude Desktop {#claude-desktop}

הוסף זאת לקובץ התצורה של Claude Desktop שלך:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

הפעל מחדש את Claude Desktop. אמור להופיע כלים של Forward Email בבורר הכלים.

> **הערה:** המשתנים `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD` הם אופציונליים אך נדרשים לכלי תיבת דואר (הודעות, תיקיות, אנשי קשר, לוחות שנה). ראה [אימות](#authentication) לפרטים.

### Cursor {#cursor}

פתח הגדרות Cursor → MCP → הוסף שרת:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

פתח הגדרות Windsurf → MCP → הוסף שרת עם אותה תצורה כמו למעלה.

### לקוחות MCP אחרים {#other-mcp-clients}

כל לקוח שתומך בהעברת MCP stdio יעבוד. הפקודה היא:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## אימות {#authentication}

ממשק ה-API של Forward Email משתמש ב**אימות HTTP Basic** עם שני סוגי אישורים שונים בהתאם לנקודת הקצה. שרת MCP מטפל בזה אוטומטית — כל מה שעליך לעשות הוא לספק את האישורים הנכונים.

### אימות מפתח API {#api-key-auth}

רוב נקודות הניהול (דומיינים, כינויים, מיילים יוצאים, יומנים) משתמשות ב**מפתח ה-API** שלך כשם המשתמש באימות Basic עם סיסמה ריקה.

זהו אותו מפתח API שבו אתה משתמש עבור REST API. הגדר אותו באמצעות משתנה הסביבה `FORWARD_EMAIL_API_KEY`.

### אימות כינוי {#alias-auth}

נקודות קצה של תיבת דואר (הודעות, תיקיות, אנשי קשר, לוחות שנה, סקריפטים מסוג sieve בכינוי) משתמשות ב**אישורי כינוי** — כתובת האימייל של הכינוי כשם המשתמש וסיסמה שנוצרה כסיסמה.

נקודות קצה אלו ניגשות לנתונים לפי כינוי דרך פרוטוקולי IMAP, CalDAV ו-CardDAV. הן דורשות את כתובת האימייל של הכינוי וסיסמה שנוצרה, לא את מפתח ה-API.

ניתן לספק אישורי כינוי בשתי דרכים:

1. **משתני סביבה** (מומלץ עבור הכינוי ברירת המחדל): הגדר את `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **פרמטרים לכל קריאת כלי**: העבר `alias_username` ו-`alias_password` כארגומנטים לכל כלי אימות כינוי. אלה גוברים על משתני הסביבה, שימושי כאשר עובדים עם מספר כינויים.

### יצירת סיסמת כינוי {#generating-an-alias-password}

לפני שתוכל להשתמש בכלי אימות כינוי, עליך ליצור סיסמה עבור הכינוי. ניתן לעשות זאת עם כלי `generateAliasPassword` או דרך ה-API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

התשובה כוללת את השדות `username` (אימייל הכינוי) ו-`password`. השתמש בהם כאישורי הכינוי שלך.

> **טיפ:** ניתן גם לשאול את העוזר החכם שלך: *"צור סיסמה לכינוי <user@example.com> בדומיין example.com"* — הוא יקרא לכלי `generateAliasPassword` ויחזיר את האישורים.

הטבלה למטה מסכמת איזו שיטת אימות כל קבוצת כלים דורשת:

| קבוצת כלים                                                   | שיטת אימות               | אישורים                                                   |
| ------------------------------------------------------------ | ------------------------- | --------------------------------------------------------- |
| חשבון                                                        | מפתח API **או** אימות כינוי | אחד מהם                                                  |
| דומיינים, כינויים, חברי דומיין, הזמנות, סיסמאות Catch-All | מפתח API                   | `FORWARD_EMAIL_API_KEY`                                   |
| מיילים יוצאים (רשימה, קבלת, מחיקה, הגבלה)                 | מפתח API                   | `FORWARD_EMAIL_API_KEY`                                   |
| שליחת מייל                                                  | מפתח API **או** אימות כינוי | אחד מהם                                                  |
| הודעות (IMAP)                                                | אימות כינוי                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| תיקיות (IMAP)                                               | אימות כינוי                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| אנשי קשר (CardDAV)                                          | אימות כינוי                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| לוחות שנה (CalDAV)                                          | אימות כינוי                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| אירועי לוח שנה (CalDAV)                                    | אימות כינוי                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| סקריפטים מסוג Sieve (ברמת דומיין)                         | מפתח API                   | `FORWARD_EMAIL_API_KEY`                                   |
| סקריפטים מסוג Sieve (ברמת כינוי)                          | אימות כינוי                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| יומנים                                                     | מפתח API                   | `FORWARD_EMAIL_API_KEY`                                   |
| הצפנה                                                     | ללא                       | אין צורך באישורים                                        |
## כל 68 הכלים {#all-68-tools}

כל כלי מקושר ישירות לנקודת קצה של [Forward Email API](/email-api). הפרמטרים משתמשים באותם שמות כמו בתיעוד ה-API. שיטת האימות מצוינת בכותרת כל חלק.

### חשבון (אימות מפתח API או כינוי) {#account-api-key-or-alias-auth}

באימות מפתח API, אלו מחזירים את פרטי חשבון המשתמש שלך. באימות כינוי, הם מחזירים מידע על הכינוי/תיבת הדואר כולל מכסת אחסון והגדרות.

| כלי             | נקודת קצה API       | תיאור                        |
| --------------- | ------------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account`   | קבל את פרטי החשבון שלך       |
| `updateAccount` | `PUT /v1/account`   | עדכן את הגדרות החשבון שלך    |

### דומיינים (מפתח API) {#domains-api-key}

| כלי                  | נקודת קצה API                                    | תיאור                      |
| --------------------- | ------------------------------------------------ | -------------------------- |
| `listDomains`         | `GET /v1/domains`                                | רשום את כל הדומיינים שלך   |
| `createDomain`        | `POST /v1/domains`                               | הוסף דומיין חדש            |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | קבל פרטי דומיין            |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | עדכן הגדרות דומיין         |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | הסר דומיין                 |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`     | אמת רשומות DNS            |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`        | אמת הגדרות SMTP           |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection`| בדוק אחסון S3 מותאם אישית |

### כינויים (מפתח API) {#aliases-api-key}

| כלי                    | נקודת קצה API                                                      | תיאור                                  |
| ----------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | רשום כינויים לדומיין                   |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | צור כינוי חדש                         |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | קבל פרטי כינוי                       |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | עדכן כינוי                           |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | מחק כינוי                           |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | צור סיסמת IMAP/SMTP לאימות כינוי     |

### אימיילים — SMTP יוצא (מפתח API; Send תומך בשניהם) {#emails--outbound-smtp-api-key-send-supports-both}

| כלי            | נקודת קצה API          | אימות                  | תיאור                        |
| --------------- | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | מפתח API או אימות כינוי | שלח אימייל דרך SMTP          |
| `listEmails`    | `GET /v1/emails`        | מפתח API               | רשום אימיילים יוצאים         |
| `getEmail`      | `GET /v1/emails/:id`    | מפתח API               | קבל פרטי האימייל ומצבו      |
| `deleteEmail`   | `DELETE /v1/emails/:id` | מפתח API               | מחק אימייל בתור              |
| `getEmailLimit` | `GET /v1/emails/limit`  | מפתח API               | בדוק את מגבלת השליחה שלך     |

כלי `sendEmail` מקבל את הפרמטרים `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, ו-`attachments`. זהה לנקודת הקצה `POST /v1/emails`.

### הודעות — IMAP (אימות כינוי) {#messages--imap-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.
| כלי             | נקודת קצה API             | תיאור                              |
| --------------- | ------------------------- | --------------------------------- |
| `listMessages`  | `GET /v1/messages`        | רשימת וחיפוש הודעות בתיבת דואר    |
| `createMessage` | `POST /v1/messages`       | יצירת טיוטה או העלאת הודעה       |
| `getMessage`    | `GET /v1/messages/:id`    | קבלת הודעה לפי מזהה              |
| `updateMessage` | `PUT /v1/messages/:id`    | עדכון דגלים (נקרא, מועדף, וכו')  |
| `deleteMessage` | `DELETE /v1/messages/:id` | מחיקת הודעה                      |

כלי `listMessages` תומך ב-15+ פרמטרי חיפוש כולל `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, ו-`has_attachment`. ראה את [תיעוד ה-API](/email-api) לרשימה המלאה.

### תיקיות — IMAP (אימות על ידי כינוי) {#folders--imap-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי            | נקודת קצה API            | תיאור                    |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | רשימת כל תיקיות תיבת הדואר |
| `createFolder` | `POST /v1/folders`       | יצירת תיקיה חדשה         |
| `getFolder`    | `GET /v1/folders/:id`    | קבלת פרטי תיקיה          |
| `updateFolder` | `PUT /v1/folders/:id`    | שינוי שם תיקיה            |
| `deleteFolder` | `DELETE /v1/folders/:id` | מחיקת תיקיה              |

### אנשי קשר — CardDAV (אימות על ידי כינוי) {#contacts--carddav-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי             | נקודת קצה API             | תיאור                  |
| --------------- | ------------------------- | ---------------------- |
| `listContacts`  | `GET /v1/contacts`        | רשימת כל אנשי הקשר     |
| `createContact` | `POST /v1/contacts`       | יצירת איש קשר חדש       |
| `getContact`    | `GET /v1/contacts/:id`    | קבלת פרטי איש קשר       |
| `updateContact` | `PUT /v1/contacts/:id`    | עדכון איש קשר           |
| `deleteContact` | `DELETE /v1/contacts/:id` | מחיקת איש קשר           |

### לוחות שנה — CalDAV (אימות על ידי כינוי) {#calendars--caldav-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי              | נקודת קצה API              | תיאור                  |
| ---------------- | -------------------------- | ---------------------- |
| `listCalendars`  | `GET /v1/calendars`        | רשימת כל לוחות השנה    |
| `createCalendar` | `POST /v1/calendars`       | יצירת לוח שנה חדש      |
| `getCalendar`    | `GET /v1/calendars/:id`    | קבלת פרטי לוח שנה      |
| `updateCalendar` | `PUT /v1/calendars/:id`    | עדכון לוח שנה          |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | מחיקת לוח שנה          |

### אירועי לוח שנה — CalDAV (אימות על ידי כינוי) {#calendar-events--caldav-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי                   | נקודת קצה API                  | תיאור                  |
| --------------------- | ------------------------------ | ---------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`       | רשימת כל האירועים      |
| `createCalendarEvent` | `POST /v1/calendar-events`      | יצירת אירוע חדש        |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`   | קבלת פרטי אירוע        |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`   | עדכון אירוע            |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id`| מחיקת אירוע            |

### סקריפטים של Sieve (מפתח API) {#sieve-scripts-api-key}

אלו משתמשים בנתיבים בתחום ומאמתים עם מפתח ה-API שלך.

| כלי                   | נקודת קצה API                                                                 | תיאור                      |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                          | רשימת סקריפטים לכינוי      |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                         | יצירת סקריפט חדש           |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`               | קבלת פרטי סקריפט           |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`               | עדכון סקריפט               |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`            | מחיקת סקריפט               |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`     | הפעלת סקריפט               |
### סקריפטים של Sieve (אימות כינוי) {#sieve-scripts-alias-auth}

אלה משתמשים באימות ברמת הכינוי. שימושי לאוטומציה לפי כינוי ללא צורך במפתח API.

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר משתני סביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי                           | נקודת קצה API                               | תיאור               |
| ------------------------------ | -------------------------------------------- | -------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | רשימת סקריפטים      |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | יצירת סקריפט        |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | קבלת פרטי סקריפט    |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | עדכון סקריפט        |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | מחיקת סקריפט        |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | הפעלת סקריפט        |

### חברי דומיין והזמנות (מפתח API) {#domain-members-and-invites-api-key}

| כלי                 | נקודת קצה API                                       | תיאור                      |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id`    | שינוי תפקיד חבר            |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | הסרת חבר                   |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites`               | קבלת הזמנה ממתינה          |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites`              | הזמנת מישהו לדומיין        |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites`            | ביטול הזמנה                |

### סיסמאות Catch-All (מפתח API) {#catch-all-passwords-api-key}

| כלי                     | נקודת קצה API                                                  | תיאור                      |
| ------------------------ | ------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | רשימת סיסמאות catch-all   |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | יצירת סיסמת catch-all     |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | מחיקת סיסמת catch-all     |

### יומנים (מפתח API) {#logs-api-key}

| כלי           | נקודת קצה API            | תיאור                      |
| -------------- | ----------------------- | -------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | הורדת יומני משלוח דואר    |

### הצפנה (ללא אימות) {#encrypt-no-auth}

| כלי            | נקודת קצה API       | תיאור                      |
| --------------- | ------------------ | -------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | הצפנת רשומת DNS TXT        |

כלי זה אינו דורש אימות. הוא מצפין רשומות הפנייה כמו `forward-email=user@example.com` לשימוש ברשומות DNS TXT.


## 20 מקרים מעשיים {#20-real-world-use-cases}

הנה דרכים מעשיות להשתמש בשרת MCP עם העוזר האינטליגנטי שלך:

### 1. מיון דואר אלקטרוני {#1-email-triage}

בקש מה-AI שלך לסרוק את תיבת הדואר ולסכם הודעות שלא נקראו. הוא יכול לסמן מיילים דחופים, לסווג לפי שולח, ולנסח תגובות — הכל בשפה טבעית. *(דורש אישורי כינוי לגישה לתיבת הדואר.)*

### 2. אוטומציה של הגדרת דומיין {#2-domain-setup-automation}

מגדיר דומיין חדש? בקש מה-AI ליצור את הדומיין, להוסיף את הכינויים שלך, לאמת רשומות DNS, ולבדוק את הגדרת SMTP. מה שבדרך כלל לוקח 10 דקות של לחיצות בלוח הבקרה הופך לשיחה אחת.

### 3. ניהול כינויים בכמות גדולה {#3-bulk-alias-management}

צריך ליצור 20 כינויים לפרויקט חדש? תאר מה אתה צריך ותן ל-AI לטפל בעבודה החוזרת. הוא יכול ליצור כינויים, להגדיר כללי העברה, וליצור סיסמאות בפעם אחת.
### 4. ניטור קמפיין דואר אלקטרוני {#4-email-campaign-monitoring}

בקש מה-AI שלך לבדוק מגבלות שליחה, לרשום את הודעות הדואר היוצאות האחרונות, ולדווח על מצב המסירה. שימושי למעקב אחר בריאות דואר עסקי.

### 5. סינכרון וניקוי אנשי קשר {#5-contact-sync-and-cleanup}

השתמש בכלי CardDAV כדי לרשום את כל אנשי הקשר, למצוא כפילויות, לעדכן מידע מיושן, או ליצור בכמות גדולה אנשי קשר מקובץ גיליון אלקטרוני שאתה מדביק בצ'אט. *(דורש הרשאות אליאס.)*

### 6. ניהול לוח שנה {#6-calendar-management}

צור לוחות שנה, הוסף אירועים, עדכן זמני פגישות ומחק אירועים שבוטלו — הכל דרך שיחה. כלי CalDAV תומכים ב-CRUD מלא על לוחות שנה ואירועים. *(דורש הרשאות אליאס.)*

### 7. אוטומציה של סקריפטים מסוג Sieve {#7-sieve-script-automation}

סקריפטים מסוג Sieve חזקים אך התחביר שלהם מסובך. בקש מה-AI שלך לכתוב סקריפטים מסוג Sieve עבורך: "סנן את כל ההודעות מ-<billing@example.com> לתיקיית Billing" יהפוך לסקריפט עובד בלי לגעת במפרט RFC 5228.

### 8. קליטת צוות {#8-team-onboarding}

כשחבר צוות חדש מצטרף, בקש מה-AI ליצור לו אליאס, לייצר סיסמה, לשלוח לו מייל ברכה עם פרטי ההתחברות, ולהוסיף אותו כחבר דומיין. פקודה אחת, ארבע קריאות API.

### 9. ביקורת אבטחה {#9-security-auditing}

בקש מה-AI שלך לרשום את כל הדומיינים, לבדוק את מצב אימות ה-DNS, לסקור הגדרות אליאס, ולזהות דומיינים עם רשומות לא מאומתות. סריקה מהירה של אבטחה בשפה טבעית.

### 10. הגדרת העברת דואר אלקטרוני {#10-email-forwarding-setup}

מגדיר העברת דואר אלקטרוני לדומיין חדש? בקש מה-AI ליצור את הדומיין, להוסיף אליאסים להעברה, להצפין את רשומות ה-DNS, ולאמת שהכל מוגדר נכון.

### 11. חיפוש וניתוח תיבת דואר {#11-inbox-search-and-analysis}

השתמש בכלי חיפוש הודעות כדי למצוא מיילים ספציפיים: "מצא את כל המיילים מ-<john@example.com> ב-30 הימים האחרונים שיש להם קבצים מצורפים." יותר מ-15 פרמטרים לחיפוש הופכים את זה לעוצמתי. *(דורש הרשאות אליאס.)*

### 12. ארגון תיקיות {#12-folder-organization}

בקש מה-AI ליצור מבנה תיקיות לפרויקט חדש, להעביר הודעות בין תיקיות, או לנקות תיקיות ישנות שאינך צריך יותר. *(דורש הרשאות אליאס.)*

### 13. סיבוב סיסמאות {#13-password-rotation}

צור סיסמאות אליאס חדשות על פי לוח זמנים. בקש מה-AI לייצר סיסמה חדשה לכל אליאס ולדווח על פרטי ההתחברות החדשים.

### 14. הצפנת רשומות DNS {#14-dns-record-encryption}

הצפן את רשומות ההעברה שלך לפני הוספתן ל-DNS. כלי `encryptRecord` מטפל בזה ללא אימות — שימושי להצפנות מהירות חד-פעמיות.

### 15. ניתוח יומן מסירה {#15-delivery-log-analysis}

הורד את יומני המסירה של הדואר שלך ובקש מה-AI לנתח שיעורי החזרה, לזהות נמענים בעייתיים, או לעקוב אחרי זמני המסירה.

### 16. ניהול רב-דומיינים {#16-multi-domain-management}

אם אתה מנהל מספר דומיינים, בקש מה-AI לתת דוח מצב: אילו דומיינים מאומתים, אילו עם בעיות, כמה אליאסים יש לכל אחד, ואיך נראות מגבלות השליחה.

### 17. הגדרת Catch-All {#17-catch-all-configuration}

הגדר סיסמאות catch-all לדומיינים שצריכים לקבל דואר בכל כתובת. ה-AI יכול ליצור, לרשום ולנהל את הסיסמאות האלה עבורך.

### 18. ניהול הזמנות דומיין {#18-domain-invite-management}

הזמן חברי צוות לנהל דומיינים, בדוק הזמנות ממתינות, ונקה הזמנות שפג תוקפן. שימושי לארגונים עם מנהלי דומיין מרובים.

### 19. בדיקת אחסון S3 {#19-s3-storage-testing}

אם אתה משתמש באחסון S3 מותאם לגיבויי דואר, בקש מה-AI לבדוק את החיבור ולאמת שהוא פועל כראוי.

### 20. ניסוח טיוטות דואר אלקטרוני {#20-email-draft-composition}

צור טיוטות מייל בתיבת הדואר שלך בלי לשלוח אותן. שימושי להכנת מיילים שצריכים סקירה לפני שליחה, או לבניית תבניות מייל. *(דורש הרשאות אליאס.)*


## דוגמאות פקודות {#example-prompts}

הנה פקודות שתוכל להשתמש בהן ישירות עם העוזר ה-AI שלך:

**שליחת מייל:**

> "שלח מייל מ-<hello@mydomain.com> ל-<john@example.com> עם נושא 'פגישה מחר' ותוכן 'היי ג'ון, אנחנו עדיין על השעה 14:00?'"
**ניהול דומיינים:**

> "רשום את כל הדומיינים שלי ואמר לי אילו מהם מכילים רשומות DNS לא מאומתות."

**יצירת כינוי:**

> "צור כינוי חדש <support@mydomain.com> שמפנה למייל האישי שלי."

**חיפוש בתיבת הדואר (דורש אישורי כינוי):**

> "מצא את כל המיילים שלא נקראו מהשבוע האחרון שמזכירים 'חשבונית'."

**לוח שנה (דורש אישורי כינוי):**

> "צור לוח שנה בשם 'עבודה' והוסף פגישה למחר בשעה 14:00 בשם 'פגישת צוות'."

**סקריפטים של Sieve:**

> "כתוב סקריפט Sieve עבור <info@mydomain.com> שמגיב אוטומטית למיילים עם 'תודה שפנית אלינו, נחזור אליך תוך 24 שעות.'"

**פעולות בכמות גדולה:**

> "צור כינויים עבור sales@, support@, billing@, ו-info@ ב-mydomain.com, כולם מפנים ל-<team@mydomain.com>."

**בדיקת אבטחה:**

> "בדוק את סטטוס האימות של DNS ו-SMTP עבור כל הדומיינים שלי ואמר לי אם משהו דורש תשומת לב."

**יצירת סיסמת כינוי:**

> "צור סיסמה לכינוי <user@example.com> כדי שאוכל לגשת לתיבת הדואר שלי."


## משתני סביבה {#environment-variables}

| משתנה                         | דרוש    | ברירת מחדל                   | תיאור                                                                          |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | כן       | —                              | מפתח ה-API של Forward Email שלך (משמש כמשתמש Basic auth לנקודות קצה של API)  |
| `FORWARD_EMAIL_ALIAS_USER`     | לא       | —                              | כתובת מייל של כינוי לנקודות קצה של תיבת דואר (למשל `user@example.com`)        |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | לא       | —                              | סיסמת כינוי שנוצרה לנקודות קצה של תיבת דואר                                   |
| `FORWARD_EMAIL_API_URL`        | לא       | `https://api.forwardemail.net` | כתובת בסיס API (לשימוש עצמי או לבדיקות)                                      |


## אבטחה {#security}

שרת MCP רץ מקומית על המחשב שלך. כך האבטחה עובדת:

* **האישורים שלך נשארים מקומיים.** מפתח ה-API ואישורי הכינוי שלך נקראים ממשתני סביבה ומשמשים לאימות בקשות API דרך HTTP Basic auth. הם אף פעם לא נשלחים למודל ה-AI.
* **העברת stdio.** השרת מתקשר עם לקוח ה-AI דרך stdin/stdout. לא נפתחים פורטים ברשת.
* **אין אחסון נתונים.** השרת הוא ללא מצב. הוא לא מטמון, לא מתעד ולא מאחסן שום נתוני מייל שלך.
* **קוד פתוח.** כל בסיס הקוד נמצא ב-[GitHub](https://github.com/forwardemail/mcp-server). אתה יכול לבדוק כל שורה.


## שימוש תכנותי {#programmatic-usage}

ניתן גם להשתמש בשרת כספרייה:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## קוד פתוח {#open-source}

שרת Forward Email MCP הוא [קוד פתוח ב-GitHub](https://github.com/forwardemail/mcp-server) תחת רישיון BUSL-1.1. אנו מאמינים בשקיפות. אם מצאת באג או רוצה תכונה, [פתח נושא](https://github.com/forwardemail/mcp-server/issues).
