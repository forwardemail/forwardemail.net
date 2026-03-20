# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>Коротко:</strong> Наш <a href="https://github.com/forwardemail/mcp-server">відкритий MCP сервер</a> дозволяє AI асистентам, таким як Claude, ChatGPT, Cursor та Windsurf, керувати вашою електронною поштою, доменами, псевдонімами, контактами та календарями за допомогою природної мови. Всі 68 API кінцевих точок доступні як MCP інструменти. Він працює локально через <code>npx @forwardemail/mcp-server</code> — ваші облікові дані ніколи не залишають ваш пристрій.
</p>


## Зміст {#table-of-contents}

* [Що таке MCP?](#what-is-mcp)
* [Швидкий старт](#quick-start)
  * [Отримати API ключ](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Інші MCP клієнти](#other-mcp-clients)
* [Аутентифікація](#authentication)
  * [Аутентифікація API ключем](#api-key-auth)
  * [Аутентифікація псевдонімом](#alias-auth)
  * [Генерація пароля для псевдоніма](#generating-an-alias-password)
* [Всі 68 інструментів](#all-68-tools)
  * [Обліковий запис (API ключ або аутентифікація псевдонімом)](#account-api-key-or-alias-auth)
  * [Домени (API ключ)](#domains-api-key)
  * [Псевдоніми (API ключ)](#aliases-api-key)
  * [Електронна пошта — вихідний SMTP (API ключ; Send підтримує обидва)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Повідомлення — IMAP (аутентифікація псевдонімом)](#messages--imap-alias-auth)
  * [Папки — IMAP (аутентифікація псевдонімом)](#folders--imap-alias-auth)
  * [Контакти — CardDAV (аутентифікація псевдонімом)](#contacts--carddav-alias-auth)
  * [Календарі — CalDAV (аутентифікація псевдонімом)](#calendars--caldav-alias-auth)
  * [Події календаря — CalDAV (аутентифікація псевдонімом)](#calendar-events--caldav-alias-auth)
  * [Скрипти Sieve (API ключ)](#sieve-scripts-api-key)
  * [Скрипти Sieve (аутентифікація псевдонімом)](#sieve-scripts-alias-auth)
  * [Учасники домену та запрошення (API ключ)](#domain-members-and-invites-api-key)
  * [Паролі Catch-All (API ключ)](#catch-all-passwords-api-key)
  * [Логи (API ключ)](#logs-api-key)
  * [Шифрування (без аутентифікації)](#encrypt-no-auth)
* [20 реальних сценаріїв використання](#20-real-world-use-cases)
  * [1. Сортування електронної пошти](#1-email-triage)
  * [2. Автоматизація налаштування домену](#2-domain-setup-automation)
  * [3. Масове керування псевдонімами](#3-bulk-alias-management)
  * [4. Моніторинг email кампаній](#4-email-campaign-monitoring)
  * [5. Синхронізація та очищення контактів](#5-contact-sync-and-cleanup)
  * [6. Керування календарем](#6-calendar-management)
  * [7. Автоматизація скриптів Sieve](#7-sieve-script-automation)
  * [8. Вступ у команду](#8-team-onboarding)
  * [9. Аудит безпеки](#9-security-auditing)
  * [10. Налаштування переадресації пошти](#10-email-forwarding-setup)
  * [11. Пошук та аналіз вхідних](#11-inbox-search-and-analysis)
  * [12. Організація папок](#12-folder-organization)
  * [13. Ротація паролів](#13-password-rotation)
  * [14. Шифрування DNS записів](#14-dns-record-encryption)
  * [15. Аналіз логів доставки](#15-delivery-log-analysis)
  * [16. Керування кількома доменами](#16-multi-domain-management)
  * [17. Налаштування Catch-All](#17-catch-all-configuration)
  * [18. Керування запрошеннями домену](#18-domain-invite-management)
  * [19. Тестування зберігання S3](#19-s3-storage-testing)
  * [20. Створення чернеток листів](#20-email-draft-composition)
* [Приклади запитів](#example-prompts)
* [Змінні середовища](#environment-variables)
* [Безпека](#security)
* [Програмне використання](#programmatic-usage)
* [Відкритий код](#open-source)


## Що таке MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) — це відкритий стандарт, створений Anthropic, який дозволяє AI моделям безпечно викликати зовнішні інструменти. Замість копіювання та вставки відповідей API у вікно чату, MCP дає моделі прямий, структурований доступ до ваших сервісів.

Наш MCP сервер обгортає весь [Forward Email API](/email-api) — кожну кінцеву точку, кожен параметр — і надає їх як інструменти, які може використовувати будь-який сумісний MCP клієнт. Сервер працює локально на вашому пристрої, використовуючи stdio транспорт. Ваші облікові дані залишаються у змінних середовища і ніколи не передаються AI моделі.


## Швидкий старт {#quick-start}

### Отримати API ключ {#get-an-api-key}
1. Увійдіть у свій [акаунт Forward Email](/my-account/domains).
2. Перейдіть до **Мій акаунт** → **Безпека** → **API ключі**.
3. Згенеруйте новий API ключ і скопіюйте його.

### Claude Desktop {#claude-desktop}

Додайте це у файл конфігурації Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Перезапустіть Claude Desktop. Ви повинні побачити інструменти Forward Email у виборі інструментів.

> **Примітка:** Змінні `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD` є необов’язковими, але потрібні для інструментів поштової скриньки (повідомлення, папки, контакти, календарі). Детальніше див. у розділі [Аутентифікація](#authentication).

### Cursor {#cursor}

Відкрийте Налаштування Cursor → MCP → Додати сервер:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Відкрийте Налаштування Windsurf → MCP → Додати сервер з такою ж конфігурацією, як вище.

### Інші MCP клієнти {#other-mcp-clients}

Будь-який клієнт, що підтримує MCP stdio transport, буде працювати. Команда:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Аутентифікація {#authentication}

API Forward Email використовує **HTTP Basic аутентифікацію** з двома різними типами облікових даних залежно від кінцевої точки. MCP сервер обробляє це автоматично — вам лише потрібно надати правильні облікові дані.

### Аутентифікація за API ключем {#api-key-auth}

Більшість керуючих кінцевих точок (домени, псевдоніми, вихідні листи, логи) використовують ваш **API ключ** як ім’я користувача Basic auth з порожнім паролем.

Це той самий API ключ, який ви використовуєте для REST API. Встановіть його через змінну середовища `FORWARD_EMAIL_API_KEY`.

### Аутентифікація за псевдонімом {#alias-auth}

Кінцеві точки поштової скриньки (повідомлення, папки, контакти, календарі, скрипти sieve, прив’язані до псевдоніма) використовують **облікові дані псевдоніма** — адресу псевдоніма як ім’я користувача та згенерований пароль як пароль.

Ці кінцеві точки отримують доступ до даних для кожного псевдоніма через протоколи IMAP, CalDAV та CardDAV. Вони потребують адресу псевдоніма та згенерований пароль, а не API ключ.

Ви можете надати облікові дані псевдоніма двома способами:

1. **Змінні середовища** (рекомендується для псевдоніма за замовчуванням): встановіть `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Параметри для кожного виклику інструменту**: передайте `alias_username` та `alias_password` як аргументи будь-якому інструменту з аутентифікацією псевдоніма. Вони перекривають змінні середовища, що корисно при роботі з кількома псевдонімами.

### Генерація пароля для псевдоніма {#generating-an-alias-password}

Перед тим, як використовувати інструменти з аутентифікацією псевдоніма, потрібно згенерувати пароль для псевдоніма. Ви можете зробити це за допомогою інструменту `generateAliasPassword` або через API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

У відповіді містяться поля `username` (адреса псевдоніма) та `password`. Використовуйте їх як облікові дані псевдоніма.

> **Порада:** Ви також можете запитати свого AI помічника: *"Згенеруй пароль для псевдоніма <user@example.com> на домені example.com"* — він виконає виклик інструменту `generateAliasPassword` і поверне облікові дані.

Нижче наведена таблиця, яка узагальнює, який метод аутентифікації потрібен для кожної групи інструментів:

| Група інструментів                                             | Метод аутентифікації      | Облікові дані                                              |
| -------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| Акаунт                                                         | API ключ **або** аутентифікація псевдоніма | Будь-який з них                                            |
| Домени, Псевдоніми, Члени домену, Запрошення, Паролі Catch-All | API ключ                   | `FORWARD_EMAIL_API_KEY`                                     |
| Вихідні листи (список, отримання, видалення, ліміт)           | API ключ                   | `FORWARD_EMAIL_API_KEY`                                     |
| Відправка листа                                                | API ключ **або** аутентифікація псевдоніма | Будь-який з них                                            |
| Повідомлення (IMAP)                                            | Аутентифікація псевдоніма  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Папки (IMAP)                                                  | Аутентифікація псевдоніма  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Контакти (CardDAV)                                            | Аутентифікація псевдоніма  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Календарі (CalDAV)                                            | Аутентифікація псевдоніма  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Події календаря (CalDAV)                                      | Аутентифікація псевдоніма  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Скрипти Sieve (прив’язані до домену)                         | API ключ                   | `FORWARD_EMAIL_API_KEY`                                     |
| Скрипти Sieve (прив’язані до псевдоніма)                     | Аутентифікація псевдоніма  | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Логи                                                          | API ключ                   | `FORWARD_EMAIL_API_KEY`                                     |
| Шифрування                                                   | Немає                     | Облікові дані не потрібні                                  |
## Всі 68 інструментів {#all-68-tools}

Кожен інструмент безпосередньо відповідає кінцевій точці [Forward Email API](/email-api). Параметри використовують ті ж назви, що й у документації API. Метод автентифікації зазначено в заголовку кожного розділу.

### Обліковий запис (API Key або Alias Auth) {#account-api-key-or-alias-auth}

За автентифікації API ключем ці інструменти повертають інформацію про ваш обліковий запис користувача. За автентифікації через псевдонім вони повертають інформацію про псевдонім/поштову скриньку, включно з квотою сховища та налаштуваннями.

| Інструмент       | Кінцева точка API   | Опис                         |
| ---------------  | ------------------- | ---------------------------- |
| `getAccount`     | `GET /v1/account`   | Отримати інформацію про обліковий запис |
| `updateAccount`  | `PUT /v1/account`   | Оновити налаштування облікового запису |

### Домени (API Key) {#domains-api-key}

| Інструмент           | Кінцева точка API                                   | Опис                       |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `listDomains`        | `GET /v1/domains`                                  | Перелік усіх ваших доменів |
| `createDomain`       | `POST /v1/domains`                                 | Додати новий домен         |
| `getDomain`          | `GET /v1/domains/:domain_id`                       | Отримати деталі домену     |
| `updateDomain`       | `PUT /v1/domains/:domain_id`                       | Оновити налаштування домену|
| `deleteDomain`       | `DELETE /v1/domains/:domain_id`                    | Видалити домен             |
| `verifyDomainRecords`| `GET /v1/domains/:domain_id/verify-records`       | Перевірити DNS записи      |
| `verifySmtpRecords`  | `GET /v1/domains/:domain_id/verify-smtp`          | Перевірити налаштування SMTP |
| `testS3Connection`   | `POST /v1/domains/:domain_id/test-s3-connection`  | Перевірити підключення до кастомного S3 сховища |

### Псевдоніми (API Key) {#aliases-api-key}

| Інструмент               | Кінцева точка API                                              | Опис                                   |
| ------------------------ | -------------------------------------------------------------- | ------------------------------------- |
| `listAliases`            | `GET /v1/domains/:domain_id/aliases`                           | Перелік псевдонімів для домену        |
| `createAlias`            | `POST /v1/domains/:domain_id/aliases`                          | Створити новий псевдонім               |
| `getAlias`               | `GET /v1/domains/:domain_id/aliases/:alias_id`                 | Отримати деталі псевдоніма             |
| `updateAlias`            | `PUT /v1/domains/:domain_id/aliases/:alias_id`                 | Оновити псевдонім                      |
| `deleteAlias`            | `DELETE /v1/domains/:domain_id/aliases/:alias_id`              | Видалити псевдонім                     |
| `generateAliasPassword`  | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Згенерувати пароль IMAP/SMTP для автентифікації псевдоніма |

### Електронні листи — Вихідний SMTP (API Key; Send підтримує обидва) {#emails--outbound-smtp-api-key-send-supports-both}

| Інструмент       | Кінцева точка API       | Автентифікація          | Опис                          |
| ---------------- | ----------------------- | ----------------------- | ----------------------------- |
| `sendEmail`      | `POST /v1/emails`       | API Key або Alias Auth  | Надіслати електронний лист через SMTP |
| `listEmails`     | `GET /v1/emails`        | API Key                 | Перелік вихідних листів       |
| `getEmail`       | `GET /v1/emails/:id`    | API Key                 | Отримати деталі та статус листа |
| `deleteEmail`    | `DELETE /v1/emails/:id` | API Key                 | Видалити лист із черги        |
| `getEmailLimit`  | `GET /v1/emails/limit`  | API Key                 | Перевірити ліміт відправлення |

Інструмент `sendEmail` приймає `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` та `attachments`. Це те саме, що й кінцева точка `POST /v1/emails`.

### Повідомлення — IMAP (Alias Auth) {#messages--imap-alias-auth}

> **Потрібні облікові дані псевдоніма.** Передайте `alias_username` та `alias_password` або встановіть змінні середовища `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Інструмент      | API Endpoint              | Опис                                  |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Перелік і пошук повідомлень у поштовій скриньці |
| `createMessage` | `POST /v1/messages`       | Створити чернетку або завантажити повідомлення |
| `getMessage`    | `GET /v1/messages/:id`    | Отримати повідомлення за ID           |
| `updateMessage` | `PUT /v1/messages/:id`    | Оновити прапорці (прочитано, зірочка тощо) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Видалити повідомлення                 |

Інструмент `listMessages` підтримує понад 15 параметрів пошуку, включно з `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` та `has_attachment`. Дивіться [документацію API](/email-api) для повного списку.

### Папки — IMAP (авторизація через псевдонім) {#folders--imap-alias-auth}

> **Потрібні облікові дані псевдоніма.** Передайте `alias_username` та `alias_password` або встановіть змінні середовища `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Інструмент      | API Endpoint             | Опис                     |
| --------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Перелік усіх папок поштової скриньки |
| `createFolder` | `POST /v1/folders`       | Створити нову папку      |
| `getFolder`    | `GET /v1/folders/:id`    | Отримати деталі папки    |
| `updateFolder` | `PUT /v1/folders/:id`    | Перейменувати папку      |
| `deleteFolder` | `DELETE /v1/folders/:id` | Видалити папку           |

### Контакти — CardDAV (авторизація через псевдонім) {#contacts--carddav-alias-auth}

> **Потрібні облікові дані псевдоніма.** Передайте `alias_username` та `alias_password` або встановіть змінні середовища `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Інструмент       | API Endpoint             | Опис                   |
| ---------------- | ------------------------ | ---------------------- |
| `listContacts`  | `GET /v1/contacts`        | Перелік усіх контактів |
| `createContact` | `POST /v1/contacts`       | Створити новий контакт |
| `getContact`    | `GET /v1/contacts/:id`    | Отримати деталі контакту |
| `updateContact` | `PUT /v1/contacts/:id`    | Оновити контакт        |
| `deleteContact` | `DELETE /v1/contacts/:id` | Видалити контакт       |

### Календарі — CalDAV (авторизація через псевдонім) {#calendars--caldav-alias-auth}

> **Потрібні облікові дані псевдоніма.** Передайте `alias_username` та `alias_password` або встановіть змінні середовища `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Інструмент        | API Endpoint               | Опис                   |
| ----------------- | -------------------------- | ---------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Перелік усіх календарів |
| `createCalendar` | `POST /v1/calendars`       | Створити новий календар |
| `getCalendar`    | `GET /v1/calendars/:id`    | Отримати деталі календаря |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Оновити календар       |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Видалити календар      |

### Події календаря — CalDAV (авторизація через псевдонім) {#calendar-events--caldav-alias-auth}

> **Потрібні облікові дані псевдоніма.** Передайте `alias_username` та `alias_password` або встановіть змінні середовища `FORWARD_EMAIL_ALIAS_USER` та `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Інструмент             | API Endpoint                     | Опис                   |
| ---------------------- | -------------------------------- | ---------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Перелік усіх подій     |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Створити нову подію    |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Отримати деталі події  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Оновити подію          |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Видалити подію         |

### Скрипти Sieve (API ключ) {#sieve-scripts-api-key}

Використовують шляхи, обмежені доменом, та автентифікуються за допомогою вашого API ключа.

| Інструмент             | API Endpoint                                                              | Опис                      |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Перелік скриптів для псевдоніма |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Створити новий скрипт     |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Отримати деталі скрипта   |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Оновити скрипт            |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Видалити скрипт           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Активувати скрипт         |
### Сценарії Sieve (Аутентифікація через псевдонім) {#sieve-scripts-alias-auth}

Вони використовують аутентифікацію на рівні псевдоніма. Корисно для автоматизації на рівні псевдоніма без необхідності API ключа.

> **Потрібні облікові дані псевдоніма.** Передайте `alias_username` та `alias_password` або встановіть змінні середовища `FORWARD_EMAIL_ALIAS_USER` і `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Інструмент                    | API Endpoint                                 | Опис               |
| ----------------------------- | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Перелік сценаріїв  |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Створити сценарій  |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Отримати деталі сценарію |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Оновити сценарій   |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Видалити сценарій  |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Активувати сценарій |

### Учасники домену та запрошення (API ключ) {#domain-members-and-invites-api-key}

| Інструмент             | API Endpoint                                       | Опис                      |
| ---------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`   | `PUT /v1/domains/:domain_id/members/:member_id`    | Змінити роль учасника      |
| `removeDomainMember`   | `DELETE /v1/domains/:domain_id/members/:member_id` | Видалити учасника          |
| `acceptDomainInvite`   | `GET /v1/domains/:domain_id/invites`               | Прийняти очікуване запрошення |
| `createDomainInvite`   | `POST /v1/domains/:domain_id/invites`              | Запросити когось до домену |
| `removeDomainInvite`   | `DELETE /v1/domains/:domain_id/invites`            | Відкликати запрошення      |

### Паролі Catch-All (API ключ) {#catch-all-passwords-api-key}

| Інструмент               | API Endpoint                                                  | Опис                        |
| ------------------------ | ------------------------------------------------------------- | ---------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Перелік паролів catch-all    |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Створити пароль catch-all    |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Видалити пароль catch-all    |

### Логи (API ключ) {#logs-api-key}

| Інструмент       | API Endpoint            | Опис                         |
| ---------------- | ----------------------- | ----------------------------- |
| `downloadLogs`   | `GET /v1/logs/download` | Завантажити логи доставки пошти |

### Шифрування (Без аутентифікації) {#encrypt-no-auth}

| Інструмент       | API Endpoint       | Опис                        |
| ---------------- | ------------------ | ---------------------------- |
| `encryptRecord`  | `POST /v1/encrypt` | Зашифрувати DNS TXT запис   |

Цей інструмент не потребує аутентифікації. Він шифрує записи переадресації, як-от `forward-email=user@example.com` для використання в DNS TXT записах.


## 20 Практичних випадків використання {#20-real-world-use-cases}

Ось практичні способи використання сервера MCP з вашим AI асистентом:

### 1. Сортування пошти {#1-email-triage}

Попросіть вашого AI просканувати вашу поштову скриньку та підсумувати непрочитані повідомлення. Він може позначати термінові листи, категоризувати за відправником і складати відповіді — все через природну мову. *(Потрібні облікові дані псевдоніма для доступу до скриньки.)*

### 2. Автоматизація налаштування домену {#2-domain-setup-automation}

Налаштовуєте новий домен? Попросіть AI створити домен, додати ваші псевдоніми, перевірити DNS записи та протестувати конфігурацію SMTP. Те, що зазвичай займає 10 хвилин кліків у панелі керування, стає однією розмовою.

### 3. Масове керування псевдонімами {#3-bulk-alias-management}

Потрібно створити 20 псевдонімів для нового проєкту? Опишіть, що вам потрібно, і дозвольте AI виконати рутинну роботу. Він може створити псевдоніми, встановити правила переадресації та згенерувати паролі за один раз.
### 4. Моніторинг Email Кампаній {#4-email-campaign-monitoring}

Попросіть вашого AI перевірити ліміти відправлення, показати останні вихідні листи та звітувати про статус доставки. Корисно для моніторингу стану транзакційних листів.

### 5. Синхронізація та Очищення Контактів {#5-contact-sync-and-cleanup}

Використовуйте інструменти CardDAV для виведення всіх контактів, пошуку дублікатів, оновлення застарілої інформації або масового створення контактів зі вставленої у чат таблиці. *(Потрібні облікові дані аліасу.)*

### 6. Управління Календарем {#6-calendar-management}

Створюйте календарі, додавайте події, оновлюйте час зустрічей та видаляйте скасовані події — все через розмову. Інструменти CalDAV підтримують повний CRUD як для календарів, так і для подій. *(Потрібні облікові дані аліасу.)*

### 7. Автоматизація Sieve Скриптів {#7-sieve-script-automation}

Sieve скрипти потужні, але синтаксис складний. Попросіть вашого AI написати Sieve скрипти для вас: "Відфільтрувати всі листи від <billing@example.com> у папку Billing" стане робочим скриптом без необхідності вивчати специфікацію RFC 5228.

### 8. Вступ у Команду {#8-team-onboarding}

Коли до команди приєднується новий учасник, попросіть AI створити для нього аліас, згенерувати пароль, надіслати вітального листа з обліковими даними та додати його як члена домену. Один запит — чотири API виклики.

### 9. Аудит Безпеки {#9-security-auditing}

Попросіть вашого AI вивести всі домени, перевірити статус верифікації DNS, переглянути конфігурації аліасів та виявити домени з неперевіреними записами. Швидкий аудит безпеки природною мовою.

### 10. Налаштування Пересилання Листів {#10-email-forwarding-setup}

Налаштовуєте пересилання листів для нового домену? Попросіть AI створити домен, додати пересилальні аліаси, зашифрувати DNS записи та перевірити правильність конфігурації.

### 11. Пошук та Аналіз Вхідних {#11-inbox-search-and-analysis}

Використовуйте інструменти пошуку повідомлень, щоб знайти конкретні листи: "Знайти всі листи від <john@example.com> за останні 30 днів з вкладеннями." Понад 15 параметрів пошуку роблять це потужним. *(Потрібні облікові дані аліасу.)*

### 12. Організація Папок {#12-folder-organization}

Попросіть вашого AI створити структуру папок для нового проєкту, перемістити повідомлення між папками або очистити старі папки, які більше не потрібні. *(Потрібні облікові дані аліасу.)*

### 13. Ротація Паролів {#13-password-rotation}

Генеруйте нові паролі для аліасів за розкладом. Попросіть вашого AI згенерувати новий пароль для кожного аліасу та повідомити нові облікові дані.

### 14. Шифрування DNS Записів {#14-dns-record-encryption}

Зашифруйте ваші пересилальні записи перед додаванням у DNS. Інструмент `encryptRecord` робить це без автентифікації — корисно для швидкого одноразового шифрування.

### 15. Аналіз Логів Доставки {#15-delivery-log-analysis}

Завантажте логи доставки листів і попросіть AI проаналізувати рівень відмов, виявити проблемних отримувачів або відстежити час доставки.

### 16. Управління Багатьма Доменами {#16-multi-domain-management}

Якщо ви керуєте кількома доменами, попросіть AI надати звіт про статус: які домени верифіковані, які мають проблеми, скільки аліасів у кожного та які ліміти відправлення.

### 17. Налаштування Catch-All {#17-catch-all-configuration}

Налаштуйте catch-all паролі для доменів, які повинні приймати листи на будь-яку адресу. AI може створювати, виводити список та керувати цими паролями для вас.

### 18. Управління Запрошеннями до Домену {#18-domain-invite-management}

Запрошуйте членів команди керувати доменами, перевіряйте очікуючі запрошення та очищуйте прострочені. Корисно для організацій з кількома адміністраторами доменів.

### 19. Тестування S3 Сховища {#19-s3-storage-testing}

Якщо ви використовуєте кастомне S3 сховище для резервних копій листів, попросіть AI протестувати з’єднання та перевірити його працездатність.

### 20. Створення Чернеток Листів {#20-email-draft-composition}

Створюйте чернетки листів у вашій поштовій скриньці без їх відправлення. Корисно для підготовки листів, які потребують перевірки перед відправкою, або для створення шаблонів листів. *(Потрібні облікові дані аліасу.)*


## Приклади Запитів {#example-prompts}

Ось запити, які ви можете використовувати безпосередньо з вашим AI асистентом:

**Відправка листа:**

> "Надішліть листа з <hello@mydomain.com> на <john@example.com> з темою 'Зустріч завтра' та текстом 'Привіт, Джон, чи все ще домовились на 14:00?'"
**Управління доменами:**

> "Перелічіть усі мої домени та скажіть, у яких з них є непідтверджені DNS-записи."

**Створення псевдоніма:**

> "Створіть новий псевдонім <support@mydomain.com>, який пересилає на мою особисту електронну пошту."

**Пошук у вхідних (потрібні облікові дані псевдоніма):**

> "Знайдіть усі непрочитані листи за останній тиждень, у яких згадується 'invoice'."

**Календар (потрібні облікові дані псевдоніма):**

> "Створіть календар під назвою 'Робота' та додайте зустріч на завтра о 14:00 під назвою 'Team Standup'."

**Скрипти Sieve:**

> "Напишіть скрипт Sieve для <info@mydomain.com>, який автоматично відповідає на листи повідомленням 'Дякуємо за звернення, ми зв’яжемося з вами протягом 24 годин.'"

**Масові операції:**

> "Створіть псевдоніми для sales@, support@, billing@ та info@ на mydomain.com, усі пересилають на <team@mydomain.com>."

**Перевірка безпеки:**

> "Перевірте статус верифікації DNS та SMTP для всіх моїх доменів і скажіть, чи щось потребує уваги."

**Генерація пароля для псевдоніма:**

> "Згенеруйте пароль для псевдоніма <user@example.com>, щоб я міг отримати доступ до своєї поштової скриньки."


## Змінні середовища {#environment-variables}

| Змінна                         | Обов’язково | За замовчуванням               | Опис                                                                           |
| ------------------------------ | ----------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Так         | —                              | Ваш ключ API Forward Email (використовується як ім’я користувача Basic auth для кінцевих точок API) |
| `FORWARD_EMAIL_ALIAS_USER`     | Ні          | —                              | Адреса електронної пошти псевдоніма для кінцевих точок поштової скриньки (наприклад, `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Ні          | —                              | Згенерований пароль псевдоніма для кінцевих точок поштової скриньки             |
| `FORWARD_EMAIL_API_URL`        | Ні          | `https://api.forwardemail.net` | Базова URL API (для самохостингу або тестування)                               |


## Безпека {#security}

Сервер MCP працює локально на вашому комп’ютері. Ось як працює безпека:

* **Ваші облікові дані залишаються локальними.** Ваш ключ API та облікові дані псевдоніма зчитуються зі змінних середовища і використовуються для автентифікації API-запитів через HTTP Basic auth. Вони ніколи не надсилаються до AI-моделі.
* **Транспорт stdio.** Сервер спілкується з AI-клієнтом через stdin/stdout. Мережеві порти не відкриваються.
* **Відсутність збереження даних.** Сервер є безстанним. Він не кешує, не веде журнал і не зберігає жодних ваших даних електронної пошти.
* **Відкритий код.** Весь код розміщено на [GitHub](https://github.com/forwardemail/mcp-server). Ви можете перевірити кожен рядок.


## Програмне використання {#programmatic-usage}

Ви також можете використовувати сервер як бібліотеку:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Відкритий код {#open-source}

Forward Email MCP Server є [відкритим кодом на GitHub](https://github.com/forwardemail/mcp-server) під ліцензією BUSL-1.1. Ми віримо у прозорість. Якщо ви знайдете помилку або хочете нову функцію, [відкрийте issue](https://github.com/forwardemail/mcp-server/issues).
