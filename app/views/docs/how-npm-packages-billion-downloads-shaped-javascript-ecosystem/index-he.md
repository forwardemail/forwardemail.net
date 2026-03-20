# עשור של השפעה: איך חבילות ה-npm שלנו הגיעו למיליארד הורדות ועיצבו את JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## תוכן העניינים {#table-of-contents}

* [הקדמה](#foreword)
* [החלוצים שבוטחים בנו: יצחק ז. שלוטר ו-Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [מיצירת npm להובלת Node.js](#from-npms-creation-to-nodejs-leadership)
* [הארכיטקט מאחורי הקוד: המסע של ניק באו](#the-architect-behind-the-code-nick-baughs-journey)
  * [הוועדה הטכנית של Express ותרומות ליבה](#express-technical-committee-and-core-contributions)
  * [תרומות למסגרת Koa](#koa-framework-contributions)
  * [ממפתח יחיד למנהיג ארגון](#from-individual-contributor-to-organization-leader)
* [ארגוני GitHub שלנו: אקוסיסטמות של חדשנות](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: רישום מובנה לאפליקציות מודרניות](#cabin-structured-logging-for-modern-applications)
  * [סריקת ספאם: מלחמה בהתעללות בדוא"ל](#spam-scanner-fighting-email-abuse)
  * [Bree: תזמון עבודות מודרני עם Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: תשתית דוא"ל בקוד פתוח](#forward-email-open-source-email-infrastructure)
  * [Lad: כלי עזר חיוניים ל-Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: ניטור זמינות בקוד פתוח](#upptime-open-source-uptime-monitoring)
* [התרומות שלנו לאקוסיסטם של Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [מחבילות לייצור](#from-packages-to-production)
  * [לולאת המשוב](#the-feedback-loop)
* [עקרונות הליבה של Forward Email: יסוד למצוינות](#forward-emails-core-principles-a-foundation-for-excellence)
  * [תמיד ידידותי למפתח, ממוקד אבטחה ושקוף](#always-developer-friendly-security-focused-and-transparent)
  * [הקפדה על עקרונות פיתוח תוכנה שנבדקו בזמן](#adherence-to-time-tested-software-development-principles)
  * [ממוקד במפתח עצמאי ונחוש](#targeting-the-scrappy-bootstrapped-developer)
  * [עקרונות בפועל: בסיס הקוד של Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [פרטיות כברירת מחדל](#privacy-by-design)
  * [קוד פתוח בר קיימא](#sustainable-open-source)
* [המספרים לא משקרים: סטטיסטיקות ההורדות המדהימות שלנו ב-npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [מבט על ההשפעה שלנו](#a-birds-eye-view-of-our-impact)
  * [השפעה יומית בקנה מידה](#daily-impact-at-scale)
  * [מעבר למספרים הגולמיים](#beyond-the-raw-numbers)
* [תמיכה באקוסיסטם: חסויות הקוד הפתוח שלנו](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [אנדריס ריינמן: חלוץ תשתיות דוא"ל](#andris-reinman-email-infrastructure-pioneer)
  * [סינדרה סורהוס: מוחות מאחורי חבילות עזר](#sindre-sorhus-utility-package-mastermind)
* [חשיפת פרצות אבטחה באקוסיסטם של JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [ההצלה של Koa-Router](#the-koa-router-rescue)
  * [טיפול בפרצות ReDoS](#addressing-redos-vulnerabilities)
  * [קידום אבטחת Node.js ו-Chromium](#advocating-for-nodejs-and-chromium-security)
  * [אבטחת תשתית npm](#securing-npm-infrastructure)
* [התרומות שלנו לאקוסיסטם של Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [שיפור הפונקציונליות של Nodemailer](#enhancing-nodemailers-core-functionality)
  * [קידום אימות דוא"ל עם Mailauth](#advancing-email-authentication-with-mailauth)
  * [שיפורים מרכזיים ב-Upptime](#key-upptime-enhancements)
* [הדבק שמחזיק את הכל ביחד: קוד מותאם בקנה מידה](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [מאמץ פיתוח עצום](#a-massive-development-effort)
  * [אינטגרציה של תלות ליבה](#core-dependencies-integration)
  * [תשתית DNS עם Tangerine ו-mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [השפעה ארגונית: מקוד פתוח לפתרונות קריטיים למשימה](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [מקרי מבחן בתשתיות דוא"ל קריטיות למשימה](#case-studies-in-mission-critical-email-infrastructure)
* [עשור של קוד פתוח: מבט לעתיד](#a-decade-of-open-source-looking-forward)
## הקדמה {#foreword}

בעולם ה-[JavaScript](https://en.wikipedia.org/wiki/JavaScript) וה-[Node.js](https://en.wikipedia.org/wiki/Node.js), יש חבילות חיוניות — שמורדות מיליוני פעמים ביום ומפעילות אפליקציות ברחבי העולם. מאחורי הכלים האלה עומדים מפתחים המתמקדים באיכות קוד פתוח. היום, אנו מראים כיצד הצוות שלנו מסייע בבניית ותחזוקת חבילות npm שהפכו לחלקים מרכזיים באקוסיסטם של JavaScript.

## החלוצים שבוטחים בנו: יצחק ז. שלוטר ו-Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

אנו גאים שיש לנו את [יצחק ז. שלוטר](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) כמשתמש. יצחק יצר את [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) וסייע בבניית [Node.js](https://en.wikipedia.org/wiki/Node.js). האמון שלו ב-Forward Email מראה את המיקוד שלנו באיכות וביטחון. יצחק משתמש ב-Forward Email עבור מספר דומיינים כולל izs.me.

השפעתו של יצחק על JavaScript היא עצומה. בשנת 2009, הוא היה בין הראשונים שראו את הפוטנציאל של Node.js, ועבד עם [ריאן דאהל](https://en.wikipedia.org/wiki/Ryan_Dahl), שיצר את הפלטפורמה. כפי שיצחק אמר ב-[ראיון למגזין Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "בתוך הקהילה הקטנה הזו של אנשים שניסו להבין איך לגרום ל-JS בצד השרת לקרות, ריאן דאהל יצא עם Node, שהיה פשוט ברור שהוא הגישה הנכונה. זרקתי את כל הקלפים שלי לזה והייתי מעורב מאוד בערך באמצע 2009."

> \[!NOTE]
> למעוניינים בהיסטוריה של Node.js, קיימים סרטים תיעודיים מצוינים המתעדים את התפתחותה, כולל [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) ו-[10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). האתר האישי של ריאן דאהל [personal website](https://tinyclouds.org/) מכיל גם תובנות חשובות על עבודתו.

### מהקמת npm ועד להובלת Node.js {#from-npms-creation-to-nodejs-leadership}

יצחק יצר את npm בספטמבר 2009, עם גרסה ראשונה שמישה שיצאה בתחילת 2010. מנהל החבילות הזה מילא צורך מרכזי ב-Node.js, ואפשר למפתחים לשתף ולמחזר קוד בקלות. לפי [דף הוויקיפדיה של Node.js](https://en.wikipedia.org/wiki/Node.js), "בינואר 2010 הוצג מנהל חבילות לסביבת Node.js בשם npm. מנהל החבילות מאפשר למתכנתים לפרסם ולשתף חבילות Node.js, יחד עם קוד המקור הנלווה, ומיועד לפשט את ההתקנה, העדכון וההסרה של חבילות."

כאשר ריאן דאהל פרש מ-Node.js בינואר 2012, יצחק לקח על עצמו את תפקיד מנהל הפרויקט. כפי שמצוין ב-[קורות החיים שלו](https://izs.me/resume), הוא "הוביל פיתוח של מספר API ליבה מרכזיים ב-Node.js, כולל מערכת המודולים CommonJS, API של מערכת הקבצים וזרמים" ו-"שימש כ-BDFL (דיקטטור רחום לכל החיים) של הפרויקט במשך שנתיים, תוך הבטחת איכות הולכת וגדלה ותהליך בנייה אמין לגרסאות Node.js מ-v0.6 ועד v0.10."

יצחק הוביל את Node.js בתקופת צמיחה מרכזית, קבע סטנדרטים שעדיין מעצבים את הפלטפורמה היום. לאחר מכן הקים את npm, Inc. ב-2014 כדי לתמוך ברישום npm, אותו ניהל בעצמו קודם לכן.

אנו מודים ליצחק על תרומתו העצומה ל-JavaScript וממשיכים להשתמש בהרבה חבילות שיצר. עבודתו שינתה את הדרך בה אנו בונים תוכנה וכיצד מיליוני מפתחים משתפים קוד ברחבי העולם.

## האדריכל מאחורי הקוד: המסע של ניק באו {#the-architect-behind-the-code-nick-baughs-journey}

בלב ההצלחה שלנו בקוד פתוח עומד ניק באו, מייסד ובעלים של Forward Email. עבודתו ב-JavaScript נמשכת כמעט 20 שנה ועיצבה את הדרך בה מפתחים רבים בונים אפליקציות. מסעו בקוד פתוח מראה גם מיומנות טכנית וגם מנהיגות קהילתית.

### ועדת Express הטכנית ותרומות ליבה {#express-technical-committee-and-core-contributions}

המומחיות של ניק במסגרת פיתוח ווב הביאה אותו לוועדת Express הטכנית ([Express Technical Committee](https://expressjs.com/en/resources/community.html)), שם סייע עם אחד ממסגרות העבודה הפופולריות ביותר ב-Node.js. ניק מופיע כיום כחבר לא פעיל בדף הקהילה של [Express community page](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express נוצר במקור על ידי TJ Holowaychuk, תורם קוד פתוח פורה שעיצב חלק ניכר מאקוסיסטם ה-Node.js. אנו מודים על עבודתו היסודית של TJ ומכבדים את [ההחלטה שלו לקחת הפסקה](https://news.ycombinator.com/item?id=37687017) מתרומותיו הרבות בקוד פתוח.

כחבר ב-[הוועדה הטכנית של Express](https://expressjs.com/en/resources/community.html), ניק הפגין תשומת לב רבה לפרטים בנושאים כמו הבהרת תיעוד `req.originalUrl` ותיקון בעיות בטיפול בטפסים מרובי חלקים.

### תרומות למסגרת Koa {#koa-framework-contributions}

העבודה של ניק עם [מסגרת Koa](https://github.com/koajs/koa)—אלטרנטיבה מודרנית וקלה יותר ל-Express שנוצרה גם היא על ידי TJ Holowaychuk—מראה עוד יותר את מחויבותו לכלי פיתוח ווב טובים יותר. תרומותיו ל-Koa כוללות גם דיווחי בעיות וגם קוד דרך בקשות משיכה, המתמקדות בטיפול בשגיאות, ניהול סוגי תוכן ושיפורי תיעוד.

העבודה שלו בשתי המסגרות, Express ו-Koa, מעניקה לו נקודת מבט ייחודית על פיתוח ווב ב-Node.js, ועוזרת לצוות שלנו ליצור חבילות שעובדות היטב עם מספר אקוסיסטמים של מסגרות.

### מתורם יחיד למוביל ארגוני {#from-individual-contributor-to-organization-leader}

מה שהתחיל כסיוע לפרויקטים קיימים התפתח ליצירה ותחזוקה של אקוסיסטמים שלמים של חבילות. ניק ייסד מספר ארגוני GitHub—כולל [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), ו-[Bree](https://github.com/breejs)—כל אחד פותר צרכים ספציפיים בקהילת JavaScript.

המעבר מתורם למוביל מראה את חזונו של ניק לתוכנה מתוכננת היטב הפותרת בעיות אמיתיות. על ידי ארגון חבילות קשורות תחת ארגוני GitHub ממוקדים, הוא בנה אקוסיסטמים של כלים שעובדים יחד תוך שמירה על מודולריות וגמישות לקהילה הרחבה של מפתחים.

## ארגוני ה-GitHub שלנו: אקוסיסטמים של חדשנות {#our-github-organizations-ecosystems-of-innovation}

אנו מארגנים את עבודת הקוד הפתוח שלנו סביב ארגוני GitHub ממוקדים, שכל אחד פותר צרכים ספציפיים ב-JavaScript. מבנה זה יוצר משפחות חבילות מלוכדות שעובדות היטב יחד תוך שמירה על מודולריות.

### Cabin: רישום מובנה לאפליקציות מודרניות {#cabin-structured-logging-for-modern-applications}

[ארגון Cabin](https://github.com/cabinjs) הוא הגישה שלנו לרישום אפליקציות פשוט וחזק. החבילה הראשית [`cabin`](https://github.com/cabinjs/cabin) כוללת כמעט 900 כוכבי GitHub ויותר מ-100,000 הורדות שבועיות\[^1]. Cabin מספק רישום מובנה שעובד עם שירותים פופולריים כמו Sentry, LogDNA ו-Papertrail.

מה שמייחד את Cabin הוא ה-API המחשבת שלו ומערכת התוספים. חבילות תומכות כמו [`axe`](https://github.com/cabinjs/axe) למידלוור Express ו-[`parse-request`](https://github.com/cabinjs/parse-request) לניתוח בקשות HTTP מראות את המחויבות שלנו לפתרונות שלמים במקום כלים מבודדים.

חבילת [`bson-objectid`](https://github.com/cabinjs/bson-objectid) ראויה לציון מיוחד, עם יותר מ-1.7 מיליון הורדות בשני חודשים בלבד\[^2]. מימוש MongoDB ObjectID קל זה הפך לבחירה המועדפת למפתחים הזקוקים למזהים ללא תלות מלאה ב-MongoDB.

### Spam Scanner: מלחמה בהתעללות בדואר אלקטרוני {#spam-scanner-fighting-email-abuse}

[ארגון Spam Scanner](https://github.com/spamscanner) מראה את המחויבות שלנו לפתרון בעיות אמיתיות. החבילה הראשית [`spamscanner`](https://github.com/spamscanner/spamscanner) מספקת זיהוי מתקדם של דואר זבל, אך החבילה [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) זכתה לאימוץ מרשים.

עם יותר מ-1.2 מיליון הורדות בשני חודשים\[^3], `url-regex-safe` מתקן בעיות אבטחה קריטיות בביטויים רגולריים אחרים לזיהוי URL. חבילה זו מראה את הגישה שלנו לקוד פתוח: למצוא בעיה נפוצה (במקרה זה, פגיעויות [ReDoS](https://en.wikipedia.org/wiki/ReDoS) באימות URL), ליצור פתרון יציב ולתחזק אותו בקפידה.
### Bree: תזמון משימות מודרני עם Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

ה-[ארגון Bree](https://github.com/breejs) הוא התשובה שלנו לאתגר נפוץ ב-Node.js: תזמון משימות אמין. החבילה הראשית [`bree`](https://github.com/breejs/bree), עם מעל 3,100 כוכבים ב-GitHub, מספקת מתזמן משימות מודרני המשתמש ב-Node.js worker threads לביצועים ואמינות משופרים.

> \[!NOTE]
> Bree נוצרה לאחר שעזרנו לתחזק את [Agenda](https://github.com/agenda/agenda), תוך יישום לקחים שנלמדו לבניית מתזמן משימות טוב יותר. התרומות שלנו ל-Agenda עזרו לנו למצוא דרכים לשפר את תזמון המשימות.

מה שמבדיל את Bree ממתזמנים אחרים כמו Agenda:

* **ללא תלות חיצונית**: בניגוד ל-Agenda שדורש MongoDB, Bree אינה דורשת Redis או MongoDB לניהול מצב המשימות.
* **Worker Threads**: Bree משתמשת ב-Node.js worker threads לתהליכים מבודדים, מה שמעניק בידוד וביצועים טובים יותר.
* **API פשוט**: Bree מציעה שליטה מפורטת עם פשטות, מה שמקל על יישום צרכי תזמון מורכבים.
* **תמיכה מובנית**: דברים כמו טעינה מחודשת חלקה, משימות cron, תאריכים וזמני קריאה ידידותיים כלולים כברירת מחדל.

Bree היא חלק מרכזי מ-[forwardemail.net](https://github.com/forwardemail/forwardemail.net), המטפלת במשימות רקע קריטיות כמו עיבוד דואר אלקטרוני, ניקוי ותחזוקה מתוזמנת. השימוש ב-Bree ב-Forward Email מראה את המחויבות שלנו להשתמש בכלים שלנו בייצור, ולהבטיח שהם עומדים בסטנדרטים גבוהים של אמינות.

אנו גם משתמשים ומעריכים חבילות worker thread מצוינות נוספות כמו [piscina](https://github.com/piscinajs/piscina) ולקוחות HTTP כמו [undici](https://github.com/nodejs/undici). Piscina, בדומה ל-Bree, משתמשת ב-Node.js worker threads לעיבוד משימות יעיל. אנו מודים ל-[Matteo Collina](https://github.com/mcollina), שמתחזק גם את undici וגם את piscina, על תרומותיו הגדולות ל-Node.js. Matteo משמש בוועדת ההיגוי הטכנית של Node.js ושיפר משמעותית את יכולות לקוח ה-HTTP ב-Node.js.

### Forward Email: תשתית דואר אלקטרוני בקוד פתוח {#forward-email-open-source-email-infrastructure}

הפרויקט השאפתני ביותר שלנו הוא [Forward Email](https://github.com/forwardemail), שירות דואר אלקטרוני בקוד פתוח המספק העברת דואר, אחסון ושירותי API. המאגר הראשי כולל מעל 1,100 כוכבים ב-GitHub\[^4], מה שמראה הערכה קהילתית לאלטרנטיבה זו לשירותי דואר אלקטרוני קנייניים.

החבילה [`preview-email`](https://github.com/forwardemail/preview-email) מהארגון הזה, עם מעל 2.5 מיליון הורדות בשני חודשים\[^5], הפכה לכלי חיוני למפתחים העובדים עם תבניות דואר אלקטרוני. על ידי מתן דרך פשוטה לתצוגה מקדימה של מיילים במהלך הפיתוח, היא פותרת נקודת כאב נפוצה בבניית יישומים עם דואר אלקטרוני.

### Lad: כלי עזר חיוניים ל-Koa {#lad-essential-koa-utilities-and-tools}

ה-[ארגון Lad](https://github.com/ladjs) מספק אוסף של כלי עזר חיוניים המתמקדים בעיקר בשיפור אקוסיסטם מסגרת Koa. חבילות אלו פותרות אתגרים נפוצים בפיתוח ווב ומתוכננות לעבוד יחד בצורה חלקה תוך שמירה על שימוש עצמאי.

#### koa-better-error-handler: טיפול משופר בשגיאות ל-Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) מציעה פתרון משופר לטיפול בשגיאות באפליקציות Koa. עם מעל 50 כוכבים ב-GitHub, חבילה זו גורמת ל-`ctx.throw` להפיק הודעות שגיאה ידידותיות למשתמש תוך התמודדות עם מספר מגבלות של מטפל השגיאות המובנה של Koa:

* מזהה ומטפל כראוי בשגיאות DNS של Node.js, שגיאות Mongoose ושגיאות Redis
* משתמש ב-[Boom](https://github.com/hapijs/boom) ליצירת תגובות שגיאה עקביות ומעוצבות היטב
* שומר על כותרות (בניגוד למטפל המובנה של Koa)
* שומר על קודי סטטוס מתאימים במקום ברירת המחדל 500
* תומך בהודעות פלאש ושמירת סשן
* מספק רשימות שגיאות HTML לשגיאות אימות
* תומך בסוגי תגובה מרובים (HTML, JSON וטקסט פשוט)
חבילה זו בעלת ערך מיוחד כאשר משתמשים בה לצד [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) לניהול שגיאות מקיף באפליקציות Koa.

#### passport: אימות עבור Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) מרחיב את תווך האימות הפופולרי Passport.js עם שיפורים ספציפיים לאפליקציות ווב מודרניות. חבילה זו תומכת במספר אסטרטגיות אימות מוכנות לשימוש:

* אימות מקומי עם אימייל
* התחברות עם Apple
* אימות GitHub
* אימות Google
* אימות סיסמה חד-פעמית (OTP)

החבילה ניתנת להתאמה גבוהה, ומאפשרת למפתחים לשנות שמות שדות וביטויים כדי להתאים לדרישות האפליקציה שלהם. היא מעוצבת להשתלב בצורה חלקה עם Mongoose לניהול משתמשים, מה שהופך אותה לפתרון אידיאלי לאפליקציות מבוססות Koa שזקוקות לאימות חזק.

#### graceful: כיבוי אלגנטי של האפליקציה {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) פותר את האתגר הקריטי של כיבוי אלגנטי של אפליקציות Node.js. עם מעל 70 כוכבי GitHub, חבילה זו מבטיחה שהאפליקציה שלך תוכל להיסגר בצורה נקייה ללא אובדן נתונים או השארת חיבורים פתוחים. תכונות מרכזיות כוללות:

* תמיכה בסגירה אלגנטית של שרתי HTTP (Express/Koa/Fastify)
* כיבוי נקי של חיבורים למסדי נתונים (MongoDB/Mongoose)
* סגירה נכונה של לקוחות Redis
* טיפול במתזמנים של Bree
* תמיכה במטפלי כיבוי מותאמים אישית
* הגדרות זמן קצוב ניתנות לקונפיגורציה
* אינטגרציה עם מערכות לוגים

חבילה זו חיונית לאפליקציות פרודקשן שבהן כיבויים בלתי צפויים עלולים לגרום לאובדן או לשיבוש נתונים. באמצעות יישום נהלי כיבוי נכונים, `@ladjs/graceful` מסייעת להבטיח את האמינות והיציבות של האפליקציה שלך.

### Upptime: ניטור זמינות קוד פתוח {#upptime-open-source-uptime-monitoring}

[ארגון Upptime](https://github.com/upptime) מייצג את המחויבות שלנו לניטור שקוף וקוד פתוח. מאגר [`upptime`](https://github.com/upptime/upptime) הראשי כולל מעל 13,000 כוכבי GitHub, מה שהופך אותו לאחד הפרויקטים הפופולריים ביותר שאנו תורמים להם. Upptime מספק ניטור זמינות ומצב מבוססי GitHub הפועל ללא צורך בשרת.

אנו משתמשים ב-Upptime עבור דף המצב שלנו בכתובת <https://status.forwardemail.net> כאשר קוד המקור זמין בכתובת <https://github.com/forwardemail/status.forwardemail.net>.

מה שמייחד את Upptime הוא הארכיטקטורה שלה:

* **100% קוד פתוח**: כל רכיב הוא קוד פתוח לחלוטין וניתן להתאמה.
* **מופעל על ידי GitHub**: מנצל את GitHub Actions, Issues ו-Pages לפתרון ניטור ללא שרת.
* **אין צורך בשרת**: בניגוד לכלי ניטור מסורתיים, Upptime אינה דורשת הפעלה או תחזוקה של שרת.
* **דף מצב אוטומטי**: מייצר דף מצב יפה שניתן לארח ב-GitHub Pages.
* **התראות עוצמתיות**: משתלב עם ערוצי התראה שונים כולל אימייל, SMS ו-Slack.

כדי לשפר את חוויית המשתמשים שלנו, שילבנו את [@octokit/core](https://github.com/octokit/core.js/) בקוד המקור של forwardemail.net להצגת עדכוני מצב ותקלות בזמן אמת ישירות באתר שלנו. אינטגרציה זו מספקת שקיפות ברורה למשתמשים במקרה של בעיות בכל הסטאק שלנו (אתר, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree וכו') עם התראות מיידיות, שינויי אייקון תג, צבעי אזהרה ועוד.

ספריית @octokit/core מאפשרת לנו לשלוף נתונים בזמן אמת ממאגר ה-Upptime שלנו ב-GitHub, לעבד אותם ולהציגם בצורה ידידותית למשתמש. כאשר שירות כלשהו חווה הפסקה או ירידה בביצועים, המשתמשים מקבלים התראה מיידית דרך אינדיקטורים ויזואליים מבלי לעזוב את האפליקציה הראשית. אינטגרציה חלקה זו מבטיחה שלמשתמשים שלנו תמיד תהיה גישה למידע עדכני על מצב המערכת, ומשפרת את השקיפות והאמון.

Upptime אומצה על ידי מאות ארגונים המחפשים דרך שקופה ואמינה לנטר שירותים ולתקשר את המצב למשתמשים. הצלחת הפרויקט מדגימה את הכוח שבבניית כלים המנצלים תשתיות קיימות (במקרה זה, GitHub) לפתרון בעיות נפוצות בדרכים חדשות.
## התרומות שלנו לאקוסיסטם של Forward Email {#our-contributions-to-the-forward-email-ecosystem}

בעוד שהחבילות בקוד פתוח שלנו משמשות מפתחים ברחבי העולם, הן גם מהוות את הבסיס לשירות Forward Email שלנו. תפקיד כפול זה — גם כיוצרים וגם כיוזמים של הכלים — מעניק לנו פרספקטיבה ייחודית על היישום שלהם במציאות ומניע שיפור מתמיד.

### מחבילות למערכת ייצור {#from-packages-to-production}

המסע מחבילות בודדות למערכת ייצור מגובשת כולל אינטגרציה והרחבה זהירה. עבור Forward Email, התהליך כולל:

* **הרחבות מותאמות אישית**: בניית הרחבות ספציפיות ל-Forward Email לחבילות הקוד הפתוח שלנו שמטפלות בדרישות הייחודיות שלנו.
* **תבניות אינטגרציה**: פיתוח תבניות לאופן שבו החבילות האלו מתקשרות בסביבת ייצור.
* **אופטימיזציות ביצועים**: זיהוי וטיפול בצווארי בקבוק של ביצועים שמתגלים רק בקנה מידה גדול.
* **הקשחת אבטחה**: הוספת שכבות אבטחה נוספות המיועדות לטיפול בדואר אלקטרוני והגנת נתוני משתמשים.

עבודה זו מייצגת אלפי שעות פיתוח מעבר לחבילות הליבה עצמן, ומביאה לשירות דואר אלקטרוני חזק ובטוח שמנצל את מיטב התרומות שלנו בקוד פתוח.

### לולאת המשוב {#the-feedback-loop}

אולי ההיבט החשוב ביותר בשימוש בחבילות שלנו בייצור הוא לולאת המשוב שהיא יוצרת. כשאנחנו נתקלים במגבלות או במקרים קיצוניים ב-Forward Email, אנחנו לא רק מתקנים אותם מקומית — אנחנו משפרים את החבילות הבסיסיות, לטובת השירות שלנו ולטובת הקהילה הרחבה.

גישה זו הובילה לשיפורים רבים:

* **כיבוי חלק של Bree**: הצורך של Forward Email בפריסות ללא השבתה הוביל לשיפור יכולות הכיבוי החלק ב-Bree.
* **זיהוי תבניות בסורק הספאם**: דפוסי ספאם מהעולם האמיתי שנתקלו ב-Forward Email השפיעו על אלגוריתמי הזיהוי של סורק הספאם.
* **אופטימיזציות ביצועים ב-Cabin**: רישום נפחי גבוה בייצור חשף הזדמנויות אופטימיזציה ב-Cabin שמועילות לכל המשתמשים.

על ידי שמירה על מחזור חיובי זה בין עבודת הקוד הפתוח שלנו לשירות הייצור, אנו מבטיחים שהחבילות שלנו יישארו פתרונות מעשיים, מנוסים בשטח, ולא מימושים תיאורטיים.


## עקרונות הליבה של Forward Email: בסיס למצוינות {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email מעוצב על פי סט עקרונות ליבה שמנחים את כל החלטות הפיתוח שלנו. עקרונות אלו, המפורטים באתר שלנו ב-[website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), מבטיחים שהשירות שלנו יישאר ידידותי למפתחים, מאובטח וממוקד בפרטיות המשתמש.

### תמיד ידידותי למפתחים, ממוקד אבטחה ושקוף {#always-developer-friendly-security-focused-and-transparent}

העיקרון הראשון והחשוב ביותר שלנו הוא ליצור תוכנה שהיא ידידותית למפתחים תוך שמירה על הסטנדרטים הגבוהים ביותר של אבטחה ופרטיות. אנו מאמינים שמצוינות טכנית לא צריכה לבוא על חשבון השימושיות, ושקיפות בונה אמון עם הקהילה שלנו.

עיקרון זה מתבטא בתיעוד מפורט, הודעות שגיאה ברורות ותקשורת פתוחה על הצלחות ואתגרים. על ידי הפיכת כל בסיס הקוד שלנו לקוד פתוח, אנו מזמינים ביקורת ושיתוף פעולה, ומחזקים הן את התוכנה שלנו והן את האקוסיסטם הרחב יותר.

### עמידה בעקרונות פיתוח תוכנה שנבדקו בזמן {#adherence-to-time-tested-software-development-principles}

אנו פועלים לפי מספר עקרונות פיתוח תוכנה מבוססים שהוכיחו את ערכם במשך עשורים:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: הפרדת תחומי אחריות באמצעות תבנית Model-View-Controller
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: יצירת רכיבים מודולריים שעושים דבר אחד היטב
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: לשמור על פשטות ובהירות
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: אל תחזור על עצמך, קידום שימוש חוזר בקוד
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: אתה לא תצטרך את זה, הימנעות מאופטימיזציה מוקדמת מדי
* **[Twelve Factor](https://12factor.net/)**: עמידה בפרקטיקות הטובות ביותר לבניית אפליקציות מודרניות וסקלאביליות
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: בחירת הפתרון הפשוט ביותר שעונה על הדרישות
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: שימוש נרחב במוצרים שלנו עצמנו
עקרונות אלה אינם רק מושגים תיאורטיים — הם מוטמעים בפרקטיקות הפיתוח היומיומיות שלנו. לדוגמה, ההיצמדות שלנו לפילוסופיית יוניקס ניכרת באופן שבו בנינו את חבילות ה-npm שלנו: מודולים קטנים וממוקדים שניתן להרכיב יחד כדי לפתור בעיות מורכבות.

### פנייה למפתח הקטן והעצמאי {#targeting-the-scrappy-bootstrapped-developer}

אנו מכוונים במיוחד למפתח הקטן, העצמאי, ו-[רווחי-רמן](https://www.paulgraham.com/ramenprofitable.html). מיקוד זה מעצב את כל דבר, מדגם התמחור שלנו ועד להחלטות הטכניות שלנו. אנו מבינים את האתגרים של בניית מוצרים עם משאבים מוגבלים כי עברנו את זה בעצמנו.

עיקרון זה חשוב במיוחד בגישתנו לקוד פתוח. אנו יוצרים ומתחזקים חבילות שפותרות בעיות אמיתיות למפתחים ללא תקציבי ארגונים, ומאפשרים כלים רבי עוצמה לכולם ללא קשר למשאביהם.

### עקרונות בפועל: קוד המקור של Forward Email {#principles-in-practice-the-forward-email-codebase}

עקרונות אלה נראים בבירור בקוד המקור של Forward Email. קובץ package.json שלנו חושף בחירה שקולה של תלותיות, כל אחת נבחרה להתאים לערכי הליבה שלנו:

* חבילות ממוקדות אבטחה כמו `mailauth` לאימות דואר אלקטרוני
* כלים ידידותיים למפתח כמו `preview-email` להקל על איתור באגים
* רכיבים מודולריים כמו כלי ה-`p-*` השונים של סינדרה סורהוס

על ידי שמירה עקבית על עקרונות אלה לאורך זמן, בנינו שירות שמפתחים יכולים לסמוך עליו עם תשתית הדואר האלקטרוני שלהם — מאובטח, אמין, ובהלימה לערכי קהילת הקוד הפתוח.

### פרטיות כברירת מחדל {#privacy-by-design}

פרטיות אינה מחשבה מאוחרת או תכונת שיווק עבור Forward Email — זו עקרון עיצוב יסודי שמנחה כל היבט של השירות והקוד שלנו:

* **הצפנה ללא גישה**: יישמנו מערכות שמונעות מאיתנו טכנית לקרוא את מיילי המשתמשים.
* **איסוף נתונים מינימלי**: אנו אוספים רק את הנתונים הנחוצים לספק את השירות שלנו, לא יותר.
* **מדיניות שקופה**: מדיניות הפרטיות שלנו כתובה בשפה ברורה ומובנת ללא מונחים משפטיים.
* **אימות קוד פתוח**: קוד המקור הפתוח שלנו מאפשר לחוקרי אבטחה לאמת את טענות הפרטיות שלנו.

המחויבות הזו מתרחבת גם לחבילות הקוד הפתוח שלנו, שעוצבו עם מיטב הפרקטיקות של אבטחה ופרטיות מהיסוד.

### קוד פתוח בר קיימא {#sustainable-open-source}

אנו מאמינים שתוכנת קוד פתוח זקוקה למודלים ברי קיימא כדי לשגשג בטווח הארוך. הגישה שלנו כוללת:

* **תמיכה מסחרית**: הצעת תמיכה ושירותים פרימיום סביב הכלים שלנו בקוד פתוח.
* **רישוי מאוזן**: שימוש ברישיונות שמגנים על חירויות המשתמשים ועל קיימות הפרויקט.
* **מעורבות קהילתית**: מעורבות פעילה עם תורמים לבניית קהילה תומכת.
* **מפות דרכים שקופות**: שיתוף תוכניות הפיתוח שלנו כדי לאפשר למשתמשים לתכנן בהתאם.

על ידי התמקדות בקיימות, אנו מבטיחים שתרומות הקוד הפתוח שלנו יוכלו להמשיך לגדול ולהשתפר לאורך זמן במקום ליפול להזנחה.


## המספרים לא משקרים: סטטיסטיקות ההורדות המדהימות שלנו ב-npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

כשמדברים על השפעת תוכנת קוד פתוח, סטטיסטיקות ההורדות מספקות מדד מוחשי לאימוץ ואמון. רבות מהחבילות שאנו מסייעים לתחזק הגיעו להיקף שמעט מאוד פרויקטים בקוד פתוח מצליחים להגיע אליו, עם הורדות משולבות במיליארדים.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> בעוד שאנו גאים לסייע בתחזוקת מספר חבילות עם הורדות רבות במערכת JavaScript, אנו רוצים להכיר בכך שרבות מהחבילות הללו נוצרו במקור על ידי מפתחים מוכשרים אחרים. חבילות כמו superagent ו-supertest נוצרו במקור על ידי TJ Holowaychuk, שתרומותיו הפוריות לקוד פתוח היו מכריעות בעיצוב מערכת Node.js.
### מבט על ההשפעה שלנו ממעוף הציפור {#a-birds-eye-view-of-our-impact}

בתקופה של חודשיים בלבד מפברואר עד מרץ 2025, החבילות המובילות שאנו תורמים להן ועוזרים לתחזק רשמו מספרי הורדות מדהימים:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84,575,829 הורדות\[^7] (נוצר במקור על ידי TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76,432,591 הורדות\[^8] (נוצר במקור על ידי TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28,539,295 הורדות\[^34] (נוצר במקור על ידי TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11,007,327 הורדות\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3,498,918 הורדות\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 הורדות\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2,500,000 הורדות\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1,800,000 הורדות\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 הורדות\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1,128,139 הורדות\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1,124,686 הורדות\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 הורדות\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 הורדות\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 הורדות\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145,000 הורדות\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24,270 הורדות\[^30]

> \[!NOTE]
> מספר חבילות נוספות שאנו עוזרים לתחזק אך לא יצרנו רשמו אפילו מספרי הורדות גבוהים יותר, כולל `form-data` (מעל 738 מיליון הורדות), `toidentifier` (מעל 309 מיליון הורדות), `stackframe` (מעל 116 מיליון הורדות), ו-`error-stack-parser` (מעל 113 מיליון הורדות). אנו מתכבדים לתרום לחבילות אלו תוך כיבוד עבודתם של היוצרים המקוריים.

אלו לא רק מספרים מרשימים — הם מייצגים מפתחים אמיתיים הפותרים בעיות אמיתיות עם קוד שאנו עוזרים לתחזק. כל הורדה היא מקרה שבו חבילות אלו סייעו למישהו לבנות משהו משמעותי, מפרויקטים תחביביים ועד יישומים ארגוניים המשמשים מיליונים.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### השפעה יומית בקנה מידה {#daily-impact-at-scale}

תבניות ההורדה היומיות מגלות שימוש עקבי בנפח גבוה, עם שיאים המגיעים למיליוני הורדות ביום\[^13]. עקביות זו מעידה על היציבות והאמינות של החבילות הללו — מפתחים לא רק מנסים אותן; הם משלבים אותן בתהליכי העבודה המרכזיים שלהם ותלויים בהן יום אחרי יום.

תבניות ההורדה השבועיות מראות מספרים מרשימים אף יותר, כשהן נשארות באופן עקבי סביב עשרות מיליוני הורדות בשבוע\[^14]. זה מייצג טביעת רגל עצומה במערכת האקולוגית של JavaScript, עם חבילות אלו הפועלות בסביבות ייצור ברחבי העולם.

### מעבר למספרים הגולמיים {#beyond-the-raw-numbers}

בעוד שסטטיסטיקות ההורדה מרשימות בפני עצמן, הן מספרות סיפור עמוק יותר על האמון שהקהילה נותנת בחבילות אלו. תחזוקת חבילות בקנה מידה כזה דורשת מחויבות בלתי מתפשרת ל:

* **תאימות לאחור**: יש לשקול שינויים בקפידה כדי למנוע שבירת יישומים קיימים.
* **אבטחה**: עם מיליוני יישומים התלויים בחבילות אלו, פגיעויות אבטחה עלולות לגרום להשלכות רחבות היקף.
* **ביצועים**: בקנה מידה כזה, שיפורים קטנים בביצועים יכולים להביא לתועלות מצטברות משמעותיות.
* **תיעוד**: תיעוד ברור ומקיף הוא חיוני לחבילות המשמשות מפתחים בכל רמות הניסיון.

הצמיחה המתמדת במספרי ההורדות לאורך זמן משקפת את ההצלחה במילוי מחויבויות אלו, ובניית אמון עם קהילת המפתחים דרך חבילות אמינות ומתוחזקות היטב.
## תמיכה באקוסיסטם: חסויות הקוד הפתוח שלנו {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> קיימות בקוד פתוח אינה רק על תרומת קוד — היא גם על תמיכה במפתחים שמתחזקים תשתיות קריטיות.

מעבר לתרומות הישירות שלנו לאקוסיסטם של JavaScript, אנו גאים לתמוך בתורמים בולטים ל-Node.js שעבודתם מהווה את הבסיס להרבה יישומים מודרניים. החסויות שלנו כוללות:

### אנדריס ריינמן: חלוץ תשתיות דואר אלקטרוני {#andris-reinman-email-infrastructure-pioneer}

[אנדריס ריינמן](https://github.com/andris9) הוא היוצר של [Nodemailer](https://github.com/nodemailer/nodemailer), ספריית שליחת הדואר האלקטרוני הפופולרית ביותר ל-Node.js עם מעל 14 מיליון הורדות שבועיות\[^15]. עבודתו מתפרסת גם לרכיבי תשתית דואר אלקטרוני קריטיים נוספים כמו [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), ו-[WildDuck](https://github.com/nodemailer/wildduck).

החסות שלנו מסייעת להבטיח את התחזוקה והפיתוח המתמשכים של כלים חיוניים אלה שמפעילים את תקשורת הדואר האלקטרוני עבור אינספור יישומי Node.js, כולל שירות Forward Email שלנו.

### סינדרה סורהוס: מוחות מאחורי חבילות השירות {#sindre-sorhus-utility-package-mastermind}

[סינדרה סורהוס](https://github.com/sindresorhus) הוא אחד התורמים הפוריים ביותר בקוד פתוח באקוסיסטם של JavaScript, עם מעל 1,000 חבילות npm על שמו. הכלים שלו כמו [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), ו-[is-stream](https://github.com/sindresorhus/is-stream) הם אבני בניין יסודיות שמשמשות בכל אקוסיסטם של Node.js.

על ידי חסות לעבודה של סינדרה, אנו מסייעים לקיים את הפיתוח של כלים קריטיים אלה שהופכים את פיתוח ה-JavaScript ליעיל ואמין יותר.

חסויות אלו משקפות את המחויבות שלנו לאקוסיסטם הרחב של הקוד הפתוח. אנו מכירים בכך שההצלחה שלנו בנויה על היסודות שהונחו על ידי תורמים אלו ואחרים, ואנו מחויבים להבטיח את הקיימות של כל האקוסיסטם.


## גילוי פרצות אבטחה באקוסיסטם של JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

המחויבות שלנו לקוד פתוח חורגת מעבר לפיתוח תכונות וכוללת זיהוי וטיפול בפרצות אבטחה שעשויות להשפיע על מיליוני מפתחים. כמה מהתרומות המשמעותיות ביותר שלנו לאקוסיסטם של JavaScript היו בתחום האבטחה.

### ההצלה של koa-router {#the-koa-router-rescue}

בפברואר 2019, ניק זיהה בעיה קריטית בתחזוקת חבילת koa-router הפופולרית. כפי ש[דיווח ב-Hacker News](https://news.ycombinator.com/item?id=19156707), החבילה ננטשה על ידי המתחזק המקורי שלה, מה שהשאיר פרצות אבטחה ללא טיפול והקהילה ללא עדכונים.

> \[!WARNING]
> חבילות נטושות עם פרצות אבטחה מהוות סיכונים משמעותיים לכל האקוסיסטם, במיוחד כאשר הן מורדות מיליוני פעמים בשבוע.

בתגובה, ניק יצר את [@koa/router](https://github.com/koajs/router) וסייע להתריע לקהילה על המצב. מאז הוא מתחזק את החבילה הקריטית הזו, ומבטיח שמשתמשי Koa יקבלו פתרון ניתוב מאובטח ומתוחזק היטב.

### טיפול בפרצות ReDoS {#addressing-redos-vulnerabilities}

ב-2020, ניק זיהה וטיפל בפרצת אבטחה קריטית מסוג [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) בחבילת `url-regex` הנפוצה. פרצה זו ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) יכלה לאפשר לתוקפים לגרום לשירות להפסיק לפעול על ידי הזנת קלט מיוחד שגרם למעקב חוזר קטסטרופלי בביטוי הרגולרי.

במקום לתקן פשוט את החבילה הקיימת, ניק יצר את [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), מימוש מחודש לחלוטין שמטפל בפרצה תוך שמירה על תאימות ל-API המקורי. הוא גם פרסם [פוסט בלוג מקיף](/blog/docs/url-regex-javascript-node-js) שמסביר את הפרצה ואיך להקטין את הסיכון.
עבודה זו מציגה את הגישה שלנו לאבטחה: לא רק תיקון בעיות אלא גם חינוך הקהילה ומתן חלופות חזקות שמונעות בעיות דומות בעתיד.

### קידום אבטחת Node.js ו-Chromium {#advocating-for-nodejs-and-chromium-security}

ניק היה פעיל גם בקידום שיפורים באבטחה במערכת האקולוגית הרחבה יותר. באוגוסט 2020, הוא זיהה בעיית אבטחה משמעותית ב-Node.js הקשורה לטיפול בכותרות HTTP, שדווחה ב-[The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

בעיה זו, שנבעה מתיקון ב-Chromium, יכלה לאפשר לתוקפים לעקוף אמצעי אבטחה. הקידום של ניק סייע להבטיח שהבעיה תטופל במהירות, והגן על מיליוני יישומי Node.js מפני ניצול פוטנציאלי.

### אבטחת תשתית npm {#securing-npm-infrastructure}

מאוחר יותר באותו חודש, ניק זיהה בעיית אבטחה קריטית נוספת, הפעם בתשתית האימייל של npm. כפי שדווח ב-[The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm לא יישמה כראוי את פרוטוקולי האימות DMARC, SPF ו-DKIM, מה שאפשר לתוקפים לשלוח מיילים פישינג שנראו כאילו הגיעו מ-npm.

הדיווח של ניק הוביל לשיפורים במצב האבטחה של האימייל ב-npm, והגן על מיליוני המפתחים הסומכים על npm לניהול חבילות מפני התקפות פישינג פוטנציאליות.


## התרומות שלנו למערכת האקולוגית של Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email בנוי על מספר פרויקטים קריטיים בקוד פתוח, כולל Nodemailer, WildDuck ו-mailauth. הצוות שלנו תרם תרומות משמעותיות לפרויקטים אלו, וסייע בזיהוי ותיקון בעיות עמוקות המשפיעות על משלוח ואבטחת האימייל.

### שיפור הפונקציונליות המרכזית של Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) הוא עמוד השדרה של שליחת אימייל ב-Node.js, והתרומות שלנו סייעו להפוך אותו לעמיד יותר:

* **שיפורים בשרת SMTP**: תיקנו באגים בניתוח, בעיות בטיפול בזרמים, ובעיות בקונפיגורציית TLS ברכיב שרת ה-SMTP\[^16]\[^17].
* **שיפורים במנתח האימייל**: טיפלנו בשגיאות בפענוח רצפי תווים ובעיות במנתח כתובות שיכלו לגרום לכישלונות בעיבוד אימייל\[^18]\[^19].

תרומות אלו מבטיחות ש-Nodemailer יישאר בסיס אמין לעיבוד אימייל ביישומי Node.js, כולל Forward Email.

### קידום אימות אימייל עם Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) מספק פונקציונליות קריטית לאימות אימייל, והתרומות שלנו שיפרו משמעותית את יכולותיו:

* **שיפורים באימות DKIM**: גילינו ודיווחנו כי ל-X/Twitter היו בעיות במטמון DNS שגרמו לכישלון DKIM עבור הודעות יוצאות שלהם, ודיווחנו על כך ב-Hacker One\[^20].
* **שיפורים ב-DMARC ו-ARC**: תיקנו בעיות באימות DMARC ו-ARC שיכלו להוביל לתוצאות אימות שגויות\[^21]\[^22].
* **אופטימיזציות ביצועים**: תרמנו לאופטימיזציות שמשפרות את ביצועי תהליכי אימות האימייל\[^23]\[^24]\[^25]\[^26].

שיפורים אלו מסייעים להבטיח שאימות האימייל יהיה מדויק ואמין, ומגנים על משתמשים מפני התקפות פישינג וזיוף.

### שיפורים מרכזיים ב-Upptime {#key-upptime-enhancements}

התרומות שלנו ל-Upptime כוללות:

* **ניטור תוקף תעודת SSL**: הוספנו פונקציונליות לניטור תוקף תעודת SSL, כדי למנוע השבתה בלתי צפויה עקב תעודות שפג תוקפן\[^27].
* **תמיכה במספר מספרי SMS**: יישמנו תמיכה בהתראה למספר חברי צוות באמצעות SMS כאשר מתרחשים תקלות, לשיפור זמני התגובה\[^28].
* **תיקוני בדיקות IPv6**: תיקנו בעיות בבדיקות חיבור IPv6, להבטחת ניטור מדויק יותר בסביבות רשת מודרניות\[^29].
* **תמיכה במצב כהה/בהיר**: הוספנו תמיכה בערכות נושא לשיפור חוויית המשתמש בדפי סטטוס\[^31].
* **שיפור תמיכת TCP-Ping**: שיפרנו את פונקציונליות ה-TCP ping לספק בדיקות חיבור אמינות יותר\[^32].
שיפורים אלה לא רק משפרים את ניטור הסטטוס של Forward Email אלא זמינים לכל קהילת משתמשי Upptime, ומדגימים את המחויבות שלנו לשיפור הכלים שעליהם אנו מסתמכים.


## הדבק שמחזיק את הכל יחד: קוד מותאם בקנה מידה {#the-glue-that-holds-it-all-together-custom-code-at-scale}

בעוד שספריות ה-npm שלנו והתרומות שלנו לפרויקטים קיימים הן משמעותיות, הקוד המותאם שמשלב את הרכיבים הללו הוא זה שבאמת מציג את המומחיות הטכנית שלנו. בסיס הקוד של Forward Email מייצג עשור של מאמצי פיתוח, החל מ-2017 כשהפרויקט התחיל כ-[free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) לפני שנמזג למונורפו.

### מאמץ פיתוח עצום {#a-massive-development-effort}

היקף קוד האינטגרציה המותאם מרשים:

* **סך התרומות**: מעל 3,217 קומיטים
* **גודל בסיס הקוד**: מעל 421,545 שורות קוד ב-JavaScript, Pug, CSS ו-JSON\[^33]

זה מייצג אלפי שעות של עבודה בפיתוח, סשנים של איתור באגים ואופטימיזציות ביצועים. זה ה"סוד" שהופך חבילות בודדות לשירות מגובש ואמין שמשמש אלפי לקוחות מדי יום.

### אינטגרציה של תלות ליבה {#core-dependencies-integration}

בסיס הקוד של Forward Email משלב תלות רבות למערכת חלקה אחת:

* **עיבוד דואר אלקטרוני**: משלב Nodemailer לשליחה, SMTP Server לקבלה, ו-Mailparser לניתוח
* **אימות**: משתמש ב-Mailauth לאימות DKIM, SPF, DMARC ו-ARC
* **פתרון DNS**: מנצל את Tangerine ל-DNS-over-HTTPS עם מטמון גלובלי
* **חיבור MX**: משתמש ב-mx-connect עם אינטגרציה של Tangerine לחיבור אמין לשרתות דואר
* **תזמון משימות**: מפעיל Bree לעיבוד משימות רקע אמין עם תהליכי עובד
* **תבניות**: משתמש ב-email-templates לשימוש חוזר בגליונות סגנון מהאתר בתקשורת עם לקוחות
* **אחסון דואר אלקטרוני**: מיישם תיבות דואר מוצפנות בנפרד ב-SQLite באמצעות better-sqlite3-multiple-ciphers עם הצפנת ChaCha20-Poly1305 לפרטיות בטוחה מפני מחשבים קוונטיים, ומבטיח בידוד מלא בין משתמשים שרק המשתמש יכול לגשת לתיבת הדואר שלו

כל אחת מהאינטגרציות הללו דורשת התייחסות מדוקדקת למקרי קצה, השלכות ביצועים ונושאי אבטחה. התוצאה היא מערכת חזקה שמטפלת במיליוני עסקאות דואר אלקטרוני באמינות. מימוש ה-SQLite שלנו גם מנצל את msgpackr לסריאליזציה בינארית יעילה ו-WebSockets (באמצעות ws) לעדכוני סטטוס בזמן אמת ברחבי התשתית שלנו.

### תשתית DNS עם Tangerine ו-mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

רכיב קריטי בתשתית של Forward Email הוא מערכת פתרון ה-DNS שלנו, המבוססת על שתי חבילות מפתח:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: מימוש DNS-over-HTTPS שלנו ל-Node.js מספק תחליף ישיר לפותר ה-DNS הסטנדרטי, עם ניסיונות חוזרים מובנים, זמני המתנה, סיבוב שרתים חכם ותמיכה במטמון.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: חבילה זו מקימה חיבורי TCP לשרתות MX, מקבלת דומיין יעד או כתובת דואר אלקטרוני, פותרת את שרתי ה-MX המתאימים ומתחברת אליהם לפי סדר עדיפות.

שילבנו את Tangerine עם mx-connect דרך [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), ומבטיחים בקשות DNS על שכבת היישום דרך HTTP לאורך כל Forward Email. זה מספק מטמון גלובלי ל-DNS בקנה מידה עם עקביות 1:1 בכל אזור, אפליקציה או תהליך — קריטי למשלוח דואר אמין במערכת מבוזרת.


## השפעה ארגונית: ממקור פתוח לפתרונות קריטיים למשימה {#enterprise-impact-from-open-source-to-mission-critical-solutions}

שיא המסע שלנו בפיתוח קוד פתוח שנמשך עשור אפשר ל-Forward Email לשרת לא רק מפתחים בודדים אלא גם ארגונים גדולים ומוסדות חינוך שמרכיבים את עמוד השדרה של תנועת הקוד הפתוח עצמה.
### מחקרי מקרה בתשתיות דואר אלקטרוני קריטיות למשימה {#case-studies-in-mission-critical-email-infrastructure}

המחויבות שלנו לאמינות, פרטיות ועקרונות קוד פתוח הפכה את Forward Email לבחירה המועדפת על ארגונים עם דרישות דואר אלקטרוני תובעניות:

* **מוסדות חינוך**: כפי שמתואר ב-[מחקר המקרה על הפניית דואר אלקטרוני לבוגרים](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), אוניברסיטאות גדולות מסתמכות על התשתית שלנו לשמירה על קשרים לכל החיים עם מאות אלפי בוגרים באמצעות שירותי הפניית דואר אמינים.

* **פתרונות לינוקס ארגוניים**: [מחקר המקרה של דואר אלקטרוני ארגוני בקנוניקל אובונטו](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) מדגים כיצד הגישה שלנו לקוד פתוח מתאימה באופן מושלם לצרכים של ספקי לינוקס ארגוניים, ומציעה להם את השקיפות והשליטה שהם דורשים.

* **קרנות קוד פתוח**: אולי המאמת ביותר הוא השותפות שלנו עם Linux Foundation, כפי שמתועד ב-[מחקר המקרה של דואר אלקטרוני ארגוני ב-Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), שבו השירות שלנו מפעיל את התקשורת עבור הארגון שמוביל את פיתוח לינוקס.

יש סימטריה יפה באופן שבו חבילות הקוד הפתוח שלנו, המתוחזקות בקפידה במשך שנים רבות, אפשרו לנו לבנות שירות דואר אלקטרוני שתומך כיום בקהילות ובארגונים שמקדמים תוכנת קוד פתוח. המסע המעגלי הזה — מהיותנו תורמים לחבילות בודדות ועד להפעלת תשתית דואר אלקטרוני ברמת ארגון עבור מובילי קוד פתוח — מייצג את האישור האולטימטיבי לגישתנו לפיתוח תוכנה.


## עשור של קוד פתוח: מביטים קדימה {#a-decade-of-open-source-looking-forward}

כשאנו מסתכלים לאחור על עשור של תרומות לקוד פתוח ולפנים לעשר השנים הבאות, אנו מלאים בהכרת תודה לקהילה שתמכה בעבודתנו ובהתרגשות ממה שעתיד לבוא.

המסע שלנו מתורמי חבילות בודדות למתחזקים של תשתית דואר אלקטרוני מקיפה המשמשת ארגונים גדולים וקרנות קוד פתוח היה מרשים. זהו עדות לכוח הפיתוח בקוד פתוח ולהשפעה שתוכנה מתוחזקת היטב ומחושבת יכולה להיות על האקוסיסטם הרחב יותר.

בשנים הקרובות, אנו מחויבים ל:

* **להמשיך לתחזק ולשפר את החבילות הקיימות שלנו**, ולהבטיח שהן יישארו כלים אמינים למפתחים ברחבי העולם.
* **להרחיב את תרומותינו לפרויקטים קריטיים בתשתיות**, במיוחד בתחומי הדואר האלקטרוני והאבטחה.
* **להעצים את יכולות Forward Email** תוך שמירה על המחויבות שלנו לפרטיות, אבטחה ושקיפות.
* **לתמוך בדור הבא של תורמי קוד פתוח** באמצעות חונכות, חסות ומעורבות קהילתית.

אנו מאמינים שעתיד פיתוח התוכנה הוא פתוח, שיתופי ונבנה על יסוד של אמון. על ידי המשך תרומה של חבילות איכותיות וממוקדות אבטחה לאקוסיסטם של JavaScript, אנו מקווים לשחק תפקיד קטן בבניית העתיד הזה.

תודה לכל מי שהשתמש בחבילות שלנו, תרם לפרויקטים שלנו, דיווח על בעיות או פשוט הפיץ את הבשורה על עבודתנו. התמיכה שלכם אפשרה עשור זה של השפעה, ואנו נרגשים לראות מה נוכל להשיג יחד בעשר השנים הבאות.

\[^1]: סטטיסטיקות הורדות npm עבור cabin, אפריל 2025  
\[^2]: סטטיסטיקות הורדות npm עבור bson-objectid, פברואר-מרץ 2025  
\[^3]: סטטיסטיקות הורדות npm עבור url-regex-safe, אפריל 2025  
\[^4]: ספירת כוכבים ב-GitHub עבור forwardemail/forwardemail.net נכון לאפריל 2025  
\[^5]: סטטיסטיקות הורדות npm עבור preview-email, אפריל 2025  
\[^7]: סטטיסטיקות הורדות npm עבור superagent, פברואר-מרץ 2025  
\[^8]: סטטיסטיקות הורדות npm עבור supertest, פברואר-מרץ 2025  
\[^9]: סטטיסטיקות הורדות npm עבור preview-email, פברואר-מרץ 2025  
\[^10]: סטטיסטיקות הורדות npm עבור cabin, פברואר-מרץ 2025  
\[^11]: סטטיסטיקות הורדות npm עבור url-regex-safe, פברואר-מרץ 2025  
\[^12]: סטטיסטיקות הורדות npm עבור spamscanner, פברואר-מרץ 2025  
\[^13]: דפוסי הורדה יומיים מסטטיסטיקות npm, אפריל 2025  
\[^14]: דפוסי הורדה שבועיים מסטטיסטיקות npm, אפריל 2025  
\[^15]: סטטיסטיקות הורדות npm עבור nodemailer, אפריל 2025  
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>  
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>  
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>  
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>  
\[^20]: <https://github.com/postalsys/mailauth/issues/30>  
\[^21]: <https://github.com/postalsys/mailauth/issues/58>  
\[^22]: <https://github.com/postalsys/mailauth/issues/48>  
\[^23]: <https://github.com/postalsys/mailauth/issues/74>  
\[^24]: <https://github.com/postalsys/mailauth/issues/75>  
\[^25]: <https://github.com/postalsys/mailauth/issues/60>  
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: מבוסס על בעיות GitHub במאגר Upptime  
\[^28]: מבוסס על בעיות GitHub במאגר Upptime  
\[^29]: מבוסס על בעיות GitHub במאגר Upptime  
\[^30]: סטטיסטיקות הורדות npm עבור bree, פברואר-מרץ 2025  
\[^31]: מבוסס על בקשות משיכה ב-GitHub ל-Upptime  
\[^32]: מבוסס על בקשות משיכה ב-GitHub ל-Upptime  
\[^34]: סטטיסטיקות הורדות npm עבור koa, פברואר-מרץ 2025  
\[^35]: סטטיסטיקות הורדות npm עבור @koa/router, פברואר-מרץ 2025  
\[^36]: סטטיסטיקות הורדות npm עבור koa-router, פברואר-מרץ 2025  
\[^37]: סטטיסטיקות הורדות npm עבור url-regex, פברואר-מרץ 2025  
\[^38]: סטטיסטיקות הורדות npm עבור @breejs/later, פברואר-מרץ 2025  
\[^39]: סטטיסטיקות הורדות npm עבור email-templates, פברואר-מרץ 2025  
\[^40]: סטטיסטיקות הורדות npm עבור get-paths, פברואר-מרץ 2025  
\[^41]: סטטיסטיקות הורדות npm עבור dotenv-parse-variables, פברואר-מרץ 2025  
\[^42]: סטטיסטיקות הורדות npm עבור @koa/multer, פברואר-מרץ 2025
