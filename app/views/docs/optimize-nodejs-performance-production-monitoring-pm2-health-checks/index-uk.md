# Як оптимізувати виробничу інфраструктуру Node.js: найкращі практики {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Зміст {#table-of-contents}

* [Передмова](#foreword)
* [Наша революція в оптимізації продуктивності одного ядра на 573%](#our-573-single-core-performance-optimization-revolution)
  * [Чому оптимізація продуктивності одного ядра важлива для Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Пов'язаний контент](#related-content)
* [Налаштування робочого середовища Node.js: наш технологічний стек](#nodejs-production-environment-setup-our-technology-stack)
  * [Менеджер пакетів: pnpm для підвищення ефективності виробництва](#package-manager-pnpm-for-production-efficiency)
  * [Веб-фреймворк: Koa для сучасного Node.js-продукції](#web-framework-koa-for-modern-nodejs-production)
  * [Обробка фонових завдань: Брі для надійності виробництва](#background-job-processing-bree-for-production-reliability)
  * [Обробка помилок: @hapi/boom для надійності виробництва](#error-handling-hapiboom-for-production-reliability)
* [Як моніторити Node.js-застосунки у продакшені](#how-to-monitor-nodejs-applications-in-production)
  * [Моніторинг продакшену Node.js на системному рівні](#system-level-nodejs-production-monitoring)
  * [Моніторинг на рівні застосунків для Node.js Production](#application-level-monitoring-for-nodejs-production)
  * [Моніторинг, специфічний для програми](#application-specific-monitoring)
* [Моніторинг продуктивності Node.js за допомогою перевірок справності PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Наша система перевірки стану PM2](#our-pm2-health-check-system)
  * [Наша виробнича конфігурація PM2](#our-pm2-production-configuration)
  * [Автоматизоване розгортання PM2](#automated-pm2-deployment)
* [Система обробки та класифікації виробничих помилок](#production-error-handling-and-classification-system)
  * [Наша реалізація isCodeBug для продакшену](#our-iscodebug-implementation-for-production)
  * [Інтеграція з нашим виробничим журналюванням](#integration-with-our-production-logging)
  * [Пов'язаний контент](#related-content-1)
* [Розширене налагодження продуктивності за допомогою v8-profiler-next та cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Наш підхід до профілювання для Node.js Production](#our-profiling-approach-for-nodejs-production)
  * [Як ми реалізуємо аналіз знімків купи](#how-we-implement-heap-snapshot-analysis)
  * [Робочий процес налагодження продуктивності](#performance-debugging-workflow)
  * [Рекомендована реалізація для вашої програми Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Інтеграція з нашим моніторингом виробництва](#integration-with-our-production-monitoring)
* [Безпека виробничої інфраструктури Node.js](#nodejs-production-infrastructure-security)
  * [Безпека на системному рівні для Node.js Production](#system-level-security-for-nodejs-production)
  * [Безпека застосунків для Node.js](#application-security-for-nodejs-applications)
  * [Автоматизація безпеки інфраструктури](#infrastructure-security-automation)
  * [Наш контент щодо безпеки](#our-security-content)
* [Архітектура бази даних для Node.js-застосунків](#database-architecture-for-nodejs-applications)
  * [Реалізація SQLite для Node.js Production](#sqlite-implementation-for-nodejs-production)
  * [Реалізація MongoDB для Node.js Production](#mongodb-implementation-for-nodejs-production)
* [Обробка фонових завдань у Node.js Production](#nodejs-production-background-job-processing)
  * [Наша конфігурація сервера Bree для виробництва](#our-bree-server-setup-for-production)
  * [Приклади виробничих вакансій](#production-job-examples)
  * [Наші шаблони планування завдань для Node.js Production](#our-job-scheduling-patterns-for-nodejs-production)
* [Автоматизоване обслуговування для продакшн-застосунків Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Наше впровадження очищення](#our-cleanup-implementation)
  * [Керування дисковим простором для Node.js Production](#disk-space-management-for-nodejs-production)
  * [Автоматизація обслуговування інфраструктури](#infrastructure-maintenance-automation)
* [Посібник з впровадження розгортання Node.js у продакшені](#nodejs-production-deployment-implementation-guide)
  * [Вивчіть наш фактичний код для найкращих практик виробництва](#study-our-actual-code-for-production-best-practices)
  * [Дізнайтеся з наших публікацій у блозі](#learn-from-our-blog-posts)
  * [Автоматизація інфраструктури для Node.js Production](#infrastructure-automation-for-nodejs-production)
  * [Наші тематичні дослідження](#our-case-studies)
* [Висновок: Найкращі практики розгортання Node.js у продакшені](#conclusion-nodejs-production-deployment-best-practices)
* [Повний список ресурсів для Node.js Production](#complete-resource-list-for-nodejs-production)
  * [Наші основні файли впровадження](#our-core-implementation-files)
  * [Наші серверні реалізації](#our-server-implementations)
  * [Автоматизація нашої інфраструктури](#our-infrastructure-automation)
  * [Наші технічні дописи в блозі](#our-technical-blog-posts)
  * [Наші приклади діяльності з підприємств](#our-enterprise-case-studies)

## Передмова {#foreword}

У Forward Email ми роками вдосконалювали наше робоче середовище Node.js. Цей вичерпний посібник розповідає про наші перевірені часом найкращі практики розгортання Node.js у робочому середовищі, зосереджуючись на оптимізації продуктивності, моніторингу та уроках, які ми отримали, масштабуючи Node.js-застосунки для обробки мільйонів щоденних транзакцій.

## Наша революція оптимізації продуктивності одного ядра на 573% {#our-573-single-core-performance-optimization-revolution}

Коли ми перейшли з процесорів Intel на AMD Ryzen, ми досягли **покращення продуктивності на 573%** у наших Node.js-додатках. Це була не просто незначна оптимізація — вона фундаментально змінила роботу наших Node.js-додатків у продакшені та демонструє важливість оптимізації продуктивності одного ядра для будь-якого Node.js-додатку.

> \[!TIP]
> Для найкращих практик розгортання Node.js у продакшені вибір обладнання є критично важливим. Ми спеціально обрали хостинг DataPacket через їхню доступність AMD Ryzen, оскільки одноядерна продуктивність є критично важливою для Node.js-застосунків, оскільки виконання JavaScript є однопотоковим.

### Чому оптимізація продуктивності одного ядра важлива для Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Результат нашої міграції з Intel на AMD Ryzen:

* **Покращення продуктивності на 573%** під час обробки запитів (задокументовано в [Проблема GitHub на нашій сторінці стану #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Усунуто затримки обробки** до майже миттєвих відповідей (згадано в [проблемі GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Краще співвідношення ціни та продуктивності** для виробничих середовищ Node.js
* **Покращений час відгуку** на всіх кінцевих точках наших додатків

Підвищення продуктивності було настільки значним, що тепер ми вважаємо процесори AMD Ryzen необхідними для будь-якого серйозного розгортання Node.js у виробничому середовищі, незалежно від того, чи запускаєте ви веб-додатки, API, мікросервіси чи будь-яке інше робоче навантаження Node.js.

### Пов’язаний контент {#related-content}

Щоб отримати докладнішу інформацію про наш вибір інфраструктури, перегляньте:

* [Найкращий сервіс пересилання електронної пошти](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Порівняння продуктивності
* [Власне розміщене рішення](https://forwardemail.net/blog/docs/self-hosted-solution) - Рекомендації щодо обладнання

## Налаштування робочого середовища Node.js: Наш технологічний стек {#nodejs-production-environment-setup-our-technology-stack}

Наші найкращі практики розгортання Node.js у продакшені включають обдуманий вибір технологій, заснований на багаторічному досвіді роботи. Ось що ми використовуємо та чому цей вибір застосовується до будь-якої програми Node.js:

### Менеджер пакетів: pnpm для підвищення ефективності виробництва {#package-manager-pnpm-for-production-efficiency}

**Що ми використовуємо:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (закріплена версія)

Ми обрали pnpm замість npm та yarn для нашого середовища Node.js, тому що:

* **Швидше встановлення** в конвеєрах CI/CD
* **Ефективність використання дискового простору** завдяки жорсткому зв'язуванню
* **Суворе вирішення залежностей**, що запобігає фантомним залежностям
* **Краща продуктивність** у виробничих розгортаннях

> \[!NOTE]
> Як частина наших найкращих практик розгортання Node.js у продакшені, ми закріплюємо точні версії критично важливих інструментів, таких як pnpm, щоб забезпечити узгоджену роботу в усіх середовищах та на всіх машинах членів команди.

**Деталі впровадження:**

* [Наша конфігурація package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Наша публікація в блозі про екосистему NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Веб-фреймворк: Koa для сучасного Node.js Production {#web-framework-koa-for-modern-nodejs-production}

**Що ми використовуємо:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ми обрали Koa замість Express для нашої виробничої інфраструктури Node.js через його сучасну підтримку async/await та чистішу структуру проміжного програмного забезпечення. Наш засновник Нік Бо зробив свій внесок як у Express, так і в Koa, надавши нам глибоке розуміння обох фреймворків для використання в виробничому середовищі.

Ці шаблони застосовуються незалежно від того, чи створюєте ви REST API, сервери GraphQL, веб-застосунки чи мікросервіси.

**Наші приклади впровадження:**

* [Налаштування веб-сервера](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Конфігурація API-сервера](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Посібник із впровадження контактних форм](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Обробка фонового завдання: Bree для надійності виробництва {#background-job-processing-bree-for-production-reliability}

**Що ми використовуємо:** планувальник [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ми створили та підтримуємо Bree, оскільки існуючі планувальники завдань не задовольняли наші потреби в підтримці робочих потоків та сучасних функціях JavaScript у виробничих середовищах Node.js. Це стосується будь-якої програми Node.js, яка потребує фонової обробки, запланованих завдань або робочих потоків.

**Наші приклади впровадження:**

* [Налаштування сервера Брі](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Усі наші визначення вакансій](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Робота з перевірки стану PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Впровадження завдання з очищення](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Обробка помилок: @hapi/boom для надійності виробництва {#error-handling-hapiboom-for-production-reliability}

**Що ми використовуємо:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ми використовуємо @hapi/boom для структурованих відповідей на помилки в наших Node.js-програмних продуктах. Цей шаблон працює для будь-якої Node.js-програми, яка потребує послідовної обробки помилок.

**Наші приклади впровадження:**

* [Помічник класифікації помилок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Реалізація логера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Як моніторити Node.js-застосунки у продакшені {#how-to-monitor-nodejs-applications-in-production}

Наш підхід до моніторингу Node.js-застосунків у продакшені розвивався протягом років роботи над ними у великих масштабах. Ми впроваджуємо моніторинг на кількох рівнях, щоб забезпечити надійність та продуктивність будь-якого типу Node.js-застосунку.

### Моніторинг продакшену Node.js на системному рівні {#system-level-nodejs-production-monitoring}

**Наша основна реалізація:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Що ми використовуємо:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Наші порогові значення моніторингу виробництва (з нашого фактичного коду виробництва):

* **Обмеження розміру купи 2 ГБ** з автоматичними сповіщеннями
* Поріг попередження **Використання пам'яті 25%**
* Поріг попередження **Використання процесора 80%**
* Поріг попередження **Використання диска 75%**

> \[!WARNING]
> Ці порогові значення працюють для нашої конкретної конфігурації обладнання. Під час впровадження моніторингу продакшену Node.js перегляньте нашу реалізацію monitor-server.js, щоб зрозуміти точну логіку та адаптувати значення для вашої конфігурації.

### Моніторинг на рівні застосунку для Node.js Production {#application-level-monitoring-for-nodejs-production}

**Наша класифікація помилок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Цей помічник розрізняє:

* **Фактичні помилки коду**, які потребують негайної уваги
* **Помилки користувачів**, які є очікуваною поведінкою
* **Збої зовнішніх служб**, які ми не можемо контролювати

Цей шаблон застосовується до будь-якої програми Node.js – веб-програм, API, мікросервісів або фонових служб.

**Наша реалізація логування:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Ми впроваджуємо комплексне редагування полів для захисту конфіденційної інформації, зберігаючи при цьому корисні можливості налагодження в нашому робочому середовищі Node.js.

### Моніторинг, специфічний для програми {#application-specific-monitoring}

**Наші серверні реалізації:**

* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Моніторинг черги:** Ми впроваджуємо обмеження черги 5 ГБ та 180-секундні тайм-аути для обробки запитів, щоб запобігти вичерпанню ресурсів. Ці шаблони застосовуються до будь-якої програми Node.js з чергами або фоновою обробкою.

## Моніторинг продакшену Node.js за допомогою перевірок справності PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Протягом багатьох років досвіду роботи ми вдосконалили налаштування нашого робочого середовища Node.js за допомогою PM2. Наші перевірки справності PM2 є важливими для підтримки надійності будь-якої програми Node.js.

### Наша система перевірки справності PM2 {#our-pm2-health-check-system}

**Наша основна реалізація:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Наш моніторинг продакшену Node.js з перевірками справності PM2 включає:

* **Запускається кожні 20 хвилин** за допомогою планування cron
* **Потрібно щонайменше 15 хвилин безперебійної роботи**, перш ніж процес вважається справним
* **Перевіряє стан процесу та використання пам'яті**
* **Автоматично перезапускає процеси, що завершилися невдачею**
* **Запобігає циклам перезапуску** завдяки інтелектуальній перевірці справності

> \[!CAUTION]
> Згідно з найкращими практиками розгортання Node.js у продакшені, ми вимагаємо понад 15 хвилин безвідмовної роботи, перш ніж процес вважається справним, щоб уникнути циклів перезапуску. Це запобігає каскадним збоям, коли процеси мають проблеми з пам'яттю або інші проблеми.

### Наша конфігурація виробництва PM2 {#our-pm2-production-configuration}

**Налаштування нашої екосистеми:** Вивчіть файли запуску нашого сервера для налаштування виробничого середовища Node.js:

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планувальник Брі](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Ці шаблони застосовуються незалежно від того, чи використовуєте ви Express-додатки, сервери Koa, GraphQL API чи будь-який інший Node.js-додаток.

### Автоматизоване розгортання PM2 {#automated-pm2-deployment}

**Розгортання PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Ми автоматизуємо всю нашу налаштування PM2 за допомогою Ansible, щоб забезпечити узгоджене розгортання Node.js на всіх наших серверах.

## Система обробки та класифікації помилок виробництва {#production-error-handling-and-classification-system}

Одним з наших найцінніших найкращих практик розгортання Node.js у продакшені є інтелектуальна класифікація помилок, яка застосовується до будь-якої програми Node.js:

### Наша реалізація isCodeBug для продакшену {#our-iscodebug-implementation-for-production}

**Джерело:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Цей помічник забезпечує інтелектуальну класифікацію помилок для Node.js-застосунків у продакшені для:

* **Надавати пріоритет фактичним помилкам** над помилками користувачів
* **Покращувати наше реагування на інциденти**, зосереджуючись на реальних проблемах
* **Зменшувати втому від сповіщень** про очікувані помилки користувачів
* **Краще розуміти** проблеми додатків у порівнянні з проблемами, створеними користувачами

Цей шаблон працює для будь-якої програми Node.js — незалежно від того, чи створюєте ви сайти електронної комерції, SaaS-платформи, API чи мікросервіси.

### Інтеграція з нашим виробничим журналом {#integration-with-our-production-logging}

**Інтеграція нашого логера:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Наш логер використовує `isCodeBug` для визначення рівнів сповіщень та редагування полів, що гарантує отримання сповіщень про реальні проблеми та фільтрацію шуму в нашому робочому середовищі Node.js.

### Пов’язаний вміст {#related-content-1}

Дізнайтеся більше про наші шаблони обробки помилок:

* [Створення надійної платіжної системи](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) – Шаблони обробки помилок
* [Захист конфіденційності електронної пошти](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) – Обробка помилок безпеки

## Розширене налагодження продуктивності за допомогою v8-profiler-next та cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Ми використовуємо розширені інструменти профілювання для аналізу знімків купи даних та налагодження проблем OOM (недостатньо пам'яті), вузьких місць у продуктивності та проблем із пам'яттю Node.js у нашому робочому середовищі. Ці інструменти є важливими для будь-якої програми Node.js, яка має витоки пам'яті або проблеми з продуктивністю.

### Наш підхід до профілювання для Node.js Production {#our-profiling-approach-for-nodejs-production}

**Інструменти, які ми рекомендуємо:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) – Для створення знімків купи та профілів процесора
* [`cpupro`](https://github.com/discoveryjs/cpupro) – Для аналізу профілів процесора та знімків купи

> \[!TIP]
> Ми використовуємо v8-profiler-next та cpupro разом для створення повного робочого процесу налагодження продуктивності для наших Node.js-застосунків. Це поєднання допомагає нам виявляти витоки пам'яті, вузькі місця в продуктивності та оптимізувати наш продакшн-код.

### Як ми реалізуємо аналіз знімків купи {#how-we-implement-heap-snapshot-analysis}

**Наша реалізація моніторингу:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Наш моніторинг виробництва включає автоматичне створення знімків купи пам'яті (snapshot) у разі перевищення порогових значень пам'яті. Це допомагає нам налагоджувати проблеми OOM, перш ніж вони спричинять збої програми.

**Ключові моделі впровадження:**

* **Автоматичні знімки**, коли розмір купи перевищує поріг 2 ГБ
* **Профілювання на основі сигналів** для аналізу на вимогу у виробництві
* **Політики зберігання** для керування сховищем знімків
* **Інтеграція з нашими завданнями очищення** для автоматизованого обслуговування

### Робочий процес налагодження продуктивності {#performance-debugging-workflow}

**Вивчіть нашу фактичну реалізацію:**

* [Реалізація моніторингу сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) – Моніторинг купи та створення знімків
* [Робота з прибирання](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) – Збереження та очищення знімків
* [Інтеграція логгера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) – Журнал продуктивності

### Рекомендована реалізація для вашої програми Node.js {#recommended-implementation-for-your-nodejs-application}

**Для аналізу знімків купи даних:**

1. **Встановіть v8-profiler-next** для створення знімків
2. **Використайте cpupro** для аналізу згенерованих знімків
3. **Реалізуйте пороги моніторингу** аналогічно до нашого monitor-server.js
4. **Налаштуйте автоматичне очищення** для керування сховищем знімків
5. **Створіть обробники сигналів** для профілювання на вимогу у продакшені

**Для профілювання процесора:**

1. **Створення профілів процесора** під час періодів високого навантаження
2. **Аналіз за допомогою cpupro** для виявлення вузьких місць
3. **Зосередження на гарячих шляхах** та можливостях оптимізації
4. **Моніторинг покращень продуктивності до/після**

> \[!WARNING]
> Створення знімків купи та профілів процесора може вплинути на продуктивність. Ми рекомендуємо впроваджувати регулювання та вмикати профілювання лише під час дослідження певних проблем або під час періодів обслуговування.

### Інтеграція з нашим моніторингом виробництва {#integration-with-our-production-monitoring}

Наші інструменти профілювання інтегруються з нашою ширшою стратегією моніторингу:

* **Автоматичне запуск** на основі порогових значень пам'яті/процесора
* **Інтеграція сповіщень** при виявленні проблем із продуктивністю
* **Історичний аналіз** для відстеження тенденцій продуктивності з часом
* **Кореляція з показниками програми** для комплексного налагодження

Такий підхід допоміг нам виявити та виправити витоки пам'яті, оптимізувати шляхи гарячого коду та підтримувати стабільну продуктивність у нашому робочому середовищі Node.js.

## Безпека виробничої інфраструктури Node.js {#nodejs-production-infrastructure-security}

Ми впроваджуємо комплексну безпеку для нашої виробничої інфраструктури Node.js за допомогою автоматизації Ansible. Ці методи застосовуються до будь-якої програми Node.js:

### Безпека на системному рівні для Node.js Production {#system-level-security-for-nodejs-production}

**Наша реалізація Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Наші ключові заходи безпеки для виробничих середовищ Node.js:

* **Підбірку вимкнено**, щоб запобігти запису конфіденційних даних на диск
* **Дампи ядра вимкнено**, щоб запобігти створенню дампів пам'яті, що містять конфіденційну інформацію
* **USB-накопичувач заблоковано**, щоб запобігти несанкціонованому доступу до даних
* **Налаштування параметрів ядра** для безпеки та продуктивності

> \[!WARNING]
> Під час впровадження найкращих практик розгортання Node.js у продакшені, вимкнення swap може призвести до завершення роботи через нестачу пам'яті, якщо ваш застосунок перевищує обсяг доступної оперативної пам'яті. Ми ретельно контролюємо використання пам'яті та відповідно підбираємо розмір наших серверів.

### Безпека застосунків для Node.js {#application-security-for-nodejs-applications}

**Редагування поля нашого журналу:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Ми видаляємо конфіденційні поля з журналів, включаючи паролі, токени, ключі API та особисту інформацію. Це захищає конфіденційність користувачів, зберігаючи при цьому можливості налагодження в будь-якому робочому середовищі Node.js.

### Автоматизація безпеки інфраструктури {#infrastructure-security-automation}

**Наша повна конфігурація Ansible для Node.js production:**

* [Посібник з безпеки](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Керування SSH-ключами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Управління сертифікатами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Налаштування DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Наш контент щодо безпеки {#our-security-content}

Дізнайтеся більше про наш підхід до безпеки:

* [Найкращі компанії з аудиту безпеки](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Квантова безпечна зашифрована електронна пошта](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Чому безпека електронної пошти з відкритим кодом?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Архітектура бази даних для застосунків Node.js {#database-architecture-for-nodejs-applications}

Ми використовуємо гібридний підхід до баз даних, оптимізований для наших Node.js-додатків. Ці шаблони можна адаптувати для будь-якого Node.js-додатку:

### Реалізація SQLite для Node.js Production {#sqlite-implementation-for-nodejs-production}

**Що ми використовуємо:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Наша конфігурація:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Ми використовуємо SQLite для даних, специфічних для користувача, у наших Node.js-додатках, оскільки він надає:

* **Ізоляція даних** для кожного користувача/орендаря
* **Краща продуктивність** для запитів одного користувача
* **Спрощене резервне копіювання** та міграція
* **Зменшення складності** порівняно зі спільними базами даних

Цей шаблон добре працює для SaaS-застосунків, багатокористувацьких систем або будь-якого Node.js-застосунку, який потребує ізоляції даних.

### Реалізація MongoDB для Node.js Production {#mongodb-implementation-for-nodejs-production}

**Що ми використовуємо:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Наша реалізація налаштувань:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Наша конфігурація:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Ми використовуємо MongoDB для даних додатків у нашому робочому середовищі Node.js, оскільки вона забезпечує:

* **Гнучка схема** для структур даних, що розвиваються
* **Краща продуктивність** для складних запитів
* **Можливості горизонтального масштабування**
* **Багата мова запитів**

> \[!NOTE]
> Наш гібридний підхід оптимізовано для нашого конкретного випадку використання. Вивчіть наші фактичні моделі використання бази даних у кодовій базі, щоб зрозуміти, чи відповідає цей підхід потребам вашої програми Node.js.

## Обробка фонового завдання Node.js Production {#nodejs-production-background-job-processing}

Ми побудували нашу архітектуру фонових завдань навколо Bree для надійного розгортання Node.js у продакшені. Це стосується будь-якої програми Node.js, яка потребує фонової обробки:

### Налаштування нашого сервера Bree для виробництва {#our-bree-server-setup-for-production}

**Наша основна реалізація:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Наше розгортання Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Приклади виробничих вакансій {#production-job-examples}

**Моніторинг стану:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Автоматизація очищення:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Усі наші вакансії:** [Перегляньте наш повний каталог вакансій](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Ці шаблони застосовуються до будь-якої програми Node.js, якій потрібно:

* Заплановані завдання (обробка даних, звіти, очищення)
* Фонова обробка (зміна розміру зображень, надсилання електронної пошти, імпорт даних)
* Моніторинг та обслуговування справності
* Використання робочих потоків для завдань, що ресурсомісткі для процесора

### Наші шаблони планування завдань для Node.js Production {#our-job-scheduling-patterns-for-nodejs-production}

Вивчіть наші фактичні схеми планування робіт у нашому каталозі вакансій, щоб зрозуміти:

* Як ми реалізуємо планування, подібне до cron, у продакшені Node.js
* Наша логіка обробки помилок та повторних спроб
* Як ми використовуємо робочі потоки для завдань, що ресурсомісткі для процесора

## Автоматизоване обслуговування для виробничих застосунків Node.js {#automated-maintenance-for-production-nodejs-applications}

Ми впроваджуємо проактивне обслуговування, щоб запобігти поширеним проблемам у продакшені Node.js. Ці шаблони застосовуються до будь-якої програми Node.js:

### Наше впровадження очищення {#our-cleanup-implementation}

**Джерело:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Наша автоматизована підтримка для продакшн-застосунків Node.js спрямована на:

* **Тимчасові файли** старші за 24 години
* **Файли журналів**, що перевищують ліміти зберігання
* **Файли кешу** та тимчасові дані
* **Завантажені файли**, які більше не потрібні
* **Знімки купи даних** з налагодження продуктивності

Ці шаблони застосовуються до будь-якої програми Node.js, яка генерує тимчасові файли, журнали або кешовані дані.

### Керування дисковим простором для Node.js Production {#disk-space-management-for-nodejs-production}

**Наші пороги моніторингу:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Обмеження черги** для фонової обробки
* Поріг попередження **75% використання диска**
* **Автоматичне очищення** при перевищенні порогових значень

### Автоматизація обслуговування інфраструктури {#infrastructure-maintenance-automation}

**Наша автоматизація Ansible для Node.js production:**

* [Розгортання середовища](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Керування ключами розгортання](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Посібник з впровадження розгортання Node.js у виробничій середовищі {#nodejs-production-deployment-implementation-guide}

### Вивчіть наш фактичний код для найкращих практик у сфері виробництва {#study-our-actual-code-for-production-best-practices}

**Почніть з цих ключових файлів для налаштування робочого середовища Node.js:**

1. **Конфігурація:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Моніторинг:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Обробка помилок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Ведення журналу:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Справність процесу:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Дізнайтеся більше з наших публікацій у блозі {#learn-from-our-blog-posts}

**Наші посібники з технічного впровадження для Node.js production:**

* [Екосистема пакетів NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Побудова платіжних систем](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Впровадження конфіденційності електронної пошти](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Контактні форми JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Інтеграція електронної пошти React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Автоматизація інфраструктури для Node.js Production {#infrastructure-automation-for-nodejs-production}

**Наші посібники з Ansible для вивчення під час розгортання Node.js у продакшені:**

* [Повний каталог ігрових книг](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Посилення безпеки](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Налаштування Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Наші тематичні дослідження {#our-case-studies}

**Наші впровадження на підприємствах:**

* [Тематичне дослідження фундаменту Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Канонічний приклад Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Пересилання електронної пошти випускників](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Висновок: Найкращі практики розгортання Node.js у продакшені {#conclusion-nodejs-production-deployment-best-practices}

Наша виробнича інфраструктура Node.js демонструє, що Node.js-додатки можуть досягти надійності корпоративного рівня завдяки:

* **Перевірений вибір обладнання** (AMD Ryzen для оптимізації продуктивності одного ядра на 573%)
* **Перевірений у бойових умовах моніторинг продуктивності Node.js** з певними порогами та автоматизованими реакціями
* **Розумна класифікація помилок** для покращення реагування на інциденти у виробничих середовищах
* **Розширене налагодження продуктивності** з v8-profiler-next та cpupro для запобігання OOM
* **Комплексне посилення безпеки** завдяки автоматизації Ansible
* **Гібридна архітектура бази даних** оптимізована для потреб застосунків
* **Автоматизоване обслуговування** для запобігання поширеним проблемам продуктивності Node.js

**Ключовий висновок:** Вивчайте наші файли фактичної реалізації та дописи в блозі, а не дотримуйтесь загальних рекомендацій. Наша кодова база містить реальні шаблони для розгортання Node.js у продакшені, які можна адаптувати для будь-якої програми Node.js – веб-програм, API, мікросервісів або фонових служб.

## Повний список ресурсів для Node.js Production {#complete-resource-list-for-nodejs-production}

### Наші основні файли реалізації {#our-core-implementation-files}

* [Основна конфігурація](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Залежності пакетів](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Моніторинг сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Класифікація помилок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Система реєстрації](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Перевірки стану PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Автоматизоване очищення](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Реалізації нашого сервера {#our-server-implementations}

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планувальник Брі](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Автоматизація нашої інфраструктури {#our-infrastructure-automation}

* [Усі наші посібники з Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Посилення безпеки](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Налаштування Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Конфігурація бази даних](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Наші технічні дописи в блозі {#our-technical-blog-posts}

* [Аналіз екосистеми NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Впровадження платіжної системи](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Технічний посібник із конфіденційності електронної пошти](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Контактні форми JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Інтеграція електронної пошти React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Посібник із самостійно розміщених рішень](https://forwardemail.net/blog/docs/self-hosted-solution)

### Наші приклади корпоративного розвитку {#our-enterprise-case-studies}

* [Впровадження Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Канонічний приклад Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Відповідність федеральному уряду](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Системи електронної пошти випускників](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)