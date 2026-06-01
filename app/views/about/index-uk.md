# Про Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Команда Forward Email та історія компанії" class="rounded-lg" />

# Про Forward Email {#about-forward-email-1}


## Зміст {#table-of-contents}

* [Огляд](#overview)
* [Засновник і місія](#founder-and-mission)
* [Хронологія](#timeline)
  * [2017 - Заснування та запуск](#2017---founding-and-launch)
  * [2018 - Інфраструктура та інтеграція](#2018---infrastructure-and-integration)
  * [2019 - Революція продуктивності](#2019---performance-revolution)
  * [2020 - Фокус на конфіденційність та безпеку](#2020---privacy-and-security-focus)
  * [2021 - Модернізація платформи](#2021---platform-modernization)
  * [2023 - Розширення інфраструктури та функцій](#2023---infrastructure-and-feature-expansion)
  * [2024 - Оптимізація сервісу та розширені функції](#2024---service-optimization-and-advanced-features)
  * [2025 - Покращення конфіденційності та підтримка протоколів {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Відповідність RFC та розширене фільтрування {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Основні принципи](#core-principles)
* [Поточний стан](#current-status)


## Огляд {#overview}

> \[!TIP]
> Для технічних деталей про нашу архітектуру, реалізацію безпеки та дорожню карту дивіться [Технічний Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email — це [безкоштовний та відкритий](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") сервіс [пересилання електронної пошти](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding"), орієнтований на [право користувача на конфіденційність](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Те, що почалося як просте рішення для пересилання пошти у 2017 році, перетворилося на комплексну платформу електронної пошти з необмеженою кількістю власних доменних імен, необмеженою кількістю електронних адрес та псевдонімів, необмеженою кількістю одноразових адрес, захистом від спаму та фішингу, зашифрованим зберіганням поштових скриньок та численними розширеними функціями.

Сервіс підтримується та належить оригінальній команді засновників — дизайнерам і розробникам. Він побудований на 100% відкритому програмному забезпеченні з використанням [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") та [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Засновник і місія {#founder-and-mission}

Forward Email був заснований **Ніколасом Боу** у 2017 році. Згідно з [Технічним Whitepaper Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Боу спочатку шукав недороге та просте рішення для налаштування електронної пошти на доменах для своїх побічних проєктів. Після дослідження доступних варіантів він почав писати власне рішення і 2 жовтня 2017 року придбав домен `forwardemail.net`.

Місія Forward Email виходить за межі надання поштових послуг — вона прагне змінити підхід індустрії до конфіденційності та безпеки електронної пошти. Основні цінності компанії включають прозорість, контроль користувача та захист конфіденційності через технічну реалізацію, а не лише політичні обіцянки.


## Хронологія {#timeline}

### 2017 - Заснування та запуск {#2017---founding-and-launch}

**2 жовтня 2017**: Ніколас Боу придбав домен `forwardemail.net` після дослідження недорогих рішень для електронної пошти для своїх побічних проєктів.

**5 листопада 2017**: Боу створив JavaScript-файл на 634 рядки з використанням [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") для пересилання листів для будь-якого власного доменного імені. Цю початкову реалізацію було опубліковано як відкритий код на [GitHub](https://github.com/forwardemail), і сервіс було запущено за допомогою GitHub Pages.
**Листопад 2017**: Forward Email офіційно запущено після початкового релізу. Рання версія була повністю DNS-базованою без реєстрації акаунту чи процесу підписки — просто README файл, написаний у Markdown з інструкціями. Користувачі могли налаштувати переадресацію електронної пошти, конфігуруючи MX записи, які вказували на `mx1.forwardemail.net` та `mx2.forwardemail.net`, і додаючи TXT запис з `forward-email=user@gmail.com`.

Простота та ефективність цього рішення привернули увагу відомих розробників, зокрема [Девіда Хайнемейєра Ханссона](https://dhh.dk) (творця Ruby on Rails), який і досі використовує Forward Email на своєму домені `dhh.dk`.

### 2018 - Інфраструктура та інтеграція {#2018---infrastructure-and-integration}

**Квітень 2018**: Коли [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") запустив свій [приватний DNS-сервіс для споживачів](https://blog.cloudflare.com/announcing-1111/), Forward Email перейшов з використання [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") на [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") для обробки [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") запитів, демонструючи прихильність компанії до інфраструктурних рішень, орієнтованих на конфіденційність.

**Жовтень 2018**: Forward Email дозволив користувачам "Відправляти листи від імені" з [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") та [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), розширюючи можливості інтеграції з популярними поштовими провайдерами.

### 2019 - Революція продуктивності {#2019---performance-revolution}

**Травень 2019**: Forward Email випустив версію v2, яка стала суттєвим переписуванням початкових версій. Це оновлення було зосереджене на покращенні [продуктивності](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") за допомогою використання [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [потоків](https://en.wikipedia.org/wiki/Streams "Streams"), закладаючи основу для масштабованості платформи.

### 2020 - Фокус на конфіденційність та безпеку {#2020---privacy-and-security-focus}

**Лютий 2020**: Forward Email випустив план Enhanced Privacy Protection, який дозволяє користувачам вимикати публічне встановлення DNS записів з їхніми псевдонімами для переадресації електронної пошти. Завдяки цьому плану інформація про псевдоніми користувача прихована від публічного пошуку в Інтернеті. Компанія також випустила функцію для увімкнення або вимкнення конкретних псевдонімів, при цьому вони залишаються дійсними електронними адресами і повертають успішні [SMTP статус-коди](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), а листи негайно відкидаються (подібно до перенаправлення виводу в [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Квітень 2020**: Після численних перешкод з існуючими рішеннями для виявлення спаму, які не дотримувалися політики конфіденційності Forward Email, компанія випустила початкову альфа-версію Spam Scanner. Це повністю безкоштовне та відкрите [антиспам-фільтрування](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") рішення використовує підхід [наївного баєсівського спам-фільтра](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") у поєднанні з захистом від [фішингу](https://en.wikipedia.org/wiki/Phishing "Phishing") та [атак гомографів IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email також випустив [двофакторну аутентифікацію](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) з використанням [одноразових паролів](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) для підвищення безпеки акаунтів.

**Травень 2020**: Forward Email дозволив користувачам налаштовувати власне [перенаправлення портів](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") як обхід блокування портів їхнім [Інтернет-провайдером](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Компанія також випустила свій [безкоштовний RESTful API для переадресації електронної пошти](email-api) з повною документацією та прикладами запитів і відповідей у реальному часі, а також підтримкою вебхуків.
**Серпень 2020**: Forward Email додав підтримку системи автентифікації електронної пошти [Authenticated Received Chain](arc) ("ARC"), що ще більше посилило безпеку та доставку електронної пошти.

**23 листопада 2020**: Forward Email офіційно вийшов з бета-програми, що стало важливою віхою у розвитку платформи.

### 2021 - Модернізація платформи {#2021---platform-modernization}

**Лютий 2021**: Forward Email рефакторив свій код, щоб видалити всі залежності від [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), що дозволило стеку стати на 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") та [Node.js](https://en.wikipedia.org/wiki/Node.js). Це архітектурне рішення відповідало прагненню компанії підтримувати послідовний відкритий технологічний стек.

**27 вересня 2021**: Forward Email [додав підтримку](email-forwarding-regex-pattern-filter) для псевдонімів переадресації електронної пошти з використанням [регулярних виразів](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), надаючи користувачам більш складні можливості маршрутизації пошти.

### 2023 - Розширення інфраструктури та функціоналу {#2023---infrastructure-and-feature-expansion}

**Січень 2023**: Forward Email запустив оновлений та оптимізований за швидкістю завантаження вебсайт, покращивши користувацький досвід та продуктивність.

**Лютий 2023**: Компанія додала підтримку [журналів помилок](/faq#do-you-store-error-logs) та впровадила [темну тему](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) для сайту, реагуючи на вподобання користувачів та потреби доступності.

**Березень 2023**: Forward Email випустив [Tangerine](https://github.com/forwardemail/tangerine#readme) та інтегрував його у всю інфраструктуру, що дозволило використовувати [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") на рівні застосунку. Компанія також додала підтримку [MTA-STS](/faq#do-you-support-mta-sts) та перейшла з [hCaptcha](/) на [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Квітень 2023**: Forward Email впровадив та повністю автоматизував нову інфраструктуру. Весь сервіс почав працювати на глобально балансованому за навантаженням та близькістю DNS з перевірками стану та аварійним переключенням за допомогою [Cloudflare](https://cloudflare.com), замінивши попередній підхід round-robin DNS. Компанія перейшла на **bare metal сервери** у кількох провайдерів, включно з [Vultr](https://www.vultr.com/?ref=429848) та [Digital Ocean](https://m.do.co/c/a7cecd27e071), обидва провайдери з відповідністю SOC 2 Type 1. Бази даних MongoDB та Redis були переведені у кластерні конфігурації з основними та резервними вузлами для високої доступності, наскрізним SSL-шифруванням, шифруванням даних у стані спокою та відновленням у точці часу (PITR).

**Травень 2023**: Forward Email запустив функцію **вихідного SMTP** для [відправки пошти через SMTP](/faq#do-you-support-sending-email-with-smtp) та [відправки пошти через API](/faq#do-you-support-sending-email-with-api). Ця функція включає вбудовані засоби захисту для забезпечення високої доставності, сучасну та надійну систему черг і повторних спроб, а також [підтримує журнали помилок у реальному часі](/faq#do-you-store-error-logs).

**Листопад 2023**: Forward Email запустив функцію [**шифрованого зберігання поштової скриньки**](/blog/docs/best-quantum-safe-encrypted-email-service) для [підтримки IMAP](/faq#do-you-support-receiving-email-with-imap), що стало значним кроком уперед у приватності та безпеці електронної пошти.

**Грудень 2023**: Компанія [додала підтримку](/faq#do-you-support-pop3) для [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys та WebAuthn](/faq#do-you-support-passkeys-and-webauthn), моніторингу [time to inbox](/faq#i) та [OpenPGP для IMAP Storage](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Оптимізація сервісу та розширені функції {#2024---service-optimization-and-advanced-features}

**Лютий 2024**: Forward Email [додав підтримку календарів (CalDAV)](/faq#do-you-support-calendars-caldav), розширивши можливості платформи за межі електронної пошти для синхронізації календарів.
**Березень — липень 2024**: Forward Email випустив значні оптимізації та покращення своїх сервісів IMAP, POP3 та CalDAV, з метою зробити свій сервіс таким же швидким, якщо не швидшим, за альтернативи.

**Липень 2024**: Компанія [додала підтримку iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) для вирішення проблеми відсутності підтримки команди IMAP `IDLE` в Apple Mail на iOS, що дозволило отримувати сповіщення в реальному часі на пристроях Apple iOS. Forward Email також додала моніторинг часу до отримання листа ("TTI") для власного сервісу та Yahoo/AOL, а також почала дозволяти користувачам шифрувати весь свій DNS TXT запис навіть на безкоштовному тарифі. За запитом у [обговореннях Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) та [GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254), компанія додала можливість для псевдонімів або тихо відхиляти з кодом `250`, або м’яко відхиляти з кодом `421`, або ж жорстко відхиляти з кодом `550` при вимкненні.

**Серпень 2024**: Forward Email додала підтримку експорту поштових скриньок у форматах [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) та [Mbox](https://en.wikipedia.org/wiki/Mbox) (на додаток до існуючого формату експорту [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Додано підтримку підписів для webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks), а також компанія почала дозволяти користувачам надсилати розсилки, оголошення та email-маркетинг через свій вихідний SMTP сервіс. Також було впроваджено квоти на зберігання для IMAP/POP3/CalDAV на рівні домену та окремих псевдонімів.

### 2025 — Покращення конфіденційності та підтримка протоколів {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Вересень 2024 — січень 2025**: Forward Email [додала довгоочікувану функцію автоответчика на відпустку та шифрування OpenPGP/WKD для пересилання пошти](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), розширюючи вже реалізовані можливості зашифрованого зберігання поштових скриньок.

**21 січня 2025**: Найкращий друг засновника "Джек", його вірний собачий компаньйон, мирно пішов з життя у віці майже 11 років. Джек [завжди буде пам’ятатися](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) за свою непохитну дружбу, яка підтримувала створення Forward Email. [Технічний документ Forward Email](https://forwardemail.net/technical-whitepaper.pdf) присвячений Джеку, визнаючи його роль у розвитку сервісу.

**Лютий 2025**: Forward Email перейшла на [DataPacket](https://www.datapacket.com) як свого нового основного провайдера дата-центрів, впровадивши спеціалізоване, орієнтоване на продуктивність, bare-metal обладнання для подальшого підвищення надійності та швидкості сервісу.

**Березень 2025**: Офіційно випущено версію 1.0 Forward Email.

**Квітень 2025**: Опубліковано першу версію [Технічного документа Forward Email](https://forwardemail.net/technical-whitepaper.pdf), а компанія почала приймати платежі в криптовалюті.

**Травень 2025**: Сервіс запустив нову документацію API з використанням [Scalar](https://github.com/scalar/scalar).

**Червень 2025**: Forward Email запустила підтримку протоколу [CardDAV](/faq#do-you-support-contacts-carddav), розширюючи можливості платформи для синхронізації контактів поряд із існуючими сервісами електронної пошти та календаря.

**Серпень 2025**: Платформа додала підтримку [CalDAV VTODO/завдань](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), що дозволяє керувати завданнями поряд із подіями календаря.

**Листопад 2025**: Безпека платформи була покращена шляхом переходу від PBKDF2 до [Argon2id](https://en.wikipedia.org/wiki/Argon2) для хешування паролів, а інфраструктура була мігрувана з Redis на [Valkey](https://github.com/valkey-io/valkey).

**Грудень 2025**: Випущено версію 2.0, яка додала підтримку [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) для примусової TLS-шифрації при передачі пошти та оновилася до [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) версії 6.
### 2026 - Відповідність RFC та розширене фільтрування {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Січень 2026**: Forward Email випустив комплексний [документ відповідності протоколам RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) та додав підтримку [шифрування S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) і комплексного [фільтрування електронної пошти Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) з підтримкою протоколу [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API також було розширено до 39 кінцевих точок.

**Лютий 2026**: Офіційний, відкритий вебпоштовий клієнт запущено на [mail.forwardemail.net](https://mail.forwardemail.net) ([вихідний код на GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Платформа також додала підтримку [розширень планування CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) та [Domain Connect](https://domainconnect.org) для налаштування DNS в один клік. Запущено push-повідомлення в реальному часі для IMAP, CalDAV і CardDAV за допомогою WebSockets.

**Березень 2026**: Додано підтримку індивідуального сховища, сумісного з S3, для кожного домену, а також інструмент командного рядка для керування. Розпочато роботу над кросплатформеними десктопними та мобільними додатками для macOS, Windows, Linux, iOS та Android на основі того ж відкритого вебпоштового коду, створеного за допомогою [Tauri](https://tauri.app).


## Основні принципи {#core-principles}

Від самого початку Forward Email дотримується непохитних принципів конфіденційності та безпеки:

**100% відкритий код**: На відміну від конкурентів, які відкривають лише фронтенд, залишаючи бекенд закритим, Forward Email зробив весь свій код — і фронтенд, і бекенд — доступним для публічного перегляду на [GitHub](https://github.com/forwardemail).

**Дизайн із пріоритетом конфіденційності**: З першого дня Forward Email впровадив унікальний підхід обробки в пам’яті, який уникає запису листів на диск, що відрізняє його від звичайних поштових сервісів, які зберігають повідомлення у базах даних або файлових системах.

**Постійні інновації**: Сервіс розвинувся від простого рішення для пересилання пошти до комплексної платформи з функціями, такими як зашифровані поштові скриньки, квантово-стійке шифрування та підтримка стандартних протоколів, включно з SMTP, IMAP, POP3 і CalDAV.

**Прозорість**: Весь код відкритий і доступний для перевірки, що дозволяє користувачам самостійно підтверджувати заяви про конфіденційність, а не просто довіряти маркетинговим твердженням.

**Контроль користувача**: Надання користувачам можливостей, включно з опцією самостійного розгортання всієї платформи за бажанням.


## Поточний стан {#current-status}

Станом на березень 2026 року Forward Email обслуговує понад 500 000 доменів по всьому світу, включно з відомими організаціями та лідерами галузі, такими як:

* **Технологічні компанії**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Медіаорганізації**: Fox News Radio, Disney Ad Sales
* **Освітні установи**: Кембриджський університет, Університет Меріленду, Університет Вашингтона, Університет Тафтса, Коледж Свартмор
* **Державні установи**: Уряд Південної Австралії, Уряд Домініканської Республіки
* **Інші організації**: RCD Hotels, Fly<span>.</span>io
* **Відомі розробники**: Ісаак З. Шлютер (творець npm), Девід Хейнемайєр Ханссон (творець Ruby on Rails)

Платформа продовжує розвиватися з регулярними оновленнями функцій та покращеннями інфраструктури, зберігаючи позицію єдиного 100% відкритого, зашифрованого, орієнтованого на конфіденційність, прозорого та квантово-стійкого поштового сервісу, доступного сьогодні.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
