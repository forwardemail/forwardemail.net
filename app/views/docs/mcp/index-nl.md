# Forward Email MCP Server

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Onze <a href="https://github.com/forwardemail/mcp-server">open-source MCP-server</a> stelt AI-assistenten zoals Claude, ChatGPT, Cursor en Windsurf in staat om uw e-mail, domeinen, aliassen, contacten en agenda's te beheren via natuurlijke taal. Alle 68 API-eindpunten worden blootgesteld als MCP-tools. Het draait lokaal via <code>npx @forwardemail/mcp-server</code> — uw inloggegevens verlaten nooit uw machine.
</p>

## Inhoudsopgave

* [Wat is MCP?](#wat-is-mcp)
* [Snelle start](#quick-start)
  * [Een API-sleutel ophalen](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andere MCP-clients](#other-mcp-clients)
* [Authenticatie](#authentication)
  * [API-sleutel authenticatie](#api-key-auth)
  * [Alias authenticatie](#alias-auth)
  * [Een aliaswachtwoord genereren](#generating-an-alias-password)
* [Alle 68 tools](#all-68-tools)
  * [Account (API-sleutel of alias authenticatie)](#account-api-key-or-alias-auth)
  * [Domeinen (API-sleutel)](#domains-api-key)
  * [Aliassen (API-sleutel)](#aliases-api-key)
  * [E-mails — Uitgaande SMTP (API-sleutel; Verzenden ondersteunt beide)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Berichten — IMAP (Alias authenticatie)](#messages--imap-alias-auth)
  * [Mappen — IMAP (Alias authenticatie)](#folders--imap-alias-auth)
  * [Contacten — CardDAV (Alias authenticatie)](#contacts--carddav-alias-auth)
  * [Agenda's — CalDAV (Alias authenticatie)](#calendars--caldav-alias-auth)
  * [Agendagebeurtenissen — CalDAV (Alias authenticatie)](#calendar-events--caldav-alias-auth)
  * [Sieve-scripts (API-sleutel)](#sieve-scripts-api-key)
  * [Sieve-scripts (Alias authenticatie)](#sieve-scripts-alias-auth)
  * [Domeinleden en uitnodigingen (API-sleutel)](#domain-members-and-invites-api-key)
  * [Catch-All wachtwoorden (API-sleutel)](#catch-all-passwords-api-key)
  * [Logboeken (API-sleutel)](#logs-api-key)
  * [Versleutelen (Geen authenticatie)](#encrypt-no-auth)
* [20 praktijkvoorbeelden](#20-real-world-use-cases)
* [Voorbeeldprompts](#example-prompts)
* [Omgevingsvariabelen](#environment-variables)
* [Beveiliging](#security)
* [Programmatisch gebruik](#programmatic-usage)
* [Open source](#open-source)


## Wat is MCP? {#wat-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) is een open standaard, gecreëerd door Anthropic, waarmee AI-modellen veilig externe tools kunnen aanroepen. In plaats van API-antwoorden te kopiëren en plakken in een chatvenster, geeft MCP het model directe, gestructureerde toegang tot uw services.

Onze MCP-server omvat de gehele [Forward Email API](/email-api) — elk eindpunt, elke parameter — en stelt deze bloot als tools die elke MCP-compatibele client kan gebruiken. De server draait lokaal op uw machine met behulp van stdio-transport. Uw inloggegevens blijven in uw omgevingsvariabelen en worden nooit naar het AI-model verzonden.


## Snelle start {#quick-start}

### Een API-sleutel ophalen {#get-an-api-key}

1. Log in op uw [Forward Email-account](/my-account/domains).
2. Ga naar **Mijn account** → **Beveiliging** → **API-sleutels**.
3. Genereer een nieuwe API-sleutel en kopieer deze.

### Claude Desktop {#claude-desktop}

Voeg dit toe aan uw Claude Desktop-configuratiebestand:

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

Herstart Claude Desktop. U zou de Forward Email-tools moeten zien in de toolkiezer.

> **Opmerking:** De variabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` zijn optioneel, maar vereist voor mailbox-tools (berichten, mappen, contacten, agenda's). Zie [Authenticatie](#authentication) voor details.

### Cursor {#cursor}

Open Cursor Instellingen → MCP → Server toevoegen:

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

Open Windsurf Instellingen → MCP → Server toevoegen met dezelfde configuratie als hierboven.

### Andere MCP-clients {#other-mcp-clients}

Elke client die het MCP stdio-transport ondersteunt, zal werken. Het commando is:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Authenticatie {#authentication}

De Forward Email API gebruikt **HTTP Basic authenticatie** met twee verschillende typen inloggegevens, afhankelijk van het eindpunt. De MCP-server handelt dit automatisch af — u hoeft alleen de juiste inloggegevens op te geven.

### API-sleutel authenticatie {#api-key-auth}

De meeste beheer-eindpunten (domeinen, aliassen, uitgaande e-mails, logboeken) gebruiken uw **API-sleutel** als de Basic auth gebruikersnaam met een leeg wachtwoord.

Dit is dezelfde API-sleutel die u gebruikt voor de REST API. Stel deze in via de omgevingsvariabele `FORWARD_EMAIL_API_KEY`.

### Alias authenticatie {#alias-auth}

Mailbox-eindpunten (berichten, mappen, contacten, agenda's, alias-scoped sieve-scripts) gebruiken **alias-inloggegevens** — het alias-e-mailadres als gebruikersnaam en een gegenereerd wachtwoord als wachtwoord.

Deze eindpunten hebben toegang tot per-alias-gegevens via IMAP, CalDAV en CardDAV-protocollen. Ze vereisen het alias-e-mailadres en een gegenereerd wachtwoord, niet de API-sleutel.

U kunt alias-inloggegevens op twee manieren opgeven:

1. **Omgevingsvariabelen** (aanbevolen voor standaardalias): Stel `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.
2. **Per-tool-call parameters**: Geef `alias_username` en `alias_password` door als argumenten aan elke alias-auth tool. Deze overschrijven de omgevingsvariabelen, wat handig is bij het werken met meerdere aliassen.

### Een aliaswachtwoord genereren {#generating-an-alias-password}

Voordat u alias-auth tools kunt gebruiken, moet u een wachtwoord genereren voor de alias. U kunt dit doen met de `generateAliasPassword` tool of via de API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Het antwoord bevat de velden `username` (alias-e-mail) en `password`. Gebruik deze als uw alias-inloggegevens.

> **Tip:** U kunt uw AI-assistent ook vragen: *"Genereer een wachtwoord voor de alias user@example.com op domein example.com"* — het zal de `generateAliasPassword` tool aanroepen en de inloggegevens retourneren.

De onderstaande tabel geeft een overzicht van welke authenticatiemethode elke toolgroep vereist:

| Toolgroep | Authenticatiemethode | Inloggegevens |
|-----------|-------------|-------------|
| Account | API-sleutel **of** Alias authenticatie | Een van beide |
| Domeinen, Aliassen, Domeinleden, Uitnodigingen, Catch-All wachtwoorden | API-sleutel | `FORWARD_EMAIL_API_KEY` |
| Uitgaande e-mails (lijst, ophalen, verwijderen, limiet) | API-sleutel | `FORWARD_EMAIL_API_KEY` |
| E-mail verzenden | API-sleutel **of** Alias authenticatie | Een van beide |
| Berichten (IMAP) | Alias authenticatie | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mappen (IMAP) | Alias authenticatie | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contacten (CardDAV) | Alias authenticatie | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Agenda's (CalDAV) | Alias authenticatie | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Agendagebeurtenissen (CalDAV) | Alias authenticatie | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-scripts (domein-scoped) | API-sleutel | `FORWARD_EMAIL_API_KEY` |
| Sieve-scripts (alias-scoped) | Alias authenticatie | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logboeken | API-sleutel | `FORWARD_EMAIL_API_KEY` |
| Versleutelen | Geen | Geen inloggegevens nodig |


## Alle 68 tools {#all-68-tools}

Elke tool komt direct overeen met een [Forward Email API](/email-api) eindpunt. Parameters gebruiken dezelfde namen als de API-documentatie. De authenticatiemethode wordt vermeld in de kop van elke sectie.

### Account (API-sleutel of alias authenticatie) {#account-api-key-or-alias-auth}

Met API-sleutel authenticatie retourneren deze uw gebruikersaccountinformatie. Met alias authenticatie retourneren ze alias-/mailboxinformatie inclusief opslagquota en instellingen.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Haal uw accountinformatie op |
| `updateAccount` | `PUT /v1/account` | Werk uw accountinstellingen bij |

### Domeinen (API-sleutel) {#domains-api-key}

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Lijst al uw domeinen |
| `createDomain` | `POST /v1/domains` | Voeg een nieuw domein toe |
| `getDomain` | `GET /v1/domains/:domain_id` | Haal domeindetails op |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Werk domeininstellingen bij |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Verwijder een domein |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verifieer DNS-records |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verifieer SMTP-configuratie |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Test aangepaste S3-opslag |

### Aliassen (API-sleutel) {#aliases-api-key}

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Lijst aliassen voor een domein |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Maak een nieuwe alias aan |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Haal aliasdetails op |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Werk een alias bij |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Verwijder een alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Genereer IMAP/SMTP-wachtwoord voor alias authenticatie |

### E-mails — Uitgaande SMTP (API-sleutel; Verzenden ondersteunt beide) {#emails--outbound-smtp-api-key-send-supports-both}

| Tool | API-eindpunt | Auth | Beschrijving |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API-sleutel of Alias authenticatie | Verzend een e-mail via SMTP |
| `listEmails` | `GET /v1/emails` | API-sleutel | Lijst uitgaande e-mails |
| `getEmail` | `GET /v1/emails/:id` | API-sleutel | Haal e-mailgegevens en status op |
| `deleteEmail` | `DELETE /v1/emails/:id` | API-sleutel | Verwijder een in de wachtrij geplaatste e-mail |
| `getEmailLimit` | `GET /v1/emails/limit` | API-sleutel | Controleer uw verzendlimiet |

De `sendEmail` tool accepteert `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, en `attachments`. Dit is hetzelfde als het `POST /v1/emails` eindpunt.

### Berichten — IMAP (Alias authenticatie) {#messages--imap-alias-auth}

> **Vereist alias-inloggegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Lijst en zoek berichten in een mailbox |
| `createMessage` | `POST /v1/messages` | Maak een concept of upload een bericht |
| `getMessage` | `GET /v1/messages/:id` | Haal een bericht op via ID |
| `updateMessage` | `PUT /v1/messages/:id` | Werk vlaggen bij (gelezen, gemarkeerd, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Verwijder een bericht |

De `listMessages` tool ondersteunt meer dan 15 zoekparameters, waaronder `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, en `has_attachment`. Zie de [API-documentatie](/email-api) voor de volledige lijst.

### Mappen — IMAP (Alias authenticatie) {#folders--imap-alias-auth}

> **Vereist alias-inloggegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Lijst alle mailboxmappen |
| `createFolder` | `POST /v1/folders` | Maak een nieuwe map aan |
| `getFolder` | `GET /v1/folders/:id` | Haal mapdetails op |
| `updateFolder` | `PUT /v1/folders/:id` | Hernoem een map |
| `deleteFolder` | `DELETE /v1/folders/:id` | Verwijder een map |

### Contacten — CardDAV (Alias authenticatie) {#contacts--carddav-alias-auth}

> **Vereist alias-inloggegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Lijst alle contacten |
| `createContact` | `POST /v1/contacts` | Maak een nieuw contact aan |
| `getContact` | `GET /v1/contacts/:id` | Haal contactdetails op |
| `updateContact` | `PUT /v1/contacts/:id` | Werk een contact bij |
| `deleteContact` | `DELETE /v1/contacts/:id` | Verwijder een contact |

### Agenda's — CalDAV (Alias authenticatie) {#calendars--caldav-alias-auth}

> **Vereist alias-inloggegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Lijst alle agenda's |
| `createCalendar` | `POST /v1/calendars` | Maak een nieuwe agenda aan |
| `getCalendar` | `GET /v1/calendars/:id` | Haal agendadetails op |
| `updateCalendar` | `PUT /v1/calendars/:id` | Werk een agenda bij |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Verwijder een agenda |

### Agendagebeurtenissen — CalDAV (Alias authenticatie) {#calendar-events--caldav-alias-auth}

> **Vereist alias-inloggegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Lijst alle gebeurtenissen |
| `createCalendarEvent` | `POST /v1/calendar-events` | Maak een nieuwe gebeurtenis aan |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Haal gebeurtenisdetails op |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Werk een gebeurtenis bij |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Verwijder een gebeurtenis |

### Sieve-scripts (API-sleutel) {#sieve-scripts-api-key}

Deze gebruiken domein-scoped paden en authenticeren met uw API-sleutel.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Lijst scripts voor een alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Maak een nieuw script aan |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Haal scriptdetails op |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Werk een script bij |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Verwijder een script |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Activeer een script |

### Sieve-scripts (Alias authenticatie) {#sieve-scripts-alias-auth}

Deze gebruiken authenticatie op aliasniveau. Handig voor automatisering per alias zonder de API-sleutel nodig te hebben.

> **Vereist alias-inloggegevens.** Geef `alias_username` en `alias_password` door of stel de omgevingsvariabelen `FORWARD_EMAIL_ALIAS_USER` en `FORWARD_EMAIL_ALIAS_PASSWORD` in.

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Lijst scripts |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Maak een script aan |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Haal scriptdetails op |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Werk een script bij |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Verwijder een script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Activeer een script |

### Domeinleden en uitnodigingen (API-sleutel) {#domain-members-and-invites-api-key}

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Wijzig de rol van een lid |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Verwijder een lid |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Accepteer een openstaande uitnodiging |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Nodig iemand uit voor een domein |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Trek een uitnodiging in |

### Catch-All wachtwoorden (API-sleutel) {#catch-all-passwords-api-key}

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Lijst catch-all wachtwoorden |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Maak een catch-all wachtwoord aan |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Verwijder een catch-all wachtwoord |

### Logboeken (API-sleutel) {#logs-api-key}

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Download e-mailbezorgingslogboeken |

### Versleutelen (Geen authenticatie) {#encrypt-no-auth}

| Tool | API-eindpunt | Beschrijving |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Versleutel een DNS TXT-record |

Deze tool vereist geen authenticatie. Het versleutelt doorstuurrecords zoals `forward-email=user@example.com` voor gebruik in DNS TXT-records.


## 20 praktijkvoorbeelden {#20-real-world-use-cases}

Hier zijn praktische manieren om de MCP-server te gebruiken met uw AI-assistent:

### 1. E-mail triage

Vraag uw AI om uw inbox te scannen en ongelezen berichten samen te vatten. Het kan urgente e-mails markeren, categoriseren op afzender en antwoorden opstellen — allemaal via natuurlijke taal. *(Vereist alias-inloggegevens voor inbox-toegang.)*

### 2. Automatisering van domeininstellingen

Een nieuw domein instellen? Vraag de AI om het domein aan te maken, uw aliassen toe te voegen, DNS-records te verifiëren en de SMTP-configuratie te testen. Wat normaal 10 minuten klikken door dashboards kost, wordt één gesprek.

### 3. Bulk aliasbeheer

Moet u 20 aliassen aanmaken voor een nieuw project? Beschrijf wat u nodig heeft en laat de AI het repetitieve werk afhandelen. Het kan aliassen aanmaken, doorstuurregels instellen en wachtwoorden genereren in één keer.

### 4. Monitoring van e-mailcampagnes

Vraag uw AI om verzendlimieten te controleren, recente uitgaande e-mails weer te geven en te rapporteren over de bezorgstatus. Handig voor het monitoren van de gezondheid van transactionele e-mail.

### 5. Contactsynchronisatie en -opschoning

Gebruik de CardDAV-tools om alle contacten weer te geven, duplicaten te vinden, verouderde informatie bij te werken of contacten in bulk aan te maken vanuit een spreadsheet die u in de chat plakt. *(Vereist alias-inloggegevens.)*

### 6. Agendabeheer

Maak agenda's aan, voeg evenementen toe, werk vergadertijden bij en verwijder geannuleerde evenementen — allemaal via een gesprek. De CalDAV-tools ondersteunen volledige CRUD op zowel agenda's als evenementen. *(Vereist alias-inloggegevens.)*

### 7. Automatisering van Sieve-scripts

Sieve-scripts zijn krachtig, maar de syntaxis is ingewikkeld. Vraag uw AI om Sieve-scripts voor u te schrijven: "Filter alle e-mails van billing@example.com naar een map Facturering" wordt een werkend script zonder de RFC 5228-specificatie aan te raken.

### 8. Team onboarding

Wanneer een nieuw teamlid zich aansluit, vraag de AI om hun alias aan te maken, een wachtwoord te genereren, hen een welkomst-e-mail te sturen met hun inloggegevens en hen toe te voegen als domeinlid. Eén prompt, vier API-aanroepen.

### 9. Beveiligingsaudit

Vraag uw AI om alle domeinen weer te geven, de DNS-verificatiestatus te controleren, aliasconfiguraties te beoordelen en domeinen met niet-geverifieerde records te identificeren. Een snelle beveiligingscontrole in natuurlijke taal.

### 10. E-mail doorsturen instellen

E-mail doorsturen instellen voor een nieuw domein? Vraag de AI om het domein aan te maken, doorstuur-aliassen toe te voegen, de DNS-records te versleutelen en te controleren of alles correct is geconfigureerd.

### 11. Inbox zoeken en analyseren

Gebruik de berichtzoektools om specifieke e-mails te vinden: "Vind alle e-mails van john@example.com van de afgelopen 30 dagen die bijlagen hebben." De meer dan 15 zoekparameters maken dit krachtig. *(Vereist alias-inloggegevens.)*

### 12. Maporganisatie

Vraag uw AI om een mapstructuur aan te maken voor een nieuw project, berichten tussen mappen te verplaatsen of oude mappen op te schonen die u niet langer nodig heeft. *(Vereist alias-inloggegevens.)*

### 13. Wachtwoordrotatie

Genereer nieuwe aliaswachtwoorden volgens een schema. Vraag uw AI om een nieuw wachtwoord te genereren voor elke alias en de nieuwe inloggegevens te rapporteren.

### 14. DNS-recordversleuteling

Versleutel uw doorstuurrecords voordat u ze aan DNS toevoegt. De `encryptRecord` tool handelt dit af zonder authenticatie — handig voor snelle eenmalige versleutelingen.

### 15. Analyse van bezorglogboeken

Download uw e-mailbezorglogboeken en vraag de AI om bouncepercentages te analyseren, problematische ontvangers te identificeren of bezorgtijden te volgen.

### 16. Beheer van meerdere domeinen

Als u meerdere domeinen beheert, vraag de AI dan om een statusrapport: welke domeinen zijn geverifieerd, welke hebben problemen, hoeveel aliassen elk heeft en hoe de verzendlimieten eruitzien.

### 17. Catch-All configuratie

Stel catch-all wachtwoorden in voor domeinen die e-mail moeten ontvangen op elk adres. De AI kan deze wachtwoorden voor u aanmaken, weergeven en beheren.

### 18. Beheer van domeinuitnodigingen

Nodig teamleden uit om domeinen te beheren, openstaande uitnodigingen te controleren en verlopen uitnodigingen op te schonen. Handig voor organisaties met meerdere domeinbeheerders.

### 19. S3-opslag testen

Als u aangepaste S3-opslag gebruikt voor e-mailback-ups, vraag de AI dan om de verbinding te testen en te controleren of deze correct werkt.

### 20. E-mailconceptcompositie

Maak concept-e-mails in uw mailbox zonder ze te verzenden. Handig voor het voorbereiden van e-mails die vóór verzending moeten worden beoordeeld, of voor het bouwen van e-mailsjablonen. *(Vereist alias-inloggegevens.)*


## Voorbeeldprompts {#example-prompts}

Hier zijn prompts die u direct kunt gebruiken met uw AI-assistent:

**E-mail verzenden:**
> "Verstuur een e-mail van hallo@mijndomein.com naar jan@voorbeeld.com met het onderwerp 'Vergadering morgen' en de tekst 'Hoi Jan, gaat het nog steeds door om 14.00 uur?'"

**Domeinbeheer:**
> "Lijst al mijn domeinen op en vertel me welke ongeverifieerde DNS-records hebben."

**Alias aanmaken:**
> "Maak een nieuwe alias support@mijndomein.com aan die doorstuurt naar mijn persoonlijke e-mail."

**Inbox zoeken (vereist alias-inloggegevens):**
> "Vind alle ongelezen e-mails van de afgelopen week die 'factuur' vermelden."

**Agenda (vereist alias-inloggegevens):**
> "Maak een agenda aan met de naam 'Werk' en voeg een vergadering toe voor morgen om 14.00 uur met de naam 'Team Standup'."

**Sieve-scripts:**
> "Schrijf een Sieve-script voor info@mijndomein.com dat automatisch antwoordt op e-mails met 'Bedankt voor uw bericht, we nemen binnen 24 uur contact met u op.'"

**Bulkoperaties:**
> "Maak aliassen aan voor sales@, support@, billing@ en info@ op mijndomein.com, die allemaal doorsturen naar team@mijndomein.com."

**Beveiligingscontrole:**
> "Controleer de DNS- en SMTP-verificatiestatus voor al mijn domeinen en vertel me of er iets aandacht nodig heeft."

**Aliaswachtwoord genereren:**
> "Genereer een wachtwoord voor de alias gebruiker@voorbeeld.com zodat ik toegang heb tot mijn inbox."


## Omgevingsvariabelen {#environment-variables}

| Variabele | Vereist | Standaard | Beschrijving |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Ja | — | Uw Forward Email API-sleutel (gebruikt als Basic auth gebruikersnaam voor API-sleutel eindpunten) |
| `FORWARD_EMAIL_ALIAS_USER` | Nee | — | Alias e-mailadres voor mailbox eindpunten (bijv. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nee | — | Gegenereerd alias wachtwoord voor mailbox eindpunten |
| `FORWARD_EMAIL_API_URL` | Nee | `https://api.forwardemail.net` | API basis-URL (voor zelf-gehost of testen) |


## Beveiliging {#security}

De MCP-server draait lokaal op uw machine. Zo werkt beveiliging:

*   **Uw inloggegevens blijven lokaal.** Zowel uw API-sleutel als alias-inloggegevens worden gelezen uit omgevingsvariabelen en gebruikt om API-verzoeken te authenticeren via HTTP Basic auth. Ze worden nooit naar het AI-model verzonden.
*   **stdio-transport.** De server communiceert met de AI-client via stdin/stdout. Er worden geen netwerkpoorten geopend.
*   **Geen gegevensopslag.** De server is stateless. Het cachet, logt of slaat geen van uw e-mailgegevens op.
*   **Open source.** De gehele codebase staat op [GitHub](https://github.com/forwardemail/mcp-server). U kunt elke regel controleren.


## Programmatisch gebruik {#programmatic-usage}

U kunt de server ook als bibliotheek gebruiken:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Open source {#open-source}

De Forward Email MCP Server is [open-source op GitHub](https://github.com/forwardemail/mcp-server) onder de BUSL-1.1 licentie. Wij geloven in transparantie. Als u een bug vindt of een functie wilt, [open dan een issue](https://github.com/forwardemail/mcp-server/issues).
