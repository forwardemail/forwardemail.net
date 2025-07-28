# Часті запитання {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Зміст {#table-of-contents}

* [Швидкий старт](#quick-start)
* [Вступ](#introduction)
  * [Що таке пересилання електронної пошти](#what-is-forward-email)
  * [Хто користується послугою пересилання електронної пошти](#who-uses-forward-email)
  * [Яка історія пересилання електронної пошти](#what-is-forward-emails-history)
  * [Як швидко працює ця послуга](#how-fast-is-this-service)
* [Поштові клієнти](#email-clients)
  * [Тандерберд](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Мобільні пристрої](#mobile-devices)
  * [Як надсилати пошту за допомогою Gmail](#how-to-send-mail-as-using-gmail)
  * [Що таке застарілий безкоштовний посібник з надсилання пошти за допомогою Gmail?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Розширене налаштування маршрутизації Gmail](#advanced-gmail-routing-configuration)
  * [Розширене налаштування маршрутизації Outlook](#advanced-outlook-routing-configuration)
* [Усунення несправностей](#troubleshooting)
  * [Чому я не отримую свої тестові електронні листи](#why-am-i-not-receiving-my-test-emails)
  * [Як налаштувати поштовий клієнт для роботи з пересиланням електронної пошти](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Чому мої електронні листи потрапляють у спам і небажану пошту, і як я можу перевірити репутацію свого домену](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Що робити, якщо я отримую спам-листи](#what-should-i-do-if-i-receive-spam-emails)
  * [Чому мої тестові електронні листи, надіслані мені в Gmail, відображаються як "підозрілі"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Чи можна видалити функцію "via forwardemail dot net" у Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Управління даними](#data-management)
  * [Де розташовані ваші сервери](#where-are-your-servers-located)
  * [Як експортувати та створити резервну копію моєї поштової скриньки](#how-do-i-export-and-backup-my-mailbox)
  * [Як імпортувати та перенести мою існуючу поштову скриньку](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Ви підтримуєте самостійний хостинг?](#do-you-support-self-hosting)
* [Конфігурація електронної пошти](#email-configuration)
  * [Як розпочати та налаштувати пересилання електронної пошти](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Чи можу я використовувати кілька MX-бірж та серверів для розширеної переадресації?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Як налаштувати автовідповідач у відпустці (автовідповідач «поза офісом»)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Як налаштувати SPF для пересилання електронної пошти](#how-do-i-set-up-spf-for-forward-email)
  * [Як налаштувати DKIM для пересилання електронної пошти](#how-do-i-set-up-dkim-for-forward-email)
  * [Як налаштувати DMARC для пересилання електронної пошти](#how-do-i-set-up-dmarc-for-forward-email)
  * [Як підключити та налаштувати мої контакти](#how-do-i-connect-and-configure-my-contacts)
  * [Як підключити та налаштувати мої календарі](#how-do-i-connect-and-configure-my-calendars)
  * [Як додати більше календарів та керувати існуючими календарями](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Як налаштувати SRS для пересилання електронної пошти](#how-do-i-set-up-srs-for-forward-email)
  * [Як налаштувати MTA-STS для пересилання електронної пошти](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Як додати зображення профілю до моєї адреси електронної пошти](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Розширені функції](#advanced-features)
  * [Чи підтримуєте ви розсилку новин або списки розсилки для маркетингової електронної пошти?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Чи підтримуєте ви надсилання електронної пошти через API?](#do-you-support-sending-email-with-api)
  * [Чи підтримуєте ви отримання електронної пошти через IMAP?](#do-you-support-receiving-email-with-imap)
  * [Ви підтримуєте POP3?](#do-you-support-pop3)
  * [Чи підтримуєте ви календарі (CalDAV)?](#do-you-support-calendars-caldav)
  * [Чи підтримуєте ви контакти (CardDAV)?](#do-you-support-contacts-carddav)
  * [Чи підтримуєте ви надсилання електронної пошти через SMTP?](#do-you-support-sending-email-with-smtp)
  * [Чи підтримуєте ви OpenPGP/MIME, наскрізне шифрування ("E2EE") та каталог веб-ключів ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Ви підтримуєте MTA-STS?](#do-you-support-mta-sts)
  * [Чи підтримуєте ви паролі та WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Чи підтримуєте ви найкращі практики електронної пошти?](#do-you-support-email-best-practices)
  * [Ви підтримуєте bounce webhooks?](#do-you-support-bounce-webhooks)
  * [Ви підтримуєте вебхуки?](#do-you-support-webhooks)
  * [Ви підтримуєте регулярні вирази чи regex?](#do-you-support-regular-expressions-or-regex)
  * [Які ваші ліміти вихідних SMTP-повідомлень?](#what-are-your-outbound-smtp-limits)
  * [Чи потрібне мені схвалення для ввімкнення SMTP?](#do-i-need-approval-to-enable-smtp)
  * [Які налаштування конфігурації вашого SMTP-сервера](#what-are-your-smtp-server-configuration-settings)
  * [Які налаштування конфігурації вашого IMAP-сервера?](#what-are-your-imap-server-configuration-settings)
  * [Які налаштування конфігурації вашого POP3-сервера?](#what-are-your-pop3-server-configuration-settings)
  * [Конфігурація ретрансляції Postfix SMTP](#postfix-smtp-relay-configuration)
* [Безпека](#security)
  * [Розширені методи захисту сервера](#advanced-server-hardening-techniques)
  * [У вас є сертифікати SOC 2 або ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Чи використовуєте ви шифрування TLS для пересилання електронної пошти?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Чи зберігаєте ви заголовки автентифікації електронної пошти?](#do-you-preserve-email-authentication-headers)
  * [Чи зберігаєте ви оригінальні заголовки електронних листів та запобігаєте підміні?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Як ви захищаєтеся від спаму та зловживань](#how-do-you-protect-against-spam-and-abuse)
  * [Ви зберігаєте вміст електронної пошти на диску?](#do-you-store-email-content-on-disk)
  * [Чи може вміст електронної пошти бути розкритий під час збоїв системи](#can-email-content-be-exposed-during-system-crashes)
  * [Хто має доступ до вашої поштової інфраструктури](#who-has-access-to-your-email-infrastructure)
  * [Якими постачальниками інфраструктури ви користуєтеся?](#what-infrastructure-providers-do-you-use)
  * [Чи пропонуєте ви Угоду про обробку даних (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Як ви обробляєте сповіщення про витік даних](#how-do-you-handle-data-breach-notifications)
  * [Ви пропонуєте тестове середовище?](#do-you-offer-a-test-environment)
  * [Чи надаєте ви інструменти моніторингу та сповіщень?](#do-you-provide-monitoring-and-alerting-tools)
  * [Як забезпечити високу доступність](#how-do-you-ensure-high-availability)
  * [Чи дотримуєтесь ви розділу 889 Закону про національний оборонний бюджет (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Системні та технічні деталі](#system-and-technical-details)
  * [Ви зберігаєте електронні листи та їхній вміст?](#do-you-store-emails-and-their-contents)
  * [Як працює ваша система пересилання електронної пошти](#how-does-your-email-forwarding-system-work)
  * [Як обробляти електронний лист для пересилання](#how-do-you-process-an-email-for-forwarding)
  * [Як ви вирішуєте проблеми з доставкою електронної пошти](#how-do-you-handle-email-delivery-issues)
  * [Як ви реагуєте на блокування IP-адрес?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Що таке адреси поштмейстерів](#what-are-postmaster-addresses)
  * [Що таке адреси без відповіді](#what-are-no-reply-addresses)
  * [Які IP-адреси вашого сервера](#what-are-your-servers-ip-addresses)
  * [У вас є білий список](#do-you-have-an-allowlist)
  * [Які розширення доменних імен за замовчуванням входять до білого списку](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Які критерії вашого білого списку](#what-is-your-allowlist-criteria)
  * [Які розширення доменних імен можна використовувати безкоштовно](#what-domain-name-extensions-can-be-used-for-free)
  * [У вас є сірий список](#do-you-have-a-greylist)
  * [У вас є список заборонених адрес?](#do-you-have-a-denylist)
  * [У вас є обмеження швидкості](#do-you-have-rate-limiting)
  * [Як захиститися від зворотного розсіювання](#how-do-you-protect-against-backscatter)
  * [Запобігання поверненню відомих ПОШТОВИХ ВІДПРАВНИКІВ](#prevent-bounces-from-known-mail-from-spammers)
  * [Запобігання непотрібним відскокам для захисту від зворотного розсіювання](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Як визначити відбиток електронної пошти](#how-do-you-determine-an-email-fingerprint)
  * [Чи можу я пересилати електронні листи на порти, відмінні від 25 (наприклад, якщо мій інтернет-провайдер заблокував порт 25)?](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Чи підтримується символ плюс + для псевдонімів Gmail?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Чи підтримується піддоменів](#does-it-support-sub-domains)
  * [Чи пересилає це заголовки моїх електронних листів?](#does-this-forward-my-emails-headers)
  * [Це добре перевірено?](#is-this-well-tested)
  * [Ви передаєте повідомлення та коди відповідей SMTP?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Як запобігти спамерам та забезпечити добру репутацію пересилання електронної пошти](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Як виконувати DNS-пошук доменних імен](#how-do-you-perform-dns-lookups-on-domain-names)
* [Обліковий запис та виставлення рахунків](#account-and-billing)
  * [Чи пропонуєте ви гарантію повернення грошей на платні плани?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Якщо я зміню план, ви пропорційно розрахуєте суму та повернете різницю?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Чи можу я використовувати цей сервіс пересилання електронної пошти як резервний MX-сервер?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Чи можна вимкнути певні псевдоніми?](#can-i-disable-specific-aliases)
  * [Чи можу я пересилати електронні листи кільком одержувачам](#can-i-forward-emails-to-multiple-recipients)
  * [Чи можу я мати кількох глобальних одержувачів для всіх адрес?](#can-i-have-multiple-global-catch-all-recipients)
  * [Чи існує максимальне обмеження на кількість адрес електронної пошти, на які я можу пересилати повідомлення на псевдонім?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Чи можу я рекурсивно пересилати електронні листи](#can-i-recursively-forward-emails)
  * [Чи можуть люди скасувати реєстрацію або зареєструвати мою пересилку електронної пошти без мого дозволу?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Як це безкоштовно?](#how-is-it-free)
  * [Який максимальний розмір електронного листа?](#what-is-the-max-email-size-limit)
  * [Ви зберігаєте журнали електронних листів?](#do-you-store-logs-of-emails)
  * [Ви зберігаєте журнали помилок?](#do-you-store-error-logs)
  * [Ти читаєш мої електронні листи?](#do-you-read-my-emails)
  * [Чи можу я "надсилати пошту від імені" в Gmail за допомогою цього](#can-i-send-mail-as-in-gmail-with-this)
  * [Чи можу я "надсилати пошту як" в Outlook за допомогою цього](#can-i-send-mail-as-in-outlook-with-this)
  * [Чи можу я "надсилати пошту як" в Apple Mail та iCloud Mail за допомогою цього](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Чи можу я пересилати необмежену кількість електронних листів за допомогою цього?](#can-i-forward-unlimited-emails-with-this)
  * [Ви пропонуєте необмежену кількість доменів за однією ціною?](#do-you-offer-unlimited-domains-for-one-price)
  * [Які способи оплати ви приймаєте](#which-payment-methods-do-you-accept)
* [Додаткові ресурси](#additional-resources)

## Швидкий старт {#quick-start}

Щоб розпочати роботу з пересиланням електронної пошти:

1. **Створіть обліковий запис** за адресою [forwardemail.net/register](https://forwardemail.net/register)

2. **Додайте та підтвердьте свій домен** у розділі [Мій обліковий запис → Домени](/my-account/domains)

3. **Додайте та налаштуйте псевдоніми електронної пошти/поштові скриньки** у розділі [Мій обліковий запис → Домени](/my-account/domains) → Псевдоніми

4. **Перевірте свою конфігурацію**, надіславши електронного листа на один із ваших нових псевдонімів

> \[!TIP]
> Зміни DNS можуть бути застосовані до 24-48 годин до глобального поширення, хоча часто вони набувають чинності набагато раніше.

> \[!IMPORTANT]
> Для покращення доставки рекомендуємо налаштувати записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) та [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

## Вступ {#introduction}

### Що таке пересилання електронної пошти {#what-is-forward-email}

> \[!NOTE]
> Функція «Пересилання електронної пошти» ідеально підходить для окремих осіб, малого бізнесу та розробників, яким потрібні професійні адреси електронної пошти без витрат на повноцінне рішення для хостингу електронної пошти та без необхідності його обслуговування.

Forward Email — це **повнофункціональний постачальник послуг електронної пошти** та **постачальник хостингу електронної пошти для користувацьких доменних імен**.

Це єдиний безкоштовний сервіс з відкритим кодом, який дозволяє використовувати адреси електронної пошти з власним доменом без складнощів налаштування та обслуговування власного поштового сервера.

Наш сервіс пересилає електронні листи, надіслані на ваш власний домен, на ваш існуючий обліковий запис електронної пошти, і ви навіть можете використовувати нас як свого виділеного постачальника хостингу електронної пошти.

Основні характеристики пересилання електронної пошти:

* **Електронна адреса для власного домену**: Використовуйте професійні адреси електронної пошти з власним доменним іменем
* **Безкоштовний рівень**: Базова пересилання електронної пошти безкоштовно
* **Покращена конфіденційність**: Ми не читаємо ваші електронні листи та не продаємо ваші дані
* **Відкритий код**: Уся наша кодова база доступна на GitHub
* **Підтримка SMTP, IMAP та POP3**: Повні можливості надсилання та отримання електронної пошти
* **Наскрізне шифрування**: Підтримка OpenPGP/MIME
* **Власні псевдоніми Catch-All**: Створюйте необмежену кількість псевдонімів електронної пошти

Ви можете порівняти нас з більш ніж 56 іншими постачальниками послуг електронної пошти на [наша сторінка порівняння електронних адрес](/blog/best-email-service).

> \[!TIP]
> Дізнайтеся більше про пересилання електронних листів, прочитавши наш безкоштовний [Технічний документ](/technical-whitepaper.pdf)

### Хто використовує функцію пересилання електронної пошти {#who-uses-forward-email}

Ми надаємо послуги хостингу та пересилання електронної пошти для понад 500 000 доменів та таких відомих користувачів:

| Клієнт | Тематичне дослідження |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Військово-морська академія США | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Канонічний | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Ігри Netflix |  |
| Фонд Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Фонд PHP |  |
| Фокс Ньюз Радіо |  |
| Продажі реклами Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Убунту | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Безкоштовно | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Лубунту | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Кембриджський університет | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Університет Меріленду | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Університет Вашингтона | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Університет Тафтса | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Коледж Свортмор | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Уряд Південної Австралії |  |
| Уряд Домініканської Республіки |  |
| Fly<span>.</span>io |  |
| Готелі Королівського коледжу цивільного округу |  |
| Ісаак З. Шлютер (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| Девід Хайнемайєр Ганссон (Ruby on Rails) |  |

### Що таке історія пересилання електронних листів {#what-is-forward-emails-history}

Ви можете дізнатися більше про пересилання електронної пошти на сторінці [наша сторінка «Про нас»](/about).

### Яка швидкість цього рейсу {#how-fast-is-this-service}

> \[!NOTE]
> Наша система розроблена для швидкості та надійності, з кількома резервними серверами, щоб забезпечити своєчасну доставку ваших електронних листів.

Функція «Пересилання електронної пошти» доставляє повідомлення з мінімальною затримкою, зазвичай протягом кількох секунд після отримання.

Показники ефективності:

* **Середній час доставки**: Менше 5-10 секунд від отримання до пересилання ([див. нашу сторінку моніторингу часу до вхідних повідомлень "TTI"](/tti))
* **Час безвідмовної роботи**: Доступність сервісу понад 99,9%
* **Глобальна інфраструктура**: Сервери стратегічно розташовані для оптимальної маршрутизації
* **Автоматичне масштабування**: Наша система масштабується в періоди пікового навантаження електронної пошти

Ми працюємо в режимі реального часу, на відміну від інших постачальників, які покладаються на затримки в чергах.

Ми не записуємо на диск і не зберігаємо журнали – за допомогою [виняток помилок](#do-you-store-error-logs) та [вихідний SMTP](#do-you-support-sending-email-with-smtp) (див. наш [Політика конфіденційності](/privacy)).

Все робиться в пам'яті та [наш вихідний код знаходиться на GitHub](https://github.com/forwardemail).

## Поштові клієнти {#email-clients}

### Тандерберд {#thunderbird}

1. Створіть новий псевдонім і згенеруйте пароль на панелі керування пересиланням електронної пошти.
2. Відкрийте Thunderbird і перейдіть до **Редагувати → Налаштування облікового запису → Дії облікового запису → Додати обліковий запис пошти**.
3. Введіть своє ім'я, адресу пересилання електронної пошти та пароль.
4. Натисніть **Налаштувати вручну** та введіть:
* Вхідні: IMAP, `imap.forwardemail.net`, порт 993, SSL/TLS
* Вихідні: SMTP, `smtp.forwardemail.net`, порт 587, STARTTLS.
5. Натисніть **Готово**.

### Microsoft Outlook {#microsoft-outlook}

1. Створіть новий псевдонім та згенеруйте пароль на панелі керування пересиланням електронної пошти.
2. Перейдіть до **Файл → Додати обліковий запис**.
3. Введіть свою адресу пересилання електронної пошти та натисніть **Підключитися**.
4. Виберіть **Додаткові параметри** та виберіть **Налаштувати обліковий запис вручну**.
5. Виберіть **IMAP** та введіть:
* Вхідні: `imap.forwardemail.net`, порт 993, SSL
* Вихідні: `smtp.forwardemail.net`, порт 587, TLS
* Ім'я користувача: Ваша повна адреса електронної пошти.
* Пароль: Ваш згенерований пароль.
6. Натисніть **Підключитися**.

### Пошта Apple {#apple-mail}

1. Створіть новий псевдонім та згенеруйте пароль на панелі керування пересиланням електронної пошти.
2. Перейдіть до **Пошта → Налаштування → Облікові записи → +**.
3. Виберіть **Інший обліковий запис пошти**.
4. Введіть своє ім'я, адресу пересилання електронної пошти та пароль.
5. Для налаштувань сервера введіть:
* Вхідні: `imap.forwardemail.net`
* Вихідні: `smtp.forwardemail.net`
* Ім'я користувача: Ваша повна адреса електронної пошти.
* Пароль: Ваш згенерований пароль.
6. Натисніть **Увійти**.

### Мобільні пристрої {#mobile-devices}

Для iOS:

1. Перейдіть до **Налаштування → Пошта → Облікові записи → Додати обліковий запис → Інше**
2. Натисніть **Додати обліковий запис пошти** та введіть свої дані
3. Для налаштувань сервера використовуйте ті ж самі налаштування IMAP та SMTP, що й вище

Для Android:

1. Перейдіть до **Налаштування → Облікові записи → Додати обліковий запис → Особистий (IMAP)**
2. Введіть свою адресу електронної пошти для переадресації та пароль
3. Для налаштувань сервера використовуйте ті ж самі налаштування IMAP та SMTP, що й вище

### Як надсилати пошту за допомогою Gmail {#how-to-send-mail-as-using-gmail}

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
Якщо ви виконали інструкції, наведені вище в розділі <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Як розпочати роботу та налаштувати пересилання електронної пошти</a>, ви можете продовжити читання нижче.
</span>
</div>

<div id="надсилати-повідомлення-як-контент">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a>, <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> та <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ліміти вихідного SMTP</a> – ваше використання вважається підтвердженням та згодою.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо ви розробник, зверніться до нашої <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документації API електронної пошти</a>.
</span>
</div>

1. Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP та дотримуйтесь інструкцій з налаштування

2. Створіть новий псевдонім для свого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

3. Натисніть кнопку <strong class="text-success"><i class="fa fa-key"></i> «Згенерувати пароль»</strong> поруч із щойно створеним псевдонімом. Скопіюйте його в буфер обміну та надійно збережіть згенерований пароль, який відображається на екрані.

4. Перейдіть до розділу [Gmail](https://gmail.com) та в розділі [Налаштування <i class="fa fa-angle-right"></i> Облікові записи та імпорт <i class="fa fa-angle-right"></i> Надіслати пошту як](https://mail.google.com/mail/u/0/#settings/accounts) натисніть «Додати іншу адресу електронної пошти».

5. Коли з’явиться запит на ім’я, введіть ім’я, під яким ви хочете бачити свою електронну пошту як «Від» (наприклад, «Лінус Торвальдс»).

6. Коли з’явиться запит на «Адресу електронної пошти», введіть повну адресу електронної пошти псевдоніма, який ви створили в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

7. Зніміть прапорець «Вважати псевдонімом»

8. Натисніть кнопку «Наступний крок», щоб продовжити

9. Коли з’явиться запит на «SMTP-сервер», введіть <code>smtp.forwardemail.net</code> та залиште порт <code>587</code>.

10. Коли з’явиться запит на «Ім’я користувача», введіть повну адресу електронної пошти псевдоніма, який ви створили в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

11. Коли з’явиться запит на введення пароля, вставте пароль з розділу <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong> у кроці 3 вище.

12. Залиште перемикач позначеним для пункту «Захищене з’єднання за допомогою TLS».

13. Натисніть кнопку «Додати обліковий запис», щоб продовжити

14. Відкрийте нову вкладку [Gmail](https://gmail.com) та зачекайте на надходження електронного листа з підтвердженням (ви отримаєте код підтвердження, який підтверджує, що ви є власником адреси електронної пошти, з якої ви намагаєтеся "Надіслати пошту від імені")

15. Щойно він надійде, скопіюйте та вставте код підтвердження у відповідь на запит, отриманий на попередньому кроці.

16. Після цього поверніться до електронного листа та натисніть посилання, щоб «підтвердити запит». Найімовірніше, вам потрібно буде виконати цей і попередній кроки, щоб правильно налаштувати електронну пошту.

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

### Що таке застарілий безкоштовний посібник з надсилання пошти за допомогою Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Важливо:</strong> Цей застарілий безкоштовний посібник припинено з травня 2023 року, оскільки <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we тепер підтримує вихідний SMTP</a>. Якщо ви використовуєте наведений нижче посібник, то <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this призведе до того, що ваші вихідні електронні листи</a> відображатимуться як "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" у Gmail.</a></div>

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
Якщо ви виконали інструкції, наведені вище в розділі <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Як розпочати роботу та налаштувати пересилання електронної пошти</a>, ви можете продовжити читання нижче.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Як надсилати пошту за допомогою Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>"

<div id="legacy-free-guide">

1. Щоб це працювало, вам потрібно ввімкнути [двофакторну автентифікацію Gmail][gmail-2fa]. Якщо вона не ввімкнена, перейдіть за посиланням <https://www.google.com/landing/2step/>.

2. Після ввімкнення двофакторної автентифікації (або якщо вона вже була ввімкнена), перейдіть на сторінку <https://myaccount.google.com/apppasswords>.

3. Коли з’явиться запит «Виберіть програму та пристрій, для яких потрібно згенерувати пароль програми»:
* Виберіть «Пошта» у розкривному списку «Виберіть програму»
* Виберіть «Інше» у розкривному списку «Виберіть пристрій»
* Коли з’явиться запит на введення тексту, введіть адресу електронної пошти вашого власного домену, з якого ви пересилаєте (наприклад, <code><hello@example.com></code> – це допоможе вам відстежувати, якщо ви використовуєте цю службу для кількох облікових записів)

4. Скопіюйте пароль у буфер обміну, який буде згенеровано автоматично
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо ви користуєтеся G Suite, перейдіть до панелі адміністратора <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Програми <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Налаштування Gmail <i class="fa fa-angle-right"></i> Налаштування</a> та обов’язково встановіть прапорець «Дозволити користувачам надсилати пошту через зовнішній SMTP-сервер...». Активація цієї зміни може зайняти певну затримку, тому зачекайте кілька хвилин.
</span>
</div>

5. Перейдіть до розділу [Gmail](https://gmail.com) та в розділі [Налаштування <i class="fa fa-angle-right"></i> Облікові записи та імпорт <i class="fa fa-angle-right"></i> Надіслати пошту як](https://mail.google.com/mail/u/0/#settings/accounts) натисніть «Додати іншу адресу електронної пошти».

6. Коли з’явиться запит на «Ім’я», введіть ім’я, під яким ви хочете бачити свою електронну пошту як «Від» (наприклад, «Лінус Торвальдс»).

7. Коли з’явиться запит на «Адресу електронної пошти», введіть адресу електронної пошти з власним доменом, який ви використовували вище (наприклад, <code><hello@example.com></code>)

8. Зніміть прапорець «Вважати псевдонімом»

9. Натисніть кнопку «Наступний крок», щоб продовжити

10. Коли з’явиться запит на «SMTP-сервер», введіть <code>smtp.gmail.com</code> та залиште порт <code>587</code>

11. Коли з’явиться запит на «Ім’я користувача», введіть частину вашої адреси Gmail без частини <span>gmail.com</span> (наприклад, просто «користувач», якщо моя електронна адреса <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо частина «Ім’я користувача» заповнена автоматично, тоді <u><strong>вам потрібно буде змінити її</strong></u> на частину імені користувача вашої адреси Gmail.
</span>
</div>

12. Коли з’явиться запит на «Пароль», вставте з буфера обміну пароль, який ви згенерували на кроці 2 вище.

13. Залиште перемикач позначеним для пункту «Захищене з’єднання за допомогою TLS».

14. Натисніть кнопку «Додати обліковий запис», щоб продовжити

15. Відкрийте нову вкладку [Gmail](https://gmail.com) та зачекайте на надходження електронного листа з підтвердженням (ви отримаєте код підтвердження, який підтверджує, що ви є власником адреси електронної пошти, з якої ви намагаєтеся "Надіслати пошту від імені")

16. Щойно він надійде, скопіюйте та вставте код підтвердження у відповідь на запит, отриманий на попередньому кроці.

17. Після цього поверніться до електронного листа та натисніть посилання, щоб «підтвердити запит». Найімовірніше, вам потрібно буде виконати цей і попередній кроки, щоб електронна пошта була правильно налаштована.

</div>

### Розширена конфігурація маршрутизації Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
<span>15-30 хвилин</span>
</div>

Якщо ви хочете налаштувати розширену маршрутизацію в Gmail, щоб псевдоніми, які не відповідають поштовій скриньці, пересилалися на поштові сервіси Forward Email, виконайте такі дії:

1. Увійдіть до консолі адміністратора Google за адресою [admin.google.com](https://admin.google.com)
2. Перейдіть до розділу **Додатки → Google Workspace → Gmail → Маршрутизація**
3. Натисніть **Додати маршрут** та налаштуйте такі параметри:

**Налаштування для одного одержувача:**

* Виберіть «Змінити одержувача конверта» та введіть свою основну адресу Gmail
* Поставте прапорець «Додати заголовок X-Gm-Original-To з оригінальним одержувачем»

**Шаблони одержувачів конвертів:**

* Додати шаблон, який відповідає всім неіснуючим поштовим скринькам (наприклад, `.*@yourdomain.com`)

**Налаштування сервера електронної пошти:**

* Виберіть «Маршрут до хоста» та введіть `mx1.forwardemail.net` як основний сервер
* Додайте `mx2.forwardemail.net` як резервний сервер
* Встановіть порт на 25
* Виберіть «Вимагати TLS» для безпеки

4. Натисніть **Зберегти**, щоб створити маршрут

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо: </strong>
<span>
Ця конфігурація працюватиме лише для облікових записів Google Workspace з користувацькими доменами, а не для звичайних облікових записів Gmail.
</span>
</div>

### Розширена конфігурація маршрутизації Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
<span>15-30 хвилин</span>
</div>

Для користувачів Microsoft 365 (раніше Office 365), які хочуть налаштувати розширену маршрутизацію, щоб псевдоніми, що не відповідають поштовій скриньці, пересилалися на поштові сервери Forward Email:

1. Увійдіть до центру адміністрування Microsoft 365 за адресою [admin.microsoft.com](https://admin.microsoft.com)
2. Перейдіть до **Exchange → Потік пошти → Правила**
3. Натисніть **Додати правило** та виберіть **Створити нове правило**
4. Назвіть своє правило (наприклад, «Пересилати неіснуючі поштові скриньки на пересилання електронної пошти»)
5. У розділі **Застосувати це правило, якщо** виберіть:
* «Адреса одержувача відповідає...»
* Введіть шаблон, який відповідає всім адресам у вашому домені (наприклад, `*@yourdomain.com`)
6. У розділі **Виконайте такі дії** виберіть:
* «Перенаправити повідомлення на...»
* Виберіть «Наступний поштовий сервер»
* Введіть `mx1.forwardemail.net` та порт 25
* Додайте `mx2.forwardemail.net` як резервний сервер
7. У розділі **За винятком випадків** виберіть:
* «Одержувач —...»
* Додайте всі наявні поштові скриньки, які не слід пересилати
8. Встановіть пріоритет правила, щоб воно працювало після інших правил потоку пошти
9. Натисніть **Зберегти**, щоб активувати правило

## Виправлення неполадок {#troubleshooting}

### Чому я не отримую тестові електронні листи {#why-am-i-not-receiving-my-test-emails}

Якщо ви надсилаєте тестовий електронний лист самому собі, він може не відображатися у вашій поштовій скриньці, оскільки має той самий заголовок "Message-ID".

Це широко відома проблема, яка також впливає на такі сервіси, як Gmail. <a href="https://support.google.com/a/answer/1703601">Here – офіційна відповідь Gmail щодо цієї проблеми</a>.

Якщо проблеми продовжуються, то, найімовірніше, проблема пов’язана з поширенням DNS. Вам потрібно буде трохи зачекати та спробувати ще раз (або спробувати встановити менше значення TTL для ваших записів <strong class="notranslate">TXT</strong>).

**Все ще виникають проблеми?** Будь ласка, <a href="/help">зв’яжіться з нами</a>, щоб ми могли допомогти дослідити проблему та знайти швидке рішення.

### Як налаштувати мій поштовий клієнт для роботи з пересиланням електронної пошти {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Наш сервіс працює з популярними поштовими клієнтами, такими як:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Робочий стіл</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Термінал</a></li>
</ul>
</div>

<div class="alert alert-primary">
Ваше ім'я користувача — це адреса електронної пошти вашого псевдоніма, а пароль — з <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong> («Звичайний пароль»).
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Якщо ви використовуєте Thunderbird, переконайтеся, що для параметра «Безпека з’єднання» встановлено значення «SSL/TLS», а для методу автентифікації – значення «Звичайний пароль».</span>
</div>

| Тип | Ім'я хоста | Протокол | Порти |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Бажано** | __КОД_КОМІТКИ_0__ та __КОД_КОМІТКИ_1__ |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Бажано** або TLS (STARTTLS) | `465` та `2465` для SSL/TLS (або) `587`, `2587`, `2525` та `25` для TLS (STARTTLS) |

### Чому мої електронні листи потрапляють у спам і небажану пошту, і як я можу перевірити репутацію свого домену {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

У цьому розділі ви знайдете інструкції щодо того, чи ваша вихідна пошта використовує наші SMTP-сервери (наприклад, `smtp.forwardemail.net`) (або пересилається через `mx1.forwardemail.net` або `mx2.forwardemail.net`), і чи доставляється вона до папки «Спам» або «Небажана пошта» одержувачів.

Ми регулярно порівнюємо наш [IP-адреси](#what-are-your-servers-ip-addresses) з [усі авторитетні списки заборонених DNS-адрес](#how-do-you-handle-your-ip-addresses-becoming-blocked), **тому, найімовірніше, це проблема, пов’язана з репутацією домену**.

Листи можуть потрапляти до папки «Спам» з кількох причин:

1. **Відсутня автентифікація**: Налаштуйте записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) та [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Репутація домену**: Нові домени часто мають нейтральну репутацію, доки не сформують історію надсилання.

3. **Тригери контенту**: Певні слова або фрази можуть активувати спам-фільтри.

4. **Шаблони надсилання**: Раптове збільшення обсягу електронної пошти може виглядати підозріло.

Ви можете спробувати скористатися одним або кількома з цих інструментів, щоб перевірити репутацію та категоризацію вашого домену:

| Назва інструменту | URL | Тип |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Зворотній зв'язок щодо категоризації доменів Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Категоризація |
| Перевірка репутації IP-адрес та доменів Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Центр репутації IP-адрес та доменів Cisco Talos | <https://talosintelligence.com/reputation_center> | Репутація |
| Пошук IP-адрес та репутації домену Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Перевірка чорного списку MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Чорний список |
| Інструменти Google Postmaster | <https://www.gmail.com/postmaster/> | Репутація |
| Центр відправників Yahoo | <https://senders.yahooinc.com/> | Репутація |
| Перевірка чорного списку MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Оцінка відправника | <https://senderscore.org/act/blocklist-remover/> | Репутація |
| Знецінення | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Видалення IP-адрес Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Видалення |
| Видалення IP-адреси Cloudmark | <https://csi.cloudmark.com/en/reset/> | Видалення |
| СпамКоп | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Видалення IP-адрес Microsoft Outlook та Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Видалення |
| Рівні UCEPROTECT 1, 2 та 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| Backscatterer.org від UCEPROTECT | <https://www.backscatterer.org/> | Захист від зворотного розсіювання |
| Білий список UCEPROTECT.org | <https://www.whitelisted.org/> (потрібна плата) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Видалення |
| AOL/Verizon (наприклад, `[IPTS04]`) | <https://senders.yahooinc.com/> | Видалення |
| Кокс Комунікейшнз | `unblock.request@cox.net` | Видалення |
| t-online.de (німецька/T-Mobile) | `tobr@rx.t-online.de` | Видалення |

> \[!TIP]
> Почніть з невеликої кількості високоякісних електронних листів, щоб створити позитивну репутацію, перш ніж надсилати більші обсяги.

> \[!IMPORTANT]
> Якщо ваш домен перебуває у чорному списку, кожен чорний список має власну процедуру видалення. Перегляньте інструкції на їхніх вебсайтах.

> \[!TIP]
> Якщо вам потрібна додаткова допомога або ви виявите, що певний постачальник послуг електронної пошти помилково визначив нас як спам, будь ласка, <a href="/help">зв’яжіться з нами</a>.

### Що робити, якщо я отримую спам-листи {#what-should-i-do-if-i-receive-spam-emails}

Вам слід відписатися від списку розсилки (якщо можливо) та заблокувати відправника.

Будь ласка, не повідомляйте про спам, а натомість перешліть його до нашої системи запобігання зловживанням, яка регулюється вручну та зосереджена на конфіденційності.

**Адреса електронної пошти для пересилання спаму:** <abuse@forwardemail.net>

### Чому мої тестові електронні листи, надіслані мені в Gmail, відображаються як "підозрілі" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Якщо ви бачите це повідомлення про помилку в Gmail, коли надсилаєте собі тестове повідомлення, або коли людина, якій ви листуєтеся під своїм псевдонімом, вперше бачить ваш електронний лист, то **не хвилюйтеся** – це вбудована функція безпеки Gmail.

Ви можете просто натиснути «Виглядає безпечно». Наприклад, якщо ви надішлете тестове повідомлення за допомогою функції «Надіслати пошту як» (комусь іншому), то ця особа не побачить це повідомлення.

Однак, якщо вони побачать це повідомлення, це тому, що вони звикли бачити ваші електронні листи з адреси <john@gmail.com>, а не <john@customdomain.com> (просто приклад). Gmail попередить користувачів про це, щоб переконатися в безпеці, про всяк випадок, немає жодного обхідного шляху.

### Чи можна видалити функцію "via forwardemail" у Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ця тема пов'язана з [широко відома проблема в Gmail, коли поруч з іменем відправника відображається додаткова інформація](https://support.google.com/mail/answer/1311182).

Станом на травень 2023 року ми підтримуємо надсилання електронної пошти через SMTP як додатковий модуль для всіх платних користувачів, а це означає, що ви можете видалити <span class="notranslate">через forwardemail dot net</span> у Gmail.

Зверніть увагу, що ця тема поширених запитань стосується саме тих, хто використовує функцію [Як надсилати пошту за допомогою Gmail](#how-to-send-mail-as-using-gmail).

Будь ласка, дивіться розділ про [Чи підтримуєте ви надсилання електронної пошти через SMTP?](#do-you-support-sending-email-with-smtp) для отримання інструкцій щодо налаштування.

## Керування даними {#data-management}

### Де розташовані ваші сервери {#where-are-your-servers-located}

> \[!TIP]
> Незабаром ми можемо оголосити про розташування нашого центру обробки даних у ЄС під назвою [forwardemail.eu](https://forwardemail.eu). Підпишіться на обговорення за адресою <https://github.com/orgs/forwardemail/discussions/336>, щоб отримувати оновлення.

Наші сервери розташовані переважно в Денвері, штат Колорадо – повний список IP-адрес див. за посиланням <https://forwardemail.net/ips>.

Ви можете дізнатися більше про наших субпідрядників на сторінках [GDPR](/gdpr), [DPA](/dpa) та [Конфіденційність](/privacy).

### Як експортувати та створити резервну копію моєї поштової скриньки {#how-do-i-export-and-backup-my-mailbox}

Ви можете будь-коли експортувати свої поштові скриньки у форматах [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) або зашифрованих [SQLite](https://en.wikipedia.org/wiki/SQLite).

Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми <i class="fa fa-angle-right"></i> Завантажити резервну копію та виберіть потрібний тип формату експорту.

Після завершення експорту вам буде надіслано електронною поштою посилання для завантаження.

Зверніть увагу, що з міркувань безпеки це посилання для експорту дійсне через 4 години.

Якщо вам потрібно перевірити експортовані формати EML або Mbox, тоді ці інструменти з відкритим кодом можуть бути корисними:

| Ім'я | Формат | Платформа | URL-адреса GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Переглядач MBox | Mbox | Вікна | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Mbox | Усі платформи | <https://github.com/PHMRanger/mbox-web-viewer> |
| Зчитувач Eml | EML | Вікна | <https://github.com/ayamadori/EmlReader> |
| Переглядач електронної пошти | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader | EML | Усі платформи | <https://github.com/s0ph1e/eml-reader> |

Крім того, якщо вам потрібно конвертувати файл Mbox у файл EML, ви можете використовувати <https://github.com/noelmartinon/mboxzilla>.

### Як імпортувати та перенести мою існуючу поштову скриньку {#how-do-i-import-and-migrate-my-existing-mailbox}

Ви можете легко імпортувати свою електронну пошту до функції «Пересилати електронну пошту» (наприклад, за допомогою [Тандерберд](https://www.thunderbird.net)), виконавши наведені нижче інструкції:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Щоб імпортувати наявну електронну пошту, необхідно виконати всі наведені нижче кроки.
</span>
</div>

1. Експортуйте свою електронну пошту з вашого поточного постачальника послуг електронної пошти:

| Постачальник електронної пошти | Формат експорту | Інструкції з експорту |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Перспективи | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Порада:</strong> <span>Якщо ви використовуєте Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">формат експорту PST</a>), ви можете просто виконати інструкції в розділі «Інше» нижче. Однак, нижче ми надали посилання для конвертації PST у формат MBOX/EML залежно від вашої операційної системи:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba для Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst для Windows cygwin</a> – (наприклад, <code>readpst -u -o $OUT_DIR $IN_DIR</code> замінюючи <code>$OUT_DIR</code> та <code>$IN_DIR</code> на вихідний каталог та шляхи до вхідних каталогів відповідно).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst для Ubuntu/Linux</a> – (наприклад, <code>sudo apt-get install readpst</code>, а потім <code>readpst -u -o $OUT_DIR $IN_DIR</code>, замінивши <code>$OUT_DIR</code> та <code>$IN_DIR</code> на шляхи до вихідного каталогу та вхідного каталогу відповідно).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst для macOS (через brew)</a> – (наприклад, <code>brew install libpst</code>, а потім <code>readpst -u -o $OUT_DIR $IN_DIR</code>, замінивши <code>$OUT_DIR</code> та <code>$IN_DIR</code> зі шляхами до вихідного каталогу та вхідного каталогу відповідно).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST-конвертер для Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Швидка пошта | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Протонна пошта | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Тутанота | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Подумайте | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Зохо | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Інше | [Use Thunderbird](https://www.thunderbird.net) | Налаштуйте свій існуючий обліковий запис електронної пошти в Thunderbird, а потім скористайтеся плагіном [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) для експорту та імпорту електронної пошти. **Ви також можете просто копіювати/вставляти або перетягувати електронні листи між обліковими записами.** |

2. Завантажте, встановіть та відкрийте [Тандерберд](https://www.thunderbird.net).

3. Створіть новий обліковий запис, використовуючи повну адресу електронної пошти вашого псевдоніма (наприклад, <code><you@yourdomain.com></code>) та згенерований пароль. <strong>Якщо у вас ще немає згенерованого пароля, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">зверніться до наших інструкцій з налаштування</a></strong>.

4. Завантажте та встановіть плагін Thunderbird [Інструменти імпорту та експорту](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Створіть нову локальну папку в Thunderbird, а потім клацніть на ній правою кнопкою миші → виберіть опцію `ImportExportTools NG` → виберіть `Import mbox file` (для формату експорту MBOX) – або – `Import messages` / `Import all messages from a directory` (для формату експорту EML).

6. Перетягніть повідомлення з локальної папки до нової (або існуючої) папки IMAP у Thunderbird, куди ви хочете завантажити повідомлення у сховище IMAP за допомогою нашого сервісу. Це гарантує їх резервне копіювання онлайн за допомогою нашого зашифрованого сховища SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>
Якщо ви не знаєте, як імпортувати дані в Thunderbird, ви можете звернутися до офіційних інструкцій за адресами <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> та <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>."
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Після завершення процесу експорту та імпорту ви також можете ввімкнути пересилання у своєму існуючому обліковому записі електронної пошти та налаштувати автоматичну відповідь, щоб сповіщати відправників про нову адресу електронної пошти (наприклад, якщо ви раніше використовували Gmail, а тепер використовуєте електронну пошту з вашим власним доменним іменем).
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

### Чи підтримуєте ви самостійне розміщення {#do-you-support-self-hosting}

Так, станом на березень 2025 року ми підтримуємо варіант самостійного розміщення. Прочитайте блог [тут](https://forwardemail.net/blog/docs/self-hosted-solution). Перегляньте [самостійно розміщений путівник](https://forwardemail.net/self-hosted), щоб розпочати. А для тих, хто зацікавлений у більш детальній покроковій версії, перегляньте наші посібники на основі [Убунту](https://forwardemail.net/guides/selfhosted-on-ubuntu) або [Дебіан](https://forwardemail.net/guides/selfhosted-on-debian).

## Конфігурація електронної пошти {#email-configuration}

### Як розпочати роботу та налаштувати пересилання електронної пошти {#how-do-i-get-started-and-set-up-email-forwarding}

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
Уважно прочитайте та виконайте кроки з першого по восьмий, перелічені нижче. Обов’язково замініть адресу електронної пошти <code>user@gmail.com</code> на адресу електронної пошти, на яку ви хочете пересилати електронні листи (якщо вона ще не є правильною). Аналогічно обов’язково замініть <code>example.com</code> на ім’я вашого власного домену (якщо воно ще не є правильною).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Якщо ви вже десь зареєстрували своє доменне ім'я, то вам потрібно повністю пропустити цей крок і перейти до кроку два! В іншому випадку ви можете <a href="/domain-registration" rel="noopener noreferrer">натиснути тут, щоб зареєструвати своє доменне ім'я</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Ви пам'ятаєте, де ви зареєстрували свій домен? Як тільки ви це згадаєте, то виконайте наведені нижче інструкції:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Ви повинні відкрити нову вкладку та увійти до свого реєстратора домену. Ви можете легко натиснути на свого "Реєстратор" нижче, щоб зробити це автоматично. У цій новій вкладці ви повинні перейти на сторінку керування DNS у вашого реєстратора – і ми надали покрокові кроки навігації нижче у стовпці "Кроки для налаштування". Після того, як ви перейдете на цю сторінку в новій вкладці, ви можете повернутися до цієї вкладки та перейти до кроку три нижче.
<strong class="font-weight-bold">Не закривайте відкриту вкладку ще; вона знадобиться вам для подальших кроків!</strong>
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
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td> <td>Увійти <i class="fa fa-angle-right"></i> Центр доменів <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Редагувати налаштування DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Маршрут 53</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> Розміщені зони <i class="fa fa-angle-right"></i> (Виберіть свій домен)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> Мої сервери <i class="fa fa-angle-right"></i> Керування доменом <i class="fa fa-angle-right"></i> Менеджер DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ДЛЯ ROCK: Увійти <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> (Натисніть значок ▼ поруч із пунктом керування) <i class="fa fa-angle-right"></i> DNS
<br />
ДЛЯ СТАРІШОЇ ВЕРСІЇ: Увійти <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> Редактор зони <i class="fa fa-angle-right"></i> (Виберіть свій домен)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Зроблено легко</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Виберіть свій домен)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Керування</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Океан</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> Мережі <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Більше <i class="fa fa-angle-right"></i> Керування доменом</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> У режимі перегляду карток натисніть "керувати" для вашого домену <i class="fa fa-angle-right"></i> У режимі перегляду списку натисніть значок шестерні <i class="fa fa-angle-right"></i> DNS та сервери імен <i class="fa fa-angle-right"></i> DNS-записи</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Дивитися</a>
</td>
<td>Увійти <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> (натисніть значок шестерні) <i class="fa fa-angle-right"></i> Натисніть на DNS та сервери імен у меню ліворуч</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Увійти <i class="fa fa-angle-right"></i> Панель <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> Керування доменами <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Увійти <i class="fa fa-angle-right"></i> Огляд <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Простий редактор <i class="fa fa-angle-right"></i> Записи</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Увійти <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Редагувати зону</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Дивитися</a>
</td>
<td>Увійти <i class="fa fa-angle-right"></i> Керування моїми доменами <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Домени</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Дивитися</a>
</td>
<td>Увійти <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Налаштування DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8 <br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Дивитися</a>
</td>
<td>Увійти <i class="fa fa-angle-right"></i> Список доменів <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Розширений DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Увійти <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Налаштувати DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Рішення</a></td>
<td>Увійти <i class="fa fa-angle-right"></i> Менеджер облікових записів <i class="fa fa-angle-right"></i> Мої доменні імена <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Керування <i class="fa fa-angle-right"></i> Зміна напрямку домену <i class="fa fa-angle-right"></i> Розширений DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2 <br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Дивитися</a>
</td>
<td>Увійти <i class="fa fa-angle-right"></i> Керовані домени <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> Налаштування DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Увійти <i class="fa fa-angle-right"></i> Головне меню <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i>
Додаткові налаштування <i class="fa fa-angle-right"></i> Користувацькі записи</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Зараз</a></td>
<td>Використання "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [домен] '@' MX [значення запису] [пріоритет]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Увійти <i class="fa fa-angle-right"></i> Сторінка доменів <i class="fa fa-angle-right"></i> (Виберіть свій домен) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Увійти <i class="fa fa-angle-right"></i> Сторінка доменів <i class="fa fa-angle-right"></i> (Натисніть значок <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Виберіть «Керування записами DNS»</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Увійти <i class="fa fa-angle-right"></i> Домени <i class="fa fa-angle-right"></i> Мої домени</td>
</tr>
<tr>
<td>Інше</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Важливо:</strong> Не бачите тут імені вашого реєстратора? Просто знайдіть в Інтернеті "як змінити записи DNS на $REGISTRAR" (замініть $REGISTRAR на ім'я вашого реєстратора – наприклад, "як змінити записи DNS на GoDaddy", якщо ви користуєтеся GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Використовуючи сторінку керування DNS вашого реєстратора (інша вкладка, яку ви відкрили), встановіть такі записи "MX":

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Зверніть увагу, що НЕ ПОТРІБНО встановлювати інших записів MX. Обидва записи, показані нижче, ПОВИННІ існувати. Переконайтеся, що немає друкарських помилок; і що ви правильно написали обидва записи mx1 та mx2. Якщо записи MX вже існували, будь ласка, повністю видаліть їх.
Значення "TTL" не обов'язково має бути 3600, воно може бути меншим або більшим, якщо необхідно.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Ім'я/Хост/Псевдонім</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Пріоритет</th>
<th>Відповідь/Значення</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Використовуючи сторінку керування DNS вашого реєстратора (інша вкладка, яку ви відкрили), встановіть такі записи <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо у вас платний план, ви повинні повністю пропустити цей крок і перейти до кроку п'ятого! Якщо у вас не платний план, ваші переадресовані адреси будуть доступні для загального пошуку – перейдіть до розділу <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> та за бажанням оновіть свій домен до платного плану. Якщо ви хочете дізнатися більше про платні плани, перегляньте нашу сторінку <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Ціни</a>. В іншому випадку ви можете продовжити вибирати одну або кілька комбінацій з варіантів A до варіантів F, перелічених нижче.

</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Варіант A:
</strong>
<span>
Якщо ви пересилаєте всі електронні листи зі свого домену (наприклад, "all@example.com", "hello@example.com" тощо) на певну адресу "user@gmail.com":
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
<td><em>"@", ".", або пусте</em></td>
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
Обов’язково замініть значення вище у стовпці «Значення» на власну адресу електронної пошти. Значення «TTL» не обов’язково має бути 3600, за потреби воно може бути меншим або більшим. Менше значення часу життя («TTL») забезпечить швидше поширення будь-яких майбутніх змін, внесених до ваших DNS-записів, по всьому Інтернету – уявіть собі це як час кешування в пам’яті (у секундах). Ви можете дізнатися більше про <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL у Вікіпедії</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Варіант B:
</strong>
<span>
Якщо вам потрібно переадресувати лише одну адресу електронної пошти (наприклад, <code>hello@example.com</code> на <code>user@gmail.com</code>; це також автоматично переадресує "hello+test@example.com" на "user+test@gmail.com"):
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
<td><em>"@", ".", або пусте</em></td>
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
Якщо ви пересилаєте кілька електронних листів, розділіть їх комою:
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
<td><em>"@", ".", або пусте</em></td>
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
Ви можете налаштувати нескінченну кількість пересилань електронних листів – просто переконайтеся, що ви не переносите більше 255 символів в один рядок і починаєте кожен рядок з "forward-email=". Приклад наведено нижче:
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
<td><em>"@", ".", або порожній рядок</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", або порожній рядок</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", або порожній символ</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", або порожній символ</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", або пусте поле</em></td>
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
Ви також можете вказати доменне ім'я у своєму записі <strong class="notranslate">TXT</strong>, щоб мати глобальну переадресацію псевдонімів (наприклад, "user@example.com" буде переадресовано на "user@example.net"):
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
<td><em>"@", ".", або пусте</em></td>
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
Ви навіть можете використовувати вебхуки як глобальний або індивідуальний псевдонім для пересилання електронних листів. Дивіться приклад і повний розділ про вебхуки під назвою <a href="#do-you-support-webhooks" class="alert-link">Чи підтримуєте ви вебхуки</a> нижче.
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
<td><em>"@", ".", або пусте</em></td>
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
Ви навіть можете використовувати регулярні вирази ("regex") для зіставлення псевдонімів та обробки підстановок для пересилання електронних листів. Дивіться приклади та повний розділ про регулярні вирази під назвою <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Чи підтримуєте ви регулярні вирази чи регулярні вирази</a> нижче.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Потрібен розширений регулярний вираз із підстановкою?</strong> Дивіться приклади та повний розділ про регулярні вирази під назвою <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Чи підтримуєте ви регулярні вирази чи регулярні вирази</a> нижче.</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Простий приклад:</strong> Якщо я хочу, щоб усі електронні листи, що надходять на адресу `linus@example.com` або `torvalds@example.com`, пересилалися на адресу `user@gmail.com`:
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
<td><em>"@", ".", або пусте</em></td>
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
Загальні правила переадресації також можна описати як "прохідні".
Це означає, що вхідні електронні листи, які відповідають принаймні одному конкретному правилу переадресації, будуть використовуватися замість загального правила. До певних правил належать адреси електронної пошти та регулярні вирази.
<br /><br />
Наприклад:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Електронні листи, надіслані на адресу <code>hello@example.com</code>, **не** будуть пересилатися на <code>second@gmail.com</code> (загальне правило) з цією конфігурацією, а натомість будуть доставлені лише на адресу <code>first@gmail.com</code>.
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
<td><em>"@", ".", або пусто</em></td>
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
Якщо ви використовуєте Gmail (наприклад, «Надіслати пошту як») або G Suite, вам потрібно додати <code>include:_spf.google.com</code> до наведеного вище значення, наприклад:
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
Якщо у вас вже є подібний рядок з "v=spf1", вам потрібно додати <code>include:spf.forwardemail.net</code> безпосередньо перед будь-якими існуючими записами "include:host.com" та перед "-all" у тому ж рядку, наприклад:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Зверніть увагу, що існує різниця між "-all" та "~all". "-" вказує на те, що перевірка SPF має завершитися невдачею (FAIL), якщо не збігається, а "~" вказує на те, що перевірка SPF має завершитися невдачею (SOFTFAIL). Ми рекомендуємо використовувати підхід "-all" для запобігання підробці домену.

<br /><br />
Вам також може знадобитися додати SPF-запис для будь-якого хоста, з якого ви надсилаєте пошту (наприклад, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Перевірте свої DNS-записи за допомогою нашого інструмента «Перевірити записи», доступного в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування.

</li><li class="mb-2 mb-md-3 mb-lg-5">Надішліть тестовий електронний лист, щоб підтвердити його роботу. Зверніть увагу, що поширення ваших DNS-записів може зайняти деякий час.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>
</span>
Якщо ви не отримуєте тестові електронні листи або отримуєте тестовий лист із написом «Будьте обережні з цим повідомленням», перегляньте відповіді на запитання <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Чому я не отримую свої тестові електронні листи</a> та <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Чому мої тестові електронні листи, надіслані мені в Gmail, відображаються як «підозрілі»</a> відповідно.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Якщо ви хочете «Надсилати пошту від імені» з Gmail, вам потрібно <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">переглянути це відео</a></strong> або виконати кроки, наведені в розділі <a href="#how-to-send-mail-as-using-gmail">How, щоб надсилати пошту від імені за допомогою Gmail</a> нижче.

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
Додаткові доповнення перелічені нижче. Зверніть увагу, що ці доповнення є повністю необов'язковими та можуть бути не обов'язковими. Ми хотіли б принаймні надати вам додаткову інформацію, якщо це необхідно.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Додатковий додаток:
</strong>
<span>
Якщо ви використовуєте функцію <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How для надсилання пошти як через Gmail</a>, можливо, вам варто додати себе до білого списку. Див. <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">ці інструкції від Gmail</a> з цієї теми.
</span>
</div>

### Чи можу я використовувати кілька бірж та серверів MX для розширеного переадресування {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Так, але **у ваших DNS-записах має бути зазначено лише один обмін MX**.

Не намагайтеся використовувати "Пріоритет" як спосіб налаштування кількох обмінів MX.

Натомість вам потрібно налаштувати вашу існуючу біржу MX на пересилання пошти для всіх невідповідних псевдонімів на біржі нашого сервісу (`mx1.forwardemail.net` та/або `mx2.forwardemail.net`).

Якщо ви користуєтеся Google Workspace і хочете переадресувати всі невідповідні псевдоніми до нашого сервісу, див. <https://support.google.com/a/answer/6297084>.

Якщо ви використовуєте Microsoft 365 (Outlook) і хочете переадресувати всі невідповідні псевдоніми до нашої служби, див. <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> та <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Як налаштувати автоматичну відповідь про відсутність на роботі {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми та створіть або відредагуйте псевдонім, для якого ви хочете налаштувати автовідповідач під час відпустки.

Ви можете налаштувати дату початку, дату завершення, тему та повідомлення, а також увімкнути або вимкнути їх у будь-який час:

* Наразі підтримуються тема та повідомлення у вигляді простого тексту (ми використовуємо пакет `striptags` для видалення будь-якого HTML-коду).
* Довжина теми обмежена 100 символами. * Довжина повідомлення обмежена 1000 символами.
* Для налаштування потрібне налаштування вихідного SMTP (наприклад, вам потрібно буде налаштувати записи DNKIM, DMARC та Return-Path).
* Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Налаштування вихідного SMTP та дотримуйтесь інструкцій з налаштування.
* Автовідповідач не можна ввімкнути для глобальних доменних імен (наприклад, [одноразові адреси](/disposable-addresses) не підтримуються).
* Автоматичну відповідь не можна ввімкнути для псевдонімів із символами підстановки/загальними символами (`*`) або регулярними виразами.

На відміну від поштових систем, таких як `postfix` (наприклад, що використовують розширення фільтра відпусток `sieve`), функція «Пересилання електронної пошти» автоматично додає ваш підпис DKIM, виправляє проблеми з підключенням до відповідей про відпустку (наприклад, через поширені проблеми з підключенням SSL/TLS та застарілі сервери) і навіть підтримує шифрування Open WKD та PGP для відповідей про відпустку.

<!--* Щоб запобігти зловживанням, за кожне надіслане повідомлення автовідповідача у відпустці буде списано 1 кредит вихідного SMTP.
* Усі платні облікові записи за замовчуванням включають 300 кредитів на день. Якщо вам потрібна більша сума, будь ласка, зв’яжіться з нами.
-->

1. Ми надсилаємо повідомлення кожному відправнику [у білому списку](#do-you-have-an-allowlist) лише раз на 4 дні (що схоже на поведінку Gmail).

* Наш кеш Redis використовує відбиток `alias_id` та `sender`, тоді як `alias_id` – це псевдонім MongoDB ID, а `sender` – це або адреса відправника (якщо в дозволеному списку), або кореневий домен в адресі відправника (якщо не в дозволеному списку). Для спрощення термін дії цього відбитка в кеші встановлено на 4 дні.

* Наш підхід, що використовує кореневий домен, проаналізований в адресі відправника, для відправників, які не входять до білого списку, запобігає зловживанням з боку відносно невідомих відправників (наприклад, зловмисників) шляхом переповнення повідомлень автовідповідача про відпустку.

2. Ми надсилаємо листи лише тоді, коли поля MAIL FROM та/або From не є порожніми та не містять (без урахування регістру) [ім'я користувача поштмейстера](#what-are-postmaster-addresses) (частина перед символом @ в електронному листі).

3. Ми не надсилаємо повідомлення, якщо воно містило будь-який із наступних заголовків (без урахування регістру):

* Заголовок `auto-submitted` зі значенням, відмінним від `no`.
* Заголовок `x-auto-response-suppress` зі значенням `dr`, `autoreply`, `auto-reply`, `auto_reply` або `all`
* Заголовок `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 або `no`7 (незалежно від значення).
* Заголовок `no`8 зі значенням `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 або `x-auto-response-suppress`3.

4. Ми не надсилаємо листи, якщо адреса електронної пошти MAIL FROM або From закінчується на `+donotreply`, `-donotreply`, `+noreply` або `-noreply`.

5. Ми не надсилаємо повідомлення, якщо частина імені користувача в адресі електронної пошти відправника мала значення `mdaemon`, а заголовок `X-MDDSN-Message` не враховував регістр.

6. Ми не надсилаємо, якщо в заголовку `multipart/report` був регістронечутливий заголовок `content-type`.

### Як налаштувати SPF для пересилання електронної пошти {#how-do-i-set-up-spf-for-forward-email}

Використовуючи сторінку керування DNS вашого реєстратора, налаштуйте наступний запис <strong class="notranslate">TXT</strong>:

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
<td><em>"@", ".", або пусто</em></td>
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
Якщо ви використовуєте Gmail (наприклад, «Надіслати пошту як») або G Suite, вам потрібно додати <code>include:_spf.google.com</code> до наведеного вище значення, наприклад:
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
Якщо у вас вже є подібний рядок з "v=spf1", вам потрібно додати <code>include:spf.forwardemail.net</code> безпосередньо перед будь-якими існуючими записами "include:host.com" та перед "-all" у тому ж рядку, наприклад:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Зверніть увагу, що існує різниця між "-all" та "~all". "-" вказує на те, що перевірка SPF має завершитися невдачею (FAIL), якщо не збігається, а "~" вказує на те, що перевірка SPF має завершитися невдачею (SOFTFAIL). Ми рекомендуємо використовувати підхід "-all" для запобігання підробці домену.

<br /><br />
Вам також може знадобитися додати SPF-запис для будь-якого хоста, з якого ви надсилаєте пошту (наприклад, Outlook).
</span>
</div>

### Як налаштувати DKIM для пересилання електронної пошти {#how-do-i-set-up-dkim-for-forward-email}

Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP та дотримуйтесь інструкцій з налаштування.

### Як налаштувати DMARC для пересилання електронної пошти {#how-do-i-set-up-dmarc-for-forward-email}

Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP та дотримуйтесь інструкцій з налаштування.

### Як підключити та налаштувати мої контакти {#how-do-i-connect-and-configure-my-contacts}

**Щоб налаштувати контакти, використовуйте URL-адресу CardDAV:** `https://carddav.forwardemail.net` (або просто `carddav.forwardemail.net`, якщо ваш клієнт це дозволяє)**

### Як підключити та налаштувати мої календарі {#how-do-i-connect-and-configure-my-calendars}

Щоб налаштувати календар, використовуйте URL-адресу CalDAV: ** `https://caldav.forwardemail.net` (або просто `caldav.forwardemail.net`, якщо ваш клієнт це дозволяє)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Приклад налаштування пересилання електронної пошти в календарі CalDAV Thunderbird" />

### Як додати більше календарів та керувати існуючими календарями {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Якщо ви хочете додати додаткові календарі, просто додайте нову URL-адресу календаря: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**обов’язково замініть `calendar-name` на потрібну назву календаря**)

Ви можете змінити назву та колір календаря після його створення – просто скористайтеся улюбленою програмою календаря (наприклад, Apple Mail або [Тандерберд](https://thunderbird.net)).

### Як налаштувати SRS для пересилання електронної пошти {#how-do-i-set-up-srs-for-forward-email}

Ми автоматично налаштовуємо [Схема перезапису відправника](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – вам не потрібно робити це самостійно.

### Як налаштувати MTA-STS для пересилання електронної пошти {#how-do-i-set-up-mta-sts-for-forward-email}

Будь ласка, зверніться до [наш розділ про MTA-STS](#do-you-support-mta-sts) для отримання додаткової інформації.

### Як додати зображення профілю до моєї адреси електронної пошти {#how-do-i-add-a-profile-picture-to-my-email-address}

Якщо ви користуєтеся Gmail, виконайте наведені нижче дії.

1. Перейдіть до <https://google.com> та вийдіть з усіх облікових записів електронної пошти
2. Натисніть «Увійти» та у випадаючому списку виберіть «інший обліковий запис»
3. Виберіть «Використати інший обліковий запис»
4. Виберіть «Створити обліковий запис»
5. Виберіть «Використовувати мою поточну адресу електронної пошти»
6. Введіть адресу електронної пошти вашого власного доменного імені
7. Отримайте електронний лист із підтвердженням, надісланий на вашу адресу електронної пошти
8. Введіть код підтвердження з цього листа
9. Заповніть інформацію профілю для вашого нового облікового запису Google
10. Погодьтеся з усіма політиками конфіденційності та Умовами використання
11. Перейдіть до <https://google.com> та у верхньому правому куті натисніть на значок вашого профілю, а потім натисніть кнопку «змінити»
12. Завантажте нове фото або аватар для вашого облікового запису
13. Зміни займуть приблизно 1-2 години, але іноді це може бути дуже швидко.
14. Надішліть тестовий електронний лист, і фотографія профілю має з’явитися.

## Розширені функції {#advanced-features}

### Чи підтримуєте ви розсилку новин або списків розсилки для маркетингової електронної пошти? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Так, ви можете прочитати більше за адресою <https://forwardemail.net/guides/newsletter-with-listmonk>.

Зверніть увагу, що для підтримки репутації IP-адреси та забезпечення доставки, Forward Email має ручний процес перевірки для кожного домену для **схвалення розсилки**. Надішліть електронного листа на адресу <support@forwardemail.net> або створіть [запит на допомогу](https://forwardemail.net/help) для схвалення. Зазвичай це займає менше 24 годин, більшість запитів обробляються протягом 1-2 годин. Найближчим часом ми плануємо зробити цей процес миттєвим, додавши додаткові засоби контролю спаму та сповіщення. Цей процес гарантує, що ваші електронні листи потраплять до папки "Вхідні", і ваші повідомлення не будуть позначені як спам.

### Чи підтримуєте ви надсилання електронної пошти за допомогою API {#do-you-support-sending-email-with-api}

Так, станом на травень 2023 року ми підтримуємо надсилання електронної пошти з API як доповнення для всіх платних користувачів.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a>, <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> та <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Обмеження вихідного SMTP</a> – ваше використання вважається підтвердженням та згодою.
</span>
</div>

Будь ласка, перегляньте розділ про [Електронні листи](/email-api#outbound-emails) у нашій документації API, щоб отримати доступ до опцій, прикладів та додаткової інформації.

Щоб надсилати вихідні електронні листи за допомогою нашого API, вам потрібно використовувати свій токен API, доступний у розділі [Моя безпека](/my-account/security).

### Чи підтримується отримання електронної пошти через IMAP {#do-you-support-receiving-email-with-imap}

Так, станом на 16 жовтня 2023 року ми підтримуємо отримання електронної пошти через IMAP як додатковий додаток для всіх платних користувачів. **Будь ласка, прочитайте нашу детальну статтю** про [як працює наша функція зашифрованого сховища поштових скриньок SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-інструкції">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a> та <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> – ваше використання вважається підтвердженням та згодою.
</span>
</div>

1. Створіть новий псевдонім для свого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

2. Натисніть кнопку <strong class="text-success"><i class="fa fa-key"></i> «Згенерувати пароль»</strong> поруч із щойно створеним псевдонімом. Скопіюйте його в буфер обміну та надійно збережіть згенерований пароль, який відображається на екрані.

3. Використовуючи бажаний поштовий додаток, додайте або налаштуйте обліковий запис із щойно створеним псевдонімом (наприклад, <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Ми рекомендуємо використовувати <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> або <a href="/blog/open-source" class="alert-link" target="_blank">альтернатива з відкритим вихідним кодом, орієнтована на конфіденційність</a>.</span>
</div>

4. Коли буде запропоновано ввести ім'я сервера IMAP, введіть `imap.forwardemail.net`

5. Коли буде запропоновано ввести порт сервера IMAP, введіть `993` (SSL/TLS) – див. [альтернативні порти IMAP](/faq#what-are-your-imap-server-configuration-settings) за потреби
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Якщо ви використовуєте Thunderbird, переконайтеся, що для параметра «Безпека з’єднання» встановлено значення «SSL/TLS», а для методу автентифікації – значення «Звичайний пароль».</span>
</div>

6. Коли буде запропоновано ввести пароль сервера IMAP, вставте пароль з розділу <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong> у кроці 2 вище.

7. **Збережіть свої налаштування** – якщо у вас виникли проблеми, будь ласка, <a href="/help">зв’яжіться з нами</a>

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

### Чи підтримуєте ви POP3 {#do-you-support-pop3}

Так, станом на 4 грудня 2023 року ми підтримуємо [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) як доповнення для всіх платних користувачів. **Будь ласка, прочитайте нашу детальну статтю** про [як працює наша функція зашифрованого сховища поштових скриньок SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-інструкції">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a> та <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> – ваше використання вважається підтвердженням та згодою.
</span>
</div>

1. Створіть новий псевдонім для свого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

2. Натисніть кнопку <strong class="text-success"><i class="fa fa-key"></i> «Згенерувати пароль»</strong> поруч із щойно створеним псевдонімом. Скопіюйте його в буфер обміну та надійно збережіть згенерований пароль, який відображається на екрані.

3. Використовуючи бажаний поштовий додаток, додайте або налаштуйте обліковий запис із щойно створеним псевдонімом (наприклад, <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Ми рекомендуємо використовувати <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> або <a href="/blog/open-source" class="alert-link" target="_blank">альтернатива з відкритим вихідним кодом, орієнтована на конфіденційність</a>.</span>
</div>

4. Коли буде запропоновано ввести ім'я POP3-сервера, введіть `pop3.forwardemail.net`

5. Коли буде запропоновано ввести порт POP3-сервера, введіть `995` (SSL/TLS) – див. [альтернативні порти POP3](/faq#what-are-your-pop3-server-configuration-settings) за потреби
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Якщо ви використовуєте Thunderbird, переконайтеся, що для параметра «Безпека з’єднання» встановлено значення «SSL/TLS», а для методу автентифікації – значення «Звичайний пароль».</span>
</div>

6. Коли буде запропоновано ввести пароль POP3-сервера, вставте пароль з розділу <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong> у кроці 2 вище.

7. **Збережіть свої налаштування** – якщо у вас виникли проблеми, будь ласка, <a href="/help">зв’яжіться з нами</a>

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

### Чи підтримуєте ви календарі (CalDAV) {#do-you-support-calendars-caldav}

Так, станом на 5 лютого 2024 року ми додали цю функцію. Наш сервер має ім’я `caldav.forwardemail.net`, і його стан також відстежується на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці стану</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порт `443` (HTTPS).

| Вхід | Приклад | Опис |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com` | Адреса електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль | `************************` | Пароль, згенерований для певного псевдоніма. |

Щоб користуватися підтримкою календаря, **користувач** має бути адресою електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>, а **пароль** має бути паролем, згенерованим для певного псевдоніма.

### Чи підтримуєте ви контакти (CardDAV) {#do-you-support-contacts-carddav}

Так, станом на 12 червня 2025 року ми додали цю функцію. Наш сервер має ім’я `carddav.forwardemail.net`, і його стан також відстежується на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці стану</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порт `443` (HTTPS).

| Вхід | Приклад | Опис |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com` | Адреса електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль | `************************` | Пароль, згенерований для певного псевдоніма. |

Щоб скористатися підтримкою контактів, **користувач** має бути адресою електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>, а **пароль** має бути паролем, згенерованим для певного псевдоніма.

### Чи підтримується надсилання електронної пошти через SMTP {#do-you-support-sending-email-with-smtp}

Так, станом на травень 2023 року ми підтримуємо надсилання електронної пошти через SMTP як додатковий сервіс для всіх платних користувачів.

<div id="smtp-інструкції">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Будь ласка, переконайтеся, що ви прочитали наші <a href="/terms" class="alert-link" target="_blank">Умови</a>, <a href="/privacy" class="alert-link" target="_blank">Політику конфіденційності</a> та <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ліміти вихідного SMTP</a> – ваше використання вважається підтвердженням та згодою.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо ви користуєтеся Gmail, зверніться до нашого <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">посібника «Надсилання пошти як у Gmail»</a>. Якщо ви розробник, зверніться до нашої <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документації API електронної пошти</a>.
</span>
</div>

1. Перейдіть до розділу <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Налаштування <i class="fa fa-angle-right"></i> Конфігурація вихідного SMTP та дотримуйтесь інструкцій з налаштування

2. Створіть новий псевдонім для свого домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code><hello@example.com></code>)

3. Натисніть кнопку <strong class="text-success"><i class="fa fa-key"></i> «Згенерувати пароль»</strong> поруч із щойно створеним псевдонімом. Скопіюйте його в буфер обміну та надійно збережіть згенерований пароль, який відображається на екрані.

4. Використовуючи бажаний поштовий додаток, додайте або налаштуйте обліковий запис із щойно створеним псевдонімом (наприклад, <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Ми рекомендуємо використовувати <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> або <a href="/blog/open-source" class="alert-link" target="_blank">альтернатива з відкритим вихідним кодом, орієнтована на конфіденційність</a>.</span>
</div>

5. Коли буде запропоновано ввести ім'я SMTP-сервера, введіть `smtp.forwardemail.net`

6. Коли буде запропоновано ввести порт SMTP-сервера, введіть `465` (SSL/TLS) – див. [альтернативні SMTP-порти](/faq#what-are-your-smtp-server-configuration-settings) за потреби
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>Якщо ви використовуєте Thunderbird, переконайтеся, що для параметра «Безпека з’єднання» встановлено значення «SSL/TLS», а для методу автентифікації – значення «Звичайний пароль».</span>
</div>

7. Коли буде запропоновано ввести пароль SMTP-сервера, вставте пароль з розділу <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong> у кроці 3 вище.

8. **Збережіть налаштування та надішліть перший тестовий електронний лист** – якщо у вас виникли проблеми, будь ласка, <a href="/help">зв’яжіться з нами</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Зверніть увагу, що для підтримки репутації IP-адреси та забезпечення доставки ми маємо процес ручної перевірки для кожного домену для схвалення вихідного SMTP-повідомлення. Зазвичай це займає менше 24 годин, причому більшість запитів обробляються протягом 1-2 годин. Найближчим часом ми плануємо зробити цей процес миттєвим, додавши додаткові засоби контролю спаму та сповіщення. Цей процес гарантує, що ваші електронні листи потраплять до папки "Вхідні", і ваші повідомлення не будуть позначені як спам.
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

### Чи підтримуєте ви OpenPGP/MIME, наскрізне шифрування ("E2EE") та каталог веб-ключів ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Так, ми підтримуємо [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [наскрізне шифрування ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) та виявлення відкритих ключів за допомогою [Веб-довідник ключів ("WKD")](https://wiki.gnupg.org/WKD). Ви можете налаштувати OpenPGP за допомогою [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) або [самостійно розміщувати власні ключі](https://wiki.gnupg.org/WKDHosting) (див. [ця суть для налаштування сервера WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Пошукові запити WKD кешуються протягом 1 години для забезпечення своєчасної доставки електронної пошти → тому, якщо ви додаєте, змінюєте або видаляєте свій ключ WKD, надішліть нам електронного листа на адресу `support@forwardemail.net`, вказавши свою адресу електронної пошти, щоб ми вручну очистили кеш.
* Ми підтримуємо шифрування PGP для повідомлень, які пересилаються через пошук WKD або за допомогою завантаженого ключа PGP на нашому інтерфейсі.
* Завантажені ключі мають переважну силу, якщо прапорець PGP увімкнено/позначено.
* Повідомлення, надіслані на вебхуки, наразі не шифруються за допомогою PGP.
* Якщо у вас є кілька псевдонімів, які відповідають заданій адресі пересилання (наприклад, регулярний вираз/підстановочний знак/точна комбінація), і якщо більше одного з них містить завантажений ключ PGP і має перевірку PGP → тоді ми надішлемо вам електронний лист із сповіщенням про помилку та не зашифруємо повідомлення за допомогою вашого завантаженого ключа PGP. Це трапляється дуже рідко і зазвичай стосується лише досвідчених користувачів зі складними правилами псевдонімів.
* **Шифрування PGP не застосовуватиметься до пересилання електронної пошти через наші MX-сервери, якщо відправник мав політику відхилення DMARC. Якщо вам потрібне шифрування PGP для *всієї* пошти, радимо скористатися нашою службою IMAP та налаштувати ключ PGP для вашого псевдоніма для вхідної пошти.**

Ви можете перевірити налаштування каталогу веб-ключів за адресою <https://wkd.chimbosonic.com/> (відкритий код) або <https://www.webkeydirectory.com/> (власний код).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Автоматичне шифрування:
</strong>
<span>Якщо ви використовуєте нашу <a href="#do-you-support-sending-email-with-smtp" class="alert-link">вихідну SMTP-службу</a> та надсилаєте незашифровані повідомлення, ми автоматично намагатимемося зашифрувати повідомлення для кожного одержувача, використовуючи <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Каталог ключів ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Щоб увімкнути OpenPGP для вашого власного доменного імені, необхідно виконати всі наступні кроки.
</span>
</div>

1. Завантажте та встановіть рекомендований плагін вашого поштового клієнта нижче:

| Поштовий клієнт | Платформа | Рекомендований плагін | Нотатки |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Тандерберд | Робочий стіл | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird має вбудовану підтримку OpenPGP. |
| Gmail | Браузер | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (ліцензія на власність) | Gmail не підтримує OpenPGP, проте ви можете завантажити плагін з відкритим кодом [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail не підтримує OpenPGP, проте ви можете завантажити плагін з відкритим кодом [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) або [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (ліцензія на власність) | Apple Mail не підтримує OpenPGP, проте ви можете завантажити плагін з відкритим кодом [PGPro](https://github.com/opensourceios/PGPro/) або [FlowCrypt](https://flowcrypt.com/download). |
| Перспективи | Вікна | [gpg4win](https://www.gpg4win.de/index.html) | Поштовий клієнт Outlook для настільних комп’ютерів не підтримує OpenPGP, проте ви можете завантажити плагін з відкритим кодом [gpg4win](https://www.gpg4win.de/index.html). |
| Перспективи | Браузер | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (ліцензія на власність) | Веб-клієнт поштового клієнта Outlook не підтримує OpenPGP, проте ви можете завантажити плагін з відкритим кодом [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download). |
| Андроїд | Мобільний | [OpenKeychain](https://www.openkeychain.org/) або [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), такі як [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) та [FairEmail](https://github.com/M66B/FairEmail), підтримують плагін з відкритим кодом [OpenKeychain](https://www.openkeychain.org/). Ви також можете використовувати плагін з відкритим кодом (власна ліцензія) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Браузер | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (ліцензія на власність) | Ви можете завантажити розширення для браузера з відкритим кодом [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download). |
| Мозіла Фаєрфокс | Браузер | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (ліцензія на власність) | Ви можете завантажити розширення для браузера з відкритим кодом [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Браузер | [Mailvelope](https://mailvelope.com/) | Ви можете завантажити розширення для браузера з відкритим кодом [Mailvelope](https://mailvelope.com/). |
| Хоробрий | Браузер | [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download) (ліцензія на власність) | Ви можете завантажити розширення для браузера з відкритим кодом [Mailvelope](https://mailvelope.com/) або [FlowCrypt](https://flowcrypt.com/download). |
| Бальза | Робочий стіл | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa має вбудовану підтримку OpenPGP. |
| KMail | Робочий стіл | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail має вбудовану підтримку OpenPGP. |
| Еволюція GNOME | Робочий стіл | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution має вбудовану підтримку OpenPGP. |
| Термінал | Робочий стіл | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Ви можете скористатися програмою з відкритим кодом [gpg command line tool](https://www.gnupg.org/download/) для створення нового ключа з командного рядка. |

2. Відкрийте плагін, створіть свій відкритий ключ і налаштуйте свій поштовий клієнт для його використання.

3. Завантажте свій відкритий ключ за адресою <https://keys.openpgp.org/upload>.

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
Додатковий додаток:
</strong>
<span>
Якщо ви користуєтеся нашою службою <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">зашифрованого сховища (IMAP/POP3)</a> і хочете, щоб <i>вся</i> електронна пошта, що зберігається у вашій (вже зашифрованій) базі даних SQLite, була зашифрована вашим відкритим ключем, перейдіть до <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми (наприклад, <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Відредагуйте <i class="fa fa-angle-right"></i> OpenPGP та завантажте свій відкритий ключ.
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
<span>Якщо ваш псевдонім використовує наші <a class="alert-link" href="/disposable-addresses" target="_blank">домени для одноразового використання</a> (наприклад, <code>hideaddress.net</code>), ви можете пропустити цей крок.</span>
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

### Чи підтримуєте ви MTA-STS {#do-you-support-mta-sts}

Так, станом на 2 березня 2023 року ми підтримуємо [MTA-STS](https://www.hardenize.com/blog/mta-sts). Ви можете використовувати [цей шаблон](https://github.com/jpawlowski/mta-sts.template), якщо хочете ввімкнути його у своєму домені.

Нашу конфігурацію можна знайти публічно на GitHub за адресою <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Чи підтримуєте ви ключі доступу та веб-автентифікацію {#do-you-support-passkeys-and-webauthn}

Так! З 13 грудня 2023 року ми додали підтримку ключів доступу [через високий попит](https://github.com/orgs/forwardemail/discussions/182).

Ключі доступу дозволяють безпечно входити в систему без необхідності введення пароля та двофакторної автентифікації.

Ви можете підтвердити свою особу за допомогою дотику, розпізнавання обличчя, пароля на основі пристрою або PIN-коду.

Ми дозволяємо вам керувати до 30 ключами доступу одночасно, щоб ви могли легко входити в систему з усіх своїх пристроїв.

Дізнайтеся більше про ключі доступу за наступними посиланнями:

* [Вхід у ваші програми та веб-сайти за допомогою ключів доступу](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Використання ключів доступу для входу в програми та на веб-сайти на iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Стаття Вікіпедії про паролі](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Чи підтримуєте ви найкращі методи роботи з електронною поштою {#do-you-support-email-best-practices}

Так. У всіх планах вбудована підтримка SPF, DKIM, DMARC, ARC та SRS. Ми також активно співпрацювали з оригінальними авторами цих специфікацій та іншими експертами з електронної пошти, щоб забезпечити досконалість та високу якість доставки.

### Чи підтримуєте ви вебхуки з відмовами {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
Шукаєте документацію щодо вебхуків електронної пошти? Дивіться <a href="/faq#do-you-support-webhooks" class="alert-link">Чи підтримуєте ви вебхуки?</a> для отримання додаткової інформації.
<span>
</span>
</div>

Так, станом на 14 серпня 2024 року ми додали цю функцію. Тепер ви можете перейти до Мій обліковий запис → Домени → Налаштування → URL-адреса повернення вебхука та налаштувати URL-адресу `http://` або `https://`, на яку ми надсилатимемо запит `POST` щоразу, коли вихідні електронні листи SMTP повертаються.

Це корисно для керування та моніторингу вашого вихідного SMTP-сервера, а також може бути використано для підтримки підписників, відмови від розсилки та виявлення випадків повернення пошти.

Корисні дані вебхука Bounce надсилаються як JSON з такими властивостями:

* `email_id` (Рядок) – ідентифікатор електронної пошти, що відповідає електронній пошті в розділі «Мій обліковий запис» → «Електронні листи» (вихідний SMTP)
* `list_id` (Рядок) – значення заголовка `List-ID` (без урахування регістру), якщо є, з оригінального вихідного електронного листа
* `list_unsubscribe` (Рядок) – значення заголовка `List-Unsubscribe` (без урахування регістру), якщо є, з оригінального вихідного електронного листа
* `feedback_id` (Рядок) – значення заголовка `Feedback-ID` (без урахування регістру), якщо є, з оригінального вихідного електронного листа
* `recipient` (Рядок) – адреса електронної пошти одержувача, який повернувся або отримав помилку
* `message` (Рядок) – детальне повідомлення про помилку для повернення
* `response` (Рядок) – повідомлення відповіді SMTP
* `list_id`0 (Число) – проаналізований Код відповіді SMTP
* `list_id`1 (Рядок) – якщо код відповіді надійшов з надійного джерела, це значення буде заповнено іменем кореневого домену (наприклад, `list_id`2 або `list_id`3)
* `list_id`4 (Об'єкт) – об'єкт, що містить такі властивості, що детально описують статус відхилення та повернення
* `list_id`5 (Рядок) – дія повернення (наприклад, `list_id`6)
* `list_id`7 (Рядок) – причина повернення (наприклад, `list_id`8)
* `list_id`9 (Рядок) – категорія повернення (наприклад, `List-ID`0)
* `List-ID`1 (Число) – код статусу повернення (наприклад, `List-ID`2)
* `List-ID`3 (Рядок) – код повернення з повідомлення відповіді (наприклад, `List-ID`4)
* `List-ID`5 (Число) – номер проаналізованого рядка, якщо такий є, `List-ID`6 (наприклад, `List-ID`7)
* `List-ID`8 (Об’єкт) – пара ключ-значення заголовків для вихідного електронного листа
* `List-ID`9 (Рядок) – дата у форматі `list_unsubscribe`0, коли сталася помилка повернення

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

Ось кілька додаткових зауважень щодо вебхуків-відмов:

* Якщо корисне навантаження вебхука містить значення `list_id`, `list_unsubscribe` або `feedback_id`, тоді вам слід вжити відповідних заходів, щоб видалити `recipient` зі списку, якщо це необхідно.
* Якщо значення `bounce.category` було одиницею `"block"`, `"recipient"`, `"spam"` або `"virus"`, тоді вам обов'язково слід видалити користувача зі списку.
* Якщо вам потрібно перевірити корисні навантаження вебхука (щоб переконатися, що вони дійсно надходять з нашого сервера), тоді ви можете [визначити IP-адресу віддаленого клієнта, ім'я хоста клієнта, за допомогою зворотного пошуку](https://nodejs.org/api/dns.html#dnspromisesreverseip) – це має бути `list_unsubscribe`0.
* Ви також можете перевірити IP-адресу на `list_unsubscribe`1.
* Перейдіть до Мій обліковий запис → Домени → Налаштування → Ключ перевірки корисного навантаження підпису вебхука, щоб отримати свій ключ вебхука.
* Ви можете будь-коли змінити цей ключ з міркувань безпеки.
* Обчисліть та порівняйте значення `list_unsubscribe`2 з нашого запиту вебхука з обчисленим значенням тіла за допомогою цього ключа. Приклад того, як це зробити, доступний за посиланням `list_unsubscribe`3.
* Дивіться обговорення за посиланням <`list_unsubscribe`4 для отримання додаткової інформації.
* Ми чекатимемо до `list_unsubscribe`5 секунд, поки кінцева точка вашого вебхука відповість із кодом стану `list_unsubscribe`6, і ми повторимо спробу до `list_unsubscribe`7 разів. * Якщо ми виявимо, що ваша URL-адреса вебхука для відмов містить помилку під час спроби надіслати запит до неї, ми надсилатимемо вам електронний лист раз на тиждень.

### Чи підтримуєте ви вебхуки {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
Шукаєте документацію щодо вебхуків відскоку? Дивіться <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Чи підтримуєте ви вебхуки відскоку?</a> для отримання додаткової інформації.
<span>
</span>
</div>

Так, станом на 15 травня 2020 року ми додали цю функцію. Ви можете просто додавати вебхуки так само, як і будь-якого іншого одержувача! Переконайтеся, що в URL-адресі вебхука є префікс протоколу "http" або "https".

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Посилений захист конфіденційності:
</strong>
<span>
Якщо ви користуєтеся платним планом (який передбачає посилений захист конфіденційності), перейдіть до розділу <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> та натисніть «Псевдоніми» поруч із вашим доменом, щоб налаштувати вебхуки. Якщо ви хочете дізнатися більше про платні плани, перегляньте нашу сторінку <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ціни</a>. В іншому випадку ви можете продовжувати дотримуватися інструкцій нижче.
</span>
</div>

Якщо ви користуєтеся безкоштовним планом, просто додайте новий запис DNS <strong class="notranslate">TXT</strong>, як показано нижче:

Наприклад, якщо я хочу, щоб усі електронні листи, що надходять на адресу `alias@example.com`, пересилалися на нову тестову кінцеву точку [кошик запитів](https://requestbin.com/r/en8pfhdgcculn?inspect):

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
<td><em>"@", ".", або пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Або, можливо, ви хочете, щоб усі електронні листи, що надходять до `example.com`, пересилалися на цю кінцеву точку:

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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Ось додаткові примітки щодо вебхуків:**

* Якщо вам потрібно перевірити корисні навантаження вебхука (щоб переконатися, що вони дійсно надходять з нашого сервера), ви можете скористатися [визначити IP-адресу віддаленого клієнта, ім'я хоста клієнта, за допомогою зворотного пошуку](https://nodejs.org/api/dns.html#dnspromisesreverseip) – це має бути `mx1.forwardemail.net` або `mx2.forwardemail.net`.
* Ви також можете перевірити IP-адресу за [наші опубліковані IP-адреси](#what-are-your-servers-ip-addresses).
* Якщо у вас платний план, перейдіть до Мій обліковий запис → Домени → Налаштування → Ключ перевірки корисного навантаження підпису вебхука, щоб отримати ключ вебхука.
* Ви можете будь-коли повернути цей ключ з міркувань безпеки.
* Обчисліть та порівняйте значення `X-Webhook-Signature` з нашого запиту вебхука з обчисленим значенням тіла за допомогою цього ключа. Приклад того, як це зробити, доступний за посиланням [цей пост на Stack Overflow](https://stackoverflow.com/a/68885281). * Дивіться обговорення за посиланням <https://github.com/forwardemail/free-email-forwarding/issues/235> для отримання додаткової інформації.
* Якщо вебхук не відповідає кодом стану `200`, ми збережемо його відповідь у [створено журнал помилок](#do-you-store-error-logs) – що корисно для налагодження.
* HTTP-запити вебхука повторюватимуть до 3 разів за кожну спробу SMTP-з’єднання з максимальним тайм-аутом 60 секунд на кожен POST-запит кінцевої точки. **Зверніть увагу, що це не означає, що спроба повторюється лише 3 рази**, насправді спроба повторюватиметься безперервно, надсилаючи SMTP-код 421 (який вказує відправнику на пізнішу спробу) після 3-ї невдалої спроби POST-запиту HTTP. Це означає, що електронна пошта повторюватиметься безперервно протягом кількох днів, доки не буде досягнуто коду стану 200.
* Ми автоматично повторюватимемо спробу на основі кодів стану та помилок за замовчуванням, що використовуються в [метод повторної спроби суперагента](https://ladjs.github.io/superagent/#retrying-requests) (ми є розробниками).
* Ми групуємо HTTP-запити вебхука до однієї кінцевої точки в один запит (а не кілька), щоб заощадити ресурси та пришвидшити час відповіді. Наприклад, якщо ви надсилаєте електронний лист на адреси <webhook1@example.com>, <webhook2@example.com> та <webhook3@example.com>, і всі вони налаштовані на потрапляння до *точно однієї* URL-адреси кінцевої точки, тоді буде зроблено лише один запит. Ми групуємо за допомогою точного зіставлення кінцевих точок із суворою рівністю.
* Зверніть увагу, що ми використовуємо метод "simpleParser" бібліотеки `mx1.forwardemail.net`0 для розбору повідомлення в об'єкт, дружній до JSON.
* Необроблене значення електронної пошти у вигляді рядка задається як властивість "raw".
* Результати автентифікації задаються як властивості "dkim", "spf", "arc", "dmarc" та "bimi".
* Розібрані заголовки електронної пошти задаються як властивість "headers", але також зверніть увагу, що ви можете використовувати "headerLines" для легшої ітерації та розбору.
* Згруповані одержувачі для цього вебхука групуються разом та задаються як властивість "recipients".
* Інформація про сеанс SMTP задається як властивість "session". Вона містить інформацію про відправника повідомлення, час його надходження, HELO та ім'я хоста клієнта. Значення імені хоста клієнта `mx1.forwardemail.net`1 є або повним доменом (FQDN) (зі зворотного пошуку PTR), або `mx1.forwardemail.net`2, обгорнутим у дужки (наприклад, `mx1.forwardemail.net`3).
* Якщо вам потрібен швидкий спосіб отримати значення `mx1.forwardemail.net`4, ви можете використовувати значення `mx1.forwardemail.net`5 (див. приклад нижче). Заголовок `mx1.forwardemail.net`6 – це заголовок, який ми додаємо до повідомлень для налагодження з початковим одержувачем (перед маскованою пересилкою) повідомлення.
* Якщо вам потрібно видалити властивості `mx1.forwardemail.net`7 та/або `mx1.forwardemail.net`8 з тіла корисного навантаження, просто додайте `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 або `mx2.forwardemail.net`1 до кінцевої точки вебхука як параметр рядка запиту (наприклад, `mx2.forwardemail.net`2).
* Якщо є вкладення, вони будуть додані до масиву `mx2.forwardemail.net`3 зі значеннями буфера. Ви можете перетворити їх назад на контент, використовуючи підхід до JavaScript, наприклад:

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
Порада:
</strong>
Цікаво, як виглядає запит вебхука з пересланих електронних листів? Нижче ми навели для вас приклад!
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

### Чи підтримуєте ви регулярні вирази? {#do-you-support-regular-expressions-or-regex}

Так, станом на 27 вересня 2021 року ми додали цю функцію. Ви можете просто написати регулярні вирази ("regex") для зіставлення псевдонімів та виконання підстановок.

Псевдоніми, що підтримуються регулярними виразами, – це ті, що починаються з `/` та закінчуються на `/`, а їхніми одержувачами є адреси електронної пошти або вебхуки. Одержувачі також можуть включати підтримку підстановки регулярних виразів (наприклад, `$1`, `$2`).

Ми підтримуємо два прапорці регулярних виразів, зокрема `i` та `g`. Прапорець `i` без урахування регістру є постійним значенням за замовчуванням і завжди застосовується. Глобальний прапорець `g` можна додати, додавши закінчення `/` до `/g`.

Зверніть увагу, що ми також підтримуємо функцію псевдонімів <a href="#can-i-disable-specific-aliases">disabled</a> для частини одержувача з підтримкою регулярних виразів.

Регулярні вирази не підтримуються на <a href="/disposable-addresses" target="_blank">глобальних доменах</a> (оскільки це може бути вразливістю системи безпеки).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Покращений захист конфіденційності:
</strong>
<span>
Якщо ви користуєтеся платним планом (який має посилений захист конфіденційності), перейдіть до розділу <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> та натисніть «Псевдоніми» поруч із вашим доменом, щоб налаштувати регулярні вирази. Якщо ви хочете дізнатися більше про платні плани, перегляньте нашу сторінку <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ціни</a>. В іншому випадку ви можете продовжувати дотримуватися інструкцій нижче.
</span>
</div>

Якщо ви користуєтеся безкоштовним планом, просто додайте новий запис DNS <strong class="notranslate">TXT</strong>, використовуючи один або кілька наведених нижче прикладів:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Простий приклад:</strong> Якщо я хочу, щоб усі електронні листи, що надходять на адресу `linus@example.com` або `torvalds@example.com`, пересилалися на адресу `user@gmail.com`:
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Приклад підстановки імені та прізвища:</strong> Уявіть, що всі адреси електронної пошти вашої компанії мають шаблон `firstname.lastname@example.com`. Якщо я хочу, щоб усі електронні листи, що надходять за шаблоном `firstname.lastname@example.com`, пересилалися на `firstname.lastname@company.com` з підтримкою підстановки (<a href="https://regexr.com/66hnu" class="alert-link">переглянути тест на RegExr</a>):
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Приклад підстановки фільтра символом "плюс":</strong> Якщо я хочу, щоб усі електронні листи, що надходять на адресу `info@example.com` або `support@example.com`, пересилалися на адресу `user+info@gmail.com` або `user+support@gmail.com` відповідно (з підтримкою підстановки) (<a href="https://regexr.com/66ho7" class="alert-link">переглянути тест на RegExr</a>):
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Приклад підстановки рядка запиту вебхука:</strong> Можливо, ви хочете, щоб усі електронні листи, що надходять до `example.com`, надходили до <a href="#do-you-support-webhooks" class="alert-link">вебхука</a> та мали динамічний ключ рядка запиту "to" зі значенням частини імені користувача адреси електронної пошти (<a href="https://regexr.com/66ho4" class="alert-link">переглянути тест на RegExr</a>):
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Приклад тихого відхилення:</strong> Якщо ви хочете, щоб усі електронні листи, що відповідають певному шаблону, були вимкнені та тихо відхилені (відправнику здається, що повідомлення було успішно надіслано, але насправді нікуди не йде) зі статусним кодом `250` (див. <a href="#can-i-disable-specific-aliases" class="alert-link">Чи можна вимкнути певні псевдоніми</a>), просто використовуйте той самий підхід з одним знаком оклику "!". Це вказує відправнику, що повідомлення було успішно доставлено, але насправді воно нікуди не пішло (наприклад, чорна діра або `/dev/null`).
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Приклад м’якого відхилення:</strong> Якщо ви хочете, щоб усі електронні листи, що відповідають певному шаблону, були вимкнені та м’яко відхилені з кодом статусу `421` (див. <a href="#can-i-disable-specific-aliases" class="alert-link">Чи можна вимкнути певні псевдоніми</a>), просто скористайтеся тим самим підходом із подвійним знаком оклику "!!". Це вказує відправнику на необхідність повторити спробу надсилання електронного листа, і електронні листи на цей псевдонім будуть повторюватися протягом приблизно 5 днів, а потім будуть відхилені назавжди.</div>

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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Приклад жорсткого відхилення:</strong> Якщо ви хочете, щоб усі електронні листи, що відповідають певному шаблону, були вимкнені та жорстко відхилені з кодом статусу `550` (див. <a href="#can-i-disable-specific-aliases" class="alert-link">Чи можна вимкнути певні псевдоніми</a>), просто використовуйте той самий підхід із потрійним знаком оклику "!!!". Це вказує відправнику на постійну помилку, і електронні листи не будуть повторюватися, вони будуть відхилені для цього псевдоніма.</div>

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
<td><em>"@", ".", або пусте</em></td>
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
Цікаво, як написати регулярний вираз, або потрібно протестувати заміну? Ви можете перейти на безкоштовний веб-сайт для тестування регулярних виразів <a href="https://regexr.com" class="alert-link">RegExr</a> за адресою <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Які ваші ліміти вихідних SMTP-повідомлень {#what-are-your-outbound-smtp-limits}

Ми обмежуємо користувачів та домени до 300 вихідних SMTP-повідомлень на день. В середньому це становить понад 9000 електронних листів на календарний місяць. Якщо вам потрібно перевищити цю кількість або у вас постійно великий обсяг електронних листів, будь ласка, [зв'яжіться з нами](https://forwardemail.net/help).

### Чи потрібне мені схвалення для ввімкнення SMTP {#do-i-need-approval-to-enable-smtp}

Так, зверніть увагу, що для підтримки репутації IP-адреси та забезпечення доставки, Forward Email має процес ручної перевірки для кожного домену для схвалення вихідних SMTP-повідомлень. Надішліть електронного листа на адресу <support@forwardemail.net> або створіть [запит на допомогу](https://forwardemail.net/help) для схвалення. Зазвичай це займає менше 24 годин, більшість запитів обробляються протягом 1-2 годин. Найближчим часом ми плануємо зробити цей процес миттєвим, додавши додаткові засоби контролю спаму та сповіщення. Цей процес гарантує, що ваші електронні листи потраплять до папки "Вхідні", і ваші повідомлення не будуть позначені як спам.

### Які налаштування конфігурації вашого SMTP-сервера {#what-are-your-smtp-server-configuration-settings}

Наш сервер має ім’я `smtp.forwardemail.net`, і його стан також контролюється на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці стану</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порти `465` та `2465` для SSL/TLS та `587`, `2587`, `2525` та `25` для TLS (STARTTLS).

| Протокол | Ім'я хоста | Порти | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Бажаний** | `smtp.forwardemail.net` | `465`, `2465` | :white_check_mark: | :white_check_mark: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: |

| Вхід | Приклад | Опис |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com` | Адреса електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль | `************************` | Пароль, згенерований для певного псевдоніма. |

Щоб надсилати вихідну електронну пошту за допомогою SMTP, **користувач SMTP** має бути адресою електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>, а **пароль SMTP** має бути паролем, згенерованим для певного псевдоніма.

Будь ласка, зверніться до [Чи підтримуєте ви надсилання електронної пошти через SMTP?](#do-you-support-sending-email-with-smtp) для отримання покрокових інструкцій.

### Які налаштування конфігурації вашого IMAP-сервера {#what-are-your-imap-server-configuration-settings}

Наш сервер має ім’я `imap.forwardemail.net`, і його стан також контролюється на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці стану</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порти `993` та `2993` для SSL/TLS.

| Протокол | Ім'я хоста | Порти | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Бажаний** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Вхід | Приклад | Опис |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com` | Адреса електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль | `************************` | Пароль, згенерований для певного псевдоніма. |

Щоб підключитися за допомогою IMAP, **користувач IMAP** має бути адресою електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>, а **пароль IMAP** має бути паролем, згенерованим для певного псевдоніма.

Будь ласка, зверніться до [Чи підтримуєте ви отримання електронної пошти через IMAP?](#do-you-support-receiving-email-with-imap) для отримання покрокових інструкцій.

### Які налаштування конфігурації вашого POP3-сервера {#what-are-your-pop3-server-configuration-settings}

Наш сервер має ім’я `pop3.forwardemail.net`, і його стан також контролюється на нашій <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">сторінці стану</a>.

Він підтримує як IPv4, так і IPv6 і доступний через порти `995` та `2995` для SSL/TLS.

| Протокол | Ім'я хоста | Порти | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Бажаний** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |

| Вхід | Приклад | Опис |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ім'я користувача | `user@example.com` | Адреса електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>. |
| Пароль | `************************` | Пароль, згенерований для певного псевдоніма. |

Щоб підключитися за допомогою POP3, **користувач POP3** має бути адресою електронної пошти псевдоніма, що існує для домену в розділі <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>, а **пароль IMAP** має бути паролем, згенерованим для певного псевдоніма.

Будь ласка, зверніться до [Ви підтримуєте POP3?](#do-you-support-pop3) для отримання покрокових інструкцій.

### Конфігурація ретрансляції Postfix SMTP {#postfix-smtp-relay-configuration}

Ви можете налаштувати Postfix для ретрансляції електронних листів через SMTP-сервери Forward Email. Це корисно для серверних програм, яким потрібно надсилати електронні листи.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Орієнтовний час налаштування:</strong>
<span>Менше 15 хвилин</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо: </strong>
<span>
Для цього потрібен платний план із увімкненим доступом до SMTP.
</span>
</div>

#### Інсталяція {#installation}

1. Встановіть Postfix на свій сервер:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Під час встановлення виберіть «Інтернет-сайт», коли буде запропоновано тип конфігурації.

#### Конфігурація {#configuration}

1. Відредагуйте основний файл конфігурації Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Додайте або змініть ці налаштування:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Створіть файл паролів SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Додайте свої облікові дані для пересилання електронної пошти:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Захистіть та хешуйте файл паролів:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Перезапустіть Postfix:

```bash
sudo systemctl restart postfix
```

#### Тестування {#testing}

Перевірте свою конфігурацію, надіславши тестовий електронний лист:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Безпека {#security}

### Розширені методи захисту сервера {#advanced-server-hardening-techniques}

> \[!TIP]
> Дізнайтеся більше про нашу інфраструктуру безпеки на [наша сторінка безпеки](/security).

Forward Email впроваджує численні методи посилення захисту сервера для забезпечення безпеки нашої інфраструктури та ваших даних:

1. **Безпека мережі**:
* Брандмауер IP-таблиць зі суворими правилами
* Fail2ban для захисту методом повного перебору
* Регулярні аудити безпеки та тестування на проникнення
* Адміністративний доступ лише через VPN

2. **Посилення захисту системи**:
* Мінімальне встановлення пакетів
* Регулярні оновлення безпеки
* SELinux у режимі примусового виконання
* Вимкнено root-доступ через SSH
* Тільки автентифікація на основі ключа

3. **Безпека застосунків**:
* Заголовки політики безпеки контенту (CSP)
* HTTPS Strict Transport Security (HSTS)
* Заголовки захисту XSS
* Заголовки політики параметрів фреймів та реферерів
* Регулярні аудити залежностей

4. **Захист даних**:
* Повне шифрування диска за допомогою LUKS
* Безпечне керування ключами
* Регулярне резервне копіювання з шифруванням
* Практики мінімізації даних

5. **Моніторинг та реагування**:
* Виявлення вторгнень у режимі реального часу
* Автоматизоване сканування безпеки
* Централізоване ведення журналу та аналіз
* Процедури реагування на інциденти

> \[!IMPORTANT]
> Наші методи безпеки постійно оновлюються для реагування на нові загрози та вразливості.

> \[!TIP]
> Для максимальної безпеки ми рекомендуємо використовувати наш сервіс із наскрізним шифруванням через OpenPGP.

### Чи маєте ви сертифікати SOC 2 або ISO 27001? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Функція пересилання електронної пошти працює на інфраструктурі, наданій сертифікованими субпідрядниками, для забезпечення відповідності галузевим стандартам.

Forward Email не має безпосередньої сертифікації SOC 2 Type II або ISO 27001. Однак сервіс працює на інфраструктурі, що надається сертифікованими субпідрядниками:

* **DigitalOcean**: Сертифіковано SOC 2 Type II та SOC 3 Type II (аудит Schellman & Company LLC), сертифіковано ISO 27001 у кількох центрах обробки даних. Деталі: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: Сертифіковано SOC 2+ (HIPAA), сертифікати ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Деталі: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: сумісний з SOC 2 (зверніться безпосередньо до DataPacket, щоб отримати сертифікацію), постачальник інфраструктури корпоративного рівня (локація в Денвері). Деталі: <https://www.datapacket.com/datacenters/denver>

Forward Email дотримується найкращих галузевих практик щодо аудитів безпеки та регулярно співпрацює з незалежними дослідниками безпеки. Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Чи використовуєте ви шифрування TLS для пересилання електронної пошти {#do-you-use-tls-encryption-for-email-forwarding}

Так. Функція «Пересилання електронної пошти» суворо застосовує TLS 1.2+ для всіх з’єднань (HTTPS, SMTP, IMAP, POP3) та реалізує MTA-STS для покращеної підтримки TLS. Реалізація включає:

* Застосування TLS 1.2+ для всіх з'єднань електронної пошти
* Обмін ключами ECDHE (еліптична крива Діффі-Хеллмана з ефемерними ключами) для ідеальної прямої секретності
* Сучасні набори шифрів з регулярними оновленнями безпеки
* Підтримка HTTP/2 для покращеної продуктивності та безпеки
* HSTS (HTTP Strict Transport Security) з попереднім завантаженням у основних браузерах
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** для суворого застосування TLS

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Реалізація MTA-STS**: Функція пересилання електронної пошти реалізує суворе застосування MTA-STS у кодовій базі. Коли виникають помилки TLS та застосовується MTA-STS, система повертає коди стану 421 SMTP, щоб забезпечити повторну спробу надсилання електронних листів пізніше, а не їхню небезпечну доставку. Деталі реалізації:

* Виявлення помилок TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Застосування MTA-STS у помічнику надсилання електронної пошти: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Перевірка третьою стороною: <https://www.hardenize.com/report/forwardemail.net/1750312779> показує оцінки "Добре" для всіх заходів безпеки TLS та транспортування.

### Чи зберігаються заголовки автентифікації електронної пошти {#do-you-preserve-email-authentication-headers}

Так. Функція «Пересилання електронної пошти» комплексно реалізує та зберігає заголовки автентифікації електронної пошти:

* **SPF (Sender Policy Framework)**: Належним чином впроваджено та збережено
* **DKIM (DomainKeys Identified Mail)**: Повна підтримка з належним керуванням ключами
* **DMARC**: Застосування політики для електронних листів, які не пройшли перевірку SPF або DKIM
* **ARC**: Хоча це не детально описано, ідеальні показники відповідності сервісу свідчать про комплексну обробку заголовків автентифікації

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Перевірка: Тест пошти Internet.nl показує 100/100 балів, зокрема, для реалізації "SPF, DKIM та DMARC". Оцінка Hardenize підтверджує рейтинги "Добре" для SPF та DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Чи зберігаєте ви оригінальні заголовки електронних листів та запобігаєте підміні? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Функція «Пересилати електронні листи» реалізує складний захист від спуфінгу, щоб запобігти зловживанню електронною поштою.

Функція «Пересилання електронної пошти» зберігає оригінальні заголовки електронних листів, одночасно реалізуючи комплексний захист від спуфінгу через кодову базу MX:

* **Збереження заголовків**: Оригінальні заголовки автентифікації зберігаються під час пересилання
* **Захист від спуфінгу**: Застосування політики DMARC запобігає спуфінгу заголовків, відхиляючи електронні листи, які не пройшли перевірку SPF або DKIM
* **Запобігання впровадженню заголовків**: Перевірка та очищення вхідних даних за допомогою бібліотеки striptags
* **Розширений захист**: Складне виявлення фішингу з виявленням спуфінгу, запобіганням видаванню себе за іншу особу та системами сповіщення користувачів

**Деталі реалізації MX**: Основна логіка обробки електронної пошти обробляється кодовою базою MX-сервера, а саме:

* Основний обробник даних MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Фільтрація довільної електронної пошти (захист від спуфінгу): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Допоміжний засіб `isArbitrary` реалізує складні правила захисту від спуфінгу, включаючи виявлення іменування домену, заблокованих фраз та різних шаблонів фішингу.

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Як ви захищаєтеся від спаму та зловживань {#how-do-you-protect-against-spam-and-abuse}

Forward Email реалізує комплексний багаторівневий захист:

* **Обмеження швидкості**: Застосовується до спроб автентифікації, кінцевих точок API та SMTP-з’єднань
* **Ізоляція ресурсів**: Між користувачами для запобігання впливу з боку користувачів з великим обсягом даних
* **Захист від DDoS-атак**: Багаторівневий захист за допомогою системи Shield від DataPacket та Cloudflare
* **Автоматичне масштабування**: Динамічне налаштування ресурсів на основі попиту
* **Запобігання зловживанням**: Перевірки запобігання зловживанням для кожного користувача та блокування шкідливого контенту на основі хешу
* **Автентифікація електронної пошти**: Протоколи SPF, DKIM, DMARC з розширеним виявленням фішингу

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (деталі захисту від DDoS-атак)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Чи зберігаєте ви вміст електронної пошти на диску {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Функція пересилання електронної пошти використовує архітектуру з нульовим розголошенням, яка запобігає запису вмісту електронної пошти на диск.

* **Архітектура нульового розкриття інформації**: Індивідуально зашифровані поштові скриньки SQLite означають, що служба Forward Email не може отримати доступ до вмісту електронної пошти.
* **Обробка в пам'яті**: Обробка електронної пошти повністю відбувається в пам'яті, уникаючи зберігання на диску.
* **Без реєстрації вмісту**: «Ми не реєструємо та не зберігаємо вміст електронної пошти чи метадані на диску».
* **Шифрування в ізольованому середовищі**: Ключі шифрування ніколи не зберігаються на диску у відкритому тексті.

**Докази використання кодової бази MX**: Сервер MX обробляє електронні листи повністю в пам'яті, не записуючи вміст на диск. Основний обробник обробки електронної пошти демонструє цей підхід в пам'яті: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Анотація)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Деталі з нульовим розголошенням)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Шифрування в ізольованому середовищі)

### Чи може вміст електронної пошти бути розкритий під час збоїв системи {#can-email-content-be-exposed-during-system-crashes}

Ні. Forward Email реалізує комплексні заходи захисту від розкриття даних, пов’язаного зі збоями:

* **Дампи основних даних вимкнено**: Запобігає доступу до пам'яті під час збоїв
* **Пам'ять підкачки вимкнено**: Повністю вимкнено, щоб запобігти вилученню конфіденційних даних із файлів підкачки
* **Архітектура в пам'яті**: Вміст електронної пошти існує лише в енергозалежній пам'яті під час обробки
* **Захист ключів шифрування**: Ключі ніколи не зберігаються на диску у вигляді відкритого тексту
* **Фізична безпека**: Зашифровані диски LUKS v2 запобігають фізичному доступу до даних
* **USB-накопичувач вимкнено**: Запобігає несанкціонованому вилученню даних

**Обробка помилок для системних проблем**: Функція пересилання електронної пошти використовує допоміжні функції `isCodeBug` та `isTimeoutError`, щоб гарантувати, що у разі виникнення проблем із підключенням до бази даних, проблем із мережею/блокованим списком DNS або проблем із підключенням до вищого ешелону система повертатиме коди стану 421 SMTP, щоб гарантувати, що електронні листи будуть повторно надіслані пізніше, а не втрачені чи розкриті.

Деталі впровадження:

* Класифікація помилки: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Обробка помилки тайм-ауту під час обробки MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Джерело: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Хто має доступ до вашої поштової інфраструктури {#who-has-access-to-your-email-infrastructure}

Forward Email впроваджує комплексний контроль доступу для своєї мінімальної команди інженерів з 2-3 осіб із суворими вимогами 2FA:

* **Контроль доступу на основі ролей**: Для облікових записів команди з дозволами на основі ресурсів
* **Принцип найменших привілеїв**: Застосовується у всіх системах
* **Розподіл обов'язків**: Між операційними ролями
* **Керування користувачами**: Окреме розгортання та розробка користувачів з різними дозволами
* **Вхід root вимкнено**: Примусовий доступ через належним чином автентифіковані облікові записи
* **Сувора 2FA**: Немає 2FA на основі SMS через ризик атак MiTM - лише токени на основі програм або апаратні токени
* **Комплексне ведення журналу аудиту**: З видаленням конфіденційних даних
* **Автоматизоване виявлення аномалій**: Для незвичайних шаблонів доступу
* **Регулярні перевірки безпеки**: Журнали доступу
* **Запобігання атакам Evil Maid**: Вимкнення USB-накопичувача та інші заходи фізичної безпеки

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Елементи керування авторизацією)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Безпека мережі)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Запобігання атакам злої покоївки)

### Якими постачальниками інфраструктури ви користуєтеся {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Пересилання електронної пошти використовує кількох субпідрядників інфраструктури з комплексними сертифікатами відповідності.

Повна інформація доступна на нашій сторінці відповідності GDPR: <https://forwardemail.net/gdpr>

**Субобробники основної інфраструктури:**

| Постачальник | Сертифікована система конфіденційності даних | Сторінка відповідності GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Клаудфлейр** | ✅ Так | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Пакет даних** | ❌ Ні | <https://www.datapacket.com/privacy-policy> |
| **Цифровий океан** | ❌ Ні | <https://www.digitalocean.com/legal/gdpr> |
| **Вультр** | ❌ Ні | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Детальні сертифікати:**

**Цифровий океан**

* SOC 2 Тип II та SOC 3 Тип II (аудит Schellman & Company LLC)
* Сертифіковано ISO 27001 у кількох центрах обробки даних
* Відповідність стандарту PCI-DSS
* Сертифіковано CSA STAR рівня 1
* Сертифіковано APEC CBPR PRP
* Деталі: <https://www.digitalocean.com/trust/certification-reports>

**Вультр**

* Сертифіковано SOC 2+ (HIPAA)
* Відповідає вимогам PCI Merchant
* Сертифіковано CSA STAR рівня 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Деталі: <https://www.vultr.com/legal/compliance/>

**Пакет даних**

* Відповідність SOC 2 (зверніться безпосередньо до DataPacket, щоб отримати сертифікацію)
* Інфраструктура корпоративного рівня (локація в Денвері)
* Захист від DDoS-атак завдяки стеку кібербезпеки Shield
* Цілодобова технічна підтримка
* Глобальна мережа, що охоплює 58 центрів обробки даних
* Деталі: <https://www.datapacket.com/datacenters/denver>

**Платежні системи:**

* **Stripe**: Сертифіковано за стандартом конфіденційності даних - <https://stripe.com/legal/privacy-center>
* **PayPal**: Не сертифіковано за стандартом DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Чи пропонуєте ви Угоду про обробку даних (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Так, Forward Email пропонує комплексну Угоду про обробку даних (DPA), яку можна підписати разом із нашою корпоративною угодою. Копія нашої DPA доступна за адресою: <https://forwardemail.net/dpa>

**Відомості про DPA:**

* Охоплює відповідність GDPR та угодам ЄС-США/Швейцарія-США Privacy Shield
* Автоматично приймається після прийняття наших Умов обслуговування
* Окремий підпис для стандартного DPA не потрібен
* Індивідуальні домовленості про DPA доступні через ліцензію Enterprise

**Структура відповідності GDPR:**
Наш DPA детально описує відповідність GDPR, а також вимоги до міжнародної передачі даних. Повна інформація доступна за адресою: <https://forwardemail.net/gdpr>

Для корпоративних клієнтів, яким потрібні індивідуальні умови Угоди про захист даних або спеціальні договірні угоди, ці питання можна вирішити за допомогою нашої програми **Корпоративна ліцензія (250 доларів США/місяць)**.

### Як ви обробляєте сповіщення про порушення безпеки даних {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Архітектура нульового розголошення пересилання електронної пошти значно обмежує вплив порушень.

* **Обмежений доступ до даних**: Немає доступу до зашифрованого вмісту електронної пошти через архітектуру з нульовим розголошенням
* **Мінімальний збір даних**: Лише базова інформація про підписника та обмежені журнали IP-адрес для безпеки
* **Фреймворки субобробників**: DigitalOcean та Vultr підтримують процедури реагування на інциденти, що відповідають вимогам GDPR

**Інформація для представника GDPR:**
Forward Email призначила представників GDPR відповідно до статті 27:

**Представник ЄС:**
Osano International Compliance Services Limited
Увага: LFHC
3 Dublin Landings, North Wall Quay
Дублін 1, D01C4E0

**Представник у Великій Британії**
Osano UK Compliance LTD
До уваги: LFHC
42-46 Fountain Street, Белфаст
Антрим, BT1 - 5EF

Для корпоративних клієнтів, яким потрібні спеціальні угоди про рівень обслуговування (SLA) щодо сповіщення про порушення, їх слід обговорити в рамках угоди **Корпоративна ліцензія**.

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Чи пропонуєте ви тестове середовище {#do-you-offer-a-test-environment}

У технічній документації Forward Email чітко не описано спеціальний режим ізольованого програмного середовища. Однак потенційні підходи до тестування включають:

* **Варіант самостійного хостингу**: Комплексні можливості самостійного хостингу для створення тестових середовищ
* **Інтерфейс API**: Потенціал для програмного тестування конфігурацій
* **Відкритий код**: 100% відкритий код дозволяє клієнтам досліджувати логіку переадресації
* **Кілька доменів**: Підтримка кількох доменів може дозволити створення тестових доменів

Для корпоративних клієнтів, яким потрібні формальні можливості ізольованого середовища, це слід обговорити в рамках угоди про **Корпоративну ліцензію**.

Джерело: <https://github.com/forwardemail/forwardemail.net> (Відомості про середовище розробки)

### Чи надаєте ви інструменти моніторингу та сповіщень {#do-you-provide-monitoring-and-alerting-tools}

Пересилання електронної пошти забезпечує моніторинг у режимі реального часу з деякими обмеженнями:

**Доступно:**

* **Моніторинг доставки в режимі реального часу**: Загальнодоступні показники продуктивності для основних постачальників послуг електронної пошти
* **Автоматичні сповіщення**: Команда інженерів отримує сповіщення, коли час доставки перевищує 10 секунд
* **Прозорий моніторинг**: 100% системи моніторингу з відкритим кодом
* **Моніторинг інфраструктури**: Автоматизоване виявлення аномалій та комплексне ведення журналу аудиту

**Обмеження:**

* Вебхуки, орієнтовані на клієнта, або сповіщення про статус доставки на основі API явно не задокументовані

Для корпоративних клієнтів, яким потрібні детальні вебхуки стану доставки або налаштовані інтеграції моніторингу, ці можливості можуть бути доступні за угодами **Корпоративна ліцензія**.

Джерела:

* <https://forwardemail.net> (Відображення моніторингу в режимі реального часу)
* <https://github.com/forwardemail/forwardemail.net> (Реалізація моніторингу)

### Як забезпечити високу доступність {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Функція «Пересилання електронної пошти» реалізує комплексне резервування для кількох постачальників інфраструктури.

* **Розподілена інфраструктура**: Кілька провайдерів (DigitalOcean, Vultr, DataPacket) у різних географічних регіонах
* **Географічне балансування навантаження**: Геолокаційне балансування навантаження на основі Cloudflare з автоматичним перемиканням на резервний рахунок
* **Автоматичне масштабування**: Динамічне налаштування ресурсів залежно від попиту
* **Багаторівневий захист від DDoS-атак**: Через систему Shield від DataPacket та Cloudflare
* **Резервування серверів**: Кілька серверів у регіоні з автоматичним перемиканням на резервний рахунок
* **Реплікація бази даних**: Синхронізація даних у режимі реального часу в кількох місцях
* **Моніторинг та оповіщення**: Цілодобовий моніторинг з автоматичним реагуванням на інциденти

**Гарантія безвідмовної роботи**: доступність послуг понад 99,9% з прозорим моніторингом, доступним за адресою <https://forwardemail.net>

Джерела:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Чи відповідаєте ви вимогам розділу 889 Закону про національний оборонний бюджет (NDAA)? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Пересилання електронної пошти повністю відповідає Розділу 889 завдяки ретельному відбору партнерів з інфраструктури.

Так, функція «Пересилання електронної пошти» **відповідає вимогам розділу 889**. Розділ 889 Закону про національний оборонний бюджет (NDAA) забороняє державним установам використовувати або укладати договори з організаціями, які використовують телекомунікаційне обладнання та обладнання для відеоспостереження від певних компаній (Huawei, ZTE, Hikvision, Dahua та Hytera).

**Як пересилання електронної пошти забезпечує відповідність розділу 889:**

«Пересилання електронної пошти» покладається виключно на двох ключових постачальників інфраструктури, жоден з яких не використовує обладнання, заборонене розділом 889:

1. **Cloudflare**: Наш основний партнер з мережевих послуг та безпеки електронної пошти
2. **DataPacket**: Наш основний постачальник серверної інфраструктури (виключно з використанням обладнання Arista Networks та Cisco)
3. **Постачальники резервного копіювання**: Наші постачальники резервного копіювання Digital Ocean та Vultr додатково письмово підтверджені як такі, що відповідають вимогам Розділу 889.

**Зобов’язання Cloudflare**: Cloudflare чітко зазначає у своєму Кодексі поведінки третіх сторін, що вони не використовують телекомунікаційне обладнання, продукти відеоспостереження чи послуги від будь-яких організацій, заборонених Розділом 889.

**Випадок використання в уряді**: Наша відповідність Розділу 889 була підтверджена, коли **Військово-морська академія США** обрала функцію «Пересилання електронної пошти» для своїх потреб безпечного пересилання електронної пошти, що вимагало документального підтвердження наших федеральних стандартів відповідності.

Щоб отримати повну інформацію про нашу систему дотримання державних вимог, включаючи ширші федеральні нормативні акти, ознайомтеся з нашим вичерпним тематичним дослідженням: [Відповідність вимогам розділу 889 служби електронної пошти федерального уряду](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Системні та технічні деталі {#system-and-technical-details}

### Чи зберігаєте ви електронні листи та їх вміст {#do-you-store-emails-and-their-contents}

Ні, ми не записуємо на диск і не зберігаємо журнали – за допомогою [виняток помилок](#do-you-store-error-logs) та [вихідний SMTP](#do-you-support-sending-email-with-smtp) (див. наш [Політика конфіденційності](/privacy)).

Все робиться в пам'яті та [наш вихідний код знаходиться на GitHub](https://github.com/forwardemail).

### Як працює ваша система пересилання електронної пошти {#how-does-your-email-forwarding-system-work}

Електронна пошта залежить від [SMTP-протокол](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Цей протокол складається з команд, що надсилаються на сервер (найчастіше на порту 25). Спочатку встановлюється з'єднання, потім відправник вказує, від кого надходить лист ("MAIL FROM"), далі куди він прямує ("RCPT TO"), і нарешті, заголовки та тіло самого листа ("DATA"). Нижче описано процес пересилання електронної пошти для кожної команди протоколу SMTP:

* Початкове підключення (без назви команди, наприклад, `telnet example.com 25`) – це початкове підключення. Ми перевіряємо відправників, яких немає в нашому [білий список](#do-you-have-an-allowlist), на відповідність нашому [заборонений список](#do-you-have-a-denylist). Зрештою, якщо відправника немає в нашому білому списку, ми перевіряємо, чи був він [сірий список](#do-you-have-a-greylist).

* `HELO` – це вітання для ідентифікації повного доменного імені відправника, IP-адреси або імені обробника пошти. Це значення може бути підробленим, тому ми не покладаємося на ці дані, а натомість використовуємо зворотний пошук імені хоста IP-адреси з’єднання.

* `MAIL FROM` – Це вказує на адресу відправника конверта електронної пошти. Якщо введено значення, це має бути дійсна адреса електронної пошти RFC 5322. Дозволені порожні значення. Ми використовуємо [перевірити зворотне розсіювання](#how-do-you-protect-against-backscatter) тут, а також перевіряємо MAIL FROM на відповідність нашому [заборонений список](#do-you-have-a-denylist). Нарешті, ми перевіряємо відправників, яких немає в білому списку, на обмеження швидкості (див. розділи про [Обмеження швидкості](#do-you-have-rate-limiting) та [білий список](#do-you-have-an-allowlist) для отримання додаткової інформації).

* `RCPT TO` – Це вказує на одержувача(ів) електронного листа. Це мають бути дійсні адреси електронної пошти RFC 5322. Ми дозволяємо до 50 одержувачів конверта на одне повідомлення (це відрізняється від заголовка «Кому» в електронному листі). Ми також перевіряємо наявність дійсної адреси [Схема перезапису відправника](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) («SRS») тут, щоб захиститися від спуфінгу з використанням нашого доменного імені SRS.

* `DATA` – це основна частина нашого сервісу, яка обробляє електронні листи. Див. розділ [Як обробляти електронний лист для пересилання](#how-do-you-process-an-email-for-forwarding) нижче для отримання додаткової інформації.

### Як обробляється електронний лист для пересилання {#how-do-you-process-an-email-for-forwarding}

У цьому розділі описано наш процес, пов’язаний із командою протоколу SMTP `DATA`, описаною у розділі [Як працює ваша система пересилання електронної пошти](#how-does-your-email-forwarding-system-work) вище – це те, як ми обробляємо заголовки, тіло та безпеку електронного листа, визначаємо, куди його потрібно доставити, та як ми обробляємо з’єднання.

1. Якщо повідомлення перевищує максимальний розмір 50 МБ, воно відхиляється з кодом помилки 552.

2. Якщо повідомлення не містило заголовка «Від» або якщо будь-яке зі значень у заголовку «Від» не було дійсними адресами електронної пошти RFC 5322, воно відхиляється з кодом помилки 550.

3. Якщо повідомлення мало більше 25 заголовків «Отримано», то було визначено, що воно застрягло в циклі перенаправлення, і його було відхилено з кодом помилки 550.

4. Використовуючи відбиток електронної пошти (див. розділ про [Зняття відбитків пальців](#how-do-you-determine-an-email-fingerprint)), ми перевіримо, чи намагалися повторити повідомлення більше 5 днів (що відповідає [поведінка постфікса за замовчуванням](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), і якщо так, то його буде відхилено з кодом помилки 550.

5. Ми зберігаємо результати сканування електронної пошти в пам'яті за допомогою [Сканер спаму](https://spamscanner.net).

6. Якщо Spam Scanner виявляє будь-які випадкові результати, то вони відхиляються з кодом помилки 554. На момент написання цієї статті випадкові результати включають лише тест GTUBE. Див. <https://spamassassin.apache.org/gtube/> для отримання додаткової інформації.

7. Ми додамо до повідомлення такі заголовки для налагодження та запобігання зловживанням:

* `Received` – ми додаємо цей стандартний заголовок Received з IP-адресою та хостом джерела, типом передачі, інформацією про TLS-з’єднання, датою/часом та одержувачем.
* `X-Original-To` – оригінальний одержувач повідомлення:
* Це корисно для визначення місця доставки електронного листа (на додаток до заголовка "Received").
* Це додається для кожного одержувача під час IMAP та/або маскованої пересилки (для захисту конфіденційності).
* `X-Forward-Email-Website` – містить посилання на наш веб-сайт <https://forwardemail.net>
* `X-Forward-Email-Version` – поточна версія [SemVer](https://semver.org/) з `package.json` нашої кодової бази.
* `X-Forward-Email-Session-ID` – значення ідентифікатора сеансу, що використовується для налагодження (застосовується лише в невиробничих середовищах).
* `X-Forward-Email-Sender` – список, розділений комами, що містить оригінальну адресу ПОШТИ ВІДПРАВНИКА конверта (якщо вона не була порожньою), повне доменне ім'я клієнта зворотного PTR (якщо воно існує) та IP-адресу відправника.
* `X-Forward-Email-ID` – це стосується лише вихідного SMTP та відповідає ідентифікатору електронної пошти, що зберігається в розділі «Мій обліковий запис» → «Електронні листи».
* `X-Original-To`0 – зі значенням `X-Original-To`1.
* `X-Original-To`2 – зі значенням `X-Original-To`3.
* `X-Original-To`4 – зі значенням `X-Original-To`5.

8. Потім ми перевіряємо повідомлення на наявність [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) та [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Якщо повідомлення не пройшло перевірку DMARC, а домен мав політику відхилення (наприклад, `p=reject` [було в політиці DMARC](https://wikipedia.org/wiki/DMARC)), воно відхиляється з кодом помилки 550. Зазвичай політику DMARC для домену можна знайти в записі <strong class="notranslate">TXT</strong> піддомену `_dmarc` (наприклад, `dig _dmarc.example.com txt`).
* Якщо повідомлення не пройшло перевірку SPF, а домен мав політику жорсткої помилки (наприклад, `-all` був у політиці SPF, на відміну від `~all` або взагалі не мав політики), воно відхиляється з кодом помилки 550. Зазвичай політику SPF для домену можна знайти в записі <strong class="notranslate">TXT</strong> для кореневого домену (наприклад, `dig example.com txt`). Див. цей розділ для отримання додаткової інформації про [надсилання пошти, як у Gmail](#can-i-send-mail-as-in-gmail-with-this) щодо SPF.

9. Тепер обробляємо дані одержувачів повідомлення, зібрані за допомогою команди `RCPT TO` у розділі [Як працює ваша система пересилання електронної пошти](#how-does-your-email-forwarding-system-work) вище. Для кожного одержувача виконуємо такі операції:

* Ми шукаємо записи <strong class="notranslate">TXT</strong> доменного імені (частина після символу `@`, наприклад, `example.com`, якщо адреса електронної пошти була `test@example.com`). Наприклад, якщо домен `example.com`, ми виконуємо пошук DNS, такий як `dig example.com txt`.
* Ми аналізуємо всі записи <strong class="notranslate">TXT</strong>, які починаються з `forward-email=` (безкоштовні плани) або `forward-email-site-verification=` (платні плани). Зверніть увагу, що ми аналізуємо обидва, щоб обробляти електронні листи, поки користувач оновлює або знижує тарифні плани.
* З цих проаналізованих записів <strong class="notranslate">TXT</strong> ми перебираємо їх, щоб витягти конфігурацію переадресації (як описано в розділі [Як розпочати та налаштувати пересилання електронної пошти](#how-do-i-get-started-and-set-up-email-forwarding) вище). Зверніть увагу, що ми підтримуємо лише одне значення `forward-email-site-verification=`, і якщо їх буде вказано більше одного, виникне помилка 550, і відправник отримає повідомлення про повернення для цього одержувача.
* Рекурсивно ми перебираємо витягнуту конфігурацію переадресації, щоб визначити глобальну переадресацію, переадресацію на основі регулярних виразів та всі інші підтримувані конфігурації переадресації, які тепер відомі як наші «Адреси переадресації».
* Для кожної адреси переадресації ми підтримуємо один рекурсивний пошук (який розпочне цю серію операцій спочатку для заданої адреси). Якщо знайдено рекурсивний збіг, батьківський результат буде видалено з адрес переадресації, а дочірні адреси будуть додані.
* Адреси переадресації аналізуються на унікальність (оскільки ми не хочемо надсилати дублікати на одну адресу або створювати додаткові непотрібні SMTP-клієнтські з’єднання).
* Для кожної адреси пересилання ми шукаємо її доменне ім'я за кінцевою точкою API `/v1/max-forwarded-addresses` (щоб визначити, на скільки адрес домену дозволено пересилати електронну пошту за псевдонімом, наприклад, 10 за замовчуванням – див. розділ про `example.com`0). Якщо це обмеження перевищено, виникне помилка 550, і відправник отримає повідомлення про відмову для цього одержувача.
* Ми шукаємо налаштування початкового одержувача за кінцевою точкою API `example.com`1, яка підтримує пошук для платних користувачів (з резервним варіантом для безкоштовних користувачів). Це повертає об'єкт конфігурації для розширених налаштувань для `example.com`2 (число, наприклад, `example.com`3), `example.com`4 (логічне значення), `example.com`5 (логічне значення), `example.com`6 (логічне значення) та `example.com`7 (логічне значення).
* На основі цих налаштувань ми перевіряємо результати сканування спаму, і якщо виникають помилки, повідомлення відхиляється з кодом помилки 554 (наприклад, якщо ввімкнено `example.com`8, ми перевіряємо результати сканування спаму на наявність вірусів). Зверніть увагу, що всі користувачі безкоштовного плану будуть увімкнені для перевірок на наявність контенту для дорослих, фішингу, виконуваних файлів та вірусів. За замовчуванням усі користувачі платного плану також увімкнені, але цю конфігурацію можна змінити на сторінці налаштувань для домену на панелі інструментів «Пересилання електронної пошти»).

10. Для кожної обробленої адреси пересилання одержувача ми виконуємо такі операції:

* Адреса перевіряється за нашим [заборонений список](#do-you-have-a-denylist), і якщо вона була вказана, то виникне код помилки 421 (сповіщає відправнику повторити спробу пізніше).
* Якщо адреса є вебхуком, то ми встановлюємо логічне значення для майбутніх операцій (див. нижче – ми групуємо схожі вебхуки, щоб зробити один POST-запит, а не кілька для доставки).
* Якщо адреса є адресою електронної пошти, то ми аналізуємо хост для майбутніх операцій (див. нижче – ми групуємо схожі хости, щоб зробити одне з’єднання, а не кілька окремих з’єднань для доставки).

11. Якщо немає одержувачів і немає повернень, ми видаємо помилку 550 «Недійсні одержувачі».

12. Якщо є одержувачі, ми перебираємо їх (згрупованих разом одним хостом) та доставляємо електронні листи. Див. розділ [Як ви вирішуєте проблеми з доставкою електронної пошти](#how-do-you-handle-email-delivery-issues) нижче для отримання додаткової інформації.

* Якщо під час надсилання електронних листів виникнуть помилки, ми збережемо їх у пам'яті для подальшої обробки.
* Ми візьмемо найменший код помилки (якщо такий є) з надсилання електронних листів і використаємо його як код відповіді на команду `DATA`. Це означає, що електронні листи, які не були доставлені, зазвичай будуть повторно надіслані початковим відправником, проте електронні листи, які вже були доставлені, не будуть повторно надіслані під час наступного надсилання повідомлення (оскільки ми використовуємо [Зняття відбитків пальців](#how-do-you-determine-an-email-fingerprint)).
* Якщо помилок не виникло, ми надішлемо код статусу відповіді SMTP 250 successful.
* Відмовою вважається будь-яка спроба доставки, яка призводить до коду статусу >= 500 (постійні збої).

13. Якщо повернення не відбулося (постійних збоїв), ми повернемо код стану відповіді SMTP з найнижчим кодом помилки з непостійних збоїв (або код стану 250 успішно, якщо їх не було).

14. Якщо повідомлення про повернення все ж таки відбулися, ми надсилатимемо електронні листи про повернення у фоновому режимі після повернення відправнику найнижчого з усіх кодів помилок. Однак, якщо найнижчий код помилки >= 500, ми не надсилатимемо жодних електронних листів про повернення. Це тому, що якби ми це зробили, відправники отримали б подвійний електронний лист про повернення (наприклад, один від свого вихідного MTA, такого як Gmail, а також один від нас). Дивіться розділ про [Як захиститися від зворотного розсіювання](#how-do-you-protect-against-backscatter) нижче для отримання додаткової інформації.

### Як ви вирішуєте проблеми з доставкою електронної пошти {#how-do-you-handle-email-delivery-issues}

Зверніть увагу, що ми перезаписуватимемо листи з функцією «Дружній відправник» тоді і лише тоді, коли політика DMARC відправника не була дотримана ТА жодні підписи DKIM не були узгоджені із заголовком «Від». Це означає, що ми змінимо заголовок «Від» у повідомленні, встановимо «X-Original-From», а також встановимо «Відповісти на», якщо він ще не був налаштований. Ми також повторно запечатаємо ARC-печатку на повідомленні після зміни цих заголовків.

Ми також використовуємо інтелектуальний парсинг повідомлень про помилки на кожному рівні нашого стеку – у нашому коді, DNS-запитах, внутрішніх функціях Node.js, HTTP-запитах (наприклад, 408, 413 та 429 зіставляються з кодом відповіді SMTP 421, якщо одержувач є вебхуком) та відповідях поштового сервера (наприклад, відповіді з "defer" або "slowdown" будуть повторені як помилки 421).

Наша логіка захищена від фіктивних помилок, і вона також повторюватиме спробу у разі помилок SSL/TLS, проблем із підключенням тощо. Мета використання фіктивних помилок — максимізувати доставку всім одержувачам для конфігурації пересилання.

Якщо одержувачем є вебхук, ми дозволимо 60-секундний тайм-аут для завершення запиту з максимум 3 повторними спробами (тобто загалом 4 запити до невдачі). Зверніть увагу, що ми правильно аналізуємо коди помилок 408, 413 та 429 і зіставляємо їх з кодом відповіді SMTP 421.

В іншому випадку, якщо одержувачем є адреса електронної пошти, ми спробуємо надіслати електронний лист з опортуністичним TLS (ми намагаємося використовувати STARTTLS, якщо він доступний на поштовому сервері одержувача). Якщо під час спроби надсилання електронного листа виникає помилка SSL/TLS, ми спробуємо надіслати електронний лист без TLS (без використання STARTTLS).

Якщо виникнуть будь-які помилки DNS або підключення, ми повернемо команді `DATA` код відповіді SMTP з кодом 421, інакше, якщо буде помилок рівня >= 500, будуть надіслані відмовки.

Якщо ми виявимо, що на поштовому сервері, на який ми намагаємося доставити повідомлення, заблоковано одну або кілька IP-адрес нашого поштового обміну (наприклад, будь-якою технологією, яку вони використовують для відстеження спамерів), ми надішлемо відправнику код відповіді SMTP з кодом 421, щоб він спробував надіслати повідомлення пізніше (і ми отримаємо сповіщення про проблему, щоб, сподіваємося, вирішити її до наступної спроби).

### Як ви реагуєте на блокування IP-адрес {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Ми регулярно відстежуємо всі основні заборонені списки DNS, і якщо будь-яка з наших IP-адрес для обміну поштою ("MX") потрапить до основного забороненого списку, ми, якщо можливо, вилучимо її з відповідного запису DNS A за циклічним алгоритмом, доки проблему не буде вирішено.

На момент написання цієї статті нас також внесено до кількох заборонених списків DNS, і ми серйозно ставимося до моніторингу заборонених списків. Якщо ви помітили будь-які проблеми, перш ніж ми зможемо їх вирішити, будь ласка, повідомте нас письмово на адресу <support@forwardemail.net>.

Наші IP-адреси є загальнодоступними, [див. цей розділ нижче для отримання додаткової інформації](#what-are-your-servers-ip-addresses).

### Що таке адреси поштмейстерів {#what-are-postmaster-addresses}

Щоб запобігти неправильному перенаправленню відмов та надсиланню повідомлень про відпустку на неконтрольовані або неіснуючі поштові скриньки, ми ведемо список імен користувачів, подібних до демонів поштової служби:

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
* [та будь-яку адресу, на яку не надійшло відповіді](#what-are-no-reply-addresses)

Див. [Розділ 4.6 RFC 5320](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) для отримання додаткової інформації про те, як такі списки використовуються для створення ефективних систем електронної пошти.

### Що таке адреси для відсутності відповіді {#what-are-no-reply-addresses}

Імена користувачів електронної пошти, що дорівнюють будь-якому з наступних (без урахування регістру), вважаються адресами без відповіді:

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

Цей список підтримується з індексом [як проєкт з відкритим кодом на GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Які IP-адреси вашого сервера {#what-are-your-servers-ip-addresses}

Ми публікуємо наші IP-адреси за адресою <https://forwardemail.net/ips>.

### У вас є білий список {#do-you-have-an-allowlist}

Так, у нас є [список розширень доменних імен](#what-domain-name-extensions-are-allowlisted-by-default), які за замовчуванням внесені до білого списку, а також динамічний, кешований та ковзний білий список на основі [суворі критерії](#what-is-your-allowlist-criteria).

Усі електронні листи, домени та одержувачі від клієнтів із платними планами автоматично додаються до нашого білого списку.

### Які розширення доменних імен за замовчуванням внесені до білого списку {#what-domain-name-extensions-are-allowlisted-by-default}

Наведені нижче розширення доменних імен вважаються внесеними до білого списку за замовчуванням (незалежно від того, чи є вони в Umbrella Popularity List чи ні):

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
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
class="notranslate">gov.ax</code></li>
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
class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
class="list-inline-item"><code class="notranslate">gov.za</code></li>
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
<li class="list-inline-item"><code class="notranslate">aghan</code></li>
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
<li class="list-inline-item"><code class="notranslate">баскетбол</code></li>
<li class="list-inline-item"><code class="notranslate">баухаус</code></li>
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
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">бронювання</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">canon class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">караван</code></li>
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
<li class="list-inline-item"><code class="notranslate">цитадель</code></li>
<li class="list-inline-item"><code class="notranslate">Сіті</code></li>
<li class="list-inline-item"><code class="notranslate">Сітік</code></li>
<li class="list-inline-item"><code class="notranslate">клубмед</code></li>
<li class="list-inline-item"><code class="notranslate">комкаст</code></li>
<li class="list-inline-item"><code class="notranslate">комбанк</code></li>
<li class="list-inline-item"><code class="notranslate">кредитсоюз</code></li>
<li class="list-inline-item"><code class="notranslate">корону</code></li>
<li class="list-inline-item"><code class="notranslate">корону</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">дилер</code></li>
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
<li class="list-inline-item"><code class="notranslate">Євробачення</code></li>
<li class="list-inline-item"><code class="notranslate">Everbank</code></li>
<li class="list-inline-item"><code class="notranslate">Extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">Fage</code></li>
<li class="list-inline-item"><code class="notranslate">Fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">Farmers</code></li>
<li class="list-inline-item"><code class="notranslate">Fedex</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
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
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">gucci</code></li>
<li class="list-inline-item"><code class="notranslate">gubci</code></li>
<li class="list-inline-item"><code class="notranslate">hbo</code></li>
<li class="list-inline-item"><code class="notranslate">hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">hermes</code></li>
<li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
<li class="list-inline-item"><code class="notranslate">Hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">HKT</code></li>
<li class="list-inline-item"><code class="notranslate">Honda</code></li>
<li class="list-inline-item"><code class="notranslate">Honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">Hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">Hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">Hughes</code></li>
<li class="list-inline-item"><code class="notranslate">Hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">ibm</code></li>
<li class="list-inline-item"><code class="notranslate">ieee</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">ikano</code></li>
<li class="list-inline-item"><code class="notranslate">imdb</code></li>
<li class="list-inline-item"><code class="notranslate">infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">intel</code></li>
<li class="list-inline-item"><code class="notranslate">intuit</code></li>
<li class="list-inline-item"><code class="notranslate">іпіранга</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">ітау</code></li>
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
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">lancia</code></li>
<li class="list-inline-item"><code class="notranslate">lancome</code></li>
<li class="list-inline-item"><code class="notranslate">landrover</code></li>
<li class="list-inline-item"><code class="notranslate">Lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">Lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">Latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">LDS</code></li>
<li class="list-inline-item"><code class="notranslate">Leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">Lego</code></li>
<li class="list-inline-item"><code class="notranslate">Зв'язок</code></li>
<li class="list-inline-item"><code class="notranslate">Lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">стиль життя</code></li>
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
<li class="list-inline-item"><code class="notranslate">манго</code></li>
<li class="list-inline-item"><code class="notranslate">marriott</code></li>
<li class="list-inline-item"><code class="notranslate">maserati</code></li>
<li class="list-inline-item"><code class="notranslate">mattel</code></li>
<li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">metlife</code></li>
<li class="list-inline-item"><code class="notranslate">microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">міні</code></li>
<li class="list-inline-item"><code class="notranslate">міт</code></li>
<li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">mlb</code></li>
<li class="list-inline-item"><code class="notranslate">mma</code></li>
<li class="list-inline-item"><code class="notranslate">монаш</code></li>
<li class="list-inline-item"><code class="notranslate">мормон</code></li>
<li class="list-inline-item"><code class="notranslate">мото</code></li>
<li class="list-inline-item"><code class="notranslate">мовістар</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">взаємний</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">національний</code></li>
<li class="list-inline-item"><code class="notranslate">природа</code></ li>
<li class="list-inline-item"><code class="notranslate">нба</code></li>
<li class="list-inline-item"><code class="notranslate">нец</code></li>
<li class="list-inline-item"><code class="notranslate">нетфлікс</code></li>
<li class="list-inline-item"><code class="notranslate">нейстар</code></li>
<li class="list-inline-item"><code class="notranslate">ньюголланд</code></li>
<li class="list-inline-item"><code class="notranslate">нфл</code></li>
<li class="list-inline-item"><code class="notranslate">нхк</code></li>
<li class="list-inline-item"><code class="notranslate">ніко</code></li>
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
<li class="list-inline-item"><code class="notranslate">грати</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">пол</code></li>
<li class="list-inline-item"><code class="notranslate">політика</code></li>
<li class="list-inline-item"><code class="notranslate">практика</code></li>
<li class="list-inline-item"><code class="notranslate">продукція</code></li>
<li class="list-inline-item"><code class="notranslate">прогресивна</code></li>
<li class="list-inline-item"><code class="notranslate">прогресивна дія</code></li>
<li class="list-inline-item"><code class="notranslate">прогресивна дія</code></li> class="notranslate">prudential</code></li>
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
<li class="list-inline-item"><code class="notranslate">безпека</code></li>
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
<li class="list-inline-item"><code class="notranslate">Schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">Schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">Schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">sew</code></li>
<li class="list-inline-item"><code class="notranslate">seven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">seek</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">sharp</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">шрірам</code></li>
<li class="list-inline-item"><code class="notranslate">сіна</code></li>
<li class="list-inline-item"><code class="notranslate">скай</code></li>
<li class="list-inline-item"><code class="notranslate">скайп</code></li>
<li class="list-inline-item"><code class="notranslate">смарт</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">софтбанк</code></li>
<li class="list-inline-item"><code class="notranslate">соху</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">spiegel</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">Скріпки</code></li>
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
<li class="list-inline-item"><code class="notranslate">всього</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">мандрівники</code></li>
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
<li class="list-inline-item"><code class="notranslate">Virgin</code></li>
<li class="list-inline-item"><code class="notranslate">Visa</code></li>
<li class="list-inline-item"><code class="notranslate">Vista</code></li>
<li class="list-inline-item"><code class="notranslate">Vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">Vivo</code></li>
<li class="list-inline-item"><code class="notranslate">Volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Walmart</code></li>
class="list-inline-item"><code class="notranslate">Вальтер</code></li>
<li class="list-inline-item"><code class="notranslate">метеоканал</code></li>
<li class="list-inline-item"><code class="notranslate">Вебер</code></li>
<li class="list-inline-item"><code class="notranslate">Вейр</code></li>
<li class="list-inline-item"><code class="notranslate">Вільямхілл</code></li>
<li class="list-inline-item"><code class="notranslate">Вікна</code></li>
<li class="list-inline-item"><code class="notranslate">ВМЕ</code></li>
<li class="list-inline-item"><code class="notranslate">Вольтерсклувер</code></li>
<li class="list-inline-item"><code class="notranslate">вудсайд</code></li>
<li class="list-inline-item"><code class="notranslate">втц</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">ксерокс</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">йодобаші</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

Станом на 18 березня 2025 року ми також додали до цього списку ці французькі заморські території ([за цим запитом GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Станом на 8 липня 2025 року ми додали такі країни, що стосуються лише Європи:

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

Ми спеціально не включили `cz`, `ru` та `ua` через високу активність спаму.

### Які критерії вашого білого списку {#what-is-your-allowlist-criteria}

У нас є статичний список [розширення доменних імен у білому списку за замовчуванням](#what-domain-name-extensions-are-allowlisted-by-default), а також ми підтримуємо динамічний, кешований, ковзний список дозволених адрес, який базується на таких суворих критеріях:

* Кореневий домен відправника має бути типу [розширення доменного імені, яке відповідає списку, який ми пропонуємо в нашому безкоштовному плані](#what-domain-name-extensions-can-be-used-for-free) (з додаванням `biz` та `info`). Ми також включаємо часткові збіги `edu`, `gov` та `mil`, такі як `xyz.gov.au` та `xyz.edu.au`.
* Кореневий домен відправника має бути серед 100 000 найкращих результатів аналізу унікальних кореневих доменів з [Список популярності Umbrella](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Кореневий домен відправника має бути серед 50 000 найкращих результатів пошуку унікальних кореневих доменів, що з'являються принаймні в 4 за останні 7 днів UPL (~50%+).
* Кореневий домен відправника не повинен бути [категоризований](https://radar.cloudflare.com/categorization-feedback/) як контент для дорослих або шкідливе програмне забезпечення від Cloudflare.
* Кореневий домен відправника повинен мати встановлені записи A або MX.
* Кореневий домен відправника повинен мати запис(и) A, запис(и) MX, запис DMARC з кваліфікатором `biz`0 або `biz`1, або запис SPF з кваліфікатором `biz`2 або `biz`3.

Якщо цей критерій виконано, кореневий домен відправника буде кешовано протягом 7 днів. Зверніть увагу, що наше автоматизоване завдання виконується щодня, тому це кеш білого списку, який постійно оновлюється.

Наше автоматизоване завдання завантажить дані UPL з пам'яті за попередні 7 днів, розпакує їх, а потім проаналізує дані з пам'яті відповідно до суворих критеріїв, зазначених вище.

Звичайно ж, сюди входять популярні на момент написання цієї статті домени, такі як Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify та інші.

Якщо ви є відправником, якого немає в нашому білому списку, то під час першого надсилання електронного листа з вашого кореневого домену FQDN або IP-адреси вам будуть надані статуси [обмежена ставка](#do-you-have-rate-limiting) та [сірий список](#do-you-have-a-greylist). Зверніть увагу, що це стандартна практика, прийнята як стандарт електронної пошти. Більшість клієнтів поштових серверів спробують повторити спробу, якщо отримають помилку обмеження швидкості або сірого списку (наприклад, код стану помилки рівня 421 або 4xx).

**Зверніть увагу, що певні відправники, такі як `a@gmail.com`, `b@xyz.edu` та `c@gov.au`, все ще можуть бути [заборонено](#do-you-have-a-denylist)** (наприклад, якщо ми автоматично виявляємо спам, фішинг або шкідливе програмне забезпечення від цих відправників).

### Які розширення доменних імен можна використовувати безкоштовно {#what-domain-name-extensions-can-be-used-for-free}

Станом на 31 березня 2023 року ми запровадили нове загальне правило щодо спаму для захисту наших користувачів та сервісу.

Це нове правило дозволяє використовувати лише такі розширення доменних імен у нашому безкоштовному плані:

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
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">це</code></li>
<li class="list-inline-item"><code class="notranslate">є</code></li>
<li class="list-inline-item"><code class="notranslate">яп</code></li>
<li class="list-inline-item"><code class="notranslate">ке</code></li>
<li class="list-inline-item"><code class="notranslate">кр</code></li>
<li class="list-inline-item"><code class="notranslate">ла</code></li>
<li class="list-inline-item"><code class="notranslate">лі</code></li>
<li class="list-inline-item"><code class="notranslate">лв</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">до</code></li>
<li class="list-inline-item"><code class="notranslate">телебачення</code></li>
<li class="list-inline-item"><code class="notranslate">Велика Британія</code></li>
<li class="list-inline-item"><code class="notranslate">США</code></li>
<li class="list-inline-item"><code class="notranslate">Узбекистан</code></li>
<li class="list-inline-item"><code class="notranslate">Велика Британія</code></li> class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### У вас є сірий список {#do-you-have-a-greylist}

Так, у нас дуже слабка політика [сірий список електронної пошти](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Внесення до сірого списку застосовується лише до відправників, яких немає в нашому білому списку, і зберігається в нашому кеші 30 днів.

Для кожного нового відправника ми зберігаємо ключ у нашій базі даних Redis протягом 30 днів зі значенням, встановленим на початковий час надходження їхнього першого запиту. Потім ми відхиляємо їхній електронний лист із кодом статусу повторної спроби 450 і дозволяємо йому пройти лише через 5 хвилин.

Якщо вони успішно зачекали 5 хвилин з моменту початкового часу прибуття, їхні електронні листи будуть прийняті, і вони не отримають цей код статусу 450.

Ключ складається або з кореневого домену FQDN, або з IP-адреси відправника. Це означає, що будь-який піддомен, який проходить сірий список, також буде прийнятий для кореневого домену, і навпаки (саме це ми маємо на увазі під «дуже слабкою» політикою).

Наприклад, якщо електронний лист від `test.example.com` надходить раніше, ніж ми бачимо лист від `example.com`, то будь-який електронний лист від `test.example.com` та/або `example.com` повинен буде чекати 5 хвилин з моменту початкового часу прибуття з’єднання. Ми не змушуємо `test.example.com` та `example.com` чекати окремо протягом 5 хвилин (наша політика сірого списку застосовується на рівні кореневого домену).

Зверніть увагу, що сірий список не застосовується до жодного відправника в нашому [білий список](#do-you-have-an-allowlist) (наприклад, Meta, Amazon, Netflix, Google, Microsoft на момент написання цього тексту).

### У вас є заборонений список {#do-you-have-a-denylist}

Так, ми ведемо власний список заборонених адрес та оновлюємо його автоматично в режимі реального часу, а також вручну на основі виявленого спаму та шкідливої активності.

Ми також щогодини витягуємо всі IP-адреси зі забороненого списку UCEPROTECT рівня 1 о <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> та вносимо їх до нашого забороненого списку з 7-денним терміном дії.

Відправники, знайдені у забороненому списку, отримають код помилки 421 (сповіщає відправнику про необхідність повторити спробу пізніше), якщо вони мають значення [не входять до білого списку](#do-you-have-an-allowlist).

Використовуючи код стану 421 замість коду стану 554, можна зменшити потенційні хибнопозитивні результати в режимі реального часу, а потім повідомлення можна успішно доставити під час наступної спроби.

**Це розроблено на відміну від інших поштових служб**, де якщо вас додають до списку заборонених адрес, виникає серйозна та постійна помилка. Часто важко попросити відправників повторити спробу надсилання повідомлень (особливо від великих організацій), тому цей підхід дає приблизно 5 днів з моменту першої спроби надсилання електронного листа відправнику, одержувачу або нам, щоб втрутитися та вирішити проблему (запросивши видалення зі списку заборонених адрес).

Усі запити на видалення зі забороненого списку відстежуються адміністраторами в режимі реального часу (наприклад, щоб адміністратори могли назавжди додавати до білого списку повторювані хибнопозитивні результати).

Запити на видалення зі списку заборонених можна подати за адресою <https://forwardemail.net/denylist>.. Запити на видалення зі списку заборонених користувачів, що мають платну підписку, обробляються миттєво, тоді як користувачі, що не мають платної підписки, повинні чекати, поки адміністратори оброблять їхні запити.

Відправники, у яких виявлено спам або вірусний контент, будуть додані до забороненого списку таким чином:

1. [відбиток початкового повідомлення](#how-do-you-determine-an-email-fingerprint) потрапляє до сірого списку після виявлення спаму або блокування від «довіреного» відправника (наприклад, `gmail.com`, `microsoft.com`, `apple.com`).
* Якщо відправник був у білому списку, повідомлення потрапляє до сірого списку на 1 годину.
* Якщо відправник не в білому списку, повідомлення потрапляє до сірого списку на 6 годин.
2. Ми аналізуємо ключі забороненого списку з інформації від відправника та повідомлення, і для кожного з цих ключів ми створюємо (якщо такого ще не існує) лічильник, збільшуємо його на 1 та кешуємо на 24 години.
* Для відправників у білому списку:
* Додаємо ключ для адреси електронної пошти конверта «MAIL FROM», якщо вона мала SPF, що пройшов, або не мала SPF, і це не [ім'я користувача поштмейстера](#what-are-postmaster-addresses) або [ім'я користувача, яке не відповідає](#what-are-no-reply-addresses).
* Якщо заголовок "From" був у білому списку, додайте ключ для адреси електронної пошти заголовка "From", якщо він мав прохідний SPF або прохідний та вирівняний DKIM.
* Якщо заголовок "From" не був у білому списку, додайте ключ для адреси електронної пошти заголовка "From" та його кореневого проаналізованого доменного імені.
* Для відправників, які не входять до білого списку:
* Додайте ключ для адреси електронної пошти конверта "MAIL FROM", якщо він мав прохідний SPF.
* Якщо заголовок "From" був у білому списку, додайте ключ для адреси електронної пошти заголовка "From", якщо він мав прохідний SPF або прохідний та вирівняний DKIM.
* Якщо заголовок "From" не був у білому списку, додайте ключ для адреси електронної пошти заголовка "From" та його кореневого проаналізованого доменного імені.
* Додайте ключ для віддаленої IP-адреси відправника.
* Додайте ключ для імені хоста клієнта, визначеного за допомогою зворотного пошуку з IP-адреси відправника (якщо є).
* Додайте ключ для кореневого домену імені хоста клієнта, визначеного за допомогою вирівняного заголовка (якщо є, і якщо він відрізняється від імені хоста клієнта).
3. Якщо лічильник досягає 5 для відправника та ключа, які не входять до білого списку, ми забороняємо ключ на 30 днів, а нашій команді з питань зловживань надсилається електронний лист. Ці цифри можуть змінюватися, і оновлення відображатимуться тут, оскільки ми відстежуємо зловживання.
4. Якщо лічильник досягає 10 для відправника та ключа, які входять до білого списку, ми забороняємо ключ на 7 днів, а нашій команді з питань зловживань надсилається електронний лист. Ці цифри можуть змінюватися, і оновлення відображатимуться тут, оскільки ми відстежуємо зловживання.

> **ПРИМІТКА:** Найближчим часом ми запровадимо моніторинг репутації. Натомість моніторинг репутації розраховуватиме, коли забороняти відправника, на основі відсоткового порогу (на відміну від рудиментарного лічильника, як зазначалося вище).

### Чи є у вас обмеження швидкості {#do-you-have-rate-limiting}

Обмеження швидкості відправлення здійснюється або кореневим доменом, отриманим за допомогою зворотного PTR-пошуку IP-адреси відправника, або, якщо це не дає результату, просто використовується IP-адреса відправника. Зверніть увагу, що нижче ми називаємо це `Sender`.

Наші MX-сервери мають щоденні ліміти для вхідної пошти, отриманої для [зашифроване сховище IMAP](/blog/docs/best-quantum-safe-encrypted-email-service):

* Замість обмеження швидкості вхідної пошти, отриманої на основі окремого псевдоніма (наприклад, `you@yourdomain.com`), ми обмежуємо швидкість за самим доменним ім'ям псевдоніма (наприклад, `yourdomain.com`). Це запобігає одночасному переповненню поштових скриньок усіх псевдонімів у вашому домені `Senders`.
* У нас є загальні обмеження, які застосовуються до всіх `Senders` у нашому сервісі незалежно від одержувача:
* `Senders`, які ми вважаємо «надійними» як джерело достовірності (наприклад, `gmail.com`, `microsoft.com`, `apple.com`), обмежені надсиланням 100 ГБ на день.
* `Senders`, які є [у білому списку](#do-you-have-an-allowlist), обмежені надсиланням 10 ГБ на день.
* Усі інші `yourdomain.com`0 обмежені надсиланням 1 ГБ та/або 1000 повідомлень на день.
* У нас є певний ліміт для `yourdomain.com`1 та `yourdomain.com`2 – 1 ГБ та/або 1000 повідомлень на день.

Сервери MX також обмежують пересилання повідомлень одному або кільком одержувачам за допомогою обмеження швидкості, але це стосується лише `Senders`, який не знаходиться на [білий список](#do-you-have-an-allowlist):

* Ми дозволяємо лише до 100 підключень на годину на кожен кореневий домен `Sender` з визначеним FQDN (або) віддалену IP-адресу `Sender` (якщо зворотний PTR недоступний) та на кожного одержувача конверта. Ми зберігаємо ключ для обмеження швидкості як криптографічний хеш у нашій базі даних Redis.

* Якщо ви надсилаєте електронні листи через нашу систему, переконайтеся, що у вас налаштовано зворотний PTR для всіх ваших IP-адрес (інакше кожен унікальний кореневий домен FQDN або IP-адреса, з якої ви надсилаєте, буде обмежений швидкістю).

* Зверніть увагу, що якщо ви надсилаєте через популярну систему, таку як Amazon SES, то ви не будете обмежені за тарифом, оскільки (на момент написання цього тексту) Amazon SES входить до нашого білого списку.

* Якщо ви надсилаєте з домену, такого як `test.abc.123.example.com`, обмеження швидкості буде застосовано до `example.com`. Багато спамерів використовують сотні піддоменів, щоб обійти поширені спам-фільтри, які обмежують швидкість лише унікальні імена хостів, а не унікальні кореневі домени FQDN.

* `Senders`, що перевищують ліміт швидкості, будуть відхилені з помилкою 421.

Наші сервери IMAP та SMTP обмежують кількість одночасних підключень до ваших псевдонімів, що перевищує `60`.

Наші MX-сервери обмежують відправників [не в білому списку](#do-you-have-an-allowlist) у встановленні більше 10 одночасних з’єднань (з 3-хвилинним терміном дії кешу для лічильника, що відображає час очікування нашого сокета 3 хвилини).

### Як ви захищаєтеся від зворотного розсіювання {#how-do-you-protect-against-backscatter}

Неправильно спрямовані повернення або спам-повідомлення про повернення (відомі як "[Зворотне розсіювання](https://en.wikipedia.org/wiki/Backscatter_\(email\))") можуть негативно вплинути на репутацію IP-адрес відправника.

Ми робимо два кроки для захисту від зворотного розсіювання, які детально описані в наступних розділах [Запобігання поверненню відомих ПОШТОВИХ ВІДПРАВНИКІВ](#prevent-bounces-from-known-mail-from-spammers) та [Запобігання непотрібним відскокам для захисту від зворотного розсіювання](#prevent-unnecessary-bounces-to-protect-against-backscatter) нижче.

### Запобігання поверненню відомих ПОШТ ВІД спамерів {#prevent-bounces-from-known-mail-from-spammers}

Ми щогодини о <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> отримуємо список з [Backscatter.org](https://www.backscatterer.org/) (за підтримки [UCEPROTECT](https://www.uceprotect.net/)) та завантажуємо його в нашу базу даних Redis (також порівнюємо різницю заздалегідь; на випадок, якщо якісь IP-адреси було видалено та потрібно їх врахувати).

Якщо поле MAIL FROM пусте АБО дорівнює (без урахування регістру) будь-якому з [адреси поштмейстерів](#what-are-postmaster-addresses) (частина перед символом @ в електронному листі), то ми перевіряємо, чи відповідає IP-адреса відправника одній із цих списків.

Якщо IP-адреса відправника вказана (а не в нашому [білий список](#do-you-have-an-allowlist)), ми надсилаємо повідомлення про помилку 554 з повідомленням `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Ми отримаємо сповіщення, якщо відправник знаходиться як у списку Backscatterer, так і в нашому білому списку, щоб ми могли вирішити проблему, якщо необхідно.

Методи, описані в цьому розділі, відповідають рекомендації "БЕЗПЕЧНИЙ РЕЖИМ" за адресою <https://www.backscatterer.org/?target=usage> – де ми перевіряємо IP-адресу відправника, лише якщо певні умови вже виконано.

### Запобігання непотрібним відскокам для захисту від зворотного розсіювання {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Відмовлені листи – це електронні листи, які свідчать про повну невдачу пересилання одержувачу, і повторна спроба надсилання листа не буде здійснена.

Поширеною причиною потрапляння до списку Backscatterer є неправильно спрямовані відхилення або спам-відхилення, тому ми повинні захиститися від цього кількома способами:

1. Ми надсилаємо повідомлення лише тоді, коли виникає >= 500 помилок коду стану (коли спроби пересилання електронних листів не вдалися, наприклад, Gmail відповідає помилкою рівня 500).

2. Ми надсилаємо повідомлення лише один раз (ми використовуємо розрахований ключ відбитка повернення та зберігаємо його в кеші, щоб запобігти надсиланню дублікатів). Відбиток повернення – це ключ, який являє собою відбиток повідомлення в поєднанні з хешем адреси повернення та її кодом помилки). Див. розділ про [Зняття відбитків пальців](#how-do-you-determine-an-email-fingerprint) для отримання додаткової інформації про те, як розраховується відбиток повідомлення. Успішно надіслані відбитки повернення закінчуються через 7 днів у нашому кеші Redis.

3. Ми надсилаємо листи лише тоді, коли поля MAIL FROM та/або From не є порожніми та не містять (без урахування регістру) [ім'я користувача поштмейстера](#what-are-postmaster-addresses) (частина перед символом @ в електронному листі).

4. Ми не надсилаємо повідомлення, якщо воно містило будь-який із наступних заголовків (без урахування регістру):

* Заголовок `auto-submitted` зі значенням, відмінним від `no`.
* Заголовок `x-auto-response-suppress` зі значенням `dr`, `autoreply`, `auto-reply`, `auto_reply` або `all`
* Заголовок `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 або `no`7 (незалежно від значення).
* Заголовок `no`8 зі значенням `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 або `x-auto-response-suppress`3.

5. Ми не надсилаємо листи, якщо адреса електронної пошти MAIL FROM або From закінчується на `+donotreply`, `-donotreply`, `+noreply` або `-noreply`.

6. Ми не надсилаємо повідомлення, якщо частина імені користувача в адресі електронної пошти відправника мала значення `mdaemon`, а заголовок `X-MDDSN-Message` не враховував регістр.

7. Ми не надсилаємо, якщо в заголовку `multipart/report` був регістронечутливий заголовок `content-type`.

### Як визначити відбиток електронної пошти {#how-do-you-determine-an-email-fingerprint}

Відбиток електронної пошти використовується для визначення унікальності електронної пошти та запобігання доставці дублікатів повідомлень і надсиланню [дублікати відмов](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Відбиток пальця розраховується з наступного списку:

* Ім'я хоста FQDN або IP-адреса, визначені клієнтом
* Значення заголовка `Message-ID` (якщо є)
* Значення заголовка `Date` (якщо є)
* Значення заголовка `From` (якщо є)
* Значення заголовка `To` (якщо є)
* Значення заголовка `Cc` (якщо є)
* Значення заголовка `Subject` (якщо є)
* Значення `Body` (якщо є)

### Чи можу я пересилати електронні листи на порти, відмінні від 25 (наприклад, якщо мій інтернет-провайдер заблокував порт 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Так, станом на 5 травня 2020 року ми додали цю функцію. Наразі ця функція є специфічною для домену, а не для псевдоніма. Якщо вам потрібно, щоб вона була специфічною для псевдоніма, зв’яжіться з нами, щоб повідомити нам про ваші потреби.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Посилений захист конфіденційності:
</strong>
<span>
Якщо ви користуєтеся платним планом (який передбачає посилений захист конфіденційності), перейдіть до розділу <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a>, натисніть «Налаштування» поруч із вашим доменом, а потім натисніть «Налаштування». Якщо ви хочете дізнатися більше про платні плани, перегляньте нашу сторінку <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ціни</a>. В іншому випадку ви можете продовжувати дотримуватися інструкцій нижче.
</span>
</div>

Якщо у вас безкоштовний план, просто додайте новий DNS-запис <strong class="notranslate">TXT</strong>, як показано нижче, але змініть порт з 25 на вибраний вами порт.

Наприклад, якщо я хочу, щоб усі електронні листи, що надходять на адресу `example.com`, пересилалися на SMTP-порт псевдонімів одержувачів з портом 1337 замість 25:

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
<td><em>"@", ".", або пусте</em></td>
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
Найпоширеніший сценарій налаштування переадресації портів – це коли ви хочете переадресовувати всі електронні листи, що надходять на example.com, на інший порт на example.com, відмінний від стандартного порту SMTP 25. Щоб налаштувати це, просто додайте наступний запис <strong class="notranslate">TXT</strong> catch-all.
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Чи підтримується символ плюс + для псевдонімів Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Так, абсолютно.

### Чи підтримується піддомен {#does-it-support-sub-domains}

Так, звичайно. Замість використання "@", "." або порожнього символу як імені/хоста/псевдоніма, ви просто використовуєте ім'я піддомену як значення.

Якщо ви хочете, щоб `foo.example.com` пересилав електронні листи, введіть `foo` як значення імені/хоста/псевдоніма в налаштуваннях DNS (як для записів MX, так і для записів <strong class="notranslate">TXT</strong>).

### Чи пересилає це заголовки моїх електронних листів {#does-this-forward-my-emails-headers}

Так, абсолютно.

### Чи це добре перевірено? {#is-this-well-tested}

Так, у нього є тести, написані з використанням [ава](https://github.com/avajs/ava), а також є покриття коду.

### Чи передаєте ви повідомлення та коди відповідей SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Так, звичайно. Наприклад, якщо ви надсилаєте електронний лист на адресу `hello@example.com`, і він зареєстрований для пересилання на адресу `user@gmail.com`, тоді повідомлення відповіді SMTP та код із SMTP-сервера "gmail.com" будуть повернуті замість проксі-сервера за адресою "mx1.forwardemail.net" або "mx2.forwardemail.net".

### Як ви запобігаєте спамерам та забезпечуєте добру репутацію пересилання електронної пошти {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Дивіться наші розділи про [Як працює ваша система пересилання електронної пошти](#how-does-your-email-forwarding-system-work), [Як ви вирішуєте проблеми з доставкою електронної пошти](#how-do-you-handle-email-delivery-issues) та [Як ви реагуєте на блокування IP-адрес?](#how-do-you-handle-your-ip-addresses-becoming-blocked) вище.

### Як виконувати DNS-пошук для доменних імен {#how-do-you-perform-dns-lookups-on-domain-names}

Ми створили проєкт з відкритим вихідним кодом :tangerine: [Мандарин](https://github.com/forwardemail/tangerine) та використовуємо його для DNS-пошуку. DNS-сервери за замовчуванням – `1.1.1.1` та `1.0.0.1`, а DNS-запити здійснюються через [DNS через HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") на рівні програми.

:tangerine: [Мандарин](https://github.com/tangerine) використовує [службу DNS для споживачів CloudFlare, що забезпечує конфіденційність за замовчуванням][cloudflare-dns].

## Обліковий запис та оплата {#account-and-billing}

### Чи пропонуєте ви гарантію повернення грошей за платні плани {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Так! Автоматичне повернення коштів відбувається, коли ви підвищуєте, знижуєте тарифний план або скасовуєте свій обліковий запис протягом 30 днів з моменту початку дії вашого плану. Це стосується лише нових клієнтів.

### Якщо я зміню план, чи ви розрахуєте суму пропорційно та повернете різницю? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Ми не перераховуємо кошти пропорційно та не повертаємо різницю під час зміни вашого плану. Натомість ми конвертуємо тривалість, що залишилася від дати закінчення терміну дії вашого поточного плану, у найближчу відносну тривалість вашого нового плану (округлену до меншого числа на місяць).

Зверніть увагу, що якщо ви перейдете на інший платний план протягом 30 днів з моменту його початку, ми автоматично повернемо вам повну суму з вашого поточного плану.

### Чи можу я використовувати цей сервіс пересилання електронної пошти як резервний MX-сервер? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Ні, це не рекомендується, оскільки ви можете використовувати лише один поштовий сервер одночасно. Резервні варіанти зазвичай ніколи не повторюються через неправильні налаштування пріоритетів та поштові сервери, які не враховують перевірку пріоритетів обміну MX.

### Чи можна вимкнути певні псевдоніми {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо у вас платний план, вам потрібно перейти до розділу <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мій обліковий запис <i class="fa fa-angle-right"></i> Домени</a> <i class="fa fa-angle-right"></i> Псевдоніми <i class="fa fa-angle-right"></i> Редагувати псевдонім <i class="fa fa-angle-right"></i> Зніміть позначку "Активний" <i class="fa fa-angle-right"></i> Продовжити.
</span>
</div>

Так, просто відредагуйте свій DNS-запис <strong class="notranslate">TXT</strong> та додайте перед псевдонімом один, два або три знаки оклику (див. нижче).

Зверніть увагу, що вам *слід* зберегти зіставлення ":", оскільки це потрібно, якщо ви коли-небудь вирішите вимкнути цю функцію (а також воно використовується для імпорту, якщо ви переходите на один із наших платних планів).

**Для тихого відхилення (відправнику здається, що повідомлення успішно надіслано, але насправді воно нікуди не йде) (код статусу `250`):** Якщо перед псевдонімом поставити "!" (один знак оклику), то відправникам, які намагаються надіслати повідомлення на цю адресу, буде повернуто код успішного відхилення `250`, але самі електронні листи нікуди не підуть (наприклад, до чорної діри або `/dev/null`).

**Для м’якого відхилення (код статусу `421`):** Якщо перед псевдонімом додати "!!" (подвійний знак оклику), то відправникам, які намагаються надіслати лист на цю адресу, повертатиметься м’який код статусу помилки `421`, і електронні листи часто повторюються до 5 днів, перш ніж їх буде відхилено та повернено.

**Для жорсткого відхилення (код статусу `550`):** Якщо перед псевдонімом поставити "!!!" (потрійний знак оклику), то відправникам, які намагаються надіслати лист на цю адресу, повертатиметься постійний код статусу помилки `550`, а електронні листи будуть відхилені та повернені назад.

Наприклад, якщо я хочу, щоб усі електронні листи, що надходять на адресу `alias@example.com`, перестали надходити на адресу `user@gmail.com`, були відхилені та повернуті (наприклад, використовувати три знаки оклику):

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
<td><em>"@", ".", або пусте</em></td>
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
Ви також можете переписати адресу переадресованого одержувача просто на "nobody@forwardemail.net", що перенаправить його до nobody, як у прикладі нижче.
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
<td><em>"@", ".", або пусте</em></td>
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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Чи можу я пересилати електронні листи кільком одержувачам {#can-i-forward-emails-to-multiple-recipients}

Так, звичайно. Просто вкажіть кількох одержувачів у ваших записах <strong class="notranslate">TXT</strong>.

Наприклад, якщо я хочу, щоб електронний лист, який надсилається на адресу `hello@example.com`, був пересланий на адреси `user+a@gmail.com` та `user+b@gmail.com`, тоді мій запис <strong class="notranslate">TXT</strong> виглядатиме так:

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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Або ж ви можете вказати їх у двох окремих рядках, наприклад:

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
<td><em>"@", ".", або порожній рядок</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", або порожній рядок</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Це залежить від вас!

### Чи можу я мати кількох глобальних одержувачів для всіх адрес {#can-i-have-multiple-global-catch-all-recipients}

Так, можете. Просто вкажіть кількох глобальних одержувачів для всіх адрес у ваших записах <strong class="notranslate">TXT</strong>.

Наприклад, якщо я хочу, щоб кожен електронний лист, що надходить на адресу `*@example.com` (зірочка означає підстановку, тобто загальний символ), пересилався на адреси `user+a@gmail.com` та `user+b@gmail.com`, тоді мій запис <strong class="notranslate">TXT</strong> виглядатиме так:

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
<td><em>"@", ".", або пусте</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Або ж ви можете вказати їх у двох окремих рядках, наприклад:

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
<td><em>"@", ".", або порожнє</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", або порожнє</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Це залежить від вас!

### Чи існує максимальне обмеження на кількість адрес електронної пошти, на які я можу пересилати повідомлення для кожного псевдоніма {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Так, обмеження за замовчуванням становить 10. Це НЕ означає, що ви можете мати лише 10 псевдонімів для свого доменного імені. Ви можете мати скільки завгодно псевдонімів (необмежена кількість). Це означає, що ви можете пересилати лише один псевдонім на 10 унікальних адрес електронної пошти. Ви можете мати `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (від 1 до 10) – а будь-які електронні листи на адресу `hello@example.com` будуть пересилатися на `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (від 1 до 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Порада:
</strong>
<span>
Потрібно більше 10 одержувачів на псевдонім? Надішліть нам електронного листа, і ми будемо раді збільшити ліміт ваших облікових записів.
</span>
</div>

### Чи можу я рекурсивно пересилати електронні листи {#can-i-recursively-forward-emails}

Так, ви можете, проте ви все одно повинні дотримуватися максимального ліміту. Якщо у вас є `hello:linus@example.com` та `linus:user@gmail.com`, то електронні листи на адресу `hello@example.com` будуть пересилатися на адреси `linus@example.com` та `user@gmail.com`. Зверніть увагу, що якщо ви спробуєте рекурсивно пересилати електронні листи, що перевищують максимальний ліміт, виникне помилка.

### Чи можуть люди скасувати реєстрацію або зареєструвати мою пересилку електронної пошти без мого дозволу {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Ми використовуємо перевірку записів MX та TXT, тому, якщо ви додасте відповідні записи MX та TXT цієї служби, ви будете зареєстровані. Якщо ви їх видалите, ви будете скасовані. Ви є власником свого домену та керуванням DNS, тому якщо хтось має до цього доступ, це проблема.

### Як це безкоштовно {#how-is-it-free}

Forward Email пропонує безкоштовний рівень завдяки поєднанню розробки з відкритим кодом, ефективної інфраструктури та додаткових платних планів, що підтримують сервіс.

Наш безкоштовний рівень підтримується:

1. **Розробка з відкритим вихідним кодом**: Наша кодова база має відкритий вихідний код, що дозволяє спільноті робити внески та прозору роботу.

2. **Ефективна інфраструктура**: Ми оптимізували наші системи для пересилання електронної пошти з мінімальними ресурсами.

3. **Платні преміум-плани**: Користувачі, яким потрібні додаткові функції, такі як надсилання SMTP, отримання IMAP або розширені параметри конфіденційності, оформлюють підписку на наші платні плани.

4. **Обмеження розумного використання**: Безкоштовний рівень має політику добросовісного використання для запобігання зловживанням.

> \[!NOTE]
> Ми прагнемо зберегти базову переадресацію електронної пошти безкоштовною, пропонуючи преміум-функції для користувачів із більш просунутими потребами.

> \[!TIP]
> Якщо ви вважаєте наш сервіс цінним, розгляньте можливість переходу на платний план для підтримки постійної розробки та обслуговування.

### Який максимальний розмір електронного листа {#what-is-the-max-email-size-limit}

За замовчуванням обмеження розміру становить 50 МБ, що включає вміст, заголовки та вкладення. Зверніть увагу, що такі служби, як Gmail та Outlook, дозволяють обмеження розміру лише 25 МБ, і якщо ви перевищите це обмеження під час надсилання на адреси цих постачальників, ви отримаєте повідомлення про помилку.

Якщо перевищено обмеження розміру файлу, повертається помилка з правильним кодом відповіді.

### Чи зберігаєте ви журнали електронних листів {#do-you-store-logs-of-emails}

Ні, ми не записуємо на диск і не зберігаємо журнали – за допомогою [виняток помилок](#do-you-store-error-logs) та [вихідний SMTP](#do-you-support-sending-email-with-smtp) (див. наш [Політика конфіденційності](/privacy)).

Все робиться в пам'яті та [наш вихідний код знаходиться на GitHub](https://github.com/forwardemail).

### Чи зберігаєте ви журнали помилок {#do-you-store-error-logs}

**Так. Ви можете отримати доступ до журналів помилок за допомогою [Мій обліковий запис → Журнали](/my-account/logs) або [Мій обліковий запис → Домени](/my-account/domains).**

Станом на лютий 2023 року ми зберігаємо журнали помилок для кодів відповідей SMTP `4xx` та `5xx` протягом 7 днів, які містять помилку SMTP, конверт і заголовки електронного листа (ми **не** зберігаємо тіло електронного листа та вкладення).

Журнали помилок дозволяють перевіряти наявність важливих електронних листів та зменшувати кількість хибнопозитивних результатів спаму для [ваші домени](/my-account/domains). Вони також є чудовим ресурсом для налагодження проблем із [вебхуки електронної пошти](#do-you-support-webhooks) (оскільки журнали помилок містять відповідь кінцевої точки вебхука).

Журнали помилок для [обмеження швидкості](#do-you-have-rate-limiting) та [сірий список](#do-you-have-a-greylist) недоступні, оскільки з'єднання завершується передчасно (наприклад, до того, як команди `RCPT TO` та `MAIL FROM` можуть бути передані).

Дивіться наш [Політика конфіденційності](/privacy) для отримання додаткової інформації.

### Ви читаєте мої електронні листи {#do-you-read-my-emails}

Ні, абсолютно ні. Дивіться наш [Політика конфіденційності](/privacy).

Багато інших сервісів пересилання електронної пошти зберігають і потенційно можуть читати вашу електронну пошту. Немає жодної причини, чому переслані електронні листи потрібно зберігати на диску, тому ми розробили перше рішення з відкритим кодом, яке робить все це в оперативній пам'яті.

Ми вважаємо, що ви повинні мати право на конфіденційність, і ми суворо його поважаємо. Код, розгорнутий на сервері, має назву [програмне забезпечення з відкритим вихідним кодом на GitHub](https://github.com/forwardemail) для прозорості та зміцнення довіри.

### Чи можу я "надсилати пошту від імені" в Gmail за допомогою цього {#can-i-send-mail-as-in-gmail-with-this}

Так! З 2 жовтня 2018 року ми додали цю функцію. Див. [Як надсилати пошту за допомогою Gmail](#how-to-send-mail-as-using-gmail) вище!

Також слід встановити запис SPF для Gmail у записі <strong class="notranslate">TXT</strong> конфігурації DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важливо:
</strong>
<span>
Якщо ви використовуєте Gmail (наприклад, «Надіслати пошту як») або G Suite, вам потрібно додати <code>include:_spf.google.com</code> до вашого запису SPF <strong class="notranslate">TXT</strong>, наприклад:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Чи можу я "надсилати пошту від імені" в Outlook за допомогою цього {#can-i-send-mail-as-in-outlook-with-this}

Так! З 2 жовтня 2018 року ми додали цю функцію. Просто перегляньте ці два посилання від Microsoft нижче:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Також слід встановити запис SPF для Outlook у вашому записі конфігурації DNS <strong class="notranslate">TXT</strong>.

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

Якщо ви є передплатником iCloud+, ви можете використовувати власний домен. [Наш сервіс також сумісний з Apple Mail](#apple-mail).

Будь ласка, дивіться <https://support.apple.com/en-us/102540> для отримання додаткової інформації.

### Чи можу я пересилати необмежену кількість електронних листів за допомогою цього {#can-i-forward-unlimited-emails-with-this}

Так, проте для "відносно невідомих" відправників швидкість обмежена 100 підключеннями на годину на ім'я хоста або IP-адресу. Див. розділ про [Обмеження швидкості](#do-you-have-rate-limiting) та [Сірий список](#do-you-have-a-greylist) вище.

Під «відносно невідомими» ми маємо на увазі відправників, яких немає у [білий список](#do-you-have-an-allowlist).

Якщо цей ліміт перевищено, ми надсилаємо код відповіді 421, який повідомляє поштовому серверу відправника повторити спробу пізніше.

### Ви пропонуєте необмежену кількість доменів за однією ціною {#do-you-offer-unlimited-domains-for-one-price}

Так. Незалежно від того, який у вас план, ви сплачуватимете лише один щомісячний тариф, який охоплює всі ваші домени.

### Які способи оплати ви приймаєте {#which-payment-methods-do-you-accept}

«Пересилання електронної пошти» приймає такі одноразові або щомісячні/щоквартальні/річні способи оплати:

1. **Кредитні/дебетові картки/банківські перекази**: Visa, Mastercard, American Express, Discover, JCB, Diners Club тощо.
2. **PayPal**: підключіть свій обліковий запис PayPal для зручних платежів.
3. **Криптовалюта**: ми приймаємо платежі через стейблкоїни Stripe в мережах Ethereum, Polygon та Solana.

> \[!NOTE]
> Ми зберігаємо обмежену платіжну інформацію на наших серверах, яка включає лише ідентифікатори платежів та посилання на ідентифікатори транзакцій, клієнтів, підписок та платежів [Смуга](https://stripe.com/global) та [PayPal](https://www.paypal.com).

> \[!TIP]
> Для максимальної конфіденційності розгляньте можливість використання платежів у криптовалюті.

Усі платежі обробляються безпечно через Stripe або PayPal. Ваші платіжні дані ніколи не зберігаються на наших серверах.

## Додаткові ресурси {#additional-resources}

> \[!TIP]
> Наші статті нижче регулярно оновлюються новими посібниками, порадами та технічною інформацією. Часто перевіряйте останні новини.

* [Тематичні дослідження та документація для розробників](/blog/docs)
* [Ресурси](/resources)
* [Путівники](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/