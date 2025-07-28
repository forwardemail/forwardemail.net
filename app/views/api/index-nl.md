# E-mail API {#email-api}

## Inhoudsopgave {#table-of-contents}

* [Bibliotheken](#libraries)
* [Basis-URI](#base-uri)
* [Authenticatie](#authentication)
* [Fouten](#errors)
* [Lokalisatie](#localization)
* [Paginering](#pagination)
* [Logboeken](#logs)
  * [Logs ophalen](#retrieve-logs)
* [Rekening](#account)
  * [Account aanmaken](#create-account)
  * [Account ophalen](#retrieve-account)
  * [Account bijwerken](#update-account)
* [Aliascontacten (CardDAV)](#alias-contacts-carddav)
  * [Contactenlijst](#list-contacts)
  * [Contactpersoon aanmaken](#create-contact)
  * [Contactpersoon ophalen](#retrieve-contact)
  * [Contactpersoon bijwerken](#update-contact)
  * [Contactpersoon verwijderen](#delete-contact)
* [Aliaskalenders (CalDAV)](#alias-calendars-caldav)
  * [Lijstkalenders](#list-calendars)
  * [Kalender maken](#create-calendar)
  * [Kalender ophalen](#retrieve-calendar)
  * [Kalender bijwerken](#update-calendar)
  * [Kalender verwijderen](#delete-calendar)
* [Aliasberichten (IMAP/POP3)](#alias-messages-imappop3)
  * [Berichten weergeven en zoeken](#list-and-search-for-messages)
  * [Bericht maken](#create-message)
  * [Bericht ophalen](#retrieve-message)
  * [Bericht bijwerken](#update-message)
  * [Bericht verwijderen](#delete-message)
* [Alias-mappen (IMAP/POP3)](#alias-folders-imappop3)
  * [Lijst mappen](#list-folders)
  * [Map maken](#create-folder)
  * [Map ophalen](#retrieve-folder)
  * [Map bijwerken](#update-folder)
  * [Map verwijderen](#delete-folder)
  * [Kopieer map](#copy-folder)
* [Uitgaande e-mails](#outbound-emails)
  * [Limiet voor uitgaande SMTP-e-mail ophalen](#get-outbound-smtp-email-limit)
  * [Lijst met uitgaande SMTP-e-mails](#list-outbound-smtp-emails)
  * [Uitgaande SMTP-e-mail maken](#create-outbound-smtp-email)
  * [Uitgaande SMTP-e-mail ophalen](#retrieve-outbound-smtp-email)
  * [Uitgaande SMTP-e-mail verwijderen](#delete-outbound-smtp-email)
* [Domeinen](#domains)
  * [Lijstdomeinen](#list-domains)
  * [Domein aanmaken](#create-domain)
  * [Domein ophalen](#retrieve-domain)
  * [Domeinrecords verifiëren](#verify-domain-records)
  * [Controleer domein SMTP-records](#verify-domain-smtp-records)
  * [Domeinbrede catch-all-wachtwoorden opsommen](#list-domain-wide-catch-all-passwords)
  * [Maak een domeinbreed catch-all-wachtwoord aan](#create-domain-wide-catch-all-password)
  * [Verwijder domeinbrede catch-all-wachtwoorden](#remove-domain-wide-catch-all-password)
  * [Domein bijwerken](#update-domain)
  * [Domein verwijderen](#delete-domain)
* [Uitnodigingen](#invites)
  * [Domeinuitnodiging accepteren](#accept-domain-invite)
  * [Domeinuitnodiging maken](#create-domain-invite)
  * [Domeinuitnodiging verwijderen](#remove-domain-invite)
* [Leden](#members)
  * [Domeinlid bijwerken](#update-domain-member)
  * [Domeinlid verwijderen](#remove-domain-member)
* [Aliassen](#aliases)
  * [Genereer een aliaswachtwoord](#generate-an-alias-password)
  * [Domeinaliassen weergeven](#list-domain-aliases)
  * [Nieuw domeinalias aanmaken](#create-new-domain-alias)
  * [Domeinalias ophalen](#retrieve-domain-alias)
  * [Domeinalias bijwerken](#update-domain-alias)
  * [Domeinalias verwijderen](#delete-domain-alias)
* [Versleutelen](#encrypt)
  * [TXT-record versleutelen](#encrypt-txt-record)

## Bibliotheken {#libraries}

Momenteel hebben we nog geen API-wrappers uitgebracht, maar we zijn van plan dit in de nabije toekomst te doen. Stuur een e-mail naar <api@forwardemail.net> als u op de hoogte wilt worden gehouden wanneer de API-wrapper van een specifieke programmeertaal beschikbaar is. In de tussentijd kunt u deze aanbevolen HTTP-aanvraagbibliotheken in uw applicatie gebruiken of gewoon [krul](https://stackoverflow.com/a/27442239/3586413) gebruiken, zoals in de onderstaande voorbeelden.

| Taal | Bibliotheek |
| ---------- | ---------------------------------------------------------------------- |
| Robijn | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (wij zijn beheerders) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (wij zijn beheerders) |
| Gaan | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Basis-URI {#base-uri}

Het huidige HTTP-basis-URI-pad is: `BASE_URI`.

## Authenticatie {#authentication}

Voor alle eindpunten moet uw [API-sleutel](https://forwardemail.net/my-account/security) worden ingesteld als de waarde voor de gebruikersnaam in de [Basisautorisatie](https://en.wikipedia.org/wiki/Basic_access_authentication)-header van de aanvraag (met uitzondering van [Alias-contacten](#alias-contacts), [Alias-kalenders](#alias-calendars) en [Alias-mailboxen](#alias-mailboxes), die een [gegenereerde alias gebruikersnaam en wachtwoord](/faq#do-you-support-receiving-email-with-imap) gebruiken).

Maakt u zich geen zorgen: hieronder vindt u voorbeelden als u niet zeker weet wat dit is.

## Fouten {#errors}

Als er fouten optreden, bevat de antwoordtekst van de API-aanvraag een gedetailleerd foutbericht.

| Code | Naam |
| ---- | --------------------- |
| 200 | OK |
| 400 | Fout verzoek |
| 401 | Ongeautoriseerd |
| 403 | Verboden |
| 404 | Niet gevonden |
| 429 | Te veel verzoeken |
| 500 | Interne serverfout |
| 501 | Niet geïmplementeerd |
| 502 | Slechte toegangspoort |
| 503 | Service niet beschikbaar |
| 504 | Gateway-time-out |

> \[!TIP]
> Als u een 5xx-statuscode ontvangt (wat normaal gesproken niet zou moeten gebeuren), neem dan contact met ons op via <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>. We helpen u dan direct met het oplossen van uw probleem.

## Lokalisatie {#localization}

Onze service is vertaald naar meer dan 25 verschillende talen. Alle API-responsberichten worden vertaald naar de laatst gedetecteerde landinstellingen van de gebruiker die de API-aanvraag indient. U kunt dit overschrijven door een aangepaste `Accept-Language`-header toe te voegen. Probeer het gerust uit met behulp van de taalkeuzelijst onderaan deze pagina.

## Paginering {#pagination}

> \[!NOTE]
> Vanaf 1 november 2024 zijn de API-eindpunten voor [Lijstdomeinen](#list-domains) en [Domeinaliassen weergeven](#list-domain-aliases) standaard ingesteld op het maximale aantal resultaten per pagina van `1000`. Als u zich hier al eerder voor wilt aanmelden, kunt u `?paginate=true` als extra querystringparameter doorgeven aan de URL voor de eindpuntquery.

Paginering wordt ondersteund door alle API-eindpunten die resultaten weergeven.

Geef eenvoudig de querystringeigenschappen `page` op (en optioneel `limit`).

De eigenschap `page` moet een getal zijn dat groter is dan of gelijk is aan `1`. Als u `limit` (ook een getal) opgeeft, is de minimumwaarde `10` en de maximumwaarde `50` (tenzij anders vermeld).

| Querystring-parameters | Vereist | Type | Beschrijving |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Nee | Nummer | Pagina met te retourneren resultaten. Indien niet gespecificeerd, is de waarde `page` `1`. Moet een getal groter dan of gelijk aan `1` zijn. |
| `limit` | Nee | Nummer | Aantal resultaten per pagina. Standaardwaarde is `10` indien niet gespecificeerd. Moet een getal zijn groter dan of gelijk aan `1` en kleiner dan of gelijk aan `50`. |

Om te kunnen bepalen of er meer resultaten beschikbaar zijn, bieden we de volgende HTTP-responsheaders aan (die u kunt parseren om programmatisch te pagineren):

| HTTP-responsheader | Voorbeeld | Beschrijving |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Het totale beschikbare aantal pagina's. |
| `X-Page-Current` | `X-Page-Current: 1` | De huidige pagina met geretourneerde resultaten (bijvoorbeeld op basis van de querystringparameter `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Het totale aantal resultaten dat op de pagina is geretourneerd (bijvoorbeeld op basis van de querystringparameter `limit` en de daadwerkelijk geretourneerde resultaten). |
| `X-Item-Count` | `X-Item-Count: 30` | Het totale aantal items dat beschikbaar is op alle pagina's. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | We bieden een HTTP-responsheader `Link` die u kunt parseren zoals in het voorbeeld. Dit is [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (bijvoorbeeld: niet alle waarden worden verstrekt als ze niet relevant of beschikbaar zijn; bijvoorbeeld `"next"` wordt niet verstrekt als er geen andere pagina is). |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Logboeken {#logs}

### Logs ophalen {#retrieve-logs}

Met onze API kunt u programmatisch logs voor uw account downloaden. Door een aanvraag in te dienen bij dit eindpunt, worden alle logs voor uw account verwerkt en als bijlage ([Gzip](https://en.wikipedia.org/wiki/Gzip) gecomprimeerd [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) spreadsheetbestand) naar u gemaild zodra deze voltooid zijn.

Hiermee kunt u achtergrondtaken aanmaken met een [Cron-taak](https://en.wikipedia.org/wiki/Cron) of met onze [Node.js-taakplanningssoftware Bree](https://github.com/breejs/bree) om logs te ontvangen wanneer u dat wilt. Let op: dit eindpunt is beperkt tot `10`-verzoeken per dag.

De bijlage is de kleine letter `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` en de e-mail zelf bevat een korte samenvatting van de opgehaalde logs. U kunt logs ook op elk gewenst moment downloaden van [Mijn account → Logboeken](/my-account/logs).

> `GET /v1/logs/download`

| Querystring-parameters | Vereist | Type | Beschrijving |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Nee | String (FQDN) | Filter logs op volledig gekwalificeerd domein ("FQDN"). Als u dit niet opgeeft, worden alle logs van alle domeinen opgehaald. |
| `q` | Nee | Snaar | Zoek naar logs op e-mailadres, domein, aliasnaam, IP-adres of datum (indeling `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` of `M.D.YY`). |
| `bounce_category` | Nee | Snaar | Zoek naar logs op basis van een specifieke bouncecategorie (bijv. `blocklist`). |
| `response_code` | Nee | Nummer | Zoek naar logs op basis van een specifieke foutresponscode (bijv. `421` of `550`). |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Voorbeeld van een cronjob (elke dag om middernacht):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Houd er rekening mee dat u services zoals [Crontab.guru](https://crontab.guru/) kunt gebruiken om de syntaxis van uw cron-taakexpressies te valideren.

> Voorbeeld van een cronjob (elke dag om middernacht **en met logs van de vorige dag**):

Voor MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Voor Linux en Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Rekening {#account}

### Account aanmaken {#create-account}

> `POST /v1/account`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ja | String (e-mail) | E-mailadres |
| `password` | Ja | Snaar | Wachtwoord |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Rekening ophalen {#retrieve-account}

> `GET /v1/account`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Account bijwerken {#update-account}

> `PUT /v1/account`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Nee | String (e-mail) | E-mailadres |
| `given_name` | Nee | Snaar | Voornaam |
| `family_name` | Nee | Snaar | Achternaam |
| `avatar_url` | Nee | Tekenreeks (URL) | Link naar avatarafbeelding |

> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Aliascontacten (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> In tegenstelling tot andere API-eindpunten vereisen deze headers voor basisautorisatie een 'gebruikersnaam' van [Authenticatie](#authentication) die gelijk is aan de aliasgebruikersnaam en een 'wachtwoord' dat gelijk is aan het door de alias gegenereerde wachtwoord.

> \[!WARNING]
> Deze endpointsectie is nog in ontwikkeling en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit de dropdown 'Apps' in de navigatiebalk van onze website.

### Contactenlijst {#list-contacts}

> `GET /v1/contacts`

**Binnenkort beschikbaar**

### Contactpersoon {#create-contact} aanmaken

> `POST /v1/contacts`

**Binnenkort beschikbaar**

### Contactpersoon ophalen {#retrieve-contact}

> `GET /v1/contacts/:id`

**Binnenkort beschikbaar**

### Contactpersoon bijwerken {#update-contact}

> `PUT /v1/contacts/:id`

**Binnenkort beschikbaar**

### Contactpersoon verwijderen {#delete-contact}

> `DELETE /v1/contacts/:id`

**Binnenkort beschikbaar**

## Alias-agenda's (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> In tegenstelling tot andere API-eindpunten vereisen deze headers voor basisautorisatie een 'gebruikersnaam' van [Authenticatie](#authentication) die gelijk is aan de aliasgebruikersnaam en een 'wachtwoord' dat gelijk is aan het door de alias gegenereerde wachtwoord.

> \[!WARNING]
> Deze endpointsectie is nog in ontwikkeling en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit de dropdown 'Apps' in de navigatiebalk van onze website.

### Kalenders weergeven {#list-calendars}

> `GET /v1/calendars`

**Binnenkort beschikbaar**

### Kalender aanmaken {#create-calendar}

> `POST /v1/calendars`

**Binnenkort beschikbaar**

### Agenda ophalen {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Binnenkort beschikbaar**

### Kalender bijwerken {#update-calendar}

> `PUT /v1/calendars/:id`

**Binnenkort beschikbaar**

### Verwijder agenda {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Binnenkort beschikbaar**

## Aliasberichten (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> In tegenstelling tot andere API-eindpunten vereisen deze headers voor basisautorisatie een 'gebruikersnaam' van [Authenticatie](#authentication) die gelijk is aan de aliasgebruikersnaam en een 'wachtwoord' dat gelijk is aan het door de alias gegenereerde wachtwoord.

> \[!WARNING]
> Deze endpointsectie is nog in ontwikkeling en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit de dropdown 'Apps' in de navigatiebalk van onze website.

Zorg ervoor dat u de installatie-instructies voor uw domein hebt gevolgd.

Deze instructies vindt u in onze FAQ-sectie [Ondersteunt u het ontvangen van e-mail via IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Lijst en zoek naar berichten {#list-and-search-for-messages}

> `GET /v1/messages`

**Binnenkort beschikbaar**

### Bericht maken {#create-message}

> \[!NOTE]
> Hiermee wordt **GEEN** e-mail verzonden – het bericht wordt alleen toegevoegd aan uw mailboxmap (dit is bijvoorbeeld vergelijkbaar met de IMAP-opdracht `APPEND`). Als u een e-mail wilt verzenden, zie dan [Uitgaande SMTP-e-mail maken](#create-outbound-smtp-email) hieronder. Nadat u de uitgaande SMTP-mail hebt aangemaakt, kunt u een kopie ervan met behulp van dit eindpunt toevoegen aan de mailbox van uw alias voor opslagdoeleinden.

> `POST /v1/messages`

**Binnenkort beschikbaar**

### Bericht ophalen {#retrieve-message}

> `GET /v1/messages/:id`

**Binnenkort beschikbaar**

### Bericht bijwerken {#update-message}

> `PUT /v1/messages/:id`

**Binnenkort beschikbaar**

### Verwijder bericht {#delete-message}

> `DELETE /v1/messages:id`

**Binnenkort beschikbaar**

## Alias-mappen (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Eindpunten van mappen met het pad <code>/v1/folders/:path</code> als eindpunt zijn uitwisselbaar met de ID <code>:id</code> van een map. Dit betekent dat u naar de map kunt verwijzen met de waarde <code>path</code> of <code>id</code>.

> \[!WARNING]
> Deze endpointsectie is nog in ontwikkeling en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit de dropdown 'Apps' in de navigatiebalk van onze website.

### Mappen weergeven {#list-folders}

> `GET /v1/folders`

**Binnenkort beschikbaar**

### Maak map {#create-folder}

> `POST /v1/folders`

**Binnenkort beschikbaar**

### Haal map {#retrieve-folder} op

> `GET /v1/folders/:id`

**Binnenkort beschikbaar**

### Map {#update-folder} bijwerken

> `PUT /v1/folders/:id`

**Binnenkort beschikbaar**

### Verwijder map {#delete-folder}

> `DELETE /v1/folders/:id`

**Binnenkort beschikbaar**

### Kopieer map {#copy-folder}

> `POST /v1/folders/:id/copy`

**Binnenkort beschikbaar**

## Uitgaande e-mails {#outbound-emails}

Zorg ervoor dat u de installatie-instructies voor uw domein hebt gevolgd.

Deze instructies zijn te vinden op [Mijn account → Domeinen → Instellingen → Uitgaande SMTP-configuratie](/my-account/domains). Zorg ervoor dat DKIM, Return-Path en DMARC zijn ingesteld voor het verzenden van uitgaande SMTP met uw domein.

### Uitgaande SMTP-e-maillimiet ophalen {#get-outbound-smtp-email-limit}

Dit is een eenvoudig eindpunt dat een JSON-object retourneert dat `count` en `limit` bevat voor het aantal dagelijkse uitgaande SMTP-berichten per account.

> `GET /v1/emails/limit`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Uitgaande SMTP-e-mails weergeven {#list-outbound-smtp-emails}

Houd er rekening mee dat dit eindpunt geen eigenschapswaarden retourneert voor `message`, `headers` en `rejectedErrors` van een e-mail.

Om deze eigenschappen en hun waarden te retourneren, gebruikt u het eindpunt [E-mail ophalen](#retrieve-email) met een e-mailadres.

> `GET /v1/emails`

| Querystring-parameters | Vereist | Type | Beschrijving |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Nee | String (RegExp ondersteund) | Zoeken naar e-mails op metagegevens |
| `domain` | Nee | String (RegExp ondersteund) | Zoek naar e-mails op domeinnaam |
| `sort` | Nee | Snaar | Sorteren op een specifiek veld (voeg hiervoor een enkel streepje `-` toe om in de omgekeerde richting van dat veld te sorteren). Standaard is dit `created_at` als deze optie niet is ingesteld. |
| `page` | Nee | Nummer | Zie [Pagination](#pagination) voor meer inzicht |
| `limit` | Nee | Nummer | Zie [Pagination](#pagination) voor meer inzicht |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Uitgaande SMTP-e-mail maken {#create-outbound-smtp-email}

Onze API voor het maken van een e-mail is geïnspireerd op en maakt gebruik van de berichtopties van Nodemailer. Raadpleeg [Nodemailer-berichtconfiguratie](https://nodemailer.com/message/) voor alle onderstaande bodyparameters.

Houd er rekening mee dat we, met uitzondering van `envelope` en `dkim` (aangezien we die automatisch voor u instellen), alle opties van Nodemailer ondersteunen. Om beveiligingsredenen stellen we de opties `disableFileAccess` en `disableUrlAccess` automatisch in op `true`.

U dient ofwel de enkele optie `raw` door te geven met uw volledige e-mail inclusief headers **of** individuele hoofdparameteropties hieronder door te geven.

Dit API-eindpunt codeert automatisch emoji's als ze in de headers voorkomen (een onderwerpregel van `Subject: 🤓 Hello` wordt bijvoorbeeld automatisch omgezet naar `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Ons doel was om een uiterst ontwikkelaarsvriendelijke en onfeilbare e-mail-API te maken.

> `POST /v1/emails`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Nee | String (e-mail) | Het e-mailadres van de afzender (moet bestaan als alias van het domein). |
| `to` | Nee | String of Array | Door komma's gescheiden lijst of een array van ontvangers voor de kop 'Aan'. |
| `cc` | Nee | String of Array | Door komma's gescheiden lijst of een array van ontvangers voor de "Cc"-header. |
| `bcc` | Nee | String of Array | Door komma's gescheiden lijst of een array van ontvangers voor de "Bcc"-header. |
| `subject` | Nee | Snaar | Het onderwerp van de e-mail. |
| `text` | Nee | String of buffer | De plattetekstversie van het bericht. |
| `html` | Nee | String of buffer | De HTML-versie van het bericht. |
| `attachments` | Nee | Array | Een array van bijlageobjecten (zie [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Nee | Snaar | Het e-mailadres voor de header "Afzender" (zie [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Nee | Snaar | Het e-mailadres voor de header 'Beantwoorden aan'. |
| `inReplyTo` | Nee | Snaar | De bericht-ID waarop het bericht een antwoord is. |
| `references` | Nee | String of Array | Door spaties gescheiden lijst of een array met bericht-ID's. |
| `attachDataUrls` | Nee | Booleaanse | Als `true`, dan worden `data:` afbeeldingen in de HTML-inhoud van het bericht omgezet naar ingesloten bijlagen. |
| `watchHtml` | Nee | Snaar | Een Apple Watch-specifieke HTML-versie van het bericht ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]); bij de nieuwste horloges hoeft dit niet te worden ingesteld). |
| `amp` | Nee | Snaar | Een AMP4EMAIL-specifieke HTML-versie van het bericht (zie [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Nee | Voorwerp | Een iCalendar-gebeurtenis die als alternatieve berichtinhoud kan worden gebruikt (zie [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Nee | Array | Een array met alternatieve berichtinhoud (zie [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Nee | Snaar | Codering voor de tekst en HTML-strings (standaard `"utf-8"`, maar ondersteunt ook de coderingswaarden `"hex"` en `"base64"`). |
| `raw` | Nee | String of buffer | Een op maat gegenereerd RFC822-geformatteerd bericht om te gebruiken (in plaats van een bericht dat door Nodemailer wordt gegenereerd - zie [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Nee | Snaar | Codering die verplicht moet worden gebruikt voor tekstwaarden (`"quoted-printable"` of `"base64"`). De standaardwaarde is de dichtstbijzijnde gedetecteerde waarde (voor ASCII gebruikt u `"quoted-printable"`). |
| `priority` | Nee | Snaar | Prioriteitsniveau voor de e-mail (kan `"high"`, `"normal"` (standaard) of `"low"` zijn). Houd er rekening mee dat een waarde van `"normal"` geen prioriteitsheader instelt (dit is de standaardinstelling). Als een waarde van `"high"` of `"low"` is ingesteld, worden de headers `X-Priority`, `X-MSMail-Priority` en `Importance` [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Nee | Object of Array | Een object of een array met extra headervelden die moeten worden ingesteld (zie [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Nee | Snaar | Een optionele Message-ID-waarde voor de "Message-ID"-header (er wordt automatisch een standaardwaarde aangemaakt als deze niet is ingesteld; let op: de waarde moet [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705) zijn). |
| `date` | Nee | String of datum | Een optionele datumwaarde die wordt gebruikt als de datumheader ontbreekt na het parseren. Anders wordt de huidige UTC-tekenreeks gebruikt indien deze niet is ingesteld. De datumheader mag niet meer dan 30 dagen vóór de huidige tijd liggen. |
| `list` | Nee | Voorwerp | Een optioneel object van `List-*` headers (zie [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Uitgaande SMTP-e-mail ophalen {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Verwijder uitgaande SMTP-e-mail {#delete-outbound-smtp-email}

Het verwijderen van e-mails zet de status op `"rejected"` (en verwerkt deze vervolgens niet in de wachtrij) als en alleen als de huidige status `"pending"`, `"queued"` of `"deferred"` is. We kunnen e-mails automatisch verwijderen na 30 dagen nadat ze zijn aangemaakt en/of verzonden. Bewaar daarom een kopie van uitgaande SMTP-e-mails in uw client, database of applicatie. U kunt desgewenst verwijzen naar onze e-mail-ID in uw database. Deze waarde wordt geretourneerd door zowel [E-mail maken](#create-email) als [E-mail ophalen](#retrieve-email) eindpunten.

> `DELETE /v1/emails/:id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domeinen {#domains}

> \[!TIP]
> Domeineindpunten met de domeinnaam <code>/v1/domains/:domeinnaam</code> als eindpunt zijn uitwisselbaar met de domein-ID <code>:domeinnaam</code>. Dit betekent dat u naar het domein kunt verwijzen met de waarde <code>naam</code> of <code>id</code>.

### Domeinen weergeven {#list-domains}

> \[!NOTE]
> Vanaf 1 november 2024 zijn de API-eindpunten voor [Lijstdomeinen](#list-domains) en [Domeinaliassen weergeven](#list-domain-aliases) standaard ingesteld op het maximale aantal resultaten per pagina van `1000`. Als u zich hier al eerder voor wilt aanmelden, kunt u `?paginate=true` als extra querystringparameter doorgeven aan de URL voor de eindpuntquery. Zie [Paginering](#pagination) voor meer informatie.

> `GET /v1/domains`

| Querystring-parameters | Vereist | Type | Beschrijving |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Nee | String (RegExp ondersteund) | Zoek naar domeinen op naam |
| `name` | Nee | String (RegExp ondersteund) | Zoek naar domeinen op naam |
| `sort` | Nee | Snaar | Sorteren op een specifiek veld (voeg hiervoor een enkel streepje `-` toe om in de omgekeerde richting van dat veld te sorteren). Standaard is dit `created_at` als deze optie niet is ingesteld. |
| `page` | Nee | Nummer | Zie [Pagination](#pagination) voor meer inzicht |
| `limit` | Nee | Nummer | Zie [Pagination](#pagination) voor meer inzicht |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Domein {#create-domain} aanmaken

> `POST /v1/domains`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ja | String (FQDN of IP) | Volledig gekwalificeerde domeinnaam ("FQDN") of IP-adres |
| `team_domain` | Nee | String (domein-ID of domeinnaam; FQDN) | Wijs dit domein automatisch toe aan hetzelfde team uit een ander domein. Dit betekent dat alle leden van dit domein als teamleden worden toegewezen en dat `plan` automatisch wordt ingesteld op `team`. U kunt dit indien nodig instellen op `"none"` om dit expliciet uit te schakelen, maar dat is niet noodzakelijk. |
| `plan` | Nee | String (opsombaar) | Plantype (moet `"free"`, `"enhanced_protection"` of `"team"` zijn, standaard is dit `"free"` of het huidige betaalde abonnement van de gebruiker indien van toepassing) |
| `catchall` | Nee | String (gescheiden e-mailadressen) of Booleaans | Maak een standaard catch-all-alias aan, standaard `true` (bij `true` wordt het e-mailadres van de API-gebruiker als ontvanger gebruikt, en bij `false` wordt er geen catch-all aangemaakt). Als er een string wordt doorgegeven, is dit een gescheiden lijst met e-mailadressen die als ontvangers worden gebruikt (gescheiden door een regeleinde, spatie en/of komma). |
| `has_adult_content_protection` | Nee | Booleaanse | Of de bescherming tegen inhoud voor volwassenen van Spam Scanner op dit domein moet worden ingeschakeld |
| `has_phishing_protection` | Nee | Booleaanse | Of de phishingbeveiliging van Spam Scanner op dit domein moet worden ingeschakeld |
| `has_executable_protection` | Nee | Booleaanse | Of de uitvoerbare bescherming van Spam Scanner op dit domein moet worden ingeschakeld |
| `has_virus_protection` | Nee | Booleaanse | Of de Spam Scanner-virusbeveiliging op dit domein moet worden ingeschakeld |
| `has_recipient_verification` | Nee | Booleaanse | Standaardinstelling voor globaal domein voor de vraag of aliasontvangers op een e-mailverificatielink moeten klikken om e-mails door te laten stromen |
| `ignore_mx_check` | Nee | Booleaanse | Of de MX-recordcontrole op het domein ter verificatie moet worden genegeerd. Dit is vooral bedoeld voor gebruikers met geavanceerde MX-exchangeconfiguratieregels die hun bestaande MX-exchange willen behouden en naar de onze willen doorsturen. |
| `retention_days` | Nee | Nummer | Een geheel getal tussen `0` en `30` dat overeenkomt met het aantal bewaardagen voor uitgaande SMTP-e-mails na succesvolle bezorging of na een permanente fout. Standaard is dit `0`, wat betekent dat uitgaande SMTP-e-mails direct worden verwijderd en geredigeerd voor uw veiligheid. |
| `bounce_webhook` | Nee | String (URL) of Booleaans (false) | De `http://` of `https://` webhook-URL van uw keuze om bounce-webhooks naartoe te sturen. We sturen een `POST`-verzoek naar deze URL met informatie over uitgaande SMTP-fouten (bijv. soft- of hard-fouten – zodat u uw abonnees kunt beheren en uw uitgaande e-mail programmatisch kunt beheren). |
| `max_quota_per_alias` | Nee | Snaar | Maximale opslagquota voor aliassen op deze domeinnaam. Voer een waarde in, bijvoorbeeld '1 GB', die door [bytes](https://github.com/visionmedia/bytes.js) wordt verwerkt. |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Domein {#retrieve-domain} ophalen

> `GET /v1/domains/DOMAIN_NAME`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Controleer domeinrecords {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Controleer domein SMTP-records {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Domeinbrede catch-all-wachtwoorden weergeven {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Maak een domeinbreed catch-all-wachtwoord {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nee | Snaar | Uw nieuwe, aangepaste wachtwoord voor het domeinbrede catch-all-wachtwoord. U kunt dit leeg laten of helemaal weglaten uit de hoofdtekst van uw API-aanvraag als u een willekeurig gegenereerd en sterk wachtwoord wilt. |
| `description` | Nee | Snaar | Beschrijving is uitsluitend bedoeld voor organisatorische doeleinden. |

> Voorbeeldverzoek:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Verwijder domeinbrede catch-all-wachtwoord {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Domein {#update-domain} bijwerken

> `PUT /v1/domains/DOMAIN_NAME`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Nee | String of getal | Aangepaste poort om te configureren voor SMTP-doorsturen (standaard is `"25"`) |
| `has_adult_content_protection` | Nee | Booleaanse | Of de bescherming tegen inhoud voor volwassenen van Spam Scanner op dit domein moet worden ingeschakeld |
| `has_phishing_protection` | Nee | Booleaanse | Of de phishingbeveiliging van Spam Scanner op dit domein moet worden ingeschakeld |
| `has_executable_protection` | Nee | Booleaanse | Of de uitvoerbare bescherming van Spam Scanner op dit domein moet worden ingeschakeld |
| `has_virus_protection` | Nee | Booleaanse | Of de Spam Scanner-virusbeveiliging op dit domein moet worden ingeschakeld |
| `has_recipient_verification` | Nee | Booleaanse | Standaardinstelling voor globaal domein voor de vraag of aliasontvangers op een e-mailverificatielink moeten klikken om e-mails door te laten stromen |
| `ignore_mx_check` | Nee | Booleaanse | Of de MX-recordcontrole op het domein ter verificatie moet worden genegeerd. Dit is vooral bedoeld voor gebruikers met geavanceerde MX-exchangeconfiguratieregels die hun bestaande MX-exchange willen behouden en naar de onze willen doorsturen. |
| `retention_days` | Nee | Nummer | Een geheel getal tussen `0` en `30` dat overeenkomt met het aantal bewaardagen voor uitgaande SMTP-e-mails na succesvolle bezorging of na een permanente fout. Standaard is dit `0`, wat betekent dat uitgaande SMTP-e-mails direct worden verwijderd en geredigeerd voor uw veiligheid. |
| `bounce_webhook` | Nee | String (URL) of Booleaans (false) | De `http://` of `https://` webhook-URL van uw keuze om bounce-webhooks naartoe te sturen. We sturen een `POST`-verzoek naar deze URL met informatie over uitgaande SMTP-fouten (bijv. soft- of hard-fouten – zodat u uw abonnees kunt beheren en uw uitgaande e-mail programmatisch kunt beheren). |
| `max_quota_per_alias` | Nee | Snaar | Maximale opslagquota voor aliassen op deze domeinnaam. Voer een waarde in, bijvoorbeeld '1 GB', die door [bytes](https://github.com/visionmedia/bytes.js) wordt verwerkt. |

> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domein {#delete-domain} verwijderen

> `DELETE /v1/domains/:domain_name`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## nodigt {#invites} uit

### Accepteer domeinuitnodiging {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Maak domeinuitnodiging {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ja | String (e-mail) | E-mailadres om uit te nodigen voor de domeinledenlijst |
| `group` | Ja | String (opsombaar) | Groep waarmee de gebruiker aan het domeinlidmaatschap moet worden toegevoegd (kan `"admin"` of `"user"` zijn) |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Als de uitgenodigde gebruiker al een geaccepteerd lid is van een ander domein waarvan de beheerder die hem uitnodigt lid is, wordt de uitnodiging automatisch geaccepteerd en wordt er geen e-mail verzonden.

### Verwijder domeinuitnodiging {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ja | String (e-mail) | E-mailadres om te verwijderen uit de ledenlijst van het domein |

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Leden {#members}

### Domeinlid {#update-domain-member} bijwerken

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ja | String (opsombaar) | Groep waarmee de gebruiker moet worden bijgewerkt naar het domeinlidmaatschap (kan `"admin"` of `"user"` zijn) |

> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Verwijder domeinlid {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliassen {#aliases}

### Genereer een aliaswachtwoord {#generate-an-alias-password}

Houd er rekening mee dat als u geen instructies per e-mail verstuurt, de gebruikersnaam en het wachtwoord in de JSON-responsbody van een succesvolle aanvraag worden weergegeven in de indeling `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nee | Snaar | Uw nieuwe, aangepaste wachtwoord voor de alias. U kunt dit leeg laten of helemaal weglaten uit de body van uw API-aanvraag als u een willekeurig gegenereerd en sterk wachtwoord wilt. |
| `password` | Nee | Snaar | Bestaand wachtwoord voor de alias om het wachtwoord te kunnen wijzigen zonder de bestaande IMAP-mailboxopslag te verwijderen (zie optie `is_override` hieronder als u niet meer over het bestaande wachtwoord beschikt). |
| `is_override` | Nee | Booleaanse | **GEBRUIK VOORZICHTIG**: Hiermee worden het bestaande aliaswachtwoord en de database volledig overschreven, wordt de bestaande IMAP-opslag permanent verwijderd en wordt de SQLite-e-maildatabase van de alias volledig gereset. Maak indien mogelijk een back-up als u een bestaand e-mailaccount aan deze alias hebt gekoppeld. |
| `emailed_instructions` | Nee | Snaar | E-mailadres waarnaar het wachtwoord van de alias en installatie-instructies moeten worden verzonden. |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Domeinaliassen weergeven {#list-domain-aliases}

> \[!NOTE]
> Vanaf 1 november 2024 zijn de API-eindpunten voor [Lijstdomeinen](#list-domains) en [Domeinaliassen weergeven](#list-domain-aliases) standaard ingesteld op het maximale aantal resultaten per pagina van `1000`. Als u zich hier al eerder voor wilt aanmelden, kunt u `?paginate=true` als extra querystringparameter doorgeven aan de URL voor de eindpuntquery. Zie [Paginering](#pagination) voor meer informatie.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring-parameters | Vereist | Type | Beschrijving |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Nee | String (RegExp ondersteund) | Zoek naar aliassen in een domein op naam, label of ontvanger |
| `name` | Nee | String (RegExp ondersteund) | Zoek naar aliassen in een domein op naam |
| `recipient` | Nee | String (RegExp ondersteund) | Zoeken naar aliassen in een domein op ontvanger |
| `sort` | Nee | Snaar | Sorteren op een specifiek veld (voeg hiervoor een enkel streepje `-` toe om in de omgekeerde richting van dat veld te sorteren). Standaard is dit `created_at` als deze optie niet is ingesteld. |
| `page` | Nee | Nummer | Zie [Pagination](#pagination) voor meer inzicht |
| `limit` | Nee | Nummer | Zie [Pagination](#pagination) voor meer inzicht |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Maak een nieuwe domeinalias {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Nee | Snaar | Aliasnaam (indien niet opgegeven of leeg, wordt een willekeurige alias gegenereerd) |
| `recipients` | Nee | String of Array | Lijst met ontvangers (moet een door regeleinden/spaties/komma's gescheiden tekenreeks of matrix van geldige e-mailadressen, volledig gekwalificeerde domeinnamen ("FQDN"), IP-adressen en/of webhook-URL's zijn. Als dit niet is opgegeven of een lege matrix is, wordt het e-mailadres van de gebruiker dat de API-aanvraag indient, ingesteld als ontvanger) |
| `description` | Nee | Snaar | Aliasbeschrijving |
| `labels` | Nee | String of Array | Lijst met labels (moet een door regelovergangen/spaties/komma's gescheiden string of array zijn) |
| `has_recipient_verification` | Nee | Booleaanse | Vereist dat ontvangers op een e-mailverificatielink klikken om e-mails door te laten stromen (standaardinstelling van het domein als dit niet expliciet is ingesteld in de aanvraagtekst) |
| `is_enabled` | Nee | Booleaanse | Of deze alias moet worden in- of uitgeschakeld (indien uitgeschakeld, worden e-mails nergens naartoe geleid, maar retourneren ze wel succesvolle statuscodes). Als er een waarde wordt doorgegeven, wordt deze omgezet naar een Booleaanse waarde met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `error_code_if_disabled` | Nee | Nummer (`250`, `421` of `550`) | Inkomende e-mail naar deze alias wordt geweigerd als `is_enabled` gelijk is aan `false` met `250` (stilzwijgend nergens bezorgen, bijvoorbeeld blackhole of `/dev/null`), `421` (zachte weigering; en opnieuw proberen gedurende maximaal ~5 dagen) of `550` permanente mislukking en weigering. Standaard is dit `250`. |
| `has_imap` | Nee | Booleaanse | Of IMAP-opslag voor deze alias moet worden in- of uitgeschakeld (indien uitgeschakeld, worden binnenkomende e-mails niet opgeslagen in [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Als een waarde wordt doorgegeven, wordt deze omgezet naar een Booleaanse waarde met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Nee | Booleaanse | Of [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) voor [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) moet worden in- of uitgeschakeld met behulp van de alias `public_key`. |
| `public_key` | Nee | Snaar | Openbare OpenPGP-sleutel in ASCII Armor-formaat ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); bijvoorbeeld GPG-sleutel voor `support@forwardemail.net`). Dit is alleen van toepassing als u `has_pgp` hebt ingesteld op `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Nee | Snaar | Maximale opslagquotum voor deze alias. Laat dit leeg om het huidige maximale quotum van het domein te resetten of voer een waarde in, zoals "1 GB", die door [bytes](https://github.com/visionmedia/bytes.js) wordt verwerkt. Deze waarde kan alleen door domeinbeheerders worden aangepast. |
| `vacation_responder_is_enabled` | Nee | Booleaanse | Of een automatisch antwoord op vakantie moet worden in- of uitgeschakeld. |
| `vacation_responder_start_date` | Nee | Snaar | Begindatum voor de vakantieresponder (indien ingeschakeld en er geen begindatum is ingesteld, wordt ervan uitgegaan dat deze al is begonnen). We ondersteunen datumnotaties zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datumnotaties via slimme parsing met behulp van `dayjs`. |
| `vacation_responder_end_date` | Nee | Snaar | Einddatum voor de vakantiebeantwoorder (indien ingeschakeld en hier geen einddatum is ingesteld, wordt ervan uitgegaan dat de vakantiebeantwoorder nooit eindigt en altijd reageert). We ondersteunen datumnotaties zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datumnotaties via slimme parsing met behulp van `dayjs`. |
| `vacation_responder_subject` | Nee | Snaar | Onderwerp in platte tekst voor het afwezigheidsbericht, bijvoorbeeld "Afwezig". We gebruiken `striptags` om alle HTML hier te verwijderen. |
| `vacation_responder_message` | Nee | Snaar | Bericht in platte tekst voor de automatische beantwoorder, bijvoorbeeld: "Ik ben afwezig tot februari." We gebruiken `striptags` om alle HTML hier te verwijderen. |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Domeinalias ophalen {#retrieve-domain-alias}

U kunt een domeinalias ophalen aan de hand van de waarde `id` of `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Domeinalias {#update-domain-alias} bijwerken

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Nee | Snaar | Aliasnaam |
| `recipients` | Nee | String of Array | Lijst met ontvangers (moet een door regeleinden/spaties/komma's gescheiden tekenreeks of matrix zijn van geldige e-mailadressen, volledig gekwalificeerde domeinnamen ("FQDN"), IP-adressen en/of webhook-URL's) |
| `description` | Nee | Snaar | Aliasbeschrijving |
| `labels` | Nee | String of Array | Lijst met labels (moet een door regelovergangen/spaties/komma's gescheiden string of array zijn) |
| `has_recipient_verification` | Nee | Booleaanse | Vereist dat ontvangers op een e-mailverificatielink klikken om e-mails door te laten stromen (standaardinstelling van het domein als dit niet expliciet is ingesteld in de aanvraagtekst) |
| `is_enabled` | Nee | Booleaanse | Of deze alias moet worden in- of uitgeschakeld (indien uitgeschakeld, worden e-mails nergens naartoe geleid, maar retourneren ze wel succesvolle statuscodes). Als er een waarde wordt doorgegeven, wordt deze omgezet naar een Booleaanse waarde met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `error_code_if_disabled` | Nee | Nummer (`250`, `421` of `550`) | Inkomende e-mail naar deze alias wordt geweigerd als `is_enabled` gelijk is aan `false` met `250` (stilzwijgend nergens bezorgen, bijvoorbeeld blackhole of `/dev/null`), `421` (zachte weigering; en opnieuw proberen gedurende maximaal ~5 dagen) of `550` permanente mislukking en weigering. Standaard is dit `250`. |
| `has_imap` | Nee | Booleaanse | Of IMAP-opslag voor deze alias moet worden in- of uitgeschakeld (indien uitgeschakeld, worden binnenkomende e-mails niet opgeslagen in [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Als een waarde wordt doorgegeven, wordt deze omgezet naar een Booleaanse waarde met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Nee | Booleaanse | Of [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) voor [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) moet worden in- of uitgeschakeld met behulp van de alias `public_key`. |
| `public_key` | Nee | Snaar | Openbare OpenPGP-sleutel in ASCII Armor-formaat ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); bijvoorbeeld GPG-sleutel voor `support@forwardemail.net`). Dit is alleen van toepassing als u `has_pgp` hebt ingesteld op `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Nee | Snaar | Maximale opslagquotum voor deze alias. Laat dit leeg om het huidige maximale quotum van het domein te resetten of voer een waarde in, zoals "1 GB", die door [bytes](https://github.com/visionmedia/bytes.js) wordt verwerkt. Deze waarde kan alleen door domeinbeheerders worden aangepast. |
| `vacation_responder_is_enabled` | Nee | Booleaanse | Of een automatisch antwoord op vakantie moet worden in- of uitgeschakeld. |
| `vacation_responder_start_date` | Nee | Snaar | Begindatum voor de vakantieresponder (indien ingeschakeld en er geen begindatum is ingesteld, wordt ervan uitgegaan dat deze al is begonnen). We ondersteunen datumnotaties zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datumnotaties via slimme parsing met behulp van `dayjs`. |
| `vacation_responder_end_date` | Nee | Snaar | Einddatum voor de vakantiebeantwoorder (indien ingeschakeld en hier geen einddatum is ingesteld, wordt ervan uitgegaan dat de vakantiebeantwoorder nooit eindigt en altijd reageert). We ondersteunen datumnotaties zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datumnotaties via slimme parsing met behulp van `dayjs`. |
| `vacation_responder_subject` | Nee | Snaar | Onderwerp in platte tekst voor het afwezigheidsbericht, bijvoorbeeld "Afwezig". We gebruiken `striptags` om alle HTML hier te verwijderen. |
| `vacation_responder_message` | Nee | Snaar | Bericht in platte tekst voor de automatische beantwoorder, bijvoorbeeld: "Ik ben afwezig tot februari." We gebruiken `striptags` om alle HTML hier te verwijderen. |

> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Domeinalias {#delete-domain-alias} verwijderen

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Versleutel {#encrypt}

We bieden u de mogelijkheid om records te versleutelen, zelfs met het gratis abonnement, zonder extra kosten. Privacy zou geen feature moeten zijn, maar inherent ingebouwd in alle aspecten van een product. Zoals dringend gevraagd in een [Discussie over privacygidsen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) en op [onze GitHub-problemen](https://github.com/forwardemail/forwardemail.net/issues/254), hebben we dit toegevoegd.

### TXT-record versleutelen {#encrypt-txt-record}

> `POST /v1/encrypt`

| Lichaamsparameter | Vereist | Type | Beschrijving |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ja | Snaar | Een geldige Forward Email plaintext TXT-record |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
