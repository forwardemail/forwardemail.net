# E-mail-API {#email-api}

## Indholdsfortegnelse {#table-of-contents}

* [Biblioteker](#libraries)
* [Basis-URI](#base-uri)
* [Godkendelse](#authentication)
* [Fejl](#errors)
* [Lokalisering](#localization)
* [Paginering](#pagination)
* [Logs](#logs)
  * [Hent logfiler](#retrieve-logs)
* [Konto](#account)
  * [Opret konto](#create-account)
  * [Hent konto](#retrieve-account)
  * [Opdater konto](#update-account)
* [Aliaskontakter (CardDAV)](#alias-contacts-carddav)
  * [Liste over kontakter](#list-contacts)
  * [Opret kontakt](#create-contact)
  * [Hent kontakt](#retrieve-contact)
  * [Opdater kontakt](#update-contact)
  * [Slet kontakt](#delete-contact)
* [Aliaskalendere (CalDAV)](#alias-calendars-caldav)
  * [Liste over kalendere](#list-calendars)
  * [Opret kalender](#create-calendar)
  * [Hent kalender](#retrieve-calendar)
  * [Opdater kalender](#update-calendar)
  * [Slet kalender](#delete-calendar)
* [Aliasbeskeder (IMAP/POP3)](#alias-messages-imappop3)
  * [Liste over og søg efter beskeder](#list-and-search-for-messages)
  * [Opret besked](#create-message)
  * [Hent besked](#retrieve-message)
  * [Opdater besked](#update-message)
  * [Slet besked](#delete-message)
* [Aliasmapper (IMAP/POP3)](#alias-folders-imappop3)
  * [Liste over mapper](#list-folders)
  * [Opret mappe](#create-folder)
  * [Hent mappe](#retrieve-folder)
  * [Opdater mappe](#update-folder)
  * [Slet mappe](#delete-folder)
  * [Kopiér mappe](#copy-folder)
* [Udgående e-mails](#outbound-emails)
  * [Få grænsen for udgående SMTP-e-mails](#get-outbound-smtp-email-limit)
  * [Liste over udgående SMTP-e-mails](#list-outbound-smtp-emails)
  * [Opret udgående SMTP-e-mail](#create-outbound-smtp-email)
  * [Hent udgående SMTP-e-mail](#retrieve-outbound-smtp-email)
  * [Slet udgående SMTP-e-mail](#delete-outbound-smtp-email)
* [Domæner](#domains)
  * [Liste over domæner](#list-domains)
  * [Opret domæne](#create-domain)
  * [Hent domæne](#retrieve-domain)
  * [Bekræft domæneregistreringer](#verify-domain-records)
  * [Bekræft domænets SMTP-poster](#verify-domain-smtp-records)
  * [Liste over domæneomfattende adgangskoder](#list-domain-wide-catch-all-passwords)
  * [Opret en domæneomfattende adgangskode](#create-domain-wide-catch-all-password)
  * [Fjern domæneomfattende catch-all-adgangskode](#remove-domain-wide-catch-all-password)
  * [Opdater domæne](#update-domain)
  * [Slet domæne](#delete-domain)
* [Invitationer](#invites)
  * [Accepter domæneinvitation](#accept-domain-invite)
  * [Opret domæneinvitation](#create-domain-invite)
  * [Fjern domæneinvitation](#remove-domain-invite)
* [Medlemmer](#members)
  * [Opdater domænemedlem](#update-domain-member)
  * [Fjern domænemedlem](#remove-domain-member)
* [Aliaser](#aliases)
  * [Generer en aliasadgangskode](#generate-an-alias-password)
  * [Liste over domænealiasser](#list-domain-aliases)
  * [Opret nyt domænealias](#create-new-domain-alias)
  * [Hent domænealias](#retrieve-domain-alias)
  * [Opdater domænealias](#update-domain-alias)
  * [Slet domænealias](#delete-domain-alias)
* [Krypter](#encrypt)
  * [Krypter TXT-post](#encrypt-txt-record)

## Biblioteker {#libraries}

Lige nu har vi endnu ikke udgivet nogen API-wrappere, men vi planlægger at gøre det i den nærmeste fremtid. Send en e-mail til <api@forwardemail.net>, hvis du gerne vil have besked, når et bestemt programmeringssprogs API-wrapper udgives. I mellemtiden kan du bruge disse anbefalede HTTP-anmodningsbiblioteker i din applikation eller blot bruge [krølle](https://stackoverflow.com/a/27442239/3586413) som i eksemplerne nedenfor.

| Sprog | Bibliotek |
| ---------- | ---------------------------------------------------------------------- |
| Rubin | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (vi er vedligeholdelsesmedarbejdere) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (vi er vedligeholdelsesmedarbejdere) |
| Gå | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Basis-URI {#base-uri}

Den nuværende HTTP-basis-URI-sti er: `BASE_URI`.

## Godkendelse {#authentication}

Alle slutpunkter kræver, at din [API-nøgle](https://forwardemail.net/my-account/security) angives som "brugernavn"-værdien i anmodningens [Grundlæggende autorisation](https://en.wikipedia.org/wiki/Basic_access_authentication) header (med undtagelse af [Aliaskontakter](#alias-contacts), [Aliaskalendere](#alias-calendars) og [Alias-postkasser](#alias-mailboxes), som bruger en [genereret alias brugernavn og adgangskode](/faq#do-you-support-receiving-email-with-imap)).

Bare rolig – der er eksempler nedenfor, hvis du ikke er sikker på, hvad det er.

## Fejl {#errors}

Hvis der opstår fejl, vil API-anmodningens svartekst indeholde en detaljeret fejlmeddelelse.

| Kode | Navn |
| ---- | --------------------- |
| 200 | OK |
| 400 | Dårlig anmodning |
| 401 | Uberettiget |
| 403 | Forbudt |
| 404 | Ikke fundet |
| 429 | For mange anmodninger |
| 500 | Intern serverfejl |
| 501 | Ikke implementeret |
| 502 | Dårlig gateway |
| 503 | Tjenesten er ikke tilgængelig |
| 504 | Gateway timeout |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## Lokalisering {#localization}

Vores tjeneste er oversat til over 25 forskellige sprog. Alle API-svarmeddelelser oversættes til den senest registrerede lokalitet for den bruger, der foretager API-anmodningen. Du kan tilsidesætte dette ved at tilføje en brugerdefineret `Accept-Language`-header. Du er velkommen til at prøve det ved hjælp af sprog-rullemenuen nederst på denne side.

## Paginering {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

Paginering understøttes af alle API-slutpunkter, der viser resultater.

Angiv blot egenskaberne for forespørgselsstrengen `page` (og eventuelt `limit`).

Egenskaben `page` skal være et tal større end eller lig med `1`. Hvis du angiver `limit` (også et tal), er minimumsværdien `10` og maksimumsværdien er `50` (medmindre andet er angivet).

| Forespørgselsstrengparametre | Påkrævet | Type | Beskrivelse |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Ingen | Antal | Side med resultater, der skal returneres. Hvis ikke angivet, vil værdien `page` være `1`. Skal være et tal større end eller lig med `1`. |
| `limit` | Ingen | Antal | Antal resultater, der skal returneres pr. side. Standardværdien er `10`, hvis ikke angivet. Skal være et tal, der er større end eller lig med `1`, og mindre end eller lig med `50`. |

For at afgøre, om der er flere resultater tilgængelige, leverer vi disse HTTP-svarheadere (som du kan analysere for at paginere programmatisk):

| HTTP Response Header | Eksempel | Beskrivelse |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Det samlede tilgængelige sideantal. |
| `X-Page-Current` | `X-Page-Current: 1` | Den aktuelle side med returnerede resultater (f.eks. baseret på `page` forespørgselsstrengparameteren). |
| `X-Page-Size` | `X-Page-Size: 10` | Det samlede antal returnerede resultater på siden (f.eks. baseret på `limit` forespørgselsstrengparameteren og de faktiske returnerede resultater). |
| `X-Item-Count` | `X-Item-Count: 30` | Det samlede antal varer, der er tilgængelige på tværs af alle sider. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Vi leverer en `Link` HTTP-svarheader, som du kan parse som vist i eksemplet. Dette er [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (f.eks. vil ikke alle værdier blive angivet, hvis de ikke er relevante eller tilgængelige, f.eks. vil `"next"` ikke blive angivet, hvis der ikke er en anden side). |

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Logfiler {#logs}

### Hent logfiler {#retrieve-logs}

Vores API giver dig programmatisk mulighed for at downloade logfiler til din konto. Hvis du sender en anmodning til dette slutpunkt, behandles alle logfiler til din konto, og de sendes til dig via e-mail som en vedhæftet fil ([Gzip](https://en.wikipedia.org/wiki/Gzip) komprimeret [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) regnearksfil), når den er færdig.

Dette giver dig mulighed for at oprette baggrundsjob med en [Cron job](https://en.wikipedia.org/wiki/Cron) eller bruge vores [Node.js jobplanlægningssoftware Bree](https://github.com/breejs/bree) til at modtage logs, når du ønsker det. Bemærk, at dette slutpunkt er begrænset til `10` anmodninger pr. dag.

Den vedhæftede fil er den lille form af `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`, og selve e-mailen indeholder en kort oversigt over de hentede logfiler. Du kan også downloade logfiler når som helst fra [Min konto → Logfiler](/my-account/logs)

> `GET /v1/logs/download`

| Forespørgselsstrengparametre | Påkrævet | Type | Beskrivelse |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ingen | Streng (FQDN) | Filtrer logfiler efter fuldt kvalificeret domæne ("FQDN"). Hvis du ikke angiver dette, hentes alle logfiler på tværs af alle domæner. |
| `q` | Ingen | Snor | Søg efter logfiler efter e-mail, domæne, aliasnavn, IP-adresse eller dato (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` eller `M.D.YY`). |
| `bounce_category` | Ingen | Snor | Søg efter logfiler efter en specifik afvisningskategori (f.eks. `blocklist`). |
| `response_code` | Ingen | Antal | Søg efter logfiler efter en specifik fejlresponskode (f.eks. `421` eller `550`). |

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Eksempel på Cron-job (ved midnat hver dag):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Bemærk at du kan bruge tjenester som [Crontab.guru](https://crontab.guru/) til at validere din cron-job-udtrykssyntaks.

> Eksempel på Cron-job (ved midnat hver dag **og med logfiler for den foregående dag**):

Til MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Til Linux og Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Konto {#account}

### Opret konto {#create-account}

> `POST /v1/account`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ja | Streng (E-mail) | E-mailadresse |
| `password` | Ja | Snor | Adgangskode |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Hent konto {#retrieve-account}

> `GET /v1/account`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Opdater konto {#update-account}

> `PUT /v1/account`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Ingen | Streng (E-mail) | E-mailadresse |
| `given_name` | Ingen | Snor | Fornavn |
| `family_name` | Ingen | Snor | Efternavn |
| `avatar_url` | Ingen | Streng (URL) | Link til avatarbillede |

> Eksempel på anmodning:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Alias-kontakter (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Liste over kontakter {#list-contacts}

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

## Aliaskalendere (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Vis kalendere {#list-calendars}

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

## Aliasbeskeder (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Sørg for at du har fulgt opsætningsvejledningen for dit domæne.

Disse instruktioner kan findes i vores FAQ-sektion [Understøtter I modtagelse af e-mails med IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Vis og søg efter beskeder {#list-and-search-for-messages}

> `GET /v1/messages`

**Kommer snart**

### Opret besked {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

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

## Aliasmapper (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Vis mapper {#list-folders}

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

## Udgående e-mails {#outbound-emails}

Sørg for at du har fulgt opsætningsvejledningen for dit domæne.

Disse instruktioner kan findes på [Min konto → Domæner → Indstillinger → Udgående SMTP-konfiguration](/my-account/domains). Du skal sørge for at konfigurere DKIM, Return-Path og DMARC til at sende udgående SMTP med dit domæne.

### Hent grænse for udgående SMTP-e-mail {#get-outbound-smtp-email-limit}

Dette er et simpelt slutpunkt, der returnerer et JSON-objekt, der indeholder `count` og `limit` for antallet af daglige udgående SMTP-meddelelser på kontobasis.

> `GET /v1/emails/limit`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Vis udgående SMTP-e-mails {#list-outbound-smtp-emails}

Bemærk, at dette slutpunkt ikke returnerer egenskabsværdier for en e-mails `message`, `headers` eller `rejectedErrors`.

For at returnere disse egenskaber og deres værdier skal du bruge [Hent e-mail](#retrieve-email)-slutpunktet med et e-mail-id.

> `GET /v1/emails`

| Forespørgselsstrengparametre | Påkrævet | Type | Beskrivelse |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ingen | Streng (RegExp understøttes) | Søg efter e-mails efter metadata |
| `domain` | Ingen | Streng (RegExp understøttes) | Søg efter e-mails efter domænenavn |
| `sort` | Ingen | Snor | Sortér efter et specifikt felt (sæt en enkelt bindestreg `-` som præfiks for at sortere i omvendt retning af feltet). Standardindstillingen er `created_at`, hvis den ikke er angivet. |
| `page` | Ingen | Antal | Se [Pagination](#pagination) for mere indsigt |
| `limit` | Ingen | Antal | Se [Pagination](#pagination) for mere indsigt |

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Opret udgående SMTP-e-mail {#create-outbound-smtp-email}

Vores API til oprettelse af e-mails er inspireret af og udnytter Nodemailers konfiguration af beskedindstillinger. Se venligst [Nodemailer-meddelelseskonfiguration](https://nodemailer.com/message/) for alle brødtekstparametre nedenfor.

Bemærk, at med undtagelse af `envelope` og `dkim` (da vi indstiller dem automatisk for dig), understøtter vi alle Nodemailer-indstillinger. Vi indstiller automatisk indstillingerne `disableFileAccess` og `disableUrlAccess` til `true` af sikkerhedsmæssige årsager.

Du skal enten sende den enkelte indstilling `raw` med din rå fulde e-mail inklusive headere **eller** sende individuelle parameterindstillinger for brødtekst nedenfor.

Dette API-slutpunkt vil automatisk kode emojis for dig, hvis de findes i headerne (f.eks. konverteres emnelinjen `Subject: 🤓 Hello` automatisk til `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Vores mål var at lave en ekstremt udviklervenlig og dummy-sikker e-mail-API.

> `POST /v1/emails`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Ingen | Streng (E-mail) | Afsenderens e-mailadresse (skal eksistere som et alias for domænet). |
| `to` | Ingen | Streng eller array | Kommasepareret liste eller et array af modtagere til "Til"-headeren. |
| `cc` | Ingen | Streng eller array | Kommasepareret liste eller et array af modtagere for "Cc"-headeren. |
| `bcc` | Ingen | Streng eller array | Kommasepareret liste eller et array af modtagere til "Bcc"-headeren. |
| `subject` | Ingen | Snor | Emnet for e-mailen. |
| `text` | Ingen | Streng eller buffer | Klartekstversionen af beskeden. |
| `html` | Ingen | Streng eller buffer | HTML-versionen af beskeden. |
| `attachments` | Ingen | Array | En matrix af vedhæftede objekter (se [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Ingen | Snor | E-mailadressen til "Afsender"-headeren (se [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Ingen | Snor | E-mailadressen til "Svar til"-headeren. |
| `inReplyTo` | Ingen | Snor | Det besked-ID, som beskeden er et svar på. |
| `references` | Ingen | Streng eller array | Mellemrumssepareret liste eller et array af meddelelses-ID'er. |
| `attachDataUrls` | Ingen | Boolean | Hvis `true`, konverteres `data:` billeder i HTML-indholdet i beskeden til integrerede vedhæftede filer. |
| `watchHtml` | Ingen | Snor | En Apple Watch-specifik HTML-version af beskeden ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), de nyeste ure kræver ikke, at dette er indstillet). |
| `amp` | Ingen | Snor | En AMP4EMAIL-specifik HTML-version af beskeden (se [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Ingen | Objekt | En iCalendar-begivenhed, der skal bruges som alternativt beskedindhold (se [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Ingen | Array | En matrix af alternativt beskedindhold (se [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Ingen | Snor | Kodning for tekst og HTML-strenge (standard er `"utf-8"`, men understøtter også kodningsværdierne `"hex"` og `"base64"`). |
| `raw` | Ingen | Streng eller buffer | En brugerdefineret RFC822-formateret besked til brug (i stedet for en, der genereres af Nodemailer – se [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Ingen | Snor | Kodning, der er tvunget til at blive brugt til tekstværdier (enten `"quoted-printable"` eller `"base64"`). Standardværdien er den nærmeste værdi, der registreres (til ASCII skal du bruge `"quoted-printable"`). |
| `priority` | Ingen | Snor | Prioritetsniveau for e-mailen (kan enten være `"high"`, `"normal"` (standard) eller `"low"`). Bemærk, at en værdi på `"normal"` ikke angiver en prioritetsheader (dette er standardadfærden). Hvis en værdi på `"high"` eller `"low"` er angivet, så er headerne `X-Priority`, `X-MSMail-Priority` og `Importance` [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Ingen | Objekt eller array | Et objekt eller et array af yderligere headerfelter, der skal indstilles (se [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Ingen | Snor | En valgfri Message-ID-værdi for headeren "Message-ID" (en standardværdi oprettes automatisk, hvis den ikke er angivet – bemærk at værdien skal være [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Ingen | Streng eller dato | En valgfri datoværdi, der bruges, hvis dato-headeren mangler efter parsing. Ellers bruges den aktuelle UTC-streng, hvis den ikke er angivet. Dato-headeren må ikke være mere end 30 dage før det aktuelle tidspunkt. |
| `list` | Ingen | Objekt | Et valgfrit objekt med `List-*` headere (se [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Hent udgående SMTP-e-mail {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Slet udgående SMTP-e-mail {#delete-outbound-smtp-email}

Sletning af e-mails vil sætte status til `"rejected"` (og efterfølgende ikke behandle den i køen), hvis og kun hvis den aktuelle status er en af `"pending"`, `"queued"` eller `"deferred"`. Vi kan slette e-mails automatisk 30 dage efter, at de blev oprettet og/eller sendt – derfor bør du gemme en kopi af udgående SMTP-e-mails i din klient, database eller applikation. Du kan referere til vores e-mail-ID-værdi i din database, hvis det ønskes – denne værdi returneres fra både [Opret e-mail](#create-email) og [Hent e-mail](#retrieve-email) slutpunkter.

> `DELETE /v1/emails/:id`

> Eksempel på anmodning:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domæner {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### Vis domæner {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Forespørgselsstrengparametre | Påkrævet | Type | Beskrivelse |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ingen | Streng (RegExp understøttes) | Søg efter domæner efter navn |
| `name` | Ingen | Streng (RegExp understøttes) | Søg efter domæner efter navn |
| `sort` | Ingen | Snor | Sortér efter et specifikt felt (sæt en enkelt bindestreg `-` som præfiks for at sortere i omvendt retning af feltet). Standardindstillingen er `created_at`, hvis den ikke er angivet. |
| `page` | Ingen | Antal | Se [Pagination](#pagination) for mere indsigt |
| `limit` | Ingen | Antal | Se [Pagination](#pagination) for mere indsigt |

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Opret domæne {#create-domain}

> `POST /v1/domains`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ja | Streng (FQDN eller IP) | Fuldt kvalificeret domænenavn ("FQDN") eller IP-adresse |
| `team_domain` | Ingen | Streng (domæne-id eller domænenavn; FQDN) | Tildel automatisk dette domæne til det samme team fra et andet domæne. Det betyder, at alle medlemmer fra dette domæne vil blive tildelt som teammedlemmer, og `plan` vil automatisk også blive indstillet til `team`. Du kan indstille dette til `"none"`, hvis det er nødvendigt for eksplicit at deaktivere dette, men det er ikke nødvendigt. |
| `plan` | Ingen | Streng (optællelig) | Plantype (skal være `"free"`, `"enhanced_protection"` eller `"team"`, standardværdien er `"free"` eller brugerens nuværende betalte plan, hvis vedkommende har en sådan) |
| `catchall` | Ingen | Streng (afgrænsede e-mailadresser) eller boolsk | Opret et standard catch-all alias, standardværdien er `true` (hvis `true`, bruges API-brugerens e-mailadresse som modtager, og hvis `false`, oprettes der ingen catch-all). Hvis en streng sendes, er det en afgrænset liste over e-mailadresser, der skal bruges som modtagere (adskilt af linjeskift, mellemrum og/eller komma). |
| `has_adult_content_protection` | Ingen | Boolean | Om Spam Scanner-beskyttelse mod voksenindhold skal aktiveres på dette domæne |
| `has_phishing_protection` | Ingen | Boolean | Om phishing-beskyttelse fra Spam Scanner skal aktiveres på dette domæne |
| `has_executable_protection` | Ingen | Boolean | Om beskyttelse af eksekverbare filer i Spam Scanner skal aktiveres på dette domæne |
| `has_virus_protection` | Ingen | Boolean | Om Spam Scanner-virusbeskyttelse skal aktiveres på dette domæne |
| `has_recipient_verification` | Ingen | Boolean | Global domænestandard for, om aliasmodtagere skal klikke på et e-mailbekræftelseslink for at e-mails kan sendes |
| `ignore_mx_check` | Ingen | Boolean | Om MX-postkontrollen på domænet skal ignoreres for verifikation. Dette er primært for brugere, der har avancerede MX-udvekslingskonfigurationsregler og har brug for at beholde deres eksisterende MX-udveksling og videresende den til vores. |
| `retention_days` | Ingen | Antal | Et heltal mellem `0` og `30`, der svarer til antallet af dage, hvor udgående SMTP-e-mails skal gemmes, når de er leveret eller har fået permanente fejl. Standardværdien er `0`, hvilket betyder, at udgående SMTP-e-mails slettes og redigeres med det samme af hensyn til din sikkerhed. |
| `bounce_webhook` | Ingen | Streng (URL) eller boolsk (falsk) | Den `http://` eller `https://` webhook-URL, du vælger, som afviste webhooks skal sendes til. Vi sender en `POST` anmodning til denne URL med oplysninger om udgående SMTP-fejl (f.eks. bløde eller hårde fejl – så du kan administrere dine abonnenter og programmatisk administrere din udgående e-mail). |
| `max_quota_per_alias` | Ingen | Snor | Maksimal lagerpladskvote for aliasser på dette domænenavn. Indtast en værdi som "1 GB", der vil blive analyseret af [bytes](https://github.com/visionmedia/bytes.js). |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Hent domæne {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Bekræft domæneregistreringer {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Bekræft domænets SMTP-poster {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Vis domæneomfattende catch-all-adgangskoder {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Opret domæneomfattende adgangskode {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ingen | Snor | Din brugerdefinerede nye adgangskode, der skal bruges til den domæneomfattende fælles adgangskode. Bemærk, at du kan lade dette felt være tomt eller helt udeladt fra din API-anmodningstekst, hvis du ønsker en tilfældigt genereret og stærk adgangskode. |
| `description` | Ingen | Snor | Beskrivelse kun til organisatoriske formål. |

> Eksempel på anmodning:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Fjern domæneomfattende catch-all-adgangskode {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Eksempel på anmodning:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Opdater domæne {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Ingen | Streng eller tal | Brugerdefineret port til konfiguration af SMTP-videresendelse (standard er `"25"`) |
| `has_adult_content_protection` | Ingen | Boolean | Om Spam Scanner-beskyttelse mod voksenindhold skal aktiveres på dette domæne |
| `has_phishing_protection` | Ingen | Boolean | Om phishing-beskyttelse fra Spam Scanner skal aktiveres på dette domæne |
| `has_executable_protection` | Ingen | Boolean | Om beskyttelse af eksekverbare filer i Spam Scanner skal aktiveres på dette domæne |
| `has_virus_protection` | Ingen | Boolean | Om Spam Scanner-virusbeskyttelse skal aktiveres på dette domæne |
| `has_recipient_verification` | Ingen | Boolean | Global domænestandard for, om aliasmodtagere skal klikke på et e-mailbekræftelseslink for at e-mails kan sendes |
| `ignore_mx_check` | Ingen | Boolean | Om MX-postkontrollen på domænet skal ignoreres for verifikation. Dette er primært for brugere, der har avancerede MX-udvekslingskonfigurationsregler og har brug for at beholde deres eksisterende MX-udveksling og videresende den til vores. |
| `retention_days` | Ingen | Antal | Et heltal mellem `0` og `30`, der svarer til antallet af dage, hvor udgående SMTP-e-mails skal gemmes, når de er leveret eller har fået permanente fejl. Standardværdien er `0`, hvilket betyder, at udgående SMTP-e-mails slettes og redigeres med det samme af hensyn til din sikkerhed. |
| `bounce_webhook` | Ingen | Streng (URL) eller boolsk (falsk) | Den `http://` eller `https://` webhook-URL, du vælger, som afviste webhooks skal sendes til. Vi sender en `POST` anmodning til denne URL med oplysninger om udgående SMTP-fejl (f.eks. bløde eller hårde fejl – så du kan administrere dine abonnenter og programmatisk administrere din udgående e-mail). |
| `max_quota_per_alias` | Ingen | Snor | Maksimal lagerpladskvote for aliasser på dette domænenavn. Indtast en værdi som "1 GB", der vil blive analyseret af [bytes](https://github.com/visionmedia/bytes.js). |

> Eksempel på anmodning:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Slet domæne {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Eksempel på anmodning:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Invitationer {#invites}

### Accepter domæneinvitation {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Opret domæneinvitation {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ja | Streng (E-mail) | E-mailadresse, der skal inviteres til domænemedlemslisten |
| `group` | Ja | Streng (optællelig) | Gruppe, hvor brugeren skal tilføjes til domænemedlemskabet (kan være en af `"admin"` eller `"user"`) |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Fjern domæneinvitation {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ja | Streng (E-mail) | E-mailadresse, der skal fjernes fra listen over domænemedlemmer |

> Eksempel på anmodning:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Medlemmer {#members}

### Opdater domænemedlem {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ja | Streng (optællelig) | Gruppe, som brugeren skal opdatere til domænemedlemskabet med (kan være en af `"admin"` eller `"user"`) |

> Eksempel på anmodning:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Fjern domænemedlem {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Eksempel på anmodning:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliaser {#aliases}

### Generer en aliasadgangskode {#generate-an-alias-password}

Bemærk, at hvis du ikke sender instruktioner via e-mail, vil brugernavn og adgangskode være i JSON-svarteksten i en vellykket anmodning i formatet `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Ingen | Snor | Din brugerdefinerede nye adgangskode til brug for aliaset. Bemærk, at du kan lade dette felt være tomt eller helt udeladt fra din API-anmodningstekst, hvis du ønsker en tilfældigt genereret og stærk adgangskode. |
| `password` | Ingen | Snor | Eksisterende adgangskode til alias for at ændre adgangskoden uden at slette den eksisterende IMAP-postkasselager (se indstillingen `is_override` nedenfor, hvis du ikke længere har den eksisterende adgangskode). |
| `is_override` | Ingen | Boolean | **BRUG MED FORSIGTIGHED**: Dette vil tilsidesætte den eksisterende aliasadgangskode og database fuldstændigt, og vil permanent slette den eksisterende IMAP-lagerplads og nulstille alias' SQLite-e-maildatabase fuldstændigt. Lav venligst en sikkerhedskopi, hvis det er muligt, hvis du har en eksisterende postkasse tilknyttet dette alias. |
| `emailed_instructions` | Ingen | Snor | E-mailadresse, som aliasets adgangskode og opsætningsvejledning skal sendes til. |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Vis domænealiasser {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Forespørgselsstrengparametre | Påkrævet | Type | Beskrivelse |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Ingen | Streng (RegExp understøttes) | Søg efter aliasser i et domæne efter navn, etiket eller modtager |
| `name` | Ingen | Streng (RegExp understøttes) | Søg efter aliasser i et domæne efter navn |
| `recipient` | Ingen | Streng (RegExp understøttes) | Søg efter aliasser i et domæne efter modtager |
| `sort` | Ingen | Snor | Sortér efter et specifikt felt (sæt en enkelt bindestreg `-` som præfiks for at sortere i omvendt retning af feltet). Standardindstillingen er `created_at`, hvis den ikke er angivet. |
| `page` | Ingen | Antal | Se [Pagination](#pagination) for mere indsigt |
| `limit` | Ingen | Antal | Se [Pagination](#pagination) for mere indsigt |

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Opret nyt domænealias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Ingen | Snor | Aliasnavn (hvis ikke angivet eller tomt, genereres et tilfældigt alias) |
| `recipients` | Ingen | Streng eller array | Liste over modtagere (skal være linjeskift-/mellemrums-/kommasepareret). En streng eller et array med gyldige e-mailadresser, fuldt kvalificerede domænenavne ("FQDN"), IP-adresser og/eller webhook-URL'er – og hvis det ikke angives, eller arrayet er tomt, vil brugerens e-mailadresse, der foretager API-anmodningen, blive angivet som modtager. |
| `description` | Ingen | Snor | Aliasbeskrivelse |
| `labels` | Ingen | Streng eller array | Liste over etiketter (skal være linjeskift-/mellemrums-/kommasepareret. Streng eller Array) |
| `has_recipient_verification` | Ingen | Boolean | Kræv, at modtagere klikker på et e-mailbekræftelseslink for at e-mails kan sendes (standardindstillingen er domænets indstilling, hvis den ikke eksplicit er angivet i anmodningens brødtekst) |
| `is_enabled` | Ingen | Boolean | Om dette alias skal aktiveres eller deaktiveres (hvis det er deaktiveret, vil e-mails ikke blive dirigeret nogen steder hen, men returnere succesfulde statuskoder). Hvis en værdi angives, konverteres den til en boolsk værdi ved hjælp af [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Ingen | Nummer (enten `250`, `421` eller `550`) | Indgående e-mails til dette alias vil blive afvist, hvis `is_enabled` er `false` med enten `250` (leveres stille og roligt ingen steder, f.eks. sort hul eller `/dev/null`), `421` (blød afvisning; og prøv igen i op til ~5 dage) eller `550` permanent fejl og afvisning. Standardindstillingen er `250`. |
| `has_imap` | Ingen | Boolean | Om IMAP-lagring skal aktiveres eller deaktiveres for dette alias (hvis deaktiveret, gemmes indgående e-mails ikke i [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en værdi angives, konverteres den til en boolsk værdi ved hjælp af [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Ingen | Boolean | Om [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) skal aktiveres eller deaktiveres for [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) ved hjælp af aliaset' `public_key`. |
| `public_key` | Ingen | Snor | OpenPGP offentlig nøgle i ASCII Armor-format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG-nøgle for `support@forwardemail.net`). Dette gælder kun, hvis du har `has_pgp` indstillet til `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Ingen | Snor | Maksimal lagerkvote for dette alias. Lad feltet stå tomt for at nulstille til domænets nuværende maksimale kvote, eller indtast en værdi som f.eks. "1 GB", der vil blive analyseret af [bytes](https://github.com/visionmedia/bytes.js). Denne værdi kan kun justeres af domæneadministratorer. |
| `vacation_responder_is_enabled` | Ingen | Boolean | Om et automatisk feriesvar skal aktiveres eller deaktiveres. |
| `vacation_responder_start_date` | Ingen | Snor | Startdato for feriesvar (hvis aktiveret, og der ikke er angivet en startdato her, antages det, at den allerede er startet). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved hjælp af `dayjs`. |
| `vacation_responder_end_date` | Ingen | Snor | Slutdato for feriesvar (hvis aktiveret, og der ikke er angivet en slutdato her, antages det, at det aldrig slutter, og svarer for evigt). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved hjælp af `dayjs`. |
| `vacation_responder_subject` | Ingen | Snor | Emne i klartekst til feriesvaret, f.eks. "Fraværende". Vi bruger `striptags` til at fjerne al HTML her. |
| `vacation_responder_message` | Ingen | Snor | Besked i klartekst til feriesvaret, f.eks. "Jeg vil være væk fra kontoret indtil februar.". Vi bruger `striptags` til at fjerne al HTML her. |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Hent domænealias {#retrieve-domain-alias}

Du kan hente et domænealias enten ved hjælp af dets `id` eller dets `name` værdi.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Eksempel på anmodning:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Opdater domænealias {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Ingen | Snor | Aliasnavn |
| `recipients` | Ingen | Streng eller array | Liste over modtagere (skal være linjeskift-/mellemrums-/kommasepareret). Streng eller array af gyldige e-mailadresser, fuldt kvalificerede domænenavne ("FQDN"), IP-adresser og/eller webhook-URL'er. |
| `description` | Ingen | Snor | Aliasbeskrivelse |
| `labels` | Ingen | Streng eller array | Liste over etiketter (skal være linjeskift-/mellemrums-/kommasepareret. Streng eller Array) |
| `has_recipient_verification` | Ingen | Boolean | Kræv, at modtagere klikker på et e-mailbekræftelseslink for at e-mails kan sendes (standardindstillingen er domænets indstilling, hvis den ikke eksplicit er angivet i anmodningens brødtekst) |
| `is_enabled` | Ingen | Boolean | Om dette alias skal aktiveres eller deaktiveres (hvis det er deaktiveret, vil e-mails ikke blive dirigeret nogen steder hen, men returnere succesfulde statuskoder). Hvis en værdi angives, konverteres den til en boolsk værdi ved hjælp af [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Ingen | Nummer (enten `250`, `421` eller `550`) | Indgående e-mails til dette alias vil blive afvist, hvis `is_enabled` er `false` med enten `250` (leveres stille og roligt ingen steder, f.eks. sort hul eller `/dev/null`), `421` (blød afvisning; og prøv igen i op til ~5 dage) eller `550` permanent fejl og afvisning. Standardindstillingen er `250`. |
| `has_imap` | Ingen | Boolean | Om IMAP-lagring skal aktiveres eller deaktiveres for dette alias (hvis deaktiveret, gemmes indgående e-mails ikke i [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Hvis en værdi angives, konverteres den til en boolsk værdi ved hjælp af [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Ingen | Boolean | Om [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) skal aktiveres eller deaktiveres for [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) ved hjælp af aliaset' `public_key`. |
| `public_key` | Ingen | Snor | OpenPGP offentlig nøgle i ASCII Armor-format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); f.eks. GPG-nøgle for `support@forwardemail.net`). Dette gælder kun, hvis du har `has_pgp` indstillet til `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Ingen | Snor | Maksimal lagerkvote for dette alias. Lad feltet stå tomt for at nulstille til domænets nuværende maksimale kvote, eller indtast en værdi som f.eks. "1 GB", der vil blive analyseret af [bytes](https://github.com/visionmedia/bytes.js). Denne værdi kan kun justeres af domæneadministratorer. |
| `vacation_responder_is_enabled` | Ingen | Boolean | Om et automatisk feriesvar skal aktiveres eller deaktiveres. |
| `vacation_responder_start_date` | Ingen | Snor | Startdato for feriesvar (hvis aktiveret, og der ikke er angivet en startdato her, antages det, at den allerede er startet). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved hjælp af `dayjs`. |
| `vacation_responder_end_date` | Ingen | Snor | Slutdato for feriesvar (hvis aktiveret, og der ikke er angivet en slutdato her, antages det, at det aldrig slutter, og svarer for evigt). Vi understøtter datoformater som `MM/DD/YYYY`, `YYYY-MM-DD` og andre datoformater via smart parsing ved hjælp af `dayjs`. |
| `vacation_responder_subject` | Ingen | Snor | Emne i klartekst til feriesvaret, f.eks. "Fraværende". Vi bruger `striptags` til at fjerne al HTML her. |
| `vacation_responder_message` | Ingen | Snor | Besked i klartekst til feriesvaret, f.eks. "Jeg vil være væk fra kontoret indtil februar.". Vi bruger `striptags` til at fjerne al HTML her. |

> Eksempel på anmodning:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Slet domænealias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Eksempel på anmodning:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Krypter {#encrypt}

Vi giver dig mulighed for at kryptere poster, selv med gratisabonnementet, uden omkostninger. Privatliv bør ikke være en funktion, det bør være indbygget i alle aspekter af et produkt. Som meget efterspurgt i en [Diskussion om privatlivsvejledninger](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og på [vores GitHub-problemer](https://github.com/forwardemail/forwardemail.net/issues/254) har vi tilføjet dette.

### Krypter TXT-post {#encrypt-txt-record}

> `POST /v1/encrypt`

| Kropsparameter | Påkrævet | Type | Beskrivelse |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ja | Snor | Enhver gyldig post til videresendelse af e-mail i klartekst (TXT) |

> Eksempel på anmodning:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
