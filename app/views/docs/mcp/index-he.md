# שרת Forward Email MCP

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">שרת ה-MCP בקוד פתוח</a> שלנו מאפשר לעוזרי AI כמו Claude, ChatGPT, Cursor ו-Windsurf לנהל את הדוא"ל, הדומיינים, הכינויים, אנשי הקשר והיומנים שלך באמצעות שפה טבעית. כל 68 נקודות הקצה של ה-API חשופות ככלי MCP. הוא פועל באופן מקומי באמצעות <code>npx @forwardemail/mcp-server</code> — פרטי ההתחברות שלך לעולם אינם עוזבים את המחשב שלך.
</p>

## תוכן עניינים

* [מהו MCP?](#what-is-mcp)
* [התחלה מהירה](#quick-start)
  * [קבל מפתח API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [לקוחות MCP אחרים](#other-mcp-clients)
* [אימות](#authentication)
  * [אימות מפתח API](#api-key-auth)
  * [אימות כינוי](#alias-auth)
  * [יצירת סיסמת כינוי](#generating-an-alias-password)
* [כל 68 הכלים](#all-68-tools)
  * [חשבון (מפתח API או אימות כינוי)](#account-api-key-or-alias-auth)
  * [דומיינים (מפתח API)](#domains-api-key)
  * [כינויים (מפתח API)](#aliases-api-key)
  * [מיילים — SMTP יוצא (מפתח API; שליחה תומכת בשניהם)](#emails--outbound-smtp-api-key-send-supports-both)
  * [הודעות — IMAP (אימות כינוי)](#messages--imap-alias-auth)
  * [תיקיות — IMAP (אימות כינוי)](#folders--imap-alias-auth)
  * [אנשי קשר — CardDAV (אימות כינוי)](#contacts--carddav-alias-auth)
  * [יומנים — CalDAV (אימות כינוי)](#calendars--caldav-alias-auth)
  * [אירועי יומן — CalDAV (אימות כינוי)](#calendar-events--caldav-alias-auth)
  * [סקריפטים של Sieve (מפתח API)](#sieve-scripts-api-key)
  * [סקריפטים של Sieve (אימות כינוי)](#sieve-scripts-alias-auth)
  * [חברי דומיין והזמנות (מפתח API)](#domain-members-and-invites-api-key)
  * [סיסמאות Catch-All (מפתח API)](#catch-all-passwords-api-key)
  * [יומנים (מפתח API)](#logs-api-key)
  * [הצפנה (ללא אימות)](#encrypt-no-auth)
* [20 מקרי שימוש אמיתיים](#20-real-world-use-cases)
* [דוגמאות לפקודות](#example-prompts)
* [משתני סביבה](#environment-variables)
* [אבטחה](#security)
* [שימוש תכנותי](#programmatic-usage)
* [קוד פתוח](#open-source)


## מהו MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) הוא תקן פתוח שנוצר על ידי Anthropic המאפשר למודלי AI לקרוא בצורה מאובטחת לכלים חיצוניים. במקום להעתיק ולהדביק תגובות API לחלון צ'אט, MCP מעניק למודל גישה ישירה ומובנית לשירותים שלך.

שרת ה-MCP שלנו עוטף את כל [ה-API של Forward Email](/email-api) — כל נקודת קצה, כל פרמטר — וחושף אותם ככלים שכל לקוח תואם MCP יכול להשתמש בהם. השרת פועל באופן מקומי במחשב שלך באמצעות העברת stdio. פרטי ההתחברות שלך נשארים במשתני הסביבה שלך ולעולם אינם נשלחים למודל ה-AI.


## התחלה מהירה {#quick-start}

### קבל מפתח API {#get-an-api-key}

1. היכנס לחשבון [Forward Email שלך](/my-account/domains).
2. עבור אל **החשבון שלי** ← **אבטחה** ← **מפתחות API**.
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

הפעל מחדש את Claude Desktop. אתה אמור לראות את כלי Forward Email בבורר הכלים.

> **הערה:** המשתנים `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD` הם אופציונליים אך נדרשים עבור כלי תיבת דואר (הודעות, תיקיות, אנשי קשר, יומנים). ראה [אימות](#authentication) לפרטים.

### Cursor {#cursor}

פתח את הגדרות Cursor ← MCP ← הוסף שרת:

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

פתח את הגדרות Windsurf ← MCP ← הוסף שרת עם אותה תצורה כמו לעיל.

### לקוחות MCP אחרים {#other-mcp-clients}

כל לקוח התומך בהעברת MCP stdio יעבוד. הפקודה היא:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## אימות {#authentication}

ה-API של Forward Email משתמש ב**אימות HTTP Basic** עם שני סוגי אישורים שונים בהתאם לנקודת הקצה. שרת ה-MCP מטפל בכך באופן אוטומטי — אתה רק צריך לספק את האישורים הנכונים.

### אימות מפתח API {#api-key-auth}

רוב נקודות הקצה לניהול (דומיינים, כינויים, מיילים יוצאים, יומנים) משתמשות ב**מפתח ה-API** שלך כשם המשתמש של Basic auth עם סיסמה ריקה.

זהו אותו מפתח API שבו אתה משתמש עבור ה-REST API. הגדר אותו באמצעות משתנה הסביבה `FORWARD_EMAIL_API_KEY`.

### אימות כינוי {#alias-auth}

נקודות קצה של תיבת דואר (הודעות, תיקיות, אנשי קשר, יומנים, סקריפטים של Sieve בהיקף כינוי) משתמשות ב**אישורי כינוי** — כתובת הדוא"ל של הכינוי כשם המשתמש וסיסמה שנוצרה כסיסמה.

נקודות קצה אלו ניגשות לנתונים לכל כינוי באמצעות פרוטוקולי IMAP, CalDAV ו-CardDAV. הן דורשות את כתובת הדוא"ל של הכינוי וסיסמה שנוצרה, לא את מפתח ה-API.

אתה יכול לספק אישורי כינוי בשתי דרכים:

1. **משתני סביבה** (מומלץ עבור כינוי ברירת מחדל): הגדר את `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **פרמטרים לכל קריאת כלי**: העבר `alias_username` ו-`alias_password` כארגומנטים לכל כלי אימות כינוי. אלה עוקפים את משתני הסביבה, מה ששימושי בעבודה עם מספר כינויים.

### יצירת סיסמת כינוי {#generating-an-alias-password}

לפני שתוכל להשתמש בכלי אימות כינוי, עליך ליצור סיסמה עבור הכינוי. אתה יכול לעשות זאת באמצעות הכלי `generateAliasPassword` או באמצעות ה-API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

התגובה כוללת את השדות `username` (כתובת הדוא"ל של הכינוי) ו-`password`. השתמש בהם כאישורי הכינוי שלך.

> **טיפ:** אתה יכול גם לבקש מעוזר ה-AI שלך: "צור סיסמה עבור הכינוי user@example.com בדומיין example.com" — הוא יקרא לכלי `generateAliasPassword` ויחזיר את האישורים.

הטבלה שלהלן מסכמת איזו שיטת אימות נדרשת לכל קבוצת כלים:

| קבוצת כלים | שיטת אימות | אישורים |
|-----------|-------------|-------------|
| חשבון | מפתח API **או** אימות כינוי | אחד מהם |
| דומיינים, כינויים, חברי דומיין, הזמנות, סיסמאות Catch-All | מפתח API | `FORWARD_EMAIL_API_KEY` |
| מיילים יוצאים (רשימה, קבל, מחק, הגבלה) | מפתח API | `FORWARD_EMAIL_API_KEY` |
| שלח מייל | מפתח API **או** אימות כינוי | אחד מהם |
| הודעות (IMAP) | אימות כינוי | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| תיקיות (IMAP) | אימות כינוי | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| אנשי קשר (CardDAV) | אימות כינוי | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| יומנים (CalDAV) | אימות כינוי | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| אירועי יומן (CalDAV) | אימות כינוי | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| סקריפטים של Sieve (בהיקף דומיין) | מפתח API | `FORWARD_EMAIL_API_KEY` |
| סקריפטים של Sieve (בהיקף כינוי) | אימות כינוי | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| יומנים | מפתח API | `FORWARD_EMAIL_API_KEY` |
| הצפנה | ללא | אין צורך באישורים |


## כל 68 הכלים {#all-68-tools}

כל כלי ממפה ישירות לנקודת קצה של [Forward Email API](/email-api). פרמטרים משתמשים באותם שמות כמו תיעוד ה-API. שיטת האימות מצוינת בכל כותרת סעיף.

### חשבון (מפתח API או אימות כינוי) {#account-api-key-or-alias-auth}

עם אימות מפתח API, אלה מחזירים את פרטי חשבון המשתמש שלך. עם אימות כינוי, הם מחזירים פרטי כינוי/תיבת דואר כולל מכסת אחסון והגדרות.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | קבל את פרטי החשבון שלך |
| `updateAccount` | `PUT /v1/account` | עדכן את הגדרות החשבון שלך |

### דומיינים (מפתח API) {#domains-api-key}

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | רשום את כל הדומיינים שלך |
| `createDomain` | `POST /v1/domains` | הוסף דומיין חדש |
| `getDomain` | `GET /v1/domains/:domain_id` | קבל פרטי דומיין |
| `updateDomain` | `PUT /v1/domains/:domain_id` | עדכן הגדרות דומיין |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | הסר דומיין |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | אמת רשומות DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | אמת תצורת SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | בדוק חיבור S3 מותאם אישית |

### כינויים (מפתח API) {#aliases-api-key}

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | רשום כינויים עבור דומיין |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | צור כינוי חדש |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | קבל פרטי כינוי |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | עדכן כינוי |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | מחק כינוי |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | צור סיסמת IMAP/SMTP לאימות כינוי |

### מיילים — SMTP יוצא (מפתח API; שליחה תומכת בשניהם) {#emails--outbound-smtp-api-key-send-supports-both}

| כלי | נקודת קצה של API | אימות | תיאור |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | מפתח API או אימות כינוי | שלח מייל באמצעות SMTP |
| `listEmails` | `GET /v1/emails` | מפתח API | רשום מיילים יוצאים |
| `getEmail` | `GET /v1/emails/:id` | מפתח API | קבל פרטי מייל וסטטוס |
| `deleteEmail` | `DELETE /v1/emails/:id` | מפתח API | מחק מייל בתור |
| `getEmailLimit` | `GET /v1/emails/limit` | מפתח API | בדוק את מגבלת השליחה שלך |

הכלי `sendEmail` מקבל `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, ו-`attachments`. זהה לנקודת הקצה `POST /v1/emails`.

### הודעות — IMAP (אימות כינוי) {#messages--imap-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | רשום וחפש הודעות בתיבת דואר |
| `createMessage` | `POST /v1/messages` | צור טיוטה או העלה הודעה |
| `getMessage` | `GET /v1/messages/:id` | קבל הודעה לפי מזהה |
| `updateMessage` | `PUT /v1/messages/:id` | עדכן דגלים (נקרא, מסומן בכוכב וכו') |
| `deleteMessage` | `DELETE /v1/messages/:id` | מחק הודעה |

הכלי `listMessages` תומך ב-15+ פרמטרי חיפוש כולל `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, ו-`has_attachment`. ראה את [תיעוד ה-API](/email-api) לרשימה המלאה.

### תיקיות — IMAP (אימות כינוי) {#folders--imap-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | רשום את כל תיקיות תיבת הדואר |
| `createFolder` | `POST /v1/folders` | צור תיקייה חדשה |
| `getFolder` | `GET /v1/folders/:id` | קבל פרטי תיקייה |
| `updateFolder` | `PUT /v1/folders/:id` | שנה שם תיקייה |
| `deleteFolder` | `DELETE /v1/folders/:id` | מחק תיקייה |

### אנשי קשר — CardDAV (אימות כינוי) {#contacts--carddav-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | רשום את כל אנשי הקשר |
| `createContact` | `POST /v1/contacts` | צור איש קשר חדש |
| `getContact` | `GET /v1/contacts/:id` | קבל פרטי איש קשר |
| `updateContact` | `PUT /v1/contacts/:id` | עדכן איש קשר |
| `deleteContact` | `DELETE /v1/contacts/:id` | מחק איש קשר |

### יומנים — CalDAV (אימות כינוי) {#calendars--caldav-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | רשום את כל היומנים |
| `createCalendar` | `POST /v1/calendars` | צור יומן חדש |
| `getCalendar` | `GET /v1/calendars/:id` | קבל פרטי יומן |
| `updateCalendar` | `PUT /v1/calendars/:id` | עדכן יומן |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | מחק יומן |

### אירועי יומן — CalDAV (אימות כינוי) {#calendar-events--caldav-alias-auth}

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | רשום את כל האירועים |
| `createCalendarEvent` | `POST /v1/calendar-events` | צור אירוע חדש |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | קבל פרטי אירוע |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | עדכן אירוע |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | מחק אירוע |

### סקריפטים של Sieve (מפתח API) {#sieve-scripts-api-key}

אלה משתמשים בנתיבים בהיקף דומיין ומאמתים באמצעות מפתח ה-API שלך.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | רשום סקריפטים עבור כינוי |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | צור סקריפט חדש |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | קבל פרטי סקריפט |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | עדכן סקריפט |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | מחק סקריפט |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | הפעל סקריפט |

### סקריפטים של Sieve (אימות כינוי) {#sieve-scripts-alias-auth}

אלה משתמשים באימות ברמת כינוי. שימושי לאוטומציה לכל כינוי ללא צורך במפתח ה-API.

> **דורש אישורי כינוי.** העבר `alias_username` ו-`alias_password` או הגדר את משתני הסביבה `FORWARD_EMAIL_ALIAS_USER` ו-`FORWARD_EMAIL_ALIAS_PASSWORD`.

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | רשום סקריפטים |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | צור סקריפט |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | קבל פרטי סקריפט |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | עדכן סקריפט |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | מחק סקריפט |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | הפעל סקריפט |

### חברי דומיין והזמנות (מפתח API) {#domain-members-and-invites-api-key}

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | שנה תפקיד של חבר |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | הסר חבר |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | קבל הזמנה ממתינה |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | הזמן מישהו לדומיין |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | בטל הזמנה |

### סיסמאות Catch-All (מפתח API) {#catch-all-passwords-api-key}

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | רשום סיסמאות catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | צור סיסמת catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | מחק סיסמת catch-all |

### יומנים (מפתח API) {#logs-api-key}

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | הורד יומני מסירת דוא"ל |

### הצפנה (ללא אימות) {#encrypt-no-auth}

| כלי | נקודת קצה של API | תיאור |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | הצפן רשומת DNS TXT |

כלי זה אינו דורש אימות. הוא מצפין רשומות העברה כמו `forward-email=user@example.com` לשימוש ברשומות DNS TXT.


## 20 מקרי שימוש אמיתיים {#20-real-world-use-cases}

להלן דרכים מעשיות לשימוש בשרת ה-MCP עם עוזר ה-AI שלך:

### 1. מיון דוא"ל

בקש מה-AI שלך לסרוק את תיבת הדואר הנכנס שלך ולסכם הודעות שלא נקראו. הוא יכול לסמן מיילים דחופים, לסווג לפי שולח, ולנסח תשובות — הכל באמצעות שפה טבעית. *(דורש אישורי כינוי לגישה לתיבת הדואר הנכנס.)*

### 2. אוטומציה של הגדרת דומיין

מגדיר דומיין חדש? בקש מה-AI ליצור את הדומיין, להוסיף את הכינויים שלך, לאמת רשומות DNS, ולבדוק את תצורת ה-SMTP. מה שבדרך כלל לוקח 10 דקות של לחיצות על לוחות מחוונים הופך לשיחה אחת.

### 3. ניהול כינויים בכמות גדולה

צריך ליצור 20 כינויים לפרויקט חדש? תאר מה אתה צריך ותן ל-AI לטפל בעבודה החוזרת על עצמה. הוא יכול ליצור כינויים, להגדיר כללי העברה, וליצור סיסמאות בפעולה אחת.

### 4. ניטור קמפיינים בדוא"ל

בקש מה-AI שלך לבדוק מגבלות שליחה, לרשום מיילים יוצאים אחרונים, ולדווח על סטטוס המסירה. שימושי לניטור תקינות דוא"ל טרנזקציוני.

### 5. סנכרון וניקוי אנשי קשר

השתמש בכלי CardDAV כדי לרשום את כל אנשי הקשר, למצוא כפילויות, לעדכן מידע מיושן, או ליצור אנשי קשר בכמות גדולה מגיליון אלקטרוני שאתה מדביק בצ'אט. *(דורש אישורי כינוי.)*

### 6. ניהול יומנים

צור יומנים, הוסף אירועים, עדכן זמני פגישות, ומחק אירועים שבוטלו — הכל באמצעות שיחה. כלי CalDAV תומכים ב-CRUD מלא הן ביומנים והן באירועים. *(דורש אישורי כינוי.)*

### 7. אוטומציה של סקריפטים של Sieve

סקריפטים של Sieve חזקים אך התחביר שלהם ארכאי. בקש מה-AI שלך לכתוב עבורך סקריפטים של Sieve: "סנן את כל המיילים מ-billing@example.com לתיקיית חיובים" הופך לסקריפט עובד מבלי לגעת במפרט RFC 5228.

### 8. קליטת צוות

כאשר חבר צוות חדש מצטרף, בקש מה-AI ליצור את הכינוי שלו, ליצור סיסמה, לשלוח לו מייל קבלת פנים עם פרטי ההתחברות שלו, ולהוסיף אותו כחבר דומיין. פקודה אחת, ארבע קריאות API.

### 9. ביקורת אבטחה

בקש מה-AI שלך לרשום את כל הדומיינים, לבדוק את סטטוס אימות ה-DNS, לסקור תצורות כינויים, ולזהות כל דומיין עם רשומות לא מאומתות. סריקת אבטחה מהירה בשפה טבעית.

### 10. הגדרת העברת דוא"ל

מגדיר העברת דוא"ל לדומיין חדש? בקש מה-AI ליצור את הדומיין, להוסיף כינויי העברה, להצפין את רשומות ה-DNS, ולאמת שהכל מוגדר כהלכה.

### 11. חיפוש וניתוח תיבת דואר נכנס

השתמש בכלי חיפוש ההודעות כדי למצוא מיילים ספציפיים: "מצא את כל המיילים מ-john@example.com ב-30 הימים האחרונים שיש להם קבצים מצורפים." 15+ פרמטרי החיפוש הופכים זאת לחזק. *(דורש אישורי כינוי.)*

### 12. ארגון תיקיות

בקש מה-AI שלך ליצור מבנה תיקיות לפרויקט חדש, להעביר הודעות בין תיקיות, או לנקות תיקיות ישנות שאינך זקוק להן עוד. *(דורש אישורי כינוי.)*

### 13. סיבוב סיסמאות

צור סיסמאות כינוי חדשות באופן קבוע. בקש מה-AI שלך ליצור סיסמה חדשה לכל כינוי ולדווח על האישורים החדשים.

### 14. הצפנת רשומות DNS

הצפן את רשומות ההעברה שלך לפני הוספתן ל-DNS. הכלי `encryptRecord` מטפל בכך ללא אימות — שימושי להצפנות חד פעמיות מהירות.

### 15. ניתוח יומן מסירה

הורד את יומני מסירת הדוא"ל שלך ובקש מה-AI לנתח שיעורי החזרה, לזהות נמענים בעייתיים, או לעקוב אחר זמני מסירה.

### 16. ניהול ריבוי דומיינים

אם אתה מנהל מספר דומיינים, בקש מה-AI לתת לך דוח סטטוס: אילו דומיינים מאומתים, אילו יש להם בעיות, כמה כינויים יש לכל אחד, ואיך נראות מגבלות השליחה.

### 17. תצורת Catch-All

הגדר סיסמאות catch-all לדומיינים שצריכים לקבל דוא"ל לכל כתובת. ה-AI יכול ליצור, לרשום ולנהל את הסיסמאות האלה עבורך.

### 18. ניהול הזמנות דומיין

הזמן חברי צוות לנהל דומיינים, בדוק הזמנות ממתינות, ונקה הזמנות שפג תוקפן. שימושי לארגונים עם מספר מנהלי דומיינים.

### 19. בדיקת אחסון S3

אם אתה משתמש באחסון S3 מותאם אישית לגיבוי דוא"ל, בקש מה-AI לבדוק את החיבור ולאמת שהוא פועל כהלכה.

### 20. כתיבת טיוטת דוא"ל

צור טיוטות מיילים בתיבת הדואר שלך מבלי לשלוח אותן. שימושי להכנת מיילים הדורשים בדיקה לפני השליחה, או לבניית תבניות מייל. *(דורש אישורי כינוי.)*


## דוגמאות לפקודות {#example-prompts}

להלן פקודות שתוכל להשתמש בהן ישירות עם עוזר ה-AI שלך:

**שליחת מייל:**
> "שלח מייל מ-hello@mydomain.com ל-john@example.com עם הנושא 'פגישה מחר' והגוף 'היי ג'ון, האם אנחנו עדיין נפגשים ב-2 בצהריים?'"

**ניהול דומיין:**
> "רשום את כל הדומיינים שלי ותגיד לי אילו מהם יש להם רשומות DNS לא מאומתות."

**יצירת כינוי:**
> "צור כינוי חדש support@mydomain.com שיעביר לכתובת הדוא"ל האישית שלי."

**חיפוש בתיבת דואר נכנס (דורש אישורי כינוי):**
> "מצא את כל המיילים שלא נקראו מהשבוע האחרון שמזכירים 'חשבונית'."

**יומן (דורש אישורי כינוי):**
> "צור יומן בשם 'עבודה' והוסף פגישה למחר בשעה 2 בצהריים בשם 'פגישת צוות'."

**סקריפטים של Sieve:**
> "כתוב סקריפט Sieve עבור info@mydomain.com שיענה אוטומטית למיילים עם 'תודה שפנית אלינו, נחזור אליך תוך 24 שעות'."

**פעולות בכמות גדולה:**
> "צור כינויים עבור sales@, support@, billing@, ו-info@ ב-mydomain.com, כולם מועברים ל-team@mydomain.com."

**בדיקת אבטחה:**
> "בדוק את סטטוס אימות ה-DNS וה-SMTP עבור כל הדומיינים שלי ותגיד לי אם משהו דורש תשומת לב."

**צור סיסמת כינוי:**
> "צור סיסמה עבור הכינוי user@example.com כדי שאוכל לגשת לתיבת הדואר הנכנס שלי."


## משתני סביבה {#environment-variables}

| משתנה | נדרש | ברירת מחדל | תיאור |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | כן | — | מפתח ה-API שלך של Forward Email (משמש כשם משתמש של Basic auth עבור נקודות קצה של מפתח API) |
| `FORWARD_EMAIL_ALIAS_USER` | לא | — | כתובת דוא"ל של כינוי עבור נקודות קצה של תיבת דואר (לדוגמה `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | לא | — | סיסמת כינוי שנוצרה עבור נקודות קצה של תיבת דואר |
| `FORWARD_EMAIL_API_URL` | לא | `https://api.forwardemail.net` | כתובת URL בסיסית של ה-API (עבור אירוח עצמי או בדיקה) |


## אבטחה {#security}

שרת ה-MCP פועל באופן מקומי במחשב שלך. כך פועלת האבטחה:

*   **פרטי ההתחברות שלך נשארים מקומיים.** גם מפתח ה-API שלך וגם אישורי הכינוי נקראים ממשתני סביבה ומשמשים לאימות בקשות API באמצעות אימות HTTP Basic. הם לעולם אינם נשלחים למודל ה-AI.
*   **העברת stdio.** השרת מתקשר עם לקוח ה-AI באמצעות stdin/stdout. אין יציאות רשת נפתחות.
*   **אין אחסון נתונים.** השרת חסר מצב. הוא אינו שומר במטמון, מתעד או מאחסן אף אחד מנתוני הדוא"ל שלך.
*   **קוד פתוח.** כל בסיס הקוד נמצא ב-[GitHub](https://github.com/forwardemail/mcp-server). אתה יכול לבדוק כל שורה.


## שימוש תכנותי {#programmatic-usage}

אתה יכול גם להשתמש בשרת כספרייה:

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

שרת ה-Forward Email MCP הוא [קוד פתוח ב-GitHub](https://github.com/forwardemail/mcp-server) תחת רישיון BUSL-1.1. אנו מאמינים בשקיפות. אם מצאת באג או רוצה תכונה, [פתח בעיה](https://github.com/forwardemail/mcp-server/issues).
