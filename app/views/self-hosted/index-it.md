# Self Hosted {#self-hosted}


## Table of Contents {#table-of-contents}

* [Iniziare](#getting-started)
* [Requisiti](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Installazione](#install)
  * [Debug script di installazione](#debug-install-script)
  * [Prompt](#prompts)
  * [Configurazione iniziale (Opzione 1)](#initial-setup-option-1)
* [Servizi](#services)
  * [Percorsi file importanti](#important-file-paths)
* [Configurazione](#configuration)
  * [Configurazione DNS iniziale](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Test](#testing)
  * [Creare il tuo primo alias](#creating-your-first-alias)
  * [Invio / Ricezione della tua prima email](#sending--receiving-your-first-email)
* [Risoluzione dei problemi](#troubleshooting)
  * [Qual è il nome utente e la password per l'autenticazione base](#what-is-the-basic-auth-username-and-password)
  * [Come faccio a sapere cosa è in esecuzione](#how-do-i-know-what-is-running)
  * [Come faccio a sapere se qualcosa non è in esecuzione ma dovrebbe esserlo](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Come trovo i log](#how-do-i-find-logs)
  * [Perché le mie email in uscita vanno in timeout](#why-are-my-outgoing-emails-timing-out)


## Getting started {#getting-started}

La nostra soluzione email self-hosted, come tutti i nostri prodotti, è 100% open-source—sia frontend che backend. Questo significa:

1. **Trasparenza Completa**: Ogni riga di codice che elabora le tue email è disponibile per la revisione pubblica
2. **Contributi dalla Comunità**: Chiunque può contribuire con miglioramenti o correggere problemi
3. **Sicurezza tramite Trasparenza**: Le vulnerabilità possono essere identificate e risolte da una comunità globale
4. **Nessun Lock-in con il Fornitore**: Non dipendi mai dall'esistenza della nostra azienda

L'intero codice è disponibile su GitHub all'indirizzo <https://github.com/forwardemail/forwardemail.net>, con licenza MIT.

L'architettura include container per:

* Server SMTP per email in uscita
* Server IMAP/POP3 per il recupero delle email
* Interfaccia web per l'amministrazione
* Database per la memorizzazione della configurazione
* Redis per caching e prestazioni
* SQLite per l'archiviazione sicura e criptata delle caselle di posta

> \[!NOTE]
> Assicurati di dare un'occhiata al nostro [blog self-hosted](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> E per chi è interessato a una versione più dettagliata passo-passo, consulta le nostre guide basate su [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Requirements {#requirements}

Prima di eseguire lo script di installazione, assicurati di avere quanto segue:

* **Sistema Operativo**: Un server basato su Linux (attualmente supporta Ubuntu 22.04+).
* **Risorse**: 1 vCPU e 2GB di RAM
* **Accesso Root**: Privilegi amministrativi per eseguire comandi.
* **Nome Dominio**: Un dominio personalizzato pronto per la configurazione DNS.
* **IP Pulito**: Assicurati che il tuo server abbia un indirizzo IP pulito senza precedenti reputazioni di spam controllando le blacklist. Maggiori informazioni [qui](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Indirizzo IP pubblico con supporto porta 25
* Capacità di impostare il [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Supporto IPv4 e IPv6

> \[!TIP]
> Consulta la nostra lista di [ottimi provider di server mail](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

La maggior parte dei fornitori cloud supporta una configurazione cloud-init per quando il server virtuale privato (VPS) viene provisionato. Questo è un ottimo modo per impostare alcuni file e variabili d'ambiente in anticipo da utilizzare dalla logica di configurazione iniziale degli script, che eviterà la necessità di prompt durante l'esecuzione dello script per ulteriori informazioni.

**Opzioni**

* `EMAIL` - email usata per i promemoria di scadenza di certbot
* `DOMAIN` - dominio personalizzato (es. `example.com`) usato per la configurazione self-hosted
* `AUTH_BASIC_USERNAME` - nome utente usato nella configurazione iniziale per proteggere il sito
* `AUTH_BASIC_PASSWORD` - password usata nella configurazione iniziale per proteggere il sito
* `/root/.cloudflare.ini` - (**solo utenti Cloudflare**) file di configurazione cloudflare usato da certbot per la configurazione DNS. Richiede di impostare il tuo token API tramite `dns_cloudflare_api_token`. Leggi di più [qui](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Esempio:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## Installazione {#install}

Esegui il seguente comando sul tuo server per scaricare ed eseguire lo script di installazione:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debug dello script di installazione {#debug-install-script}

Aggiungi `DEBUG=true` davanti allo script di installazione per un output dettagliato:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompt {#prompts}

```sh
1. Configurazione iniziale
2. Configura Backup
3. Configura Aggiornamenti Automatici
4. Rinnova certificati
5. Ripristina da Backup
6. Aiuto
7. Esci
```

* **Configurazione iniziale**: Scarica l'ultima versione del codice forward email, configura l'ambiente, richiede il tuo dominio personalizzato e configura tutti i certificati, le chiavi e i segreti necessari.
* **Configura Backup**: Configurerà un cron per eseguire il backup di mongoDB e redis utilizzando un archivio compatibile S3 per uno storage remoto sicuro. Separatamente, sqlite verrà salvato al login se ci sono modifiche per backup sicuri e criptati.
* **Configura Aggiornamento**: Configura un cron per cercare aggiornamenti notturni che ricostruiranno e riavvieranno in sicurezza i componenti dell'infrastruttura.
* **Rinnova certificati**: Certbot / lets encrypt viene utilizzato per i certificati SSL e le chiavi scadono ogni 3 mesi. Questo rinnova i certificati per il tuo dominio e li posiziona nella cartella necessaria affinché i componenti correlati li utilizzino. Vedi [percorsi file importanti](#important-file-paths)
* **Ripristina da backup**: Attiverà mongodb e redis per ripristinare dai dati di backup.

### Configurazione iniziale (Opzione 1) {#initial-setup-option-1}

Scegli l'opzione `1. Configurazione iniziale` per iniziare.

Una volta completato, dovresti vedere un messaggio di successo. Puoi anche eseguire `docker ps` per vedere **i** componenti avviati. Maggiori informazioni sui componenti di seguito.


## Servizi {#services}

| Nome Servizio |         Porta Predefinita        | Descrizione                                            |
| ------------ | :------------------------------: | ------------------------------------------------------ |
| Web          |            `443`                 | Interfaccia web per tutte le interazioni amministrative |
| API          |            `4000`                | Livello API per astrarre i database                    |
| Bree         |             Nessuna              | Job in background e task runner                         |
| SMTP         | `465` (consigliato) / `587`     | Server SMTP per email in uscita                         |
| SMTP Bree    |             Nessuna              | Job SMTP in background                                  |
| MX           |            `2525`                | Mail exchange per email in entrata e inoltro email     |
| IMAP         |          `993/2993`              | Server IMAP per email in entrata e gestione caselle    |
| POP3         |          `995/2995`              | Server POP3 per email in entrata e gestione caselle    |
| SQLite       |            `3456`                | Server SQLite per interazioni con database sqlite      |
| SQLite Bree  |             Nessuna              | Job SQLite in background                                |
| CalDAV       |            `5000`                | Server CalDAV per gestione calendario                   |
| CardDAV      |            `6000`                | Server CardDAV per gestione calendario                  |
| MongoDB      |           `27017`                | Database MongoDB per la maggior parte della gestione dati |
| Redis        |            `6379`                | Redis per caching e gestione dello stato                |
| SQLite       |             Nessuna              | Database SQLite per caselle email criptate              |

### Percorsi file importanti {#important-file-paths}

Nota: *Percorso host* qui sotto è relativo a `/root/forwardemail.net/self-hosting/`.

| Componente             |       Percorso host       | Percorso container           |
| ---------------------- | :-----------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`       | `/backups`                   |
| Redis                  |     `./redis-data`        | `/data`                      |
| Sqlite                 |    `./sqlite-data`        | `/mnt/{SQLITE_STORAGE_PATH}` |
| File Env               |        `./.env`           | `/app/.env`                  |
| Certificati/chiavi SSL |        `./ssl`            | `/app/ssl/`                  |
| Chiave privata         |  `./ssl/privkey.pem`      | `/app/ssl/privkey.pem`       |
| Certificato catena completa | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| Certificato CA         |    `./ssl/cert.pem`       | `/app/ssl/cert.pem`          |
| Chiave privata DKIM    |    `./ssl/dkim.key`       | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Salva il file `.env` in modo sicuro. È fondamentale per il recupero in caso di guasto.
> Puoi trovarlo in `/root/forwardemail.net/self-hosting/.env`.


## Configurazione {#configuration}

### Configurazione DNS iniziale {#initial-dns-setup}

Nel tuo provider DNS preferito, configura i record DNS appropriati. Nota che tutto ciò che è tra parentesi angolari (`<>`) è dinamico e deve essere aggiornato con il tuo valore.

| Tipo  | Nome               | Contenuto                    | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", o vuoto  | <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", o vuoto  | mx.<domain_name> (priorità 0) | auto |
| TXT   | "@", ".", o vuoto  | "v=spf1 a -all"              | auto |

#### Reverse DNS / record PTR {#reverse-dns--ptr-record}

Il Reverse DNS (rDNS) o i record puntatori inversi (record PTR) sono essenziali per i server di posta elettronica perché aiutano a verificare la legittimità del server che invia l'email. Ogni provider cloud lo fa in modo diverso, quindi dovrai cercare come aggiungere il "Reverse DNS" per mappare l'host e l'IP al corrispondente nome host. Molto probabilmente si trova nella sezione networking del provider.

#### Porta 25 bloccata {#port-25-blocked}

Alcuni ISP e provider cloud bloccano la porta 25 per evitare abusi. Potrebbe essere necessario aprire un ticket di supporto per sbloccare la porta 25 per SMTP / posta in uscita.


## Onboarding {#onboarding}

1. Apri la Landing Page
   Naviga su https\://\<domain_name>, sostituendo \<domain_name> con il dominio configurato nelle impostazioni DNS. Dovresti vedere la pagina di benvenuto di Forward Email.

2. Accedi e configura il tuo dominio

* Accedi con un'email e una password valide.
* Inserisci il nome del dominio che desideri configurare (deve corrispondere alla configurazione DNS).
* Segui le istruzioni per aggiungere i record **MX** e **TXT** necessari per la verifica.

3. Completa la configurazione

* Una volta verificato, accedi alla pagina Alias per creare il tuo primo alias.
* Facoltativamente, configura **SMTP per la posta in uscita** nelle **Impostazioni Dominio**. Questo richiede record DNS aggiuntivi.

> \[!NOTE]
> Nessuna informazione viene inviata fuori dal tuo server. L'opzione self hosted e l'account iniziale servono solo per l'accesso admin e la gestione web di domini, alias e configurazioni email correlate.


## Test {#testing}

### Creare il tuo primo alias {#creating-your-first-alias}

1. Vai alla pagina Alias
   Apri la pagina di gestione alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Aggiungi un nuovo alias

* Clicca su **Aggiungi Alias** (in alto a destra).
* Inserisci il nome alias e regola le impostazioni email secondo necessità.
* (Facoltativo) Abilita il supporto **IMAP/POP3/CalDAV/CardDAV** selezionando la casella.
* Clicca su **Crea Alias.**

3. Imposta una password

* Clicca su **Genera Password** per creare una password sicura.
* Questa password sarà necessaria per accedere al client email.

4. Configura il tuo client email

* Usa un client email come Thunderbird.
* Inserisci il nome alias e la password generata.
* Configura le impostazioni **IMAP** e **SMTP** di conseguenza.

#### Impostazioni server email {#email-server-settings}

Username: `<alias name>`

| Tipo | Hostname           | Porta | Sicurezza Connessione | Autenticazione  |
| ---- | ------------------ | ----- | --------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465   | SSL / TLS             | Password Normale |
| IMAP | imap.<domain_name> | 993   | SSL / TLS             | Password Normale |

### Inviare / Ricevere la tua prima email {#sending--receiving-your-first-email}

Una volta configurato, dovresti essere in grado di inviare e ricevere email al tuo indirizzo email appena creato e self hosted!
## Risoluzione dei problemi {#troubleshooting}

#### Perché non funziona fuori da Ubuntu e Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Attualmente stiamo cercando di supportare MacOS e valuteremo altri sistemi. Per favore apri una [discussione](https://github.com/orgs/forwardemail/discussions) o contribuisci se desideri vedere supportati altri sistemi.

#### Perché fallisce la sfida acme di certbot {#why-is-the-certbot-acme-challenge-failing}

L'errore più comune è che certbot / letsencrypt a volte richiede **2** sfide. Devi assicurarti di aggiungere **ENTRAMBI** i record txt.

Esempio:
Potresti vedere due sfide come queste:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

È anche possibile che la propagazione DNS non sia ancora completata. Puoi usare strumenti come: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Questo ti darà un'idea se le modifiche al record TXT dovrebbero essere riflesse. È anche possibile che la cache DNS locale sul tuo host stia ancora usando un valore vecchio o non abbia ancora rilevato le modifiche recenti.

Un'altra opzione è usare le modifiche DNS automatiche di certbot impostando il file `/root/.cloudflare.ini` con il token API nel tuo cloud-init / user-data durante la configurazione iniziale del VPS oppure creare questo file e rieseguire lo script. Questo gestirà automaticamente le modifiche DNS e gli aggiornamenti delle sfide.

### Qual è il nome utente e la password per l'autenticazione base {#what-is-the-basic-auth-username-and-password}

Per l'hosting autonomo, aggiungiamo un popup di autenticazione nativa del browser la prima volta con un semplice nome utente (`admin`) e una password (generata casualmente all'installazione iniziale). Lo facciamo come protezione nel caso in cui automazioni / scraper riescano a registrarsi prima di te nell'esperienza web. Puoi trovare questa password dopo l'installazione iniziale nel tuo file `.env` sotto `AUTH_BASIC_USERNAME` e `AUTH_BASIC_PASSWORD`.

### Come faccio a sapere cosa è in esecuzione {#how-do-i-know-what-is-running}

Puoi eseguire `docker ps` per vedere tutti i container in esecuzione che vengono avviati dal file `docker-compose-self-hosting.yml`. Puoi anche eseguire `docker ps -a` per vedere tutto (inclusi i container non in esecuzione).

### Come faccio a sapere se qualcosa che dovrebbe essere in esecuzione non lo è {#how-do-i-know-if-something-isnt-running-that-should-be}

Puoi eseguire `docker ps -a` per vedere tutto (inclusi i container non in esecuzione). Potresti vedere un log di uscita o una nota.

### Come trovo i log {#how-do-i-find-logs}

Puoi ottenere più log tramite `docker logs -f <container_name>`. Se qualcosa è uscito, probabilmente è correlato a una configurazione errata del file `.env`.

Nell'interfaccia web, puoi visualizzare `/admin/emails` e `/admin/logs` rispettivamente per i log delle email in uscita e i log degli errori.

### Perché le mie email in uscita vanno in timeout {#why-are-my-outgoing-emails-timing-out}

Se vedi un messaggio come Connection timed out when connecting to MX server... allora potresti dover verificare se la porta 25 è bloccata. È comune che gli ISP o i provider cloud blocchino questa porta di default e potresti dover contattare il supporto / aprire un ticket per farla sbloccare.

#### Quali strumenti dovrei usare per testare le migliori pratiche di configurazione email e la reputazione IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Dai un'occhiata alla nostra [FAQ qui](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
