# Listmonk con Forward Email per la Consegna Sicura delle Newsletter {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Perché Listmonk e Forward Email](#why-listmonk-and-forward-email)
* [Prerequisiti](#prerequisites)
* [Installazione](#installation)
  * [1. Aggiorna il tuo Server](#1-update-your-server)
  * [2. Installa le Dipendenze](#2-install-dependencies)
  * [3. Scarica la Configurazione di Listmonk](#3-download-listmonk-configuration)
  * [4. Configura il Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configura l’Accesso HTTPS](#5-configure-https-access)
  * [6. Avvia Listmonk](#6-start-listmonk)
  * [7. Configura SMTP di Forward Email in Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configura l’Elaborazione dei Rimbalzi](#8-configure-bounce-processing)
* [Test](#testing)
  * [Crea una Mailing List](#create-a-mailing-list)
  * [Aggiungi Iscritti](#add-subscribers)
  * [Crea e Invia una Campagna](#create-and-send-a-campaign)
* [Verifica](#verification)
* [Note per Sviluppatori](#developer-notes)
* [Conclusione](#conclusion)


## Panoramica {#overview}

Questa guida fornisce agli sviluppatori istruzioni passo-passo per configurare [Listmonk](https://listmonk.app/), un potente gestore open-source di newsletter e mailing list, per utilizzare [Forward Email](https://forwardemail.net/) come provider SMTP. Questa combinazione ti permette di gestire efficacemente le tue campagne garantendo una consegna email sicura, privata e affidabile.

* **Listmonk**: Gestisce la gestione degli iscritti, l’organizzazione delle liste, la creazione delle campagne e il monitoraggio delle prestazioni.
* **Forward Email**: Funziona come server SMTP sicuro, gestendo l’invio effettivo delle email con funzionalità di sicurezza integrate come SPF, DKIM, DMARC e crittografia TLS.

Integrando questi due, mantieni il pieno controllo sui tuoi dati e infrastruttura sfruttando il robusto sistema di consegna di Forward Email.


## Perché Listmonk e Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Sia Listmonk che i principi alla base di Forward Email enfatizzano trasparenza e controllo. Ospiti Listmonk autonomamente, possedendo i tuoi dati.
* **Focalizzato sulla Privacy**: Forward Email è costruito con la privacy al centro, minimizzando la conservazione dei dati e concentrandosi sulla trasmissione sicura.
* **Economico**: Listmonk è gratuito, e Forward Email offre piani gratuiti generosi e piani a pagamento accessibili, rendendo questa una soluzione economica.
* **Scalabilità**: Listmonk è altamente performante, e l’infrastruttura di Forward Email è progettata per una consegna affidabile su larga scala.
* **Amichevole per gli Sviluppatori**: Listmonk offre una API robusta, e Forward Email fornisce un’integrazione SMTP semplice e webhook.


## Prerequisiti {#prerequisites}

Prima di iniziare, assicurati di avere quanto segue:

* Un Virtual Private Server (VPS) con una distribuzione Linux recente (consigliato Ubuntu 20.04+) con almeno 1 CPU e 1GB di RAM (consigliati 2GB).
  * Hai bisogno di un provider? Dai un’occhiata alla [lista VPS consigliata](https://github.com/forwardemail/awesome-mail-server-providers).
* Un nome di dominio che controlli (accesso DNS richiesto).
* Un account attivo con [Forward Email](https://forwardemail.net/).
* Accesso root o `sudo` al tuo VPS.
* Familiarità di base con operazioni da linea di comando Linux.


## Installazione {#installation}

Questi passaggi ti guidano nell’installazione di Listmonk usando Docker e Docker Compose sul tuo VPS.

### 1. Aggiorna il tuo Server {#1-update-your-server}

Assicurati che la lista dei pacchetti del sistema e i pacchetti installati siano aggiornati.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installa le Dipendenze {#2-install-dependencies}

Installa Docker, Docker Compose e UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Scarica la Configurazione di Listmonk {#3-download-listmonk-configuration}

Crea una directory per Listmonk e scarica il file ufficiale `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Questo file definisce il container dell’applicazione Listmonk e il container del database PostgreSQL richiesto.
### 4. Configura il Firewall (UFW) {#4-configure-firewall-ufw}

Consenti il traffico essenziale (SSH, HTTP, HTTPS) attraverso il firewall. Se il tuo SSH utilizza una porta non standard, adattala di conseguenza.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Conferma l'attivazione del firewall quando richiesto.

### 5. Configura l’Accesso HTTPS {#5-configure-https-access}

Eseguire Listmonk tramite HTTPS è fondamentale per la sicurezza. Hai due opzioni principali:

#### Opzione A: Usare il Proxy di Cloudflare (Consigliato per Semplicità) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Se il DNS del tuo dominio è gestito da Cloudflare, puoi sfruttare la loro funzione proxy per un HTTPS semplice.

1. **Punta il DNS**: Crea un record `A` in Cloudflare per il tuo sottodominio Listmonk (es. `listmonk.tuodominio.com`) che punti all’indirizzo IP del tuo VPS. Assicurati che lo **Stato Proxy** sia impostato su **Proxied** (nuvola arancione).
2. **Modifica Docker Compose**: Modifica il file `docker-compose.yml` che hai scaricato:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Questo rende Listmonk accessibile internamente sulla porta 80, che Cloudflare potrà quindi proxyare e proteggere con HTTPS.

#### Opzione B: Usare un Reverse Proxy (Nginx, Caddy, ecc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

In alternativa, puoi configurare un reverse proxy come Nginx o Caddy sul tuo VPS per gestire la terminazione HTTPS e inoltrare le richieste a Listmonk (che di default gira sulla porta 9000).

* Mantieni il valore predefinito `ports: - "127.0.0.1:9000:9000"` in `docker-compose.yml` per assicurarti che Listmonk sia accessibile solo localmente.
* Configura il reverse proxy scelto per ascoltare sulle porte 80 e 443, gestire l’acquisizione del certificato SSL (es. tramite Let’s Encrypt) e inoltrare il traffico a `http://127.0.0.1:9000`.
* La configurazione dettagliata del reverse proxy esula da questa guida, ma sono disponibili molti tutorial online.

### 6. Avvia Listmonk {#6-start-listmonk}

Torna nella directory `listmonk` (se non sei già lì) e avvia i container in modalità detached.

```bash
cd ~/listmonk # O la directory dove hai salvato docker-compose.yml
docker compose up -d
```

Docker scaricherà le immagini necessarie e avvierà i container dell’applicazione Listmonk e del database. Potrebbe impiegare un minuto o due la prima volta.

✅ **Accedi a Listmonk**: Ora dovresti poter accedere all’interfaccia web di Listmonk tramite il dominio che hai configurato (es. `https://listmonk.tuodominio.com`).

### 7. Configura Forward Email SMTP in Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Successivamente, configura Listmonk per inviare email usando il tuo account Forward Email.

1. **Abilita SMTP in Forward Email**: Assicurati di aver generato le credenziali SMTP all’interno della dashboard del tuo account Forward Email. Segui la [guida Forward Email per inviare email con un dominio personalizzato via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) se non l’hai già fatto.
2. **Configura Listmonk**: Accedi al pannello di amministrazione di Listmonk.
   * Vai su **Impostazioni -> SMTP**.

   * Listmonk supporta nativamente Forward Email. Seleziona **ForwardEmail** dalla lista dei provider, oppure inserisci manualmente i seguenti dati:

     | Impostazione      | Valore                                                                                                              |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Porta**         | `465`                                                                                                              |
     | **Protocollo Auth** | `LOGIN`                                                                                                           |
     | **Username**      | Il tuo **username SMTP** di Forward Email                                                                          |
     | **Password**      | La tua **password SMTP** di Forward Email                                                                          |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Email mittente**| L’indirizzo `From` desiderato (es. `newsletter@tuodominio.com`). Assicurati che questo dominio sia configurato in Forward Email. |
* **Importante**: Usa sempre la Porta `465` con `SSL/TLS` per connessioni sicure con Forward Email (consigliato). La porta `587` con STARTTLS è anch'essa supportata, ma SSL/TLS è preferito.

   * Clicca su **Salva**.
3. **Invia Email di Test**: Usa il pulsante "Invia Email di Test" nella pagina delle impostazioni SMTP. Inserisci un indirizzo destinatario a cui hai accesso e clicca su **Invia**. Verifica che l'email arrivi nella casella di posta del destinatario.

### 8. Configurare l'elaborazione dei rimbalzi {#8-configure-bounce-processing}

L'elaborazione dei rimbalzi permette a Listmonk di gestire automaticamente le email che non sono state consegnate (ad esempio, a causa di indirizzi non validi). Forward Email fornisce un webhook per notificare a Listmonk i rimbalzi.

#### Configurazione di Forward Email {#forward-email-setup}

1. Accedi al tuo [Pannello di Controllo Forward Email](https://forwardemail.net/).
2. Vai su **Domains**, seleziona il dominio che stai usando per l'invio e accedi alla sua pagina **Settings**.
3. Scorri fino alla sezione **Bounce Webhook URL**.
4. Inserisci il seguente URL, sostituendo `<your_listmonk_domain>` con il dominio o sottodominio reale dove è accessibile la tua istanza di Listmonk:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Esempio*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scorri ancora fino alla sezione **Webhook Signature Payload Verification Key**.
6. **Copia** la chiave di verifica generata. Ti servirà in Listmonk.
7. Salva le modifiche nelle impostazioni del dominio su Forward Email.

#### Configurazione di Listmonk {#listmonk-setup}

1. Nel pannello di amministrazione di Listmonk, vai su **Settings -> Bounces**.
2. Abilita **Enable bounce processing**.
3. Abilita **Enable bounce webhooks**.
4. Scorri fino alla sezione **Webhook Providers**.
5. Abilita **Forward Email**.
6. Incolla la **Webhook Signature Payload Verification Key** copiata dal pannello di Forward Email nel campo **Forward Email Key**.
7. Clicca su **Save** in fondo alla pagina.
8. L'elaborazione dei rimbalzi è ora configurata! Quando Forward Email rileva un rimbalzo per un'email inviata da Listmonk, notificherà la tua istanza di Listmonk tramite il webhook, e Listmonk segnerà il contatto di conseguenza.
9. Completa i passaggi seguenti in [Testing](#testing) per assicurarti che tutto funzioni correttamente.


## Testing {#testing}

Ecco una panoramica rapida delle funzioni principali di Listmonk:

### Crea una Mailing List {#create-a-mailing-list}

* Vai su **Lists** nella barra laterale.
* Clicca su **New List**.
* Compila i dettagli (Nome, Tipo: Pubblico/Privato, Descrizione, Tag) e **Salva**.

### Aggiungi Iscritti {#add-subscribers}

* Naviga alla sezione **Subscribers**.
* Puoi aggiungere iscritti:
  * **Manuale**: Clicca su **New Subscriber**.
  * **Importa**: Clicca su **Import Subscribers** per caricare un file CSV.
  * **API**: Usa l'API di Listmonk per aggiunte programmatiche.
* Assegna gli iscritti a una o più liste durante la creazione o l'importazione.
* **Buona Pratica**: Usa un processo di doppio opt-in. Configuralo sotto **Settings -> Opt-in & Subscriptions**.

### Crea e Invia una Campagna {#create-and-send-a-campaign}

* Vai su **Campaigns** -> **New Campaign**.
* Compila i dettagli della campagna (Nome, Oggetto, Email Mittente, Lista/e a cui inviare).
* Scegli il tipo di contenuto (Rich Text/HTML, Plain Text, Raw HTML).
* Componi il contenuto della tua email. Puoi usare variabili template come `{{ .Subscriber.Email }}` o `{{ .Subscriber.FirstName }}`.
* **Invia sempre prima un'email di test!** Usa l'opzione "Send Test" per visualizzare l'email nella tua casella.
* Quando sei soddisfatto, clicca su **Start Campaign** per inviare immediatamente o programmarla per dopo.


## Verifica {#verification}

* **Consegna SMTP**: Invia regolarmente email di test tramite la pagina delle impostazioni SMTP di Listmonk e campagne di prova per assicurarti che le email vengano consegnate correttamente.
* **Gestione Rimbalzi**: Invia una campagna di test a un indirizzo email noto non valido (ad esempio, `bounce-test@yourdomain.com` se non ne hai uno reale a disposizione, anche se i risultati possono variare). Controlla le statistiche della campagna in Listmonk dopo poco per vedere se il rimbalzo è stato registrato.
* **Intestazioni Email**: Usa strumenti come [Mail-Tester](https://www.mail-tester.com/) o ispeziona manualmente le intestazioni delle email per verificare che SPF, DKIM e DMARC siano superati, indicando una corretta configurazione tramite Forward Email.
* **Log di Forward Email**: Controlla i log nel pannello di Forward Email se sospetti problemi di consegna originati dal server SMTP.
## Note per gli Sviluppatori {#developer-notes}

* **Templating**: Listmonk utilizza il motore di templating di Go. Esplora la sua documentazione per una personalizzazione avanzata: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk offre una completa API REST per gestire liste, iscritti, campagne, template e altro. Trova il link alla documentazione API nel footer della tua istanza di Listmonk.
* **Campi Personalizzati**: Definisci campi personalizzati per gli iscritti sotto **Impostazioni -> Campi Iscritti** per memorizzare dati aggiuntivi.
* **Webhooks**: Oltre ai rimbalzi, Listmonk può inviare webhooks per altri eventi (es. iscrizioni), permettendo l’integrazione con altri sistemi.


## Conclusione {#conclusion}

Integrando la potenza self-hosted di Listmonk con la consegna sicura e rispettosa della privacy di Forward Email, crei una piattaforma di email marketing robusta ed etica. Mantieni la piena proprietà dei dati del tuo pubblico beneficiando di alta deliverability e funzionalità di sicurezza automatizzate.

Questa configurazione offre un’alternativa scalabile, economica e amichevole per gli sviluppatori ai servizi email proprietari, allineandosi perfettamente con l’etica del software open-source e della privacy degli utenti.

Buona Invio! 🚀
