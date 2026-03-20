# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Avoimen lähdekoodin <a href="https://github.com/forwardemail/mcp-server">MCP-palvelimemme</a> antaa tekoälyavustajille kuten Claude, ChatGPT, Cursor ja Windsurf mahdollisuuden hallita sähköpostiasi, domainejasi, aliaksiasi, yhteystietojasi ja kalentereitasi luonnollisen kielen avulla. Kaikki 68 API-päätepistettä ovat saatavilla MCP-työkaluina. Se toimii paikallisesti komennolla <code>npx @forwardemail/mcp-server</code> — tunnistetietosi eivät koskaan poistu koneeltasi.
</p>


## Sisällysluettelo {#table-of-contents}

* [Mikä on MCP?](#what-is-mcp)
* [Pika-aloitus](#quick-start)
  * [Hanki API-avain](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Muut MCP-asiakkaat](#other-mcp-clients)
* [Todennus](#authentication)
  * [API-avaimen todennus](#api-key-auth)
  * [Alias-todennus](#alias-auth)
  * [Alias-salasanan luominen](#generating-an-alias-password)
* [Kaikki 68 työkalua](#all-68-tools)
  * [Tili (API-avain tai alias-todennus)](#account-api-key-or-alias-auth)
  * [Domainit (API-avain)](#domains-api-key)
  * [Aliasit (API-avain)](#aliases-api-key)
  * [Sähköpostit — Lähtö-SMTP (API-avain; Lähetys tukee molempia)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Viestit — IMAP (Alias-todennus)](#messages--imap-alias-auth)
  * [Kansiot — IMAP (Alias-todennus)](#folders--imap-alias-auth)
  * [Yhteystiedot — CardDAV (Alias-todennus)](#contacts--carddav-alias-auth)
  * [Kalenterit — CalDAV (Alias-todennus)](#calendars--caldav-alias-auth)
  * [Kalenteritapahtumat — CalDAV (Alias-todennus)](#calendar-events--caldav-alias-auth)
  * [Sieve-skriptit (API-avain)](#sieve-scripts-api-key)
  * [Sieve-skriptit (Alias-todennus)](#sieve-scripts-alias-auth)
  * [Domainin jäsenet ja kutsut (API-avain)](#domain-members-and-invites-api-key)
  * [Catch-All-salasanat (API-avain)](#catch-all-passwords-api-key)
  * [Lokit (API-avain)](#logs-api-key)
  * [Salaus (Ei todennusta)](#encrypt-no-auth)
* [20 Käytännön käyttötapausta](#20-real-world-use-cases)
  * [1. Sähköpostin lajittelu](#1-email-triage)
  * [2. Domainin asennuksen automatisointi](#2-domain-setup-automation)
  * [3. Aliasten massahallinta](#3-bulk-alias-management)
  * [4. Sähköpostikampanjoiden seuranta](#4-email-campaign-monitoring)
  * [5. Yhteystietojen synkronointi ja siivous](#5-contact-sync-and-cleanup)
  * [6. Kalenterinhallinta](#6-calendar-management)
  * [7. Sieve-skriptien automatisointi](#7-sieve-script-automation)
  * [8. Tiimin perehdytys](#8-team-onboarding)
  * [9. Turvallisuustarkastus](#9-security-auditing)
  * [10. Sähköpostin edelleenlähetyksen asennus](#10-email-forwarding-setup)
  * [11. Saapuneiden hakeminen ja analysointi](#11-inbox-search-and-analysis)
  * [12. Kansioiden järjestely](#12-folder-organization)
  * [13. Salasanojen kierto](#13-password-rotation)
  * [14. DNS-tietueiden salaus](#14-dns-record-encryption)
  * [15. Toimituslokien analysointi](#15-delivery-log-analysis)
  * [16. Monidomainien hallinta](#16-multi-domain-management)
  * [17. Catch-All-konfiguraatio](#17-catch-all-configuration)
  * [18. Domain-kutsujen hallinta](#18-domain-invite-management)
  * [19. S3-tallennustestaus](#19-s3-storage-testing)
  * [20. Sähköpostiluonnoksen kirjoittaminen](#20-email-draft-composition)
* [Esimerkkikehotteet](#example-prompts)
* [Ympäristömuuttujat](#environment-variables)
* [Turvallisuus](#security)
* [Ohjelmallinen käyttö](#programmatic-usage)
* [Avoin lähdekoodi](#open-source)


## Mikä on MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) on Anthropicin luoma avoin standardi, joka antaa tekoälymalleille turvallisen tavan kutsua ulkoisia työkaluja. Sen sijaan, että kopioisit ja liittäisit API-vastauksia keskusteluikkunaan, MCP antaa mallille suoran, rakenteellisen pääsyn palveluihisi.

MCP-palvelimemme käärii koko [Forward Email API:n](/email-api) — jokaisen päätepisteen, jokaisen parametrin — ja tarjoaa ne työkaluina, joita mikä tahansa MCP-yhteensopiva asiakas voi käyttää. Palvelin toimii paikallisesti koneellasi stdio-siirtoa käyttäen. Tunnistetietosi pysyvät ympäristömuuttujissasi eivätkä koskaan lähetetä tekoälymallille.


## Pika-aloitus {#quick-start}

### Hanki API-avain {#get-an-api-key}
1. Kirjaudu sisään [Forward Email -tilillesi](/my-account/domains).
2. Siirry kohtaan **Oma tili** → **Suojaus** → **API-avaimet**.
3. Luo uusi API-avain ja kopioi se.

### Claude Desktop {#claude-desktop}

Lisää tämä Claude Desktopin konfiguraatiotiedostoon:

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

Käynnistä Claude Desktop uudelleen. Näet Forward Email -työkalut työkalujen valitsimessa.

> **Huom:** Muuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` ovat valinnaisia, mutta pakollisia postilaatikkotyökaluille (viestit, kansiot, yhteystiedot, kalenterit). Katso lisätietoja [Todennus](#authentication)-kohdasta.

### Cursor {#cursor}

Avaa Cursor-asetukset → MCP → Lisää palvelin:

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

Avaa Windsurf-asetukset → MCP → Lisää palvelin samalla konfiguraatiolla kuin yllä.

### Muut MCP-asiakkaat {#other-mcp-clients}

Kaikki MCP stdio -siirtoa tukevat asiakkaat toimivat. Komento on:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Todennus {#authentication}

Forward Email API käyttää **HTTP Basic -todennusta** kahdella eri tunnistetyypillä riippuen päätepisteestä. MCP-palvelin hoitaa tämän automaattisesti — sinun tarvitsee vain antaa oikeat tunnistetiedot.

### API-avaimen todennus {#api-key-auth}

Useimmat hallintapäätepisteet (domainit, aliaset, lähtevät sähköpostit, lokit) käyttävät **API-avaintasi** Basic-todennuksen käyttäjänimenä tyhjällä salasanalla.

Tämä on sama API-avain, jota käytät REST API:ssa. Aseta se `FORWARD_EMAIL_API_KEY`-ympäristömuuttujalla.

### Alias-todennus {#alias-auth}

Postilaatikon päätepisteet (viestit, kansiot, yhteystiedot, kalenterit, alias-kohtaiset sieve-skriptit) käyttävät **alias-tunnuksia** — alias-sähköpostiosoitetta käyttäjänimenä ja generoitu salasanaa salasanana.

Nämä päätepisteet käyttävät alias-kohtaista dataa IMAP-, CalDAV- ja CardDAV-protokollien kautta. Ne vaativat alias-sähköpostin ja generoitu salasana, eivät API-avainta.

Voit antaa alias-tunnukset kahdella tavalla:

1. **Ympäristömuuttujat** (suositeltu oletusaliasille): Aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Työkalukohtaiset parametrit**: Lähetä `alias_username` ja `alias_password` argumentteina mille tahansa alias-todennusta käyttävälle työkalulle. Nämä ohittavat ympäristömuuttujat, mikä on hyödyllistä, kun käytät useita aliaksia.

### Alias-salasanan luominen {#generating-an-alias-password}

Ennen kuin voit käyttää alias-todennustyökaluja, sinun täytyy luoda salasana aliasille. Voit tehdä tämän `generateAliasPassword`-työkalulla tai API:n kautta:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Vastaus sisältää kentät `username` (alias-sähköposti) ja `password`. Käytä näitä alias-tunnuksina.

> **Vinkki:** Voit myös pyytää AI-avustajaltasi: *"Luo salasana aliasille <user@example.com> domainissa example.com"* — se kutsuu `generateAliasPassword`-työkalua ja palauttaa tunnukset.

Alla oleva taulukko tiivistää, mitä todennusmenetelmää kukin työkaluryhmä vaatii:

| Työkaluryhmä                                                  | Todennusmenetelmä        | Tunnistetiedot                                              |
| ------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| Tili                                                          | API-avain **tai** Alias-todennus | Jompikumpi                                                  |
| Domainit, Aliakset, Domainin jäsenet, Kutsut, Catch-All-salasanat | API-avain                | `FORWARD_EMAIL_API_KEY`                                     |
| Lähtevät sähköpostit (lista, haku, poisto, rajoitus)          | API-avain                | `FORWARD_EMAIL_API_KEY`                                     |
| Lähetä sähköposti                                             | API-avain **tai** Alias-todennus | Jompikumpi                                                  |
| Viestit (IMAP)                                                | Alias-todennus           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kansiot (IMAP)                                                | Alias-todennus           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Yhteystiedot (CardDAV)                                        | Alias-todennus           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenterit (CalDAV)                                          | Alias-todennus           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenteritapahtumat (CalDAV)                                 | Alias-todennus           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-skriptit (domain-kohtaiset)                            | API-avain                | `FORWARD_EMAIL_API_KEY`                                     |
| Sieve-skriptit (alias-kohtaiset)                             | Alias-todennus           | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Lokit                                                        | API-avain                | `FORWARD_EMAIL_API_KEY`                                     |
| Salaa                                                        | Ei mitään                | Ei tunnuksia tarvittu                                       |
## Kaikki 68 työkalua {#all-68-tools}

Jokainen työkalu vastaa suoraan [Forward Email API](/email-api) -päätepistettä. Parametrit käyttävät samoja nimiä kuin API-dokumentaatiossa. Todennusmenetelmä on mainittu kunkin osion otsikossa.

### Tili (API-avain tai alias-todennus) {#account-api-key-or-alias-auth}

API-avaimen todennuksella nämä palauttavat käyttäjätilisi tiedot. Alias-todennuksella ne palauttavat alias-/postilaatikkotiedot, mukaan lukien tallennustilan kiintiön ja asetukset.

| Työkalu          | API-päätepiste      | Kuvaus                      |
| --------------- | ------------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account`   | Hae tilisi tiedot            |
| `updateAccount` | `PUT /v1/account`   | Päivitä tilisi asetukset     |

### Domainit (API-avain) {#domains-api-key}

| Työkalu                | API-päätepiste                                   | Kuvaus                     |
| --------------------- | ------------------------------------------------ | -------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Listaa kaikki domainisi    |
| `createDomain`        | `POST /v1/domains`                               | Lisää uusi domain          |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Hae domainin tiedot        |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Päivitä domainin asetukset |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Poista domain              |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Vahvista DNS-tietueet      |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Vahvista SMTP-konfiguraatio|
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Testaa mukautettu S3-tallennus |

### Aliakset (API-avain) {#aliases-api-key}

| Työkalu                  | API-päätepiste                                                    | Kuvaus                                  |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Listaa domainin aliakset                 |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Luo uusi alias                           |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Hae aliasin tiedot                      |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Päivitä alias                          |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Poista alias                          |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Luo IMAP/SMTP-salasana alias-todennukseen |

### Sähköpostit — Lähtö-SMTP (API-avain; Lähetys tukee molempia) {#emails--outbound-smtp-api-key-send-supports-both}

| Työkalu          | API-päätepiste          | Todennus               | Kuvaus                      |
| --------------- | ----------------------- | ---------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | API-avain tai alias-todennus | Lähetä sähköposti SMTP:n kautta |
| `listEmails`    | `GET /v1/emails`        | API-avain              | Listaa lähtevät sähköpostit  |
| `getEmail`      | `GET /v1/emails/:id`    | API-avain              | Hae sähköpostin tiedot ja tila |
| `deleteEmail`   | `DELETE /v1/emails/:id` | API-avain              | Poista jonossa oleva sähköposti |
| `getEmailLimit` | `GET /v1/emails/limit`  | API-avain              | Tarkista lähetysraja         |

`sendEmail`-työkalu hyväksyy `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` ja `attachments`. Tämä vastaa `POST /v1/emails` -päätepistettä.

### Viestit — IMAP (Alias-todennus) {#messages--imap-alias-auth}

> **Vaatii alias-tunnukset.** Anna `alias_username` ja `alias_password` tai aseta ympäristömuuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Työkalu          | API-päätepiste             | Kuvaus                              |
| --------------- | ------------------------- | ---------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Listaa ja hae viestejä postilaatikosta |
| `createMessage` | `POST /v1/messages`       | Luo luonnos tai lataa viesti       |
| `getMessage`    | `GET /v1/messages/:id`    | Hae viesti tunnuksella             |
| `updateMessage` | `PUT /v1/messages/:id`    | Päivitä liput (luettu, tähdellä merkitty, jne.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Poista viesti                     |

`listMessages`-työkalu tukee yli 15 hakuehtoa, mukaan lukien `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` ja `has_attachment`. Katso täydellinen lista [API-dokumentaatiosta](/email-api).

### Kansiot — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Vaatii alias-tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta ympäristömuuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Työkalu         | API-päätepiste            | Kuvaus                   |
| -------------- | ------------------------- | ------------------------ |
| `listFolders`  | `GET /v1/folders`         | Listaa kaikki postilaatikon kansiot |
| `createFolder` | `POST /v1/folders`        | Luo uusi kansio          |
| `getFolder`    | `GET /v1/folders/:id`     | Hae kansion tiedot       |
| `updateFolder` | `PUT /v1/folders/:id`     | Nimeä kansio uudelleen   |
| `deleteFolder` | `DELETE /v1/folders/:id`  | Poista kansio            |

### Yhteystiedot — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Vaatii alias-tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta ympäristömuuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Työkalu          | API-päätepiste            | Kuvaus                  |
| --------------- | ------------------------- | ----------------------- |
| `listContacts`  | `GET /v1/contacts`        | Listaa kaikki yhteystiedot |
| `createContact` | `POST /v1/contacts`       | Luo uusi yhteystieto    |
| `getContact`    | `GET /v1/contacts/:id`    | Hae yhteystiedon tiedot |
| `updateContact` | `PUT /v1/contacts/:id`    | Päivitä yhteystieto     |
| `deleteContact` | `DELETE /v1/contacts/:id` | Poista yhteystieto      |

### Kalenterit — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Vaatii alias-tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta ympäristömuuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Työkalu          | API-päätepiste            | Kuvaus                  |
| ---------------- | ------------------------- | ----------------------- |
| `listCalendars`  | `GET /v1/calendars`       | Listaa kaikki kalenterit |
| `createCalendar` | `POST /v1/calendars`      | Luo uusi kalenteri      |
| `getCalendar`    | `GET /v1/calendars/:id`   | Hae kalenterin tiedot  |
| `updateCalendar` | `PUT /v1/calendars/:id`   | Päivitä kalenteri      |
| `deleteCalendar` | `DELETE /v1/calendars/:id`| Poista kalenteri       |

### Kalenteritapahtumat — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Vaatii alias-tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta ympäristömuuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Työkalu               | API-päätepiste               | Kuvaus                 |
| --------------------- | ---------------------------- | ---------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`    | Listaa kaikki tapahtumat |
| `createCalendarEvent` | `POST /v1/calendar-events`   | Luo uusi tapahtuma     |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`| Hae tapahtuman tiedot  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`| Päivitä tapahtuma      |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Poista tapahtuma  |

### Sieve-skriptit (API-avain) {#sieve-scripts-api-key}

Nämä käyttävät domain-aluekohtaisia polkuja ja todentuvat API-avaimellasi.

| Työkalu               | API-päätepiste                                                                 | Kuvaus                   |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------ |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                           | Listaa skriptit aliasille |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                          | Luo uusi skripti         |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`                | Hae skriptin tiedot      |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`                | Päivitä skripti          |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`             | Poista skripti           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`      | Aktivoi skripti          |
### Sieve-skriptit (Alias Auth) {#sieve-scripts-alias-auth}

Nämä käyttävät alias-tason todennusta. Hyödyllinen alias-kohtaiseen automaatioon ilman API-avaimen tarvetta.

> **Vaatii alias-tunnukset.** Anna `alias_username` ja `alias_password` tai aseta ympäristömuuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Työkalu                        | API-päätepiste                               | Kuvaus             |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Listaa skriptit    |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Luo skripti        |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Hae skriptin tiedot|
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Päivitä skripti    |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Poista skripti     |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivoi skripti    |

### Domainin jäsenet ja kutsut (API-avain) {#domain-members-and-invites-api-key}

| Työkalu               | API-päätepiste                                       | Kuvaus                     |
| --------------------- | ---------------------------------------------------- | -------------------------- |
| `updateDomainMember`   | `PUT /v1/domains/:domain_id/members/:member_id`      | Muuta jäsenen roolia       |
| `removeDomainMember`   | `DELETE /v1/domains/:domain_id/members/:member_id`   | Poista jäsen               |
| `acceptDomainInvite`   | `GET /v1/domains/:domain_id/invites`                 | Hyväksy odottava kutsu     |
| `createDomainInvite`   | `POST /v1/domains/:domain_id/invites`                | Kutsu joku domainiin       |
| `removeDomainInvite`   | `DELETE /v1/domains/:domain_id/invites`              | Peruuta kutsu              |

### Catch-All-salasanat (API-avain) {#catch-all-passwords-api-key}

| Työkalu                   | API-päätepiste                                                  | Kuvaus                      |
| ------------------------- | --------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`   | `GET /v1/domains/:domain_id/catch-all-passwords`                | Listaa catch-all-salasanat  |
| `createCatchAllPassword`  | `POST /v1/domains/:domain_id/catch-all-passwords`               | Luo catch-all-salasana      |
| `deleteCatchAllPassword`  | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`   | Poista catch-all-salasana   |

### Lokit (API-avain) {#logs-api-key}

| Työkalu         | API-päätepiste            | Kuvaus                      |
| --------------- | ------------------------- | --------------------------- |
| `downloadLogs`  | `GET /v1/logs/download`   | Lataa sähköpostin toimituslokit |

### Salaa (Ei todennusta) {#encrypt-no-auth}

| Työkalu          | API-päätepiste       | Kuvaus                      |
| ---------------- | -------------------- | --------------------------- |
| `encryptRecord`  | `POST /v1/encrypt`   | Salaa DNS TXT -tietue       |

Tämä työkalu ei vaadi todennusta. Se salaa edelleenlähetysmerkinnät kuten `forward-email=user@example.com` käytettäväksi DNS TXT -tietueissa.


## 20 Käytännön käyttötapausta {#20-real-world-use-cases}

Tässä käytännön tapoja käyttää MCP-palvelinta AI-avustajasi kanssa:

### 1. Sähköpostin lajittelu {#1-email-triage}

Pyydä AI:tasi skannaamaan postilaatikkosi ja tiivistämään lukemattomat viestit. Se voi merkitä kiireelliset sähköpostit, luokitella lähettäjän mukaan ja luonnostella vastauksia — kaikki luonnollisella kielellä. *(Vaatii alias-tunnukset postilaatikon käyttöön.)*

### 2. Domainin asennuksen automatisointi {#2-domain-setup-automation}

Oletko perustamassa uutta domainia? Pyydä AI:tä luomaan domain, lisäämään aliasit, varmistamaan DNS-tietueet ja testaamaan SMTP-konfiguraation. Mikä normaalisti vie 10 minuuttia dashboardien klikkailua, muuttuu yhdeksi keskusteluksi.

### 3. Aliasien massahallinta {#3-bulk-alias-management}

Tarvitsetko 20 aliasia uuteen projektiin? Kuvaile tarpeesi ja anna AI:n hoitaa toistuvat tehtävät. Se voi luoda aliasit, asettaa edelleenlähetyssäännöt ja generoida salasanat kerralla.
### 4. Sähköpostikampanjan seuranta {#4-email-campaign-monitoring}

Pyydä tekoälyäsi tarkistamaan lähetysrajat, listaamaan viimeisimmät lähtevät sähköpostit ja raportoimaan toimitustilanteesta. Hyödyllinen transaktiosähköpostien terveyden seurantaan.

### 5. Yhteystietojen synkronointi ja siivous {#5-contact-sync-and-cleanup}

Käytä CardDAV-työkaluja listataksesi kaikki yhteystiedot, löytääksesi kaksoiskappaleet, päivittääksesi vanhentuneet tiedot tai luodaksesi massana yhteystietoja taulukosta, jonka liität keskusteluun. *(Vaatii alias-tunnukset.)*

### 6. Kalenterinhallinta {#6-calendar-management}

Luo kalentereita, lisää tapahtumia, päivitä kokousaikoja ja poista peruutettuja tapahtumia — kaikki keskustelun kautta. CalDAV-työkalut tukevat täydellistä CRUD-toiminnallisuutta sekä kalentereille että tapahtumille. *(Vaatii alias-tunnukset.)*

### 7. Sieve-skriptien automaatio {#7-sieve-script-automation}

Sieve-skriptit ovat tehokkaita, mutta syntaksi on monimutkainen. Pyydä tekoälyäsi kirjoittamaan Sieve-skriptejä puolestasi: "Suodata kaikki sähköpostit osoitteesta <billing@example.com> Billing-kansioon" muuttuu toimivaksi skriptiksi ilman, että sinun tarvitsee koskea RFC 5228 -määritykseen.

### 8. Tiimin perehdytys {#8-team-onboarding}

Kun uusi tiimin jäsen liittyy, pyydä tekoälyä luomaan heidän alias, generoimaan salasana, lähettämään tervetuloviesti tunnuksineen ja lisäämään heidät domainin jäseneksi. Yksi pyyntö, neljä API-kutsua.

### 9. Turvallisuustarkastus {#9-security-auditing}

Pyydä tekoälyäsi listaamaan kaikki domainit, tarkistamaan DNS-varmennustila, tarkastelemaan alias-asetuksia ja tunnistamaan domainit, joilla on vahvistamattomia tietueita. Nopea turvallisuustarkastus luonnollisella kielellä.

### 10. Sähköpostin edelleenlähetyksen asetukset {#10-email-forwarding-setup}

Oletko määrittämässä sähköpostin edelleenlähetystä uudelle domainille? Pyydä tekoälyä luomaan domain, lisäämään edelleenlähetysaliasit, salaamaan DNS-tietueet ja varmistamaan, että kaikki on konfiguroitu oikein.

### 11. Saapuneiden hakeminen ja analysointi {#11-inbox-search-and-analysis}

Käytä viestien hakutyökaluja löytääksesi tiettyjä sähköposteja: "Etsi kaikki sähköpostit osoitteesta <john@example.com> viimeisen 30 päivän ajalta, joissa on liitteitä." Yli 15 hakuehtoa tekevät tästä tehokkaan. *(Vaatii alias-tunnukset.)*

### 12. Kansioiden järjestely {#12-folder-organization}

Pyydä tekoälyäsi luomaan kansiorakenne uudelle projektille, siirtämään viestejä kansioiden välillä tai siivoamaan vanhoja kansioita, joita et enää tarvitse. *(Vaatii alias-tunnukset.)*

### 13. Salasanojen kierto {#13-password-rotation}

Generoi uusia alias-salasanoja aikataulun mukaan. Pyydä tekoälyä luomaan uusi salasana jokaiselle aliasille ja raportoimaan uudet tunnukset.

### 14. DNS-tietueiden salaus {#14-dns-record-encryption}

Salaa edelleenlähetyksen tietueet ennen niiden lisäämistä DNS:ään. `encryptRecord`-työkalu hoitaa tämän ilman todennusta — hyödyllinen nopeisiin kertakäyttösalauksiin.

### 15. Toimituslokin analyysi {#15-delivery-log-analysis}

Lataa sähköpostin toimituslokit ja pyydä tekoälyä analysoimaan palautusprosentit, tunnistamaan ongelmalliset vastaanottajat tai seuraamaan toimitusaikoja.

### 16. Monidomainien hallinta {#16-multi-domain-management}

Jos hallinnoit useita domaineja, pyydä tekoälyä antamaan tilanneraportti: mitkä domainit on varmennettu, mitkä ovat ongelmissa, kuinka monta aliasia kullakin on ja miltä lähetysrajat näyttävät.

### 17. Catch-All -asetukset {#17-catch-all-configuration}

Määritä catch-all -salasanat domaineille, jotka tarvitsevat vastaanottaa sähköpostia millä tahansa osoitteella. Tekoäly voi luoda, listata ja hallita näitä salasanoja puolestasi.

### 18. Domain-kutsujen hallinta {#18-domain-invite-management}

Kutsu tiimin jäseniä hallinnoimaan domaineja, tarkista odottavat kutsut ja siivoa vanhentuneet. Hyödyllinen organisaatioille, joilla on useita domainin ylläpitäjiä.

### 19. S3-tallennustilan testaus {#19-s3-storage-testing}

Jos käytät mukautettua S3-tallennustilaa sähköpostivarmenteille, pyydä tekoälyä testaamaan yhteys ja varmistamaan, että se toimii oikein.

### 20. Sähköpostiluonnosten koostaminen {#20-email-draft-composition}

Luo luonnoksia sähköposteista postilaatikkoosi ilman lähettämistä. Hyödyllinen sähköpostien valmisteluun, jotka tarvitsevat tarkistuksen ennen lähettämistä, tai sähköpostipohjien rakentamiseen. *(Vaatii alias-tunnukset.)*


## Esimerkkipyyntöjä {#example-prompts}

Tässä on pyyntöjä, joita voit käyttää suoraan tekoälyavustajasi kanssa:

**Sähköpostin lähetys:**

> "Lähetä sähköposti osoitteesta <hello@mydomain.com> osoitteeseen <john@example.com> otsikolla 'Tapaaminen huomenna' ja tekstillä 'Hei John, ollaanko edelleen sovittu klo 14?'"
**Domainin hallinta:**

> "Listaa kaikki domainini ja kerro, mitkä niistä sisältävät vahvistamattomia DNS-tietueita."

**Aliasluonti:**

> "Luo uusi alias <support@mydomain.com>, joka edelleenohjaa henkilökohtaiseen sähköpostiini."

**Saapuneiden hakeminen (vaatii alias-tunnukset):**

> "Etsi kaikki lukemattomat viime viikon aikana saapuneet sähköpostit, joissa mainitaan 'lasku'."

**Kalenteri (vaatii alias-tunnukset):**

> "Luo kalenteri nimeltä 'Työ' ja lisää kokous huomiselle klo 14 nimeltä 'Tiimin seisahtuminen'."

**Sieve-skriptit:**

> "Kirjoita Sieve-skripti <info@mydomain.com> -osoitteelle, joka vastaa automaattisesti sähköposteihin tekstillä 'Kiitos yhteydenotostasi, palaamme asiaan 24 tunnin kuluessa.'"

**Massatoiminnot:**

> "Luo aliasit sales@, support@, billing@ ja info@ osoitteisiin mydomain.com, kaikki edelleenohjaten <team@mydomain.com>."

**Turvatarkastus:**

> "Tarkista kaikkien domainieni DNS- ja SMTP-vahvistustila ja kerro, jos jokin vaatii huomiota."

**Luo alias-salasana:**

> "Luo salasana aliasille <user@example.com>, jotta voin käyttää postilaatikkoani."


## Ympäristömuuttujat {#environment-variables}

| Muuttuja                       | Pakollinen | Oletus                         | Kuvaus                                                                         |
| ------------------------------ | ---------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Kyllä      | —                              | Forward Email API -avain (käytetään Basic auth -käyttäjänimenä API-avaimen päätepisteissä) |
| `FORWARD_EMAIL_ALIAS_USER`     | Ei         | —                              | Alias-sähköpostiosoite postilaatikon päätepisteille (esim. `user@example.com`)  |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Ei         | —                              | Luotu alias-salasana postilaatikon päätepisteille                              |
| `FORWARD_EMAIL_API_URL`        | Ei         | `https://api.forwardemail.net` | API:n perus-URL (itseisännöityyn tai testaukseen)                              |


## Turvallisuus {#security}

MCP-palvelin toimii paikallisesti koneellasi. Näin turvallisuus toimii:

* **Tunnuksesi pysyvät paikallisina.** Sekä API-avaimesi että alias-tunnuksesi luetaan ympäristömuuttujista ja niitä käytetään API-pyyntöjen todennukseen HTTP Basic authin kautta. Niitä ei koskaan lähetetä AI-mallille.
* **stdio-siirto.** Palvelin kommunikoi AI-asiakkaan kanssa stdin/stdoutin kautta. Verkkoportteja ei avata.
* **Ei datan tallennusta.** Palvelin on tilaton. Se ei välimuistita, kirjaa tai tallenna mitään sähköpostidataa.
* **Avoin lähdekoodi.** Koko koodikanta on saatavilla [GitHubissa](https://github.com/forwardemail/mcp-server). Voit tarkastaa jokaisen rivin.


## Ohjelmallinen käyttö {#programmatic-usage}

Voit käyttää palvelinta myös kirjastona:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Avoin lähdekoodi {#open-source}

Forward Email MCP Server on [avoin lähdekoodi GitHubissa](https://github.com/forwardemail/mcp-server) BUSL-1.1 -lisenssillä. Uskomme läpinäkyvyyteen. Jos löydät virheen tai haluat ominaisuuden, [avaa issue](https://github.com/forwardemail/mcp-server/issues).
