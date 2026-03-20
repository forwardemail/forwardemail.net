# Email API {#email-api}


## Inhoudsopgave {#table-of-contents}

* [Bibliotheken](#libraries)
* [Basis-URI](#base-uri)
* [Authenticatie](#authentication)
  * [API Token Authenticatie (Aanbevolen voor de meeste endpoints)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias Referenties Authenticatie (Voor uitgaande e-mail)](#alias-credentials-authentication-for-outbound-email)
  * [Alias-Only Endpoints](#alias-only-endpoints)
* [Fouten](#errors)
* [Lokalisatie](#localization)
* [Paginering](#pagination)
* [Logs](#logs)
  * [Logs ophalen](#retrieve-logs)
* [Account](#account)
  * [Account aanmaken](#create-account)
  * [Account ophalen](#retrieve-account)
  * [Account bijwerken](#update-account)
* [Alias Contacten (CardDAV)](#alias-contacts-carddav)
  * [Contacten weergeven](#list-contacts)
  * [Contact aanmaken](#create-contact)
  * [Contact ophalen](#retrieve-contact)
  * [Contact bijwerken](#update-contact)
  * [Contact verwijderen](#delete-contact)
* [Alias Kalenders (CalDAV)](#alias-calendars-caldav)
  * [Kalenders weergeven](#list-calendars)
  * [Kalender aanmaken](#create-calendar)
  * [Kalender ophalen](#retrieve-calendar)
  * [Kalender bijwerken](#update-calendar)
  * [Kalender verwijderen](#delete-calendar)
* [Alias Berichten (IMAP/POP3)](#alias-messages-imappop3)
  * [Berichten weergeven en zoeken](#list-and-search-for-messages)
  * [Bericht aanmaken](#create-message)
  * [Bericht ophalen](#retrieve-message)
  * [Bericht bijwerken](#update-message)
  * [Bericht verwijderen](#delete-message)
* [Alias Mappen (IMAP/POP3)](#alias-folders-imappop3)
  * [Mappen weergeven](#list-folders)
  * [Map aanmaken](#create-folder)
  * [Map ophalen](#retrieve-folder)
  * [Map bijwerken](#update-folder)
  * [Map verwijderen](#delete-folder)
  * [Map kopiëren](#copy-folder)
* [Uitgaande E-mails](#outbound-emails)
  * [Uitgaande SMTP e-mail limiet opvragen](#get-outbound-smtp-email-limit)
  * [Uitgaande SMTP e-mails weergeven](#list-outbound-smtp-emails)
  * [Uitgaande SMTP e-mail aanmaken](#create-outbound-smtp-email)
  * [Uitgaande SMTP e-mail ophalen](#retrieve-outbound-smtp-email)
  * [Uitgaande SMTP e-mail verwijderen](#delete-outbound-smtp-email)
* [Domeinen](#domains)
  * [Domeinen weergeven](#list-domains)
  * [Domein aanmaken](#create-domain)
  * [Domein ophalen](#retrieve-domain)
  * [Domeinrecords verifiëren](#verify-domain-records)
  * [Domein SMTP-records verifiëren](#verify-domain-smtp-records)
  * [Domeinbrede catch-all wachtwoorden weergeven](#list-domain-wide-catch-all-passwords)
  * [Domeinbreed catch-all wachtwoord aanmaken](#create-domain-wide-catch-all-password)
  * [Domeinbreed catch-all wachtwoord verwijderen](#remove-domain-wide-catch-all-password)
  * [Domein bijwerken](#update-domain)
  * [Domein verwijderen](#delete-domain)
* [Uitnodigingen](#invites)
  * [Domeinuitnodiging accepteren](#accept-domain-invite)
  * [Domeinuitnodiging aanmaken](#create-domain-invite)
  * [Domeinuitnodiging verwijderen](#remove-domain-invite)
* [Leden](#members)
  * [Domeinlid bijwerken](#update-domain-member)
  * [Domeinlid verwijderen](#remove-domain-member)
* [Aliassen](#aliases)
  * [Een alias wachtwoord genereren](#generate-an-alias-password)
  * [Domeinaliassen weergeven](#list-domain-aliases)
  * [Nieuwe domeinalias aanmaken](#create-new-domain-alias)
  * [Domeinalias ophalen](#retrieve-domain-alias)
  * [Domeinalias bijwerken](#update-domain-alias)
  * [Domeinalias verwijderen](#delete-domain-alias)
* [Encryptie](#encrypt)
  * [TXT Record versleutelen](#encrypt-txt-record)


## Bibliotheken {#libraries}

Op dit moment hebben we nog geen API wrappers uitgebracht, maar we zijn van plan dit in de nabije toekomst te doen. Stuur een e-mail naar <api@forwardemail.net> als je op de hoogte gehouden wilt worden wanneer een API wrapper voor een bepaalde programmeertaal wordt uitgebracht. In de tussentijd kun je deze aanbevolen HTTP request bibliotheken gebruiken in je applicatie, of simpelweg [curl](https://stackoverflow.com/a/27442239/3586413) gebruiken zoals in de onderstaande voorbeelden.

| Taal      | Bibliotheek                                                            |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (wij zijn beheerders) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (wij zijn beheerders) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

Het huidige HTTP basis-URI-pad is: `BASE_URI`.


## Authenticatie {#authentication}

Alle eindpunten vereisen authenticatie met behulp van [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). We ondersteunen twee authenticatiemethoden:

### API Token Authenticatie (Aanbevolen voor de meeste eindpunten) {#api-token-authentication-recommended-for-most-endpoints}

Stel je [API-sleutel](https://forwardemail.net/my-account/security) in als de "gebruikersnaam" waarde met een leeg wachtwoord:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Let op de dubbele punt (`:`) na de API-token – dit geeft een leeg wachtwoord aan in Basic Auth-formaat.

### Alias Credentials Authenticatie (Voor uitgaande e-mail) {#alias-credentials-authentication-for-outbound-email}

Het [Create outbound SMTP email](#create-outbound-smtp-email) eindpunt ondersteunt ook authenticatie met je alias e-mailadres en een [gegenereerd alias wachtwoord](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Deze methode is handig bij het verzenden van e-mails vanuit applicaties die al SMTP-gegevens gebruiken en maakt de migratie van SMTP naar onze API naadloos.

### Alleen Alias Eindpunten {#alias-only-endpoints}

[Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), en [Alias Folders](#alias-folders-imappop3) eindpunten vereisen alias credentials en ondersteunen geen API token authenticatie.

Maak je geen zorgen – er zijn voorbeelden hieronder voor je als je niet zeker weet wat dit is.


## Fouten {#errors}

Als er fouten optreden, bevat de response body van het API-verzoek een gedetailleerd foutbericht.

| Code | Naam                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Ongeldig verzoek      |
| 401  | Niet geautoriseerd    |
| 403  | Verboden              |
| 404  | Niet gevonden         |
| 429  | Te veel verzoeken     |
| 500  | Interne serverfout    |
| 501  | Niet geïmplementeerd  |
| 502  | Slechte gateway       |
| 503  | Dienst niet beschikbaar |
| 504  | Gateway time-out      |

> \[!TIP]
> Als je een 5xx statuscode ontvangt (wat niet zou moeten gebeuren), neem dan contact met ons op via <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> en we helpen je direct met het oplossen van je probleem.


## Lokalisatie {#localization}

Onze dienst is vertaald in meer dan 25 verschillende talen. Alle API-responsberichten worden vertaald naar de laatst gedetecteerde locale van de gebruiker die het API-verzoek doet. Je kunt dit overschrijven door een aangepaste `Accept-Language` header mee te geven. Probeer het gerust uit met de taalkeuzelijst onderaan deze pagina.


## Paginering {#pagination}

> \[!NOTE]
> Vanaf 1 november 2024 zullen de API-eindpunten voor [List domains](#list-domains) en [List domain aliases](#list-domain-aliases) standaard `1000` maximale resultaten per pagina teruggeven. Als je deze functionaliteit eerder wilt gebruiken, kun je `?paginate=true` als extra querystring-parameter aan de URL van het eindpunt toevoegen.

Paginering wordt ondersteund door alle API-eindpunten die resultaten weergeven.

Geef eenvoudigweg de querystring-eigenschappen `page` (en optioneel `limit`) op.

De eigenschap `page` moet een getal zijn groter dan of gelijk aan `1`. Als je `limit` opgeeft (ook een getal), dan is de minimale waarde `10` en de maximale waarde `50` (tenzij anders vermeld).

| Querystring Parameter | Verplicht | Type   | Beschrijving                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nee       | Nummer | Pagina met resultaten om terug te geven. Als niet opgegeven, is de `page` waarde `1`. Moet een getal zijn groter dan of gelijk aan `1`.                   |
| `limit`               | Nee       | Nummer | Aantal resultaten per pagina om terug te geven. Standaard `10` als niet opgegeven. Moet een getal zijn groter dan of gelijk aan `1`, en kleiner dan of gelijk aan `50`. |
Om te bepalen of er meer resultaten beschikbaar zijn, bieden we deze HTTP-responsheaders aan (die je kunt parseren om programmatisch te pagineren):

| HTTP Response Header | Voorbeeld                                                                                                                                                                                                                                                | Beschrijving                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Het totale aantal beschikbare pagina's.                                                                                                                                                                                                                                                                                                                          |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | De huidige pagina met geretourneerde resultaten (bijv. gebaseerd op de `page` querystring-parameter).                                                                                                                                                                                                                                                             |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Het totale aantal resultaten op de geretourneerde pagina (bijv. gebaseerd op de `limit` querystring-parameter en de daadwerkelijk geretourneerde resultaten).                                                                                                                                                                                                     |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Het totale aantal items beschikbaar over alle pagina's.                                                                                                                                                                                                                                                                                                          |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | We bieden een `Link` HTTP-responsheader die je kunt parseren zoals getoond in het voorbeeld. Dit is [vergelijkbaar met GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (bijv. niet alle waarden worden geleverd als ze niet relevant of beschikbaar zijn, bijv. `"next"` wordt niet geleverd als er geen volgende pagina is). |
> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logs {#logs}

### Logs ophalen {#retrieve-logs}

Onze API stelt u programmatisch in staat om logs voor uw account te downloaden. Het indienen van een verzoek naar deze endpoint verwerkt alle logs voor uw account en stuurt ze u per e-mail als bijlage ([Gzip](https://en.wikipedia.org/wiki/Gzip) gecomprimeerd [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) spreadsheetbestand) zodra dit voltooid is.

Dit stelt u in staat om achtergrondtaken te maken met een [Cron job](https://en.wikipedia.org/wiki/Cron) of met onze [Node.js job scheduling software Bree](https://github.com/breejs/bree) om logs te ontvangen wanneer u dat wenst. Let op dat deze endpoint beperkt is tot `10` verzoeken per dag.

De bijlage heeft de kleine letters vorm van `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` en de e-mail zelf bevat een korte samenvatting van de opgehaalde logs. U kunt ook op elk moment logs downloaden via [Mijn Account → Logs](/my-account/logs)

> `GET /v1/logs/download`

| Querystring Parameter | Vereist | Type          | Beschrijving                                                                                                                     |
| --------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Nee     | String (FQDN) | Filter logs op volledig gekwalificeerde domeinnaam ("FQDN"). Als u dit niet opgeeft, worden alle logs van alle domeinen opgehaald. |
| `q`                   | Nee     | String        | Zoek logs op e-mail, domein, aliasnaam, IP-adres of datum (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY` of `M.D.YY` formaat).                |
| `bounce_category`     | Nee     | String        | Zoek logs op een specifieke bounce-categorie (bijv. `blocklist`).                                                                 |
| `response_code`       | Nee     | Number        | Zoek logs op een specifieke foutresponscode (bijv. `421` of `550`).                                                               |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Voorbeeld Cron job (elke dag om middernacht):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Let op dat u diensten zoals [Crontab.guru](https://crontab.guru/) kunt gebruiken om de syntax van uw cron job expressie te valideren.

> Voorbeeld Cron job (elke dag om middernacht **en met logs van de vorige dag**):

Voor MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Voor Linux en Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Account {#account}

### Account aanmaken {#create-account}

> `POST /v1/account`

| Body Parameter | Vereist | Type           | Beschrijving   |
| -------------- | ------- | -------------- | ------------- |
| `email`        | Ja      | String (Email) | E-mailadres   |
| `password`     | Ja      | String         | Wachtwoord    |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Account ophalen {#retrieve-account}

> `GET /v1/account`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Account bijwerken {#update-account}

> `PUT /v1/account`

| Body Parameter | Vereist | Type           | Beschrijving          |
| -------------- | ------- | -------------- | -------------------- |
| `email`        | Nee     | String (Email) | E-mailadres          |
| `given_name`   | Nee     | String         | Voornaam             |
| `family_name`  | Nee     | String         | Achternaam           |
| `avatar_url`   | Nee     | String (URL)   | Link naar avatarafbeelding |

> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias Contacten (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> In tegenstelling tot andere API endpoints vereisen deze [Authenticatie](#authentication) met "gebruikersnaam" gelijk aan de alias gebruikersnaam en "wachtwoord" gelijk aan het gegenereerde alias wachtwoord als Basic Authorization headers.
> \[!WARNING]
> Deze endpointsectie is een werk in uitvoering en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit het dropdownmenu "Apps" in de navigatie van onze website.

### Contacten weergeven {#list-contacts}

> `GET /v1/contacts`

**Binnenkort beschikbaar**

### Contact aanmaken {#create-contact}

> `POST /v1/contacts`

**Binnenkort beschikbaar**

### Contact ophalen {#retrieve-contact}

> `GET /v1/contacts/:id`

**Binnenkort beschikbaar**

### Contact bijwerken {#update-contact}

> `PUT /v1/contacts/:id`

**Binnenkort beschikbaar**

### Contact verwijderen {#delete-contact}

> `DELETE /v1/contacts/:id`

**Binnenkort beschikbaar**


## Alias Agenda's (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> In tegenstelling tot andere API-eindpunten vereisen deze [Authenticatie](#authentication) met "gebruikersnaam" gelijk aan de alias-gebruikersnaam en "wachtwoord" gelijk aan het alias gegenereerde wachtwoord als Basic Authorization headers.

> \[!WARNING]
> Deze endpointsectie is een werk in uitvoering en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit het dropdownmenu "Apps" in de navigatie van onze website.

### Agenda's weergeven {#list-calendars}

> `GET /v1/calendars`

**Binnenkort beschikbaar**

### Agenda aanmaken {#create-calendar}

> `POST /v1/calendars`

**Binnenkort beschikbaar**

### Agenda ophalen {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Binnenkort beschikbaar**

### Agenda bijwerken {#update-calendar}

> `PUT /v1/calendars/:id`

**Binnenkort beschikbaar**

### Agenda verwijderen {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Binnenkort beschikbaar**


## Alias Berichten (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> In tegenstelling tot andere API-eindpunten vereisen deze [Authenticatie](#authentication) met "gebruikersnaam" gelijk aan de alias-gebruikersnaam en "wachtwoord" gelijk aan het alias gegenereerde wachtwoord als Basic Authorization headers.

> \[!WARNING]
> Deze endpointsectie is een werk in uitvoering en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit het dropdownmenu "Apps" in de navigatie van onze website.

Zorg ervoor dat je de installatie-instructies voor je domein hebt gevolgd.

Deze instructies zijn te vinden in onze FAQ-sectie [Ondersteunen jullie het ontvangen van e-mail met IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Berichten weergeven en zoeken {#list-and-search-for-messages}

> `GET /v1/messages`

**Binnenkort beschikbaar**

### Bericht aanmaken {#create-message}

> \[!NOTE]
> Dit zal **GEEN** e-mail verzenden – het voegt het bericht alleen toe aan je mailboxmap (bijv. dit is vergelijkbaar met de IMAP `APPEND` opdracht). Als je een e-mail wilt verzenden, zie dan [Uitgaande SMTP e-mail aanmaken](#create-outbound-smtp-email) hieronder. Nadat je de uitgaande SMTP e-mail hebt aangemaakt, kun je een kopie ervan toevoegen met deze endpoint aan de mailbox van je alias voor opslagdoeleinden.

> `POST /v1/messages`

**Binnenkort beschikbaar**

### Bericht ophalen {#retrieve-message}

> `GET /v1/messages/:id`

**Binnenkort beschikbaar**

### Bericht bijwerken {#update-message}

> `PUT /v1/messages/:id`

**Binnenkort beschikbaar**

### Bericht verwijderen {#delete-message}

> `DELETE /v1/messages:id`

**Binnenkort beschikbaar**


## Alias Mappen (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Map-eindpunten met het pad van een map <code>/v1/folders/:path</code> als hun endpoint zijn uitwisselbaar met een map-ID <code>:id</code>. Dit betekent dat je naar de map kunt verwijzen met zowel de <code>path</code> als de <code>id</code> waarde.

> \[!WARNING]
> Deze endpointsectie is een werk in uitvoering en zal (hopelijk) in 2024 worden uitgebracht. Gebruik in de tussentijd een IMAP-client uit het dropdownmenu "Apps" in de navigatie van onze website.

### Mappen weergeven {#list-folders}

> `GET /v1/folders`

**Binnenkort beschikbaar**

### Map aanmaken {#create-folder}

> `POST /v1/folders`

**Binnenkort beschikbaar**

### Map ophalen {#retrieve-folder}

> `GET /v1/folders/:id`

**Binnenkort beschikbaar**

### Map bijwerken {#update-folder}

> `PUT /v1/folders/:id`

**Binnenkort beschikbaar**

### Map verwijderen {#delete-folder}

> `DELETE /v1/folders/:id`

**Binnenkort beschikbaar**

### Map kopiëren {#copy-folder}

> `POST /v1/folders/:id/copy`

**Binnenkort beschikbaar**


## Uitgaande E-mails {#outbound-emails}

Zorg ervoor dat je de installatie-instructies voor je domein hebt gevolgd.

Deze instructies zijn te vinden bij [Mijn Account → Domeinen → Instellingen → Uitgaande SMTP Configuratie](/my-account/domains). Je moet de setup van DKIM, Return-Path en DMARC voor het verzenden van uitgaande SMTP met je domein zekerstellen.
### Verkrijg limiet voor uitgaande SMTP e-mail {#get-outbound-smtp-email-limit}

Dit is een eenvoudige endpoint die een JSON-object retourneert met de `count` en `limit` voor het aantal dagelijkse uitgaande SMTP-berichten per account.

> `GET /v1/emails/limit`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Lijst van uitgaande SMTP e-mails {#list-outbound-smtp-emails}

Let op dat deze endpoint geen eigenschapswaarden retourneert voor de `message`, `headers` of `rejectedErrors` van een e-mail.

Om die eigenschappen en hun waarden te verkrijgen, gebruik je de [E-mail ophalen](#retrieve-email) endpoint met een e-mail-ID.

> `GET /v1/emails`

| Querystring Parameter | Vereist | Type                      | Beschrijving                                                                                                                                      |
| --------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nee     | String (RegExp ondersteund) | Zoek naar e-mails op metadata                                                                                                                    |
| `domain`              | Nee     | String (RegExp ondersteund) | Zoek naar e-mails op domeinnaam                                                                                                                  |
| `sort`                | Nee     | String                    | Sorteer op een specifiek veld (voor een omgekeerde volgorde prefix met een enkele streep `-`). Standaard `created_at` als niet ingesteld.         |
| `page`                | Nee     | Number                    | Zie [Paginering](#pagination) voor meer informatie                                                                                               |
| `limit`               | Nee     | Number                    | Zie [Paginering](#pagination) voor meer informatie                                                                                               |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Maak uitgaande SMTP e-mail aan {#create-outbound-smtp-email}

Onze API voor het aanmaken van een e-mail is geïnspireerd op en maakt gebruik van Nodemailer's message option configuratie. Raadpleeg de [Nodemailer message configuratie](https://nodemailer.com/message/) voor alle body parameters hieronder.

Let op dat we, met uitzondering van `envelope` en `dkim` (aangezien wij die automatisch voor je instellen), alle Nodemailer opties ondersteunen. We zetten automatisch de opties `disableFileAccess` en `disableUrlAccess` op `true` voor beveiligingsdoeleinden.

Je moet óf de enkele optie `raw` doorgeven met je ruwe volledige e-mail inclusief headers **of** de individuele body parameter opties hieronder.

Deze API endpoint codeert automatisch emoji's voor je als ze in de headers worden gevonden (bijv. een onderwerpregel `Subject: 🤓 Hello` wordt automatisch omgezet naar `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Ons doel was een uiterst ontwikkelaarsvriendelijke en foutbestendige e-mail API te maken.

**Authenticatie:** Deze endpoint ondersteunt zowel [API token authenticatie](#api-token-authentication-recommended-for-most-endpoints) als [alias credentials authenticatie](#alias-credentials-authentication-for-outbound-email). Zie de sectie [Authenticatie](#authentication) hierboven voor details.

> `POST /v1/emails`

| Body Parameter   | Vereist | Type             | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Nee     | String (E-mail)  | Het e-mailadres van de afzender (moet bestaan als alias van het domein).                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | Nee     | String of Array  | Komma gescheiden lijst of een Array van ontvangers voor de "To" header.                                                                                                                                                                                                                                                                                                                                                                                            |
| `cc`             | Nee     | String of Array  | Komma gescheiden lijst of een Array van ontvangers voor de "Cc" header.                                                                                                                                                                                                                                                                                                                                                                                            |
| `bcc`            | Nee     | String of Array  | Komma gescheiden lijst of een Array van ontvangers voor de "Bcc" header.                                                                                                                                                                                                                                                                                                                                                                                           |
| `subject`        | Nee     | String           | Het onderwerp van de e-mail.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `text`           | Nee     | String of Buffer | De platte tekst versie van het bericht.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `html`           | Nee     | String of Buffer | De HTML-versie van het bericht.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `attachments`    | Nee     | Array            | Een array van bijlage-objecten (zie [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                |
| `sender`         | Nee     | String           | Het e-mailadres voor de "Sender" header (zie [Nodemailer's meer geavanceerde velden](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                       |
| `replyTo`        | Nee     | String           | Het e-mailadres voor de "Reply-To" header.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `inReplyTo`      | Nee     | String           | De Message-ID waarop het bericht een antwoord is.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `references`     | Nee     | String of Array  | Spatie gescheiden lijst of een Array van Message-ID's.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `attachDataUrls` | Nee     | Boolean          | Als `true` worden `data:` afbeeldingen in de HTML-inhoud van het bericht omgezet naar ingesloten bijlagen.                                                                                                                                                                                                                                                                                                                                                       |
| `watchHtml`      | Nee     | String           | Een Apple Watch specifieke HTML-versie van het bericht ([volgens de Nodemailer docs](https://nodemailer.com/message/#content-options]), de nieuwste watches vereisen dit niet meer).                                                                                                                                                                                                                                                                                |
| `amp`            | Nee     | String           | Een AMP4EMAIL specifieke HTML-versie van het bericht (zie [Nodemailer's voorbeeld](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                 |
| `icalEvent`      | Nee     | Object           | Een iCalendar evenement om te gebruiken als alternatieve berichtinhoud (zie [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                     |
| `alternatives`   | Nee     | Array            | Een Array van alternatieve berichtinhoud (zie [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                  |
| `encoding`       | Nee     | String           | Encoding voor de tekst- en HTML-strings (standaard `"utf-8"`, maar ondersteunt ook `"hex"` en `"base64"` encoding waarden).                                                                                                                                                                                                                                                                                                                                       |
| `raw`            | Nee     | String of Buffer | Een zelf gegenereerd RFC822-geformatteerd bericht om te gebruiken (in plaats van een die door Nodemailer wordt gegenereerd – zie [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                     |
| `textEncoding`   | Nee     | String           | Encoding die verplicht wordt gebruikt voor tekstwaarden (ofwel `"quoted-printable"` of `"base64"`). De standaardwaarde is de dichtstbijzijnde gedetecteerde waarde (voor ASCII gebruik `"quoted-printable"`).                                                                                                                                                                                                                                                     |
| `priority`       | Nee     | String           | Prioriteitsniveau voor de e-mail (kan `"high"`, `"normal"` (standaard) of `"low"` zijn). Let op dat een waarde van `"normal"` geen prioriteitsheader zet (dit is het standaardgedrag). Als een waarde van `"high"` of `"low"` wordt ingesteld, worden de headers `X-Priority`, `X-MSMail-Priority` en `Importance` [overeenkomstig ingesteld](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Nee     | Object of Array  | Een Object of een Array van extra headervelden om in te stellen (zie [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                            |
| `messageId`      | Nee     | String           | Een optionele Message-ID waarde voor de "Message-ID" header (een standaardwaarde wordt automatisch aangemaakt als deze niet is ingesteld – let op dat de waarde [moet voldoen aan de RFC2822 specificatie](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                             |
| `date`           | Nee     | String of Date   | Een optionele datumwaarde die wordt gebruikt als de Date-header ontbreekt na het parsen, anders wordt de huidige UTC-string gebruikt als deze niet is ingesteld. De datumheader mag niet meer dan 30 dagen vooruit liggen ten opzichte van de huidige tijd.                                                                                                                                                                                                     |
| `list`           | Nee     | Object           | Een optioneel Object van `List-*` headers (zie [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                      |
> Voorbeeldverzoek (API-token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Voorbeeldverzoek (Alias-referenties):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Voorbeeldverzoek (Raw Email):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Ophalen uitgaande SMTP-e-mail {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Verwijderen uitgaande SMTP-e-mail {#delete-outbound-smtp-email}

Het verwijderen van e-mail zal de status instellen op `"rejected"` (en deze vervolgens niet verwerken in de wachtrij) als en alleen als de huidige status een van de volgende is: `"pending"`, `"queued"`, of `"deferred"`.  We kunnen e-mails automatisch verwijderen na 30 dagen nadat ze zijn aangemaakt en/of verzonden – daarom moet u een kopie van uitgaande SMTP-e-mails bewaren in uw client, database of applicatie.  U kunt onze e-mail-ID waarde in uw database refereren indien gewenst – deze waarde wordt teruggegeven door zowel de [Create email](#create-email) als [Retrieve email](#retrieve-email) endpoints.

> `DELETE /v1/emails/:id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domeinen {#domains}

> \[!TIP]
> Domein-endpoints met de naam van een domein <code>/v1/domains/:domain_name</code> als hun endpoint zijn uitwisselbaar met een domein-ID <code>:domain_id</code>. Dit betekent dat u naar het domein kunt verwijzen met zowel de <code>naam</code> als de <code>id</code> waarde.

### Domeinen weergeven {#list-domains}

> \[!NOTE]
> Vanaf 1 november 2024 zullen de API-endpoints voor [List domains](#list-domains) en [List domain aliases](#list-domain-aliases) standaard maximaal `1000` resultaten per pagina retourneren.  Als u deze instelling eerder wilt activeren, kunt u `?paginate=true` als extra querystring-parameter aan de URL van het endpoint toevoegen.  Zie [Pagination](#pagination) voor meer informatie.

> `GET /v1/domains`

| Querystring Parameter | Verplicht | Type                      | Beschrijving                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nee       | String (RegExp ondersteund) | Zoeken naar domeinen op naam                                                                                                                       |
| `name`                | Nee       | String (RegExp ondersteund) | Zoeken naar domeinen op naam                                                                                                                       |
| `sort`                | Nee       | String                    | Sorteren op een specifiek veld (voorvoegsel met een enkele streep `-` om in omgekeerde volgorde te sorteren).  Standaard `created_at` als niet ingesteld. |
| `page`                | Nee       | Number                    | Zie [Pagination](#pagination) voor meer informatie                                                                                                   |
| `limit`               | Nee       | Number                    | Zie [Pagination](#pagination) voor meer informatie                                                                                                   |

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Domein aanmaken {#create-domain}

> `POST /v1/domains`

| Body Parameter                 | Verplicht | Type                                          | Beschrijving                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Ja      | String (FQDN of IP)                           | Volledig gekwalificeerde domeinnaam ("FQDN") of IP-adres                                                                                                                                                                                                                                                                   |
| `team_domain`                  | Nee       | String (domein-ID of domeinnaam; FQDN)       | Wijs dit domein automatisch toe aan hetzelfde team als een ander domein.  Dit betekent dat alle leden van dit domein als teamleden worden toegewezen, en het `plan` wordt automatisch ingesteld op `team`.  U kunt dit op `"none"` zetten indien nodig om dit expliciet uit te schakelen, maar dat is niet noodzakelijk. |
| `plan`                         | Nee       | String (enumeratie)                           | Type plan (moet `"free"`, `"enhanced_protection"` of `"team"` zijn, standaard `"free"` of het huidige betaalde plan van de gebruiker als die er is)                                                                                                                                                                                   |
| `catchall`                     | Nee       | String (gescheiden e-mailadressen) of Boolean | Maak een standaard catch-all alias aan, standaard `true` (als `true` wordt het e-mailadres van de API-gebruiker als ontvanger gebruikt, en als `false` wordt er geen catch-all aangemaakt). Als een string wordt meegegeven, is dit een gescheiden lijst van e-mailadressen die als ontvangers worden gebruikt (gescheiden door regeleinde, spatie en/of komma)     |
| `has_adult_content_protection` | Nee       | Boolean                                       | Of de Spam Scanner bescherming tegen volwasseninhoud op dit domein moet worden ingeschakeld                                                                                                                                                                                                                                               |
| `has_phishing_protection`      | Nee       | Boolean                                       | Of de Spam Scanner phishingbescherming op dit domein moet worden ingeschakeld                                                                                                                                                                                                                                                    |
| `has_executable_protection`    | Nee       | Boolean                                       | Of de Spam Scanner bescherming tegen uitvoerbare bestanden op dit domein moet worden ingeschakeld                                                                                                                                                                                                                                                  |
| `has_virus_protection`         | Nee       | Boolean                                       | Of de Spam Scanner virusbescherming op dit domein moet worden ingeschakeld                                                                                                                                                                                                                                                       |
| `has_recipient_verification`   | Nee       | Boolean                                       | Globale domeinstandaard voor of aliasontvangers een e-mailverificatielink moeten aanklikken voordat e-mails worden doorgelaten                                                                                                                                                                                         |
| `ignore_mx_check`              | Nee       | Boolean                                       | Of de MX-recordcontrole op het domein voor verificatie moet worden genegeerd.  Dit is vooral voor gebruikers met geavanceerde MX-uitwisselingsregels die hun bestaande MX-uitwisseling willen behouden en doorsturen naar die van ons.                                                                                                  |
| `retention_days`               | Nee       | Number                                        | Geheel getal tussen `0` en `30` dat overeenkomt met het aantal dagen dat uitgaande SMTP-e-mails worden bewaard nadat ze succesvol zijn afgeleverd of permanent fout zijn gegaan.  Standaard `0`, wat betekent dat uitgaande SMTP-e-mails onmiddellijk worden verwijderd en geanonimiseerd voor uw veiligheid.                                       |
| `bounce_webhook`               | Nee       | String (URL) of Boolean (false)               | De `http://` of `https://` webhook-URL van uw keuze om bounce-webhooks naartoe te sturen.  We sturen een `POST`-verzoek naar deze URL met informatie over uitgaande SMTP-fouten (bijv. zachte of harde fouten – zodat u uw abonnees kunt beheren en uw uitgaande e-mail programmatisch kunt beheren).                        |
| `max_quota_per_alias`          | Nee       | String                                        | Maximale opslagquota voor aliassen op deze domeinnaam.  Voer een waarde in zoals "1 GB" die wordt geparsed door [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                        |
> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Domein ophalen {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domeinrecords verifiëren {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### SMTP-records van domein verifiëren {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Lijst met domeinbrede catch-all wachtwoorden {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domeinbreed catch-all wachtwoord aanmaken {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Verplicht | Type   | Beschrijving                                                                                                                                                                                                               |
| -------------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Nee       | String | Je eigen nieuwe wachtwoord om te gebruiken voor het domeinbrede catch-all wachtwoord.  Let op dat je dit leeg kunt laten of helemaal kunt weglaten in je API-verzoek als je een willekeurig gegenereerd en sterk wachtwoord wilt. |
| `description`  | Nee       | String | Beschrijving alleen voor organisatiedoeleinden.                                                                                                                                                                            |

> Voorbeeldverzoek:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domeinbreed catch-all wachtwoord verwijderen {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Domein bijwerken {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Verplicht | Type                            | Beschrijving                                                                                                                                                                                                                                                                                   |
| ------------------------------ | --------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | Nee       | String of Number                | Aangepaste poort om te configureren voor SMTP-forwarding (standaard is `"25"`)                                                                                                                                                                                                                |
| `has_adult_content_protection` | Nee       | Boolean                         | Of de Spam Scanner bescherming tegen volwasseninhoud op dit domein moet worden ingeschakeld                                                                                                                                                                                                  |
| `has_phishing_protection`      | Nee       | Boolean                         | Of de Spam Scanner phishingbescherming op dit domein moet worden ingeschakeld                                                                                                                                                                                                                 |
| `has_executable_protection`    | Nee       | Boolean                         | Of de Spam Scanner bescherming tegen uitvoerbare bestanden op dit domein moet worden ingeschakeld                                                                                                                                                                                            |
| `has_virus_protection`         | Nee       | Boolean                         | Of de Spam Scanner virusbescherming op dit domein moet worden ingeschakeld                                                                                                                                                                                                                    |
| `has_recipient_verification`   | Nee       | Boolean                         | Globale domeinstandaard of aliasontvangers een e-mailverificatielink moeten aanklikken om e-mails door te laten                                                                                                                                                                              |
| `ignore_mx_check`              | Nee       | Boolean                         | Of de MX-recordcontrole op het domein voor verificatie genegeerd moet worden. Dit is vooral voor gebruikers met geavanceerde MX-uitwisselingsregels die hun bestaande MX-uitwisseling willen behouden en doorsturen naar die van ons.                                                        |
| `retention_days`               | Nee       | Number                          | Geheel getal tussen `0` en `30` dat overeenkomt met het aantal dagen dat uitgaande SMTP-e-mails worden bewaard nadat ze succesvol zijn afgeleverd of permanent fout zijn gegaan. Standaard is `0`, wat betekent dat uitgaande SMTP-e-mails onmiddellijk worden verwijderd en geanonimiseerd voor jouw veiligheid. |
| `bounce_webhook`               | Nee       | String (URL) of Boolean (false) | De `http://` of `https://` webhook-URL van jouw keuze om bounce-webhooks naartoe te sturen. We sturen een `POST`-verzoek naar deze URL met informatie over uitgaande SMTP-fouten (bijv. zachte of harde fouten – zodat je je abonnees kunt beheren en je uitgaande e-mail programmatisch kunt beheren). |
| `max_quota_per_alias`          | Nee       | String                          | Maximale opslagquota voor aliassen op deze domeinnaam. Voer een waarde in zoals "1 GB" die wordt geparseerd door [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                           |
> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domein verwijderen {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Uitnodigingen {#invites}

### Domeinuitnodiging accepteren {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Voorbeeldverzoek:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Domeinuitnodiging aanmaken {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Verplicht | Type                | Beschrijving                                                                              |
| -------------- | --------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `email`        | Ja        | String (Email)      | E-mailadres om uit te nodigen voor de lijst met domeinleden                             |
| `group`        | Ja        | String (enumerable) | Groep waaraan de gebruiker wordt toegevoegd binnen het domeinlidmaatschap (kan `"admin"` of `"user"` zijn) |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Als de uitgenodigde gebruiker al een geaccepteerd lid is van een ander domein waarvan de uitnodigende beheerder ook lid is, wordt de uitnodiging automatisch geaccepteerd en wordt er geen e-mail verzonden.

### Domeinuitnodiging verwijderen {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Verplicht | Type           | Beschrijving                                     |
| -------------- | --------- | -------------- | ------------------------------------------------ |
| `email`        | Ja        | String (Email) | E-mailadres om te verwijderen uit de lijst met domeinleden |

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Leden {#members}

### Domeinlid bijwerken {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Verplicht | Type                | Beschrijving                                                                                 |
| -------------- | --------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `group`        | Ja        | String (enumerable) | Groep waaraan de gebruiker wordt bijgewerkt binnen het domeinlidmaatschap (kan `"admin"` of `"user"` zijn) |

> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Domeinlid verwijderen {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliassen {#aliases}

### Een aliaswachtwoord genereren {#generate-an-alias-password}

Let op: als je geen instructies per e-mail verstuurt, staan de gebruikersnaam en het wachtwoord in de JSON-respons van een succesvolle aanvraag in het formaat `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Verplicht | Type    | Beschrijving                                                                                                                                                                                                                                                                                         |
| ---------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Nee       | String  | Je eigen nieuwe wachtwoord om te gebruiken voor de alias. Je kunt dit leeg laten of helemaal weglaten in je API-aanvraag als je een willekeurig gegenereerd en sterk wachtwoord wilt ontvangen.                                                                                                    |
| `password`             | Nee       | String  | Bestaand wachtwoord voor de alias om het wachtwoord te wijzigen zonder de bestaande IMAP-mailboxopslag te verwijderen (zie de optie `is_override` hieronder als je het bestaande wachtwoord niet meer hebt).                                                                                         |
| `is_override`          | Nee       | Boolean | **GEBRUIK MET VOORZICHTIGHEID**: Dit overschrijft het bestaande aliaswachtwoord en de database volledig, en verwijdert permanent de bestaande IMAP-opslag en reset de SQLite e-maildatabase van de alias volledig. Maak indien mogelijk een back-up als je een bestaande mailbox aan deze alias hebt gekoppeld. |
| `emailed_instructions` | Nee       | String  | E-mailadres waarnaar het wachtwoord en de installatie-instructies van de alias worden gestuurd.                                                                                                                                                                                                    |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Lijst domeinaliases {#list-domain-aliases}

> \[!NOTE]
> Vanaf 1 november 2024 zullen de API-eindpunten voor [Lijst domeinen](#list-domains) en [Lijst domeinaliases](#list-domain-aliases) standaard `1000` maximale resultaten per pagina retourneren. Als u vroegtijdig wilt deelnemen aan dit gedrag, kunt u `?paginate=true` als extra querystring-parameter aan de URL voor de eindpuntquery toevoegen. Zie [Paginering](#pagination) voor meer informatie.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring Parameter | Vereist | Type                      | Beschrijving                                                                                                                                      |
| --------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nee     | String (RegExp ondersteund) | Zoek naar aliasen in een domein op naam, label of ontvanger                                                                                      |
| `name`                | Nee     | String (RegExp ondersteund) | Zoek naar aliasen in een domein op naam                                                                                                           |
| `recipient`           | Nee     | String (RegExp ondersteund) | Zoek naar aliasen in een domein op ontvanger                                                                                                      |
| `sort`                | Nee     | String                    | Sorteer op een specifiek veld (voorvoegsel met een enkele streep `-` om in omgekeerde richting te sorteren). Standaard `created_at` als niet ingesteld. |
| `page`                | Nee     | Number                    | Zie [Paginering](#pagination) voor meer informatie                                                                                                |
| `limit`               | Nee     | Number                    | Zie [Paginering](#pagination) voor meer informatie                                                                                                |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Nieuwe domeinalias aanmaken {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Body Parameter                  | Vereist | Type                                   | Beschrijving                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nee     | String                                 | Aliasnaam (als niet opgegeven of leeg, wordt een willekeurige alias gegenereerd)                                                                                                                                                                                                                                                                                                             |
| `recipients`                    | Nee     | String of Array                        | Lijst van ontvangers (moet een door regeleinden/spaties/komma's gescheiden string zijn of een array van geldige e-mailadressen, volledig gekwalificeerde domeinnamen ("FQDN"), IP-adressen en/of webhook-URL's – en als niet opgegeven of een lege array, wordt het e-mailadres van de gebruiker die de API-aanvraag doet als ontvanger ingesteld)                                                                                     |
| `description`                   | Nee     | String                                 | Aliasbeschrijving                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nee     | String of Array                        | Lijst van labels (moet een door regeleinden/spaties/komma's gescheiden string zijn of een array)                                                                                                                                                                                                                                                                                            |
| `has_recipient_verification`    | Nee     | Boolean                                | Vereist dat ontvangers op een e-mailverificatielink klikken voordat e-mails worden doorgestuurd (standaard de instelling van het domein als niet expliciet ingesteld in de request body)                                                                                                                                                                                                   |
| `is_enabled`                    | Nee     | Boolean                                | Of deze alias ingeschakeld of uitgeschakeld moet worden (als uitgeschakeld, worden e-mails nergens naartoe geleid maar wordt een succesvolle statuscode geretourneerd). Als een waarde wordt meegegeven, wordt deze geconverteerd naar een boolean met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                   |
| `error_code_if_disabled`        | Nee     | Number (ofwel `250`, `421`, of `550`) | Binnenkomende e-mail naar deze alias wordt geweigerd als `is_enabled` `false` is met `250` (stilletjes nergens afleveren, bv. blackhole of `/dev/null`), `421` (soft reject; en opnieuw proberen tot ~5 dagen) of `550` permanente fout en weigering. Standaard `250`.                                                                                                                       |
| `has_imap`                      | Nee     | Boolean                                | Of IMAP-opslag voor deze alias ingeschakeld of uitgeschakeld moet worden (als uitgeschakeld, worden binnenkomende e-mails niet opgeslagen in [IMAP-opslag](/blog/docs/best-quantum-safe-encrypted-email-service). Als een waarde wordt meegegeven, wordt deze geconverteerd naar een boolean met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | Nee     | Boolean                                | Of [OpenPGP-encryptie](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) voor [IMAP/POP3/CalDAV/CardDAV versleutelde e-mailopslag](/blog/docs/best-quantum-safe-encrypted-email-service) met de alias' `public_key` ingeschakeld of uitgeschakeld moet worden.                                                                                             |
| `public_key`                    | Nee     | String                                 | OpenPGP publieke sleutel in ASCII Armor-formaat ([klik hier om een voorbeeld te zien](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); bv. GPG-sleutel voor `support@forwardemail.net`). Dit geldt alleen als `has_pgp` op `true` staat. [Lees meer over end-to-end encryptie in onze FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nee     | String                                 | Maximale opslagquota voor deze alias. Laat leeg om terug te zetten naar de huidige maximale domeinquota of voer een waarde in zoals "1 GB" die wordt geparsed door [bytes](https://github.com/visionmedia/bytes.js). Deze waarde kan alleen worden aangepast door domeinbeheerders.                                                                                                      |
| `vacation_responder_is_enabled` | Nee     | Boolean                                | Of een automatische afwezigheidsassistent ingeschakeld of uitgeschakeld moet worden.                                                                                                                                                                                                                                                                                                         |
| `vacation_responder_start_date` | Nee     | String                                 | Startdatum voor de afwezigheidsassistent (als ingeschakeld en geen startdatum hier ingesteld, wordt aangenomen dat deze al gestart is). We ondersteunen datums zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datumformaten via slimme parsing met `dayjs`.                                                                                                                                       |
| `vacation_responder_end_date`   | Nee     | String                                 | Einddatum voor de afwezigheidsassistent (als ingeschakeld en geen einddatum hier ingesteld, wordt aangenomen dat deze nooit eindigt en voor altijd reageert). We ondersteunen datums zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datumformaten via slimme parsing met `dayjs`.                                                                                                               |
| `vacation_responder_subject`    | Nee     | String                                 | Onderwerp in platte tekst voor de afwezigheidsassistent, bv. "Out of Office". We gebruiken `striptags` om alle HTML te verwijderen.                                                                                                                                                                                                                                                           |
| `vacation_responder_message`    | Nee     | String                                 | Bericht in platte tekst voor de afwezigheidsassistent, bv. "I will be out of office until February.". We gebruiken `striptags` om alle HTML te verwijderen.                                                                                                                                                                                                                                   |
> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Haal domeinalias op {#retrieve-domain-alias}

Je kunt een domeinalias ophalen via de `id` of de `name` waarde.

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

### Werk domeinalias bij {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Vereist | Type                                   | Beschrijving                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------- | ------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nee     | String                                 | Aliasnaam                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Nee     | String of Array                        | Lijst van ontvangers (moet een door regeleinden/spaties/komma's gescheiden String zijn of een Array van geldige e-mailadressen, volledig gekwalificeerde domeinnamen ("FQDN"), IP-adressen en/of webhook-URL's)                                                                                                                                                                               |
| `description`                   | Nee     | String                                 | Aliasbeschrijving                                                                                                                                                                                                                                                                                                                                                                         |
| `labels`                        | Nee     | String of Array                        | Lijst van labels (moet een door regeleinden/spaties/komma's gescheiden String zijn of een Array)                                                                                                                                                                                                                                                                                           |
| `has_recipient_verification`    | Nee     | Boolean                                | Vereist dat ontvangers op een e-mailverificatielink klikken voordat e-mails worden doorgelaten (standaard wordt de instelling van het domein gebruikt als dit niet expliciet in de request body is opgegeven)                                                                                                                                                                                 |
| `is_enabled`                    | Nee     | Boolean                                | Of deze alias ingeschakeld of uitgeschakeld moet worden (als uitgeschakeld, worden e-mails nergens naartoe geleid maar wordt een succesvolle statuscode teruggegeven). Als er een waarde wordt meegegeven, wordt deze geconverteerd naar een boolean met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                 |
| `error_code_if_disabled`        | Nee     | Nummer (ofwel `250`, `421` of `550`) | Binnenkomende e-mail naar deze alias wordt geweigerd als `is_enabled` `false` is met `250` (stilletjes nergens afleveren, bijvoorbeeld blackhole of `/dev/null`), `421` (soft reject; en opnieuw proberen tot ongeveer 5 dagen) of `550` permanente fout en weigering. Standaard is `250`.                                                                                                   |
| `has_imap`                      | Nee     | Boolean                                | Of IMAP-opslag voor deze alias ingeschakeld of uitgeschakeld moet worden (als uitgeschakeld, worden binnenkomende e-mails niet opgeslagen in de [IMAP-opslag](/blog/docs/best-quantum-safe-encrypted-email-service). Als er een waarde wordt meegegeven, wordt deze geconverteerd naar een boolean met behulp van [boolean](https://github.com/thenativeweb/boolean#quick-start))                  |
| `has_pgp`                       | Nee     | Boolean                                | Of [OpenPGP-encryptie](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) voor [IMAP/POP3/CalDAV/CardDAV versleutelde e-mailopslag](/blog/docs/best-quantum-safe-encrypted-email-service) met de alias' `public_key` ingeschakeld of uitgeschakeld moet worden.                                                                                         |
| `public_key`                    | Nee     | String                                 | OpenPGP publieke sleutel in ASCII Armor-formaat ([klik hier voor een voorbeeld](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); bijvoorbeeld GPG-sleutel voor `support@forwardemail.net`). Dit geldt alleen als `has_pgp` op `true` staat. [Lees meer over end-to-end encryptie in onze FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nee     | String                                 | Maximale opslagquota voor deze alias. Laat leeg om te resetten naar de huidige maximale quota van het domein of voer een waarde in zoals "1 GB" die wordt geparseerd door [bytes](https://github.com/visionmedia/bytes.js). Deze waarde kan alleen worden aangepast door domeinbeheerders.                                                                                                   |
| `vacation_responder_is_enabled` | Nee     | Boolean                                | Of een automatische afwezigheidsassistent ingeschakeld of uitgeschakeld moet worden.                                                                                                                                                                                                                                                                                                       |
| `vacation_responder_start_date` | Nee     | String                                 | Startdatum voor de afwezigheidsassistent (als ingeschakeld en geen startdatum hier ingesteld, wordt aangenomen dat deze al gestart is). We ondersteunen datums in formaten zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datums via slimme parsing met `dayjs`.                                                                                                                                  |
| `vacation_responder_end_date`   | Nee     | String                                 | Einddatum voor de afwezigheidsassistent (als ingeschakeld en geen einddatum hier ingesteld, wordt aangenomen dat deze nooit eindigt en voor altijd reageert). We ondersteunen datums in formaten zoals `MM/DD/YYYY`, `YYYY-MM-DD` en andere datums via slimme parsing met `dayjs`.                                                                                                         |
| `vacation_responder_subject`    | Nee     | String                                 | Onderwerp in platte tekst voor de afwezigheidsassistent, bijvoorbeeld "Out of Office". We gebruiken `striptags` om alle HTML hier te verwijderen.                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | Nee     | String                                 | Bericht in platte tekst voor de afwezigheidsassistent, bijvoorbeeld "I will be out of office until February.". We gebruiken `striptags` om alle HTML hier te verwijderen.                                                                                                                                                                                                                   |
> Voorbeeldverzoek:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Verwijder domeinalias {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Voorbeeldverzoek:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Versleutel {#encrypt}

We staan toe dat je records versleutelt, zelfs op het gratis abonnement zonder kosten. Privacy zou geen functie moeten zijn, het zou inherent ingebouwd moeten zijn in alle aspecten van een product. Zoals veel gevraagd in een [Privacy Guides discussie](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) en op [onze GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) hebben we dit toegevoegd.

### Versleutel TXT-record {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Vereist | Type   | Beschrijving                                  |
| -------------- | ------- | ------ | --------------------------------------------- |
| `input`        | Ja      | String | Elke geldige Forward Email platte tekst TXT-record |

> Voorbeeldverzoek:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
