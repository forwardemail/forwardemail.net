# Listmonk con inoltro e-mail per la consegna sicura della newsletter {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Indice {#table-of-contents}

* [Panoramica](#overview)
* [Perché Listmonk e Forward Email](#why-listmonk-and-forward-email)
* [Prerequisiti](#prerequisites)
* [Installazione](#installation)
  * [1. Aggiorna il tuo server](#1-update-your-server)
  * [2. Installare le dipendenze](#2-install-dependencies)
  * [3. Scarica la configurazione di Listmonk](#3-download-listmonk-configuration)
  * [4. Configurare il firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configurare l'accesso HTTPS](#5-configure-https-access)
  * [6. Avvia Listmonk](#6-start-listmonk)
  * [7. Configurare l'inoltro email SMTP in Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configurare l'elaborazione dei rimbalzi](#8-configure-bounce-processing)
* [Prova](#testing)
  * [Crea una mailing list](#create-a-mailing-list)
  * [Aggiungi abbonati](#add-subscribers)
  * [Crea e invia una campagna](#create-and-send-a-campaign)
* [Verifica](#verification)
* [Note per gli sviluppatori](#developer-notes)
* [Conclusione](#conclusion)

## Panoramica {#overview}

Questa guida fornisce agli sviluppatori istruzioni dettagliate per configurare [Listmonk](https://listmonk.app/), un potente gestore open source di newsletter e mailing list, per utilizzare [Inoltra e-mail](https://forwardemail.net/) come provider SMTP. Questa combinazione consente di gestire le campagne in modo efficace, garantendo al contempo un recapito email sicuro, privato e affidabile.

* **Listmonk**: Gestisce la gestione degli iscritti, l'organizzazione delle liste, la creazione di campagne e il monitoraggio delle prestazioni.
* **Inoltro email**: Funge da server SMTP sicuro, gestendo l'invio effettivo delle email con funzionalità di sicurezza integrate come SPF, DKIM, DMARC e crittografia TLS.

Integrando questi due elementi, manterrai il controllo totale sui tuoi dati e sulla tua infrastruttura, sfruttando al contempo il solido sistema di distribuzione di Forward Email.

## Perché Listmonk e Inoltra Email {#why-listmonk-and-forward-email}

* **Open Source**: Sia Listmonk che i principi alla base di Forward Email enfatizzano la trasparenza e il controllo. Puoi ospitare Listmonk autonomamente, mantenendo la proprietà dei tuoi dati.
* **Incentrato sulla privacy**: Forward Email è progettato con la privacy al centro, riducendo al minimo la conservazione dei dati e concentrandosi sulla trasmissione sicura.
* **Conveniente**: Listmonk è gratuito e Forward Email offre generosi livelli gratuiti e convenienti piani a pagamento, rendendolo una soluzione conveniente.
* **Scalabilità**: Listmonk è altamente performante e l'infrastruttura di Forward Email è progettata per una distribuzione affidabile su larga scala.
* **Adatto agli sviluppatori**: Listmonk offre un'API robusta e Forward Email offre una semplice integrazione SMTP e webhook.

## Prerequisiti {#prerequisites}

Prima di iniziare, assicurati di avere quanto segue:

* Un server virtuale privato (VPS) con una distribuzione Linux recente (consigliata Ubuntu 20.04 o superiore) con almeno 1 CPU e 1 GB di RAM (consigliati 2 GB).
* Hai bisogno di un provider? Dai un'occhiata a [elenco VPS consigliati](https://github.com/forwardemail/awesome-mail-server-providers).
* Un nome di dominio di cui hai il controllo (richiesto accesso DNS).
* Un account attivo con [Inoltra e-mail](https://forwardemail.net/).
* Accesso root o `sudo` al tuo VPS.
* Conoscenza di base delle operazioni da riga di comando di Linux.

## Installazione {#installation}

Questi passaggi ti guideranno nell'installazione di Listmonk tramite Docker e Docker Compose sul tuo VPS.

### 1. Aggiorna il tuo server {#1-update-your-server}

Assicurati che l'elenco dei pacchetti del sistema e i pacchetti installati siano aggiornati.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installa le dipendenze {#2-install-dependencies}

Installa Docker, Docker Compose e UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Scarica la configurazione di Listmonk {#3-download-listmonk-configuration}

Crea una directory per Listmonk e scarica il file ufficiale `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Questo file definisce il contenitore dell'applicazione Listmonk e il relativo contenitore del database PostgreSQL richiesto.

### 4. Configurare il firewall (UFW) {#4-configure-firewall-ufw}

Consenti il traffico essenziale (SSH, HTTP, HTTPS) attraverso il firewall. Se il tuo SSH funziona su una porta non standard, regola di conseguenza.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Quando richiesto, confermare l'attivazione del firewall.

### 5. Configura l'accesso HTTPS {#5-configure-https-access}

Eseguire Listmonk su HTTPS è fondamentale per la sicurezza. Hai due opzioni principali:

#### Opzione A: utilizzo del proxy Cloudflare (consigliato per semplicità) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Se il DNS del tuo dominio è gestito da Cloudflare, puoi sfruttare la loro funzionalità proxy per un HTTPS semplice.

1. **Punto DNS**: Crea un record `A` in Cloudflare per il tuo sottodominio Listmonk (ad esempio, `listmonk.yourdomain.com`) che punti all'indirizzo IP del tuo VPS. Assicurati che lo **Stato proxy** sia impostato su **Proxied** (nuvola arancione).
2. **Modifica Docker Compose**: Modifica il file `docker-compose.yml` scaricato:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Questo rende Listmonk accessibile internamente sulla porta 80, che Cloudflare può quindi utilizzare come proxy e proteggere con HTTPS.

#### Opzione B: utilizzo di un proxy inverso (Nginx, Caddy, ecc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

In alternativa, puoi impostare un proxy inverso come Nginx o Caddy sul tuo VPS per gestire la terminazione HTTPS e le richieste proxy a Listmonk (in esecuzione sulla porta 9000 per impostazione predefinita).

* Mantieni il valore predefinito `ports: - "127.0.0.1:9000:9000"` in `docker-compose.yml` per garantire che Listmonk sia accessibile solo localmente.
* Configura il reverse proxy scelto per l'ascolto sulle porte 80 e 443, gestire l'acquisizione del certificato SSL (ad esempio, tramite Let's Encrypt) e inoltrare il traffico a `http://127.0.0.1:9000`.
* La configurazione dettagliata del reverse proxy esula dallo scopo di questa guida, ma sono disponibili numerosi tutorial online.

### 6. Avvia Listmonk {#6-start-listmonk}

Torna alla directory `listmonk` (se non ci sei già) e avvia i contenitori in modalità distaccata.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker scaricherà le immagini necessarie e avvierà l'applicazione Listmonk e i contenitori del database. La prima volta, l'operazione potrebbe richiedere uno o due minuti.

✅ **Accesso a Listmonk**: Ora dovresti essere in grado di accedere all'interfaccia web di Listmonk tramite il dominio configurato (ad esempio, `https://listmonk.yourdomain.com`).

### 7. Configurare l'inoltro email SMTP in Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Successivamente, configura Listmonk per inviare email tramite il tuo account Forward Email.

1. **Abilita SMTP in Inoltra Email**: Assicurati di aver generato le credenziali SMTP nella dashboard del tuo account Inoltra Email. Segui il link [Guida all'inoltro e-mail per inviare e-mail con un dominio personalizzato tramite SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) se non l'hai già fatto.
2. **Configura Listmonk**: Accedi al pannello di amministrazione di Listmonk.
* Vai a **Impostazioni -> SMTP**.

* Listmonk supporta l'inoltro email. Seleziona **InoltraEmail** dall'elenco dei provider o inserisci manualmente i seguenti dati:

| Collocamento | Valore |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Ospite** | `smtp.forwardemail.net` |
| **Porta** | `465` |
| **Protocollo di autorizzazione** | `LOGIN` |
| **Nome utente** | La tua email di inoltro **Nome utente SMTP** |
| **Password** | La tua email di inoltro **password SMTP** |
| **TLS** | `SSL/TLS` |
| **Dalla posta elettronica** | L'indirizzo `From` desiderato (ad esempio, `newsletter@yourdomain.com`). Assicurati che questo dominio sia configurato in Inoltra email. |

* **Importante**: utilizzare sempre la porta `465` con `SSL/TLS` per connessioni sicure con Inoltra Email. Non utilizzare STARTTLS (porta 587).

* Fai clic su **Salva**.
3. **Invia email di prova**: Utilizza il pulsante "Invia email di prova" nella pagina delle impostazioni SMTP. Inserisci un indirizzo del destinatario a cui puoi accedere e fai clic su **Invia**. Verifica che l'email arrivi nella posta in arrivo del destinatario.

### 8. Configura l'elaborazione dei rimbalzi {#8-configure-bounce-processing}

L'elaborazione dei bounce consente a Listmonk di gestire automaticamente le email che non sono state recapitate (ad esempio, a causa di indirizzi non validi). Inoltra email fornisce un webhook per notificare a Listmonk i bounce.

#### Impostazione inoltro e-mail {#forward-email-setup}

1. Accedi al tuo [Dashboard di inoltro e-mail](https://forwardemail.net/).
2. Vai a **Domini**, seleziona il dominio che stai utilizzando per l'invio e vai alla sua pagina **Impostazioni**.
3. Scorri verso il basso fino alla sezione **URL Webhook di Rimbalzo**.
4. Inserisci il seguente URL, sostituendo `<your_listmonk_domain>` con il dominio o sottodominio effettivo a cui è accessibile la tua istanza di Listmonk:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Esempio*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scorri ulteriormente verso il basso fino alla sezione **Chiave di Verifica del Payload della Firma del Webhook**.
6. **Copia** la chiave di verifica generata. Ti servirà in Listmonk.
7. Salva le modifiche nelle impostazioni del tuo dominio di Inoltro Email.

#### Configurazione Listmonk {#listmonk-setup}

1. Nel pannello di amministrazione di Listmonk, vai a **Impostazioni -> Rimbalzi**.
2. Abilita **Abilita elaborazione bounce**.
3. Abilita **Abilita webhook bounce**.
4. Scorri verso il basso fino alla sezione **Provider webhook**.
5. Abilita **Inoltra email**.
6. Incolla la **Chiave di verifica del payload della firma webhook** copiata dalla dashboard di Inoltra email nel campo **Chiave di inoltro email**.
7. Fai clic su **Salva** in fondo alla pagina.
8. L'elaborazione bounce è ora configurata! Quando Inoltra email rileva un bounce per un'email inviata da Listmonk, ne informerà l'istanza di Listmonk tramite il webhook e Listmonk contrassegnerà l'iscritto di conseguenza.
9. Completa i passaggi seguenti in [Prova](#testing) per assicurarti che tutto funzioni correttamente.

## Test in corso {#testing}

Ecco una rapida panoramica delle funzioni principali di Listmonk:

### Crea una mailing list {#create-a-mailing-list}

* Vai a **Liste** nella barra laterale.
* Fai clic su **Nuova lista**.
* Inserisci i dettagli (Nome, Tipo: Pubblico/Privato, Descrizione, Tag) e **Salva**.

### Aggiungi iscritti {#add-subscribers}

* Vai alla sezione **Iscritti**.
* Puoi aggiungere iscritti:
* **Manualmente**: Fai clic su **Nuovo iscritto**.
* **Importa**: Fai clic su **Importa iscritti** per caricare un file CSV.
* **API**: Utilizza l'API Listmonk per aggiunte programmatiche.
* Assegna gli iscritti a una o più liste durante la creazione o l'importazione.
* **Best Practice**: Utilizza un processo di doppio opt-in. Configuralo in **Impostazioni -> Opt-in e Iscrizioni**.

### Crea e invia una campagna {#create-and-send-a-campaign}

* Vai a **Campagne** -> **Nuova campagna**.
* Inserisci i dettagli della campagna (Nome, Oggetto, Email del mittente, Lista/e a cui inviare).
* Scegli il tipo di contenuto (Rich Text/HTML, Testo normale, HTML grezzo).
* Componi il contenuto dell'email. Puoi utilizzare variabili modello come `{{ .Subscriber.Email }}` o `{{ .Subscriber.FirstName }}`.
* **Invia sempre prima un'email di prova!** Utilizza l'opzione "Invia prova" per visualizzare l'email nella tua casella di posta.
* Una volta soddisfatto, fai clic su **Avvia campagna** per inviarla immediatamente o programmarla per un secondo momento.

## Verifica {#verification}

* **Invio SMTP**: Invia regolarmente email di prova tramite la pagina delle impostazioni SMTP di Listmonk e testa le campagne per assicurarti che le email vengano recapitate correttamente.
* **Gestione dei bounce**: Invia una campagna di prova a un indirizzo email non valido noto (ad esempio, `bounce-test@yourdomain.com` se non ne hai uno reale a portata di mano, anche se i risultati possono variare). Controlla le statistiche della campagna in Listmonk dopo un po' per vedere se il bounce è stato registrato.
* **Intestazioni email**: Utilizza strumenti come [Tester di posta](https://www.mail-tester.com/) o ispeziona manualmente le intestazioni email per verificare che SPF, DKIM e DMARC vengano superati, a indicare la corretta configurazione tramite Inoltra email.
* **Log di Inoltra email**: Controlla i log della dashboard di Inoltra email se sospetti che problemi di recapito provengano dal server SMTP.

## Note per gli sviluppatori {#developer-notes}

* **Templating**: Listmonk utilizza il motore di template di Go. Esplora la sua documentazione per una personalizzazione avanzata: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk fornisce un'API REST completa per la gestione di liste, iscritti, campagne, template e altro ancora. Trova il link alla documentazione dell'API nel footer della tua istanza di Listmonk.
* **Campi personalizzati**: Definisci campi personalizzati per gli iscritti in **Impostazioni -> Campi iscritti** per memorizzare dati aggiuntivi.
* **Webhook**: Oltre ai bounce, Listmonk può inviare webhook per altri eventi (ad esempio, iscrizioni), consentendo l'integrazione con altri sistemi.

## Conclusione {#conclusion}

Integrando la potenza self-hosted di Listmonk con la consegna sicura e rispettosa della privacy di Forward Email, crei una piattaforma di email marketing solida ed etica. Mantieni la piena proprietà dei dati del tuo pubblico, beneficiando al contempo di un'elevata deliverability e di funzionalità di sicurezza automatizzate.

Questa configurazione fornisce un'alternativa scalabile, conveniente e di facile utilizzo per gli sviluppatori ai servizi di posta elettronica proprietari, allineandosi perfettamente con la filosofia del software open source e con la privacy degli utenti.

Buon invio! 🚀