# Informativa sulla Privacy {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Informativa sulla privacy di Forward Email" class="rounded-lg" />


## Indice {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Informazioni Non Raccoglite](#information-not-collected)
* [Informazioni Raccoglite](#information-collected)
  * [Informazioni sull'Account](#account-information)
  * [Archiviazione Email](#email-storage)
  * [Log degli Errori](#error-logs)
  * [Email SMTP in Uscita](#outbound-smtp-emails)
* [Elaborazione Temporanea dei Dati](#temporary-data-processing)
  * [Limitazione della Velocità](#rate-limiting)
  * [Tracciamento delle Connessioni](#connection-tracking)
  * [Tentativi di Autenticazione](#authentication-attempts)
* [Log di Audit](#audit-logs)
  * [Modifiche all'Account](#account-changes)
  * [Modifiche alle Impostazioni del Dominio](#domain-settings-changes)
* [Cookie e Sessioni](#cookies-and-sessions)
* [Analisi](#analytics)
* [Informazioni Condivise](#information-shared)
* [Rimozione delle Informazioni](#information-removal)
* [Ulteriori Divulgazioni](#additional-disclosures)


## Disclaimer {#disclaimer}

Si prega di fare riferimento ai nostri [Termini](/terms) come applicabili a tutto il sito.


## Informazioni Non Raccoglite {#information-not-collected}

**Ad eccezione dei [log degli errori](#error-logs), delle [email SMTP in uscita](#outbound-smtp-emails) e/o quando viene rilevata attività di spam o dannosa (ad esempio per la limitazione della velocità):**

* Non memorizziamo alcuna email inoltrata su disco o database.
* Non memorizziamo alcun metadato relativo alle email inoltrate su disco o database.
* Non memorizziamo alcun log o indirizzo IP su disco o database.
* Non utilizziamo servizi di analisi o telemetria di terze parti.


## Informazioni Raccoglite {#information-collected}

Per trasparenza, in qualsiasi momento puoi <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">visualizzare il nostro codice sorgente</a> per vedere come le informazioni di seguito vengono raccolte e utilizzate.

**Strettamente per funzionalità e per migliorare il nostro servizio, raccogliamo e conserviamo in modo sicuro le seguenti informazioni:**

### Informazioni sull'Account {#account-information}

* Conserviamo il tuo indirizzo email che ci fornisci.
* Conserviamo i tuoi nomi di dominio, alias e configurazioni che ci fornisci.
* Qualsiasi informazione aggiuntiva che ci fornisci volontariamente, come commenti o domande inviateci via email o sulla nostra pagina <a href="/help">help</a>.

**Attribuzione della registrazione** (conservata permanentemente sul tuo account):

Quando crei un account, conserviamo le seguenti informazioni per capire come gli utenti trovano il nostro servizio:

* Il dominio del sito web di riferimento (non l'URL completo)
* La prima pagina che hai visitato sul nostro sito
* I parametri della campagna UTM se presenti nell'URL

### Archiviazione Email {#email-storage}

* Conserviamo email e informazioni del calendario nel tuo [database SQLite criptato](/blog/docs/best-quantum-safe-encrypted-email-service) strettamente per il tuo accesso IMAP/POP3/CalDAV/CardDAV e la funzionalità della casella di posta.
  * Nota che se usi solo i nostri servizi di inoltro email, allora nessuna email viene memorizzata su disco o database come descritto in [Informazioni Non Raccoglite](#information-not-collected).
  * I nostri servizi di inoltro email operano solo in memoria (nessuna scrittura su disco o database).
  * L'archiviazione IMAP/POP3/CalDAV/CardDAV è criptata a riposo, criptata in transito e memorizzata su un disco criptato LUKS.
  * I backup per la tua archiviazione IMAP/POP3/CalDAV/CardDAV sono criptati a riposo, criptati in transito e memorizzati su [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Log degli Errori {#error-logs}

* Conserviamo i log degli errori con codice di risposta SMTP `4xx` e `5xx` [error logs](/faq#do-you-store-error-logs) per 7 giorni.
* I log degli errori contengono l'errore SMTP, l'involucro e le intestazioni email (non conserviamo il corpo dell'email né gli allegati).
* I log degli errori possono contenere indirizzi IP e nomi host dei server mittenti per scopi di debug.
* I log degli errori per [limitazione della velocità](/faq#do-you-have-rate-limiting) e [greylisting](/faq#do-you-have-a-greylist) non sono accessibili poiché la connessione termina anticipatamente (ad esempio prima che i comandi `RCPT TO` e `MAIL FROM` possano essere trasmessi).
### Email SMTP in uscita {#outbound-smtp-emails}

* Conserviamo le [email SMTP in uscita](/faq#do-you-support-sending-email-with-smtp) per circa 30 giorni.
  * Questa durata varia in base all'intestazione "Date"; poiché permettiamo l'invio di email con data futura se esiste un'intestazione "Date" futura.
  * **Nota che una volta che un'email è stata consegnata con successo o ha generato un errore permanente, procederemo a oscurare e cancellare il corpo del messaggio.**
  * Se desideri configurare la conservazione del corpo del messaggio delle email SMTP in uscita per un periodo più lungo del valore predefinito di 0 giorni (dopo la consegna riuscita o errore permanente), vai alle Impostazioni Avanzate per il tuo dominio e inserisci un valore tra `0` e `30`.
  * Alcuni utenti apprezzano utilizzare la funzione di anteprima [Il mio account > Email](/my-account/emails) per vedere come vengono visualizzate le loro email, quindi supportiamo un periodo di conservazione configurabile.
  * Nota che supportiamo anche [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Elaborazione temporanea dei dati {#temporary-data-processing}

I seguenti dati vengono elaborati temporaneamente in memoria o in Redis e **non** sono conservati permanentemente:

### Limitazione della frequenza {#rate-limiting}

* Gli indirizzi IP sono utilizzati temporaneamente in Redis per scopi di limitazione della frequenza.
* I dati di limitazione della frequenza scadono automaticamente (tipicamente entro 24 ore).
* Questo previene abusi e garantisce un uso equo dei nostri servizi.

### Monitoraggio delle connessioni {#connection-tracking}

* Il conteggio delle connessioni concorrenti è tracciato per indirizzo IP in Redis.
* Questi dati scadono automaticamente quando le connessioni si chiudono o dopo un breve timeout.
* Utilizzato per prevenire abusi delle connessioni e garantire la disponibilità del servizio.

### Tentativi di autenticazione {#authentication-attempts}

* I tentativi di autenticazione falliti sono tracciati per indirizzo IP in Redis.
* Questi dati scadono automaticamente (tipicamente entro 24 ore).
* Utilizzato per prevenire attacchi brute-force sugli account utente.


## Log di audit {#audit-logs}

Per aiutarti a monitorare e proteggere il tuo account e i tuoi domini, manteniamo log di audit per alcune modifiche. Questi log sono utilizzati per inviare email di notifica ai titolari degli account e agli amministratori di dominio.

### Modifiche all'account {#account-changes}

* Tracciamo le modifiche alle impostazioni importanti dell'account (es. autenticazione a due fattori, nome visualizzato, fuso orario).
* Quando vengono rilevate modifiche, inviamo una notifica via email al tuo indirizzo email registrato.
* I campi sensibili (es. password, token API, chiavi di recupero) sono tracciati ma i loro valori sono oscurati nelle notifiche.
* Le voci del log di audit vengono cancellate dopo l'invio della email di notifica.

### Modifiche alle impostazioni del dominio {#domain-settings-changes}

Per i domini con più amministratori, forniamo un logging dettagliato per aiutare i team a tracciare le modifiche di configurazione:

**Cosa tracciamo:**

* Modifiche alle impostazioni del dominio (es. webhook di bounce, filtro antispam, configurazione DKIM)
* Chi ha effettuato la modifica (indirizzo email dell'utente)
* Quando è stata effettuata la modifica (timestamp)
* L'indirizzo IP da cui è stata effettuata la modifica
* La stringa user-agent del browser/client

**Come funziona:**

* Tutti gli amministratori del dominio ricevono una singola email di notifica consolidata quando le impostazioni cambiano.
* La notifica include una tabella che mostra ogni modifica con l'utente che l'ha effettuata, il suo indirizzo IP e il timestamp.
* I campi sensibili (es. chiavi webhook, token API, chiavi private DKIM) sono tracciati ma i loro valori sono oscurati.
* Le informazioni user-agent sono incluse in una sezione "Dettagli tecnici" espandibile.
* Le voci del log di audit vengono cancellate dopo l'invio della email di notifica.

**Perché raccogliamo questi dati:**

* Per aiutare gli amministratori di dominio a mantenere il controllo della sicurezza
* Per permettere ai team di verificare chi ha effettuato modifiche di configurazione
* Per assistere nella risoluzione di problemi in caso di modifiche inattese
* Per garantire responsabilità nella gestione condivisa del dominio


## Cookie e sessioni {#cookies-and-sessions}

* Conserviamo un cookie di sessione per il traffico del tuo sito web.
* I cookie sono HTTP-only, firmati e utilizzano la protezione SameSite.
* I cookie di sessione scadono dopo 30 giorni di inattività.
* Non creiamo sessioni per bot o crawler.
* Utilizziamo i cookie per:
  * Autenticazione e stato di login
  * Funzionalità "ricordami" per l'autenticazione a due fattori
  * Messaggi flash e notifiche
## Analytics {#analytics}

Utilizziamo un sistema di analisi incentrato sulla privacy per capire come vengono utilizzati i nostri servizi. Questo sistema è progettato con la privacy come principio fondamentale:

**Cosa NON raccogliamo:**

* Non memorizziamo indirizzi IP
* Non utilizziamo cookie o identificatori persistenti per l'analisi
* Non utilizziamo servizi di analisi di terze parti
* Non tracciamo gli utenti attraverso giorni o sessioni

**Cosa raccogliamo (anonimizzato):**

* Visualizzazioni di pagina aggregate e utilizzo del servizio (SMTP, IMAP, POP3, API, ecc.)
* Tipo di browser e sistema operativo (analizzati dall'user agent, dati grezzi scartati)
* Tipo di dispositivo (desktop, mobile, tablet)
* Dominio di riferimento (non URL completo)
* Tipo di client email per i protocolli di posta (es. Thunderbird, Outlook)

**Conservazione dei dati:**

* I dati di analisi vengono eliminati automaticamente dopo 30 giorni
* Gli identificatori di sessione ruotano quotidianamente e non possono essere usati per tracciare gli utenti attraverso i giorni


## Informazioni Condivise {#information-shared}

Non condividiamo le tue informazioni con terze parti.

Potremmo doverlo fare e ci conformeremo a richieste legali ordinate da un tribunale (ma tieni presente che [non raccogliamo le informazioni menzionate sopra sotto "Informazioni Non Raccoglite"](#information-not-collected), quindi non saremo in grado di fornirle).


## Rimozione delle Informazioni {#information-removal}

Se in qualsiasi momento desideri rimuovere le informazioni che ci hai fornito, vai su <a href="/my-account/security">Il Mio Account > Sicurezza</a> e clicca su "Elimina Account".

Per prevenire abusi, il tuo account potrebbe richiedere una revisione manuale da parte dei nostri amministratori se lo elimini entro 5 giorni dal tuo primo pagamento.

Questo processo di solito richiede meno di 24 ore ed è stato implementato perché alcuni utenti abusavano del nostro servizio, cancellando rapidamente i loro account – impedendoci di bloccare le impronte del loro metodo di pagamento su Stripe.


## Ulteriori Informazioni {#additional-disclosures}

Questo sito è protetto da Cloudflare e si applicano la sua [Privacy Policy](https://www.cloudflare.com/privacypolicy/) e i [Termini di Servizio](https://www.cloudflare.com/website-terms/).
