# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Onze <a href="https://github.com/forwardemail/mcp-server">open-source MCP-server</a> stelt AI-assistenten zoals Claude, ChatGPT, Cursor en Windsurf in staat om je e-mail, domeinen, aliassen, contacten en agenda's te beheren via natuurlijke taal. Alle 68 API-eindpunten worden blootgesteld als MCP-tools. Het draait lokaal via <code>npx @forwardemail/mcp-server</code> — je inloggegevens verlaten nooit je apparaat.
</p>


## Inhoudsopgave {#table-of-contents}

* [Wat is MCP?](#what-is-mcp)
* [Snel aan de slag](#quick-start)
  * [Krijg een API-sleutel](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andere MCP-clients](#other-mcp-clients)
* [Authenticatie](#authentication)
  * [API-sleutel authenticatie](#api-key-auth)
  * [Alias authenticatie](#alias-auth)
  * [Een alias-wachtwoord genereren](#generating-an-alias-password)
* [Alle 68 tools](#all-68-tools)
  * [Account (API-sleutel of alias authenticatie)](#account-api-key-or-alias-auth)
  * [Domeinen (API-sleutel)](#domains-api-key)
  * [Aliassen (API-sleutel)](#aliases-api-key)
  * [E-mails — Uitgaande SMTP (API-sleutel; Send ondersteunt beide)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Berichten — IMAP (Alias authenticatie)](#messages--imap-alias-auth)
  * [Mappen — IMAP (Alias authenticatie)](#folders--imap-alias-auth)
  * [Contacten — CardDAV (Alias authenticatie)](#contacts--carddav-alias-auth)
  * [Agenda's — CalDAV (Alias authenticatie)](#calendars--caldav-alias-auth)
  * [Agenda-items — CalDAV (Alias authenticatie)](#calendar-events--caldav-alias-auth)
  * [Sieve-scripts (API-sleutel)](#sieve-scripts-api-key)
  * [Sieve-scripts (Alias authenticatie)](#sieve-scripts-alias-auth)
  * [Domeinleden en uitnodigingen (API-sleutel)](#domain-members-and-invites-api-key)
  * [Catch-All wachtwoorden (API-sleutel)](#catch-all-passwords-api-key)
  * [Logs (API-sleutel)](#logs-api-key)
  * [Encryptie (Geen authenticatie)](#encrypt-no-auth)
* [20 Praktijkvoorbeelden](#20-real-world-use-cases)
  * [1. E-mail triage](#1-email-triage)
  * [2. Domein setup automatisering](#2-domain-setup-automation)
  * [3. Bulk alias beheer](#3-bulk-alias-management)
  * [4. E-mailcampagne monitoring](#4-email-campaign-monitoring)
  * [5. Contact synchronisatie en opschoning](#5-contact-sync-and-cleanup)
  * [6. Agenda beheer](#6-calendar-management)
  * [7. Sieve-script automatisering](#7-sieve-script-automation)
  * [8. Team onboarding](#8-team-onboarding)
  * [9. Beveiligingsaudit](#9-security-auditing)
  * [10. E-mail doorstuurinstellingen](#10-email-forwarding-setup)
  * [11. Inbox zoeken en analyseren](#11-inbox-search-and-analysis)
  * [12. Map organisatie](#12-folder-organization)
  * [13. Wachtwoordrotatie](#13-password-rotation)
  * [14. DNS-record encryptie](#14-dns-record-encryption)
  * [15. Analyse van bezorglogs](#15-delivery-log-analysis)
  * [16. Multi-domein beheer](#16-multi-domain-management)
  * [17. Catch-All configuratie](#17-catch-all-configuration)
  * [18. Domeinuitnodiging beheer](#18-domain-invite-management)
  * [19. S3 opslag testen](#19-s3-storage-testing)
  * [20. E-mail concept samenstellen](#20-email-draft-composition)
* [Voorbeeld prompts](#example-prompts)
* [Omgevingsvariabelen](#environment-variables)
* [Beveiliging](#security)
* [Programmeerbaar gebruik](#programmatic-usage)
* [Open source](#open-source)


## Wat is MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) is een open standaard ontwikkeld door Anthropic die AI-modellen in staat stelt om veilig externe tools aan te roepen. In plaats van API-antwoorden te kopiëren en plakken in een chatvenster, geeft MCP het model directe, gestructureerde toegang tot je diensten.

Onze MCP-server wikkelt de volledige [Forward Email API](/email-api) in — elk eindpunt, elke parameter — en stelt deze bloot als tools die elke MCP-compatibele client kan gebruiken. De server draait lokaal op je machine via stdio transport. Je inloggegevens blijven in je omgevingsvariabelen en worden nooit naar het AI-model gestuurd.


## Snel aan de slag {#quick-start}

### Krijg een API-sleutel {#get-an-api-key}
1. Log in op je [Forward Email-account](/my-account/domains).
2. Ga naar **Mijn Account** → **Beveiliging** → **API-sleutels**.
3. Genereer een nieuwe API-sleutel en kopieer deze.

### Claude Desktop {#claude-desktop}

Voeg dit toe aan je Claude Desktop-configuratiebestand:

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

Herstart Claude Desktop. Je zou de Forward Email-tools in de toolkiezer moeten zien.

> **Opmerking:** De variabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` zijn optioneel maar vereist voor mailboxtools (berichten, mappen, contacten, agenda's). Zie [Authenticatie](#authentication) voor details.

### Cursor {#cursor}

Open Cursor-instellingen → MCP → Server toevoegen:

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

Open Windsurf-instellingen → MCP → Server toevoegen met dezelfde configuratie als hierboven.

### Andere MCP-clients {#other-mcp-clients}

Elke client die de MCP stdio-transport ondersteunt werkt. Het commando is:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Authenticatie {#authentication}

De Forward Email API gebruikt **HTTP Basic authenticatie** met twee verschillende soorten inloggegevens afhankelijk van de endpoint. De MCP-server regelt dit automatisch — je hoeft alleen de juiste inloggegevens te leveren.

### API-sleutel authenticatie {#api-key-auth}

De meeste beheerdersendpoints (domeinen, aliassen, uitgaande e-mails, logs) gebruiken je **API-sleutel** als Basic auth gebruikersnaam met een leeg wachtwoord.

Dit is dezelfde API-sleutel die je gebruikt voor de REST API. Stel deze in via de omgevingsvariabele `FORWARD_EMAIL_API_KEY`.

### Alias authenticatie {#alias-auth}

Mailbox-endpoints (berichten, mappen, contacten, agenda's, alias-gescopeerde sieve-scripts) gebruiken **alias-inloggegevens** — het alias e-mailadres als gebruikersnaam en een gegenereerd wachtwoord als wachtwoord.

Deze endpoints krijgen toegang tot per-alias data via IMAP, CalDAV en CardDAV protocollen. Ze vereisen het alias e-mailadres en een gegenereerd wachtwoord, niet de API-sleutel.

Je kunt alias-inloggegevens op twee manieren aanleveren:

1. **Omgevingsvariabelen** (aanbevolen voor standaard alias): Stel `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.
2. **Per-tool-aanroep parameters**: Geef `alias_username` en `alias_password` door als argumenten aan een alias-auth tool. Deze overschrijven de omgevingsvariabelen, wat handig is bij gebruik van meerdere aliassen.

### Een alias-wachtwoord genereren {#generating-an-alias-password}

Voordat je alias-auth tools kunt gebruiken, moet je een wachtwoord voor de alias genereren. Dit kan met de `generateAliasPassword` tool of via de API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

De respons bevat de velden `username` (alias e-mail) en `password`. Gebruik deze als je alias-inloggegevens.

> **Tip:** Je kunt ook je AI-assistent vragen: *"Genereer een wachtwoord voor de alias <user@example.com> op domein example.com"* — deze zal de `generateAliasPassword` tool aanroepen en de inloggegevens teruggeven.

De onderstaande tabel vat samen welke authenticatiemethode elke toolgroep vereist:

| Toolgroep                                                     | Authenticatiemethode      | Inloggegevens                                              |
| ------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| Account                                                      | API-sleutel **of** Alias Auth | Beide                                                     |
| Domeinen, Aliassen, Domeinleden, Uitnodigingen, Catch-All Wachtwoorden | API-sleutel              | `FORWARD_EMAIL_API_KEY`                                    |
| Uitgaande e-mails (lijst, ophalen, verwijderen, limiet)      | API-sleutel              | `FORWARD_EMAIL_API_KEY`                                    |
| E-mail verzenden                                            | API-sleutel **of** Alias Auth | Beide                                                     |
| Berichten (IMAP)                                            | Alias Auth               | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mappen (IMAP)                                               | Alias Auth               | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contacten (CardDAV)                                         | Alias Auth               | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Agenda's (CalDAV)                                           | Alias Auth               | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Agenda-items (CalDAV)                                       | Alias Auth               | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-scripts (domein-gescopeerd)                          | API-sleutel              | `FORWARD_EMAIL_API_KEY`                                    |
| Sieve-scripts (alias-gescopeerd)                           | Alias Auth               | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logs                                                       | API-sleutel              | `FORWARD_EMAIL_API_KEY`                                    |
| Versleutelen                                              | Geen                     | Geen inloggegevens nodig                                   |
## Alle 68 Tools {#all-68-tools}

Elke tool correspondeert direct met een [Forward Email API](/email-api) endpoint. Parameters gebruiken dezelfde namen als in de API-documentatie. De authenticatiemethode wordt vermeld in elke sectiekop.

### Account (API Key of Alias Auth) {#account-api-key-or-alias-auth}

Met API key authenticatie retourneren deze je gebruikersaccountinformatie. Met alias authenticatie retourneren ze alias/postbus informatie inclusief opslagquota en instellingen.

| Tool            | API Endpoint      | Beschrijving                  |
| --------------- | ----------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account` | Haal je accountinformatie op |
| `updateAccount` | `PUT /v1/account` | Werk je accountinstellingen bij |

### Domeinen (API Key) {#domains-api-key}

| Tool                  | API Endpoint                                     | Beschrijving               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Toon al je domeinen       |
| `createDomain`        | `POST /v1/domains`                               | Voeg een nieuw domein toe |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Haal domeingegevens op    |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Werk domeininstellingen bij |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Verwijder een domein      |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verifieer DNS-records     |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verifieer SMTP-configuratie |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Test aangepaste S3-opslag |

### Aliassen (API Key) {#aliases-api-key}

| Tool                    | API Endpoint                                                      | Beschrijving                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Toon aliassen voor een domein               |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Maak een nieuwe alias aan                   |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Haal aliasgegevens op                       |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Werk een alias bij                          |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Verwijder een alias                         |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Genereer IMAP/SMTP-wachtwoord voor alias authenticatie |

### E-mails — Uitgaande SMTP (API Key; Send ondersteunt beide) {#emails--outbound-smtp-api-key-send-supports-both}

| Tool            | API Endpoint            | Auth                  | Beschrijving                  |
| --------------- | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | API Key of Alias Auth | Verstuur een e-mail via SMTP |
| `listEmails`    | `GET /v1/emails`        | API Key               | Toon uitgaande e-mails       |
| `getEmail`      | `GET /v1/emails/:id`    | API Key               | Haal e-mailgegevens en status op |
| `deleteEmail`   | `DELETE /v1/emails/:id` | API Key               | Verwijder een geplaatste e-mail |
| `getEmailLimit` | `GET /v1/emails/limit`  | API Key               | Controleer je verzendlimiet  |

De `sendEmail` tool accepteert `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, en `attachments`. Dit is hetzelfde als het `POST /v1/emails` endpoint.

### Berichten — IMAP (Alias Auth) {#messages--imap-alias-auth}

> **Vereist alias-gegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.
| Tool            | API Endpoint              | Beschrijving                           |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Berichten in een mailbox weergeven en doorzoeken |
| `createMessage` | `POST /v1/messages`       | Een concept maken of een bericht uploaden    |
| `getMessage`    | `GET /v1/messages/:id`    | Een bericht ophalen op ID                   |
| `updateMessage` | `PUT /v1/messages/:id`    | Vlaggen bijwerken (gelezen, gemarkeerd, enz.)    |
| `deleteMessage` | `DELETE /v1/messages/:id` | Een bericht verwijderen                      |

De `listMessages` tool ondersteunt meer dan 15 zoekparameters waaronder `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` en `has_attachment`. Zie de [API docs](/email-api) voor de volledige lijst.

### Mappen — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Vereist alias-gegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool           | API Endpoint             | Beschrijving              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Alle mailboxmappen weergeven |
| `createFolder` | `POST /v1/folders`       | Een nieuwe map maken      |
| `getFolder`    | `GET /v1/folders/:id`    | Mapgegevens ophalen       |
| `updateFolder` | `PUT /v1/folders/:id`    | Een map hernoemen          |
| `deleteFolder` | `DELETE /v1/folders/:id` | Een map verwijderen          |

### Contacten — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Vereist alias-gegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool            | API Endpoint              | Beschrijving          |
| --------------- | ------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`        | Alle contacten weergeven    |
| `createContact` | `POST /v1/contacts`       | Een nieuw contact maken |
| `getContact`    | `GET /v1/contacts/:id`    | Contactgegevens ophalen  |
| `updateContact` | `PUT /v1/contacts/:id`    | Een contact bijwerken     |
| `deleteContact` | `DELETE /v1/contacts/:id` | Een contact verwijderen     |

### Kalenders — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Vereist alias-gegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool             | API Endpoint               | Beschrijving           |
| ---------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Alle kalenders weergeven    |
| `createCalendar` | `POST /v1/calendars`       | Een nieuwe kalender maken |
| `getCalendar`    | `GET /v1/calendars/:id`    | Kalendergegevens ophalen  |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Een kalender bijwerken     |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Een kalender verwijderen     |

### Kalendergebeurtenissen — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Vereist alias-gegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool                  | API Endpoint                     | Beschrijving        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Alle gebeurtenissen weergeven    |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Een nieuwe gebeurtenis maken |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Gegevens van gebeurtenis ophalen  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Een gebeurtenis bijwerken    |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Een gebeurtenis verwijderen    |

### Sieve-scripts (API-sleutel) {#sieve-scripts-api-key}

Deze gebruiken domeinspecifieke paden en authenticeren met je API-sleutel.

| Tool                  | API Endpoint                                                              | Beschrijving               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Scripts voor een alias weergeven |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Een nieuw script maken       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Scriptgegevens ophalen        |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Een script bijwerken           |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Een script verwijderen           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Een script activeren         |
### Sieve-scripts (Alias Auth) {#sieve-scripts-alias-auth}

Deze gebruiken authenticatie op alias-niveau. Handig voor automatisering per alias zonder dat de API-sleutel nodig is.

> **Vereist alias-gegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool                           | API Endpoint                                 | Beschrijving       |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Lijst scripts      |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Maak een script    |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Haal scriptdetails op |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Werk een script bij |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Verwijder een script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Activeer een script |

### Domeinleden en uitnodigingen (API-sleutel) {#domain-members-and-invites-api-key}

| Tool                 | API Endpoint                                       | Beschrijving                |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id`    | Wijzig de rol van een lid  |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Verwijder een lid          |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites`               | Accepteer een openstaande uitnodiging |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites`              | Nodig iemand uit voor een domein |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites`            | Intrek een uitnodiging     |

### Catch-All wachtwoorden (API-sleutel) {#catch-all-passwords-api-key}

| Tool                     | API Endpoint                                                  | Beschrijving                 |
| ------------------------ | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Lijst catch-all wachtwoorden |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Maak een catch-all wachtwoord |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Verwijder een catch-all wachtwoord |

### Logs (API-sleutel) {#logs-api-key}

| Tool           | API Endpoint            | Beschrijving                  |
| -------------- | ----------------------- | ---------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | Download e-mailbezorgingslogs |

### Versleutelen (Geen authenticatie) {#encrypt-no-auth}

| Tool            | API Endpoint       | Beschrijving              |
| --------------- | ------------------ | ------------------------ |
| `encryptRecord` | `POST /v1/encrypt` | Versleutel een DNS TXT-record |

Deze tool vereist geen authenticatie. Het versleutelt doorstuurrecords zoals `forward-email=user@example.com` voor gebruik in DNS TXT-records.


## 20 Praktische Gebruikssituaties {#20-real-world-use-cases}

Hier zijn praktische manieren om de MCP-server te gebruiken met je AI-assistent:

### 1. E-mailtriage {#1-email-triage}

Vraag je AI om je inbox te scannen en ongelezen berichten samen te vatten. Het kan urgente e-mails markeren, categoriseren op afzender en conceptantwoorden opstellen — allemaal via natuurlijke taal. *(Vereist alias-gegevens voor inbox-toegang.)*

### 2. Domeininstellingsautomatisering {#2-domain-setup-automation}

Een nieuw domein instellen? Vraag de AI om het domein aan te maken, je aliassen toe te voegen, DNS-records te verifiëren en SMTP-configuratie te testen. Wat normaal 10 minuten klikken in dashboards kost, wordt één gesprek.

### 3. Bulkbeheer van aliassen {#3-bulk-alias-management}

Moet je 20 aliassen aanmaken voor een nieuw project? Beschrijf wat je nodig hebt en laat de AI het repetitieve werk doen. Het kan aliassen aanmaken, doorstuurregels instellen en wachtwoorden genereren in één keer.
### 4. E-mailcampagne Monitoring {#4-email-campaign-monitoring}

Vraag je AI om verzendlimieten te controleren, recente uitgaande e-mails te tonen en te rapporteren over de afleverstatus. Handig voor het monitoren van de gezondheid van transactionele e-mails.

### 5. Contact Synchronisatie en Opschoning {#5-contact-sync-and-cleanup}

Gebruik de CardDAV-tools om alle contacten te tonen, duplicaten te vinden, verouderde informatie bij te werken of contacten in bulk aan te maken vanuit een spreadsheet die je in de chat plakt. *(Vereist alias-gegevens.)*

### 6. Agenda Beheer {#6-calendar-management}

Maak agenda’s aan, voeg evenementen toe, werk vergadertijden bij en verwijder geannuleerde evenementen — allemaal via een gesprek. De CalDAV-tools ondersteunen volledige CRUD op zowel agenda’s als evenementen. *(Vereist alias-gegevens.)*

### 7. Sieve Script Automatisering {#7-sieve-script-automation}

Sieve-scripts zijn krachtig maar de syntax is ingewikkeld. Vraag je AI om Sieve-scripts voor je te schrijven: "Filter alle e-mails van <billing@example.com> naar een map Facturatie" wordt een werkend script zonder dat je de RFC 5228-specificatie hoeft te raadplegen.

### 8. Team Onboarding {#8-team-onboarding}

Wanneer een nieuw teamlid toetreedt, vraag de AI om hun alias aan te maken, een wachtwoord te genereren, hen een welkomstmail met hun gegevens te sturen en ze als domeinlid toe te voegen. Eén prompt, vier API-aanroepen.

### 9. Beveiligingsaudit {#9-security-auditing}

Vraag je AI om alle domeinen te tonen, de DNS-verificatiestatus te controleren, aliasconfiguraties te bekijken en domeinen met niet-geverifieerde records te identificeren. Een snelle beveiligingscontrole in natuurlijke taal.

### 10. E-mail Doorstuurinstelling {#10-email-forwarding-setup}

Wil je e-maildoorsturing instellen voor een nieuw domein? Vraag de AI om het domein aan te maken, doorstuuraliassen toe te voegen, de DNS-records te versleutelen en te verifiëren dat alles correct is geconfigureerd.

### 11. Inbox Zoeken en Analyseren {#11-inbox-search-and-analysis}

Gebruik de zoektools om specifieke e-mails te vinden: "Vind alle e-mails van <john@example.com> in de afgelopen 30 dagen met bijlagen." De 15+ zoekparameters maken dit krachtig. *(Vereist alias-gegevens.)*

### 12. Mappen Organisatie {#12-folder-organization}

Vraag je AI om een mappenstructuur aan te maken voor een nieuw project, berichten tussen mappen te verplaatsen of oude mappen op te ruimen die je niet meer nodig hebt. *(Vereist alias-gegevens.)*

### 13. Wachtwoordrotatie {#13-password-rotation}

Genereer nieuwe alias-wachtwoorden volgens een schema. Vraag je AI om voor elke alias een nieuw wachtwoord te genereren en de nieuwe gegevens te rapporteren.

### 14. DNS Record Encryptie {#14-dns-record-encryption}

Versleutel je doorstuurrecords voordat je ze aan DNS toevoegt. De `encryptRecord` tool regelt dit zonder authenticatie — handig voor snelle eenmalige versleutelingen.

### 15. Analyse van Bezorglogboeken {#15-delivery-log-analysis}

Download je e-mailbezorglogboeken en vraag de AI om bouncepercentages te analyseren, problematische ontvangers te identificeren of bezorgtijden te volgen.

### 16. Beheer van Meerdere Domeinen {#16-multi-domain-management}

Beheer je meerdere domeinen? Vraag de AI om een statusrapport: welke domeinen zijn geverifieerd, welke hebben problemen, hoeveel aliassen heeft elk en hoe zien de verzendlimieten eruit.

### 17. Catch-All Configuratie {#17-catch-all-configuration}

Stel catch-all wachtwoorden in voor domeinen die e-mail op elk adres moeten ontvangen. De AI kan deze wachtwoorden voor je aanmaken, tonen en beheren.

### 18. Domeinuitnodiging Beheer {#18-domain-invite-management}

Nodig teamleden uit om domeinen te beheren, controleer openstaande uitnodigingen en ruim verlopen uitnodigingen op. Handig voor organisaties met meerdere domeinbeheerders.

### 19. S3 Opslag Testen {#19-s3-storage-testing}

Gebruik je aangepaste S3-opslag voor e-mailback-ups? Vraag de AI om de verbinding te testen en te verifiëren dat alles correct werkt.

### 20. E-mailconcept Samenstellen {#20-email-draft-composition}

Maak concept-e-mails aan in je mailbox zonder ze te verzenden. Handig voor het voorbereiden van e-mails die eerst beoordeeld moeten worden, of voor het bouwen van e-mailsjablonen. *(Vereist alias-gegevens.)*


## Voorbeeld Prompts {#example-prompts}

Hier zijn prompts die je direct met je AI-assistent kunt gebruiken:

**E-mail verzenden:**

> "Stuur een e-mail van <hello@mydomain.com> naar <john@example.com> met als onderwerp 'Vergadering Morgen' en de tekst 'Hoi John, staan we nog steeds op 14:00 uur?'"
**Domeinbeheer:**

> "Geef een lijst van al mijn domeinen en vertel me welke ongeverifieerde DNS-records hebben."

**Alias aanmaken:**

> "Maak een nieuwe alias <support@mydomain.com> aan die doorstuurt naar mijn persoonlijke e-mail."

**Inbox zoeken (vereist alias-gegevens):**

> "Vind alle ongelezen e-mails van de afgelopen week waarin 'factuur' wordt genoemd."

**Agenda (vereist alias-gegevens):**

> "Maak een agenda genaamd 'Werk' en voeg een vergadering toe voor morgen om 14:00 uur genaamd 'Team Standup'."

**Sieve-scripts:**

> "Schrijf een Sieve-script voor <info@mydomain.com> dat automatisch antwoordt op e-mails met 'Bedankt voor je bericht, we nemen binnen 24 uur contact met je op.'"

**Bulkbewerkingen:**

> "Maak aliassen aan voor sales@, support@, billing@ en info@ op mydomain.com, allemaal doorsturen naar <team@mydomain.com>."

**Beveiligingscontrole:**

> "Controleer de DNS- en SMTP-verificatiestatus voor al mijn domeinen en vertel me of er iets aandacht nodig heeft."

**Alias-wachtwoord genereren:**

> "Genereer een wachtwoord voor de alias <user@example.com> zodat ik toegang heb tot mijn inbox."


## Environment Variables {#environment-variables}

| Variable                       | Required | Default                        | Description                                                                    |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Ja       | —                              | Je Forward Email API-sleutel (gebruikt als Basic auth gebruikersnaam voor API-key endpoints) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nee      | —                              | Alias e-mailadres voor mailbox endpoints (bijv. `user@example.com`)            |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nee      | —                              | Gegeneerd alias-wachtwoord voor mailbox endpoints                             |
| `FORWARD_EMAIL_API_URL`        | Nee      | `https://api.forwardemail.net` | API basis-URL (voor zelf-gehoste of testomgevingen)                           |


## Security {#security}

De MCP-server draait lokaal op je machine. Zo werkt de beveiliging:

* **Je gegevens blijven lokaal.** Zowel je API-sleutel als alias-gegevens worden gelezen uit omgevingsvariabelen en gebruikt om API-verzoeken te authenticeren via HTTP Basic auth. Ze worden nooit naar het AI-model gestuurd.
* **stdio transport.** De server communiceert met de AI-client via stdin/stdout. Er worden geen netwerkpoorten geopend.
* **Geen dataopslag.** De server is stateless. Hij cachet, logt of slaat geen van je e-mailgegevens op.
* **Open source.** De volledige codebase staat op [GitHub](https://github.com/forwardemail/mcp-server). Je kunt elke regel controleren.


## Programmatic Usage {#programmatic-usage}

Je kunt de server ook als bibliotheek gebruiken:

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

De Forward Email MCP Server is [open-source op GitHub](https://github.com/forwardemail/mcp-server) onder de BUSL-1.1-licentie. Wij geloven in transparantie. Als je een bug vindt of een functie wilt, [open een issue](https://github.com/forwardemail/mcp-server/issues).
