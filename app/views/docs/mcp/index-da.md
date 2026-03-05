# Forward Email MCP Server

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Vores <a href="https://github.com/forwardemail/mcp-server">open source MCP-server</a> lader AI-assistenter som Claude, ChatGPT, Cursor og Windsurf administrere din e-mail, domæner, aliasser, kontakter og kalendere gennem naturligt sprog. Alle 68 API-endepunkter er eksponeret som MCP-værktøjer. Den kører lokalt via <code>npx @forwardemail/mcp-server</code> — dine legitimationsoplysninger forlader aldrig din maskine.
</p>

## Indholdsfortegnelse {#table-of-contents}

* [Hvad er MCP?](#what-is-mcp)
* [Hurtig start](#quick-start)
  * [Få en API-nøgle](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andre MCP-klienter](#other-mcp-clients)
* [Godkendelse](#authentication)
  * [API-nøgle godkendelse](#api-key-auth)
  * [Alias godkendelse](#alias-auth)
  * [Generering af et alias-adgangskode](#generating-an-alias-password)
* [Alle 68 værktøjer](#all-68-tools)
  * [Konto (API-nøgle eller alias-godkendelse)](#account-api-key-or-alias-auth)
  * [Domæner (API-nøgle)](#domains-api-key)
  * [Aliasser (API-nøgle)](#aliases-api-key)
  * [E-mails — Udgående SMTP (API-nøgle; Send understøtter begge)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Beskeder — IMAP (Alias-godkendelse)](#messages--imap-alias-auth)
  * [Mapper — IMAP (Alias-godkendelse)](#folders--imap-alias-auth)
  * [Kontakter — CardDAV (Alias-godkendelse)](#contacts--carddav-alias-auth)
  * [Kalendere — CalDAV (Alias-godkendelse)](#calendars--caldav-alias-auth)
  * [Kalenderbegivenheder — CalDAV (Alias-godkendelse)](#calendar-events--caldav-alias-auth)
  * [Sieve-scripts (API-nøgle)](#sieve-scripts-api-key)
  * [Sieve-scripts (Alias-godkendelse)](#sieve-scripts-alias-auth)
  * [Domæne-medlemmer og invitationer (API-nøgle)](#domain-members-and-invites-api-key)
  * [Catch-All-adgangskoder (API-nøgle)](#catch-all-passwords-api-key)
  * [Logfiler (API-nøgle)](#logs-api-key)
  * [Krypter (Ingen godkendelse)](#encrypt-no-auth)
* [20 virkelige brugsscenarier](#20-real-world-use-cases)
* [Eksempel på prompter](#example-prompts)
* [Miljøvariabler](#environment-variables)
* [Sikkerhed](#security)
* [Programmatisk brug](#programmatic-usage)
* [Open Source](#open-source)


## Hvad er MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) er en åben standard skabt af Anthropic, der lader AI-modeller sikkert kalde eksterne værktøjer. I stedet for at kopiere-indsætte API-svar i et chatvindue, giver MCP modellen direkte, struktureret adgang til dine tjenester.

Vores MCP-server omslutter hele [Forward Email API'et](/email-api) — hvert endepunkt, hver parameter — og eksponerer dem som værktøjer, som enhver MCP-kompatibel klient kan bruge. Serveren kører lokalt på din maskine ved hjælp af stdio-transport. Dine legitimationsoplysninger forbliver i dine miljøvariabler og sendes aldrig til AI-modellen.


## Hurtig start {#quick-start}

### Få en API-nøgle {#get-an-api-key}

1. Log ind på din [Forward Email-konto](/my-account/domains).
2. Gå til **Min konto** → **Sikkerhed** → **API-nøgler**.
3. Generer en ny API-nøgle og kopier den.

### Claude Desktop {#claude-desktop}

Tilføj dette til din Claude Desktop-konfigurationsfil:

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

Genstart Claude Desktop. Du skulle gerne se Forward Email-værktøjerne i værktøjsvælgeren.

> **Bemærk:** Variablerne `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` er valgfrie, men kræves for postkasseværktøjer (beskeder, mapper, kontakter, kalendere). Se [Godkendelse](#authentication) for detaljer.

### Cursor {#cursor}

Åbn Cursor-indstillinger → MCP → Tilføj server:

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

Åbn Windsurf-indstillinger → MCP → Tilføj server med den samme konfiguration som ovenfor.

### Andre MCP-klienter {#other-mcp-clients}

Enhver klient, der understøtter MCP stdio-transport, vil fungere. Kommandoen er:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Godkendelse {#authentication}

Forward Email API'et bruger **HTTP Basic authentication** med to forskellige typer legitimationsoplysninger afhængigt af endepunktet. MCP-serveren håndterer dette automatisk – du skal blot angive de rigtige legitimationsoplysninger.

### API-nøgle godkendelse {#api-key-auth}

De fleste administrationsendepunkter (domæner, aliasser, udgående e-mails, logfiler) bruger din **API-nøgle** som Basic auth-brugernavn med en tom adgangskode.

Dette er den samme API-nøgle, som du bruger til REST API'et. Indstil den via miljøvariablen `FORWARD_EMAIL_API_KEY`.

### Alias godkendelse {#alias-auth}

Postkasseendepunkter (beskeder, mapper, kontakter, kalendere, alias-scoped sieve-scripts) bruger **alias-legitimationsoplysninger** — alias-e-mailadressen som brugernavn og en genereret adgangskode som adgangskode.

Disse endepunkter får adgang til data pr. alias via IMAP-, CalDAV- og CardDAV-protokoller. De kræver alias-e-mailen og en genereret adgangskode, ikke API-nøglen.

Du kan angive alias-legitimationsoplysninger på to måder:

1. **Miljøvariabler** (anbefales til standardalias): Indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametre pr. værktøjskald**: Send `alias_username` og `alias_password` som argumenter til ethvert alias-godkendelsesværktøj. Disse tilsidesætter miljøvariablerne, hvilket er nyttigt, når du arbejder med flere aliasser.

### Generering af et alias-adgangskode {#generating-an-alias-password}

Før du kan bruge alias-godkendelsesværktøjer, skal du generere en adgangskode til aliaset. Du kan gøre dette med værktøjet `generateAliasPassword` eller via API'et:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Svaret inkluderer felterne `username` (alias-e-mail) og `password`. Brug disse som dine alias-legitimationsoplysninger.

> **Tip:** Du kan også spørge din AI-assistent: *"Generer en adgangskode til aliaset user@example.com på domænet example.com"* — den vil kalde `generateAliasPassword`-værktøjet og returnere legitimationsoplysningerne.

Tabellen nedenfor opsummerer, hvilken godkendelsesmetode hver værktøjsgruppe kræver:

| Værktøjsgruppe | Godkendelsesmetode | Legitimationsoplysninger |
|-----------|-------------|-------------|
| Konto | API-nøgle **eller** alias-godkendelse | Enten |
| Domæner, aliasser, domæne-medlemmer, invitationer, catch-all-adgangskoder | API-nøgle | `FORWARD_EMAIL_API_KEY` |
| Udgående e-mails (liste, hent, slet, begræns) | API-nøgle | `FORWARD_EMAIL_API_KEY` |
| Send e-mail | API-nøgle **eller** alias-godkendelse | Enten |
| Beskeder (IMAP) | Alias-godkendelse | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mapper (IMAP) | Alias-godkendelse | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakter (CardDAV) | Alias-godkendelse | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendere (CalDAV) | Alias-godkendelse | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderbegivenheder (CalDAV) | Alias-godkendelse | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-scripts (domæne-scoped) | API-nøgle | `FORWARD_EMAIL_API_KEY` |
| Sieve-scripts (alias-scoped) | Alias-godkendelse | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logfiler | API-nøgle | `FORWARD_EMAIL_API_KEY` |
| Krypter | Ingen | Ingen legitimationsoplysninger nødvendige |


## Alle 68 værktøjer {#all-68-tools}

Hvert værktøj mapper direkte til et [Forward Email API](/email-api)-endepunkt. Parametre bruger de samme navne som i API-dokumentationen. Godkendelsesmetoden er angivet i hver sektionsoverskrift.

### Konto (API-nøgle eller alias-godkendelse) {#account-api-key-or-alias-auth}

Med API-nøgle-godkendelse returnerer disse dine brugerkontooplysninger. Med alias-godkendelse returnerer de alias-/postkasseoplysninger, herunder lagerkvote og indstillinger.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Hent dine kontooplysninger |
| `updateAccount` | `PUT /v1/account` | Opdater dine kontoindstillinger |

### Domæner (API-nøgle) {#domains-api-key}

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Vis alle dine domæner |
| `createDomain` | `POST /v1/domains` | Tilføj et nyt domæne |
| `getDomain` | `GET /v1/domains/:domain_id` | Hent domænedetaljer |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Opdater domæneindstillinger |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Fjern et domæne |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Bekræft DNS-poster |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Bekræft SMTP-konfiguration |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Test brugerdefineret S3-lagring |

### Aliasser (API-nøgle) {#aliases-api-key}

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Vis aliasser for et domæne |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Opret et nyt alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Hent aliasdetaljer |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Opdater et alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Slet et alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generer IMAP/SMTP-adgangskode til alias-godkendelse |

### E-mails — Udgående SMTP (API-nøgle; Send understøtter begge) {#emails--outbound-smtp-api-key-send-supports-both}

| Værktøj | API-endepunkt | Godkendelse | Beskrivelse |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API-nøgle eller alias-godkendelse | Send en e-mail via SMTP |
| `listEmails` | `GET /v1/emails` | API-nøgle | Vis udgående e-mails |
| `getEmail` | `GET /v1/emails/:id` | API-nøgle | Hent e-mail-detaljer og status |
| `deleteEmail` | `DELETE /v1/emails/:id` | API-nøgle | Slet en e-mail i kø |
| `getEmailLimit` | `GET /v1/emails/limit` | API-nøgle | Tjek din afsendelsesgrænse |

Værktøjet `sendEmail` accepterer `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` og `attachments`. Dette er det samme som `POST /v1/emails`-endepunktet.

### Beskeder — IMAP (Alias-godkendelse) {#messages--imap-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` miljøvariabler.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Vis og søg i beskeder i en postkasse |
| `createMessage` | `POST /v1/messages` | Opret et udkast eller upload en besked |
| `getMessage` | `GET /v1/messages/:id` | Hent en besked efter ID |
| `updateMessage` | `PUT /v1/messages/:id` | Opdater flag (læst, stjernemarkeret osv.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Slet en besked |

Værktøjet `listMessages` understøtter mere end 15 søgeparametre, herunder `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` og `has_attachment`. Se [API-dokumentationen](/email-api) for den fulde liste.

### Mapper — IMAP (Alias-godkendelse) {#folders--imap-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` miljøvariabler.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Vis alle postkassemapper |
| `createFolder` | `POST /v1/folders` | Opret en ny mappe |
| `getFolder` | `GET /v1/folders/:id` | Hent mappens detaljer |
| `updateFolder` | `PUT /v1/folders/:id` | Omdøb en mappe |
| `deleteFolder` | `DELETE /v1/folders/:id` | Slet en mappe |

### Kontakter — CardDAV (Alias-godkendelse) {#contacts--carddav-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` miljøvariabler.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Vis alle kontakter |
| `createContact` | `POST /v1/contacts` | Opret en ny kontakt |
| `getContact` | `GET /v1/contacts/:id` | Hent kontaktdetaljer |
| `updateContact` | `PUT /v1/contacts/:id` | Opdater en kontakt |
| `deleteContact` | `DELETE /v1/contacts/:id` | Slet en kontakt |

### Kalendere — CalDAV (Alias-godkendelse) {#calendars--caldav-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` miljøvariabler.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Vis alle kalendere |
| `createCalendar` | `POST /v1/calendars` | Opret en ny kalender |
| `getCalendar` | `GET /v1/calendars/:id` | Hent kalenderdetaljer |
| `updateCalendar` | `PUT /v1/calendars/:id` | Opdater en kalender |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Slet en kalender |

### Kalenderbegivenheder — CalDAV (Alias-godkendelse) {#calendar-events--caldav-alias-auth}

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` miljøvariabler.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Vis alle begivenheder |
| `createCalendarEvent` | `POST /v1/calendar-events` | Opret en ny begivenhed |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Hent begivenhedsdetaljer |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Opdater en begivenhed |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Slet en begivenhed |

### Sieve-scripts (API-nøgle) {#sieve-scripts-api-key}

Disse bruger domæne-scoped stier og godkendes med din API-nøgle.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Vis scripts for et alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Opret et nyt script |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Hent scriptdetaljer |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Opdater et script |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Slet et script |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktiver et script |

### Sieve-scripts (Alias-godkendelse) {#sieve-scripts-alias-auth}

Disse bruger alias-niveau godkendelse. Nyttigt til automatisering pr. alias uden at skulle bruge API-nøglen.

> **Kræver alias-legitimationsoplysninger.** Send `alias_username` og `alias_password` eller indstil `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` miljøvariabler.

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Vis scripts |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Opret et script |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Hent scriptdetaljer |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Opdater et script |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Slet et script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktiver et script |

### Domæne-medlemmer og invitationer (API-nøgle) {#domain-members-and-invites-api-key}

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Skift et medlems rolle |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Fjern et medlem |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Accepter en ventende invitation |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Inviter nogen til et domæne |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Tilbagekald en invitation |

### Catch-All-adgangskoder (API-nøgle) {#catch-all-passwords-api-key}

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Vis catch-all-adgangskoder |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Opret en catch-all-adgangskode |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Slet en catch-all-adgangskode |

### Logfiler (API-nøgle) {#logs-api-key}

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Download e-mailleveringslogfiler |

### Krypter (Ingen godkendelse) {#encrypt-no-auth}

| Værktøj | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Krypter en DNS TXT-post |

Dette værktøj kræver ikke godkendelse. Det krypterer videresendelsesposter som `forward-email=user@example.com` til brug i DNS TXT-poster.


## 20 virkelige brugsscenarier {#20-real-world-use-cases}

Her er praktiske måder at bruge MCP-serveren med din AI-assistent på:

### 1. E-mail-triage

Bed din AI om at scanne din indbakke og opsummere ulæste beskeder. Den kan markere presserende e-mails, kategorisere efter afsender og udarbejde svar – alt sammen gennem naturligt sprog. *(Kræver alias-legitimationsoplysninger for adgang til indbakken.)*

### 2. Automatisering af domæneopsætning

Opsætter du et nyt domæne? Bed AI'en om at oprette domænet, tilføje dine aliasser, bekræfte DNS-poster og teste SMTP-konfigurationen. Hvad der normalt tager 10 minutter med at klikke gennem dashboards, bliver til én samtale.

### 3. Administration af massealiasser

Har du brug for at oprette 20 aliasser til et nyt projekt? Beskriv, hvad du har brug for, og lad AI'en håndtere det gentagne arbejde. Den kan oprette aliasser, indstille videresendelsesregler og generere adgangskoder i én omgang.

### 4. Overvågning af e-mailkampagner

Bed din AI om at tjekke afsendelsesgrænser, liste nylige udgående e-mails og rapportere om leveringsstatus. Nyttigt til overvågning af transaktionel e-mail-sundhed.

### 5. Kontaktsynkronisering og oprydning

Brug CardDAV-værktøjerne til at liste alle kontakter, finde dubletter, opdatere forældede oplysninger eller masseoprette kontakter fra et regneark, du indsætter i chatten. *(Kræver alias-legitimationsoplysninger.)*

### 6. Kalenderstyring

Opret kalendere, tilføj begivenheder, opdater mødetider og slet annullerede begivenheder – alt sammen via samtale. CalDAV-værktøjerne understøtter fuld CRUD på både kalendere og begivenheder. *(Kræver alias-legitimationsoplysninger.)*

### 7. Automatisering af Sieve-scripts

Sieve-scripts er kraftfulde, men syntaksen er kryptisk. Bed din AI om at skrive Sieve-scripts for dig: "Filtrer alle e-mails fra billing@example.com ind i en faktureringsmappe" bliver til et fungerende script uden at røre RFC 5228-specifikationen.

### 8. Team Onboarding

Når et nyt teammedlem tiltræder, bed AI'en om at oprette deres alias, generere en adgangskode, sende dem en velkomst-e-mail med deres legitimationsoplysninger og tilføje dem som domæne-medlem. Én prompt, fire API-kald.

### 9. Sikkerhedsrevision

Bed din AI om at liste alle domæner, kontrollere DNS-verifikationsstatus, gennemgå alias-konfigurationer og identificere domæner med uverificerede poster. En hurtig sikkerhedssweep i naturligt sprog.

### 10. Opsætning af e-mail-videresendelse

Opsætter du e-mail-videresendelse for et nyt domæne? Bed AI'en om at oprette domænet, tilføje videresendelsesaliasser, kryptere DNS-posterne og bekræfte, at alt er korrekt konfigureret.

### 11. Søgning og analyse af indbakke

Brug meddelelsessøgeværktøjerne til at finde specifikke e-mails: "Find alle e-mails fra john@example.com inden for de sidste 30 dage, der har vedhæftede filer." De mere end 15 søgeparametre gør dette kraftfuldt. *(Kræver alias-legitimationsoplysninger.)*

### 12. Mappeorganisation

Bed din AI om at oprette en mappestruktur til et nyt projekt, flytte beskeder mellem mapper eller rydde op i gamle mapper, du ikke længere har brug for. *(Kræver alias-legitimationsoplysninger.)*

### 13. Adgangskoderotation

Generer nye alias-adgangskoder efter en tidsplan. Bed din AI om at generere en ny adgangskode til hvert alias og rapportere de nye legitimationsoplysninger.

### 14. DNS-postkryptering

Krypter dine videresendelsesposter, før du tilføjer dem til DNS. Værktøjet `encryptRecord` håndterer dette uden godkendelse – nyttigt til hurtige engangskrypteringer.

### 15. Analyse af leveringslogfiler

Download dine e-mailleveringslogfiler og bed AI'en om at analysere afvisningsrater, identificere problematiske modtagere eller spore leveringstider.

### 16. Multi-domæne administration

Hvis du administrerer flere domæner, bed AI'en om at give dig en statusrapport: hvilke domæner er verificeret, hvilke har problemer, hvor mange aliasser hver har, og hvordan afsendelsesgrænserne ser ud.

### 17. Catch-All-konfiguration

Opsæt catch-all-adgangskoder til domæner, der skal modtage e-mail på enhver adresse. AI'en kan oprette, liste og administrere disse adgangskoder for dig.

### 18. Administration af domæneinvitationer

Inviter teammedlemmer til at administrere domæner, tjekke ventende invitationer og rydde op i udløbne. Nyttigt for organisationer med flere domæneadministratorer.

### 19. S3-lagertest

Hvis du bruger brugerdefineret S3-lagring til e-mail-sikkerhedskopier, bed AI'en om at teste forbindelsen og bekræfte, at den fungerer korrekt.

### 20. Udkast til e-mail-komposition

Opret udkast til e-mails i din postkasse uden at sende dem. Nyttigt til at forberede e-mails, der skal gennemgås, før de sendes, eller til at opbygge e-mail-skabeloner. *(Kræver alias-legitimationsoplysninger.)*


## Eksempel på prompter {#example-prompts}

Her er prompter, du kan bruge direkte med din AI-assistent:

**Afsendelse af e-mail:**
> "Send en e-mail fra hello@mydomain.com til john@example.com med emnet 'Møde i morgen' og teksten 'Hej John, er vi stadig på kl. 14?'"

**Domæneadministration:**
> "Vis alle mine domæner og fortæl mig, hvilke der har uverificerede DNS-poster."

**Oprettelse af alias:**
> "Opret et nyt alias support@mydomain.com, der videresender til min personlige e-mail."

**Indbakkessøgning (kræver alias-legitimationsoplysninger):**
> "Find alle ulæste e-mails fra den sidste uge, der nævner 'faktura'."

**Kalender (kræver alias-legitimationsoplysninger):**
> "Opret en kalender kaldet 'Arbejde' og tilføj et møde til i morgen kl. 14 kaldet 'Team Standup'."

**Sieve-scripts:**
> "Skriv et Sieve-script til info@mydomain.com, der automatisk svarer på e-mails med 'Tak for din henvendelse, vi vender tilbage til dig inden for 24 timer.'"

**Masseoperationer:**
> "Opret aliasser for sales@, support@, billing@ og info@ på mydomain.com, alle videresender til team@mydomain.com."

**Sikkerhedstjek:**
> "Tjek DNS- og SMTP-verifikationsstatus for alle mine domæner og fortæl mig, om der er noget, der kræver opmærksomhed."

**Generer alias-adgangskode:**
> "Generer en adgangskode til aliaset user@example.com, så jeg kan få adgang til min indbakke."


## Miljøvariabler {#environment-variables}

| Variabel | Påkrævet | Standard | Beskrivelse |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Ja | — | Din Forward Email API-nøgle (bruges som Basic auth-brugernavn til API-nøgle-endepunkter) |
| `FORWARD_EMAIL_ALIAS_USER` | Nej | — | Alias-e-mailadresse til postkasse-endepunkter (f.eks. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nej | — | Genereret alias-adgangskode til postkasse-endepunkter |
| `FORWARD_EMAIL_API_URL` | Nej | `https://api.forwardemail.net` | API-base-URL (til selvhostet eller test) |


## Sikkerhed {#security}

MCP-serveren kører lokalt på din maskine. Her er, hvordan sikkerheden fungerer:

*   **Dine legitimationsoplysninger forbliver lokale.** Både din API-nøgle og alias-legitimationsoplysninger læses fra miljøvariabler og bruges til at godkende API-anmodninger via HTTP Basic auth. De sendes aldrig til AI-modellen.
*   **stdio-transport.** Serveren kommunikerer med AI-klienten via stdin/stdout. Ingen netværksporte åbnes.
*   **Ingen datalagring.** Serveren er statsløs. Den cacher, logger eller gemmer ingen af dine e-mail-data.
*   **Open source.** Hele kodebasen er på [GitHub](https://github.com/forwardemail/mcp-server). Du kan gennemgå hver linje.


## Programmatisk brug {#programmatic-usage}

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

Forward Email MCP Server er [open source på GitHub](https://github.com/forwardemail/mcp-server) under BUSL-1.1-licensen. Vi tror på gennemsigtighed. Hvis du finder en fejl eller ønsker en funktion, [opret et problem](https://github.com/forwardemail/mcp-server/issues).

