# Email resistente ai quantum: come utilizziamo le caselle di posta SQLite crittografate per proteggere la tua posta elettronica {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [Confronto tra fornitori di servizi di posta elettronica](#email-service-provider-comparison)
* [Come funziona](#how-does-it-work)
* [Tecnologie](#technologies)
  * [Banche dati](#databases)
  * [Sicurezza](#security)
  * [cassette postali](#mailboxes)
  * [Concorrenza](#concurrency)
  * [Backup](#backups)
  * [Ricerca](#search)
  * [Progetti](#projects)
  * [Fornitori](#providers)
* [Pensieri](#thoughts)
  * [Principi](#principles)
  * [Esperimenti](#experiments)
  * [Mancanza di alternative](#lack-of-alternatives)
  * [Prova Inoltra email](#try-out-forward-email)

## Prefazione {#foreword}

> \[!IMPORTANT]
> Il nostro servizio di posta elettronica è [100% open source](https://github.com/forwardemail) e incentrato sulla privacy, tramite caselle di posta SQLite sicure e crittografate.

Fino al lancio di [Supporto IMAP](/faq#do-you-support-receiving-email-with-imap), abbiamo utilizzato MongoDB per le nostre esigenze di archiviazione dati persistente.

Questa tecnologia è straordinaria e la utilizziamo ancora oggi, ma per avere la crittografia a riposo con MongoDB è necessario utilizzare un provider che offra MongoDB Enterprise, come Digital Ocean o Mongo Atlas, oppure pagare una licenza aziendale (e di conseguenza dover lavorare con la latenza del team di vendita).

Il nostro team di [Inoltra e-mail](https://forwardemail.net) necessitava di una soluzione di archiviazione per caselle di posta IMAP facile da usare, scalabile, affidabile e crittografata. In quanto sviluppatori open source, utilizzare una tecnologia che richiede il pagamento di una licenza per ottenere la funzionalità di crittografia a riposo era controproducente per [i nostri principi](#principles), quindi abbiamo sperimentato, ricercato e sviluppato da zero una nuova soluzione per risolvere queste esigenze.

Invece di utilizzare un database condiviso per archiviare le tue caselle di posta, le memorizziamo e le criptiamo individualmente con la tua password (che possiedi solo tu). **Il nostro servizio di posta elettronica è così sicuro che se dimentichi la password, perdi la tua casella di posta** (e devi recuperarla con backup offline o ricominciare da capo).

Continua a leggere perché di seguito analizzeremo in dettaglio [confronto dei fornitori di servizi di posta elettronica](#email-service-provider-comparison), [come funziona il nostro servizio](#how-does-it-work), [il nostro stack tecnologico](#technologies) e altro ancora.

## Confronto tra fornitori di servizi di posta elettronica {#email-service-provider-comparison}

Siamo l'unico fornitore di servizi di posta elettronica open source al 100% e incentrato sulla privacy che archivia caselle di posta SQLite crittografate individualmente, offre domini, alias e utenti illimitati e supporta SMTP, IMAP e POP3 in uscita:

**A differenza di altri provider di posta elettronica, con Forward Email non è necessario pagare per lo spazio di archiviazione per dominio o alias.** Lo spazio di archiviazione è condiviso tra tutti i tuoi account, quindi se hai più nomi di dominio personalizzati e più alias per ciascuno di essi, siamo la soluzione perfetta per te. Tieni presente che puoi comunque applicare limiti di spazio di archiviazione, se lo desideri, per dominio o alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Leggi il confronto dei servizi di posta elettronica <i class="fa fa-search-plus"></i></a>

## Come funziona {#how-does-it-work}

1. Utilizzando il tuo client di posta elettronica come Apple Mail, Thunderbird, Gmail o Outlook, ti connetti ai nostri server sicuri [IMAP](/faq#do-you-support-receiving-email-with-imap) utilizzando il tuo nome utente e password:

* Il tuo nome utente è il tuo alias completo con il tuo dominio, ad esempio `hello@example.com`.
* La tua password viene generata casualmente e ti viene mostrata solo per 30 secondi quando clicchi su <strong class="text-success"><i class="fa fa-key"></i>Genera password</strong> da <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Domini <i class="fa fa-angle-right"></i> del mio account</a> <i class="fa fa-angle-right"></i> Alias.

2. Una volta connesso, il tuo client di posta elettronica invierà [Comandi del protocollo IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) al nostro server IMAP per mantenere sincronizzata la tua casella di posta. Questo include la scrittura e l'archiviazione delle bozze di email e altre azioni che potresti eseguire (ad esempio, etichettare un'email come Importante o contrassegnarla come Spam/Posta indesiderata).

3. I server di scambio di posta (comunemente noti come server "MX") ricevono le nuove email in arrivo e le archiviano nella tua casella di posta. Quando ciò accade, il tuo client di posta elettronica riceverà una notifica e sincronizzerà la tua casella di posta. I nostri server di scambio di posta possono inoltrare le tue email a uno o più destinatari (incluso [webhook](/faq#do-you-support-webhooks)), archiviare le tue email per te nel tuo archivio IMAP crittografato, **o entrambe le cose**!

> \[!TIP]
> Vuoi saperne di più? Leggi [come impostare l'inoltro e-mail](/faq#how-do-i-get-started-and-set-up-email-forwarding), [come funziona il nostro servizio di scambio di posta](/faq#how-does-your-email-forwarding-system-work) o visualizza [le nostre guide](/guides).

4. Dietro le quinte, il nostro sistema di archiviazione sicura delle e-mail funziona in due modi per mantenere le tue caselle di posta crittografate e accessibili solo a te:

* Quando riceviamo una nuova posta da un mittente, i nostri server di scambio posta scrivono per te in una casella di posta individuale, temporanea e crittografata.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Quando ti connetti al nostro server IMAP con il tuo client di posta elettronica, la tua password viene crittografata in memoria e utilizzata per leggere e scrivere nella tua casella di posta. La tua casella di posta può essere letta e scritta solo con questa password. Tieni presente che, poiché sei l'unico a conoscere questa password, **solo tu** puoi leggere e scrivere nella tua casella di posta quando vi accedi. La prossima volta che il tuo client di posta elettronica tenterà di interrogare la posta o di sincronizzare, i nuovi messaggi verranno trasferiti da questa casella di posta temporanea e archiviati nel file della casella di posta effettiva utilizzando la password fornita. Tieni presente che questa casella di posta temporanea verrà successivamente eliminata, in modo che solo la tua casella di posta protetta da password contenga i messaggi.

* **Se sei connesso a IMAP (ad esempio, utilizzando un client di posta elettronica come Apple Mail o Thunderbird), non abbiamo bisogno di scrivere su un disco di archiviazione temporaneo. La tua password IMAP crittografata in memoria viene invece recuperata e utilizzata. In tempo reale, quando un messaggio tenta di esserti recapitato, inviamo una richiesta WebSocket a tutti i server IMAP chiedendo loro se hanno una sessione attiva per te (questa è la fase di recupero), e successivamente inoltriamo la password crittografata in memoria, quindi non abbiamo bisogno di scrivere su una casella di posta temporanea, possiamo scrivere sulla tua casella di posta crittografata effettiva utilizzando la tua password crittografata.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Backup delle tue caselle di posta crittografate](#backups) vengono eseguiti quotidianamente. Puoi anche richiedere un nuovo backup in qualsiasi momento o scaricare l'ultimo backup da <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias. Se decidi di passare a un altro servizio di posta elettronica, puoi facilmente migrare, scaricare, esportare ed eliminare le tue caselle di posta e i tuoi backup in qualsiasi momento.

## Tecnologie {#technologies}

### Database {#databases}

Abbiamo esplorato altri possibili livelli di archiviazione del database, ma nessuno ha soddisfatto i nostri requisiti quanto SQLite:

| Banca dati | Crittografia a riposo | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Cassette postali | Licenza | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: | :white_check_mark: Sì con [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :segno di spunta bianco: | :white_check_mark: Pubblico dominio | :segno di spunta bianco: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Database relazionale | :x: AGPL e `SSPL-1.0` | :X: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Database relazionale | :segno di spunta bianco: __CODICE_CELLULARE_0__ | :X: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :segno di spunta bianco: __CODICE_CELLULARE_0__ | :X: |
| [PostgreSQL](https://www.postgresql.org/) | :segno di spunta bianco: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Database relazionale | :white_check_mark: `PostgreSQL` (simile a `BSD` o `MIT`) | :X: |
| [MariaDB](https://mariadb.com/) | :segno di spunta bianco: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Database relazionale | :white_check_mark: `GPLv2` e `BUSL-1.1` | :X: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Database relazionale | :x: `BUSL-1.1` e altri | :X: |

> Ecco un [post del blog che confronta diverse opzioni di archiviazione del database SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) nella tabella sopra.

### Sicurezza {#security}

Utilizziamo sempre la crittografia [crittografia a riposo](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [crittografia in transito](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS su HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") con :tangerine: [mandarino](https://tangeri.ne) e [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) sulle caselle di posta. Inoltre, utilizziamo l'autenticazione a due fattori basata su token (al contrario degli SMS, che sono sospetti di [attacchi man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), chiavi SSH ruotate con accesso root disabilitato, accesso esclusivo ai server tramite indirizzi IP riservati e altro ancora.

In caso di [attacco della cameriera malvagia](https://en.wikipedia.org/wiki/Evil_maid_attack) o di un dipendente non autorizzato di un fornitore terzo, **la tua casella di posta potrà comunque essere aperta solo con la password generata**. Non preoccuparti, non ci affidiamo a fornitori terzi, a parte i nostri fornitori di server certificati SOC Tipo 2: Cloudflare, DataPacket, Digital Ocean e Vultr.

Il nostro obiettivo è avere il minor numero possibile di [singolo punto di errore](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Caselle postali {#mailboxes}

> **tldr;** I nostri server IMAP utilizzano database SQLite crittografati individualmente per ciascuna delle tue caselle di posta.

Database incorporato [SQLite è estremamente popolare](https://www.sqlite.org/mostdeployed.html): attualmente in esecuzione sul telefono e sul computer – [e utilizzato da quasi tutte le principali tecnologie](https://www.sqlite.org/famous.html).

Ad esempio, sui nostri server crittografati è presente una casella di posta del database SQLite per `linux@example.com`, `info@example.com`, `hello@example.com` e così via, una per ciascuno come file di database `.sqlite`. Non nominiamo i file di database con l'indirizzo email, ma utilizziamo invece l'ObjectID BSON e gli UUID univoci generati che non rivelano a chi appartiene la casella di posta o a quale indirizzo email appartiene (ad esempio, `353a03f21e534321f5d6e267.sqlite`).

Ciascuno di questi database è crittografato autonomamente utilizzando la tua password (di cui solo tu sei in possesso) con [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Ciò significa che le tue caselle di posta sono crittografate individualmente, autonome, [in modalità sandbox](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\) e portabili.

Abbiamo ottimizzato SQLite con il seguente [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Scopo |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Per maggiori informazioni, fare riferimento a `better-sqlite3-multiple-ciphers` in [Projects](#projects). |
| `key="****************"` | Questa è la tua password decriptata, che rimane in memoria solo per un certo periodo, e che viene trasmessa al nostro server tramite la connessione IMAP del tuo client di posta elettronica. Nuove istanze del database vengono create e chiuse per ogni sessione di lettura e scrittura (per garantire sandbox e isolamento). |
| `journal_model=WAL` | Registro di scrittura anticipata ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Previene gli errori di blocco in scrittura [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Aumenta la durabilità delle transazioni [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Impone che i riferimenti a chiavi esterne (ad esempio una relazione da una tabella all'altra) vengano applicati. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), ma per la convalida e l'integrità dei dati dovrebbe essere abilitato. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) da utilizzare per garantire la correttezza delle informazioni fornite dallo sviluppatore. |

> Tutti gli altri valori predefiniti provengono da SQLite come specificato da [documentazione ufficiale PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concorrenza {#concurrency}

> **tldr;** Utilizziamo `WebSocket` per letture e scritture simultanee nelle caselle di posta SQLite crittografate.

#### Legge {#reads}

Il tuo client di posta elettronica sul tuo telefono potrebbe risolvere `imap.forwardemail.net` in uno dei nostri indirizzi IP Digital Ocean, mentre il tuo client desktop potrebbe risolvere un IP separato da un [fornitore](#providers) completamente diverso.

Indipendentemente dal server IMAP a cui si connette il tuo client di posta elettronica, vogliamo che la connessione legga i dati dal tuo database in tempo reale con una precisione del 100%. Questo avviene tramite WebSocket.

#### Scrive {#writes}

La scrittura sul database è un po' diversa, poiché SQLite è un database incorporato e la casella di posta è salvata per impostazione predefinita in un singolo file.

Di seguito abbiamo esaminato opzioni quali `litestream`, `rqlite` e `dqlite`, ma nessuna di queste soddisfaceva i nostri requisiti.

Per eseguire scritture con il write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") abilitato, dobbiamo assicurarci che un solo server ("Primary") sia responsabile di tale operazione. [WAL](https://www.sqlite.org/wal.html) velocizza notevolmente la concorrenza e consente un solo writer e più reader.

Il server primario è in esecuzione sui server dati con i volumi montati contenenti le caselle di posta crittografate. Dal punto di vista della distribuzione, si potrebbero considerare tutti i singoli server IMAP dietro `imap.forwardemail.net` come server secondari ("Secondario").

Realizziamo una comunicazione bidirezionale con [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* I server primari utilizzano un'istanza del server `WebSocketServer` di [ws](https://github.com/websockets/ws).
* I server secondari utilizzano un'istanza del client `WebSocket` di [ws](https://github.com/websockets/ws), che è incapsulata con [websocket-come-promesso](https://github.com/vitalets/websocket-as-promised) e [riconnessione-websocket](https://github.com/opensumi/reconnecting-websocket). Questi due wrapper garantiscono che `WebSocket` si riconnetta e possa inviare e ricevere dati per specifiche scritture sul database.

### Backup {#backups}

> **tldr;** I backup delle tue caselle di posta crittografate vengono eseguiti quotidianamente. Puoi anche richiedere immediatamente un nuovo backup o scaricare l'ultimo backup in qualsiasi momento da <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias.

Per i backup, eseguiamo semplicemente il comando SQLite `VACUUM INTO` ogni giorno durante l'elaborazione dei comandi IMAP, che sfrutta la password crittografata da una connessione IMAP in memoria. I backup vengono archiviati se non viene rilevato alcun backup esistente o se l'hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) del file è cambiato rispetto al backup più recente.

Si noti che utilizziamo il comando `VACUUM INTO` anziché il comando integrato `backup`, perché se una pagina viene modificata durante un'operazione con il comando `backup`, deve ricominciare da capo. Il comando `VACUUM INTO` eseguirà uno snapshot. Per ulteriori informazioni, consultare i commenti su [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) e [Notizie sugli hacker](https://news.ycombinator.com/item?id=31387556).

Inoltre utilizziamo `VACUUM INTO` anziché `backup`, perché il comando `backup` lascerebbe il database non crittografato per un breve periodo finché non viene richiamato `rekey` (per approfondimenti, vedere questo comando [commento](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) su GitHub).

Il Secondario istruirà il Primario tramite la connessione `WebSocket` per eseguire il backup. Il Primario riceverà quindi il comando per farlo e successivamente:

1. Connettiti alla tua casella di posta crittografata.
2. Ottieni un blocco di scrittura.
3. Esegui un checkpoint WAL tramite `wal_checkpoint(PASSIVE)`.
4. Esegui il comando SQLite `VACUUM INTO`.
5. Assicurati che il file copiato possa essere aperto con la password crittografata (protezione/dummy proofing).
6. Caricalo su Cloudflare R2 per l'archiviazione (o sul tuo provider, se specificato).

<!--
7. Comprimi il file di backup risultante con `gzip`.
8. Caricalo su Cloudflare R2 per l'archiviazione (o sul tuo provider, se specificato).
-->

Ricorda che le tue caselle di posta sono crittografate e, nonostante siano in atto restrizioni IP e altre misure di autenticazione per la comunicazione WebSocket, nel caso di un malintenzionato puoi stare certo che, a meno che il payload WebSocket non abbia la tua password IMAP, non potrà aprire il tuo database.

Al momento viene archiviato un solo backup per casella di posta, ma in futuro potremmo offrire il ripristino point-in-time ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Cerca {#search}

I nostri server IMAP supportano il comando `SEARCH` con query complesse, espressioni regolari e altro ancora.

Le prestazioni di ricerca veloci sono garantite da [FTS5](https://www.sqlite.org/fts5.html) e [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Memorizziamo i valori `Date` nelle caselle di posta di SQLite come stringhe [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) tramite [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (con fuso orario UTC affinché i confronti di uguaglianza funzionino correttamente).

Vengono inoltre memorizzati indici per tutte le proprietà presenti nelle query di ricerca.

### Progetti {#projects}

Ecco una tabella che riassume i progetti che utilizziamo nel nostro codice sorgente e nel processo di sviluppo (in ordine alfabetico):

| Progetto | Scopo |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Piattaforma di automazione DevOps per la manutenzione, la scalabilità e la gestione semplificata dell'intera flotta di server. |
| [Bree](https://github.com/breejs/bree) | Pianificatore di attività per Node.js e JavaScript con cron, date, ms, later e supporto intuitivo. |
| [Cabin](https://github.com/cabinjs/cabin) | Libreria di registrazione JavaScript e Node.js intuitiva per gli sviluppatori, attenta alla sicurezza e alla privacy. |
| [Lad](https://github.com/ladjs/lad) | Framework Node.js che alimenta l'intera progettazione architettonica e ingegneristica con MVC e altro ancora. |
| [MongoDB](https://www.mongodb.com/) | Soluzione di database NoSQL che utilizziamo per archiviare tutti gli altri dati esterni alle caselle di posta (ad esempio, account, impostazioni, domini e configurazioni degli alias). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modellazione di documenti a oggetti ("ODM") di MongoDB, che utilizziamo in tutto il nostro stack. Abbiamo scritto degli helper speciali che ci permettono di continuare a usare **Mongoose con SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js è l'ambiente di runtime JavaScript open source e multipiattaforma che esegue tutti i nostri processi server. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Pacchetto Node.js per inviare email, creare connessioni e altro ancora. Siamo sponsor ufficiali di questo progetto. |
| [Redis](https://redis.io/) | Database in memoria per la memorizzazione nella cache, canali di pubblicazione/sottoscrizione e richieste DNS su HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Estensione di crittografia per SQLite che consente di crittografare interi file di database (inclusi write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Editor visuale di SQLite (che potresti anche utilizzare) per testare, scaricare e visualizzare le caselle di posta di sviluppo. |
| [SQLite](https://www.sqlite.org/about.html) | Livello di database incorporato per un'archiviazione IMAP scalabile, autonoma, veloce e resiliente. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Strumento anti-spam, di filtraggio delle email e di prevenzione del phishing di Node.js (la nostra alternativa a [Spam Assassin](https://spamassassin.apache.org/) e [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Richieste DNS su HTTPS con Node.js e memorizzazione nella cache tramite Redis, che garantisce coerenza globale e molto altro. |
| [Thunderbird](https://www.thunderbird.net/) | Il nostro team di sviluppo lo utilizza (e lo consiglia) come **client di posta elettronica preferito da utilizzare con Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Il nostro team di sviluppo utilizza questa tecnologia per creare macchine virtuali per iOS e macOS per testare diversi client di posta elettronica (in parallelo) con i nostri server IMAP e SMTP. |
| [Ubuntu](https://ubuntu.com/download/server) | Moderno sistema operativo server open source basato su Linux che alimenta tutta la nostra infrastruttura. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Libreria del server IMAP: vedere le note su [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) e [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Libreria API semplice e veloce per l'interazione di Node.js con SQLite3 a livello di programmazione. |
| [email-templates](https://github.com/forwardemail/email-templates) | Framework di posta elettronica intuitivo per gli sviluppatori che consente di creare, visualizzare in anteprima e inviare e-mail personalizzate (ad esempio, notifiche dell'account e altro ancora). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Generatore di query SQL che utilizza la sintassi in stile Mongo. Questo fa risparmiare tempo al nostro team di sviluppo, poiché possiamo continuare a scrivere in stile Mongo sull'intero stack con un approccio agnostico al database. **Aiuta anche a prevenire attacchi di iniezione SQL utilizzando parametri di query.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Utilità SQL per estrarre informazioni sullo schema del database esistente. Questo ci permette di verificare facilmente che tutti gli indici, le tabelle, le colonne, i vincoli e altro siano validi e `1:1` come previsto. Abbiamo persino scritto helper automatici per aggiungere nuove colonne e indici in caso di modifiche agli schemi del database (con avvisi di errore estremamente dettagliati). |
| [knex](https://github.com/knex/knex) | Generatore di query SQL che utilizziamo solo per le migrazioni del database e la convalida dello schema tramite `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Traduzione automatica di frasi [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) con supporto per Markdown tramite [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Pacchetto Node.js per risolvere e stabilire connessioni con i server MX e gestire gli errori. |
| [pm2](https://github.com/Unitech/pm2) | Gestore dei processi di produzione Node.js con bilanciatore del carico integrato ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) per le prestazioni). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Libreria server SMTP: la utilizziamo per i nostri server di scambio di posta ("MX") e SMTP in uscita. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Strumento utile per testare i server IMAP rispetto ai benchmark e alla compatibilità del protocollo IMAP secondo le specifiche RFC. Questo progetto è stato creato dal team [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\) (un server IMAP e POP3 open source attivo da luglio 2002). Abbiamo testato ampiamente il nostro server IMAP con questo strumento. |

> Puoi trovare altri progetti che utilizziamo in [il nostro codice sorgente su GitHub](https://github.com/forwardemail).

### Fornitori {#providers}

| Fornitore | Scopo |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Provider DNS, controlli di integrità, bilanciatori di carico e archiviazione di backup tramite [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting su server dedicati e database gestiti. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hosting su server dedicato. |
| [DataPacket](https://www.datapacket.com) | Hosting su server dedicato. |

## Pensieri {#thoughts}

### Principi {#principles}

Forward Email è progettato secondo questi principi:

1. Siate sempre attenti agli sviluppatori, attenti alla sicurezza e alla privacy e trasparenti.
2. Rispettate [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Dodici Fattori](https://12factor.net/), [Il rasoio di Occam](https://en.wikipedia.org/wiki/Occam%27s_razor) e [cibo per cani](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Puntate allo sviluppatore intraprendente, bootstrapper e [ramen redditizio](http://www.paulgraham.com/ramenprofitable.html).

### Esperimenti {#experiments}

> **tldr;** In definitiva, l'utilizzo di un archivio di oggetti compatibile con S3 e/o di tabelle virtuali non è tecnicamente fattibile per motivi di prestazioni e potrebbe essere soggetto a errori dovuti alle limitazioni di memoria.

Abbiamo condotto alcuni esperimenti per arrivare alla soluzione SQLite definitiva, come discusso sopra.

Uno di questi era provare a utilizzare [rclone]() e SQLite insieme a un livello di archiviazione compatibile con S3.

Questo esperimento ci ha portato a comprendere meglio e scoprire casi limite riguardanti l'utilizzo di rclone, SQLite e [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Se si abilita il flag `--vfs-cache-mode writes` con rclone, le letture saranno corrette, mentre le scritture verranno memorizzate nella cache.
* Se si dispone di più server IMAP distribuiti a livello globale, la cache sarà disattivata su di essi, a meno che non si disponga di un singolo writer e di più listener (ad esempio, un approccio pub/sub).
* Questo è incredibilmente complesso e l'aggiunta di ulteriori complessità come questa comporterà ulteriori singoli punti di errore.
* I provider di storage compatibili con S3 non supportano modifiche parziali ai file, il che significa che qualsiasi modifica al file `.sqlite` comporterà una modifica completa e un nuovo caricamento del database.
* Esistono altre soluzioni come `rsync`, ma non sono focalizzate sul supporto write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), quindi abbiamo deciso di valutare Litestream. Fortunatamente, il nostro utilizzo della crittografia crittografa già i file [WAL](https://www.sqlite.org/wal.html), quindi non abbiamo bisogno di affidarci a Litestream per questo. Tuttavia, non eravamo ancora sicuri di Litestream per l'uso in produzione e di seguito riportiamo alcune note a riguardo.
* L'utilizzo di questa opzione di `--vfs-cache-mode writes` (l'*unico* modo per utilizzare SQLite su `rclone` per le scritture) tenterà di copiare l'intero database da zero in memoria: gestire una casella di posta da 10 GB è accettabile, ma gestire più caselle di posta con uno spazio di archiviazione eccessivamente elevato causerà limitazioni di memoria nei server IMAP e causerà errori `ENOMEM`, errori di segmentazione e danneggiamento dei dati. * Se si tenta di utilizzare SQLite [Tavoli virtuali](https://www.sqlite.org/vtab.html) (ad esempio, utilizzando [s3db](https://github.com/jrhy/s3db)) per archiviare i dati su un livello di archiviazione compatibile con S3, si incontreranno diversi altri problemi:
* Le operazioni di lettura e scrittura saranno estremamente lente poiché gli endpoint dell'API S3 dovranno essere raggiunti con i metodi HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 e `.sqlite`3.
* I test di sviluppo hanno dimostrato che superare i 500.000-1.000.000 record su una connessione Internet in fibra ottica è ancora limitato dalla velocità di scrittura e lettura verso provider compatibili con S3. Ad esempio, i nostri sviluppatori hanno eseguito cicli `.sqlite`4 per eseguire sia istruzioni SQL sequenziali `.sqlite`5 sia istruzioni che scrivono in blocco grandi quantità di dati. In entrambi i casi, le prestazioni sono state incredibilmente lente. * Le tabelle virtuali **non possono avere indici**, istruzioni `.sqlite`6 e `.sqlite`7 `.sqlite`8, il che causa ritardi di 1-2 minuti o più a seconda della quantità di dati.
* Gli oggetti sono stati archiviati in formato non crittografato e non è disponibile alcun supporto nativo per la crittografia.
* Abbiamo anche valutato l'utilizzo di `.sqlite`9, che è concettualmente e tecnicamente simile al punto precedente (quindi presenta gli stessi problemi). Una possibilità sarebbe quella di utilizzare una build personalizzata di `rsync`0 con crittografia, come `rsync`1 (che attualmente utilizziamo nella nostra soluzione precedente) tramite `rsync`2.
* Un altro possibile approccio consisteva nell'utilizzare `rsync`3, tuttavia questo ha una limitazione di 32 GB e richiederebbe complesse procedure di compilazione e sviluppo.
* Sono richieste istruzioni `rsync`4 (quindi questo esclude completamente l'utilizzo di tabelle virtuali). Abbiamo bisogno delle istruzioni `rsync`5 affinché il nostro hook con `rsync`6 funzioni correttamente, il che garantisce che i dati non siano corrotti e che le righe recuperate possano essere convertite in documenti validi in base alle definizioni dello schema `rsync`7 (che includono vincoli, tipi di variabili e convalida dei dati arbitrari).
* Quasi tutti i progetti compatibili con S3 relativi a SQLite nella community open source sono in Python (e non in JavaScript, che utilizziamo per il 100% del nostro stack).
* Le librerie di compressione come `rsync`8 (vedi `rsync`9) sembrano promettenti, ma __PROTECTED_LINK_189__0. Invece, la compressione lato applicazione su tipi di dati come __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 e __PROTECTED_LINK_189__6 sarà un approccio più pulito e semplice (ed è anche più facile da migrare, poiché potremmo memorizzare un flag o una colonna __PROTECTED_LINK_189__7, o persino utilizzare __PROTECTED_LINK_189__8 e __PROTECTED_LINK_189__9 per la compressione o __PROTECTED_LINK_190__0 per nessuna compressione come metadati del database).
* Fortunatamente abbiamo già implementato la deduplicazione degli allegati nello storage del nostro server IMAP, quindi ogni messaggio con lo stesso allegato non conserverà una copia dell'allegato; al suo posto, un singolo allegato viene memorizzato per più messaggi e thread in una casella di posta (e successivamente viene utilizzato un riferimento esterno).
* Il progetto Litestream, una soluzione di replica e backup di SQLite, è molto promettente e molto probabilmente lo utilizzeremo in futuro. * Senza voler screditare gli autori, perché amiamo il loro lavoro e il loro contributo all'open source da oltre un decennio, tuttavia dall'utilizzo pratico sembra che esistano __PROTECTED_LINK_190__1 e __PROTECTED_LINK_190__2.
* Il ripristino dei backup deve essere semplice e senza intoppi. Utilizzare una soluzione come MongoDB con __PROTECTED_LINK_190__3 e __PROTECTED_LINK_190__4 non è solo noioso, ma richiede anche molto tempo e presenta complessità di configurazione.
* I database SQLite semplificano il tutto (si tratta di un singolo file).
* Volevamo progettare una soluzione in cui gli utenti potessero utilizzare la propria casella di posta e andarsene in qualsiasi momento.
* Semplici comandi Node.js per __PROTECTED_LINK_190__5 e questo viene cancellato definitivamente dall'archiviazione su disco.
* Allo stesso modo, possiamo utilizzare un'API compatibile con S3 con HTTP __PROTECTED_LINK_190__6 per rimuovere facilmente snapshot e backup per gli utenti.
* SQLite si è rivelata la soluzione più semplice, veloce ed economica.

### Mancanza di alternative {#lack-of-alternatives}

Per quanto ne sappiamo, nessun altro servizio di posta elettronica è progettato in questo modo né è open source.

*Riteniamo che ciò possa essere dovuto* al fatto che i servizi di posta elettronica esistenti utilizzano una tecnologia obsoleta in produzione con [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

La maggior parte, se non tutti, i provider di servizi di posta elettronica esistenti sono closed-source o vengono pubblicizzati come open-source, **ma in realtà solo il loro front-end è open-source.**

**La parte più delicata della posta elettronica** (l'interazione vera e propria tra archiviazione/IMAP/SMTP) **viene eseguita interamente sul back-end (server) e *non* sul front-end (client)**.

### Prova l'inoltro email {#try-out-forward-email}

Iscriviti oggi su <https://forwardemail.net>! :rocket: