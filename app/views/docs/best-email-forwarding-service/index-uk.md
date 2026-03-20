# Як Forward Email захищає вашу конфіденційність, домен і безпеку: технічний глибокий аналіз {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Порівняння найкращих сервісів переадресації електронної пошти" class="rounded-lg" />


## Зміст {#table-of-contents}

* [Передмова](#foreword)
* [Філософія конфіденційності Forward Email](#the-forward-email-privacy-philosophy)
* [Реалізація SQLite: надійність і портативність ваших даних](#sqlite-implementation-durability-and-portability-for-your-data)
* [Інтелектуальна черга та механізм повторної спроби: забезпечення доставки електронної пошти](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Необмежені ресурси з інтелектуальним обмеженням швидкості](#unlimited-resources-with-intelligent-rate-limiting)
* [Ізольоване шифрування для підвищеної безпеки](#sandboxed-encryption-for-enhanced-security)
* [Обробка електронної пошти в пам’яті: без збереження на диску для максимальної конфіденційності](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Кінцева шифровка з OpenPGP для повної конфіденційності](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Багаторівневий захист вмісту для комплексної безпеки](#multi-layered-content-protection-for-comprehensive-security)
* [Чим ми відрізняємося від інших сервісів електронної пошти: технічна перевага конфіденційності](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Прозорість з відкритим кодом для перевіреної конфіденційності](#open-source-transparency-for-verifiable-privacy)
  * [Відсутність прив’язки до постачальника для конфіденційності без компромісів](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Ізольовані дані для справжньої ізоляції](#sandboxed-data-for-true-isolation)
  * [Портативність і контроль даних](#data-portability-and-control)
* [Технічні виклики приватної переадресації електронної пошти](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Управління пам’яттю для обробки електронної пошти без логування](#memory-management-for-no-logging-email-processing)
  * [Виявлення спаму без аналізу вмісту для фільтрації збереження конфіденційності](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Підтримка сумісності з дизайном, орієнтованим на конфіденційність](#maintaining-compatibility-with-privacy-first-design)
* [Кращі практики конфіденційності для користувачів Forward Email](#privacy-best-practices-for-forward-email-users)
* [Висновок: майбутнє приватної переадресації електронної пошти](#conclusion-the-future-of-private-email-forwarding)


## Передмова {#foreword}

У сучасному цифровому світі конфіденційність електронної пошти стала важливішою, ніж будь-коли. Через витоки даних, занепокоєння щодо спостереження та таргетовану рекламу на основі вмісту електронної пошти користувачі все частіше шукають рішення, які ставлять їхню конфіденційність на перше місце. У Forward Email ми побудували наш сервіс з нуля, зробивши конфіденційність основою нашої архітектури. Цей блог-пост досліджує технічні реалізації, які роблять наш сервіс одним із найконфіденційніших рішень для переадресації електронної пошти.


## Філософія конфіденційності Forward Email {#the-forward-email-privacy-philosophy}

Перед тим, як заглибитися в технічні деталі, важливо зрозуміти нашу фундаментальну філософію конфіденційності: **ваші електронні листи належать вам і тільки вам**. Цей принцип керує кожним технічним рішенням, яке ми приймаємо, від того, як ми обробляємо переадресацію електронної пошти, до того, як ми реалізуємо шифрування.

На відміну від багатьох провайдерів електронної пошти, які сканують ваші повідомлення для рекламних цілей або зберігають їх необмежено на своїх серверах, Forward Email працює за радикально іншою моделлю:

1. **Обробка лише в пам’яті** — ми не зберігаємо ваші переадресовані листи на диску
2. **Відсутність збереження метаданих** — ми не ведемо записи про те, хто кому надсилає листи
3. **100% відкритий код** — весь наш код прозорий і піддається аудиту
4. **Кінцева шифровка** — ми підтримуємо OpenPGP для справді приватного спілкування


## Реалізація SQLite: надійність і портативність ваших даних {#sqlite-implementation-durability-and-portability-for-your-data}

Однією з найважливіших переваг конфіденційності Forward Email є наша ретельно налаштована реалізація [SQLite](https://en.wikipedia.org/wiki/SQLite). Ми оптимізували SQLite за допомогою спеціальних налаштувань PRAGMA та [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), щоб забезпечити як надійність, так і портативність ваших даних, при цьому підтримуючи найвищі стандарти конфіденційності та безпеки.
Ось як ми реалізували SQLite з [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) як шифр для квантово-стійкого шифрування:

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

Ця реалізація гарантує, що ваші дані не лише захищені, а й портативні. Ви можете взяти свою електронну пошту і піти в будь-який момент, експортувавши її у форматах [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) або SQLite. А коли ви хочете видалити свої дані, вони справді зникають – ми просто видаляємо файли з дискового сховища, а не виконуємо SQL-команди DELETE ROW, які можуть залишати сліди в базі даних.

Квантово-шифрувальний аспект нашої реалізації використовує ChaCha20-Poly1305 як шифр при ініціалізації бази даних, забезпечуючи надійний захист від як сучасних, так і майбутніх загроз вашій приватності даних.


## Розумна черга та механізм повторних спроб: забезпечення доставки електронної пошти {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Замість того, щоб зосереджуватися лише на обробці заголовків, ми реалізували складну розумну чергу та механізм повторних спроб за допомогою нашого методу `getBounceInfo`. Ця система гарантує, що ваші електронні листи мають найкращі шанси бути доставленими, навіть коли виникають тимчасові проблеми.

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
> Це витяг з методу `getBounceInfo`, а не повна розгорнута реалізація. Повний код ви можете переглянути на [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Ми повторюємо спроби доставки пошти протягом 5 днів, подібно до галузевих стандартів, таких як [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), даючи тимчасовим проблемам час на вирішення. Такий підхід значно покращує показники доставки, зберігаючи при цьому конфіденційність.

У подібному ключі ми також редагуємо вміст повідомлень вихідних SMTP-листів після успішної доставки. Це налаштовано в нашій системі зберігання з типовим періодом зберігання 30 днів, який ви можете змінити у Розширених налаштуваннях вашого домену. Після цього періоду вміст листа автоматично редагується і видаляється, залишаючи лише повідомлення-заповнювач:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```
Цей підхід гарантує, що ваші надіслані електронні листи не зберігаються необмежено, зменшуючи ризик витоку даних або несанкціонованого доступу до ваших повідомлень.


## Необмежені ресурси з інтелектуальним обмеженням швидкості {#unlimited-resources-with-intelligent-rate-limiting}

Хоча Forward Email пропонує необмежену кількість доменів та псевдонімів, ми впровадили інтелектуальне обмеження швидкості, щоб захистити нашу систему від зловживань і забезпечити справедливе використання для всіх користувачів. Наприклад, клієнти, які не є корпоративними, можуть створювати до 50+ псевдонімів на день, що запобігає спаму та перевантаженню нашої бази даних, а також дозволяє ефективно працювати нашим функціям захисту та виявлення зловживань у реальному часі.

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

Цей збалансований підхід надає вам гнучкість створювати стільки електронних адрес, скільки потрібно для комплексного управління конфіденційністю, одночасно підтримуючи цілісність і продуктивність нашого сервісу для всіх користувачів.


## Пісочницеве шифрування для підвищеної безпеки {#sandboxed-encryption-for-enhanced-security}

Наш унікальний підхід пісочницевого шифрування забезпечує критичну перевагу в безпеці, яку багато користувачів ігнорують при виборі поштового сервісу. Давайте розглянемо, чому пісочницеве зберігання даних, особливо електронної пошти, таке важливе.

Сервіси, як Gmail та Proton, найімовірніше використовують спільні [реляційні бази даних](https://en.wikipedia.org/wiki/Relational_database), що створює фундаментальну вразливість у безпеці. У середовищі спільної бази даних, якщо хтось отримує доступ до даних одного користувача, він потенційно має шлях до доступу й до даних інших користувачів. Це тому, що всі дані користувачів зберігаються в одних і тих же таблицях бази даних, розділених лише за ідентифікаторами користувачів або подібними маркерами.

Forward Email використовує принципово інший підхід із пісочницевим шифруванням:

1. **Повна ізоляція**: Дані кожного користувача зберігаються у власному зашифрованому файлі бази даних SQLite, повністю ізольованому від інших користувачів
2. **Незалежні ключі шифрування**: Кожна база даних шифрується власним унікальним ключем, отриманим із пароля користувача
3. **Відсутність спільного сховища**: На відміну від реляційних баз даних, де всі електронні листи користувачів можуть зберігатися в одній таблиці "emails", наш підхід гарантує відсутність змішування даних
4. **Глибокий захист**: Навіть якщо база даних одного користувача буде якимось чином скомпрометована, це не дасть доступу до даних інших користувачів

Цей пісочницевий підхід схожий на зберігання вашої пошти у окремому фізичному сейфі, а не у спільному сховищі з внутрішніми перегородками. Це фундаментальна архітектурна відмінність, яка значно підвищує вашу конфіденційність і безпеку.


## Обробка електронної пошти в пам’яті: без збереження на диску для максимальної конфіденційності {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Для нашого сервісу пересилання електронної пошти ми обробляємо листи повністю в оперативній пам’яті (RAM) і ніколи не записуємо їх на диск або в бази даних. Цей підхід забезпечує неперевершений захист від спостереження за поштою та збору метаданих.

Ось спрощений огляд того, як працює наша обробка електронної пошти:

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
Цей підхід означає, що навіть якщо наші сервери будуть скомпрометовані, у зловмисників не буде доступу до історичних даних електронної пошти. Ваші листи просто проходять через нашу систему і негайно пересилаються до місця призначення без залишення слідів. Цей підхід пересилання електронної пошти без ведення журналів є фундаментальним для захисту ваших комунікацій від стеження.


## Кінцеве шифрування з OpenPGP для повної конфіденційності {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Для користувачів, які потребують найвищого рівня захисту конфіденційності від стеження за електронною поштою, ми підтримуємо [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) для кінцевого шифрування. На відміну від багатьох провайдерів електронної пошти, які вимагають пропрієтарні мости або додатки, наша реалізація працює зі стандартними поштовими клієнтами, роблячи безпечне спілкування доступним для кожного.

Ось як ми реалізуємо шифрування OpenPGP:

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

Ця реалізація гарантує, що ваші листи шифруються до того, як покинуть ваш пристрій, і можуть бути розшифровані лише призначеним отримувачем, зберігаючи ваші комунікації приватними навіть для нас. Це є необхідним для захисту чутливих комунікацій від несанкціонованого доступу та стеження.


## Багаторівневий захист вмісту для комплексної безпеки {#multi-layered-content-protection-for-comprehensive-security}

Forward Email пропонує кілька рівнів захисту вмісту, які за замовчуванням увімкнені для забезпечення комплексного захисту від різних загроз:

1. **Захист від дорослого контенту** - Фільтрує неприйнятний вміст без шкоди для конфіденційності
2. **Захист від [фішингу](https://en.wikipedia.org/wiki/Phishing)** - Блокує спроби викрасти вашу інформацію, зберігаючи анонімність
3. **Захист від виконуваних файлів** - Запобігає потенційно шкідливим вкладенням без сканування вмісту
4. **Захист від [вірусів](https://en.wikipedia.org/wiki/Computer_virus)** - Сканує на наявність шкідливого ПЗ із застосуванням методів, що зберігають конфіденційність

На відміну від багатьох провайдерів, які роблять ці функції опціональними, ми зробили їх за замовчуванням увімкненими, забезпечуючи, що всі користувачі отримують ці захисти автоматично. Цей підхід відображає нашу відданість як конфіденційності, так і безпеці, забезпечуючи баланс, якого багато поштових сервісів не досягають.


## Чим ми відрізняємося від інших поштових сервісів: технічна перевага конфіденційності {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Порівнюючи Forward Email з іншими поштовими сервісами, кілька ключових технічних відмінностей підкреслюють наш підхід, орієнтований на конфіденційність:

### Відкритий код для перевіреної конфіденційності {#open-source-transparency-for-verifiable-privacy}

Хоча багато провайдерів електронної пошти заявляють, що вони відкриті, вони часто тримають бекенд-код закритим. Forward Email є на 100% [відкритим кодом](https://en.wikipedia.org/wiki/Open_source), включно з фронтендом і бекендом. Ця прозорість дозволяє незалежний аудит безпеки всіх компонентів, забезпечуючи можливість будь-кого перевірити наші заяви про конфіденційність.

### Відсутність прив’язки до постачальника для конфіденційності без компромісів {#no-vendor-lock-in-for-privacy-without-compromise}

Багато провайдерів, орієнтованих на конфіденційність, вимагають використовувати їхні пропрієтарні додатки або мости. Forward Email працює з будь-яким стандартним поштовим клієнтом через протоколи [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) та [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), даючи вам свободу обирати улюблене поштове програмне забезпечення без компромісів щодо конфіденційності.
### Пісочниця для Даних для Справжньої Ізоляції {#sandboxed-data-for-true-isolation}

На відміну від сервісів, які використовують спільні бази даних, де дані всіх користувачів змішуються, наш підхід із пісочницею гарантує повну ізоляцію даних кожного користувача. Ця фундаментальна архітектурна відмінність забезпечує значно сильніші гарантії конфіденційності, ніж більшість поштових сервісів.

### Портативність Даних та Контроль {#data-portability-and-control}

Ми віримо, що ваші дані належать вам, тому ми робимо експорт ваших листів у стандартних форматах (MBOX, EML, SQLite) простим, а також дозволяємо справді видаляти ваші дані, коли ви цього хочете. Такий рівень контролю рідкісний серед поштових провайдерів, але є необхідним для справжньої конфіденційності.


## Технічні Виклики Приватної Пересилки Електронної Пошти {#the-technical-challenges-of-privacy-first-email-forwarding}

Створення поштового сервісу з пріоритетом на конфіденційність пов’язане з суттєвими технічними викликами. Ось деякі з перешкод, які ми подолали:

### Керування Пам’яттю для Обробки Пошти Без Логування {#memory-management-for-no-logging-email-processing}

Обробка листів у пам’яті без збереження на диск вимагає ретельного керування пам’яттю для ефективної роботи з великими обсягами поштового трафіку. Ми впровадили передові методи оптимізації пам’яті, щоб забезпечити надійну продуктивність без компромісів із нашою політикою відсутності збереження, що є критичною складовою нашої стратегії захисту конфіденційності.

### Виявлення Спаму Без Аналізу Вмісту для Фільтрації з Захистом Конфіденційності {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Більшість систем [спаму](https://en.wikipedia.org/wiki/Email_spam) базуються на аналізі вмісту листів, що суперечить нашим принципам конфіденційності. Ми розробили методи виявлення спам-шаблонів без читання вмісту ваших листів, знаходячи баланс між конфіденційністю та зручністю, що зберігає таємницю ваших комунікацій.

### Підтримка Сумісності з Дизайном, Орієнтованим на Конфіденційність {#maintaining-compatibility-with-privacy-first-design}

Забезпечення сумісності з усіма поштовими клієнтами при впровадженні передових функцій конфіденційності вимагало творчих інженерних рішень. Наша команда невтомно працювала, щоб зробити конфіденційність безшовною, щоб вам не доводилося вибирати між зручністю та безпекою при захисті ваших поштових комунікацій.


## Кращі Практики Конфіденційності для Користувачів Forward Email {#privacy-best-practices-for-forward-email-users}

Щоб максимально захистити себе від поштового спостереження та підвищити конфіденційність при використанні Forward Email, ми рекомендуємо такі кращі практики:

1. **Використовуйте унікальні псевдоніми для різних сервісів** — Створюйте окремий поштовий псевдонім для кожного сервісу, на який ви реєструєтесь, щоб запобігти відстеженню між сервісами
2. **Увімкніть шифрування OpenPGP** — Для чутливих комунікацій використовуйте наскрізне шифрування для повної конфіденційності
3. **Регулярно оновлюйте свої поштові псевдоніми** — Періодично змінюйте псевдоніми для важливих сервісів, щоб мінімізувати довготривале збирання даних
4. **Використовуйте сильні, унікальні паролі** — Захищайте свій акаунт Forward Email надійним паролем, щоб запобігти несанкціонованому доступу
5. **Впроваджуйте [анонімізацію IP-адрес](https://en.wikipedia.org/wiki/IP_address)** — Розгляньте використання [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) разом із Forward Email для повної анонімності


## Висновок: Майбутнє Приватної Пересилки Електронної Пошти {#conclusion-the-future-of-private-email-forwarding}

У Forward Email ми віримо, що конфіденційність — це не просто функція, а фундаментальне право. Наші технічні реалізації відображають цю віру, забезпечуючи пересилання пошти, яке поважає вашу конфіденційність на кожному рівні та захищає вас від поштового спостереження і збору метаданих.

Поки ми продовжуємо розвивати та вдосконалювати наш сервіс, наша відданість конфіденційності залишається непохитною. Ми постійно досліджуємо нові методи шифрування, вивчаємо додаткові засоби захисту конфіденційності та вдосконалюємо наш код, щоб забезпечити найнадійніший поштовий досвід.

Обираючи Forward Email, ви не просто вибираєте поштовий сервіс — ви підтримуєте бачення інтернету, де конфіденційність є нормою, а не винятком. Приєднуйтесь до нас у створенні більш приватного цифрового майбутнього, по одному листу за раз.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

