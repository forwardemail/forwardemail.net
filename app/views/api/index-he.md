# API דואר אלקטרוני {#email-api}


## תוכן העניינים {#table-of-contents}

* [ספריות](#libraries)
* [כתובת בסיסית](#base-uri)
* [אימות](#authentication)
  * [אימות באמצעות אסימון API (מומלץ לרוב נקודות הקצה)](#api-token-authentication-recommended-for-most-endpoints)
  * [אימות באמצעות אישורי כינוי (לדואר יוצא)](#alias-credentials-authentication-for-outbound-email)
  * [נקודות קצה של כינוי בלבד](#alias-only-endpoints)
* [שגיאות](#errors)
* [לוקליזציה](#localization)
* [דפדוף](#pagination)
* [יומנים](#logs)
  * [שליפת יומנים](#retrieve-logs)
* [חשבון](#account)
  * [יצירת חשבון](#create-account)
  * [שליפת חשבון](#retrieve-account)
  * [עדכון חשבון](#update-account)
* [אנשי קשר של כינוי (CardDAV)](#alias-contacts-carddav)
  * [רשימת אנשי קשר](#list-contacts)
  * [יצירת איש קשר](#create-contact)
  * [שליפת איש קשר](#retrieve-contact)
  * [עדכון איש קשר](#update-contact)
  * [מחיקת איש קשר](#delete-contact)
* [לוחות שנה של כינוי (CalDAV)](#alias-calendars-caldav)
  * [רשימת לוחות שנה](#list-calendars)
  * [יצירת לוח שנה](#create-calendar)
  * [שליפת לוח שנה](#retrieve-calendar)
  * [עדכון לוח שנה](#update-calendar)
  * [מחיקת לוח שנה](#delete-calendar)
* [הודעות של כינוי (IMAP/POP3)](#alias-messages-imappop3)
  * [רשימה וחיפוש הודעות](#list-and-search-for-messages)
  * [יצירת הודעה](#create-message)
  * [שליפת הודעה](#retrieve-message)
  * [עדכון הודעה](#update-message)
  * [מחיקת הודעה](#delete-message)
* [תיקיות של כינוי (IMAP/POP3)](#alias-folders-imappop3)
  * [רשימת תיקיות](#list-folders)
  * [יצירת תיקיה](#create-folder)
  * [שליפת תיקיה](#retrieve-folder)
  * [עדכון תיקיה](#update-folder)
  * [מחיקת תיקיה](#delete-folder)
  * [העתקת תיקיה](#copy-folder)
* [דואר יוצא](#outbound-emails)
  * [קבלת מגבלת דואר SMTP יוצא](#get-outbound-smtp-email-limit)
  * [רשימת דואר SMTP יוצא](#list-outbound-smtp-emails)
  * [יצירת דואר SMTP יוצא](#create-outbound-smtp-email)
  * [שליפת דואר SMTP יוצא](#retrieve-outbound-smtp-email)
  * [מחיקת דואר SMTP יוצא](#delete-outbound-smtp-email)
* [דומיינים](#domains)
  * [רשימת דומיינים](#list-domains)
  * [יצירת דומיין](#create-domain)
  * [שליפת דומיין](#retrieve-domain)
  * [אימות רשומות דומיין](#verify-domain-records)
  * [אימות רשומות SMTP של דומיין](#verify-domain-smtp-records)
  * [רשימת סיסמאות catch-all כלל-דומיין](#list-domain-wide-catch-all-passwords)
  * [יצירת סיסמת catch-all כלל-דומיין](#create-domain-wide-catch-all-password)
  * [הסרת סיסמת catch-all כלל-דומיין](#remove-domain-wide-catch-all-password)
  * [עדכון דומיין](#update-domain)
  * [מחיקת דומיין](#delete-domain)
* [הזמנות](#invites)
  * [קבלת הזמנת דומיין](#accept-domain-invite)
  * [יצירת הזמנת דומיין](#create-domain-invite)
  * [הסרת הזמנת דומיין](#remove-domain-invite)
* [חברים](#members)
  * [עדכון חבר דומיין](#update-domain-member)
  * [הסרת חבר דומיין](#remove-domain-member)
* [כינויים](#aliases)
  * [יצירת סיסמת כינוי](#generate-an-alias-password)
  * [רשימת כינויים בדומיין](#list-domain-aliases)
  * [יצירת כינוי דומיין חדש](#create-new-domain-alias)
  * [שליפת כינוי דומיין](#retrieve-domain-alias)
  * [עדכון כינוי דומיין](#update-domain-alias)
  * [מחיקת כינוי דומיין](#delete-domain-alias)
* [הצפנה](#encrypt)
  * [הצפנת רשומת TXT](#encrypt-txt-record)


## ספריות {#libraries}

כרגע עדיין לא פרסמנו עטיפות API, אבל אנו מתכננים לעשות זאת בעתיד הקרוב. שלח דואר אלקטרוני ל-<api@forwardemail.net> אם ברצונך לקבל הודעה כאשר עטיפת API בשפת תכנות מסוימת תפורסם. בינתיים, תוכל להשתמש בספריות בקשות HTTP המומלצות האלה באפליקציה שלך, או פשוט להשתמש ב-[curl](https://stackoverflow.com/a/27442239/3586413) כפי שמודגם בדוגמאות למטה.

| שפה       | ספריה                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (אנחנו המתחזקים)    |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (אנחנו המתחזקים)    |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

נתיב ה-HTTP הבסיסי הנוכחי הוא: `BASE_URI`.


## Authentication {#authentication}

כל נקודות הקצה דורשות אימות באמצעות [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). אנו תומכים בשתי שיטות אימות:

### API Token Authentication (מומלץ לרוב נקודות הקצה) {#api-token-authentication-recommended-for-most-endpoints}

הגדר את [מפתח ה-API שלך](https://forwardemail.net/my-account/security) כערך "username" עם סיסמה ריקה:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

שים לב לנקודתיים (`:`) אחרי אסימון ה-API – זה מציין סיסמה ריקה בפורמט Basic Auth.

### Alias Credentials Authentication (לדואר יוצא) {#alias-credentials-authentication-for-outbound-email}

נקודת הקצה [Create outbound SMTP email](#create-outbound-smtp-email) תומכת גם באימות באמצעות כתובת הדואר האלקטרוני של הכינוי שלך וסיסמת כינוי [שנוצרה](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

שיטה זו שימושית כאשר שולחים מיילים מיישומים שכבר משתמשים באישורי SMTP ומאפשרת מעבר חלק מ-SMTP ל-API שלנו.

### Alias-Only Endpoints {#alias-only-endpoints}

נקודות הקצה [Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), ו-[Alias Folders](#alias-folders-imappop3) דורשות אישורי כינוי ואינן תומכות באימות באמצעות אסימון API.

אל תדאג – דוגמאות מסופקות למטה אם אינך בטוח מה זה.


## Errors {#errors}

אם מתרחשות שגיאות, גוף התגובה של בקשת ה-API יכיל הודעת שגיאה מפורטת.

| Code | Name                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | בקשה שגויה           |
| 401  | לא מאומת             |
| 403  | אסור                 |
| 404  | לא נמצא              |
| 429  | יותר מדי בקשות       |
| 500  | שגיאת שרת פנימית     |
| 501  | לא מיושם             |
| 502  | שער שגוי             |
| 503  | שירות לא זמין        |
| 504  | פקיעת זמן שער        |

> \[!TIP]
> אם אתה מקבל קוד סטטוס 5xx (שלא אמור לקרות), אנא פנה אלינו בכתובת <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> ונעזור לך לפתור את הבעיה מיד.


## Localization {#localization}

השירות שלנו מתורגם ליותר מ-25 שפות שונות. כל הודעות התגובה של ה-API מתורגמות לשפת הממשק האחרונה שזוהתה של המשתמש המבצע את בקשת ה-API. ניתן לעקוף זאת על ידי העברת כותרת מותאמת אישית `Accept-Language`. אל תהסס לנסות זאת באמצעות תפריט השפות בתחתית הדף.


## Pagination {#pagination}

> \[!NOTE]
> החל מ-1 בנובמבר 2024 נקודות הקצה של [List domains](#list-domains) ו-[List domain aliases](#list-domain-aliases) יוגדרו כברירת מחדל ל-`1000` תוצאות מקסימום לעמוד. אם ברצונך להפעיל התנהגות זו מוקדם יותר, תוכל להעביר `?paginate=true` כפרמטר נוסף ב-querystring לכתובת ה-URL של נקודת הקצה.

דפדוף (Pagination) נתמך בכל נקודות הקצה שמציגות רשימות תוצאות.

פשוט ספק את מאפייני ה-querystring `page` (ואופציונלית `limit`).

המאפיין `page` צריך להיות מספר גדול או שווה ל-`1`. אם תספק `limit` (גם מספר), הערך המינימלי הוא `10` והמקסימלי הוא `50` (אלא אם צוין אחרת).

| Querystring Parameter | Required | Type   | Description                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | No       | Number | עמוד התוצאות להחזרה. אם לא צויין, ערך `page` יהיה `1`. חייב להיות מספר גדול או שווה ל-`1`.                                                             |
| `limit`               | No       | Number | מספר התוצאות להחזרה בכל עמוד. ברירת המחדל היא `10` אם לא צויין. חייב להיות מספר גדול או שווה ל-`1`, ופחות או שווה ל-`50`.                            |
כדי לקבוע האם ישנם תוצאות נוספות זמינות, אנו מספקים את כותרות התגובה HTTP הבאות (שאתה יכול לנתח כדי לבצע דפדוף תוצאות באופן תכנותי):

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | סך כל מספר הדפים הזמינים.                                                                                                                                                                                                                                                                                                                                       |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | הדף הנוכחי של התוצאות שהוחזרו (למשל בהתבסס על פרמטר השאילתה `page`).                                                                                                                                                                                                                                                                                           |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | סך כל מספר התוצאות בדף שהוחזר (למשל בהתבסס על פרמטר השאילתה `limit` והתוצאות בפועל שהוחזרו).                                                                                                                                                                                                                                                                    |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | סך כל מספר הפריטים הזמינים בכל הדפים.                                                                                                                                                                                                                                                                                                                          |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | אנו מספקים כותרת תגובת HTTP בשם `Link` שניתן לנתח כפי שמוצג בדוגמה. זה [דומה ל-GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (למשל לא כל הערכים יסופקו אם אינם רלוונטיים או זמינים, לדוגמה `"next"` לא יסופק אם אין דף נוסף).                                         |
> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## יומנים {#logs}

### שליפת יומנים {#retrieve-logs}

ה-API שלנו מאפשר לך להוריד יומנים עבור החשבון שלך באופן תכנותי. שליחת בקשה לנקודת הקצה הזו תעבד את כל היומנים עבור החשבון שלך ותשלח אותם אליך במייל כקובץ מצורף (קובץ [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) דחוס ב-[Gzip](https://en.wikipedia.org/wiki/Gzip)) לאחר סיום התהליך.

זה מאפשר לך ליצור עבודות רקע עם [Cron job](https://en.wikipedia.org/wiki/Cron) או באמצעות תוכנת תזמון עבודות שלנו [Bree ל-Node.js](https://github.com/breejs/bree) כדי לקבל יומנים מתי שתרצה. שים לב שנקודת קצה זו מוגבלת ל-`10` בקשות ביום.

הקובץ המצורף הוא בצורה קטנה של `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` והמייל עצמו מכיל סיכום קצר של היומנים שנשלפו. ניתן גם להוריד יומנים בכל עת מ-[החשבון שלי → יומנים](/my-account/logs)

> `GET /v1/logs/download`

| פרמטר מחרוזת השאילתה | חובה | סוג           | תיאור                                                                                                                         |
| --------------------- | ---- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | לא   | מחרוזת (FQDN) | סינון יומנים לפי דומיין מלא ("FQDN"). אם לא תספק זאת, יישלפו כל היומנים מכל הדומיינים.                                      |
| `q`                   | לא   | מחרוזת        | חיפוש יומנים לפי אימייל, דומיין, שם כינוי, כתובת IP, או תאריך (בפורמט `M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, או `M.D.YY`).       |
| `bounce_category`     | לא   | מחרוזת        | חיפוש יומנים לפי קטגוריית החזרה ספציפית (למשל `blocklist`).                                                                   |
| `response_code`       | לא   | מספר          | חיפוש יומנים לפי קוד תגובת שגיאה ספציפי (למשל `421` או `550`).                                                               |

> בקשת דוגמה:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> דוגמת Cron job (בחצות כל יום):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

שים לב שניתן להשתמש בשירותים כמו [Crontab.guru](https://crontab.guru/) כדי לאמת את תחביר הביטוי של עבודת ה-cron שלך.

> דוגמת Cron job (בחצות כל יום **ועם יומנים של היום הקודם**):

ל-MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

ל-Linux ואובונטו:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## חשבון {#account}

### יצירת חשבון {#create-account}

> `POST /v1/account`

| פרמטר גוף | חובה | סוג            | תיאור          |
| ---------- | ---- | -------------- | -------------- |
| `email`    | כן   | מחרוזת (אימייל) | כתובת אימייל   |
| `password` | כן   | מחרוזת         | סיסמה          |

> בקשת דוגמה:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### שליפת חשבון {#retrieve-account}

> `GET /v1/account`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### עדכון חשבון {#update-account}

> `PUT /v1/account`

| פרמטר גוף    | חובה | סוג            | תיאור               |
| ------------ | ---- | -------------- | ------------------- |
| `email`      | לא   | מחרוזת (אימייל) | כתובת אימייל        |
| `given_name` | לא   | מחרוזת         | שם פרטי             |
| `family_name`| לא   | מחרוזת         | שם משפחה            |
| `avatar_url` | לא   | מחרוזת (URL)   | קישור לתמונת אווטאר |

> בקשת דוגמה:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## אנשי קשר כינוי (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> בניגוד לנקודות קצה אחרות ב-API, אלו דורשים [אימות](#authentication) עם "שם משתמש" השווה לשם המשתמש של הכינוי ו"סיסמה" השווה לסיסמה שנוצרה לכינוי, ככותרות הרשאה בסיסית (Basic Authorization).
> \[!WARNING]
> קטע נקודת הקצה הזה נמצא בעבודה ויושק (ככל הנראה) בשנת 2024. בינתיים אנא השתמש בלקוח IMAP מתוך תפריט "Apps" בניווט באתר שלנו.

### רשימת אנשי קשר {#list-contacts}

> `GET /v1/contacts`

**בקרוב**

### יצירת איש קשר {#create-contact}

> `POST /v1/contacts`

**בקרוב**

### שליפת איש קשר {#retrieve-contact}

> `GET /v1/contacts/:id`

**בקרוב**

### עדכון איש קשר {#update-contact}

> `PUT /v1/contacts/:id`

**בקרוב**

### מחיקת איש קשר {#delete-contact}

> `DELETE /v1/contacts/:id`

**בקרוב**


## יומנים של כינויים (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> בניגוד לנקודות קצה אחרות ב-API, אלו דורשים [אימות](#authentication) עם "שם משתמש" השווה לשם המשתמש של הכינוי ו"סיסמה" השווה לסיסמה שנוצרה עבור הכינוי בכותרות הרשאה בסיסית.

> \[!WARNING]
> קטע נקודת הקצה הזה נמצא בעבודה ויושק (ככל הנראה) בשנת 2024. בינתיים אנא השתמש בלקוח IMAP מתוך תפריט "Apps" בניווט באתר שלנו.

### רשימת יומנים {#list-calendars}

> `GET /v1/calendars`

**בקרוב**

### יצירת יומן {#create-calendar}

> `POST /v1/calendars`

**בקרוב**

### שליפת יומן {#retrieve-calendar}

> `GET /v1/calendars/:id`

**בקרוב**

### עדכון יומן {#update-calendar}

> `PUT /v1/calendars/:id`

**בקרוב**

### מחיקת יומן {#delete-calendar}

> `DELETE /v1/calendars/:id`

**בקרוב**


## הודעות כינויים (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> בניגוד לנקודות קצה אחרות ב-API, אלו דורשים [אימות](#authentication) עם "שם משתמש" השווה לשם המשתמש של הכינוי ו"סיסמה" השווה לסיסמה שנוצרה עבור הכינוי בכותרות הרשאה בסיסית.

> \[!WARNING]
> קטע נקודת הקצה הזה נמצא בעבודה ויושק (ככל הנראה) בשנת 2024. בינתיים אנא השתמש בלקוח IMAP מתוך תפריט "Apps" בניווט באתר שלנו.

אנא ודא שעברת את הוראות ההגדרה עבור הדומיין שלך.

הוראות אלו נמצאות בקטע השאלות הנפוצות שלנו [האם אתם תומכים בקבלת דואר אלקטרוני עם IMAP?](/faq#do-you-support-receiving-email-with-imap).

### רשימה וחיפוש הודעות {#list-and-search-for-messages}

> `GET /v1/messages`

**בקרוב**

### יצירת הודעה {#create-message}

> \[!NOTE]
> פעולה זו **לא** תשלח דואר אלקטרוני – היא רק תוסיף את ההודעה לתיקיית תיבת הדואר שלך (לדוגמה, זה דומה לפקודת IMAP `APPEND`). אם ברצונך לשלוח דואר אלקטרוני, ראה [יצירת דואר SMTP יוצא](#create-outbound-smtp-email) למטה. לאחר יצירת דואר SMTP יוצא, תוכל להוסיף עותק שלו באמצעות נקודת קצה זו לתיבת הדואר של הכינוי שלך לצרכי אחסון.

> `POST /v1/messages`

**בקרוב**

### שליפת הודעה {#retrieve-message}

> `GET /v1/messages/:id`

**בקרוב**

### עדכון הודעה {#update-message}

> `PUT /v1/messages/:id`

**בקרוב**

### מחיקת הודעה {#delete-message}

> `DELETE /v1/messages:id`

**בקרוב**


## תיקיות כינויים (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> נקודות קצה של תיקיות עם נתיב תיקייה <code>/v1/folders/:path</code> כנקודת הקצה שלהן ניתנות להחלפה עם מזהה תיקייה <code>:id</code>. משמעות הדבר היא שניתן להתייחס לתיקייה לפי <code>path</code> או לפי <code>id</code> שלה.

> \[!WARNING]
> קטע נקודת הקצה הזה נמצא בעבודה ויושק (ככל הנראה) בשנת 2024. בינתיים אנא השתמש בלקוח IMAP מתוך תפריט "Apps" בניווט באתר שלנו.

### רשימת תיקיות {#list-folders}

> `GET /v1/folders`

**בקרוב**

### יצירת תיקייה {#create-folder}

> `POST /v1/folders`

**בקרוב**

### שליפת תיקייה {#retrieve-folder}

> `GET /v1/folders/:id`

**בקרוב**

### עדכון תיקייה {#update-folder}

> `PUT /v1/folders/:id`

**בקרוב**

### מחיקת תיקייה {#delete-folder}

> `DELETE /v1/folders/:id`

**בקרוב**

### העתקת תיקייה {#copy-folder}

> `POST /v1/folders/:id/copy`

**בקרוב**


## דואר יוצא {#outbound-emails}

אנא ודא שעברת את הוראות ההגדרה עבור הדומיין שלך.

הוראות אלו נמצאות ב-[החשבון שלי → דומיינים → הגדרות → הגדרת SMTP יוצא](/my-account/domains). עליך לוודא הגדרה של DKIM, Return-Path ו-DMARC לשליחת SMTP יוצא עם הדומיין שלך.
### קבלת מגבלת דוא"ל SMTP יוצא {#get-outbound-smtp-email-limit}

זהו נקודת קצה פשוטה שמחזירה אובייקט JSON המכיל את ה-`count` וה-`limit` למספר ההודעות היומיות של SMTP יוצא על בסיס חשבון.

> `GET /v1/emails/limit`

> דוגמת בקשה:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### רשימת דואלי SMTP יוצאים {#list-outbound-smtp-emails}

שימו לב שנקודת קצה זו אינה מחזירה ערכי נכסים עבור `message`, `headers`, או `rejectedErrors` של דוא"ל.

כדי להחזיר את אותם נכסים וערכיהם, אנא השתמשו בנקודת הקצה [Retrieve email](#retrieve-email) עם מזהה הדוא"ל.

> `GET /v1/emails`

| פרמטר מחרוזת השאילתה | חובה | סוג                      | תיאור                                                                                                                                               |
| --------------------- | -------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | לא       | מחרוזת (תמיכה ב-RegExp)   | חיפוש דואלים לפי מטא-דאטה                                                                                                                         |
| `domain`              | לא       | מחרוזת (תמיכה ב-RegExp)   | חיפוש דואלים לפי שם דומיין                                                                                                                         |
| `sort`                | לא       | מחרוזת                    | מיון לפי שדה מסוים (הוסף מקף יחיד `-` כדי למיין בכיוון ההפוך של אותו שדה). ברירת המחדל היא `created_at` אם לא מוגדר.                              |
| `page`                | לא       | מספר                     | ראה [Pagination](#pagination) לפרטים נוספים                                                                                                       |
| `limit`               | לא       | מספר                     | ראה [Pagination](#pagination) לפרטים נוספים                                                                                                       |

> דוגמת בקשה:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### יצירת דוא"ל SMTP יוצא {#create-outbound-smtp-email}

ממשק ה-API שלנו ליצירת דוא"ל מושפע ומשתמש באפשרויות ההגדרה של הודעות Nodemailer. אנא עיינו ב-[הגדרת הודעות Nodemailer](https://nodemailer.com/message/) עבור כל פרמטרי הגוף למטה.

שימו לב כי למעט `envelope` ו-`dkim` (שאנחנו מגדירים אוטומטית עבורכם), אנו תומכים בכל אפשרויות Nodemailer. אנו מגדירים אוטומטית את האפשרויות `disableFileAccess` ו-`disableUrlAccess` ל-`true` למטרות אבטחה.

עליכם להעביר או את האפשרות היחידה `raw` עם הדוא"ל המלא הגולמי כולל הכותרות **או** להעביר פרמטרים נפרדים של גוף ההודעה למטה.

נקודת קצה זו תקודד אוטומטית אימוג'ים עבורכם אם הם נמצאים בכותרות (למשל שורת נושא של `Subject: 🤓 Hello` תומר אוטומטית ל-`Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). המטרה שלנו הייתה ליצור API דוא"ל ידידותי מאוד למפתחים ועמיד לטעויות.

**אימות:** נקודת קצה זו תומכת גם ב-[אימות באמצעות אסימון API](#api-token-authentication-recommended-for-most-endpoints) וגם ב-[אימות באמצעות אישורי כינוי](#alias-credentials-authentication-for-outbound-email). ראו את הסעיף [Authentication](#authentication) למעלה לפרטים.

> `POST /v1/emails`

| פרמטר גוף       | חובה | סוג              | תיאור                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | לא       | מחרוזת (דוא"ל)   | כתובת הדוא"ל של השולח (חייבת להתקיים ככינוי של הדומיין).                                                                                                                                                                                                                                                                                                                                                                                                     |
| `to`             | לא       | מחרוזת או מערך   | רשימה מופרדת בפסיקים או מערך של נמענים לכותרת "To".                                                                                                                                                                                                                                                                                                                                                                                                           |
| `cc`             | לא       | מחרוזת או מערך   | רשימה מופרדת בפסיקים או מערך של נמענים לכותרת "Cc".                                                                                                                                                                                                                                                                                                                                                                                                           |
| `bcc`            | לא       | מחרוזת או מערך   | רשימה מופרדת בפסיקים או מערך של נמענים לכותרת "Bcc".                                                                                                                                                                                                                                                                                                                                                                                                          |
| `subject`        | לא       | מחרוזת           | נושא הדוא"ל.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `text`           | לא       | מחרוזת או Buffer | הגרסה הטקסטואלית הפשוטה של ההודעה.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `html`           | לא       | מחרוזת או Buffer | הגרסה ב-HTML של ההודעה.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachments`    | לא       | מערך             | מערך של אובייקטים מצורפים (ראה [שדות נפוצים של Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                   |
| `sender`         | לא       | מחרוזת           | כתובת הדוא"ל לכותרת "Sender" (ראה [שדות מתקדמים יותר של Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                                  |
| `replyTo`        | לא       | מחרוזת           | כתובת הדוא"ל לכותרת "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `inReplyTo`      | לא       | מחרוזת           | מזהה ההודעה (Message-ID) שההודעה היא תגובה אליו.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `references`     | לא       | מחרוזת או מערך   | רשימה מופרדת ברווחים או מערך של מזהי הודעות (Message-ID's).                                                                                                                                                                                                                                                                                                                                                                                                  |
| `attachDataUrls` | לא       | בוליאני          | אם `true` אז ממיר תמונות מסוג `data:` בתוכן ה-HTML של ההודעה לקבצים מצורפים מוטמעים.                                                                                                                                                                                                                                                                                                                                                                            |
| `watchHtml`      | לא       | מחרוזת           | גרסת HTML ספציפית ל-Apple Watch של ההודעה ([לפי מסמכי Nodemailer](https://nodemailer.com/message/#content-options]), השעונים החדשים ביותר אינם דורשים הגדרה זו).                                                                                                                                                                                                                                                                                             |
| `amp`            | לא       | מחרוזת           | גרסת HTML ספציפית ל-AMP4EMAIL של ההודעה (ראה [דוגמת Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                                  |
| `icalEvent`      | לא       | אובייקט          | אירוע iCalendar לשימוש כתוכן חלופי של ההודעה (ראה [אירועי לוח שנה של Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                                            |
| `alternatives`   | לא       | מערך             | מערך של תוכן חלופי להודעה (ראה [תוכן חלופי של Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                                       |
| `encoding`       | לא       | מחרוזת           | קידוד למחרוזות הטקסט וה-HTML (ברירת מחדל היא `"utf-8"`, אך תומך גם בקידודים `"hex"` ו-`"base64"`).                                                                                                                                                                                                                                                                                                                                                              |
| `raw`            | לא       | מחרוזת או Buffer | הודעה בפורמט RFC822 שנוצרה בהתאמה אישית לשימוש (במקום הודעה שנוצרה על ידי Nodemailer – ראה [מקור מותאם אישית של Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                               |
| `textEncoding`   | לא       | מחרוזת           | קידוד שמוחלט לשימוש עבור ערכי טקסט (או `"quoted-printable"` או `"base64"`). הערך ברירת המחדל הוא הערך הקרוב ביותר שזוהה (ל-ASCII השתמשו ב-`"quoted-printable"`).                                                                                                                                                                                                                                                                                          |
| `priority`       | לא       | מחרוזת           | רמת עדיפות לדוא"ל (יכולה להיות `"high"`, `"normal"` (ברירת מחדל), או `"low"`). שימו לב שערך `"normal"` אינו מגדיר כותרת עדיפות (זו ההתנהגות ברירת המחדל). אם מוגדר ערך `"high"` או `"low"`, אז כותרות `X-Priority`, `X-MSMail-Priority`, ו-`Importance` [יוגדרו בהתאם](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | לא       | אובייקט או מערך | אובייקט או מערך של שדות כותרת נוספים להגדרה (ראה [כותרות מותאמות אישית של Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                     |
| `messageId`      | לא       | מחרוזת           | ערך אופציונלי של Message-ID לכותרת "Message-ID" (ערך ברירת מחדל יווצר אוטומטית אם לא מוגדר – שימו לב שהערך צריך [לעמוד במפרט RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                                               |
| `date`           | לא       | מחרוזת או תאריך | ערך תאריך אופציונלי שישמש אם כותרת התאריך חסרה לאחר הפירוש, אחרת ישמש מחרוזת UTC נוכחית אם לא מוגדר. כותרת התאריך לא יכולה להיות יותר מ-30 יום קדימה מהזמן הנוכחי.                                                                                                                                                                                                                                                                                       |
| `list`           | לא       | אובייקט          | אובייקט אופציונלי של כותרות `List-*` (ראה [כותרות רשימה של Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                         |
> בקשת דוגמה (אסימון API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> בקשת דוגמה (פרטי זיהוי של כינוי):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> בקשת דוגמה (אימייל גולמי):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### שלוף אימייל SMTP יוצא {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### מחק אימייל SMTP יוצא {#delete-outbound-smtp-email}

מחיקת אימייל תגדיר את הסטטוס ל- `"rejected"` (ולא תעבד אותו בתור) אם ורק אם הסטטוס הנוכחי הוא אחד מ- `"pending"`, `"queued"`, או `"deferred"`. ייתכן שנמחק אימיילים אוטומטית לאחר 30 יום מאז שנוצרו ו/או נשלחו – לכן מומלץ לשמור עותק של אימיילי SMTP יוצאים בלקוח, במסד הנתונים או באפליקציה שלך. ניתן להתייחס לערך מזהה האימייל שלנו במסד הנתונים שלך אם תרצה – ערך זה מוחזר משני נקודות הקצה [Create email](#create-email) ו-[Retrieve email](#retrieve-email).

> `DELETE /v1/emails/:id`

> בקשת דוגמה:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## דומיינים {#domains}

> \[!TIP]
> נקודות הקצה של דומיין עם שם הדומיין <code>/v1/domains/:domain_name</code> כנקודת הקצה שלהן ניתנות להחלפה עם מזהה הדומיין <code>:domain_id</code>. משמעות הדבר היא שניתן להתייחס לדומיין לפי <code>name</code> או לפי <code>id</code> שלו.

### רשימת דומיינים {#list-domains}

> \[!NOTE]
> החל מ-1 בנובמבר 2024 נקודות הקצה של ה-API עבור [List domains](#list-domains) ו-[List domain aliases](#list-domain-aliases) יוגדרו כברירת מחדל ל- `1000` תוצאות מקסימום לעמוד. אם ברצונך להפעיל התנהגות זו מוקדם יותר, ניתן להעביר `?paginate=true` כפרמטר מחרוזת שאילתה נוסף לכתובת ה-URL של השאילתה. ראה [Pagination](#pagination) למידע נוסף.

> `GET /v1/domains`

| פרמטר מחרוזת שאילתה | חובה | סוג                      | תיאור                                                                                                                                               |
| --------------------- | -------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | לא       | מחרוזת (תמיכה ב-RegExp)   | חיפוש דומיינים לפי שם                                                                                                                              |
| `name`                | לא       | מחרוזת (תמיכה ב-RegExp)   | חיפוש דומיינים לפי שם                                                                                                                              |
| `sort`                | לא       | מחרוזת                    | מיון לפי שדה מסוים (הוסף מקף יחיד `-` כדי למיין בכיוון ההפוך של אותו שדה). ברירת מחדל היא `created_at` אם לא מוגדר.                              |
| `page`                | לא       | מספר                     | ראה [Pagination](#pagination) למידע נוסף                                                                                                          |
| `limit`               | לא       | מספר                     | ראה [Pagination](#pagination) למידע נוסף                                                                                                          |

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### צור דומיין {#create-domain}

> `POST /v1/domains`

| פרמטר גוף                   | חובה | סוג                                          | תיאור                                                                                                                                                                                                                                                                                                               |
| --------------------------- | -------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                    | כן       | מחרוזת (FQDN או IP)                          | שם דומיין מלא מוסמך ("FQDN") או כתובת IP                                                                                                                                                                                                                                                                            |
| `team_domain`               | לא       | מחרוזת (מזהה דומיין או שם דומיין; FQDN)     | הקצה אוטומטית דומיין זה לאותה קבוצה כמו דומיין אחר. משמעות הדבר שכל החברים מדומיין זה יוקצו כחברי קבוצה, ותוכנית ה-`plan` תוגדר אוטומטית ל-`team`. ניתן להגדיר זאת ל- `"none"` אם יש צורך לבטל זאת במפורש, אך זה לא הכרחי.                                                                                   |
| `plan`                      | לא       | מחרוזת (enumerable)                           | סוג התוכנית (חייב להיות `"free"`, `"enhanced_protection"`, או `"team"`, ברירת מחדל היא `"free"` או תוכנית בתשלום נוכחית של המשתמש אם יש כזו)                                                                                                                                                                      |
| `catchall`                  | לא       | מחרוזת (כתובות אימייל מופרדות) או בוליאני    | צור כינוי ברירת מחדל catch-all, ברירת מחדל היא `true` (אם `true` ישתמש בכתובת האימייל של משתמש ה-API כמקבל, ואם `false` לא יווצר catch-all). אם מועברת מחרוזת, זוהי רשימה מופרדת של כתובות אימייל לשימוש כמקבלים (מופרדות על ידי שבר שורה, רווח, ו/או פסיק)                                         |
| `has_adult_content_protection` | לא       | בוליאני                                       | האם להפעיל הגנת תוכן למבוגרים של סורק הספאם בדומיין זה                                                                                                                                                                                                                                                             |
| `has_phishing_protection`   | לא       | בוליאני                                       | האם להפעיל הגנת פישינג של סורק הספאם בדומיין זה                                                                                                                                                                                                                                                                     |
| `has_executable_protection` | לא       | בוליאני                                       | האם להפעיל הגנת קבצים ניתנים להרצה של סורק הספאם בדומיין זה                                                                                                                                                                                                                                                        |
| `has_virus_protection`      | לא       | בוליאני                                       | האם להפעיל הגנת וירוסים של סורק הספאם בדומיין זה                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`| לא       | בוליאני                                       | ברירת מחדל גלובלית לדומיין האם לדרוש מהמקבלי כינוי ללחוץ על קישור אימות אימייל כדי שהאימיילים יעברו                                                                                                                                                                                                                 |
| `ignore_mx_check`           | לא       | בוליאני                                       | האם להתעלם מבדיקת רשומת MX בדומיין לצורך אימות. זה בעיקר עבור משתמשים שיש להם כללי תצורת החלפת MX מתקדמים וצריכים לשמור על החלפת MX קיימת ולהעביר אלינו.                                                                                                                                                        |
| `retention_days`            | לא       | מספר                                          | מספר שלם בין `0` ל-`30` שמתאים למספר ימי השמירה לאחסון אימיילי SMTP יוצאים לאחר שנמסרו בהצלחה או נתקלו בשגיאה קבועה. ברירת מחדל היא `0`, שמשמעותה שאימיילי SMTP יוצאים ימחקו ויוסתרו מידית למען אבטחתך.                                                                                                         |
| `bounce_webhook`            | לא       | מחרוזת (URL) או בוליאני (false)               | כתובת ה-URL של webhook מסוג `http://` או `https://` לבחירתך לשליחת webhook על החזרות (bounce). נשלח בקשת `POST` לכתובת זו עם מידע על כשלונות SMTP יוצאים (למשל כשלונות רכים או קשים – כדי שתוכל לנהל את המנויים שלך ולנהל את האימייל היוצא באופן תכנותי).                                                        |
| `max_quota_per_alias`       | לא       | מחרוזת                                        | מכסת אחסון מקסימלית לכינויים בדומיין זה. הזן ערך כמו "1 GB" שיפורש על ידי [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                                                         |
> בקשת דוגמה:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### שלוף דומיין {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### אמת רשומות דומיין {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### אמת רשומות SMTP של הדומיין {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### רשום סיסמאות catch-all כלליות לדומיין {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### צור סיסמת catch-all כללית לדומיין {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| פרמטר גוף    | חובה | סוג    | תיאור                                                                                                                                                                                                                     |
| ------------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | לא   | מחרוזת | הסיסמה החדשה המותאמת אישית שלך לשימוש כסיסמת catch-all כללית לדומיין. שים לב שניתן להשאיר שדה זה ריק או חסר לחלוטין בבקשת ה-API שלך אם ברצונך לקבל סיסמה חזקה שנוצרה אקראית.                                          סיסמאות מותאמות אישית לתיבת דואר חייבות להיות באורך של עד 128 תווים, לא להתחיל או להסתיים ברווח, ואסור שיכילו מרכאות או אפוסטרופים. סיסמאות catch-all מיועדות רק לשימוש בשליחת SMTP. לגישה ל-IMAP, POP3, CalDAV, CardDAV ולתיבת הדואר, צור סיסמה עבור האליאס הספציפי במקום זאת. |
| `description`  | לא   | מחרוזת | תיאור למטרות ארגוניות בלבד.                                                                                                                                                                                             |

> בקשת דוגמה:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### הסר סיסמת catch-all כללית לדומיין {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> בקשת דוגמה:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### עדכן דומיין {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| פרמטר גוף                   | חובה | סוג                            | תיאור                                                                                                                                                                                                                                                                                     |
| ---------------------------- | ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                  | לא   | מחרוזת או מספר                 | פורט מותאם אישית להגדרה עבור העברת SMTP (ברירת מחדל היא `"25"`)                                                                                                                                                                                                                          |
| `has_adult_content_protection` | לא   | בוליאני                       | האם להפעיל הגנת תוכן למבוגרים של סורק הספאם בדומיין זה                                                                                                                                                                                                                                   |
| `has_phishing_protection`    | לא   | בוליאני                       | האם להפעיל הגנת פישינג של סורק הספאם בדומיין זה                                                                                                                                                                                                                                         |
| `has_executable_protection`  | לא   | בוליאני                       | האם להפעיל הגנת קבצים ניתנים להרצה של סורק הספאם בדומיין זה                                                                                                                                                                                                                             |
| `has_virus_protection`       | לא   | בוליאני                       | האם להפעיל הגנת וירוסים של סורק הספאם בדומיין זה                                                                                                                                                                                                                                       |
| `has_recipient_verification` | לא   | בוליאני                       | ברירת מחדל גלובלית לדומיין האם לדרוש מהנמענים של כינויים ללחוץ על קישור אימות אימייל כדי שהאימיילים יעברו                                                                                                                                                                               |
| `ignore_mx_check`            | לא   | בוליאני                       | האם להתעלם מבדיקת רשומת MX בדומיין לצורך אימות. זה מיועד בעיקר למשתמשים שיש להם כללי תצורת החלפת MX מתקדמים וצריכים לשמור על החלפת MX קיימת ולהעביר אלינו.                                                                                                                         |
| `retention_days`             | לא   | מספר                         | מספר שלם בין `0` ל-`30` שמתאים למספר ימי השמירה לאחסון אימיילי SMTP יוצאים לאחר שנמסרו בהצלחה או נתקלו בשגיאה קבועה. ברירת המחדל היא `0`, שמשמעותה שאימיילי SMTP יוצאים נמחקים ומוצפנים מידית למען אבטחתך.                                                                         |
| `bounce_webhook`             | לא   | מחרוזת (URL) או בוליאני (false) | כתובת ה-Webhook `http://` או `https://` לבחירתך לשליחת Webhook על החזרות. נשלח בקשת `POST` לכתובת זו עם מידע על כשלונות SMTP יוצאים (למשל כשלונות רכים או קשים – כדי שתוכל לנהל את המנויים שלך ולנהל תוכניתית את האימייל היוצא שלך).                                               |
| `max_quota_per_alias`        | לא   | מחרוזת                       | מכסת אחסון מקסימלית לכינויים בדומיין זה. הזן ערך כמו "1 GB" שיופיע וינותח על ידי [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                     |
> בקשת דוגמה:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### מחיקת דומיין {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> בקשת דוגמה:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## הזמנות {#invites}

### קבלת הזמנה לדומיין {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### יצירת הזמנה לדומיין {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| פרמטר גוף    | חובה     | סוג                 | תיאור                                                                                      |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | כן       | מחרוזת (אימייל)     | כתובת אימייל להזמנה לרשימת חברי הדומיין                                                  |
| `group`        | כן       | מחרוזת (ברירה)     | קבוצה להוספת המשתמש אליה כחבר בדומיין (יכולה להיות אחת מ- `"admin"` או `"user"`)          |

> בקשת דוגמה:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> אם המשתמש שמוזמן כבר חבר מאושר בכל דומיין אחר שהמנהל המזמין הוא חבר בו, ההזמנה תתקבל אוטומטית ולא יישלח אימייל.

### הסרת הזמנה לדומיין {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| פרמטר גוף    | חובה     | סוג               | תיאור                                              |
| -------------- | -------- | ------------------ | -------------------------------------------------- |
| `email`        | כן       | מחרוזת (אימייל)   | כתובת אימייל להסרה מרשימת חברי הדומיין            |

> בקשת דוגמה:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## חברים {#members}

### עדכון חבר בדומיין {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| פרמטר גוף    | חובה     | סוג                 | תיאור                                                                                      |
| -------------- | -------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `group`        | כן       | מחרוזת (ברירה)     | קבוצה לעדכון המשתמש אליה כחבר בדומיין (יכולה להיות אחת מ- `"admin"` או `"user"`)          |

> בקשת דוגמה:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### הסרת חבר בדומיין {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> בקשת דוגמה:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## כינויים {#aliases}

### יצירת סיסמת כינוי {#generate-an-alias-password}

שים לב שאם אינך שולח הוראות באימייל, שם המשתמש והסיסמה יופיעו בגוף התגובה בפורמט JSON של בקשה מוצלחת כך: `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| פרמטר גוף            | חובה     | סוג      | תיאור                                                                                                                                                                                                                                                                                             |
| ---------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | לא       | מחרוזת   | הסיסמה החדשה המותאמת אישית שלך לשימוש בכינוי. שים לב שניתן להשאיר שדה זה ריק או לא לכלול אותו כלל בבקשת ה-API אם ברצונך לקבל סיסמה חזקה ומיוצרת אקראית.                                                                                                                                     סיסמאות מותאמות אישית לתיבת דואר חייבות להיות באורך של עד 128 תווים, לא להתחיל או להסתיים ברווח, ואסור שיכילו מרכאות או אפוסטרופים. |
| `password`             | לא       | מחרוזת   | סיסמה קיימת של הכינוי לשם שינוי הסיסמה מבלי למחוק את אחסון תיבת הדואר IMAP הקיים (ראה את אפשרות `is_override` למטה אם אין לך עוד את הסיסמה הקיימת).                                                                                                                                          |
| `is_override`          | לא       | בוליאני | **יש להשתמש בזהירות**: פעולה זו תחליף את סיסמת הכינוי הקיימת ואת מסד הנתונים לחלוטין, ותמחק לצמיתות את אחסון ה-IMAP הקיים ותאפס את מסד הנתונים של האימייל SQLite של הכינוי לחלוטין. אנא בצע גיבוי אם אפשרי אם יש לך תיבת דואר קיימת שמחוברת לכינוי זה. |
| `emailed_instructions` | לא       | מחרוזת   | כתובת אימייל לשליחת סיסמת הכינוי והוראות ההגדרה אליה.                                                                                                                                                                                                                                          |
> בקשת דוגמה:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### רשימת כינויים לדומיין {#list-domain-aliases}

> \[!NOTE]
> החל מ-1 בנובמבר 2024 נקודות הקצה של ה-API עבור [רשימת דומיינים](#list-domains) ו-[רשימת כינויים לדומיין](#list-domain-aliases) יוגדרו כברירת מחדל ל-`1000` תוצאות מקסימום לעמוד. אם ברצונך להצטרף להתנהגות זו מוקדם יותר, תוכל להעביר `?paginate=true` כפרמטר מחרוזת שאילתה נוסף לכתובת ה-URL של השאילתה בנקודת הקצה. ראה [דפדוף בעמודים](#pagination) למידע נוסף.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| פרמטר מחרוזת שאילתה | חובה | סוג                      | תיאור                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | לא       | מחרוזת (תמיכה ב-RegExp) | חיפוש כינויים בדומיין לפי שם, תווית, או נמענים                                                                                      |
| `name`                | לא       | מחרוזת (תמיכה ב-RegExp) | חיפוש כינויים בדומיין לפי שם                                                                                                           |
| `recipient`           | לא       | מחרוזת (תמיכה ב-RegExp) | חיפוש כינויים בדומיין לפי נמענים                                                                                                      |
| `sort`                | לא       | מחרוזת                    | מיון לפי שדה מסוים (הוסף מקף יחיד `-` כדי למיין בכיוון הפוך של אותו שדה). ברירת מחדל היא `created_at` אם לא מוגדר. |
| `page`                | לא       | מספר                    | ראה [דפדוף בעמודים](#pagination) למידע נוסף                                                                                                   |
| `limit`               | לא       | מספר                    | ראה [דפדוף בעמודים](#pagination) למידע נוסף                                                                                                   |

> בקשת דוגמה:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### יצירת כינוי חדש לדומיין {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| פרמטר גוף                      | חובה | סוג                                   | תיאור                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | לא       | מחרוזת                                 | שם הכינוי (אם לא סופק או ריק, ייווצר כינוי אקראי)                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | לא       | מחרוזת או מערך                        | רשימת נמענים (חייב להיות מחרוזת מופרדת בשורות/רווחים/פסיקים או מערך של כתובות אימייל תקינות, שמות דומיין מלאים ("FQDN"), כתובות IP, ו/או כתובות URL של webhook – ואם לא סופק או מערך ריק, כתובת האימייל של המשתמש המבצע את בקשת ה-API תוגדר כנמען)                                                                                     |
| `description`                   | לא       | מחרוזת                                 | תיאור הכינוי                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | לא       | מחרוזת או מערך                        | רשימת תוויות (חייב להיות מחרוזת מופרדת בשורות/רווחים/פסיקים או מערך)                                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | לא       | בוליאני                                | דרוש מהנמענים ללחוץ על קישור אימות אימייל כדי שהאימיילים יעברו (ברירת מחדל היא הגדרת הדומיין אם לא מוגדר במפורש בגוף הבקשה)                                                                                                                                                                                                                              |
| `is_enabled`                    | לא       | בוליאני                                | האם להפעיל או להשבית את הכינוי הזה (אם מושבת, האימיילים ינותבו לשום מקום אך יחזירו קודי סטטוס מוצלחים). אם מועבר ערך, הוא יומר לבוליאני באמצעות [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | לא       | מספר (אחד מ-`250`, `421`, או `550`) | אימייל נכנס לכינוי זה יידחה אם `is_enabled` הוא `false` עם אחד מהקודים `250` (מסירה שקטה לשום מקום, לדוגמה חור שחור או `/dev/null`), `421` (דחייה רכה; ונסיון חוזר עד כ-5 ימים) או `550` כשלון קבוע ודחייה. ברירת מחדל היא `250`.                                                                                                                               |
| `has_imap`                      | לא       | בוליאני                                | האם להפעיל או להשבית אחסון IMAP עבור כינוי זה (אם מושבת, אימיילים נכנסים לא יאוחסנו ב-[אחסון IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). אם מועבר ערך, הוא יומר לבוליאני באמצעות [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | לא       | בוליאני                                | האם להפעיל או להשבית [הצפנת OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) עבור [אחסון אימייל מוצפן IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) באמצעות `public_key` של הכינוי.                                                                                                         |
| `public_key`                    | לא       | מחרוזת                                 | מפתח ציבורי OpenPGP בפורמט ASCII Armor ([לחץ כאן לצפייה בדוגמה](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); לדוגמה מפתח GPG עבור `support@forwardemail.net`). זה חל רק אם `has_pgp` מוגדר ל-`true`. [למידע נוסף על הצפנה מקצה לקצה ב-FAQ שלנו](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | לא       | מחרוזת                                 | מכסת אחסון מקסימלית לכינוי זה. השאר ריק כדי לאפס למכסה המקסימלית הנוכחית של הדומיין או הזן ערך כמו "1 GB" שיפורש על ידי [bytes](https://github.com/visionmedia/bytes.js). ערך זה ניתן לשינוי רק על ידי מנהלי הדומיין.                                                                                                                                      |
| `vacation_responder_is_enabled` | לא       | בוליאני                                | האם להפעיל או להשבית מענה אוטומטי לחופשה.                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | לא       | מחרוזת                                 | תאריך התחלה למענה חופשה (אם מופעל ואין תאריך התחלה מוגדר כאן, מניחים שכבר התחיל). אנו תומכים בפורמטי תאריך כמו `MM/DD/YYYY`, `YYYY-MM-DD`, ופורמטים נוספים באמצעות ניתוח חכם עם `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | לא       | מחרוזת                                 | תאריך סיום למענה חופשה (אם מופעל ואין תאריך סיום מוגדר כאן, מניחים שהוא לעולם לא מסתיים ומגיב לנצח). אנו תומכים בפורמטי תאריך כמו `MM/DD/YYYY`, `YYYY-MM-DD`, ופורמטים נוספים באמצעות ניתוח חכם עם `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | לא       | מחרוזת                                 | נושא בטקסט פשוט למענה חופשה, לדוגמה "מחוץ למשרד". אנו משתמשים ב-`striptags` להסרת כל HTML כאן.                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | לא       | מחרוזת                                 | הודעה בטקסט פשוט למענה חופשה, לדוגמה "אהיה מחוץ למשרד עד פברואר.". אנו משתמשים ב-`striptags` להסרת כל HTML כאן.                                                                                                                                                                                                                                               |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### שליפת כינוי דומיין {#retrieve-domain-alias}

ניתן לשלוף כינוי דומיין באמצעות `id` או באמצעות ערך ה-`name` שלו.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### עדכון כינוי דומיין {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Required | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | No       | String                                 | שם הכינוי                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | No       | String or Array                        | רשימת נמענים (חייב להיות מחרוזת מופרדת בפסיקים/רווחים/שורות או מערך של כתובות אימייל תקינות, שמות דומיין מלאים ("FQDN"), כתובות IP, ו/או כתובות URL של webhook)                                                                                                                                                                                                                         |
| `description`                   | No       | String                                 | תיאור הכינוי                                                                                                                                                                                                                                                                                                                                                                               |
| `labels`                        | No       | String or Array                        | רשימת תוויות (חייב להיות מחרוזת מופרדת בפסיקים/רווחים/שורות או מערך)                                                                                                                                                                                                                                                                                                                     |
| `has_recipient_verification`    | No       | Boolean                                | דרוש מהנמענים ללחוץ על קישור אימות אימייל כדי שהאימיילים יעברו (ברירת המחדל היא הגדרת הדומיין אם לא מוגדר במפורש בגוף הבקשה)                                                                                                                                                                                                                                                             |
| `is_enabled`                    | No       | Boolean                                | האם להפעיל או להשבית את הכינוי הזה (אם מושבת, האימיילים ינותבו לשום מקום אך יחזירו קודי סטטוס מוצלחים). אם מועבר ערך, הוא יומר לבוליאני באמצעות [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                                                   |
| `error_code_if_disabled`        | No       | Number (either `250`, `421`, or `550`) | אימייל נכנס לכינוי זה יידחה אם `is_enabled` הוא `false` עם אחד מהקודים `250` (מסירה שקטה לשום מקום, לדוגמה blackhole או `/dev/null`), `421` (דחייה רכה; ונסיון חוזר עד כ-5 ימים) או `550` כשלון קבוע ודחייה. ברירת המחדל היא `250`.                                                                                                                                                   |
| `has_imap`                      | No       | Boolean                                | האם להפעיל או להשבית אחסון IMAP עבור כינוי זה (אם מושבת, אימיילים נכנסים לא יאוחסנו ב-[IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). אם מועבר ערך, הוא יומר לבוליאני באמצעות [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                      |
| `has_pgp`                       | No       | Boolean                                | האם להפעיל או להשבית [הצפנת OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) עבור [אחסון אימייל מוצפן IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) באמצעות `public_key` של הכינוי.                                                                                                                         |
| `public_key`                    | No       | String                                 | מפתח ציבורי OpenPGP בפורמט ASCII Armor ([לחץ כאן לצפייה בדוגמה](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); לדוגמה מפתח GPG עבור `support@forwardemail.net`). זה חל רק אם `has_pgp` מוגדר ל-`true`. [למידע נוסף על הצפנה מקצה לקצה ב-FAQ שלנו](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | No       | String                                 | מכסת אחסון מקסימלית לכינוי זה. השאר ריק כדי לאפס למכסה המקסימלית הנוכחית של הדומיין או הזן ערך כמו "1 GB" שיפורש על ידי [bytes](https://github.com/visionmedia/bytes.js). ערך זה ניתן לשינוי רק על ידי מנהלי הדומיין.                                                                                                                                                              |
| `vacation_responder_is_enabled` | No       | Boolean                                | האם להפעיל או להשבית מענה אוטומטי לחופשה.                                                                                                                                                                                                                                                                                                                                                 |
| `vacation_responder_start_date` | No       | String                                 | תאריך התחלה למענה החופשה (אם מופעל ואין תאריך התחלה מוגדר כאן, מניחים שכבר התחיל). אנו תומכים בפורמטים כמו `MM/DD/YYYY`, `YYYY-MM-DD`, ופורמטים נוספים באמצעות ניתוח חכם עם `dayjs`.                                                                                                                                                                                                |
| `vacation_responder_end_date`   | No       | String                                 | תאריך סיום למענה החופשה (אם מופעל ואין תאריך סיום מוגדר כאן, מניחים שהוא לעולם לא מסתיים ומגיב לנצח). אנו תומכים בפורמטים כמו `MM/DD/YYYY`, `YYYY-MM-DD`, ופורמטים נוספים באמצעות ניתוח חכם עם `dayjs`.                                                                                                                                                                                |
| `vacation_responder_subject`    | No       | String                                 | נושא בהיר למענה החופשה, לדוגמה "מחוץ למשרד". אנו משתמשים ב-`striptags` להסרת כל תגי ה-HTML כאן.                                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | No       | String                                 | הודעה בהירה למענה החופשה, לדוגמה "אהיה מחוץ למשרד עד פברואר.". אנו משתמשים ב-`striptags` להסרת כל תגי ה-HTML כאן.                                                                                                                                                                                                                                                                       |
> בקשת דוגמה:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### מחיקת כינוי דומיין {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> בקשת דוגמה:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## הצפנה {#encrypt}

אנו מאפשרים לך להצפין רשומות אפילו בתוכנית החינמית ללא עלות. פרטיות לא צריכה להיות תכונה, היא צריכה להיות מובנית באופן מהותי בכל היבטי המוצר. כפי שנדרש רבות ב-[דיון Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) וב-[נושאים שלנו ב-GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) הוספנו זאת.

### הצפנת רשומת TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| פרמטר גוף    | חובה     | סוג    | תיאור                                       |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | כן       | מחרוזת | כל רשומת TXT טקסט רגילה חוקית של Forward Email |

> בקשת דוגמה:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
