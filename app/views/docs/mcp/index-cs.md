# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Náš <a href="https://github.com/forwardemail/mcp-server">open-source MCP server</a> umožňuje AI asistentům jako Claude, ChatGPT, Cursor a Windsurf spravovat vaše e-maily, domény, aliasy, kontakty a kalendáře pomocí přirozeného jazyka. Všechny 68 API endpointů jsou zpřístupněny jako MCP nástroje. Server běží lokálně přes <code>npx @forwardemail/mcp-server</code> — vaše přihlašovací údaje nikdy neopustí váš počítač.
</p>


## Obsah {#table-of-contents}

* [Co je MCP?](#what-is-mcp)
* [Rychlý start](#quick-start)
  * [Získání API klíče](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Další MCP klienti](#other-mcp-clients)
* [Autentizace](#authentication)
  * [API klíč autentizace](#api-key-auth)
  * [Alias autentizace](#alias-auth)
  * [Generování hesla aliasu](#generating-an-alias-password)
* [Všechny 68 nástrojů](#all-68-tools)
  * [Účet (API klíč nebo alias autentizace)](#account-api-key-or-alias-auth)
  * [Domény (API klíč)](#domains-api-key)
  * [Alias (API klíč)](#aliases-api-key)
  * [E-maily — odchozí SMTP (API klíč; Send podporuje obojí)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Zprávy — IMAP (alias autentizace)](#messages--imap-alias-auth)
  * [Složky — IMAP (alias autentizace)](#folders--imap-alias-auth)
  * [Kontakty — CardDAV (alias autentizace)](#contacts--carddav-alias-auth)
  * [Kalendáře — CalDAV (alias autentizace)](#calendars--caldav-alias-auth)
  * [Události kalendáře — CalDAV (alias autentizace)](#calendar-events--caldav-alias-auth)
  * [Skripty Sieve (API klíč)](#sieve-scripts-api-key)
  * [Skripty Sieve (alias autentizace)](#sieve-scripts-alias-auth)
  * [Členové domény a pozvánky (API klíč)](#domain-members-and-invites-api-key)
  * [Hesla Catch-All (API klíč)](#catch-all-passwords-api-key)
  * [Logy (API klíč)](#logs-api-key)
  * [Šifrování (bez autentizace)](#encrypt-no-auth)
* [20 reálných případů použití](#20-real-world-use-cases)
  * [1. Třídění e-mailů](#1-email-triage)
  * [2. Automatizace nastavení domény](#2-domain-setup-automation)
  * [3. Hromadná správa aliasů](#3-bulk-alias-management)
  * [4. Monitorování e-mailových kampaní](#4-email-campaign-monitoring)
  * [5. Synchronizace a úklid kontaktů](#5-contact-sync-and-cleanup)
  * [6. Správa kalendáře](#6-calendar-management)
  * [7. Automatizace skriptů Sieve](#7-sieve-script-automation)
  * [8. Zaškolení týmu](#8-team-onboarding)
  * [9. Bezpečnostní audit](#9-security-auditing)
  * [10. Nastavení přeposílání e-mailů](#10-email-forwarding-setup)
  * [11. Vyhledávání a analýza v doručené poště](#11-inbox-search-and-analysis)
  * [12. Organizace složek](#12-folder-organization)
  * [13. Rotace hesel](#13-password-rotation)
  * [14. Šifrování DNS záznamů](#14-dns-record-encryption)
  * [15. Analýza logů doručení](#15-delivery-log-analysis)
  * [16. Správa více domén](#16-multi-domain-management)
  * [17. Konfigurace Catch-All](#17-catch-all-configuration)
  * [18. Správa pozvánek do domény](#18-domain-invite-management)
  * [19. Testování úložiště S3](#19-s3-storage-testing)
  * [20. Sestavování konceptů e-mailů](#20-email-draft-composition)
* [Příkladové příkazy](#example-prompts)
* [Proměnné prostředí](#environment-variables)
* [Bezpečnost](#security)
* [Programatické použití](#programmatic-usage)
* [Open Source](#open-source)


## Co je MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) je otevřený standard vytvořený společností Anthropic, který umožňuje AI modelům bezpečně volat externí nástroje. Místo kopírování a vkládání odpovědí API do chatovacího okna poskytuje MCP modelu přímý, strukturovaný přístup k vašim službám.

Náš MCP server obaluje celé [Forward Email API](/email-api) — každý endpoint, každý parametr — a zpřístupňuje je jako nástroje, které může použít jakýkoli MCP-kompatibilní klient. Server běží lokálně na vašem počítači pomocí stdio transportu. Vaše přihlašovací údaje zůstávají ve vašich proměnných prostředí a nikdy nejsou odesílány AI modelu.


## Rychlý start {#quick-start}

### Získání API klíče {#get-an-api-key}
1. Přihlaste se do svého [účtu Forward Email](/my-account/domains).
2. Přejděte do **Můj účet** → **Zabezpečení** → **API klíče**.
3. Vygenerujte nový API klíč a zkopírujte ho.

### Claude Desktop {#claude-desktop}

Přidejte toto do konfiguračního souboru Claude Desktop:

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

Restartujte Claude Desktop. V nástroji pro výběr nástrojů byste měli vidět nástroje Forward Email.

> **Poznámka:** Proměnné `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD` jsou nepovinné, ale vyžadované pro nástroje poštovní schránky (zprávy, složky, kontakty, kalendáře). Podrobnosti najdete v [Autentizaci](#authentication).

### Cursor {#cursor}

Otevřete Nastavení Cursor → MCP → Přidat server:

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

Otevřete Nastavení Windsurf → MCP → Přidat server se stejnou konfigurací jako výše.

### Ostatní MCP klienti {#other-mcp-clients}

Jakýkoli klient, který podporuje MCP stdio transport, bude fungovat. Příkaz je:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentizace {#authentication}

API Forward Email používá **HTTP Basic autentizaci** se dvěma různými typy přihlašovacích údajů v závislosti na koncovém bodu. MCP server to řeší automaticky — stačí poskytnout správné přihlašovací údaje.

### Autentizace pomocí API klíče {#api-key-auth}

Většina správcovských koncových bodů (domény, aliasy, odchozí e-maily, logy) používá váš **API klíč** jako uživatelské jméno pro Basic auth s prázdným heslem.

Je to stejný API klíč, který používáte pro REST API. Nastavte ho pomocí proměnné prostředí `FORWARD_EMAIL_API_KEY`.

### Autentizace aliasu {#alias-auth}

Koncové body poštovní schránky (zprávy, složky, kontakty, kalendáře, aliasově omezené sieve skripty) používají **přihlašovací údaje aliasu** — aliasovou e-mailovou adresu jako uživatelské jméno a vygenerované heslo jako heslo.

Tyto koncové body přistupují k datům na úrovni aliasu přes protokoly IMAP, CalDAV a CardDAV. Vyžadují aliasový e-mail a vygenerované heslo, nikoli API klíč.

Přihlašovací údaje aliasu můžete poskytnout dvěma způsoby:

1. **Proměnné prostředí** (doporučeno pro výchozí alias): Nastavte `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametry pro jednotlivé volání nástroje**: Předávejte `alias_username` a `alias_password` jako argumenty jakémukoli nástroji s autentizací aliasu. Tyto přepíší proměnné prostředí, což je užitečné při práci s více aliasy.

### Generování hesla aliasu {#generating-an-alias-password}

Než budete moci používat nástroje s autentizací aliasu, musíte pro alias vygenerovat heslo. Můžete to udělat pomocí nástroje `generateAliasPassword` nebo přes API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Odpověď obsahuje pole `username` (aliasový e-mail) a `password`. Použijte je jako přihlašovací údaje aliasu.

> **Tip:** Můžete také požádat svého AI asistenta: *"Vygeneruj heslo pro alias <user@example.com> na doméně example.com"* — zavolá nástroj `generateAliasPassword` a vrátí přihlašovací údaje.

Tabulka níže shrnuje, jaký způsob autentizace vyžaduje každá skupina nástrojů:

| Skupina nástrojů                                              | Metoda autentizace       | Přihlašovací údaje                                         |
| ------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------- |
| Účet                                                          | API klíč **nebo** Alias | Buď jeden                                                 |
| Domény, aliasy, členové domény, pozvánky, hesla catch-all     | API klíč                | `FORWARD_EMAIL_API_KEY`                                    |
| Odchozí e-maily (seznam, získat, smazat, limit)               | API klíč                | `FORWARD_EMAIL_API_KEY`                                    |
| Odeslat e-mail                                                | API klíč **nebo** Alias | Buď jeden                                                 |
| Zprávy (IMAP)                                                 | Alias                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Složky (IMAP)                                                 | Alias                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakty (CardDAV)                                            | Alias                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendáře (CalDAV)                                            | Alias                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Události kalendáře (CalDAV)                                   | Alias                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve skripty (omezené na doménu)                            | API klíč                | `FORWARD_EMAIL_API_KEY`                                    |
| Sieve skripty (omezené na alias)                             | Alias                   | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logy                                                          | API klíč                | `FORWARD_EMAIL_API_KEY`                                    |
| Šifrování                                                    | Žádná                   | Nepotřebujete přihlašovací údaje                           |
## Všechny 68 nástrojů {#all-68-tools}

Každý nástroj odpovídá přímo [Forward Email API](/email-api) endpointu. Parametry používají stejná jména jako v dokumentaci API. Metoda autentizace je uvedena v nadpisu každé sekce.

### Účet (API klíč nebo autentizace aliasem) {#account-api-key-or-alias-auth}

Při autentizaci pomocí API klíče tyto nástroje vrací informace o vašem uživatelském účtu. Při autentizaci aliasem vrací informace o aliasu/mailboxu včetně kvóty úložiště a nastavení.

| Nástroj          | API Endpoint      | Popis                        |
| ---------------- | ----------------- | ---------------------------- |
| `getAccount`     | `GET /v1/account` | Získat informace o účtu      |
| `updateAccount`  | `PUT /v1/account` | Aktualizovat nastavení účtu  |

### Domény (API klíč) {#domains-api-key}

| Nástroj              | API Endpoint                                     | Popis                      |
| -------------------- | ------------------------------------------------ | -------------------------- |
| `listDomains`        | `GET /v1/domains`                                | Vypsat všechny vaše domény |
| `createDomain`       | `POST /v1/domains`                               | Přidat novou doménu        |
| `getDomain`          | `GET /v1/domains/:domain_id`                     | Získat detaily domény      |
| `updateDomain`       | `PUT /v1/domains/:domain_id`                     | Aktualizovat nastavení domény |
| `deleteDomain`       | `DELETE /v1/domains/:domain_id`                  | Odstranit doménu           |
| `verifyDomainRecords`| `GET /v1/domains/:domain_id/verify-records`     | Ověřit DNS záznamy         |
| `verifySmtpRecords`  | `GET /v1/domains/:domain_id/verify-smtp`        | Ověřit SMTP konfiguraci    |
| `testS3Connection`   | `POST /v1/domains/:domain_id/test-s3-connection`| Otestovat vlastní S3 úložiště |

### Aliasy (API klíč) {#aliases-api-key}

| Nástroj                  | API Endpoint                                                      | Popis                                   |
| ------------------------ | ----------------------------------------------------------------- | --------------------------------------- |
| `listAliases`            | `GET /v1/domains/:domain_id/aliases`                              | Vypsat aliasy pro doménu                |
| `createAlias`            | `POST /v1/domains/:domain_id/aliases`                             | Vytvořit nový alias                     |
| `getAlias`               | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Získat detaily aliasu                   |
| `updateAlias`            | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Aktualizovat alias                      |
| `deleteAlias`            | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Smazat alias                           |
| `generateAliasPassword`  | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Vygenerovat IMAP/SMTP heslo pro autentizaci aliasem |

### E-maily — odchozí SMTP (API klíč; Send podporuje obojí) {#emails--outbound-smtp-api-key-send-supports-both}

| Nástroj          | API Endpoint            | Autentizace           | Popis                         |
| ---------------- | ----------------------- | --------------------- | ----------------------------- |
| `sendEmail`      | `POST /v1/emails`       | API klíč nebo alias   | Odeslat e-mail přes SMTP      |
| `listEmails`     | `GET /v1/emails`        | API klíč              | Vypsat odchozí e-maily        |
| `getEmail`       | `GET /v1/emails/:id`    | API klíč              | Získat detaily a stav e-mailu |
| `deleteEmail`    | `DELETE /v1/emails/:id` | API klíč              | Smazat e-mail ve frontě       |
| `getEmailLimit`  | `GET /v1/emails/limit`  | API klíč              | Zkontrolovat limit odesílání  |

Nástroj `sendEmail` přijímá `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` a `attachments`. Je to stejné jako endpoint `POST /v1/emails`.

### Zprávy — IMAP (autentizace aliasem) {#messages--imap-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předávejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Nástroj          | API Endpoint              | Popis                                |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Vypsat a vyhledávat zprávy v poštovní schránce |
| `createMessage` | `POST /v1/messages`       | Vytvořit koncept nebo nahrát zprávu  |
| `getMessage`    | `GET /v1/messages/:id`    | Získat zprávu podle ID               |
| `updateMessage` | `PUT /v1/messages/:id`    | Aktualizovat příznaky (přečteno, označeno hvězdičkou, atd.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Smazat zprávu                       |

Nástroj `listMessages` podporuje více než 15 vyhledávacích parametrů včetně `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` a `has_attachment`. Kompletní seznam najdete v [API docs](/email-api).

### Složky — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předávejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj         | API Endpoint             | Popis                   |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Vypsat všechny složky poštovní schránky |
| `createFolder` | `POST /v1/folders`       | Vytvořit novou složku    |
| `getFolder`    | `GET /v1/folders/:id`    | Získat detaily složky    |
| `updateFolder` | `PUT /v1/folders/:id`    | Přejmenovat složku       |
| `deleteFolder` | `DELETE /v1/folders/:id` | Smazat složku            |

### Kontakty — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předávejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj          | API Endpoint              | Popis                 |
| --------------- | ------------------------- | --------------------- |
| `listContacts`  | `GET /v1/contacts`        | Vypsat všechny kontakty |
| `createContact` | `POST /v1/contacts`       | Vytvořit nový kontakt  |
| `getContact`    | `GET /v1/contacts/:id`    | Získat detaily kontaktu |
| `updateContact` | `PUT /v1/contacts/:id`    | Aktualizovat kontakt   |
| `deleteContact` | `DELETE /v1/contacts/:id` | Smazat kontakt         |

### Kalendáře — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předávejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj           | API Endpoint               | Popis                  |
| ---------------- | -------------------------- | ---------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Vypsat všechny kalendáře |
| `createCalendar` | `POST /v1/calendars`       | Vytvořit nový kalendář  |
| `getCalendar`    | `GET /v1/calendars/:id`    | Získat detaily kalendáře |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Aktualizovat kalendář   |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Smazat kalendář         |

### Události kalendáře — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předávejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj                | API Endpoint                     | Popis                 |
| --------------------- | -------------------------------- | --------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Vypsat všechny události |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Vytvořit novou událost |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Získat detaily události |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Aktualizovat událost   |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Smazat událost        |

### Sieve skripty (API klíč) {#sieve-scripts-api-key}

Tyto používají cesty omezené na doménu a autentizují se pomocí vašeho API klíče.

| Nástroj                | API Endpoint                                                              | Popis                      |
| --------------------- | ------------------------------------------------------------------------- | -------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Vypsat skripty pro alias   |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Vytvořit nový skript       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Získat detaily skriptu     |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Aktualizovat skript        |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Smazat skript              |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktivovat skript           |
### Sieve skripty (Alias Auth) {#sieve-scripts-alias-auth}

Tyto používají autentizaci na úrovni aliasu. Uživatelsky vhodné pro automatizaci na úrovni aliasu bez potřeby API klíče.

> **Vyžaduje přihlašovací údaje aliasu.** Předávejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj                        | API Endpoint                                 | Popis              |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Vypsat skripty     |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Vytvořit skript    |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Získat detaily skriptu |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Aktualizovat skript |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Smazat skript      |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivovat skript   |

### Členové domény a pozvánky (API klíč) {#domain-members-and-invites-api-key}

| Nástroj               | API Endpoint                                       | Popis                      |
| --------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`    | Změnit roli člena          |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Odebrat člena              |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`               | Přijmout čekající pozvánku |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`              | Pozvat někoho do domény    |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`            | Zrušit pozvánku            |

### Hesla Catch-All (API klíč) {#catch-all-passwords-api-key}

| Nástroj                   | API Endpoint                                                  | Popis                       |
| ------------------------- | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`   | `GET /v1/domains/:domain_id/catch-all-passwords`              | Vypsat catch-all hesla      |
| `createCatchAllPassword`  | `POST /v1/domains/:domain_id/catch-all-passwords`             | Vytvořit catch-all heslo    |
| `deleteCatchAllPassword`  | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Smazat catch-all heslo      |

### Logy (API klíč) {#logs-api-key}

| Nástroj         | API Endpoint            | Popis                        |
| --------------- | ----------------------- | ---------------------------- |
| `downloadLogs`  | `GET /v1/logs/download` | Stáhnout logy doručení emailů |

### Šifrování (Bez autentizace) {#encrypt-no-auth}

| Nástroj          | API Endpoint       | Popis                      |
| ---------------- | ------------------ | -------------------------- |
| `encryptRecord`  | `POST /v1/encrypt` | Zašifrovat DNS TXT záznam  |

Tento nástroj nevyžaduje autentizaci. Zašifruje přesměrovací záznamy jako `forward-email=user@example.com` pro použití v DNS TXT záznamech.


## 20 reálných případů použití {#20-real-world-use-cases}

Zde jsou praktické způsoby, jak používat MCP server s vaším AI asistentem:

### 1. Třídění emailů {#1-email-triage}

Požádejte svého AI, aby prohledal vaši schránku a shrnul nepřečtené zprávy. Může označit naléhavé emaily, kategorizovat podle odesílatele a navrhnout odpovědi — vše pomocí přirozeného jazyka. *(Vyžaduje přihlašovací údaje aliasu pro přístup do schránky.)*

### 2. Automatizace nastavení domény {#2-domain-setup-automation}

Nastavujete novou doménu? Požádejte AI, aby vytvořil doménu, přidal vaše aliasy, ověřil DNS záznamy a otestoval konfiguraci SMTP. Co normálně zabere 10 minut klikání v rozhraní, se stane jedním rozhovorem.

### 3. Hromadná správa aliasů {#3-bulk-alias-management}

Potřebujete vytvořit 20 aliasů pro nový projekt? Popište, co potřebujete, a nechte AI zvládnout opakující se práci. Může vytvořit aliasy, nastavit pravidla přesměrování a vygenerovat hesla najednou.
### 4. Monitorování e-mailových kampaní {#4-email-campaign-monitoring}

Požádejte svého AI, aby zkontroloval limity odesílání, vypsal nedávné odchozí e-maily a nahlásil stav doručení. Užitočné pro sledování zdraví transakčních e-mailů.

### 5. Synchronizace a úklid kontaktů {#5-contact-sync-and-cleanup}

Použijte nástroje CardDAV k vypsání všech kontaktů, nalezení duplicit, aktualizaci zastaralých informací nebo hromadnému vytvoření kontaktů ze spreadsheetu, který vložíte do chatu. *(Vyžaduje přihlašovací údaje aliasu.)*

### 6. Správa kalendáře {#6-calendar-management}

Vytvářejte kalendáře, přidávejte události, aktualizujte časy schůzek a mažte zrušené události — vše prostřednictvím konverzace. Nástroje CalDAV podporují plné CRUD jak na kalendářích, tak na událostech. *(Vyžaduje přihlašovací údaje aliasu.)*

### 7. Automatizace Sieve skriptů {#7-sieve-script-automation}

Sieve skripty jsou mocné, ale syntaxe je složitá. Požádejte svého AI, aby pro vás napsal Sieve skripty: „Filtrovat všechny e-maily od <billing@example.com> do složky Billing“ se stane funkčním skriptem bez nutnosti sahat do specifikace RFC 5228.

### 8. Zaškolení týmu {#8-team-onboarding}

Když se přidá nový člen týmu, požádejte AI, aby vytvořil jeho alias, vygeneroval heslo, poslal uvítací e-mail s přihlašovacími údaji a přidal ho jako člena domény. Jeden příkaz, čtyři API volání.

### 9. Bezpečnostní audit {#9-security-auditing}

Požádejte svého AI, aby vypsal všechny domény, zkontroloval stav ověření DNS, přezkoumal konfigurace aliasů a identifikoval domény s neověřenými záznamy. Rychlá bezpečnostní kontrola v přirozeném jazyce.

### 10. Nastavení přeposílání e-mailů {#10-email-forwarding-setup}

Nastavujete přeposílání e-mailů pro novou doménu? Požádejte AI, aby vytvořil doménu, přidal přeposílací aliasy, zašifroval DNS záznamy a ověřil, že je vše správně nastaveno.

### 11. Vyhledávání a analýza v doručené poště {#11-inbox-search-and-analysis}

Použijte nástroje pro vyhledávání zpráv k nalezení konkrétních e-mailů: „Najdi všechny e-maily od <john@example.com> za posledních 30 dní, které mají přílohy.“ Více než 15 parametrů vyhledávání dělá tento nástroj mocným. *(Vyžaduje přihlašovací údaje aliasu.)*

### 12. Organizace složek {#12-folder-organization}

Požádejte svého AI, aby vytvořil strukturu složek pro nový projekt, přesunul zprávy mezi složkami nebo uklidil staré složky, které už nepotřebujete. *(Vyžaduje přihlašovací údaje aliasu.)*

### 13. Rotace hesel {#13-password-rotation}

Generujte nová hesla aliasů podle plánu. Požádejte svého AI, aby vygeneroval nové heslo pro každý alias a nahlásil nové přihlašovací údaje.

### 14. Šifrování DNS záznamů {#14-dns-record-encryption}

Zašifrujte své přeposílací záznamy před jejich přidáním do DNS. Nástroj `encryptRecord` to zvládne bez autentizace — užitečné pro rychlé jednorázové šifrování.

### 15. Analýza logů doručení {#15-delivery-log-analysis}

Stáhněte si logy doručení e-mailů a požádejte AI, aby analyzoval míru odmítnutí, identifikoval problematické příjemce nebo sledoval časy doručení.

### 16. Správa více domén {#16-multi-domain-management}

Pokud spravujete více domén, požádejte AI o přehled stavu: které domény jsou ověřené, které mají problémy, kolik aliasů každá má a jak vypadají limity odesílání.

### 17. Konfigurace catch-all {#17-catch-all-configuration}

Nastavte catch-all hesla pro domény, které musí přijímat e-maily na jakoukoli adresu. AI může tato hesla vytvářet, vypisovat a spravovat za vás.

### 18. Správa pozvánek do domény {#18-domain-invite-management}

Pozvěte členy týmu ke správě domén, zkontrolujte čekající pozvánky a vyčistěte expirované. Užitočné pro organizace s více správci domén.

### 19. Testování S3 úložiště {#19-s3-storage-testing}

Pokud používáte vlastní S3 úložiště pro zálohy e-mailů, požádejte AI, aby otestoval připojení a ověřil, že funguje správně.

### 20. Sestavení konceptu e-mailu {#20-email-draft-composition}

Vytvářejte koncepty e-mailů ve své schránce bez jejich odeslání. Užitočné pro přípravu e-mailů, které je třeba před odesláním zkontrolovat, nebo pro tvorbu šablon e-mailů. *(Vyžaduje přihlašovací údaje aliasu.)*


## Příkladové příkazy {#example-prompts}

Zde jsou příkazy, které můžete použít přímo se svým AI asistentem:

**Odeslání e-mailu:**

> "Pošli e-mail z <hello@mydomain.com> na <john@example.com> s předmětem 'Schůzka zítra' a textem 'Ahoj Johne, platí ještě schůzka na 14:00?'"
**Správa domén:**

> "Vyjmenuj všechny mé domény a řekni mi, které mají neověřené DNS záznamy."

**Vytvoření aliasu:**

> "Vytvoř nový alias <support@mydomain.com>, který přeposílá na můj osobní e-mail."

**Vyhledávání v doručené poště (vyžaduje přihlašovací údaje aliasu):**

> "Najdi všechny nepřečtené e-maily z posledního týdne, které obsahují slovo 'faktura'."

**Kalendář (vyžaduje přihlašovací údaje aliasu):**

> "Vytvoř kalendář nazvaný 'Práce' a přidej schůzku na zítra v 14:00 s názvem 'Týmový standup'."

**Skripty Sieve:**

> "Napiš Sieve skript pro <info@mydomain.com>, který automaticky odpoví na e-maily zprávou 'Děkujeme za kontaktování, ozveme se vám do 24 hodin.'"

**Hromadné operace:**

> "Vytvoř aliasy pro sales@, support@, billing@ a info@ na mydomain.com, všechny přeposílající na <team@mydomain.com>."

**Kontrola zabezpečení:**

> "Zkontroluj stav ověření DNS a SMTP pro všechny mé domény a řekni mi, jestli něco vyžaduje pozornost."

**Generování hesla aliasu:**

> "Vygeneruj heslo pro alias <user@example.com>, abych mohl přistupovat ke své doručené poště."


## Environment Variables {#environment-variables}

| Proměnná                      | Povinná | Výchozí hodnota                | Popis                                                                          |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Ano      | —                              | Tvůj Forward Email API klíč (používá se jako uživatelské jméno pro Basic auth) |
| `FORWARD_EMAIL_ALIAS_USER`     | Ne       | —                              | E-mailová adresa aliasu pro mailbox endpointy (např. `user@example.com`)       |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Ne       | —                              | Vygenerované heslo aliasu pro mailbox endpointy                                |
| `FORWARD_EMAIL_API_URL`        | Ne       | `https://api.forwardemail.net` | Základní URL API (pro self-hosting nebo testování)                             |


## Zabezpečení {#security}

MCP server běží lokálně na tvém počítači. Takto funguje zabezpečení:

* **Tvé přihlašovací údaje zůstávají lokální.** Tvůj API klíč i přihlašovací údaje aliasu jsou načítány z proměnných prostředí a používány k autentizaci API požadavků přes HTTP Basic auth. Nikdy nejsou odesílány AI modelu.
* **stdio transport.** Server komunikuje s AI klientem přes stdin/stdout. Žádné síťové porty nejsou otevřeny.
* **Žádné ukládání dat.** Server je bezstavový. Neukládá, nezaznamenává ani necacheuje žádná tvá e-mailová data.
* **Open source.** Celý zdrojový kód je na [GitHubu](https://github.com/forwardemail/mcp-server). Můžeš si zkontrolovat každý řádek.


## Programatické použití {#programmatic-usage}

Server můžeš také použít jako knihovnu:

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

Forward Email MCP Server je [open-source na GitHubu](https://github.com/forwardemail/mcp-server) pod licencí BUSL-1.1. Věříme v transparentnost. Pokud najdeš chybu nebo chceš funkci, [otevři issue](https://github.com/forwardemail/mcp-server/issues).
