# אירוח עצמי {#self-hosted}

תוכן עניינים {##

* [מתחילים](#getting-started)
* [דרישות](#requirements)
  * [Cloud-init / נתוני משתמש](#cloud-init--user-data)
* [לְהַתְקִין](#install)
  * [ניפוי באגים בסקריפט להתקנת](#debug-install-script)
  * [הנחיות](#prompts)
  * [הגדרה ראשונית (אפשרות 1)](#initial-setup-option-1)
* [שירותים](#services)
  * [נתיבי קבצים חשובים](#important-file-paths)
* [תְצוּרָה](#configuration)
  * [הגדרת DNS ראשונית](#initial-dns-setup)
* [עלייה למטוס](#onboarding)
* [בּוֹחֵן](#testing)
  * [יצירת הכינוי הראשון שלך](#creating-your-first-alias)
  * [שולח/קבל את האימייל הראשון שלך](#sending--receiving-your-first-email)
* [פתרון בעיות](#troubleshooting)
  * [מהו שם המשתמש והסיסמה הבסיסיים של האימות](#what-is-the-basic-auth-username-and-password)
  * [איך אני יודע מה רץ](#how-do-i-know-what-is-running)
  * [איך אני יודע אם משהו לא פועל זה אמור להיות](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [איך אני מוצא יומנים](#how-do-i-find-logs)
  * [מדוע נגמר הזמן הקצוב של האימיילים היוצאים שלי](#why-are-my-outgoing-emails-timing-out)

## תחילת העבודה {#getting-started}

פתרון הדואר האלקטרוני שלנו המאוחסן בעצמו, כמו כל המוצרים שלנו, הוא 100% קוד פתוח - גם בחזית וגם בקצה העורפי. המשמעות היא:

1. **שקיפות מלאה**: כל שורת קוד שמעבדת את האימיילים שלכם זמינה לבדיקה ציבורית.
2. **תרומות קהילתיות**: כל אחד יכול לתרום לשיפורים או לתקן בעיות.
3. **אבטחה באמצעות פתיחות**: קהילה עולמית יכולה לזהות ולתקן פגיעויות.
4. **ללא נעילת ספקים**: אתם לעולם לא תלויים בקיומה של החברה שלנו.

כל בסיס הקוד זמין ב-GitHub בכתובת <https://github.com/forwardemail/forwardemail.net>, תחת רישיון MIT.

הארכיטקטורה כוללת מכולות עבור:

* שרת SMTP לדוא"ל יוצא
* שרתי IMAP/POP3 לאחזור דוא"ל
* ממשק אינטרנט לניהול
* מסד נתונים לאחסון תצורה
* Redis לאחסון במטמון וביצועים
* SQLite לאחסון תיבות דואר מאובטח ומוצפן

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## דרישות {#requirements}

לפני הפעלת סקריפט ההתקנה, ודא שיש לך את הדברים הבאים:

* **מערכת הפעלה**: שרת מבוסס לינוקס (תומך כעת ב-Ubuntu 22.04+).
* **משאבים**: מעבד vCPU אחד ו-2GB RAM
* **גישת Root**: הרשאות ניהול לביצוע פקודות.
* **שם דומיין**: דומיין מותאם אישית מוכן להגדרת DNS.
* **IP נקי**: ודא שלשרת שלך יש כתובת IP נקייה ללא מוניטין של ספאם קודם על ידי בדיקת רשימות שחורות. מידע נוסף [כָּאן](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* כתובת IP ציבורית עם תמיכה בפורט 25
* יכולת להגדיר [PTR הפוך](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* תמיכה ב-IPv4 ו-IPv6

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### נתוני משתמש / הפעלה בענן {#cloud-init--user-data}

רוב ספקי הענן תומכים בתצורת ענן-init כאשר השרת הפרטי הוירטואלי (VPS) מסודר. זוהי דרך מצוינת להגדיר כמה קבצים ומשתני סביבה מבעוד מועד לשימוש על ידי לוגיקה של ההגדרה הראשונית של הסקריפטים, שתעקוף את הצורך להנחות בזמן שהסקריפט פועל לקבלת מידע נוסף.

**אפשרויות**

* `EMAIL` - כתובת דוא"ל המשמשת לתזכורות לפקיעת תוקף של certbot
* `DOMAIN` - דומיין מותאם אישית (לדוגמה `example.com`) המשמש להגדרת אירוח עצמי
* `AUTH_BASIC_USERNAME` - שם משתמש המשמש בהגדרה הראשונה כדי להגן על האתר
* `AUTH_BASIC_PASSWORD` - סיסמה המשמשת בהגדרה הראשונה כדי להגן על האתר
* `/root/.cloudflare.ini` - (**למשתמשי Cloudflare בלבד**) קובץ תצורה של cloudflare המשמש את certbot להגדרת DNS. נדרש הגדרת אסימון API דרך `dns_cloudflare_api_token`. קרא עוד [כָּאן](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

דוּגמָה:

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

## התקן את {#install}

הפעל את הפקודה הבאה בשרת שלך כדי להוריד ולהפעיל את סקריפט ההתקנה:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### סקריפט התקנה לאיתור באגים {#debug-install-script}

הוסף `DEBUG=true` לפני סקריפט ההתקנה לקבלת פלט מפורט:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### הנחיות {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **הגדרה ראשונית**: הורד את קוד העברת הדוא"ל העדכני ביותר, קבע את ההגדרה של הסביבה, בקשה לדומיין המותאם אישית שלך והגדר את כל האישורים, המפתחות והסודות הדרושים.
* **הגדרת גיבוי**: יגדיר cron לגיבוי mongoDB ו-redis באמצעות מאגר תואם S3 לאחסון מרוחק ומאובטח. בנפרד, sqlite יגובה בעת הכניסה אם יהיו שינויים עבור גיבויים מאובטחים ומוצפנים.
* **הגדרת שדרוג**: הגדר cron לחיפוש עדכונים ליליים אשר ישקמו ויפעילו מחדש בבטחה רכיבי תשתית.
* **חידוש אישורים**: Certbot / lets encrypt משמש לתעודות SSL והמפתחות יפוגו כל 3 חודשים. פעולה זו תחודש את האישורים עבור הדומיין שלך ותמקם אותם בתיקייה הדרושה לצריכת רכיבים קשורים. ראה [נתיבי קבצים חשובים](#important-file-paths)
* **שחזור מגיבוי**: יפעיל mongodb ו-redis לשחזור מנתוני גיבוי.

### הגדרה ראשונית (אפשרות 1) {#initial-setup-option-1}

בחר באפשרות `1. Initial setup` כדי להתחיל.

לאחר השלמת התהליך, אמורה להופיע הודעת הצלחה. ניתן אפילו להריץ `docker ps` כדי לראות את הרכיבים פועלים. מידע נוסף על הרכיבים מופיע בהמשך.

## שירותים {#services}

| שם השירות | יציאת ברירת מחדל | תֵאוּר |
| ------------ | :----------: | ------------------------------------------------------ |
| אינטרנט | `443` | ממשק אינטרנט לכל אינטראקציות המנהל |
| API | `4000` | שכבת API לבסיסי נתונים מופשטים |
| ברי | אַף לֹא אֶחָד | עבודת רקע ורץ משימות |
| SMTP | `465/587` | שרת SMTP לאימייל יוצא |
| SMTP ברי | אַף לֹא אֶחָד | עבודת רקע SMTP |
| MX | `2525` | החלפת דואר עבור דואר נכנס והעברת דואר אלקטרוני |
| IMAP | `993/2993` | שרת IMAP לניהול דואר נכנס ותיבות דואר |
| POP3 | `995/2995` | שרת POP3 לניהול דואר נכנס ותיבות דואר |
| SQLite | `3456` | שרת SQLite לאינטראקציות עם מסדי נתונים של sqlite |
| SQLite Bree | אַף לֹא אֶחָד | עבודת רקע של SQLite |
| CalDAV | `5000` | שרת CalDAV לניהול לוח שנה |
| כרטיסDAV | `6000` | שרת CardDAV לניהול לוחות שנה |
| MongoDB | `27017` | מסד נתונים MongoDB עבור רוב ניהול הנתונים |
| Redis | `6379` | Redis עבור מטמון וניהול מצב |
| SQLite | אַף לֹא אֶחָד | מסדי נתונים של SQLite עבור תיבות דואר מוצפנות |

### נתיבי קבצים חשובים {#important-file-paths}

הערה: *נתיב המארח* למטה הוא יחסי ל-`/root/forwardemail.net/self-hosting/`.

| רְכִיב | נתיב מארח | נתיב מיכל |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| סקלייט | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| קובץ Env | `./.env` | `/app/.env` |
| אישורי/מפתחות SSL | `./ssl` | `/app/ssl/` |
| מפתח פרטי | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| תעודת שרשרת מלאה | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| תעודות CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| מפתח פרטי DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## תצורה {#configuration}

### הגדרת DNS ראשונית {#initial-dns-setup}

בספק ה-DNS שבחרת, הגדר את רשומות ה-DNS המתאימות. שימו לב שכל דבר בסוגריים (`<>`) הוא דינמי ויש לעדכן אותו בערך שלכם.

| סוּג | שֵׁם | תוֹכֶן | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", או ריק | <כתובת_ip> | אוטומטי |
| CNAME | API | <שם_דומיין> | אוטומטי |
| CNAME | קלדב | <שם_דומיין> | אוטומטי |
| CNAME | קארדדאב | <שם_דומיין> | אוטומטי |
| CNAME | קופצני fe | <שם_דומיין> | אוטומטי |
| CNAME | imap | <שם_דומיין> | אוטומטי |
| CNAME | mx | <שם_דומיין> | אוטומטי |
| CNAME | פופ3 | <שם_דומיין> | אוטומטי |
| CNAME | smtp | <שם_דומיין> | אוטומטי |
| MX | "@", ".", או ריק | mx.<domain_name> (עדיפות 0) | אוטומטי |
| TXT | "@", ".", או ריק | "v=spf1 a -all" | אוטומטי |

#### רשומת DNS / PTR הפוכה {#reverse-dns--ptr-record}

רשומות DNS הפוך (rDNS) או רשומות מצביע הפוך (רשומות PTR) חיוניות עבור שרתי דוא"ל מכיוון שהן עוזרות לאמת את הלגיטימיות של השרת ששולח את האימייל. כל ספק ענן עושה זאת בצורה שונה, אז תצטרך לחפש כיצד להוסיף "DNS הפוך" כדי למפות את המארח וה-IP לשם המארח המתאים לו. ככל הנראה בקטע הרשת של הספק.

#### פורט 25 חסום {#port-25-blocked}

חלק מספקי האינטרנט וספקי הענן חוסמים 25 כדי להימנע משחקנים גרועים. ייתכן שיהיה עליך להגיש כרטיס תמיכה כדי לפתוח את יציאה 25 עבור SMTP / דואר אלקטרוני יוצא.

## קליטה {#onboarding}

1. פתחו את דף הנחיתה
נווטו אל https\://\<שם_הדומיין>, והחליפו את \<שם_הדומיין> בדומיין שתצורתו נקבעה בהגדרות ה-DNS שלכם. אתם אמורים לראות את דף הנחיתה של העברת דוא"ל.

2. התחברו והוסיפו את הדומיין שלכם

* היכנס באמצעות כתובת דוא"ל וסיסמה תקפים.
* הזן את שם הדומיין שברצונך להגדיר (שם הדומיין חייב להתאים לתצורת ה-DNS).
* פעל לפי ההנחיות כדי להוסיף את רשומות **MX** ו- **TXT** הנדרשות לאימות.

3. השלם את ההתקנה

* לאחר האימות, גשו לדף כינויים כדי ליצור את הכינוי הראשון שלכם.
* לחלופין, הגדר **SMTP עבור דוא"ל יוצא** ב **הגדרות הדומיין**. זה דורש רשומות DNS נוספות.

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## בדיקות {#testing}

### יצירת הכינוי הראשון שלך {#creating-your-first-alias}

1. נווטו לדף הכינויים
פתחו את דף ניהול הכינויים:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. הוסף כינוי חדש

* לחץ על **הוסף כינוי** (למעלה מימין).
* הזן את שם הכינוי והתאם את הגדרות הדוא"ל לפי הצורך.
* (אופציונלי) הפעל תמיכה ב- **IMAP/POP3/CalDAV/CardDAV** על ידי סימון תיבת הסימון.
* לחץ על **צור כינוי**.

3. הגדרת סיסמה

* לחץ על **צור סיסמה** כדי ליצור סיסמה מאובטחת.
* סיסמה זו תידרש כדי להתחבר לתוכנת הדוא"ל שלך.

4. הגדרת תוכנת הדוא"ל שלך

* השתמש בתוכנת דוא"ל כמו Thunderbird.
* הזן את שם הכינוי ואת הסיסמה שנוצרה.
* קבע את הגדרות **IMAP** ו- **SMTP** בהתאם.

#### הגדרות שרת דוא"ל {#email-server-settings}

שם משתמש: `<alias name>`

| סוּג | שם מארח | נָמָל | אבטחת חיבור | אימות |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465 | SSL / TLS | סיסמה רגילה |
| IMAP | imap.<domain_name> | 993 | SSL / TLS | סיסמה רגילה |

### שולח/מקבל את האימייל הראשון שלך {#sending--receiving-your-first-email}

לאחר ההגדרה, אתה אמור להיות מסוגל לשלוח ולקבל דוא"ל לכתובת הדוא"ל החדשה שלך שנוצרה ומתארחת בעצמך!

## פתרון בעיות {#troubleshooting}

#### למה זה לא עובד מחוץ לאובונטו ודביאן {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

אנחנו מחפשים כעת תמיכה ב-MacOS ונחפש גם אחרים. אנא פתחו קובץ [דִיוּן](https://github.com/orgs/forwardemail/discussions) או תרמו אם תרצו שאחרים יתמכו.

#### מדוע אתגר ה-acme של certbot נכשל {#why-is-the-certbot-acme-challenge-failing}

המכשול הנפוצ ביותר הוא שלפעמים certbot / letsencrypt יבקשו **2** אתגרים. עליכם לוודא שאתם מוסיפים **BOTH** רשומות txt.

דוגמה:
ייתכן שתראו שני אתגרים כמו אלה:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

ייתכן גם שהפצת ה-DNS לא הושלמה. ניתן להשתמש בכלים כמו: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. זה ייתן לך מושג אם השינויים ברשומת ה-TXT שלך צריכים לבוא לידי ביטוי. ייתכן גם שמטמון ה-DNS המקומי במארח שלך עדיין משתמש בערך ישן ומיושן או שלא קלט את השינויים האחרונים.

אפשרות נוספת היא להשתמש בשינויי DNS אוטומטיים של cerbot על ידי הגדרת קובץ `/root/.cloudflare.ini` עם אסימון ה-API ב-cloud-init / user-data שלך בהגדרה הראשונית של VPS או ליצור קובץ זה ולהריץ את הסקריפט שוב. פעולה זו תנהל את שינויי ה-DNS ותאתגר עדכונים באופן אוטומטי.

### מהם שם המשתמש והסיסמה הבסיסיים לאימות {#what-is-the-basic-auth-username-and-password}

עבור אחסון עצמי, אנו מוסיפים חלון קופץ לאימות דפדפן ראשוני עם שם משתמש פשוט (`admin`) וסיסמה (שנוצרים באופן אקראי בהגדרה הראשונית). אנו מוסיפים זאת רק כהגנה למקרה שאוטומציה/סקרייברים יקדמו אתכם בהרשמה הראשונה לחוויית האינטרנט. תוכלו למצוא סיסמה זו לאחר ההגדרה הראשונית בקובץ `.env` שלכם תחת `AUTH_BASIC_USERNAME` ו- `AUTH_BASIC_PASSWORD`.

### איך אני יודע מה פועל {#how-do-i-know-what-is-running}

ניתן להריץ את `docker ps` כדי לראות את כל הקונטיינרים הפועלים אשר מופעלים מקובץ `docker-compose-self-hosting.yml`. ניתן גם להריץ את `docker ps -a` כדי לראות הכל (כולל קונטיינרים שאינם פועלים).

### איך אני יודע אם משהו שאמור להיות {#how-do-i-know-if-something-isnt-running-that-should-be} לא פועל?

ניתן להריץ `docker ps -a` כדי לראות הכל (כולל קונטיינרים שאינם פועלים). ייתכן שתראה יומן יציאה או הערה.

### איך אני מוצא יומני רישום {#how-do-i-find-logs}

ניתן לקבל עוד יומנים דרך `docker logs -f <container_name>`. אם משהו יצא, סביר להניח שזה קשור לקובץ `.env` שתצורתו שגויה.

בתוך ממשק המשתמש של האינטרנט, ניתן לצפות ב-`/admin/emails` וב-`/admin/logs` עבור יומני דוא"ל יוצא ויומני שגיאות בהתאמה.

### מדוע תפוגת הזמן של האימיילים היוצאים שלי נגמרה {#why-are-my-outgoing-emails-timing-out}

אם אתה רואה הודעה כמו הזמן הקצוב לחיבור בזמן ההתחברות לשרת MX... אז ייתכן שתצטרך לבדוק אם יציאה 25 חסומה. זה נפוץ שספקי אינטרנט או ספקי ענן חוסמים זאת כברירת מחדל, כאשר ייתכן שתצטרך לפנות לתמיכה / להגיש כרטיס כדי לפתוח את זה.

#### אילו כלים עליי להשתמש כדי לבדוק את שיטות העבודה המומלצות לתצורת דוא"ל ואת מוניטין ה-IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

תסתכלו על [שאלות נפוצות כאן](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) שלנו.