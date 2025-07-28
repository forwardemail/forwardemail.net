# API pro e-maily {#email-api}

## Obsah {#table-of-contents}

* [Knihovny](#libraries)
* [Základní URI](#base-uri)
* [Ověřování](#authentication)
* [Chyby](#errors)
* [Lokalizace](#localization)
* [Stránkování](#pagination)
* [Protokoly](#logs)
  * [Načíst protokoly](#retrieve-logs)
* [Účet](#account)
  * [Vytvořit účet](#create-account)
  * [Obnovit účet](#retrieve-account)
  * [Aktualizovat účet](#update-account)
* [Aliasové kontakty (CardDAV)](#alias-contacts-carddav)
  * [Seznam kontaktů](#list-contacts)
  * [Vytvořit kontakt](#create-contact)
  * [Načíst kontakt](#retrieve-contact)
  * [Aktualizovat kontakt](#update-contact)
  * [Smazat kontakt](#delete-contact)
* [Aliasové kalendáře (CalDAV)](#alias-calendars-caldav)
  * [Seznam kalendářů](#list-calendars)
  * [Vytvořit kalendář](#create-calendar)
  * [Načíst kalendář](#retrieve-calendar)
  * [Aktualizovat kalendář](#update-calendar)
  * [Smazat kalendář](#delete-calendar)
* [Aliasové zprávy (IMAP/POP3)](#alias-messages-imappop3)
  * [Seznam a vyhledávání zpráv](#list-and-search-for-messages)
  * [Vytvořit zprávu](#create-message)
  * [Načíst zprávu](#retrieve-message)
  * [Aktualizační zpráva](#update-message)
  * [Smazat zprávu](#delete-message)
* [Aliasové složky (IMAP/POP3)](#alias-folders-imappop3)
  * [Seznam složek](#list-folders)
  * [Vytvořit složku](#create-folder)
  * [Načíst složku](#retrieve-folder)
  * [Aktualizovat složku](#update-folder)
  * [Smazat složku](#delete-folder)
  * [Kopírovat složku](#copy-folder)
* [Odchozí e-maily](#outbound-emails)
  * [Získat limit odchozích e-mailů SMTP](#get-outbound-smtp-email-limit)
  * [Seznam odchozích SMTP e-mailů](#list-outbound-smtp-emails)
  * [Vytvořit odchozí SMTP e-mail](#create-outbound-smtp-email)
  * [Načíst odchozí e-maily SMTP](#retrieve-outbound-smtp-email)
  * [Smazat odchozí SMTP e-maily](#delete-outbound-smtp-email)
* [Domény](#domains)
  * [Seznam domén](#list-domains)
  * [Vytvořit doménu](#create-domain)
  * [Načíst doménu](#retrieve-domain)
  * [Ověření záznamů domény](#verify-domain-records)
  * [Ověření SMTP záznamů domény](#verify-domain-smtp-records)
  * [Vypsat hesla pro celou doménu](#list-domain-wide-catch-all-passwords)
  * [Vytvořte heslo pro celou doménu](#create-domain-wide-catch-all-password)
  * [Odebrat heslo pro celou doménu](#remove-domain-wide-catch-all-password)
  * [Aktualizovat doménu](#update-domain)
  * [Smazat doménu](#delete-domain)
* [Pozvánky](#invites)
  * [Přijmout pozvánku k doméně](#accept-domain-invite)
  * [Vytvořit pozvánku do domény](#create-domain-invite)
  * [Odebrat pozvánku z domény](#remove-domain-invite)
* [Členové](#members)
  * [Aktualizovat člena domény](#update-domain-member)
  * [Odebrat člena domény](#remove-domain-member)
* [Aliasy](#aliases)
  * [Generování hesla pro alias](#generate-an-alias-password)
  * [Seznam aliasů domén](#list-domain-aliases)
  * [Vytvořit nový alias domény](#create-new-domain-alias)
  * [Načíst alias domény](#retrieve-domain-alias)
  * [Aktualizovat alias domény](#update-domain-alias)
  * [Smazat alias domény](#delete-domain-alias)
* [Šifrovat](#encrypt)
  * [Šifrovat TXT záznam](#encrypt-txt-record)

## Knihovny {#libraries}

V současné době jsme nevydali žádné API wrappery, ale plánujeme to v blízké budoucnosti. Pokud chcete být upozorněni na vydání API wrapperu pro konkrétní programovací jazyk, pošlete e-mail na adresu <api@forwardemail.net>. Mezitím můžete ve své aplikaci použít tyto doporučené knihovny HTTP požadavků nebo jednoduše použít [kučera](https://stackoverflow.com/a/27442239/3586413), jak je uvedeno v níže uvedených příkladech.

| Jazyk | Knihovna |
| ---------- | ---------------------------------------------------------------------- |
| Rubín | [Faraday](https://github.com/lostisland/faraday) |
| Krajta | [requests](https://github.com/psf/requests) |
| Jáva | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (jsme správci) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (jsme správci) |
| Jít | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Základní URI {#base-uri}

Aktuální základní cesta URI protokolu HTTP je: `BASE_URI`.

## Ověření {#authentication}

Všechny koncové body vyžadují, aby byla vaše hodnota [Klíč API](https://forwardemail.net/my-account/security) nastavena jako hodnota „uživatelské jméno“ v záhlaví [Základní autorizace](https://en.wikipedia.org/wiki/Basic_access_authentication) požadavku (s výjimkou [Aliasové kontakty](#alias-contacts), [Aliasové kalendáře](#alias-calendars) a [Aliasové poštovní schránky](#alias-mailboxes), které používají [vygenerované uživatelské jméno a heslo aliasu](/faq#do-you-support-receiving-email-with-imap)).

Nebojte se – níže jsou uvedeny příklady, pokud si nejste jisti, o co jde.

## Chyby {#errors}

Pokud dojde k nějakým chybám, tělo odpovědi požadavku API bude obsahovat podrobnou chybovou zprávu.

| Kód | Jméno |
| ---- | --------------------- |
| 200 | OK |
| 400 | Špatný požadavek |
| 401 | Neoprávněný |
| 403 | Zakázáno |
| 404 | Nenalezeno |
| 429 | Příliš mnoho požadavků |
| 500 | Interní chyba serveru |
| 501 | Není implementováno |
| 502 | Špatná brána |
| 503 | Služba není k dispozici |
| 504 | Časový limit brány |

> \[!TIP]
> Pokud obdržíte stavový kód 5xx (což by se stávat nemělo), kontaktujte nás prosím na adrese <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> a my vám okamžitě pomůžeme váš problém vyřešit.

## Lokalizace {#localization}

Naše služba je přeložena do více než 25 různých jazyků. Všechny odpovědi API jsou přeloženy do posledního zjištěného jazyka uživatele, který zadává požadavek API. Toto nastavení můžete přepsat zadáním vlastní hlavičky `Accept-Language`. Neváhejte si to vyzkoušet pomocí rozbalovací nabídky jazyků v dolní části této stránky.

## Stránkování {#pagination}

> \[!NOTE]
> Od 1. listopadu 2024 budou koncové body API pro [Seznam domén](#list-domains) a [Seznam aliasů domén](#list-domain-aliases) standardně nastavovat maximální počet výsledků na stránku (`1000`). Pokud chcete toto chování aktivovat dříve, můžete předat `?paginate=true` jako další parametr řetězce dotazu do adresy URL pro dotaz koncového bodu.

Stránkování je podporováno všemi koncovými body API, které vypisují výsledky.

Jednoduše zadejte vlastnosti řetězce dotazu `page` (a volitelně `limit`).

Vlastnost `page` by měla být číslo větší nebo rovné `1`. Pokud zadáte `limit` (také číslo), pak je minimální hodnota `10` a maximální `50` (pokud není uvedeno jinak).

| Parametry řetězce dotazu | Požadovaný | Typ | Popis |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Žádný | Číslo | Stránka s výsledky, které se mají vrátit. Pokud není zadána hodnota `page`, bude hodnota `1`. Musí se jednat o číslo větší nebo rovno `1`. |
| `limit` | Žádný | Číslo | Počet výsledků, které se mají vrátit na stránku. Výchozí hodnota je `10`, pokud není zadán. Musí se jednat o číslo větší nebo rovno `1` a menší nebo rovno `50`. |

Abychom zjistili, zda jsou k dispozici další výsledky, poskytujeme tyto hlavičky odpovědí HTTP (které můžete analyzovat a programově stránkovat):

| Záhlaví odpovědi HTTP | Příklad | Popis |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Celkový počet dostupných stránek. |
| `X-Page-Current` | `X-Page-Current: 1` | Aktuální stránka vrácených výsledků (např. na základě parametru `page` řetězce dotazu). |
| `X-Page-Size` | `X-Page-Size: 10` | Celkový počet vrácených výsledků na stránce (např. na základě parametru `limit` řetězce dotazu a skutečně vrácených výsledků). |
| `X-Item-Count` | `X-Item-Count: 30` | Celkový počet položek dostupných na všech stránkách. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Poskytujeme hlavičku HTTP odpovědi s `Link`, kterou můžete analyzovat, jak je znázorněno v příkladu. Jedná se o [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (např. nebudou poskytnuty všechny hodnoty, pokud nejsou relevantní nebo dostupné, např. `"next"` nebude poskytnuta, pokud neexistuje jiná stránka). |

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Protokoly {#logs}

### Načíst protokoly {#retrieve-logs}

Naše API vám programově umožňuje stahovat protokoly pro váš účet. Odesláním požadavku do tohoto koncového bodu zpracujete všechny protokoly pro váš účet a po dokončení vám je odešlete e-mailem jako přílohu (komprimovaný soubor tabulky [Gzip](https://en.wikipedia.org/wiki/Gzip) [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)).

To vám umožňuje vytvářet úlohy na pozadí s [Cron úloha](https://en.wikipedia.org/wiki/Cron) nebo pomocí našeho [Software pro plánování úloh Node.js Bree](https://github.com/breejs/bree) k přijímání protokolů, kdykoli budete chtít. Upozorňujeme, že tento koncový bod je omezen na `10` požadavků za den.

Příloha je malým písmenem ve tvaru `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` a samotný e-mail obsahuje stručné shrnutí načtených protokolů. Protokoly si také můžete kdykoli stáhnout z adresy [Můj účet → Protokoly](/my-account/logs).

> `GET /v1/logs/download`

| Parametry řetězce dotazu | Požadovaný | Typ | Popis |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Žádný | Řetězec (FQDN) | Filtrovat protokoly podle plně kvalifikované domény („FQDN“). Pokud tuto doménu neposkytnete, budou načteny všechny protokoly ze všech domén. |
| `q` | Žádný | Řetězec | Vyhledávání protokolů podle e-mailu, domény, aliasu, IP adresy nebo data (formát `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` nebo `M.D.YY`). |
| `bounce_category` | Žádný | Řetězec | Vyhledávání protokolů podle konkrétní kategorie nedoručených zpráv (např. `blocklist`). |
| `response_code` | Žádný | Číslo | Vyhledávání protokolů podle konkrétního kódu chybové odpovědi (např. `421` nebo `550`). |

> Příklad požadavku:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Příklad úlohy Cron (každý den o půlnoci):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Všimněte si, že k ověření syntaxe výrazu vaší cron úlohy můžete použít služby jako například [Crontab.guru](https://crontab.guru/).

> Příklad úlohy Cron (každý den o půlnoci **a se záznamy z předchozího dne**):

Pro MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Pro Linux a Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Účet {#account}

### Vytvořit účet {#create-account}

> `POST /v1/account`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ano | Řetězec (e-mail) | E-mailová adresa |
| `password` | Ano | Řetězec | Heslo |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Načíst účet {#retrieve-account}

> `GET /v1/account`

> Příklad požadavku:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Aktualizovat účet {#update-account}

> `PUT /v1/account`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Žádný | Řetězec (e-mail) | E-mailová adresa |
| `given_name` | Žádný | Řetězec | Křestní jméno |
| `family_name` | Žádný | Řetězec | Příjmení |
| `avatar_url` | Žádný | Řetězec (URL) | Odkaz na obrázek avatara |

> Příklad požadavku:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Alias kontaktů (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Na rozdíl od jiných koncových bodů API tyto vyžadují jako záhlaví základní autorizace hodnotu [Ověřování](#authentication) „username“ shodující se s aliasem uživatelského jména a hodnotu „password“ shodující se s aliasem vygenerovaným heslem.

> \[!WARNING]
> Tato sekce koncových bodů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím používejte klienta IMAP z rozbalovací nabídky „Aplikace“ v navigaci na našich webových stránkách.

### Seznam kontaktů {#list-contacts}

> `GET /v1/contacts`

**Již brzy**

### Vytvořit kontakt {#create-contact}

> `POST /v1/contacts`

**Již brzy**

### Načíst kontakt {#retrieve-contact}

> `GET /v1/contacts/:id`

**Již brzy**

### Aktualizovat kontakt {#update-contact}

> `PUT /v1/contacts/:id`

**Již brzy**

### Smazat kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Již brzy**

## Alias kalendáře (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Na rozdíl od jiných koncových bodů API tyto vyžadují jako záhlaví základní autorizace hodnotu [Ověřování](#authentication) „username“ shodující se s aliasem uživatelského jména a hodnotu „password“ shodující se s aliasem vygenerovaným heslem.

> \[!WARNING]
> Tato sekce koncových bodů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím používejte klienta IMAP z rozbalovací nabídky „Aplikace“ v navigaci na našich webových stránkách.

### Seznam kalendářů {#list-calendars}

> `GET /v1/calendars`

**Již brzy**

### Vytvořit kalendář {#create-calendar}

> `POST /v1/calendars`

**Již brzy**

### Načíst kalendář {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Již brzy**

### Aktualizovat kalendář {#update-calendar}

> `PUT /v1/calendars/:id`

**Již brzy**

### Smazat kalendář {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Již brzy**

## Alias zprávy (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Na rozdíl od jiných koncových bodů API tyto vyžadují jako záhlaví základní autorizace hodnotu [Ověřování](#authentication) „username“ shodující se s aliasem uživatelského jména a hodnotu „password“ shodující se s aliasem vygenerovaným heslem.

> \[!WARNING]
> Tato sekce koncových bodů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím používejte klienta IMAP z rozbalovací nabídky „Aplikace“ v navigaci na našich webových stránkách.

Ujistěte se prosím, že jste postupovali podle pokynů k nastavení vaší domény.

Tyto pokyny naleznete v sekci Často kladených otázek [Podporujete příjem e-mailů přes IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Seznam a vyhledávání zpráv {#list-and-search-for-messages}

> `GET /v1/messages`

**Již brzy**

### Vytvořit zprávu {#create-message}

> \[!NOTE]
> Tímto se **NE** e-mail odešle – zpráva se pouze přidá do složky vaší poštovní schránky (např. je to podobné jako příkaz IMAP `APPEND`). Pokud chcete odeslat e-mail, podívejte se na [Vytvořit odchozí SMTP e-mail](#create-outbound-smtp-email) níže. Po vytvoření odchozího SMTP e-mailu můžete jeho kopii pomocí tohoto koncového bodu připojit k poštovní schránce vašeho aliasu pro účely uložení.

> `POST /v1/messages`

**Již brzy**

### Načíst zprávu {#retrieve-message}

> `GET /v1/messages/:id`

**Již brzy**

### Aktualizační zpráva {#update-message}

> `PUT /v1/messages/:id`

**Již brzy**

### Smazat zprávu {#delete-message}

> `DELETE /v1/messages:id`

**Již brzy**

## Aliasy složek (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Koncové body složek s cestou <code>/v1/folders/:path</code> jako koncovým bodem jsou zaměnitelné s ID složky <code>:id</code>. To znamená, že na složku se můžete odkazovat buď pomocí její hodnoty <code>path</code>, nebo <code>id</code>.

> \[!WARNING]
> Tato sekce koncových bodů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím používejte klienta IMAP z rozbalovací nabídky „Aplikace“ v navigaci na našich webových stránkách.

### Seznam složek {#list-folders}

> `GET /v1/folders`

**Již brzy**

### Vytvořit složku {#create-folder}

> `POST /v1/folders`

**Již brzy**

### Načíst složku {#retrieve-folder}

> `GET /v1/folders/:id`

**Již brzy**

### Aktualizovat složku {#update-folder}

> `PUT /v1/folders/:id`

**Již brzy**

### Smazat složku {#delete-folder}

> `DELETE /v1/folders/:id`

**Již brzy**

### Kopírovat složku {#copy-folder}

> `POST /v1/folders/:id/copy`

**Již brzy**

## Odchozí e-maily {#outbound-emails}

Ujistěte se prosím, že jste postupovali podle pokynů k nastavení vaší domény.

Tyto pokyny naleznete na adrese [Můj účet → Domény → Nastavení → Konfigurace odchozího SMTP](/my-account/domains). Musíte zajistit nastavení DKIM, Return-Path a DMARC pro odesílání odchozích SMTP zpráv s vaší doménou.

### Získat limit odchozích e-mailů SMTP {#get-outbound-smtp-email-limit}

Toto je jednoduchý koncový bod, který vrací objekt JSON obsahující hodnoty `count` a `limit` pro počet denních odchozích zpráv SMTP pro každý účet.

> `GET /v1/emails/limit`

> Příklad požadavku:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Seznam odchozích e-mailů SMTP {#list-outbound-smtp-emails}

Upozorňujeme, že tento koncový bod nevrací hodnoty vlastností pro `message`, `headers` ani `rejectedErrors` e-mailu.

Chcete-li vrátit tyto vlastnosti a jejich hodnoty, použijte koncový bod [Načíst e-mail](#retrieve-email) s ID e-mailu.

> `GET /v1/emails`

| Parametry řetězce dotazu | Požadovaný | Typ | Popis |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Žádný | Řetězec (podporováno s RegExp) | Vyhledávání e-mailů podle metadat |
| `domain` | Žádný | Řetězec (podporováno s RegExp) | Vyhledávání e-mailů podle názvu domény |
| `sort` | Žádný | Řetězec | Seřadit podle konkrétního pole (předpona s jednou pomlčkou `-` se seřadí v opačném směru než toto pole). Pokud není nastaveno, výchozí hodnota je `created_at`. |
| `page` | Žádný | Číslo | Více informací naleznete na [Pagination](#pagination) |
| `limit` | Žádný | Číslo | Více informací naleznete na [Pagination](#pagination) |

> Příklad požadavku:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Vytvořit odchozí SMTP e-mail {#create-outbound-smtp-email}

Naše API pro vytváření e-mailů je inspirováno a využívá konfiguraci možností zpráv v Nodemaileru. Pro všechny níže uvedené parametry těla zprávy se prosím řiďte parametrem [Konfigurace zpráv Nodemaileru](https://nodemailer.com/message/).

Upozorňujeme, že s výjimkou `envelope` a `dkim` (protože ty nastavujeme automaticky) podporujeme všechny možnosti Nodemaileru. Z bezpečnostních důvodů automaticky nastavujeme možnosti `disableFileAccess` a `disableUrlAccess` na `true`.

Buď byste měli předat jednu možnost `raw` s vaším nezpracovaným celým e-mailem včetně záhlaví, **nebo** níže předat jednotlivé možnosti parametrů těla.

Tento koncový bod API automaticky zakóduje emoji, pokud se nacházejí v záhlavích (např. předmět `Subject: 🤓 Hello` se automaticky převede na `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Naším cílem bylo vytvořit e-mailové API, které je extrémně uživatelsky přívětivé a odolné vůči falešným nálepkám.

> `POST /v1/emails`

| Parametr těla | Požadovaný | Typ | Popis |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Žádný | Řetězec (e-mail) | E-mailová adresa odesílatele (musí existovat jako alias domény). |
| `to` | Žádný | Řetězec nebo pole | Seznam oddělený čárkami nebo pole příjemců pro záhlaví „Komu“. |
| `cc` | Žádný | Řetězec nebo pole | Seznam oddělený čárkami nebo pole příjemců pro záhlaví „Cc“. |
| `bcc` | Žádný | Řetězec nebo pole | Seznam oddělený čárkami nebo pole příjemců pro záhlaví „Skrytá kopie“. |
| `subject` | Žádný | Řetězec | Předmět e-mailu. |
| `text` | Žádný | Řetězec nebo vyrovnávací paměť | Verze zprávy v prostém textu. |
| `html` | Žádný | Řetězec nebo vyrovnávací paměť | HTML verze zprávy. |
| `attachments` | Žádný | Pole | Pole objektů příloh (viz [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Žádný | Řetězec | E-mailová adresa pro záhlaví „Odesílatel“ (viz [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Žádný | Řetězec | E-mailová adresa pro záhlaví „Odpovědět na“. |
| `inReplyTo` | Žádný | Řetězec | ID zprávy, na kterou je zpráva odpovědí. |
| `references` | Žádný | Řetězec nebo pole | Seznam oddělený mezerami nebo pole ID zpráv. |
| `attachDataUrls` | Žádný | Booleovská hodnota | Pokud `true`, pak převede obrázky `data:` v HTML obsahu zprávy na vložené přílohy. |
| `watchHtml` | Žádný | Řetězec | HTML verze zprávy specifická pro Apple Watch ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), nejnovější hodinky toto nastavení nevyžadují). |
| `amp` | Žádný | Řetězec | HTML verze zprávy specifická pro AMP4EMAIL (viz [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Žádný | Objekt | Událost iCalendar, která se má použít jako alternativní obsah zprávy (viz [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Žádný | Pole | Pole alternativního obsahu zprávy (viz [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Žádný | Řetězec | Kódování textu a HTML řetězců (výchozí nastavení je `"utf-8"`, ale podporuje i kódování `"hex"` a `"base64"`). |
| `raw` | Žádný | Řetězec nebo vyrovnávací paměť | Vlastní generovaná zpráva ve formátu RFC822, která se má použít (namísto zprávy generované Nodemailerem – viz [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Žádný | Řetězec | Kódování, které je vynuceno použít pro textové hodnoty (buď `"quoted-printable"` nebo `"base64"`). Výchozí hodnota je nejbližší detekovaná hodnota (pro ASCII použijte `"quoted-printable"`). |
| `priority` | Žádný | Řetězec | Úroveň priority pro e-mail (může být buď `"high"`, `"normal"` (výchozí) nebo `"low"`). Upozorňujeme, že hodnota `"normal"` nenastavuje záhlaví priority (toto je výchozí chování). Pokud je nastavena hodnota `"high"` nebo `"low"`, pak záhlaví `X-Priority`, `X-MSMail-Priority` a `Importance` mají hodnotu [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Žádný | Objekt nebo pole | Objekt nebo pole dalších polí záhlaví, která mají být nastavena (viz [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Žádný | Řetězec | Volitelná hodnota Message-ID pro záhlaví „Message-ID“ (pokud není nastavena, bude automaticky vytvořena výchozí hodnota – hodnota by měla být [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Žádný | Řetězec nebo datum | Volitelná hodnota data, která bude použita, pokud po analýze chybí záhlaví data. V opačném případě bude použit aktuální řetězec UTC, pokud není nastaveno. Záhlaví data nesmí být více než 30 dní před aktuálním časem. |
| `list` | Žádný | Objekt | Volitelný objekt záhlaví `List-*` (viz [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Načíst odchozí e-maily SMTP {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Příklad požadavku:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Smazat odchozí e-maily SMTP {#delete-outbound-smtp-email}

Smazání e-mailu nastaví stav na `"rejected"` (a následně jej nezpracuje ve frontě) pouze tehdy, když je aktuální stav `"pending"`, `"queued"` nebo `"deferred"`. E-maily můžeme automaticky smazat po 30 dnech od jejich vytvoření a/nebo odeslání – proto byste si měli uchovávat kopii odchozích SMTP e-mailů ve svém klientovi, databázi nebo aplikaci. V případě potřeby můžete ve své databázi odkazovat na hodnotu našeho ID e-mailu – tato hodnota je vrácena z koncových bodů [Vytvořit e-mail](#create-email) i [Načíst e-mail](#retrieve-email).

> `DELETE /v1/emails/:id`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domény {#domains}

> \[!TIP]
> Koncové body domény s názvem domény <code>/v1/domains/:domain_name</code> jako koncovým bodem jsou zaměnitelné s ID domény <code>:domain_id</code>. To znamená, že na doménu se můžete odkazovat buď pomocí její hodnoty <code>name</code>, nebo <code>id</code>.

### Seznam domén {#list-domains}

> \[!NOTE]
> Od 1. listopadu 2024 budou koncové body API pro [Seznam domén](#list-domains) a [Seznam aliasů domén](#list-domain-aliases) standardně nastavovat maximální počet výsledků na stránku `1000`. Pokud chcete toto chování aktivovat dříve, můžete předat `?paginate=true` jako další parametr řetězce dotazu do adresy URL pro dotaz koncového bodu. Další informace naleznete v [Stránkování](#pagination).

> `GET /v1/domains`

| Parametry řetězce dotazu | Požadovaný | Typ | Popis |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Žádný | Řetězec (podporováno s RegExp) | Hledat domény podle názvu |
| `name` | Žádný | Řetězec (podporováno s RegExp) | Hledat domény podle názvu |
| `sort` | Žádný | Řetězec | Seřadit podle konkrétního pole (předpona s jednou pomlčkou `-` se seřadí v opačném směru než toto pole). Pokud není nastaveno, výchozí hodnota je `created_at`. |
| `page` | Žádný | Číslo | Více informací naleznete na [Pagination](#pagination) |
| `limit` | Žádný | Číslo | Více informací naleznete na [Pagination](#pagination) |

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Vytvořit doménu {#create-domain}

> `POST /v1/domains`

| Parametr těla | Požadovaný | Typ | Popis |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ano | Řetězec (FQDN nebo IP adresa) | Plně kvalifikovaný název domény („FQDN“) nebo IP adresa |
| `team_domain` | Žádný | Řetězec (ID domény nebo název domény; FQDN) | Automaticky přiřadit tuto doménu stejnému týmu z jiné domény. To znamená, že všichni členové z této domény budou přiřazeni jako členové týmu a `plan` bude automaticky také nastaven na `team`. V případě potřeby můžete nastavit na `"none"`, abyste tuto funkci explicitně zakázali, ale není to nutné. |
| `plan` | Žádný | Řetězec (vyčíslitelný) | Typ tarifu (musí být `"free"`, `"enhanced_protection"` nebo `"team"`, výchozí nastavení je `"free"` nebo aktuální placený tarif uživatele, pokud jej má) |
| `catchall` | Žádný | Řetězec (e-mailové adresy s oddělenými čísly) nebo booleovská hodnota | Vytvořte výchozí alias pro všechny adresy, výchozí hodnota je `true` (pokud je `true`, použije se jako příjemce e-mailová adresa uživatele API, a pokud je `false`, alias pro všechny adresy se nevytvoří). Pokud je předán řetězec, jedná se o seznam e-mailových adres, které se mají použít jako příjemci (oddělené zalomením řádku, mezerou a/nebo čárkou). |
| `has_adult_content_protection` | Žádný | Booleovská hodnota | Zda povolit ochranu proti obsahu pro dospělé pomocí skeneru spamu v této doméně |
| `has_phishing_protection` | Žádný | Booleovská hodnota | Zda povolit v této doméně ochranu proti phishingu pomocí skeneru spamu |
| `has_executable_protection` | Žádný | Booleovská hodnota | Zda povolit ochranu spustitelného souboru Spam Scanner v této doméně |
| `has_virus_protection` | Žádný | Booleovská hodnota | Zda povolit antivirovou ochranu Spam Scanner v této doméně |
| `has_recipient_verification` | Žádný | Booleovská hodnota | Globální výchozí nastavení domény pro určení, zda se má od příjemců aliasů vyžadovat kliknutí na odkaz pro ověření e-mailu, aby od nich mohly odeslat e-maily. |
| `ignore_mx_check` | Žádný | Booleovská hodnota | Zda ignorovat kontrolu záznamů MX v doméně pro ověření. Toto je určeno zejména pro uživatele, kteří mají pokročilá pravidla konfigurace výměny MX a potřebují si zachovat stávající výměnu MX a přesměrovat ji na naši. |
| `retention_days` | Žádný | Číslo | Celé číslo mezi `0` a `30`, které odpovídá počtu dnů uchovávání odchozích e-mailů SMTP po úspěšném doručení nebo trvalé chybě. Výchozí hodnota je `0`, což znamená, že odchozí e-maily SMTP jsou z bezpečnostních důvodů okamžitě odstraněny a redigovány. |
| `bounce_webhook` | Žádný | Řetězec (URL) nebo booleovská hodnota (false) | URL adresa webhooku `http://` nebo `https://` dle vašeho výběru, na kterou se mají odesílat webhooky s nedoručitelnou e-mailovou zprávou. Na tuto URL adresu odešleme požadavek `POST` s informacemi o selháních odchozího SMTP (např. měkká nebo tvrdá selhání – abyste mohli spravovat své odběratele a programově spravovat odchozí e-maily). |
| `max_quota_per_alias` | Žádný | Řetězec | Maximální kvóta úložiště pro aliasy na tomto doménovém názvu. Zadejte hodnotu, například „1 GB“, kterou bude analyzovat [bytes](https://github.com/visionmedia/bytes.js). |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Načíst doménu {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Ověření záznamů domény {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Ověření záznamů SMTP domény {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Zobrazit seznam hesel pro celou doménu {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Vytvořit heslo pro celou doménu {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Žádný | Řetězec | Vaše vlastní nové heslo, které se použije jako univerzální heslo pro celou doménu. Upozorňujeme, že pokud chcete získat náhodně vygenerované a silné heslo, můžete toto pole nechat prázdné nebo jej v těle požadavku API zcela vynechat. |
| `description` | Žádný | Řetězec | Popis pouze pro účely organizace. |

> Příklad požadavku:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Odebrat heslo pro celou doménu {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Aktualizovat doménu {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parametr těla | Požadovaný | Typ | Popis |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Žádný | Řetězec nebo číslo | Vlastní port pro konfiguraci pro přesměrování SMTP (výchozí je `"25"`) |
| `has_adult_content_protection` | Žádný | Booleovská hodnota | Zda povolit ochranu proti obsahu pro dospělé pomocí skeneru spamu v této doméně |
| `has_phishing_protection` | Žádný | Booleovská hodnota | Zda povolit v této doméně ochranu proti phishingu pomocí skeneru spamu |
| `has_executable_protection` | Žádný | Booleovská hodnota | Zda povolit ochranu spustitelného souboru Spam Scanner v této doméně |
| `has_virus_protection` | Žádný | Booleovská hodnota | Zda povolit antivirovou ochranu Spam Scanner v této doméně |
| `has_recipient_verification` | Žádný | Booleovská hodnota | Globální výchozí nastavení domény pro určení, zda se má od příjemců aliasů vyžadovat kliknutí na odkaz pro ověření e-mailu, aby od nich mohly odeslat e-maily. |
| `ignore_mx_check` | Žádný | Booleovská hodnota | Zda ignorovat kontrolu záznamů MX v doméně pro ověření. Toto je určeno zejména pro uživatele, kteří mají pokročilá pravidla konfigurace výměny MX a potřebují si zachovat stávající výměnu MX a přesměrovat ji na naši. |
| `retention_days` | Žádný | Číslo | Celé číslo mezi `0` a `30`, které odpovídá počtu dnů uchovávání odchozích e-mailů SMTP po úspěšném doručení nebo trvalé chybě. Výchozí hodnota je `0`, což znamená, že odchozí e-maily SMTP jsou z bezpečnostních důvodů okamžitě odstraněny a redigovány. |
| `bounce_webhook` | Žádný | Řetězec (URL) nebo booleovská hodnota (false) | URL adresa webhooku `http://` nebo `https://` dle vašeho výběru, na kterou se mají odesílat webhooky s nedoručitelnou e-mailovou zprávou. Na tuto URL adresu odešleme požadavek `POST` s informacemi o selháních odchozího SMTP (např. měkká nebo tvrdá selhání – abyste mohli spravovat své odběratele a programově spravovat odchozí e-maily). |
| `max_quota_per_alias` | Žádný | Řetězec | Maximální kvóta úložiště pro aliasy na tomto doménovém názvu. Zadejte hodnotu, například „1 GB“, kterou bude analyzovat [bytes](https://github.com/visionmedia/bytes.js). |

> Příklad požadavku:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Smazat doménu {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Pozvánky {#invites}

### Přijmout pozvánku do domény {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Vytvořit pozvánku do domény {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ano | Řetězec (e-mail) | E-mailová adresa pro pozvání do seznamu členů domény |
| `group` | Ano | Řetězec (vyčíslitelný) | Skupina, do které se má uživatel přidat do členství v doméně (může být `"admin"` nebo `"user"`) |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Pokud je zvaný uživatel již přijatým členem jakékoli jiné domény, jejímž členem je i administrátor, který ho zve, pak se pozvánka automaticky přijme a e-mail se neodešle.

### Odebrat pozvánku do domény {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ano | Řetězec (e-mail) | E-mailová adresa, kterou chcete odebrat ze seznamu členů domény |

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Členové {#members}

### Aktualizovat člena domény {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ano | Řetězec (vyčíslitelný) | Skupina, do které se má uživatele přiřadit k členství v doméně (může být `"admin"` nebo `"user"`) |

> Příklad požadavku:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Odebrat člena domény {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliasy {#aliases}

### Vygenerovat alias hesla {#generate-an-alias-password}

Upozorňujeme, že pokud neodešlete pokyny e-mailem, bude uživatelské jméno a heslo v těle odpovědi JSON úspěšného požadavku ve formátu `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parametr těla | Požadovaný | Typ | Popis |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Žádný | Řetězec | Vaše vlastní nové heslo, které se použije pro alias. Upozorňujeme, že pokud chcete získat náhodně vygenerované a silné heslo, můžete toto pole nechat prázdné nebo jej v těle požadavku API zcela vynechat. |
| `password` | Žádný | Řetězec | Stávající heslo pro alias pro změnu hesla bez smazání stávajícího úložiště poštovní schránky IMAP (pokud již stávající heslo nemáte, viz možnost `is_override` níže). |
| `is_override` | Žádný | Booleovská hodnota | **POUŽÍVEJTE S POZORNOSTÍ**: Tímto se zcela přepíše stávající heslo a databáze aliasu, trvale se smaže stávající úložiště IMAP a kompletně se resetuje e-mailová databáze SQLite aliasu. Pokud máte k tomuto aliasu připojenou stávající poštovní schránku, vytvořte si prosím zálohu. |
| `emailed_instructions` | Žádný | Řetězec | E-mailová adresa, na kterou se má zaslat heslo aliasu a pokyny k nastavení. |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Seznam aliasů domén {#list-domain-aliases}

> \[!NOTE]
> Od 1. listopadu 2024 budou koncové body API pro [Seznam domén](#list-domains) a [Seznam aliasů domén](#list-domain-aliases) standardně nastavovat maximální počet výsledků na stránku `1000`. Pokud chcete toto chování aktivovat dříve, můžete předat `?paginate=true` jako další parametr řetězce dotazu do adresy URL pro dotaz koncového bodu. Další informace naleznete v [Stránkování](#pagination).

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parametry řetězce dotazu | Požadovaný | Typ | Popis |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Žádný | Řetězec (podporováno s RegExp) | Vyhledávání aliasů v doméně podle jména, štítku nebo příjemce |
| `name` | Žádný | Řetězec (podporováno s RegExp) | Hledání aliasů v doméně podle názvu |
| `recipient` | Žádný | Řetězec (podporováno s RegExp) | Hledání aliasů v doméně podle příjemce |
| `sort` | Žádný | Řetězec | Seřadit podle konkrétního pole (předpona s jednou pomlčkou `-` se seřadí v opačném směru než toto pole). Pokud není nastaveno, výchozí hodnota je `created_at`. |
| `page` | Žádný | Číslo | Více informací naleznete na [Pagination](#pagination) |
| `limit` | Žádný | Číslo | Více informací naleznete na [Pagination](#pagination) |

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Vytvořit nový alias domény {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parametr těla | Požadovaný | Typ | Popis |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Žádný | Řetězec | Alias (pokud není zadán nebo je prázdný, vygeneruje se náhodný alias) |
| `recipients` | Žádný | Řetězec nebo pole | Seznam příjemců (musí být oddělen zalomením řádku/mezerou/čpárkou v podobě řetězce nebo pole platných e-mailových adres, plně kvalifikovaných názvů domén („FQDN“), IP adres a/nebo URL webhooků – pokud není uveden nebo se jedná o prázdné pole, bude jako příjemce nastaven e-mail uživatele, který odeslal požadavek API) |
| `description` | Žádný | Řetězec | Popis aliasu |
| `labels` | Žádný | Řetězec nebo pole | Seznam popisků (musí být odděleny zalomením řádku/mezerou/čpárkou jako řetězec nebo pole) |
| `has_recipient_verification` | Žádný | Booleovská hodnota | Vyžadovat, aby příjemci klikli na odkaz pro ověření e-mailu, aby e-maily procházely (výchozí nastavení je nastavení domény, pokud není explicitně uvedeno v těle požadavku) |
| `is_enabled` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat tento alias (pokud je zakázán, e-maily nebudou směrovány nikam jinam, ale budou vracet úspěšné stavové kódy). Pokud je předána hodnota, je převedena na booleovskou hodnotu pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Žádný | Číslo (buď `250`, `421` nebo `550`) | Příchozí e-maily na tento alias budou odmítnuty, pokud `is_enabled` je `false` s buď `250` (tiše nedoručovat nikam, např. blackhole nebo `/dev/null`), `421` (měkké odmítnutí; a opakování pokusu až po dobu ~5 dnů) nebo `550` trvalým selháním a odmítnutím. Výchozí nastavení je `250`. |
| `has_imap` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat úložiště IMAP pro tento alias (pokud je zakázáno, příchozí e-maily nebudou ukládány do [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Pokud je předána hodnota, je převedena na booleovskou hodnotu pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pro [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) pomocí aliasu `public_key`. |
| `public_key` | Žádný | Řetězec | Veřejný klíč OpenPGP ve formátu ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); např. klíč GPG pro `support@forwardemail.net`). Toto platí pouze v případě, že máte `has_pgp` nastaveno na `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Žádný | Řetězec | Maximální kvóta úložiště pro tento alias. Ponechte prázdné pro reset na aktuální maximální kvótu domény nebo zadejte hodnotu, například „1 GB“, která bude analyzována funkcí [bytes](https://github.com/visionmedia/bytes.js). Tuto hodnotu mohou upravit pouze administrátoři domény. |
| `vacation_responder_is_enabled` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat automatickou odpověď v době nepřítomnosti. |
| `vacation_responder_start_date` | Žádný | Řetězec | Datum zahájení odpovědi na dovolenou (pokud je povoleno a zde není nastaveno datum zahájení, předpokládá se, že již byla spuštěna). Podporujeme formáty data jako `MM/DD/YYYY`, `YYYY-MM-DD` a další formáty data prostřednictvím inteligentní analýzy s využitím `dayjs`. |
| `vacation_responder_end_date` | Žádný | Řetězec | Datum ukončení pro odpověď v době dovolené (pokud je povolena a zde není nastaveno datum ukončení, předpokládá se, že nikdy nekončí a odpovídá navždy). Podporujeme formáty data jako `MM/DD/YYYY`, `YYYY-MM-DD` a další formáty data prostřednictvím inteligentního parsování s použitím `dayjs`. |
| `vacation_responder_subject` | Žádný | Řetězec | Předmět v prostém textu pro odpověď v nepřítomnosti, např. „Mimo kancelář“. K odstranění veškerého HTML kódu zde používáme `striptags`. |
| `vacation_responder_message` | Žádný | Řetězec | Zpráva v prostém textu pro odpověď na dovolenou, např. „Budu mimo kancelář do února.“ K odstranění veškerého HTML kódu zde používáme `striptags`. |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Načíst alias domény {#retrieve-domain-alias}

Alias domény můžete načíst buď pomocí hodnoty `id`, nebo pomocí hodnoty `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Aktualizovat alias domény {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parametr těla | Požadovaný | Typ | Popis |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Žádný | Řetězec | Alias |
| `recipients` | Žádný | Řetězec nebo pole | Seznam příjemců (musí být oddělen zalomením řádku/mezerou/čpárkou Řetězec nebo pole platných e-mailových adres, plně kvalifikovaných názvů domén („FQDN“), IP adres a/nebo URL adres webhooků) |
| `description` | Žádný | Řetězec | Popis aliasu |
| `labels` | Žádný | Řetězec nebo pole | Seznam popisků (musí být odděleny zalomením řádku/mezerou/čpárkou jako řetězec nebo pole) |
| `has_recipient_verification` | Žádný | Booleovská hodnota | Vyžadovat, aby příjemci klikli na odkaz pro ověření e-mailu, aby e-maily procházely (výchozí nastavení je nastavení domény, pokud není explicitně uvedeno v těle požadavku) |
| `is_enabled` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat tento alias (pokud je zakázán, e-maily nebudou směrovány nikam jinam, ale budou vracet úspěšné stavové kódy). Pokud je předána hodnota, je převedena na booleovskou hodnotu pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Žádný | Číslo (buď `250`, `421` nebo `550`) | Příchozí e-maily na tento alias budou odmítnuty, pokud `is_enabled` je `false` s buď `250` (tiše nedoručovat nikam, např. blackhole nebo `/dev/null`), `421` (měkké odmítnutí; a opakování pokusu až po dobu ~5 dnů) nebo `550` trvalým selháním a odmítnutím. Výchozí nastavení je `250`. |
| `has_imap` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat úložiště IMAP pro tento alias (pokud je zakázáno, příchozí e-maily nebudou ukládány do [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Pokud je předána hodnota, je převedena na booleovskou hodnotu pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pro [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) pomocí aliasu `public_key`. |
| `public_key` | Žádný | Řetězec | Veřejný klíč OpenPGP ve formátu ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); např. klíč GPG pro `support@forwardemail.net`). Toto platí pouze v případě, že máte `has_pgp` nastaveno na `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Žádný | Řetězec | Maximální kvóta úložiště pro tento alias. Ponechte prázdné pro reset na aktuální maximální kvótu domény nebo zadejte hodnotu, například „1 GB“, která bude analyzována funkcí [bytes](https://github.com/visionmedia/bytes.js). Tuto hodnotu mohou upravit pouze administrátoři domény. |
| `vacation_responder_is_enabled` | Žádný | Booleovská hodnota | Zda povolit nebo zakázat automatickou odpověď v době nepřítomnosti. |
| `vacation_responder_start_date` | Žádný | Řetězec | Datum zahájení odpovědi na dovolenou (pokud je povoleno a zde není nastaveno datum zahájení, předpokládá se, že již byla spuštěna). Podporujeme formáty data jako `MM/DD/YYYY`, `YYYY-MM-DD` a další formáty data prostřednictvím inteligentní analýzy s využitím `dayjs`. |
| `vacation_responder_end_date` | Žádný | Řetězec | Datum ukončení pro odpověď v době dovolené (pokud je povolena a zde není nastaveno datum ukončení, předpokládá se, že nikdy nekončí a odpovídá navždy). Podporujeme formáty data jako `MM/DD/YYYY`, `YYYY-MM-DD` a další formáty data prostřednictvím inteligentního parsování s použitím `dayjs`. |
| `vacation_responder_subject` | Žádný | Řetězec | Předmět v prostém textu pro odpověď v nepřítomnosti, např. „Mimo kancelář“. K odstranění veškerého HTML kódu zde používáme `striptags`. |
| `vacation_responder_message` | Žádný | Řetězec | Zpráva v prostém textu pro odpověď na dovolenou, např. „Budu mimo kancelář do února.“ K odstranění veškerého HTML kódu zde používáme `striptags`. |

> Příklad požadavku:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Smazat alias domény {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Zašifrovat {#encrypt}

Umožňujeme vám šifrovat záznamy i v bezplatném plánu bezplatně. Ochrana soukromí by neměla být funkcí, ale měla by být neodmyslitelně součástí všech aspektů produktu. Na základě důrazné žádosti v dokumentech [Diskuse o Průvodcích ochranou osobních údajů](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) a [naše problémy s GitHubem](https://github.com/forwardemail/forwardemail.net/issues/254) jsme tuto funkci přidali.

### Zašifrovat záznam TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parametr těla | Požadovaný | Typ | Popis |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ano | Řetězec | Jakýkoli platný záznam TXT v prostém textu pro přeposílaní e-mailu |

> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
