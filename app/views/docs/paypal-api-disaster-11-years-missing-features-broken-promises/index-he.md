# אסון ה-API בן 11 השנים של PayPal: איך בנינו פתרונות עקיפים בזמן שהם התעלמו מהמפתחים {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **הצלחה! PayPal סוף סוף הוסיפה את נקודת הקצה `GET /v1/billing/subscriptions`.**
>
> לאחר שפרסמנו פוסט זה ושלחנו אותו בדוא"ל להנהלה הבכירה של PayPal, הצוותים שלהם יישמו את נקודת הקצה הנחוצה לרשימת המנויים. השינוי הופיע במועד כלשהו בין [25 ביוני 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) ל- [9 ביולי 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> עם זאת, בסגנון האופייני של PayPal, הם מעולם לא הודיעו לנו. גילינו את העדכון הזה בעצמנו בדצמבר 2025, חודשים לאחר שהפיצ'ר שוחרר בשקט.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="איור אסון API של PayPal" class="rounded-lg" />

<p class="lead mt-3">ב-Forward Email, אנו מתמודדים עם ה-API השבור של PayPal כבר יותר מעשור. מה שהתחיל כמתחים קטנים הפך לאסון שלם שדרש מאיתנו לבנות פתרונות עקיפים משלנו, לחסום את תבניות הפישינג שלהם, ולבסוף לעצור את כל התשלומים דרך PayPal במהלך מעבר חשבון קריטי.</p>
<p class="lead mt-3">זו הסיפור של 11 שנים שבהן PayPal התעלמה מצרכים בסיסיים של מפתחים בזמן שניסינו הכל כדי לגרום לפלטפורמה שלהם לעבוד.</p>


## תוכן העניינים {#table-of-contents}

* [החלק החסר: אין דרך לרשום מנויים](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: הבעיה מתגלה](#2014-2017-the-problem-emerges)
* [2020: נתנו להם משוב נרחב](#2020-we-give-them-extensive-feedback)
  * [רשימת המשוב עם 27 פריטים](#the-27-item-feedback-list)
  * [הצוותים התערבו, הובטחו הבטחות](#teams-got-involved-promises-were-made)
  * [התוצאה? כלום.](#the-result-nothing)
* [עזיבת ההנהלה: איך PayPal איבדה את כל הזיכרון המוסדי](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: הנהלה חדשה, אותן בעיות](#2025-new-leadership-same-problems)
  * [המנכ"ל החדש מתערב](#the-new-ceo-gets-involved)
  * [תגובתה של מישל גיל](#michelle-gills-response)
  * [תגובתנו: לא עוד פגישות](#our-response-no-more-meetings)
  * [תגובת האובר-אינג'ינירינג של מרטי ברודבק](#marty-brodbecks-overengineering-response)
  * [הסתירה של "CRUD פשוט"]( #the-simple-crud-contradiction)
  * [הניתוק מתבהר](#the-disconnect-becomes-clear)
* [שנים של דיווחי באגים שהתעלמו מהם](#years-of-bug-reports-they-ignored)
  * [2016: תלונות מוקדמות על UI/UX](#2016-early-uiux-complaints)
  * [2021: דיווח באג בדוא"ל עסקי](#2021-business-email-bug-report)
  * [2021: הצעות לשיפור הממשק](#2021-ui-improvement-suggestions)
  * [2021: כשלונות בסביבת הסנדבוקס](#2021-sandbox-environment-failures)
  * [2021: מערכת הדוחות שבורה לחלוטין](#2021-reports-system-completely-broken)
  * [2022: פיצ'ר API מרכזי חסר (שוב)](#2022-core-api-feature-missing-again)
* [סיפור האימה של חוויית המפתח](#the-developer-experience-nightmare)
  * [ממשק משתמש שבור](#broken-user-interface)
  * [בעיות SDK](#sdk-problems)
  * [הפרות מדיניות אבטחת תוכן](#content-security-policy-violations)
  * [כאוס בתיעוד](#documentation-chaos)
  * [פרצות אבטחה](#security-vulnerabilities)
  * [אסון בניהול סשנים](#session-management-disaster)
* [יולי 2025: הקש האחרון](#july-2025-the-final-straw)
* [למה אנחנו לא יכולים פשוט לוותר על PayPal](#why-we-cant-just-drop-paypal)
* [הפתרון הקהילתי](#the-community-workaround)
* [חסימת תבניות PayPal בגלל פישינג](#blocking-paypal-templates-due-to-phishing)
  * [הבעיה האמיתית: תבניות PayPal נראות כמו הונאות](#the-real-problem-paypals-templates-look-like-scams)
  * [היישום שלנו](#our-implementation)
  * [למה היינו צריכים לחסום את PayPal](#why-we-had-to-block-paypal)
  * [היקף הבעיה](#the-scale-of-the-problem)
  * [האירוניה](#the-irony)
  * [השפעה בעולם האמיתי: הונאות חדשות של PayPal](#real-world-impact-novel-paypal-scams)
* [תהליך KYC ההפוך של PayPal](#paypals-backwards-kyc-process)
  * [איך זה אמור לעבוד](#how-it-should-work)
  * [איך PayPal באמת עובד](#how-paypal-actually-works)
  * [ההשפעה בעולם האמיתי](#the-real-world-impact)
  * [אסון מעבר החשבון ביולי 2025](#the-july-2025-account-migration-disaster)
  * [למה זה חשוב](#why-this-matters)
* [איך כל מעבד תשלומים אחר עושה את זה נכון](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [הסטנדרט בתעשייה](#the-industry-standard)
  * [מה מעבדים אחרים מספקים לעומת PayPal](#what-other-processors-provide-vs-paypal)
* [הסתרה שיטתית של PayPal: השתקת 6 מיליון קולות](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [המחיקה הגדולה](#the-great-erasure)
  * [ההצלה מצד שלישי](#the-third-party-rescue)
* [אסון הבאג של לכידת התשלום בן 11 השנים: 1,899$ ומספרים](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [הפסד של Forward Email בסך 1,899$](#forward-emails-1899-loss)
  * [הדיווח המקורי מ-2013: יותר מ-11 שנים של רשלנות](#the-2013-original-report-11-years-of-negligence)
  * [ההודאה מ-2016: PayPal שוברת את ה-SDK שלה](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [ההסלמה מ-2024: עדיין שבור](#the-2024-escalation-still-broken)
  * [אסון אמינות ה-webhook](#the-webhook-reliability-disaster)
  * [תבנית הרשלנות השיטתית](#the-pattern-of-systematic-negligence)
  * [הדרישה הלא מתועדת](#the-undocumented-requirement)
* [הדפוס הרחב יותר של ההונאה של PayPal](#paypals-broader-pattern-of-deception)
  * [פעולת מחלקת השירותים הפיננסיים של ניו יורק](#the-new-york-department-of-financial-services-action)
  * [תביעת Honey: כתיבת מחדש של קישורי שותפים](#the-honey-lawsuit-rewriting-affiliate-links)
  * [העלות של הרשלנות של PayPal](#the-cost-of-paypals-negligence)
  * [שקר התיעוד](#the-documentation-lie)
* [מה זה אומר למפתחים](#what-this-means-for-developers)
## החלק החסר: אין דרך לרשום מנויים {#the-missing-piece-no-way-to-list-subscriptions}

הנה הדבר שמדהים אותנו: לפייפאל יש חיוב מנויים מאז 2014, אבל הם מעולם לא סיפקו דרך לסוחרים לרשום את המנויים שלהם.

תחשבו על זה לרגע. אפשר ליצור מנויים, אפשר לבטל אותם אם יש לך את ה-ID, אבל אי אפשר לקבל רשימה של כל המנויים הפעילים בחשבון שלך. זה כמו שיש מסד נתונים בלי משפט SELECT.

אנחנו צריכים את זה לפעולות עסקיות בסיסיות:

* תמיכת לקוחות (כשמישהו שולח מייל ושואל על המנוי שלו)
* דיווחים פיננסיים ופיוס
* ניהול חיובים אוטומטי
* תאימות וביקורת

אבל פייפאל? הם פשוט... מעולם לא בנו את זה.


## 2014-2017: הבעיה מתגלה {#2014-2017-the-problem-emerges}

בעיית רישום המנויים הופיעה לראשונה בפורומי הקהילה של פייפאל ב-2017. מפתחים שאלו את השאלה הברורה: "איך אני מקבל רשימה של כל המנויים שלי?"

תגובת פייפאל? שתיקה.

חברי הקהילה התחילו להתבאס:

> "השמטה מאוד מוזרה אם סוחר לא יכול לרשום את כל ההסכמים הפעילים. אם מזהה ההסכם אבד, זה אומר שרק המשתמש יכול לבטל או להשעות הסכם." - leafspider

> "+1. עברו כמעט 3 שנים." - laudukang (משמעות הדבר שהבעיה קיימת מאז \~2014)

[הפוסט המקורי בקהילה](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) מ-2017 מראה מפתחים שמבקשים את הפונקציונליות הבסיסית הזו. תגובת פייפאל הייתה לארכיב את המאגר שבו אנשים דיווחו על הבעיה.


## 2020: נתנו להם משוב נרחב {#2020-we-give-them-extensive-feedback}

באוקטובר 2020, פייפאל פנתה אלינו למפגש משוב פורמלי. זה לא היה שיחה מקרית - הם ארגנו שיחת Microsoft Teams של 45 דקות עם 8 בכירים בפייפאל כולל Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze ואחרים.

### רשימת 27 הפריטים של המשוב {#the-27-item-feedback-list}

הגענו מוכנים. אחרי 6 שעות של ניסיון אינטגרציה עם ה-APIs שלהם, ערכנו רשימה של 27 בעיות ספציפיות. Mark Stuart מצוות PayPal Checkout אמר:

> היי ניק, תודה ששיתפת את כולם היום! אני חושב שזה יהיה הקטליזטור לקבלת תמיכה והשקעה נוספת לצוות שלנו לתקן את הדברים האלה. היה קשה לקבל משוב עשיר כמו מה שהשארת לנו עד כה.

המשוב לא היה תיאורטי - הוא הגיע מניסיונות אינטגרציה אמיתיים:

1. **יצירת אסימון גישה לא עובדת**:

> יצירת אסימון גישה לא עובדת. גם, צריכים להיות יותר מדוגמאות cURL בלבד.

2. **אין ממשק ווב ליצירת מנויים**:

> איך לעזאזל אפשר ליצור מנויים בלי לעשות את זה עם cURL? לא נראה שיש ממשק ווב לעשות את זה (כמו שיש ל-Stripe)

Mark Stuart מצא את בעיית יצירת אסימון הגישה מדאיגה במיוחד:

> בדרך כלל אנחנו לא שומעים על בעיות סביב יצירת אסימון גישה.

### צוותים נכנסו לתמונה, הובטחו הבטחות {#teams-got-involved-promises-were-made}

ככל שגילינו עוד בעיות, פייפאל המשיכה להוסיף צוותים לשיחה. Darshan Raju מצוות ניהול המנויים הצטרף ואמר:

> מכירים בחוסר. נעקוב ונטפל בזה. תודה שוב על המשוב!

המפגש תואר כ:

> סיור כן בחווייתכם

כדי:

> להפוך את פייפאל למה שהיא צריכה להיות למפתחים.

### התוצאה? כלום. {#the-result-nothing}

למרות מפגש המשוב הפורמלי, רשימת 27 הפריטים הנרחבת, מעורבות צוותים מרובה והבטחות ל:

> לעקוב ולטפל

בבעיות, לא תוקן כלום.


## בריחת הבכירים: איך פייפאל איבדה את כל הזיכרון המוסדי {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

כאן זה נהיה מעניין באמת. כל אדם שקיבל את המשוב שלנו ב-2020 עזב את פייפאל:

**שינויים בהנהלה:**

* [דן שולמן (מנכ"ל במשך 9 שנים) → אלכס כריס](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (ספטמבר 2023)
* [Sri Shivananda (CTO שאירגן את המשוב) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (ינואר 2024)
**מנהיגים טכניים שהבטיחו, ואז עזבו:**

* **מרק סטיוארט** (הבטיח שהמשוב יהיה "זרז") → [עכשיו ב-Ripple](https://www.linkedin.com/in/markstuartsf)
* **ג'ים מגאץ'** (ותיק פייפאל בן 18 שנה) → [מנכ"ל MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **ג'ון קונזה** (סגן נשיא מוצרי צרכנים גלובליים) → [פרש לגמלאות](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **אדווין אוקי** (אחד מהאחרונים שנותרו) → [עזב עכשיו ל-Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (ינואר 2025)

פייפאל הפכה לדלת מסתובבת שבה מנהלים אוספים משוב ממפתחים, מבטיחים, ואז עוזבים לחברות טובות יותר כמו JPMorgan, Ripple וחברות פינטק אחרות.

זה מסביר מדוע התגובה לבעיה ב-GitHub ב-2025 נראתה מנותקת לחלוטין מהמשוב שלנו מ-2020 - כל מי שקיבל את המשוב הזה עזב את פייפאל.

## 2025: הנהגה חדשה, אותן בעיות {#2025-new-leadership-same-problems}

קדימה ל-2025, והדפוס המדויק חוזר על עצמו. אחרי שנים ללא התקדמות, ההנהגה החדשה של פייפאל פונה שוב.

### המנכ"ל החדש מתערב {#the-new-ceo-gets-involved}

ב-30 ביוני 2025, העלינו ישירות למנכ"ל החדש של פייפאל, אלכס כריס. תגובתו הייתה קצרה:

> היי ניק – תודה שפנית והמשוב. מישל (בהעתק) אחראית עם הצוות שלה להתעסק ולעבוד על זה איתך. תודה -א

### תגובת מישל גיל {#michelle-gills-response}

מישל גיל, סמנכ"לית בכירה ומנהלת כללית לעסקים קטנים ושירותים פיננסיים, הגיבה:

> תודה רבה ניק, מעבירה את אלכס להעתק נסתר. אנחנו בודקים את זה מאז הפוסט הקודם שלך. נתקשר אליך לפני סוף השבוע. האם תוכל לשלוח לי את פרטי הקשר שלך כדי שאחד מהעמיתים שלי יוכל לפנות אליך. מישל

### התגובה שלנו: לא עוד פגישות {#our-response-no-more-meetings}

סרבנו לפגישה נוספת, והסברנו את התסכול שלנו:

> תודה. עם זאת, אני לא מרגיש ששיחה תעשה משהו. הנה למה... נכנסתי לשיחה בעבר וזה לא הוביל לשום מקום. בזבזתי יותר משעתיים מזמני בשיחה עם כל הצוות וההנהלה ולא נעשה כלום... המון מיילים הלוך ושוב. כלום לא נעשה. המשוב לא התקדם. ניסיתי במשך שנים, הקשיבו לי, ואז זה לא הוביל לשום מקום.

### תגובת ההנדסה המופרזת של מרטי ברודבק {#marty-brodbecks-overengineering-response}

אז מרטי ברודבק, שמוביל את הנדסת הצרכנים בפייפאל, פנה אלינו:

> היי ניק, זה מרטי ברודבק. אני מוביל את כל הנדסת הצרכנים כאן בפייפאל והובלתי את פיתוח ה-API של החברה. האם נוכל להתחבר ולדבר על הבעיה שאתה מתמודד איתה ואיך נוכל לעזור כאן.

כשהסברנו את הצורך הפשוט בנקודת קצה לרשימת מנויים, תגובתו חשפה את הבעיה המדויקת:

> תודה ניק, אנחנו בתהליך יצירת API מנוי יחיד עם SDK מלא (תומך בטיפול שגיאות מלא, מעקב מנויים מבוסס אירועים, זמינות גבוהה) כאשר החיוב גם מפוצל כ-API נפרד לסוחרים לגשת אליו במקום לנהל בין מספר נקודות קצה לקבלת תגובה אחת.

זו בדיוק הגישה השגויה. אנחנו לא צריכים חודשים של ארכיטקטורה מורכבת. אנחנו צריכים נקודת קצה REST פשוטה אחת שמציגה מנויים - משהו שהיה צריך להיות קיים מאז 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### סתירת "CRUD פשוט" {#the-simple-crud-contradiction}

כשהצבענו שזהו פונקציונליות CRUD בסיסית שצריכה הייתה להיות קיימת מאז 2014, תגובת מרטי הייתה משמעותית:

> פעולות CRUD פשוטות הן חלק מה-API המרכזי חבר שלי, אז זה לא ייקח חודשים של פיתוח

ה-SDK של PayPal ב-TypeScript, שתומך כיום רק בשלוש נקודות קצה אחרי חודשים של פיתוח, יחד עם ציר הזמן ההיסטורי שלו, מראים בבירור שפרויקטים כאלה דורשים יותר מכמה חודשים להשלמה.
תגובה זו מראה שהוא לא מבין את ה-API שלו עצמו. אם "פעולות CRUD פשוטות הן חלק מה-API המרכזי," אז איפה נקודת הקצה לרשימת המנויים? הגענו לתגובה:

> אם 'פעולות CRUD פשוטות הן חלק מה-API המרכזי' אז איפה נקודת הקצה לרשימת המנויים? מפתחים מבקשים את 'פעולת CRUD הפשוטה' הזו מאז 2014. עברו 11 שנים. כל מעבד תשלומים אחר היה עם הפונקציונליות הבסיסית הזו מהיום הראשון.

### הניתוק מתבהר {#the-disconnect-becomes-clear}

החלפות ההודעות מ-2025 עם אלכס כריס, מישל גיל ומארטי ברודבק מראות את אותה דיספונקציה ארגונית:

1. **ההנהגה החדשה אינה מודעת למפגשי המשוב הקודמים**
2. **הם מציעים את אותן פתרונות מופרזים**
3. **הם לא מבינים את מגבלות ה-API שלהם**
4. **הם רוצים עוד פגישות במקום פשוט לתקן את הבעיה**

תבנית זו מסבירה מדוע צוותי PayPal ב-2025 נראים מנותקים לחלוטין מהמשוב הנרחב שניתן ב-2020 - האנשים שקיבלו את המשוב הזה כבר לא שם, וההנהגה החדשה חוזרת על אותן טעויות.


## שנים של דיווחי באגים שהתעלמו מהם {#years-of-bug-reports-they-ignored}

לא רק שהתלוננו על חוסרים בתכונות. דיווחנו באופן פעיל על באגים וניסינו לעזור להם להשתפר. הנה ציר זמן מקיף של הבעיות שתיעדנו:

### 2016: תלונות מוקדמות על UI/UX {#2016-early-uiux-complaints}

אפילו כבר ב-2016, פנינו בפומבי להנהלת PayPal כולל דן שולמן לגבי בעיות בממשק ובעיות שימושיות. זה היה לפני 9 שנים, והבעיות באותו ממשק ממשיכות גם היום.

### 2021: דיווח על באג במייל עסקי {#2021-business-email-bug-report}

במרץ 2021, דיווחנו שמערכת המייל העסקית של PayPal שולחת הודעות ביטול שגויות. תבנית המייל הכילה משתנים שהוצגו בצורה שגויה, והציגה הודעות מבלבלות ללקוחות.

מרק סטיוארט אישר את הבעיה:

> תודה ניק! עוברים ל-BCC. @Prasy, האם הצוות שלך אחראי על המייל הזה או יודע מי אחראי? ה-"Niftylettuce, LLC, לא נשלם לך יותר" גורם לי להאמין שיש בלבול למי ההודעה מיועדת ותוכן המייל.

**תוצאה**: הם באמת תיקנו את זה! מרק סטיוארט אישר:

> רק שמעתי מצוות ההודעות שתבנית המייל תוקנה ופורסמה. מעריך שפנית לדווח על זה. תודה!

זה מראה שהם יכולים לתקן דברים כשרוצים - הם פשוט בוחרים לא לעשות זאת ברוב המקרים.

### 2021: הצעות לשיפור UI {#2021-ui-improvement-suggestions}

בפברואר 2021, נתנו משוב מפורט על ממשק הלוח בקרה שלהם, במיוחד על החלק "פעילות אחרונה ב-PayPal":

> אני חושב שהלוח ב-paypal.com, במיוחד "פעילות אחרונה ב-PayPal" צריך שיפור. אני לא חושב שצריך להראות את שורות הסטטוס "נוצר" של תשלום חוזר בסכום $0 - זה מוסיף המון שורות מיותרות ולא מאפשר לראות בקלות כמה הכנסה נוצרת ליום/לכמה ימים אחרונים.

מרק סטיוארט העביר את זה לצוות מוצרי הצרכנים:

> תודה! אני לא בטוח איזה צוות אחראי על הפעילות, אבל העברתי את זה לראש מוצרי הצרכנים כדי למצוא את הצוות הנכון. תשלום חוזר של $0.00 נראה כמו באג. כנראה צריך לסנן אותו החוצה.

**תוצאה**: לא תוקן מעולם. הממשק עדיין מציג את הערכים חסרי התועלת של $0.

### 2021: כשלים בסביבת הסנדבוקס {#2021-sandbox-environment-failures}

בנובמבר 2021, דיווחנו על בעיות קריטיות בסביבת הסנדבוקס של PayPal:

* מפתחות API סודיים של הסנדבוקס שונו ונכנסו למצב מושבת באופן אקראי
* כל חשבונות הבדיקה בסנדבוקס נמחקו ללא הודעה
* הודעות שגיאה בעת ניסיון לצפות בפרטי חשבון סנדבוקס
* כשלים בטעינה לסירוגין

> מסיבה כלשהי מפתח ה-API הסודי שלי בסנדבוקס שונה והוא הושבת. גם כל חשבונות הבדיקה הישנים שלי בסנדבוקס נמחקו.

> לפעמים הם נטענים ולפעמים לא. זה מתסכל בצורה בלתי נסבלת.

**תוצאה**: ללא תגובה, ללא תיקון. מפתחים עדיין מתמודדים עם בעיות אמינות בסנדבוקס.

### 2021: מערכת הדוחות שבורה לחלוטין {#2021-reports-system-completely-broken}
במאי 2021, דיווחנו שמערכת ההורדה של PayPal לדוחות עסקאות הייתה שבורה לחלוטין:

> נראה שהורדות הדוחות לא עובדות כרגע ולא עבדו כל היום. גם כנראה שצריך לקבל התראה במייל אם זה נכשל.

גם ציינו את האסון בניהול הסשנים:

> גם אם אתה לא פעיל בזמן שאתה מחובר ל-PayPal במשך כ-5 דקות, אתה מתנתק. אז כשאתה מרענן את הכפתור שוב ליד הדוח שברצונך לבדוק את הסטטוס שלו (אחרי שאתה מחכה לנצח), זה מעצבן שצריך להתחבר שוב.

מרק סטיוארט אישר את בעיית תום הזמן של הסשן:

> אני זוכר שדיווחת על זה בעבר עם תום הזמן של הסשן שלך לעיתים קרובות והפרעה לזרימת הפיתוח שלך כשאתה עובר בין ה-IDE שלך ל-developer.paypal.com או ללוח הבקרה של הסוחר שלך, ואז אתה חוזר ומנותק שוב.

**תוצאה**: תום הזמן של הסשנים עדיין 60 שניות. מערכת הדוחות עדיין נכשלת באופן קבוע.

### 2022: תכונת API מרכזית חסרה (שוב) {#2022-core-api-feature-missing-again}

בינואר 2022, העלינו שוב את בעיית רשימת המנויים, הפעם עם פרטים נוספים על איך התיעוד שלהם שגוי:

> אין GET שמציג את כל המנויים (שנקראו בעבר הסכמי חיוב)

גילינו שהתיעוד הרשמי שלהם לא מדויק בכלל:

> תיעוד ה-API גם הוא לא מדויק בכלל. חשבנו שנוכל לעקוף את זה על ידי הורדת רשימה קשיחה של מזהי מנוי. אבל זה אפילו לא עובד!

> מהתיעוד הרשמי כאן... כתוב שאתה יכול לעשות את זה... והנה העניין - אין שדה "מזהה מנוי" בכלל שניתן לסמן.

כריסטינה מונטי מ-PayPal הגיבה:

> מתנצלים על התסכול שנגרם מהשלבים השגויים האלה, נתקן את זה השבוע.

סרי שיבננדה (CTO) הודתה לנו:

> תודה על העזרה המתמשכת שלכם בשיפור שלנו. מאוד מוערך.

**תוצאה**: התיעוד מעולם לא תוקן. נקודת הקצה לרשימת המנויים מעולם לא נוצרה.


## סיוט חוויית המפתח {#the-developer-experience-nightmare}

לעבוד עם ה-APIs של PayPal זה כמו לחזור בזמן 10 שנים. הנה הבעיות הטכניות שתיעדנו:

### ממשק משתמש שבור {#broken-user-interface}

לוח הבקרה של מפתחי PayPal הוא אסון. הנה מה שאנחנו מתמודדים איתו מדי יום:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  ממשק המשתמש של PayPal כל כך שבור שאפילו אי אפשר לסגור התראות
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  לוח הבקרה של המפתחים גורם לך ממש לגרור סליידר ואז מתנתק אחרי 60 שניות
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  אסונות ממשק משתמש נוספים בממשק המפתחים של PayPal המציגים זרימות עבודה שבורות
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  ממשק ניהול המנויים - הממשק כל כך גרוע שנאלצנו להסתמך על קוד ליצירת מוצרים ותכניות מנוי
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  מבט על ממשק המנויים השבור עם פונקציונליות חסרה (אי אפשר ליצור בקלות מוצרים/תכניות/מנויים – ונראה שאין דרך למחוק מוצרים או תכניות לאחר שנוצרו בממשק)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  הודעות שגיאה טיפוסיות של PayPal - מסתוריות ולא מועילות
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### בעיות SDK {#sdk-problems}

* לא יכול להתמודד עם תשלומים חד-פעמיים ומנויים בו זמנית בלי פתרונות מסובכים הכוללים החלפה וטעינה מחדש של כפתורים תוך טעינת ה-SDK עם תגי סקריפט
* ה-SDK של JavaScript מפר את הקונבנציות הבסיסיות (שמות מחלקות באותיות קטנות, ללא בדיקת מופעים)
* הודעות השגיאה לא מציינות אילו שדות חסרים
* סוגי נתונים לא עקביים (דורש סכומים כמחרוזות במקום כמספרים)

### הפרות מדיניות אבטחת תוכן {#content-security-policy-violations}

ה-SDK שלהם דורש unsafe-inline ו-unsafe-eval ב-CSP שלך, **מה שמכריח אותך לפגוע באבטחת האתר שלך**.

### כאוס בתיעוד {#documentation-chaos}

מרק סטיוארט עצמו הודה:

> מסכים שיש כמות אבסורדית של API ישנים וחדשים. ממש קשה למצוא מה לחפש (אפילו לנו שעובדים כאן).

### פרצות אבטחה {#security-vulnerabilities}

**היישום של 2FA ב-PayPal הפוך**. אפילו עם אפליקציות TOTP מופעלות, הם מכריחים אימות SMS - מה שהופך חשבונות לפגיעים להתקפות החלפת SIM. אם יש לך TOTP מופעל, זה צריך לשמש באופן בלעדי. הגיבוי צריך להיות אימייל, לא SMS.

### אסון בניהול סשנים {#session-management-disaster}

**לוח הבקרה למפתחים שלהם מתנתק אחרי 60 שניות של חוסר פעילות**. תנסה לעשות משהו פרודוקטיבי ואתה כל הזמן עובר דרך: התחברות → קפצ'ה → 2FA → התנתקות → חזרה. משתמש ב-VPN? בהצלחה.

## יולי 2025: הקש האחרון {#july-2025-the-final-straw}

אחרי 11 שנים של אותן בעיות, נקודת השבר הגיעה במהלך העברת חשבון שגרתית. היינו צריכים לעבור לחשבון PayPal חדש שיתאים לשם החברה שלנו "Forward Email LLC" לצורך הנהלת חשבונות נקייה יותר.

מה שהיה אמור להיות פשוט הפך לאסון שלם:

* בדיקות ראשוניות הראו שהכל עובד כראוי
* שעות לאחר מכן, PayPal חסם פתאום את כל תשלומי המנויים ללא הודעה מוקדמת
* לקוחות לא יכלו לשלם, מה שיצר בלבול ועומס על התמיכה
* תמיכת PayPal נתנה תגובות סותרות שטענו שהחשבונות אומתו
* היינו חייבים להפסיק לחלוטין את תשלומי PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  השגיאה שהלקוחות ראו כשניסו לשלם - ללא הסבר, ללא לוגים, כלום
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  תמיכת PayPal שטוענת שהכל בסדר בזמן שהתשלומים היו שבורים לחלוטין. ההודעה הסופית מראה אותם אומרים שהם "שיחזרו כמה תכונות" אבל עדיין מבקשים מידע נוסף לא מוגדר - תיאטרון טיפוסי של תמיכת PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  תהליך אימות הזהות שלכאורה "לא פתר" כלום
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  הודעה מעורפלת ועדיין ללא פתרון. אפס מידע, הודעות או כל דבר לגבי איזו מידע נוסף נדרש. שירות הלקוחות שותק.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## למה אנחנו לא יכולים פשוט לוותר על PayPal {#why-we-cant-just-drop-paypal}

למרות כל הבעיות האלה, אנחנו לא יכולים לוותר לחלוטין על PayPal כי יש לקוחות שלפניהם PayPal היא האפשרות היחידה לתשלום. כפי שאמר לקוח אחד בדף ה[סטטוס שלנו](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal היא האפשרות היחידה שלי לתשלום

**אנחנו תקועים לתמוך בפלטפורמה שבורה כי PayPal יצרה מונופול תשלומים עבור משתמשים מסוימים.**


## הפתרון הקהילתי {#the-community-workaround}

מכיוון ש-PayPal לא מספקת פונקציונליות בסיסית להצגת מנויים, קהילת המפתחים בנתה פתרונות עקיפים. יצרנו סקריפט שעוזר לנהל מנויים ב-PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

הסקריפט מתייחס ל[גיסט קהילתי](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) שבו מפתחים משתפים פתרונות. משתמשים למעשה [מודים לנו](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) על מתן מה ש-PayPal הייתה צריכה לבנות לפני שנים.


## חסימת תבניות PayPal בגלל פישינג {#blocking-paypal-templates-due-to-phishing}

הבעיות חורגות מעבר ל-APIs. תבניות האימייל של PayPal מעוצבות כל כך גרוע שנאלצנו ליישם סינון ספציפי בשירות האימייל שלנו כי הן בלתי ניתנות להבחנה מניסיונות פישינג.

### הבעיה האמיתית: תבניות PayPal נראות כמו הונאות {#the-real-problem-paypals-templates-look-like-scams}

אנו מקבלים דיווחים באופן קבוע על אימיילים מ-PayPal שנראים בדיוק כמו ניסיונות פישינג. הנה דוגמה אמיתית מדיווחי ההתעללות שלנו:

**נושא:** `[Sandbox] TEST - חשבונית חדשה מ-PaypalBilling434567 sandbox #A4D369E8-0001`

אימייל זה הועבר ל-`abuse@microsoft.com` כי נראה כניסיון פישינג. הבעיה? זה היה למעשה מסביבת הסנדבוקס של PayPal, אבל עיצוב התבנית שלהם כל כך גרוע שהוא מפעיל מערכות זיהוי פישינג.

### היישום שלנו {#our-implementation}

ניתן לראות את הסינון הספציפי ל-PayPal שהטמענו בקוד הסינון שלנו ב-[קוד סינון האימייל](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### למה היינו צריכים לחסום את PayPal {#why-we-had-to-block-paypal}

הטמענו זאת כי PayPal סירבה לתקן בעיות עצומות של ספאם/פישינג/הונאה למרות דיווחים חוזרים שלנו לצוותי ההתעללות שלהם. סוגי האימייל הספציפיים שאנו חוסמים כוללים:

* **RT000238** - התראות חשבונית חשודות
* **PPC001017** - אישורי תשלום בעייתיים
* **RT000542** - ניסיונות פריצה להודעות מתנה

### היקף הבעיה {#the-scale-of-the-problem}

יומני סינון הספאם שלנו מראים את נפח הספאם העצום של חשבוניות PayPal שאנו מעבדים מדי יום. דוגמאות לנושאים שחוסמו כוללות:

* "חשבונית מצוות החיוב של PayPal:- חיוב זה ינוכה אוטומטית מחשבונך. אנא צור קשר מיידי בטלפון \[PHONE]"
* "חשבונית מ-\[COMPANY NAME] (\[ORDER-ID])"
* וריאציות מרובות עם מספרי טלפון שונים ומספרי הזמנה מזויפים
אימיילים אלה מגיעים לעיתים קרובות משרתים של `outlook.com` אך נראים כאילו הם מקורם במערכות הלגיטימיות של PayPal, מה שהופך אותם למסוכנים במיוחד. האימיילים עוברים אימות SPF, DKIM ו-DMARC מכיוון שהם נשלחים דרך התשתית האמיתית של PayPal.

יומני הטכניים שלנו מראים שאימיילי הספאם האלה מכילים כותרות לגיטימיות של PayPal:

* `X-Email-Type-Id: RT000238` (אותו מזהה שאנו חוסמים)
* `From: "service@paypal.com" <service@paypal.com>`
* חתימות DKIM תקפות מ-`paypal.com`
* רשומות SPF תקינות המראות את שרתי הדואר של PayPal

זה יוצר מצב בלתי אפשרי: אימיילים לגיטימיים של PayPal וספאם שניהם בעלי מאפיינים טכניים זהים.

### האירוניה {#the-irony}

PayPal, חברה שצריכה להוביל את המאבק נגד הונאות פיננסיות, משתמשת בתבניות אימייל כל כך גרועות שהן מפעילות מערכות נגד פישינג. אנו נאלצים לחסום אימיילים לגיטימיים של PayPal מכיוון שהם בלתי ניתנים להבחנה מהונאות.

זה מתועד במחקרי אבטחה: [היזהרו מהונאת כתובת חדשה של PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - המראה כיצד מערכות PayPal עצמן מנוצלות להונאה.

### השפעה בעולם האמיתי: הונאות חדשות של PayPal {#real-world-impact-novel-paypal-scams}

הבעיה חורגת מעבר לעיצוב תבניות גרוע. מערכת החשבוניות של PayPal כל כך פגיעה שנוכלים מנצלים אותה באופן קבוע כדי לשלוח חשבוניות מזויפות שנראות לגיטימיות. חוקר אבטחה Gavin Anderegg תיעד [הונאה חדשה של PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) שבה נוכלים שולחים חשבוניות אמיתיות של PayPal שעוברות את כל בדיקות האימות:

> "כשבדקתי את המקור, האימייל נראה כאילו באמת הגיע מ-PayPal (SPF, DKIM ו-DMARC כולם עברו). הכפתור גם קישר לכתובת שנראתה כמו URL לגיטימי של PayPal... לקח לי רגע להבין שזה אימייל לגיטימי. פשוט קיבלתי 'חשבונית' אקראית מנוכל."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  צילום מסך המציג מספר חשבוניות מזויפות של PayPal ששוטפות תיבת דואר נכנס, כולן נראות לגיטימיות מכיוון שהן באמת מגיעות ממערכות PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="צילום מסך אזהרת הונאת PayPal" class="rounded-lg" />
</figure>

החוקר ציין:

> "נראה שזה גם תכונה נוחה ש-PayPal צריכה לשקול לחסום. מיד הנחתי שמדובר בסוג של הונאה והתעניינתי רק בפרטים הטכניים. זה נראה קל מדי לביצוע, ואני חושש שאחרים עלולים ליפול בפח."

זה ממחיש בצורה מושלמת את הבעיה: המערכות הלגיטימיות של PayPal כל כך גרועות בעיצובן שהן מאפשרות הונאה ובו בזמן גורמות לתקשורת לגיטימית להיראות חשודה.

להחמיר את המצב, זה השפיע על יכולת המסירה שלנו עם Yahoo וגרם לתלונות לקוחות ושעות של בדיקות מדוקדקות ובדיקת דפוסים.


## תהליך ה-KYC ההפוך של PayPal {#paypals-backwards-kyc-process}

אחד ההיבטים המתסכלים ביותר בפלטפורמת PayPal הוא הגישה ההפוכה שלהם לציות ולנהלי Know Your Customer (KYC). בניגוד לכל מעבד תשלומים אחר, PayPal מאפשרת למפתחים לשלב את ה-APIs שלהם ולהתחיל לאסוף תשלומים בסביבת ייצור לפני השלמת אימות תקין.

### איך זה אמור לעבוד {#how-it-should-work}

כל מעבד תשלומים לגיטימי פועל לפי הרצף הלוגי הבא:

1. **לסיים את אימות ה-KYC קודם כל**
2. **לאשר את חשבון הסוחר**
3. **לספק גישה ל-API בסביבת ייצור**
4. **לאפשר איסוף תשלומים**

זה מגן הן על מעבד התשלומים והן על הסוחר על ידי הבטחת ציות לפני כל העברת כסף.

### איך PayPal באמת פועלת {#how-paypal-actually-works}

התהליך של PayPal הוא הפוך לחלוטין:

1. **לספק גישה ל-API בסביבת ייצור מיד**
2. **לאפשר איסוף תשלומים למשך שעות או ימים**
3. **לפתע לחסום תשלומים ללא הודעה**
4. **לדרוש מסמכי KYC לאחר שהלקוחות כבר נפגעו**
5. **לא לספק הודעה לסוחר**
6. **לאפשר ללקוחות לגלות את הבעיה ולדווח עליה**
### ההשפעה במציאות {#the-real-world-impact}

תהליך הפוך זה יוצר אסונות לעסקים:

* **לקוחות לא יכולים להשלים רכישות** בתקופות שיא של מכירות
* **אין התראה מוקדמת** שדרושה אימות
* **אין התראות בדוא"ל** כאשר תשלומים נחסמים
* **הסוחרים לומדים על הבעיות מלקוחות מבולבלים**
* **אובדן הכנסות** בתקופות עסקיות קריטיות
* **פגיעה באמון הלקוחות** כאשר תשלומים נכשלים באופן מסתורי

### אסון ההעברת החשבונות ביולי 2025 {#the-july-2025-account-migration-disaster}

התסריט המדויק הזה התרחש במהלך העברת החשבונות השגרתית שלנו ביולי 2025. PayPal אפשרה לתשלומים לפעול בתחילה, ואז פתאום חסמה אותם ללא כל הודעה. גילינו את הבעיה רק כאשר הלקוחות התחילו לדווח שהם לא יכולים לשלם.

כשהתקשרנו לתמיכה, קיבלנו תגובות סותרות לגבי אילו מסמכים נדרשים, ללא לוח זמנים ברור לפתרון. זה אילץ אותנו להפסיק לחלוטין את תשלומי PayPal, מה שבלבל את הלקוחות שלא היו להם אפשרויות תשלום אחרות.

### למה זה חשוב {#why-this-matters}

הגישה של PayPal לציות מראה חוסר הבנה יסודי של אופן פעולת העסקים. KYC נכון צריך להתרחש **לפני** האינטגרציה לייצור, לא אחרי שהלקוחות כבר מנסים לשלם. חוסר התקשורת הפרואקטיבית כאשר מתעוררות בעיות מדגים את הניתוק של PayPal מצרכי הסוחרים.

תהליך הפוך זה הוא סימפטום לבעיות הארגוניות הרחבות יותר של PayPal: הם מעדיפים את התהליכים הפנימיים שלהם על פני חוויית הסוחר והלקוח, מה שמוביל לסוג האסונות התפעוליים שמרחיקים עסקים מהפלטפורמה שלהם.


## איך כל מעבד תשלומים אחר עושה את זה נכון {#how-every-other-payment-processor-does-it-right}

פונקציונליות רישום המנויים ש-PayPal מסרבת ליישם היא סטנדרט בתעשייה כבר יותר מעשור. כך מעבדי תשלומים אחרים מטפלים בדרישה בסיסית זו:

### Stripe {#stripe}

ל-Stripe יש רישום מנויים מאז שה-API שלהם הושק. התיעוד שלהם מראה בבירור כיצד לשלוף את כל המנויים עבור לקוח או חשבון סוחר. זה נחשב לפונקציונליות CRUD בסיסית.

### Paddle {#paddle}

Paddle מספקת APIs מקיפים לניהול מנויים הכוללים רישום, סינון ודפדוף. הם מבינים שסוחרים צריכים לראות את זרמי ההכנסות החוזרות שלהם.

### Coinbase Commerce {#coinbase-commerce}

אפילו מעבדי תשלומים במטבעות קריפטוגרפיים כמו Coinbase Commerce מספקים ניהול מנויים טוב יותר מ-PayPal.

### Square {#square}

ה-API של Square כולל רישום מנויים כתכונה בסיסית, לא כעניין משני.

### הסטנדרט בתעשייה {#the-industry-standard}

כל מעבד תשלומים מודרני מספק:

* רשימת כל המנויים
* סינון לפי סטטוס, תאריך, לקוח
* דפדוף עבור מערכי נתונים גדולים
* התראות webhook לשינויים במנוי
* תיעוד מקיף עם דוגמאות עובדות

### מה מעבדים אחרים מספקים לעומת PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - רשימת כל המנויים:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - סינון לפי לקוח:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - סינון לפי סטטוס:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - מה שאתה מקבל בפועל:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# אתה יכול לקבל רק מנוי אחד אם אתה כבר יודע את ה-ID
# אין נקודת קצה לרשום את כל המנויים
# אין דרך לחפש או לסנן
# אתה חייב לעקוב אחר כל מזהי המנויים בעצמך
```

**נקודות הקצה הזמינות של PayPal:**

* `POST /v1/billing/subscriptions` - יצירת מנוי
* `GET /v1/billing/subscriptions/{id}` - קבלת מנוי אחד (אם אתה יודע את ה-ID)
* `PATCH /v1/billing/subscriptions/{id}` - עדכון מנוי
* `POST /v1/billing/subscriptions/{id}/cancel` - ביטול מנוי
* `POST /v1/billing/subscriptions/{id}/suspend` - השעיית מנוי
**מה חסר ב-PayPal:**

* ❌ אין `GET /v1/billing/subscriptions` (רשימת כל המנויים)
* ❌ אין פונקציית חיפוש
* ❌ אין סינון לפי סטטוס, לקוח, תאריך
* ❌ אין תמיכה בעמודים (pagination)

PayPal הוא המעבד תשלומים הגדול היחיד שמכריח מפתחים לעקוב ידנית אחרי מזהי מנויים במסדי הנתונים שלהם.


## ההסתרה השיטתית של PayPal: להשתיק 6 מיליון קולות {#paypals-systematic-cover-up-silencing-6-million-voices}

במהלך שממחיש בצורה מושלמת את הגישה של PayPal לטיפול בביקורת, הם לאחרונה הורידו את כל פורום הקהילה שלהם מהאוויר, מה שהשתיק בפועל מעל 6 מיליון חברים ומחק מאות אלפי פוסטים שתיעדו את הכשלים שלהם.

### המחיקה הגדולה {#the-great-erasure}

פורום הקהילה המקורי של PayPal ב-`paypal-community.com` אירח **6,003,558 חברים** וכלל מאות אלפי פוסטים, דיווחי באגים, תלונות ודיונים על כשלים ב-API של PayPal. זה ייצג יותר מעשור של ראיות מתועדות לבעיות השיטתיות של PayPal.

ב-30 ביוני 2025, PayPal בשקט הורידו את כל הפורום מהאוויר. כל הקישורים ל-`paypal-community.com` מחזירים כעת שגיאות 404. זו לא הייתה הגירה או שדרוג.

### ההצלה של צד שלישי {#the-third-party-rescue}

למזלנו, שירות צד שלישי ב-[ppl.lithium.com](https://ppl.lithium.com/) שמר חלק מהתוכן, ומאפשר לנו לגשת לדיונים ש-PayPal ניסו להסתיר. עם זאת, השימור של צד שלישי זה אינו שלם ועלול להיעלם בכל רגע.

תבנית ההסתרה הזו אינה חדשה עבור PayPal. יש להם היסטוריה מתועדת של:

* הסרת דיווחי באגים קריטיים מהציבור
* הפסקת כלים למפתחים ללא הודעה מוקדמת
* שינויי API ללא תיעוד נאות
* השתקת דיוני קהילה על הכשלים שלהם

הסגירה של הפורום מייצגת את הניסיון החצוף ביותר עד כה להסתיר את הכשלים השיטתיים שלהם מביקורת ציבורית.


## אסון הבאג של לכידת התשלום בן 11 השנים: 1,899$ ומספרים {#the-11-year-capture-bug-disaster-1899-and-counting}

בעוד ש-PayPal היו עסוקים בארגון מפגשי משוב והבטחות, מערכת עיבוד התשלומים המרכזית שלהם שבורה באופן יסודי כבר למעלה מ-11 שנים. הראיות הרסניות.

### ההפסד של Forward Email בסך 1,899$ {#forward-emails-1899-loss}

במערכות הייצור שלנו גילינו 108 תשלומים ב-PayPal בסך כולל של **1,899$** שאבדו עקב כשלים בלכידת התשלום של PayPal. תשלומים אלו מציגים דפוס עקבי:

* התקבלו webhook של `CHECKOUT.ORDER.APPROVED`
* ה-API של לכידת התשלום של PayPal החזיר שגיאות 404
* ההזמנות הפכו לבלתי נגישות דרך ה-API של PayPal

אי אפשר לקבוע אם הלקוחות חויבו שכן PayPal מסתיר לחלוטין יומני דיבוג לאחר 14 יום ומוחק את כל הנתונים מדשבורד עבור מזהי הזמנות שלא נלכדו.

זה מייצג עסק אחד בלבד. **ההפסדים המצטברים של אלפי סוחרים במשך למעלה מ-11 שנים ככל הנראה מסתכמים במיליוני דולרים.**

**נאמר זאת שוב: ההפסדים המצטברים של אלפי סוחרים במשך למעלה מ-11 שנים ככל הנראה מסתכמים במיליוני דולרים.**

הסיבה היחידה שגילינו זאת היא כי אנחנו מדויקים מאוד ומונחי נתונים.

### הדו"ח המקורי מ-2013: למעלה מ-11 שנים של רשלנות {#the-2013-original-report-11-years-of-negligence}

הדיווח המתועד המוקדם ביותר של הבעיה המדויקת הזו מופיע ב-[Stack Overflow בנובמבר 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([ארכיון](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "מקבל שגיאת 404 עם Rest API בעת ביצוע לכידה"

השגיאה שדווחה ב-2013 היא **זהה** לזו ש-Forward Email חווה ב-2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

תגובת הקהילה ב-2013 הייתה משמעותית:

> "יש בעיה מדווחת כרגע עם REST API. PayPal עובדים על זה."
**11+ שנים אחרי, הם עדיין "עובדים על זה."**

### ההודאה מ-2016: PayPal שוברת את ה-SDK שלה {#the-2016-admission-paypal-breaks-their-own-sdk}

ב-2016, מאגר ה-GitHub של PayPal תיעד [כשלונות עצומים בתפיסות](https://github.com/paypal/PayPal-PHP-SDK/issues/660) שהשפיעו על ה-SDK הרשמי שלהם ל-PHP. ההיקף היה מדהים:

> "מאז 20/9/2016, כל ניסיונות התפיסה של PayPal נכשלו עם 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. לא שונה דבר בין 19/9 ל-20/9 באינטגרציית ה-API. **100% מניסיונות התפיסה מאז 20/9 החזירו את השגיאה הזו.**"

סוחר אחד דיווח:

> "היו לי **מעל 1,400 ניסיונות תפיסה שנכשלו ב-24 השעות האחרונות**, כולם עם תגובת שגיאה INVALID_RESOURCE_ID."

תגובת PayPal הראשונית הייתה להאשים את הסוחר ולהפנות אותו לתמיכה טכנית. רק לאחר לחץ כבד הם הודו בטעות:

> "יש לי עדכון ממפתחי המוצר שלנו. הם מבחינים בכותרות שנשלחות שה-PayPal-Request-ID נשלח עם 42 תווים, אבל **נראה ששינוי אחרון הגביל את ה-ID הזה ל-38 תווים בלבד.**"

ההודאה הזו חושפת רשלנות שיטתית של PayPal:

1. **הם עשו שינויים שבורים ללא תיעוד**
2. **הם שברו את ה-SDK הרשמי שלהם**
3. **הם האשימו את הסוחרים תחילה**
4. **הם הודו בטעות רק תחת לחץ**

אפילו לאחר "תיקון" הבעיה, סוחרים דיווחו:

> "שדרגתי את ה-SDK לגרסה v1.7.4 ו-**הבעיה עדיין מתרחשת.**"

### ההסלמה ב-2024: עדיין שבור {#the-2024-escalation-still-broken}

דיווחים אחרונים מהקהילה השמורה של PayPal מראים שהבעיה למעשה החמירה. [דיון מספטמבר 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([ארכיון](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) מתעד את אותן בעיות בדיוק:

> "הבעיה התחילה להופיע רק לפני כשבועיים ואינה משפיעה על כל ההזמנות. **הנפוצה הרבה יותר נראית להיות שגיאות 404 בתפיסה.**"

הסוחר מתאר את אותו דפוס ש-Forward Email חווה:

> "לאחר ניסיון לתפוס את ההזמנה, PayPal מחזיר 404. כשמביאים פרטים של ההזמנה: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **זה ללא כל סימן לתפיסה מוצלחת מצדנו.**"

### אסון האמינות של ה-Webhook {#the-webhook-reliability-disaster}

דיון נוסף [מהקהילה השמורה](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) חושף שמערכת ה-webhook של PayPal אינה אמינה ביסודה:

> "תיאורטית, אמורים להיות שני אירועים (CHECKOUT.ORDER.APPROVED ו-PAYMENT.CAPTURE.COMPLETED) מאירועי ה-Webhook. למעשה, **שני האירועים האלו מתקבלים לעיתים רחוקות מיידית, PAYMENT.CAPTURE.COMPLETED לא מתקבל ברוב הזמן או מתקבל רק אחרי כמה שעות.**"

לתשלומי מנוי:

> "**'PAYMENT.SALE.COMPLETED' לא התקבל לפעמים או רק אחרי כמה שעות.**"

השאלות של הסוחר חושפות את עומק בעיות האמינות של PayPal:

1. **"למה זה קורה?"** - מערכת ה-webhook של PayPal שבורה ביסודה
2. **"אם סטטוס ההזמנה הוא 'COMPLETED', האם ניתן להניח שקיבלתי את הכסף?"** - סוחרים לא יכולים לסמוך על תגובות ה-API של PayPal
3. **"למה 'Event Logs->Webhook Events' לא מוצא שום לוגים?"** - אפילו מערכת הלוגים של PayPal עצמה לא עובדת

### דפוס הרשלנות השיטתית {#the-pattern-of-systematic-negligence}

הראיות מתפרשות על פני 11+ שנים ומראות דפוס ברור:

* **2013**: "PayPal עובדים על זה"
* **2016**: PayPal מודה בשינוי שבור, מספק תיקון שבור
* **2024**: אותן שגיאות בדיוק עדיין מתרחשות, משפיעות על Forward Email ועל רבים אחרים

זו לא תקלה - **זו רשלנות שיטתית.** PayPal יודעת על כשלונות קריטיים בעיבוד תשלומים כבר יותר מעשור וממשיכה בעקביות:
1. **האשימו סוחרים בבאגים של PayPal**
2. **ביצעו שינויים שבורים ללא תיעוד**
3. **סיפקו תיקונים לא מספקים שלא עובדים**
4. **התעלמו מההשפעה הכלכלית על עסקים**
5. **הסתרת ראיות על ידי הסרת פורומי קהילה**

### הדרישה הבלתי מתועדת {#the-undocumented-requirement}

בשום מקום בתיעוד הרשמי של PayPal לא מציינים שסוחרים חייבים ליישם לוגיקת ניסיון חוזר עבור פעולות תפיסה. התיעוד שלהם מציין שסוחרים צריכים "לתפוס מיד לאחר אישור," אך אינו מזכיר שה-API שלהם מחזיר שגיאות 404 אקראיות שדורשות מנגנוני ניסיון חוזר מורכבים.

זה מאלץ כל סוחר:

* ליישם לוגיקת ניסיון חוזר עם התעצמות אקספוננציאלית
* להתמודד עם אספקת webhook לא עקבית
* לבנות מערכות ניהול מצב מורכבות
* לנטר תפיסות שנכשלו באופן ידני

**כל מעבד תשלומים אחר מספק APIs לתפיסה אמינים שעובדים בפעם הראשונה.**


## דפוס ההונאה הרחב של PayPal {#paypals-broader-pattern-of-deception}

אסון הבאג בתפיסה הוא רק דוגמה אחת לגישה השיטתית של PayPal להטעות לקוחות ולהסתיר את הכשלים שלהם.

### הפעולה של מחלקת השירותים הפיננסיים של ניו יורק {#the-new-york-department-of-financial-services-action}

בינואר 2025, מחלקת השירותים הפיננסיים של ניו יורק הוציאה [פעולת אכיפה נגד PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) בגין פרקטיקות מטעות, המדגימה שדפוס ההונאה של PayPal מתפרש הרבה מעבר ל-APIs שלהם.

פעולה רגולטורית זו מראה את נכונות PayPal לעסוק בפרקטיקות מטעות בכל העסק שלהם, לא רק בכלי המפתחים.

### תביעת Honey: שינוי קישורי שותפים {#the-honey-lawsuit-rewriting-affiliate-links}

רכישת Honey על ידי PayPal הובילה ל[תביעות המאשימות את Honey בשינוי קישורי שותפים](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), גניבת עמלות מיוצרי תוכן ומשפיענים. זה מייצג צורה נוספת של הונאה שיטתית שבה PayPal מרוויחה על ידי הפניית הכנסות שצריכות להגיע לאחרים.

הדפוס ברור:

1. **כשלי API**: הסתרת פונקציונליות שבורה, האשמת סוחרים
2. **שתיקת הקהילה**: הסרת ראיות לבעיות
3. **הפרות רגולטוריות**: עיסוק בפרקטיקות מטעות
4. **גניבת שותפים**: גניבת עמלות באמצעות מניפולציה טכנית

### עלות הרשלנות של PayPal {#the-cost-of-paypals-negligence}

הפסד של Forward Email בסך 1,899$ מייצג רק את קצה הקרחון. שקלו את ההשפעה הרחבה:

* **סוחרים בודדים**: אלפים מאבדים מאות עד אלפי דולרים כל אחד
* **לקוחות ארגוניים**: פוטנציאל לאובדן הכנסות במיליונים
* **זמן מפתחים**: שעות רבות של בניית פתרונות עקיפים ל-APIs השבורים של PayPal
* **אמון לקוחות**: עסקים מאבדים לקוחות בגלל כשלי התשלום של PayPal

אם שירות דוא"ל קטן אחד איבד כמעט 2,000$, והבעיה קיימת כבר מעל 11 שנים ומשפיעה על אלפי סוחרים, הנזק הכלכלי הכולל ככל הנראה מסתכם ב**מאות מיליוני דולרים**.

### שקר התיעוד {#the-documentation-lie}

התיעוד הרשמי של PayPal נכשל בעקביות לציין את המגבלות הקריטיות והבאגים שהסוחרים ייתקלו בהם. לדוגמה:

* **API תפיסה**: אין אזכור ששגיאות 404 נפוצות ודורשות לוגיקת ניסיון חוזר
* **אמינות webhook**: אין אזכור ש-webhooks לעיתים מתעכבים בשעות
* **רישום מנויים**: התיעוד מרמז שרישום אפשרי כאשר אין נקודת קצה קיימת
* **פסק זמן של סשנים**: אין אזכור לפסקי זמן אגרסיביים של 60 שניות

ההסתרה השיטתית של מידע קריטי מאלצת סוחרים לגלות את מגבלות PayPal דרך ניסוי וטעייה במערכות ייצור, שלעיתים מוביל להפסדים כלכליים.


## מה זה אומר למפתחים {#what-this-means-for-developers}

הכישלון השיטתי של PayPal לטפל בצרכים בסיסיים של מפתחים תוך איסוף משוב נרחב מראה על בעיה ארגונית יסודית. הם מתייחסים לאיסוף משוב כתחליף לתיקון בעיות בפועל.
התבנית ברורה:

1. מפתחים מדווחים על בעיות  
2. PayPal מארגנת מפגשי משוב עם מנהלים בכירים  
3. ניתנת משוב נרחב  
4. הצוותים מכירים בפערים ומבטיחים "לעקוב ולטפל"  
5. שום דבר לא מיושם  
6. מנהלים בכירים עוזבים לחברות טובות יותר  
7. צוותים חדשים מבקשים את אותו המשוב  
8. המחזור חוזר על עצמו  

בינתיים, מפתחים נאלצים לבנות פתרונות עקיפים, להתפשר על אבטחה, ולהתמודד עם ממשקי משתמש שבורים רק כדי לקבל תשלומים.

אם אתם בונים מערכת תשלום, למדו מהניסיון שלנו: בנו את [הגישה המשולשת שלכם](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) עם מספר מעבדים, אבל אל תצפו ש-PayPal תספק את הפונקציונליות הבסיסית שאתם צריכים. תכננו לבנות פתרונות עקיפים מהיום הראשון.

> פוסט זה מתעד את הניסיון שלנו במשך 11 שנים עם ה-APIs של PayPal ב-Forward Email. כל דוגמאות הקוד והקישורים הם מהמערכות הייצוריות שלנו בפועל. אנו ממשיכים לתמוך בתשלומי PayPal למרות הבעיות האלה כי לחלק מהלקוחות אין אפשרות אחרת

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
