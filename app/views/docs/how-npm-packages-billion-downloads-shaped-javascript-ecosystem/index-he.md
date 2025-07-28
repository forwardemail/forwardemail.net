# עשור של השפעה: כיצד חבילות ה-npm שלנו הגיעו למיליארד הורדות ועיצבו את JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

תוכן עניינים {#table-of-contents}

* [הַקדָמָה](#foreword)
* [החלוצים שסומכים עלינו: יצחק ז' שלווטר ושלח מייל](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [מהיצירה של npm ועד למנהיגות של Node.js](#from-npms-creation-to-nodejs-leadership)
* [האדריכל מאחורי הקוד: המסע של ניק באו](#the-architect-behind-the-code-nick-baughs-journey)
  * [הועדה הטכנית של אקספרס ותרומות ליבה](#express-technical-committee-and-core-contributions)
  * [תרומות מסגרת קואה](#koa-framework-contributions)
  * [מתורם אישי למנהיג ארגון](#from-individual-contributor-to-organization-leader)
* [ארגוני GitHub שלנו: מערכות אקולוגיות של חדשנות](#our-github-organizations-ecosystems-of-innovation)
  * [תא: רישום מובנה עבור יישומים מודרניים](#cabin-structured-logging-for-modern-applications)
  * [סורק דואר זבל: נלחם בשימוש לרעה בדוא"ל](#spam-scanner-fighting-email-abuse)
  * [ברי: תזמון עבודה מודרני עם חוטי עובדים](#bree-modern-job-scheduling-with-worker-threads)
  * [העבר דוא"ל: תשתית דוא"ל בקוד פתוח](#forward-email-open-source-email-infrastructure)
  * [ילד: כלי עזר וכלים חיוניים של קואה](#lad-essential-koa-utilities-and-tools)
  * [Uptime: ניטור זמן פעולה בקוד פתוח](#upptime-open-source-uptime-monitoring)
* [התרומות שלנו ל-Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem)
  * [מחבילות ועד ייצור](#from-packages-to-production)
  * [לולאת המשוב](#the-feedback-loop)
* [עקרונות הליבה של העבר אימייל: בסיס למצוינות](#forward-emails-core-principles-a-foundation-for-excellence)
  * [תמיד ידידותי למפתחים, ממוקד אבטחה ושקוף](#always-developer-friendly-security-focused-and-transparent)
  * [הקפדה על עקרונות פיתוח תוכנה שנבדקו בזמן](#adherence-to-time-tested-software-development-principles)
  * [התמקדות במפתח ה-Scrapy, Bootstraped](#targeting-the-scrappy-bootstrapped-developer)
  * [עקרונות בפועל: בסיס הקוד של דוא"ל העברה](#principles-in-practice-the-forward-email-codebase)
  * [פרטיות לפי עיצוב](#privacy-by-design)
  * [קוד פתוח בר קיימא](#sustainable-open-source)
* [המספרים לא משקרים: סטטיסטיקות ההורדות המדהימות שלנו ב-npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [מבט ממעוף הציפור על ההשפעה שלנו](#a-birds-eye-view-of-our-impact)
  * [השפעה יומית בקנה מידה](#daily-impact-at-scale)
  * [מעבר למספרים הגולמיים](#beyond-the-raw-numbers)
* [תמיכה במערכת האקולוגית: החסויות שלנו בקוד פתוח](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [אנדריס ריינמן: חלוץ תשתית הדוא"ל](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [גילוי פרצות אבטחה במערכת האקולוגית של JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [ה-Koa-Router Rescue](#the-koa-router-rescue)
  * [טיפול בפרצות ReDoS](#addressing-redos-vulnerabilities)
  * [דוגל עבור Node.js ו-Chromium Security](#advocating-for-nodejs-and-chromium-security)
  * [אבטחת תשתית npm](#securing-npm-infrastructure)
* [התרומות שלנו ל-Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [שיפור פונקציונליות הליבה של Nodemailer](#enhancing-nodemailers-core-functionality)
  * [קידום אימות דוא"ל עם Mailauth](#advancing-email-authentication-with-mailauth)
  * [שיפורים עיקריים ב-Uptime](#key-upptime-enhancements)
* [הדבק שמחזיק הכל ביחד: קוד מותאם אישית בקנה מידה](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [מאמץ פיתוח מסיבי](#a-massive-development-effort)
  * [שילוב תלות הליבה](#core-dependencies-integration)
  * [תשתית DNS עם Tangerine ו-mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [השפעה ארגונית: מקוד פתוח לפתרונות קריטיים למשימה](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [מקרי מקרה בתשתית דוא"ל קריטית למשימה](#case-studies-in-mission-critical-email-infrastructure)
* [עשור של קוד פתוח: מבט קדימה](#a-decade-of-open-source-looking-forward)

## הקדמה {#foreword}

בעולם [JavaScript](https://en.wikipedia.org/wiki/JavaScript) ו-[Node.js](https://en.wikipedia.org/wiki/Node.js), חלק מהחבילות הן חיוניות - מורדות מיליוני פעמים ביום ומפעילות אפליקציות ברחבי העולם. מאחורי הכלים הללו עומדים מפתחים המתמקדים באיכות קוד פתוח. היום, אנו מראים כיצד הצוות שלנו מסייע לבנות ולתחזק חבילות npm שהפכו לחלקים מרכזיים במערכת האקולוגית של JavaScript.

## החלוצים שסומכים עלינו: אייזק ז. שלוטר והעברת דוא"ל {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

אנו גאים שיש לנו את [יצחק ז' שלווטר](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) כמשתמש. יצחק יצר את [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) ועזר לבנות את [Node.js](https://en.wikipedia.org/wiki/Node.js). האמון שלו ב-Forward Email מראה את המיקוד שלנו באיכות ובאבטחה. יצחק משתמש ב-Forward Email עבור מספר דומיינים, כולל izs.me.

ההשפעה של אייזק על ג'אווהסקריפט היא עצומה. בשנת 2009, הוא היה בין הראשונים לראות את הפוטנציאל של Node.js, ועבד עם [ריאן דאל](https://en.wikipedia.org/wiki/Ryan_Dahl), שיצר את הפלטפורמה. כפי שאמר אייזק ב-[ראיון עם מגזין Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "בתוך קהילה קטנה מאוד של אנשים שמנסים להבין איך לגרום ל-JS בצד השרת לקרות, ריאן דאל הוציא את Node, שברור היה שהגישה הנכונה. השקעתי את כל כולי בגישה הזו והייתי מעורב מאוד בערך באמצע 2009."

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### מיצירת npm ועד למנהיגות Node.js {#from-npms-creation-to-nodejs-leadership}

אייזק יצר את npm בספטמבר 2009, כאשר הגרסה השמישה הראשונה שוחררה בתחילת 2010. מנהל חבילות זה מילא צורך מרכזי ב-Node.js, ואפשר למפתחים לשתף ולעשות שימוש חוזר בקלות בקוד. על פי [דף ויקיפדיה של Node.js](https://en.wikipedia.org/wiki/Node.js), "בינואר 2010, הוצג מנהל חבילות עבור סביבת Node.js בשם npm. מנהל החבילות מאפשר למתכנתים לפרסם ולשתף חבילות Node.js, יחד עם קוד המקור הנלווה, והוא נועד לפשט את ההתקנה, העדכון וההסרה של חבילות."

כאשר ראיין דאהל פרש מ-Node.js בינואר 2012, אייזק נכנס לתפקיד מנהיג הפרויקט. כפי שצוין ב-[הסיכום שלו](https://izs.me/resume), הוא "הוביל את הפיתוח של מספר ממשקי API בסיסיים של Node.js, כולל מערכת מודולים של CommonJS, ממשקי API של מערכת קבצים וזרמים" ו"שימש כ-BDFL (דיקטטור נדיב לכל החיים) של הפרויקט במשך שנתיים, תוך הבטחת איכות הולכת וגוברת ותהליך בנייה אמין עבור גרסאות Node.js גרסה 0.6 עד גרסה 0.10".

אייזק הדריך את Node.js במהלך תקופת צמיחה מרכזית, והציב סטנדרטים שעדיין מעצבים את הפלטפורמה כיום. מאוחר יותר הוא הקים את npm, Inc. ב-2014 כדי לתמוך ברישום npm, אותו ניהל בעצמו בעבר.

אנו מודים ליצחק על תרומותיו העצומות ל-JavaScript וממשיכים להשתמש בחבילות רבות שיצר. עבודתו שינתה את האופן שבו אנו בונים תוכנה וכיצד מיליוני מפתחים חולקים קוד ברחבי העולם.

## האדריכל שמאחורי הקוד: המסע של ניק בו {#the-architect-behind-the-code-nick-baughs-journey}

בליבה של הצלחת הקוד הפתוח שלנו הוא ניק באו, המייסד והבעלים של Forward Email. עבודתו ב-JavaScript משתרעת על פני כמעט 20 שנה ועיצבה את האופן שבו אינספור מפתחים בונים אפליקציות. מסע הקוד הפתוח שלו מראה הן מיומנות טכנית והן מנהיגות קהילתית.

### ועדה טכנית אקספרס ותרומות ליבה {#express-technical-committee-and-core-contributions}

המומחיות של ניק ב-web frameworks זיכתה אותו במקום ב-[הוועדה הטכנית של אקספרס](https://expressjs.com/en/resources/community.html), שם הוא עזר עם אחת מ-Node.js frameworks הנפוצות ביותר. ניק רשום כעת כחבר לא פעיל ב-[עמוד קהילת אקספרס](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

כחבר ב-[הוועדה הטכנית של אקספרס](https://expressjs.com/en/resources/community.html), ניק גילה תשומת לב רבה לפרטים בנושאים כמו הבהרת תיעוד `req.originalUrl` ותיקון בעיות בטיפול בטפסים מרובי חלקים.

### תרומות למסגרת Koa {#koa-framework-contributions}

עבודתו של ניק עם [מסגרת קואה](https://github.com/koajs/koa) - אלטרנטיבה מודרנית וקלה יותר ל-Express, שנוצרה גם היא על ידי TJ Holowaychuk - מראה עוד יותר את מחויבותו לכלי פיתוח אתרים טובים יותר. תרומותיו ל-Koa כוללות הן בעיות והן קוד באמצעות בקשות משיכה, טיפול בשגיאות, ניהול סוגי תוכן ושיפורי תיעוד.

עבודתו ב-Express וגם ב-Koa מעניקה לו מבט ייחודי על פיתוח האינטרנט של Node.js, ועוזרת לצוות שלנו ליצור חבילות שעובדות היטב עם מערכות אקולוגיות מרובות של מסגרת.

### מתורם יחיד למנהיג ארגון {#from-individual-contributor-to-organization-leader}

מה שהתחיל כסיוע לפרויקטים קיימים צמח ליצירה ותחזוקה של מערכות אקולוגיות שלמות. ניק ייסד מספר ארגוני GitHub - כולל [תָא](https://github.com/cabinjs), [סורק ספאם](https://github.com/spamscanner), [העברת דוא"ל](https://github.com/forwardemail), [בָּחוּר](https://github.com/ladjs), ו-[ברי](https://github.com/breejs) - שכל אחד מהם פתר צרכים ספציפיים בקהילת ה-JavaScript.

המעבר הזה מתורם למנהיג מראה את החזון של ניק לתוכנה מעוצבת היטב שפותרת בעיות אמיתיות. על ידי ארגון חבילות קשורות תחת ארגוני GitHub ממוקדים, הוא בנה מערכות אקולוגיות של כלים שעובדות יחד תוך שמירה על מודולריות וגמישות עבור קהילת המפתחים הרחבה יותר.

## ארגוני GitHub שלנו: מערכות אקולוגיות של חדשנות {#our-github-organizations-ecosystems-of-innovation}

אנו מארגנים את עבודת הקוד הפתוח שלנו סביב ארגוני GitHub ממוקדים, כל אחד פותר צרכים ספציפיים ב-JavaScript. מבנה זה יוצר משפחות חבילות מלוכדות שעובדות היטב יחד תוך שמירה על מודולריות.

### בקתה: רישום מובנה עבור יישומים מודרניים {#cabin-structured-logging-for-modern-applications}

[ארגון בקתה](https://github.com/cabinjs) הוא הגרסה שלנו לרישום אפליקציות פשוט וחזק. חבילת [`cabin`](https://github.com/cabinjs/cabin) הראשית כוללת כמעט 900 כוכבים ב-GitHub ומעל 100,000 הורדות שבועיות\[^1]. Cabin מספק רישום מובנה שעובד עם שירותים פופולריים כמו Sentry, LogDNA ו-Papertrail.

מה שמייחד את Cabin הוא מערכת ה-API והתוספים המתוחכמת שלה. חבילות תמיכה כמו [`axe`](https://github.com/cabinjs/axe) עבור תוכנת ביניים Express ו-[`parse-request`](https://github.com/cabinjs/parse-request) עבור ניתוח בקשות HTTP מראות על המחויבות שלנו לפתרונות מלאים ולא כלים מבודדים.

חבילת [`bson-objectid`](https://github.com/cabinjs/bson-objectid) ראויה לאזכור מיוחד, עם למעלה מ-1.7 מיליון הורדות תוך חודשיים בלבד\[^2]. יישום קל זה של MongoDB ObjectID הפך למועדף עבור מפתחים הזקוקים למזהים ללא תלויות מלאות ב-MongoDB.

### סורק ספאם: מאבק בניצול לרעה של דוא"ל {#spam-scanner-fighting-email-abuse}

[ארגון סורק דואר זבל](https://github.com/spamscanner) מראה את המחויבות שלנו לפתרון בעיות אמיתיות. חבילת [`spamscanner`](https://github.com/spamscanner/spamscanner) העיקרית מספקת זיהוי מתקדם של דואר זבל בדוא"ל, אך חבילת [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) היא זו שזכתה לאימוץ מדהים.

עם למעלה מ-1.2 מיליון הורדות בחודשיים\[^3], `url-regex-safe` מתקן בעיות אבטחה קריטיות בביטויים רגולריים אחרים לזיהוי כתובות URL. חבילה זו מציגה את הגישה שלנו לקוד פתוח: מציאת בעיה נפוצה (במקרה זה, [RedoS](https://en.wikipedia.org/wiki/ReDoS) פגיעויות באימות כתובות URL), יצירת פתרון מוצק ותחזוקה מדוקדקת שלו.

### Bree: תזמון משימות מודרני עם שרשורי עובדים {#bree-modern-job-scheduling-with-worker-threads}

[ארגון ברי](https://github.com/breejs) הוא התשובה שלנו לאתגר נפוץ ב-Node.js: תזמון משימות אמין. חבילת [`bree`](https://github.com/breejs/bree) הראשית, עם למעלה מ-3,100 כוכבים ב-GitHub, מספקת מתזמן משימות מודרני המשתמש ב-workthreads של Node.js לביצועים ואמינות טובים יותר.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

מה מייחד את ברי מתזמנים אחרים כמו אג'נדה:

* **ללא תלויות חיצוניות**: בניגוד ל-Agenda, הדורשת MongoDB, Bree אינה דורשת Redis או MongoDB לניהול מצב העבודה.
* **הליכי עבודה**: Bree משתמשת בהליכי עבודה של Node.js עבור תהליכים בארגז חול, מה שמספק בידוד וביצועים טובים יותר.
* **API פשוט**: Bree מציעה שליטה מפורטת בפשטות, מה שמקל על יישום צרכי תזמון מורכבים.
* **תמיכה מובנית**: דברים כמו טעינה מחדש חיננית, עבודות cron, תאריכים וזמנים ידידותיים למשתמש כלולים כברירת מחדל.

ברי היא חלק מרכזי ב-[forwardemail.net](https://github.com/forwardemail/forwardemail.net), ומטפלת במשימות רקע קריטיות כמו עיבוד דוא"ל, ניקוי ותחזוקה מתוזמנת. השימוש ב-Bree ב-Forward Email מראה את המחויבות שלנו להשתמש בכלים שלנו בייצור, תוך הבטחה שהם עומדים בתקני אמינות גבוהים.

אנו משתמשים ומעריכים גם חבילות Worker Thread נהדרות אחרות כמו [פּוּל](https://github.com/piscinajs/piscina) ולקוחות HTTP כמו [אַחַד עָשָׂר](https://github.com/nodejs/undici). Piscina, כמו Bree, משתמש ב-Worker Threads של Node.js לעיבוד משימות יעיל. אנו מודים ל-[מתיו היל](https://github.com/mcollina), שמתחזק גם את undici וגם את piscina, על תרומתו העיקרית ל-Node.js. Matteo משמש בוועדת ההיגוי הטכנית של Node.js ושיפר מאוד את יכולות לקוח ה-HTTP ב-Node.js.

### העברת דוא"ל: תשתית דוא"ל בקוד פתוח {#forward-email-open-source-email-infrastructure}

הפרויקט השאפתני ביותר שלנו הוא [העברת דוא"ל](https://github.com/forwardemail), שירות דוא"ל בקוד פתוח המספק שירותי העברת דוא"ל, אחסון ו-API. למאגר הראשי יש מעל 1,100 כוכבי GitHub\[^4], מה שמראה הערכה קהילתית לחלופה זו לשירותי דוא"ל קנייניים.

חבילת [`preview-email`](https://github.com/forwardemail/preview-email) של ארגון זה, עם למעלה מ-2.5 מיליון הורדות תוך חודשיים, הפכה לכלי חיוני עבור מפתחים שעובדים עם תבניות דוא"ל. על ידי מתן דרך פשוטה לתצוגה מקדימה של דוא"ל במהלך הפיתוח, היא פותרת נקודת כאב נפוצה בבניית יישומים התומכים בדוא"ל.

### Lad: כלי עזר וכלים חיוניים של Koa {#lad-essential-koa-utilities-and-tools}

ה-[ארגון בחור](https://github.com/ladjs) מספק אוסף של כלי עזר וכלים חיוניים המתמקדים בעיקר בשיפור המערכת האקולוגית של מסגרת Koa. חבילות אלו פותרות אתגרים נפוצים בפיתוח אתרים ומתוכננות לעבוד בצורה חלקה יחד תוך שמירה על שימושיות באופן עצמאי.

#### koa-better-error-handler: טיפול משופר בשגיאות עבור Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) מציע פתרון טוב יותר לטיפול בשגיאות עבור יישומי Koa. עם מעל 50 כוכבים ב-GitHub, חבילה זו מאפשרת ל-`ctx.throw` לייצר הודעות שגיאה ידידותיות למשתמש, תוך טיפול במספר מגבלות של מטפל השגיאות המובנה של Koa:

* מזהה ומטפל כראוי בשגיאות DNS של Node.js, שגיאות Mongoose ושגיאות Redis
* משתמש ב-[בּוּם](https://github.com/hapijs/boom) ליצירת תגובות שגיאה עקביות ומעוצבות היטב
* שומר על כותרות (בניגוד למטפל המובנה של Koa)
* שומר על קודי סטטוס מתאימים במקום להגדיר כברירת מחדל ל-500
* תומך בהודעות flash ובשימור session
* מספק רשימות שגיאות HTML עבור שגיאות אימות
* תומך בסוגי תגובות מרובים (HTML, JSON וטקסט רגיל)

חבילה זו בעלת ערך רב במיוחד כאשר משתמשים בה לצד [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) לניהול מקיף של שגיאות ביישומי Koa.

#### דרכון: אימות עבור Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) מרחיב את תוכנת הביניים הפופולרית לאימות Passport.js עם שיפורים ספציפיים עבור יישומי אינטרנט מודרניים. חבילה זו תומכת באסטרטגיות אימות מרובות ישירות מהקופסה:

* אימות מקומי באמצעות דוא"ל
* כניסה באמצעות Apple
* אימות GitHub
* אימות Google
* אימות סיסמה חד פעמית (OTP)

החבילה ניתנת להתאמה אישית רבה, ומאפשרת למפתחים להתאים את שמות השדות והביטויים כך שיתאימו לדרישות האפליקציה שלהם. הוא תוכנן להשתלב בצורה חלקה עם Mongoose לניהול משתמשים, מה שהופך אותו לפתרון אידיאלי עבור יישומים מבוססי קואה הזקוקים לאימות חזקה.

#### חינני: כיבוי אלגנטי של אפליקציה {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) פותר את האתגר הקריטי של סגירה חלקה של יישומי Node.js. עם למעלה מ-70 כוכבים ב-GitHub, חבילה זו מבטיחה שהאפליקציה שלך תוכל להסתיים בצורה חלקה מבלי לאבד נתונים או להשאיר חיבורים תקועים. התכונות העיקריות כוללות:

* תמיכה בסגירה חלקה של שרתי HTTP (Express/Koa/Fastify)
* כיבוי נקי של חיבורי מסד נתונים (MongoDB/Mongoose)
* סגירה תקינה של לקוחות Redis
* טיפול במתזמני משימות של Bree
* תמיכה במטפלי כיבוי מותאמים אישית
* הגדרות פסק זמן ניתנות להגדרה
* שילוב עם מערכות רישום

חבילה זו חיונית עבור יישומי ייצור שבהם כיבויים בלתי צפויים עלולים להוביל לאובדן נתונים או פגיעה. על ידי יישום נהלי כיבוי נכונים, `@ladjs/graceful` מסייע להבטיח את האמינות והיציבות של היישום שלך.

### זמן פעילות: ניטור זמן פעילות בקוד פתוח {#upptime-open-source-uptime-monitoring}

ה-[ארגון Uptime](https://github.com/upptime) מייצג את מחויבותנו לניטור שקוף וקוד פתוח. מאגר [`upptime`](https://github.com/upptime/upptime) הראשי מכיל מעל 13,000 כוכבי GitHub, מה שהופך אותו לאחד הפרויקטים הפופולריים ביותר שאנו תורמים להם. Uptime מספק ניטור זמן פעולה ודף סטטוס המופעלים על ידי GitHub, הפועל לחלוטין ללא שרת.

אנו משתמשים ב-Uptime עבור דף הסטטוס שלנו בכתובת <https://status.forwardemail.net> עם קוד המקור הזמין בכתובת <https://github.com/forwardemail/status.forwardemail.net>.

מה שמייחד את Upptime הוא הארכיטקטורה שלו:

* **קוד פתוח 100%**: כל רכיב הוא קוד פתוח לחלוטין וניתן להתאמה אישית.
* **מופעל על ידי GitHub**: ממנף פעולות, בעיות ודפים של GitHub לפתרון ניטור ללא שרת.
* **אין צורך בשרת**: בניגוד לכלי ניטור מסורתיים, Uptime אינו דורש ממך להפעיל או לתחזק שרת.
* **דף סטטוס אוטומטי**: יוצר דף סטטוס יפהפה שניתן לארח בדפי GitHub.
* **התראות עוצמתיות**: משתלב עם ערוצי התראות שונים, כולל דוא"ל, SMS ו-Slack.

כדי לשפר את חוויית המשתמשים שלנו, שילבנו את [@octokit/core](https://github.com/octokit/core.js/) בבסיס הקוד של forwardemail.net כדי להציג עדכוני סטטוס ואירועים בזמן אמת ישירות באתר האינטרנט שלנו. שילוב זה מספק שקיפות ברורה למשתמשים שלנו במקרה של בעיות בכל המערכות שלנו (אתר אינטרנט, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree וכו') עם התראות מיידיות, שינויים בסמלי תג, צבעי אזהרה ועוד.

ספריית @octokit/core מאפשרת לנו להביא נתונים בזמן אמת ממאגר Upptime GitHub שלנו, לעבד אותם ולהציג אותם בצורה ידידותית למשתמש. כאשר לשירות כלשהו יש הפסקה או ביצועים גרועים, המשתמשים מקבלים הודעה מיידית באמצעות מחוונים חזותיים מבלי לעזוב את האפליקציה הראשית. שילוב חלק זה מבטיח שלמשתמשים שלנו תמיד יהיה מידע עדכני לגבי מצב המערכת שלנו, מה שמגביר את השקיפות והאמון.

Upptime אומצה על ידי מאות ארגונים המחפשים דרך שקופה ואמינה לנטר את השירותים שלהם ולתקשר את הסטטוס למשתמשים. הצלחת הפרויקט מראה את הכוח של בניית כלים הממנפים תשתית קיימת (במקרה זה, GitHub) כדי לפתור בעיות נפוצות בדרכים חדשות.

## התרומות שלנו לאקוסיסטם של דוא"ל המשך {#our-contributions-to-the-forward-email-ecosystem}

בעוד שחבילות הקוד הפתוח שלנו משמשות מפתחים ברחבי העולם, הן גם מהוות את הבסיס לשירות Forward Email שלנו. תפקיד כפול זה - הן כיוצרים והן כמשתמשים בכלים אלה - נותן לנו פרספקטיבה ייחודית על היישום שלהם בעולם האמיתי ומניע שיפור מתמיד.

### מחבילות לייצור {#from-packages-to-production}

המסע מחבילות בודדות למערכת ייצור מגובשת כרוך באינטגרציה והרחבה מוקפדים. עבור העברת דוא"ל, תהליך זה כולל:

* **הרחבות מותאמות אישית**: בניית הרחבות ספציפיות להעברת דוא"ל לחבילות הקוד הפתוח שלנו, העונות על הדרישות הייחודיות שלנו.
* **דפוסי אינטגרציה**: פיתוח דפוסים לאופן שבו חבילות אלו מקיימות אינטראקציה בסביבת ייצור.
* **אופטימיזציות ביצועים**: זיהוי וטיפול בצווארי בקבוק בביצועים שצצים רק בקנה מידה גדול.
* **הקשחת אבטחה**: הוספת שכבות אבטחה נוספות ספציפיות לטיפול בדוא"ל והגנה על נתוני משתמשים.

עבודה זו מייצגת אלפי שעות של פיתוח מעבר לחבילות הליבה עצמן, וכתוצאה מכך שירות דוא"ל חזק ומאובטח הממנף את מיטב תרומות הקוד הפתוח שלנו.

### לולאת המשוב {#the-feedback-loop}

אולי ההיבט החשוב ביותר בשימוש בחבילות שלנו בייצור הוא לולאת המשוב שהיא יוצרת. כאשר אנו נתקלים במגבלות או מקרי קצה ב-Forward Email, אנו לא רק מתקנים אותם באופן מקומי - אנו משפרים את החבילות הבסיסיות, ומועילים גם לשירות שלנו וגם לקהילה הרחבה יותר.

גישה זו הובילה למספר שיפורים:

* **כיבוי חינני של Bree**: הצורך של העברת דוא"ל בפריסות ללא זמן השבתה הוביל ליכולות כיבוי חינניות משופרות ב-Bree.
* **זיהוי תבניות של Spam Scanner**: דפוסי ספאם אמיתיים שנתקלו בהעברת דוא"ל השפיעו על אלגוריתמי הזיהוי של Spam Scanner.
* **אופטימיזציות ביצועים של Cabin**: רישום בנפח גבוה בייצור חשף הזדמנויות אופטימיזציה ב-Cabin המועילות לכל המשתמשים.

על ידי שמירה על מעגל סגולה זה בין עבודת הקוד הפתוח שלנו לבין שירות הייצור, אנו מבטיחים שהחבילות שלנו יישארו פתרונות מעשיים שנבדקו בקרב ולא יישומים תיאורטיים.

## עקרונות הליבה של העברת דוא"ל: יסוד למצוינות {#forward-emails-core-principles-a-foundation-for-excellence}

העברת דוא"ל מתוכננת על פי קבוצת עקרונות ליבה המנחים את כל החלטות הפיתוח שלנו. עקרונות אלה, המפורטים ב-[אֲתַר אִינטֶרנֶט](/blog/docs/best-quantum-safe-encrypted-email-service#principles) שלנו, מבטיחים שהשירות שלנו יישאר ידידותי למפתחים, מאובטח וממוקד בפרטיות המשתמש.

### תמיד ידידותי למפתחים, ממוקד אבטחה ושקוף {#always-developer-friendly-security-focused-and-transparent}

העיקרון הראשון והעיקרי שלנו הוא ליצור תוכנה ידידותית למפתחים תוך שמירה על הסטנדרטים הגבוהים ביותר של אבטחה ופרטיות. אנו מאמינים שמצוינות טכנית לעולם לא צריכה לבוא על חשבון השימושיות, וששקיפות בונה אמון עם הקהילה שלנו.

עיקרון זה מציג בתיעוד המפורט שלנו, הודעות שגיאה ברורות ותקשורת פתוחה לגבי הצלחות וגם אתגרים. על ידי הפיכת כל בסיס הקוד שלנו לקוד פתוח, אנו מזמינים בדיקה ושיתוף פעולה, ומחזקים הן את התוכנה שלנו והן את המערכת האקולוגית הרחבה יותר.

### הקפדה על עקרונות פיתוח תוכנה שנבדקו בזמן {#adherence-to-time-tested-software-development-principles}

אנו עוקבים אחר מספר עקרונות פיתוח תוכנה מבוססים שהוכיחו את ערכם במשך עשרות שנים:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: הפרדת בעיות באמצעות תבנית Model-View-Controller
* **[פילוסופיית יוניקס](https://en.wikipedia.org/wiki/Unix_philosophy)**: יצירת רכיבים מודולריים שעושים דבר אחד היטב
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: שמירה על פשטות וישירה
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: אל תחזור על עצמך, קידום שימוש חוזר בקוד
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: לא תצטרך את זה, הימנעות מאופטימיזציה מוקדמת
* **[שנים עשר גורמים](https://12factor.net/)**: ביצוע שיטות עבודה מומלצות לבניית יישומים מודרניים וניתנים להרחבה
* **[התער של אוקאם](https://en.wikipedia.org/wiki/Occam%27s_razor)**: בחירת הפתרון הפשוט ביותר שעונה על הדרישות
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: שימוש נרחב במוצרים שלנו

העקרונות הללו אינם רק מושגים תיאורטיים - הם מוטמעים בפרקטיקות ההתפתחות היומיומיות שלנו. לדוגמה, הדבקות שלנו בפילוסופיית יוניקס ניכרת באופן שבו בנינו את חבילות ה-npm שלנו: מודולים קטנים וממוקדים שניתן לחבר יחד כדי לפתור בעיות מורכבות.

### מתמקד במפתחים גרועים ועם גישה מהירה ל-bootstrap {#targeting-the-scrappy-bootstrapped-developer}

אנו מכוונים במיוחד למפתחים חסרי ניסיון, בעלי ניסיון בוטסטראפ ו-[ראמן-רווחי](https://www.paulgraham.com/ramenprofitable.html). המיקוד הזה מעצב הכל, החל ממודל התמחור שלנו ועד להחלטות הטכניות שלנו. אנו מבינים את האתגרים של בניית מוצרים עם משאבים מוגבלים, כי היינו שם בעצמנו.

עיקרון זה חשוב במיוחד באופן שבו אנו ניגשים לקוד פתוח. אנו יוצרים ומתחזקים חבילות הפותרות בעיות אמיתיות עבור מפתחים ללא תקציבים ארגוניים, מה שהופך כלים רבי עוצמה לנגישים לכולם ללא קשר למשאבים שלהם.

### עקרונות בפועל: בסיס קוד דוא"ל המשך {#principles-in-practice-the-forward-email-codebase}

עקרונות אלה גלויים בבירור בבסיס הקוד של העבר דוא"ל. הקובץ package.json שלנו חושף מבחר מתחשב של תלות, שכל אחת מהן נבחרה להתיישר עם ערכי הליבה שלנו:

* חבילות ממוקדות אבטחה כמו `mailauth` לאימות דוא"ל
* כלים ידידותיים למפתחים כמו `preview-email` לאיתור שגיאות קל יותר
* רכיבים מודולריים כמו כלי השירות השונים `p-*` מבית Sindre Sorhus

על ידי הקפדה על עקרונות אלה בעקביות לאורך זמן, בנינו שירות שמפתחים יכולים לסמוך עליו עם תשתית הדוא"ל שלהם - מאובטח, אמין ומתאים לערכי קהילת הקוד הפתוח.

### פרטיות על פי עיצוב {#privacy-by-design}

פרטיות היא לא מחשבה שלאחר מכן או תכונה שיווקית עבור העבר דוא"ל - זה עיקרון עיצובי בסיסי שמודיע לכל היבט של השירות והקוד שלנו:

* **הצפנה ללא גישה**: יישמנו מערכות שמונעות מאיתנו מבחינה טכנית לקרוא את האימיילים של המשתמשים.
* **איסוף נתונים מינימלי**: אנו אוספים רק את הנתונים הדרושים למתן השירות שלנו, לא יותר.
* **מדיניות שקופה**: מדיניות הפרטיות שלנו כתובה בשפה ברורה ומובנת ללא ז'רגון משפטי.
* **אימות קוד פתוח**: בסיס הקוד הפתוח שלנו מאפשר לחוקרי אבטחה לאמת את טענות הפרטיות שלנו.

מחויבות זו משתרעת על חבילות הקוד הפתוח שלנו, שתוכננו עם שיטות עבודה מומלצות לאבטחה ופרטיות המובנות מהיסוד.

### קוד פתוח בר-קיימא {#sustainable-open-source}

אנו מאמינים שתוכנת קוד פתוח זקוקה למודלים ברי קיימא כדי לשגשג לטווח ארוך. הגישה שלנו כוללת:

* **תמיכה מסחרית**: הצעת תמיכה ושירותים פרימיום סביב כלי הקוד הפתוח שלנו.
* **רישוי מאוזן**: שימוש ברישיונות המגנים על חירויות המשתמש ועל קיימות הפרויקט.
* **מעורבות קהילתית**: מעורבות פעילה עם תורמים לבניית קהילה תומכת.
* **מפות דרכים שקופות**: שיתוף תוכניות הפיתוח שלנו כדי לאפשר למשתמשים לתכנן בהתאם.

על ידי התמקדות בקיימות, אנו מבטיחים שתרומת הקוד הפתוח שלנו תוכל להמשיך לצמוח ולהשתפר לאורך זמן במקום להזנחה.

## המספרים לא משקרים: סטטיסטיקות ההורדה המדהימות שלנו של npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

כשאנחנו מדברים על ההשפעה של תוכנת קוד פתוח, סטטיסטיקות הורדות מספקות מידה מוחשית של אימוץ ואמון. רבות מהחבילות שאנו עוזרים לתחזק הגיעו לקנה מידה שמעט פרויקטי קוד פתוח משיגים אי פעם, עם הורדות משולבות של מיליארדים.

![חבילות npm מובילות לפי הורדות](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### מבט ממעוף הציפור על ההשפעה שלנו {#a-birds-eye-view-of-our-impact}

רק בתקופה של חודשיים מפברואר עד מרץ 2025, החבילות המובילות שאנו תורמים להן ועוזרות לשמור על מספרי הורדות מדהימים:

* **[סוכן-על](https://www.npmjs.com/package/superagent)**: 84,575,829 הורדות\[^7] (נוצר במקור על ידי TJ Holowaychuk)
* **[מבחן סופר](https://www.npmjs.com/package/supertest)**: 76,432,591 הורדות\[^8] (נוצר במקור על ידי TJ Holowaychuk)
* **[גַם](https://www.npmjs.com/package/koa)**: 28,539,295 הורדות\[^34] (נוצר במקור על ידי TJ Holowaychuk)
* **[@koa/נתב](https://www.npmjs.com/package/@koa/router)**: 11,007,327 הורדות\[^35]
* **[קואה-נתב](https://www.npmjs.com/package/koa-router)**: 3,498,918 הורדות\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 הורדות\[^37]
* **[תצוגה מקדימה-אימייל](https://www.npmjs.com/package/preview-email)**: 2,500,000 הורדות\[^9]
* **[תָא](https://www.npmjs.com/package/cabin)**: 1,800,000 הורדות\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 הורדות\[^38]
* **[תבניות דוא"ל](https://www.npmjs.com/package/email-templates)**: 1,128,139 הורדות\[^39]
* **[לקבל-נתיבים](https://www.npmjs.com/package/get-paths)**: 1,124,686 הורדות\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 הורדות\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 הורדות\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 הורדות\[^42]
* **[סורק ספאם](https://www.npmjs.com/package/spamscanner)**: 145,000 הורדות\[^12]
* **[ברי](https://www.npmjs.com/package/bree)**: 24,270 הורדות\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

אלה לא רק מספרים מרשימים - הם מייצגים מפתחים אמיתיים הפותרים בעיות אמיתיות עם קוד שאנו עוזרים לתחזק. כל הורדה היא מופע שבו החבילות הללו עזרו למישהו לבנות משהו משמעותי, מפרויקטים תחביבים ועד יישומים ארגוניים המשמשים מיליונים.

![קטגוריות חבילות חלוקה](/img/art/category_pie_chart.svg)

### השפעה יומית בקנה מידה גדול {#daily-impact-at-scale}

דפוסי ההורדה היומיים מגלים שימוש עקבי בנפח גבוה, עם שיאים המגיעים למיליוני הורדות ביום\[^13]. עקביות זו מעידה על היציבות והאמינות של חבילות אלו - מפתחים לא רק מנסים אותן; הם משלבים אותן בזרימות העבודה העיקריות שלהם ותלויים בהן יום אחר יום.

דפוסי הורדה שבועיים מראים מספרים מרשימים אף יותר, הנעים באופן עקבי סביב עשרות מיליוני הורדות בשבוע\[^14]. זה מייצג טביעת רגל עצומה במערכת האקולוגית של JavaScript, כאשר חבילות אלו פועלות בסביבות ייצור ברחבי העולם.

### מעבר למספרים הגולמיים {#beyond-the-raw-numbers}

בעוד שסטטיסטיקת ההורדות מרשימה בפני עצמה, היא מספרת סיפור עמוק יותר על האמון שהקהילה נותנת בחבילות הללו. תחזוקת חבילות בקנה מידה זה דורשת מחויבות בלתי מעורערת ל:

* **תאימות לאחור**: יש לשקול בקפידה שינויים כדי למנוע פגיעה ביישומים קיימים.
* **אבטחה**: עם מיליוני יישומים התלויים בחבילות אלו, פגיעויות אבטחה עלולות להיות בעלות השלכות מרחיקות לכת.
* **ביצועים**: בקנה מידה זה, אפילו שיפורי ביצועים קלים יכולים להביא לתועלת מצטברת משמעותית.
* **תיעוד**: תיעוד ברור ומקיף חיוני לחבילות המשמשות מפתחים מכל רמות הניסיון.

הגידול העקבי במספרי ההורדות לאורך זמן משקף את ההצלחה בעמידה בהתחייבויות אלו, בניית אמון עם קהילת המפתחים באמצעות חבילות אמינות ומתוחזקות היטב.

## תמיכה במערכת האקולוגית: חסויות הקוד הפתוח שלנו {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

מעבר לתרומות הישירות שלנו למערכת האקולוגית של JavaScript, אנו גאים לתת חסות לתורמים בולטים של Node.js שעבודתם מהווה את הבסיס ליישומים מודרניים רבים. החסויות שלנו כוללות:

### אנדריס ריינמן: חלוץ תשתית דוא"ל {#andris-reinman-email-infrastructure-pioneer}

[אנדריס ריינמן](https://github.com/andris9) הוא יוצר [Nodemailer](https://github.com/nodemailer/nodemailer), ספריית שליחת הדוא"ל הפופולרית ביותר עבור Node.js עם למעלה מ-14 מיליון הורדות שבועיות\[^15]. עבודתו משתרעת על רכיבי תשתית דוא"ל קריטיים אחרים כמו [שרת SMTP](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) ו-[ברווז בר](https://github.com/nodemailer/wildduck).

החסות שלנו מסייעת להבטיח את המשך התחזוקה והפיתוח של הכלים החיוניים הללו המחזקים תקשורת דוא"ל עבור אינספור יישומי Node.js, כולל שירות העברה דוא"ל משלנו.

### סינדרה סורהוס: גאון חבילות שירות {#sindre-sorhus-utility-package-mastermind}

[סינדר סורוס](https://github.com/sindresorhus) הוא אחד מתורמי הקוד הפתוח הפוריים ביותר במערכת האקולוגית של JavaScript, עם למעלה מ-1,000 חבילות npm על שמו. כלי השירות שלו כמו [p-map](https://github.com/sindresorhus/p-map), [ניסיון חוזר מראש](https://github.com/sindresorhus/p-retry) ו-[is-stream](https://github.com/sindresorhus/is-stream) הן אבני בניין בסיסיות המשמשות ברחבי מערכת האקולוגית של Node.js.

על ידי מתן חסות לעבודה של Sindre, אנו עוזרים לקיים את הפיתוח של כלי עזר קריטיים אלה שהופכים את פיתוח JavaScript ליעיל ואמין יותר.

חסויות אלו משקפות את המחויבות שלנו למערכת האקולוגית הרחבה יותר של קוד פתוח. אנו מכירים בכך שההצלחה שלנו בנויה על הבסיס שהונחו על ידי תורמים אלה ואחרים, ואנו מחויבים להבטיח את הקיימות של המערכת האקולוגית כולה.

## גילוי פגיעויות אבטחה במערכת האקולוגית של JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

המחויבות שלנו לקוד פתוח משתרעת מעבר לפיתוח תכונות וכוללת זיהוי וטיפול בפרצות אבטחה שעלולות להשפיע על מיליוני מפתחים. כמה מהתרומות המשמעותיות ביותר שלנו למערכת האקולוגית של JavaScript היו בתחום האבטחה.

### הצלת נתב Koa {#the-koa-router-rescue}

בפברואר 2019, ניק זיהה בעיה קריטית בתחזוקת חבילת koa-router הפופולרית. בזמן ש-[דיווח ב-Hacker News](https://news.ycombinator.com/item?id=19156707), החבילה ננטשה על ידי המתחזק המקורי שלה, מה שהותיר פגיעויות אבטחה ללא טיפול והקהילה ללא עדכונים.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

בתגובה, ניק יצר את [@koa/נתב](https://github.com/koajs/router) ועזר להתריע בפני הקהילה על המצב. מאז הוא מתחזק את החבילה הקריטית הזו, ומבטיח שלמשתמשי Koa יש פתרון ניתוב מאובטח ומתוחזק היטב.

### טיפול בפגיעויות של ReDoS {#addressing-redos-vulnerabilities}

בשנת 2020, ניק זיהה וטיפל בפגיעות קריטית של [מניעת שירות של ביטוי רגיל (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) בחבילת `url-regex` הנפוצה. פגיעות זו ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) עלולה לאפשר לתוקפים לגרום למניעת שירות על ידי מתן קלט בעל מבנה מיוחד שגרם לעקיבה לאחור קטסטרופלית בביטוי הרגולרי.

במקום פשוט לתקן את החבילה הקיימת, ניק יצר את [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), יישום שנכתב מחדש לחלוטין אשר מטפל בפגיעות תוך שמירה על תאימות עם ה-API המקורי. הוא גם פרסם [פוסט מקיף בבלוג](/blog/docs/url-regex-javascript-node-js) המסביר את הפגיעות וכיצד לצמצם אותה.

עבודה זו מראה את הגישה שלנו לאבטחה: לא רק תיקון בעיות אלא חינוך הקהילה ומתן חלופות חזקות המונעות בעיות דומות בעתיד.

### תומכים באבטחת Node.js ו-Chromium {#advocating-for-nodejs-and-chromium-security}

ניק היה פעיל גם בקידום שיפורי אבטחה במערכת האקולוגית הרחבה יותר. באוגוסט 2020, הוא זיהה בעיית אבטחה משמעותית ב-Node.js הקשורה לטיפול בכותרות HTTP, אשר דווחה ב-[המרשם](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

בעיה זו, שנבעה מתיקון ב-Chromium, עשויה לאפשר לתוקפים לעקוף אמצעי אבטחה. ההסברה של ניק עזרה להבטיח שהבעיה טופלה באופן מיידי, תוך הגנה על מיליוני יישומי Node.js מפני ניצול פוטנציאלי.

### אבטחת תשתית npm {#securing-npm-infrastructure}

מאוחר יותר באותו חודש, ניק זיהה בעיית אבטחה קריטית נוספת, הפעם בתשתית הדוא"ל של npm. כפי שדווח ב-[המרשם](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm לא יישמה כראוי את פרוטוקולי אימות הדוא"ל DMARC, SPF ו-DKIM, מה שאפשר לתוקפים לשלוח הודעות דיוג שנראו כאילו הגיעו מ-npm.

הדוח של ניק הוביל לשיפורים בעמדת אבטחת הדוא"ל של npm, והגן על מיליוני המפתחים המסתמכים על npm לניהול חבילות מפני התקפות דיוג פוטנציאליות.

## התרומות שלנו לאקוסיסטם של דוא"ל המשך {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email בנוי על מספר פרויקטים קריטיים בקוד פתוח, כולל Nodemailer, WildDuck ו-mailauth. הצוות שלנו תרם תרומה משמעותית לפרויקטים הללו, וסייע לזהות ולתקן בעיות עמוקות המשפיעות על משלוח דוא"ל ואבטחה.

### שיפור הפונקציונליות הליבה של Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) הוא עמוד השדרה של שליחת דוא"ל ב-Node.js, והתרומות שלנו עזרו להפוך אותו לחזק יותר:

* **שיפורים בשרת SMTP**: תיקנו באגים בניתוח, בעיות בטיפול בזרמים ובעיות תצורה של TLS ברכיב שרת ה-SMTP\[^16]\[^17].
* **שיפורים בניתוח דואר**: טיפלנו בשגיאות בפענוח רצף תווים וטיפלנו בבעיות בניתוח שעלולות לגרום לכשלים בעיבוד דואר אלקטרוני\[^18]\[^19].

תרומות אלו מבטיחות ש-Nodemailer יישאר בסיס אמין לעיבוד דוא"ל ביישומי Node.js, כולל העבר דוא"ל.

### קידום אימות דוא"ל עם Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) מספק פונקציונליות קריטית לאימות דוא"ל, והתרומות שלנו שיפרו משמעותית את יכולותיה:

* **שיפורי אימות DKIM**: גילינו ודיווחנו כי ל-X/Twitter היו בעיות במטמון DNS שגרמו לכשל DKIM עבור הודעות יוצאות, ודיווחנו על כך ב-Hacker One\[^20].
* **שיפורי DMARC ו-ARC**: תיקנו בעיות באימות DMARC ו-ARC שעלולות להוביל לתוצאות אימות שגויות\[^21]\[^22].
* **אופטימיזציות ביצועים**: תרמנו אופטימיזציות המשפרות את ביצועי תהליכי אימות הדוא"ל\[^23]\[^24]\[^25]\[^26].

שיפורים אלה עוזרים להבטיח שאימות הדוא"ל יהיה מדויק ואמין, ומגן על המשתמשים מפני התקפות דיוג וזיוף.

### שיפורי זמן פעילות של מפתחות {#key-upptime-enhancements}

התרומות שלנו ל-Uptime כוללות:

* **ניטור תעודות SSL**: הוספנו פונקציונליות לניטור תפוגת תעודות SSL, ומונע זמן השבתה בלתי צפוי עקב תעודות שפג תוקפן\[^27].
* **תמיכה במספר מספרי SMS**: יישמנו תמיכה בהתראות למספר חברי צוות באמצעות SMS כאשר מתרחשות תקריות, מה ששיפור זמני התגובה\[^28].
* **תיקוני בדיקת IPv6**: תיקנו בעיות בבדיקות קישוריות IPv6, מה שמבטיח ניטור מדויק יותר בסביבות רשת מודרניות\[^29].
* **תמיכה במצב כהה/בהיר**: הוספנו תמיכה בערכות נושא כדי לשפר את חוויית המשתמש של דפי סטטוס\[^31].
* **תמיכה טובה יותר ב-TCP-Ping**: שיפרנו את פונקציונליות ה-TCP ping כדי לספק בדיקות חיבור אמינות יותר\[^32].

שיפורים אלה לא רק מועילים לניטור הסטטוס של Forward Email אלא זמינים לכל הקהילה של משתמשי Upptime, מה שממחיש את המחויבות שלנו לשיפור הכלים שאנו תלויים בהם.

## הדבק שמחבר את הכל יחד: קוד מותאם אישית בקנה מידה גדול {#the-glue-that-holds-it-all-together-custom-code-at-scale}

בעוד שחבילות ה-npm שלנו והתרומות שלנו לפרויקטים קיימים הן משמעותיות, דווקא הקוד המותאם אישית שמשלב את הרכיבים הללו הוא שמציג באמת את המומחיות הטכנית שלנו. בסיס הקוד של Forward Email מייצג עשור של מאמצי פיתוח, עוד משנת 2017, כאשר הפרויקט החל כ-[העברת דואר אלקטרוני בחינם](https://github.com/forwardemail/free-email-forwarding) לפני שאוחד לתוך monorepo.

### מאמץ פיתוח אדיר {#a-massive-development-effort}

קנה המידה של קוד האינטגרציה המותאם אישית הזה מרשים:

* **סה"כ תרומות**: מעל 3,217 קומיטים
* **גודל בסיס הקוד**: מעל 421,545 שורות קוד בקבצי JavaScript, Pug, CSS ו-JSON\[^33]

זה מייצג אלפי שעות של עבודת פיתוח, הפעלות באגים ואופטימיזציות של ביצועים. זה "הרוטב הסודי" שהופך חבילות בודדות לשירות מגובש ואמין המשמש אלפי לקוחות מדי יום.

### שילוב תלויות ליבה {#core-dependencies-integration}

בסיס הקוד של Forward Email משלב מספר תלות במכלול חלק:

* **עיבוד דוא"ל**: משלב Nodemailer לשליחה, שרת SMTP לקבלה ו-Mailparser לניתוח
* **אימות**: משתמש ב-Mailauth לאימות DKIM, SPF, DMARC ו-ARC
* **רזולוציית DNS**: ממנף את Tangerine ל-DNS-over-HTTPS עם אחסון מטמון גלובלי
* **חיבור MX**: משתמש ב-mx-connect עם שילוב Tangerine לחיבורי שרת דואר אמינים
* **תזמון משימות**: משתמש ב-Bree לעיבוד משימות ברקע אמין עם הליכי עבודה
* **תבניות**: משתמש בתבניות דוא"ל לשימוש חוזר בגיליונות סגנונות מהאתר בתקשורת עם לקוחות
* **אחסון דוא"ל**: מיישם תיבות דואר של SQLite מוצפנות בנפרד באמצעות better-sqlite3-multiple-ciphers עם הצפנת ChaCha20-Poly1305 לפרטיות בטוחה קוונטית, תוך הבטחת בידוד מוחלט בין משתמשים וגישה לתיבת הדואר שלו בלבד

כל אחת מהאינטגרציות הללו דורשת שיקול זהיר של מקרי קצה, השלכות ביצועים ודאגות אבטחה. התוצאה היא מערכת חזקה המטפלת במיליוני עסקאות דוא"ל בצורה מהימנה. הטמעת SQLite שלנו ממנפת גם את msgpackr להסדרה בינארית יעילה ו-WebSockets (דרך ws) לעדכוני סטטוס בזמן אמת על פני התשתית שלנו.

### תשתית DNS עם Tangerine ו-mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

מרכיב קריטי בתשתית Forward Email הוא מערכת רזולוציית ה-DNS שלנו, הבנויה סביב שתי חבילות מפתח:

* **[מַנדָרִינָה](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: יישום Node.js DNS-over-HTTPS שלנו מספק תחליף מהיר לפתרון ה-DNS הסטנדרטי, עם ניסיונות חוזרים מובנים, פסקי זמן, סיבוב שרת חכם ותמיכה במטמון.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: חבילה זו יוצרת חיבורי TCP לשרתי MX, תוך לקיחת דומיין או כתובת דוא"ל יעד, זיהוי שרתי MX מתאימים ומתחברות אליהם לפי סדר עדיפות.

שילבנו את Tangerine עם mx-connect דרך [בקשת משיכה #4](https://github.com/zone-eu/mx-connect/pull/4), המבטיחה DNS בשכבת האפליקציה על פני בקשות HTTP בכל רחבי Forward Email. זה מספק אחסון במטמון גלובלי עבור DNS בקנה מידה גדול עם עקביות של 1:1 בכל אזור, אפליקציה או תהליך - קריטי למסירת דוא"ל אמינה במערכת מבוזרת.

## השפעה ארגונית: מקוד פתוח לפתרונות קריטיים למשימה {#enterprise-impact-from-open-source-to-mission-critical-solutions}

שיאו של המסע שלנו בן עשור בפיתוח קוד פתוח אפשר ל-Forward Email לשרת לא רק מפתחים בודדים אלא גם ארגונים גדולים ומוסדות חינוך המהווים את עמוד השדרה של תנועת הקוד הפתוח עצמה.

### מקרי בוחן בתשתית דוא"ל קריטית למשימה {#case-studies-in-mission-critical-email-infrastructure}

המחויבות שלנו לאמינות, פרטיות ועקרונות קוד פתוח הפכה את Forward Email לבחירה המהימנה עבור ארגונים עם דרישות דוא"ל תובעניות:

* **מוסדות חינוך**: כפי שמפורט ב[מחקר מקרה של העברת דוא"ל לבוגרים] שלנו](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), אוניברסיטאות גדולות מסתמכות על התשתית שלנו כדי לשמור על קשרים לכל החיים עם מאות אלפי בוגרים באמצעות שירותי העברת דוא"ל אמינים.

* **פתרונות לינוקס ארגוניים**: ה-[תיאור מקרה קנוני של אובונטו אימייל ארגוני](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) מדגים כיצד גישת הקוד הפתוח שלנו מתיישבת בצורה מושלמת עם הצרכים של ספקי לינוקס ארגוניים, ומציעה להם את השקיפות והשליטה הדרושות להם.

**יסודות קוד פתוח**: אולי האישור הגדול ביותר הוא השותפות שלנו עם קרן לינוקס, כפי שתועד ב-[תיאור מקרה של קרן לינוקס באימייל לארגונים](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), שם השירות שלנו מניע את התקשורת עבור הארגון שמנהל את פיתוח לינוקס.

יש סימטריה יפה כיצד חבילות הקוד הפתוח שלנו, המתוחזקות בקפידה לאורך שנים רבות, אפשרו לנו לבנות שירות דואר אלקטרוני שתומך כעת בקהילות ובארגונים שדוגלים בתוכנת קוד פתוח. מסע מעגל מלא זה - מתרומת חבילות בודדות ועד להפעלת תשתית דוא"ל ברמה ארגונית עבור מובילי קוד פתוח - מייצג את האימות האולטימטיבי של הגישה שלנו לפיתוח תוכנה.

## עשור של קוד פתוח: מבט קדימה {#a-decade-of-open-source-looking-forward}

כשאנחנו מסתכלים אחורה על עשור של תרומות בקוד פתוח וקדימה לעשר השנים הבאות, אנחנו מלאים בהכרת תודה לקהילה שתמכה בעבודתנו ובהתרגשות לקראת מה שיבוא.

המסע שלנו מתורמים חבילות בודדות לתחזוקה של תשתית דוא"ל מקיפה המשמשת ארגונים גדולים וקרנות קוד פתוח היה מדהים. זוהי עדות לכוחו של פיתוח קוד פתוח ולהשפעה שיכולה להיות לתוכנה מתחשבת ומתוחזקת היטב על המערכת האקולוגית הרחבה יותר.

בשנים הקרובות, אנו מחויבים ל:

* **המשך תחזוקה ושיפור של החבילות הקיימות שלנו**, תוך הבטחה שהן יישארו כלים אמינים עבור מפתחים ברחבי העולם.
* **הרחבת תרומותינו לפרויקטים של תשתית קריטית**, במיוחד בתחומי הדוא"ל והאבטחה.
* **שיפור יכולות העברת דוא"ל** תוך שמירה על מחויבותנו לפרטיות, אבטחה ושקיפות.
* **תמיכה בדור הבא של תורמים בקוד פתוח** באמצעות חונכות, חסות ומעורבות קהילתית.

אנו מאמינים שהעתיד של פיתוח תוכנה פתוח, שיתופי ובנוי על בסיס של אמון. על ידי המשך תרומה של חבילות איכותיות וממוקדות אבטחה למערכת האקולוגית של JavaScript, אנו מקווים לקחת חלק קטן בבניית העתיד הזה.

תודה לכל מי שהשתמש בחבילות שלנו, תרם לפרויקטים שלנו, דיווח על בעיות או פשוט הפיץ את הבשורה על העבודה שלנו. תמיכתכם איפשרה את העשור הזה של ההשפעה, ואנו נרגשים לראות מה נוכל להשיג יחד בעשר השנים הקרובות.

\[^1]: סטטיסטיקות הורדה של npm עבור cabin, אפריל 2025
\[^2]: סטטיסטיקות הורדה של npm עבור bson-objectid, פברואר-מרץ 2025
\[^3]: סטטיסטיקות הורדה של npm עבור url-regex-safe, אפריל 2025
\[^4]: ספירת כוכבים ב-GitHub עבור forwardemail/forwardemail.net נכון לאפריל 2025
\[^5]: סטטיסטיקות הורדה של npm עבור preview-email, אפריל 2025
\[^7]: סטטיסטיקות הורדה של npm עבור superagent, פברואר-מרץ 2025
\[^8]: סטטיסטיקות הורדה של npm עבור supertest, פברואר-מרץ 2025
\[^9]: סטטיסטיקות הורדה של npm עבור preview-email, פברואר-מרץ 2025
\[^10]: סטטיסטיקות הורדה של npm עבור cabin, פברואר-מרץ 2025
\[^11]: סטטיסטיקות הורדה של npm עבור url-regex-safe, פברואר-מרץ 2025
\[^12]: סטטיסטיקות הורדה של npm עבור spamscanner, פברואר-מרץ 2025
\[^13]: דפוסי הורדה יומיים מסטטיסטיקות npm, אפריל 2025
\[^14]: דפוסי הורדה שבועיים מסטטיסטיקות npm, אפריל 2025
\[^15]: סטטיסטיקות הורדה של npm עבור nodemailer, אפריל 2025
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
\[^30]: סטטיסטיקות הורדה npm עבור bree, פברואר-מרץ 2025
\[^31]: מבוסס על בקשות משיכה של GitHub ל-Upptime
\[^32]: מבוסס על בקשות משיכה של GitHub ל-Upptime
\[^34]: סטטיסטיקות הורדה npm עבור koa, פברואר-מרץ 2025
\[^35]: סטטיסטיקות הורדה של npm עבור @koa/router, פברואר-מרץ 2025
\[^36]: סטטיסטיקות הורדה של npm עבור koa-router, פברואר-מרץ 2025
\[^37]: סטטיסטיקות הורדה של npm עבור url-regex, פברואר-מרץ 2025
\[^38]: סטטיסטיקות הורדה של npm עבור @breejs/later, פברואר-מרץ 2025
\[^39]: סטטיסטיקות הורדה של npm עבור email-templates, פברואר-מרץ 2025
\[^40]: סטטיסטיקות הורדה של npm עבור get-paths, פברואר-מרץ 2025
\[^41]: סטטיסטיקות הורדה של npm עבור dotenv-parse-variables, פברואר-מרץ 2025
\[^42]: סטטיסטיקות הורדה של npm עבור @koa/multer, פברואר-מרץ 2025