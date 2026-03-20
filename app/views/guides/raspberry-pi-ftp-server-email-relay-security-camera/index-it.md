# Trasforma il tuo Raspberry Pi in un Server FTP Sicuro con Relay Email {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Hai un Raspberry Pi che prende polvere? Che sia l’ultimo Pi 5, un Pi 4, Pi Zero o anche un modello più vecchio, questa guida ti mostrerà come trasformarlo in un potente server di file automatizzato con capacità di relay email. Perfetto per telecamere di sicurezza, dispositivi IoT e altro.

**Compatibile con:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W e Raspberry Pi Zero.

> \[!NOTE]
> Questa guida è stata testata e verificata su un Raspberry Pi 3 Model B con Ubuntu Server 22.04 LTS.


## Indice {#table-of-contents}

* [Cosa Stiamo Costruendo](#what-were-building)
* [Parte 1: Installare Ubuntu Server sul tuo Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Cosa Ti Serve](#what-youll-need)
  * [Flashare il Sistema Operativo](#flashing-the-os)
  * [Avvio e Connessione](#booting-up--connecting)
* [Parte 2: Configurare un Server FTP Sicuro](#part-2-setting-up-a-secure-ftp-server)
  * [Installazione e Configurazione](#installation--configuration)
  * [Creare un Utente FTP](#creating-an-ftp-user)
* [Parte 3: Firewall e Protezione da Attacchi Brute-Force](#part-3-firewall-and-brute-force-protection)
  * [Configurare UFW](#setting-up-ufw)
  * [Configurare Fail2ban](#setting-up-fail2ban)
* [Parte 4: Elaborazione Automatica dei File con Notifiche Email](#part-4-automated-file-processing-with-email-notifications)
  * [Opzione 1: Usare Forward Email API (Consigliato)](#option-1-using-forward-email-api-recommended)
  * [Opzione 2: Usare Altri Provider Email](#option-2-using-other-email-providers)
  * [Creare un Servizio Systemd](#create-a-systemd-service)
* [Parte 5: Opzioni Email per Dispositivi Legacy](#part-5-email-options-for-legacy-devices)
  * [Opzione 1: Usa le Porte Legacy TLS 1.0 di Forward Email (Consigliato)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Opzione 2: Configura un Relay SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Risoluzione dei Problemi](#troubleshooting)
* [Conclusioni](#wrapping-up)


## Cosa Stiamo Costruendo {#what-were-building}

Questa guida ti guiderà nella configurazione di un sistema completo che include:

* **Ubuntu Server 22.04 LTS:** Un sistema operativo solido e leggero per il Pi.
* **Un Server FTP Sicuro (vsftpd):** Per caricare file in modo sicuro.
* **Un Firewall (UFW) & Fail2ban:** Per tenere fuori i malintenzionati.
* **Un Elaboratore di File Automatico:** Uno script che prende i nuovi file, li invia via email come allegati e poi si pulisce da solo.
* **Opzioni Email per Dispositivi Legacy:** Due approcci per dispositivi che non supportano TLS moderno:
  * Usa le porte legacy TLS 1.0 di Forward Email (la più semplice)
  * Configura un relay SMTP Postfix (funziona con qualsiasi provider email)

Pronto? Iniziamo.


## Parte 1: Installare Ubuntu Server sul tuo Pi {#part-1-getting-ubuntu-server-on-your-pi}

Prima di tutto, installa Ubuntu Server sul Raspberry Pi. È sorprendentemente facile grazie al Raspberry Pi Imager.

### Cosa Ti Serve {#what-youll-need}

* Qualsiasi Raspberry Pi compatibile (vedi lista sopra)
* Una scheda microSD (minimo 8GB, consigliati 16GB+)
* Un computer con lettore di schede microSD
* Alimentatore adeguato per il tuo modello di Pi
* Accesso a Internet (Ethernet o Wi-Fi)

> \[!NOTE]
> I modelli più vecchi come Raspberry Pi 2 o Pi Zero potrebbero essere più lenti ma funzioneranno bene per questa configurazione.

### Flashare il Sistema Operativo {#flashing-the-os}

1. **Scarica Raspberry Pi Imager:** Scaricalo dal [sito ufficiale](https://www.raspberrypi.com/software/).

2. **Scegli il Sistema Operativo:** Nell’imager, seleziona "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Per modelli 64-bit (Pi 3, 4, 5, Zero 2 W), scegli **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Per modelli più vecchi a 32-bit (Pi 2, Pi Zero, Pi Zero W), scegli **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Seleziona la Memoria:** Scegli la tua scheda microSD.

> \[!WARNING]
> Questo cancellerà completamente la tua scheda microSD. Assicurati di aver fatto il backup di tutto ciò che è importante.

4. **Le Opzioni Avanzate sono tue Amiche:** Clicca sull’icona dell’ingranaggio (⚙️) per configurare il Pi in modalità headless (senza monitor o tastiera).
   * **Hostname:** Dai un nome al tuo Pi (es. `pi-server`).
   * **SSH:** Abilitalo e imposta un nome utente e una password.
   * **Wi-Fi:** Se non usi Ethernet, inserisci i dati della tua rete Wi-Fi.
   * **Locale:** Imposta il fuso orario e la disposizione della tastiera.
5. **Scrivi!** Clicca sul pulsante "WRITE" e lascia che l'imager faccia il suo lavoro.

### Avvio e Connessione {#booting-up--connecting}

Una volta che l'imager ha finito, inserisci la scheda microSD nel Pi e collegalo. Aspetta qualche minuto per l'avvio. Sta eseguendo alcune configurazioni iniziali in background. Trova il suo indirizzo IP dalla pagina di amministrazione del router, quindi connettiti via SSH:

```bash
ssh your_username@your_pi_ip_address
```

Sei dentro! Il Raspberry Pi è ora pronto per la configurazione.


## Parte 2: Configurazione di un Server FTP Sicuro {#part-2-setting-up-a-secure-ftp-server}

Successivamente, configura `vsftpd` (Very Secure FTP Daemon), configurato per la massima sicurezza.

### Installazione e Configurazione {#installation--configuration}

1. **Installa vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Backup del file di configurazione:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Modifica la configurazione:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Se una riga è commentata (inizia con `#`), decommentala rimuovendo il `#`.

Apporta queste modifiche:

| Impostazione             | Valore | Scopo                                                     |
| ------------------------ | ------ | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`   | Disabilita l'accesso FTP anonimo                          |
| `local_enable`           | `YES`  | Permetti agli utenti locali di effettuare il login        |
| `write_enable`           | `YES`  | Abilita il caricamento di file                            |
| `local_umask`            | `022`  | Imposta i permessi dei file (644 per file, 755 per cartelle) |
| `chroot_local_user`      | `YES`  | Limita gli utenti alla loro directory home                |
| `allow_writeable_chroot` | `YES`  | Permetti caricamenti nella jail chroot                    |

4. **Aggiungi l'intervallo di porte passive:** Aggiungi queste righe alla fine del file. Necessario per il firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Abilita il logging:** Aggiungi queste righe per abilitare il logging per Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Salva e riavvia:** Premi `Ctrl+O`, `Invio`, `Ctrl+X`, quindi riavvia il servizio:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Creazione di un Utente FTP {#creating-an-ftp-user}

Crea un utente dedicato e limitato per l'accesso FTP.

1. **Crea l'utente:**

   ```bash
   sudo adduser ftpuser
   ```

   Segui le istruzioni per impostare una password. Gli altri campi (nome, telefono, ecc.) possono essere lasciati vuoti.

2. **Crea la struttura delle directory:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Directory principale FTP  
   * `/home/ftpuser/ftp/uploads` - Dove verranno caricati i file

3. **Imposta i permessi:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Parte 3: Firewall e Protezione da Attacchi Brute-Force {#part-3-firewall-and-brute-force-protection}

Proteggi il Pi con UFW (Uncomplicated Firewall) e Fail2ban.

### Configurazione di UFW {#setting-up-ufw}

1. **Installa UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Imposta le politiche predefinite:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Consenti SSH (critico!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Consenti sempre SSH prima di abilitare il firewall, altrimenti ti bloccherai fuori!

4. **Consenti le porte FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Abilita il firewall:**

   ```bash
   sudo ufw enable
   ```

### Configurazione di Fail2ban {#setting-up-fail2ban}

Fail2ban blocca automaticamente gli indirizzi IP dopo ripetuti tentativi di login falliti.

1. **Installa Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Crea una configurazione locale:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Aggiungi queste configurazioni:**
   ```ini
   [DEFAULT]
   bantime = 3600
   findtime = 600
   maxretry = 5

   [sshd]
   enabled = true
   port = ssh
   logpath = /var/log/auth.log

   [vsftpd]
   enabled = true
   port = ftp,ftp-data,40000:50000
   logpath = /var/log/vsftpd.log
   maxretry = 3
   ```

4. **Restart Fail2ban:**

   ```bash
   sudo systemctl restart fail2ban
   ```


## Part 4: Automated File Processing with Email Notifications {#part-4-automated-file-processing-with-email-notifications}

Now for the magic: a script that monitors the FTP folder, emails new files as attachments, and deletes them. There are two approaches depending on your email provider:

### Option 1: Using Forward Email API (Recommended) {#option-1-using-forward-email-api-recommended}

If you have a Forward Email account, use the Email API for the most reliable delivery.

#### Get Your API Key {#get-your-api-key}

1. Log in to [Forward Email](https://forwardemail.net)
2. Navigate to [My Account → Security](https://forwardemail.net/my-account/security)
3. Scroll down to the **"Developer Access"** section at the bottom
4. Copy your API key

> \[!WARNING]
> Keep your API key private at all times. Never share it publicly or commit it to version control.

> \[!NOTE]
> The Enhanced Protection plan ($3/month) or higher is required for API access.

#### Install inotify-tools {#install-inotify-tools}

```bash
sudo apt install inotify-tools -y
```

#### Create the Monitoring Script {#create-the-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="noreply@yourdomain.com"
TO_EMAIL="your-email@example.com"
API_KEY="your_forward_email_api_key"  # Replace with your actual API key

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Base64 encode the file
    FILE_CONTENT=$(base64 -w 0 "$FILEPATH")

    # Send email with attachment via Forward Email API
    RESPONSE=$(curl -X POST https://api.forwardemail.net/v1/emails \
      -u "$API_KEY:" \
      -H "Content-Type: application/json" \
      -d '{
        "from": "'"$FROM_EMAIL"'",
        "to": "'"$TO_EMAIL"'",
        "subject": "'"$SUBJECT"'",
        "text": "New file uploaded: '"$FILENAME"'",
        "attachments": [
          {
            "filename": "'"$FILENAME"'",
            "content": "'"$FILE_CONTENT"'",
            "encoding": "base64"
          }
        ]
      }')

    # Check if email was sent successfully
    if echo "$RESPONSE" | grep -q '"statusCode":200'; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
        echo "Response: $RESPONSE"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Option 2: Using Other Email Providers {#option-2-using-other-email-providers}

If you prefer to use Gmail, Outlook, Yahoo, or another provider, modify the script to use `sendmail` or `msmtp` instead of the Forward Email API.

#### Install msmtp {#install-msmtp}

```bash
sudo apt install msmtp msmtp-mta -y
```

#### Configure msmtp {#configure-msmtp}

Create the configuration file:

```bash
sudo nano /etc/msmtprc
```

Add your provider's settings (example for Gmail):

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        gmail
host           smtp.gmail.com
port           587
from           your-email@gmail.com
user           your-email@gmail.com
password       your-app-password

account default : gmail
```

Secure the file:

```bash
sudo chmod 600 /etc/msmtprc
```

#### Create the Alternative Monitoring Script {#create-the-alternative-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="your-email@gmail.com"
TO_EMAIL="recipient@example.com"

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Send email with attachment using msmtp
    (
        echo "To: $TO_EMAIL"
        echo "From: $FROM_EMAIL"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: multipart/mixed; boundary=\"BOUNDARY\""
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: text/plain; charset=utf-8"
        echo ""
        echo "New file uploaded: $FILENAME"
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: application/octet-stream; name=\"$FILENAME\""
        echo "Content-Transfer-Encoding: base64"
        echo "Content-Disposition: attachment; filename=\"$FILENAME\""
        echo ""
        base64 "$FILEPATH"
        echo ""
        echo "--BOUNDARY--"
    ) | msmtp -t

    # Check if email was sent successfully
    if [ $? -eq 0 ]; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
    fi
done
```

Rendilo eseguibile:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Crea un servizio Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Aggiungi questo contenuto:

```ini
[Unit]
Description=FTP Upload Monitor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Abilita e avvia il servizio:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Controlla lo stato:

```bash
sudo systemctl status ftp-monitor.service
```


## Parte 5: Opzioni Email per Dispositivi Legacy {#part-5-email-options-for-legacy-devices}

Dispositivi come le telecamere FOSSCAM spesso non supportano le versioni moderne di TLS. Ci sono due soluzioni:

### Opzione 1: Usa le porte Legacy TLS 1.0 di Forward Email (Consigliato) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Se usi Forward Email, questa è la soluzione più semplice. Forward Email fornisce porte dedicate legacy TLS 1.0 specificamente per dispositivi più vecchi come telecamere, stampanti, scanner e fax.

#### Prezzi {#pricing}

Forward Email offre diversi piani:

| Piano                   | Prezzo       | Caratteristiche                        |
| ----------------------- | ------------ | ------------------------------------ |
| Gratis                  | $0/mese      | Solo inoltro email (nessuna invio)  |
| **Protezione Avanzata** | **$3/mese**  | **Accesso SMTP + porte legacy TLS 1.0** |
| Team                    | $9/mese      | Protezione avanzata + funzionalità team |
| Enterprise              | $250/mese    | Team + richieste API illimitate      |

> \[!IMPORTANT]
> Il **piano Protezione Avanzata ($3/mese)** o superiore è richiesto per l'accesso SMTP e il supporto delle porte legacy TLS 1.0.

Scopri di più su [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Genera la tua password {#generate-your-password}

Prima di configurare il dispositivo, genera una password su Forward Email:

1. Accedi a [Forward Email](https://forwardemail.net)
2. Vai su **Il mio account → Domini → \[Il tuo dominio] → Alias**
3. Crea o seleziona un alias (es. `camera@iltuodominio.com`)
4. Clicca su **"Genera Password"** accanto all'alias
5. Copia la password generata - la userai per l'autenticazione SMTP

> \[!TIP]
> Ogni alias può avere una propria password. Utile per tracciare quale dispositivo ha inviato quale email.

#### Configura il tuo dispositivo {#configure-your-device}

Usa queste impostazioni nella tua telecamera, stampante, scanner o altro dispositivo legacy:

| Impostazione    | Valore                                           |
| --------------- | ------------------------------------------------ |
| Server SMTP    | `smtp.forwardemail.net`                          |
| Porta (SSL/TLS) | `2455`                                           |
| Porta (STARTTLS)| `2555` (alternativa)                             |
| Nome utente    | La tua email alias (es. `camera@iltuodominio.com`) |
| Password      | La password generata da "Genera Password"        |
| Autenticazione | Richiesta                                        |
| Crittografia  | SSL/TLS (consigliato) o STARTTLS                  |

> \[!WARNING]
> Queste porte usano il protocollo TLS 1.0 deprecato che presenta vulnerabilità note (BEAST, POODLE). Usale solo se il tuo dispositivo non supporta TLS 1.2+ moderno.

Configura semplicemente il dispositivo con queste impostazioni e invierà email direttamente tramite Forward Email senza bisogno di un server relay locale.

Per maggiori dettagli, consulta la [FAQ di Forward Email sul supporto Legacy TLS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Opzione 2: Configura un relay SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Se non usi Forward Email, o preferisci una soluzione relay locale, configura Postfix sul Raspberry Pi per agire da intermediario. Funziona con qualsiasi provider email (Gmail, Outlook, Yahoo, AOL, ecc.).

#### Installa Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Durante l'installazione:

* Seleziona **"Internet Site"**
* Inserisci il nome host del tuo Pi (es. `raspberrypi-ftp`) per "System mail name"

#### Scegli il tuo provider email {#choose-your-email-provider}

| Provider | Server SMTP           | Porta | Password App richiesta? |
| -------- | --------------------- | ----- | ----------------------- |
| Gmail    | smtp.gmail.com        | 587   | Sì                      |
| Outlook  | smtp-mail.outlook.com | 587   | Sì                      |
| Yahoo    | smtp.mail.yahoo.com   | 465   | Sì                      |
| AOL      | smtp.aol.com          | 587   | Sì                      |

#### Ottieni una password specifica per l'app {#get-an-app-specific-password}

La maggior parte dei provider richiede password per app per applicazioni di terze parti. Generane una dalle impostazioni di sicurezza del tuo provider email:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Non usare mai la tua password email normale. Usa sempre una password specifica per l'app.

#### Configura l'autenticazione SASL {#configure-sasl-authentication}

Crea il file password per il provider scelto. Questo esempio usa Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Aggiungi questa riga (adatta server e porta per il tuo provider):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Per Gmail, usa:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Proteggi e crea l'hash del file:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Configura la mappatura degli indirizzi email {#configure-email-address-mapping}

Riscrivi gli indirizzi email locali per farli corrispondere al tuo provider email:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Aggiungi questa riga (sostituisci `HOSTNAME` con il nome host del tuo Pi e usa la tua email):

```
/.+@HOSTNAME/    your_email@provider.com
```

Esempio:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Proteggi il file:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Configura le impostazioni principali di Postfix {#configure-postfix-main-settings}

Modifica la configurazione principale:

```bash
sudo nano /etc/postfix/main.cf
```

Trova e aggiorna il relay host (o aggiungilo alla fine):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Aggiungi queste impostazioni alla fine del file:

```
# Configurazione SMTP Relay
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Impostazioni di rete
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Per Gmail (porta 587), imposta `smtp_tls_wrappermode = no` invece di `yes`.

> \[!WARNING]
> Aggiorna `mynetworks` con il tuo intervallo di rete reale. Aggiungi solo reti fidate - qualsiasi dispositivo su queste reti può inviare mail senza autenticazione.

**Intervalli di rete comuni:**

| Intervallo di rete | Intervallo indirizzi IP       |
| ------------------ | ----------------------------- |
| `192.168.0.0/24`   | 192.168.0.1 - 192.168.0.254   |
| `192.168.1.0/24`   | 192.168.1.1 - 192.168.1.254   |
| `10.0.0.0/8`       | 10.0.0.0 - 10.255.255.255     |

#### Aggiorna il firewall e riavvia {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP per dispositivi locali'
sudo systemctl restart postfix
```

Verifica che Postfix sia in esecuzione:

```bash
sudo systemctl status postfix
```

#### Testa il relay {#test-the-relay}

Invia una mail di prova:

```bash
echo "Test da Postfix" | mail -s "Test" your_email@provider.com
```

Controlla i log:

```bash
sudo tail -f /var/log/mail.log
```

Cerca `status=sent` per confermare il successo.

#### Configura il tuo dispositivo {#configure-your-device-1}

Nelle impostazioni della tua telecamera o dispositivo:
* **Server SMTP:** L'indirizzo IP del tuo Pi (es. `192.168.1.100`)
* **Porta SMTP:** `25`
* **Autenticazione:** Nessuna
* **Crittografia:** Nessuna (solo rete locale)


## Risoluzione dei problemi {#troubleshooting}

Se si verificano problemi, controlla questi file di log:

**Server FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Monitoraggio file:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Visualizza la coda della posta
```


## Conclusione {#wrapping-up}

Il Raspberry Pi è ora un sistema completo e automatizzato con caricamenti file sicuri, notifiche email automatiche con allegati e capacità di relay SMTP per dispositivi legacy. Sia utilizzando le porte TLS legacy di Forward Email sia un relay Postfix locale, i dispositivi più vecchi possono ora inviare email in modo affidabile tramite provider email moderni.
