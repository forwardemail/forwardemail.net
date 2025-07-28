# Auto-ospitato {#self-hosted}

## Indice {#table-of-contents}

* [Iniziare](#getting-started)
* [Requisiti](#requirements)
  * [Cloud-init / Dati utente](#cloud-init--user-data)
* [Installare](#install)
  * [Script di installazione di debug](#debug-install-script)
  * [Richiede](#prompts)
  * [Configurazione iniziale (opzione 1)](#initial-setup-option-1)
* [Servizi](#services)
  * [Percorsi di file importanti](#important-file-paths)
* [Configurazione](#configuration)
  * [Configurazione DNS iniziale](#initial-dns-setup)
* [Inserimento](#onboarding)
* [Prova](#testing)
  * [Creazione del tuo primo alias](#creating-your-first-alias)
  * [Invio/ricezione della prima email](#sending--receiving-your-first-email)
* [Risoluzione dei problemi](#troubleshooting)
  * [Quali sono il nome utente e la password di autenticazione di base?](#what-is-the-basic-auth-username-and-password)
  * [Come faccio a sapere cosa è in esecuzione?](#how-do-i-know-what-is-running)
  * [Come faccio a sapere se qualcosa che dovrebbe funzionare non funziona?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Come trovo i registri?](#how-do-i-find-logs)
  * [Perché le mie e-mail in uscita scadono?](#why-are-my-outgoing-emails-timing-out)

## Per iniziare {#getting-started}

La nostra soluzione di posta elettronica self-hosted, come tutti i nostri prodotti, è open source al 100%, sia frontend che backend. Ciò significa:

1. **Trasparenza totale**: Ogni riga di codice che elabora le tue email è disponibile al pubblico
2. **Contributi della community**: Chiunque può contribuire a migliorare o risolvere problemi
3. **Sicurezza attraverso la trasparenza**: Le vulnerabilità possono essere identificate e risolte da una community globale
4. **Nessun vincolo con il fornitore**: Non dipendi mai dall'esistenza della nostra azienda

L'intero codice sorgente è disponibile su GitHub all'indirizzo <https://github.com/forwardemail/forwardemail.net>,, sotto licenza MIT.

L'architettura include contenitori per:

* Server SMTP per la posta in uscita
* Server IMAP/POP3 per il recupero della posta
* Interfaccia web per l'amministrazione
* Database per l'archiviazione della configurazione
* Redis per la memorizzazione nella cache e le prestazioni
* SQLite per l'archiviazione sicura e crittografata delle caselle di posta

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Requisiti {#requirements}

Prima di eseguire lo script di installazione, assicurati di avere quanto segue:

* **Sistema operativo**: Un server basato su Linux (attualmente supporta Ubuntu 22.04+).
* **Risorse**: 1 vCPU e 2 GB di RAM
* **Accesso root**: Privilegi amministrativi per eseguire comandi.
* **Nome di dominio**: Un dominio personalizzato pronto per la configurazione DNS.
* **IP pulito**: Assicurati che il tuo server abbia un indirizzo IP pulito e senza reputazione di spam verificando le blacklist. Ulteriori informazioni [Qui](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Indirizzo IP pubblico con supporto per la porta 25
* Possibilità di impostare [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Supporto IPv4 e IPv6

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Dati utente {#cloud-init--user-data}

La maggior parte dei fornitori cloud supporta una configurazione cloud-init per quando viene eseguito il provisioning del server privato virtuale (VPS). Questo è un ottimo modo per impostare in anticipo alcuni file e variabili di ambiente da utilizzare nella logica di configurazione iniziale degli script, che eviterà la necessità di richiedere informazioni aggiuntive durante l'esecuzione dello script.

**Opzioni**

* `EMAIL` - email utilizzata per i promemoria di scadenza di Certbot
* `DOMAIN` - dominio personalizzato (ad esempio `example.com`) utilizzato per la configurazione self-hosting
* `AUTH_BASIC_USERNAME` - nome utente utilizzato nella prima configurazione per proteggere il sito
* `AUTH_BASIC_PASSWORD` - password utilizzata nella prima configurazione per proteggere il sito
* `/root/.cloudflare.ini` - (**Solo utenti Cloudflare**) file di configurazione di Cloudflare utilizzato da Certbot per la configurazione DNS. Richiede l'impostazione del token API tramite `dns_cloudflare_api_token`. Scopri di più [Qui](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

## Installa {#install}

Esegui il seguente comando sul tuo server per scaricare ed eseguire lo script di installazione:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Script di installazione di debug {#debug-install-script}

Aggiungere `DEBUG=true` davanti allo script di installazione per un output più dettagliato:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Richieste {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Configurazione iniziale**: Scarica l'ultimo codice email di inoltro, configura l'ambiente, richiedi il tuo dominio personalizzato e imposta tutti i certificati, le chiavi e i segreti necessari.
* **Configura backup**: Imposta un cron per il backup di mongoDB e redis utilizzando uno store compatibile con S3 per un'archiviazione remota sicura. Separatamente, verrà eseguito il backup di sqlite all'accesso in caso di modifiche per i backup sicuri e crittografati.
* **Configura aggiornamento**: Imposta un cron per la ricerca di aggiornamenti notturni che ricostruiranno e riavvieranno in modo sicuro i componenti dell'infrastruttura.
* **Rinnova certificati**: Certbot / lets encrypt viene utilizzato per i certificati SSL e le chiavi scadranno ogni 3 mesi. Questo rinnoverà i certificati per il tuo dominio e li inserirà nella cartella necessaria per l'utilizzo dei componenti correlati. Vedi [percorsi di file importanti](#important-file-paths)
* **Ripristina da backup**: Innescherà il ripristino di mongoDB e redis dai dati di backup.

### Configurazione iniziale (opzione 1) {#initial-setup-option-1}

Selezionare l'opzione `1. Initial setup` per iniziare.

Una volta completato, dovresti visualizzare un messaggio di successo. Puoi anche eseguire `docker ps` per vedere **i** componenti avviati. Maggiori informazioni sui componenti sono disponibili di seguito.

## Servizi {#services}

| Nome del servizio | Porta predefinita | Descrizione |
| ------------ | :----------: | ------------------------------------------------------ |
| Sito web | `443` | Interfaccia web per tutte le interazioni amministrative |
| API | `4000` | Livello API per database astratti |
| Brezza | Nessuno | Esecuzione di attività e lavori in background |
| SMTP | `465/587` | Server SMTP per la posta elettronica in uscita |
| Bree SMTP | Nessuno | Lavoro in background SMTP |
| MX | `2525` | Scambio di posta per posta in arrivo e inoltro di posta elettronica |
| IMAP | `993/2993` | Server IMAP per la posta in arrivo e la gestione delle caselle di posta |
| POP3 | `995/2995` | Server POP3 per la posta in arrivo e la gestione delle caselle di posta |
| SQLite | `3456` | Server SQLite per interazioni con database SQLite |
| SQLite Bree | Nessuno | Lavoro in background di SQLite |
| CalDAV | `5000` | Server CalDAV per la gestione del calendario |
| CardDAV | `6000` | Server CardDAV per la gestione del calendario |
| MongoDB | `27017` | Database MongoDB per la maggior parte della gestione dei dati |
| Rosso | `6379` | Redis per la memorizzazione nella cache e la gestione dello stato |
| SQLite | Nessuno | Database SQLite per cassette postali crittografate |

### Percorsi file importanti {#important-file-paths}

Nota: il *percorso host* riportato di seguito è relativo a `/root/forwardemail.net/self-hosting/`.

| Componente | Percorso host | Percorso del contenitore |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Rosso | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| File di posta elettronica | `./.env` | `/app/.env` |
| Certificati/chiavi SSL | `./ssl` | `/app/ssl/` |
| Chiave privata | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certificato di catena completa | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA certificate | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Chiave privata DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## Configurazione {#configuration}

### Configurazione DNS iniziale {#initial-dns-setup}

Nel provider DNS che hai scelto, configura i record DNS appropriati. Nota che tutto ciò che è tra parentesi quadre (`<>`) è dinamico e deve essere aggiornato con il tuo valore.

| Tipo | Nome | Contenuto | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." o vuoto | <indirizzo_ip> | auto |
| CNAME | api | <nome_dominio> | auto |
| CNAME | caldav | <nome_dominio> | auto |
| CNAME | carddav | <nome_dominio> | auto |
| CNAME | fe-rimbalzi | <nome_dominio> | auto |
| CNAME | mappa | <nome_dominio> | auto |
| CNAME | permessi | <nome_dominio> | auto |
| CNAME | pop3 | <nome_dominio> | auto |
| CNAME | smtp | <nome_dominio> | auto |
| MX | "@", "." o vuoto | mx.<nome_dominio> (priorità 0) | auto |
| TXT | "@", "." o vuoto | "v=spf1 a -tutto" | auto |

#### Record DNS/PTR inverso {#reverse-dns--ptr-record}

I record DNS inversi (rDNS) o i record puntatore inverso (record PTR) sono essenziali per i server di posta elettronica perché aiutano a verificare la legittimità del server che invia l'e-mail. Ogni provider cloud lo fa in modo diverso, quindi dovrai cercare come aggiungere "DNS inverso" per mappare l'host e l'IP al suo nome host corrispondente. Molto probabilmente nella sezione di rete del provider.

#### Porta 25 bloccata {#port-25-blocked}

Alcuni ISP e provider cloud bloccano la porta 25 per evitare malintenzionati. Potrebbe essere necessario inviare un ticket di supporto per aprire la porta 25 per SMTP/e-mail in uscita.

## Onboarding {#onboarding}

1. Apri la landing page
Vai a https\://\<nome_dominio>, sostituendo \<nome_dominio> con il dominio configurato nelle impostazioni DNS. Dovresti visualizzare la landing page "Inoltra email".

2. Accedi e aggiungi il tuo dominio

* Accedi con un indirizzo email e una password validi.
* Inserisci il nome di dominio che desideri configurare (deve corrispondere alla configurazione DNS).
* Segui le istruzioni per aggiungere i record **MX** e **TXT** richiesti per la verifica.

3. Configurazione completa

* Una volta verificato, accedi alla pagina Alias per creare il tuo primo alias.
* Facoltativamente, configura **SMTP per le email in uscita** nelle **Impostazioni dominio**. Questa operazione richiede record DNS aggiuntivi.

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## Test in corso {#testing}

### Creazione del tuo primo alias {#creating-your-first-alias}

1. Vai alla pagina Alias
Apri la pagina di gestione degli alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Aggiungi un nuovo alias

* Fai clic su **Aggiungi alias** (in alto a destra).
* Inserisci il nome dell'alias e modifica le impostazioni email secondo le tue esigenze.
* (Facoltativo) Abilita il supporto **IMAP/POP3/CalDAV/CardDAV** selezionando la casella di controllo.
* Fai clic su **Crea alias**

3. Imposta una password

* Fai clic su **Genera password** per creare una password sicura.
* Questa password sarà necessaria per accedere al tuo client di posta elettronica.

4. Configura il tuo client di posta elettronica

* Utilizza un client di posta elettronica come Thunderbird.
* Inserisci il nome alias e la password generata.
* Configura le impostazioni **IMAP** e **SMTP** di conseguenza.

#### Impostazioni del server di posta elettronica {#email-server-settings}

Nome utente: `<alias name>`

| Tipo | Nome host | Porta | Sicurezza della connessione | Autenticazione |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<nome_dominio> | 465 | SSL / TLS | Password normale |
| IMAP | imap.<nome_dominio> | 993 | SSL / TLS | Password normale |

### Invio/Ricezione della tua prima email {#sending--receiving-your-first-email}

Una volta configurata, dovresti essere in grado di inviare e ricevere email al tuo indirizzo email appena creato e auto-ospitato!

## Risoluzione dei problemi {#troubleshooting}

#### Perché non funziona al di fuori di Ubuntu e Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Al momento stiamo cercando di supportare macOS e presto ne cercheremo altri. Apri un [discussione](https://github.com/orgs/forwardemail/discussions) o contribuisci se desideri che altri utenti siano supportati.

#### Perché la sfida acme di certbot fallisce {#why-is-the-certbot-acme-challenge-failing}

L'errore più comune è che certbot/letsencrypt a volte richiede **2** richieste di verifica. È necessario assicurarsi di aggiungere **ENTRAMBI** i record txt.

Esempio:
Potresti visualizzare due sfide come questa:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

È anche possibile che la propagazione DNS non sia stata completata. Puoi utilizzare strumenti come: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Questo ti darà un'idea se le modifiche al record TXT debbano essere applicate. È anche possibile che la cache DNS locale sul tuo host utilizzi ancora un valore obsoleto o non abbia rilevato le modifiche recenti.

Un'altra opzione è utilizzare le modifiche DNS automatiche del cerbot impostando il file `/root/.cloudflare.ini` con il token API in cloud-init / user-data durante la configurazione iniziale del VPS, oppure creando questo file ed eseguendo nuovamente lo script. Questo gestirà automaticamente le modifiche DNS e gli aggiornamenti di sfida.

### Quali sono il nome utente e la password di autenticazione di base {#what-is-the-basic-auth-username-and-password}

Per l'auto-hosting, aggiungiamo un pop-up di autenticazione nativo del browser per la prima volta con un semplice nome utente (`admin`) e una password (generata casualmente durante la configurazione iniziale). Aggiungiamo questo solo come protezione nel caso in cui automazioni/scrap riescano in qualche modo a precorrere i tempi di registrazione. Puoi trovare questa password dopo la configurazione iniziale nel tuo file `.env` sotto `AUTH_BASIC_USERNAME` e `AUTH_BASIC_PASSWORD`.

### Come faccio a sapere cosa è in esecuzione {#how-do-i-know-what-is-running}

È possibile eseguire `docker ps` per visualizzare tutti i container in esecuzione che vengono avviati dal file `docker-compose-self-hosting.yml`. È anche possibile eseguire `docker ps -a` per visualizzare tutto (inclusi i container non in esecuzione).

### Come faccio a sapere se qualcosa che dovrebbe essere {#how-do-i-know-if-something-isnt-running-that-should-be} non è in esecuzione?

Puoi eseguire `docker ps -a` per visualizzare tutto (inclusi i contenitori non in esecuzione). Potresti visualizzare un registro di uscita o una nota.

### Come trovo i registri {#how-do-i-find-logs}

Puoi ottenere altri log tramite `docker logs -f <container_name>`. Se qualcosa è esistito, è probabile che sia dovuto a una configurazione errata del file `.env`.

Nell'interfaccia utente Web è possibile visualizzare `/admin/emails` e `/admin/logs` rispettivamente per i registri delle e-mail in uscita e per i registri degli errori.

### Perché le mie email in uscita scadono {#why-are-my-outgoing-emails-timing-out}

Se vedi un messaggio come Connection timed out when connecting to MX server... allora potresti dover controllare se la porta 25 è bloccata. È comune che gli ISP o i provider cloud blocchino questa porta di default, per cui potresti dover contattare l'assistenza/inviare un ticket per farla aprire.

#### Quali strumenti dovrei utilizzare per testare le best practice di configurazione della posta elettronica e la reputazione dell'IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Dai un'occhiata al nostro [Domande frequenti qui](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).