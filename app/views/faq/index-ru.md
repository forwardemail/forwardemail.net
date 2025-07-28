# Часто задаваемые вопросы {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Содержание {#table-of-contents}

* [Быстрый старт](#quick-start)
* [Введение](#introduction)
  * [Что такое пересылка электронной почты](#what-is-forward-email)
  * [Кто использует пересылку электронной почты](#who-uses-forward-email)
  * [Какова история пересылки электронной почты?](#what-is-forward-emails-history)
  * [Насколько быстро работает эта услуга?](#how-fast-is-this-service)
* [Почтовые клиенты](#email-clients)
  * [Тандерберд](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Мобильные устройства](#mobile-devices)
  * [Как отправлять почту с помощью Gmail](#how-to-send-mail-as-using-gmail)
  * [Что такое устаревшее бесплатное руководство по отправке почты как с помощью Gmail?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Расширенная конфигурация маршрутизации Gmail](#advanced-gmail-routing-configuration)
  * [Расширенная конфигурация маршрутизации Outlook](#advanced-outlook-routing-configuration)
* [Поиск неисправностей](#troubleshooting)
  * [Почему я не получаю тестовые письма?](#why-am-i-not-receiving-my-test-emails)
  * [Как настроить почтовый клиент для работы с функцией пересылки электронной почты?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Почему мои письма попадают в папку «Спам» и «Нежелательная почта» и как проверить репутацию моего домена?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Что делать, если я получаю спам-письма?](#what-should-i-do-if-i-receive-spam-emails)
  * [Почему мои тестовые письма, отправленные мне в Gmail, отображаются как «подозрительные»?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Можно ли удалить via forwardemail dot net в Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Управление данными](#data-management)
  * [Где расположены ваши серверы?](#where-are-your-servers-located)
  * [Как экспортировать и создать резервную копию моего почтового ящика?](#how-do-i-export-and-backup-my-mailbox)
  * [Как импортировать и перенести мой существующий почтовый ящик?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Поддерживаете ли вы самостоятельный хостинг?](#do-you-support-self-hosting)
* [Конфигурация электронной почты](#email-configuration)
  * [Как начать и настроить пересылку электронной почты](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Можно ли использовать несколько MX-обменников и серверов для расширенной пересылки?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Как настроить автоответчик на случай отсутствия на рабочем месте?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Как настроить SPF для пересылки электронной почты](#how-do-i-set-up-spf-for-forward-email)
  * [Как настроить DKIM для пересылки электронной почты](#how-do-i-set-up-dkim-for-forward-email)
  * [Как настроить DMARC для пересылки электронной почты](#how-do-i-set-up-dmarc-for-forward-email)
  * [Как подключить и настроить мои контакты](#how-do-i-connect-and-configure-my-contacts)
  * [Как подключить и настроить мои календари?](#how-do-i-connect-and-configure-my-calendars)
  * [Как добавить больше календарей и управлять существующими календарями?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Как настроить SRS для пересылки электронной почты?](#how-do-i-set-up-srs-for-forward-email)
  * [Как настроить MTA-STS для пересылки электронной почты](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Как добавить фотографию профиля к моему адресу электронной почты?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Расширенные функции](#advanced-features)
  * [Поддерживаете ли вы рассылки новостей или почтовые рассылки по электронной почте, связанные с маркетингом?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Поддерживаете ли вы отправку электронной почты через API?](#do-you-support-sending-email-with-api)
  * [Поддерживаете ли вы получение электронной почты по протоколу IMAP?](#do-you-support-receiving-email-with-imap)
  * [Поддерживаете ли вы POP3?](#do-you-support-pop3)
  * [Поддерживаете ли вы календари (CalDAV)?](#do-you-support-calendars-caldav)
  * [Поддерживаете ли вы контакты (CardDAV)?](#do-you-support-contacts-carddav)
  * [Поддерживаете ли вы отправку электронной почты через SMTP?](#do-you-support-sending-email-with-smtp)
  * [Поддерживаете ли вы OpenPGP/MIME, сквозное шифрование («E2EE») и веб-каталог ключей («WKD»)?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Поддерживаете ли вы MTA-STS?](#do-you-support-mta-sts)
  * [Поддерживаете ли вы пароли и WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Поддерживаете ли вы лучшие практики электронной почты?](#do-you-support-email-best-practices)
  * [Поддерживаете ли вы отказы веб-хуков?](#do-you-support-bounce-webhooks)
  * [Поддерживаете ли вы вебхуки?](#do-you-support-webhooks)
  * [Поддерживаете ли вы регулярные выражения или регулярные выражения?](#do-you-support-regular-expressions-or-regex)
  * [Каковы ваши лимиты на исходящие SMTP-сообщения?](#what-are-your-outbound-smtp-limits)
  * [Нужно ли мне одобрение для включения SMTP?](#do-i-need-approval-to-enable-smtp)
  * [Каковы настройки конфигурации вашего SMTP-сервера?](#what-are-your-smtp-server-configuration-settings)
  * [Каковы настройки конфигурации вашего сервера IMAP?](#what-are-your-imap-server-configuration-settings)
  * [Каковы настройки конфигурации вашего POP3-сервера?](#what-are-your-pop3-server-configuration-settings)
  * [Конфигурация ретрансляции SMTP Postfix](#postfix-smtp-relay-configuration)
* [Безопасность](#security)
  * [Расширенные методы защиты сервера](#advanced-server-hardening-techniques)
  * [Есть ли у вас сертификаты SOC 2 или ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Используете ли вы шифрование TLS для пересылки электронной почты?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Сохраняете ли вы заголовки аутентификации электронной почты?](#do-you-preserve-email-authentication-headers)
  * [Сохраняете ли вы оригинальные заголовки электронных писем и предотвращаете ли подделку?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Как защититься от спама и злоупотреблений?](#how-do-you-protect-against-spam-and-abuse)
  * [Сохраняете ли вы содержимое электронной почты на диске?](#do-you-store-email-content-on-disk)
  * [Может ли содержимое электронной почты быть раскрыто во время сбоев системы?](#can-email-content-be-exposed-during-system-crashes)
  * [Кто имеет доступ к вашей инфраструктуре электронной почты](#who-has-access-to-your-email-infrastructure)
  * [Какими поставщиками инфраструктуры вы пользуетесь?](#what-infrastructure-providers-do-you-use)
  * [Предлагаете ли вы Соглашение об обработке данных (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Как вы обрабатываете уведомления об утечке данных?](#how-do-you-handle-data-breach-notifications)
  * [Предлагаете ли вы тестовую среду?](#do-you-offer-a-test-environment)
  * [Предоставляете ли вы инструменты мониторинга и оповещения?](#do-you-provide-monitoring-and-alerting-tools)
  * [Как обеспечить высокую доступность](#how-do-you-ensure-high-availability)
  * [Соответствуете ли вы требованиям раздела 889 Закона о национальной обороне (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Системные и технические характеристики](#system-and-technical-details)
  * [Сохраняете ли вы электронные письма и их содержимое?](#do-you-store-emails-and-their-contents)
  * [Как работает ваша система пересылки электронной почты?](#how-does-your-email-forwarding-system-work)
  * [Как вы обрабатываете электронное письмо для пересылки?](#how-do-you-process-an-email-for-forwarding)
  * [Как вы решаете проблемы с доставкой электронной почты?](#how-do-you-handle-email-delivery-issues)
  * [Как вы справляетесь с блокировкой своих IP-адресов?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Что такое адреса почтмейстеров?](#what-are-postmaster-addresses)
  * [Что такое адреса без ответа?](#what-are-no-reply-addresses)
  * [Какие IP-адреса у вашего сервера?](#what-are-your-servers-ip-addresses)
  * [У вас есть белый список?](#do-you-have-an-allowlist)
  * [Какие расширения доменных имен разрешены по умолчанию?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Каковы критерии вашего списка разрешенных?](#what-is-your-allowlist-criteria)
  * [Какие расширения доменных имен можно использовать бесплатно](#what-domain-name-extensions-can-be-used-for-free)
  * [У вас есть серый список?](#do-you-have-a-greylist)
  * [У вас есть черный список?](#do-you-have-a-denylist)
  * [У вас есть ограничение скорости?](#do-you-have-rate-limiting)
  * [Как защититься от обратного рассеяния?](#how-do-you-protect-against-backscatter)
  * [Предотвращайте возвраты писем от известных спамеров MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Предотвращайте ненужные отражения для защиты от обратного рассеяния](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Как определить отпечаток электронной почты](#how-do-you-determine-an-email-fingerprint)
  * [Могу ли я пересылать электронные письма на порты, отличные от 25 (например, если мой интернет-провайдер заблокировал порт 25)?](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Поддерживает ли он символ «плюс» для псевдонимов Gmail?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Поддерживает ли он поддомены?](#does-it-support-sub-domains)
  * [Пересылает ли это заголовки моих писем?](#does-this-forward-my-emails-headers)
  * [Это хорошо проверено?](#is-this-well-tested)
  * [Передаете ли вы ответные сообщения и коды SMTP?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Как защититься от спамеров и обеспечить хорошую репутацию при пересылке электронной почты](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Как выполняется DNS-поиск по доменным именам?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Учетная запись и выставление счетов](#account-and-billing)
  * [Предоставляете ли вы гарантию возврата денег по платным тарифам?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Если я поменяю тариф, вы пропорционально распределите расходы и вернете разницу?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Могу ли я использовать эту службу пересылки электронной почты как «запасной» или «резервный» MX-сервер?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Могу ли я отключить определенные псевдонимы?](#can-i-disable-specific-aliases)
  * [Могу ли я пересылать электронные письма нескольким получателям?](#can-i-forward-emails-to-multiple-recipients)
  * [Могу ли я иметь несколько глобальных получателей для всеобщего сбора сообщений?](#can-i-have-multiple-global-catch-all-recipients)
  * [Существует ли максимальное ограничение на количество адресов электронной почты, на которые я могу пересылать сообщения с одного псевдонима?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Могу ли я рекурсивно пересылать письма?](#can-i-recursively-forward-emails)
  * [Могут ли люди отменить или зарегистрировать мою пересылку электронной почты без моего разрешения?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Как это бесплатно?](#how-is-it-free)
  * [Каков максимальный размер электронного письма?](#what-is-the-max-email-size-limit)
  * [Вы храните журналы электронных писем?](#do-you-store-logs-of-emails)
  * [Вы храните журналы ошибок?](#do-you-store-error-logs)
  * [Ты читаешь мои письма?](#do-you-read-my-emails)
  * [Могу ли я с помощью этого инструмента в Gmail «отправить письмо как»?](#can-i-send-mail-as-in-gmail-with-this)
  * [Могу ли я с помощью этого инструмента в Outlook «отправить почту как»?](#can-i-send-mail-as-in-outlook-with-this)
  * [Могу ли я с помощью этого приложения «отправить письмо как» в Apple Mail и iCloud Mail?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Могу ли я пересылать неограниченное количество писем с помощью этого?](#can-i-forward-unlimited-emails-with-this)
  * [Предлагаете ли вы неограниченное количество доменов по одной цене?](#do-you-offer-unlimited-domains-for-one-price)
  * [Какие способы оплаты вы принимаете?](#which-payment-methods-do-you-accept)
* [Дополнительные ресурсы](#additional-resources)

## Быстрый старт {#quick-start}

Чтобы начать работу с пересылкой электронной почты:

1. **Создайте учетную запись** в [forwardemail.net/register](https://forwardemail.net/register)

2. **Добавьте и подтвердите свой домен** в [Мой аккаунт → Домены](/my-account/domains)

3. **Добавьте и настройте псевдонимы электронной почты/почтовые ящики** в разделе [Мой аккаунт → Домены](/my-account/domains) → Псевдонимы

4. **Проверьте свои настройки**, отправив электронное письмо на один из ваших новых псевдонимов.

> \[!TIP]
> Глобальное распространение изменений DNS может занять до 24–48 часов, хотя часто они вступают в силу гораздо раньше.

> \[!IMPORTANT]
> Для повышения доставляемости рекомендуем настроить записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) и [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

## Введение {#introduction}

### Что такое пересылка электронной почты {#what-is-forward-email}

> \[!NOTE]
> Пересылка электронной почты идеально подходит для частных лиц, малого бизнеса и разработчиков, которым нужны профессиональные адреса электронной почты без необходимости тратиться на обслуживание и обслуживание полноценного решения для хостинга электронной почты.

Forward Email — это **полнофункциональный поставщик услуг электронной почты** и **поставщик услуг хостинга электронной почты для пользовательских доменных имен**.

Это единственный бесплатный сервис с открытым исходным кодом, который позволяет вам использовать собственные доменные адреса электронной почты без необходимости настройки и обслуживания собственного почтового сервера.

Наш сервис пересылает электронные письма, отправленные на ваш пользовательский домен, на вашу существующую учетную запись электронной почты. Вы даже можете использовать нас в качестве своего выделенного провайдера хостинга электронной почты.

Основные возможности пересылки электронной почты:

* **Пользовательский домен электронной почты**: Используйте профессиональные адреса электронной почты с вашим собственным доменным именем.
* **Бесплатный тариф**: Базовая переадресация электронной почты бесплатно.
* **Повышенная конфиденциальность**: Мы не читаем ваши письма и не продаём ваши данные.
* **Открытый исходный код**: Вся наша кодовая база доступна на GitHub.
* **Поддержка SMTP, IMAP и POP3**: Полные возможности отправки и получения электронной почты.
* **Сквозное шифрование**: Поддержка OpenPGP/MIME.
* **Настраиваемые псевдонимы для перехвата всех писем**: Создавайте неограниченное количество псевдонимов электронной почты.

Вы можете сравнить нас с более чем 56 другими поставщиками услуг электронной почты на [наша страница сравнения адресов электронной почты](/blog/best-email-service).

> \[!TIP]
> Узнайте больше о пересылке электронной почты, прочитав нашу бесплатную статью [Технический документ](/technical-whitepaper.pdf)

### Кто использует пересылку электронной почты {#who-uses-forward-email}

Мы предоставляем услуги хостинга электронной почты и переадресации электронной почты для более чем 500 000 доменов и следующим известным пользователям:

| Клиент | Пример исследования |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Военно-морская академия США | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Канонический | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Игры Netflix |  |
| Фонд Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Фонд PHP |  |
| Радио Fox News |  |
| Продажи рекламы Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Убунту | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Бесплатно | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Лубунту | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Кембриджский университет | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Мэрилендский университет | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Вашингтонский университет | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Университет Тафтса | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Колледж Свортмор | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Правительство Южной Австралии |  |
| Правительство Доминиканской Республики |  |
| Fly<span>.</span>io |  |
| Отели RCD |  |
| Исаак З. Шлютер (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| Дэвид Хайнемайер Ханссон (Ruby on Rails) |  |

### Что такое история пересылаемых писем {#what-is-forward-emails-history}

Дополнительную информацию о пересылке электронной почты можно найти на сайте [наша страница «О нас»](/about).

### Насколько быстро работает эта служба {#how-fast-is-this-service}

> \[!NOTE]
> Наша система разработана для скорости и надежности благодаря нескольким резервным серверам, которые гарантируют быструю доставку ваших писем.

Функция пересылки электронной почты доставляет сообщения с минимальной задержкой, обычно в течение нескольких секунд с момента получения.

Показатели производительности:

* **Среднее время доставки**: Менее 5–10 секунд с момента получения до пересылки ([см. нашу страницу мониторинга времени до отправки «TTI»](/tti))
* **Время безотказной работы**: Доступность сервиса более 99,9%
* **Глобальная инфраструктура**: Стратегически расположенные серверы обеспечивают оптимальную маршрутизацию
* **Автоматическое масштабирование**: Наша система масштабируется в периоды пиковой нагрузки

Мы работаем в режиме реального времени, в отличие от других поставщиков, которые полагаются на задержки в очередях.

Мы не записываем на диск и не храним логи – с помощью [исключение ошибок](#do-you-store-error-logs) и [исходящий SMTP](#do-you-support-sending-email-with-smtp) (см. наш [политика конфиденциальности](/privacy)).

Все делается в памяти и [наш исходный код находится на GitHub](https://github.com/forwardemail).

## Почтовые клиенты {#email-clients}

### Thunderbird {#thunderbird}

1. Создайте новый псевдоним и сгенерируйте пароль в панели управления пересылкой электронной почты.
2. Откройте Thunderbird и выберите **Правка → Настройки учётной записи → Действия с учётной записью → Добавить учётную запись электронной почты**.
3. Введите своё имя, адрес электронной почты для пересылки и пароль.
4. Нажмите **Настроить вручную** и введите:
* Входящие: IMAP, `imap.forwardemail.net`, порт 993, SSL/TLS
* Исходящие: SMTP, `smtp.forwardemail.net`, порт 587, STARTTLS
5. Нажмите **Готово**.

### Microsoft Outlook {#microsoft-outlook}

1. Создайте новый псевдоним и сгенерируйте пароль в панели управления пересылкой электронной почты.
2. Перейдите в меню **Файл → Добавить учётную запись**.
3. Введите адрес электронной почты для пересылки и нажмите **Подключить**.
4. Выберите **Дополнительные параметры** и выберите **Настроить учётную запись вручную**.
5. Выберите **IMAP** и введите:
* Входящие: `imap.forwardemail.net`, порт 993, SSL
* Исходящие: `smtp.forwardemail.net`, порт 587, TLS
* Имя пользователя: Ваш полный адрес электронной почты
* Пароль: Ваш сгенерированный пароль
6. Нажмите **Подключить**.

### Apple Mail {#apple-mail}

1. Создайте новый псевдоним и сгенерируйте пароль в панели управления пересылкой электронной почты.
2. Перейдите в раздел **Почта → Настройки → Учётные записи → +**
3. Выберите **Другая учётная запись электронной почты**
4. Введите своё имя, адрес электронной почты для пересылки и пароль.
5. Для настроек сервера введите:
* Входящие: `imap.forwardemail.net`
* Исходящие: `smtp.forwardemail.net`
* Имя пользователя: Ваш полный адрес электронной почты
* Пароль: Ваш сгенерированный пароль
6. Нажмите **Войти**

### Мобильные устройства {#mobile-devices}

Для iOS:

1. Перейдите в **Настройки → Почта → Учётные записи → Добавить учётную запись → Другое**
2. Нажмите **Добавить учётную запись электронной почты** и введите свои данные.
3. Для настроек сервера используйте те же настройки IMAP и SMTP, что и выше.

Для Android:

1. Перейдите в раздел **Настройки → Учётные записи → Добавить учётную запись → Личный (IMAP)**
2. Введите адрес электронной почты для пересылки и пароль.
3. Для настроек сервера используйте те же настройки IMAP и SMTP, что и выше.

### Как отправить почту с помощью Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Расчётное время настройки:</strong>
<span>Менее 10 минут</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Начало работы:
</strong>
<span>
Если вы следовали инструкциям выше в разделе <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Как начать работу и настроить пересылку электронной почты</a>, вы можете продолжить чтение ниже.
</span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Убедитесь, что вы ознакомились с нашими <a href="/terms" class="alert-link" target="_blank">Условиями</a>, <a href="/privacy" class="alert-link" target="_blank">Политикой конфиденциальности</a> и <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ограничениями на исходящие SMTP-сообщения</a>. Ваше использование считается подтверждением и согласием.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы разработчик, ознакомьтесь с нашей <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документацией по API электронной почты</a>.
</span>
</div>

1. Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.

2. Создайте новый псевдоним для своего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>)

3. Нажмите кнопку <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong> рядом с созданным псевдонимом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, показанный на экране.

4. Перейдите в [Gmail](https://gmail.com) и в разделе [Настройки <i class="fa fa-angle-right"></i> Учетные записи и импорт <i class="fa fa-angle-right"></i> Отправить почту как](https://mail.google.com/mail/u/0/#settings/accounts) нажмите «Добавить другой адрес электронной почты».

5. При появлении запроса на ввод имени введите имя, от которого вы хотите, чтобы ваше электронное письмо отображалось в поле «От» (например, «Линус Торвальдс»).

6. При появлении запроса на ввод адреса электронной почты введите полный адрес электронной почты псевдонима, созданного вами в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>)

7. Снимите флажок «Использовать как псевдоним».

8. Нажмите «Следующий шаг», чтобы продолжить.

9. При появлении запроса «SMTP-сервер» введите <code>smtp.forwardemail.net</code> и оставьте порт <code>587</code>.

10. При появлении запроса «Имя пользователя» введите полный адрес электронной почты псевдонима, созданного вами в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>)

11. При появлении запроса «Пароль» вставьте пароль из раздела <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong>, указанного в шаге 3 выше.

12. Оставьте переключатель «Защищенное соединение с использованием TLS» установленным.

13. Нажмите «Добавить учетную запись», чтобы продолжить.

14. Откройте новую вкладку на [Gmail](https://gmail.com) и дождитесь получения проверочного письма (вы получите проверочный код, подтверждающий, что вы являетесь владельцем адреса электронной почты, с которого пытаетесь «Отправить почту как»).

15. После получения скопируйте и вставьте код подтверждения в строку, которую вы получили на предыдущем шаге.

16. После этого вернитесь к электронному письму и нажмите ссылку «Подтвердить запрос». Скорее всего, вам потребуется выполнить этот и предыдущий шаги для корректной настройки электронного письма.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

</div>

### Что такое устаревшее бесплатное руководство по отправке почты как с помощью Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Важно:</strong> Это устаревшее бесплатное руководство устарело с мая 2023 года, так как <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we теперь поддерживает исходящий SMTP</a>. Если вы воспользуетесь руководством ниже, то <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this приведёт к тому, что ваше исходящее письмо</a> в Gmail будет отображаться как «<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>».</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Расчётное время настройки:</strong>
<span>Менее 10 минут</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Начало работы:
</strong>
<span>
Если вы следовали инструкциям выше в разделе <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Как начать работу и настроить пересылку электронной почты</a>, вы можете продолжить чтение ниже.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Как отправить почту как с помощью Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Для работы этой функции необходимо включить [двухфакторную аутентификацию Gmail][gmail-2fa]. Если она не включена, перейдите на страницу <https://www.google.com/landing/2step/>.

2. После включения двухфакторной аутентификации (или если она уже была включена) перейдите по адресу <https://myaccount.google.com/apppasswords>.

3. При появлении запроса «Выберите приложение и устройство, для которых вы хотите сгенерировать пароль»:
* Выберите «Почта» в раскрывающемся списке «Выберите приложение».
* Выберите «Другое» в раскрывающемся списке «Выберите устройство».
* При появлении запроса на ввод текста введите адрес электронной почты вашего домена, с которого вы пересылаете письма (например, <code><hello@example.com></code> — это поможет вам отслеживать пересылку, если вы используете этот сервис для нескольких аккаунтов).

4. Скопируйте автоматически сгенерированный пароль в буфер обмена.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете G Suite, перейдите в панель администратора <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Приложения <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Настройки Gmail <i class="fa fa-angle-right"></i> Настройки</a> и убедитесь, что установлен флажок «Разрешить пользователям отправлять почту через внешний SMTP-сервер...». Изменение вступит в силу с некоторой задержкой, поэтому подождите несколько минут.
</span>
</div>

5. Перейдите в [Gmail](https://gmail.com) и в разделе [Настройки <i class="fa fa-angle-right"></i> Учетные записи и импорт <i class="fa fa-angle-right"></i> Отправить почту как](https://mail.google.com/mail/u/0/#settings/accounts) нажмите «Добавить другой адрес электронной почты».

6. При появлении запроса «Имя» введите имя, от которого вы хотите, чтобы ваше электронное письмо отображалось в поле «От» (например, «Линус Торвальдс»).

7. При появлении запроса «Адрес электронной почты» введите адрес электронной почты с пользовательским доменом, который вы использовали выше (например, <code><hello@example.com></code>).

8. Снимите флажок «Использовать как псевдоним».

9. Нажмите «Следующий шаг», чтобы продолжить.

10. При появлении запроса «SMTP-сервер» введите <code>smtp.gmail.com</code> и оставьте порт <code>587</code>.

11. При запросе «Имя пользователя» введите часть вашего адреса Gmail без части <span>gmail.com</span> (например, просто «пользователь», если мой адрес электронной почты <span><user@gmail.com></span>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если часть «Имя пользователя» заполнена автоматически, <u><strong>вам нужно будет заменить её</strong></u> на имя пользователя из вашего адреса Gmail.
</span>
</div>

12. При появлении запроса «Пароль» вставьте из буфера обмена пароль, сгенерированный на шаге 2 выше.

13. Оставьте переключатель «Защищенное соединение с использованием TLS» установленным.

14. Нажмите «Добавить учетную запись», чтобы продолжить.

15. Откройте новую вкладку на [Gmail](https://gmail.com) и дождитесь получения проверочного письма (вы получите проверочный код, подтверждающий, что вы являетесь владельцем адреса электронной почты, с которого пытаетесь «Отправить почту как»).

16. После получения скопируйте и вставьте код подтверждения в строку, полученную на предыдущем шаге.

17. После этого вернитесь к электронному письму и нажмите ссылку «Подтвердить запрос». Скорее всего, вам потребуется выполнить этот и предыдущий шаги для корректной настройки электронного письма.

</div>

### Расширенная конфигурация маршрутизации Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Расчетное время настройки:</strong>
<span>15–30 минут</span>
</div>

Если вы хотите настроить расширенную маршрутизацию в Gmail, чтобы псевдонимы, не соответствующие почтовому ящику, пересылались на почтовые ящики Forward Email, выполните следующие действия:

1. Войдите в консоль администратора Google по адресу [admin.google.com](https://admin.google.com).
2. Перейдите в раздел **Приложения → Google Workspace → Gmail → Маршрутизация**.
3. Нажмите **Добавить маршрут** и настройте следующие параметры:

**Настройки для одного получателя:**

* Выберите «Изменить получателя конверта» и введите свой основной адрес Gmail.
* Установите флажок «Добавить заголовок X-Gm-Original-To для исходного получателя».

**Шаблоны получателей конвертов:**

* Добавьте шаблон, который соответствует всем несуществующим почтовым ящикам (например, `.*@yourdomain.com`)

**Настройки почтового сервера:**

* Выберите «Маршрут к узлу» и введите `mx1.forwardemail.net` в качестве основного сервера.
* Добавьте `mx2.forwardemail.net` в качестве резервного сервера.
* Установите порт 25.
* Выберите «Требовать TLS» для обеспечения безопасности.

4. Нажмите **Сохранить**, чтобы создать маршрут.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Эта конфигурация будет работать только для учётных записей Google Workspace с пользовательскими доменами, а не для обычных учётных записей Gmail.
</span>
</div>

### Расширенная конфигурация маршрутизации Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Расчетное время настройки:</strong>
<span>15–30 минут</span>
</div>

Для пользователей Microsoft 365 (ранее Office 365), желающих настроить расширенную маршрутизацию, чтобы псевдонимы, не соответствующие почтовым ящикам, пересылались на почтовые службы Forward Email:

1. Войдите в Центр администрирования Microsoft 365 по адресу [admin.microsoft.com](https://admin.microsoft.com).
2. Перейдите в раздел **Exchange → Поток обработки почты → Правила**.
3. Нажмите **Добавить правило** и выберите **Создать новое правило**.
4. Укажите название правила (например, «Пересылать несуществующие почтовые ящики для пересылки сообщений»).
5. В разделе **Применить это правило, если** выберите:
* «Адрес получателя соответствует...».
* Введите шаблон, соответствующий всем адресам в вашем домене (например, `*@yourdomain.com`).
6. В разделе **Выполнить следующие действия** выберите:
* «Перенаправить сообщение на...».
* Выберите «Следующий почтовый сервер».
* Введите `mx1.forwardemail.net` и порт 25.
* Добавьте `mx2.forwardemail.net` в качестве резервного сервера.
7. В разделе **Кроме случаев, если** выберите:
* «Получатель ..."
* Добавьте все существующие почтовые ящики, которые не нужно пересылать.
8. Установите приоритет правила, чтобы оно выполнялось после других правил обработки почты.
9. Нажмите **Сохранить**, чтобы активировать правило.

## Устранение неполадок {#troubleshooting}

### Почему я не получаю тестовые письма {#why-am-i-not-receiving-my-test-emails}

Если вы отправляете тестовое письмо самому себе, оно может не отобразиться в вашем почтовом ящике, поскольку у него тот же заголовок «Message-ID».

Это широко известная проблема, которая затрагивает также такие службы, как Gmail. <a href="https://support.google.com/a/answer/1703601">Here — официальный ответ Gmail по этой проблеме</a>.

Если проблемы сохраняются, скорее всего, проблема связана с распространением DNS. Вам нужно будет немного подождать и повторить попытку (или попробовать уменьшить значение TTL для записей <strong class="notranslate">TXT</strong>).

**Все еще есть проблемы?** Пожалуйста, <a href="/help">свяжитесь с нами</a>, чтобы мы могли помочь разобраться в проблеме и найти быстрое решение.

### Как настроить почтовый клиент для работы с пересылкой электронной почты {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Наш сервис работает с популярными почтовыми клиентами, такими как:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Терминал</a></li>
</ul>
</div>

<div class="alert alert-primary">
Ваше имя пользователя — это адрес электронной почты вашего псевдонима, а пароль — из <strong class="text-success"><i class="fa fa-key"></i>Сгенерировать пароль</strong> («Обычный пароль»).
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Если вы используете Thunderbird, убедитесь, что для параметра «Безопасность подключения» установлено значение «SSL/TLS», а для метода аутентификации — «Обычный пароль».</span>
</div>

| Тип | Имя хоста | Протокол | Порты |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Предпочтительно** | `993` и `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Предпочтительно** или TLS (STARTTLS) | `465` и `2465` для SSL/TLS (или) `587`, `2587`, `2525` и `25` для TLS (STARTTLS) |

### Почему мои письма попадают в папку «Спам» и «Нежелательная почта» и как проверить репутацию моего домена {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

В этом разделе вы узнаете, использует ли ваша исходящая почта наши SMTP-серверы (например, `smtp.forwardemail.net`) (или пересылается через `mx1.forwardemail.net` или `mx2.forwardemail.net`) и попадает ли она в папку «Спам» или «Нежелательная почта» получателей.

Мы регулярно отслеживаем [IP-адреса](#what-are-your-servers-ip-addresses) по сравнению с [все авторитетные списки запрещенных DNS](#how-do-you-handle-your-ip-addresses-becoming-blocked), **поэтому это, скорее всего, проблема, связанная с репутацией домена**.

Письма могут попадать в папку «Спам» по нескольким причинам:

1. **Отсутствует аутентификация**: настройте записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) и [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Репутация домена**: Новые домены часто имеют нейтральную репутацию, пока не создадут историю отправки.

3. **Триггеры контента**: определенные слова или фразы могут вызвать срабатывание спам-фильтров.

4. **Шаблоны отправки**: Внезапное увеличение объема электронных писем может выглядеть подозрительно.

Вы можете попробовать использовать один или несколько из этих инструментов для проверки репутации и категоризации вашего домена:

| Название инструмента | URL | Тип |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Обратная связь по категоризации домена Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Категоризация |
| Проверка репутации IP-адресов и доменов Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Центр репутации IP-адресов и доменов Cisco Talos | <https://talosintelligence.com/reputation_center> | Репутация |
| Поиск репутации IP-адреса и домена Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Проверка черного списка MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Черный список |
| Инструменты Google Postmaster | <https://www.gmail.com/postmaster/> | Репутация |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Репутация |
| Проверка черного списка MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Оценка отправителя | <https://senderscore.org/act/blocklist-remover/> | Репутация |
| Недооценка | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Удаление IP-адресов Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Удаление |
| Удаление IP-адреса Cloudmark | <https://csi.cloudmark.com/en/reset/> | Удаление |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Удаление IP-адресов Microsoft Outlook и Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Удаление |
| Уровни 1, 2 и 3 UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| backscatterer.org от UCEPROTECT | <https://www.backscatterer.org/> | Защита от обратного рассеяния |
| Whitelisted.org от UCEPROTECT | <https://www.whitelisted.org/> (требуется плата) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Удаление |
| AOL/Verizon (например, `[IPTS04]`) | <https://senders.yahooinc.com/> | Удаление |
| Кокс Коммуникации | `unblock.request@cox.net` | Удаление |
| t-online.de (немецкий/T-Mobile) | `tobr@rx.t-online.de` | Удаление |

> \[!TIP]
> Начните с небольшого количества качественных писем, чтобы создать себе положительную репутацию, прежде чем переходить к более масштабной рассылке.

> \[!IMPORTANT]
> Если ваш домен попал в чёрный список, у каждого чёрного списка своя процедура удаления. Инструкции можно найти на их сайтах.

> \[!TIP]
> Если вам нужна дополнительная помощь или вы обнаружили, что какой-либо поставщик услуг электронной почты ошибочно отнес нас к спаму, пожалуйста, <a href="/help">свяжитесь с нами</a>.

### Что делать, если я получаю спам-письма {#what-should-i-do-if-i-receive-spam-emails}

Вам следует отписаться от рассылки (если это возможно) и заблокировать отправителя.

Пожалуйста, не сообщайте о сообщении как о спаме, а вместо этого перешлите его в нашу вручную отслеживаемую и ориентированную на конфиденциальность систему предотвращения злоупотреблений.

**Адрес электронной почты для пересылки спама:** <abuse@forwardemail.net>

### Почему мои тестовые письма, отправленные мне в Gmail, отображаются как «подозрительные» {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Если вы видите это сообщение об ошибке в Gmail, когда отправляете тестовое письмо самому себе или когда человек, которому вы отправляете электронное письмо с вашего псевдонима, впервые видит электронное письмо от вас, то **пожалуйста, не беспокойтесь** — это встроенная функция безопасности Gmail.

Вы можете просто нажать «Выглядит безопасно». Например, если вы отправите тестовое сообщение с помощью функции «Отправить письмо как» (кому-то другому), то этот человек не увидит это сообщение.

Однако, если они видят это сообщение, это значит, что они привыкли видеть ваши письма с адреса <john@gmail.com>, а не с <john@customdomain.com> (это просто пример). Gmail оповестит пользователей, чтобы убедиться в безопасности на всякий случай, и обходного пути нет.

### Можно ли удалить via forwardemail dot net в Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}?

Эта тема связана с [широко известная проблема в Gmail, из-за которой рядом с именем отправителя отображается дополнительная информация](https://support.google.com/mail/answer/1311182).

С мая 2023 года мы поддерживаем отправку электронной почты с помощью SMTP в качестве дополнения для всех платных пользователей. Это значит, что вы можете удалить <span class="notranslate">via forwardemail dot net</span> в Gmail.

Обратите внимание, что эта тема часто задаваемых вопросов предназначена специально для тех, кто использует функцию [Как отправлять почту с помощью Gmail](#how-to-send-mail-as-using-gmail).

Инструкции по настройке см. в разделе [Поддерживаете ли вы отправку электронной почты через SMTP?](#do-you-support-sending-email-with-smtp).

## Управление данными {#data-management}

### Где находятся ваши серверы {#where-are-your-servers-located}

> \[!TIP]
> Возможно, вскоре мы объявим о размещении нашего центра обработки данных в ЕС, который будет размещен на сервере [forwardemail.eu](https://forwardemail.eu). Подпишитесь на обсуждение в <https://github.com/orgs/forwardemail/discussions/336>, чтобы быть в курсе новостей.

Наши серверы в основном расположены в Денвере, штат Колорадо — полный список IP-адресов см. по адресу <https://forwardemail.net/ips>.

Информацию о наших субпроцессорах можно найти на страницах [GDPR](/gdpr), [DPA](/dpa) и [Конфиденциальность](/privacy).

### Как экспортировать и создать резервную копию моего почтового ящика {#how-do-i-export-and-backup-my-mailbox}

В любое время вы можете экспортировать свои почтовые ящики в форматах [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Мбокс](https://en.wikipedia.org/wiki/Mbox) или зашифрованном [SQLite](https://en.wikipedia.org/wiki/SQLite).

Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы <i class="fa fa-angle-right"></i> Загрузить резервную копию и выберите предпочитаемый вами формат экспорта.

После завершения экспорта вам на электронную почту будет отправлена ссылка для загрузки.

Обратите внимание, что срок действия этой ссылки для экспорта истекает через 4 часа из соображений безопасности.

Если вам необходимо проверить экспортированные форматы EML или Mbox, то эти инструменты с открытым исходным кодом могут оказаться полезными:

| Имя | Формат | Платформа | URL-адрес GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer | Мбокс | Окна | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Мбокс | Все платформы | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Окна | <https://github.com/ayamadori/EmlReader> |
| Просмотрщик электронной почты | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-ридер | EML | Все платформы | <https://github.com/s0ph1e/eml-reader> |

Кроме того, если вам нужно преобразовать файл Mbox в файл EML, вы можете использовать <https://github.com/noelmartinon/mboxzilla>.

### Как импортировать и перенести мой существующий почтовый ящик {#how-do-i-import-and-migrate-my-existing-mailbox}

Вы можете легко импортировать свою электронную почту в функцию пересылки (например, используя [Тандерберд](https://www.thunderbird.net)), следуя инструкциям ниже:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Чтобы импортировать существующую электронную почту, необходимо выполнить все следующие шаги.
</span>
</div>

1. Экспортируйте свою электронную почту из вашего существующего провайдера электронной почты:

| Поставщик электронной почты | Формат экспорта | Инструкции по экспорту |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Перспективы | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Совет.</strong> <span>Если вы используете Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">формат экспорта PST</a>), то вы можете просто следовать инструкциям в разделе «Другое» ниже. Однако ниже мы предоставили ссылки для преобразования PST в формат MBOX/EML в зависимости от вашей операционной системы:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba для Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst для Windows cygwin</a> – (например, <code>readpst -u -o $OUT_DIR $IN_DIR</code> заменив <code>$OUT_DIR</code> и <code>$IN_DIR</code> на пути к выходному и входному каталогам соответственно).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst для Ubuntu/Linux</a> — (например, <code>sudo apt-get install readpst</code>, а затем <code>readpst -u -o $OUT_DIR $IN_DIR</code>, заменив <code>$OUT_DIR</code> и <code>$IN_DIR</code> на пути к выходному и входному каталогам соответственно).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst для macOS (через brew)</a> — (например, <code>brew install libpst</code>, а затем <code>readpst -u -o $OUT_DIR $IN_DIR</code>, заменив <code>$OUT_DIR</code> и <code>$IN_DIR</code> на пути к выходному и входному каталогам соответственно).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Конвертер PST для Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Протонная почта | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Тутанота | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Думать | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Зохо | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Другой | [Use Thunderbird](https://www.thunderbird.net) | Настройте существующую учётную запись электронной почты в Thunderbird, а затем используйте плагин [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) для экспорта и импорта электронной почты. **Вы также можете просто копировать/вставлять или перетаскивать письма из одной учётной записи в другую.** |

2. Загрузите, установите и откройте [Тандерберд](https://www.thunderbird.net).

3. Создайте новую учетную запись, используя полный адрес электронной почты вашего псевдонима (например, <code><you@yourdomain.com></code>) и сгенерированный пароль. <strong>Если у вас ещё нет сгенерированного пароля, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">ознакомьтесь с нашими инструкциями по настройке</a></strong>.

4. Загрузите и установите плагин Thunderbird [ImportExportTools OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Создайте новую локальную папку в Thunderbird, затем щелкните ее правой кнопкой мыши → выберите параметр `ImportExportTools NG` → выберите `Import mbox file` (для формата экспорта MBOX) – или – `Import messages` / `Import all messages from a directory` (для формата экспорта EML).

6. Перетащите содержимое локальной папки в новую (или существующую) папку IMAP в Thunderbird, в которую вы хотите загрузить сообщения, используя IMAP-хранилище нашего сервиса. Это обеспечит их резервное копирование в онлайн-хранилище SQLite с шифрованием.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Если вы не знаете, как импортировать данные в Thunderbird, обратитесь к официальным инструкциям по ссылкам <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> и <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
После завершения процесса экспорта и импорта вы также можете включить пересылку для существующего аккаунта электронной почты и настроить автоответчик для уведомления отправителей о новом адресе электронной почты (например, если вы ранее использовали Gmail, а теперь используете почту с вашим собственным доменным именем).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

### Поддерживаете ли вы самостоятельный хостинг {#do-you-support-self-hosting}?

Да, с марта 2025 года мы поддерживаем возможность размещения на собственном сервере. Читайте блог [здесь](https://forwardemail.net/blog/docs/self-hosted-solution). Чтобы начать, ознакомьтесь с [самостоятельно размещенное руководство](https://forwardemail.net/self-hosted). А если вам интересна более подробная пошаговая версия, ознакомьтесь с нашими руководствами по [Убунту](https://forwardemail.net/guides/selfhosted-on-ubuntu) или [Дебиан](https://forwardemail.net/guides/selfhosted-on-debian).

## Конфигурация электронной почты {#email-configuration}

### Как начать работу и настроить пересылку электронной почты {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Расчётное время настройки:</strong>
<span>Менее 10 минут</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Начало работы:
</strong>
<span>
Внимательно прочтите и выполните шаги с первого по восьмой, перечисленные ниже. Обязательно замените адрес электронной почты <code>user@gmail.com</code> на адрес электронной почты, на который вы хотите пересылать письма (если он указан неверно). Аналогично, обязательно замените <code>example.com</code> на ваше доменное имя (если он указан неверно).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Если вы уже где-то зарегистрировали свой домен, пропустите этот шаг и перейдите ко второму! В противном случае вы можете <a href="/domain-registration" rel="noopener noreferrer">нажать здесь, чтобы зарегистрировать свой домен</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Вы помните, где вы зарегистрировали свой домен? Вспомнив, следуйте инструкциям ниже:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Необходимо открыть новую вкладку и войти в систему вашего регистратора домена. Для автоматического входа нажмите на ссылку «Регистратор» ниже. В этой новой вкладке необходимо перейти на страницу управления DNS вашего регистратора. Ниже в столбце «Шаги по настройке» мы привели пошаговые инструкции. Перейдя на эту страницу в новой вкладке, вы можете вернуться на эту вкладку и перейти к третьему шагу.
<strong class="font-weight-bold">Не закрывайте пока открытую вкладку; она понадобится вам для дальнейших действий!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Регистратор</th>
<th>Шаги по настройке</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Войти <i class="fa fa-angle-right"></i> Центр доменов <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Изменить настройки DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Маршрут 53</a></td>
<td>Войти <i class="fa fa-angle-right"></i> Зоны хостинга <i class="fa fa-angle-right"></i> (Выберите свой домен)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Войти <i class="fa fa-angle-right"></i> Мои серверы <i class="fa fa-angle-right"></i> Управление доменами <i class="fa fa-angle-right"></i> Менеджер DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ДЛЯ ROCK: Войти <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> (Нажмите на значок ▼ рядом с кнопкой «Управление») <i class="fa fa-angle-right"></i> DNS
<br />
ДЛЯ УСТАРЕВШИХ: Войти <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> Редактор зон <i class="fa fa-angle-right"></i> (Выберите свой домен)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Войти <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Сделано Просто</a></td>
<td>Войти <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Выберите свой домен)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Войти <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Управление</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Войти <i class="fa fa-angle-right"></i> Сеть <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Подробнее <i class="fa fa-angle-right"></i> Управление доменом</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Войти <i class="fa fa-angle-right"></i> В карточном режиме нажмите «Управление» для своего домена <i class="fa fa-angle-right"></i> В режиме списка нажмите
на значок шестеренки <i class="fa fa-angle-right"></i> DNS и серверы имён <i class="fa fa-angle-right"></i> DNS-записи</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Смотреть</a>
</td>
<td>Войти <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> (нажмите на значок шестеренки) <i class="fa fa-angle-right"></i> Нажмите «DNS и серверы имён» в меню слева</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Войти <i class="fa fa-angle-right"></i> Панель <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> Управление доменами <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Войти <i class="fa fa-angle-right"></i> Обзор <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Простой редактор <i class="fa fa-angle-right"></i> Записи</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Войти <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Редактировать зону</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Смотреть</a>
</td>
<td>Войти <i class="fa fa-angle-right"></i> Управление моими доменами <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Управление DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Домены</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Смотреть</a>
</td>
<td>Войти <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Настроить DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Смотреть</a>
</td>
<td>Войти <i class="fa fa-angle-right"></i> Список доменов <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Расширенный DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Войти <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Настройка DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Решения</a></td>
<td>Войти <i class="fa fa-angle-right"></i> Менеджер аккаунтов <i class="fa fa-angle-right"></i> Мои доменные имена <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Изменение направления домена <i class="fa fa-angle-right"></i> Расширенный DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Смотреть</a>
</td>
<td>Войти <i class="fa fa-angle-right"></i> Управляемые домены <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> Настройки DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Войти <i class="fa fa-angle-right"></i> Главное меню <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i>
Расширенные настройки <i class="fa fa-angle-right"></i> Пользовательские записи</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Now</a></td>
<td>Использование CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Войти <i class="fa fa-angle-right"></i> Страница доменов <i class="fa fa-angle-right"></i> (Выберите свой домен) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Войти <i class="fa fa-angle-right"></i> Страница «Домены» <i class="fa fa-angle-right"></i> (Нажмите на значок <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Выберите «Управление записями DNS»</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Войти <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> Мои домены</td>
</tr>
<tr>
<td>Другое</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Важно:</strong> Не видите здесь имя вашего регистратора? Просто найдите в Интернете «как изменить записи DNS на $REGISTRAR» (заменив $REGISTRAR на имя вашего регистратора – например, «как изменить записи DNS на GoDaddy», если вы используете GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">На странице управления DNS вашего регистратора (другая открытая вами вкладка) настройте следующие записи MX:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Обратите внимание, что не должно быть других записей MX. Обе записи, показанные ниже, ДОЛЖНЫ существовать. Убедитесь, что нет опечаток; и что mx1 и mx2 написаны правильно. Если записи MX уже существуют, полностью удалите их.
Значение «TTL» не обязательно должно быть 3600, при необходимости оно может быть меньше или больше.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Приоритет</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Используя страницу управления DNS вашего регистратора (другую открытую вами вкладку), задайте следующие <strong class="notranslate">TXT</strong> записи:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если у вас платный тарифный план, пропустите этот шаг и перейдите к шагу 5! Если у вас платный тарифный план, ваши переадресованные адреса будут доступны для публичного поиска. Перейдите в раздел <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учётная запись <i class="fa fa-angle-right"></i> Домены</a> и при желании подключите свой домен к платному тарифному плану. Подробнее о платных тарифных планах можно узнать на странице <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Цены</a>. В противном случае вы можете продолжить, выбрав одну или несколько комбинаций от Варианта A до Варианта F, перечисленных ниже.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Вариант A:
</strong>
<span>
Если вы пересылаете все письма со своего домена (например, "all@example.com", "hello@example.com" и т. д.) на определенный адрес "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Совет:
</strong>
<span>
Обязательно замените значения в столбце «Значение» на свой адрес электронной почты. Значение «TTL» не обязательно должно быть 3600, при необходимости оно может быть меньше или больше. Более низкое значение времени жизни («TTL») обеспечит более быстрое распространение любых будущих изменений в ваших записях DNS по всему Интернету – представьте себе, что это время кэширования в памяти (в секундах). Подробнее о <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL можно узнать в Википедии</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Вариант B:
</strong>
<span>
Если вам нужно переслать только один адрес электронной почты (например, <code>hello@example.com</code> на <code>user@gmail.com</code>; это также автоматически перешлет "hello+test@example.com" на "user+test@gmail.com"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Вариант C:
</strong>
<span>
Если вы пересылаете несколько писем, разделите их запятыми:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Вариант D:
</strong>
<span>
Вы можете настроить неограниченное количество пересылаемых писем — просто убедитесь, что длина не превышает 255 символов в одной строке, и начинайте каждую строку с "forward-email=". Пример приведён ниже:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Вариант E:
</strong>
<span>
Вы также можете указать доменное имя в записи <strong class="notranslate">TXT</strong> для глобальной переадресации псевдонимов (например, «user@example.com» будет переадресован на «user@example.net»):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Вариант F:
</strong>
<span>
Вы даже можете использовать веб-хуки как глобальный или индивидуальный псевдоним для пересылки писем. См. пример и полный раздел о веб-хуках под названием <a href="#do-you-support-webhooks" class="alert-link">Поддерживаете ли вы веб-хуки?</a> ниже.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Вариант G:
</strong>
<span>
Вы даже можете использовать регулярные выражения (regex) для сопоставления псевдонимов и обработки подстановок при пересылке писем. См. примеры и полный раздел о регулярных выражениях под названием <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Поддерживаете ли вы регулярные выражения или regex</a> ниже.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Нужны сложные регулярные выражения с подстановкой?</strong> См. примеры и полный раздел о регулярных выражениях под заголовком <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Поддерживаете ли вы регулярные выражения или регулярные выражения</a> ниже.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Простой пример:</strong> Если я хочу, чтобы все письма, отправленные на `linus@example.com` или `torvalds@example.com`, пересылались на `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
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
Важно:
</strong>
<span>
Правила пересылки для всех писем также можно описать как «пропускаемые».
Это означает, что входящие письма, соответствующие хотя бы одному определённому правилу пересылки, будут использоваться вместо правил пересылки для всех писем.
Особые правила включают адреса электронной почты и регулярные выражения.
<br /><br />
Например:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Письма, отправленные на адрес <code>hello@example.com</code>, **не** будут пересылаться на адрес <code>second@gmail.com</code> (для всех писем) при такой настройке, а будут доставляться только на адрес <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Используя страницу управления DNS вашего регистратора (другую открытую вами вкладку), дополнительно настройте следующую <strong class="notranslate">TXT</strong> запись:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете Gmail (например, «Отправить письмо как») или G Suite, вам необходимо добавить <code>include:_spf.google.com</code> к указанному выше значению, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Если у вас уже есть похожая строка с "v=spf1", вам нужно добавить <code>include:spf.forwardemail.net</code> непосредственно перед любой существующей записью "include:host.com" и перед "-all" в той же строке, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Обратите внимание на разницу между "-all" и "~all". Символ "-" означает, что проверка SPF должна быть НЕУДАЧНОЙ, если результат не совпадает, а "~" означает, что проверка SPF должна быть НЕУДАЧНОЙ. Мы рекомендуем использовать подход «-all» для предотвращения подделки домена.
<br /><br />
Возможно, вам также потребуется включить запись SPF для хоста, с которого вы отправляете почту (например, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Проверьте свои записи DNS с помощью нашего инструмента «Проверка записей», доступного в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройка.

</li><li class="mb-2 mb-md-3 mb-lg-5">Отправьте тестовое письмо, чтобы убедиться в работоспособности. Обратите внимание, что распространение записей DNS может занять некоторое время.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
</span>
Если вы не получаете тестовые письма или получаете тестовое письмо с текстом «Будьте осторожны с этим сообщением», см. ответы на вопросы <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Почему я не получаю тестовые письма</a> и <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Почему мои тестовые письма, отправленные мне в Gmail, отображаются как «подозрительные»</a> соответственно.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Если вы хотите «Отправить письмо как» из Gmail, вам необходимо <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">посмотреть это видео</a></strong> или выполнить действия, описанные в разделе <a href="#how-to-send-mail-as-using-gmail">How Отправка письма как с помощью Gmail</a> ниже.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Ниже перечислены дополнительные дополнения. Обратите внимание, что эти дополнения необязательны и могут быть не нужны. Мы хотели хотя бы предоставить вам дополнительную информацию при необходимости.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Дополнительное дополнение:
</strong>
<span>
Если вы используете функцию <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How для отправки почты как в Gmail</a>, вам может потребоваться добавить себя в белый список. См. <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">эти инструкции Gmail</a> по этой теме.
</span>
</div>

### Можно ли использовать несколько MX-обменников и серверов для расширенной пересылки {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Да, но **в ваших записях DNS должен быть указан только один обмен MX**.

Не пытайтесь использовать «Приоритет» как способ настройки нескольких обменов MX.

Вместо этого вам необходимо настроить существующий обмен MX для пересылки почты для всех несовпадающих псевдонимов на обмены нашей службы (`mx1.forwardemail.net` и/или `mx2.forwardemail.net`).

Если вы используете Google Workspace и хотите перенаправить все несовпадающие псевдонимы в нашу службу, см. <https://support.google.com/a/answer/6297084>.

Если вы используете Microsoft 365 (Outlook) и хотите пересылать все несовпадающие псевдонимы в нашу службу, см. <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> и <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Как настроить автоответчик на случай отсутствия на работе {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы и создайте или отредактируйте псевдоним, для которого вы хотите настроить автоответчик об отпуске.

У вас есть возможность настроить начальную и конечную дату, тему и сообщение, а также включить или отключить их в любое время:

* В настоящее время поддерживаются темы и сообщения в виде обычного текста (мы используем внутренний пакет `striptags` для удаления HTML-кода).
* Тема ограничена 100 символами.
* Сообщение ограничено 1000 символами.
* Для настройки требуется настройка исходящего SMTP (например, вам потребуется настроить записи DKIM, DMARC и Return-Path DNS).
* Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учётная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Настройка исходящего SMTP и следуйте инструкциям по настройке.
* Автоответчик нельзя включить для глобальных доменных имён (например, [одноразовые адреса](/disposable-addresses) не поддерживается).
* Автоответчик нельзя включить для псевдонимов с подстановочными знаками/универсальными символами (`*`) или регулярными выражениями.

В отличие от почтовых систем, таких как `postfix` (например, которые используют расширение фильтра отпусков `sieve`), функция пересылки электронной почты автоматически добавляет вашу подпись DKIM, обеспечивает фиктивную защиту от проблем с подключением при отправке ответов об отпуске (например, из-за распространенных проблем с подключением SSL/TLS и устаревших поддерживаемых серверов) и даже поддерживает шифрование Open WKD и PGP для ответов об отпуске.

<!--
* Во избежание злоупотреблений за каждое отправленное сообщение автоответчика будет списываться 1 исходящий SMTP-кредит.
* Все платные аккаунты по умолчанию включают 300 кредитов в день. Если вам нужна большая сумма, свяжитесь с нами.
-->

1. Мы отправляем письмо только один раз отправителю [в разрешенном списке](#do-you-have-an-allowlist) каждые 4 дня (что аналогично поведению Gmail).

* Наш кэш Redis использует отпечатки `alias_id` и `sender`, где `alias_id` — это псевдоним идентификатора MongoDB, а `sender` — это либо адрес отправителя (если он внесён в разрешённый список), либо корневой домен в адресе отправителя (если он не внесён в разрешённый список). Для простоты срок действия этого отпечатка в кэше установлен на 4 дня.

* Наш подход, заключающийся в использовании корневого домена, проанализированного в поле «От кого» для отправителей, не внесенных в список разрешенных, предотвращает злоупотребления со стороны относительно неизвестных отправителей (например, злоумышленников), которые заполняют сообщениями службы поддержки во время отпуска.

2. Мы отправляем сообщение только в том случае, если поле MAIL FROM и/или From не пустое и не содержит (без учета регистра) [имя пользователя почтмейстера](#what-are-postmaster-addresses) (часть перед @ в письме).

3. Мы не отправляем сообщение, если в исходном сообщении был какой-либо из следующих заголовков (без учета регистра):

* Заголовок `auto-submitted` со значением, не равным `no`.
* Заголовок `x-auto-response-suppress` со значением `dr`, `autoreply`, `auto-reply`, `auto_reply` или `all`
* Заголовок `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 или `no`7 (независимо от значения).
* Заголовок `no`8 со значением `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 или `x-auto-response-suppress`3.

4. Мы не отправляем письма, если адрес электронной почты MAIL FROM или From заканчивается на `+donotreply`, `-donotreply`, `+noreply` или `-noreply`.

5. Мы не отправляем сообщение, если часть имени пользователя в поле «От» адреса электронной почты была `mdaemon` и имела нечувствительный к регистру заголовок `X-MDDSN-Message`.

6. Мы не отправляем данные, если в `multipart/report` присутствует нечувствительный к регистру заголовок `content-type`.

### Как настроить SPF для пересылки электронной почты {#how-do-i-set-up-spf-for-forward-email}

Используя страницу управления DNS вашего регистратора, задайте следующую запись <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете Gmail (например, «Отправить письмо как») или G Suite, вам необходимо добавить <code>include:_spf.google.com</code> к указанному выше значению, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете Microsoft Outlook или Live.com, вам необходимо добавить <code>include:spf.protection.outlook.com</code> к вашей <strong class="notranslate">TXT</strong> записи SPF, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Если у вас уже есть похожая строка с "v=spf1", вам нужно добавить <code>include:spf.forwardemail.net</code> непосредственно перед любой существующей записью "include:host.com" и перед "-all" в той же строке, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Обратите внимание на разницу между "-all" и "~all". Символ "-" означает, что проверка SPF должна быть НЕУДАЧНОЙ, если результат не совпадает, а "~" означает, что проверка SPF должна быть НЕУДАЧНОЙ. Мы рекомендуем использовать подход «-all» для предотвращения подделки домена.
<br /><br />
Возможно, вам также потребуется включить запись SPF для хоста, с которого вы отправляете почту (например, Outlook).
</span>
</div>

### Как настроить DKIM для пересылки электронной почты {#how-do-i-set-up-dkim-for-forward-email}

Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.

### Как настроить DMARC для пересылки электронной почты {#how-do-i-set-up-dmarc-for-forward-email}

Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.

### Как подключить и настроить мои контакты {#how-do-i-connect-and-configure-my-contacts}

**Чтобы настроить контакты, используйте URL-адрес CardDAV:** `https://carddav.forwardemail.net` (или просто `carddav.forwardemail.net`, если ваш клиент это допускает)

### Как подключить и настроить мои календари {#how-do-i-connect-and-configure-my-calendars}

**Чтобы настроить календарь, используйте URL-адрес CalDAV:** `https://caldav.forwardemail.net` (или просто `caldav.forwardemail.net`, если ваш клиент это допускает)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Пример настройки пересылки электронной почты в календаре CalDAV Thunderbird" />

### Как добавить больше календарей и управлять существующими календарями {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Если вы хотите добавить дополнительные календари, просто добавьте новый URL-адрес календаря: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**обязательно замените `calendar-name` на желаемое название календаря**)

Вы можете изменить название и цвет календаря после его создания — просто используйте предпочитаемое вами приложение для работы с календарем (например, Apple Mail или [Тандерберд](https://thunderbird.net)).

### Как настроить SRS для пересылки электронной почты {#how-do-i-set-up-srs-for-forward-email}

Мы автоматически настраиваем [Схема перезаписи отправителя](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) («SRS») — вам не нужно делать это самостоятельно.

### Как настроить MTA-STS для пересылки электронной почты {#how-do-i-set-up-mta-sts-for-forward-email}

Более подробную информацию см. в [наш раздел о MTA-STS](#do-you-support-mta-sts).

### Как добавить фотографию профиля в мой адрес электронной почты {#how-do-i-add-a-profile-picture-to-my-email-address}

Если вы используете Gmail, выполните следующие действия:

1. Перейдите на страницу <https://google.com> и выйдите из всех учётных записей электронной почты.
2. Нажмите «Войти» и в раскрывающемся списке выберите «Другая учётная запись».
3. Выберите «Использовать другую учётную запись».
4. Выберите «Создать учётную запись».
5. Выберите «Использовать мой текущий адрес электронной почты».
6. Введите адрес электронной почты, указанный в вашем домене.
7. Получите письмо с подтверждением, отправленное на ваш адрес электронной почты.
8. Введите код подтверждения из этого письма.
9. Заполните информацию профиля для вашей новой учётной записи Google.
10. Согласитесь со всеми политиками конфиденциальности и условиями использования.
11. Перейдите на страницу <https://google.com> и в правом верхнем углу нажмите на значок своего профиля, а затем нажмите кнопку «Изменить».
12. Загрузите новую фотографию или аватар для своей учётной записи.
13. Изменения вступят в силу примерно через 1–2 часа, но иногда это происходит очень быстро.
14. Отправьте тестовое письмо, и фотография профиля должна появиться.

## Расширенные функции {#advanced-features}

### Поддерживаете ли вы информационные бюллетени или списки рассылки для маркетинговых сообщений электронной почты {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Да, вы можете прочитать больше на <https://forwardemail.net/guides/newsletter-with-listmonk>.

Обратите внимание, что для поддержания репутации IP-адреса и обеспечения доставки в Forward Email предусмотрена ручная проверка для каждого домена, **предназначенная для одобрения новостной рассылки**. Напишите на адрес <support@forwardemail.net> или откройте [запрос о помощи](https://forwardemail.net/help) для одобрения. Обычно это занимает менее 24 часов, большинство запросов обрабатывается в течение 1-2 часов. В ближайшем будущем мы планируем сделать этот процесс мгновенным, добавив дополнительные средства защиты от спама и оповещения. Это гарантирует, что ваши письма попадут во входящие, а не будут помечены как спам.

### Поддерживаете ли вы отправку электронной почты с помощью API {#do-you-support-sending-email-with-api}?

Да, с мая 2023 года мы поддерживаем отправку электронной почты с API в качестве дополнения для всех платных пользователей.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Убедитесь, что вы ознакомились с нашими <a href="/terms" class="alert-link" target="_blank">Условиями</a>, <a href="/privacy" class="alert-link" target="_blank">Политикой конфиденциальности</a> и <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ограничениями на исходящие SMTP-сообщения</a>. Ваше использование считается подтверждением и согласием.
</span>
</div>

Пожалуйста, просмотрите раздел о [Электронные письма](/email-api#outbound-emails) в нашей документации API для получения информации о параметрах, примерах и более подробной информации.

Чтобы отправлять исходящую электронную почту с помощью нашего API, вам необходимо использовать свой токен API, доступный в [Моя безопасность](/my-account/security).

### Поддерживаете ли вы получение электронной почты по протоколу IMAP {#do-you-support-receiving-email-with-imap}

Да, с 16 октября 2023 года мы поддерживаем получение электронной почты по протоколу IMAP в качестве дополнения для всех платных пользователей. **Пожалуйста, прочтите нашу подробную статью** о [как работает наша функция зашифрованного хранилища почтовых ящиков SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Убедитесь, что вы ознакомились с нашими <a href="/terms" class="alert-link" target="_blank">Условиями</a> и <a href="/privacy" class="alert-link" target="_blank">Политикой конфиденциальности</a>. Использование вами материалов считается подтверждением и согласием.
</span>
</div>

1. Создайте новый псевдоним для своего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>)

2. Нажмите кнопку <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong> рядом с созданным псевдонимом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, показанный на экране.

3. Используя предпочитаемый вами почтовый клиент, добавьте или настройте учётную запись с новым псевдонимом (например, <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Мы рекомендуем использовать <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> или <a href="/blog/open-source" class="alert-link" target="_blank">альтернатива с открытым исходным кодом, ориентированная на конфиденциальность</a>.</span>
</div>

4. При запросе имени сервера IMAP введите `imap.forwardemail.net`.

5. При запросе порта IMAP-сервера введите `993` (SSL/TLS). При необходимости см. [альтернативные порты IMAP](/faq#what-are-your-imap-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Если вы используете Thunderbird, убедитесь, что для параметра «Безопасность подключения» выбрано значение «SSL/TLS», а для параметра «Метод аутентификации» — «Обычный пароль».</span>
</div>

6. При появлении запроса на пароль сервера IMAP вставьте пароль из раздела <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong>, указанного в шаге 2 выше.

7. **Сохраните настройки** — если у вас возникли проблемы, пожалуйста, <a href="/help">свяжитесь с нами</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

</div>

### Поддерживаете ли вы POP3 {#do-you-support-pop3}

Да, с 4 декабря 2023 года мы поддерживаем [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) как дополнение для всех платных пользователей. **Пожалуйста, прочтите нашу подробную статью** о [как работает наша функция зашифрованного хранилища почтовых ящиков SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Убедитесь, что вы ознакомились с нашими <a href="/terms" class="alert-link" target="_blank">Условиями</a> и <a href="/privacy" class="alert-link" target="_blank">Политикой конфиденциальности</a>. Использование вами материалов считается подтверждением и согласием.
</span>
</div>

1. Создайте новый псевдоним для своего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>)

2. Нажмите кнопку <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong> рядом с созданным псевдонимом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, показанный на экране.

3. Используя предпочитаемый вами почтовый клиент, добавьте или настройте учётную запись с новым псевдонимом (например, <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Мы рекомендуем использовать <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> или <a href="/blog/open-source" class="alert-link" target="_blank">альтернатива с открытым исходным кодом, ориентированная на конфиденциальность</a>.</span>
</div>

4. При запросе имени POP3-сервера введите `pop3.forwardemail.net`.

5. При запросе порта POP3-сервера введите `995` (SSL/TLS). При необходимости см. [альтернативные порты POP3](/faq#what-are-your-pop3-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Если вы используете Thunderbird, убедитесь, что для параметра «Безопасность подключения» выбрано значение «SSL/TLS», а для параметра «Метод аутентификации» — «Обычный пароль».</span>
</div>

6. При появлении запроса на пароль POP3-сервера вставьте пароль из раздела <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong>, описанного в шаге 2 выше.

7. **Сохраните настройки** — если у вас возникли проблемы, пожалуйста, <a href="/help">свяжитесь с нами</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

</div>

### Поддерживаете ли вы календари (CalDAV) {#do-you-support-calendars-caldav}

Да, мы добавили эту функцию 5 февраля 2024 года. Наш сервер — `caldav.forwardemail.net`, и его состояние также отслеживается на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает IPv4 и IPv6 и доступен через порт `443` (HTTPS).

| Авторизоваться | Пример | Описание |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com` | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль для конкретного псевдонима. |

Чтобы использовать поддержку календаря, **пользователь** должен быть адресом электронной почты псевдонима, существующего для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>, а **пароль** должен быть сгенерированным паролем для конкретного псевдонима.

### Поддерживаете ли вы контакты (CardDAV) {#do-you-support-contacts-carddav}

Да, мы добавили эту функцию 12 июня 2025 года. Наш сервер — `carddav.forwardemail.net`, и его состояние также отслеживается на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает IPv4 и IPv6 и доступен через порт `443` (HTTPS).

| Авторизоваться | Пример | Описание |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com` | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль для конкретного псевдонима. |

Чтобы воспользоваться поддержкой контактов, **пользователь** должен быть адресом электронной почты псевдонима, существующего для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>, а **пароль** должен быть сгенерированным паролем для конкретного псевдонима.

### Поддерживаете ли вы отправку электронной почты с помощью SMTP {#do-you-support-sending-email-with-smtp}

Да, с мая 2023 года мы поддерживаем отправку электронной почты с помощью SMTP в качестве дополнения для всех платных пользователей.

<div id="smtp-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Убедитесь, что вы ознакомились с нашими <a href="/terms" class="alert-link" target="_blank">Условиями</a>, <a href="/privacy" class="alert-link" target="_blank">Политикой конфиденциальности</a> и <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ограничениями на исходящие SMTP-сообщения</a>. Ваше использование считается подтверждением и согласием.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете Gmail, ознакомьтесь с нашим <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">руководством по отправке писем как в Gmail</a>. Если вы разработчик, ознакомьтесь с нашей <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документацией по API электронной почты</a>.
</span>
</div>

1. Перейдите в раздел <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.

2. Создайте новый псевдоним для своего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>)

3. Нажмите кнопку <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong> рядом с созданным псевдонимом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, показанный на экране.

4. Используя предпочитаемый вами почтовый клиент, добавьте или настройте учётную запись с новым псевдонимом (например, <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Мы рекомендуем использовать <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> или <a href="/blog/open-source" class="alert-link" target="_blank">альтернатива с открытым исходным кодом, ориентированная на конфиденциальность</a>.</span>
</div>

5. При запросе имени SMTP-сервера введите `smtp.forwardemail.net`.

6. При запросе порта SMTP-сервера введите `465` (SSL/TLS). При необходимости см. [альтернативные порты SMTP](/faq#what-are-your-smtp-server-configuration-settings).
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Если вы используете Thunderbird, убедитесь, что для параметра «Безопасность подключения» выбрано значение «SSL/TLS», а для параметра «Метод аутентификации» — «Обычный пароль».</span>
</div>

7. При появлении запроса на пароль SMTP-сервера вставьте пароль из раздела <strong class="text-success"><i class="fa fa-key"></i> «Сгенерировать пароль»</strong>, указанного в шаге 3 выше.

8. **Сохраните настройки и отправьте первое тестовое письмо** — если у вас возникнут проблемы, пожалуйста, <a href="/help">свяжитесь с нами</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Обратите внимание, что для поддержания репутации IP-адреса и обеспечения доставки писем мы применяем ручную проверку исходящих SMTP-запросов для каждого домена. Обычно это занимает менее 24 часов, при этом большинство запросов обрабатывается в течение 1-2 часов. В ближайшем будущем мы планируем сделать этот процесс мгновенным, добавив дополнительные средства контроля спама и оповещения. Этот процесс гарантирует, что ваши письма попадут во входящие, а не будут помечены как спам.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

</div>

### Поддерживаете ли вы OpenPGP/MIME, сквозное шифрование («E2EE») и веб-каталог ключей («WKD») {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Да, мы поддерживаем [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [сквозное шифрование («E2EE»)](https://en.wikipedia.org/wiki/End-to-end_encryption) и обнаружение открытых ключей с помощью [Веб-каталог ключей («WKD»)](https://wiki.gnupg.org/WKD). Вы можете настроить OpenPGP с помощью [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) или [самостоятельно размещайте свои собственные ключи](https://wiki.gnupg.org/WKDHosting) (см. [эта суть для настройки сервера WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Поиск WKD кэшируется на 1 час для обеспечения своевременной доставки писем → поэтому, если вы добавляете, изменяете или удаляете свой ключ WKD, пожалуйста, напишите нам по адресу `support@forwardemail.net`, указав свой адрес электронной почты, чтобы мы вручную очистили кэш.
* Мы поддерживаем шифрование PGP для сообщений, пересылаемых через поиск WKD или с использованием загруженного ключа PGP в нашем интерфейсе.
* Загруженные ключи имеют приоритет, если флажок PGP установлен.
* Сообщения, отправляемые на веб-перехватчики, в настоящее время не шифруются с помощью PGP.
* Если у вас есть несколько псевдонимов, соответствующих заданному адресу пересылки (например, комбинация регулярного выражения/подстановочного знака/точного значения), и если более одного из них содержит загруженный ключ PGP и проверен PGP →, то мы отправим вам электронное письмо с предупреждением об ошибке и не будем шифровать сообщение с помощью загруженного вами ключа PGP. Это случается очень редко и обычно применимо только к опытным пользователям со сложными правилами псевдонимов.
* **Шифрование PGP не будет применяться к пересылке электронной почты через наши MX-серверы, если у отправителя установлена политика отклонения DMARC. Если вам требуется шифрование PGP для *всех* писем, мы рекомендуем использовать наш сервис IMAP и настроить ключ PGP для вашего псевдонима для входящей почты.**

**Вы можете проверить настройки своего каталога веб-ключей по адресу <https://wkd.chimbosonic.com/> (с открытым исходным кодом) или <https://www.webkeydirectory.com/> (собственный).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Автоматическое шифрование:
</strong>
<span>Если вы используете наш <a href="#do-you-support-sending-email-with-smtp" class="alert-link">исходящий SMTP-сервис</a> и отправляете незашифрованные сообщения, мы автоматически попытаемся зашифровать сообщения для каждого получателя, используя <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Чтобы включить OpenPGP для вашего доменного имени, необходимо выполнить все следующие шаги.
</span>
</div>

1. Загрузите и установите рекомендуемый плагин для вашего почтового клиента ниже:

| Почтовый клиент | Платформа | Рекомендуемый плагин | Примечания |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Тандерберд | Рабочий стол | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird имеет встроенную поддержку OpenPGP. |
| Gmail | Браузер | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (собственная лицензия) | Gmail не поддерживает OpenPGP, однако вы можете загрузить плагин с открытым исходным кодом [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail не поддерживает OpenPGP, однако вы можете загрузить плагин с открытым исходным кодом [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) или [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (собственная лицензия) | Apple Mail не поддерживает OpenPGP, однако вы можете загрузить плагин с открытым исходным кодом [PGPro](https://github.com/opensourceios/PGPro/) или [FlowCrypt](https://flowcrypt.com/download). |
| Перспективы | Окна | [gpg4win](https://www.gpg4win.de/index.html) | Настольный почтовый клиент Outlook не поддерживает OpenPGP, однако вы можете загрузить плагин с открытым исходным кодом [gpg4win](https://www.gpg4win.de/index.html). |
| Перспективы | Браузер | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (собственная лицензия) | Веб-почтовый клиент Outlook не поддерживает OpenPGP, однако вы можете загрузить плагин с открытым исходным кодом [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download). |
| Андроид | Мобильный | [OpenKeychain](https://www.openkeychain.org/) или [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), такие как [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) и [FairEmail](https://github.com/M66B/FairEmail), поддерживают плагин с открытым исходным кодом [OpenKeychain](https://www.openkeychain.org/). Вы также можете использовать плагин с открытым исходным кодом (имеющий собственную лицензию) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Гугл Хром | Браузер | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (собственная лицензия) | Вы можете загрузить расширение для браузера с открытым исходным кодом [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download). |
| Мозилла Фаерфокс | Браузер | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (собственная лицензия) | Вы можете загрузить расширение для браузера с открытым исходным кодом [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Браузер | [Mailvelope](https://mailvelope.com/) | Вы можете загрузить расширение для браузера с открытым исходным кодом [Mailvelope](https://mailvelope.com/). |
| Храбрый | Браузер | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (собственная лицензия) | Вы можете загрузить расширение для браузера с открытым исходным кодом [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download). |
| Бальса | Рабочий стол | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa имеет встроенную поддержку OpenPGP. |
| KMail | Рабочий стол | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail имеет встроенную поддержку OpenPGP. |
| Эволюция GNOME | Рабочий стол | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution имеет встроенную поддержку OpenPGP. |
| Терминал | Рабочий стол | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Вы можете использовать открытый исходный код [gpg command line tool](https://www.gnupg.org/download/) для генерации нового ключа из командной строки. |

2. Откройте плагин, создайте свой открытый ключ и настройте свой почтовый клиент для его использования.

3. Загрузите свой открытый ключ в <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>Вы можете перейти по ссылке <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> для управления своим ключом в будущем.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Дополнительное дополнение:
</strong>
<span>
Если вы используете наш <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">сервис зашифрованного хранилища (IMAP/POP3)</a> и хотите, чтобы <i>все</i> письма, хранящиеся в вашей (уже зашифрованной) базе данных SQLite, были зашифрованы вашим открытым ключом, перейдите в раздел <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учётная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Отредактируйте <i class="fa fa-angle-right"></i> OpenPGP и загрузите свой открытый ключ.
</span>
</div>

4. Добавьте новую запись `CNAME` к вашему доменному имени (например, `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
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
Совет:
</strong>
<span>Если ваш псевдоним использует наши <a class="alert-link" href="/disposable-addresses" target="_blank">домены vanity/disposable</a> (например, <code>hideaddress.net</code>), то вы можете пропустить этот шаг.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Поздравляем!
</strong>
<span>
Вы успешно выполнили все шаги.
</span>
</div>
</div>

### Поддерживаете ли вы MTA-STS {#do-you-support-mta-sts}?

Да, с 2 марта 2023 года мы поддерживаем [MTA-STS](https://www.hardenize.com/blog/mta-sts). Вы можете использовать [этот шаблон](https://github.com/jpawlowski/mta-sts.template), если хотите включить его в своём домене.

Нашу конфигурацию можно найти публично на GitHub по адресу <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Поддерживаете ли вы пароли и WebAuthn {#do-you-support-passkeys-and-webauthn}

Да! С 13 декабря 2023 года мы добавили поддержку ключей доступа [из-за высокого спроса](https://github.com/orgs/forwardemail/discussions/182).

Пароли позволяют безопасно входить в систему без ввода пароля и двухфакторной аутентификации.

Подтвердить свою личность можно с помощью прикосновения, распознавания лица, пароля на устройстве или PIN-кода.

Мы позволяем вам управлять до 30 ключами доступа одновременно, чтобы вы могли с легкостью входить в систему со всех своих устройств.

Дополнительную информацию о ключах доступа можно найти по следующим ссылкам:

* [Входите в свои приложения и веб-сайты с помощью паролей](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Используйте пароли для входа в приложения и на веб-сайты на iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Статья в Википедии о ключах доступа](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Поддерживаете ли вы лучшие практики электронной почты {#do-you-support-email-best-practices}

Да. Во всех тарифных планах у нас есть встроенная поддержка SPF, DKIM, DMARC, ARC и SRS. Мы также активно сотрудничали с авторами этих спецификаций и другими экспертами в области электронной почты, чтобы гарантировать безупречность и высокую доставляемость.

### Поддерживаете ли вы веб-перехваты отказов {#do-you-support-bounce-webhooks}?

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
Ищете документацию по веб-хукам для электронной почты? Подробнее см. в разделе <a href="/faq#do-you-support-webhooks" class="alert-link">Поддерживаете ли вы веб-хуки?</a>.
<span>
</span>
</div>

Да, с 14 августа 2024 года мы добавили эту функцию. Теперь вы можете перейти в раздел «Моя учётная запись» → «Домены» → «Настройки» → «URL-адрес веб-перехвата возврата» и настроить URL-адрес `http://` или `https://`, на который будет отправляться запрос `POST` при каждом возврате исходящих SMTP-писем.

Это полезно для управления и мониторинга исходящих SMTP-сообщений, а также может использоваться для сохранения подписчиков, отказа от подписки и обнаружения случаев возврата сообщений.

Полезные данные Bounce webhook отправляются в формате JSON со следующими свойствами:

* `email_id` (строка) — идентификатор электронной почты, соответствующий письму в разделе «Моя учётная запись» → «Письма» (исходящие SMTP)
* `list_id` (строка) — значение заголовка `List-ID` (без учёта регистра), если таковое имеется, из исходного исходящего письма
* `list_unsubscribe` (строка) — значение заголовка `List-Unsubscribe` (без учёта регистра), если таковое имеется, из исходного исходящего письма
* `feedback_id` (строка) — значение заголовка `Feedback-ID` (без учёта регистра), если таковое имеется, из исходного исходящего письма
* `recipient` (строка) — адрес электронной почты получателя, отправившего письмо с ошибкой или возвратом
* `message` (строка) — подробное сообщение об ошибке возврата
* `response` (строка) — сообщение с ответом SMTP
* `list_id`0 (число) — проанализированный код ответа SMTP
* `list_id`1 (строка) — если код ответа получен из доверенного источника, это значение будет заполнено именем корневого домена (например, `list_id`2 или `list_id`3)
* `list_id`4 (объект) — объект, содержащий следующие свойства, которые подробно описывают статусы возврата и отклонения:
* `list_id`5 (строка) — действие при возврате (например, `list_id`6)
* `list_id`7 (строка) — причина возврата (например, `list_id`8)
* `list_id`9 (Строка) — категория возврата (например, `List-ID`0)
* `List-ID`1 (Число) — код статуса возврата (например, `List-ID`2)
* `List-ID`3 (Строка) — код возврата из ответного сообщения (например, `List-ID`4)
* `List-ID`5 (Число) — номер проанализированной строки, если есть, `List-ID`6 (например, `List-ID`7)
* `List-ID`8 (Объект) — пара «ключ-значение» заголовков исходящего письма
* `List-ID`9 (Строка) — дата возникновения ошибки возврата в формате `list_unsubscribe`0

Например:

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

Вот несколько дополнительных замечаний относительно веб-перехватов отказов:

* Если полезная нагрузка вебхука содержит значение `list_id`, `list_unsubscribe` или `feedback_id`, при необходимости удалите `recipient` из списка.
* Если значение `bounce.category` было равно `"block"`, `"recipient"`, `"spam"` или `"virus"`, пользователя обязательно следует удалить из списка.
* Если вам нужно проверить полезную нагрузку вебхука (чтобы убедиться, что она действительно поступает с нашего сервера), вы можете использовать [разрешить IP-адрес удаленного клиента и имя хоста клиента с помощью обратного поиска](https://nodejs.org/api/dns.html#dnspromisesreverseip) – это должно быть `list_unsubscribe`0.
* Вы также можете проверить IP-адрес по `list_unsubscribe`1.
* Перейдите в раздел «Моя учётная запись» → «Домены» → «Настройки» → «Ключ проверки полезной нагрузки подписи вебхука», чтобы получить ключ вебхука.
* В целях безопасности вы можете ротировать этот ключ в любое время.
* Рассчитайте и сравните значение `list_unsubscribe`2 из нашего запроса вебхука с вычисленным значением в теле запроса с использованием этого ключа. Пример того, как это сделать, доступен по ссылке `list_unsubscribe`3.
* Подробнее см. в обсуждении по ссылке <`list_unsubscribe`4.
* Мы будем ждать ответа вашей конечной точки вебхука с кодом состояния `list_unsubscribe`6 в течение `list_unsubscribe`5 секунд, и повторим попытку в течение `list_unsubscribe`7 секунд. * Если при попытке отправить запрос на ваш URL-адрес веб-перехватчика возврата будет обнаружена ошибка, мы раз в неделю будем отправлять вам электронное письмо с уведомлением.

### Поддерживаете ли вы веб-хуки {#do-you-support-webhooks}?

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
Ищете документацию по веб-хукам отказов? Подробнее см. в разделе <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Поддерживаете ли вы веб-хуки отказов?</a>.
<span>
</span>
</div>

Да, с 15 мая 2020 года мы добавили эту функцию. Вы можете просто добавить вебхуки, как и для любого получателя! Убедитесь, что в URL вебхука есть префикс «http» или «https».

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Улучшенная защита конфиденциальности:
</strong>
<span>
Если у вас платный тарифный план (с улучшенной защитой конфиденциальности), перейдите в раздел <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> и нажмите «Псевдонимы» рядом с вашим доменом, чтобы настроить вебхуки. Подробнее о платных тарифных планах см. на странице <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Цены</a>. В противном случае продолжайте следовать инструкциям ниже.
</span>
</div>

Если вы используете бесплатный план, просто добавьте новую запись DNS <strong class="notranslate">TXT</strong>, как показано ниже:

Например, если я хочу, чтобы все электронные письма, отправляемые в `alias@example.com`, пересылались в новую тестовую конечную точку [запросить корзину](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Или, возможно, вы хотите, чтобы все письма, отправляемые в `example.com`, пересылались в эту конечную точку:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Вот дополнительные замечания относительно веб-перехватчиков:**

* Если вам нужно проверить полезную нагрузку вебхука (чтобы убедиться, что она действительно поступает с нашего сервера), вы можете использовать [разрешить IP-адрес удаленного клиента и имя хоста клиента с помощью обратного поиска](https://nodejs.org/api/dns.html#dnspromisesreverseip) – это должен быть `mx1.forwardemail.net` или `mx2.forwardemail.net`.
* Вы также можете проверить IP-адрес по [наши опубликованные IP-адреса](#what-are-your-servers-ip-addresses).
* Если у вас платный тариф, перейдите в раздел «Моя учётная запись» → «Домены» → «Настройки» → «Ключ проверки полезной нагрузки подписи вебхука», чтобы получить ключ вебхука.
* Вы можете ротировать этот ключ в любое время в целях безопасности.
* Рассчитайте и сравните значение `X-Webhook-Signature` из нашего запроса вебхука с вычисленным значением тела запроса, используя этот ключ. Пример того, как это сделать, доступен по ссылке [этот пост на Stack Overflow](https://stackoverflow.com/a/68885281).
* Подробнее см. в обсуждении по ссылке <https://github.com/forwardemail/free-email-forwarding/issues/235>.

* Если вебхук не отвечает кодом состояния `200`, мы сохраним его ответ в [создан журнал ошибок](#do-you-store-error-logs), что полезно для отладки.
* HTTP-запросы вебхука будут повторяться до 3 раз при каждой попытке SMTP-подключения с максимальным таймаутом 60 секунд на POST-запрос конечной точки. **Обратите внимание, что это не означает, что он будет повторять только 3 раза**, на самом деле он будет повторяться непрерывно, отправляя SMTP-код 421 (что указывает отправителю на необходимость повторной попытки) после третьей неудачной попытки HTTP POST-запроса. Это означает, что электронное письмо будет повторяться непрерывно в течение нескольких дней, пока не будет достигнут код состояния 200.
* Мы будем автоматически повторять попытки на основе кодов состояния и ошибок по умолчанию, используемых в [метод повторных попыток суперагента](https://ladjs.github.io/superagent/#retrying-requests) (мы являемся разработчиками).
* Мы объединяем HTTP-запросы вебхука к одной конечной точке в один запрос, а не в несколько, для экономии ресурсов и ускорения ответа. Например, если вы отправляете электронное письмо на адреса <webhook1@example.com>, <webhook2@example.com> и <webhook3@example.com>, и все они настроены на обращение к одному и тому же *точному* URL-адресу конечной точки, то будет выполнен только один запрос. Мы группируем запросы по точному совпадению конечных точек со строгим равенством.
* Обратите внимание, что мы используем метод simpleParser библиотеки `mx1.forwardemail.net`0 для преобразования сообщения в удобный для JSON-формата объект.
* Исходное значение адреса электронной почты в виде строки указывается в свойстве "raw".
* Результаты аутентификации указываются в свойствах "dkim", "spf", "arc", "dmarc" и "bimi".
* Разобранные заголовки адреса электронной почты указываются в свойстве "headers". Также обратите внимание, что для упрощения итерации и анализа можно использовать "headerLines". * Сгруппированные получатели для этого вебхука группируются вместе и указываются в свойстве «recipients».
* Информация о сеансе SMTP указывается в свойстве «session». Она содержит информацию об отправителе сообщения, времени его получения, HELO и имени хоста клиента. Значение имени хоста клиента `mx1.forwardemail.net`1 — это либо полное доменное имя (из обратного поиска PTR), либо `mx1.forwardemail.net`2, заключенное в скобки (например, `mx1.forwardemail.net`3).
* Если вам нужно быстро получить значение `mx1.forwardemail.net`4, вы можете использовать значение `mx1.forwardemail.net`5 (см. пример ниже). Заголовок `mx1.forwardemail.net`6 — это заголовок, который мы добавляем к сообщениям для отладки с исходным получателем (до маскированной пересылки) сообщения. * Если вам нужно удалить свойства `mx1.forwardemail.net`7 и/или `mx1.forwardemail.net`8 из тела полезной нагрузки, просто добавьте `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 или `mx2.forwardemail.net`1 в конечную точку вебхука в качестве параметра строки запроса (например, `mx2.forwardemail.net`2).

* Если есть вложения, они будут добавлены в массив `mx2.forwardemail.net`3 со значениями буфера. Вы можете преобразовать их обратно в контент, используя подход с JavaScript, например:

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
Совет:
</strong>
Интересно, как выглядит запрос вебхука из пересылаемых писем? Мы добавили пример ниже!
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

### Поддерживаете ли вы регулярные выражения или regex {#do-you-support-regular-expressions-or-regex}

Да, с 27 сентября 2021 года мы добавили эту функцию. Вы можете просто написать регулярные выражения («regex») для поиска псевдонимов и выполнения подстановок.

Регулярные выражения поддерживают псевдонимы, начинающиеся с `/` и заканчивающиеся на `/`, а их получатели — адреса электронной почты или веб-хуки. Получатели также могут включать поддержку подстановки регулярных выражений (например, `$1`, `$2`).

Мы поддерживаем два флага регулярных выражений, включая `i` и `g`. Регистронезависимый флаг `i` является постоянным значением по умолчанию и всегда применяется. Глобальный флаг `g` можно добавить, добавив к `/` `/g`.

Обратите внимание, что мы также поддерживаем нашу <a href="#can-i-disable-specific-aliases">disabled функцию псевдонима</a> для части получателя с поддержкой регулярных выражений.

Регулярные выражения не поддерживаются в <a href="/disposable-addresses" target="_blank">глобальных доменах тщеславия</a> (поскольку это может представлять собой уязвимость безопасности).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Улучшенная защита конфиденциальности:
</strong>
<span>
Если у вас платный тарифный план (с улучшенной защитой конфиденциальности), перейдите в раздел <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a> и нажмите «Псевдонимы» рядом с вашим доменом, чтобы настроить регулярные выражения. Подробнее о платных тарифных планах см. на странице <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Цены</a>. В противном случае продолжайте следовать инструкциям ниже.
</span>
</div>

Если вы используете бесплатный план, просто добавьте новую запись DNS <strong class="notranslate">TXT</strong>, используя один или несколько из приведенных ниже примеров:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Простой пример:</strong> Если я хочу, чтобы все письма, отправленные на `linus@example.com` или `torvalds@example.com`, пересылались на `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Пример замены имени и фамилии:</strong> Представьте, что все адреса электронной почты вашей компании имеют шаблон `firstname.lastname@example.com`. Если я хочу, чтобы все письма, отправленные по шаблону `firstname.lastname@example.com`, пересылались на `firstname.lastname@company.com` с поддержкой замены (<a href="https://regexr.com/66hnu" class="alert-link">просмотреть тест в RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Пример подстановки фильтра с символом «плюс»:</strong> Если я хочу, чтобы все письма, отправляемые в `info@example.com` или `support@example.com`, пересылались в `user+info@gmail.com` или `user+support@gmail.com` соответственно (с поддержкой подстановки) (<a href="https://regexr.com/66ho7" class="alert-link">просмотреть тест в RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Пример подстановки строки запроса веб-хука:</strong> Возможно, вы хотите, чтобы все письма, отправляемые на адрес `example.com`, направлялись на <a href="#do-you-support-webhooks" class="alert-link">веб-хук</a> с динамическим ключом строки запроса "to" со значением имени пользователя в адресе электронной почты (<a href="https://regexr.com/66ho4" class="alert-link">просмотреть тест в RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Пример тихого отклонения:</strong> Если вы хотите, чтобы все письма, соответствующие определённому шаблону, были заблокированы и тихо отклонены (отправителю казалось, что сообщение было успешно отправлено, но на самом деле оно никуда не ушло) с кодом статуса `250` (см. <a href="#can-i-disable-specific-aliases" class="alert-link">Можно ли отключить определённые псевдонимы</a>), просто используйте тот же подход с одним восклицательным знаком «!». Это указывает отправителю, что сообщение было успешно доставлено, но на самом деле никуда не ушло (например, в чёрную дыру или `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Пример мягкого отклонения:</strong> Если вы хотите, чтобы все письма, соответствующие определённому шаблону, были отключены и мягко отклонены с кодом статуса `421` (см. <a href="#can-i-disable-specific-aliases" class="alert-link">Можно ли отключить определённые псевдонимы</a>), просто используйте тот же подход с двумя восклицательными знаками «!!». Это означает, что отправителю следует повторить отправку письма, и письма на этот псевдоним будут отправляться повторно примерно 5 дней, а затем будут отклонены окончательно.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Пример жёсткого отклонения:</strong> Если вы хотите, чтобы все письма, соответствующие определённому шаблону, были заблокированы и отклонены жёстко с кодом статуса `550` (см. <a href="#can-i-disable-specific-aliases" class="alert-link">Можно ли отключить определённые псевдонимы</a>), просто используйте тот же подход с тремя восклицательными знаками «!!!». Это указывает отправителю на постоянную ошибку, и письма не будут отправляться повторно, они будут отклонены для этого псевдонима.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
Хотите узнать, как написать регулярное выражение, или хотите протестировать свою замену? Вы можете перейти на бесплатный сайт для тестирования регулярных выражений <a href="https://regexr.com" class="alert-link">RegExr</a> по адресу <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Каковы ваши исходящие лимиты SMTP {#what-are-your-outbound-smtp-limits}

Мы устанавливаем ограничение на количество исходящих SMTP-сообщений для пользователей и доменов — 300 в день. В среднем это более 9000 писем в месяц. Если вам необходимо превысить это количество или у вас постоянно большие письма, укажите [связаться с нами](https://forwardemail.net/help).

### Нужно ли мне одобрение для включения SMTP {#do-i-need-approval-to-enable-smtp}

Да, обратите внимание, что для поддержания репутации IP-адреса и обеспечения доставки, Forward Email проходит ручную проверку для каждого домена при одобрении исходящих SMTP-сообщений. Напишите на адрес <support@forwardemail.net> или откройте [запрос о помощи](https://forwardemail.net/help) для одобрения. Обычно это занимает менее 24 часов, большинство запросов обрабатывается в течение 1-2 часов. В ближайшем будущем мы планируем сделать этот процесс мгновенным, добавив дополнительные средства контроля спама и оповещения. Этот процесс гарантирует, что ваши письма попадут во входящие, а не будут помечены как спам.

### Каковы настройки конфигурации вашего SMTP-сервера {#what-are-your-smtp-server-configuration-settings}

Наш сервер — `smtp.forwardemail.net`, и он также отслеживается на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает IPv4 и IPv6 и доступен через порты `465` и `2465` для SSL/TLS и `587`, `2587`, `2525` и `25` для TLS (STARTTLS).

| Протокол | Имя хоста | Порты | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Предпочтительно** | `smtp.forwardemail.net` | `465`, `2465` | :white_check_mark: | :white_check_mark: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: |

| Авторизоваться | Пример | Описание |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com` | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль для конкретного псевдонима. |

Чтобы отправлять исходящую почту с помощью SMTP, **пользователь SMTP** должен быть адресом электронной почты псевдонима, существующего для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>, а **пароль SMTP** должен быть паролем, сгенерированным для конкретного псевдонима.

Пошаговые инструкции см. в [Поддерживаете ли вы отправку электронной почты через SMTP?](#do-you-support-sending-email-with-smtp).

### Каковы настройки конфигурации вашего сервера IMAP {#what-are-your-imap-server-configuration-settings}

Наш сервер — `imap.forwardemail.net`, и он также отслеживается на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает IPv4 и IPv6 и доступен через порты `993` и `2993` для SSL/TLS.

| Протокол | Имя хоста | Порты | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Предпочтительно** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Авторизоваться | Пример | Описание |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com` | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль для конкретного псевдонима. |

Для подключения по протоколу IMAP **пользователь IMAP** должен быть адресом электронной почты псевдонима, существующего для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>, а **пароль IMAP** должен быть паролем, сгенерированным специально для псевдонима.

Пошаговые инструкции см. в [Поддерживаете ли вы получение электронной почты по протоколу IMAP?](#do-you-support-receiving-email-with-imap).

### Каковы настройки конфигурации вашего POP3-сервера {#what-are-your-pop3-server-configuration-settings}

Наш сервер — `pop3.forwardemail.net`, и он также отслеживается на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает IPv4 и IPv6 и доступен через порты `995` и `2995` для SSL/TLS.

| Протокол | Имя хоста | Порты | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Предпочтительно** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |

| Авторизоваться | Пример | Описание |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com` | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль для конкретного псевдонима. |

Для подключения по протоколу POP3 **пользователь POP3** должен быть адресом электронной почты псевдонима, существующего для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>, а **пароль IMAP** должен быть паролем, сгенерированным специально для псевдонима.

Пошаговые инструкции см. в [Поддерживаете ли вы POP3?](#do-you-support-pop3).

### Конфигурация ретрансляции SMTP Postfix {#postfix-smtp-relay-configuration}

Вы можете настроить Postfix для ретрансляции писем через SMTP-серверы Forward Email. Это полезно для серверных приложений, которым требуется отправлять письма.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Расчётное время настройки:</strong>
<span>Менее 15 минут</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Для этого требуется платный тариф с включённым доступом к SMTP.
</span>
</div>

#### Установка {#installation}

1. Установите Postfix на свой сервер:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Во время установки при появлении запроса на тип конфигурации выберите «Интернет-сайт».

#### Конфигурация {#configuration}

1. Отредактируйте основной файл конфигурации Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Добавьте или измените следующие настройки:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Создайте файл паролей SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Добавьте учетные данные для пересылки электронной почты:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Защитите и хешируйте файл паролей:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Перезапустите Postfix:

```bash
sudo systemctl restart postfix
```

#### Тестирование {#testing}

Проверьте свою конфигурацию, отправив тестовое электронное письмо:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Безопасность {#security}

### Расширенные методы защиты сервера {#advanced-server-hardening-techniques}

> \[!TIP]
> Узнайте больше о нашей инфраструктуре безопасности на [наша страница безопасности](/security).

Forward Email реализует многочисленные методы защиты сервера для обеспечения безопасности нашей инфраструктуры и ваших данных:

1. **Сетевая безопасность**:
* Межсетевой экран IP-таблиц со строгими правилами
* Fail2ban для защиты от атак методом подбора паролей
* Регулярные аудиты безопасности и тестирование на проникновение
* Административный доступ только через VPN

2. **Усиление защиты системы**:
* Минимальная установка пакетов
* Регулярные обновления безопасности
* SELinux в принудительном режиме
* Отключён root-доступ по SSH
* Только аутентификация по ключу

3. **Безопасность приложений**:
* Заголовки политики безопасности контента (CSP)
* HTTPS Strict Transport Security (HSTS)
* Заголовки защиты от XSS
* Параметры фрейма и заголовки политики реферера
* Регулярный аудит зависимостей

4. **Защита данных**:
* Полное шифрование диска с помощью LUKS
* Безопасное управление ключами
* Регулярное резервное копирование с шифрованием
* Методы минимизации данных

5. **Мониторинг и реагирование**:
* Обнаружение вторжений в режиме реального времени
* Автоматизированное сканирование безопасности
* Централизованное ведение журнала и анализ
* Процедуры реагирования на инциденты

> \[!IMPORTANT]
> Наши методы обеспечения безопасности постоянно обновляются для устранения возникающих угроз и уязвимостей.

> \[!TIP]
> Для максимальной безопасности мы рекомендуем использовать наш сервис со сквозным шифрованием через OpenPGP.

### У вас есть сертификаты SOC 2 или ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Пересылка электронной почты осуществляется на основе инфраструктуры, предоставляемой сертифицированными субподрядчиками, что гарантирует соответствие отраслевым стандартам.

Сервис Forward Email не имеет прямых сертификатов SOC 2 Type II или ISO 27001. Однако он работает на инфраструктуре, предоставляемой сертифицированными субпроцессорами:

* **DigitalOcean**: сертифицированы по стандартам SOC 2 Type II и SOC 3 Type II (проверено Schellman & Company LLC), сертифицированы по ISO 27001 в нескольких центрах обработки данных. Подробности: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: сертифицирован по SOC 2+ (HIPAA), имеет сертификаты ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Подробности: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: соответствует требованиям SOC 2 (для получения сертификации обратитесь напрямую в DataPacket), поставщик инфраструктуры корпоративного уровня (расположен в Денвере). Подробности: <https://www.datapacket.com/datacenters/denver>

Компания Forward Email следует лучшим отраслевым практикам аудита безопасности и регулярно сотрудничает с независимыми экспертами по безопасности. Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Используете ли вы шифрование TLS для пересылки электронной почты {#do-you-use-tls-encryption-for-email-forwarding}

Да. Forward Email строго использует TLS 1.2+ для всех подключений (HTTPS, SMTP, IMAP, POP3) и реализует MTA-STS для расширенной поддержки TLS. Реализация включает в себя:

* Применение TLS 1.2+ для всех почтовых соединений
* Обмен ключами ECDHE (эллиптический протокол Диффи-Хеллмана) для обеспечения совершенной прямой секретности
* Современные наборы шифров с регулярными обновлениями безопасности
* Поддержка HTTP/2 для повышения производительности и безопасности
* HSTS (HTTP Strict Transport Security) с предварительной загрузкой в основных браузерах
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** для строгого применения TLS

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Реализация MTA-STS**: Forward Email реализует строгий контроль MTA-STS в кодовой базе. При возникновении ошибок TLS и применении MTA-STS система возвращает коды состояния SMTP 421, чтобы гарантировать повторную отправку писем в будущем, а не их небезопасную доставку. Подробности реализации:

* Обнаружение ошибок TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Применение MTA-STS в помощнике по отправке электронной почты: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Сторонняя проверка: <https://www.hardenize.com/report/forwardemail.net/1750312779> показывает оценки «Хорошо» для всех мер безопасности TLS и транспорта.

### Сохраняете ли вы заголовки аутентификации электронной почты {#do-you-preserve-email-authentication-headers}

Да. Функция пересылки электронной почты полностью реализует и сохраняет заголовки аутентификации электронной почты:

* **SPF (Sender Policy Framework)**: Правильно реализовано и поддерживается
* **DKIM (DomainKeys Identified Mail)**: Полная поддержка с надлежащим управлением ключами
* **DMARC**: Применение политик к письмам, не прошедшим проверку SPF или DKIM
* **ARC**: Хотя эти требования не описаны подробно, безупречные показатели соответствия сервиса предполагают комплексную обработку заголовков аутентификации

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Проверка: Internet.nl Mail Test показывает оценку 100/100, особенно для реализации «SPF, DKIM и DMARC». Оценка Hardenize подтверждает оценку «Хорошо» для SPF и DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Сохраняете ли вы оригинальные заголовки электронных писем и предотвращаете подделку {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Функция пересылки электронной почты реализует сложную защиту от спуфинга, чтобы предотвратить злоупотребление электронной почтой.

Функция пересылки электронной почты сохраняет оригинальные заголовки электронных писем, реализуя при этом комплексную защиту от подмены сообщений с помощью кодовой базы MX:

* **Сохранение заголовков**: исходные заголовки аутентификации сохраняются при пересылке.
* **Антиспуфинг**: применение политики DMARC предотвращает подмену заголовков, отклоняя письма, не прошедшие проверку SPF или DKIM.
* **Предотвращение внедрения заголовков**: проверка и очистка входных данных с помощью библиотеки striptags.
* **Расширенная защита**: развитая система обнаружения фишинга с обнаружением подмены, предотвращением имперсонации и системами уведомлений пользователей.

**Подробности реализации MX**: Основная логика обработки электронной почты обрабатывается кодовой базой сервера MX, а именно:

* Основной обработчик данных MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Фильтрация произвольных сообщений электронной почты (антиспуфинг): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Помощник `isArbitrary` реализует сложные правила защиты от подмены доменов, включая обнаружение подмены домена, заблокированных фраз и различных шаблонов фишинга.

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Как вы защищаетесь от спама и злоупотреблений {#how-do-you-protect-against-spam-and-abuse}

Forward Email реализует комплексную многоуровневую защиту:

* **Ограничение скорости**: применяется к попыткам аутентификации, конечным точкам API и SMTP-подключениям.
* **Изоляция ресурсов**: между пользователями для предотвращения воздействия со стороны большого количества пользователей.
* **Защита от DDoS-атак**: многоуровневая защита с помощью системы Shield от DataPacket и Cloudflare.
* **Автоматическое масштабирование**: динамическая регулировка ресурсов в зависимости от спроса.
* **Предотвращение злоупотреблений**: проверка пользователей на предмет злоупотреблений и блокировка вредоносного контента на основе хэш-суммы.
* **Аутентификация электронной почты**: протоколы SPF, DKIM, DMARC с расширенным обнаружением фишинга.

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (информация о защите от DDoS-атак)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Вы храните содержимое электронной почты на диске {#do-you-store-email-content-on-disk}?

> \[!IMPORTANT]
> Пересылка электронной почты использует архитектуру с нулевым разглашением, которая предотвращает запись содержимого электронной почты на диск.

* **Архитектура с нулевым разглашением**: Индивидуально зашифрованные почтовые ящики SQLite исключают доступ Forward Email к содержимому писем.
* **Обработка в памяти**: Обработка писем происходит полностью в памяти, без использования дискового хранилища.
* **Отсутствие логирования контента**: «Мы не регистрируем и не храним содержимое или метаданные писем на диске».
* **Шифрование в изолированной среде**: Ключи шифрования никогда не хранятся на диске в виде открытого текста.

**Доказательства из кодовой базы MX**: Сервер MX обрабатывает электронные письма полностью в памяти, не записывая содержимое на диск. Основной обработчик электронной почты демонстрирует этот подход с использованием памяти: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Аннотация)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Детали с нулевым разглашением)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Шифрование в изолированной среде)

### Может ли содержимое электронной почты быть раскрыто во время сбоев системы {#can-email-content-be-exposed-during-system-crashes}

Нет. Функция пересылки электронной почты реализует комплексную защиту от раскрытия данных, связанных со сбоями:

* **Дампы ядра отключены**: предотвращает несанкционированный доступ к памяти во время сбоев.
* **Память подкачки отключена**: полностью отключена для предотвращения извлечения конфиденциальных данных из файлов подкачки.
* **Архитектура в памяти**: содержимое электронной почты хранится только в энергозависимой памяти во время обработки.
* **Защита ключей шифрования**: ключи никогда не хранятся на диске в виде открытого текста.
* **Физическая безопасность**: зашифрованные диски LUKS v2 предотвращают физический доступ к данным.
* **USB-накопитель отключен**: предотвращает несанкционированное извлечение данных.

**Обработка ошибок при системных проблемах**: Пересылка электронной почты использует вспомогательные функции `isCodeBug` и `isTimeoutError`, чтобы гарантировать, что в случае возникновения проблем с подключением к базе данных, проблем с сетью/черным списком DNS или проблем с подключением к восходящему каналу, система вернет коды состояния SMTP 421, чтобы гарантировать, что письма будут отправлены повторно позже, а не будут утеряны или раскрыты.

Подробности реализации:

* Классификация ошибки: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Обработка ошибок тайм-аута при обработке MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Кто имеет доступ к вашей инфраструктуре электронной почты {#who-has-access-to-your-email-infrastructure}

Forward Email реализует комплексный контроль доступа для минимальной группы инженеров из 2–3 человек со строгими требованиями 2FA:

* **Управление доступом на основе ролей**: для учётных записей команд с разрешениями, основанными на ресурсах
* **Принцип наименьших привилегий**: применяется во всех системах
* **Разделение обязанностей**: между операционными ролями
* **Управление пользователями**: разделение пользователей, участвующих в развёртывании и DevOps, с разными разрешениями
* **Отключение входа с правами root**: принудительный доступ через правильно аутентифицированные учётные записи
* **Строгая двухфакторная аутентификация**: 2FA по SMS не используется из-за риска атак типа «человек посередине» (MiTM) — только токены на базе приложений или аппаратные токены
* **Комплексное ведение журнала аудита**: с редактированием конфиденциальных данных
* **Автоматическое обнаружение аномалий**: для нестандартных схем доступа
* **Регулярные проверки безопасности**: журналов доступа
* **Предотвращение атак Evil Maid**: отключение USB-накопителей и других мер физической безопасности

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Управление авторизацией)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Сетевая безопасность)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Предотвращение атак злонамеренных программ)

### Какими поставщиками инфраструктуры вы пользуетесь {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Для пересылки электронной почты используются несколько инфраструктурных субпроцессоров с комплексными сертификатами соответствия.

Полную информацию можно найти на нашей странице соответствия GDPR: <https://forwardemail.net/gdpr>

**Основные инфраструктурные субпроцессоры:**

| Поставщик | Сертифицировано по системе конфиденциальности данных | Страница соответствия GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Клаудфлейр** | ✅ Да | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Пакет данных** | ❌ Нет | <https://www.datapacket.com/privacy-policy> |
| **Цифровой океан** | ❌ Нет | <https://www.digitalocean.com/legal/gdpr> |
| **Вультр** | ❌ Нет | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Подробные сертификаты:**

**Цифровой океан**

* SOC 2 Type II и SOC 3 Type II (проверено Schellman & Company LLC)
* Сертификация ISO 27001 в нескольких центрах обработки данных
* Соответствие PCI-DSS
* Сертификация CSA STAR Level 1
* Сертификация APEC CBPR PRP
* Подробности: <https://www.digitalocean.com/trust/certification-reports>

**Вультр**

* Сертификация SOC 2+ (HIPAA)
* Соответствие PCI Merchant
* Сертификация CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Подробности: <https://www.vultr.com/legal/compliance/>

**Пакет данных**

* Соответствие требованиям SOC 2 (для получения сертификации обратитесь напрямую в DataPacket)
* Инфраструктура корпоративного уровня (расположение в Денвере)
* Защита от DDoS-атак с помощью стека кибербезопасности Shield
* Круглосуточная техническая поддержка
* Глобальная сеть, охватывающая 58 центров обработки данных
* Подробности: <https://www.datapacket.com/datacenters/denver>

**Платежные процессоры:**

* **Stripe**: Сертифицировано по DPF - <https://stripe.com/legal/privacy-center>
* **PayPal**: Не сертифицировано по DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Предлагаете ли вы Соглашение об обработке данных (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Да, Forward Email предлагает комплексное соглашение об обработке данных (DPA), которое можно подписать вместе с нашим корпоративным соглашением. Копия нашего DPA доступна по адресу: <https://forwardemail.net/dpa>

**Подробности DPA:**

* Соответствует требованиям GDPR и соглашениям о защите конфиденциальности ЕС-США/Швейцария-США.
* Автоматически принимается при согласии с нашими Условиями обслуживания.
* Отдельная подпись для стандартного соглашения об обработке данных не требуется.
* Индивидуальные соглашения об обработке данных доступны в рамках корпоративной лицензии.

**Структура соответствия GDPR:**
В нашем документе DPA подробно описывается соблюдение GDPR, а также международных требований к передаче данных. Полная информация доступна по адресу: <https://forwardemail.net/gdpr>

Корпоративным клиентам, которым требуются индивидуальные условия DPA или особые договорные соглашения, эти вопросы можно решить через нашу программу **Корпоративная лицензия (250 долл. США в месяц)**.

### Как вы обрабатываете уведомления об утечке данных {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Архитектура пересылки электронной почты с нулевым разглашением существенно ограничивает последствия взлома.

* **Ограниченный доступ к данным**: невозможно получить доступ к зашифрованному содержимому электронной почты из-за архитектуры с нулевым разглашением.
* **Минимальный сбор данных**: только базовая информация об абоненте и ограниченное количество журналов IP-адресов для обеспечения безопасности.
* **Платформы субпроцессора**: DigitalOcean и Vultr поддерживают процедуры реагирования на инциденты, соответствующие требованиям GDPR.

**Информация о представителе GDPR:**
Компания Forward Email назначила представителей GDPR в соответствии со статьей 27:

**Представитель ЕС:**
Osano International Compliance Services Limited
ВНИМАНИЕ: LFHC
3 Dublin Landings, North Wall Quay
Дублин 1, D01C4E0

**Представитель в Великобритании:**
Osano UK Compliance LTD
ВНИМАНИЕ: LFHC
Фонтейн-стрит, 42-46, Белфаст
Антрим, BT1 - 5EF

Для корпоративных клиентов, которым требуются особые соглашения об уровне обслуживания (SLA) по уведомлению о нарушениях, их следует обсудить в рамках соглашения **Enterprise License**.

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Вы предлагаете тестовую среду {#do-you-offer-a-test-environment}

В технической документации Forward Email отдельный режим «песочницы» явно не описан. Однако возможные подходы к тестированию включают:

* **Возможность самостоятельного размещения**: Широкие возможности самостоятельного размещения для создания тестовых сред
* **Интерфейс API**: Возможность программного тестирования конфигураций
* **Открытый исходный код**: Полностью открытый исходный код позволяет клиентам исследовать логику пересылки
* **Несколько доменов**: Поддержка нескольких доменов может позволить создавать тестовые домены

Для корпоративных клиентов, которым требуются формальные возможности «песочницы», это следует обсудить в рамках соглашения о **корпоративной лицензии**.

Источник: <https://github.com/forwardemail/forwardemail.net> (Сведения о среде разработки)

### Предоставляете ли вы инструменты мониторинга и оповещения {#do-you-provide-monitoring-and-alerting-tools}

Функция пересылки электронной почты обеспечивает мониторинг в режиме реального времени с некоторыми ограничениями:

**Доступный:**

* **Мониторинг доставки в реальном времени**: общедоступные показатели производительности для основных почтовых сервисов.
* **Автоматические оповещения**: команда разработчиков получает уведомление, если время доставки превышает 10 секунд.
* **Прозрачный мониторинг**: системы мониторинга с полностью открытым исходным кодом.
* **Мониторинг инфраструктуры**: автоматизированное обнаружение аномалий и комплексное ведение журнала аудита.

**Ограничения:**

* Клиентские веб-перехватчики или уведомления о статусе доставки на основе API явно не документированы.

Для корпоративных клиентов, которым требуются подробные веб-перехваты статуса доставки или индивидуальные интеграции мониторинга, эти возможности могут быть доступны в рамках соглашений о **корпоративной лицензии**.

Источники:

* <https://forwardemail.net> (Отображение мониторинга в реальном времени)
* <https://github.com/forwardemail/forwardemail.net> (Реализация мониторинга)

### Как обеспечить высокую доступность {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Пересылка электронной почты обеспечивает комплексное резервирование между несколькими поставщиками инфраструктуры.

* **Распределенная инфраструктура**: Несколько провайдеров (DigitalOcean, Vultr, DataPacket) в разных географических регионах
* **Географическая балансировка нагрузки**: Геолокационная балансировка нагрузки на базе Cloudflare с автоматическим переключением при сбое
* **Автоматическое масштабирование**: Динамическая адаптация ресурсов в зависимости от спроса
* **Многоуровневая защита от DDoS-атак**: С помощью системы Shield от DataPacket и Cloudflare
* **Резервирование серверов**: Несколько серверов в каждом регионе с автоматическим переключением при сбое
* **Репликация базы данных**: Синхронизация данных в режиме реального времени между несколькими локациями
* **Мониторинг и оповещения**: Круглосуточный мониторинг с автоматическим реагированием на инциденты

**Обязательство по обеспечению бесперебойной работы**: доступность сервиса более 99,9% с прозрачным мониторингом доступна по адресу <https://forwardemail.net>

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Соответствуете ли вы требованиям раздела 889 Закона о национальной обороне (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Пересылка электронной почты полностью соответствует разделу 889 благодаря тщательному выбору инфраструктурных партнеров.

Да, функция пересылки электронной почты **соответствует разделу 889**. Раздел 889 Закона о национальной обороне (NDAA) запрещает государственным учреждениям использовать телекоммуникационное оборудование и оборудование для видеонаблюдения определённых компаний (Huawei, ZTE, Hikvision, Dahua и Hytera) или заключать с ними контракты.

**Как Forward Email обеспечивает соответствие разделу 889:**

Пересылка электронной почты осуществляется исключительно с помощью двух ключевых поставщиков инфраструктуры, ни один из которых не использует оборудование, запрещенное разделом 889:

1. **Cloudflare**: Наш основной партнер в области сетевых услуг и безопасности электронной почты.
2. **DataPacket**: Наш основной поставщик серверной инфраструктуры (использует исключительно оборудование Arista Networks и Cisco).
3. **Поставщики услуг резервного копирования**: Наши поставщики услуг резервного копирования Digital Ocean и Vultr дополнительно письменно подтвердили соответствие требованиям Раздела 889.

**Обязательство Cloudflare**: Cloudflare прямо заявляет в своем Кодексе поведения для третьих лиц, что они не используют телекоммуникационное оборудование, продукты видеонаблюдения или услуги каких-либо организаций, запрещенных Разделом 889.

**Пример использования в государственном секторе**: Наше соответствие Разделу 889 было подтверждено, когда **Военно-морская академия США** выбрала Forward Email для своих нужд по безопасной пересылке электронной почты, что потребовало документирования наших федеральных стандартов соответствия.

Полную информацию о нашей системе соблюдения требований правительства, включая более широкие федеральные правила, можно найти в нашем комплексном исследовании: [Соответствует разделу 889 Федеральной правительственной службы электронной почты](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Системные и технические данные {#system-and-technical-details}

### Вы храните электронные письма и их содержимое {#do-you-store-emails-and-their-contents}

Нет, мы не записываем на диск и не храним логи – с помощью [исключение ошибок](#do-you-store-error-logs) и [исходящий SMTP](#do-you-support-sending-email-with-smtp) (см. наш [политика конфиденциальности](/privacy)).

Все делается в памяти и [наш исходный код находится на GitHub](https://github.com/forwardemail).

### Как работает ваша система пересылки электронной почты {#how-does-your-email-forwarding-system-work}

Электронная почта использует [SMTP-протокол](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Этот протокол состоит из команд, отправляемых на сервер (обычно работающий через порт 25). Устанавливается начальное соединение, затем отправитель указывает отправителя письма («MAIL FROM»), затем получателя («RCPT TO»), и, наконец, заголовки и тело письма («DATA»). Ниже описана последовательность действий нашей системы пересылки электронной почты для каждой команды протокола SMTP:

* Начальное соединение (без имени команды, например, `telnet example.com 25`) — это начальное соединение. Мы сверяем отправителей, не входящих в наш список [белый список](#do-you-have-an-allowlist), с отправителями из списка [список отрицаний](#do-you-have-a-denylist). Если отправитель не входит в наш список разрешённых отправителей, мы проверяем, не был ли он в списке [в сером списке](#do-you-have-a-greylist).

* `HELO` — приветствие, идентифицирующее полное доменное имя (FQDN), IP-адрес или имя почтового обработчика отправителя. Это значение можно подделать, поэтому мы не полагаемся на эти данные и вместо этого используем обратный поиск имени хоста по IP-адресу соединения.

* `MAIL FROM` — указывает адрес отправителя конверта. Если значение указано, оно должно быть действительным адресом электронной почты RFC 5322. Пустые значения разрешены. Здесь мы используем [проверка на обратное рассеяние](#how-do-you-protect-against-backscatter), а также проверяем MAIL FROM на соответствие [список отрицаний](#do-you-have-a-denylist). Наконец, мы проверяем отправителей, не входящих в разрешённый список, на предмет ограничения скорости отправки (подробнее см. в разделе о [Ограничение скорости](#do-you-have-rate-limiting) и [белый список](#do-you-have-an-allowlist)).

* `RCPT TO` — здесь указывается получатель(и) письма. Это должны быть действительные адреса электронной почты RFC 5322. Мы допускаем до 50 получателей конверта на сообщение (это отличается от заголовка «Кому» в электронном письме). Мы также проверяем наличие действительного адреса [Схема перезаписи отправителя](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) («SRS») для защиты от подмены с использованием нашего доменного имени SRS.

* `DATA` — это основная часть нашего сервиса, обрабатывающая электронные письма. Подробнее см. в разделе [Как вы обрабатываете электронное письмо для пересылки?](#how-do-you-process-an-email-for-forwarding) ниже.

### Как обработать электронное письмо для пересылки {#how-do-you-process-an-email-for-forwarding}

В этом разделе описывается наш процесс, связанный с командой протокола SMTP `DATA` в разделе [Как работает ваша система пересылки электронной почты?](#how-does-your-email-forwarding-system-work) выше, — это то, как мы обрабатываем заголовки, тело, безопасность электронного письма, определяем, куда его нужно доставить, и как мы обрабатываем соединения.

1. Если размер сообщения превышает максимальный размер 50 МБ, то оно отклоняется с кодом ошибки 552.

2. Если сообщение не содержит заголовка «От» или если какое-либо из значений в заголовке «От» не является допустимым адресом электронной почты RFC 5322, то оно отклоняется с кодом ошибки 550.

3. Если сообщение имело более 25 заголовков «Получено», то считалось, что оно попало в цикл переадресации, и оно отклонялось с кодом ошибки 550.

4. Используя отпечаток электронной почты (см. раздел о [Дактилоскопирование](#how-do-you-determine-an-email-fingerprint)), мы проверим, предпринимались ли повторные попытки отправки сообщения в течение более 5 дней (что соответствует [поведение постфикса по умолчанию](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), и если это так, то сообщение будет отклонено с кодом ошибки 550.

5. Мы сохраняем в памяти результаты сканирования электронной почты, используя [Спам-сканер](https://spamscanner.net).

6. Если были какие-либо произвольные результаты проверки спамом, они отклоняются с кодом ошибки 554. На момент написания статьи произвольные результаты включают только тест GTUBE. Подробнее см. в разделе <https://spamassassin.apache.org/gtube/>.

7. В целях отладки и предотвращения злоупотреблений мы добавим в сообщение следующие заголовки:

* `Received` — мы добавляем этот стандартный заголовок Received с IP-адресом и хостом отправителя, типом передачи, информацией о TLS-подключении, датой/временем и получателем.
* `X-Original-To` — исходный получатель сообщения:
* Это полезно для определения того, куда изначально было доставлено электронное письмо (в дополнение к заголовку «Received»).
* Добавляется для каждого получателя при пересылке по протоколу IMAP и/или маскированной пересылке (для защиты конфиденциальности).
* `X-Forward-Email-Website` — содержит ссылку на наш веб-сайт <https://forwardemail.net>
* `X-Forward-Email-Version` — текущая версия [СемВер](https://semver.org/) из `package.json` нашей кодовой базы.
* `X-Forward-Email-Session-ID` — значение идентификатора сеанса, используемое для отладки (применяется только в непроизводственных средах).
* `X-Forward-Email-Sender` — список, разделенный запятыми, содержащий адрес MAIL FROM исходного конверта (если он не был пустым), полное доменное имя обратного PTR-клиента (если существует) и IP-адрес отправителя.
* `X-Forward-Email-ID` — применимо только для исходящего SMTP-сообщения и соответствует идентификатору электронной почты, сохранённому в разделе «Моя учётная запись» → «Электронная почта».
* `X-Original-To`0 — со значением `X-Original-To`1.
* `X-Original-To`2 — со значением `X-Original-To`3.
* `X-Original-To`4 — со значением `X-Original-To`5.

8. Затем мы проверяем сообщение на наличие [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) и [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Если сообщение не прошло проверку DMARC, а для домена задана политика отклонения (например, `p=reject` [был в политике DMARC](https://wikipedia.org/wiki/DMARC)), оно отклоняется с кодом ошибки 550. Обычно политика DMARC для домена указана в записи <strong class="notranslate">TXT</strong> поддомена `_dmarc` (например, `dig _dmarc.example.com txt`).
* Если сообщение не прошло проверку SPF, а для домена задана политика полного отказа (например, `-all` указана в политике SPF, а не `~all`, или политика вообще отсутствует), оно отклоняется с кодом ошибки 550. Обычно политика SPF для домена указана в записи <strong class="notranslate">TXT</strong> корневого домена (например, `dig example.com txt`). Дополнительную информацию о [отправка почты как с Gmail](#can-i-send-mail-as-in-gmail-with-this) относительно SPF см. в этом разделе.

9. Теперь обрабатываем получателей сообщения, собранных командой `RCPT TO` в разделе [Как работает ваша система пересылки электронной почты?](#how-does-your-email-forwarding-system-work) выше. Для каждого получателя выполняем следующие операции:

* Мы ищем записи <strong class="notranslate">TXT</strong> доменного имени (часть после символа `@`, например, `example.com`, если адрес электронной почты был `test@example.com`). Например, если домен — `example.com`, мы выполняем DNS-запрос, например, `dig example.com txt`.
* Мы анализируем все записи <strong class="notranslate">TXT</strong>, начинающиеся с `forward-email=` (бесплатные тарифы) или `forward-email-site-verification=` (платные тарифы). Обратите внимание, что мы анализируем обе записи, чтобы обрабатывать электронные письма при повышении или понижении тарифного плана пользователем. * Из этих проанализированных записей <strong class="notranslate">TXT</strong> мы итеративно просматриваем их, чтобы извлечь конфигурацию пересылки (как описано в разделе [Как начать и настроить пересылку электронной почты](#how-do-i-get-started-and-set-up-email-forwarding) выше). Обратите внимание, что мы поддерживаем только одно значение `forward-email-site-verification=`, и если указано более одного, возникнет ошибка 550, и отправитель получит сообщение о недоставке для этого получателя.
* Рекурсивно мы итеративно просматриваем извлеченную конфигурацию пересылки, чтобы определить глобальную пересылку, пересылку на основе регулярных выражений и все другие поддерживаемые конфигурации пересылки, которые теперь называются нашими «адресами пересылки».
* Для каждого адреса пересылки мы поддерживаем один рекурсивный поиск (который запускает эту серию операций с заданным адресом). Если рекурсивное совпадение найдено, родительский результат будет удален из списка адресов пересылки, а дочерние будут добавлены. * Адреса пересылки проверяются на уникальность (так как мы не хотим отправлять дубликаты на один адрес или создавать дополнительные ненужные клиентские SMTP-подключения).

* Для каждого адреса пересылки мы ищем его доменное имя в нашей конечной точке API `/v1/max-forwarded-addresses` (чтобы определить, сколько адресов домену разрешено пересылать почту на каждый псевдоним, например, 10 по умолчанию — см. раздел о `example.com`0). При превышении этого лимита возникает ошибка 550, и отправитель получает сообщение об отказе для этого получателя.

* Мы ищем настройки исходного получателя в нашей конечной точке API `example.com`1, которая поддерживает поиск для платных пользователей (с резервным вариантом для бесплатных пользователей). Возвращает объект конфигурации для расширенных настроек `example.com`2 (число, например, `example.com`3), `example.com`4 (логическое значение), `example.com`5 (логическое значение), `example.com`6 (логическое значение) и `example.com`7 (логическое значение).
* На основе этих настроек мы проверяем сообщение на наличие спам-контента, и если возникают какие-либо ошибки, сообщение отклоняется с кодом ошибки 554 (например, если включено `example.com`8, мы проверяем результаты спам-сканера на наличие вирусов). Обратите внимание, что все пользователи бесплатного тарифного плана будут включены для проверки на наличие контента для взрослых, фишинга, исполняемых файлов и вирусов. По умолчанию все пользователи платного плана также включены в эту функцию, но эту конфигурацию можно изменить на странице настроек для домена в панели управления пересылкой электронной почты.

10. Для каждого обработанного адреса пересылки получателя мы затем выполняем следующие операции:

* Адрес проверяется на соответствие нашему [список отрицаний](#do-you-have-a-denylist), и если он указан, возникает код ошибки 421 (указывает отправителю на необходимость повторить попытку позже).
* Если адрес — веб-хук, то мы устанавливаем логическое значение для будущих операций (см. ниже — мы группируем похожие веб-хуки для создания одного POST-запроса, а не нескольких для доставки).
* Если адрес — адрес электронной почты, то мы анализируем хост для будущих операций (см. ниже — мы группируем похожие хосты для создания одного соединения, а не нескольких отдельных соединений для доставки).

11. Если получателей нет и нет отказов, мы отвечаем ошибкой 550 «Неверные получатели».

12. Если есть получатели, мы перебираем их (группируя по одному хосту) и доставляем письма. Подробнее см. раздел [Как вы решаете проблемы с доставкой электронной почты?](#how-do-you-handle-email-delivery-issues) ниже.

* Если при отправке электронных писем возникнут ошибки, мы сохраним их в памяти для последующей обработки.
* Мы возьмём наименьший код ошибки (если таковой имеется) из отправленных электронных писем и используем его в качестве кода ответа на команду `DATA`. Это означает, что не доставленные письма, как правило, будут повторно отправлены исходным отправителем, в то время как уже доставленные письма не будут повторно отправлены при следующей отправке сообщения (поскольку мы используем [Дактилоскопирование](#how-do-you-determine-an-email-fingerprint)).
* Если ошибок не произошло, мы отправим код статуса успешного ответа SMTP 250.
* Возвратом считается любая попытка доставки, которая приводит к коду статуса >= 500 (постоянная ошибка).

13. Если не было ни одного отказа (постоянных сбоев), то мы вернем код статуса ответа SMTP с наименьшим кодом ошибки среди непостоянных сбоев (или код успешного статуса 250, если таковых не было).

14. Если ошибки всё же возникли, мы будем отправлять уведомления о недоставке в фоновом режиме, вернув отправителю наименьший из всех кодов ошибок. Однако, если наименьший код ошибки >= 500, мы не будем отправлять уведомления о недоставке. Это связано с тем, что в противном случае отправители получат двойное уведомление о недоставке (например, одно от своего исходящего MTA, такого как Gmail, и одно от нас). Подробнее см. в разделе о [Как защититься от обратного рассеяния?](#how-do-you-protect-against-backscatter) ниже.

### Как вы решаете проблемы с доставкой электронной почты {#how-do-you-handle-email-delivery-issues}

Обратите внимание, что мы будем применять к письмам перезапись «Friendly-From» только в том случае, если политика DMARC отправителя не пройдена И ни одна DKIM-подпись не была согласована с заголовком «From». Это означает, что мы изменим заголовок «From» сообщения, установим «X-Original-From» и также установим «Reply-To», если он ещё не установлен. Мы также повторно запечатаем сообщение печатью ARC после изменения этих заголовков.

Мы также используем интеллектуальный синтаксический анализ сообщений об ошибках на каждом уровне нашего стека — в нашем коде запросы DNS, внутренние компоненты Node.js, запросы HTTP (например, 408, 413 и 429 сопоставляются с кодом ответа SMTP 421, если получатель — веб-хук) и ответы почтового сервера (например, ответы с «defer» или «slowdown» будут повторно обработаны как ошибки 421).

Наша логика защищена от ложных сообщений и также будет повторять попытки в случае ошибок SSL/TLS, проблем с подключением и т. д. Цель защиты от ложных сообщений — обеспечить максимальную доставляемость всем получателям при заданной конфигурации пересылки.

Если получатель — веб-хук, мы разрешим 60-секундный тайм-аут для выполнения запроса с возможностью до трёх повторных попыток (итого 4 запроса до сбоя). Обратите внимание, что мы корректно анализируем коды ошибок 408, 413 и 429 и сопоставляем их с кодом ответа SMTP 421.

В противном случае, если получатель — адрес электронной почты, мы попытаемся отправить письмо с использованием протокола TLS (мы пытаемся использовать протокол STARTTLS, если он доступен на почтовом сервере получателя). Если при отправке письма возникает ошибка SSL/TLS, мы попытаемся отправить письмо без TLS (без использования STARTTLS).

Если возникнут какие-либо ошибки DNS или соединения, то мы вернем команде `DATA` код ответа SMTP 421, в противном случае, если будут обнаружены ошибки уровня >= 500, будут отправлены сообщения об отказе.

Если мы обнаружим, что на сервере электронной почты, на который мы пытаемся доставить письмо, заблокирован один или несколько IP-адресов нашей почтовой службы (например, с помощью какой-либо технологии, используемой для защиты от спамеров), то мы отправим отправителю код ответа SMTP 421, чтобы он мог повторить попытку отправки сообщения позже (и мы будем уведомлены о проблеме, поэтому, надеемся, сможем решить ее до следующей попытки).

### Как вы справляетесь с блокировкой своих IP-адресов {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Мы регулярно отслеживаем все основные черные списки DNS, и если какой-либо из наших IP-адресов почтовой биржи («MX») указан в основном черном списке, мы по возможности исключим его из соответствующего кругового списка записей DNS A до тех пор, пока проблема не будет решена.

На момент написания этой статьи мы также включены в несколько разрешённых списков DNS и серьёзно относимся к мониторингу чёрных списков. Если вы обнаружите какие-либо проблемы до того, как мы успеем их решить, пожалуйста, сообщите нам об этом в письменной форме по адресу <support@forwardemail.net>.

Наши IP-адреса общедоступны, [см. этот раздел ниже для более подробной информации](#what-are-your-servers-ip-addresses).

### Что такое адреса почтмейстеров {#what-are-postmaster-addresses}

Чтобы предотвратить некорректные возвраты писем и отправку сообщений об отсутствии на складе на неконтролируемые или несуществующие почтовые ящики, мы ведём список имен пользователей, похожих на почтовые демоны:

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
* [и любой адрес без ответа](#what-are-no-reply-addresses)

Дополнительную информацию о том, как такие списки используются для создания эффективных систем электронной почты, см. в разделе [RFC 5320 Раздел 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Что такое адреса без ответа {#what-are-no-reply-addresses}

Имена пользователей электронной почты, соответствующие любому из следующих (без учета регистра), считаются адресами без ответа:

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

Этот список поддерживается [как проект с открытым исходным кодом на GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Каковы IP-адреса вашего сервера {#what-are-your-servers-ip-addresses}

Мы публикуем наши IP-адреса в <https://forwardemail.net/ips>.

### У вас есть белый список {#do-you-have-an-allowlist}

Да, у нас есть [список расширений доменных имен](#what-domain-name-extensions-are-allowlisted-by-default), которые по умолчанию включены в белый список, а также динамический, кэшированный и обновляемый белый список на основе [строгие критерии](#what-is-your-allowlist-criteria).

Все адреса электронной почты, домены и получатели клиентов на платных тарифных планах автоматически добавляются в наш белый список.

### Какие расширения доменных имен разрешены по умолчанию {#what-domain-name-extensions-are-allowlisted-by-default}

Следующие расширения доменных имен считаются разрешенными по умолчанию (независимо от того, находятся ли они в списке популярности Umbrella или нет):

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

Кроме того, эти [брендовые и корпоративные домены верхнего уровня](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) по умолчанию включены в разрешенный список (например, `apple` для `applecard.apple` для банковских выписок по карте Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">Accenture</code></li>
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
<li class="list-inline-item"><code class="notranslate">баскетбол</code></li>
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
<li class="list-inline-item"><code class="notranslate">bond</code></li>
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
<li class="list-inline-item"><code class="notranslate">CFA</code></li>
<li class="list-inline-item"><code class="notranslate">Chanel</code></li>
<li class="list-inline-item"><code class="notranslate">Chase</code></li>
<li class="list-inline-item"><code class="notranslate">Chintai</code></li>
<li class="list-inline-item"><code class="notranslate">Chrome</code></li>
<li class="list-inline-item"><code class="notranslate">Chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">Cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">Cisco</code></li>
<li class="list-inline-item"><code class="notranslate">Citadel</code></li>
<li class="list-inline-item"><code class="notranslate">Citi</code></li>
<li class="list-inline-item"><code class="notranslate">Citi</code></li>
<li class="list-inline-item"><code class="notranslate">Clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">Comcast</code></li>
<li class="list-inline-item"><code class="notranslate">Commbank</code></li>
<li class="list-inline-item"><code class="notranslate">CreditUnion</code></li>
<li class="list-inline-item"><code class="notranslate">Crown</code></li>
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
<li class="list-inline-item"><code class="notranslate">Евровидение</code></li>
<li class="list-inline-item"><code class="notranslate">Эвербанк</code></li>
<li class="list-inline-item"><code class="notranslate">Экстрапространство</code></li>
<li class="list-inline-item"><code class="notranslate">Фейдж</code></li>
<li class="list-inline-item"><code class="notranslate">Фэрвиндс</code></li>
<li class="list-inline-item"><code class="notranslate">Фермерс</code></li>
<li class="list-inline-item"><code class="notranslate">Федерал</code></li>
<li class="list-inline-item"><code class="notranslate">Федерал</code></li>
<li class="list-inline-item"><code class="notranslate">Федерал</code></li> class="notranslate">Ferrero</code></li>
<li class="list-inline-item"><code class="notranslate">Fiat</code></li>
<li class="list-inline-item"><code class="notranslate">Fidelity</code></li>
<li class="list-inline-item"><code class="notranslate">Firestone</code></li>
<li class="list-inline-item"><code class="notranslate">Firmdale</code></li>
<li class="list-inline-item"><code class="notranslate">Flickr</code></li>
<li class="list-inline-item"><code class="notranslate">Flir</code></li>
<li class="list-inline-item"><code class="notranslate">Flsmidth</code></li>
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
<li class="list-inline-item"><code class="notranslate">Hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">Hkt</code></li>
<li class="list-inline-item"><code class="notranslate">Honda</code></li>
<li class="list-inline-item"><code class="notranslate">Honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">Honeymail</code></li>
<li class="list-inline-item"><code class="notranslate">HSBC</code></li>
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
<li class="list-inline-item"><code class="notranslate">можжевельник</code></li>
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
<li class="list-inline-item"><code class="notranslate">Lidl</code></li>
<li class="list-inline-item"><code class="notranslate">стиль жизни</code></li>
<li class="list-inline-item"><code class="notranslate">Lilly</code></li>
<li class="list-inline-item"><code class="notranslate">Линкольн</code></li>
<li class="list-inline-item"><code class="notranslate">Линде</code></li>
<li class="list-inline-item"><code class="notranslate">Липси</code></li>
<li class="list-inline-item"><code class="notranslate">Ликсил</code></li>
<li class="list-inline-item"><code class="notranslate">Локус</code></li>
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
<li class="list-inline-item"><code class="notranslate">nationalwide</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">НБА</code></li>
<li class="list-inline-item"><code class="notranslate">NEC</code></li>
<li class="list-inline-item"><code class="notranslate">Netflix</code></li>
<li class="list-inline-item"><code class="notranslate">Neustar</code></li>
<li class="list-inline-item"><code class="notranslate">Ньюхолланд</code></li>
<li class="list-inline-item"><code class="notranslate">НФЛ</code></li>
<li class="list-inline-item"><code class="notranslate">НХК</code></li>
<li class="list-inline-item"><code class="notranslate">Нико</code></li>
<li class="list-inline-item"><code class="notranslate">Nike</code></li>
<li class="list-inline-item"><code class="notranslate">Nikon</code></li>
<li class="list-inline-item"><code class="notranslate">Nissan</code></li>
<li class="list-inline-item"><code class="notranslate">Nissan</code></li>
<li class="list-inline-item"><code class="notranslate">Nokia</code></li>
<li class="list-inline-item"><code class="notranslate">Northwesternmutual</code></li>
<li class="list-inline-item"><code class="notranslate">Norton</code></li>
<li class="list-inline-item"><code class="notranslate">NRA</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">Panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">Pccw</code></li>
<li class="list-inline-item"><code class="notranslate">Pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">Philips</code></li>
<li class="list-inline-item"><code class="notranslate">Piaget</code></li>
<li class="list-inline-item"><code class="notranslate">Pictet</code></li>
<li class="list-inline-item"><code class="notranslate">Ping</code></li>
<li class="list-inline-item"><code class="notranslate">Pioneer</code></li>
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
<li class="list-inline-item"><code class="notranslate">Шеффлер</code></li>
<li class="list-inline-item"><code class="notranslate">Шмидт</code></li>
<li class="list-inline-item"><code class="notranslate">Шварц</code></li>
<li class="list-inline-item"><code class="notranslate">Скджонсон</code></li>
<li class="list-inline-item"><code class="notranslate">Скор</code></li>
<li class="list-inline-item"><code class="notranslate">Сиэт</code></li>
<li class="list-inline-item"><code class="notranslate">Сенер</code></li>
<li class="list-inline-item"><code class="notranslate">Сес</code></li>
<li class="list-inline-item"><code class="notranslate">Сес</code></li> class="notranslate">шить</code></li>
<li class="list-inline-item"><code class="notranslate">семь</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">искать</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">острый</code></li>
<li class="list-inline-item"><code class="notranslate">шоу</code></li>
<li class="list-inline-item"><code class="notranslate">ракушка</code></li>
<li class="list-inline-item"><code class="notranslate">Шрирам</code></li>
<li class="list-inline-item"><code class="notranslate">Сина</code></li>
<li class="list-inline-item"><code class="notranslate">Скайп</code></li>
<li class="list-inline-item"><code class="notranslate">Смарт</code></li>
<li class="list-inline-item"><code class="notranslate">SNCF</code></li>
<li class="list-inline-item"><code class="notranslate">Софтбанк</code></li>
<li class="list-inline-item"><code class="notranslate">Соху</code></li>
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
<li class="list-inline-item"><code class="notranslate">телевизоры</code></li>
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
<li class="list-inline-item"><code class="notranslate">Вольтерсклувер</code></li>
<li class="list-inline-item"><code class="notranslate">Вудсайд</code></li>
<li class="list-inline-item"><code class="notranslate">ВТЦ</code></li>
<li class="list-inline-item"><code class="notranslate">Xbox</code></li>
<li class="list-inline-item"><code class="notranslate">Xerox</code></li>
<li class="list-inline-item"><code class="notranslate">Xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">Yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">Yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">Яндекс</code></li>
<li class="list-inline-item"><code class="notranslate">Йодобаши</code></li>
<li class="list-inline-item"><code class="notranslate">YouTube</code></li>
<li class="list-inline-item"><code class="notranslate">Zappos</code></li>
<li class="list-inline-item"><code class="notranslate">Zara</code></li>
<li class="list-inline-item"><code class="notranslate">Zippo</code></li>
</ul>

По состоянию на 18 марта 2025 года мы также добавили в этот список следующие заморские территории Франции ([по этому запросу GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

По состоянию на 8 июля 2025 года мы добавили следующие страны Европы:

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

Мы специально не включили `cz`, `ru` и `ua` из-за высокой активности спама.

### Каковы ваши критерии белого списка {#what-is-your-allowlist-criteria}

У нас есть статический список [расширения доменных имен разрешены по умолчанию](#what-domain-name-extensions-are-allowlisted-by-default), а также мы поддерживаем динамический, кэшированный, обновляемый белый список, основанный на следующих строгих критериях:

* Корневой домен отправителя должен быть из [расширение доменного имени, которое соответствует списку, который мы предлагаем в нашем бесплатном плане](#what-domain-name-extensions-can-be-used-for-free) (с добавлением `biz` и `info`). Мы также включаем частичные совпадения `edu`, `gov` и `mil`, такие как `xyz.gov.au` и `xyz.edu.au`.
* Корневой домен отправителя должен входить в число 100 000 лучших уникальных корневых доменов, проанализированных из [Список популярности зонтов](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") («UPL»).
* Корневой домен отправителя должен входить в число 50 000 лучших уникальных корневых доменов, появлявшихся как минимум 4 раза из последних 7 дней UPL (\~50%+).
* Корневой домен отправителя не должен быть [категоризированный](https://radar.cloudflare.com/categorization-feedback/), поскольку он содержит контент для взрослых или содержит вредоносное ПО от Cloudflare.
* Корневой домен отправителя должен иметь набор записей A или MX.
* Корневой домен отправителя должен иметь запись(и) A, запись(и) MX, запись DMARC с квалификатором `biz`0 или `biz`1 или запись SPF с квалификатором `biz`2 или `biz`3.

Если это условие выполнено, корневой домен отправителя будет кэширован на 7 дней. Обратите внимание, что наша автоматическая задача выполняется ежедневно, поэтому это кэш скользящего белого списка, который обновляется ежедневно.

Наша автоматизированная задача загрузит из памяти данные UPL за предыдущие 7 дней, разархивирует их, а затем проанализирует в памяти в соответствии со строгими критериями, указанными выше.

Разумеется, сюда включены такие популярные на момент написания статьи домены, как Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify и другие.

Если вы не входите в наш разрешённый список, то при первой отправке письма с вашего корневого домена FQDN или IP-адреса вы будете иметь статус [ставка ограничена](#do-you-have-rate-limiting) и [в сером списке](#do-you-have-a-greylist). Обратите внимание, что это стандартная практика, принятая в качестве стандарта электронной почты. Большинство клиентов почтовых серверов попытаются повторить попытку, если получат сообщение об ограничении скорости или ошибке серого списка (например, код ошибки уровня 421 или 4xx).

**Обратите внимание, что определенные отправители, такие как `a@gmail.com`, `b@xyz.edu` и `c@gov.au`, по-прежнему могут быть [запрещенный](#do-you-have-a-denylist)** (например, если мы автоматически обнаруживаем спам, фишинг или вредоносное ПО от этих отправителей).

### Какие расширения доменных имен можно использовать бесплатно {#what-domain-name-extensions-can-be-used-for-free}

С 31 марта 2023 года мы ввели новое общее правило борьбы со спамом для защиты наших пользователей и сервиса.

Это новое правило позволяет использовать в нашем бесплатном плане только следующие расширения доменных имен:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">в</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">быть</code></li>
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
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
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
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### У вас есть серый список {#do-you-have-a-greylist}

Да, у нас очень мягкая политика [серый список электронной почты](https://en.wikipedia.org/wiki/Greylisting_\(email\). Серые списки применяются только к отправителям, не входящим в наш разрешённый список, и хранятся в нашем кэше в течение 30 дней.

Для каждого нового отправителя мы храним ключ в нашей базе данных Redis в течение 30 дней, используя значение, равное времени получения первого запроса. Затем мы отклоняем письмо с кодом статуса повторной попытки 450 и разрешаем отправку только по истечении 5 минут.

Если они успешно подождали 5 минут с момента первоначального прибытия, то их электронные письма будут приняты, и они не получат этот код статуса 450.

Ключ состоит либо из полного доменного имени корневого домена, либо из IP-адреса отправителя. Это означает, что любой поддомен, прошедший проверку по серому списку, также будет считаться корневым доменом, и наоборот (именно это мы и подразумеваем под «очень мягкой» политикой).

Например, если письмо приходит с адреса `test.example.com` до того, как мы увидим письмо с адреса `example.com`, то любое письмо с адреса `test.example.com` и/или `example.com` будет ожидать 5 минут с момента первоначального подключения. Мы не заставляем адреса `test.example.com` и `example.com` ждать по отдельности каждый по 5 минут (наша политика серых списков применяется на уровне корневого домена).

Обратите внимание, что серый список не применяется ни к одному отправителю в нашем [белый список](#do-you-have-an-allowlist) (например, Meta, Amazon, Netflix, Google, Microsoft на момент написания этой статьи).

### У вас есть черный список {#do-you-have-a-denylist}

Да, мы ведём собственный чёрный список и обновляем его автоматически в режиме реального времени и вручную на основе обнаруженного спама и вредоносной активности.

Мы также извлекаем все IP-адреса из черного списка UCEPROTECT уровня 1 по адресу <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> каждый час и помещаем их в наш черный список со сроком действия 7 дней.

Отправители, обнаруженные в черном списке, получат код ошибки 421 (указывающий отправителю на необходимость повторить попытку позже), если они [не включены в разрешенный список](#do-you-have-an-allowlist).

Используя код статуса 421 вместо кода статуса 554, можно снизить вероятность ложных срабатываний в режиме реального времени, а затем сообщение может быть успешно доставлено при следующей попытке.

**Это отличается от других почтовых сервисов**, где при попадании в чёрный список происходит серьёзная и постоянная ошибка. Часто бывает сложно попросить отправителей повторить попытку отправки сообщений (особенно из крупных организаций), поэтому такой подход даёт отправителю, получателю или нам примерно 5 дней с момента первой попытки отправки письма, чтобы вмешаться и устранить проблему (попросив удалить из чёрного списка).

Все запросы на удаление из черного списка отслеживаются администраторами в режиме реального времени (например, для того, чтобы администраторы могли навсегда вносить в белый список повторяющиеся ложные срабатывания).

Запросы на удаление из черного списка можно подать по адресу <https://forwardemail.net/denylist>.. Запросы на удаление из черного списка платных пользователей обрабатываются мгновенно, в то время как пользователям без оплаты приходится ждать, пока администраторы обработают их запрос.

Отправители, у которых обнаружено спам или вирусный контент, будут добавлены в черный список следующим образом:

1. [исходный отпечаток сообщения](#how-do-you-determine-an-email-fingerprint) добавляется в серый список при обнаружении спама или в черный список от «доверенного» отправителя (например, `gmail.com`, `microsoft.com`, `apple.com`).
* Если отправитель был в белом списке, сообщение добавляется в серый список на 1 час.
* Если отправитель не в белом списке, сообщение добавляется в серый список на 6 часов.
2. Мы анализируем ключи списка запрещённых сообщений из информации об отправителе и сообщении, и для каждого из этих ключей создаём (если он ещё не существует) счётчик, увеличиваем его на 1 и кэшируем на 24 часа.
* Для отправителей из белого списка:
* Добавляем ключ для адреса электронной почты конверта «MAIL FROM», если он прошёл SPF или не прошёл SPF, и это не [имя пользователя почтмейстера](#what-are-postmaster-addresses) или [имя пользователя без ответа](#what-are-no-reply-addresses).
* Если заголовок «From» был внесён в разрешённый список, добавьте ключ для адреса электронной почты из заголовка «From», если он прошёл SPF или прошёл и выровнен DKIM.
* Если заголовок «From» не был внесён в разрешённый список, добавьте ключ для адреса электронной почты из заголовка «From» и его корневого доменного имени после разбора.
* Для отправителей, не внесённых в разрешённый список:
* Добавьте ключ для адреса электронной почты из конверта «MAIL FROM», если он прошёл SPF.
* Если заголовок «From» был внесён в разрешённый список, добавьте ключ для адреса электронной почты из заголовка «From», если он прошёл SPF или прошёл и выровнен DKIM.
* Если заголовок «From» не был внесён в разрешённый список, добавьте ключ для адреса электронной почты из заголовка «From» и его корневого доменного имени после разбора.
* Добавьте ключ для удалённого IP-адреса отправителя.
* Добавьте ключ для имени хоста клиента, определённого путём обратного поиска по IP-адресу отправителя (если есть).
* Добавьте ключ для корневого домена для разрешенного имени хоста клиента (если таковое имеется и отличается от разрешенного имени хоста клиента).

3. Если счетчик достигает 5 для отправителя и ключа, не входящих в разрешённый список, мы добавляем ключ в список запрещенных на 30 дней и отправляем электронное письмо в нашу службу по борьбе с нарушениями. Эти цифры могут измениться, и обновления будут отображаться здесь по мере того, как мы отслеживаем нарушения.

4. Если счетчик достигает 10 для отправителя и ключа, входящих в разрешённый список, мы добавляем ключ в список запрещенных на 7 дней и отправляем электронное письмо в нашу службу по борьбе с нарушениями. Эти цифры могут измениться, и обновления будут отображаться здесь по мере того, как мы отслеживаем нарушения.

> **ПРИМЕЧАНИЕ:** В ближайшем будущем мы введём мониторинг репутации. Вместо этого он будет рассчитывать, когда отправителя следует добавить в чёрный список, на основе процентного порога (в отличие от элементарного счётчика, как было отмечено выше).

### У вас есть ограничение скорости {#do-you-have-rate-limiting}

Ограничение скорости отправки пакетов осуществляется либо по корневому домену, полученному в результате обратного поиска PTR по IP-адресу отправителя, либо, если это не даёт результата, просто по IP-адресу отправителя. Обратите внимание, что ниже мы обозначаем это как `Sender`.

На наших серверах MX установлены ежедневные лимиты на входящую почту, полученную для [зашифрованное хранилище IMAP](/blog/docs/best-quantum-safe-encrypted-email-service):

* Вместо ограничения скорости входящей почты, получаемой по отдельным псевдонимам (например, `you@yourdomain.com`), мы ограничиваем скорость по самому доменному имени псевдонима (например, `yourdomain.com`). Это предотвращает переполнение `Senders` почтовых ящиков всех псевдонимов вашего домена одновременно.

* У нас есть общие ограничения, которые применяются ко всем `Senders` в нашем сервисе независимо от получателя:

Темпы `Senders`, которые мы считаем «доверенными» источниками информации (например, `gmail.com`, `microsoft.com`, `apple.com`), ограничены отправкой 100 ГБ в день.
* `Senders`, относящиеся к [в разрешенном списке](#do-you-have-an-allowlist), ограничены отправкой 10 ГБ в день.
* Все остальные `yourdomain.com`0 ограничены отправкой 1 ГБ и/или 1000 сообщений в день.
* Для `yourdomain.com`1 и `yourdomain.com`2 установлено ограничение в 1 ГБ и/или 1000 сообщений в день.

Серверы MX также ограничивают пересылку сообщений одному или нескольким получателям с помощью ограничения скорости, но это применяется только к `Senders`, а не к [белый список](#do-you-have-an-allowlist):

* Мы разрешаем не более 100 подключений в час на каждый корневой домен с полным доменным именем `Sender` (или на удалённый IP-адрес `Sender` (если обратный PTR недоступен) и на каждого получателя конверта. Мы храним ключ ограничения скорости в виде криптографического хеша в нашей базе данных Redis.

* Если вы отправляете электронную почту через нашу систему, убедитесь, что у вас настроен обратный PTR для всех ваших IP-адресов (в противном случае каждый уникальный корневой домен FQDN или IP-адрес, с которого вы отправляете почту, будет ограничен по скорости).

* Обратите внимание, что если вы отправляете платежи через популярную систему, например, Amazon SES, то вы не будете ограничены в скорости, поскольку (на момент написания этой статьи) Amazon SES указана в нашем разрешенном списке.

* Если вы отправляете почту с домена, например, `test.abc.123.example.com`, ограничение скорости будет применено к `example.com`. Многие спамеры используют сотни поддоменов, чтобы обойти распространённые спам-фильтры, которые ограничивают скорость только для уникальных имён хостов, а не для уникальных корневых доменов с полными доменными именами (FQDN).

* `Senders`, превышающие ограничение по скорости, будут отклонены с ошибкой 421.

Наши серверы IMAP и SMTP ограничивают количество одновременных подключений к вашим псевдонимам более `60`.

Наши MX-серверы ограничивают отправителей [не входящий в список разрешенных](#do-you-have-an-allowlist) от установления более 10 одновременных подключений (с истечением срока действия кэша для счетчика в 3 минуты, что отражает время ожидания нашего сокета в 3 минуты).

### Как защититься от обратного рассеяния {#how-do-you-protect-against-backscatter}

Неправильно направленные сообщения о недоставке или спам о недоставке (известные как «[Обратное рассеяние](https://en.wikipedia.org/wiki/Backscatter_\(email\)») могут привести к негативной репутации IP-адресов отправителей.

Для защиты от обратного рассеяния мы предпринимаем два шага, которые подробно описаны в разделах [Предотвращайте возвраты писем от известных спамеров MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) и [Предотвращайте ненужные отражения для защиты от обратного рассеяния](#prevent-unnecessary-bounces-to-protect-against-backscatter) ниже.

### Предотвращать возвраты сообщений от известных спамеров MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Мы извлекаем список из [Backscatter.org](https://www.backscatterer.org/) (на основе [UCEPROTECT](https://www.uceprotect.net/)) в <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> каждый час и передаем его в нашу базу данных Redis (мы также заранее сравниваем разницу; на случай, если какие-либо IP-адреса были удалены и их необходимо учитывать).

Если поле MAIL FROM пусто ИЛИ равно (без учета регистра) любому из [адреса почтмейстеров](#what-are-postmaster-addresses) (часть перед @ в электронной почте), то мы проверяем, совпадает ли IP-адрес отправителя с одним из этого списка.

Если IP-адрес отправителя указан в списке (и отсутствует в нашем списке [белый список](#do-you-have-an-allowlist)), мы отправляем ошибку 554 с сообщением `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Мы получим уведомление, если отправитель есть и в списке Backscatterer, и в нашем списке разрешенных адресов, чтобы мы могли решить проблему при необходимости.

Методы, описанные в этом разделе, соответствуют рекомендации «БЕЗОПАСНЫЙ РЕЖИМ» в <https://www.backscatterer.org/?target=usage>, где мы проверяем IP-адрес отправителя только в том случае, если определенные условия уже выполнены.

### Предотвращает ненужные отскоки для защиты от обратного рассеяния {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Возвраты — это электронные письма, которые указывают на то, что пересылка письма получателю полностью не удалась, и повторная попытка отправки письма не будет выполнена.

Распространенной причиной попадания в список Backscatterer являются неверно направленные возвраты или спам-возвраты, поэтому мы должны защититься от этого несколькими способами:

1. Мы отправляем письма только в случае возникновения ошибок с кодом статуса >= 500 (когда попытки переслать письма не увенчались успехом, например, Gmail отвечает ошибкой уровня 500).

2. Мы отправляем письма только один раз (мы используем рассчитанный ключ отпечатка возврата и храним его в кэше, чтобы предотвратить отправку дубликатов). Отпечаток возврата — это ключ, представляющий собой отпечаток сообщения, совмещённый с хэшем адреса возврата и его кода ошибки. Подробнее о том, как рассчитывается отпечаток сообщения, см. в разделе о [Дактилоскопирование](#how-do-you-determine-an-email-fingerprint). Успешно отправленные отпечатки возврата удаляются из кэша Redis через 7 дней.

3. Мы отправляем сообщения только в том случае, если поля MAIL FROM и/или From не пустые и не содержат (без учета регистра) [имя пользователя почтмейстера](#what-are-postmaster-addresses) (часть перед @ в письме).

4. Мы не отправляем сообщение, если исходное сообщение имело любой из следующих заголовков (без учета регистра):

* Заголовок `auto-submitted` со значением, не равным `no`.
* Заголовок `x-auto-response-suppress` со значением `dr`, `autoreply`, `auto-reply`, `auto_reply` или `all`
* Заголовок `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 или `no`7 (независимо от значения).
* Заголовок `no`8 со значением `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 или `x-auto-response-suppress`3.

5. Мы не отправляем письма, если адрес электронной почты MAIL FROM или From заканчивается на `+donotreply`, `-donotreply`, `+noreply` или `-noreply`.

6. Мы не отправляем сообщение, если часть имени пользователя в поле «От» адреса электронной почты была `mdaemon` и имела нечувствительный к регистру заголовок `X-MDDSN-Message`.

7. Мы не отправляем данные, если в `multipart/report` присутствует нечувствительный к регистру заголовок `content-type`.

### Как определить отпечаток электронной почты {#how-do-you-determine-an-email-fingerprint}

Отпечаток адреса электронной почты используется для определения его уникальности и предотвращения отправки дубликатов сообщений и [дублирующие отскоки](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Отпечаток пальца рассчитывается на основе следующего списка:

* Полное доменное имя хоста или IP-адрес клиента
* Значение заголовка `Message-ID` (если есть)
* Значение заголовка `Date` (если есть)
* Значение заголовка `From` (если есть)
* Значение заголовка `To` (если есть)
* Значение заголовка `Cc` (если есть)
* Значение заголовка `Subject` (если есть)
* Значение заголовка `Body` (если есть)

### Могу ли я пересылать электронные письма на порты, отличные от 25 (например, если мой интернет-провайдер заблокировал порт 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Да, мы добавили эту функцию 5 мая 2020 года. Сейчас она привязана к домену, а не к псевдониму. Если вам требуется, чтобы она была привязана к псевдониму, пожалуйста, свяжитесь с нами и сообщите о ваших потребностях.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Улучшенная защита конфиденциальности:
</strong>
<span>
Если у вас платный тарифный план (с улучшенной защитой конфиденциальности), перейдите в раздел <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учетная запись <i class="fa fa-angle-right"></i> Домены</a>, нажмите «Настройка» рядом с вашим доменом, а затем нажмите «Настройки». Подробнее о платных тарифных планах см. на странице <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Цены</a>. В противном случае продолжайте следовать инструкциям ниже. </span>
</div>

Если вы используете бесплатный план, просто добавьте новую запись DNS <strong class="notranslate">TXT</strong>, как показано ниже, но измените порт с 25 на порт по вашему выбору.

Например, если я хочу, чтобы все письма, отправляемые в `example.com`, пересылались на SMTP-порт псевдонима получателя 1337 вместо 25:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
Наиболее распространенный сценарий настройки переадресации портов — это когда вы хотите пересылать все письма, отправляемые на example.com, на другой порт example.com, отличный от стандартного порта SMTP 25. Для настройки просто добавьте следующую запись для перехвата всей почты домена <strong class="notranslate">TXT</strong>.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Поддерживает ли он символ «плюс +» для псевдонимов Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Да, конечно.

### Поддерживает ли он поддомены {#does-it-support-sub-domains}

Да, конечно. Вместо использования «@», «.» или пробела в качестве имени/хоста/псевдонима вы просто используете имя поддомена в качестве значения.

Если вы хотите, чтобы `foo.example.com` пересылал электронные письма, введите `foo` в качестве значения имени/хоста/псевдонима в настройках DNS (для записей MX и <strong class="notranslate">TXT</strong>).

### Пересылает ли это заголовки моих писем {#does-this-forward-my-emails-headers}

Да, конечно.

### Это хорошо протестировано {#is-this-well-tested}

Да, в нем есть тесты, написанные с использованием [ава](https://github.com/avajs/ava), а также есть покрытие кода.

### Вы передаете ответные сообщения SMTP и коды {#do-you-pass-along-smtp-response-messages-and-codes}

Да, конечно. Например, если вы отправляете письмо на адрес `hello@example.com`, а оно пересылается на `user@gmail.com`, то вместо прокси-сервера mx1.forwardemail.net или mx2.forwardemail.net будет возвращено сообщение с ответом SMTP и кодом от SMTP-сервера gmail.com.

### Как защититься от спамеров и обеспечить хорошую репутацию пересылки электронной почты {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

См. наши разделы о [Как работает ваша система пересылки электронной почты?](#how-does-your-email-forwarding-system-work), [Как вы решаете проблемы с доставкой электронной почты?](#how-do-you-handle-email-delivery-issues) и [Как вы справляетесь с блокировкой своих IP-адресов?](#how-do-you-handle-your-ip-addresses-becoming-blocked) выше.

### Как выполнять DNS-поиск по доменным именам {#how-do-you-perform-dns-lookups-on-domain-names}

Мы создали проект с открытым исходным кодом :tangerine: [мандарин](https://github.com/forwardemail/tangerine) и используем его для DNS-запросов. DNS-серверы по умолчанию — `1.1.1.1` и `1.0.0.1`, а DNS-запросы выполняются через [DNS через HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) (DoH) на уровне приложения.

:tangerine: [мандарин](https://github.com/tangerine) по умолчанию использует [DNS-сервис CloudFlare, ориентированный на конфиденциальность и безопасность потребителей] [cloudflare-dns].

## Учетная запись и выставление счетов {#account-and-billing}

### Предоставляете ли вы гарантию возврата денег по платным тарифным планам {#do-you-offer-a-money-back-guarantee-on-paid-plans}?

Да! Автоматический возврат средств происходит при повышении, понижении или отмене подписки в течение 30 дней с момента начала действия вашего тарифного плана. Это относится только к новым клиентам.

### Если я поменяю тариф, вы пропорционально распределите расходы и вернете разницу {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Мы не производим пропорциональное перерасчёт и не возвращаем разницу при смене тарифа. Вместо этого мы конвертируем оставшийся срок действия вашего текущего тарифа в ближайший относительный срок действия вашего нового тарифа (округляя его до месяца в меньшую сторону).

Обратите внимание: если вы повысите или понизите тарифный план в течение 30 дней с момента начала действия платного плана, мы автоматически вернем вам полную сумму с вашего текущего плана.

### Могу ли я использовать эту службу пересылки электронной почты как «запасной» или «резервный» MX-сервер {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Нет, это не рекомендуется, так как одновременно можно использовать только один почтовый сервер. Резервные серверы обычно не используются повторно из-за неправильной настройки приоритетов и несоблюдения почтовыми серверами проверки приоритета обмена MX.

### Можно ли отключить определенные псевдонимы {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если у вас платный тариф, перейдите в раздел <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Моя учётная запись <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы <i class="fa fa-angle-right"></i> Изменить псевдоним <i class="fa fa-angle-right"></i> Снимите флажок «Активно» <i class="fa fa-angle-right"></i> Продолжить.
</span>
</div>

Да, просто отредактируйте свою запись DNS <strong class="notranslate">TXT</strong> и добавьте к псевдониму один, два или три восклицательных знака (см. ниже).

Обратите внимание, что вам *следует* сохранить сопоставление «:», так как оно потребуется, если вы когда-нибудь решите отключить эту функцию (а также оно используется для импорта, если вы перейдете на один из наших платных планов).

**Для тихого отклонения (отправителю кажется, что сообщение было успешно отправлено, но на самом деле оно никуда не отправляется) (код статуса `250`):** Если вы добавите к псевдониму префикс "!" (один восклицательный знак), то отправителям, пытающимся отправить письмо на этот адрес, будет возвращен код успешного состояния `250`, но сами письма никуда не отправятся (например, в черную дыру или `/dev/null`).

**Для мягкого отклонения (код состояния `421`):** Если вы добавите к псевдониму префикс «!!» (двойной восклицательный знак), то отправителям, пытающимся отправить письмо на этот адрес, будет возвращен код состояния мягкой ошибки `421`, а электронные письма часто будут отправляться повторно в течение 5 дней, прежде чем будут отклонены и возвращены.

**Для жесткого отклонения (код статуса `550`):** Если вы добавите к псевдониму префикс «!!!» (три восклицательных знака), то отправителям, пытающимся отправить письмо на этот адрес, будет возвращен постоянный код статуса ошибки `550`, а электронные письма будут отклонены и возвращены.

Например, если я хочу, чтобы все письма, отправляемые на адрес `alias@example.com`, перестали поступать на адрес `user@gmail.com` и были отклонены и возвращены (например, используйте три восклицательных знака):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Вы также можете изменить адрес получателя пересылки на "nobody@forwardemail.net", и письмо будет перенаправлено пользователю nobody, как в примере ниже.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Для повышения безопасности можно также удалить часть ":user@gmail.com" (или ":nobody@forwardemail.net"), оставив только "!!!alias", как в примере ниже.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Могу ли я пересылать электронные письма нескольким получателям {#can-i-forward-emails-to-multiple-recipients}

Да, конечно. Просто укажите несколько получателей в записях <strong class="notranslate">TXT</strong>.

Например, если я хочу, чтобы электронное письмо, отправленное на адрес `hello@example.com`, было переслано на адреса `user+a@gmail.com` и `user+b@gmail.com`, то моя запись <strong class="notranslate">TXT</strong> будет выглядеть следующим образом:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Или вы можете указать их в двух отдельных строках, например так:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Тебе решать!

### Можно ли иметь несколько глобальных получателей для сбора всей почты {#can-i-have-multiple-global-catch-all-recipients}

Да, можете. Просто укажите несколько глобальных получателей для всех сообщений в записях <strong class="notranslate">TXT</strong>.

Например, если я хочу, чтобы каждое письмо, отправляемое на адрес `*@example.com` (звездочка означает, что это подстановочный знак, то есть пересылка всех сообщений), пересылалось на адреса `user+a@gmail.com` и `user+b@gmail.com`, то моя запись <strong class="notranslate">TXT</strong> будет выглядеть следующим образом:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Или вы можете указать их в двух отдельных строках, например так:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Имя/Хост/Псевдоним</th>
<th class="text-center">TTL</th>
<th>Тип</th>
<th>Ответ/Значение</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", или пусто</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Тебе решать!

### Существует ли максимальное ограничение на количество адресов электронной почты, на которые я могу пересылать сообщения для одного псевдонима {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}?

Да, ограничение по умолчанию — 10. Это НЕ означает, что у вас может быть только 10 псевдонимов для вашего доменного имени. Вы можете создать любое количество псевдонимов (количество не ограничено). Это означает, что вы можете пересылать письма только с одного псевдонима на 10 уникальных адресов электронной почты. Например, у вас могут быть `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (от 1 до 10), а все письма на `hello@example.com` будут пересылаться на `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (от 1 до 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Совет:
</strong>
<span>
Нужно больше 10 получателей на один псевдоним? Напишите нам, и мы с радостью увеличим лимит для ваших аккаунтов.
</span>
</div>

### Могу ли я рекурсивно пересылать письма {#can-i-recursively-forward-emails}

Да, можно, но необходимо соблюдать максимальный лимит. Если у вас есть `hello:linus@example.com` и `linus:user@gmail.com`, то письма на `hello@example.com` будут пересылаться на `linus@example.com` и `user@gmail.com`. Обратите внимание, что при попытке рекурсивной пересылки писем сверх максимального лимита возникнет ошибка.

### Могут ли люди отменить или зарегистрировать мою пересылку электронной почты без моего разрешения {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Мы используем проверку записей MX и <strong class="notranslate">TXT</strong>, поэтому, если вы добавите соответствующие записи MX и <strong class="notranslate">TXT</strong> этого сервиса, вы будете зарегистрированы. Если вы их удалите, ваша регистрация будет отменена. Вы владеете своим доменом и управляете DNS, поэтому, если кто-то имеет к ним доступ, это проблема.

### Как это бесплатно {#how-is-it-free}

Forward Email предлагает бесплатный уровень благодаря сочетанию разработки с открытым исходным кодом, эффективной инфраструктуры и дополнительных платных планов, поддерживающих сервис.

Наш бесплатный уровень поддерживается:

1. **Разработка с открытым исходным кодом**: наша кодовая база имеет открытый исходный код, что позволяет сообществу вносить свой вклад и обеспечивает прозрачность работы.

2. **Эффективная инфраструктура**: мы оптимизировали наши системы для обработки пересылки электронной почты с минимальными ресурсами.

3. **Платные премиум-планы**: Пользователи, которым нужны дополнительные функции, такие как отправка SMTP, получение IMAP или расширенные параметры конфиденциальности, подписываются на наши платные планы.

4. **Разумные ограничения использования**: на бесплатном уровне действуют политики справедливого использования, предотвращающие злоупотребления.

> \[!NOTE]
> Мы стремимся сохранить базовую пересылку электронной почты бесплатной, предлагая при этом премиум-функции для пользователей с более продвинутыми потребностями.

> \[!TIP]
> Если вы считаете наш сервис полезным, рассмотрите возможность перехода на платный тариф для поддержки дальнейшей разработки и поддержки.

### Каков максимальный размер электронного письма {#what-is-the-max-email-size-limit}

По умолчанию мы устанавливаем ограничение на размер в 50 МБ, включая содержимое, заголовки и вложения. Обратите внимание, что такие сервисы, как Gmail и Outlook, допускают ограничение только в 25 МБ, и если вы превысите это ограничение при отправке на адреса этих провайдеров, вы получите сообщение об ошибке.

Если превышен предельный размер файла, возвращается ошибка с соответствующим кодом ответа.

### Вы храните журналы электронных писем {#do-you-store-logs-of-emails}

Нет, мы не записываем на диск и не храним логи – с помощью [исключение ошибок](#do-you-store-error-logs) и [исходящий SMTP](#do-you-support-sending-email-with-smtp) (см. наш [политика конфиденциальности](/privacy)).

Все делается в памяти и [наш исходный код находится на GitHub](https://github.com/forwardemail).

### Вы храните журналы ошибок {#do-you-store-error-logs}

**Да. Вы можете получить доступ к журналам ошибок в каталоге [Моя учетная запись → Журналы](/my-account/logs) или [Мой аккаунт → Домены](/my-account/domains).**

По состоянию на февраль 2023 года мы храним журналы ошибок для кодов ответа SMTP `4xx` и `5xx` в течение 7 дней, которые содержат ошибку SMTP, конверт и заголовки электронной почты (мы **не** храним тело электронной почты и вложения).

Журналы ошибок позволяют проверять наличие пропущенных важных писем и минимизировать количество ложных срабатываний спама для [ваши домены](/my-account/domains). Они также являются отличным ресурсом для отладки проблем с [веб-перехваты электронной почты](#do-you-support-webhooks) (поскольку журналы ошибок содержат ответ конечной точки веб-перехвата).

Журналы ошибок для [ограничение скорости](#do-you-have-rate-limiting) и [серый список](#do-you-have-a-greylist) недоступны, поскольку соединение завершается преждевременно (например, до того, как могут быть переданы команды `RCPT TO` и `MAIL FROM`).

Более подробную информацию смотрите в разделе [политика конфиденциальности](/privacy).

### Вы читаете мои письма {#do-you-read-my-emails}

Нет, конечно. См. наш [политика конфиденциальности](/privacy).

Многие другие сервисы пересылки электронной почты хранят и потенциально могут прочитать ваши письма. Нет причин хранить пересланные письма на диске, поэтому мы разработали первое решение с открытым исходным кодом, которое делает всё это в оперативной памяти.

Мы считаем, что у вас должно быть право на конфиденциальность, и строго соблюдаем его. Код, размещённый на сервере, имеет статус [программное обеспечение с открытым исходным кодом на GitHub](https://github.com/forwardemail) для прозрачности и укрепления доверия.

### Могу ли я «отправлять почту как» в Gmail с помощью {#can-i-send-mail-as-in-gmail-with-this}

Да! Мы добавили эту функцию 2 октября 2018 года. См. [Как отправлять почту с помощью Gmail](#how-to-send-mail-as-using-gmail) выше!

Вам также следует настроить запись SPF для Gmail в записи <strong class="notranslate">TXT</strong> вашей конфигурации DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете Gmail (например, «Отправить письмо как») или G Suite, вам необходимо добавить <code>include:_spf.google.com</code> к вашей записи SPF <strong class="notranslate">TXT</strong>, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Могу ли я «отправить почту как» в Outlook с помощью {#can-i-send-mail-as-in-outlook-with-this}

Да! Мы добавили эту функцию 2 октября 2018 года. Просто перейдите по этим двум ссылкам от Microsoft ниже:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Вам также следует настроить запись SPF для Outlook в записи <strong class="notranslate">TXT</strong> вашей конфигурации DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Важно:
</strong>
<span>
Если вы используете Microsoft Outlook или Live.com, вам необходимо добавить <code>include:spf.protection.outlook.com</code> к вашей <strong class="notranslate">TXT</strong> записи SPF, например:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Могу ли я «отправлять почту как» в Apple Mail и iCloud Mail с помощью этого {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Если вы являетесь подписчиком iCloud+, вы можете использовать пользовательский домен. [Наш сервис также совместим с Apple Mail.](#apple-mail).

Более подробную информацию см. в разделе <https://support.apple.com/en-us/102540>.

### Могу ли я пересылать неограниченное количество писем с помощью этого {#can-i-forward-unlimited-emails-with-this}?

Да, однако для «относительно неизвестных» отправителей скорость ограничена 100 соединениями в час на одно имя хоста или IP-адрес. См. раздел о [Ограничение скорости](#do-you-have-rate-limiting) и [Серый список](#do-you-have-a-greylist) выше.

Под «относительно неизвестными» мы подразумеваем отправителей, которые не отображаются в [белый список](#do-you-have-an-allowlist).

Если этот лимит превышен, мы отправляем код ответа 421, который сообщает почтовому серверу отправителя о необходимости повторить попытку позже.

### Вы предлагаете неограниченное количество доменов по одной цене {#do-you-offer-unlimited-domains-for-one-price}

Да. Независимо от выбранного вами тарифа, вы будете платить только один ежемесячный тариф, который распространяется на все ваши домены.

### Какие способы оплаты вы принимаете {#which-payment-methods-do-you-accept}

Forward Email принимает следующие способы оплаты: единовременные или ежемесячные/ежеквартальные/ежегодные:

1. **Кредитные/дебетовые карты/банковские переводы**: Visa, Mastercard, American Express, Discover, JCB, Diners Club и др.
2. **PayPal**: Подключите свой счёт PayPal для лёгких платежей.
3. **Криптовалюта**: Мы принимаем платежи через стейблкоины Stripe в сетях Ethereum, Polygon и Solana.

> \[!NOTE]
> Мы храним ограниченную платежную информацию на наших серверах, которая включает только идентификаторы платежей и ссылки на идентификаторы транзакций, клиентов, подписок и платежей [Полоса](https://stripe.com/global) и [PayPal](https://www.paypal.com).

> \[!TIP]
> Для максимальной конфиденциальности рассмотрите возможность использования криптовалютных платежей.

Все платежи обрабатываются безопасно через Stripe или PayPal. Ваши платёжные данные никогда не хранятся на наших серверах.

## Дополнительные ресурсы {#additional-resources}

> \[!TIP]
> Наши статьи, представленные ниже, регулярно обновляются новыми руководствами, советами и технической информацией. Заглядывайте почаще, чтобы быть в курсе последних новостей.

* [Примеры использования и документация для разработчиков](/blog/docs)
* [Ресурсы](/resources)
* [Гиды](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/