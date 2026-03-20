# Как Forward Email защищает вашу конфиденциальность, домен и безопасность: технический глубокий анализ {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Лучшее сравнение сервисов переадресации электронной почты" class="rounded-lg" />


## Содержание {#table-of-contents}

* [Предисловие](#foreword)
* [Философия конфиденциальности Forward Email](#the-forward-email-privacy-philosophy)
* [Реализация SQLite: надежность и переносимость ваших данных](#sqlite-implementation-durability-and-portability-for-your-data)
* [Умная очередь и механизм повторных попыток: обеспечение доставки электронной почты](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Неограниченные ресурсы с интеллектуальным ограничением скорости](#unlimited-resources-with-intelligent-rate-limiting)
* [Изолированное шифрование для повышения безопасности](#sandboxed-encryption-for-enhanced-security)
* [Обработка электронной почты в памяти: без хранения на диске для максимальной конфиденциальности](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Сквозное шифрование с OpenPGP для полной конфиденциальности](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Многоуровневая защита контента для комплексной безопасности](#multi-layered-content-protection-for-comprehensive-security)
* [Чем мы отличаемся от других сервисов электронной почты: техническое преимущество в конфиденциальности](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Прозрачность с открытым исходным кодом для проверяемой конфиденциальности](#open-source-transparency-for-verifiable-privacy)
  * [Отсутствие привязки к поставщику для конфиденциальности без компромиссов](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Изолированные данные для истинной изоляции](#sandboxed-data-for-true-isolation)
  * [Переносимость и контроль данных](#data-portability-and-control)
* [Технические вызовы приватной переадресации электронной почты](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Управление памятью для обработки электронной почты без ведения логов](#memory-management-for-no-logging-email-processing)
  * [Обнаружение спама без анализа содержимого для фильтрации с сохранением конфиденциальности](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Поддержание совместимости с дизайном, ориентированным на конфиденциальность](#maintaining-compatibility-with-privacy-first-design)
* [Лучшие практики конфиденциальности для пользователей Forward Email](#privacy-best-practices-for-forward-email-users)
* [Заключение: будущее приватной переадресации электронной почты](#conclusion-the-future-of-private-email-forwarding)


## Предисловие {#foreword}

В современном цифровом мире конфиденциальность электронной почты стала важнее, чем когда-либо. С утечками данных, опасениями по поводу слежки и таргетированной рекламой на основе содержимого писем пользователи всё чаще ищут решения, которые ставят их конфиденциальность на первое место. В Forward Email мы построили наш сервис с нуля, делая конфиденциальность краеугольным камнем нашей архитектуры. В этом блоге мы рассмотрим технические реализации, которые делают наш сервис одним из самых ориентированных на конфиденциальность решений для переадресации электронной почты.


## Философия конфиденциальности Forward Email {#the-forward-email-privacy-philosophy}

Прежде чем углубляться в технические детали, важно понять нашу основную философию конфиденциальности: **ваши письма принадлежат вам и только вам**. Этот принцип направляет каждое техническое решение, которое мы принимаем, от того, как мы обрабатываем переадресацию писем, до того, как реализуем шифрование.

В отличие от многих провайдеров электронной почты, которые сканируют ваши сообщения для рекламных целей или хранят их бесконечно на своих серверах, Forward Email работает по радикально иному подходу:

1. **Обработка только в памяти** — мы не сохраняем ваши переадресованные письма на диск
2. **Отсутствие хранения метаданных** — мы не ведём записи о том, кто кому пишет
3. **100% открытый исходный код** — весь наш код прозрачен и проверяем
4. **Сквозное шифрование** — мы поддерживаем OpenPGP для действительно приватной коммуникации


## Реализация SQLite: надежность и переносимость ваших данных {#sqlite-implementation-durability-and-portability-for-your-data}

Одним из самых значительных преимуществ конфиденциальности Forward Email является наша тщательно настроенная реализация [SQLite](https://en.wikipedia.org/wiki/SQLite). Мы оптимизировали SQLite с помощью специальных настроек PRAGMA и [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), чтобы обеспечить как надежность, так и переносимость ваших данных, при этом поддерживая высочайшие стандарты конфиденциальности и безопасности.
Вот как мы реализовали SQLite с использованием [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) в качестве шифра для квантово-устойчивого шифрования:

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

Эта реализация гарантирует, что ваши данные не только защищены, но и портативны. Вы можете в любой момент экспортировать свою почту в форматах [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) или SQLite и забрать её с собой. А когда вы захотите удалить данные, они действительно исчезнут — мы просто удаляем файлы с диска, а не выполняем SQL-команды DELETE ROW, которые могут оставлять следы в базе данных.

Квантово-шифровальная часть нашей реализации использует ChaCha20-Poly1305 в качестве шифра при инициализации базы данных, обеспечивая надежную защиту от текущих и будущих угроз конфиденциальности ваших данных.


## Умная очередь и механизм повторных попыток: обеспечение доставки электронной почты {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Вместо того чтобы сосредотачиваться только на обработке заголовков, мы реализовали сложную умную очередь и механизм повторных попыток с помощью нашего метода `getBounceInfo`. Эта система гарантирует, что ваши письма имеют наилучшие шансы быть доставленными, даже если возникают временные проблемы.

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
> Это выдержка из метода `getBounceInfo`, а не полный обширный код. Полный код вы можете посмотреть на [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Мы повторяем попытки доставки почты в течение 5 дней, аналогично отраслевым стандартам, таким как [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), давая временным проблемам время на разрешение. Такой подход значительно повышает процент успешной доставки при сохранении конфиденциальности.

В том же духе мы также редактируем содержимое исходящих SMTP-писем после успешной доставки. Это настроено в нашей системе хранения с периодом хранения по умолчанию 30 дней, который вы можете изменить в Расширенных настройках вашего домена. По истечении этого срока содержимое письма автоматически редактируется и удаляется, остаётся только сообщение-заполнитель:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```
Этот подход гарантирует, что ваши отправленные письма не будут храниться бесконечно, снижая риск утечек данных или несанкционированного доступа к вашим сообщениям.


## Неограниченные ресурсы с интеллектуальным ограничением скорости {#unlimited-resources-with-intelligent-rate-limiting}

Хотя Forward Email предлагает неограниченное количество доменов и псевдонимов, мы внедрили интеллектуальное ограничение скорости, чтобы защитить нашу систему от злоупотреблений и обеспечить справедливое использование для всех пользователей. Например, клиенты без корпоративного тарифа могут создавать до 50+ псевдонимов в день, что предотвращает спам и перегрузку нашей базы данных, а также позволяет эффективно работать функциям защиты и обнаружения злоупотреблений в реальном времени.

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

Этот сбалансированный подход предоставляет вам гибкость создавать столько адресов электронной почты, сколько необходимо для комплексного управления конфиденциальностью, при этом сохраняя целостность и производительность нашего сервиса для всех пользователей.


## Изолированное шифрование для повышенной безопасности {#sandboxed-encryption-for-enhanced-security}

Наш уникальный подход с изолированным шифрованием предоставляет критическое преимущество в безопасности, которое многие пользователи упускают при выборе почтового сервиса. Давайте рассмотрим, почему изоляция данных, особенно электронной почты, так важна.

Сервисы, такие как Gmail и Proton, скорее всего, используют общие [реляционные базы данных](https://en.wikipedia.org/wiki/Relational_database), что создает фундаментальную уязвимость в безопасности. В среде с общей базой данных, если кто-то получает доступ к данным одного пользователя, у него потенциально появляется путь к доступу к данным других пользователей. Это происходит потому, что все данные пользователей хранятся в одних и тех же таблицах базы данных, разделенных только идентификаторами пользователей или аналогичными метками.

Forward Email использует принципиально иной подход с нашим изолированным шифрованием:

1. **Полная изоляция**: данные каждого пользователя хранятся в отдельном зашифрованном файле базы данных SQLite, полностью изолированном от других пользователей
2. **Независимые ключи шифрования**: каждая база данных шифруется своим уникальным ключом, полученным из пароля пользователя
3. **Отсутствие общего хранилища**: в отличие от реляционных баз, где вся почта пользователей может находиться в одной таблице "emails", наш подход исключает смешивание данных
4. **Глубокая защита**: даже если база данных одного пользователя каким-то образом будет скомпрометирована, это не даст доступа к данным других пользователей

Этот изолированный подход похож на хранение вашей почты в отдельном физическом сейфе, а не в общем хранилище с внутренними перегородками. Это фундаментальное архитектурное отличие, которое значительно повышает вашу конфиденциальность и безопасность.


## Обработка электронной почты в памяти: без записи на диск для максимальной конфиденциальности {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Для нашего сервиса пересылки почты мы обрабатываем письма полностью в оперативной памяти и никогда не записываем их на диск или в базы данных. Такой подход обеспечивает непревзойденную защиту от слежки за электронной почтой и сбора метаданных.

Вот упрощенный пример того, как работает наша обработка почты:

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
Этот подход означает, что даже если наши серверы будут скомпрометированы, у злоумышленников не будет доступа к историческим данным электронной почты. Ваши письма просто проходят через нашу систему и сразу же пересылаются по назначению, не оставляя следов. Такой подход к пересылке электронной почты без ведения логов является основой защиты ваших коммуникаций от слежки.


## Сквозное шифрование с OpenPGP для полной конфиденциальности {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Для пользователей, которым требуется максимальная защита конфиденциальности от слежки за электронной почтой, мы поддерживаем [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) для сквозного шифрования. В отличие от многих провайдеров электронной почты, которые требуют проприетарные мосты или приложения, наша реализация работает со стандартными почтовыми клиентами, делая безопасное общение доступным для всех.

Вот как мы реализуем шифрование OpenPGP:

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

Эта реализация гарантирует, что ваши письма шифруются до того, как покинут ваше устройство, и могут быть расшифрованы только предназначенным получателем, сохраняя ваши коммуникации в тайне даже от нас. Это необходимо для защиты конфиденциальных сообщений от несанкционированного доступа и слежки.


## Многоуровневая защита контента для комплексной безопасности {#multi-layered-content-protection-for-comprehensive-security}

Forward Email предлагает несколько уровней защиты контента, которые включены по умолчанию для обеспечения комплексной безопасности от различных угроз:

1. **Защита от контента для взрослых** — фильтрует неподобающий контент без ущерба для конфиденциальности  
2. **Защита от [фишинга](https://en.wikipedia.org/wiki/Phishing)** — блокирует попытки кражи вашей информации, сохраняя анонимность  
3. **Защита от исполняемых файлов** — предотвращает потенциально вредоносные вложения без сканирования содержимого  
4. **Защита от [вирусов](https://en.wikipedia.org/wiki/Computer_virus)** — сканирует на наличие вредоносного ПО с использованием методов, сохраняющих конфиденциальность  

В отличие от многих провайдеров, делающих эти функции опциональными, мы сделали их отключаемыми, чтобы все пользователи по умолчанию получали эти защиты. Такой подход отражает нашу приверженность как конфиденциальности, так и безопасности, обеспечивая баланс, которого многим почтовым сервисам не удаётся достичь.


## Чем мы отличаемся от других почтовых сервисов: техническое преимущество в конфиденциальности {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

При сравнении Forward Email с другими почтовыми сервисами несколько ключевых технических отличий подчёркивают наш подход, ориентированный на конфиденциальность:

### Прозрачность с открытым исходным кодом для проверяемой конфиденциальности {#open-source-transparency-for-verifiable-privacy}

Хотя многие провайдеры электронной почты заявляют, что они с открытым исходным кодом, часто их серверный код остаётся закрытым. Forward Email является на 100% [открытым исходным кодом](https://en.wikipedia.org/wiki/Open_source), включая как фронтенд, так и бэкенд. Такая прозрачность позволяет проводить независимый аудит безопасности всех компонентов, гарантируя, что наши заявления о конфиденциальности могут быть проверены каждым.

### Отсутствие привязки к поставщику для конфиденциальности без компромиссов {#no-vendor-lock-in-for-privacy-without-compromise}

Многие провайдеры, ориентированные на конфиденциальность, требуют использования своих проприетарных приложений или мостов. Forward Email работает с любым стандартным почтовым клиентом через протоколы [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) и [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), предоставляя вам свободу выбора предпочитаемого почтового ПО без ущерба для конфиденциальности.
### Изолированные данные для настоящей изоляции {#sandboxed-data-for-true-isolation}

В отличие от сервисов, использующих общие базы данных, где данные всех пользователей смешаны, наш изолированный подход гарантирует полную изоляцию данных каждого пользователя. Это фундаментальное архитектурное отличие обеспечивает значительно более высокие гарантии конфиденциальности, чем большинство почтовых сервисов.

### Переносимость и контроль данных {#data-portability-and-control}

Мы считаем, что ваши данные принадлежат вам, поэтому мы упрощаем экспорт ваших писем в стандартных форматах (MBOX, EML, SQLite) и настоящую их удаление по вашему желанию. Такой уровень контроля редок среди почтовых провайдеров, но необходим для настоящей конфиденциальности.


## Технические сложности приватной пересылки электронной почты {#the-technical-challenges-of-privacy-first-email-forwarding}

Создание почтового сервиса с приоритетом конфиденциальности связано с серьезными техническими вызовами. Вот некоторые из препятствий, которые нам удалось преодолеть:

### Управление памятью для обработки писем без ведения логов {#memory-management-for-no-logging-email-processing}

Обработка писем в памяти без записи на диск требует тщательного управления памятью для эффективной работы с большими объемами почтового трафика. Мы внедрили передовые методы оптимизации памяти, чтобы обеспечить надежную производительность без компромиссов с нашей политикой отсутствия хранения, что является ключевым элементом нашей стратегии защиты конфиденциальности.

### Обнаружение спама без анализа содержимого для конфиденциальной фильтрации {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Большинство систем [спама](https://en.wikipedia.org/wiki/Email_spam) основаны на анализе содержимого писем, что противоречит нашим принципам конфиденциальности. Мы разработали методы выявления спам-паттернов без чтения содержимого ваших писем, достигая баланса между приватностью и удобством, сохраняя конфиденциальность вашей переписки.

### Поддержание совместимости с дизайном, ориентированным на конфиденциальность {#maintaining-compatibility-with-privacy-first-design}

Обеспечение совместимости со всеми почтовыми клиентами при внедрении продвинутых функций конфиденциальности потребовало творческих инженерных решений. Наша команда усердно работала, чтобы сделать конфиденциальность бесшовной, чтобы вам не приходилось выбирать между удобством и безопасностью при защите вашей электронной переписки.


## Лучшие практики конфиденциальности для пользователей Forward Email {#privacy-best-practices-for-forward-email-users}

Чтобы максимально защитить себя от слежки за электронной почтой и повысить конфиденциальность при использовании Forward Email, мы рекомендуем следующие лучшие практики:

1. **Используйте уникальные псевдонимы для разных сервисов** — создавайте отдельный почтовый псевдоним для каждого сервиса, чтобы предотвратить межсервисное отслеживание
2. **Включайте шифрование OpenPGP** — для конфиденциальной переписки используйте сквозное шифрование для полной приватности
3. **Регулярно меняйте почтовые псевдонимы** — периодически обновляйте псевдонимы для важных сервисов, чтобы минимизировать долгосрочный сбор данных
4. **Используйте надежные уникальные пароли** — защищайте аккаунт Forward Email надежным паролем, чтобы предотвратить несанкционированный доступ
5. **Реализуйте [анонимизацию IP-адреса](https://en.wikipedia.org/wiki/IP_address)** — рассмотрите возможность использования [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) вместе с Forward Email для полной анонимности


## Заключение: будущее приватной пересылки электронной почты {#conclusion-the-future-of-private-email-forwarding}

В Forward Email мы считаем, что конфиденциальность — это не просто функция, а фундаментальное право. Наши технические решения отражают эту убежденность, предоставляя вам пересылку электронной почты, которая уважает вашу приватность на каждом уровне и защищает вас от слежки и сбора метаданных.

По мере развития и улучшения нашего сервиса наша приверженность конфиденциальности остается неизменной. Мы постоянно исследуем новые методы шифрования, изучаем дополнительные меры защиты конфиденциальности и совершенствуем наш код, чтобы обеспечить максимально безопасный почтовый опыт.

Выбирая Forward Email, вы выбираете не просто почтовый сервис — вы поддерживаете видение интернета, где конфиденциальность является нормой, а не исключением. Присоединяйтесь к нам в создании более приватного цифрового будущего, по одному письму за раз.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

