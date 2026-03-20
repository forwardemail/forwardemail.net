# Часті запитання {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email frequently asked questions" class="rounded-lg" />


## Зміст {#table-of-contents}

* [Швидкий старт](#quick-start)
* [Вступ](#introduction)
  * [Що таке Forward Email](#what-is-forward-email)
  * [Хто користується Forward Email](#who-uses-forward-email)
  * [Яка історія Forward Email](#what-is-forward-emails-history)
  * [Наскільки швидкий цей сервіс](#how-fast-is-this-service)
* [Поштові клієнти](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Мобільні пристрої](#mobile-devices)
  * [Конфігурація Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Конфігурація Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Конфігурація msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [Поштові клієнти командного рядка](#command-line-email-clients)
  * [Конфігурація пошти в Windows](#windows-email-configuration)
  * [Конфігурація Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Як надсилати листи від імені за допомогою Gmail](#how-to-send-mail-as-using-gmail)
  * [Що таке спадковий безкоштовний посібник для Send Mail As за допомогою Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Розширена конфігурація маршрутизації Gmail](#advanced-gmail-routing-configuration)
  * [Розширена конфігурація маршрутизації Outlook](#advanced-outlook-routing-configuration)
* [Вирішення проблем](#troubleshooting)
  * [Чому я не отримую тестові листи](#why-am-i-not-receiving-my-test-emails)
  * [Як налаштувати поштовий клієнт для роботи з Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Чому мої листи потрапляють у Спам і Джанк і як перевірити репутацію домену](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Що робити, якщо я отримую спам-листи](#what-should-i-do-if-i-receive-spam-emails)
  * [Чому мої тестові листи, надіслані собі в Gmail, позначаються як "підозрілі"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Чи можна видалити via forwardemail dot net у Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Управління даними](#data-management)
  * [Де розташовані ваші сервери](#where-are-your-servers-located)
  * [Як експортувати та створити резервну копію поштової скриньки](#how-do-i-export-and-backup-my-mailbox)
  * [Як імпортувати та мігрувати існуючу поштову скриньку](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Як використовувати власне сховище, сумісне з S3, для резервних копій](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Як конвертувати резервні копії SQLite у файли EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Чи підтримуєте ви самостійне розгортання](#do-you-support-self-hosting)
* [Конфігурація пошти](#email-configuration)
  * [Як почати та налаштувати переадресацію пошти](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Чи можна використовувати кілька MX обмінників і серверів для розширеної переадресації](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Як налаштувати автоответчик відпустки (автоматичний відповідь поза офісом)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Як налаштувати SPF для Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Як налаштувати DKIM для Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Як налаштувати DMARC для Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Як переглядати звіти DMARC](#how-do-i-view-dmarc-reports)
  * [Як підключити та налаштувати контакти](#how-do-i-connect-and-configure-my-contacts)
  * [Як підключити та налаштувати календарі](#how-do-i-connect-and-configure-my-calendars)
  * [Як додати більше календарів та керувати існуючими](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Як підключити та налаштувати завдання та нагадування](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Чому я не можу створювати завдання в macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [Як налаштувати Tasks.org на Android](#how-do-i-set-up-tasksorg-on-android)
  * [Як налаштувати SRS для Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Як налаштувати MTA-STS для Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Як додати фото профілю до моєї електронної адреси](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Розширені функції](#advanced-features)
  * [Чи підтримуєте ви розсилки або списки розсилки для маркетингових листів](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Чи підтримуєте ви надсилання листів через API](#do-you-support-sending-email-with-api)
  * [Чи підтримуєте ви отримання листів через IMAP](#do-you-support-receiving-email-with-imap)
  * [Чи підтримуєте ви POP3](#do-you-support-pop3)
  * [Чи підтримуєте ви календарі (CalDAV)](#do-you-support-calendars-caldav)
  * [Чи підтримуєте ви завдання та нагадування (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Чи підтримуєте ви контакти (CardDAV)](#do-you-support-contacts-carddav)
  * [Чи підтримуєте ви надсилання листів через SMTP](#do-you-support-sending-email-with-smtp)
  * [Чи підтримуєте ви OpenPGP/MIME, наскрізне шифрування ("E2EE") та Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Чи підтримуєте ви шифрування S/MIME](#do-you-support-smime-encryption)
  * [Чи підтримуєте ви фільтрацію листів Sieve](#do-you-support-sieve-email-filtering)
  * [Чи підтримуєте ви MTA-STS](#do-you-support-mta-sts)
  * [Чи підтримуєте ви passkeys та WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Чи підтримуєте ви найкращі практики електронної пошти](#do-you-support-email-best-practices)
  * [Чи підтримуєте ви вебхуки для відмов](#do-you-support-bounce-webhooks)
  * [Чи підтримуєте ви вебхуки](#do-you-support-webhooks)
  * [Чи підтримуєте ви регулярні вирази або regex](#do-you-support-regular-expressions-or-regex)
  * [Які у вас обмеження на вихідний SMTP](#what-are-your-outbound-smtp-limits)
  * [Чи потрібне схвалення для увімкнення SMTP](#do-i-need-approval-to-enable-smtp)
  * [Які налаштування конфігурації вашого SMTP сервера](#what-are-your-smtp-server-configuration-settings)
  * [Які налаштування конфігурації вашого IMAP сервера](#what-are-your-imap-server-configuration-settings)
  * [Які налаштування конфігурації вашого POP3 сервера](#what-are-your-pop3-server-configuration-settings)
  * [Як налаштувати автоматичне виявлення пошти для мого домену](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Безпека](#security-1)
  * [Розширені методи захисту серверів](#advanced-server-hardening-techniques)
  * [Чи маєте ви сертифікати SOC 2 або ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Чи використовуєте ви TLS шифрування для переадресації пошти](#do-you-use-tls-encryption-for-email-forwarding)
  * [Чи зберігаєте ви заголовки автентифікації листів](#do-you-preserve-email-authentication-headers)
  * [Чи зберігаєте ви оригінальні заголовки листів і запобігаєте підробці](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Як ви захищаєтеся від спаму та зловживань](#how-do-you-protect-against-spam-and-abuse)
  * [Чи зберігаєте ви вміст листів на диску](#do-you-store-email-content-on-disk)
  * [Чи може вміст листів бути розкритий під час збоїв системи](#can-email-content-be-exposed-during-system-crashes)
  * [Хто має доступ до вашої поштової інфраструктури](#who-has-access-to-your-email-infrastructure)
  * [Яких провайдерів інфраструктури ви використовуєте](#what-infrastructure-providers-do-you-use)
  * [Чи пропонуєте ви Угоду про обробку даних (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Як ви обробляєте повідомлення про витік даних](#how-do-you-handle-data-breach-notifications)
  * [Чи пропонуєте ви тестове середовище](#do-you-offer-a-test-environment)
  * [Чи надаєте ви інструменти моніторингу та оповіщення](#do-you-provide-monitoring-and-alerting-tools)
  * [Як ви забезпечуєте високу доступність](#how-do-you-ensure-high-availability)
  * [Чи відповідаєте ви розділу 889 Закону про національну оборону (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Системні та технічні деталі](#system-and-technical-details)
  * [Чи зберігаєте ви листи та їхній вміст](#do-you-store-emails-and-their-contents)
  * [Як працює ваша система переадресації пошти](#how-does-your-email-forwarding-system-work)
  * [Як ви обробляєте лист для переадресації](#how-do-you-process-an-email-for-forwarding)
  * [Як ви вирішуєте проблеми з доставкою листів](#how-do-you-handle-email-delivery-issues)
  * [Як ви реагуєте, якщо ваші IP-адреси блокують](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Що таке адреси postmaster](#what-are-postmaster-addresses)
  * [Що таке адреси no-reply](#what-are-no-reply-addresses)
  * [Які IP-адреси ваших серверів](#what-are-your-servers-ip-addresses)
  * [Чи маєте ви allowlist](#do-you-have-an-allowlist)
  * [Які розширення доменних імен за замовчуванням у allowlist](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Які критерії вашого allowlist](#what-is-your-allowlist-criteria)
  * [Які розширення доменних імен можна використовувати безкоштовно](#what-domain-name-extensions-can-be-used-for-free)
  * [Чи маєте ви greylist](#do-you-have-a-greylist)
  * [Чи маєте ви denylist](#do-you-have-a-denylist)
  * [Чи маєте ви обмеження швидкості](#do-you-have-rate-limiting)
  * [Як ви захищаєтеся від backscatter](#how-do-you-protect-against-backscatter)
  * [Запобігання відмовам від відомих спамерів MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Запобігання непотрібним відмовам для захисту від backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Як ви визначаєте відбиток листа](#how-do-you-determine-an-email-fingerprint)
  * [Чи можна переадресовувати листи на порти, окрім 25 (наприклад, якщо мій ISP заблокував порт 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Чи підтримує це символ плюс + для псевдонімів Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Чи підтримує це субдомени](#does-it-support-sub-domains)
  * [Чи переадресовує це заголовки моїх листів](#does-this-forward-my-emails-headers)
  * [Чи це добре протестовано](#is-this-well-tested)
  * [Чи передаєте ви SMTP відповіді та коди](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Як ви запобігаєте спамерам і забезпечуєте хорошу репутацію переадресації](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Як ви виконуєте DNS-запити для доменних імен](#how-do-you-perform-dns-lookups-on-domain-names)
* [Обліковий запис та оплата](#account-and-billing)
  * [Чи пропонуєте ви гарантію повернення грошей на платних планах](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Якщо я зміню план, чи робите ви пропорційне відшкодування різниці](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Чи можна використовувати цей сервіс переадресації як "резервний" або "fallback" MX сервер](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Чи можна вимкнути конкретні псевдоніми](#can-i-disable-specific-aliases)
  * [Чи можна переадресовувати листи кільком отримувачам](#can-i-forward-emails-to-multiple-recipients)
  * [Чи можна мати кілька глобальних отримувачів catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Чи є максимальна кількість адрес, на які можна переадресовувати листи для одного псевдоніма](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Чи можна рекурсивно переадресовувати листи](#can-i-recursively-forward-emails)
  * [Чи можуть люди скасовувати або реєструвати мою переадресацію без мого дозволу](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Як це безкоштовно](#how-is-it-free)
  * [Який максимальний розмір листа](#what-is-the-max-email-size-limit)
  * [Чи зберігаєте ви логи листів](#do-you-store-logs-of-emails)
  * [Чи зберігаєте ви логи помилок](#do-you-store-error-logs)
  * [Чи читаєте ви мої листи](#do-you-read-my-emails)
  * [Чи можна "надсилати листи від імені" в Gmail за допомогою цього](#can-i-send-mail-as-in-gmail-with-this)
  * [Чи можна "надсилати листи від імені" в Outlook за допомогою цього](#can-i-send-mail-as-in-outlook-with-this)
  * [Чи можна "надсилати листи від імені" в Apple Mail та iCloud Mail за допомогою цього](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Чи можна переадресовувати необмежену кількість листів за допомогою цього](#can-i-forward-unlimited-emails-with-this)
  * [Чи пропонуєте ви необмежену кількість доменів за одну ціну](#do-you-offer-unlimited-domains-for-one-price)
  * [Які способи оплати ви приймаєте](#which-payment-methods-do-you-accept)
* [Додаткові ресурси](#additional-resources)
## Швидкий старт {#quick-start}

Щоб почати користуватися Forward Email:

1. **Створіть обліковий запис** на [forwardemail.net/register](https://forwardemail.net/register)

2. **Додайте та підтвердіть свій домен** у розділі [Мій обліковий запис → Домени](/my-account/domains)

3. **Додайте та налаштуйте поштові псевдоніми/скриньки** у розділі [Мій обліковий запис → Домени](/my-account/domains) → Псевдоніми

4. **Перевірте налаштування**, надіславши лист на один із ваших нових псевдонімів

> \[!TIP]
> Зміни DNS можуть поширюватися по всьому світу до 24-48 годин, хоча часто вони набирають чинності значно раніше.

> \[!IMPORTANT]
> Для покращення доставляння ми рекомендуємо налаштувати записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) та [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Вступ {#introduction}

### Що таке Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email ідеально підходить для приватних осіб, малого бізнесу та розробників, які хочуть професійні електронні адреси без витрат і обслуговування повноцінного поштового хостингу.

Forward Email — це **повнофункціональний провайдер електронної пошти** та **провайдер поштового хостингу для власних доменних імен**.

Це єдина безкоштовна та відкрита служба, яка дозволяє використовувати електронні адреси з власним доменом без складнощів налаштування та обслуговування власного поштового сервера.

Наш сервіс пересилає листи, надіслані на ваш власний домен, на вашу існуючу поштову скриньку — і ви навіть можете використовувати нас як свого спеціалізованого провайдера поштового хостингу.

Основні функції Forward Email:

* **Електронна пошта з власним доменом**: Використовуйте професійні електронні адреси з вашим доменним іменем
* **Безкоштовний тариф**: Базове пересилання пошти безкоштовно
* **Покращена конфіденційність**: Ми не читаємо ваші листи і не продаємо ваші дані
* **Відкритий код**: Весь наш код доступний на GitHub
* **Підтримка SMTP, IMAP та POP3**: Повна функціональність відправлення та отримання пошти
* **Кінцева шифрація**: Підтримка OpenPGP/MIME
* **Користувацькі псевдоніми Catch-All**: Створюйте необмежену кількість поштових псевдонімів

Ви можете порівняти нас з понад 56 іншими провайдерами електронної пошти на [нашій сторінці порівняння поштових сервісів](/blog/best-email-service).

> \[!TIP]
> Дізнайтеся більше про Forward Email, прочитавши наш безкоштовний [Технічний білет](/technical-whitepaper.pdf)

### Хто користується Forward Email {#who-uses-forward-email}

Ми надаємо послуги поштового хостингу та пересилання пошти для понад 500 000 доменів та таких відомих користувачів:

| Клієнт                                  | Кейс-стаді                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Військово-морська академія США          | [:page_facing_up: Кейс-стаді](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                               | [:page_facing_up: Кейс-стаді](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                           |                                                                                                          |
| Фонд Linux                             | [:page_facing_up: Кейс-стаді](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| Фонд PHP                               |                                                                                                          |
| Fox News Radio                         |                                                                                                          |
| Disney Ad Sales                        |                                                                                                          |
| jQuery                                 | [:page_facing_up: Кейс-стаді](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                              |                                                                                                          |
| Ubuntu                                 | [:page_facing_up: Кейс-стаді](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                | [:page_facing_up: Кейс-стаді](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                | [:page_facing_up: Кейс-стаді](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Кембриджський університет              | [:page_facing_up: Кейс-стаді](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Університет Меріленду                  | [:page_facing_up: Кейс-стаді](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Університет Вашингтона                 | [:page_facing_up: Кейс-стаді](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Університет Тафтса                    | [:page_facing_up: Кейс-стаді](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Коледж Свартмор                       | [:page_facing_up: Кейс-стаді](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Уряд Південної Австралії              |                                                                                                          |
| Уряд Домініканської Республіки        |                                                                                                          |
| Fly<span>.</span>io                    |                                                                                                          |
| RCD Hotels                           |                                                                                                          |
| Айзек З. Шлюетер (npm)                | [:page_facing_up: Кейс-стаді](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| Девід Хайнемайєр Ханссон (Ruby on Rails) |                                                                                                          |
### Яка історія Forward Email {#what-is-forward-emails-history}

Ви можете дізнатися більше про Forward Email на [нашій сторінці "Про нас"](/about).

### Наскільки швидкий цей сервіс {#how-fast-is-this-service}

> \[!NOTE]
> Наша система розроблена для швидкості та надійності, з кількома резервними серверами, щоб забезпечити своєчасну доставку ваших листів.

Forward Email доставляє повідомлення з мінімальною затримкою, зазвичай протягом кількох секунд після отримання.

Показники продуктивності:

* **Середній час доставки**: Менше 5-10 секунд від отримання до пересилання ([див. нашу сторінку моніторингу Time to Inbox "TTI"](/tti))
* **Час безвідмовної роботи**: 99,9%+ доступності сервісу
* **Глобальна інфраструктура**: Сервери стратегічно розташовані для оптимального маршрутування
* **Автоматичне масштабування**: Наша система масштабується під час пікових періодів надходження листів

Ми працюємо в режимі реального часу, на відміну від інших провайдерів, які використовують відкладені черги.

Ми не записуємо на диск і не зберігаємо логи – за винятком [помилок](#do-you-store-error-logs) та [вихідного SMTP](#do-you-support-sending-email-with-smtp) (див. нашу [Політику конфіденційності](/privacy)).

Все виконується в пам’яті, а [наш вихідний код доступний на GitHub](https://github.com/forwardemail).


## Поштові клієнти {#email-clients}

### Thunderbird {#thunderbird}

1. Створіть новий псевдонім і згенеруйте пароль у вашій панелі керування Forward Email
2. Відкрийте Thunderbird і перейдіть у **Редагувати → Налаштування облікових записів → Дії з обліковим записом → Додати поштовий обліковий запис**
3. Введіть ваше ім’я, адресу Forward Email та пароль
4. Натисніть **Налаштувати вручну** і введіть:
   * Вхідний: IMAP, `imap.forwardemail.net`, порт 993, SSL/TLS
   * Вихідний: SMTP, `smtp.forwardemail.net`, порт 465, SSL/TLS (рекомендовано; також підтримується порт 587 з STARTTLS)
5. Натисніть **Готово**

### Microsoft Outlook {#microsoft-outlook}

1. Створіть новий псевдонім і згенеруйте пароль у вашій панелі керування Forward Email
2. Перейдіть у **Файл → Додати обліковий запис**
3. Введіть вашу адресу Forward Email і натисніть **Підключитися**
4. Оберіть **Додаткові параметри** і виберіть **Дозвольте мені налаштувати обліковий запис вручну**
5. Виберіть **IMAP** і введіть:
   * Вхідний: `imap.forwardemail.net`, порт 993, SSL
   * Вихідний: `smtp.forwardemail.net`, порт 465, SSL/TLS (рекомендовано; також підтримується порт 587 з STARTTLS)
   * Ім’я користувача: Ваша повна електронна адреса
   * Пароль: Ваш згенерований пароль
6. Натисніть **Підключитися**

### Apple Mail {#apple-mail}

1. Створіть новий псевдонім і згенеруйте пароль у вашій панелі керування Forward Email
2. Перейдіть у **Пошта → Налаштування → Облікові записи → +**
3. Виберіть **Інший поштовий обліковий запис**
4. Введіть ваше ім’я, адресу Forward Email та пароль
5. Для налаштувань сервера введіть:
   * Вхідний: `imap.forwardemail.net`
   * Вихідний: `smtp.forwardemail.net`
   * Ім’я користувача: Ваша повна електронна адреса
   * Пароль: Ваш згенерований пароль
6. Натисніть **Увійти**

### eM Client {#em-client}

1. Створіть новий псевдонім і згенеруйте пароль у вашій панелі керування Forward Email
2. Відкрийте eM Client і перейдіть у **Меню → Облікові записи → + Додати обліковий запис**
3. Натисніть на **Пошта**, а потім виберіть **Інший**
4. Введіть вашу адресу Forward Email і натисніть **Далі**
5. Введіть наступні налаштування сервера:
   * **Вхідний сервер**: `imap.forwardemail.net`
   * **Вихідний сервер**: `smtp.forwardemail.net`
6. Введіть вашу повну електронну адресу як **Ім’я користувача** та ваш згенерований пароль як **Пароль** для обох серверів.
7. eM Client перевірить з’єднання. Після успішної перевірки натисніть **Далі**.
8. Введіть ваше ім’я та оберіть назву облікового запису.
9. Натисніть **Завершити**.

### Мобільні пристрої {#mobile-devices}

Для iOS:

1. Перейдіть у **Налаштування → Пошта → Облікові записи → Додати обліковий запис → Інший**
2. Торкніться **Додати поштовий обліковий запис** і введіть ваші дані
3. Для налаштувань сервера використовуйте ті ж IMAP та SMTP налаштування, що й вище

Для Android:

1. Перейдіть у **Налаштування → Облікові записи → Додати обліковий запис → Особистий (IMAP)**
2. Введіть вашу адресу Forward Email та пароль
3. Для налаштувань сервера використовуйте ті ж IMAP та SMTP налаштування, що й вище

### Налаштування Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

Ви можете налаштувати Sendmail для ретрансляції листів через SMTP-сервери Forward Email. Це поширена конфігурація для застарілих систем або додатків, які покладаються на Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 20 хвилин</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Для цього потрібен платний план з увімкненим доступом до SMTP.
  </span>
</div>

#### Налаштування {#configuration}

1. Відредагуйте файл `sendmail.mc`, який зазвичай знаходиться за адресою `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Додайте наступні рядки для визначення smart host та автентифікації:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Створіть файл автентифікації `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Додайте свої облікові дані Forward Email у файл `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Згенеруйте базу даних автентифікації та захистіть файли:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Перебудуйте конфігурацію Sendmail та перезапустіть сервіс:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Тестування {#testing}

Надішліть тестовий лист, щоб перевірити конфігурацію:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Налаштування Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 — популярний MTA на системах на базі Debian. Ви можете налаштувати його для використання Forward Email як smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 15 хвилин</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Для цього потрібен платний план з увімкненим доступом до SMTP.
  </span>
</div>

#### Налаштування {#configuration-1}

1. Запустіть інструмент налаштування Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Виберіть наступні опції:
   * **Загальний тип конфігурації пошти:** пошта, що надсилається через smarthost; отримується через SMTP або fetchmail
   * **Системне ім’я пошти:** your.hostname
   * **IP-адреси для прослуховування вхідних SMTP-з’єднань:** 127.0.0.1 ; ::1
   * **Інші призначення, для яких приймається пошта:** (залишити порожнім)
   * **Домени для ретрансляції пошти:** (залишити порожнім)
   * **IP-адреса або ім’я хоста вихідного smarthost:** smtp.forwardemail.net::465
   * **Приховати локальне ім’я пошти у вихідній пошті?** Ні
   * **Зменшити кількість DNS-запитів (Dial-on-Demand)?** Ні
   * **Метод доставки локальної пошти:** формат Mbox у /var/mail/
   * **Розбити конфігурацію на дрібні файли?** Ні

3. Відредагуйте файл `passwd.client`, щоб додати свої облікові дані:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Додайте наступний рядок:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Оновіть конфігурацію та перезапустіть Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Тестування {#testing-1}

Надішліть тестовий лист:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### Налаштування SMTP-клієнта msmtp {#msmtp-smtp-client-configuration}

msmtp — це легкий SMTP-клієнт, який корисний для надсилання листів зі скриптів або командного рядка.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 10 хвилин</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Для цього потрібен платний план із увімкненим доступом до SMTP.
  </span>
</div>

#### Конфігурація {#configuration-2}

1. Створіть або відредагуйте файл конфігурації msmtp за адресою `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Додайте таку конфігурацію:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Встановіть правильні права доступу до файлу конфігурації:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Тестування {#testing-2}

Надішліть тестовий лист:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Клієнти електронної пошти з командного рядка {#command-line-email-clients}

Популярні клієнти електронної пошти з командного рядка, такі як [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) та [Alpine](https://alpine.x10.mx/alpine/release/), можна налаштувати для використання SMTP-серверів Forward Email для надсилання пошти. Конфігурація буде схожа на налаштування `msmtp`, де ви вказуєте деталі SMTP-сервера та свої облікові дані у відповідних файлах конфігурації (`.muttrc`, `.neomuttrc` або `.pinerc`).

### Налаштування електронної пошти для Windows {#windows-email-configuration}

Для користувачів Windows можна налаштувати популярні клієнти електронної пошти, такі як **Microsoft Outlook** та **eM Client**, використовуючи IMAP та SMTP налаштування, надані у вашому обліковому записі Forward Email. Для використання з командного рядка або скриптів можна застосувати PowerShell cmdlet `Send-MailMessage` (хоча він вважається застарілим) або легкий SMTP-релейний інструмент, як-от [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Налаштування SMTP-реле Postfix {#postfix-smtp-relay-configuration}

Ви можете налаштувати Postfix для ретрансляції листів через SMTP-сервери Forward Email. Це корисно для серверних застосунків, які потребують надсилання електронної пошти.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 15 хвилин</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Для цього потрібен платний план із увімкненим доступом до SMTP.
  </span>
</div>

#### Встановлення {#installation}

1. Встановіть Postfix на ваш сервер:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Під час встановлення виберіть "Internet Site" при запиті типу конфігурації.

#### Конфігурація {#configuration-3}

1. Відредагуйте головний файл конфігурації Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Додайте або змініть такі налаштування:

```
# Налаштування SMTP-реле
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Створіть файл паролів SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Додайте свої облікові дані Forward Email:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Захистіть і створіть хеш файлу паролів:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Перезапустіть Postfix:

```bash
sudo systemctl restart postfix
```

#### Тестування {#testing-3}

Перевірте конфігурацію, надіславши тестовий лист:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Як надсилати пошту від імені за допомогою Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 10 хвилин</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Початок роботи:
  </strong>
  <span>
    Якщо ви виконали інструкції вище в розділі <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Як почати та налаштувати переадресацію електронної пошти</a>, тоді можете продовжувати читати нижче.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a>, <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> та <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Обмеження вихідного SMTP</a> &ndash; ваше використання вважається підтвердженням та згодою.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви розробник, зверніться до наших <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документацій API електронної пошти</a>.
  </span>
</div>

1. Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP та дотримуйтесь інструкцій налаштування

2. Створіть новий псевдонім для вашого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

3. Натисніть на <strong class="text-success"><i class="fa fa-key"></i> Згенерувати пароль</strong> поруч із щойно створеним псевдонімом. Скопіюйте в буфер обміну та надійно збережіть згенерований пароль, який відобразиться на екрані.

4. Перейдіть до [Gmail](https://gmail.com) і в розділі [Налаштування <i class="fa fa-angle-right"></i> Облікові записи та імпорт <i class="fa fa-angle-right"></i> Надіслати лист як](https://mail.google.com/mail/u/0/#settings/accounts), натисніть "Додати іншу адресу електронної пошти"

5. Коли буде запропоновано "Ім'я", введіть ім'я, яке ви хочете бачити як відправника (наприклад, "Linus Torvalds").

6. Коли буде запропоновано "Адреса електронної пошти", введіть повну адресу електронної пошти псевдоніма, який ви створили в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

7. Зніміть прапорець "Розглядати як псевдонім"

8. Натисніть "Наступний крок" для продовження

9. Коли буде запропоновано "SMTP-сервер", введіть <code>smtp.forwardemail.net</code> і змініть порт на <code>465</code>

10. Коли буде запропоновано "Ім'я користувача", введіть повну адресу електронної пошти псевдоніма, який ви створили в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

11. Коли буде запропоновано "Пароль", вставте пароль із <strong class="text-success"><i class="fa fa-key"></i> Згенерувати пароль</strong> з кроку 3 вище

12. Виберіть радіокнопку "Захищене з’єднання за допомогою SSL"

13. Натисніть "Додати акаунт" для продовження

14. Відкрийте нову вкладку в [Gmail](https://gmail.com) і дочекайтеся надходження листа для підтвердження (ви отримаєте код підтвердження, який підтверджує, що ви є власником адреси електронної пошти, з якої намагаєтеся "Надіслати лист як")

15. Коли лист надійде, скопіюйте та вставте код підтвердження у запит, який ви отримали на попередньому кроці
16. Після цього поверніться до електронної пошти та натисніть посилання, щоб "підтвердити запит". Найімовірніше, вам потрібно буде виконати цей крок і попередній, щоб електронна пошта була налаштована правильно.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

</div>

### Що таке спадковий безкоштовний посібник для Send Mail As за допомогою Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Важливо:</strong> Цей спадковий безкоштовний посібник застарів станом на травень 2023 року, оскільки <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">ми тепер підтримуємо вихідний SMTP</a>. Якщо ви використовуєте посібник нижче, то <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">це спричинить появу у вашій вихідній електронній пошті</a> напису "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" у Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 10 хвилин</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Початок роботи:
  </strong>
  <span>
    Якщо ви виконали інструкції вище у розділі <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Як почати та налаштувати пересилання електронної пошти</a>, тоді можете продовжувати читати нижче.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Вам потрібно мати увімкнене [двофакторне автентифікування Gmail][gmail-2fa], щоб це працювало. Відвідайте <https://www.google.com/landing/2step/>, якщо у вас воно не увімкнене.

2. Після увімкнення двофакторного автентифікування (або якщо воно вже було увімкнене), відвідайте <https://myaccount.google.com/apppasswords>.

3. Коли буде запропоновано "Виберіть додаток і пристрій, для яких потрібно створити пароль додатка":
   * Виберіть "Пошта" у випадаючому списку "Виберіть додаток"
   * Виберіть "Інше" у випадаючому списку "Виберіть пристрій"
   * Коли буде запропоновано ввести текст, введіть адресу електронної пошти вашого власного домену, з якого ви пересилаєте (наприклад, <code><hello@example.com></code> - це допоможе вам відстежувати, якщо ви використовуєте цю службу для кількох облікових записів)

4. Скопіюйте пароль, який буде автоматично згенерований, у буфер обміну
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Важливо:
     </strong>
     <span>
       Якщо ви використовуєте G Suite, відвідайте панель адміністратора <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Програми <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Налаштування для Gmail <i class="fa fa-angle-right"></i> Налаштування</a> і переконайтеся, що встановлено прапорець "Дозволити користувачам надсилати пошту через зовнішній SMTP-сервер...". Для активації цієї зміни знадобиться деякий час, тому зачекайте кілька хвилин.
     </span>
   </div>

5. Перейдіть на [Gmail](https://gmail.com) і в розділі [Налаштування <i class="fa fa-angle-right"></i> Облікові записи та імпорт <i class="fa fa-angle-right"></i> Надіслати пошту як](https://mail.google.com/mail/u/0/#settings/accounts) натисніть "Додати іншу адресу електронної пошти"

6. Коли буде запропоновано "Ім'я", введіть ім'я, яке ви хочете бачити у полі "Від" вашої електронної пошти (наприклад, "Linus Torvalds")

7. Коли буде запропоновано "Адреса електронної пошти", введіть адресу електронної пошти з власного домену, яку ви використовували вище (наприклад, <code><hello@example.com></code>)
8. Зніміть прапорець "Treat as an alias"

9. Натисніть "Next Step" для продовження

10. Коли з’явиться запит "SMTP Server", введіть <code>smtp.gmail.com</code> і залиште порт <code>587</code>

11. Коли з’явиться запит "Username", введіть частину вашої адреси Gmail без частини <span>gmail.com</span> (наприклад, лише "user", якщо моя електронна адреса <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Важливо:
      </strong>
      <span>
        Якщо поле "Username" заповнене автоматично, тоді <u><strong>вам потрібно змінити це</strong></u> на частину імені користувача вашої адреси Gmail.
      </span>
    </div>

12. Коли з’явиться запит "Password", вставте з буфера обміну пароль, який ви створили на кроці 2 вище

13. Залиште вибраним радіокнопку "Secured connection using TLS"

14. Натисніть "Add Account" для продовження

15. Відкрийте нову вкладку на [Gmail](https://gmail.com) і зачекайте, поки надійде лист для підтвердження (ви отримаєте код підтвердження, який підтверджує, що ви є власником електронної адреси, з якої намагаєтеся "Send Mail As")

16. Коли лист надійде, скопіюйте та вставте код підтвердження у запит, який ви отримали на попередньому кроці

17. Після цього поверніться до електронного листа і натисніть посилання для "confirm the request". Ймовірно, вам потрібно буде виконати цей крок і попередній, щоб електронна адреса була правильно налаштована.

</div>

### Advanced Gmail Routing Configuration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>15-30 хвилин</span>
</div>

Якщо ви хочете налаштувати розширену маршрутизацію в Gmail так, щоб псевдоніми, які не відповідають жодній поштовій скриньці, пересилалися на поштові сервери Forward Email, виконайте наступні кроки:

1. Увійдіть у консоль адміністратора Google за адресою [admin.google.com](https://admin.google.com)
2. Перейдіть до **Apps → Google Workspace → Gmail → Routing**
3. Натисніть **Add Route** і налаштуйте такі параметри:

**Налаштування для одного отримувача:**

* Виберіть "Change envelope recipient" і введіть вашу основну адресу Gmail
* Позначте "Add X-Gm-Original-To header with original recipient"

**Шаблони отримувача конверта:**

* Додайте шаблон, який відповідає всім неіснуючим поштовим скринькам (наприклад, `.*@yourdomain.com`)

**Налаштування поштового сервера:**

* Виберіть "Route to host" і введіть `mx1.forwardemail.net` як основний сервер
* Додайте `mx2.forwardemail.net` як резервний сервер
* Встановіть порт 25
* Виберіть "Require TLS" для безпеки

4. Натисніть **Save** для створення маршруту

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Ця конфігурація працюватиме лише для облікових записів Google Workspace з власними доменами, а не для звичайних облікових записів Gmail.
  </span>
</div>

### Advanced Outlook Routing Configuration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimated Setup Time:</strong>
  <span>15-30 хвилин</span>
</div>

Для користувачів Microsoft 365 (раніше Office 365), які хочуть налаштувати розширену маршрутизацію так, щоб псевдоніми, які не відповідають жодній поштовій скриньці, пересилалися на поштові сервери Forward Email:

1. Увійдіть у центр адміністрування Microsoft 365 за адресою [admin.microsoft.com](https://admin.microsoft.com)
2. Перейдіть до **Exchange → Mail flow → Rules**
3. Натисніть **Add a rule** і виберіть **Create a new rule**
4. Назвіть ваше правило (наприклад, "Forward non-existent mailboxes to Forward Email")
5. У розділі **Apply this rule if** виберіть:
   * "The recipient address matches..."
   * Введіть шаблон, який відповідає всім адресам вашого домену (наприклад, `*@yourdomain.com`)
6. У розділі **Do the following** виберіть:
   * "Redirect the message to..."
   * Оберіть "The following mail server"
   * Введіть `mx1.forwardemail.net` і порт 25
   * Додайте `mx2.forwardemail.net` як резервний сервер
7. У розділі **Except if** виберіть:
   * "The recipient is..."
   * Додайте всі ваші існуючі поштові скриньки, які не повинні пересилатися
8. Встановіть пріоритет правила, щоб воно виконувалося після інших правил поштового потоку
9. Натисніть **Save** для активації правила
## Усунення несправностей {#troubleshooting}

### Чому я не отримую свої тестові листи {#why-am-i-not-receiving-my-test-emails}

Якщо ви надсилаєте тестовий лист собі, він може не з’явитися у вашій папці "Вхідні", оскільки має той самий заголовок "Message-ID".

Це широко відома проблема, яка також впливає на сервіси, такі як Gmail.  <a href="https://support.google.com/a/answer/1703601">Ось офіційна відповідь Gmail щодо цієї проблеми</a>.

Якщо проблеми продовжуються, найімовірніше, це пов’язано з поширенням DNS. Вам потрібно трохи почекати і спробувати знову (або спробувати встановити менше значення TTL для ваших <strong class="notranslate">TXT</strong> записів).

**Все ще виникають проблеми?**  Будь ласка, <a href="/help">зв’яжіться з нами</a>, щоб ми могли допомогти розслідувати проблему і знайти швидке рішення.

### Як налаштувати свій поштовий клієнт для роботи з Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Наш сервіс працює з популярними поштовими клієнтами, такими як:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Ваше ім’я користувача — це електронна адреса вашого псевдоніма, а пароль — з <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Звичайний пароль").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>Якщо ви використовуєте Thunderbird, переконайтеся, що "Connection security" встановлено на "SSL/TLS", а метод автентифікації — на "Normal password".</span>
</div>

| Тип  |         Ім’я хоста        |         Протокол        |                                            Порти                                           |
| :---: | :-----------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Переважно**  |                                      `993` та `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Рекомендовано** | `465` та `2465` для SSL/TLS (рекомендовано) або `587`, `2587`, `2525` та `25` для STARTTLS |

### Чому мої листи потрапляють у Спам і Небажані та як перевірити репутацію мого домену {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Цей розділ допоможе вам, якщо ваша вихідна пошта використовує наші SMTP сервери (наприклад, `smtp.forwardemail.net`) (або пересилається через `mx1.forwardemail.net` чи `mx2.forwardemail.net`) і вона потрапляє у папку Спам або Небажана пошта у отримувачів.

Ми регулярно моніторимо наші [IP-адреси](#what-are-your-servers-ip-addresses) щодо [всіх авторитетних DNS-списків блокування](#how-do-you-handle-your-ip-addresses-becoming-blocked), **тому найімовірніше це проблема, пов’язана з репутацією домену**.

Листи можуть потрапляти у спам з кількох причин:

1. **Відсутність автентифікації**: Налаштуйте записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) та [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Репутація домену**: Нові домени часто мають нейтральну репутацію, доки не встановлять історію відправлень.

3. **Тригери вмісту**: Певні слова або фрази можуть активувати спам-фільтри.

4. **Патерни відправлення**: Різке збільшення обсягу листів може виглядати підозріло.

Ви можете спробувати використати один або кілька з цих інструментів для перевірки репутації та категоризації вашого домену:

#### Інструменти перевірки репутації та блоклистів {#reputation-and-blocklist-check-tools}

| Назва інструменту                         | URL                                                          | Тип                    |
| ----------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback | <https://radar.cloudflare.com/domains/feedback>              | Категоризація          |
| Spamhaus IP and Domain Reputation Checker | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Репутація              |
| Barracuda IP and Domain Reputation Lookup | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                | <https://mxtoolbox.com/blacklists.aspx>                      | Чорний список          |
| Google Postmaster Tools                   | <https://www.gmail.com/postmaster/>                          | Репутація              |
| Yahoo Sender Hub                          | <https://senders.yahooinc.com/>                              | Репутація              |
| MultiRBL.valli.org Blacklist Check        | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                              | <https://senderscore.org/act/blocklist-remover/>             | Репутація              |
| Invaluement                               | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                     | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                   | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3           | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org            | <https://www.backscatterer.org/>                             | Захист від backscatter |
| UCEPROTECT's whitelisted.org              | <https://www.whitelisted.org/> (потрібна оплата)             | DNSWL                  |

#### Форми запиту на видалення IP у провайдерів {#ip-removal-request-forms-by-provider}

Якщо вашу IP-адресу заблокував конкретний поштовий провайдер, скористайтеся відповідною формою видалення або контактом нижче:

| Провайдер                              | Форма видалення / Контакт                                                                                  | Примітки                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Форма контакту для масових відправників      |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Портал видалення IP для Office 365           |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                          | Apple використовує Proofpoint для репутації IP |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                          | Перевірка та видалення IP у Proofpoint       |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Перевірка та видалення репутації Barracuda   |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                      | Запит на скидання Cloudmark CSI               |
| GoDaddy/SecureServer               | <https://unblock.secureserver.net>                                                                         | Форма запиту на розблокування GoDaddy IP      |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                           | Запит на видалення IP Comcast                 |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Зверніться до підтримки Spectrum для видалення |
| AT&T                               | `abuse_rbl@abuse-att.net`                                                                                  | Email для запиту на видалення                 |
| Cox Communications               | `unblock.request@cox.net`                                                                                  | Email для запиту на видалення                 |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                                    | Використовує Cloudfilter                      |
| Windstream                       | `abuse@windstream.net`                                                                                     | Email для запиту на видалення                 |
| t-online.de (Німеччина)          | `tobr@rx.t-online.de`                                                                                      | Email для запиту на видалення                 |
| Orange France                    | <https://postmaster.orange.fr/>                                                                            | Використовуйте форму контакту або email `abuse@orange.fr` |
| GMX                              | <https://postmaster.gmx.net/en/contact>                                                                    | Форма контакту GMX postmaster                  |
| Mail.ru                          | <https://postmaster.mail.ru/>                                                                              | Портал Mail.ru postmaster                      |
| Yandex                           | <https://postmaster.yandex.ru/>                                                                            | Портал Yandex postmaster                       |
| QQ Mail (Tencent)                | <https://open.mail.qq.com/>                                                                                | Заявка на додавання у білий список QQ Mail (китайською) |
| Netease (163.com)                | <https://mail.163.com/postmaster/>                                                                         | Портал Netease postmaster                      |
| Alibaba/Aliyun/HiChina           | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Контакт через консоль Alibaba Cloud            |
| Amazon SES                      | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | Консоль AWS SES > Видалення з чорного списку  |
| SendGrid                       | <https://support.sendgrid.com/>                                                                            | Контакт служби підтримки SendGrid              |
| Mimecast                       | <https://community.mimecast.com/>                                                                          | Використовує сторонні RBL - звертайтесь до конкретного RBL |
| Fastmail                       | <https://www.fastmail.com/support/>                                                                        | Контакт служби підтримки Fastmail              |
| Zoho                           | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Контакт служби підтримки Zoho                   |
| ProtonMail                     | <https://proton.me/support/contact>                                                                        | Контакт служби підтримки Proton                 |
| Tutanota                       | <https://tutanota.com/support>                                                                             | Контакт служби підтримки Tutanota               |
| Hushmail                       | <https://www.hushmail.com/support/>                                                                        | Контакт служби підтримки Hushmail               |
| Mailbox.org                    | <https://mailbox.org/en/support>                                                                           | Контакт служби підтримки Mailbox.org            |
| Posteo                         | <https://posteo.de/en/site/contact>                                                                        | Контакт служби підтримки Posteo                  |
| DuckDuckGo Email               | <https://duckduckgo.com/email/support>                                                                     | Контакт служби підтримки DuckDuckGo              |
| Sonic.net                      | <https://www.sonic.com/support>                                                                            | Контакт служби підтримки Sonic                    |
| Telus                         | <https://www.telus.com/en/support>                                                                         | Контакт служби підтримки Telus                    |
| Vodafone Germany              | <https://www.vodafone.de/hilfe/>                                                                           | Контакт служби підтримки Vodafone                 |
| Xtra (Spark NZ)               | <https://www.spark.co.nz/help/>                                                                            | Контакт служби підтримки Spark NZ                  |
| UOL/BOL (Бразилія)            | <https://ajuda.uol.com.br/>                                                                                | Контакт служби підтримки UOL (португальською)     |
| Libero (Італія)               | <https://aiuto.libero.it/>                                                                                 | Контакт служби підтримки Libero (італійською)     |
| Telenet (Бельгія)             | <https://www2.telenet.be/en/support/>                                                                      | Контакт служби підтримки Telenet                   |
| Facebook/WhatsApp             | <https://www.facebook.com/business/help>                                                                   | Контакт служби підтримки Facebook Business         |
| LinkedIn                     | <https://www.linkedin.com/help/linkedin>                                                                   | Контакт служби підтримки LinkedIn                   |
| Groups.io                    | <https://groups.io/helpcenter>                                                                             | Контакт служби підтримки Groups.io                  |
| Earthlink/Vade Secure        | <https://sendertool.vadesecure.com/en/>                                                                    | Інструмент відправника Vade Secure                   |
| Cloudflare Email Security    | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Контакт служби підтримки Cloudflare                  |
| Hornetsecurity/Expurgate     | <https://www.hornetsecurity.com/>                                                                          | Контакт служби підтримки Hornetsecurity              |
| SpamExperts/Antispamcloud    | <https://www.spamexperts.com/>                                                                             | Контакт через хостинг-провайдера                      |
| Mail2World                  | <https://www.mail2world.com/support/>                                                                      | Контакт служби підтримки Mail2World                   |
> \[!TIP]
> Починайте з невеликої кількості якісних листів, щоб створити позитивну репутацію перед надсиланням у більших обсягах.

> \[!IMPORTANT]
> Якщо ваш домен знаходиться у чорному списку, кожен чорний список має власний процес видалення. Перевірте їхні вебсайти для інструкцій.

> \[!TIP]
> Якщо вам потрібна додаткова допомога або ви виявили, що ми помилково внесені до спам-листів певного провайдера електронної пошти, будь ласка, <a href="/help">зв’яжіться з нами</a>.

### Що робити, якщо я отримую спам-листи {#what-should-i-do-if-i-receive-spam-emails}

Вам слід відписатися від розсилки (якщо це можливо) та заблокувати відправника.

Будь ласка, не позначайте повідомлення як спам, а натомість пересилайте його до нашої вручну кураторованої та орієнтованої на конфіденційність системи запобігання зловживанням.

**Адреса електронної пошти для пересилання спаму:** <abuse@forwardemail.net>

### Чому мої тестові листи, надіслані собі в Gmail, позначаються як "підозрілі" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Якщо ви бачите це повідомлення про помилку в Gmail, коли надсилаєте тест собі, або коли людина, з якою ви спілкуєтесь через ваш псевдонім, вперше бачить лист від вас, то **не хвилюйтеся** – це вбудована функція безпеки Gmail.

Ви можете просто натиснути "Виглядає безпечно". Наприклад, якщо ви надішлете тестове повідомлення, використовуючи функцію надсилання від імені (send mail as) (комусь іншому), вони не побачать цього повідомлення.

Однак, якщо вони бачать це повідомлення, це тому, що вони звикли бачити ваші листи від <john@gmail.com>, а не від <john@customdomain.com> (це лише приклад). Gmail попереджає користувачів, щоб переконатися, що все безпечно, інакше обхідного шляху немає.

### Чи можна видалити via forwardemail dot net у Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ця тема пов’язана з [відомою проблемою в Gmail, коли поруч із ім’ям відправника з’являється додаткова інформація](https://support.google.com/mail/answer/1311182).

Станом на травень 2023 року ми підтримуємо надсилання листів через SMTP як додаткову опцію для всіх платних користувачів – це означає, що ви можете видалити <span class="notranslate">via forwardemail dot net</span> у Gmail.

Зверніть увагу, що це питання FAQ стосується тих, хто використовує функцію [Як надсилати листи від імені через Gmail](#how-to-send-mail-as-using-gmail).

Будь ласка, дивіться розділ [Чи підтримуєте ви надсилання листів через SMTP](#do-you-support-sending-email-with-smtp) для інструкцій з налаштування.


## Управління даними {#data-management}

### Де розташовані ваші сервери {#where-are-your-servers-located}

> \[!TIP]
> Незабаром ми можемо оголосити про розташування нашого датацентру в ЄС, розміщеного під [forwardemail.eu](https://forwardemail.eu). Підпишіться на обговорення за адресою <https://github.com/orgs/forwardemail/discussions/336> для оновлень.

Наші сервери розташовані переважно в Денвері, Колорадо – дивіться <https://forwardemail.net/ips> для повного списку IP-адрес.

Ви можете дізнатися про наших субпідрядників на наших сторінках [GDPR](/gdpr), [DPA](/dpa) та [Конфіденційність](/privacy).

### Як експортувати та створити резервну копію моєї поштової скриньки {#how-do-i-export-and-backup-my-mailbox}

У будь-який час ви можете експортувати свої поштові скриньки у форматах [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) або зашифрованих [SQLite](https://en.wikipedia.org/wiki/SQLite).

Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми <i class="fa fa-angle-right"></i> Завантажити резервну копію та оберіть бажаний формат експорту.

Вам надішлють посилання для завантаження експорту після його завершення.

Зверніть увагу, що посилання для завантаження експорту дійсне лише 4 години з міркувань безпеки.

Якщо вам потрібно переглянути експортовані формати EML або Mbox, ці інструменти з відкритим кодом можуть бути корисними:

| Назва           | Формат | Платформа    | GitHub URL                                          |
| --------------- | :----: | ------------ | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows      | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Всі платформи| <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows      | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode       | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Всі платформи| <https://github.com/s0ph1e/eml-reader>              |
Крім того, якщо вам потрібно конвертувати файл Mbox у файл EML, ви можете скористатися <https://github.com/noelmartinon/mboxzilla>.

### Як імпортувати та мігрувати мою існуючу поштову скриньку {#how-do-i-import-and-migrate-my-existing-mailbox}

Ви можете легко імпортувати вашу електронну пошту до Forward Email (наприклад, використовуючи [Thunderbird](https://www.thunderbird.net)) за інструкціями нижче:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Ви повинні виконати всі наведені нижче кроки, щоб імпортувати вашу існуючу електронну пошту.
  </span>
</div>

1. Експортуйте вашу електронну пошту з вашого поточного поштового провайдера:

   | Поштовий провайдер | Формат експорту                              | Інструкції з експорту                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail              | MBOX                                         | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook            | PST                                          | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Порада:</strong> <span>Якщо ви використовуєте Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">формат експорту PST</a>), тоді ви можете просто слідувати інструкціям у розділі "Інше" нижче. Проте ми надали посилання для конвертації PST у формат MBOX/EML залежно від вашої операційної системи:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba для Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst для Windows cygwin</a> – (наприклад, <code>readpst -u -o $OUT_DIR $IN_DIR</code>, замінюючи <code>$OUT_DIR</code> та <code>$IN_DIR</code> шляхами до папок виводу та вводу відповідно).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst для Ubuntu/Linux</a> – (наприклад, <code>sudo apt-get install readpst</code> та потім <code>readpst -u -o $OUT_DIR $IN_DIR</code>, замінюючи <code>$OUT_DIR</code> та <code>$IN_DIR</code> шляхами до папок виводу та вводу відповідно).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst для macOS (через brew)</a> – (наприклад, <code>brew install libpst</code> та потім <code>readpst -u -o $OUT_DIR $IN_DIR</code>, замінюючи <code>$OUT_DIR</code> та <code>$IN_DIR</code> шляхами до папок виводу та вводу відповідно).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter для Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail         | MBOX                                         | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail           | EML                                          | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail        | MBOX/EML                                     | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota           | EML                                          | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi              | EML                                          | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho               | EML                                          | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Інше               | [Використовуйте Thunderbird](https://www.thunderbird.net) | Налаштуйте ваш існуючий обліковий запис електронної пошти у Thunderbird, а потім використайте плагін [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) для експорту та імпорту вашої пошти.  **Ви також можете просто копіювати/вставляти або перетягувати листи між обліковими записами.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Завантажте, встановіть і відкрийте [Thunderbird](https://www.thunderbird.net).

3. Створіть новий обліковий запис, використовуючи повну електронну адресу вашого псевдоніма (наприклад, <code><you@yourdomain.com></code>) та згенерований пароль.  <strong>Якщо у вас ще немає згенерованого пароля, тоді <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">ознайомтеся з нашими інструкціями з налаштування</a></strong>.

4. Завантажте та встановіть плагін Thunderbird [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Створіть нову локальну папку в Thunderbird, потім клацніть по ній правою кнопкою миші → виберіть опцію `ImportExportTools NG` → оберіть `Import mbox file` (для формату експорту MBOX) – або – `Import messages` / `Import all messages from a directory` (для формату експорту EML).

6. Перетягніть (drag/drop) з локальної папки у нову (або існуючу) IMAP-папку в Thunderbird, куди ви хочете завантажити повідомлення в IMAP-сховище з нашим сервісом.  Це забезпечить їх резервне копіювання онлайн у нашому зашифрованому сховищі SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>
       Якщо ви не впевнені, як імпортувати в Thunderbird, ви можете звернутися до офіційних інструкцій за посиланнями <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> та <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Після завершення процесу експорту та імпорту ви також можете увімкнути переадресацію на вашому існуючому електронному акаунті та налаштувати авто-відповідач, щоб повідомляти відправників про вашу нову електронну адресу (наприклад, якщо раніше ви використовували Gmail, а тепер користуєтеся електронною поштою з вашим власним доменом).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

### Як використовувати власне сховище, сумісне з S3, для резервних копій {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Користувачі платних планів можуть налаштувати власного провайдера сховища, сумісного з [S3](https://en.wikipedia.org/wiki/Amazon_S3), для кожного домену окремо для резервних копій IMAP/SQLite.  Це означає, що ваші зашифровані резервні копії поштової скриньки можуть зберігатися на вашій власній інфраструктурі замість (або на додаток до) нашого стандартного сховища.

Підтримувані провайдери включають [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) та будь-який інший сервіс, сумісний з S3.

#### Налаштування {#setup}

1. Створіть **приватний** бакет у вашого провайдера, сумісного з S3.  Бакет не повинен бути публічно доступним.
2. Створіть облікові дані доступу (access key ID та secret access key) з правами читання/запису до бакету.
3. Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Розширені налаштування <i class="fa fa-angle-right"></i> Власне сховище, сумісне з S3.
4. Позначте **"Увімкнути власне сховище, сумісне з S3"** та заповніть URL кінцевої точки, access key ID, secret access key, регіон і назву бакету.
5. Натисніть **"Перевірити з’єднання"**, щоб підтвердити ваші облікові дані, доступ до бакету та права запису.
6. Натисніть **"Зберегти"**, щоб застосувати налаштування.

#### Як працюють резервні копії {#how-backups-work}

Резервні копії запускаються автоматично для кожного підключеного IMAP-псевдоніма.  IMAP-сервер перевіряє всі активні підключення раз на годину і запускає резервне копіювання для кожного підключеного псевдоніма.  Блокування на основі Redis запобігає запуску дубльованих резервних копій протягом 30 хвилин одна від одної, а фактичне резервне копіювання пропускається, якщо успішне резервне копіювання вже було виконано протягом останніх 24 годин (якщо тільки резервне копіювання не було явно запрошене користувачем для завантаження).
Резервні копії також можна запускати вручну, натискаючи **"Download Backup"** для будь-якого псевдоніма на панелі керування.  Ручні резервні копії завжди виконуються незалежно від 24-годинного вікна.

Процес резервного копіювання працює наступним чином:

1. База даних SQLite копіюється за допомогою `VACUUM INTO`, що створює послідовний знімок без переривання активних з’єднань і зберігає шифрування бази даних.
2. Файл резервної копії перевіряється шляхом його відкриття для підтвердження дійсності шифрування.
3. Обчислюється хеш SHA-256 і порівнюється з існуючою резервною копією в сховищі.  Якщо хеш співпадає, завантаження пропускається (з моменту останньої резервної копії змін не було).
4. Резервна копія завантажується в S3 за допомогою багаточастинного завантаження через бібліотеку [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Генерується підписане посилання для завантаження (дійсне протягом 4 годин) і надсилається користувачу електронною поштою.

#### Формати резервних копій {#backup-formats}

Підтримуються три формати резервних копій:

| Формат   | Розширення | Опис                                                                        |
| -------- | ---------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`  | Сировий зашифрований знімок бази даних SQLite (за замовчуванням для автоматичних IMAP резервних копій) |
| `mbox`   | `.zip`     | ZIP з паролем, що містить поштову скриньку у форматі mbox                    |
| `eml`    | `.zip`     | ZIP з паролем, що містить окремі файли `.eml` для кожного повідомлення       |

> **Порада:** Якщо у вас є файли резервних копій `.sqlite` і ви хочете конвертувати їх у файли `.eml` локально, використовуйте наш автономний CLI-інструмент **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**.  Він працює на Windows, Linux і macOS і не потребує мережевого з’єднання.

#### Іменування файлів та структура ключів {#file-naming-and-key-structure}

При використанні **власного сховища S3** файли резервних копій зберігаються з префіксом у форматі [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) з позначкою часу, щоб кожна резервна копія зберігалася як окремий об’єкт.  Це дає вам повну історію резервних копій у вашому власному бакеті.

Формат ключа:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Наприклад:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` — це MongoDB ObjectId псевдоніма. Ви можете знайти його на сторінці налаштувань псевдоніма або через API.

При використанні **сховища за замовчуванням (системного)** ключ плоский (наприклад, `65a31c53c36b75ed685f3fda.sqlite`), і кожна нова резервна копія перезаписує попередню.

> **Примітка:** Оскільки власне сховище S3 зберігає всі версії резервних копій, використання сховища з часом зростатиме. Рекомендуємо налаштувати [правила життєвого циклу](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) у вашому бакеті для автоматичного видалення старих резервних копій (наприклад, видаляти об’єкти старші за 30 або 90 днів).

#### Власність даних і політика видалення {#data-ownership-and-deletion-policy}

Ваш власний бакет S3 повністю під вашим контролем. Ми **ніколи не видаляємо і не змінюємо** файли у вашому власному бакеті S3 — ні при видаленні псевдоніма, ні при видаленні домену, ні під час будь-яких операцій очищення. Ми лише записуємо нові файли резервних копій у ваш бакет.

Це означає:

* **Видалення псевдоніма** — коли ви видаляєте псевдонім, ми видаляємо резервну копію лише з нашого сховища за замовчуванням. Резервні копії, раніше записані у ваш власний бакет S3, залишаються недоторканими.
* **Видалення домену** — видалення домену не впливає на файли у вашому власному бакеті.
* **Управління зберіганням** — ви відповідаєте за управління сховищем у вашому бакеті, включно з налаштуванням правил життєвого циклу для видалення старих резервних копій.

Якщо ви вимкнете власне сховище S3 або повернетесь до нашого сховища за замовчуванням, існуючі файли у вашому бакеті збережуться. Майбутні резервні копії просто будуть записані у наше сховище за замовчуванням.

#### Безпека {#security}

* Ваш ідентифікатор ключа доступу та секретний ключ доступу **шифруються у стані спокою** за допомогою [AES-256-GCM](https://uk.wikipedia.org/wiki/Galois/Counter_Mode) перед збереженням у нашій базі даних. Вони розшифровуються лише під час виконання операцій резервного копіювання.
* Ми автоматично перевіряємо, що ваш бакет **не є публічно доступним**. Якщо виявлено публічний бакет, конфігурація буде відхилена при збереженні. Якщо публічний доступ виявлено під час резервного копіювання, ми повертаємось до нашого сховища за замовчуванням і повідомляємо про це всіх адміністраторів домену електронною поштою.
* Облікові дані перевіряються при збереженні за допомогою виклику [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html), щоб переконатися, що бакет існує і облікові дані правильні. Якщо перевірка не проходить, власне сховище S3 автоматично вимикається.
* Кожен файл резервної копії містить хеш SHA-256 у своїх метаданих S3, який використовується для виявлення незмінних баз даних і пропуску зайвих завантажень.
#### Сповіщення про помилки {#error-notifications}

Якщо резервне копіювання не вдається при використанні вашого власного сховища S3 (наприклад, через прострочені облікові дані або проблему з підключенням), всі адміністратори домену отримають сповіщення електронною поштою. Ці сповіщення обмежені частотою — не частіше одного разу на 6 годин, щоб уникнути дублювання повідомлень. Якщо під час резервного копіювання виявлено, що ваш бакет є публічно доступним, адміністратори отримуватимуть сповіщення один раз на день.

#### API {#api}

Ви також можете налаштувати власне сховище S3 через API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Щоб перевірити з’єднання через API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Як конвертувати резервні копії SQLite у файли EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Якщо ви завантажуєте або зберігаєте резервні копії SQLite (з нашого стандартного сховища або вашого власного [кастомного S3 бакету](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), ви можете конвертувати їх у стандартні файли `.eml` за допомогою нашого автономного CLI інструменту **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. Файли EML можна відкривати будь-яким поштовим клієнтом ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) тощо) або імпортувати в інші поштові сервери.

#### Встановлення {#installation-1}

Ви можете завантажити готовий бінарний файл (без необхідності [Node.js](https://github.com/nodejs/node)) або запускати його безпосередньо через [Node.js](https://github.com/nodejs/node):

**Готові бінарні файли** — Завантажте останній реліз для вашої платформи з [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Платформа | Архітектура  | Файл                                 |
| --------- | ------------ | ------------------------------------ |
| Linux     | x64          | `convert-sqlite-to-eml-linux-x64`    |
| Linux     | arm64        | `convert-sqlite-to-eml-linux-arm64`  |
| macOS     | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64` |
| Windows   | x64          | `convert-sqlite-to-eml-win-x64.exe`  |

> **Користувачі macOS:** Після завантаження можливо потрібно буде зняти атрибут карантину перед запуском бінарного файлу:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Замініть `./convert-sqlite-to-eml-darwin-arm64` на фактичний шлях до завантаженого файлу.)

> **Користувачі Linux:** Після завантаження можливо потрібно буде зробити бінарний файл виконуваним:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Замініть `./convert-sqlite-to-eml-linux-x64` на фактичний шлях до завантаженого файлу.)

**З вихідного коду** (потрібен [Node.js](https://github.com/nodejs/node) версії >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Використання {#usage}

Інструмент підтримує як інтерактивний, так і неінтерактивний режими.

**Інтерактивний режим** — запускайте без аргументів, і вас буде запрошено ввести всі необхідні дані:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Конвертація резервної копії SQLite у EML
  =============================================

  Шлях до файлу резервної копії SQLite: /path/to/backup.sqlite
  Пароль IMAP/псевдоніма: ********
  Шлях для ZIP файлу виводу [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Неінтерактивний режим** — передавайте аргументи через командний рядок для скриптування та автоматизації:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Прапорець           | Опис                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Шлях до зашифрованого файлу резервної копії SQLite                            |
| `--password <pass>` | Пароль IMAP/псевдоніма для розшифрування                                      |
| `--output <path>`   | Шлях для ZIP файлу виводу (за замовчуванням: автоматично згенерований з ISO 8601 часовою позначкою) |
| `--help`            | Показати довідкове повідомлення                                               |
#### Формат виводу {#output-format}

Інструмент створює захищений паролем ZIP-архів (шифрування AES-256), що містить:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

Файли EML організовані за папками поштової скриньки. Пароль ZIP-архіву збігається з вашим паролем IMAP/псевдоніма. Кожен файл `.eml` є стандартним [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) електронним повідомленням з повними заголовками, текстом тіла та вкладеннями, відновленими з бази даних SQLite.

#### Як це працює {#how-it-works}

1. Відкриває зашифровану базу даних SQLite, використовуючи ваш пароль IMAP/псевдоніма (підтримує шифри [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) та [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Зчитує таблицю Mailboxes для визначення структури папок.
3. Для кожного повідомлення декодує mimeTree (збережений у вигляді JSON, стисненого за допомогою [Brotli](https://github.com/google/brotli)) з таблиці Messages.
4. Відновлює повний EML, обходячи дерево MIME та отримуючи вміст вкладень з таблиці Attachments.
5. Упаковує все у захищений паролем ZIP-архів за допомогою [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Чи підтримуєте ви самостійне розгортання {#do-you-support-self-hosting}

Так, станом на березень 2025 року ми підтримуємо опцію самостійного розгортання. Читайте блог [тут](https://forwardemail.net/blog/docs/self-hosted-solution). Ознайомтеся з [керівництвом для самостійного розгортання](https://forwardemail.net/self-hosted), щоб почати. А для тих, хто хоче більш детальний покроковий варіант, дивіться наші керівництва на основі [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) або [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Налаштування електронної пошти {#email-configuration}

### Як почати та налаштувати переадресацію електронної пошти {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
  <span>Менше 10 хвилин</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Початок роботи:
  </strong>
  <span>
    Уважно прочитайте та дотримуйтесь кроків з першого по восьмий, наведені нижче. Обов’язково замініть адресу електронної пошти <code>user@gmail.com</code> на адресу, на яку ви хочете переадресовувати листи (якщо вона ще не вказана правильно). Аналогічно замініть <code>example.com</code> на ваше власне доменне ім’я (якщо воно ще не вказане правильно).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Якщо ви вже зареєстрували своє доменне ім’я десь, то цей крок потрібно повністю пропустити і перейти до кроку другого! Інакше ви можете <a href="/domain-registration" rel="noopener noreferrer">натиснути тут, щоб зареєструвати доменне ім’я</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Ви пам’ятаєте, де зареєстрували свій домен? Як тільки згадаєте, дотримуйтесь інструкцій нижче:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Ви повинні відкрити нову вкладку та увійти до свого реєстратора доменів. Ви можете легко натиснути на свій "Реєстратор" нижче, щоб зробити це автоматично. У цій новій вкладці потрібно перейти на сторінку керування DNS у вашого реєстратора – ми надали покрокові інструкції у колонці "Кроки для налаштування". Після переходу на цю сторінку у новій вкладці ви можете повернутися до цієї вкладки та перейти до кроку третього нижче.
    <strong class="font-weight-bold">Не закривайте відкриту вкладку поки що; вона знадобиться для наступних кроків!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Реєстратор</th>
      <th>Кроки для налаштування</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Центр доменів <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Редагувати налаштування DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Хостинг-зони <i class="fa fa-angle-right"></i> (Виберіть свій домен)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Мої сервери <i class="fa fa-angle-right"></i> Керування доменами <i class="fa fa-angle-right"></i> Менеджер DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ДЛЯ ROCK: Увійдіть <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> (Натисніть іконку ▼ поруч із керуванням) <i class="fa fa-angle-right"></i> DNS
      <br />
      ДЛЯ LEGACY: Увійдіть <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> Редактор зон <i class="fa fa-angle-right"></i> (Виберіть свій домен)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Виберіть свій домен)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> (Виберіть свій домен)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Керування</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Мережі <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Більше <i class="fa fa-angle-right"></i> Керування доменом</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> У картковому вигляді натисніть керувати на вашому домені <i class="fa fa-angle-right"></i> У списковому вигляді натисніть
іконку шестерні <i class="fa fa-angle-right"></i> DNS та імена серверів <i class="fa fa-angle-right"></i> DNS записи</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Переглянути</a>
      </td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> (натисніть іконку шестерні) <i class="fa fa-angle-right"></i> Натисніть на DNS та імена серверів у лівому меню</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Панель <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> Керування доменами <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Огляд <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Простий редактор <i class="fa fa-angle-right"></i> Записи</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Редагувати зону</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Переглянути</a>
      </td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Керування моїми доменами <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Переглянути</a>
      </td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Налаштувати DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Переглянути</a>
      </td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Список доменів <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Розширений DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Налаштувати Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Менеджер акаунтів <i class="fa fa-angle-right"></i> Мої доменні імена <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Змінити місце вказівки домену <i class="fa fa-angle-right"></i> Розширений DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Переглянути</a>
      </td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Керовані домени <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Налаштування DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Головне меню <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i>
Розширені налаштування <i class="fa fa-angle-right"></i> Користувацькі записи</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Використання CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Сторінка доменів <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Сторінка доменів <i class="fa fa-angle-right"></i> (Натисніть іконку <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Виберіть Керування DNS-записами</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Увійдіть <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> Мої домени</td>
    </tr>
    <tr>
      <td>Інші</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Важливо:</strong> Не бачите тут свого реєстратора? Просто пошукайте в Інтернеті "як змінити DNS записи на $REGISTRAR" (замініть $REGISTRAR на назву вашого реєстратора, наприклад, "як змінити DNS записи на GoDaddy", якщо ви користуєтесь GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Використовуючи сторінку керування DNS вашого реєстратора (інша вкладка, яку ви відкрили), встановіть наступні записи "MX":
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Зверніть увагу, що не повинно бути встановлено інших MX-записів. Обидва наведені нижче записи МАЮТЬ існувати. Переконайтеся, що немає помилок; і що у вас правильно написані mx1 та mx2. Якщо раніше існували інші MX-записи, будь ласка, повністю видаліть їх.
    Значення "TTL" не обов’язково має бути 3600, воно може бути нижчим або вищим за потреби.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Використовуючи сторінку керування DNS у вашого реєстратора (інша вкладка, яку ви відкрили), встановіть наступний(і) <strong class="notranslate">TXT</strong> запис(и):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо у вас платний план, то цей крок потрібно повністю пропустити і перейти до п’ятого кроку! Якщо у вас немає платного плану, то ваші переслані адреси будуть публічно доступні для пошуку – перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> і за бажанням оновіть домен до платного плану. Якщо ви хочете дізнатися більше про платні плани, дивіться нашу сторінку <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Ціни</a>. Інакше ви можете продовжити, обравши одну або кілька комбінацій з Варіанту A до Варіанту F, наведених нижче.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант A:
  </strong>
  <span>
    Якщо ви пересилаєте всі листи з вашого домену (наприклад, "all@example.com", "hello@example.com" тощо) на конкретну адресу "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Обов’язково замініть значення у колонці "Value" на вашу власну електронну адресу. Значення "TTL" не обов’язково має бути 3600, воно може бути нижчим або вищим за потреби. Нижче значення часу життя ("TTL") забезпечить швидше поширення майбутніх змін у ваших DNS-записах по всьому Інтернету – уявіть це як час кешування в пам’яті (у секундах). Ви можете дізнатися більше про <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL на Вікіпедії</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант B:
  </strong>
  <span>
    Якщо потрібно переслати лише одну електронну адресу (наприклад, <code>hello@example.com</code> на <code>user@gmail.com</code>; це також автоматично пересилає "hello+test@example.com" на "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант C:
  </strong>
  <span>
    Якщо ви пересилаєте кілька електронних листів, то їх потрібно розділяти комою:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант D:
  </strong>
  <span>
    Ви можете налаштувати необмежену кількість пересилань – просто переконайтеся, що в одному рядку не більше 255 символів і кожен рядок починається з "forward-email=". Приклад наведено нижче:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант E:
  </strong>
  <span>
    Ви також можете вказати доменне ім'я у вашому <strong class="notranslate">TXT</strong> записі для глобального пересилання псевдонімів (наприклад, "user@example.com" буде переслано на "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант F:
  </strong>
  <span>
    Ви навіть можете використовувати вебхуки як глобальний або індивідуальний псевдонім для пересилання листів. Дивіться приклад та повний розділ про вебхуки під назвою <a href="#do-you-support-webhooks" class="alert-link">Чи підтримуєте ви вебхуки</a> нижче.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Варіант G:
  </strong>
  <span>
    Ви навіть можете використовувати регулярні вирази ("regex") для співпадіння псевдонімів та для обробки замін, щоб пересилати листи. Дивіться приклади та повний розділ про regex під назвою <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Чи підтримуєте ви регулярні вирази або regex</a> нижче.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Потрібен розширений regex із заміною?</strong> Дивіться приклади та повний розділ про regex під назвою <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Чи підтримуєте ви регулярні вирази або regex</a> нижче.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Простий приклад:</strong> Якщо я хочу, щоб усі листи, які надходять на `linus@example.com` або `torvalds@example.com`, пересилалися на `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Правила пересилання для catch-all також можна описати як "fall-through".
    Це означає, що вхідні листи, які відповідають принаймні одному конкретному правилу пересилання, будуть використані замість catch-all.
    Конкретні правила включають електронні адреси та регулярні вирази.
    <br /><br />
    Наприклад:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Листи, надіслані на <code>hello@example.com</code>, **не** будуть переслані на <code>second@gmail.com</code> (catch-all) з цією конфігурацією, і натомість будуть доставлені лише на <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Використовуючи сторінку керування DNS вашого реєстратора (інша вкладка, яку ви відкрили), додатково встановіть наступний запис <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви використовуєте Gmail (наприклад, Send Mail As) або G Suite, тоді вам потрібно додати <code>include:_spf.google.com</code> до наведеного вище значення, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Якщо у вас вже є подібний рядок із "v=spf1", тоді вам потрібно додати <code>include:spf.forwardemail.net</code> безпосередньо перед будь-якими існуючими записами "include:host.com" і перед "-all" у тому ж рядку, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Зверніть увагу, що існує різниця між "-all" та "~all". "-" означає, що перевірка SPF має ПРОВАЛИТИСЯ, якщо не співпадає, а "~" означає, що перевірка SPF має бути SOFTFAIL. Ми рекомендуємо використовувати підхід "-all" для запобігання підробці домену.
    <br /><br />
    Також можливо, що вам потрібно буде включити SPF-запис для будь-якого хоста, з якого ви надсилаєте пошту (наприклад, Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Перевірте свої DNS-записи за допомогою нашого інструменту "Перевірити записи", доступного в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування.

</li><li class="mb-2 mb-md-3 mb-lg-5">Надішліть тестовий лист, щоб підтвердити, що все працює. Зверніть увагу, що може знадобитися деякий час для поширення ваших DNS-записів.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
  </span>
    Якщо ви не отримуєте тестові листи або отримуєте тестовий лист із повідомленням "Будьте обережні з цим повідомленням", перегляньте відповіді на <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Чому я не отримую свої тестові листи</a> та <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Чому мої тестові листи, надіслані собі в Gmail, позначаються як "підозрілі"</a> відповідно.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Якщо ви хочете "Надсилати пошту від імені" з Gmail, вам потрібно <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">переглянути це відео</a></strong> або дотримуватися кроків у розділі <a href="#how-to-send-mail-as-using-gmail">Як надсилати пошту від імені за допомогою Gmail</a> нижче.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Нижче наведено необов’язкові додатки. Зверніть увагу, що ці додатки є повністю необов’язковими і можуть бути не потрібні. Ми хотіли принаймні надати вам додаткову інформацію на випадок потреби.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Необов’язковий додаток:
  </strong>
  <span>
    Якщо ви використовуєте функцію <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Як надсилати пошту від імені за допомогою Gmail</a>, можливо, ви захочете додати себе до білого списку. Дивіться <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">ці інструкції від Gmail</a> з цього питання.
  </span>
</div>

### Чи можна використовувати кілька MX-серверів і серверів для розширеного пересилання {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Так, але **у ваших DNS-записах повинен бути вказаний лише один MX-сервер**.

Не намагайтеся використовувати "Пріоритет" як спосіб налаштування кількох MX-серверів.

Натомість потрібно налаштувати ваш існуючий MX-сервер так, щоб він пересилав пошту для всіх не співпадаючих псевдонімів на сервери нашої служби (`mx1.forwardemail.net` та/або `mx2.forwardemail.net`).

Якщо ви використовуєте Google Workspace і хочете пересилати всі не співпадаючі псевдоніми на нашу службу, дивіться <https://support.google.com/a/answer/6297084>.

Якщо ви використовуєте Microsoft 365 (Outlook) і хочете пересилати всі не співпадаючі псевдоніми на нашу службу, дивіться <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> та <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Як налаштувати відповідь під час відпустки (автоматичний відповідь поза офісом) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми та створіть або відредагуйте псевдонім, для якого хочете налаштувати автоматичну відповідь під час відпустки.
Ви маєте можливість налаштувати дату початку, дату завершення, тему та повідомлення, а також увімкнути або вимкнути це у будь-який час:

* Підтримуються наразі лише текстова тема та повідомлення (ми внутрішньо використовуємо пакет `striptags` для видалення будь-якого HTML).
* Тема обмежена 100 символами.
* Повідомлення обмежене 1000 символами.
* Налаштування вимагає конфігурації вихідного SMTP (наприклад, вам потрібно буде налаштувати DKIM, DMARC та записи DNS Return-Path).
  * Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP і дотримуйтесь інструкцій налаштування.
* Відповідач у відпустці не може бути увімкнений на глобальних доменах-ваніті (наприклад, [одноразові адреси](/disposable-addresses) не підтримуються).
* Відповідач у відпустці не може бути увімкнений для псевдонімів з підстановочним символом/catch-all (`*`) або регулярними виразами.

На відміну від поштових систем, таких як `postfix` (наприклад, які використовують розширення фільтра відпустки `sieve`), Forward Email автоматично додає ваш підпис DKIM, захищає від проблем з підключенням при надсиланні відповідей у відпустці (наприклад, через поширені проблеми з SSL/TLS та підтримувані застарілі сервери), а також підтримує Open WKD та PGP шифрування для відповідей у відпустці.

<!--
* Щоб запобігти зловживанням, за кожне надіслане повідомлення відповідача у відпустці буде списано 1 кредит вихідного SMTP.
  * Усі платні акаунти за замовчуванням включають 300 кредитів на день. Якщо вам потрібна більша кількість, будь ласка, зв’яжіться з нами.
-->

1. Ми надсилаємо лише один раз на кожного [дозволеного](#do-you-have-an-allowlist) відправника кожні 4 дні (що схоже на поведінку Gmail).

   * Наш кеш Redis використовує відбиток `alias_id` та `sender`, де `alias_id` — це ID псевдоніма в MongoDB, а `sender` — це або адреса From (якщо дозволена), або кореневий домен у From (якщо не дозволена). Для простоти термін дії цього відбитка в кеші встановлено на 4 дні.

   * Наш підхід використання кореневого домену, витягнутого з адреси From для недозволених відправників, запобігає зловживанням від відносно невідомих відправників (наприклад, зловмисників), які можуть спамити повідомленнями відповідача у відпустці.

2. Ми надсилаємо лише якщо MAIL FROM та/або From не порожні та не містять (без урахування регістру) [ім’я користувача поштового адміністратора](#what-are-postmaster-addresses) (частина перед @ в електронній адресі).

3. Ми не надсилаємо, якщо оригінальне повідомлення містило будь-які з наступних заголовків (без урахування регістру):

   * Заголовок `auto-submitted` зі значенням, відмінним від `no`.
   * Заголовок `x-auto-response-suppress` зі значенням `dr`, `autoreply`, `auto-reply`, `auto_reply` або `all`.
   * Заголовок `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` або `x-auto-respond` (незалежно від значення).
   * Заголовок `precedence` зі значенням `bulk`, `autoreply`, `auto-reply`, `auto_reply` або `list`.

4. Ми не надсилаємо, якщо MAIL FROM або From закінчується на `+donotreply`, `-donotreply`, `+noreply` або `-noreply`.

5. Ми не надсилаємо, якщо частина імені користувача From була `mdaemon` і містила безрегістровий заголовок `X-MDDSN-Message`.

6. Ми не надсилаємо, якщо був безрегістровий заголовок `content-type` зі значенням `multipart/report`.

### Як налаштувати SPF для Forward Email {#how-do-i-set-up-spf-for-forward-email}

Використовуючи сторінку керування DNS у вашого реєстратора, встановіть наступний <strong class="notranslate">TXT</strong> запис:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім’я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви використовуєте Gmail (наприклад, Send Mail As) або G Suite, тоді вам потрібно додати <code>include:_spf.google.com</code> до наведеного вище значення, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви використовуєте Microsoft Outlook або Live.com, вам потрібно додати <code>include:spf.protection.outlook.com</code> до вашого SPF <strong class="notranslate">TXT</strong> запису, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Якщо у вас вже є подібний рядок з "v=spf1", тоді вам потрібно додати <code>include:spf.forwardemail.net</code> безпосередньо перед будь-якими існуючими записами "include:host.com" і перед "-all" в тому ж рядку, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Зверніть увагу, що існує різниця між "-all" та "~all". "-" означає, що перевірка SPF має ПРОВАЛИТИСЯ, якщо не співпадає, а "~" означає, що перевірка SPF має бути SOFTFAIL. Ми рекомендуємо використовувати підхід "-all" для запобігання підробці домену.
    <br /><br />
    Також вам може знадобитися включити SPF запис для будь-якого хоста, з якого ви надсилаєте пошту (наприклад, Outlook).
  </span>
</div>

### Як налаштувати DKIM для Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP і дотримуйтесь інструкцій налаштування.

### Як налаштувати DMARC для Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP і дотримуйтесь інструкцій налаштування.

### Як переглянути звіти DMARC {#how-do-i-view-dmarc-reports}

Forward Email надає комплексну панель звітів DMARC, яка дозволяє вам контролювати ефективність автентифікації електронної пошти для всіх ваших доменів з одного інтерфейсу.

**Що таке звіти DMARC?**

Звіти DMARC (Domain-based Message Authentication, Reporting, and Conformance) — це XML-файли, які надсилають сервери отримувачів пошти і які повідомляють, як автентифікуються ваші електронні листи. Ці звіти допомагають вам зрозуміти:

* Скільки листів надсилається з вашого домену
* Чи проходять ці листи автентифікацію SPF та DKIM
* Які дії виконують сервери отримувачів (приймають, поміщають у карантин або відхиляють)
* З яких IP-адрес надсилається пошта від імені вашого домену

**Як отримати доступ до звітів DMARC**

Перейдіть до <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Звіти DMARC</a>, щоб переглянути вашу панель. Ви також можете отримати доступ до звітів для конкретного домену з <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>, натиснувши кнопку "DMARC" поруч із будь-яким доменом.

**Функції панелі**

Панель звітів DMARC надає:

* **Підсумкові метрики**: Загальна кількість отриманих звітів, загальна кількість проаналізованих повідомлень, рівень відповідності SPF, рівень відповідності DKIM та загальний відсоток проходження
* **Графік повідомлень за часом**: Візуальна тенденція обсягу пошти та рівнів автентифікації за останні 30 днів
* **Підсумок відповідності**: Кругова діаграма, що показує розподіл відповідності SPF та DKIM
* **Розподіл обробки повідомлень**: Стовпчаста діаграма, що показує, як сервери отримувачів обробляли ваші листи (прийняті, поміщені в карантин або відхилені)
* **Таблиця останніх звітів**: Детальний список окремих звітів DMARC з можливістю фільтрації та пагінації
* **Фільтрація за доменом**: Фільтруйте звіти за конкретним доменом при керуванні кількома доменами
**Чому це важливо**

Для організацій, які керують кількома доменами (наприклад, підприємства, неприбуткові організації або агентства), звіти DMARC є необхідними для:

* **Виявлення несанкціонованих відправників**: Виявляти, чи хтось підробляє ваш домен
* **Покращення доставляння**: Забезпечувати проходження автентифікації ваших легітимних листів
* **Моніторингу поштової інфраструктури**: Відстежувати, які сервіси та IP-адреси надсилають листи від вашого імені
* **Відповідності вимогам**: Підтримувати видимість автентифікації електронної пошти для аудитів безпеки

На відміну від інших сервісів, які вимагають окремих інструментів моніторингу DMARC, Forward Email включає обробку та візуалізацію звітів DMARC як частину вашого акаунту без додаткової плати.

**Вимоги**

* Звіти DMARC доступні лише для платних планів
* Ваш домен повинен мати налаштований DMARC (див. [Як налаштувати DMARC для Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Звіти автоматично збираються, коли поштові сервери отримувачів надсилають їх на вашу налаштовану адресу звітності DMARC

**Щотижневі звіти електронною поштою**

Користувачі платних планів автоматично отримують щотижневі підсумкові звіти DMARC електронною поштою. Ці листи містять:

* Підсумкову статистику для всіх ваших доменів
* Рівні відповідності SPF та DKIM
* Розподіл статусів повідомлень (прийняті, поміщені в карантин, відхилені)
* Топ організацій, що надсилають звіти (Google, Microsoft, Yahoo тощо)
* IP-адреси з проблемами відповідності, які можуть потребувати уваги
* Прямі посилання на вашу панель звітів DMARC

Щотижневі звіти надсилаються автоматично і не можуть бути вимкнені окремо від інших повідомлень електронної пошти.

### Як підключити та налаштувати мої контакти {#how-do-i-connect-and-configure-my-contacts}

**Щоб налаштувати контакти, використовуйте CardDAV URL:** `https://carddav.forwardemail.net` (або просто `carddav.forwardemail.net`, якщо ваш клієнт це дозволяє)

### Як підключити та налаштувати мої календарі {#how-do-i-connect-and-configure-my-calendars}

**Щоб налаштувати календар, використовуйте CalDAV URL:** `https://caldav.forwardemail.net` (або просто `caldav.forwardemail.net`, якщо ваш клієнт це дозволяє)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Як додати більше календарів та керувати існуючими календарями {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Якщо ви хочете додати додаткові календарі, просто додайте новий URL календаря: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**обов’язково замініть `calendar-name` на бажану назву календаря**)

Ви можете змінити назву та колір календаря після створення – просто використовуйте ваш улюблений додаток для календарів (наприклад, Apple Mail або [Thunderbird](https://thunderbird.net)).

### Як підключити та налаштувати завдання та нагадування {#how-do-i-connect-and-configure-tasks-and-reminders}

**Щоб налаштувати завдання та нагадування, використовуйте той самий CalDAV URL, що й для календарів:** `https://caldav.forwardemail.net` (або просто `caldav.forwardemail.net`, якщо ваш клієнт це дозволяє)

Завдання та нагадування автоматично відокремлюються від подій календаря у власну колекцію календарів "Reminders" або "Tasks".

**Інструкції з налаштування за платформами:**

**macOS/iOS:**

1. Додайте новий обліковий запис CalDAV у Системних налаштуваннях > Інтернет-акаунти (або Налаштування > Акаунти на iOS)
2. Використовуйте `caldav.forwardemail.net` як сервер
3. Введіть ваш псевдонім Forward Email та згенерований пароль
4. Після налаштування ви побачите колекції "Calendar" та "Reminders"
5. Використовуйте додаток Reminders для створення та керування завданнями

**Android з Tasks.org:**

1. Встановіть Tasks.org з Google Play Store або F-Droid
2. Перейдіть у Налаштування > Синхронізація > Додати акаунт > CalDAV
3. Введіть сервер: `https://caldav.forwardemail.net`
4. Введіть ваш псевдонім Forward Email та згенерований пароль
5. Tasks.org автоматично виявить ваші календарі завдань

**Thunderbird:**

1. Встановіть додаток Lightning, якщо він ще не встановлений
2. Створіть новий календар типу "CalDAV"
3. Використовуйте URL: `https://caldav.forwardemail.net`
4. Введіть ваші облікові дані Forward Email
5. Події та завдання будуть доступні у інтерфейсі календаря

### Чому я не можу створювати завдання у macOS Reminders {#why-cant-i-create-tasks-in-macos-reminders}
Якщо у вас виникають проблеми зі створенням завдань у macOS Reminders, спробуйте ці кроки для усунення несправностей:

1. **Перевірте налаштування облікового запису**: Переконайтеся, що ваш CalDAV обліковий запис правильно налаштований з `caldav.forwardemail.net`

2. **Перевірте наявність окремих календарів**: Ви повинні бачити як "Calendar", так і "Reminders" у вашому обліковому записі. Якщо ви бачите лише "Calendar", підтримка завдань може ще не бути повністю активована.

3. **Оновіть обліковий запис**: Спробуйте видалити та додати знову ваш CalDAV обліковий запис у Системних налаштуваннях > Інтернет-акаунти

4. **Перевірте підключення до сервера**: Перевірте, чи можете ви отримати доступ до `https://caldav.forwardemail.net` у вашому браузері

5. **Перевірте облікові дані**: Переконайтеся, що ви використовуєте правильний псевдонім електронної пошти та згенерований пароль (не пароль від вашого облікового запису)

6. **Примусова синхронізація**: У додатку Reminders спробуйте створити завдання, а потім вручну оновити синхронізацію

**Поширені проблеми:**

* **"Календар нагадувань не знайдено"**: Серверу може знадобитися деякий час, щоб створити колекцію Reminders при першому доступі
* **Завдання не синхронізуються**: Перевірте, що обидва пристрої використовують однакові облікові дані CalDAV
* **Змішаний вміст**: Переконайтеся, що завдання створюються у календарі "Reminders", а не у загальному "Calendar"

### Як налаштувати Tasks.org на Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org — популярний відкритий менеджер завдань, який відмінно працює з підтримкою завдань CalDAV від Forward Email.

**Встановлення та налаштування:**

1. **Встановіть Tasks.org**:
   * З Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * З F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Налаштуйте синхронізацію CalDAV**:
   * Відкрийте Tasks.org
   * Перейдіть у ☰ Меню > Налаштування > Синхронізація
   * Натисніть "Додати обліковий запис"
   * Виберіть "CalDAV"

3. **Введіть налаштування Forward Email**:
   * **URL сервера**: `https://caldav.forwardemail.net`
   * **Ім’я користувача**: Ваш псевдонім Forward Email (наприклад, `you@yourdomain.com`)
   * **Пароль**: Ваш згенерований пароль для псевдоніма
   * Натисніть "Додати обліковий запис"

4. **Виявлення облікового запису**:
   * Tasks.org автоматично виявить ваші календарі завдань
   * Ви повинні побачити колекцію "Reminders"
   * Натисніть "Підписатися", щоб увімкнути синхронізацію для календаря завдань

5. **Перевірка синхронізації**:
   * Створіть тестове завдання у Tasks.org
   * Перевірте, що воно з’являється в інших клієнтах CalDAV (наприклад, macOS Reminders)
   * Переконайтеся, що зміни синхронізуються в обох напрямках

**Доступні функції:**

* ✅ Створення та редагування завдань
* ✅ Дати виконання та нагадування
* ✅ Завершення завдань та статус
* ✅ Рівні пріоритету
* ✅ Підзавдання та ієрархія завдань
* ✅ Теги та категорії
* ✅ Двонаправлена синхронізація з іншими клієнтами CalDAV

**Усунення несправностей:**

* Якщо календарі завдань не з’являються, спробуйте вручну оновити у налаштуваннях Tasks.org
* Переконайтеся, що на сервері створено принаймні одне завдання (можна спочатку створити у macOS Reminders)
* Перевірте мережеве підключення до `caldav.forwardemail.net`

### Як налаштувати SRS для Forward Email {#how-do-i-set-up-srs-for-forward-email}

Ми автоматично налаштовуємо [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – вам не потрібно робити це самостійно.

### Як налаштувати MTA-STS для Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Будь ласка, зверніться до [нашого розділу про MTA-STS](#do-you-support-mta-sts) для детальнішої інформації.

### Як додати фотографію профілю до моєї електронної адреси {#how-do-i-add-a-profile-picture-to-my-email-address}

Якщо ви користуєтеся Gmail, виконайте наступні кроки:

1. Перейдіть на <https://google.com> та вийдіть з усіх облікових записів електронної пошти
2. Натисніть "Увійти" і у випадаючому меню виберіть "інший обліковий запис"
3. Виберіть "Використати інший обліковий запис"
4. Виберіть "Створити обліковий запис"
5. Виберіть "Використати мою поточну електронну адресу замість цього"
6. Введіть вашу електронну адресу з власного домену
7. Отримайте лист з підтвердженням, надісланий на вашу електронну адресу
8. Введіть код підтвердження з цього листа
9. Заповніть інформацію профілю для нового облікового запису Google
10. Погодьтеся з усіма політиками конфіденційності та умовами використання
11. Перейдіть на <https://google.com>, у верхньому правому куті натисніть на іконку профілю та натисніть кнопку "змінити"
12. Завантажте нове фото або аватар для вашого облікового запису
13. Зміни зазвичай поширюються приблизно за 1-2 години, але іноді можуть бути дуже швидкими.
14. Надішліть тестовий лист, і фотографія профілю має з’явитися.
## Розширені можливості {#advanced-features}

### Чи підтримуєте ви розсилки або списки розсилки для маркетингових електронних листів {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Так, ви можете дізнатися більше на <https://forwardemail.net/guides/newsletter-with-listmonk>.

Зверніть увагу, що для підтримки репутації IP та забезпечення доставлянності Forward Email має процес ручного перегляду для кожного домену окремо для **затвердження розсилок**. Напишіть на <support@forwardemail.net> або відкрийте [запит на допомогу](https://forwardemail.net/help) для затвердження. Зазвичай це займає менше 24 годин, більшість запитів обробляються протягом 1-2 годин. У найближчому майбутньому ми плануємо зробити цей процес миттєвим із додатковими контролями спаму та сповіщеннями. Цей процес гарантує, що ваші листи потрапляють у вхідні, а ваші повідомлення не позначаються як спам.

### Чи підтримуєте ви надсилання електронної пошти через API {#do-you-support-sending-email-with-api}

Так, починаючи з травня 2023 року ми підтримуємо надсилання електронної пошти через API як додаткову функцію для всіх платних користувачів.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a>, <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> та <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Обмеження вихідного SMTP</a> &ndash; ваше використання вважається підтвердженням та згодою.
  </span>
</div>

Будь ласка, ознайомтеся з нашим розділом про [Електронні листи](/email-api#outbound-emails) у документації API для варіантів, прикладів та додаткової інформації.

Для надсилання вихідної пошти через наш API ви повинні використовувати свій API токен, доступний у розділі [Моя безпека](/my-account/security).

### Чи підтримуєте ви отримання електронної пошти через IMAP {#do-you-support-receiving-email-with-imap}

Так, починаючи з 16 жовтня 2023 року ми підтримуємо отримання електронної пошти через IMAP як додаткову функцію для всіх платних користувачів.  **Будь ласка, прочитайте нашу детальну статтю** про [як працює наша функція зашифрованого зберігання поштової скриньки SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a> та <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> &ndash; ваше використання вважається підтвердженням та згодою.
  </span>
</div>

1. Створіть новий псевдонім для вашого домену у розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

2. Натисніть на <strong class="text-success"><i class="fa fa-key"></i> Згенерувати пароль</strong> поруч із новоствореним псевдонімом. Скопіюйте у буфер обміну та надійно збережіть згенерований пароль, який відобразиться на екрані.

3. Використовуючи улюблений поштовий клієнт, додайте або налаштуйте акаунт із вашим новоствореним псевдонімом (наприклад, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Рекомендуємо використовувати <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> або <a href="/blog/open-source" class="alert-link" target="_blank">відкритий та орієнтований на конфіденційність альтернативний клієнт</a>.</span>
   </div>

4. Коли буде запитано ім’я IMAP сервера, введіть `imap.forwardemail.net`

5. Коли буде запитано порт IMAP сервера, введіть `993` (SSL/TLS) – за потреби дивіться [альтернативні порти IMAP](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Якщо ви використовуєте Thunderbird, переконайтеся, що "Безпека з’єднання" встановлена на "SSL/TLS", а метод автентифікації – "Звичайний пароль".</span>
   </div>
6. When prompted for IMAP server password, paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 2 above

7. **Збережіть свої налаштування** – якщо у вас виникають проблеми, будь ласка, <a href="/help">зв’яжіться з нами</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

</div>

### Ви підтримуєте POP3 {#do-you-support-pop3}

Так, станом на 4 грудня 2023 року ми підтримуємо [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) як додаткову опцію для всіх платних користувачів.  **Будь ласка, прочитайте нашу детальну статтю** про [те, як працює наша функція зашифрованого зберігання поштової скриньки SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a> та <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> &ndash; ваше використання вважається підтвердженням і згодою.
  </span>
</div>

1. Створіть новий псевдонім для вашого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

2. Натисніть на <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> поруч із щойно створеним псевдонімом. Скопіюйте в буфер обміну та надійно збережіть згенерований пароль, який відображається на екрані.

3. Використовуючи улюблений поштовий додаток, додайте або налаштуйте акаунт із вашим новоствореним псевдонімом (наприклад, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Рекомендуємо використовувати <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> або <a href="/blog/open-source" class="alert-link" target="_blank">відкритий та орієнтований на конфіденційність альтернативний варіант</a>.</span>
   </div>

4. Коли буде запитано ім’я POP3 сервера, введіть `pop3.forwardemail.net`

5. Коли буде запитано порт POP3 сервера, введіть `995` (SSL/TLS) – за потреби дивіться [альтернативні порти POP3](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Якщо ви використовуєте Thunderbird, переконайтеся, що "Захист з’єднання" встановлено на "SSL/TLS", а метод автентифікації – "Звичайний пароль".</span>
   </div>

6. Коли буде запитано пароль POP3 сервера, вставте пароль із <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> із кроку 2 вище

7. **Збережіть свої налаштування** – якщо у вас виникають проблеми, будь ласка, <a href="/help">зв’яжіться з нами</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

</div>

### Ви підтримуєте календарі (CalDAV) {#do-you-support-calendars-caldav}

Так, станом на 5 лютого 2024 року ми додали цю функцію. Наш сервер – `caldav.forwardemail.net`, і він також моніториться на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці статусу</a>.
Він підтримує як IPv4, так і IPv6 і доступний через порт `443` (HTTPS).

| Логін    | Приклад                   | Опис                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com`         | Адреса електронної пошти псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль   | `************************` | Згенерований пароль, специфічний для псевдоніма.                                                                                                                                          |

Щоб використовувати підтримку календаря, **користувач** повинен бути адресою електронної пошти псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> – а **пароль** має бути згенерованим паролем, специфічним для псевдоніма.

### Чи підтримуєте ви завдання та нагадування (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Так, з 14 жовтня 2025 року ми додали підтримку CalDAV VTODO для завдань та нагадувань. Це використовує той самий сервер, що й наша підтримка календаря: `caldav.forwardemail.net`.

Наш CalDAV сервер підтримує як події календаря (VEVENT), так і компоненти завдань (VTODO) за допомогою **уніфікованих календарів**. Це означає, що кожен календар може містити як події, так і завдання, забезпечуючи максимальну гнучкість і сумісність з усіма CalDAV клієнтами.

**Як працюють календарі та списки:**

* **Кожен календар підтримує як події, так і завдання** – Ви можете додавати події, завдання або обидва типи до будь-якого календаря
* **Списки Apple Reminders** – Кожен список, який ви створюєте в Apple Reminders, стає окремим календарем на сервері
* **Кілька календарів** – Ви можете створити стільки календарів, скільки потрібно, кожен з власною назвою, кольором та організацією
* **Синхронізація між клієнтами** – Завдання та події синхронізуються безперебійно між усіма сумісними клієнтами

**Підтримувані клієнти для завдань:**

* **macOS Reminders** – Повна нативна підтримка створення, редагування, завершення та синхронізації завдань
* **iOS Reminders** – Повна нативна підтримка на всіх iOS пристроях
* **Tasks.org (Android)** – Популярний відкритий менеджер завдань з підтримкою CalDAV синхронізації
* **Thunderbird** – Підтримка завдань і календаря в десктопному поштовому клієнті
* **Будь-який сумісний з CalDAV менеджер завдань** – Підтримка стандартного компонента VTODO

**Підтримувані функції завдань:**

* Створення, редагування та видалення завдань
* Дати виконання та початку
* Статус виконання завдання (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Рівні пріоритету завдань
* Повторювані завдання
* Опис та нотатки до завдань
* Синхронізація між кількома пристроями
* Підзавдання з властивістю RELATED-TO
* Нагадування про завдання з VALARM

Облікові дані для входу такі ж, як і для підтримки календаря:

| Логін    | Приклад                   | Опис                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com`         | Адреса електронної пошти псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль   | `************************` | Згенерований пароль, специфічний для псевдоніма.                                                                                                                                          |

**Важливі зауваження:**

* **Кожен список Reminders – це окремий календар** – Коли ви створюєте новий список в Apple Reminders, він створює новий календар на CalDAV сервері
* **Користувачі Thunderbird** – Вам потрібно вручну підписатися на кожен календар/список, який ви хочете синхронізувати, або використовувати URL домашнього календаря: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Користувачі Apple** – Виявлення календарів відбувається автоматично, тому всі ваші календарі та списки з’являться в Calendar.app та Reminders.app
* **Уніфіковані календарі** – Всі календарі підтримують як події, так і завдання, що дає вам гнучкість у організації ваших даних
### Чи підтримуєте ви контакти (CardDAV) {#do-you-support-contacts-carddav}

Так, станом на 12 червня 2025 року ми додали цю функцію. Наш сервер — `carddav.forwardemail.net`, і він також моніториться на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці статусу</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порт `443` (HTTPS).

| Логін    | Приклад                   | Опис                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com`         | Електронна адреса псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>.       |
| Пароль   | `************************` | Згенерований пароль, специфічний для псевдоніма.                                                                                                                                          |

Щоб використовувати підтримку контактів, **користувач** повинен бути електронною адресою псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> – а **пароль** має бути згенерованим паролем, специфічним для псевдоніма.

### Чи підтримуєте ви надсилання електронної пошти через SMTP {#do-you-support-sending-email-with-smtp}

Так, станом на травень 2023 року ми підтримуємо надсилання електронної пошти через SMTP як додаткову опцію для всіх платних користувачів.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a>, <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> та <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Обмеження вихідного SMTP</a> &ndash; ваше використання вважається підтвердженням і згодою.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви використовуєте Gmail, зверніться до нашого <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">керівництва «Надсилання пошти як» для Gmail</a>. Якщо ви розробник, зверніться до наших <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документацій API електронної пошти</a>.
  </span>
</div>

1. Перейдіть до <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP і дотримуйтесь інструкцій налаштування

2. Створіть новий псевдонім для вашого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

3. Натисніть на <strong class="text-success"><i class="fa fa-key"></i> Згенерувати пароль</strong> поруч із новоствореним псевдонімом. Скопіюйте в буфер обміну та надійно збережіть згенерований пароль, який відображається на екрані.

4. Використовуючи ваш улюблений поштовий додаток, додайте або налаштуйте акаунт із вашим новоствореним псевдонімом (наприклад, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Рекомендуємо використовувати <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> або <a href="/blog/open-source" class="alert-link" target="_blank">відкритий та орієнтований на конфіденційність альтернативний варіант</a>.</span>
   </div>
5. Коли буде запропоновано ввести ім’я SMTP сервера, введіть `smtp.forwardemail.net`

6. Коли буде запропоновано ввести порт SMTP сервера, введіть `465` (SSL/TLS) – див. [альтернативні порти SMTP](/faq#what-are-your-smtp-server-configuration-settings), якщо потрібно
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Якщо ви використовуєте Thunderbird, переконайтеся, що "Безпека з’єднання" встановлена на "SSL/TLS", а метод автентифікації – "Звичайний пароль".</span>
   </div>

7. Коли буде запропоновано ввести пароль SMTP сервера, вставте пароль із <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> у кроці 3 вище

8. **Збережіть свої налаштування та надішліть свій перший тестовий лист** – якщо виникають проблеми, будь ласка, <a href="/help">зв’яжіться з нами</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Зверніть увагу, що для підтримки репутації IP та забезпечення доставлення ми маємо процес ручного перегляду для кожного домену окремо для схвалення вихідного SMTP. Зазвичай це займає менше 24 годин, більшість запитів обробляються протягом 1-2 годин. У найближчому майбутньому ми плануємо зробити цей процес миттєвим із додатковими контролями спаму та сповіщеннями. Цей процес гарантує, що ваші листи потрапляють у вхідні, а ваші повідомлення не позначаються як спам.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

</div>

### Чи підтримуєте ви OpenPGP/MIME, наскрізне шифрування ("E2EE") та Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Так, ми підтримуємо [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [наскрізне шифрування ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) та пошук публічних ключів за допомогою [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Ви можете налаштувати OpenPGP, використовуючи [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) або [розмістити власні ключі](https://wiki.gnupg.org/WKDHosting) (див. [цей gist для налаштування WKD сервера](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Запити WKD кешуються на 1 годину для забезпечення своєчасної доставки листів → тому, якщо ви додали, змінили або видалили свій WKD ключ, будь ласка, надішліть нам листа на `support@forwardemail.net` з вашою електронною адресою, щоб ми вручну очистили кеш.
* Ми підтримуємо шифрування PGP для повідомлень, які пересилаються через WKD пошук або за допомогою завантаженого PGP ключа у нашому інтерфейсі.
* Завантажені ключі мають пріоритет, доки прапорець PGP увімкнено/позначено.
* Повідомлення, надіслані на вебхуки, наразі не шифруються за допомогою PGP.
* Якщо у вас є кілька псевдонімів, які підходять для певної адреси пересилання (наприклад, комбінація regex/wildcard/exact), і якщо більше одного з них містить завантажений PGP ключ і має увімкнений PGP → ми надішлемо вам лист із повідомленням про помилку і не зашифруємо повідомлення вашим завантаженим PGP ключем. Це дуже рідко і зазвичай стосується лише досвідчених користувачів із складними правилами псевдонімів.
* **Шифрування PGP не застосовується до пересилання пошти через наші MX сервери, якщо відправник мав політику DMARC reject. Якщо вам потрібне шифрування PGP для *всієї* пошти, радимо використовувати наш IMAP сервіс і налаштувати свій PGP ключ для псевдоніма для вхідної пошти.**

**Ви можете перевірити налаштування Web Key Directory на <https://wkd.chimbosonic.com/> (відкритий код) або <https://www.webkeydirectory.com/> (пропрієтарний).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Автоматичне шифрування:
  </strong>
  <span>Якщо ви використовуєте наш <a href="#do-you-support-sending-email-with-smtp" class="alert-link">сервіс вихідного SMTP</a> і надсилаєте незашифровані повідомлення, ми автоматично намагатимемося шифрувати повідомлення для кожного отримувача за допомогою <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Ви повинні виконати всі наведені нижче кроки, щоб увімкнути OpenPGP для вашого власного доменного імені.
  </span>
</div>

1. Завантажте та встановіть рекомендований плагін для вашого поштового клієнта нижче:

   | Поштовий клієнт | Платформа | Рекомендований плагін                                                                                                                                                                | Примітки                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop  | [Налаштувати OpenPGP у Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird має вбудовану підтримку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | Browser  | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (пропрієтарна ліцензія)                                                                        | Gmail не підтримує OpenPGP, проте ви можете завантажити відкритий плагін [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                          |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                        | Apple Mail не підтримує OpenPGP, проте ви можете завантажити відкритий плагін [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                               |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) або [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (пропрієтарна ліцензія)                       | Apple Mail не підтримує OpenPGP, проте ви можете завантажити відкритий плагін [PGPro](https://github.com/opensourceios/PGPro/) або [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                          |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                        | Десктопний поштовий клієнт Outlook не підтримує OpenPGP, проте ви можете завантажити відкритий плагін [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                      |
   | Outlook         | Browser  | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (пропрієтарна ліцензія)                                                                        | Веб-поштовий клієнт Outlook не підтримує OpenPGP, проте ви можете завантажити відкритий плагін [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Android         | Mobile   | [OpenKeychain](https://www.openkeychain.org/) або [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                   | [Поштові клієнти Android](/blog/open-source/android-email-clients), такі як [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) та [FairEmail](https://github.com/M66B/FairEmail), підтримують відкритий плагін [OpenKeychain](https://www.openkeychain.org/). Ви також можете використовувати відкритий (з пропрієтарною ліцензією) плагін [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Browser  | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (пропрієтарна ліцензія)                                                                        | Ви можете завантажити відкритий розширення для браузера [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                           |
   | Mozilla Firefox | Browser  | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (пропрієтарна ліцензія)                                                                        | Ви можете завантажити відкритий розширення для браузера [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                           |
   | Microsoft Edge  | Browser  | [Mailvelope](https://mailvelope.com/)                                                                                                                                               | Ви можете завантажити відкритий розширення для браузера [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                          |
   | Brave           | Browser  | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (пропрієтарна ліцензія)                                                                        | Ви можете завантажити відкритий розширення для браузера [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                           |
   | Balsa           | Desktop  | [Налаштувати OpenPGP у Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                          | Balsa має вбудовану підтримку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | Desktop  | [Налаштувати OpenPGP у KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                             | KMail має вбудовану підтримку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | Desktop  | [Налаштувати OpenPGP у Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                             | GNOME Evolution має вбудовану підтримку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | Desktop  | [Налаштувати gpg у Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                       | Ви можете використовувати відкритий [gpg командний рядок](https://www.gnupg.org/download/) для генерації нового ключа з командного рядка.                                                                                                                                                                                                                                                                                                |
2. Відкрийте плагін, створіть свій публічний ключ і налаштуйте свій поштовий клієнт для його використання.

3. Завантажте свій публічний ключ на <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Ви можете відвідати <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>, щоб керувати своїм ключем у майбутньому.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Додатково за бажанням:
     </strong>
     <span>
       Якщо ви користуєтеся нашим сервісом <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">шифрованого зберігання (IMAP/POP3)</a> і хочете, щоб <i>вся</i> пошта, що зберігається у вашій (вже зашифрованій) базі даних SQLite, була зашифрована вашим публічним ключем, тоді перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Редагувати <i class="fa fa-angle-right"></i> OpenPGP і завантажте свій публічний ключ.
     </span>
   </div>

4. Додайте новий запис `CNAME` до вашого доменного імені (наприклад, `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Ім'я/Хост/Псевдонім</th>
         <th class="text-center">TTL</th>
         <th>Тип</th>
         <th>Відповідь/Значення</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Якщо ваш псевдонім використовує наші <a class="alert-link" href="/disposable-addresses" target="_blank">вінтажні/одноразові домени</a> (наприклад, <code>hideaddress.net</code>), тоді цей крок можна пропустити.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно виконали всі кроки.
    </span>
  </div>
</div>

### Чи підтримуєте ви шифрування S/MIME {#do-you-support-smime-encryption}

Так, ми підтримуємо шифрування [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) згідно з визначенням у [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME забезпечує наскрізне шифрування за допомогою сертифікатів X.509, що широко підтримується корпоративними поштовими клієнтами.

Ми підтримуємо як RSA, так і ECC (криптографія на еліптичних кривих) сертифікати:

* **RSA сертифікати**: мінімум 2048 біт, рекомендовано 4096 біт
* **ECC сертифікати**: криві NIST P-256, P-384 та P-521

Щоб налаштувати шифрування S/MIME для вашого псевдоніма:

1. Отримайте сертифікат S/MIME від довіреного центру сертифікації (CA) або згенеруйте самопідписаний сертифікат для тестування.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Порада:
     </strong>
     <span>Безкоштовні сертифікати S/MIME доступні у провайдерів, таких як <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> або <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Експортуйте свій сертифікат у форматі PEM (тільки публічний сертифікат, без приватного ключа).

3. Перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Редагувати <i class="fa fa-angle-right"></i> S/MIME і завантажте свій публічний сертифікат.
4. Після налаштування всі вхідні листи на ваш псевдонім будуть зашифровані за допомогою вашого сертифіката S/MIME перед збереженням або пересиланням.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Примітка:
     </strong>
     <span>
       Шифрування S/MIME застосовується до вхідних повідомлень, які ще не зашифровані. Якщо повідомлення вже зашифроване за допомогою OpenPGP або S/MIME, воно не буде повторно зашифроване.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Важливо:
     </strong>
     <span>
       Шифрування S/MIME не застосовується до пересилання електронної пошти через наші MX-сервери, якщо відправник мав політику DMARC reject. Якщо вам потрібне шифрування S/MIME для <em>всієї</em> пошти, ми рекомендуємо використовувати наш IMAP-сервіс і налаштувати ваш сертифікат S/MIME для псевдоніма для вхідної пошти.
     </span>
   </div>

Наступні поштові клієнти мають вбудовану підтримку S/MIME:

| Поштовий клієнт  | Платформа | Примітки                                                                                                           |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail       | macOS    | Вбудована підтримка S/MIME. Перейдіть у Mail > Preferences > Accounts > ваш акаунт > Trust для налаштування сертифікатів. |
| Apple Mail       | iOS      | Вбудована підтримка S/MIME. Перейдіть у Settings > Mail > Accounts > ваш акаунт > Advanced > S/MIME для налаштування. |
| Microsoft Outlook| Windows  | Вбудована підтримка S/MIME. Перейдіть у File > Options > Trust Center > Trust Center Settings > Email Security для налаштування. |
| Microsoft Outlook| macOS    | Вбудована підтримка S/MIME. Перейдіть у Tools > Accounts > Advanced > Security для налаштування.                 |
| Thunderbird      | Desktop  | Вбудована підтримка S/MIME. Перейдіть у Account Settings > End-To-End Encryption > S/MIME для налаштування.       |
| GNOME Evolution  | Desktop  | Вбудована підтримка S/MIME. Перейдіть у Edit > Preferences > Mail Accounts > ваш акаунт > Security для налаштування. |
| KMail            | Desktop  | Вбудована підтримка S/MIME. Перейдіть у Settings > Configure KMail > Identities > ваша особа > Cryptography для налаштування. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Вітаємо!
    </strong>
    <span>
      Ви успішно налаштували шифрування S/MIME для вашого псевдоніма.
    </span>
  </div>
</div>

### Чи підтримуєте ви фільтрацію електронної пошти Sieve {#do-you-support-sieve-email-filtering}

Так! Ми підтримуємо фільтрацію електронної пошти [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) відповідно до визначень у [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve — це потужна стандартизована мова сценаріїв для серверної фільтрації пошти, яка дозволяє автоматично організовувати, фільтрувати та відповідати на вхідні повідомлення.

#### Підтримувані розширення Sieve {#supported-sieve-extensions}

Ми підтримуємо широкий набір розширень Sieve:

| Розширення                  | RFC                                                                                     | Опис                                             |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Поміщати повідомлення у певні папки               |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | Відхиляти повідомлення з помилкою                  |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | Автоматичні відповіді у відпустці/поза офісом     |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | Точні інтервали відповідей у відпустці             |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | Встановлення IMAP-прапорців (\Seen, \Flagged тощо)|
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Перевірка відправника/одержувача конверта         |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | Перевірка вмісту тіла повідомлення                 |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | Збереження та використання змінних у скриптах      |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | Відносні порівняння (більше, менше)                |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                               | Числові порівняння                                 |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | Копіювання повідомлень під час перенаправлення     |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | Додавання або видалення заголовків повідомлень     |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Перевірка значень дати/часу                        |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Доступ до конкретних входжень заголовків           |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | Пошук за регулярними виразами                      |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | Надсилання сповіщень (наприклад, mailto:)          |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | Доступ до інформації про середовище                 |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | Перевірка існування поштової скриньки, створення скриньок |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | Поміщати у спеціальні поштові скриньки (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | Виявлення дублікатів повідомлень                    |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | Перевірка доступності розширення                    |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | Доступ до частин адреси user+detail                 |
#### Розширення, які не підтримуються {#extensions-not-supported}

Наступні розширення наразі не підтримуються:

| Розширення                                                    | Причина                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                     | Ризик безпеки (ін’єкція скриптів) та потребує глобального збереження скриптів |
| `mboxmetadata` / `servermetadata`                             | Потрібна підтримка розширення IMAP METADATA                        |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Складна маніпуляція MIME-деревом ще не реалізована                 |

#### Приклади скриптів Sieve {#example-sieve-scripts}

**Файл розсилок у папку:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Автовідповідь під час відпустки:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Я наразі не в офісі і відповім, коли повернуся.";
```

**Позначити повідомлення від важливих відправників:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Відхилити спам із певними темами:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Повідомлення відхилено через спам.";
}
```

#### Керування скриптами Sieve {#managing-sieve-scripts}

Ви можете керувати своїми скриптами Sieve кількома способами:

1. **Веб-інтерфейс**: Перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми <i class="fa fa-angle-right"></i> Скрипти Sieve для створення та керування скриптами.

2. **Протокол ManageSieve**: Підключіться за допомогою будь-якого клієнта, сумісного з ManageSieve (наприклад, доповнення Sieve для Thunderbird або [sieve-connect](https://github.com/philpennock/sieve-connect)) до `imap.forwardemail.net`. Використовуйте порт `2190` з STARTTLS (рекомендовано для більшості клієнтів) або порт `4190` з неявним TLS.

3. **API**: Використовуйте наш [REST API](/api#sieve-scripts) для програмного керування скриптами.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Примітка:
  </strong>
  <span>
    Фільтрація Sieve застосовується до вхідних повідомлень перед їх збереженням у вашій поштовій скриньці. Скрипти виконуються в порядку пріоритету, і перша відповідна дія визначає, як обробляється повідомлення.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Безпека:
  </strong>
  <span>
    З міркувань безпеки дії перенаправлення обмежені 10 на скрипт і 100 на день. Відповіді під час відпустки обмежені за частотою, щоб запобігти зловживанням.
  </span>
</div>

### Чи підтримуєте ви MTA-STS {#do-you-support-mta-sts}

Так, з 2 березня 2023 року ми підтримуємо [MTA-STS](https://www.hardenize.com/blog/mta-sts). Ви можете використати [цей шаблон](https://github.com/jpawlowski/mta-sts.template), якщо бажаєте увімкнути його на своєму домені.

Нашу конфігурацію можна знайти публічно на GitHub за адресою <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Чи підтримуєте ви passkeys та WebAuthn {#do-you-support-passkeys-and-webauthn}

Так! З 13 грудня 2023 року ми додали підтримку passkeys [через великий попит](https://github.com/orgs/forwardemail/discussions/182).

Passkeys дозволяють безпечно входити без пароля та двофакторної автентифікації.

Ви можете підтвердити свою особу за допомогою дотику, розпізнавання обличчя, пароля пристрою або PIN-коду.

Ми дозволяємо керувати до 30 passkeys одночасно, щоб ви могли легко входити з усіх своїх пристроїв.

Дізнайтеся більше про passkeys за наступними посиланнями:

* [Увійдіть у свої додатки та вебсайти за допомогою passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Використовуйте passkeys для входу в додатки та вебсайти на iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Стаття Вікіпедії про Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Чи підтримуєте ви найкращі практики електронної пошти {#do-you-support-email-best-practices}

Так. Ми маємо вбудовану підтримку SPF, DKIM, DMARC, ARC та SRS у всіх планах. Ми також тісно співпрацювали з оригінальними авторами цих специфікацій та іншими експертами з електронної пошти, щоб забезпечити досконалість і високу доставлюваність.

### Чи підтримуєте ви вебхуки для відмов (bounce) {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
    Шукаєте документацію щодо вебхуків електронної пошти? Дивіться <a href="/faq#do-you-support-webhooks" class="alert-link">Чи підтримуєте ви вебхуки?</a> для детальнішої інформації.
  <span>
  </span>
</div>

Так, станом на 14 серпня 2024 року ми додали цю функцію. Тепер ви можете перейти в Мій акаунт → Домени → Налаштування → URL вебхука відмов (Bounce Webhook URL) і налаштувати URL `http://` або `https://`, на який ми будемо надсилати `POST` запит щоразу, коли вихідні SMTP-листи повертаються (bounce).

Це корисно для керування та моніторингу ваших вихідних SMTP-листів – і може використовуватися для підтримки підписників, відписки та виявлення випадків відмов.

Дані вебхука відмов надсилаються у форматі JSON з такими властивостями:

* `email_id` (String) - ID листа, що відповідає листу в Мій акаунт → Листи (вихідний SMTP)
* `list_id` (String) - значення заголовка `List-ID` (без врахування регістру), якщо є, з оригінального вихідного листа
* `list_unsubscribe` (String) - значення заголовка `List-Unsubscribe` (без врахування регістру), якщо є, з оригінального вихідного листа
* `feedback_id` (String) - значення заголовка `Feedback-ID` (без врахування регістру), якщо є, з оригінального вихідного листа
* `recipient` (String) - електронна адреса отримувача, який отримав відмову або помилку
* `message` (String) - детальне повідомлення про помилку відмови
* `response` (String) - повідомлення відповіді SMTP
* `response_code` (Number) - розпарсений код відповіді SMTP
* `truth_source` (String) - якщо код відповіді надійшов із довіреного джерела, це поле міститиме кореневий домен (наприклад, `google.com` або `yahoo.com`)
* `bounce` (Object) - об’єкт, що містить такі властивості, які деталізують статус відмови та відхилення
  * `action` (String) - дія відмови (наприклад, `"reject"`)
  * `message` (String) - причина відмови (наприклад, `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - категорія відмови (наприклад, `"block"`)
  * `code` (Number) - код статусу відмови (наприклад, `554`)
  * `status` (String) - код відмови з повідомлення відповіді (наприклад, `5.7.1`)
  * `line` (Number) - розпарсений номер рядка, якщо є, [з переліку Zone-MTA bounce parse list](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (наприклад, `526`)
* `headers` (Object) - ключ-значення заголовків вихідного листа
* `bounced_at` (String) - дата у форматі [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), коли сталася помилка відмови

Наприклад:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Ось кілька додаткових зауважень щодо вебхуків відмов:

* Якщо у даних вебхука є значення `list_id`, `list_unsubscribe` або `feedback_id`, тоді слід вжити відповідних заходів для видалення `recipient` зі списку, якщо це необхідно.
  * Якщо значення `bounce.category` було одним із `"block"`, `"recipient"`, `"spam"` або `"virus"`, тоді обов’язково слід видалити користувача зі списку.
* Якщо потрібно перевіряти дані вебхука (щоб переконатися, що вони дійсно надходять з нашого сервера), можна [визначити IP-адресу клієнта за допомогою зворотного DNS-пошуку](https://nodejs.org/api/dns.html#dnspromisesreverseip) – це має бути `smtp.forwardemail.net`.
  * Також можна перевірити IP-адресу за [нашими опублікованими IP-адресами](#what-are-your-servers-ip-addresses).
  * Перейдіть у Мій акаунт → Домени → Налаштування → Ключ перевірки підпису вебхука (Webhook Signature Payload Verification Key), щоб отримати ваш ключ вебхука.
    * Ви можете змінювати цей ключ у будь-який час з міркувань безпеки.
    * Обчисліть і порівняйте значення `X-Webhook-Signature` з нашого запиту вебхука з обчисленим значенням тіла за допомогою цього ключа. Приклад того, як це зробити, доступний у [цьому дописі на Stack Overflow](https://stackoverflow.com/a/68885281).
  * Дивіться обговорення на <https://github.com/forwardemail/free-email-forwarding/issues/235> для додаткової інформації.
* Ми чекатимемо до `5` секунд, щоб ваш вебхук відповів зі статусом `200`, і повторимо спробу до `1` разу.
* Якщо ми виявимо помилку у вашому URL вебхука відмов під час спроби надіслати запит, ми надсилатимемо вам ввічливе нагадування електронною поштою раз на тиждень.
### Чи підтримуєте ви вебхуки {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
    Шукаєте документацію щодо вебхуків відскоків? Дивіться <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Чи підтримуєте ви вебхуки відскоків?</a> для більш детальної інформації.
  <span>
  </span>
</div>

Так, з 15 травня 2020 року ми додали цю функцію. Ви можете просто додати вебхук(и) так само, як і будь-якого отримувача! Будь ласка, переконайтеся, що в URL вебхука префікс "http" або "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Покращений захист конфіденційності:
  </strong>
  <span>
    Якщо ви користуєтеся платним планом (який має покращений захист конфіденційності), будь ласка, перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> і натисніть "Псевдоніми" поруч із вашим доменом, щоб налаштувати вебхуки. Якщо хочете дізнатися більше про платні плани, дивіться нашу сторінку <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ціни</a>. Інакше ви можете продовжувати слідувати інструкціям нижче.
  </span>
</div>

Якщо ви користуєтеся безкоштовним планом, просто додайте новий DNS <strong class="notranslate">TXT</strong> запис, як показано нижче:

Наприклад, якщо я хочу, щоб усі листи, які надходять на `alias@example.com`, пересилалися на нову тестову кінцеву точку [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Або, можливо, ви хочете, щоб усі листи, які надходять на `example.com`, пересилалися на цю кінцеву точку:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Ось додаткові нотатки щодо вебхуків:**

* Якщо вам потрібно перевірити коректність навантаження вебхука (щоб упевнитися, що воно дійсно надходить з нашого сервера), ви можете [визначити IP-адресу віддаленого клієнта або ім'я хоста клієнта за допомогою зворотного пошуку](https://nodejs.org/api/dns.html#dnspromisesreverseip) – це має бути або `mx1.forwardemail.net`, або `mx2.forwardemail.net`.
  * Ви також можете перевірити IP-адресу за [нашими опублікованими IP-адресами](#what-are-your-servers-ip-addresses).
  * Якщо ви користуєтеся платним планом, перейдіть у Мій акаунт → Домени → Налаштування → Ключ перевірки підпису вебхука, щоб отримати ваш ключ вебхука.
    * Ви можете змінювати цей ключ у будь-який час з міркувань безпеки.
    * Обчисліть і порівняйте значення `X-Webhook-Signature` з нашого запиту вебхука з обчисленим значенням тіла за допомогою цього ключа. Приклад того, як це зробити, доступний у [цьому дописі на Stack Overflow](https://stackoverflow.com/a/68885281).
  * Дивіться обговорення на <https://github.com/forwardemail/free-email-forwarding/issues/235> для більш детальної інформації.
* Якщо вебхук не відповідає кодом статусу `200`, ми збережемо його відповідь у [журналі помилок](#do-you-store-error-logs) – це корисно для налагодження.
* HTTP-запити вебхуків повторюватимуться до 3 разів при кожній спробі SMTP-з’єднання, з максимальним таймаутом 60 секунд на POST-запит до кінцевої точки. **Зверніть увагу, що це не означає, що повторів лише 3**, фактично повтори відбуватимуться безперервно з часом, надсилаючи SMTP-код 421 (що означає для відправника спробувати пізніше) після третьої невдалої спроби HTTP POST. Це означає, що лист буде повторно надсилатися протягом днів, доки не буде отримано код статусу 200.
* Ми автоматично повторюємо запити на основі стандартних кодів статусу та помилок, які використовуються у [методі retry бібліотеки superagent](https://ladjs.github.io/superagent/#retrying-requests) (ми є її підтримувачами).
* Ми групуємо HTTP-запити вебхуків до однієї й тієї ж кінцевої точки в один запит замість кількох, щоб заощадити ресурси та прискорити час відповіді. Наприклад, якщо ви надсилаєте листа на <webhook1@example.com>, <webhook2@example.com> та <webhook3@example.com>, і всі вони налаштовані на ту саму *точну* URL-адресу кінцевої точки, буде зроблено лише один запит. Ми групуємо за точною відповідністю кінцевої точки з суворою рівністю.
* Зверніть увагу, що ми використовуємо метод "simpleParser" бібліотеки [mailparser](https://nodemailer.com/extras/mailparser/) для розбору повідомлення у JSON-дружній об’єкт.
* Сировинне значення листа як рядок подається у властивості "raw".
* Результати автентифікації подаються у властивостях "dkim", "spf", "arc", "dmarc" та "bimi".
* Розпарсені заголовки листа подаються у властивості "headers" – також зверніть увагу, що можна використовувати "headerLines" для зручнішої ітерації та розбору.
* Груповані отримувачі для цього вебхука згруповані разом і подаються у властивості "recipients".
* Інформація про SMTP-сесію подається у властивості "session". Вона містить інформацію про відправника повідомлення, час надходження повідомлення, HELO та ім'я хоста клієнта. Значення імені хоста клієнта як `session.clientHostname` – це або FQDN (зворотний PTR-пошук), або `session.remoteAddress`, обгорнута у дужки (наприклад, `"[127.0.0.1]"`).
* Якщо вам потрібно швидко отримати значення `X-Original-To`, ви можете використати значення `session.recipient` (див. приклад нижче). Заголовок `X-Original-To` – це заголовок, який ми додаємо до повідомлень для налагодження з оригінальним отримувачем (до маскування пересилання) для повідомлення.
* Якщо потрібно видалити властивості `attachments` та/або `raw` з тіла навантаження, просто додайте `?attachments=false`, `?raw=false` або `?attachments=false&raw=false` до URL вашої кінцевої точки вебхука як параметр рядка запиту (наприклад, `https://example.com/webhook?attachments=false&raw=false`).
* Якщо є вкладення, вони будуть додані до масиву `attachments` у вигляді значень Buffer. Ви можете розпарсити їх назад у вміст, використовуючи підхід на JavaScript, наприклад:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Ви підтримуєте регулярні вирази або regex {#do-you-support-regular-expressions-or-regex}

Так, станом на 27 вересня 2021 року ми додали цю функцію. Ви можете просто писати регулярні вирази ("regex") для співпадіння псевдонімів та виконання замін.

Псевдоніми, що підтримують регулярні вирази, — це ті, що починаються з `/` і закінчуються на `/`, а їхні отримувачі є електронними адресами або вебхуками. Отримувачі також можуть включати підтримку замін за допомогою regex (наприклад, `$1`, `$2`).

Ми підтримуємо два прапорці регулярних виразів, включно з `i` та `g`. Регістронезалежний прапорець `i` є постійним за замовчуванням і завжди застосовується. Глобальний прапорець `g` ви можете додати, додавши `/g` після кінцевого `/`.

Зверніть увагу, що ми також підтримуємо нашу <a href="#can-i-disable-specific-aliases">функцію відключення псевдонімів</a> для частини отримувача з підтримкою regex.

Регулярні вирази не підтримуються на <a href="/disposable-addresses" target="_blank">глобальних доменах ваніті</a> (оскільки це може бути вразливістю безпеки).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Покращений захист конфіденційності:
  </strong>
  <span>
    Якщо ви користуєтесь платним планом (який має покращений захист конфіденційності), будь ласка, перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> і натисніть "Псевдоніми" поруч із вашим доменом, щоб налаштувати псевдоніми, включно з тими, що мають регулярні вирази. Якщо ви хочете дізнатися більше про платні плани, дивіться нашу сторінку <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ціни</a>.
  </span>
</div>

#### Приклади для покращеного захисту конфіденційності {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Назва псевдоніма</th>
      <th>Ефект</th>
      <th>Тест</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Листи на `linus@example.com` або `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">переглянути тест на RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Листи на `24highst@example.com` або `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">переглянути тест на RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
    Щоб протестувати це на <a href="https://regexr.com" class="alert-link">RegExr</a>, напишіть вираз у верхньому полі, а потім введіть приклад псевдоніма в текстове поле нижче. Якщо він співпаде, поле стане синім.
  <span>
  </span>
</div>

#### Приклади для безкоштовного плану {#examples-for-the-free-plan}

Якщо ви користуєтесь безкоштовним планом, просто додайте новий DNS <strong class="notranslate">TXT</strong> запис, використовуючи один або кілька з наведених нижче прикладів:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Простий приклад:</strong> Якщо я хочу, щоб усі листи, що надходять на `linus@example.com` або `torvalds@example.com`, пересилались на `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Приклад заміни Ім'я Прізвище:</strong> Уявіть, що всі електронні адреси вашої компанії мають формат `firstname.lastname@example.com`. Якщо я хочу, щоб усі листи, що надходять на шаблон `firstname.lastname@example.com`, пересилались на `firstname.lastname@company.com` з підтримкою замін (<a href="https://regexr.com/66hnu" class="alert-link">переглянути тест на RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Приклад заміни фільтрації символу плюса:</strong> Якщо я хочу, щоб усі листи, які надходять на `info@example.com` або `support@example.com`, пересилалися відповідно на `user+info@gmail.com` або `user+support@gmail.com` (з підтримкою заміни) (<a href="https://regexr.com/66ho7" class="alert-link">переглянути тест на RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Приклад заміни рядка запиту webhook:</strong> Можливо, ви хочете, щоб усі листи, які надходять на `example.com`, надсилалися на <a href="#do-you-support-webhooks" class="alert-link">webhook</a> і мали динамічний ключ рядка запиту "to" зі значенням частини імені користувача електронної адреси (<a href="https://regexr.com/66ho4" class="alert-link">переглянути тест на RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Приклад тихого відхилення:</strong> Якщо ви хочете, щоб усі листи, які відповідають певному шаблону, були відключені і тихо відхилені (для відправника виглядає, ніби повідомлення було успішно надіслано, але насправді нікуди не надходить) зі статусним кодом `250` (див. <a href="#can-i-disable-specific-aliases" class="alert-link">Чи можу я відключити конкретні псевдоніми</a>), тоді просто використовуйте той самий підхід з одним знаком оклику "!". Це вказує відправнику, що повідомлення було успішно доставлено, але насправді воно нікуди не пішло (наприклад, чорна діра або `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Приклад м’якого відхилення:</strong> Якщо ви хочете, щоб усі листи, які відповідають певному шаблону, були відключені і м’яко відхилені зі статусним кодом `421` (див. <a href="#can-i-disable-specific-aliases" class="alert-link">Чи можу я відключити конкретні псевдоніми</a>), тоді просто використовуйте той самий підхід з подвійним знаком оклику "!!". Це вказує відправнику повторити спробу надіслати лист, і листи на цей псевдонім будуть повторно намагатися доставити приблизно 5 днів, а потім відхилені назавжди.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Приклад жорсткого відхилення:</strong> Якщо ви хочете, щоб усі електронні листи, які відповідають певному шаблону, були відключені та жорстко відхилені зі статусом `550` (див. <a href="#can-i-disable-specific-aliases" class="alert-link">Чи можу я відключити конкретні псевдоніми</a>), просто використовуйте той самий підхід з потрійним знаком оклику "!!!". Це вказує відправнику на постійну помилку, і листи не будуть повторно надсилатися, вони будуть відхилені для цього псевдоніма.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
    Цікаво, як написати регулярний вираз або потрібно протестувати заміну? Ви можете перейти на безкоштовний сайт для тестування регулярних виразів <a href="https://regexr.com" class="alert-link">RegExr</a> за адресою <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Які у вас обмеження на вихідні SMTP {#what-are-your-outbound-smtp-limits}

Ми обмежуємо користувачів і домени до 300 вихідних SMTP повідомлень на 1 день. Це в середньому понад 9000 листів на календарний місяць. Якщо вам потрібно перевищити цю кількість або у вас постійно великі листи, будь ласка, [зв’яжіться з нами](https://forwardemail.net/help).

### Чи потрібне схвалення для увімкнення SMTP {#do-i-need-approval-to-enable-smtp}

Так, зверніть увагу, що для підтримки репутації IP та забезпечення доставляння, Forward Email має процес ручного перегляду для кожного домену для схвалення вихідного SMTP. Напишіть на <support@forwardemail.net> або відкрийте [запит на допомогу](https://forwardemail.net/help) для отримання схвалення. Зазвичай це займає менше 24 годин, більшість запитів обробляються протягом 1-2 годин. У найближчому майбутньому ми плануємо зробити цей процес миттєвим із додатковими контролями спаму та сповіщеннями. Цей процес гарантує, що ваші листи потрапляють у вхідні, а ваші повідомлення не позначаються як спам.

### Які у вас налаштування сервера SMTP {#what-are-your-smtp-server-configuration-settings}

Наш сервер — `smtp.forwardemail.net`, і він також моніториться на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці статусу</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порти `465` та `2465` для SSL/TLS (рекомендовано) та `587`, `2587`, `2525` і `25` для TLS (STARTTLS).

**Станом на жовтень 2025 року** ми тепер підтримуємо **спадкові з’єднання TLS 1.0** на портах `2455` (SSL/TLS) та `2555` (STARTTLS) для старих пристроїв, таких як принтери, сканери, камери та спадкові поштові клієнти, які не можуть підтримувати сучасні версії TLS. Ці порти надаються як альтернатива Gmail, Yahoo, Outlook та іншим провайдерам, які припинили підтримку старих протоколів TLS.

> \[!CAUTION]
> **Підтримка спадкового TLS 1.0 (порти 2455 і 2555)**: Ці порти використовують застарілий протокол TLS 1.0, який має відомі вразливості безпеки (BEAST, POODLE). Використовуйте ці порти лише якщо ваш пристрій абсолютно не підтримує TLS 1.2 або вище. Ми настійно рекомендуємо оновити прошивку пристрою або перейти на сучасні поштові клієнти, коли це можливо. Ці порти призначені виключно для сумісності зі спадковим обладнанням (старі принтери, сканери, камери, IoT-пристрої).

|                                     Протокол                                     | Ім'я хоста              |            Порти            |        IPv4        |        IPv6        | Примітки                               |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Рекомендовано**                         | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Сучасний TLS 1.2+ (Рекомендовано)     |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Підтримується (краще SSL/TLS порт `465`) |
|                             `SSL/TLS` **Тільки спадковий**                       | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 лише для старих пристроїв |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Тільки спадковий** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 лише для старих пристроїв |
| Логін    | Приклад                   | Опис                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com`         | Адреса електронної пошти псевдоніма, що існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль   | `************************` | Псевдонім                                                                                                                                                                                 |

Щоб надсилати вихідні листи через SMTP, **користувач SMTP** повинен бути адресою електронної пошти псевдоніма, що існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> – а **пароль SMTP** має бути згенерованим паролем, специфічним для псевдоніма.

Будь ласка, зверніться до [Чи підтримуєте ви надсилання листів через SMTP](#do-you-support-sending-email-with-smtp) для покрокових інструкцій.

### Які ваші налаштування сервера IMAP {#what-are-your-imap-server-configuration-settings}

Наш сервер — `imap.forwardemail.net`, і він також контролюється на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці статусу</a>.

Він підтримує як IPv4, так і IPv6, і доступний через порти `993` та `2993` для SSL/TLS.

|         Протокол         | Ім'я хоста              |     Порти     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Рекомендовано** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Логін    | Приклад                   | Опис                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com`         | Адреса електронної пошти псевдоніма, що існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль   | `************************` | Згенерований пароль, специфічний для псевдоніма.                                                                                                                                          |

Щоб підключитися через IMAP, **користувач IMAP** повинен бути адресою електронної пошти псевдоніма, що існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> – а **пароль IMAP** має бути згенерованим паролем, специфічним для псевдоніма.

Будь ласка, зверніться до [Чи підтримуєте ви отримання листів через IMAP](#do-you-support-receiving-email-with-imap) для покрокових інструкцій.

### Які ваші налаштування сервера POP3 {#what-are-your-pop3-server-configuration-settings}

Наш сервер — `pop3.forwardemail.net`, і він також контролюється на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці статусу</a>.

Він підтримує як IPv4, так і IPv6, і доступний через порти `995` та `2995` для SSL/TLS.

|         Протокол         | Ім'я хоста              |     Порти     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Рекомендовано** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Логін    | Приклад                   | Опис                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com`         | Адреса електронної пошти псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль   | `************************` | Згенерований пароль, специфічний для псевдоніма.                                                                                                                                          |

Щоб підключитися через POP3, **користувач POP3** повинен бути адресою електронної пошти псевдоніма, який існує для домену в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> – а **пароль IMAP** має бути згенерованим паролем, специфічним для псевдоніма.

Будь ласка, зверніться до [Чи підтримуєте ви POP3](#do-you-support-pop3) для покрокових інструкцій.

### Як налаштувати автоматичне виявлення електронної пошти для мого домену {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Автоматичне виявлення електронної пошти дозволяє поштовим клієнтам, таким як **Thunderbird**, **Apple Mail**, **Microsoft Outlook** та мобільним пристроям, автоматично визначати правильні налаштування серверів IMAP, SMTP, POP3, CalDAV та CardDAV при додаванні користувачем свого поштового акаунту. Це визначено в [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (електронна пошта) та [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) і використовує DNS SRV записи.

Forward Email публікує записи автоматичного виявлення на `forwardemail.net`. Ви можете або додати SRV записи безпосередньо до свого домену, або використати простіший підхід з CNAME.

#### Варіант A: CNAME записи (найпростіший) {#option-a-cname-records-simplest}

Додайте ці два CNAME записи до DNS вашого домену. Це делегує автоматичне виявлення серверам Forward Email:

|  Тип  | Ім'я/Хост      | Ціль/Значення                  |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Запис `autoconfig` використовується **Thunderbird** та іншими клієнтами на базі Mozilla. Запис `autodiscover` використовується **Microsoft Outlook**.

#### Варіант B: SRV записи (прямі) {#option-b-srv-records-direct}

Якщо ви віддаєте перевагу додавати записи безпосередньо (або ваш DNS-провайдер не підтримує CNAME для піддоменів), додайте ці SRV записи до свого домену:

| Тип  | Ім'я/Хост           | Пріоритет | Вага | Порт | Ціль/Значення               | Призначення                              |
| :--: | ------------------- | :-------: | :--: | :--: | -------------------------- | --------------------------------------- |
|  SRV | `_imaps._tcp`       |     0     |  1   |  993 | `imap.forwardemail.net`    | IMAP через SSL/TLS (рекомендовано)      |
|  SRV | `_imap._tcp`        |     0     |  0   |   0  | `.`                        | Прості IMAP вимкнено                     |
|  SRV | `_submissions._tcp` |     0     |  1   |  465 | `smtp.forwardemail.net`    | Відправка SMTP (SSL/TLS, рекомендовано) |
|  SRV | `_submission._tcp`  |     5     |  1   |  587 | `smtp.forwardemail.net`    | Відправка SMTP (STARTTLS)                |
|  SRV | `_pop3s._tcp`       |    10     |  1   |  995 | `pop3.forwardemail.net`    | POP3 через SSL/TLS                       |
|  SRV | `_pop3._tcp`        |     0     |  0   |   0  | `.`                        | Прості POP3 вимкнено                     |
|  SRV | `_caldavs._tcp`     |     0     |  1   |  443 | `caldav.forwardemail.net`  | CalDAV через TLS (календарі)             |
|  SRV | `_caldav._tcp`      |     0     |  0   |   0  | `.`                        | Прості CalDAV вимкнено                   |
|  SRV | `_carddavs._tcp`    |     0     |  1   |  443 | `carddav.forwardemail.net` | CardDAV через TLS (контакти)             |
|  SRV | `_carddav._tcp`     |     0     |  0   |   0  | `.`                        | Прості CardDAV вимкнено                  |
> \[!NOTE]
> IMAP має нижче значення пріоритету (0), ніж POP3 (10), що вказує поштовим клієнтам віддавати перевагу IMAP перед POP3, коли обидва доступні. Записи з ціллю `.` (одна крапка) означають, що незашифровані (plaintext) версії цих протоколів навмисно вимкнені відповідно до [RFC 6186 Розділ 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). SRV-записи CalDAV і CardDAV відповідають [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) для автоматичного виявлення календарів і контактів.

#### Які поштові клієнти підтримують автоматичне виявлення? {#which-email-clients-support-autodiscovery}

| Клієнт             | Пошта                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME або SRV записи                | `autoconfig` XML або SRV записи (RFC 6764) |
| Apple Mail (macOS) | SRV записи (RFC 6186)                           | SRV записи (RFC 6764)                     |
| Apple Mail (iOS)   | SRV записи (RFC 6186)                           | SRV записи (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME або `_autodiscover._tcp` SRV | Не підтримується                          |
| GNOME (Evolution)  | SRV записи (RFC 6186)                           | SRV записи (RFC 6764)                     |
| KDE (KMail)        | SRV записи (RFC 6186)                           | SRV записи (RFC 6764)                     |
| eM Client          | `autoconfig` або `autodiscover`                   | SRV записи (RFC 6764)                     |

> \[!TIP]
> Для найкращої сумісності з усіма клієнтами рекомендуємо використовувати **Варіант A** (CNAME записи) у поєднанні з SRV записами з **Варіанту B**. Підхід з CNAME сам по собі охоплює більшість поштових клієнтів. SRV записи CalDAV/CardDAV забезпечують автоматичне виявлення налаштувань сервера для клієнтів календарів і контактів.


## Безпека {#security-1}

### Розширені методи захисту сервера {#advanced-server-hardening-techniques}

> \[!TIP]
> Дізнайтеся більше про нашу інфраструктуру безпеки на [нашій сторінці Безпеки](/security).

Forward Email реалізує численні методи захисту сервера для забезпечення безпеки нашої інфраструктури та ваших даних:

1. **Мережева безпека**:
   * Брандмауер iptables зі строгими правилами
   * Fail2ban для захисту від brute force атак
   * Регулярні аудити безпеки та тестування на проникнення
   * Адміністративний доступ лише через VPN

2. **Зміцнення системи**:
   * Мінімальна установка пакетів
   * Регулярні оновлення безпеки
   * SELinux у режимі enforcing
   * Відключений root-доступ через SSH
   * Лише автентифікація на основі ключів

3. **Безпека додатків**:
   * Заголовки Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Заголовки захисту від XSS
   * Заголовки опцій фреймів і політики реферера
   * Регулярні аудити залежностей

4. **Захист даних**:
   * Повне шифрування диска за допомогою LUKS
   * Безпечне управління ключами
   * Регулярні резервні копії з шифруванням
   * Практики мінімізації даних

5. **Моніторинг і реагування**:
   * Виявлення вторгнень у реальному часі
   * Автоматизоване сканування безпеки
   * Централізоване логування та аналіз
   * Процедури реагування на інциденти

> \[!IMPORTANT]
> Наші практики безпеки постійно оновлюються для протидії новим загрозам і вразливостям.

> \[!TIP]
> Для максимальної безпеки рекомендуємо використовувати наш сервіс з наскрізним шифруванням через OpenPGP.

### Чи маєте ви сертифікати SOC 2 або ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email працює на інфраструктурі, що надається сертифікованими субпідрядниками, щоб забезпечити відповідність галузевим стандартам.

Forward Email безпосередньо не має сертифікатів SOC 2 Type II або ISO 27001. Однак сервіс працює на інфраструктурі, що надається сертифікованими субпідрядниками:

* **DigitalOcean**: сертифікований за SOC 2 Type II та SOC 3 Type II (аудит Schellman & Company LLC), сертифікований за ISO 27001 у кількох дата-центрах. Деталі: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: сертифікований за SOC 2+ (HIPAA), сертифікати ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Деталі: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: відповідність SOC 2 (зв’яжіться безпосередньо з DataPacket для отримання сертифікації), провайдер інфраструктури корпоративного рівня (локація Денвер). Деталі: <https://www.datapacket.com/datacenters/denver>

Forward Email дотримується найкращих галузевих практик для аудитів безпеки та регулярно співпрацює з незалежними дослідниками безпеки. Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Чи використовуєте ви TLS-шифрування для пересилання електронної пошти {#do-you-use-tls-encryption-for-email-forwarding}

Так. Forward Email суворо застосовує TLS 1.2+ для всіх з’єднань (HTTPS, SMTP, IMAP, POP3) та впроваджує MTA-STS для покращеної підтримки TLS. Реалізація включає:

* Застосування TLS 1.2+ для всіх поштових з’єднань
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) для обміну ключами з ідеальною прямою секретністю
* Сучасні набори шифрів з регулярними оновленнями безпеки
* Підтримка HTTP/2 для покращення продуктивності та безпеки
* HSTS (HTTP Strict Transport Security) з попереднім завантаженням у основних браузерах
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** для суворого застосування TLS

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Реалізація MTA-STS**: Forward Email реалізує суворе застосування MTA-STS у кодовій базі. Коли виникають помилки TLS і MTA-STS застосовується, система повертає статуси SMTP 421, щоб забезпечити повторну спробу відправлення пізніше, а не доставку пошти без захисту. Деталі реалізації:

* Виявлення помилок TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Застосування MTA-STS у помічнику send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Перевірка сторонніми: <https://www.hardenize.com/report/forwardemail.net/1750312779> показує оцінки "Good" для всіх заходів TLS та транспортної безпеки.

### Чи зберігаєте ви заголовки автентифікації електронної пошти {#do-you-preserve-email-authentication-headers}

Так. Forward Email комплексно реалізує та зберігає заголовки автентифікації електронної пошти:

* **SPF (Sender Policy Framework)**: правильно реалізований та збережений
* **DKIM (DomainKeys Identified Mail)**: повна підтримка з належним управлінням ключами
* **DMARC**: застосування політики для листів, які не проходять перевірку SPF або DKIM
* **ARC**: хоча не описано детально, ідеальні результати відповідності сервісу свідчать про комплексне оброблення заголовків автентифікації

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Перевірка: тест Internet.nl Mail Test показує 100/100 балів саме за реалізацію "SPF, DKIM та DMARC". Оцінка Hardenize підтверджує оцінки "Good" для SPF та DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Чи зберігаєте ви оригінальні заголовки електронної пошти та запобігаєте підробці {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email реалізує складний захист від підробки, щоб запобігти зловживанню електронною поштою.

Forward Email зберігає оригінальні заголовки електронної пошти, одночасно впроваджуючи комплексний захист від підробки через кодову базу MX:

* **Збереження заголовків**: оригінальні заголовки автентифікації зберігаються під час пересилання
* **Захист від підробки**: застосування політики DMARC запобігає підробці заголовків, відхиляючи листи, які не проходять перевірку SPF або DKIM
* **Запобігання ін’єкції заголовків**: валідація та санітизація введення за допомогою бібліотеки striptags
* **Розширений захист**: складне виявлення фішингу з виявленням підробок, запобіганням імітації та системами сповіщення користувачів

**Деталі реалізації MX**: основна логіка обробки пошти реалізована у кодовій базі сервера MX, зокрема:

* Основний обробник даних MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Фільтрація довільної пошти (анти-підробка): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Помічник `isArbitrary` реалізує складні правила захисту від підробки, включно з виявленням імітації домену, заблокованих фраз та різних схем фішингу.
### Як ви захищаєтеся від спаму та зловживань {#how-do-you-protect-against-spam-and-abuse}

Forward Email реалізує комплексний багаторівневий захист:

* **Обмеження швидкості**: Застосовується до спроб автентифікації, API-ендпоінтів та SMTP-з’єднань
* **Ізоляція ресурсів**: Між користувачами для запобігання впливу користувачів з великим обсягом трафіку
* **Захист від DDoS**: Багаторівневий захист через систему Shield від DataPacket та Cloudflare
* **Автоматичне масштабування**: Динамічне регулювання ресурсів залежно від попиту
* **Запобігання зловживанням**: Перевірки на зловживання, специфічні для користувача, та блокування на основі хешів для шкідливого контенту
* **Аутентифікація електронної пошти**: Протоколи SPF, DKIM, DMARC з розширеним виявленням фішингу

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (деталі захисту від DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Чи зберігаєте ви вміст електронної пошти на диску {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email використовує архітектуру з нульовим знанням, яка запобігає запису вмісту електронної пошти на диск.

* **Архітектура з нульовим знанням**: Індивідуально зашифровані поштові скриньки SQLite означають, що Forward Email не має доступу до вмісту електронної пошти
* **Обробка в пам’яті**: Обробка електронної пошти відбувається повністю в пам’яті, уникаючи збереження на диску
* **Відсутність логування вмісту**: "Ми не ведемо журнал і не зберігаємо вміст або метадані електронної пошти на диску"
* **Пісочниця для шифрування**: Ключі шифрування ніколи не зберігаються на диску у відкритому вигляді

**Докази з коду MX**: MX-сервер обробляє електронні листи повністю в пам’яті без запису вмісту на диск. Основний обробник електронної пошти демонструє цей підхід в пам’яті: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Анотація)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Деталі архітектури з нульовим знанням)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Пісочниця для шифрування)

### Чи може вміст електронної пошти бути розкритий під час збоїв системи {#can-email-content-be-exposed-during-system-crashes}

Ні. Forward Email реалізує комплексні заходи безпеки для запобігання розкриттю даних під час збоїв:

* **Відключені дампи пам’яті**: Запобігає витоку пам’яті під час збоїв
* **Відключена swap-пам’ять**: Повністю відключена для запобігання вилученню конфіденційних даних зі swap-файлів
* **Архітектура в пам’яті**: Вміст електронної пошти існує лише у нестійкій пам’яті під час обробки
* **Захист ключів шифрування**: Ключі ніколи не зберігаються на диску у відкритому вигляді
* **Фізична безпека**: Диски, зашифровані LUKS v2, запобігають фізичному доступу до даних
* **Відключене USB-зберігання**: Запобігає несанкціонованому вилученню даних

**Обробка помилок системних проблем**: Forward Email використовує допоміжні функції `isCodeBug` та `isTimeoutError`, щоб гарантувати, що у разі проблем з підключенням до бази даних, проблем з мережею DNS/блоклистом або проблем з підключенням до вищестоячих систем, система повертає статус 421 SMTP, щоб забезпечити повторну спробу відправлення листів пізніше, а не їх втрату чи розкриття.

Деталі реалізації:

* Класифікація помилок: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Обробка помилок таймауту в MX-обробці: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Хто має доступ до вашої інфраструктури електронної пошти {#who-has-access-to-your-email-infrastructure}

Forward Email реалізує комплексний контроль доступу для мінімальної інженерної команди з 2-3 осіб із суворими вимогами 2FA:

* **Контроль доступу на основі ролей**: Для командних акаунтів з дозволами на основі ресурсів
* **Принцип найменших привілеїв**: Застосовується у всіх системах
* **Розподіл обов’язків**: Між операційними ролями
* **Управління користувачами**: Окремі користувачі для розгортання та devops з різними дозволами
* **Відключений root-доступ**: Примушує доступ через належним чином автентифіковані акаунти
* **Суворий 2FA**: Без SMS-2FA через ризик атак MiTM — лише додатки або апаратні токени
* **Комплексне журналювання аудиту**: З редагуванням конфіденційних даних
* **Автоматичне виявлення аномалій**: Для незвичних патернів доступу
* **Регулярні огляди безпеки**: Логів доступу
* **Запобігання атакам Evil Maid**: Відключене USB-зберігання та інші заходи фізичної безпеки
Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Контроль авторизації)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Мережева безпека)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Запобігання атаці «злий покоївка»)

### Яких провайдерів інфраструктури ви використовуєте {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email використовує кількох субпідрядників інфраструктури з комплексними сертифікатами відповідності.

Повні деталі доступні на нашій сторінці відповідності GDPR: <https://forwardemail.net/gdpr>

**Основні субпідрядники інфраструктури:**

| Провайдер        | Сертифікат відповідності рамкам захисту даних | Сторінка відповідності GDPR                                                               |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Так                                        | <https://www.cloudflare.com/trust-hub/gdpr/>                                             |
| **DataPacket**   | ❌ Ні                                         | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean** | ❌ Ні                                         | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**       | ✅ Так                                        | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Ні                                         | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Детальні сертифікати:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (аудит проведено Schellman & Company LLC)
* Сертифікат ISO 27001 у кількох дата-центрах
* Відповідність PCI-DSS
* Сертифікат CSA STAR рівня 1
* Сертифікат APEC CBPR PRP
* Деталі: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Сертифікат SOC 2+ (HIPAA)
* Відповідність PCI Merchant
* Сертифікат CSA STAR рівня 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Деталі: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Відповідність SOC 2 (зв’яжіться безпосередньо з DataPacket для отримання сертифікату)
* Інфраструктура корпоративного рівня (локація Денвер)
* Захист від DDoS через стек кібербезпеки Shield
* Технічна підтримка 24/7
* Глобальна мережа з 58 дата-центрів
* Деталі: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Сертифікат Data Privacy Framework (EU-U.S., Swiss-U.S. та UK Extension)
* Хостинг вихідного коду, CI/CD та управління проєктами
* Доступна Угода про захист даних GitHub
* Деталі: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Платіжні процесори:**

* **Stripe**: Сертифікат Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Не сертифікований DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Чи пропонуєте ви Угоду про обробку даних (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Так, Forward Email пропонує комплексну Угоду про обробку даних (DPA), яку можна підписати разом з нашим корпоративним договором. Копія нашої DPA доступна за адресою: <https://forwardemail.net/dpa>

**Деталі DPA:**

* Охоплює відповідність GDPR та рамки EU-US/Swiss-US Privacy Shield
* Автоматично приймається при погодженні з нашими Умовами обслуговування
* Для стандартної DPA окремий підпис не потрібен
* Індивідуальні умови DPA доступні через корпоративну ліцензію

**Рамки відповідності GDPR:**
Наша DPA описує відповідність GDPR, а також вимоги щодо міжнародної передачі даних. Повна інформація доступна за адресою: <https://forwardemail.net/gdpr>

Для корпоративних клієнтів, які потребують індивідуальних умов DPA або специфічних договірних домовленостей, це можна вирішити через нашу програму **Enterprise License ($250/місяць)**.

### Як ви обробляєте повідомлення про витік даних {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Архітектура Forward Email з нульовим знанням суттєво обмежує вплив витоку.
* **Обмежене розкриття даних**: Не має доступу до зашифрованого вмісту електронної пошти через архітектуру з нульовим знанням
* **Мінімальний збір даних**: Лише базова інформація про підписників та обмежені журнали IP для безпеки
* **Рамки субпідрядників**: DigitalOcean, GitHub та Vultr підтримують процедури реагування на інциденти, що відповідають GDPR

**Інформація про представника GDPR:**
Forward Email призначив представників GDPR відповідно до статті 27:

**Представник у ЄС:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Представник у Великій Британії:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Для корпоративних клієнтів, які потребують конкретних SLA щодо повідомлення про порушення, це слід обговорювати в рамках угоди про **Enterprise License**.

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Чи пропонуєте ви тестове середовище {#do-you-offer-a-test-environment}

Технічна документація Forward Email не описує явно виділений режим пісочниці. Однак потенційні підходи до тестування включають:

* **Опція самостійного розгортання**: Повний функціонал для створення тестових середовищ
* **API-інтерфейс**: Можливість програмного тестування конфігурацій
* **Відкритий код**: 100% відкритий код дозволяє клієнтам досліджувати логіку пересилання
* **Підтримка кількох доменів**: Можливість створення тестових доменів

Для корпоративних клієнтів, які потребують формальних можливостей пісочниці, це слід обговорювати в рамках угоди про **Enterprise License**.

Джерело: <https://github.com/forwardemail/forwardemail.net> (деталі середовища розробки)

### Чи надаєте ви інструменти моніторингу та оповіщення {#do-you-provide-monitoring-and-alerting-tools}

Forward Email надає моніторинг у реальному часі з деякими обмеженнями:

**Доступно:**

* **Моніторинг доставки в реальному часі**: Публічно доступні показники продуктивності для основних поштових провайдерів
* **Автоматичне оповіщення**: Інженерна команда отримує сповіщення, якщо час доставки перевищує 10 секунд
* **Прозорий моніторинг**: 100% відкриті системи моніторингу
* **Моніторинг інфраструктури**: Автоматичне виявлення аномалій та комплексне ведення аудиту

**Обмеження:**

* Вебхуки для клієнтів або повідомлення про статус доставки через API не документовані явно

Для корпоративних клієнтів, які потребують детальних вебхуків статусу доставки або індивідуальних інтеграцій моніторингу, ці можливості можуть бути доступні через угоди **Enterprise License**.

Джерела:

* <https://forwardemail.net> (відображення моніторингу в реальному часі)
* <https://github.com/forwardemail/forwardemail.net> (реалізація моніторингу)

### Як ви забезпечуєте високу доступність {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email реалізує комплексну надлишковість через кількох провайдерів інфраструктури.

* **Розподілена інфраструктура**: Кілька провайдерів (DigitalOcean, Vultr, DataPacket) у різних географічних регіонах
* **Географічне балансування навантаження**: Балансування навантаження на основі геолокації через Cloudflare з автоматичним переключенням
* **Автоматичне масштабування**: Динамічне регулювання ресурсів залежно від попиту
* **Багаторівневий захист від DDoS**: Через систему Shield від DataPacket та Cloudflare
* **Надлишковість серверів**: Кілька серверів у кожному регіоні з автоматичним переключенням
* **Реплікація баз даних**: Синхронізація даних у реальному часі між кількома локаціями
* **Моніторинг та оповіщення**: Цілодобовий моніторинг з автоматичним реагуванням на інциденти

**Гарантія часу безвідмовної роботи**: понад 99,9% доступності сервісу з прозорим моніторингом на <https://forwardemail.net>

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Чи відповідаєте ви розділу 889 Закону про національну оборону (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email повністю відповідає розділу 889 завдяки ретельному вибору партнерів інфраструктури.

Так, Forward Email є **відповідним розділу 889**. Розділ 889 Закону про національну оборону (NDAA) забороняє урядовим установам використовувати або укладати контракти з організаціями, які використовують телекомунікаційне та відеоспостережне обладнання від конкретних компаній (Huawei, ZTE, Hikvision, Dahua та Hytera).
**Як Forward Email досягає відповідності Розділу 889:**

Forward Email покладається виключно на двох ключових постачальників інфраструктури, жоден з яких не використовує обладнання, заборонене Розділом 889:

1. **Cloudflare**: Наш основний партнер з мережевих послуг та безпеки електронної пошти
2. **DataPacket**: Наш основний постачальник серверної інфраструктури (використовує виключно обладнання Arista Networks та Cisco)
3. **Резервні постачальники**: Наші резервні постачальники Digital Ocean та Vultr додатково підтверджені письмово як такі, що відповідають Розділу 889.

**Зобов’язання Cloudflare**: Cloudflare чітко зазначає у своєму Кодексі поведінки третіх сторін, що вони не використовують телекомунікаційне обладнання, продукти відеоспостереження або послуги від будь-яких суб’єктів, заборонених Розділом 889.

**Використання урядом**: Наша відповідність Розділу 889 була підтверджена, коли **Військово-морська академія США** обрала Forward Email для своїх потреб у безпечному пересиланні електронної пошти, вимагаючи документації наших федеральних стандартів відповідності.

Для повної інформації про нашу рамкову систему відповідності урядовим вимогам, включно з ширшими федеральними регуляціями, прочитайте наше комплексне дослідження: [Федеральний урядовий сервіс електронної пошти, що відповідає Розділу 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Системні та технічні деталі {#system-and-technical-details}

### Чи зберігаєте ви електронні листи та їхній вміст {#do-you-store-emails-and-their-contents}

Ні, ми не записуємо на диск і не зберігаємо логи – за [винятком помилок](#do-you-store-error-logs) та [вихідного SMTP](#do-you-support-sending-email-with-smtp) (див. нашу [Політику конфіденційності](/privacy)).

Усе виконується в пам’яті, а [наш вихідний код розміщено на GitHub](https://github.com/forwardemail).

### Як працює ваша система пересилання електронної пошти {#how-does-your-email-forwarding-system-work}

Електронна пошта базується на [протоколі SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Цей протокол складається з команд, що надсилаються серверу (найчастіше на порт 25). Спочатку встановлюється з’єднання, потім відправник вказує, звідки надходить лист ("MAIL FROM"), далі – куди він надсилається ("RCPT TO"), і нарешті – заголовки та тіло самого листа ("DATA"). Потік нашої системи пересилання електронної пошти описано відносно кожної команди протоколу SMTP нижче:

* Початкове з’єднання (без назви команди, наприклад `telnet example.com 25`) – це початкове з’єднання. Ми перевіряємо відправників, яких немає у нашому [білому списку](#do-you-have-an-allowlist), за допомогою нашого [чорного списку](#do-you-have-a-denylist). Нарешті, якщо відправника немає у білому списку, ми перевіряємо, чи він не перебуває у [сірому списку](#do-you-have-a-greylist).

* `HELO` – це привітання для ідентифікації повного доменного імені відправника, IP-адреси або імені поштового обробника. Це значення можна підробити, тому ми не покладаємося на ці дані, а натомість використовуємо зворотний пошук імені хоста за IP-адресою з’єднання.

* `MAIL FROM` – це вказує адресу відправника у конверті листа. Якщо вказано значення, воно має бути дійсною електронною адресою за RFC 5322. Порожні значення дозволені. Тут ми [перевіряємо на backscatter](#how-do-you-protect-against-backscatter) і також перевіряємо MAIL FROM за нашим [чорним списком](#do-you-have-a-denylist). Нарешті, ми перевіряємо відправників, яких немає у білому списку, на обмеження швидкості (див. розділ про [обмеження швидкості](#do-you-have-rate-limiting) та [білий список](#do-you-have-an-allowlist) для детальнішої інформації).

* `RCPT TO` – це вказує одержувача(ів) листа. Вони мають бути дійсними електронними адресами за RFC 5322. Ми дозволяємо максимум до 50 одержувачів у конверті на повідомлення (це відрізняється від заголовка "To" у листі). Також ми перевіряємо дійсність адреси за [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") для захисту від підробки з використанням нашого доменного імені SRS.

* `DATA` – це основна частина нашої служби, яка обробляє лист. Детальніше дивіться у розділі [Як ви обробляєте лист для пересилання](#how-do-you-process-an-email-for-forwarding) нижче.
### Як ви обробляєте електронний лист для пересилання {#how-do-you-process-an-email-for-forwarding}

У цьому розділі описується наш процес, пов’язаний із командою протоколу SMTP `DATA` у розділі [Як працює ваша система пересилання електронної пошти](#how-does-your-email-forwarding-system-work) вище – це те, як ми обробляємо заголовки листа, тіло, безпеку, визначаємо, куди його потрібно доставити, і як ми керуємо з’єднаннями.

1. Якщо повідомлення перевищує максимальний розмір 50 МБ, воно відхиляється з кодом помилки 552.

2. Якщо повідомлення не містить заголовка "From", або якщо будь-яке зі значень у заголовку "From" не є дійсною електронною адресою за стандартом RFC 5322, воно відхиляється з кодом помилки 550.

3. Якщо повідомлення містить більше 25 заголовків "Received", вважається, що воно застрягло в циклі перенаправлення, і його відхиляють з кодом помилки 550.

4. Використовуючи відбиток електронної пошти (див. розділ про [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), ми перевіряємо, чи повідомлення намагалися повторно доставити більше 5 днів (що відповідає [стандартній поведінці postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), і якщо так, то його відхиляють з кодом помилки 550.

5. Ми зберігаємо в пам’яті результати сканування листа за допомогою [Spam Scanner](https://spamscanner.net).

6. Якщо були будь-які довільні результати від Spam Scanner, повідомлення відхиляється з кодом помилки 554. Довільні результати на момент написання включають лише тест GTUBE. Детальніше див. <https://spamassassin.apache.org/gtube/>.

7. Ми додаємо до повідомлення такі заголовки для налагодження та запобігання зловживанням:

   * `Received` – додаємо цей стандартний заголовок Received з IP-адресою та хостом походження, типом передачі, інформацією про TLS-з’єднання, датою/часом і отримувачем.
   * `X-Original-To` – оригінальний отримувач повідомлення:
     * Це корисно для визначення, куди спочатку було доставлено лист (крім заголовка "Received").
     * Додається для кожного отримувача під час IMAP і/або маскованого пересилання (для захисту конфіденційності).
   * `X-Forward-Email-Website` – містить посилання на наш вебсайт <https://forwardemail.net>
   * `X-Forward-Email-Version` – поточна версія [SemVer](https://semver.org/) з `package.json` нашої кодової бази.
   * `X-Forward-Email-Session-ID` – ідентифікатор сесії для налагодження (застосовується лише в непроизводчих середовищах).
   * `X-Forward-Email-Sender` – список через кому, що містить оригінальну адресу MAIL FROM конверта (якщо вона не порожня), зворотній PTR FQDN клієнта (якщо існує) та IP-адресу відправника.
   * `X-Forward-Email-ID` – застосовується лише для вихідного SMTP і відповідає ідентифікатору листа, збереженому в Моїй обліковці → Листи
   * `X-Report-Abuse` – зі значенням `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – зі значенням `abuse@forwardemail.net`.
   * `X-Complaints-To` – зі значенням `abuse@forwardemail.net`.

8. Потім ми перевіряємо повідомлення на [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) та [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Якщо повідомлення не пройшло DMARC і домен мав політику відхилення (наприклад, `p=reject` [у політиці DMARC](https://wikipedia.org/wiki/DMARC)), воно відхиляється з кодом помилки 550. Зазвичай політику DMARC для домену можна знайти в TXT-записі піддомену `_dmarc` (наприклад, `dig _dmarc.example.com txt`).
   * Якщо повідомлення не пройшло SPF і домен мав жорстку політику відхилення (наприклад, `-all` у політиці SPF на відміну від `~all` або відсутності політики), воно відхиляється з кодом помилки 550. Зазвичай політику SPF для домену можна знайти в TXT-записі кореневого домену (наприклад, `dig example.com txt`). Детальніше див. у розділі про [відправлення пошти як у Gmail](#can-i-send-mail-as-in-gmail-with-this) щодо SPF.
9. Тепер ми обробляємо отримувачів повідомлення, зібраних із команди `RCPT TO` у розділі [Як працює ваша система переадресації електронної пошти](#how-does-your-email-forwarding-system-work) вище. Для кожного отримувача ми виконуємо наступні операції:

   * Ми виконуємо пошук записів <strong class="notranslate">TXT</strong> доменного імені (частина після символу `@`, наприклад `example.com`, якщо електронна адреса була `test@example.com`). Наприклад, якщо домен `example.com`, ми робимо DNS-запит, такий як `dig example.com txt`.
   * Ми аналізуємо всі записи <strong class="notranslate">TXT</strong>, які починаються з `forward-email=` (безкоштовні плани) або `forward-email-site-verification=` (платні плани). Зверніть увагу, що ми аналізуємо обидва, щоб обробляти електронні листи під час оновлення або пониження планів користувачем.
   * З цих проаналізованих записів <strong class="notranslate">TXT</strong> ми ітеруємося, щоб витягти конфігурацію переадресації (як описано в розділі [Як почати та налаштувати переадресацію електронної пошти](#how-do-i-get-started-and-set-up-email-forwarding) вище). Зверніть увагу, що ми підтримуємо лише одне значення `forward-email-site-verification=`, і якщо їх більше одного, виникне помилка 550, і відправник отримає відмову для цього отримувача.
   * Рекурсивно ми ітеруємося по витягнутій конфігурації переадресації, щоб визначити глобальну переадресацію, переадресацію на основі регулярних виразів та всі інші підтримувані конфігурації переадресації – які тепер відомі як наші "Адреси переадресації".
   * Для кожної Адреси переадресації ми підтримуємо один рекурсивний пошук (який розпочне цей цикл операцій заново для заданої адреси). Якщо знайдено рекурсивне співпадіння, то батьківський результат буде видалено з Адрес переадресації, а дочірні додано.
   * Адреси переадресації аналізуються на унікальність (оскільки ми не хочемо надсилати дублікати на одну адресу або створювати додаткові непотрібні SMTP-з’єднання).
   * Для кожної Адреси переадресації ми виконуємо пошук доменного імені через наш API-ендпоінт `/v1/max-forwarded-addresses` (щоб визначити, скільки адрес домен дозволяє переадресовувати електронну пошту на один псевдонім, наприклад, за замовчуванням 10 – див. розділ про [максимальний ліміт переадресації на псевдонім](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Якщо цей ліміт перевищено, виникне помилка 550, і відправник отримає відмову для цього отримувача.
   * Ми виконуємо пошук налаштувань оригінального отримувача через наш API-ендпоінт `/v1/settings`, який підтримує пошук для платних користувачів (з резервним варіантом для безкоштовних користувачів). Це повертає об’єкт конфігурації для розширених налаштувань `port` (Число, наприклад `25`), `has_adult_content_protection` (Булеве), `has_phishing_protection` (Булеве), `has_executable_protection` (Булеве) та `has_virus_protection` (Булеве).
   * На основі цих налаштувань ми перевіряємо результати Спам-сканера, і якщо виникають будь-які помилки, повідомлення відхиляється з кодом помилки 554 (наприклад, якщо увімкнено `has_virus_protection`, ми перевіряємо результати Спам-сканера на віруси). Зверніть увагу, що всі користувачі безкоштовного плану автоматично підписані на перевірки на дорослий контент, фішинг, виконувані файли та віруси. За замовчуванням усі користувачі платних планів також підписані, але цю конфігурацію можна змінити на сторінці Налаштувань домену в панелі Forward Email).

10. Для кожної обробленої Адреси переадресації отримувача ми виконуємо наступні операції:

    * Адреса перевіряється за нашим [denylist](#do-you-have-a-denylist), і якщо вона є у списку, виникає помилка 421 (вказує відправнику спробувати пізніше).
    * Якщо адреса є вебхуком, ми встановлюємо булеве значення для майбутніх операцій (див. нижче – ми групуємо подібні вебхуки, щоб зробити один POST-запит замість кількох для доставки).
    * Якщо адреса є електронною поштою, ми аналізуємо хост для майбутніх операцій (див. нижче – ми групуємо подібні хости, щоб встановити одне з’єднання замість кількох індивідуальних для доставки).
11. Якщо немає одержувачів і немає відмов у доставці, тоді ми відповідаємо помилкою 550 з повідомленням "Неправильні одержувачі".

12. Якщо є одержувачі, тоді ми ітеруємо їх (групуючи за одним і тим самим хостом) і доставляємо листи. Дивіться розділ [Як ви обробляєте проблеми з доставкою електронної пошти](#how-do-you-handle-email-delivery-issues) нижче для більш детальної інформації.

    * Якщо під час відправлення листів виникають помилки, ми збережемо їх у пам’яті для подальшої обробки.
    * Ми візьмемо найнижчий код помилки (якщо він є) з відправлених листів – і використаємо його як код відповіді на команду `DATA`. Це означає, що листи, які не були доставлені, зазвичай будуть повторно надіслані оригінальним відправником, а листи, які вже були доставлені, не будуть повторно відправлені наступного разу (оскільки ми використовуємо [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Якщо помилок не було, ми надішлемо код успішної відповіді SMTP 250.
    * Відмовою вважається будь-яка спроба доставки, що призводить до статусу з кодом >= 500 (постійні помилки).

13. Якщо відмов не було (постійних помилок), ми повернемо код відповіді SMTP з найнижчим кодом помилки серед непостійних помилок (або 250, якщо їх не було).

14. Якщо відмови були, ми надішлемо листи про відмову у фоновому режимі після повернення найнижчого з усіх кодів помилок відправнику. Однак, якщо найнижчий код помилки >= 500, ми не надсилаємо листи про відмову. Це тому, що в іншому випадку відправники отримали б подвійний лист про відмову (наприклад, один від їхнього вихідного MTA, такого як Gmail, і ще один від нас). Дивіться розділ [Як ви захищаєтеся від backscatter](#how-do-you-protect-against-backscatter) нижче для більш детальної інформації.

### Як ви обробляєте проблеми з доставкою електронної пошти {#how-do-you-handle-email-delivery-issues}

Зверніть увагу, що ми виконуємо переписування "Friendly-From" у листах лише якщо політика DMARC відправника не проходить перевірку І немає підписів DKIM, які збігаються з заголовком "From". Це означає, що ми змінюємо заголовок "From" у повідомленні, встановлюємо "X-Original-From", а також встановлюємо "Reply-To", якщо він раніше не був встановлений. Після зміни цих заголовків ми також повторно підписуємо печатку ARC у повідомленні.

Ми також використовуємо розумний парсинг повідомлень про помилки на кожному рівні нашого стеку – у нашому коді, DNS-запитах, внутрішніх механізмах Node.js, HTTP-запитах (наприклад, 408, 413 і 429 відображаються у відповідь SMTP з кодом 421, якщо одержувач є webhook), а також у відповідях поштових серверів (наприклад, відповіді з "defer" або "slowdown" будуть повторно оброблені як помилки 421).

Наша логіка проста і надійна, вона також повторно намагається при помилках SSL/TLS, проблемах з підключенням та інших. Мета такої надійності – максимізувати доставку листів усім одержувачам у конфігурації пересилання.

Якщо одержувач є webhook, ми дозволяємо таймаут у 60 секунд для завершення запиту з до 3 повторними спробами (всього 4 запити перед відмовою). Зверніть увагу, що ми коректно парсимо коди помилок 408, 413 і 429 і відображаємо їх у відповідь SMTP з кодом 421.

Якщо одержувач – це електронна адреса, ми намагаємося надіслати лист з опортуністичним TLS (ми намагаємося використовувати STARTTLS, якщо він доступний на поштовому сервері одержувача). Якщо під час спроби відправлення виникає помилка SSL/TLS, ми намагаємося надіслати лист без TLS (без використання STARTTLS).

Якщо виникають помилки DNS або підключення, ми повертаємо команді `DATA` код відповіді SMTP 421, інакше, якщо є помилки рівня >= 500, будуть надіслані листи про відмову.

Якщо ми виявляємо, що поштовий сервер, до якого намагаємося доставити лист, заблокував одну або кілька наших IP-адрес поштових серверів (наприклад, за допомогою технології, яку вони використовують для відкладення спамерів), ми надсилаємо код відповіді SMTP 421, щоб відправник міг повторити спробу пізніше (і ми отримуємо сповіщення про проблему, щоб спробувати її вирішити до наступної спроби).

### Як ви обробляєте блокування ваших IP-адрес {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Ми регулярно моніторимо всі основні DNS-чорні списки, і якщо будь-яка з наших IP-адрес поштових обмінників ("MX") потрапляє до великого чорного списку, ми, за можливості, вилучаємо її з відповідного DNS A запису кругового розподілу, доки проблема не буде вирішена.

На момент написання цього тексту ми також внесені до кількох DNS-білих списків і серйозно ставимося до моніторингу чорних списків. Якщо ви помітите будь-які проблеми до того, як ми встигнемо їх вирішити, будь ласка, повідомте нас письмово на <support@forwardemail.net>.

Наші IP-адреси є публічно доступними, [дивіться цей розділ нижче для більш детальної інформації](#what-are-your-servers-ip-addresses).

### Що таке адреси постмастера {#what-are-postmaster-addresses}

Щоб запобігти неправильним відмовам і надсиланню повідомлень автоответчика на невідстежувані або неіснуючі поштові скриньки, ми підтримуємо список імен користувачів, схожих на mailer-daemon:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [та будь-яка адреса no-reply](#what-are-no-reply-addresses)

Дивіться [RFC 5320 Розділ 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) для більш детального розуміння того, як такі списки використовуються для створення ефективних поштових систем.

### Що таке адреси no-reply {#what-are-no-reply-addresses}

Імена користувачів електронної пошти, що співпадають з будь-яким із наступних (без урахування регістру), вважаються адресами no-reply:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Цей список підтримується [як проект з відкритим кодом на GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Які IP-адреси ваших серверів {#what-are-your-servers-ip-addresses}

Ми публікуємо наші IP-адреси на <https://forwardemail.net/ips>.

### Чи маєте ви білий список {#do-you-have-an-allowlist}

Так, у нас є [список розширень доменних імен](#what-domain-name-extensions-are-allowlisted-by-default), які за замовчуванням внесені до білого списку, а також динамічний, кешований і оновлюваний білий список, що базується на [жорстких критеріях](#what-is-your-allowlist-criteria).

Всі домени, електронні адреси та IP-адреси, які використовують платні клієнти, автоматично перевіряються за нашим чорним списком щогодини – що сповіщає адміністраторів, які можуть вручну втрутитися за потреби.

Крім того, якщо один із ваших доменів або його електронні адреси потрапляють до чорного списку (наприклад, через розсилку спаму, вірусів або через атаки з імітацією) – адміністратори домену (ви) та наші адміністратори команди будуть негайно повідомлені електронною поштою. Ми настійно рекомендуємо вам [налаштувати DMARC](#how-do-i-set-up-dmarc-for-forward-email), щоб запобігти цьому.

### Які розширення доменних імен за замовчуванням внесені до білого списку {#what-domain-name-extensions-are-allowlisted-by-default}

Наступні розширення доменних імен вважаються внесеними до білого списку за замовчуванням (незалежно від того, чи входять вони до списку популярності Umbrella чи ні):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
Крім того, ці [брендові та корпоративні домени верхнього рівня](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) за замовчуванням внесені до білого списку (наприклад, `apple` для `applecard.apple` для банківських виписок Apple Card):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
Станом на 18 березня 2025 року ми також додали ці французькі заморські території до цього списку ([згідно з цим запитом на GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Станом на 8 липня 2025 року ми додали ці країни, специфічні для Європи:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

У жовтні 2025 року ми також додали <code class="notranslate">cz</code> (Чеська Республіка) через попит.

Ми спеціально не включали `ru` та `ua` через високу активність спаму.

### Які ваші критерії для білого списку {#what-is-your-allowlist-criteria}

У нас є статичний список [доменних розширень, які за замовчуванням дозволені](#what-domain-name-extensions-are-allowlisted-by-default) – а також ми підтримуємо динамічний, кешований, оновлюваний білий список на основі наступних суворих критеріїв:

* Кореневий домен відправника повинен бути з [доменного розширення, яке відповідає списку, який ми пропонуємо у нашому безкоштовному плані](#what-domain-name-extensions-can-be-used-for-free) (з додаванням `biz` та `info`). Ми також включаємо часткові збіги `edu`, `gov` та `mil`, такі як `xyz.gov.au` та `xyz.edu.au`.
* Кореневий домен відправника повинен входити до топ 100 000 унікальних кореневих доменів за результатами парсингу зі списку популярності [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Кореневий домен відправника повинен входити до топ 50 000 результатів серед унікальних кореневих доменів, які з’являлися принаймні у 4 з останніх 7 днів UPL (~50%+).
* Кореневий домен відправника не повинен бути [категоризований](https://radar.cloudflare.com/categorization-feedback/) як дорослий контент або шкідливе ПЗ за версією Cloudflare.
* Кореневий домен відправника повинен мати налаштовані записи A або MX.
* Кореневий домен відправника повинен мати або записи A, або записи MX, або DMARC запис з `p=reject` чи `p=quarantine`, або SPF запис з кваліфікатором `-all` чи `~all`.

Якщо ці критерії виконані, кореневий домен відправника кешується на 7 днів. Зверніть увагу, що наш автоматизований процес запускається щодня – тому це оновлюваний кеш білого списку, який оновлюється щодня.

Наш автоматизований процес завантажує останні 7 днів UPL у пам’ять, розпаковує їх і парсить у пам’яті відповідно до вищезазначених суворих критеріїв.

Популярні домени на момент написання, такі як Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify та інші – звичайно включені.
Якщо ви відправник, якого немає у нашому списку дозволених, то вперше, коли ваш кореневий домен FQDN або IP-адреса надсилає електронного листа, ви будете [обмежені за швидкістю](#do-you-have-rate-limiting) та [потрапите до сірої зони](#do-you-have-a-greylist). Зверніть увагу, що це стандартна практика, прийнята як стандарт електронної пошти. Більшість клієнтів поштових серверів спробують повторити відправлення, якщо отримають помилку обмеження швидкості або сірої зони (наприклад, код стану помилки 421 або рівня 4xx).

**Зверніть увагу, що конкретні відправники, такі як `a@gmail.com`, `b@xyz.edu` та `c@gov.au`, все одно можуть бути [заблоковані](#do-you-have-a-denylist)** (наприклад, якщо ми автоматично виявимо спам, фішинг або шкідливе ПЗ від цих відправників).

### Які розширення доменних імен можна використовувати безкоштовно {#what-domain-name-extensions-can-be-used-for-free}

Станом на 31 березня 2023 року ми ввели нове загальне правило проти спаму для захисту наших користувачів та сервісу.

Це нове правило дозволяє використовувати на нашому безкоштовному плані лише наступні розширення доменних імен:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Чи маєте ви сіру листу {#do-you-have-a-greylist}

Так, у нас використовується дуже лояльна політика [сірого листування електронної пошти](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Сіре листування застосовується лише до відправників, які не знаходяться у нашому білому списку, і зберігається в нашому кеші протягом 30 днів.

Для будь-якого нового відправника ми зберігаємо ключ у нашій базі даних Redis на 30 днів зі значенням, встановленим на час першого надходження їхнього запиту. Потім ми відхиляємо їхній лист із кодом статусу повторної спроби 450 і дозволяємо його пройти лише після того, як мине 5 хвилин.

Якщо вони успішно чекали 5 хвилин від часу першого надходження, їхні листи будуть прийняті, і вони не отримають цей код статусу 450.

Ключ складається або з повного доменного імені (FQDN) кореневого домену, або з IP-адреси відправника. Це означає, що будь-який піддомен, який проходить сіре листування, також пройде для кореневого домену, і навпаки (це те, що ми маємо на увазі під "дуже лояльною" політикою).

Наприклад, якщо лист надходить від `test.example.com` раніше, ніж ми побачимо лист від `example.com`, тоді будь-який лист від `test.example.com` та/або `example.com` повинен чекати 5 хвилин від часу першого надходження з'єднання. Ми не змушуємо і `test.example.com`, і `example.com` чекати кожен свої власні 5 хвилин (наша політика сірого листування застосовується на рівні кореневого домену).

Зверніть увагу, що сіре листування не застосовується до жодного відправника з нашого [білого списку](#do-you-have-an-allowlist) (наприклад, Meta, Amazon, Netflix, Google, Microsoft на момент написання цього тексту).

### Чи маєте ви чорний список {#do-you-have-a-denylist}

Так, ми керуємо власним чорним списком і оновлюємо його автоматично в режимі реального часу та вручну на основі виявленої спам- та шкідливої активності.

Ми також завантажуємо всі IP-адреси з чорного списку UCEPROTECT Level 1 за адресою <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> щогодини і додаємо їх до нашого чорного списку з терміном дії 7 днів.

Відправники, які знаходяться в чорному списку, отримають код помилки 421 (що вказує відправнику повторити спробу пізніше), якщо вони [не знаходяться у білому списку](#do-you-have-an-allowlist).

Використання коду статусу 421 замість 554 дозволяє зменшити кількість потенційних хибних спрацьовувань у реальному часі, і тоді повідомлення може бути успішно доставлене при наступній спробі.

**Це спроектовано інакше, ніж у інших поштових сервісах**, де при потраплянні до чорного списку відбувається жорстка і постійна відмова. Часто важко попросити відправників повторити спробу (особливо великі організації), тому цей підхід дає приблизно 5 днів від початкової спроби відправлення для того, щоб відправник, отримувач або ми могли втрутитися і вирішити проблему (наприклад, запросивши видалення з чорного списку).

Всі запити на видалення з чорного списку контролюються адміністраторами в режимі реального часу (наприклад, щоб повторювані хибні спрацьовування могли бути назавжди додані до білого списку адміністраторами).

Запити на видалення з чорного списку можна подавати за адресою <https://forwardemail.net/denylist>. Платні користувачі отримують миттєву обробку своїх запитів, тоді як неплатні користувачі повинні чекати, поки адміністратори опрацюють їхній запит.

Відправники, які виявлені як такі, що надсилають спам або вірусний контент, будуть додані до чорного списку за наступною процедурою:

1. [Початковий відбиток повідомлення](#how-do-you-determine-an-email-fingerprint) потрапляє до сірого списку при виявленні спаму або блокування від "довіреного" відправника (наприклад, `gmail.com`, `microsoft.com`, `apple.com`).
   * Якщо відправник був у білому списку, повідомлення потрапляє до сірого списку на 1 годину.
   * Якщо відправник не у білому списку, повідомлення потрапляє до сірого списку на 6 годин.
2. Ми аналізуємо ключі чорного списку з інформації про відправника та повідомлення, і для кожного з цих ключів створюємо (якщо він ще не існує) лічильник, збільшуємо його на 1 і кешуємо на 24 години.
   * Для відправників з білого списку:
     * Додаємо ключ для електронної адреси в конверті "MAIL FROM", якщо вона пройшла SPF або SPF відсутній, і якщо це не [адреса постмастера](#what-are-postmaster-addresses) або [адреса no-reply](#what-are-no-reply-addresses).
     * Якщо заголовок "From" був у білому списку, додаємо ключ для електронної адреси в заголовку "From", якщо вона пройшла SPF або пройшла і вирівняна DKIM.
     * Якщо заголовок "From" не був у білому списку, додаємо ключ для електронної адреси в заголовку "From" та її кореневого доменного імені.
   * Для відправників, які не у білому списку:
     * Додаємо ключ для електронної адреси в конверті "MAIL FROM", якщо вона пройшла SPF.
     * Якщо заголовок "From" був у білому списку, додаємо ключ для електронної адреси в заголовку "From", якщо вона пройшла SPF або пройшла і вирівняна DKIM.
     * Якщо заголовок "From" не був у білому списку, додаємо ключ для електронної адреси в заголовку "From" та її кореневого доменного імені.
     * Додаємо ключ для віддаленої IP-адреси відправника.
     * Додаємо ключ для імені хоста клієнта, визначеного за допомогою зворотного пошуку IP-адреси відправника (якщо є).
     * Додаємо ключ для кореневого домену імені хоста клієнта (якщо є і якщо він відрізняється від імені хоста клієнта).
3. Якщо лічильник досягає 5 для відправника та ключа, які не у білому списку, ми додаємо ключ до чорного списку на 30 днів і надсилаємо лист нашій команді зловживань. Ці числа можуть змінюватися, і оновлення будуть відображені тут у міру моніторингу зловживань.
4. Якщо лічильник досягає 10 для відправника та ключа з білого списку, ми додаємо ключ до чорного списку на 7 днів і надсилаємо лист нашій команді зловживань. Ці числа можуть змінюватися, і оновлення будуть відображені тут у міру моніторингу зловживань.
> **ПРИМІТКА:** У найближчому майбутньому ми впровадимо моніторинг репутації. Моніторинг репутації замість примітивного лічильника, як зазначено вище, буде обчислювати, коли відмовляти у доставці відправнику на основі порогового відсотка.

### Чи є у вас обмеження швидкості {#do-you-have-rate-limiting}

Обмеження швидкості відправника здійснюється або за кореневим доменом, отриманим із зворотного PTR-запиту за IP-адресою відправника, або, якщо це не дає результату, то просто за IP-адресою відправника. Зверніть увагу, що нижче ми називаємо це `Sender`.

Наші MX-сервери мають щоденні ліміти на вхідну пошту, отриману для [зашифрованого IMAP-зберігання](/blog/docs/best-quantum-safe-encrypted-email-service):

* Замість обмеження швидкості вхідної пошти на рівні окремого псевдоніма (наприклад, `you@yourdomain.com`) – ми обмежуємо швидкість за доменним ім’ям псевдоніма (наприклад, `yourdomain.com`). Це запобігає тому, щоб `Senders` одночасно засмічували поштові скриньки всіх псевдонімів вашого домену.
* У нас є загальні ліміти, які застосовуються до всіх `Senders` у нашому сервісі незалежно від отримувача:
  * `Senders`, яких ми вважаємо "надійними" джерелами (наприклад, `gmail.com`, `microsoft.com`, `apple.com`), обмежені надсиланням 100 ГБ на день.
  * `Senders`, які є в [білому списку](#do-you-have-an-allowlist), обмежені надсиланням 10 ГБ на день.
  * Всі інші `Senders` обмежені надсиланням 1 ГБ і/або 1000 повідомлень на день.
* Ми маємо конкретний ліміт на `Sender` і `yourdomain.com` у розмірі 1 ГБ і/або 1000 повідомлень щодня.

MX-сервери також обмежують кількість повідомлень, що пересилаються одному або кільком отримувачам, через обмеження швидкості – але це стосується лише `Senders`, які не знаходяться в [білому списку](#do-you-have-an-allowlist):

* Ми дозволяємо не більше 100 з’єднань на годину на кожен кореневий домен FQDN `Sender` (або) IP-адресу `Sender` (якщо зворотний PTR недоступний), а також на кожного отримувача в конверті. Ми зберігаємо ключ для обмеження швидкості у вигляді криптографічного хешу в нашій базі даних Redis.

* Якщо ви надсилаєте пошту через нашу систему, будь ласка, переконайтеся, що для всіх ваших IP-адрес налаштовано зворотний PTR (інакше кожен унікальний кореневий домен FQDN або IP-адреса, з якої ви надсилаєте, буде обмежений за швидкістю).

* Зверніть увагу, що якщо ви надсилаєте через популярну систему, таку як Amazon SES, то обмеження швидкості не застосовуватиметься, оскільки (на момент написання цього тексту) Amazon SES внесено до нашого білого списку.

* Якщо ви надсилаєте з домену, наприклад, `test.abc.123.example.com`, то обмеження швидкості буде накладено на `example.com`. Багато спамерів використовують сотні піддоменів, щоб обійти поширені спам-фільтри, які обмежують швидкість лише унікальних імен хостів, а не унікальних кореневих доменів FQDN.

* `Senders`, які перевищують обмеження швидкості, отримають відмову з помилкою 421.

Наші IMAP і SMTP сервери обмежують кількість одночасних з’єднань для ваших псевдонімів не більше ніж `60`.

Наші MX-сервери обмежують [не з білого списку](#do-you-have-an-allowlist) відправників у встановленні більше ніж 10 одночасних з’єднань (з кешуванням лічильника на 3 хвилини, що відповідає таймауту сокета у 3 хвилини).

### Як ви захищаєтеся від backscatter {#how-do-you-protect-against-backscatter}

Неправильно спрямовані відмови або спам-відмови (відомі як "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") можуть спричинити негативну репутацію IP-адрес відправника.

Ми вживаємо два заходи для захисту від backscatter, які детально описані у наступних розділах [Запобігання відмовам від відомих спамерів MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) та [Запобігання непотрібним відмовам для захисту від backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Запобігання відмовам від відомих спамерів MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Ми отримуємо список з [Backscatter.org](https://www.backscatterer.org/) (підтримується [UCEPROTECT](https://www.uceprotect.net/)) за адресою <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> щогодини і завантажуємо його у нашу базу даних Redis (ми також заздалегідь порівнюємо різницю; на випадок, якщо якісь IP були вилучені і це потрібно врахувати).
Якщо MAIL FROM порожній АБО дорівнює (без урахування регістру) будь-якій з [адрес постмастера](#what-are-postmaster-addresses) (частина перед @ в електронній пошті), тоді ми перевіряємо, чи IP відправника збігається з одним із цього списку.

Якщо IP відправника вказаний у списку (і не в нашому [allowlist](#do-you-have-an-allowlist)), тоді ми надсилаємо помилку 554 з повідомленням `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Ми отримаємо сповіщення, якщо відправник є одночасно у списку Backscatterer і в нашому allowlist, щоб за потреби вирішити проблему.

Техніки, описані в цьому розділі, відповідають рекомендації "SAFE MODE" на <https://www.backscatterer.org/?target=usage> – де ми перевіряємо IP відправника лише якщо певні умови вже виконані.

### Запобігання непотрібним відмовам для захисту від backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Відмови — це електронні листи, які вказують, що пересилання листа отримувачу повністю не вдалося і лист не буде повторно надіслано.

Поширеною причиною потрапляння до списку Backscatterer є неправильно спрямовані відмови або спам-відмови, тому ми повинні захищатися від цього кількома способами:

1. Ми надсилаємо лише коли виникають помилки зі статусом >= 500 (коли спроби переслати листи зазнали невдачі, наприклад, Gmail відповідає помилкою рівня 500).

2. Ми надсилаємо лише один раз (ми використовуємо обчислений ключ відбитка відмови і зберігаємо його в кеші, щоб запобігти дублюванню). Відбиток відмови — це ключ, який є відбитком повідомлення, поєднаним з хешем адреси відмови та її кодом помилки). Див. розділ про [Fingerprinting](#how-do-you-determine-an-email-fingerprint) для детальнішого розуміння, як обчислюється відбиток повідомлення. Успішно надіслані відбитки відмов зберігаються в нашому кеші Redis протягом 7 днів.

3. Ми надсилаємо лише коли MAIL FROM і/або From не порожні і не містять (без урахування регістру) [ім’я користувача постмастера](#what-are-postmaster-addresses) (частина перед @ в електронній пошті).

4. Ми не надсилаємо, якщо в оригінальному повідомленні є будь-які з наступних заголовків (без урахування регістру):

   * Заголовок `auto-submitted` зі значенням, відмінним від `no`.
   * Заголовок `x-auto-response-suppress` зі значенням `dr`, `autoreply`, `auto-reply`, `auto_reply` або `all`.
   * Заголовок `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` або `x-auto-respond` (незалежно від значення).
   * Заголовок `precedence` зі значенням `bulk`, `autoreply`, `auto-reply`, `auto_reply` або `list`.

5. Ми не надсилаємо, якщо адреса MAIL FROM або From закінчується на `+donotreply`, `-donotreply`, `+noreply` або `-noreply`.

6. Ми не надсилаємо, якщо ім’я користувача в From було `mdaemon` і був заголовок (без урахування регістру) `X-MDDSN-Message`.

7. Ми не надсилаємо, якщо був заголовок (без урахування регістру) `content-type` зі значенням `multipart/report`.

### Як визначити відбиток електронної пошти {#how-do-you-determine-an-email-fingerprint}

Відбиток електронної пошти використовується для визначення унікальності листа та запобігання доставці дублікатів повідомлень і надсиланню [дубльованих відмов](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Відбиток обчислюється за таким списком:

* Вирішене ім’я хоста FQDN клієнта або IP-адреса
* Значення заголовка `Message-ID` (якщо є)
* Значення заголовка `Date` (якщо є)
* Значення заголовка `From` (якщо є)
* Значення заголовка `To` (якщо є)
* Значення заголовка `Cc` (якщо є)
* Значення заголовка `Subject` (якщо є)
* Значення тіла листа (якщо є)

### Чи можна пересилати листи на порти, відмінні від 25 (наприклад, якщо мій ISP заблокував порт 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Так, з 5 травня 2020 року ми додали цю функцію. Наразі ця функція є специфічною для домену, а не для псевдоніма. Якщо вам потрібно, щоб вона була специфічною для псевдоніма, будь ласка, зв’яжіться з нами, щоб повідомити про ваші потреби.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Покращений захист конфіденційності:
  </strong>
  <span>
    Якщо ви користуєтеся платним планом (який має покращений захист конфіденційності), будь ласка, перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a>, натисніть "Налаштування" поруч із вашим доменом, а потім натисніть "Параметри". Якщо ви хочете дізнатися більше про платні плани, дивіться нашу сторінку <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ціни</a>. В іншому випадку ви можете продовжувати слідувати інструкціям нижче.
  </span>
</div>
Якщо ви користуєтеся безкоштовним планом, просто додайте новий DNS <strong class="notranslate">TXT</strong> запис, як показано нижче, але змініть порт з 25 на обраний вами порт.

Наприклад, якщо я хочу, щоб усі листи, які надходять на `example.com`, пересилалися на SMTP порт псевдонімних отримувачів 1337 замість 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
    Найпоширеніший сценарій налаштування пересилання на нестандартний порт — коли ви хочете пересилати всі листи, що надходять на example.com, на інший порт на example.com, відмінний від стандартного SMTP порту 25. Щоб це налаштувати, просто додайте наступний <strong class="notranslate">TXT</strong> запис catch-all.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Чи підтримується символ плюс + для псевдонімів Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Так, абсолютно.

### Чи підтримуються піддомени {#does-it-support-sub-domains}

Так, абсолютно. Замість використання "@", ".", або порожнього значення як ім'я/хост/псевдонім, просто використовуйте ім'я піддомену.

Якщо ви хочете, щоб `foo.example.com` пересилав листи, введіть `foo` як значення ім'я/хост/псевдонім у налаштуваннях DNS (для обох записів MX і <strong class="notranslate">TXT</strong>).

### Чи пересилаються заголовки моїх листів {#does-this-forward-my-emails-headers}

Так, абсолютно.

### Чи добре це протестовано {#is-this-well-tested}

Так, є тести, написані з використанням [ava](https://github.com/avajs/ava), а також є покриття коду.

### Чи передаються SMTP повідомлення та коди відповіді {#do-you-pass-along-smtp-response-messages-and-codes}

Так, абсолютно. Наприклад, якщо ви надсилаєте листа на `hello@example.com`, і він зареєстрований для пересилання на `user@gmail.com`, тоді SMTP повідомлення та код відповіді від SMTP сервера "gmail.com" буде повернуто замість проксі-сервера на "mx1.forwardemail.net" або "mx2.forwardemail.net".

### Як ви запобігаєте спамерам і забезпечуєте хорошу репутацію пересилання листів {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Дивіться наші розділи про [Як працює ваша система пересилання листів](#how-does-your-email-forwarding-system-work), [Як ви обробляєте проблеми доставки листів](#how-do-you-handle-email-delivery-issues) та [Як ви справляєтеся з блокуванням ваших IP-адрес](#how-do-you-handle-your-ip-addresses-becoming-blocked) вище.

### Як ви виконуєте DNS-запити для доменних імен {#how-do-you-perform-dns-lookups-on-domain-names}

Ми створили проект з відкритим кодом :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) і використовуємо його для DNS-запитів. За замовчуванням використовуються DNS сервери `1.1.1.1` та `1.0.0.1`, а DNS-запити здійснюються через [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") на рівні застосунку.

:tangerine: [Tangerine](https://github.com/tangerine) за замовчуванням використовує [приватний DNS-сервіс для споживачів від CloudFlare][cloudflare-dns].


## Обліковий запис та оплата {#account-and-billing}

### Чи пропонуєте ви гарантію повернення грошей на платних планах {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Так! Автоматичне повернення коштів відбувається при оновленні, пониженні або скасуванні вашого облікового запису протягом 30 днів з моменту початку вашого плану. Це стосується лише нових клієнтів.
### Якщо я зміню план, чи робите ви пропорційний розрахунок і повертаєте різницю {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Ми не робимо пропорційний розрахунок і не повертаємо різницю при зміні плану. Натомість ми конвертуємо залишковий термін з дати закінчення вашого поточного плану у найближчий відповідний термін для вашого нового плану (округлюючи вниз за місяцями).

Зверніть увагу, що якщо ви оновлюєте або понижуєте план між платними планами протягом 30 днів з моменту початку першого платного плану, ми автоматично повернемо повну суму за ваш поточний план.

### Чи можу я використовувати цю службу пересилання електронної пошти як "резервний" або "fallback" MX сервер {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Ні, це не рекомендується, оскільки одночасно можна використовувати лише один сервер обміну поштою. Резервні сервери зазвичай ніколи не повторюють спроби через неправильні налаштування пріоритету та поштові сервери, які не поважають перевірку пріоритету MX.

### Чи можу я вимкнути конкретні псевдоніми {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо у вас платний план, вам потрібно перейти до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій акаунт <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми <i class="fa fa-angle-right"></i> Редагувати псевдонім <i class="fa fa-angle-right"></i> Зняти прапорець "Активний" <i class="fa fa-angle-right"></i> Продовжити.
  </span>
</div>

Так, просто відредагуйте свій DNS <strong class="notranslate">TXT</strong> запис і додайте на початок псевдоніма один, два або три знаки оклику (див. нижче).

Зверніть увагу, що *варто* зберігати ":" у відображенні, оскільки це потрібно, якщо ви коли-небудь захочете знову увімкнути цей псевдонім (а також це використовується для імпорту, якщо ви оновитесь до одного з наших платних планів).

**Для тихого відхилення (відправнику здається, що повідомлення надіслано успішно, але насправді воно нікуди не надходить) (код статусу `250`):** Якщо ви додасте на початок псевдоніма "!" (один знак оклику), то відправникам, які намагаються надіслати на цю адресу, буде повернено успішний код статусу `250`, але самі листи нікуди не потраплять (наприклад, чорна діра або `/dev/null`).

**Для м’якого відхилення (код статусу `421`):** Якщо ви додасте на початок псевдоніма "!!" (два знаки оклику), то відправникам, які намагаються надіслати на цю адресу, буде повернено код помилки `421`, і листи часто будуть повторно надсилатися протягом до 5 днів перед відхиленням і поверненням.

**Для жорсткого відхилення (код статусу `550`):** Якщо ви додасте на початок псевдоніма "!!!" (три знаки оклику), то відправникам, які намагаються надіслати на цю адресу, буде повернено постійну помилку `550`, і листи будуть відхилені та повернені.

Наприклад, якщо я хочу, щоб усі листи, які надходять на `alias@example.com`, припинили пересилатися на `user@gmail.com` і були відхилені та повернені (наприклад, використати три знаки оклику):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Ви також можете переписати адресу отримувача пересилання просто на "nobody@forwardemail.net", що направить її нікому, як у прикладі нижче.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Якщо ви хочете підвищити безпеку, ви також можете видалити частину ":user@gmail.com" (або ":nobody@forwardemail.net"), залишивши лише "!!!alias", як у прикладі нижче.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Чи можу я пересилати листи кільком отримувачам {#can-i-forward-emails-to-multiple-recipients}

Так, звичайно. Просто вкажіть кількох отримувачів у ваших <strong class="notranslate">TXT</strong> записах.

Наприклад, якщо я хочу, щоб лист, який надходить на `hello@example.com`, пересилався на `user+a@gmail.com` та `user+b@gmail.com`, тоді мій <strong class="notranslate">TXT</strong> запис виглядатиме так:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Або ви можете вказати їх у двох окремих рядках, наприклад так:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Вибір за вами!

### Чи можу я мати кількох глобальних отримувачів для catch-all {#can-i-have-multiple-global-catch-all-recipients}

Так, можете. Просто вкажіть кількох глобальних отримувачів для catch-all у ваших <strong class="notranslate">TXT</strong> записах.

Наприклад, якщо я хочу, щоб кожен лист, який надходить на `*@example.com` (зірочка означає wildcard, тобто catch-all), пересилався на `user+a@gmail.com` та `user+b@gmail.com`, тоді мій <strong class="notranslate">TXT</strong> запис виглядатиме так:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Або ви можете вказати їх у двох окремих рядках, наприклад так:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Ім'я/Хост/Псевдонім</th>
      <th class="text-center">TTL</th>
      <th>Тип</th>
      <th>Відповідь/Значення</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", або порожньо</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Це залежить від вас!

### Чи існує максимальна кількість електронних адрес, на які я можу пересилати листи з одного псевдоніма {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Так, стандартне обмеження — 10. Це НЕ означає, що у вас може бути лише 10 псевдонімів на вашому домені. Ви можете мати скільки завгодно псевдонімів (безліч). Це означає, що ви можете пересилати листи з одного псевдоніма лише на 10 унікальних електронних адрес. Ви можете мати `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (від 1 до 10) — і будь-які листи на `hello@example.com` будуть переслані на `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (від 1 до 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Порада:
  </strong>
  <span>
    Потрібно більше ніж 10 отримувачів на псевдонім? Напишіть нам електронного листа, і ми з радістю збільшимо ліміт вашого акаунта.
  </span>
</div>

### Чи можна рекурсивно пересилати листи {#can-i-recursively-forward-emails}

Так, можна, але ви все одно повинні дотримуватися максимального ліміту. Якщо у вас є `hello:linus@example.com` і `linus:user@gmail.com`, тоді листи на `hello@example.com` будуть переслані на `linus@example.com` і `user@gmail.com`. Зверніть увагу, що буде викинута помилка, якщо ви спробуєте рекурсивно пересилати листи понад максимальний ліміт.

### Чи можуть люди скасувати або зареєструвати моє пересилання електронної пошти без мого дозволу {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Ми використовуємо перевірку MX та <strong class="notranslate">TXT</strong> записів, тому якщо ви додали відповідні MX та <strong class="notranslate">TXT</strong> записи цього сервісу, то ви зареєстровані. Якщо ви їх видалите, то ви скасуєте реєстрацію. Ви володієте своїм доменом і керуєте DNS, тому якщо хтось має доступ до цього, це є проблемою.

### Чому це безкоштовно {#how-is-it-free}

Forward Email пропонує безкоштовний рівень завдяки поєднанню відкритого коду, ефективної інфраструктури та опціональних платних планів, які підтримують сервіс.

Наш безкоштовний рівень підтримується:

1. **Відкритим кодом**: Наш код відкритий, що дозволяє спільноті робити внески та забезпечує прозорість роботи.

2. **Ефективною інфраструктурою**: Ми оптимізували наші системи для пересилання листів з мінімальними ресурсами.

3. **Платними преміум-планами**: Користувачі, які потребують додаткових функцій, таких як відправка через SMTP, отримання через IMAP або покращені опції конфіденційності, підписуються на платні плани.

4. **Розумними обмеженнями використання**: Безкоштовний рівень має політику справедливого використання, щоб запобігти зловживанням.

> \[!NOTE]
> Ми прагнемо зберегти базове пересилання електронної пошти безкоштовним, пропонуючи преміум-функції для користувачів з більш складними потребами.

> \[!TIP]
> Якщо ви вважаєте наш сервіс корисним, розгляньте можливість оновлення до платного плану, щоб підтримати подальший розвиток і обслуговування.

### Який максимальний розмір листа {#what-is-the-max-email-size-limit}

За замовчуванням ми встановлюємо ліміт у 50 МБ, що включає вміст, заголовки та вкладення. Зверніть увагу, що сервіси, такі як Gmail і Outlook, дозволяють лише 25 МБ, і якщо ви перевищите цей ліміт при відправці на адреси цих провайдерів, ви отримаєте повідомлення про помилку.

Якщо розмір файлу перевищено, повертається помилка з відповідним кодом відповіді.

### Чи зберігаєте ви логи листів {#do-you-store-logs-of-emails}

Ні, ми не записуємо на диск і не зберігаємо логи — за винятком [помилок](#do-you-store-error-logs) та [вихідного SMTP](#do-you-support-sending-email-with-smtp) (див. нашу [Політику конфіденційності](/privacy)).

Все виконується в пам’яті, а [наш вихідний код на GitHub](https://github.com/forwardemail).

### Чи зберігаєте ви логи помилок {#do-you-store-error-logs}

**Так. Ви можете отримати доступ до логів помилок у розділах [Мій акаунт → Логи](/my-account/logs) або [Мій акаунт → Домени](/my-account/domains).**

Станом на лютий 2023 року ми зберігаємо логи помилок для SMTP кодів відповіді `4xx` та `5xx` протягом 7 днів — вони містять SMTP помилку, конверт і заголовки листа (ми **не зберігаємо** тіло листа та вкладення).
Журнали помилок дозволяють перевіряти відсутність важливих електронних листів і зменшувати кількість хибних спрацьовувань спаму для [ваших доменів](/my-account/domains). Вони також є чудовим ресурсом для налагодження проблем з [вебхуками електронної пошти](#do-you-support-webhooks) (оскільки журнали помилок містять відповідь кінцевої точки вебхука).

Журнали помилок для [обмеження швидкості](#do-you-have-rate-limiting) та [сірого списку](#do-you-have-a-greylist) недоступні, оскільки з’єднання завершується раніше (наприклад, до того, як можуть бути передані команди `RCPT TO` та `MAIL FROM`).

Дивіться нашу [Політику конфіденційності](/privacy) для більш детальної інформації.

### Ви читаєте мої електронні листи {#do-you-read-my-emails}

Ні, абсолютно ні. Дивіться нашу [Політику конфіденційності](/privacy).

Багато інших сервісів переадресації електронної пошти зберігають і потенційно можуть читати вашу пошту. Немає жодної причини, чому переадресовані листи мають зберігатися на диску – тому ми розробили перше рішення з відкритим кодом, яке все робить у пам’яті.

Ми віримо, що ви маєте право на конфіденційність і суворо його поважаємо. Код, який розгорнуто на сервері, є [програмним забезпеченням з відкритим кодом на GitHub](https://github.com/forwardemail) для прозорості та побудови довіри.

### Чи можу я "надсилати пошту від імені" в Gmail за допомогою цього {#can-i-send-mail-as-in-gmail-with-this}

Так! Станом на 2 жовтня 2018 року ми додали цю функцію. Дивіться [Як надсилати пошту від імені за допомогою Gmail](#how-to-send-mail-as-using-gmail) вище!

Вам також слід встановити SPF-запис для Gmail у вашій DNS-конфігурації у вигляді <strong class="notranslate">TXT</strong> запису.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви використовуєте Gmail (наприклад, функцію Надсилати пошту від імені) або G Suite, вам потрібно додати <code>include:_spf.google.com</code> до вашого SPF <strong class="notranslate">TXT</strong> запису, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Чи можу я "надсилати пошту від імені" в Outlook за допомогою цього {#can-i-send-mail-as-in-outlook-with-this}

Так! Станом на 2 жовтня 2018 року ми додали цю функцію. Просто перегляньте ці два посилання від Microsoft нижче:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Вам також слід встановити SPF-запис для Outlook у вашій DNS-конфігурації у вигляді <strong class="notranslate">TXT</strong> запису.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важливо:
  </strong>
  <span>
    Якщо ви використовуєте Microsoft Outlook або Live.com, вам потрібно додати <code>include:spf.protection.outlook.com</code> до вашого SPF <strong class="notranslate">TXT</strong> запису, наприклад:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Чи можу я "надсилати пошту від імені" в Apple Mail та iCloud Mail за допомогою цього {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Якщо ви є підписником iCloud+, ви можете використовувати власний домен. [Наш сервіс також сумісний з Apple Mail](#apple-mail).

Будь ласка, дивіться <https://support.apple.com/en-us/102540> для отримання додаткової інформації.

### Чи можу я пересилати необмежену кількість листів за допомогою цього {#can-i-forward-unlimited-emails-with-this}

Так, однак "відносно невідомі" відправники обмежені до 100 з’єднань на годину на хостнейм або IP. Дивіться розділ про [Обмеження швидкості](#do-you-have-rate-limiting) та [Сірий список](#do-you-have-a-greylist) вище.

Під "відносно невідомими" ми маємо на увазі відправників, які не входять до [білого списку](#do-you-have-an-allowlist).

Якщо це обмеження перевищено, ми надсилаємо код відповіді 421, який повідомляє поштовому серверу відправника спробувати пізніше.

### Чи пропонуєте ви необмежену кількість доменів за одну ціну {#do-you-offer-unlimited-domains-for-one-price}

Так. Незалежно від того, який у вас тарифний план, ви платите лише одну місячну ставку – яка покриває всі ваші домени.
### Які способи оплати ви приймаєте {#which-payment-methods-do-you-accept}

Forward Email приймає наступні одноразові або щомісячні/щоквартальні/щорічні способи оплати:

1. **Кредитні/дебетові картки/банківські перекази**: Visa, Mastercard, American Express, Discover, JCB, Diners Club тощо.
2. **PayPal**: Підключіть свій обліковий запис PayPal для зручних платежів
3. **Криптовалюта**: Ми приймаємо платежі через стабільні монети Stripe у мережах Ethereum, Polygon та Solana

> \[!NOTE]
> Ми зберігаємо обмежену інформацію про платежі на наших серверах, яка включає лише ідентифікатори платежів та посилання на транзакції, клієнтів, підписки та ID платежів [Stripe](https://stripe.com/global) і [PayPal](https://www.paypal.com).

> \[!TIP]
> Для максимальної конфіденційності розгляньте можливість використання криптовалютних платежів.

Всі платежі обробляються безпечно через Stripe або PayPal. Ваші платіжні дані ніколи не зберігаються на наших серверах.


## Додаткові ресурси {#additional-resources}

> \[!TIP]
> Наші статті нижче регулярно оновлюються новими посібниками, порадами та технічною інформацією. Часто повертайтеся за останніми матеріалами.

* [Кейси та документація для розробників](/blog/docs)
* [Ресурси](/resources)
* [Посібники](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
