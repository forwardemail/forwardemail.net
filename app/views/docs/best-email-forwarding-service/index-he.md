# כיצד דוא"ל מורחב מגן על הפרטיות, הדומיין והאבטחה שלך: צלילה טכנית מעמיקה {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## תוכן עניינים

* [הַקדָמָה](#foreword)
* [פילוסופיית הפרטיות של דוא"ל המשך](#the-forward-email-privacy-philosophy)
* [הטמעת SQLite: עמידות וניידות של הנתונים שלך](#sqlite-implementation-durability-and-portability-for-your-data)
* [מנגנון חכם לתור ולניסיון חוזר: הבטחת מסירת דוא"ל](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [משאבים בלתי מוגבלים עם הגבלת קצב חכמה](#unlimited-resources-with-intelligent-rate-limiting)
* [הצפנת ארגז חול לאבטחה משופרת](#sandboxed-encryption-for-enhanced-security)
* [עיבוד דוא"ל בזיכרון: ללא אחסון בדיסק לפרטיות מרבית](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [הצפנה מקצה לקצה עם OpenPGP לפרטיות מלאה](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [הגנה רב-שכבתית על תוכן לאבטחה מקיפה](#multi-layered-content-protection-for-comprehensive-security)
* [במה אנו שונים משירותי דוא"ל אחרים: יתרון הפרטיות הטכני](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [שקיפות בקוד פתוח לאימות פרטיות](#open-source-transparency-for-verifiable-privacy)
  * [ללא נעילת ספקים לפרטיות ללא פשרות](#no-vendor-lock-in-for-privacy-without-compromise)
  * [נתונים בארגז חול לבידוד אמיתי](#sandboxed-data-for-true-isolation)
  * [ניידות ובקרה של נתונים](#data-portability-and-control)
* [האתגרים הטכניים של העברת דוא"ל שמקדמת את הפרטיות](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [ניהול זיכרון לעיבוד דוא"ל ללא רישום](#memory-management-for-no-logging-email-processing)
  * [זיהוי ספאם ללא ניתוח תוכן לסינון לשמירה על פרטיות](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [שמירה על תאימות עם עיצוב שמוקדש לפרטיות](#maintaining-compatibility-with-privacy-first-design)
* [שיטות עבודה מומלצות לפרטיות עבור משתמשי דוא"ל מורחב](#privacy-best-practices-for-forward-email-users)
* [סיכום: עתיד העברת הדוא"ל הפרטית](#conclusion-the-future-of-private-email-forwarding)

## הקדמה {#foreword}

בנוף הדיגיטלי של ימינו, פרטיות הדוא"ל הפכה קריטית יותר מתמיד. עם פרצות אבטחה, חששות ממעקב ופרסום ממוקד המבוסס על תוכן דוא"ל, משתמשים מחפשים יותר ויותר פתרונות שמעניקים עדיפות לפרטיותם. ב-Forward Email, בנינו את השירות שלנו מהיסוד כאשר פרטיות היא אבן הפינה של הארכיטקטורה שלנו. פוסט זה בבלוג בוחן את היישומים הטכניים שהופכים את השירות שלנו לאחד מפתרונות העברת הדוא"ל המתמקדים ביותר בפרטיות.

## פילוסופיית הפרטיות של העברת דוא"ל {#the-forward-email-privacy-philosophy}

לפני שנצלול לפרטים הטכניים, חשוב להבין את פילוסופיית הפרטיות הבסיסית שלנו: **האימיילים שלך שייכים לך ורק לך**. עיקרון זה מנחה כל החלטה טכנית שאנו מקבלים, החל מאופן הטיפול בהעברת אימיילים ועד לאופן שבו אנו מיישמים הצפנה.

בניגוד לספקי דוא"ל רבים שסורקים את ההודעות שלך למטרות פרסום או מאחסנים אותן ללא הגבלת זמן בשרתים שלהם, Forward Email פועל בגישה שונה בתכלית:

1. **עיבוד בזיכרון בלבד** - איננו מאחסנים את האימיילים המועברים שלך בדיסק
2. **אין אחסון מטא-נתונים** - איננו שומרים תיעוד של מי שולח אימייל למי
3. **קוד פתוח 100%** - כל בסיס הקוד שלנו שקוף וניתן לביקורת
4. **הצפנה מקצה לקצה** - אנו תומכים ב-OpenPGP לתקשורת פרטית באמת

## יישום SQLite: עמידות וניידות עבור הנתונים שלך {#sqlite-implementation-durability-and-portability-for-your-data}

אחד מיתרונות הפרטיות המשמעותיים ביותר של Forward Email הוא יישום [SQLite](https://en.wikipedia.org/wiki/SQLite) שתוכנן בקפידה. כיווננו את SQLite עם הגדרות PRAGMA ספציפיות ו-[רישום כתיבה מראש (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) כדי להבטיח עמידות וניידות של הנתונים שלך, תוך שמירה על הסטנדרטים הגבוהים ביותר של פרטיות ואבטחה.

הנה מבט על איך יישמנו את SQLite עם [צ'אצ'ה20-פולי1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) כצופן להצפנה עמידה בפני קוונטים:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

יישום זה מבטיח שהנתונים שלכם לא רק מאובטחים אלא גם ניידים. אתם יכולים לקחת את האימייל שלכם וללכת בכל עת על ידי ייצוא בפורמטים [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) או SQLite. וכאשר אתם רוצים למחוק את הנתונים שלכם, הם באמת נעלמים - אנחנו פשוט מוחקים את הקבצים מאחסון הדיסק במקום להריץ פקודות SQL DELETE ROW, שיכולות להשאיר עקבות במסד הנתונים.

היבט ההצפנה הקוונטית של היישום שלנו משתמש ב-ChaCha20-Poly1305 כצופן בעת אתחול מסד הנתונים, ומספק הגנה חזקה מפני איומים נוכחיים ועתידיים על פרטיות הנתונים שלך.

## מנגנון חכם לתור ולניסיון חוזר: הבטחת מסירת דוא"ל {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

במקום להתמקד אך ורק בטיפול בכותרות, יישמנו מנגנון חכם ומתוחכם לתור ולניסיון חוזר בעזרת שיטת `getBounceInfo` שלנו. מערכת זו מבטיחה שלאימיילים שלכם יש את הסיכוי הטוב ביותר להישלח, גם כאשר מתעוררות בעיות זמניות.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> זהו קטע של שיטת `getBounceInfo` ולא המימוש המקיף בפועל. לקבלת הקוד המלא, ניתן לעיין בו ב-[גיטהאב](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

אנו מנסים לשלוח דואר שוב במשך 5 ימים, בדומה לתקני התעשייה כמו [תיקון פוסט](https://en.wikipedia.org/wiki/Postfix_\(software\)), ונותנים לבעיות זמניות זמן להיפתר מעצמן. גישה זו משפרת משמעותית את שיעורי המסירה תוך שמירה על הפרטיות.

באותו נושא, אנו גם מסירים את תוכן ההודעה של הודעות דוא"ל SMTP יוצאות לאחר מסירה מוצלחת. תקופת שמירה מוגדרת במערכת האחסון שלנו עם תקופת שמירה ברירת מחדל של 30 יום, אותה ניתן להתאים בהגדרות המתקדמות של הדומיין שלך. לאחר תקופה זו, תוכן הדוא"ל נמחק ומוחזר אוטומטית, ורק הודעת מיקום תישאר:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

גישה זו מבטיחה שהודעות הדוא"ל שנשלחו לא יישארו מאוחסנות ללא הגבלת זמן, מה שמפחית את הסיכון לדליפות נתונים או גישה בלתי מורשית לתקשורת שלכם.

## משאבים ללא הגבלה עם הגבלת קצב חכמה {#unlimited-resources-with-intelligent-rate-limiting}

בעוד ש-Forward Email מציעה מספר בלתי מוגבל של דומיינים וכינויים, יישמנו הגבלת תעריפים חכמה כדי להגן על המערכת שלנו מפני שימוש לרעה ולהבטיח שימוש הוגן עבור כל המשתמשים. לדוגמה, לקוחות שאינם ארגוניים יכולים ליצור עד 50+ כינויים ביום, מה שמונע ספאם והצפה של מסד הנתונים שלנו, ומאפשר לתכונות ההגנה והניצול לרעה בזמן אמת שלנו לתפקד ביעילות.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

גישה מאוזנת זו מספקת לך את הגמישות ליצור כמה כתובות דוא"ל שתצטרך לצורך ניהול מקיף של פרטיות, תוך שמירה על שלמות וביצועי השירות שלנו עבור כל המשתמשים.

## הצפנה בארגז חול לאבטחה משופרת {#sandboxed-encryption-for-enhanced-security}

גישת ההצפנה הייחודית שלנו, המבוססת על ארגז חול, מספקת יתרון אבטחה קריטי שמשתמשים רבים מתעלמים ממנו בבחירת שירות דוא"ל. בואו נחקור מדוע הצפנת נתונים, ובמיוחד דוא"ל, כל כך חשובה.

שירותים כמו Gmail ו-Proton ככל הנראה משתמשים ב-[מסדי נתונים יחסיים](https://en.wikipedia.org/wiki/Relational_database) משותף, מה שיוצר פגיעות אבטחה בסיסית. בסביבת מסד נתונים משותף, אם מישהו מקבל גישה לנתונים של משתמש אחד, יש לו פוטנציאל לגישה גם לנתונים של משתמשים אחרים. הסיבה לכך היא שכל נתוני המשתמש נמצאים באותן טבלאות מסד נתונים, מופרדות רק על ידי מזהי משתמש או מזהים דומים.

גישה שונה באופן מהותי של "העברת דוא"ל" עם הצפנת ארגז החול שלנו:

1. **בידוד מוחלט**: נתוני כל משתמש מאוחסנים בקובץ מסד נתונים SQLite מוצפן משלו, מבודד לחלוטין ממשתמשים אחרים.
2. **מפתחות הצפנה עצמאיים**: כל מסד נתונים מוצפן עם מפתח ייחודי משלו הנגזר מסיסמת המשתמש.
3. **ללא אחסון משותף**: בניגוד למסדי נתונים יחסיים שבהם כל האימיילים של המשתמשים עשויים להיות בטבלת "אימיילים" אחת, הגישה שלנו מבטיחה אי ערבוב נתונים.
4. **הגנה מעמיקה**: גם אם מסד נתונים של משתמש אחד נפרץ בצורה כלשהי, הוא לא יספק גישה לנתונים של אף משתמש אחר.

גישת ארגז חול זו דומה לשמירת הדוא"ל שלך בכספת פיזית נפרדת במקום במתקן אחסון משותף עם מחיצות פנימיות. זהו הבדל ארכיטקטוני מהותי שמשפר משמעותית את הפרטיות והאבטחה שלך.

## עיבוד דוא"ל בזיכרון: אין אחסון בדיסק לפרטיות מרבית {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

עבור שירות העברת הדוא"ל שלנו, אנו מעבדים דוא"ל לחלוטין בזיכרון RAM ולעולם לא כותבים אותם לאחסון דיסק או למסדי נתונים. גישה זו מספקת הגנה ללא תחרות מפני מעקב אחר דוא"ל ואיסוף מטא-נתונים.

הנה מבט פשוט על אופן עיבוד הדוא"ל שלנו:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```

גישה זו משמעותה שגם אם השרתים שלנו ייפגעו, לא יהיו נתוני דוא"ל היסטוריים שתוקפים יוכלו לגשת אליהם. הדוא"ל שלך פשוט עובר דרך המערכת שלנו ומועבר מיד ליעדו מבלי להשאיר עקבות. גישת העברת דוא"ל זו, ללא רישום, היא בסיסית להגנה על התקשורת שלך מפני מעקב.

## הצפנה מקצה לקצה עם OpenPGP לפרטיות מלאה {#end-to-end-encryption-with-openpgp-for-complete-privacy}

עבור משתמשים הזקוקים לרמת הגנת הפרטיות הגבוהה ביותר מפני מעקב אחר דוא"ל, אנו תומכים ב-[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) להצפנה מקצה לקצה. בניגוד לספקי דוא"ל רבים הדורשים גשרים או אפליקציות קנייניות, היישום שלנו עובד עם לקוחות דוא"ל סטנדרטיים, מה שהופך תקשורת מאובטחת לנגישה לכולם.

כך אנו מיישמים הצפנת OpenPGP:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

יישום זה מבטיח שהאימיילים שלך מוצפנים לפני שהם עוזבים את המכשיר שלך ורק הנמען המיועד יוכל לפענח אותם, תוך שמירה על פרטיות התקשורת שלך גם מאיתנו. זה חיוני להגנה על תקשורת רגישה מפני גישה ומעקב בלתי מורשית.

## הגנה רב-שכבתית על תוכן לאבטחה מקיפה {#multi-layered-content-protection-for-comprehensive-security}

העברת דוא"ל מציעה שכבות מרובות של הגנה על תוכן המופעלות כברירת מחדל כדי לספק אבטחה מקיפה מפני איומים שונים:

1. **הגנה מפני תוכן למבוגרים** - מסנן תוכן לא הולם מבלי לפגוע בפרטיות
2. **הגנה מפני [פישינג](https://en.wikipedia.org/wiki/Phishing)** - חוסם ניסיונות לגניבת המידע שלך תוך שמירה על אנונימיות
3. **הגנה מפני קבצים מבוצעים** - מונעת קבצים מצורפים שעלולים להזיק ללא סריקת תוכן
4. **הגנה מפני [נגיף](https://en.wikipedia.org/wiki/Computer_virus)** - סורק אחר תוכנות זדוניות באמצעות טכניקות לשמירה על פרטיות

בניגוד לספקים רבים המאפשרים הפעלה עצמית של תכונות אלו, ביצענו ביטול הסכמה, מה שמבטיח שכל המשתמשים ייהנו מהגנות אלו כברירת מחדל. גישה זו משקפת את מחויבותנו לפרטיות ולאבטחה כאחד, ומספקת איזון ששירותי דוא"ל רבים אינם מצליחים להשיג.

## במה אנו שונים משירותי דוא"ל אחרים: יתרון הפרטיות הטכני {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

כאשר משווים את שירותי "Forward Email" לשירותי דוא"ל אחרים, מספר הבדלים טכניים מרכזיים מדגישים את הגישה שלנו שמקדמת את הפרטיות:

### שקיפות בקוד פתוח לאימות פרטיות {#open-source-transparency-for-verifiable-privacy}

בעוד שספקי דוא"ל רבים טוענים שהם קוד פתוח, הם נוטים לשמור על קוד ה-backend שלהם סגור. דוא"ל המשך הוא 100% [קוד פתוח](https://en.wikipedia.org/wiki/Open_source), כולל קוד frontend ו-backend. שקיפות זו מאפשרת ביקורת אבטחה עצמאית של כל הרכיבים, מה שמבטיח שכל אחד יוכל לאמת את טענות הפרטיות שלנו.

### ללא נעילת ספק לשמירה על פרטיות ללא פשרות {#no-vendor-lock-in-for-privacy-without-compromise}

ספקי דוא"ל רבים המתמקדים בפרטיות דורשים ממך להשתמש באפליקציות או בגשרים הקנייניים שלהם. Forward Email פועל עם כל תוכנת דוא"ל סטנדרטית דרך הפרוטוקולים [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) ו-[SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), ומעניקים לך את החופש לבחור את תוכנת הדוא"ל המועדפת עליך מבלי להתפשר על הפרטיות.

### נתונים בארגז חול עבור בידוד אמיתי {#sandboxed-data-for-true-isolation}

בניגוד לשירותים המשתמשים במסדי נתונים משותפים שבהם כל נתוני המשתמשים מעורבבים, הגישה שלנו, המבוססת על ארגז חול, מבטיחה שהנתונים של כל משתמש מבודדים לחלוטין. הבדל ארכיטקטוני מהותי זה מספק ערבויות פרטיות חזקות משמעותית ממה שמציעים רוב שירותי הדוא"ל.

### ניידות ובקרה של נתונים {#data-portability-and-control}

אנו מאמינים שהנתונים שלך שייכים לך, ולכן אנו מאפשרים לך לייצא בקלות את האימיילים שלך בפורמטים סטנדרטיים (MBOX, EML, SQLite) ולמחוק אותם מתי שתרצו. רמת שליטה זו נדירה בקרב ספקי אימייל אך חיונית לפרטיות אמיתית.

## האתגרים הטכניים של העברת דוא"ל המתמקדת בפרטיות {#the-technical-challenges-of-privacy-first-email-forwarding}

בניית שירות דוא"ל שמקדים את הפרטיות כולה כרוך באתגרים טכניים משמעותיים. הנה כמה מהמכשולים שהתגברנו עליהם:

### ניהול זיכרון לעיבוד דוא"ל ללא רישום {#memory-management-for-no-logging-email-processing}

עיבוד דוא"ל בזיכרון ללא אחסון בדיסק דורש ניהול זיכרון קפדני כדי להתמודד ביעילות עם כמויות גדולות של תעבורת דוא"ל. יישמנו טכניקות מתקדמות לאופטימיזציה של זיכרון כדי להבטיח ביצועים אמינים מבלי להתפשר על מדיניות אי-האחסון שלנו, מרכיב קריטי באסטרטגיית הגנת הפרטיות שלנו.

### זיהוי ספאם ללא ניתוח תוכן לסינון לשמירה על פרטיות {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

רוב מערכות הזיהוי [ספאם](https://en.wikipedia.org/wiki/Email_spam) מסתמכות על ניתוח תוכן דוא"ל, דבר שסותר את עקרונות הפרטיות שלנו. פיתחנו טכניקות לזיהוי דפוסי ספאם מבלי לקרוא את תוכן הדוא"ל שלך, תוך איזון בין פרטיות לשימושיות תוך שמירה על סודיות התקשורת שלך.

### שמירה על תאימות עם עיצוב שמתמקד בפרטיות {#maintaining-compatibility-with-privacy-first-design}

הבטחת תאימות עם כל לקוחות הדוא"ל תוך יישום תכונות פרטיות מתקדמות דרשה פתרונות הנדסיים יצירתיים. הצוות שלנו עבד ללא לאות כדי להפוך את הפרטיות לחלקה, כך שלא תצטרכו לבחור בין נוחות לאבטחה בעת הגנה על תקשורת הדוא"ל שלכם.

## שיטות עבודה מומלצות לפרטיות עבור משתמשי דוא"ל העברת דוא"ל {#privacy-best-practices-for-forward-email-users}

כדי למקסם את ההגנה שלך מפני מעקב דוא"ל ולמקסם את פרטיותך בעת שימוש בדוא"ל מורחב, אנו ממליצים על שיטות העבודה המומלצות הבאות:

1. **השתמשו בכינויים ייחודיים עבור שירותים שונים** - צרו כינוי דוא"ל שונה עבור כל שירות שאליו אתם נרשמים כדי למנוע מעקב בין שירותים
2. **הפעילו הצפנת OpenPGP** - עבור תקשורת רגישה, השתמשו בהצפנה מקצה לקצה כדי להבטיח פרטיות מלאה
3. **החליפו באופן קבוע את כינויי הדוא"ל שלכם** - עדכנו מעת לעת כינויים עבור שירותים חשובים כדי למזער איסוף נתונים לטווח ארוך
4. **השתמשו בסיסמאות חזקות וייחודיות** - הגנו על חשבון הדוא"ל שלכם באמצעות סיסמה חזקה כדי למנוע גישה לא מורשית
5. **הטמיעו אנונימיזציה של [כתובת IP](https://en.wikipedia.org/wiki/IP_address)** - שקלו להשתמש ב-[VPN](https://en.wikipedia.org/wiki/Virtual_private_network) בשילוב עם דוא"ל מורשה לאנונימיזציה מוחלטת

## סיכום: עתיד העברת דוא"ל פרטי {#conclusion-the-future-of-private-email-forwarding}

ב-Forward Email, אנו מאמינים שפרטיות אינה רק תכונה - זוהי זכות יסוד. היישומים הטכניים שלנו משקפים אמונה זו, ומספקים לכם העברת דוא"ל המכבדת את פרטיותכם בכל רמה ומגנה עליכם מפני מעקב אחר דוא"ל ואיסוף מטא-נתונים.

ככל שאנו ממשיכים לפתח ולשפר את השירות שלנו, המחויבות שלנו לפרטיות נותרה בלתי מעורערת. אנו חוקרים כל הזמן שיטות הצפנה חדשות, בוחנים הגנות נוספות על הפרטיות ומשפרים את בסיס הקוד שלנו כדי לספק את חוויית הדוא"ל המאובטחת ביותר האפשרית.

בבחירת "העברת דוא"ל", אתם לא רק בוחרים שירות דוא"ל - אתם תומכים בחזון אינטרנט שבו פרטיות היא ברירת המחדל, לא היוצא מן הכלל. הצטרפו אלינו בבניית עתיד דיגיטלי פרטי יותר, דוא"ל אחד בכל פעם.

<!-- *מילות מפתח: העברת דוא"ל פרטית, הגנת פרטיות דוא"ל, שירות דוא"ל מאובטח, דוא"ל בקוד פתוח, הצפנה בטוחה קוונטית, דוא"ל OpenPGP, עיבוד דוא"ל בזיכרון, שירות דוא"ל ללא רישום, הגנה על מטא-נתונים של דוא"ל, פרטיות כותרת דוא"ל, דוא"ל מוצפן מקצה לקצה, דוא"ל שקודם כל פרטיות, העברת דוא"ל אנונימית, שיטות עבודה מומלצות לאבטחת דוא"ל, הגנה על תוכן דוא"ל, הגנה מפני פישינג, סריקת וירוסים בדוא"ל, ספק דוא"ל ממוקד פרטיות, כותרות דוא"ל מאובטחות, יישום פרטיות דוא"ל, הגנה מפני מעקב דוא"ל, העברת דוא"ל ללא רישום, מניעת דליפת מטא-נתונים של דוא"ל, טכניקות לפרטיות דוא"ל, אנונימיזציה של כתובות IP עבור דוא"ל, כינויי דוא"ל פרטיים, אבטחת העברת דוא"ל, פרטיות דוא"ל ממפרסמים, הצפנת דוא"ל עמידה קוונטית, פרטיות דוא"ל ללא פשרות, אחסון דוא"ל של SQLite, הצפנת דוא"ל בארגז חול, ניידות נתונים עבור דוא"ל* -->