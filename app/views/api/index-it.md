# API Email {#email-api}


## Indice {#table-of-contents}

* [Librerie](#libraries)
* [URI Base](#base-uri)
* [Autenticazione](#authentication)
  * [Autenticazione con Token API (Consigliata per la maggior parte degli endpoint)](#api-token-authentication-recommended-for-most-endpoints)
  * [Autenticazione con Credenziali Alias (Per email in uscita)](#alias-credentials-authentication-for-outbound-email)
  * [Endpoint Solo Alias](#alias-only-endpoints)
* [Errori](#errors)
* [Localizzazione](#localization)
* [Paginazione](#pagination)
* [Log](#logs)
  * [Recupera log](#retrieve-logs)
* [Account](#account)
  * [Crea account](#create-account)
  * [Recupera account](#retrieve-account)
  * [Aggiorna account](#update-account)
* [Contatti Alias (CardDAV)](#alias-contacts-carddav)
  * [Elenca contatti](#list-contacts)
  * [Crea contatto](#create-contact)
  * [Recupera contatto](#retrieve-contact)
  * [Aggiorna contatto](#update-contact)
  * [Elimina contatto](#delete-contact)
* [Calendari Alias (CalDAV)](#alias-calendars-caldav)
  * [Elenca calendari](#list-calendars)
  * [Crea calendario](#create-calendar)
  * [Recupera calendario](#retrieve-calendar)
  * [Aggiorna calendario](#update-calendar)
  * [Elimina calendario](#delete-calendar)
* [Messaggi Alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Elenca e cerca messaggi](#list-and-search-for-messages)
  * [Crea messaggio](#create-message)
  * [Recupera messaggio](#retrieve-message)
  * [Aggiorna messaggio](#update-message)
  * [Elimina messaggio](#delete-message)
* [Cartelle Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Elenca cartelle](#list-folders)
  * [Crea cartella](#create-folder)
  * [Recupera cartella](#retrieve-folder)
  * [Aggiorna cartella](#update-folder)
  * [Elimina cartella](#delete-folder)
  * [Copia cartella](#copy-folder)
* [Email in uscita](#outbound-emails)
  * [Ottieni limite email SMTP in uscita](#get-outbound-smtp-email-limit)
  * [Elenca email SMTP in uscita](#list-outbound-smtp-emails)
  * [Crea email SMTP in uscita](#create-outbound-smtp-email)
  * [Recupera email SMTP in uscita](#retrieve-outbound-smtp-email)
  * [Elimina email SMTP in uscita](#delete-outbound-smtp-email)
* [Domini](#domains)
  * [Elenca domini](#list-domains)
  * [Crea dominio](#create-domain)
  * [Recupera dominio](#retrieve-domain)
  * [Verifica record dominio](#verify-domain-records)
  * [Verifica record SMTP dominio](#verify-domain-smtp-records)
  * [Elenca password catch-all a livello di dominio](#list-domain-wide-catch-all-passwords)
  * [Crea password catch-all a livello di dominio](#create-domain-wide-catch-all-password)
  * [Rimuovi password catch-all a livello di dominio](#remove-domain-wide-catch-all-password)
  * [Aggiorna dominio](#update-domain)
  * [Elimina dominio](#delete-domain)
* [Inviti](#invites)
  * [Accetta invito dominio](#accept-domain-invite)
  * [Crea invito dominio](#create-domain-invite)
  * [Rimuovi invito dominio](#remove-domain-invite)
* [Membri](#members)
  * [Aggiorna membro dominio](#update-domain-member)
  * [Rimuovi membro dominio](#remove-domain-member)
* [Alias](#aliases)
  * [Genera una password alias](#generate-an-alias-password)
  * [Elenca alias dominio](#list-domain-aliases)
  * [Crea nuovo alias dominio](#create-new-domain-alias)
  * [Recupera alias dominio](#retrieve-domain-alias)
  * [Aggiorna alias dominio](#update-domain-alias)
  * [Elimina alias dominio](#delete-domain-alias)
* [Crittografa](#encrypt)
  * [Crittografa record TXT](#encrypt-txt-record)


## Librerie {#libraries}

Al momento non abbiamo ancora rilasciato wrapper API, ma prevediamo di farlo nel prossimo futuro. Invia una email a <api@forwardemail.net> se desideri essere avvisato quando viene rilasciato il wrapper API per un particolare linguaggio di programmazione. Nel frattempo, puoi utilizzare queste librerie HTTP consigliate nella tua applicazione, oppure semplicemente usare [curl](https://stackoverflow.com/a/27442239/3586413) come negli esempi sottostanti.

| Linguaggio | Libreria                                                               |
| ---------- | --------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                      |
| Python     | [requests](https://github.com/psf/requests)                           |
| Java       | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (siamo manutentori) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (siamo manutentori) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## Base URI {#base-uri}

Il percorso URI base HTTP corrente è: `BASE_URI`.


## Autenticazione {#authentication}

Tutti gli endpoint richiedono l'autenticazione utilizzando la [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Supportiamo due metodi di autenticazione:

### Autenticazione con Token API (Consigliata per la maggior parte degli endpoint) {#api-token-authentication-recommended-for-most-endpoints}

Imposta la tua [API key](https://forwardemail.net/my-account/security) come valore "username" con una password vuota:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Nota i due punti (`:`) dopo il token API – indicano una password vuota nel formato Basic Auth.

### Autenticazione con Credenziali Alias (Per email in uscita) {#alias-credentials-authentication-for-outbound-email}

L'endpoint [Create outbound SMTP email](#create-outbound-smtp-email) supporta anche l'autenticazione usando il tuo indirizzo email alias e una [password alias generata](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Questo metodo è utile quando si inviano email da applicazioni che già utilizzano credenziali SMTP e rende la migrazione da SMTP alla nostra API senza soluzione di continuità.

### Endpoint Solo Alias {#alias-only-endpoints}

Gli endpoint [Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3) e [Alias Folders](#alias-folders-imappop3) richiedono credenziali alias e non supportano l'autenticazione con token API.

Non preoccuparti – di seguito sono forniti esempi se non sei sicuro di cosa si tratti.


## Errori {#errors}

Se si verificano errori, il corpo della risposta della richiesta API conterrà un messaggio di errore dettagliato.

| Codice | Nome                  |
| ------ | --------------------- |
| 200    | OK                    |
| 400    | Richiesta Errata      |
| 401    | Non Autorizzato       |
| 403    | Vietato               |
| 404    | Non Trovato           |
| 429    | Troppe Richieste      |
| 500    | Errore Interno Server |
| 501    | Non Implementato      |
| 502    | Bad Gateway           |
| 503    | Servizio Non Disponibile |
| 504    | Timeout Gateway       |

> \[!TIP]
> Se ricevi un codice di stato 5xx (cosa che non dovrebbe accadere), contattaci pure all'indirizzo <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> e ti aiuteremo a risolvere il problema immediatamente.


## Localizzazione {#localization}

Il nostro servizio è tradotto in oltre 25 lingue diverse. Tutti i messaggi di risposta API sono tradotti nell'ultima lingua rilevata dell'utente che effettua la richiesta API. Puoi sovrascrivere questo comportamento passando un header `Accept-Language` personalizzato. Sentiti libero di provarlo usando il menu a tendina della lingua in fondo a questa pagina.


## Paginazione {#pagination}

> \[!NOTE]
> Dal 1° novembre 2024 gli endpoint API per [List domains](#list-domains) e [List domain aliases](#list-domain-aliases) avranno come impostazione predefinita un massimo di `1000` risultati per pagina. Se desideri attivare questo comportamento in anticipo, puoi passare `?paginate=true` come parametro querystring aggiuntivo all'URL dell'endpoint.

La paginazione è supportata da tutti gli endpoint API che elencano risultati.

Basta fornire le proprietà querystring `page` (e opzionalmente `limit`).

La proprietà `page` deve essere un numero maggiore o uguale a `1`. Se fornisci `limit` (anch'esso un numero), il valore minimo è `10` e il massimo è `50` (salvo diversa indicazione).

| Parametro Querystring | Obbligatorio | Tipo   | Descrizione                                                                                                                                               |
| --------------------- | ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | No           | Numero | Pagina dei risultati da restituire. Se non specificato, il valore di `page` sarà `1`. Deve essere un numero maggiore o uguale a `1`.                      |
| `limit`               | No           | Numero | Numero di risultati da restituire per pagina. Predefinito a `10` se non specificato. Deve essere un numero maggiore o uguale a `1` e minore o uguale a `50`. |
Per determinare se sono disponibili altri risultati, forniamo questi header di risposta HTTP (che puoi analizzare per effettuare la paginazione in modo programmatico):

| HTTP Response Header | Esempio                                                                                                                                                                                                                                                  | Descrizione                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Il numero totale di pagine disponibili.                                                                                                                                                                                                                                                                                                                            |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | La pagina corrente dei risultati restituiti (es. basata sul parametro `page` nella querystring).                                                                                                                                                                                                                                                                   |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Il numero totale di risultati nella pagina restituita (es. basato sul parametro `limit` nella querystring e sui risultati effettivamente restituiti).                                                                                                                                                                                                              |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Il numero totale di elementi disponibili su tutte le pagine.                                                                                                                                                                                                                                                                                                       |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Forniamo un header di risposta HTTP `Link` che puoi analizzare come mostrato nell'esempio. Questo è [simile a GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (es. non tutti i valori saranno forniti se non sono rilevanti o disponibili, ad esempio `"next"` non sarà fornito se non esiste un'altra pagina). |
> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Log {#logs}

### Recupera log {#retrieve-logs}

La nostra API consente programmaticamente di scaricare i log per il tuo account. Inviando una richiesta a questo endpoint verranno elaborati tutti i log del tuo account e inviati via email come allegato (file [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) compresso con [Gzip](https://en.wikipedia.org/wiki/Gzip)) una volta completato.

Questo ti permette di creare processi in background con un [Cron job](https://en.wikipedia.org/wiki/Cron) o utilizzando il nostro software di pianificazione lavori [Node.js Bree](https://github.com/breejs/bree) per ricevere i log ogni volta che desideri. Nota che questo endpoint è limitato a `10` richieste al giorno.

L'allegato ha la forma minuscola di `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` e l'email stessa contiene un breve riepilogo dei log recuperati. Puoi anche scaricare i log in qualsiasi momento da [Il mio account → Log](/my-account/logs)

> `GET /v1/logs/download`

| Parametro Querystring | Obbligatorio | Tipo          | Descrizione                                                                                                                     |
| --------------------- | ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | No           | String (FQDN) | Filtra i log per dominio completamente qualificato ("FQDN"). Se non fornito, verranno recuperati tutti i log di tutti i domini. |
| `q`                   | No           | String        | Cerca nei log per email, dominio, nome alias, indirizzo IP o data (formati `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` o `M.D.YY`).       |
| `bounce_category`     | No           | String        | Cerca nei log per una specifica categoria di rimbalzo (es. `blocklist`).                                                         |
| `response_code`       | No           | Number        | Cerca nei log per un codice di risposta di errore specifico (es. `421` o `550`).                                                 |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Esempio di Cron job (a mezzanotte ogni giorno):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Nota che puoi usare servizi come [Crontab.guru](https://crontab.guru/) per validare la sintassi della tua espressione cron.

> Esempio di Cron job (a mezzanotte ogni giorno **e con i log del giorno precedente**):

Per MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Per Linux e Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Account {#account}

### Crea account {#create-account}

> `POST /v1/account`

| Parametro Body | Obbligatorio | Tipo           | Descrizione    |
| -------------- | ------------ | -------------- | -------------- |
| `email`        | Sì           | String (Email) | Indirizzo email|
| `password`     | Sì           | String         | Password       |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Recupera account {#retrieve-account}

> `GET /v1/account`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Aggiorna account {#update-account}

> `PUT /v1/account`

| Parametro Body | Obbligatorio | Tipo           | Descrizione           |
| -------------- | ------------ | -------------- | --------------------- |
| `email`        | No           | String (Email) | Indirizzo email       |
| `given_name`   | No           | String         | Nome                  |
| `family_name`  | No           | String         | Cognome               |
| `avatar_url`   | No           | String (URL)   | Link all'immagine avatar|

> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Contatti Alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> A differenza di altri endpoint API, questi richiedono che l'[Autenticazione](#authentication) abbia "username" uguale al nome utente alias e "password" uguale alla password generata per l'alias come intestazioni di autorizzazione Basic.
> \[!WARNING]
> Questa sezione degli endpoint è in fase di sviluppo e sarà rilasciata (si spera) nel 2024. Nel frattempo, si prega di utilizzare un client IMAP dal menu a tendina "Apps" nella navigazione del nostro sito web.

### Elenca contatti {#list-contacts}

> `GET /v1/contacts`

**In arrivo**

### Crea contatto {#create-contact}

> `POST /v1/contacts`

**In arrivo**

### Recupera contatto {#retrieve-contact}

> `GET /v1/contacts/:id`

**In arrivo**

### Aggiorna contatto {#update-contact}

> `PUT /v1/contacts/:id`

**In arrivo**

### Elimina contatto {#delete-contact}

> `DELETE /v1/contacts/:id`

**In arrivo**


## Alias Calendari (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> A differenza di altri endpoint API, questi richiedono [Autenticazione](#authentication) con "username" uguale al nome utente alias e "password" uguale alla password generata per l'alias come intestazioni di autorizzazione Basic.

> \[!WARNING]
> Questa sezione degli endpoint è in fase di sviluppo e sarà rilasciata (si spera) nel 2024. Nel frattempo, si prega di utilizzare un client IMAP dal menu a tendina "Apps" nella navigazione del nostro sito web.

### Elenca calendari {#list-calendars}

> `GET /v1/calendars`

**In arrivo**

### Crea calendario {#create-calendar}

> `POST /v1/calendars`

**In arrivo**

### Recupera calendario {#retrieve-calendar}

> `GET /v1/calendars/:id`

**In arrivo**

### Aggiorna calendario {#update-calendar}

> `PUT /v1/calendars/:id`

**In arrivo**

### Elimina calendario {#delete-calendar}

> `DELETE /v1/calendars/:id`

**In arrivo**


## Alias Messaggi (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> A differenza di altri endpoint API, questi richiedono [Autenticazione](#authentication) con "username" uguale al nome utente alias e "password" uguale alla password generata per l'alias come intestazioni di autorizzazione Basic.

> \[!WARNING]
> Questa sezione degli endpoint è in fase di sviluppo e sarà rilasciata (si spera) nel 2024. Nel frattempo, si prega di utilizzare un client IMAP dal menu a tendina "Apps" nella navigazione del nostro sito web.

Si prega di assicurarsi di aver seguito le istruzioni di configurazione per il proprio dominio.

Queste istruzioni si trovano nella nostra sezione FAQ [Supportate la ricezione di email con IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Elenca e cerca messaggi {#list-and-search-for-messages}

> `GET /v1/messages`

**In arrivo**

### Crea messaggio {#create-message}

> \[!NOTE]
> Questo **NON** invierà un'email – aggiungerà semplicemente il messaggio alla cartella della tua casella di posta (ad esempio, è simile al comando IMAP `APPEND`). Se desideri inviare un'email, consulta [Crea email SMTP in uscita](#create-outbound-smtp-email) qui sotto. Dopo aver creato l'email SMTP in uscita, puoi quindi aggiungere una copia di essa usando questo endpoint alla casella di posta del tuo alias per scopi di archiviazione.

> `POST /v1/messages`

**In arrivo**

### Recupera messaggio {#retrieve-message}

> `GET /v1/messages/:id`

**In arrivo**

### Aggiorna messaggio {#update-message}

> `PUT /v1/messages/:id`

**In arrivo**

### Elimina messaggio {#delete-message}

> `DELETE /v1/messages:id`

**In arrivo**


## Alias Cartelle (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Gli endpoint delle cartelle con il percorso della cartella <code>/v1/folders/:path</code> come endpoint sono intercambiabili con l'ID della cartella <code>:id</code>. Ciò significa che puoi riferirti alla cartella sia tramite il suo <code>path</code> sia tramite il suo valore <code>id</code>.

> \[!WARNING]
> Questa sezione degli endpoint è in fase di sviluppo e sarà rilasciata (si spera) nel 2024. Nel frattempo, si prega di utilizzare un client IMAP dal menu a tendina "Apps" nella navigazione del nostro sito web.

### Elenca cartelle {#list-folders}

> `GET /v1/folders`

**In arrivo**

### Crea cartella {#create-folder}

> `POST /v1/folders`

**In arrivo**

### Recupera cartella {#retrieve-folder}

> `GET /v1/folders/:id`

**In arrivo**

### Aggiorna cartella {#update-folder}

> `PUT /v1/folders/:id`

**In arrivo**

### Elimina cartella {#delete-folder}

> `DELETE /v1/folders/:id`

**In arrivo**

### Copia cartella {#copy-folder}

> `POST /v1/folders/:id/copy`

**In arrivo**


## Email in uscita {#outbound-emails}

Si prega di assicurarsi di aver seguito le istruzioni di configurazione per il proprio dominio.

Queste istruzioni si trovano in [Il mio account → Domini → Impostazioni → Configurazione SMTP in uscita](/my-account/domains). Devi assicurarti della configurazione di DKIM, Return-Path e DMARC per l'invio SMTP in uscita con il tuo dominio.
### Ottieni limite email SMTP in uscita {#get-outbound-smtp-email-limit}

Questo è un endpoint semplice che restituisce un oggetto JSON contenente il `count` e il `limit` per il numero di messaggi SMTP in uscita giornalieri su base per account.

> `GET /v1/emails/limit`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Elenca email SMTP in uscita {#list-outbound-smtp-emails}

Nota che questo endpoint non restituisce i valori delle proprietà per il `message`, `headers` né `rejectedErrors` di un'email.

Per restituire quelle proprietà e i loro valori, usa l'endpoint [Recupera email](#retrieve-email) con un ID email.

> `GET /v1/emails`

| Parametro Querystring | Obbligatorio | Tipo                      | Descrizione                                                                                                                                      |
| --------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No           | Stringa (RegExp supportata) | Cerca email tramite metadati                                                                                                                    |
| `domain`              | No           | Stringa (RegExp supportata) | Cerca email tramite nome dominio                                                                                                                |
| `sort`                | No           | Stringa                    | Ordina per un campo specifico (prefissa con un singolo trattino `-` per ordinare in direzione inversa rispetto a quel campo).  Di default è `created_at` se non impostato. |
| `page`                | No           | Numero                     | Vedi [Paginazione](#pagination) per maggiori dettagli                                                                                           |
| `limit`               | No           | Numero                     | Vedi [Paginazione](#pagination) per maggiori dettagli                                                                                           |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Crea email SMTP in uscita {#create-outbound-smtp-email}

La nostra API per creare un'email è ispirata e sfrutta la configurazione delle opzioni messaggio di Nodemailer. Consulta la [configurazione messaggio di Nodemailer](https://nodemailer.com/message/) per tutti i parametri del corpo qui sotto.

Nota che, fatta eccezione per `envelope` e `dkim` (poiché li impostiamo automaticamente per te), supportiamo tutte le opzioni di Nodemailer. Impostiamo automaticamente le opzioni `disableFileAccess` e `disableUrlAccess` a `true` per motivi di sicurezza.

Devi passare o l'unica opzione `raw` con la tua email completa raw inclusi gli header **oppure** passare i singoli parametri del corpo elencati di seguito.

Questo endpoint API codificherà automaticamente le emoji per te se sono presenti negli header (es. una riga oggetto `Subject: 🤓 Hello` viene convertita automaticamente in `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Il nostro obiettivo è stato creare un'API email estremamente amichevole per gli sviluppatori e a prova di errore.

**Autenticazione:** Questo endpoint supporta sia [l'autenticazione con token API](#api-token-authentication-recommended-for-most-endpoints) sia [l'autenticazione con credenziali alias](#alias-credentials-authentication-for-outbound-email). Consulta la sezione [Autenticazione](#authentication) sopra per i dettagli.

> `POST /v1/emails`

| Parametro Corpo   | Obbligatorio | Tipo             | Descrizione                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | No           | Stringa (Email)  | L'indirizzo email del mittente (deve esistere come alias del dominio).                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | No           | Stringa o Array  | Lista separata da virgole o un Array di destinatari per l'header "To".                                                                                                                                                                                                                                                                                                                                                                                          |
| `cc`             | No           | Stringa o Array  | Lista separata da virgole o un Array di destinatari per l'header "Cc".                                                                                                                                                                                                                                                                                                                                                                                          |
| `bcc`            | No           | Stringa o Array  | Lista separata da virgole o un Array di destinatari per l'header "Bcc".                                                                                                                                                                                                                                                                                                                                                                                         |
| `subject`        | No           | Stringa          | L'oggetto dell'email.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `text`           | No           | Stringa o Buffer | La versione in testo semplice del messaggio.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `html`           | No           | Stringa o Buffer | La versione HTML del messaggio.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `attachments`    | No           | Array            | Un array di oggetti allegato (vedi [campi comuni di Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                |
| `sender`         | No           | Stringa          | L'indirizzo email per l'header "Sender" (vedi [campi più avanzati di Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                       |
| `replyTo`        | No           | Stringa          | L'indirizzo email per l'header "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `inReplyTo`      | No           | Stringa          | Il Message-ID a cui il messaggio risponde.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`     | No           | Stringa o Array  | Lista separata da spazi o un Array di Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `attachDataUrls` | No           | Booleano         | Se `true` converte le immagini `data:` nel contenuto HTML del messaggio in allegati incorporati.                                                                                                                                                                                                                                                                                                                                                                |
| `watchHtml`      | No           | Stringa          | Una versione HTML specifica per Apple Watch del messaggio ([secondo la documentazione di Nodemailer](https://nodemailer.com/message/#content-options]), gli ultimi modelli di watch non richiedono che sia impostata).                                                                                                                                                                                                                                            |
| `amp`            | No           | Stringa          | Una versione HTML specifica AMP4EMAIL del messaggio (vedi [esempio di Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                 |
| `icalEvent`      | No           | Oggetto          | Un evento iCalendar da usare come contenuto alternativo del messaggio (vedi [eventi calendario di Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                               |
| `alternatives`   | No           | Array            | Un Array di contenuti alternativi del messaggio (vedi [contenuti alternativi di Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                    |
| `encoding`       | No           | Stringa          | Codifica per le stringhe di testo e HTML (default `"utf-8"`, supporta anche `"hex"` e `"base64"`).                                                                                                                                                                                                                                                                                                                                                                |
| `raw`            | No           | Stringa o Buffer | Un messaggio generato personalizzato in formato RFC822 da usare (invece di uno generato da Nodemailer – vedi [sorgente personalizzata di Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                           |
| `textEncoding`   | No           | Stringa          | Codifica da forzare per i valori di testo (può essere `"quoted-printable"` o `"base64"`). Il valore predefinito è il valore più vicino rilevato (per ASCII usa `"quoted-printable"`).                                                                                                                                                                                                                                                                           |
| `priority`       | No           | Stringa          | Livello di priorità per l'email (può essere `"high"`, `"normal"` (default), o `"low"`). Nota che un valore `"normal"` non imposta un header di priorità (questo è il comportamento predefinito). Se viene impostato un valore `"high"` o `"low"`, allora gli header `X-Priority`, `X-MSMail-Priority` e `Importance` [verranno impostati di conseguenza](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | No           | Oggetto o Array  | Un Oggetto o un Array di campi header aggiuntivi da impostare (vedi [header personalizzati di Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                      |
| `messageId`      | No           | Stringa          | Un valore opzionale Message-ID per l'header "Message-ID" (verrà creato automaticamente un valore di default se non impostato – nota che il valore dovrebbe [aderire alla specifica RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                               |
| `date`           | No           | Stringa o Data   | Un valore Date opzionale che verrà usato se l'header Date manca dopo il parsing, altrimenti verrà usata la stringa UTC corrente se non impostato. L'header date non può essere più di 30 giorni avanti rispetto all'ora corrente.                                                                                                                                                                                                                                |
| `list`           | No           | Oggetto          | Un Oggetto opzionale di header `List-*` (vedi [header lista di Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                        |
> Richiesta di esempio (Token API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Richiesta di esempio (Credenziali Alias):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Richiesta di esempio (Email Raw):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Recupera email SMTP in uscita {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Richiesta di esempio:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Elimina email SMTP in uscita {#delete-outbound-smtp-email}

L'eliminazione dell'email imposterà lo stato su `"rejected"` (e successivamente non la processerà nella coda) se e solo se lo stato attuale è uno tra `"pending"`, `"queued"`, o `"deferred"`. Potremmo eliminare automaticamente le email dopo 30 giorni dalla loro creazione e/o invio – pertanto dovresti conservare una copia delle email SMTP in uscita nel tuo client, database o applicazione. Puoi fare riferimento al nostro valore ID email nel tuo database se desideri – questo valore viene restituito sia dagli endpoint [Create email](#create-email) che [Retrieve email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Richiesta di esempio:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domini {#domains}

> \[!TIP]
> Gli endpoint dominio con il nome di dominio <code>/v1/domains/:domain_name</code> come endpoint sono intercambiabili con l'ID del dominio <code>:domain_id</code>. Ciò significa che puoi fare riferimento al dominio sia tramite il suo valore <code>name</code> che <code>id</code>.

### Elenca domini {#list-domains}

> \[!NOTE]
> Dal 1° novembre 2024 gli endpoint API per [Elenca domini](#list-domains) e [Elenca alias dominio](#list-domain-aliases) avranno come default `1000` risultati massimi per pagina. Se desideri aderire anticipatamente a questo comportamento, puoi passare `?paginate=true` come parametro querystring aggiuntivo all'URL della query dell'endpoint. Consulta [Pagination](#pagination) per maggiori dettagli.

> `GET /v1/domains`

| Parametro Querystring | Obbligatorio | Tipo                      | Descrizione                                                                                                                                      |
| --------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No           | Stringa (RegExp supportata) | Cerca domini per nome                                                                                                                           |
| `name`                | No           | Stringa (RegExp supportata) | Cerca domini per nome                                                                                                                           |
| `sort`                | No           | Stringa                    | Ordina per un campo specifico (prefissa con un singolo trattino `-` per ordinare in direzione inversa rispetto a quel campo).  Default a `created_at` se non impostato. |
| `page`                | No           | Numero                     | Vedi [Pagination](#pagination) per maggiori dettagli                                                                                           |
| `limit`               | No           | Numero                     | Vedi [Pagination](#pagination) per maggiori dettagli                                                                                           |

> Richiesta di esempio:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Crea dominio {#create-domain}

> `POST /v1/domains`

| Parametro Body                 | Obbligatorio | Tipo                                          | Descrizione                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | ------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Sì           | Stringa (FQDN o IP)                           | Nome di dominio completamente qualificato ("FQDN") o indirizzo IP                                                                                                                                                                                                                                                    |
| `team_domain`                  | No           | Stringa (ID dominio o nome dominio; FQDN)    | Assegna automaticamente questo dominio allo stesso team di un altro dominio. Ciò significa che tutti i membri di questo dominio saranno assegnati come membri del team, e il `plan` sarà automaticamente impostato su `team`. Puoi impostarlo su `"none"` se necessario per disabilitarlo esplicitamente, ma non è obbligatorio. |
| `plan`                         | No           | Stringa (enumerabile)                         | Tipo di piano (deve essere `"free"`, `"enhanced_protection"`, o `"team"`, default a `"free"` o al piano a pagamento attuale dell'utente se presente)                                                                                                                                                                |
| `catchall`                     | No           | Stringa (indirizzi email delimitati) o Booleano | Crea un alias catch-all predefinito, default a `true` (se `true` utilizzerà l'indirizzo email dell'utente API come destinatario, se `false` non verrà creato alcun catch-all). Se viene passata una Stringa, è una lista delimitata di indirizzi email da usare come destinatari (separati da a capo, spazio e/o virgola)     |
| `has_adult_content_protection` | No           | Booleano                                      | Se abilitare la protezione contenuti per adulti dello Spam Scanner su questo dominio                                                                                                                                                                                                                                  |
| `has_phishing_protection`      | No           | Booleano                                      | Se abilitare la protezione phishing dello Spam Scanner su questo dominio                                                                                                                                                                                                                                             |
| `has_executable_protection`    | No           | Booleano                                      | Se abilitare la protezione eseguibili dello Spam Scanner su questo dominio                                                                                                                                                                                                                                           |
| `has_virus_protection`         | No           | Booleano                                      | Se abilitare la protezione virus dello Spam Scanner su questo dominio                                                                                                                                                                                                                                                |
| `has_recipient_verification`   | No           | Booleano                                      | Impostazione predefinita globale del dominio per richiedere ai destinatari alias di cliccare un link di verifica email affinché le email vengano inoltrate                                                                                                                                                            |
| `ignore_mx_check`              | No           | Booleano                                      | Se ignorare il controllo del record MX sul dominio per la verifica. Questo è principalmente per utenti con regole avanzate di configurazione MX che devono mantenere il loro scambio MX esistente e inoltrare al nostro.                                                                                              |
| `retention_days`               | No           | Numero                                        | Intero tra `0` e `30` che corrisponde al numero di giorni di conservazione per memorizzare le email SMTP in uscita una volta consegnate con successo o con errore permanente. Default a `0`, il che significa che le email SMTP in uscita vengono eliminate e oscurate immediatamente per la tua sicurezza.             |
| `bounce_webhook`               | No           | Stringa (URL) o Booleano (false)              | L'URL webhook `http://` o `https://` a tua scelta per inviare webhook di bounce. Invieremo una richiesta `POST` a questo URL con informazioni sui fallimenti SMTP in uscita (es. fallimenti soft o hard – così puoi gestire i tuoi iscritti e gestire programmaticamente la tua email in uscita).                      |
| `max_quota_per_alias`          | No           | Stringa                                       | Quota massima di archiviazione per alias su questo nome di dominio. Inserisci un valore come "1 GB" che sarà interpretato da [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                       |
> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Recupera dominio {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verifica record dominio {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifica record SMTP dominio {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Elenca password catch-all a livello di dominio {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Crea password catch-all a livello di dominio {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parametro nel body | Obbligatorio | Tipo   | Descrizione                                                                                                                                                                                                                  |
| ------------------ | ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`     | No           | String | La tua nuova password personalizzata da usare per la password catch-all a livello di dominio. Nota che puoi lasciare questo campo vuoto o assente del tutto nel corpo della richiesta API se vuoi ottenere una password forte generata casualmente. |
| `description`      | No           | String | Descrizione solo a scopo organizzativo.                                                                                                                                                                                     |

> Esempio di richiesta:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Rimuovi password catch-all a livello di dominio {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Aggiorna dominio {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parametro nel body             | Obbligatorio | Tipo                            | Descrizione                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | No           | String o Number                 | Porta personalizzata da configurare per l'inoltro SMTP (default è `"25"`)                                                                                                                                                                                                                     |
| `has_adult_content_protection`| No           | Boolean                        | Se abilitare la protezione contenuti per adulti dello Spam Scanner su questo dominio                                                                                                                                                                                                         |
| `has_phishing_protection`     | No           | Boolean                        | Se abilitare la protezione anti-phishing dello Spam Scanner su questo dominio                                                                                                                                                                                                                |
| `has_executable_protection`   | No           | Boolean                        | Se abilitare la protezione eseguibili dello Spam Scanner su questo dominio                                                                                                                                                                                                                   |
| `has_virus_protection`        | No           | Boolean                        | Se abilitare la protezione virus dello Spam Scanner su questo dominio                                                                                                                                                                                                                        |
| `has_recipient_verification`  | No           | Boolean                        | Impostazione globale predefinita del dominio per richiedere ai destinatari alias di cliccare un link di verifica email affinché le email vengano inoltrate                                                                                                                                   |
| `ignore_mx_check`             | No           | Boolean                        | Se ignorare il controllo del record MX sul dominio per la verifica. Questo è principalmente per utenti che hanno regole avanzate di configurazione dello scambio MX e devono mantenere il loro scambio MX esistente e inoltrare al nostro.                                                |
| `retention_days`              | No           | Number                         | Intero tra `0` e `30` che corrisponde al numero di giorni di conservazione per memorizzare le email SMTP in uscita una volta consegnate con successo o con errore permanente. Il valore predefinito è `0`, che significa che le email SMTP in uscita vengono eliminate e oscurate immediatamente per la tua sicurezza. |
| `bounce_webhook`              | No           | String (URL) o Boolean (false) | L'URL webhook `http://` o `https://` a tua scelta per inviare i webhook di bounce. Invieremo una richiesta `POST` a questo URL con informazioni sui fallimenti SMTP in uscita (es. fallimenti soft o hard – così puoi gestire i tuoi iscritti e gestire programmaticamente le tue email in uscita). |
| `max_quota_per_alias`         | No           | String                         | Quota massima di archiviazione per alias su questo nome di dominio. Inserisci un valore come "1 GB" che sarà interpretato da [bytes](https://github.com/visionmedia/bytes.js).                                                                                                              |
> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Elimina dominio {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Inviti {#invites}

### Accetta invito dominio {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Crea invito dominio {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parametro nel corpo | Obbligatorio | Tipo                | Descrizione                                                                               |
| ------------------- | ------------ | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`             | Sì           | Stringa (Email)     | Indirizzo email da invitare alla lista dei membri del dominio                             |
| `group`             | Sì           | Stringa (enumerabile) | Gruppo a cui aggiungere l'utente nella membership del dominio (può essere `"admin"` o `"user"`) |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Se l'utente invitato è già un membro accettato di altri domini di cui l'amministratore che lo invita è membro, allora l'invito sarà accettato automaticamente e non verrà inviata alcuna email.

### Rimuovi invito dominio {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parametro nel corpo | Obbligatorio | Tipo           | Descrizione                                      |
| ------------------- | ------------ | -------------- | ------------------------------------------------ |
| `email`             | Sì           | Stringa (Email) | Indirizzo email da rimuovere dalla lista dei membri del dominio |

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Membri {#members}

### Aggiorna membro dominio {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parametro nel corpo | Obbligatorio | Tipo                | Descrizione                                                                                  |
| ------------------- | ------------ | ------------------- | -------------------------------------------------------------------------------------------- |
| `group`             | Sì           | Stringa (enumerabile) | Gruppo a cui aggiornare l'utente nella membership del dominio (può essere `"admin"` o `"user"`) |

> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Rimuovi membro dominio {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Alias {#aliases}

### Genera una password per alias {#generate-an-alias-password}

Nota che se non invii istruzioni via email, allora username e password saranno nel corpo della risposta JSON di una richiesta riuscita nel formato `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parametro nel corpo    | Obbligatorio | Tipo    | Descrizione                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`        | No           | Stringa | La tua nuova password personalizzata da usare per l'alias. Nota che puoi lasciare questo campo vuoto o assente del tutto nella richiesta API se desideri ottenere una password forte generata casualmente.                                                                                         |
| `password`            | No           | Stringa | Password esistente per l'alias per cambiare la password senza cancellare l'archivio IMAP esistente (vedi l'opzione `is_override` qui sotto se non hai più la password esistente).                                                                                                                    |
| `is_override`         | No           | Booleano| **USARE CON CAUTELA**: Questo sovrascriverà completamente la password e il database esistenti dell'alias, cancellando permanentemente l'archivio IMAP esistente e resettando completamente il database email SQLite dell'alias. Effettua un backup se possibile se hai una casella di posta esistente collegata a questo alias. |
| `emailed_instructions`| No           | Stringa | Indirizzo email a cui inviare la password dell'alias e le istruzioni di configurazione.                                                                                                                                                                                                            |
> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Elenca alias di dominio {#list-domain-aliases}

> \[!NOTE]
> A partire dal 1° novembre 2024, gli endpoint API per [Elenca domini](#list-domains) e [Elenca alias di dominio](#list-domain-aliases) avranno come impostazione predefinita un massimo di `1000` risultati per pagina. Se desideri aderire anticipatamente a questo comportamento, puoi passare `?paginate=true` come parametro aggiuntivo nella querystring all'URL dell'endpoint. Consulta [Paginazione](#pagination) per maggiori dettagli.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parametro Querystring | Obbligatorio | Tipo                      | Descrizione                                                                                                                                      |
| --------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No           | Stringa (supporta RegExp) | Cerca alias in un dominio per nome, etichetta o destinatario                                                                                     |
| `name`                | No           | Stringa (supporta RegExp) | Cerca alias in un dominio per nome                                                                                                              |
| `recipient`           | No           | Stringa (supporta RegExp) | Cerca alias in un dominio per destinatario                                                                                                      |
| `sort`                | No           | Stringa                   | Ordina per un campo specifico (prefissa con un singolo trattino `-` per ordinare in direzione inversa rispetto a quel campo).  Predefinito `created_at` se non impostato. |
| `page`                | No           | Numero                    | Consulta [Paginazione](#pagination) per maggiori dettagli                                                                                       |
| `limit`               | No           | Numero                    | Consulta [Paginazione](#pagination) per maggiori dettagli                                                                                       |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Crea nuovo alias di dominio {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parametro Body                  | Obbligatorio | Tipo                                   | Descrizione                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | No           | Stringa                                 | Nome alias (se non fornito o vuoto, viene generato un alias casuale)                                                                                                                                                                                                                                                                                                                        |
| `recipients`                    | No           | Stringa o Array                        | Elenco destinatari (deve essere una stringa separata da interruzioni di linea/spazi/virgole o un array di indirizzi email validi, nomi di dominio completamente qualificati ("FQDN"), indirizzi IP e/o URL webhook – e se non fornito o è un array vuoto, allora l'email dell'utente che effettua la richiesta API sarà impostata come destinatario)                                                                                     |
| `description`                   | No           | Stringa                                 | Descrizione alias                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | No           | Stringa o Array                        | Elenco di etichette (deve essere una stringa separata da interruzioni di linea/spazi/virgole o un array)                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | No           | Booleano                               | Richiedi ai destinatari di cliccare un link di verifica email affinché le email vengano inoltrate (predefinito impostazione del dominio se non esplicitamente impostato nel corpo della richiesta)                                                                                                                                                                                         |
| `is_enabled`                    | No           | Booleano                               | Se abilitare o disabilitare questo alias (se disabilitato, le email non saranno instradate da nessuna parte ma restituiranno codici di stato di successo). Se viene passato un valore, viene convertito in booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | No           | Numero (può essere `250`, `421` o `550`) | Le email in arrivo a questo alias verranno rifiutate se `is_enabled` è `false` con codice `250` (consegna silenziosa a nessuna destinazione, es. blackhole o `/dev/null`), `421` (rifiuto temporaneo; e ritenta per circa 5 giorni) o `550` (errore permanente e rifiuto). Predefinito `250`.                                                                                                                               |
| `has_imap`                      | No           | Booleano                               | Se abilitare o disabilitare l'archiviazione IMAP per questo alias (se disabilitato, le email in arrivo non verranno archiviate su [archiviazione IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Se viene passato un valore, viene convertito in booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | No           | Booleano                               | Se abilitare o disabilitare la [crittografia OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) per [archiviazione email crittografata IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) usando la `public_key` dell'alias.                                                                                                         |
| `public_key`                    | No           | Stringa                                 | Chiave pubblica OpenPGP in formato ASCII Armor ([clicca qui per vedere un esempio](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); es. chiave GPG per `support@forwardemail.net`). Si applica solo se `has_pgp` è impostato a `true`. [Scopri di più sulla crittografia end-to-end nella nostra FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | No           | Stringa                                 | Quota massima di archiviazione per questo alias. Lascia vuoto per resettare alla quota massima corrente del dominio o inserisci un valore come "1 GB" che sarà interpretato da [bytes](https://github.com/visionmedia/bytes.js). Questo valore può essere modificato solo dagli amministratori del dominio.                                                                                  |
| `vacation_responder_is_enabled` | No           | Booleano                               | Se abilitare o disabilitare una risposta automatica di assenza                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | No           | Stringa                                 | Data di inizio per la risposta di assenza (se abilitata e non impostata qui, si assume che sia già iniziata). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati tramite parsing intelligente con `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | No           | Stringa                                 | Data di fine per la risposta di assenza (se abilitata e non impostata qui, si assume che non finisca mai e risponda per sempre). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati tramite parsing intelligente con `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | No           | Stringa                                 | Oggetto in testo semplice per la risposta di assenza, es. "Fuori ufficio". Usiamo `striptags` per rimuovere tutto l'HTML qui.                                                                                                                                                                                                                                                                 |
| `vacation_responder_message`    | No           | Stringa                                 | Messaggio in testo semplice per la risposta di assenza, es. "Sarò fuori ufficio fino a febbraio.". Usiamo `striptags` per rimuovere tutto l'HTML qui.                                                                                                                                                                                                                                         |
> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Recupera alias di dominio {#retrieve-domain-alias}

Puoi recuperare un alias di dominio tramite il suo valore `id` o `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Aggiorna alias di dominio {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parametro nel corpo             | Obbligatorio | Tipo                                   | Descrizione                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | No           | String                                 | Nome alias                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | No           | String o Array                        | Elenco dei destinatari (deve essere una Stringa separata da interruzioni di linea/spazi/virgole o un Array di indirizzi email validi, nomi di dominio completamente qualificati ("FQDN"), indirizzi IP e/o URL webhook)                                                                                                                                                                       |
| `description`                   | No           | String                                 | Descrizione alias                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | No           | String o Array                        | Elenco di etichette (deve essere una Stringa separata da interruzioni di linea/spazi/virgole o un Array)                                                                                                                                                                                                                                                                                     |
| `has_recipient_verification`    | No           | Boolean                                | Richiedere ai destinatari di cliccare un link di verifica email affinché le email vengano inoltrate (predefinito alle impostazioni del dominio se non specificato esplicitamente nel corpo della richiesta)                                                                                                                                                                                   |
| `is_enabled`                    | No           | Boolean                                | Se abilitare o disabilitare questo alias (se disabilitato, le email non verranno instradate da nessuna parte ma restituiranno codici di stato di successo). Se viene passato un valore, viene convertito in booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                   |
| `error_code_if_disabled`        | No           | Numero (può essere `250`, `421` o `550`) | Le email in arrivo a questo alias verranno rifiutate se `is_enabled` è `false` con codice `250` (consegna silenziosa a nessuna destinazione, es. blackhole o `/dev/null`), `421` (rifiuto temporaneo; e ritenta per circa 5 giorni) o `550` (errore permanente e rifiuto). Predefinito a `250`.                                                                                              |
| `has_imap`                      | No           | Boolean                                | Se abilitare o disabilitare l'archiviazione IMAP per questo alias (se disabilitato, le email in arrivo non verranno archiviate su [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Se viene passato un valore, viene convertito in booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                          |
| `has_pgp`                       | No           | Boolean                                | Se abilitare o disabilitare la [crittografia OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) per l'[archiviazione email crittografata IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) usando la `public_key` dell'alias.                                                                                         |
| `public_key`                    | No           | String                                 | Chiave pubblica OpenPGP in formato ASCII Armor ([clicca qui per vedere un esempio](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); es. chiave GPG per `support@forwardemail.net`). Si applica solo se `has_pgp` è impostato su `true`. [Scopri di più sulla crittografia end-to-end nella nostra FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | No           | String                                 | Quota massima di archiviazione per questo alias. Lascia vuoto per resettare alla quota massima corrente del dominio oppure inserisci un valore come "1 GB" che verrà interpretato da [bytes](https://github.com/visionmedia/bytes.js). Questo valore può essere modificato solo dagli amministratori del dominio.                                                                         |
| `vacation_responder_is_enabled` | No           | Boolean                                | Se abilitare o disabilitare una risposta automatica di assenza.                                                                                                                                                                                                                                                                                                                             |
| `vacation_responder_start_date` | No           | String                                 | Data di inizio per la risposta di assenza (se abilitata e non impostata qui, si assume che sia già iniziata). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati tramite parsing intelligente con `dayjs`.                                                                                                                                                            |
| `vacation_responder_end_date`   | No           | String                                 | Data di fine per la risposta di assenza (se abilitata e non impostata qui, si assume che non finisca mai e risponda per sempre). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati tramite parsing intelligente con `dayjs`.                                                                                                                                          |
| `vacation_responder_subject`    | No           | String                                 | Oggetto in testo semplice per la risposta di assenza, es. "Fuori ufficio". Usiamo `striptags` per rimuovere tutto l'HTML qui.                                                                                                                                                                                                                                                               |
| `vacation_responder_message`    | No           | String                                 | Messaggio in testo semplice per la risposta di assenza, es. "Sarò fuori ufficio fino a febbraio.". Usiamo `striptags` per rimuovere tutto l'HTML qui.                                                                                                                                                                                                                                       |
> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Elimina alias dominio {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Crittografa {#encrypt}

Consentiamo di crittografare i record anche nel piano gratuito senza costi. La privacy non dovrebbe essere una funzionalità, dovrebbe essere intrinsecamente integrata in tutti gli aspetti di un prodotto. Come molto richiesto in una [discussione di Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e nelle [nostre issue su GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) abbiamo aggiunto questa funzione.

### Crittografa record TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parametro nel corpo | Obbligatorio | Tipo   | Descrizione                                  |
| ------------------- | ------------ | ------ | -------------------------------------------- |
| `input`             | Sì           | String | Qualsiasi record TXT in chiaro valido di Forward Email |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
