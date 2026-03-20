# Email API {#email-api}


## Indholdsfortegnelse {#table-of-contents}

* [Biblioteker](#libraries)
* [Base URI](#base-uri)
* [Autentificering](#authentication)
  * [API Token Autentificering (Anbefales til de fleste endpoints)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias Credentials Autentificering (Til udgående email)](#alias-credentials-authentication-for-outbound-email)
  * [Kun Alias Endpoints](#alias-only-endpoints)
* [Fejl](#errors)
* [Lokalisering](#localization)
* [Pagination](#pagination)
* [Logs](#logs)
  * [Hent logs](#retrieve-logs)
* [Konto](#account)
  * [Opret konto](#create-account)
  * [Hent konto](#retrieve-account)
  * [Opdater konto](#update-account)
* [Alias Kontakter (CardDAV)](#alias-contacts-carddav)
  * [List kontakter](#list-contacts)
  * [Opret kontakt](#create-contact)
  * [Hent kontakt](#retrieve-contact)
  * [Opdater kontakt](#update-contact)
  * [Slet kontakt](#delete-contact)
* [Alias Kalendere (CalDAV)](#alias-calendars-caldav)
  * [List kalendere](#list-calendars)
  * [Opret kalender](#create-calendar)
  * [Hent kalender](#retrieve-calendar)
  * [Opdater kalender](#update-calendar)
  * [Slet kalender](#delete-calendar)
* [Alias Beskeder (IMAP/POP3)](#alias-messages-imappop3)
  * [List og søg efter beskeder](#list-and-search-for-messages)
  * [Opret besked](#create-message)
  * [Hent besked](#retrieve-message)
  * [Opdater besked](#update-message)
  * [Slet besked](#delete-message)
* [Alias Mapper (IMAP/POP3)](#alias-folders-imappop3)
  * [List mapper](#list-folders)
  * [Opret mappe](#create-folder)
  * [Hent mappe](#retrieve-folder)
  * [Opdater mappe](#update-folder)
  * [Slet mappe](#delete-folder)
  * [Kopiér mappe](#copy-folder)
* [Udgående Emails](#outbound-emails)
  * [Hent grænse for udgående SMTP emails](#get-outbound-smtp-email-limit)
  * [List udgående SMTP emails](#list-outbound-smtp-emails)
  * [Opret udgående SMTP email](#create-outbound-smtp-email)
  * [Hent udgående SMTP email](#retrieve-outbound-smtp-email)
  * [Slet udgående SMTP email](#delete-outbound-smtp-email)
* [Domæner](#domains)
  * [List domæner](#list-domains)
  * [Opret domæne](#create-domain)
  * [Hent domæne](#retrieve-domain)
  * [Verificer domæneposter](#verify-domain-records)
  * [Verificer domæne SMTP-poster](#verify-domain-smtp-records)
  * [List domæne-dækkende catch-all adgangskoder](#list-domain-wide-catch-all-passwords)
  * [Opret domæne-dækkende catch-all adgangskode](#create-domain-wide-catch-all-password)
  * [Fjern domæne-dækkende catch-all adgangskode](#remove-domain-wide-catch-all-password)
  * [Opdater domæne](#update-domain)
  * [Slet domæne](#delete-domain)
* [Invitationer](#invites)
  * [Accepter domæneinvitation](#accept-domain-invite)
  * [Opret domæneinvitation](#create-domain-invite)
  * [Fjern domæneinvitation](#remove-domain-invite)
* [Medlemmer](#members)
  * [Opdater domænemedlem](#update-domain-member)
  * [Fjern domænemedlem](#remove-domain-member)
* [Aliasser](#aliases)
  * [Generér en alias-adgangskode](#generate-an-alias-password)
  * [List domænealiasser](#list-domain-aliases)
  * [Opret ny domænealias](#create-new-domain-alias)
  * [Hent domænealias](#retrieve-domain-alias)
  * [Opdater domænealias](#update-domain-alias)
  * [Slet domænealias](#delete-domain-alias)
* [Krypter](#encrypt)
  * [Krypter TXT Record](#encrypt-txt-record)


## Biblioteker {#libraries}

Lige nu har vi endnu ikke udgivet nogen API wrappers, men vi planlægger at gøre det i den nærmeste fremtid. Send en email til <api@forwardemail.net> hvis du gerne vil have besked, når en API wrapper til et bestemt programmeringssprog bliver udgivet. I mellemtiden kan du bruge disse anbefalede HTTP request biblioteker i din applikation, eller blot bruge [curl](https://stackoverflow.com/a/27442239/3586413) som i eksemplerne nedenfor.

| Sprog      | Bibliotek                                                             |
| ---------- | -------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                     |
| Python     | [requests](https://github.com/psf/requests)                          |
| Java       | [OkHttp](https://github.com/square/okhttp/)                          |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                           |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (vi er vedligeholdere) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (vi er vedligeholdere) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                         |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                  |
## Base URI {#base-uri}

Den nuværende HTTP base URI sti er: `BASE_URI`.


## Authentication {#authentication}

Alle endpoints kræver autentificering ved brug af [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Vi understøtter to autentificeringsmetoder:

### API Token Authentication (Anbefales til de fleste endpoints) {#api-token-authentication-recommended-for-most-endpoints}

Indstil din [API-nøgle](https://forwardemail.net/my-account/security) som "brugernavn" værdien med et tomt kodeord:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Bemærk kolon (`:`) efter API-token – dette angiver et tomt kodeord i Basic Auth format.

### Alias Credentials Authentication (Til udgående email) {#alias-credentials-authentication-for-outbound-email}

[Create outbound SMTP email](#create-outbound-smtp-email) endpoint understøtter også autentificering ved brug af din alias emailadresse og et [genereret alias kodeord](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Denne metode er nyttig, når du sender emails fra applikationer, der allerede bruger SMTP legitimationsoplysninger, og gør migrering fra SMTP til vores API problemfri.

### Alias-Only Endpoints {#alias-only-endpoints}

[Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), og [Alias Folders](#alias-folders-imappop3) endpoints kræver alias legitimationsoplysninger og understøtter ikke API token autentificering.

Bare rolig – eksempler er givet nedenfor, hvis du er usikker på, hvad dette er.


## Errors {#errors}

Hvis der opstår fejl, vil svarindholdet fra API-forespørgslen indeholde en detaljeret fejlmeddelelse.

| Code | Navn                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Dårlig forespørgsel   |
| 401  | Uautoriseret          |
| 403  | Forbudt               |
| 404  | Ikke fundet           |
| 429  | For mange forespørgsler |
| 500  | Intern serverfejl     |
| 501  | Ikke implementeret    |
| 502  | Dårlig gateway        |
| 503  | Tjeneste utilgængelig |
| 504  | Gateway timeout       |

> \[!TIP]
> Hvis du modtager en 5xx statuskode (hvilket ikke burde ske), så kontakt os venligst på <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>, og vi vil hjælpe dig med at løse dit problem med det samme.


## Localization {#localization}

Vores service er oversat til over 25 forskellige sprog. Alle API svarbeskeder oversættes til den sidst registrerede lokalitet for brugeren, der laver API-forespørgslen. Du kan tilsidesætte dette ved at sende en brugerdefineret `Accept-Language` header. Du er velkommen til at prøve det ved at bruge sprog-dropdown-menuen nederst på denne side.


## Pagination {#pagination}

> \[!NOTE]
> Fra den 1. november 2024 vil API endpoints for [List domains](#list-domains) og [List domain aliases](#list-domain-aliases) som standard have `1000` maks resultater per side. Hvis du ønsker at tilvælge denne adfærd tidligt, kan du tilføje `?paginate=true` som en ekstra querystring parameter til URL’en for endpoint forespørgslen.

Pagination understøttes af alle API endpoints, der returnerer lister.

Angiv blot querystring egenskaberne `page` (og eventuelt `limit`).

Egenskaben `page` skal være et tal større end eller lig med `1`. Hvis du angiver `limit` (også et tal), er minimumsværdien `10` og maksimum `50` (medmindre andet er angivet).

| Querystring Parameter | Påkrævet | Type   | Beskrivelse                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nej      | Tal    | Side med resultater, der skal returneres. Hvis ikke angivet, vil `page` værdien være `1`. Skal være et tal større end eller lig med `1`.                   |
| `limit`               | Nej      | Tal    | Antal resultater, der skal returneres per side. Standard er `10`, hvis ikke angivet. Skal være et tal større end eller lig med `1` og mindre end eller lig med `50`. |
For at afgøre, om der er flere resultater tilgængelige, leverer vi disse HTTP-responsoverskrifter (som du kan analysere for at paginere programmatisk):

| HTTP Response Header | Eksempel                                                                                                                                                                                                                                                  | Beskrivelse                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Det samlede antal sider tilgængelige.                                                                                                                                                                                                                                                                                                                             |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Den aktuelle side af returnerede resultater (f.eks. baseret på `page` querystring-parameter).                                                                                                                                                                                                                                                                      |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Det samlede antal resultater på den returnerede side (f.eks. baseret på `limit` querystring-parameter og faktiske returnerede resultater).                                                                                                                                                                                                                         |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Det samlede antal elementer tilgængelige på tværs af alle sider.                                                                                                                                                                                                                                                                                                  |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Vi leverer en `Link` HTTP-responsoverskrift, som du kan analysere som vist i eksemplet. Dette er [lignende GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (f.eks. vil ikke alle værdier blive leveret, hvis de ikke er relevante eller tilgængelige, f.eks. vil `"next"` ikke blive leveret, hvis der ikke er en næste side). |
> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logs {#logs}

### Hent logs {#retrieve-logs}

Vores API giver dig programmatisk mulighed for at downloade logs for din konto. Ved at sende en forespørgsel til dette endpoint vil alle logs for din konto blive behandlet og sendt til dig som en vedhæftet fil (en [Gzip](https://en.wikipedia.org/wiki/Gzip) komprimeret [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) regnearksfil), når processen er færdig.

Dette giver dig mulighed for at oprette baggrundsopgaver med en [Cron job](https://en.wikipedia.org/wiki/Cron) eller ved at bruge vores [Node.js job scheduling software Bree](https://github.com/breejs/bree) for at modtage logs, når du ønsker det. Bemærk, at dette endpoint er begrænset til `10` forespørgsler pr. dag.

Vedhæftningen har det småbogstavede format `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`, og selve e-mailen indeholder et kort resumé af de hentede logs. Du kan også downloade logs når som helst fra [Min Konto → Logs](/my-account/logs)

> `GET /v1/logs/download`

| Querystring Parameter | Påkrævet | Type          | Beskrivelse                                                                                                                     |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Nej      | String (FQDN) | Filtrer logs efter fuldt kvalificeret domæne ("FQDN"). Hvis du ikke angiver dette, hentes alle logs på tværs af alle domæner.    |
| `q`                   | Nej      | String        | Søg efter logs via e-mail, domæne, aliasnavn, IP-adresse eller dato (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` eller `M.D.YY` format).    |
| `bounce_category`     | Nej      | String        | Søg efter logs efter en specifik bounce-kategori (f.eks. `blocklist`).                                                           |
| `response_code`       | Nej      | Number        | Søg efter logs efter en specifik fejlresponskode (f.eks. `421` eller `550`).                                                     |

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Eksempel på Cron job (ved midnat hver dag):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Bemærk, at du kan bruge tjenester som [Crontab.guru](https://crontab.guru/) til at validere din cron job-udtrykssyntaks.

> Eksempel på Cron job (ved midnat hver dag **og med logs for foregående dag**):

For MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

For Linux og Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Konto {#account}

### Opret konto {#create-account}

> `POST /v1/account`

| Body Parameter | Påkrævet | Type           | Beskrivelse    |
| -------------- | -------- | -------------- | -------------- |
| `email`        | Ja       | String (Email) | E-mailadresse  |
| `password`     | Ja       | String         | Adgangskode    |

> Eksempel på forespørgsel:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hent konto {#retrieve-account}

> `GET /v1/account`

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Opdater konto {#update-account}

> `PUT /v1/account`

| Body Parameter | Påkrævet | Type           | Beskrivelse           |
| -------------- | -------- | -------------- | --------------------- |
| `email`        | Nej      | String (Email) | E-mailadresse         |
| `given_name`   | Nej      | String         | Fornavn               |
| `family_name`  | Nej      | String         | Efternavn             |
| `avatar_url`   | Nej      | String (URL)   | Link til avatarbillede |

> Eksempel på forespørgsel:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias Kontakter (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> I modsætning til andre API-endpoints kræver disse [Authentication](#authentication) med "brugernavn" lig alias-brugernavnet og "adgangskode" lig alias-genereret adgangskode som Basic Authorization headers.
> \[!WARNING]
> Denne endpoint-sektion er et igangværende arbejde og forventes frigivet i 2024. I mellemtiden bedes du bruge en IMAP-klient fra "Apps" dropdown-menuen i navigationen på vores hjemmeside.

### Liste kontakter {#list-contacts}

> `GET /v1/contacts`

**Kommer snart**

### Opret kontakt {#create-contact}

> `POST /v1/contacts`

**Kommer snart**

### Hent kontakt {#retrieve-contact}

> `GET /v1/contacts/:id`

**Kommer snart**

### Opdater kontakt {#update-contact}

> `PUT /v1/contacts/:id`

**Kommer snart**

### Slet kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Kommer snart**


## Alias Kalendere (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> I modsætning til andre API-endpoints kræver disse [Authentication](#authentication) "brugernavn" svarende til alias-brugernavnet og "adgangskode" svarende til det alias-genererede kodeord som Basic Authorization headers.

> \[!WARNING]
> Denne endpoint-sektion er et igangværende arbejde og forventes frigivet i 2024. I mellemtiden bedes du bruge en IMAP-klient fra "Apps" dropdown-menuen i navigationen på vores hjemmeside.

### Liste kalendere {#list-calendars}

> `GET /v1/calendars`

**Kommer snart**

### Opret kalender {#create-calendar}

> `POST /v1/calendars`

**Kommer snart**

### Hent kalender {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Kommer snart**

### Opdater kalender {#update-calendar}

> `PUT /v1/calendars/:id`

**Kommer snart**

### Slet kalender {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Kommer snart**


## Alias Beskeder (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> I modsætning til andre API-endpoints kræver disse [Authentication](#authentication) "brugernavn" svarende til alias-brugernavnet og "adgangskode" svarende til det alias-genererede kodeord som Basic Authorization headers.

> \[!WARNING]
> Denne endpoint-sektion er et igangværende arbejde og forventes frigivet i 2024. I mellemtiden bedes du bruge en IMAP-klient fra "Apps" dropdown-menuen i navigationen på vores hjemmeside.

Sørg for, at du har fulgt opsætningsinstruktionerne for dit domæne.

Disse instruktioner kan findes i vores FAQ-sektion [Understøtter I modtagelse af email med IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Liste og søg efter beskeder {#list-and-search-for-messages}

> `GET /v1/messages`

**Kommer snart**

### Opret besked {#create-message}

> \[!NOTE]
> Dette vil **IKKE** sende en email – det vil kun tilføje beskeden til din postkasse-mappe (f.eks. svarer dette til IMAP `APPEND` kommandoen). Hvis du ønsker at sende en email, se da [Opret udgående SMTP email](#create-outbound-smtp-email) nedenfor. Efter oprettelse af den udgående SMTP email kan du tilføje en kopi af den via denne endpoint til din alias' postkasse til lagringsformål.

> `POST /v1/messages`

**Kommer snart**

### Hent besked {#retrieve-message}

> `GET /v1/messages/:id`

**Kommer snart**

### Opdater besked {#update-message}

> `PUT /v1/messages/:id`

**Kommer snart**

### Slet besked {#delete-message}

> `DELETE /v1/messages:id`

**Kommer snart**


## Alias Mapper (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Mappe-endpoints med en mappes sti <code>/v1/folders/:path</code> som deres endpoint kan bruges ombytteligt med en mappes ID <code>:id</code>. Det betyder, at du kan referere til mappen enten ved dens <code>path</code> eller <code>id</code> værdi.

> \[!WARNING]
> Denne endpoint-sektion er et igangværende arbejde og forventes frigivet i 2024. I mellemtiden bedes du bruge en IMAP-klient fra "Apps" dropdown-menuen i navigationen på vores hjemmeside.

### Liste mapper {#list-folders}

> `GET /v1/folders`

**Kommer snart**

### Opret mappe {#create-folder}

> `POST /v1/folders`

**Kommer snart**

### Hent mappe {#retrieve-folder}

> `GET /v1/folders/:id`

**Kommer snart**

### Opdater mappe {#update-folder}

> `PUT /v1/folders/:id`

**Kommer snart**

### Slet mappe {#delete-folder}

> `DELETE /v1/folders/:id`

**Kommer snart**

### Kopiér mappe {#copy-folder}

> `POST /v1/folders/:id/copy`

**Kommer snart**


## Udgående Emails {#outbound-emails}

Sørg for, at du har fulgt opsætningsinstruktionerne for dit domæne.

Disse instruktioner kan findes under [Min Konto → Domæner → Indstillinger → Udgående SMTP Konfiguration](/my-account/domains). Du skal sikre opsætning af DKIM, Return-Path og DMARC for at sende udgående SMTP med dit domæne.
### Hent grænse for udgående SMTP-email {#get-outbound-smtp-email-limit}

Dette er et simpelt endpoint, der returnerer et JSON-objekt indeholdende `count` og `limit` for antallet af daglige udgående SMTP-beskeder pr. konto.

> `GET /v1/emails/limit`

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Liste over udgående SMTP-emails {#list-outbound-smtp-emails}

Bemærk, at dette endpoint ikke returnerer egenskabsværdier for en emails `message`, `headers` eller `rejectedErrors`.

For at returnere disse egenskaber og deres værdier, brug venligst [Hent email](#retrieve-email) endpoint med en email-ID.

> `GET /v1/emails`

| Querystring Parameter | Påkrævet | Type                      | Beskrivelse                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nej      | String (RegExp understøttet) | Søg efter emails via metadata                                                                                                                    |
| `domain`              | Nej      | String (RegExp understøttet) | Søg efter emails via domænenavn                                                                                                                 |
| `sort`                | Nej      | String                    | Sorter efter et specifikt felt (prefix med et enkelt bindestreg `-` for at sortere i omvendt retning af det felt). Standard er `created_at` hvis ikke sat. |
| `page`                | Nej      | Number                    | Se [Pagination](#pagination) for mere information                                                                                               |
| `limit`               | Nej      | Number                    | Se [Pagination](#pagination) for mere information                                                                                               |

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Opret udgående SMTP-email {#create-outbound-smtp-email}

Vores API til oprettelse af en email er inspireret af og benytter Nodemailers message option-konfiguration. Se venligst [Nodemailer message configuration](https://nodemailer.com/message/) for alle body-parametre nedenfor.

Bemærk, at med undtagelse af `envelope` og `dkim` (da vi sætter disse automatisk for dig), understøtter vi alle Nodemailer muligheder. Vi sætter automatisk `disableFileAccess` og `disableUrlAccess` til `true` af sikkerhedsmæssige årsager.

Du skal enten sende den enkelte option `raw` med din rå fulde email inklusive headers **eller** sende individuelle body-parameter muligheder nedenfor.

Dette API-endpoint koder automatisk emojis for dig, hvis de findes i headers (f.eks. en emnelinje `Subject: 🤓 Hello` konverteres automatisk til `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Vores mål var at lave en ekstremt udviklervenlig og idiot-sikker email-API.

**Autentificering:** Dette endpoint understøtter både [API token autentificering](#api-token-authentication-recommended-for-most-endpoints) og [alias credentials autentificering](#alias-credentials-authentication-for-outbound-email). Se afsnittet [Autentificering](#authentication) ovenfor for detaljer.

> `POST /v1/emails`

| Body Parameter   | Påkrævet | Type             | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Nej      | String (Email)   | Afsenderens emailadresse (skal eksistere som et alias for domænet).                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | Nej      | String eller Array  | Komma-separeret liste eller et Array af modtagere til "To" headeren.                                                                                                                                                                                                                                                                                                                                                                                              |
| `cc`             | Nej      | String eller Array  | Komma-separeret liste eller et Array af modtagere til "Cc" headeren.                                                                                                                                                                                                                                                                                                                                                                                              |
| `bcc`            | Nej      | String eller Array  | Komma-separeret liste eller et Array af modtagere til "Bcc" headeren.                                                                                                                                                                                                                                                                                                                                                                                             |
| `subject`        | Nej      | String           | Emailens emne.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `text`           | Nej      | String eller Buffer | Den tekstbaserede version af beskeden.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `html`           | Nej      | String eller Buffer | HTML-versionen af beskeden.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `attachments`    | Nej      | Array            | Et array af vedhæftede objekter (se [Nodemailers common fields](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                |
| `sender`         | Nej      | String           | Emailadressen til "Sender" headeren (se [Nodemailers mere avancerede felter](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                       |
| `replyTo`        | Nej      | String           | Emailadressen til "Reply-To" headeren.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `inReplyTo`      | Nej      | String           | Message-ID som beskeden svarer på.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`     | Nej      | String eller Array  | Mellemrum-separeret liste eller et Array af Message-ID'er.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `attachDataUrls` | Nej      | Boolean          | Hvis `true` konverteres `data:` billeder i HTML-indholdet til indlejrede vedhæftninger.                                                                                                                                                                                                                                                                                                                                                               |
| `watchHtml`      | Nej      | String           | En Apple Watch-specifik HTML-version af beskeden ([ifølge Nodemailer docs](https://nodemailer.com/message/#content-options]), de nyeste ure kræver ikke at dette sættes).                                                                                                                                                                                                                                                                    |
| `amp`            | Nej      | String           | En AMP4EMAIL-specifik HTML-version af beskeden (se [Nodemailers eksempel](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                     |
| `icalEvent`      | Nej      | Object           | En iCalendar-begivenhed som alternativt beskedindhold (se [Nodemailers kalenderbegivenheder](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                               |
| `alternatives`   | Nej      | Array            | Et Array af alternativt beskedindhold (se [Nodemailers alternative content](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                  |
| `encoding`       | Nej      | String           | Kodning for tekst- og HTML-strenge (standard er `"utf-8"`, men understøtter også `"hex"` og `"base64"` kodningsværdier).                                                                                                                                                                                                                                                                                                                                     |
| `raw`            | Nej      | String eller Buffer | En brugerdefineret genereret RFC822-formateret besked til brug (i stedet for en genereret af Nodemailer – se [Nodemailers custom source](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                           |
| `textEncoding`   | Nej      | String           | Kodning der tvinges brugt for tekstværdier (enten `"quoted-printable"` eller `"base64"`). Standardværdien er den nærmeste detekterede værdi (for ASCII brug `"quoted-printable"`).                                                                                                                                                                                                                                                                           |
| `priority`       | Nej      | String           | Prioritetsniveau for emailen (kan være `"high"`, `"normal"` (standard) eller `"low"`). Bemærk at værdien `"normal"` ikke sætter en prioritetsheader (dette er standardadfærden). Hvis værdien `"high"` eller `"low"` sættes, vil `X-Priority`, `X-MSMail-Priority` og `Importance` headers [blive sat tilsvarende](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Nej      | Object eller Array  | Et Object eller et Array af yderligere headerfelter der skal sættes (se [Nodemailers custom headers](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                    |
| `messageId`      | Nej      | String           | En valgfri Message-ID værdi til "Message-ID" headeren (en standardværdi oprettes automatisk hvis ikke sat – bemærk at værdien bør [overholde RFC2822 specifikationen](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                     |
| `date`           | Nej      | String eller Date   | En valgfri dato, der bruges hvis Date-headeren mangler efter parsing, ellers bruges den aktuelle UTC-streng hvis ikke sat. Date-headeren må ikke være mere end 30 dage frem i tiden i forhold til nuværende tidspunkt.                                                                                                                                                                                                                                     |
| `list`           | Nej      | Object           | Et valgfrit Object af `List-*` headers (se [Nodemailers list headers](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                          |
> Eksempelanmodning (API-token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Eksempelanmodning (Alias-legitimationsoplysninger):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Eksempelanmodning (Raw Email):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Hent udgående SMTP-email {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Eksempelanmodning:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Slet udgående SMTP-email {#delete-outbound-smtp-email}

Sletning af email vil sætte status til `"rejected"` (og efterfølgende ikke behandle den i køen) hvis og kun hvis den nuværende status er en af `"pending"`, `"queued"` eller `"deferred"`. Vi kan automatisk slette emails efter 30 dage efter de blev oprettet og/eller sendt – derfor bør du beholde en kopi af udgående SMTP-emails i din klient, database eller applikation. Du kan referere til vores email-ID-værdi i din database, hvis ønsket – denne værdi returneres fra både [Opret email](#create-email) og [Hent email](#retrieve-email) endpoints.

> `DELETE /v1/emails/:id`

> Eksempelanmodning:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domæner {#domains}

> \[!TIP]
> Domæneendpoints med et domænenavn <code>/v1/domains/:domain_name</code> som deres endpoint kan bruges ombytteligt med et domæne-ID <code>:domain_id</code>. Det betyder, at du kan referere til domænet enten ved dets <code>name</code> eller <code>id</code>-værdi.

### Liste domæner {#list-domains}

> \[!NOTE]
> Fra den 1. november 2024 vil API-endpoints for [Liste domæner](#list-domains) og [Liste domænealiaser](#list-domain-aliases) som standard have `1000` maks resultater per side. Hvis du ønsker at tilvælge denne adfærd tidligt, kan du tilføje `?paginate=true` som en ekstra querystring-parameter til URL’en for endpoint-forespørgslen. Se [Pagination](#pagination) for mere indsigt.

> `GET /v1/domains`

| Querystring Parameter | Påkrævet | Type                      | Beskrivelse                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nej      | String (RegExp understøttet) | Søg efter domæner efter navn                                                                                                                       |
| `name`                | Nej      | String (RegExp understøttet) | Søg efter domæner efter navn                                                                                                                       |
| `sort`                | Nej      | String                    | Sorter efter et specifikt felt (prefix med et enkelt bindestreg `-` for at sortere i omvendt retning af det felt). Standard er `created_at`, hvis ikke sat. |
| `page`                | Nej      | Number                    | Se [Pagination](#pagination) for mere indsigt                                                                                                   |
| `limit`               | Nej      | Number                    | Se [Pagination](#pagination) for mere indsigt                                                                                                   |

> Eksempelanmodning:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Opret domæne {#create-domain}

> `POST /v1/domains`

| Body Parameter                 | Påkrævet | Type                                          | Beskrivelse                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Ja       | String (FQDN eller IP)                         | Fuldt kvalificeret domænenavn ("FQDN") eller IP-adresse                                                                                                                                                                                                                                                                   |
| `team_domain`                  | Nej      | String (domæne-ID eller domænenavn; FQDN)     | Tildel automatisk dette domæne til samme team som et andet domæne. Det betyder, at alle medlemmer fra dette domæne vil blive tildelt som teammedlemmer, og `plan` vil automatisk blive sat til `team`. Du kan sætte dette til `"none"` hvis nødvendigt for eksplicit at deaktivere dette, men det er ikke nødvendigt. |
| `plan`                         | Nej      | String (enum)                                 | Plan-type (skal være `"free"`, `"enhanced_protection"` eller `"team"`, standard til `"free"` eller brugerens nuværende betalte plan, hvis på en)                                                                                                                                                                                   |
| `catchall`                     | Nej      | String (afgrænsede emailadresser) eller Boolean | Opret en standard catch-all alias, standard til `true` (hvis `true` vil den bruge API-brugerens emailadresse som modtager, og hvis `false` oprettes der ingen catch-all). Hvis en String gives, er det en afgrænset liste af emailadresser, der skal bruges som modtagere (adskilt af linjeskift, mellemrum og/eller komma)     |
| `has_adult_content_protection` | Nej      | Boolean                                       | Om der skal aktiveres voksenindholdsbeskyttelse i Spam Scanner på dette domæne                                                                                                                                                                                                                                               |
| `has_phishing_protection`      | Nej      | Boolean                                       | Om der skal aktiveres phishingbeskyttelse i Spam Scanner på dette domæne                                                                                                                                                                                                                                                    |
| `has_executable_protection`    | Nej      | Boolean                                       | Om der skal aktiveres eksekverbar beskyttelse i Spam Scanner på dette domæne                                                                                                                                                                                                                                                  |
| `has_virus_protection`         | Nej      | Boolean                                       | Om der skal aktiveres virusbeskyttelse i Spam Scanner på dette domæne                                                                                                                                                                                                                                                       |
| `has_recipient_verification`   | Nej      | Boolean                                       | Globalt domæne-standard for om alias-modtagere skal klikke på et email-verifikationslink for at emails kan flyde igennem                                                                                                                                                                                         |
| `ignore_mx_check`              | Nej      | Boolean                                       | Om MX-record-tjekket på domænet skal ignoreres ved verifikation. Dette er primært for brugere med avancerede MX-udvekslingskonfigurationsregler, der skal beholde deres eksisterende MX-udveksling og videresende til vores.                                                                                                  |
| `retention_days`               | Nej      | Number                                        | Heltal mellem `0` og `30` der svarer til antal opbevaringsdage for at gemme udgående SMTP-emails, når de er succesfuldt leveret eller permanent fejlet. Standard er `0`, hvilket betyder, at udgående SMTP-emails slettes og redigeres straks for din sikkerhed.                                       |
| `bounce_webhook`               | Nej      | String (URL) eller Boolean (false)            | Den `http://` eller `https://` webhook-URL efter eget valg til at sende bounce-webhooks til. Vi sender en `POST`-anmodning til denne URL med information om udgående SMTP-fejl (f.eks. bløde eller hårde fejl – så du kan administrere dine abonnenter og programmere din udgående email).                        |
| `max_quota_per_alias`          | Nej      | String                                        | Maksimal lagringskvote for aliaser på dette domænenavn. Indtast en værdi som "1 GB", der vil blive fortolket af [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                        |
> Eksempel på forespørgsel:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hent domæne {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verificer domæneposter {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verificer domænes SMTP-poster {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Liste over domænedækkende catch-all adgangskoder {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Opret domænedækkende catch-all adgangskode {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Påkrævet | Type   | Beskrivelse                                                                                                                                                                                                               |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nej      | String | Din brugerdefinerede nye adgangskode til brug for den domænedækkende catch-all adgangskode. Bemærk, at du kan lade denne være tom eller helt udelade den i din API-forespørgsels body, hvis du ønsker at få en tilfældigt genereret og stærk adgangskode. |
| `description`  | Nej      | String | Beskrivelse til organisatoriske formål.                                                                                                                                                                                  |

> Eksempel på forespørgsel:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Fjern domænedækkende catch-all adgangskode {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Eksempel på forespørgsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Opdater domæne {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Påkrævet | Type                            | Beskrivelse                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | Nej      | String eller Number             | Brugerdefineret port til konfiguration af SMTP-videresendelse (standard er `"25"`)                                                                                                                                                                                                            |
| `has_adult_content_protection` | Nej      | Boolean                        | Om Spam Scanner voksenindholdsbeskyttelse skal aktiveres på dette domæne                                                                                                                                                                                                                      |
| `has_phishing_protection`      | Nej      | Boolean                        | Om Spam Scanner phishing-beskyttelse skal aktiveres på dette domæne                                                                                                                                                                                                                           |
| `has_executable_protection`    | Nej      | Boolean                        | Om Spam Scanner beskyttelse mod eksekverbare filer skal aktiveres på dette domæne                                                                                                                                                                                                             |
| `has_virus_protection`         | Nej      | Boolean                        | Om Spam Scanner virusbeskyttelse skal aktiveres på dette domæne                                                                                                                                                                                                                              |
| `has_recipient_verification`   | Nej      | Boolean                        | Globalt domæne-standard for, om aliasmodtagere skal kræves at klikke på et e-mail verifikationslink for at e-mails kan flyde igennem                                                                                                                                                        |
| `ignore_mx_check`              | Nej      | Boolean                        | Om MX-postkontrollen på domænet skal ignoreres ved verifikation. Dette er primært for brugere, der har avancerede MX-udvekslingskonfigurationsregler og skal beholde deres eksisterende MX-udveksling og videresende til vores.                                                               |
| `retention_days`               | Nej      | Number                         | Heltal mellem `0` og `30`, der svarer til antallet af opbevaringsdage for at gemme udgående SMTP-e-mails, når de er leveret succesfuldt eller permanent fejlet. Standard er `0`, hvilket betyder, at udgående SMTP-e-mails straks slettes og redigeres for din sikkerhed.                      |
| `bounce_webhook`               | Nej      | String (URL) eller Boolean (false) | Den `http://` eller `https://` webhook-URL efter eget valg til at sende bounce-webhooks til. Vi sender en `POST`-anmodning til denne URL med information om udgående SMTP-fejl (f.eks. bløde eller hårde fejl – så du kan administrere dine abonnenter og programmere din udgående e-mail). |
| `max_quota_per_alias`          | Nej      | String                         | Maksimal lagerkvote for aliaser på dette domænenavn. Indtast en værdi som "1 GB", der vil blive fortolket af [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                 |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Slet domæne {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Invitationer {#invites}

### Accepter domæneinvitation {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Opret domæneinvitation {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Påkrævet | Type                | Beskrivelse                                                                              |
| -------------- | -------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `email`        | Ja       | String (Email)      | Emailadresse til at invitere til domænets medlemsliste                                  |
| `group`        | Ja       | String (enumerable) | Gruppe til at tilføje brugeren til domænets medlemskab med (kan være enten `"admin"` eller `"user"`) |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Hvis den bruger, der inviteres, allerede er et accepteret medlem af andre domæner, som den inviterende admin også er medlem af, vil invitationen automatisk blive accepteret og der sendes ikke en email.

### Fjern domæneinvitation {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Påkrævet | Type           | Beskrivelse                                      |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email`        | Ja       | String (Email) | Emailadresse til at fjerne fra domænets medlemsliste |

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Medlemmer {#members}

### Opdater domænemedlem {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Påkrævet | Type                | Beskrivelse                                                                                 |
| -------------- | -------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `group`        | Ja       | String (enumerable) | Gruppe til at opdatere brugeren til domænets medlemskab med (kan være enten `"admin"` eller `"user"`) |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Fjern domænemedlem {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliasser {#aliases}

### Generer et alias-adgangskode {#generate-an-alias-password}

Bemærk, at hvis du ikke sender instruktioner via email, vil brugernavn og adgangskode være i JSON-responsens krop ved en succesfuld forespørgsel i formatet `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Påkrævet | Type    | Beskrivelse                                                                                                                                                                                                                                                                                         |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Nej      | String  | Dit brugerdefinerede nye kodeord til aliaset. Bemærk, at du kan lade dette være tomt eller helt udelade det fra din API-forespørgsels krop, hvis du ønsker at få et tilfældigt genereret og stærkt kodeord.                                                                                          |
| `password`             | Nej      | String  | Eksisterende adgangskode for aliaset til at ændre adgangskoden uden at slette den eksisterende IMAP-mailboks (se `is_override`-muligheden nedenfor, hvis du ikke længere har den eksisterende adgangskode).                                                                                           |
| `is_override`          | Nej      | Boolean | **BRUG MED FORSIGTIGHED**: Dette vil overskrive den eksisterende alias-adgangskode og database fuldstændigt, og vil permanent slette den eksisterende IMAP-lagring og nulstille aliasets SQLite-emaildatabase fuldstændigt. Lav venligst en backup, hvis muligt, hvis du har en eksisterende mailboks tilknyttet dette alias. |
| `emailed_instructions` | Nej      | String  | Emailadresse til at sende aliasets adgangskode og opsætningsinstruktioner til.                                                                                                                                                                                                                      |
> Eksempel på forespørgsel:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Liste over domænealiaser {#list-domain-aliases}

> \[!NOTE]
> Fra og med 1. november 2024 vil API-endpoints for [Liste domæner](#list-domains) og [Liste domænealiaser](#list-domain-aliases) som standard returnere `1000` maks resultater pr. side. Hvis du ønsker at tilvælge denne adfærd tidligt, kan du tilføje `?paginate=true` som en ekstra querystring-parameter til URL'en for endpoint-forespørgslen. Se [Pagination](#pagination) for mere indsigt.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring Parameter | Påkrævet | Type                      | Beskrivelse                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nej      | String (RegExp understøttet) | Søg efter aliaser i et domæne efter navn, label eller modtager                                                                                   |
| `name`                | Nej      | String (RegExp understøttet) | Søg efter aliaser i et domæne efter navn                                                                                                        |
| `recipient`           | Nej      | String (RegExp understøttet) | Søg efter aliaser i et domæne efter modtager                                                                                                    |
| `sort`                | Nej      | String                    | Sorter efter et specifikt felt (prefix med et enkelt bindestreg `-` for at sortere i omvendt retning af det felt). Standard er `created_at`, hvis ikke sat. |
| `page`                | Nej      | Number                    | Se [Pagination](#pagination) for mere indsigt                                                                                                   |
| `limit`               | Nej      | Number                    | Se [Pagination](#pagination) for mere indsigt                                                                                                   |

> Eksempel på forespørgsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Opret nyt domænealias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Body Parameter                  | Påkrævet | Type                                   | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nej      | String                                 | Aliasnavn (hvis ikke angivet eller tomt, genereres et tilfældigt alias)                                                                                                                                                                                                                                                                                                                     |
| `recipients`                    | Nej      | String eller Array                     | Liste over modtagere (skal være linjeskift-/mellemrum-/komma-adskilt String eller Array af gyldige emailadresser, fuldt kvalificerede domænenavne ("FQDN"), IP-adresser og/eller webhook-URL'er – og hvis ikke angivet eller er et tomt Array, sættes brugerens email, som laver API-forespørgslen, som modtager)                                                                                     |
| `description`                   | Nej      | String                                 | Aliasbeskrivelse                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nej      | String eller Array                     | Liste over labels (skal være linjeskift-/mellemrum-/komma-adskilt String eller Array)                                                                                                                                                                                                                                                                                                       |
| `has_recipient_verification`    | Nej      | Boolean                                | Kræv at modtagere klikker på et email-verifikationslink for at emails kan flyde igennem (standard er domænets indstilling, hvis ikke eksplicit sat i forespørgselskroppen)                                                                                                                                                                                                                   |
| `is_enabled`                    | Nej      | Boolean                                | Om dette alias skal aktiveres eller deaktiveres (hvis deaktiveret, vil emails ikke blive sendt nogen steder, men returnere succesfulde statuskoder). Hvis en værdi gives, konverteres den til boolean ved brug af [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | Nej      | Number (enten `250`, `421` eller `550`) | Indkommende email til dette alias vil blive afvist, hvis `is_enabled` er `false` med enten `250` (stille leveres ingen steder, f.eks. blackhole eller `/dev/null`), `421` (blød afvisning; og genforsøg i op til ~5 dage) eller `550` permanent fejl og afvisning. Standard er `250`.                                                                                                                               |
| `has_imap`                      | Nej      | Boolean                                | Om IMAP-lagring for dette alias skal aktiveres eller deaktiveres (hvis deaktiveret, vil indkommende emails ikke blive lagret til [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en værdi gives, konverteres den til boolean ved brug af [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | Nej      | Boolean                                | Om [OpenPGP-kryptering](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) for [IMAP/POP3/CalDAV/CardDAV krypteret emaillagring](/blog/docs/best-quantum-safe-encrypted-email-service) ved brug af aliasets `public_key` skal aktiveres eller deaktiveres.                                                                                                         |
| `public_key`                    | Nej      | String                                 | OpenPGP offentlig nøgle i ASCII Armor-format ([klik her for at se et eksempel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG-nøgle for `support@forwardemail.net`). Gælder kun hvis `has_pgp` er sat til `true`. [Læs mere om end-to-end kryptering i vores FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nej      | String                                 | Maksimal lagringskvote for dette alias. Lad stå tomt for at nulstille til domænets nuværende maksimale kvote eller indtast en værdi som "1 GB", der vil blive fortolket af [bytes](https://github.com/visionmedia/bytes.js). Denne værdi kan kun justeres af domæneadministratorer.                                                                                                          |
| `vacation_responder_is_enabled` | Nej      | Boolean                                | Om en automatisk ferie-responder skal aktiveres eller deaktiveres.                                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_start_date` | Nej      | String                                 | Startdato for ferie-responder (hvis aktiveret og ingen startdato er sat her, antages det, at den allerede er startet). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing med `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | Nej      | String                                 | Slutdato for ferie-responder (hvis aktiveret og ingen slutdato er sat her, antages det, at den aldrig slutter og svarer for evigt). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing med `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | Nej      | String                                 | Emne i ren tekst til ferie-responderen, f.eks. "Out of Office". Vi bruger `striptags` til at fjerne al HTML her.                                                                                                                                                                                                                                                                             |
| `vacation_responder_message`    | Nej      | String                                 | Besked i ren tekst til ferie-responderen, f.eks. "Jeg er ude af kontoret indtil februar.". Vi bruger `striptags` til at fjerne al HTML her.                                                                                                                                                                                                                                               |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hent domænealias {#retrieve-domain-alias}

Du kan hente et domænealias enten ved dets `id` eller dets `name` værdi.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Opdater domænealias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Required | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nej      | String                                 | Alias navn                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Nej      | String eller Array                     | Liste over modtagere (skal være linjeskift/space/komma-separeret String eller Array af gyldige emailadresser, fuldt kvalificerede domænenavne ("FQDN"), IP-adresser og/eller webhook URL'er)                                                                                                                                                                                               |
| `description`                   | Nej      | String                                 | Alias beskrivelse                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nej      | String eller Array                     | Liste over labels (skal være linjeskift/space/komma-separeret String eller Array)                                                                                                                                                                                                                                                                                                           |
| `has_recipient_verification`    | Nej      | Boolean                                | Kræv at modtagere klikker på et email verifikationslink for at emails kan flyde igennem (standard til domænets indstilling, hvis ikke eksplicit sat i request body)                                                                                                                                                                                                                          |
| `is_enabled`                    | Nej      | Boolean                                | Om dette alias skal aktiveres eller deaktiveres (hvis deaktiveret, vil emails ikke blive sendt nogen steder men returnere succesfulde statuskoder). Hvis en værdi gives, konverteres den til boolean ved brug af [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                               |
| `error_code_if_disabled`        | Nej      | Number (enten `250`, `421`, eller `550`) | Indkommende email til dette alias vil blive afvist, hvis `is_enabled` er `false` med enten `250` (stille leveres ingen steder, f.eks. blackhole eller `/dev/null`), `421` (soft reject; og retry i op til ~5 dage) eller `550` permanent fejl og afvisning. Standard er `250`.                                                                                                               |
| `has_imap`                      | Nej      | Boolean                                | Om IMAP lagring for dette alias skal aktiveres eller deaktiveres (hvis deaktiveret, vil indkommende emails ikke blive gemt til [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en værdi gives, konverteres den til boolean ved brug af [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                              |
| `has_pgp`                       | Nej      | Boolean                                | Om [OpenPGP kryptering](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) for [IMAP/POP3/CalDAV/CardDAV krypteret email lagring](/blog/docs/best-quantum-safe-encrypted-email-service) ved brug af aliasets `public_key` skal aktiveres eller deaktiveres.                                                                                             |
| `public_key`                    | Nej      | String                                 | OpenPGP public key i ASCII Armor format ([klik her for at se et eksempel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG nøgle for `support@forwardemail.net`). Gælder kun hvis `has_pgp` er sat til `true`. [Læs mere om end-to-end kryptering i vores FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nej      | String                                 | Maksimal lagringskvote for dette alias. Lad stå tom for at nulstille til domænets nuværende maksimale kvote eller indtast en værdi som "1 GB" der bliver fortolket af [bytes](https://github.com/visionmedia/bytes.js). Denne værdi kan kun justeres af domæneadministratorer.                                                                                                               |
| `vacation_responder_is_enabled` | Nej      | Boolean                                | Om en automatisk ferie-responder skal aktiveres eller deaktiveres.                                                                                                                                                                                                                                                                                                                         |
| `vacation_responder_start_date` | Nej      | String                                 | Startdato for ferie-responder (hvis aktiveret og ingen startdato sat her, antages det at den allerede er startet). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing med `dayjs`.                                                                                                                                                        |
| `vacation_responder_end_date`   | Nej      | String                                 | Slutdato for ferie-responder (hvis aktiveret og ingen slutdato sat her, antages det at den aldrig slutter og svarer for evigt). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing med `dayjs`.                                                                                                                                              |
| `vacation_responder_subject`    | Nej      | String                                 | Emne i ren tekst til ferie-responder, f.eks. "Out of Office". Vi bruger `striptags` til at fjerne al HTML her.                                                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | Nej      | String                                 | Besked i ren tekst til ferie-responder, f.eks. "I will be out of office until February.". Vi bruger `striptags` til at fjerne al HTML her.                                                                                                                                                                                                                                                 |
> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Slet domænealias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Krypter {#encrypt}

Vi tillader dig at kryptere poster selv på gratisplanen uden omkostninger. Privatliv bør ikke være en funktion, det bør være indbygget i alle aspekter af et produkt. Som stærkt efterspurgt i en [Privacy Guides diskussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og på [vores GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) har vi tilføjet dette.

### Krypter TXT-post {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Påkrævet | Type   | Beskrivelse                                  |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | Ja       | String | Enhver gyldig Forward Email almindelig tekst TXT-post |

> Example Request:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
