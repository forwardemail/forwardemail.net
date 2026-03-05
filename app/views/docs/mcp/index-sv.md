# Forward Email MCP-server

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Vår <a href="https://github.com/forwardemail/mcp-server">öppna MCP-server</a> låter AI-assistenter som Claude, ChatGPT, Cursor och Windsurf hantera din e-post, domäner, alias, kontakter och kalendrar genom naturligt språk. Alla 68 API-slutpunkter exponeras som MCP-verktyg. Den körs lokalt via <code>npx @forwardemail/mcp-server</code> – dina inloggningsuppgifter lämnar aldrig din maskin.
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
  * [E-post – Utgående SMTP (API-nyckel; Skicka stöder båda)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Meddelanden – IMAP (aliasautentisering)](#messages--imap-alias-auth)
  * [Mappar – IMAP (aliasautentisering)](#folders--imap-alias-auth)
  * [Kontakter – CardDAV (aliasautentisering)](#contacts--carddav-alias-auth)
  * [Kalendrar – CalDAV (aliasautentisering)](#calendars--caldav-alias-auth)
  * [Kalenderhändelser – CalDAV (aliasautentisering)](#calendar-events--caldav-alias-auth)
  * [Sieve-skript (API-nyckel)](#sieve-scripts-api-key)
  * [Sieve-skript (aliasautentisering)](#sieve-scripts-alias-auth)
  * [Domänmedlemmar och inbjudningar (API-nyckel)](#domain-members-and-invites-api-key)
  * [Catch-All-lösenord (API-nyckel)](#catch-all-passwords-api-key)
  * [Loggar (API-nyckel)](#logs-api-key)
  * [Kryptera (ingen autentisering)](#encrypt-no-auth)
* [20 verkliga användningsfall](#20-real-world-use-cases)
* [Exempel på prompter](#example-prompts)
* [Miljövariabler](#environment-variables)
* [Säkerhet](#security)
* [Programmatisk användning](#programmatic-usage)
* [Öppen källkod](#open-source)


## Vad är MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) är en öppen standard skapad av Anthropic som låter AI-modeller säkert anropa externa verktyg. Istället för att kopiera och klistra in API-svar i ett chattfönster, ger MCP modellen direkt, strukturerad åtkomst till dina tjänster.

Vår MCP-server omsluter hela [Forward Email API](/email-api) – varje slutpunkt, varje parameter – och exponerar dem som verktyg som alla MCP-kompatibla klienter kan använda. Servern körs lokalt på din maskin med stdio-transport. Dina inloggningsuppgifter stannar i dina miljövariabler och skickas aldrig till AI-modellen.


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

Starta om Claude Desktop. Du bör se Forward Email-verktygen i verktygsväljaren.

> **Obs!** Variablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD` är valfria men krävs för brevlådeverktyg (meddelanden, mappar, kontakter, kalendrar). Se [Autentisering](#authentication) för detaljer.

### Cursor {#cursor}

Öppna Cursor Settings → MCP → Lägg till server:

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

Öppna Windsurf Settings → MCP → Lägg till server med samma konfiguration som ovan.

### Andra MCP-klienter {#other-mcp-clients}

Alla klienter som stöder MCP stdio-transport kommer att fungera. Kommandot är:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentisering {#authentication}

Forward Email API använder **HTTP Basic-autentisering** med två olika typer av inloggningsuppgifter beroende på slutpunkt. MCP-servern hanterar detta automatiskt – du behöver bara ange rätt inloggningsuppgifter.

### API-nyckelautentisering {#api-key-auth}

De flesta hanteringsslutpunkter (domäner, alias, utgående e-post, loggar) använder din **API-nyckel** som Basic auth-användarnamn med ett tomt lösenord.

Detta är samma API-nyckel som du använder för REST API. Ställ in den via miljövariabeln `FORWARD_EMAIL_API_KEY`.

### Aliasautentisering {#alias-auth}

Brevlådeslutpunkter (meddelanden, mappar, kontakter, kalendrar, alias-scoped sieve-skript) använder **alias-inloggningsuppgifter** – aliasets e-postadress som användarnamn och ett genererat lösenord som lösenord.

Dessa slutpunkter får åtkomst till data per alias via IMAP-, CalDAV- och CardDAV-protokoll. De kräver aliasets e-post och ett genererat lösenord, inte API-nyckeln.

Du kan ange alias-inloggningsuppgifter på två sätt:

1. **Miljövariabler** (rekommenderas för standardalias): Ställ in `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametrar per verktygsanrop**: Skicka `alias_username` och `alias_password` som argument till alla alias-autentiseringsverktyg. Dessa åsidosätter miljövariablerna, vilket är användbart när du arbetar med flera alias.

### Generera ett aliaslösenord {#generating-an-alias-password}

Innan du kan använda alias-autentiseringsverktyg måste du generera ett lösenord för aliaset. Du kan göra detta med verktyget `generateAliasPassword` eller via API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Svaret inkluderar fälten `username` (alias e-post) och `password`. Använd dessa som dina alias-inloggningsuppgifter.

> **Tips:** Du kan också fråga din AI-assistent: *"Generera ett lösenord för aliaset user@example.com på domänen example.com"* – den kommer att anropa verktyget `generateAliasPassword` och returnera inloggningsuppgifterna.

Tabellen nedan sammanfattar vilken autentiseringsmetod varje verktygsgrupp kräver:

| Verktygsgrupp | Autentiseringsmetod | Inloggningsuppgifter |
|---|---|---|
| Konto | API-nyckel **eller** aliasautentisering | Antingen |
| Domäner, alias, domänmedlemmar, inbjudningar, catch-all-lösenord | API-nyckel | `FORWARD_EMAIL_API_KEY` |
| Utgående e-post (lista, hämta, ta bort, begränsa) | API-nyckel | `FORWARD_EMAIL_API_KEY` |
| Skicka e-post | API-nyckel **eller** aliasautentisering | Antingen |
| Meddelanden (IMAP) | Aliasautentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mappar (IMAP) | Aliasautentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakter (CardDAV) | Aliasautentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendrar (CalDAV) | Aliasautentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderhändelser (CalDAV) | Aliasautentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-skript (domän-scoped) | API-nyckel | `FORWARD_EMAIL_API_KEY` |
| Sieve-skript (alias-scoped) | Aliasautentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Loggar | API-nyckel | `FORWARD_EMAIL_API_KEY` |
| Kryptera | Ingen | Inga inloggningsuppgifter behövs |


## Alla 68 verktyg {#all-68-tools}

Varje verktyg mappar direkt till en [Forward Email API](/email-api)-slutpunkt. Parametrar använder samma namn som API-dokumentationen. Autentiseringsmetoden anges i varje avsnittsrubrik.

### Konto (API-nyckel eller aliasautentisering) {#account-api-key-or-alias-auth}

Med API-nyckelautentisering returnerar dessa din användarkontoinformation. Med aliasautentisering returnerar de alias-/brevlådeinformation inklusive lagringskvot och inställningar.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `getAccount` | `GET /v1/account` | Hämta din kontoinformation |
| `updateAccount` | `PUT /v1/account` | Uppdatera dina kontoinställningar |

### Domäner (API-nyckel) {#domains-api-key}

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listDomains` | `GET /v1/domains` | Lista alla dina domäner |
| `createDomain` | `POST /v1/domains` | Lägg till en ny domän |
| `getDomain` | `GET /v1/domains/:domain_id` | Hämta domäninformation |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Uppdatera domäninställningar |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Ta bort en domän |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verifiera DNS-poster |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verifiera SMTP-konfiguration |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Testa anpassad S3-lagring |

### Alias (API-nyckel) {#aliases-api-key}

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Lista alias för en domän |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Skapa ett nytt alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Hämta aliasinformation |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Uppdatera ett alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Ta bort ett alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generera IMAP/SMTP-lösenord för aliasautentisering |

### E-post – Utgående SMTP (API-nyckel; Skicka stöder båda) {#emails--outbound-smtp-api-key-send-supports-both}

| Verktyg | API-slutpunkt | Autentisering | Beskrivning |
|---|---|---|---|
| `sendEmail` | `POST /v1/emails` | API-nyckel eller aliasautentisering | Skicka ett e-postmeddelande via SMTP |
| `listEmails` | `GET /v1/emails` | API-nyckel | Lista utgående e-postmeddelanden |
| `getEmail` | `GET /v1/emails/:id` | API-nyckel | Hämta e-postinformation och status |
| `deleteEmail` | `DELETE /v1/emails/:id` | API-nyckel | Ta bort ett köat e-postmeddelande |
| `getEmailLimit` | `GET /v1/emails/limit` | API-nyckel | Kontrollera din sändningsgräns |

Verktyget `sendEmail` accepterar `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` och `attachments`. Detta är samma som slutpunkten `POST /v1/emails`.

### Meddelanden – IMAP (aliasautentisering) {#messages--imap-alias-auth}

> **Kräver alias-inloggningsuppgifter.** Skicka `alias_username` och `alias_password` eller ställ in miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listMessages` | `GET /v1/messages` | Lista och sök meddelanden i en brevlåda |
| `createMessage` | `POST /v1/messages` | Skapa ett utkast eller ladda upp ett meddelande |
| `getMessage` | `GET /v1/messages/:id` | Hämta ett meddelande med ID |
| `updateMessage` | `PUT /v1/messages/:id` | Uppdatera flaggor (läst, markerat, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Ta bort ett meddelande |

Verktyget `listMessages` stöder över 15 sökparametrar inklusive `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` och `has_attachment`. Se [API-dokumentationen](/email-api) för hela listan.

### Mappar – IMAP (aliasautentisering) {#folders--imap-alias-auth}

> **Kräver alias-inloggningsuppgifter.** Skicka `alias_username` och `alias_password` eller ställ in miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listFolders` | `GET /v1/folders` | Lista alla brevlådemappar |
| `createFolder` | `POST /v1/folders` | Skapa en ny mapp |
| `getFolder` | `GET /v1/folders/:id` | Hämta mappinformation |
| `updateFolder` | `PUT /v1/folders/:id` | Byt namn på en mapp |
| `deleteFolder` | `DELETE /v1/folders/:id` | Ta bort en mapp |

### Kontakter – CardDAV (aliasautentisering) {#contacts--carddav-alias-auth}

> **Kräver alias-inloggningsuppgifter.** Skicka `alias_username` och `alias_password` eller ställ in miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listContacts` | `GET /v1/contacts` | Lista alla kontakter |
| `createContact` | `POST /v1/contacts` | Skapa en ny kontakt |
| `getContact` | `GET /v1/contacts/:id` | Hämta kontaktinformation |
| `updateContact` | `PUT /v1/contacts/:id` | Uppdatera en kontakt |
| `deleteContact` | `DELETE /v1/contacts/:id` | Ta bort en kontakt |

### Kalendrar – CalDAV (aliasautentisering) {#calendars--caldav-alias-auth}

> **Kräver alias-inloggningsuppgifter.** Skicka `alias_username` och `alias_password` eller ställ in miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listCalendars` | `GET /v1/calendars` | Lista alla kalendrar |
| `createCalendar` | `POST /v1/calendars` | Skapa en ny kalender |
| `getCalendar` | `GET /v1/calendars/:id` | Hämta kalenderinformation |
| `updateCalendar` | `PUT /v1/calendars/:id` | Uppdatera en kalender |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Ta bort en kalender |

### Kalenderhändelser – CalDAV (aliasautentisering) {#calendar-events--caldav-alias-auth}

> **Kräver alias-inloggningsuppgifter.** Skicka `alias_username` och `alias_password` eller ställ in miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listCalendarEvents` | `GET /v1/calendar-events` | Lista alla händelser |
| `createCalendarEvent` | `POST /v1/calendar-events` | Skapa en ny händelse |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Hämta händelseinformation |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Uppdatera en händelse |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Ta bort en händelse |

### Sieve-skript (API-nyckel) {#sieve-scripts-api-key}

Dessa använder domän-scoped sökvägar och autentiserar med din API-nyckel.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Lista skript för ett alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Skapa ett nytt skript |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Hämta skriptinformation |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Uppdatera ett skript |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Ta bort ett skript |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktivera ett skript |

### Sieve-skript (aliasautentisering) {#sieve-scripts-alias-auth}

Dessa använder autentisering på aliasnivå. Användbart för automatisering per alias utan att behöva API-nyckeln.

> **Kräver alias-inloggningsuppgifter.** Skicka `alias_username` och `alias_password` eller ställ in miljövariablerna `FORWARD_EMAIL_ALIAS_USER` och `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Lista skript |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Skapa ett skript |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Hämta skriptinformation |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Uppdatera ett skript |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Ta bort ett skript |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivera ett skript |

### Domänmedlemmar och inbjudningar (API-nyckel) {#domain-members-and-invites-api-key}

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Ändra en medlems roll |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Ta bort en medlem |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Acceptera en väntande inbjudan |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Bjud in någon till en domän |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Återkalla en inbjudan |

### Catch-All-lösenord (API-nyckel) {#catch-all-passwords-api-key}

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Lista catch-all-lösenord |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Skapa ett catch-all-lösenord |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Ta bort ett catch-all-lösenord |

### Loggar (API-nyckel) {#logs-api-key}

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `downloadLogs` | `GET /v1/logs/download` | Ladda ner loggar för e-postleverans |

### Kryptera (ingen autentisering) {#encrypt-no-auth}

| Verktyg | API-slutpunkt | Beskrivning |
|---|---|---|
| `encryptRecord` | `POST /v1/encrypt` | Kryptera en DNS TXT-post |

Detta verktyg kräver ingen autentisering. Det krypterar vidarebefordringsregister som `forward-email=user@example.com` för användning i DNS TXT-poster.


## 20 verkliga användningsfall {#20-real-world-use-cases}

Här är praktiska sätt att använda MCP-servern med din AI-assistent:

### 1. E-posttriage

Be din AI att skanna din inkorg och sammanfatta olästa meddelanden. Den kan flagga brådskande e-postmeddelanden, kategorisera efter avsändare och utarbeta svar – allt genom naturligt språk. *(Kräver alias-inloggningsuppgifter för åtkomst till inkorgen.)*

### 2. Automatisering av domänuppsättning

Ska du ställa in en ny domän? Be AI:n att skapa domänen, lägga till dina alias, verifiera DNS-poster och testa SMTP-konfigurationen. Det som normalt tar 10 minuter att klicka igenom instrumentpaneler blir en enda konversation.

### 3. Masshantering av alias

Behöver du skapa 20 alias för ett nytt projekt? Beskriv vad du behöver och låt AI:n hantera det repetitiva arbetet. Den kan skapa alias, ställa in vidarebefordringsregler och generera lösenord i ett svep.

### 4. Övervakning av e-postkampanjer

Be din AI att kontrollera sändningsgränser, lista nyligen utgående e-postmeddelanden och rapportera om leveransstatus. Användbart för att övervaka transaktionell e-posthälsa.

### 5. Kontaktsynkronisering och rensning

Använd CardDAV-verktygen för att lista alla kontakter, hitta dubbletter, uppdatera föråldrad information eller masskapa kontakter från ett kalkylblad du klistrar in i chatten. *(Kräver alias-inloggningsuppgifter.)*

### 6. Kalenderhantering

Skapa kalendrar, lägg till händelser, uppdatera mötestider och ta bort avbrutna händelser – allt genom konversation. CalDAV-verktygen stöder fullständig CRUD på både kalendrar och händelser. *(Kräver alias-inloggningsuppgifter.)*

### 7. Automatisering av Sieve-skript

Sieve-skript är kraftfulla men syntaxen är svår. Be din AI att skriva Sieve-skript åt dig: "Filtrera alla e-postmeddelanden från billing@example.com till en fakturamapp" blir ett fungerande skript utan att röra RFC 5228-specifikationen.

### 8. Team-introduktion

När en ny teammedlem ansluter, be AI:n att skapa deras alias, generera ett lösenord, skicka dem ett välkomstmeddelande med deras inloggningsuppgifter och lägga till dem som domänmedlem. En prompt, fyra API-anrop.

### 9. Säkerhetsgranskning

Be din AI att lista alla domäner, kontrollera DNS-verifieringsstatus, granska alias-konfigurationer och identifiera eventuella domäner med overifierade poster. En snabb säkerhetskontroll i naturligt språk.

### 10. Konfigurering av e-postvidarebefordring

Konfigurerar du e-postvidarebefordring för en ny domän? Be AI:n att skapa domänen, lägga till vidarebefordringsalias, kryptera DNS-posterna och verifiera att allt är korrekt konfigurerat.

### 11. Inkorgssökning och analys

Använd meddelandesökverktygen för att hitta specifika e-postmeddelanden: "Hitta alla e-postmeddelanden från john@example.com under de senaste 30 dagarna som har bilagor." De över 15 sökparametrarna gör detta kraftfullt. *(Kräver alias-inloggningsuppgifter.)*

### 12. Mapporganisation

Be din AI att skapa en mappstruktur för ett nytt projekt, flytta meddelanden mellan mappar eller rensa gamla mappar du inte längre behöver. *(Kräver alias-inloggningsuppgifter.)*

### 13. Lösenordsrotation

Generera nya aliaslösenord enligt ett schema. Be din AI att generera ett nytt lösenord för varje alias och rapportera de nya inloggningsuppgifterna.

### 14. Kryptering av DNS-poster

Kryptera dina vidarebefordringsregister innan du lägger till dem i DNS. Verktyget `encryptRecord` hanterar detta utan autentisering – användbart för snabba engångskrypteringar.

### 15. Analys av leveransloggar

Ladda ner dina loggar för e-postleverans och be AI:n att analysera avvisningsfrekvenser, identifiera problematiska mottagare eller spåra leveranstider.

### 16. Hantering av flera domäner

Om du hanterar flera domäner, be AI:n att ge dig en statusrapport: vilka domäner som är verifierade, vilka som har problem, hur många alias varje har och hur sändningsgränserna ser ut.

### 17. Catch-All-konfiguration

Ställ in catch-all-lösenord för domäner som behöver ta emot e-post på vilken adress som helst. AI:n kan skapa, lista och hantera dessa lösenord åt dig.

### 18. Hantering av domäninbjudningar

Bjud in teammedlemmar att hantera domäner, kontrollera väntande inbjudningar och rensa utgångna. Användbart för organisationer med flera domänadministratörer.

### 19. Testning av S3-lagring

Om du använder anpassad S3-lagring för e-postsäkerhetskopior, be AI:n att testa anslutningen och verifiera att den fungerar korrekt.

### 20. Komposition av e-postutkast

Skapa e-postutkast i din brevlåda utan att skicka dem. Användbart för att förbereda e-postmeddelanden som behöver granskas innan de skickas, eller för att bygga e-postmallar. *(Kräver alias-inloggningsuppgifter.)*


## Exempel på prompter {#example-prompts}

Här är prompter du kan använda direkt med din AI-assistent:

**Skicka e-post:**
> "Skicka ett e-postmeddelande från hello@mydomain.com till john@example.com med ämnet 'Möte imorgon' och texten 'Hej John, är vi fortfarande på för kl. 14?'"

**Domänhantering:**
> "Lista alla mina domäner och berätta vilka som har overifierade DNS-poster."

**Alias-skapande:**
> "Skapa ett nytt alias support@mydomain.com som vidarebefordrar till min personliga e-post."

**Inkorgssökning (kräver alias-inloggningsuppgifter):**
> "Hitta alla olästa e-postmeddelanden från förra veckan som nämner 'faktura'."

**Kalender (kräver alias-inloggningsuppgifter):**
> "Skapa en kalender som heter 'Arbete' och lägg till ett möte imorgon kl. 14 som heter 'Team Standup'."

**Sieve-skript:**
> "Skriv ett Sieve-skript för info@mydomain.com som automatiskt svarar på e-postmeddelanden med 'Tack för att du kontaktade oss, vi återkommer inom 24 timmar.'"

**Massåtgärder:**
> "Skapa alias för sales@, support@, billing@ och info@ på mydomain.com, alla vidarebefordrar till team@mydomain.com."

**Säkerhetskontroll:**
> "Kontrollera DNS- och SMTP-verifieringsstatus för alla mina domäner och berätta om något behöver åtgärdas."

**Generera aliaslösenord:**
> "Generera ett lösenord för aliaset user@example.com så att jag kan komma åt min inkorg."


## Miljövariabler {#environment-variables}

| Variabel | Obligatorisk | Standard | Beskrivning |
|---|---|---|---|
| `FORWARD_EMAIL_API_KEY` | Ja | — | Din Forward Email API-nyckel (används som Basic auth-användarnamn för API-nyckel-slutpunkter) |
| `FORWARD_EMAIL_ALIAS_USER` | Nej | — | Alias-e-postadress för brevlåde-slutpunkter (t.ex. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nej | — | Genererat aliaslösenord för brevlåde-slutpunkter |
| `FORWARD_EMAIL_API_URL` | Nej | `https://api.forwardemail.net` | API-bas-URL (för egenvärd eller testning) |


## Säkerhet {#security}

MCP-servern körs lokalt på din maskin. Så här fungerar säkerheten:

*   **Dina inloggningsuppgifter stannar lokalt.** Både din API-nyckel och alias-inloggningsuppgifter läses från miljövariabler och används för att autentisera API-förfrågningar via HTTP Basic auth. De skickas aldrig till AI-modellen.
*   **stdio-transport.** Servern kommunicerar med AI-klienten via stdin/stdout. Inga nätverksportar öppnas.
*   **Ingen datalagring.** Servern är tillståndslös. Den cachar, loggar eller lagrar ingen av dina e-postdata.
*   **Öppen källkod.** Hela kodbasen finns på [GitHub](https://github.com/forwardemail/mcp-server). Du kan granska varje rad.


## Programmatisk användning {#programmatic-usage}

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


## Öppen källkod {#open-source}

Forward Email MCP-servern är [öppen källkod på GitHub](https://github.com/forwardemail/mcp-server) under BUSL-1.1-licensen. Vi tror på transparens. Om du hittar en bugg eller vill ha en funktion, [skapa ett ärende](https://github.com/forwardemail/mcp-server/issues).

