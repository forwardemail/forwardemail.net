# Transformez votre Raspberry Pi en serveur FTP sécurisé avec relais email {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Vous avez un Raspberry Pi qui prend la poussière ? Que ce soit le dernier Pi 5, un Pi 4, Pi Zero, ou même un modèle plus ancien, ce guide vous montrera comment le transformer en un serveur de fichiers puissant et automatisé avec des capacités de relais email. Parfait pour les caméras de sécurité, les appareils IoT, et plus encore.

**Compatible avec :** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, et Raspberry Pi Zero.

> \[!NOTE]
> Ce guide a été testé et vérifié sur un Raspberry Pi 3 Model B fonctionnant sous Ubuntu Server 22.04 LTS.


## Table des matières {#table-of-contents}

* [Ce que nous construisons](#what-were-building)
* [Partie 1 : Installer Ubuntu Server sur votre Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Ce dont vous aurez besoin](#what-youll-need)
  * [Flasher le système d’exploitation](#flashing-the-os)
  * [Démarrage et connexion](#booting-up--connecting)
* [Partie 2 : Configuration d’un serveur FTP sécurisé](#part-2-setting-up-a-secure-ftp-server)
  * [Installation et configuration](#installation--configuration)
  * [Création d’un utilisateur FTP](#creating-an-ftp-user)
* [Partie 3 : Pare-feu et protection contre les attaques par force brute](#part-3-firewall-and-brute-force-protection)
  * [Configuration de UFW](#setting-up-ufw)
  * [Configuration de Fail2ban](#setting-up-fail2ban)
* [Partie 4 : Traitement automatisé des fichiers avec notifications par email](#part-4-automated-file-processing-with-email-notifications)
  * [Option 1 : Utiliser l’API Forward Email (recommandé)](#option-1-using-forward-email-api-recommended)
  * [Option 2 : Utiliser d’autres fournisseurs d’email](#option-2-using-other-email-providers)
  * [Créer un service Systemd](#create-a-systemd-service)
* [Partie 5 : Options email pour appareils anciens](#part-5-email-options-for-legacy-devices)
  * [Option 1 : Utiliser les ports TLS 1.0 legacy de Forward Email (recommandé)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Option 2 : Configurer un relais SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Dépannage](#troubleshooting)
* [Conclusion](#wrapping-up)


## Ce que nous construisons {#what-were-building}

Ce guide vous accompagnera dans la mise en place d’un système complet comprenant :

* **Ubuntu Server 22.04 LTS :** Un système d’exploitation léger et fiable pour le Pi.
* **Un serveur FTP sécurisé (vsftpd) :** Pour déposer des fichiers en toute sécurité.
* **Un pare-feu (UFW) & Fail2ban :** Pour empêcher les intrusions.
* **Un processeur de fichiers automatisé :** Un script qui récupère les nouveaux fichiers, les envoie par email en pièce jointe, puis nettoie après lui.
* **Options email pour appareils anciens :** Deux approches pour les appareils ne supportant pas TLS moderne :
  * Utiliser les ports TLS 1.0 legacy de Forward Email (le plus simple)
  * Configurer un relais SMTP Postfix (compatible avec tout fournisseur email)

Prêt ? Allons-y.


## Partie 1 : Installer Ubuntu Server sur votre Pi {#part-1-getting-ubuntu-server-on-your-pi}

Tout d’abord, installez Ubuntu Server sur le Raspberry Pi. C’est étonnamment simple grâce au Raspberry Pi Imager.

### Ce dont vous aurez besoin {#what-youll-need}

* N’importe quel Raspberry Pi compatible (voir la liste ci-dessus)
* Une carte microSD (minimum 8 Go, 16 Go+ recommandé)
* Un ordinateur avec un lecteur de carte microSD
* Une alimentation adaptée à votre modèle de Pi
* Accès Internet (Ethernet ou Wi-Fi)

> \[!NOTE]
> Les modèles plus anciens comme le Raspberry Pi 2 ou Pi Zero peuvent être plus lents mais fonctionneront parfaitement pour cette configuration.

### Flasher le système d’exploitation {#flashing-the-os}

1. **Téléchargez le Raspberry Pi Imager :** Téléchargez-le depuis le [site officiel](https://www.raspberrypi.com/software/).

2. **Choisissez le système d’exploitation :** Dans l’imager, sélectionnez « CHOOSE OS » > « Other general-purpose OS » > « Ubuntu ».
   * Pour les modèles 64 bits (Pi 3, 4, 5, Zero 2 W), choisissez **« Ubuntu Server 22.04.1 LTS (64-bit) »**.
   * Pour les modèles 32 bits plus anciens (Pi 2, Pi Zero, Pi Zero W), choisissez **« Ubuntu Server 22.04.1 LTS (32-bit) »**.

3. **Choisissez votre stockage :** Sélectionnez votre carte microSD.

> \[!WARNING]
> Cela effacera complètement votre carte microSD. Assurez-vous d’avoir sauvegardé tout ce qui est important.

4. **Les options avancées sont vos amies :** Cliquez sur l’icône d’engrenage (⚙️) pour configurer le Pi en mode sans tête (pas besoin de moniteur ni clavier).
   * **Nom d’hôte :** Donnez un nom à votre Pi (ex. `pi-server`).
   * **SSH :** Activez-le et définissez un nom d’utilisateur et un mot de passe.
   * **Wi-Fi :** Si vous n’utilisez pas Ethernet, entrez vos informations Wi-Fi.
   * **Paramètres régionaux :** Configurez votre fuseau horaire et la disposition du clavier.
5. **Écrivez !** Cliquez sur le bouton "WRITE" et laissez l'imager faire son travail.

### Démarrage et connexion {#booting-up--connecting}

Une fois que l'imager a terminé, insérez la carte microSD dans le Pi et branchez-le. Laissez-lui quelques minutes pour démarrer. Il effectue une configuration initiale en arrière-plan. Trouvez son adresse IP depuis la page d'administration de votre routeur, puis connectez-vous via SSH :

```bash
ssh your_username@your_pi_ip_address
```

Vous y êtes ! Le Raspberry Pi est maintenant prêt pour la configuration.


## Partie 2 : Configuration d'un serveur FTP sécurisé {#part-2-setting-up-a-secure-ftp-server}

Ensuite, configurez `vsftpd` (Very Secure FTP Daemon), configuré pour une sécurité maximale.

### Installation et configuration {#installation--configuration}

1. **Installer vsftpd :**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Sauvegarder le fichier de configuration :**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Modifier la configuration :**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Si une ligne est commentée (commence par un `#`), décommentez-la en supprimant le `#`.

Effectuez ces modifications :

| Paramètre                | Valeur | But                                                       |
| ------------------------ | ------ | --------------------------------------------------------- |
| `anonymous_enable`       | `NO`   | Désactiver l'accès FTP anonyme                            |
| `local_enable`           | `YES`  | Autoriser les utilisateurs locaux à se connecter          |
| `write_enable`           | `YES`  | Autoriser les téléchargements de fichiers                  |
| `local_umask`            | `022`  | Définir les permissions des fichiers (644 pour fichiers, 755 pour dossiers) |
| `chroot_local_user`      | `YES`  | Restreindre les utilisateurs à leur répertoire personnel  |
| `allow_writeable_chroot` | `YES`  | Autoriser les téléchargements dans le chroot jail          |

4. **Ajouter la plage de ports passifs :** Ajoutez ces lignes à la fin du fichier. Ceci est nécessaire pour le pare-feu.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Activer la journalisation :** Ajoutez ces lignes pour activer la journalisation pour Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Enregistrer et redémarrer :** Appuyez sur `Ctrl+O`, `Entrée`, `Ctrl+X`, puis redémarrez le service :

   ```bash
   sudo systemctl restart vsftpd
   ```

### Création d'un utilisateur FTP {#creating-an-ftp-user}

Créez un utilisateur dédié et restreint pour l'accès FTP.

1. **Créer l'utilisateur :**

   ```bash
   sudo adduser ftpuser
   ```

   Suivez les instructions pour définir un mot de passe. Les autres champs (nom, téléphone, etc.) peuvent être laissés vides.

2. **Créer la structure des répertoires :**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Répertoire FTP principal  
   * `/home/ftpuser/ftp/uploads` - Où les fichiers seront téléchargés

3. **Définir les permissions :**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Partie 3 : Pare-feu et protection contre les attaques par force brute {#part-3-firewall-and-brute-force-protection}

Sécurisez le Pi avec UFW (Uncomplicated Firewall) et Fail2ban.

### Configuration de UFW {#setting-up-ufw}

1. **Installer UFW :**

   ```bash
   sudo apt install ufw -y
   ```

2. **Définir les politiques par défaut :**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Autoriser SSH (critique !) :**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Autorisez toujours SSH avant d'activer le pare-feu, sinon vous risquez de vous verrouiller dehors !

4. **Autoriser les ports FTP :**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Activer le pare-feu :**

   ```bash
   sudo ufw enable
   ```

### Configuration de Fail2ban {#setting-up-fail2ban}

Fail2ban bloque automatiquement les adresses IP après plusieurs tentatives de connexion échouées.

1. **Installer Fail2ban :**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Créer une configuration locale :**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Ajouter ces configurations :**
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

Rendez-le exécutable :

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Créer un service Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Ajoutez ce contenu :

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

Activez et démarrez le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Vérifiez le statut :

```bash
sudo systemctl status ftp-monitor.service
```


## Partie 5 : Options Email pour les appareils anciens {#part-5-email-options-for-legacy-devices}

Les appareils comme les caméras FOSSCAM ne supportent souvent pas les versions modernes de TLS. Il existe deux solutions :

### Option 1 : Utiliser les ports TLS 1.0 Legacy de Forward Email (Recommandé) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Si vous utilisez Forward Email, c’est la solution la plus simple. Forward Email fournit des ports dédiés TLS 1.0 legacy spécialement pour les appareils plus anciens comme les caméras, imprimantes, scanners et fax.

#### Tarification {#pricing}

Forward Email propose plusieurs forfaits :

| Forfait                 | Prix         | Fonctionnalités                        |
| ----------------------- | ------------ | ------------------------------------ |
| Gratuit                 | 0 $/mois     | Redirection d’email uniquement (pas d’envoi) |
| **Protection améliorée**| **3 $/mois** | **Accès SMTP + ports TLS 1.0 legacy**|
| Équipe                  | 9 $/mois     | Protection améliorée + fonctionnalités équipe |
| Entreprise              | 250 $/mois   | Équipe + requêtes API illimitées     |

> \[!IMPORTANT]
> Le **forfait Protection améliorée (3 $/mois)** ou supérieur est requis pour l’accès SMTP et la prise en charge des ports TLS 1.0 legacy.

En savoir plus sur [Tarification Forward Email](https://forwardemail.net/en/pricing).

#### Générez votre mot de passe {#generate-your-password}

Avant de configurer votre appareil, générez un mot de passe dans Forward Email :

1. Connectez-vous à [Forward Email](https://forwardemail.net)
2. Allez dans **Mon compte → Domaines → \[Votre domaine] → Alias**
3. Créez ou sélectionnez un alias (ex. `camera@votredomaine.com`)
4. Cliquez sur **"Générer un mot de passe"** à côté de l’alias
5. Copiez le mot de passe généré - vous l’utiliserez pour l’authentification SMTP

> \[!TIP]
> Chaque alias peut avoir son propre mot de passe. Utile pour savoir quel appareil a envoyé quel email.

#### Configurez votre appareil {#configure-your-device}

Utilisez ces paramètres dans votre caméra, imprimante, scanner ou autre appareil legacy :

| Paramètre       | Valeur                                           |
| --------------- | ------------------------------------------------ |
| Serveur SMTP    | `smtp.forwardemail.net`                          |
| Port (SSL/TLS)  | `2455`                                           |
| Port (STARTTLS) | `2555` (alternative)                             |
| Nom d’utilisateur | Votre email alias (ex. `camera@votredomaine.com`) |
| Mot de passe    | Le mot de passe généré                            |
| Authentification| Requise                                          |
| Chiffrement    | SSL/TLS (recommandé) ou STARTTLS                  |

> \[!WARNING]
> Ces ports utilisent le protocole TLS 1.0 obsolète qui présente des vulnérabilités connues (BEAST, POODLE). À utiliser uniquement si votre appareil ne supporte pas TLS 1.2+ moderne.

Configurez simplement votre appareil avec ces paramètres et il enverra les emails directement via Forward Email sans besoin d’un serveur relais local.

Pour plus de détails, consultez la [FAQ Forward Email sur le support TLS Legacy](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Option 2 : Configurer un relais SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Si vous n’utilisez pas Forward Email, ou préférez une solution relais locale, configurez Postfix sur le Raspberry Pi pour agir comme intermédiaire. Cela fonctionne avec n’importe quel fournisseur d’email (Gmail, Outlook, Yahoo, AOL, etc.).

#### Installer Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Pendant l'installation :

* Sélectionnez **"Site Internet"**
* Entrez le nom d'hôte de votre Pi (par exemple, `raspberrypi-ftp`) pour "Nom du système de messagerie"

#### Choisissez votre fournisseur de messagerie {#choose-your-email-provider}

| Fournisseur | Serveur SMTP          | Port | Mot de passe d'application requis ? |
| ----------- | --------------------- | ---- | ----------------------------------- |
| Gmail       | smtp.gmail.com        | 587  | Oui                                |
| Outlook     | smtp-mail.outlook.com | 587  | Oui                                |
| Yahoo       | smtp.mail.yahoo.com   | 465  | Oui                                |
| AOL         | smtp.aol.com          | 587  | Oui                                |

#### Obtenez un mot de passe spécifique à l'application {#get-an-app-specific-password}

La plupart des fournisseurs exigent des mots de passe d'application pour les applications tierces. Générez-en un depuis les paramètres de sécurité de votre fournisseur de messagerie :

* **Gmail :** [Google Account Security](https://myaccount.google.com/security)
* **Outlook :** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo :** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL :** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> N'utilisez jamais votre mot de passe email habituel. Utilisez toujours un mot de passe spécifique à l'application.

#### Configurez l'authentification SASL {#configure-sasl-authentication}

Créez le fichier de mot de passe pour votre fournisseur choisi. Cet exemple utilise Yahoo :

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Ajoutez cette ligne (ajustez le serveur et le port pour votre fournisseur) :

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Pour Gmail, utilisez :

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Sécurisez et hachez le fichier :

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Configurez la correspondance des adresses email {#configure-email-address-mapping}

Réécrivez les adresses email locales pour correspondre à votre fournisseur de messagerie :

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Ajoutez cette ligne (remplacez `HOSTNAME` par le nom d'hôte de votre Pi et utilisez votre email) :

```
/.+@HOSTNAME/    your_email@provider.com
```

Exemple :

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Sécurisez le fichier :

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Configurez les paramètres principaux de Postfix {#configure-postfix-main-settings}

Éditez la configuration principale :

```bash
sudo nano /etc/postfix/main.cf
```

Trouvez et mettez à jour le relais (ou ajoutez à la fin) :

```
relayhost = [smtp.mail.yahoo.com]:465
```

Ajoutez ces paramètres à la fin du fichier :

```
# Configuration du relais SMTP
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Paramètres réseau
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Pour Gmail (port 587), définissez `smtp_tls_wrappermode = no` au lieu de `yes`.

> \[!WARNING]
> Mettez à jour `mynetworks` avec la plage réseau réelle. N'ajoutez que des réseaux de confiance - tout appareil sur ces réseaux peut relayer du courrier sans authentification.

**Plages réseau courantes :**

| Plage réseau     | Plage d'adresses IP          |
| ---------------- | ---------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254  |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254  |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255    |

#### Mettez à jour le pare-feu et redémarrez {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP pour les appareils locaux'
sudo systemctl restart postfix
```

Vérifiez que Postfix fonctionne :

```bash
sudo systemctl status postfix
```

#### Testez le relais {#test-the-relay}

Envoyez un email de test :

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Consultez les logs :

```bash
sudo tail -f /var/log/mail.log
```

Cherchez `status=sent` pour confirmer le succès.

#### Configurez votre appareil {#configure-your-device-1}

Dans les paramètres de votre caméra ou appareil :
* **Serveur SMTP :** L'adresse IP de votre Pi (par exemple, `192.168.1.100`)
* **Port SMTP :** `25`
* **Authentification :** Aucune
* **Chiffrement :** Aucun (réseau local uniquement)


## Dépannage {#troubleshooting}

En cas de problème, vérifiez ces fichiers journaux :

**Serveur FTP :**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban :**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Moniteur de fichiers :**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail :**

```bash
sudo tail -f /var/log/mail.log
mailq  # Voir la file d'attente des mails
```


## Conclusion {#wrapping-up}

Le Raspberry Pi est désormais un système automatisé complet avec des téléchargements de fichiers sécurisés, des notifications par email automatiques avec pièces jointes, et des capacités de relais SMTP pour les appareils anciens. Que vous utilisiez les ports TLS hérités de Forward Email ou un relais Postfix local, les appareils plus anciens peuvent désormais envoyer des emails de manière fiable via des fournisseurs de messagerie modernes.
