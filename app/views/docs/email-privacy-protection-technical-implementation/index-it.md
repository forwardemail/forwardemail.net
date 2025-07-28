# Come funziona l'inoltro delle email con Inoltra email: la guida definitiva {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img caricamento="pigro" src="/img/articles/email-privacy.webp" alt="" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [Che cosa è l'inoltro di posta elettronica](#what-is-email-forwarding)
* [Come funziona l'inoltro delle e-mail: la spiegazione tecnica](#how-email-forwarding-works-the-technical-explanation)
  * [Il processo di inoltro della posta elettronica](#the-email-forwarding-process)
  * [Il ruolo dell'SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Come funziona l'inoltro delle e-mail: la spiegazione semplice](#how-email-forwarding-works-the-simple-explanation)
* [Impostazione dell'inoltro e-mail con Inoltra e-mail](#setting-up-email-forwarding-with-forward-email)
  * [1. Registrati per un account](#1-sign-up-for-an-account)
  * [2. Aggiungi il tuo dominio](#2-add-your-domain)
  * [3. Configurare i record DNS](#3-configure-dns-records)
  * [4. Crea inoltri di posta elettronica](#4-create-email-forwards)
  * [5. Inizia a utilizzare i tuoi nuovi indirizzi email](#5-start-using-your-new-email-addresses)
* [Funzionalità avanzate di Inoltra e-mail](#advanced-features-of-forward-email)
  * [Indirizzi usa e getta](#disposable-addresses)
  * [Destinatari multipli e caratteri jolly](#multiple-recipients-and-wildcards)
  * [Integrazione "Invia posta come"](#send-mail-as-integration)
  * [Sicurezza resistente ai quanti](#quantum-resistant-security)
  * [Caselle di posta SQLite crittografate individualmente](#individually-encrypted-sqlite-mailboxes)
* [Perché scegliere Forward Email rispetto ai concorrenti](#why-choose-forward-email-over-competitors)
  * [1. 100% open source](#1-100-open-source)
  * [2. Incentrato sulla privacy](#2-privacy-focused)
  * [3. Nessun affidamento a terzi](#3-no-third-party-reliance)
  * [4. Prezzi convenienti](#4-cost-effective-pricing)
  * [5. Risorse illimitate](#5-unlimited-resources)
  * [6. Di fiducia per le principali organizzazioni](#6-trusted-by-major-organizations)
* [Casi di utilizzo comuni per l'inoltro di posta elettronica](#common-use-cases-for-email-forwarding)
  * [Per le aziende](#for-businesses)
  * [Per gli sviluppatori](#for-developers)
  * [Per gli individui attenti alla privacy](#for-privacy-conscious-individuals)
* [Best Practice per l'inoltro di posta elettronica](#best-practices-for-email-forwarding)
  * [1. Utilizzare indirizzi descrittivi](#1-use-descriptive-addresses)
  * [2. Implementare un'autenticazione corretta](#2-implement-proper-authentication)
  * [3. Rivedi regolarmente i tuoi forward](#3-regularly-review-your-forwards)
  * [4. Imposta "Invia posta come" per risposte senza interruzioni](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Utilizzare con cautela gli indirizzi catch-all](#5-use-catch-all-addresses-cautiously)
* [Conclusione](#conclusion)

## Prefazione {#foreword}

L'inoltro e-mail è uno strumento potente che può trasformare il modo in cui gestisci le tue comunicazioni online. Che tu sia un imprenditore che desidera creare indirizzi e-mail professionali con il tuo dominio personalizzato, un individuo attento alla privacy che desidera proteggere la propria e-mail principale o uno sviluppatore che necessita di una gestione flessibile delle e-mail, comprendere l'inoltro e-mail è essenziale nel panorama digitale odierno.

Noi di Forward Email abbiamo creato il servizio di inoltro email più sicuro, privato e flessibile al mondo. In questa guida completa, spiegheremo come funziona l'inoltro email (sia da una prospettiva tecnica che pratica), ti guideremo attraverso il nostro semplice processo di configurazione e sottolineeremo perché il nostro servizio si distingue dai concorrenti.

## Che cos'è l'inoltro e-mail {#what-is-email-forwarding}

L'inoltro email è un processo che reindirizza automaticamente le email inviate a un indirizzo email a un altro indirizzo di destinazione. Ad esempio, quando qualcuno invia un'email a <contatto@tuodominio.com>, il messaggio può essere inoltrato automaticamente al tuo account Gmail, Outlook o a qualsiasi altro account email.

Questa capacità apparentemente semplice offre potenti vantaggi:

* **Branding professionale**: utilizza indirizzi email con il tuo dominio personalizzato (<tu@tuodominio.com>) e gestisci tutto dalla tua casella di posta personale esistente
* **Protezione della privacy**: crea indirizzi usa e getta o specifici per uno scopo specifico che proteggono la tua casella di posta principale
* **Gestione semplificata**: consolida più indirizzi email in un'unica casella di posta
* **Flessibilità**: crea indirizzi illimitati per scopi diversi senza dover gestire più account

## Come funziona l'inoltro delle e-mail: spiegazione tecnica {#how-email-forwarding-works-the-technical-explanation}

Per chi fosse interessato ai dettagli tecnici, esploriamo cosa succede dietro le quinte quando un'e-mail viene inoltrata.

### Il processo di inoltro e-mail {#the-email-forwarding-process}

1. **Configurazione DNS**: Il processo inizia con i record DNS del tuo dominio. Quando imposti l'inoltro email, configuri i record MX (Mail Exchange) che indicano a Internet dove devono essere recapitate le email del tuo dominio. Questi record puntano ai nostri server email.

2. **Ricezione e-mail**: quando qualcuno invia un'e-mail al tuo indirizzo di dominio personalizzato (ad esempio, <tu@tuodominio.com>), il suo server di posta elettronica cerca i record MX del tuo dominio e recapita il messaggio ai nostri server.

3. **Elaborazione e autenticazione**: I nostri server ricevono l'email ed eseguono diverse funzioni critiche:
* Verificano l'autenticità del mittente utilizzando protocolli come SPF, DKIM e DMARC
* Scansione per contenuti dannosi
* Verificano che il destinatario rispetti le tue regole di inoltro

4. **Sender Rewriting**: È qui che avviene la magia. Implementiamo il Sender Rewriting Scheme (SRS) per modificare il percorso di ritorno dell'email. Questo è fondamentale perché molti provider di posta elettronica rifiutano le email inoltrate senza un'adeguata implementazione del SRS, poiché potrebbero sembrare falsificate.

5. **Inoltro**: l'e-mail viene quindi inviata all'indirizzo di destinazione con il contenuto originale intatto.

6. **Consegna**: l'e-mail arriva nella tua casella di posta, come se fosse stata inviata al tuo indirizzo di inoltro, mantenendo l'aspetto professionale del tuo dominio personalizzato.

### Il ruolo dell'SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

SRS merita un'attenzione speciale perché è essenziale per un inoltro email affidabile. Quando un'email viene inoltrata, l'indirizzo del mittente deve essere riscritto per garantire che l'email superi i controlli SPF nella destinazione finale.

Senza SRS, le email inoltrate spesso non superano la verifica SPF e vengono contrassegnate come spam o rifiutate del tutto. La nostra implementazione di SRS assicura che le email inoltrate vengano recapitate in modo affidabile, mantenendo le informazioni del mittente originale in modo trasparente per te.

## Come funziona l'inoltro delle e-mail: la spiegazione semplice {#how-email-forwarding-works-the-simple-explanation}

Se i dettagli tecnici ti sembrano troppo complessi, ecco un modo più semplice per comprendere l'inoltro delle e-mail:

Pensa all'inoltro di posta elettronica come all'inoltro di posta per posta cartacea. Quando ti trasferisci in una nuova casa, puoi chiedere al servizio postale di inoltrare tutta la posta dal tuo vecchio indirizzo a quello nuovo. L'inoltro di posta elettronica funziona in modo simile, ma per i messaggi digitali.

Con Inoltra Email:

1. Ci indichi quali indirizzi email desideri configurare sul tuo dominio (ad esempio <vendite@tuodominio.com> o <contatti@tuodominio.com>).
2. Ci indichi dove desideri che vengano recapitate queste email (ad esempio, il tuo account Gmail o Outlook).
3. Ci occupiamo di tutti i dettagli tecnici per garantire che le email inviate ai tuoi indirizzi personalizzati arrivino in modo sicuro nella casella di posta specificata.

È semplicissimo! Puoi usare indirizzi email professionali senza modificare il tuo attuale flusso di lavoro email.

## Impostazione dell'inoltro e-mail con Inoltra e-mail {#setting-up-email-forwarding-with-forward-email}

Uno dei maggiori vantaggi di Forward Email è la sua facilità di configurazione. Ecco una guida passo passo:

### 1. Registrati per un account {#1-sign-up-for-an-account}

Visita [forwardemail.net](https://forwardemail.net) e crea un account gratuito. La registrazione richiede meno di un minuto.

### 2. Aggiungi il tuo dominio {#2-add-your-domain}

Una volta effettuato l'accesso, aggiungi il dominio che vuoi usare per l'inoltro email. Se non possiedi già un dominio, dovrai prima acquistarne uno da un registrar di domini.

### 3. Configura i record DNS {#3-configure-dns-records}

Ti forniremo i record DNS esatti che devi aggiungere al tuo dominio. In genere, questo comporta:

* Aggiunta di record MX che puntano ai nostri server di posta elettronica
* Aggiunta di record TXT per verifica e sicurezza

La maggior parte dei registrar di domini ha un'interfaccia semplice per aggiungere questi record. Forniamo guide dettagliate per tutti i principali registrar di domini per rendere questo processo il più fluido possibile.

### 4. Crea inoltri e-mail {#4-create-email-forwards}

Dopo che i tuoi record DNS sono stati verificati (il che di solito richiede solo pochi minuti), puoi creare inoltri email. Specifica semplicemente:

* L'indirizzo email del tuo dominio (ad esempio, <contatto@tuodominio.com>)
* La destinazione a cui desideri inviare le email (ad esempio, il tuo indirizzo Gmail personale)

### 5. Inizia a utilizzare i tuoi nuovi indirizzi email {#5-start-using-your-new-email-addresses}

Ecco fatto! Le email inviate ai tuoi indirizzi di dominio personalizzati saranno ora inoltrate alla destinazione specificata. Puoi creare tutti gli inoltri di cui hai bisogno, inclusi gli indirizzi catch-all che inoltrano tutte le email inviate a qualsiasi indirizzo sul tuo dominio.

## Funzionalità avanzate di Inoltro e-mail {#advanced-features-of-forward-email}

Sebbene l'inoltro di posta elettronica di base sia di per sé potente, Forward Email offre diverse funzionalità avanzate che ci distinguono:

### Indirizzi usa e getta {#disposable-addresses}

Crea indirizzi email specifici o anonimi che inoltrano al tuo account principale. Puoi assegnare etichette a questi indirizzi e abilitarli o disabilitarli in qualsiasi momento per mantenere organizzata la tua posta in arrivo. Il tuo indirizzo email effettivo non viene mai esposto.

### Destinatari multipli e caratteri jolly {#multiple-recipients-and-wildcards}

Inoltra un singolo indirizzo a più destinatari, semplificando la condivisione di informazioni con un team. Puoi anche usare indirizzi jolly (inoltro catch-all) per ricevere e-mail inviate a qualsiasi indirizzo sul tuo dominio.

### Integrazione "Invia posta come" {#send-mail-as-integration}

Non dovrai mai più uscire dalla posta in arrivo per inviare email dal tuo dominio personalizzato. Invia e rispondi ai messaggi come se provenissero da <tu@tuodominio.com> direttamente dal tuo account Gmail o Outlook.

### Sicurezza resistente ai quanti {#quantum-resistant-security}

Siamo il primo e unico servizio di posta elettronica al mondo a utilizzare la crittografia resistente ai quanti, proteggendo le tue comunicazioni anche dalle minacce future più avanzate.

### Caselle di posta SQLite crittografate individualmente {#individually-encrypted-sqlite-mailboxes}

A differenza di altri provider che archiviano tutte le email degli utenti in database condivisi, noi utilizziamo caselle di posta SQLite crittografate individualmente per garantire una privacy e una sicurezza senza pari.

## Perché scegliere Inoltra e-mail rispetto ai concorrenti {#why-choose-forward-email-over-competitors}

Il mercato dell'inoltro delle e-mail conta diversi attori, ma Forward Email si distingue per diversi aspetti importanti:

### 1. 100% Open Source {#1-100-open-source}

Siamo l'unico servizio di inoltro e-mail completamente open source, incluso il nostro codice backend. Questa trasparenza crea fiducia e consente audit di sicurezza indipendenti. Altri servizi possono dichiarare di essere open source ma non rilasciano il loro codice backend.

### 2. Incentrato sulla privacy {#2-privacy-focused}

Abbiamo creato questo servizio perché hai diritto alla privacy. Utilizziamo una crittografia robusta con TLS, non memorizziamo log SMTP (tranne per errori e SMTP in uscita) e non scriviamo le tue email su un archivio su disco.

### 3. Nessun affidamento a terzi {#3-no-third-party-reliance}

A differenza dei concorrenti che si affidano ad Amazon SES o ad altri servizi di terze parti, manteniamo il controllo completo sulla nostra infrastruttura, migliorando sia l'affidabilità che la privacy.

### 4. Prezzi convenienti {#4-cost-effective-pricing}

Il nostro modello di prezzi ti consente di scalare in modo economicamente conveniente. Non addebitiamo costi per utente e puoi pagare a consumo per lo storage. A $ 3/mese, offriamo più funzionalità a un prezzo inferiore rispetto ai concorrenti come Gandi ($ 3,99/mese).

### 5. Risorse illimitate {#5-unlimited-resources}

Non imponiamo limiti artificiali su domini, alias o indirizzi email come fanno molti concorrenti.

### 6. Scelto dalle principali organizzazioni {#6-trusted-by-major-organizations}

Il nostro servizio è utilizzato da oltre 500.000 domini, tra cui organizzazioni di rilievo come [L'Accademia Navale degli Stati Uniti](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [La Fondazione Linux](/blog/docs/linux-foundation-email-enterprise-case-study), [Canonico/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales e molte altre.

## Casi d'uso comuni per l'inoltro di posta elettronica {#common-use-cases-for-email-forwarding}

L'inoltro delle e-mail risolve numerose sfide per diverse tipologie di utenti:

### Per le aziende {#for-businesses}

* Crea indirizzi email professionali per diversi reparti (vendite@, supporto@, info@)
* Gestisci facilmente le comunicazioni email del team
* Mantieni la coerenza del brand in tutte le comunicazioni
* Semplifica la gestione delle email durante i cambi di personale

### Per gli sviluppatori {#for-developers}

* Configura sistemi di notifica automatizzati
* Crea indirizzi specifici per diversi progetti
* Integra webhook per un'automazione avanzata
* Sfrutta la nostra API per implementazioni personalizzate

### Per le persone attente alla privacy {#for-privacy-conscious-individuals}

* Crea indirizzi email separati per i diversi servizi per monitorare chi condivide le tue informazioni
* Utilizza indirizzi usa e getta per le registrazioni monouso
* Mantieni la privacy proteggendo il tuo indirizzo email principale
* Disattiva facilmente gli indirizzi che iniziano a ricevere spam

## Procedure consigliate per l'inoltro delle e-mail {#best-practices-for-email-forwarding}

Per sfruttare al meglio l'inoltro delle e-mail, tieni presente queste buone pratiche:

### 1. Utilizzare indirizzi descrittivi {#1-use-descriptive-addresses}

Crea indirizzi email che indichino chiaramente il loro scopo (ad esempio, <newsletter@tuodominio.com>, <shopping@tuodominio.com>) per organizzare meglio la posta in arrivo.

### 2. Implementare l'autenticazione corretta {#2-implement-proper-authentication}

Assicurati che il tuo dominio abbia i record SPF, DKIM e DMARC corretti per massimizzare la recapitabilità. Forward Email semplifica tutto questo con la nostra configurazione guidata.

### 3. Controlla regolarmente i tuoi inoltri {#3-regularly-review-your-forwards}

Controlla periodicamente i tuoi inoltri di posta elettronica per disattivare quelli che non sono più necessari o che ricevono troppa posta indesiderata.

### 4. Imposta "Invia posta come" per risposte senza interruzioni {#4-set-up-send-mail-as-for-seamless-replies}

Configura il tuo client di posta elettronica principale per inviare email come indirizzi di dominio personalizzati, per un'esperienza coerente quando rispondi alle email inoltrate.

### 5. Utilizzare con cautela gli indirizzi catch-all {#5-use-catch-all-addresses-cautiously}

Sebbene gli indirizzi catch-all siano comodi, possono potenzialmente ricevere più spam. Prendi in considerazione la creazione di inoltri specifici per le comunicazioni importanti.

## Conclusione {#conclusion}

L'inoltro e-mail è uno strumento potente che porta professionalità, privacy e semplicità alle tue comunicazioni e-mail. Con Forward Email, ottieni il servizio di inoltro e-mail più sicuro, privato e flessibile disponibile.

Essendo l'unico fornitore open source al 100% con crittografia resistente ai computer quantistici e attenzione alla privacy, abbiamo creato un servizio che rispetta i tuoi diritti offrendo al contempo funzionalità eccezionali.

Che tu voglia creare indirizzi email professionali per la tua azienda, proteggere la tua privacy con indirizzi usa e getta o semplificare la gestione di più account email, Forward Email è la soluzione perfetta.

Pronto a trasformare la tua esperienza di posta elettronica? [Iscriviti gratuitamente](https://forwardemail.net) oggi stesso e unisciti agli oltre 500.000 domini che già beneficiano del nostro servizio.

---

*Questo articolo del blog è stato scritto dal team di Forward Email, creatori del servizio di inoltro email più sicuro, privato e flessibile al mondo. Visita [forwardemail.net](https://forwardemail.net) per saperne di più sul nostro servizio e iniziare a inoltrare email in tutta sicurezza.*