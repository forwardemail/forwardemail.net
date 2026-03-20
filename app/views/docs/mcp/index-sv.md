# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Vår <a href="https://github.com/forwardemail/mcp-server">öppen källkod MCP-server</a> låter AI-assistenter som Claude, ChatGPT, Cursor och Windsurf hantera din e-post, domäner, alias, kontakter och kalendrar via naturligt språk. Alla 68 API-endpoints exponeras som MCP-verktyg. Den körs lokalt via <code>npx @forwardemail/mcp-server</code> — dina inloggningsuppgifter lämnar aldrig din dator.
</p>


## Innehållsförteckning {#table-of-contents}

* [Vad är MCP?](#what-is-mcp)
* [Snabbstart](#quick-start)
  * [Skaffa en API-nyckel](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andra MCP-klienter](#other-mcp-clients)
* [Autentisering](#authentication)
  * [API-nyckelautentisering](#api-key-auth)
  * [Aliasautentisering](#alias-auth)
  * [Generera ett aliaslösenord](#generating-an-alias-password)
* [Alla 68 verktyg](#all-68-tools)
  * [Konto (API-nyckel eller aliasautentisering)](#account-api-key-or-alias-auth)
  * [Domäner (API-nyckel)](#domains-api-key)
  * [Alias (API-nyckel)](#aliases-api-key)
  * [E-post — Utgående SMTP (API-nyckel; Send stödjer båda)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Meddelanden — IMAP (Aliasautentisering)](#messages--imap-alias-auth)
  * [Mappar — IMAP (Aliasautentisering)](#folders--imap-alias-auth)
  * [Kontakter — CardDAV (Aliasautentisering)](#contacts--carddav-alias-auth)
  * [Kalendrar — CalDAV (Aliasautentisering)](#calendars--caldav-alias-auth)
  * [Kalenderhändelser — CalDAV (Aliasautentisering)](#calendar-events--caldav-alias-auth)
  * [Sieve-skript (API-nyckel)](#sieve-scripts-api-key)
  * [Sieve-skript (Aliasautentisering)](#sieve-scripts-alias-auth)
  * [Domänmedlemmar och inbjudningar (API-nyckel)](#domain-members-and-invites-api-key)
  * [Catch-All-lösenord (API-nyckel)](#catch-all-passwords-api-key)
  * [Loggar (API-nyckel)](#logs-api-key)
  * [Kryptera (Ingen autentisering)](#encrypt-no-auth)
* [20 verkliga användningsfall](#20-real-world-use-cases)
  * [1. E-postsortering](#1-email-triage)
  * [2. Automatisering av domäninställning](#2-domain-setup-automation)
  * [3. Masshantering av alias](#3-bulk-alias-management)
  * [4. Övervakning av e-postkampanjer](#4-email-campaign-monitoring)
  * [5. Synkronisering och rensning av kontakter](#5-contact-sync-and-cleanup)
  * [6. Kalenderhantering](#6-calendar-management)
  * [7. Automatisering av Sieve-skript](#7-sieve-script-automation)
  * [8. Teamintroduktion](#8-team-onboarding)
  * [9. Säkerhetsgranskning](#9-security-auditing)
  * [10. Inställning av e-postvidarebefordran](#10-email-forwarding-setup)
  * [11. Sökning och analys i inkorgen](#11-inbox-search-and-analysis)
  * [12. Mapporganisation](#12-folder-organization)
  * [13. Lösenordsrotation](#13-password-rotation)
  * [14. Kryptering av DNS-poster](#14-dns-record-encryption)
  * [15. Analys av leveransloggar](#15-delivery-log-analysis)
  * [16. Hantering av flera domäner](#16-multi-domain-management)
  * [17. Catch-All-konfiguration](#17-catch-all-configuration)
  * [18. Hantering av domäninbjudningar](#18-domain-invite-management)
  * [19. Testning av S3-lagring](#19-s3-storage-testing)
  * [20. Komposition av e-postutkast](#20-email-draft-composition)
* [Exempel på promptar](#example-prompts)
* [Miljövariabler](#environment-variables)
* [Säkerhet](#security)
* [Programmatisk användning](#programmatic-usage)
* [Öppen källkod](#open-source)


## Vad är MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) är en öppen standard skapad av Anthropic som låter AI-modeller säkert anropa externa verktyg. Istället för att kopiera och klistra in API-svar i ett chattfönster ger MCP modellen direkt, strukturerad åtkomst till dina tjänster.

Vår MCP-server omsluter hela [Forward Email API](/email-api) — varje endpoint, varje parameter — och exponerar dem som verktyg som vilken MCP-kompatibel klient som helst kan använda. Servern körs lokalt på din dator med stdio-transport. Dina inloggningsuppgifter stannar i dina miljövariabler och skickas aldrig till AI-modellen.


## Snabbstart {#quick-start}

### Skaffa en API-nyckel {#get-an-api-key}
1. Logga in på ditt [Forward Email-konto](/my-account/domains).
2. Gå till **Mitt konto** → **Säkerhet** → **API-nycklar**.
3. Generera en ny API-nyckel och kopiera den.

### Claude Desktop {#claude-desktop}

Lägg till detta i din Claude Desktop-konfigurationsfil:

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

Starta om Claude Desktop. Du bör se Forward Email-verktygen i verktygsvalet.

> **Notera:** Variablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD` är valfria men krävs för mailbox-verktyg (meddelanden, mappar, kontakter, kalendrar). Se [Autentisering](#authentication) för detaljer.

### Cursor {#cursor}

Öppna Cursor-inställningar → MCP → Lägg till server:

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

Öppna Windsurf-inställningar → MCP → Lägg till server med samma konfiguration som ovan.

### Andra MCP-klienter {#other-mcp-clients}

Alla klienter som stödjer MCP stdio-transport fungerar. Kommandot är:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentisering {#authentication}

Forward Email API använder **HTTP Basic-autentisering** med två olika typer av autentiseringsuppgifter beroende på slutpunkt. MCP-servern hanterar detta automatiskt — du behöver bara tillhandahålla rätt uppgifter.

### API-nyckelautentisering {#api-key-auth}

De flesta administrationsslutpunkter (domäner, alias, utgående e-post, loggar) använder din **API-nyckel** som Basic auth-användarnamn med ett tomt lösenord.

Detta är samma API-nyckel som du använder för REST API:et. Sätt den via miljövariabeln `FORWARD_EMAIL_API_KEY`.

### Aliasautentisering {#alias-auth}

Mailbox-slutpunkter (meddelanden, mappar, kontakter, kalendrar, alias-specifika sieve-skript) använder **aliasuppgifter** — aliasets e-postadress som användarnamn och ett genererat lösenord som lösenord.

Dessa slutpunkter får åtkomst till data per alias via IMAP, CalDAV och CardDAV-protokollen. De kräver aliasets e-post och ett genererat lösenord, inte API-nyckeln.

Du kan ange aliasuppgifter på två sätt:

1. **Miljövariabler** (rekommenderas för standardalias): Sätt `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametrar per verktygsanrop**: Skicka `alias_username` och `alias_password` som argument till vilket alias-autentiseringsverktyg som helst. Dessa åsidosätter miljövariablerna, vilket är användbart när du arbetar med flera alias.

### Generera ett aliaslösenord {#generating-an-alias-password}

Innan du kan använda alias-autentiseringsverktyg måste du generera ett lösenord för aliaset. Du kan göra detta med verktyget `generateAliasPassword` eller via API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Svaret inkluderar fälten `username` (aliasets e-post) och `password`. Använd dessa som dina aliasuppgifter.

> **Tips:** Du kan också fråga din AI-assistent: *"Generera ett lösenord för aliaset <user@example.com> på domänen example.com"* — den kommer att anropa verktyget `generateAliasPassword` och returnera uppgifterna.

Tabellen nedan sammanfattar vilken autentiseringsmetod varje verktygsgrupp kräver:

| Verktygsgrupp                                                  | Autentiseringsmetod       | Uppgifter                                                  |
| -------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Konto                                                          | API-nyckel **eller** Alias | Antingen                                                   |
| Domäner, Alias, Domänmedlemmar, Inbjudningar, Catch-All-lösenord | API-nyckel                | `FORWARD_EMAIL_API_KEY`                                    |
| Utgående e-post (lista, hämta, ta bort, begränsa)              | API-nyckel                | `FORWARD_EMAIL_API_KEY`                                    |
| Skicka e-post                                                  | API-nyckel **eller** Alias | Antingen                                                   |
| Meddelanden (IMAP)                                             | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mappar (IMAP)                                                  | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakter (CardDAV)                                            | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendrar (CalDAV)                                            | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderhändelser (CalDAV)                                    | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-skript (domän-specifika)                                | API-nyckel                | `FORWARD_EMAIL_API_KEY`                                    |
| Sieve-skript (alias-specifika)                                | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Loggar                                                        | API-nyckel                | `FORWARD_EMAIL_API_KEY`                                    |
| Kryptera                                                      | Ingen                     | Inga uppgifter behövs                                      |
## Alla 68 Verktyg {#all-68-tools}

Varje verktyg motsvarar direkt en [Forward Email API](/email-api) endpoint. Parametrarna använder samma namn som i API-dokumentationen. Autentiseringsmetoden anges i varje avsnitts rubrik.

### Konto (API-nyckel eller Alias-autentisering) {#account-api-key-or-alias-auth}

Med API-nyckelautentisering returnerar dessa din användarkontoinformation. Med aliasautentisering returnerar de alias-/brevlådeinformation inklusive lagringskvot och inställningar.

| Verktyg          | API Endpoint      | Beskrivning                  |
| ---------------  | ----------------- | ---------------------------- |
| `getAccount`     | `GET /v1/account` | Hämta din kontoinformation   |
| `updateAccount`  | `PUT /v1/account` | Uppdatera dina kontoinställningar |

### Domäner (API-nyckel) {#domains-api-key}

| Verktyg              | API Endpoint                                     | Beskrivning               |
| -------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`        | `GET /v1/domains`                                | Lista alla dina domäner   |
| `createDomain`       | `POST /v1/domains`                               | Lägg till en ny domän     |
| `getDomain`          | `GET /v1/domains/:domain_id`                     | Hämta domändetaljer       |
| `updateDomain`       | `PUT /v1/domains/:domain_id`                     | Uppdatera domäninställningar |
| `deleteDomain`       | `DELETE /v1/domains/:domain_id`                  | Ta bort en domän          |
| `verifyDomainRecords`| `GET /v1/domains/:domain_id/verify-records`      | Verifiera DNS-poster      |
| `verifySmtpRecords`  | `GET /v1/domains/:domain_id/verify-smtp`         | Verifiera SMTP-konfiguration |
| `testS3Connection`   | `POST /v1/domains/:domain_id/test-s3-connection` | Testa anpassad S3-lagring |

### Alias (API-nyckel) {#aliases-api-key}

| Verktyg                  | API Endpoint                                                      | Beskrivning                                |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`            | `GET /v1/domains/:domain_id/aliases`                              | Lista alias för en domän                    |
| `createAlias`            | `POST /v1/domains/:domain_id/aliases`                             | Skapa ett nytt alias                       |
| `getAlias`               | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Hämta aliasdetaljer                        |
| `updateAlias`            | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Uppdatera ett alias                        |
| `deleteAlias`            | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Ta bort ett alias                          |
| `generateAliasPassword`  | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generera IMAP/SMTP-lösenord för aliasautentisering |

### E-post — Utgående SMTP (API-nyckel; Send stödjer båda) {#emails--outbound-smtp-api-key-send-supports-both}

| Verktyg          | API Endpoint            | Autentisering         | Beskrivning                  |
| ---------------  | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`      | `POST /v1/emails`       | API-nyckel eller Alias-autentisering | Skicka ett e-postmeddelande via SMTP |
| `listEmails`     | `GET /v1/emails`        | API-nyckel            | Lista utgående e-postmeddelanden |
| `getEmail`       | `GET /v1/emails/:id`    | API-nyckel            | Hämta e-postdetaljer och status |
| `deleteEmail`    | `DELETE /v1/emails/:id` | API-nyckel            | Ta bort ett köat e-postmeddelande |
| `getEmailLimit`  | `GET /v1/emails/limit`  | API-nyckel            | Kontrollera din sändningsgräns |

Verktyget `sendEmail` accepterar `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` och `attachments`. Detta är samma som endpointen `POST /v1/emails`.

### Meddelanden — IMAP (Alias-autentisering) {#messages--imap-alias-auth}

> **Kräver aliasuppgifter.** Skicka med `alias_username` och `alias_password` eller sätt miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Verktyg          | API-slutpunkt             | Beskrivning                          |
| ---------------  | -------------------------| ----------------------------------- |
| `listMessages`   | `GET /v1/messages`        | Lista och sök meddelanden i en brevlåda |
| `createMessage`  | `POST /v1/messages`       | Skapa ett utkast eller ladda upp ett meddelande |
| `getMessage`     | `GET /v1/messages/:id`    | Hämta ett meddelande via ID        |
| `updateMessage`  | `PUT /v1/messages/:id`    | Uppdatera flaggor (läst, markerad, etc.) |
| `deleteMessage`  | `DELETE /v1/messages/:id` | Ta bort ett meddelande              |

Verktyget `listMessages` stödjer 15+ sökparametrar inklusive `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` och `has_attachment`. Se [API docs](/email-api) för hela listan.

### Mappar — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Kräver aliasuppgifter.** Skicka med `alias_username` och `alias_password` eller sätt miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg          | API-slutpunkt             | Beskrivning              |
| ---------------- | ------------------------- | ------------------------ |
| `listFolders`    | `GET /v1/folders`         | Lista alla brevlåde-mappar |
| `createFolder`   | `POST /v1/folders`        | Skapa en ny mapp         |
| `getFolder`      | `GET /v1/folders/:id`     | Hämta mappdetaljer       |
| `updateFolder`   | `PUT /v1/folders/:id`     | Byt namn på en mapp      |
| `deleteFolder`   | `DELETE /v1/folders/:id`  | Ta bort en mapp          |

### Kontakter — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Kräver aliasuppgifter.** Skicka med `alias_username` och `alias_password` eller sätt miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg          | API-slutpunkt             | Beskrivning          |
| ---------------- | ------------------------- | -------------------- |
| `listContacts`   | `GET /v1/contacts`        | Lista alla kontakter |
| `createContact`  | `POST /v1/contacts`       | Skapa en ny kontakt  |
| `getContact`     | `GET /v1/contacts/:id`    | Hämta kontaktuppgifter |
| `updateContact`  | `PUT /v1/contacts/:id`    | Uppdatera en kontakt  |
| `deleteContact`  | `DELETE /v1/contacts/:id` | Ta bort en kontakt    |

### Kalendrar — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Kräver aliasuppgifter.** Skicka med `alias_username` och `alias_password` eller sätt miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg           | API-slutpunkt             | Beskrivning           |
| ----------------- | ------------------------- | --------------------- |
| `listCalendars`   | `GET /v1/calendars`       | Lista alla kalendrar  |
| `createCalendar`  | `POST /v1/calendars`      | Skapa en ny kalender  |
| `getCalendar`     | `GET /v1/calendars/:id`   | Hämta kalenderdetaljer |
| `updateCalendar`  | `PUT /v1/calendars/:id`   | Uppdatera en kalender  |
| `deleteCalendar`  | `DELETE /v1/calendars/:id`| Ta bort en kalender    |

### Kalenderhändelser — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Kräver aliasuppgifter.** Skicka med `alias_username` och `alias_password` eller sätt miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg                | API-slutpunkt                 | Beskrivning          |
| --------------------- | -----------------------------| -------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`     | Lista alla händelser |
| `createCalendarEvent` | `POST /v1/calendar-events`    | Skapa en ny händelse |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id` | Hämta händelsedetaljer |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Uppdatera en händelse |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Ta bort en händelse |

### Sieve-skript (API-nyckel) {#sieve-scripts-api-key}

Dessa använder domänspecifika sökvägar och autentiserar med din API-nyckel.

| Verktyg                | API-slutpunkt                                                            | Beskrivning               |
| --------------------- | ------------------------------------------------------------------------ | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                    | Lista skript för ett alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                   | Skapa ett nytt skript      |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`         | Hämta skriptdetaljer       |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`         | Uppdatera ett skript       |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`      | Ta bort ett skript         |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktivera ett skript        |
### Sieve Scripts (Alias Auth) {#sieve-scripts-alias-auth}

Dessa använder alias-nivå autentisering. Användbart för automatisering per alias utan att behöva API-nyckeln.

> **Kräver aliasuppgifter.** Skicka `alias_username` och `alias_password` eller sätt miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg                        | API Endpoint                                 | Beskrivning        |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Lista skript       |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Skapa ett skript   |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Hämta skriptinformation |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Uppdatera ett skript |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Ta bort ett skript |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivera ett skript |

### Domain Members and Invites (API Key) {#domain-members-and-invites-api-key}

| Verktyg               | API Endpoint                                       | Beskrivning                |
| --------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`    | Ändra en medlems roll      |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Ta bort en medlem          |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`               | Acceptera en väntande inbjudan |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`              | Bjud in någon till en domän |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`            | Återkalla en inbjudan      |

### Catch-All Passwords (API Key) {#catch-all-passwords-api-key}

| Verktyg                   | API Endpoint                                                  | Beskrivning                 |
| ------------------------- | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`   | `GET /v1/domains/:domain_id/catch-all-passwords`              | Lista catch-all-lösenord    |
| `createCatchAllPassword`  | `POST /v1/domains/:domain_id/catch-all-passwords`             | Skapa ett catch-all-lösenord |
| `deleteCatchAllPassword`  | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Ta bort ett catch-all-lösenord |

### Logs (API Key) {#logs-api-key}

| Verktyg         | API Endpoint            | Beskrivning                  |
| --------------- | ----------------------- | ---------------------------- |
| `downloadLogs`  | `GET /v1/logs/download` | Ladda ner loggar för e-postleverans |

### Encrypt (No Auth) {#encrypt-no-auth}

| Verktyg          | API Endpoint       | Beskrivning              |
| ---------------- | ------------------ | ------------------------ |
| `encryptRecord`  | `POST /v1/encrypt` | Kryptera en DNS TXT-post |

Detta verktyg kräver ingen autentisering. Det krypterar vidarebefordringsposter som `forward-email=user@example.com` för användning i DNS TXT-poster.


## 20 Real-World Use Cases {#20-real-world-use-cases}

Här är praktiska sätt att använda MCP-servern med din AI-assistent:

### 1. Email Triage {#1-email-triage}

Be din AI att skanna din inkorg och sammanfatta olästa meddelanden. Den kan markera brådskande e-post, kategorisera efter avsändare och utarbeta svar — allt via naturligt språk. *(Kräver aliasuppgifter för åtkomst till inkorgen.)*

### 2. Domain Setup Automation {#2-domain-setup-automation}

Ska du sätta upp en ny domän? Be AI:n skapa domänen, lägga till dina alias, verifiera DNS-poster och testa SMTP-konfigurationen. Vad som normalt tar 10 minuter av klickande i kontrollpaneler blir en enda konversation.

### 3. Bulk Alias Management {#3-bulk-alias-management}

Behöver du skapa 20 alias för ett nytt projekt? Beskriv vad du behöver så sköter AI:n det repetitiva arbetet. Den kan skapa alias, ställa in vidarebefordringsregler och generera lösenord på en gång.
### 4. Övervakning av e-postkampanjer {#4-email-campaign-monitoring}

Be din AI att kontrollera sändningsgränser, lista senaste utgående e-postmeddelanden och rapportera leveransstatus. Användbart för att övervaka hälsan hos transaktionella e-postmeddelanden.

### 5. Synkronisering och rensning av kontakter {#5-contact-sync-and-cleanup}

Använd CardDAV-verktygen för att lista alla kontakter, hitta dubbletter, uppdatera föråldrad information eller skapa kontakter i bulk från ett kalkylblad du klistrar in i chatten. *(Kräver aliasuppgifter.)*

### 6. Kalenderhantering {#6-calendar-management}

Skapa kalendrar, lägg till händelser, uppdatera mötestider och ta bort inställda händelser — allt via konversation. CalDAV-verktygen stödjer full CRUD på både kalendrar och händelser. *(Kräver aliasuppgifter.)*

### 7. Automatisering med Sieve-skript {#7-sieve-script-automation}

Sieve-skript är kraftfulla men syntaxen är svårbegriplig. Be din AI att skriva Sieve-skript åt dig: "Filtrera alla e-postmeddelanden från <billing@example.com> till en mapp som heter Billing" blir ett fungerande skript utan att du behöver röra RFC 5228-specifikationen.

### 8. Teamintroduktion {#8-team-onboarding}

När en ny teammedlem börjar, be AI:n skapa deras alias, generera ett lösenord, skicka ett välkomstmail med deras uppgifter och lägga till dem som domänmedlem. En prompt, fyra API-anrop.

### 9. Säkerhetsgranskning {#9-security-auditing}

Be din AI lista alla domäner, kontrollera DNS-verifieringsstatus, granska alias-konfigurationer och identifiera domäner med ov verifierade poster. En snabb säkerhetssvep på naturligt språk.

### 10. Inställning av e-postvidarebefordran {#10-email-forwarding-setup}

Ska du ställa in e-postvidarebefordran för en ny domän? Be AI:n skapa domänen, lägga till vidarebefordringsalias, kryptera DNS-posterna och verifiera att allt är korrekt konfigurerat.

### 11. Sökning och analys i inkorgen {#11-inbox-search-and-analysis}

Använd meddelandesökningsverktygen för att hitta specifika e-postmeddelanden: "Hitta alla e-postmeddelanden från <john@example.com> under de senaste 30 dagarna som har bilagor." De 15+ sökparametrarna gör detta kraftfullt. *(Kräver aliasuppgifter.)*

### 12. Mapporganisation {#12-folder-organization}

Be din AI skapa en mappstruktur för ett nytt projekt, flytta meddelanden mellan mappar eller rensa gamla mappar du inte längre behöver. *(Kräver aliasuppgifter.)*

### 13. Lösenordsrotation {#13-password-rotation}

Generera nya aliaslösenord enligt schema. Be din AI skapa ett nytt lösenord för varje alias och rapportera de nya uppgifterna.

### 14. Kryptering av DNS-poster {#14-dns-record-encryption}

Kryptera dina vidarebefordringsposter innan du lägger till dem i DNS. `encryptRecord`-verktyget hanterar detta utan autentisering — användbart för snabba engångskrypteringar.

### 15. Analys av leveransloggar {#15-delivery-log-analysis}

Ladda ner dina e-postleveransloggar och be AI:n analysera studsfrekvenser, identifiera problematiska mottagare eller spåra leveranstider.

### 16. Hantering av flera domäner {#16-multi-domain-management}

Om du hanterar flera domäner, be AI:n ge dig en statusrapport: vilka domäner som är verifierade, vilka som har problem, hur många alias varje har och hur sändningsgränserna ser ut.

### 17. Konfiguration av catch-all {#17-catch-all-configuration}

Ställ in catch-all-lösenord för domäner som behöver ta emot e-post på vilken adress som helst. AI:n kan skapa, lista och hantera dessa lösenord åt dig.

### 18. Hantering av domäninbjudningar {#18-domain-invite-management}

Bjud in teammedlemmar att hantera domäner, kontrollera väntande inbjudningar och rensa utgångna. Användbart för organisationer med flera domänadministratörer.

### 19. Test av S3-lagring {#19-s3-storage-testing}

Om du använder anpassad S3-lagring för e-postbackup, be AI:n testa anslutningen och verifiera att den fungerar korrekt.

### 20. Komposition av e-postutkast {#20-email-draft-composition}

Skapa e-postutkast i din brevlåda utan att skicka dem. Användbart för att förbereda e-post som behöver granskas innan de skickas, eller för att bygga e-postmallar. *(Kräver aliasuppgifter.)*


## Exempel på prompts {#example-prompts}

Här är prompts du kan använda direkt med din AI-assistent:

**Skicka e-post:**

> "Skicka ett e-postmeddelande från <hello@mydomain.com> till <john@example.com> med ämnet 'Möte imorgon' och innehållet 'Hej John, är vi fortfarande på för kl 14?'"
**Domänhantering:**

> "Lista alla mina domäner och berätta vilka som har overifierade DNS-poster."

**Alias skapande:**

> "Skapa ett nytt alias <support@mydomain.com> som vidarebefordrar till min personliga e-post."

**Inkorgssökning (kräver aliasuppgifter):**

> "Hitta alla olästa mejl från den senaste veckan som nämner 'faktura'."

**Kalender (kräver aliasuppgifter):**

> "Skapa en kalender som heter 'Arbete' och lägg till ett möte imorgon kl 14:00 som heter 'Team Standup'."

**Sieve-skript:**

> "Skriv ett Sieve-skript för <info@mydomain.com> som automatiskt svarar på mejl med 'Tack för att du hörde av dig, vi återkommer inom 24 timmar.'"

**Massoperationer:**

> "Skapa alias för sales@, support@, billing@ och info@ på mydomain.com, alla vidarebefordrar till <team@mydomain.com>."

**Säkerhetskontroll:**

> "Kontrollera DNS- och SMTP-verifieringsstatus för alla mina domäner och berätta om något behöver åtgärdas."

**Generera aliaslösenord:**

> "Generera ett lösenord för aliaset <user@example.com> så att jag kan komma åt min inkorg."


## Environment Variables {#environment-variables}

| Variable                       | Required | Default                        | Description                                                                    |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Ja       | —                              | Din Forward Email API-nyckel (används som Basic auth-användarnamn för API-nyckeländpunkter) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nej      | —                              | Alias e-postadress för brevlådeändpunkter (t.ex. `user@example.com`)           |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nej      | —                              | Genererat aliaslösenord för brevlådeändpunkter                                 |
| `FORWARD_EMAIL_API_URL`        | Nej      | `https://api.forwardemail.net` | API-bas-URL (för självhostat eller testning)                                  |


## Security {#security}

MCP-servern körs lokalt på din dator. Så här fungerar säkerheten:

* **Dina uppgifter stannar lokalt.** Både din API-nyckel och aliasuppgifter läses från miljövariabler och används för att autentisera API-förfrågningar via HTTP Basic auth. De skickas aldrig till AI-modellen.
* **stdio-transport.** Servern kommunicerar med AI-klienten via stdin/stdout. Inga nätverksportar öppnas.
* **Ingen datalagring.** Servern är stateless. Den cachar, loggar eller lagrar inga av dina e-postdata.
* **Öppen källkod.** Hela kodbasen finns på [GitHub](https://github.com/forwardemail/mcp-server). Du kan granska varje rad.


## Programmatic Usage {#programmatic-usage}

Du kan också använda servern som ett bibliotek:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Open Source {#open-source}

Forward Email MCP Server är [öppen källkod på GitHub](https://github.com/forwardemail/mcp-server) under BUSL-1.1-licensen. Vi tror på transparens. Om du hittar en bugg eller vill ha en funktion, [öppna ett ärende](https://github.com/forwardemail/mcp-server/issues).
