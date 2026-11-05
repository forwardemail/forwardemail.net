# Informativa sulla Privacy {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Informativa sulla privacy di Forward Email" class="rounded-lg" /> -->


## Indice {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Informazioni Non Raccoglite](#information-not-collected)
* [Informazioni Raccoglite](#information-collected)
  * [Informazioni sull'Account](#account-information)
  * [Archiviazione Email](#email-storage)
  * [Log degli Errori](#error-logs)
  * [Log dei Server](#server-logs)
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
* [App e Webmail](#apps-and-webmail)
  * [Dati sul Tuo Dispositivo](#data-on-your-device)
  * [Dati che le App ci Inviano](#data-the-apps-send-us)
  * [Notifiche Push](#push-notifications)
  * [Immagini e Link nelle Email](#images-and-links-in-emails)
  * [Altre Connessioni](#other-connections)
* [Informazioni Condivise](#information-shared)
* [Rimozione delle Informazioni](#information-removal)
* [Ulteriori Divulgazioni](#additional-disclosures)


## Disclaimer {#disclaimer}

Si prega di fare riferimento ai nostri [Termini](/terms) come applicabili a tutto il sito.


## Informazioni Non Raccoglite {#information-not-collected}

**Ad eccezione delle informazioni espressamente descritte in questa policy (inclusi [log degli errori](#error-logs), [log dei server](#server-logs), [email SMTP in uscita](#outbound-smtp-emails), [informazioni sull'account](#account-information), [elaborazione temporanea dei dati](#temporary-data-processing), [log di audit](#audit-logs), [cookie e sessioni](#cookies-and-sessions), [analisi](#analytics), e [app e webmail](#apps-and-webmail)):**

* Non memorizziamo alcuna email inoltrata su disco o database.
* Non memorizziamo alcun metadato relativo alle email inoltrate su disco o database.
* Ad eccezione di quanto espressamente descritto in questa policy, non memorizziamo log o indirizzi IP su disco o database.
* Non utilizziamo servizi di analisi o telemetria di terze parti.


## Informazioni Raccoglite {#information-collected}

Per trasparenza, in qualsiasi momento puoi <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">visualizzare il nostro codice sorgente</a> per vedere come le informazioni di seguito vengono raccolte e utilizzate.

**Strettamente per funzionalità e per migliorare il nostro servizio, raccogliamo e conserviamo in modo sicuro le seguenti informazioni:**

### Informazioni sull'Account {#account-information}

* Memorizziamo l'indirizzo email che ci fornisci.
* Memorizziamo i nomi di dominio, gli alias e le configurazioni che ci fornisci.
* Memorizziamo metadati di sicurezza dell'account limitati, necessari per proteggere il tuo account e gestire gli accessi, inclusi gli identificatori delle sessioni attive sul sito web, i contatori dei tentativi di accesso falliti e la marca temporale dell'ultimo tentativo di accesso.
* Qualsiasi informazione aggiuntiva che ci fornisci volontariamente, come commenti o domande inviati via email o sulla nostra pagina di <a href="/help">aiuto</a>.


**Attribuzione della registrazione** (conservata permanentemente sul tuo account):

Quando crei un account, conserviamo le seguenti informazioni per capire come gli utenti trovano il nostro servizio:

* Il dominio del sito web di riferimento (non l'URL completo)
* La prima pagina che hai visitato sul nostro sito, nel cui percorso valori come nomi di dominio, ID e token vengono sostituiti da segnaposto
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
* Conserviamo inoltre per 7 giorni i log degli errori delle richieste al sito web e all'API che falliscono o impiegano troppo tempo, nonché quelli dei nostri server IMAP, POP3, CalDAV e CardDAV.
* Questi log possono contenere l'indirizzo IP, l'URL della richiesta (incluse le stringhe di query, come i termini di ricerca), le intestazioni della richiesta come lo user agent, e l'account o l'alias coinvolto.
* Password, token API, cookie e corpi delle richieste vengono oscurati in questi log prima della memorizzazione.

### Log dei server {#server-logs}

* Per ogni richiesta al sito web e all'API, i nostri server registrano una riga di log che può includere l'indirizzo IP, il metodo e l'URL della richiesta (incluse le stringhe di query), le intestazioni della richiesta, lo stato della risposta e l'account connesso.
* Utilizziamo questi log per individuare e risolvere i problemi e per fermare gli abusi, e li conserviamo per un massimo di 30 giorni.

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

* I tentativi di autenticazione falliti vengono tracciati per indirizzo IP in Redis.
* Memorizziamo inoltre metadati di autenticazione a livello di account limitati, inclusi i contatori dei tentativi di accesso falliti e la marca temporale dell'ultimo tentativo di accesso.
* I dati sui tentativi di autenticazione basati su Redis scadono automaticamente (in genere entro 24 ore).
* Utilizzati per prevenire attacchi brute-force agli account degli utenti.


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

* Memorizziamo cookie firmati e solo HTTP, e dati di sessione lato server per il traffico del tuo sito web.
* I cookie utilizzano la protezione SameSite.
* Memorizziamo gli identificatori delle sessioni attive sul sito web nel tuo account per supportare funzionalità come "log out other devices" e l'invalidazione delle sessioni per motivi di sicurezza.
* I cookie di sessione scadono dopo 30 giorni di inattività.
* Non creiamo sessioni per bot o crawler.
* Utilizziamo cookie e sessioni per:
  * Autenticazione e stato di accesso
  * Funzionalità "ricordami" per l'autenticazione a due fattori
  * Messaggi flash e notifiche
  * [Analisi](#analytics): la prima pagina della tua visita, il dominio di riferimento, i parametri della campagna UTM e un conteggio delle pagine


## Analytics {#analytics}

Utilizziamo un sistema di analisi incentrato sulla privacy per capire come vengono utilizzati i nostri servizi. Questo sistema è progettato con la privacy come principio fondamentale:

**Cosa NON raccogliamo:**

* Non memorizziamo indirizzi IP
* Non impostiamo un cookie separato per l'analisi
* Non utilizziamo servizi di analisi di terze parti
* Non tracciamo i visitatori attraverso giorni o sessioni quando non hanno effettuato l'accesso

**Cosa raccogliamo:**

* Visualizzazioni di pagina aggregate e utilizzo del servizio (SMTP, IMAP, POP3, API, ecc.)
* Tipo e versione di browser e sistema operativo (analizzati dall'user agent, dati grezzi scartati)
* Tipo di dispositivo (desktop, mobile, tablet)
* Dominio di riferimento (non URL completo) e parametri della campagna UTM
* Tipo di client email per i protocolli di posta (es. Thunderbird, Outlook)
* La pagina o il percorso API richiesto, in cui valori come nomi di dominio, ID e token vengono sostituiti da segnaposto, e se la richiesta è andata a buon fine
* Per le visite al sito web, la prima pagina della visita e un conteggio delle pagine, conservati nella tua sessione (vedi [Cookie e sessioni](#cookies-and-sessions))
* Quando hai effettuato l'accesso, l'ID del tuo account, alias o dominio, per poter vedere come viene utilizzato ciascun servizio e risolvere i problemi

**Conservazione dei dati:**

* Gli eventi di analisi vengono eliminati automaticamente dopo 30 giorni
* I totali orari, che non sono collegati ad alcun account, vengono conservati per 90 giorni
* Gli identificatori di sessione ruotano quotidianamente e non possono essere usati per tracciare i visitatori attraverso i giorni


## App e Webmail {#apps-and-webmail}

Questa sezione riguarda le nostre app email per iOS, Android, macOS, Windows e Linux e la nostra webmail su <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, che condividono lo stesso codice. Le app non contengono codice pubblicitario o di tracciamento né strumenti di analisi di terze parti.

### Dati sul tuo dispositivo {#data-on-your-device}

* Le app memorizzano le tue email, i contatti, i calendari, le impostazioni e i dati di accesso sul tuo dispositivo, in modo da caricarsi rapidamente e funzionare offline.
* Se attivi App Lock, l'app cripta il contenuto delle email, i contatti e i dati di accesso memorizzati con una chiave protetta dal tuo PIN o dalla tua passkey. Date, cartelle, etichette e contrassegni restano non criptati, in modo che l'app possa ordinare e contare le tue email.
* Se ti disconnetti da un account, i suoi dati vengono rimossi dal tuo dispositivo.

### Dati che le app ci inviano {#data-the-apps-send-us}

* L'indirizzo email del tuo alias e la tua password, a ogni richiesta, per farti accedere.
* Le email, i contatti, i calendari, le etichette e i filtri che invii, crei o modifichi. Memorizziamo le email, i contatti e i calendari come descritto in [Archiviazione Email](#email-storage), e le email che invii come descritto in [Email SMTP in uscita](#outbound-smtp-emails).
* I tuoi termini di ricerca, per permetterci di cercare nella tua casella di posta sui nostri server. I termini di ricerca fanno parte dell'URL della richiesta, quindi possono comparire nei [log degli errori](#error-logs) e nei [log dei server](#server-logs).
* Il feedback che scegli di inviare dall'app. Viene spedito via email dal tuo alias al nostro team di supporto, insieme agli eventuali dettagli diagnostici che scegli di includere.
* Le email che segnali come spam, che l'app inoltra al nostro team antiabuso (o a un altro indirizzo che specifichi nelle impostazioni).

### Notifiche push {#push-notifications}

* Quando consenti le notifiche, l'app registra un token push presso di noi. Lo memorizziamo insieme alla piattaforma, all'alias e all'account a cui si riferisce, al momento della sua ultima consegna e a un nome del dispositivo ricavato dallo user agent dell'app, che include la versione del tuo sistema operativo e, su Android, il modello del tuo dispositivo.
* Conserviamo un token push per un massimo di un anno dopo il suo ultimo utilizzo. Lo eliminiamo prima quando ti disconnetti dall'app, quando la consegna non riesce per tre volte di seguito, quando la password dell'alias cambia, quando elimini l'alias o il tuo account o quando l'alias passa a un altro proprietario.
* Su iOS e macOS, le notifiche passano attraverso Apple Push Notification service. Nella nostra app Android distribuita tramite Google Play, passano attraverso Firebase Cloud Messaging. Le notifiche di nuove email includono il nome e l'indirizzo del mittente, l'oggetto, una breve anteprima e il nome della cartella, anche per le email che arrivano senza una notifica visibile, come quelle salvate nella cartella Indesiderata o Inviata. Quando email, calendari o contatti cambiano, inviamo anche notifiche silenziose con identificatori ma senza contenuto delle email, in modo che l'app resti aggiornata.
* Con [UnifiedPush](https://unifiedpush.org/) su Android e con le notifiche in un browser web, ogni notifica è criptata in modo che solo il tuo dispositivo possa leggerla.
* La nostra app Android distribuita tramite Google Play include Firebase Cloud Messaging, che invia a Google un ID di installazione Firebase, la versione dell'app e dettagli sul dispositivo e sull'SDK. La nostra app Android senza Google distribuita tramite GitHub non include Firebase.

### Immagini e link nelle email {#images-and-links-in-emails}

* Le immagini nelle email vengono caricate dai server del mittente, che possono vedere il tuo indirizzo IP e il momento in cui le immagini sono state caricate.
* Le app bloccano i pixel di tracciamento per impostazione predefinita. Puoi anche bloccare tutte le immagini esterne in Settings > Privacy & Security e poi caricarle un'email alla volta.
* I link nelle email si aprono nel tuo browser web.

### Altre connessioni {#other-connections}

* La nostra webmail chiede a GitHub la sua ultima versione quando viene caricata, quando ci torni e ogni 10 minuti mentre è aperta. About & Help chiede a GitHub l'ultima versione desktop e le app desktop verificano su GitHub la disponibilità di aggiornamenti. GitHub riceve il tuo indirizzo IP con queste richieste.


## Informazioni Condivise {#information-shared}

Non condividiamo le tue informazioni con terze parti, ad eccezione dei fornitori di servizi che gestiscono parti del nostro servizio, come Cloudflare (protezione del sito web e backup criptati), Stripe e PayPal (pagamenti), e dei servizi che recapitano le notifiche push ai tuoi dispositivi (vedi [Notifiche push](#push-notifications)).

Potremmo doverlo fare e ci conformeremo a richieste legali ordinate da un tribunale (ma tieni presente che [non raccogliamo le informazioni menzionate sopra sotto "Informazioni Non Raccoglite"](#information-not-collected), quindi non saremo in grado di fornirle).


## Rimozione delle Informazioni {#information-removal}

Se in qualsiasi momento desideri rimuovere le informazioni che ci hai fornito, vai su <a href="/my-account/security">Il Mio Account > Sicurezza</a> e clicca su "Elimina Account".

Per prevenire abusi, il tuo account potrebbe richiedere una revisione manuale da parte dei nostri amministratori se lo elimini entro 5 giorni dal tuo primo pagamento.

Questo processo di solito richiede meno di 24 ore ed è stato implementato perché alcuni utenti abusavano del nostro servizio, cancellando rapidamente i loro account – impedendoci di bloccare le impronte del loro metodo di pagamento su Stripe.

L'eliminazione del tuo account comporta anche l'eliminazione dei domini che amministri, dei tuoi alias e dei token push registrati per essi. Il record stesso dell'account rimane, ma l'indirizzo email, i dati di fatturazione, la password e le passkey vengono rimossi, l'autenticazione a due fattori e il token API vengono revocati, e conserviamo i relativi dati di pagamento per i rimborsi e la contabilità. I log e i dati di analisi che fanno riferimento al tuo account vengono eliminati secondo le tempistiche indicate sopra.

Per rimuovere i dati delle app da un dispositivo, disconnettiti dall'app o disinstallala.


## Ulteriori Informazioni {#additional-disclosures}

Questo sito è protetto da Cloudflare e si applicano la sua [Privacy Policy](https://www.cloudflare.com/privacypolicy/) e i [Termini di Servizio](https://www.cloudflare.com/website-terms/).
