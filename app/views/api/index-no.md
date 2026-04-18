# E-post API {#email-api}


## Innholdsfortegnelse {#table-of-contents}

* [Biblioteker](#libraries)
* [Base URI](#base-uri)
* [Autentisering](#authentication)
  * [API-token autentisering (anbefalt for de fleste endepunkter)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias-legitimasjon autentisering (for utgående e-post)](#alias-credentials-authentication-for-outbound-email)
  * [Kun alias-endepunkter](#alias-only-endpoints)
* [Feil](#errors)
* [Lokalisering](#localization)
* [Paginering](#pagination)
* [Logger](#logs)
  * [Hent logger](#retrieve-logs)
* [Konto](#account)
  * [Opprett konto](#create-account)
  * [Hent konto](#retrieve-account)
  * [Oppdater konto](#update-account)
* [Alias-kontakter (CardDAV)](#alias-contacts-carddav)
  * [List kontakter](#list-contacts)
  * [Opprett kontakt](#create-contact)
  * [Hent kontakt](#retrieve-contact)
  * [Oppdater kontakt](#update-contact)
  * [Slett kontakt](#delete-contact)
* [Alias-kalendere (CalDAV)](#alias-calendars-caldav)
  * [List kalendere](#list-calendars)
  * [Opprett kalender](#create-calendar)
  * [Hent kalender](#retrieve-calendar)
  * [Oppdater kalender](#update-calendar)
  * [Slett kalender](#delete-calendar)
* [Alias-meldinger (IMAP/POP3)](#alias-messages-imappop3)
  * [List og søk etter meldinger](#list-and-search-for-messages)
  * [Opprett melding](#create-message)
  * [Hent melding](#retrieve-message)
  * [Oppdater melding](#update-message)
  * [Slett melding](#delete-message)
* [Alias-mapper (IMAP/POP3)](#alias-folders-imappop3)
  * [List mapper](#list-folders)
  * [Opprett mappe](#create-folder)
  * [Hent mappe](#retrieve-folder)
  * [Oppdater mappe](#update-folder)
  * [Slett mappe](#delete-folder)
  * [Kopier mappe](#copy-folder)
* [Utgående e-poster](#outbound-emails)
  * [Hent grense for utgående SMTP-e-post](#get-outbound-smtp-email-limit)
  * [List utgående SMTP-e-poster](#list-outbound-smtp-emails)
  * [Opprett utgående SMTP-e-post](#create-outbound-smtp-email)
  * [Hent utgående SMTP-e-post](#retrieve-outbound-smtp-email)
  * [Slett utgående SMTP-e-post](#delete-outbound-smtp-email)
* [Domener](#domains)
  * [List domener](#list-domains)
  * [Opprett domene](#create-domain)
  * [Hent domene](#retrieve-domain)
  * [Verifiser domeneposter](#verify-domain-records)
  * [Verifiser SMTP-poster for domene](#verify-domain-smtp-records)
  * [List domenebredde catch-all-passord](#list-domain-wide-catch-all-passwords)
  * [Opprett domenebredde catch-all-passord](#create-domain-wide-catch-all-password)
  * [Fjern domenebredde catch-all-passord](#remove-domain-wide-catch-all-password)
  * [Oppdater domene](#update-domain)
  * [Slett domene](#delete-domain)
* [Invitasjoner](#invites)
  * [Godta domeninvitasjon](#accept-domain-invite)
  * [Opprett domeninvitasjon](#create-domain-invite)
  * [Fjern domeninvitasjon](#remove-domain-invite)
* [Medlemmer](#members)
  * [Oppdater domenemedlem](#update-domain-member)
  * [Fjern domenemedlem](#remove-domain-member)
* [Alias](#aliases)
  * [Generer et alias-passord](#generate-an-alias-password)
  * [List domenaliaser](#list-domain-aliases)
  * [Opprett nytt domenalias](#create-new-domain-alias)
  * [Hent domenalias](#retrieve-domain-alias)
  * [Oppdater domenalias](#update-domain-alias)
  * [Slett domenalias](#delete-domain-alias)
* [Krypter](#encrypt)
  * [Krypter TXT-post](#encrypt-txt-record)


## Biblioteker {#libraries}

Akkurat nå har vi ikke lansert noen API-wrappere ennå, men vi planlegger å gjøre det i nær fremtid. Send en e-post til <api@forwardemail.net> hvis du ønsker å bli varslet når en API-wrapper for et bestemt programmeringsspråk blir lansert. I mellomtiden kan du bruke disse anbefalte HTTP-forespørselsbibliotekene i applikasjonen din, eller ganske enkelt bruke [curl](https://stackoverflow.com/a/27442239/3586413) som i eksemplene nedenfor.

| Språk     | Bibliotek                                                              |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (vi er vedlikeholdere) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (vi er vedlikeholdere) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

Den nåværende HTTP base URI-stien er: `BASE_URI`.


## Autentisering {#authentication}

Alle endepunkter krever autentisering ved bruk av [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Vi støtter to autentiseringsmetoder:

### API Token Autentisering (Anbefalt for de fleste endepunkter) {#api-token-authentication-recommended-for-most-endpoints}

Sett din [API-nøkkel](https://forwardemail.net/my-account/security) som "brukernavn"-verdi med et tomt passord:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Merk kolon (`:`) etter API-token – dette indikerer et tomt passord i Basic Auth-format.

### Alias-legitimasjon Autentisering (For utgående e-post) {#alias-credentials-authentication-for-outbound-email}

Endepunktet [Opprett utgående SMTP e-post](#create-outbound-smtp-email) støtter også autentisering ved bruk av din alias e-postadresse og et [generert alias-passord](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Denne metoden er nyttig når du sender e-post fra applikasjoner som allerede bruker SMTP-legitimasjon og gjør migrering fra SMTP til vårt API sømløs.

### Alias-Only Endepunkter {#alias-only-endpoints}

[Alias Kontakter](#alias-contacts-carddav), [Alias Kalendere](#alias-calendars-caldav), [Alias Meldinger](#alias-messages-imappop3), og [Alias Mapper](#alias-folders-imappop3) endepunkter krever alias-legitimasjon og støtter ikke API token autentisering.

Ikke bekymre deg – eksempler er gitt nedenfor for deg hvis du ikke er sikker på hva dette er.


## Feil {#errors}

Hvis det oppstår noen feil, vil responskroppen til API-forespørselen inneholde en detaljert feilmelding.

| Kode | Navn                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |
| 501  | Not Implemented       |
| 502  | Bad Gateway           |
| 503  | Service Unavailable   |
| 504  | Gateway Time-out      |

> \[!TIP]
> Hvis du mottar en 5xx statuskode (som ikke skal skje), vennligst kontakt oss på <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> så hjelper vi deg med å løse problemet umiddelbart.


## Lokalisering {#localization}

Vår tjeneste er oversatt til over 25 forskjellige språk. Alle API-responsmeldinger oversettes til den siste lokaliteten som oppdages for brukeren som gjør API-forespørselen. Du kan overstyre dette ved å sende en egendefinert `Accept-Language` header. Prøv gjerne ut ved å bruke språkvelgeren nederst på denne siden.


## Paginering {#pagination}

> \[!NOTE]
> Fra og med 1. november 2024 vil API-endepunktene for [List domains](#list-domains) og [List domain aliases](#list-domain-aliases) som standard ha `1000` maks resultater per side. Hvis du ønsker å velge denne oppførselen tidlig, kan du sende `?paginate=true` som en ekstra querystring-parameter til URL-en for endepunktets spørring.

Paginering støttes av alle API-endepunkter som lister resultater.

Oppgi enkelt querystring-egenskapene `page` (og eventuelt `limit`).

Egenskapen `page` skal være et tall større enn eller lik `1`. Hvis du oppgir `limit` (også et tall), er minimumsverdien `10` og maksimum `50` (med mindre annet er angitt).

| Querystring Parameter | Påkrevd | Type   | Beskrivelse                                                                                                                                               |
| --------------------- | ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nei     | Nummer | Side med resultater som skal returneres. Hvis ikke spesifisert, vil `page`-verdien være `1`. Må være et tall større enn eller lik `1`.                     |
| `limit`               | Nei     | Nummer | Antall resultater som skal returneres per side. Standard er `10` hvis ikke spesifisert. Må være et tall større enn eller lik `1`, og mindre enn eller lik `50`. |
For å avgjøre om flere resultater er tilgjengelige eller ikke, gir vi disse HTTP-responsoverskriftene (som du kan analysere for å paginere programmatisk):

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Det totale antallet sider som er tilgjengelige.                                                                                                                                                                                                                                                                                                                  |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Den nåværende siden med resultater som returneres (f.eks. basert på `page`-spørringsparameteren).                                                                                                                                                                                                                                                                 |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Det totale antallet resultater på siden som returneres (f.eks. basert på `limit`-spørringsparameteren og faktiske resultater som returneres).                                                                                                                                                                                                                      |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Det totale antallet elementer tilgjengelig på tvers av alle sider.                                                                                                                                                                                                                                                                                               |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Vi gir en `Link` HTTP-responsoverskrift som du kan analysere som vist i eksemplet. Dette er [likt GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (f.eks. vil ikke alle verdier bli gitt hvis de ikke er relevante eller tilgjengelige, f.eks. vil ikke `"next"` bli gitt hvis det ikke finnes en neste side). |
> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logger {#logs}

### Hent logger {#retrieve-logs}

Vår API lar deg programmessivt laste ned logger for kontoen din. Å sende en forespørsel til dette endepunktet vil behandle alle logger for kontoen din og sende dem til deg som et vedlegg (en [Gzip](https://en.wikipedia.org/wiki/Gzip) komprimert [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) regnearkfil) når det er fullført.

Dette lar deg opprette bakgrunnsjobber med en [Cron job](https://en.wikipedia.org/wiki/Cron) eller bruke vår [Node.js job scheduling software Bree](https://github.com/breejs/bree) for å motta logger når du ønsker det. Merk at dette endepunktet er begrenset til `10` forespørsler per dag.

Vedlegget har små bokstaver og navnet `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` og e-posten inneholder en kort oppsummering av de hentede loggene. Du kan også laste ned logger når som helst fra [Min konto → Logger](/my-account/logs)

> `GET /v1/logs/download`

| Querystring Parameter | Påkrevd | Type          | Beskrivelse                                                                                                                     |
| --------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Nei     | String (FQDN) | Filtrer logger etter fullt kvalifisert domene ("FQDN"). Hvis du ikke oppgir dette, hentes alle logger på tvers av alle domener. |
| `q`                   | Nei     | String        | Søk etter logger etter e-post, domene, aliasnavn, IP-adresse eller dato (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` eller `M.D.YY` format). |
| `bounce_category`     | Nei     | String        | Søk etter logger etter en spesifikk bounce-kategori (f.eks. `blocklist`).                                                       |
| `response_code`       | Nei     | Number        | Søk etter logger etter en spesifikk feilkode (f.eks. `421` eller `550`).                                                        |

> Eksempel på forespørsel:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Eksempel på Cron-jobb (ved midnatt hver dag):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Merk at du kan bruke tjenester som [Crontab.guru](https://crontab.guru/) for å validere syntaksen i cron-jobb-uttrykket ditt.

> Eksempel på Cron-jobb (ved midnatt hver dag **og med logger for forrige dag**):

For MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

For Linux og Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Konto {#account}

### Opprett konto {#create-account}

> `POST /v1/account`

| Body Parameter | Påkrevd | Type           | Beskrivelse   |
| -------------- | ------- | -------------- | ------------- |
| `email`        | Ja      | String (E-post)| E-postadresse |
| `password`     | Ja      | String         | Passord      |

> Eksempel på forespørsel:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hent konto {#retrieve-account}

> `GET /v1/account`

> Eksempel på forespørsel:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Oppdater konto {#update-account}

> `PUT /v1/account`

| Body Parameter | Påkrevd | Type           | Beskrivelse          |
| -------------- | ------- | -------------- | -------------------- |
| `email`        | Nei     | String (E-post)| E-postadresse        |
| `given_name`   | Nei     | String         | Fornavn              |
| `family_name`  | Nei     | String         | Etternavn            |
| `avatar_url`   | Nei     | String (URL)   | Lenke til avatarbilde |

> Eksempel på forespørsel:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias-kontakter (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> I motsetning til andre API-endepunkter krever disse [Autentisering](#authentication) med "brukernavn" lik alias-brukernavnet og "passord" lik alias-generert passord som Basic Authorization headers.
> \[!WARNING]
> Denne endepunktseksjonen er under utvikling og vil bli lansert (forhåpentligvis) i 2024. I mellomtiden vennligst bruk en IMAP-klient fra "Apps"-menyen i navigasjonen på vår nettside.

### Liste kontakter {#list-contacts}

> `GET /v1/contacts`

**Kommer snart**

### Opprett kontakt {#create-contact}

> `POST /v1/contacts`

**Kommer snart**

### Hent kontakt {#retrieve-contact}

> `GET /v1/contacts/:id`

**Kommer snart**

### Oppdater kontakt {#update-contact}

> `PUT /v1/contacts/:id`

**Kommer snart**

### Slett kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Kommer snart**


## Alias-kalendere (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> I motsetning til andre API-endepunkter krever disse [Autentisering](#authentication) med "brukernavn" lik alias-brukernavnet og "passord" lik alias-generert passord som Basic Authorization headers.

> \[!WARNING]
> Denne endepunktseksjonen er under utvikling og vil bli lansert (forhåpentligvis) i 2024. I mellomtiden vennligst bruk en IMAP-klient fra "Apps"-menyen i navigasjonen på vår nettside.

### Liste kalendere {#list-calendars}

> `GET /v1/calendars`

**Kommer snart**

### Opprett kalender {#create-calendar}

> `POST /v1/calendars`

**Kommer snart**

### Hent kalender {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Kommer snart**

### Oppdater kalender {#update-calendar}

> `PUT /v1/calendars/:id`

**Kommer snart**

### Slett kalender {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Kommer snart**


## Alias-meldinger (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> I motsetning til andre API-endepunkter krever disse [Autentisering](#authentication) med "brukernavn" lik alias-brukernavnet og "passord" lik alias-generert passord som Basic Authorization headers.

> \[!WARNING]
> Denne endepunktseksjonen er under utvikling og vil bli lansert (forhåpentligvis) i 2024. I mellomtiden vennligst bruk en IMAP-klient fra "Apps"-menyen i navigasjonen på vår nettside.

Vennligst sørg for at du har fulgt oppsettsinstruksjonene for ditt domene.

Disse instruksjonene finnes i vår FAQ-seksjon [Støtter dere mottak av e-post med IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Liste og søk etter meldinger {#list-and-search-for-messages}

> `GET /v1/messages`

**Kommer snart**

### Opprett melding {#create-message}

> \[!NOTE]
> Dette vil **IKKE** sende en e-post – det vil bare legge meldingen til i postkasse-mappen din (f.eks. tilsvarende IMAP-kommandoen `APPEND`). Hvis du ønsker å sende en e-post, se [Opprett utgående SMTP-e-post](#create-outbound-smtp-email) nedenfor. Etter å ha opprettet den utgående SMTP-e-posten, kan du legge til en kopi av den med dette endepunktet i aliasets postkasse for lagringsformål.

> `POST /v1/messages`

**Kommer snart**

### Hent melding {#retrieve-message}

> `GET /v1/messages/:id`

**Kommer snart**

### Oppdater melding {#update-message}

> `PUT /v1/messages/:id`

**Kommer snart**

### Slett melding {#delete-message}

> `DELETE /v1/messages:id`

**Kommer snart**


## Alias-mapper (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Mappeendepunkter med en mappes sti <code>/v1/folders/:path</code> som endepunkt kan byttes ut med en mappes ID <code>:id</code>. Dette betyr at du kan referere til mappen enten med <code>path</code> eller <code>id</code>.

> \[!WARNING]
> Denne endepunktseksjonen er under utvikling og vil bli lansert (forhåpentligvis) i 2024. I mellomtiden vennligst bruk en IMAP-klient fra "Apps"-menyen i navigasjonen på vår nettside.

### Liste mapper {#list-folders}

> `GET /v1/folders`

**Kommer snart**

### Opprett mappe {#create-folder}

> `POST /v1/folders`

**Kommer snart**

### Hent mappe {#retrieve-folder}

> `GET /v1/folders/:id`

**Kommer snart**

### Oppdater mappe {#update-folder}

> `PUT /v1/folders/:id`

**Kommer snart**

### Slett mappe {#delete-folder}

> `DELETE /v1/folders/:id`

**Kommer snart**

### Kopier mappe {#copy-folder}

> `POST /v1/folders/:id/copy`

**Kommer snart**


## Utgående e-poster {#outbound-emails}

Vennligst sørg for at du har fulgt oppsettsinstruksjonene for ditt domene.

Disse instruksjonene finnes under [Min konto → Domener → Innstillinger → Utgående SMTP-konfigurasjon](/my-account/domains). Du må sikre oppsett av DKIM, Return-Path og DMARC for å sende utgående SMTP med ditt domene.
### Hent grense for utgående SMTP-e-post {#get-outbound-smtp-email-limit}

Dette er et enkelt endepunkt som returnerer et JSON-objekt som inneholder `count` og `limit` for antall daglige utgående SMTP-meldinger per konto.

> `GET /v1/emails/limit`

> Eksempel på forespørsel:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### List utgående SMTP-e-poster {#list-outbound-smtp-emails}

Merk at dette endepunktet ikke returnerer egenskapsverdier for en e-posts `message`, `headers` eller `rejectedErrors`.

For å returnere disse egenskapene og deres verdier, vennligst bruk [Hent e-post](#retrieve-email) endepunktet med en e-post-ID.

> `GET /v1/emails`

| Querystring Parameter | Påkrevd | Type                      | Beskrivelse                                                                                                                                      |
| --------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nei     | String (RegExp støttes)   | Søk etter e-poster basert på metadata                                                                                                           |
| `domain`              | Nei     | String (RegExp støttes)   | Søk etter e-poster basert på domenenavn                                                                                                         |
| `sort`                | Nei     | String                    | Sorter etter et spesifikt felt (prefiks med et enkelt bindestrek `-` for å sortere i motsatt retning av det feltet). Standard er `created_at` hvis ikke satt. |
| `page`                | Nei     | Number                    | Se [Paginering](#pagination) for mer informasjon                                                                                               |
| `limit`               | Nei     | Number                    | Se [Paginering](#pagination) for mer informasjon                                                                                               |

> Eksempel på forespørsel:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Opprett utgående SMTP-e-post {#create-outbound-smtp-email}

Vårt API for å opprette en e-post er inspirert av og benytter Nodemailers konfigurasjon for meldingsalternativer. Vennligst se [Nodemailer message configuration](https://nodemailer.com/message/) for alle kroppparametere nedenfor.

Merk at med unntak av `envelope` og `dkim` (siden vi setter disse automatisk for deg), støtter vi alle Nodemailer-alternativer. Vi setter automatisk `disableFileAccess` og `disableUrlAccess` til `true` av sikkerhetsgrunner.

Du bør enten sende det enkeltalternativet `raw` med din rå fullstendige e-post inkludert headere **eller** sende individuelle kroppparameter-alternativer nedenfor.

Dette API-endepunktet vil automatisk kode emojis for deg hvis de finnes i headerne (f.eks. en emnelinje `Subject: 🤓 Hello` konverteres automatisk til `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Målet vårt var å lage et ekstremt utviklervennlig og idiot-sikkert e-post-API.

**Autentisering:** Dette endepunktet støtter både [API-token autentisering](#api-token-authentication-recommended-for-most-endpoints) og [alias-legitimasjonsautentisering](#alias-credentials-authentication-for-outbound-email). Se [Autentisering](#authentication) seksjonen ovenfor for detaljer.

> `POST /v1/emails`

| Kroppsparameter  | Påkrevd | Type             | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Nei     | String (E-post)   | E-postadressen til avsenderen (må eksistere som et alias for domenet).                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | Nei     | String eller Array| Komma-separert liste eller en Array av mottakere for "To"-headeren.                                                                                                                                                                                                                                                                                                                                                                                              |
| `cc`             | Nei     | String eller Array| Komma-separert liste eller en Array av mottakere for "Cc"-headeren.                                                                                                                                                                                                                                                                                                                                                                                              |
| `bcc`            | Nei     | String eller Array| Komma-separert liste eller en Array av mottakere for "Bcc"-headeren.                                                                                                                                                                                                                                                                                                                                                                                             |
| `subject`        | Nei     | String           | Emnet for e-posten.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`           | Nei     | String eller Buffer | Ren tekstversjon av meldingen.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `html`           | Nei     | String eller Buffer | HTML-versjon av meldingen.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `attachments`    | Nei     | Array            | En array av vedleggsobjekter (se [Nodemailers vanlige felt](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                      |
| `sender`         | Nei     | String           | E-postadressen for "Sender"-headeren (se [Nodemailers mer avanserte felt](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                                 |
| `replyTo`        | Nei     | String           | E-postadressen for "Reply-To"-headeren.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `inReplyTo`      | Nei     | String           | Message-ID som meldingen svarer på.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `references`     | Nei     | String eller Array| Mellomrom-separert liste eller en Array av Message-ID'er.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachDataUrls` | Nei     | Boolean          | Hvis `true` konverteres `data:`-bilder i HTML-innholdet til innebygde vedlegg.                                                                                                                                                                                                                                                                                                                                                                                   |
| `watchHtml`      | Nei     | String           | En Apple Watch-spesifikk HTML-versjon av meldingen ([ifølge Nodemailer-dokumentasjonen](https://nodemailer.com/message/#content-options]), de nyeste klokkene krever ikke at dette settes).                                                                                                                                                                                                                                                                      |
| `amp`            | Nei     | String           | En AMP4EMAIL-spesifikk HTML-versjon av meldingen (se [Nodemailers eksempel](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                         |
| `icalEvent`      | Nei     | Object           | En iCalendar-hendelse som alternativt meldingsinnhold (se [Nodemailers kalenderhendelser](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                                     |
| `alternatives`   | Nei     | Array            | En Array av alternativt meldingsinnhold (se [Nodemailers alternative content](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                    |
| `encoding`       | Nei     | String           | Koding for tekst- og HTML-strenger (standard er `"utf-8"`, men støtter også `"hex"` og `"base64"`).                                                                                                                                                                                                                                                                                                                                                               |
| `raw`            | Nei     | String eller Buffer | En egendefinert generert RFC822-formatert melding som skal brukes (i stedet for en som genereres av Nodemailer – se [Nodemailers custom source](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                   |
| `textEncoding`   | Nei     | String           | Koding som tvinges brukt for tekstverdier (enten `"quoted-printable"` eller `"base64"`). Standardverdien er den nærmeste oppdagede verdien (for ASCII bruk `"quoted-printable"`).                                                                                                                                                                                                                                                                               |
| `priority`       | Nei     | String           | Prioritetsnivå for e-posten (kan være `"high"`, `"normal"` (standard), eller `"low"`). Merk at en verdi på `"normal"` ikke setter en prioritetsheader (dette er standard oppførsel). Hvis en verdi på `"high"` eller `"low"` settes, vil `X-Priority`, `X-MSMail-Priority` og `Importance` headerne [settes tilsvarende](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Nei     | Object eller Array| Et objekt eller en array av ekstra headerfelt som skal settes (se [Nodemailers custom headers](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                  |
| `messageId`      | Nei     | String           | En valgfri Message-ID-verdi for "Message-ID"-headeren (en standardverdi vil automatisk opprettes hvis ikke satt – merk at verdien bør [følge RFC2822-spesifikasjonen](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                     |
| `date`           | Nei     | String eller Date| En valgfri dato som brukes hvis Date-header mangler etter parsing, ellers brukes gjeldende UTC-streng hvis ikke satt. Dato-headeren kan ikke være mer enn 30 dager frem i tid fra nåværende tidspunkt.                                                                                                                                                                                                                                                           |
| `list`           | Nei     | Object           | Et valgfritt objekt med `List-*`-headere (se [Nodemailers list headers](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                            |
> Eksempel Forespørsel (API-token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Eksempel Forespørsel (Alias-legitimasjon):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Eksempel Forespørsel (Rå e-post):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Hent utgående SMTP-e-post {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Slett utgående SMTP-e-post {#delete-outbound-smtp-email}

Sletting av e-post vil sette status til `"rejected"` (og deretter ikke behandle den i køen) kun hvis gjeldende status er en av `"pending"`, `"queued"`, eller `"deferred"`. Vi kan automatisk slette e-poster etter 30 dager etter at de ble opprettet og/eller sendt – derfor bør du beholde en kopi av utgående SMTP-e-poster i din klient, database eller applikasjon. Du kan referere til vår e-post-ID-verdi i databasen din om ønskelig – denne verdien returneres fra både [Opprett e-post](#create-email) og [Hent e-post](#retrieve-email) endepunktene.

> `DELETE /v1/emails/:id`

> Eksempel Forespørsel:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domener {#domains}

> \[!TIP]
> Domenendepunkter med et domenenavn <code>/v1/domains/:domain_name</code> som endepunkt er utskiftbare med et domene-ID <code>:domain_id</code>. Dette betyr at du kan referere til domenet enten med dets <code>navn</code> eller <code>id</code>-verdi.

### List domener {#list-domains}

> \[!NOTE]
> Fra og med 1. november 2024 vil API-endepunktene for [List domener](#list-domains) og [List domenaliaser](#list-domain-aliases) som standard ha `1000` maks resultater per side. Hvis du ønsker å velge denne oppførselen tidlig, kan du sende `?paginate=true` som en ekstra spørringsparameter til URL-en for endepunktspørringen. Se [Paginering](#pagination) for mer informasjon.

> `GET /v1/domains`

| Spørringsparameter     | Obligatorisk | Type                      | Beskrivelse                                                                                                                                      |
| --------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nei         | String (RegExp støttes)   | Søk etter domener etter navn                                                                                                                    |
| `name`                | Nei         | String (RegExp støttes)   | Søk etter domener etter navn                                                                                                                    |
| `sort`                | Nei         | String                    | Sorter etter et spesifikt felt (prefiks med et enkelt bindestrek `-` for å sortere i motsatt retning av det feltet). Standard er `created_at` hvis ikke satt. |
| `page`                | Nei         | Number                    | Se [Paginering](#pagination) for mer informasjon                                                                                               |
| `limit`               | Nei         | Number                    | Se [Paginering](#pagination) for mer informasjon                                                                                               |

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Opprett domene {#create-domain}

> `POST /v1/domains`

| Kroppsparameter               | Obligatorisk | Type                                          | Beskrivelse                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | ------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                     | Ja           | String (FQDN eller IP)                         | Fullt kvalifisert domenenavn ("FQDN") eller IP-adresse                                                                                                                                                                                                                                                               |
| `team_domain`                | Nei          | String (domene-ID eller domenenavn; FQDN)     | Automatisk tilordne dette domenet til samme team som et annet domene. Dette betyr at alle medlemmer fra dette domenet vil bli tildelt som teammedlemmer, og `plan` vil automatisk settes til `team` også. Du kan sette dette til `"none"` om nødvendig for å eksplisitt deaktivere dette, men det er ikke nødvendig. |
| `plan`                       | Nei          | String (enumererbar)                           | Plan-type (må være `"free"`, `"enhanced_protection"`, eller `"team"`, standard til `"free"` eller brukerens nåværende betalte plan hvis på en)                                                                                                                                                                       |
| `catchall`                   | Nei          | String (avgrensede e-postadresser) eller Boolean | Opprett en standard catch-all alias, standard til `true` (hvis `true` vil det bruke API-brukerens e-postadresse som mottaker, og hvis `false` opprettes ingen catch-all). Hvis en streng sendes, er det en avgrenset liste over e-postadresser som skal brukes som mottakere (adskilt med linjeskift, mellomrom, og/eller komma) |
| `has_adult_content_protection` | Nei        | Boolean                                       | Om det skal aktiveres vokseninnholdsbeskyttelse i Spam Scanner på dette domenet                                                                                                                                                                                                                                       |
| `has_phishing_protection`    | Nei          | Boolean                                       | Om det skal aktiveres phishing-beskyttelse i Spam Scanner på dette domenet                                                                                                                                                                                                                                            |
| `has_executable_protection`  | Nei          | Boolean                                       | Om det skal aktiveres kjørbar-fil-beskyttelse i Spam Scanner på dette domenet                                                                                                                                                                                                                                         |
| `has_virus_protection`       | Nei          | Boolean                                       | Om det skal aktiveres virusbeskyttelse i Spam Scanner på dette domenet                                                                                                                                                                                                                                                |
| `has_recipient_verification` | Nei          | Boolean                                       | Globalt domenenivå standard for om alias-mottakere må klikke på en e-postverifiseringslenke for at e-poster skal flyte gjennom                                                                                                                                                                                        |
| `ignore_mx_check`            | Nei          | Boolean                                       | Om MX-postsjekken på domenet for verifisering skal ignoreres. Dette er hovedsakelig for brukere som har avanserte MX-utvekslingskonfigurasjonsregler og trenger å beholde sin eksisterende MX-utveksling og videresende til vår.                                                                                      |
| `retention_days`             | Nei          | Number                                        | Heltall mellom `0` og `30` som tilsvarer antall dager for lagring av utgående SMTP-e-poster etter vellykket levering eller permanent feil. Standard er `0`, som betyr at utgående SMTP-e-poster slettes og redigeres umiddelbart for din sikkerhet.                                                                |
| `bounce_webhook`             | Nei          | String (URL) eller Boolean (false)             | Den `http://` eller `https://` webhook-URL-en du ønsker å sende bounce-webhooks til. Vi vil sende en `POST`-forespørsel til denne URL-en med informasjon om utgående SMTP-feil (f.eks. myke eller harde feil – slik at du kan administrere abonnentene dine og programmere håndtering av utgående e-post).           |
| `max_quota_per_alias`        | Nei          | String                                        | Maksimal lagringskvote for aliaser på dette domenenavnet. Skriv inn en verdi som "1 GB" som vil bli tolket av [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                      |
> Eksempel Forespørsel:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hent domene {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verifiser domeneposter {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifiser domenets SMTP-poster {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### List domenebredde catch-all passord {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Opprett domenebredde catch-all passord {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Obligatorisk | Type   | Beskrivelse                                                                                                                                                                                                               |
| -------------- | ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nei          | String | Ditt egendefinerte nye passord som skal brukes for domenebredde catch-all passordet. Merk at du kan la dette stå tomt eller utelate det helt fra API-forespørselens body hvis du ønsker å få et tilfeldig generert og sterkt passord.  Egendefinerte passord for postbokser må være 128 tegn eller færre, kan ikke begynne eller slutte med mellomrom, og kan ikke inneholde anførselstegn eller apostrofer. Catch-all passord er kun for SMTP sending. For IMAP, POP3, CalDAV, CardDAV og postboks-tilgang, opprett et passord for den spesifikke aliasen isteden. |
| `description`  | Nei          | String | Beskrivelse kun for organisasjonsformål.                                                                                                                                                                                 |

> Eksempel Forespørsel:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Fjern domenebredde catch-all passord {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Eksempel Forespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Oppdater domene {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Obligatorisk | Type                            | Beskrivelse                                                                                                                                                                                                                                                                                   |
| ------------------------------ | ------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | Nei          | String eller Nummer             | Egendefinert port for konfigurasjon av SMTP-videresending (standard er `"25"`)                                                                                                                                                                                                               |
| `has_adult_content_protection` | Nei          | Boolean                        | Om vokseninnholdsbeskyttelse i Spam Scanner skal aktiveres på dette domenet                                                                                                                                                                                                                   |
| `has_phishing_protection`      | Nei          | Boolean                        | Om phishingbeskyttelse i Spam Scanner skal aktiveres på dette domenet                                                                                                                                                                                                                        |
| `has_executable_protection`    | Nei          | Boolean                        | Om kjørbar-filbeskyttelse i Spam Scanner skal aktiveres på dette domenet                                                                                                                                                                                                                    |
| `has_virus_protection`         | Nei          | Boolean                        | Om virusbeskyttelse i Spam Scanner skal aktiveres på dette domenet                                                                                                                                                                                                                           |
| `has_recipient_verification`   | Nei          | Boolean                        | Globalt domenenivå standard for om alias-mottakere må klikke på en e-postverifiseringslenke for at e-post skal kunne flyte gjennom                                                                                                                                                           |
| `ignore_mx_check`              | Nei          | Boolean                        | Om MX-postsjekken på domenet skal ignoreres ved verifisering. Dette er hovedsakelig for brukere som har avanserte MX-utvekslingskonfigurasjonsregler og må beholde sin eksisterende MX-utveksling og videresende til vår.                                                                    |
| `retention_days`               | Nei          | Nummer                         | Heltall mellom `0` og `30` som tilsvarer antall dager for lagring av utgående SMTP-e-poster etter vellykket levering eller permanent feil. Standard er `0`, som betyr at utgående SMTP-e-poster slettes og anonymiseres umiddelbart for din sikkerhet.                                      |
| `bounce_webhook`               | Nei          | String (URL) eller Boolean (false) | Den `http://` eller `https://` webhook-URL-en du ønsker å sende bounce-webhooks til. Vi vil sende en `POST`-forespørsel til denne URL-en med informasjon om utgående SMTP-feil (f.eks. myke eller harde feil – slik at du kan administrere abonnentene dine og programmere håndtering av utgående e-post). |
| `max_quota_per_alias`          | Nei          | String                         | Maksimal lagringskvote for aliaser på dette domenenavnet. Skriv inn en verdi som "1 GB" som vil bli tolket av [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                 |
> Eksempel Forespørsel:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Slett domene {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Eksempel Forespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Invitasjoner {#invites}

### Aksepter domeneinvitasjon {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Opprett domeneinvitasjon {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Obligatorisk | Type                | Beskrivelse                                                                               |
| -------------- | ------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | Ja           | String (E-post)     | E-postadresse for å invitere til listen over domenemedlemmer                             |
| `group`        | Ja           | String (enumerable) | Gruppe for å legge brukeren til domenemedlemskapet med (kan være en av `"admin"` eller `"user"`) |

> Eksempel Forespørsel:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Hvis brukeren som inviteres allerede er et akseptert medlem av andre domener som administratoren som inviterer dem er medlem av, vil invitasjonen automatisk godtas og det sendes ikke e-post.

### Fjern domeneinvitasjon {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Obligatorisk | Type           | Beskrivelse                                      |
| -------------- | ------------ | -------------- | ------------------------------------------------ |
| `email`        | Ja           | String (E-post) | E-postadresse som skal fjernes fra listen over domenemedlemmer |

> Eksempel Forespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Medlemmer {#members}

### Oppdater domenemedlem {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Obligatorisk | Type                | Beskrivelse                                                                                  |
| -------------- | ------------ | ------------------- | -------------------------------------------------------------------------------------------- |
| `group`        | Ja           | String (enumerable) | Gruppe for å oppdatere brukeren til domenemedlemskapet med (kan være en av `"admin"` eller `"user"`) |

> Eksempel Forespørsel:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Fjern domenemedlem {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Eksempel Forespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Alias {#aliases}

### Generer et alias-passord {#generate-an-alias-password}

Merk at hvis du ikke sender instruksjoner på e-post, vil brukernavn og passord være i JSON-responsen av en vellykket forespørsel i formatet `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Obligatorisk | Type    | Beskrivelse                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Nei          | String  | Ditt egendefinerte nye passord for aliaset. Merk at du kan la dette stå tomt eller utelate det helt fra API-forespørselen hvis du ønsker å få et tilfeldig generert og sterkt passord.                                                                                                             Egendefinerte passord for postbokser må være 128 tegn eller færre, kan ikke begynne eller slutte med mellomrom, og kan ikke inneholde anførselstegn eller apostrofer. |
| `password`             | Nei          | String  | Eksisterende passord for aliaset for å endre passordet uten å slette eksisterende IMAP-postkasselagring (se `is_override`-alternativet nedenfor hvis du ikke lenger har det eksisterende passordet).                                                                                                 |
| `is_override`          | Nei          | Boolean | **BRUK MED FORSIKTIGHET**: Dette vil overskrive det eksisterende alias-passordet og databasen fullstendig, og vil permanent slette eksisterende IMAP-lagring og tilbakestille aliasets SQLite e-postdatabase fullstendig. Vennligst ta sikkerhetskopi hvis mulig hvis du har en eksisterende postkasse knyttet til dette aliaset. |
| `emailed_instructions` | Nei          | String  | E-postadresse som passord og oppsettsinstruksjoner for aliaset skal sendes til.                                                                                                                                                                                                                   |
> Eksempel Forespørsel:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Liste over domenaliaser {#list-domain-aliases}

> \[!NOTE]
> Fra og med 1. november 2024 vil API-endepunktene for [Liste domener](#list-domains) og [Liste domenaliaser](#list-domain-aliases) som standard ha `1000` maks resultater per side. Hvis du ønsker å velge denne oppførselen tidlig, kan du sende `?paginate=true` som en ekstra spørringsparameter til URL-en for endepunktspørringen. Se [Paginering](#pagination) for mer informasjon.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Spørringsparameter | Obligatorisk | Type                      | Beskrivelse                                                                                                                                      |
| ------------------ | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                | Nei          | String (RegExp støttes)   | Søk etter aliaser i et domene etter navn, etikett eller mottaker                                                                                 |
| `name`             | Nei          | String (RegExp støttes)   | Søk etter aliaser i et domene etter navn                                                                                                        |
| `recipient`        | Nei          | String (RegExp støttes)   | Søk etter aliaser i et domene etter mottaker                                                                                                   |
| `sort`             | Nei          | String                    | Sorter etter et spesifikt felt (prefiks med et enkelt bindestrek `-` for å sortere i motsatt retning av det feltet). Standard er `created_at` hvis ikke satt. |
| `page`             | Nei          | Nummer                    | Se [Paginering](#pagination) for mer informasjon                                                                                               |
| `limit`            | Nei          | Nummer                    | Se [Paginering](#pagination) for mer informasjon                                                                                               |

> Eksempel Forespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Opprett nytt domenalias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Kroppsparameter                 | Obligatorisk | Type                                   | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                         | Nei          | String                                 | Aliasnavn (hvis ikke oppgitt eller tomt, genereres et tilfeldig alias)                                                                                                                                                                                                                                                                                                                      |
| `recipients`                   | Nei          | String eller Array                     | Liste over mottakere (må være linjeskift/space/komma-separert String eller Array av gyldige e-postadresser, fullt kvalifiserte domenenavn ("FQDN"), IP-adresser og/eller webhook-URL-er – og hvis ikke oppgitt eller er en tom Array, settes brukerens e-post som gjør API-forespørselen som mottaker)                                                                                     |
| `description`                  | Nei          | String                                 | Aliasbeskrivelse                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                      | Nei          | String eller Array                     | Liste over etiketter (må være linjeskift/space/komma-separert String eller Array)                                                                                                                                                                                                                                                                                                           |
| `has_recipient_verification`   | Nei          | Boolean                                | Krev at mottakere klikker på en e-postverifiseringslenke for at e-poster skal gå gjennom (standard til domenets innstilling hvis ikke eksplisitt satt i forespørselskroppen)                                                                                                                                                                                                              |
| `is_enabled`                   | Nei          | Boolean                                | Om dette aliaset skal aktiveres eller deaktiveres (hvis deaktivert, vil e-poster ikke rutes noe sted, men returnere suksessstatuskoder). Hvis en verdi sendes, konverteres den til en boolean ved bruk av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`       | Nei          | Nummer (enten `250`, `421` eller `550`) | Inngående e-post til dette aliaset vil avvises hvis `is_enabled` er `false` med enten `250` (stille levere ingen steder, f.eks. svart hull eller `/dev/null`), `421` (myk avvisning; og prøv igjen i opptil ~5 dager) eller `550` permanent feil og avvisning. Standard er `250`.                                                                                                                               |
| `has_imap`                    | Nei          | Boolean                                | Om IMAP-lagring for dette aliaset skal aktiveres eller deaktiveres (hvis deaktivert, vil innkommende e-poster ikke lagres til [IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en verdi sendes, konverteres den til en boolean ved bruk av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                     | Nei          | Boolean                                | Om [OpenPGP-kryptering](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) for [IMAP/POP3/CalDAV/CardDAV kryptert e-postlagring](/blog/docs/best-quantum-safe-encrypted-email-service) ved bruk av aliasets `public_key` skal aktiveres eller deaktiveres.                                                                                                         |
| `public_key`                  | Nei          | String                                 | OpenPGP offentlig nøkkel i ASCII Armor-format ([klikk her for å se et eksempel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG-nøkkel for `support@forwardemail.net`). Dette gjelder kun hvis du har `has_pgp` satt til `true`. [Lær mer om ende-til-ende-kryptering i vår FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Nei          | String                                 | Maksimal lagringskvote for dette aliaset. La stå tomt for å tilbakestille til domenets nåværende maksimale kvote eller skriv inn en verdi som "1 GB" som vil bli tolket av [bytes](https://github.com/visionmedia/bytes.js). Denne verdien kan kun justeres av domenets administratorer.                                                                                                          |
| `vacation_responder_is_enabled` | Nei          | Boolean                                | Om en automatisk feriemelding skal aktiveres eller deaktiveres.                                                                                                                                                                                                                                                                                                                             |
| `vacation_responder_start_date` | Nei          | String                                 | Startdato for feriemelding (hvis aktivert og ingen startdato er satt her, antas det at den allerede har startet). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing med `dayjs`.                                                                                                                                                              |
| `vacation_responder_end_date`   | Nei          | String                                 | Sluttdato for feriemelding (hvis aktivert og ingen sluttdato er satt her, antas det at den aldri slutter og svarer for alltid). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing med `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | Nei          | String                                 | Emne i ren tekst for feriemeldingen, f.eks. "Out of Office". Vi bruker `striptags` for å fjerne all HTML her.                                                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | Nei          | String                                 | Melding i ren tekst for feriemeldingen, f.eks. "I will be out of office until February.". Vi bruker `striptags` for å fjerne all HTML her.                                                                                                                                                                                                                                               |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hent domenenavn alias {#retrieve-domain-alias}

Du kan hente et domenenavn alias enten ved dets `id` eller dets `name` verdi.

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

### Oppdater domenenavn alias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Påkrevd | Type                                   | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nei       | String                                 | Alias navn                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Nei       | String eller Array                     | Liste over mottakere (må være linjeskift/space/komma separert String eller Array av gyldige e-postadresser, fullstendig kvalifiserte domenenavn ("FQDN"), IP-adresser, og/eller webhook URL'er)                                                                                                                                                                                             |
| `description`                   | Nei       | String                                 | Alias beskrivelse                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nei       | String eller Array                     | Liste over etiketter (må være linjeskift/space/komma separert String eller Array)                                                                                                                                                                                                                                                                                                           |
| `has_recipient_verification`    | Nei       | Boolean                                | Krev at mottakere klikker en e-post verifikasjonslink for at e-poster skal flyte gjennom (standard til domenets innstilling hvis ikke eksplisitt satt i forespørselskroppen)                                                                                                                                                                                                                 |
| `is_enabled`                    | Nei       | Boolean                                | Om dette aliaset skal aktiveres eller deaktiveres (hvis deaktivert, vil e-poster ikke rutes noe sted men returnere suksessstatuskoder). Hvis en verdi sendes, konverteres den til en boolean ved bruk av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                     |
| `error_code_if_disabled`        | Nei       | Nummer (enten `250`, `421`, eller `550`) | Inngående e-post til dette aliaset vil avvises hvis `is_enabled` er `false` med enten `250` (stille levere ingen steder, f.eks. svart hull eller `/dev/null`), `421` (myk avvisning; og prøv igjen i opptil ~5 dager) eller `550` permanent feil og avvisning. Standard er `250`.                                                                                                               |
| `has_imap`                      | Nei       | Boolean                                | Om IMAP lagring skal aktiveres eller deaktiveres for dette aliaset (hvis deaktivert, vil innkommende e-poster ikke lagres til [IMAP lagring](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en verdi sendes, konverteres den til en boolean ved bruk av [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                |
| `has_pgp`                       | Nei       | Boolean                                | Om [OpenPGP kryptering](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) skal aktiveres eller deaktiveres for [IMAP/POP3/CalDAV/CardDAV kryptert e-postlagring](/blog/docs/best-quantum-safe-encrypted-email-service) ved bruk av aliasets `public_key`.                                                                                                   |
| `public_key`                    | Nei       | String                                 | OpenPGP offentlig nøkkel i ASCII Armor format ([klikk her for å se et eksempel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG nøkkel for `support@forwardemail.net`). Dette gjelder kun hvis du har `has_pgp` satt til `true`. [Lær mer om ende-til-ende kryptering i vår FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nei       | String                                 | Maksimal lagringskvote for dette aliaset. La stå tomt for å tilbakestille til domenets nåværende maksimale kvote eller skriv inn en verdi som "1 GB" som vil bli tolket av [bytes](https://github.com/visionmedia/bytes.js). Denne verdien kan kun justeres av domenets administratorer.                                                                                                      |
| `vacation_responder_is_enabled` | Nei       | Boolean                                | Om en automatisk feriemelding skal aktiveres eller deaktiveres.                                                                                                                                                                                                                                                                                                                             |
| `vacation_responder_start_date` | Nei       | String                                 | Startdato for feriemeldingen (hvis aktivert og ingen startdato satt her, antar den at den allerede er startet). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD`, og andre datoformater via smart parsing med `dayjs`.                                                                                                                                                                  |
| `vacation_responder_end_date`   | Nei       | String                                 | Sluttdato for feriemeldingen (hvis aktivert og ingen sluttdato satt her, antar den at den aldri slutter og svarer for alltid). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD`, og andre datoformater via smart parsing med `dayjs`.                                                                                                                                                    |
| `vacation_responder_subject`    | Nei       | String                                 | Emne i ren tekst for feriemeldingen, f.eks. "Out of Office". Vi bruker `striptags` for å fjerne all HTML her.                                                                                                                                                                                                                                                                                |
| `vacation_responder_message`    | Nei       | String                                 | Melding i ren tekst for feriemeldingen, f.eks. "I will be out of office until February.". Vi bruker `striptags` for å fjerne all HTML her.                                                                                                                                                                                                                                                  |
> Eksempel Forespørsel:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Slett domenenavn-alias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Eksempel Forespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Krypter {#encrypt}

Vi lar deg kryptere poster selv på gratisplanen uten kostnad. Personvern skal ikke være en funksjon, det skal være innebygd i alle aspekter av et produkt. Som sterkt etterspurt i en [Privacy Guides diskusjon](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og på [våre GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) har vi lagt til dette.

### Krypter TXT-post {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Påkrevd | Type   | Beskrivelse                                  |
| -------------- | ------- | ------ | -------------------------------------------- |
| `input`        | Ja      | String | Enhver gyldig Forward Email ren tekst TXT-post |

> Eksempel Forespørsel:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
