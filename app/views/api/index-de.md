# E-Mail-API {#email-api}

## Inhaltsverzeichnis {#table-of-contents}

* [Bibliotheken](#libraries)
* [Basis-URI](#base-uri)
* [Authentifizierung](#authentication)
* [Fehler](#errors)
* [Lokalisierung](#localization)
* [Pagination](#pagination)
* [Protokolle](#logs)
  * [Protokolle abrufen](#retrieve-logs)
* [Konto](#account)
  * [Benutzerkonto erstellen](#create-account)
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
  * [Auflisten und Suchen von Nachrichten](#list-and-search-for-messages)
  * [Nachricht erstellen](#create-message)
  * [Nachricht abrufen](#retrieve-message)
  * [Update-Nachricht](#update-message)
  * [Nachricht löschen](#delete-message)
* [Alias-Ordner (IMAP/POP3)](#alias-folders-imappop3)
  * [Ordner auflisten](#list-folders)
  * [Ordner erstellen](#create-folder)
  * [Ordner abrufen](#retrieve-folder)
  * [Update-Ordner](#update-folder)
  * [Ordner löschen](#delete-folder)
  * [Ordner kopieren](#copy-folder)
* [Ausgehende E-Mails](#outbound-emails)
  * [Erhalten Sie das Limit für ausgehende SMTP-E-Mails](#get-outbound-smtp-email-limit)
  * [Auflisten ausgehender SMTP-E-Mails](#list-outbound-smtp-emails)
  * [Ausgehende SMTP-E-Mail erstellen](#create-outbound-smtp-email)
  * [Ausgehende SMTP-E-Mails abrufen](#retrieve-outbound-smtp-email)
  * [Ausgehende SMTP-E-Mails löschen](#delete-outbound-smtp-email)
* [Domänen](#domains)
  * [Domänen auflisten](#list-domains)
  * [Domäne erstellen](#create-domain)
  * [Domäne abrufen](#retrieve-domain)
  * [Domäneneinträge überprüfen](#verify-domain-records)
  * [Überprüfen der Domänen-SMTP-Einträge](#verify-domain-smtp-records)
  * [Domänenweite Catch-All-Passwörter auflisten](#list-domain-wide-catch-all-passwords)
  * [Domänenweites Catch-All-Passwort erstellen](#create-domain-wide-catch-all-password)
  * [Domänenweites Catch-All-Passwort entfernen](#remove-domain-wide-catch-all-password)
  * [Domäne aktualisieren](#update-domain)
  * [Domäne löschen](#delete-domain)
* [Einladungen](#invites)
  * [Domäneneinladung annehmen](#accept-domain-invite)
  * [Domäneneinladung erstellen](#create-domain-invite)
  * [Domäneneinladung entfernen](#remove-domain-invite)
* [Mitglieder](#members)
  * [Domänenmitglied aktualisieren](#update-domain-member)
  * [Domänenmitglied entfernen](#remove-domain-member)
* [Aliase](#aliases)
  * [Generieren Sie ein Alias-Passwort](#generate-an-alias-password)
  * [Domänenaliase auflisten](#list-domain-aliases)
  * [Neuen Domänenalias erstellen](#create-new-domain-alias)
  * [Domänenalias abrufen](#retrieve-domain-alias)
  * [Domänenalias aktualisieren](#update-domain-alias)
  * [Domänenalias löschen](#delete-domain-alias)
* [Verschlüsseln](#encrypt)
  * [TXT-Eintrag verschlüsseln](#encrypt-txt-record)

## Bibliotheken {#libraries}

Derzeit haben wir noch keine API-Wrapper veröffentlicht, planen dies aber in naher Zukunft. Senden Sie eine E-Mail an <api@forwardemail.net>, wenn Sie benachrichtigt werden möchten, sobald ein API-Wrapper für eine bestimmte Programmiersprache veröffentlicht wird. In der Zwischenzeit können Sie die empfohlenen HTTP-Anforderungsbibliotheken in Ihrer Anwendung verwenden oder einfach [Locke](https://stackoverflow.com/a/27442239/3586413) wie in den folgenden Beispielen verwenden.

| Sprache | Bibliothek |
| ---------- | ---------------------------------------------------------------------- |
| Rubin | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (wir sind Betreuer) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (wir sind Betreuer) |
| Gehen | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## Basis-URI {#base-uri}

Der aktuelle HTTP-Basis-URI-Pfad lautet: `BASE_URI`.

## Authentifizierung {#authentication}

Für alle Endpunkte muss Ihr [API-Schlüssel](https://forwardemail.net/my-account/security) als „Benutzername“-Wert des [Basisautorisierung](https://en.wikipedia.org/wiki/Basic_access_authentication)-Headers der Anfrage festgelegt werden (mit Ausnahme von [Alias-Kontakte](#alias-contacts), [Alias-Kalender](#alias-calendars) und [Alias-Postfächer](#alias-mailboxes), die einen [generierter Alias-Benutzername und Passwort](/faq#do-you-support-receiving-email-with-imap) verwenden).

Keine Sorge – falls Sie nicht sicher sind, was das ist, finden Sie unten Beispiele.

## Fehler {#errors}

Wenn Fehler auftreten, enthält der Antworttext der API-Anfrage eine ausführliche Fehlermeldung.

| Code | Name |
| ---- | --------------------- |
| 200 | OK |
| 400 | Ungültige Anforderung |
| 401 | Nicht autorisiert |
| 403 | Verboten |
| 404 | Nicht gefunden |
| 429 | Zu viele Anfragen |
| 500 | interner Serverfehler |
| 501 | Nicht implementiert |
| 502 | Schlechtes Gateway |
| 503 | Dienst nicht verfügbar |
| 504 | Gateway-Zeitüberschreitung |

> \[!TIP]
> Sollten Sie einen 5xx-Statuscode erhalten (was nicht vorkommen sollte), kontaktieren Sie uns bitte unter <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>. Wir helfen Ihnen umgehend bei der Lösung Ihres Problems.

## Lokalisierung {#localization}

Unser Service ist in über 25 verschiedene Sprachen übersetzt. Alle API-Antworten werden in die zuletzt erkannte Sprache des Benutzers übersetzt, der die API-Anfrage gestellt hat. Sie können dies überschreiben, indem Sie einen benutzerdefinierten `Accept-Language`-Header übergeben. Probieren Sie es einfach über das Sprach-Dropdown-Menü unten auf dieser Seite aus.

## Seitennummerierung {#pagination}

> \[!NOTE]
> Ab dem 1. November 2024 werden die API-Endpunkte für [Domänen auflisten](#list-domains) und [Domänenaliase auflisten](#list-domain-aliases) standardmäßig auf `1000` maximale Ergebnisse pro Seite eingestellt. Wenn Sie dieses Verhalten frühzeitig aktivieren möchten, können Sie `?paginate=true` als zusätzlichen Abfrageparameter an die URL für die Endpunktabfrage übergeben.

Die Paginierung wird von allen API-Endpunkten unterstützt, die Ergebnisse auflisten.

Geben Sie einfach die Abfragezeichenfolgeneigenschaften `page` (und optional `limit`) an.

Die Eigenschaft `page` sollte eine Zahl größer oder gleich `1` sein. Wenn Sie `limit` (ebenfalls eine Zahl) angeben, ist der Mindestwert `10` und der Höchstwert `50` (sofern nicht anders angegeben).

| Abfragezeichenfolgenparameter | Erforderlich | Typ | Beschreibung |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | NEIN | Nummer | Seite mit den zurückzugebenden Ergebnissen. Falls nicht angegeben, ist der Wert von `page` `1`. Muss eine Zahl größer oder gleich `1` sein. |
| `limit` | NEIN | Nummer | Anzahl der Ergebnisse pro Seite. Standardmäßig `10`, falls nicht anders angegeben. Muss eine Zahl größer oder gleich `1` und kleiner oder gleich `50` sein. |

Um festzustellen, ob weitere Ergebnisse verfügbar sind, stellen wir diese HTTP-Antwortheader bereit (die Sie analysieren können, um sie programmgesteuert zu paginieren):

| HTTP-Antwortheader | Beispiel | Beschreibung |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Die Gesamtzahl der verfügbaren Seiten. |
| `X-Page-Current` | `X-Page-Current: 1` | Die aktuelle Seite mit den zurückgegebenen Ergebnissen (z. B. basierend auf dem Abfragezeichenfolgenparameter `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Die Gesamtzahl der auf der Seite zurückgegebenen Ergebnisse (z. B. basierend auf dem Abfragezeichenfolgenparameter `limit` und den tatsächlich zurückgegebenen Ergebnissen). |
| `X-Item-Count` | `X-Item-Count: 30` | Die Gesamtzahl der auf allen Seiten verfügbaren Elemente. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Wir stellen einen `Link` HTTP-Antwortheader bereit, den Sie wie im Beispiel gezeigt analysieren können. Dies ist [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (z. B. werden nicht alle Werte bereitgestellt, wenn sie nicht relevant oder verfügbar sind. Beispielsweise wird `"next"` nicht bereitgestellt, wenn keine andere Seite vorhanden ist.) |

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Protokolle {#logs}

### Protokolle abrufen {#retrieve-logs}

Unsere API ermöglicht Ihnen den programmgesteuerten Download von Protokollen für Ihr Konto. Wenn Sie eine Anfrage an diesen Endpunkt senden, werden alle Protokolle für Ihr Konto verarbeitet und Ihnen nach Abschluss per E-Mail als Anhang ([Gzip](https://en.wikipedia.org/wiki/Gzip) komprimierte [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) Tabellenkalkulationsdatei) zugesandt.

Dies ermöglicht Ihnen, Hintergrundjobs mit einem [Cron-Job](https://en.wikipedia.org/wiki/Cron) zu erstellen oder unseren [Node.js-Jobplanungssoftware Bree](https://github.com/breejs/bree) zu verwenden, um Protokolle jederzeit zu erhalten. Beachten Sie, dass dieser Endpunkt auf `10` Anfragen pro Tag beschränkt ist.

Der Anhang besteht aus der Kleinbuchstabenform von `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`. Die E-Mail selbst enthält eine kurze Zusammenfassung der abgerufenen Protokolle. Sie können Protokolle jederzeit auch von [Mein Konto → Protokolle](/my-account/logs) herunterladen.

> `GET /v1/logs/download`

| Abfragezeichenfolgenparameter | Erforderlich | Typ | Beschreibung |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | NEIN | Zeichenfolge (FQDN) | Filtern Sie Protokolle nach der vollqualifizierten Domäne („FQDN“). Wenn Sie diese nicht angeben, werden alle Protokolle aller Domänen abgerufen. |
| `q` | NEIN | Zeichenfolge | Suchen Sie nach Protokollen nach E-Mail, Domäne, Aliasname, IP-Adresse oder Datum (Format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` oder `M.D.YY`). |
| `bounce_category` | NEIN | Zeichenfolge | Suchen Sie nach Protokollen anhand einer bestimmten Bounce-Kategorie (z. B. `blocklist`). |
| `response_code` | NEIN | Nummer | Suchen Sie nach Protokollen anhand eines bestimmten Fehlerantwortcodes (z. B. `421` oder `550`). |

> Beispielanfrage:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Beispiel für einen Cron-Job (täglich um Mitternacht):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Beachten Sie, dass Sie Dienste wie [Crontab.guru](https://crontab.guru/) verwenden können, um die Ausdruckssyntax Ihres Cron-Jobs zu validieren.

> Beispiel für einen Cron-Job (jeden Tag um Mitternacht **und mit Protokollen für den vorherigen Tag**):

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

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | -------------- | ------------- |
| `email` | Ja | Zeichenfolge (E-Mail) | E-Mail-Adresse |
| `password` | Ja | Zeichenfolge | Passwort |

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

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | -------------- | -------------------- |
| `email` | NEIN | Zeichenfolge (E-Mail) | E-Mail-Adresse |
| `given_name` | NEIN | Zeichenfolge | Vorname |
| `family_name` | NEIN | Zeichenfolge | Nachname |
| `avatar_url` | NEIN | Zeichenfolge (URL) | Link zum Avatarbild |

> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Alias-Kontakte (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Im Gegensatz zu anderen API-Endpunkten benötigen diese [Authentifizierung](#authentication) „Benutzername“ (entsprechend dem Alias-Benutzernamen) und „Passwort“ (entsprechend dem vom Alias generierten Passwort) als Header für die Basisautorisierung.

> \[!WARNING]
> Dieser Endpunktbereich befindet sich in der Entwicklung und wird (hoffentlich) 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü „Apps“ in der Navigation unserer Website.

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
> Im Gegensatz zu anderen API-Endpunkten benötigen diese [Authentifizierung](#authentication) „Benutzername“ (entsprechend dem Alias-Benutzernamen) und „Passwort“ (entsprechend dem vom Alias generierten Passwort) als Header für die Basisautorisierung.

> \[!WARNING]
> Dieser Endpunktbereich befindet sich in der Entwicklung und wird (hoffentlich) 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü „Apps“ in der Navigation unserer Website.

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
> Im Gegensatz zu anderen API-Endpunkten benötigen diese [Authentifizierung](#authentication) „Benutzername“ (entsprechend dem Alias-Benutzernamen) und „Passwort“ (entsprechend dem vom Alias generierten Passwort) als Header für die Basisautorisierung.

> \[!WARNING]
> Dieser Endpunktbereich befindet sich in der Entwicklung und wird (hoffentlich) 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü „Apps“ in der Navigation unserer Website.

Bitte stellen Sie sicher, dass Sie die Einrichtungsanweisungen für Ihre Domäne befolgt haben.

Diese Anweisungen finden Sie in unserem FAQ-Bereich [Unterstützen Sie den E-Mail-Empfang mit IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Nachrichten auflisten und suchen {#list-and-search-for-messages}

> `GET /v1/messages`

**Demnächst verfügbar**

### Nachricht erstellen {#create-message}

> \[!NOTE]
> Dadurch wird **KEINE** E-Mail gesendet – die Nachricht wird lediglich Ihrem Postfachordner hinzugefügt (ähnlich dem IMAP-Befehl `APPEND`). Wenn Sie eine E-Mail senden möchten, lesen Sie bitte unten den Befehl [Ausgehende SMTP-E-Mail erstellen](#create-outbound-smtp-email). Nachdem Sie die ausgehende SMTP-E-Mail erstellt haben, können Sie über diesen Endpunkt eine Kopie davon zur Speicherung an das Postfach Ihres Alias anhängen.

> `POST /v1/messages`

**Demnächst verfügbar**

### Nachricht abrufen {#retrieve-message}

> `GET /v1/messages/:id`

**Demnächst verfügbar**

### Update-Nachricht {#update-message}

> `PUT /v1/messages/:id`

**Demnächst verfügbar**

### Nachricht löschen {#delete-message}

> `DELETE /v1/messages:id`

**Demnächst verfügbar**

## Alias-Ordner (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Ordnerendpunkte mit dem Ordnerpfad <code>/v1/folders/:path</code> als Endpunkt sind mit der Ordner-ID <code>:id</code> austauschbar. Das bedeutet, dass Sie den Ordner entweder über seinen <code>path</code>- oder <code>id</code>-Wert referenzieren können.

> \[!WARNING]
> Dieser Endpunktbereich befindet sich in der Entwicklung und wird (hoffentlich) 2024 veröffentlicht. Bitte verwenden Sie in der Zwischenzeit einen IMAP-Client aus dem Dropdown-Menü „Apps“ in der Navigation unserer Website.

### Ordner auflisten {#list-folders}

> `GET /v1/folders`

**Demnächst verfügbar**

### Ordner erstellen {#create-folder}

> `POST /v1/folders`

**Demnächst verfügbar**

### Ordner abrufen {#retrieve-folder}

> `GET /v1/folders/:id`

**Demnächst verfügbar**

### Update-Ordner {#update-folder}

> `PUT /v1/folders/:id`

**Demnächst verfügbar**

### Ordner {#delete-folder} löschen

> `DELETE /v1/folders/:id`

**Demnächst verfügbar**

### Ordner kopieren {#copy-folder}

> `POST /v1/folders/:id/copy`

**Demnächst verfügbar**

## Ausgehende E-Mails {#outbound-emails}

Bitte stellen Sie sicher, dass Sie die Einrichtungsanweisungen für Ihre Domäne befolgt haben.

Diese Anweisungen finden Sie unter [Mein Konto → Domänen → Einstellungen → Outbound SMTP-Konfiguration](/my-account/domains). Sie müssen die Einrichtung von DKIM, Return-Path und DMARC für das Senden ausgehender SMTP-Nachrichten mit Ihrer Domäne sicherstellen.

### Erhalten Sie das Limit für ausgehende SMTP-E-Mails {#get-outbound-smtp-email-limit}

Dies ist ein einfacher Endpunkt, der ein JSON-Objekt zurückgibt, das `count` und `limit` für die Anzahl der täglich ausgehenden SMTP-Nachrichten pro Konto enthält.

> `GET /v1/emails/limit`

> Beispielanfrage:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Liste ausgehender SMTP-E-Mails {#list-outbound-smtp-emails}

Beachten Sie, dass dieser Endpunkt keine Eigenschaftswerte für `message`, `headers` oder `rejectedErrors` einer E-Mail zurückgibt.

Um diese Eigenschaften und ihre Werte zurückzugeben, verwenden Sie bitte den Endpunkt [E-Mail abrufen](#retrieve-email) mit einer E-Mail-ID.

> `GET /v1/emails`

| Abfragezeichenfolgenparameter | Erforderlich | Typ | Beschreibung |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach E-Mails anhand von Metadaten |
| `domain` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach E-Mails anhand des Domänennamens |
| `sort` | NEIN | Zeichenfolge | Sortieren Sie nach einem bestimmten Feld (stellen Sie einen einzelnen Bindestrich `-` voran, um in umgekehrter Reihenfolge dieses Felds zu sortieren). Der Standardwert ist `created_at`, falls nicht festgelegt. |
| `page` | NEIN | Nummer | Weitere Informationen finden Sie unter [Pagination](#pagination) |
| `limit` | NEIN | Nummer | Weitere Informationen finden Sie unter [Pagination](#pagination) |

> Beispielanfrage:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Ausgehende SMTP-E-Mail erstellen {#create-outbound-smtp-email}

Unsere API zum Erstellen einer E-Mail ist von der Nachrichtenoptionenkonfiguration von Nodemailer inspiriert und nutzt diese. Bitte verwenden Sie den [Nodemailer-Nachrichtenkonfiguration](https://nodemailer.com/message/) für alle unten aufgeführten Textparameter.

Beachten Sie, dass wir mit Ausnahme von `envelope` und `dkim` (da wir diese automatisch für Sie festlegen) alle Nodemailer-Optionen unterstützen. Aus Sicherheitsgründen setzen wir die Optionen `disableFileAccess` und `disableUrlAccess` automatisch auf `true`.

Sie sollten entweder die einzelne Option `raw` mit Ihrer vollständigen E-Mail einschließlich der Kopfzeilen übergeben **oder** unten einzelne Textparameteroptionen übergeben.

Dieser API-Endpunkt kodiert automatisch Emojis für Sie, wenn diese in den Headern gefunden werden (z. B. wird eine Betreffzeile von `Subject: 🤓 Hello` automatisch in `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` umgewandelt). Unser Ziel war es, eine extrem entwicklerfreundliche und idiotensichere E-Mail-API zu erstellen.

> `POST /v1/emails`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | NEIN | Zeichenfolge (E-Mail) | Die E-Mail-Adresse des Absenders (muss als Alias der Domäne vorhanden sein). |
| `to` | NEIN | String oder Array | Durch Kommas getrennte Liste oder ein Array von Empfängern für die Kopfzeile „An“. |
| `cc` | NEIN | String oder Array | Durch Kommas getrennte Liste oder ein Array von Empfängern für den „Cc“-Header. |
| `bcc` | NEIN | String oder Array | Durch Kommas getrennte Liste oder ein Array von Empfängern für den „Bcc“-Header. |
| `subject` | NEIN | Zeichenfolge | Der Betreff der E-Mail. |
| `text` | NEIN | String oder Puffer | Die Klartextversion der Nachricht. |
| `html` | NEIN | String oder Puffer | Die HTML-Version der Nachricht. |
| `attachments` | NEIN | Array | Ein Array von Anhangsobjekten (siehe [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | NEIN | Zeichenfolge | Die E-Mail-Adresse für den Header „Absender“ (siehe [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | NEIN | Zeichenfolge | Die E-Mail-Adresse für den „Antwort-An“-Header. |
| `inReplyTo` | NEIN | Zeichenfolge | Die Nachrichten-ID, auf die die Nachricht antwortet. |
| `references` | NEIN | String oder Array | Durch Leerzeichen getrennte Liste oder ein Array von Nachrichten-IDs. |
| `attachDataUrls` | NEIN | Boolesch | Wenn `true`, dann konvertiert `data:` Bilder im HTML-Inhalt der Nachricht in eingebettete Anhänge. |
| `watchHtml` | NEIN | Zeichenfolge | Eine Apple Watch-spezifische HTML-Version der Nachricht ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), bei den neuesten Uhren muss dies nicht festgelegt werden). |
| `amp` | NEIN | Zeichenfolge | Eine AMP4EMAIL-spezifische HTML-Version der Nachricht (siehe [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | NEIN | Objekt | Ein iCalendar-Ereignis, das als alternativer Nachrichteninhalt verwendet werden kann (siehe [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | NEIN | Array | Ein Array mit alternativen Nachrichteninhalten (siehe [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | NEIN | Zeichenfolge | Kodierung für die Text- und HTML-Zeichenfolgen (standardmäßig `"utf-8"`, unterstützt aber auch die Kodierungswerte `"hex"` und `"base64"`). |
| `raw` | NEIN | String oder Puffer | Eine benutzerdefinierte, generierte Nachricht im RFC822-Format, die verwendet werden soll (anstelle einer von Nodemailer generierten Nachricht – siehe [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | NEIN | Zeichenfolge | Kodierung, die für Textwerte zwingend verwendet werden muss (entweder `"quoted-printable"` oder `"base64"`). Der Standardwert ist der nächstliegende erkannte Wert (für ASCII verwenden Sie `"quoted-printable"`). |
| `priority` | NEIN | Zeichenfolge | Prioritätsstufe der E-Mail (kann entweder `"high"`, `"normal"` (Standard) oder `"low"` sein). Beachten Sie, dass der Wert `"normal"` keinen Prioritätsheader setzt (dies ist das Standardverhalten). Wenn der Wert `"high"` oder `"low"` gesetzt ist, setzen die Header `X-Priority`, `X-MSMail-Priority` und `Importance` [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | NEIN | Objekt oder Array | Ein Objekt oder ein Array zusätzlicher Headerfelder zum Festlegen (siehe [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | NEIN | Zeichenfolge | Ein optionaler Nachrichten-ID-Wert für den Header „Nachrichten-ID“ (wenn kein Standardwert festgelegt ist, wird automatisch ein Standardwert erstellt. Beachten Sie, dass der Wert [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705) sein sollte). |
| `date` | NEIN | Zeichenfolge oder Datum | Ein optionaler Datumswert, der verwendet wird, wenn der Datumsheader nach der Analyse fehlt. Andernfalls wird die aktuelle UTC-Zeichenfolge verwendet, falls nicht angegeben. Der Datumsheader darf nicht mehr als 30 Tage vor der aktuellen Zeit liegen. |
| `list` | NEIN | Objekt | Ein optionales Objekt mit `List-*`-Headern (siehe [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Ausgehende SMTP-E-Mail abrufen {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Beispielanfrage:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Ausgehende SMTP-E-Mails löschen {#delete-outbound-smtp-email}

Das Löschen einer E-Mail setzt den Status auf `"rejected"` (und verarbeitet sie anschließend nicht in der Warteschlange), wenn der aktuelle Status `"pending"`, `"queued"` oder `"deferred"` ist. Wir löschen E-Mails möglicherweise automatisch 30 Tage nach ihrer Erstellung und/oder ihrem Versand. Bewahren Sie daher eine Kopie ausgehender SMTP-E-Mails in Ihrem Client, Ihrer Datenbank oder Ihrer Anwendung auf. Sie können bei Bedarf auf unsere E-Mail-ID in Ihrer Datenbank verweisen – dieser Wert wird sowohl von den Endpunkten [E-Mail erstellen](#create-email) als auch [E-Mail abrufen](#retrieve-email) zurückgegeben.

> `DELETE /v1/emails/:id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domänen {#domains}

> \[!TIP]
> Domänenendpunkte mit dem Domänennamen <code>/v1/domains/:Domänenname</code> als Endpunkt sind durch die Domänen-ID <code>:Domänen-ID</code> austauschbar. Das bedeutet, dass Sie die Domäne entweder über ihren <code>Name</code> oder ihren <code>ID</code>-Wert referenzieren können.

### Domänen auflisten {#list-domains}

> \[!NOTE]
> Ab dem 1. November 2024 werden die API-Endpunkte für [Domänen auflisten](#list-domains) und [Domänenaliase auflisten](#list-domain-aliases) standardmäßig auf `1000` maximale Ergebnisse pro Seite eingestellt. Wenn Sie dieses Verhalten frühzeitig aktivieren möchten, können Sie `?paginate=true` als zusätzlichen Abfrageparameter an die URL für die Endpunktabfrage übergeben. Weitere Informationen finden Sie unter [Pagination](#pagination).

> `GET /v1/domains`

| Abfragezeichenfolgenparameter | Erforderlich | Typ | Beschreibung |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach Domänen nach Namen |
| `name` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach Domänen nach Namen |
| `sort` | NEIN | Zeichenfolge | Sortieren Sie nach einem bestimmten Feld (stellen Sie einen einzelnen Bindestrich `-` voran, um in umgekehrter Reihenfolge dieses Felds zu sortieren). Der Standardwert ist `created_at`, falls nicht festgelegt. |
| `page` | NEIN | Nummer | Weitere Informationen finden Sie unter [Pagination](#pagination) |
| `limit` | NEIN | Nummer | Weitere Informationen finden Sie unter [Pagination](#pagination) |

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Domäne erstellen {#create-domain}

> `POST /v1/domains`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Ja | Zeichenfolge (FQDN oder IP) | Vollqualifizierter Domänenname („FQDN“) oder IP-Adresse |
| `team_domain` | NEIN | Zeichenfolge (Domänen-ID oder Domänenname; FQDN) | Diese Domäne wird automatisch demselben Team aus einer anderen Domäne zugewiesen. Dies bedeutet, dass alle Mitglieder dieser Domäne als Teammitglieder zugewiesen werden und `plan` automatisch auf `team` gesetzt wird. Sie können dies bei Bedarf auf `"none"` setzen, um dies explizit zu deaktivieren. Dies ist jedoch nicht erforderlich. |
| `plan` | NEIN | Zeichenfolge (aufzählbar) | Plantyp (muss `"free"`, `"enhanced_protection"` oder `"team"` sein, standardmäßig `"free"` oder der aktuelle kostenpflichtige Plan des Benutzers, falls dieser einen hat) |
| `catchall` | NEIN | Zeichenfolge (durch Trennzeichen getrennte E-Mail-Adressen) oder Boolean | Erstellen Sie einen Standard-Catch-All-Alias (Standardwert: `true`). Bei `true` wird die E-Mail-Adresse des API-Benutzers als Empfänger verwendet, bei `false` wird kein Catch-All erstellt. Wird ein String übergeben, handelt es sich um eine durch Trennzeichen getrennte Liste von E-Mail-Adressen, die als Empfänger verwendet werden (getrennt durch Zeilenumbruch, Leerzeichen und/oder Komma). |
| `has_adult_content_protection` | NEIN | Boolesch | Ob der Spam-Scanner-Schutz vor Inhalten für Erwachsene auf dieser Domain aktiviert werden soll |
| `has_phishing_protection` | NEIN | Boolesch | Ob der Spam-Scanner-Phishing-Schutz für diese Domäne aktiviert werden soll |
| `has_executable_protection` | NEIN | Boolesch | Ob der ausführbare Schutz des Spam-Scanners auf dieser Domäne aktiviert werden soll |
| `has_virus_protection` | NEIN | Boolesch | Ob der Spam-Scanner-Virenschutz für diese Domäne aktiviert werden soll |
| `has_recipient_verification` | NEIN | Boolesch | Globale Domänenvorgabe, ob Alias-Empfänger auf einen Link zur E-Mail-Bestätigung klicken müssen, damit E-Mails weitergeleitet werden können |
| `ignore_mx_check` | NEIN | Boolesch | Ob die MX-Eintragsprüfung der Domäne zur Verifizierung ignoriert werden soll. Dies ist hauptsächlich für Benutzer mit erweiterten MX-Austauschkonfigurationsregeln gedacht, die ihren bestehenden MX-Austausch beibehalten und an unseren weiterleiten müssen. |
| `retention_days` | NEIN | Nummer | Eine Ganzzahl zwischen `0` und `30`, die der Anzahl der Aufbewahrungstage für ausgehende SMTP-E-Mails entspricht, sobald diese erfolgreich zugestellt wurden oder dauerhaft fehlerhaft waren. Der Standardwert ist `0`. Dies bedeutet, dass ausgehende SMTP-E-Mails zu Ihrer Sicherheit sofort gelöscht und redigiert werden. |
| `bounce_webhook` | NEIN | String (URL) oder Boolean (falsch) | Die `http://`- oder `https://`-Webhook-URL Ihrer Wahl, an die Bounce-Webhooks gesendet werden sollen. Wir senden eine `POST`-Anfrage an diese URL mit Informationen zu ausgehenden SMTP-Fehlern (z. B. Soft- oder Hard-Fehlern – damit Sie Ihre Abonnenten verwalten und Ihre ausgehenden E-Mails programmgesteuert steuern können). |
| `max_quota_per_alias` | NEIN | Zeichenfolge | Maximales Speicherkontingent für Aliase in diesem Domänennamen. Geben Sie einen Wert wie „1 GB“ ein, der von [bytes](https://github.com/visionmedia/bytes.js) analysiert wird. |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Domäne abrufen {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domäneneinträge überprüfen {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### SMTP-Einträge der Domäne überprüfen {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Domänenweite Catch-All-Passwörter auflisten {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domänenweites Catch-All-Passwort erstellen {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | NEIN | Zeichenfolge | Ihr neues, benutzerdefiniertes Passwort für das domänenweite Catch-All-Passwort. Beachten Sie, dass Sie dieses Feld leer lassen oder im Text Ihrer API-Anforderung ganz weglassen können, wenn Sie ein zufällig generiertes und sicheres Passwort wünschen. |
| `description` | NEIN | Zeichenfolge | Beschreibung nur zu Organisationszwecken. |

> Beispielanfrage:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Domänenweites Catch-All-Passwort entfernen {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Domäne aktualisieren {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | NEIN | Zeichenfolge oder Zahl | Benutzerdefinierter Port zur Konfiguration für die SMTP-Weiterleitung (Standard ist `"25"`) |
| `has_adult_content_protection` | NEIN | Boolesch | Ob der Spam-Scanner-Schutz vor Inhalten für Erwachsene auf dieser Domain aktiviert werden soll |
| `has_phishing_protection` | NEIN | Boolesch | Ob der Spam-Scanner-Phishing-Schutz für diese Domäne aktiviert werden soll |
| `has_executable_protection` | NEIN | Boolesch | Ob der ausführbare Schutz des Spam-Scanners auf dieser Domäne aktiviert werden soll |
| `has_virus_protection` | NEIN | Boolesch | Ob der Spam-Scanner-Virenschutz für diese Domäne aktiviert werden soll |
| `has_recipient_verification` | NEIN | Boolesch | Globale Domänenvorgabe, ob Alias-Empfänger auf einen Link zur E-Mail-Bestätigung klicken müssen, damit E-Mails weitergeleitet werden können |
| `ignore_mx_check` | NEIN | Boolesch | Ob die MX-Eintragsprüfung der Domäne zur Verifizierung ignoriert werden soll. Dies ist hauptsächlich für Benutzer mit erweiterten MX-Austauschkonfigurationsregeln gedacht, die ihren bestehenden MX-Austausch beibehalten und an unseren weiterleiten müssen. |
| `retention_days` | NEIN | Nummer | Eine Ganzzahl zwischen `0` und `30`, die der Anzahl der Aufbewahrungstage für ausgehende SMTP-E-Mails entspricht, sobald diese erfolgreich zugestellt wurden oder dauerhaft fehlerhaft waren. Der Standardwert ist `0`. Dies bedeutet, dass ausgehende SMTP-E-Mails zu Ihrer Sicherheit sofort gelöscht und redigiert werden. |
| `bounce_webhook` | NEIN | String (URL) oder Boolean (falsch) | Die `http://`- oder `https://`-Webhook-URL Ihrer Wahl, an die Bounce-Webhooks gesendet werden sollen. Wir senden eine `POST`-Anfrage an diese URL mit Informationen zu ausgehenden SMTP-Fehlern (z. B. Soft- oder Hard-Fehlern – damit Sie Ihre Abonnenten verwalten und Ihre ausgehenden E-Mails programmgesteuert steuern können). |
| `max_quota_per_alias` | NEIN | Zeichenfolge | Maximales Speicherkontingent für Aliase in diesem Domänennamen. Geben Sie einen Wert wie „1 GB“ ein, der von [bytes](https://github.com/visionmedia/bytes.js) analysiert wird. |

> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Domäne löschen {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Einladungen {#invites}

### Domäneneinladung annehmen {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Domäneneinladung erstellen {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Ja | Zeichenfolge (E-Mail) | E-Mail-Adresse zum Einladen zur Domänenmitgliederliste |
| `group` | Ja | Zeichenfolge (aufzählbar) | Gruppe, mit der der Benutzer zur Domänenmitgliedschaft hinzugefügt werden soll (kann einer von `"admin"` oder `"user"` sein) |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Wenn der eingeladene Benutzer bereits akzeptiertes Mitglied einer anderen Domain ist, der der einladende Administrator angehört, wird die Einladung automatisch angenommen und es wird keine E-Mail gesendet.

### Domäneneinladung entfernen {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Ja | Zeichenfolge (E-Mail) | Aus der Domänenmitgliederliste zu entfernende E-Mail-Adresse |

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Mitglieder {#members}

### Domänenmitglied aktualisieren {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Ja | Zeichenfolge (aufzählbar) | Gruppe, mit der der Benutzer auf die Domänenmitgliedschaft aktualisiert werden soll (kann einer von `"admin"` oder `"user"` sein) |

> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Domänenmitglied entfernen {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliase {#aliases}

### Generieren Sie ein Alias-Passwort {#generate-an-alias-password}

Beachten Sie: Wenn Sie keine Anweisungen per E-Mail senden, werden Benutzername und Kennwort im JSON-Antworttext einer erfolgreichen Anfrage im Format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` angezeigt.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | NEIN | Zeichenfolge | Ihr neues, benutzerdefiniertes Passwort für den Alias. Beachten Sie, dass Sie dieses Feld leer lassen oder im Text Ihrer API-Anforderung ganz weglassen können, wenn Sie ein zufällig generiertes und sicheres Passwort wünschen. |
| `password` | NEIN | Zeichenfolge | Vorhandenes Passwort für Alias, um das Passwort zu ändern, ohne den vorhandenen IMAP-Postfachspeicher zu löschen (siehe Option `is_override` unten, wenn Sie das vorhandene Passwort nicht mehr haben). |
| `is_override` | NEIN | Boolesch | **VORSICHT**: Dadurch werden das bestehende Alias-Passwort und die Datenbank vollständig überschrieben, der vorhandene IMAP-Speicher dauerhaft gelöscht und die SQLite-E-Mail-Datenbank des Alias vollständig zurückgesetzt. Bitte erstellen Sie nach Möglichkeit eine Sicherungskopie, wenn Sie ein bestehendes Postfach mit diesem Alias verknüpft haben. |
| `emailed_instructions` | NEIN | Zeichenfolge | E-Mail-Adresse, an die das Passwort und die Einrichtungsanweisungen für den Alias gesendet werden sollen. |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Domänen-Aliase auflisten {#list-domain-aliases}

> \[!NOTE]
> Ab dem 1. November 2024 werden die API-Endpunkte für [Domänen auflisten](#list-domains) und [Domänenaliase auflisten](#list-domain-aliases) standardmäßig auf `1000` maximale Ergebnisse pro Seite eingestellt. Wenn Sie dieses Verhalten frühzeitig aktivieren möchten, können Sie `?paginate=true` als zusätzlichen Abfrageparameter an die URL für die Endpunktabfrage übergeben. Weitere Informationen finden Sie unter [Pagination](#pagination).

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Abfragezeichenfolgenparameter | Erforderlich | Typ | Beschreibung |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach Aliasnamen in einer Domäne nach Name, Bezeichnung oder Empfänger |
| `name` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach Aliasnamen in einer Domäne nach Namen |
| `recipient` | NEIN | Zeichenfolge (RegExp wird unterstützt) | Suche nach Aliasnamen in einer Domäne nach Empfänger |
| `sort` | NEIN | Zeichenfolge | Sortieren Sie nach einem bestimmten Feld (stellen Sie einen einzelnen Bindestrich `-` voran, um in umgekehrter Reihenfolge dieses Felds zu sortieren). Der Standardwert ist `created_at`, falls nicht festgelegt. |
| `page` | NEIN | Nummer | Weitere Informationen finden Sie unter [Pagination](#pagination) |
| `limit` | NEIN | Nummer | Weitere Informationen finden Sie unter [Pagination](#pagination) |

> Beispielanfrage:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Neuen Domänenalias erstellen {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | NEIN | Zeichenfolge | Aliasname (falls nicht angegeben oder leer, wird ein zufälliger Alias generiert) |
| `recipients` | NEIN | String oder Array | Liste der Empfänger (muss ein durch Zeilenumbrüche/Leerzeichen/Kommas getrennter String oder Array gültiger E-Mail-Adressen, vollqualifizierter Domänennamen („FQDN“), IP-Adressen und/oder Webhook-URLs sein – und wenn nicht angegeben oder ein leeres Array, wird die E-Mail-Adresse des Benutzers, der die API-Anfrage stellt, als Empfänger festgelegt) |
| `description` | NEIN | Zeichenfolge | Aliasbeschreibung |
| `labels` | NEIN | String oder Array | Liste der Beschriftungen (muss eine durch Zeilenumbruch/Leerzeichen/Komma getrennte Zeichenfolge oder ein Array sein) |
| `has_recipient_verification` | NEIN | Boolesch | Fordern Sie die Empfänger auf, auf einen Link zur E-Mail-Bestätigung zu klicken, damit die E-Mails weitergeleitet werden (standardmäßig wird die Domäneneinstellung verwendet, wenn sie nicht explizit im Anforderungstext festgelegt wurde). |
| `is_enabled` | NEIN | Boolesch | Ob dieser Alias aktiviert oder deaktiviert werden soll (falls deaktiviert, werden E-Mails nicht weitergeleitet, sondern geben Erfolgsstatuscodes zurück). Wenn ein Wert übergeben wird, wird er mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Boolean-Wert umgewandelt. |
| `error_code_if_disabled` | NEIN | Nummer (entweder `250`, `421` oder `550`) | Eingehende E-Mails an diesen Alias werden abgelehnt, wenn `is_enabled` `false` ist und entweder `250` (stille Zustellung, z. B. Blackhole oder `/dev/null`), `421` (weiche Ablehnung; und erneuter Versuch für bis zu ~5 Tage) oder `550` dauerhaft fehlschlägt und abgelehnt wird. Standardmäßig `250`. |
| `has_imap` | NEIN | Boolesch | Ob der IMAP-Speicher für diesen Alias aktiviert oder deaktiviert werden soll (wenn deaktiviert, werden eingehende E-Mails nicht in [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) gespeichert. Wenn ein Wert übergeben wird, wird er mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Booleschen Wert umgewandelt) |
| `has_pgp` | NEIN | Boolesch | Ob [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) für [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) mit dem Alias `public_key` aktiviert oder deaktiviert werden soll. |
| `public_key` | NEIN | Zeichenfolge | Öffentlicher OpenPGP-Schlüssel im ASCII-Armor-Format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); z. B. GPG-Schlüssel für `support@forwardemail.net`). Dies gilt nur, wenn Sie `has_pgp` auf `true` eingestellt haben. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | NEIN | Zeichenfolge | Maximales Speicherkontingent für diesen Alias. Lassen Sie das Feld leer, um das aktuelle maximale Kontingent der Domäne zurückzusetzen, oder geben Sie einen Wert wie „1 GB“ ein, der von [bytes](https://github.com/visionmedia/bytes.js) ausgewertet wird. Dieser Wert kann nur von Domänenadministratoren angepasst werden. |
| `vacation_responder_is_enabled` | NEIN | Boolesch | Ob eine automatische Abwesenheitsnotiz aktiviert oder deaktiviert werden soll. |
| `vacation_responder_start_date` | NEIN | Zeichenfolge | Startdatum für die Abwesenheitsnotiz (falls aktiviert und hier kein Startdatum festgelegt, wird davon ausgegangen, dass die Abwesenheitsnotiz bereits gestartet ist). Wir unterstützen Datumsformate wie `MM/DD/YYYY`, `YYYY-MM-DD` und andere Datumsformate durch intelligentes Parsen mit `dayjs`. |
| `vacation_responder_end_date` | NEIN | Zeichenfolge | Enddatum für Abwesenheitsnotizen (falls aktiviert und kein Enddatum festgelegt, wird davon ausgegangen, dass die Abwesenheitsnotiz nie endet und dauerhaft antwortet). Wir unterstützen Datumsformate wie `MM/DD/YYYY`, `YYYY-MM-DD` und andere Datumsformate durch intelligentes Parsen mit `dayjs`. |
| `vacation_responder_subject` | NEIN | Zeichenfolge | Betreff im Klartext für die Abwesenheitsnotiz, z. B. „Abwesend“. Wir verwenden `striptags`, um hier sämtliches HTML zu entfernen. |
| `vacation_responder_message` | NEIN | Zeichenfolge | Nachricht im Klartext für den Abwesenheitsnotizgeber, z. B. „Ich bin bis Februar abwesend.“. Wir verwenden `striptags`, um hier sämtliches HTML zu entfernen. |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Domänenalias abrufen {#retrieve-domain-alias}

Sie können einen Domänenalias entweder über seinen Wert `id` oder seinen Wert `name` abrufen.

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

### Domänenalias aktualisieren {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | NEIN | Zeichenfolge | Aliasname |
| `recipients` | NEIN | String oder Array | Liste der Empfänger (muss eine durch Zeilenumbrüche/Leerzeichen/Kommas getrennte Zeichenfolge oder ein Array gültiger E-Mail-Adressen, vollqualifizierter Domänennamen („FQDN“), IP-Adressen und/oder Webhook-URLs sein) |
| `description` | NEIN | Zeichenfolge | Aliasbeschreibung |
| `labels` | NEIN | String oder Array | Liste der Beschriftungen (muss eine durch Zeilenumbruch/Leerzeichen/Komma getrennte Zeichenfolge oder ein Array sein) |
| `has_recipient_verification` | NEIN | Boolesch | Fordern Sie die Empfänger auf, auf einen Link zur E-Mail-Bestätigung zu klicken, damit die E-Mails weitergeleitet werden (standardmäßig wird die Domäneneinstellung verwendet, wenn sie nicht explizit im Anforderungstext festgelegt wurde). |
| `is_enabled` | NEIN | Boolesch | Ob dieser Alias aktiviert oder deaktiviert werden soll (falls deaktiviert, werden E-Mails nicht weitergeleitet, sondern geben Erfolgsstatuscodes zurück). Wenn ein Wert übergeben wird, wird er mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Boolean-Wert umgewandelt. |
| `error_code_if_disabled` | NEIN | Nummer (entweder `250`, `421` oder `550`) | Eingehende E-Mails an diesen Alias werden abgelehnt, wenn `is_enabled` `false` ist und entweder `250` (stille Zustellung, z. B. Blackhole oder `/dev/null`), `421` (weiche Ablehnung; und erneuter Versuch für bis zu ~5 Tage) oder `550` dauerhaft fehlschlägt und abgelehnt wird. Standardmäßig `250`. |
| `has_imap` | NEIN | Boolesch | Ob der IMAP-Speicher für diesen Alias aktiviert oder deaktiviert werden soll (wenn deaktiviert, werden eingehende E-Mails nicht in [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) gespeichert. Wenn ein Wert übergeben wird, wird er mit [boolean](https://github.com/thenativeweb/boolean#quick-start) in einen Booleschen Wert umgewandelt) |
| `has_pgp` | NEIN | Boolesch | Ob [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) für [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) mit dem Alias `public_key` aktiviert oder deaktiviert werden soll. |
| `public_key` | NEIN | Zeichenfolge | Öffentlicher OpenPGP-Schlüssel im ASCII-Armor-Format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); z. B. GPG-Schlüssel für `support@forwardemail.net`). Dies gilt nur, wenn Sie `has_pgp` auf `true` eingestellt haben. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | NEIN | Zeichenfolge | Maximales Speicherkontingent für diesen Alias. Lassen Sie das Feld leer, um das aktuelle maximale Kontingent der Domäne zurückzusetzen, oder geben Sie einen Wert wie „1 GB“ ein, der von [bytes](https://github.com/visionmedia/bytes.js) ausgewertet wird. Dieser Wert kann nur von Domänenadministratoren angepasst werden. |
| `vacation_responder_is_enabled` | NEIN | Boolesch | Ob eine automatische Abwesenheitsnotiz aktiviert oder deaktiviert werden soll. |
| `vacation_responder_start_date` | NEIN | Zeichenfolge | Startdatum für die Abwesenheitsnotiz (falls aktiviert und hier kein Startdatum festgelegt, wird davon ausgegangen, dass die Abwesenheitsnotiz bereits gestartet ist). Wir unterstützen Datumsformate wie `MM/DD/YYYY`, `YYYY-MM-DD` und andere Datumsformate durch intelligentes Parsen mit `dayjs`. |
| `vacation_responder_end_date` | NEIN | Zeichenfolge | Enddatum für Abwesenheitsnotizen (falls aktiviert und kein Enddatum festgelegt, wird davon ausgegangen, dass die Abwesenheitsnotiz nie endet und dauerhaft antwortet). Wir unterstützen Datumsformate wie `MM/DD/YYYY`, `YYYY-MM-DD` und andere Datumsformate durch intelligentes Parsen mit `dayjs`. |
| `vacation_responder_subject` | NEIN | Zeichenfolge | Betreff im Klartext für die Abwesenheitsnotiz, z. B. „Abwesend“. Wir verwenden `striptags`, um hier sämtliches HTML zu entfernen. |
| `vacation_responder_message` | NEIN | Zeichenfolge | Nachricht im Klartext für den Abwesenheitsnotizgeber, z. B. „Ich bin bis Februar abwesend.“. Wir verwenden `striptags`, um hier sämtliches HTML zu entfernen. |

> Beispielanfrage:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Domänenalias löschen {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Beispielanfrage:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Verschlüsseln {#encrypt}

Wir ermöglichen Ihnen die kostenlose Verschlüsselung von Datensätzen auch im kostenlosen Tarif. Datenschutz sollte kein Feature sein, sondern in alle Aspekte eines Produkts integriert sein. Wie bereits in [Diskussion zu Datenschutzleitfäden](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) und [unsere GitHub-Probleme](https://github.com/forwardemail/forwardemail.net/issues/254) häufig gewünscht, haben wir dies hinzugefügt.

### TXT-Eintrag verschlüsseln {#encrypt-txt-record}

> `POST /v1/encrypt`

| Körperparameter | Erforderlich | Typ | Beschreibung |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Ja | Zeichenfolge | Jeder gültige TXT-Eintrag zur Weiterleitung von E-Mails im Klartext |

> Beispielanfrage:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
