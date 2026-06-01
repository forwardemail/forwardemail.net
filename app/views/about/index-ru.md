# О сервисе Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Команда и история компании Forward Email" class="rounded-lg" />

# О сервисе Forward Email {#about-forward-email-1}


## Содержание {#table-of-contents}

* [Обзор](#overview)
* [Основатель и миссия](#founder-and-mission)
* [Хронология](#timeline)
  * [2017 - Основание и запуск](#2017---founding-and-launch)
  * [2018 - Инфраструктура и интеграция](#2018---infrastructure-and-integration)
  * [2019 - Революция в производительности](#2019---performance-revolution)
  * [2020 - Фокус на конфиденциальности и безопасности](#2020---privacy-and-security-focus)
  * [2021 - Модернизация платформы](#2021---platform-modernization)
  * [2023 - Расширение инфраструктуры и функций](#2023---infrastructure-and-feature-expansion)
  * [2024 - Оптимизация сервиса и продвинутые функции](#2024---service-optimization-and-advanced-features)
  * [2025 - Улучшения конфиденциальности и поддержка протоколов {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Соответствие RFC и продвинутая фильтрация {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Основные принципы](#core-principles)
* [Текущее состояние](#current-status)


## Обзор {#overview}

> \[!TIP]
> Для технических деталей об архитектуре, реализации безопасности и дорожной карте смотрите [Технический Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email — это [бесплатный и открытый](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") сервис [пересылки электронной почты](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding"), ориентированный на [право пользователя на конфиденциальность](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). То, что началось в 2017 году как простое решение для пересылки почты, превратилось в комплексную платформу с неограниченным количеством пользовательских доменов, неограниченным числом адресов и псевдонимов, неограниченным количеством одноразовых адресов, защитой от спама и фишинга, зашифрованным хранилищем почтовых ящиков и множеством продвинутых функций.

Сервис поддерживается и принадлежит своей оригинальной команде основателей — дизайнерам и разработчикам. Он построен на 100% открытом программном обеспечении с использованием [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") и [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Основатель и миссия {#founder-and-mission}

Forward Email был основан **Николасом Боу** в 2017 году. Согласно [Техническому Whitepaper Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Боу изначально искал недорогое и простое решение для включения электронной почты на доменах для своих побочных проектов. После изучения доступных вариантов он начал писать собственное решение и 2 октября 2017 года приобрёл домен `forwardemail.net`.

Миссия Forward Email выходит за рамки предоставления почтовых услуг — компания стремится изменить подход индустрии к конфиденциальности и безопасности электронной почты. Основные ценности компании включают прозрачность, контроль пользователя и защиту конфиденциальности через техническую реализацию, а не только обещания в политике.


## Хронология {#timeline}

### 2017 - Основание и запуск {#2017---founding-and-launch}

**2 октября 2017**: Николас Боу приобрёл домен `forwardemail.net` после изучения недорогих решений для электронной почты для своих побочных проектов.

**5 ноября 2017**: Боу создал JavaScript-файл из 634 строк с использованием [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") для пересылки писем с любых пользовательских доменов. Эта начальная реализация была опубликована как open-source на [GitHub](https://github.com/forwardemail), и сервис был запущен с использованием GitHub Pages.
**Ноябрь 2017**: Forward Email официально запущен после первоначального релиза. Ранняя версия была полностью основана на DNS, без регистрации аккаунта или процесса подписки — просто README-файл, написанный в Markdown с инструкциями. Пользователи могли настроить переадресацию электронной почты, сконфигурировав MX-записи, указывающие на `mx1.forwardemail.net` и `mx2.forwardemail.net`, и добавив TXT-запись с `forward-email=user@gmail.com`.

Простота и эффективность этого решения привлекли внимание известных разработчиков, включая [Дэвида Хайнемейера Ханссона](https://dhh.dk) (создателя Ruby on Rails), который до сих пор использует Forward Email на своём домене `dhh.dk`.

### 2018 - Инфраструктура и интеграция {#2018---infrastructure-and-integration}

**Апрель 2018**: Когда [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") запустил свой [приватный DNS-сервис для потребителей](https://blog.cloudflare.com/announcing-1111/), Forward Email переключился с использования [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") на [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") для обработки запросов к [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), демонстрируя приверженность компании выбору инфраструктуры с акцентом на конфиденциальность.

**Октябрь 2018**: Forward Email позволил пользователям "Отправлять почту как" с помощью [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") и [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), расширяя возможности интеграции с популярными почтовыми провайдерами.

### 2019 - Революция в производительности {#2019---performance-revolution}

**Май 2019**: Forward Email выпустил версию v2, которая представляла собой крупный переписанный вариант по сравнению с первоначальными версиями. Это обновление было сосредоточено на улучшении [производительности](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") с использованием [потоков](https://en.wikipedia.org/wiki/Streams "Streams") [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), заложив основу для масштабируемости платформы.

### 2020 - Фокус на конфиденциальность и безопасность {#2020---privacy-and-security-focus}

**Февраль 2020**: Forward Email выпустил план Enhanced Privacy Protection, позволяющий пользователям отключать установку публичных DNS-записей с их алиасами для переадресации электронной почты. Благодаря этому плану информация об алиасах пользователя скрывается от публичного поиска в Интернете. Компания также выпустила функцию включения или отключения отдельных алиасов при сохранении их в качестве действительных адресов электронной почты с успешными [SMTP статус-кодами](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), при этом письма немедленно отбрасываются (аналогично перенаправлению вывода в [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Апрель 2020**: После множества препятствий с существующими решениями для обнаружения спама, которые не соблюдали политику конфиденциальности Forward Email, компания выпустила свою первую альфа-версию Spam Scanner. Это полностью бесплатное и открытое [антиспам-фильтрационное](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") решение использует подход [наивного байесовского спам-фильтра](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") в сочетании с защитой от [фишинга](https://en.wikipedia.org/wiki/Phishing "Phishing") и [атак с использованием гомографов IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email также выпустил [двухфакторную аутентификацию](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) с использованием [одноразовых паролей](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) для повышения безопасности аккаунтов.

**Май 2020**: Forward Email позволил использовать пользовательскую [переадресацию портов](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") в качестве обходного решения для пользователей, чтобы обойти блокировку портов со стороны их [интернет-провайдера](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Компания также выпустила свой [RESTful API для бесплатной переадресации электронной почты](email-api) с полной документацией и примерами запросов и ответов в реальном времени, а также с поддержкой вебхуков.
**Август 2020**: Forward Email добавил поддержку системы аутентификации электронной почты [Authenticated Received Chain](arc) ("ARC"), что дополнительно усилило безопасность и доставляемость электронной почты.

**23 ноября 2020**: Forward Email официально вышел из бета-программы, что стало значительным этапом в развитии платформы.

### 2021 - Модернизация платформы {#2021---platform-modernization}

**Февраль 2021**: Forward Email переработал свою кодовую базу, удалив все зависимости от [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), что позволило сделать стек технологий полностью на [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") и [Node.js](https://en.wikipedia.org/wiki/Node.js). Это архитектурное решение соответствовало стремлению компании поддерживать единый, открытый стек технологий.

**27 сентября 2021**: Forward Email [добавил поддержку](email-forwarding-regex-pattern-filter) для переадресации электронной почты с использованием [регулярных выражений](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), предоставляя пользователям более продвинутые возможности маршрутизации писем.

### 2023 - Расширение инфраструктуры и функционала {#2023---infrastructure-and-feature-expansion}

**Январь 2023**: Forward Email запустил переработанный и оптимизированный по скорости загрузки сайт, улучшив пользовательский опыт и производительность.

**Февраль 2023**: Компания добавила поддержку [логов ошибок](/faq#do-you-store-error-logs) и внедрила [тёмную тему](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) оформления сайта, учитывая предпочтения пользователей и требования доступности.

**Март 2023**: Forward Email выпустил [Tangerine](https://github.com/forwardemail/tangerine#readme) и интегрировал его во всю инфраструктуру, обеспечив использование [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") на уровне приложения. Компания также добавила поддержку [MTA-STS](/faq#do-you-support-mta-sts) и перешла с [hCaptcha](/) на [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Апрель 2023**: Forward Email внедрил и полностью автоматизировал новую инфраструктуру. Весь сервис начал работать на глобально балансируемом и основанном на близости DNS с проверками состояния и резервированием с использованием [Cloudflare](https://cloudflare.com), заменив предыдущий подход с круговой балансировкой DNS. Компания перешла на **выделенные серверы** у нескольких провайдеров, включая [Vultr](https://www.vultr.com/?ref=429848) и [Digital Ocean](https://m.do.co/c/a7cecd27e071), оба соответствуют стандарту SOC 2 Type 1. Базы данных MongoDB и Redis были переведены в кластерные конфигурации с основными и резервными узлами для высокой доступности, сквозным SSL-шифрованием, шифрованием данных в покое и восстановлением на момент времени (PITR).

**Май 2023**: Forward Email запустил функцию **исходящего SMTP** для [отправки писем через SMTP](/faq#do-you-support-sending-email-with-smtp) и [отправки писем через API](/faq#do-you-support-sending-email-with-api). Эта функция включает встроенные механизмы защиты для обеспечения высокой доставляемости, современную и надежную систему очередей и повторных попыток, а также [поддерживает логи ошибок в реальном времени](/faq#do-you-store-error-logs).

**Ноябрь 2023**: Forward Email запустил функцию [**шифрованного хранения почтовых ящиков**](/blog/docs/best-quantum-safe-encrypted-email-service) для [поддержки IMAP](/faq#do-you-support-receiving-email-with-imap), что стало значительным шагом вперёд в области конфиденциальности и безопасности электронной почты.

**Декабрь 2023**: Компания [добавила поддержку](/faq#do-you-support-pop3) для [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys и WebAuthn](/faq#do-you-support-passkeys-and-webauthn), мониторинг [времени доставки в почтовый ящик](/faq#i) и [OpenPGP для IMAP-хранения](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Оптимизация сервиса и продвинутые функции {#2024---service-optimization-and-advanced-features}

**Февраль 2024**: Forward Email [добавил поддержку календарей (CalDAV)](/faq#do-you-support-calendars-caldav), расширив возможности платформы за пределы электронной почты и включив синхронизацию календарей.
**Март — июль 2024**: Forward Email выпустил крупные оптимизации и улучшения своих сервисов IMAP, POP3 и CalDAV с целью сделать их работу такой же быстрой, а возможно и быстрее, чем у альтернатив.

**Июль 2024**: Компания [добавила поддержку iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) для решения проблемы отсутствия поддержки команды IMAP `IDLE` в Apple Mail на iOS, что позволило получать уведомления в реальном времени на устройствах Apple iOS. Forward Email также добавил мониторинг времени до получения письма ("TTI") для собственного сервиса и Yahoo/AOL, а также начал позволять пользователям шифровать всю свою DNS TXT запись даже на бесплатном тарифе. По запросам из [обсуждений Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) и [GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) компания добавила возможность для алиасов тихо отклонять с кодом `250`, мягко отклонять с кодом `421` или жестко отклонять с кодом `550` при отключении.

**Август 2024**: Forward Email добавил поддержку экспорта почтовых ящиков в форматах [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) и [Mbox](https://en.wikipedia.org/wiki/Mbox) (в дополнение к уже существующему формату экспорта [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Была добавлена поддержка подписи webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks), и компания начала позволять пользователям отправлять рассылки, объявления и email-маркетинг через свой исходящий SMTP-сервис. Также были реализованы квоты на хранение для IMAP/POP3/CalDAV на уровне домена и отдельных алиасов.

### 2025 — Улучшения конфиденциальности и поддержка протоколов {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Сентябрь 2024 — январь 2025**: Forward Email [добавил давно запрашиваемую функцию автоответчика на отпуск и шифрование OpenPGP/WKD для пересылки почты](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), расширяя уже реализованные возможности зашифрованного хранения почтовых ящиков.

**21 января 2025**: Лучший друг основателя "Джек", его верный собачий компаньон, мирно ушёл из жизни в возрасте почти 11 лет. Джек [всегда будет помнить](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) за его неизменную преданность, которая поддерживала создание Forward Email. [Технический белый документ Forward Email](https://forwardemail.net/technical-whitepaper.pdf) посвящён Джеку, признавая его роль в развитии сервиса.

**Февраль 2025**: Forward Email перешёл на [DataPacket](https://www.datapacket.com) в качестве нового основного провайдера дата-центров, внедрив кастомное, ориентированное на производительность, bare-metal оборудование для дальнейшего повышения надёжности и скорости сервиса.

**Март 2025**: Официально выпущена версия 1.0 Forward Email.

**Апрель 2025**: Опубликована первая версия [Технического белого документа Forward Email](https://forwardemail.net/technical-whitepaper.pdf), и компания начала принимать платежи в криптовалюте.

**Май 2025**: Сервис запустил новую документацию API с использованием [Scalar](https://github.com/scalar/scalar).

**Июнь 2025**: Forward Email запустил поддержку протокола [CardDAV](/faq#do-you-support-contacts-carddav), расширяя возможности платформы синхронизацией контактов наряду с уже существующими сервисами электронной почты и календаря.

**Август 2025**: Платформа добавила поддержку [CalDAV VTODO/задач](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), позволяя управлять задачами наряду с событиями календаря.

**Ноябрь 2025**: Безопасность платформы была усилена миграцией с PBKDF2 на [Argon2id](https://en.wikipedia.org/wiki/Argon2) для хеширования паролей, а инфраструктура была перенесена с Redis на [Valkey](https://github.com/valkey-io/valkey).

**Декабрь 2025**: Выпущена версия 2.0, включающая поддержку [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) для обязательного шифрования TLS при передаче почты и обновление до [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) версии 6.
### 2026 - Соответствие RFC и расширенная фильтрация {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Январь 2026**: Forward Email выпустил подробный [документ по соблюдению протоколов RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) и добавил поддержку [шифрования S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) и комплексной [фильтрации электронной почты Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) с поддержкой протокола [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API также был расширен до 39 конечных точек.

**Февраль 2026**: Официальный, открытый веб-клиент электронной почты был запущен на [mail.forwardemail.net](https://mail.forwardemail.net) ([исходный код на GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Платформа также добавила поддержку [расширений планирования CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) и [Domain Connect](https://domainconnect.org) для настройки DNS в один клик. Были запущены push-уведомления в реальном времени для IMAP, CalDAV и CardDAV с использованием WebSockets.

**Март 2026**: Добавлена поддержка пользовательского хранилища, совместимого с S3, для каждого домена, а также инструмент командной строки для управления. Началась работа над кроссплатформенными настольными и мобильными приложениями для macOS, Windows, Linux, iOS и Android на базе того же открытого веб-клиента, построенного с использованием [Tauri](https://tauri.app).


## Основные принципы {#core-principles}

С момента основания Forward Email неизменно придерживается принципов конфиденциальности и безопасности:

**100% открытый исходный код**: В отличие от конкурентов, которые открывают только фронтенд, оставляя бэкенд закрытым, Forward Email сделал весь свой код — как фронтенд, так и бэкенд — доступным для публичного просмотра на [GitHub](https://github.com/forwardemail).

**Дизайн с приоритетом конфиденциальности**: С первого дня Forward Email использует уникальный подход обработки в памяти, который избегает записи писем на диск, что отличает его от традиционных почтовых сервисов, сохраняющих сообщения в базах данных или файловых системах.

**Постоянные инновации**: Сервис эволюционировал от простого решения для пересылки почты до комплексной платформы с функциями зашифрованных почтовых ящиков, квантово-устойчивого шифрования и поддержкой стандартных протоколов, включая SMTP, IMAP, POP3 и CalDAV.

**Прозрачность**: Весь код открыт и доступен для проверки, что позволяет пользователям самостоятельно убедиться в соблюдении конфиденциальности, а не просто доверять маркетинговым заявлениям.

**Контроль пользователя**: Предоставление пользователям возможностей, включая возможность самостоятельного хостинга всей платформы при желании.


## Текущее состояние {#current-status}

По состоянию на март 2026 года Forward Email обслуживает более 500 000 доменов по всему миру, включая известные организации и лидеров отрасли, таких как:

* **Технологические компании**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Медиаорганизации**: Fox News Radio, Disney Ad Sales
* **Образовательные учреждения**: Кембриджский университет, Университет Мэриленда, Университет Вашингтона, Университет Тафтса, колледж Свартмор
* **Государственные учреждения**: Правительство Южной Австралии, Правительство Доминиканской Республики
* **Другие организации**: RCD Hotels, Fly<span>.</span>io
* **Известные разработчики**: Айзек З. Шлютер (создатель npm), Дэвид Хейнемайер Ханссон (создатель Ruby on Rails)

Платформа продолжает развиваться с регулярными выпусками новых функций и улучшениями инфраструктуры, сохраняя позицию единственного 100% открытого, зашифрованного, ориентированного на конфиденциальность, прозрачного и квантово-устойчивого почтового сервиса, доступного сегодня.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
