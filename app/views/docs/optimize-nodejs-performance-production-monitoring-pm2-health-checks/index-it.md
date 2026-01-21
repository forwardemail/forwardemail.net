# Come ottimizzare l'infrastruttura di produzione di Node.js: best practice {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [La nostra rivoluzione nell'ottimizzazione delle prestazioni single core del 573%](#our-573-single-core-performance-optimization-revolution)
  * [Perché l'ottimizzazione delle prestazioni del singolo core è importante per Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Contenuti correlati](#related-content)
* [Configurazione dell'ambiente di produzione Node.js: il nostro stack tecnologico](#nodejs-production-environment-setup-our-technology-stack)
  * [Gestore pacchetti: pnpm per l'efficienza della produzione](#package-manager-pnpm-for-production-efficiency)
  * [Framework Web: Koa per la produzione moderna di Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Elaborazione dei lavori in background: Bree per l'affidabilità della produzione](#background-job-processing-bree-for-production-reliability)
  * [Gestione degli errori: @hapi/boom per l'affidabilità della produzione](#error-handling-hapiboom-for-production-reliability)
* [Come monitorare le applicazioni Node.js in produzione](#how-to-monitor-nodejs-applications-in-production)
  * [Monitoraggio della produzione Node.js a livello di sistema](#system-level-nodejs-production-monitoring)
  * [Monitoraggio a livello di applicazione per la produzione Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitoraggio specifico dell'applicazione](#application-specific-monitoring)
* [Monitoraggio della produzione di Node.js con controlli di integrità PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Il nostro sistema di controllo sanitario PM2](#our-pm2-health-check-system)
  * [La nostra configurazione di produzione PM2](#our-pm2-production-configuration)
  * [Distribuzione automatica PM2](#automated-pm2-deployment)
* [Sistema di gestione e classificazione degli errori di produzione](#production-error-handling-and-classification-system)
  * [La nostra implementazione isCodeBug per la produzione](#our-iscodebug-implementation-for-production)
  * [Integrazione con la nostra registrazione di produzione](#integration-with-our-production-logging)
  * [Contenuti correlati](#related-content-1)
* [Debug delle prestazioni avanzato con v8-profiler-next e cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Il nostro approccio di profilazione per la produzione di Node.js](#our-profiling-approach-for-nodejs-production)
  * [Come implementiamo l'analisi Heap Snapshot](#how-we-implement-heap-snapshot-analysis)
  * [Flusso di lavoro di debug delle prestazioni](#performance-debugging-workflow)
  * [Implementazione consigliata per la tua applicazione Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integrazione con il nostro monitoraggio della produzione](#integration-with-our-production-monitoring)
* [Sicurezza dell'infrastruttura di produzione Node.js](#nodejs-production-infrastructure-security)
  * [Sicurezza a livello di sistema per la produzione di Node.js](#system-level-security-for-nodejs-production)
  * [Sicurezza delle applicazioni per le applicazioni Node.js](#application-security-for-nodejs-applications)
  * [Automazione della sicurezza delle infrastrutture](#infrastructure-security-automation)
  * [I nostri contenuti di sicurezza](#our-security-content)
* [Architettura del database per applicazioni Node.js](#database-architecture-for-nodejs-applications)
  * [Implementazione di SQLite per la produzione Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementazione di MongoDB per la produzione Node.js](#mongodb-implementation-for-nodejs-production)
* [Elaborazione del lavoro in background di produzione di Node.js](#nodejs-production-background-job-processing)
  * [La nostra configurazione del server Bree per la produzione](#our-bree-server-setup-for-production)
  * [Esempi di lavori di produzione](#production-job-examples)
  * [I nostri modelli di pianificazione dei lavori per la produzione Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Manutenzione automatizzata per applicazioni di produzione Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [La nostra implementazione di pulizia](#our-cleanup-implementation)
  * [Gestione dello spazio su disco per la produzione di Node.js](#disk-space-management-for-nodejs-production)
  * [Automazione della manutenzione delle infrastrutture](#infrastructure-maintenance-automation)
* [Guida all'implementazione della distribuzione di produzione di Node.js](#nodejs-production-deployment-implementation-guide)
  * [Studia il nostro codice attuale per le migliori pratiche di produzione](#study-our-actual-code-for-production-best-practices)
  * [Impara dai nostri post del blog](#learn-from-our-blog-posts)
  * [Automazione dell'infrastruttura per la produzione Node.js](#infrastructure-automation-for-nodejs-production)
  * [I nostri casi di studio](#our-case-studies)
* [Conclusione: Best Practice per la distribuzione in produzione di Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Elenco completo delle risorse per la produzione di Node.js](#complete-resource-list-for-nodejs-production)
  * [I nostri file di implementazione principali](#our-core-implementation-files)
  * [Le nostre implementazioni server](#our-server-implementations)
  * [La nostra automazione delle infrastrutture](#our-infrastructure-automation)
  * [I nostri post del blog tecnico](#our-technical-blog-posts)
  * [I nostri casi di studio aziendali](#our-enterprise-case-studies)

## Prefazione {#foreword}

Noi di Forward Email abbiamo dedicato anni a perfezionare la configurazione del nostro ambiente di produzione Node.js. Questa guida completa condivide le nostre best practice di distribuzione in produzione Node.js, collaudate sul campo, concentrandosi sull'ottimizzazione delle prestazioni, sul monitoraggio e sulle lezioni apprese scalando le applicazioni Node.js per gestire milioni di transazioni giornaliere.

## La nostra rivoluzione nell'ottimizzazione delle prestazioni single-core del 573% {#our-573-single-core-performance-optimization-revolution}

Con la migrazione dai processori Intel ad AMD Ryzen, abbiamo ottenuto un **miglioramento delle prestazioni del 573%** nelle nostre applicazioni Node.js. Non si è trattato di una semplice ottimizzazione, ma ha cambiato radicalmente le prestazioni delle nostre applicazioni Node.js in produzione e dimostra l'importanza dell'ottimizzazione delle prestazioni a singolo core per qualsiasi applicazione Node.js.

> \[!TIP]
> Per le migliori pratiche di distribuzione in produzione di Node.js, la scelta dell'hardware è fondamentale. Abbiamo scelto specificamente l'hosting DataPacket per la loro disponibilità su AMD Ryzen perché le prestazioni single-core sono cruciali per le applicazioni Node.js, dato che l'esecuzione di JavaScript è single-thread.

### Perché l'ottimizzazione delle prestazioni del singolo core è importante per Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

La nostra migrazione da Intel ad AMD Ryzen ha prodotto:

* **Miglioramento delle prestazioni del 573%** nell'elaborazione delle richieste (documentato in [Problema GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 della nostra pagina di stato)
* **Eliminazione dei ritardi di elaborazione** per risposte quasi istantanee (menzionato in [Problema GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Miglior rapporto prezzo/prestazioni** per gli ambienti di produzione Node.js
* **Tempi di risposta migliorati** su tutti gli endpoint delle nostre applicazioni

L'aumento delle prestazioni è stato così significativo che ora consideriamo i processori AMD Ryzen essenziali per qualsiasi implementazione di produzione Node.js di alto livello, che si tratti di applicazioni web, API, microservizi o qualsiasi altro carico di lavoro Node.js.

### Contenuto correlato {#related-content}

Per maggiori dettagli sulle nostre scelte infrastrutturali, consulta:

* [Miglior servizio di inoltro email](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Confronti delle prestazioni)
* [Soluzione auto-ospitata](https://forwardemail.net/blog/docs/self-hosted-solution) - Consigli hardware

## Configurazione dell'ambiente di produzione Node.js: il nostro stack tecnologico {#nodejs-production-environment-setup-our-technology-stack}

Le nostre best practice per l'implementazione in produzione di Node.js includono scelte tecnologiche ponderate basate su anni di esperienza in produzione. Ecco cosa utilizziamo e perché queste scelte si applicano a qualsiasi applicazione Node.js:

### Gestore pacchetti: pnpm per l'efficienza produttiva {#package-manager-pnpm-for-production-efficiency}

**Cosa utilizziamo:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versione bloccata)

Abbiamo scelto pnpm invece di npm e yarn per la configurazione del nostro ambiente di produzione Node.js perché:

* **Tempi di installazione più rapidi** nelle pipeline CI/CD
* **Efficienza dello spazio su disco** grazie al collegamento rigido
* **Risoluzione rigorosa delle dipendenze** che previene dipendenze fantasma
* **Prestazioni migliori** nelle distribuzioni di produzione

> \[!NOTE]
> Come parte delle nostre best practice per l'implementazione in produzione di Node.js, fissiamo versioni esatte di strumenti critici come pnpm per garantire un comportamento coerente in tutti gli ambienti e sulle macchine dei membri del team.

**Dettagli di implementazione:**

* [La nostra configurazione package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Il nostro post sul blog dell'ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework Web: Koa per la moderna produzione Node.js {#web-framework-koa-for-modern-nodejs-production}

**Cosa utilizziamo:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Abbiamo scelto Koa invece di Express per la nostra infrastruttura di produzione Node.js per il suo moderno supporto async/await e per la sua struttura middleware più pulita. Il nostro fondatore Nick Baugh ha contribuito sia a Express che a Koa, offrendoci una conoscenza approfondita di entrambi i framework per l'uso in produzione.

Questi modelli sono validi indipendentemente dal fatto che si sviluppino API REST, server GraphQL, applicazioni web o microservizi.

**I nostri esempi di implementazione:**

* [Configurazione del server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configurazione del server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guida all'implementazione dei moduli di contatto](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Elaborazione del lavoro in background: Bree per l'affidabilità della produzione {#background-job-processing-bree-for-production-reliability}

**Cosa utilizziamo:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) scheduler

Abbiamo creato e gestiamo Bree perché gli scheduler di lavoro esistenti non soddisfacevano le nostre esigenze di supporto per i thread di lavoro e di funzionalità JavaScript moderne negli ambienti di produzione Node.js. Questo vale per qualsiasi applicazione Node.js che necessiti di elaborazione in background, attività pianificate o thread di lavoro.

**I nostri esempi di implementazione:**

* [Configurazione del server Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Tutte le nostre definizioni di lavoro](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Controllo sanitario PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementazione del lavoro di pulizia](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Gestione degli errori: @hapi/boom per l'affidabilità della produzione {#error-handling-hapiboom-for-production-reliability}

**Cosa utilizziamo:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Utilizziamo @hapi/boom per risposte di errore strutturate in tutte le nostre applicazioni di produzione Node.js. Questo modello funziona per qualsiasi applicazione Node.js che richieda una gestione coerente degli errori.

**I nostri esempi di implementazione:**

* [Aiuto per la classificazione degli errori](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementazione del logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Come monitorare le applicazioni Node.js in produzione {#how-to-monitor-nodejs-applications-in-production}

Il nostro approccio al monitoraggio delle applicazioni Node.js in produzione si è evoluto nel corso degli anni di utilizzo di applicazioni su larga scala. Implementiamo il monitoraggio a più livelli per garantire affidabilità e prestazioni per qualsiasi tipo di applicazione Node.js.

### Monitoraggio della produzione Node.js a livello di sistema {#system-level-nodejs-production-monitoring}

**La nostra implementazione principale:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Cosa utilizziamo:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Le nostre soglie di monitoraggio della produzione (dal nostro attuale codice di produzione):

* **Limite dimensione heap 2 GB** con avvisi automatici
* Soglia di avviso **Utilizzo memoria 25%**
* Soglia di avviso **Utilizzo CPU 80%**
* Soglia di avviso **Utilizzo disco 75%**

> \[!WARNING]
> Queste soglie sono adatte alla nostra specifica configurazione hardware. Quando implementi il monitoraggio della produzione Node.js, consulta la nostra implementazione monitor-server.js per comprenderne la logica esatta e adattare i valori alla tua configurazione.

### Monitoraggio a livello di applicazione per la produzione di Node.js {#application-level-monitoring-for-nodejs-production}

**La nostra classificazione degli errori:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Questo helper distingue tra:

* **Bug effettivi nel codice** che richiedono attenzione immediata
* **Errori utente** che rientrano nel comportamento previsto
* **Errori di servizi esterni** che non possiamo controllare

Questo schema si applica a qualsiasi applicazione Node.js: app web, API, microservizi o servizi in background.

**La nostra implementazione di registrazione:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementiamo una redazione completa dei campi per proteggere le informazioni sensibili, mantenendo al contempo utili funzionalità di debug nel nostro ambiente di produzione Node.js.

### Monitoraggio specifico dell'applicazione {#application-specific-monitoring}

**Le nostre implementazioni server:**

* [server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Server IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [server POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitoraggio delle code:** Implementiamo limiti di coda di 5 GB e timeout di 180 secondi per l'elaborazione delle richieste per evitare l'esaurimento delle risorse. Questi modelli si applicano a qualsiasi applicazione Node.js con code o elaborazione in background.

## Monitoraggio della produzione di Node.js con controlli di integrità PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Abbiamo perfezionato la configurazione del nostro ambiente di produzione Node.js con PM2 nel corso di anni di esperienza in produzione. I nostri controlli di integrità PM2 sono essenziali per mantenere l'affidabilità di qualsiasi applicazione Node.js.

### Il nostro sistema di controllo sanitario PM2 {#our-pm2-health-check-system}

**La nostra implementazione principale:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Il nostro monitoraggio della produzione Node.js con controlli di integrità PM2 include:

* **Eseguito ogni 20 minuti** tramite cron scheduling
* **Richiede almeno 15 minuti di attività** prima di considerare un processo integro
* **Convalida lo stato del processo e l'utilizzo della memoria**
* **Riavvia automaticamente i processi non riusciti**
* **Previene i loop di riavvio** tramite controllo intelligente dello stato

> \[!CAUTION]
> Per le best practice di distribuzione in produzione di Node.js, richiediamo un tempo di attività di oltre 15 minuti prima di considerare un processo funzionante, per evitare loop di riavvio. Questo impedisce errori a cascata quando i processi hanno problemi di memoria o altri problemi.

### La nostra configurazione di produzione PM2 {#our-pm2-production-configuration}

**Configurazione del nostro ecosistema:** Studia i file di avvio del nostro server per la configurazione dell'ambiente di produzione Node.js:

* [Server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Questi modelli sono validi indipendentemente dal fatto che si eseguano app Express, server Koa, API GraphQL o qualsiasi altra applicazione Node.js.

### Distribuzione PM2 automatizzata {#automated-pm2-deployment}

**Distribuzione PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizziamo l'intera configurazione PM2 tramite Ansible per garantire distribuzioni di produzione Node.js coerenti su tutti i nostri server.

## Sistema di gestione e classificazione degli errori di produzione {#production-error-handling-and-classification-system}

Una delle nostre best practice più preziose per l'implementazione in produzione di Node.js è la classificazione intelligente degli errori, applicabile a qualsiasi applicazione Node.js:

### La nostra implementazione isCodeBug per la produzione {#our-iscodebug-implementation-for-production}

**Fonte:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Questo helper fornisce una classificazione intelligente degli errori per le applicazioni Node.js in produzione per:

* **Dare priorità ai bug reali** rispetto agli errori degli utenti
* **Migliorare la nostra risposta agli incidenti** concentrandoci sui problemi reali
* **Ridurre l'affaticamento da avvisi** dovuto a errori utente previsti
* **Comprendere meglio** i problemi generati dalle applicazioni rispetto a quelli generati dagli utenti

Questo modello funziona per qualsiasi applicazione Node.js, che tu stia creando siti di e-commerce, piattaforme SaaS, API o microservizi.

### Integrazione con la nostra registrazione di produzione {#integration-with-our-production-logging}

**La nostra integrazione con il logger:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Il nostro logger utilizza `isCodeBug` per determinare i livelli di allerta e la redazione dei campi, assicurandoci di ricevere notifiche sui problemi reali e filtrando al contempo il rumore nel nostro ambiente di produzione Node.js.

### Contenuto correlato {#related-content-1}

Scopri di più sui nostri modelli di gestione degli errori:

* [Creazione di un sistema di pagamento affidabile](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Modelli di gestione degli errori
* [Protezione della privacy della posta elettronica](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Gestione degli errori di sicurezza

## Debug delle prestazioni avanzato con v8-profiler-next e cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Utilizziamo strumenti di profilazione avanzati per analizzare gli snapshot dell'heap e risolvere problemi di memoria insufficiente (OOM), colli di bottiglia nelle prestazioni e problemi di memoria di Node.js nel nostro ambiente di produzione. Questi strumenti sono essenziali per qualsiasi applicazione Node.js che riscontri perdite di memoria o problemi di prestazioni.

### Il nostro approccio di profilazione per la produzione di Node.js {#our-profiling-approach-for-nodejs-production}

**Strumenti che consigliamo:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Per generare snapshot dell'heap e profili CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Per analizzare profili CPU e snapshot dell'heap

> \[!TIP]
> Utilizziamo v8-profiler-next e cpupro insieme per creare un flusso di lavoro completo per il debug delle prestazioni delle nostre applicazioni Node.js. Questa combinazione ci aiuta a identificare perdite di memoria, colli di bottiglia nelle prestazioni e a ottimizzare il nostro codice di produzione.

### Come implementiamo l'analisi Heap Snapshot {#how-we-implement-heap-snapshot-analysis}

**La nostra implementazione di monitoraggio:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Il nostro monitoraggio della produzione include la generazione automatica di snapshot dell'heap al superamento delle soglie di memoria. Questo ci aiuta a risolvere i problemi di OOM prima che causino crash dell'applicazione.

**Modelli di implementazione chiave:**

* **Snapshot automatici** quando la dimensione dell'heap supera la soglia di 2 GB
* **Profilazione basata sul segnale** per analisi on-demand in produzione
* **Criteri di conservazione** per la gestione dell'archiviazione degli snapshot
* **Integrazione con i nostri processi di pulizia** per la manutenzione automatizzata

### Flusso di lavoro per il debug delle prestazioni {#performance-debugging-workflow}

**Studia la nostra implementazione effettiva:**

* [Monitorare l'implementazione del server](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoraggio heap e generazione di snapshot
* [Lavoro di pulizia](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Conservazione e pulizia degli snapshot
* [Integrazione del logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Registrazione delle prestazioni

### Implementazione consigliata per la tua applicazione Node.js {#recommended-implementation-for-your-nodejs-application}

**Per l'analisi degli snapshot heap:**

1. **Installare v8-profiler-next** per la generazione di snapshot
2. **Utilizzare cpupro** per analizzare gli snapshot generati
3. **Implementare soglie di monitoraggio** simili al nostro monitor-server.js
4. **Impostare la pulizia automatica** per gestire l'archiviazione degli snapshot
5. **Creare gestori di segnale** per la profilazione on-demand in produzione

**Per la profilazione della CPU:**

1. **Generare profili CPU** durante i periodi di carico elevato
2. **Analizzare con cpupro** per identificare i colli di bottiglia
3. **Concentrarsi sui percorsi critici** e sulle opportunità di ottimizzazione
4. **Monitorare prima/dopo** i miglioramenti delle prestazioni

> \[!WARNING]
> La generazione di snapshot dell'heap e profili CPU può influire sulle prestazioni. Consigliamo di implementare la limitazione e di abilitare la profilazione solo quando si esaminano problemi specifici o durante le finestre di manutenzione.

### Integrazione con il nostro monitoraggio della produzione {#integration-with-our-production-monitoring}

I nostri strumenti di profilazione si integrano con la nostra strategia di monitoraggio più ampia:

* **Attivazione automatica** in base alle soglie di memoria/CPU
* **Integrazione degli avvisi** in caso di rilevamento di problemi di prestazioni
* **Analisi storica** per monitorare l'andamento delle prestazioni nel tempo
* **Correlazione con le metriche dell'applicazione** per un debug completo

Questo approccio ci ha aiutato a identificare e risolvere le perdite di memoria, ottimizzare i percorsi del codice attivo e mantenere prestazioni stabili nel nostro ambiente di produzione Node.js.

## Sicurezza dell'infrastruttura di produzione di Node.js {#nodejs-production-infrastructure-security}

Implementiamo una sicurezza completa per la nostra infrastruttura di produzione Node.js tramite l'automazione Ansible. Queste procedure si applicano a qualsiasi applicazione Node.js:

### Sicurezza a livello di sistema per la produzione di Node.js {#system-level-security-for-nodejs-production}

**La nostra implementazione Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Le nostre principali misure di sicurezza per gli ambienti di produzione Node.js:

* **Swap disabilitato** per impedire la scrittura di dati sensibili sul disco
* **Core dump disabilitati** per impedire dump di memoria contenenti informazioni sensibili
* **Archiviazione USB bloccata** per impedire l'accesso non autorizzato ai dati
* **Ottimizzazione dei parametri del kernel** per sicurezza e prestazioni

> \[!WARNING]
> Quando si implementano le best practice per la distribuzione in produzione di Node.js, disabilitare lo swap può causare interruzioni per mancanza di memoria se l'applicazione supera la RAM disponibile. Monitoriamo attentamente l'utilizzo della memoria e dimensioniamo i nostri server in modo appropriato.

### Sicurezza delle applicazioni per le applicazioni Node.js {#application-security-for-nodejs-applications}

**La nostra redazione del campo di registro:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Ossudiamo i campi sensibili dai log, inclusi password, token, chiavi API e informazioni personali. Questo protegge la privacy degli utenti, mantenendo al contempo le funzionalità di debug in qualsiasi ambiente di produzione Node.js.

### Automazione della sicurezza dell'infrastruttura {#infrastructure-security-automation}

**La nostra configurazione completa di Ansible per la produzione Node.js:**

* [Manuale di sicurezza](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gestione delle chiavi SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestione dei certificati](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configurazione DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Il nostro contenuto di sicurezza {#our-security-content}

Scopri di più sul nostro approccio alla sicurezza:

* [Le migliori società di audit di sicurezza](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Email crittografata Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Perché la sicurezza della posta elettronica open source](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Architettura del database per applicazioni Node.js {#database-architecture-for-nodejs-applications}

Utilizziamo un approccio di database ibrido ottimizzato per le nostre applicazioni Node.js. Questi modelli possono essere adattati a qualsiasi applicazione Node.js:

### Implementazione di SQLite per la produzione Node.js {#sqlite-implementation-for-nodejs-production}

**Cosa utilizziamo:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**La nostra configurazione:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Utilizziamo SQLite per i dati specifici dell'utente nelle nostre applicazioni Node.js perché fornisce:

* **Isolamento dei dati** per utente/tenant
* **Prestazioni migliori** per query monoutente
* **Backup e migrazione semplificati**
* **Complessità ridotta** rispetto ai database condivisi

Questo modello funziona bene per le applicazioni SaaS, i sistemi multi-tenant o qualsiasi applicazione Node.js che necessiti di isolamento dei dati.

### Implementazione MongoDB per la produzione Node.js {#mongodb-implementation-for-nodejs-production}

**Cosa utilizziamo:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**La nostra implementazione di configurazione:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**La nostra configurazione:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Utilizziamo MongoDB per i dati delle applicazioni nel nostro ambiente di produzione Node.js perché fornisce:

* **Schema flessibile** per strutture dati in evoluzione
* **Prestazioni migliori** per query complesse
* **Capacità di **scalabilità orizzontale**
* **Linguaggio di query avanzato**

> \[!NOTE]
> Il nostro approccio ibrido ottimizza il nostro caso d'uso specifico. Studia i nostri modelli di utilizzo effettivi del database nel codice sorgente per capire se questo approccio si adatta alle esigenze della tua applicazione Node.js.

## Elaborazione del lavoro in background di produzione Node.js {#nodejs-production-background-job-processing}

Abbiamo costruito la nostra architettura per i processi in background attorno a Bree per un'implementazione affidabile in produzione di Node.js. Questo vale per qualsiasi applicazione Node.js che necessiti di elaborazione in background:

### La nostra configurazione del server Bree per la produzione {#our-bree-server-setup-for-production}

**La nostra implementazione principale:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**La nostra distribuzione Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Esempi di lavori di produzione {#production-job-examples}

**Monitoraggio sanitario:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automazione della pulizia:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tutti i nostri lavori:** [Sfoglia la nostra directory completa dei lavori](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Questi modelli si applicano a qualsiasi applicazione Node.js che necessiti di:

* Attività pianificate (elaborazione dati, report, pulizia)
* Elaborazione in background (ridimensionamento immagini, invio email, importazione dati)
* Monitoraggio e manutenzione dello stato
* Utilizzo dei thread di lavoro per attività ad alta intensità di CPU

### I nostri modelli di pianificazione dei lavori per la produzione Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Studia i nostri attuali modelli di pianificazione del lavoro nella nostra directory dei lavori per capire:

* Come implementiamo la schedulazione tipo cron nella produzione di Node.js
* La nostra gestione degli errori e la logica di ripetizione
* Come utilizziamo i thread di lavoro per le attività che richiedono un uso intensivo della CPU

## Manutenzione automatizzata per applicazioni Node.js di produzione {#automated-maintenance-for-production-nodejs-applications}

Implementiamo la manutenzione proattiva per prevenire i problemi di produzione più comuni di Node.js. Questi modelli si applicano a qualsiasi applicazione Node.js:

### La nostra implementazione di pulizia {#our-cleanup-implementation}

**Fonte:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

La nostra manutenzione automatizzata per le applicazioni di produzione Node.js ha come obiettivi:

* **File temporanei** più vecchi di 24 ore
* **File di registro** oltre i limiti di conservazione
* **File di cache** e dati temporanei
* **File caricati** non più necessari
* **Snapshot dell'heap** dal debug delle prestazioni

Questi modelli si applicano a qualsiasi applicazione Node.js che genera file temporanei, registri o dati memorizzati nella cache.

### Gestione dello spazio su disco per la produzione di Node.js {#disk-space-management-for-nodejs-production}

**Le nostre soglie di monitoraggio:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limiti di coda** per l'elaborazione in background
* Soglia di avviso per **utilizzo del disco al 75%**
* **Pulizia automatica** al superamento delle soglie

### Automazione della manutenzione delle infrastrutture {#infrastructure-maintenance-automation}

**La nostra automazione Ansible per la produzione Node.js:**

* [Distribuzione dell'ambiente](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gestione delle chiavi di distribuzione](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Guida all'implementazione della distribuzione di produzione di Node.js {#nodejs-production-deployment-implementation-guide}

### Studia il nostro codice attuale per le migliori pratiche di produzione {#study-our-actual-code-for-production-best-practices}

**Inizia con questi file chiave per la configurazione dell'ambiente di produzione Node.js:**

1. **Configurazione:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoraggio:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Gestione errori:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Registrazione:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Stato del processo:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Impara dai post del nostro blog {#learn-from-our-blog-posts}

**Le nostre guide all'implementazione tecnica per la produzione di Node.js:**

* [Ecosistema dei pacchetti NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Sistemi di pagamento edilizio](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementazione della privacy della posta elettronica](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Moduli di contatto JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrazione e-mail React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automazione dell'infrastruttura per la produzione Node.js {#infrastructure-automation-for-nodejs-production}

**I nostri playbook Ansible da studiare per la distribuzione in produzione di Node.js:**

* [Elenco completo dei playbook](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Rafforzamento della sicurezza](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configurazione di Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### I nostri casi di studio {#our-case-studies}

**Le nostre implementazioni aziendali:**

* [Caso di studio della Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Caso di studio di Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Inoltro e-mail degli ex studenti](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Conclusione: Best practice per la distribuzione in produzione di Node.js {#conclusion-nodejs-production-deployment-best-practices}

La nostra infrastruttura di produzione Node.js dimostra che le applicazioni Node.js possono raggiungere un'affidabilità di livello aziendale attraverso:

* **Scelte hardware comprovate** (AMD Ryzen per un'ottimizzazione delle prestazioni single-core del 573%)
* **Monitoraggio della produzione Node.js collaudato** con soglie specifiche e risposte automatizzate
* **Classificazione intelligente degli errori** per migliorare la risposta agli incidenti negli ambienti di produzione
* **Debug avanzato delle prestazioni** con v8-profiler-next e cpupro per la prevenzione degli errori di automazione (OOM)
* **Rafforzamento completo della sicurezza** tramite l'automazione di Ansible
* **Architettura di database ibrida** ottimizzata per le esigenze applicative
* **Manutenzione automatizzata** per prevenire i problemi comuni di produzione Node.js

**Consiglio chiave:** Studiate i nostri file di implementazione e i post del blog, invece di seguire best practice generiche. Il nostro codice sorgente fornisce modelli concreti per l'implementazione in produzione di Node.js, adattabili a qualsiasi applicazione Node.js: app web, API, microservizi o servizi in background.

## Elenco completo delle risorse per la produzione di Node.js {#complete-resource-list-for-nodejs-production}

### I nostri file di implementazione principali {#our-core-implementation-files}

* [Configurazione principale](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dipendenze del pacchetto](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitoraggio del server](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Classificazione degli errori](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistema di registrazione](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Controlli sanitari PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Pulizia automatizzata](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Le nostre implementazioni server {#our-server-implementations}

* [Server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Server IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [server POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### La nostra automazione infrastrutturale {#our-infrastructure-automation}

* [Tutti i nostri playbook Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Rafforzamento della sicurezza](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configurazione di Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configurazione del database](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### I nostri post del blog tecnico {#our-technical-blog-posts}

* [Analisi dell'ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementazione del sistema di pagamento](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guida tecnica sulla privacy della posta elettronica](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Moduli di contatto JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrazione e-mail React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guida alle soluzioni self-hosted](https://forwardemail.net/blog/docs/self-hosted-solution)

### I nostri casi di studio aziendali {#our-enterprise-case-studies}

* [Implementazione della Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Caso di studio di Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Conformità al governo federale](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistemi di posta elettronica per ex studenti](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)