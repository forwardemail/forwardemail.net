# כיצד לייעל את תשתית הייצור של Node.js: שיטות עבודה מומלצות {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## תוכן עניינים

* [הַקדָמָה](#foreword)
* [מהפכת אופטימיזציית הביצועים שלנו בליבת ליבה יחידה ב-573%](#our-573-single-core-performance-optimization-revolution)
  * [מדוע אופטימיזציית ביצועים של ליבה יחידה חשובה עבור Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [תוכן קשור](#related-content)
* [הגדרת סביבת הייצור של Node.js: מחסנית הטכנולוגיה שלנו](#nodejs-production-environment-setup-our-technology-stack)
  * [מנהל חבילות: pnpm ליעילות ייצור](#package-manager-pnpm-for-production-efficiency)
  * [מסגרת אינטרנט: Koa לייצור Node.js מודרני](#web-framework-koa-for-modern-nodejs-production)
  * [עיבוד עבודות רקע: Bree לאמינות ייצור](#background-job-processing-bree-for-production-reliability)
  * [טיפול בשגיאות: @hapi/boom לאמינות ייצור](#error-handling-hapiboom-for-production-reliability)
* [כיצד לנטר יישומי Node.js בסביבת ייצור](#how-to-monitor-nodejs-applications-in-production)
  * [ניטור ייצור Node.js ברמת המערכת](#system-level-nodejs-production-monitoring)
  * [ניטור ברמת האפליקציה עבור ייצור Node.js](#application-level-monitoring-for-nodejs-production)
  * [ניטור ספציפי ליישום](#application-specific-monitoring)
* [ניטור ייצור Node.js עם בדיקות תקינות PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [מערכת בדיקת הבריאות PM2 שלנו](#our-pm2-health-check-system)
  * [תצורת הייצור PM2 שלנו](#our-pm2-production-configuration)
  * [פריסה אוטומטית של PM2](#automated-pm2-deployment)
* [מערכת טיפול וסיווג של שגיאות ייצור](#production-error-handling-and-classification-system)
  * [יישום isCodeBug שלנו לייצור](#our-iscodebug-implementation-for-production)
  * [אינטגרציה עם רישום הייצור שלנו](#integration-with-our-production-logging)
  * [תוכן קשור](#related-content-1)
* [ניפוי שגיאות ביצועים מתקדם עם v8-profiler-next ו-cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [גישת הפרופילינג שלנו לייצור Node.js](#our-profiling-approach-for-nodejs-production)
  * [כיצד אנו מיישמים ניתוח תמונות מעגליות (Heap Snapshot Analysis)](#how-we-implement-heap-snapshot-analysis)
  * [תהליך עבודה של ניפוי שגיאות ביצועים](#performance-debugging-workflow)
  * [הטמעה מומלצת עבור יישום Node.js שלך](#recommended-implementation-for-your-nodejs-application)
  * [אינטגרציה עם ניטור הייצור שלנו](#integration-with-our-production-monitoring)
* [אבטחת תשתית ייצור של Node.js](#nodejs-production-infrastructure-security)
  * [אבטחה ברמת המערכת עבור ייצור Node.js](#system-level-security-for-nodejs-production)
  * [אבטחת יישומים עבור יישומי Node.js](#application-security-for-nodejs-applications)
  * [אוטומציה של אבטחת תשתיות](#infrastructure-security-automation)
  * [תוכן האבטחה שלנו](#our-security-content)
* [ארכיטקטורת מסד נתונים עבור יישומי Node.js](#database-architecture-for-nodejs-applications)
  * [יישום SQLite עבור ייצור Node.js](#sqlite-implementation-for-nodejs-production)
  * [יישום MongoDB עבור Node.js Production](#mongodb-implementation-for-nodejs-production)
* [עיבוד משימות רקע של ייצור Node.js](#nodejs-production-background-job-processing)
  * [הגדרת שרת Bree שלנו לייצור](#our-bree-server-setup-for-production)
  * [דוגמאות לעבודות ייצור](#production-job-examples)
  * [דפוסי תזמון העבודה שלנו עבור ייצור Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [תחזוקה אוטומטית עבור יישומי Node.js לייצור](#automated-maintenance-for-production-nodejs-applications)
  * [יישום הניקיון שלנו](#our-cleanup-implementation)
  * [ניהול שטח דיסק עבור הפקת Node.js](#disk-space-management-for-nodejs-production)
  * [אוטומציה של תחזוקת תשתיות](#infrastructure-maintenance-automation)
* [מדריך יישום לפריסת Node.js Production](#nodejs-production-deployment-implementation-guide)
  * [למדו את הקוד בפועל שלנו לקבלת שיטות עבודה מומלצות לייצור](#study-our-actual-code-for-production-best-practices)
  * [למד מפוסטים בבלוג שלנו](#learn-from-our-blog-posts)
  * [אוטומציה של תשתיות עבור ייצור Node.js](#infrastructure-automation-for-nodejs-production)
  * [מקרי המחקר שלנו](#our-case-studies)
* [סיכום: שיטות עבודה מומלצות לפריסת Node.js Production](#conclusion-nodejs-production-deployment-best-practices)
* [רשימת משאבים מלאה עבור הפקת Node.js](#complete-resource-list-for-nodejs-production)
  * [קבצי היישום המרכזיים שלנו](#our-core-implementation-files)
  * [הטמעות השרתים שלנו](#our-server-implementations)
  * [אוטומציה של התשתיות שלנו](#our-infrastructure-automation)
  * [פוסטים טכניים בבלוג שלנו](#our-technical-blog-posts)
  * [מקרי בוחן ארגוניים שלנו](#our-enterprise-case-studies)

## הקדמה {#foreword}

ב-Forward Email, בילינו שנים בשכלול סביבת הייצור של Node.js שלנו. מדריך מקיף זה משתף את שיטות העבודה המומלצות שלנו לפריסת ייצור של Node.js, אשר הוכחו היטב, תוך התמקדות באופטימיזציה של ביצועים, ניטור והלקחים שלמדנו מהגדלת יישומי Node.js לטיפול במיליוני עסקאות יומיות.

## מהפכת אופטימיזציית הביצועים שלנו ב-573% של ליבה יחידה {#our-573-single-core-performance-optimization-revolution}

כאשר עברנו ממעבדי אינטל למעבדי AMD Ryzen, השגנו **שיפור ביצועים של 573%** ביישומי Node.js שלנו. זו לא הייתה רק אופטימיזציה קלה - היא שינתה באופן מהותי את אופן ביצועי יישומי Node.js שלנו בייצור ומדגימה את החשיבות של אופטימיזציה של ביצועי ליבה יחידה עבור כל יישום Node.js.

> \[!TIP]
> עבור שיטות עבודה מומלצות לפריסת Node.js, בחירת החומרה היא קריטית. בחרנו במיוחד באירוח DataPacket בשל זמינותם של מעבדי AMD Ryzen, מכיוון שביצועי ליבה יחידה הם קריטיים עבור יישומי Node.js, מכיוון שריצת JavaScript היא בעלת הליך הליך יחיד.

### מדוע אופטימיזציה של ביצועי ליבה יחידה חשובה עבור Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

המעבר שלנו מאינטל ל-AMD Ryzen הביא ל:

* **שיפור ביצועים של 573%** בעיבוד בקשות (מתועד ב-[בעיית GitHub בדף הסטטוס שלנו #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **ביטול עיכובי עיבוד** לתגובות כמעט מיידיות (הוזכר ב[בעיית GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **יחס מחיר-ביצועים טוב יותר** עבור סביבות ייצור של Node.js
* **זמני תגובה משופרים** בכל נקודות הקצה של היישומים שלנו

שיפור הביצועים היה כה משמעותי שאנו רואים כעת מעבדי AMD Ryzen חיוניים לכל פריסת ייצור רצינית של Node.js, בין אם אתם מפעילים יישומי אינטרנט, ממשקי API, מיקרו-שירותים או כל עומס עבודה אחר של Node.js.

### תוכן קשור {#related-content}

לפרטים נוספים על בחירות התשתית שלנו, עיינו ב:

* [שירות העברת הדוא"ל הטוב ביותר]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - השוואות ביצועים
* [פתרון אירוח עצמי](https://forwardemail.net/blog/docs/self-hosted-solution) - המלצות חומרה

## הגדרת סביבת ייצור Node.js: מחסנית הטכנולוגיה שלנו {#nodejs-production-environment-setup-our-technology-stack}

שיטות העבודה המומלצות שלנו לפריסת Node.js כוללות בחירות טכנולוגיות מכוונות המבוססות על שנים של ניסיון בייצור. הנה מה שאנו משתמשים בו ומדוע בחירות אלו חלות על כל יישום Node.js:

מנהל חבילות ###: pnpm ליעילות ייצור {#package-manager-pnpm-for-production-efficiency}

**מה אנחנו משתמשים בו:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (גרסה מוצמדת)

בחרנו ב-pnpm על פני npm ו-yarn עבור סביבת הייצור של Node.js שלנו מכיוון ש:

* **זמני התקנה מהירים יותר** בצינורות CI/CD
* **יעילות שטח דיסק** באמצעות קישור קשיח
* **פתרון תלויות קפדני** המונע תלות רפאים
* **ביצועים טובים יותר** בפריסות ייצור

> \[!NOTE]
> כחלק משיטות העבודה המומלצות שלנו לפריסת Node.js, אנו מצמידים גרסאות מדויקות של כלים קריטיים כמו pnpm כדי להבטיח התנהגות עקבית בכל הסביבות ובכל המכונות של חברי הצוות.

**פרטי יישום:**

* [תצורת package.json שלנו](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [פוסט בבלוג של מערכת האקולוגיה של NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### מסגרת אינטרנט: Koa עבור ייצור Node.js מודרני {#web-framework-koa-for-modern-nodejs-production}

**מה אנחנו משתמשים בו:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

בחרנו ב-Koa על פני Express עבור תשתית הייצור של Node.js שלנו בגלל התמיכה המודרנית ב-async/await והרכב התוכנה הנקי יותר. המייסד שלנו, ניק בו, תרם גם ל-Express וגם ל-Koa, ונתן לנו תובנות מעמיקות לגבי שתי המסגרות לשימוש בייצור.

דפוסים אלה חלים בין אם אתם בונים ממשקי API של REST, שרתי GraphQL, יישומי אינטרנט או מיקרו-שירותים.

**דוגמאות היישום שלנו:**

* [הגדרת שרת אינטרנט](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [תצורת שרת API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [מדריך הטמעת טפסי יצירת קשר](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### עיבוד משימות ברקע: Bree לאמינות ייצור {#background-job-processing-bree-for-production-reliability}

**מה אנחנו משתמשים בו:** מתזמן [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

יצרנו ומתחזקים את Bree מכיוון שמתזמני משימות קיימים לא עמדו בדרישות שלנו לתמיכה ב-worker threads ותכונות JavaScript מודרניות בסביבות Node.js ייצור. זה חל על כל יישום Node.js שזקוק לעיבוד ברקע, משימות מתוזמנות או worker threads.

**דוגמאות היישום שלנו:**

* [הגדרת שרת ברי](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [כל הגדרות התפקיד שלנו](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [עבודת בדיקת בריאות PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [יישום משימת ניקוי](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### טיפול בשגיאות: @hapi/boom עבור אמינות ייצור {#error-handling-hapiboom-for-production-reliability}

**מה אנחנו משתמשים בו:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

אנו משתמשים ב-@hapi/boom עבור תגובות שגיאה מובנות בכל יישומי הייצור של Node.js. תבנית זו עובדת עבור כל יישום Node.js הדורש טיפול עקבי בשגיאות.

**דוגמאות היישום שלנו:**

* [עוזר סיווג שגיאות](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [יישום לוגר](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## כיצד לנטר יישומי Node.js בסביבת ייצור {#how-to-monitor-nodejs-applications-in-production}

הגישה שלנו לניטור יישומי Node.js בסביבת ייצור התפתחה לאורך שנים של הרצת יישומים בקנה מידה גדול. אנו מיישמים ניטור בשכבות מרובות כדי להבטיח אמינות וביצועים עבור כל סוג של אפליקציית Node.js.

### ניטור ייצור של Node.js ברמת המערכת {#system-level-nodejs-production-monitoring}

**היישום המרכזי שלנו:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**מה אנחנו משתמשים בו:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

ספי ניטור הייצור שלנו (מקוד הייצור בפועל שלנו):

* **מגבלת גודל ערימה של 2GB** עם התראות אוטומטיות
* **סף אזהרה של 25% ניצול זיכרון**
* **סף אזהרה של 80% ניצול CPU**
* **סף אזהרה של 75% ניצול דיסק**

> \[!WARNING]
> ערכי ספים אלה מתאימים לתצורת החומרה הספציפית שלנו. בעת יישום ניטור הייצור של Node.js, סקור את יישום monitor-server.js שלנו כדי להבין את הלוגיקה המדויקת ולהתאים את הערכים להגדרה שלך.

### ניטור ברמת היישום עבור ייצור Node.js {#application-level-monitoring-for-nodejs-production}

**סיווג השגיאות שלנו:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

עוזר זה מבחין בין:

* **באגים בקוד** הדורשים טיפול מיידי
* **שגיאות משתמש** שהן התנהגות צפויה
* **כשלים בשירות חיצוני** שאין לנו שליטה עליהם

דפוס זה חל על כל יישום Node.js - אפליקציות אינטרנט, ממשקי API, מיקרו-שירותים או שירותי רקע.

**מימוש הרישום שלנו:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

אנו מיישמים הסרת שדות מקיפה כדי להגן על מידע רגיש תוך שמירה על יכולות ניפוי שגיאות שימושיות בסביבת הייצור של Node.js.

### ניטור ספציפי ליישום {#application-specific-monitoring}

**מימושים של השרת שלנו:**

* [שרת SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [שרת IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [שרת POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**ניטור תורים:** אנו מיישמים מגבלות תור של 5GB ופסק זמן של 180 שניות לעיבוד בקשות כדי למנוע התרוקנות משאבים. דפוסים אלה חלים על כל יישום Node.js עם תורים או עיבוד ברקע.

## ניטור ייצור של Node.js עם בדיקות תקינות PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

שיכללנו את סביבת הייצור של Node.js עם PM2 במשך שנים של ניסיון בייצור. בדיקות התקינות של PM2 שלנו חיוניות לשמירה על אמינות בכל יישום Node.js.

### מערכת בדיקת תקינות PM2 שלנו {#our-pm2-health-check-system}

**היישום המרכזי שלנו:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

ניטור הייצור שלנו של Node.js עם בדיקות תקינות PM2 כולל:

* **פועל כל 20 דקות** באמצעות תזמון cron
* **דורש מינימום של 15 דקות זמן פעולה** לפני שייחשב תהליך תקין
* **מאמת את סטטוס התהליך ואת השימוש בזיכרון**
* **מפעיל מחדש אוטומטית תהליכים שנכשלו**
* **מונע לולאות הפעלה מחדש** באמצעות בדיקת תקינות חכמה

> \[!CAUTION]
> עבור שיטות עבודה מומלצות לפריסת Node.js, אנו דורשים זמן פעולה של 15+ דקות לפני שאנו קובעים שתהליך תקין, כדי למנוע לולאות הפעלה מחדש. זה מונע כשלים מדורגים כאשר תהליכים מתקשים בזיכרון או בבעיות אחרות.

### תצורת הייצור של PM2 שלנו {#our-pm2-production-configuration}

**הגדרת המערכת האקולוגית שלנו:** למד את קבצי ההפעלה של השרת שלנו עבור הגדרת סביבת הייצור של Node.js:

* [שרת אינטרנט](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [שרת API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [מתזמן ברי](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [שרת SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

דפוסים אלה חלים בין אם אתם מפעילים אפליקציות Express, שרתי Koa, ממשקי API של GraphQL או כל אפליקציית Node.js אחרת.

### פריסה אוטומטית של PM2 {#automated-pm2-deployment}

**פריסת PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

אנו הופכים את כל הגדרת ה-PM2 שלנו לאוטומטית באמצעות Ansible כדי להבטיח פריסות ייצור עקביות של Node.js בכל השרתים שלנו.

## מערכת טיפול וסיווג שגיאות ייצור {#production-error-handling-and-classification-system}

אחת משיטות העבודה המומלצות החשובות ביותר שלנו לפריסת Node.js היא סיווג שגיאות חכם שחל על כל יישום Node.js:

### יישום isCodeBug שלנו עבור ייצור {#our-iscodebug-implementation-for-production}

**מקור:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

עוזר זה מספק סיווג שגיאות חכם עבור יישומי Node.js בסביבת ייצור כדי:

* **לתעדף באגים אמיתיים** על פני שגיאות משתמש**
* **לשפר את תגובת האירועים שלנו** על ידי התמקדות בבעיות אמיתיות**
* **להפחית עייפות התראות** משגיאות משתמש צפויות**
* **להבין טוב יותר** בעיות באפליקציה לעומת בעיות שנוצרו על ידי המשתמש**

תבנית זו עובדת עבור כל אפליקציית Node.js - בין אם אתם בונים אתרי מסחר אלקטרוני, פלטפורמות SaaS, ממשקי API או מיקרו-שירותים.

### שילוב עם רישום הייצור שלנו {#integration-with-our-production-logging}

**שילוב הלוגים שלנו:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

הלוגם שלנו משתמש ב-`isCodeBug` כדי לקבוע רמות התראה והסרת שדות, מה שמבטיח שנקבל הודעות על בעיות אמיתיות תוך סינון רעשים בסביבת הייצור של Node.js.

### תוכן קשור

למידע נוסף על דפוסי טיפול בשגיאות שלנו:

* [בניית מערכת תשלומים אמינה](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - דפוסי טיפול בשגיאות
* [הגנת פרטיות בדוא"ל](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - טיפול בשגיאות אבטחה

## ניפוי שגיאות ביצועים מתקדם עם v8-profiler-next ו-cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

אנו משתמשים בכלי פרופילציה מתקדמים כדי לנתח תמונות של heap ולנפות באגים בבעיות OOM (Out of Memory), צווארי בקבוק בביצועים ובעיות זיכרון של Node.js בסביבת הייצור שלנו. כלים אלה חיוניים לכל יישום Node.js שחווה דליפות זיכרון או בעיות ביצועים.

### גישת הפרופילינג שלנו עבור ייצור Node.js {#our-profiling-approach-for-nodejs-production}

**כלים שאנו ממליצים עליהם:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - ליצירת תמונות מצב של ערימה ופרופילי CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - לניתוח פרופילי CPU ותמונות מצב של ערימה

> \[!TIP]
> אנו משתמשים ב-v8-profiler-next וב-cpupro יחד כדי ליצור תהליך עבודה מלא של ניפוי ביצועים עבור יישומי Node.js שלנו. שילוב זה עוזר לנו לזהות דליפות זיכרון, צווארי בקבוק בביצועים ולמטב את קוד הייצור שלנו.

### כיצד אנו מיישמים ניתוח תמונת מצב של Heap {#how-we-implement-heap-snapshot-analysis}

**יישום הניטור שלנו:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

ניטור הייצור שלנו כולל יצירת תמונות אוטומטיות של heap כאשר חורגים מספי הזיכרון. זה עוזר לנו לאתר באגים בבעיות OOM לפני שהן גורמות לקריסות יישומים.

**דפוסי יישום עיקריים:**

* **תמונות מצב אוטומטיות** כאשר גודל הערימה עולה על סף 2GB
* **פרופיל מבוסס אותות** לניתוח לפי דרישה בייצור
* **מדיניות שמירה** לניהול אחסון תמונות מצב
* **שילוב עם עבודות הניקוי שלנו** לתחזוקה אוטומטית

### זרימת עבודה של ניפוי שגיאות ביצועים {#performance-debugging-workflow}

**למדו את היישום בפועל שלנו:**

* [ניטור יישום שרת](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - ניטור ערימה ויצירת תמונות בזק
* [עבודת ניקיון](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - שמירת וניקוי תמונות בזק
* [שילוב לוגר](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - רישום ביצועים

### יישום מומלץ עבור יישום Node.js שלך {#recommended-implementation-for-your-nodejs-application}

**לניתוח תמונת מצב של ערימה:**

1. **התקנת v8-profiler-next** ליצירת תמונות מצב
2. **שימוש ב-cpupro** לניתוח תמונות המצב שנוצרו
3. **יישום ספי ניטור** בדומה ל-monitor-server.js שלנו
4. **הגדרת ניקוי אוטומטי** לניהול אחסון תמונות מצב
5. **יצירת מטפלי אותות** ליצירת פרופילים לפי דרישה בייצור

**ליצירת פרופיל מעבד:**

1. **יצירת פרופילי CPU** במהלך תקופות עומס גבוה
2. **ניתוח עם CPUPro** כדי לזהות צווארי בקבוק
3. **התמקדות בנתיבים חמים** והזדמנויות אופטימיזציה
4. **ניטור שיפורי ביצועים לפני/אחרי**

> \[!WARNING]
> יצירת תמונות מצב של ערימה ופרופילי CPU יכולה להשפיע על הביצועים. אנו ממליצים ליישם ויסות ולהפעיל פרופילים רק בעת חקירת בעיות ספציפיות או במהלך חלונות תחזוקה.

### שילוב עם ניטור הייצור שלנו {#integration-with-our-production-monitoring}

כלי הפרופילציה שלנו משתלבים עם אסטרטגיית הניטור הרחבה יותר שלנו:

* **הפעלה אוטומטית** המבוססת על ספי זיכרון/מעבד
* **שילוב התראות** כאשר מתגלות בעיות ביצועים
* **ניתוח היסטורי** למעקב אחר מגמות ביצועים לאורך זמן
* **קורלציה עם מדדי יישומים** לאיתור ניפוי מקיף

גישה זו עזרה לנו לזהות ולפתור דליפות זיכרון, לייעל נתיבי קוד חם ולשמור על ביצועים יציבים בסביבת הייצור Node.js שלנו.

## אבטחת תשתית ייצור Node.js {#nodejs-production-infrastructure-security}

אנו מיישמים אבטחה מקיפה עבור תשתית הייצור של Node.js באמצעות אוטומציה של Ansible. נהלים אלה חלים על כל אפליקציית Node.js:

### אבטחה ברמת המערכת עבור ייצור Node.js {#system-level-security-for-nodejs-production}

**הטמעה שלנו ב-Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

אמצעי האבטחה העיקריים שלנו עבור סביבות ייצור של Node.js:

* **החלפה מושבתת** כדי למנוע כתיבת נתונים רגישים לדיסק
* **מאגרים של ליבות מושבתים** כדי למנוע מאגרים של זיכרון המכילים מידע רגיש
* **אחסון USB חסום** כדי למנוע גישה לא מורשית לנתונים
* **כוונון פרמטרי ליבה** הן לאבטחה והן לביצועים

> \[!WARNING]
> בעת יישום שיטות עבודה מומלצות לפריסת Node.js, השבתת swap עלולה לגרום לכיבוי עקב חוסר זיכרון אם היישום שלך חורג מכמות ה-RAM הזמין. אנו עוקבים בקפידה אחר ניצול הזיכרון ומגדילים את השרתים שלנו בהתאם.

### אבטחת יישומים עבור יישומי Node.js {#application-security-for-nodejs-applications}

**הסרה של שדה היומן שלנו:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

אנו מסירים שדות רגישים מיומני רישום, כולל סיסמאות, טוקנים, מפתחות API ומידע אישי. פעולה זו מגנה על פרטיות המשתמש תוך שמירה על יכולות ניפוי שגיאות בכל סביבת ייצור של Node.js.

### אוטומציה של אבטחת תשתית {#infrastructure-security-automation}

**המערכת המלאה שלנו של Ansible לייצור Node.js:**

* [מדריך אבטחה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [ניהול מפתחות SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [ניהול תעודות](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [הגדרת DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### תוכן האבטחה שלנו {#our-security-content}

למידע נוסף על גישת האבטחה שלנו:

* [חברות ביקורת האבטחה הטובות ביותר](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [דוא"ל מוצפן של קוונטום בטוח](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [למה אבטחת דוא"ל בקוד פתוח](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## ארכיטקטורת מסד נתונים עבור יישומי Node.js {#database-architecture-for-nodejs-applications}

אנו משתמשים בגישת מסד נתונים היברידית המותאמת ליישומי Node.js שלנו. ניתן להתאים את התבניות הללו לכל יישום Node.js:

### יישום SQLite עבור ייצור Node.js {#sqlite-implementation-for-nodejs-production}

**מה אנחנו משתמשים בו:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**התצורה שלנו:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

אנו משתמשים ב-SQLite עבור נתונים ספציפיים למשתמש ביישומי Node.js שלנו מכיוון שהוא מספק:

* **בידוד נתונים** לכל משתמש/דייר
* **ביצועים טובים יותר** עבור שאילתות של משתמש יחיד
* **גיבוי והעברה פשוטים**
* **מורכבות מופחתת** בהשוואה למסדי נתונים משותפים

תבנית זו עובדת היטב עבור יישומי SaaS, מערכות מרובות דיירים, או כל יישום Node.js הזקוק לבידוד נתונים.

### יישום MongoDB עבור ייצור Node.js {#mongodb-implementation-for-nodejs-production}

**מה אנחנו משתמשים בו:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**הטמעת ההתקנה שלנו:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**התצורה שלנו:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

אנו משתמשים ב-MongoDB עבור נתוני יישומים בסביבת הייצור Node.js שלנו מכיוון שהוא מספק:

* **סכימה גמישה** למבני נתונים מתפתחים
* **ביצועים טובים יותר** עבור שאילתות מורכבות
* **יכולות קנה מידה אופקי**
* **שפת שאילתות עשירה**

> \[!NOTE]
> הגישה ההיברידית שלנו מתאימה את עצמה למקרה השימוש הספציפי שלנו. למד את דפוסי השימוש בפועל של מסד הנתונים שלנו בבסיס הקוד כדי להבין אם גישה זו מתאימה לצורכי יישום Node.js שלך.

## עיבוד משימת רקע של ייצור Node.js {#nodejs-production-background-job-processing}

בנינו את ארכיטקטורת משימות הרקע שלנו סביב Bree לפריסת ייצור אמינה של Node.js. זה חל על כל אפליקציית Node.js שזקוקה לעיבוד ברקע:

### הגדרת שרת Bree שלנו לייצור {#our-bree-server-setup-for-production}

**היישום העיקרי שלנו:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**פריסת Ansible שלנו:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### דוגמאות לעבודות ייצור {#production-job-examples}

**ניטור בריאות:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**אוטומציה של ניקוי:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**כל המשרות שלנו:** [עיין במדריך המשרות המלא שלנו](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

תבניות אלו חלות על כל אפליקציית Node.js שצריכה:

* משימות מתוזמנות (עיבוד נתונים, דוחות, ניקוי)
* עיבוד רקע (שינוי גודל תמונה, שליחת דוא"ל, ייבוא נתונים)
* ניטור ותחזוקת תקינות
* ניצול של Worker Thread עבור משימות עתירות CPU

### דפוסי תזמון המשימות שלנו עבור ייצור Node.js {#our-job-scheduling-patterns-for-nodejs-production}

למדו את דפוסי תזמון העבודה בפועל שלנו במדריך המשרות שלנו כדי להבין:

* כיצד אנו מיישמים תזמון דמוי cron בייצור Node.js
* טיפול בשגיאות ולוגיקת ניסיון חוזר
* כיצד אנו משתמשים ב-worker threads עבור משימות עתירות CPU

## תחזוקה אוטומטית עבור יישומי Node.js ייצור {#automated-maintenance-for-production-nodejs-applications}

אנו מיישמים תחזוקה פרואקטיבית כדי למנוע בעיות ייצור נפוצות של Node.js. דפוסים אלה חלים על כל יישום Node.js:

### יישום הניקוי שלנו {#our-cleanup-implementation}

**מקור:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

התחזוקה האוטומטית שלנו עבור יישומי ייצור של Node.js מתמקדת ב:

* **קבצים זמניים** ישנים יותר מ-24 שעות
* **קבצי יומן** מעבר למגבלות השמירה
* **קבצי מטמון** ונתונים זמניים
* **קבצים שהועלו** שאינם נחוצים עוד
* **תמונות מצב של ערימה** מניפוי באגים בביצועים

דפוסים אלה חלים על כל יישום Node.js שמייצר קבצים זמניים, יומני רישום או נתונים המאוחסנים במטמון.

### ניהול שטח דיסק עבור Node.js Production {#disk-space-management-for-nodejs-production}

**ספי הניטור שלנו:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **מגבלות תור** לעיבוד ברקע
* סף אזהרה של **ניצול דיסק של 75%**
* ניקוי אוטומטי** כאשר חורגים מספי האחסון

### אוטומציה של תחזוקת תשתיות {#infrastructure-maintenance-automation}

**אוטומציה של Ansible שלנו לייצור Node.js:**

* [פריסת סביבה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [ניהול מפתחות פריסה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## מדריך יישום לפריסת Node.js Production {#nodejs-production-deployment-implementation-guide}

### למד את הקוד בפועל שלנו עבור שיטות עבודה מומלצות לייצור {#study-our-actual-code-for-production-best-practices}

**התחל עם קבצי המפתח הבאים עבור הגדרת סביבת הייצור של Node.js:**

1. **תצורה:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **ניטור:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **טיפול בשגיאות:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **רישום:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **תקינות התהליך:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### למד מפוסטים בבלוג שלנו {#learn-from-our-blog-posts}

**מדריכי היישום הטכניים שלנו לייצור Node.js:**

* [אקוסיסטם של חבילות NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [בניית מערכות תשלום](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [יישום פרטיות דוא"ל](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [טפסי יצירת קשר ב-JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [אינטגרציה של ריאקט אימייל](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### אוטומציה של תשתית עבור ייצור Node.js {#infrastructure-automation-for-nodejs-production}

**ספרי ההדרכה שלנו ב-Ansible ללימוד עבור פריסת Node.js בייצור:**

* [מדריך ספרי משחק מלא](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [הקשחת אבטחה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [הגדרת Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### מקרי המחקר שלנו {#our-case-studies}

**הטמעות הארגוניות שלנו:**

* [מקרה בוחן של לינוקס קרן](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [מקרה בוחן של אובונטו קנונית](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [העברת דוא"ל של בוגרים](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## סיכום: שיטות עבודה מומלצות לפריסת Node.js בייצור {#conclusion-nodejs-production-deployment-best-practices}

תשתית הייצור Node.js שלנו מדגימה שיישומי Node.js יכולים להשיג אמינות ברמה ארגונית באמצעות:

* **בחירות חומרה מוכחות** (AMD Ryzen לאופטימיזציה של 573% של ביצועי ליבה יחידה)
* **ניטור ייצור Node.js שנבדק בקרב** עם ספים ספציפיים ותגובות אוטומטיות
* **סיווג שגיאות חכם** לשיפור תגובת אירועים בסביבות ייצור
* **ניפוי שגיאות ביצועים מתקדם** עם v8-profiler-next ו-cpupro למניעת OOM
* **הקשחת אבטחה מקיפה** באמצעות אוטומציה של Ansible
* **ארכיטקטורת מסד נתונים היברידית** מותאמת לצורכי האפליקציה
* **תחזוקה אוטומטית** למניעת בעיות ייצור נפוצות של Node.js

**נקודה חשובה:** יש ללמוד את קבצי ההטמעה ופוסטים בבלוג שלנו במקום לפעול לפי שיטות עבודה מומלצות כלליות. בסיס הקוד שלנו מספק דפוסים אמיתיים לפריסת Node.js בייצור שניתן להתאים לכל יישום Node.js - אפליקציות אינטרנט, ממשקי API, מיקרו-שירותים או שירותי רקע.

## רשימת משאבים מלאה עבור ייצור Node.js {#complete-resource-list-for-nodejs-production}

### קבצי היישום המרכזיים שלנו {#our-core-implementation-files}

* [תצורה ראשית](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [תלויות חבילה](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [ניטור שרתים](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [סיווג שגיאות](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [מערכת רישום](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [בדיקות בריאות PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [ניקוי אוטומטי](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### הטמעות השרת שלנו {#our-server-implementations}

* [שרת אינטרנט](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [שרת API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [מתזמן ברי](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [שרת SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [שרת IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [שרת POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### אוטומציה של התשתית שלנו {#our-infrastructure-automation}

* [כל ספרי ההדרכה של Ansible שלנו](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [הקשחת אבטחה](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [הגדרת Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [תצורת מסד הנתונים](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### פוסטים טכניים בבלוג שלנו {#our-technical-blog-posts}

* [ניתוח מערכות אקולוגיות של NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [הטמעת מערכת תשלומים](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [מדריך טכני לפרטיות בדוא"ל](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [טפסי יצירת קשר ב-JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [אינטגרציה של ריאקט אימייל](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [מדריך פתרונות לאירוח עצמי](https://forwardemail.net/blog/docs/self-hosted-solution)

### מקרי בוחן ארגוניים שלנו {#our-enterprise-case-studies}

* [יישום לינוקס יסוד](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [מקרה בוחן של אובונטו קנונית](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [ציות לממשל הפדרלי](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [מערכות דוא"ל לבוגרים](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)