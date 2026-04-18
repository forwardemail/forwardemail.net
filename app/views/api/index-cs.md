# Email API {#email-api}


## Obsah {#table-of-contents}

* [Knihovny](#libraries)
* [Základní URI](#base-uri)
* [Autentizace](#authentication)
  * [Autentizace pomocí API tokenu (doporučeno pro většinu endpointů)](#api-token-authentication-recommended-for-most-endpoints)
  * [Autentizace pomocí aliasových přihlašovacích údajů (pro odchozí emaily)](#alias-credentials-authentication-for-outbound-email)
  * [Endpointy pouze pro aliasy](#alias-only-endpoints)
* [Chyby](#errors)
* [Lokalizace](#localization)
* [Stránkování](#pagination)
* [Logy](#logs)
  * [Získání logů](#retrieve-logs)
* [Účet](#account)
  * [Vytvoření účtu](#create-account)
  * [Získání účtu](#retrieve-account)
  * [Aktualizace účtu](#update-account)
* [Aliasové kontakty (CardDAV)](#alias-contacts-carddav)
  * [Seznam kontaktů](#list-contacts)
  * [Vytvoření kontaktu](#create-contact)
  * [Získání kontaktu](#retrieve-contact)
  * [Aktualizace kontaktu](#update-contact)
  * [Smazání kontaktu](#delete-contact)
* [Aliasové kalendáře (CalDAV)](#alias-calendars-caldav)
  * [Seznam kalendářů](#list-calendars)
  * [Vytvoření kalendáře](#create-calendar)
  * [Získání kalendáře](#retrieve-calendar)
  * [Aktualizace kalendáře](#update-calendar)
  * [Smazání kalendáře](#delete-calendar)
* [Aliasové zprávy (IMAP/POP3)](#alias-messages-imappop3)
  * [Seznam a vyhledávání zpráv](#list-and-search-for-messages)
  * [Vytvoření zprávy](#create-message)
  * [Získání zprávy](#retrieve-message)
  * [Aktualizace zprávy](#update-message)
  * [Smazání zprávy](#delete-message)
* [Aliasové složky (IMAP/POP3)](#alias-folders-imappop3)
  * [Seznam složek](#list-folders)
  * [Vytvoření složky](#create-folder)
  * [Získání složky](#retrieve-folder)
  * [Aktualizace složky](#update-folder)
  * [Smazání složky](#delete-folder)
  * [Kopírování složky](#copy-folder)
* [Odchozí emaily](#outbound-emails)
  * [Získání limitu odchozích SMTP emailů](#get-outbound-smtp-email-limit)
  * [Seznam odchozích SMTP emailů](#list-outbound-smtp-emails)
  * [Vytvoření odchozího SMTP emailu](#create-outbound-smtp-email)
  * [Získání odchozího SMTP emailu](#retrieve-outbound-smtp-email)
  * [Smazání odchozího SMTP emailu](#delete-outbound-smtp-email)
* [Domény](#domains)
  * [Seznam domén](#list-domains)
  * [Vytvoření domény](#create-domain)
  * [Získání domény](#retrieve-domain)
  * [Ověření záznamů domény](#verify-domain-records)
  * [Ověření SMTP záznamů domény](#verify-domain-smtp-records)
  * [Seznam hesel pro catch-all na úrovni domény](#list-domain-wide-catch-all-passwords)
  * [Vytvoření hesla pro catch-all na úrovni domény](#create-domain-wide-catch-all-password)
  * [Odstranění hesla pro catch-all na úrovni domény](#remove-domain-wide-catch-all-password)
  * [Aktualizace domény](#update-domain)
  * [Smazání domény](#delete-domain)
* [Pozvánky](#invites)
  * [Přijetí pozvánky do domény](#accept-domain-invite)
  * [Vytvoření pozvánky do domény](#create-domain-invite)
  * [Odstranění pozvánky do domény](#remove-domain-invite)
* [Členové](#members)
  * [Aktualizace člena domény](#update-domain-member)
  * [Odstranění člena domény](#remove-domain-member)
* [Aliasy](#aliases)
  * [Vygenerování hesla pro alias](#generate-an-alias-password)
  * [Seznam aliasů domény](#list-domain-aliases)
  * [Vytvoření nového aliasu domény](#create-new-domain-alias)
  * [Získání aliasu domény](#retrieve-domain-alias)
  * [Aktualizace aliasu domény](#update-domain-alias)
  * [Smazání aliasu domény](#delete-domain-alias)
* [Šifrování](#encrypt)
  * [Šifrování TXT záznamu](#encrypt-txt-record)


## Knihovny {#libraries}

Momentálně jsme ještě nevydali žádné API wrappery, ale plánujeme tak učinit v blízké budoucnosti. Pošlete email na <api@forwardemail.net>, pokud chcete být upozorněni, až bude vydán API wrapper pro konkrétní programovací jazyk. Mezitím můžete ve své aplikaci použít tyto doporučené HTTP knihovny, nebo jednoduše použít [curl](https://stackoverflow.com/a/27442239/3586413) jako v níže uvedených příkladech.

| Jazyk      | Knihovna                                                              |
| ---------- | --------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                      |
| Python     | [requests](https://github.com/psf/requests)                           |
| Java       | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (jsme správci)      |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (jsme správci)      |
| Go         | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## Base URI {#base-uri}

Aktuální základní cesta HTTP URI je: `BASE_URI`.


## Autentizace {#authentication}

Všechny koncové body vyžadují autentizaci pomocí [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Podporujeme dva způsoby autentizace:

### Autentizace pomocí API tokenu (doporučeno pro většinu koncových bodů) {#api-token-authentication-recommended-for-most-endpoints}

Nastavte svůj [API klíč](https://forwardemail.net/my-account/security) jako hodnotu "username" s prázdným heslem:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Všimněte si dvojtečky (`:`) za API tokenem – označuje prázdné heslo ve formátu Basic Auth.

### Autentizace pomocí aliasových přihlašovacích údajů (pro odchozí e-maily) {#alias-credentials-authentication-for-outbound-email}

Koncový bod [Vytvořit odchozí SMTP e-mail](#create-outbound-smtp-email) také podporuje autentizaci pomocí vaší aliasové e-mailové adresy a [vygenerovaného aliasového hesla](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Tato metoda je užitečná při odesílání e-mailů z aplikací, které již používají SMTP přihlašovací údaje, a umožňuje bezproblémovou migraci ze SMTP na naše API.

### Koncové body pouze pro aliasy {#alias-only-endpoints}

Koncové body [Alias Kontakty](#alias-contacts-carddav), [Alias Kalendáře](#alias-calendars-caldav), [Alias Zprávy](#alias-messages-imappop3) a [Alias Složky](#alias-folders-imappop3) vyžadují aliasové přihlašovací údaje a nepodporují autentizaci pomocí API tokenu.

Nemějte obavy – níže jsou uvedeny příklady, pokud si nejste jisti, co to je.


## Chyby {#errors}

Pokud dojde k chybě, tělo odpovědi API bude obsahovat podrobnou chybovou zprávu.

| Kód  | Název                 |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Špatný požadavek      |
| 401  | Neautorizováno        |
| 403  | Zakázáno              |
| 404  | Nenalezeno            |
| 429  | Příliš mnoho požadavků|
| 500  | Interní chyba serveru |
| 501  | Neimplementováno      |
| 502  | Špatná brána          |
| 503  | Služba nedostupná     |
| 504  | Vypršel čas brány     |

> \[!TIP]
> Pokud obdržíte stavový kód 5xx (což by se nemělo stát), kontaktujte nás prosím na <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> a my vám okamžitě pomůžeme vyřešit váš problém.


## Lokalizace {#localization}

Naše služba je přeložena do více než 25 různých jazyků. Všechny zprávy odpovědí API jsou přeloženy do poslední detekované lokality uživatele, který provádí API požadavek. Toto můžete přepsat předáním vlastního hlavičkového parametru `Accept-Language`. Klidně to vyzkoušejte pomocí jazykového rozbalovacího seznamu ve spodní části této stránky.


## Stránkování {#pagination}

> \[!NOTE]
> Od 1. listopadu 2024 budou API koncové body pro [Seznam domén](#list-domains) a [Seznam aliasů domén](#list-domain-aliases) ve výchozím nastavení vracet maximálně `1000` výsledků na stránku. Pokud chcete tuto funkci používat dříve, můžete přidat `?paginate=true` jako další parametr dotazu v URL koncového bodu.

Stránkování je podporováno ve všech API koncových bodech, které vracejí seznam výsledků.

Jednoduše zadejte vlastnosti dotazu `page` (a volitelně `limit`).

Vlastnost `page` by měla být číslo větší nebo rovno `1`. Pokud zadáte `limit` (také číslo), minimální hodnota je `10` a maximální `50` (pokud není uvedeno jinak).

| Parametr dotazu       | Povinný | Typ    | Popis                                                                                                                                                   |
| --------------------- | ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Ne      | Číslo  | Stránka výsledků k vrácení. Pokud není zadáno, hodnota `page` bude `1`. Musí být číslo větší nebo rovno `1`.                                            |
| `limit`               | Ne      | Číslo  | Počet výsledků k vrácení na stránku. Výchozí hodnota je `10`, pokud není zadána. Musí být číslo větší nebo rovno `1` a menší nebo rovno `50`.            |
Abychom zjistili, zda jsou k dispozici další výsledky, poskytujeme tyto HTTP hlavičky odpovědi (které můžete analyzovat pro programové stránkování):

| HTTP Response Header | Příklad                                                                                                                                                                                                                                                  | Popis                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Celkový počet dostupných stránek.                                                                                                                                                                                                                                                                                                                               |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Aktuální stránka vrácených výsledků (např. na základě parametru dotazu `page`).                                                                                                                                                                                                                                                                                   |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Celkový počet výsledků na vrácené stránce (např. na základě parametru dotazu `limit` a skutečně vrácených výsledků).                                                                                                                                                                                                                                            |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Celkový počet položek dostupných napříč všemi stránkami.                                                                                                                                                                                                                                                                                                         |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Poskytujeme HTTP hlavičku odpovědi `Link`, kterou můžete analyzovat, jak je ukázáno v příkladu. Toto je [podobné jako na GitHubu](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (např. ne všechny hodnoty budou poskytnuty, pokud nejsou relevantní nebo dostupné, např. `"next"` nebude poskytnuto, pokud neexistuje další stránka). |
> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Záznamy {#logs}

### Získat záznamy {#retrieve-logs}

Naše API vám programově umožňuje stáhnout záznamy pro váš účet. Odesláním požadavku na tento endpoint se zpracují všechny záznamy pro váš účet a zašlou se vám e-mailem jako příloha (soubor tabulky [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) komprimovaný pomocí [Gzip](https://en.wikipedia.org/wiki/Gzip)) po dokončení.

To vám umožňuje vytvářet úlohy na pozadí pomocí [Cron job](https://en.wikipedia.org/wiki/Cron) nebo pomocí našeho [Node.js plánovacího softwaru Bree](https://github.com/breejs/bree), abyste dostávali záznamy kdykoli budete chtít. Všimněte si, že tento endpoint je omezen na `10` požadavků za den.

Příloha má název v malých písmenech ve formátu `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` a samotný e-mail obsahuje stručné shrnutí získaných záznamů. Záznamy si také můžete stáhnout kdykoli z [Můj účet → Záznamy](/my-account/logs)

> `GET /v1/logs/download`

| Parametr dotazu       | Povinný | Typ           | Popis                                                                                                                         |
| --------------------- | ------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Ne      | Řetězec (FQDN) | Filtrovat záznamy podle plně kvalifikované domény ("FQDN"). Pokud tento parametr neposkytnete, budou získány všechny záznamy ze všech domén. |
| `q`                   | Ne      | Řetězec       | Vyhledávat záznamy podle e-mailu, domény, názvu aliasu, IP adresy nebo data (formáty `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` nebo `M.D.YY`). |
| `bounce_category`     | Ne      | Řetězec       | Vyhledávat záznamy podle konkrétní kategorie odmítnutí (např. `blocklist`).                                                    |
| `response_code`       | Ne      | Číslo         | Vyhledávat záznamy podle konkrétního chybového kódu odpovědi (např. `421` nebo `550`).                                         |

> Example Request:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Příklad Cron jobu (každou půlnoc každý den):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Všimněte si, že můžete použít služby jako [Crontab.guru](https://crontab.guru/) k ověření syntaxe výrazu vašeho cron jobu.

> Příklad Cron jobu (každou půlnoc každý den **a se záznamy za předchozí den**):

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

| Parametr těla | Povinný | Typ            | Popis         |
| ------------- | ------- | -------------- | ------------- |
| `email`       | Ano     | Řetězec (Email) | E-mailová adresa |
| `password`    | Ano     | Řetězec        | Heslo         |

> Example Request:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Získat účet {#retrieve-account}

> `GET /v1/account`

> Example Request:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Aktualizovat účet {#update-account}

> `PUT /v1/account`

| Parametr těla | Povinný | Typ            | Popis               |
| ------------- | ------- | -------------- | ------------------- |
| `email`       | Ne      | Řetězec (Email) | E-mailová adresa    |
| `given_name`  | Ne      | Řetězec        | Jméno               |
| `family_name` | Ne      | Řetězec        | Příjmení            |
| `avatar_url`  | Ne      | Řetězec (URL)  | Odkaz na obrázek avataru |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias Kontakty (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Na rozdíl od ostatních API endpointů vyžadují tyto [Autentizaci](#authentication) s "uživatelským jménem" rovno uživatelskému jménu aliasu a "heslem" rovno vygenerovanému heslu aliasu jako Basic Authorization hlavičky.
> \[!WARNING]
> Tato sekce endpointů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím použijte IMAP klienta z rozbalovací nabídky "Apps" v navigaci na našem webu.

### Seznam kontaktů {#list-contacts}

> `GET /v1/contacts`

**Brzy k dispozici**

### Vytvořit kontakt {#create-contact}

> `POST /v1/contacts`

**Brzy k dispozici**

### Získat kontakt {#retrieve-contact}

> `GET /v1/contacts/:id`

**Brzy k dispozici**

### Aktualizovat kontakt {#update-contact}

> `PUT /v1/contacts/:id`

**Brzy k dispozici**

### Smazat kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Brzy k dispozici**


## Alias Kalendáře (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Na rozdíl od ostatních API endpointů vyžadují tyto [Autentizaci](#authentication) s "uživatelským jménem" rovno uživatelskému jménu aliasu a "heslem" rovno heslu vygenerovanému aliasem jako Basic Authorization hlavičky.

> \[!WARNING]
> Tato sekce endpointů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím použijte IMAP klienta z rozbalovací nabídky "Apps" v navigaci na našem webu.

### Seznam kalendářů {#list-calendars}

> `GET /v1/calendars`

**Brzy k dispozici**

### Vytvořit kalendář {#create-calendar}

> `POST /v1/calendars`

**Brzy k dispozici**

### Získat kalendář {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Brzy k dispozici**

### Aktualizovat kalendář {#update-calendar}

> `PUT /v1/calendars/:id`

**Brzy k dispozici**

### Smazat kalendář {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Brzy k dispozici**


## Alias Zprávy (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Na rozdíl od ostatních API endpointů vyžadují tyto [Autentizaci](#authentication) s "uživatelským jménem" rovno uživatelskému jménu aliasu a "heslem" rovno heslu vygenerovanému aliasem jako Basic Authorization hlavičky.

> \[!WARNING]
> Tato sekce endpointů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím použijte IMAP klienta z rozbalovací nabídky "Apps" v navigaci na našem webu.

Prosím ujistěte se, že jste dodrželi pokyny pro nastavení vaší domény.

Tyto pokyny naleznete v naší sekci FAQ [Podporujete příjem emailů přes IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Seznam a vyhledávání zpráv {#list-and-search-for-messages}

> `GET /v1/messages`

**Brzy k dispozici**

### Vytvořit zprávu {#create-message}

> \[!NOTE]
> Toto **NE** odešle email – pouze přidá zprávu do vaší složky poštovní schránky (např. je to podobné příkazu IMAP `APPEND`). Pokud chcete odeslat email, podívejte se na [Vytvořit odchozí SMTP email](#create-outbound-smtp-email) níže. Po vytvoření odchozího SMTP emailu můžete pomocí tohoto endpointu přidat jeho kopii do poštovní schránky aliasu pro účely uložení.

> `POST /v1/messages`

**Brzy k dispozici**

### Získat zprávu {#retrieve-message}

> `GET /v1/messages/:id`

**Brzy k dispozici**

### Aktualizovat zprávu {#update-message}

> `PUT /v1/messages/:id`

**Brzy k dispozici**

### Smazat zprávu {#delete-message}

> `DELETE /v1/messages:id`

**Brzy k dispozici**


## Alias Složky (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Endpointy složek s cestou složky <code>/v1/folders/:path</code> jako endpointem jsou zaměnitelné s ID složky <code>:id</code>. To znamená, že můžete odkazovat na složku buď podle její <code>cesty</code> nebo <code>id</code> hodnoty.

> \[!WARNING]
> Tato sekce endpointů je ve vývoji a bude (doufejme) vydána v roce 2024. Mezitím prosím použijte IMAP klienta z rozbalovací nabídky "Apps" v navigaci na našem webu.

### Seznam složek {#list-folders}

> `GET /v1/folders`

**Brzy k dispozici**

### Vytvořit složku {#create-folder}

> `POST /v1/folders`

**Brzy k dispozici**

### Získat složku {#retrieve-folder}

> `GET /v1/folders/:id`

**Brzy k dispozici**

### Aktualizovat složku {#update-folder}

> `PUT /v1/folders/:id`

**Brzy k dispozici**

### Smazat složku {#delete-folder}

> `DELETE /v1/folders/:id`

**Brzy k dispozici**

### Kopírovat složku {#copy-folder}

> `POST /v1/folders/:id/copy`

**Brzy k dispozici**


## Odchozí emaily {#outbound-emails}

Prosím ujistěte se, že jste dodrželi pokyny pro nastavení vaší domény.

Tyto pokyny naleznete na [Můj účet → Domény → Nastavení → Konfigurace odchozího SMTP](/my-account/domains). Musíte zajistit nastavení DKIM, Return-Path a DMARC pro odesílání odchozího SMTP s vaší doménou.
### Získat limit odchozích SMTP emailů {#get-outbound-smtp-email-limit}

Toto je jednoduchý endpoint, který vrací JSON objekt obsahující `count` a `limit` pro počet denních odchozích SMTP zpráv na základě jednotlivého účtu.

> `GET /v1/emails/limit`

> Příklad požadavku:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Seznam odchozích SMTP emailů {#list-outbound-smtp-emails}

Všimněte si, že tento endpoint nevrací hodnoty vlastností pro `message`, `headers` ani `rejectedErrors` emailu.

Pro vrácení těchto vlastností a jejich hodnot použijte prosím endpoint [Získat email](#retrieve-email) s ID emailu.

> `GET /v1/emails`

| Parametr dotazu       | Povinný | Typ                       | Popis                                                                                                                                               |
| --------------------- | ------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Ne      | String (podpora RegExp)   | Vyhledávání emailů podle metadat                                                                                                                  |
| `domain`              | Ne      | String (podpora RegExp)   | Vyhledávání emailů podle domény                                                                                                                   |
| `sort`                | Ne      | String                    | Řazení podle konkrétního pole (předpona s jedním pomlčkou `-` znamená řazení v opačném směru). Výchozí je `created_at`, pokud není nastaveno.     |
| `page`                | Ne      | Číslo                     | Viz [Stránkování](#pagination) pro více informací                                                                                                |
| `limit`               | Ne      | Číslo                     | Viz [Stránkování](#pagination) pro více informací                                                                                                |

> Příklad požadavku:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Vytvořit odchozí SMTP email {#create-outbound-smtp-email}

Naše API pro vytváření emailů je inspirováno a využívá konfiguraci možností zprávy Nodemaileru. Pro všechny parametry těla níže prosím odkazujte na [konfiguraci zprávy Nodemailer](https://nodemailer.com/message/).

Všimněte si, že s výjimkou `envelope` a `dkim` (které nastavujeme automaticky za vás) podporujeme všechny možnosti Nodemaileru. Automaticky nastavujeme možnosti `disableFileAccess` a `disableUrlAccess` na `true` z bezpečnostních důvodů.

Měli byste buď předat jedinou možnost `raw` s vaším surovým plným emailem včetně hlaviček **nebo** předat jednotlivé parametry těla níže.

Tento API endpoint automaticky zakóduje emoji, pokud jsou nalezeny v hlavičkách (např. předmět `Subject: 🤓 Hello` se automaticky převede na `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Naším cílem bylo vytvořit extrémně přívětivé a odolné API pro vývojáře.

**Autentizace:** Tento endpoint podporuje jak [autentizaci pomocí API tokenu](#api-token-authentication-recommended-for-most-endpoints), tak [autentizaci pomocí aliasových přihlašovacích údajů](#alias-credentials-authentication-for-outbound-email). Podrobnosti viz sekce [Autentizace](#authentication) výše.

> `POST /v1/emails`

| Parametr těla    | Povinný | Typ              | Popis                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `from`           | Ne      | String (Email)   | Emailová adresa odesílatele (musí existovat jako alias domény).                                                                                                                                                                                                                                                                                                                                                                                               |
| `to`             | Ne      | String nebo Pole  | Čárkou oddělený seznam nebo pole příjemců pro hlavičku "To".                                                                                                                                                                                                                                                                                                                                                                                                  |
| `cc`             | Ne      | String nebo Pole  | Čárkou oddělený seznam nebo pole příjemců pro hlavičku "Cc".                                                                                                                                                                                                                                                                                                                                                                                                  |
| `bcc`            | Ne      | String nebo Pole  | Čárkou oddělený seznam nebo pole příjemců pro hlavičku "Bcc".                                                                                                                                                                                                                                                                                                                                                                                                 |
| `subject`        | Ne      | String           | Předmět emailu.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `text`           | Ne      | String nebo Buffer | Textová verze zprávy.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `html`           | Ne      | String nebo Buffer | HTML verze zprávy.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `attachments`    | Ne      | Pole             | Pole příloh (viz [běžná pole Nodemaileru](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                                     |
| `sender`         | Ne      | String           | Emailová adresa pro hlavičku "Sender" (viz [pokročilejší pole Nodemaileru](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                            |
| `replyTo`        | Ne      | String           | Emailová adresa pro hlavičku "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `inReplyTo`      | Ne      | String           | Message-ID, na který zpráva odpovídá.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `references`     | Ne      | String nebo Pole  | Mezerou oddělený seznam nebo pole Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `attachDataUrls` | Ne      | Boolean          | Pokud `true`, převede `data:` obrázky v HTML obsahu zprávy na vložené přílohy.                                                                                                                                                                                                                                                                                                                                                                                  |
| `watchHtml`      | Ne      | String           | Specifická HTML verze zprávy pro Apple Watch ([dle dokumentace Nodemailer](https://nodemailer.com/message/#content-options]), nejnovější hodinky toto nastavení nevyžadují).                                                                                                                                                                                                                                                                                   |
| `amp`            | Ne      | String           | Specifická AMP4EMAIL HTML verze zprávy (viz [příklad Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                                |
| `icalEvent`      | Ne      | Objekt           | Událost iCalendar použitá jako alternativní obsah zprávy (viz [kalendářové události Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                            |
| `alternatives`   | Ne      | Pole             | Pole alternativního obsahu zprávy (viz [alternativní obsah Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                         |
| `encoding`       | Ne      | String           | Kódování pro textové a HTML řetězce (výchozí `"utf-8"`, podporuje také `"hex"` a `"base64"`).                                                                                                                                                                                                                                                                                                                                                                  |
| `raw`            | Ne      | String nebo Buffer | Vlastní generovaná zpráva ve formátu RFC822 k použití (místo generované Nodemailerem – viz [vlastní zdroj Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                                        |
| `textEncoding`   | Ne      | String           | Kódování, které je nuceno použít pro textové hodnoty (buď `"quoted-printable"` nebo `"base64"`). Výchozí hodnota je nejbližší detekovaná hodnota (pro ASCII použijte `"quoted-printable"`).                                                                                                                                                                                                                                                                  |
| `priority`       | Ne      | String           | Priorita emailu (může být `"high"`, `"normal"` (výchozí) nebo `"low"`). Hodnota `"normal"` nenastavuje hlavičku priority (to je výchozí chování). Pokud je nastavena hodnota `"high"` nebo `"low"`, hlavičky `X-Priority`, `X-MSMail-Priority` a `Importance` [budou nastaveny odpovídajícím způsobem](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Ne      | Objekt nebo Pole  | Objekt nebo pole dalších hlaviček k nastavení (viz [vlastní hlavičky Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                             |
| `messageId`      | Ne      | String           | Volitelná hodnota Message-ID pro hlavičku "Message-ID" (výchozí hodnota bude automaticky vytvořena, pokud není nastavena – hodnota by měla [odpovídat specifikaci RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                |
| `date`           | Ne      | String nebo Date | Volitelná hodnota data, která se použije, pokud po parsování chybí hlavička Date, jinak se použije aktuální UTC čas, pokud není nastavena. Hlavička data nesmí být více než 30 dní v budoucnosti oproti aktuálnímu času.                                                                                                                                                                                                                                        |
| `list`           | Ne      | Objekt           | Volitelný objekt hlaviček `List-*` (viz [listové hlavičky Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                           |
> Příklad požadavku (API token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Příklad požadavku (přihlašovací údaje aliasu):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Příklad požadavku (surový e-mail):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Získání odchozího SMTP e-mailu {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Příklad požadavku:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Smazání odchozího SMTP e-mailu {#delete-outbound-smtp-email}

Smazání e-mailu nastaví stav na `"rejected"` (a následně jej nebude zpracovávat v frontě) pouze pokud je aktuální stav jeden z `"pending"`, `"queued"` nebo `"deferred"`. E-maily můžeme automaticky mazat po 30 dnech od jejich vytvoření a/nebo odeslání – proto byste měli uchovávat kopii odchozích SMTP e-mailů ve svém klientovi, databázi nebo aplikaci. Pokud chcete, můžete v databázi odkazovat na naši hodnotu ID e-mailu – tato hodnota je vrácena z obou endpointů [Vytvořit e-mail](#create-email) a [Získat e-mail](#retrieve-email).

> `DELETE /v1/emails/:id`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domény {#domains}

> \[!TIP]
> Endpointy domén s názvem domény <code>/v1/domains/:domain_name</code> jako jejich endpointem jsou zaměnitelné s ID domény <code>:domain_id</code>. To znamená, že na doménu můžete odkazovat buď podle jejího <code>name</code> nebo <code>id</code>.

### Výpis domén {#list-domains}

> \[!NOTE]
> Od 1. listopadu 2024 budou API endpointy pro [Výpis domén](#list-domains) a [Výpis aliasů domén](#list-domain-aliases) ve výchozím nastavení vracet maximálně `1000` výsledků na stránku. Pokud chcete tuto funkci používat dříve, můžete přidat `?paginate=true` jako další parametr dotazu v URL endpointu. Více informací najdete v sekci [Stránkování](#pagination).

> `GET /v1/domains`

| Parametr dotazu        | Povinný | Typ                       | Popis                                                                                                                                            |
| ---------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                    | Ne      | Řetězec (podporuje RegExp) | Vyhledávání domén podle názvu                                                                                                                    |
| `name`                 | Ne      | Řetězec (podporuje RegExp) | Vyhledávání domén podle názvu                                                                                                                    |
| `sort`                 | Ne      | Řetězec                   | Řazení podle konkrétního pole (přidejte předponu s jedním pomlčkou `-` pro řazení v opačném směru). Výchozí je `created_at`, pokud není nastaveno. |
| `page`                 | Ne      | Číslo                     | Viz [Stránkování](#pagination) pro více informací                                                                                               |
| `limit`                | Ne      | Číslo                     | Viz [Stránkování](#pagination) pro více informací                                                                                               |

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Vytvoření domény {#create-domain}

> `POST /v1/domains`

| Parametr těla                 | Povinný | Typ                                           | Popis                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | ------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                      | Ano     | Řetězec (FQDN nebo IP)                        | Plně kvalifikovaný název domény ("FQDN") nebo IP adresa                                                                                                                                                                                                                                                            |
| `team_domain`                 | Ne      | Řetězec (ID domény nebo název domény; FQDN) | Automaticky přiřadí tuto doménu ke stejnému týmu jako jiná doména. To znamená, že všichni členové z této domény budou přiřazeni jako členové týmu a `plan` bude automaticky nastaven na `team`. Můžete nastavit na `"none"`, pokud chcete toto explicitně zakázat, ale není to nutné.                                  |
| `plan`                        | Ne      | Řetězec (výčtový)                            | Typ plánu (musí být `"free"`, `"enhanced_protection"` nebo `"team"`, výchozí je `"free"` nebo aktuální placený plán uživatele, pokud nějaký má)                                                                                                                                                                     |
| `catchall`                    | Ne      | Řetězec (oddělené e-mailové adresy) nebo Boolean | Vytvořit výchozí catch-all alias, výchozí je `true` (pokud je `true`, použije se e-mailová adresa uživatele API jako příjemce, pokud je `false`, catch-all se nevytvoří). Pokud je předán řetězec, jedná se o seznam e-mailových adres oddělených zalomením řádku, mezerou a/nebo čárkou, které budou příjemci. |
| `has_adult_content_protection`| Ne      | Boolean                                       | Zda povolit ochranu proti obsahu pro dospělé ve Spam Scanneru na této doméně                                                                                                                                                                                                                                         |
| `has_phishing_protection`     | Ne      | Boolean                                       | Zda povolit ochranu proti phishingu ve Spam Scanneru na této doméně                                                                                                                                                                                                                                                  |
| `has_executable_protection`   | Ne      | Boolean                                       | Zda povolit ochranu proti spustitelným souborům ve Spam Scanneru na této doméně                                                                                                                                                                                                                                       |
| `has_virus_protection`        | Ne      | Boolean                                       | Zda povolit ochranu proti virům ve Spam Scanneru na této doméně                                                                                                                                                                                                                                                      |
| `has_recipient_verification`  | Ne      | Boolean                                       | Globální výchozí nastavení domény, zda vyžadovat, aby příjemci aliasů klikli na ověřovací odkaz v e-mailu, aby e-maily mohly být doručeny                                                                                                                                                                           |
| `ignore_mx_check`             | Ne      | Boolean                                       | Zda ignorovat kontrolu MX záznamu domény pro ověření. Toto je určeno hlavně pro uživatele s pokročilými pravidly konfigurace MX výměny, kteří potřebují zachovat svůj stávající MX záznam a přesměrovat na náš.                                                                                                         |
| `retention_days`              | Ne      | Číslo                                         | Celé číslo mezi `0` a `30`, které určuje počet dní uchování odchozích SMTP e-mailů po úspěšném doručení nebo trvalé chybě. Výchozí je `0`, což znamená, že odchozí SMTP e-maily jsou ihned vymazány a redigovány pro vaše zabezpečení.                                                                                  |
| `bounce_webhook`              | Ne      | Řetězec (URL) nebo Boolean (false)            | Vámi zvolená webhook URL začínající na `http://` nebo `https://`, kam budou zasílány webhooky o nedoručených e-mailech. Na tuto URL bude odeslán `POST` požadavek s informacemi o selháních odchozích SMTP (např. měkké nebo tvrdé chyby – abyste mohli spravovat své odběratele a programově řídit odchozí e-maily).        |
| `max_quota_per_alias`         | Ne      | Řetězec                                       | Maximální kvóta úložiště pro aliasy na této doméně. Zadejte hodnotu jako "1 GB", která bude zpracována pomocí [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                      |
> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Získat doménu {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Ověřit záznamy domény {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Ověřit SMTP záznamy domény {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Vypsat hesla catch-all pro celou doménu {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Příklad požadavku:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Vytvořit heslo catch-all pro celou doménu {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parametr v těle | Povinné | Typ    | Popis                                                                                                                                                                                                                      |
| --------------- | ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`  | Ne      | String | Vaše vlastní nové heslo pro použití jako heslo catch-all pro celou doménu.  Můžete jej nechat prázdné nebo zcela vynechat z těla API požadavku, pokud chcete získat náhodně vygenerované a silné heslo.                      Vlastní hesla k mailboxu musí mít maximálně 128 znaků, nesmí začínat ani končit mezerou a nesmí obsahovat uvozovky ani apostrofy. Catch-all hesla jsou určena pouze pro odesílání přes SMTP. Pro přístup přes IMAP, POP3, CalDAV, CardDAV a mailbox si vygenerujte heslo pro konkrétní alias. |
| `description`   | Ne      | String | Popis pouze pro organizační účely.                                                                                                                                                                                        |

> Příklad požadavku:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Odebrat heslo catch-all pro celou doménu {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Příklad požadavku:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Aktualizovat doménu {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parametr v těle               | Povinné | Typ                            | Popis                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `smtp_port`                  | Ne      | String nebo Number             | Vlastní port pro konfiguraci SMTP přeposílání (výchozí je `"25"`)                                                                                                                                                                                                                         |
| `has_adult_content_protection` | Ne      | Boolean                       | Zda povolit ochranu proti obsahu pro dospělé ve Spam Scanneru na této doméně                                                                                                                                                                                                              |
| `has_phishing_protection`    | Ne      | Boolean                       | Zda povolit ochranu proti phishingu ve Spam Scanneru na této doméně                                                                                                                                                                                                                       |
| `has_executable_protection`  | Ne      | Boolean                       | Zda povolit ochranu proti spustitelným souborům ve Spam Scanneru na této doméně                                                                                                                                                                                                           |
| `has_virus_protection`       | Ne      | Boolean                       | Zda povolit antivirovou ochranu ve Spam Scanneru na této doméně                                                                                                                                                                                                                           |
| `has_recipient_verification` | Ne      | Boolean                       | Globální výchozí nastavení domény, zda vyžadovat, aby příjemci aliasů klikli na ověřovací odkaz v e-mailu, aby e-maily mohly být doručeny                                                                                                                                                 |
| `ignore_mx_check`            | Ne      | Boolean                       | Zda ignorovat kontrolu MX záznamu na doméně pro ověření. Toto je hlavně pro uživatele, kteří mají pokročilá pravidla konfigurace MX výměny a potřebují zachovat svůj stávající MX záznam a přeposílat na náš.                                                                              |
| `retention_days`             | Ne      | Number                        | Celé číslo mezi `0` a `30`, které odpovídá počtu dní uchování odchozích SMTP e-mailů po úspěšném doručení nebo trvalé chybě. Výchozí je `0`, což znamená, že odchozí SMTP e-maily jsou ihned vymazány a redigovány pro vaši bezpečnost.                                                  |
| `bounce_webhook`             | Ne      | String (URL) nebo Boolean (false) | URL webhooku `http://` nebo `https://` dle vašeho výběru, kam budou zasílány webhooky o nedoručení. Na tuto URL bude odeslán `POST` požadavek s informacemi o selháních odchozích SMTP (např. měkké nebo tvrdé chyby – abyste mohli spravovat své odběratele a programově řídit odchozí e-maily). |
| `max_quota_per_alias`        | Ne      | String                        | Maximální kvóta úložiště pro aliasy na této doméně. Zadejte hodnotu jako "1 GB", která bude zpracována pomocí [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                           |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Smazat doménu {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Pozvánky {#invites}

### Přijmout pozvánku do domény {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Vytvořit pozvánku do domény {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Povinné | Typ                 | Popis                                                                                      |
| -------------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | Ano     | String (Email)      | Emailová adresa, kterou chcete pozvat do seznamu členů domény                            |
| `group`        | Ano     | String (vyčíslitelné) | Skupina, do které bude uživatel přidán v rámci členství domény (může být `"admin"` nebo `"user"`) |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Pokud uživatel, kterého zvete, je již přijatým členem jiné domény, jejímž je členem i administrátor, který ho zve, pozvánka bude automaticky přijata a email nebude odeslán.

### Odebrat pozvánku do domény {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Povinné | Typ           | Popis                                         |
| -------------- | ------- | -------------- | ---------------------------------------------- |
| `email`        | Ano     | String (Email) | Emailová adresa, která má být odebrána ze seznamu členů domény |

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Členové {#members}

### Aktualizovat člena domény {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Povinné | Typ                 | Popis                                                                                      |
| -------------- | ------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `group`        | Ano     | String (vyčíslitelné) | Skupina, do které bude uživatel aktualizován v rámci členství domény (může být `"admin"` nebo `"user"`) |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Odebrat člena domény {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Alias {#aliases}

### Vygenerovat heslo pro alias {#generate-an-alias-password}

Vezměte prosím na vědomí, že pokud nepošlete instrukce emailem, uživatelské jméno a heslo budou v JSON odpovědi úspěšného požadavku ve formátu `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Povinné | Typ     | Popis                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`         | Ne      | String  | Vaše vlastní nové heslo pro alias. Můžete toto pole nechat prázdné nebo zcela vynechat z těla API požadavku, pokud chcete získat náhodně vygenerované a silné heslo.                                                                                                                              Vlastní hesla k mailboxu musí mít maximálně 128 znaků, nesmí začínat ani končit mezerou a nesmí obsahovat uvozovky ani apostrofy. |
| `password`             | Ne      | String  | Stávající heslo aliasu pro změnu hesla bez mazání existujícího IMAP úložiště (viz volba `is_override` níže, pokud již nemáte stávající heslo).                                                                                                                                                   |
| `is_override`          | Ne      | Boolean | **POUŽÍVEJTE OPATRNĚ**: Toto přepíše existující heslo aliasu a databázi úplně, trvale smaže existující IMAP úložiště a kompletně resetuje SQLite emailovou databázi aliasu. Pokud máte připojenou existující schránku k tomuto aliasu, prosím proveďte zálohu, pokud je to možné.               |
| `emailed_instructions` | Ne      | String  | Emailová adresa, na kterou budou odeslány heslo aliasu a instrukce k nastavení.                                                                                                                                                                                                                  |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Seznam aliasů domény {#list-domain-aliases}

> \[!NOTE]
> Od 1. listopadu 2024 budou API endpointy pro [Seznam domén](#list-domains) a [Seznam aliasů domény](#list-domain-aliases) ve výchozím nastavení vracet maximálně `1000` výsledků na stránku. Pokud chcete tuto funkci používat dříve, můžete přidat `?paginate=true` jako další parametr dotazu v URL endpointu. Více informací naleznete v sekci [Stránkování](#pagination).

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parametr dotazu       | Povinný | Typ                       | Popis                                                                                                                                               |
| --------------------- | ------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Ne      | Řetězec (podpora RegExp)  | Vyhledávání aliasů v doméně podle jména, štítku nebo příjemce                                                                                      |
| `name`                | Ne      | Řetězec (podpora RegExp)  | Vyhledávání aliasů v doméně podle jména                                                                                                           |
| `recipient`           | Ne      | Řetězec (podpora RegExp)  | Vyhledávání aliasů v doméně podle příjemce                                                                                                        |
| `sort`                | Ne      | Řetězec                   | Řazení podle konkrétního pole (přidejte předponu s jedním pomlčkou `-` pro řazení v opačném směru). Výchozí je `created_at`, pokud není nastaveno. |
| `page`                | Ne      | Číslo                     | Viz [Stránkování](#pagination) pro více informací                                                                                                |
| `limit`               | Ne      | Číslo                     | Viz [Stránkování](#pagination) pro více informací                                                                                                |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Vytvořit nový alias domény {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parametr těla                  | Povinný | Typ                                   | Popis                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------ | ------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                        | Ne      | Řetězec                              | Název aliasu (pokud není zadán nebo je prázdný, vygeneruje se náhodný alias)                                                                                                                                                                                                                                                                                                               |
| `recipients`                  | Ne      | Řetězec nebo Pole                    | Seznam příjemců (musí být řetězec oddělený novými řádky/mezerami/čárkami nebo pole platných e-mailových adres, plně kvalifikovaných doménových jmen ("FQDN"), IP adres a/nebo URL webhooků – pokud není zadán nebo je prázdné pole, bude jako příjemce nastaven e-mail uživatele, který provádí API požadavek)                                                                                  |
| `description`                 | Ne      | Řetězec                              | Popis aliasu                                                                                                                                                                                                                                                                                                                                                                               |
| `labels`                     | Ne      | Řetězec nebo Pole                    | Seznam štítků (musí být řetězec oddělený novými řádky/mezerami/čárkami nebo pole)                                                                                                                                                                                                                                                                                                         |
| `has_recipient_verification` | Ne      | Boolean                             | Vyžadovat, aby příjemci klikli na ověřovací odkaz v e-mailu, aby e-maily mohly být doručeny (výchozí nastavení je podle nastavení domény, pokud není explicitně nastaveno v těle požadavku)                                                                                                                                                                                               |
| `is_enabled`                 | Ne      | Boolean                             | Zda tento alias povolit nebo zakázat (pokud je zakázán, e-maily nebudou nikam směrovány, ale vrátí se úspěšné stavové kódy). Pokud je hodnota předána, převede se na boolean pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                          |
| `error_code_if_disabled`      | Ne      | Číslo (buď `250`, `421` nebo `550`) | Příchozí e-mail na tento alias bude odmítnut, pokud je `is_enabled` `false`, s kódem `250` (tichá doručení nikam, např. černá díra nebo `/dev/null`), `421` (dočasné odmítnutí; opakovat až cca 5 dní) nebo `550` (trvalá chyba a odmítnutí). Výchozí je `250`.                                                                                                                        |
| `has_imap`                   | Ne      | Boolean                             | Zda povolit nebo zakázat IMAP úložiště pro tento alias (pokud je zakázáno, příchozí e-maily nebudou ukládány do [IMAP úložiště](/blog/docs/best-quantum-safe-encrypted-email-service). Pokud je hodnota předána, převede se na boolean pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                     |
| `has_pgp`                    | Ne      | Boolean                             | Zda povolit nebo zakázat [OpenPGP šifrování](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pro [IMAP/POP3/CalDAV/CardDAV šifrované e-mailové úložiště](/blog/docs/best-quantum-safe-encrypted-email-service) pomocí veřejného klíče aliasu `public_key`.                                                                                              |
| `public_key`                 | Ne      | Řetězec                              | Veřejný OpenPGP klíč v ASCII Armor formátu ([klikněte zde pro příklad](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); např. GPG klíč pro `support@forwardemail.net`). Platí pouze pokud máte `has_pgp` nastaveno na `true`. [Více o end-to-end šifrování v našem FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                  | Ne      | Řetězec                              | Maximální kvóta úložiště pro tento alias. Nechte prázdné pro reset na aktuální maximální kvótu domény nebo zadejte hodnotu jako "1 GB", která bude zpracována pomocí [bytes](https://github.com/visionmedia/bytes.js). Tuto hodnotu mohou upravovat pouze správci domény.                                                                                                               |
| `vacation_responder_is_enabled` | Ne      | Boolean                             | Zda povolit nebo zakázat automatickou odpověď během dovolené.                                                                                                                                                                                                                                                                                                                              |
| `vacation_responder_start_date` | Ne      | Řetězec                              | Počáteční datum automatické odpovědi během dovolené (pokud je povolena a není zde nastaveno, předpokládá se, že již začala). Podporujeme formáty dat jako `MM/DD/YYYY`, `YYYY-MM-DD` a další díky chytrému parsování pomocí `dayjs`.                                                                                                                                                          |
| `vacation_responder_end_date`   | Ne      | Řetězec                              | Konečné datum automatické odpovědi během dovolené (pokud je povolena a není zde nastaveno, předpokládá se, že nikdy nekončí a odpovídá navždy). Podporujeme formáty dat jako `MM/DD/YYYY`, `YYYY-MM-DD` a další díky chytrému parsování pomocí `dayjs`.                                                                                                                                      |
| `vacation_responder_subject`    | Ne      | Řetězec                              | Předmět v prostém textu pro automatickou odpověď během dovolené, např. "Mimo kancelář". Používáme `striptags` k odstranění veškerého HTML.                                                                                                                                                                                                                                                 |
| `vacation_responder_message`    | Ne      | Řetězec                              | Zpráva v prostém textu pro automatickou odpověď během dovolené, např. "Budu mimo kancelář do února.". Používáme `striptags` k odstranění veškerého HTML.                                                                                                                                                                                                                                     |
> Příklad požadavku:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Získání aliasu domény {#retrieve-domain-alias}

Alias domény můžete získat buď podle jeho `id` nebo podle hodnoty `name`.

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

### Aktualizace aliasu domény {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Tělo parametru                 | Povinné | Typ                                    | Popis                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------ | ------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                         | Ne      | Řetězec                               | Název aliasu                                                                                                                                                                                                                                                                                                                                                                               |
| `recipients`                   | Ne      | Řetězec nebo Pole                     | Seznam příjemců (musí být řetězec oddělený zalomením řádku/mezerou/čárkou nebo pole platných e-mailových adres, plně kvalifikovaných doménových jmen ("FQDN"), IP adres a/nebo URL webhooků)                                                                                                                                                                                               |
| `description`                  | Ne      | Řetězec                               | Popis aliasu                                                                                                                                                                                                                                                                                                                                                                              |
| `labels`                      | Ne      | Řetězec nebo Pole                     | Seznam štítků (musí být řetězec oddělený zalomením řádku/mezerou/čárkou nebo pole)                                                                                                                                                                                                                                                                                                        |
| `has_recipient_verification`   | Ne      | Boolean                              | Vyžadovat, aby příjemci klikli na odkaz pro ověření e-mailu, aby e-maily mohly procházet (výchozí nastavení je podle nastavení domény, pokud není explicitně nastaveno v těle požadavku)                                                                                                                                                                                                   |
| `is_enabled`                   | Ne      | Boolean                              | Zda tento alias povolit nebo zakázat (pokud je zakázán, e-maily nebudou nikam směrovány, ale vrátí úspěšné stavové kódy). Pokud je hodnota předána, je převedena na boolean pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                          |
| `error_code_if_disabled`       | Ne      | Číslo (buď `250`, `421` nebo `550`) | Příchozí e-mail na tento alias bude odmítnut, pokud je `is_enabled` `false`, s kódem `250` (tichá doručení nikam, např. černá díra nebo `/dev/null`), `421` (měkké odmítnutí; a opakování až cca 5 dní) nebo `550` trvalé selhání a odmítnutí. Výchozí hodnota je `250`.                                                                                                                  |
| `has_imap`                    | Ne      | Boolean                              | Zda povolit nebo zakázat IMAP úložiště pro tento alias (pokud je zakázáno, příchozí e-maily nebudou ukládány do [IMAP úložiště](/blog/docs/best-quantum-safe-encrypted-email-service). Pokud je hodnota předána, je převedena na boolean pomocí [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                   |
| `has_pgp`                     | Ne      | Boolean                              | Zda povolit nebo zakázat [OpenPGP šifrování](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pro [IMAP/POP3/CalDAV/CardDAV šifrované úložiště e-mailů](/blog/docs/best-quantum-safe-encrypted-email-service) pomocí `public_key` aliasu.                                                                                                               |
| `public_key`                  | Ne      | Řetězec                              | OpenPGP veřejný klíč ve formátu ASCII Armor ([klikněte zde pro zobrazení příkladu](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); např. GPG klíč pro `support@forwardemail.net`). Toto platí pouze pokud máte `has_pgp` nastaveno na `true`. [Více o end-to-end šifrování v našem FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Ne      | Řetězec                              | Maximální kvóta úložiště pro tento alias. Nechte prázdné pro reset na aktuální maximální kvótu domény nebo zadejte hodnotu jako "1 GB", která bude zpracována pomocí [bytes](https://github.com/visionmedia/bytes.js). Tuto hodnotu mohou upravovat pouze správci domény.                                                                                                               |
| `vacation_responder_is_enabled` | Ne      | Boolean                              | Zda povolit nebo zakázat automatickou odpověď během dovolené.                                                                                                                                                                                                                                                                                                                             |
| `vacation_responder_start_date` | Ne      | Řetězec                              | Počáteční datum automatické odpovědi během dovolené (pokud je povolena a není zde nastaveno počáteční datum, předpokládá se, že již začala). Podporujeme formáty dat jako `MM/DD/YYYY`, `YYYY-MM-DD` a další formáty pomocí chytrého parsování pomocí `dayjs`.                                                                                                                             |
| `vacation_responder_end_date`   | Ne      | Řetězec                              | Konečné datum automatické odpovědi během dovolené (pokud je povolena a není zde nastaveno konečné datum, předpokládá se, že nikdy nekončí a odpovídá navždy). Podporujeme formáty dat jako `MM/DD/YYYY`, `YYYY-MM-DD` a další formáty pomocí chytrého parsování pomocí `dayjs`.                                                                                                         |
| `vacation_responder_subject`    | Ne      | Řetězec                              | Předmět v prostém textu pro automatickou odpověď během dovolené, např. "Mimo kancelář". Používáme `striptags` k odstranění veškerého HTML.                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | Ne      | Řetězec                              | Zpráva v prostém textu pro automatickou odpověď během dovolené, např. "Budu mimo kancelář do února.". Používáme `striptags` k odstranění veškerého HTML.                                                                                                                                                                                                                                   |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Smazat alias domény {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Šifrovat {#encrypt}

Umožňujeme vám šifrovat záznamy i v bezplatném plánu bez poplatků. Soukromí by nemělo být funkcí, mělo by být inherentně zabudováno do všech aspektů produktu. Jak bylo často požadováno v [diskuzi Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) a na [našich GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254), přidali jsme tuto funkci.

### Šifrovat TXT záznam {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Povinný | Typ    | Popis                                        |
| -------------- | ------- | ------ | -------------------------------------------- |
| `input`        | Ano     | String | Jakýkoli platný nešifrovaný TXT záznam Forward Email |

> Example Request:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
