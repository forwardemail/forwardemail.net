# Come Forward Email protegge la tua privacy, il tuo dominio e la tua sicurezza: analisi tecnica approfondita {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [La filosofia sulla privacy delle email di Forward](#the-forward-email-privacy-philosophy)
* [Implementazione di SQLite: durabilità e portabilità per i tuoi dati](#sqlite-implementation-durability-and-portability-for-your-data)
* [Meccanismo di coda e ripetizione intelligente: garantire la consegna delle e-mail](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Risorse illimitate con limitazione intelligente della velocità](#unlimited-resources-with-intelligent-rate-limiting)
* [Crittografia sandbox per una maggiore sicurezza](#sandboxed-encryption-for-enhanced-security)
* [Elaborazione e-mail in memoria: nessun spazio di archiviazione su disco per la massima privacy](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Crittografia end-to-end con OpenPGP per la privacy completa](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Protezione dei contenuti multistrato per una sicurezza completa](#multi-layered-content-protection-for-comprehensive-security)
* [In che modo ci differenziamo dagli altri servizi di posta elettronica: il vantaggio tecnico della privacy](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Trasparenza Open Source per una Privacy Verificabile](#open-source-transparency-for-verifiable-privacy)
  * [Nessun vincolo con il fornitore per una privacy senza compromessi](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Dati sandbox per un vero isolamento](#sandboxed-data-for-true-isolation)
  * [Portabilità e controllo dei dati](#data-portability-and-control)
* [Le sfide tecniche dell'inoltro delle e-mail incentrato sulla privacy](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gestione della memoria per l'elaborazione delle e-mail senza registrazione](#memory-management-for-no-logging-email-processing)
  * [Rilevamento dello spam senza analisi del contenuto per un filtraggio che preserva la privacy](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Mantenere la compatibilità con il design che privilegia la privacy](#maintaining-compatibility-with-privacy-first-design)
* [Buone pratiche sulla privacy per gli utenti di posta elettronica inoltrata](#privacy-best-practices-for-forward-email-users)
* [Conclusione: il futuro dell'inoltro di posta elettronica privato](#conclusion-the-future-of-private-email-forwarding)

## Prefazione {#foreword}

Nel panorama digitale odierno, la privacy delle email è diventata più critica che mai. A causa delle violazioni dei dati, dei problemi di sorveglianza e della pubblicità mirata basata sui contenuti delle email, gli utenti sono sempre più alla ricerca di soluzioni che diano priorità alla loro privacy. Noi di Forward Email abbiamo sviluppato il nostro servizio da zero, ponendo la privacy al centro della nostra architettura. Questo articolo del blog esplora le implementazioni tecniche che rendono il nostro servizio una delle soluzioni di inoltro email più incentrate sulla privacy disponibili.

## La filosofia sulla privacy delle email di Forward {#the-forward-email-privacy-philosophy}

Prima di addentrarci nei dettagli tecnici, è importante comprendere la nostra filosofia fondamentale sulla privacy: **le tue email appartengono a te e solo a te**. Questo principio guida ogni decisione tecnica che prendiamo, dalla gestione dell'inoltro delle email all'implementazione della crittografia.

A differenza di molti provider di posta elettronica che analizzano i tuoi messaggi per scopi pubblicitari o li archiviano indefinitamente sui loro server, Forward Email opera con un approccio radicalmente diverso:

1. **Solo elaborazione in memoria** - Non memorizziamo le email inoltrate su disco
2. **Nessuna archiviazione di metadati** - Non conserviamo traccia di chi invia email a chi
3. **100% open source** - L'intero codice sorgente è trasparente e verificabile
4. **Crittografia end-to-end** - Supportiamo OpenPGP per comunicazioni veramente private

## Implementazione di SQLite: durabilità e portabilità per i tuoi dati {#sqlite-implementation-durability-and-portability-for-your-data}

Uno dei vantaggi più significativi di Forward Email in termini di privacy è la nostra implementazione [SQLite](https://en.wikipedia.org/wiki/SQLite), attentamente progettata. Abbiamo perfezionato SQLite con impostazioni PRAGMA specifiche e [Registrazione anticipata della scrittura (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) per garantire sia la durabilità che la portabilità dei dati, mantenendo al contempo i più elevati standard di privacy e sicurezza.

Ecco come abbiamo implementato SQLite con [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) come cifrario per la crittografia resistente ai quanti:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Questa implementazione garantisce che i tuoi dati non siano solo sicuri, ma anche portabili. Puoi prendere le tue email e andare in qualsiasi momento esportandole nei formati [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) o SQLite. E quando vuoi eliminare i tuoi dati, sono davvero persi: cancelliamo semplicemente i file dall'archiviazione su disco anziché eseguire comandi SQL DELETE ROW, che potrebbero lasciare tracce nel database.

L'aspetto di crittografia quantistica della nostra implementazione utilizza ChaCha20-Poly1305 come cifrario quando inizializziamo il database, garantendo una forte protezione contro le minacce attuali e future alla privacy dei dati.

## Meccanismo di coda e ripetizione intelligente: garanzia della consegna delle e-mail {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Invece di concentrarci esclusivamente sulla gestione delle intestazioni, abbiamo implementato un sofisticato meccanismo intelligente di coda e ripetizione con il nostro metodo `getBounceInfo`. Questo sistema garantisce che le tue email abbiano le migliori probabilità di essere recapitate, anche in caso di problemi temporanei.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
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
> Questo è un estratto del metodo `getBounceInfo` e non l'effettiva implementazione estesa. Per il codice completo, potete consultarlo su [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Ritentiamo la consegna della posta per 5 giorni, in linea con gli standard di settore come [Suffisso](https://en.wikipedia.org/wiki/Postfix_\(software\), dando il tempo ai problemi temporanei di risolversi da soli. Questo approccio migliora significativamente i tassi di consegna, garantendo al contempo la privacy.

Analogamente, eliminiamo anche il contenuto dei messaggi SMTP in uscita dopo la consegna. Questa impostazione è configurata nel nostro sistema di archiviazione con un periodo di conservazione predefinito di 30 giorni, che puoi modificare nelle Impostazioni Avanzate del tuo dominio. Trascorso questo periodo, il contenuto dell'email viene automaticamente eliminato e cancellato, lasciando solo un messaggio segnaposto:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Questo approccio garantisce che le email inviate non rimangano archiviate indefinitamente, riducendo il rischio di violazioni dei dati o di accesso non autorizzato alle comunicazioni.

## Risorse illimitate con limitazione intelligente della velocità {#unlimited-resources-with-intelligent-rate-limiting}

Sebbene Forward Email offra domini e alias illimitati, abbiamo implementato un sistema intelligente di limitazione della velocità per proteggere il nostro sistema da abusi e garantire un utilizzo equo per tutti gli utenti. Ad esempio, i clienti non aziendali possono creare fino a 50 alias al giorno, impedendo così al nostro database di essere intasato da spam e sovraccarichi e consentendo alle nostre funzionalità di protezione e gestione degli abusi in tempo reale di funzionare efficacemente.

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

Questo approccio equilibrato ti offre la flessibilità di creare tutti gli indirizzi email di cui hai bisogno per una gestione completa della privacy, mantenendo comunque l'integrità e le prestazioni del nostro servizio per tutti gli utenti.

## Crittografia sandbox per una maggiore sicurezza {#sandboxed-encryption-for-enhanced-security}

Il nostro esclusivo approccio di crittografia sandbox offre un vantaggio fondamentale in termini di sicurezza che molti utenti trascurano quando scelgono un servizio di posta elettronica. Scopriamo perché il sandboxing dei dati, in particolare delle email, è così importante.

Servizi come Gmail e Proton utilizzano molto probabilmente la crittografia [database relazionali](https://en.wikipedia.org/wiki/Relational_database) condivisa, che crea una vulnerabilità di sicurezza fondamentale. In un ambiente di database condiviso, se qualcuno accede ai dati di un utente, potrebbe potenzialmente accedere anche ai dati di altri utenti. Questo perché tutti i dati utente risiedono nelle stesse tabelle del database, separati solo da ID utente o identificatori simili.

Forward Email adotta un approccio fondamentalmente diverso con la nostra crittografia sandbox:

1. **Isolamento completo**: i dati di ogni utente sono archiviati in un file di database SQLite crittografato, completamente isolati dagli altri utenti.
2. **Chiavi di crittografia indipendenti**: ogni database è crittografato con una chiave univoca derivata dalla password dell'utente.
3. **Nessuna condivisione di spazio di archiviazione**: a differenza dei database relazionali, in cui le email di tutti gli utenti potrebbero essere contenute in un'unica tabella "email", il nostro approccio garantisce l'assenza di commistione di dati.
4. **Difesa in profondità**: anche se il database di un utente fosse in qualche modo compromesso, non fornirebbe accesso ai dati di nessun altro utente.

Questo approccio sandbox è simile a quello di conservare le email in un archivio fisico separato anziché in un archivio condiviso con divisori interni. Si tratta di una differenza architettonica fondamentale che migliora significativamente la privacy e la sicurezza.

## Elaborazione e-mail in memoria: nessun spazio di archiviazione su disco per la massima privacy {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Per il nostro servizio di inoltro email, elaboriamo le email interamente nella RAM e non le scriviamo mai su disco o database. Questo approccio offre una protezione senza pari contro la sorveglianza delle email e la raccolta di metadati.

Ecco una panoramica semplificata di come funziona l'elaborazione delle nostre e-mail:

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

Questo approccio significa che, anche se i nostri server venissero compromessi, non ci sarebbero dati storici sulle email a cui gli aggressori potrebbero accedere. Le vostre email passano semplicemente attraverso il nostro sistema e vengono immediatamente inoltrate a destinazione senza lasciare traccia. Questo approccio di inoltro email senza registrazione è fondamentale per proteggere le vostre comunicazioni dalla sorveglianza.

## Crittografia end-to-end con OpenPGP per la privacy completa {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Per gli utenti che richiedono il massimo livello di protezione della privacy dalla sorveglianza delle email, supportiamo [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) per la crittografia end-to-end. A differenza di molti provider di posta elettronica che richiedono bridge o app proprietari, la nostra implementazione funziona con client di posta elettronica standard, rendendo la comunicazione sicura accessibile a tutti.

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

Questa implementazione garantisce che le tue email siano crittografate prima di lasciare il tuo dispositivo e possano essere decrittografate solo dal destinatario previsto, mantenendo la riservatezza delle tue comunicazioni anche da noi. Questo è essenziale per proteggere le comunicazioni sensibili da accessi e sorveglianza non autorizzati.

## Protezione dei contenuti multistrato per una sicurezza completa {#multi-layered-content-protection-for-comprehensive-security}

Forward Email offre più livelli di protezione dei contenuti, abilitati per impostazione predefinita, per garantire una sicurezza completa contro diverse minacce:

1. **Protezione contenuti per adulti** - Filtra i contenuti inappropriati senza compromettere la privacy
2. **Protezione [Phishing](https://en.wikipedia.org/wiki/Phishing)** - Blocca i tentativi di furto delle tue informazioni preservando l'anonimato
3. **Protezione eseguibili** - Previene allegati potenzialmente dannosi senza scansionarne il contenuto
4. **Protezione [Virus](https://en.wikipedia.org/wiki/Computer_virus)** - Esegue la scansione alla ricerca di malware utilizzando tecniche di tutela della privacy

A differenza di molti provider che rendono queste funzionalità opzionali, noi le abbiamo rese disattivabili, garantendo che tutti gli utenti possano beneficiare di queste protezioni per impostazione predefinita. Questo approccio riflette il nostro impegno sia per la privacy che per la sicurezza, offrendo un equilibrio che molti servizi di posta elettronica non riescono a raggiungere.

## In che modo ci differenziamo dagli altri servizi di posta elettronica: il vantaggio tecnico della privacy {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Confrontando Forward Email con altri servizi di posta elettronica, emergono diverse differenze tecniche fondamentali che mettono in risalto il nostro approccio incentrato sulla privacy:

### Trasparenza Open Source per una Privacy Verificabile {#open-source-transparency-for-verifiable-privacy}

Sebbene molti provider di posta elettronica affermino di essere open source, spesso mantengono il loro codice backend chiuso. Forward Email è al 100% [sorgente aperta](https://en.wikipedia.org/wiki/Open_source), incluso il codice frontend e backend. Questa trasparenza consente un controllo di sicurezza indipendente di tutti i componenti, garantendo che le nostre dichiarazioni sulla privacy possano essere verificate da chiunque.

### Nessun blocco del fornitore per una privacy senza compromessi {#no-vendor-lock-in-for-privacy-without-compromise}

Molti provider di posta elettronica attenti alla privacy richiedono l'utilizzo di app o bridge proprietari. Forward Email funziona con qualsiasi client di posta elettronica standard tramite i protocolli [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) e [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), offrendoti la libertà di scegliere il tuo software di posta elettronica preferito senza compromettere la privacy.

### Dati sandbox per un vero isolamento {#sandboxed-data-for-true-isolation}

A differenza dei servizi che utilizzano database condivisi in cui i dati di tutti gli utenti vengono condivisi, il nostro approccio sandbox garantisce che i dati di ciascun utente siano completamente isolati. Questa fondamentale differenza architettonica offre garanzie di privacy significativamente più elevate rispetto a quelle offerte dalla maggior parte dei servizi di posta elettronica.

### Portabilità e controllo dei dati {#data-portability-and-control}

Crediamo che i tuoi dati ti appartengano, ecco perché semplifichiamo l'esportazione delle tue email in formati standard (MBOX, EML, SQLite) e la cancellazione definitiva dei tuoi dati quando lo desideri. Questo livello di controllo è raro tra i provider di posta elettronica, ma essenziale per una vera privacy.

## Le sfide tecniche dell'inoltro delle e-mail incentrato sulla privacy {#the-technical-challenges-of-privacy-first-email-forwarding}

La creazione di un servizio di posta elettronica che metta al primo posto la privacy comporta notevoli sfide tecniche. Ecco alcuni degli ostacoli che abbiamo superato:

### Gestione della memoria per l'elaborazione delle e-mail senza registrazione {#memory-management-for-no-logging-email-processing}

L'elaborazione delle email in memoria senza spazio su disco richiede un'attenta gestione della memoria per gestire in modo efficiente elevati volumi di traffico email. Abbiamo implementato tecniche avanzate di ottimizzazione della memoria per garantire prestazioni affidabili senza compromettere la nostra politica di non archiviazione, una componente fondamentale della nostra strategia di protezione della privacy.

### Rilevamento dello spam senza analisi del contenuto per il filtraggio a tutela della privacy {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

La maggior parte dei sistemi di rilevamento [spam](https://en.wikipedia.org/wiki/Email_spam) si basa sull'analisi del contenuto delle email, il che è in conflitto con i nostri principi sulla privacy. Abbiamo sviluppato tecniche per identificare i modelli di spam senza leggere il contenuto delle email, trovando un equilibrio tra privacy e usabilità che salvaguardi la riservatezza delle tue comunicazioni.

### Mantenimento della compatibilità con il design incentrato sulla privacy {#maintaining-compatibility-with-privacy-first-design}

Garantire la compatibilità con tutti i client di posta elettronica e implementare funzionalità avanzate per la privacy ha richiesto soluzioni ingegneristiche creative. Il nostro team ha lavorato instancabilmente per rendere la privacy un'esperienza fluida, così non dovrete scegliere tra praticità e sicurezza quando proteggete le vostre comunicazioni email.

## Procedure consigliate per la privacy degli utenti che inoltrano e-mail {#privacy-best-practices-for-forward-email-users}

Per massimizzare la protezione contro la sorveglianza delle e-mail e massimizzare la privacy quando utilizzi Inoltra e-mail, ti consigliamo le seguenti best practice:

1. **Utilizza alias univoci per servizi diversi** - Crea un alias email diverso per ogni servizio a cui ti iscrivi per impedire il tracciamento tra servizi
2. **Abilita la crittografia OpenPGP** - Per le comunicazioni sensibili, utilizza la crittografia end-to-end per garantire la completa privacy
3. **Ruota regolarmente i tuoi alias email** - Aggiorna periodicamente gli alias per i servizi importanti per ridurre al minimo la raccolta di dati a lungo termine
4. **Utilizza password complesse e univoche** - Proteggi il tuo account Forward Email con una password complessa per impedire accessi non autorizzati
5. **Implementa l'anonimizzazione [indirizzo IP](https://en.wikipedia.org/wiki/IP_address)** - Valuta l'utilizzo di un [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) insieme a Forward Email per un anonimato completo

## Conclusione: il futuro dell'inoltro di posta elettronica privata {#conclusion-the-future-of-private-email-forwarding}

Noi di Forward Email crediamo che la privacy non sia solo una funzionalità, ma un diritto fondamentale. Le nostre implementazioni tecniche riflettono questa convinzione, offrendoti un inoltro email che rispetta la tua privacy a ogni livello e ti protegge dalla sorveglianza delle email e dalla raccolta di metadati.

Mentre continuiamo a sviluppare e migliorare il nostro servizio, il nostro impegno per la privacy rimane incrollabile. Siamo costantemente alla ricerca di nuovi metodi di crittografia, esploriamo ulteriori protezioni della privacy e perfezioniamo il nostro codice sorgente per offrire l'esperienza di posta elettronica più sicura possibile.

Scegliendo "Inoltra email", non stai semplicemente scegliendo un servizio di posta elettronica: stai sostenendo una visione di Internet in cui la privacy è la norma, non l'eccezione. Unisciti a noi per costruire un futuro digitale più privato, un'email alla volta.

<!-- *Parole chiave: inoltro e-mail privato, protezione della privacy e-mail, servizio e-mail sicuro, e-mail open source, crittografia quantum-safe, e-mail OpenPGP, elaborazione e-mail in memoria, servizio e-mail senza log, protezione dei metadati e-mail, privacy dell'intestazione e-mail, e-mail crittografata end-to-end, e-mail che mette la privacy al primo posto, inoltro e-mail anonimo, best practice per la sicurezza e-mail, protezione del contenuto e-mail, protezione dal phishing, scansione antivirus e-mail, provider di e-mail incentrato sulla privacy, intestazioni e-mail sicure, implementazione della privacy e-mail, protezione dalla sorveglianza e-mail, inoltro e-mail senza log, prevenzione della perdita di metadati e-mail, tecniche per la privacy e-mail, anonimizzazione dell'indirizzo IP per e-mail, alias e-mail privati, sicurezza dell'inoltro e-mail, privacy e-mail dagli inserzionisti, crittografia e-mail resistente ai quanti, privacy e-mail senza compromessi, archiviazione e-mail SQLite, crittografia e-mail in sandbox, portabilità dei dati per e-mail* -->