# כיצד לייעל תשתית הפקה של Node.js: שיטות עבודה מומלצות {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="מדריך לאופטימיזציית ביצועי Node.js" class="rounded-lg" />


## תוכן העניינים {#table-of-contents}

* [הקדמה](#foreword)
* [מהפכת האופטימיזציה שלנו לביצועי ליבה יחידה ב-573%](#our-573-single-core-performance-optimization-revolution)
  * [מדוע אופטימיזציית ביצועי ליבה יחידה חשובה ל-Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [תוכן קשור](#related-content)
* [הגדרת סביבת הפקה ל-Node.js: ערכת הטכנולוגיה שלנו](#nodejs-production-environment-setup-our-technology-stack)
  * [מנהל חבילות: pnpm ליעילות בהפקה](#package-manager-pnpm-for-production-efficiency)
  * [מסגרת עבודה לאינטרנט: Koa להפקת Node.js מודרנית](#web-framework-koa-for-modern-nodejs-production)
  * [עיבוד עבודות רקע: Bree לאמינות בהפקה](#background-job-processing-bree-for-production-reliability)
  * [טיפול בשגיאות: @hapi/boom לאמינות בהפקה](#error-handling-hapiboom-for-production-reliability)
* [כיצד לנטר אפליקציות Node.js בהפקה](#how-to-monitor-nodejs-applications-in-production)
  * [ניטור הפקה ברמת מערכת ל-Node.js](#system-level-nodejs-production-monitoring)
  * [ניטור ברמת אפליקציה להפקת Node.js](#application-level-monitoring-for-nodejs-production)
  * [ניטור ספציפי לאפליקציה](#application-specific-monitoring)
* [ניטור הפקה של Node.js עם בדיקות בריאות PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [מערכת בדיקות הבריאות שלנו ב-PM2](#our-pm2-health-check-system)
  * [הגדרת ההפקה שלנו ל-PM2](#our-pm2-production-configuration)
  * [פריסת PM2 אוטומטית](#automated-pm2-deployment)
* [מערכת טיפול וסיווג שגיאות בהפקה](#production-error-handling-and-classification-system)
  * [היישום שלנו של isCodeBug להפקה](#our-iscodebug-implementation-for-production)
  * [אינטגרציה עם הלוגים שלנו בהפקה](#integration-with-our-production-logging)
  * [תוכן קשור](#related-content-1)
* [ניפוי ביצועים מתקדם עם v8-profiler-next ו-cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [גישת הפרופיל שלנו להפקת Node.js](#our-profiling-approach-for-nodejs-production)
  * [כיצד אנו מיישמים ניתוח צילום מצב זיכרון (Heap Snapshot)](#how-we-implement-heap-snapshot-analysis)
  * [זרימת עבודה לניפוי ביצועים](#performance-debugging-workflow)
  * [יישום מומלץ לאפליקציית Node.js שלך](#recommended-implementation-for-your-nodejs-application)
  * [אינטגרציה עם הניטור שלנו בהפקה](#integration-with-our-production-monitoring)
* [אבטחת תשתית הפקה של Node.js](#nodejs-production-infrastructure-security)
  * [אבטחת מערכת ברמת מערכת להפקת Node.js](#system-level-security-for-nodejs-production)
  * [אבטחת אפליקציות ל-Node.js](#application-security-for-nodejs-applications)
  * [אוטומציה לאבטחת תשתית](#infrastructure-security-automation)
  * [התוכן שלנו בנושא אבטחה](#our-security-content)
* [ארכיטקטורת מסדי נתונים לאפליקציות Node.js](#database-architecture-for-nodejs-applications)
  * [יישום SQLite להפקת Node.js](#sqlite-implementation-for-nodejs-production)
  * [יישום MongoDB להפקת Node.js](#mongodb-implementation-for-nodejs-production)
* [עיבוד עבודות רקע בהפקת Node.js](#nodejs-production-background-job-processing)
  * [הגדרת שרת Bree שלנו להפקה](#our-bree-server-setup-for-production)
  * [דוגמאות לעבודה בהפקה](#production-job-examples)
  * [תבניות תזמון העבודה שלנו להפקת Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [תחזוקה אוטומטית לאפליקציות Node.js בהפקה](#automated-maintenance-for-production-nodejs-applications)
  * [היישום שלנו לניקוי](#our-cleanup-implementation)
  * [ניהול שטח דיסק להפקת Node.js](#disk-space-management-for-nodejs-production)
  * [אוטומציה לתחזוקת תשתית](#infrastructure-maintenance-automation)
* [מדריך יישום לפריסת הפקה של Node.js](#nodejs-production-deployment-implementation-guide)
  * [למדו מהקוד האמיתי שלנו לשיטות עבודה מומלצות בהפקה](#study-our-actual-code-for-production-best-practices)
  * [למדו מפוסטים בבלוג שלנו](#learn-from-our-blog-posts)
  * [אוטומציה לתשתית להפקת Node.js](#infrastructure-automation-for-nodejs-production)
  * [מקרי מבחן שלנו](#our-case-studies)
* [סיכום: שיטות עבודה מומלצות לפריסת הפקה של Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [רשימת משאבים מלאה להפקת Node.js](#complete-resource-list-for-nodejs-production)
  * [קבצי היישום המרכזיים שלנו](#our-core-implementation-files)
  * [יישומי השרת שלנו](#our-server-implementations)
  * [האוטומציה לתשתית שלנו](#our-infrastructure-automation)
  * [פוסטים טכניים בבלוג שלנו](#our-technical-blog-posts)
  * [מקרי מבחן ארגוניים שלנו](#our-enterprise-case-studies)
## הקדמה {#foreword}

ב-Forward Email, בילינו שנים בשיפור סביבת הייצור שלנו ב-Node.js. מדריך מקיף זה משתף את שיטות העבודה המומלצות שלנו לפריסת ייצור ב-Node.js שנבדקו בשטח, עם דגש על אופטימיזציית ביצועים, ניטור, והלקחים שלמדנו בהרחבת יישומי Node.js לטיפול במיליוני עסקאות יומיות.


## מהפכת אופטימיזציית ביצועי הליבה היחידה שלנו ב-573% {#our-573-single-core-performance-optimization-revolution}

כאשר עברנו ממעבדי Intel למעבדי AMD Ryzen, השגנו **שיפור ביצועים של 573%** ביישומי Node.js שלנו. זו לא הייתה רק אופטימיזציה קטנה – היא שינתה באופן יסודי את אופן ביצוע יישומי Node.js שלנו בייצור ומדגימה את החשיבות של אופטימיזציית ביצועי ליבה יחידה לכל יישום Node.js.

> \[!TIP]
> לשיטות עבודה מומלצות לפריסת ייצור ב-Node.js, בחירת חומרה היא קריטית. בחרנו במיוחד באירוח DataPacket בזכות זמינות AMD Ryzen שלהם, כי ביצועי ליבה יחידה הם קריטיים ליישומי Node.js מכיוון שהרצת JavaScript היא חד-תהליכית.

### למה אופטימיזציית ביצועי ליבה יחידה חשובה ל-Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

המעבר שלנו מ-Intel ל-AMD Ryzen הביא ל:

* **שיפור ביצועים של 573%** בעיבוד בקשות (מתועד ב-[דף הסטטוס שלנו ב-GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **הסרת עיכובים בעיבוד** לתגובות כמעט מיידיות (מוזכר ב-[GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **יחס מחיר-ביצועים טוב יותר** לסביבות ייצור Node.js
* **שיפור בזמני תגובה** בכל נקודות הקצה של היישום שלנו

הגברת הביצועים הייתה כה משמעותית שכעת אנו רואים במעבדי AMD Ryzen חיוניים לכל פריסת ייצור רצינית של Node.js, בין אם אתם מפעילים יישומי ווב, APIs, מיקרו-שירותים או כל עומס עבודה אחר של Node.js.

### תוכן קשור {#related-content}

למידע נוסף על בחירות התשתית שלנו, עיינו ב:

* [שירות העברת דואר אלקטרוני הטוב ביותר](https://forwardemail.net/blog/docs/best-email-forwarding-service) - השוואות ביצועים
* [פתרון עצמי מתארח](https://forwardemail.net/blog/docs/self-hosted-solution) - המלצות חומרה


## הגדרת סביבת ייצור Node.js: ערכת הטכנולוגיה שלנו {#nodejs-production-environment-setup-our-technology-stack}

שיטות העבודה המומלצות שלנו לפריסת ייצור ב-Node.js כוללות בחירות טכנולוגיות מכוונות המבוססות על שנות ניסיון בייצור. הנה מה שאנחנו משתמשים ולמה הבחירות האלה חלות על כל יישום Node.js:

### מנהל חבילות: pnpm ליעילות בייצור {#package-manager-pnpm-for-production-efficiency}

**מה שאנחנו משתמשים:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (גרסה מקובעת)

בחרנו ב-pnpm על פני npm ו-yarn להגדרת סביבת הייצור שלנו ב-Node.js בגלל:

* **זמני התקנה מהירים יותר** בצינורות CI/CD
* **יעילות בשימוש בדיסק** באמצעות hard linking
* **פתרון תלות קפדני** שמונע תלותות פנטום
* **ביצועים טובים יותר** בפריסות ייצור

> \[!NOTE]
> כחלק משיטות העבודה המומלצות שלנו לפריסת ייצור ב-Node.js, אנו מקבעים גרסאות מדויקות של כלים קריטיים כמו pnpm כדי להבטיח התנהגות עקבית בכל הסביבות ובמחשבי חברי הצוות.

**פרטי יישום:**

* [הגדרת package.json שלנו](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [פוסט הבלוג שלנו על אקוסיסטם NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### מסגרת ווב: Koa לייצור מודרני ב-Node.js {#web-framework-koa-for-modern-nodejs-production}

**מה שאנחנו משתמשים:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
בחרנו ב-Koa על פני Express לתשתית הייצור שלנו ב-Node.js בגלל התמיכה המודרנית ב-async/await וההרכבה הנקייה יותר של middleware. המייסד שלנו ניק באו (Nick Baugh) תרם גם ל-Express וגם ל-Koa, מה שמעניק לנו תובנה עמוקה על שני המסגרות לשימוש בייצור.

תבניות אלו חלות בין אם אתם בונים REST APIs, שרתי GraphQL, יישומי ווב או מיקרו-שירותים.

**דוגמאות ליישום שלנו:**

* [הגדרת שרת ווב](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [הגדרת שרת API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [מדריך ליישום טפסי יצירת קשר](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### עיבוד עבודות רקע: Bree לאמינות בייצור {#background-job-processing-bree-for-production-reliability}

**מה שאנחנו משתמשים:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) מתזמן

יצרנו ומתחזקים את Bree כי מתזמי עבודות קיימים לא ענו על הצרכים שלנו לתמיכה ב-worker threads ותכונות JavaScript מודרניות בסביבות Node.js בייצור. זה חל על כל יישום Node.js שצריך עיבוד ברקע, משימות מתוזמנות או worker threads.

**דוגמאות ליישום שלנו:**

* [הגדרת שרת Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [כל הגדרות העבודות שלנו](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [משימת בדיקת בריאות PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [יישום משימת ניקוי](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### טיפול בשגיאות: @hapi/boom לאמינות בייצור {#error-handling-hapiboom-for-production-reliability}

**מה שאנחנו משתמשים:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

אנו משתמשים ב-@hapi/boom לתגובות שגיאה מובנות בכל יישומי ה-Node.js שלנו בייצור. תבנית זו מתאימה לכל יישום Node.js שצריך טיפול שגיאות עקבי.

**דוגמאות ליישום שלנו:**

* [עוזר לסיווג שגיאות](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [יישום לוגר](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## כיצד לנטר יישומי Node.js בייצור {#how-to-monitor-nodejs-applications-in-production}

הגישה שלנו לניטור יישומי Node.js בייצור התפתחה במשך שנים של הפעלת יישומים בקנה מידה גדול. אנו מיישמים ניטור ברמות מרובות כדי להבטיח אמינות וביצועים לכל סוג של יישום Node.js.

### ניטור Node.js ברמת מערכת בייצור {#system-level-nodejs-production-monitoring}

**היישום המרכזי שלנו:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**מה שאנחנו משתמשים:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

ספי הניטור שלנו בייצור (מהקוד שלנו בייצור בפועל):

* **מגבלת גודל heap של 2GB** עם התראות אוטומטיות
* **סף אזהרה של שימוש בזיכרון 25%**
* **סף התראה של שימוש ב-CPU 80%**
* **סף אזהרה של שימוש בדיסק 75%**

> \[!WARNING]
> ספים אלו מתאימים לתצורת החומרה הספציפית שלנו. בעת יישום ניטור Node.js בייצור, עיינו ביישום monitor-server.js שלנו כדי להבין את הלוגיקה המדויקת ולהתאים את הערכים לסביבתכם.

### ניטור ברמת היישום ל-Node.js בייצור {#application-level-monitoring-for-nodejs-production}

**סיווג השגיאות שלנו:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

עוזר זה מבדיל בין:

* **באגים בקוד אמיתיים** שדורשים טיפול מיידי
* **שגיאות משתמש** שהן התנהגות צפויה
* **כשלי שירות חיצוני** שאינם בשליטתנו

תבנית זו חלה על כל יישום Node.js - אפליקציות ווב, APIs, מיקרו-שירותים או שירותי רקע.
**מימוש הרישום שלנו:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

אנו מיישמים טשטוש שדות מקיף כדי להגן על מידע רגיש תוך שמירה על יכולות איתור תקלות שימושיות בסביבת הייצור שלנו ב-Node.js.

### ניטור ספציפי ליישום {#application-specific-monitoring}

**מימושי השרת שלנו:**

* [שרת SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [שרת IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [שרת POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**ניטור תורים:** אנו מיישמים מגבלות תור של 5GB וזמני המתנה של 180 שניות לעיבוד בקשות כדי למנוע התשה של משאבים. דפוסים אלו חלים על כל יישום Node.js עם תורים או עיבוד ברקע.


## ניטור ייצור ב-Node.js עם בדיקות בריאות PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

שיפרנו את הגדרת סביבת הייצור שלנו ב-Node.js עם PM2 לאורך שנות ניסיון בייצור. בדיקות הבריאות של PM2 שלנו חיוניות לשמירה על אמינות בכל יישום Node.js.

### מערכת בדיקות הבריאות של PM2 שלנו {#our-pm2-health-check-system}

**מימוש הליבה שלנו:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

ניטור הייצור שלנו ב-Node.js עם בדיקות בריאות PM2 כולל:

* **ריצה כל 20 דקות** באמצעות תזמון cron
* **דורש מינימום 15 דקות זמן פעילות** לפני שמחשיבים תהליך כבריא
* **מאמת סטטוס תהליך ושימוש בזיכרון**
* **מאתחל אוטומטית תהליכים שנכשלו**
* **מונע לולאות אתחול** באמצעות בדיקות בריאות חכמות

> \[!CAUTION]
> לשיטות הטובות ביותר לפריסת ייצור ב-Node.js, אנו דורשים 15+ דקות זמן פעילות לפני שמחשיבים תהליך כבריא כדי למנוע לולאות אתחול. זה מונע כשלונות מצטברים כאשר תהליכים מתקשים עם זיכרון או בעיות אחרות.

### תצורת הייצור שלנו ב-PM2 {#our-pm2-production-configuration}

**הגדרת האקוסיסטם שלנו:** למדו את קבצי הפעלת השרת שלנו להגדרת סביבת ייצור ב-Node.js:

* [שרת ווב](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [שרת API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [מתזמן Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [שרת SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

דפוסים אלו חלים בין אם אתם מפעילים אפליקציות Express, שרתי Koa, APIs של GraphQL, או כל יישום Node.js אחר.

### פריסת PM2 אוטומטית {#automated-pm2-deployment}

**פריסת PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

אנו מאוטומטים את כל הגדרת PM2 שלנו דרך Ansible כדי להבטיח פריסות ייצור Node.js עקביות בכל השרתים שלנו.


## מערכת טיפול וסיווג שגיאות בייצור {#production-error-handling-and-classification-system}

אחת משיטות העבודה הטובות ביותר שלנו לפריסת ייצור ב-Node.js היא סיווג שגיאות חכם החלה על כל יישום Node.js:

### מימוש isCodeBug שלנו לייצור {#our-iscodebug-implementation-for-production}

**מקור:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

עזר זה מספק סיווג שגיאות חכם ליישומי Node.js בייצור כדי:

* **לתעדף באגים אמיתיים** על פני שגיאות משתמש
* **לשפר את תגובת התקלות שלנו** על ידי התמקדות בבעיות אמיתיות
* **להפחית עייפות התראות** משגיאות משתמש צפויות
* **להבין טוב יותר** בעיות יישום מול בעיות שנוצרו על ידי המשתמש

דפוס זה עובד לכל יישום Node.js - בין אם אתם בונים אתרי מסחר אלקטרוני, פלטפורמות SaaS, APIs, או מיקרו-שירותים.

### אינטגרציה עם הרישום שלנו בייצור {#integration-with-our-production-logging}

**אינטגרציית הרישום שלנו:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
היומן שלנו משתמש ב-`isCodeBug` כדי לקבוע רמות התראה וטשטוש שדות, ומוודא שנקבל התראות על בעיות אמיתיות תוך סינון רעש בסביבת הייצור שלנו ב-Node.js.

### תוכן קשור {#related-content-1}

למד עוד על דפוסי טיפול בשגיאות שלנו:

* [בניית מערכת תשלומים אמינה](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - דפוסי טיפול בשגיאות
* [הגנת פרטיות במייל](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - טיפול בשגיאות אבטחה


## איתור ביצועים מתקדם עם v8-profiler-next ו-cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

אנו משתמשים בכלי פרופיילינג מתקדמים לניתוח צילומי heap ולפתרון בעיות OOM (מחסור בזיכרון), צווארי בקבוק בביצועים ובעיות זיכרון ב-Node.js בסביבת הייצור שלנו. כלים אלו חיוניים לכל אפליקציית Node.js החווה דליפות זיכרון או בעיות ביצועים.

### גישת הפרופיילינג שלנו לסביבת ייצור Node.js {#our-profiling-approach-for-nodejs-production}

**כלים שאנו ממליצים עליהם:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - ליצירת צילומי heap ופרופילי CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - לניתוח פרופילי CPU וצילומי heap

> \[!TIP]
> אנו משתמשים ב-v8-profiler-next וב-cpupro יחד ליצירת תהליך איתור ביצועים מלא לאפליקציות Node.js שלנו. שילוב זה עוזר לנו לזהות דליפות זיכרון, צווארי בקבוק בביצועים ולמטב את קוד הייצור שלנו.

### כיצד אנו מיישמים ניתוח צילומי Heap {#how-we-implement-heap-snapshot-analysis}

**מימוש הניטור שלנו:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

ניטור הייצור שלנו כולל יצירת צילומי heap אוטומטית כאשר סף הזיכרון עולה על המותר. זה עוזר לנו לפתור בעיות OOM לפני שהן גורמות לקריסות באפליקציה.

**דפוסי מימוש מרכזיים:**

* **צילומים אוטומטיים** כאשר גודל ה-heap עולה על סף של 2GB
* **פרופיילינג מבוסס אותות** לניתוח לפי דרישה בייצור
* **מדיניות שמירה** לניהול אחסון הצילומים
* **אינטגרציה עם עבודות הניקוי שלנו** לתחזוקה אוטומטית

### תהליך איתור הביצועים {#performance-debugging-workflow}

**למד את המימוש בפועל שלנו:**

* [מימוש ניטור השרת](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - ניטור heap ויצירת צילומים
* [עבודת ניקוי](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - שמירת צילומים וניקוי
* [אינטגרציה עם היומן](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - רישום ביצועים

### מימוש מומלץ לאפליקציית Node.js שלך {#recommended-implementation-for-your-nodejs-application}

**לניתוח צילומי heap:**

1. **התקן את v8-profiler-next** ליצירת צילומים
2. **השתמש ב-cpupro** לניתוח הצילומים שנוצרו
3. **ממש ספי ניטור** בדומה ל-monitor-server.js שלנו
4. **הגדר ניקוי אוטומטי** לניהול אחסון הצילומים
5. **צור מטפלי אותות** לפרופיילינג לפי דרישה בייצור

**לפרופיילינג CPU:**

1. **צור פרופילי CPU** בתקופות עומס גבוה
2. **נתח עם cpupro** לזיהוי צווארי בקבוק
3. **התמקד בנתיבים חמים** והזדמנויות אופטימיזציה
4. **נטר לפני/אחרי** שיפורי ביצועים

> \[!WARNING]
> יצירת צילומי heap ופרופילי CPU עלולה להשפיע על הביצועים. אנו ממליצים לממש הגבלת תדירות ולהפעיל פרופיילינג רק בעת חקירת בעיות ספציפיות או במהלך חלונות תחזוקה.

### אינטגרציה עם ניטור הייצור שלנו {#integration-with-our-production-monitoring}

כלי הפרופיילינג שלנו משתלבים באסטרטגיית הניטור הרחבה שלנו:

* **הפעלה אוטומטית** בהתבסס על ספי זיכרון/CPU
* **אינטגרציה עם התראות** כאשר מתגלות בעיות ביצועים
* **ניתוח היסטורי** למעקב אחר מגמות ביצועים לאורך זמן
* **קורלציה עם מדדי האפליקציה** לאיתור תקלות מקיף
גישה זו סייעה לנו לזהות ולפתור דליפות זיכרון, לאופטימיזציה של מסלולי קוד חמים, ולשמור על ביצועים יציבים בסביבת הייצור שלנו ב-Node.js.


## אבטחת תשתית ייצור Node.js {#nodejs-production-infrastructure-security}

אנו מיישמים אבטחה מקיפה לתשתית הייצור של Node.js שלנו באמצעות אוטומציה של Ansible. שיטות אלו חלות על כל יישום Node.js:

### אבטחה ברמת המערכת לייצור Node.js {#system-level-security-for-nodejs-production}

**מימוש ה-Ansible שלנו:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

אמצעי האבטחה המרכזיים שלנו לסביבות ייצור Node.js:

* **השבתת swap** כדי למנוע כתיבה של נתונים רגישים לדיסק
* **השבתת core dumps** כדי למנוע דליפות זיכרון המכילות מידע רגיש
* **חסימת אחסון USB** כדי למנוע גישה לא מורשית לנתונים
* **כוונון פרמטרי kernel** הן לאבטחה והן לביצועים

> \[!WARNING]
> בעת יישום שיטות עבודה מומלצות לפריסת ייצור Node.js, השבתת swap עלולה לגרום להריגות מחוסר זיכרון אם היישום שלך חורג מזיכרון RAM זמין. אנו עוקבים בקפידה אחר שימוש הזיכרון ומגדירים את השרתים שלנו בהתאם.

### אבטחת יישומים ליישומי Node.js {#application-security-for-nodejs-applications}

**הסתרת שדות בלוג שלנו:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

אנו מסתירים שדות רגישים מהלוגים כולל סיסמאות, טוקנים, מפתחות API ומידע אישי. זה מגן על פרטיות המשתמש תוך שמירה על יכולות איתור באגים בכל סביבת ייצור Node.js.

### אוטומציה של אבטחת תשתית {#infrastructure-security-automation}

**הגדרת Ansible המלאה שלנו לייצור Node.js:**

* [ספריית אבטחה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [ניהול מפתחות SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [ניהול תעודות](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [הגדרת DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### תוכן האבטחה שלנו {#our-security-content}

למידע נוסף על גישת האבטחה שלנו:

* [חברות בדיקת אבטחה מובילות](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [דואר אלקטרוני מוצפן בטוח קוונטית](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [מדוע אבטחת דואר אלקטרוני בקוד פתוח](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## ארכיטקטורת מסדי נתונים ליישומי Node.js {#database-architecture-for-nodejs-applications}

אנו משתמשים בגישה היברידית למסדי נתונים המותאמת ליישומי Node.js שלנו. דפוסים אלו ניתנים להתאמה לכל יישום Node.js:

### מימוש SQLite לייצור Node.js {#sqlite-implementation-for-nodejs-production}

**מה שאנו משתמשים:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**הקונפיגורציה שלנו:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

אנו משתמשים ב-SQLite לנתונים ספציפיים למשתמש ביישומי Node.js שלנו מכיוון שהיא מספקת:

* **בידוד נתונים** לכל משתמש/שוכר
* **ביצועים טובים יותר** לשאילתות משתמש יחיד
* **גיבוי ומיגרציה פשוטים**
* **פחות מורכבות** בהשוואה למסדי נתונים משותפים

דפוס זה עובד היטב ליישומי SaaS, מערכות רב-שוכרות, או כל יישום Node.js שדורש בידוד נתונים.

### מימוש MongoDB לייצור Node.js {#mongodb-implementation-for-nodejs-production}

**מה שאנו משתמשים:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**היישום שלנו:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**הקונפיגורציה שלנו:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

אנו משתמשים ב-MongoDB עבור נתוני האפליקציה בסביבת הייצור של Node.js שלנו מכיוון שהיא מספקת:

* **סכימה גמישה** למבני נתונים מתפתחים
* **ביצועים טובים יותר** עבור שאילתות מורכבות
* **יכולת סקיילינג אופקי**
* **שפת שאילתות עשירה**

> \[!NOTE]
> הגישה ההיברידית שלנו מותאמת למקרה השימוש הספציפי שלנו. למדו את דפוסי השימוש האמיתיים במסד הנתונים בקוד כדי להבין אם גישה זו מתאימה לצרכי אפליקציית ה-Node.js שלכם.


## עיבוד עבודות רקע בסביבת ייצור Node.js {#nodejs-production-background-job-processing}

בנינו את ארכיטקטורת עבודות הרקע שלנו סביב Bree לפריסה אמינה של Node.js בסביבת ייצור. זה חל על כל אפליקציית Node.js שזקוקה לעיבוד רקע:

### הגדרת שרת Bree שלנו לייצור {#our-bree-server-setup-for-production}

**היישום הראשי שלנו:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**הפריסה שלנו באמצעות Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### דוגמאות לעבודות ייצור {#production-job-examples}

**ניטור בריאות:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**אוטומציה לניקוי:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**כל העבודות שלנו:** [עיינו בתיקיית העבודות המלאה שלנו](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

דפוסים אלה חלים על כל אפליקציית Node.js שזקוקה ל:

* משימות מתוזמנות (עיבוד נתונים, דוחות, ניקוי)
* עיבוד רקע (שינוי גודל תמונות, שליחת מיילים, ייבוא נתונים)
* ניטור ותחזוקה של בריאות המערכת
* שימוש ב-worker threads למשימות עתירות מעבד

### דפוסי תזמון העבודות שלנו לייצור Node.js {#our-job-scheduling-patterns-for-nodejs-production}

למדו את דפוסי תזמון העבודות האמיתיים בתיקיית העבודות שלנו כדי להבין:

* כיצד אנו מיישמים תזמון בסגנון cron בסביבת ייצור Node.js
* טיפול בשגיאות ולוגיקת ניסיון חוזר
* כיצד אנו משתמשים ב-worker threads למשימות עתירות מעבד


## תחזוקה אוטומטית לאפליקציות Node.js בסביבת ייצור {#automated-maintenance-for-production-nodejs-applications}

אנו מיישמים תחזוקה פרואקטיבית למניעת בעיות נפוצות בסביבת ייצור Node.js. דפוסים אלה חלים על כל אפליקציית Node.js:

### יישום הניקוי שלנו {#our-cleanup-implementation}

**מקור:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

התחזוקה האוטומטית שלנו לאפליקציות Node.js בסביבת ייצור מתמקדת ב:

* **קבצים זמניים** בני יותר מ-24 שעות
* **קבצי לוג** שמעבר למגבלות השמירה
* **קבצי מטמון** ונתונים זמניים
* **קבצים שהועלו** שאינם דרושים עוד
* **צילום מצב heap** לצורך איתור ביצועים

דפוסים אלה חלים על כל אפליקציית Node.js שיוצרת קבצים זמניים, לוגים או נתוני מטמון.

### ניהול שטח דיסק בסביבת ייצור Node.js {#disk-space-management-for-nodejs-production}

**ספי הניטור שלנו:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **מגבלות תורים** לעיבוד רקע
* **אזהרת שימוש בדיסק ב-75%**
* **ניקוי אוטומטי** כאשר הספים עוברים

### אוטומציה של תחזוקת תשתיות {#infrastructure-maintenance-automation}

**האוטומציה שלנו באמצעות Ansible לסביבת ייצור Node.js:**

* [פריסת סביבה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [ניהול מפתחות פריסה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## מדריך יישום לפריסת Node.js בסביבת ייצור {#nodejs-production-deployment-implementation-guide}
### למדו את הקוד האמיתי שלנו לפרקטיקות הטובות ביותר בפרודקשן {#study-our-actual-code-for-production-best-practices}

**התחילו עם הקבצים המרכזיים האלה להגדרת סביבת פרודקשן ב-Node.js:**

1. **קונפיגורציה:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **ניטור:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **טיפול בשגיאות:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **רישום לוגים:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **בריאות התהליך:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### למדו מפוסטים בבלוג שלנו {#learn-from-our-blog-posts}

**המדריכים הטכניים שלנו ליישום פרודקשן ב-Node.js:**

* [אקוסיסטם של חבילות NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [בניית מערכות תשלום](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [יישום פרטיות אימייל](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [טפסי יצירת קשר ב-JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [אינטגרציית אימייל ב-React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### אוטומציה של תשתיות לפרודקשן ב-Node.js {#infrastructure-automation-for-nodejs-production}

**ספריות ה-Ansible שלנו ללימוד לפריסת פרודקשן ב-Node.js:**

* [ספריית playbooks מלאה](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [הקשחת אבטחה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [הגדרת Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### מקרי מבחן שלנו {#our-case-studies}

**היישומים הארגוניים שלנו:**

* [מקרה מבחן Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [מקרה מבחן Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [העברת אימייל לבוגרים](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## סיכום: פרקטיקות הטובות ביותר לפריסת פרודקשן ב-Node.js {#conclusion-nodejs-production-deployment-best-practices}

תשתית הפרודקשן שלנו ב-Node.js מראה כי אפליקציות Node.js יכולות להשיג אמינות ברמת ארגון דרך:

* **בחירות חומרה מוכחות** (AMD Ryzen לאופטימיזציית ביצועים של 573% בליבה יחידה)
* **ניטור פרודקשן ב-Node.js שנבדק בשטח** עם ספים ספציפיים ותגובות אוטומטיות
* **סיווג שגיאות חכם** לשיפור תגובת התקלות בסביבות פרודקשן
* **ניפוי ביצועים מתקדם** עם v8-profiler-next ו-cpupro למניעת OOM
* **הקשחת אבטחה מקיפה** באמצעות אוטומציה ב-Ansible
* **ארכיטקטורת מסד נתונים היברידית** מותאמת לצרכי האפליקציה
* **תחזוקה אוטומטית** למניעת בעיות נפוצות בפרודקשן Node.js

**מסקנה מרכזית:** למדו את קבצי היישום האמיתיים שלנו ואת פוסטים בבלוג במקום לעקוב אחרי פרקטיקות כלליות. בסיס הקוד שלנו מספק דפוסים מהעולם האמיתי לפריסת פרודקשן ב-Node.js שניתן להתאים לכל אפליקציית Node.js - אפליקציות ווב, APIs, מיקרו-שירותים או שירותי רקע.


## רשימת משאבים מלאה לפרודקשן ב-Node.js {#complete-resource-list-for-nodejs-production}

### קבצי היישום המרכזיים שלנו {#our-core-implementation-files}

* [קונפיגורציה ראשית](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [תלויות חבילות](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [ניטור שרת](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [סיווג שגיאות](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [מערכת רישום לוגים](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [בדיקות בריאות PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [ניקוי אוטומטי](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### מימושי השרת שלנו {#our-server-implementations}

* [שרת ווב](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [שרת API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [מתזמן Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [שרת SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [שרת IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [שרת POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### אוטומציה של התשתית שלנו {#our-infrastructure-automation}

* [כל ה-Ansible playbooks שלנו](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [הקשחת אבטחה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [הגדרת Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [קונפיגורציית מסד נתונים](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### פוסטים טכניים בבלוג שלנו {#our-technical-blog-posts}

* [ניתוח אקוסיסטם NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [מימוש מערכת תשלומים](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [מדריך טכני לפרטיות אימייל](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [טפסי יצירת קשר ב-JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [אינטגרציית אימייל ב-React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [מדריך לפתרון עצמי מתארח](https://forwardemail.net/blog/docs/self-hosted-solution)

### מחקרי מקרה ארגוניים שלנו {#our-enterprise-case-studies}

* [מימוש Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [מחקר מקרה Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [ציות לממשל הפדרלי](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [מערכות אימייל לבוגרים](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
