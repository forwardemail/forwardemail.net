# Как оптимизировать производственную инфраструктуру Node.js: лучшие практики {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Содержание {#table-of-contents}

* [Предисловие](#foreword)
* [Наша революция в оптимизации производительности одного ядра на 573%](#our-573-single-core-performance-optimization-revolution)
  * [Почему оптимизация производительности одного ядра важна для Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Связанный контент](#related-content)
* [Настройка производственной среды Node.js: наш технологический стек](#nodejs-production-environment-setup-our-technology-stack)
  * [Менеджер пакетов: pnpm для повышения эффективности производства](#package-manager-pnpm-for-production-efficiency)
  * [Веб-фреймворк: Koa для современного производства Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Обработка фоновых заданий: Bree для обеспечения надежности производства](#background-job-processing-bree-for-production-reliability)
  * [Обработка ошибок: @hapi/boom для надежности производства](#error-handling-hapiboom-for-production-reliability)
* [Как контролировать приложения Node.js в производстве](#how-to-monitor-nodejs-applications-in-production)
  * [Мониторинг производства Node.js на системном уровне](#system-level-nodejs-production-monitoring)
  * [Мониторинг на уровне приложений для производства Node.js](#application-level-monitoring-for-nodejs-production)
  * [Мониторинг конкретных приложений](#application-specific-monitoring)
* [Мониторинг производства Node.js с помощью проверок работоспособности PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Наша система проверки состояния PM2](#our-pm2-health-check-system)
  * [Наша производственная конфигурация PM2](#our-pm2-production-configuration)
  * [Автоматизированное развертывание PM2](#automated-pm2-deployment)
* [Система обработки и классификации производственных ошибок](#production-error-handling-and-classification-system)
  * [Наша реализация isCodeBug для производства](#our-iscodebug-implementation-for-production)
  * [Интеграция с нашей системой ведения журнала производства](#integration-with-our-production-logging)
  * [Связанный контент](#related-content-1)
* [Расширенная отладка производительности с помощью v8-profiler-next и cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Наш подход к профилированию для производства Node.js](#our-profiling-approach-for-nodejs-production)
  * [Как мы реализуем анализ моментальных снимков кучи](#how-we-implement-heap-snapshot-analysis)
  * [Рабочий процесс отладки производительности](#performance-debugging-workflow)
  * [Рекомендуемая реализация для вашего приложения Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Интеграция с нашим производственным мониторингом](#integration-with-our-production-monitoring)
* [Безопасность производственной инфраструктуры Node.js](#nodejs-production-infrastructure-security)
  * [Безопасность на системном уровне для производства Node.js](#system-level-security-for-nodejs-production)
  * [Безопасность приложений Node.js](#application-security-for-nodejs-applications)
  * [Автоматизация безопасности инфраструктуры](#infrastructure-security-automation)
  * [Наш контент по безопасности](#our-security-content)
* [Архитектура базы данных для приложений Node.js](#database-architecture-for-nodejs-applications)
  * [Реализация SQLite для производства Node.js](#sqlite-implementation-for-nodejs-production)
  * [Реализация MongoDB для производства Node.js](#mongodb-implementation-for-nodejs-production)
* [Обработка фоновых заданий производства Node.js](#nodejs-production-background-job-processing)
  * [Настройка сервера Bree для производства](#our-bree-server-setup-for-production)
  * [Примеры производственных работ](#production-job-examples)
  * [Наши шаблоны планирования задач для производства Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Автоматизированное обслуживание производственных приложений Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Наша реализация очистки](#our-cleanup-implementation)
  * [Управление дисковым пространством для производства Node.js](#disk-space-management-for-nodejs-production)
  * [Автоматизация обслуживания инфраструктуры](#infrastructure-maintenance-automation)
* [Руководство по внедрению производственного развертывания Node.js](#nodejs-production-deployment-implementation-guide)
  * [Изучите наш реальный код для лучших практик производства](#study-our-actual-code-for-production-best-practices)
  * [Узнайте из наших постов в блоге](#learn-from-our-blog-posts)
  * [Автоматизация инфраструктуры для производства Node.js](#infrastructure-automation-for-nodejs-production)
  * [Наши примеры](#our-case-studies)
* [Заключение: лучшие практики развертывания Node.js в продакшене](#conclusion-nodejs-production-deployment-best-practices)
* [Полный список ресурсов для производства Node.js](#complete-resource-list-for-nodejs-production)
  * [Наши основные файлы реализации](#our-core-implementation-files)
  * [Наши серверные реализации](#our-server-implementations)
  * [Наша автоматизация инфраструктуры](#our-infrastructure-automation)
  * [Наши технические записи в блоге](#our-technical-blog-posts)
  * [Наши корпоративные исследования](#our-enterprise-case-studies)

## Предисловие {#foreword}

В Forward Email мы потратили годы на совершенствование настройки нашей рабочей среды Node.js. В этом подробном руководстве представлены наши проверенные на практике передовые практики развертывания Node.js в рабочей среде, с упором на оптимизацию производительности, мониторинг и опыт, полученный нами при масштабировании приложений Node.js для обработки миллионов ежедневных транзакций.

## Наша революция в оптимизации производительности одного ядра на 573% {#our-573-single-core-performance-optimization-revolution}

При переходе с процессоров Intel на AMD Ryzen мы добились **повышения производительности** наших приложений Node.js на **573%**. Это была не просто незначительная оптимизация — она кардинально изменила работу наших приложений Node.js в рабочей среде и продемонстрировала важность оптимизации производительности отдельных ядер для любого приложения Node.js.

> \[!TIP]
> Для передовых методов развертывания Node.js в рабочей среде выбор оборудования имеет решающее значение. Мы выбрали хостинг DataPacket из-за доступности процессоров AMD Ryzen, поскольку производительность одного ядра критически важна для приложений Node.js, поскольку JavaScript выполняется в одном потоке.

### Почему оптимизация производительности одного ядра важна для Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Результатом нашего перехода с Intel на AMD Ryzen стали:

* **Повышение производительности на 573%** при обработке запросов (документировано в [Проблема GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 на нашей странице статуса
* **Устранены задержки обработки**, что позволило добиться практически мгновенных ответов (упомянутых в [Проблема GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Лучшее соотношение цены и производительности** для производственных сред Node.js
* **Сокращено время отклика** во всех конечных точках наших приложений

Рост производительности оказался настолько значительным, что теперь мы считаем процессоры AMD Ryzen необходимыми для любого серьёзного развертывания Node.js в производственной среде, будь то веб-приложения, API, микросервисы или любые другие рабочие нагрузки Node.js.

### Связанные материалы {#related-content}

Подробнее о наших вариантах инфраструктуры см. здесь:

* [Лучший сервис пересылки электронной почты](https://forwardemail.net/blog/docs/best-email-forwarding-service) — Сравнение производительности
* [Решение с собственным хостингом](https://forwardemail.net/blog/docs/self-hosted-solution) — Рекомендации по оборудованию

## Настройка производственной среды Node.js: наш технологический стек {#nodejs-production-environment-setup-our-technology-stack}

Наши передовые практики развертывания Node.js в производственной среде включают осознанный выбор технологий, основанный на многолетнем опыте. Вот что мы используем и почему этот выбор применим к любому приложению Node.js:

### Менеджер пакетов: pnpm для эффективности производства {#package-manager-pnpm-for-production-efficiency}

**Что мы используем:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (закрепленная версия)

Для настройки нашей производственной среды Node.js мы выбрали pnpm вместо npm и yarn по следующим причинам:

* **Более быстрая установка** в конвейерах CI/CD
* **Эффективное использование дискового пространства** благодаря жёстким ссылкам
* **Строгое разрешение зависимостей**, предотвращающее появление фантомных зависимостей
* **Повышенная производительность** при развертывании в производственной среде

> \[!NOTE]
> В рамках наших рекомендаций по развертыванию Node.js в рабочей среде мы закрепляем точные версии критически важных инструментов, таких как pnpm, чтобы обеспечить единообразное поведение во всех средах и на компьютерах участников команды.

**Подробности реализации:**

* [Наша конфигурация package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Запись в блоге нашей экосистемы NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Веб-фреймворк: Koa для современного производства Node.js {#web-framework-koa-for-modern-nodejs-production}

**Что мы используем:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Мы выбрали Koa вместо Express для нашей производственной инфраструктуры Node.js из-за его современной поддержки async/await и более продуманной структуры промежуточного программного обеспечения. Наш основатель Ник Бо участвовал в разработке как Express, так и Koa, что позволило нам глубоко изучить оба фреймворка для использования в производстве.

Эти шаблоны применимы независимо от того, создаете ли вы REST API, серверы GraphQL, веб-приложения или микросервисы.

**Наши примеры реализации:**

* [Настройка веб-сервера](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Конфигурация API-сервера](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Руководство по внедрению контактных форм](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Обработка фонового задания: Bree для надежности производства {#background-job-processing-bree-for-production-reliability}

**Что мы используем:** Планировщик [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Мы создали и поддерживаем Bree, поскольку существующие планировщики заданий не удовлетворяли нашим потребностям в поддержке рабочих потоков и современных функциях JavaScript в производственных средах Node.js. Это относится к любому приложению Node.js, которому требуется фоновая обработка, запланированные задачи или рабочие потоки.

**Наши примеры реализации:**

* [Настройка сервера Бри](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Все наши определения должностей](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Работа по проверке здоровья PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Реализация задания по очистке](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Обработка ошибок: @hapi/boom для обеспечения надежности производства {#error-handling-hapiboom-for-production-reliability}

**Что мы используем:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Мы используем @hapi/boom для структурированных сообщений об ошибках во всех наших приложениях Node.js. Этот шаблон подходит для любого приложения Node.js, которому требуется согласованная обработка ошибок.

**Наши примеры реализации:**

* [Помощник по классификации ошибок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Реализация логгера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Как отслеживать приложения Node.js в процессе производства {#how-to-monitor-nodejs-applications-in-production}

Наш подход к мониторингу приложений Node.js в рабочей среде развивался на протяжении многих лет эксплуатации масштабных приложений. Мы реализуем многоуровневый мониторинг, чтобы гарантировать надежность и производительность любого типа приложений Node.js.

### Мониторинг производства Node.js на системном уровне {#system-level-nodejs-production-monitoring}

**Наша основная реализация:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Что мы используем:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Наши пороговые значения мониторинга производства (из нашего фактического производственного кода):

* **Ограничение размера кучи 2 ГБ** с автоматическими оповещениями
* Порог предупреждения **Использование памяти 25%**
* Порог предупреждения **Использование ЦП 80%**
* Порог предупреждения **Использование диска 75%**

> \[!WARNING]
> Эти пороговые значения подходят для нашей конкретной конфигурации оборудования. При реализации мониторинга производства Node.js ознакомьтесь с нашей реализацией monitor-server.js, чтобы понять точную логику и адаптировать значения для вашей конфигурации.

### Мониторинг уровня приложения для производства Node.js {#application-level-monitoring-for-nodejs-production}

**Наша классификация ошибок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Этот помощник различает:

* **Реальные ошибки кода**, требующие немедленного внимания
* **Пользовательские ошибки**, которые являются ожидаемым поведением
* **Сбои внешних служб**, которые мы не можем контролировать

Этот шаблон применим к любому приложению Node.js — веб-приложениям, API, микросервисам или фоновым сервисам.

**Наша реализация журналирования:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Мы реализуем комплексное редактирование полей для защиты конфиденциальной информации, сохраняя при этом полезные возможности отладки в нашей производственной среде Node.js.

### Мониторинг конкретного приложения {#application-specific-monitoring}

**Наши серверные реализации:**

* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Мониторинг очереди:** Мы устанавливаем ограничения на размер очереди в 5 ГБ и 180-секундные тайм-ауты для обработки запросов, чтобы предотвратить исчерпание ресурсов. Эти шаблоны применимы к любому приложению Node.js с очередями или фоновой обработкой.

## Мониторинг производства Node.js с проверками работоспособности PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

За годы работы мы усовершенствовали нашу производственную среду Node.js с помощью PM2. Наши проверки работоспособности PM2 необходимы для поддержания надёжности любого приложения Node.js.

### Наша система проверки состояния PM2 {#our-pm2-health-check-system}

**Наша основная реализация:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Наш мониторинг производства Node.js с проверками работоспособности PM2 включает в себя:

* **Запускается каждые 20 минут** с помощью cron-планировщика
* **Требуется минимум 15 минут бесперебойной работы**, прежде чем процесс будет признан работоспособным
* **Проверяет состояние процесса и использование памяти**
* **Автоматически перезапускает сбойные процессы**
* **Предотвращает циклические перезапуски** благодаря интеллектуальной проверке работоспособности

> \[!CAUTION]
> В соответствии с рекомендациями по развертыванию Node.js в рабочей среде, мы требуем более 15 минут бесперебойной работы, прежде чем процесс будет считаться работоспособным, чтобы избежать циклов перезапуска. Это предотвращает каскадные сбои, возникающие при нехватке памяти или других проблемах.

### Наша производственная конфигурация PM2 {#our-pm2-production-configuration}

**Настройка нашей экосистемы:** Изучите файлы запуска нашего сервера для настройки производственной среды Node.js:

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планировщик Бри](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Эти шаблоны применимы независимо от того, используете ли вы приложения Express, серверы Koa, API GraphQL или любые другие приложения Node.js.

### Автоматизированное развертывание PM2 {#automated-pm2-deployment}

**Развертывание PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Мы автоматизируем всю настройку PM2 с помощью Ansible, чтобы гарантировать единообразное развертывание Node.js на всех наших серверах.

## Система обработки и классификации производственных ошибок {#production-error-handling-and-classification-system}

Одной из наших самых ценных рекомендаций по развертыванию Node.js в производственной среде является интеллектуальная классификация ошибок, которая применима к любому приложению Node.js:

### Наша реализация isCodeBug для производства {#our-iscodebug-implementation-for-production}

**Источник:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Этот помощник обеспечивает интеллектуальную классификацию ошибок для приложений Node.js в процессе производства, что позволяет:

* **Отдавайте приоритет реальным ошибкам**, а не ошибкам пользователей
* **Улучшайте реагирование на инциденты**, сосредоточившись на реальных проблемах
* **Снижайте утомляемость от оповещений** об ожидаемых ошибках пользователей
* **Лучше разбирайтесь** в проблемах приложений и проблемах, вызванных пользователями

Этот шаблон работает для любого приложения Node.js — создаете ли вы сайты электронной коммерции, платформы SaaS, API или микросервисы.

### Интеграция с нашим производственным журналом {#integration-with-our-production-logging}

**Наша интеграция с регистратором:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Наш регистратор использует `isCodeBug` для определения уровней оповещений и редактирования полей, гарантируя получение уведомлений о реальных проблемах и отфильтровывая шум в нашей производственной среде Node.js.

### Связанный контент {#related-content-1}

Узнайте больше о наших шаблонах обработки ошибок:

* [Создание надежной платежной системы](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) — Шаблоны обработки ошибок
* [Защита конфиденциальности электронной почты](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) — Обработка ошибок безопасности

## Расширенная отладка производительности с помощью v8-profiler-next и cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Мы используем передовые инструменты профилирования для анализа снимков кучи и отладки проблем с нехваткой памяти (OOM), узких мест производительности и проблем с памятью Node.js в нашей рабочей среде. Эти инструменты незаменимы для любого приложения Node.js, столкнувшегося с утечками памяти или проблемами производительности.

### Наш подход к профилированию для производства Node.js {#our-profiling-approach-for-nodejs-production}

**Инструменты, которые мы рекомендуем:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) — для создания снимков кучи и профилей ЦП
* [`cpupro`](https://github.com/discoveryjs/cpupro) — для анализа профилей ЦП и снимков кучи

> \[!TIP]
> Мы используем v8-profiler-next и cpupro вместе для создания полноценного рабочего процесса отладки производительности наших приложений Node.js. Это сочетание помогает нам выявлять утечки памяти, узкие места производительности и оптимизировать наш рабочий код.

### Как мы реализуем анализ моментальных снимков кучи {#how-we-implement-heap-snapshot-analysis}

**Наша реализация мониторинга:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Наш производственный мониторинг включает автоматическое создание снимков кучи при превышении пороговых значений памяти. Это помогает нам отлаживать проблемы с OOM до того, как они приведут к сбоям приложения.

**Ключевые шаблоны реализации:**

* **Автоматическое создание снимков** при превышении размера кучи порогового значения в 2 ГБ
* **Профилирование на основе сигналов** для анализа по запросу в производственной среде
* **Политики хранения** для управления хранилищем снимков
* **Интеграция с нашими заданиями очистки** для автоматизированного обслуживания

### Рабочий процесс отладки производительности {#performance-debugging-workflow}

**Изучите нашу фактическую реализацию:**

* [Реализация сервера монитора](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) — Мониторинг кучи и создание снимков
* [Работа по уборке](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) — Хранение и очистка снимков
* [Интеграция регистратора](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) — Журналирование производительности

### Рекомендуемая реализация для вашего приложения Node.js {#recommended-implementation-for-your-nodejs-application}

**Для анализа моментального снимка кучи:**

1. **Установите v8-profiler-next** для создания снимков
2. **Используйте cpupro** для анализа созданных снимков
3. **Реализуйте пороговые значения мониторинга**, аналогичные нашему monitor-server.js
4. **Настройте автоматическую очистку** для управления хранилищем снимков
5. **Создайте обработчики сигналов** для профилирования по требованию в рабочей среде

**Для профилирования ЦП:**

1. **Создание профилей ЦП** в периоды высокой нагрузки
2. **Анализ с помощью cpupro** для выявления узких мест
3. **Сосредоточение на горячих путях** и возможностях оптимизации
4. **Отслеживание улучшений производительности до и после**

> \[!WARNING]
> Создание снимков кучи и профилей ЦП может повлиять на производительность. Мы рекомендуем использовать троттлинг и включать профилирование только при исследовании конкретных проблем или во время периодов обслуживания.

### Интеграция с нашим производственным мониторингом {#integration-with-our-production-monitoring}

Наши инструменты профилирования интегрируются с нашей более широкой стратегией мониторинга:

* **Автоматическое срабатывание** на основе пороговых значений памяти/процессора
* **Интеграция оповещений** при обнаружении проблем с производительностью
* **Исторический анализ** для отслеживания тенденций производительности с течением времени
* **Корреляция с метриками приложения** для комплексной отладки

Такой подход помог нам выявить и устранить утечки памяти, оптимизировать горячие пути кода и поддерживать стабильную производительность в нашей производственной среде Node.js.

## Безопасность производственной инфраструктуры Node.js {#nodejs-production-infrastructure-security}

Мы обеспечиваем комплексную безопасность нашей производственной инфраструктуры Node.js с помощью автоматизации Ansible. Эти методы применимы к любому приложению Node.js:

### Безопасность на системном уровне для производства Node.js {#system-level-security-for-nodejs-production}

**Наша реализация Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Наши основные меры безопасности для производственных сред Node.js:

* **Подкачка отключена** для предотвращения записи конфиденциальных данных на диск
* **Дампы ядра отключены** для предотвращения записи дампов памяти, содержащих конфиденциальную информацию
* **USB-накопитель заблокирован** для предотвращения несанкционированного доступа к данным
* **Настройка параметров ядра** для обеспечения безопасности и производительности

> \[!WARNING]
> При реализации рекомендаций по развертыванию Node.js в рабочей среде отключение подкачки может привести к аварийному завершению работы из-за нехватки памяти, если ваше приложение превышает доступный объём оперативной памяти. Мы тщательно отслеживаем использование памяти и подбираем размер наших серверов соответствующим образом.

### Безопасность приложений Node.js {#application-security-for-nodejs-applications}

**Наше редактирование поля журнала:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Мы удаляем конфиденциальные поля из журналов, включая пароли, токены, ключи API и личную информацию. Это защищает конфиденциальность пользователей, сохраняя при этом возможности отладки в любой рабочей среде Node.js.

### Автоматизация безопасности инфраструктуры {#infrastructure-security-automation}

**Наша полная настройка Ansible для производства Node.js:**

* [Руководство по обеспечению безопасности](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Управление ключами SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Управление сертификатами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Настройка DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Наш контент безопасности {#our-security-content}

Узнайте больше о нашем подходе к обеспечению безопасности:

* [Лучшие компании по аудиту безопасности](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Зашифрованная электронная почта Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Почему безопасность электронной почты с открытым исходным кодом](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Архитектура базы данных для приложений Node.js {#database-architecture-for-nodejs-applications}

Мы используем гибридный подход к работе с базами данных, оптимизированный для наших приложений Node.js. Эти шаблоны можно адаптировать для любого приложения Node.js:

### Реализация SQLite для производства Node.js {#sqlite-implementation-for-nodejs-production}

**Что мы используем:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Наша конфигурация:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Мы используем SQLite для пользовательских данных в наших приложениях Node.js, поскольку он обеспечивает:

* **Изоляция данных** для каждого пользователя/клиента
* **Повышенная производительность** для однопользовательских запросов
* **Упрощенное резервное копирование** и миграция
* **Снижение сложности** по сравнению с общими базами данных

Этот шаблон хорошо подходит для SaaS-приложений, многопользовательских систем или любых приложений Node.js, которым требуется изоляция данных.

### Реализация MongoDB для производства Node.js {#mongodb-implementation-for-nodejs-production}

**Что мы используем:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Наша реализация настройки:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Наша конфигурация:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Мы используем MongoDB для данных приложений в нашей производственной среде Node.js, поскольку она обеспечивает:

* **Гибкая схема** для развивающихся структур данных
* **Повышенная производительность** для сложных запросов
* **Возможности горизонтального масштабирования**
* **Развитый язык запросов**

> \[!NOTE]
> Наш гибридный подход оптимизируется для нашего конкретного сценария использования. Изучите реальные модели использования базы данных в кодовой базе, чтобы понять, соответствует ли этот подход потребностям вашего приложения Node.js.

## Обработка фоновых заданий Node.js {#nodejs-production-background-job-processing}

Мы построили архитектуру фоновых заданий на основе Bree для надёжного развертывания Node.js в продакшене. Это применимо к любому приложению Node.js, требующему фоновой обработки:

### Наша настройка сервера Bree для производства {#our-bree-server-setup-for-production}

**Наша основная реализация:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Наше развертывание Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Примеры производственных заданий {#production-job-examples}

**Мониторинг здоровья:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Автоматизация очистки:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Все наши вакансии:** [Просмотрите наш полный каталог вакансий](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Эти шаблоны применимы к любому приложению Node.js, которому требуется:

* Запланированные задачи (обработка данных, создание отчетов, очистка)
* Фоновая обработка (изменение размера изображений, отправка электронной почты, импорт данных)
* Мониторинг и обслуживание работоспособности
* Использование рабочих потоков для задач, интенсивно использующих процессор

### Наши шаблоны планирования заданий для производства Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Изучите наши реальные шаблоны планирования работ в нашем каталоге вакансий, чтобы понять:

* Как мы реализуем cron-подобное планирование в продакшене Node.js
* Наша обработка ошибок и логика повторных попыток
* Как мы используем рабочие потоки для задач, интенсивно использующих процессор

## Автоматизированное обслуживание производственных приложений Node.js {#automated-maintenance-for-production-nodejs-applications}

Мы внедряем проактивное обслуживание для предотвращения распространённых проблем в работе Node.js. Эти шаблоны применимы к любому приложению Node.js:

### Наша реализация очистки {#our-cleanup-implementation}

**Источник:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Наши автоматизированные задачи обслуживания производственных приложений Node.js:

* **Временные файлы** старше 24 часов
* **Файлы журналов**, срок хранения которых истек
* **Файлы кэша** и временные данные
* **Загруженные файлы**, которые больше не нужны
* **Снимки кучи**, полученные при отладке производительности

Эти шаблоны применимы к любому приложению Node.js, которое генерирует временные файлы, журналы или кэшированные данные.

### Управление дисковым пространством для производства Node.js {#disk-space-management-for-nodejs-production}

**Наши пороговые значения мониторинга:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Ограничения очереди** для фоновой обработки
* **Порог предупреждения о **использовании диска 75%**
* **Автоматическая очистка** при превышении пороговых значений

### Автоматизация обслуживания инфраструктуры {#infrastructure-maintenance-automation}

**Наша автоматизация Ansible для производства Node.js:**

* [Развертывание среды](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Управление ключами развертывания](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Руководство по внедрению производственного развертывания Node.js {#nodejs-production-deployment-implementation-guide}

### Изучите наш реальный код для лучших практик производства {#study-our-actual-code-for-production-best-practices}

**Начните с этих ключевых файлов для настройки производственной среды Node.js:**

1. **Конфигурация:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Мониторинг:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Обработка ошибок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Ведение журнала:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Состояние процесса:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Узнайте из наших постов в блоге {#learn-from-our-blog-posts}

**Наши технические руководства по внедрению для производства Node.js:**

* [Экосистема пакетов NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Создание платежных систем](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Реализация конфиденциальности электронной почты](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Контактные формы JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Интеграция электронной почты React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Автоматизация инфраструктуры для производства Node.js {#infrastructure-automation-for-nodejs-production}

**Наши руководства по Ansible для изучения при развертывании Node.js в продакшене:**

* [Полный каталог пьес](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Укрепление безопасности](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Настройка Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Наши примеры {#our-case-studies}

**Наши корпоративные внедрения:**

* [Пример использования Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Пример использования Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Пересылка писем выпускникам](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Заключение: лучшие практики развертывания Node.js в продакшене {#conclusion-nodejs-production-deployment-best-practices}

Наша производственная инфраструктура Node.js демонстрирует, что приложения Node.js могут достичь надежности корпоративного уровня благодаря:

* **Проверенный выбор оборудования** (AMD Ryzen для оптимизации производительности одного ядра на 573%)
* **Проверенный в реальных условиях мониторинг производительности Node.js** с заданными пороговыми значениями и автоматизированными ответами
* **Интеллектуальная классификация ошибок** для улучшения реагирования на инциденты в производственной среде
* **Расширенная отладка производительности** с v8-profiler-next и cpupro для предотвращения OOM
* **Комплексное усиление безопасности** благодаря автоматизации Ansible
* **Гибридная архитектура базы данных**, оптимизированная для потребностей приложений
* **Автоматизированное обслуживание** для предотвращения распространенных проблем в производственной среде Node.js

**Ключевой вывод:** Изучайте наши файлы реализации и записи в блоге, а не следуйте общим рекомендациям. Наша кодовая база предоставляет реальные шаблоны для развертывания Node.js в рабочей среде, которые можно адаптировать для любого приложения Node.js — веб-приложений, API, микросервисов или фоновых служб.

## Полный список ресурсов для производства Node.js {#complete-resource-list-for-nodejs-production}

### Наши основные файлы реализации {#our-core-implementation-files}

* [Основная конфигурация](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Зависимости пакетов](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Мониторинг сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Классификация ошибок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Система регистрации](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Проверка состояния PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Автоматизированная очистка](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Наши серверные реализации {#our-server-implementations}

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планировщик Бри](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Наша автоматизация инфраструктуры {#our-infrastructure-automation}

* [Все наши руководства по Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Укрепление безопасности](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Настройка Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Конфигурация базы данных](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Наши технические записи в блоге {#our-technical-blog-posts}

* [Анализ экосистемы NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Реализация платежной системы](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Техническое руководство по конфиденциальности электронной почты](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Контактные формы JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Интеграция электронной почты React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Руководство по самостоятельному размещению решений](https://forwardemail.net/blog/docs/self-hosted-solution)

### Наши примеры использования на предприятии {#our-enterprise-case-studies}

* [Реализация Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Пример использования Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Соблюдение федерального правительства](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Системы электронной почты выпускников](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)