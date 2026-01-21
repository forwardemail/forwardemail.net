# Email auto-ospitata: impegno verso l'open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [Perché è importante la posta elettronica self-hosted](#why-self-hosted-email-matters)
  * [Il problema con i servizi di posta elettronica tradizionali](#the-problem-with-traditional-email-services)
  * [L'alternativa self-hosted](#the-self-hosted-alternative)
* [La nostra implementazione self-hosted: panoramica tecnica](#our-self-hosted-implementation-technical-overview)
  * [Architettura basata su Docker per semplicità e portabilità](#docker-based-architecture-for-simplicity-and-portability)
  * [Installazione dello script Bash: l'accessibilità incontra la sicurezza](#bash-script-installation-accessibility-meets-security)
  * [Crittografia quantistica sicura per una privacy a prova di futuro](#quantum-safe-encryption-for-future-proof-privacy)
  * [Manutenzione e aggiornamenti automatizzati](#automated-maintenance-and-updates)
* [L'impegno Open Source](#the-open-source-commitment)
* [Self-hosted vs. Managed: fare la scelta giusta](#self-hosted-vs-managed-making-the-right-choice)
  * [La realtà dell'email self-hosting](#the-reality-of-self-hosting-email)
  * [Quando scegliere il nostro servizio gestito](#when-to-choose-our-managed-service)
* [Introduzione all'inoltro e-mail auto-ospitato](#getting-started-with-self-hosted-forward-email)
  * [Requisiti di sistema](#system-requirements)
  * [Fasi di installazione](#installation-steps)
* [Il futuro della posta elettronica self-hosted](#the-future-of-self-hosted-email)
* [Conclusione: libertà di posta elettronica per tutti](#conclusion-email-freedom-for-everyone)
* [Riferimenti](#references)

## Prefazione {#foreword}

Nel panorama digitale odierno, la posta elettronica rimane il fulcro della nostra identità e comunicazione online. Tuttavia, con l'aumento delle preoccupazioni sulla privacy, molti utenti si trovano di fronte a una scelta difficile: la comodità a scapito della privacy, o la privacy a scapito della comodità. Noi di Forward Email siamo sempre stati convinti che non si debba scegliere tra le due opzioni.

Oggi siamo lieti di annunciare una pietra miliare significativa del nostro percorso: il lancio della nostra soluzione di posta elettronica self-hosted. Questa funzionalità rappresenta il nostro più profondo impegno nei confronti dei principi open source, della progettazione incentrata sulla privacy e della responsabilizzazione degli utenti. Con la nostra opzione self-hosted, mettiamo il pieno potere e il controllo delle tue comunicazioni email direttamente nelle tue mani.

Questo articolo del blog esplora la filosofia alla base della nostra soluzione self-hosted, la sua implementazione tecnica e perché è importante per gli utenti che danno priorità sia alla privacy che alla proprietà nelle loro comunicazioni digitali.

## Perché è importante la posta elettronica self-hosted {#why-self-hosted-email-matters}

La nostra soluzione di posta elettronica self-hosted è la più chiara espressione della nostra convinzione che la vera privacy significhi controllo, e il controllo inizia con l'open source. Per gli utenti che esigono la piena proprietà delle proprie comunicazioni digitali, l'hosting autonomo non è più un'idea marginale, ma un diritto essenziale. Siamo orgogliosi di sostenere questa convinzione con una piattaforma completamente aperta e verificabile, che puoi gestire secondo le tue esigenze.

### Il problema con i servizi di posta elettronica tradizionali {#the-problem-with-traditional-email-services}

I servizi di posta elettronica tradizionali presentano diverse sfide fondamentali per gli utenti attenti alla privacy:

1. **Requisiti di affidabilità**: devi fidarti del fornitore per non accedere, analizzare o condividere i tuoi dati
2. **Controllo centralizzato**: il tuo accesso può essere revocato in qualsiasi momento e per qualsiasi motivo
3. **Vulnerabilità di sorveglianza**: i servizi centralizzati sono obiettivi principali per la sorveglianza
4. **Trasparenza limitata**: la maggior parte dei servizi utilizza software proprietario e closed-source
5. **Blocco del fornitore**: abbandonare questi servizi può essere difficile o impossibile

Anche i provider di posta elettronica "incentrati sulla privacy" spesso falliscono, limitandosi a rendere open source le proprie applicazioni front-end, mantenendo proprietari e chiusi i sistemi back-end. Questo crea un divario di fiducia significativo: ti viene chiesto di credere alle loro promesse di privacy senza la possibilità di verificarle.

### L'alternativa auto-ospitata {#the-self-hosted-alternative}

L'auto-hosting della posta elettronica offre un approccio fondamentalmente diverso:

1. **Controllo completo**: possiedi e controlli l'intera infrastruttura di posta elettronica
2. **Privacy verificabile**: l'intero sistema è trasparente e verificabile
3. **Nessuna fiducia richiesta**: non devi affidare le tue comunicazioni a terzi
4. **Libertà di personalizzazione**: adatta il sistema alle tue esigenze specifiche
5. **Resilienza**: il tuo servizio continua a funzionare indipendentemente dalle decisioni aziendali

Come ha detto un utente: "Ospitare autonomamente la mia posta elettronica è l'equivalente digitale di coltivare il mio cibo: richiede più lavoro, ma so esattamente cosa contiene".

## La nostra implementazione self-hosted: panoramica tecnica {#our-self-hosted-implementation-technical-overview}

La nostra soluzione di posta elettronica self-hosted si basa sugli stessi principi di privacy che guidano tutti i nostri prodotti. Esploriamo l'implementazione tecnica che la rende possibile.

### Architettura basata su Docker per semplicità e portabilità {#docker-based-architecture-for-simplicity-and-portability}

Abbiamo impacchettato l'intera infrastruttura email utilizzando Docker, semplificandone l'implementazione su praticamente qualsiasi sistema basato su Linux. Questo approccio containerizzato offre diversi vantaggi chiave:

1. **Deployment semplificato**: un singolo comando configura l'intera infrastruttura
2. **Ambiente coerente**: elimina i problemi di "funziona sulla mia macchina"
3. **Componenti isolati**: ogni servizio viene eseguito nel proprio contenitore per motivi di sicurezza
4. **Aggiornamenti facili**: comandi semplici per aggiornare l'intero stack
5. **Dipendenze minime**: richiede solo Docker e Docker Compose

L'architettura include contenitori per:

* Interfaccia web per l'amministrazione
* Server SMTP per la posta in uscita
* Server IMAP/POP3 per il recupero della posta elettronica
* Server CalDAV per i calendari
* Server CardDAV per i contatti
* Database per l'archiviazione della configurazione
* Redis per la memorizzazione nella cache e le prestazioni
* SQLite per l'archiviazione sicura e crittografata delle caselle di posta

> \[!NOTE]
> Non dimenticarti di dare un'occhiata al nostro [guida per sviluppatori auto-ospitati](https://forwardemail.net/self-hosted)

### Installazione dello script Bash: accessibilità e sicurezza si incontrano {#bash-script-installation-accessibility-meets-security}

Abbiamo progettato il processo di installazione per renderlo il più semplice possibile, mantenendo al contempo le migliori pratiche di sicurezza:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Questo singolo comando:

1. Verifica i requisiti di sistema
2. Guida l'utente attraverso la configurazione
3. Imposta i record DNS
4. Configura i certificati TLS
5. Distribuisce i container Docker
6. Esegue il rafforzamento iniziale della sicurezza

Per chi è preoccupato di dover reindirizzare gli script a bash (come è giusto che sia!), consigliamo di esaminare lo script prima dell'esecuzione. È completamente open source e disponibile per l'ispezione.

### Crittografia quantistica sicura per una privacy a prova di futuro {#quantum-safe-encryption-for-future-proof-privacy}

Come il nostro servizio in hosting, la nostra soluzione self-hosted implementa la crittografia quantistica utilizzando ChaCha20-Poly1305 come cifrario per i database SQLite. Questo approccio protegge i dati delle tue email non solo dalle minacce attuali, ma anche da futuri attacchi di calcolo quantistico.

Ogni casella di posta è archiviata nel proprio file di database SQLite crittografato, garantendo un isolamento completo tra gli utenti: un vantaggio significativo in termini di sicurezza rispetto ai tradizionali approcci di database condivisi.

### Manutenzione e aggiornamenti automatizzati {#automated-maintenance-and-updates}

Abbiamo integrato utilità di manutenzione complete direttamente nella soluzione self-hosted:

1. **Backup automatici**: Backup pianificati di tutti i dati critici
2. **Rinnovo certificati**: Gestione automatizzata dei certificati Let's Encrypt
3. **Aggiornamenti di sistema**: Semplice comando per aggiornare alla versione più recente
4. **Monitoraggio dello stato**: Controlli integrati per garantire l'integrità del sistema

Queste utilità sono accessibili tramite un semplice menu interattivo:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## L'impegno Open Source {#the-open-source-commitment}

La nostra soluzione di posta elettronica self-hosted, come tutti i nostri prodotti, è open source al 100%, sia nel frontend che nel backend. Questo significa:

1. **Trasparenza totale**: Ogni riga di codice che elabora le tue email è disponibile al pubblico
2. **Contributi della community**: Chiunque può contribuire a miglioramenti o risolvere problemi
3. **Sicurezza attraverso la trasparenza**: Le vulnerabilità possono essere identificate e risolte da una community globale
4. **Nessun vincolo con il fornitore**: Non dipendi mai dall'esistenza della nostra azienda

L'intero codice di base è disponibile su GitHub all'indirizzo <https://github.com/forwardemail/forwardemail.net>.

## Self-hosted vs. Managed: fare la scelta giusta {#self-hosted-vs-managed-making-the-right-choice}

Sebbene siamo orgogliosi di offrire un'opzione self-hosted, riconosciamo che non è la scelta giusta per tutti. L'auto-hosting della posta elettronica comporta responsabilità e sfide reali:

### La realtà dell'auto-hosting della posta elettronica {#the-reality-of-self-hosting-email}

#### Considerazioni tecniche {#technical-considerations}

* **Gestione del server**: dovrai gestire un VPS o un server dedicato
* **Configurazione DNS**: una corretta configurazione del DNS è fondamentale per la consegna
* **Aggiornamenti di sicurezza**: è essenziale rimanere aggiornati con le patch di sicurezza
* **Gestione dello spam**: dovrai gestire il filtro antispam
* **Strategia di backup**: l'implementazione di backup affidabili è una tua responsabilità

#### Investimento di tempo {#time-investment}

* **Configurazione iniziale**: Tempo per configurare, verificare e leggere la documentazione
* **Manutenzione continua**: Aggiornamenti e monitoraggio occasionali
* **Risoluzione dei problemi**: Tempo occasionale per risolvere eventuali problemi

#### Considerazioni finanziarie {#financial-considerations}

* **Costi del server**: $5-$20/mese per un VPS base
* **Registrazione del dominio**: $10-$20/anno
* **Valore del tempo**: il tuo investimento di tempo ha un valore reale

### Quando scegliere il nostro servizio gestito {#when-to-choose-our-managed-service}

Per molti utenti, il nostro servizio gestito rimane l'opzione migliore:

1. **Comodità**: Gestiamo noi tutta la manutenzione, gli aggiornamenti e il monitoraggio
2. **Affidabilità**: Beneficia della nostra infrastruttura consolidata e della nostra competenza
3. **Supporto**: Ricevi assistenza in caso di problemi
4. **Consegna**: Sfrutta la nostra consolidata reputazione in materia di proprietà intellettuale
5. **Economia**: Considerando i costi di tempo, il nostro servizio è spesso più economico

Entrambe le opzioni garantiscono gli stessi vantaggi in termini di privacy e trasparenza open source: la differenza sta semplicemente in chi gestisce l'infrastruttura.

## Introduzione all'inoltro e-mail auto-ospitato {#getting-started-with-self-hosted-forward-email}

Pronti a prendere il controllo della vostra infrastruttura email? Ecco come iniziare:

### Requisiti di sistema {#system-requirements}

* Ubuntu 20.04 LTS o versione successiva (consigliato)
* Almeno 1 GB di RAM (consigliati 2 GB o più)
* 20 GB di spazio di archiviazione consigliati
* Un nome di dominio di tua proprietà
* Indirizzo IP pubblico con supporto per la porta 25
* Possibilità di impostare [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Supporto IPv4 e IPv6

> \[!TIP]
> Consigliamo diversi provider di server di posta elettronica all'indirizzo <https://forwardemail.net/blog/docs/best-mail-server-providers> (fonte all'indirizzo <https://github.com/forwardemail/awesome-mail-server-providers>)

### Passaggi di installazione {#installation-steps}

1. **Esegui lo script di installazione**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Segui le istruzioni interattive**:
* Inserisci il tuo nome di dominio
* Configura le credenziali di amministratore
* Imposta i record DNS come indicato
* Scegli le opzioni di configurazione preferite

3. **Verifica installazione**:
Una volta completata l'installazione, puoi verificare che tutto funzioni correttamente:
* Controllando lo stato del contenitore: `docker ps`
* Inviando un'email di prova
* Accedendo all'interfaccia web

## Il futuro della posta elettronica self-hosted {#the-future-of-self-hosted-email}

La nostra soluzione self-hosted è solo l'inizio. Ci impegniamo a migliorare costantemente questa offerta con:

1. **Strumenti di amministrazione avanzati**: gestione web più potente
2. **Opzioni di autenticazione aggiuntive**: incluso il supporto per chiavi di sicurezza hardware
3. **Monitoraggio avanzato**: informazioni più approfondite sullo stato e sulle prestazioni del sistema
4. **Implementazione multi-server**: opzioni per configurazioni ad alta disponibilità
5. **Miglioramenti basati sulla community**: integrazione dei contributi degli utenti

## Conclusione: libertà di posta elettronica per tutti {#conclusion-email-freedom-for-everyone}

Il lancio della nostra soluzione di posta elettronica self-hosted rappresenta una pietra miliare significativa nella nostra missione: fornire servizi di posta elettronica trasparenti e incentrati sulla privacy. Che scegliate il nostro servizio gestito o l'opzione self-hosted, beneficerete del nostro incrollabile impegno nei confronti dei principi open source e di una progettazione che mette la privacy al primo posto.

La posta elettronica è troppo importante per essere gestita da sistemi chiusi e proprietari che privilegiano la raccolta dati rispetto alla privacy degli utenti. Con la soluzione self-hosted di Forward Email, siamo orgogliosi di offrire una vera alternativa, che ti dà il controllo completo delle tue comunicazioni digitali.

Crediamo che la privacy non sia solo una funzionalità, ma un diritto fondamentale. E con la nostra opzione di posta elettronica self-hosted, rendiamo questo diritto più accessibile che mai.

Pronto a prendere il controllo della tua email? [Inizia oggi](https://forwardemail.net/self-hosted) o esplora il nostro [Repository GitHub](https://github.com/forwardemail/forwardemail.net) per saperne di più.

## Riferimenti {#references}

\[1] Inoltra email Repository GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Documentazione auto-ospitata: <https://forwardemail.net/en/self-hosted>

\[3] Implementazione tecnica della privacy della posta elettronica: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Perché la posta elettronica open source è importante: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>