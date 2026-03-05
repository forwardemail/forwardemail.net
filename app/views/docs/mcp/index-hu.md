# Forward Email MCP szerver

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Nyílt forráskódú <a href="https://github.com/forwardemail/mcp-server">MCP szerverünk</a> lehetővé teszi az AI asszisztensek, mint a Claude, ChatGPT, Cursor és Windsurf számára, hogy természetes nyelven kezeljék az e-mailjeit, domainjeit, aliasait, kapcsolatait és naptárait. Mind a 68 API végpont MCP eszközként van felfedve. Helyileg fut a <code>npx @forwardemail/mcp-server</code> paranccsal – az Ön hitelesítő adatai soha nem hagyják el a gépét.
</p>

## Tartalomjegyzék

* [Mi az MCP?](#what-is-mcp)
* [Gyors indítás](#quick-start)
  * [API kulcs beszerzése](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Egyéb MCP kliensek](#other-mcp-clients)
* [Hitelesítés](#authentication)
  * [API kulcs hitelesítés](#api-key-auth)
  * [Alias hitelesítés](#alias-auth)
  * [Alias jelszó generálása](#generating-an-alias-password)
* [Mind a 68 eszköz](#all-68-tools)
  * [Fiók (API kulcs vagy alias hitelesítés)](#account-api-key-or-alias-auth)
  * [Domainek (API kulcs)](#domains-api-key)
  * [Aliasok (API kulcs)](#aliases-api-key)
  * [E-mailek – Kimenő SMTP (API kulcs; a küldés mindkettőt támogatja)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Üzenetek – IMAP (Alias hitelesítés)](#messages--imap-alias-auth)
  * [Mappák – IMAP (Alias hitelesítés)](#folders--imap-alias-auth)
  * [Kapcsolatok – CardDAV (Alias hitelesítés)](#contacts--carddav-alias-auth)
  * [Naptárak – CalDAV (Alias hitelesítés)](#calendars--caldav-alias-auth)
  * [Naptári események – CalDAV (Alias hitelesítés)](#calendar-events--caldav-alias-auth)
  * [Sieve szkriptek (API kulcs)](#sieve-scripts-api-key)
  * [Sieve szkriptek (Alias hitelesítés)](#sieve-scripts-alias-auth)
  * [Domain tagok és meghívók (API kulcs)](#domain-members-and-invites-api-key)
  * [Catch-All jelszavak (API kulcs)](#catch-all-passwords-api-key)
  * [Naplók (API kulcs)](#logs-api-key)
  * [Titkosítás (nincs hitelesítés)](#encrypt-no-auth)
* [20 valós felhasználási eset](#20-real-world-use-cases)
* [Példa parancsok](#example-prompts)
* [Környezeti változók](#environment-variables)
* [Biztonság](#security)
* [Programozott használat](#programmatic-usage)
* [Nyílt forráskód](#open-source)


## Mi az MCP? {#what-is-mcp}

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) egy nyílt szabvány, amelyet az Anthropic hozott létre, és amely lehetővé teszi az AI modellek számára, hogy biztonságosan hívjanak külső eszközöket. Ahelyett, hogy az API válaszokat másolná és beillesztené egy chat ablakba, az MCP közvetlen, strukturált hozzáférést biztosít a modellnek a szolgáltatásaihoz.

MCP szerverünk a teljes [Forward Email API-t](/email-api) – minden végpontot, minden paramétert – becsomagolja, és olyan eszközként teszi elérhetővé, amelyet bármely MCP-kompatibilis kliens használhat. A szerver helyileg fut a gépén stdio transzporton keresztül. Az Ön hitelesítő adatai a környezeti változókban maradnak, és soha nem kerülnek elküldésre az AI modellnek.


## Gyors indítás {#quick-start}

### API kulcs beszerzése {#get-an-api-key}

1. Jelentkezzen be a [Forward Email fiókjába](/my-account/domains).
2. Lépjen a **Saját fiók** → **Biztonság** → **API kulcsok** menüpontra.
3. Hozzon létre egy új API kulcsot, és másolja ki.

### Claude Desktop {#claude-desktop}

Adja hozzá ezt a Claude Desktop konfigurációs fájljához:

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

Indítsa újra a Claude Desktopot. Látnia kell a Forward Email eszközöket az eszközválasztóban.

> **Megjegyzés:** A `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` változók opcionálisak, de szükségesek a postaláda eszközökhöz (üzenetek, mappák, névjegyek, naptárak). Részletekért lásd a [Hitelesítés](#authentication) részt.

### Cursor {#cursor}

Nyissa meg a Cursor beállításait → MCP → Szerver hozzáadása:

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

Nyissa meg a Windsurf beállításait → MCP → Szerver hozzáadása a fenti konfigurációval.

### Egyéb MCP kliensek {#other-mcp-clients}

Bármely kliens, amely támogatja az MCP stdio transzportot, működni fog. A parancs a következő:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Hitelesítés {#authentication}

A Forward Email API **HTTP Basic hitelesítést** használ két különböző hitelesítő adat típussal, a végponttól függően. Az MCP szerver ezt automatikusan kezeli – Önnek csak a megfelelő hitelesítő adatokat kell megadnia.

### API kulcs hitelesítés {#api-key-auth}

A legtöbb kezelési végpont (domainek, aliasok, kimenő e-mailek, naplók) az **API kulcsát** használja Basic hitelesítés felhasználóneveként, üres jelszóval.

Ez ugyanaz az API kulcs, amelyet a REST API-hoz használ. Állítsa be a `FORWARD_EMAIL_API_KEY` környezeti változóval.

### Alias hitelesítés {#alias-auth}

A postaláda végpontok (üzenetek, mappák, névjegyek, naptárak, alias-hatókörű Sieve szkriptek) **alias hitelesítő adatokat** használnak – az alias e-mail címet felhasználónévként, és egy generált jelszót jelszóként.

Ezek a végpontok aliasonkénti adatokat érnek el IMAP, CalDAV és CardDAV protokollokon keresztül. Ehhez az alias e-mail címre és egy generált jelszóra van szükség, nem az API kulcsra.

Az alias hitelesítő adatokat kétféleképpen adhatja meg:

1. **Környezeti változók** (alapértelmezett aliashoz ajánlott): Állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` változókat.
2. **Eszközhívásonkénti paraméterek**: Adja át az `alias_username` és `alias_password` paramétereket bármely alias-hitelesítésű eszköznek. Ezek felülírják a környezeti változókat, ami hasznos több alias kezelésekor.

### Alias jelszó generálása {#generating-an-alias-password}

Mielőtt alias-hitelesítésű eszközöket használhatna, jelszót kell generálnia az aliashoz. Ezt megteheti a `generateAliasPassword` eszközzel vagy az API-n keresztül:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

A válasz tartalmazza a `username` (alias e-mail cím) és `password` mezőket. Ezeket használja alias hitelesítő adatokként.

> **Tipp:** Megkérdezheti az AI asszisztensét is: *"Generáljon jelszót a user@example.com aliashoz az example.com domainen"* – ez meghívja a `generateAliasPassword` eszközt, és visszaadja a hitelesítő adatokat.

Az alábbi táblázat összefoglalja, hogy melyik hitelesítési módszerre van szükség az egyes eszközcsoportokhoz:

| Eszközcsoport | Hitelesítési módszer | Hitelesítő adatok |
|-----------|-------------|-------------|
| Fiók | API kulcs **vagy** alias hitelesítés | Bármelyik |
| Domainek, aliasok, domain tagok, meghívók, catch-all jelszavak | API kulcs | `FORWARD_EMAIL_API_KEY` |
| Kimenő e-mailek (lista, lekérés, törlés, limit) | API kulcs | `FORWARD_EMAIL_API_KEY` |
| E-mail küldése | API kulcs **vagy** alias hitelesítés | Bármelyik |
| Üzenetek (IMAP) | Alias hitelesítés | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Mappák (IMAP) | Alias hitelesítés | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kapcsolatok (CardDAV) | Alias hitelesítés | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Naptárak (CalDAV) | Alias hitelesítés | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Naptári események (CalDAV) | Alias hitelesítés | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve szkriptek (domain-hatókörű) | API kulcs | `FORWARD_EMAIL_API_KEY` |
| Sieve szkriptek (alias-hatókörű) | Alias hitelesítés | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Naplók | API kulcs | `FORWARD_EMAIL_API_KEY` |
| Titkosítás | Nincs | Nincs szükség hitelesítő adatokra |


## Mind a 68 eszköz {#all-68-tools}

Minden eszköz közvetlenül egy [Forward Email API](/email-api) végponthoz kapcsolódik. A paraméterek ugyanazokat a neveket használják, mint az API dokumentációban. A hitelesítési módszer az egyes szakaszok fejlécében van feltüntetve.

### Fiók (API kulcs vagy alias hitelesítés) {#account-api-key-or-alias-auth}

API kulcs hitelesítéssel ezek a felhasználói fiók adatait adják vissza. Alias hitelesítéssel az alias/postaládai információkat adják vissza, beleértve a tárhelykvótát és a beállításokat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Fiókinformációk lekérése |
| `updateAccount` | `PUT /v1/account` | Fiókbeállítások frissítése |

### Domainek (API kulcs) {#domains-api-key}

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Az összes domain listázása |
| `createDomain` | `POST /v1/domains` | Új domain hozzáadása |
| `getDomain` | `GET /v1/domains/:domain_id` | Domain részleteinek lekérése |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Domain beállításainak frissítése |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Domain eltávolítása |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | DNS rekordok ellenőrzése |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | SMTP konfiguráció ellenőrzése |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Egyéni S3 tárhely tesztelése |

### Aliasok (API kulcs) {#aliases-api-key}

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Aliasok listázása egy domainhez |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Új alias létrehozása |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Alias részleteinek lekérése |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Alias frissítése |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Alias törlése |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | IMAP/SMTP jelszó generálása alias hitelesítéshez |

### E-mailek – Kimenő SMTP (API kulcs; a küldés mindkettőt támogatja) {#emails--outbound-smtp-api-key-send-supports-both}

| Eszköz | API végpont | Hitelesítés | Leírás |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API kulcs vagy alias hitelesítés | E-mail küldése SMTP-n keresztül |
| `listEmails` | `GET /v1/emails` | API kulcs | Kimenő e-mailek listázása |
| `getEmail` | `GET /v1/emails/:id` | API kulcs | E-mail részleteinek és állapotának lekérése |
| `deleteEmail` | `DELETE /v1/emails/:id` | API kulcs | Sorban álló e-mail törlése |
| `getEmailLimit` | `GET /v1/emails/limit` | API kulcs | Küldési limit ellenőrzése |

A `sendEmail` eszköz elfogadja a `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` és `attachments` paramétereket. Ez megegyezik a `POST /v1/emails` végponttal.

### Üzenetek – IMAP (Alias hitelesítés) {#messages--imap-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Adja át az `alias_username` és `alias_password` paramétereket, vagy állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Üzenetek listázása és keresése egy postaládában |
| `createMessage` | `POST /v1/messages` | Piszkozat létrehozása vagy üzenet feltöltése |
| `getMessage` | `GET /v1/messages/:id` | Üzenet lekérése azonosító alapján |
| `updateMessage` | `PUT /v1/messages/:id` | Jelzők frissítése (olvasott, csillagozott stb.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Üzenet törlése |

A `listMessages` eszköz több mint 15 keresési paramétert támogat, beleértve a `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` és `has_attachment` paramétereket. A teljes listát az [API dokumentációban](/email-api) találja.

### Mappák – IMAP (Alias hitelesítés) {#folders--imap-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Adja át az `alias_username` és `alias_password` paramétereket, vagy állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Az összes postaláda mappa listázása |
| `createFolder` | `POST /v1/folders` | Új mappa létrehozása |
| `getFolder` | `GET /v1/folders/:id` | Mappa részleteinek lekérése |
| `updateFolder` | `PUT /v1/folders/:id` | Mappa átnevezése |
| `deleteFolder` | `DELETE /v1/folders/:id` | Mappa törlése |

### Kapcsolatok – CardDAV (Alias hitelesítés) {#contacts--carddav-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Adja át az `alias_username` és `alias_password` paramétereket, vagy állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Az összes kapcsolat listázása |
| `createContact` | `POST /v1/contacts` | Új kapcsolat létrehozása |
| `getContact` | `GET /v1/contacts/:id` | Kapcsolat részleteinek lekérése |
| `updateContact` | `PUT /v1/contacts/:id` | Kapcsolat frissítése |
| `deleteContact` | `DELETE /v1/contacts/:id` | Kapcsolat törlése |

### Naptárak – CalDAV (Alias hitelesítés) {#calendars--caldav-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Adja át az `alias_username` és `alias_password` paramétereket, vagy állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Az összes naptár listázása |
| `createCalendar` | `POST /v1/calendars` | Új naptár létrehozása |
| `getCalendar` | `GET /v1/calendars/:id` | Naptár részleteinek lekérése |
| `updateCalendar` | `PUT /v1/calendars/:id` | Naptár frissítése |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Naptár törlése |

### Naptári események – CalDAV (Alias hitelesítés) {#calendar-events--caldav-alias-auth}

> **Alias hitelesítő adatok szükségesek.** Adja át az `alias_username` és `alias_password` paramétereket, vagy állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Az összes esemény listázása |
| `createCalendarEvent` | `POST /v1/calendar-events` | Új esemény létrehozása |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Esemény részleteinek lekérése |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Esemény frissítése |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Esemény törlése |

### Sieve szkriptek (API kulcs) {#sieve-scripts-api-key}

Ezek domain-hatókörű útvonalakat használnak, és az API kulcsával hitelesítenek.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Szkriptek listázása egy aliashoz |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Új szkript létrehozása |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Szkript részleteinek lekérése |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Szkript frissítése |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Szkript törlése |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Szkript aktiválása |

### Sieve szkriptek (Alias hitelesítés) {#sieve-scripts-alias-auth}

Ezek alias szintű hitelesítést használnak. Hasznos az aliasonkénti automatizáláshoz anélkül, hogy API kulcsra lenne szükség.

> **Alias hitelesítő adatok szükségesek.** Adja át az `alias_username` és `alias_password` paramétereket, vagy állítsa be a `FORWARD_EMAIL_ALIAS_USER` és `FORWARD_EMAIL_ALIAS_PASSWORD` környezeti változókat.

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Szkriptek listázása |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Szkript létrehozása |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Szkript részleteinek lekérése |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Szkript frissítése |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Szkript törlése |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Szkript aktiválása |

### Domain tagok és meghívók (API kulcs) {#domain-members-and-invites-api-key}

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Tag szerepének módosítása |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Tag eltávolítása |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Függőben lévő meghívó elfogadása |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Valaki meghívása egy domainre |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Meghívó visszavonása |

### Catch-All jelszavak (API kulcs) {#catch-all-passwords-api-key}

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Catch-all jelszavak listázása |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Catch-all jelszó létrehozása |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Catch-all jelszó törlése |

### Naplók (API kulcs) {#logs-api-key}

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | E-mail kézbesítési naplók letöltése |

### Titkosítás (nincs hitelesítés) {#encrypt-no-auth}

| Eszköz | API végpont | Leírás |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | DNS TXT rekord titkosítása |

Ez az eszköz nem igényel hitelesítést. Titkosítja a továbbítási rekordokat, mint például a `forward-email=user@example.com`, DNS TXT rekordokban való használatra.


## 20 valós felhasználási eset {#20-real-world-use-cases}

Íme gyakorlati módok az MCP szerver használatára az AI asszisztensével:

### 1. E-mail szortírozás

Kérje meg az AI-t, hogy szkennelje be a beérkező leveleit, és foglalja össze az olvasatlan üzeneteket. Megjelölheti a sürgős e-maileket, kategóriákba sorolhatja a feladó szerint, és piszkozatot készíthet a válaszokról – mindezt természetes nyelven. *(Beérkező levelekhez alias hitelesítő adatok szükségesek.)*

### 2. Domain beállítás automatizálása

Új domaint állít be? Kérje meg az AI-t, hogy hozza létre a domaint, adja hozzá az aliasait, ellenőrizze a DNS rekordokat, és tesztelje az SMTP konfigurációt. Ami általában 10 perc kattintgatást igényel a műszerfalakon, az egyetlen beszélgetéssé válik.

### 3. Tömeges alias kezelés

Új projekthez 20 aliasra van szüksége? Írja le, mire van szüksége, és hagyja, hogy az AI végezze el az ismétlődő munkát. Létrehozhat aliasokat, beállíthat továbbítási szabályokat, és jelszavakat generálhat egy lépésben.

### 4. E-mail kampány figyelése

Kérje meg az AI-t, hogy ellenőrizze a küldési limiteket, listázza a legutóbbi kimenő e-maileket, és jelentést készítsen a kézbesítési állapotról. Hasznos a tranzakciós e-mailek állapotának figyeléséhez.

### 5. Kapcsolatok szinkronizálása és tisztítása

Használja a CardDAV eszközöket az összes kapcsolat listázásához, duplikátumok kereséséhez, elavult információk frissítéséhez, vagy tömeges kapcsolatok létrehozásához egy táblázatból, amelyet beilleszt a chatbe. *(Alias hitelesítő adatok szükségesek.)*

### 6. Naptárkezelés

Hozzon létre naptárakat, adjon hozzá eseményeket, frissítse a találkozók idejét, és törölje a törölt eseményeket – mindezt beszélgetésen keresztül. A CalDAV eszközök teljes CRUD támogatást nyújtanak mind a naptárak, mind az események számára. *(Alias hitelesítő adatok szükségesek.)*

### 7. Sieve szkript automatizálás

A Sieve szkriptek erősek, de a szintaxisuk bonyolult. Kérje meg az AI-t, hogy írjon Sieve szkripteket Önnek: "Szűrje az összes e-mailt a billing@example.com címről egy Számlázás mappába" egy működő szkriptté válik anélkül, hogy az RFC 5228 specifikációhoz hozzá kellene nyúlnia.

### 8. Csapat bevezetése

Amikor új csapattag csatlakozik, kérje meg az AI-t, hogy hozza létre az aliasát, generáljon jelszót, küldjön neki üdvözlő e-mailt a hitelesítő adataival, és adja hozzá domain tagként. Egy parancs, négy API hívás.

### 9. Biztonsági audit

Kérje meg az AI-t, hogy listázza az összes domaint, ellenőrizze a DNS ellenőrzési állapotát, tekintse át az alias konfigurációkat, és azonosítsa azokat a domaineket, amelyek nem ellenőrzött rekordokkal rendelkeznek. Egy gyors biztonsági ellenőrzés természetes nyelven.

### 10. E-mail továbbítás beállítása

Új domainhez állít be e-mail továbbítást? Kérje meg az AI-t, hogy hozza létre a domaint, adja hozzá a továbbítási aliasokat, titkosítsa a DNS rekordokat, és ellenőrizze, hogy minden megfelelően van-e konfigurálva.

### 11. Beérkező levelek keresése és elemzése

Használja az üzenetkereső eszközöket specifikus e-mailek megtalálásához: "Keresse meg az összes e-mailt a john@example.com címről az elmúlt 30 napban, amelyek mellékleteket tartalmaznak." A több mint 15 keresési paraméter rendkívül erőssé teszi ezt. *(Alias hitelesítő adatok szükségesek.)*

### 12. Mappa szervezés

Kérje meg az AI-t, hogy hozzon létre egy mappastruktúrát egy új projekthez, mozgassa az üzeneteket a mappák között, vagy tisztítsa meg a régi mappákat, amelyekre már nincs szüksége. *(Alias hitelesítő adatok szükségesek.)*

### 13. Jelszó rotáció

Generáljon új alias jelszavakat ütemezetten. Kérje meg az AI-t, hogy generáljon új jelszót minden aliashoz, és jelentse az új hitelesítő adatokat.

### 14. DNS rekord titkosítás

Titkosítsa a továbbítási rekordokat, mielőtt hozzáadná őket a DNS-hez. Az `encryptRecord` eszköz hitelesítés nélkül kezeli ezt – hasznos a gyors, egyszeri titkosításokhoz.

### 15. Kézbesítési napló elemzés

Töltse le az e-mail kézbesítési naplóit, és kérje meg az AI-t, hogy elemezze a visszapattanási arányokat, azonosítsa a problémás címzetteket, vagy kövesse nyomon a kézbesítési időket.

### 16. Több domain kezelése

Ha több domaint kezel, kérje meg az AI-t, hogy adjon állapotjelentést: mely domainek vannak ellenőrizve, melyekkel vannak problémák, hány aliasuk van, és milyenek a küldési limitek.

### 17. Catch-All konfiguráció

Állítson be catch-all jelszavakat azokhoz a domainekhez, amelyeknek bármilyen címre érkező e-mailt fogadniuk kell. Az AI létrehozhatja, listázhatja és kezelheti ezeket a jelszavakat Önnek.

### 18. Domain meghívók kezelése

Hívjon meg csapattagokat a domainek kezelésére, ellenőrizze a függőben lévő meghívókat, és tisztítsa meg a lejártakat. Hasznos több domain rendszergazdával rendelkező szervezetek számára.

### 19. S3 tárhely tesztelése

Ha egyéni S3 tárhelyet használ e-mail biztonsági mentésekhez, kérje meg az AI-t, hogy tesztelje a kapcsolatot, és ellenőrizze, hogy megfelelően működik-e.

### 20. E-mail piszkozat összeállítása

Hozzon létre piszkozat e-maileket a postaládájában anélkül, hogy elküldené őket. Hasznos az e-mailek előkészítéséhez, amelyek áttekintést igényelnek a küldés előtt, vagy e-mail sablonok építéséhez. *(Alias hitelesítő adatok szükségesek.)*


## Példa parancsok {#example-prompts}

Íme olyan parancsok, amelyeket közvetlenül használhat az AI asszisztensével:

**E-mail küldése:**
> "Küldjön egy e-mailt a hello@mydomain.com címről a john@example.com címre 'Holnapi találkozó' tárggyal és 'Szia John, még mindig 2 órakor találkozunk?' szöveggel."

**Domain kezelés:**
> "Listázza az összes domainemet, és mondja meg, melyeknek vannak nem ellenőrzött DNS rekordjai."

**Alias létrehozása:**
> "Hozzon létre egy új alias support@mydomain.com címet, amely a személyes e-mail címemre továbbít."

**Beérkező levelek keresése (alias hitelesítő adatok szükségesek):**
> "Keresse meg az összes olvasatlan e-mailt az elmúlt hétről, amelyekben az 'invoice' szó szerepel."

**Naptár (alias hitelesítő adatok szükségesek):**
> "Hozzon létre egy 'Munka' nevű naptárat, és adjon hozzá egy 'Csapatmegbeszélés' nevű találkozót holnap 2 órára."

**Sieve szkriptek:**
> "Írjon egy Sieve szkriptet az info@mydomain.com címre, amely automatikusan válaszol az e-mailekre a 'Köszönjük, hogy felvette velünk a kapcsolatot, 24 órán belül válaszolunk.' szöveggel."

**Tömeges műveletek:**
> "Hozzon létre aliasokat a sales@, support@, billing@ és info@ címekhez a mydomain.com domainen, mindet a team@mydomain.com címre továbbítva."

**Biztonsági ellenőrzés:**
> "Ellenőrizze az összes domainem DNS és SMTP ellenőrzési állapotát, és mondja meg, ha valami figyelmet igényel."

**Alias jelszó generálása:**
> "Generáljon jelszót a user@example.com aliashoz, hogy hozzáférhessek a beérkező leveleimhez."


## Környezeti változók {#environment-variables}

| Változó | Kötelező | Alapértelmezett | Leírás |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Igen | — | Az Ön Forward Email API kulcsa (Basic hitelesítés felhasználóneveként használatos az API-kulcs végpontokhoz) |
| `FORWARD_EMAIL_ALIAS_USER` | Nem | — | Alias e-mail cím a postaláda végpontokhoz (pl. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nem | — | Generált alias jelszó a postaláda végpontokhoz |
| `FORWARD_EMAIL_API_URL` | Nem | `https://api.forwardemail.net` | API alap URL (saját üzemeltetéshez vagy teszteléshez) |


## Biztonság {#security}

Az MCP szerver helyileg fut a gépén. Így működik a biztonság:

* **Az Ön hitelesítő adatai helyben maradnak.** Mind az API kulcsa, mind az alias hitelesítő adatai a környezeti változókból kerülnek beolvasásra, és HTTP Basic hitelesítésen keresztül használatosak az API kérések hitelesítésére. Soha nem kerülnek elküldésre az AI modellnek.
* **stdio transzport.** A szerver az AI klienssel stdin/stdout-on keresztül kommunikál. Nincsenek hálózati portok megnyitva.
* **Nincs adattárolás.** A szerver állapotmentes. Nem gyorsítótárazza, nem naplózza és nem tárolja az e-mail adatait.
* **Nyílt forráskód.** A teljes kódbázis megtalálható a [GitHubon](https://github.com/forwardemail/mcp-server). Minden sort ellenőrizhet.


## Programozott használat {#programmatic-usage}

A szervert könyvtárként is használhatja:

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

A Forward Email MCP szerver [nyílt forráskódú a GitHubon](https://github.com/forwardemail/mcp-server) a BUSL-1.1 licenc alatt. Hiszünk az átláthatóságban. Ha hibát talál, vagy funkciót szeretne, [nyisson egy hibajegyet](https://github.com/forwardemail/mcp-server/issues).
