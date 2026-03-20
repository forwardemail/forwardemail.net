# Self Hosted {#self-hosted}


## Table of Contents {#table-of-contents}

* [התחלה](#getting-started)
* [דרישות](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [התקנה](#install)
  * [סריקת שגיאות בסקריפט ההתקנה](#debug-install-script)
  * [הנחיות](#prompts)
  * [הגדרה ראשונית (אפשרות 1)](#initial-setup-option-1)
* [שירותים](#services)
  * [נתיבי קבצים חשובים](#important-file-paths)
* [הגדרות](#configuration)
  * [הגדרת DNS ראשונית](#initial-dns-setup)
* [הצטרפות](#onboarding)
* [בדיקות](#testing)
  * [יצירת כינוי ראשון](#creating-your-first-alias)
  * [שליחה / קבלה של האימייל הראשון שלך](#sending--receiving-your-first-email)
* [פתרון בעיות](#troubleshooting)
  * [מה שם המשתמש והסיסמה לאימות בסיסי](#what-is-the-basic-auth-username-and-password)
  * [איך אני יודע מה רץ](#how-do-i-know-what-is-running)
  * [איך אני יודע אם משהו לא רץ כשצריך](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [איך אני מוצא לוגים](#how-do-i-find-logs)
  * [למה האימיילים היוצאים שלי מתעכבים](#why-are-my-outgoing-emails-timing-out)


## Getting started {#getting-started}

פתרון הדואר האלקטרוני העצמאי שלנו, כמו כל המוצרים שלנו, הוא קוד פתוח 100% — גם בצד הלקוח וגם בצד השרת. משמעות הדבר:

1. **שקיפות מלאה**: כל שורת קוד שמעבדת את האימיילים שלך זמינה לבחינה ציבורית
2. **תרומות מהקהילה**: כל אחד יכול לתרום שיפורים או לתקן בעיות
3. **אבטחה באמצעות פתיחות**: פגיעויות יכולות להיות מזוהות ותוקנו על ידי קהילה עולמית
4. **ללא תלות בספק**: אתה אף פעם לא תלוי בקיומה של החברה שלנו

כל בסיס הקוד זמין ב-GitHub בכתובת <https://github.com/forwardemail/forwardemail.net>, ברישיון MIT.

הארכיטקטורה כוללת מכולות עבור:

* שרת SMTP לדואר יוצא
* שרתי IMAP/POP3 לקבלת דואר
* ממשק ווב לניהול
* מסד נתונים לאחסון הגדרות
* Redis למטמון וביצועים
* SQLite לאחסון תיבות דואר מאובטח ומוצפן

> \[!NOTE]
> הקפד לבדוק את [הבלוג העצמאי שלנו](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> ולמי שמעוניין בגרסה מפורטת יותר שלב אחר שלב ראה את המדריכים שלנו ל-[Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) או [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Requirements {#requirements}

לפני הרצת סקריפט ההתקנה, ודא שיש לך את הדברים הבאים:

* **מערכת הפעלה**: שרת מבוסס לינוקס (תומך כרגע ב-Ubuntu 22.04+).
* **משאבים**: 1 vCPU ו-2GB RAM
* **גישה כ-root**: הרשאות מנהל לביצוע פקודות.
* **שם דומיין**: דומיין מותאם אישית מוכן להגדרת DNS.
* **IP נקי**: ודא שלשרת שלך יש כתובת IP נקייה ללא מוניטין ספאם קודם על ידי בדיקת רשימות שחורות. מידע נוסף [כאן](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* כתובת IP ציבורית עם תמיכה בפורט 25
* יכולת להגדיר [PTR הפוך](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* תמיכה ב-IPv4 ו-IPv6

> \[!TIP]
> ראה את רשימת [ספקי שרתי דואר מעולים](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

רוב ספקי הענן תומכים בקונפיגורציית cloud-init כאשר שרת וירטואלי פרטי (VPS) מוקצה. זו דרך מצוינת להגדיר קבצים ומשתני סביבה מראש לשימוש בלוגיקת ההגדרה הראשונית של הסקריפט, שתעקוף את הצורך בשאלות בזמן הרצת הסקריפט לקבלת מידע נוסף.

**אפשרויות**

* `EMAIL` - אימייל לשימוש בתזכורות פקיעת תעודת certbot
* `DOMAIN` - דומיין מותאם אישית (למשל `example.com`) לשימוש בהגדרת האחסון העצמי
* `AUTH_BASIC_USERNAME` - שם משתמש להגנה על האתר בהגדרה הראשונית
* `AUTH_BASIC_PASSWORD` - סיסמה להגנה על האתר בהגדרה הראשונית
* `/root/.cloudflare.ini` - (**רק למשתמשי Cloudflare**) קובץ קונפיגורציה של Cloudflare לשימוש certbot בהגדרת DNS. יש להגדיר את אסימון ה-API שלך באמצעות `dns_cloudflare_api_token`. קרא עוד [כאן](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
דוגמה:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## התקנה {#install}

הרץ את הפקודה הבאה בשרת שלך כדי להוריד ולהריץ את סקריפט ההתקנה:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### סקריפט התקנה לדיבוג {#debug-install-script}

הוסף `DEBUG=true` לפני סקריפט ההתקנה לפלט מפורט:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### תפריטים {#prompts}

```sh
1. הגדרה ראשונית
2. הגדרת גיבויים
3. הגדרת עדכונים אוטומטיים
4. חידוש תעודות
5. שחזור מגיבוי
6. עזרה
7. יציאה
```

* **הגדרה ראשונית**: הורדת קוד forward email העדכני ביותר, קונפיגורציה של הסביבה, בקשה לדומיין מותאם אישית והגדרת כל התעודות, המפתחות והסודות הנדרשים.
* **הגדרת גיבוי**: יגדיר קרון לגיבוי mongoDB ו-redis באמצעות אחסון תואם S3 לאחסון מרוחק ומאובטח. בנוסף, sqlite יגובה בעת התחברות אם יש שינויים לגיבויים מוצפנים ומאובטחים.
* **הגדרת עדכון**: יגדיר קרון לחיפוש עדכונים ליליים אשר יבנו מחדש ויתחילו בבטחה את רכיבי התשתית.
* **חידוש תעודות**: Certbot / lets encrypt משמשים לתעודות SSL והמפתחות פוקעים כל 3 חודשים. זה יחידש את התעודות לדומיין שלך וימקם אותן בתיקייה הנדרשת לצריכת הרכיבים הרלוונטיים. ראה [נתיבי קבצים חשובים](#important-file-paths)
* **שחזור מגיבוי**: יפעיל שחזור mongodb ו-redis מנתוני הגיבוי.

### הגדרה ראשונית (אפשרות 1) {#initial-setup-option-1}

בחר באפשרות `1. הגדרה ראשונית` כדי להתחיל.

בסיום, תראה הודעת הצלחה. ניתן גם להריץ `docker ps` כדי לראות את **הרכיבים** שהופעלו. מידע נוסף על הרכיבים למטה.


## שירותים {#services}

| שם השירות  |         פורט ברירת מחדל        | תיאור                                                  |
| ------------ | :-------------------------: | ------------------------------------------------------ |
| Web          |            `443`            | ממשק רשת לכל האינטראקציות הניהוליות                   |
| API          |            `4000`           | שכבת API להפרדת מסדי נתונים                            |
| Bree         |             None            | מנהל משימות וריצות רקע                                 |
| SMTP         | `465` (מומלץ) / `587`       | שרת SMTP לדואר יוצא                                    |
| SMTP Bree    |             None            | משימת רקע SMTP                                        |
| MX           |            `2525`           | חילופי דואר לדואר נכנס והפניות דואר                     |
| IMAP         |          `993/2993`         | שרת IMAP לדואר נכנס וניהול תיבות דואר                   |
| POP3         |          `995/2995`         | שרת POP3 לדואר נכנס וניהול תיבות דואר                   |
| SQLite       |            `3456`           | שרת SQLite לאינטראקציה עם מסדי נתונים מסוג sqlite      |
| SQLite Bree  |             None            | משימת רקע SQLite                                      |
| CalDAV       |            `5000`           | שרת CalDAV לניהול לוח שנה                               |
| CardDAV      |            `6000`           | שרת CardDAV לניהול לוח שנה                              |
| MongoDB      |           `27017`           | מסד נתונים MongoDB לניהול רוב הנתונים                   |
| Redis        |            `6379`           | Redis למטמון וניהול מצב                                 |
| SQLite       |             None            | מסדי נתונים SQLite לתיבות דואר מוצפנות                  |

### נתיבי קבצים חשובים {#important-file-paths}

הערה: *נתיב המארח* למטה הוא יחסי ל-`/root/forwardemail.net/self-hosting/`.

| רכיב                  |       נתיב מארח       | נתיב במכולה                 |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| קובץ Env               |        `./.env`       | `/app/.env`                  |
| תעודות/מפתחות SSL     |        `./ssl`        | `/app/ssl/`                  |
| מפתח פרטי             |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| תעודת שרשרת מלאה      | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| תעודת CA              |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| מפתח פרטי DKIM        |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> שמור את קובץ `.env` בצורה מאובטחת. זה קריטי לשחזור במקרה של כשל.
> ניתן למצוא אותו ב-`/root/forwardemail.net/self-hosting/.env`.


## תצורה {#configuration}

### הגדרת DNS ראשונית {#initial-dns-setup}

ב ספק ה-DNS שבחרת, הגדר את רשומות ה-DNS המתאימות. שים לב שכל דבר בסוגריים משולשים (`<>`) הוא דינמי ויש לעדכן אותו בערך שלך.

| Type  | Name               | Content                       | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", or blank | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", or blank | mx.<domain_name> (priority 0) | auto |
| TXT   | "@", ".", or blank | "v=spf1 a -all"               | auto |

#### רשומת DNS הפוכה / PTR {#reverse-dns--ptr-record}

רשומות DNS הפוכות (rDNS) או רשומות מצביע הפוכות (PTR) הן חיוניות לשרתי דואר אלקטרוני מכיוון שהן עוזרות לאמת את הלגיטימיות של השרת ששולח את הדואר. כל ספק ענן עושה זאת בצורה שונה, לכן תצטרך לבדוק כיצד להוסיף "DNS הפוך" כדי למפות את המארח וה-IP לשם המארח המתאים. סביר להניח שזה נמצא בחלק הרשת של הספק.

#### פורט 25 חסום {#port-25-blocked}

חלק מספקי האינטרנט וספקי הענן חוסמים את פורט 25 כדי למנוע פעילות זדונית. ייתכן שתצטרך לפתוח פנייה לתמיכה כדי לפתוח את פורט 25 עבור SMTP / דואר יוצא.


## התחלת עבודה {#onboarding}

1. פתח את דף הנחיתה
   עבור אל https\://\<domain_name>, כאשר מחליפים את \<domain_name> בשם הדומיין שהוגדר בהגדרות ה-DNS שלך. אמור להופיע דף הנחיתה של Forward Email.

2. התחבר והגדר את הדומיין שלך

* היכנס עם דואר אלקטרוני וסיסמה תקינים.
* הזן את שם הדומיין שברצונך להגדיר (חייב להתאים להגדרות ה-DNS).
* עקוב אחר ההנחיות להוספת רשומות **MX** ו-**TXT** הנדרשות לאימות.

3. השלם את ההגדרה

* לאחר האימות, גש לדף הכינויים כדי ליצור את הכינוי הראשון שלך.
* במידת הצורך, הגדר **SMTP לדואר יוצא** ב**הגדרות הדומיין**. זה דורש רשומות DNS נוספות.

> \[!NOTE]
> אין מידע שנשלח מחוץ לשרת שלך. אפשרות האחסון העצמי והחשבון הראשוני הם רק עבור כניסת מנהל וממשק ניהול לניהול דומיינים, כינויים והגדרות דואר קשורות.


## בדיקות {#testing}

### יצירת הכינוי הראשון שלך {#creating-your-first-alias}

1. עבור לדף הכינויים
   פתח את דף ניהול הכינויים:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. הוסף כינוי חדש

* לחץ על **הוסף כינוי** (למעלה מימין).
* הזן את שם הכינוי והתאם את הגדרות הדואר לפי הצורך.
* (אופציונלי) אפשר תמיכה ב-**IMAP/POP3/CalDAV/CardDAV** על ידי סימון התיבה.
* לחץ על **צור כינוי.**

3. הגדר סיסמה

* לחץ על **צור סיסמה** כדי ליצור סיסמה מאובטחת.
* סיסמה זו תידרש לכניסה ללקוח הדואר שלך.

4. הגדר את לקוח הדואר שלך

* השתמש בלקוח דואר כמו Thunderbird.
* הזן את שם הכינוי והסיסמה שנוצרה.
* הגדר את הגדרות **IMAP** ו-**SMTP** בהתאם.

#### הגדרות שרת הדואר {#email-server-settings}

שם משתמש: `<alias name>`

| Type | Hostname           | Port | Connection Security | Authentication  |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS           | Normal Password |
| IMAP | imap.<domain_name> | 993  | SSL / TLS           | Normal Password |

### שליחה / קבלה של הדואר הראשון שלך {#sending--receiving-your-first-email}

לאחר ההגדרה, תוכל לשלוח ולקבל דואר לכתובת הדואר החדשה והמאוחסנת בעצמך!
## פתרון בעיות {#troubleshooting}

#### למה זה לא עובד מחוץ לאובונטו ודביאן {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

כרגע אנחנו מחפשים לתמוך ב-MacOS ונבחן פלטפורמות נוספות. אנא פתחו [דיון](https://github.com/orgs/forwardemail/discussions) או תתרמו אם תרצו לראות תמיכה בפלטפורמות נוספות.

#### למה אתגר ה-certbot acme נכשל {#why-is-the-certbot-acme-challenge-failing}

הבעיה הנפוצה ביותר היא ש-certbot / letsencrypt לפעמים מבקשים **2** אתגרים. עליכם לוודא להוסיף **שני** רשומות txt.

דוגמה:
ייתכן שתראו שני אתגרים כאלה:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

יתכן גם שהפצת ה-DNS לא הושלמה. תוכלו להשתמש בכלים כמו: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. זה ייתן לכם מושג אם השינויים ברשומת TXT שלכם צריכים להיות משוקפים. כמו כן, ייתכן שמטמון ה-DNS המקומי במחשב שלכם עדיין משתמש בערך ישן או לא קלט את השינויים האחרונים.

אפשרות נוספת היא להשתמש בשינויים האוטומטיים של certbot ב-DNS על ידי הגדרת הקובץ `/root/.cloudflare.ini` עם אסימון ה-API ב-cloud-init / user-data בעת ההתקנה הראשונית של ה-VPS או ליצור קובץ זה ולהריץ את הסקריפט שוב. זה ינהל את שינויים ב-DNS ועדכוני האתגר באופן אוטומטי.

### מה שם המשתמש והסיסמה של אימות הבסיס {#what-is-the-basic-auth-username-and-password}

לאירוח עצמי, אנו מוסיפים בפעם הראשונה פופ-אפ אימות מקורי בדפדפן עם שם משתמש פשוט (`admin`) וסיסמה (נוצרה אקראית בהתקנה הראשונית). אנו מוסיפים זאת כהגנה למקרה שאוטומציה / סקרייפרים יקדימו אתכם בהרשמה הראשונה בחוויית האינטרנט. תוכלו למצוא סיסמה זו לאחר ההתקנה הראשונית בקובץ `.env` תחת `AUTH_BASIC_USERNAME` ו-`AUTH_BASIC_PASSWORD`.

### איך אני יודע מה רץ {#how-do-i-know-what-is-running}

ניתן להריץ `docker ps` כדי לראות את כל המכולות שרצות שנוצרות מקובץ `docker-compose-self-hosting.yml`. ניתן גם להריץ `docker ps -a` כדי לראות הכל (כולל מכולות שאינן רצות).

### איך אני יודע אם משהו לא רץ כשצריך {#how-do-i-know-if-something-isnt-running-that-should-be}

ניתן להריץ `docker ps -a` כדי לראות הכל (כולל מכולות שאינן רצות). ייתכן שתראו יומן יציאה או הערה.

### איך אני מוצא לוגים {#how-do-i-find-logs}

ניתן לקבל לוגים נוספים באמצעות `docker logs -f <container_name>`. אם משהו יצא, סביר להניח שזה קשור לקובץ `.env` שהוגדר בצורה שגויה.

בממשק האינטרנטי, ניתן לצפות ב-`/admin/emails` ו-`/admin/logs` עבור לוגים של דואר יוצא ולוגי שגיאות בהתאמה.

### למה הודעות הדואר היוצאות שלי מתעכבות {#why-are-my-outgoing-emails-timing-out}

אם אתם רואים הודעה כמו Connection timed out when connecting to MX server... ייתכן שתצטרכו לבדוק אם פורט 25 חסום. זה נפוץ שספקי אינטרנט או ספקי ענן חוסמים את הפורט כברירת מחדל, וייתכן שתצטרכו לפנות לתמיכה / לפתוח פנייה כדי לפתוח אותו.

#### אילו כלים כדאי להשתמש כדי לבדוק תצורת דואר ופרופיל IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

עיינו ב-[שאלות נפוצות שלנו כאן](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
