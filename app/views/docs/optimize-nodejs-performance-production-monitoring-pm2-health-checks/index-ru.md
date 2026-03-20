# Как оптимизировать производственную инфраструктуру Node.js: лучшие практики {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Руководство по оптимизации производительности Node.js" class="rounded-lg" />


## Содержание {#table-of-contents}

* [Предисловие](#foreword)
* [Наша революция оптимизации производительности на одном ядре на 573%](#our-573-single-core-performance-optimization-revolution)
  * [Почему оптимизация производительности на одном ядре важна для Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Связанный контент](#related-content)
* [Настройка производственной среды Node.js: наш технологический стек](#nodejs-production-environment-setup-our-technology-stack)
  * [Менеджер пакетов: pnpm для производственной эффективности](#package-manager-pnpm-for-production-efficiency)
  * [Веб-фреймворк: Koa для современного производства на Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Обработка фоновых задач: Bree для надежности в производстве](#background-job-processing-bree-for-production-reliability)
  * [Обработка ошибок: @hapi/boom для надежности в производстве](#error-handling-hapiboom-for-production-reliability)
* [Как мониторить приложения Node.js в производстве](#how-to-monitor-nodejs-applications-in-production)
  * [Мониторинг Node.js на уровне системы](#system-level-nodejs-production-monitoring)
  * [Мониторинг приложений для Node.js в производстве](#application-level-monitoring-for-nodejs-production)
  * [Специфический мониторинг приложений](#application-specific-monitoring)
* [Мониторинг Node.js в производстве с помощью PM2 Health Checks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Наша система проверки состояния PM2](#our-pm2-health-check-system)
  * [Наша производственная конфигурация PM2](#our-pm2-production-configuration)
  * [Автоматизированное развертывание PM2](#automated-pm2-deployment)
* [Система обработки и классификации ошибок в производстве](#production-error-handling-and-classification-system)
  * [Наша реализация isCodeBug для производства](#our-iscodebug-implementation-for-production)
  * [Интеграция с нашим производственным логированием](#integration-with-our-production-logging)
  * [Связанный контент](#related-content-1)
* [Продвинутая отладка производительности с v8-profiler-next и cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Наш подход к профилированию для Node.js в производстве](#our-profiling-approach-for-nodejs-production)
  * [Как мы реализуем анализ снимков кучи](#how-we-implement-heap-snapshot-analysis)
  * [Рабочий процесс отладки производительности](#performance-debugging-workflow)
  * [Рекомендуемая реализация для вашего приложения Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Интеграция с нашим производственным мониторингом](#integration-with-our-production-monitoring)
* [Безопасность производственной инфраструктуры Node.js](#nodejs-production-infrastructure-security)
  * [Безопасность на уровне системы для Node.js в производстве](#system-level-security-for-nodejs-production)
  * [Безопасность приложений для Node.js](#application-security-for-nodejs-applications)
  * [Автоматизация безопасности инфраструктуры](#infrastructure-security-automation)
  * [Наш контент по безопасности](#our-security-content)
* [Архитектура базы данных для приложений Node.js](#database-architecture-for-nodejs-applications)
  * [Реализация SQLite для Node.js в производстве](#sqlite-implementation-for-nodejs-production)
  * [Реализация MongoDB для Node.js в производстве](#mongodb-implementation-for-nodejs-production)
* [Обработка фоновых задач в производстве Node.js](#nodejs-production-background-job-processing)
  * [Наша настройка сервера Bree для производства](#our-bree-server-setup-for-production)
  * [Примеры производственных задач](#production-job-examples)
  * [Наши шаблоны планирования задач для Node.js в производстве](#our-job-scheduling-patterns-for-nodejs-production)
* [Автоматизированное обслуживание производственных приложений Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Наша реализация очистки](#our-cleanup-implementation)
  * [Управление дисковым пространством для Node.js в производстве](#disk-space-management-for-nodejs-production)
  * [Автоматизация обслуживания инфраструктуры](#infrastructure-maintenance-automation)
* [Руководство по реализации развертывания Node.js в производстве](#nodejs-production-deployment-implementation-guide)
  * [Изучите наш реальный код для лучших практик производства](#study-our-actual-code-for-production-best-practices)
  * [Учитесь на наших блог-постах](#learn-from-our-blog-posts)
  * [Автоматизация инфраструктуры для Node.js в производстве](#infrastructure-automation-for-nodejs-production)
  * [Наши кейс-стади](#our-case-studies)
* [Заключение: лучшие практики развертывания Node.js в производстве](#conclusion-nodejs-production-deployment-best-practices)
* [Полный список ресурсов для Node.js в производстве](#complete-resource-list-for-nodejs-production)
  * [Наши основные файлы реализации](#our-core-implementation-files)
  * [Наши серверные реализации](#our-server-implementations)
  * [Наша автоматизация инфраструктуры](#our-infrastructure-automation)
  * [Наши технические блог-посты](#our-technical-blog-posts)
  * [Наши корпоративные кейс-стади](#our-enterprise-case-studies)
## Предисловие {#foreword}

В Forward Email мы потратили годы на совершенствование нашей среды продакшн для Node.js. Это подробное руководство делится проверенными на практике лучшими методами развертывания Node.js в продакшн, с акцентом на оптимизацию производительности, мониторинг и уроки, которые мы извлекли при масштабировании приложений Node.js для обработки миллионов транзакций в день.


## Наша революция оптимизации производительности одного ядра на 573% {#our-573-single-core-performance-optimization-revolution}

Когда мы перешли с процессоров Intel на AMD Ryzen, мы достигли **улучшения производительности на 573%** в наших приложениях Node.js. Это была не просто незначительная оптимизация — она фундаментально изменила производительность наших приложений Node.js в продакшн и демонстрирует важность оптимизации производительности одного ядра для любого приложения Node.js.

> \[!TIP]
> Для лучших практик развертывания Node.js в продакшн выбор оборудования критичен. Мы специально выбрали хостинг DataPacket из-за доступности AMD Ryzen, поскольку производительность одного ядра крайне важна для приложений Node.js, так как выполнение JavaScript однопоточное.

### Почему оптимизация производительности одного ядра важна для Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Наш переход с Intel на AMD Ryzen привел к:

* **улучшению производительности на 573%** при обработке запросов (задокументировано в [GitHub Issue #1519 на нашей странице статуса](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **исчезновению задержек обработки** до почти мгновенных ответов (упомянуто в [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **лучшему соотношению цена-производительность** для продакшн-сред Node.js
* **улучшению времени отклика** на всех конечных точках нашего приложения

Увеличение производительности было настолько значительным, что теперь мы считаем процессоры AMD Ryzen обязательными для любого серьезного продакшн-развертывания Node.js, будь то веб-приложения, API, микросервисы или любая другая нагрузка Node.js.

### Связанный контент {#related-content}

Для получения дополнительной информации о наших инфраструктурных решениях ознакомьтесь с:

* [Лучший сервис переадресации электронной почты](https://forwardemail.net/blog/docs/best-email-forwarding-service) — сравнения производительности
* [Самостоятельное решение](https://forwardemail.net/blog/docs/self-hosted-solution) — рекомендации по оборудованию


## Настройка продакшн-среды Node.js: наш технологический стек {#nodejs-production-environment-setup-our-technology-stack}

Наши лучшие практики развертывания Node.js в продакшн включают осознанный выбор технологий, основанный на многолетнем опыте работы в продакшн. Вот что мы используем и почему эти решения применимы к любому приложению Node.js:

### Менеджер пакетов: pnpm для эффективности в продакшн {#package-manager-pnpm-for-production-efficiency}

**Что мы используем:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (фиксированная версия)

Мы выбрали pnpm вместо npm и yarn для настройки продакшн-среды Node.js, потому что:

* **Быстрее установка** в CI/CD пайплайнах
* **Экономия дискового пространства** за счет жестких ссылок
* **Строгая резолюция зависимостей**, предотвращающая фантомные зависимости
* **Лучшая производительность** при развертывании в продакшн

> \[!NOTE]
> В рамках наших лучших практик развертывания Node.js в продакшн мы фиксируем точные версии критически важных инструментов, таких как pnpm, чтобы обеспечить согласованное поведение во всех средах и на машинах членов команды.

**Детали реализации:**

* [Конфигурация package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Наш блог о экосистеме NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Веб-фреймворк: Koa для современного продакшна Node.js {#web-framework-koa-for-modern-nodejs-production}

**Что мы используем:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Мы выбрали Koa вместо Express для нашей производственной инфраструктуры на Node.js из-за его современной поддержки async/await и более чистой композиции middleware. Наш основатель Ник Боу (Nick Baugh) внес вклад в разработку как Express, так и Koa, что дало нам глубокое понимание обеих платформ для использования в продакшене.

Эти шаблоны применимы независимо от того, строите ли вы REST API, GraphQL серверы, веб-приложения или микросервисы.

**Наши примеры реализации:**

* [Настройка веб-сервера](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Конфигурация API сервера](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Руководство по реализации контактных форм](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Обработка фоновых задач: Bree для надежности в продакшене {#background-job-processing-bree-for-production-reliability}

**Что мы используем:** планировщик [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Мы создали и поддерживаем Bree, потому что существующие планировщики задач не удовлетворяли наши потребности в поддержке worker threads и современных возможностей JavaScript в продакшн-средах Node.js. Это применимо к любому приложению на Node.js, которому нужна фоновая обработка, запланированные задачи или worker threads.

**Наши примеры реализации:**

* [Настройка сервера Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Все наши определения задач](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Задача проверки состояния PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Реализация задачи очистки](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Обработка ошибок: @hapi/boom для надежности в продакшене {#error-handling-hapiboom-for-production-reliability}

**Что мы используем:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Мы используем @hapi/boom для структурированных ответов с ошибками во всех наших продакшн-приложениях на Node.js. Этот подход подходит для любого приложения на Node.js, которому нужна единообразная обработка ошибок.

**Наши примеры реализации:**

* [Хелпер классификации ошибок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Реализация логгера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Как мониторить приложения Node.js в продакшене {#how-to-monitor-nodejs-applications-in-production}

Наш подход к мониторингу приложений Node.js в продакшене развивался на протяжении многих лет эксплуатации приложений в масштабе. Мы реализуем мониторинг на нескольких уровнях, чтобы обеспечить надежность и производительность для любого типа приложений на Node.js.

### Системный мониторинг Node.js в продакшене {#system-level-nodejs-production-monitoring}

**Наша основная реализация:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Что мы используем:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Наши пороги мониторинга в продакшене (из нашего реального продакшн-кода):

* **Лимит кучи 2 ГБ** с автоматическими оповещениями
* **Порог предупреждения при использовании памяти 25%**
* **Порог оповещения при использовании CPU 80%**
* **Порог предупреждения при использовании диска 75%**

> \[!WARNING]
> Эти пороги подходят для нашей конкретной аппаратной конфигурации. При реализации мониторинга Node.js в продакшене ознакомьтесь с реализацией monitor-server.js, чтобы понять точную логику и адаптировать значения под вашу среду.

### Мониторинг на уровне приложений для Node.js в продакшене {#application-level-monitoring-for-nodejs-production}

**Наша классификация ошибок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Этот хелпер различает:

* **Реальные ошибки кода**, требующие немедленного внимания
* **Ошибки пользователя**, которые являются ожидаемым поведением
* **Сбои внешних сервисов**, которые мы не можем контролировать

Этот шаблон применим к любому приложению на Node.js — веб-приложениям, API, микросервисам или фоновым сервисам.
**Наша реализация логирования:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Мы реализуем комплексное скрытие полей для защиты конфиденциальной информации, при этом сохраняя полезные возможности отладки в нашей производственной среде Node.js.

### Мониторинг, специфичный для приложения {#application-specific-monitoring}

**Наши серверные реализации:**

* [SMTP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Мониторинг очереди:** Мы устанавливаем лимиты очереди в 5 ГБ и тайм-ауты обработки запросов в 180 секунд, чтобы предотвратить исчерпание ресурсов. Эти шаблоны применимы к любому приложению Node.js с очередями или фоновыми процессами.


## Мониторинг Node.js в продакшене с помощью PM2 Health Checks {#nodejs-production-monitoring-with-pm2-health-checks}

Мы усовершенствовали нашу настройку продакшен-среды Node.js с PM2 на основе многолетнего опыта эксплуатации. Наши проверки состояния PM2 необходимы для поддержания надежности любого приложения Node.js.

### Наша система проверки состояния PM2 {#our-pm2-health-check-system}

**Наша основная реализация:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Наш мониторинг Node.js в продакшене с помощью PM2 Health Checks включает:

* **Запускается каждые 20 минут** по расписанию cron
* **Требует минимум 15 минут безотказной работы** перед признанием процесса здоровым
* **Проверяет статус процесса и использование памяти**
* **Автоматически перезапускает сбойные процессы**
* **Предотвращает циклы перезапуска** с помощью интеллектуальной проверки состояния

> \[!CAUTION]
> Для лучших практик развертывания Node.js в продакшене мы требуем 15+ минут безотказной работы перед признанием процесса здоровым, чтобы избежать циклов перезапуска. Это предотвращает каскадные сбои, когда процессы испытывают проблемы с памятью или другими ресурсами.

### Наша продакшен-конфигурация PM2 {#our-pm2-production-configuration}

**Наша настройка экосистемы:** Изучите наши файлы запуска серверов для настройки продакшен-среды Node.js:

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планировщик Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Эти шаблоны применимы независимо от того, запускаете ли вы приложения Express, серверы Koa, GraphQL API или любое другое приложение Node.js.

### Автоматизированное развертывание PM2 {#automated-pm2-deployment}

**Развертывание PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Мы автоматизируем всю нашу настройку PM2 с помощью Ansible, чтобы обеспечить единообразные развертывания Node.js в продакшене на всех наших серверах.


## Система обработки и классификации ошибок в продакшене {#production-error-handling-and-classification-system}

Одна из наших самых ценных лучших практик развертывания Node.js в продакшене — интеллектуальная классификация ошибок, применимая к любому приложению Node.js:

### Наша реализация isCodeBug для продакшена {#our-iscodebug-implementation-for-production}

**Исходник:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Этот помощник обеспечивает интеллектуальную классификацию ошибок для приложений Node.js в продакшене, чтобы:

* **Приоритизировать реальные баги** над ошибками пользователей
* **Улучшить реакцию на инциденты**, сосредотачиваясь на реальных проблемах
* **Снизить усталость от оповещений** из-за ожидаемых ошибок пользователей
* **Лучше понимать** проблемы приложения и ошибки, вызванные пользователями

Этот шаблон работает для любого приложения Node.js — будь то сайты электронной коммерции, SaaS-платформы, API или микросервисы.

### Интеграция с нашим продакшен-логированием {#integration-with-our-production-logging}

**Интеграция с логгером:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Наш логгер использует `isCodeBug` для определения уровней оповещений и редактирования полей, что позволяет нам получать уведомления о реальных проблемах, фильтруя шум в нашей производственной среде Node.js.

### Связанный контент {#related-content-1}

Узнайте больше о наших шаблонах обработки ошибок:

* [Построение надежной платежной системы](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Шаблоны обработки ошибок
* [Защита конфиденциальности электронной почты](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Обработка ошибок безопасности


## Продвинутая отладка производительности с v8-profiler-next и cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Мы используем продвинутые инструменты профилирования для анализа снимков кучи и отладки проблем с OOM (Out of Memory), узких мест производительности и проблем с памятью Node.js в нашей производственной среде. Эти инструменты необходимы для любого приложения Node.js, испытывающего утечки памяти или проблемы с производительностью.

### Наш подход к профилированию для Node.js в продакшене {#our-profiling-approach-for-nodejs-production}

**Рекомендуемые инструменты:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Для создания снимков кучи и профилей CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Для анализа профилей CPU и снимков кучи

> \[!TIP]
> Мы используем v8-profiler-next и cpupro вместе, чтобы создать полный рабочий процесс отладки производительности для наших приложений Node.js. Эта комбинация помогает выявлять утечки памяти, узкие места производительности и оптимизировать наш производственный код.

### Как мы реализуем анализ снимков кучи {#how-we-implement-heap-snapshot-analysis}

**Наша реализация мониторинга:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Наш производственный мониторинг включает автоматическое создание снимков кучи при превышении порогов памяти. Это помогает нам отлаживать проблемы OOM до того, как они вызовут сбои приложения.

**Ключевые шаблоны реализации:**

* **Автоматические снимки** при превышении порога размера кучи в 2 ГБ
* **Профилирование по сигналу** для анализа по запросу в продакшене
* **Политики хранения** для управления хранением снимков
* **Интеграция с нашими задачами очистки** для автоматического обслуживания

### Рабочий процесс отладки производительности {#performance-debugging-workflow}

**Изучите нашу реальную реализацию:**

* [Реализация мониторинга сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Мониторинг кучи и создание снимков
* [Задача очистки](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Хранение и очистка снимков
* [Интеграция логгера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Логирование производительности

### Рекомендуемая реализация для вашего приложения Node.js {#recommended-implementation-for-your-nodejs-application}

**Для анализа снимков кучи:**

1. **Установите v8-profiler-next** для создания снимков
2. **Используйте cpupro** для анализа созданных снимков
3. **Реализуйте пороги мониторинга**, аналогичные monitor-server.js
4. **Настройте автоматическую очистку** для управления хранением снимков
5. **Создайте обработчики сигналов** для профилирования по запросу в продакшене

**Для профилирования CPU:**

1. **Создавайте профили CPU** в периоды высокой нагрузки
2. **Анализируйте с помощью cpupro** для выявления узких мест
3. **Сосредоточьтесь на горячих путях** и возможностях оптимизации
4. **Отслеживайте производительность до и после** улучшений

> \[!WARNING]
> Создание снимков кучи и профилей CPU может влиять на производительность. Мы рекомендуем реализовать ограничение частоты и включать профилирование только при расследовании конкретных проблем или во время окон обслуживания.

### Интеграция с нашим производственным мониторингом {#integration-with-our-production-monitoring}

Наши инструменты профилирования интегрируются с нашей более широкой стратегией мониторинга:

* **Автоматический запуск** на основе порогов памяти/CPU
* **Интеграция оповещений** при обнаружении проблем с производительностью
* **Исторический анализ** для отслеживания тенденций производительности со временем
* **Корреляция с метриками приложения** для комплексной отладки
Этот подход помог нам выявлять и устранять утечки памяти, оптимизировать горячие участки кода и поддерживать стабильную производительность в нашей производственной среде Node.js.


## Безопасность производственной инфраструктуры Node.js {#nodejs-production-infrastructure-security}

Мы реализуем комплексную безопасность для нашей производственной инфраструктуры Node.js с помощью автоматизации Ansible. Эти практики применимы к любому приложению Node.js:

### Безопасность на уровне системы для производственной среды Node.js {#system-level-security-for-nodejs-production}

**Наша реализация Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Наши ключевые меры безопасности для производственных сред Node.js:

* **Отключен swap** для предотвращения записи конфиденциальных данных на диск
* **Отключены дампы памяти (core dumps)** для предотвращения утечки памяти с конфиденциальной информацией
* **Заблокировано использование USB-накопителей** для предотвращения несанкционированного доступа к данным
* **Настройка параметров ядра** для обеспечения безопасности и производительности

> \[!WARNING]
> При внедрении лучших практик развертывания Node.js в производственной среде отключение swap может привести к завершению процессов из-за нехватки памяти, если ваше приложение превысит доступный объем ОЗУ. Мы внимательно контролируем использование памяти и правильно подбираем размеры серверов.

### Безопасность приложений для Node.js {#application-security-for-nodejs-applications}

**Наше скрытие полей в логах:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Мы скрываем конфиденциальные поля в логах, включая пароли, токены, API-ключи и личную информацию. Это защищает конфиденциальность пользователей, сохраняя при этом возможности отладки в любой производственной среде Node.js.

### Автоматизация безопасности инфраструктуры {#infrastructure-security-automation}

**Наш полный набор Ansible для производственной среды Node.js:**

* [Плейбук безопасности](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Управление SSH-ключами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Управление сертификатами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Настройка DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Наш контент по безопасности {#our-security-content}

Узнайте больше о нашем подходе к безопасности:

* [Лучшие компании по аудиту безопасности](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Квантово-устойчивая зашифрованная электронная почта](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Почему безопасность электронной почты с открытым исходным кодом](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Архитектура базы данных для приложений Node.js {#database-architecture-for-nodejs-applications}

Мы используем гибридный подход к базам данных, оптимизированный для наших приложений Node.js. Эти шаблоны могут быть адаптированы для любого приложения Node.js:

### Реализация SQLite для производственной среды Node.js {#sqlite-implementation-for-nodejs-production}

**Что мы используем:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Наша конфигурация:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Мы используем SQLite для данных, специфичных для пользователя, в наших приложениях Node.js, потому что это обеспечивает:

* **Изоляцию данных** для каждого пользователя/арендатора
* **Лучшую производительность** для запросов одного пользователя
* **Упрощенное резервное копирование** и миграцию
* **Снижение сложности** по сравнению с общими базами данных

Этот шаблон хорошо подходит для SaaS-приложений, многопользовательских систем или любого приложения Node.js, которому нужна изоляция данных.

### Реализация MongoDB для производственной среды Node.js {#mongodb-implementation-for-nodejs-production}

**Что мы используем:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Наша реализация настройки:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Наша конфигурация:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Мы используем MongoDB для данных приложения в нашей производственной среде Node.js, потому что она обеспечивает:

* **Гибкую схему** для эволюционирующих структур данных
* **Лучшую производительность** для сложных запросов
* **Возможности горизонтального масштабирования**
* **Богатый язык запросов**

> \[!NOTE]
> Наш гибридный подход оптимизирован под наши конкретные задачи. Изучите наши реальные шаблоны использования базы данных в кодовой базе, чтобы понять, подходит ли этот подход для вашего приложения на Node.js.


## Обработка фоновых задач в Node.js в производственной среде {#nodejs-production-background-job-processing}

Мы построили архитектуру фоновых задач на основе Bree для надежного развертывания Node.js в производственной среде. Это применимо к любому приложению Node.js, которому нужна фоновая обработка:

### Наша настройка сервера Bree для продакшена {#our-bree-server-setup-for-production}

**Наша основная реализация:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Наше развертывание Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Примеры производственных задач {#production-job-examples}

**Мониторинг состояния:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Автоматизация очистки:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Все наши задачи:** [Просмотреть полный каталог задач](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Эти шаблоны применимы к любому приложению Node.js, которому нужны:

* Запланированные задачи (обработка данных, отчеты, очистка)
* Фоновая обработка (изменение размера изображений, отправка писем, импорт данных)
* Мониторинг состояния и обслуживание
* Использование рабочих потоков для задач с высокой нагрузкой на ЦП

### Наши шаблоны планирования задач для Node.js в продакшене {#our-job-scheduling-patterns-for-nodejs-production}

Изучите наши реальные шаблоны планирования задач в каталоге jobs, чтобы понять:

* Как мы реализуем планирование, похожее на cron, в Node.js в продакшене
* Нашу обработку ошибок и логику повторных попыток
* Как мы используем рабочие потоки для задач с высокой нагрузкой на ЦП


## Автоматизированное обслуживание для производственных приложений Node.js {#automated-maintenance-for-production-nodejs-applications}

Мы реализуем проактивное обслуживание, чтобы предотвратить распространенные проблемы в продакшене Node.js. Эти шаблоны применимы к любому приложению Node.js:

### Наша реализация очистки {#our-cleanup-implementation}

**Исходник:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Наше автоматизированное обслуживание для производственных приложений Node.js нацелено на:

* **Временные файлы**, старше 24 часов
* **Файлы журналов** за пределами срока хранения
* **Файлы кэша** и временные данные
* **Загруженные файлы**, которые больше не нужны
* **Снимки кучи** для отладки производительности

Эти шаблоны применимы к любому приложению Node.js, которое генерирует временные файлы, логи или кэшированные данные.

### Управление дисковым пространством для Node.js в продакшене {#disk-space-management-for-nodejs-production}

**Наши пороги мониторинга:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Лимиты очереди** для фоновой обработки
* **Предупреждение при использовании диска 75%**
* **Автоматическая очистка** при превышении порогов

### Автоматизация обслуживания инфраструктуры {#infrastructure-maintenance-automation}

**Наша автоматизация Ansible для Node.js в продакшене:**

* [Развертывание окружения](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Управление ключами развертывания](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Руководство по реализации развертывания Node.js в продакшене {#nodejs-production-deployment-implementation-guide}
### Изучите наш реальный код для лучших практик продакшена {#study-our-actual-code-for-production-best-practices}

**Начните с этих ключевых файлов для настройки продакшен-среды Node.js:**

1. **Конфигурация:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Мониторинг:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Обработка ошибок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Логирование:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Здоровье процесса:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Учитесь на наших блог-постах {#learn-from-our-blog-posts}

**Наши технические руководства по реализации для продакшена Node.js:**

* [Экосистема NPM пакетов](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Создание платежных систем](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Реализация защиты электронной почты](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript контактные формы](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Интеграция электронной почты с React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Автоматизация инфраструктуры для продакшена Node.js {#infrastructure-automation-for-nodejs-production}

**Наши Ansible playbooks для изучения развертывания продакшена Node.js:**

* [Полный каталог playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Усиление безопасности](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Настройка Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Наши кейс-стади {#our-case-studies}

**Наши корпоративные реализации:**

* [Кейс Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Кейс Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Перенаправление почты выпускников](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Заключение: лучшие практики развертывания продакшена Node.js {#conclusion-nodejs-production-deployment-best-practices}

Наша продакшен-инфраструктура Node.js демонстрирует, что приложения Node.js могут достигать корпоративного уровня надежности благодаря:

* **Проверенным аппаратным решениям** (AMD Ryzen для оптимизации производительности одного ядра на 573%)
* **Отлаженному мониторингу продакшена Node.js** с конкретными порогами и автоматическими реакциями
* **Умной классификации ошибок** для улучшения реагирования на инциденты в продакшен-средах
* **Продвинутой отладке производительности** с помощью v8-profiler-next и cpupro для предотвращения OOM
* **Комплексному усилению безопасности** через автоматизацию Ansible
* **Гибридной архитектуре базы данных**, оптимизированной под нужды приложения
* **Автоматизированному обслуживанию** для предотвращения распространенных проблем продакшена Node.js

**Главный вывод:** изучайте наши реальные файлы реализации и блог-посты, а не следуйте общим рекомендациям. Наш код предоставляет реальные шаблоны для развертывания продакшена Node.js, которые можно адаптировать для любых приложений Node.js — веб-приложений, API, микросервисов или фоновых сервисов.


## Полный список ресурсов для продакшена Node.js {#complete-resource-list-for-nodejs-production}

### Наши основные файлы реализации {#our-core-implementation-files}

* [Основная конфигурация](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Зависимости пакетов](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Мониторинг сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Классификация ошибок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Система логирования](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Проверки здоровья PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Автоматическая очистка](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Наши серверные реализации {#our-server-implementations}

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планировщик Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Автоматизация нашей инфраструктуры {#our-infrastructure-automation}

* [Все наши Ansible playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Усиление безопасности](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Настройка Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Конфигурация базы данных](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Наши технические статьи в блоге {#our-technical-blog-posts}

* [Анализ экосистемы NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Реализация платежной системы](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Техническое руководство по защите электронной почты](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript контактные формы](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Интеграция электронной почты с React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Руководство по самостоятельному размещению решения](https://forwardemail.net/blog/docs/self-hosted-solution)

### Наши корпоративные кейс-стади {#our-enterprise-case-studies}

* [Реализация для Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Кейс Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Соответствие требованиям федерального правительства](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Системы электронной почты для выпускников](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
