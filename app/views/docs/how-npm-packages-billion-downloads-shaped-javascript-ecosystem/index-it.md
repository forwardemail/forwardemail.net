# Un decennio di impatto: come i nostri pacchetti npm hanno raggiunto 1 miliardo di download e hanno plasmato JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [I pionieri che si fidano di noi: Isaac Z. Schlueter e Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Dalla creazione di npm alla leadership di Node.js](#from-npms-creation-to-nodejs-leadership)
* [L'architetto dietro il codice: il viaggio di Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Comitato tecnico espresso e contributi fondamentali](#express-technical-committee-and-core-contributions)
  * [Contributi al framework Koa](#koa-framework-contributions)
  * [Da collaboratore individuale a leader dell'organizzazione](#from-individual-contributor-to-organization-leader)
* [Le nostre organizzazioni GitHub: ecosistemi di innovazione](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: registrazione strutturata per applicazioni moderne](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: combattere l'abuso della posta elettronica](#spam-scanner-fighting-email-abuse)
  * [Bree: Pianificazione moderna dei lavori con thread di lavoro](#bree-modern-job-scheduling-with-worker-threads)
  * [Inoltra e-mail: infrastruttura di posta elettronica open source](#forward-email-open-source-email-infrastructure)
  * [Lad: Utilità e strumenti essenziali Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: monitoraggio del tempo di attività open source](#upptime-open-source-uptime-monitoring)
* [I nostri contributi all'ecosistema Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Dai pacchetti alla produzione](#from-packages-to-production)
  * [Il ciclo di feedback](#the-feedback-loop)
* [I principi fondamentali di Forward Email: una base per l'eccellenza](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Sempre adatto agli sviluppatori, incentrato sulla sicurezza e trasparente](#always-developer-friendly-security-focused-and-transparent)
  * [Aderenza ai principi di sviluppo software collaudati](#adherence-to-time-tested-software-development-principles)
  * [Prendere di mira lo sviluppatore intraprendente e autofinanziato](#targeting-the-scrappy-bootstrapped-developer)
  * [Principi in pratica: il codice di base di posta elettronica in avanti](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Open Source sostenibile](#sustainable-open-source)
* [I numeri non mentono: le nostre incredibili statistiche di download di npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Una panoramica del nostro impatto](#a-birds-eye-view-of-our-impact)
  * [Impatto quotidiano su larga scala](#daily-impact-at-scale)
  * [Oltre i numeri grezzi](#beyond-the-raw-numbers)
* [Supportare l'ecosistema: le nostre sponsorizzazioni open source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: pioniere dell'infrastruttura di posta elettronica](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: mente del pacchetto di utilità](#sindre-sorhus-utility-package-mastermind)
* [Scoprire le vulnerabilità di sicurezza nell'ecosistema JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Il salvataggio di Koa-Router](#the-koa-router-rescue)
  * [Affrontare le vulnerabilità ReDoS](#addressing-redos-vulnerabilities)
  * [Sostenere la sicurezza di Node.js e Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Protezione dell'infrastruttura npm](#securing-npm-infrastructure)
* [I nostri contributi all'ecosistema Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Miglioramento delle funzionalità principali di Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Migliorare l'autenticazione e-mail con Mailauth](#advancing-email-authentication-with-mailauth)
  * [Miglioramenti chiave di Upptime](#key-upptime-enhancements)
* [Il collante che tiene tutto insieme: codice personalizzato su larga scala](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Uno sforzo di sviluppo enorme](#a-massive-development-effort)
  * [Integrazione delle dipendenze principali](#core-dependencies-integration)
  * [Infrastruttura DNS con Tangerine e mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impatto aziendale: dalle soluzioni open source a quelle mission-critical](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Casi di studio sull'infrastruttura di posta elettronica critica per la missione](#case-studies-in-mission-critical-email-infrastructure)
* [Un decennio di Open Source: uno sguardo al futuro](#a-decade-of-open-source-looking-forward)

## Prefazione {#foreword}

Nel mondo [JavaScript](https://en.wikipedia.org/wiki/JavaScript) e [Node.js](https://en.wikipedia.org/wiki/Node.js), alcuni pacchetti sono essenziali: vengono scaricati milioni di volte al giorno e alimentano app in tutto il mondo. Dietro questi strumenti ci sono sviluppatori concentrati sulla qualità open source. Oggi vi mostriamo come il nostro team contribuisce a creare e gestire pacchetti npm che sono diventati elementi chiave dell'ecosistema JavaScript.

## I pionieri che si fidano di noi: Isaac Z. Schlueter e Inoltra email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Siamo orgogliosi di avere [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) come utente. Isaac ha creato [npm](https://en.wikipedia.org/wiki/Npm_\(software\) e ha contribuito a sviluppare [Node.js](https://en.wikipedia.org/wiki/Node.js). La sua fiducia in Forward Email dimostra la nostra attenzione alla qualità e alla sicurezza. Isaac utilizza Forward Email per diversi domini, tra cui izs.me.

L'impatto di Isaac su JavaScript è enorme. Nel 2009, è stato tra i primi a vedere il potenziale di Node.js, lavorando con [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), che ha creato la piattaforma. Come ha detto Isaac in un [intervista con la rivista Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "In mezzo a questa piccolissima comunità di un gruppo di persone che cercava di capire come realizzare JavaScript lato server, Ryan Dahl ha lanciato Node, che era chiaramente l'approccio giusto. Ho dato il mio contributo e mi sono impegnato molto verso la metà del 2009."

> \[!NOTE]
> Per chi è interessato alla storia di Node.js, sono disponibili eccellenti documentari che ne raccontano lo sviluppo, tra cui [La storia di Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) e [10 cose di cui mi pento di Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Anche [sito web personale](https://tinyclouds.org/) di Ryan Dahl contiene preziosi spunti sul suo lavoro.

### Dalla creazione di npm alla leadership di Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac ha creato npm nel settembre 2009, la cui prima versione utilizzabile è stata rilasciata all'inizio del 2010. Questo gestore di pacchetti ha soddisfatto un'esigenza fondamentale di Node.js, consentendo agli sviluppatori di condividere e riutilizzare facilmente il codice. Secondo [Pagina Wikipedia di Node.js](https://en.wikipedia.org/wiki/Node.js), "Nel gennaio 2010 è stato introdotto un gestore di pacchetti per l'ambiente Node.js chiamato npm. Il gestore di pacchetti consente ai programmatori di pubblicare e condividere pacchetti Node.js, insieme al relativo codice sorgente, ed è progettato per semplificare l'installazione, l'aggiornamento e la disinstallazione dei pacchetti."

Quando Ryan Dahl si è ritirato da Node.js nel gennaio 2012, Isaac ha assunto il ruolo di project leader. Come riportato su [il suo riassunto](https://izs.me/resume), ha "guidato lo sviluppo di diverse API fondamentali del core di Node.js, tra cui il sistema di moduli CommonJS, le API del file system e gli stream" e ha "ricoperto il ruolo di BDFL (Benevolent Dictator For Life) del progetto per 2 anni, garantendo una qualità sempre maggiore e un processo di build affidabile per le versioni di Node.js dalla v0.6 alla v0.10".

Isaac ha guidato Node.js attraverso un periodo di crescita chiave, definendo standard che ancora oggi caratterizzano la piattaforma. In seguito, nel 2014, ha fondato npm, Inc. per supportare il registro npm, che in precedenza aveva gestito autonomamente.

Ringraziamo Isaac per il suo enorme contributo a JavaScript e continuiamo a utilizzare molti dei pacchetti da lui creati. Il suo lavoro ha cambiato il modo in cui sviluppiamo software e il modo in cui milioni di sviluppatori condividono il codice in tutto il mondo.

## L'architetto dietro il codice: il viaggio di Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Al centro del nostro successo open source c'è Nick Baugh, fondatore e proprietario di Forward Email. Il suo lavoro in JavaScript dura da quasi 20 anni e ha plasmato il modo in cui innumerevoli sviluppatori creano app. Il suo percorso nell'open source dimostra sia competenza tecnica che leadership nella comunità.

### Comitato tecnico espresso e contributi principali {#express-technical-committee-and-core-contributions}

La competenza di Nick nei framework web gli ha fatto guadagnare un posto nel [Comitato Tecnico Espresso](https://expressjs.com/en/resources/community.html), dove ha collaborato con uno dei framework Node.js più utilizzati. Nick è ora elencato come membro inattivo nel [Pagina della comunità Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express è stato originariamente creato da TJ Holowaychuk, un prolifico collaboratore open source che ha plasmato gran parte dell'ecosistema Node.js. Siamo grati a TJ per il suo lavoro fondamentale e stimiamo il suo contributo [decisione di prendersi una pausa](https://news.ycombinator.com/item?id=37687017) per i suoi numerosi contributi open source.

In qualità di membro di [Comitato Tecnico Espresso](https://expressjs.com/en/resources/community.html), Nick ha dimostrato grande attenzione ai dettagli in questioni come la chiarificazione della documentazione di `req.originalUrl` e la risoluzione dei problemi di gestione dei moduli multiparte.

### Contributi al framework Koa {#koa-framework-contributions}

Il lavoro di Nick con [Struttura Koa](https://github.com/koajs/koa), un'alternativa moderna e leggera a Express, anch'essa creata da TJ Holowaychuk, dimostra ulteriormente il suo impegno per strumenti di sviluppo web migliori. I suoi contributi in Koa includono sia la risoluzione di problemi che la gestione del codice tramite pull request, affrontando la gestione degli errori, la gestione dei tipi di contenuto e il miglioramento della documentazione.

Il suo lavoro sia con Express che con Koa gli ha fornito una visione unica dello sviluppo web con Node.js, aiutando il nostro team a creare pacchetti che funzionano bene con più ecosistemi di framework.

### Da collaboratore individuale a leader dell'organizzazione {#from-individual-contributor-to-organization-leader}

Quello che era iniziato come supporto a progetti esistenti si è trasformato nella creazione e gestione di interi ecosistemi di pacchetti. Nick ha fondato diverse organizzazioni GitHub, tra cui [Cabina](https://github.com/cabinjs), [Scanner antispam](https://github.com/spamscanner), [Inoltra e-mail](https://github.com/forwardemail), [Ragazzo](https://github.com/ladjs) e [Bree](https://github.com/breejs), ognuna delle quali risolveva esigenze specifiche della community JavaScript.

Questo passaggio da collaboratore a leader dimostra la visione di Nick per un software ben progettato che risolve problemi reali. Organizzando pacchetti correlati in organizzazioni GitHub mirate, ha creato ecosistemi di strumenti che interagiscono tra loro, pur rimanendo modulari e flessibili per l'intera comunità di sviluppatori.

## Le nostre organizzazioni GitHub: ecosistemi di innovazione {#our-github-organizations-ecosystems-of-innovation}

Organizziamo il nostro lavoro open source attorno a organizzazioni GitHub specifiche, ognuna delle quali risolve esigenze specifiche in JavaScript. Questa struttura crea famiglie di pacchetti coese che funzionano bene insieme pur rimanendo modulari.

### Cabin: registrazione strutturata per applicazioni moderne {#cabin-structured-logging-for-modern-applications}

[Organizzazione della cabina](https://github.com/cabinjs) è la nostra interpretazione di un sistema di logging semplice e potente per le app. Il pacchetto principale [`cabin`](https://github.com/cabinjs/cabin) ha quasi 900 stelle su GitHub e oltre 100.000 download settimanali\[^1]. Cabin offre un logging strutturato compatibile con servizi popolari come Sentry, LogDNA e Papertrail.

Ciò che rende Cabin speciale è il suo sistema di API e plugin ben studiato. Il supporto di pacchetti come [`axe`](https://github.com/cabinjs/axe) per il middleware Express e [`parse-request`](https://github.com/cabinjs/parse-request) per l'analisi delle richieste HTTP dimostra il nostro impegno nel fornire soluzioni complete piuttosto che strumenti isolati.

Una menzione speciale merita il pacchetto [`bson-objectid`](https://github.com/cabinjs/bson-objectid), con oltre 1,7 milioni di download in soli due mesi\[^2]. Questa implementazione leggera di MongoDB ObjectID è diventata il punto di riferimento per gli sviluppatori che necessitano di ID senza dipendenze complete da MongoDB.

### Spam Scanner: lotta all'abuso della posta elettronica {#spam-scanner-fighting-email-abuse}

[Organizzazione Spam Scanner](https://github.com/spamscanner) dimostra il nostro impegno nel risolvere problemi reali. Il pacchetto principale [`spamscanner`](https://github.com/spamscanner/spamscanner) offre un rilevamento avanzato dello spam via email, ma è il pacchetto [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) ad aver riscontrato un'adozione straordinaria.

Con oltre 1,2 milioni di download in due mesi\[^3], `url-regex-safe` risolve problemi di sicurezza critici in altre espressioni regolari di rilevamento URL. Questo pacchetto mostra il nostro approccio all'open source: individuare un problema comune (in questo caso, le vulnerabilità di [RedoS](https://en.wikipedia.org/wiki/ReDoS) nella convalida degli URL), creare una soluzione solida e mantenerla con cura.

### Bree: Pianificazione moderna dei lavori con thread di lavoro {#bree-modern-job-scheduling-with-worker-threads}

[Organizzazione Bree](https://github.com/breejs) è la nostra risposta a una sfida comune di Node.js: la pianificazione affidabile dei processi. Il pacchetto principale [`bree`](https://github.com/breejs/bree), con oltre 3.100 stelle su GitHub, fornisce un moderno scheduler di processi che utilizza i thread di lavoro di Node.js per prestazioni e affidabilità migliori.

> \[!NOTE]
> Bree è stata creata dopo aver contribuito alla manutenzione di [Ordine del giorno](https://github.com/agenda/agenda), applicando le lezioni apprese per creare un migliore pianificatore di lavori. I nostri contributi all'Agenda ci hanno aiutato a trovare modi per migliorare la pianificazione dei lavori.

Cosa differenzia Bree da altri programmi di pianificazione come Agenda:

* **Nessuna dipendenza esterna**: a differenza di Agenda, che necessita di MongoDB, Bree non richiede Redis o MongoDB per gestire lo stato dei job.
* **Thread di lavoro**: Bree utilizza thread di lavoro Node.js per i processi sandbox, offrendo un migliore isolamento e prestazioni migliori.
* **API semplice**: Bree offre un controllo dettagliato con semplicità, semplificando l'implementazione di esigenze di schedulazione complesse.
* **Supporto integrato**: funzionalità come ricaricamento graduale, cron job, date e orari a misura di utente sono incluse di default.

Bree è un componente fondamentale di [forwardemail.net](https://github.com/forwardemail/forwardemail.net) e gestisce attività critiche in background come l'elaborazione delle email, la pulizia e la manutenzione programmata. L'utilizzo di Bree in Forward Email dimostra il nostro impegno nell'utilizzare i nostri strumenti in produzione, garantendo elevati standard di affidabilità.

Utilizziamo e apprezziamo anche altri ottimi pacchetti di thread di lavoro come [piscina](https://github.com/piscinajs/piscina) e client HTTP come [undici](https://github.com/nodejs/undici). Piscina, come Bree, utilizza i thread di lavoro di Node.js per un'elaborazione efficiente delle attività. Ringraziamo [Matteo Collina](https://github.com/mcollina), che gestisce sia undici che piscina, per il suo importante contributo a Node.js. Matteo fa parte del Comitato Direttivo Tecnico di Node.js e ha notevolmente migliorato le funzionalità dei client HTTP in Node.js.

### Inoltra email: Infrastruttura email open source {#forward-email-open-source-email-infrastructure}

Il nostro progetto più ambizioso è [Inoltra e-mail](https://github.com/forwardemail), un servizio di posta elettronica open source che offre servizi di inoltro, archiviazione e API. Il repository principale vanta oltre 1.100 stelle GitHub\[^4], a dimostrazione dell'apprezzamento della community per questa alternativa ai servizi di posta elettronica proprietari.

Il pacchetto [`preview-email`](https://github.com/forwardemail/preview-email) di questa organizzazione, con oltre 2,5 milioni di download in due mesi, è diventato uno strumento essenziale per gli sviluppatori che lavorano con i modelli di email. Offrendo un modo semplice per visualizzare in anteprima le email durante lo sviluppo, risolve un problema comune nella creazione di applicazioni abilitate per la posta elettronica.

### Lad: Utilità e strumenti essenziali di Koa {#lad-essential-koa-utilities-and-tools}

[Organizzazione dei ragazzi](https://github.com/ladjs) fornisce una raccolta di utilità e strumenti essenziali, principalmente focalizzati sul miglioramento dell'ecosistema del framework Koa. Questi pacchetti risolvono le sfide comuni dello sviluppo web e sono progettati per funzionare perfettamente insieme, pur rimanendo utili in modo indipendente.

#### koa-better-error-handler: Gestione degli errori migliorata per Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) offre una soluzione migliore per la gestione degli errori nelle applicazioni Koa. Con oltre 50 stelle su GitHub, questo pacchetto permette a `ctx.throw` di produrre messaggi di errore intuitivi, risolvendo al contempo diverse limitazioni del gestore degli errori integrato in Koa:

* Rileva e gestisce correttamente gli errori DNS di Node.js, gli errori di Mongoose e gli errori di Redis
* Utilizza [Boom](https://github.com/hapijs/boom) per creare risposte di errore coerenti e ben formattate
* Mantiene le intestazioni (a differenza del gestore integrato di Koa)
* Mantiene i codici di stato appropriati anziché utilizzare il valore predefinito 500
* Supporta i messaggi flash e la conservazione della sessione
* Fornisce elenchi di errori HTML per gli errori di convalida
* Supporta diversi tipi di risposta (HTML, JSON e testo normale)

Questo pacchetto è particolarmente utile se utilizzato insieme a [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) per una gestione completa degli errori nelle applicazioni Koa.

#### passaporto: Autenticazione per Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) estende il popolare middleware di autenticazione Passport.js con miglioramenti specifici per le applicazioni web moderne. Questo pacchetto supporta diverse strategie di autenticazione pronte all'uso:

* Autenticazione locale con email
* Accedi con Apple
* Autenticazione GitHub
* Autenticazione Google
* Autenticazione con password monouso (OTP)

Il pacchetto è altamente personalizzabile e consente agli sviluppatori di adattare i nomi dei campi e le frasi in base ai requisiti della propria applicazione. È progettato per integrarsi perfettamente con Mongoose per la gestione degli utenti, rendendolo una soluzione ideale per le applicazioni basate su Koa che necessitano di un'autenticazione robusta.

#### elegante: arresto elegante dell'applicazione {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) risolve la sfida critica di chiudere correttamente le applicazioni Node.js. Con oltre 70 stelle su GitHub, questo pacchetto garantisce che l'applicazione possa essere chiusa correttamente senza perdere dati o lasciare connessioni in sospeso. Le funzionalità principali includono:

* Supporto per la chiusura graduale dei server HTTP (Express/Koa/Fastify)
* Chiusura pulita delle connessioni al database (MongoDB/Mongoose)
* Chiusura corretta dei client Redis
* Gestione degli scheduler di Bree
* Supporto per gestori di arresto personalizzati
* Impostazioni di timeout configurabili
* Integrazione con i sistemi di logging

Questo pacchetto è essenziale per le applicazioni di produzione in cui arresti imprevisti potrebbero causare la perdita o il danneggiamento dei dati. Implementando procedure di arresto appropriate, `@ladjs/graceful` contribuisce a garantire l'affidabilità e la stabilità dell'applicazione.

### Upptime: monitoraggio del tempo di attività open source {#upptime-open-source-uptime-monitoring}

[Organizzazione Upptime](https://github.com/upptime) rappresenta il nostro impegno per un monitoraggio trasparente e open source. Il repository principale [`upptime`](https://github.com/upptime/upptime) vanta oltre 13.000 stelle GitHub, il che lo rende uno dei progetti più popolari a cui contribuiamo. Upptime offre un monitor di uptime e una pagina di stato basati su GitHub che funziona completamente senza un server.

Utilizziamo Upptime per la nostra pagina di stato in <https://status.forwardemail.net> con il codice sorgente disponibile in <https://github.com/forwardemail/status.forwardemail.net>.

Ciò che rende speciale Upptime è la sua architettura:

* **100% Open Source**: Ogni componente è completamente open source e personalizzabile.
* **Powered by GitHub**: Sfrutta le azioni, gli issue e le pagine di GitHub per una soluzione di monitoraggio serverless.
* **Nessun server richiesto**: A differenza degli strumenti di monitoraggio tradizionali, Upptime non richiede l'esecuzione o la manutenzione di un server.
* **Pagina di stato automatica**: Genera una splendida pagina di stato che può essere ospitata su GitHub Pages.
* **Notifiche potenti**: Si integra con vari canali di notifica, tra cui email, SMS e Slack.

Per migliorare l'esperienza dei nostri utenti, abbiamo integrato [@octokit/core](https://github.com/octokit/core.js/) nel codice di forwardemail.net per visualizzare aggiornamenti di stato e segnalazioni di incidenti in tempo reale direttamente sul nostro sito web. Questa integrazione offre ai nostri utenti una trasparenza assoluta in caso di problemi con l'intero stack (sito web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, ecc.) con notifiche istantanee, modifiche alle icone dei badge, colori di avviso e altro ancora.

La libreria @octokit/core ci consente di recuperare dati in tempo reale dal nostro repository GitHub Upptime, elaborarli e visualizzarli in modo intuitivo. In caso di interruzione o calo delle prestazioni di un servizio, gli utenti vengono immediatamente avvisati tramite indicatori visivi, senza dover uscire dall'applicazione principale. Questa perfetta integrazione garantisce che i nostri utenti dispongano sempre di informazioni aggiornate sullo stato del nostro sistema, migliorando la trasparenza e la fiducia.

Upptime è stato adottato da centinaia di organizzazioni alla ricerca di un modo trasparente e affidabile per monitorare i propri servizi e comunicarne lo stato agli utenti. Il successo del progetto dimostra la potenza di creare strumenti che sfruttano l'infrastruttura esistente (in questo caso, GitHub) per risolvere problemi comuni in modi nuovi.

## I nostri contributi all'ecosistema di posta elettronica in avanti {#our-contributions-to-the-forward-email-ecosystem}

I nostri pacchetti open source sono utilizzati da sviluppatori in tutto il mondo e costituiscono anche la base del nostro servizio Forward Email. Questo duplice ruolo, sia come creatori che come utenti di questi strumenti, ci offre una prospettiva unica sulla loro applicazione pratica e ci spinge a un miglioramento continuo.

### Dai pacchetti alla produzione {#from-packages-to-production}

Il passaggio dai singoli pacchetti a un sistema di produzione coeso richiede un'attenta integrazione ed estensione. Per Forward Email, questo processo include:

* **Estensioni personalizzate**: Sviluppo di estensioni specifiche per le email avanzate per i nostri pacchetti open source, che rispondano ai nostri requisiti specifici.
* **Modelli di integrazione**: Sviluppo di modelli per l'interazione di questi pacchetti in un ambiente di produzione.
* **Ottimizzazioni delle prestazioni**: Identificazione e risoluzione dei colli di bottiglia nelle prestazioni che emergono solo su larga scala.
* **Rafforzamento della sicurezza**: Aggiunta di livelli di sicurezza aggiuntivi specifici per la gestione delle email e la protezione dei dati degli utenti.

Questo lavoro rappresenta migliaia di ore di sviluppo che vanno oltre i pacchetti principali, dando vita a un servizio di posta elettronica solido e sicuro che sfrutta il meglio dei nostri contributi open source.

### Il ciclo di feedback {#the-feedback-loop}

Forse l'aspetto più prezioso dell'utilizzo dei nostri pacchetti in produzione è il ciclo di feedback che si crea. Quando riscontriamo limitazioni o casi limite in Forward Email, non ci limitiamo ad applicare patch localmente, ma miglioriamo i pacchetti sottostanti, a vantaggio sia del nostro servizio che della community più ampia.

Questo approccio ha portato a numerosi miglioramenti:

* **Arresto graduale di Bree**: la necessità di Forward Email di implementazioni senza tempi di inattività ha portato a funzionalità di arresto graduale migliorate in Bree.
* **Riconoscimento di pattern di Spam Scanner**: i pattern di spam reali rilevati in Forward Email hanno influenzato gli algoritmi di rilevamento di Spam Scanner.
* **Ottimizzazioni delle prestazioni di Cabin**: la registrazione di volumi elevati in produzione ha rivelato opportunità di ottimizzazione in Cabin a vantaggio di tutti gli utenti.

Mantenendo questo circolo virtuoso tra il nostro lavoro open source e il servizio di produzione, garantiamo che i nostri pacchetti rimangano soluzioni pratiche e testate sul campo piuttosto che implementazioni teoriche.

## I principi fondamentali di Forward Email: una base per l'eccellenza {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email è progettato secondo una serie di principi fondamentali che guidano tutte le nostre decisioni di sviluppo. Questi principi, dettagliati nel nostro [sito web](/blog/docs/best-quantum-safe-encrypted-email-service#principles), garantiscono che il nostro servizio rimanga facile da usare per gli sviluppatori, sicuro e attento alla privacy degli utenti.

### Sempre adatto agli sviluppatori, incentrato sulla sicurezza e trasparente {#always-developer-friendly-security-focused-and-transparent}

Il nostro principio fondamentale è creare software che sia facile da usare per gli sviluppatori, mantenendo al contempo i più elevati standard di sicurezza e privacy. Crediamo che l'eccellenza tecnica non debba mai andare a discapito dell'usabilità e che la trasparenza crei fiducia nella nostra community.

Questo principio si manifesta nella nostra documentazione dettagliata, nei chiari messaggi di errore e nella comunicazione aperta su successi e difficoltà. Rendendo open source l'intero codice sorgente, incoraggiamo l'analisi e la collaborazione, rafforzando sia il nostro software che l'ecosistema più ampio.

### Aderenza ai principi di sviluppo software collaudati {#adherence-to-time-tested-software-development-principles}

Seguiamo diversi principi consolidati nello sviluppo software che hanno dimostrato il loro valore nel corso dei decenni:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separare le problematiche attraverso il modello Model-View-Controller
* **[Filosofia Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Creare componenti modulari che svolgono bene una sola funzione
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Mantenere la semplicità e la chiarezza
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Non ripeterti, promuovere il riutilizzo del codice
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Non ne avrai bisogno, evitare un'ottimizzazione prematura
* **[Dodici Fattori](https://12factor.net/)**: Seguire le best practice per creare applicazioni moderne e scalabili
* **[Il rasoio di Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Scegliere la soluzione più semplice che soddisfi i requisiti
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Utilizzare ampiamente i nostri prodotti

Questi principi non sono solo concetti teorici, ma sono parte integrante delle nostre pratiche di sviluppo quotidiane. Ad esempio, la nostra adesione alla filosofia Unix è evidente nel modo in cui abbiamo strutturato i nostri pacchetti npm: piccoli moduli mirati che possono essere combinati per risolvere problemi complessi.

### Prende di mira lo sviluppatore combattivo e autonomo {#targeting-the-scrappy-bootstrapped-developer}

Ci rivolgiamo specificamente allo sviluppatore intraprendente, autonomo e [ramen redditizio](https://www.paulgraham.com/ramenprofitable.html). Questa attenzione plasma tutto, dal nostro modello di prezzo alle nostre decisioni tecniche. Comprendiamo le sfide che comporta creare prodotti con risorse limitate perché ci siamo passati anche noi.

Questo principio è particolarmente importante nel nostro approccio all'open source. Creiamo e gestiamo pacchetti che risolvono problemi reali per sviluppatori senza budget aziendali, rendendo strumenti potenti accessibili a tutti, indipendentemente dalle proprie risorse.

### Principi in pratica: il codice di base delle e-mail di inoltro {#principles-in-practice-the-forward-email-codebase}

Questi principi sono chiaramente visibili nel codice di Forward Email. Il nostro file package.json rivela un'attenta selezione di dipendenze, ciascuna scelta in linea con i nostri valori fondamentali:

* Pacchetti incentrati sulla sicurezza come `mailauth` per l'autenticazione e-mail
* Strumenti di facile utilizzo per gli sviluppatori come `preview-email` per un debug più semplice
* Componenti modulari come le varie utility `p-*` di Sindre Sorhus

Seguendo costantemente questi principi nel tempo, abbiamo creato un servizio di cui gli sviluppatori possono fidarsi per la loro infrastruttura di posta elettronica: sicuro, affidabile e in linea con i valori della community open source.

### Privacy by Design {#privacy-by-design}

Per Forward Email la privacy non è un ripensamento o una caratteristica di marketing, ma un principio di progettazione fondamentale che informa ogni aspetto del nostro servizio e del nostro codice:

* **Crittografia ad accesso zero**: abbiamo implementato sistemi che ci rendono tecnicamente impossibile leggere le email degli utenti.
* **Raccolta dati minima**: raccogliamo solo i dati necessari per fornire il nostro servizio, niente di più.
* **Politiche trasparenti**: la nostra informativa sulla privacy è redatta in un linguaggio chiaro e comprensibile, privo di gergo legale.
* **Verifica open source**: il nostro codice sorgente open source consente ai ricercatori di sicurezza di verificare le nostre dichiarazioni sulla privacy.

Questo impegno si estende ai nostri pacchetti open source, progettati con le migliori pratiche di sicurezza e privacy integrate fin dalle fondamenta.

### Open Source sostenibile {#sustainable-open-source}

Crediamo che il software open source abbia bisogno di modelli sostenibili per prosperare a lungo termine. Il nostro approccio include:

* **Supporto Commerciale**: Offriamo supporto e servizi premium per i nostri strumenti open source.
* **Licenze Bilanciate**: Utilizzo di licenze che proteggono sia le libertà degli utenti che la sostenibilità del progetto.
* **Coinvolgimento della Community**: Coinvolgimento attivo dei collaboratori per costruire una community di supporto.
* **Roadmap Trasparenti**: Condivisione dei nostri piani di sviluppo per consentire agli utenti di pianificare di conseguenza.

Concentrandoci sulla sostenibilità, garantiamo che i nostri contributi open source possano continuare a crescere e migliorare nel tempo anziché cadere nell'oblio.

## I numeri non mentono: le nostre incredibili statistiche di download di npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Quando parliamo dell'impatto del software open source, le statistiche sui download forniscono una misura tangibile dell'adozione e della fiducia. Molti dei pacchetti che aiutiamo a gestire hanno raggiunto una scala che pochi progetti open source riescono a raggiungere, con download complessivi che ammontano a miliardi.

![I migliori pacchetti npm per download](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Sebbene siamo orgogliosi di contribuire alla manutenzione di diversi pacchetti molto scaricati nell'ecosistema JavaScript, vogliamo riconoscere che molti di questi pacchetti sono stati originariamente creati da altri sviluppatori di talento. Pacchetti come superagent e supertest sono stati originariamente creati da TJ Holowaychuk, il cui prolifico contributo all'open source è stato determinante nel plasmare l'ecosistema Node.js.

### Una panoramica del nostro impatto {#a-birds-eye-view-of-our-impact}

Solo nel periodo di due mesi da febbraio a marzo 2025, i principali pacchetti a cui contribuiamo e che aiutiamo a mantenere hanno registrato numeri di download sbalorditivi:

* **[superagente](https://www.npmjs.com/package/superagent)**: 84.575.829 download\[^7] (creato originariamente da TJ Holowaychuk)
* **[super test](https://www.npmjs.com/package/supertest)**: 76.432.591 download\[^8] (creato originariamente da TJ Holowaychuk)
* **[Anche](https://www.npmjs.com/package/koa)**: 28.539.295 download\[^34] (creato originariamente da TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 download\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 download\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 download\[^37]
* **[anteprima-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 download\[^9]
* **[cabina](https://www.npmjs.com/package/cabin)**: 1.800.000 download\[^10]
* **[@breejs/più tardi](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 download\[^38]
* **[modelli di email](https://www.npmjs.com/package/email-templates)**: 1.128.139 download\[^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 download\[^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 download\[^11]
* **__PROTECTED_LINK_259__2**: 894.666 download\[^41]
* **__PROTECTED_LINK_259__3**: 839.585 download\[^42]
* **__PROTECTED_LINK_259__4**: 145.000 download\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 download\[^30]

> \[!NOTE]
> Diversi altri pacchetti che contribuiamo a mantenere ma che non abbiamo creato hanno un numero di download ancora più elevato, tra cui `form-data` (oltre 738 milioni di download), `toidentifier` (oltre 309 milioni di download), `stackframe` (oltre 116 milioni di download) e `error-stack-parser` (oltre 113 milioni di download). Siamo onorati di contribuire a questi pacchetti nel rispetto del lavoro dei loro autori originali.

Questi non sono solo numeri impressionanti: rappresentano sviluppatori reali che risolvono problemi reali con il codice di cui contribuiamo alla manutenzione. Ogni download è un esempio di come questi pacchetti abbiano aiutato qualcuno a creare qualcosa di significativo, da progetti amatoriali ad applicazioni aziendali utilizzate da milioni di persone.

![Distribuzione delle categorie dei pacchetti](/img/art/category_pie_chart.svg)

### Impatto giornaliero su larga scala {#daily-impact-at-scale}

I modelli di download giornalieri rivelano un utilizzo costante e ad alto volume, con picchi che raggiungono milioni di download al giorno\[^13]. Questa costanza testimonia la stabilità e l'affidabilità di questi pacchetti: gli sviluppatori non si limitano a provarli, ma li integrano nei loro flussi di lavoro principali e ne fanno affidamento giorno dopo giorno.

I modelli di download settimanali mostrano numeri ancora più impressionanti, attestandosi costantemente intorno alle decine di milioni di download a settimana\[^14]. Ciò rappresenta un impatto enorme sull'ecosistema JavaScript, con questi pacchetti in esecuzione in ambienti di produzione in tutto il mondo.

### Oltre i numeri grezzi {#beyond-the-raw-numbers}

Sebbene le statistiche di download siano impressionanti di per sé, raccontano una storia più profonda sulla fiducia che la community ripone in questi pacchetti. Mantenere pacchetti di questa portata richiede un impegno costante per:

* **Compatibilità con le versioni precedenti**: le modifiche devono essere attentamente valutate per evitare di compromettere le implementazioni esistenti.
* **Sicurezza**: con milioni di applicazioni che dipendono da questi pacchetti, le vulnerabilità di sicurezza potrebbero avere conseguenze di vasta portata.
* **Prestazioni**: a questa scala, anche piccoli miglioramenti delle prestazioni possono comportare significativi vantaggi complessivi.
* **Documentazione**: una documentazione chiara e completa è essenziale per i pacchetti utilizzati da sviluppatori di tutti i livelli di esperienza.

La crescita costante nel tempo del numero di download riflette il successo nel rispettare questi impegni, creando fiducia nella comunità degli sviluppatori attraverso pacchetti affidabili e ben gestiti.

## Supportare l'ecosistema: le nostre sponsorizzazioni open source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> La sostenibilità dell'open source non riguarda solo il contributo al codice, ma anche il supporto agli sviluppatori che gestiscono le infrastrutture critiche.

Oltre al nostro contributo diretto all'ecosistema JavaScript, siamo orgogliosi di sponsorizzare importanti contributori di Node.js, il cui lavoro costituisce la base di molte applicazioni moderne. Le nostre sponsorizzazioni includono:

### Andris Reinman: pioniere dell'infrastruttura di posta elettronica {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) è il creatore di [Nodemailer](https://github.com/nodemailer/nodemailer), la libreria di invio email più popolare per Node.js, con oltre 14 milioni di download settimanali\[^15]. Il suo lavoro si estende ad altri componenti critici dell'infrastruttura email come [Server SMTP](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) e [Anatra selvatica](https://github.com/nodemailer/wildduck).

La nostra sponsorizzazione contribuisce a garantire la manutenzione e lo sviluppo continui di questi strumenti essenziali che supportano la comunicazione via e-mail per innumerevoli applicazioni Node.js, incluso il nostro servizio Forward Email.

### Sindre Sorhus: mente geniale del pacchetto di utilità {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) è uno dei più prolifici contributori open source nell'ecosistema JavaScript, con oltre 1.000 pacchetti npm a suo nome. Le sue utility come [mappa p](https://github.com/sindresorhus/p-map), [p-riprova](https://github.com/sindresorhus/p-retry) e [è-flusso](https://github.com/sindresorhus/is-stream) sono componenti fondamentali utilizzati in tutto l'ecosistema Node.js.

Sponsorizzando il lavoro di Sindre, contribuiamo a sostenere lo sviluppo di queste utilità fondamentali che rendono lo sviluppo JavaScript più efficiente e affidabile.

Queste sponsorizzazioni riflettono il nostro impegno nei confronti dell'ecosistema open source più ampio. Riconosciamo che il nostro successo si fonda sulle fondamenta gettate da questi e altri contributori e ci impegniamo a garantire la sostenibilità dell'intero ecosistema.

## Scoprire le vulnerabilità di sicurezza nell'ecosistema JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Il nostro impegno per l'open source va oltre lo sviluppo di funzionalità, includendo l'identificazione e la risoluzione di vulnerabilità di sicurezza che potrebbero avere un impatto su milioni di sviluppatori. Molti dei nostri contributi più significativi all'ecosistema JavaScript hanno riguardato la sicurezza.

### Il salvataggio del Koa-Router {#the-koa-router-rescue}

Nel febbraio 2019, Nick ha identificato un problema critico nella manutenzione del popolare pacchetto koa-router. Con il codice [riportato su Hacker News](https://news.ycombinator.com/item?id=19156707), il pacchetto era stato abbandonato dal suo manutentore originale, lasciando vulnerabilità di sicurezza irrisolte e la community senza aggiornamenti.

> \[!WARNING]
> I pacchetti abbandonati con vulnerabilità di sicurezza rappresentano rischi significativi per l'intero ecosistema, soprattutto quando vengono scaricati milioni di volte alla settimana.

In risposta, Nick ha creato [@koa/router](https://github.com/koajs/router) e ha contribuito ad avvisare la comunità della situazione. Da allora, si occupa della manutenzione di questo pacchetto fondamentale, garantendo agli utenti di Koa una soluzione di routing sicura e ben gestita.

### Risoluzione delle vulnerabilità ReDoS {#addressing-redos-vulnerabilities}

Nel 2020, Nick ha identificato e risolto una vulnerabilità critica [Negazione del servizio tramite espressione regolare (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) nel pacchetto `url-regex`, ampiamente utilizzato. Questa vulnerabilità ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) poteva consentire agli aggressori di causare un diniego di servizio fornendo input appositamente creati che causavano un backtracking catastrofico nell'espressione regolare.

Invece di limitarsi ad applicare una patch al pacchetto esistente, Nick ha creato [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), un'implementazione completamente riscritta che risolve la vulnerabilità mantenendo la compatibilità con l'API originale. Ha anche pubblicato un [post di blog completo](/blog/docs/url-regex-javascript-node-js) che spiega la vulnerabilità e come mitigarla.

Questo lavoro illustra il nostro approccio alla sicurezza: non limitarci a risolvere i problemi, ma anche istruire la comunità e fornire valide alternative che prevengano il ripetersi di problemi simili in futuro.

### Promozione della sicurezza di Node.js e Chromium {#advocating-for-nodejs-and-chromium-security}

Nick è stato anche attivo nel promuovere miglioramenti della sicurezza nell'ecosistema più ampio. Nell'agosto 2020, ha identificato un problema di sicurezza significativo in Node.js relativo alla gestione delle intestazioni HTTP, segnalato in [Il registro](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Questo problema, causato da una patch di Chromium, potrebbe potenzialmente consentire agli aggressori di aggirare le misure di sicurezza. Il supporto di Nick ha contribuito a garantire che il problema venisse risolto tempestivamente, proteggendo milioni di applicazioni Node.js da potenziali attacchi.

### Protezione dell'infrastruttura npm {#securing-npm-infrastructure}

Più tardi, nello stesso mese, Nick identificò un altro problema di sicurezza critico, questa volta nell'infrastruttura email di npm. Come riportato in [Il registro](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm non implementava correttamente i protocolli di autenticazione email DMARC, SPF e DKIM, consentendo potenzialmente agli aggressori di inviare email di phishing che sembravano provenire da npm.

Il report di Nick ha portato a miglioramenti nella sicurezza della posta elettronica di npm, proteggendo milioni di sviluppatori che si affidano a npm per la gestione dei pacchetti da potenziali attacchi di phishing.

## I nostri contributi all'ecosistema di posta elettronica in avanti {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email si basa su diversi progetti open source critici, tra cui Nodemailer, WildDuck e mailauth. Il nostro team ha contribuito in modo significativo a questi progetti, contribuendo a identificare e risolvere problemi significativi che incidono sulla consegna e sulla sicurezza delle email.

### Miglioramento delle funzionalità principali di Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) è la spina dorsale dell'invio di email in Node.js e i nostri contributi hanno contribuito a renderlo più robusto:

* **Miglioramenti del server SMTP**: abbiamo risolto bug di analisi, problemi di gestione dello streaming e problemi di configurazione TLS nel componente server SMTP\[^16]\[^17].
* **Miglioramenti del parser di posta elettronica**: abbiamo risolto errori di decodifica della sequenza di caratteri e problemi del parser che potevano causare errori di elaborazione delle email\[^18]\[^19].

Questi contributi garantiscono che Nodemailer rimanga una base affidabile per l'elaborazione delle email nelle applicazioni Node.js, tra cui Forward Email.

### Autenticazione e-mail avanzata con Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) fornisce funzionalità di autenticazione e-mail essenziali e i nostri contributi ne hanno migliorato significativamente le capacità:

* **Miglioramenti alla verifica DKIM**: Abbiamo scoperto e segnalato che X/Twitter presentava problemi con la cache DNS che causavano errori DKIM per i messaggi in uscita, segnalandolo su Hacker One\[^20].
* **Miglioramenti DMARC e ARC**: Abbiamo risolto problemi con la verifica DMARC e ARC che potevano portare a risultati di autenticazione errati\[^21]\[^22].
* **Ottimizzazioni delle prestazioni**: Abbiamo apportato ottimizzazioni che migliorano le prestazioni dei processi di autenticazione email\[^23]\[^24]\[^25]\[^26].

Questi miglioramenti contribuiscono a garantire che l'autenticazione della posta elettronica sia accurata e affidabile, proteggendo gli utenti da attacchi di phishing e spoofing.

### Miglioramenti chiave del tempo di caricamento {#key-upptime-enhancements}

I nostri contributi a Upptime includono:

* **Monitoraggio dei certificati SSL**: abbiamo aggiunto una funzionalità per monitorare la scadenza dei certificati SSL, prevenendo tempi di inattività imprevisti dovuti a certificati scaduti\[^27].
* **Supporto per più numeri SMS**: abbiamo implementato il supporto per avvisare più membri del team tramite SMS in caso di incidenti, migliorando i tempi di risposta\[^28].
* **Correzioni per i controlli IPv6**: abbiamo risolto i problemi con i controlli di connettività IPv6, garantendo un monitoraggio più accurato negli ambienti di rete moderni\[^29].
* **Supporto per la modalità scura/chiara**: abbiamo aggiunto il supporto per i temi per migliorare l'esperienza utente delle pagine di stato\[^31].
* **Miglior supporto TCP-Ping**: abbiamo migliorato la funzionalità TCP-Ping per fornire test di connessione più affidabili\[^32].

Questi miglioramenti non solo migliorano il monitoraggio dello stato di Forward Email, ma sono disponibili all'intera community di utenti Upptime, a dimostrazione del nostro impegno nel migliorare gli strumenti da cui dipendiamo.

## Il collante che tiene tutto insieme: codice personalizzato su larga scala {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Sebbene i nostri pacchetti npm e i contributi ai progetti esistenti siano significativi, è il codice personalizzato che integra questi componenti a dimostrare davvero la nostra competenza tecnica. Il codice di Forward Email rappresenta un decennio di sforzi di sviluppo, risalenti al 2017, quando il progetto è nato come [inoltro-e-mail-gratuito](https://github.com/forwardemail/free-email-forwarding), prima di essere incorporato in un monorepo.

### Uno sforzo di sviluppo enorme {#a-massive-development-effort}

La portata di questo codice di integrazione personalizzato è impressionante:

* **Contributi totali**: oltre 3.217 commit
* **Dimensioni del codice sorgente**: oltre 421.545 righe di codice tra file JavaScript, Pug, CSS e JSON\[^33]

Questo rappresenta migliaia di ore di sviluppo, sessioni di debug e ottimizzazioni delle prestazioni. È l'ingrediente segreto che trasforma i singoli pacchetti in un servizio completo e affidabile, utilizzato quotidianamente da migliaia di clienti.

### Integrazione delle dipendenze principali {#core-dependencies-integration}

Il codice di base di Forward Email integra numerose dipendenze in un insieme armonioso:

* **Elaborazione email**: integra Nodemailer per l'invio, il server SMTP per la ricezione e Mailparser per l'analisi
* **Autenticazione**: utilizza Mailauth per la verifica DKIM, SPF, DMARC e ARC
* **Risoluzione DNS**: sfrutta Tangerine per DNS-over-HTTPS con caching globale
* **Connessione MX**: utilizza mx-connect con integrazione di Tangerine per connessioni affidabili al server di posta
* **Pianificazione dei processi**: utilizza Bree per un'elaborazione affidabile delle attività in background con thread di lavoro
* **Templating**: utilizza modelli di email per riutilizzare i fogli di stile del sito web nelle comunicazioni con i clienti
* **Archiviazione email**: implementa caselle di posta SQLite crittografate individualmente utilizzando la crittografia better-sqlite3-multiple-ciphers con crittografia ChaCha20-Poly1305 per una privacy sicura dal punto di vista quantistico, garantendo il completo isolamento tra gli utenti e l'accesso esclusivo alla propria casella di posta.

Ognuna di queste integrazioni richiede un'attenta valutazione dei casi limite, delle implicazioni in termini di prestazioni e delle problematiche di sicurezza. Il risultato è un sistema robusto che gestisce milioni di transazioni email in modo affidabile. La nostra implementazione SQLite sfrutta anche msgpackr per un'efficiente serializzazione binaria e WebSocket (tramite ws) per aggiornamenti di stato in tempo reale su tutta la nostra infrastruttura.

### Infrastruttura DNS con Tangerine e mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Una componente fondamentale dell'infrastruttura di Forward Email è il nostro sistema di risoluzione DNS, basato su due pacchetti chiave:

* **[mandarino](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: La nostra implementazione DNS-over-HTTPS di Node.js fornisce una sostituzione immediata per il risolutore DNS standard, con nuovi tentativi integrati, timeout, rotazione intelligente del server e supporto per la memorizzazione nella cache.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Questo pacchetto stabilisce connessioni TCP ai server MX, prendendo un dominio di destinazione o un indirizzo email, risolvendo i server MX appropriati e connettendosi ad essi in ordine di priorità.

Abbiamo integrato Tangerine con mx-connect tramite [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), garantendo il DNS a livello applicativo su richieste HTTP tramite Forward Email. Ciò fornisce caching globale per DNS su larga scala con coerenza 1:1 in qualsiasi regione, app o processo, fondamentale per un recapito email affidabile in un sistema distribuito.

## Impatto aziendale: dall'open source alle soluzioni mission-critical {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Il culmine del nostro percorso decennale nello sviluppo open source ha permesso a Forward Email di servire non solo singoli sviluppatori, ma anche grandi aziende e istituti scolastici che costituiscono la spina dorsale del movimento open source stesso.

### Casi di studio in infrastrutture email mission-critical {#case-studies-in-mission-critical-email-infrastructure}

Il nostro impegno per l'affidabilità, la privacy e i principi dell'open source ha reso Forward Email la scelta di fiducia per le organizzazioni con requisiti email esigenti:

* **Istituti scolastici**: Come dettagliato nel nostro [caso di studio sull'inoltro email per ex studenti]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study); le principali università si affidano alla nostra infrastruttura per mantenere connessioni durature con centinaia di migliaia di ex studenti attraverso affidabili servizi di inoltro e-mail.

* **Soluzioni Linux aziendali**: [Caso di studio aziendale sulla posta elettronica Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) dimostra come il nostro approccio open source si allinei perfettamente alle esigenze dei provider Linux aziendali, offrendo loro la trasparenza e il controllo di cui hanno bisogno.

* **Open Source Foundations**: Forse la cosa più gratificante è la nostra partnership con la Linux Foundation, come documentato in [Caso di studio aziendale sulla posta elettronica della Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), dove il nostro servizio alimenta la comunicazione per l'organizzazione stessa che gestisce lo sviluppo di Linux.

C'è una meravigliosa simmetria nel modo in cui i nostri pacchetti open source, mantenuti con cura per molti anni, ci hanno permesso di creare un servizio di posta elettronica che ora supporta le stesse comunità e organizzazioni che promuovono il software open source. Questo percorso completo, dal contributo di singoli pacchetti al potenziamento di un'infrastruttura di posta elettronica di livello aziendale per i leader dell'open source, rappresenta la convalida definitiva del nostro approccio allo sviluppo software.

## Un decennio di Open Source: uno sguardo al futuro {#a-decade-of-open-source-looking-forward}

Ripensando a un decennio di contributi open source e guardando al futuro, siamo pieni di gratitudine per la comunità che ha supportato il nostro lavoro e di entusiasmo per ciò che ci aspetta.

Il nostro percorso da singoli contributori di pacchetti a responsabili della manutenzione di un'infrastruttura di posta elettronica completa, utilizzata da grandi aziende e fondazioni open source, è stato straordinario. È una testimonianza della potenza dello sviluppo open source e dell'impatto che un software ben progettato e ben gestito può avere sull'ecosistema più ampio.

Nei prossimi anni ci impegniamo a:

* **Continuare a mantenere e migliorare i nostri pacchetti esistenti**, garantendo che rimangano strumenti affidabili per gli sviluppatori di tutto il mondo.
* **Espandere il nostro contributo a progetti infrastrutturali critici**, in particolare nei settori della posta elettronica e della sicurezza.
* **Migliorare le funzionalità di Forward Email**, mantenendo al contempo il nostro impegno per la privacy, la sicurezza e la trasparenza.
* **Supportare la prossima generazione di contributori open source** attraverso attività di mentoring, sponsorizzazione e coinvolgimento della community.

Crediamo che il futuro dello sviluppo software sia aperto, collaborativo e fondato sulla fiducia. Continuando a contribuire all'ecosistema JavaScript con pacchetti di alta qualità e incentrati sulla sicurezza, speriamo di contribuire, anche se in piccola parte, a costruire questo futuro.

Grazie a tutti coloro che hanno utilizzato i nostri pacchetti, contribuito ai nostri progetti, segnalato problemi o semplicemente diffuso informazioni sul nostro lavoro. Il vostro supporto ha reso possibile questo decennio di impatto e non vediamo l'ora di vedere cosa potremo realizzare insieme nei prossimi dieci anni.

\[^1]: statistiche di download di npm per cabin, aprile 2025
\[^2]: statistiche di download di npm per bson-objectid, febbraio-marzo 2025
\[^3]: statistiche di download di npm per url-regex-safe, aprile 2025
\[^4]: conteggio delle stelle di GitHub per forwardemail/forwardemail.net ad aprile 2025
\[^5]: statistiche di download di npm per preview-email, aprile 2025
\[^7]: statistiche di download di npm per superagent, febbraio-marzo 2025
\[^8]: statistiche di download di npm per supertest, febbraio-marzo 2025
\[^9]: statistiche di download di npm per preview-email, febbraio-marzo 2025
\[^10]: statistiche di download di npm per cabin, febbraio-marzo 2025
\[^11]: statistiche di download di npm per url-regex-safe, febbraio-marzo 2025
\[^12]: statistiche di download di npm per spamscanner, febbraio-marzo 2025
\[^13]: modelli di download giornalieri dalle statistiche di npm, aprile 2025
\[^14]: modelli di download settimanali dalle statistiche di npm, aprile 2025
\[^15]: statistiche di download di npm per nodemailer, aprile 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: In base ai problemi di GitHub nel repository Upptime
\[^28]: In base ai problemi di GitHub nel repository Upptime
\[^29]: In base ai problemi di GitHub nel repository Upptime
\[^30]: Statistiche di download di npm per bree, febbraio-marzo 2025
\[^31]: In base alle pull request di GitHub su Upptime
\[^32]: In base alle pull request di GitHub su Upptime
\[^34]: Statistiche di download di npm per koa, febbraio-marzo 2025
\[^35]: Statistiche di download di npm per @koa/router, febbraio-marzo 2025
\[^36]: statistiche di download di npm per koa-router, febbraio-marzo 2025
\[^37]: statistiche di download di npm per url-regex, febbraio-marzo 2025
\[^38]: statistiche di download di npm per @breejs/later, febbraio-marzo 2025
\[^39]: statistiche di download di npm per email-templates, febbraio-marzo 2025
\[^40]: statistiche di download di npm per get-paths, febbraio-marzo 2025
\[^41]: statistiche di download di npm per dotenv-parse-variables, febbraio-marzo 2025
\[^42]: statistiche di download di npm per @koa/multer, febbraio-marzo 2025