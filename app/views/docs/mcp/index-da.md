# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Vores <a href="https://github.com/forwardemail/mcp-server">open source MCP-server</a> lader AI-assistenter som Claude, ChatGPT, Cursor og Windsurf administrere din e-mail, domæner, aliaser, kontakter og kalendere via naturligt sprog. Alle 68 API-endpoints er tilgængelige som MCP-værktøjer. Den kører lokalt via <code>npx @forwardemail/mcp-server</code> — dine legitimationsoplysninger forlader aldrig din maskine.
</p>


## Table of Contents {#table-of-contents}

* [Hvad er MCP?](#what-is-mcp)
* [Kom godt i gang](#quick-start)
  * [Få en API-nøgle](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andre MCP-klienter](#other-mcp-clients)
* [Godkendelse](#authentication)
  * [API-nøgle-godkendelse](#api-key-auth)
  * [Alias-godkendelse](#alias-auth)
  * [Generering af alias-adgangskode](#generating-an-alias-password)
* [Alle 68 værktøjer](#all-68-tools)
  * [Konto (API-nøgle eller alias-godkendelse)](#account-api-key-or-alias-auth)
  * [Domæner (API-nøgle)](#domains-api-key)
  * [Aliaser (API-nøgle)](#aliases-api-key)
  * [E-mails — Udgående SMTP (API-nøgle; Send understøtter begge)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Beskeder — IMAP (Alias-godkendelse)](#messages--imap-alias-auth)
  * [Mapper — IMAP (Alias-godkendelse)](#folders--imap-alias-auth)
  * [Kontakter — CardDAV (Alias-godkendelse)](#contacts--carddav-alias-auth)
  * [Kalendere — CalDAV (Alias-godkendelse)](#calendars--caldav-alias-auth)
  * [Kalenderbegivenheder — CalDAV (Alias-godkendelse)](#calendar-events--caldav-alias-auth)
  * [Sieve-scripts (API-nøgle)](#sieve-scripts-api-key)
  * [Sieve-scripts (Alias-godkendelse)](#sieve-scripts-alias-auth)
  * [Domænemedlemmer og invitationer (API-nøgle)](#domain-members-and-invites-api-key)
  * [Catch-All-adgangskoder (API-nøgle)](#catch-all-passwords-api-key)
  * [Logs (API-nøgle)](#logs-api-key)
  * [Kryptering (Ingen godkendelse)](#encrypt-no-auth)
* [20 virkelige brugsscenarier](#20-real-world-use-cases)
  * [1. E-mail triage](#1-email-triage)
  * [2. Automatisering af domæneopsætning](#2-domain-setup-automation)
  * [3. Massehåndtering af aliaser](#3-bulk-alias-management)
  * [4. Overvågning af e-mailkampagner](#4-email-campaign-monitoring)
  * [5. Synkronisering og oprydning af kontakter](#5-contact-sync-and-cleanup)
  * [6. Kalenderstyring](#6-calendar-management)
  * [7. Automatisering af Sieve-scripts](#7-sieve-script-automation)
  * [8. Team onboarding](#8-team-onboarding)
  * [9. Sikkerhedsrevision](#9-security-auditing)
  * [10. Opsætning af e-mail videresendelse](#10-email-forwarding-setup)
  * [11. Søgning og analyse af indbakke](#11-inbox-search-and-analysis)
  * [12. Organisering af mapper](#12-folder-organization)
  * [13. Rotation af adgangskoder](#13-password-rotation)
  * [14. Kryptering af DNS-poster](#14-dns-record-encryption)
  * [15. Analyse af leveringslog](#15-delivery-log-analysis)
  * [16. Administration af flere domæner](#16-multi-domain-management)
  * [17. Catch-All-konfiguration](#17-catch-all-configuration)
  * [18. Administration af domæneinvitationer](#18-domain-invite-management)
  * [19. Test af S3-lagring](#19-s3-storage-testing)
  * [20. Komposition af e-mailudkast](#20-email-draft-composition)
* [Eksempel-prompt](#example-prompts)
* [Miljøvariabler](#environment-variables)
* [Sikkerhed](#security)
* [Programmatisk brug](#programmatic-usage)
* [Open Source](#open-source)


## Hvad er MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) er en åben standard skabt af Anthropic, som lader AI-modeller sikkert kalde eksterne værktøjer. I stedet for at kopiere og indsætte API-svar i et chatvindue, giver MCP modellen direkte, struktureret adgang til dine tjenester.

Vores MCP-server omslutter hele [Forward Email API](/email-api) — hvert endpoint, hver parameter — og eksponerer dem som værktøjer, som enhver MCP-kompatibel klient kan bruge. Serveren kører lokalt på din maskine ved hjælp af stdio-transport. Dine legitimationsoplysninger forbliver i dine miljøvariabler og sendes aldrig til AI-modellen.


## Kom godt i gang {#quick-start}

### Få en API-nøgle {#get-an-api-key}
1. Log ind på din [Forward Email-konto](/my-account/domains).
2. Gå til **Min Konto** → **Sikkerhed** → **API-nøgler**.
3. Generer en ny API-nøgle og kopier den.

### Claude Desktop {#claude-desktop}

Tilføj dette til din Claude Desktop konfigurationsfil:

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

Genstart Claude Desktop. Du bør se Forward Email-værktøjerne i værktøjsvælgeren.

> **Bemærk:** Variablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` er valgfrie, men kræves for postkasseværktøjer (beskeder, mapper, kontakter, kalendere). Se [Autentificering](#authentication) for detaljer.

### Cursor {#cursor}

Åbn Cursor Indstillinger → MCP → Tilføj Server:

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

Åbn Windsurf Indstillinger → MCP → Tilføj Server med samme konfiguration som ovenfor.

### Andre MCP-klienter {#other-mcp-clients}

Enhver klient, der understøtter MCP stdio transport, vil fungere. Kommandoen er:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentificering {#authentication}

Forward Email API bruger **HTTP Basic autentificering** med to forskellige legitimationsoplysninger afhængigt af endpointet. MCP-serveren håndterer dette automatisk — du skal blot levere de korrekte legitimationsoplysninger.

### API-nøgle autentificering {#api-key-auth}

De fleste administrationsendpoints (domæner, aliaser, udgående e-mails, logs) bruger din **API-nøgle** som Basic auth brugernavn med et tomt kodeord.

Dette er den samme API-nøgle, du bruger til REST API’en. Sæt den via miljøvariablen `FORWARD_EMAIL_API_KEY`.

### Alias autentificering {#alias-auth}

Postkasseendpoints (beskeder, mapper, kontakter, kalendere, alias-afgrænsede sieve-scripts) bruger **alias-legitimationsoplysninger** — aliasets e-mailadresse som brugernavn og et genereret kodeord som adgangskode.

Disse endpoints får adgang til data pr. alias via IMAP, CalDAV og CardDAV protokoller. De kræver aliasets e-mail og et genereret kodeord, ikke API-nøglen.

Du kan angive alias-legitimationsoplysninger på to måder:

1. **Miljøvariabler** (anbefales til standardalias): Sæt `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametre pr. værktøjskald**: Send `alias_username` og `alias_password` som argumenter til ethvert alias-autentificeringsværktøj. Disse overskriver miljøvariablerne, hvilket er nyttigt, når du arbejder med flere aliaser.

### Generering af et alias-kodeord {#generating-an-alias-password}

Før du kan bruge alias-autentificeringsværktøjer, skal du generere et kodeord til aliaset. Det kan du gøre med værktøjet `generateAliasPassword` eller via API’en:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Svaret indeholder felterne `username` (alias e-mail) og `password`. Brug disse som dine alias-legitimationsoplysninger.

> **Tip:** Du kan også spørge din AI-assistent: *"Generer et kodeord til aliaset <user@example.com> på domænet example.com"* — den vil kalde værktøjet `generateAliasPassword` og returnere legitimationsoplysningerne.

Tabellen nedenfor opsummerer, hvilken autentificeringsmetode hver værktøjsgruppe kræver:

| Værktøjsgruppe                                                | Autentificeringsmetode    | Legitimationsoplysninger                                    |
| ------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| Konto                                                         | API-nøgle **eller** Alias | Enten                                                      |
| Domæner, Aliaser, Domænemedlemmer, Invitationer, Catch-All-kodeord | API-nøgle                 | `FORWARD_EMAIL_API_KEY`                                     |
| Udgående e-mails (liste, hent, slet, begræns)                 | API-nøgle                 | `FORWARD_EMAIL_API_KEY`                                     |
| Send e-mail                                                   | API-nøgle **eller** Alias | Enten                                                      |
| Beskeder (IMAP)                                               | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mapper (IMAP)                                                 | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakter (CardDAV)                                           | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendere (CalDAV)                                           | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderbegivenheder (CalDAV)                                | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-scripts (domæneafgrænset)                              | API-nøgle                 | `FORWARD_EMAIL_API_KEY`                                     |
| Sieve-scripts (alias-afgrænset)                              | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logs                                                         | API-nøgle                 | `FORWARD_EMAIL_API_KEY`                                     |
| Krypter                                                     | Ingen                     | Ingen legitimationsoplysninger nødvendige                   |
## Alle 68 Værktøjer {#all-68-tools}

Hvert værktøj svarer direkte til en [Forward Email API](/email-api) endpoint. Parametre bruger de samme navne som i API-dokumentationen. Godkendelsesmetoden er angivet i hver sektionoverskrift.

### Konto (API-nøgle eller Alias-godkendelse) {#account-api-key-or-alias-auth}

Med API-nøgle-godkendelse returnerer disse din brugerkonto-info. Med alias-godkendelse returnerer de alias-/mailboks-info inklusive lagerkvote og indstillinger.

| Værktøj          | API Endpoint      | Beskrivelse                  |
| --------------- | ----------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account` | Hent dine kontooplysninger   |
| `updateAccount` | `PUT /v1/account` | Opdater dine kontoindstillinger |

### Domæner (API-nøgle) {#domains-api-key}

| Værktøj              | API Endpoint                                     | Beskrivelse               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | List alle dine domæner    |
| `createDomain`        | `POST /v1/domains`                               | Tilføj et nyt domæne      |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Hent domænedetaljer       |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Opdater domæneindstillinger |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Fjern et domæne           |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verificer DNS-poster      |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verificer SMTP-konfiguration |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Test brugerdefineret S3-lager |

### Aliasser (API-nøgle) {#aliases-api-key}

| Værktøj                  | API Endpoint                                                      | Beskrivelse                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | List aliaser for et domæne                  |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Opret et nyt alias                         |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Hent aliasdetaljer                          |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Opdater et alias                            |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Slet et alias                              |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generer IMAP/SMTP-adgangskode til alias-godkendelse |

### Emails — Udgående SMTP (API-nøgle; Send understøtter begge) {#emails--outbound-smtp-api-key-send-supports-both}

| Værktøj          | API Endpoint            | Godkendelse           | Beskrivelse                  |
| --------------- | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | API-nøgle eller Alias-godkendelse | Send en email via SMTP       |
| `listEmails`    | `GET /v1/emails`        | API-nøgle             | List udgående emails         |
| `getEmail`      | `GET /v1/emails/:id`    | API-nøgle             | Hent emaildetaljer og status |
| `deleteEmail`   | `DELETE /v1/emails/:id` | API-nøgle             | Slet en køet email           |
| `getEmailLimit` | `GET /v1/emails/limit`  | API-nøgle             | Tjek din afsendelsesgrænse   |

`sendEmail`-værktøjet accepterer `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` og `attachments`. Dette er det samme som `POST /v1/emails` endpointet.

### Beskeder — IMAP (Alias-godkendelse) {#messages--imap-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Angiv `alias_username` og `alias_password` eller sæt miljøvariablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Værktøj          | API-endpoint              | Beskrivelse                          |
| --------------- | ------------------------- | ----------------------------------- |
| `listMessages`  | `GET /v1/messages`        | List og søg beskeder i en postkasse |
| `createMessage` | `POST /v1/messages`       | Opret et udkast eller upload en besked |
| `getMessage`    | `GET /v1/messages/:id`    | Hent en besked efter ID             |
| `updateMessage` | `PUT /v1/messages/:id`    | Opdater flag (læst, markeret, osv.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Slet en besked                     |

`listMessages`-værktøjet understøtter 15+ søgeparametre inklusive `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` og `has_attachment`. Se [API docs](/email-api) for den fulde liste.

### Mapper — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Angiv `alias_username` og `alias_password` eller sæt miljøvariablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Værktøj         | API-endpoint             | Beskrivelse             |
| --------------- | ------------------------ | ----------------------- |
| `listFolders`  | `GET /v1/folders`        | List alle postkassemapper |
| `createFolder` | `POST /v1/folders`       | Opret en ny mappe       |
| `getFolder`    | `GET /v1/folders/:id`    | Hent mappens detaljer   |
| `updateFolder` | `PUT /v1/folders/:id`    | Omdøb en mappe          |
| `deleteFolder` | `DELETE /v1/folders/:id` | Slet en mappe           |

### Kontakter — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Angiv `alias_username` og `alias_password` eller sæt miljøvariablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Værktøj          | API-endpoint              | Beskrivelse           |
| ---------------- | ------------------------- | --------------------- |
| `listContacts`  | `GET /v1/contacts`        | List alle kontakter   |
| `createContact` | `POST /v1/contacts`       | Opret en ny kontakt   |
| `getContact`    | `GET /v1/contacts/:id`    | Hent kontaktoplysninger |
| `updateContact` | `PUT /v1/contacts/:id`    | Opdater en kontakt    |
| `deleteContact` | `DELETE /v1/contacts/:id` | Slet en kontakt       |

### Kalendere — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Angiv `alias_username` og `alias_password` eller sæt miljøvariablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Værktøj           | API-endpoint               | Beskrivelse           |
| ----------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | List alle kalendere   |
| `createCalendar` | `POST /v1/calendars`       | Opret en ny kalender  |
| `getCalendar`    | `GET /v1/calendars/:id`    | Hent kalenderdetaljer |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Opdater en kalender   |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Slet en kalender      |

### Kalenderbegivenheder — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Angiv `alias_username` og `alias_password` eller sæt miljøvariablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Værktøj                | API-endpoint                     | Beskrivelse          |
| ---------------------- | -------------------------------- | -------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | List alle begivenheder |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Opret en ny begivenhed |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Hent begivenhedsdetaljer |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Opdater en begivenhed  |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Slet en begivenhed     |

### Sieve-scripts (API-nøgle) {#sieve-scripts-api-key}

Disse bruger domæneafgrænsede stier og autentificerer med din API-nøgle.

| Værktøj                | API-endpoint                                                              | Beskrivelse               |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | List scripts for et alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Opret et nyt script       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Hent scriptdetaljer       |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Opdater et script         |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Slet et script            |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktiver et script         |
### Sieve Scripts (Alias Auth) {#sieve-scripts-alias-auth}

Disse bruger alias-niveau godkendelse. Nyttigt til automatisering pr. alias uden behov for API-nøglen.

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller sæt miljøvariablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Værktøj                        | API-endpoint                                | Beskrivelse         |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | List scripts        |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Opret et script     |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Hent scriptdetaljer |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Opdater et script   |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Slet et script      |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivér et script   |

### Domain Members and Invites (API Key) {#domain-members-and-invites-api-key}

| Værktøj               | API-endpoint                                       | Beskrivelse                |
| --------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`    | Ændr et medlems rolle      |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Fjern et medlem            |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`               | Accepter en ventende invitation |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`              | Inviter nogen til et domæne |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`            | Tilbagekald en invitation  |

### Catch-All Passwords (API Key) {#catch-all-passwords-api-key}

| Værktøj                  | API-endpoint                                                  | Beskrivelse                 |
| ------------------------ | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | List catch-all adgangskoder |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Opret en catch-all adgangskode |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Slet en catch-all adgangskode |

### Logs (API Key) {#logs-api-key}

| Værktøj         | API-endpoint            | Beskrivelse                     |
| --------------- | ----------------------- | ------------------------------- |
| `downloadLogs`  | `GET /v1/logs/download` | Download logfiler for e-mail levering |

### Encrypt (No Auth) {#encrypt-no-auth}

| Værktøj          | API-endpoint       | Beskrivelse                  |
| ---------------- | ------------------ | ---------------------------- |
| `encryptRecord`  | `POST /v1/encrypt` | Krypter en DNS TXT-post      |

Dette værktøj kræver ikke godkendelse. Det krypterer videresendelsesposter som `forward-email=user@example.com` til brug i DNS TXT-poster.


## 20 Real-World Use Cases {#20-real-world-use-cases}

Her er praktiske måder at bruge MCP-serveren med din AI-assistent:

### 1. Email Triage {#1-email-triage}

Bed din AI om at scanne din indbakke og opsummere ulæste beskeder. Den kan markere vigtige e-mails, kategorisere efter afsender og udarbejde svar — alt sammen via naturligt sprog. *(Kræver alias-legitimationsoplysninger for adgang til indbakken.)*

### 2. Domain Setup Automation {#2-domain-setup-automation}

Opsætter du et nyt domæne? Bed AI’en om at oprette domænet, tilføje dine aliaser, verificere DNS-poster og teste SMTP-konfigurationen. Hvad der normalt tager 10 minutter med klik i dashboards, bliver til én samtale.

### 3. Bulk Alias Management {#3-bulk-alias-management}

Skal du oprette 20 aliaser til et nyt projekt? Beskriv hvad du har brug for, og lad AI’en klare det gentagne arbejde. Den kan oprette aliaser, sætte videresendelsesregler og generere adgangskoder på én gang.
### 4. Emailkampagneovervågning {#4-email-campaign-monitoring}

Bed din AI om at tjekke afsendelsesgrænser, liste nylige udgående e-mails og rapportere om leveringsstatus. Nyttigt til overvågning af transaktionel e-mail sundhed.

### 5. Kontakt Synkronisering og Oprydning {#5-contact-sync-and-cleanup}

Brug CardDAV-værktøjerne til at liste alle kontakter, finde dubletter, opdatere forældet information eller masseoprette kontakter fra et regneark, du indsætter i chatten. *(Kræver alias-legitimationsoplysninger.)*

### 6. Kalenderstyring {#6-calendar-management}

Opret kalendere, tilføj begivenheder, opdater mødetider og slet aflyste begivenheder — alt sammen via samtale. CalDAV-værktøjerne understøtter fuld CRUD på både kalendere og begivenheder. *(Kræver alias-legitimationsoplysninger.)*

### 7. Sieve Script Automatisering {#7-sieve-script-automation}

Sieve-scripts er kraftfulde, men syntaksen er svær at gennemskue. Bed din AI om at skrive Sieve-scripts for dig: "Filtrer alle e-mails fra <billing@example.com> til en Faktura-mappe" bliver til et fungerende script uden at røre ved RFC 5228-specifikationen.

### 8. Team Onboarding {#8-team-onboarding}

Når et nyt teammedlem starter, bed AI’en om at oprette deres alias, generere en adgangskode, sende dem en velkomstmail med deres legitimationsoplysninger og tilføje dem som domænemedlem. Én prompt, fire API-kald.

### 9. Sikkerhedsrevision {#9-security-auditing}

Bed din AI om at liste alle domæner, tjekke DNS-verifikationsstatus, gennemgå alias-konfigurationer og identificere domæner med uverificerede poster. En hurtig sikkerhedsgennemgang i naturligt sprog.

### 10. Opsætning af E-mailvideresendelse {#10-email-forwarding-setup}

Skal du opsætte e-mailvideresendelse for et nyt domæne? Bed AI’en om at oprette domænet, tilføje videresendelsesaliaser, kryptere DNS-posterne og verificere, at alt er konfigureret korrekt.

### 11. Indbakke Søgning og Analyse {#11-inbox-search-and-analysis}

Brug beskedsøgningsværktøjerne til at finde specifikke e-mails: "Find alle e-mails fra <john@example.com> inden for de sidste 30 dage, som har vedhæftede filer." De 15+ søgeparametre gør dette kraftfuldt. *(Kræver alias-legitimationsoplysninger.)*

### 12. Mappeorganisering {#12-folder-organization}

Bed din AI om at oprette en mappestruktur til et nyt projekt, flytte beskeder mellem mapper eller rydde op i gamle mapper, du ikke længere har brug for. *(Kræver alias-legitimationsoplysninger.)*

### 13. Adgangskode Rotation {#13-password-rotation}

Generer nye alias-adgangskoder efter en tidsplan. Bed din AI om at generere en ny adgangskode for hvert alias og rapportere de nye legitimationsoplysninger.

### 14. Kryptering af DNS-poster {#14-dns-record-encryption}

Krypter dine videresendelsespunkter, før du tilføjer dem til DNS. `encryptRecord`-værktøjet håndterer dette uden godkendelse — nyttigt til hurtige enkeltstående krypteringer.

### 15. Analyse af Leveringslog {#15-delivery-log-analysis}

Download dine e-mail leveringslogs og bed AI’en om at analysere bounce-rater, identificere problematiske modtagere eller spore leveringstider.

### 16. Multi-domænestyring {#16-multi-domain-management}

Hvis du administrerer flere domæner, bed AI’en om at give dig en statusrapport: hvilke domæner er verificerede, hvilke har problemer, hvor mange aliaser hvert har, og hvordan afsendelsesgrænserne ser ud.

### 17. Catch-All Konfiguration {#17-catch-all-configuration}

Opsæt catch-all adgangskoder for domæner, der skal modtage e-mail på enhver adresse. AI’en kan oprette, liste og administrere disse adgangskoder for dig.

### 18. Domæneinvitation Administration {#18-domain-invite-management}

Inviter teammedlemmer til at administrere domæner, tjek ventende invitationer og ryd op i udløbne. Nyttigt for organisationer med flere domæneadministratorer.

### 19. S3 Lager Test {#19-s3-storage-testing}

Hvis du bruger tilpasset S3-lager til e-mail-backups, bed AI’en om at teste forbindelsen og verificere, at den fungerer korrekt.

### 20. Udkast til E-mail Komposition {#20-email-draft-composition}

Opret udkast til e-mails i din postkasse uden at sende dem. Nyttigt til at forberede e-mails, der skal gennemgås før afsendelse, eller til at bygge e-mail-skabeloner. *(Kræver alias-legitimationsoplysninger.)*


## Eksempel Prompter {#example-prompts}

Her er prompter, du kan bruge direkte med din AI-assistent:

**Afsendelse af e-mail:**

> "Send en e-mail fra <hello@mydomain.com> til <john@example.com> med emnet 'Møde i morgen' og teksten 'Hej John, er vi stadig på til kl. 14?'"
**Domænestyring:**

> "List alle mine domæner og fortæl mig, hvilke der har uverificerede DNS-poster."

**Aliasoprettelse:**

> "Opret et nyt alias <support@mydomain.com>, der videresender til min personlige e-mail."

**Indbakke-søgning (kræver alias-legitimationsoplysninger):**

> "Find alle ulæste e-mails fra den sidste uge, der nævner 'faktura'."

**Kalender (kræver alias-legitimationsoplysninger):**

> "Opret en kalender kaldet 'Arbejde' og tilføj et møde i morgen kl. 14 kaldet 'Team Standup'."

**Sieve-scripts:**

> "Skriv et Sieve-script for <info@mydomain.com>, der automatisk svarer på e-mails med 'Tak for din henvendelse, vi vender tilbage inden for 24 timer.'"

**Masseoperationer:**

> "Opret aliaser for sales@, support@, billing@ og info@ på mydomain.com, alle videresendende til <team@mydomain.com>."

**Sikkerhedstjek:**

> "Tjek DNS- og SMTP-verifikationsstatus for alle mine domæner og fortæl mig, om noget kræver opmærksomhed."

**Generer alias-adgangskode:**

> "Generer en adgangskode til aliaset <user@example.com>, så jeg kan få adgang til min indbakke."


## Miljøvariabler {#environment-variables}

| Variabel                       | Påkrævet | Standard                       | Beskrivelse                                                                    |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Ja       | —                              | Din Forward Email API-nøgle (bruges som Basic auth brugernavn til API-nøgle-endpoints) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nej      | —                              | Alias e-mailadresse til postkasse-endpoints (f.eks. `user@example.com`)        |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nej      | —                              | Genereret alias-adgangskode til postkasse-endpoints                            |
| `FORWARD_EMAIL_API_URL`        | Nej      | `https://api.forwardemail.net` | API base-URL (til selvhostet eller test)                                       |


## Sikkerhed {#security}

MCP-serveren kører lokalt på din maskine. Sådan fungerer sikkerheden:

* **Dine legitimationsoplysninger forbliver lokale.** Både din API-nøgle og alias-legitimationsoplysninger læses fra miljøvariabler og bruges til at autentificere API-forespørgsler via HTTP Basic auth. De sendes aldrig til AI-modellen.
* **stdio transport.** Serveren kommunikerer med AI-klienten over stdin/stdout. Ingen netværksporte åbnes.
* **Ingen datalagring.** Serveren er statsløs. Den cacher, logger eller gemmer ikke nogen af dine e-maildata.
* **Open source.** Hele kodebasen findes på [GitHub](https://github.com/forwardemail/mcp-server). Du kan gennemgå hver linje.


## Programmerbar brug {#programmatic-usage}

Du kan også bruge serveren som et bibliotek:

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

Forward Email MCP Server er [open source på GitHub](https://github.com/forwardemail/mcp-server) under BUSL-1.1 licensen. Vi tror på gennemsigtighed. Hvis du finder en fejl eller ønsker en funktion, [åbn en issue](https://github.com/forwardemail/mcp-server/issues).
