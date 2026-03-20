# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>Röviden:</strong> Nyílt forráskódú <a href="https://github.com/forwardemail/mcp-server">MCP szerverünk</a> lehetővé teszi, hogy olyan AI asszisztensek, mint Claude, ChatGPT, Cursor és Windsurf természetes nyelven kezeljék az e-mailjeidet, domaineidet, aliasaidat, kapcsolataidat és naptáraidat. Mind a 68 API végpont MCP eszközként érhető el. Helyileg fut a <code>npx @forwardemail/mcp-server</code> paranccsal — a hitelesítő adataid soha nem hagyják el a gépedet.
</p>


## Tartalomjegyzék {#table-of-contents}

* [Mi az MCP?](#what-is-mcp)
* [Gyors kezdés](#quick-start)
  * [API kulcs beszerzése](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Egyéb MCP kliensek](#other-mcp-clients)
* [Hitelesítés](#authentication)
  * [API kulcs alapú hitelesítés](#api-key-auth)
  * [Alias alapú hitelesítés](#alias-auth)
  * [Alias jelszó generálása](#generating-an-alias-password)
* [Az összes 68 eszköz](#all-68-tools)
  * [Fiók (API kulcs vagy alias hitelesítés)](#account-api-key-or-alias-auth)
  * [Domainek (API kulcs)](#domains-api-key)
  * [Aliasok (API kulcs)](#aliases-api-key)
  * [E-mailek — Kimenő SMTP (API kulcs; a küldés mindkettőt támogatja)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Üzenetek — IMAP (Alias hitelesítés)](#messages--imap-alias-auth)
  * [Mappák — IMAP (Alias hitelesítés)](#folders--imap-alias-auth)
  * [Kapcsolatok — CardDAV (Alias hitelesítés)](#contacts--carddav-alias-auth)
  * [Naptárak — CalDAV (Alias hitelesítés)](#calendars--caldav-alias-auth)
  * [Naptári események — CalDAV (Alias hitelesítés)](#calendar-events--caldav-alias-auth)
  * [Sieve szkriptek (API kulcs)](#sieve-scripts-api-key)
  * [Sieve szkriptek (Alias hitelesítés)](#sieve-scripts-alias-auth)
  * [Domain tagok és meghívók (API kulcs)](#domain-members-and-invites-api-key)
  * [Catch-All jelszavak (API kulcs)](#catch-all-passwords-api-key)
  * [Naplók (API kulcs)](#logs-api-key)
  * [Titkosítás (Hitelesítés nélkül)](#encrypt-no-auth)
* [20 valós használati eset](#20-real-world-use-cases)
  * [1. E-mail szűrés](#1-email-triage)
  * [2. Domain beállítás automatizálása](#2-domain-setup-automation)
  * [3. Tömeges alias kezelés](#3-bulk-alias-management)
  * [4. E-mail kampány követés](#4-email-campaign-monitoring)
  * [5. Kapcsolatok szinkronizálása és tisztítása](#5-contact-sync-and-cleanup)
  * [6. Naptárkezelés](#6-calendar-management)
  * [7. Sieve szkript automatizálás](#7-sieve-script-automation)
  * [8. Csapat bevezetése](#8-team-onboarding)
  * [9. Biztonsági audit](#9-security-auditing)
  * [10. E-mail továbbítás beállítása](#10-email-forwarding-setup)
  * [11. Bejövő levelek keresése és elemzése](#11-inbox-search-and-analysis)
  * [12. Mappa rendszerezés](#12-folder-organization)
  * [13. Jelszó forgatás](#13-password-rotation)
  * [14. DNS rekord titkosítás](#14-dns-record-encryption)
  * [15. Kézbesítési napló elemzés](#15-delivery-log-analysis)
  * [16. Több domain kezelése](#16-multi-domain-management)
  * [17. Catch-All konfiguráció](#17-catch-all-configuration)
  * [18. Domain meghívó kezelés](#18-domain-invite-management)
  * [19. S3 tárhely tesztelés](#19-s3-storage-testing)
  * [20. E-mail tervezet készítése](#20-email-draft-composition)
* [Példa promptok](#example-prompts)
* [Környezeti változók](#environment-variables)
* [Biztonság](#security)
* [Programozott használat](#programmatic-usage)
* [Nyílt forráskód](#open-source)


## Mi az MCP? {#what-is-mcp}

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) egy nyílt szabvány, amelyet az Anthropic hozott létre, és amely lehetővé teszi, hogy az AI modellek biztonságosan hívjanak meg külső eszközöket. Ahelyett, hogy API válaszokat másolnánk be egy csevegőablakba, az MCP közvetlen, strukturált hozzáférést ad a modellnek a szolgáltatásaidhoz.

MCP szerverünk az egész [Forward Email API](/email-api) szolgáltatást becsomagolja — minden végpontot, minden paramétert — és eszközként teszi elérhetővé bármely MCP-kompatibilis kliens számára. A szerver helyileg fut a gépeden stdio kapcsolaton keresztül. A hitelesítő adataid a környezeti változóidban maradnak, és soha nem kerülnek elküldésre az AI modellnek.


## Gyors kezdés {#quick-start}

### API kulcs beszerzése {#get-an-api-key}
1. Jelentkezz be a [Forward Email fiókodba](/my-account/domains).
2. Menj a **Saját fiók** → **Biztonság** → **API kulcsok** menüpontra.
3. Generálj egy új API kulcsot és másold ki.

### Claude Desktop {#claude-desktop}

Add hozzá ezt a Claude Desktop konfigurációs fájlodhoz:

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

Indítsd újra a Claude Desktopot. A Forward Email eszközöket látnod kell az eszközválasztóban.

> **Megjegyzés:** A `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` változók opcionálisak, de szükségesek a postaláda eszközökhöz (üzenetek, mappák, névjegyek, naptárak). Részletekért lásd az [Hitelesítés](#authentication) részt.

### Cursor {#cursor}

Nyisd meg a Cursor Beállításokat → MCP → Szerver hozzáadása:

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

Nyisd meg a Windsurf Beállításokat → MCP → Szerver hozzáadása ugyanazzal a konfigurációval, mint fent.

### Egyéb MCP kliensek {#other-mcp-clients}

Bármely kliens, amely támogatja az MCP stdio transportot, működni fog. A parancs:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Hitelesítés {#authentication}

A Forward Email API **HTTP Basic hitelesítést** használ, két különböző hitelesítő típussal az adott végponttól függően. Az MCP szerver ezt automatikusan kezeli — neked csak a megfelelő hitelesítő adatokat kell megadnod.

### API kulcs alapú hitelesítés {#api-key-auth}

A legtöbb kezelő végpont (domainek, aliasok, kimenő emailek, naplók) az **API kulcsodat** használja Basic auth felhasználónévként, jelszó nélkül.

Ez ugyanaz az API kulcs, amit a REST API-hoz használsz. Állítsd be a `FORWARD_EMAIL_API_KEY` környezeti változóval.

### Alias alapú hitelesítés {#alias-auth}

A postaláda végpontok (üzenetek, mappák, névjegyek, naptárak, aliashoz kötött sieve szkriptek) **alias hitelesítő adatokat** használnak — az alias email címet felhasználónévként és egy generált jelszót jelszóként.

Ezek a végpontok aliasonkénti adatokat érnek el IMAP, CalDAV és CardDAV protokollokon keresztül. Szükségük van az alias email címre és egy generált jelszóra, nem az API kulcsra.

Az alias hitelesítő adatokat kétféleképpen adhatod meg:

1. **Környezeti változók** (ajánlott az alapértelmezett aliashoz): Állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` változókat.
2. **Eszközhívásonkénti paraméterek**: Add át az `alias_username` és `alias_password` paramétereket bármely alias-hitelesítésű eszköznek. Ezek felülírják a környezeti változókat, ami hasznos, ha több alias-szal dolgozol.

### Alias jelszó generálása {#generating-an-alias-password}

Mielőtt használhatnád az alias-hitelesítésű eszközöket, generálnod kell egy jelszót az aliashoz. Ezt megteheted a `generateAliasPassword` eszközzel vagy az API-n keresztül:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

A válasz tartalmazza a `username` (alias email) és `password` mezőket. Használd ezeket alias hitelesítő adatokként.

> **Tipp:** Megkérheted az AI asszisztensedet is: *"Generálj jelszót az <user@example.com> aliashoz az example.com domainen"* — ez meghívja a `generateAliasPassword` eszközt és visszaadja a hitelesítő adatokat.

Az alábbi táblázat összefoglalja, hogy melyik eszközcsoport milyen hitelesítési módot igényel:

| Eszközcsoport                                                  | Hitelesítési mód          | Hitelesítő adatok                                           |
| -------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| Fiók                                                           | API kulcs **vagy** Alias hitelesítés | Bármelyik                                                  |
| Domainek, Aliasok, Domain tagok, Meghívók, Catch-All jelszavak | API kulcs                 | `FORWARD_EMAIL_API_KEY`                                     |
| Kimenő emailek (lista, lekérés, törlés, limit)                 | API kulcs                 | `FORWARD_EMAIL_API_KEY`                                     |
| Email küldése                                                  | API kulcs **vagy** Alias hitelesítés | Bármelyik                                                  |
| Üzenetek (IMAP)                                                | Alias hitelesítés         | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mappák (IMAP)                                                 | Alias hitelesítés         | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Névjegyek (CardDAV)                                           | Alias hitelesítés         | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Naptárak (CalDAV)                                             | Alias hitelesítés         | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Naptári események (CalDAV)                                    | Alias hitelesítés         | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve szkriptek (domainhoz kötött)                           | API kulcs                 | `FORWARD_EMAIL_API_KEY`                                     |
| Sieve szkriptek (aliashoz kötött)                            | Alias hitelesítés         | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Naplók                                                        | API kulcs                 | `FORWARD_EMAIL_API_KEY`                                     |
| Titkosítás                                                   | Nincs                    | Nem szükséges hitelesítő adat                                |
## Minden 68 Eszköz {#all-68-tools}

Minden eszköz közvetlenül egy [Forward Email API](/email-api) végponthoz kapcsolódik. A paraméterek ugyanazokat a neveket használják, mint az API dokumentációban. Az autentikációs módszer minden szakaszcímben fel van tüntetve.

### Fiók (API kulcs vagy Alias hitelesítés) {#account-api-key-or-alias-auth}

API kulcs hitelesítéssel ezek visszaadják a felhasználói fiók adatait. Alias hitelesítéssel az alias/postafiók adatait, beleértve a tárhely kvótát és beállításokat.

| Eszköz           | API végpont         | Leírás                      |
| ---------------- | ------------------- | --------------------------- |
| `getAccount`     | `GET /v1/account`   | Fiókadatok lekérése         |
| `updateAccount`  | `PUT /v1/account`   | Fiókbeállítások frissítése  |

### Domain-ek (API kulcs) {#domains-api-key}

| Eszköz                | API végpont                                      | Leírás                    |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Az összes domain listázása |
| `createDomain`        | `POST /v1/domains`                               | Új domain hozzáadása       |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Domain részleteinek lekérése |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Domain beállításainak frissítése |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Domain eltávolítása        |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | DNS rekordok ellenőrzése   |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | SMTP konfiguráció ellenőrzése |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Egyedi S3 tárhely tesztelése |

### Aliasok (API kulcs) {#aliases-api-key}

| Eszköz                  | API végpont                                                      | Leírás                                  |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Aliasok listázása egy domainhez          |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Új alias létrehozása                      |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Alias részleteinek lekérése               |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Alias frissítése                         |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Alias törlése                           |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | IMAP/SMTP jelszó generálása alias hitelesítéshez |

### E-mailek — Kimenő SMTP (API kulcs; Küldés mindkettőt támogatja) {#emails--outbound-smtp-api-key-send-supports-both}

| Eszköz           | API végpont           | Hitelesítés           | Leírás                      |
| ---------------- | --------------------- | --------------------- | --------------------------- |
| `sendEmail`      | `POST /v1/emails`     | API kulcs vagy Alias  | E-mail küldése SMTP-n keresztül |
| `listEmails`     | `GET /v1/emails`      | API kulcs             | Kimenő e-mailek listázása   |
| `getEmail`       | `GET /v1/emails/:id`  | API kulcs             | E-mail részleteinek és státuszának lekérése |
| `deleteEmail`    | `DELETE /v1/emails/:id` | API kulcs           | Sorban álló e-mail törlése  |
| `getEmailLimit`  | `GET /v1/emails/limit` | API kulcs            | Küldési limit ellenőrzése   |

A `sendEmail` eszköz elfogadja a `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` és `attachments` paramétereket. Ez megegyezik a `POST /v1/emails` végponttal.

### Üzenetek — IMAP (Alias hitelesítés) {#messages--imap-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Add át az `alias_username` és `alias_password` értékeket, vagy állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.
| Eszköz           | API végpont                | Leírás                              |
| --------------- | ------------------------- | ---------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Üzenetek listázása és keresése egy postaládában |
| `createMessage` | `POST /v1/messages`       | Piszkozat létrehozása vagy üzenet feltöltése |
| `getMessage`    | `GET /v1/messages/:id`    | Üzenet lekérése azonosító alapján |
| `updateMessage` | `PUT /v1/messages/:id`    | Jelölők frissítése (olvasott, csillagozott, stb.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Üzenet törlése                    |

A `listMessages` eszköz több mint 15 keresési paramétert támogat, beleértve a `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` és `has_attachment` paramétereket. A teljes listáért lásd a [API docs](/email-api) dokumentációt.

### Mappák — IMAP (Alias hitelesítés) {#folders--imap-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Add át az `alias_username` és `alias_password` értékeket, vagy állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz          | API végpont              | Leírás                   |
| --------------- | ------------------------ | ------------------------ |
| `listFolders`   | `GET /v1/folders`        | Az összes postaláda mappa listázása |
| `createFolder`  | `POST /v1/folders`       | Új mappa létrehozása     |
| `getFolder`     | `GET /v1/folders/:id`    | Mappa részleteinek lekérése |
| `updateFolder`  | `PUT /v1/folders/:id`    | Mappa átnevezése         |
| `deleteFolder`  | `DELETE /v1/folders/:id` | Mappa törlése            |

### Kapcsolatok — CardDAV (Alias hitelesítés) {#contacts--carddav-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Add át az `alias_username` és `alias_password` értékeket, vagy állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz           | API végpont              | Leírás                |
| ---------------- | ------------------------ | --------------------- |
| `listContacts`   | `GET /v1/contacts`       | Az összes kapcsolat listázása |
| `createContact`  | `POST /v1/contacts`      | Új kapcsolat létrehozása |
| `getContact`     | `GET /v1/contacts/:id`   | Kapcsolat részleteinek lekérése |
| `updateContact`  | `PUT /v1/contacts/:id`   | Kapcsolat frissítése  |
| `deleteContact`  | `DELETE /v1/contacts/:id`| Kapcsolat törlése     |

### Naptárak — CalDAV (Alias hitelesítés) {#calendars--caldav-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Add át az `alias_username` és `alias_password` értékeket, vagy állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz            | API végpont              | Leírás                |
| ----------------- | ------------------------ | --------------------- |
| `listCalendars`   | `GET /v1/calendars`      | Az összes naptár listázása |
| `createCalendar`  | `POST /v1/calendars`     | Új naptár létrehozása |
| `getCalendar`     | `GET /v1/calendars/:id`  | Naptár részleteinek lekérése |
| `updateCalendar`  | `PUT /v1/calendars/:id`  | Naptár frissítése     |
| `deleteCalendar`  | `DELETE /v1/calendars/:id`| Naptár törlése        |

### Naptári események — CalDAV (Alias hitelesítés) {#calendar-events--caldav-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Add át az `alias_username` és `alias_password` értékeket, vagy állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz                 | API végpont                     | Leírás               |
| ---------------------- | ------------------------------- | -------------------- |
| `listCalendarEvents`   | `GET /v1/calendar-events`       | Az összes esemény listázása |
| `createCalendarEvent`  | `POST /v1/calendar-events`      | Új esemény létrehozása |
| `getCalendarEvent`     | `GET /v1/calendar-events/:id`   | Esemény részleteinek lekérése |
| `updateCalendarEvent`  | `PUT /v1/calendar-events/:id`   | Esemény frissítése   |
| `deleteCalendarEvent`  | `DELETE /v1/calendar-events/:id`| Esemény törlése      |

### Sieve szkriptek (API kulcs) {#sieve-scripts-api-key}

Ezek domain-környezetű útvonalakat használnak és az API kulcsoddal hitelesítenek.

| Eszköz                 | API végpont                                                                 | Leírás                  |
| ---------------------- | --------------------------------------------------------------------------- | ----------------------- |
| `listSieveScripts`     | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                        | Alias szkriptek listázása |
| `createSieveScript`    | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                       | Új szkript létrehozása   |
| `getSieveScript`       | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`             | Szkript részleteinek lekérése |
| `updateSieveScript`    | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`             | Szkript frissítése       |
| `deleteSieveScript`    | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`          | Szkript törlése          |
| `activateSieveScript`  | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`   | Szkript aktiválása       |
### Sieve szkriptek (Alias hitelesítés) {#sieve-scripts-alias-auth}

Ezek alias szintű hitelesítést használnak. Hasznos aliasonkénti automatizáláshoz API kulcs nélkül.

> **Alias hitelesítő adatok szükségesek.** Add át az `alias_username` és `alias_password` értékeket, vagy állítsd be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz                         | API végpont                                   | Leírás             |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Szkriptek listázása |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Szkript létrehozása |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Szkript részleteinek lekérése |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Szkript frissítése  |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Szkript törlése     |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Szkript aktiválása  |

### Domain tagok és meghívók (API kulcs) {#domain-members-and-invites-api-key}

| Eszköz               | API végpont                                       | Leírás                      |
| -------------------- | ------------------------------------------------ | --------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`  | Tag szerepének módosítása   |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Tag eltávolítása            |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`             | Függőben lévő meghívó elfogadása |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`            | Meghívó küldése domainhez   |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`          | Meghívó visszavonása        |

### Catch-All jelszavak (API kulcs) {#catch-all-passwords-api-key}

| Eszköz                   | API végpont                                                  | Leírás                      |
| ------------------------ | ------------------------------------------------------------ | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`             | Catch-all jelszavak listázása |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`            | Catch-all jelszó létrehozása |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Catch-all jelszó törlése    |

### Naplók (API kulcs) {#logs-api-key}

| Eszköz           | API végpont            | Leírás                      |
| ---------------- | --------------------- | --------------------------- |
| `downloadLogs`   | `GET /v1/logs/download` | E-mail kézbesítési naplók letöltése |

### Titkosítás (Hitelesítés nélkül) {#encrypt-no-auth}

| Eszköz            | API végpont       | Leírás                      |
| ----------------- | ----------------- | --------------------------- |
| `encryptRecord`   | `POST /v1/encrypt` | DNS TXT rekord titkosítása  |

Ez az eszköz nem igényel hitelesítést. Olyan továbbító rekordokat titkosít, mint a `forward-email=user@example.com`, DNS TXT rekordokhoz való használatra.


## 20 valós használati eset {#20-real-world-use-cases}

Íme néhány gyakorlati módja az MCP szerver használatának az AI asszisztenseddel:

### 1. E-mail szűrés {#1-email-triage}

Kérd meg az AI-t, hogy szkennelje át a bejövő leveleidet és foglalja össze az olvasatlan üzeneteket. Kiemelheti a sürgős e-maileket, kategorizálhatja feladó szerint, és válaszokat készíthet — mindezt természetes nyelven. *(Alias hitelesítő adatok szükségesek a postafiók eléréséhez.)*

### 2. Domain beállítás automatizálása {#2-domain-setup-automation}

Új domaint állítasz be? Kérd meg az AI-t, hogy hozza létre a domaint, adja hozzá az aliasokat, ellenőrizze a DNS rekordokat, és tesztelje az SMTP konfigurációt. Ami normál esetben 10 perc kattintgatás a kezelőfelületen, az egy beszélgetéssé válik.

### 3. Tömeges alias kezelés {#3-bulk-alias-management}

20 aliasra van szükséged egy új projekthez? Írd le, mire van szükséged, és hagyd, hogy az AI végezze el az ismétlődő munkát. Aliasokat hozhat létre, beállíthat továbbítási szabályokat, és jelszavakat generálhat egy lépésben.
### 4. Email Kampány Figyelés {#4-email-campaign-monitoring}

Kérd meg az AI-dat, hogy ellenőrizze a küldési korlátokat, listázza a legutóbbi kimenő e-maileket, és jelentést készítsen a kézbesítési állapotról. Hasznos a tranzakciós e-mailek állapotának figyeléséhez.

### 5. Kapcsolat Szinkronizálás és Tisztítás {#5-contact-sync-and-cleanup}

Használd a CardDAV eszközöket az összes kapcsolat listázásához, duplikátumok kereséséhez, elavult adatok frissítéséhez, vagy tömeges kapcsolatok létrehozásához egy táblázatból, amit beillesztesz a csevegésbe. *(Alias hitelesítő adatok szükségesek.)*

### 6. Naptárkezelés {#6-calendar-management}

Hozz létre naptárakat, adj hozzá eseményeket, frissítsd a találkozók időpontját, és töröld a lemondott eseményeket — mindezt beszélgetés útján. A CalDAV eszközök teljes CRUD támogatást nyújtanak naptárakra és eseményekre egyaránt. *(Alias hitelesítő adatok szükségesek.)*

### 7. Sieve Script Automatizálás {#7-sieve-script-automation}

A Sieve szkriptek erősek, de a szintaxis bonyolult. Kérd meg az AI-dat, hogy írjon helyetted Sieve szkripteket: például "Szűrjön minden <billing@example.com>-ről érkező e-mailt a Billing mappába" egy működő szkriptté válik anélkül, hogy az RFC 5228 specifikációt kellene érintened.

### 8. Csapat Beillesztése {#8-team-onboarding}

Amikor új csapattag csatlakozik, kérd meg az AI-t, hogy hozza létre az aliasát, generáljon jelszót, küldjön neki egy üdvözlő e-mailt a hitelesítő adataival, és vegye fel őt a domain tagjai közé. Egy parancs, négy API hívás.

### 9. Biztonsági Audit {#9-security-auditing}

Kérd meg az AI-dat, hogy listázza az összes domaint, ellenőrizze a DNS hitelesítési állapotot, vizsgálja át az alias konfigurációkat, és azonosítsa azokat a domaineket, amelyeknél nem ellenőrzött rekordok vannak. Egy gyors biztonsági ellenőrzés természetes nyelven.

### 10. E-mail Továbbítás Beállítása {#10-email-forwarding-setup}

Új domainhez szeretnél e-mail továbbítást beállítani? Kérd meg az AI-t, hogy hozza létre a domaint, adjon hozzá továbbító aliasokat, titkosítsa a DNS rekordokat, és ellenőrizze, hogy minden helyesen van-e konfigurálva.

### 11. Bejövő Üzenetek Keresése és Elemzése {#11-inbox-search-and-analysis}

Használd az üzenetkereső eszközöket specifikus e-mailek megtalálásához: "Keress minden <john@example.com>-tól érkező e-mailt az elmúlt 30 napból, amelyekhez csatolmány tartozik." A 15+ keresési paraméter erőteljessé teszi ezt. *(Alias hitelesítő adatok szükségesek.)*

### 12. Mappaszervezés {#12-folder-organization}

Kérd meg az AI-dat, hogy hozzon létre mappastruktúrát egy új projekthez, mozgasson üzeneteket mappák között, vagy takarítsa ki a már nem használt régi mappákat. *(Alias hitelesítő adatok szükségesek.)*

### 13. Jelszó Forgatás {#13-password-rotation}

Generálj új alias jelszavakat ütemezetten. Kérd meg az AI-t, hogy minden alias számára generáljon új jelszót, és jelentse az új hitelesítő adatokat.

### 14. DNS Rekord Titkosítás {#14-dns-record-encryption}

Titkosítsd a továbbító rekordjaidat, mielőtt hozzáadnád őket a DNS-hez. Az `encryptRecord` eszköz ezt hitelesítés nélkül kezeli — hasznos gyors, egyszeri titkosításokhoz.

### 15. Kézbesítési Napló Elemzés {#15-delivery-log-analysis}

Töltsd le az e-mail kézbesítési naplóidat, és kérd meg az AI-t, hogy elemezze a visszapattanási arányokat, azonosítsa a problémás címzetteket, vagy kövesse a kézbesítési időket.

### 16. Többdomain Kezelés {#16-multi-domain-management}

Ha több domaint kezelsz, kérd meg az AI-t, hogy adjon státuszjelentést: mely domainek vannak ellenőrizve, melyekkel vannak problémák, hány aliasuk van, és milyenek a küldési korlátok.

### 17. Catch-All Konfiguráció {#17-catch-all-configuration}

Állíts be catch-all jelszavakat azokhoz a domainekhez, amelyeknek bármely címre kell e-mailt fogadniuk. Az AI létrehozhatja, listázhatja és kezelheti ezeket a jelszavakat helyetted.

### 18. Domain Meghívó Kezelés {#18-domain-invite-management}

Hívj meg csapattagokat a domainek kezelésére, ellenőrizd a függőben lévő meghívókat, és takarítsd ki a lejártakat. Hasznos szervezeteknek, ahol több domain adminisztrátor van.

### 19. S3 Tároló Tesztelés {#19-s3-storage-testing}

Ha egyedi S3 tárolót használsz e-mail biztonsági mentésekhez, kérd meg az AI-t, hogy tesztelje a kapcsolatot, és ellenőrizze, hogy megfelelően működik-e.

### 20. E-mail Vázlat Készítés {#20-email-draft-composition}

Hozz létre vázlat e-maileket a postaládádban anélkül, hogy elküldenéd őket. Hasznos olyan e-mailek előkészítéséhez, amelyeket még át kell nézni, vagy e-mail sablonok építéséhez. *(Alias hitelesítő adatok szükségesek.)*


## Példa Parancsok {#example-prompts}

Íme néhány parancs, amit közvetlenül használhatsz az AI asszisztenseddel:

**E-mail küldése:**

> "Küldj egy e-mailt <hello@mydomain.com>-ról <john@example.com>-nak a tárggyal 'Holnapi Találkozó' és a szöveggel 'Szia John, még mindig jó neked a 14 óra?'"
**Domain kezelés:**

> "Sorold fel az összes domainemet, és mondd meg, melyeknek vannak nem ellenőrzött DNS rekordjai."

**Álnév létrehozása:**

> "Hozz létre egy új álnevet <support@mydomain.com>, amely továbbítja az üzeneteket a személyes e-mailemre."

**Beérkező levelek keresése (álneves hitelesítő adatok szükségesek):**

> "Találd meg az összes olvasatlan e-mailt az elmúlt hétből, amelyekben szerepel az 'invoice' szó."

**Naptár (álneves hitelesítő adatok szükségesek):**

> "Hozz létre egy 'Munka' nevű naptárt, és adj hozzá egy holnap 14 órakor kezdődő 'Csapat állóértekezlet' nevű találkozót."

**Sieve szkriptek:**

> "Írj egy Sieve szkriptet <info@mydomain.com> számára, amely automatikusan válaszol az e-mailekre a következő szöveggel: 'Köszönjük, hogy megkeresett minket, 24 órán belül válaszolunk.'"

**Tömeges műveletek:**

> "Hozz létre álneveket a sales@, support@, billing@ és info@ címekre a mydomain.com-on, mindet továbbítva a <team@mydomain.com> címre."

**Biztonsági ellenőrzés:**

> "Ellenőrizd az összes domainem DNS és SMTP hitelesítési állapotát, és mondd meg, ha valamire figyelmet kell fordítani."

**Álnév jelszó generálása:**

> "Generálj jelszót az <user@example.com> álnevéhez, hogy hozzáférhessek a beérkező leveleimhez."


## Környezeti változók {#environment-variables}

| Változó                        | Kötelező | Alapértelmezett                 | Leírás                                                                        |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Igen     | —                              | A Forward Email API kulcsod (Basic auth felhasználónévként használatos az API-kulcs végpontokhoz) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nem      | —                              | Álnév e-mail cím a postaláda végpontokhoz (pl. `user@example.com`)             |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nem      | —                              | Generált álneves jelszó a postaláda végpontokhoz                              |
| `FORWARD_EMAIL_API_URL`        | Nem      | `https://api.forwardemail.net` | API alap URL (önálló hosztoláshoz vagy teszteléshez)                          |


## Biztonság {#security}

Az MCP szerver helyileg fut a gépeden. Így működik a biztonság:

* **A hitelesítő adataid helyben maradnak.** Az API kulcsodat és az álneves hitelesítő adatokat környezeti változókból olvassa be, és HTTP Basic auth segítségével hitelesíti az API kéréseket. Ezek soha nem kerülnek elküldésre az AI modellnek.
* **stdio kommunikáció.** A szerver az AI klienssel stdin/stdout-on keresztül kommunikál. Nem nyit meg hálózati portokat.
* **Nincs adat tárolás.** A szerver állapotmentes. Nem gyorsítótáraz, nem naplóz, és nem tárol semmilyen e-mail adatot.
* **Nyílt forráskódú.** Az egész kód elérhető a [GitHubon](https://github.com/forwardemail/mcp-server). Minden sort auditálhatsz.


## Programozott használat {#programmatic-usage}

A szervert könyvtárként is használhatod:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Nyílt forráskód {#open-source}

A Forward Email MCP Server [nyílt forráskódú a GitHubon](https://github.com/forwardemail/mcp-server) a BUSL-1.1 licenc alatt. Hiszünk az átláthatóságban. Ha hibát találsz vagy funkciót szeretnél, [nyiss egy issue-t](https://github.com/forwardemail/mcp-server/issues).
