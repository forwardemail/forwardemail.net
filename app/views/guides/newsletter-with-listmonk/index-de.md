# Listmonk mit Forward Email für sichere Newsletter-Zustellung {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [Warum Listmonk und Forward Email](#why-listmonk-and-forward-email)
* [Voraussetzungen](#prerequisites)
* [Installation](#installation)
  * [1. Aktualisieren Sie Ihren Server](#1-update-your-server)
  * [2. Abhängigkeiten installieren](#2-install-dependencies)
  * [3. Listmonk-Konfiguration herunterladen](#3-download-listmonk-configuration)
  * [4. Firewall konfigurieren (UFW)](#4-configure-firewall-ufw)
  * [5. HTTPS-Zugang konfigurieren](#5-configure-https-access)
  * [6. Listmonk starten](#6-start-listmonk)
  * [7. Forward Email SMTP in Listmonk konfigurieren](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Bounce-Verarbeitung konfigurieren](#8-configure-bounce-processing)
* [Testen](#testing)
  * [Eine Mailingliste erstellen](#create-a-mailing-list)
  * [Abonnenten hinzufügen](#add-subscribers)
  * [Eine Kampagne erstellen und senden](#create-and-send-a-campaign)
* [Verifizierung](#verification)
* [Entwicklerhinweise](#developer-notes)
* [Fazit](#conclusion)


## Überblick {#overview}

Diese Anleitung bietet Entwicklern Schritt-für-Schritt-Anweisungen zur Einrichtung von [Listmonk](https://listmonk.app/), einem leistungsstarken Open-Source-Newsletter- und Mailinglisten-Manager, um [Forward Email](https://forwardemail.net/) als SMTP-Anbieter zu verwenden. Diese Kombination ermöglicht es Ihnen, Ihre Kampagnen effektiv zu verwalten und gleichzeitig eine sichere, private und zuverlässige E-Mail-Zustellung zu gewährleisten.

* **Listmonk**: Verwaltet Abonnenten, Listenorganisation, Kampagnenerstellung und Leistungsüberwachung.
* **Forward Email**: Fungiert als sicherer SMTP-Server und übernimmt das tatsächliche Versenden von E-Mails mit integrierten Sicherheitsfunktionen wie SPF, DKIM, DMARC und TLS-Verschlüsselung.

Durch die Integration dieser beiden behalten Sie die volle Kontrolle über Ihre Daten und Infrastruktur, während Sie das robuste Zustellsystem von Forward Email nutzen.


## Warum Listmonk und Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Sowohl Listmonk als auch die Prinzipien hinter Forward Email legen Wert auf Transparenz und Kontrolle. Sie hosten Listmonk selbst und besitzen Ihre Daten.
* **Datenschutzorientiert**: Forward Email ist mit Fokus auf Datenschutz entwickelt, minimiert die Datenspeicherung und konzentriert sich auf sichere Übertragung.
* **Kosteneffizient**: Listmonk ist kostenlos, und Forward Email bietet großzügige kostenlose Tarife sowie erschwingliche kostenpflichtige Pläne, was diese Lösung budgetfreundlich macht.
* **Skalierbarkeit**: Listmonk ist sehr leistungsfähig, und die Infrastruktur von Forward Email ist für zuverlässige Zustellung in großem Maßstab ausgelegt.
* **Entwicklerfreundlich**: Listmonk bietet eine robuste API, und Forward Email stellt eine einfache SMTP-Integration sowie Webhooks bereit.


## Voraussetzungen {#prerequisites}

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes haben:

* Einen Virtual Private Server (VPS) mit einer aktuellen Linux-Distribution (Ubuntu 20.04+ empfohlen) mit mindestens 1 CPU und 1 GB RAM (2 GB empfohlen).
  * Benötigen Sie einen Anbieter? Schauen Sie sich die [empfohlene VPS-Liste](https://github.com/forwardemail/awesome-mail-server-providers) an.
* Einen Domainnamen, den Sie kontrollieren (DNS-Zugang erforderlich).
* Ein aktives Konto bei [Forward Email](https://forwardemail.net/).
* Root- oder `sudo`-Zugriff auf Ihren VPS.
* Grundkenntnisse im Umgang mit der Linux-Kommandozeile.


## Installation {#installation}

Diese Schritte führen Sie durch die Installation von Listmonk mit Docker und Docker Compose auf Ihrem VPS.

### 1. Aktualisieren Sie Ihren Server {#1-update-your-server}

Stellen Sie sicher, dass die Paketliste und installierte Pakete Ihres Systems auf dem neuesten Stand sind.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Abhängigkeiten installieren {#2-install-dependencies}

Installieren Sie Docker, Docker Compose und UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk-Konfiguration herunterladen {#3-download-listmonk-configuration}

Erstellen Sie ein Verzeichnis für Listmonk und laden Sie die offizielle `docker-compose.yml`-Datei herunter.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Diese Datei definiert den Listmonk-Anwendungscontainer und den erforderlichen PostgreSQL-Datenbankcontainer.
### 4. Firewall konfigurieren (UFW) {#4-configure-firewall-ufw}

Erlaube wesentlichen Datenverkehr (SSH, HTTP, HTTPS) durch die Firewall. Wenn dein SSH auf einem nicht standardmäßigen Port läuft, passe dies entsprechend an.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bestätige das Aktivieren der Firewall, wenn du dazu aufgefordert wirst.

### 5. HTTPS-Zugang konfigurieren {#5-configure-https-access}

Listmonk über HTTPS laufen zu lassen ist für die Sicherheit entscheidend. Du hast zwei Hauptoptionen:

#### Option A: Verwendung des Cloudflare-Proxys (Empfohlen für Einfachheit) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Wenn die DNS deines Domains von Cloudflare verwaltet wird, kannst du deren Proxy-Funktion für einfaches HTTPS nutzen.

1. **DNS zeigen lassen**: Erstelle einen `A`-Eintrag in Cloudflare für deine Listmonk-Subdomain (z. B. `listmonk.deinedomain.com`), der auf die IP-Adresse deines VPS zeigt. Stelle sicher, dass der **Proxy-Status** auf **Proxied** (orange Wolke) gesetzt ist.
2. **Docker Compose anpassen**: Bearbeite die heruntergeladene `docker-compose.yml` Datei:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Dadurch ist Listmonk intern auf Port 80 erreichbar, den Cloudflare dann proxyen und mit HTTPS absichern kann.

#### Option B: Verwendung eines Reverse Proxys (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativ kannst du auf deinem VPS einen Reverse Proxy wie Nginx oder Caddy einrichten, der die HTTPS-Terminierung übernimmt und Anfragen an Listmonk (standardmäßig auf Port 9000) weiterleitet.

* Behalte den Standard `ports: - "127.0.0.1:9000:9000"` in der `docker-compose.yml` bei, damit Listmonk nur lokal erreichbar ist.
* Konfiguriere deinen gewählten Reverse Proxy so, dass er auf den Ports 80 und 443 lauscht, SSL-Zertifikate (z. B. via Let's Encrypt) verwaltet und den Traffic an `http://127.0.0.1:9000` weiterleitet.
* Eine detaillierte Anleitung zur Einrichtung eines Reverse Proxys liegt außerhalb dieses Guides, aber viele Tutorials sind online verfügbar.

### 6. Listmonk starten {#6-start-listmonk}

Wechsle zurück in dein `listmonk` Verzeichnis (falls du dich nicht bereits dort befindest) und starte die Container im Hintergrund.

```bash
cd ~/listmonk # Oder das Verzeichnis, in dem du docker-compose.yml gespeichert hast
docker compose up -d
```

Docker lädt die notwendigen Images herunter und startet die Listmonk-Anwendung sowie die Datenbank-Container. Das kann beim ersten Mal ein oder zwei Minuten dauern.

✅ **Listmonk aufrufen**: Du solltest nun über die konfigurierte Domain (z. B. `https://listmonk.deinedomain.com`) auf die Listmonk-Weboberfläche zugreifen können.

### 7. Forward Email SMTP in Listmonk konfigurieren {#7-configure-forward-email-smtp-in-listmonk}

Konfiguriere als Nächstes Listmonk so, dass E-Mails über dein Forward Email-Konto versendet werden.

1. **SMTP in Forward Email aktivieren**: Stelle sicher, dass du in deinem Forward Email-Konto SMTP-Zugangsdaten generiert hast. Folge der [Forward Email Anleitung zum Versenden von E-Mails mit einer benutzerdefinierten Domain via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp), falls du das noch nicht getan hast.
2. **Listmonk konfigurieren**: Melde dich im Listmonk-Admin-Panel an.
   * Navigiere zu **Einstellungen -> SMTP**.

   * Listmonk unterstützt Forward Email nativ. Wähle **ForwardEmail** aus der Anbieterliste oder gib die folgenden Daten manuell ein:

     | Einstellung       | Wert                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth-Protokoll**| `LOGIN`                                                                                                             |
     | **Benutzername**  | Dein Forward Email **SMTP-Benutzername**                                                                            |
     | **Passwort**      | Dein Forward Email **SMTP-Passwort**                                                                                |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **Von E-Mail**    | Deine gewünschte `Von`-Adresse (z. B. `newsletter@deinedomain.com`). Stelle sicher, dass diese Domain in Forward Email konfiguriert ist. |
* **Wichtig**: Verwenden Sie immer Port `465` mit `SSL/TLS` für sichere Verbindungen mit Forward Email (empfohlen). Port `587` mit STARTTLS wird ebenfalls unterstützt, aber SSL/TLS wird bevorzugt.

   * Klicken Sie auf **Speichern**.
3. **Test-E-Mail senden**: Verwenden Sie die Schaltfläche "Test-E-Mail senden" auf der SMTP-Einstellungsseite. Geben Sie eine Empfängeradresse ein, auf die Sie zugreifen können, und klicken Sie auf **Senden**. Überprüfen Sie, ob die E-Mail im Posteingang des Empfängers ankommt.

### 8. Bounce-Verarbeitung konfigurieren {#8-configure-bounce-processing}

Die Bounce-Verarbeitung ermöglicht es Listmonk, E-Mails, die nicht zugestellt werden konnten (z. B. aufgrund ungültiger Adressen), automatisch zu verarbeiten. Forward Email stellt einen Webhook bereit, um Listmonk über Bounces zu informieren.

#### Forward Email Einrichtung {#forward-email-setup}

1. Melden Sie sich bei Ihrem [Forward Email Dashboard](https://forwardemail.net/) an.
2. Navigieren Sie zu **Domains**, wählen Sie die Domain aus, die Sie zum Senden verwenden, und gehen Sie zur **Einstellungs**seite.
3. Scrollen Sie zum Abschnitt **Bounce Webhook URL**.
4. Geben Sie die folgende URL ein, wobei Sie `<your_listmonk_domain>` durch die tatsächliche Domain oder Subdomain ersetzen, unter der Ihre Listmonk-Instanz erreichbar ist:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Beispiel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scrollen Sie weiter nach unten zum Abschnitt **Webhook Signature Payload Verification Key**.
6. **Kopieren** Sie den generierten Verifizierungsschlüssel. Diesen benötigen Sie in Listmonk.
7. Speichern Sie die Änderungen in den Domain-Einstellungen von Forward Email.

#### Listmonk Einrichtung {#listmonk-setup}

1. Navigieren Sie im Listmonk-Admin-Panel zu **Einstellungen -> Bounces**.
2. Aktivieren Sie **Bounce-Verarbeitung aktivieren**.
3. Aktivieren Sie **Bounce-Webhooks aktivieren**.
4. Scrollen Sie zum Abschnitt **Webhook-Anbieter**.
5. Aktivieren Sie **Forward Email**.
6. Fügen Sie den **Webhook Signature Payload Verification Key** ein, den Sie aus dem Forward Email Dashboard kopiert haben, in das Feld **Forward Email Key** ein.
7. Klicken Sie unten auf der Seite auf **Speichern**.
8. Die Bounce-Verarbeitung ist nun konfiguriert! Wenn Forward Email einen Bounce für eine von Listmonk gesendete E-Mail erkennt, benachrichtigt es Ihre Listmonk-Instanz über den Webhook, und Listmonk markiert den Abonnenten entsprechend.
9. Führen Sie die untenstehenden Schritte unter [Testing](#testing) aus, um sicherzustellen, dass alles funktioniert.


## Testen {#testing}

Hier ist eine kurze Übersicht der Kernfunktionen von Listmonk:

### Mailingliste erstellen {#create-a-mailing-list}

* Gehen Sie in der Seitenleiste zu **Listen**.
* Klicken Sie auf **Neue Liste**.
* Füllen Sie die Details aus (Name, Typ: Öffentlich/Privat, Beschreibung, Tags) und **Speichern**.

### Abonnenten hinzufügen {#add-subscribers}

* Navigieren Sie zum Abschnitt **Abonnenten**.
* Sie können Abonnenten hinzufügen:
  * **Manuell**: Klicken Sie auf **Neuer Abonnent**.
  * **Importieren**: Klicken Sie auf **Abonnenten importieren**, um eine CSV-Datei hochzuladen.
  * **API**: Verwenden Sie die Listmonk-API für programmatische Ergänzungen.
* Weisen Sie Abonnenten während der Erstellung oder des Imports einer oder mehreren Listen zu.
* **Beste Praxis**: Verwenden Sie einen Double-Opt-in-Prozess. Konfigurieren Sie dies unter **Einstellungen -> Opt-in & Abonnements**.

### Kampagne erstellen und senden {#create-and-send-a-campaign}

* Gehen Sie zu **Kampagnen** -> **Neue Kampagne**.
* Füllen Sie die Kampagnendetails aus (Name, Betreff, Absender-E-Mail, Liste(n), an die gesendet werden soll).
* Wählen Sie Ihren Inhaltstyp (Rich Text/HTML, Nur Text, Rohes HTML).
* Verfassen Sie Ihren E-Mail-Inhalt. Sie können Template-Variablen wie `{{ .Subscriber.Email }}` oder `{{ .Subscriber.FirstName }}` verwenden.
* **Senden Sie immer zuerst eine Test-E-Mail!** Verwenden Sie die Option "Test senden", um die E-Mail in Ihrem Posteingang zu prüfen.
* Wenn Sie zufrieden sind, klicken Sie auf **Kampagne starten**, um sofort zu senden oder planen Sie sie für später.


## Verifikation {#verification}

* **SMTP-Zustellung**: Senden Sie regelmäßig Test-E-Mails über die SMTP-Einstellungsseite von Listmonk und Testkampagnen, um sicherzustellen, dass E-Mails korrekt zugestellt werden.
* **Bounce-Verarbeitung**: Senden Sie eine Testkampagne an eine bekannte ungültige E-Mail-Adresse (z. B. `bounce-test@yourdomain.com`, falls Sie keine echte zur Hand haben, wobei die Ergebnisse variieren können). Prüfen Sie nach kurzer Zeit die Kampagnenstatistiken in Listmonk, um zu sehen, ob der Bounce registriert wurde.
* **E-Mail-Header**: Verwenden Sie Tools wie [Mail-Tester](https://www.mail-tester.com/) oder prüfen Sie E-Mail-Header manuell, um zu verifizieren, dass SPF, DKIM und DMARC bestehen, was auf eine korrekte Einrichtung über Forward Email hinweist.
* **Forward Email Logs**: Prüfen Sie die Protokolle Ihres Forward Email Dashboards, wenn Sie vermuten, dass Zustellprobleme vom SMTP-Server ausgehen.
## Entwicklerhinweise {#developer-notes}

* **Templating**: Listmonk verwendet die Templating-Engine von Go. Erkunden Sie die Dokumentation für erweiterte Personalisierung: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk bietet eine umfassende REST-API zur Verwaltung von Listen, Abonnenten, Kampagnen, Vorlagen und mehr. Den Link zur API-Dokumentation finden Sie im Footer Ihrer Listmonk-Instanz.
* **Benutzerdefinierte Felder**: Definieren Sie benutzerdefinierte Abonnentenfelder unter **Einstellungen -> Abonnentenfelder**, um zusätzliche Daten zu speichern.
* **Webhooks**: Neben Bounces kann Listmonk Webhooks für andere Ereignisse (z. B. Abonnements) senden, was die Integration mit anderen Systemen ermöglicht.


## Fazit {#conclusion}

Durch die Integration der selbstgehosteten Leistung von Listmonk mit der sicheren, datenschutzfreundlichen Zustellung von Forward Email schaffen Sie eine robuste und ethische E-Mail-Marketing-Plattform. Sie behalten die volle Kontrolle über Ihre Zielgruppendaten und profitieren gleichzeitig von hoher Zustellbarkeit und automatisierten Sicherheitsfunktionen.

Dieses Setup bietet eine skalierbare, kosteneffiziente und entwicklerfreundliche Alternative zu proprietären E-Mail-Diensten und entspricht perfekt der Philosophie von Open-Source-Software und Datenschutz.

Viel Erfolg beim Versenden! 🚀
