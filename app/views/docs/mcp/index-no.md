# Forward Email MCP-server

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Vår <a href="https://github.com/forwardemail/mcp-server">åpen kildekode MCP-server</a> lar AI-assistenter som Claude, ChatGPT, Cursor og Windsurf administrere e-post, domener, aliaser, kontakter og kalendere gjennom naturlig språk. Alle 68 API-endepunkter er eksponert som MCP-verktøy. Den kjører lokalt via <code>npx @forwardemail/mcp-server</code> – dine legitimasjoner forlater aldri maskinen din.
</p>

## Innholdsfortegnelse {#table-of-contents}

* [Hva er MCP?](#what-is-mcp)
* [Hurtigstart](#quick-start)
  * [Skaff en API-nøkkel](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andre MCP-klienter](#other-mcp-clients)
* [Autentisering](#authentication)
  * [API-nøkkelautentisering](#api-key-auth)
  * [Alias-autentisering](#alias-auth)
  * [Generere et aliaspassord](#generating-an-alias-password)
* [Alle 68 verktøy](#all-68-tools)
  * [Konto (API-nøkkel eller alias-autentisering)](#account-api-key-or-alias-auth)
  * [Domener (API-nøkkel)](#domains-api-key)
  * [Aliaser (API-nøkkel)](#aliases-api-key)
  * [E-poster – utgående SMTP (API-nøkkel; Send støtter begge)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Meldinger – IMAP (Alias-autentisering)](#messages--imap-alias-auth)
  * [Mapper – IMAP (Alias-autentisering)](#folders--imap-alias-auth)
  * [Kontakter – CardDAV (Alias-autentisering)](#contacts--carddav-alias-auth)
  * [Kalendere – CalDAV (Alias-autentisering)](#calendars--caldav-alias-auth)
  * [Kalenderhendelser – CalDAV (Alias-autentisering)](#calendar-events--caldav-alias-auth)
  * [Sieve-skript (API-nøkkel)](#sieve-scripts-api-key)
  * [Sieve-skript (Alias-autentisering)](#sieve-scripts-alias-auth)
  * [Domenemedlemmer og invitasjoner (API-nøkkel)](#domain-members-and-invites-api-key)
  * [Catch-All-passord (API-nøkkel)](#catch-all-passwords-api-key)
  * [Logger (API-nøkkel)](#logs-api-key)
  * [Krypter (ingen autentisering)](#encrypt-no-auth)
* [20 virkelige bruksområder](#20-real-world-use-cases)
* [Eksempler på spørsmål](#example-prompts)
* [Miljøvariabler](#environment-variables)
* [Sikkerhet](#security)
* [Programmatisk bruk](#programmatic-usage)
* [Åpen kildekode](#open-source)


## Hva er MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) er en åpen standard laget av Anthropic som lar AI-modeller sikkert kalle eksterne verktøy. I stedet for å kopiere og lime inn API-svar i et chat-vindu, gir MCP modellen direkte, strukturert tilgang til tjenestene dine.

Vår MCP-server pakker hele [Forward Email API](/email-api) – hvert endepunkt, hver parameter – og eksponerer dem som verktøy som enhver MCP-kompatibel klient kan bruke. Serveren kjører lokalt på maskinen din ved hjelp av stdio-transport. Dine legitimasjoner forblir i miljøvariablene dine og sendes aldri til AI-modellen.


## Hurtigstart {#quick-start}

### Skaff en API-nøkkel {#get-an-api-key}

1. Logg inn på din [Forward Email-konto](/my-account/domains).
2. Gå til **Min konto** → **Sikkerhet** → **API-nøkler**.
3. Generer en ny API-nøkkel og kopier den.

### Claude Desktop {#claude-desktop}

Legg dette til din Claude Desktop-konfigurasjonsfil:

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

Start Claude Desktop på nytt. Du skal se Forward Email-verktøyene i verktøyvelgeren.

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

Forward Email API bruker **HTTP Basic-autentisering** med to forskjellige legitimasjonstyper avhengig av endepunktet. MCP-serveren håndterer dette automatisk – du trenger bare å oppgi riktig legitimasjon.

### API-nøkkelautentisering {#api-key-auth}

De fleste administrasjonsendepunkter (domener, aliaser, utgående e-poster, logger) bruker din **API-nøkkel** som Basic auth-brukernavn med et tomt passord.

Dette er den samme API-nøkkelen du bruker for REST API. Angi den via miljøvariabelen `FORWARD_EMAIL_API_KEY`.

### Alias-autentisering {#alias-auth}

Postkasseendepunkter (meldinger, mapper, kontakter, kalendere, alias-omfattede Sieve-skript) bruker **alias-legitimasjon** – alias-e-postadressen som brukernavn og et generert passord som passord.

Disse endepunktene får tilgang til per-alias-data via IMAP-, CalDAV- og CardDAV-protokoller. De krever alias-e-post og et generert passord, ikke API-nøkkelen.

Du kan oppgi alias-legitimasjon på to måter:

1. **Miljøvariabler** (anbefales for standardalias): Angi `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Per-verktøy-kall-parametere**: Send `alias_username` og `alias_password` som argumenter til et hvilket som helst alias-autentiseringsverktøy. Disse overstyrer miljøvariablene, noe som er nyttig når du arbeider med flere aliaser.

### Generere et aliaspassord {#generating-an-alias-password}

Før du kan bruke alias-autentiseringsverktøy, må du generere et passord for aliaset. Du kan gjøre dette med `generateAliasPassword`-verktøyet eller via API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Svaret inkluderer feltene `username` (alias-e-post) og `password`. Bruk disse som din alias-legitimasjon.

> **Tips:** Du kan også spørre AI-assistenten din: *"Generer et passord for alias user@example.com på domenet example.com"* – den vil kalle `generateAliasPassword`-verktøyet og returnere legitimasjonen.

Tabellen nedenfor oppsummerer hvilken autentiseringsmetode hver verktøygruppe krever:

| Verktøygruppe | Autentiseringsmetode | Legitimasjon |
|-----------|-------------|-------------|
| Konto | API-nøkkel **eller** alias-autentisering | Enten |
| Domener, aliaser, domenemedlemmer, invitasjoner, catch-all-passord | API-nøkkel | `FORWARD_EMAIL_API_KEY` |
| Utgående e-poster (liste, hent, slett, grense) | API-nøkkel | `FORWARD_EMAIL_API_KEY` |
| Send e-post | API-nøkkel **eller** alias-autentisering | Enten |
| Meldinger (IMAP) | Alias-autentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mapper (IMAP) | Alias-autentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakter (CardDAV) | Alias-autentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendere (CalDAV) | Alias-autentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderhendelser (CalDAV) | Alias-autentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-skript (domene-omfang) | API-nøkkel | `FORWARD_EMAIL_API_KEY` |
| Sieve-skript (alias-omfang) | Alias-autentisering | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logger | API-nøkkel | `FORWARD_EMAIL_API_KEY` |
| Krypter | Ingen | Ingen legitimasjon nødvendig |


## Alle 68 verktøy {#all-68-tools}

Hvert verktøy mapper direkte til et [Forward Email API](/email-api)-endepunkt. Parametere bruker de samme navnene som API-dokumentasjonen. Autentiseringsmetoden er angitt i hver seksjonsoverskrift.

### Konto (API-nøkkel eller alias-autentisering) {#account-api-key-or-alias-auth}

Med API-nøkkelautentisering returnerer disse din brukerkonto-info. Med alias-autentisering returnerer de alias/postkasse-info inkludert lagringskvote og innstillinger.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Hent kontoinformasjonen din |
| `updateAccount` | `PUT /v1/account` | Oppdater kontoinnstillingene dine |

### Domener (API-nøkkel) {#domains-api-key}

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | List alle domenene dine |
| `createDomain` | `POST /v1/domains` | Legg til et nytt domene |
| `getDomain` | `GET /v1/domains/:domain_id` | Hent domenedetaljer |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Oppdater domeneinnstillinger |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Fjern et domene |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verifiser DNS-poster |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verifiser SMTP-konfigurasjon |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Test tilpasset S3-lagring |

### Aliaser (API-nøkkel) {#aliases-api-key}

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | List aliaser for et domene |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Opprett et nytt alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Hent aliasdetaljer |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Oppdater et alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Slett et alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Generer IMAP/SMTP-passord for alias-autentisering |

### E-poster – utgående SMTP (API-nøkkel; Send støtter begge) {#emails--outbound-smtp-api-key-send-supports-both}

| Verktøy | API-endepunkt | Autentisering | Beskrivelse |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API-nøkkel eller alias-autentisering | Send en e-post via SMTP |
| `listEmails` | `GET /v1/emails` | API-nøkkel | List utgående e-poster |
| `getEmail` | `GET /v1/emails/:id` | API-nøkkel | Hent e-postdetaljer og status |
| `deleteEmail` | `DELETE /v1/emails/:id` | API-nøkkel | Slett en e-post i kø |
| `getEmailLimit` | `GET /v1/emails/limit` | API-nøkkel | Sjekk sendegrensen din |

Verktøyet `sendEmail` aksepterer `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` og `attachments`. Dette er det samme som `POST /v1/emails`-endepunktet.

### Meldinger – IMAP (Alias-autentisering) {#messages--imap-alias-auth}

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | List og søk i meldinger i en postkasse |
| `createMessage` | `POST /v1/messages` | Opprett et utkast eller last opp en melding |
| `getMessage` | `GET /v1/messages/:id` | Hent en melding etter ID |
| `updateMessage` | `PUT /v1/messages/:id` | Oppdater flagg (lest, stjernemerket, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Slett en melding |

Verktøyet `listMessages` støtter over 15 søkeparametere, inkludert `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` og `has_attachment`. Se [API-dokumentasjonen](/email-api) for hele listen.

### Mapper – IMAP (Alias-autentisering) {#folders--imap-alias-auth}

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | List alle postkassemapper |
| `createFolder` | `POST /v1/folders` | Opprett en ny mappe |
| `getFolder` | `GET /v1/folders/:id` | Hent mappdetaljer |
| `updateFolder` | `PUT /v1/folders/:id` | Gi nytt navn til en mappe |
| `deleteFolder` | `DELETE /v1/folders/:id` | Slett en mappe |

### Kontakter – CardDAV (Alias-autentisering) {#contacts--carddav-alias-auth}

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | List alle kontakter |
| `createContact` | `POST /v1/contacts` | Opprett en ny kontakt |
| `getContact` | `GET /v1/contacts/:id` | Hent kontaktdetaljer |
| `updateContact` | `PUT /v1/contacts/:id` | Oppdater en kontakt |
| `deleteContact` | `DELETE /v1/contacts/:id` | Slett en kontakt |

### Kalendere – CalDAV (Alias-autentisering) {#calendars--caldav-alias-auth}

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | List alle kalendere |
| `createCalendar` | `POST /v1/calendars` | Opprett en ny kalender |
| `getCalendar` | `GET /v1/calendars/:id` | Hent kalenderdetaljer |
| `updateCalendar` | `PUT /v1/calendars/:id` | Oppdater en kalender |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Slett en kalender |

### Kalenderhendelser – CalDAV (Alias-autentisering) {#calendar-events--caldav-alias-auth}

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | List alle hendelser |
| `createCalendarEvent` | `POST /v1/calendar-events` | Opprett en ny hendelse |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Hent hendelsesdetaljer |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Oppdater en hendelse |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Slett en hendelse |

### Sieve-skript (API-nøkkel) {#sieve-scripts-api-key}

Disse bruker domene-omfattede stier og autentiserer med API-nøkkelen din.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | List skript for et alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Opprett et nytt skript |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Hent skriptdetaljer |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Oppdater et skript |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Slett et skript |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktiver et skript |

### Sieve-skript (Alias-autentisering) {#sieve-scripts-alias-auth}

Disse bruker autentisering på aliasnivå. Nyttig for per-alias-automatisering uten å trenge API-nøkkelen.

> **Krever alias-legitimasjon.** Send `alias_username` og `alias_password` eller sett miljøvariablene `FORWARD_EMAIL_ALIAS_USER` og `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | List skript |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Opprett et skript |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Hent skriptdetaljer |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Oppdater et skript |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Slett et skript |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktiver et skript |

### Domenemedlemmer og invitasjoner (API-nøkkel) {#domain-members-and-invites-api-key}

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Endre et medlems rolle |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Fjern et medlem |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Aksepter en ventende invitasjon |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Inviter noen til et domene |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Trekk tilbake en invitasjon |

### Catch-All-passord (API-nøkkel) {#catch-all-passwords-api-key}

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | List catch-all-passord |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Opprett et catch-all-passord |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Slett et catch-all-passord |

### Logger (API-nøkkel) {#logs-api-key}

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Last ned e-postleveringslogger |

### Krypter (ingen autentisering) {#encrypt-no-auth}

| Verktøy | API-endepunkt | Beskrivelse |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Krypter en DNS TXT-post |

Dette verktøyet krever ingen autentisering. Det krypterer videresendingsposter som `forward-email=user@example.com` for bruk i DNS TXT-poster.


## 20 virkelige bruksområder {#20-real-world-use-cases}

Her er praktiske måter å bruke MCP-serveren med AI-assistenten din:

### 1. E-postsortering {#email-triage}

Be AI-en din om å skanne innboksen din og oppsummere uleste meldinger. Den kan flagge presserende e-poster, kategorisere etter avsender og utarbeide svar – alt gjennom naturlig språk. *(Krever alias-legitimasjon for innboks-tilgang.)*

### 2. Automatisering av domeneoppsett {#domain-setup-automation}

Setter du opp et nytt domene? Be AI-en om å opprette domenet, legge til aliasene dine, verifisere DNS-poster og teste SMTP-konfigurasjonen. Det som normalt tar 10 minutter med å klikke gjennom dashbord, blir én samtale.

### 3. Masseadministrasjon av aliaser {#bulk-alias-management}

Trenger du å opprette 20 aliaser for et nytt prosjekt? Beskriv hva du trenger, og la AI-en håndtere det repetitive arbeidet. Den kan opprette aliaser, angi videresendingsregler og generere passord i ett jafs.

### 4. Overvåking av e-postkampanjer {#email-campaign-monitoring}

Be AI-en din om å sjekke sendegrenser, liste nylige utgående e-poster og rapportere om leveringsstatus. Nyttig for å overvåke helsen til transaksjonelle e-poster.

### 5. Synkronisering og opprydding av kontakter {#contact-sync-and-cleanup}

Bruk CardDAV-verktøyene til å liste alle kontakter, finne duplikater, oppdatere utdatert informasjon eller masseopprette kontakter fra et regneark du limer inn i chatten. *(Krever alias-legitimasjon.)*

### 6. Kalenderadministrasjon {#calendar-management}

Opprett kalendere, legg til hendelser, oppdater møtetider og slett avlyste hendelser – alt gjennom samtale. CalDAV-verktøyene støtter full CRUD på både kalendere og hendelser. *(Krever alias-legitimasjon.)*

### 7. Automatisering av Sieve-skript {#sieve-script-automation}

Sieve-skript er kraftige, men syntaksen er obskur. Be AI-en din om å skrive Sieve-skript for deg: "Filtrer alle e-poster fra billing@example.com inn i en faktureringsmappe" blir et fungerende skript uten å røre RFC 5228-spesifikasjonen.

### 8. Team-onboarding {#team-onboarding}

Når et nytt teammedlem blir med, be AI-en om å opprette aliaset deres, generere et passord, sende dem en velkomst-e-post med legitimasjonen deres og legge dem til som et domenemedlem. Ett spørsmål, fire API-kall.

### 9. Sikkerhetsrevisjon {#security-auditing}

Be AI-en din om å liste alle domener, sjekke DNS-verifiseringsstatus, gjennomgå alias-konfigurasjoner og identifisere eventuelle domener med uverifiserte poster. En rask sikkerhetssjekk i naturlig språk.

### 10. Oppsett av e-postvideresending {#email-forwarding-setup}

Setter du opp e-postvideresending for et nytt domene? Be AI-en om å opprette domenet, legge til videresendingsaliaser, kryptere DNS-postene og verifisere at alt er riktig konfigurert.

### 11. Innbokssøk og analyse {#inbox-search-and-analysis}

Bruk meldingssøke-verktøyene til å finne spesifikke e-poster: "Finn alle e-poster fra john@example.com de siste 30 dagene som har vedlegg." De over 15 søkeparametrene gjør dette kraftig. *(Krever alias-legitimasjon.)*

### 12. Mappeorganisering {#folder-organization}

Be AI-en din om å opprette en mappestruktur for et nytt prosjekt, flytte meldinger mellom mapper eller rydde opp i gamle mapper du ikke lenger trenger. *(Krever alias-legitimasjon.)*

### 13. Passordrotasjon {#password-rotation}

Generer nye aliaspassord etter en tidsplan. Be AI-en din om å generere et nytt passord for hvert alias og rapportere de nye legitimasjonene.

### 14. Kryptering av DNS-poster {#dns-record-encryption}

Krypter videresendingspostene dine før du legger dem til DNS. `encryptRecord`-verktøyet håndterer dette uten autentisering – nyttig for raske engangskrypteringer.

### 15. Analyse av leveringslogger {#delivery-log-analysis}

Last ned e-postleveringsloggene dine og be AI-en om å analysere avvisningsrater, identifisere problematiske mottakere eller spore leveringstider.

### 16. Administrasjon av flere domener {#multi-domain-management}

Hvis du administrerer flere domener, be AI-en om å gi deg en statusrapport: hvilke domener er verifisert, hvilke har problemer, hvor mange aliaser hver har, og hvordan sendegrensene ser ut.

### 17. Catch-All-konfigurasjon {#catch-all-configuration}

Sett opp catch-all-passord for domener som trenger å motta e-post på hvilken som helst adresse. AI-en kan opprette, liste og administrere disse passordene for deg.

### 18. Administrasjon av domeneinvitasjoner {#domain-invite-management}

Inviter teammedlemmer til å administrere domener, sjekke ventende invitasjoner og rydde opp i utløpte. Nyttig for organisasjoner med flere domeneadministratorer.

### 19. S3-lagringstesting {#s3-storage-testing}

Hvis du bruker tilpasset S3-lagring for e-post-sikkerhetskopier, be AI-en om å teste tilkoblingen og verifisere at den fungerer som den skal.

### 20. Utkast til e-postkomposisjon {#email-draft-composition}

Opprett utkast til e-poster i postkassen din uten å sende dem. Nyttig for å forberede e-poster som trenger gjennomgang før sending, eller for å bygge e-postmaler. *(Krever alias-legitimasjon.)*


## Eksempler på spørsmål {#example-prompts}

Her er spørsmål du kan bruke direkte med AI-assistenten din:

**Sender e-post:**
> "Send en e-post fra hello@mydomain.com til john@example.com med emnet 'Møte i morgen' og teksten 'Hei John, er vi fortsatt på for kl. 14?'"

**Domeneadministrasjon:**
> "List alle domenene mine og fortell meg hvilke som har uverifiserte DNS-poster."

**Oppretting av alias:**
> "Opprett et nytt alias support@mydomain.com som videresender til min personlige e-post."

**Innbokssøk (krever alias-legitimasjon):**
> "Finn alle uleste e-poster fra forrige uke som nevner 'faktura'."

**Kalender (krever alias-legitimasjon):**
> "Opprett en kalender kalt 'Arbeid' og legg til et møte i morgen kl. 14 kalt 'Team Standup'."

**Sieve-skript:**
> "Skriv et Sieve-skript for info@mydomain.com som automatisk svarer på e-poster med 'Takk for at du tok kontakt, vi kommer tilbake til deg innen 24 timer'."

**Masseoperasjoner:**
> "Opprett aliaser for sales@, support@, billing@ og info@ på mydomain.com, alle videresender til team@mydomain.com."

**Sikkerhetssjekk:**
> "Sjekk DNS- og SMTP-verifiseringsstatusen for alle domenene mine og fortell meg om noe trenger oppmerksomhet."

**Generer aliaspassord:**
> "Generer et passord for alias user@example.com slik at jeg kan få tilgang til innboksen min."


## Miljøvariabler {#environment-variables}

| Variabel | Påkrevd | Standard | Beskrivelse |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Ja | — | Din Forward Email API-nøkkel (brukes som Basic auth-brukernavn for API-nøkkelendepunkter) |
| `FORWARD_EMAIL_ALIAS_USER` | Nei | — | Alias-e-postadresse for postkasseendepunkter (f.eks. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nei | — | Generert aliaspassord for postkasseendepunkter |
| `FORWARD_EMAIL_API_URL` | Nei | `https://api.forwardemail.net` | API-base-URL (for selv-hostet eller testing) |


## Sikkerhet {#security}

MCP-serveren kjører lokalt på maskinen din. Slik fungerer sikkerheten:

*   **Dine legitimasjoner forblir lokale.** Både API-nøkkelen din og alias-legitimasjonene leses fra miljøvariabler og brukes til å autentisere API-forespørsler via HTTP Basic auth. De sendes aldri til AI-modellen.
*   **Stdio-transport.** Serveren kommuniserer med AI-klienten over stdin/stdout. Ingen nettverksporter åpnes.
*   **Ingen datalagring.** Serveren er tilstandsløs. Den cacher, logger eller lagrer ingen av e-postdataene dine.
*   **Åpen kildekode.** Hele kodebasen er på [GitHub](https://github.com/forwardemail/mcp-server). Du kan revidere hver linje.


## Programmatisk bruk {#programmatic-usage}

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


## Åpen kildekode {#open-source}

Forward Email MCP-serveren er [åpen kildekode på GitHub](https://github.com/forwardemail/mcp-server) under BUSL-1.1-lisensen. Vi tror på åpenhet. Hvis du finner en feil eller ønsker en funksjon, [opprett en sak](https://github.com/forwardemail/mcp-server/issues).

