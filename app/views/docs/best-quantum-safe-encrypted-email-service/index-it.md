# Email Resistente al Quantum: Come utilizziamo cassette postali SQLite criptate per mantenere la tua email sicura {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Illustrazione del servizio email criptato sicuro contro il quantum" class="rounded-lg" />


## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [Confronto tra provider di servizi email](#email-service-provider-comparison)
* [Come funziona](#how-does-it-work)
* [Tecnologie](#technologies)
  * [Database](#databases)
  * [Sicurezza](#security)
  * [Caselle postali](#mailboxes)
  * [Concorrenza](#concurrency)
  * [Backup](#backups)
  * [Ricerca](#search)
  * [Progetti](#projects)
  * [Provider](#providers)
* [Riflessioni](#thoughts)
  * [Principi](#principles)
  * [Esperimenti](#experiments)
  * [Mancanza di alternative](#lack-of-alternatives)
  * [Prova Forward Email](#try-out-forward-email)


## Prefazione {#foreword}

> \[!IMPORTANT]
> Il nostro servizio email è [100% open-source](https://github.com/forwardemail) e focalizzato sulla privacy tramite cassette postali SQLite sicure e criptate.

Fino al lancio del [supporto IMAP](/faq#do-you-support-receiving-email-with-imap), utilizzavamo MongoDB per le nostre esigenze di archiviazione dati persistente.

Questa tecnologia è straordinaria e la usiamo ancora oggi – ma per avere la crittografia a riposo con MongoDB è necessario utilizzare un provider che offra MongoDB Enterprise, come Digital Ocean o Mongo Atlas – oppure pagare una licenza enterprise (e di conseguenza dover gestire i tempi di risposta del team commerciale).

Il nostro team di [Forward Email](https://forwardemail.net) aveva bisogno di una soluzione di archiviazione crittografata, scalabile, affidabile e amichevole per gli sviluppatori per le cassette postali IMAP. Come sviluppatori open-source, usare una tecnologia per cui è necessario pagare una licenza per ottenere la crittografia a riposo andava contro [i nostri principi](#principles) – così abbiamo sperimentato, ricercato e sviluppato una nuova soluzione da zero per soddisfare queste esigenze.

Invece di usare un database condiviso per memorizzare le tue cassette postali, le memorizziamo e crittografiamo individualmente con la tua password (che solo tu possiedi).  **Il nostro servizio email è così sicuro che se dimentichi la tua password, perdi la tua casella** (e devi recuperare con backup offline o ricominciare da capo).

Continua a leggere mentre approfondiamo con un [confronto tra provider di servizi email](#email-service-provider-comparison), [come funziona il nostro servizio](#how-does-it-work), [la nostra tecnologia](#technologies) e altro.


## Confronto tra provider di servizi email {#email-service-provider-comparison}

Siamo l’unico provider di servizi email 100% open-source e focalizzato sulla privacy che memorizza cassette postali SQLite criptate individualmente, offre domini, alias e utenti illimitati, e supporta SMTP in uscita, IMAP e POP3:

**A differenza di altri provider email, con Forward Email non devi pagare per lo spazio di archiviazione su base per dominio o alias.**  Lo spazio è condiviso su tutto il tuo account – quindi se hai più nomi di dominio personalizzati e più alias per ciascuno, siamo la soluzione perfetta per te. Nota che puoi comunque imporre limiti di archiviazione se desideri su base per dominio o alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Leggi il Confronto tra Servizi Email <i class="fa fa-search-plus"></i></a>


## Come funziona {#how-does-it-work}

1. Usando il tuo client email come Apple Mail, Thunderbird, Gmail o Outlook – ti connetti ai nostri server [IMAP](/faq#do-you-support-receiving-email-with-imap) sicuri usando il tuo nome utente e password:

   * Il tuo nome utente è il tuo alias completo con il dominio, ad esempio `hello@example.com`.
   * La tua password è generata casualmente e mostrata solo a te per 30 secondi quando clicchi su <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> da <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias.
2. Una volta connesso, il tuo client di posta invierà [comandi del protocollo IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) al nostro server IMAP per mantenere la tua casella di posta sincronizzata. Questo include la scrittura e la memorizzazione di bozze di email e altre azioni che potresti fare (ad esempio, etichettare un'email come Importante o contrassegnare un'email come Spam/Posta Indesiderata).

3. I server di scambio mail (comunemente noti come server "MX") ricevono nuove email in arrivo e le memorizzano nella tua casella di posta. Quando ciò accade, il tuo client di posta viene notificato e sincronizza la tua casella. I nostri server di scambio mail possono inoltrare la tua email a uno o più destinatari (inclusi i [webhook](/faq#do-you-support-webhooks)), memorizzare la tua email per te nel tuo spazio IMAP crittografato con noi, **o entrambi**!

   > \[!TIP]
   > Interessato a saperne di più? Leggi [come configurare l'inoltro email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [come funziona il nostro servizio di scambio mail](/faq#how-does-your-email-forwarding-system-work), o consulta [le nostre guide](/guides).

4. Dietro le quinte, il nostro design di archiviazione email sicura funziona in due modi per mantenere le tue caselle di posta crittografate e accessibili solo da te:

   * Quando arriva una nuova mail per te da un mittente, i nostri server di scambio mail scrivono in una casella di posta individuale, temporanea e crittografata per te.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Messaggio in arrivo ricevuto per il tuo alias (es. tu@tuodominio.com).
         MX->>SQLite: Il messaggio viene memorizzato in una casella temporanea.
         Note over MX,SQLite: Inoltra ad altri destinatari e webhook configurati.
         MX->>Sender: Successo!
     ```

   * Quando ti connetti al nostro server IMAP con il tuo client di posta, la tua password viene crittografata in memoria e usata per leggere e scrivere nella tua casella di posta. La tua casella può essere letta e scritta solo con questa password. Tieni presente che, poiché sei l'unico a possedere questa password, **solo tu** puoi leggere e scrivere nella tua casella quando la stai utilizzando. La prossima volta che il tuo client di posta tenterà di controllare la posta o sincronizzarsi, i nuovi messaggi verranno trasferiti da questa casella temporanea e memorizzati nel file della tua casella reale usando la password fornita. Nota che questa casella temporanea viene poi svuotata e cancellata in modo che solo la tua casella protetta da password contenga i messaggi.

   * **Se sei connesso a IMAP (ad esempio usando un client di posta come Apple Mail o Thunderbird), allora non è necessario scrivere su uno storage temporaneo su disco. La tua password IMAP crittografata in memoria viene invece recuperata e usata. In tempo reale, quando un messaggio sta per essere consegnato a te, inviamo una richiesta WebSocket a tutti i server IMAP chiedendo se hanno una sessione attiva per te (questa è la parte di fetch), e successivamente passeremo quella password crittografata in memoria – così non dobbiamo scrivere in una casella temporanea, possiamo scrivere direttamente nella tua casella crittografata usando la tua password crittografata.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Ti connetti al server IMAP usando un client di posta.
         IMAP->>SQLite: Trasferisce il messaggio dalla casella temporanea alla casella del tuo alias.
         Note over IMAP,SQLite: La casella del tuo alias è disponibile solo in memoria usando la password IMAP.
         SQLite->>IMAP: Recupera i messaggi come richiesto dal client di posta.
         IMAP->>You: Successo!
     ```

5. [I backup delle tue caselle di posta crittografate](#backups) vengono effettuati quotidianamente. Puoi anche richiedere un nuovo backup in qualsiasi momento o scaricare l'ultimo backup da <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias. Se decidi di passare a un altro servizio email, puoi facilmente migrare, scaricare, esportare e cancellare le tue caselle e i backup in qualsiasi momento.


## Tecnologie {#technologies}

### Database {#databases}

Abbiamo esplorato altri possibili livelli di archiviazione database, tuttavia nessuno ha soddisfatto le nostre esigenze quanto SQLite:
| Database                                               |                                                                    Crittografia a riposo                                                                   |  Caselle di posta [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Licenza                           | [Usato Ovunque](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Sì con [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Pubblico Dominio              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Disponibile solo in MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Database relazionale                               |                   :x: AGPL e `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Solo rete](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Database relazionale                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Non testato e non ancora supportato?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Non testato e non ancora supportato?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Sì](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Database relazionale                               | :white_check_mark: `PostgreSQL` (simile a `BSD` o `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Solo per InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Database relazionale                               |          :white_check_mark: `GPLv2` e `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Funzionalità solo Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Database relazionale                               |                  :x: `BUSL-1.1` e altri                  |                             :x:                             |

> Ecco un [post sul blog che confronta diverse opzioni di archiviazione del database SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) nella tabella sopra.

### Sicurezza {#security}

In ogni momento utilizziamo [crittografia a riposo](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [crittografia in transito](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") usando :tangerine: [Tangerine](https://tangeri.ne), e la crittografia [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) sulle caselle di posta. Inoltre utilizziamo l'autenticazione a due fattori basata su token (invece di SMS che è suscettibile a [attacchi man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), chiavi SSH ruotate con accesso root disabilitato, accesso esclusivo ai server tramite indirizzi IP limitati e altro ancora.
In caso di un [attacco evil maid](https://en.wikipedia.org/wiki/Evil_maid_attack) o di un dipendente infedele di un fornitore terzo, **la tua casella di posta può comunque essere aperta solo con la password che hai generato tu**. Stai tranquillo, non ci affidiamo a nessun fornitore terzo oltre ai nostri provider di server conformi SOC Type 2 come Cloudflare, DataPacket, Digital Ocean, GitHub e Vultr.

Il nostro obiettivo è avere il minor numero possibile di [punti singoli di guasto](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Caselle di posta {#mailboxes}

> **tldr;** I nostri server IMAP utilizzano database SQLite crittografati individualmente per ciascuna delle tue caselle di posta.

[SQLite è un database embedded estremamente popolare](https://www.sqlite.org/mostdeployed.html) – attualmente è in esecuzione sul tuo telefono e computer – [e utilizzato da quasi tutte le principali tecnologie](https://www.sqlite.org/famous.html).

Ad esempio, sui nostri server crittografati c’è un database SQLite per la casella `linux@example.com`, `info@example.com`, `hello@example.com` e così via – uno per ciascuna come file database `.sqlite`. Non nominiamo i file database con l’indirizzo email – invece usiamo BSON ObjectID e UUID unici generati che non rivelano a chi appartiene la casella o quale indirizzo email rappresentano (es. `353a03f21e534321f5d6e267.sqlite`).

Ognuno di questi database è crittografato usando la tua password (che solo tu possiedi) tramite [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Questo significa che le tue caselle sono crittografate individualmente, autonome, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) e portatili.

Abbiamo ottimizzato SQLite con i seguenti [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Scopo                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Crittografia del database SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Consulta `better-sqlite3-multiple-ciphers` sotto [Projects](#projects) per maggiori dettagli.                           |
| `key="****************"` | Questa è la tua password decrittata solo in memoria che viene passata tramite la connessione IMAP del tuo client email al nostro server. Nuove istanze di database vengono create e chiuse per ogni sessione di lettura e scrittura (per garantire sandboxing e isolamento). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [che migliora le prestazioni e permette accessi di lettura concorrenti](https://litestream.io/tips/#wal-journal-mode).                                                                           |
| `busy_timeout=5000`      | Previene errori di blocco in scrittura [mentre altre scritture sono in corso](https://litestream.io/tips/#busy-timeout).                                                                                                                                  |
| `synchronous=NORMAL`     | Aumenta la durabilità delle transazioni [senza rischio di corruzione dati](https://litestream.io/tips/#synchronous-pragma).                                                                                                                               |
| `foreign_keys=ON`        | Impone che i riferimenti alle chiavi esterne (es. una relazione da una tabella a un’altra) siano rispettati. [Di default non è attivato in SQLite](https://www.sqlite.org/foreignkeys.html), ma per la validazione e integrità dei dati dovrebbe essere abilitato. |
| `encoding='UTF-8'`       | [Codifica predefinita](https://www.sqlite.org/pragma.html#pragma_encoding) da usare per garantire coerenza agli sviluppatori.                                                                                                                             |
> Tutti gli altri valori predefiniti provengono da SQLite come specificato nella [documentazione ufficiale PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concorrenza {#concurrency}

> **tldr;** Usiamo `WebSocket` per letture e scritture concorrenti nelle tue cassette postali SQLite criptate.

#### Letture {#reads}

Il tuo client email sul telefono potrebbe risolvere `imap.forwardemail.net` in uno dei nostri indirizzi IP Digital Ocean – e il tuo client desktop potrebbe risolvere un IP separato da un diverso [provider](#providers).

Indipendentemente da quale server IMAP il tuo client email si connetta, vogliamo che la connessione legga dal tuo database in tempo reale con il 100% di accuratezza. Questo viene fatto tramite WebSockets.

#### Scritture {#writes}

Scrivere nel tuo database è un po' diverso – dato che SQLite è un database embedded e la tua cassetta postale risiede in un singolo file di default.

Abbiamo esplorato opzioni come `litestream`, `rqlite` e `dqlite` di seguito – tuttavia nessuna di queste ha soddisfatto i nostri requisiti.

Per eseguire scritture con il write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") abilitato – dobbiamo assicurarci che solo un server ("Primario") sia responsabile di farlo.  [WAL](https://www.sqlite.org/wal.html) accelera drasticamente la concorrenza e permette un solo scrittore e più lettori.

Il Primario è in esecuzione sui server dati con i volumi montati contenenti le cassette postali criptate. Dal punto di vista della distribuzione, potresti considerare tutti i singoli server IMAP dietro `imap.forwardemail.net` come server secondari ("Secondari").

Realizziamo una comunicazione bidirezionale con [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* I server Primari usano un'istanza del server `WebSocketServer` di [ws](https://github.com/websockets/ws).
* I server Secondari usano un'istanza client `WebSocket` di [ws](https://github.com/websockets/ws) avvolta con [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) e [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Questi due wrapper assicurano che il `WebSocket` si ricolleghi e possa inviare e ricevere dati per scritture specifiche nel database.

### Backup {#backups}

> **tldr;** I backup delle tue cassette postali criptate vengono effettuati quotidianamente. Puoi anche richiedere istantaneamente un nuovo backup o scaricare l'ultimo backup in qualsiasi momento da <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias.

Per i backup, eseguiamo semplicemente il comando SQLite `VACUUM INTO` ogni giorno durante l'elaborazione dei comandi IMAP, che sfrutta la tua password criptata da una connessione IMAP in memoria. I backup vengono salvati se non viene rilevato un backup esistente o se l'hash [SHA-256](https://en.wikipedia.org/wiki/SHA-2) è cambiato sul file rispetto all'ultimo backup più recente.

Nota che usiamo il comando `VACUUM INTO` invece del comando `backup` integrato perché se una pagina viene modificata durante un'operazione di comando `backup`, allora deve ricominciare da capo. Il comando `VACUUM INTO` scatta un'istantanea. Vedi questi commenti su [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) e [Hacker News](https://news.ycombinator.com/item?id=31387556) per maggiori dettagli.

Inoltre usiamo `VACUUM INTO` invece di `backup`, perché il comando `backup` lascerebbe il database non criptato per un breve periodo fino a quando non viene invocato `rekey` (vedi questo commento GitHub [commento](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) per approfondimenti).

Il Secondario istruirà il Primario tramite la connessione `WebSocket` per eseguire il backup – e il Primario riceverà il comando per farlo e successivamente:

1. Si connetterà alla tua cassetta postale criptata.
2. Acquisirà un lock di scrittura.
3. Eseguirà un checkpoint WAL tramite `wal_checkpoint(PASSIVE)`.
4. Eseguirà il comando SQLite `VACUUM INTO`.
5. Verificherà che il file copiato possa essere aperto con la password criptata (protezione/garanzia).
6. Lo caricherà su Cloudflare R2 per l'archiviazione (o sul tuo provider se specificato).
<!--
7. Comprimi il file di backup risultante con `gzip`.
8. Caricalo su Cloudflare R2 per l'archiviazione (o sul tuo provider se specificato).
-->

Ricorda che le tue caselle di posta sono criptate – e mentre abbiamo restrizioni IP e altre misure di autenticazione in atto per la comunicazione WebSocket – in caso di un attore malevolo, puoi stare tranquillo che a meno che il payload WebSocket non contenga la tua password IMAP, non può aprire il tuo database.

Al momento viene memorizzato un solo backup per casella di posta, ma in futuro potremmo offrire il recupero puntuale ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Ricerca {#search}

I nostri server IMAP supportano il comando `SEARCH` con query complesse, espressioni regolari e altro.

Le prestazioni di ricerca rapide sono grazie a [FTS5](https://www.sqlite.org/fts5.html) e [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Memorizziamo i valori `Date` nelle caselle SQLite come stringhe [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) tramite [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (con fuso orario UTC affinché le comparazioni di uguaglianza funzionino correttamente).

Sono inoltre memorizzati indici per tutte le proprietà presenti nelle query di ricerca.

### Progetti {#projects}

Ecco una tabella che illustra i progetti che utilizziamo nel nostro codice sorgente e nel processo di sviluppo (ordinati alfabeticamente):

| Progetto                                                                                     | Scopo                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                         | Piattaforma di automazione DevOps per mantenere, scalare e gestire con facilità l'intera flotta di server.                                                                                                                                                                                                                                                        |
| [Bree](https://github.com/breejs/bree)                                                      | Scheduler di job per Node.js e JavaScript con supporto per cron, date, ms, later e formati umani.                                                                                                                                                                                                                                                                 |
| [Cabin](https://github.com/cabinjs/cabin)                                                   | Libreria di logging JavaScript e Node.js amichevole per sviluppatori, con attenzione a sicurezza e privacy.                                                                                                                                                                                                                                                      |
| [Lad](https://github.com/ladjs/lad)                                                         | Framework Node.js che alimenta tutta la nostra architettura e design ingegneristico con MVC e altro.                                                                                                                                                                                                                                                             |
| [MongoDB](https://www.mongodb.com/)                                                         | Soluzione database NoSQL che usiamo per memorizzare tutti gli altri dati al di fuori delle caselle di posta (es. il tuo account, impostazioni, domini e configurazioni alias).                                                                                                                                                                                    |
| [Mongoose](https://github.com/Automattic/mongoose)                                          | Object document modeling ("ODM") per MongoDB che usiamo in tutto il nostro stack. Abbiamo scritto helper speciali che ci permettono di continuare a usare **Mongoose con SQLite** :tada:                                                                                                                                                                        |
| [Node.js](https://nodejs.org/en)                                                            | Node.js è l'ambiente di runtime JavaScript open-source e multipiattaforma che esegue tutti i nostri processi server.                                                                                                                                                                                                                                             |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                      | Pacchetto Node.js per inviare email, creare connessioni e altro. Siamo sponsor ufficiali di questo progetto.                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                  | Database in-memory per caching, canali publish/subscribe e richieste DNS over HTTPS.                                                                                                                                                                                                                                                                              |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                  | Estensione di crittografia per SQLite che permette di criptare interi file di database (inclusi write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                                               |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                 | Editor visuale SQLite (che potresti anche usare) per testare, scaricare e visualizzare caselle di posta di sviluppo.                                                                                                                                                                                                                                            |
| [SQLite](https://www.sqlite.org/about.html)                                                 | Livello di database embedded per uno storage IMAP scalabile, autonomo, veloce e resiliente.                                                                                                                                                                                                                                                                        |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                  | Strumento Node.js anti-spam, filtro email e prevenzione phishing (nostra alternativa a [Spam Assassin](https://spamassassin.apache.org/) e [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                            |
| [Tangerine](https://tangeri.ne)                                                             | Richieste DNS over HTTPS con Node.js e caching usando Redis – che garantisce coerenza globale e molto altro.                                                                                                                                                                                                                                                     |
| [Thunderbird](https://www.thunderbird.net/)                                                 | Il nostro team di sviluppo usa questo (e lo raccomanda) come **client email preferito da usare con Forward Email**.                                                                                                                                                                                                                                              |
| [UTM](https://github.com/utmapp/UTM)                                                        | Il nostro team di sviluppo usa questo per creare macchine virtuali per iOS e macOS al fine di testare diversi client email (in parallelo) con i nostri server IMAP e SMTP.                                                                                                                                                                                      |
| [Ubuntu](https://ubuntu.com/download/server)                                                | Sistema operativo server moderno open-source basato su Linux che alimenta tutta la nostra infrastruttura.                                                                                                                                                                                                                                                        |
| [WildDuck](https://github.com/nodemailer/wildduck)                                          | Libreria server IMAP – vedi le sue note su [de-duplicazione allegati](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) e [supporto protocollo IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                              |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Libreria API veloce e semplice per Node.js per interagire programmaticamente con SQLite3.                                                                                                                                                                                                                                                                         |
| [email-templates](https://github.com/forwardemail/email-templates)                          | Framework email amichevole per sviluppatori per creare, visualizzare in anteprima e inviare email personalizzate (es. notifiche account e altro).                                                                                                                                                                                                               |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                      | Costruttore di query SQL usando sintassi in stile Mongo. Questo fa risparmiare tempo al nostro team di sviluppo poiché possiamo continuare a scrivere in stile Mongo in tutto lo stack con un approccio agnostico al database. **Aiuta anche a evitare attacchi di SQL injection usando parametri di query.**                                                  |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                      | Utility SQL per estrarre informazioni sullo schema di database esistente. Questo ci permette di validare facilmente che tutti gli indici, tabelle, colonne, vincoli e altro siano validi e corrispondano `1:1` a come dovrebbero essere. Abbiamo anche scritto helper automatici per aggiungere nuove colonne e indici se vengono fatte modifiche agli schemi di database (con avvisi di errore estremamente dettagliati). |
| [knex](https://github.com/knex/knex)                                                      | Costruttore di query SQL che usiamo solo per migrazioni di database e validazione schema tramite `knex-schema-inspector`.                                                                                                                                                                                                                                         |
| [mandarin](https://github.com/ladjs/mandarin)                                             | Traduzione automatica di frasi [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) con supporto per Markdown usando [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                 |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                       | Pacchetto Node.js per risolvere e stabilire connessioni con server MX e gestire errori.                                                                                                                                                                                                                                                                           |
| [pm2](https://github.com/Unitech/pm2)                                                     | Gestore di processi di produzione Node.js con bilanciatore di carico integrato ([ottimizzato](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) per le prestazioni).                                                                                                                                                                            |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                  | Libreria server SMTP – la usiamo per i nostri server di scambio mail ("MX") e SMTP in uscita.                                                                                                                                                                                                                                                                     |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                             | Strumento utile per testare server IMAP rispetto a benchmark e compatibilità con la specifica RFC del protocollo IMAP. Questo progetto è stato creato dal team di [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (un server IMAP e POP3 open-source attivo da luglio 2002). Abbiamo testato ampiamente il nostro server IMAP con questo strumento.                                   |
> Puoi trovare altri progetti che utilizziamo in [il nostro codice sorgente su GitHub](https://github.com/forwardemail).

### Provider {#providers}

| Provider                                        | Scopo                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Provider DNS, controlli di integrità, bilanciatori di carico e storage di backup usando [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting del codice sorgente, CI/CD e gestione del progetto.                                                                   |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting di server dedicati e database gestiti.                                                                                |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hosting di server dedicati.                                                                                                   |
| [DataPacket](https://www.datapacket.com)        | Hosting di server dedicati.                                                                                                   |


## Considerazioni {#thoughts}

### Principi {#principles}

Forward Email è progettato secondo questi principi:

1. Essere sempre orientato agli sviluppatori, con attenzione alla sicurezza, alla privacy e alla trasparenza.
2. Attenersi a [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Rasoio di Occam](https://en.wikipedia.org/wiki/Occam%27s_razor) e [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Rivolgersi agli sviluppatori intraprendenti, autofinanziati e [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html)

### Esperimenti {#experiments}

> **tldr;** In definitiva, l’uso di storage oggetti compatibile con S3 e/o Tabelle Virtuali non è tecnicamente fattibile per motivi di prestazioni ed è soggetto a errori a causa di limitazioni di memoria.

Abbiamo condotto alcuni esperimenti che ci hanno portato alla nostra soluzione finale con SQLite come discusso sopra.

Uno di questi è stato provare a usare [rclone]() e SQLite insieme a un livello di storage compatibile con S3.

Questo esperimento ci ha portato a comprendere meglio e scoprire casi limite riguardanti l’uso di rclone, SQLite e [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Se abiliti il flag `--vfs-cache-mode writes` con rclone, allora le letture andranno bene, tuttavia le scritture verranno memorizzate nella cache.
  * Se hai più server IMAP distribuiti globalmente, allora la cache sarà disallineata tra loro a meno che tu non abbia un singolo scrittore e più ascoltatori (ad esempio un approccio pub/sub).
  * Questo è incredibilmente complesso e aggiungere qualsiasi complessità ulteriore come questa comporterà più punti singoli di guasto.
  * I provider di storage compatibili con S3 non supportano modifiche parziali ai file – il che significa che ogni modifica al file `.sqlite` comporterà una modifica completa e un nuovo caricamento del database.
  * Esistono altre soluzioni come `rsync`, ma non sono focalizzate sul supporto del write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – quindi abbiamo finito per esaminare Litestream. Fortunatamente il nostro uso della crittografia già cifra i file [WAL](https://www.sqlite.org/wal.html) per noi, quindi non dobbiamo fare affidamento su Litestream per questo. Tuttavia non eravamo ancora sicuri di Litestream per l’uso in produzione e abbiamo alcune note a riguardo più avanti.
  * Usare questa opzione `--vfs-cache-mode writes` (l’unico modo per usare SQLite su `rclone` per scritture) tenterà di copiare l’intero database da zero in memoria – gestire una casella da 10 GB va bene, ma gestire più caselle con uno storage estremamente elevato farà sì che i server IMAP incontrino limitazioni di memoria e errori `ENOMEM`, fault di segmentazione e corruzione dei dati.
* Se provi a usare le [Tabelle Virtuali](https://www.sqlite.org/vtab.html) di SQLite (ad esempio usando [s3db](https://github.com/jrhy/s3db)) per avere dati direttamente su uno storage compatibile con S3, incontrerai diversi altri problemi:
  * Le letture e scritture saranno estremamente lente poiché gli endpoint API S3 dovranno essere colpiti con metodi HTTP `GET`, `PUT`, `HEAD` e `POST`.
  * I test di sviluppo hanno mostrato che superare 500K-1M+ record su internet in fibra è ancora limitato dalla velocità di scrittura e lettura verso provider compatibili con S3. Ad esempio, i nostri sviluppatori hanno eseguito cicli `for` per fare sia istruzioni SQL `INSERT` sequenziali sia scritture massive di grandi quantità di dati. In entrambi i casi le prestazioni erano incredibilmente lente.
  * Le tabelle virtuali **non possono avere indici**, istruzioni `ALTER TABLE` e [altre](https://stackoverflow.com/a/12507650) [limitazioni](https://sqlite.org/lang_createvtab.html) – il che porta a ritardi di 1-2 minuti o più a seconda della quantità di dati.
  * Gli oggetti venivano memorizzati non criptati e non è disponibile un supporto nativo per la crittografia.
* Abbiamo anche esplorato l’uso di [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) che è simile concettualmente e tecnicamente al punto precedente (quindi ha gli stessi problemi). Una possibilità sarebbe usare una build personalizzata di `sqlite3` avvolta con crittografia come [wxSQLite3](https://github.com/utelle/wxsqlite3) (che usiamo attualmente nella nostra soluzione sopra) tramite [modifica del file di setup](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Un altro approccio potenziale era usare l’estensione [multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), tuttavia questa ha una limitazione di 32 GB e richiederebbe costruzioni complesse e problemi di sviluppo.
* Le istruzioni `ALTER TABLE` sono necessarie (quindi questo esclude completamente l’uso delle Tabelle Virtuali). Abbiamo bisogno delle istruzioni `ALTER TABLE` affinché il nostro hook con `knex-schema-inspector` funzioni correttamente – il che garantisce che i dati non vengano corrotti e che le righe recuperate possano essere convertite in documenti validi secondo le nostre definizioni di schema `mongoose` (che includono vincoli, tipi di variabili e validazione arbitraria dei dati).
* Quasi tutti i progetti open-source relativi a SQLite compatibili con S3 sono in Python (e non in JavaScript che usiamo per il 100% del nostro stack).
* Le librerie di compressione come [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (vedi [commenti](https://news.ycombinator.com/item?id=32303762)) sembrano promettenti, ma [potrebbero non essere ancora pronte per l’uso in produzione](https://github.com/phiresky/sqlite-zstd#usage). Invece la compressione lato applicazione su tipi di dati come `String`, `Object`, `Map`, `Array`, `Set` e `Buffer` sarà un approccio più pulito e semplice (e più facile da migrare, dato che potremmo memorizzare un flag o colonna `Boolean` – o anche usare `PRAGMA` `user_version=1` per la compressione o `user_version=0` per nessuna compressione come metadati del database).
  * Fortunatamente abbiamo già implementato la de-duplicazione degli allegati nel nostro storage del server IMAP – quindi ogni messaggio con lo stesso allegato non mantiene una copia dell’allegato – invece un singolo allegato è memorizzato per più messaggi e thread in una casella (e viene successivamente usato un riferimento esterno).
* Il progetto Litestream, che è una soluzione di replica e backup per SQLite, è molto promettente e probabilmente lo useremo in futuro.
  * Non per sminuire l’autore/autori – perché amiamo il loro lavoro e contributi all’open-source da oltre un decennio – tuttavia dall’uso reale sembra che [ci possano essere molti problemi](https://github.com/benbjohnson/litestream/issues) e [potenziali perdite di dati dall’uso](https://github.com/benbjohnson/litestream/issues/218).
* Il ripristino del backup deve essere senza attriti e banale. Usare una soluzione come MongoDB con `mongodump` e `mongoexport` non è solo tedioso, ma richiede molto tempo e ha complessità di configurazione.
  * I database SQLite lo rendono semplice (è un singolo file).
  * Volevamo progettare una soluzione in cui gli utenti potessero prendere la loro casella e andarsene in qualsiasi momento.
    * Comandi Node.js semplici come `fs.unlink('mailbox.sqlite')` e viene cancellato definitivamente dallo storage su disco.
    * Possiamo similmente usare un’API compatibile con S3 con HTTP `DELETE` per rimuovere facilmente snapshot e backup per gli utenti.
  * SQLite è stata la soluzione più semplice, veloce e conveniente.
### Mancanza di alternative {#lack-of-alternatives}

A nostra conoscenza, nessun altro servizio email è progettato in questo modo né è open-source.

*Pensiamo che ciò possa essere dovuto* al fatto che i servizi email esistenti utilizzano tecnologie legacy in produzione con [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

La maggior parte, se non tutti, i fornitori di servizi email esistenti sono o closed-source o si pubblicizzano come open-source, **ma in realtà solo il loro front-end è open-source.**

**La parte più sensibile dell'email** (la vera e propria memorizzazione/interazione IMAP/SMTP) **avviene tutta sul back-end (server), e *non* sul front-end (client).**

### Prova Forward Email {#try-out-forward-email}

Iscriviti oggi su <https://forwardemail.net>! :rocket:
