# Як оптимізувати продакшн-інфраструктуру Node.js: найкращі практики {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />


## Зміст {#table-of-contents}

* [Передмова](#foreword)
* [Наша революція оптимізації продуктивності на одному ядрі на 573%](#our-573-single-core-performance-optimization-revolution)
  * [Чому оптимізація продуктивності на одному ядрі важлива для Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Пов’язаний контент](#related-content)
* [Налаштування продакшн-середовища Node.js: наш технологічний стек](#nodejs-production-environment-setup-our-technology-stack)
  * [Менеджер пакетів: pnpm для ефективності в продакшні](#package-manager-pnpm-for-production-efficiency)
  * [Веб-фреймворк: Koa для сучасного продакшну Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Обробка фонових завдань: Bree для надійності в продакшні](#background-job-processing-bree-for-production-reliability)
  * [Обробка помилок: @hapi/boom для надійності в продакшні](#error-handling-hapiboom-for-production-reliability)
* [Як моніторити Node.js-додатки в продакшні](#how-to-monitor-nodejs-applications-in-production)
  * [Моніторинг продакшну Node.js на рівні системи](#system-level-nodejs-production-monitoring)
  * [Моніторинг на рівні додатка для продакшну Node.js](#application-level-monitoring-for-nodejs-production)
  * [Специфічний моніторинг додатків](#application-specific-monitoring)
* [Моніторинг продакшну Node.js за допомогою PM2 Health Checks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Наша система перевірки стану PM2](#our-pm2-health-check-system)
  * [Наша продакшн-конфігурація PM2](#our-pm2-production-configuration)
  * [Автоматизоване розгортання PM2](#automated-pm2-deployment)
* [Система обробки та класифікації помилок у продакшні](#production-error-handling-and-classification-system)
  * [Наша реалізація isCodeBug для продакшну](#our-iscodebug-implementation-for-production)
  * [Інтеграція з нашим продакшн-логуванням](#integration-with-our-production-logging)
  * [Пов’язаний контент](#related-content-1)
* [Розширене налагодження продуктивності з v8-profiler-next та cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Наш підхід до профілювання для продакшну Node.js](#our-profiling-approach-for-nodejs-production)
  * [Як ми реалізуємо аналіз heap snapshot](#how-we-implement-heap-snapshot-analysis)
  * [Робочий процес налагодження продуктивності](#performance-debugging-workflow)
  * [Рекомендована реалізація для вашого Node.js-додатка](#recommended-implementation-for-your-nodejs-application)
  * [Інтеграція з нашим продакшн-моніторингом](#integration-with-our-production-monitoring)
* [Безпека продакшн-інфраструктури Node.js](#nodejs-production-infrastructure-security)
  * [Безпека на рівні системи для продакшну Node.js](#system-level-security-for-nodejs-production)
  * [Безпека додатків Node.js](#application-security-for-nodejs-applications)
  * [Автоматизація безпеки інфраструктури](#infrastructure-security-automation)
  * [Наш контент з безпеки](#our-security-content)
* [Архітектура баз даних для Node.js-додатків](#database-architecture-for-nodejs-applications)
  * [Реалізація SQLite для продакшну Node.js](#sqlite-implementation-for-nodejs-production)
  * [Реалізація MongoDB для продакшну Node.js](#mongodb-implementation-for-nodejs-production)
* [Обробка фонових завдань у продакшні Node.js](#nodejs-production-background-job-processing)
  * [Налаштування нашого сервера Bree для продакшну](#our-bree-server-setup-for-production)
  * [Приклади продакшн-завдань](#production-job-examples)
  * [Наші шаблони планування завдань для продакшну Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Автоматизоване обслуговування продакшн-додатків Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Наша реалізація очищення](#our-cleanup-implementation)
  * [Управління дисковим простором для продакшну Node.js](#disk-space-management-for-nodejs-production)
  * [Автоматизація обслуговування інфраструктури](#infrastructure-maintenance-automation)
* [Посібник з реалізації розгортання продакшну Node.js](#nodejs-production-deployment-implementation-guide)
  * [Вивчайте наш реальний код для найкращих практик продакшну](#study-our-actual-code-for-production-best-practices)
  * [Вчіться з наших блог-постів](#learn-from-our-blog-posts)
  * [Автоматизація інфраструктури для продакшну Node.js](#infrastructure-automation-for-nodejs-production)
  * [Наші кейс-стаді](#our-case-studies)
* [Висновок: найкращі практики розгортання продакшну Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Повний список ресурсів для продакшну Node.js](#complete-resource-list-for-nodejs-production)
  * [Наші основні файли реалізації](#our-core-implementation-files)
  * [Наші серверні реалізації](#our-server-implementations)
  * [Наша автоматизація інфраструктури](#our-infrastructure-automation)
  * [Наші технічні блог-пости](#our-technical-blog-posts)
  * [Наші корпоративні кейс-стаді](#our-enterprise-case-studies)
## Передмова {#foreword}

У Forward Email ми роками вдосконалювали налаштування нашого виробничого середовища Node.js. Цей всебічний посібник ділиться нашими перевіреними на практиці найкращими практиками розгортання Node.js у виробництві, зосереджуючись на оптимізації продуктивності, моніторингу та уроках, які ми винесли, масштабуючи Node.js додатки для обробки мільйонів щоденних транзакцій.


## Наша революція оптимізації продуктивності одного ядра на 573% {#our-573-single-core-performance-optimization-revolution}

Коли ми перейшли з процесорів Intel на AMD Ryzen, ми досягли **573% покращення продуктивності** у наших Node.js додатках. Це була не просто незначна оптимізація — це фундаментально змінило те, як наші Node.js додатки працюють у виробництві, і демонструє важливість оптимізації продуктивності одного ядра для будь-якого Node.js додатку.

> \[!TIP]
> Для найкращих практик розгортання Node.js у виробництві вибір апаратного забезпечення є критичним. Ми спеціально обрали хостинг DataPacket через наявність AMD Ryzen, оскільки продуктивність одного ядра є вирішальною для Node.js додатків, оскільки виконання JavaScript однопотокове.

### Чому оптимізація продуктивності одного ядра важлива для Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Наш перехід з Intel на AMD Ryzen призвів до:

* **573% покращення продуктивності** у обробці запитів (задокументовано у [GitHub Issue #1519 на нашій сторінці статусу](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Усунення затримок обробки** до майже миттєвих відповідей (згадується у [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Кращого співвідношення ціна-продуктивність** для виробничих середовищ Node.js
* **Покращення часу відгуку** на всіх кінцевих точках нашого додатку

Покращення продуктивності було настільки значним, що ми тепер вважаємо процесори AMD Ryzen необхідними для будь-якого серйозного розгортання Node.js у виробництві, незалежно від того, чи запускаєте ви веб-додатки, API, мікросервіси чи будь-яке інше навантаження Node.js.

### Пов’язаний контент {#related-content}

Для детальнішої інформації про наш вибір інфраструктури перегляньте:

* [Найкращий сервіс переадресації електронної пошти](https://forwardemail.net/blog/docs/best-email-forwarding-service) — Порівняння продуктивності
* [Самостійне розгортання](https://forwardemail.net/blog/docs/self-hosted-solution) — Рекомендації щодо апаратного забезпечення


## Налаштування виробничого середовища Node.js: наш технологічний стек {#nodejs-production-environment-setup-our-technology-stack}

Наші найкращі практики розгортання Node.js у виробництві включають свідомий вибір технологій на основі багаторічного досвіду у виробництві. Ось що ми використовуємо і чому ці вибори застосовні до будь-якого Node.js додатку:

### Менеджер пакетів: pnpm для ефективності у виробництві {#package-manager-pnpm-for-production-efficiency}

**Що ми використовуємо:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (фіксована версія)

Ми обрали pnpm замість npm та yarn для налаштування нашого виробничого середовища Node.js через:

* **Швидший час встановлення** у CI/CD конвеєрах
* **Ефективність використання дискового простору** завдяки жорстким посиланням
* **Строге розв’язання залежностей**, що запобігає фантомним залежностям
* **Кращу продуктивність** у виробничих розгортаннях

> \[!NOTE]
> Як частина наших найкращих практик розгортання Node.js у виробництві, ми фіксуємо точні версії критичних інструментів, таких як pnpm, щоб забезпечити послідовну поведінку у всіх середовищах та на машинах членів команди.

**Деталі впровадження:**

* [Наша конфігурація package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Наш блог про екосистему NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Веб-фреймворк: Koa для сучасного виробництва Node.js {#web-framework-koa-for-modern-nodejs-production}

**Що ми використовуємо:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Ми обрали Koa замість Express для нашої продакшн-інфраструктури на Node.js через його сучасну підтримку async/await та чистішу композицію middleware. Наш засновник Нік Бауґ зробив внесок у обидва фреймворки — Express і Koa, що дало нам глибоке розуміння обох для використання у продакшн.

Ці патерни застосовуються незалежно від того, чи ви створюєте REST API, GraphQL сервери, веб-застосунки чи мікросервіси.

**Наші приклади реалізації:**

* [Налаштування веб-сервера](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Конфігурація API сервера](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Посібник з реалізації контактних форм](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Обробка фонових завдань: Bree для надійності в продакшн {#background-job-processing-bree-for-production-reliability}

**Що ми використовуємо:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) планувальник

Ми створили та підтримуємо Bree, бо існуючі планувальники завдань не відповідали нашим потребам у підтримці воркер-тредів та сучасних можливостей JavaScript у продакшн-середовищах Node.js. Це стосується будь-яких Node.js застосунків, які потребують фонової обробки, запланованих завдань або воркер-тредів.

**Наші приклади реалізації:**

* [Налаштування сервера Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Всі наші визначення завдань](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Завдання перевірки стану PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Реалізація завдання очищення](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Обробка помилок: @hapi/boom для надійності в продакшн {#error-handling-hapiboom-for-production-reliability}

**Що ми використовуємо:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ми використовуємо @hapi/boom для структурованих відповідей з помилками у всіх наших продакшн-застосунках на Node.js. Цей патерн підходить для будь-якого Node.js застосунку, який потребує послідовної обробки помилок.

**Наші приклади реалізації:**

* [Допоміжна функція класифікації помилок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Реалізація логера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Як моніторити Node.js застосунки в продакшн {#how-to-monitor-nodejs-applications-in-production}

Наш підхід до моніторингу Node.js застосунків у продакшн розвивався протягом багатьох років експлуатації застосунків у великому масштабі. Ми впроваджуємо моніторинг на кількох рівнях, щоб забезпечити надійність і продуктивність для будь-якого типу Node.js застосунку.

### Моніторинг Node.js на рівні системи в продакшн {#system-level-nodejs-production-monitoring}

**Наша основна реалізація:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Що ми використовуємо:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Наші пороги моніторингу в продакшн (з нашого реального продакшн-коду):

* **Ліміт heap 2GB** з автоматичними сповіщеннями
* **Попередження при використанні пам’яті 25%**
* **Сповіщення при використанні CPU 80%**
* **Попередження при використанні диску 75%**

> \[!WARNING]
> Ці пороги працюють для нашої конкретної апаратної конфігурації. При впровадженні моніторингу Node.js у продакшн перегляньте реалізацію monitor-server.js, щоб зрозуміти точну логіку та адаптувати значення під ваше середовище.

### Моніторинг на рівні застосунку для Node.js у продакшн {#application-level-monitoring-for-nodejs-production}

**Наша класифікація помилок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ця допоміжна функція розрізняє:

* **Реальні баги коду**, які потребують негайної уваги
* **Помилки користувача**, які є очікуваною поведінкою
* **Збої зовнішніх сервісів**, які ми не можемо контролювати

Цей патерн застосовується до будь-якого Node.js застосунку — веб-застосунків, API, мікросервісів або фонових сервісів.
**Наша реалізація логування:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Ми реалізуємо комплексне приховування полів для захисту конфіденційної інформації, зберігаючи при цьому корисні можливості налагодження у нашому продакшн-середовищі Node.js.

### Моніторинг, специфічний для застосунку {#application-specific-monitoring}

**Наші серверні реалізації:**

* [SMTP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Моніторинг черги:** Ми встановлюємо ліміти черги в 5 ГБ та таймаути обробки запитів у 180 секунд, щоб запобігти виснаженню ресурсів. Ці патерни застосовні до будь-якого Node.js застосунку з чергами або фоновою обробкою.


## Моніторинг продакшн Node.js з PM2 Health Checks {#nodejs-production-monitoring-with-pm2-health-checks}

Ми вдосконалили налаштування нашого продакшн-середовища Node.js з PM2 за роки досвіду у продакшні. Наші перевірки стану PM2 є необхідними для підтримки надійності будь-якого Node.js застосунку.

### Наша система перевірки стану PM2 {#our-pm2-health-check-system}

**Наша основна реалізація:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Наш моніторинг продакшн Node.js з PM2 health checks включає:

* **Виконується кожні 20 хвилин** за розкладом cron
* **Вимагає мінімум 15 хвилин безперервної роботи** перед визнанням процесу здоровим
* **Перевіряє статус процесу та використання пам’яті**
* **Автоматично перезапускає збої процесів**
* **Запобігає циклам перезапуску** завдяки інтелектуальній перевірці стану

> \[!CAUTION]
> Для найкращих практик розгортання Node.js у продакшн ми вимагаємо 15+ хвилин безперервної роботи перед визнанням процесу здоровим, щоб уникнути циклів перезапуску. Це запобігає каскадним збоям, коли процеси мають проблеми з пам’яттю або іншими питаннями.

### Наша продакшн-конфігурація PM2 {#our-pm2-production-configuration}

**Налаштування нашої екосистеми:** Вивчіть наші файли запуску серверів для налаштування продакшн-середовища Node.js:

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планувальник Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Ці патерни застосовні, чи ви запускаєте Express додатки, Koa сервери, GraphQL API або будь-який інший Node.js застосунок.

### Автоматизоване розгортання PM2 {#automated-pm2-deployment}

**Розгортання PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Ми автоматизуємо всю нашу налаштування PM2 через Ansible, щоб забезпечити послідовні продакшн-розгортання Node.js на всіх наших серверах.


## Система обробки та класифікації помилок у продакшн {#production-error-handling-and-classification-system}

Одна з наших найцінніших найкращих практик розгортання Node.js у продакшн — інтелектуальна класифікація помилок, що застосовується до будь-якого Node.js застосунку:

### Наша реалізація isCodeBug для продакшн {#our-iscodebug-implementation-for-production}

**Джерело:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Цей хелпер забезпечує інтелектуальну класифікацію помилок для Node.js застосунків у продакшн, щоб:

* **Пріоритезувати реальні баги** над помилками користувачів
* **Покращити нашу реакцію на інциденти**, зосереджуючись на реальних проблемах
* **Зменшити втому від сповіщень** через очікувані помилки користувачів
* **Краще розуміти** проблеми застосунку проти проблем, створених користувачами

Цей патерн працює для будь-якого Node.js застосунку — чи ви створюєте сайти електронної комерції, SaaS платформи, API або мікросервіси.

### Інтеграція з нашим продакшн-логуванням {#integration-with-our-production-logging}

**Наша інтеграція логера:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Наш логер використовує `isCodeBug` для визначення рівнів оповіщень та редагування полів, забезпечуючи повідомлення про реальні проблеми та фільтруючи шум у нашому продакшн-середовищі Node.js.

### Related Content {#related-content-1}

Дізнайтеся більше про наші шаблони обробки помилок:

* [Побудова надійної платіжної системи](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Шаблони обробки помилок
* [Захист конфіденційності електронної пошти](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Обробка помилок безпеки


## Розширене налагодження продуктивності з v8-profiler-next та cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Ми використовуємо розширені інструменти профілювання для аналізу знімків купи та налагодження проблем OOM (Out of Memory), вузьких місць продуктивності та проблем пам’яті Node.js у нашому продакшн-середовищі. Ці інструменти є необхідними для будь-якого Node.js-додатку, що стикається з витоками пам’яті або проблемами продуктивності.

### Наш підхід до профілювання для продакшн Node.js {#our-profiling-approach-for-nodejs-production}

**Інструменти, які ми рекомендуємо:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Для створення знімків купи та профілів CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Для аналізу профілів CPU та знімків купи

> \[!TIP]
> Ми використовуємо v8-profiler-next та cpupro разом, щоб створити повний робочий процес налагодження продуктивності для наших Node.js-додатків. Це поєднання допомагає нам виявляти витоки пам’яті, вузькі місця продуктивності та оптимізувати наш продакшн-код.

### Як ми реалізуємо аналіз знімків купи {#how-we-implement-heap-snapshot-analysis}

**Наша реалізація моніторингу:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Наш продакшн-моніторинг включає автоматичне створення знімків купи при перевищенні порогів пам’яті. Це допомагає нам налагоджувати проблеми OOM до того, як вони спричинять аварійне завершення роботи додатку.

**Ключові шаблони реалізації:**

* **Автоматичні знімки** при перевищенні порогу розміру купи в 2 ГБ
* **Профілювання на основі сигналів** для аналізу за запитом у продакшн
* **Політики зберігання** для керування сховищем знімків
* **Інтеграція з нашими завданнями очищення** для автоматизованого обслуговування

### Робочий процес налагодження продуктивності {#performance-debugging-workflow}

**Вивчіть нашу фактичну реалізацію:**

* [Реалізація монітора сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Моніторинг купи та створення знімків
* [Завдання очищення](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Зберігання та очищення знімків
* [Інтеграція логера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Логування продуктивності

### Рекомендована реалізація для вашого Node.js-додатку {#recommended-implementation-for-your-nodejs-application}

**Для аналізу знімків купи:**

1. **Встановіть v8-profiler-next** для створення знімків
2. **Використовуйте cpupro** для аналізу створених знімків
3. **Реалізуйте пороги моніторингу**, подібні до monitor-server.js
4. **Налаштуйте автоматичне очищення** для керування сховищем знімків
5. **Створіть обробники сигналів** для профілювання за запитом у продакшн

**Для профілювання CPU:**

1. **Створюйте профілі CPU** під час періодів високого навантаження
2. **Аналізуйте за допомогою cpupro** для виявлення вузьких місць
3. **Зосередьтеся на гарячих шляхах** та можливостях оптимізації
4. **Моніторте до/після** покращень продуктивності

> \[!WARNING]
> Створення знімків купи та профілів CPU може впливати на продуктивність. Ми рекомендуємо реалізувати обмеження частоти та вмикати профілювання лише під час розслідування конкретних проблем або в періоди обслуговування.

### Інтеграція з нашим продакшн-моніторингом {#integration-with-our-production-monitoring}

Наші інструменти профілювання інтегруються з нашою ширшою стратегією моніторингу:

* **Автоматичне спрацьовування** на основі порогів пам’яті/CPU
* **Інтеграція оповіщень** при виявленні проблем продуктивності
* **Історичний аналіз** для відстеження тенденцій продуктивності з часом
* **Кореляція з метриками додатку** для комплексного налагодження
Цей підхід допоміг нам виявити та усунути витоки пам’яті, оптимізувати гарячі ділянки коду та підтримувати стабільну продуктивність у нашому виробничому середовищі Node.js.


## Безпека виробничої інфраструктури Node.js {#nodejs-production-infrastructure-security}

Ми впроваджуємо комплексну безпеку для нашої виробничої інфраструктури Node.js за допомогою автоматизації Ansible. Ці практики застосовуються до будь-якого додатку Node.js:

### Безпека на рівні системи для виробництва Node.js {#system-level-security-for-nodejs-production}

**Наша реалізація Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Наші ключові заходи безпеки для виробничих середовищ Node.js:

* **Відключений swap** для запобігання запису конфіденційних даних на диск
* **Відключені core dumps** для запобігання дампам пам’яті, що містять конфіденційну інформацію
* **Заблоковане USB-зберігання** для запобігання несанкціонованому доступу до даних
* **Налаштування параметрів ядра** для безпеки та продуктивності

> \[!WARNING]
> При впровадженні найкращих практик розгортання Node.js у виробництві відключення swap може спричинити завершення процесів через нестачу пам’яті, якщо ваш додаток перевищує доступний обсяг ОЗП. Ми ретельно контролюємо використання пам’яті та відповідно підбираємо розмір серверів.

### Безпека додатків для Node.js {#application-security-for-nodejs-applications}

**Наше приховування полів у логах:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Ми приховуємо конфіденційні поля у логах, включно з паролями, токенами, API-ключами та персональною інформацією. Це захищає приватність користувачів, зберігаючи можливості налагодження у будь-якому виробничому середовищі Node.js.

### Автоматизація безпеки інфраструктури {#infrastructure-security-automation}

**Наш повний набір Ansible для виробництва Node.js:**

* [Playbook безпеки](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Управління SSH-ключами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Управління сертифікатами](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Налаштування DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Наш контент про безпеку {#our-security-content}

Дізнайтеся більше про наш підхід до безпеки:

* [Кращі компанії з аудиту безпеки](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Квантово-безпечна зашифрована електронна пошта](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Чому безпека електронної пошти з відкритим кодом](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Архітектура бази даних для додатків Node.js {#database-architecture-for-nodejs-applications}

Ми використовуємо гібридний підхід до баз даних, оптимізований для наших додатків Node.js. Ці патерни можна адаптувати для будь-якого додатку Node.js:

### Реалізація SQLite для виробництва Node.js {#sqlite-implementation-for-nodejs-production}

**Що ми використовуємо:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Наша конфігурація:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Ми використовуємо SQLite для даних, специфічних для користувача, у наших додатках Node.js, оскільки це забезпечує:

* **Ізоляцію даних** для кожного користувача/орендаря
* **Кращу продуктивність** для запитів одного користувача
* **Спрощене резервне копіювання** та міграцію
* **Зменшену складність** порівняно з розділеними базами даних

Цей патерн добре підходить для SaaS-додатків, мультиорендних систем або будь-яких додатків Node.js, які потребують ізоляції даних.

### Реалізація MongoDB для виробництва Node.js {#mongodb-implementation-for-nodejs-production}

**Що ми використовуємо:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Наша реалізація налаштування:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Наша конфігурація:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Ми використовуємо MongoDB для даних додатку в нашому продакшн-середовищі Node.js, тому що він забезпечує:

* **Гнучку схему** для еволюції структур даних
* **Кращу продуктивність** для складних запитів
* **Можливості горизонтального масштабування**
* **Багатий мова запитів**

> \[!NOTE]
> Наш гібридний підхід оптимізований під наш конкретний випадок використання. Вивчайте реальні шаблони використання бази даних у кодовій базі, щоб зрозуміти, чи підходить цей підхід для вашого додатку Node.js.


## Обробка фонових завдань у продакшн Node.js {#nodejs-production-background-job-processing}

Ми побудували нашу архітектуру фонових завдань навколо Bree для надійного розгортання Node.js у продакшн. Це стосується будь-якого додатку Node.js, який потребує фонової обробки:

### Налаштування нашого сервера Bree для продакшн {#our-bree-server-setup-for-production}

**Наша основна реалізація:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Наш розгортання Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Приклади продакшн-завдань {#production-job-examples}

**Моніторинг стану:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Автоматизація очищення:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Всі наші завдання:** [Переглянути повний каталог завдань](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Ці шаблони застосовуються до будь-якого додатку Node.js, який потребує:

* Запланованих завдань (обробка даних, звіти, очищення)
* Фонової обробки (зміна розміру зображень, відправка електронної пошти, імпорт даних)
* Моніторингу стану та обслуговування
* Використання робочих потоків для ресурсомістких завдань

### Наші шаблони планування завдань для продакшн Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Вивчайте реальні шаблони планування завдань у нашому каталозі завдань, щоб зрозуміти:

* Як ми реалізуємо планування, схоже на cron, у продакшн Node.js
* Нашу логіку обробки помилок і повторних спроб
* Як ми використовуємо робочі потоки для ресурсомістких завдань


## Автоматизоване обслуговування для продакшн-додатків Node.js {#automated-maintenance-for-production-nodejs-applications}

Ми реалізуємо проактивне обслуговування, щоб запобігти поширеним проблемам у продакшн Node.js. Ці шаблони застосовуються до будь-якого додатку Node.js:

### Наша реалізація очищення {#our-cleanup-implementation}

**Джерело:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Наше автоматизоване обслуговування для продакшн-додатків Node.js орієнтоване на:

* **Тимчасові файли**, старші за 24 години
* **Файли журналів** поза межами термінів зберігання
* **Файли кешу** та тимчасові дані
* **Завантажені файли**, які більше не потрібні
* **Знімки купи (heap snapshots)** для налагодження продуктивності

Ці шаблони застосовуються до будь-якого додатку Node.js, який генерує тимчасові файли, журнали або кешовані дані.

### Управління дисковим простором для продакшн Node.js {#disk-space-management-for-nodejs-production}

**Наші порогові значення моніторингу:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Обмеження черги** для фонової обробки
* **Попередження при 75% використання диску**
* **Автоматичне очищення** при перевищенні порогів

### Автоматизація обслуговування інфраструктури {#infrastructure-maintenance-automation}

**Наша автоматизація Ansible для продакшн Node.js:**

* [Розгортання середовища](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Управління ключами розгортання](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Посібник з реалізації розгортання продакшн Node.js {#nodejs-production-deployment-implementation-guide}
### Вивчайте Наш Реальний Код для Кращих Практик Виробництва {#study-our-actual-code-for-production-best-practices}

**Почніть з цих ключових файлів для налаштування виробничого середовища Node.js:**

1. **Конфігурація:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Моніторинг:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Обробка помилок:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Логування:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Стан процесу:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Вчіться з Наших Блогових Публікацій {#learn-from-our-blog-posts}

**Наші технічні посібники з впровадження для виробництва Node.js:**

* [Екосистема пакетів NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Створення платіжних систем](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Реалізація захисту електронної пошти](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript контактні форми](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Інтеграція електронної пошти з React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Автоматизація Інфраструктури для Виробництва Node.js {#infrastructure-automation-for-nodejs-production}

**Наші Ansible playbooks для вивчення розгортання Node.js у виробництві:**

* [Повний каталог playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Зміцнення безпеки](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Налаштування Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Наші Кейси {#our-case-studies}

**Наші корпоративні впровадження:**

* [Кейс Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Кейс Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Пересилання пошти випускникам](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Висновок: Кращі Практики Розгортання Node.js у Виробництві {#conclusion-nodejs-production-deployment-best-practices}

Наша виробнича інфраструктура Node.js демонструє, що додатки Node.js можуть досягти надійності корпоративного рівня завдяки:

* **Перевіреному вибору апаратного забезпечення** (AMD Ryzen для оптимізації продуктивності одного ядра на 573%)
* **Перевіреному моніторингу Node.js у виробництві** з конкретними порогами та автоматизованими реакціями
* **Розумній класифікації помилок** для покращення реагування на інциденти у виробничих середовищах
* **Розширеному налагодженню продуктивності** за допомогою v8-profiler-next та cpupro для запобігання OOM
* **Комплексному зміцненню безпеки** через автоматизацію Ansible
* **Гібридній архітектурі баз даних**, оптимізованій під потреби додатків
* **Автоматизованому обслуговуванню** для запобігання поширеним проблемам Node.js у виробництві

**Головний висновок:** Вивчайте наші реальні файли впровадження та блогові публікації замість того, щоб слідувати загальним кращим практикам. Наша кодова база надає реальні шаблони для розгортання Node.js у виробництві, які можна адаптувати для будь-яких додатків Node.js — веб-додатків, API, мікросервісів або фонових сервісів.


## Повний Список Ресурсів для Виробництва Node.js {#complete-resource-list-for-nodejs-production}

### Наші Основні Файли Впровадження {#our-core-implementation-files}

* [Головна конфігурація](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Залежності пакетів](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Моніторинг сервера](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Класифікація помилок](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Система логування](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Перевірки стану PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Автоматизоване очищення](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Наші серверні реалізації {#our-server-implementations}

* [Веб-сервер](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API сервер](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Планувальник Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP сервер](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3 сервер](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Наша автоматизація інфраструктури {#our-infrastructure-automation}

* [Всі наші Ansible playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Зміцнення безпеки](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Налаштування Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Конфігурація бази даних](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Наші технічні публікації в блозі {#our-technical-blog-posts}

* [Аналіз екосистеми NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Реалізація платіжної системи](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Технічний посібник з конфіденційності електронної пошти](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript контактні форми](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Інтеграція електронної пошти з React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Посібник із самостійного розгортання](https://forwardemail.net/blog/docs/self-hosted-solution)

### Наші корпоративні кейс-стаді {#our-enterprise-case-studies}

* [Реалізація Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Кейс-стаді Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Відповідність федеральним урядовим вимогам](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Системи електронної пошти для випускників](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
