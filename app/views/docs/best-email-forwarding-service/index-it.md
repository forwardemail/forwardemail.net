# Come Forward Email Protegge la Tua Privacy, il Tuo Dominio e la Tua Sicurezza: L'Approfondimento Tecnico {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Confronto tra i migliori servizi di inoltro email" class="rounded-lg" />


## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [La Filosofia della Privacy di Forward Email](#the-forward-email-privacy-philosophy)
* [Implementazione SQLite: Durabilità e Portabilità per i Tuoi Dati](#sqlite-implementation-durability-and-portability-for-your-data)
* [Coda Intelligente e Meccanismo di Ritentativo: Garantire la Consegna delle Email](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Risorse Illimitate con Limitazione Intelligente della Velocità](#unlimited-resources-with-intelligent-rate-limiting)
* [Crittografia in Sandbox per una Sicurezza Migliorata](#sandboxed-encryption-for-enhanced-security)
* [Elaborazione Email in Memoria: Nessuna Memorizzazione su Disco per la Massima Privacy](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Crittografia End-to-End con OpenPGP per una Privacy Completa](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Protezione del Contenuto a Più Livelli per una Sicurezza Completa](#multi-layered-content-protection-for-comprehensive-security)
* [Come Ci Differenziamo da Altri Servizi Email: Il Vantaggio Tecnico della Privacy](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Trasparenza Open Source per una Privacy Verificabile](#open-source-transparency-for-verifiable-privacy)
  * [Nessun Lock-In del Fornitore per una Privacy Senza Compromessi](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Dati in Sandbox per una Vera Isolamento](#sandboxed-data-for-true-isolation)
  * [Portabilità e Controllo dei Dati](#data-portability-and-control)
* [Le Sfide Tecniche dell'Inoltro Email Privacy-First](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gestione della Memoria per l'Elaborazione Email Senza Logging](#memory-management-for-no-logging-email-processing)
  * [Rilevamento dello Spam Senza Analisi del Contenuto per un Filtro che Rispetta la Privacy](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Mantenere la Compatibilità con un Design Privacy-First](#maintaining-compatibility-with-privacy-first-design)
* [Best Practice per la Privacy per gli Utenti di Forward Email](#privacy-best-practices-for-forward-email-users)
* [Conclusione: Il Futuro dell'Inoltro Email Privato](#conclusion-the-future-of-private-email-forwarding)


## Prefazione {#foreword}

Nell'attuale panorama digitale, la privacy delle email è diventata più critica che mai. Con violazioni di dati, preoccupazioni di sorveglianza e pubblicità mirata basata sul contenuto delle email, gli utenti cercano sempre più soluzioni che diano priorità alla loro privacy. In Forward Email, abbiamo costruito il nostro servizio da zero con la privacy come pietra angolare della nostra architettura. Questo post del blog esplora le implementazioni tecniche che rendono il nostro servizio una delle soluzioni di inoltro email più focalizzate sulla privacy disponibili.


## La Filosofia della Privacy di Forward Email {#the-forward-email-privacy-philosophy}

Prima di entrare nei dettagli tecnici, è importante comprendere la nostra filosofia fondamentale sulla privacy: **le tue email appartengono a te e solo a te**. Questo principio guida ogni decisione tecnica che prendiamo, da come gestiamo l'inoltro delle email a come implementiamo la crittografia.

A differenza di molti provider email che scansionano i tuoi messaggi per scopi pubblicitari o li memorizzano indefinitamente sui loro server, Forward Email opera con un approccio radicalmente diverso:

1. **Elaborazione solo in memoria** - Non memorizziamo le tue email inoltrate su disco
2. **Nessuna memorizzazione di metadata** - Non teniamo traccia di chi invia email a chi
3. **100% open-source** - L'intero nostro codice è trasparente e verificabile
4. **Crittografia end-to-end** - Supportiamo OpenPGP per comunicazioni veramente private


## Implementazione SQLite: Durabilità e Portabilità per i Tuoi Dati {#sqlite-implementation-durability-and-portability-for-your-data}

Uno dei vantaggi più significativi per la privacy di Forward Email è la nostra implementazione attentamente progettata di [SQLite](https://en.wikipedia.org/wiki/SQLite). Abbiamo ottimizzato SQLite con specifiche impostazioni PRAGMA e [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) per garantire sia la durabilità che la portabilità dei tuoi dati, mantenendo al contempo i più alti standard di privacy e sicurezza.
Ecco come abbiamo implementato SQLite con [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) come cifrario per la crittografia resistente al quantum:

```javascript
// Inizializza il database con better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Configura la crittografia con il cifrario ChaCha20-Poly1305
db.pragma(`key="${decrypt(session.user.password)}"`);

// Abilita Write-Ahead Logging per durabilità e prestazioni
db.pragma('journal_mode=WAL');

// Sovrascrivi i contenuti cancellati con zeri per la privacy
db.pragma('secure_delete=ON');

// Abilita l'auto vacuum per una gestione efficiente dello spazio
db.pragma('auto_vacuum=FULL');

// Imposta il timeout busy per gestire accessi concorrenti
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Ottimizza la sincronizzazione per affidabilità
db.pragma('synchronous=NORMAL');

// Abilita i vincoli di chiave esterna per l'integrità dei dati
db.pragma('foreign_keys=ON');

// Imposta la codifica UTF-8 per il supporto ai caratteri internazionali
db.pragma(`encoding='UTF-8'`);

// Ottimizza le prestazioni del database
db.pragma('optimize=0x10002;');

// Usa il disco per l'archiviazione temporanea invece della memoria
db.pragma('temp_store=1;');
```

Questa implementazione garantisce che i tuoi dati non siano solo sicuri ma anche portabili. Puoi prendere la tua email e andare in qualsiasi momento esportandola in formati [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) o SQLite. E quando vuoi cancellare i tuoi dati, spariscono davvero – eliminiamo semplicemente i file dallo storage su disco invece di eseguire comandi SQL DELETE ROW, che potrebbero lasciare tracce nel database.

L’aspetto della crittografia quantistica della nostra implementazione utilizza ChaCha20-Poly1305 come cifrario quando inizializziamo il database, fornendo una forte protezione contro minacce attuali e future alla privacy dei tuoi dati.


## Smart Queue e Meccanismo di Ritentativo: Garantire la Consegna delle Email {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Invece di concentrarci solo sulla gestione delle intestazioni, abbiamo implementato una sofisticata smart queue e un meccanismo di ritentativo con il nostro metodo `getBounceInfo`. Questo sistema assicura che le tue email abbiano la migliore possibilità di essere consegnate, anche quando sorgono problemi temporanei.

```javascript
function getBounceInfo(err) {
  // Inizializza le informazioni di bounce con valori predefiniti
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analizza la risposta di errore per determinare l'azione appropriata
  const response = err.response || err.message || '';

  // Determina se il problema è temporaneo o permanente
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorizza la ragione del bounce per una gestione adeguata
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> Questo è un estratto del metodo `getBounceInfo` e non l’implementazione completa ed estesa. Per il codice completo, puoi consultarlo su [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Ritentiamo la consegna della posta per 5 giorni, simile agli standard del settore come [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), dando tempo ai problemi temporanei di risolversi. Questo approccio migliora significativamente i tassi di consegna mantenendo la privacy.

In modo simile, oscuriamo anche il contenuto dei messaggi delle email SMTP in uscita dopo la consegna avvenuta con successo. Questo è configurato nel nostro sistema di archiviazione con un periodo di conservazione predefinito di 30 giorni, che puoi modificare nelle Impostazioni Avanzate del tuo dominio. Dopo questo periodo, il contenuto dell’email viene automaticamente oscurato e cancellato, lasciando solo un messaggio segnaposto:

```txt
Questo messaggio è stato inviato con successo. È stato oscurato e cancellato per la tua sicurezza e privacy. Se desideri aumentare il tempo di conservazione dei messaggi, vai alla pagina Impostazioni Avanzate del tuo dominio.
```
Questo approccio garantisce che le email inviate non rimangano archiviate indefinitamente, riducendo il rischio di violazioni dei dati o accessi non autorizzati alle tue comunicazioni.


## Risorse Illimitate con Limitazione Intelligente della Velocità {#unlimited-resources-with-intelligent-rate-limiting}

Mentre Forward Email offre domini e alias illimitati, abbiamo implementato una limitazione intelligente della velocità per proteggere il nostro sistema da abusi e garantire un uso equo per tutti gli utenti. Ad esempio, i clienti non enterprise possono creare fino a 50+ alias al giorno, il che impedisce che il nostro database venga spammato e sovraccaricato, e permette alle nostre funzionalità di protezione e rilevamento abusi in tempo reale di funzionare efficacemente.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

Questo approccio bilanciato ti offre la flessibilità di creare tutti gli indirizzi email di cui hai bisogno per una gestione completa della privacy, mantenendo al contempo l'integrità e le prestazioni del nostro servizio per tutti gli utenti.


## Crittografia Isolata per una Sicurezza Migliorata {#sandboxed-encryption-for-enhanced-security}

Il nostro approccio unico di crittografia isolata fornisce un vantaggio critico in termini di sicurezza che molti utenti trascurano quando scelgono un servizio email. Vediamo perché isolare i dati, specialmente le email, è così importante.

Servizi come Gmail e Proton probabilmente utilizzano [database relazionali](https://en.wikipedia.org/wiki/Relational_database) condivisi, il che crea una vulnerabilità fondamentale in termini di sicurezza. In un ambiente con database condiviso, se qualcuno ottiene accesso ai dati di un utente, potenzialmente può accedere anche ai dati di altri utenti. Questo perché tutti i dati degli utenti risiedono nelle stesse tabelle del database, separati solo da ID utente o identificatori simili.

Forward Email adotta un approccio fondamentalmente diverso con la nostra crittografia isolata:

1. **Isolamento completo**: I dati di ogni utente sono memorizzati in un proprio file di database SQLite crittografato, completamente isolato dagli altri utenti
2. **Chiavi di crittografia indipendenti**: Ogni database è crittografato con una chiave unica derivata dalla password dell'utente
3. **Nessuna condivisione dello storage**: A differenza dei database relazionali dove tutte le email degli utenti potrebbero trovarsi in un'unica tabella "emails", il nostro approccio garantisce nessuna commistione di dati
4. **Difesa in profondità**: Anche se il database di un utente fosse compromesso, non fornirebbe accesso ai dati di altri utenti

Questo approccio isolato è simile ad avere la tua email in una cassaforte fisica separata piuttosto che in un deposito condiviso con divisori interni. È una differenza architetturale fondamentale che migliora significativamente la tua privacy e sicurezza.


## Elaborazione Email in Memoria: Nessuna Memorizzazione su Disco per la Massima Privacy {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Per il nostro servizio di inoltro email, elaboriamo le email interamente in RAM e non le scriviamo mai su disco o database. Questo approccio offre una protezione senza pari contro la sorveglianza delle email e la raccolta di metadati.

Ecco una panoramica semplificata di come funziona la nostra elaborazione delle email:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```
Questo approccio significa che anche se i nostri server fossero compromessi, non ci sarebbero dati storici delle email a cui gli aggressori potrebbero accedere. Le tue email semplicemente passano attraverso il nostro sistema e vengono immediatamente inoltrate alla loro destinazione senza lasciare traccia. Questo approccio di inoltro email senza registrazione è fondamentale per proteggere le tue comunicazioni dalla sorveglianza.


## Crittografia End-to-End con OpenPGP per una Privacy Completa {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Per gli utenti che richiedono il massimo livello di protezione della privacy dalla sorveglianza delle email, supportiamo [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) per la crittografia end-to-end. A differenza di molti provider di email che richiedono bridge o app proprietarie, la nostra implementazione funziona con client email standard, rendendo la comunicazione sicura accessibile a tutti.

Ecco come implementiamo la crittografia OpenPGP:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Questa implementazione garantisce che le tue email siano crittografate prima di lasciare il tuo dispositivo e possano essere decrittate solo dal destinatario previsto, mantenendo private le tue comunicazioni anche da noi. Questo è essenziale per proteggere comunicazioni sensibili da accessi non autorizzati e sorveglianza.


## Protezione del Contenuto a Più Livelli per una Sicurezza Completa {#multi-layered-content-protection-for-comprehensive-security}

Forward Email offre più livelli di protezione del contenuto abilitati di default per fornire una sicurezza completa contro varie minacce:

1. **Protezione da contenuti per adulti** - Filtra contenuti inappropriati senza compromettere la privacy
2. **Protezione dal [phishing](https://en.wikipedia.org/wiki/Phishing)** - Blocca i tentativi di rubare le tue informazioni preservando l'anonimato
3. **Protezione dagli eseguibili** - Previene allegati potenzialmente dannosi senza scansionare il contenuto
4. **Protezione dai [virus](https://en.wikipedia.org/wiki/Computer_virus)** - Scansiona malware usando tecniche che preservano la privacy

A differenza di molti provider che rendono queste funzionalità opzionali, le abbiamo rese disattivabili, garantendo che tutti gli utenti beneficino di queste protezioni di default. Questo approccio riflette il nostro impegno sia per la privacy che per la sicurezza, offrendo un equilibrio che molti servizi email non riescono a raggiungere.


## Come Ci Differenziamo dagli Altri Servizi Email: Il Vantaggio Tecnico della Privacy {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Confrontando Forward Email con altri servizi email, diverse differenze tecniche chiave evidenziano il nostro approccio privacy-first:

### Trasparenza Open Source per una Privacy Verificabile {#open-source-transparency-for-verifiable-privacy}

Mentre molti provider di email dichiarano di essere open source, spesso mantengono chiuso il codice backend. Forward Email è al 100% [open source](https://en.wikipedia.org/wiki/Open_source), includendo sia il codice frontend che backend. Questa trasparenza permette audit di sicurezza indipendenti di tutti i componenti, assicurando che le nostre affermazioni sulla privacy possano essere verificate da chiunque.

### Nessun Lock-In del Fornitore per una Privacy Senza Compromessi {#no-vendor-lock-in-for-privacy-without-compromise}

Molti provider email focalizzati sulla privacy richiedono l’uso delle loro app o bridge proprietari. Forward Email funziona con qualsiasi client email standard tramite i protocolli [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) e [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), dandoti la libertà di scegliere il software email preferito senza compromettere la privacy.
### Dati Isolati per una Vera Separazione {#sandboxed-data-for-true-isolation}

A differenza dei servizi che utilizzano database condivisi dove i dati di tutti gli utenti sono mescolati, il nostro approccio isolato garantisce che i dati di ogni utente siano completamente separati. Questa differenza architetturale fondamentale offre garanzie di privacy significativamente più forti rispetto a quanto offerto dalla maggior parte dei servizi email.

### Portabilità e Controllo dei Dati {#data-portability-and-control}

Crediamo che i tuoi dati ti appartengano, ed è per questo che rendiamo facile esportare le tue email in formati standard (MBOX, EML, SQLite) e cancellare realmente i tuoi dati quando vuoi. Questo livello di controllo è raro tra i provider email ma essenziale per una vera privacy.


## Le Sfide Tecniche del Reindirizzamento Email Privacy-First {#the-technical-challenges-of-privacy-first-email-forwarding}

Costruire un servizio email privacy-first comporta sfide tecniche significative. Ecco alcuni degli ostacoli che abbiamo superato:

### Gestione della Memoria per l’Elaborazione Email Senza Registrazione {#memory-management-for-no-logging-email-processing}

Elaborare le email in memoria senza archiviazione su disco richiede una gestione attenta della memoria per gestire efficientemente alti volumi di traffico email. Abbiamo implementato tecniche avanzate di ottimizzazione della memoria per garantire prestazioni affidabili senza compromettere la nostra politica di non archiviazione, un componente critico della nostra strategia di protezione della privacy.

### Rilevamento dello Spam Senza Analisi del Contenuto per un Filtro che Rispetta la Privacy {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

La maggior parte dei sistemi di [spam](https://en.wikipedia.org/wiki/Email_spam) si basa sull’analisi del contenuto delle email, cosa che confligge con i nostri principi di privacy. Abbiamo sviluppato tecniche per identificare i modelli di spam senza leggere il contenuto delle tue email, trovando un equilibrio tra privacy e usabilità che preserva la riservatezza delle tue comunicazioni.

### Mantenere la Compatibilità con un Design Privacy-First {#maintaining-compatibility-with-privacy-first-design}

Garantire la compatibilità con tutti i client email implementando funzionalità avanzate di privacy ha richiesto soluzioni ingegneristiche creative. Il nostro team ha lavorato instancabilmente per rendere la privacy fluida, così non devi scegliere tra comodità e sicurezza quando proteggi le tue comunicazioni email.


## Best Practice per la Privacy degli Utenti di Forward Email {#privacy-best-practices-for-forward-email-users}

Per massimizzare la tua protezione contro la sorveglianza email e aumentare la tua privacy usando Forward Email, raccomandiamo le seguenti best practice:

1. **Usa alias unici per servizi diversi** - Crea un alias email diverso per ogni servizio a cui ti iscrivi per prevenire il tracciamento tra servizi
2. **Abilita la crittografia OpenPGP** - Per comunicazioni sensibili, usa la crittografia end-to-end per garantire completa privacy
3. **Ruota regolarmente i tuoi alias email** - Aggiorna periodicamente gli alias per i servizi importanti per minimizzare la raccolta dati a lungo termine
4. **Usa password forti e uniche** - Proteggi il tuo account Forward Email con una password robusta per prevenire accessi non autorizzati
5. **Implementa l’anonimizzazione dell’[indirizzo IP](https://en.wikipedia.org/wiki/IP_address)** - Considera l’uso di una [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) insieme a Forward Email per un’anonimato completo


## Conclusione: Il Futuro del Reindirizzamento Email Privato {#conclusion-the-future-of-private-email-forwarding}

In Forward Email, crediamo che la privacy non sia solo una funzionalità—sia un diritto fondamentale. Le nostre implementazioni tecniche riflettono questa convinzione, offrendoti un reindirizzamento email che rispetta la tua privacy a ogni livello e ti protegge dalla sorveglianza email e dalla raccolta di metadata.

Mentre continuiamo a sviluppare e migliorare il nostro servizio, il nostro impegno per la privacy rimane incrollabile. Stiamo costantemente ricercando nuovi metodi di crittografia, esplorando ulteriori protezioni per la privacy e perfezionando il nostro codice per offrire l’esperienza email più sicura possibile.

Scegliendo Forward Email, non stai solo selezionando un servizio email—stai supportando una visione di internet dove la privacy è la norma, non l’eccezione. Unisciti a noi per costruire un futuro digitale più privato, una email alla volta.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

