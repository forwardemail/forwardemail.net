# Selbst gehostet {#self-hosted}

## Inhaltsverzeichnis {#table-of-contents}

* [Erste Schritte](#getting-started)
* [Anforderungen](#requirements)
  * [Cloud-Init / Benutzerdaten](#cloud-init--user-data)
* [Installieren](#install)
  * [Debug-Installationsskript](#debug-install-script)
  * [Eingabeaufforderungen](#prompts)
  * [Ersteinrichtung (Option 1)](#initial-setup-option-1)
* [Leistungen](#services)
  * [Wichtige Dateipfade](#important-file-paths)
* [Konfiguration](#configuration)
  * [Erste DNS-Einrichtung](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testen](#testing)
  * [Erstellen Ihres ersten Alias](#creating-your-first-alias)
  * [Senden/Empfangen Ihrer ersten E-Mail](#sending--receiving-your-first-email)
* [Fehlerbehebung](#troubleshooting)
  * [Wie lauten der Benutzername und das Passwort für die grundlegende Authentifizierung?](#what-is-the-basic-auth-username-and-password)
  * [Wie erkenne ich, was läuft](#how-do-i-know-what-is-running)
  * [Wie erkenne ich, dass etwas nicht läuft, was laufen sollte?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Wie finde ich Protokolle](#how-do-i-find-logs)
  * [Warum kommt es bei meinen ausgehenden E-Mails zu einer Zeitüberschreitung?](#why-are-my-outgoing-emails-timing-out)

## Erste Schritte {#getting-started}

Unsere selbst gehostete E-Mail-Lösung ist, wie alle unsere Produkte, zu 100 % Open Source – sowohl im Frontend als auch im Backend. Das bedeutet:

1. **Vollständige Transparenz**: Jede Codezeile, die Ihre E-Mails verarbeitet, ist öffentlich einsehbar.
2. **Community-Beiträge**: Jeder kann Verbesserungen beitragen oder Probleme beheben.
3. **Sicherheit durch Offenheit**: Schwachstellen können von einer globalen Community identifiziert und behoben werden.
4. **Keine Abhängigkeit von einem Anbieter**: Sie sind nicht von der Existenz unseres Unternehmens abhängig.

Der gesamte Code ist auf GitHub unter <https://github.com/forwardemail/forwardemail.net>, verfügbar und unterliegt der MIT-Lizenz.

Die Architektur umfasst Container für:

* SMTP-Server für ausgehende E-Mails
* IMAP/POP3-Server für den E-Mail-Abruf
* Weboberfläche für die Verwaltung
* Datenbank zur Konfigurationsspeicherung
* Redis für Caching und Performance
* SQLite für sichere, verschlüsselte Postfachspeicherung

> \[!NOTE]
> Schauen Sie sich unbedingt unseren [selbst gehosteter Blog](https://forwardemail.net/blog/docs/self-hosted-solution) an.
>
> Wer eine detailliertere Schritt-für-Schritt-Anleitung sucht, findet in unseren Anleitungen [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) und [Debian](https://forwardemail.net/guides/selfhosted-on-debian) weitere Informationen.

## Anforderungen {#requirements}

Stellen Sie vor dem Ausführen des Installationsskripts sicher, dass Sie über Folgendes verfügen:

* **Betriebssystem**: Ein Linux-basierter Server (aktuell mit Unterstützung für Ubuntu 22.04+).
* **Ressourcen**: 1 vCPU und 2 GB RAM
* **Root-Zugriff**: Administratorrechte zum Ausführen von Befehlen.
* **Domänenname**: Eine benutzerdefinierte Domäne, bereit für die DNS-Konfiguration.
* **Saubere IP-Adresse**: Stellen Sie sicher, dass Ihr Server eine saubere IP-Adresse ohne Spam-Reputation hat, indem Sie Blacklists prüfen. Weitere Informationen: [Hier](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Öffentliche IP-Adresse mit Unterstützung für Port 25
* Möglichkeit, [umgekehrter PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) festzulegen
* IPv4- und IPv6-Unterstützung

> \[!TIP]
> Sehen Sie sich unsere Liste mit [tolle Mailserver-Anbieter](https://github.com/forwardemail/awesome-mail-server-providers) an

### Cloud-Init / Benutzerdaten {#cloud-init--user-data}

Die meisten Cloud-Anbieter unterstützen eine Cloud-Init-Konfiguration für die Bereitstellung des virtuellen privaten Servers (VPS). Dies ist eine hervorragende Möglichkeit, einige Dateien und Umgebungsvariablen vorab für die anfängliche Einrichtungslogik des Skripts festzulegen. Dadurch entfällt die Notwendigkeit, während der Ausführung des Skripts zusätzliche Informationen abzufragen.

**Optionen**

* `EMAIL` – E-Mail-Adresse für Certbot-Erinnerungen zum Ablauf
* `DOMAIN` – Benutzerdefinierte Domain (z. B. `example.com`) für die Einrichtung des Self-Hostings
* `AUTH_BASIC_USERNAME` – Benutzername für die Ersteinrichtung zum Schutz der Website
* `AUTH_BASIC_PASSWORD` – Passwort für die Ersteinrichtung zum Schutz der Website
* `/root/.cloudflare.ini` – (**Nur für Cloudflare-Nutzer**) Cloudflare-Konfigurationsdatei, die Certbot für die DNS-Konfiguration verwendet. Sie müssen Ihren API-Token über `dns_cloudflare_api_token` festlegen. Weitere Informationen finden Sie unter [Hier](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Beispiel:

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

## Installieren Sie {#install}

Führen Sie den folgenden Befehl auf Ihrem Server aus, um das Installationsskript herunterzuladen und auszuführen:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debug-Installationsskript {#debug-install-script}

Fügen Sie `DEBUG=true` vor dem Installationsskript hinzu, um eine ausführliche Ausgabe zu erhalten:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Eingabeaufforderungen {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Ersteinrichtung**: Laden Sie den neuesten Code zur E-Mail-Weiterleitung herunter, konfigurieren Sie die Umgebung, geben Sie Ihre benutzerdefinierte Domäne ein und richten Sie alle erforderlichen Zertifikate, Schlüssel und Geheimnisse ein.
* **Backup einrichten**: Richtet einen Cron-Befehl ein, um MongoDB und Redis mithilfe eines S3-kompatiblen Speichers für sichere Remote-Speicherung zu sichern. SQLite wird bei der Anmeldung separat gesichert, falls Änderungen für sichere, verschlüsselte Backups vorgenommen werden.
* **Upgrade einrichten**: Richten Sie einen Cron-Befehl ein, um nächtliche Updates zu prüfen und Infrastrukturkomponenten sicher wiederherzustellen und neu zu starten.
* **Zertifikate erneuern**: Certbot/Lets Encrypt wird für SSL-Zertifikate verwendet, deren Schlüssel alle 3 Monate ablaufen. Dadurch werden die Zertifikate für Ihre Domäne erneuert und im entsprechenden Ordner abgelegt, damit die zugehörigen Komponenten sie nutzen können. Siehe [wichtige Dateipfade](#important-file-paths).
* **Aus Backup wiederherstellen**: Löst die Wiederherstellung von MongoDB und Redis aus Backup-Daten aus.

### Ersteinrichtung (Option 1) {#initial-setup-option-1}

Wählen Sie zum Beginnen die Option `1. Initial setup`.

Nach Abschluss sollte eine Erfolgsmeldung angezeigt werden. Sie können auch `docker ps` ausführen, um die **Komponenten** hochzufahren. Weitere Informationen zu den Komponenten finden Sie weiter unten.

## Dienste {#services}

| Dienstname | Standardport | Beschreibung |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Weboberfläche für alle Administratorinteraktionen |
| API | `4000` | API-Schicht zum Abstraktion von Datenbanken |
| Bree | Keiner | Hintergrundjob und Task-Runner |
| SMTP | `465/587` | SMTP-Server für ausgehende E-Mails |
| SMTP Bree | Keiner | SMTP-Hintergrundjob |
| MX | `2525` | Mail-Austausch für eingehende E-Mails und E-Mail-Weiterleitung |
| IMAP | `993/2993` | IMAP-Server für eingehende E-Mails und Postfachverwaltung |
| POP3 | `995/2995` | POP3-Server für eingehende E-Mails und Postfachverwaltung |
| SQLite | `3456` | SQLite-Server für Interaktionen mit SQLite-Datenbank(en) |
| SQLite Bree | Keiner | SQLite-Hintergrundjob |
| CalDAV | `5000` | CalDAV-Server zur Kalenderverwaltung |
| CardDAV | `6000` | CardDAV-Server zur Kalenderverwaltung |
| MongoDB | `27017` | MongoDB-Datenbank für die meisten Datenverwaltungen |
| Redis | `6379` | Redis für Caching und Statusverwaltung |
| SQLite | Keiner | SQLite-Datenbank(en) für verschlüsselte Postfächer |

### Wichtige Dateipfade {#important-file-paths}

Hinweis: Der unten stehende *Hostpfad* ist relativ zu `/root/forwardemail.net/self-hosting/`.

| Komponente | Hostpfad | Containerpfad |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-Datei | `./.env` | `/app/.env` |
| SSL-Zertifikate/Schlüssel | `./ssl` | `/app/ssl/` |
| Privater Schlüssel | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Vollständiges Kettenzertifikat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Zertifizierte Zertifizierungsstellen | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Privater DKIM-Schlüssel | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Speichern Sie die Datei `.env` sicher. Sie ist für die Wiederherstellung im Fehlerfall unerlässlich.
> Sie finden sie in `/root/forwardemail.net/self-hosting/.env`.

## Konfiguration {#configuration}

### Erste DNS-Einrichtung {#initial-dns-setup}

Konfigurieren Sie die entsprechenden DNS-Einträge bei Ihrem DNS-Anbieter. Beachten Sie, dass alle Einträge in Klammern (`<>`) dynamisch sind und mit Ihrem Wert aktualisiert werden müssen.

| Typ | Name | Inhalt | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." oder leer | <IP-Adresse> | Auto |
| CNAME | API | <Domänenname> | Auto |
| CNAME | caldav | <Domänenname> | Auto |
| CNAME | carddav | <Domänenname> | Auto |
| CNAME | Fe-Bounces | <Domänenname> | Auto |
| CNAME | imap | <Domänenname> | Auto |
| CNAME | mx | <Domänenname> | Auto |
| CNAME | pop3 | <Domänenname> | Auto |
| CNAME | SMTP | <Domänenname> | Auto |
| MX | "@", "." oder leer | mx.<Domänenname> (Priorität 0) | Auto |
| TXT | "@", "." oder leer | „v=spf1 a -all“ | Auto |

#### Reverse-DNS-/PTR-Eintrag {#reverse-dns--ptr-record}

Reverse DNS (rDNS) oder Reverse Pointer Records (PTR-Records) sind für E-Mail-Server unerlässlich, da sie die Legitimität des Servers, der die E-Mail sendet, bestätigen. Jeder Cloud-Anbieter handhabt dies anders. Sie müssen daher nachschauen, wie Sie „Reverse DNS“ hinzufügen, um Host und IP dem entsprechenden Hostnamen zuzuordnen. Meistens finden Sie dies im Netzwerkbereich des Anbieters.

#### Port 25 blockiert {#port-25-blocked}

Einige ISPs und Cloud-Anbieter blockieren Port 25, um böswillige Akteure zu verhindern. Möglicherweise müssen Sie ein Support-Ticket einreichen, um Port 25 für SMTP/ausgehende E-Mails freizugeben.

## Einarbeitung {#onboarding}

1. Öffnen Sie die Landingpage. Navigieren Sie zu https\://\<Domänenname> und ersetzen Sie \<Domänenname> durch die in Ihren DNS-Einstellungen konfigurierte Domäne. Die Landingpage „E-Mail weiterleiten“ sollte angezeigt werden.

2. Melden Sie sich an und integrieren Sie Ihre Domain

* Melden Sie sich mit einer gültigen E-Mail-Adresse und einem gültigen Passwort an.
* Geben Sie den Domänennamen ein, den Sie einrichten möchten (dieser muss mit der DNS-Konfiguration übereinstimmen).
* Folgen Sie den Anweisungen, um die erforderlichen **MX**- und **TXT**-Einträge zur Überprüfung hinzuzufügen.

3. Einrichtung abschließen

* Rufen Sie nach der Verifizierung die Seite „Aliase“ auf, um Ihren ersten Alias zu erstellen.
* Konfigurieren Sie optional **SMTP für ausgehende E-Mails** in den **Domäneneinstellungen**. Hierfür sind zusätzliche DNS-Einträge erforderlich.

> \[!NOTE]
> Es werden keine Informationen außerhalb Ihres Servers gesendet. Die selbst gehostete Option und das Startkonto dienen lediglich dem Administrator-Login und der Webansicht zur Verwaltung von Domänen, Aliasen und zugehörigen E-Mail-Konfigurationen.

## Testen {#testing}

### Erstellen Sie Ihren ersten Alias {#creating-your-first-alias}

1. Navigieren Sie zur Alias-Seite. Öffnen Sie die Alias-Verwaltungsseite:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Fügen Sie einen neuen Alias hinzu

* Klicken Sie oben rechts auf **Alias hinzufügen**.
* Geben Sie den Aliasnamen ein und passen Sie die E-Mail-Einstellungen nach Bedarf an.
* (Optional) Aktivieren Sie die **IMAP/POP3/CalDAV/CardDAV**-Unterstützung, indem Sie das Kontrollkästchen aktivieren.
* Klicken Sie auf **Alias erstellen**.

3. Legen Sie ein Passwort fest

* Klicken Sie auf **Passwort generieren**, um ein sicheres Passwort zu erstellen.
* Dieses Passwort wird für die Anmeldung bei Ihrem E-Mail-Client benötigt.

4. Konfigurieren Sie Ihren E-Mail-Client

* Verwenden Sie einen E-Mail-Client wie Thunderbird.
* Geben Sie den Aliasnamen und das generierte Passwort ein.
* Konfigurieren Sie die **IMAP**- und **SMTP**-Einstellungen entsprechend.

#### E-Mail-Servereinstellungen {#email-server-settings}

Benutzername: `<alias name>`

| Typ | Hostname | Hafen | Verbindungssicherheit | Authentifizierung |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<Domänenname> | 465 | SSL / TLS | Normales Passwort |
| IMAP | imap.<Domänenname> | 993 | SSL / TLS | Normales Passwort |

### Senden/Empfangen Ihrer ersten E-Mail {#sending--receiving-your-first-email}

Nach der Konfiguration sollten Sie in der Lage sein, E-Mails an Ihre neu erstellte und selbst gehostete E-Mail-Adresse zu senden und zu empfangen!

## Fehlerbehebung {#troubleshooting}

#### Warum funktioniert das nicht außerhalb von Ubuntu und Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Wir arbeiten derzeit an der Unterstützung von macOS und werden uns auch um weitere Betriebssysteme kümmern. Bitte öffnen Sie ein [Diskussion](https://github.com/orgs/forwardemail/discussions) oder leisten Sie einen Beitrag, wenn Sie möchten, dass auch andere Betriebssysteme unterstützt werden.

#### Warum schlägt die Certbot-Acme-Challenge fehl? {#why-is-the-certbot-acme-challenge-failing}

Die häufigste Falle besteht darin, dass Certbot/Letsencrypt manchmal **2** Challenges anfordert. Sie müssen unbedingt **BEIDE** TXT-Einträge hinzufügen.

Beispiel:
Sie sehen möglicherweise zwei Herausforderungen wie diese:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Es ist auch möglich, dass die DNS-Verbreitung noch nicht abgeschlossen ist. Sie können Tools wie `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` verwenden. Dies gibt Ihnen Aufschluss darüber, ob Ihre TXT-Eintragsänderungen berücksichtigt werden sollten. Es ist auch möglich, dass der lokale DNS-Cache auf Ihrem Host noch einen alten, veralteten Wert verwendet oder die letzten Änderungen nicht übernommen hat.

Alternativ können Sie die automatisierten Cerbot-DNS-Änderungen nutzen, indem Sie die Datei `/root/.cloudflare.ini` mit dem API-Token in Ihren Cloud-Init-/Benutzerdaten bei der Ersteinrichtung Ihres VPS festlegen oder diese Datei erstellen und das Skript erneut ausführen. Dadurch werden die DNS-Änderungen und Challenge-Updates automatisch verwaltet.

### Wie lauten der Benutzername und das Passwort für die Basisauthentifizierung {#what-is-the-basic-auth-username-and-password}

Für das Self-Hosting fügen wir beim ersten Mal ein natives Browser-Authentifizierungs-Popup mit einem einfachen Benutzernamen (`admin`) und einem zufällig generierten Passwort bei der Ersteinrichtung hinzu. Dies dient lediglich als Schutz für den Fall, dass Automatisierungs-/Scraper-Programme Ihre Anmeldung im Web-Erlebnis überlisten. Sie finden dieses Passwort nach der Ersteinrichtung in Ihrer Datei `.env` unter `AUTH_BASIC_USERNAME` und `AUTH_BASIC_PASSWORD`.

### Wie erkenne ich, was ausgeführt wird? {#how-do-i-know-what-is-running}

Sie können `docker ps` ausführen, um alle laufenden Container anzuzeigen, die aus der Datei `docker-compose-self-hosting.yml` gestartet werden. Sie können auch `docker ps -a` ausführen, um alles anzuzeigen (einschließlich nicht laufender Container).

### Wie erkenne ich, ob etwas nicht läuft, das eigentlich laufen sollte? {#how-do-i-know-if-something-isnt-running-that-should-be}

Sie können `docker ps -a` ausführen, um alles anzuzeigen (einschließlich nicht laufender Container). Möglicherweise wird ein Exit-Protokoll oder eine Notiz angezeigt.

### Wie finde ich Protokolle {#how-do-i-find-logs}

Weitere Protokolle erhalten Sie über `docker logs -f <container_name>`. Falls etwas passiert ist, liegt dies wahrscheinlich an einer fehlerhaften Konfiguration der Datei `.env`.

Innerhalb der Web-Benutzeroberfläche können Sie `/admin/emails` und `/admin/logs` für ausgehende E-Mail-Protokolle bzw. Fehlerprotokolle anzeigen.

### Warum kommt es bei meinen ausgehenden E-Mails zu einer Zeitüberschreitung? {#why-are-my-outgoing-emails-timing-out}

Wenn beim Verbinden mit dem MX-Server die Meldung „Verbindungs-Timeout“ angezeigt wird, sollten Sie prüfen, ob Port 25 blockiert ist. ISPs oder Cloud-Anbieter blockieren diesen Port häufig standardmäßig. Sie müssen sich dann an den Support wenden oder ein Ticket erstellen, um die Sperre zu öffnen.

#### Welche Tools sollte ich verwenden, um Best Practices für die E-Mail-Konfiguration und die IP-Reputation zu testen? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Schauen Sie sich unseren [FAQ hier](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) an.