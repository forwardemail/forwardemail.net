# API e-mail {#email-api}

## Indice {#table-of-contents}

* [Biblioteche](#libraries)
* [URI di base](#base-uri)
* [Autenticazione](#authentication)
* [Errori](#errors)
* [Localizzazione](#localization)
* [Paginazione](#pagination)
* [Registri](#logs)
  * [Recupera i registri](#retrieve-logs)
* [Account](#account)
  * [Creare un account](#create-account)
  * [Recupera account](#retrieve-account)
  * [Aggiorna account](#update-account)
* [Contatti alias (CardDAV)](#alias-contacts-carddav)
  * [Elenca i contatti](#list-contacts)
  * [Crea contatto](#create-contact)
  * [Recupera contatto](#retrieve-contact)
  * [Aggiorna contatto](#update-contact)
  * [Elimina contatto](#delete-contact)
* [Calendari Alias (CalDAV)](#alias-calendars-caldav)
  * [Elenca i calendari](#list-calendars)
  * [Crea calendario](#create-calendar)
  * [Recupera il calendario](#retrieve-calendar)
  * [Aggiorna il calendario](#update-calendar)
  * [Elimina calendario](#delete-calendar)
* [Messaggi alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Elenca e cerca i messaggi](#list-and-search-for-messages)
  * [Crea messaggio](#create-message)
  * [Recupera messaggio](#retrieve-message)
  * [Messaggio di aggiornamento](#update-message)
  * [Elimina messaggio](#delete-message)
* [Cartelle alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Elenca le cartelle](#list-folders)
  * [Crea cartella](#create-folder)
  * [Recupera cartella](#retrieve-folder)
  * [Aggiorna cartella](#update-folder)
  * [Elimina cartella](#delete-folder)
  * [Copia cartella](#copy-folder)
* [Email in uscita](#outbound-emails)
  * [Ottieni il limite di posta elettronica SMTP in uscita](#get-outbound-smtp-email-limit)
  * [Elenca le email SMTP in uscita](#list-outbound-smtp-emails)
  * [Crea email SMTP in uscita](#create-outbound-smtp-email)
  * [Recupera email SMTP in uscita](#retrieve-outbound-smtp-email)
  * [Elimina email SMTP in uscita](#delete-outbound-smtp-email)
* [Domini](#domains)
  * [Elenca i domini](#list-domains)
  * [Crea dominio](#create-domain)
  * [Recupera dominio](#retrieve-domain)
  * [Verificare i record di dominio](#verify-domain-records)
  * [Verifica i record SMTP del dominio](#verify-domain-smtp-records)
  * [Elenca le password catch-all per l'intero dominio](#list-domain-wide-catch-all-passwords)
  * [Crea una password catch-all per l'intero dominio](#create-domain-wide-catch-all-password)
  * [Rimuovi la password catch-all per l'intero dominio](#remove-domain-wide-catch-all-password)
  * [Aggiorna dominio](#update-domain)
  * [Elimina dominio](#delete-domain)
* [Inviti](#invites)
  * [Accetta l'invito al dominio](#accept-domain-invite)
  * [Crea invito al dominio](#create-domain-invite)
  * [Rimuovi invito al dominio](#remove-domain-invite)
* [Membri](#members)
  * [Aggiorna membro del dominio](#update-domain-member)
  * [Rimuovi membro del dominio](#remove-domain-member)
* [Alias](#aliases)
  * [Genera una password alias](#generate-an-alias-password)
  * [Elenca gli alias di dominio](#list-domain-aliases)
  * [Crea un nuovo alias di dominio](#create-new-domain-alias)
  * [Recupera l'alias del dominio](#retrieve-domain-alias)
  * [Aggiorna l'alias del dominio](#update-domain-alias)
  * [Elimina l'alias di dominio](#delete-domain-alias)
* [Crittografare](#encrypt)
  * [Crittografa record TXT](#encrypt-txt-record)

## Biblioteche {#libraries}

Al momento non abbiamo ancora rilasciato alcun wrapper API, ma prevediamo di farlo a breve. Invia un'email a <api@forwardemail.net> se desideri essere avvisato quando verrà rilasciato il wrapper API di un particolare linguaggio di programmazione. Nel frattempo, puoi utilizzare queste librerie di richiesta HTTP consigliate nella tua applicazione, oppure semplicemente utilizzare [arricciare](https://stackoverflow.com/a/27442239/3586413) come negli esempi seguenti.

| Lingua | Biblioteca |
| ---------- | ---------------------------------------------------------------------- |
| Rubino | [Faraday](https://github.com/lostisland/faraday) |
| Pitone | [requests](https://github.com/psf/requests) |
| Giava | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (siamo i manutentori) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (siamo i manutentori) |
| Andare | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## URI di base {#base-uri}

L'attuale percorso URI di base HTTP è: `BASE_URI`.

## Autenticazione {#authentication}

Tutti gli endpoint richiedono che [chiave API](https://forwardemail.net/my-account/security) sia impostato come valore "username" dell'intestazione [Autorizzazione di base](https://en.wikipedia.org/wiki/Basic_access_authentication) della richiesta (ad eccezione di [Contatti alias](#alias-contacts), [Calendari Alias](#alias-calendars) e [Caselle postali alias](#alias-mailboxes) che utilizzano [nome utente e password alias generati](/faq#do-you-support-receiving-email-with-imap)).

Non preoccuparti: se non sei sicuro di cosa si tratta, di seguito sono riportati degli esempi.

Errori ## {#errors}

Se si verificano errori, il corpo della risposta della richiesta API conterrà un messaggio di errore dettagliato.

| Codice | Nome |
| ---- | --------------------- |
| 200 | OK |
| 400 | Brutta richiesta |
| 401 | Non autorizzato |
| 403 | Vietato |
| 404 | Non trovato |
| 429 | Troppe richieste |
| 500 | Errore interno del server |
| 501 | Non implementato |
| 502 | Cattivo Gateway |
| 503 | Servizio non disponibile |
| 504 | Timeout del gateway |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## Localizzazione {#localization}

Il nostro servizio è tradotto in oltre 25 lingue diverse. Tutti i messaggi di risposta API vengono tradotti nell'ultima lingua rilevata dall'utente che effettua la richiesta API. È possibile ignorare questa impostazione passando un'intestazione personalizzata `Accept-Language`. Sentiti libero di provarla utilizzando il menu a tendina delle lingue in fondo a questa pagina.

## Paginazione {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

La paginazione è supportata da tutti gli endpoint API che elencano i risultati.

Basta fornire le proprietà della querystring `page` (e facoltativamente `limit`).

La proprietà `page` deve essere un numero maggiore o uguale a `1`. Se si specifica `limit` (anch'esso un numero), il valore minimo è `10` e il massimo è `50` (salvo diversa indicazione).

| Parametri della stringa di query | Necessario | Tipo | Descrizione |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | NO | Numero | Pagina dei risultati da restituire. Se non specificato, il valore di `page` sarà `1`. Deve essere un numero maggiore o uguale a `1`. |
| `limit` | NO | Numero | Numero di risultati da restituire per pagina. Il valore predefinito è `10` se non specificato. Deve essere un numero maggiore o uguale a `1` e minore o uguale a `50`. |

Per determinare se sono disponibili altri risultati, forniamo queste intestazioni di risposta HTTP (che puoi analizzare per effettuare la suddivisione in pagine a livello di programmazione):

| Intestazione di risposta HTTP | Esempio | Descrizione |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Numero totale di pagine disponibili. |
| `X-Page-Current` | `X-Page-Current: 1` | La pagina corrente dei risultati restituiti (ad esempio in base al parametro querystring `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Numero totale di risultati restituiti nella pagina (ad esempio in base al parametro querystring `limit` e ai risultati effettivamente restituiti). |
| `X-Item-Count` | `X-Item-Count: 30` | Numero totale di articoli disponibili in tutte le pagine. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Forniamo un'intestazione di risposta HTTP `Link` che puoi analizzare come mostrato nell'esempio. Questa è [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (ad esempio, non tutti i valori verranno forniti se non sono pertinenti o disponibili, ad esempio `"next"` non verrà fornito se non è presente un'altra pagina). |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Registri {#logs}

### Recupera i log {#retrieve-logs}

La nostra API ti consente di scaricare i log del tuo account in modo programmatico. Inviando una richiesta a questo endpoint, tutti i log del tuo account verranno elaborati e, una volta completata l'operazione, te li invieremo via email come allegato (file di foglio di calcolo compresso [Zippaggio](https://en.wikipedia.org/wiki/Gzip)).

Questo ti consente di creare processi in background con un [Cron job](https://en.wikipedia.org/wiki/Cron) o utilizzando il nostro [Software di pianificazione dei lavori Node.js Bree](https://github.com/breejs/bree) per ricevere i log ogni volta che lo desideri. Tieni presente che questo endpoint è limitato a `10` richieste al giorno.

L'allegato è la versione minuscola di `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` e l'email stessa contiene un breve riepilogo dei log recuperati. Puoi anche scaricare i log in qualsiasi momento da [Il mio account → Registri](/my-account/logs)

> `GET /v1/logs/download`

| Parametri della stringa di query | Necessario | Tipo | Descrizione |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | NO | Stringa (FQDN) | Filtra i log per dominio completo ("FQDN"). Se non lo specifichi, verranno recuperati tutti i log di tutti i domini. |
| `q` | NO | Corda | Cerca i registri per e-mail, dominio, nome alias, indirizzo IP o data (formato `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` o `M.D.YY`). |
| `bounce_category` | NO | Corda | Cerca i log in base a una categoria di bounce specifica (ad esempio `blocklist`). |
| `response_code` | NO | Numero | Cerca i log in base a un codice di risposta di errore specifico (ad esempio `421` o `550`). |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Esempio di Cron job (ogni giorno a mezzanotte):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Tieni presente che puoi utilizzare servizi come [Crontab.guru](https://crontab.guru/) per convalidare la sintassi dell'espressione del tuo cron job.

> Esempio di Cron job (ogni giorno a mezzanotte **e con i log del giorno precedente**):

Per macOS:

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

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | -------------- | ------------- |
| `email` | SÌ | Stringa (email) | Indirizzo e-mail |
| `password` | SÌ | Corda | Password |

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

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | -------------- | -------------------- |
| `email` | NO | Stringa (email) | Indirizzo e-mail |
| `given_name` | NO | Corda | Nome di battesimo |
| `family_name` | NO | Corda | Cognome |
| `avatar_url` | NO | Stringa (URL) | Collegamento all'immagine dell'avatar |

> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Contatti alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Elenca i contatti {#list-contacts}

> `GET /v1/contacts`

**Prossimamente**

### Crea contatto {#create-contact}

> `POST /v1/contacts`

**Prossimamente**

### Recupera contatto {#retrieve-contact}

> `GET /v1/contacts/:id`

**Prossimamente**

### Aggiorna contatto {#update-contact}

> `PUT /v1/contacts/:id`

**Prossimamente**

### Elimina contatto {#delete-contact}

> `DELETE /v1/contacts/:id`

**Prossimamente**

## Calendari Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Elenca calendari {#list-calendars}

> `GET /v1/calendars`

**Prossimamente**

### Crea calendario {#create-calendar}

> `POST /v1/calendars`

**Prossimamente**

### Recupera calendario {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Prossimamente**

### Aggiorna calendario {#update-calendar}

> `PUT /v1/calendars/:id`

**Prossimamente**

### Elimina calendario {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Prossimamente**

## Messaggi alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Assicurati di aver seguito le istruzioni di configurazione per il tuo dominio.

Queste istruzioni si trovano nella nostra sezione FAQ [Supportate la ricezione di posta elettronica tramite IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Elenca e cerca i messaggi {#list-and-search-for-messages}

> `GET /v1/messages`

**Prossimamente**

### Crea messaggio {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**Prossimamente**

### Recupera il messaggio {#retrieve-message}

> `GET /v1/messages/:id`

**Prossimamente**

### Aggiorna messaggio {#update-message}

> `PUT /v1/messages/:id`

**Prossimamente**

### Elimina messaggio {#delete-message}

> `DELETE /v1/messages:id`

**Prossimamente**

## Cartelle alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### Elenca cartelle {#list-folders}

> `GET /v1/folders`

**Prossimamente**

### Crea cartella {#create-folder}

> `POST /v1/folders`

**Prossimamente**

### Recupera la cartella {#retrieve-folder}

> `GET /v1/folders/:id`

**Prossimamente**

### Aggiorna cartella {#update-folder}

> `PUT /v1/folders/:id`

**Prossimamente**

### Elimina cartella {#delete-folder}

> `DELETE /v1/folders/:id`

**Prossimamente**

### Copia cartella {#copy-folder}

> `POST /v1/folders/:id/copy`

**Prossimamente**

## Email in uscita {#outbound-emails}

Assicurati di aver seguito le istruzioni di configurazione per il tuo dominio.

Queste istruzioni sono disponibili all'indirizzo [Il mio account → Domini → Impostazioni → Configurazione SMTP in uscita](/my-account/domains). È necessario assicurarsi di aver configurato DKIM, Return-Path e DMARC per l'invio di messaggi SMTP in uscita con il proprio dominio.

### Ottieni il limite di posta elettronica SMTP in uscita {#get-outbound-smtp-email-limit}

Si tratta di un endpoint semplice che restituisce un oggetto JSON contenente `count` e `limit` per il numero di messaggi SMTP in uscita giornalieri per account.

> `GET /v1/emails/limit`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Elenca le email SMTP in uscita {#list-outbound-smtp-emails}

Si noti che questo endpoint non restituisce valori di proprietà per `message`, `headers` né `rejectedErrors` di un'e-mail.

Per restituire tali proprietà e i relativi valori, utilizzare l'endpoint [Recupera email](#retrieve-email) con un ID e-mail.

> `GET /v1/emails`

| Parametri della stringa di query | Necessario | Tipo | Descrizione |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | NO | Stringa (RegExp supportata) | Cerca email tramite metadati |
| `domain` | NO | Stringa (RegExp supportata) | Cerca email per nome di dominio |
| `sort` | NO | Corda | Ordina in base a un campo specifico (anteporre un trattino singolo `-` per ordinare in senso inverso rispetto a quel campo). Il valore predefinito è `created_at` se non impostato. |
| `page` | NO | Numero | Vedi [Pagination](#pagination) per maggiori informazioni |
| `limit` | NO | Numero | Vedi [Pagination](#pagination) per maggiori informazioni |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Crea email SMTP in uscita {#create-outbound-smtp-email}

La nostra API per la creazione di email si ispira e sfrutta la configurazione delle opzioni di messaggio di Nodemailer. Per tutti i parametri del corpo dell'email, fare riferimento al link [Configurazione dei messaggi di Nodemailer](https://nodemailer.com/message/) qui sotto.

Si noti che, ad eccezione di `envelope` e `dkim` (poiché li impostiamo automaticamente), supportiamo tutte le opzioni di Nodemailer. Impostiamo automaticamente le opzioni `disableFileAccess` e `disableUrlAccess` su `true` per motivi di sicurezza.

Dovresti passare l'unica opzione `raw` con la tua email completa, incluse le intestazioni, **oppure** passare le singole opzioni dei parametri del corpo sottostanti.

Questo endpoint API codificherà automaticamente gli emoji se presenti nelle intestazioni (ad esempio, un oggetto con `Subject: 🤓 Hello` verrà convertito automaticamente in `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Il nostro obiettivo era creare un'API email estremamente intuitiva e a prova di errore per gli sviluppatori.

> `POST /v1/emails`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | NO | Stringa (email) | L'indirizzo email del mittente (deve esistere come alias del dominio). |
| `to` | NO | Stringa o array | Elenco separato da virgole o matrice di destinatari per l'intestazione "A". |
| `cc` | NO | Stringa o array | Elenco separato da virgole o array di destinatari per l'intestazione "Cc". |
| `bcc` | NO | Stringa o array | Elenco separato da virgole o array di destinatari per l'intestazione "Ccn". |
| `subject` | NO | Corda | L'oggetto dell'e-mail. |
| `text` | NO | Stringa o buffer | La versione in chiaro del messaggio. |
| `html` | NO | Stringa o buffer | La versione HTML del messaggio. |
| `attachments` | NO | Vettore | Un array di oggetti allegato (vedere [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | NO | Corda | L'indirizzo email per l'intestazione "Mittente" (vedere [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | NO | Corda | L'indirizzo email per l'intestazione "Rispondi a". |
| `inReplyTo` | NO | Corda | Message-ID a cui il messaggio risponde. |
| `references` | NO | Stringa o array | Elenco separato da spazi o array di Message-ID. |
| `attachDataUrls` | NO | Booleano | Se `true` converte le immagini `data:` presenti nel contenuto HTML del messaggio in allegati incorporati. |
| `watchHtml` | NO | Corda | Una versione HTML del messaggio specifica per Apple Watch ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), gli orologi più recenti non richiedono questa impostazione). |
| `amp` | NO | Corda | Una versione HTML specifica di AMP4EMAIL del messaggio (vedere [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | NO | Oggetto | Un evento iCalendar da utilizzare come contenuto alternativo del messaggio (vedere [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | NO | Vettore | Un array di contenuti di messaggi alternativi (vedere [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | NO | Corda | Codifica per il testo e le stringhe HTML (il valore predefinito è `"utf-8"`, ma supporta anche i valori di codifica `"hex"` e `"base64"`). |
| `raw` | NO | Stringa o buffer | Un messaggio formattato RFC822 generato in modo personalizzato da utilizzare (invece di uno generato da Nodemailer, vedere [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | NO | Corda | Codifica che viene forzata per i valori di testo (`"quoted-printable"` o `"base64"`). Il valore predefinito è il valore più vicino rilevato (per ASCII utilizzare `"quoted-printable"`). |
| `priority` | NO | Corda | Livello di priorità per l'email (può essere `"high"`, `"normal"` (predefinito) o `"low"`). Si noti che il valore `"normal"` non imposta un'intestazione di priorità (questo è il comportamento predefinito). Se si imposta il valore `"high"` o `"low"`, le intestazioni `X-Priority`, `X-MSMail-Priority` e `Importance` saranno [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | NO | Oggetto o array | Un oggetto o una matrice di campi di intestazione aggiuntivi da impostare (vedere [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | NO | Corda | Un valore Message-ID facoltativo per l'intestazione "Message-ID" (se non impostato, verrà creato automaticamente un valore predefinito: notare che il valore dovrebbe essere [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | NO | Stringa o data | Un valore Data facoltativo che verrà utilizzato se l'intestazione Data risulta mancante dopo l'analisi; in caso contrario, verrà utilizzata la stringa UTC corrente se non impostata. L'intestazione Data non può essere anteriore di oltre 30 giorni rispetto all'ora corrente. |
| `list` | NO | Oggetto | Un oggetto facoltativo di intestazioni `List-*` (vedere [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Recupera email SMTP in uscita {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Elimina email SMTP in uscita {#delete-outbound-smtp-email}

L'eliminazione dell'email imposterà lo stato a `"rejected"` (e successivamente non verrà elaborata nella coda) solo se lo stato corrente è `"pending"`, `"queued"` o `"deferred"`. Potremmo eliminare automaticamente le email dopo 30 giorni dalla loro creazione e/o invio, pertanto ti consigliamo di conservare una copia delle email SMTP in uscita nel tuo client, database o applicazione. Se lo desideri, puoi fare riferimento al valore del nostro ID email nel tuo database: questo valore viene restituito da entrambi gli endpoint [Crea email](#create-email) e [Recupera email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domini {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### Elenca i domini {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Parametri della stringa di query | Necessario | Tipo | Descrizione |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | NO | Stringa (RegExp supportata) | Cerca domini per nome |
| `name` | NO | Stringa (RegExp supportata) | Cerca domini per nome |
| `sort` | NO | Corda | Ordina in base a un campo specifico (anteporre un trattino singolo `-` per ordinare in senso inverso rispetto a quel campo). Il valore predefinito è `created_at` se non impostato. |
| `page` | NO | Numero | Vedi [Pagination](#pagination) per maggiori informazioni |
| `limit` | NO | Numero | Vedi [Pagination](#pagination) per maggiori informazioni |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Crea dominio {#create-domain}

> `POST /v1/domains`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | SÌ | Stringa (FQDN o IP) | Nome di dominio completo ("FQDN") o indirizzo IP |
| `team_domain` | NO | Stringa (ID dominio o nome dominio; FQDN) | Assegna automaticamente questo dominio allo stesso team di un altro dominio. Ciò significa che tutti i membri di questo dominio saranno assegnati come membri del team e che `plan` verrà automaticamente impostato su `team`. Puoi impostarlo su `"none"` se necessario per disabilitarlo esplicitamente, ma non è necessario. |
| `plan` | NO | Stringa (enumerabile) | Tipo di piano (deve essere `"free"`, `"enhanced_protection"` o `"team"`, il valore predefinito è `"free"` o il piano a pagamento attuale dell'utente, se presente) |
| `catchall` | NO | Stringa (indirizzi email delimitati) o booleano | Crea un alias predefinito catch-all, il cui valore predefinito è `true` (se è `true` utilizzerà l'indirizzo email dell'utente API come destinatario, mentre se è `false` non verrà creato alcun catch-all). Se viene passata una stringa, si tratta di un elenco delimitato di indirizzi email da utilizzare come destinatari (separati da interruzione di riga, spazio e/o virgola). |
| `has_adult_content_protection` | NO | Booleano | Se abilitare la protezione dei contenuti per adulti tramite Spam Scanner su questo dominio |
| `has_phishing_protection` | NO | Booleano | Se abilitare la protezione anti-phishing di Spam Scanner su questo dominio |
| `has_executable_protection` | NO | Booleano | Se abilitare la protezione eseguibile dello Spam Scanner su questo dominio |
| `has_virus_protection` | NO | Booleano | Se abilitare la protezione antivirus Spam Scanner su questo dominio |
| `has_recipient_verification` | NO | Booleano | Impostazione predefinita del dominio globale per richiedere ai destinatari alias di fare clic su un collegamento di verifica e-mail per il flusso di e-mail |
| `ignore_mx_check` | NO | Booleano | Se ignorare il controllo del record MX sul dominio per la verifica. Questa opzione è rivolta principalmente agli utenti che hanno regole di configurazione MX Exchange avanzate e devono mantenere il proprio MX Exchange esistente e inoltrarlo al nostro. |
| `retention_days` | NO | Numero | Numero intero compreso tra `0` e `30` che corrisponde al numero di giorni di conservazione per le email SMTP in uscita una volta recapitate correttamente o in caso di errore permanente. Il valore predefinito è `0`, il che significa che le email SMTP in uscita vengono eliminate e redatte immediatamente per la tua sicurezza. |
| `bounce_webhook` | NO | Stringa (URL) o Booleano (falso) | L'URL del webhook `http://` o `https://` di tua scelta a cui inviare i webhook di bounce. Invieremo una richiesta `POST` a questo URL con informazioni sugli errori SMTP in uscita (ad esempio, errori soft o hard, in modo che tu possa gestire i tuoi iscritti e gestire programmaticamente le email in uscita). |
| `max_quota_per_alias` | NO | Corda | Quota massima di archiviazione per gli alias su questo nome di dominio. Inserisci un valore come "1 GB" che verrà analizzato da [bytes](https://github.com/visionmedia/bytes.js). |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Recupera il dominio {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verifica i record del dominio {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verifica i record SMTP del dominio {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Elenca le password catch-all dell'intero dominio {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Crea una password catch-all per l'intero dominio {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | NO | Corda | La tua nuova password personalizzata da utilizzare come password generale per l'intero dominio. Nota che puoi lasciare questo campo vuoto o addirittura omesso dal corpo della richiesta API se desideri ottenere una password generata casualmente e complessa. |
| `description` | NO | Corda | Descrizione solo a scopo organizzativo. |

> Esempio di richiesta:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Rimuovi la password catch-all per l'intero dominio {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Aggiorna dominio {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | NO | Stringa o numero | Porta personalizzata da configurare per l'inoltro SMTP (il valore predefinito è `"25"`) |
| `has_adult_content_protection` | NO | Booleano | Se abilitare la protezione dei contenuti per adulti tramite Spam Scanner su questo dominio |
| `has_phishing_protection` | NO | Booleano | Se abilitare la protezione anti-phishing di Spam Scanner su questo dominio |
| `has_executable_protection` | NO | Booleano | Se abilitare la protezione eseguibile dello Spam Scanner su questo dominio |
| `has_virus_protection` | NO | Booleano | Se abilitare la protezione antivirus Spam Scanner su questo dominio |
| `has_recipient_verification` | NO | Booleano | Impostazione predefinita del dominio globale per richiedere ai destinatari alias di fare clic su un collegamento di verifica e-mail per il flusso di e-mail |
| `ignore_mx_check` | NO | Booleano | Se ignorare il controllo del record MX sul dominio per la verifica. Questa opzione è rivolta principalmente agli utenti che hanno regole di configurazione MX Exchange avanzate e devono mantenere il proprio MX Exchange esistente e inoltrarlo al nostro. |
| `retention_days` | NO | Numero | Numero intero compreso tra `0` e `30` che corrisponde al numero di giorni di conservazione per le email SMTP in uscita una volta recapitate correttamente o in caso di errore permanente. Il valore predefinito è `0`, il che significa che le email SMTP in uscita vengono eliminate e redatte immediatamente per la tua sicurezza. |
| `bounce_webhook` | NO | Stringa (URL) o Booleano (falso) | L'URL del webhook `http://` o `https://` di tua scelta a cui inviare i webhook di bounce. Invieremo una richiesta `POST` a questo URL con informazioni sugli errori SMTP in uscita (ad esempio, errori soft o hard, in modo che tu possa gestire i tuoi iscritti e gestire programmaticamente le email in uscita). |
| `max_quota_per_alias` | NO | Corda | Quota massima di archiviazione per gli alias su questo nome di dominio. Inserisci un valore come "1 GB" che verrà analizzato da [bytes](https://github.com/visionmedia/bytes.js). |

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

## Invita {#invites}

### Accetta l'invito al dominio {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Crea invito al dominio {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | SÌ | Stringa (email) | Indirizzo email per invitare all'elenco dei membri del dominio |
| `group` | SÌ | Stringa (enumerabile) | Gruppo a cui aggiungere l'utente all'appartenenza al dominio (può essere uno tra `"admin"` o `"user"`) |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Rimuovi invito al dominio {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | SÌ | Stringa (email) | Indirizzo email da rimuovere dall'elenco dei membri del dominio |

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Membri {#members}

### Aggiorna il membro del dominio {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | SÌ | Stringa (enumerabile) | Gruppo per aggiornare l'utente all'appartenenza al dominio (può essere uno tra `"admin"` o `"user"`) |

> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Rimuovi membro del dominio {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Alias {#aliases}

### Genera una password alias {#generate-an-alias-password}

Tieni presente che se non invii istruzioni tramite e-mail, il nome utente e la password saranno presenti nel corpo della risposta JSON di una richiesta riuscita nel formato `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | NO | Corda | La tua nuova password personalizzata da utilizzare per l'alias. Nota che puoi lasciare questo campo vuoto o addirittura ometterlo dal corpo della richiesta API se desideri ottenere una password generata casualmente e complessa. |
| `password` | NO | Corda | Password esistente per l'alias per modificare la password senza eliminare l'archivio della casella di posta IMAP esistente (vedere l'opzione `is_override` di seguito se non si dispone più della password esistente). |
| `is_override` | NO | Booleano | **USARE CON CAUTELA**: Questo sovrascriverà completamente la password e il database dell'alias esistenti, eliminerà definitivamente l'archiviazione IMAP esistente e reimposterà completamente il database email SQLite dell'alias. Si prega di eseguire un backup, se possibile, se si dispone di una casella di posta associata a questo alias. |
| `emailed_instructions` | NO | Corda | Indirizzo email a cui inviare la password dell'alias e le istruzioni di configurazione. |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Elenca gli alias di dominio {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parametri della stringa di query | Necessario | Tipo | Descrizione |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | NO | Stringa (RegExp supportata) | Cerca alias in un dominio per nome, etichetta o destinatario |
| `name` | NO | Stringa (RegExp supportata) | Cerca alias in un dominio per nome |
| `recipient` | NO | Stringa (RegExp supportata) | Cerca alias in un dominio per destinatario |
| `sort` | NO | Corda | Ordina in base a un campo specifico (anteporre un trattino singolo `-` per ordinare in senso inverso rispetto a quel campo). Il valore predefinito è `created_at` se non impostato. |
| `page` | NO | Numero | Vedi [Pagination](#pagination) per maggiori informazioni |
| `limit` | NO | Numero | Vedi [Pagination](#pagination) per maggiori informazioni |

> Esempio di richiesta:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Crea un nuovo alias di dominio {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | NO | Corda | Nome alias (se non fornito o vuoto, viene generato un alias casuale) |
| `recipients` | NO | Stringa o array | Elenco dei destinatari (deve essere una stringa o un array di indirizzi email validi, nomi di dominio completamente qualificati ("FQDN"), indirizzi IP e/o URL webhook separati da interruzione di riga/spazio/virgola. Se non specificato o è un array vuoto, l'indirizzo email dell'utente che effettua la richiesta API verrà impostato come destinatario). |
| `description` | NO | Corda | Descrizione dell'alias |
| `labels` | NO | Stringa o array | Elenco delle etichette (devono essere stringhe o array separati da interruzione di riga/spazio/virgola) |
| `has_recipient_verification` | NO | Booleano | Richiedi ai destinatari di fare clic su un collegamento di verifica dell'e-mail affinché le e-mail possano essere inoltrate (per impostazione predefinita, si applica l'impostazione del dominio, se non è impostata in modo esplicito nel corpo della richiesta) |
| `is_enabled` | NO | Booleano | Abilitare o disabilitare questo alias (se disabilitato, le email non verranno indirizzate a nessuna destinazione, ma restituiranno codici di stato di esito positivo). Se viene passato un valore, questo viene convertito in un valore booleano utilizzando [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `error_code_if_disabled` | NO | Numero (`250`, `421` o `550`) | Le email in arrivo a questo alias verranno rifiutate se `is_enabled` è `false` con `250` (invio silenzioso, ad esempio blackhole o `/dev/null`), `421` (rifiuto soft; e nuovo tentativo fino a ~5 giorni) o `550` errore permanente e rifiuto. Il valore predefinito è `250`. |
| `has_imap` | NO | Booleano | Abilitare o disabilitare l'archiviazione IMAP per questo alias (se disabilitata, le email in entrata ricevute non verranno archiviate in [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Se viene passato un valore, questo viene convertito in un valore booleano utilizzando [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | NO | Booleano | Se abilitare o disabilitare [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) per [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) utilizzando l'alias `public_key`. |
| `public_key` | NO | Corda | Chiave pubblica OpenPGP in formato ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ad esempio chiave GPG per `support@forwardemail.net`). Questo si applica solo se `has_pgp` è impostato su `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | NO | Corda | Quota massima di archiviazione per questo alias. Lasciare vuoto per reimpostare la quota massima corrente del dominio oppure inserire un valore come "1 GB" che verrà analizzato da [bytes](https://github.com/visionmedia/bytes.js). Questo valore può essere modificato solo dagli amministratori del dominio. |
| `vacation_responder_is_enabled` | NO | Booleano | Se abilitare o disabilitare il risponditore automatico. |
| `vacation_responder_start_date` | NO | Corda | Data di inizio per il risponditore automatico (se abilitato e non è impostata una data di inizio, si presume che sia già iniziato). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati di data tramite analisi intelligente con `dayjs`. |
| `vacation_responder_end_date` | NO | Corda | Data di fine per il risponditore automatico (se abilitato e non impostato qui, si presume che non termini mai e risponda per sempre). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati di data tramite analisi intelligente con `dayjs`. |
| `vacation_responder_subject` | NO | Corda | Oggetto in chiaro per il risponditore automatico, ad esempio "Fuori sede". Utilizziamo `striptags` per rimuovere tutto il codice HTML. |
| `vacation_responder_message` | NO | Corda | Messaggio in chiaro per il risponditore automatico, ad esempio "Sarò fuori ufficio fino a febbraio". Utilizziamo `striptags` per rimuovere tutto l'HTML qui. |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Recupera l'alias del dominio {#retrieve-domain-alias}

È possibile recuperare un alias di dominio tramite il suo valore `id` o `name`.

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

### Aggiorna l'alias del dominio {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | NO | Corda | Nome alias |
| `recipients` | NO | Stringa o array | Elenco dei destinatari (deve essere una stringa o un array di indirizzi e-mail validi, nomi di dominio completi ("FQDN"), indirizzi IP e/o URL webhook separati da interruzione di riga/spazio/virgola) |
| `description` | NO | Corda | Descrizione dell'alias |
| `labels` | NO | Stringa o array | Elenco delle etichette (devono essere stringhe o array separati da interruzione di riga/spazio/virgola) |
| `has_recipient_verification` | NO | Booleano | Richiedi ai destinatari di fare clic su un collegamento di verifica dell'e-mail affinché le e-mail possano essere inoltrate (per impostazione predefinita, si applica l'impostazione del dominio, se non è impostata in modo esplicito nel corpo della richiesta) |
| `is_enabled` | NO | Booleano | Abilitare o disabilitare questo alias (se disabilitato, le email non verranno indirizzate a nessuna destinazione, ma restituiranno codici di stato di esito positivo). Se viene passato un valore, questo viene convertito in un valore booleano utilizzando [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `error_code_if_disabled` | NO | Numero (`250`, `421` o `550`) | Le email in arrivo a questo alias verranno rifiutate se `is_enabled` è `false` con `250` (invio silenzioso, ad esempio blackhole o `/dev/null`), `421` (rifiuto soft; e nuovo tentativo fino a ~5 giorni) o `550` errore permanente e rifiuto. Il valore predefinito è `250`. |
| `has_imap` | NO | Booleano | Abilitare o disabilitare l'archiviazione IMAP per questo alias (se disabilitata, le email in entrata ricevute non verranno archiviate in [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Se viene passato un valore, questo viene convertito in un valore booleano utilizzando [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | NO | Booleano | Se abilitare o disabilitare [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) per [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) utilizzando l'alias `public_key`. |
| `public_key` | NO | Corda | Chiave pubblica OpenPGP in formato ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ad esempio chiave GPG per `support@forwardemail.net`). Questo si applica solo se `has_pgp` è impostato su `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | NO | Corda | Quota massima di archiviazione per questo alias. Lasciare vuoto per reimpostare la quota massima corrente del dominio oppure inserire un valore come "1 GB" che verrà analizzato da [bytes](https://github.com/visionmedia/bytes.js). Questo valore può essere modificato solo dagli amministratori del dominio. |
| `vacation_responder_is_enabled` | NO | Booleano | Se abilitare o disabilitare il risponditore automatico. |
| `vacation_responder_start_date` | NO | Corda | Data di inizio per il risponditore automatico (se abilitato e non è impostata una data di inizio, si presume che sia già iniziato). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati di data tramite analisi intelligente con `dayjs`. |
| `vacation_responder_end_date` | NO | Corda | Data di fine per il risponditore automatico (se abilitato e non impostato qui, si presume che non termini mai e risponda per sempre). Supportiamo formati di data come `MM/DD/YYYY`, `YYYY-MM-DD` e altri formati di data tramite analisi intelligente con `dayjs`. |
| `vacation_responder_subject` | NO | Corda | Oggetto in chiaro per il risponditore automatico, ad esempio "Fuori sede". Utilizziamo `striptags` per rimuovere tutto il codice HTML. |
| `vacation_responder_message` | NO | Corda | Messaggio in chiaro per il risponditore automatico, ad esempio "Sarò fuori ufficio fino a febbraio". Utilizziamo `striptags` per rimuovere tutto l'HTML qui. |

> Esempio di richiesta:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Elimina l'alias di dominio {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Esempio di richiesta:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Crittografa {#encrypt}

Ti consentiamo di crittografare i record anche con il piano gratuito, senza alcun costo. La privacy non dovrebbe essere una funzionalità, ma dovrebbe essere integrata in tutti gli aspetti di un prodotto. Come richiesto a gran voce in un [Discussione sulle guide sulla privacy](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e in [i nostri problemi su GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), abbiamo aggiunto questa funzionalità.

### Crittografa record TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parametro corporeo | Necessario | Tipo | Descrizione |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | SÌ | Corda | Qualsiasi record TXT in chiaro di Inoltra e-mail valido |

> Esempio di richiesta:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
