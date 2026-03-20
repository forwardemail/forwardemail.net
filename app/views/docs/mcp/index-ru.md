# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>Кратко:</strong> Наш <a href="https://github.com/forwardemail/mcp-server">открытый MCP сервер</a> позволяет AI-ассистентам, таким как Claude, ChatGPT, Cursor и Windsurf, управлять вашей электронной почтой, доменами, псевдонимами, контактами и календарями с помощью естественного языка. Все 68 API эндпоинтов доступны как MCP инструменты. Он запускается локально через <code>npx @forwardemail/mcp-server</code> — ваши учетные данные никогда не покидают ваше устройство.
</p>


## Содержание {#table-of-contents}

* [Что такое MCP?](#what-is-mcp)
* [Быстрый старт](#quick-start)
  * [Получить API ключ](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Другие MCP клиенты](#other-mcp-clients)
* [Аутентификация](#authentication)
  * [Аутентификация с API ключом](#api-key-auth)
  * [Аутентификация с псевдонимом](#alias-auth)
  * [Генерация пароля для псевдонима](#generating-an-alias-password)
* [Все 68 инструментов](#all-68-tools)
  * [Аккаунт (API ключ или аутентификация псевдонимом)](#account-api-key-or-alias-auth)
  * [Домены (API ключ)](#domains-api-key)
  * [Псевдонимы (API ключ)](#aliases-api-key)
  * [Почта — исходящий SMTP (API ключ; Send поддерживает оба)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Сообщения — IMAP (аутентификация псевдонимом)](#messages--imap-alias-auth)
  * [Папки — IMAP (аутентификация псевдонимом)](#folders--imap-alias-auth)
  * [Контакты — CardDAV (аутентификация псевдонимом)](#contacts--carddav-alias-auth)
  * [Календари — CalDAV (аутентификация псевдонимом)](#calendars--caldav-alias-auth)
  * [События календаря — CalDAV (аутентификация псевдонимом)](#calendar-events--caldav-alias-auth)
  * [Sieve скрипты (API ключ)](#sieve-scripts-api-key)
  * [Sieve скрипты (аутентификация псевдонимом)](#sieve-scripts-alias-auth)
  * [Участники домена и приглашения (API ключ)](#domain-members-and-invites-api-key)
  * [Пароли для catch-all (API ключ)](#catch-all-passwords-api-key)
  * [Логи (API ключ)](#logs-api-key)
  * [Шифрование (без аутентификации)](#encrypt-no-auth)
* [20 реальных сценариев использования](#20-real-world-use-cases)
  * [1. Сортировка почты](#1-email-triage)
  * [2. Автоматизация настройки домена](#2-domain-setup-automation)
  * [3. Массовое управление псевдонимами](#3-bulk-alias-management)
  * [4. Мониторинг email-кампаний](#4-email-campaign-monitoring)
  * [5. Синхронизация и очистка контактов](#5-contact-sync-and-cleanup)
  * [6. Управление календарем](#6-calendar-management)
  * [7. Автоматизация Sieve скриптов](#7-sieve-script-automation)
  * [8. Введение в команду](#8-team-onboarding)
  * [9. Аудит безопасности](#9-security-auditing)
  * [10. Настройка переадресации почты](#10-email-forwarding-setup)
  * [11. Поиск и анализ в почтовом ящике](#11-inbox-search-and-analysis)
  * [12. Организация папок](#12-folder-organization)
  * [13. Ротация паролей](#13-password-rotation)
  * [14. Шифрование DNS записей](#14-dns-record-encryption)
  * [15. Анализ логов доставки](#15-delivery-log-analysis)
  * [16. Управление несколькими доменами](#16-multi-domain-management)
  * [17. Конфигурация catch-all](#17-catch-all-configuration)
  * [18. Управление приглашениями в домен](#18-domain-invite-management)
  * [19. Тестирование S3 хранилища](#19-s3-storage-testing)
  * [20. Создание черновиков писем](#20-email-draft-composition)
* [Примеры запросов](#example-prompts)
* [Переменные окружения](#environment-variables)
* [Безопасность](#security)
* [Программное использование](#programmatic-usage)
* [Открытый исходный код](#open-source)


## Что такое MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) — это открытый стандарт, созданный Anthropic, который позволяет AI-моделям безопасно вызывать внешние инструменты. Вместо того чтобы копировать и вставлять ответы API в окно чата, MCP предоставляет модели прямой, структурированный доступ к вашим сервисам.

Наш MCP сервер оборачивает весь [Forward Email API](/email-api) — каждый эндпоинт, каждый параметр — и предоставляет их как инструменты, которые может использовать любой MCP-совместимый клиент. Сервер запускается локально на вашем устройстве с использованием stdio транспорта. Ваши учетные данные остаются в переменных окружения и никогда не отправляются AI модели.


## Быстрый старт {#quick-start}

### Получить API ключ {#get-an-api-key}
1. Войдите в свой [аккаунт Forward Email](/my-account/domains).
2. Перейдите в **Мой аккаунт** → **Безопасность** → **API ключи**.
3. Сгенерируйте новый API ключ и скопируйте его.

### Claude Desktop {#claude-desktop}

Добавьте это в файл конфигурации Claude Desktop:

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

Перезапустите Claude Desktop. В селекторе инструментов должны появиться инструменты Forward Email.

> **Примечание:** Переменные `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD` необязательны, но требуются для инструментов почтового ящика (сообщения, папки, контакты, календари). Подробнее смотрите в разделе [Аутентификация](#authentication).

### Cursor {#cursor}

Откройте Настройки Cursor → MCP → Добавить сервер:

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

Откройте Настройки Windsurf → MCP → Добавьте сервер с той же конфигурацией, что и выше.

### Другие MCP клиенты {#other-mcp-clients}

Любой клиент, поддерживающий MCP stdio транспорт, будет работать. Команда:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Аутентификация {#authentication}

API Forward Email использует **HTTP Basic аутентификацию** с двумя разными типами учетных данных в зависимости от конечной точки. MCP сервер обрабатывает это автоматически — вам нужно лишь предоставить правильные учетные данные.

### Аутентификация с API ключом {#api-key-auth}

Большинство управляющих конечных точек (домены, алиасы, исходящие письма, логи) используют ваш **API ключ** в качестве имени пользователя Basic auth с пустым паролем.

Это тот же API ключ, который вы используете для REST API. Установите его через переменную окружения `FORWARD_EMAIL_API_KEY`.

### Аутентификация с алиасом {#alias-auth}

Конечные точки почтового ящика (сообщения, папки, контакты, календари, скрипты sieve, привязанные к алиасу) используют **учетные данные алиаса** — адрес электронной почты алиаса в качестве имени пользователя и сгенерированный пароль в качестве пароля.

Эти конечные точки получают доступ к данным по каждому алиасу через протоколы IMAP, CalDAV и CardDAV. Им требуются адрес алиаса и сгенерированный пароль, а не API ключ.

Вы можете предоставить учетные данные алиаса двумя способами:

1. **Переменные окружения** (рекомендуется для алиаса по умолчанию): установите `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Параметры при вызове инструмента**: передайте `alias_username` и `alias_password` как аргументы любому инструменту с алиас-аутентификацией. Они переопределяют переменные окружения, что удобно при работе с несколькими алиасами.

### Генерация пароля для алиаса {#generating-an-alias-password}

Перед использованием инструментов с алиас-аутентификацией необходимо сгенерировать пароль для алиаса. Это можно сделать с помощью инструмента `generateAliasPassword` или через API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

В ответе будут поля `username` (email алиаса) и `password`. Используйте их как учетные данные алиаса.

> **Совет:** Вы также можете попросить вашего AI помощника: *"Сгенерируй пароль для алиаса <user@example.com> на домене example.com"* — он вызовет инструмент `generateAliasPassword` и вернет учетные данные.

В таблице ниже приведено, какой метод аутентификации требуется для каждой группы инструментов:

| Группа инструментов                                           | Метод аутентификации      | Учетные данные                                             |
| ------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| Аккаунт                                                      | API ключ **или** алиас   | Любой из них                                               |
| Домены, Алиасы, Члены домена, Приглашения, Пароли Catch-All  | API ключ                 | `FORWARD_EMAIL_API_KEY`                                    |
| Исходящие письма (список, получение, удаление, лимит)        | API ключ                 | `FORWARD_EMAIL_API_KEY`                                    |
| Отправка письма                                              | API ключ **или** алиас   | Любой из них                                               |
| Сообщения (IMAP)                                             | Алиас                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Папки (IMAP)                                                 | Алиас                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Контакты (CardDAV)                                           | Алиас                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Календари (CalDAV)                                           | Алиас                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| События календаря (CalDAV)                                  | Алиас                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Скрипты Sieve (привязанные к домену)                        | API ключ                 | `FORWARD_EMAIL_API_KEY`                                    |
| Скрипты Sieve (привязанные к алиасу)                        | Алиас                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Логи                                                        | API ключ                 | `FORWARD_EMAIL_API_KEY`                                    |
| Шифрование                                                 | Нет                      | Учетные данные не требуются                                |
## Все 68 инструментов {#all-68-tools}

Каждый инструмент напрямую соответствует конечной точке [Forward Email API](/email-api). Параметры используют те же имена, что и в документации API. Метод аутентификации указан в заголовке каждого раздела.

### Аккаунт (API Key или Alias Auth) {#account-api-key-or-alias-auth}

При аутентификации с помощью API ключа эти инструменты возвращают информацию о вашей учетной записи пользователя. При аутентификации через алиас они возвращают информацию об алиасе/почтовом ящике, включая квоту хранения и настройки.

| Инструмент       | Конечная точка API   | Описание                     |
| ---------------  | --------------------| ---------------------------- |
| `getAccount`     | `GET /v1/account`    | Получить информацию об аккаунте |
| `updateAccount`  | `PUT /v1/account`    | Обновить настройки аккаунта  |

### Домены (API Key) {#domains-api-key}

| Инструмент           | Конечная точка API                              | Описание                   |
| -------------------- | -----------------------------------------------| -------------------------- |
| `listDomains`        | `GET /v1/domains`                              | Список всех ваших доменов  |
| `createDomain`       | `POST /v1/domains`                             | Добавить новый домен       |
| `getDomain`          | `GET /v1/domains/:domain_id`                   | Получить детали домена     |
| `updateDomain`       | `PUT /v1/domains/:domain_id`                   | Обновить настройки домена  |
| `deleteDomain`       | `DELETE /v1/domains/:domain_id`                | Удалить домен              |
| `verifyDomainRecords`| `GET /v1/domains/:domain_id/verify-records`   | Проверить DNS записи       |
| `verifySmtpRecords`  | `GET /v1/domains/:domain_id/verify-smtp`      | Проверить конфигурацию SMTP|
| `testS3Connection`   | `POST /v1/domains/:domain_id/test-s3-connection` | Проверить подключение к кастомному S3 хранилищу |

### Алиасы (API Key) {#aliases-api-key}

| Инструмент              | Конечная точка API                                         | Описание                              |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                       | Список алиасов для домена            |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                      | Создать новый алиас                  |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`             | Получить детали алиаса               |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`             | Обновить алиас                      |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`          | Удалить алиас                      |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Сгенерировать пароль IMAP/SMTP для аутентификации алиаса |

### Электронные письма — исходящий SMTP (API Key; Send поддерживает оба) {#emails--outbound-smtp-api-key-send-supports-both}

| Инструмент       | Конечная точка API       | Аутентификация         | Описание                      |
| ---------------- | ------------------------| ---------------------- | ----------------------------- |
| `sendEmail`      | `POST /v1/emails`        | API Key или Alias Auth | Отправить письмо через SMTP   |
| `listEmails`     | `GET /v1/emails`         | API Key                | Список исходящих писем        |
| `getEmail`       | `GET /v1/emails/:id`     | API Key                | Получить детали и статус письма |
| `deleteEmail`    | `DELETE /v1/emails/:id`  | API Key                | Удалить письмо из очереди     |
| `getEmailLimit`  | `GET /v1/emails/limit`   | API Key                | Проверить лимит отправки      |

Инструмент `sendEmail` принимает параметры `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` и `attachments`. Это то же самое, что и конечная точка `POST /v1/emails`.

### Сообщения — IMAP (Alias Auth) {#messages--imap-alias-auth}

> **Требуются учетные данные алиаса.** Передайте `alias_username` и `alias_password` или установите переменные окружения `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Инструмент       | API Endpoint              | Описание                             |
| --------------- | ------------------------- | ----------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Список и поиск сообщений в почтовом ящике |
| `createMessage` | `POST /v1/messages`       | Создать черновик или загрузить сообщение |
| `getMessage`    | `GET /v1/messages/:id`    | Получить сообщение по ID            |
| `updateMessage` | `PUT /v1/messages/:id`    | Обновить флаги (прочитано, в избранном и т.д.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Удалить сообщение                   |

Инструмент `listMessages` поддерживает более 15 параметров поиска, включая `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` и `has_attachment`. См. [документацию API](/email-api) для полного списка.

### Папки — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Требуются учетные данные алиаса.** Передайте `alias_username` и `alias_password` или установите переменные окружения `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Инструмент      | API Endpoint             | Описание                 |
| --------------- | ------------------------ | ------------------------ |
| `listFolders`   | `GET /v1/folders`        | Список всех папок почтового ящика |
| `createFolder`  | `POST /v1/folders`       | Создать новую папку      |
| `getFolder`     | `GET /v1/folders/:id`    | Получить детали папки    |
| `updateFolder`  | `PUT /v1/folders/:id`    | Переименовать папку      |
| `deleteFolder`  | `DELETE /v1/folders/:id` | Удалить папку            |

### Контакты — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Требуются учетные данные алиаса.** Передайте `alias_username` и `alias_password` или установите переменные окружения `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Инструмент       | API Endpoint             | Описание              |
| ---------------- | ------------------------ | --------------------- |
| `listContacts`   | `GET /v1/contacts`       | Список всех контактов |
| `createContact`  | `POST /v1/contacts`      | Создать новый контакт |
| `getContact`     | `GET /v1/contacts/:id`   | Получить детали контакта |
| `updateContact`  | `PUT /v1/contacts/:id`   | Обновить контакт      |
| `deleteContact`  | `DELETE /v1/contacts/:id`| Удалить контакт       |

### Календарь — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Требуются учетные данные алиаса.** Передайте `alias_username` и `alias_password` или установите переменные окружения `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Инструмент        | API Endpoint              | Описание              |
| ----------------- | ------------------------- | --------------------- |
| `listCalendars`   | `GET /v1/calendars`       | Список всех календарей |
| `createCalendar`  | `POST /v1/calendars`      | Создать новый календарь |
| `getCalendar`     | `GET /v1/calendars/:id`   | Получить детали календаря |
| `updateCalendar`  | `PUT /v1/calendars/:id`   | Обновить календарь    |
| `deleteCalendar`  | `DELETE /v1/calendars/:id`| Удалить календарь     |

### События календаря — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Требуются учетные данные алиаса.** Передайте `alias_username` и `alias_password` или установите переменные окружения `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Инструмент             | API Endpoint                      | Описание             |
| ---------------------- | -------------------------------- | -------------------- |
| `listCalendarEvents`   | `GET /v1/calendar-events`         | Список всех событий  |
| `createCalendarEvent`  | `POST /v1/calendar-events`        | Создать новое событие |
| `getCalendarEvent`     | `GET /v1/calendar-events/:id`     | Получить детали события |
| `updateCalendarEvent`  | `PUT /v1/calendar-events/:id`     | Обновить событие     |
| `deleteCalendarEvent`  | `DELETE /v1/calendar-events/:id`  | Удалить событие      |

### Скрипты Sieve (API Key) {#sieve-scripts-api-key}

Используют пути с областью действия домена и аутентифицируются с помощью вашего API ключа.

| Инструмент             | API Endpoint                                                              | Описание                   |
| ---------------------- | ------------------------------------------------------------------------- | -------------------------- |
| `listSieveScripts`     | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Список скриптов для алиаса |
| `createSieveScript`    | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Создать новый скрипт       |
| `getSieveScript`       | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Получить детали скрипта    |
| `updateSieveScript`    | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Обновить скрипт            |
| `deleteSieveScript`    | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Удалить скрипт             |
| `activateSieveScript`  | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Активировать скрипт        |
### Скрипты Sieve (Аутентификация по псевдониму) {#sieve-scripts-alias-auth}

Эти скрипты используют аутентификацию на уровне псевдонима. Полезно для автоматизации по каждому псевдониму без необходимости использования API-ключа.

> **Требуются учетные данные псевдонима.** Передайте `alias_username` и `alias_password` или установите переменные окружения `FORWARD_EMAIL_ALIAS_USER` и `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Инструмент                    | API Endpoint                                 | Описание           |
| ----------------------------- | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`   | `GET /v1/sieve-scripts`                      | Список скриптов    |
| `createSieveScriptAliasAuth`  | `POST /v1/sieve-scripts`                     | Создать скрипт     |
| `getSieveScriptAliasAuth`     | `GET /v1/sieve-scripts/:script_id`           | Получить детали скрипта |
| `updateSieveScriptAliasAuth`  | `PUT /v1/sieve-scripts/:script_id`           | Обновить скрипт    |
| `deleteSieveScriptAliasAuth`  | `DELETE /v1/sieve-scripts/:script_id`        | Удалить скрипт     |
| `activateSieveScriptAliasAuth`| `POST /v1/sieve-scripts/:script_id/activate` | Активировать скрипт |

### Участники домена и приглашения (API-ключ) {#domain-members-and-invites-api-key}

| Инструмент             | API Endpoint                                       | Описание                  |
| ---------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`   | `PUT /v1/domains/:domain_id/members/:member_id`    | Изменить роль участника    |
| `removeDomainMember`   | `DELETE /v1/domains/:domain_id/members/:member_id` | Удалить участника          |
| `acceptDomainInvite`   | `GET /v1/domains/:domain_id/invites`               | Принять ожидающее приглашение |
| `createDomainInvite`   | `POST /v1/domains/:domain_id/invites`              | Пригласить в домен         |
| `removeDomainInvite`   | `DELETE /v1/domains/:domain_id/invites`            | Отозвать приглашение       |

### Пароли Catch-All (API-ключ) {#catch-all-passwords-api-key}

| Инструмент               | API Endpoint                                                  | Описание                   |
| ------------------------ | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Список паролей catch-all    |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Создать пароль catch-all    |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Удалить пароль catch-all    |

### Логи (API-ключ) {#logs-api-key}

| Инструмент     | API Endpoint            | Описание                      |
| -------------- | ----------------------- | ------------------------------ |
| `downloadLogs` | `GET /v1/logs/download` | Скачать логи доставки почты   |

### Шифрование (Без аутентификации) {#encrypt-no-auth}

| Инструмент      | API Endpoint       | Описание                  |
| --------------- | ------------------ | -------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | Зашифровать DNS TXT запись |

Этот инструмент не требует аутентификации. Он шифрует записи переадресации, например `forward-email=user@example.com`, для использования в DNS TXT записях.


## 20 Практических Сценариев Использования {#20-real-world-use-cases}

Вот практические способы использования MCP сервера с вашим AI помощником:

### 1. Сортировка почты {#1-email-triage}

Попросите AI просканировать ваш почтовый ящик и подвести итоги непрочитанных сообщений. Он может помечать срочные письма, классифицировать по отправителю и составлять черновики ответов — всё на естественном языке. *(Требуются учетные данные псевдонима для доступа к почтовому ящику.)*

### 2. Автоматизация настройки домена {#2-domain-setup-automation}

Настраиваете новый домен? Попросите AI создать домен, добавить ваши псевдонимы, проверить DNS-записи и протестировать конфигурацию SMTP. То, что обычно занимает 10 минут кликов по панели управления, становится одним разговором.

### 3. Массовое управление псевдонимами {#3-bulk-alias-management}

Нужно создать 20 псевдонимов для нового проекта? Опишите, что вам нужно, и позвольте AI выполнить рутинную работу. Он может создавать псевдонимы, устанавливать правила переадресации и генерировать пароли за один раз.
### 4. Мониторинг Email-кампаний {#4-email-campaign-monitoring}

Попросите вашего ИИ проверить лимиты отправки, вывести список последних исходящих писем и отчитаться о статусе доставки. Полезно для мониторинга состояния транзакционных писем.

### 5. Синхронизация и очистка контактов {#5-contact-sync-and-cleanup}

Используйте инструменты CardDAV для вывода всех контактов, поиска дубликатов, обновления устаревшей информации или массового создания контактов из таблицы, которую вы вставляете в чат. *(Требуются учетные данные алиаса.)*

### 6. Управление календарём {#6-calendar-management}

Создавайте календари, добавляйте события, обновляйте время встреч и удаляйте отменённые события — всё через диалог. Инструменты CalDAV поддерживают полный CRUD как для календарей, так и для событий. *(Требуются учетные данные алиаса.)*

### 7. Автоматизация скриптов Sieve {#7-sieve-script-automation}

Скрипты Sieve мощные, но синтаксис сложен. Попросите вашего ИИ написать скрипты Sieve для вас: «Отфильтровать все письма от <billing@example.com> в папку Billing» превратится в рабочий скрипт без необходимости разбираться в спецификации RFC 5228.

### 8. Ввод в команду {#8-team-onboarding}

Когда в команду приходит новый участник, попросите ИИ создать для него алиас, сгенерировать пароль, отправить приветственное письмо с учетными данными и добавить его в домен. Один запрос — четыре API вызова.

### 9. Аудит безопасности {#9-security-auditing}

Попросите ИИ вывести список всех доменов, проверить статус верификации DNS, просмотреть настройки алиасов и выявить домены с непроверенными записями. Быстрая проверка безопасности на естественном языке.

### 10. Настройка переадресации почты {#10-email-forwarding-setup}

Настраиваете переадресацию почты для нового домена? Попросите ИИ создать домен, добавить переадресационные алиасы, зашифровать DNS-записи и проверить правильность настройки.

### 11. Поиск и анализ в почтовом ящике {#11-inbox-search-and-analysis}

Используйте инструменты поиска сообщений для нахождения конкретных писем: «Найти все письма от <john@example.com> за последние 30 дней с вложениями». Более 15 параметров поиска делают это мощным инструментом. *(Требуются учетные данные алиаса.)*

### 12. Организация папок {#12-folder-organization}

Попросите ИИ создать структуру папок для нового проекта, переместить сообщения между папками или очистить старые папки, которые больше не нужны. *(Требуются учетные данные алиаса.)*

### 13. Ротация паролей {#13-password-rotation}

Генерируйте новые пароли для алиасов по расписанию. Попросите ИИ создать новый пароль для каждого алиаса и отчитаться о новых учетных данных.

### 14. Шифрование DNS-записей {#14-dns-record-encryption}

Зашифруйте ваши переадресационные записи перед добавлением их в DNS. Инструмент `encryptRecord` делает это без аутентификации — удобно для быстрой одноразовой шифровки.

### 15. Анализ логов доставки {#15-delivery-log-analysis}

Скачайте логи доставки почты и попросите ИИ проанализировать показатели отказов, выявить проблемных получателей или отследить время доставки.

### 16. Управление несколькими доменами {#16-multi-domain-management}

Если вы управляете несколькими доменами, попросите ИИ предоставить отчет о статусе: какие домены верифицированы, какие имеют проблемы, сколько алиасов у каждого и каковы лимиты отправки.

### 17. Настройка catch-all {#17-catch-all-configuration}

Настройте пароли catch-all для доменов, которые должны принимать почту на любой адрес. ИИ может создавать, выводить список и управлять этими паролями для вас.

### 18. Управление приглашениями в домен {#18-domain-invite-management}

Приглашайте членов команды для управления доменами, проверяйте ожидающие приглашения и очищайте просроченные. Полезно для организаций с несколькими администраторами доменов.

### 19. Тестирование хранилища S3 {#19-s3-storage-testing}

Если вы используете кастомное хранилище S3 для резервных копий почты, попросите ИИ проверить соединение и убедиться, что оно работает корректно.

### 20. Создание черновиков писем {#20-email-draft-composition}

Создавайте черновики писем в вашем почтовом ящике без отправки. Полезно для подготовки писем, которые нужно проверить перед отправкой, или для создания шаблонов писем. *(Требуются учетные данные алиаса.)*


## Примеры запросов {#example-prompts}

Вот запросы, которые вы можете использовать напрямую с вашим ИИ-ассистентом:

**Отправка письма:**

> "Отправь письмо с <hello@mydomain.com> на <john@example.com> с темой 'Встреча завтра' и текстом 'Привет, Джон, встречаемся ли мы в 14:00?'"
**Управление доменами:**

> "Перечисли все мои домены и скажи, у каких из них есть неподтверждённые DNS-записи."

**Создание алиаса:**

> "Создай новый алиас <support@mydomain.com>, который будет пересылать письма на мою личную почту."

**Поиск во входящих (требуются учётные данные алиаса):**

> "Найди все непрочитанные письма за последнюю неделю, в которых упоминается 'invoice'."

**Календарь (требуются учётные данные алиаса):**

> "Создай календарь под названием 'Work' и добавь встречу на завтра в 14:00 под названием 'Team Standup'."

**Скрипты Sieve:**

> "Напиши скрипт Sieve для <info@mydomain.com>, который автоматически отвечает на письма сообщением 'Спасибо за обращение, мы свяжемся с вами в течение 24 часов.'"

**Массовые операции:**

> "Создай алиасы для sales@, support@, billing@ и info@ на mydomain.com, все с пересылкой на <team@mydomain.com>."

**Проверка безопасности:**

> "Проверь статус верификации DNS и SMTP для всех моих доменов и скажи, если что-то требует внимания."

**Генерация пароля для алиаса:**

> "Сгенерируй пароль для алиаса <user@example.com>, чтобы я мог получить доступ к своему почтовому ящику."


## Переменные окружения {#environment-variables}

| Переменная                     | Обязательно | Значение по умолчанию          | Описание                                                                       |
| ------------------------------ | ----------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Да          | —                              | Ваш API-ключ Forward Email (используется как имя пользователя Basic auth для API) |
| `FORWARD_EMAIL_ALIAS_USER`     | Нет         | —                              | Адрес электронной почты алиаса для почтовых эндпоинтов (например, `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Нет         | —                              | Сгенерированный пароль алиаса для почтовых эндпоинтов                          |
| `FORWARD_EMAIL_API_URL`        | Нет         | `https://api.forwardemail.net` | Базовый URL API (для самостоятельного хостинга или тестирования)               |


## Безопасность {#security}

Сервер MCP запускается локально на вашем компьютере. Вот как работает безопасность:

* **Ваши учётные данные остаются локальными.** Ваш API-ключ и учётные данные алиаса считываются из переменных окружения и используются для аутентификации API-запросов через HTTP Basic auth. Они никогда не отправляются в модель ИИ.
* **Транспорт stdio.** Сервер общается с клиентом ИИ через stdin/stdout. Сетевые порты не открываются.
* **Отсутствие хранения данных.** Сервер не хранит состояние. Он не кэширует, не логирует и не сохраняет ваши почтовые данные.
* **Открытый исходный код.** Весь код доступен на [GitHub](https://github.com/forwardemail/mcp-server). Вы можете проверить каждую строку.


## Программное использование {#programmatic-usage}

Вы также можете использовать сервер как библиотеку:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Открытый исходный код {#open-source}

Forward Email MCP Server — это [открытый проект на GitHub](https://github.com/forwardemail/mcp-server) под лицензией BUSL-1.1. Мы верим в прозрачность. Если вы нашли ошибку или хотите предложить функцию, [создайте issue](https://github.com/forwardemail/mcp-server/issues).
