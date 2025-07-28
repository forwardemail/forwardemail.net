# E-post-API {#email-api}

## Innholdsfortegnelse {#table-of-contents}

* [Biblioteker](#libraries)
* [Basis-URI](#base-uri)
* [Autentisering](#authentication)
* [Feil](#errors)
* [Lokalisering](#localization)
* [Paginering](#pagination)
* [Logger](#logs)
  * [Hent logger](#retrieve-logs)
* [Konto](#account)
  * [Opprett konto](#create-account)
  * [Hent konto](#retrieve-account)
  * [Oppdater konto](#update-account)
* [Aliaskontakter (CardDAV)](#alias-contacts-carddav)
  * [Liste over kontakter](#list-contacts)
  * [Opprett kontakt](#create-contact)
  * [Hent kontakt](#retrieve-contact)
  * [Oppdater kontakt](#update-contact)
  * [Slett kontakt](#delete-contact)
* [Aliaskalendere (CalDAV)](#alias-calendars-caldav)
  * [Liste over kalendere](#list-calendars)
  * [Opprett kalender](#create-calendar)
  * [Hent kalender](#retrieve-calendar)
  * [Oppdater kalenderen](#update-calendar)
  * [Slett kalenderen](#delete-calendar)
* [Aliasmeldinger (IMAP/POP3)](#alias-messages-imappop3)
  * [Liste over og søk etter meldinger](#list-and-search-for-messages)
  * [Opprett melding](#create-message)
  * [Hent melding](#retrieve-message)
  * [Oppdater melding](#update-message)
  * [Slett melding](#delete-message)
* [Aliasmapper (IMAP/POP3)](#alias-folders-imappop3)
  * [Liste over mapper](#list-folders)
  * [Opprett mappe](#create-folder)
  * [Hent mappe](#retrieve-folder)
  * [Oppdater mappen](#update-folder)
  * [Slett mappe](#delete-folder)
  * [Kopier mappe](#copy-folder)
* [Utgående e-poster](#outbound-emails)
  * [Få grense for utgående SMTP-e-post](#get-outbound-smtp-email-limit)
  * [Liste over utgående SMTP-e-poster](#list-outbound-smtp-emails)
  * [Opprett utgående SMTP-e-post](#create-outbound-smtp-email)
  * [Hent utgående SMTP-e-post](#retrieve-outbound-smtp-email)
  * [Slett utgående SMTP-e-post](#delete-outbound-smtp-email)
* [Domener](#domains)
  * [Liste over domener](#list-domains)
  * [Opprett domene](#create-domain)
  * [Hent domene](#retrieve-domain)
  * [Bekreft domeneoppføringer](#verify-domain-records)
  * [Bekreft SMTP-oppføringer for domenet](#verify-domain-smtp-records)
  * [List opp domeneomfattende samlepassord](#list-domain-wide-catch-all-passwords)
  * [Opprett et felles passord for hele domenet](#create-domain-wide-catch-all-password)
  * [Fjern det generelle passordet for hele domenet](#remove-domain-wide-catch-all-password)
  * [Oppdater domene](#update-domain)
  * [Slett domene](#delete-domain)
* [Invitasjoner](#invites)
  * [Godta domeneinvitasjon](#accept-domain-invite)
  * [Opprett domeneinvitasjon](#create-domain-invite)
  * [Fjern domeneinvitasjon](#remove-domain-invite)
* [Medlemmer](#members)
  * [Oppdater domenemedlem](#update-domain-member)
  * [Fjern domenemedlem](#remove-domain-member)
* [Aliaser](#aliases)
  * [Generer et aliaspassord](#generate-an-alias-password)
  * [Liste over domenealiaser](#list-domain-aliases)
  * [Opprett nytt domenealias](#create-new-domain-alias)
  * [Hent domenealias](#retrieve-domain-alias)
  * [Oppdater domenealias](#update-domain-alias)
  * [Slett domenealias](#delete-domain-alias)
* [Krypter](#encrypt)
  * [Krypter TXT-oppføring](#encrypt-txt-record)

## Biblioteker {#libraries}

Akkurat nå har vi ikke gitt ut noen API-wrappere, men vi planlegger å gjøre det i nær fremtid. Send en e-post til <api@forwardemail.net> hvis du ønsker å bli varslet når et bestemt programmeringsspråks API-wrapper blir utgitt. I mellomtiden kan du bruke disse anbefalte HTTP-forespørselsbibliotekene i applikasjonen din, eller ganske enkelt bruke [krøll](https://stackoverflow.com/a/27442239/3586413) som i eksemplene nedenfor.

| Språk | Bibliotek |
| ---------- | ---------------------------------------------------------------------- |
| Rubin | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (vi er vedlikeholdere) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (vi er vedlikeholdere) |
| Gå | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Basis-URI {#base-uri}

Den nåværende HTTP-basis-URI-banen er: `BASE_URI`.

## Autentisering {#authentication}

Alle endepunkter krever at [API-nøkkel](https://forwardemail.net/my-account/security) angis som "brukernavn"-verdien i forespørselens [Grunnleggende autorisasjon](https://en.wikipedia.org/wiki/Basic_access_authentication)-header (med unntak av [Aliaskontakter](#alias-contacts), [Aliaskalendere](#alias-calendars) og [Alias-postkasser](#alias-mailboxes) som bruker en [generert alias brukernavn og passord](/faq#do-you-support-receiving-email-with-imap)).

Ikke bekymre deg – eksempler er gitt nedenfor hvis du ikke er sikker på hva dette er.

## Feil {#errors}

Hvis det oppstår feil, vil svarinnholdet i API-forespørselen inneholde en detaljert feilmelding.

| Kode | Navn |
| ---- | --------------------- |
| 200 | OK |
| 400 | Ugyldig forespørsel |
| 401 | Uautorisert |
| 403 | Forbudt |
| 404 | Ikke funnet |
| 429 | For mange forespørsler |
| 500 | Intern serverfeil |
| 501 | Ikke implementert |
| 502 | Dårlig gateway |
| 503 | Tjenesten er ikke tilgjengelig |
| 504 | Gateway-tidsavbrudd |

> \[!TIP]
> Hvis du mottar en 5xx-statuskode (noe som ikke skal skje), kan du kontakte oss på <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>, så hjelper vi deg med å løse problemet umiddelbart.

## Lokalisering {#localization}

Tjenesten vår er oversatt til over 25 forskjellige språk. Alle API-svarmeldinger oversettes til den siste språkinnstillingen som ble oppdaget for brukeren som sendte API-forespørselen. Du kan overstyre dette ved å sende en tilpasset `Accept-Language`-header. Prøv det gjerne ut ved hjelp av rullegardinmenyen for språk nederst på denne siden.

## Paginering {#pagination}

> \[!NOTE]
> Fra 1. november 2024 vil API-endepunktene for [Liste over domener](#list-domains) og [Liste over domenealiaser](#list-domain-aliases) som standard ha maks. `1000` resultater per side. Hvis du ønsker å velge denne oppførselen tidlig, kan du sende `?paginate=true` som en ekstra spørrestrengparameter til URL-en for endepunktspørringen.

Paginering støttes av alle API-endepunkter som viser resultater.

Bare oppgi spørrestrengegenskapene `page` (og eventuelt `limit`).

Egenskapen `page` skal være et tall større enn eller lik `1`. Hvis du oppgir `limit` (også et tall), er minimumsverdien `10` og maksimumsverdien `50` (med mindre annet er angitt).

| Spørrestrengparametere | Obligatorisk | Type | Beskrivelse |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Ingen | Tall | Resultatsiden som skal returneres. Hvis ikke spesifisert, vil `page`-verdien være `1`. Må være et tall større enn eller lik `1`. |
| `limit` | Ingen | Tall | Antall resultater som skal returneres per side. Standardverdien er `10` hvis ikke spesifisert. Må være et tall større enn eller lik `1`, og mindre enn eller lik `50`. |

For å avgjøre om det finnes flere resultater, tilbyr vi disse HTTP-svarhodene (som du kan analysere for å paginere programmatisk):

| HTTP-svarhode | Eksempel | Beskrivelse |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Det totale tilgjengelige sideantallet. |
| `X-Page-Current` | `X-Page-Current: 1` | Den gjeldende resultatsiden som returneres (f.eks. basert på `page` spørrestrengparameteren). |
| `X-Page-Size` | `X-Page-Size: 10` | Det totale antallet resultater på siden som ble returnert (f.eks. basert på `limit` spørrestrengparameteren og faktiske resultater som ble returnert). |
| `X-Item-Count` | `X-Item-Count: 30` | Det totale antallet elementer som er tilgjengelige på tvers av alle sider. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Vi tilbyr en `Link` HTTP-svarheader som du kan analysere som vist i eksemplet. Dette er [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (f.eks. vil ikke alle verdier bli oppgitt hvis de ikke er relevante eller tilgjengelige, f.eks. vil ikke `"next"` bli oppgitt hvis det ikke finnes en annen side). |

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Logger {#logs}

### Hent logger {#retrieve-logs}

API-et vårt lar deg programmatisk laste ned logger for kontoen din. Hvis du sender en forespørsel til dette endepunktet, behandles alle loggene for kontoen din, og de sendes til deg som et vedlegg ([Gzip](https://en.wikipedia.org/wiki/Gzip) komprimert [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) regnearkfil) når det er fullført.

Dette lar deg opprette bakgrunnsjobber med en [Cron-jobb](https://en.wikipedia.org/wiki/Cron) eller bruke vår [Node.js jobbplanleggingsprogramvare Bree](https://github.com/breejs/bree) til å motta logger når du ønsker det. Merk at dette endepunktet er begrenset til `10` forespørsler per dag.

Vedlegget er en liten form av `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`, og selve e-posten inneholder et kort sammendrag av loggene som er hentet. Du kan også laste ned logger når som helst fra [Min konto → Logger](/my-account/logs).

> `GET /v1/logs/download`

| Spørrestrengparametere | Obligatorisk | Type | Beskrivelse |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ingen | Streng (FQDN) | Filtrer logger etter fullt kvalifisert domene («FQDN»). Hvis du ikke oppgir dette, hentes alle logger på tvers av alle domener. |
| `q` | Ingen | Streng | Søk etter logger etter e-post, domene, aliasnavn, IP-adresse eller dato (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` eller `M.D.YY`). |
| `bounce_category` | Ingen | Streng | Søk etter logger etter en bestemt avvisningskategori (f.eks. `blocklist`). |
| `response_code` | Ingen | Tall | Søk etter logger etter en spesifikk feilresponskode (f.eks. `421` eller `550`). |

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Eksempel på Cron-jobb (ved midnatt hver dag):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Merk at du kan bruke tjenester som [Crontab.guru](https://crontab.guru/) for å validere syntaksen for cron-jobbens uttrykk.

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

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ja | Streng (e-post) | E-postadresse |
| `password` | Ja | Streng | Passord |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hent konto {#retrieve-account}

> `GET /v1/account`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Oppdater konto {#update-account}

> `PUT /v1/account`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Ingen | Streng (e-post) | E-postadresse |
| `given_name` | Ingen | Streng | Fornavn |
| `family_name` | Ingen | Streng | Etternavn |
| `avatar_url` | Ingen | Streng (URL) | Lenke til avatarbilde |

> Eksempelforespørsel:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Aliaskontakter (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> I motsetning til andre API-endepunkter krever disse [Autentisering](#authentication) "brukernavn" lik aliasbrukernavnet og "passord" lik det aliasgenererte passordet som grunnleggende autorisasjonsoverskrifter.

> \[!WARNING]
> Denne endepunktdelen er under utvikling og vil bli utgitt (forhåpentligvis) i 2024. I mellomtiden kan du bruke en IMAP-klient fra rullegardinmenyen «Apper» i navigasjonen på nettstedet vårt.

### Liste over kontakter {#list-contacts}

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

## Aliaskalendere (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> I motsetning til andre API-endepunkter krever disse [Autentisering](#authentication) "brukernavn" lik aliasbrukernavnet og "passord" lik det aliasgenererte passordet som grunnleggende autorisasjonsoverskrifter.

> \[!WARNING]
> Denne endepunktdelen er under utvikling og vil bli utgitt (forhåpentligvis) i 2024. I mellomtiden kan du bruke en IMAP-klient fra rullegardinmenyen «Apper» i navigasjonen på nettstedet vårt.

### Liste over kalendere {#list-calendars}

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

## Aliasmeldinger (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> I motsetning til andre API-endepunkter krever disse [Autentisering](#authentication) "brukernavn" lik aliasbrukernavnet og "passord" lik det aliasgenererte passordet som grunnleggende autorisasjonsoverskrifter.

> \[!WARNING]
> Denne endepunktdelen er under utvikling og vil bli utgitt (forhåpentligvis) i 2024. I mellomtiden kan du bruke en IMAP-klient fra rullegardinmenyen «Apper» i navigasjonen på nettstedet vårt.

Sørg for at du har fulgt konfigurasjonsinstruksjonene for domenet ditt.

Disse instruksjonene finner du i FAQ-seksjonen vår [Støtter dere mottak av e-post med IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Vis og søk etter meldinger {#list-and-search-for-messages}

> `GET /v1/messages`

**Kommer snart**

### Opprett melding {#create-message}

> \[!NOTE]
> Dette vil **IKKE** sende en e-post – det vil bare legge til meldingen i postkassemappen din (f.eks. ligner dette på IMAP `APPEND`-kommandoen). Hvis du vil sende en e-post, se [Opprett utgående SMTP-e-post](#create-outbound-smtp-email) nedenfor. Etter at du har opprettet den utgående SMTP-e-posten, kan du legge til en kopi av den ved hjelp av dette endepunktet i aliaspostkassen din for lagringsformål.

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

## Aliasmapper (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Mappesluttpunkter med en mappesti <code>/v1/folders/:path</code> som endepunkt kan brukes om igjen med en mappe-ID <code>:id</code>. Dette betyr at du kan referere til mappen enten med dens <code>path</code>- eller <code>id</code>-verdi.

> \[!WARNING]
> Denne endepunktdelen er under utvikling og vil bli utgitt (forhåpentligvis) i 2024. I mellomtiden kan du bruke en IMAP-klient fra rullegardinmenyen «Apper» i navigasjonen på nettstedet vårt.

### Liste over mapper {#list-folders}

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

### Slett mappen {#delete-folder}

> `DELETE /v1/folders/:id`

**Kommer snart**

### Kopier mappe {#copy-folder}

> `POST /v1/folders/:id/copy`

**Kommer snart**

## Utgående e-poster {#outbound-emails}

Sørg for at du har fulgt konfigurasjonsinstruksjonene for domenet ditt.

Disse instruksjonene finner du på [Min konto → Domener → Innstillinger → Utgående SMTP-konfigurasjon](/my-account/domains). Du må sørge for at DKIM, Return-Path og DMARC er satt opp for å sende utgående SMTP med domenet ditt.

### Hent grense for utgående SMTP-e-post {#get-outbound-smtp-email-limit}

Dette er et enkelt endepunkt som returnerer et JSON-objekt som inneholder `count` og `limit` for antall daglige utgående SMTP-meldinger per konto.

> `GET /v1/emails/limit`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Vis utgående SMTP-e-poster {#list-outbound-smtp-emails}

Merk at dette endepunktet ikke returnerer egenskapsverdier for `message`, `headers` eller `rejectedErrors` i en e-post.

For å returnere disse egenskapene og verdiene deres, bruk [Hent e-post](#retrieve-email)-endepunktet med en e-post-ID.

> `GET /v1/emails`

| Spørrestrengparametere | Obligatorisk | Type | Beskrivelse |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ingen | Streng (RegExp støttes) | Søk etter e-poster etter metadata |
| `domain` | Ingen | Streng (RegExp støttes) | Søk etter e-poster etter domenenavn |
| `sort` | Ingen | Streng | Sorter etter et bestemt felt (bruk prefikset `-` for å sortere i motsatt retning av feltet). Standardverdien er `created_at` hvis ikke angitt. |
| `page` | Ingen | Tall | Se [Pagination](#pagination) for mer innsikt |
| `limit` | Ingen | Tall | Se [Pagination](#pagination) for mer innsikt |

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Opprett utgående SMTP-e-post {#create-outbound-smtp-email}

Vårt API for å opprette e-poster er inspirert av og utnytter Nodemailers konfigurasjon av meldingsalternativer. Vennligst referer til [Konfigurasjon av Nodemailer-meldinger](https://nodemailer.com/message/) for alle brødtekstparametere nedenfor.

Merk at med unntak av `envelope` og `dkim` (siden vi angir disse automatisk for deg), støtter vi alle Nodemailer-alternativer. Vi angir automatisk `disableFileAccess`- og `disableUrlAccess`-alternativene til `true` av sikkerhetshensyn.

Du bør enten sende det enkle alternativet `raw` med den fullstendige e-posten din, inkludert overskrifter, **eller** sende individuelle alternativer for brødtekstparametere nedenfor.

Dette API-endepunktet vil automatisk kode emojier for deg hvis de finnes i overskriftene (f.eks. blir emnelinjen `Subject: 🤓 Hello` automatisk konvertert til `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Målet vårt var å lage et ekstremt utviklervennlig og dummy-sikkert e-post-API.

> `POST /v1/emails`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Ingen | Streng (e-post) | Avsenderens e-postadresse (må finnes som et alias for domenet). |
| `to` | Ingen | Streng eller matrise | Kommaseparert liste eller en matrise med mottakere for «Til»-overskriften. |
| `cc` | Ingen | Streng eller matrise | Kommaseparert liste eller en matrise med mottakere for «Cc»-overskriften. |
| `bcc` | Ingen | Streng eller matrise | Kommaseparert liste eller en matrise med mottakere for «Bcc»-overskriften. |
| `subject` | Ingen | Streng | Emnet for e-posten. |
| `text` | Ingen | Streng eller buffer | Klartekstversjonen av meldingen. |
| `html` | Ingen | Streng eller buffer | HTML-versjonen av meldingen. |
| `attachments` | Ingen | Matrise | En matrise med vedleggsobjekter (se [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Ingen | Streng | E-postadressen for «Avsender»-overskriften (se [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Ingen | Streng | E-postadressen for «Svar til»-overskriften. |
| `inReplyTo` | Ingen | Streng | Meldings-ID-en meldingen svarer på. |
| `references` | Ingen | Streng eller matrise | Mellomromsseparert liste eller en matrise med meldings-ID-er. |
| `attachDataUrls` | Ingen | Boolsk | Hvis `true`, konverteres `data:` bilder i HTML-innholdet i meldingen til innebygde vedlegg. |
| `watchHtml` | Ingen | Streng | En Apple Watch-spesifikk HTML-versjon av meldingen ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), de nyeste klokkene krever ikke at dette angis). |
| `amp` | Ingen | Streng | En AMP4EMAIL-spesifikk HTML-versjon av meldingen (se [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Ingen | Gjenstand | En iCalendar-hendelse som skal brukes som alternativt meldingsinnhold (se [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Ingen | Matrise | En matrise med alternativt meldingsinnhold (se [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Ingen | Streng | Koding for tekst og HTML-strenger (standard er `"utf-8"`, men støtter også kodingsverdiene `"hex"` og `"base64"`). |
| `raw` | Ingen | Streng eller buffer | En egendefinert generert RFC822-formatert melding som skal brukes (i stedet for en som genereres av Nodemailer – se [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Ingen | Streng | Koding som er tvunget til å brukes for tekstverdier (enten `"quoted-printable"` eller `"base64"`). Standardverdien er den nærmeste verdien som oppdages (for ASCII, bruk `"quoted-printable"`). |
| `priority` | Ingen | Streng | Prioritetsnivå for e-posten (kan enten være `"high"`, `"normal"` (standard) eller `"low"`). Merk at verdien `"normal"` ikke angir en prioritetsoverskrift (dette er standardvirkemåten). Hvis verdien `"high"` eller `"low"` er angitt, vil overskriftene `X-Priority`, `X-MSMail-Priority` og `Importance` være [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Ingen | Objekt eller matrise | Et objekt eller en matrise med ekstra headerfelt som skal angis (se [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Ingen | Streng | En valgfri Message-ID-verdi for «Message-ID»-overskriften (en standardverdi opprettes automatisk hvis den ikke er angitt – merk at verdien skal være [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Ingen | Streng eller dato | En valgfri datoverdi som brukes hvis datooverskriften mangler etter parsing. Ellers brukes gjeldende UTC-streng hvis den ikke er angitt. Datooverskriften kan ikke være mer enn 30 dager før gjeldende klokkeslett. |
| `list` | Ingen | Gjenstand | Et valgfritt objekt med `List-*`-overskrifter (se [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Hent utgående SMTP-e-post {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Slett utgående SMTP-e-post {#delete-outbound-smtp-email}

Sletting av e-post vil sette statusen til `"rejected"` (og deretter ikke behandle den i køen) hvis og bare hvis gjeldende status er en av `"pending"`, `"queued"` eller `"deferred"`. Vi kan slette e-poster automatisk 30 dager etter at de ble opprettet og/eller sendt – derfor bør du beholde en kopi av utgående SMTP-e-poster i klienten, databasen eller applikasjonen din. Du kan referere til e-post-ID-verdien vår i databasen din hvis ønskelig – denne verdien returneres fra både [Opprett e-post](#create-email)- og [Hent e-post](#retrieve-email)-endepunktene.

> `DELETE /v1/emails/:id`

> Eksempelforespørsel:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domener {#domains}

> \[!TIP]
> Domeneendepunkter med domenenavnet <code>/v1/domains/:domain_name</code> som endepunkt kan brukes om igjen med domene-ID-en <code>:domain_id</code>. Dette betyr at du kan referere til domenet enten med <code>name</code>- eller <code>id</code>-verdien.

### Liste over domener {#list-domains}

> \[!NOTE]
> Fra 1. november 2024 vil API-endepunktene for [Liste over domener](#list-domains) og [Liste over domenealiaser](#list-domain-aliases) som standard ha maks. `1000` resultater per side. Hvis du ønsker å velge denne oppførselen tidlig, kan du sende `?paginate=true` som en ekstra spørrestrengparameter til URL-en for endepunktspørringen. Se [Paginering](#pagination) for mer innsikt.

> `GET /v1/domains`

| Spørrestrengparametere | Obligatorisk | Type | Beskrivelse |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ingen | Streng (RegExp støttes) | Søk etter domener etter navn |
| `name` | Ingen | Streng (RegExp støttes) | Søk etter domener etter navn |
| `sort` | Ingen | Streng | Sorter etter et bestemt felt (bruk prefikset `-` for å sortere i motsatt retning av feltet). Standardverdien er `created_at` hvis ikke angitt. |
| `page` | Ingen | Tall | Se [Pagination](#pagination) for mer innsikt |
| `limit` | Ingen | Tall | Se [Pagination](#pagination) for mer innsikt |

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Opprett domene {#create-domain}

> `POST /v1/domains`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ja | Streng (FQDN eller IP) | Fullt kvalifisert domenenavn ("FQDN") eller IP-adresse |
| `team_domain` | Ingen | Streng (domene-ID eller domenenavn; FQDN) | Tildel dette domenet automatisk til samme team fra et annet domene. Dette betyr at alle medlemmer fra dette domenet blir tilordnet som teammedlemmer, og `plan` blir automatisk også satt til `team`. Du kan sette dette til `"none"` om nødvendig for å eksplisitt deaktivere dette, men det er ikke nødvendig. |
| `plan` | Ingen | Streng (opptellbar) | Plantype (må være `"free"`, `"enhanced_protection"` eller `"team"`, standardverdien er `"free"` eller brukerens nåværende betalte plan hvis vedkommende har en slik) |
| `catchall` | Ingen | Streng (avgrensede e-postadresser) eller boolsk | Opprett et standard catch-all-alias, standardinnstillingen er `true` (hvis `true` vil det bruke API-brukerens e-postadresse som mottaker, og hvis `false` vil ingen catch-all opprettes). Hvis en streng sendes, er det en avgrenset liste over e-postadresser som skal brukes som mottakere (atskilt med linjeskift, mellomrom og/eller komma). |
| `has_adult_content_protection` | Ingen | Boolsk | Om Spam Scanner skal aktivere beskyttelse mot voksent innhold på dette domenet |
| `has_phishing_protection` | Ingen | Boolsk | Om Spam Scanner skal aktivere phishing-beskyttelse på dette domenet |
| `has_executable_protection` | Ingen | Boolsk | Om beskyttelse mot kjørbar Spam Scanner skal aktiveres på dette domenet |
| `has_virus_protection` | Ingen | Boolsk | Om virusbeskyttelse fra Spam Scanner skal aktiveres på dette domenet |
| `has_recipient_verification` | Ingen | Boolsk | Globalt domenestandard for om aliasmottakere skal kreves for at de klikker på en e-postbekreftelseslenke for at e-poster skal sendes gjennom |
| `ignore_mx_check` | Ingen | Boolsk | Om MX-postkontrollen på domenet for bekreftelse skal ignoreres. Dette er hovedsakelig for brukere som har avanserte MX-utvekslingskonfigurasjonsregler og trenger å beholde sin eksisterende MX-utveksling og videresende den til vår. |
| `retention_days` | Ingen | Tall | Heltall mellom `0` og `30` som tilsvarer antall oppbevaringsdager for å lagre utgående SMTP-e-poster når de er levert eller har fått permanent feil. Standardinnstillingen er `0`, som betyr at utgående SMTP-e-poster slettes og redigeres umiddelbart av sikkerhetshensyn. |
| `bounce_webhook` | Ingen | Streng (URL) eller boolsk (usann) | Webhooken-URL-en `http://` eller `https://` du velger for å sende avviste webhooks til. Vi sender en `POST`-forespørsel til denne URL-en med informasjon om utgående SMTP-feil (f.eks. myke eller harde feil – slik at du kan administrere abonnentene dine og programmatisk administrere utgående e-post). |
| `max_quota_per_alias` | Ingen | Streng | Maksimal lagringskvote for aliaser på dette domenenavnet. Skriv inn en verdi som «1 GB» som skal analyseres av [bytes](https://github.com/visionmedia/bytes.js). |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hent domene {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Bekreft domeneoppføringer {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Bekreft domenets SMTP-oppføringer {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### List opp domeneomfattende samlepassord {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Opprett et domeneomfattende catch-all-passord {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ingen | Streng | Ditt egendefinerte nye passord som skal brukes som det domeneomfattende samlepassordet. Merk at du kan la dette feltet stå tomt eller utelates helt fra API-forespørselsteksten din hvis du ønsker et tilfeldig generert og sterkt passord. |
| `description` | Ingen | Streng | Beskrivelse kun for organisasjonsformål. |

> Eksempelforespørsel:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Fjern domeneomfattende catch-all-passord {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Eksempelforespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Oppdater domenet {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Ingen | Streng eller tall | Tilpasset port for å konfigurere for SMTP-videresending (standard er `"25"`) |
| `has_adult_content_protection` | Ingen | Boolsk | Om Spam Scanner skal aktivere beskyttelse mot voksent innhold på dette domenet |
| `has_phishing_protection` | Ingen | Boolsk | Om Spam Scanner skal aktivere phishing-beskyttelse på dette domenet |
| `has_executable_protection` | Ingen | Boolsk | Om beskyttelse mot kjørbar Spam Scanner skal aktiveres på dette domenet |
| `has_virus_protection` | Ingen | Boolsk | Om virusbeskyttelse fra Spam Scanner skal aktiveres på dette domenet |
| `has_recipient_verification` | Ingen | Boolsk | Globalt domenestandard for om aliasmottakere skal kreves for at de klikker på en e-postbekreftelseslenke for at e-poster skal sendes gjennom |
| `ignore_mx_check` | Ingen | Boolsk | Om MX-postkontrollen på domenet for bekreftelse skal ignoreres. Dette er hovedsakelig for brukere som har avanserte MX-utvekslingskonfigurasjonsregler og trenger å beholde sin eksisterende MX-utveksling og videresende den til vår. |
| `retention_days` | Ingen | Tall | Heltall mellom `0` og `30` som tilsvarer antall oppbevaringsdager for å lagre utgående SMTP-e-poster når de er levert eller har fått permanent feil. Standardinnstillingen er `0`, som betyr at utgående SMTP-e-poster slettes og redigeres umiddelbart av sikkerhetshensyn. |
| `bounce_webhook` | Ingen | Streng (URL) eller boolsk (usann) | Webhooken-URL-en `http://` eller `https://` du velger for å sende avviste webhooks til. Vi sender en `POST`-forespørsel til denne URL-en med informasjon om utgående SMTP-feil (f.eks. myke eller harde feil – slik at du kan administrere abonnentene dine og programmatisk administrere utgående e-post). |
| `max_quota_per_alias` | Ingen | Streng | Maksimal lagringskvote for aliaser på dette domenenavnet. Skriv inn en verdi som «1 GB» som skal analyseres av [bytes](https://github.com/visionmedia/bytes.js). |

> Eksempelforespørsel:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Slett domenet {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Eksempelforespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Invitasjoner {#invites}

### Godta domeneinvitasjon {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Opprett domeneinvitasjon {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ja | Streng (e-post) | E-postadresse som skal inviteres til domenemedlemslisten |
| `group` | Ja | Streng (opptellbar) | Gruppe for å legge brukeren til domenemedlemskapet med (kan være en av `"admin"` eller `"user"`) |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Hvis brukeren som inviteres allerede er et akseptert medlem av andre domener som administratoren som inviterer dem er medlem av, vil invitasjonen automatisk godtas og det sendes ikke en e-post.

### Fjern domeneinvitasjon {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ja | Streng (e-post) | E-postadresse som skal fjernes fra listen over domenemedlemmer |

> Eksempelforespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Medlemmer {#members}

### Oppdater domenemedlem {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ja | Streng (opptellbar) | Gruppe for å oppdatere brukeren til domenemedlemskapet med (kan være en av `"admin"` eller `"user"`) |

> Eksempelforespørsel:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Fjern domenemedlem {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Eksempelforespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliaser {#aliases}

### Generer et aliaspassord {#generate-an-alias-password}

Merk at hvis du ikke sender instruksjoner via e-post, vil brukernavnet og passordet være i JSON-svarinnholdet i en vellykket forespørsel i formatet `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ingen | Streng | Ditt egendefinerte nye passord som skal brukes for aliaset. Merk at du kan la dette feltet stå tomt eller utelate det helt fra API-forespørselsteksten din hvis du ønsker et tilfeldig generert og sterkt passord. |
| `password` | Ingen | Streng | Eksisterende passord for alias for å endre passordet uten å slette den eksisterende IMAP-postbokslagringen (se alternativet `is_override` nedenfor hvis du ikke lenger har det eksisterende passordet). |
| `is_override` | Ingen | Boolsk | **BRUK MED FORSIKTIGHET**: Dette vil overstyre det eksisterende aliaspassordet og databasen fullstendig, og vil permanent slette den eksisterende IMAP-lagringen og tilbakestille aliasets SQLite-e-postdatabase fullstendig. Ta en sikkerhetskopi hvis mulig hvis du har en eksisterende postboks knyttet til dette aliaset. |
| `emailed_instructions` | Ingen | Streng | E-postadressen du skal sende aliaset sitt passord og konfigurasjonsinstruksjoner til. |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Liste over domenealiaser {#list-domain-aliases}

> \[!NOTE]
> Fra 1. november 2024 vil API-endepunktene for [Liste over domener](#list-domains) og [Liste over domenealiaser](#list-domain-aliases) som standard ha maks. `1000` resultater per side. Hvis du ønsker å velge denne oppførselen tidlig, kan du sende `?paginate=true` som en ekstra spørrestrengparameter til URL-en for endepunktspørringen. Se [Paginering](#pagination) for mer innsikt.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Spørrestrengparametere | Obligatorisk | Type | Beskrivelse |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ingen | Streng (RegExp støttes) | Søk etter aliaser i et domene etter navn, etikett eller mottaker |
| `name` | Ingen | Streng (RegExp støttes) | Søk etter aliaser i et domene etter navn |
| `recipient` | Ingen | Streng (RegExp støttes) | Søk etter aliaser i et domene etter mottaker |
| `sort` | Ingen | Streng | Sorter etter et bestemt felt (bruk prefikset `-` for å sortere i motsatt retning av feltet). Standardverdien er `created_at` hvis ikke angitt. |
| `page` | Ingen | Tall | Se [Pagination](#pagination) for mer innsikt |
| `limit` | Ingen | Tall | Se [Pagination](#pagination) for mer innsikt |

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Opprett nytt domenealias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Ingen | Streng | Aliasnavn (hvis ikke oppgitt eller tomt, genereres et tilfeldig alias) |
| `recipients` | Ingen | Streng eller matrise | Liste over mottakere (må være linjeskift-/mellomrom-/kommaseparert. En streng eller matrise med gyldige e-postadresser, fullt kvalifiserte domenenavn ("FQDN"), IP-adresser og/eller webhook-URL-er – og hvis den ikke er oppgitt eller er en tom matrise, vil brukerens e-postadresse som foretar API-forespørselen bli angitt som mottaker) |
| `description` | Ingen | Streng | Aliasbeskrivelse |
| `labels` | Ingen | Streng eller matrise | Liste over etiketter (må være linjeskift-/mellomrom-/kommaseparert. Streng eller matrise) |
| `has_recipient_verification` | Ingen | Boolsk | Krev at mottakerne klikker på en e-postbekreftelseslenke for at e-poster skal flyte gjennom (standardinnstillingen er domenets innstilling hvis den ikke er eksplisitt angitt i forespørselsteksten) |
| `is_enabled` | Ingen | Boolsk | Om dette aliaset skal aktiveres eller deaktiveres (hvis deaktivert, vil e-poster ikke bli rutet noe sted, men returnere vellykkede statuskoder). Hvis en verdi sendes, konverteres den til en boolsk verdi ved hjelp av [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Ingen | Nummer (enten `250`, `421` eller `550`) | Innkommende e-post til dette aliaset vil bli avvist hvis `is_enabled` er `false` med enten `250` (leveres stille ingen steder, f.eks. svart hull eller `/dev/null`), `421` (myk avvisning; og prøv på nytt i opptil ~5 dager) eller `550` permanent feil og avvisning. Standardinnstillingen er `250`. |
| `has_imap` | Ingen | Boolsk | Om IMAP-lagring skal aktiveres eller deaktiveres for dette aliaset (hvis deaktivert, lagres ikke innkommende e-poster i [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en verdi sendes, konverteres den til en boolsk verdi ved hjelp av [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Ingen | Boolsk | Om [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) skal aktiveres eller deaktiveres for [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) ved bruk av aliaset `public_key`. |
| `public_key` | Ingen | Streng | OpenPGP offentlig nøkkel i ASCII Armor-format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG-nøkkel for `support@forwardemail.net`). Dette gjelder bare hvis du har `has_pgp` satt til `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Ingen | Streng | Maksimal lagringskvote for dette aliaset. La stå tomt for å tilbakestille til domenets nåværende maksimale kvote, eller skriv inn en verdi som «1 GB» som skal analyseres av [bytes](https://github.com/visionmedia/bytes.js). Denne verdien kan bare justeres av domeneadministratorer. |
| `vacation_responder_is_enabled` | Ingen | Boolsk | Om du skal aktivere eller deaktivere en automatisk feriesvar. |
| `vacation_responder_start_date` | Ingen | Streng | Startdato for feriesvar (hvis aktivert og ingen startdato er angitt her, antas det at den allerede er startet). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved bruk av `dayjs`. |
| `vacation_responder_end_date` | Ingen | Streng | Sluttdato for feriesvar (hvis aktivert og ingen sluttdato angitt her, antas det at det aldri slutter og svarer for alltid). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved bruk av `dayjs`. |
| `vacation_responder_subject` | Ingen | Streng | Emne i klartekst for feriesvaret, f.eks. «Fraværende». Vi bruker `striptags` for å fjerne all HTML her. |
| `vacation_responder_message` | Ingen | Streng | Melding i klartekst for feriesvar, f.eks. «Jeg vil være borte fra kontoret til februar.» Vi bruker `striptags` for å fjerne all HTML her. |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hent domenealias {#retrieve-domain-alias}

Du kan hente et domenealias enten ved hjelp av verdien `id` eller `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Eksempelforespørsel:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Oppdater domenealias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Ingen | Streng | Aliasnavn |
| `recipients` | Ingen | Streng eller matrise | Liste over mottakere (må være linjeskift/mellomrom/kommaseparert. Streng eller matrise med gyldige e-postadresser, fullt kvalifiserte domenenavn ("FQDN"), IP-adresser og/eller webhook-URL-er) |
| `description` | Ingen | Streng | Aliasbeskrivelse |
| `labels` | Ingen | Streng eller matrise | Liste over etiketter (må være linjeskift-/mellomrom-/kommaseparert. Streng eller matrise) |
| `has_recipient_verification` | Ingen | Boolsk | Krev at mottakerne klikker på en e-postbekreftelseslenke for at e-poster skal flyte gjennom (standardinnstillingen er domenets innstilling hvis den ikke er eksplisitt angitt i forespørselsteksten) |
| `is_enabled` | Ingen | Boolsk | Om dette aliaset skal aktiveres eller deaktiveres (hvis deaktivert, vil e-poster ikke bli rutet noe sted, men returnere vellykkede statuskoder). Hvis en verdi sendes, konverteres den til en boolsk verdi ved hjelp av [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Ingen | Nummer (enten `250`, `421` eller `550`) | Innkommende e-post til dette aliaset vil bli avvist hvis `is_enabled` er `false` med enten `250` (leveres stille ingen steder, f.eks. svart hull eller `/dev/null`), `421` (myk avvisning; og prøv på nytt i opptil ~5 dager) eller `550` permanent feil og avvisning. Standardinnstillingen er `250`. |
| `has_imap` | Ingen | Boolsk | Om IMAP-lagring skal aktiveres eller deaktiveres for dette aliaset (hvis deaktivert, lagres ikke innkommende e-poster i [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en verdi sendes, konverteres den til en boolsk verdi ved hjelp av [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Ingen | Boolsk | Om [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) skal aktiveres eller deaktiveres for [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) ved bruk av aliaset `public_key`. |
| `public_key` | Ingen | Streng | OpenPGP offentlig nøkkel i ASCII Armor-format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG-nøkkel for `support@forwardemail.net`). Dette gjelder bare hvis du har `has_pgp` satt til `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Ingen | Streng | Maksimal lagringskvote for dette aliaset. La stå tomt for å tilbakestille til domenets nåværende maksimale kvote, eller skriv inn en verdi som «1 GB» som skal analyseres av [bytes](https://github.com/visionmedia/bytes.js). Denne verdien kan bare justeres av domeneadministratorer. |
| `vacation_responder_is_enabled` | Ingen | Boolsk | Om du skal aktivere eller deaktivere en automatisk feriesvar. |
| `vacation_responder_start_date` | Ingen | Streng | Startdato for feriesvar (hvis aktivert og ingen startdato er angitt her, antas det at den allerede er startet). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved bruk av `dayjs`. |
| `vacation_responder_end_date` | Ingen | Streng | Sluttdato for feriesvar (hvis aktivert og ingen sluttdato angitt her, antas det at det aldri slutter og svarer for alltid). Vi støtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved bruk av `dayjs`. |
| `vacation_responder_subject` | Ingen | Streng | Emne i klartekst for feriesvaret, f.eks. «Fraværende». Vi bruker `striptags` for å fjerne all HTML her. |
| `vacation_responder_message` | Ingen | Streng | Melding i klartekst for feriesvar, f.eks. «Jeg vil være borte fra kontoret til februar.» Vi bruker `striptags` for å fjerne all HTML her. |

> Eksempelforespørsel:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Slett domenealias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Eksempelforespørsel:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Krypter {#encrypt}

Vi lar deg kryptere poster selv med gratisabonnementet uten kostnad. Personvern bør ikke være en funksjon, det bør være innebygd i alle aspekter av et produkt. Som sterkt etterspurt i en [Diskusjon om personvernveiledninger](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og på [våre GitHub-problemer](https://github.com/forwardemail/forwardemail.net/issues/254) har vi lagt til dette.

### Krypter TXT-oppføring {#encrypt-txt-record}

> `POST /v1/encrypt`

| Kroppsparameter | Obligatorisk | Type | Beskrivelse |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ja | Streng | Enhver gyldig TXT-post i klartekst for videresending av e-post |

> Eksempelforespørsel:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
