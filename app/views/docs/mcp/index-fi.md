# Forward Email MCP-palvelin

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">Avoimen lähdekoodin MCP-palvelimemme</a> antaa tekoälyavustajien, kuten Clauden, ChatGPT:n, Cursorin ja Windsurfin, hallita sähköpostiasi, verkkotunnuksiasi, aliaksiasi, yhteystietojasi ja kalentereitasi luonnollisen kielen avulla. Kaikki 68 API-päätepistettä on paljastettu MCP-työkaluina. Se toimii paikallisesti komennolla <code>npx @forwardemail/mcp-server</code> – tunnistetietosi eivät koskaan poistu koneeltasi.
</p>

## Sisällysluettelo {#table-of-contents}

* [Mikä on MCP?](#what-is-mcp)
* [Pika-aloitus](#quick-start)
  * [Hanki API-avain](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Muut MCP-asiakasohjelmat](#other-mcp-clients)
* [Todennus](#authentication)
  * [API-avaimen todennus](#api-key-auth)
  * [Aliaksen todennus](#alias-auth)
  * [Aliaksen salasanan luominen](#generating-an-alias-password)
* [Kaikki 68 työkalua](#all-68-tools)
  * [Tili (API-avain tai aliaksen todennus)](#account-api-key-or-alias-auth)
  * [Verkkotunnukset (API-avain)](#domains-api-key)
  * [Aliakset (API-avain)](#aliases-api-key)
  * [Sähköpostit – lähtevä SMTP (API-avain; lähetys tukee molempia)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Viestit – IMAP (aliaksen todennus)](#messages--imap-alias-auth)
  * [Kansiot – IMAP (aliaksen todennus)](#folders--imap-alias-auth)
  * [Yhteystiedot – CardDAV (aliaksen todennus)](#contacts--carddav-alias-auth)
  * [Kalenterit – CalDAV (aliaksen todennus)](#calendars--caldav-alias-auth)
  * [Kalenteritapahtumat – CalDAV (aliaksen todennus)](#calendar-events--caldav-alias-auth)
  * [Sieve-skriptit (API-avain)](#sieve-scripts-api-key)
  * [Sieve-skriptit (aliaksen todennus)](#sieve-scripts-alias-auth)
  * [Verkkotunnuksen jäsenet ja kutsut (API-avain)](#domain-members-and-invites-api-key)
  * [Catch-All-salasanat (API-avain)](#catch-all-passwords-api-key)
  * [Lokit (API-avain)](#logs-api-key)
  * [Salaa (ei todennusta)](#encrypt-no-auth)
* [20 todellista käyttötapausta](#20-real-world-use-cases)
* [Esimerkkikehotteet](#example-prompts)
* [Ympäristömuuttujat](#environment-variables)
* [Turvallisuus](#security)
* [Ohjelmallinen käyttö](#programmatic-usage)
* [Avoin lähdekoodi](#open-source)


## Mikä on MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) on Anthropicin luoma avoin standardi, jonka avulla tekoälymallit voivat kutsua ulkoisia työkaluja turvallisesti. Sen sijaan, että API-vastauksia kopioitaisiin ja liitettäisiin chat-ikkunaan, MCP antaa mallille suoran, jäsennellyn pääsyn palveluihisi.

MCP-palvelimemme käärii koko [Forward Email API:n](/email-api) – jokaisen päätepisteen, jokaisen parametrin – ja paljastaa ne työkaluina, joita mikä tahansa MCP-yhteensopiva asiakasohjelma voi käyttää. Palvelin toimii paikallisesti koneellasi stdio-siirron avulla. Tunnistetietosi pysyvät ympäristömuuttujissasi, eikä niitä koskaan lähetetä tekoälymallille.


## Pika-aloitus {#quick-start}

### Hanki API-avain {#get-an-api-key}

1. Kirjaudu sisään [Forward Email -tilillesi](/my-account/domains).
2. Siirry kohtaan **Oma tili** → **Turvallisuus** → **API-avaimet**.
3. Luo uusi API-avain ja kopioi se.

### Claude Desktop {#claude-desktop}

Lisää tämä Claude Desktopin asetustiedostoon:

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

Käynnistä Claude Desktop uudelleen. Sinun pitäisi nähdä Forward Email -työkalut työkalunvalitsimessa.

> **Huomautus:** Muuttujat `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` ovat valinnaisia, mutta ne vaaditaan postilaatikkotyökaluille (viestit, kansiot, yhteystiedot, kalenterit). Katso lisätietoja kohdasta [Todennus](#authentication).

### Cursor {#cursor}

Avaa Cursorin asetukset → MCP → Lisää palvelin:

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

Avaa Windsurfin asetukset → MCP → Lisää palvelin samalla kokoonpanolla kuin yllä.

### Muut MCP-asiakasohjelmat {#other-mcp-clients}

Mikä tahansa asiakasohjelma, joka tukee MCP stdio -siirtoa, toimii. Komento on:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Todennus {#authentication}

Forward Email API käyttää **HTTP Basic -todennusta** kahdella eri tunnistetietotyypillä päätepisteestä riippuen. MCP-palvelin hoitaa tämän automaattisesti – sinun tarvitsee vain antaa oikeat tunnistetiedot.

### API-avaimen todennus {#api-key-auth}

Useimmat hallintapäätepisteet (verkkotunnukset, aliakset, lähtevät sähköpostit, lokit) käyttävät **API-avaintasi** Basic-todennuksen käyttäjätunnuksena tyhjällä salasanalla.

Tämä on sama API-avain, jota käytät REST API:ssa. Aseta se `FORWARD_EMAIL_API_KEY` -ympäristömuuttujan kautta.

### Aliaksen todennus {#alias-auth}

Postilaatikkopäätepisteet (viestit, kansiot, yhteystiedot, kalenterit, aliaskohtaiset Sieve-skriptit) käyttävät **aliaksen tunnistetietoja** – aliaksen sähköpostiosoitetta käyttäjätunnuksena ja luotua salasanaa salasanana.

Nämä päätepisteet käyttävät aliaskohtaisia tietoja IMAP-, CalDAV- ja CardDAV-protokollien kautta. Ne vaativat aliaksen sähköpostiosoitteen ja luodun salasanan, eivät API-avainta.

Voit antaa aliaksen tunnistetiedot kahdella tavalla:

1. **Ympäristömuuttujat** (suositellaan oletusaliakselle): Aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Työkalukutsukohtaiset parametrit**: Anna `alias_username` ja `alias_password` argumentteina mihin tahansa aliaksen todennustyökaluun. Nämä ohittavat ympäristömuuttujat, mikä on hyödyllistä työskenneltäessä useiden aliasten kanssa.

### Aliaksen salasanan luominen {#generating-an-alias-password}

Ennen kuin voit käyttää aliaksen todennustyökaluja, sinun on luotava salasana aliakselle. Voit tehdä tämän `generateAliasPassword`-työkalulla tai API:n kautta:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Vastaus sisältää `username` (aliaksen sähköpostiosoite) ja `password` -kentät. Käytä näitä aliaksen tunnistetietoina.

> **Vinkki:** Voit myös kysyä tekoälyavustajaltasi: *"Luo salasana aliakselle user@example.com verkkotunnuksella example.com"* – se kutsuu `generateAliasPassword`-työkalua ja palauttaa tunnistetiedot.

Alla oleva taulukko tiivistää, minkä todennusmenetelmän kukin työkaluryhmä vaatii:

| Työkaluryhmä | Todennusmenetelmä | Tunnistetiedot |
|-----------|-------------|-------------|
| Tili | API-avain **tai** aliaksen todennus | Kumpi tahansa |
| Verkkotunnukset, aliakset, verkkotunnuksen jäsenet, kutsut, catch-all-salasanat | API-avain | `FORWARD_EMAIL_API_KEY` |
| Lähtevät sähköpostit (listaa, hae, poista, rajaa) | API-avain | `FORWARD_EMAIL_API_KEY` |
| Lähetä sähköposti | API-avain **tai** aliaksen todennus | Kumpi tahansa |
| Viestit (IMAP) | Aliaksen todennus | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kansiot (IMAP) | Aliaksen todennus | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Yhteystiedot (CardDAV) | Aliaksen todennus | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenterit (CalDAV) | Aliaksen todennus | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenteritapahtumat (CalDAV) | Aliaksen todennus | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-skriptit (verkkotunnuskohtaiset) | API-avain | `FORWARD_EMAIL_API_KEY` |
| Sieve-skriptit (aliaskohtaiset) | Aliaksen todennus | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Lokit | API-avain | `FORWARD_EMAIL_API_KEY` |
| Salaa | Ei mitään | Tunnistetietoja ei tarvita |


## Kaikki 68 työkalua {#all-68-tools}

Jokainen työkalu vastaa suoraan [Forward Email API](/email-api) -päätepistettä. Parametrit käyttävät samoja nimiä kuin API-dokumentaatiossa. Todennusmenetelmä on mainittu kunkin osion otsikossa.

### Tili (API-avain tai aliaksen todennus) {#account-api-key-or-alias-auth}

API-avaimen todennuksella nämä palauttavat käyttäjätilisi tiedot. Aliaksen todennuksella ne palauttavat aliaksen/postilaatikon tiedot, mukaan lukien tallennustilan kiintiön ja asetukset.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Hae tilitietosi |
| `updateAccount` | `PUT /v1/account` | Päivitä tiliasetuksesi |

### Verkkotunnukset (API-avain) {#domains-api-key}

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Listaa kaikki verkkotunnuksesi |
| `createDomain` | `POST /v1/domains` | Lisää uusi verkkotunnus |
| `getDomain` | `GET /v1/domains/:domain_id` | Hae verkkotunnuksen tiedot |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Päivitä verkkotunnuksen asetukset |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Poista verkkotunnus |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Tarkista DNS-tietueet |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Tarkista SMTP-määritys |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Testaa mukautettu S3-tallennustila |

### Aliakset (API-avain) {#aliases-api-key}

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Listaa verkkotunnuksen aliakset |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Luo uusi alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Hae aliaksen tiedot |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Päivitä alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Poista alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Luo IMAP/SMTP-salasana aliaksen todennusta varten |

### Sähköpostit – lähtevä SMTP (API-avain; lähetys tukee molempia) {#emails--outbound-smtp-api-key-send-supports-both}

| Työkalu | API-päätepiste | Todennus | Kuvaus |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API-avain tai aliaksen todennus | Lähetä sähköposti SMTP:n kautta |
| `listEmails` | `GET /v1/emails` | API-avain | Listaa lähtevät sähköpostit |
| `getEmail` | `GET /v1/emails/:id` | API-avain | Hae sähköpostin tiedot ja tila |
| `deleteEmail` | `DELETE /v1/emails/:id` | API-avain | Poista jonossa oleva sähköposti |
| `getEmailLimit` | `GET /v1/emails/limit` | API-avain | Tarkista lähetysrajasi |

`sendEmail`-työkalu hyväksyy parametrit `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` ja `attachments`. Tämä on sama kuin `POST /v1/emails` -päätepiste.

### Viestit – IMAP (aliaksen todennus) {#messages--imap-alias-auth}

> **Vaatii aliaksen tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` -ympäristömuuttujat.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Listaa ja hae viestejä postilaatikosta |
| `createMessage` | `POST /v1/messages` | Luo luonnos tai lataa viesti |
| `getMessage` | `GET /v1/messages/:id` | Hae viesti ID:n perusteella |
| `updateMessage` | `PUT /v1/messages/:id` | Päivitä liput (luettu, tähdellä merkitty jne.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Poista viesti |

`listMessages`-työkalu tukee yli 15 hakuparametria, mukaan lukien `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` ja `has_attachment`. Katso täydellinen luettelo [API-dokumentaatiosta](/email-api).

### Kansiot – IMAP (aliaksen todennus) {#folders--imap-alias-auth}

> **Vaatii aliaksen tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` -ympäristömuuttujat.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Listaa kaikki postilaatikkokansiot |
| `createFolder` | `POST /v1/folders` | Luo uusi kansio |
| `getFolder` | `GET /v1/folders/:id` | Hae kansion tiedot |
| `updateFolder` | `PUT /v1/folders/:id` | Nimeä kansio uudelleen |
| `deleteFolder` | `DELETE /v1/folders/:id` | Poista kansio |

### Yhteystiedot – CardDAV (aliaksen todennus) {#contacts--carddav-alias-auth}

> **Vaatii aliaksen tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` -ympäristömuuttujat.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Listaa kaikki yhteystiedot |
| `createContact` | `POST /v1/contacts` | Luo uusi yhteystieto |
| `getContact` | `GET /v1/contacts/:id` | Hae yhteystiedon tiedot |
| `updateContact` | `PUT /v1/contacts/:id` | Päivitä yhteystieto |
| `deleteContact` | `DELETE /v1/contacts/:id` | Poista yhteystieto |

### Kalenterit – CalDAV (aliaksen todennus) {#calendars--caldav-alias-auth}

> **Vaatii aliaksen tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` -ympäristömuuttujat.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Listaa kaikki kalenterit |
| `createCalendar` | `POST /v1/calendars` | Luo uusi kalenteri |
| `getCalendar` | `GET /v1/calendars/:id` | Hae kalenterin tiedot |
| `updateCalendar` | `PUT /v1/calendars/:id` | Päivitä kalenteri |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Poista kalenteri |

### Kalenteritapahtumat – CalDAV (aliaksen todennus) {#calendar-events--caldav-alias-auth}

> **Vaatii aliaksen tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` -ympäristömuuttujat.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Listaa kaikki tapahtumat |
| `createCalendarEvent` | `POST /v1/calendar-events` | Luo uusi tapahtuma |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Hae tapahtuman tiedot |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Päivitä tapahtuma |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Poista tapahtuma |

### Sieve-skriptit (API-avain) {#sieve-scripts-api-key}

Nämä käyttävät verkkotunnuskohtaisia polkuja ja todennetaan API-avaimellasi.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Listaa aliaksen skriptit |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Luo uusi skripti |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Hae skriptin tiedot |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Päivitä skripti |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Poista skripti |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktivoi skripti |

### Sieve-skriptit (aliaksen todennus) {#sieve-scripts-alias-auth}

Nämä käyttävät aliaksen tason todennusta. Hyödyllinen aliaskohtaiseen automaatioon ilman API-avainta.

> **Vaatii aliaksen tunnistetiedot.** Anna `alias_username` ja `alias_password` tai aseta `FORWARD_EMAIL_ALIAS_USER` ja `FORWARD_EMAIL_ALIAS_PASSWORD` -ympäristömuuttujat.

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Listaa skriptit |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Luo skripti |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Hae skriptin tiedot |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Päivitä skripti |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Poista skripti |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivoi skripti |

### Verkkotunnuksen jäsenet ja kutsut (API-avain) {#domain-members-and-invites-api-key}

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Muuta jäsenen roolia |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Poista jäsen |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Hyväksy odottava kutsu |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Kutsu joku verkkotunnukseen |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Peruuta kutsu |

### Catch-All-salasanat (API-avain) {#catch-all-passwords-api-key}

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Listaa catch-all-salasanat |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Luo catch-all-salasana |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Poista catch-all-salasana |

### Lokit (API-avain) {#logs-api-key}

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Lataa sähköpostin toimituslokit |

### Salaa (ei todennusta) {#encrypt-no-auth}

| Työkalu | API-päätepiste | Kuvaus |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Salaa DNS TXT -tietue |

Tämä työkalu ei vaadi todennusta. Se salaa edelleenlähetystietueet, kuten `forward-email=user@example.com`, käytettäväksi DNS TXT -tietueissa.


## 20 todellista käyttötapausta {#20-real-world-use-cases}

Tässä on käytännöllisiä tapoja käyttää MCP-palvelinta tekoälyavustajasi kanssa:

### 1. Sähköpostin lajittelu

Pyydä tekoälyäsi skannaamaan postilaatikkosi ja tiivistämään lukemattomat viestit. Se voi merkitä kiireelliset sähköpostit, luokitella ne lähettäjän mukaan ja laatia vastauksia – kaikki luonnollisen kielen avulla. *(Vaatii aliaksen tunnistetiedot postilaatikon käyttöön.)*

### 2. Verkkotunnuksen asennuksen automatisointi

Oletko perustamassa uutta verkkotunnusta? Pyydä tekoälyä luomaan verkkotunnus, lisäämään aliaksesi, tarkistamaan DNS-tietueet ja testaamaan SMTP-määritykset. Se, mikä normaalisti kestää 10 minuuttia kojelaudan läpi klikkailemista, muuttuu yhdeksi keskusteluksi.

### 3. Aliasten massahallinta

Tarvitsetko luoda 20 aliasa uutta projektia varten? Kuvaile tarpeesi ja anna tekoälyn hoitaa toistuva työ. Se voi luoda aliaksia, asettaa edelleenlähetyssääntöjä ja luoda salasanoja yhdellä kertaa.

### 4. Sähköpostikampanjan seuranta

Pyydä tekoälyäsi tarkistamaan lähetysrajat, listaamaan viimeisimmät lähtevät sähköpostit ja raportoimaan toimitustilasta. Hyödyllinen transaktiosähköpostin tilan seurantaan.

### 5. Yhteystietojen synkronointi ja siivous

Käytä CardDAV-työkaluja kaikkien yhteystietojen listaamiseen, kaksoiskappaleiden etsimiseen, vanhentuneiden tietojen päivittämiseen tai yhteystietojen massaluomiseen chat-ikkunaan liittämästäsi laskentataulukosta. *(Vaatii aliaksen tunnistetiedot.)*

### 6. Kalenterin hallinta

Luo kalentereita, lisää tapahtumia, päivitä kokousaikoja ja poista peruutettuja tapahtumia – kaikki keskustelun kautta. CalDAV-työkalut tukevat täyttä CRUD-toimintoa sekä kalentereille että tapahtumille. *(Vaatii aliaksen tunnistetiedot.)*

### 7. Sieve-skriptien automatisointi

Sieve-skriptit ovat tehokkaita, mutta niiden syntaksi on salaperäinen. Pyydä tekoälyäsi kirjoittamaan Sieve-skriptejä puolestasi: "Suodata kaikki sähköpostit osoitteesta billing@example.com laskutuskansioon" muuttuu toimivaksi skriptiksi koskematta RFC 5228 -määritykseen.

### 8. Tiimin perehdytys

Kun uusi tiimin jäsen liittyy, pyydä tekoälyä luomaan hänen aliaksensa, luomaan salasana, lähettämään hänelle tervetuliaisviestin tunnistetietoineen ja lisäämään hänet verkkotunnuksen jäseneksi. Yksi kehote, neljä API-kutsua.

### 9. Turvallisuustarkastus

Pyydä tekoälyäsi listaamaan kaikki verkkotunnukset, tarkistamaan DNS-vahvistuksen tila, tarkistamaan aliaksen kokoonpanot ja tunnistamaan kaikki verkkotunnukset, joilla on vahvistamattomia tietueita. Nopea turvallisuustarkastus luonnollisella kielellä.

### 10. Sähköpostin edelleenlähetyksen asennus

Oletko perustamassa sähköpostin edelleenlähetystä uudelle verkkotunnukselle? Pyydä tekoälyä luomaan verkkotunnus, lisäämään edelleenlähetysaliakset, salaamaan DNS-tietueet ja varmistamaan, että kaikki on määritetty oikein.

### 11. Postilaatikon haku ja analyysi

Käytä viestihakutyökaluja löytääksesi tiettyjä sähköposteja: "Etsi kaikki sähköpostit osoitteesta john@example.com viimeisten 30 päivän ajalta, joissa on liitteitä." Yli 15 hakuparametria tekee tästä tehokkaan. *(Vaatii aliaksen tunnistetiedot.)*

### 12. Kansioiden järjestely

Pyydä tekoälyäsi luomaan kansiorakenne uutta projektia varten, siirtämään viestejä kansioiden välillä tai siivoamaan vanhoja kansioita, joita et enää tarvitse. *(Vaatii aliaksen tunnistetiedot.)*

### 13. Salasanan vaihtaminen

Luo uusia aliaksen salasanoja aikataulun mukaan. Pyydä tekoälyäsi luomaan uusi salasana jokaiselle aliakselle ja raportoimaan uudet tunnistetiedot.

### 14. DNS-tietueiden salaus

Salaa edelleenlähetystietueesi ennen niiden lisäämistä DNS:ään. `encryptRecord`-työkalu hoitaa tämän ilman todennusta – hyödyllinen nopeisiin kertaluonteisiin salauksiin.

### 15. Toimituslokien analyysi

Lataa sähköpostin toimituslokit ja pyydä tekoälyä analysoimaan palautusprosentteja, tunnistamaan ongelmallisia vastaanottajia tai seuraamaan toimitusaikoja.

### 16. Usean verkkotunnuksen hallinta

Jos hallitset useita verkkotunnuksia, pyydä tekoälyä antamaan sinulle tilannekatsaus: mitkä verkkotunnukset on vahvistettu, mitkä ovat ongelmallisia, kuinka monta aliasa kullakin on ja miltä lähetysrajat näyttävät.

### 17. Catch-All-määritys

Määritä catch-all-salasanat verkkotunnuksille, joiden on vastaanotettava sähköpostia mihin tahansa osoitteeseen. Tekoäly voi luoda, listata ja hallita näitä salasanoja puolestasi.

### 18. Verkkotunnuksen kutsujen hallinta

Kutsu tiimin jäseniä hallitsemaan verkkotunnuksia, tarkista odottavat kutsut ja siivoa vanhentuneet. Hyödyllinen organisaatioille, joilla on useita verkkotunnuksen ylläpitäjiä.

### 19. S3-tallennustilan testaus

Jos käytät mukautettua S3-tallennustilaa sähköpostivarmuuskopioihin, pyydä tekoälyä testaamaan yhteys ja varmistamaan, että se toimii oikein.

### 20. Sähköpostiluonnoksen laatiminen

Luo sähköpostiluonnoksia postilaatikkoosi lähettämättä niitä. Hyödyllinen sähköpostien valmisteluun, jotka tarvitsevat tarkistusta ennen lähetystä, tai sähköpostimallien rakentamiseen. *(Vaatii aliaksen tunnistetiedot.)*


## Esimerkkikehotteet {#example-prompts}

Tässä on kehotteita, joita voit käyttää suoraan tekoälyavustajasi kanssa:

**Sähköpostin lähettäminen:**
> "Lähetä sähköposti osoitteesta hello@mydomain.com osoitteeseen john@example.com aiheella 'Kokous huomenna' ja viestillä 'Hei John, olemmeko edelleen paikalla klo 14?'"

**Verkkotunnuksen hallinta:**
> "Listaa kaikki verkkotunnukseni ja kerro, mitkä niistä ovat vahvistamattomia DNS-tietueita."

**Aliaksen luominen:**
> "Luo uusi alias support@mydomain.com, joka edelleenlähettää henkilökohtaiseen sähköpostiini."

**Postilaatikon haku (vaatii aliaksen tunnistetiedot):**
> "Etsi kaikki lukemattomat sähköpostit viime viikolta, joissa mainitaan 'lasku'."

**Kalenteri (vaatii aliaksen tunnistetiedot):**
> "Luo kalenteri nimeltä 'Työ' ja lisää kokous huomenna klo 14 nimeltä 'Tiimin palaveri'."

**Sieve-skriptit:**
> "Kirjoita Sieve-skripti osoitteelle info@mydomain.com, joka vastaa automaattisesti sähköposteihin 'Kiitos yhteydenotostasi, palaamme asiaan 24 tunnin kuluessa'."

**Massatoiminnot:**
> "Luo aliakset sales@, support@, billing@ ja info@ mydomain.com -verkkotunnukselle, kaikki edelleenlähetetään osoitteeseen team@mydomain.com."

**Turvallisuustarkastus:**
> "Tarkista kaikkien verkkotunnusteni DNS- ja SMTP-vahvistuksen tila ja kerro, jos jokin vaatii huomiota."

**Luo aliaksen salasana:**
> "Luo salasana aliakselle user@example.com, jotta voin käyttää postilaatikkoani."


## Ympäristömuuttujat {#environment-variables}

| Muuttuja | Pakollinen | Oletus | Kuvaus |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Kyllä | — | Forward Email API-avaimesi (käytetään Basic-todennuksen käyttäjätunnuksena API-avainpäätepisteissä) |
| `FORWARD_EMAIL_ALIAS_USER` | Ei | — | Aliaksen sähköpostiosoite postilaatikkopäätepisteille (esim. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Ei | — | Luotu aliaksen salasana postilaatikkopäätepisteille |
| `FORWARD_EMAIL_API_URL` | Ei | `https://api.forwardemail.net` | API:n perus-URL (itse isännöityyn tai testaukseen) |


## Turvallisuus {#security}

MCP-palvelin toimii paikallisesti koneellasi. Näin turvallisuus toimii:

*   **Tunnistetietosi pysyvät paikallisina.** Sekä API-avaimesi että aliaksen tunnistetietosi luetaan ympäristömuuttujista ja niitä käytetään API-pyyntöjen todennukseen HTTP Basic -todennuksen kautta. Niitä ei koskaan lähetetä tekoälymallille.
*   **stdio-siirto.** Palvelin kommunikoi tekoälyasiakkaan kanssa stdin/stdoutin kautta. Verkkoportteja ei avata.
*   **Ei tiedon tallennusta.** Palvelin on tilaton. Se ei välimuistiin tallenna, lokita tai tallenna mitään sähköpostitietojasi.
*   **Avoin lähdekoodi.** Koko koodikanta on [GitHubissa](https://github.com/forwardemail/mcp-server). Voit tarkistaa jokaisen rivin.


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

Forward Email MCP-palvelin on [avoimen lähdekoodin projekti GitHubissa](https://github.com/forwardemail/mcp-server) BUSL-1.1-lisenssillä. Uskomme läpinäkyvyyteen. Jos löydät virheen tai haluat ominaisuuden, [avaa ongelma](https://github.com/forwardemail/mcp-server/issues).

