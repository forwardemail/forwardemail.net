# Listmonk mit E-Mail-Weiterleitung für sicheren Newsletter-Versand {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [Warum Listmonk und E-Mail weiterleiten?](#why-listmonk-and-forward-email)
* [Voraussetzungen](#prerequisites)
* [Installation](#installation)
  * [1. Aktualisieren Sie Ihren Server](#1-update-your-server)
  * [2. Abhängigkeiten installieren](#2-install-dependencies)
  * [3. Laden Sie die Listmonk-Konfiguration herunter](#3-download-listmonk-configuration)
  * [4. Firewall konfigurieren (UFW)](#4-configure-firewall-ufw)
  * [5. HTTPS-Zugriff konfigurieren](#5-configure-https-access)
  * [6. Starten Sie Listmonk](#6-start-listmonk)
  * [7. Konfigurieren Sie die SMTP-Weiterleitung von E-Mails in Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurieren Sie die Bounce-Verarbeitung](#8-configure-bounce-processing)
* [Testen](#testing)
  * [Erstellen Sie eine Mailingliste](#create-a-mailing-list)
  * [Abonnenten hinzufügen](#add-subscribers)
  * [Erstellen und Senden einer Kampagne](#create-and-send-a-campaign)
* [Überprüfung](#verification)
* [Entwicklerhinweise](#developer-notes)
* [Abschluss](#conclusion)

## Übersicht {#overview}

Dieses Handbuch bietet Entwicklern eine Schritt-für-Schritt-Anleitung zur Einrichtung von [Listenmönch](https://listmonk.app/), einem leistungsstarken Open-Source-Newsletter- und Mailinglisten-Manager, mit [E-Mail weiterleiten](https://forwardemail.net/) als SMTP-Anbieter. Diese Kombination ermöglicht Ihnen die effektive Verwaltung Ihrer Kampagnen und gewährleistet gleichzeitig eine sichere, vertrauliche und zuverlässige E-Mail-Zustellung.

* **Listmonk**: Übernimmt die Abonnentenverwaltung, Listenorganisation, Kampagnenerstellung und Leistungsverfolgung.
* **E-Mail weiterleiten**: Fungiert als sicherer SMTP-Server und übernimmt den eigentlichen E-Mail-Versand mit integrierten Sicherheitsfunktionen wie SPF, DKIM, DMARC und TLS-Verschlüsselung.

Durch die Integration dieser beiden behalten Sie die volle Kontrolle über Ihre Daten und Infrastruktur und nutzen gleichzeitig das robuste Zustellungssystem von Forward Email.

## Warum Listmonk und E-Mail weiterleiten {#why-listmonk-and-forward-email}

* **Open Source**: Sowohl Listmonk als auch die Prinzipien von Forward Email legen Wert auf Transparenz und Kontrolle. Sie hosten Listmonk selbst und sind Eigentümer Ihrer Daten.
* **Datenschutzorientiert**: Forward Email legt größten Wert auf Datenschutz, minimiert die Datenspeicherung und legt den Fokus auf sichere Übertragung.
* **Kostengünstig**: Listmonk ist kostenlos, und Forward Email bietet großzügige kostenlose Tarife und günstige kostenpflichtige Pläne – eine budgetfreundliche Lösung.
* **Skalierbarkeit**: Listmonk ist hochleistungsfähig, und die Infrastruktur von Forward Email ist auf zuverlässige und skalierbare Bereitstellung ausgelegt.
* **Entwicklerfreundlich**: Listmonk bietet eine robuste API, und Forward Email bietet unkomplizierte SMTP-Integration und Webhooks.

## Voraussetzungen {#prerequisites}

Bevor Sie beginnen, stellen Sie sicher, dass Sie über Folgendes verfügen:

* Ein Virtual Private Server (VPS) mit einer aktuellen Linux-Distribution (Ubuntu 20.04+ empfohlen) mit mindestens 1 CPU und 1 GB RAM (2 GB empfohlen).
* Benötigen Sie einen Anbieter? Schauen Sie sich den [empfohlene VPS-Liste](https://github.com/forwardemail/awesome-mail-server-providers) an.
* Ein Domainname, den Sie verwalten (DNS-Zugriff erforderlich).
* Ein aktives Konto mit [E-Mail weiterleiten](https://forwardemail.net/).
* Root- oder `sudo`-Zugriff auf Ihren VPS.
* Grundkenntnisse in Linux-Befehlszeilenoperationen.

## Installation {#installation}

Diese Schritte führen Sie durch die Installation von Listmonk mit Docker und Docker Compose auf Ihrem VPS.

### 1. Aktualisieren Sie Ihren Server {#1-update-your-server}

Stellen Sie sicher, dass die Paketliste und die installierten Pakete Ihres Systems auf dem neuesten Stand sind.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Abhängigkeiten installieren {#2-install-dependencies}

Installieren Sie Docker, Docker Compose und UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk-Konfiguration herunterladen {#3-download-listmonk-configuration}

Erstellen Sie ein Verzeichnis für Listmonk und laden Sie die offizielle Datei `docker-compose.yml` herunter.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Diese Datei definiert den Listmonk-Anwendungscontainer und den erforderlichen PostgreSQL-Datenbankcontainer.

### 4. Firewall konfigurieren (UFW) {#4-configure-firewall-ufw}

Erlauben Sie wichtigen Datenverkehr (SSH, HTTP, HTTPS) durch die Firewall. Wenn Ihr SSH-Port nicht auf dem Standardport läuft, passen Sie ihn entsprechend an.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Bestätigen Sie die Aktivierung der Firewall, wenn Sie dazu aufgefordert werden.

### 5. HTTPS-Zugriff konfigurieren {#5-configure-https-access}

Die Ausführung von Listmonk über HTTPS ist aus Sicherheitsgründen entscheidend. Sie haben zwei Hauptoptionen:

#### Option A: Cloudflare-Proxy verwenden (aus Gründen der Einfachheit empfohlen) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Wenn das DNS Ihrer Domäne von Cloudflare verwaltet wird, können Sie deren Proxy-Funktion für einfaches HTTPS nutzen.

1. **DNS-Punkt**: Erstellen Sie in Cloudflare einen `A`-Eintrag für Ihre Listmonk-Subdomain (z. B. `listmonk.yourdomain.com`), der auf Ihre VPS-IP-Adresse verweist. Stellen Sie sicher, dass der **Proxy-Status** auf **Proxied** (orangefarbene Wolke) eingestellt ist.
2. **Docker Compose bearbeiten**: Bearbeiten Sie die heruntergeladene Datei `docker-compose.yml`:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Dadurch ist Listmonk intern über Port 80 erreichbar, den Cloudflare dann als Proxy nutzen und mit HTTPS sichern kann.

#### Option B: Verwenden eines Reverse-Proxys (Nginx, Caddy usw.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativ können Sie auf Ihrem VPS einen Reverse-Proxy wie Nginx oder Caddy einrichten, um die HTTPS-Terminierung und Proxy-Anfragen an Listmonk (wird standardmäßig auf Port 9000 ausgeführt) zu verarbeiten.

* Behalten Sie den Standardwert `ports: - "127.0.0.1:9000:9000"` in `docker-compose.yml` bei, um sicherzustellen, dass Listmonk nur lokal zugänglich ist.
* Konfigurieren Sie Ihren gewählten Reverse-Proxy so, dass er die Ports 80 und 443 überwacht, den Erwerb von SSL-Zertifikaten (z. B. über Let's Encrypt) abwickelt und den Datenverkehr an `http://127.0.0.1:9000` weiterleitet.
* Die detaillierte Einrichtung des Reverse-Proxys geht über den Rahmen dieser Anleitung hinaus. Es stehen jedoch zahlreiche Tutorials online zur Verfügung.

### 6. Starten Sie Listmonk {#6-start-listmonk}

Navigieren Sie zurück zu Ihrem Verzeichnis `listmonk` (falls Sie nicht bereits dort sind) und starten Sie die Container im getrennten Modus.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker lädt die erforderlichen Images herunter und startet die Listmonk-Anwendung sowie die Datenbankcontainer. Beim ersten Mal kann dies ein bis zwei Minuten dauern.

✅ **Zugriff auf Listmonk**: Sie sollten jetzt über die von Ihnen konfigurierte Domäne (z. B. `https://listmonk.yourdomain.com`) auf die Listmonk-Weboberfläche zugreifen können.

### 7. Konfigurieren Sie die SMTP-Weiterleitung von E-Mails in Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Konfigurieren Sie als Nächstes Listmonk so, dass E-Mails über Ihr Forward Email-Konto gesendet werden.

1. **SMTP in der E-Mail-Weiterleitung aktivieren**: Stellen Sie sicher, dass Sie SMTP-Anmeldeinformationen im Dashboard Ihres E-Mail-Weiterleitungskontos generiert haben. Folgen Sie den Anweisungen [Anleitung zum Weiterleiten von E-Mails mit einer benutzerdefinierten Domäne über SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp), falls noch nicht geschehen.
2. **Listmonk konfigurieren**: Melden Sie sich im Listmonk-Administrationsbereich an.
* Navigieren Sie zu **Einstellungen -> SMTP**.

* Listmonk bietet integrierte Unterstützung für die Weiterleitung von E-Mails. Wählen Sie **ForwardEmail** aus der Anbieterliste oder geben Sie die folgenden Details manuell ein:

| Einstellung | Wert |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Gastgeber** | `smtp.forwardemail.net` |
| **Hafen** | `465` |
| **Auth-Protokoll** | `LOGIN` |
| **Benutzername** | Ihre Weiterleitungs-E-Mail **SMTP-Benutzername** |
| **Passwort** | Ihre Weiterleitungs-E-Mail **SMTP-Passwort** |
| **TLS** | `SSL/TLS` |
| **Von E-Mail** | Ihre gewünschte `From`-Adresse (z. B. `newsletter@yourdomain.com`). Stellen Sie sicher, dass diese Domäne in der E-Mail-Weiterleitung konfiguriert ist. |

* **Wichtig**: Verwenden Sie für sichere Verbindungen mit Forward Email immer Port `465` mit `SSL/TLS`. Verwenden Sie nicht STARTTLS (Port 587).

* Klicken Sie auf **Speichern**.
3. **Test-E-Mail senden**: Klicken Sie auf der SMTP-Einstellungsseite auf die Schaltfläche „Test-E-Mail senden“. Geben Sie eine erreichbare Empfängeradresse ein und klicken Sie auf **Senden**. Überprüfen Sie, ob die E-Mail im Posteingang des Empfängers eintrifft.

### 8. Bounce-Verarbeitung konfigurieren {#8-configure-bounce-processing}

Mit der Bounce-Verarbeitung kann Listmonk E-Mails, die nicht zugestellt werden konnten (z. B. aufgrund ungültiger Adressen), automatisch verarbeiten. Forward Email bietet einen Webhook, um Listmonk über Bounces zu informieren.

#### E-Mail-Einrichtung weiterleiten {#forward-email-setup}

1. Melden Sie sich bei Ihrem [Dashboard „E-Mail weiterleiten“](https://forwardemail.net/) an.
2. Navigieren Sie zu **Domains**, wählen Sie die Domain aus, die Sie zum Senden verwenden, und öffnen Sie deren **Einstellungen**.
3. Scrollen Sie nach unten zum Abschnitt **Bounce-Webhook-URL**.
4. Geben Sie die folgende URL ein und ersetzen Sie `<your_listmonk_domain>` durch die Domain oder Subdomain, unter der Ihre Listmonk-Instanz erreichbar ist:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Beispiel*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scrollen Sie weiter nach unten zum Abschnitt **Webhook-Signatur-Payload-Verifizierungsschlüssel**.
6. **Kopieren** Sie den generierten Verifizierungsschlüssel. Sie benötigen ihn in Listmonk.
7. Speichern Sie die Änderungen in den Einstellungen Ihrer E-Mail-Weiterleitungsdomäne.

#### Listmonk-Setup {#listmonk-setup}

1. Navigieren Sie in Ihrem Listmonk-Administrationsbereich zu **Einstellungen -> Bounces**.
2. Aktivieren Sie **Bounce-Verarbeitung aktivieren**.
3. Aktivieren Sie **Bounce-Webhooks aktivieren**.
4. Scrollen Sie nach unten zum Abschnitt **Webhook-Anbieter**.
5. Aktivieren Sie **E-Mail weiterleiten**.
6. Fügen Sie den **Webhook-Signatur-Payload-Verifizierungsschlüssel**, den Sie aus dem Dashboard für E-Mail weiterleiten kopiert haben, in das Feld **Schlüssel für E-Mail weiterleiten** ein.
7. Klicken Sie unten auf der Seite auf **Speichern**.
8. Die Bounce-Verarbeitung ist nun konfiguriert! Wenn E-Mail weiterleiten einen Bounce für eine von Listmonk gesendete E-Mail erkennt, wird Ihre Listmonk-Instanz über den Webhook benachrichtigt, und Listmonk markiert den Abonnenten entsprechend.
9. Führen Sie die folgenden Schritte unter [Testen](#testing) aus, um sicherzustellen, dass alles funktioniert.

## Testen {#testing}

Hier ist ein kurzer Überblick über die wichtigsten Listmonk-Funktionen:

### Erstellen Sie eine Mailingliste {#create-a-mailing-list}

* Gehen Sie in der Seitenleiste zu **Listen**.
* Klicken Sie auf **Neue Liste**.
* Füllen Sie die Details aus (Name, Typ: Öffentlich/Privat, Beschreibung, Tags) und **Speichern**.

### Abonnenten hinzufügen {#add-subscribers}

* Navigieren Sie zum Bereich **Abonnenten**.
* Sie können Abonnenten hinzufügen:
* **Manuell**: Klicken Sie auf **Neuer Abonnent**.
* **Importieren**: Klicken Sie auf **Abonnenten importieren**, um eine CSV-Datei hochzuladen.
* **API**: Nutzen Sie die Listmonk-API für programmatische Ergänzungen.
* Weisen Sie Abonnenten beim Erstellen oder Importieren einer oder mehreren Listen zu.
* **Best Practice**: Nutzen Sie ein Double-Opt-in-Verfahren. Konfigurieren Sie dies unter **Einstellungen -> Opt-in & Abonnements**.

### Erstellen und Senden einer Kampagne {#create-and-send-a-campaign}

* Gehen Sie zu **Kampagnen** -> **Neue Kampagne**.
* Geben Sie die Kampagnendetails ein (Name, Betreff, Absender-E-Mail, Empfängerliste(n).
* Wählen Sie den Inhaltstyp (Rich Text/HTML, Nur-Text, Unformatiertes HTML).
* Verfassen Sie Ihren E-Mail-Inhalt. Sie können Vorlagenvariablen wie `{{ .Subscriber.Email }}` oder `{{ .Subscriber.FirstName }}` verwenden.
* **Senden Sie immer zuerst eine Test-E-Mail!** Nutzen Sie die Option „Test senden“, um eine Vorschau der E-Mail in Ihrem Posteingang anzuzeigen.
* Wenn Sie zufrieden sind, klicken Sie auf **Kampagne starten**, um den Versand sofort durchzuführen oder für einen späteren Zeitpunkt zu planen.

## Verifizierung {#verification}

* **SMTP-Zustellung**: Senden Sie regelmäßig Test-E-Mails über die SMTP-Einstellungsseite von Listmonk und testen Sie Kampagnen, um sicherzustellen, dass die E-Mails korrekt zugestellt werden.
* **Bounce-Behandlung**: Senden Sie eine Testkampagne an eine bekanntermaßen ungültige E-Mail-Adresse (z. B. `bounce-test@yourdomain.com`, falls Sie keine gültige Adresse zur Hand haben; die Ergebnisse können jedoch variieren). Überprüfen Sie nach kurzer Zeit die Kampagnenstatistiken in Listmonk, um festzustellen, ob der Bounce registriert wurde.
* **E-Mail-Header**: Verwenden Sie Tools wie [Mail-Tester](https://www.mail-tester.com/) oder überprüfen Sie E-Mail-Header manuell, um sicherzustellen, dass SPF, DKIM und DMARC durchgelassen werden, was auf eine korrekte Einrichtung durch Forward Email hindeutet.
* **Forward Email-Protokolle**: Überprüfen Sie Ihre Forward Email-Dashboard-Protokolle, wenn Sie Zustellungsprobleme vermuten, die vom SMTP-Server herrühren.

## Entwicklerhinweise {#developer-notes}

* **Templating**: Listmonk nutzt die Template-Engine von Go. Weitere Informationen zur erweiterten Personalisierung finden Sie in der Dokumentation: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk bietet eine umfassende REST-API zur Verwaltung von Listen, Abonnenten, Kampagnen, Vorlagen und mehr. Den Link zur API-Dokumentation finden Sie in der Fußzeile Ihrer Listmonk-Instanz.
* **Benutzerdefinierte Felder**: Definieren Sie unter **Einstellungen -> Abonnentenfelder** benutzerdefinierte Abonnentenfelder, um zusätzliche Daten zu speichern.
* **Webhooks**: Neben Bounces kann Listmonk auch Webhooks für andere Ereignisse (z. B. Abonnements) senden und so die Integration mit anderen Systemen ermöglichen.

## Fazit {#conclusion}

Durch die Integration der selbst gehosteten Leistung von Listmonk mit der sicheren, datenschutzkonformen Zustellung von Forward Email schaffen Sie eine robuste und ethische E-Mail-Marketing-Plattform. Sie behalten die volle Kontrolle über Ihre Zielgruppendaten und profitieren gleichzeitig von hoher Zustellbarkeit und automatisierten Sicherheitsfunktionen.

Dieses Setup bietet eine skalierbare, kostengünstige und entwicklerfreundliche Alternative zu proprietären E-Mail-Diensten und steht im Einklang mit dem Ethos von Open-Source-Software und dem Schutz der Privatsphäre der Benutzer.

Viel Spaß beim Senden! 🚀