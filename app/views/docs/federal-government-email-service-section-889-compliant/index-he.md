# העברת דואר אלקטרוני: פתרון העברת דואר אלקטרוני התואם לסעיף 889 שלך {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="שירות דואר אלקטרוני ממשלתי תואם לסעיף 889" class="rounded-lg" />


## תוכן העניינים {#table-of-contents}

* [הקדמה](#foreword)
* [הבנת תאימות לסעיף 889](#understanding-section-889-compliance)
* [כיצד Forward Email משיג תאימות לסעיף 889](#how-forward-email-achieves-section-889-compliance)
  * [המחויבות של Cloudflare](#cloudflares-commitment)
  * [התשתית של DataPacket](#datapackets-infrastructure)
* [מעבר לסעיף 889: תאימות ממשלתית רחבה יותר](#beyond-section-889-broader-government-compliance)
* [הדרך שלנו קדימה: הרחבת אופקי התאימות](#our-path-forward-expanding-compliance-horizons)
* [מדוע זה חשוב עבורך](#why-this-matters-for-you)
* [העברת דואר אלקטרוני מאובטחת ותואמת מתחילה כאן](#secure-compliant-email-forwarding-starts-here)
* [מקורות](#references)


## הקדמה {#foreword}

ב-Forward Email, אנו מאמינים בהעברת דואר אלקטרוני פשוטה, מאובטחת ופרטית לכולם. אנו יודעים שעבור ארגונים רבים, במיוחד אלה שעובדים עם ממשלת ארה"ב, תאימות אינה רק מונח שיווקי – היא הכרח. הבטחת עמידה ב**תקנות הפדרליות לדואר אלקטרוני** היא קריטית. לכן אנו גאים לאשר ששירות ה**העברת הדואר האלקטרוני המאובטח** שלנו בנוי לעמוד בדרישות הפדרליות המחמירות, כולל [סעיף 889](https://www.acquisition.gov/Section-889-Policies) של [חוק הסמכת ההגנה הלאומית (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act).

המחויבות שלנו ל**תאימות דואר אלקטרוני ממשלתית** הוכחה לאחרונה כאשר **האקדמיה הימית של ארה"ב** פנתה ל-**Forward Email**. הם דרשו שירותי **העברת דואר אלקטרוני מאובטחת** וזקקו לתיעוד המאשר את עמידתנו בתקנות הפדרליות, כולל **תאימות לסעיף 889**. ניסיון זה משמש כמקרה מבחן חשוב, המדגים את מוכנותנו ויכולתנו לתמוך בארגונים הממומנים על ידי הממשלה ולעמוד בדרישות המחמירות שלהם. מסירות זו מתפרסת על כל המשתמשים שלנו המחפשים פתרון דואר אלקטרוני אמין ו**ממוקד פרטיות**.


## הבנת תאימות לסעיף 889 {#understanding-section-889-compliance}

מהו סעיף 889? בפשטות, זהו חוק פדרלי בארה"ב האוסר על סוכנויות ממשלתיות להשתמש או להתקשר עם גופים המשתמשים בציוד או שירותי תקשורת ווידאו מסוימים מחברות ספציפיות (כמו Huawei, ZTE, Hikvision, Dahua ו-Hytera). כלל זה, שלעיתים מקושר ל**איסור Huawei** ו**איסור ZTE**, מסייע בהגנה על הביטחון הלאומי.

> \[!NOTE]
> סעיף 889 מתמקד במיוחד בציוד ושירותים של Huawei, ZTE, Hytera, Hikvision ו-Dahua, כולל חברות הבת והשותפים שלהם.

עבור **שירות העברת דואר אלקטרוני לחוזים ממשלתיים** כמו **Forward Email**, משמעות הדבר היא להבטיח שאף אחד מספקי התשתית שלנו לא משתמש בציוד האסור הזה, מה שהופך אותנו ל**תואמים לסעיף 889**.


## כיצד Forward Email משיג תאימות לסעיף 889 {#how-forward-email-achieves-section-889-compliance}

אז, **כיצד Forward Email תואם לסעיף 889?** אנו משיגים זאת באמצעות בחירה קפדנית של שותפי התשתית שלנו. **Forward Email** מסתמך בלעדית על שני ספקים מרכזיים עבור **תשתית תואמת לסעיף 889**:

1. **[Cloudflare](https://www.cloudflare.com/):** השותף הראשי שלנו לשירותי רשת ו**אבטחת דואר אלקטרוני של Cloudflare**.
2. **[DataPacket](https://datapacket.com/):** הספק הראשי שלנו לתשתית שרתים (אנו משתמשים ב-[Digital Ocean](https://www.digitalocean.com/) ו/או [Vultr](https://www.vultr.com/) לגיבוי וכבר בקרוב נעבור לשימוש בלעדי ב-DataPacket – כמובן שאישרנו בכתב את תאימות סעיף 889 משני ספקי הגיבוי הללו).

> \[!IMPORTANT]
> ההסתמכות הבלעדית שלנו על Cloudflare ו-DataPacket, שאף אחד מהם אינו משתמש בציוד האסור בסעיף 889, היא אבן היסוד של התאימות שלנו.
גם [Cloudflare](https://www.cloudflare.com/) וגם [DataPacket](https://datapacket.com/) מחויבים לסטנדרטים גבוהים של אבטחה ואינם משתמשים בציוד האסור תחת סעיף 889. **השימוש ב-Cloudflare ו-DataPacket לצורך עמידה בסעיף 889** הוא יסודי לשירות שלנו.

### המחויבות של Cloudflare {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) מתייחסת במפורש ל**עמידה בסעיף 889** ב**[קוד ההתנהגות של צד שלישי](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)** שלה. הם מציינים:

> "על פי סעיף 889 של חוק הסמכת ההגנה הלאומית (NDAA), Cloudflare אינה משתמשת, ואינה מאפשרת בשרשרת האספקה שלה, ציוד תקשורת, מוצרי פיקוח וידאו או שירותים המיוצרים או מסופקים על ידי Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company, או Dahua Technology Company (או כל חברה בת או שותפה של ישויות אלו)."

*(מקור: קוד ההתנהגות של צד שלישי של Cloudflare, נשלף ב-29 באפריל 2025)*

הצהרה ברורה זו מאשרת כי התשתית של [Cloudflare](https://www.cloudflare.com/), שעליה נשען **Forward Email**, עומדת בדרישות סעיף 889.

### התשתית של DataPacket {#datapackets-infrastructure}

[DataPacket](https://datapacket.com/), ספק השרתים שלנו, משתמש בציוד רשת בלעדי של **Arista Networks** ו-**Cisco**. לא אריסטה ולא סיסקו נמצאים בין החברות האסורות תחת סעיף 889. שתיהן ספקיות מבוססות ונפוצות בסביבות ארגוניות וממשלתיות מאובטחות, הידועות בעמידה בסטנדרטים מחמירים של אבטחה וציות.

על ידי שימוש רק ב-[Cloudflare](https://www.cloudflare.com/) ו-[DataPacket](https://datapacket.com/), **Forward Email** מבטיחה שכל שרשרת אספקת השירות שלה נקייה מציוד האסור תחת סעיף 889, ומספקת **הפניית דואר אלקטרוני מאובטחת לסוכנויות פדרליות** ולמשתמשים אחרים הרגישים לאבטחה.


## מעבר לסעיף 889: ציות ממשלתי רחב יותר {#beyond-section-889-broader-government-compliance}

המחויבות שלנו ל**אבטחת דואר אלקטרוני ממשלתי** וציות חורגת מעבר לסעיף 889. בעוד ש**Forward Email** עצמה אינה מעבדת או מאחסנת ישירות נתונים ממשלתיים רגישים כמו [מידע בלתי מסווג מבוקר (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) באותה צורה שפלטפורמת SaaS גדולה עשויה, הארכיטקטורה של **הפניית הדואר האלקטרוני בקוד פתוח** שלנו והסתמכות על ספקים מאובטחים וצייתנים מתיישבת עם עקרונות של תקנות מרכזיות נוספות:

* **[FAR (תקנות הרכש הפדרליות)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** באמצעות שימוש בתשתית צייתנית והצעת שירות מסחרי פשוט, אנו מספקים עקרונות של הפניית דואר אלקטרוני התואמים ל-FAR המתאימים לקבלני ממשלה.
* חוק הפרטיות ו-[FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** אנו **מתמקדים בפרטיות** כברירת מחדל, ומציעים עקרונות של דואר אלקטרוני לפי חוק הפרטיות. איננו מאחסנים את המיילים שלך. המיילים מנותבים ישירות, מה שממזער טיפול בנתונים. ספקי התשתית שלנו ([Cloudflare](https://www.cloudflare.com/), [DataPacket](https://datapacket.com/)) מנהלים את מערכותיהם בהתאם לסטנדרטים גבוהים של אבטחה התואמים לעקרונות של דואר אלקטרוני צייתני ל-FISMA.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** לארגונים הזקוקים ל**הפניית דואר אלקטרוני התואמת ל-HIPAA**, **Forward Email** יכולה להיות חלק מפתרון צייתני. מאחר שאיננו מאחסנים מיילים, האחריות העיקרית לציות מוטלת על מערכות הדואר האלקטרוני בקצה. עם זאת, שכבת ההעברה המאובטחת שלנו תומכת בדרישות HIPAA כאשר משתמשים בה כראוי.

> \[!WARNING]
> ייתכן ויידרש [הסכם שותפות עסקית (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement) עם ספק הדואר האלקטרוני הסופי שלך, ולא עם **Forward Email** עצמה, מאחר שאיננו מאחסנים את תוכן המייל שלך (אלא אם כן אתה משתמש ב[שכבת האחסון המוצפנת IMAP/POP3 שלנו](/blog/docs/best-quantum-safe-encrypted-email-service)).
## הנתיב שלנו קדימה: הרחבת אופקי הציות {#our-path-forward-expanding-compliance-horizons}

בעוד שהציות שלנו לסעיף 889 מספק בסיס חיוני, במיוחד לקבלני ממשלה פדרליים, אנו מבינים שלארגונים וסוכנויות ממשלתיות שונות יש צרכים רגולטוריים מגוונים ומתפתחים. ב-**Forward Email**, שקיפות היא המפתח, ואנו רוצים לשתף את נקודת המבט שלנו על נוף הציות הרחב יותר ועל הכיוון העתידי שלנו.

אנו מכירים בחשיבותם של מסגרות ותקנות כגון:

* **[מערכת לניהול מענקים (SAM)](https://sam.gov/):** חיונית לקבלנות פדרלית ישירה.
* **[FAR (תקנות הרכש הפדרליות)](https://www.acquisition.gov/browse/index/far):** כולל סעיפים סטנדרטיים כמו [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) לשירותים מסחריים.
* **[DFARS (תוספת לתקנות הרכש הפדרליות של ההגנה)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** במיוחד [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.) לשירותי ענן של משרד ההגנה.
* **[CMMC (תעודת בגרות אבטחת סייבר)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** נדרשת לקבלני משרד ההגנה המטפלים ב-[מידע חוזי פדרלי (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) או CUI.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** הבסיס ל-CMMC רמה 2, המתמקד בהגנה על CUI. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - המכון הלאומי לתקנים וטכנולוגיה)
* **[FedRAMP (תוכנית ניהול סיכונים ואישור פדרלית)](https://en.wikipedia.org/wiki/FedRAMP):** התקן לשירותי ענן המשמשים סוכנויות פדרליות.
* **[FISMA (חוק מודרניזציה לאבטחת מידע פדרלי)](https://www.cisa.gov/topics/cybersecurity-best-practices/fisma):** המסגרת הכוללת לאבטחת מידע פדרלית.
* **[HIPAA (חוק ניידות ואחריות ביטוח בריאות)](https://www.hhs.gov/hipaa/index.html):** לטיפול במידע רפואי מוגן (PHI).
* **[FERPA (חוק זכויות פרטיות חינוכיות משפחתיות)](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act):** להגנה על רשומות חינוך של תלמידים.
* **[COPPA (חוק הגנת פרטיות מקוונת לילדים)](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act):** לשירותים המטפלים בילדים מתחת לגיל 13.

**המעמד הנוכחי שלנו והמטרות לעתיד:**

העיצוב הליבה של **Forward Email** – היותו **ממוקד בפרטיות**, **קוד פתוח**, ומזער טיפול בנתונים (במיוחד בשירות ה-**העברת דואר אלקטרוני** הבסיסי שלנו) – מתאים היטב ל*עקרונות* מאחורי רבות מהתקנות הללו. נהלי האבטחה הקיימים שלנו (הצפנה, תמיכה בסטנדרטים מודרניים של דואר אלקטרוני) והציות לסעיף 889 מספקים נקודת התחלה חזקה.

עם זאת, השגת אישור פורמלי או הרשאה למסגרות כמו **FedRAMP** או **CMMC** היא משימה משמעותית. היא כוללת תיעוד קפדני, יישום בקרות טכניות ופרוצדורליות ספציפיות (לעיתים מאות מהן), הערכות עצמאיות (כמו [3PAO](https://www.fedramp.gov/glossary/#3pao) עבור FedRAMP - ארגון הערכה צד שלישי), ומעקב מתמשך.

> \[!IMPORTANT]
> ציות אינו רק טכנולוגיה; מדובר בתהליכים מתועדים, מדיניות, וערנות מתמשכת. השגת תעודות כמו FedRAMP או CMMC דורשת השקעה משמעותית וזמן.

**המחויבות שלנו:**

ככל ש-**Forward Email** גדלה וככל שצרכי הלקוחות שלנו מתפתחים, אנו מחויבים לחקור ולרדוף אחר תעודות ציות רלוונטיות. זה כולל תוכניות ל:

1. **רישום ב-SAM:** להקל על מעורבות ישירה עם סוכנויות פדרליות בארה"ב.
2. **פורמליזציה של תהליכים:** שיפור התיעוד והנהלים הפנימיים שלנו כדי להתאים לסטנדרטים כמו NIST SP 800-171, שהוא הבסיס ל-CMMC.
3. **הערכת דרכי FedRAMP:** בחינת הדרישות והאפשרות לרדוף אחר הרשאת FedRAMP, ככל הנראה החל מרמת Low או Moderate, תוך ניצול מודל [LI-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) במידת הצורך.
4. **תמיכה בצרכים ספציפיים:** התייחסות לדרישות כמו HIPAA (אולי באמצעות BAAs וקונפיגורציות ספציפיות לנתונים מאוחסנים) ו-FERPA (באמצעות תנאים וחוזים מתאימים ובקרות) ככל שנעסוק יותר עם מוסדות בריאות וחינוך.
המסע הזה דורש תכנון והשקעה זהירים. למרות שאין לנו לוחות זמנים מיידיים לכל האישורים, חיזוק עמידתנו בתקנות כדי לענות על הצרכים של ממשלות ותעשיות מפוקחות הוא חלק מרכזי במפת הדרך שלנו.

> \[!NOTE]
> אנו מאמינים שהטבע **קוד פתוח** שלנו מספק שקיפות ייחודית לאורך כל התהליך הזה, ומאפשר לקהילה וללקוחות שלנו לראות את המחויבות שלנו ממקור ראשון.

נמשיך לעדכן את הקהילה שלנו ככל שנגיע לאבני דרך משמעותיות במסע העמידה שלנו בתקנות.


## למה זה חשוב לך {#why-this-matters-for-you}

בחירת שירות **העברת דואר אלקטרוני התואם לסעיף 889** כמו **Forward Email** משמעותה:

* **שקט נפשי:** במיוחד עבור סוכנויות ממשלתיות, קבלנים וארגונים הרגישים לאבטחה.
* **הפחתת סיכון:** נמנע קונפליקטים פוטנציאליים עם **תקנות פדרליות לדואר אלקטרוני**.
* **אמון:** מראה מחויבות לאבטחה ולשלמות שרשרת האספקה.

**Forward Email** מספק דרך פשוטה, אמינה ו*תואמת* לניהול צרכי **העברת דואר אלקטרוני** עם דומיין מותאם אישית.


## העברת דואר אלקטרוני מאובטחת ותואמת מתחילה כאן {#secure-compliant-email-forwarding-starts-here}

**Forward Email** מחויבת לספק שירות **העברת דואר אלקטרוני מאובטח, פרטי וקוד פתוח**. העמידה שלנו ב**סעיף 889**, שהושגה באמצעות שותפות עם [Cloudflare](https://www.cloudflare.com/) ו-[DataPacket](https://datapacket.com/) (המייצגת את עבודת **Forward Email בהתאמה לאקדמיה הימית של ארה"ב**), היא עדות למחויבות זו. בין אם אתם גוף ממשלתי, קבלן, או פשוט מעריכים **אבטחת דואר ממשלתית**, **Forward Email** נבנתה עבורכם.

מוכנים ל**העברת דואר אלקטרוני מאובטחת ותואמת**? [הירשמו בחינם היום!](https://forwardemail.net)


## מקורות {#references}

* **סעיף 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **קוד התנהגות צד שלישי של Cloudflare:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **DataPacket:** <https://datapacket.com/>
* **מערכת לניהול מענקים (SAM):** <https://sam.gov/>
* **תקנות הרכש הפדרליות (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **תוספת לתקנות הרכש הפדרליות להגנה (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **תעודת בגרות למודל אבטחת סייבר (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://csrc.nist.gov/pubs/sp/800/171/r3/final>
* **תוכנית ניהול סיכונים ואישורים פדרלית (FedRAMP):** <https://www.fedramp.gov/>
* **חוק מודרניזציה לאבטחת מידע פדרלית (FISMA):** <https://www.cisa.gov/topics/cybersecurity-best-practices/fisma>
* **חוק ניידות ואחריות ביטוח בריאות (HIPAA):** <https://www.hhs.gov/hipaa/index.html>
* **חוק זכויות פרטיות חינוכיות משפחתיות (FERPA):** <https://studentprivacy.ed.gov/ferpa>
* **חוק הגנת פרטיות מקוונת לילדים (COPPA):** <https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa>
