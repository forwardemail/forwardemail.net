# Часто задаваемые вопросы {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Часто задаваемые вопросы Forward Email" class="rounded-lg" />


## Содержание {#table-of-contents}

* [Быстрый старт](#quick-start)
* [Введение](#introduction)
  * [Что такое Forward Email](#what-is-forward-email)
  * [Кто использует Forward Email](#who-uses-forward-email)
  * [История Forward Email](#what-is-forward-emails-history)
  * [Насколько быстро работает этот сервис](#how-fast-is-this-service)
* [Почтовые клиенты](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Мобильные устройства](#mobile-devices)
  * [Конфигурация Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Конфигурация Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Конфигурация msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [Почтовые клиенты командной строки](#command-line-email-clients)
  * [Конфигурация почты в Windows](#windows-email-configuration)
  * [Конфигурация Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Как отправлять почту от имени с помощью Gmail](#how-to-send-mail-as-using-gmail)
  * [Что такое устаревшее бесплатное руководство по Send Mail As с Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Расширенная конфигурация маршрутизации Gmail](#advanced-gmail-routing-configuration)
  * [Расширенная конфигурация маршрутизации Outlook](#advanced-outlook-routing-configuration)
* [Устранение неполадок](#troubleshooting)
  * [Почему я не получаю тестовые письма](#why-am-i-not-receiving-my-test-emails)
  * [Как настроить почтовый клиент для работы с Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Почему мои письма попадают в Спам и как проверить репутацию домена](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Что делать, если я получаю спам](#what-should-i-do-if-i-receive-spam-emails)
  * [Почему тестовые письма, отправленные самому себе в Gmail, отображаются как "подозрительные"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Можно ли убрать via forwardemail dot net в Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Управление данными](#data-management)
  * [Где расположены ваши серверы](#where-are-your-servers-located)
  * [Как экспортировать и создавать резервные копии почтового ящика](#how-do-i-export-and-backup-my-mailbox)
  * [Как импортировать и мигрировать существующий почтовый ящик](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Как использовать собственное хранилище, совместимое с S3, для резервных копий](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Как конвертировать резервные копии SQLite в файлы EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Поддерживаете ли вы самостоятельный хостинг](#do-you-support-self-hosting)
* [Конфигурация почты](#email-configuration)
  * [Как начать и настроить переадресацию почты](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Можно ли использовать несколько MX и серверов для расширенной переадресации](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Как настроить автоответчик на отпуск (автоматический ответ вне офиса)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Как настроить SPF для Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Как настроить DKIM для Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Как настроить DMARC для Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Как просматривать отчёты DMARC](#how-do-i-view-dmarc-reports)
  * [Как подключить и настроить контакты](#how-do-i-connect-and-configure-my-contacts)
  * [Как подключить и настроить календари](#how-do-i-connect-and-configure-my-calendars)
  * [Как добавить и управлять календарями](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Как подключить и настроить задачи и напоминания](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Почему нельзя создавать задачи в macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [Как настроить Tasks.org на Android](#how-do-i-set-up-tasksorg-on-android)
  * [Как настроить SRS для Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Как настроить MTA-STS для Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Как добавить фотографию профиля к адресу электронной почты](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Расширенные функции](#advanced-features)
  * [Поддерживаете ли вы рассылки или маркетинговые списки](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Поддерживаете ли вы отправку почты через API](#do-you-support-sending-email-with-api)
  * [Поддерживаете ли вы получение почты через IMAP](#do-you-support-receiving-email-with-imap)
  * [Поддерживаете ли вы POP3](#do-you-support-pop3)
  * [Поддерживаете ли вы календари (CalDAV)](#do-you-support-calendars-caldav)
  * [Поддерживаете ли вы задачи и напоминания (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Поддерживаете ли вы контакты (CardDAV)](#do-you-support-contacts-carddav)
  * [Поддерживаете ли вы отправку почты через SMTP](#do-you-support-sending-email-with-smtp)
  * [Поддерживаете ли вы OpenPGP/MIME, сквозное шифрование ("E2EE") и Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Поддерживаете ли вы шифрование S/MIME](#do-you-support-smime-encryption)
  * [Поддерживаете ли вы фильтрацию почты Sieve](#do-you-support-sieve-email-filtering)
  * [Поддерживаете ли вы MTA-STS](#do-you-support-mta-sts)
  * [Поддерживаете ли вы passkeys и WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Поддерживаете ли вы лучшие практики электронной почты](#do-you-support-email-best-practices)
  * [Поддерживаете ли вы bounce webhooks](#do-you-support-bounce-webhooks)
  * [Поддерживаете ли вы webhooks](#do-you-support-webhooks)
  * [Поддерживаете ли вы регулярные выражения или regex](#do-you-support-regular-expressions-or-regex)
  * [Каковы ваши ограничения на исходящую SMTP](#what-are-your-outbound-smtp-limits)
  * [Нужно ли одобрение для включения SMTP](#do-i-need-approval-to-enable-smtp)
  * [Каковы настройки конфигурации вашего SMTP сервера](#what-are-your-smtp-server-configuration-settings)
  * [Каковы настройки конфигурации вашего IMAP сервера](#what-are-your-imap-server-configuration-settings)
  * [Каковы настройки конфигурации вашего POP3 сервера](#what-are-your-pop3-server-configuration-settings)
  * [Как настроить автодискавери почты для моего домена](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Безопасность](#security-1)
  * [Расширенные методы защиты сервера](#advanced-server-hardening-techniques)
  * [Есть ли у вас сертификаты SOC 2 или ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Используете ли вы TLS шифрование для переадресации почты](#do-you-use-tls-encryption-for-email-forwarding)
  * [Сохраняете ли вы заголовки аутентификации почты](#do-you-preserve-email-authentication-headers)
  * [Сохраняете ли вы оригинальные заголовки почты и предотвращаете подделку](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Как вы защищаетесь от спама и злоупотреблений](#how-do-you-protect-against-spam-and-abuse)
  * [Храните ли вы содержимое писем на диске](#do-you-store-email-content-on-disk)
  * [Может ли содержимое писем быть раскрыто при сбоях системы](#can-email-content-be-exposed-during-system-crashes)
  * [Кто имеет доступ к вашей почтовой инфраструктуре](#who-has-access-to-your-email-infrastructure)
  * [Каких провайдеров инфраструктуры вы используете](#what-infrastructure-providers-do-you-use)
  * [Предлагаете ли вы соглашение об обработке данных (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Как вы обрабатываете уведомления о нарушениях данных](#how-do-you-handle-data-breach-notifications)
  * [Предлагаете ли вы тестовую среду](#do-you-offer-a-test-environment)
  * [Предоставляете ли вы инструменты мониторинга и оповещений](#do-you-provide-monitoring-and-alerting-tools)
  * [Как вы обеспечиваете высокую доступность](#how-do-you-ensure-high-availability)
  * [Соответствуете ли вы разделу 889 Закона о национальной обороне (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Системные и технические детали](#system-and-technical-details)
  * [Храните ли вы письма и их содержимое](#do-you-store-emails-and-their-contents)
  * [Как работает ваша система переадресации почты](#how-does-your-email-forwarding-system-work)
  * [Как вы обрабатываете письмо для переадресации](#how-do-you-process-an-email-for-forwarding)
  * [Как вы решаете проблемы доставки почты](#how-do-you-handle-email-delivery-issues)
  * [Как вы справляетесь с блокировкой ваших IP-адресов](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Что такое адреса postmaster](#what-are-postmaster-addresses)
  * [Что такое адреса no-reply](#what-are-no-reply-addresses)
  * [Какие IP-адреса у ваших серверов](#what-are-your-servers-ip-addresses)
  * [Есть ли у вас белый список](#do-you-have-an-allowlist)
  * [Какие доменные расширения по умолчанию в белом списке](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Каковы критерии вашего белого списка](#what-is-your-allowlist-criteria)
  * [Какие доменные расширения можно использовать бесплатно](#what-domain-name-extensions-can-be-used-for-free)
  * [Есть ли у вас серый список](#do-you-have-a-greylist)
  * [Есть ли у вас черный список](#do-you-have-a-denylist)
  * [Есть ли у вас ограничение скорости](#do-you-have-rate-limiting)
  * [Как вы защищаетесь от обратного рассыпания (backscatter)](#how-do-you-protect-against-backscatter)
  * [Предотвращение bounce от известных спамеров MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Предотвращение ненужных bounce для защиты от backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Как вы определяете отпечаток письма](#how-do-you-determine-an-email-fingerprint)
  * [Можно ли переадресовывать письма на порты, отличные от 25 (например, если мой ISP заблокировал порт 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Поддерживается ли символ плюс + для алиасов Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Поддерживаются ли поддомены](#does-it-support-sub-domains)
  * [Пересылаются ли заголовки моих писем](#does-this-forward-my-emails-headers)
  * [Насколько это хорошо протестировано](#is-this-well-tested)
  * [Передаете ли вы SMTP ответы и коды](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Как вы предотвращаете спамеров и обеспечиваете хорошую репутацию переадресации](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Как вы выполняете DNS-запросы доменных имён](#how-do-you-perform-dns-lookups-on-domain-names)
* [Аккаунт и оплата](#account-and-billing)
  * [Предлагаете ли вы гарантию возврата денег на платных планах](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Если я меняю план, вы делаете пропорциональный возврат разницы](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Могу ли я использовать этот сервис переадресации как резервный MX сервер](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Могу ли я отключить конкретные алиасы](#can-i-disable-specific-aliases)
  * [Могу ли я переадресовывать письма нескольким получателям](#can-i-forward-emails-to-multiple-recipients)
  * [Могу ли я иметь несколько глобальных получателей catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Есть ли максимальное количество адресов для переадресации на один алиас](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Можно ли рекурсивно переадресовывать письма](#can-i-recursively-forward-emails)
  * [Могут ли люди отменять или регистрировать мою переадресацию без моего разрешения](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Почему это бесплатно](#how-is-it-free)
  * [Каков максимальный размер письма](#what-is-the-max-email-size-limit)
  * [Храните ли вы логи писем](#do-you-store-logs-of-emails)
  * [Храните ли вы логи ошибок](#do-you-store-error-logs)
  * [Читаете ли вы мои письма](#do-you-read-my-emails)
  * [Могу ли я отправлять почту от имени в Gmail с этим](#can-i-send-mail-as-in-gmail-with-this)
  * [Могу ли я отправлять почту от имени в Outlook с этим](#can-i-send-mail-as-in-outlook-with-this)
  * [Могу ли я отправлять почту от имени в Apple Mail и iCloud Mail с этим](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Могу ли я переадресовывать неограниченное количество писем с этим](#can-i-forward-unlimited-emails-with-this)
  * [Предлагаете ли вы неограниченное количество доменов за одну цену](#do-you-offer-unlimited-domains-for-one-price)
  * [Какие способы оплаты вы принимаете](#which-payment-methods-do-you-accept)
* [Дополнительные ресурсы](#additional-resources)
## Быстрый старт {#quick-start}

Чтобы начать работу с Forward Email:

1. **Создайте аккаунт** на [forwardemail.net/register](https://forwardemail.net/register)

2. **Добавьте и подтвердите свой домен** в разделе [Мой аккаунт → Домены](/my-account/domains)

3. **Добавьте и настройте почтовые псевдонимы/почтовые ящики** в разделе [Мой аккаунт → Домены](/my-account/domains) → Псевдонимы

4. **Проверьте настройку**, отправив письмо на один из ваших новых псевдонимов

> \[!TIP]
> Изменения DNS могут распространяться по всему миру до 24-48 часов, хотя часто вступают в силу гораздо раньше.

> \[!IMPORTANT]
> Для улучшения доставляемости мы рекомендуем настроить записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) и [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Введение {#introduction}

### Что такое Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email идеально подходит для частных лиц, малого бизнеса и разработчиков, которые хотят профессиональные адреса электронной почты без затрат и обслуживания полноценного почтового хостинга.

Forward Email — это **полнофункциональный поставщик услуг электронной почты** и **поставщик почтового хостинга для пользовательских доменов**.

Это единственный бесплатный и открытый сервис, который позволяет использовать адреса электронной почты с вашим собственным доменом без сложности настройки и обслуживания собственного почтового сервера.

Наш сервис пересылает письма, отправленные на ваш пользовательский домен, на ваш существующий почтовый аккаунт — и вы даже можете использовать нас в качестве вашего выделенного почтового хостинга.

Основные функции Forward Email:

* **Почта с пользовательским доменом**: используйте профессиональные адреса с вашим собственным доменом
* **Бесплатный тариф**: базовая пересылка почты без оплаты
* **Повышенная конфиденциальность**: мы не читаем ваши письма и не продаём ваши данные
* **Открытый исходный код**: весь наш код доступен на GitHub
* **Поддержка SMTP, IMAP и POP3**: полные возможности отправки и получения почты
* **Сквозное шифрование**: поддержка OpenPGP/MIME
* **Пользовательские универсальные псевдонимы**: создавайте неограниченное количество почтовых псевдонимов

Вы можете сравнить нас с более чем 56 другими поставщиками почтовых услуг на [нашей странице сравнения почтовых сервисов](/blog/best-email-service).

> \[!TIP]
> Узнайте больше о Forward Email, прочитав наш бесплатный [Технический белый документ](/technical-whitepaper.pdf)

### Кто использует Forward Email {#who-uses-forward-email}

Мы предоставляем услуги почтового хостинга и пересылки почты более чем 500 000 доменов и этим известным пользователям:

| Клиент                                  | Кейc-стади                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Военно-морская академия США             | [:page_facing_up: Кейc-стади](/blog/docs/federal-government-email-service-section-889-compliant)       |
| Canonical                              | [:page_facing_up: Кейc-стади](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Netflix Games                         |                                                                                                        |
| Фонд Linux                           | [:page_facing_up: Кейc-стади](/blog/docs/linux-foundation-email-enterprise-case-study)                 |
| Фонд PHP                             |                                                                                                        |
| Fox News Radio                       |                                                                                                        |
| Disney Ad Sales                      |                                                                                                        |
| jQuery                               | [:page_facing_up: Кейc-стади](/blog/docs/linux-foundation-email-enterprise-case-study)                 |
| LineageOS                            |                                                                                                        |
| Ubuntu                              | [:page_facing_up: Кейc-стади](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Kubuntu                             | [:page_facing_up: Кейc-стади](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Lubuntu                             | [:page_facing_up: Кейc-стади](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Кембриджский университет             | [:page_facing_up: Кейc-стади](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Университет Мэриленда               | [:page_facing_up: Кейc-стади](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Университет Вашингтона              | [:page_facing_up: Кейc-стади](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Университет Тафтса                 | [:page_facing_up: Кейc-стади](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Колледж Суортмор                   | [:page_facing_up: Кейc-стади](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Правительство Южной Австралии       |                                                                                                        |
| Правительство Доминиканской Республики |                                                                                                        |
| Fly<span>.</span>io                  |                                                                                                        |
| RCD Hotels                         |                                                                                                        |
| Айзек З. Шлюетер (npm)             | [:page_facing_up: Кейc-стади](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| Дэвид Хайнемайер Ханссон (Ruby on Rails) |                                                                                                        |
### Какова история Forward Email {#what-is-forward-emails-history}

Вы можете узнать больше о Forward Email на [нашей странице «О нас»](/about).

### Насколько быстро работает этот сервис {#how-fast-is-this-service}

> \[!NOTE]
> Наша система разработана для скорости и надежности, с несколькими резервными серверами, чтобы обеспечить своевременную доставку ваших писем.

Forward Email доставляет сообщения с минимальной задержкой, обычно в течение нескольких секунд после получения.

Показатели производительности:

* **Среднее время доставки**: менее 5-10 секунд с момента получения до пересылки ([см. нашу страницу мониторинга Time to Inbox "TTI"](/tti))
* **Время безотказной работы**: доступность сервиса 99,9%+
* **Глобальная инфраструктура**: серверы стратегически расположены для оптимальной маршрутизации
* **Автоматическое масштабирование**: наша система масштабируется в периоды пиковых нагрузок на почту

Мы работаем в режиме реального времени, в отличие от других провайдеров, которые используют отложенные очереди.

Мы не записываем данные на диск и не храним логи – за [исключением ошибок](#do-you-store-error-logs) и [исходящего SMTP](#do-you-support-sending-email-with-smtp) (см. нашу [Политику конфиденциальности](/privacy)).

Всё выполняется в памяти, а [наш исходный код доступен на GitHub](https://github.com/forwardemail).


## Почтовые клиенты {#email-clients}

### Thunderbird {#thunderbird}

1. Создайте новый алиас и сгенерируйте пароль в вашей панели управления Forward Email
2. Откройте Thunderbird и перейдите в **Правка → Настройки аккаунта → Действия с аккаунтом → Добавить почтовый аккаунт**
3. Введите ваше имя, адрес Forward Email и пароль
4. Нажмите **Настроить вручную** и введите:
   * Входящая почта: IMAP, `imap.forwardemail.net`, порт 993, SSL/TLS
   * Исходящая почта: SMTP, `smtp.forwardemail.net`, порт 465, SSL/TLS (рекомендуется; также поддерживается порт 587 с STARTTLS)
5. Нажмите **Готово**

### Microsoft Outlook {#microsoft-outlook}

1. Создайте новый алиас и сгенерируйте пароль в вашей панели управления Forward Email
2. Перейдите в **Файл → Добавить аккаунт**
3. Введите ваш адрес Forward Email и нажмите **Подключить**
4. Выберите **Дополнительные параметры** и отметьте **Позвольте мне настроить аккаунт вручную**
5. Выберите **IMAP** и введите:
   * Входящая почта: `imap.forwardemail.net`, порт 993, SSL
   * Исходящая почта: `smtp.forwardemail.net`, порт 465, SSL/TLS (рекомендуется; также поддерживается порт 587 с STARTTLS)
   * Имя пользователя: ваш полный адрес электронной почты
   * Пароль: ваш сгенерированный пароль
6. Нажмите **Подключить**

### Apple Mail {#apple-mail}

1. Создайте новый алиас и сгенерируйте пароль в вашей панели управления Forward Email
2. Перейдите в **Почта → Настройки → Аккаунты → +**
3. Выберите **Другой почтовый аккаунт**
4. Введите ваше имя, адрес Forward Email и пароль
5. Для настроек сервера введите:
   * Входящая почта: `imap.forwardemail.net`
   * Исходящая почта: `smtp.forwardemail.net`
   * Имя пользователя: ваш полный адрес электронной почты
   * Пароль: ваш сгенерированный пароль
6. Нажмите **Войти**

### eM Client {#em-client}

1. Создайте новый алиас и сгенерируйте пароль в вашей панели управления Forward Email
2. Откройте eM Client и перейдите в **Меню → Аккаунты → + Добавить аккаунт**
3. Нажмите на **Почта**, затем выберите **Другой**
4. Введите ваш адрес Forward Email и нажмите **Далее**
5. Введите следующие настройки сервера:
   * **Входящий сервер**: `imap.forwardemail.net`
   * **Исходящий сервер**: `smtp.forwardemail.net`
6. Введите ваш полный адрес электронной почты как **Имя пользователя** и ваш сгенерированный пароль как **Пароль** для обоих серверов.
7. eM Client проверит соединение. После успешной проверки нажмите **Далее**.
8. Введите ваше имя и выберите имя аккаунта.
9. Нажмите **Завершить**.

### Мобильные устройства {#mobile-devices}

Для iOS:

1. Перейдите в **Настройки → Почта → Аккаунты → Добавить аккаунт → Другой**
2. Нажмите **Добавить почтовый аккаунт** и введите ваши данные
3. Для настроек сервера используйте те же IMAP и SMTP настройки, что и выше

Для Android:

1. Перейдите в **Настройки → Аккаунты → Добавить аккаунт → Личный (IMAP)**
2. Введите ваш адрес Forward Email и пароль
3. Для настроек сервера используйте те же IMAP и SMTP настройки, что и выше

### Конфигурация Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

Вы можете настроить Sendmail для ретрансляции писем через SMTP-серверы Forward Email. Это распространённая настройка для устаревших систем или приложений, которые используют Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>Менее 20 минут</span>
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

#### Конфигурация {#configuration}

1. Отредактируйте файл `sendmail.mc`, обычно расположенный по пути `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Добавьте следующие строки для определения smart host и аутентификации:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Создайте файл аутентификации `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Добавьте ваши учётные данные Forward Email в файл `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Сгенерируйте базу данных аутентификации и защитите файлы:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Пересоберите конфигурацию Sendmail и перезапустите сервис:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Тестирование {#testing}

Отправьте тестовое письмо для проверки конфигурации:

```bash
echo "Тестовое письмо от Sendmail" | mail -s "Тест Sendmail" recipient@example.com
```

### Конфигурация SMTP реле Exim4 {#exim4-smtp-relay-configuration}

Exim4 — популярный MTA на системах на базе Debian. Вы можете настроить его для использования Forward Email в качестве smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
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

#### Конфигурация {#configuration-1}

1. Запустите инструмент настройки Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Выберите следующие параметры:
   * **Общий тип конфигурации почты:** почта отправляется через smarthost; принимается через SMTP или fetchmail
   * **Системное имя почты:** your.hostname
   * **IP-адреса для прослушивания входящих SMTP-соединений:** 127.0.0.1 ; ::1
   * **Другие адресаты, для которых принимается почта:** (оставьте пустым)
   * **Домены для ретрансляции почты:** (оставьте пустым)
   * **IP-адрес или имя хоста исходящего smarthost:** smtp.forwardemail.net::465
   * **Скрывать локальное имя почты в исходящей почте?** Нет
   * **Минимизировать количество DNS-запросов (Dial-on-Demand)?** Нет
   * **Метод доставки локальной почты:** формат Mbox в /var/mail/
   * **Разбивать конфигурацию на мелкие файлы?** Нет

3. Отредактируйте файл `passwd.client`, чтобы добавить ваши учётные данные:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Добавьте следующую строку:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Обновите конфигурацию и перезапустите Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Тестирование {#testing-1}

Отправьте тестовое письмо:

```bash
echo "Тест от Exim4" | mail -s "Тест Exim4" recipient@example.com
```

### Конфигурация SMTP клиента msmtp {#msmtp-smtp-client-configuration}

msmtp — лёгкий SMTP клиент, полезный для отправки писем из скриптов или командной строки.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>Менее 10 минут</span>
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

#### Конфигурация {#configuration-2}

1. Создайте или отредактируйте файл конфигурации msmtp по пути `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Добавьте следующую конфигурацию:

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

3. Установите правильные права доступа для файла конфигурации:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Тестирование {#testing-2}

Отправьте тестовое письмо:

```bash
echo "Это тестовое письмо от msmtp" | msmtp -a default recipient@example.com
```

### Клиенты электронной почты в командной строке {#command-line-email-clients}

Популярные клиенты электронной почты в командной строке, такие как [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) и [Alpine](https://alpine.x10.mx/alpine/release/), можно настроить для использования SMTP-серверов Forward Email для отправки почты. Конфигурация будет похожа на настройку `msmtp`, где вы указываете данные SMTP-сервера и свои учетные данные в соответствующих файлах конфигурации (`.muttrc`, `.neomuttrc` или `.pinerc`).

### Конфигурация электронной почты для Windows {#windows-email-configuration}

Для пользователей Windows можно настроить популярные почтовые клиенты, такие как **Microsoft Outlook** и **eM Client**, используя IMAP и SMTP настройки, предоставленные в вашей учетной записи Forward Email. Для использования в командной строке или скриптах можно использовать cmdlet PowerShell `Send-MailMessage` (хотя он считается устаревшим) или легковесный SMTP релейный инструмент, например [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Конфигурация SMTP реле Postfix {#postfix-smtp-relay-configuration}

Вы можете настроить Postfix для ретрансляции писем через SMTP-серверы Forward Email. Это полезно для серверных приложений, которым нужно отправлять письма.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
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

1. Установите Postfix на ваш сервер:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Во время установки выберите "Internet Site" при запросе типа конфигурации.

#### Конфигурация {#configuration-3}

1. Отредактируйте основной файл конфигурации Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Добавьте или измените следующие настройки:

```
# Конфигурация SMTP реле
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Создайте файл с паролями SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Добавьте ваши учетные данные Forward Email:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Защитите и хэшируйте файл с паролями:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Перезапустите Postfix:

```bash
sudo systemctl restart postfix
```

#### Тестирование {#testing-3}

Проверьте конфигурацию, отправив тестовое письмо:

```bash
echo "Тело тестового письма" | mail -s "Тестовая тема" recipient@example.com
```

### Как отправлять почту от имени с помощью Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>Менее 10 минут</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Начало работы:
  </strong>
  <span>
    Если вы следовали инструкциям выше в разделе <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Как начать и настроить переадресацию электронной почты</a>, то можете продолжить чтение ниже.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Пожалуйста, убедитесь, что вы прочитали наши <a href="/terms" class="alert-link" target="_blank">Условия</a>, <a href="/privacy" class="alert-link" target="_blank">Политику конфиденциальности</a> и <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ограничения исходящего SMTP</a> &ndash; использование сервиса считается вашим согласием и подтверждением.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Если вы разработчик, обратитесь к нашей <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документации по email API</a>.
  </span>
</div>

1. Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке

2. Создайте новый алиас для вашего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы (например, <code><hello@example.com></code>)

3. Нажмите на <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> рядом с только что созданным алиасом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, отображаемый на экране.

4. Перейдите на [Gmail](https://gmail.com) и в разделе [Настройки <i class="fa fa-angle-right"></i> Аккаунты и импорт <i class="fa fa-angle-right"></i> Отправлять письмо как](https://mail.google.com/mail/u/0/#settings/accounts) нажмите "Добавить другой адрес электронной почты"

5. При запросе "Имя" введите имя, которое вы хотите видеть в поле "От" (например, "Linus Torvalds").

6. При запросе "Адрес электронной почты" введите полный адрес электронной почты алиаса, который вы создали в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы (например, <code><hello@example.com></code>)

7. Снимите галочку с "Обрабатывать как алиас"

8. Нажмите "Следующий шаг" для продолжения

9. При запросе "SMTP-сервер" введите <code>smtp.forwardemail.net</code> и измените порт на <code>465</code>

10. При запросе "Имя пользователя" введите полный адрес электронной почты алиаса, который вы создали в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы (например, <code><hello@example.com></code>)

11. При запросе "Пароль" вставьте пароль из шага 3, полученный с помощью <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong>

12. Выберите переключатель "Защищенное соединение с использованием SSL"

13. Нажмите "Добавить аккаунт" для продолжения

14. Откройте новую вкладку на [Gmail](https://gmail.com) и дождитесь прихода письма с подтверждением (вы получите код подтверждения, который подтверждает, что вы являетесь владельцем адреса электронной почты, с которого пытаетесь отправлять письма)

15. Как только письмо придет, скопируйте и вставьте код подтверждения в появившееся поле на предыдущем шаге
16. После этого вернитесь к письму и нажмите ссылку «подтвердить запрос». Скорее всего, вам нужно будет выполнить этот шаг и предыдущий, чтобы электронная почта была настроена правильно.

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

### Что такое устаревшее бесплатное руководство по отправке почты от имени с использованием Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Важно:</strong> Это устаревшее бесплатное руководство устарело с мая 2023 года, так как <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">мы теперь поддерживаем исходящий SMTP</a>. Если вы используете руководство ниже, то <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">ваша исходящая почта</a> будет отображаться с надписью «<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>» в Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>Менее 10 минут</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Начало работы:
  </strong>
  <span>
    Если вы следовали инструкциям выше в разделе <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Как начать и настроить переадресацию электронной почты</a>, то можете продолжить чтение ниже.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Для работы необходимо включить [двухфакторную аутентификацию Gmail][gmail-2fa]. Посетите <https://www.google.com/landing/2step/>, если она у вас не включена.

2. После включения двухфакторной аутентификации (или если она уже была включена), перейдите на <https://myaccount.google.com/apppasswords>.

3. При запросе «Выберите приложение и устройство, для которых хотите создать пароль приложения»:
   * Выберите «Почта» в выпадающем списке «Выберите приложение»
   * Выберите «Другое» в выпадающем списке «Выберите устройство»
   * При запросе текстового ввода введите адрес электронной почты вашего пользовательского домена, с которого вы пересылаете (например, <code><hello@example.com></code> — это поможет вам отслеживать, если вы используете эту службу для нескольких аккаунтов)

4. Скопируйте автоматически сгенерированный пароль в буфер обмена
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Важно:
     </strong>
     <span>
       Если вы используете G Suite, зайдите в панель администратора <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Приложения <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Настройки Gmail <i class="fa fa-angle-right"></i> Настройки</a> и убедитесь, что включена опция «Разрешить пользователям отправлять почту через внешний SMTP-сервер...». Для активации этого изменения потребуется некоторое время, пожалуйста, подождите несколько минут.
     </span>
   </div>

5. Перейдите на [Gmail](https://gmail.com) и в разделе [Настройки <i class="fa fa-angle-right"></i> Аккаунты и импорт <i class="fa fa-angle-right"></i> Отправлять почту как](https://mail.google.com/mail/u/0/#settings/accounts) нажмите «Добавить другой адрес электронной почты»

6. При запросе «Имя» введите имя, которое вы хотите видеть в поле «От» (например, «Linus Torvalds»)

7. При запросе «Адрес электронной почты» введите адрес электронной почты с пользовательским доменом, который вы использовали выше (например, <code><hello@example.com></code>)
8. Снимите флажок "Обрабатывать как псевдоним"

9. Нажмите "Следующий шаг" для продолжения

10. Когда появится запрос "SMTP Server", введите <code>smtp.gmail.com</code> и оставьте порт <code>587</code>

11. Когда появится запрос "Username", введите часть вашего адреса Gmail без части <span>gmail.com</span> (например, только "user", если мой email <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Важно:
      </strong>
      <span>
        Если поле "Username" заполнено автоматически, то <u><strong>вам нужно изменить его</strong></u> на часть имени пользователя вашего адреса Gmail.
      </span>
    </div>

12. Когда появится запрос "Password", вставьте из буфера обмена пароль, который вы создали на шаге 2 выше

13. Оставьте выбранным переключатель "Защищённое соединение с использованием TLS"

14. Нажмите "Добавить аккаунт" для продолжения

15. Откройте новую вкладку на [Gmail](https://gmail.com) и дождитесь прихода письма с подтверждением (вы получите код подтверждения, который подтверждает, что вы являетесь владельцем адреса электронной почты, с которого пытаетесь "Отправлять почту как")

16. Как только письмо придёт, скопируйте и вставьте код подтверждения в появившуюся форму на предыдущем шаге

17. После этого вернитесь к письму и нажмите ссылку для "подтверждения запроса". Скорее всего, вам нужно будет выполнить этот шаг и предыдущий, чтобы правильно настроить почту.

</div>

### Расширенная настройка маршрутизации Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>15-30 минут</span>
</div>

Если вы хотите настроить расширенную маршрутизацию в Gmail так, чтобы псевдонимы, не соответствующие почтовому ящику, перенаправлялись на почтовые серверы Forward Email, выполните следующие шаги:

1. Войдите в консоль администратора Google по адресу [admin.google.com](https://admin.google.com)
2. Перейдите в **Приложения → Google Workspace → Gmail → Маршрутизация**
3. Нажмите **Добавить маршрут** и настройте следующие параметры:

**Настройки для одного получателя:**

* Выберите "Изменить получателя конверта" и введите ваш основной адрес Gmail
* Отметьте "Добавить заголовок X-Gm-Original-To с оригинальным получателем"

**Шаблоны получателей конверта:**

* Добавьте шаблон, который соответствует всем несуществующим почтовым ящикам (например, `.*@yourdomain.com`)

**Настройки почтового сервера:**

* Выберите "Маршрут к хосту" и введите `mx1.forwardemail.net` как основной сервер
* Добавьте `mx2.forwardemail.net` как резервный сервер
* Установите порт 25
* Выберите "Требовать TLS" для безопасности

4. Нажмите **Сохранить** для создания маршрута

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Эта конфигурация работает только для аккаунтов Google Workspace с пользовательскими доменами, а не для обычных аккаунтов Gmail.
  </span>
</div>

### Расширенная настройка маршрутизации Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>15-30 минут</span>
</div>

Для пользователей Microsoft 365 (ранее Office 365), которые хотят настроить расширенную маршрутизацию так, чтобы псевдонимы, не соответствующие почтовому ящику, перенаправлялись на почтовые серверы Forward Email:

1. Войдите в центр администрирования Microsoft 365 по адресу [admin.microsoft.com](https://admin.microsoft.com)
2. Перейдите в **Exchange → Почтовый поток → Правила**
3. Нажмите **Добавить правило** и выберите **Создать новое правило**
4. Назовите правило (например, "Перенаправлять несуществующие почтовые ящики на Forward Email")
5. В разделе **Применять это правило, если** выберите:
   * "Адрес получателя соответствует..."
   * Введите шаблон, который соответствует всем адресам вашего домена (например, `*@yourdomain.com`)
6. В разделе **Выполнить следующие действия** выберите:
   * "Перенаправить сообщение на..."
   * Выберите "Следующий почтовый сервер"
   * Введите `mx1.forwardemail.net` и порт 25
   * Добавьте `mx2.forwardemail.net` как резервный сервер
7. В разделе **Кроме если** выберите:
   * "Получатель является..."
   * Добавьте все ваши существующие почтовые ящики, которые не должны перенаправляться
8. Установите приоритет правила, чтобы оно выполнялось после других правил почтового потока
9. Нажмите **Сохранить** для активации правила
## Устранение неполадок {#troubleshooting}

### Почему я не получаю свои тестовые письма {#why-am-i-not-receiving-my-test-emails}

Если вы отправляете тестовое письмо самому себе, оно может не появиться во входящих, потому что у него такой же заголовок "Message-ID".

Это широко известная проблема, которая также затрагивает такие сервисы, как Gmail.  <a href="https://support.google.com/a/answer/1703601">Вот официальный ответ Gmail по этой проблеме</a>.

Если проблемы продолжаются, скорее всего, это связано с распространением DNS. Вам нужно подождать немного дольше и попробовать снова (или попробовать установить более низкое значение TTL для ваших <strong class="notranslate">TXT</strong> записей).

**Все еще есть проблемы?**  Пожалуйста, <a href="/help">свяжитесь с нами</a>, чтобы мы могли помочь расследовать проблему и найти быстрое решение.

### Как настроить мой почтовый клиент для работы с Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

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
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Ваше имя пользователя — это адрес электронной почты вашего алиаса, а пароль — из <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Обычный пароль").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Совет:
  </strong>
  <span>Если вы используете Thunderbird, убедитесь, что "Безопасность соединения" установлена на "SSL/TLS", а метод аутентификации — "Обычный пароль".</span>
</div>

| Тип  |         Имя хоста       |         Протокол        |                                            Порты                                            |
| :---:| :---------------------: | :---------------------: | :------------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Предпочтительно**  |                                      `993` и `2993`                                        |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Рекомендуется** | `465` и `2465` для SSL/TLS (рекомендуется) или `587`, `2587`, `2525` и `25` для STARTTLS |

### Почему мои письма попадают в Спам и Джанк и как проверить репутацию моего домена {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Этот раздел поможет вам, если ваша исходящая почта использует наши SMTP-серверы (например, `smtp.forwardemail.net`) (или пересылается через `mx1.forwardemail.net` или `mx2.forwardemail.net`) и доставляется в папку Спам или Нежелательная почта у получателей.

Мы регулярно проверяем наши [IP-адреса](#what-are-your-servers-ip-addresses) на предмет нахождения в [всех авторитетных DNS-черных списках](#how-do-you-handle-your-ip-addresses-becoming-blocked), **поэтому, скорее всего, проблема связана с репутацией домена**.

Письма могут попадать в папки спама по нескольким причинам:

1. **Отсутствие аутентификации**: Настройте записи [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) и [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Репутация домена**: Новые домены часто имеют нейтральную репутацию, пока не наработают историю отправки.

3. **Триггеры в содержимом**: Определённые слова или фразы могут срабатывать на спам-фильтры.

4. **Шаблоны отправки**: Внезапное увеличение объёма отправляемых писем может выглядеть подозрительно.

Вы можете попробовать использовать один или несколько из этих инструментов для проверки репутации и категоризации вашего домена:

#### Инструменты проверки репутации и черных списков {#reputation-and-blocklist-check-tools}

| Название инструмента                      | URL                                                          | Тип                    |
| ----------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback | <https://radar.cloudflare.com/domains/feedback>              | Категоризация          |
| Spamhaus IP and Domain Reputation Checker | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Репутация              |
| Barracuda IP and Domain Reputation Lookup | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                | <https://mxtoolbox.com/blacklists.aspx>                      | Черный список          |
| Google Postmaster Tools                   | <https://www.gmail.com/postmaster/>                          | Репутация              |
| Yahoo Sender Hub                          | <https://senders.yahooinc.com/>                              | Репутация              |
| MultiRBL.valli.org Blacklist Check        | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                              | <https://senderscore.org/act/blocklist-remover/>             | Репутация              |
| Invaluement                               | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                     | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                   | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3           | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org            | <https://www.backscatterer.org/>                             | Защита от обратного спама |
| UCEPROTECT's whitelisted.org              | <https://www.whitelisted.org/> (требуется оплата)            | Белый список           |

#### Формы запросов на удаление IP из черных списков по провайдерам {#ip-removal-request-forms-by-provider}

Если ваш IP-адрес заблокирован конкретным почтовым провайдером, используйте соответствующую форму удаления или контакт ниже:

| Провайдер                              | Форма удаления / Контакт                                                                                   | Примечания                                   |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Форма для массовых отправителей              |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Портал удаления IP из Office 365             |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                          | Apple использует Proofpoint для репутации IP |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                          | Проверка и удаление IP в Proofpoint          |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Проверка репутации и удаление Barracuda      |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                      | Запрос на сброс Cloudmark CSI                 |
| GoDaddy/SecureServer               | <https://unblock.secureserver.net>                                                                         | Форма запроса разблокировки GoDaddy IP       |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                           | Запрос на удаление IP Comcast                 |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Свяжитесь с поддержкой Spectrum для удаления  |
| AT&T                               | `abuse_rbl@abuse-att.net`                                                                                  | Email для запроса удаления                    |
| Cox Communications               | `unblock.request@cox.net`                                                                                  | Email для запроса удаления                    |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                                    | Использует Cloudfilter                         |
| Windstream                       | `abuse@windstream.net`                                                                                     | Email для запроса удаления                    |
| t-online.de (Германия)            | `tobr@rx.t-online.de`                                                                                      | Email для запроса удаления                    |
| Orange France                    | <https://postmaster.orange.fr/>                                                                            | Используйте форму контакта или email `abuse@orange.fr` |
| GMX                              | <https://postmaster.gmx.net/en/contact>                                                                    | Форма контакта GMX постмастера                |
| Mail.ru                          | <https://postmaster.mail.ru/>                                                                              | Портал постмастера Mail.ru                     |
| Yandex                           | <https://postmaster.yandex.ru/>                                                                            | Портал постмастера Яндекса                     |
| QQ Mail (Tencent)                | <https://open.mail.qq.com/>                                                                                | Заявка на белый список QQ Mail (на китайском) |
| Netease (163.com)                | <https://mail.163.com/postmaster/>                                                                         | Портал постмастера Netease                     |
| Alibaba/Aliyun/HiChina           | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Контакт через консоль Alibaba Cloud            |
| Amazon SES                      | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | Консоль AWS SES > Удаление из черного списка  |
| SendGrid                       | <https://support.sendgrid.com/>                                                                            | Поддержка SendGrid                             |
| Mimecast                       | <https://community.mimecast.com/>                                                                          | Использует сторонние RBL — обращайтесь к конкретному RBL |
| Fastmail                       | <https://www.fastmail.com/support/>                                                                        | Поддержка Fastmail                             |
| Zoho                           | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Поддержка Zoho                                 |
| ProtonMail                     | <https://proton.me/support/contact>                                                                        | Поддержка Proton                               |
| Tutanota                       | <https://tutanota.com/support>                                                                             | Поддержка Tutanota                             |
| Hushmail                       | <https://www.hushmail.com/support/>                                                                        | Поддержка Hushmail                             |
| Mailbox.org                    | <https://mailbox.org/en/support>                                                                           | Поддержка Mailbox.org                          |
| Posteo                         | <https://posteo.de/en/site/contact>                                                                        | Поддержка Posteo                               |
| DuckDuckGo Email               | <https://duckduckgo.com/email/support>                                                                     | Поддержка DuckDuckGo                           |
| Sonic.net                      | <https://www.sonic.com/support>                                                                            | Поддержка Sonic                                |
| Telus                         | <https://www.telus.com/en/support>                                                                         | Поддержка Telus                                |
| Vodafone Germany              | <https://www.vodafone.de/hilfe/>                                                                           | Поддержка Vodafone                             |
| Xtra (Spark NZ)               | <https://www.spark.co.nz/help/>                                                                            | Поддержка Spark NZ                             |
| UOL/BOL (Бразилия)             | <https://ajuda.uol.com.br/>                                                                                | Поддержка UOL (на португальском)               |
| Libero (Италия)               | <https://aiuto.libero.it/>                                                                                 | Поддержка Libero (на итальянском)               |
| Telenet (Бельгия)             | <https://www2.telenet.be/en/support/>                                                                      | Поддержка Telenet                              |
| Facebook/WhatsApp             | <https://www.facebook.com/business/help>                                                                   | Поддержка Facebook для бизнеса                 |
| LinkedIn                     | <https://www.linkedin.com/help/linkedin>                                                                   | Поддержка LinkedIn                             |
| Groups.io                    | <https://groups.io/helpcenter>                                                                             | Поддержка Groups.io                            |
| Earthlink/Vade Secure        | <https://sendertool.vadesecure.com/en/>                                                                    | Инструмент отправителя Vade Secure             |
| Cloudflare Email Security    | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Поддержка Cloudflare                           |
| Hornetsecurity/Expurgate     | <https://www.hornetsecurity.com/>                                                                          | Поддержка Hornetsecurity                       |
| SpamExperts/Antispamcloud    | <https://www.spamexperts.com/>                                                                             | Контакт через хостинг-провайдера               |
| Mail2World                  | <https://www.mail2world.com/support/>                                                                      | Поддержка Mail2World                           |
> \[!TIP]
> Начинайте с небольшого объема высококачественных писем, чтобы создать положительную репутацию, прежде чем отправлять письма в больших объемах.

> \[!IMPORTANT]
> Если ваш домен находится в черном списке, у каждого черного списка есть своя процедура удаления. Проверьте их сайты для получения инструкций.

> \[!TIP]
> Если вам нужна дополнительная помощь или вы обнаружили, что мы ошибочно внесены в спам у определенного провайдера электронной почты, пожалуйста, <a href="/help">свяжитесь с нами</a>.

### Что делать, если я получаю спам-письма {#what-should-i-do-if-i-receive-spam-emails}

Вам следует отписаться от рассылки (если это возможно) и заблокировать отправителя.

Пожалуйста, не отмечайте сообщение как спам, а вместо этого пересылайте его в нашу вручную курируемую и ориентированную на конфиденциальность систему предотвращения злоупотреблений.

**Адрес электронной почты для пересылки спама:** <abuse@forwardemail.net>

### Почему мои тестовые письма, отправленные самому себе в Gmail, отображаются как «подозрительные» {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Если вы видите это сообщение об ошибке в Gmail при отправке тестового письма самому себе или когда человек, с которым вы общаетесь по вашему алиасу, видит письмо от вас впервые, то **пожалуйста, не беспокойтесь** — это встроенная функция безопасности Gmail.

Вы можете просто нажать «Выглядит безопасно». Например, если вы отправите тестовое сообщение с помощью функции отправки почты от имени (send mail as) кому-то другому, то они не увидят это сообщение.

Однако если они видят это сообщение, это потому, что они привыкли видеть ваши письма с адреса <john@gmail.com>, а не с <john@customdomain.com> (просто пример). Gmail предупреждает пользователей, чтобы убедиться, что все в порядке, и обходных путей нет.

### Можно ли убрать «via forwardemail dot net» в Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Эта тема связана с [широко известной проблемой в Gmail, когда рядом с именем отправителя появляется дополнительная информация](https://support.google.com/mail/answer/1311182).

По состоянию на май 2023 года мы поддерживаем отправку почты через SMTP как дополнение для всех платных пользователей — это означает, что вы можете убрать <span class="notranslate">via forwardemail dot net</span> в Gmail.

Обратите внимание, что этот раздел FAQ предназначен для тех, кто использует функцию [Как отправлять почту от имени через Gmail](#how-to-send-mail-as-using-gmail).

Пожалуйста, смотрите раздел [Поддерживаете ли вы отправку почты через SMTP](#do-you-support-sending-email-with-smtp) для инструкций по настройке.


## Управление данными {#data-management}

### Где расположены ваши серверы {#where-are-your-servers-located}

> \[!TIP]
> В ближайшее время мы можем объявить о нашем дата-центре в ЕС, размещенном на [forwardemail.eu](https://forwardemail.eu). Подписывайтесь на обсуждение по адресу <https://github.com/orgs/forwardemail/discussions/336> для обновлений.

Наши серверы расположены преимущественно в Денвере, штат Колорадо — смотрите <https://forwardemail.net/ips> для полного списка IP-адресов.

Вы можете узнать о наших субподрядчиках на наших страницах [GDPR](/gdpr), [DPA](/dpa) и [Конфиденциальность](/privacy).

### Как экспортировать и создать резервную копию моего почтового ящика {#how-do-i-export-and-backup-my-mailbox}

В любое время вы можете экспортировать свои почтовые ящики в форматах [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) или зашифрованном формате [SQLite](https://en.wikipedia.org/wiki/SQLite).

Перейдите на <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы <i class="fa fa-angle-right"></i> Скачать резервную копию и выберите предпочитаемый формат экспорта.

После завершения экспорта вам будет отправлена ссылка для скачивания.

Обратите внимание, что ссылка для скачивания экспорта истекает через 4 часа по соображениям безопасности.

Если вам нужно просмотреть экспортированные форматы EML или Mbox, то эти инструменты с открытым исходным кодом могут быть полезны:

| Название        | Формат | Платформа    | GitHub URL                                          |
| --------------- | :----: | ------------ | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows      | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Все платформы| <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows      | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode       | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Все платформы| <https://github.com/s0ph1e/eml-reader>              |
Кроме того, если вам нужно конвертировать файл Mbox в файл EML, вы можете использовать <https://github.com/noelmartinon/mboxzilla>.

### Как импортировать и перенести мою существующую почтовую коробку {#how-do-i-import-and-migrate-my-existing-mailbox}

Вы можете легко импортировать свою почту в Forward Email (например, используя [Thunderbird](https://www.thunderbird.net)) с помощью приведённых ниже инструкций:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Вы должны выполнить все следующие шаги, чтобы импортировать вашу существующую почту.
  </span>
</div>

1. Экспортируйте вашу почту из текущего почтового провайдера:

   | Почтовый провайдер | Формат экспорта                               | Инструкции по экспорту                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail              | MBOX                                          | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook            | PST                                           | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Совет:</strong> <span>Если вы используете Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">формат экспорта PST</a>), то вы можете просто следовать инструкциям в разделе «Другие» ниже. Однако мы предоставили ссылки ниже для конвертации PST в формат MBOX/EML в зависимости от вашей операционной системы:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba для Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst для Windows cygwin</a> – (например, <code>readpst -u -o $OUT_DIR $IN_DIR</code>, заменяя <code>$OUT_DIR</code> и <code>$IN_DIR</code> на пути к выходной и входной директориям соответственно).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst для Ubuntu/Linux</a> – (например, <code>sudo apt-get install readpst</code>, а затем <code>readpst -u -o $OUT_DIR $IN_DIR</code>, заменяя <code>$OUT_DIR</code> и <code>$IN_DIR</code> на пути к выходной и входной директориям соответственно).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst для macOS (через brew)</a> – (например, <code>brew install libpst</code>, а затем <code>readpst -u -o $OUT_DIR $IN_DIR</code>, заменяя <code>$OUT_DIR</code> и <code>$IN_DIR</code> на пути к выходной и входной директориям соответственно).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter для Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail         | MBOX                                          | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail           | EML                                           | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail        | MBOX/EML                                      | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota           | EML                                           | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi              | EML                                           | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho               | EML                                           | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Другие             | [Используйте Thunderbird](https://www.thunderbird.net) | Настройте вашу существующую почтовую учётную запись в Thunderbird, а затем используйте плагин [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) для экспорта и импорта вашей почты.  **Вы также можете просто копировать/вставлять или перетаскивать письма между аккаунтами.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Скачайте, установите и откройте [Thunderbird](https://www.thunderbird.net).

3. Создайте новую учетную запись, используя полный адрес электронной почты вашего алиаса (например, <code><you@yourdomain.com></code>) и сгенерированный пароль.  <strong>Если у вас еще нет сгенерированного пароля, то <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">ознакомьтесь с нашими инструкциями по настройке</a></strong>.

4. Скачайте и установите плагин [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) для Thunderbird.

5. Создайте новую локальную папку в Thunderbird, затем кликните по ней правой кнопкой мыши → выберите опцию `ImportExportTools NG` → выберите `Import mbox file` (для формата экспорта MBOX) – или – `Import messages` / `Import all messages from a directory` (для формата экспорта EML).

6. Перетащите сообщения из локальной папки в новую (или существующую) IMAP-папку в Thunderbird, в которую вы хотите загрузить сообщения в IMAP-хранилище с нашим сервисом.  Это обеспечит их резервное копирование онлайн в нашем зашифрованном хранилище SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>
       Если вы не уверены, как импортировать в Thunderbird, вы можете ознакомиться с официальными инструкциями по адресу <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> и <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    После завершения процесса экспорта и импорта вы также можете включить переадресацию на вашей существующей учетной записи электронной почты и настроить автоответчик, чтобы уведомлять отправителей о вашем новом адресе электронной почты (например, если вы ранее использовали Gmail, а теперь используете почту с вашим собственным доменом).
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

### Как использовать собственное S3-совместимое хранилище для резервных копий {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Пользователи платных планов могут настроить собственного провайдера хранилища, совместимого с [S3](https://en.wikipedia.org/wiki/Amazon_S3), для каждого домена отдельно для резервного копирования IMAP/SQLite.  Это означает, что ваши зашифрованные резервные копии почтового ящика могут храниться на вашей собственной инфраструктуре вместо (или в дополнение к) нашему стандартному хранилищу.

Поддерживаемые провайдеры включают [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) и любые другие сервисы, совместимые с S3.

#### Настройка {#setup}

1. Создайте **приватный** бакет у вашего S3-совместимого провайдера.  Бакет не должен быть общедоступным.
2. Создайте учетные данные доступа (ID ключа доступа и секретный ключ доступа) с правами чтения/записи для бакета.
3. Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Расширенные настройки <i class="fa fa-angle-right"></i> Пользовательское S3-совместимое хранилище.
4. Отметьте **"Включить пользовательское S3-совместимое хранилище"** и заполните URL конечной точки, ID ключа доступа, секретный ключ доступа, регион и имя бакета.
5. Нажмите **"Проверить соединение"**, чтобы проверить ваши учетные данные, доступ к бакету и права записи.
6. Нажмите **"Сохранить"**, чтобы применить настройки.

#### Как работают резервные копии {#how-backups-work}

Резервное копирование запускается автоматически для каждого подключенного IMAP-алиаса.  IMAP-сервер проверяет все активные подключения раз в час и запускает резервное копирование для каждого подключенного алиаса.  Блокировка на основе Redis предотвращает запуск дублирующих резервных копий в течение 30 минут друг от друга, а фактическое резервное копирование пропускается, если успешное резервное копирование уже было выполнено в течение последних 24 часов (если только резервное копирование не было явно запрошено пользователем для загрузки).
Резервные копии также можно запускать вручную, нажав **"Download Backup"** для любого псевдонима на панели управления. Ручные резервные копии всегда выполняются независимо от 24-часового окна.

Процесс резервного копирования работает следующим образом:

1. База данных SQLite копируется с помощью `VACUUM INTO`, что создает согласованную снимок без прерывания активных подключений и сохраняет шифрование базы данных.
2. Файл резервной копии проверяется путем его открытия для подтверждения, что шифрование по-прежнему действительно.
3. Вычисляется хэш SHA-256 и сравнивается с существующей резервной копией в хранилище. Если хэши совпадают, загрузка пропускается (изменений с момента последнего резервного копирования нет).
4. Резервная копия загружается в S3 с использованием многокомпонентной загрузки через библиотеку [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Генерируется подписанный URL для скачивания (действителен 4 часа) и отправляется пользователю по электронной почте.

#### Форматы резервных копий {#backup-formats}

Поддерживаются три формата резервных копий:

| Формат   | Расширение | Описание                                                                    |
| -------- | ---------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`  | Сырой зашифрованный снимок базы данных SQLite (по умолчанию для автоматических IMAP-резервных копий) |
| `mbox`   | `.zip`     | Защищенный паролем ZIP, содержащий почтовый ящик в формате mbox             |
| `eml`    | `.zip`     | Защищенный паролем ZIP, содержащий отдельные файлы `.eml` для каждого сообщения |

> **Совет:** Если у вас есть файлы резервных копий `.sqlite` и вы хотите конвертировать их в файлы `.eml` локально, используйте наш автономный CLI-инструмент **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Он работает на Windows, Linux и macOS и не требует подключения к сети.

#### Именование файлов и структура ключей {#file-naming-and-key-structure}

При использовании **пользовательского хранилища S3** файлы резервных копий сохраняются с префиксом временной метки в формате [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), чтобы каждая резервная копия сохранялась как отдельный объект. Это дает вам полную историю резервных копий в вашем собственном бакете.

Формат ключа:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Например:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` — это MongoDB ObjectId псевдонима. Вы можете найти его на странице настроек псевдонима или через API.

При использовании **стандартного (системного) хранилища** ключ плоский (например, `65a31c53c36b75ed685f3fda.sqlite`), и каждая новая резервная копия перезаписывает предыдущую.

> **Примечание:** Поскольку пользовательское хранилище S3 сохраняет все версии резервных копий, использование хранилища будет расти со временем. Рекомендуем настроить [правила жизненного цикла](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) в вашем бакете для автоматического удаления старых резервных копий (например, удалять объекты старше 30 или 90 дней).

#### Владение данными и политика удаления {#data-ownership-and-deletion-policy}

Ваш пользовательский бакет S3 полностью под вашим контролем. Мы **никогда не удаляем и не изменяем** файлы в вашем пользовательском бакете S3 — ни при удалении псевдонима, ни при удалении домена, ни во время любых операций очистки. Мы только записываем новые файлы резервных копий в ваш бакет.

Это означает:

* **Удаление псевдонима** — при удалении псевдонима мы удаляем резервную копию только из нашего стандартного системного хранилища. Все резервные копии, ранее записанные в ваш пользовательский бакет S3, остаются нетронутыми.
* **Удаление домена** — удаление домена не влияет на файлы в вашем пользовательском бакете.
* **Управление хранением** — вы несете ответственность за управление хранилищем в вашем бакете, включая настройку правил жизненного цикла для удаления старых резервных копий.

Если вы отключите пользовательское хранилище S3 или переключитесь обратно на наше стандартное хранилище, существующие файлы в вашем бакете сохранятся. Будущие резервные копии будут просто записываться в наше стандартное хранилище.

#### Безопасность {#security}

* Ваш идентификатор ключа доступа и секретный ключ доступа **шифруются в состоянии покоя** с использованием [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) перед сохранением в нашей базе данных. Они расшифровываются только во время выполнения операций резервного копирования.
* Мы автоматически проверяем, что ваш бакет **не является общедоступным**. Если обнаружен общедоступный бакет, конфигурация будет отклонена при сохранении. Если общедоступный доступ обнаружен во время резервного копирования, мы переключаемся на наше стандартное хранилище и уведомляем всех администраторов домена по электронной почте.
* Учетные данные проверяются при сохранении с помощью вызова [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html), чтобы убедиться, что бакет существует и учетные данные корректны. Если проверка не проходит, пользовательское хранилище S3 автоматически отключается.
* Каждый файл резервной копии включает хэш SHA-256 в метаданных S3, который используется для обнаружения неизмененных баз данных и пропуска избыточных загрузок.
#### Уведомления об ошибках {#error-notifications}

Если резервное копирование не удалось при использовании вашего пользовательского хранилища S3 (например, из-за истекших учетных данных или проблем с подключением), все администраторы домена будут уведомлены по электронной почте. Эти уведомления ограничены по частоте — не чаще одного раза в 6 часов, чтобы избежать дублирующих оповещений. Если во время резервного копирования обнаруживается, что ваш бакет общедоступен, администраторы будут уведомлены один раз в день.

#### API {#api}

Вы также можете настроить пользовательское хранилище S3 через API:

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

Для проверки подключения через API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Как конвертировать резервные копии SQLite в файлы EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Если вы скачали или сохранили резервные копии SQLite (либо из нашего стандартного хранилища, либо из вашего собственного [пользовательского S3 бакета](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), вы можете конвертировать их в стандартные файлы `.eml` с помощью нашего автономного CLI-инструмента **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. Файлы EML можно открыть в любом почтовом клиенте ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) и др.) или импортировать в другие почтовые серверы.

#### Установка {#installation-1}

Вы можете либо скачать готовый бинарный файл (без необходимости [Node.js](https://github.com/nodejs/node)), либо запустить его напрямую с помощью [Node.js](https://github.com/nodejs/node):

**Готовые бинарные файлы** — скачайте последнюю версию для вашей платформы с [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Платформа | Архитектура  | Файл                                 |
| --------- | ------------ | ------------------------------------ |
| Linux     | x64          | `convert-sqlite-to-eml-linux-x64`    |
| Linux     | arm64        | `convert-sqlite-to-eml-linux-arm64`  |
| macOS     | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64` |
| Windows   | x64          | `convert-sqlite-to-eml-win-x64.exe`  |

> **Пользователи macOS:** После скачивания возможно потребуется снять атрибут карантина перед запуском бинарника:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Замените `./convert-sqlite-to-eml-darwin-arm64` на фактический путь к скачанному файлу.)

> **Пользователи Linux:** После скачивания возможно потребуется сделать бинарник исполняемым:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Замените `./convert-sqlite-to-eml-linux-x64` на фактический путь к скачанному файлу.)

**Из исходников** (требуется [Node.js](https://github.com/nodejs/node) версии >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Использование {#usage}

Инструмент поддерживает как интерактивный, так и неинтерактивный режимы.

**Интерактивный режим** — запустите без аргументов, и вам будут заданы все необходимые вопросы:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Конвертация резервной копии SQLite в EML
  =============================================

  Путь к файлу резервной копии SQLite: /path/to/backup.sqlite
  Пароль IMAP/алиаса: ********
  Путь для ZIP-архива [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Неинтерактивный режим** — передавайте аргументы через флаги командной строки для скриптов и автоматизации:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Флаг                | Описание                                                                       |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | Путь к зашифрованному файлу резервной копии SQLite                             |
| `--password <pass>` | Пароль IMAP/алиаса для расшифровки                                            |
| `--output <path>`   | Путь для выходного ZIP-файла (по умолчанию: генерируется автоматически с ISO 8601 меткой времени) |
| `--help`            | Показать справочное сообщение                                                 |
#### Формат вывода {#output-format}

Инструмент создает защищенный паролем ZIP-архив (шифрование AES-256), содержащий:

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

Файлы EML организованы по папкам почтового ящика. Пароль ZIP-архива совпадает с вашим паролем IMAP/алиаса. Каждый файл `.eml` — это стандартное [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) электронное письмо с полными заголовками, текстом тела и вложениями, восстановленными из базы данных SQLite.

#### Как это работает {#how-it-works}

1. Открывает зашифрованную базу данных SQLite, используя ваш пароль IMAP/алиаса (поддерживаются шифры [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) и [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Считывает таблицу Mailboxes для определения структуры папок.
3. Для каждого сообщения декодирует mimeTree (хранится в виде JSON, сжатого с помощью [Brotli](https://github.com/google/brotli)) из таблицы Messages.
4. Восстанавливает полный EML, обходя MIME-дерево и извлекая содержимое вложений из таблицы Attachments.
5. Упаковывает всё в защищенный паролем ZIP-архив с помощью [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Поддерживаете ли вы самостоятельный хостинг {#do-you-support-self-hosting}

Да, с марта 2025 года мы поддерживаем вариант самостоятельного хостинга. Читайте блог [здесь](https://forwardemail.net/blog/docs/self-hosted-solution). Ознакомьтесь с [руководством по самостоятельному хостингу](https://forwardemail.net/self-hosted), чтобы начать. А для тех, кто хочет более подробное пошаговое руководство, смотрите наши гайды для [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) или [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Настройка электронной почты {#email-configuration}

### Как начать и настроить переадресацию электронной почты {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Оценочное время настройки:</strong>
  <span>Менее 10 минут</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Начало работы:
  </strong>
  <span>
    Внимательно прочитайте и выполните шаги с первого по восьмой, приведённые ниже. Обязательно замените адрес электронной почты <code>user@gmail.com</code> на адрес, на который вы хотите переадресовывать письма (если он ещё не указан правильно). Аналогично замените <code>example.com</code> на ваше собственное доменное имя (если оно ещё не указано верно).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Если вы уже зарегистрировали своё доменное имя где-то, то этот шаг полностью пропускайте и переходите к шагу второму! В противном случае вы можете <a href="/domain-registration" rel="noopener noreferrer">нажать здесь, чтобы зарегистрировать домен</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Помните ли вы, где регистрировали домен? Как только вспомните, следуйте инструкциям ниже:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Вам нужно открыть новую вкладку и войти в аккаунт регистратора домена. Вы можете легко кликнуть на название вашего "Регистратора" ниже, чтобы сделать это автоматически. В этой новой вкладке перейдите на страницу управления DNS у вашего регистратора — мы предоставили пошаговые инструкции в колонке "Шаги настройки". После того, как вы перейдёте на эту страницу в новой вкладке, вернитесь сюда и продолжайте с шага третьего.
    <strong class="font-weight-bold">Не закрывайте открытую вкладку — она понадобится для следующих шагов!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Регистратор</th>
      <th>Шаги настройки</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Центр доменов <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Редактировать настройки DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Выберите ваш домен)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Мои серверы <i class="fa fa-angle-right"></i> Управление доменами <i class="fa fa-angle-right"></i> Менеджер DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ДЛЯ ROCK: Войдите <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> (Нажмите на значок ▼ рядом с управлением) <i class="fa fa-angle-right"></i> DNS
      <br />
      ДЛЯ LEGACY: Войдите <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> Редактор зон <i class="fa fa-angle-right"></i> (Выберите ваш домен)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Выберите ваш домен)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> (Выберите ваш домен)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Управление</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Сеть <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Ещё <i class="fa fa-angle-right"></i> Управление доменом</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> В карточном виде нажмите управление на вашем домене <i class="fa fa-angle-right"></i> В списковом виде нажмите
значок шестерёнки <i class="fa fa-angle-right"></i> DNS и имена серверов <i class="fa fa-angle-right"></i> DNS-записи</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Смотреть</a>
      </td>
      <td>Войдите <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> (нажмите значок шестерёнки) <i class="fa fa-angle-right"></i> Нажмите на DNS и имена серверов в левом меню</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Панель <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> Управление доменами <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Обзор <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Простой редактор <i class="fa fa-angle-right"></i> Записи</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Редактировать зону</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Смотреть</a>
      </td>
      <td>Войдите <i class="fa fa-angle-right"></i> Управление моими доменами <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Управление DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Смотреть</a>
      </td>
      <td>Войдите <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Настроить DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Смотреть</a>
      </td>
      <td>Войдите <i class="fa fa-angle-right"></i> Список доменов <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Расширенный DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Настроить Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Менеджер аккаунта <i class="fa fa-angle-right"></i> Мои домены <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Управление <i class="fa fa-angle-right"></i> Изменить указание домена <i class="fa fa-angle-right"></i> Расширенный DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Смотреть</a>
      </td>
      <td>Войдите <i class="fa fa-angle-right"></i> Управляемые домены <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> Настройки DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Главное меню <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i>
Расширенные настройки <i class="fa fa-angle-right"></i> Пользовательские записи</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Используйте CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Страница доменов <i class="fa fa-angle-right"></i> (Выберите ваш домен) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Страница доменов <i class="fa fa-angle-right"></i> (Нажмите на значок <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Выберите Управление DNS-записями</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Войдите <i class="fa fa-angle-right"></i> Домены <i class="fa fa-angle-right"></i> Мои домены</td>
    </tr>
    <tr>
      <td>Другие</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Важно:</strong> Не видите здесь имя вашего регистратора? Просто найдите в интернете "как изменить DNS-записи у $REGISTRAR" (замените $REGISTRAR на имя вашего регистратора, например, "как изменить DNS-записи у GoDaddy", если вы используете GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Используя страницу управления DNS вашего регистратора (открытую в другой вкладке), установите следующие записи "MX":
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Обратите внимание, что не должно быть других MX-записей. Оба приведённых ниже записи ДОЛЖНЫ существовать. Убедитесь, что нет опечаток и что у вас правильно написаны mx1 и mx2. Если ранее существовали другие MX-записи, пожалуйста, полностью удалите их.
    Значение "TTL" не обязательно должно быть 3600, при необходимости оно может быть меньше или больше.
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Используя страницу управления DNS у вашего регистратора (в другой вкладке, которую вы открыли), установите следующие <strong class="notranslate">TXT</strong> записи:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Если у вас платный тариф, то этот шаг нужно полностью пропустить и перейти к пятому шагу! Если у вас нет платного тарифа, то ваши переадресованные адреса будут общедоступны для поиска – перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> и при желании обновите домен до платного тарифа. Если хотите узнать больше о платных тарифах, смотрите нашу страницу <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Цены</a>. В противном случае вы можете продолжить и выбрать одну или несколько комбинаций из вариантов A до F, приведённых ниже.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Вариант A:
  </strong>
  <span>
    Если вы переадресуете все письма с вашего домена (например, "all@example.com", "hello@example.com" и т.д.) на конкретный адрес "user@gmail.com":
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
    Обязательно замените значения в колонке "Значение" на ваш собственный адрес электронной почты. Значение "TTL" не обязательно должно быть 3600, при необходимости оно может быть меньше или больше. Меньшее время жизни ("TTL") обеспечит более быструю распространённость любых будущих изменений ваших DNS-записей по всему Интернету – подумайте об этом как о времени кэширования в памяти (в секундах). Подробнее о <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL на Википедии</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Вариант B:
  </strong>
  <span>
    Если вам нужно переадресовать только один адрес электронной почты (например, <code>hello@example.com</code> на <code>user@gmail.com</code>; это также автоматически переадресует "hello+test@example.com" на "user+test@gmail.com"):
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
    Если вы перенаправляете несколько адресов электронной почты, то их нужно разделять запятой:
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
    Вы можете настроить бесконечное количество адресов для переадресации – просто убедитесь, что одна строка не превышает 255 символов и каждая строка начинается с "forward-email=". Пример приведён ниже:
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
    Вы также можете указать доменное имя в вашей <strong class="notranslate">TXT</strong> записи для глобальной переадресации псевдонимов (например, "user@example.com" будет перенаправлен на "user@example.net"):
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
    Вы даже можете использовать вебхуки в качестве глобального или индивидуального псевдонима для переадресации писем. Смотрите пример и полный раздел о вебхуках под названием <a href="#do-you-support-webhooks" class="alert-link">Поддерживаете ли вы вебхуки</a> ниже.
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
    Вы даже можете использовать регулярные выражения ("regex") для сопоставления псевдонимов и для обработки подстановок для пересылки писем. Смотрите примеры и полный раздел о регулярных выражениях под названием <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Поддерживаете ли вы регулярные выражения или regex</a> ниже.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Нужны продвинутые regex с подстановками?</strong> Смотрите примеры и полный раздел о регулярных выражениях под названием <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Поддерживаете ли вы регулярные выражения или regex</a> ниже.
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
    Правила пересылки для catch-all также можно описать как "проваливание".
    Это означает, что входящие письма, которые соответствуют хотя бы одному конкретному правилу пересылки, будут использоваться вместо catch-all.
    Конкретные правила включают адреса электронной почты и регулярные выражения.
    <br /><br />
    Например:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Письма, отправленные на <code>hello@example.com</code>, **не будут** пересылаться на <code>second@gmail.com</code> (catch-all) с этой конфигурацией, и вместо этого будут доставлены только на <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Используя страницу управления DNS вашего регистратора (в другой вкладке, которую вы открыли), дополнительно установите следующую запись <strong class="notranslate">TXT</strong>:

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
    Если вы используете Gmail (например, Send Mail As) или G Suite, то вам нужно будет добавить <code>include:_spf.google.com</code> к значению выше, например:
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
    Если у вас уже есть похожая строка с "v=spf1", то вам нужно добавить <code>include:spf.forwardemail.net</code> прямо перед любыми существующими записями "include:host.com" и перед "-all" в той же строке, например:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Обратите внимание, что есть разница между "-all" и "~all". "-" означает, что проверка SPF должна ПРОВАЛИТЬСЯ, если не совпадает, а "~" означает, что проверка SPF должна быть SOFTFAIL. Мы рекомендуем использовать подход "-all" для предотвращения подделки домена.
    <br /><br />
    Возможно, вам также потребуется включить SPF-запись для того хоста, с которого вы отправляете почту (например, Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Проверьте ваши DNS-записи с помощью нашего инструмента "Проверить записи", доступного в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройка.

</li><li class="mb-2 mb-md-3 mb-lg-5">Отправьте тестовое письмо, чтобы подтвердить, что всё работает. Обратите внимание, что может потребоваться некоторое время для распространения ваших DNS-записей.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Совет:
  </strong>
  <span>
  </span>
    Если вы не получаете тестовые письма или получаете тестовое письмо с сообщением "Будьте осторожны с этим сообщением", то смотрите ответы на вопросы <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Почему я не получаю мои тестовые письма</a> и <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Почему мои тестовые письма, отправленные самому себе в Gmail, отображаются как "подозрительные"</a> соответственно.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Если вы хотите "Отправлять почту как" из Gmail, то вам нужно <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">посмотреть это видео</a></strong> или следовать шагам в разделе <a href="#how-to-send-mail-as-using-gmail">Как отправлять почту как с помощью Gmail</a> ниже.

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
    Дополнительные опции перечислены ниже. Обратите внимание, что эти опции полностью необязательны и могут не понадобиться. Мы хотели хотя бы предоставить вам дополнительную информацию на случай необходимости.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Дополнительная опция:
  </strong>
  <span>
    Если вы используете функцию <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Как отправлять почту как с помощью Gmail</a>, то возможно, вы захотите добавить себя в белый список. Смотрите <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">эти инструкции от Gmail</a> по этой теме.
  </span>
</div>

### Могу ли я использовать несколько MX-серверов и обменников для расширенной пересылки {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Да, но **в ваших DNS-записях должен быть указан только один MX-сервер**.

Не пытайтесь использовать "Приоритет" как способ настройки нескольких MX-серверов.

Вместо этого вам нужно настроить ваш существующий MX-сервер так, чтобы он пересылал почту для всех не совпадающих псевдонимов на обменники нашего сервиса (`mx1.forwardemail.net` и/или `mx2.forwardemail.net`).

Если вы используете Google Workspace и хотите пересылать все не совпадающие псевдонимы на наш сервис, смотрите <https://support.google.com/a/answer/6297084>.

Если вы используете Microsoft 365 (Outlook) и хотите пересылать все не совпадающие псевдонимы на наш сервис, смотрите <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> и <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Как настроить автоответчик на отпуск (автоматический ответчик "вне офиса") {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы и создайте или отредактируйте псевдоним, для которого хотите настроить автоответчик на отпуск.
Вы можете настроить дату начала, дату окончания, тему и сообщение, а также включать или отключать это в любое время:

* В настоящее время поддерживаются только обычные текстовые тема и сообщение (мы используем пакет `striptags` для удаления любого HTML).
* Тема ограничена 100 символами.
* Сообщение ограничено 1000 символами.
* Настройка требует конфигурации исходящего SMTP (например, вам нужно будет настроить записи DNS DKIM, DMARC и Return-Path).
  * Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.
* Автоответчик на отпуск нельзя включить для глобальных vanity-доменов (например, [одноразовые адреса](/disposable-addresses) не поддерживаются).
* Автоответчик на отпуск нельзя включить для псевдонимов с подстановочными знаками/ловушками (`*`) или регулярными выражениями.

В отличие от почтовых систем, таких как `postfix` (например, использующих расширение фильтра vacation `sieve`), Forward Email автоматически добавляет вашу DKIM-подпись, защищает от проблем с соединением при отправке ответов на отпуск (например, из-за распространённых проблем с SSL/TLS и устаревших серверов), а также поддерживает Open WKD и шифрование PGP для ответов на отпуск.

<!--
* Чтобы предотвратить злоупотребления, за каждое отправленное сообщение автоответчика на отпуск будет списываться 1 кредит исходящего SMTP.
  * Все платные аккаунты по умолчанию включают 300 кредитов в день. Если вам нужно больше, пожалуйста, свяжитесь с нами.
-->

1. Мы отправляем только один раз каждому [разрешённому](#do-you-have-an-allowlist) отправителю каждые 4 дня (что похоже на поведение Gmail).

   * Наш кеш Redis использует отпечаток `alias_id` и `sender`, где `alias_id` — это ID псевдонима в MongoDB, а `sender` — либо адрес From (если разрешён), либо корневой домен из адреса From (если не разрешён). Для простоты срок действия этого отпечатка в кеше установлен на 4 дня.

   * Наш подход использования корневого домена, извлечённого из адреса From для неразрешённых отправителей, предотвращает злоупотребления со стороны относительно неизвестных отправителей (например, злоумышленников), которые могут спамить сообщениями автоответчика на отпуск.

2. Мы отправляем только если MAIL FROM и/или From не пусты и не содержат (без учёта регистра) [имя пользователя postmaster](#what-are-postmaster-addresses) (часть перед @ в email).

3. Мы не отправляем, если в исходном сообщении были следующие заголовки (без учёта регистра):

   * Заголовок `auto-submitted` со значением, отличным от `no`.
   * Заголовок `x-auto-response-suppress` со значением `dr`, `autoreply`, `auto-reply`, `auto_reply` или `all`.
   * Заголовки `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` или `x-auto-respond` (независимо от значения).
   * Заголовок `precedence` со значением `bulk`, `autoreply`, `auto-reply`, `auto_reply` или `list`.

4. Мы не отправляем, если адрес MAIL FROM или From заканчивается на `+donotreply`, `-donotreply`, `+noreply` или `-noreply`.

5. Мы не отправляем, если имя пользователя в адресе From было `mdaemon` и присутствовал заголовок `X-MDDSN-Message` (без учёта регистра).

6. Мы не отправляем, если был заголовок `content-type` со значением `multipart/report` (без учёта регистра).

### Как настроить SPF для Forward Email {#how-do-i-set-up-spf-for-forward-email}

Используя страницу управления DNS у вашего регистратора, установите следующую <strong class="notranslate">TXT</strong> запись:

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
    Если вы используете Gmail (например, функцию Send Mail As) или G Suite, то вам нужно добавить <code>include:_spf.google.com</code> к значению выше, например:
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
    Если вы используете Microsoft Outlook или Live.com, вам нужно добавить <code>include:spf.protection.outlook.com</code> в вашу SPF <strong class="notranslate">TXT</strong> запись, например:
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
    Если у вас уже есть похожая строка с "v=spf1", то вам нужно добавить <code>include:spf.forwardemail.net</code> непосредственно перед любыми существующими записями "include:host.com" и перед "-all" в той же строке, например:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Обратите внимание, что существует разница между "-all" и "~all". "-" означает, что проверка SPF должна ПРОВАЛИТЬСЯ, если не совпадает, а "~" означает, что проверка SPF должна быть SOFTFAIL. Мы рекомендуем использовать подход "-all" для предотвращения подделки домена.
    <br /><br />
    Возможно, вам также потребуется включить SPF запись для того хоста, с которого вы отправляете почту (например, Outlook).
  </span>
</div>

### Как настроить DKIM для Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.

### Как настроить DMARC для Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке.

### Как просмотреть отчёты DMARC {#how-do-i-view-dmarc-reports}

Forward Email предоставляет подробную панель управления DMARC отчетами, которая позволяет отслеживать эффективность аутентификации электронной почты по всем вашим доменам из одного интерфейса.

**Что такое отчёты DMARC?**

Отчёты DMARC (Domain-based Message Authentication, Reporting, and Conformance) — это XML-файлы, отправляемые почтовыми серверами получателей, которые показывают, как проходит аутентификация ваших писем. Эти отчёты помогают понять:

* Сколько писем отправляется с вашего домена
* Проходят ли эти письма аутентификацию SPF и DKIM
* Какие действия предпринимают серверы получателей (принимают, помещают в карантин или отклоняют)
* С каких IP-адресов отправляется почта от имени вашего домена

**Как получить доступ к отчётам DMARC**

Перейдите в <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Отчёты DMARC</a>, чтобы просмотреть вашу панель управления. Вы также можете получить доступ к отчётам по конкретным доменам из <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>, нажав кнопку "DMARC" рядом с любым доменом.

**Возможности панели управления**

Панель управления DMARC отчетами предоставляет:

* **Сводные показатели**: Общее количество полученных отчётов, общее количество проанализированных сообщений, уровень соответствия SPF, уровень соответствия DKIM и общий процент прохождения
* **График сообщений во времени**: Визуальная тенденция объёма писем и уровней аутентификации за последние 30 дней
* **Сводка соответствия**: Круговая диаграмма, показывающая распределение соответствия SPF и DKIM
* **Распределение обработки сообщений**: Сложенная столбчатая диаграмма, показывающая, как серверы получателей обрабатывали ваши письма (принято, помещено в карантин или отклонено)
* **Таблица последних отчётов**: Подробный список отдельных DMARC отчётов с возможностью фильтрации и пагинации
* **Фильтрация по доменам**: Фильтрация отчётов по конкретному домену при управлении несколькими доменами
**Почему это важно**

Для организаций, управляющих несколькими доменами (например, предприятия, некоммерческие организации или агентства), отчёты DMARC необходимы для:

* **Выявления несанкционированных отправителей**: обнаружение попыток подделки вашего домена
* **Повышения доставляемости**: обеспечение прохождения аутентификации ваших легитимных писем
* **Мониторинга почтовой инфраструктуры**: отслеживание сервисов и IP-адресов, отправляющих письма от вашего имени
* **Соответствия требованиям**: поддержание видимости аутентификации электронной почты для аудитов безопасности

В отличие от других сервисов, требующих отдельные инструменты для мониторинга DMARC, Forward Email включает обработку и визуализацию отчётов DMARC в рамках вашей учётной записи без дополнительной платы.

**Требования**

* Отчёты DMARC доступны только для платных тарифов
* Ваш домен должен иметь настроенный DMARC (см. [Как настроить DMARC для Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Отчёты автоматически собираются, когда почтовые серверы получателей отправляют их на ваш настроенный адрес для DMARC-отчётов

**Еженедельные отчёты по электронной почте**

Пользователи платных тарифов автоматически получают еженедельные сводки отчётов DMARC по электронной почте. Эти письма включают:

* Сводную статистику по всем вашим доменам
* Уровни согласованности SPF и DKIM
* Разбивку по статусам сообщений (принятые, помещённые в карантин, отклонённые)
* Топ организаций, отправляющих отчёты (Google, Microsoft, Yahoo и др.)
* IP-адреса с проблемами согласованности, требующие внимания
* Прямые ссылки на панель управления отчётами DMARC

Еженедельные отчёты отправляются автоматически и не могут быть отключены отдельно от других уведомлений по электронной почте.

### Как подключить и настроить мои контакты {#how-do-i-connect-and-configure-my-contacts}

**Для настройки контактов используйте CardDAV URL:** `https://carddav.forwardemail.net` (или просто `carddav.forwardemail.net`, если ваш клиент это позволяет)

### Как подключить и настроить мои календари {#how-do-i-connect-and-configure-my-calendars}

**Для настройки календаря используйте CalDAV URL:** `https://caldav.forwardemail.net` (или просто `caldav.forwardemail.net`, если ваш клиент это позволяет)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Как добавить дополнительные календари и управлять существующими {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Если вы хотите добавить дополнительные календари, просто добавьте новый URL календаря: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**обязательно замените `calendar-name` на желаемое имя календаря**)

Вы можете изменить имя и цвет календаря после создания — просто используйте предпочитаемое приложение для календарей (например, Apple Mail или [Thunderbird](https://thunderbird.net)).

### Как подключить и настроить задачи и напоминания {#how-do-i-connect-and-configure-tasks-and-reminders}

**Для настройки задач и напоминаний используйте тот же CalDAV URL, что и для календарей:** `https://caldav.forwardemail.net` (или просто `caldav.forwardemail.net`, если ваш клиент это позволяет)

Задачи и напоминания автоматически будут отделены от событий календаря в отдельную коллекцию "Напоминания" или "Задачи".

**Инструкции по настройке для платформ:**

**macOS/iOS:**

1. Добавьте новый CalDAV аккаунт в Системных настройках > Интернет-аккаунты (или Настройки > Аккаунты на iOS)
2. Используйте `caldav.forwardemail.net` в качестве сервера
3. Введите ваш алиас Forward Email и сгенерированный пароль
4. После настройки вы увидите коллекции "Календарь" и "Напоминания"
5. Используйте приложение Напоминания для создания и управления задачами

**Android с Tasks.org:**

1. Установите Tasks.org из Google Play Store или F-Droid
2. Перейдите в Настройки > Синхронизация > Добавить аккаунт > CalDAV
3. Введите сервер: `https://caldav.forwardemail.net`
4. Введите ваш алиас Forward Email и сгенерированный пароль
5. Tasks.org автоматически обнаружит ваши календари задач

**Thunderbird:**

1. Установите дополнение Lightning, если оно ещё не установлено
2. Создайте новый календарь с типом "CalDAV"
3. Используйте URL: `https://caldav.forwardemail.net`
4. Введите ваши учётные данные Forward Email
5. События и задачи будут доступны в интерфейсе календаря

### Почему я не могу создавать задачи в macOS Напоминаниях {#why-cant-i-create-tasks-in-macos-reminders}
Если у вас возникают проблемы с созданием задач в macOS Reminders, попробуйте следующие шаги по устранению неполадок:

1. **Проверьте настройку аккаунта**: Убедитесь, что ваш CalDAV аккаунт правильно настроен с `caldav.forwardemail.net`

2. **Проверьте наличие отдельных календарей**: В вашем аккаунте должны отображаться как "Calendar", так и "Reminders". Если виден только "Calendar", поддержка задач может быть еще не полностью активирована.

3. **Обновите аккаунт**: Попробуйте удалить и заново добавить ваш CalDAV аккаунт в Системных настройках > Интернет-аккаунты

4. **Проверьте подключение к серверу**: Убедитесь, что вы можете получить доступ к `https://caldav.forwardemail.net` через браузер

5. **Проверьте учетные данные**: Убедитесь, что вы используете правильный алиас электронной почты и сгенерированный пароль (не пароль от аккаунта)

6. **Принудительная синхронизация**: В приложении Reminders попробуйте создать задачу, а затем вручную обновить синхронизацию

**Распространенные проблемы:**

* **"Календарь напоминаний не найден"**: Серверу может потребоваться время для создания коллекции Reminders при первом доступе
* **Задачи не синхронизируются**: Проверьте, что оба устройства используют одинаковые учетные данные CalDAV аккаунта
* **Смешанный контент**: Убедитесь, что задачи создаются в календаре "Reminders", а не в общем "Calendar"

### Как настроить Tasks.org на Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org — популярный менеджер задач с открытым исходным кодом, который отлично работает с поддержкой задач CalDAV от Forward Email.

**Установка и настройка:**

1. **Установите Tasks.org**:
   * Из Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Из F-Droid: [Tasks.org на F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Настройте синхронизацию CalDAV**:
   * Откройте Tasks.org
   * Перейдите в ☰ Меню > Настройки > Синхронизация
   * Нажмите "Добавить аккаунт"
   * Выберите "CalDAV"

3. **Введите настройки Forward Email**:
   * **URL сервера**: `https://caldav.forwardemail.net`
   * **Имя пользователя**: Ваш алиас Forward Email (например, `you@yourdomain.com`)
   * **Пароль**: Ваш сгенерированный пароль для алиаса
   * Нажмите "Добавить аккаунт"

4. **Обнаружение аккаунта**:
   * Tasks.org автоматически обнаружит ваши календари задач
   * Вы должны увидеть коллекцию "Reminders"
   * Нажмите "Подписаться", чтобы включить синхронизацию для календаря задач

5. **Проверьте синхронизацию**:
   * Создайте тестовую задачу в Tasks.org
   * Проверьте, что она отображается в других CalDAV клиентах (например, macOS Reminders)
   * Убедитесь, что изменения синхронизируются в обе стороны

**Доступные функции:**

* ✅ Создание и редактирование задач
* ✅ Даты выполнения и напоминания
* ✅ Завершение задач и статус
* ✅ Уровни приоритетов
* ✅ Подзадачи и иерархия задач
* ✅ Теги и категории
* ✅ Двусторонняя синхронизация с другими CalDAV клиентами

**Устранение неполадок:**

* Если календари задач не отображаются, попробуйте вручную обновить в настройках Tasks.org
* Убедитесь, что на сервере создана хотя бы одна задача (вы можете сначала создать её в macOS Reminders)
* Проверьте сетевое подключение к `caldav.forwardemail.net`

### Как настроить SRS для Forward Email {#how-do-i-set-up-srs-for-forward-email}

Мы автоматически настраиваем [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") — вам не нужно делать это самостоятельно.

### Как настроить MTA-STS для Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Пожалуйста, обратитесь к [нашему разделу о MTA-STS](#do-you-support-mta-sts) для получения дополнительной информации.

### Как добавить фотографию профиля к моему адресу электронной почты {#how-do-i-add-a-profile-picture-to-my-email-address}

Если вы используете Gmail, выполните следующие шаги:

1. Перейдите на <https://google.com> и выйдите из всех аккаунтов электронной почты
2. Нажмите "Войти" и в выпадающем меню выберите "другой аккаунт"
3. Выберите "Использовать другой аккаунт"
4. Выберите "Создать аккаунт"
5. Выберите "Использовать мой текущий адрес электронной почты"
6. Введите адрес электронной почты вашего собственного домена
7. Получите письмо с подтверждением, отправленное на ваш адрес электронной почты
8. Введите код подтверждения из этого письма
9. Заполните информацию профиля для нового аккаунта Google
10. Согласитесь со всеми политиками конфиденциальности и условиями использования
11. Перейдите на <https://google.com>, в правом верхнем углу нажмите на иконку профиля и нажмите кнопку "изменить"
12. Загрузите новую фотографию или аватар для вашего аккаунта
13. Изменения будут применены примерно через 1-2 часа, но иногда могут произойти очень быстро
14. Отправьте тестовое письмо, и фотография профиля должна появиться.
## Расширенные возможности {#advanced-features}

### Поддерживаете ли вы рассылки или почтовые списки для маркетинговых писем {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Да, вы можете узнать больше на <https://forwardemail.net/guides/newsletter-with-listmonk>.

Обратите внимание, что для поддержания репутации IP и обеспечения доставки, Forward Email проводит ручную проверку по каждому домену для **одобрения рассылок**. Напишите на <support@forwardemail.net> или откройте [запрос в службу поддержки](https://forwardemail.net/help) для получения одобрения. Обычно это занимает менее 24 часов, большинство запросов обрабатываются в течение 1-2 часов. В ближайшем будущем мы планируем сделать этот процесс мгновенным с дополнительными средствами контроля спама и оповещениями. Этот процесс гарантирует, что ваши письма попадут во входящие, а ваши сообщения не будут помечены как спам.

### Поддерживаете ли вы отправку писем через API {#do-you-support-sending-email-with-api}

Да, с мая 2023 года мы поддерживаем отправку писем через API как дополнение для всех платных пользователей.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Пожалуйста, убедитесь, что вы прочитали наши <a href="/terms" class="alert-link" target="_blank">Условия</a>, <a href="/privacy" class="alert-link" target="_blank">Политику конфиденциальности</a> и <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ограничения исходящего SMTP</a> &ndash; использование сервиса считается вашим подтверждением и согласием.
  </span>
</div>

Пожалуйста, ознакомьтесь с разделом [Письма](/email-api#outbound-emails) в нашей документации по API для вариантов, примеров и дополнительной информации.

Для отправки исходящих писем через наш API вы должны использовать ваш API токен, доступный в разделе [Моя безопасность](/my-account/security).

### Поддерживаете ли вы получение писем через IMAP {#do-you-support-receiving-email-with-imap}

Да, с 16 октября 2023 года мы поддерживаем получение писем через IMAP как дополнение для всех платных пользователей.  **Пожалуйста, прочитайте нашу подробную статью** о том, [как работает наша функция зашифрованного хранения почтового ящика SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Пожалуйста, убедитесь, что вы прочитали наши <a href="/terms" class="alert-link" target="_blank">Условия</a> и <a href="/privacy" class="alert-link" target="_blank">Политику конфиденциальности</a> &ndash; использование сервиса считается вашим подтверждением и согласием.
  </span>
</div>

1. Создайте новый алиас для вашего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы (например, <code><hello@example.com></code>)

2. Нажмите на <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> рядом с только что созданным алиасом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, отображаемый на экране.

3. Используя предпочитаемое почтовое приложение, добавьте или настройте аккаунт с вашим новым алиасом (например, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Мы рекомендуем использовать <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> или <a href="/blog/open-source" class="alert-link" target="_blank">открытое и ориентированное на конфиденциальность альтернативное ПО</a>.</span>
   </div>

4. При запросе имени IMAP сервера введите `imap.forwardemail.net`

5. При запросе порта IMAP сервера введите `993` (SSL/TLS) – при необходимости смотрите [альтернативные порты IMAP](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Если вы используете Thunderbird, убедитесь, что "Безопасность соединения" установлена в "SSL/TLS", а метод аутентификации — "Обычный пароль".</span>
   </div>
6. Когда будет запрошен пароль от IMAP-сервера, вставьте пароль из <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> на шаге 2 выше

7. **Сохраните настройки** – если у вас возникли проблемы, пожалуйста, <a href="/help">свяжитесь с нами</a>

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

### Вы поддерживаете POP3 {#do-you-support-pop3}

Да, с 4 декабря 2023 года мы поддерживаем [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) в качестве дополнения для всех платных пользователей.  **Пожалуйста, прочитайте нашу подробную статью** о том, [как работает наша функция зашифрованного хранения почтового ящика в SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Пожалуйста, убедитесь, что вы прочитали наши <a href="/terms" class="alert-link" target="_blank">Условия</a> и <a href="/privacy" class="alert-link" target="_blank">Политику конфиденциальности</a> &ndash; использование сервиса считается вашим подтверждением и согласием.
  </span>
</div>

1. Создайте новый алиас для вашего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы (например, <code><hello@example.com></code>)

2. Нажмите на <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> рядом с только что созданным алиасом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, показанный на экране.

3. Используя предпочитаемое почтовое приложение, добавьте или настройте аккаунт с вашим новым алиасом (например, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Мы рекомендуем использовать <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> или <a href="/blog/open-source" class="alert-link" target="_blank">открытое и ориентированное на конфиденциальность альтернативное ПО</a>.</span>
   </div>

4. Когда будет запрошено имя POP3-сервера, введите `pop3.forwardemail.net`

5. Когда будет запрошен порт POP3-сервера, введите `995` (SSL/TLS) – при необходимости смотрите [альтернативные порты POP3](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Если вы используете Thunderbird, убедитесь, что "Безопасность соединения" установлена в "SSL/TLS", а метод аутентификации – "Обычный пароль".</span>
   </div>

6. Когда будет запрошен пароль от POP3-сервера, вставьте пароль из <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> на шаге 2 выше

7. **Сохраните настройки** – если у вас возникли проблемы, пожалуйста, <a href="/help">свяжитесь с нами</a>

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

### Вы поддерживаете календари (CalDAV) {#do-you-support-calendars-caldav}

Да, с 5 февраля 2024 года мы добавили эту функцию. Наш сервер – `caldav.forwardemail.net`, и он также мониторится на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.
Он поддерживает как IPv4, так и IPv6 и доступен через порт `443` (HTTPS).

| Логин    | Пример                    | Описание                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com`         | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль, специфичный для псевдонима.                                                                                                                                                        |

Для использования поддержки календаря **пользователь** должен быть адресом электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> – а **пароль** должен быть сгенерированным паролем, специфичным для псевдонима.

### Вы поддерживаете задачи и напоминания (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Да, с 14 октября 2025 года мы добавили поддержку CalDAV VTODO для задач и напоминаний. Для этого используется тот же сервер, что и для поддержки календаря: `caldav.forwardemail.net`.

Наш CalDAV сервер поддерживает как события календаря (VEVENT), так и компоненты задач (VTODO) с использованием **унифицированных календарей**. Это означает, что каждый календарь может содержать как события, так и задачи, обеспечивая максимальную гибкость и совместимость со всеми CalDAV клиентами.

**Как работают календари и списки:**

* **Каждый календарь поддерживает как события, так и задачи** – Вы можете добавлять события, задачи или и то, и другое в любой календарь
* **Списки Apple Reminders** – Каждый список, который вы создаёте в Apple Reminders, становится отдельным календарём на сервере
* **Несколько календарей** – Вы можете создавать столько календарей, сколько нужно, каждый с собственным именем, цветом и организацией
* **Синхронизация между клиентами** – Задачи и события синхронизируются без проблем между всеми совместимыми клиентами

**Поддерживаемые клиенты для задач:**

* **macOS Reminders** – Полная нативная поддержка создания, редактирования, завершения и синхронизации задач
* **iOS Reminders** – Полная нативная поддержка на всех устройствах iOS
* **Tasks.org (Android)** – Популярный open-source менеджер задач с поддержкой CalDAV синхронизации
* **Thunderbird** – Поддержка задач и календаря в настольном почтовом клиенте
* **Любой CalDAV-совместимый менеджер задач** – Поддержка стандартного компонента VTODO

**Поддерживаемые функции задач:**

* Создание, редактирование и удаление задач
* Даты выполнения и начала
* Статус выполнения задачи (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Уровни приоритета задач
* Повторяющиеся задачи
* Описания и заметки к задачам
* Синхронизация на нескольких устройствах
* Подзадачи с использованием свойства RELATED-TO
* Напоминания о задачах с VALARM

Учётные данные для входа такие же, как и для поддержки календаря:

| Логин    | Пример                    | Описание                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com`         | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль, специфичный для псевдонима.                                                                                                                                                        |

**Важные замечания:**

* **Каждый список Reminders — это отдельный календарь** – При создании нового списка в Apple Reminders создаётся новый календарь на CalDAV сервере
* **Пользователи Thunderbird** – Вам нужно вручную подписаться на каждый календарь/список, который вы хотите синхронизировать, или использовать URL домашнего календаря: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Пользователи Apple** – Обнаружение календарей происходит автоматически, поэтому все ваши календари и списки появятся в Calendar.app и Reminders.app
* **Унифицированные календари** – Все календари поддерживают как события, так и задачи, что даёт вам гибкость в организации данных
### Вы поддерживаете контакты (CardDAV) {#do-you-support-contacts-carddav}

Да, с 12 июня 2025 года мы добавили эту функцию. Наш сервер — `carddav.forwardemail.net`, и он также мониторится на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает как IPv4, так и IPv6 и доступен через порт `443` (HTTPS).

| Логин    | Пример                    | Описание                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com`         | Адрес электронной почты алиаса, который существует для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль, специфичный для алиаса.                                                                                                                                                        |

Для использования поддержки контактов **пользователь** должен быть адресом электронной почты алиаса, который существует для домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> – а **пароль** должен быть сгенерированным паролем, специфичным для алиаса.

### Вы поддерживаете отправку электронной почты через SMTP {#do-you-support-sending-email-with-smtp}

Да, с мая 2023 года мы поддерживаем отправку электронной почты через SMTP как дополнительную функцию для всех платных пользователей.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Пожалуйста, убедитесь, что вы прочитали наши <a href="/terms" class="alert-link" target="_blank">Условия</a>, <a href="/privacy" class="alert-link" target="_blank">Политику конфиденциальности</a> и <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Ограничения исходящего SMTP</a> &ndash; использование считается вашим подтверждением и согласием.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Если вы используете Gmail, обратитесь к нашему <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">руководству по отправке почты как с Gmail</a>. Если вы разработчик, обратитесь к нашей <a class="alert-link" href="/email-api#outbound-emails" target="_blank">документации по email API</a>.
  </span>
</div>

1. Перейдите в <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Настройки <i class="fa fa-angle-right"></i> Конфигурация исходящего SMTP и следуйте инструкциям по настройке

2. Создайте новый алиас для вашего домена в разделе <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Алиасы (например, <code><hello@example.com></code>)

3. Нажмите на <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> рядом с недавно созданным алиасом. Скопируйте в буфер обмена и надежно сохраните сгенерированный пароль, показанный на экране.

4. Используя предпочитаемое почтовое приложение, добавьте или настройте учетную запись с вашим новым алиасом (например, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Мы рекомендуем использовать <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> или <a href="/blog/open-source" class="alert-link" target="_blank">открытое и ориентированное на конфиденциальность альтернативное решение</a>.</span>
   </div>
5. Когда будет запрошено имя SMTP-сервера, введите `smtp.forwardemail.net`

6. Когда будет запрошен порт SMTP-сервера, введите `465` (SSL/TLS) – при необходимости смотрите [альтернативные порты SMTP](/faq#what-are-your-smtp-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Если вы используете Thunderbird, убедитесь, что "Безопасность соединения" установлена на "SSL/TLS", а метод аутентификации — "Обычный пароль".</span>
   </div>

7. Когда будет запрошен пароль SMTP-сервера, вставьте пароль из <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> на шаге 3 выше

8. **Сохраните настройки и отправьте первое тестовое письмо** – если возникнут проблемы, пожалуйста, <a href="/help">свяжитесь с нами</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Обратите внимание, что для поддержания репутации IP и обеспечения доставки у нас есть процесс ручной проверки для каждого домена при одобрении исходящего SMTP. Обычно это занимает менее 24 часов, при этом большинство запросов обрабатываются в течение 1-2 часов. В ближайшем будущем мы планируем сделать этот процесс мгновенным с дополнительными средствами контроля спама и оповещениями. Этот процесс гарантирует, что ваши письма доходят до почтового ящика и не попадают в спам.
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

### Поддерживаете ли вы OpenPGP/MIME, сквозное шифрование ("E2EE") и Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Да, мы поддерживаем [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [сквозное шифрование ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) и обнаружение публичных ключей с помощью [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Вы можете настроить OpenPGP через [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) или [разместить свои ключи самостоятельно](https://wiki.gnupg.org/WKDHosting) (см. [этот gist для настройки WKD сервера](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Запросы WKD кэшируются на 1 час для обеспечения своевременной доставки почты → поэтому, если вы добавляете, изменяете или удаляете ключ WKD, пожалуйста, отправьте нам письмо на `support@forwardemail.net` с вашим адресом электронной почты, чтобы мы могли вручную очистить кэш.
* Мы поддерживаем шифрование PGP для сообщений, пересылаемых через поиск WKD или с использованием загруженного PGP-ключа в нашем интерфейсе.
* Загруженные ключи имеют приоритет, если включена/отмечена галочка PGP.
* Сообщения, отправляемые на вебхуки, в настоящее время не шифруются с помощью PGP.
* Если у вас несколько алиасов, совпадающих с данным адресом пересылки (например, комбинация regex/wildcard/exact), и более одного из них содержит загруженный PGP-ключ и отмечен PGP → мы отправим вам письмо с ошибкой и не будем шифровать сообщение вашим загруженным PGP-ключом. Это очень редко и обычно касается продвинутых пользователей с сложными правилами алиасов.
* **PGP-шифрование не применяется к пересылке почты через наши MX-серверы, если у отправителя была политика DMARC reject. Если вам нужно PGP-шифрование для *всей* почты, мы рекомендуем использовать наш IMAP-сервис и настроить ваш PGP-ключ для алиаса для входящей почты.**

**Вы можете проверить настройку Web Key Directory на <https://wkd.chimbosonic.com/> (open-source) или <https://www.webkeydirectory.com/> (проприетарный).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Автоматическое шифрование:
  </strong>
  <span>Если вы используете наш <a href="#do-you-support-sending-email-with-smtp" class="alert-link">исходящий SMTP-сервис</a> и отправляете незашифрованные сообщения, мы автоматически попытаемся зашифровать сообщения для каждого получателя с помощью <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Вы должны выполнить все следующие шаги, чтобы включить OpenPGP для вашего собственного доменного имени.
  </span>
</div>

1. Скачайте и установите рекомендуемый плагин для вашего почтового клиента ниже:

   | Почтовый клиент | Платформа | Рекомендуемый плагин                                                                                                                                                                    | Примечания                                                                                                                                                                                                                                                                                                                                                                                                                              |
   | --------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop   | [Настроить OpenPGP в Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird имеет встроенную поддержку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Gmail           | Browser   | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (проприетарная лицензия)                                                                           | Gmail не поддерживает OpenPGP, однако вы можете скачать открытый плагин [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                          |
   | Apple Mail      | macOS     | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                            | Apple Mail не поддерживает OpenPGP, однако вы можете скачать открытый плагин [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                               |
   | Apple Mail      | iOS       | [PGPro](https://github.com/opensourceios/PGPro/) или [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (проприетарная лицензия)                         | Apple Mail не поддерживает OpenPGP, однако вы можете скачать открытый плагин [PGPro](https://github.com/opensourceios/PGPro/) или [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                        |
   | Outlook         | Windows   | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                            | Почтовый клиент Outlook для настольных ПК не поддерживает OpenPGP, однако вы можете скачать открытый плагин [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                              |
   | Outlook         | Browser   | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (проприетарная лицензия)                                                                           | Веб-почтовый клиент Outlook не поддерживает OpenPGP, однако вы можете скачать открытый плагин [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Android         | Mobile    | [OpenKeychain](https://www.openkeychain.org/) или [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Почтовые клиенты Android](/blog/open-source/android-email-clients), такие как [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) и [FairEmail](https://github.com/M66B/FairEmail), поддерживают открытый плагин [OpenKeychain](https://www.openkeychain.org/). В качестве альтернативы можно использовать открытый (проприетарная лицензия) плагин [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Browser   | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (проприетарная лицензия)                                                                           | Вы можете скачать открытое расширение для браузера [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                               |
   | Mozilla Firefox | Browser   | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (проприетарная лицензия)                                                                           | Вы можете скачать открытое расширение для браузера [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                               |
   | Microsoft Edge  | Browser   | [Mailvelope](https://mailvelope.com/)                                                                                                                                                   | Вы можете скачать открытое расширение для браузера [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                              |
   | Brave           | Browser   | [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download) (проприетарная лицензия)                                                                           | Вы можете скачать открытое расширение для браузера [Mailvelope](https://mailvelope.com/) или [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                               |
   | Balsa           | Desktop   | [Настроить OpenPGP в Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                              | Balsa имеет встроенную поддержку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                              |
   | KMail           | Desktop   | [Настроить OpenPGP в KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                   | KMail имеет встроенную поддержку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                              |
   | GNOME Evolution | Desktop   | [Настроить OpenPGP в Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                                 | GNOME Evolution имеет встроенную поддержку OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                    |
   | Terminal        | Desktop   | [Настроить gpg в Терминале](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Вы можете использовать открытый [инструмент командной строки gpg](https://www.gnupg.org/download/) для генерации нового ключа из командной строки.                                                                                                                                                                                                                                                                                      |
2. Откройте плагин, создайте свой публичный ключ и настройте почтовый клиент для его использования.

3. Загрузите свой публичный ключ на <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Вы можете посетить <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>, чтобы управлять своим ключом в будущем.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Дополнительная опция:
     </strong>
     <span>
       Если вы используете наш сервис <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">шифрованного хранилища (IMAP/POP3)</a> и хотите, чтобы <i>вся</i> почта, хранящаяся в вашей (уже зашифрованной) базе данных SQLite, была зашифрована вашим публичным ключом, перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Редактировать <i class="fa fa-angle-right"></i> OpenPGP и загрузите свой публичный ключ.
     </span>
   </div>

4. Добавьте новую запись `CNAME` в ваш домен (например, `example.com`):

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
     <span>Если ваш псевдоним использует наши <a class="alert-link" href="/disposable-addresses" target="_blank">временные/уникальные домены</a> (например, <code>hideaddress.net</code>), то этот шаг можно пропустить.</span>
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

### Вы поддерживаете шифрование S/MIME {#do-you-support-smime-encryption}

Да, мы поддерживаем шифрование [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME), определённое в [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME обеспечивает сквозное шифрование с использованием сертификатов X.509, которые широко поддерживаются корпоративными почтовыми клиентами.

Мы поддерживаем как RSA, так и ECC (криптография на эллиптических кривых) сертификаты:

* **RSA сертификаты**: минимум 2048 бит, рекомендуется 4096 бит
* **ECC сертификаты**: кривые NIST P-256, P-384 и P-521

Чтобы настроить шифрование S/MIME для вашего псевдонима:

1. Получите сертификат S/MIME у доверенного центра сертификации (CA) или создайте самоподписанный сертификат для тестирования.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Совет:
     </strong>
     <span>Бесплатные сертификаты S/MIME доступны у таких провайдеров, как <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> или <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Экспортируйте свой сертификат в формате PEM (только публичный сертификат, без приватного ключа).

3. Перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы (например, <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Редактировать <i class="fa fa-angle-right"></i> S/MIME и загрузите свой публичный сертификат.
4. После настройки все входящие письма на ваш псевдоним будут зашифрованы с использованием вашего сертификата S/MIME перед сохранением или пересылкой.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Примечание:
     </strong>
     <span>
       Шифрование S/MIME применяется к входящим сообщениям, которые ещё не зашифрованы. Если сообщение уже зашифровано с помощью OpenPGP или S/MIME, оно не будет повторно зашифровано.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Важно:
     </strong>
     <span>
       Шифрование S/MIME не будет применяться к пересылке электронной почты через наши MX-серверы, если у отправителя была политика DMARC с действием reject. Если вам требуется шифрование S/MIME для <em>всей</em> почты, мы рекомендуем использовать наш IMAP-сервис и настроить ваш сертификат S/MIME для псевдонима для входящей почты.
     </span>
   </div>

Следующие почтовые клиенты имеют встроенную поддержку S/MIME:

| Почтовый клиент   | Платформа | Примечания                                                                                                         |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Встроенная поддержка S/MIME. Перейдите в Mail > Preferences > Accounts > ваша учётная запись > Trust для настройки сертификатов. |
| Apple Mail        | iOS      | Встроенная поддержка S/MIME. Перейдите в Settings > Mail > Accounts > ваша учётная запись > Advanced > S/MIME для настройки. |
| Microsoft Outlook | Windows  | Встроенная поддержка S/MIME. Перейдите в File > Options > Trust Center > Trust Center Settings > Email Security для настройки. |
| Microsoft Outlook | macOS    | Встроенная поддержка S/MIME. Перейдите в Tools > Accounts > Advanced > Security для настройки.                   |
| Thunderbird       | Desktop  | Встроенная поддержка S/MIME. Перейдите в Account Settings > End-To-End Encryption > S/MIME для настройки.        |
| GNOME Evolution   | Desktop  | Встроенная поддержка S/MIME. Перейдите в Edit > Preferences > Mail Accounts > ваша учётная запись > Security для настройки. |
| KMail             | Desktop  | Встроенная поддержка S/MIME. Перейдите в Settings > Configure KMail > Identities > ваша учётная запись > Cryptography для настройки. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Поздравляем!
    </strong>
    <span>
      Вы успешно настроили шифрование S/MIME для вашего псевдонима.
    </span>
  </div>
</div>

### Вы поддерживаете фильтрацию электронной почты Sieve {#do-you-support-sieve-email-filtering}

Да! Мы поддерживаем [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) фильтрацию электронной почты, определённую в [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve — это мощный стандартизированный язык сценариев для серверной фильтрации почты, который позволяет автоматически организовывать, фильтровать и отвечать на входящие сообщения.

#### Поддерживаемые расширения Sieve {#supported-sieve-extensions}

Мы поддерживаем полный набор расширений Sieve:

| Расширение                  | RFC                                                                                   | Описание                                         |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Помещать сообщения в определённые папки          |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                             | Отклонять сообщения с ошибкой                     |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                             | Автоматические ответы о отпуске/отсутствии        |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                             | Точные интервалы ответов об отпуске               |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                             | Установка флагов IMAP (\Seen, \Flagged и др.)    |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Проверка отправителя/получателя конверта          |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                             | Проверка содержимого тела сообщения               |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                             | Хранение и использование переменных в скриптах   |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                             | Реляционные сравнения (больше, меньше)            |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                             | Числовые сравнения                                |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                             | Копирование сообщений при переадресации           |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                             | Добавление или удаление заголовков сообщений      |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Проверка значений даты/времени                     |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Доступ к конкретным вхождениям заголовков         |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)| Сопоставление с регулярными выражениями           |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                             | Отправка уведомлений (например, mailto:)           |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                             | Доступ к информации об окружении                   |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                             | Проверка существования почтового ящика, создание ящиков |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                             | Помещение в специальные почтовые ящики (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                             | Обнаружение дублирующих сообщений                  |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                             | Проверка доступности расширения                    |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                             | Доступ к частям адреса user+detail                 |
#### Расширения, которые не поддерживаются {#extensions-not-supported}

Следующие расширения в настоящее время не поддерживаются:

| Расширение                                                    | Причина                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                    | Риск безопасности (внедрение скриптов) и требует глобального хранения скриптов |
| `mboxmetadata` / `servermetadata`                            | Требуется поддержка расширения IMAP METADATA                       |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Сложная манипуляция MIME-деревом пока не реализована               |

#### Примеры скриптов Sieve {#example-sieve-scripts}

**Сортировка рассылок в папку:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Автоответ при отпуске:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "В данный момент я отсутствую в офисе и отвечу по возвращении.";
```

**Отметить сообщения от важных отправителей:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Отклонять спам с определёнными темами:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Сообщение отклонено из-за спам-содержимого.";
}
```

#### Управление скриптами Sieve {#managing-sieve-scripts}

Вы можете управлять своими скриптами Sieve несколькими способами:

1. **Веб-интерфейс**: Перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы <i class="fa fa-angle-right"></i> Скрипты Sieve для создания и управления скриптами.

2. **Протокол ManageSieve**: Подключайтесь с помощью любого клиента, совместимого с ManageSieve (например, дополнение Sieve для Thunderbird или [sieve-connect](https://github.com/philpennock/sieve-connect)) к `imap.forwardemail.net`. Используйте порт `2190` с STARTTLS (рекомендуется для большинства клиентов) или порт `4190` с неявным TLS.

3. **API**: Используйте наш [REST API](/api#sieve-scripts) для программного управления скриптами.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Примечание:
  </strong>
  <span>
    Фильтрация Sieve применяется к входящим сообщениям до их сохранения в вашем почтовом ящике. Скрипты выполняются в порядке приоритета, и первое совпадающее действие определяет, как будет обработано сообщение.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Безопасность:
  </strong>
  <span>
    Для безопасности количество действий перенаправления ограничено 10 на скрипт и 100 в день. Ответы в отпуске ограничены по частоте, чтобы предотвратить злоупотребления.
  </span>
</div>

### Поддерживаете ли вы MTA-STS {#do-you-support-mta-sts}

Да, с 2 марта 2023 года мы поддерживаем [MTA-STS](https://www.hardenize.com/blog/mta-sts). Вы можете использовать [этот шаблон](https://github.com/jpawlowski/mta-sts.template), если хотите включить его на своём домене.

Нашу конфигурацию можно найти публично на GitHub по адресу <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Поддерживаете ли вы passkeys и WebAuthn {#do-you-support-passkeys-and-webauthn}

Да! С 13 декабря 2023 года мы добавили поддержку passkeys [из-за высокого спроса](https://github.com/orgs/forwardemail/discussions/182).

Passkeys позволяют безопасно входить без пароля и двухфакторной аутентификации.

Вы можете подтвердить свою личность с помощью касания, распознавания лица, пароля устройства или PIN-кода.

Мы позволяем управлять до 30 passkeys одновременно, чтобы вы могли легко входить со всех своих устройств.

Узнайте больше о passkeys по следующим ссылкам:

* [Вход в приложения и сайты с помощью passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Использование passkeys для входа в приложения и сайты на iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Статья в Википедии о Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Вы поддерживаете лучшие практики электронной почты {#do-you-support-email-best-practices}

Да. У нас встроена поддержка SPF, DKIM, DMARC, ARC и SRS во всех тарифных планах. Мы также тесно сотрудничали с оригинальными авторами этих спецификаций и другими экспертами по электронной почте, чтобы обеспечить совершенство и высокую доставляемость.

### Вы поддерживаете bounce вебхуки {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Совет:
  </strong>
    Ищете документацию по вебхукам электронной почты? Смотрите <a href="/faq#do-you-support-webhooks" class="alert-link">Вы поддерживаете вебхуки?</a> для получения дополнительной информации.
  <span>
  </span>
</div>

Да, с 14 августа 2024 года мы добавили эту функцию. Теперь вы можете перейти в Мой аккаунт → Домены → Настройки → URL вебхука bounce и настроить URL `http://` или `https://`, на который мы будем отправлять `POST` запросы всякий раз, когда исходящие SMTP письма возвращаются с ошибкой.

Это полезно для управления и мониторинга исходящей SMTP почты – и может использоваться для поддержки подписчиков, отказа от подписки и обнаружения случаев bounce.

Данные вебхука bounce отправляются в формате JSON со следующими свойствами:

* `email_id` (String) - ID письма, соответствующий письму в Мой аккаунт → Письма (исходящий SMTP)
* `list_id` (String) - значение заголовка `List-ID` (без учета регистра), если есть, из исходного исходящего письма
* `list_unsubscribe` (String) - значение заголовка `List-Unsubscribe` (без учета регистра), если есть, из исходного исходящего письма
* `feedback_id` (String) - значение заголовка `Feedback-ID` (без учета регистра), если есть, из исходного исходящего письма
* `recipient` (String) - адрес электронной почты получателя, который вызвал bounce или ошибку
* `message` (String) - подробное сообщение об ошибке bounce
* `response` (String) - сообщение ответа SMTP
* `response_code` (Number) - разобранный код ответа SMTP
* `truth_source` (String) - если код ответа пришел из доверенного источника, это значение будет содержать корневое доменное имя (например, `google.com` или `yahoo.com`)
* `bounce` (Object) - объект, содержащий следующие свойства, описывающие bounce и статус отклонения
  * `action` (String) - действие bounce (например, `"reject"`)
  * `message` (String) - причина bounce (например, `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - категория bounce (например, `"block"`)
  * `code` (Number) - код статуса bounce (например, `554`)
  * `status` (String) - код bounce из сообщения ответа (например, `5.7.1`)
  * `line` (Number) - разобранный номер строки, если есть, [из списка парсинга bounce Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (например, `526`)
* `headers` (Object) - пары ключ-значение заголовков исходящего письма
* `bounced_at` (String) - дата в формате [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), когда произошла ошибка bounce

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

Вот несколько дополнительных замечаний по поводу bounce вебхуков:

* Если полезная нагрузка вебхука содержит значения `list_id`, `list_unsubscribe` или `feedback_id`, то при необходимости следует принять соответствующие меры для удаления `recipient` из списка.
  * Если значение `bounce.category` было одним из `"block"`, `"recipient"`, `"spam"` или `"virus"`, то пользователя определенно следует удалить из списка.
* Если вам нужно проверить полезную нагрузку вебхука (чтобы убедиться, что она действительно приходит с нашего сервера), вы можете [определить имя хоста удаленного клиента по IP-адресу с помощью обратного поиска](https://nodejs.org/api/dns.html#dnspromisesreverseip) – оно должно быть `smtp.forwardemail.net`.
  * Также можно проверить IP-адрес по [нашим опубликованным IP-адресам](#what-are-your-servers-ip-addresses).
  * Перейдите в Мой аккаунт → Домены → Настройки → Ключ проверки подписи полезной нагрузки вебхука, чтобы получить ваш ключ вебхука.
    * Вы можете в любой момент сменить этот ключ по соображениям безопасности.
    * Рассчитайте и сравните значение `X-Webhook-Signature` из нашего запроса вебхука с вычисленным значением тела с использованием этого ключа. Пример того, как это сделать, доступен в [этом ответе на Stack Overflow](https://stackoverflow.com/a/68885281).
  * Подробнее смотрите обсуждение на <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Мы будем ждать до `5` секунд, чтобы ваш вебхук ответил с кодом статуса `200`, и повторим попытку до `1` раза.
* Если мы обнаружим ошибку при попытке отправить запрос на ваш URL вебхука bounce, мы будем отправлять вам вежливое письмо раз в неделю.
### Вы поддерживаете вебхуки {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Совет:
  </strong>
    Ищете документацию по вебхукам bounce? Смотрите <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Вы поддерживаете bounce вебхуки?</a> для получения дополнительной информации.
  <span>
  </span>
</div>

Да, с 15 мая 2020 года мы добавили эту функцию. Вы можете просто добавить вебхук(и) так же, как и любого получателя! Пожалуйста, убедитесь, что в URL вебхука указан префикс протокола "http" или "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Усиленная защита конфиденциальности:
  </strong>
  <span>
    Если вы используете платный тариф (который включает усиленную защиту конфиденциальности), перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> и нажмите на "Псевдонимы" рядом с вашим доменом, чтобы настроить вебхуки. Если хотите узнать больше о платных тарифах, смотрите нашу страницу <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Цены</a>. В противном случае вы можете продолжить следовать инструкциям ниже.
  </span>
</div>

Если вы используете бесплатный тариф, просто добавьте новую DNS-запись <strong class="notranslate">TXT</strong>, как показано ниже:

Например, если я хочу, чтобы все письма, отправленные на `alias@example.com`, пересылались на новый тестовый endpoint [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

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

Или, возможно, вы хотите, чтобы все письма, отправленные на `example.com`, пересылались на этот endpoint:

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

**Вот дополнительные заметки по вебхукам:**

* Если вам нужно проверить полезную нагрузку вебхука (чтобы убедиться, что она действительно приходит с нашего сервера), вы можете [разрешить IP-адрес клиента и имя хоста клиента с помощью обратного поиска](https://nodejs.org/api/dns.html#dnspromisesreverseip) – это должен быть либо `mx1.forwardemail.net`, либо `mx2.forwardemail.net`.
  * Вы также можете проверить IP-адрес по [нашим опубликованным IP-адресам](#what-are-your-servers-ip-addresses).
  * Если вы на платном тарифе, перейдите в Мой аккаунт → Домены → Настройки → Ключ проверки подписи полезной нагрузки вебхука, чтобы получить ваш ключ вебхука.
    * Вы можете в любой момент сменить этот ключ по соображениям безопасности.
    * Рассчитайте и сравните значение `X-Webhook-Signature` из нашего запроса вебхука с вычисленным значением тела с использованием этого ключа. Пример того, как это сделать, доступен в [этом ответе на Stack Overflow](https://stackoverflow.com/a/68885281).
  * Смотрите обсуждение на <https://github.com/forwardemail/free-email-forwarding/issues/235> для дополнительной информации.
* Если вебхук не отвечает с кодом состояния `200`, мы сохраним его ответ в [журнале ошибок](#do-you-store-error-logs) – что полезно для отладки.
* HTTP-запросы вебхуков будут повторяться до 3 раз при каждой попытке SMTP-соединения, с максимальным таймаутом 60 секунд на POST-запрос к endpoint. **Обратите внимание, что это не означает, что повтор будет только 3 раза**, на самом деле повтор будет происходить непрерывно с течением времени, отправляя SMTP-код 421 (что означает отправителю "повторите позже") после 3-й неудачной попытки HTTP POST. Это значит, что письмо будет пытаться отправляться непрерывно в течение нескольких дней, пока не будет получен код состояния 200.
* Мы будем автоматически повторять попытки на основе стандартных кодов состояния и ошибок, используемых в [методе retry библиотеки superagent](https://ladjs.github.io/superagent/#retrying-requests) (мы являемся мейнтейнерами).
* Мы группируем HTTP-запросы вебхуков к одному и тому же endpoint в один запрос вместо нескольких, чтобы экономить ресурсы и ускорять время отклика. Например, если вы отправляете письмо на <webhook1@example.com>, <webhook2@example.com> и <webhook3@example.com>, и все они настроены на один и тот же *точный* URL endpoint, будет выполнен только один запрос. Группировка происходит по точному совпадению endpoint с строгим равенством.
* Обратите внимание, что мы используем метод "simpleParser" из библиотеки [mailparser](https://nodemailer.com/extras/mailparser/) для преобразования сообщения в объект, удобный для JSON.
* Исходное значение письма в виде строки доступно в свойстве "raw".
* Результаты аутентификации доступны в свойствах "dkim", "spf", "arc", "dmarc" и "bimi".
* Разобранные заголовки письма доступны в свойстве "headers" – также можно использовать "headerLines" для удобной итерации и парсинга.
* Группированные получатели для этого вебхука собраны вместе и доступны в свойстве "recipients".
* Информация о SMTP-сессии доступна в свойстве "session". Она содержит информацию об отправителе сообщения, времени поступления сообщения, HELO и имени хоста клиента. Значение имени хоста клиента в `session.clientHostname` – это либо FQDN (из обратного PTR-запроса), либо `session.remoteAddress` в скобках (например, `"[127.0.0.1]"`).
* Если вам нужно быстро получить значение `X-Original-To`, вы можете использовать значение `session.recipient` (см. пример ниже). Заголовок `X-Original-To` – это заголовок, который мы добавляем в сообщения для отладки с оригинальным получателем (до маскированной пересылки) сообщения.
* Если нужно удалить свойства `attachments` и/или `raw` из тела полезной нагрузки, просто добавьте `?attachments=false`, `?raw=false` или `?attachments=false&raw=false` к URL вашего webhook endpoint в качестве параметров строки запроса (например, `https://example.com/webhook?attachments=false&raw=false`).
* Если есть вложения, они будут добавлены в массив `attachments` в виде значений Buffer. Вы можете распарсить их обратно в содержимое, используя подход на JavaScript, например:
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

### Вы поддерживаете регулярные выражения или regex {#do-you-support-regular-expressions-or-regex}

Да, с 27 сентября 2021 года мы добавили эту функцию. Вы можете просто писать регулярные выражения ("regex") для сопоставления алиасов и выполнения подстановок.

Алиасы с поддержкой регулярных выражений — это те, которые начинаются с `/` и заканчиваются на `/`, а их получатели — это адреса электронной почты или вебхуки. Получатели также могут включать поддержку подстановок regex (например, `$1`, `$2`).

Мы поддерживаем два флага регулярных выражений, включая `i` и `g`. Флаг `i` для нечувствительности к регистру является постоянным значением по умолчанию и всегда применяется. Глобальный флаг `g` вы можете добавить, дописав в конце `/` `/g`.

Обратите внимание, что мы также поддерживаем нашу <a href="#can-i-disable-specific-aliases">функцию отключения алиасов</a> для части получателя с поддержкой regex.

Регулярные выражения не поддерживаются на <a href="/disposable-addresses" target="_blank">глобальных vanity-доменах</a> (так как это может быть уязвимостью безопасности).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Усиленная защита конфиденциальности:
  </strong>
  <span>
    Если вы используете платный тариф (который включает усиленную защиту конфиденциальности), пожалуйста, перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> и нажмите на "Алиасы" рядом с вашим доменом, чтобы настроить алиасы, включая те, что с регулярными выражениями. Если вы хотите узнать больше о платных тарифах, смотрите нашу страницу <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Цены</a>.
  </span>
</div>

#### Примеры для усиленной защиты конфиденциальности {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Имя алиаса</th>
      <th>Эффект</th>
      <th>Тест</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Письма на `linus@example.com` или `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">просмотреть тест на RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Письма на `24highst@example.com` или `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">просмотреть тест на RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Совет:
  </strong>
    Чтобы протестировать их на <a href="https://regexr.com" class="alert-link">RegExr</a>, напишите выражение в верхнем поле, а затем введите пример алиаса в текстовом поле ниже. Если совпадение есть, оно станет синим.
  <span>
  </span>
</div>

#### Примеры для бесплатного плана {#examples-for-the-free-plan}

Если вы используете бесплатный план, просто добавьте новую DNS-запись <strong class="notranslate">TXT</strong>, используя один или несколько приведённых ниже примеров:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Простой пример:</strong> Если я хочу, чтобы все письма, отправленные на `linus@example.com` или `torvalds@example.com`, пересылались на `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Имя/Хост/Алиас</th>
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
  <strong>Пример подстановки Имя Фамилия:</strong> Представьте, что все адреса электронной почты вашей компании имеют формат `firstname.lastname@example.com`. Если я хочу, чтобы все письма, отправленные на шаблон `firstname.lastname@example.com`, пересылались на `firstname.lastname@company.com` с поддержкой подстановок (<a href="https://regexr.com/66hnu" class="alert-link">просмотреть тест на RegExr</a>):
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
  <strong>Пример подстановки фильтрации с плюсом:</strong> Если я хочу, чтобы все письма, отправленные на `info@example.com` или `support@example.com`, пересылались на `user+info@gmail.com` или `user+support@gmail.com` соответственно (с поддержкой подстановок) (<a href="https://regexr.com/66ho7" class="alert-link">просмотреть тест на RegExr</a>):
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
  <strong>Пример подстановки querystring для webhook:</strong> Возможно, вы хотите, чтобы все письма, отправленные на `example.com`, перенаправлялись на <a href="#do-you-support-webhooks" class="alert-link">webhook</a> с динамическим ключом querystring "to" и значением, равным части имени пользователя из адреса электронной почты (<a href="https://regexr.com/66ho4" class="alert-link">просмотреть тест на RegExr</a>):
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
  <strong>Пример тихого отклонения:</strong> Если вы хотите, чтобы все письма, соответствующие определённому шаблону, были отключены и тихо отклонялись (отправителю кажется, что сообщение успешно отправлено, но на самом деле оно никуда не доставляется) с кодом статуса `250` (см. <a href="#can-i-disable-specific-aliases" class="alert-link">Могу ли я отключить конкретные псевдонимы</a>), просто используйте тот же подход с одним восклицательным знаком "!". Это указывает отправителю, что сообщение было успешно доставлено, но на самом деле оно никуда не попало (например, черная дыра или `/dev/null`).
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
  <strong>Пример мягкого отклонения:</strong> Если вы хотите, чтобы все письма, соответствующие определённому шаблону, были отключены и мягко отклонялись с кодом статуса `421` (см. <a href="#can-i-disable-specific-aliases" class="alert-link">Могу ли я отключить конкретные псевдонимы</a>), просто используйте тот же подход с двумя восклицательными знаками "!!". Это указывает отправителю повторить попытку отправки письма, и письма на этот псевдоним будут повторно пытаться доставляться примерно в течение 5 дней, а затем окончательно отклонены.
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
  <strong>Пример жесткого отклонения:</strong> Если вы хотите, чтобы все письма, соответствующие определенному шаблону, были отключены и жестко отклонялись с кодом состояния `550` (см. <a href="#can-i-disable-specific-aliases" class="alert-link">Могу ли я отключить конкретные псевдонимы</a>), просто используйте тот же подход с тройным восклицательным знаком "!!!". Это указывает отправителю на постоянную ошибку, и письма не будут повторно отправляться, они будут отклонены для этого псевдонима.
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
    Интересно, как написать регулярное выражение или нужно протестировать замену? Вы можете перейти на бесплатный сайт для тестирования регулярных выражений <a href="https://regexr.com" class="alert-link">RegExr</a> по адресу <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Каковы ваши ограничения на исходящие SMTP {#what-are-your-outbound-smtp-limits}

Мы ограничиваем пользователей и домены до 300 исходящих SMTP сообщений в сутки. Это в среднем более 9000 писем в календарном месяце. Если вам нужно превысить этот объем или у вас постоянно большие письма, пожалуйста, [свяжитесь с нами](https://forwardemail.net/help).

### Нужно ли одобрение для включения SMTP {#do-i-need-approval-to-enable-smtp}

Да, обратите внимание, что для поддержания репутации IP и обеспечения доставляемости, Forward Email проводит ручную проверку для каждого домена для одобрения исходящего SMTP. Напишите на <support@forwardemail.net> или откройте [запрос в службу поддержки](https://forwardemail.net/help) для получения одобрения. Обычно это занимает менее 24 часов, большинство запросов обрабатываются в течение 1-2 часов. В ближайшем будущем мы планируем сделать этот процесс мгновенным с дополнительными средствами контроля спама и оповещениями. Этот процесс гарантирует, что ваши письма попадут в почтовый ящик, а ваши сообщения не будут помечены как спам.

### Каковы настройки конфигурации вашего SMTP сервера {#what-are-your-smtp-server-configuration-settings}

Наш сервер — `smtp.forwardemail.net`, он также мониторится на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает как IPv4, так и IPv6 и доступен через порты `465` и `2465` для SSL/TLS (рекомендуется) и `587`, `2587`, `2525` и `25` для TLS (STARTTLS).

**Начиная с октября 2025 года**, мы теперь поддерживаем **устаревшие подключения TLS 1.0** на портах `2455` (SSL/TLS) и `2555` (STARTTLS) для старых устройств, таких как принтеры, сканеры, камеры и устаревшие почтовые клиенты, которые не могут поддерживать современные версии TLS. Эти порты предоставляются как альтернатива Gmail, Yahoo, Outlook и другим провайдерам, которые прекратили поддержку старых протоколов TLS.

> \[!CAUTION]
> **Поддержка устаревшего TLS 1.0 (порты 2455 и 2555)**: Эти порты используют устаревший протокол TLS 1.0, который имеет известные уязвимости безопасности (BEAST, POODLE). Используйте эти порты только если ваше устройство абсолютно не поддерживает TLS 1.2 или выше. Мы настоятельно рекомендуем обновить прошивку устройства или перейти на современные почтовые клиенты, когда это возможно. Эти порты предназначены исключительно для совместимости с устаревшим оборудованием (старые принтеры, сканеры, камеры, устройства IoT).

|                                     Протокол                                     | Имя хоста               |            Порты            |        IPv4        |        IPv6        | Примечания                             |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Рекомендуется**                         | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Современный TLS 1.2+ (Рекомендуется)  |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Поддерживается (предпочтительно порт SSL/TLS `465`) |
|                             `SSL/TLS` **Только устаревший**                      | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 только для старых устройств |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Только устаревший** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 только для старых устройств |
| Логин    | Пример                    | Описание                                                                                                                                                                                 |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com`         | Адрес электронной почты алиаса, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль   | `************************` | Алиас                                                                                                                                                                                    |

Для отправки исходящей почты через SMTP **пользователь SMTP** должен быть адресом электронной почты алиаса, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> – а **пароль SMTP** должен быть сгенерированным паролем, специфичным для алиаса.

Пожалуйста, обратитесь к [Поддерживаете ли вы отправку почты через SMTP](#do-you-support-sending-email-with-smtp) для пошаговых инструкций.

### Каковы настройки конфигурации вашего IMAP сервера {#what-are-your-imap-server-configuration-settings}

Наш сервер — `imap.forwardemail.net`, и он также мониторится на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает как IPv4, так и IPv6 и доступен на портах `993` и `2993` для SSL/TLS.

|         Протокол         | Имя хоста               |     Порты     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Предпочтительно** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Логин    | Пример                    | Описание                                                                                                                                                                                 |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com`         | Адрес электронной почты алиаса, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль   | `************************` | Сгенерированный пароль, специфичный для алиаса.                                                                                                                                           |

Для подключения через IMAP **пользователь IMAP** должен быть адресом электронной почты алиаса, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> – а **пароль IMAP** должен быть сгенерированным паролем, специфичным для алиаса.

Пожалуйста, обратитесь к [Поддерживаете ли вы получение почты через IMAP](#do-you-support-receiving-email-with-imap) для пошаговых инструкций.

### Каковы настройки конфигурации вашего POP3 сервера {#what-are-your-pop3-server-configuration-settings}

Наш сервер — `pop3.forwardemail.net`, и он также мониторится на нашей <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">странице статуса</a>.

Он поддерживает как IPv4, так и IPv6 и доступен на портах `995` и `2995` для SSL/TLS.

|         Протокол         | Имя хоста               |     Порты     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Предпочтительно** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Логин    | Пример                    | Описание                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Имя пользователя | `user@example.com`         | Адрес электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>. |
| Пароль | `************************` | Сгенерированный пароль, специфичный для псевдонима.                                                                                                                                                        |

Для подключения через POP3 **пользователь POP3** должен быть адресом электронной почты псевдонима, который существует для домена в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> – а **пароль IMAP** должен быть сгенерированным паролем, специфичным для псевдонима.

Пожалуйста, обратитесь к [Поддерживаете ли вы POP3](#do-you-support-pop3) для пошаговых инструкций.

### Как настроить автоконфигурацию электронной почты для моего домена {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Автоконфигурация электронной почты позволяет почтовым клиентам, таким как **Thunderbird**, **Apple Mail**, **Microsoft Outlook** и мобильным устройствам автоматически определять правильные настройки серверов IMAP, SMTP, POP3, CalDAV и CardDAV при добавлении пользователем своей учетной записи электронной почты. Это определено в [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (электронная почта) и [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) и использует DNS SRV записи.

Forward Email публикует записи автоконфигурации на `forwardemail.net`. Вы можете либо добавить SRV записи напрямую в ваш домен, либо использовать более простой подход с CNAME.

#### Вариант A: CNAME записи (самый простой) {#option-a-cname-records-simplest}

Добавьте эти две CNAME записи в DNS вашего домена. Это делегирует автоконфигурацию серверам Forward Email:

|  Тип  | Имя/Хост      | Цель/Значение                    |
| :---: | -------------- | ------------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`   |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Запись `autoconfig` используется **Thunderbird** и другими клиентами на базе Mozilla. Запись `autodiscover` используется **Microsoft Outlook**.

#### Вариант B: SRV записи (прямое добавление) {#option-b-srv-records-direct}

Если вы предпочитаете добавить записи напрямую (или ваш DNS-провайдер не поддерживает CNAME для поддоменов), добавьте эти SRV записи в ваш домен:

| Тип | Имя/Хост           | Приоритет | Вес | Порт | Цель/Значение               | Назначение                                |
| :--: | ------------------- | :------: | :----: | :--: | -------------------------- | -------------------------------------- |
|  SRV | `_imaps._tcp`       |     0    |    1   |  993 | `imap.forwardemail.net`    | IMAP через SSL/TLS (предпочтительно)          |
|  SRV | `_imap._tcp`        |     0    |    0   |   0  | `.`                        | Обычный IMAP отключен                |
|  SRV | `_submissions._tcp` |     0    |    1   |  465 | `smtp.forwardemail.net`    | Отправка SMTP (SSL/TLS, рекомендуется) |
|  SRV | `_submission._tcp`  |     5    |    1   |  587 | `smtp.forwardemail.net`    | Отправка SMTP (STARTTLS)             |
|  SRV | `_pop3s._tcp`       |    10    |    1   |  995 | `pop3.forwardemail.net`    | POP3 через SSL/TLS                      |
|  SRV | `_pop3._tcp`        |     0    |    0   |   0  | `.`                        | Обычный POP3 отключен                |
|  SRV | `_caldavs._tcp`     |     0    |    1   |  443 | `caldav.forwardemail.net`  | CalDAV через TLS (календари)            |
|  SRV | `_caldav._tcp`      |     0    |    0   |   0  | `.`                        | Обычный CalDAV отключен              |
|  SRV | `_carddavs._tcp`    |     0    |    1   |  443 | `carddav.forwardemail.net` | CardDAV через TLS (контакты)            |
|  SRV | `_carddav._tcp`     |     0    |    0   |   0  | `.`                        | Обычный CardDAV отключен             |
> \[!NOTE]
> IMAP имеет более низкое значение приоритета (0), чем POP3 (10), что указывает почтовым клиентам предпочитать IMAP перед POP3, когда доступны оба протокола. Записи с целью `.` (одна точка) означают, что версии этих протоколов в открытом виде (без шифрования) намеренно отключены согласно [RFC 6186 Раздел 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). SRV-записи CalDAV и CardDAV соответствуют [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) для автодетекции календарей и контактов.

#### Какие почтовые клиенты поддерживают автодетекцию? {#which-email-clients-support-autodiscovery}

| Клиент             | Электронная почта                                | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME или SRV-записи                | `autoconfig` XML или SRV-записи (RFC 6764) |
| Apple Mail (macOS) | SRV-записи (RFC 6186)                           | SRV-записи (RFC 6764)                     |
| Apple Mail (iOS)   | SRV-записи (RFC 6186)                           | SRV-записи (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME или `_autodiscover._tcp` SRV | Не поддерживается                         |
| GNOME (Evolution)  | SRV-записи (RFC 6186)                           | SRV-записи (RFC 6764)                     |
| KDE (KMail)        | SRV-записи (RFC 6186)                           | SRV-записи (RFC 6764)                     |
| eM Client          | `autoconfig` или `autodiscover`                   | SRV-записи (RFC 6764)                     |

> \[!TIP]
> Для наилучшей совместимости со всеми клиентами мы рекомендуем использовать **Вариант A** (CNAME-записи) в сочетании с SRV-записями из **Варианта B**. Подход с CNAME покрывает большинство почтовых клиентов. SRV-записи CalDAV/CardDAV обеспечивают автоматическое обнаружение настроек сервера для клиентов календарей и контактов.


## Безопасность {#security-1}

### Расширенные методы усиления безопасности сервера {#advanced-server-hardening-techniques}

> \[!TIP]
> Узнайте больше о нашей инфраструктуре безопасности на [странице безопасности](/security).

Forward Email реализует множество методов усиления безопасности сервера для защиты нашей инфраструктуры и ваших данных:

1. **Сетевая безопасность**:
   * Межсетевой экран iptables с жесткими правилами
   * Fail2ban для защиты от перебора паролей
   * Регулярные аудиты безопасности и тесты на проникновение
   * Административный доступ только через VPN

2. **Усиление системы**:
   * Минимальная установка пакетов
   * Регулярные обновления безопасности
   * SELinux в режиме принуждения
   * Отключенный root-доступ по SSH
   * Аутентификация только по ключам

3. **Безопасность приложений**:
   * Заголовки Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Заголовки защиты от XSS
   * Заголовки опций фрейма и политики реферера
   * Регулярные аудиты зависимостей

4. **Защита данных**:
   * Полное шифрование диска с помощью LUKS
   * Безопасное управление ключами
   * Регулярное резервное копирование с шифрованием
   * Практики минимизации данных

5. **Мониторинг и реагирование**:
   * Обнаружение вторжений в реальном времени
   * Автоматизированное сканирование безопасности
   * Централизованное ведение логов и анализ
   * Процедуры реагирования на инциденты

> \[!IMPORTANT]
> Наши практики безопасности постоянно обновляются для противодействия новым угрозам и уязвимостям.

> \[!TIP]
> Для максимальной безопасности мы рекомендуем использовать наш сервис с сквозным шифрованием через OpenPGP.

### Есть ли у вас сертификаты SOC 2 или ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email работает на инфраструктуре, предоставляемой сертифицированными субподрядчиками, чтобы обеспечить соответствие отраслевым стандартам.

Forward Email не имеет собственных сертификатов SOC 2 Type II или ISO 27001. Однако сервис работает на инфраструктуре, предоставляемой сертифицированными субподрядчиками:

* **DigitalOcean**: сертифицирован по SOC 2 Type II и SOC 3 Type II (аудит Schellman & Company LLC), сертификация ISO 27001 в нескольких дата-центрах. Подробнее: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: сертифицирован по SOC 2+ (HIPAA), сертификаты ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Подробнее: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: соответствует требованиям SOC 2 (свяжитесь напрямую с DataPacket для получения сертификата), поставщик инфраструктуры корпоративного уровня (локация Денвер). Подробнее: <https://www.datapacket.com/datacenters/denver>

Forward Email следует лучшим отраслевым практикам по аудиту безопасности и регулярно взаимодействует с независимыми исследователями безопасности. Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Используете ли вы TLS-шифрование для пересылки электронной почты {#do-you-use-tls-encryption-for-email-forwarding}

Да. Forward Email строго требует TLS 1.2+ для всех соединений (HTTPS, SMTP, IMAP, POP3) и реализует MTA-STS для улучшенной поддержки TLS. Реализация включает:

* Принудительное использование TLS 1.2+ для всех почтовых соединений
* Обмен ключами ECDHE (Ephemeral Elliptic Curve Diffie-Hellman) для обеспечения идеальной прямой секретности
* Современные наборы шифров с регулярными обновлениями безопасности
* Поддержка HTTP/2 для повышения производительности и безопасности
* HSTS (HTTP Strict Transport Security) с предзагрузкой в основных браузерах
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** для строгого применения TLS

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Реализация MTA-STS**: Forward Email реализует строгое применение MTA-STS в кодовой базе. При возникновении ошибок TLS и включенном MTA-STS система возвращает SMTP статус 421, чтобы обеспечить повторную отправку писем позже, а не доставку без защиты. Детали реализации:

* Обнаружение ошибок TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Применение MTA-STS в помощнике send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Валидация сторонними организациями: <https://www.hardenize.com/report/forwardemail.net/1750312779> показывает оценки "Good" для всех мер безопасности TLS и транспортного уровня.

### Сохраняете ли вы заголовки аутентификации электронной почты {#do-you-preserve-email-authentication-headers}

Да. Forward Email полноценно реализует и сохраняет заголовки аутентификации электронной почты:

* **SPF (Sender Policy Framework)**: корректно реализован и сохраняется
* **DKIM (DomainKeys Identified Mail)**: полная поддержка с правильным управлением ключами
* **DMARC**: применение политики для писем, не прошедших проверку SPF или DKIM
* **ARC**: хотя явно не описано, идеальные показатели соответствия сервиса предполагают комплексную обработку заголовков аутентификации

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Валидация: тест Internet.nl Mail Test показывает 100/100 баллов именно за реализацию "SPF, DKIM и DMARC". Оценка Hardenize подтверждает оценки "Good" для SPF и DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Сохраняете ли вы оригинальные заголовки электронной почты и предотвращаете ли подделку {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email реализует сложную защиту от подделки для предотвращения злоупотреблений электронной почтой.

Forward Email сохраняет оригинальные заголовки электронной почты, одновременно реализуя комплексную защиту от подделки через кодовую базу MX:

* **Сохранение заголовков**: оригинальные заголовки аутентификации сохраняются при пересылке
* **Защита от подделки**: применение политики DMARC предотвращает подделку заголовков, отклоняя письма, не прошедшие проверку SPF или DKIM
* **Предотвращение внедрения заголовков**: проверка и очистка входных данных с использованием библиотеки striptags
* **Продвинутая защита**: сложное обнаружение фишинга с выявлением подделок, предотвращением имитации и системами уведомления пользователей

**Детали реализации MX**: основная логика обработки почты реализована в кодовой базе сервера MX, а именно:

* Основной обработчик данных MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Фильтрация произвольных писем (антиспуфинг): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Помощник `isArbitrary` реализует сложные правила антиспуфинга, включая обнаружение имитации домена, заблокированных фраз и различных шаблонов фишинга.
### Как вы защищаетесь от спама и злоупотреблений {#how-do-you-protect-against-spam-and-abuse}

Forward Email реализует комплексную многоуровневую защиту:

* **Ограничение скорости**: Применяется к попыткам аутентификации, API-эндпоинтам и SMTP-соединениям
* **Изоляция ресурсов**: Между пользователями для предотвращения влияния пользователей с высоким трафиком
* **Защита от DDoS**: Многоуровневая защита через систему Shield от DataPacket и Cloudflare
* **Автоматическое масштабирование**: Динамическая настройка ресурсов в зависимости от спроса
* **Предотвращение злоупотреблений**: Проверки на злоупотребления для каждого пользователя и блокировка вредоносного контента на основе хешей
* **Аутентификация электронной почты**: Протоколы SPF, DKIM, DMARC с расширенным обнаружением фишинга

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (подробности защиты от DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Храните ли вы содержимое электронной почты на диске {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email использует архитектуру с нулевым знанием, которая предотвращает запись содержимого электронной почты на диск.

* **Архитектура с нулевым знанием**: Индивидуально зашифрованные почтовые ящики SQLite означают, что Forward Email не имеет доступа к содержимому писем
* **Обработка в памяти**: Обработка электронной почты происходит полностью в памяти, без записи на диск
* **Отсутствие логирования содержимого**: «Мы не логируем и не храним содержимое или метаданные писем на диске»
* **Изолированное шифрование**: Ключи шифрования никогда не хранятся на диске в открытом виде

**Доказательства из кода MX**: MX-сервер обрабатывает письма полностью в памяти, не записывая содержимое на диск. Основной обработчик обработки почты демонстрирует этот подход в памяти: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Аннотация)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Подробности архитектуры с нулевым знанием)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Изолированное шифрование)

### Может ли содержимое электронной почты быть раскрыто при сбоях системы {#can-email-content-be-exposed-during-system-crashes}

Нет. Forward Email реализует комплексные меры защиты от раскрытия данных при сбоях:

* **Отключение дампов памяти**: Предотвращает раскрытие памяти при сбоях
* **Отключение swap-памяти**: Полностью отключена для предотвращения извлечения конфиденциальных данных из swap-файлов
* **Архитектура в памяти**: Содержимое писем существует только в энергозависимой памяти во время обработки
* **Защита ключей шифрования**: Ключи никогда не хранятся на диске в открытом виде
* **Физическая безопасность**: Диски с шифрованием LUKS v2 предотвращают физический доступ к данным
* **Отключение USB-накопителей**: Предотвращает несанкционированное извлечение данных

**Обработка ошибок системных проблем**: Forward Email использует вспомогательные функции `isCodeBug` и `isTimeoutError`, чтобы при возникновении проблем с подключением к базе данных, сетевых проблем DNS/блоклистов или проблем с подключением к вышестоящим сервисам система возвращала статус 421 SMTP, обеспечивая повторную отправку писем позже, а не их потерю или раскрытие.

Детали реализации:

* Классификация ошибок: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Обработка ошибок таймаута в MX-обработке: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Источник: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Кто имеет доступ к вашей инфраструктуре электронной почты {#who-has-access-to-your-email-infrastructure}

Forward Email реализует комплексный контроль доступа для своей минимальной инженерной команды из 2-3 человек с жесткими требованиями 2FA:

* **Контроль доступа на основе ролей**: Для командных аккаунтов с разрешениями на основе ресурсов
* **Принцип наименьших привилегий**: Применяется во всех системах
* **Разделение обязанностей**: Между операционными ролями
* **Управление пользователями**: Отдельные пользователи для деплоя и девопс с разными правами
* **Отключен вход под root**: Доступ возможен только через правильно аутентифицированные аккаунты
* **Жесткая 2FA**: Без SMS 2FA из-за риска атак MiTM — только приложения или аппаратные токены
* **Полное аудиторское логирование**: С редактированием конфиденциальных данных
* **Автоматическое обнаружение аномалий**: Для необычных паттернов доступа
* **Регулярные проверки безопасности**: Логов доступа
* **Защита от атак типа «злой горничной»**: Отключение USB-накопителей и другие меры физической безопасности
Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Контроль авторизации)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Сетевая безопасность)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Предотвращение атаки злого горничного)

### Какие инфраструктурные провайдеры вы используете {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email использует нескольких инфраструктурных субподрядчиков с комплексными сертификатами соответствия.

Полная информация доступна на нашей странице соответствия GDPR: <https://forwardemail.net/gdpr>

**Основные инфраструктурные субподрядчики:**

| Провайдер        | Сертифицирован по стандарту защиты данных | Страница соответствия GDPR                                                                |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Да                                     | <https://www.cloudflare.com/trust-hub/gdpr/>                                             |
| **DataPacket**   | ❌ Нет                                    | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean** | ❌ Нет                                    | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**       | ✅ Да                                     | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Нет                                    | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Подробные сертификаты:**

**DigitalOcean**

* SOC 2 Type II и SOC 3 Type II (аудит Schellman & Company LLC)
* Сертификация ISO 27001 в нескольких дата-центрах
* Соответствие PCI-DSS
* Сертификация CSA STAR Level 1
* Сертификация APEC CBPR PRP
* Подробнее: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Сертификация SOC 2+ (HIPAA)
* Соответствие PCI Merchant
* Сертификация CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Подробнее: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Соответствие SOC 2 (для получения сертификата обращайтесь напрямую в DataPacket)
* Инфраструктура корпоративного уровня (локация Денвер)
* Защита от DDoS через кибербезопасностный стек Shield
* Круглосуточная техническая поддержка
* Глобальная сеть из 58 дата-центров
* Подробнее: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Сертификация Data Privacy Framework (EU-U.S., Swiss-U.S. и UK Extension)
* Хостинг исходного кода, CI/CD и управление проектами
* Доступно Соглашение о защите данных GitHub
* Подробнее: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Платежные процессоры:**

* **Stripe**: Сертифицирован по Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Не сертифицирован по DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Предлагаете ли вы Соглашение об обработке данных (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Да, Forward Email предлагает комплексное Соглашение об обработке данных (DPA), которое может быть подписано вместе с нашим корпоративным соглашением. Копия нашего DPA доступна по адресу: <https://forwardemail.net/dpa>

**Детали DPA:**

* Охватывает соответствие GDPR и рамки EU-US/Swiss-US Privacy Shield
* Автоматически принимается при согласии с нашими Условиями обслуживания
* Для стандартного DPA отдельная подпись не требуется
* Индивидуальные условия DPA доступны через корпоративную лицензию

**Рамки соответствия GDPR:**
Наш DPA описывает соответствие GDPR, а также международным требованиям к передаче данных. Полная информация доступна по адресу: <https://forwardemail.net/gdpr>

Для корпоративных клиентов, которым требуются индивидуальные условия DPA или специальные договорные соглашения, это можно оформить через нашу программу **Enterprise License ($250/месяц)**.

### Как вы обрабатываете уведомления о нарушениях безопасности данных {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Архитектура Forward Email с нулевыми знаниями значительно ограничивает последствия нарушений.
* **Ограниченный доступ к данным**: Нет доступа к зашифрованному содержимому электронной почты благодаря архитектуре с нулевым разглашением
* **Минимальный сбор данных**: Только базовая информация о подписчиках и ограниченные IP-логи для безопасности
* **Рамки субподрядчиков**: DigitalOcean, GitHub и Vultr поддерживают процедуры реагирования на инциденты в соответствии с GDPR

**Информация о представителе GDPR:**
Forward Email назначил представителей GDPR в соответствии со статьей 27:

**Представитель в ЕС:**
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0

**Представитель в Великобритании:**
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF

Для корпоративных клиентов, которым требуются конкретные SLA по уведомлению о нарушениях, эти вопросы следует обсуждать в рамках соглашения об **Enterprise License**.

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Предлагаете ли вы тестовую среду {#do-you-offer-a-test-environment}

Техническая документация Forward Email не описывает явно выделенный режим песочницы. Однако возможные подходы к тестированию включают:

* **Вариант самостоятельного хостинга**: Полноценные возможности самостоятельного хостинга для создания тестовых сред
* **API-интерфейс**: Возможность программного тестирования конфигураций
* **Открытый исходный код**: 100% открытый исходный код позволяет клиентам изучать логику пересылки
* **Несколько доменов**: Поддержка нескольких доменов может позволить создание тестовых доменов

Для корпоративных клиентов, которым необходимы формальные возможности песочницы, это следует обсуждать в рамках соглашения об **Enterprise License**.

Источник: <https://github.com/forwardemail/forwardemail.net> (Детали среды разработки)

### Предоставляете ли вы инструменты мониторинга и оповещения {#do-you-provide-monitoring-and-alerting-tools}

Forward Email предоставляет мониторинг в реальном времени с некоторыми ограничениями:

**Доступно:**

* **Мониторинг доставки в реальном времени**: Публично доступные показатели производительности для основных почтовых провайдеров
* **Автоматическое оповещение**: Инженерная команда уведомляется, если время доставки превышает 10 секунд
* **Прозрачный мониторинг**: 100% открытые системы мониторинга
* **Мониторинг инфраструктуры**: Автоматическое обнаружение аномалий и полный аудит логов

**Ограничения:**

* Вебхуки для клиентов или уведомления о статусе доставки через API явно не документированы

Для корпоративных клиентов, которым необходимы подробные вебхуки статуса доставки или кастомные интеграции мониторинга, эти возможности могут быть доступны через соглашения об **Enterprise License**.

Источники:

* <https://forwardemail.net> (Отображение мониторинга в реальном времени)
* <https://github.com/forwardemail/forwardemail.net> (Реализация мониторинга)

### Как вы обеспечиваете высокую доступность {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]  
> Forward Email реализует комплексную избыточность через нескольких провайдеров инфраструктуры.

* **Распределённая инфраструктура**: Несколько провайдеров (DigitalOcean, Vultr, DataPacket) в разных географических регионах  
* **Географическое балансирование нагрузки**: Балансировка нагрузки на основе геолокации через Cloudflare с автоматическим переключением  
* **Автоматическое масштабирование**: Динамическая настройка ресурсов в зависимости от нагрузки  
* **Многоуровневая защита от DDoS**: Через систему Shield от DataPacket и Cloudflare  
* **Избыточность серверов**: Несколько серверов в каждом регионе с автоматическим переключением  
* **Репликация баз данных**: Синхронизация данных в реальном времени между несколькими локациями  
* **Мониторинг и оповещение**: Круглосуточный мониторинг с автоматическим реагированием на инциденты

**Гарантия времени безотказной работы**: 99.9%+ доступности сервиса с прозрачным мониторингом на <https://forwardemail.net>

Источники:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Соответствуете ли вы разделу 889 Закона о национальной обороне (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]  
> Forward Email полностью соответствует разделу 889 благодаря тщательному выбору инфраструктурных партнёров.

Да, Forward Email **соответствует разделу 889**. Раздел 889 Закона о национальной обороне (NDAA) запрещает государственным учреждениям использовать или заключать контракты с организациями, которые используют телекоммуникационное и видеонаблюдательное оборудование от определённых компаний (Huawei, ZTE, Hikvision, Dahua и Hytera).
**Как Forward Email обеспечивает соответствие Разделу 889:**

Forward Email полагается исключительно на двух ключевых поставщиков инфраструктуры, ни один из которых не использует оборудование, запрещённое Разделом 889:

1. **Cloudflare**: наш основной партнёр по сетевым услугам и безопасности электронной почты
2. **DataPacket**: наш основной поставщик серверной инфраструктуры (использующий исключительно оборудование Arista Networks и Cisco)
3. **Резервные поставщики**: наши резервные поставщики Digital Ocean и Vultr дополнительно подтверждены в письменной форме как соответствующие Разделу 889.

**Обязательства Cloudflare**: Cloudflare явно заявляет в своём Кодексе поведения третьих лиц, что они не используют телекоммуникационное оборудование, продукты видеонаблюдения или услуги от каких-либо субъектов, запрещённых Разделом 889.

**Использование в государственных учреждениях**: Наше соответствие Разделу 889 было подтверждено, когда **Военно-морская академия США** выбрала Forward Email для своих нужд в безопасной пересылке электронной почты, требуя документацию наших федеральных стандартов соответствия.

Для полного ознакомления с нашей системой соответствия требованиям правительства, включая более широкие федеральные нормативы, прочитайте наше подробное исследование: [Федеральный государственный сервис электронной почты, соответствующий Разделу 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Системные и технические детали {#system-and-technical-details}

### Вы храните электронные письма и их содержимое {#do-you-store-emails-and-their-contents}

Нет, мы не записываем на диск и не храним логи – за [исключением ошибок](#do-you-store-error-logs) и [исходящего SMTP](#do-you-support-sending-email-with-smtp) (см. нашу [Политику конфиденциальности](/privacy)).

Всё выполняется в памяти, и [наш исходный код находится на GitHub](https://github.com/forwardemail).

### Как работает ваша система пересылки электронной почты {#how-does-your-email-forwarding-system-work}

Электронная почта основана на [протоколе SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Этот протокол состоит из команд, отправляемых серверу (чаще всего на порт 25). Сначала устанавливается соединение, затем отправитель указывает, от кого письмо ("MAIL FROM"), затем куда оно направляется ("RCPT TO"), и наконец заголовки и тело самого письма ("DATA"). Последовательность работы нашей системы пересылки описана относительно каждой команды протокола SMTP ниже:

* Начальное соединение (без имени команды, например, `telnet example.com 25`) – это начальное соединение. Мы проверяем отправителей, которых нет в нашем [белом списке](#do-you-have-an-allowlist), по нашему [чёрному списку](#do-you-have-a-denylist). Наконец, если отправитель не в белом списке, мы проверяем, не находится ли он в [сером списке](#do-you-have-a-greylist).

* `HELO` – это приветствие для идентификации FQDN отправителя, IP-адреса или имени почтового обработчика. Это значение может быть подделано, поэтому мы не полагаемся на эти данные, а используем обратный поиск имени хоста по IP-адресу соединения.

* `MAIL FROM` – указывает адрес отправителя в конверте письма. Если указано значение, оно должно быть действительным адресом электронной почты по RFC 5322. Пустые значения разрешены. Здесь мы [проверяем на обратный спам](#how-do-you-protect-against-backscatter) и также сверяем MAIL FROM с нашим [чёрным списком](#do-you-have-a-denylist). В конце мы проверяем отправителей, не входящих в белый список, на ограничение скорости (см. разделы о [ограничении скорости](#do-you-have-rate-limiting) и [белом списке](#do-you-have-an-allowlist) для подробностей).

* `RCPT TO` – указывает получателя(ей) письма. Это должны быть действительные адреса электронной почты по RFC 5322. Мы разрешаем не более 50 получателей в конверте на одно сообщение (это отличается от заголовка "To" в письме). Также мы проверяем наличие действительного адреса по [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") для защиты от подделки с использованием нашего домена SRS.

* `DATA` – это основная часть нашего сервиса, которая обрабатывает письмо. Подробнее см. раздел [Как вы обрабатываете письмо для пересылки](#how-do-you-process-an-email-for-forwarding) ниже.
### Как вы обрабатываете электронное письмо для пересылки {#how-do-you-process-an-email-for-forwarding}

В этом разделе описывается наш процесс, связанный с командой протокола SMTP `DATA` в разделе [Как работает ваша система пересылки электронной почты](#how-does-your-email-forwarding-system-work) выше – это то, как мы обрабатываем заголовки письма, тело, безопасность, определяем, куда его нужно доставить, и как мы управляем соединениями.

1. Если сообщение превышает максимальный размер 50 МБ, оно отклоняется с кодом ошибки 552.

2. Если сообщение не содержит заголовок "From" или если любое из значений в заголовке "From" не является допустимым адресом электронной почты по RFC 5322, оно отклоняется с кодом ошибки 550.

3. Если в сообщении более 25 заголовков "Received", считается, что оно застряло в цикле перенаправления, и оно отклоняется с кодом ошибки 550.

4. Используя отпечаток письма (см. раздел о [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), мы проверяем, пыталось ли сообщение быть повторно отправленным более 5 дней (что соответствует [поведению по умолчанию postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), и если да, оно отклоняется с кодом ошибки 550.

5. Мы сохраняем в памяти результаты сканирования письма с помощью [Spam Scanner](https://spamscanner.net).

6. Если были какие-либо произвольные результаты от Spam Scanner, оно отклоняется с кодом ошибки 554. Произвольные результаты на момент написания включают только тест GTUBE. Подробнее см. <https://spamassassin.apache.org/gtube/>.

7. Мы добавляем следующие заголовки к сообщению для целей отладки и предотвращения злоупотреблений:

   * `Received` – мы добавляем этот стандартный заголовок Received с IP-адресом и хостом источника, типом передачи, информацией о TLS-соединении, датой/временем и получателем.
   * `X-Original-To` – оригинальный получатель сообщения:
     * Это полезно для определения, куда изначально было доставлено письмо (в дополнение к заголовку "Received").
     * Добавляется для каждого получателя при IMAP и/или маскированной пересылке (для защиты конфиденциальности).
   * `X-Forward-Email-Website` – содержит ссылку на наш сайт <https://forwardemail.net>
   * `X-Forward-Email-Version` – текущая версия [SemVer](https://semver.org/) из `package.json` нашего кода.
   * `X-Forward-Email-Session-ID` – значение идентификатора сессии для целей отладки (применяется только в непроизводственных средах).
   * `X-Forward-Email-Sender` – список через запятую, содержащий оригинальный адрес MAIL FROM конверта (если он не пустой), обратное PTR имя клиента FQDN (если существует) и IP-адрес отправителя.
   * `X-Forward-Email-ID` – применяется только для исходящего SMTP и соответствует идентификатору письма, сохранённому в Личном кабинете → Письма
   * `X-Report-Abuse` – со значением `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – со значением `abuse@forwardemail.net`.
   * `X-Complaints-To` – со значением `abuse@forwardemail.net`.

8. Затем мы проверяем сообщение на [DKIM](https://ru.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://ru.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) и [DMARC](https://ru.wikipedia.org/wiki/DMARC).

   * Если сообщение не прошло проверку DMARC и у домена была политика отклонения (например, `p=reject` [была в политике DMARC](https://wikipedia.org/wiki/DMARC)), оно отклоняется с кодом ошибки 550. Обычно политика DMARC для домена хранится в поддомене `_dmarc` в записи <strong class="notranslate">TXT</strong> (например, `dig _dmarc.example.com txt`).
   * Если сообщение не прошло проверку SPF и у домена была жёсткая политика отказа (например, `-all` в политике SPF вместо `~all` или отсутствия политики), оно отклоняется с кодом ошибки 550. Обычно политика SPF для домена хранится в записи <strong class="notranslate">TXT</strong> для корневого домена (например, `dig example.com txt`). Подробнее об этом в разделе [отправки почты как в Gmail](#can-i-send-mail-as-in-gmail-with-this) относительно SPF.
9. Теперь мы обрабатываем получателей сообщения, собранных из команды `RCPT TO` в разделе [Как работает ваша система переадресации электронной почты](#how-does-your-email-forwarding-system-work) выше. Для каждого получателя мы выполняем следующие операции:

   * Мы выполняем поиск <strong class="notranslate">TXT</strong> записей доменного имени (часть после символа `@`, например, `example.com`, если адрес электронной почты был `test@example.com`). Например, если домен — `example.com`, мы выполняем DNS-запрос, такой как `dig example.com txt`.
   * Мы анализируем все <strong class="notranslate">TXT</strong> записи, которые начинаются либо с `forward-email=` (бесплатные планы), либо с `forward-email-site-verification=` (платные планы). Обратите внимание, что мы анализируем обе, чтобы обрабатывать письма во время обновления или понижения плана пользователем.
   * Из этих проанализированных <strong class="notranslate">TXT</strong> записей мы перебираем их, чтобы извлечь конфигурацию переадресации (как описано в разделе [Как начать и настроить переадресацию электронной почты](#how-do-i-get-started-and-set-up-email-forwarding) выше). Обратите внимание, что мы поддерживаем только одно значение `forward-email-site-verification=`, и если указано более одного, то возникнет ошибка 550, и отправитель получит уведомление о недоставке для этого получателя.
   * Рекурсивно мы перебираем извлечённую конфигурацию переадресации, чтобы определить глобальную переадресацию, переадресацию на основе регулярных выражений и все другие поддерживаемые конфигурации переадресации — которые теперь известны как наши «Адреса переадресации».
   * Для каждого Адреса переадресации мы поддерживаем один рекурсивный поиск (который запустит этот набор операций заново для данного адреса). Если рекурсивное совпадение найдено, то родительский результат будет удалён из Адресов переадресации, а дети добавлены.
   * Адреса переадресации анализируются на уникальность (так как мы не хотим отправлять дубликаты на один адрес или создавать дополнительные ненужные SMTP-соединения).
   * Для каждого Адреса переадресации мы проверяем его доменное имя через наш API-эндпоинт `/v1/max-forwarded-addresses` (чтобы определить, сколько адресов домену разрешено переадресовывать на один алиас, например, по умолчанию 10 — см. раздел о [максимальном лимите переадресации на один алиас](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Если этот лимит превышен, возникает ошибка 550, и отправитель получает уведомление о недоставке для этого получателя.
   * Мы проверяем настройки исходного получателя через наш API-эндпоинт `/v1/settings`, который поддерживает поиск для платных пользователей (с резервным вариантом для бесплатных). Это возвращает объект конфигурации для расширенных настроек: `port` (число, например, `25`), `has_adult_content_protection` (булево значение), `has_phishing_protection` (булево значение), `has_executable_protection` (булево значение) и `has_virus_protection` (булево значение).
   * Исходя из этих настроек, мы затем проверяем результаты Спам-сканера, и если возникают ошибки, сообщение отклоняется с кодом ошибки 554 (например, если включена защита от вирусов `has_virus_protection`, мы проверяем результаты Спам-сканера на наличие вирусов). Обратите внимание, что все пользователи бесплатного плана автоматически участвуют в проверках на взрослый контент, фишинг, исполняемые файлы и вирусы. По умолчанию все пользователи платного плана также участвуют, но эту конфигурацию можно изменить на странице настроек домена в панели Forward Email).

10. Для каждого обработанного Адреса переадресации получателя мы затем выполняем следующие операции:

    * Адрес проверяется по нашему [черному списку](#do-you-have-a-denylist), и если он там указан, возникает ошибка 421 (что указывает отправителю повторить попытку позже).
    * Если адрес является вебхуком, мы устанавливаем булево значение для будущих операций (см. ниже — мы группируем похожие вебхуки, чтобы сделать один POST-запрос вместо нескольких для доставки).
    * Если адрес является адресом электронной почты, мы анализируем хост для будущих операций (см. ниже — мы группируем похожие хосты, чтобы установить одно соединение вместо нескольких отдельных для доставки).
11. Если нет получателей и нет возвратов, то мы отвечаем ошибкой 550 с сообщением «Недопустимые получатели».

12. Если получатели есть, то мы перебираем их (сгруппированных по одному и тому же хосту) и доставляем письма. См. раздел [Как вы обрабатываете проблемы с доставкой электронной почты](#how-do-you-handle-email-delivery-issues) ниже для более подробной информации.

    * Если при отправке писем возникают ошибки, мы сохраняем их в памяти для последующей обработки.
    * Мы берем наименьший код ошибки (если он есть) из отправленных писем и используем его в качестве кода ответа на команду `DATA`. Это означает, что письма, не доставленные, обычно будут повторно отправлены исходным отправителем, а письма, которые уже были доставлены, не будут отправлены повторно при следующей отправке сообщения (так как мы используем [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Если ошибок не было, мы отправляем успешный SMTP-ответ с кодом 250.
    * Возврат считается любой попыткой доставки, которая завершилась кодом состояния >= 500 (постоянные ошибки).

13. Если возвратов не было (постоянных ошибок), мы возвращаем SMTP-ответ с кодом наименьшей ошибки из непостоянных ошибок (или успешный код 250, если таких не было).

14. Если возвраты были, мы отправляем письма с уведомлениями о возврате в фоновом режиме после возврата отправителю наименьшего из всех кодов ошибок. Однако, если наименьший код ошибки >= 500, мы не отправляем уведомления о возврате. Это связано с тем, что в противном случае отправители получили бы двойное уведомление о возврате (например, одно от их исходящего MTA, такого как Gmail, и еще одно от нас). См. раздел [Как вы защищаетесь от обратного спама](#how-do-you-protect-against-backscatter) ниже для более подробной информации.

### Как вы обрабатываете проблемы с доставкой электронной почты {#how-do-you-handle-email-delivery-issues}

Обратите внимание, что мы выполняем переписывание «Friendly-From» в письмах только если политика DMARC отправителя не проходит проверку И ни одна подпись DKIM не совпадает с заголовком «From». Это означает, что мы изменяем заголовок «From» в сообщении, устанавливаем «X-Original-From», а также устанавливаем «Reply-To», если он еще не был установлен. После изменения этих заголовков мы также повторно запечатываем ARC-печать в сообщении.

Мы также используем интеллектуальный разбор сообщений об ошибках на всех уровнях нашего стека — в нашем коде, DNS-запросах, внутренних механизмах Node.js, HTTP-запросах (например, 408, 413 и 429 сопоставляются с SMTP-кодом ответа 421, если получатель — webhook) и ответах почтового сервера (например, ответы с «defer» или «slowdown» будут повторяться как ошибки 421).

Наша логика проста и надежна, она также повторяет попытки при ошибках SSL/TLS, проблемах с соединением и других. Цель — максимизировать доставляемость всем получателям для конфигурации пересылки.

Если получатель — webhook, мы разрешаем таймаут в 60 секунд для завершения запроса с максимум 3 повторными попытками (итого 4 запроса до отказа). Обратите внимание, что мы корректно разбираем коды ошибок 408, 413 и 429 и сопоставляем их с SMTP-кодом ответа 421.

Если получатель — адрес электронной почты, мы пытаемся отправить письмо с оппортунистическим TLS (пытаемся использовать STARTTLS, если он доступен на почтовом сервере получателя). Если при попытке отправки возникает ошибка SSL/TLS, мы пытаемся отправить письмо без TLS (без использования STARTTLS).

Если возникают ошибки DNS или соединения, мы возвращаем команде `DATA` SMTP-код ответа 421, иначе при ошибках уровня >= 500 отправляются уведомления о возврате.

Если мы обнаруживаем, что почтовый сервер, которому пытаемся доставить письмо, заблокировал один или несколько наших IP-адресов почтового обмена (например, с помощью технологий, используемых для отложенной обработки спамеров), мы отправляем SMTP-код ответа 421, чтобы отправитель мог повторить попытку позже (и мы получаем уведомление об этой проблеме, чтобы попытаться ее решить до следующей попытки).

### Как вы обрабатываете блокировку ваших IP-адресов {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Мы регулярно мониторим все основные DNS-черные списки, и если какой-либо из наших IP-адресов почтового обмена ("MX") попадает в крупный черный список, мы по возможности исключаем его из соответствующей DNS A-записи с круговым распределением до тех пор, пока проблема не будет решена.

На момент написания этой статьи мы также включены в несколько DNS-белых списков, и мы серьезно относимся к мониторингу черных списков. Если вы заметите какие-либо проблемы до того, как мы успеем их решить, пожалуйста, уведомьте нас письменно по адресу <support@forwardemail.net>.

Наши IP-адреса общедоступны, [см. этот раздел ниже для получения дополнительной информации](#what-are-your-servers-ip-addresses).

### Что такое адреса postmaster {#what-are-postmaster-addresses}

Чтобы предотвратить неправильные отказы и отправку сообщений автоответчика на неотслеживаемые или несуществующие почтовые ящики, мы поддерживаем список имен пользователей, похожих на mailer-daemon:

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
* [и любой адрес no-reply](#what-are-no-reply-addresses)

См. [RFC 5320 Раздел 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) для более глубокого понимания того, как такие списки используются для создания эффективных почтовых систем.

### Что такое адреса no-reply {#what-are-no-reply-addresses}

Имена пользователей электронной почты, совпадающие с любым из следующих (без учета регистра), считаются адресами no-reply:

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

### Какие IP-адреса у вашего сервера {#what-are-your-servers-ip-addresses}

Мы публикуем наши IP-адреса на <https://forwardemail.net/ips>.

### Есть ли у вас белый список {#do-you-have-an-allowlist}

Да, у нас есть [список расширений доменных имен](#what-domain-name-extensions-are-allowlisted-by-default), которые по умолчанию включены в белый список, а также динамический, кэшируемый и обновляемый белый список, основанный на [строгих критериях](#what-is-your-allowlist-criteria).

Все домены, электронные адреса и IP-адреса, используемые платными клиентами, автоматически проверяются по нашему черному списку ежечасно — что оповещает администраторов, которые могут при необходимости вмешаться вручную.

Кроме того, если один из ваших доменов или его электронных адресов попадает в черный список (например, за рассылку спама, вирусов или из-за атак с подделкой личности), администраторы домена (вы) и наши администраторы команды будут немедленно уведомлены по электронной почте. Мы настоятельно рекомендуем вам [настроить DMARC](#how-do-i-set-up-dmarc-for-forward-email), чтобы предотвратить это.

### Какие расширения доменных имен включены в белый список по умолчанию {#what-domain-name-extensions-are-allowlisted-by-default}

Следующие расширения доменных имен считаются включенными в белый список по умолчанию (независимо от того, находятся ли они в списке популярности Umbrella или нет):

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
Кроме того, эти [брендовые и корпоративные домены верхнего уровня](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) по умолчанию включены в белый список (например, `apple` для `applecard.apple` для выписок по банковской карте Apple Card):

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
По состоянию на 18 марта 2025 года мы также добавили эти французские заморские территории в этот список ([согласно этому запросу на GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

По состоянию на 8 июля 2025 года мы добавили эти страны, специфичные для Европы:

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

В октябре 2025 года мы также добавили <code class="notranslate">cz</code> (Чешская Республика) по запросу.

Мы специально не включали `ru` и `ua` из-за высокой активности спама.

### Каковы ваши критерии для белого списка {#what-is-your-allowlist-criteria}

У нас есть статический список [расширений доменных имен, разрешённых по умолчанию](#what-domain-name-extensions-are-allowlisted-by-default) – а также мы поддерживаем динамический, кэшируемый, скользящий белый список на основе следующих строгих критериев:

* Корневой домен отправителя должен иметь [расширение доменного имени, которое соответствует списку, предлагаемому в нашем бесплатном плане](#what-domain-name-extensions-can-be-used-for-free) (с добавлением `biz` и `info`). Мы также включаем частичные совпадения `edu`, `gov` и `mil`, такие как `xyz.gov.au` и `xyz.edu.au`.
* Корневой домен отправителя должен входить в топ 100 000 уникальных корневых доменов, полученных из [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Корневой домен отправителя должен входить в топ 50 000 результатов уникальных корневых доменов, появляющихся как минимум в 4 из последних 7 дней UPL (~50%+).
* Корневой домен отправителя не должен быть [категоризирован](https://radar.cloudflare.com/categorization-feedback/) как содержащий материалы для взрослых или вредоносное ПО по версии Cloudflare.
* Корневой домен отправителя должен иметь записи A или MX.
* Корневой домен отправителя должен иметь либо записи A, либо записи MX, либо DMARC-запись с `p=reject` или `p=quarantine`, либо SPF-запись с квалификатором `-all` или `~all`.

Если эти критерии выполняются, корневой домен отправителя будет кэшироваться в течение 7 дней. Обратите внимание, что наша автоматическая задача запускается ежедневно – поэтому это скользящий кэш белого списка, который обновляется ежедневно.

Наша автоматическая задача загружает последние 7 дней UPL в память, распаковывает их и затем парсит в памяти согласно строгим критериям выше.

Популярные домены на момент написания, такие как Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify и другие – конечно же включены.
Если вы отправитель, не включённый в наш список разрешённых, то при первом отправлении электронной почты с вашего корневого домена FQDN или IP-адреса вы будете [ограничены по скорости](#do-you-have-rate-limiting) и [помещены в серый список](#do-you-have-a-greylist). Обратите внимание, что это стандартная практика, принятая в качестве стандарта электронной почты. Большинство почтовых серверов-клиентов попытаются повторить отправку, если получат ошибку ограничения скорости или серого списка (например, код статуса ошибки 421 или уровень ошибки 4xx).

**Обратите внимание, что конкретные отправители, такие как `a@gmail.com`, `b@xyz.edu` и `c@gov.au`, всё равно могут быть [включены в чёрный список](#do-you-have-a-denylist)** (например, если мы автоматически обнаружим спам, фишинг или вредоносное ПО от этих отправителей).

### Какие расширения доменных имён можно использовать бесплатно {#what-domain-name-extensions-can-be-used-for-free}

С 31 марта 2023 года мы ввели новое общее правило по борьбе со спамом для защиты наших пользователей и сервиса.

Это новое правило разрешает использовать на нашем бесплатном тарифе только следующие расширения доменных имён:

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
### У вас есть серый список {#do-you-have-a-greylist}

Да, у нас используется очень мягкая политика [серого списка электронной почты](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Серый список применяется только к отправителям, не находящимся в нашем белом списке, и хранится в нашем кэше в течение 30 дней.

Для любого нового отправителя мы сохраняем ключ в нашей базе данных Redis на 30 дней со значением, установленным в время первого запроса. Затем мы отклоняем их письмо с кодом статуса повторной попытки 450 и разрешаем его пройти только после того, как пройдет 5 минут.

Если отправитель успешно дождался 5 минут с момента первоначального времени прибытия, то его письма будут приняты, и он не получит этот код статуса 450.

Ключ состоит либо из корневого домена FQDN, либо из IP-адреса отправителя. Это означает, что любой поддомен, прошедший через серый список, также пройдет для корневого домена, и наоборот (именно это мы подразумеваем под «очень мягкой» политикой).

Например, если письмо приходит с `test.example.com` до того, как мы увидим письмо с `example.com`, то любое письмо с `test.example.com` и/или `example.com` должно будет ждать 5 минут с момента первоначального времени подключения. Мы не заставляем и `test.example.com`, и `example.com` ждать свои собственные 5 минут (наша политика серого списка применяется на уровне корневого домена).

Обратите внимание, что серый список не применяется к отправителям из нашего [белого списка](#do-you-have-an-allowlist) (например, Meta, Amazon, Netflix, Google, Microsoft на момент написания).

### У вас есть черный список {#do-you-have-a-denylist}

Да, мы управляем собственным черным списком и обновляем его автоматически в реальном времени и вручную на основе обнаруженной спам- и вредоносной активности.

Мы также загружаем все IP-адреса из черного списка UCEPROTECT Level 1 по адресу <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> каждый час и добавляем их в наш черный список с сроком действия 7 дней.

Отправители, найденные в черном списке, получат код ошибки 421 (указывает отправителю повторить попытку позже), если они [не находятся в белом списке](#do-you-have-an-allowlist).

Использование кода статуса 421 вместо 554 позволяет в реальном времени смягчать возможные ложные срабатывания, и сообщение может быть успешно доставлено при следующей попытке.

**Это устроено иначе, чем в других почтовых сервисах**, где при попадании в блоклист происходит жесткая и постоянная ошибка. Часто сложно попросить отправителей повторить отправку сообщений (особенно из крупных организаций), поэтому такой подход дает примерно 5 дней с момента первой попытки отправки письма, чтобы отправитель, получатель или мы могли вмешаться и решить проблему (например, запросив удаление из черного списка).

Все запросы на удаление из черного списка отслеживаются администраторами в реальном времени (например, чтобы повторяющиеся ложные срабатывания могли быть навсегда добавлены в белый список администраторами).

Запросы на удаление из черного списка можно отправлять по адресу <https://forwardemail.net/denylist>. Платные пользователи получают мгновенную обработку своих запросов, а неплатные пользователи должны ждать обработки администраторами.

Отправители, уличённые в рассылке спама или вирусного контента, добавляются в черный список следующим образом:

1. [Первоначальный отпечаток сообщения](#how-do-you-determine-an-email-fingerprint) помещается в серый список при обнаружении спама или блоклиста от «доверенного» отправителя (например, `gmail.com`, `microsoft.com`, `apple.com`).
   * Если отправитель был в белом списке, сообщение помещается в серый список на 1 час.
   * Если отправитель не в белом списке, сообщение помещается в серый список на 6 часов.
2. Мы извлекаем ключи черного списка из информации об отправителе и сообщении, и для каждого такого ключа создаём (если он ещё не существует) счётчик, увеличиваем его на 1 и кэшируем на 24 часа.
   * Для отправителей из белого списка:
     * Добавляем ключ для адреса электронной почты в конверте "MAIL FROM", если у него был пройден SPF или SPF отсутствовал, и если это не [адрес postmaster](#what-are-postmaster-addresses) или [адрес no-reply](#what-are-no-reply-addresses).
     * Если заголовок "From" был в белом списке, добавляем ключ для адреса электронной почты из заголовка "From", если у него был пройден SPF или пройден и выровнен DKIM.
     * Если заголовок "From" не был в белом списке, добавляем ключ для адреса электронной почты из заголовка "From" и его корневого домена.
   * Для отправителей не из белого списка:
     * Добавляем ключ для адреса электронной почты в конверте "MAIL FROM", если у него был пройден SPF.
     * Если заголовок "From" был в белом списке, добавляем ключ для адреса электронной почты из заголовка "From", если у него был пройден SPF или пройден и выровнен DKIM.
     * Если заголовок "From" не был в белом списке, добавляем ключ для адреса электронной почты из заголовка "From" и его корневого домена.
     * Добавляем ключ для удалённого IP-адреса отправителя.
     * Добавляем ключ для разрешённого имени хоста клиента по обратному поиску IP-адреса отправителя (если есть).
     * Добавляем ключ для корневого домена разрешённого имени хоста клиента (если есть и если он отличается от разрешённого имени хоста клиента).
3. Если счётчик достигает 5 для отправителя и ключа, не находящихся в белом списке, мы заносим ключ в черный список на 30 дней и отправляем письмо нашей команде по борьбе с злоупотреблениями. Эти значения могут изменяться, и обновления будут отражены здесь по мере мониторинга злоупотреблений.
4. Если счётчик достигает 10 для отправителя и ключа из белого списка, мы заносим ключ в черный список на 7 дней и отправляем письмо нашей команде по борьбе с злоупотреблениями. Эти значения могут изменяться, и обновления будут отражены здесь по мере мониторинга злоупотреблений.
> **ПРИМЕЧАНИЕ:** В ближайшем будущем мы введем мониторинг репутации. Мониторинг репутации будет рассчитывать, когда заносить отправителя в черный список, исходя из порогового значения в процентах (в отличие от примитивного счетчика, упомянутого выше).

### У вас есть ограничение скорости {#do-you-have-rate-limiting}

Ограничение скорости отправителя осуществляется либо по корневому домену, полученному из обратного PTR-запроса по IP-адресу отправителя – либо, если это не дает результата, то просто используется IP-адрес отправителя. Обратите внимание, что ниже мы называем это `Отправитель`.

Наши MX-серверы имеют ежедневные лимиты на входящую почту, получаемую для [зашифрованного IMAP-хранения](/blog/docs/best-quantum-safe-encrypted-email-service):

* Вместо ограничения скорости входящей почты по отдельным алиасам (например, `you@yourdomain.com`) – мы ограничиваем скорость по доменному имени алиаса (например, `yourdomain.com`). Это предотвращает массовую рассылку `Отправителями` во все почтовые ящики всех алиасов вашего домена одновременно.
* У нас есть общие лимиты, которые применяются ко всем `Отправителям` в нашей службе независимо от получателя:
  * `Отправители`, которых мы считаем "доверенными" источниками (например, `gmail.com`, `microsoft.com`, `apple.com`), ограничены отправкой 100 ГБ в день.
  * `Отправители`, которые находятся в [белом списке](#do-you-have-an-allowlist), ограничены отправкой 10 ГБ в день.
  * Все остальные `Отправители` ограничены отправкой 1 ГБ и/или 1000 сообщений в день.
* У нас есть конкретный лимит на `Отправителя` и `yourdomain.com` в размере 1 ГБ и/или 1000 сообщений в день.

MX-серверы также ограничивают количество сообщений, пересылаемых одному или нескольким получателям, с помощью ограничения скорости – но это применяется только к `Отправителям`, не находящимся в [белом списке](#do-you-have-an-allowlist):

* Мы разрешаем не более 100 соединений в час на каждый разрешенный FQDN корневой домен `Отправителя` (или) IP-адрес `Отправителя` (если обратный PTR отсутствует), и на каждого получателя в конверте. Ключ для ограничения скорости хранится в виде криптографического хэша в нашей базе данных Redis.

* Если вы отправляете почту через нашу систему, пожалуйста, убедитесь, что для всех ваших IP-адресов настроен обратный PTR (иначе каждый уникальный FQDN корневой домен или IP-адрес, с которого вы отправляете, будет ограничен по скорости).

* Обратите внимание, что если вы отправляете через популярную систему, такую как Amazon SES, то ограничение скорости не будет применяться, поскольку (на момент написания) Amazon SES включен в наш белый список.

* Если вы отправляете с домена, такого как `test.abc.123.example.com`, то ограничение скорости будет применяться к `example.com`. Многие спамеры используют сотни поддоменов, чтобы обойти обычные спам-фильтры, которые ограничивают скорость по уникальным именам хостов, а не по уникальным FQDN корневым доменам.

* `Отправители`, превышающие лимит скорости, будут отклонены с ошибкой 421.

Наши IMAP и SMTP серверы ограничивают количество одновременных подключений к вашим алиасам не более чем `60`.

Наши MX-серверы ограничивают [не включенных в белый список](#do-you-have-an-allowlist) отправителей от установления более 10 одновременных подключений (с кэшированием счетчика на 3 минуты, что соответствует тайм-ауту сокета в 3 минуты).

### Как вы защищаетесь от обратного рассылающегося спама {#how-do-you-protect-against-backscatter}

Неправильно направленные отказы или спам с отказами (известный как "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") могут негативно повлиять на репутацию IP-адресов отправителей.

Мы предпринимаем два шага для защиты от обратного рассылающегося спама, которые подробно описаны в следующих разделах [Предотвращение отказов от известных спамеров MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) и [Предотвращение ненужных отказов для защиты от обратного рассылающегося спама](#prevent-unnecessary-bounces-to-protect-against-backscatter) ниже.

### Предотвращение отказов от известных спамеров MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Мы загружаем список с сайта [Backscatter.org](https://www.backscatterer.org/) (поддерживается [UCEPROTECT](https://www.uceprotect.net/)) по адресу <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> каждый час и загружаем его в нашу базу данных Redis (мы также заранее сравниваем изменения; на случай, если какие-либо IP были удалены и это нужно учесть).
Если MAIL FROM пустой ИЛИ равен (без учёта регистра) любому из [адресов постмастера](#what-are-postmaster-addresses) (часть перед @ в адресе электронной почты), то мы проверяем, совпадает ли IP отправителя с одним из этого списка.

Если IP отправителя указан в списке (и не находится в нашем [белом списке](#do-you-have-an-allowlist)), то мы отправляем ошибку 554 с сообщением `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Мы будем уведомлены, если отправитель находится одновременно в списке Backscatterer и в нашем белом списке, чтобы при необходимости решить проблему.

Методы, описанные в этом разделе, соответствуют рекомендации "SAFE MODE" на <https://www.backscatterer.org/?target=usage> – где мы проверяем IP отправителя только если уже выполнены определённые условия.

### Предотвращение ненужных возвратов для защиты от обратного рассыла {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Возвраты — это письма, которые указывают на полную неудачу пересылки письма получателю, и письмо не будет повторно отправлено.

Распространённой причиной попадания в список Backscatterer являются ошибочные возвраты или спам с возвратами, поэтому мы должны защититься от этого несколькими способами:

1. Мы отправляем только при ошибках с кодом >= 500 (когда попытки переслать письма не удались, например, Gmail отвечает ошибкой уровня 500).

2. Мы отправляем только один раз (используем вычисленный ключ отпечатка возврата и сохраняем его в кэше, чтобы предотвратить дублирование). Отпечаток возврата — это ключ, который представляет собой отпечаток сообщения, объединённый с хешем адреса возврата и его кода ошибки. Подробнее о том, как вычисляется отпечаток сообщения, см. раздел [Fingerprinting](#how-do-you-determine-an-email-fingerprint). Успешно отправленные отпечатки возвратов истекают через 7 дней в нашем кэше Redis.

3. Мы отправляем только если MAIL FROM и/или From не пусты и не содержат (без учёта регистра) [имя пользователя постмастера](#what-are-postmaster-addresses) (часть перед @ в адресе электронной почты).

4. Мы не отправляем, если в исходном сообщении есть любой из следующих заголовков (без учёта регистра):

   * Заголовок `auto-submitted` со значением, отличным от `no`.
   * Заголовок `x-auto-response-suppress` со значением `dr`, `autoreply`, `auto-reply`, `auto_reply` или `all`.
   * Заголовок `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` или `x-auto-respond` (независимо от значения).
   * Заголовок `precedence` со значением `bulk`, `autoreply`, `auto-reply`, `auto_reply` или `list`.

5. Мы не отправляем, если адрес MAIL FROM или From заканчивается на `+donotreply`, `-donotreply`, `+noreply` или `-noreply`.

6. Мы не отправляем, если имя пользователя в адресе From было `mdaemon` и присутствовал заголовок (без учёта регистра) `X-MDDSN-Message`.

7. Мы не отправляем, если был заголовок (без учёта регистра) `content-type` со значением `multipart/report`.

### Как определяется отпечаток письма {#how-do-you-determine-an-email-fingerprint}

Отпечаток письма используется для определения уникальности письма и предотвращения доставки дубликатов сообщений и отправки [дублирующих возвратов](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Отпечаток вычисляется на основе следующего списка:

* Разрешённое клиентом полное доменное имя (FQDN) или IP-адрес
* Значение заголовка `Message-ID` (если есть)
* Значение заголовка `Date` (если есть)
* Значение заголовка `From` (если есть)
* Значение заголовка `To` (если есть)
* Значение заголовка `Cc` (если есть)
* Значение заголовка `Subject` (если есть)
* Значение тела письма (если есть)

### Могу ли я пересылать письма на порты, отличные от 25 (например, если мой провайдер заблокировал порт 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Да, с 5 мая 2020 года мы добавили эту функцию. Сейчас она работает на уровне домена, а не конкретного алиаса. Если вам нужна поддержка на уровне алиаса, пожалуйста, свяжитесь с нами и сообщите о своих потребностях.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Усиленная защита конфиденциальности:
  </strong>
  <span>
    Если вы используете платный тариф (в котором есть усиленная защита конфиденциальности), пожалуйста, перейдите в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a>, нажмите "Настроить" рядом с вашим доменом, а затем нажмите "Настройки". Если хотите узнать больше о платных тарифах, смотрите нашу страницу <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Цены</a>. В противном случае вы можете продолжить следовать инструкциям ниже.
  </span>
</div>
Если вы используете бесплатный тариф, просто добавьте новую DNS-запись <strong class="notranslate">TXT</strong>, как показано ниже, но измените порт с 25 на выбранный вами порт.

Например, если я хочу, чтобы все письма, отправляемые на `example.com`, перенаправлялись на SMTP-порт 1337 получателей-псевдонимов вместо 25:

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
    Наиболее распространённый сценарий настройки перенаправления на нестандартный порт — когда вы хотите перенаправлять все письма, отправляемые на example.com, на другой порт на example.com, отличный от стандартного SMTP-порта 25. Чтобы настроить это, просто добавьте следующую <strong class="notranslate">TXT</strong> запись для catch-all.
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

### Поддерживается ли символ плюс + для псевдонимов Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Да, абсолютно.

### Поддерживаются ли поддомены {#does-it-support-sub-domains}

Да, абсолютно. Вместо использования "@", ".", или пустого значения в качестве имени/хоста/псевдонима, просто используйте имя поддомена.

Если вы хотите, чтобы `foo.example.com` перенаправлял письма, введите `foo` в качестве значения имени/хоста/псевдонима в настройках DNS (для обеих записей MX и <strong class="notranslate">TXT</strong>).

### Перенаправляет ли это заголовки моих писем {#does-this-forward-my-emails-headers}

Да, абсолютно.

### Хорошо ли это протестировано {#is-this-well-tested}

Да, есть тесты, написанные с использованием [ava](https://github.com/avajs/ava), а также покрытие кода.

### Передаются ли сообщения и коды ответа SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Да, абсолютно. Например, если вы отправляете письмо на `hello@example.com`, и оно зарегистрировано для перенаправления на `user@gmail.com`, то сообщение и код ответа SMTP от SMTP-сервера "gmail.com" будут возвращены вместо прокси-сервера на "mx1.forwardemail.net" или "mx2.forwardemail.net".

### Как вы предотвращаете спамеров и обеспечиваете хорошую репутацию перенаправления почты {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Смотрите наши разделы [Как работает ваша система перенаправления почты](#how-does-your-email-forwarding-system-work), [Как вы обрабатываете проблемы доставки почты](#how-do-you-handle-email-delivery-issues) и [Как вы справляетесь с блокировкой ваших IP-адресов](#how-do-you-handle-your-ip-addresses-becoming-blocked) выше.

### Как вы выполняете DNS-запросы по доменным именам {#how-do-you-perform-dns-lookups-on-domain-names}

Мы создали проект с открытым исходным кодом :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) и используем его для DNS-запросов. По умолчанию используются DNS-серверы `1.1.1.1` и `1.0.0.1`, а DNS-запросы выполняются через [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") на уровне приложения.

:tangerine: [Tangerine](https://github.com/tangerine) по умолчанию использует [приватный DNS-сервис для потребителей от CloudFlare][cloudflare-dns].


## Аккаунт и оплата {#account-and-billing}

### Предоставляете ли вы гарантию возврата денег на платных тарифах {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Да! Автоматический возврат средств происходит при обновлении, понижении тарифа или отмене аккаунта в течение 30 дней с момента начала действия вашего плана. Это распространяется только на новых клиентов.
### Если я сменю тарифный план, вы сделаете пропорциональный расчет и вернете разницу {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Мы не делаем пропорциональный расчет и не возвращаем разницу при смене тарифного плана. Вместо этого мы конвертируем оставшийся срок с даты окончания вашего текущего плана в ближайший соответствующий срок для вашего нового плана (округляя вниз по месяцам).

Обратите внимание, что если вы переходите на более дорогой или более дешевый платный план в течение 30 дней с момента начала использования платного плана, мы автоматически вернем полную сумму за ваш текущий план.

### Могу ли я использовать эту службу переадресации электронной почты как "резервный" или "аварийный" MX-сервер {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Нет, это не рекомендуется, так как одновременно можно использовать только один почтовый сервер обмена. Резервные серверы обычно не обрабатываются повторно из-за неправильной настройки приоритетов и того, что почтовые серверы не учитывают проверку приоритета MX.

### Могу ли я отключить конкретные псевдонимы {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Если у вас платный план, то вам нужно перейти в <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Мой аккаунт <i class="fa fa-angle-right"></i> Домены</a> <i class="fa fa-angle-right"></i> Псевдонимы <i class="fa fa-angle-right"></i> Редактировать псевдоним <i class="fa fa-angle-right"></i> Снять отметку "Активен" <i class="fa fa-angle-right"></i> Продолжить.
  </span>
</div>

Да, просто отредактируйте вашу DNS-запись <strong class="notranslate">TXT</strong> и добавьте к псевдониму один, два или три восклицательных знака в начале (см. ниже).

Обратите внимание, что *следует* сохранять двоеточие ":", так как оно необходимо, если вы решите снова включить этот псевдоним (а также используется при импорте, если вы перейдете на один из наших платных планов).

**Для тихого отклонения (отправителю кажется, что сообщение успешно отправлено, но на самом деле оно никуда не доставляется) (код состояния `250`):** Если вы добавите к псевдониму один восклицательный знак "!", то отправителям, пытающимся отправить на этот адрес, будет возвращен успешный код состояния `250`, но сами письма никуда не попадут (например, черная дыра или `/dev/null`).

**Для мягкого отклонения (код состояния `421`):** Если вы добавите к псевдониму два восклицательных знака "!!", то отправителям будет возвращен временный код ошибки `421`, и письма будут пытаться доставляться в течение до 5 дней, прежде чем будут отклонены и вернутся обратно.

**Для жесткого отклонения (код состояния `550`):** Если вы добавите к псевдониму три восклицательных знака "!!!", то отправителям будет возвращен постоянный код ошибки `550`, и письма будут отклонены и вернутся обратно.

Например, если я хочу, чтобы все письма, отправленные на `alias@example.com`, перестали перенаправляться на `user@gmail.com` и были отклонены с возвратом (например, использовать три восклицательных знака):

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
    Вы также можете переписать адрес получателя переадресации просто на "nobody@forwardemail.net", что направит письма никому, как в примере ниже.
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
    Если вы хотите повысить безопасность, вы также можете удалить часть ":user@gmail.com" (или ":nobody@forwardemail.net"), оставив только "!!!alias", как в примере ниже.
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

### Могу ли я пересылать письма нескольким получателям {#can-i-forward-emails-to-multiple-recipients}

Да, конечно. Просто укажите нескольких получателей в ваших <strong class="notranslate">TXT</strong> записях.

Например, если я хочу, чтобы письмо, отправленное на `hello@example.com`, пересылалось на `user+a@gmail.com` и `user+b@gmail.com`, то моя <strong class="notranslate">TXT</strong> запись будет выглядеть так:

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

Решать вам!

### Могу ли я иметь несколько глобальных получателей для catch-all {#can-i-have-multiple-global-catch-all-recipients}

Да, можете. Просто укажите нескольких глобальных получателей для catch-all в ваших <strong class="notranslate">TXT</strong> записях.

Например, если я хочу, чтобы каждое письмо, отправленное на `*@example.com` (звездочка означает подстановочный знак, то есть catch-all), пересылалось на `user+a@gmail.com` и `user+b@gmail.com`, то моя <strong class="notranslate">TXT</strong> запись будет выглядеть так:

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
Это зависит от вас!

### Есть ли максимальное ограничение на количество адресов электронной почты, на которые я могу пересылать письма с одного алиаса {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Да, по умолчанию лимит составляет 10. Это НЕ означает, что у вас может быть только 10 алиасов на вашем домене. Вы можете иметь сколько угодно алиасов (неограниченное количество). Это означает, что вы можете пересылать один алиас максимум на 10 уникальных адресов электронной почты. Вы можете иметь `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (от 1 до 10) — и любые письма на `hello@example.com` будут пересылаться на `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (от 1 до 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Совет:
  </strong>
  <span>
    Нужны более 10 получателей на один алиас? Отправьте нам письмо, и мы с радостью увеличим лимит вашего аккаунта.
  </span>
</div>

### Могу ли я рекурсивно пересылать письма {#can-i-recursively-forward-emails}

Да, можете, однако вы всё равно должны соблюдать максимальный лимит. Если у вас есть `hello:linus@example.com` и `linus:user@gmail.com`, то письма на `hello@example.com` будут пересылаться на `linus@example.com` и `user@gmail.com`. Обратите внимание, что при попытке рекурсивной пересылки писем сверх максимального лимита будет выдана ошибка.

### Могут ли люди отменять или регистрировать мою пересылку электронной почты без моего разрешения {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Мы используем проверку записей MX и <strong class="notranslate">TXT</strong>, поэтому если вы добавляете соответствующие MX и <strong class="notranslate">TXT</strong> записи этого сервиса, значит вы зарегистрированы. Если вы их удаляете, значит вы отписываетесь. Вы являетесь владельцем своего домена и управляете DNS, поэтому если кто-то имеет доступ к этому, то это проблема.

### Как это бесплатно {#how-is-it-free}

Forward Email предлагает бесплатный тариф благодаря сочетанию открытой разработки, эффективной инфраструктуры и опциональных платных планов, поддерживающих сервис.

Наш бесплатный тариф поддерживается:

1. **Открытой разработкой**: Наш код открыт, что позволяет сообществу вносить вклад и обеспечивает прозрачность работы.

2. **Эффективной инфраструктурой**: Мы оптимизировали наши системы для пересылки почты с минимальными ресурсами.

3. **Платными премиум-планами**: Пользователи, которым нужны дополнительные функции, такие как отправка через SMTP, получение через IMAP или расширенные настройки конфиденциальности, подписываются на платные планы.

4. **Разумными лимитами использования**: Бесплатный тариф имеет справедливые правила использования для предотвращения злоупотреблений.

> \[!NOTE]
> Мы стремимся сохранять базовую пересылку электронной почты бесплатной, предлагая премиум-функции для пользователей с более продвинутыми потребностями.

> \[!TIP]
> Если вы считаете наш сервис полезным, рассмотрите возможность перехода на платный план для поддержки дальнейшей разработки и обслуживания.

### Каков максимальный размер письма {#what-is-the-max-email-size-limit}

По умолчанию лимит размера составляет 50 МБ, включая содержимое, заголовки и вложения. Обратите внимание, что такие сервисы, как Gmail и Outlook, разрешают только до 25 МБ, и если вы превысите этот лимит при отправке на адреса этих провайдеров, вы получите сообщение об ошибке.

Если размер файла превышен, возвращается ошибка с соответствующим кодом ответа.

### Храните ли вы логи писем {#do-you-store-logs-of-emails}

Нет, мы не записываем на диск и не храним логи — за исключением [логов ошибок](#do-you-store-error-logs) и [исходящей SMTP почты](#do-you-support-sending-email-with-smtp) (см. нашу [Политику конфиденциальности](/privacy)).

Всё происходит в памяти, а [наш исходный код доступен на GitHub](https://github.com/forwardemail).

### Храните ли вы логи ошибок {#do-you-store-error-logs}

**Да. Вы можете получить доступ к логам ошибок в разделе [Мой аккаунт → Логи](/my-account/logs) или [Мой аккаунт → Домены](/my-account/domains).**

С февраля 2023 года мы храним логи ошибок с SMTP-кодами ответа `4xx` и `5xx` в течение 7 дней — они содержат SMTP-ошибку, конверт и заголовки письма (мы **не храним** тело письма и вложения).
Журналы ошибок позволяют проверять отсутствие важных писем и снижать количество ложных срабатываний спама для [ваших доменов](/my-account/domains). Они также являются отличным ресурсом для отладки проблем с [вебхуками электронной почты](#do-you-support-webhooks) (поскольку журналы ошибок содержат ответ конечной точки вебхука).

Журналы ошибок для [ограничения скорости](#do-you-have-rate-limiting) и [серой листы] (#do-you-have-a-greylist) недоступны, так как соединение завершается преждевременно (например, до передачи команд `RCPT TO` и `MAIL FROM`).

Подробнее смотрите в нашей [Политике конфиденциальности](/privacy).

### Вы читаете мои письма {#do-you-read-my-emails}

Нет, абсолютно нет. Смотрите нашу [Политику конфиденциальности](/privacy).

Многие другие сервисы пересылки электронной почты хранят и потенциально могут читать ваши письма. Нет никакой причины хранить пересылаемые письма на диске — поэтому мы разработали первое решение с открытым исходным кодом, которое работает полностью в памяти.

Мы считаем, что вы имеете право на конфиденциальность, и строго его соблюдаем. Код, который развёртывается на сервере, является [программным обеспечением с открытым исходным кодом на GitHub](https://github.com/forwardemail) для прозрачности и укрепления доверия.

### Могу ли я отправлять письма от имени другого адреса в Gmail с этим сервисом {#can-i-send-mail-as-in-gmail-with-this}

Да! С 2 октября 2018 года эта функция добавлена. Смотрите [Как отправлять письма от имени другого адреса в Gmail](#how-to-send-mail-as-using-gmail) выше!

Также следует настроить SPF-запись для Gmail в вашей DNS-конфигурации в виде <strong class="notranslate">TXT</strong> записи.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Если вы используете Gmail (например, функцию Send Mail As) или G Suite, вам нужно добавить <code>include:_spf.google.com</code> в вашу SPF <strong class="notranslate">TXT</strong> запись, например:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Могу ли я отправлять письма от имени другого адреса в Outlook с этим сервисом {#can-i-send-mail-as-in-outlook-with-this}

Да! С 2 октября 2018 года эта функция добавлена. Просто ознакомьтесь с этими двумя ссылками от Microsoft ниже:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Также следует настроить SPF-запись для Outlook в вашей DNS-конфигурации в виде <strong class="notranslate">TXT</strong> записи.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Важно:
  </strong>
  <span>
    Если вы используете Microsoft Outlook или Live.com, вам нужно добавить <code>include:spf.protection.outlook.com</code> в вашу SPF <strong class="notranslate">TXT</strong> запись, например:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Могу ли я отправлять письма от имени другого адреса в Apple Mail и iCloud Mail с этим сервисом {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Если вы являетесь подписчиком iCloud+, вы можете использовать собственный домен. [Наш сервис также совместим с Apple Mail](#apple-mail).

Пожалуйста, смотрите <https://support.apple.com/en-us/102540> для получения дополнительной информации.

### Могу ли я пересылать неограниченное количество писем с этим сервисом {#can-i-forward-unlimited-emails-with-this}

Да, однако для «относительно неизвестных» отправителей действует ограничение скорости — 100 соединений в час на имя хоста или IP. Смотрите разделы о [ограничении скорости](#do-you-have-rate-limiting) и [серой листе](#do-you-have-a-greylist) выше.

Под «относительно неизвестными» мы понимаем отправителей, которые не входят в [белый список](#do-you-have-an-allowlist).

Если это ограничение превышено, мы отправляем код ответа 421, который сообщает почтовому серверу отправителя повторить попытку позже.

### Предлагаете ли вы неограниченное количество доменов за одну цену {#do-you-offer-unlimited-domains-for-one-price}

Да. Независимо от выбранного плана, вы платите только одну ежемесячную ставку — которая покрывает все ваши домены.
### Какие способы оплаты вы принимаете {#which-payment-methods-do-you-accept}

Forward Email принимает следующие способы оплаты — одноразовые или ежемесячные/ежеквартальные/ежегодные:

1. **Кредитные/дебетовые карты/банковские переводы**: Visa, Mastercard, American Express, Discover, JCB, Diners Club и др.
2. **PayPal**: Подключите свой аккаунт PayPal для удобных платежей
3. **Криптовалюта**: Мы принимаем платежи через стабильные монеты Stripe в сетях Ethereum, Polygon и Solana

> \[!NOTE]
> Мы храним ограниченную информацию о платежах на наших серверах, которая включает только идентификаторы платежей и ссылки на транзакции, клиентов, подписки и ID платежей [Stripe](https://stripe.com/global) и [PayPal](https://www.paypal.com).

> \[!TIP]
> Для максимальной конфиденциальности рассмотрите возможность использования платежей в криптовалюте.

Все платежи обрабатываются безопасно через Stripe или PayPal. Ваши платежные данные никогда не сохраняются на наших серверах.


## Дополнительные ресурсы {#additional-resources}

> \[!TIP]
> Наши статьи ниже регулярно обновляются новыми руководствами, советами и технической информацией. Часто проверяйте для получения последних материалов.

* [Кейсы и документация для разработчиков](/blog/docs)
* [Ресурсы](/resources)
* [Руководства](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
