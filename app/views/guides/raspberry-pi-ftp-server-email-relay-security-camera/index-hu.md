# Turn Your Raspberry Pi into a Secure FTP Server with Email Relay {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Got a Raspberry Pi collecting dust? Whether it's the latest Pi 5, a Pi 4, Pi Zero, or even an older model, this guide will show you how to turn it into a powerful, automated file server with email relay capabilities. Perfect for security cameras, IoT devices, and more.

**Compatible with:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W, and Raspberry Pi Zero.

> \[!NOTE]
> This guide was tested and verified on a Raspberry Pi 3 Model B running Ubuntu Server 22.04 LTS.

## Table of Contents {#table-of-contents}

* [What We're Building](#what-were-building)
* [Part 1: Getting Ubuntu Server on Your Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [What You'll Need](#what-youll-need)
  * [Flashing the OS](#flashing-the-os)
  * [Booting Up & Connecting](#booting-up--connecting)
* [Part 2: Setting Up a Secure FTP Server](#part-2-setting-up-a-secure-ftp-server)
  * [Installation & Configuration](#installation--configuration)
  * [Creating an FTP User](#creating-an-ftp-user)
* [Part 3: Firewall and Brute-Force Protection](#part-3-firewall-and-brute-force-protection)
  * [Setting Up UFW](#setting-up-ufw)
  * [Setting Up Fail2ban](#setting-up-fail2ban)
* [Part 4: Automated File Processing with Email Notifications](#part-4-automated-file-processing-with-email-notifications)
  * [Option 1: Using Forward Email API (Recommended)](#option-1-using-forward-email-api-recommended)
  * [Option 2: Using Other Email Providers](#option-2-using-other-email-providers)
  * [Create a Systemd Service](#create-a-systemd-service)
* [Part 5: Email Options for Legacy Devices](#part-5-email-options-for-legacy-devices)
  * [Option 1: Use Forward Email's Legacy TLS 1.0 Ports (Recommended)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Option 2: Set Up a Postfix SMTP Relay](#option-2-set-up-a-postfix-smtp-relay)
* [Troubleshooting](#troubleshooting)
* [Wrapping Up](#wrapping-up)

## What We're Building {#what-were-building}

This guide will walk you through setting up a complete system that includes:

* **Ubuntu Server 22.04 LTS:** A rock-solid, lightweight OS for the Pi.
* **A Secure FTP Server (vsftpd):** For dropping off files securely.
* **A Firewall (UFW) & Fail2ban:** To keep the bad guys out.
* **An Automated File Processor:** A script that grabs new files, emails them as attachments, and then cleans up after itself.
* **Email Options for Legacy Devices:** Two approaches for devices that don't support modern TLS:
  * Use Forward Email's legacy TLS 1.0 ports (easiest)
  * Set up a Postfix SMTP relay (works with any email provider)

Ready? Let's dive in.

## Part 1: Getting Ubuntu Server on Your Pi {#part-1-getting-ubuntu-server-on-your-pi}

First things first, get Ubuntu Server running on the Raspberry Pi. This is surprisingly easy thanks to the Raspberry Pi Imager.

### What You'll Need {#what-youll-need}

* Any compatible Raspberry Pi (see list above)
* A microSD card (8GB minimum, 16GB+ recommended)
* A computer with a microSD card reader
* Appropriate power supply for your Pi model
* Internet access (Ethernet or Wi-Fi)

> \[!NOTE]
> Older models like the Raspberry Pi 2 or Pi Zero may be slower but will work fine for this setup.

### Flashing the OS {#flashing-the-os}

1. **Get the Raspberry Pi Imager:** Download it from the [official website](https://www.raspberrypi.com/software/).

2. **Choose the OS:** In the imager, select "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * For 64-bit models (Pi 3, 4, 5, Zero 2 W), choose **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * For older 32-bit models (Pi 2, Pi Zero, Pi Zero W), choose **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Pick Your Storage:** Select your microSD card.

> \[!WARNING]
> This will wipe your microSD card clean. Make sure you've backed up anything important.

4. **Advanced Options are Your Friend:** Click the gear icon (⚙️) to set up the Pi for headless mode (no monitor or keyboard needed).
   * **Hostname:** Give your Pi a name (e.g., `pi-server`).
   * **SSH:** Enable it and set a username and password.
   * **Wi-Fi:** If you're not using Ethernet, enter your Wi-Fi details.
   * **Locale:** Set your timezone and keyboard layout.

5. **Write!** Click the "WRITE" button and let the imager do its thing.

### Booting Up & Connecting {#booting-up--connecting}

Once the imager is done, pop the microSD card into the Pi and plug it in. Give it a few minutes to boot up. It's doing some initial setup in the background. Find its IP address from your router's admin page, then connect via SSH:

```bash
ssh your_username@your_pi_ip_address
```

You're in! The Raspberry Pi is now ready for configuration.

## Part 2: Setting Up a Secure FTP Server {#part-2-setting-up-a-secure-ftp-server}

Next, set up `vsftpd` (Very Secure FTP Daemon), configured for maximum security.

### Installation & Configuration {#installation--configuration}

1. **Install vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Backup the config file:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Edit the configuration:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> If a line is commented out (starts with a `#`), uncomment it by removing the `#`.

Make these changes:

| Setting | Érték | Purpose |
| ------------------------ | ----- | --------------------------------------------------------- |
| `anonymous_enable` | `NO` | Disable anonymous FTP access |
| `local_enable` | `YES` | Allow local users to log in |
| `write_enable` | `YES` | Enable file uploads |
| `local_umask` | `022` | Set file permissions (644 for files, 755 for directories) |
| `chroot_local_user` | `YES` | Jail users to their home directory |
| `allow_writeable_chroot` | `YES` | Allow uploads in chroot jail |

4. **Add Passive Port Range:** Add these lines to the end of the file. This is needed for the firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Enable Logging:** Add these lines to enable logging for Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Save and Restart:** Press `Ctrl+O`, `Enter`, `Ctrl+X`, then restart the service:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Creating an FTP User {#creating-an-ftp-user}

Create a dedicated, restricted user for FTP access.

1. **Create the user:**

   ```bash
   sudo adduser ftpuser
   ```

Follow the prompts to set a password. The other fields (name, phone, etc.) can be left blank.

2. **Create the directory structure:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

* `/home/ftpuser/ftp` - Main FTP directory
   * `/home/ftpuser/ftp/uploads` - Where files will be uploaded

3. **Set permissions:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```

## Part 3: Firewall and Brute-Force Protection {#part-3-firewall-and-brute-force-protection}

Secure the Pi with UFW (Uncomplicated Firewall) and Fail2ban.

### Setting Up UFW {#setting-up-ufw}

1. **Install UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Set default policies:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Allow SSH (critical!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Always allow SSH before enabling the firewall, or you'll lock yourself out!

4. **Allow FTP ports:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Enable the firewall:**

   ```bash
   sudo ufw enable
   ```

### Setting Up Fail2ban {#setting-up-fail2ban}

Fail2ban automatically blocks IP addresses after repeated failed login attempts.

1. **Install Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Create a local configuration:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Add these configurations:**

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

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Create a Systemd Service {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Add this content:

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

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Check the status:

```bash
sudo systemctl status ftp-monitor.service
```

## Part 5: Email Options for Legacy Devices {#part-5-email-options-for-legacy-devices}

Devices like FOSSCAM cameras often don't support modern TLS versions. There are two solutions:

### Option 1: Use Forward Email's Legacy TLS 1.0 Ports (Recommended) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

If you're using Forward Email, this is the easiest solution. Forward Email provides dedicated legacy TLS 1.0 ports specifically for older devices like cameras, printers, scanners, and fax machines.

#### Pricing {#pricing}

Forward Email offers several plans:

| Plan | Price | Features |
| ----------------------- | ------------ | -------------------------------------- |
| Free | $0/month | Email forwarding only (no sending) |
| **Enhanced Protection** | **$3/month** | **SMTP access + legacy TLS 1.0 ports** |
| Team | $9/month | Enhanced + team features |
| Enterprise | $250/month | Team + unlimited API requests |

> \[!IMPORTANT]
> The **Enhanced Protection plan ($3/month)** or higher is required for SMTP access and legacy TLS 1.0 port support.

Learn more at [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Generate Your Password {#generate-your-password}

Before configuring your device, generate a password in Forward Email:

1. Log in to [Forward Email](https://forwardemail.net)
2. Navigate to **My Account → Domains → \[Your Domain] → Aliases**
3. Create or select an alias (e.g., `camera@yourdomain.com`)
4. Click **"Generate Password"** next to the alias
5. Copy the generated password - you'll use this for SMTP authentication

> \[!TIP]
> Each alias can have its own password. This is useful for tracking which device sent which email.

#### Configure Your Device {#configure-your-device}

Use these settings in your camera, printer, scanner, or other legacy device:

| Setting | Érték |
| --------------- | ------------------------------------------------ |
| SMTP Server | `smtp.forwardemail.net` |
| Port (SSL/TLS) | `2455` |
| Port (STARTTLS) | `2555` |
| Username | Your alias email (e.g., `camera@yourdomain.com`) |
| Password | The password from "Generate Password" |
| Authentication | Szükséges |
| Encryption | SSL/TLS or STARTTLS |

> \[!WARNING]
> These ports use the deprecated TLS 1.0 protocol which has known security vulnerabilities (BEAST, POODLE). Use only if your device cannot support modern TLS 1.2+.

Simply configure your device with these settings and it will send emails directly through Forward Email without needing a local relay server.

For more details, see the [Forward Email FAQ on Legacy TLS Support](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Option 2: Set Up a Postfix SMTP Relay {#option-2-set-up-a-postfix-smtp-relay}

If you're not using Forward Email, or prefer a local relay solution, set up Postfix on the Raspberry Pi to act as a middleman. This works with any email provider (Gmail, Outlook, Yahoo, AOL, etc.).

#### Install Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```

During installation:

* Select **"Internet Site"**
* Enter your Pi's hostname (e.g., `raspberrypi-ftp`) for "System mail name"

#### Choose Your Email Provider {#choose-your-email-provider}

| Szolgáltatás | SMTP Server | Kikötő | App Password Required? |
| -------- | --------------------- | ---- | ---------------------- |
| Gmail | smtp.gmail.com | 587 | Igen |
| Outlook | smtp-mail.outlook.com | 587 | Igen |
| Yahoo | smtp.mail.yahoo.com | 465 | Igen |
| AOL | smtp.aol.com | 587 | Igen |

#### Get an App-Specific Password {#get-an-app-specific-password}

Most providers require app passwords for third-party applications. Generate one from your email provider's security settings:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Never use your regular email password. Always use an app-specific password.

#### Configure SASL Authentication {#configure-sasl-authentication}

Create the password file for your chosen provider. This example uses Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Add this line (adjust server and port for your provider):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

For Gmail, use:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Secure and hash the file:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Configure Email Address Mapping {#configure-email-address-mapping}

Rewrite local email addresses to match your email provider:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Add this line (replace `HOSTNAME` with your Pi's hostname and use your email):

```
/.+@HOSTNAME/    your_email@provider.com
```

Example:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Secure the file:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Configure Postfix Main Settings {#configure-postfix-main-settings}

Edit the main configuration:

```bash
sudo nano /etc/postfix/main.cf
```

Find and update the relay host (or add at the end):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Add these settings at the end of the file:

```
# SMTP Relay Configuration
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Network settings
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> For Gmail (port 587), set `smtp_tls_wrappermode = no` instead of `yes`.

> \[!WARNING]
> Update `mynetworks` with your actual network range. Only add trusted networks - any device on these networks can relay mail without authentication.

**Common network ranges:**

| Network Range | IP Address Range |
| ---------------- | --------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8` | 10.0.0.0 - 10.255.255.255 |

#### Update Firewall and Restart {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Verify Postfix is running:

```bash
sudo systemctl status postfix
```

#### Test the Relay {#test-the-relay}

Send a test email:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Check the logs:

```bash
sudo tail -f /var/log/mail.log
```

Look for `status=sent` to confirm success.

#### Configure Your Device {#configure-your-device-1}

In your camera or device settings:

* **SMTP Server:** Your Pi's IP address (e.g., `192.168.1.100`)
* **SMTP Port:** `25`
* **Authentication:** None
* **Encryption:** None (local network only)

## Troubleshooting {#troubleshooting}

If issues arise, check these log files:

**FTP Server:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**File Monitor:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # View mail queue
```

## Wrapping Up {#wrapping-up}

The Raspberry Pi is now a complete automated system with secure file uploads, automatic email notifications with attachments, and SMTP relay capabilities for legacy devices. Whether using Forward Email's legacy TLS ports or a local Postfix relay, older devices can now send emails reliably through modern email providers.