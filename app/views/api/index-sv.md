# E-post-API {#email-api}

## Innehållsförteckning {#table-of-contents}

* [Bibliotek](#libraries)
* [Bas-URI](#base-uri)
* [Autentisering](#authentication)
* [Fel](#errors)
* [Lokalisering](#localization)
* [Paginering](#pagination)
* [Loggar](#logs)
  * [Hämta loggar](#retrieve-logs)
* [Konto](#account)
  * [Skapa konto](#create-account)
  * [Hämta konto](#retrieve-account)
  * [Uppdatera konto](#update-account)
* [Aliaskontakter (CardDAV)](#alias-contacts-carddav)
  * [Lista kontakter](#list-contacts)
  * [Skapa kontakt](#create-contact)
  * [Hämta kontakt](#retrieve-contact)
  * [Uppdatera kontakt](#update-contact)
  * [Ta bort kontakt](#delete-contact)
* [Aliaskalendrar (CalDAV)](#alias-calendars-caldav)
  * [Lista kalendrar](#list-calendars)
  * [Skapa kalender](#create-calendar)
  * [Hämta kalender](#retrieve-calendar)
  * [Uppdatera kalendern](#update-calendar)
  * [Ta bort kalender](#delete-calendar)
* [Aliasmeddelanden (IMAP/POP3)](#alias-messages-imappop3)
  * [Lista och sök efter meddelanden](#list-and-search-for-messages)
  * [Skapa meddelande](#create-message)
  * [Hämta meddelande](#retrieve-message)
  * [Uppdatera meddelande](#update-message)
  * [Ta bort meddelande](#delete-message)
* [Aliasmappar (IMAP/POP3)](#alias-folders-imappop3)
  * [Lista mappar](#list-folders)
  * [Skapa mapp](#create-folder)
  * [Hämta mapp](#retrieve-folder)
  * [Uppdatera mapp](#update-folder)
  * [Ta bort mapp](#delete-folder)
  * [Kopiera mapp](#copy-folder)
* [Utgående e-postmeddelanden](#outbound-emails)
  * [Hämta gräns för utgående SMTP-e-post](#get-outbound-smtp-email-limit)
  * [Lista utgående SMTP-e-postmeddelanden](#list-outbound-smtp-emails)
  * [Skapa utgående SMTP-e-post](#create-outbound-smtp-email)
  * [Hämta utgående SMTP-e-post](#retrieve-outbound-smtp-email)
  * [Ta bort utgående SMTP-e-post](#delete-outbound-smtp-email)
* [Domäner](#domains)
  * [Lista domäner](#list-domains)
  * [Skapa domän](#create-domain)
  * [Hämta domän](#retrieve-domain)
  * [Verifiera domänposter](#verify-domain-records)
  * [Verifiera domänens SMTP-poster](#verify-domain-smtp-records)
  * [Lista domänomfattande lösenord med alla lösenord](#list-domain-wide-catch-all-passwords)
  * [Skapa ett domänomfattande lösenord](#create-domain-wide-catch-all-password)
  * [Ta bort domänomfattande lösenord](#remove-domain-wide-catch-all-password)
  * [Uppdatera domän](#update-domain)
  * [Ta bort domän](#delete-domain)
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
  * [Ta bort domänalias](#delete-domain-alias)
* [Kryptera](#encrypt)
  * [Kryptera TXT-post](#encrypt-txt-record)

## Bibliotek {#libraries}

Just nu har vi inte släppt några API-omslag, men vi planerar att göra det inom en snar framtid. Skicka ett e-postmeddelande till <api@forwardemail.net> om du vill bli meddelad när ett visst programmeringsspråks API-omslag släpps. Under tiden kan du använda dessa rekommenderade HTTP-förfrågningsbibliotek i din applikation, eller helt enkelt använda [ringla](https://stackoverflow.com/a/27442239/3586413) som i exemplen nedan.

| Språk | Bibliotek |
| ---------- | ---------------------------------------------------------------------- |
| Rubin | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (vi är underhållare) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (vi är underhållare) |
| Gå | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Bas-URI {#base-uri}

Den nuvarande HTTP-bas-URI-sökvägen är: `BASE_URI`.

## Autentisering {#authentication}

Alla slutpunkter kräver att din [API-nyckel](https://forwardemail.net/my-account/security) anges som värdet "användarnamn" i begäranens [Grundläggande auktorisering](https://en.wikipedia.org/wiki/Basic_access_authentication)-rubrik (med undantag för [Aliaskontakter](#alias-contacts), [Aliaskalendrar](#alias-calendars) och [Alias-brevlådor](#alias-mailboxes) som använder en [genererat alias användarnamn och lösenord](/faq#do-you-support-receiving-email-with-imap)).

Oroa dig inte – exempel finns nedan om du är osäker på vad det här är.

## Fel {#errors}

Om några fel uppstår kommer svarstexten i API-begäran att innehålla ett detaljerat felmeddelande.

| Koda | Namn |
| ---- | --------------------- |
| 200 | OK |
| 400 | Felaktig begäran |
| 401 | Obehörig |
| 403 | Förbjuden |
| 404 | Inte hittad |
| 429 | För många förfrågningar |
| 500 | Internt serverfel |
| 501 | Inte implementerad |
| 502 | Dålig gateway |
| 503 | Tjänsten är inte tillgänglig |
| 504 | Gateway-timeout |

> \[!TIP]
> Om du får statuskoden 5xx (vilket inte borde hända), vänligen kontakta oss på <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> så hjälper vi dig att lösa problemet omedelbart.

## Lokalisering {#localization}

Vår tjänst är översatt till över 25 olika språk. Alla API-svarsmeddelanden översätts till den senast identifierade språkinställningen för användaren som gjorde API-förfrågan. Du kan åsidosätta detta genom att skicka en anpassad `Accept-Language`-rubrik. Testa gärna med hjälp av språkmenyn längst ner på den här sidan.

## Sidnumrering {#pagination}

> \[!NOTE]
> Från och med den 1 november 2024 kommer API-slutpunkterna för [Lista domäner](#list-domains) och [Lista domänalias](#list-domain-aliases) som standard att ha max `1000` resultat per sida. Om du vill välja att använda detta beteende tidigt kan du skicka `?paginate=true` som en extra frågesträngsparameter till URL:en för slutpunktsfrågan.

Paginering stöds av alla API-slutpunkter som listar resultat.

Ange helt enkelt frågesträngegenskaperna `page` (och valfritt `limit`).

Egenskapen `page` ska vara ett tal större än eller lika med `1`. Om du anger `limit` (också ett tal) är det minsta värdet `10` och det högsta värdet `50` (om inget annat anges).

| Frågesträngparametrar | Nödvändig | Typ | Beskrivning |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Inga | Antal | Resultatsida som ska returneras. Om inget anges blir värdet `page` `1`. Måste vara ett tal större än eller lika med `1`. |
| `limit` | Inga | Antal | Antal resultat att returnera per sida. Standardvärdet är `10` om inget anges. Måste vara ett tal större än eller lika med `1`, och mindre än eller lika med `50`. |

För att avgöra om fler resultat finns tillgängliga tillhandahåller vi dessa HTTP-svarsrubriker (som du kan analysera för att paginera programmatiskt):

| HTTP-svarsrubrik | Exempel | Beskrivning |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Det totala tillgängliga sidantalet. |
| `X-Page-Current` | `X-Page-Current: 1` | Den aktuella sidan med resultat som returneras (t.ex. baserat på frågesträngsparametern `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Det totala antalet resultat på sidan som returnerades (t.ex. baserat på `limit` frågesträngsparametern och faktiska resultat som returnerades). |
| `X-Item-Count` | `X-Item-Count: 30` | Det totala antalet tillgängliga objekt på alla sidor. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Vi tillhandahåller en `Link` HTTP-svarsrubrik som du kan analysera enligt exemplet. Detta är [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (t.ex. kommer inte alla värden att tillhandahållas om de inte är relevanta eller tillgängliga, t.ex. kommer `"next"` inte att tillhandahållas om det inte finns någon annan sida). |

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Loggar {#logs}

### Hämta loggar {#retrieve-logs}

Vårt API låter dig programmatiskt ladda ner loggar för ditt konto. Om du skickar en begäran till denna slutpunkt bearbetas alla loggar för ditt konto och skickas till dig via e-post som en bilaga ([Gzip](https://en.wikipedia.org/wiki/Gzip) komprimerad [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) kalkylbladsfil) när den är klar.

Detta gör att du kan skapa bakgrundsjobb med en [Cron-jobb](https://en.wikipedia.org/wiki/Cron) eller använda vår [Node.js jobbplaneringsprogramvara Bree](https://github.com/breejs/bree) för att ta emot loggar när du vill. Observera att denna slutpunkt är begränsad till `10` förfrågningar per dag.

Bilagan är i gemener för `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` och själva e-postmeddelandet innehåller en kort sammanfattning av de hämtade loggarna. Du kan också ladda ner loggar när som helst från [Mitt konto → Loggar](/my-account/logs).

> `GET /v1/logs/download`

| Frågesträngparametrar | Nödvändig | Typ | Beskrivning |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Inga | Sträng (FQDN) | Filtrera loggar efter fullständigt kvalificerad domän ("FQDN"). Om du inte anger detta kommer alla loggar över alla domäner att hämtas. |
| `q` | Inga | Sträng | Sök efter loggar efter e-postadress, domän, aliasnamn, IP-adress eller datum (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` eller `M.D.YY`). |
| `bounce_category` | Inga | Sträng | Sök efter loggar efter en specifik avvisningskategori (t.ex. `blocklist`). |
| `response_code` | Inga | Antal | Sök efter loggar med en specifik felkod (t.ex. `421` eller `550`). |

> Exempelförfrågan:

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

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ja | Sträng (e-post) | E-postadress |
| `password` | Ja | Sträng | Lösenord |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hämta konto {#retrieve-account}

> `GET /v1/account`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Uppdatera konto {#update-account}

> `PUT /v1/account`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Inga | Sträng (e-post) | E-postadress |
| `given_name` | Inga | Sträng | Förnamn |
| `family_name` | Inga | Sträng | Efternamn |
| `avatar_url` | Inga | Sträng (URL) | Länk till avatarbild |

> Exempelförfrågan:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Aliaskontakter (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Till skillnad från andra API-slutpunkter kräver dessa [Autentisering](#authentication) "användarnamn" lika med aliasanvändarnamnet och "lösenord" lika med det aliasgenererade lösenordet som grundläggande auktoriseringsrubriker.

> \[!WARNING]
> Detta slutpunktsavsnitt är under utveckling och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från rullgardinsmenyn "Appar" i navigeringen på vår webbplats.

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

### Ta bort kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Kommer snart**

## Aliaskalendrar (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Till skillnad från andra API-slutpunkter kräver dessa [Autentisering](#authentication) "användarnamn" lika med aliasanvändarnamnet och "lösenord" lika med det aliasgenererade lösenordet som grundläggande auktoriseringsrubriker.

> \[!WARNING]
> Detta slutpunktsavsnitt är under utveckling och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från rullgardinsmenyn "Appar" i navigeringen på vår webbplats.

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

### Ta bort kalendern {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Kommer snart**

## Aliasmeddelanden (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Till skillnad från andra API-slutpunkter kräver dessa [Autentisering](#authentication) "användarnamn" lika med aliasanvändarnamnet och "lösenord" lika med det aliasgenererade lösenordet som grundläggande auktoriseringsrubriker.

> \[!WARNING]
> Detta slutpunktsavsnitt är under utveckling och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från rullgardinsmenyn "Appar" i navigeringen på vår webbplats.

Se till att du har följt installationsanvisningarna för din domän.

Dessa instruktioner finns i vår FAQ-sektion [Stöder ni att ta emot e-post med IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Lista och sök efter meddelanden {#list-and-search-for-messages}

> `GET /v1/messages`

**Kommer snart**

### Skapa meddelande {#create-message}

> \[!NOTE]
> Detta kommer **INTE** att skicka ett e-postmeddelande – det kommer bara att lägga till meddelandet i din inkorgsmapp (t.ex. liknar detta IMAP-kommandot `APPEND`). Om du vill skicka ett e-postmeddelande, se [Skapa utgående SMTP-e-post](#create-outbound-smtp-email) nedan. Efter att du har skapat det utgående SMTP-e-postmeddelandet kan du lägga till en kopia av det med hjälp av denna slutpunkt till ditt alias inkorg för lagringsändamål.

> `POST /v1/messages`

**Kommer snart**

### Hämta meddelande {#retrieve-message}

> `GET /v1/messages/:id`

**Kommer snart**

### Uppdatera meddelande {#update-message}

> `PUT /v1/messages/:id`

**Kommer snart**

### Ta bort meddelande {#delete-message}

> `DELETE /v1/messages:id`

**Kommer snart**

## Aliasmappar (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Mappslutpunkter med en mapps sökväg <code>/v1/folders/:path</code> som slutpunkt är utbytbara mot en mapps ID <code>:id</code>. Det betyder att du kan referera till mappen med antingen dess <code>path</code>- eller <code>id</code>-värde.

> \[!WARNING]
> Detta slutpunktsavsnitt är under utveckling och kommer (förhoppningsvis) att släppas under 2024. Under tiden, vänligen använd en IMAP-klient från rullgardinsmenyn "Appar" i navigeringen på vår webbplats.

### Lista mappar {#list-folders}

> `GET /v1/folders`

**Kommer snart**

### Skapa mapp {#create-folder}

> `POST /v1/folders`

**Kommer snart**

### Hämta mapp {#retrieve-folder}

> `GET /v1/folders/:id`

**Kommer snart**

### Uppdatera mappen {#update-folder}

> `PUT /v1/folders/:id`

**Kommer snart**

### Ta bort mappen {#delete-folder}

> `DELETE /v1/folders/:id`

**Kommer snart**

### Kopiera mapp {#copy-folder}

> `POST /v1/folders/:id/copy`

**Kommer snart**

## Utgående e-postmeddelanden {#outbound-emails}

Se till att du har följt installationsanvisningarna för din domän.

Dessa instruktioner finns på [Mitt konto → Domäner → Inställningar → Utgående SMTP-konfiguration](/my-account/domains). Du måste se till att DKIM, Return-Path och DMARC är konfigurerade för att skicka utgående SMTP med din domän.

### Hämta gräns för utgående SMTP-e-post {#get-outbound-smtp-email-limit}

Detta är en enkel slutpunkt som returnerar ett JSON-objekt som innehåller `count` och `limit` för antalet dagliga utgående SMTP-meddelanden per konto.

> `GET /v1/emails/limit`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Lista utgående SMTP-e-postmeddelanden {#list-outbound-smtp-emails}

Observera att denna slutpunkt inte returnerar egenskapsvärden för ett e-postmeddelandes `message`, `headers` eller `rejectedErrors`.

För att returnera dessa egenskaper och deras värden, använd slutpunkten [Hämta e-post](#retrieve-email) med ett e-post-ID.

> `GET /v1/emails`

| Frågesträngparametrar | Nödvändig | Typ | Beskrivning |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Inga | Sträng (RegExp stöds) | Sök efter e-postmeddelanden med hjälp av metadata |
| `domain` | Inga | Sträng (RegExp stöds) | Sök efter e-postmeddelanden efter domännamn |
| `sort` | Inga | Sträng | Sortera efter ett specifikt fält (använd prefixet `-` för att sortera i omvänd riktning jämfört med det fältet). Standardvärdet är `created_at` om det inte är angivet. |
| `page` | Inga | Antal | Se [Pagination](#pagination) för mer insikt |
| `limit` | Inga | Antal | Se [Pagination](#pagination) för mer insikt |

> Exempelförfrågan:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Skapa utgående SMTP-e-post {#create-outbound-smtp-email}

Vårt API för att skapa ett e-postmeddelande är inspirerat av och använder Nodemailers konfiguration av meddelandealternativ. Vänligen hänvisa till [Konfiguration av Nodemailer-meddelande](https://nodemailer.com/message/) för alla brödtextparametrar nedan.

Observera att med undantag för `envelope` och `dkim` (eftersom vi ställer in dem automatiskt åt dig) stöder vi alla Nodemailer-alternativ. Vi ställer automatiskt in alternativen `disableFileAccess` och `disableUrlAccess` till `true` av säkerhetsskäl.

Du bör antingen skicka det enda alternativet `raw` med din fullständiga råa e-postadress inklusive rubriker **eller** skicka individuella alternativ för brödtextparametern nedan.

Denna API-slutpunkt kommer automatiskt att koda emojis åt dig om de finns i rubrikerna (t.ex. konverteras ämnesraden `Subject: 🤓 Hello` automatiskt till `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Vårt mål var att skapa ett extremt utvecklarvänligt och dummysäkert e-post-API.

> `POST /v1/emails`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Inga | Sträng (e-post) | Avsändarens e-postadress (måste finnas som ett alias för domänen). |
| `to` | Inga | Sträng eller array | Kommaavgränsad lista eller en array med mottagare för "Till"-rubriken. |
| `cc` | Inga | Sträng eller array | Kommaavgränsad lista eller en array med mottagare för rubriken "Cc". |
| `bcc` | Inga | Sträng eller array | Kommaavgränsad lista eller en array med mottagare för rubriken "Bcc". |
| `subject` | Inga | Sträng | Ämnet för e-postmeddelandet. |
| `text` | Inga | Sträng eller buffert | Klartextversionen av meddelandet. |
| `html` | Inga | Sträng eller buffert | HTML-versionen av meddelandet. |
| `attachments` | Inga | Matris | En array av bilagor (se [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Inga | Sträng | E-postadressen för rubriken "Avsändare" (se [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Inga | Sträng | E-postadressen för rubriken "Svara till". |
| `inReplyTo` | Inga | Sträng | Meddelande-ID som meddelandet är som svar på. |
| `references` | Inga | Sträng eller array | Mellanslagsavgränsad lista eller en array av meddelande-ID:n. |
| `attachDataUrls` | Inga | Booleansk | Om `true` konverteras `data:` bilder i meddelandets HTML-innehåll till inbäddade bilagor. |
| `watchHtml` | Inga | Sträng | En Apple Watch-specifik HTML-version av meddelandet ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), de senaste klockorna kräver inte att detta ställs in). |
| `amp` | Inga | Sträng | En AMP4EMAIL-specifik HTML-version av meddelandet (se [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Inga | Objekt | En iCalendar-händelse att använda som alternativt meddelandeinnehåll (se [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Inga | Matris | En array med alternativt meddelandeinnehåll (se [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Inga | Sträng | Kodning för text och HTML-strängar (standard är `"utf-8"`, men stöder även kodningsvärdena `"hex"` och `"base64"`). |
| `raw` | Inga | Sträng eller buffert | Ett specialgenererat meddelande i RFC822-format att använda (istället för ett som genereras av Nodemailer – se [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Inga | Sträng | Kodning som tvingas användas för textvärden (antingen `"quoted-printable"` eller `"base64"`). Standardvärdet är det närmaste värdet som upptäcks (för ASCII använd `"quoted-printable"`). |
| `priority` | Inga | Sträng | Prioritetsnivå för e-postmeddelandet (kan antingen vara `"high"`, `"normal"` (standard) eller `"low"`). Observera att värdet `"normal"` inte anger en prioritetsrubrik (detta är standardbeteendet). Om värdet `"high"` eller `"low"` är inställt, så blir rubrikerna `X-Priority`, `X-MSMail-Priority` och `Importance` [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Inga | Objekt eller array | Ett objekt eller en array med ytterligare rubrikfält att ange (se [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Inga | Sträng | Ett valfritt Message-ID-värde för rubriken "Message-ID" (ett standardvärde skapas automatiskt om det inte anges – observera att värdet ska vara [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Inga | Sträng eller datum | Ett valfritt datumvärde som används om datumrubriken saknas efter parsning, annars används den aktuella UTC-strängen om den inte anges. Datumrubriken får inte vara mer än 30 dagar före aktuell tid. |
| `list` | Inga | Objekt | Ett valfritt objekt med `List-*`-rubriker (se [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Hämta utgående SMTP-e-post {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Ta bort utgående SMTP-e-post {#delete-outbound-smtp-email}

Borttagning av e-postmeddelanden kommer att sätta statusen till `"rejected"` (och därefter inte bearbeta den i kön) om och endast om den aktuella statusen är en av `"pending"`, `"queued"` eller `"deferred"`. Vi kan komma att rensa e-postmeddelanden automatiskt 30 dagar efter att de skapades och/eller skickades – därför bör du behålla en kopia av utgående SMTP-e-postmeddelanden i din klient, databas eller applikation. Du kan referera till vårt e-post-ID-värde i din databas om så önskas – detta värde returneras från både [Skapa e-post](#create-email) och [Hämta e-post](#retrieve-email) slutpunkter.

> `DELETE /v1/emails/:id`

> Exempelförfrågan:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domäner {#domains}

> \[!TIP]
> Domänslutpunkter med domännamnet <code>/v1/domains/:domain_name</code> som slutpunkt är utbytbara mot domänens ID <code>:domain_id</code>. Det betyder att du kan referera till domänen med antingen dess <code>name</code>- eller <code>id</code>-värde.

### Lista domäner {#list-domains}

> \[!NOTE]
> Från och med den 1 november 2024 kommer API-slutpunkterna för [Lista domäner](#list-domains) och [Lista domänalias](#list-domain-aliases) som standard att ha max `1000` resultat per sida. Om du vill välja att använda detta beteende tidigt kan du skicka `?paginate=true` som en extra frågesträngsparameter till URL:en för slutpunktsfrågan. Se [Paginering](#pagination) för mer information.

> `GET /v1/domains`

| Frågesträngparametrar | Nödvändig | Typ | Beskrivning |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Inga | Sträng (RegExp stöds) | Sök efter domäner efter namn |
| `name` | Inga | Sträng (RegExp stöds) | Sök efter domäner efter namn |
| `sort` | Inga | Sträng | Sortera efter ett specifikt fält (använd prefixet `-` för att sortera i omvänd riktning jämfört med det fältet). Standardvärdet är `created_at` om det inte är angivet. |
| `page` | Inga | Antal | Se [Pagination](#pagination) för mer insikt |
| `limit` | Inga | Antal | Se [Pagination](#pagination) för mer insikt |

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Skapa domän {#create-domain}

> `POST /v1/domains`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ja | Sträng (FQDN eller IP) | Fullständigt kvalificerat domännamn ("FQDN") eller IP-adress |
| `team_domain` | Inga | Sträng (domän-ID eller domännamn; FQDN) | Tilldela automatiskt denna domän till samma team från en annan domän. Det betyder att alla medlemmar från denna domän kommer att tilldelas som teammedlemmar, och `plan` kommer automatiskt också att ställas in på `team`. Du kan ställa in detta på `"none"` om det behövs för att explicit inaktivera detta, men det är inte nödvändigt. |
| `plan` | Inga | Sträng (uppräknningsbar) | Abonnemangstyp (måste vara `"free"`, `"enhanced_protection"` eller `"team"`, standardinställningen är `"free"` eller användarens nuvarande betalda abonnemang om sådant finns) |
| `catchall` | Inga | Sträng (avgränsade e-postadresser) eller boolesk | Skapa ett standardalias för catch-all, standardvärdet är `true` (om `true` används API-användarens e-postadress som mottagare, och om `false` skapas ingen catch-all). Om en sträng skickas är det en avgränsad lista med e-postadresser som ska användas som mottagare (avgränsade med radbrytning, mellanslag och/eller kommatecken). |
| `has_adult_content_protection` | Inga | Booleansk | Huruvida skydd mot vuxeninnehåll ska aktiveras för Spam Scanner på den här domänen |
| `has_phishing_protection` | Inga | Booleansk | Huruvida Spam Scanner ska aktivera nätfiskeskydd på den här domänen |
| `has_executable_protection` | Inga | Booleansk | Huruvida skydd för körbara filer i Spam Scanner ska aktiveras på den här domänen |
| `has_virus_protection` | Inga | Booleansk | Huruvida Spam Scanner-virusskydd ska aktiveras på den här domänen |
| `has_recipient_verification` | Inga | Booleansk | Global domänstandard för om aliasmottagare ska behöva klicka på en e-postverifieringslänk för att e-postmeddelanden ska kunna skickas vidare |
| `ignore_mx_check` | Inga | Booleansk | Huruvida MX-postkontrollen på domänen ska ignoreras för verifiering. Detta är främst för användare som har avancerade MX-utbyteskonfigurationsregler och behöver behålla sin befintliga MX-utbyte och vidarebefordra till vår. |
| `retention_days` | Inga | Antal | Heltal mellan `0` och `30` som motsvarar antalet lagringsdagar för att lagra utgående SMTP-e-postmeddelanden när de har levererats eller fått permanent fel. Standardvärdet är `0`, vilket innebär att utgående SMTP-e-postmeddelanden rensas och redigeras omedelbart för din säkerhet. |
| `bounce_webhook` | Inga | Sträng (URL) eller booleskt (falskt) | Webhookens URL för `http://` eller `https://` som du väljer att skicka studsande webhooks till. Vi skickar en `POST`-förfrågan till denna URL med information om utgående SMTP-fel (t.ex. mjuka eller hårda fel – så att du kan hantera dina prenumeranter och programmatiskt hantera din utgående e-post). |
| `max_quota_per_alias` | Inga | Sträng | Maximal lagringskvot för alias på detta domännamn. Ange ett värde som "1 GB" som kommer att analyseras av [bytes](https://github.com/visionmedia/bytes.js). |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hämta domän {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verifiera domänposter {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifiera domänens SMTP-poster {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Lista domänomfattande lösenord {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Skapa domänomfattande lösenord {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Inga | Sträng | Ditt anpassade nya lösenord som ska användas för det domänomfattande catch-all-lösenordet. Observera att du kan lämna detta tomt eller helt sakna detta i din API-förfrågningstext om du vill ha ett slumpmässigt genererat och starkt lösenord. |
| `description` | Inga | Sträng | Beskrivning endast för organisationsändamål. |

> Exempelförfrågan:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Ta bort domänomfattande lösenord {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Exempelförfrågan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Uppdatera domänen {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Inga | Sträng eller tal | Anpassad port att konfigurera för SMTP-vidarebefordran (standard är `"25"`) |
| `has_adult_content_protection` | Inga | Booleansk | Huruvida skydd mot vuxeninnehåll ska aktiveras för Spam Scanner på den här domänen |
| `has_phishing_protection` | Inga | Booleansk | Huruvida Spam Scanner ska aktivera nätfiskeskydd på den här domänen |
| `has_executable_protection` | Inga | Booleansk | Huruvida skydd för körbara filer i Spam Scanner ska aktiveras på den här domänen |
| `has_virus_protection` | Inga | Booleansk | Huruvida Spam Scanner-virusskydd ska aktiveras på den här domänen |
| `has_recipient_verification` | Inga | Booleansk | Global domänstandard för om aliasmottagare ska behöva klicka på en e-postverifieringslänk för att e-postmeddelanden ska kunna skickas vidare |
| `ignore_mx_check` | Inga | Booleansk | Huruvida MX-postkontrollen på domänen ska ignoreras för verifiering. Detta är främst för användare som har avancerade MX-utbyteskonfigurationsregler och behöver behålla sin befintliga MX-utbyte och vidarebefordra till vår. |
| `retention_days` | Inga | Antal | Heltal mellan `0` och `30` som motsvarar antalet lagringsdagar för att lagra utgående SMTP-e-postmeddelanden när de har levererats eller fått permanent fel. Standardvärdet är `0`, vilket innebär att utgående SMTP-e-postmeddelanden rensas och redigeras omedelbart för din säkerhet. |
| `bounce_webhook` | Inga | Sträng (URL) eller booleskt (falskt) | Webhookens URL för `http://` eller `https://` som du väljer att skicka studsande webhooks till. Vi skickar en `POST`-förfrågan till denna URL med information om utgående SMTP-fel (t.ex. mjuka eller hårda fel – så att du kan hantera dina prenumeranter och programmatiskt hantera din utgående e-post). |
| `max_quota_per_alias` | Inga | Sträng | Maximal lagringskvot för alias på detta domännamn. Ange ett värde som "1 GB" som kommer att analyseras av [bytes](https://github.com/visionmedia/bytes.js). |

> Exempelförfrågan:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Ta bort domänen {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Exempelförfrågan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Inbjudningar {#invites}

### Acceptera domäninbjudan {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Skapa domäninbjudan {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ja | Sträng (e-post) | E-postadress att bjuda in till domänmedlemslistan |
| `group` | Ja | Sträng (uppräknningsbar) | Grupp att lägga till användaren i domänmedlemskapet med (kan vara en av `"admin"` eller `"user"`) |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Om den inbjudna användaren redan är en accepterad medlem i andra domäner som administratören som bjuder in dem är medlem i, kommer inbjudan att accepteras automatiskt och inget e-postmeddelande skickas.

### Ta bort domäninbjudan {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ja | Sträng (e-post) | E-postadress att ta bort från domänmedlemslistan |

> Exempelförfrågan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Medlemmar {#members}

### Uppdatera domänmedlem {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ja | Sträng (uppräknningsbar) | Grupp att uppdatera användaren till domänmedlemskapet med (kan vara en av `"admin"` eller `"user"`) |

> Exempelförfrågan:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Ta bort domänmedlem {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Exempelförfrågan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Alias {#aliases}

### Generera ett aliaslösenord {#generate-an-alias-password}

Observera att om du inte skickar instruktioner via e-post kommer användarnamnet och lösenordet att finnas i JSON-svarstexten för en lyckad begäran i formatet `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Inga | Sträng | Ditt nya anpassade lösenord att använda för aliaset. Observera att du kan lämna detta tomt eller helt sakna detta i din API-förfrågning om du vill ha ett slumpmässigt genererat och starkt lösenord. |
| `password` | Inga | Sträng | Befintligt lösenord för alias för att ändra lösenordet utan att ta bort den befintliga IMAP-postlådelagringen (se alternativet `is_override` nedan om du inte längre har det befintliga lösenordet). |
| `is_override` | Inga | Booleansk | **ANVÄND MED FÖRSIKTIGHET**: Detta kommer att åsidosätta det befintliga aliaslösenordet och databasen helt och permanent ta bort den befintliga IMAP-lagringen och återställa aliasets SQLite-e-postdatabas helt. Gör en säkerhetskopia om möjligt om du har en befintlig postlåda kopplad till detta alias. |
| `emailed_instructions` | Inga | Sträng | E-postadress att skicka aliaset lösenord och installationsanvisningar till. |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Lista domänalias {#list-domain-aliases}

> \[!NOTE]
> Från och med den 1 november 2024 kommer API-slutpunkterna för [Lista domäner](#list-domains) och [Lista domänalias](#list-domain-aliases) som standard att ha max `1000` resultat per sida. Om du vill välja att använda detta beteende tidigt kan du skicka `?paginate=true` som en extra frågesträngsparameter till URL:en för slutpunktsfrågan. Se [Paginering](#pagination) för mer information.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Frågesträngparametrar | Nödvändig | Typ | Beskrivning |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Inga | Sträng (RegExp stöds) | Sök efter alias i en domän efter namn, etikett eller mottagare |
| `name` | Inga | Sträng (RegExp stöds) | Sök efter alias i en domän med namn |
| `recipient` | Inga | Sträng (RegExp stöds) | Sök efter alias i en domän efter mottagare |
| `sort` | Inga | Sträng | Sortera efter ett specifikt fält (använd prefixet `-` för att sortera i omvänd riktning jämfört med det fältet). Standardvärdet är `created_at` om det inte är angivet. |
| `page` | Inga | Antal | Se [Pagination](#pagination) för mer insikt |
| `limit` | Inga | Antal | Se [Pagination](#pagination) för mer insikt |

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Skapa nytt domänalias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Inga | Sträng | Aliasnamn (om det inte anges eller om det är tomt genereras ett slumpmässigt alias) |
| `recipients` | Inga | Sträng eller array | Lista över mottagare (måste vara radbrytnings-/mellanslags-/kommaavgränsad. Sträng eller array med giltiga e-postadresser, fullständigt kvalificerade domännamn ("FQDN"), IP-adresser och/eller webhook-URL:er – och om den inte anges eller är en tom array kommer användarens e-postadress som gör API-begäran att anges som mottagare) |
| `description` | Inga | Sträng | Aliasbeskrivning |
| `labels` | Inga | Sträng eller array | Lista med etiketter (måste vara radbrytnings-/mellanslags-/kommaseparerade, strängar eller arrayer) |
| `has_recipient_verification` | Inga | Booleansk | Kräv att mottagarna klickar på en länk för e-postverifiering för att e-postmeddelanden ska kunna skickas (standardinställningen är domänens inställning om den inte uttryckligen anges i begäran) |
| `is_enabled` | Inga | Booleansk | Huruvida detta alias ska aktiveras eller inaktiveras (om det är inaktiverat kommer e-postmeddelanden inte att dirigeras någonstans men returnerar lyckade statuskoder). Om ett värde skickas konverteras det till ett booleskt värde med hjälp av [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Inga | Nummer (antingen `250`, `421` eller `550`) | Inkommande e-post till detta alias kommer att avvisas om `is_enabled` är `false` med antingen `250` (leverera tyst ingenstans, t.ex. svart hål eller `/dev/null`), `421` (mjuk avvisning; och försök igen i upp till ~5 dagar) eller `550` permanent fel och avvisning. Standardinställningen är `250`. |
| `has_imap` | Inga | Booleansk | Huruvida IMAP-lagring ska aktiveras eller inaktiveras för detta alias (om det är inaktiverat lagras inte inkommande e-postmeddelanden i [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Om ett värde skickas konverteras det till ett booleskt värde med [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Inga | Booleansk | Huruvida [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) ska aktiveras eller inaktiveras för [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) med hjälp av aliaset `public_key`. |
| `public_key` | Inga | Sträng | OpenPGP publik nyckel i ASCII Armor-format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); t.ex. GPG-nyckel för `support@forwardemail.net`). Detta gäller endast om du har `has_pgp` inställt på `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Inga | Sträng | Maximal lagringskvot för detta alias. Lämna tomt för att återställa till domänens nuvarande maximala kvot eller ange ett värde som "1 GB" som kommer att analyseras av [bytes](https://github.com/visionmedia/bytes.js). Detta värde kan endast justeras av domänadministratörer. |
| `vacation_responder_is_enabled` | Inga | Booleansk | Om en automatisk semestersvarare ska aktiveras eller inaktiveras. |
| `vacation_responder_start_date` | Inga | Sträng | Startdatum för semestersvar (om det är aktiverat och inget startdatum är angivet här, antas det att det redan har startats). Vi stöder datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart parsing med `dayjs`. |
| `vacation_responder_end_date` | Inga | Sträng | Slutdatum för semestersvar (om det är aktiverat och inget slutdatum är angivet här, antas det att det aldrig slutar och svarar för alltid). Vi stöder datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart parsing med `dayjs`. |
| `vacation_responder_subject` | Inga | Sträng | Ämne i klartext för semestersvaret, t.ex. "Frånvarande". Vi använder `striptags` för att ta bort all HTML här. |
| `vacation_responder_message` | Inga | Sträng | Meddelande i klartext för semestersvaret, t.ex. "Jag kommer att vara borta från jobbet till februari.". Vi använder `striptags` för att ta bort all HTML här. |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hämta domänalias {#retrieve-domain-alias}

Du kan hämta ett domänalias antingen med hjälp av dess `id`- eller `name`-värde.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Exempelförfrågan:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Uppdatera domänalias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Inga | Sträng | Aliasnamn |
| `recipients` | Inga | Sträng eller array | Lista över mottagare (måste vara radbrytnings-/mellanslags-/kommaavgränsad). Sträng eller array med giltiga e-postadresser, fullständigt kvalificerade domännamn ("FQDN"), IP-adresser och/eller webhook-URL:er. |
| `description` | Inga | Sträng | Aliasbeskrivning |
| `labels` | Inga | Sträng eller array | Lista med etiketter (måste vara radbrytnings-/mellanslags-/kommaseparerade, strängar eller arrayer) |
| `has_recipient_verification` | Inga | Booleansk | Kräv att mottagarna klickar på en länk för e-postverifiering för att e-postmeddelanden ska kunna skickas (standardinställningen är domänens inställning om den inte uttryckligen anges i begäran) |
| `is_enabled` | Inga | Booleansk | Huruvida detta alias ska aktiveras eller inaktiveras (om det är inaktiverat kommer e-postmeddelanden inte att dirigeras någonstans men returnerar lyckade statuskoder). Om ett värde skickas konverteras det till ett booleskt värde med hjälp av [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Inga | Nummer (antingen `250`, `421` eller `550`) | Inkommande e-post till detta alias kommer att avvisas om `is_enabled` är `false` med antingen `250` (leverera tyst ingenstans, t.ex. svart hål eller `/dev/null`), `421` (mjuk avvisning; och försök igen i upp till ~5 dagar) eller `550` permanent fel och avvisning. Standardinställningen är `250`. |
| `has_imap` | Inga | Booleansk | Huruvida IMAP-lagring ska aktiveras eller inaktiveras för detta alias (om det är inaktiverat lagras inte inkommande e-postmeddelanden i [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Om ett värde skickas konverteras det till ett booleskt värde med [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Inga | Booleansk | Huruvida [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) ska aktiveras eller inaktiveras för [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) med hjälp av aliaset `public_key`. |
| `public_key` | Inga | Sträng | OpenPGP publik nyckel i ASCII Armor-format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); t.ex. GPG-nyckel för `support@forwardemail.net`). Detta gäller endast om du har `has_pgp` inställt på `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Inga | Sträng | Maximal lagringskvot för detta alias. Lämna tomt för att återställa till domänens nuvarande maximala kvot eller ange ett värde som "1 GB" som kommer att analyseras av [bytes](https://github.com/visionmedia/bytes.js). Detta värde kan endast justeras av domänadministratörer. |
| `vacation_responder_is_enabled` | Inga | Booleansk | Om en automatisk semestersvarare ska aktiveras eller inaktiveras. |
| `vacation_responder_start_date` | Inga | Sträng | Startdatum för semestersvar (om det är aktiverat och inget startdatum är angivet här, antas det att det redan har startats). Vi stöder datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart parsing med `dayjs`. |
| `vacation_responder_end_date` | Inga | Sträng | Slutdatum för semestersvar (om det är aktiverat och inget slutdatum är angivet här, antas det att det aldrig slutar och svarar för alltid). Vi stöder datumformat som `MM/DD/YYYY`, `YYYY-MM-DD` och andra datumformat via smart parsing med `dayjs`. |
| `vacation_responder_subject` | Inga | Sträng | Ämne i klartext för semestersvaret, t.ex. "Frånvarande". Vi använder `striptags` för att ta bort all HTML här. |
| `vacation_responder_message` | Inga | Sträng | Meddelande i klartext för semestersvaret, t.ex. "Jag kommer att vara borta från jobbet till februari.". Vi använder `striptags` för att ta bort all HTML här. |

> Exempelförfrågan:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Ta bort domänalias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Exempelförfrågan:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Kryptera {#encrypt}

Vi låter dig kryptera poster även med gratisplanen utan kostnad. Sekretess bör inte vara en funktion, den bör vara inbyggd i alla aspekter av en produkt. Som efterfrågats i [Diskussion om sekretessguider](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) och på [våra GitHub-problem](https://github.com/forwardemail/forwardemail.net/issues/254) har vi lagt till detta.

### Kryptera TXT-post {#encrypt-txt-record}

> `POST /v1/encrypt`

| Kroppsparameter | Nödvändig | Typ | Beskrivning |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ja | Sträng | Alla giltiga poster för vidarebefordran av e-post i klartext (TXT) |

> Exempelförfrågan:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
