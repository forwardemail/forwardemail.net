# Email Self-Hosted: Impegno verso l'Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Illustrazione della soluzione email self-hosted" class="rounded-lg" />


## Indice {#table-of-contents}

* [Prefazione](#foreword)
* [Perché l'Email Self-Hosted è Importante](#why-self-hosted-email-matters)
  * [Il Problema dei Servizi Email Tradizionali](#the-problem-with-traditional-email-services)
  * [L'Alternativa Self-Hosted](#the-self-hosted-alternative)
* [La Nostra Implementazione Self-Hosted: Panoramica Tecnica](#our-self-hosted-implementation-technical-overview)
  * [Architettura Basata su Docker per Semplicità e Portabilità](#docker-based-architecture-for-simplicity-and-portability)
  * [Installazione con Script Bash: Accessibilità e Sicurezza](#bash-script-installation-accessibility-meets-security)
  * [Crittografia Quantum-Safe per una Privacy a Prova di Futuro](#quantum-safe-encryption-for-future-proof-privacy)
  * [Manutenzione e Aggiornamenti Automatizzati](#automated-maintenance-and-updates)
* [L'Impegno Open Source](#the-open-source-commitment)
* [Self-Hosted vs. Gestito: Fare la Scelta Giusta](#self-hosted-vs-managed-making-the-right-choice)
  * [La Realtà del Self-Hosting Email](#the-reality-of-self-hosting-email)
  * [Quando Scegliere il Nostro Servizio Gestito](#when-to-choose-our-managed-service)
* [Iniziare con Self-Hosted Forward Email](#getting-started-with-self-hosted-forward-email)
  * [Requisiti di Sistema](#system-requirements)
  * [Passaggi per l'Installazione](#installation-steps)
* [Il Futuro dell'Email Self-Hosted](#the-future-of-self-hosted-email)
* [Conclusione: Libertà Email per Tutti](#conclusion-email-freedom-for-everyone)
* [Riferimenti](#references)


## Prefazione {#foreword}

Nell'attuale panorama digitale, l'email rimane la spina dorsale della nostra identità e comunicazione online. Tuttavia, con l'aumento delle preoccupazioni sulla privacy, molti utenti si trovano di fronte a una scelta difficile: comodità a scapito della privacy, o privacy a scapito della comodità. In Forward Email, abbiamo sempre creduto che non si debba scegliere tra le due.

Oggi, siamo entusiasti di annunciare un traguardo significativo nel nostro percorso: il lancio della nostra soluzione email self-hosted. Questa funzionalità rappresenta il nostro impegno più profondo verso i principi open source, il design focalizzato sulla privacy e l'empowerment degli utenti. Con la nostra opzione self-hosted, mettiamo il pieno potere e controllo della tua comunicazione email direttamente nelle tue mani.

Questo post esplora la filosofia dietro la nostra soluzione self-hosted, la sua implementazione tecnica e perché è importante per gli utenti che danno priorità sia alla privacy che alla proprietà nelle loro comunicazioni digitali.


## Perché l'Email Self-Hosted è Importante {#why-self-hosted-email-matters}

La nostra soluzione email self-hosted è l'espressione più chiara della nostra convinzione che la vera privacy significa controllo, e il controllo inizia con l'open source. Per gli utenti che richiedono la piena proprietà delle loro comunicazioni digitali, il self-hosting non è più un'idea di nicchia — è un diritto essenziale. Siamo orgogliosi di sostenere questa convinzione con una piattaforma completamente aperta e verificabile che puoi gestire secondo i tuoi termini.

### Il Problema dei Servizi Email Tradizionali {#the-problem-with-traditional-email-services}

I servizi email tradizionali presentano diverse sfide fondamentali per gli utenti attenti alla privacy:

1. **Requisiti di Fiducia**: Devi fidarti che il provider non acceda, analizzi o condivida i tuoi dati
2. **Controllo Centralizzato**: Il tuo accesso può essere revocato in qualsiasi momento e per qualsiasi motivo
3. **Vulnerabilità alla Sorveglianza**: I servizi centralizzati sono obiettivi privilegiati per la sorveglianza
4. **Trasparenza Limitata**: La maggior parte dei servizi utilizza software proprietario e closed-source
5. **Vincolo al Fornitore**: Migrare da questi servizi può essere difficile o impossibile

Anche i provider email "focalizzati sulla privacy" spesso non sono all'altezza, aprendo solo il codice delle loro applicazioni frontend mentre mantengono i sistemi backend proprietari e chiusi. Questo crea un significativo divario di fiducia—ti viene chiesto di credere alle loro promesse di privacy senza la possibilità di verificarle.

### L'Alternativa Self-Hosted {#the-self-hosted-alternative}
L'auto-gestione della tua email offre un approccio fondamentalmente diverso:

1. **Controllo Completo**: Possiedi e controlli l'intera infrastruttura email
2. **Privacy Verificabile**: L'intero sistema è trasparente e verificabile
3. **Nessuna Fiducia Necessaria**: Non devi fidarti di terze parti per le tue comunicazioni
4. **Libertà di Personalizzazione**: Adatta il sistema alle tue esigenze specifiche
5. **Resilienza**: Il tuo servizio continua indipendentemente dalle decisioni di qualsiasi azienda

Come ha detto un utente: "Auto-gestire la mia email è l'equivalente digitale di coltivare il mio cibo—richiede più lavoro, ma so esattamente cosa contiene."


## La Nostra Implementazione Auto-Gestita: Panoramica Tecnica {#our-self-hosted-implementation-technical-overview}

La nostra soluzione email auto-gestita è costruita sugli stessi principi di privacy-first che guidano tutti i nostri prodotti. Esploriamo l'implementazione tecnica che rende tutto questo possibile.

### Architettura Basata su Docker per Semplicità e Portabilità {#docker-based-architecture-for-simplicity-and-portability}

Abbiamo impacchettato l'intera infrastruttura email usando Docker, rendendo facile il deployment su praticamente qualsiasi sistema basato su Linux. Questo approccio containerizzato offre diversi vantaggi chiave:

1. **Deployment Semplificato**: Un singolo comando configura l'intera infrastruttura
2. **Ambiente Consistente**: Elimina i problemi del tipo "funziona sulla mia macchina"
3. **Componenti Isolati**: Ogni servizio gira nel proprio container per sicurezza
4. **Aggiornamenti Facili**: Comandi semplici per aggiornare l'intero stack
5. **Dipendenze Minime**: Richiede solo Docker e Docker Compose

L'architettura include container per:

* Interfaccia web per l'amministrazione
* Server SMTP per email in uscita
* Server IMAP/POP3 per il recupero email
* Server CalDAV per calendari
* Server CardDAV per contatti
* Database per la memorizzazione della configurazione
* Redis per caching e performance
* SQLite per l'archiviazione sicura e criptata delle caselle email

> \[!NOTE]
> Assicurati di consultare la nostra [guida per sviluppatori auto-gestita](https://forwardemail.net/self-hosted)

### Installazione con Script Bash: Accessibilità e Sicurezza {#bash-script-installation-accessibility-meets-security}

Abbiamo progettato il processo di installazione per essere il più semplice possibile mantenendo le migliori pratiche di sicurezza:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Questo singolo comando:

1. Verifica i requisiti di sistema
2. Ti guida nella configurazione
3. Imposta i record DNS
4. Configura i certificati TLS
5. Distribuisce i container Docker
6. Esegue un primo rafforzamento della sicurezza

Per chi è preoccupato di eseguire script tramite pipe su bash (come dovrebbe essere!), consigliamo di rivedere lo script prima dell'esecuzione. È completamente open-source e disponibile per l'ispezione.

### Crittografia Quantum-Safe per una Privacy a Prova di Futuro {#quantum-safe-encryption-for-future-proof-privacy}

Come il nostro servizio ospitato, la nostra soluzione auto-gestita implementa una crittografia resistente al quantum usando ChaCha20-Poly1305 come cifrario per i database SQLite. Questo approccio protegge i tuoi dati email non solo contro le minacce attuali, ma anche contro futuri attacchi di calcolo quantistico.

Ogni casella email è memorizzata in un proprio file di database SQLite criptato, fornendo un'isolamento completo tra gli utenti—un vantaggio di sicurezza significativo rispetto agli approcci tradizionali con database condivisi.

### Manutenzione e Aggiornamenti Automatizzati {#automated-maintenance-and-updates}

Abbiamo integrato utilità di manutenzione complete direttamente nella soluzione auto-gestita:

1. **Backup Automatici**: Backup programmati di tutti i dati critici
2. **Rinnovo Certificati**: Gestione automatica dei certificati Let's Encrypt
3. **Aggiornamenti di Sistema**: Comando semplice per aggiornare all'ultima versione
4. **Monitoraggio dello Stato**: Controlli integrati per garantire l'integrità del sistema

Queste utilità sono accessibili tramite un semplice menu interattivo:

```bash
# script prompt

1. Configurazione iniziale
2. Configura Backup
3. Configura Aggiornamenti Automatici
4. Rinnova certificati
5. Ripristina da Backup
6. Aiuto
7. Esci
```


## L'Impegno Open-Source {#the-open-source-commitment}

La nostra soluzione email auto-gestita, come tutti i nostri prodotti, è 100% open-source—sia frontend che backend. Questo significa:
1. **Trasparenza Completa**: Ogni riga di codice che elabora le tue email è disponibile per la revisione pubblica  
2. **Contributi della Comunità**: Chiunque può contribuire con miglioramenti o correggere problemi  
3. **Sicurezza Attraverso l'Apertura**: Le vulnerabilità possono essere identificate e risolte da una comunità globale  
4. **Nessun Vincolo con il Fornitore**: Non dipendi mai dall'esistenza della nostra azienda  

L'intero codice è disponibile su GitHub all'indirizzo <https://github.com/forwardemail/forwardemail.net>.


## Self-Hosted vs. Managed: Fare la Scelta Giusta {#self-hosted-vs-managed-making-the-right-choice}

Sebbene siamo orgogliosi di offrire un'opzione self-hosted, riconosciamo che non è la scelta giusta per tutti. Gestire autonomamente le email comporta responsabilità e sfide reali:

### La Realtà del Self-Hosting Email {#the-reality-of-self-hosting-email}

#### Considerazioni Tecniche {#technical-considerations}

* **Gestione del Server**: Dovrai mantenere un VPS o un server dedicato  
* **Configurazione DNS**: Una corretta configurazione DNS è fondamentale per la deliverability  
* **Aggiornamenti di Sicurezza**: È essenziale mantenersi aggiornati con le patch di sicurezza  
* **Gestione dello Spam**: Dovrai occuparti del filtraggio dello spam  
* **Strategia di Backup**: Implementare backup affidabili è tua responsabilità  

#### Investimento di Tempo {#time-investment}

* **Configurazione Iniziale**: Tempo per configurare, verificare e leggere la documentazione  
* **Manutenzione Continua**: Aggiornamenti e monitoraggio occasionali  
* **Risoluzione dei Problemi**: Tempo occasionale per risolvere problemi  

#### Considerazioni Finanziarie {#financial-considerations}

* **Costi del Server**: 5-20$ al mese per un VPS base  
* **Registrazione del Dominio**: 10-20$ all'anno  
* **Valore del Tempo**: Il tuo investimento di tempo ha un valore reale  

### Quando Scegliere il Nostro Servizio Gestito {#when-to-choose-our-managed-service}

Per molti utenti, il nostro servizio gestito rimane la scelta migliore:

1. **Comodità**: Gestiamo tutta la manutenzione, gli aggiornamenti e il monitoraggio  
2. **Affidabilità**: Approfitta della nostra infrastruttura consolidata e competenza  
3. **Supporto**: Ricevi assistenza quando sorgono problemi  
4. **Deliverability**: Sfrutta la nostra reputazione IP consolidata  
5. **Convenienza**: Considerando il costo del tempo, il nostro servizio è spesso più economico  

Entrambe le opzioni offrono gli stessi benefici in termini di privacy e trasparenza open-source—la differenza è semplicemente chi gestisce l'infrastruttura.


## Iniziare con Forward Email Self-Hosted {#getting-started-with-self-hosted-forward-email}

Pronto a prendere il controllo della tua infrastruttura email? Ecco come iniziare:

### Requisiti di Sistema {#system-requirements}

* Ubuntu 20.04 LTS o versione più recente (consigliato)  
* Minimo 1GB di RAM (consigliati 2GB+)  
* 20GB di spazio di archiviazione consigliati  
* Un nome di dominio che controlli  
* Indirizzo IP pubblico con supporto porta 25  
* Capacità di impostare il [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* Supporto IPv4 e IPv6  

> \[!TIP]  
> Raccomandiamo diversi provider di server mail su <https://forwardemail.net/blog/docs/best-mail-server-providers> (sorgente su <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Passaggi per l'Installazione {#installation-steps}

1. **Esegui lo Script di Installazione**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Segui le Istruzioni Interattive**:  
   * Inserisci il nome del tuo dominio  
   * Configura le credenziali dell'amministratore  
   * Imposta i record DNS come indicato  
   * Scegli le opzioni di configurazione preferite  

3. **Verifica l'Installazione**:  
   Una volta completata l'installazione, puoi verificare che tutto funzioni:  
   * Controllando lo stato dei container: `docker ps`  
   * Inviando una email di prova  
   * Accedendo all'interfaccia web  


## Il Futuro delle Email Self-Hosted {#the-future-of-self-hosted-email}

La nostra soluzione self-hosted è solo l'inizio. Siamo impegnati a migliorare continuamente questa offerta con:

1. **Strumenti di Amministrazione Potenziati**: Gestione web più potente  
2. **Opzioni di Autenticazione Aggiuntive**: Incluso il supporto per chiavi di sicurezza hardware  
3. **Monitoraggio Avanzato**: Migliori informazioni sulla salute e prestazioni del sistema  
4. **Distribuzione Multi-Server**: Opzioni per configurazioni ad alta disponibilità  
5. **Miglioramenti Guidati dalla Comunità**: Incorporando contributi dagli utenti
## Conclusione: Libertà della Email per Tutti {#conclusion-email-freedom-for-everyone}

Il lancio della nostra soluzione email self-hosted rappresenta una pietra miliare significativa nella nostra missione di fornire servizi email trasparenti e incentrati sulla privacy. Che tu scelga il nostro servizio gestito o l'opzione self-hosted, benefici del nostro impegno incrollabile verso i principi open-source e il design orientato alla privacy.

L'email è troppo importante per essere controllata da sistemi chiusi e proprietari che danno priorità alla raccolta dati rispetto alla privacy degli utenti. Con la soluzione self-hosted di Forward Email, siamo orgogliosi di offrire una vera alternativa—una che ti mette in completo controllo delle tue comunicazioni digitali.

Crediamo che la privacy non sia solo una funzionalità; è un diritto fondamentale. E con la nostra opzione email self-hosted, stiamo rendendo questo diritto più accessibile che mai.

Pronto a prendere il controllo della tua email? [Inizia oggi](https://forwardemail.net/self-hosted) o esplora il nostro [repository GitHub](https://github.com/forwardemail/forwardemail.net) per saperne di più.


## Riferimenti {#references}

\[1] Repository GitHub di Forward Email: <https://github.com/forwardemail/forwardemail.net>

\[2] Documentazione Self-Hosted: <https://forwardemail.net/en/self-hosted>

\[3] Implementazione Tecnica della Privacy Email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Perché l'Email Open-Source è Importante: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
