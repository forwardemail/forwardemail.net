# Selbst gehostet {#self-hosted}


## Inhaltsverzeichnis {#table-of-contents}

* [Erste Schritte](#getting-started)
* [Anforderungen](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Installation](#install)
  * [Installationsskript debuggen](#debug-install-script)
  * [Eingabeaufforderungen](#prompts)
  * [Ersteinrichtung (Option 1)](#initial-setup-option-1)
* [Dienste](#services)
  * [Wichtige Dateipfade](#important-file-paths)
* [Konfiguration](#configuration)
  * [Erste DNS-Einrichtung](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Tests](#testing)
  * [Erstellen Ihres ersten Alias](#creating-your-first-alias)
  * [Senden / Empfangen Ihrer ersten E-Mail](#sending--receiving-your-first-email)
* [Fehlerbehebung](#troubleshooting)
  * [Was sind der Basic-Auth-Benutzername und das Passwort](#what-is-the-basic-auth-username-and-password)
  * [Wie erkenne ich, was läuft](#how-do-i-know-what-is-running)
  * [Wie erkenne ich, ob etwas nicht läuft, das laufen sollte](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Wie finde ich Protokolle](#how-do-i-find-logs)
  * [Warum laufen meine ausgehenden E-Mails in einen Timeout](#why-are-my-outgoing-emails-timing-out)


## Erste Schritte {#getting-started}

Unsere selbst gehostete E-Mail-Lösung ist wie alle unsere Produkte zu 100 % Open Source – sowohl Frontend als auch Backend. Das bedeutet:

1. **Volle Transparenz**: Jede Codezeile, die Ihre E-Mails verarbeitet, ist öffentlich einsehbar
2. **Community-Beiträge**: Jeder kann Verbesserungen beitragen oder Fehler beheben
3. **Sicherheit durch Offenheit**: Schwachstellen können von einer globalen Gemeinschaft erkannt und behoben werden
4. **Keine Anbieterbindung**: Sie sind nie von der Existenz unseres Unternehmens abhängig

Der gesamte Code ist auf GitHub unter <https://github.com/forwardemail/forwardemail.net> verfügbar und steht unter der MIT-Lizenz.

Die Architektur umfasst Container für:

* SMTP-Server für ausgehende E-Mails
* IMAP/POP3-Server für den E-Mail-Abruf
* Weboberfläche zur Verwaltung
* Datenbank zur Konfigurationsspeicherung
* Redis für Caching und Performance
* SQLite für sichere, verschlüsselte Postfachspeicherung

> \[!NOTE]
> Schauen Sie sich unbedingt unseren [self-hosted Blog](https://forwardemail.net/blog/docs/self-hosted-solution) an
>
> Und für diejenigen, die eine detailliertere Schritt-für-Schritt-Anleitung wünschen, siehe unsere [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) oder [Debian](https://forwardemail.net/guides/selfhosted-on-debian) basierten Anleitungen.


## Anforderungen {#requirements}

Bevor Sie das Installationsskript ausführen, stellen Sie sicher, dass Sie Folgendes haben:

* **Betriebssystem**: Ein Linux-basierter Server (derzeit unterstützt Ubuntu 22.04+).
* **Ressourcen**: 1 vCPU und 2 GB RAM
* **Root-Zugriff**: Administratorrechte zur Ausführung von Befehlen.
* **Domainname**: Eine eigene Domain, bereit für die DNS-Konfiguration.
* **Saubere IP**: Stellen Sie sicher, dass Ihr Server eine saubere IP-Adresse ohne vorherige Spam-Reputation hat, indem Sie Blacklists prüfen. Mehr Infos [hier](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Öffentliche IP-Adresse mit Port-25-Unterstützung
* Möglichkeit, einen [Reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) einzurichten
* IPv4- und IPv6-Unterstützung

> \[!TIP]
> Siehe unsere Liste der [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

Die meisten Cloud-Anbieter unterstützen eine Cloud-init-Konfiguration, die beim Bereitstellen des virtuellen privaten Servers (VPS) verwendet wird. Dies ist eine großartige Möglichkeit, einige Dateien und Umgebungsvariablen im Voraus für die Verwendung durch die initiale Setup-Logik des Skripts festzulegen, wodurch die Notwendigkeit entfällt, während der Skriptausführung nach zusätzlichen Informationen gefragt zu werden.

**Optionen**

* `EMAIL` - E-Mail-Adresse für Certbot-Erinnerungen an Ablaufdaten
* `DOMAIN` - eigene Domain (z. B. `example.com`) für die Selbsthosting-Einrichtung
* `AUTH_BASIC_USERNAME` - Benutzername, der beim ersten Setup zum Schutz der Seite verwendet wird
* `AUTH_BASIC_PASSWORD` - Passwort, das beim ersten Setup zum Schutz der Seite verwendet wird
* `/root/.cloudflare.ini` - (**Nur Cloudflare-Nutzer**) Cloudflare-Konfigurationsdatei, die von Certbot für die DNS-Konfiguration verwendet wird. Erfordert, dass Sie Ihr API-Token über `dns_cloudflare_api_token` setzen. Mehr dazu [hier](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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


## Installation {#install}

Führen Sie den folgenden Befehl auf Ihrem Server aus, um das Installationsskript herunterzuladen und auszuführen:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Installationsskript debuggen {#debug-install-script}

Fügen Sie `DEBUG=true` vor dem Installationsskript hinzu, um eine ausführliche Ausgabe zu erhalten:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Eingabeaufforderungen {#prompts}

```sh
1. Initiale Einrichtung
2. Backups einrichten
3. Automatische Updates einrichten
4. Zertifikate erneuern
5. Aus Backup wiederherstellen
6. Hilfe
7. Beenden
```

* **Initiale Einrichtung**: Lädt den neuesten Forward Email Code herunter, konfiguriert die Umgebung, fragt Ihre benutzerdefinierte Domain ab und richtet alle notwendigen Zertifikate, Schlüssel und Geheimnisse ein.
* **Backup einrichten**: Richtet einen Cron-Job ein, um MongoDB und Redis mit einem S3-kompatiblen Speicher für sichere, entfernte Sicherungen zu sichern. Separat wird SQLite beim Login gesichert, falls Änderungen vorliegen, für sichere, verschlüsselte Backups.
* **Update einrichten**: Richtet einen Cron-Job ein, der nach nächtlichen Updates sucht, welche die Infrastrukturkomponenten sicher neu bauen und neu starten.
* **Zertifikate erneuern**: Certbot / lets encrypt wird für SSL-Zertifikate verwendet, die alle 3 Monate ablaufen. Dies erneuert die Zertifikate für Ihre Domain und legt sie im notwendigen Ordner ab, damit die zugehörigen Komponenten sie verwenden können. Siehe [wichtige Dateipfade](#important-file-paths)
* **Aus Backup wiederherstellen**: Löst die Wiederherstellung von MongoDB und Redis aus Backup-Daten aus.

### Initiale Einrichtung (Option 1) {#initial-setup-option-1}

Wählen Sie Option `1. Initiale Einrichtung`, um zu beginnen.

Nach Abschluss sollten Sie eine Erfolgsmeldung sehen. Sie können sogar `docker ps` ausführen, um **die** gestarteten Komponenten zu sehen. Weitere Informationen zu den Komponenten unten.


## Dienste {#services}

| Dienstname  |         Standardport        | Beschreibung                                           |
| ----------- | :-------------------------: | ----------------------------------------------------- |
| Web         |            `443`            | Weboberfläche für alle Admin-Interaktionen            |
| API         |            `4000`           | API-Schicht zur Abstraktion von Datenbanken           |
| Bree        |             Keine           | Hintergrundjob- und Task-Runner                        |
| SMTP        | `465` (empfohlen) / `587`  | SMTP-Server für ausgehende E-Mails                     |
| SMTP Bree   |             Keine           | SMTP-Hintergrundjob                                   |
| MX          |            `2525`           | Mail-Exchange für eingehende E-Mails und Weiterleitung |
| IMAP        |          `993/2993`         | IMAP-Server für eingehende E-Mails und Postfachverwaltung |
| POP3        |          `995/2995`         | POP3-Server für eingehende E-Mails und Postfachverwaltung |
| SQLite      |            `3456`           | SQLite-Server für Interaktionen mit SQLite-Datenbanken |
| SQLite Bree |             Keine           | SQLite-Hintergrundjob                                 |
| CalDAV      |            `5000`           | CalDAV-Server für Kalenderverwaltung                   |
| CardDAV     |            `6000`           | CardDAV-Server für Kalenderverwaltung                  |
| MongoDB     |           `27017`           | MongoDB-Datenbank für die meisten Datenverwaltungen   |
| Redis       |            `6379`           | Redis für Caching und Zustandsverwaltung               |
| SQLite      |             Keine           | SQLite-Datenbank(en) für verschlüsselte Postfächer    |

### Wichtige Dateipfade {#important-file-paths}

Hinweis: *Host-Pfad* unten ist relativ zu `/root/forwardemail.net/self-hosting/`.

| Komponente             |       Host-Pfad        | Container-Pfad               |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-Datei              |        `./.env`       | `/app/.env`                  |
| SSL-Zertifikate/Schlüssel |        `./ssl`        | `/app/ssl/`                  |
| Privater Schlüssel     |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Vollständiges Zertifikat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA-Zertifikat          |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM privater Schlüssel |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Speichern Sie die `.env`-Datei sicher. Sie ist entscheidend für die Wiederherstellung im Falle eines Ausfalls.
> Sie finden diese unter `/root/forwardemail.net/self-hosting/.env`.


## Konfiguration {#configuration}

### Erste DNS-Einrichtung {#initial-dns-setup}

Konfigurieren Sie bei Ihrem bevorzugten DNS-Anbieter die entsprechenden DNS-Einträge. Beachten Sie, dass alles in Klammern (`<>`) dynamisch ist und mit Ihrem Wert aktualisiert werden muss.

| Typ   | Name               | Inhalt                       | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", oder leer | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", oder leer | mx.<domain_name> (Priorität 0) | auto |
| TXT   | "@", ".", oder leer | "v=spf1 a -all"               | auto |

#### Reverse DNS / PTR-Eintrag {#reverse-dns--ptr-record}

Reverse DNS (rDNS) oder Reverse-Pointer-Einträge (PTR-Einträge) sind für E-Mail-Server essenziell, da sie helfen, die Legitimität des Servers, der die E-Mail sendet, zu überprüfen. Jeder Cloud-Anbieter handhabt dies unterschiedlich, daher müssen Sie nachschauen, wie man "Reverse DNS" hinzufügt, um den Host und die IP auf den entsprechenden Hostnamen abzubilden. Wahrscheinlich im Netzwerkbereich des Anbieters.

#### Port 25 blockiert {#port-25-blocked}

Einige ISPs und Cloud-Anbieter blockieren Port 25, um Missbrauch zu verhindern. Möglicherweise müssen Sie ein Support-Ticket einreichen, um Port 25 für SMTP / ausgehende E-Mails freizuschalten.


## Onboarding {#onboarding}

1. Öffnen Sie die Landing Page  
   Navigieren Sie zu https\://\<domain_name>, wobei Sie \<domain_name> durch die in Ihren DNS-Einstellungen konfigurierte Domain ersetzen. Sie sollten die Forward Email Landing Page sehen.

2. Melden Sie sich an und richten Sie Ihre Domain ein

* Melden Sie sich mit einer gültigen E-Mail-Adresse und Passwort an.
* Geben Sie den Domainnamen ein, den Sie einrichten möchten (dies muss mit der DNS-Konfiguration übereinstimmen).
* Folgen Sie den Anweisungen, um die erforderlichen **MX**- und **TXT**-Einträge zur Verifizierung hinzuzufügen.

3. Einrichtung abschließen

* Nach der Verifizierung greifen Sie auf die Alias-Seite zu, um Ihren ersten Alias zu erstellen.
* Optional konfigurieren Sie **SMTP für ausgehende E-Mails** in den **Domain-Einstellungen**. Dies erfordert zusätzliche DNS-Einträge.

> \[!NOTE]
> Es werden keine Informationen außerhalb Ihres Servers gesendet. Die selbst gehostete Option und das initiale Konto dienen nur für den Admin-Login und die Webansicht zur Verwaltung von Domains, Aliasen und zugehörigen E-Mail-Konfigurationen.


## Testen {#testing}

### Erstellen Ihres ersten Alias {#creating-your-first-alias}

1. Navigieren Sie zur Alias-Seite  
   Öffnen Sie die Alias-Verwaltungsseite:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Fügen Sie einen neuen Alias hinzu

* Klicken Sie auf **Alias hinzufügen** (oben rechts).
* Geben Sie den Alias-Namen ein und passen Sie die E-Mail-Einstellungen nach Bedarf an.
* (Optional) Aktivieren Sie die Unterstützung für **IMAP/POP3/CalDAV/CardDAV** durch Auswahl des Kontrollkästchens.
* Klicken Sie auf **Alias erstellen.**

3. Legen Sie ein Passwort fest

* Klicken Sie auf **Passwort generieren**, um ein sicheres Passwort zu erstellen.
* Dieses Passwort wird benötigt, um sich im E-Mail-Client anzumelden.

4. Konfigurieren Sie Ihren E-Mail-Client

* Verwenden Sie einen E-Mail-Client wie Thunderbird.
* Geben Sie den Alias-Namen und das generierte Passwort ein.
* Konfigurieren Sie die **IMAP**- und **SMTP**-Einstellungen entsprechend.

#### E-Mail-Server-Einstellungen {#email-server-settings}

Benutzername: `<alias name>`

| Typ  | Hostname           | Port | Verbindungssicherheit | Authentifizierung  |
| ---- | ------------------ | ---- | --------------------- | ------------------ |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS             | Normales Passwort  |
| IMAP | imap.<domain_name> | 993  | SSL / TLS             | Normales Passwort  |

### Senden / Empfangen Ihrer ersten E-Mail {#sending--receiving-your-first-email}

Nach der Konfiguration sollten Sie in der Lage sein, E-Mails an Ihre neu erstellte und selbst gehostete E-Mail-Adresse zu senden und zu empfangen!
## Fehlerbehebung {#troubleshooting}

#### Warum funktioniert das außerhalb von Ubuntu und Debian nicht {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Wir arbeiten derzeit daran, MacOS zu unterstützen und werden weitere Systeme in Betracht ziehen. Bitte eröffnen Sie eine [Diskussion](https://github.com/orgs/forwardemail/discussions) oder leisten Sie einen Beitrag, wenn Sie Unterstützung für andere Systeme wünschen.

#### Warum schlägt die certbot acme challenge fehl {#why-is-the-certbot-acme-challenge-failing}

Der häufigste Fehler ist, dass certbot / letsencrypt manchmal **2** Challenges anfordert. Sie müssen sicherstellen, dass Sie **BEIDE** TXT-Einträge hinzufügen.

Beispiel:
Sie könnten zwei Challenges wie folgt sehen:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Es ist auch möglich, dass die DNS-Propagation noch nicht abgeschlossen ist. Sie können Tools wie `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` verwenden. Dies gibt Ihnen eine Vorstellung, ob Ihre TXT-Eintrag-Änderungen bereits übernommen wurden. Es ist auch möglich, dass der lokale DNS-Cache auf Ihrem Host noch einen alten, veralteten Wert verwendet oder die jüngsten Änderungen noch nicht übernommen hat.

Eine weitere Möglichkeit ist die Verwendung der automatisierten certbot DNS-Änderungen, indem Sie die Datei `/root/.cloudflare.ini` mit dem API-Token in Ihrem cloud-init / user-data bei der ersten VPS-Einrichtung setzen oder diese Datei erstellen und das Skript erneut ausführen. Dies verwaltet die DNS-Änderungen und Challenge-Updates automatisch.

### Wie lauten der Basic-Auth-Benutzername und das Passwort {#what-is-the-basic-auth-username-and-password}

Für das Self-Hosting fügen wir beim ersten Zugriff einen nativen Browser-Authentifizierungs-Popup mit einem einfachen Benutzernamen (`admin`) und einem Passwort (zufällig bei der Erstinstallation generiert) hinzu. Dies dient als Schutz, falls Automatisierungen / Scraper Ihnen zuvorkommen und sich zuerst über die Weboberfläche anmelden. Sie finden dieses Passwort nach der Erstinstallation in Ihrer `.env`-Datei unter `AUTH_BASIC_USERNAME` und `AUTH_BASIC_PASSWORD`.

### Wie erkenne ich, was läuft {#how-do-i-know-what-is-running}

Sie können `docker ps` ausführen, um alle laufenden Container zu sehen, die aus der Datei `docker-compose-self-hosting.yml` gestartet wurden. Mit `docker ps -a` sehen Sie auch alle Container (einschließlich der nicht laufenden).

### Wie erkenne ich, ob etwas nicht läuft, das laufen sollte {#how-do-i-know-if-something-isnt-running-that-should-be}

Sie können `docker ps -a` ausführen, um alles zu sehen (einschließlich der nicht laufenden Container). Möglicherweise sehen Sie ein Exit-Log oder eine Notiz.

### Wie finde ich Logs {#how-do-i-find-logs}

Sie können weitere Logs mit `docker logs -f <container_name>` abrufen. Wenn etwas beendet wurde, hängt das wahrscheinlich mit einer falsch konfigurierten `.env`-Datei zusammen.

Innerhalb der Web-UI können Sie `/admin/emails` und `/admin/logs` für ausgehende E-Mail-Logs bzw. Fehlerlogs einsehen.

### Warum laufen meine ausgehenden E-Mails in ein Timeout {#why-are-my-outgoing-emails-timing-out}

Wenn Sie eine Meldung wie Connection timed out when connecting to MX server... sehen, müssen Sie möglicherweise prüfen, ob Port 25 blockiert ist. Es ist üblich, dass ISPs oder Cloud-Anbieter diesen Port standardmäßig blockieren, sodass Sie den Support kontaktieren oder ein Ticket eröffnen müssen, um ihn freizuschalten.

#### Welche Tools sollte ich verwenden, um E-Mail-Konfiguration, Best Practices und IP-Reputation zu testen {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Schauen Sie sich unsere [FAQ hier](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) an.
