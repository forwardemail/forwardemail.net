# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Náš <a href="https://github.com/forwardemail/mcp-server">open-source MCP server</a> umožňuje AI asistentům jako Claude, ChatGPT, Cursor a Windsurf spravovat váš e-mail, domény, aliasy, kontakty a kalendáře prostřednictvím přirozeného jazyka. Všech 68 API endpointů je vystaveno jako MCP nástroje. Běží lokálně přes <code>npx @forwardemail/mcp-server</code> – vaše přihlašovací údaje nikdy neopustí váš počítač.
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
  * [Autentizace pomocí API klíče](#api-key-auth)
  * [Autentizace pomocí aliasu](#alias-auth)
  * [Generování hesla aliasu](#generating-an-alias-password)
* [Všech 68 nástrojů](#all-68-tools)
  * [Účet (API klíč nebo autentizace aliasu)](#account-api-key-or-alias-auth)
  * [Domény (API klíč)](#domains-api-key)
  * [Aliasy (API klíč)](#aliases-api-key)
  * [E-maily – odchozí SMTP (API klíč; odesílání podporuje obojí)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Zprávy – IMAP (autentizace aliasu)](#messages--imap-alias-auth)
  * [Složky – IMAP (autentizace aliasu)](#folders--imap-alias-auth)
  * [Kontakty – CardDAV (autentizace aliasu)](#contacts--carddav-alias-auth)
  * [Kalendáře – CalDAV (autentizace aliasu)](#calendars--caldav-alias-auth)
  * [Události kalendáře – CalDAV (autentizace aliasu)](#calendar-events--caldav-alias-auth)
  * [Sieve skripty (API klíč)](#sieve-scripts-api-key)
  * [Sieve skripty (autentizace aliasu)](#sieve-scripts-alias-auth)
  * [Členové domény a pozvánky (API klíč)](#domain-members-and-invites-api-key)
  * [Catch-All hesla (API klíč)](#catch-all-passwords-api-key)
  * [Logy (API klíč)](#logs-api-key)
  * [Šifrování (bez autentizace)](#encrypt-no-auth)
* [20 reálných případů použití](#20-real-world-use-cases)
* [Příklady dotazů](#example-prompts)
* [Proměnné prostředí](#environment-variables)
* [Zabezpečení](#security)
* [Programové použití](#programmatic-usage)
* [Open Source](#open-source)


## Co je MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) je otevřený standard vytvořený společností Anthropic, který umožňuje AI modelům bezpečně volat externí nástroje. Namísto kopírování a vkládání odpovědí z API do chatovacího okna, MCP poskytuje modelu přímý, strukturovaný přístup k vašim službám.

Náš MCP server obaluje celé [Forward Email API](/email-api) – každý endpoint, každý parametr – a vystavuje je jako nástroje, které může použít jakýkoli MCP-kompatibilní klient. Server běží lokálně na vašem počítači pomocí stdio transportu. Vaše přihlašovací údaje zůstávají ve vašich proměnných prostředí a nikdy nejsou odeslány AI modelu.


## Rychlý start {#quick-start}

### Získání API klíče {#get-an-api-key}

1. Přihlaste se do svého [účtu Forward Email](/my-account/domains).
2. Přejděte na **Můj účet** → **Zabezpečení** → **API klíče**.
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

Restartujte Claude Desktop. Měli byste vidět nástroje Forward Email ve výběru nástrojů.

> **Poznámka:** Proměnné `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD` jsou volitelné, ale vyžadované pro nástroje poštovní schránky (zprávy, složky, kontakty, kalendáře). Podrobnosti naleznete v části [Autentizace](#authentication).

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

### Další MCP klienti {#other-mcp-clients}

Bude fungovat jakýkoli klient, který podporuje MCP stdio transport. Příkaz je:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autentizace {#authentication}

Forward Email API používá **HTTP Basic autentizaci** se dvěma různými typy přihlašovacích údajů v závislosti na endpointu. MCP server to zpracovává automaticky – stačí poskytnout správné přihlašovací údaje.

### Autentizace pomocí API klíče {#api-key-auth}

Většina endpointů pro správu (domény, aliasy, odchozí e-maily, logy) používá váš **API klíč** jako uživatelské jméno pro Basic autentizaci s prázdným heslem.

Jedná se o stejný API klíč, který používáte pro REST API. Nastavte jej pomocí proměnné prostředí `FORWARD_EMAIL_API_KEY`.

### Autentizace pomocí aliasu {#alias-auth}

Endpointy poštovní schránky (zprávy, složky, kontakty, kalendáře, Sieve skripty s rozsahem aliasu) používají **přihlašovací údaje aliasu** – e-mailovou adresu aliasu jako uživatelské jméno a vygenerované heslo jako heslo.

Tyto endpointy přistupují k datům pro jednotlivé aliasy prostřednictvím protokolů IMAP, CalDAV a CardDAV. Vyžadují e-mail aliasu a vygenerované heslo, nikoli API klíč.

Přihlašovací údaje aliasu můžete poskytnout dvěma způsoby:

1. **Proměnné prostředí** (doporučeno pro výchozí alias): Nastavte `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametry pro volání nástroje**: Předejte `alias_username` a `alias_password` jako argumenty libovolnému nástroji pro autentizaci aliasu. Tyto parametry přepíší proměnné prostředí, což je užitečné při práci s více aliasy.

### Generování hesla aliasu {#generating-an-alias-password}

Než budete moci používat nástroje pro autentizaci aliasu, musíte vygenerovat heslo pro alias. Můžete to provést pomocí nástroje `generateAliasPassword` nebo prostřednictvím API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Odpověď obsahuje pole `username` (e-mail aliasu) a `password`. Použijte je jako své přihlašovací údaje aliasu.

> **Tip:** Můžete se také zeptat svého AI asistenta: *"Vygeneruj heslo pro alias user@example.com na doméně example.com"* – ten zavolá nástroj `generateAliasPassword` a vrátí přihlašovací údaje.

Níže uvedená tabulka shrnuje, jakou metodu autentizace vyžaduje každá skupina nástrojů:

| Skupina nástrojů | Metoda autentizace | Přihlašovací údaje |
|-----------|-------------|-------------|
| Účet | API klíč **nebo** autentizace aliasu | Buď jedno, nebo druhé |
| Domény, aliasy, členové domény, pozvánky, catch-all hesla | API klíč | `FORWARD_EMAIL_API_KEY` |
| Odchozí e-maily (seznam, získat, smazat, limit) | API klíč | `FORWARD_EMAIL_API_KEY` |
| Odeslat e-mail | API klíč **nebo** autentizace aliasu | Buď jedno, nebo druhé |
| Zprávy (IMAP) | Autentizace aliasu | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Složky (IMAP) | Autentizace aliasu | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakty (CardDAV) | Autentizace aliasu | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendáře (CalDAV) | Autentizace aliasu | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Události kalendáře (CalDAV) | Autentizace aliasu | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve skripty (rozsah domény) | API klíč | `FORWARD_EMAIL_API_KEY` |
| Sieve skripty (rozsah aliasu) | Autentizace aliasu | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logy | API klíč | `FORWARD_EMAIL_API_KEY` |
| Šifrování | Žádné | Nejsou potřeba žádné přihlašovací údaje |


## Všech 68 nástrojů {#all-68-tools}

Každý nástroj se přímo mapuje na [Forward Email API](/email-api) endpoint. Parametry používají stejné názvy jako v dokumentaci API. Metoda autentizace je uvedena v záhlaví každé sekce.

### Účet (API klíč nebo autentizace aliasu) {#account-api-key-or-alias-auth}

S autentizací API klíčem tyto nástroje vracejí informace o vašem uživatelském účtu. S autentizací aliasem vracejí informace o aliasu/poštovní schránce včetně kvóty úložiště a nastavení.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Získání informací o vašem účtu |
| `updateAccount` | `PUT /v1/account` | Aktualizace nastavení vašeho účtu |

### Domény (API klíč) {#domains-api-key}

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Seznam všech vašich domén |
| `createDomain` | `POST /v1/domains` | Přidání nové domény |
| `getDomain` | `GET /v1/domains/:domain_id` | Získání podrobností o doméně |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Aktualizace nastavení domény |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Odebrání domény |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Ověření DNS záznamů |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Ověření konfigurace SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Test připojení k vlastnímu S3 úložišti |

### Aliasy (API klíč) {#aliases-api-key}

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Seznam aliasů pro doménu |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Vytvoření nového aliasu |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Získání podrobností o aliasu |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Aktualizace aliasu |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Smazání aliasu |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Vygenerování hesla IMAP/SMTP pro autentizaci aliasu |

### E-maily – odchozí SMTP (API klíč; odesílání podporuje obojí) {#emails--outbound-smtp-api-key-send-supports-both}

| Nástroj | API Endpoint | Autentizace | Popis |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API klíč nebo autentizace aliasu | Odeslání e-mailu přes SMTP |
| `listEmails` | `GET /v1/emails` | API klíč | Seznam odchozích e-mailů |
| `getEmail` | `GET /v1/emails/:id` | API klíč | Získání podrobností a stavu e-mailu |
| `deleteEmail` | `DELETE /v1/emails/:id` | API klíč | Smazání e-mailu ve frontě |
| `getEmailLimit` | `GET /v1/emails/limit` | API klíč | Kontrola vašeho limitu odesílání |

Nástroj `sendEmail` přijímá `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` a `attachments`. To je stejné jako endpoint `POST /v1/emails`.

### Zprávy – IMAP (autentizace aliasu) {#messages--imap-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Seznam a vyhledávání zpráv v poštovní schránce |
| `createMessage` | `POST /v1/messages` | Vytvoření konceptu nebo nahrání zprávy |
| `getMessage` | `GET /v1/messages/:id` | Získání zprávy podle ID |
| `updateMessage` | `PUT /v1/messages/:id` | Aktualizace příznaků (přečteno, označeno hvězdičkou atd.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Smazání zprávy |

Nástroj `listMessages` podporuje více než 15 parametrů vyhledávání včetně `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` a `has_attachment`. Úplný seznam naleznete v [dokumentaci API](/email-api).

### Složky – IMAP (autentizace aliasu) {#folders--imap-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Seznam všech složek poštovní schránky |
| `createFolder` | `POST /v1/folders` | Vytvoření nové složky |
| `getFolder` | `GET /v1/folders/:id` | Získání podrobností o složce |
| `updateFolder` | `PUT /v1/folders/:id` | Přejmenování složky |
| `deleteFolder` | `DELETE /v1/folders/:id` | Smazání složky |

### Kontakty – CardDAV (autentizace aliasu) {#contacts--carddav-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Seznam všech kontaktů |
| `createContact` | `POST /v1/contacts` | Vytvoření nového kontaktu |
| `getContact` | `GET /v1/contacts/:id` | Získání podrobností o kontaktu |
| `updateContact` | `PUT /v1/contacts/:id` | Aktualizace kontaktu |
| `deleteContact` | `DELETE /v1/contacts/:id` | Smazání kontaktu |

### Kalendáře – CalDAV (autentizace aliasu) {#calendars--caldav-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Seznam všech kalendářů |
| `createCalendar` | `POST /v1/calendars` | Vytvoření nového kalendáře |
| `getCalendar` | `GET /v1/calendars/:id` | Získání podrobností o kalendáři |
| `updateCalendar` | `PUT /v1/calendars/:id` | Aktualizace kalendáře |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Smazání kalendáře |

### Události kalendáře – CalDAV (autentizace aliasu) {#calendar-events--caldav-alias-auth}

> **Vyžaduje přihlašovací údaje aliasu.** Předejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Seznam všech událostí |
| `createCalendarEvent` | `POST /v1/calendar-events` | Vytvoření nové události |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Získání podrobností o události |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Aktualizace události |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Smazání události |

### Sieve skripty (API klíč) {#sieve-scripts-api-key}

Tyto nástroje používají cesty s rozsahem domény a autentizují se pomocí vašeho API klíče.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Seznam skriptů pro alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Vytvoření nového skriptu |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Získání podrobností o skriptu |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Aktualizace skriptu |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Smazání skriptu |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktivace skriptu |

### Sieve skripty (autentizace aliasu) {#sieve-scripts-alias-auth}

Tyto nástroje používají autentizaci na úrovni aliasu. Užitečné pro automatizaci na úrovni aliasu bez potřeby API klíče.

> **Vyžaduje přihlašovací údaje aliasu.** Předejte `alias_username` a `alias_password` nebo nastavte proměnné prostředí `FORWARD_EMAIL_ALIAS_USER` a `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Seznam skriptů |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Vytvoření skriptu |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Získání podrobností o skriptu |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Aktualizace skriptu |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Smazání skriptu |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktivace skriptu |

### Členové domény a pozvánky (API klíč) {#domain-members-and-invites-api-key}

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Změna role člena |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Odebrání člena |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Přijetí čekající pozvánky |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Pozvání někoho do domény |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Zrušení pozvánky |

### Catch-All hesla (API klíč) {#catch-all-passwords-api-key}

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Seznam catch-all hesel |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Vytvoření catch-all hesla |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Smazání catch-all hesla |

### Logy (API klíč) {#logs-api-key}

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Stáhnout logy doručování e-mailů |

### Šifrování (bez autentizace) {#encrypt-no-auth}

| Nástroj | API Endpoint | Popis |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Šifrování DNS TXT záznamu |

Tento nástroj nevyžaduje autentizaci. Šifruje přesměrovací záznamy jako `forward-email=user@example.com` pro použití v DNS TXT záznamech.


## 20 reálných případů použití {#20-real-world-use-cases}

Zde jsou praktické způsoby, jak používat MCP server s vaším AI asistentem:

### 1. Třídění e-mailů {#email-triage}

Požádejte svou AI, aby prohledala vaši doručenou poštu a shrnula nepřečtené zprávy. Může označit naléhavé e-maily, kategorizovat je podle odesílatele a navrhnout odpovědi – vše prostřednictvím přirozeného jazyka. *(Vyžaduje přihlašovací údaje aliasu pro přístup k doručené poště.)*

### 2. Automatizace nastavení domény {#domain-setup-automation}

Nastavujete novou doménu? Požádejte AI, aby vytvořila doménu, přidala vaše aliasy, ověřila DNS záznamy a otestovala konfiguraci SMTP. To, co normálně trvá 10 minut klikání v panelech, se stane jednou konverzací.

### 3. Hromadná správa aliasů {#bulk-alias-management}

Potřebujete vytvořit 20 aliasů pro nový projekt? Popište, co potřebujete, a nechte AI, aby se postarala o opakovanou práci. Může vytvořit aliasy, nastavit pravidla přesměrování a vygenerovat hesla najednou.

### 4. Monitorování e-mailových kampaní {#email-campaign-monitoring}

Požádejte svou AI, aby zkontrolovala limity odesílání, vypsala nedávné odchozí e-maily a nahlásila stav doručení. Užitečné pro monitorování stavu transakčních e-mailů.

### 5. Synchronizace a čištění kontaktů {#contact-sync-and-cleanup}

Použijte nástroje CardDAV k vypsání všech kontaktů, nalezení duplicit, aktualizaci zastaralých informací nebo hromadnému vytvoření kontaktů z tabulky, kterou vložíte do chatu. *(Vyžaduje přihlašovací údaje aliasu.)*

### 6. Správa kalendáře {#calendar-management}

Vytvářejte kalendáře, přidávejte události, aktualizujte časy schůzek a mažte zrušené události – vše prostřednictvím konverzace. Nástroje CalDAV podporují plné CRUD operace s kalendáři i událostmi. *(Vyžaduje přihlašovací údaje aliasu.)*

### 7. Automatizace Sieve skriptů {#sieve-script-automation}

Sieve skripty jsou výkonné, ale jejich syntaxe je záhadná. Požádejte svou AI, aby pro vás napsala Sieve skripty: "Filtruj všechny e-maily z billing@example.com do složky Fakturace" se stane funkčním skriptem, aniž byste se dotkli specifikace RFC 5228.

### 8. Onboarding týmu {#team-onboarding}

Když se připojí nový člen týmu, požádejte AI, aby vytvořila jeho alias, vygenerovala heslo, poslala mu uvítací e-mail s jeho přihlašovacími údaji a přidala ho jako člena domény. Jeden dotaz, čtyři volání API.

### 9. Bezpečnostní audit {#security-auditing}

Požádejte svou AI, aby vypsala všechny domény, zkontrolovala stav ověření DNS, zkontrolovala konfigurace aliasů a identifikovala všechny domény s neověřenými záznamy. Rychlá bezpečnostní kontrola v přirozeném jazyce.

### 10. Nastavení přesměrování e-mailů {#email-forwarding-setup}

Nastavujete přesměrování e-mailů pro novou doménu? Požádejte AI, aby vytvořila doménu, přidala přesměrovací aliasy, zašifrovala DNS záznamy a ověřila, zda je vše správně nakonfigurováno.

### 11. Vyhledávání a analýza doručené pošty {#inbox-search-and-analysis}

Použijte nástroje pro vyhledávání zpráv k nalezení konkrétních e-mailů: "Najdi všechny nepřečtené e-maily od john@example.com za posledních 30 dní, které mají přílohy." Více než 15 parametrů vyhledávání to činí velmi výkonným. *(Vyžaduje přihlašovací údaje aliasu.)*

### 12. Organizace složek {#folder-organization}

Požádejte svou AI, aby vytvořila strukturu složek pro nový projekt, přesunula zprávy mezi složkami nebo vyčistila staré složky, které již nepotřebujete. *(Vyžaduje přihlašovací údaje aliasu.)*

### 13. Rotace hesel {#password-rotation}

Generujte nová hesla aliasů podle plánu. Požádejte svou AI, aby vygenerovala nové heslo pro každý alias a nahlásila nové přihlašovací údaje.

### 14. Šifrování DNS záznamů {#dns-record-encryption}

Zašifrujte své přesměrovací záznamy před jejich přidáním do DNS. Nástroj `encryptRecord` to zvládne bez autentizace – užitečné pro rychlé jednorázové šifrování.

### 15. Analýza logů doručení {#delivery-log-analysis}

Stáhněte si logy doručení e-mailů a požádejte AI, aby analyzovala míru nedoručení, identifikovala problematické příjemce nebo sledovala časy doručení.

### 16. Správa více domén {#multi-domain-management}

Pokud spravujete více domén, požádejte AI, aby vám poskytla zprávu o stavu: které domény jsou ověřené, které mají problémy, kolik aliasů má každá a jak vypadají limity odesílání.

### 17. Konfigurace Catch-All {#catch-all-configuration}

Nastavte catch-all hesla pro domény, které potřebují přijímat e-maily na jakoukoli adresu. AI může pro vás tato hesla vytvářet, vypisovat a spravovat.

### 18. Správa pozvánek do domény {#domain-invite-management}

Pozvěte členy týmu ke správě domén, zkontrolujte čekající pozvánky a vyčistěte ty, které vypršely. Užitečné pro organizace s více administrátory domén.

### 19. Testování S3 úložiště {#s3-storage-testing}

Pokud používáte vlastní S3 úložiště pro zálohy e-mailů, požádejte AI, aby otestovala připojení a ověřila, zda funguje správně.

### 20. Sestavování konceptů e-mailů {#email-draft-composition}

Vytvářejte koncepty e-mailů ve své poštovní schránce, aniž byste je odesílali. Užitečné pro přípravu e-mailů, které je třeba před odesláním zkontrolovat, nebo pro vytváření e-mailových šablon. *(Vyžaduje přihlašovací údaje aliasu.)*


## Příklady dotazů {#example-prompts}

Zde jsou dotazy, které můžete použít přímo s vaším AI asistentem:

**Odesílání e-mailu:**
> "Pošli e-mail z hello@mydomain.com na john@example.com s předmětem 'Schůzka zítra' a textem 'Ahoj Johne, platí stále schůzka ve 14:00?'"

**Správa domén:**
> "Vypiš všechny mé domény a řekni mi, které z nich mají neověřené DNS záznamy."

**Vytvoření aliasu:**
> "Vytvoř nový alias support@mydomain.com, který se přesměruje na můj osobní e-mail."

**Vyhledávání v doručené poště (vyžaduje přihlašovací údaje aliasu):**
> "Najdi všechny nepřečtené e-maily z minulého týdne, které zmiňují 'fakturu'."

**Kalendář (vyžaduje přihlašovací údaje aliasu):**
> "Vytvoř kalendář s názvem 'Práce' a přidej schůzku na zítra ve 14:00 s názvem 'Týmová porada'."

**Sieve skripty:**
> "Napiš Sieve skript pro info@mydomain.com, který automaticky odpoví na e-maily s textem 'Děkujeme za zprávu, ozveme se vám do 24 hodin'."

**Hromadné operace:**
> "Vytvoř aliasy pro sales@, support@, billing@ a info@ na mydomain.com, všechny přesměrované na team@mydomain.com."

**Bezpečnostní kontrola:**
> "Zkontroluj stav ověření DNS a SMTP pro všechny mé domény a řekni mi, jestli něco potřebuje pozornost."

**Vygenerování hesla aliasu:**
> "Vygeneruj heslo pro alias user@example.com, abych mohl přistupovat ke své doručené poště."


## Proměnné prostředí {#environment-variables}

| Proměnná | Povinná | Výchozí | Popis |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Ano | — | Váš API klíč Forward Email (používá se jako uživatelské jméno pro Basic autentizaci pro endpointy s API klíčem) |
| `FORWARD_EMAIL_ALIAS_USER` | Ne | — | E-mailová adresa aliasu pro endpointy poštovní schránky (např. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Ne | — | Vygenerované heslo aliasu pro endpointy poštovní schránky |
| `FORWARD_EMAIL_API_URL` | Ne | `https://api.forwardemail.net` | Základní URL API (pro self-hosted nebo testování) |


## Zabezpečení {#security}

MCP server běží lokálně na vašem počítači. Zde je popsáno, jak funguje zabezpečení:

*   **Vaše přihlašovací údaje zůstávají lokální.** Váš API klíč i přihlašovací údaje aliasu jsou načítány z proměnných prostředí a používány k autentizaci API požadavků prostřednictvím HTTP Basic autentizace. Nikdy nejsou odeslány AI modelu.
*   **stdio transport.** Server komunikuje s AI klientem přes stdin/stdout. Nejsou otevřeny žádné síťové porty.
*   **Žádné ukládání dat.** Server je bezstavový. Neukládá do mezipaměti, neloguje ani neukládá žádná z vašich e-mailových dat.
*   **Open source.** Celý kód je na [GitHubu](https://github.com/forwardemail/mcp-server). Můžete zkontrolovat každý řádek.


## Programové použití {#programmatic-usage}

Server můžete také použít jako knihovnu:

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

Forward Email MCP Server je [open-source na GitHubu](https://github.com/forwardemail/mcp-server) pod licencí BUSL-1.1. Věříme v transparentnost. Pokud najdete chybu nebo chcete funkci, [otevřete problém](https://github.com/forwardemail/mcp-server/issues).
