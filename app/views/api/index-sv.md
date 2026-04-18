# Email API {#email-api}


## Innehållsförteckning {#table-of-contents}

* [Bibliotek](#libraries)
* [Bas-URI](#base-uri)
* [Autentisering](#authentication)
  * [API-tokenautentisering (Rekommenderas för de flesta slutpunkter)](#api-token-authentication-recommended-for-most-endpoints)
  * [Aliasuppgifter för autentisering (För utgående e-post)](#alias-credentials-authentication-for-outbound-email)
  * [Endast alias-slutpunkter](#alias-only-endpoints)
* [Fel](#errors)
* [Lokalisering](#localization)
* [Pagination](#pagination)
* [Loggar](#logs)
  * [Hämta loggar](#retrieve-logs)
* [Konto](#account)
  * [Skapa konto](#create-account)
  * [Hämta konto](#retrieve-account)
  * [Uppdatera konto](#update-account)
* [Alias-kontakter (CardDAV)](#alias-contacts-carddav)
  * [Lista kontakter](#list-contacts)
  * [Skapa kontakt](#create-contact)
  * [Hämta kontakt](#retrieve-contact)
  * [Uppdatera kontakt](#update-contact)
  * [Radera kontakt](#delete-contact)
* [Alias-kalendrar (CalDAV)](#alias-calendars-caldav)
  * [Lista kalendrar](#list-calendars)
  * [Skapa kalender](#create-calendar)
  * [Hämta kalender](#retrieve-calendar)
  * [Uppdatera kalender](#update-calendar)
  * [Radera kalender](#delete-calendar)
* [Alias-meddelanden (IMAP/POP3)](#alias-messages-imappop3)
  * [Lista och sök efter meddelanden](#list-and-search-for-messages)
  * [Skapa meddelande](#create-message)
  * [Hämta meddelande](#retrieve-message)
  * [Uppdatera meddelande](#update-message)
  * [Radera meddelande](#delete-message)
* [Alias-mappar (IMAP/POP3)](#alias-folders-imappop3)
  * [Lista mappar](#list-folders)
  * [Skapa mapp](#create-folder)
  * [Hämta mapp](#retrieve-folder)
  * [Uppdatera mapp](#update-folder)
  * [Radera mapp](#delete-folder)
  * [Kopiera mapp](#copy-folder)
* [Utgående e-post](#outbound-emails)
  * [Hämta gräns för utgående SMTP-e-post](#get-outbound-smtp-email-limit)
  * [Lista utgående SMTP-e-post](#list-outbound-smtp-emails)
  * [Skapa utgående SMTP-e-post](#create-outbound-smtp-email)
  * [Hämta utgående SMTP-e-post](#retrieve-outbound-smtp-email)
  * [Radera utgående SMTP-e-post](#delete-outbound-smtp-email)
* [Domäner](#domains)
  * [Lista domäner](#list-domains)
  * [Skapa domän](#create-domain)
  * [Hämta domän](#retrieve-domain)
  * [Verifiera domänposter](#verify-domain-records)
  * [Verifiera domän SMTP-poster](#verify-domain-smtp-records)
  * [Lista domänomfattande catch-all-lösenord](#list-domain-wide-catch-all-passwords)
  * [Skapa domänomfattande catch-all-lösenord](#create-domain-wide-catch-all-password)
  * [Ta bort domänomfattande catch-all-lösenord](#remove-domain-wide-catch-all-password)
  * [Uppdatera domän](#update-domain)
  * [Radera domän](#delete-domain)
* [Inbjudningar](#invites)
  * [Acceptera domäninbjudan](#accept-domain-invite)
  * [Skapa domäninbjudan](#create-domain-invite)
  * [Ta bort domäninbjudan](#remove-domain-invite)
* [Medlemmar](#members)
  * [Uppdatera domänmedlem](#update-domain-member)
  * [Ta bort domänmedlem](#remove-domain-member)
* [Alias](#aliases)
  * [Generera ett aliaslösenord](#generate-an-alias-password)
  * [Lista domänalias](#list-domain-aliases)
  * [Skapa nytt domänalias](#create-new-domain-alias)
  * [Hämta domänalias](#retrieve-domain-alias)
  * [Uppdatera domänalias](#update-domain-alias)
  * [Radera domänalias](#delete-domain-alias)
* [Kryptera](#encrypt)
  * [Kryptera TXT-post](#encrypt-txt-record)


## Bibliotek {#libraries}

Just nu har vi ännu inte släppt några API-wrapper, men vi planerar att göra det inom en snar framtid. Skicka ett e-postmeddelande till <api@forwardemail.net> om du vill bli meddelad när ett API-wrapper för ett visst programmeringsspråk släpps. Under tiden kan du använda dessa rekommenderade HTTP-förfrågningsbibliotek i din applikation, eller helt enkelt använda [curl](https://stackoverflow.com/a/27442239/3586413) som i exemplen nedan.

| Språk     | Bibliotek                                                              |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (vi är underhållare) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (vi är underhållare) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

Den nuvarande HTTP-bas-URI-sökvägen är: `BASE_URI`.


## Autentisering {#authentication}

Alla slutpunkter kräver autentisering med [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Vi stödjer två autentiseringsmetoder:

### API-tokenautentisering (Rekommenderas för de flesta slutpunkter) {#api-token-authentication-recommended-for-most-endpoints}

Ange din [API-nyckel](https://forwardemail.net/my-account/security) som "användarnamn" med ett tomt lösenord:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Observera kolon (`:`) efter API-token – detta indikerar ett tomt lösenord i Basic Auth-format.

### Aliasautentisering (För utgående e-post) {#alias-credentials-authentication-for-outbound-email}

Slutpunkten [Skapa utgående SMTP-e-post](#create-outbound-smtp-email) stödjer också autentisering med din alias-e-postadress och ett [genererat aliaslösenord](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Denna metod är användbar när du skickar e-post från applikationer som redan använder SMTP-uppgifter och gör migrering från SMTP till vårt API smidig.

### Aliasendpunkter {#alias-only-endpoints}

[Alias-kontakter](#alias-contacts-carddav), [Alias-kalendrar](#alias-calendars-caldav), [Alias-meddelanden](#alias-messages-imappop3) och [Alias-mappar](#alias-folders-imappop3) kräver aliasuppgifter och stödjer inte API-tokenautentisering.

Oroa dig inte – exempel finns nedan om du är osäker på vad detta är.


## Fel {#errors}

Om några fel uppstår kommer svarskroppen från API-förfrågan att innehålla ett detaljerat felmeddelande.

| Kod  | Namn                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Felaktig förfrågan    |
| 401  | Obefogad              |
| 403  | Förbjuden             |
| 404  | Hittades inte         |
| 429  | För många förfrågningar |
| 500  | Internt serverfel     |
| 501  | Ej implementerad      |
| 502  | Dålig gateway         |
| 503  | Tjänst otillgänglig   |
| 504  | Gateway-tidsgräns     |

> \[!TIP]
> Om du får en 5xx-statuskod (vilket inte borde hända), vänligen kontakta oss på <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> så hjälper vi dig att lösa ditt problem omedelbart.


## Lokalisering {#localization}

Vår tjänst är översatt till över 25 olika språk. Alla API-svarsmeddelanden översätts till den senaste lokaliseringen som upptäckts för användaren som gör API-förfrågan. Du kan åsidosätta detta genom att skicka en anpassad `Accept-Language`-header. Testa gärna med språkvalet längst ner på denna sida.


## Paginering {#pagination}

> \[!NOTE]
> Från och med 1 november 2024 kommer API-slutpunkterna för [Lista domäner](#list-domains) och [Lista domänalias](#list-domain-aliases) som standard att ha `1000` maxresultat per sida. Om du vill aktivera detta beteende tidigare kan du lägga till `?paginate=true` som en extra frågesträngsparameter till URL:en för slutpunktens förfrågan.

Paginering stöds av alla API-slutpunkter som listar resultat.

Ange helt enkelt frågesträngsegenskaperna `page` (och valfritt `limit`).

Egenskapen `page` ska vara ett tal större än eller lika med `1`. Om du anger `limit` (också ett tal) är minimivärdet `10` och maxvärdet `50` (om inget annat anges).

| Frågesträngsparameter | Obligatorisk | Typ    | Beskrivning                                                                                                                                               |
| --------------------- | ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nej          | Nummer | Sida med resultat att returnera. Om ej angiven är `page` värdet `1`. Måste vara ett tal större än eller lika med `1`.                                     |
| `limit`               | Nej          | Nummer | Antal resultat att returnera per sida. Standard är `10` om ej angiven. Måste vara ett tal större än eller lika med `1` och mindre än eller lika med `50`. |
För att avgöra om fler resultat finns tillgängliga, tillhandahåller vi dessa HTTP-svarshuvuden (som du kan analysera för att paginera programmässigt):

| HTTP Response Header | Exempel                                                                                                                                                                                                                                                  | Beskrivning                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Det totala antalet tillgängliga sidor.                                                                                                                                                                                                                                                                                                                            |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Den aktuella sidan med resultat som returneras (t.ex. baserat på `page` querystring-parameter).                                                                                                                                                                                                                                                                     |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Det totala antalet resultat på den returnerade sidan (t.ex. baserat på `limit` querystring-parameter och faktiska returnerade resultat).                                                                                                                                                                                                                            |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Det totala antalet objekt tillgängliga över alla sidor.                                                                                                                                                                                                                                                                                                           |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Vi tillhandahåller en `Link` HTTP-svarshuvud som du kan analysera som visas i exemplet. Detta är [liknande GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (t.ex. alla värden kommer inte att tillhandahållas om de inte är relevanta eller tillgängliga, t.ex. kommer `"next"` inte att tillhandahållas om det inte finns en annan sida). |
> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Loggar {#logs}

### Hämta loggar {#retrieve-logs}

Vårt API tillåter dig programmässigt att ladda ner loggar för ditt konto. Att skicka en förfrågan till denna endpoint kommer att bearbeta alla loggar för ditt konto och skicka dem till dig som en bilaga via e-post ([Gzip](https://en.wikipedia.org/wiki/Gzip) komprimerad [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) kalkylbladsfil) när det är klart.

Detta gör att du kan skapa bakgrundsjobb med ett [Cron-jobb](https://en.wikipedia.org/wiki/Cron) eller använda vår [Node.js jobbschemaläggningsprogramvara Bree](https://github.com/breejs/bree) för att ta emot loggar när du önskar. Observera att denna endpoint är begränsad till `10` förfrågningar per dag.

Bilagan har formen med små bokstäver `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` och själva e-posten innehåller en kort sammanfattning av de hämtade loggarna. Du kan också ladda ner loggar när som helst från [Mitt konto → Loggar](/my-account/logs)

> `GET /v1/logs/download`

| Querystring Parameter | Obligatorisk | Typ           | Beskrivning                                                                                                                     |
| --------------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Nej          | Sträng (FQDN) | Filtrera loggar efter fullständigt kvalificerat domännamn ("FQDN"). Om du inte anger detta hämtas alla loggar för alla domäner. |
| `q`                   | Nej          | Sträng        | Sök loggar efter e-post, domän, aliasnamn, IP-adress eller datum (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` eller `M.D.YY` format).       |
| `bounce_category`     | Nej          | Sträng        | Sök loggar efter en specifik studskategori (t.ex. `blocklist`).                                                                  |
| `response_code`       | Nej          | Nummer        | Sök loggar efter en specifik felresponskod (t.ex. `421` eller `550`).                                                           |

> Example Request:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Exempel på Cron-jobb (vid midnatt varje dag):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Observera att du kan använda tjänster som [Crontab.guru](https://crontab.guru/) för att validera syntaxen för ditt cron-jobb.

> Exempel på Cron-jobb (vid midnatt varje dag **och med loggar för föregående dag**):

För MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

För Linux och Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Konto {#account}

### Skapa konto {#create-account}

> `POST /v1/account`

| Body Parameter | Obligatorisk | Typ            | Beskrivning    |
| -------------- | ------------ | -------------- | -------------- |
| `email`        | Ja           | Sträng (E-post)| E-postadress   |
| `password`     | Ja           | Sträng         | Lösenord       |

> Example Request:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hämta konto {#retrieve-account}

> `GET /v1/account`

> Example Request:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Uppdatera konto {#update-account}

> `PUT /v1/account`

| Body Parameter | Obligatorisk | Typ            | Beskrivning          |
| -------------- | ------------ | -------------- | -------------------- |
| `email`        | Nej          | Sträng (E-post)| E-postadress         |
| `given_name`   | Nej          | Sträng         | Förnamn              |
| `family_name`  | Nej          | Sträng         | Efternamn            |
| `avatar_url`   | Nej          | Sträng (URL)   | Länk till avatarbild |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias-kontakter (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Till skillnad från andra API-endpoints kräver dessa [Autentisering](#authentication) med "användarnamn" lika med alias-användarnamnet och "lösenord" lika med aliasets genererade lösenord som Basic Authorization headers.
> \[!WARNING]
> Denna endpoint-sektion är ett pågående arbete och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från "Apps"-rullgardinsmenyn i navigeringen på vår webbplats.

### Lista kontakter {#list-contacts}

> `GET /v1/contacts`

**Kommer snart**

### Skapa kontakt {#create-contact}

> `POST /v1/contacts`

**Kommer snart**

### Hämta kontakt {#retrieve-contact}

> `GET /v1/contacts/:id`

**Kommer snart**

### Uppdatera kontakt {#update-contact}

> `PUT /v1/contacts/:id`

**Kommer snart**

### Radera kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Kommer snart**


## Alias-kalendrar (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Till skillnad från andra API-endpoints kräver dessa [Authentication](#authentication) "username" lika med alias-användarnamnet och "password" lika med det alias-genererade lösenordet som Basic Authorization headers.

> \[!WARNING]
> Denna endpoint-sektion är ett pågående arbete och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från "Apps"-rullgardinsmenyn i navigeringen på vår webbplats.

### Lista kalendrar {#list-calendars}

> `GET /v1/calendars`

**Kommer snart**

### Skapa kalender {#create-calendar}

> `POST /v1/calendars`

**Kommer snart**

### Hämta kalender {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Kommer snart**

### Uppdatera kalender {#update-calendar}

> `PUT /v1/calendars/:id`

**Kommer snart**

### Radera kalender {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Kommer snart**


## Alias-meddelanden (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Till skillnad från andra API-endpoints kräver dessa [Authentication](#authentication) "username" lika med alias-användarnamnet och "password" lika med det alias-genererade lösenordet som Basic Authorization headers.

> \[!WARNING]
> Denna endpoint-sektion är ett pågående arbete och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från "Apps"-rullgardinsmenyn i navigeringen på vår webbplats.

Vänligen säkerställ att du har följt installationsinstruktionerna för din domän.

Dessa instruktioner finns i vår FAQ-sektion [Stöder ni att ta emot e-post med IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Lista och sök efter meddelanden {#list-and-search-for-messages}

> `GET /v1/messages`

**Kommer snart**

### Skapa meddelande {#create-message}

> \[!NOTE]
> Detta kommer **INTE** att skicka ett e-postmeddelande – det kommer endast att lägga till meddelandet i din brevlåde-mapp (t.ex. liknande IMAP-kommandot `APPEND`). Om du vill skicka ett e-postmeddelande, se [Skapa utgående SMTP-e-post](#create-outbound-smtp-email) nedan. Efter att ha skapat det utgående SMTP-e-postmeddelandet kan du sedan bifoga en kopia av det med denna endpoint till din alias brevlåda för lagringsändamål.

> `POST /v1/messages`

**Kommer snart**

### Hämta meddelande {#retrieve-message}

> `GET /v1/messages/:id`

**Kommer snart**

### Uppdatera meddelande {#update-message}

> `PUT /v1/messages/:id`

**Kommer snart**

### Radera meddelande {#delete-message}

> `DELETE /v1/messages:id`

**Kommer snart**


## Alias-mappar (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Mapp-endpoints med en mapps sökväg <code>/v1/folders/:path</code> som endpoint är utbytbara med en mapps ID <code>:id</code>. Det betyder att du kan referera till mappen antingen med dess <code>path</code> eller <code>id</code>-värde.

> \[!WARNING]
> Denna endpoint-sektion är ett pågående arbete och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från "Apps"-rullgardinsmenyn i navigeringen på vår webbplats.

### Lista mappar {#list-folders}

> `GET /v1/folders`

**Kommer snart**

### Skapa mapp {#create-folder}

> `POST /v1/folders`

**Kommer snart**

### Hämta mapp {#retrieve-folder}

> `GET /v1/folders/:id`

**Kommer snart**

### Uppdatera mapp {#update-folder}

> `PUT /v1/folders/:id`

**Kommer snart**

### Radera mapp {#delete-folder}

> `DELETE /v1/folders/:id`

**Kommer snart**

### Kopiera mapp {#copy-folder}

> `POST /v1/folders/:id/copy`

**Kommer snart**


## Utgående e-post {#outbound-emails}

Vänligen säkerställ att du har följt installationsinstruktionerna för din domän.

Dessa instruktioner finns på [Mitt konto → Domäner → Inställningar → Utgående SMTP-konfiguration](/my-account/domains). Du behöver säkerställa att DKIM, Return-Path och DMARC är korrekt inställda för att skicka utgående SMTP med din domän.
### Hämta gräns för utgående SMTP-e-post {#get-outbound-smtp-email-limit}

Detta är en enkel endpoint som returnerar ett JSON-objekt innehållande `count` och `limit` för antalet dagliga utgående SMTP-meddelanden per konto.

> `GET /v1/emails/limit`

> Exempel på förfrågan:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Lista utgående SMTP-e-post {#list-outbound-smtp-emails}

Observera att denna endpoint inte returnerar egenskapsvärden för ett e-postmeddelandes `message`, `headers` eller `rejectedErrors`.

För att returnera dessa egenskaper och deras värden, använd [Hämta e-post](#retrieve-email) endpoint med ett e-post-ID.

> `GET /v1/emails`

| Querystring Parameter | Obligatorisk | Typ                       | Beskrivning                                                                                                                                       |
| --------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Nej          | Sträng (RegExp stöds)     | Sök efter e-postmeddelanden via metadata                                                                                                         |
| `domain`              | Nej          | Sträng (RegExp stöds)     | Sök efter e-postmeddelanden via domännamn                                                                                                        |
| `sort`                | Nej          | Sträng                    | Sortera efter ett specifikt fält (prefixa med ett enda bindestreck `-` för att sortera i omvänd riktning). Standard är `created_at` om ej satt.  |
| `page`                | Nej          | Nummer                    | Se [Pagination](#pagination) för mer information                                                                                                |
| `limit`               | Nej          | Nummer                    | Se [Pagination](#pagination) för mer information                                                                                                |

> Exempel på förfrågan:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Skapa utgående SMTP-e-post {#create-outbound-smtp-email}

Vårt API för att skapa ett e-postmeddelande är inspirerat av och använder Nodemailers konfiguration för meddelandealternativ. Vänligen hänvisa till [Nodemailer message configuration](https://nodemailer.com/message/) för alla kroppparametrar nedan.

Observera att med undantag för `envelope` och `dkim` (eftersom vi sätter dessa automatiskt åt dig), stödjer vi alla Nodemailer-alternativ. Vi sätter automatiskt `disableFileAccess` och `disableUrlAccess` till `true` av säkerhetsskäl.

Du bör antingen skicka det enda alternativet `raw` med din råa fullständiga e-post inklusive headers **eller** skicka individuella kroppparameteralternativ nedan.

Denna API-endpoint kodar automatiskt emojis åt dig om de finns i headers (t.ex. en ämnesrad `Subject: 🤓 Hello` konverteras automatiskt till `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Vårt mål var att skapa ett extremt utvecklarvänligt och idiot-säkert e-post-API.

**Autentisering:** Denna endpoint stödjer både [API-token autentisering](#api-token-authentication-recommended-for-most-endpoints) och [alias autentisering](#alias-credentials-authentication-for-outbound-email). Se avsnittet [Autentisering](#authentication) ovan för detaljer.

> `POST /v1/emails`

| Kroppsparameter  | Obligatorisk | Typ              | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Nej          | Sträng (E-post)  | Avsändarens e-postadress (måste finnas som alias för domänen).                                                                                                                                                                                                                                                                                                                                                                                               |
| `to`             | Nej          | Sträng eller Array | Komma-separerad lista eller en Array med mottagare för "To"-headern.                                                                                                                                                                                                                                                                                                                                                                                          |
| `cc`             | Nej          | Sträng eller Array | Komma-separerad lista eller en Array med mottagare för "Cc"-headern.                                                                                                                                                                                                                                                                                                                                                                                          |
| `bcc`            | Nej          | Sträng eller Array | Komma-separerad lista eller en Array med mottagare för "Bcc"-headern.                                                                                                                                                                                                                                                                                                                                                                                         |
| `subject`        | Nej          | Sträng           | Ämnet för e-postmeddelandet.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `text`           | Nej          | Sträng eller Buffer | Textversionen av meddelandet.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `html`           | Nej          | Sträng eller Buffer | HTML-versionen av meddelandet.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `attachments`    | Nej          | Array            | En array med bilagor (se [Nodemailers common fields](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                           |
| `sender`         | Nej          | Sträng           | E-postadressen för "Sender"-headern (se [Nodemailers mer avancerade fält](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                              |
| `replyTo`        | Nej          | Sträng           | E-postadressen för "Reply-To"-headern.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `inReplyTo`      | Nej          | Sträng           | Message-ID som meddelandet svarar på.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `references`     | Nej          | Sträng eller Array | Mellanrum-separerad lista eller en Array med Message-ID:n.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `attachDataUrls` | Nej          | Boolean          | Om `true` konverteras `data:`-bilder i HTML-innehållet till inbäddade bilagor.                                                                                                                                                                                                                                                                                                                                                                                  |
| `watchHtml`      | Nej          | Sträng           | En Apple Watch-specifik HTML-version av meddelandet ([enligt Nodemailer docs](https://nodemailer.com/message/#content-options]), de senaste klockorna kräver inte att detta sätts).                                                                                                                                                                                                                                                                           |
| `amp`            | Nej          | Sträng           | En AMP4EMAIL-specifik HTML-version av meddelandet (se [Nodemailers exempel](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                     |
| `icalEvent`      | Nej          | Objekt           | En iCalendar-händelse att använda som alternativt meddelandeinnehåll (se [Nodemailers kalenderhändelser](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                    |
| `alternatives`   | Nej          | Array            | En Array med alternativt meddelandeinnehåll (se [Nodemailers alternativt innehåll](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                             |
| `encoding`       | Nej          | Sträng           | Kodning för text- och HTML-strängar (standard är `"utf-8"`, men stöder även `"hex"` och `"base64"`).                                                                                                                                                                                                                                                                                                                                                            |
| `raw`            | Nej          | Sträng eller Buffer | Ett anpassat genererat RFC822-format meddelande att använda (istället för ett som genereras av Nodemailer – se [Nodemailers custom source](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                      |
| `textEncoding`   | Nej          | Sträng           | Kodning som tvingas användas för textvärden (antingen `"quoted-printable"` eller `"base64"`). Standardvärdet är det närmaste upptäckta värdet (för ASCII använd `"quoted-printable"`).                                                                                                                                                                                                                                                                         |
| `priority`       | Nej          | Sträng           | Prioritetsnivå för e-postmeddelandet (kan vara `"high"`, `"normal"` (standard) eller `"low"`). Observera att värdet `"normal"` inte sätter någon prioritet-header (detta är standardbeteendet). Om värdet `"high"` eller `"low"` sätts, kommer `X-Priority`, `X-MSMail-Priority` och `Importance` headers [att sättas därefter](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Nej          | Objekt eller Array | Ett Objekt eller en Array med ytterligare headerfält att sätta (se [Nodemailers anpassade headers](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                           |
| `messageId`      | Nej          | Sträng           | Ett valfritt Message-ID-värde för "Message-ID"-headern (ett standardvärde skapas automatiskt om det inte sätts – observera att värdet bör [följa RFC2822-specifikationen](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                |
| `date`           | Nej          | Sträng eller Datum | Ett valfritt datumvärde som används om Date-header saknas efter parsning, annars används aktuell UTC-sträng om ej satt. Datumheadern får inte vara mer än 30 dagar framåt i tiden.                                                                                                                                                                                                                                                                             |
| `list`           | Nej          | Objekt           | Ett valfritt Objekt med `List-*` headers (se [Nodemailers list headers](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                         |
> Exempelbegäran (API-token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exempelbegäran (Aliasuppgifter):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exempelbegäran (Rå e-post):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Hämta utgående SMTP-e-post {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Exempelbegäran:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Radera utgående SMTP-e-post {#delete-outbound-smtp-email}

Radering av e-post kommer att sätta statusen till `"rejected"` (och därefter inte bearbeta den i kön) om och endast om den aktuella statusen är en av `"pending"`, `"queued"`, eller `"deferred"`. Vi kan automatiskt rensa e-postmeddelanden efter 30 dagar efter att de skapades och/eller skickades – därför bör du behålla en kopia av utgående SMTP-e-post i din klient, databas eller applikation. Du kan referera till vårt e-post-ID-värde i din databas om så önskas – detta värde returneras från både [Skapa e-post](#create-email) och [Hämta e-post](#retrieve-email) endpoints.

> `DELETE /v1/emails/:id`

> Exempelbegäran:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domäner {#domains}

> \[!TIP]
> Domänendpoints med en domäns namn <code>/v1/domains/:domain_name</code> som deras endpoint är utbytbara med en domäns ID <code>:domain_id</code>. Detta betyder att du kan referera till domänen antingen med dess <code>name</code> eller <code>id</code>-värde.

### Lista domäner {#list-domains}

> \[!NOTE]
> Från och med 1 november 2024 kommer API-endpoints för [Lista domäner](#list-domains) och [Lista domänalias](#list-domain-aliases) att som standard ha `1000` maxresultat per sida. Om du vill aktivera detta beteende tidigare kan du skicka `?paginate=true` som en extra querystring-parameter till URL:en för endpoint-förfrågan. Se [Pagination](#pagination) för mer information.

> `GET /v1/domains`

| Querystring Parameter | Obligatorisk | Typ                      | Beskrivning                                                                                                                                      |
| --------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nej          | Sträng (RegExp stöds)     | Sök efter domäner efter namn                                                                                                                     |
| `name`                | Nej          | Sträng (RegExp stöds)     | Sök efter domäner efter namn                                                                                                                     |
| `sort`                | Nej          | Sträng                   | Sortera efter ett specifikt fält (prefixa med ett enda bindestreck `-` för att sortera i omvänd riktning av det fältet). Standard är `created_at` om inte satt. |
| `page`                | Nej          | Nummer                   | Se [Pagination](#pagination) för mer information                                                                                                |
| `limit`               | Nej          | Nummer                   | Se [Pagination](#pagination) för mer information                                                                                                |

> Exempelbegäran:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Skapa domän {#create-domain}

> `POST /v1/domains`

| Body Parameter                 | Obligatorisk | Typ                                          | Beskrivning                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | ------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Ja           | Sträng (FQDN eller IP)                        | Fullständigt kvalificerat domännamn ("FQDN") eller IP-adress                                                                                                                                                                                                                                                         |
| `team_domain`                  | Nej          | Sträng (domän-ID eller domännamn; FQDN)      | Tilldela automatiskt denna domän till samma team som en annan domän. Detta innebär att alla medlemmar från denna domän kommer att tilldelas som teammedlemmar, och `plan` kommer automatiskt att sättas till `team` också. Du kan sätta detta till `"none"` om det behövs för att uttryckligen inaktivera detta, men det är inte nödvändigt. |
| `plan`                         | Nej          | Sträng (enumererbar)                          | Plan-typ (måste vara `"free"`, `"enhanced_protection"`, eller `"team"`, standard är `"free"` eller användarens nuvarande betalda plan om sådan finns)                                                                                                                                                               |
| `catchall`                     | Nej          | Sträng (avgränsade e-postadresser) eller Boolean | Skapa en standard catch-all alias, standard är `true` (om `true` används API-användarens e-postadress som mottagare, och om `false` skapas ingen catch-all). Om en sträng skickas är det en avgränsad lista med e-postadresser att använda som mottagare (separerade med radbrytning, mellanslag och/eller komma)     |
| `has_adult_content_protection` | Nej          | Boolean                                       | Om vuxeninnehållsskydd från Spam Scanner ska aktiveras på denna domän                                                                                                                                                                                                                                                 |
| `has_phishing_protection`      | Nej          | Boolean                                       | Om phishing-skydd från Spam Scanner ska aktiveras på denna domän                                                                                                                                                                                                                                                      |
| `has_executable_protection`    | Nej          | Boolean                                       | Om körbar-skydd från Spam Scanner ska aktiveras på denna domän                                                                                                                                                                                                                                                        |
| `has_virus_protection`         | Nej          | Boolean                                       | Om virusskydd från Spam Scanner ska aktiveras på denna domän                                                                                                                                                                                                                                                         |
| `has_recipient_verification`   | Nej          | Boolean                                       | Global domänstandard för om aliasmottagare måste klicka på en e-postverifieringslänk för att e-post ska kunna flöda igenom                                                                                                                                                                                             |
| `ignore_mx_check`              | Nej          | Boolean                                       | Om MX-postkontrollen på domänen ska ignoreras vid verifiering. Detta är främst för användare som har avancerade MX-utbytesregler och behöver behålla sin befintliga MX-utbyte och vidarebefordra till vår.                                                                                                            |
| `retention_days`               | Nej          | Nummer                                        | Heltal mellan `0` och `30` som motsvarar antalet dagar för lagring av utgående SMTP-e-post efter att de framgångsrikt levererats eller permanent felaktats. Standard är `0`, vilket betyder att utgående SMTP-e-post rensas och redigeras omedelbart för din säkerhet.                                               |
| `bounce_webhook`               | Nej          | Sträng (URL) eller Boolean (false)            | Den `http://` eller `https://` webhook-URL du väljer för att skicka bounce-webhooks till. Vi kommer att skicka en `POST`-förfrågan till denna URL med information om utgående SMTP-fel (t.ex. mjuka eller hårda fel – så att du kan hantera dina prenumeranter och programmatisk hantera din utgående e-post).       |
| `max_quota_per_alias`          | Nej          | Sträng                                        | Maximal lagringskvot för alias på detta domännamn. Ange ett värde som "1 GB" som kommer att tolkas av [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                              |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hämta domän {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verifiera domänposter {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifiera domänens SMTP-poster {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Lista domänomfattande catch-all-lösenord {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Skapa domänomfattande catch-all-lösenord {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Required | Type   | Description                                                                                                                                                                                                               |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nej      | String | Ditt egna nya lösenord att använda för det domänomfattande catch-all-lösenordet. Observera att du kan lämna detta tomt eller helt utelämna det från din API-förfrågan om du vill få ett slumpmässigt genererat och starkt lösenord.  Anpassade lösenord för brevlådor måste vara 128 tecken eller färre, får inte börja eller sluta med mellanslag och får inte innehålla citattecken eller apostrofer. Catch-all-lösenord är endast för SMTP-sändning. För IMAP, POP3, CalDAV, CardDAV och brevlådeåtkomst, skapa ett lösenord för den specifika aliasen istället. |
| `description`  | Nej      | String | Beskrivning endast för organisationsändamål.                                                                                                                                                                             |

> Example Request:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Ta bort domänomfattande catch-all-lösenord {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Uppdatera domän {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Required | Type                            | Description                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | Nej      | String eller Number             | Anpassad port att konfigurera för SMTP-vidarebefordran (standard är `"25"`)                                                                                                                                                                                                                   |
| `has_adult_content_protection` | Nej      | Boolean                        | Om skydd mot vuxet innehåll i Spam Scanner ska aktiveras för denna domän                                                                                                                                                                                                                      |
| `has_phishing_protection`      | Nej      | Boolean                        | Om skydd mot nätfiske i Spam Scanner ska aktiveras för denna domän                                                                                                                                                                                                                            |
| `has_executable_protection`    | Nej      | Boolean                        | Om skydd mot körbara filer i Spam Scanner ska aktiveras för denna domän                                                                                                                                                                                                                       |
| `has_virus_protection`         | Nej      | Boolean                        | Om viruskydd i Spam Scanner ska aktiveras för denna domän                                                                                                                                                                                                                                    |
| `has_recipient_verification`   | Nej      | Boolean                        | Global domänstandard för om alias-mottagare måste klicka på en e-postverifieringslänk för att e-post ska kunna skickas vidare                                                                                                                                                                |
| `ignore_mx_check`              | Nej      | Boolean                        | Om MX-postkontrollen på domänen ska ignoreras vid verifiering. Detta är främst för användare som har avancerade MX-utbytesregler och behöver behålla sin befintliga MX-utbyte och vidarebefordra till vår.                                                                                   |
| `retention_days`               | Nej      | Number                         | Heltal mellan `0` och `30` som motsvarar antalet dagar för lagring av utgående SMTP-e-post efter att de framgångsrikt levererats eller permanent felaktiga. Standard är `0`, vilket innebär att utgående SMTP-e-post raderas och redigeras omedelbart för din säkerhet.                      |
| `bounce_webhook`               | Nej      | String (URL) eller Boolean (false) | Den `http://` eller `https://` webhook-URL du väljer för att skicka bounce-webhooks till. Vi skickar en `POST`-förfrågan till denna URL med information om utgående SMTP-fel (t.ex. mjuka eller hårda fel – så att du kan hantera dina prenumeranter och programmera hantering av utgående e-post). |
| `max_quota_per_alias`          | Nej      | String                         | Maximal lagringskvot för alias på denna domän. Ange ett värde som "1 GB" som kommer att tolkas av [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                          |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Ta bort domän {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Inbjudningar {#invites}

### Acceptera domäninbjudan {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Skapa domäninbjudan {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Obligatorisk | Typ                 | Beskrivning                                                                              |
| -------------- | ------------ | ------------------- | ---------------------------------------------------------------------------------------- |
| `email`        | Ja           | Sträng (E-post)     | E-postadress att bjuda in till domänens medlemslista                                    |
| `group`        | Ja           | Sträng (uppräknelig) | Grupp att lägga till användaren i domänmedlemskapet med (kan vara `"admin"` eller `"user"`) |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Om användaren som bjuds in redan är en accepterad medlem i någon annan domän som administratören som bjuder in är medlem i, så kommer inbjudan automatiskt accepteras och inget e-postmeddelande skickas.

### Ta bort domäninbjudan {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Obligatorisk | Typ             | Beskrivning                                      |
| -------------- | ------------ | --------------- | ------------------------------------------------ |
| `email`        | Ja           | Sträng (E-post) | E-postadress att ta bort från domänens medlemslista |

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Medlemmar {#members}

### Uppdatera domänmedlem {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Obligatorisk | Typ                 | Beskrivning                                                                                 |
| -------------- | ------------ | ------------------- | ------------------------------------------------------------------------------------------- |
| `group`        | Ja           | Sträng (uppräknelig) | Grupp att uppdatera användaren till i domänmedlemskapet med (kan vara `"admin"` eller `"user"`) |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Ta bort domänmedlem {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Alias {#aliases}

### Generera ett alias-lösenord {#generate-an-alias-password}

Observera att om du inte skickar instruktioner via e-post, så kommer användarnamnet och lösenordet finnas i JSON-svarskroppen vid en lyckad förfrågan i formatet `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Obligatorisk | Typ     | Beskrivning                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Nej          | Sträng  | Ditt anpassade nya lösenord att använda för aliaset. Observera att du kan lämna detta tomt eller helt utelämna det från din API-förfrågan om du vill få ett slumpmässigt genererat och starkt lösenord.                                                                                           Anpassade lösenord för brevlådor måste vara 128 tecken eller färre, får inte börja eller sluta med mellanslag och får inte innehålla citattecken eller apostrofer. |
| `password`             | Nej          | Sträng  | Befintligt lösenord för aliaset för att ändra lösenordet utan att ta bort den befintliga IMAP-postlådelagringen (se alternativet `is_override` nedan om du inte längre har det befintliga lösenordet).                                                                                              |
| `is_override`          | Nej          | Boolean | **ANVÄND MED FÖRSIKTIGHET**: Detta kommer att skriva över det befintliga alias-lösenordet och databasen helt, och kommer permanent att radera den befintliga IMAP-lagringen och återställa aliasets SQLite-e-postdatabas helt. Vänligen gör en säkerhetskopia om möjligt om du har en befintlig postlåda kopplad till detta alias. |
| `emailed_instructions` | Nej          | Sträng  | E-postadress att skicka aliasets lösenord och installationsinstruktioner till.                                                                                                                                                                                                                     |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Lista domänalias {#list-domain-aliases}

> \[!NOTE]
> Från och med den 1 november 2024 kommer API-endpoints för [Lista domäner](#list-domains) och [Lista domänalias](#list-domain-aliases) som standard att returnera max `1000` resultat per sida. Om du vill aktivera detta beteende tidigare kan du lägga till `?paginate=true` som en extra querystring-parameter till URL:en för endpoint-förfrågan. Se [Pagination](#pagination) för mer information.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring Parameter | Obligatorisk | Typ                       | Beskrivning                                                                                                                                      |
| --------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nej          | Sträng (RegExp stöds)     | Sök efter alias i en domän efter namn, etikett eller mottagare                                                                                   |
| `name`                | Nej          | Sträng (RegExp stöds)     | Sök efter alias i en domän efter namn                                                                                                           |
| `recipient`           | Nej          | Sträng (RegExp stöds)     | Sök efter alias i en domän efter mottagare                                                                                                      |
| `sort`                | Nej          | Sträng                    | Sortera efter ett specifikt fält (prefixa med ett bindestreck `-` för att sortera i omvänd riktning). Standard är `created_at` om inte satt.      |
| `page`                | Nej          | Nummer                    | Se [Pagination](#pagination) för mer information                                                                                               |
| `limit`               | Nej          | Nummer                    | Se [Pagination](#pagination) för mer information                                                                                               |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Skapa nytt domänalias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Body Parameter                  | Obligatorisk | Typ                                   | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nej          | Sträng                               | Aliasnamn (om inte angivet eller om tomt, genereras ett slumpmässigt alias)                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Nej          | Sträng eller Array                   | Lista med mottagare (måste vara radbrytning/blanksteg/komma-separerad sträng eller Array med giltiga e-postadresser, fullständigt kvalificerade domännamn ("FQDN"), IP-adresser och/eller webhook-URL:er – och om inte angivet eller är en tom Array, sätts användarens e-post som gör API-förfrågan som mottagare)                                                                                     |
| `description`                   | Nej          | Sträng                               | Aliasbeskrivning                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nej          | Sträng eller Array                   | Lista med etiketter (måste vara radbrytning/blanksteg/komma-separerad sträng eller Array)                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | Nej          | Boolean                             | Kräver att mottagare klickar på en e-postverifieringslänk för att e-post ska kunna flöda igenom (standard är domänens inställning om inte uttryckligen satt i förfrågningskroppen)                                                                                                                                                                                                        |
| `is_enabled`                    | Nej          | Boolean                             | Om aliaset ska aktiveras eller inaktiveras (om inaktiverat kommer e-post inte att routas någonstans men returnera framgångsrika statuskoder). Om ett värde skickas konverteras det till boolean med hjälp av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | Nej          | Nummer (antingen `250`, `421` eller `550`) | Inkommande e-post till detta alias kommer att avvisas om `is_enabled` är `false` med antingen `250` (tyst leverans till ingenstans, t.ex. svart hål eller `/dev/null`), `421` (mjuk avvisning; och försök igen i upp till ~5 dagar) eller `550` permanent fel och avvisning. Standard är `250`.                                                                                               |
| `has_imap`                      | Nej          | Boolean                             | Om IMAP-lagring ska aktiveras eller inaktiveras för detta alias (om inaktiverat kommer inkommande e-post inte att lagras i [IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service). Om ett värde skickas konverteras det till boolean med hjälp av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | Nej          | Boolean                             | Om [OpenPGP-kryptering](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) ska aktiveras eller inaktiveras för [IMAP/POP3/CalDAV/CardDAV krypterad e-postlagring](/blog/docs/best-quantum-safe-encrypted-email-service) med aliasets `public_key`.                                                                                                         |
| `public_key`                    | Nej          | Sträng                               | OpenPGP publik nyckel i ASCII Armor-format ([klicka här för att se ett exempel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); t.ex. GPG-nyckel för `support@forwardemail.net`). Detta gäller endast om du har `has_pgp` satt till `true`. [Läs mer om end-to-end-kryptering i vår FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nej          | Sträng                               | Maximal lagringskvot för detta alias. Lämna tomt för att återställa till domänens nuvarande maximala kvot eller ange ett värde som "1 GB" som tolkas av [bytes](https://github.com/visionmedia/bytes.js). Detta värde kan endast justeras av domänadministratörer.                                                                                                                                      |
| `vacation_responder_is_enabled` | Nej          | Boolean                             | Om en automatisk semesterfrånvaroresponder ska aktiveras eller inaktiveras.                                                                                                                                                                                                                                                                                                                  |
| `vacation_responder_start_date` | Nej          | Sträng                               | Startdatum för semesterfrånvaroresponder (om aktiverad och inget startdatum anges här, antas den redan vara startad). Vi stödjer datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart tolkning med `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | Nej          | Sträng                               | Slutdatum för semesterfrånvaroresponder (om aktiverad och inget slutdatum anges här, antas den aldrig sluta och svarar för alltid). Vi stödjer datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart tolkning med `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | Nej          | Sträng                               | Ämne i klartext för semesterfrånvaroresponder, t.ex. "Out of Office". Vi använder `striptags` för att ta bort all HTML här.                                                                                                                                                                                                                                                                 |
| `vacation_responder_message`    | Nej          | Sträng                               | Meddelande i klartext för semesterfrånvaroresponder, t.ex. "I will be out of office until February.". Vi använder `striptags` för att ta bort all HTML här.                                                                                                                                                                                                                                               |
> Exempelbegäran:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hämta domänalias {#retrieve-domain-alias}

Du kan hämta ett domänalias antingen via dess `id` eller dess `name`-värde.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Exempelbegäran:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Exempelbegäran:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Uppdatera domänalias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Obligatorisk | Typ                                   | Beskrivning                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nej         | Sträng                                 | Aliasnamn                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Nej         | Sträng eller Array                     | Lista över mottagare (måste vara radbrytning/blanksteg/komma-separerad sträng eller Array av giltiga e-postadresser, fullständigt kvalificerade domännamn ("FQDN"), IP-adresser och/eller webhook-URL:er)                                                                                                                                                                                       |
| `description`                   | Nej         | Sträng                                 | Aliasbeskrivning                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nej         | Sträng eller Array                     | Lista över etiketter (måste vara radbrytning/blanksteg/komma-separerad sträng eller Array)                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | Nej         | Boolean                               | Kräver att mottagare klickar på en e-postverifieringslänk för att e-post ska kunna skickas vidare (standardinställning är domänens inställning om det inte uttryckligen anges i förfrågans kropp)                                                                                                                                                                                             |
| `is_enabled`                    | Nej         | Boolean                               | Om detta alias ska aktiveras eller inaktiveras (om inaktiverat kommer e-post inte att routas någonstans men returnera framgångsrika statuskoder). Om ett värde anges konverteras det till boolean med hjälp av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                               |
| `error_code_if_disabled`        | Nej         | Nummer (antingen `250`, `421` eller `550`) | Inkommande e-post till detta alias kommer att avvisas om `is_enabled` är `false` med antingen `250` (tyst leverans till ingenstans, t.ex. svart hål eller `/dev/null`), `421` (mjuk avvisning; och försök igen i upp till ~5 dagar) eller `550` permanent fel och avvisning. Standard är `250`.                                                                                              |
| `has_imap`                      | Nej         | Boolean                               | Om IMAP-lagring ska aktiveras eller inaktiveras för detta alias (om inaktiverat kommer inkommande e-post som tas emot inte att lagras i [IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service). Om ett värde anges konverteras det till boolean med hjälp av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                        |
| `has_pgp`                       | Nej         | Boolean                               | Om [OpenPGP-kryptering](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) ska aktiveras eller inaktiveras för [IMAP/POP3/CalDAV/CardDAV-krypterad e-postlagring](/blog/docs/best-quantum-safe-encrypted-email-service) med aliasets `public_key`.                                                                                                         |
| `public_key`                    | Nej         | Sträng                                 | OpenPGP publik nyckel i ASCII Armor-format ([klicka här för att se ett exempel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); t.ex. GPG-nyckel för `support@forwardemail.net`). Detta gäller endast om du har `has_pgp` satt till `true`. [Läs mer om end-to-end-kryptering i vår FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nej         | Sträng                                 | Maximal lagringskvot för detta alias. Lämna tomt för att återställa till domänens nuvarande maximala kvot eller ange ett värde som "1 GB" som tolkas av [bytes](https://github.com/visionmedia/bytes.js). Detta värde kan endast justeras av domänadministratörer.                                                                                                                        |
| `vacation_responder_is_enabled` | Nej         | Boolean                               | Om en automatisk semesterfrånvaroresponder ska aktiveras eller inaktiveras.                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | Nej         | Sträng                                 | Startdatum för semesterfrånvaroresponder (om aktiverad och inget startdatum anges här, antas den redan ha startat). Vi stödjer datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart tolkning med `dayjs`.                                                                                                                                                              |
| `vacation_responder_end_date`   | Nej         | Sträng                                 | Slutdatum för semesterfrånvaroresponder (om aktiverad och inget slutdatum anges här, antas den aldrig sluta och svarar för alltid). Vi stödjer datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart tolkning med `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | Nej         | Sträng                                 | Ämne i klartext för semesterfrånvaroresponder, t.ex. "Out of Office". Vi använder `striptags` för att ta bort all HTML här.                                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | Nej         | Sträng                                 | Meddelande i klartext för semesterfrånvaroresponder, t.ex. "I will be out of office until February.". Vi använder `striptags` för att ta bort all HTML här.                                                                                                                                                                                                                               |
> Exempelbegäran:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Ta bort domänalias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Exempelbegäran:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Kryptera {#encrypt}

Vi tillåter dig att kryptera poster även på gratisplanen utan kostnad. Integritet ska inte vara en funktion, det ska vara inbyggt i alla delar av en produkt. Som starkt efterfrågat i en [Privacy Guides-diskussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) och på [våra GitHub-ärenden](https://github.com/forwardemail/forwardemail.net/issues/254) har vi lagt till detta.

### Kryptera TXT-post {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Obligatorisk | Typ    | Beskrivning                                  |
| -------------- | ------------ | ------ | -------------------------------------------- |
| `input`        | Ja           | String | Vilken giltig Forward Email-plaintext TXT-post som helst |

> Exempelbegäran:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
