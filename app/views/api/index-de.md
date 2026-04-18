# Email-API {#email-api}


## Inhaltsverzeichnis {#table-of-contents}

* [Bibliotheken](#libraries)
* [Basis-URI](#base-uri)
* [Authentifizierung](#authentication)
  * [API-Token-Authentifizierung (Empfohlen für die meisten Endpunkte)](#api-token-authentication-recommended-for-most-endpoints)
  * [Alias-Anmeldeinformationen Authentifizierung (Für ausgehende E-Mails)](#alias-credentials-authentication-for-outbound-email)
  * [Nur Alias-Endpunkte](#alias-only-endpoints)
* [Fehler](#errors)
* [Lokalisierung](#localization)
* [Paginierung](#pagination)
* [Protokolle](#logs)
  * [Protokolle abrufen](#retrieve-logs)
* [Konto](#account)
  * [Konto erstellen](#create-account)
  * [Konto abrufen](#retrieve-account)
  * [Konto aktualisieren](#update-account)
* [Alias-Kontakte (CardDAV)](#alias-contacts-carddav)
  * [Kontakte auflisten](#list-contacts)
  * [Kontakt erstellen](#create-contact)
  * [Kontakt abrufen](#retrieve-contact)
  * [Kontakt aktualisieren](#update-contact)
  * [Kontakt löschen](#delete-contact)
* [Alias-Kalender (CalDAV)](#alias-calendars-caldav)
  * [Kalender auflisten](#list-calendars)
  * [Kalender erstellen](#create-calendar)
  * [Kalender abrufen](#retrieve-calendar)
  * [Kalender aktualisieren](#update-calendar)
  * [Kalender löschen](#delete-calendar)
* [Alias-Nachrichten (IMAP/POP3)](#alias-messages-imappop3)
  * [Nachrichten auflisten und durchsuchen](#list-and-search-for-messages)
  * [Nachricht erstellen](#create-message)
  * [Nachricht abrufen](#retrieve-message)
  * [Nachricht aktualisieren](#update-message)
  * [Nachricht löschen](#delete-message)
* [Alias-Ordner (IMAP/POP3)](#alias-folders-imappop3)
  * [Ordner auflisten](#list-folders)
  * [Ordner erstellen](#create-folder)
  * [Ordner abrufen](#retrieve-folder)
  * [Ordner aktualisieren](#update-folder)
  * [Ordner löschen](#delete-folder)
  * [Ordner kopieren](#copy-folder)
* [Ausgehende E-Mails](#outbound-emails)
  * [SMTP-Ausgangs-E-Mail-Limit abrufen](#get-outbound-smtp-email-limit)
  * [SMTP-Ausgangs-E-Mails auflisten](#list-outbound-smtp-emails)
  * [SMTP-Ausgangs-E-Mail erstellen](#create-outbound-smtp-email)
  * [SMTP-Ausgangs-E-Mail abrufen](#retrieve-outbound-smtp-email)
  * [SMTP-Ausgangs-E-Mail löschen](#delete-outbound-smtp-email)
* [Domains](#domains)
  * [Domains auflisten](#list-domains)
  * [Domain erstellen](#create-domain)
  * [Domain abrufen](#retrieve-domain)
  * [Domain-Datensätze verifizieren](#verify-domain-records)
  * [Domain SMTP-Datensätze verifizieren](#verify-domain-smtp-records)
  * [Domainweite Catch-All-Passwörter auflisten](#list-domain-wide-catch-all-passwords)
  * [Domainweites Catch-All-Passwort erstellen](#create-domain-wide-catch-all-password)
  * [Domainweites Catch-All-Passwort entfernen](#remove-domain-wide-catch-all-password)
  * [Domain aktualisieren](#update-domain)
  * [Domain löschen](#delete-domain)
* [Einladungen](#invites)
  * [Domain-Einladung annehmen](#accept-domain-invite)
  * [Domain-Einladung erstellen](#create-domain-invite)
  * [Domain-Einladung entfernen](#remove-domain-invite)
* [Mitglieder](#members)
  * [Domain-Mitglied aktualisieren](#update-domain-member)
  * [Domain-Mitglied entfernen](#remove-domain-member)
* [Aliase](#aliases)
  * [Alias-Passwort generieren](#generate-an-alias-password)
  * [Domain-Aliase auflisten](#list-domain-aliases)
  * [Neuen Domain-Alias erstellen](#create-new-domain-alias)
  * [Domain-Alias abrufen](#retrieve-domain-alias)
  * [Domain-Alias aktualisieren](#update-domain-alias)
  * [Domain-Alias löschen](#delete-domain-alias)
* [Verschlüsseln](#encrypt)
  * [TXT-Datensatz verschlüsseln](#encrypt-txt-record)


## Bibliotheken {#libraries}

Derzeit haben wir noch keine API-Wrapper veröffentlicht, planen dies aber in naher Zukunft zu tun. Senden Sie eine E-Mail an <api@forwardemail.net>, wenn Sie benachrichtigt werden möchten, sobald ein API-Wrapper für eine bestimmte Programmiersprache veröffentlicht wird. In der Zwischenzeit können Sie diese empfohlenen HTTP-Anfragebibliotheken in Ihrer Anwendung verwenden oder einfach [curl](https://stackoverflow.com/a/27442239/3586413) wie in den folgenden Beispielen nutzen.

| Sprache   | Bibliothek                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (wir sind Maintainer) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (wir sind Maintainer) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Basis-URI {#base-uri}

Der aktuelle HTTP-Basis-URI-Pfad ist: `BASE_URI`.


## Authentifizierung {#authentication}

Alle Endpunkte erfordern eine Authentifizierung mittels [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Wir unterstützen zwei Authentifizierungsmethoden:

### API-Token-Authentifizierung (Empfohlen für die meisten Endpunkte) {#api-token-authentication-recommended-for-most-endpoints}

Setzen Sie Ihren [API-Schlüssel](https://forwardemail.net/my-account/security) als "Benutzername" mit einem leeren Passwort:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Beachten Sie den Doppelpunkt (`:`) nach dem API-Token – dieser zeigt ein leeres Passwort im Basic-Auth-Format an.

### Alias-Anmeldeinformationen Authentifizierung (Für ausgehende E-Mails) {#alias-credentials-authentication-for-outbound-email}

Der Endpunkt [Create outbound SMTP email](#create-outbound-smtp-email) unterstützt auch die Authentifizierung mit Ihrer Alias-E-Mail-Adresse und einem [generierten Alias-Passwort](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Diese Methode ist nützlich, wenn E-Mails von Anwendungen gesendet werden, die bereits SMTP-Anmeldeinformationen verwenden, und macht die Migration von SMTP zu unserer API nahtlos.

### Nur Alias-Endpunkte {#alias-only-endpoints}

Die Endpunkte [Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3) und [Alias Folders](#alias-folders-imappop3) erfordern Alias-Anmeldeinformationen und unterstützen keine API-Token-Authentifizierung.

Keine Sorge – Beispiele werden unten bereitgestellt, falls Sie nicht sicher sind, was das ist.


## Fehler {#errors}

Wenn Fehler auftreten, enthält der Antwortkörper der API-Anfrage eine detaillierte Fehlermeldung.

| Code | Name                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Ungültige Anfrage     |
| 401  | Nicht autorisiert     |
| 403  | Verboten              |
| 404  | Nicht gefunden        |
| 429  | Zu viele Anfragen     |
| 500  | Interner Serverfehler |
| 501  | Nicht implementiert   |
| 502  | Fehlerhaftes Gateway  |
| 503  | Dienst nicht verfügbar|
| 504  | Gateway-Zeitüberschreitung |

> \[!TIP]
> Wenn Sie einen 5xx-Statuscode erhalten (was nicht passieren sollte), kontaktieren Sie uns bitte unter <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> und wir helfen Ihnen, Ihr Problem sofort zu lösen.


## Lokalisierung {#localization}

Unser Dienst ist in über 25 verschiedene Sprachen übersetzt. Alle API-Antwortnachrichten werden in die zuletzt erkannte Sprache des Benutzers übersetzt, der die API-Anfrage stellt. Sie können dies überschreiben, indem Sie einen benutzerdefinierten `Accept-Language`-Header übergeben. Probieren Sie es gerne mit dem Sprach-Dropdown unten auf dieser Seite aus.


## Paginierung {#pagination}

> \[!NOTE]
> Ab dem 1. November 2024 werden die API-Endpunkte für [List domains](#list-domains) und [List domain aliases](#list-domain-aliases) standardmäßig `1000` maximale Ergebnisse pro Seite zurückgeben. Wenn Sie dieses Verhalten frühzeitig aktivieren möchten, können Sie `?paginate=true` als zusätzlichen Querystring-Parameter an die URL des Endpunkt-Queries anhängen.

Paginierung wird von allen API-Endpunkten unterstützt, die Ergebnisse auflisten.

Geben Sie einfach die Querystring-Eigenschaften `page` (und optional `limit`) an.

Die Eigenschaft `page` sollte eine Zahl größer oder gleich `1` sein. Wenn Sie `limit` angeben (ebenfalls eine Zahl), liegt der Mindestwert bei `10` und der Höchstwert bei `50` (sofern nicht anders angegeben).

| Querystring-Parameter | Erforderlich | Typ    | Beschreibung                                                                                                                                               |
| --------------------- | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nein        | Zahl   | Seite der zurückzugebenden Ergebnisse. Wenn nicht angegeben, ist der Wert von `page` `1`. Muss eine Zahl größer oder gleich `1` sein.                     |
| `limit`               | Nein        | Zahl   | Anzahl der Ergebnisse pro Seite. Standardmäßig `10`, wenn nicht angegeben. Muss eine Zahl größer oder gleich `1` und kleiner oder gleich `50` sein.       |
Um festzustellen, ob weitere Ergebnisse verfügbar sind, stellen wir diese HTTP-Antwortheader bereit (die Sie zum programmgesteuerten Paginieren parsen können):

| HTTP Response Header | Beispiel                                                                                                                                                                                                                                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Die insgesamt verfügbare Seitenanzahl.                                                                                                                                                                                                                                                                                                                            |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Die aktuell zurückgegebene Ergebnisseite (z. B. basierend auf dem `page` Querystring-Parameter).                                                                                                                                                                                                                                                                    |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Die Gesamtanzahl der Ergebnisse auf der zurückgegebenen Seite (z. B. basierend auf dem `limit` Querystring-Parameter und den tatsächlich zurückgegebenen Ergebnissen).                                                                                                                                                                                             |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Die Gesamtanzahl der verfügbaren Elemente über alle Seiten hinweg.                                                                                                                                                                                                                                                                                                |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Wir stellen einen `Link` HTTP-Antwortheader bereit, den Sie wie im Beispiel gezeigt parsen können. Dies ist [ähnlich wie bei GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (z. B. werden nicht alle Werte bereitgestellt, wenn sie nicht relevant oder verfügbar sind, z. B. wird `"next"` nicht bereitgestellt, wenn keine weitere Seite existiert). |
> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Protokolle {#logs}

### Protokolle abrufen {#retrieve-logs}

Unsere API ermöglicht es Ihnen programmatisch, Protokolle für Ihr Konto herunterzuladen. Eine Anfrage an diesen Endpunkt verarbeitet alle Protokolle für Ihr Konto und sendet sie Ihnen als Anhang (eine [Gzip](https://de.wikipedia.org/wiki/Gzip)-komprimierte [CSV](https://de.wikipedia.org/wiki/Comma-separated_values)-Tabellendatei) per E-Mail, sobald der Vorgang abgeschlossen ist.

Dies ermöglicht es Ihnen, Hintergrundaufgaben mit einem [Cron-Job](https://de.wikipedia.org/wiki/Cron) oder mit unserer [Node.js-Jobplanungssoftware Bree](https://github.com/breejs/bree) zu erstellen, um Protokolle jederzeit zu erhalten. Beachten Sie, dass dieser Endpunkt auf `10` Anfragen pro Tag begrenzt ist.

Der Anhang trägt den Kleinbuchstaben-Form von `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` und die E-Mail selbst enthält eine kurze Zusammenfassung der abgerufenen Protokolle. Sie können Protokolle auch jederzeit unter [Mein Konto → Protokolle](/my-account/logs) herunterladen.

> `GET /v1/logs/download`

| Querystring-Parameter | Erforderlich | Typ           | Beschreibung                                                                                                                     |
| --------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Nein        | String (FQDN) | Filtert Protokolle nach vollständig qualifiziertem Domainnamen ("FQDN"). Wenn Sie diesen Parameter nicht angeben, werden alle Protokolle aller Domains abgerufen. |
| `q`                   | Nein        | String        | Suche in Protokollen nach E-Mail, Domain, Aliasnamen, IP-Adresse oder Datum (Formate `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` oder `M.D.YY`).       |
| `bounce_category`     | Nein        | String        | Suche in Protokollen nach einer bestimmten Bounce-Kategorie (z.B. `blocklist`).                                                               |
| `response_code`       | Nein        | Zahl          | Suche in Protokollen nach einem bestimmten Fehler-Antwortcode (z.B. `421` oder `550`).                                                        |

> Beispielanfrage:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Beispiel Cron-Job (täglich um Mitternacht):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Beachten Sie, dass Sie Dienste wie [Crontab.guru](https://crontab.guru/) verwenden können, um die Syntax Ihres Cron-Job-Ausdrucks zu validieren.

> Beispiel Cron-Job (täglich um Mitternacht **und mit Protokollen des Vortages**):

Für MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Für Linux und Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Konto {#account}

### Konto erstellen {#create-account}

> `POST /v1/account`

| Body-Parameter | Erforderlich | Typ            | Beschreibung   |
| -------------- | ----------- | -------------- | ------------- |
| `email`        | Ja          | String (Email) | E-Mail-Adresse |
| `password`     | Ja          | String         | Passwort      |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Konto abrufen {#retrieve-account}

> `GET /v1/account`

> Beispielanfrage:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Konto aktualisieren {#update-account}

> `PUT /v1/account`

| Body-Parameter | Erforderlich | Typ            | Beschreibung          |
| -------------- | ----------- | -------------- | -------------------- |
| `email`        | Nein        | String (Email) | E-Mail-Adresse        |
| `given_name`   | Nein        | String         | Vorname               |
| `family_name`  | Nein        | String         | Nachname              |
| `avatar_url`   | Nein        | String (URL)   | Link zum Avatarbild   |

> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias-Kontakte (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Im Gegensatz zu anderen API-Endpunkten erfordern diese [Authentifizierung](#authentication) mit dem "Benutzernamen" gleich dem Alias-Benutzernamen und dem "Passwort" gleich dem vom Alias generierten Passwort als Basic-Authorization-Header.
> \[!WARNING]
> Dieser Endpunktabschnitt ist noch in Arbeit und wird (hoffentlich) im Jahr 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü "Apps" in der Navigation unserer Website.

### Kontakte auflisten {#list-contacts}

> `GET /v1/contacts`

**Demnächst verfügbar**

### Kontakt erstellen {#create-contact}

> `POST /v1/contacts`

**Demnächst verfügbar**

### Kontakt abrufen {#retrieve-contact}

> `GET /v1/contacts/:id`

**Demnächst verfügbar**

### Kontakt aktualisieren {#update-contact}

> `PUT /v1/contacts/:id`

**Demnächst verfügbar**

### Kontakt löschen {#delete-contact}

> `DELETE /v1/contacts/:id`

**Demnächst verfügbar**


## Alias-Kalender (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Im Gegensatz zu anderen API-Endpunkten erfordern diese [Authentifizierung](#authentication) mit "Benutzername" gleich dem Alias-Benutzernamen und "Passwort" gleich dem vom Alias generierten Passwort als Basic-Authorization-Header.

> \[!WARNING]
> Dieser Endpunktabschnitt ist noch in Arbeit und wird (hoffentlich) im Jahr 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü "Apps" in der Navigation unserer Website.

### Kalender auflisten {#list-calendars}

> `GET /v1/calendars`

**Demnächst verfügbar**

### Kalender erstellen {#create-calendar}

> `POST /v1/calendars`

**Demnächst verfügbar**

### Kalender abrufen {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Demnächst verfügbar**

### Kalender aktualisieren {#update-calendar}

> `PUT /v1/calendars/:id`

**Demnächst verfügbar**

### Kalender löschen {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Demnächst verfügbar**


## Alias-Nachrichten (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Im Gegensatz zu anderen API-Endpunkten erfordern diese [Authentifizierung](#authentication) mit "Benutzername" gleich dem Alias-Benutzernamen und "Passwort" gleich dem vom Alias generierten Passwort als Basic-Authorization-Header.

> \[!WARNING]
> Dieser Endpunktabschnitt ist noch in Arbeit und wird (hoffentlich) im Jahr 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü "Apps" in der Navigation unserer Website.

Bitte stellen Sie sicher, dass Sie die Einrichtungshinweise für Ihre Domain befolgt haben.

Diese Anweisungen finden Sie in unserem FAQ-Bereich [Unterstützen Sie den Empfang von E-Mails mit IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Nachrichten auflisten und durchsuchen {#list-and-search-for-messages}

> `GET /v1/messages`

**Demnächst verfügbar**

### Nachricht erstellen {#create-message}

> \[!NOTE]
> Dies wird **KEINE** E-Mail senden – es wird lediglich die Nachricht zu Ihrem Postfachordner hinzufügen (z. B. ähnlich dem IMAP-Befehl `APPEND`). Wenn Sie eine E-Mail senden möchten, siehe [Ausgehende SMTP-E-Mail erstellen](#create-outbound-smtp-email) weiter unten. Nach dem Erstellen der ausgehenden SMTP-E-Mail können Sie eine Kopie davon mit diesem Endpunkt zu Ihrem Alias-Postfach hinzufügen, um sie zu speichern.

> `POST /v1/messages`

**Demnächst verfügbar**

### Nachricht abrufen {#retrieve-message}

> `GET /v1/messages/:id`

**Demnächst verfügbar**

### Nachricht aktualisieren {#update-message}

> `PUT /v1/messages/:id`

**Demnächst verfügbar**

### Nachricht löschen {#delete-message}

> `DELETE /v1/messages:id`

**Demnächst verfügbar**


## Alias-Ordner (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Ordner-Endpunkte mit dem Pfad eines Ordners <code>/v1/folders/:path</code> als Endpunkt sind austauschbar mit der ID eines Ordners <code>:id</code>. Das bedeutet, Sie können auf den Ordner entweder über seinen <code>Pfad</code> oder <code>id</code>-Wert verweisen.

> \[!WARNING]
> Dieser Endpunktabschnitt ist noch in Arbeit und wird (hoffentlich) im Jahr 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü "Apps" in der Navigation unserer Website.

### Ordner auflisten {#list-folders}

> `GET /v1/folders`

**Demnächst verfügbar**

### Ordner erstellen {#create-folder}

> `POST /v1/folders`

**Demnächst verfügbar**

### Ordner abrufen {#retrieve-folder}

> `GET /v1/folders/:id`

**Demnächst verfügbar**

### Ordner aktualisieren {#update-folder}

> `PUT /v1/folders/:id`

**Demnächst verfügbar**

### Ordner löschen {#delete-folder}

> `DELETE /v1/folders/:id`

**Demnächst verfügbar**

### Ordner kopieren {#copy-folder}

> `POST /v1/folders/:id/copy`

**Demnächst verfügbar**


## Ausgehende E-Mails {#outbound-emails}

Bitte stellen Sie sicher, dass Sie die Einrichtungshinweise für Ihre Domain befolgt haben.

Diese Anweisungen finden Sie unter [Mein Konto → Domains → Einstellungen → Ausgehende SMTP-Konfiguration](/my-account/domains). Sie müssen die Einrichtung von DKIM, Return-Path und DMARC für das Senden von ausgehenden SMTP-E-Mails mit Ihrer Domain sicherstellen.
### Abrufen des Limits für ausgehende SMTP-E-Mails {#get-outbound-smtp-email-limit}

Dies ist ein einfacher Endpunkt, der ein JSON-Objekt mit der `count` und dem `limit` für die Anzahl der täglichen ausgehenden SMTP-Nachrichten pro Konto zurückgibt.

> `GET /v1/emails/limit`

> Beispielanfrage:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Auflisten ausgehender SMTP-E-Mails {#list-outbound-smtp-emails}

Beachten Sie, dass dieser Endpunkt keine Eigenschaftswerte für die `message`, `headers` oder `rejectedErrors` einer E-Mail zurückgibt.

Um diese Eigenschaften und ihre Werte zurückzugeben, verwenden Sie bitte den [E-Mail abrufen](#retrieve-email)-Endpunkt mit einer E-Mail-ID.

> `GET /v1/emails`

| Querystring-Parameter | Erforderlich | Typ                      | Beschreibung                                                                                                                                      |
| --------------------- | ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nein        | String (RegExp unterstützt) | Suche nach E-Mails anhand von Metadaten                                                                                                          |
| `domain`              | Nein        | String (RegExp unterstützt) | Suche nach E-Mails anhand des Domainnamens                                                                                                       |
| `sort`                | Nein        | String                   | Sortieren nach einem bestimmten Feld (mit einem einzelnen Bindestrich `-` vorangestellt, um in umgekehrter Reihenfolge zu sortieren). Standardmäßig `created_at`, falls nicht gesetzt. |
| `page`                | Nein        | Zahl                     | Siehe [Pagination](#pagination) für weitere Informationen                                                                                        |
| `limit`               | Nein        | Zahl                     | Siehe [Pagination](#pagination) für weitere Informationen                                                                                        |

> Beispielanfrage:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Erstellen einer ausgehenden SMTP-E-Mail {#create-outbound-smtp-email}

Unsere API zum Erstellen einer E-Mail ist inspiriert von und nutzt die Nachrichtenoptionen-Konfiguration von Nodemailer. Bitte beachten Sie die [Nodemailer Nachrichtenkonfiguration](https://nodemailer.com/message/) für alle untenstehenden Body-Parameter.

Beachten Sie, dass wir mit Ausnahme von `envelope` und `dkim` (da wir diese automatisch für Sie setzen) alle Nodemailer-Optionen unterstützen. Aus Sicherheitsgründen setzen wir automatisch die Optionen `disableFileAccess` und `disableUrlAccess` auf `true`.

Sie sollten entweder die einzelne Option `raw` mit Ihrer rohen vollständigen E-Mail inklusive Header übergeben **oder** die einzelnen Body-Parameter-Optionen unten angeben.

Dieser API-Endpunkt kodiert Emojis automatisch für Sie, wenn sie in den Headern gefunden werden (z. B. wird eine Betreffzeile `Subject: 🤓 Hello` automatisch in `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` umgewandelt). Unser Ziel war es, eine extrem entwicklerfreundliche und narrensichere E-Mail-API zu schaffen.

**Authentifizierung:** Dieser Endpunkt unterstützt sowohl die [API-Token-Authentifizierung](#api-token-authentication-recommended-for-most-endpoints) als auch die [Alias-Anmeldeinformationen-Authentifizierung](#alias-credentials-authentication-for-outbound-email). Details finden Sie im Abschnitt [Authentifizierung](#authentication) oben.

> `POST /v1/emails`

| Body-Parameter   | Erforderlich | Typ             | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | Nein         | String (E-Mail) | Die E-Mail-Adresse des Absenders (muss als Alias der Domain existieren).                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | Nein         | String oder Array | Kommagetrennte Liste oder ein Array von Empfängern für den "To"-Header.                                                                                                                                                                                                                                                                                                                                                                                            |
| `cc`             | Nein         | String oder Array | Kommagetrennte Liste oder ein Array von Empfängern für den "Cc"-Header.                                                                                                                                                                                                                                                                                                                                                                                            |
| `bcc`            | Nein         | String oder Array | Kommagetrennte Liste oder ein Array von Empfängern für den "Bcc"-Header.                                                                                                                                                                                                                                                                                                                                                                                           |
| `subject`        | Nein         | String          | Der Betreff der E-Mail.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `text`           | Nein         | String oder Buffer | Die Klartextversion der Nachricht.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `html`           | Nein         | String oder Buffer | Die HTML-Version der Nachricht.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `attachments`    | Nein         | Array           | Ein Array von Anhang-Objekten (siehe [Nodemailers gemeinsame Felder](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                              |
| `sender`         | Nein         | String          | Die E-Mail-Adresse für den "Sender"-Header (siehe [Nodemailers erweiterte Felder](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                         |
| `replyTo`        | Nein         | String          | Die E-Mail-Adresse für den "Reply-To"-Header.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `inReplyTo`      | Nein         | String          | Die Message-ID, auf die die Nachricht antwortet.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `references`     | Nein         | String oder Array | Leerzeichen-getrennte Liste oder ein Array von Message-IDs.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `attachDataUrls` | Nein         | Boolean         | Wenn `true`, werden `data:`-Bilder im HTML-Inhalt der Nachricht in eingebettete Anhänge umgewandelt.                                                                                                                                                                                                                                                                                                                                                               |
| `watchHtml`      | Nein         | String          | Eine Apple Watch-spezifische HTML-Version der Nachricht ([laut Nodemailer-Dokumentation](https://nodemailer.com/message/#content-options]), die neuesten Watches benötigen dies nicht mehr.                                                                                                                                                                                                                                                                          |
| `amp`            | Nein         | String          | Eine AMP4EMAIL-spezifische HTML-Version der Nachricht (siehe [Nodemailers Beispiel](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                 |
| `icalEvent`      | Nein         | Objekt          | Ein iCalendar-Ereignis, das als alternativer Nachrichteninhalt verwendet wird (siehe [Nodemailers Kalenderereignisse](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                           |
| `alternatives`   | Nein         | Array           | Ein Array alternativer Nachrichteninhalte (siehe [Nodemailers alternative Inhalte](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                |
| `encoding`       | Nein         | String          | Kodierung für die Text- und HTML-Strings (Standard ist `"utf-8"`, unterstützt aber auch `"hex"` und `"base64"`).                                                                                                                                                                                                                                                                                                                                                   |
| `raw`            | Nein         | String oder Buffer | Eine benutzerdefinierte, RFC822-formatierte Nachricht zur Verwendung (anstatt einer von Nodemailer generierten – siehe [Nodemailers benutzerdefinierte Quelle](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                     |
| `textEncoding`   | Nein         | String          | Die für Textwerte erzwungene Kodierung (entweder `"quoted-printable"` oder `"base64"`). Der Standardwert ist der am besten erkannte Wert (für ASCII verwenden Sie `"quoted-printable"`).                                                                                                                                                                                                                                                                         |
| `priority`       | Nein         | String          | Prioritätsstufe für die E-Mail (kann `"high"`, `"normal"` (Standard) oder `"low"` sein). Beachten Sie, dass ein Wert von `"normal"` keinen Prioritätsheader setzt (dies ist das Standardverhalten). Wenn `"high"` oder `"low"` gesetzt wird, werden die Header `X-Priority`, `X-MSMail-Priority` und `Importance` [entsprechend gesetzt](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | Nein         | Objekt oder Array | Ein Objekt oder ein Array zusätzlicher Header-Felder zum Setzen (siehe [Nodemailers benutzerdefinierte Header](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                  |
| `messageId`      | Nein         | String          | Ein optionaler Message-ID-Wert für den "Message-ID"-Header (ein Standardwert wird automatisch erstellt, falls nicht gesetzt – beachten Sie, dass der Wert [der RFC2822-Spezifikation entsprechen sollte](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                   |
| `date`           | Nein         | String oder Datum | Ein optionaler Datumswert, der verwendet wird, wenn der Date-Header nach dem Parsen fehlt, andernfalls wird die aktuelle UTC-Zeit verwendet, falls nicht gesetzt. Der Date-Header darf nicht mehr als 30 Tage in der Zukunft liegen.                                                                                                                                                                                                                             |
| `list`           | Nein         | Objekt          | Ein optionales Objekt von `List-*`-Headern (siehe [Nodemailers List-Header](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                        |
> Beispielanfrage (API-Token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Beispielanfrage (Alias-Zugangsdaten):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Beispielanfrage (Roh-E-Mail):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Abrufen ausgehender SMTP-E-Mails {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Beispielanfrage:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Löschen ausgehender SMTP-E-Mails {#delete-outbound-smtp-email}

Das Löschen einer E-Mail setzt den Status auf `"rejected"` (und verarbeitet sie anschließend nicht mehr in der Warteschlange), wenn und nur wenn der aktuelle Status einer der folgenden ist: `"pending"`, `"queued"` oder `"deferred"`. Wir können E-Mails automatisch 30 Tage nach ihrer Erstellung und/oder dem Versand löschen – daher sollten Sie eine Kopie ausgehender SMTP-E-Mails in Ihrem Client, Ihrer Datenbank oder Anwendung aufbewahren. Sie können unseren E-Mail-ID-Wert in Ihrer Datenbank referenzieren, falls gewünscht – dieser Wert wird sowohl von den Endpunkten [E-Mail erstellen](#create-email) als auch [E-Mail abrufen](#retrieve-email) zurückgegeben.

> `DELETE /v1/emails/:id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domains {#domains}

> \[!TIP]
> Domain-Endpunkte mit dem Domainnamen <code>/v1/domains/:domain_name</code> als Endpunkt sind austauschbar mit der Domain-ID <code>:domain_id</code>. Das bedeutet, Sie können sich entweder auf den <code>name</code> oder den <code>id</code>-Wert der Domain beziehen.

### Domains auflisten {#list-domains}

> \[!NOTE]
> Ab dem 1. November 2024 werden die API-Endpunkte für [Domains auflisten](#list-domains) und [Domain-Aliase auflisten](#list-domain-aliases) standardmäßig auf `1000` maximale Ergebnisse pro Seite begrenzt sein. Wenn Sie dieses Verhalten frühzeitig aktivieren möchten, können Sie `?paginate=true` als zusätzlichen Querystring-Parameter an die URL der Endpunktabfrage anhängen. Siehe [Pagination](#pagination) für weitere Informationen.

> `GET /v1/domains`

| Querystring-Parameter | Erforderlich | Typ                      | Beschreibung                                                                                                                                      |
| --------------------- | ----------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Nein        | String (RegExp unterstützt) | Suche nach Domains anhand des Namens                                                                                                             |
| `name`                | Nein        | String (RegExp unterstützt) | Suche nach Domains anhand des Namens                                                                                                             |
| `sort`                | Nein        | String                   | Sortierung nach einem bestimmten Feld (mit einem vorangestellten Bindestrich `-` wird in umgekehrter Reihenfolge sortiert). Standard ist `created_at`, falls nicht gesetzt. |
| `page`                | Nein        | Zahl                     | Siehe [Pagination](#pagination) für weitere Informationen                                                                                        |
| `limit`               | Nein        | Zahl                     | Siehe [Pagination](#pagination) für weitere Informationen                                                                                        |

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Domain erstellen {#create-domain}

> `POST /v1/domains`

| Body-Parameter                 | Erforderlich | Typ                                          | Beschreibung                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | ------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Ja           | String (FQDN oder IP)                         | Vollqualifizierter Domainname ("FQDN") oder IP-Adresse                                                                                                                                                                                                                                                                   |
| `team_domain`                  | Nein         | String (Domain-ID oder Domainname; FQDN)     | Weist diese Domain automatisch demselben Team zu wie eine andere Domain. Das bedeutet, dass alle Mitglieder dieser Domain als Teammitglieder zugewiesen werden und der `plan` automatisch auf `team` gesetzt wird. Sie können dies auf `"none"` setzen, um dies explizit zu deaktivieren, ist aber nicht erforderlich. |
| `plan`                         | Nein         | String (enumerierbar)                         | Tariftyp (muss `"free"`, `"enhanced_protection"` oder `"team"` sein, Standard ist `"free"` oder der aktuelle bezahlte Tarif des Benutzers, falls vorhanden)                                                                                                                                                                                   |
| `catchall`                     | Nein         | String (getrennte E-Mail-Adressen) oder Boolean | Erstellt einen Standard-Catch-All-Alias, Standard ist `true` (wenn `true`, wird die E-Mail-Adresse des API-Benutzers als Empfänger verwendet, und wenn `false`, wird kein Catch-All erstellt). Wenn ein String übergeben wird, ist dies eine durch Zeilenumbruch, Leerzeichen und/oder Komma getrennte Liste von E-Mail-Adressen als Empfänger.     |
| `has_adult_content_protection` | Nein         | Boolean                                      | Ob der Spam-Scanner für diese Domain einen Schutz vor Inhalten für Erwachsene aktiviert                                                                                                                                                                                                                                               |
| `has_phishing_protection`      | Nein         | Boolean                                      | Ob der Spam-Scanner für diese Domain einen Phishing-Schutz aktiviert                                                                                                                                                                                                                                                    |
| `has_executable_protection`    | Nein         | Boolean                                      | Ob der Spam-Scanner für diese Domain einen Schutz vor ausführbaren Dateien aktiviert                                                                                                                                                                                                                                                  |
| `has_virus_protection`         | Nein         | Boolean                                      | Ob der Spam-Scanner für diese Domain einen Virenschutz aktiviert                                                                                                                                                                                                                                                       |
| `has_recipient_verification`   | Nein         | Boolean                                      | Globale Standardeinstellung der Domain, ob Alias-Empfänger einen E-Mail-Verifizierungslink anklicken müssen, damit E-Mails durchgeleitet werden                                                                                                                                                                                         |
| `ignore_mx_check`              | Nein         | Boolean                                      | Ob die MX-Record-Prüfung bei der Domain-Verifizierung ignoriert werden soll. Dies ist hauptsächlich für Benutzer mit fortgeschrittenen MX-Konfigurationsregeln gedacht, die ihre bestehenden MX-Einträge behalten und an unsere weiterleiten möchten.                                                                                                  |
| `retention_days`               | Nein         | Zahl                                         | Ganzzahl zwischen `0` und `30`, die angibt, wie viele Tage ausgehende SMTP-E-Mails nach erfolgreicher Zustellung oder permanentem Fehler gespeichert werden. Standard ist `0`, was bedeutet, dass ausgehende SMTP-E-Mails sofort aus Sicherheitsgründen gelöscht und unkenntlich gemacht werden.                                       |
| `bounce_webhook`               | Nein         | String (URL) oder Boolean (false)            | Die `http://` oder `https://` Webhook-URL Ihrer Wahl, an die Bounce-Webhooks gesendet werden. Wir senden eine `POST`-Anfrage an diese URL mit Informationen zu ausgehenden SMTP-Fehlern (z.B. Soft- oder Hard-Fehler), damit Sie Ihre Abonnenten verwalten und den ausgehenden E-Mail-Verkehr programmatisch steuern können.                        |
| `max_quota_per_alias`          | Nein         | String                                       | Maximales Speicherplatzkontingent für Aliase auf diesem Domainnamen. Geben Sie einen Wert wie "1 GB" ein, der von [bytes](https://github.com/visionmedia/bytes.js) geparst wird.                                                                                                                                                        |
> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Domain abrufen {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domain-Datensätze überprüfen {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Domain SMTP-Datensätze überprüfen {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Domainweite Catch-All-Passwörter auflisten {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domainweites Catch-All-Passwort erstellen {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body-Parameter  | Erforderlich | Typ    | Beschreibung                                                                                                                                                                                                                 |
| --------------- | ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`  | Nein         | String | Ihr benutzerdefiniertes neues Passwort, das für das domainweite Catch-All-Passwort verwendet werden soll.  Beachten Sie, dass Sie dieses Feld leer lassen oder ganz aus dem API-Anfrage-Body weglassen können, wenn Sie ein zufällig generiertes und sicheres Passwort wünschen.  Benutzerdefinierte Postfach-Passwörter müssen 128 Zeichen oder weniger enthalten, dürfen nicht mit einem Leerzeichen beginnen oder enden und dürfen keine Anführungszeichen oder Apostrophe enthalten. Catch-all-Passwörter sind nur für den SMTP-Versand vorgesehen. Für IMAP, POP3, CalDAV, CardDAV und Postfachzugriff generieren Sie bitte stattdessen ein Passwort für den jeweiligen Alias. |
| `description`   | Nein         | String | Beschreibung nur zu Organisationszwecken.                                                                                                                                                                                   |

> Beispielanfrage:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domainweites Catch-All-Passwort entfernen {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Domain aktualisieren {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body-Parameter                 | Erforderlich | Typ                            | Beschreibung                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | Nein         | String oder Zahl               | Benutzerdefinierter Port zur Konfiguration für SMTP-Weiterleitung (Standard ist `"25"`)                                                                                                                                                                                                       |
| `has_adult_content_protection`| Nein         | Boolean                       | Ob der Spam-Scanner-Schutz für Inhalte für Erwachsene auf dieser Domain aktiviert werden soll                                                                                                                                                                                               |
| `has_phishing_protection`     | Nein         | Boolean                       | Ob der Spam-Scanner-Schutz gegen Phishing auf dieser Domain aktiviert werden soll                                                                                                                                                                                                            |
| `has_executable_protection`   | Nein         | Boolean                       | Ob der Spam-Scanner-Schutz gegen ausführbare Dateien auf dieser Domain aktiviert werden soll                                                                                                                                                                                                |
| `has_virus_protection`        | Nein         | Boolean                       | Ob der Spam-Scanner-Virenschutz auf dieser Domain aktiviert werden soll                                                                                                                                                                                                                      |
| `has_recipient_verification`  | Nein         | Boolean                       | Globale Domain-Standard-Einstellung, ob Alias-Empfänger einen E-Mail-Verifizierungslink anklicken müssen, damit E-Mails durchgeleitet werden                                                                                                                                                  |
| `ignore_mx_check`             | Nein         | Boolean                       | Ob die MX-Record-Prüfung bei der Domain-Verifizierung ignoriert werden soll. Dies ist hauptsächlich für Nutzer gedacht, die erweiterte MX-Exchange-Konfigurationsregeln haben und ihren bestehenden MX-Exchange behalten und an unseren weiterleiten müssen.                                |
| `retention_days`              | Nein         | Zahl                         | Ganzzahl zwischen `0` und `30`, die der Anzahl der Aufbewahrungstage entspricht, an denen ausgehende SMTP-E-Mails nach erfolgreicher Zustellung oder dauerhaftem Fehler gespeichert werden. Standard ist `0`, was bedeutet, dass ausgehende SMTP-E-Mails sofort gelöscht und unkenntlich gemacht werden. |
| `bounce_webhook`              | Nein         | String (URL) oder Boolean (false) | Die `http://` oder `https://` Webhook-URL Ihrer Wahl, an die Bounce-Webhooks gesendet werden. Wir senden eine `POST`-Anfrage an diese URL mit Informationen zu ausgehenden SMTP-Fehlern (z.B. Soft- oder Hard-Fehler – damit Sie Ihre Abonnenten verwalten und Ihre ausgehenden E-Mails programmatisch steuern können). |
| `max_quota_per_alias`         | Nein         | String                       | Maximales Speicherplatzkontingent für Aliase auf diesem Domainnamen. Geben Sie einen Wert wie "1 GB" ein, der von [bytes](https://github.com/visionmedia/bytes.js) geparst wird.                                                                                                            |
> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domain löschen {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Einladungen {#invites}

### Domain-Einladung annehmen {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Domain-Einladung erstellen {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body-Parameter | Erforderlich | Typ                 | Beschreibung                                                                                 |
| -------------- | ------------ | ------------------- | ------------------------------------------------------------------------------------------- |
| `email`        | Ja           | String (E-Mail)     | E-Mail-Adresse, die zur Mitgliederliste der Domain eingeladen werden soll                   |
| `group`        | Ja           | String (enumerierbar) | Gruppe, der der Benutzer in der Domain-Mitgliedschaft hinzugefügt wird (kann `"admin"` oder `"user"` sein) |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Wenn der eingeladene Benutzer bereits ein akzeptiertes Mitglied einer anderen Domain ist, deren Administrator der einladende Admin ebenfalls ist, wird die Einladung automatisch angenommen und keine E-Mail versendet.

### Domain-Einladung entfernen {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body-Parameter | Erforderlich | Typ             | Beschreibung                                      |
| -------------- | ------------ | --------------- | ------------------------------------------------ |
| `email`        | Ja           | String (E-Mail) | E-Mail-Adresse, die aus der Mitgliederliste der Domain entfernt werden soll |

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Mitglieder {#members}

### Domain-Mitglied aktualisieren {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body-Parameter | Erforderlich | Typ                 | Beschreibung                                                                                  |
| -------------- | ------------ | ------------------- | -------------------------------------------------------------------------------------------- |
| `group`        | Ja           | String (enumerierbar) | Gruppe, in die der Benutzer in der Domain-Mitgliedschaft aktualisiert wird (kann `"admin"` oder `"user"` sein) |

> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Domain-Mitglied entfernen {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliase {#aliases}

### Alias-Passwort generieren {#generate-an-alias-password}

Beachten Sie, dass wenn Sie keine Anweisungen per E-Mail senden, der Benutzername und das Passwort im JSON-Antwortkörper einer erfolgreichen Anfrage im Format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` enthalten sind.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body-Parameter         | Erforderlich | Typ     | Beschreibung                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | Nein         | String  | Ihr benutzerdefiniertes neues Passwort für den Alias. Beachten Sie, dass Sie dieses Feld leer lassen oder ganz aus dem API-Anfragekörper weglassen können, wenn Sie ein zufällig generiertes und sicheres Passwort erhalten möchten.                                                                  Benutzerdefinierte Postfach-Passwörter müssen 128 Zeichen oder weniger enthalten, dürfen nicht mit einem Leerzeichen beginnen oder enden und dürfen keine Anführungszeichen oder Apostrophe enthalten. |
| `password`             | Nein         | String  | Bestehendes Passwort für den Alias, um das Passwort zu ändern, ohne den bestehenden IMAP-Postfachspeicher zu löschen (siehe Option `is_override` unten, falls Sie das bestehende Passwort nicht mehr haben).                                                                                         |
| `is_override`          | Nein         | Boolean | **MIT VORSICHT VERWENDEN**: Dies überschreibt das bestehende Alias-Passwort und die Datenbank vollständig, löscht dauerhaft den bestehenden IMAP-Speicher und setzt die SQLite-E-Mail-Datenbank des Alias komplett zurück. Bitte erstellen Sie wenn möglich ein Backup, falls ein bestehendes Postfach an diesen Alias gebunden ist. |
| `emailed_instructions` | Nein         | String  | E-Mail-Adresse, an die das Passwort und die Einrichtungshinweise für den Alias gesendet werden sollen.                                                                                                                                                                                            |
> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Domain-Aliase auflisten {#list-domain-aliases}

> \[!NOTE]
> Ab dem 1. November 2024 werden die API-Endpunkte für [Domains auflisten](#list-domains) und [Domain-Aliase auflisten](#list-domain-aliases) standardmäßig auf `1000` maximale Ergebnisse pro Seite begrenzt sein. Wenn Sie dieses Verhalten frühzeitig aktivieren möchten, können Sie `?paginate=true` als zusätzlichen Querystring-Parameter an die URL für die Endpunktabfrage anhängen. Siehe [Pagination](#pagination) für weitere Informationen.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring-Parameter | Erforderlich | Typ                       | Beschreibung                                                                                                                                    |
| --------------------- | ----------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Nein        | String (RegExp unterstützt) | Suche nach Aliassen in einer Domain nach Name, Label oder Empfänger                                                                             |
| `name`                | Nein        | String (RegExp unterstützt) | Suche nach Aliassen in einer Domain nach Name                                                                                                  |
| `recipient`           | Nein        | String (RegExp unterstützt) | Suche nach Aliassen in einer Domain nach Empfänger                                                                                             |
| `sort`                | Nein        | String                    | Sortierung nach einem bestimmten Feld (mit einem einzelnen Bindestrich `-` vorangestellt, um in umgekehrter Reihenfolge zu sortieren). Standardmäßig `created_at`, falls nicht gesetzt. |
| `page`                | Nein        | Zahl                      | Siehe [Pagination](#pagination) für weitere Informationen                                                                                      |
| `limit`               | Nein        | Zahl                      | Siehe [Pagination](#pagination) für weitere Informationen                                                                                      |

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Neuen Domain-Alias erstellen {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Body-Parameter                  | Erforderlich | Typ                                   | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nein         | String                               | Alias-Name (wenn nicht angegeben oder leer, wird ein zufälliger Alias generiert)                                                                                                                                                                                                                                                                                                            |
| `recipients`                    | Nein         | String oder Array                    | Liste der Empfänger (muss ein String mit Zeilenumbruch/Leerzeichen/Komma getrennt oder ein Array gültiger E-Mail-Adressen, vollqualifizierter Domainnamen ("FQDN"), IP-Adressen und/oder Webhook-URLs sein – und wenn nicht angegeben oder ein leeres Array, wird die E-Mail des Benutzers, der die API-Anfrage stellt, als Empfänger gesetzt)                                                                                     |
| `description`                   | Nein         | String                               | Alias-Beschreibung                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | Nein         | String oder Array                    | Liste von Labels (muss ein String mit Zeilenumbruch/Leerzeichen/Komma getrennt oder ein Array sein)                                                                                                                                                                                                                                                                                         |
| `has_recipient_verification`    | Nein         | Boolean                              | Erfordert, dass Empfänger auf einen E-Mail-Verifizierungslink klicken, damit E-Mails durchgeleitet werden (standardmäßig die Einstellung der Domain, wenn nicht explizit im Request-Body gesetzt)                                                                                                                                                                                          |
| `is_enabled`                    | Nein         | Boolean                              | Ob dieser Alias aktiviert oder deaktiviert werden soll (wenn deaktiviert, werden E-Mails nirgendwohin geleitet, aber mit erfolgreichen Statuscodes beantwortet). Wenn ein Wert übergeben wird, wird er mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Boolean konvertiert.                                                                                     |
| `error_code_if_disabled`        | Nein         | Zahl (entweder `250`, `421` oder `550`) | Eingehende E-Mails an diesen Alias werden abgelehnt, wenn `is_enabled` auf `false` gesetzt ist, mit entweder `250` (leise nirgendwohin liefern, z.B. Blackhole oder `/dev/null`), `421` (Soft-Reject; und Wiederholung bis zu ca. 5 Tage) oder `550` (dauerhafter Fehler und Ablehnung). Standard ist `250`.                                                                                   |
| `has_imap`                      | Nein         | Boolean                              | Ob IMAP-Speicherung für diesen Alias aktiviert oder deaktiviert werden soll (wenn deaktiviert, werden eingehende E-Mails nicht im [IMAP-Speicher](/blog/docs/best-quantum-safe-encrypted-email-service) gespeichert). Wenn ein Wert übergeben wird, wird er mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Boolean konvertiert.                                         |
| `has_pgp`                       | Nein         | Boolean                              | Ob [OpenPGP-Verschlüsselung](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) für [IMAP/POP3/CalDAV/CardDAV verschlüsselten E-Mail-Speicher](/blog/docs/best-quantum-safe-encrypted-email-service) mit dem `public_key` des Alias aktiviert oder deaktiviert werden soll.                                                                                   |
| `public_key`                    | Nein         | String                               | OpenPGP-öffentlicher Schlüssel im ASCII-Armor-Format ([hier klicken für ein Beispiel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); z.B. GPG-Schlüssel für `support@forwardemail.net`). Gilt nur, wenn `has_pgp` auf `true` gesetzt ist. [Mehr über Ende-zu-Ende-Verschlüsselung in unserem FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nein         | String                               | Maximales Speicherlimit für diesen Alias. Leer lassen, um auf das aktuelle maximale Limit der Domain zurückzusetzen, oder einen Wert wie "1 GB" eingeben, der von [bytes](https://github.com/visionmedia/bytes.js) geparst wird. Dieser Wert kann nur von Domain-Admins angepasst werden.                                                                                                      |
| `vacation_responder_is_enabled` | Nein         | Boolean                              | Ob ein automatischer Abwesenheitsassistent aktiviert oder deaktiviert werden soll.                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_start_date` | Nein         | String                               | Startdatum für den Abwesenheitsassistenten (wenn aktiviert und kein Startdatum hier gesetzt, wird angenommen, dass er bereits gestartet ist). Unterstützte Datumsformate sind z.B. `MM/DD/YYYY`, `YYYY-MM-DD` und weitere Formate durch intelligente Analyse mit `dayjs`.                                                                                                                    |
| `vacation_responder_end_date`   | Nein         | String                               | Enddatum für den Abwesenheitsassistenten (wenn aktiviert und kein Enddatum hier gesetzt, wird angenommen, dass er nie endet und dauerhaft antwortet). Unterstützte Datumsformate sind z.B. `MM/DD/YYYY`, `YYYY-MM-DD` und weitere Formate durch intelligente Analyse mit `dayjs`.                                                                                                          |
| `vacation_responder_subject`    | Nein         | String                               | Betreff in Klartext für den Abwesenheitsassistenten, z.B. "Außer Haus". Es wird `striptags` verwendet, um hier sämtliches HTML zu entfernen.                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | Nein         | String                               | Nachricht in Klartext für den Abwesenheitsassistenten, z.B. "Ich bin bis Februar außer Haus.". Es wird `striptags` verwendet, um hier sämtliches HTML zu entfernen.                                                                                                                                                                                                                           |
> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Domain-Alias abrufen {#retrieve-domain-alias}

Sie können einen Domain-Alias entweder über seine `id` oder seinen `name` Wert abrufen.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Domain-Alias aktualisieren {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body-Parameter                  | Erforderlich | Typ                                   | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ----------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nein        | String                               | Alias-Name                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | Nein        | String oder Array                    | Liste der Empfänger (muss eine durch Zeilenumbruch/Leerzeichen/Komma getrennte Zeichenkette oder ein Array gültiger E-Mail-Adressen, vollqualifizierter Domainnamen ("FQDN"), IP-Adressen und/oder Webhook-URLs sein)                                                                                                                                                                            |
| `description`                   | Nein        | String                               | Alias-Beschreibung                                                                                                                                                                                                                                                                                                                                                                         |
| `labels`                        | Nein        | String oder Array                    | Liste der Labels (muss eine durch Zeilenumbruch/Leerzeichen/Komma getrennte Zeichenkette oder ein Array sein)                                                                                                                                                                                                                                                                               |
| `has_recipient_verification`    | Nein        | Boolean                             | Erfordert, dass Empfänger auf einen E-Mail-Verifizierungslink klicken, damit E-Mails durchgeleitet werden (standardmäßig wird die Einstellung der Domain verwendet, wenn im Request-Body nicht explizit gesetzt)                                                                                                                                                                              |
| `is_enabled`                    | Nein        | Boolean                             | Ob dieser Alias aktiviert oder deaktiviert werden soll (wenn deaktiviert, werden E-Mails nirgendwohin geleitet, aber mit erfolgreichen Statuscodes beantwortet). Wenn ein Wert übergeben wird, wird dieser mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Boolean konvertiert)                                                                                   |
| `error_code_if_disabled`        | Nein        | Zahl (entweder `250`, `421` oder `550`) | Eingehende E-Mails an diesen Alias werden abgelehnt, wenn `is_enabled` auf `false` gesetzt ist, mit entweder `250` (still an /dev/null liefern, z.B. Blackhole), `421` (weiche Ablehnung; und erneuter Versuch bis zu ca. 5 Tage) oder `550` (dauerhafter Fehler und Ablehnung). Standard ist `250`.                                                                                              |
| `has_imap`                      | Nein        | Boolean                             | Ob IMAP-Speicherung für diesen Alias aktiviert oder deaktiviert werden soll (wenn deaktiviert, werden eingehende E-Mails nicht im [IMAP-Speicher](/blog/docs/best-quantum-safe-encrypted-email-service) gespeichert). Wenn ein Wert übergeben wird, wird dieser mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Boolean konvertiert)                                         |
| `has_pgp`                       | Nein        | Boolean                             | Ob [OpenPGP-Verschlüsselung](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) für [IMAP/POP3/CalDAV/CardDAV verschlüsselten E-Mail-Speicher](/blog/docs/best-quantum-safe-encrypted-email-service) mit dem `public_key` des Alias aktiviert oder deaktiviert werden soll.                                                                                 |
| `public_key`                    | Nein        | String                               | OpenPGP-Public-Key im ASCII-Armor-Format ([hier klicken für ein Beispiel](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); z.B. GPG-Key für `support@forwardemail.net`). Dies gilt nur, wenn `has_pgp` auf `true` gesetzt ist. [Mehr über Ende-zu-Ende-Verschlüsselung in unserem FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nein        | String                               | Maximales Speicherlimit für diesen Alias. Leer lassen, um das aktuelle maximale Limit der Domain zurückzusetzen, oder einen Wert wie "1 GB" eingeben, der von [bytes](https://github.com/visionmedia/bytes.js) geparst wird. Dieser Wert kann nur von Domain-Admins angepasst werden.                                                                                                         |
| `vacation_responder_is_enabled` | Nein        | Boolean                             | Ob ein automatischer Abwesenheitsassistent aktiviert oder deaktiviert werden soll.                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_start_date` | Nein        | String                               | Startdatum für den Abwesenheitsassistenten (wenn aktiviert und kein Startdatum hier gesetzt, wird angenommen, dass er bereits gestartet ist). Unterstützte Datumsformate sind z.B. `MM/DD/YYYY`, `YYYY-MM-DD` und weitere Formate durch intelligente Analyse mit `dayjs`.                                                                                                                     |
| `vacation_responder_end_date`   | Nein        | String                               | Enddatum für den Abwesenheitsassistenten (wenn aktiviert und kein Enddatum hier gesetzt, wird angenommen, dass er nie endet und unbegrenzt antwortet). Unterstützte Datumsformate sind z.B. `MM/DD/YYYY`, `YYYY-MM-DD` und weitere Formate durch intelligente Analyse mit `dayjs`.                                                                                                           |
| `vacation_responder_subject`    | Nein        | String                               | Betreff in Klartext für den Abwesenheitsassistenten, z.B. "Außer Haus". Es wird `striptags` verwendet, um sämtliches HTML zu entfernen.                                                                                                                                                                                                                                                     |
| `vacation_responder_message`    | Nein        | String                               | Nachricht in Klartext für den Abwesenheitsassistenten, z.B. "Ich bin bis Februar außer Haus.". Es wird `striptags` verwendet, um sämtliches HTML zu entfernen.                                                                                                                                                                                                                                 |
> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Domain-Alias löschen {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Verschlüsseln {#encrypt}

Wir erlauben es Ihnen, Datensätze auch im kostenlosen Tarif ohne Kosten zu verschlüsseln. Datenschutz sollte kein Feature sein, sondern von Natur aus in allen Aspekten eines Produkts eingebaut sein. Wie in einer viel diskutierten [Privacy Guides Diskussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) und auf [unseren GitHub-Issues](https://github.com/forwardemail/forwardemail.net/issues/254) stark gewünscht, haben wir dies hinzugefügt.

### TXT-Datensatz verschlüsseln {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | Erforderlich | Typ    | Beschreibung                                  |
| -------------- | ------------ | ------ | -------------------------------------------- |
| `input`        | Ja           | String | Jeder gültige Forward Email Klartext-TXT-Datensatz |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
