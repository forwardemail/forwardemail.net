# Come ottimizzare l'infrastruttura di produzione Node.js: migliori pratiche {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Guida all'ottimizzazione delle prestazioni di Node.js" class="rounded-lg" />


## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [La nostra rivoluzione dell'ottimizzazione delle prestazioni single core del 573%](#our-573-single-core-performance-optimization-revolution)
  * [Perché l'ottimizzazione delle prestazioni single core è importante per Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Contenuti correlati](#related-content)
* [Configurazione dell'ambiente di produzione Node.js: il nostro stack tecnologico](#nodejs-production-environment-setup-our-technology-stack)
  * [Package Manager: pnpm per l'efficienza in produzione](#package-manager-pnpm-for-production-efficiency)
  * [Web Framework: Koa per una produzione Node.js moderna](#web-framework-koa-for-modern-nodejs-production)
  * [Elaborazione di job in background: Bree per l'affidabilità in produzione](#background-job-processing-bree-for-production-reliability)
  * [Gestione degli errori: @hapi/boom per l'affidabilità in produzione](#error-handling-hapiboom-for-production-reliability)
* [Come monitorare le applicazioni Node.js in produzione](#how-to-monitor-nodejs-applications-in-production)
  * [Monitoraggio di produzione Node.js a livello di sistema](#system-level-nodejs-production-monitoring)
  * [Monitoraggio a livello applicativo per la produzione Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitoraggio specifico per applicazione](#application-specific-monitoring)
* [Monitoraggio di produzione Node.js con controlli di salute PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Il nostro sistema di controllo salute PM2](#our-pm2-health-check-system)
  * [La nostra configurazione PM2 per la produzione](#our-pm2-production-configuration)
  * [Deploy PM2 automatizzato](#automated-pm2-deployment)
* [Sistema di gestione e classificazione degli errori in produzione](#production-error-handling-and-classification-system)
  * [La nostra implementazione isCodeBug per la produzione](#our-iscodebug-implementation-for-production)
  * [Integrazione con il nostro logging di produzione](#integration-with-our-production-logging)
  * [Contenuti correlati](#related-content-1)
* [Debugging avanzato delle prestazioni con v8-profiler-next e cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Il nostro approccio di profiling per la produzione Node.js](#our-profiling-approach-for-nodejs-production)
  * [Come implementiamo l'analisi degli snapshot dell'heap](#how-we-implement-heap-snapshot-analysis)
  * [Workflow di debugging delle prestazioni](#performance-debugging-workflow)
  * [Implementazione consigliata per la tua applicazione Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integrazione con il nostro monitoraggio di produzione](#integration-with-our-production-monitoring)
* [Sicurezza dell'infrastruttura di produzione Node.js](#nodejs-production-infrastructure-security)
  * [Sicurezza a livello di sistema per la produzione Node.js](#system-level-security-for-nodejs-production)
  * [Sicurezza applicativa per le applicazioni Node.js](#application-security-for-nodejs-applications)
  * [Automazione della sicurezza dell'infrastruttura](#infrastructure-security-automation)
  * [I nostri contenuti sulla sicurezza](#our-security-content)
* [Architettura database per applicazioni Node.js](#database-architecture-for-nodejs-applications)
  * [Implementazione SQLite per la produzione Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementazione MongoDB per la produzione Node.js](#mongodb-implementation-for-nodejs-production)
* [Elaborazione di job in background in produzione Node.js](#nodejs-production-background-job-processing)
  * [La nostra configurazione server Bree per la produzione](#our-bree-server-setup-for-production)
  * [Esempi di job in produzione](#production-job-examples)
  * [I nostri pattern di scheduling job per la produzione Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Manutenzione automatizzata per applicazioni Node.js in produzione](#automated-maintenance-for-production-nodejs-applications)
  * [La nostra implementazione di cleanup](#our-cleanup-implementation)
  * [Gestione dello spazio disco per la produzione Node.js](#disk-space-management-for-nodejs-production)
  * [Automazione della manutenzione dell'infrastruttura](#infrastructure-maintenance-automation)
* [Guida all'implementazione del deployment in produzione Node.js](#nodejs-production-deployment-implementation-guide)
  * [Studia il nostro codice reale per le migliori pratiche di produzione](#study-our-actual-code-for-production-best-practices)
  * [Impara dai nostri post sul blog](#learn-from-our-blog-posts)
  * [Automazione dell'infrastruttura per la produzione Node.js](#infrastructure-automation-for-nodejs-production)
  * [I nostri case study](#our-case-studies)
* [Conclusione: migliori pratiche per il deployment in produzione Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Elenco completo delle risorse per la produzione Node.js](#complete-resource-list-for-nodejs-production)
  * [I nostri file di implementazione core](#our-core-implementation-files)
  * [Le nostre implementazioni server](#our-server-implementations)
  * [La nostra automazione dell'infrastruttura](#our-infrastructure-automation)
  * [I nostri post tecnici sul blog](#our-technical-blog-posts)
  * [I nostri case study enterprise](#our-enterprise-case-studies)
## Prefazione {#foreword}

Da Forward Email, abbiamo trascorso anni a perfezionare la configurazione del nostro ambiente di produzione Node.js. Questa guida completa condivide le nostre migliori pratiche collaudate per il deployment in produzione di Node.js, concentrandosi sull'ottimizzazione delle prestazioni, il monitoraggio e le lezioni apprese scalando applicazioni Node.js per gestire milioni di transazioni giornaliere.


## La nostra rivoluzione del 573% nell'ottimizzazione delle prestazioni su singolo core {#our-573-single-core-performance-optimization-revolution}

Quando siamo passati dai processori Intel agli AMD Ryzen, abbiamo ottenuto un **miglioramento delle prestazioni del 573%** nelle nostre applicazioni Node.js. Non si è trattato solo di una piccola ottimizzazione, ma ha cambiato radicalmente il modo in cui le nostre applicazioni Node.js performano in produzione e dimostra l'importanza dell'ottimizzazione delle prestazioni su singolo core per qualsiasi applicazione Node.js.

> \[!TIP]
> Per le migliori pratiche di deployment in produzione di Node.js, la scelta dell'hardware è fondamentale. Abbiamo scelto specificamente l'hosting DataPacket per la disponibilità di AMD Ryzen perché le prestazioni su singolo core sono cruciali per le applicazioni Node.js dato che l'esecuzione di JavaScript è single-thread.

### Perché l'ottimizzazione delle prestazioni su singolo core è importante per Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

La nostra migrazione da Intel ad AMD Ryzen ha portato a:

* **Miglioramento delle prestazioni del 573%** nell'elaborazione delle richieste (documentato in [il nostro status page GitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminazione dei ritardi di elaborazione** fino a risposte quasi istantanee (menzionato in [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Miglior rapporto prezzo-prestazioni** per ambienti di produzione Node.js
* **Tempi di risposta migliorati** su tutti i nostri endpoint applicativi

Il miglioramento delle prestazioni è stato così significativo che ora consideriamo i processori AMD Ryzen essenziali per qualsiasi deployment serio di Node.js in produzione, sia che si tratti di applicazioni web, API, microservizi o qualsiasi altro carico di lavoro Node.js.

### Contenuti correlati {#related-content}

Per maggiori dettagli sulle nostre scelte infrastrutturali, consulta:

* [Miglior servizio di inoltro email](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Confronti di prestazioni
* [Soluzione self-hosted](https://forwardemail.net/blog/docs/self-hosted-solution) - Raccomandazioni hardware


## Configurazione dell'ambiente di produzione Node.js: il nostro stack tecnologico {#nodejs-production-environment-setup-our-technology-stack}

Le nostre migliori pratiche per il deployment in produzione di Node.js includono scelte tecnologiche deliberate basate su anni di esperienza in produzione. Ecco cosa usiamo e perché queste scelte si applicano a qualsiasi applicazione Node.js:

### Package Manager: pnpm per l'efficienza in produzione {#package-manager-pnpm-for-production-efficiency}

**Cosa usiamo:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (versione fissata)

Abbiamo scelto pnpm rispetto a npm e yarn per la configurazione del nostro ambiente di produzione Node.js perché:

* **Tempi di installazione più rapidi** nelle pipeline CI/CD
* **Efficienza dello spazio su disco** tramite hard linking
* **Risoluzione rigorosa delle dipendenze** che previene dipendenze fantasma
* **Prestazioni migliori** nei deployment di produzione

> \[!NOTE]
> Come parte delle nostre migliori pratiche per il deployment in produzione di Node.js, fissiamo versioni esatte di strumenti critici come pnpm per garantire un comportamento coerente in tutti gli ambienti e sulle macchine dei membri del team.

**Dettagli di implementazione:**

* [La nostra configurazione package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Il nostro post sul blog sull'ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework Web: Koa per una produzione Node.js moderna {#web-framework-koa-for-modern-nodejs-production}

**Cosa usiamo:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Abbiamo scelto Koa invece di Express per la nostra infrastruttura di produzione Node.js grazie al suo moderno supporto async/await e a una composizione middleware più pulita. Il nostro fondatore Nick Baugh ha contribuito sia a Express che a Koa, offrendoci una profonda conoscenza di entrambi i framework per l'uso in produzione.

Questi modelli si applicano sia che tu stia costruendo API REST, server GraphQL, applicazioni web o microservizi.

**I nostri esempi di implementazione:**

* [Configurazione del server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configurazione del server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guida all'implementazione dei moduli di contatto](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Elaborazione di Job in Background: Bree per l'Affidabilità in Produzione {#background-job-processing-bree-for-production-reliability}

**Cosa usiamo:** scheduler [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Abbiamo creato e manteniamo Bree perché gli scheduler di job esistenti non soddisfacevano le nostre esigenze di supporto ai worker thread e alle funzionalità moderne di JavaScript negli ambienti Node.js di produzione. Questo vale per qualsiasi applicazione Node.js che necessita di elaborazione in background, attività programmate o worker thread.

**I nostri esempi di implementazione:**

* [Configurazione del server Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Tutte le nostre definizioni di job](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Job di controllo salute PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementazione del job di pulizia](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Gestione degli Errori: @hapi/boom per l'Affidabilità in Produzione {#error-handling-hapiboom-for-production-reliability}

**Cosa usiamo:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Usiamo @hapi/boom per risposte di errore strutturate in tutte le nostre applicazioni Node.js di produzione. Questo modello funziona per qualsiasi applicazione Node.js che necessita di una gestione coerente degli errori.

**I nostri esempi di implementazione:**

* [Helper per la classificazione degli errori](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementazione del logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Come Monitorare le Applicazioni Node.js in Produzione {#how-to-monitor-nodejs-applications-in-production}

Il nostro approccio al monitoraggio delle applicazioni Node.js in produzione si è evoluto attraverso anni di gestione di applicazioni su larga scala. Implementiamo il monitoraggio a più livelli per garantire affidabilità e prestazioni per qualsiasi tipo di applicazione Node.js.

### Monitoraggio di Produzione a Livello di Sistema per Node.js {#system-level-nodejs-production-monitoring}

**La nostra implementazione principale:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Cosa usiamo:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Le nostre soglie di monitoraggio in produzione (dal nostro codice di produzione reale):

* **Limite di heap size di 2GB** con avvisi automatici
* **Soglia di avviso al 25% di utilizzo della memoria**
* **Soglia di allarme all'80% di utilizzo CPU**
* **Soglia di avviso al 75% di utilizzo del disco**

> \[!WARNING]
> Queste soglie funzionano per la nostra specifica configurazione hardware. Quando implementi il monitoraggio di produzione Node.js, rivedi l'implementazione di monitor-server.js per comprendere la logica esatta e adattare i valori alla tua configurazione.

### Monitoraggio a Livello di Applicazione per Node.js in Produzione {#application-level-monitoring-for-nodejs-production}

**La nostra classificazione degli errori:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Questo helper distingue tra:

* **Bug reali nel codice** che richiedono attenzione immediata
* **Errori dell'utente** che sono comportamenti previsti
* **Fallimenti di servizi esterni** che non possiamo controllare

Questo modello si applica a qualsiasi applicazione Node.js - app web, API, microservizi o servizi in background.
**La nostra implementazione del logging:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Implementiamo una completa redazione dei campi per proteggere le informazioni sensibili mantenendo al contempo utili capacità di debug nel nostro ambiente di produzione Node.js.

### Monitoraggio Specifico per Applicazione {#application-specific-monitoring}

**Le nostre implementazioni server:**

* [Server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Server IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Server POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitoraggio della coda:** Implementiamo limiti di coda da 5GB e timeout di 180 secondi per l'elaborazione delle richieste per prevenire l'esaurimento delle risorse. Questi schemi si applicano a qualsiasi applicazione Node.js con code o elaborazione in background.


## Monitoraggio di Produzione Node.js con PM2 Health Checks {#nodejs-production-monitoring-with-pm2-health-checks}

Abbiamo perfezionato la configurazione del nostro ambiente di produzione Node.js con PM2 grazie a anni di esperienza in produzione. I nostri health check PM2 sono essenziali per mantenere l'affidabilità in qualsiasi applicazione Node.js.

### Il nostro Sistema di Health Check PM2 {#our-pm2-health-check-system}

**La nostra implementazione principale:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Il nostro monitoraggio di produzione Node.js con health check PM2 include:

* **Esecuzione ogni 20 minuti** tramite pianificazione cron
* **Richiede un uptime minimo di 15 minuti** prima di considerare un processo sano
* **Valida lo stato del processo e l'uso della memoria**
* **Riavvia automaticamente i processi falliti**
* **Previene loop di riavvio** tramite controlli di salute intelligenti

> \[!CAUTION]
> Per le best practice di deployment in produzione Node.js, richiediamo un uptime superiore a 15 minuti prima di considerare un processo sano per evitare loop di riavvio. Questo previene guasti a cascata quando i processi hanno problemi di memoria o altri problemi.

### La nostra Configurazione di Produzione PM2 {#our-pm2-production-configuration}

**La nostra configurazione dell'ecosistema:** Studia i nostri file di avvio server per la configurazione dell'ambiente di produzione Node.js:

* [Server Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Scheduler Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Questi schemi si applicano sia che tu stia eseguendo app Express, server Koa, API GraphQL o qualsiasi altra applicazione Node.js.

### Deployment PM2 Automatizzato {#automated-pm2-deployment}

**Deployment PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatizziamo l'intera configurazione PM2 tramite Ansible per garantire deployment di produzione Node.js coerenti su tutti i nostri server.


## Sistema di Gestione e Classificazione degli Errori in Produzione {#production-error-handling-and-classification-system}

Una delle nostre best practice più preziose per il deployment di produzione Node.js è la classificazione intelligente degli errori che si applica a qualsiasi applicazione Node.js:

### La nostra Implementazione isCodeBug per la Produzione {#our-iscodebug-implementation-for-production}

**Sorgente:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Questo helper fornisce una classificazione intelligente degli errori per applicazioni Node.js in produzione per:

* **Dare priorità ai bug reali** rispetto agli errori degli utenti
* **Migliorare la nostra risposta agli incidenti** concentrandoci sui problemi reali
* **Ridurre l'affaticamento da alert** causato da errori utente previsti
* **Comprendere meglio** i problemi generati dall'applicazione rispetto a quelli generati dall'utente

Questo schema funziona per qualsiasi applicazione Node.js - che tu stia costruendo siti e-commerce, piattaforme SaaS, API o microservizi.

### Integrazione con il Nostro Logging di Produzione {#integration-with-our-production-logging}

**La nostra integrazione del logger:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Il nostro logger utilizza `isCodeBug` per determinare i livelli di allerta e la redazione dei campi, assicurandoci di essere notificati riguardo a problemi reali mentre filtriamo il rumore nel nostro ambiente di produzione Node.js.

### Contenuti correlati {#related-content-1}

Scopri di più sui nostri modelli di gestione degli errori:

* [Costruire un sistema di pagamento affidabile](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Modelli di gestione degli errori
* [Protezione della privacy delle email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Gestione degli errori di sicurezza


## Debugging avanzato delle prestazioni con v8-profiler-next e cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Utilizziamo strumenti di profilazione avanzati per analizzare gli snapshot dell'heap e debug di problemi OOM (Out of Memory), colli di bottiglia delle prestazioni e problemi di memoria in Node.js nel nostro ambiente di produzione. Questi strumenti sono essenziali per qualsiasi applicazione Node.js che sperimenti perdite di memoria o problemi di prestazioni.

### Il nostro approccio di profilazione per la produzione Node.js {#our-profiling-approach-for-nodejs-production}

**Strumenti che consigliamo:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Per generare snapshot dell'heap e profili CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Per analizzare profili CPU e snapshot dell'heap

> \[!TIP]
> Utilizziamo v8-profiler-next e cpupro insieme per creare un flusso di lavoro completo di debugging delle prestazioni per le nostre applicazioni Node.js. Questa combinazione ci aiuta a identificare perdite di memoria, colli di bottiglia delle prestazioni e ottimizzare il nostro codice di produzione.

### Come implementiamo l'analisi degli snapshot dell'heap {#how-we-implement-heap-snapshot-analysis}

**La nostra implementazione di monitoraggio:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Il nostro monitoraggio di produzione include la generazione automatica di snapshot dell'heap quando vengono superate le soglie di memoria. Questo ci aiuta a debug di problemi OOM prima che causino crash dell'applicazione.

**Modelli chiave di implementazione:**

* **Snapshot automatici** quando la dimensione dell'heap supera la soglia di 2GB
* **Profilazione basata su segnali** per analisi on-demand in produzione
* **Politiche di conservazione** per la gestione dello storage degli snapshot
* **Integrazione con i nostri job di pulizia** per manutenzione automatizzata

### Flusso di lavoro per il debugging delle prestazioni {#performance-debugging-workflow}

**Studia la nostra implementazione reale:**

* [Implementazione del server di monitoraggio](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitoraggio dell'heap e generazione degli snapshot
* [Job di pulizia](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Conservazione e pulizia degli snapshot
* [Integrazione del logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Logging delle prestazioni

### Implementazione consigliata per la tua applicazione Node.js {#recommended-implementation-for-your-nodejs-application}

**Per l'analisi degli snapshot dell'heap:**

1. **Installa v8-profiler-next** per la generazione degli snapshot
2. **Usa cpupro** per analizzare gli snapshot generati
3. **Implementa soglie di monitoraggio** simili a quelle di monitor-server.js
4. **Configura la pulizia automatizzata** per gestire lo storage degli snapshot
5. **Crea gestori di segnali** per la profilazione on-demand in produzione

**Per la profilazione CPU:**

1. **Genera profili CPU** durante i periodi di carico elevato
2. **Analizza con cpupro** per identificare colli di bottiglia
3. **Concentrati sui percorsi caldi** e sulle opportunità di ottimizzazione
4. **Monitora le prestazioni prima/dopo** i miglioramenti

> \[!WARNING]
> Generare snapshot dell'heap e profili CPU può influire sulle prestazioni. Raccomandiamo di implementare limitazioni e di abilitare la profilazione solo quando si indagano problemi specifici o durante le finestre di manutenzione.

### Integrazione con il nostro monitoraggio di produzione {#integration-with-our-production-monitoring}

I nostri strumenti di profilazione si integrano con la nostra strategia di monitoraggio più ampia:

* **Attivazione automatica** basata su soglie di memoria/CPU
* **Integrazione degli alert** quando vengono rilevati problemi di prestazioni
* **Analisi storica** per tracciare le tendenze delle prestazioni nel tempo
* **Correlazione con metriche applicative** per un debugging completo
Questo approccio ci ha aiutato a identificare e risolvere perdite di memoria, ottimizzare i percorsi di codice critici e mantenere prestazioni stabili nel nostro ambiente di produzione Node.js.


## Sicurezza dell'Infrastruttura di Produzione Node.js {#nodejs-production-infrastructure-security}

Implementiamo una sicurezza completa per la nostra infrastruttura di produzione Node.js tramite automazione Ansible. Queste pratiche si applicano a qualsiasi applicazione Node.js:

### Sicurezza a Livello di Sistema per la Produzione Node.js {#system-level-security-for-nodejs-production}

**La nostra implementazione Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Le nostre principali misure di sicurezza per ambienti di produzione Node.js:

* **Swap disabilitato** per evitare che dati sensibili vengano scritti su disco
* **Core dump disabilitati** per prevenire dump di memoria contenenti informazioni sensibili
* **Archiviazione USB bloccata** per impedire accessi non autorizzati ai dati
* **Ottimizzazione dei parametri del kernel** sia per la sicurezza che per le prestazioni

> \[!WARNING]
> Quando si implementano le best practice per il deployment di produzione Node.js, disabilitare lo swap può causare terminazioni per esaurimento memoria se la tua applicazione supera la RAM disponibile. Monitoriamo attentamente l'uso della memoria e dimensioniamo i nostri server di conseguenza.

### Sicurezza dell'Applicazione per Applicazioni Node.js {#application-security-for-nodejs-applications}

**La nostra redazione dei campi di log:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Redigiamo i campi sensibili dai log inclusi password, token, chiavi API e informazioni personali. Questo protegge la privacy degli utenti mantenendo le capacità di debug in qualsiasi ambiente di produzione Node.js.

### Automazione della Sicurezza dell'Infrastruttura {#infrastructure-security-automation}

**La nostra configurazione completa Ansible per la produzione Node.js:**

* [Playbook di sicurezza](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gestione chiavi SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestione certificati](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configurazione DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Il Nostro Contenuto sulla Sicurezza {#our-security-content}

Scopri di più sul nostro approccio alla sicurezza:

* [Migliori Aziende per Audit di Sicurezza](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Email Crittografata Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Perché la Sicurezza Email Open Source](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Architettura del Database per Applicazioni Node.js {#database-architecture-for-nodejs-applications}

Utilizziamo un approccio ibrido al database ottimizzato per le nostre applicazioni Node.js. Questi modelli possono essere adattati a qualsiasi applicazione Node.js:

### Implementazione SQLite per la Produzione Node.js {#sqlite-implementation-for-nodejs-production}

**Cosa usiamo:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**La nostra configurazione:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Usiamo SQLite per i dati specifici degli utenti nelle nostre applicazioni Node.js perché offre:

* **Isolamento dei dati** per utente/tenant
* **Prestazioni migliori** per query a singolo utente
* **Backup e migrazione semplificati**
* **Minore complessità** rispetto ai database condivisi

Questo modello funziona bene per applicazioni SaaS, sistemi multi-tenant o qualsiasi applicazione Node.js che necessita isolamento dei dati.

### Implementazione MongoDB per la Produzione Node.js {#mongodb-implementation-for-nodejs-production}

**Cosa usiamo:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**La nostra implementazione di setup:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**La nostra configurazione:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Utilizziamo MongoDB per i dati dell'applicazione nel nostro ambiente di produzione Node.js perché offre:

* **Schema flessibile** per strutture dati in evoluzione
* **Migliori prestazioni** per query complesse
* **Capacità di scalabilità orizzontale**
* **Linguaggio di query ricco**

> \[!NOTE]
> Il nostro approccio ibrido è ottimizzato per il nostro caso d'uso specifico. Studia i modelli di utilizzo effettivi del database nel codice per capire se questo approccio si adatta alle esigenze della tua applicazione Node.js.


## Elaborazione di Job in Background in Produzione Node.js {#nodejs-production-background-job-processing}

Abbiamo costruito la nostra architettura di job in background attorno a Bree per un deployment affidabile in produzione Node.js. Questo vale per qualsiasi applicazione Node.js che necessita di elaborazione in background:

### La nostra configurazione del server Bree per la produzione {#our-bree-server-setup-for-production}

**La nostra implementazione principale:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Il nostro deployment Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Esempi di job in produzione {#production-job-examples}

**Monitoraggio della salute:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automazione della pulizia:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tutti i nostri job:** [Esplora la nostra directory completa di job](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Questi modelli si applicano a qualsiasi applicazione Node.js che necessita di:

* Attività programmate (elaborazione dati, report, pulizia)
* Elaborazione in background (ridimensionamento immagini, invio email, importazione dati)
* Monitoraggio della salute e manutenzione
* Utilizzo di thread worker per attività intensive in CPU

### I nostri modelli di scheduling dei job per la produzione Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Studia i nostri modelli effettivi di scheduling dei job nella nostra directory jobs per capire:

* Come implementiamo uno scheduling simile a cron in produzione Node.js
* La nostra gestione degli errori e la logica di retry
* Come utilizziamo i thread worker per attività intensive in CPU


## Manutenzione automatizzata per applicazioni Node.js in produzione {#automated-maintenance-for-production-nodejs-applications}

Implementiamo una manutenzione proattiva per prevenire problemi comuni in produzione Node.js. Questi modelli si applicano a qualsiasi applicazione Node.js:

### La nostra implementazione di pulizia {#our-cleanup-implementation}

**Sorgente:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

La nostra manutenzione automatizzata per applicazioni Node.js in produzione si concentra su:

* **File temporanei** più vecchi di 24 ore
* **File di log** oltre i limiti di conservazione
* **File di cache** e dati temporanei
* **File caricati** non più necessari
* **Heap snapshot** da debugging delle prestazioni

Questi modelli si applicano a qualsiasi applicazione Node.js che genera file temporanei, log o dati in cache.

### Gestione dello spazio su disco per la produzione Node.js {#disk-space-management-for-nodejs-production}

**Le nostre soglie di monitoraggio:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limiti di coda** per l'elaborazione in background
* **Soglia di avviso al 75% di utilizzo disco**
* **Pulizia automatica** quando le soglie sono superate

### Automazione della manutenzione dell'infrastruttura {#infrastructure-maintenance-automation}

**La nostra automazione Ansible per la produzione Node.js:**

* [Deployment dell'ambiente](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gestione delle chiavi di deployment](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Guida all'implementazione del deployment in produzione Node.js {#nodejs-production-deployment-implementation-guide}
### Studia il Nostro Codice Reale per le Best Practice in Produzione {#study-our-actual-code-for-production-best-practices}

**Inizia con questi file chiave per la configurazione dell'ambiente di produzione Node.js:**

1. **Configurazione:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitoraggio:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Gestione degli errori:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logging:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Salute del processo:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Impara dai Nostri Post del Blog {#learn-from-our-blog-posts}

**Le nostre guide tecniche per l'implementazione in produzione Node.js:**

* [Ecosistema dei pacchetti NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Costruire sistemi di pagamento](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementazione della privacy email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Moduli di contatto JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrazione email con React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automazione dell'Infrastruttura per la Produzione Node.js {#infrastructure-automation-for-nodejs-production}

**I nostri playbook Ansible da studiare per il deployment in produzione Node.js:**

* [Directory completa dei playbook](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Rafforzamento della sicurezza](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configurazione Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### I Nostri Case Study {#our-case-studies}

**Le nostre implementazioni enterprise:**

* [Case Study Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Case Study Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Inoltro email Alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Conclusione: Best Practice per il Deployment in Produzione Node.js {#conclusion-nodejs-production-deployment-best-practices}

La nostra infrastruttura di produzione Node.js dimostra che le applicazioni Node.js possono raggiungere affidabilità di livello enterprise attraverso:

* **Scelte hardware comprovate** (AMD Ryzen per un’ottimizzazione delle prestazioni single core del 573%)
* **Monitoraggio di produzione Node.js collaudato** con soglie specifiche e risposte automatizzate
* **Classificazione intelligente degli errori** per migliorare la risposta agli incidenti in ambienti di produzione
* **Debugging avanzato delle prestazioni** con v8-profiler-next e cpupro per la prevenzione di OOM
* **Rafforzamento completo della sicurezza** tramite automazione Ansible
* **Architettura ibrida del database** ottimizzata per le esigenze dell’applicazione
* **Manutenzione automatizzata** per prevenire problemi comuni in produzione Node.js

**Punto chiave:** Studia i nostri file di implementazione reali e i post del blog invece di seguire best practice generiche. Il nostro codice fornisce modelli reali per il deployment in produzione Node.js che possono essere adattati a qualsiasi applicazione Node.js - web app, API, microservizi o servizi in background.


## Elenco Completo delle Risorse per la Produzione Node.js {#complete-resource-list-for-nodejs-production}

### I Nostri File di Implementazione Principali {#our-core-implementation-files}

* [Configurazione principale](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dipendenze dei pacchetti](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitoraggio server](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Classificazione degli errori](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Sistema di logging](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Controlli di salute PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Pulizia automatizzata](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Le nostre implementazioni server {#our-server-implementations}

* [Server web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Server API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Scheduler Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Server SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Server IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Server POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### La nostra automazione infrastrutturale {#our-infrastructure-automation}

* [Tutti i nostri playbook Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Rafforzamento della sicurezza](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configurazione Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configurazione database](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### I nostri post tecnici sul blog {#our-technical-blog-posts}

* [Analisi dell’ecosistema NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementazione del sistema di pagamento](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guida tecnica alla privacy delle email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Moduli di contatto JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integrazione email con React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guida alla soluzione self-hosted](https://forwardemail.net/blog/docs/self-hosted-solution)

### I nostri casi di studio aziendali {#our-enterprise-case-studies}

* [Implementazione Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Caso di studio Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Conformità del governo federale](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Sistemi email per alumni](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
