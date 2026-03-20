# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Vår <a href="https://github.com/forwardemail/mcp-server">åpne kildekode MCP-server</a> lar AI-assistenter som Claude, ChatGPT, Cursor og Windsurf administrere e-post, domener, aliaser, kontakter og kalendere gjennom naturlig språk. Alle 68 API-endepunkter er eksponert som MCP-verktøy. Den kjører lokalt via <code>npx @forwardemail/mcp-server</code> — dine legitimasjoner forlater aldri maskinen din.
</p>


## Innholdsfortegnelse {#table-of-contents}

* [Hva er MCP?](#what-is-mcp)
* [Rask start](#quick-start)
  * [Få en API-nøkkel](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andre MCP-klienter](#other-mcp-clients)
* [Autentisering](#authentication)
  * [API-nøkkel autentisering](#api-key-auth)
  * [Alias autentisering](#alias-auth)
  * [Generere et alias-passord](#generating-an-alias-password)
* [Alle 68 verktøy](#all-68-tools)
  * [Konto (API-nøkkel eller alias autentisering)](#account-api-key-or-alias-auth)
  * [Domener (API-nøkkel)](#domains-api-key)
  * [Alias (API-nøkkel)](#aliases-api-key)
  * [E-poster — Utgående SMTP (API-nøkkel; Send støtter begge)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Meldinger — IMAP (Alias autentisering)](#messages--imap-alias-auth)
  * [Mapper — IMAP (Alias autentisering)](#folders--imap-alias-auth)
  * [Kontakter — CardDAV (Alias autentisering)](#contacts--carddav-alias-auth)
  * [Kalendere — CalDAV (Alias autentisering)](#calendars--caldav-alias-auth)
  * [Kalenderhendelser — CalDAV (Alias autentisering)](#calendar-events--caldav-alias-auth)
  * [Sieve-skript (API-nøkkel)](#sieve-scripts-api-key)
  * [Sieve-skript (Alias autentisering)](#sieve-scripts-alias-auth)
  * [Domene-medlemmer og invitasjoner (API-nøkkel)](#domain-members-and-invites-api-key)
  * [Catch-All-passord (API-nøkkel)](#catch-all-passwords-api-key)
  * [Logger (API-nøkkel)](#logs-api-key)
  * [Krypter (Ingen autentisering)](#encrypt-no-auth)
* [20 virkelige bruksområder](#20-real-world-use-cases)
  * [1. E-post sortering](#1-email-triage)
  * [2. Automatisering av domeneoppsett](#2-domain-setup-automation)
  * [3. Massehåndtering av aliaser](#3-bulk-alias-management)
  * [4. Overvåking av e-postkampanjer](#4-email-campaign-monitoring)
  * [5. Synkronisering og opprydding av kontakter](#5-contact-sync-and-cleanup)
  * [6. Kalenderadministrasjon](#6-calendar-management)
  * [7. Automatisering av Sieve-skript](#7-sieve-script-automation)
  * [8. Team onboarding](#8-team-onboarding)
  * [9. Sikkerhetsrevisjon](#9-security-auditing)
  * [10. Oppsett av e-post videresending](#10-email-forwarding-setup)
  * [11. Søking og analyse i innboks](#11-inbox-search-and-analysis)
  * [12. Organisering av mapper](#12-folder-organization)
  * [13. Passordrotasjon](#13-password-rotation)
  * [14. Kryptering av DNS-poster](#14-dns-record-encryption)
  * [15. Analyse av leveringslogger](#15-delivery-log-analysis)
  * [16. Administrasjon av flere domener](#16-multi-domain-management)
  * [17. Catch-All-konfigurasjon](#17-catch-all-configuration)
  * [18. Administrasjon av domeneinvitasjoner](#18-domain-invite-management)
  * [19. Testing av S3-lagring](#19-s3-storage-testing)
  * [20. Komponering av e-postutkast](#20-email-draft-composition)
* [Eksempelsprompter](#example-prompts)
* [Miljøvariabler](#environment-variables)
* [Sikkerhet](#security)
* [Programmatisk bruk](#programmatic-usage)
* [Åpen kildekode](#open-source)


## Hva er MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) er en åpen standard laget av Anthropic som lar AI-modeller sikkert kalle eksterne verktøy. I stedet for å kopiere og lime inn API-svar i et chat-vindu, gir MCP modellen direkte, strukturert tilgang til tjenestene dine.

Vår MCP-server pakker inn hele [Forward Email API](/email-api) — hvert endepunkt, hver parameter — og eksponerer dem som verktøy som enhver MCP-kompatibel klient kan bruke. Serveren kjører lokalt på maskinen din ved bruk av stdio-transport. Dine legitimasjoner forblir i miljøvariablene dine og sendes aldri til AI-modellen.


## Rask start {#quick-start}

### Få en API-nøkkel {#get-an-api-key}
1. Logg inn på din [Forward Email-konto](/my-account/domains).
2. Gå til **Min konto** → **Sikkerhet** → **API-nøkler**.
3. Generer en ny API-nøkkel og kopier den.

### Claude Desktop {#claude-desktop}

Legg dette til i din Claude Desktop konfigurasjonsfil:

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

Start Claude Desktop på nytt. Du skal nå se Forward Email-verktøyene i verktøysvelgeren.

> **Merk:** Variablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD` er valgfrie, men kreves for postkasseverktøy (meldinger, mapper, kontakter, kalendere). Se [Autentisering](#authentication) for detaljer.

### Cursor {#cursor}

Åpne Cursor-innstillinger → MCP → Legg til server:

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

Åpne Windsurf-innstillinger → MCP → Legg til server med samme konfigurasjon som ovenfor.

### Andre MCP-klienter {#other-mcp-clients}

Enhver klient som støtter MCP stdio-transport vil fungere. Kommandoen er:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentisering {#authentication}

Forward Email API bruker **HTTP Basic autentisering** med to forskjellige legitimasjonstyper avhengig av endepunktet. MCP-serveren håndterer dette automatisk — du trenger bare å oppgi riktige legitimasjoner.

### API-nøkkel-autentisering {#api-key-auth}

De fleste administrasjonsendepunkter (domener, aliaser, utgående e-poster, logger) bruker din **API-nøkkel** som Basic auth-brukernavn med et tomt passord.

Dette er samme API-nøkkel som du bruker for REST API-et. Sett den via miljøvariabelen `FORWARD_EMAIL_API_KEY`.

### Alias-autentisering {#alias-auth}

Postkasseendepunkter (meldinger, mapper, kontakter, kalendere, alias-avgrensede sieve-skript) bruker **alias-legitimasjon** — alias-e-postadressen som brukernavn og et generert passord som passord.

Disse endepunktene får tilgang til data per alias via IMAP, CalDAV og CardDAV-protokoller. De krever alias-e-post og et generert passord, ikke API-nøkkelen.

Du kan oppgi alias-legitimasjon på to måter:

1. **Miljøvariabler** (anbefalt for standard alias): Sett `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametere per verktøysanrop**: Send `alias_username` og `alias_password` som argumenter til ethvert alias-autentiseringsverktøy. Disse overstyrer miljøvariablene, noe som er nyttig når du arbeider med flere aliaser.

### Generere et alias-passord {#generating-an-alias-password}

Før du kan bruke alias-autentiseringsverktøy, må du generere et passord for aliaset. Du kan gjøre dette med verktøyet `generateAliasPassword` eller via API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Responsen inkluderer feltene `username` (alias-e-post) og `password`. Bruk disse som dine alias-legitimasjoner.

> **Tips:** Du kan også spørre din AI-assistent: *"Generate a password for the alias <user@example.com> on domain example.com"* — den vil kalle `generateAliasPassword`-verktøyet og returnere legitimasjonene.

Tabellen nedenfor oppsummerer hvilken autentiseringsmetode hver verktøygruppe krever:

| Verktøygruppe                                                  | Autentiseringsmetode      | Legitimasjoner                                             |
| -------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| Konto                                                          | API-nøkkel **eller** Alias-autentisering | Begge deler                                                |
| Domener, aliaser, domenemedlemmer, invitasjoner, Catch-All-passord | API-nøkkel               | `FORWARD_EMAIL_API_KEY`                                     |
| Utgående e-poster (liste, hent, slett, begrens)                | API-nøkkel               | `FORWARD_EMAIL_API_KEY`                                     |
| Send e-post                                                    | API-nøkkel **eller** Alias-autentisering | Begge deler                                                |
| Meldinger (IMAP)                                               | Alias-autentisering      | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mapper (IMAP)                                                  | Alias-autentisering      | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakter (CardDAV)                                           | Alias-autentisering      | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendere (CalDAV)                                           | Alias-autentisering      | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderhendelser (CalDAV)                                   | Alias-autentisering      | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-skript (domene-avgrenset)                              | API-nøkkel               | `FORWARD_EMAIL_API_KEY`                                     |
| Sieve-skript (alias-avgrenset)                               | Alias-autentisering      | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logger                                                       | API-nøkkel               | `FORWARD_EMAIL_API_KEY`                                     |
| Krypter                                                     | Ingen                    | Ingen legitimasjon nødvendig                                |
## Alle 68 verktøy {#all-68-tools}

Hvert verktøy kobles direkte til et [Forward Email API](/email-api) endepunkt. Parametere bruker de samme navnene som i API-dokumentasjonen. Autentiseringsmetoden er angitt i hver seksjonstittel.

### Konto (API-nøkkel eller Alias-autentisering) {#account-api-key-or-alias-auth}

Med API-nøkkel-autentisering returnerer disse brukerens kontoinformasjon. Med alias-autentisering returneres alias-/postboksinformasjon inkludert lagringskvote og innstillinger.

| Verktøy          | API-endepunkt      | Beskrivelse                  |
| --------------- | ----------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account` | Hent kontoinformasjonen din  |
| `updateAccount` | `PUT /v1/account` | Oppdater kontoinnstillingene dine |

### Domener (API-nøkkel) {#domains-api-key}

| Verktøy               | API-endepunkt                                     | Beskrivelse               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | List opp alle domenene dine |
| `createDomain`        | `POST /v1/domains`                               | Legg til et nytt domene    |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Hent domenedetaljer        |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Oppdater domeninnstillinger |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Fjern et domene            |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verifiser DNS-poster       |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verifiser SMTP-konfigurasjon |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Test egendefinert S3-lagring |

### Alias (API-nøkkel) {#aliases-api-key}

| Verktøy                 | API-endepunkt                                                      | Beskrivelse                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | List aliaser for et domene                  |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Opprett et nytt alias                       |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Hent aliasdetaljer                          |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Oppdater et alias                           |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Slett et alias                             |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generer IMAP/SMTP-passord for alias-autentisering |

### E-poster — Utgående SMTP (API-nøkkel; Send støtter begge) {#emails--outbound-smtp-api-key-send-supports-both}

| Verktøy          | API-endepunkt            | Autentisering          | Beskrivelse                  |
| --------------- | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | API-nøkkel eller Alias-autentisering | Send en e-post via SMTP       |
| `listEmails`    | `GET /v1/emails`        | API-nøkkel            | List utgående e-poster       |
| `getEmail`      | `GET /v1/emails/:id`    | API-nøkkel            | Hent e-postdetaljer og status |
| `deleteEmail`   | `DELETE /v1/emails/:id` | API-nøkkel            | Slett en e-post i kø         |
| `getEmailLimit` | `GET /v1/emails/limit`  | API-nøkkel            | Sjekk din sendegrense        |

`sendEmail`-verktøyet godtar `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` og `attachments`. Dette er det samme som `POST /v1/emails`-endepunktet.

### Meldinger — IMAP (Alias-autentisering) {#messages--imap-alias-auth}

> **Krever alias-legitimasjon.** Send med `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Verktøy          | API-endepunkt             | Beskrivelse                          |
| ---------------  | ------------------------- | ----------------------------------- |
| `listMessages`   | `GET /v1/messages`        | List og søk i meldinger i en postkasse |
| `createMessage`  | `POST /v1/messages`       | Opprett et utkast eller last opp en melding |
| `getMessage`     | `GET /v1/messages/:id`    | Hent en melding etter ID            |
| `updateMessage`  | `PUT /v1/messages/:id`    | Oppdater flagg (lest, stjernemarkert, osv.) |
| `deleteMessage`  | `DELETE /v1/messages/:id` | Slett en melding                   |

`listMessages`-verktøyet støtter 15+ søkeparametere inkludert `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` og `has_attachment`. Se [API docs](/email-api) for fullstendig liste.

### Mapper — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Krever alias-legitimasjon.** Send med `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy          | API-endepunkt             | Beskrivelse              |
| ---------------- | ------------------------- | ------------------------ |
| `listFolders`    | `GET /v1/folders`         | List alle postkassemapper |
| `createFolder`   | `POST /v1/folders`        | Opprett en ny mappe      |
| `getFolder`      | `GET /v1/folders/:id`     | Hent mappedetaljer       |
| `updateFolder`   | `PUT /v1/folders/:id`     | Gi nytt navn til en mappe |
| `deleteFolder`   | `DELETE /v1/folders/:id`  | Slett en mappe           |

### Kontakter — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Krever alias-legitimasjon.** Send med `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy          | API-endepunkt             | Beskrivelse          |
| ---------------- | ------------------------- | -------------------- |
| `listContacts`   | `GET /v1/contacts`        | List alle kontakter  |
| `createContact`  | `POST /v1/contacts`       | Opprett en ny kontakt |
| `getContact`     | `GET /v1/contacts/:id`    | Hent kontaktinformasjon |
| `updateContact`  | `PUT /v1/contacts/:id`    | Oppdater en kontakt   |
| `deleteContact`  | `DELETE /v1/contacts/:id` | Slett en kontakt      |

### Kalendere — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Krever alias-legitimasjon.** Send med `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy           | API-endepunkt             | Beskrivelse           |
| ----------------- | ------------------------- | --------------------- |
| `listCalendars`   | `GET /v1/calendars`       | List alle kalendere   |
| `createCalendar`  | `POST /v1/calendars`      | Opprett en ny kalender |
| `getCalendar`     | `GET /v1/calendars/:id`   | Hent kalenderdetaljer |
| `updateCalendar`  | `PUT /v1/calendars/:id`   | Oppdater en kalender  |
| `deleteCalendar`  | `DELETE /v1/calendars/:id`| Slett en kalender     |

### Kalenderhendelser — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Krever alias-legitimasjon.** Send med `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy                | API-endepunkt                 | Beskrivelse          |
| ---------------------- | ----------------------------- | -------------------- |
| `listCalendarEvents`   | `GET /v1/calendar-events`     | List alle hendelser  |
| `createCalendarEvent`  | `POST /v1/calendar-events`    | Opprett en ny hendelse |
| `getCalendarEvent`     | `GET /v1/calendar-events/:id` | Hent hendelsesdetaljer |
| `updateCalendarEvent`  | `PUT /v1/calendar-events/:id` | Oppdater en hendelse |
| `deleteCalendarEvent`  | `DELETE /v1/calendar-events/:id` | Slett en hendelse   |

### Sieve-skript (API-nøkkel) {#sieve-scripts-api-key}

Disse bruker domenespesifikke stier og autentiserer med din API-nøkkel.

| Verktøy                | API-endepunkt                                                              | Beskrivelse               |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`     | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | List skript for et alias  |
| `createSieveScript`    | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Opprett et nytt skript    |
| `getSieveScript`       | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Hent skriptdetaljer       |
| `updateSieveScript`    | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Oppdater et skript        |
| `deleteSieveScript`    | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Slett et skript           |
| `activateSieveScript`  | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktiver et skript         |
### Sieve-skript (Alias-autentisering) {#sieve-scripts-alias-auth}

Disse bruker alias-nivå autentisering. Nyttig for automatisering per alias uten å trenge API-nøkkelen.

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy                        | API-endepunkt                                | Beskrivelse         |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | List opp skript     |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Opprett et skript   |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Hent skriptdetaljer |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Oppdater et skript  |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Slett et skript     |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktiver et skript   |

### Domenemedlemmer og invitasjoner (API-nøkkel) {#domain-members-and-invites-api-key}

| Verktøy               | API-endepunkt                                       | Beskrivelse                |
| --------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`   | `PUT /v1/domains/:domain_id/members/:member_id`    | Endre en medlems rolle     |
| `removeDomainMember`   | `DELETE /v1/domains/:domain_id/members/:member_id` | Fjern et medlem            |
| `acceptDomainInvite`   | `GET /v1/domains/:domain_id/invites`               | Aksepter en ventende invitasjon |
| `createDomainInvite`   | `POST /v1/domains/:domain_id/invites`              | Inviter noen til et domene |
| `removeDomainInvite`   | `DELETE /v1/domains/:domain_id/invites`            | Tilbakekall en invitasjon  |

### Catch-All-passord (API-nøkkel) {#catch-all-passwords-api-key}

| Verktøy                   | API-endepunkt                                                  | Beskrivelse                 |
| ------------------------- | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`   | `GET /v1/domains/:domain_id/catch-all-passwords`              | List opp catch-all-passord  |
| `createCatchAllPassword`  | `POST /v1/domains/:domain_id/catch-all-passwords`             | Opprett et catch-all-passord|
| `deleteCatchAllPassword`  | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Slett et catch-all-passord  |

### Logger (API-nøkkel) {#logs-api-key}

| Verktøy         | API-endepunkt            | Beskrivelse                   |
| --------------- | ----------------------- | ----------------------------- |
| `downloadLogs`  | `GET /v1/logs/download` | Last ned e-postleveringslogger|

### Krypter (Ingen autentisering) {#encrypt-no-auth}

| Verktøy          | API-endepunkt       | Beskrivelse                |
| ---------------- | ------------------ | -------------------------- |
| `encryptRecord`  | `POST /v1/encrypt` | Krypter en DNS TXT-post   |

Dette verktøyet krever ikke autentisering. Det krypterer videresendingsposter som `forward-email=user@example.com` for bruk i DNS TXT-poster.


## 20 praktiske bruksområder {#20-real-world-use-cases}

Her er praktiske måter å bruke MCP-serveren med din AI-assistent:

### 1. E-postsortering {#1-email-triage}

Be AI-en din om å skanne innboksen og oppsummere uleste meldinger. Den kan merke viktige e-poster, kategorisere etter avsender og utarbeide svar — alt gjennom naturlig språk. *(Krever alias-legitimasjon for tilgang til innboksen.)*

### 2. Automatisering av domeneoppsett {#2-domain-setup-automation}

Setter du opp et nytt domene? Be AI-en opprette domenet, legge til aliasene dine, verifisere DNS-poster og teste SMTP-konfigurasjonen. Det som vanligvis tar 10 minutter med klikk i dashbordet blir til én samtale.

### 3. Massehåndtering av aliaser {#3-bulk-alias-management}

Trenger du å opprette 20 aliaser for et nytt prosjekt? Beskriv hva du trenger, og la AI-en ta seg av det repetitive arbeidet. Den kan opprette aliaser, sette videresendingsregler og generere passord i én operasjon.
### 4. E-postkampanjeovervåking {#4-email-campaign-monitoring}

Be AI-en din om å sjekke sendegrenser, liste opp nylige utgående e-poster, og rapportere om leveringsstatus. Nyttig for å overvåke helsen til transaksjonelle e-poster.

### 5. Kontakt-synkronisering og opprydding {#5-contact-sync-and-cleanup}

Bruk CardDAV-verktøyene for å liste alle kontakter, finne duplikater, oppdatere utdatert informasjon, eller masseopprette kontakter fra et regneark du limer inn i chatten. *(Krever alias-legitimasjon.)*

### 6. Kalenderhåndtering {#6-calendar-management}

Opprett kalendere, legg til hendelser, oppdater møtetider, og slett avlyste hendelser — alt gjennom samtale. CalDAV-verktøyene støtter full CRUD på både kalendere og hendelser. *(Krever alias-legitimasjon.)*

### 7. Sieve-skriptautomatisering {#7-sieve-script-automation}

Sieve-skript er kraftige, men syntaksen er kryptisk. Be AI-en din om å skrive Sieve-skript for deg: "Filtrer alle e-poster fra <billing@example.com> til en Faktura-mappe" blir et fungerende skript uten å måtte berøre RFC 5228-spesifikasjonen.

### 8. Team-innføring {#8-team-onboarding}

Når et nytt teammedlem blir med, be AI-en om å opprette aliaset deres, generere et passord, sende dem en velkomst-e-post med legitimasjonen, og legge dem til som domenemedlem. Ett prompt, fire API-kall.

### 9. Sikkerhetsrevisjon {#9-security-auditing}

Be AI-en din om å liste alle domener, sjekke DNS-verifiseringsstatus, gjennomgå alias-konfigurasjoner, og identifisere domener med uverifiserte oppføringer. En rask sikkerhetssjekk på naturlig språk.

### 10. Oppsett av e-postvideresending {#10-email-forwarding-setup}

Setter du opp e-postvideresending for et nytt domene? Be AI-en om å opprette domenet, legge til videresendingsaliaser, kryptere DNS-oppføringene, og verifisere at alt er riktig konfigurert.

### 11. Innboks-søk og analyse {#11-inbox-search-and-analysis}

Bruk meldingssøkverktøyene for å finne spesifikke e-poster: "Finn alle e-poster fra <john@example.com> de siste 30 dagene som har vedlegg." De 15+ søkeparametrene gjør dette kraftig. *(Krever alias-legitimasjon.)*

### 12. Mappeorganisering {#12-folder-organization}

Be AI-en din om å opprette en mappestruktur for et nytt prosjekt, flytte meldinger mellom mapper, eller rydde opp i gamle mapper du ikke lenger trenger. *(Krever alias-legitimasjon.)*

### 13. Passordrotasjon {#13-password-rotation}

Generer nye alias-passord etter en tidsplan. Be AI-en om å generere et nytt passord for hvert alias og rapportere de nye legitimasjonene.

### 14. Kryptering av DNS-oppføringer {#14-dns-record-encryption}

Krypter videresendingsoppføringene dine før du legger dem til i DNS. `encryptRecord`-verktøyet håndterer dette uten autentisering — nyttig for raske engangskrypteringer.

### 15. Analyse av leveringslogger {#15-delivery-log-analysis}

Last ned e-postleveringsloggene dine og be AI-en om å analysere avvisningsrater, identifisere problematiske mottakere, eller spore leveringstider.

### 16. Håndtering av flere domener {#16-multi-domain-management}

Hvis du administrerer flere domener, be AI-en om å gi deg en statusrapport: hvilke domener som er verifisert, hvilke som har problemer, hvor mange aliaser hvert har, og hvordan sendegrensene ser ut.

### 17. Catch-all-konfigurasjon {#17-catch-all-configuration}

Sett opp catch-all-passord for domener som må motta e-post på hvilken som helst adresse. AI-en kan opprette, liste og administrere disse passordene for deg.

### 18. Administrasjon av domeninvitasjoner {#18-domain-invite-management}

Inviter teammedlemmer til å administrere domener, sjekk ventende invitasjoner, og rydd opp i utløpte. Nyttig for organisasjoner med flere domenadministratorer.

### 19. Testing av S3-lagring {#19-s3-storage-testing}

Hvis du bruker tilpasset S3-lagring for e-postsikkerhetskopier, be AI-en om å teste tilkoblingen og verifisere at den fungerer korrekt.

### 20. Komposisjon av e-postutkast {#20-email-draft-composition}

Opprett e-postutkast i postboksen din uten å sende dem. Nyttig for å forberede e-poster som trenger gjennomgang før sending, eller for å bygge e-postmaler. *(Krever alias-legitimasjon.)*


## Eksempel-prompt {#example-prompts}

Her er prompt du kan bruke direkte med AI-assistenten din:

**Sende e-post:**

> "Send en e-post fra <hello@mydomain.com> til <john@example.com> med emnet 'Møte i morgen' og innholdet 'Hei John, er vi fortsatt på for kl. 14?'"
**Domeneadministrasjon:**

> "List opp alle mine domener og fortell meg hvilke som har uverifiserte DNS-poster."

**Aliasopprettelse:**

> "Opprett et nytt alias <support@mydomain.com> som videresender til min personlige e-post."

**Innboks-søk (krever alias-legitimasjon):**

> "Finn alle uleste e-poster fra siste uke som nevner 'faktura'."

**Kalender (krever alias-legitimasjon):**

> "Opprett en kalender kalt 'Arbeid' og legg til et møte i morgen kl. 14:00 kalt 'Team Standup'."

**Sieve-skript:**

> "Skriv et Sieve-skript for <info@mydomain.com> som automatisk svarer på e-poster med 'Takk for at du tok kontakt, vi svarer innen 24 timer.'"

**Masseoperasjoner:**

> "Opprett aliaser for sales@, support@, billing@, og info@ på mydomain.com, alle som videresender til <team@mydomain.com>."

**Sikkerhetssjekk:**

> "Sjekk DNS- og SMTP-verifiseringsstatus for alle mine domener og fortell meg om noe trenger oppmerksomhet."

**Generer alias-passord:**

> "Generer et passord for aliaset <user@example.com> slik at jeg kan få tilgang til innboksen min."


## Environment Variables {#environment-variables}

| Variable                       | Required | Default                        | Description                                                                    |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Ja       | —                              | Din Forward Email API-nøkkel (brukes som Basic auth-brukernavn for API-nøkkel-endepunkter) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nei      | —                              | Alias e-postadresse for postkasse-endepunkter (f.eks. `user@example.com`)      |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nei      | —                              | Generert alias-passord for postkasse-endepunkter                              |
| `FORWARD_EMAIL_API_URL`        | Nei      | `https://api.forwardemail.net` | API-basert URL (for selvhostet eller testing)                                 |


## Security {#security}

MCP-serveren kjører lokalt på maskinen din. Slik fungerer sikkerheten:

* **Dine legitimasjoner forblir lokale.** Både API-nøkkelen din og alias-legitimasjonene leses fra miljøvariabler og brukes til å autentisere API-forespørsler via HTTP Basic auth. De sendes aldri til AI-modellen.
* **stdio-transport.** Serveren kommuniserer med AI-klienten over stdin/stdout. Ingen nettverksporter åpnes.
* **Ingen datalagring.** Serveren er stateless. Den cacher, logger eller lagrer ingen av e-postdataene dine.
* **Open source.** Hele kodebasen ligger på [GitHub](https://github.com/forwardemail/mcp-server). Du kan revidere hver linje.


## Programmatic Usage {#programmatic-usage}

Du kan også bruke serveren som et bibliotek:

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

Forward Email MCP Server er [open-source på GitHub](https://github.com/forwardemail/mcp-server) under BUSL-1.1-lisensen. Vi tror på åpenhet. Hvis du finner en feil eller ønsker en funksjon, [åpne en issue](https://github.com/forwardemail/mcp-server/issues).
