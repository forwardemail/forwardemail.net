# Listmonk עם Forward Email למשלוח ניוזלטר מאובטח {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## תוכן העניינים {#table-of-contents}

* [סקירה כללית](#overview)
* [למה Listmonk ו-Forward Email](#why-listmonk-and-forward-email)
* [דרישות מוקדמות](#prerequisites)
* [התקנה](#installation)
  * [1. עדכן את השרת שלך](#1-update-your-server)
  * [2. התקן תלותיות](#2-install-dependencies)
  * [3. הורד את קובץ התצורה של Listmonk](#3-download-listmonk-configuration)
  * [4. הגדר חומת אש (UFW)](#4-configure-firewall-ufw)
  * [5. הגדר גישה HTTPS](#5-configure-https-access)
  * [6. הפעל את Listmonk](#6-start-listmonk)
  * [7. הגדר SMTP של Forward Email ב-Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. הגדר עיבוד החזרות (Bounce Processing)](#8-configure-bounce-processing)
* [בדיקות](#testing)
  * [צור רשימת תפוצה](#create-a-mailing-list)
  * [הוסף מנויים](#add-subscribers)
  * [צור ושלח קמפיין](#create-and-send-a-campaign)
* [אימות](#verification)
* [הערות למפתחים](#developer-notes)
* [סיכום](#conclusion)


## סקירה כללית {#overview}

מדריך זה מספק למפתחים הוראות שלב-אחר-שלב להגדרת [Listmonk](https://listmonk.app/), מנהל רשימות תפוצה וניוזלטר חזק בקוד פתוח, לשימוש ב-[Forward Email](https://forwardemail.net/) כספק SMTP שלו. שילוב זה מאפשר לך לנהל את הקמפיינים שלך ביעילות תוך הבטחת משלוח דוא"ל מאובטח, פרטי ואמין.

* **Listmonk**: מטפל בניהול מנויים, ארגון רשימות, יצירת קמפיינים ומעקב ביצועים.
* **Forward Email**: משמש כשרת SMTP מאובטח, המטפל בשליחה בפועל של המיילים עם תכונות אבטחה מובנות כמו SPF, DKIM, DMARC והצפנת TLS.

על ידי שילוב שני אלה, אתה שומר על שליטה מלאה על הנתונים והתשתית שלך תוך ניצול מערכת המשלוח החזקה של Forward Email.


## למה Listmonk ו-Forward Email {#why-listmonk-and-forward-email}

* **קוד פתוח**: גם Listmonk וגם העקרונות שמאחורי Forward Email מדגישים שקיפות ושליטה. אתה מארח את Listmonk בעצמך, ובבעלותך הנתונים.
* **ממוקד פרטיות**: Forward Email בנוי עם פרטיות בלב, מצמצם שמירת נתונים ומתמקד בהעברה מאובטחת.
* **חסכוני**: Listmonk חינמי, ו-Forward Email מציע שכבות חינמיות נדיבות ותכניות בתשלום במחיר סביר, מה שהופך זאת לפתרון ידידותי לתקציב.
* **סקלאביליות**: Listmonk בעל ביצועים גבוהים, ותשתית Forward Email מתוכננת למשלוח אמין בקנה מידה גדול.
* **ידידותי למפתחים**: ל-Listmonk יש API חזק, ו-Forward Email מספק אינטגרציה פשוטה עם SMTP ו-webhooks.


## דרישות מוקדמות {#prerequisites}

לפני שתתחיל, ודא שיש לך את הדברים הבאים:

* שרת פרטי וירטואלי (VPS) עם הפצת לינוקס עדכנית (מומלץ Ubuntu 20.04+) עם לפחות 1 מעבד ו-1GB RAM (מומלץ 2GB).
  * צריך ספק? עיין ב-[רשימת ספקי VPS מומלצים](https://github.com/forwardemail/awesome-mail-server-providers).
* שם דומיין שבבעלותך (נדרש גישה ל-DNS).
* חשבון פעיל ב-[Forward Email](https://forwardemail.net/).
* גישת root או `sudo` ל-VPS שלך.
* היכרות בסיסית עם פעולות שורת הפקודה בלינוקס.


## התקנה {#installation}

שלבים אלה ינחו אותך בהתקנת Listmonk באמצעות Docker ו-Docker Compose על ה-VPS שלך.

### 1. עדכן את השרת שלך {#1-update-your-server}

ודא שרשימת החבילות והחבילות המותקנות במערכת מעודכנות.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. התקן תלותיות {#2-install-dependencies}

התקן את Docker, Docker Compose ו-UFW (חומת אש פשוטה).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. הורד את קובץ התצורה של Listmonk {#3-download-listmonk-configuration}

צור תיקייה עבור Listmonk והורד את קובץ `docker-compose.yml` הרשמי.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

קובץ זה מגדיר את מכולת האפליקציה של Listmonk ואת מכולת מסד הנתונים PostgreSQL הנדרשת לה.
### 4. הגדרת חומת אש (UFW) {#4-configure-firewall-ufw}

אפשר תעבורה חיונית (SSH, HTTP, HTTPS) דרך חומת האש. אם ה-SSH שלך רץ על פורט לא סטנדרטי, התאם בהתאם.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

אשר את הפעלת חומת האש כאשר תתבקש.

### 5. הגדרת גישה HTTPS {#5-configure-https-access}

הרצת Listmonk דרך HTTPS היא קריטית לאבטחה. יש לך שתי אפשרויות עיקריות:

#### אפשרות א: שימוש בפרוקסי של Cloudflare (מומלץ לפשטות) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

אם ה-DNS של הדומיין שלך מנוהל על ידי Cloudflare, תוכל לנצל את תכונת הפרוקסי שלהם לקבלת HTTPS בקלות.

1. **כוון DNS**: צור רשומת `A` ב-Cloudflare עבור תת-הדומיין של Listmonk שלך (למשל, `listmonk.yourdomain.com`) שמצביעה על כתובת ה-IP של ה-VPS שלך. ודא שסטטוס ה-**Proxy** מוגדר ל-**Proxied** (ענן כתום).
2. **שנה את Docker Compose**: ערוך את הקובץ `docker-compose.yml` שהורדת:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   זה מאפשר ל-Listmonk להיות נגיש פנימית על פורט 80, ש-Cloudflare יכול לפרוקסי ולאבטח עם HTTPS.

#### אפשרות ב: שימוש בפרוקסי הפוך (Nginx, Caddy וכו') {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

חלופה לכך היא להגדיר פרוקסי הפוך כמו Nginx או Caddy על ה-VPS שלך לטיפול בסיום HTTPS ופרוקסי של הבקשות ל-Listmonk (הרץ על פורט 9000 כברירת מחדל).

* שמור את ברירת המחדל `ports: - "127.0.0.1:9000:9000"` בקובץ `docker-compose.yml` כדי להבטיח ש-Listmonk יהיה נגיש רק מקומית.
* הגדר את הפרוקסי ההפוך שבחרת להאזין על פורטים 80 ו-443, לטפל ברכישת תעודת SSL (למשל, דרך Let's Encrypt), ולהעביר תעבורה ל-`http://127.0.0.1:9000`.
* הגדרת פרוקסי הפוך מפורטת חורגת מהיקף המדריך הזה, אך קיימים מדריכים רבים זמינים באינטרנט.

### 6. הפעלת Listmonk {#6-start-listmonk}

חזור לתיקיית `listmonk` שלך (אם אינך שם כבר) והפעל את הקונטיינרים במצב מנותק.

```bash
cd ~/listmonk # או התיקייה שבה שמרת את docker-compose.yml
docker compose up -d
```

Docker יוריד את התמונות הנדרשות ויפעיל את אפליקציית Listmonk ואת קונטיינרי מסד הנתונים. זה עשוי לקחת דקה או שתיים בפעם הראשונה.

✅ **גישה ל-Listmonk**: כעת אמור להיות באפשרותך לגשת לממשק האינטרנט של Listmonk דרך הדומיין שהגדרת (למשל, `https://listmonk.yourdomain.com`).

### 7. הגדרת SMTP של Forward Email ב-Listmonk {#7-configure-forward-email-smtp-in-listmonk}

כעת, הגדר את Listmonk לשלוח מיילים באמצעות חשבון Forward Email שלך.

1. **הפעל SMTP ב-Forward Email**: ודא שיצרת אישורי SMTP בלוח הבקרה של חשבון Forward Email שלך. עקוב אחר [המדריך של Forward Email לשליחת מייל עם דומיין מותאם אישית דרך SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) אם עדיין לא עשית זאת.
2. **הגדר את Listmonk**: היכנס ללוח הניהול של Listmonk.
   * עבור ל-**Settings -> SMTP**.

   * ל-Listmonk יש תמיכה מובנית ב-Forward Email. בחר **ForwardEmail** מרשימת הספקים, או הזן ידנית את הפרטים הבאים:

     | הגדרה            | ערך                                                                                                                |
     | :---------------- | :----------------------------------------------------------------------------------------------------------------- |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Port**          | `465`                                                                                                              |
     | **Auth protocol** | `LOGIN`                                                                                                            |
     | **Username**      | שם המשתמש SMTP שלך ב-Forward Email                                                                                 |
     | **Password**      | סיסמת ה-SMTP שלך ב-Forward Email                                                                                   |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **From e-mail**   | כתובת ה-`From` הרצויה (למשל, `newsletter@yourdomain.com`). ודא שדומיין זה מוגדר ב-Forward Email.                   |
* **חשוב**: תמיד השתמש ב-Port `465` עם `SSL/TLS` לחיבורים מאובטחים עם Forward Email (מומלץ). Port `587` עם STARTTLS נתמך גם כן אך SSL/TLS מועדף.

   * לחץ על **שמור**.
3. **שלח דואר אלקטרוני לבדיקה**: השתמש בכפתור "שלח דואר אלקטרוני לבדיקה" בדף הגדרות SMTP. הזן כתובת נמען שאליה יש לך גישה ולחץ על **שלח**. אמת שהדואר מגיע לתיבת הדואר של הנמען.

### 8. הגדרת עיבוד החזרות {#8-configure-bounce-processing}

עיבוד החזרות מאפשר ל-Listmonk לטפל אוטומטית בדואר אלקטרוני שלא נמסר (למשל, עקב כתובות לא תקינות). Forward Email מספק webhook להודיע ל-Listmonk על החזרות.

#### הגדרת Forward Email {#forward-email-setup}

1. התחבר ל-[לוח הבקרה של Forward Email](https://forwardemail.net/).
2. עבור ל-**דומיינים**, בחר את הדומיין שבו אתה משתמש לשליחה, ועבור לדף **הגדרות** שלו.
3. גלול למטה אל סעיף **כתובת ה-Webhook להחזרות**.
4. הזן את ה-URL הבא, כשהחלף את `<your_listmonk_domain>` בדומיין או תת-דומיין שבו מופעל ה-Listmonk שלך:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *דוגמה*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. גלול עוד למטה אל סעיף **מפתח אימות חתימת ה-Webhook**.
6. **העתק** את מפתח האימות שנוצר. תזדקק לו ב-Listmonk.
7. שמור את השינויים בהגדרות הדומיין ב-Forward Email.

#### הגדרת Listmonk {#listmonk-setup}

1. בפאנל הניהול של Listmonk, עבור ל-**הגדרות -> החזרות**.
2. הפעל את **אפשר עיבוד החזרות**.
3. הפעל את **אפשר webhooks להחזרות**.
4. גלול למטה אל סעיף **ספקי Webhook**.
5. הפעל את **Forward Email**.
6. הדבק את **מפתח אימות חתימת ה-Webhook** שהעתקת מלוח הבקרה של Forward Email בשדה **מפתח Forward Email**.
7. לחץ על **שמור** בתחתית הדף.
8. עיבוד ההחזרות מוגדר כעת! כאשר Forward Email מזהה החזרה עבור דואר שנשלח על ידי Listmonk, הוא יודיע ל-Listmonk דרך ה-webhook, ו-Listmonk יסמן את המנוי בהתאם.
9. השלם את השלבים הבאים ב-[בדיקות](#testing) כדי לוודא שהכל פועל.

## בדיקות {#testing}

הנה סקירה מהירה של פונקציות הליבה של Listmonk:

### יצירת רשימת תפוצה {#create-a-mailing-list}

* עבור ל-**רשימות** בסרגל הצד.
* לחץ על **רשימה חדשה**.
* מלא את הפרטים (שם, סוג: ציבורי/פרטי, תיאור, תגיות) ולחץ על **שמור**.

### הוספת מנויים {#add-subscribers}

* עבור לסעיף **מנויים**.
* ניתן להוסיף מנויים:
  * **ידנית**: לחץ על **מנוי חדש**.
  * **ייבוא**: לחץ על **ייבא מנויים** להעלאת קובץ CSV.
  * **API**: השתמש ב-API של Listmonk להוספות תכנותיות.
* הקצה מנויים לאחת או יותר רשימות בזמן יצירה או ייבוא.
* **המלצה**: השתמש בתהליך double opt-in. הגדר זאת תחת **הגדרות -> הרשמה ומנויים**.

### יצירת ושליחת קמפיין {#create-and-send-a-campaign}

* עבור ל-**קמפיינים** -> **קמפיין חדש**.
* מלא את פרטי הקמפיין (שם, נושא, דואר שולח, רשימה/רשימות לשליחה).
* בחר את סוג התוכן שלך (טקסט עשיר/HTML, טקסט רגיל, HTML גולמי).
* הרכב את תוכן המייל. ניתן להשתמש במשתני תבנית כמו `{{ .Subscriber.Email }}` או `{{ .Subscriber.FirstName }}`.
* **תמיד שלח מייל בדיקה קודם!** השתמש באפשרות "שלח בדיקה" כדי לצפות במייל בתיבת הדואר שלך.
* לאחר שביעות רצון, לחץ על **התחל קמפיין** לשליחה מיידית או לתזמון מאוחר יותר.

## אימות {#verification}

* **שליחת SMTP**: שלח מיילי בדיקה באופן קבוע דרך דף הגדרות SMTP של Listmonk וקמפיינים לבדיקה כדי לוודא שהמיילים נשלחים כראוי.
* **טיפול בהחזרות**: שלח קמפיין בדיקה לכתובת דואר לא תקינה ידועה (למשל, `bounce-test@yourdomain.com` אם אין לך כתובת אמיתית זמינה, אך התוצאות עשויות להשתנות). בדוק את סטטיסטיקות הקמפיין ב-Listmonk לאחר זמן קצר כדי לראות אם ההחזרה נרשמה.
* **כותרות דואר**: השתמש בכלים כמו [Mail-Tester](https://www.mail-tester.com/) או בדוק ידנית את כותרות הדואר כדי לוודא ש-SPF, DKIM ו-DMARC עוברים, מה שמעיד על הגדרה נכונה דרך Forward Email.
* **יומני Forward Email**: בדוק את יומני לוח הבקרה של Forward Email אם אתה חושד בבעיות משלוח שמקורן בשרת SMTP.
## הערות למפתחים {#developer-notes}

* **תבניות**: Listmonk משתמש במנוע התבניות של Go. חקור את התיעוד שלו להתאמה אישית מתקדמת: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk מספק API REST מקיף לניהול רשימות, מנויים, קמפיינים, תבניות ועוד. מצא את קישור התיעוד של ה-API בכותרת התחתונה של מופע Listmonk שלך.
* **שדות מותאמים אישית**: הגדר שדות מנוי מותאמים אישית תחת **הגדרות -> שדות מנוי** לאחסון נתונים נוספים.
* **Webhookים**: בנוסף ל-bounces, Listmonk יכול לשלוח webhookים לאירועים אחרים (למשל, הרשמות), מה שמאפשר אינטגרציה עם מערכות אחרות.


## סיכום {#conclusion}

על ידי שילוב הכוח של Listmonk המותקן עצמאית עם המסירה המאובטחת והמתחשבת בפרטיות של Forward Email, אתה יוצר פלטפורמת שיווק בדוא"ל חזקה ואתית. אתה שומר על בעלות מלאה על נתוני הקהל שלך תוך כדי שאתה נהנה מתפוצה גבוהה ותכונות אבטחה אוטומטיות.

הגדרה זו מספקת אלטרנטיבה ניתנת להרחבה, חסכונית וידידותית למפתחים לשירותי דוא"ל קנייניים, ומתאימה באופן מושלם לאתוס של תוכנה בקוד פתוח ופרטיות המשתמש.

שליחה מוצלחת! 🚀
