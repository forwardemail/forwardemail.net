# Selbst gehostete E-Mail: Engagement für Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Warum selbst gehostete E-Mails wichtig sind](#why-self-hosted-email-matters)
  * [Das Problem mit herkömmlichen E-Mail-Diensten](#the-problem-with-traditional-email-services)
  * [Die selbstgehostete Alternative](#the-self-hosted-alternative)
* [Unsere selbstgehostete Implementierung: Technischer Überblick](#our-self-hosted-implementation-technical-overview)
  * [Docker-basierte Architektur für Einfachheit und Portabilität](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-Skriptinstallation: Zugänglichkeit trifft Sicherheit](#bash-script-installation-accessibility-meets-security)
  * [Quantensichere Verschlüsselung für zukunftssichere Privatsphäre](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatisierte Wartung und Updates](#automated-maintenance-and-updates)
* [Das Open-Source-Engagement](#the-open-source-commitment)
* [Selbst gehostet vs. verwaltet: Die richtige Wahl treffen](#self-hosted-vs-managed-making-the-right-choice)
  * [Die Realität des Self-Hosting von E-Mails](#the-reality-of-self-hosting-email)
  * [Wann Sie sich für unseren Managed Service entscheiden sollten](#when-to-choose-our-managed-service)
* [Erste Schritte mit selbstgehosteter E-Mail-Weiterleitung](#getting-started-with-self-hosted-forward-email)
  * [Systemanforderungen](#system-requirements)
  * [Installationsschritte](#installation-steps)
* [Die Zukunft selbstgehosteter E-Mails](#the-future-of-self-hosted-email)
* [Fazit: E-Mail-Freiheit für alle](#conclusion-email-freedom-for-everyone)
* [Verweise](#references)

## Vorwort {#foreword}

In der heutigen digitalen Welt ist E-Mail nach wie vor das Rückgrat unserer Online-Identität und -Kommunikation. Doch angesichts wachsender Datenschutzbedenken stehen viele Nutzer vor einer schwierigen Entscheidung: Komfort auf Kosten der Privatsphäre oder Privatsphäre auf Kosten des Komforts. Wir bei Forward Email waren schon immer der Meinung, dass Sie sich nicht zwischen beidem entscheiden müssen.

Wir freuen uns, heute einen wichtigen Meilenstein auf unserem Weg bekannt zu geben: die Einführung unserer selbstgehosteten E-Mail-Lösung. Diese Funktion steht für unser tiefgreifendes Engagement für Open-Source-Prinzipien, datenschutzorientiertes Design und die Stärkung unserer Nutzerrechte. Mit unserer selbstgehosteten Option geben wir Ihnen die volle Kontrolle über Ihre E-Mail-Kommunikation.

In diesem Blogbeitrag wird die Philosophie hinter unserer selbstgehosteten Lösung und ihre technische Implementierung erläutert. Außerdem wird erläutert, warum sie für Benutzer wichtig ist, denen Datenschutz und Eigentum bei ihrer digitalen Kommunikation gleichermaßen am Herzen liegen.

## Warum selbst gehostete E-Mails wichtig sind {#why-self-hosted-email-matters}

Unsere selbstgehostete E-Mail-Lösung ist der deutlichste Ausdruck unserer Überzeugung, dass echter Datenschutz Kontrolle bedeutet, und Kontrolle beginnt mit Open Source. Für Nutzer, die volle Kontrolle über ihre digitale Kommunikation verlangen, ist Self-Hosting keine Randerscheinung mehr – es ist ein grundlegendes Recht. Wir sind stolz darauf, diese Überzeugung mit einer vollständig offenen, überprüfbaren Plattform zu unterstützen, die Sie nach Ihren eigenen Vorstellungen betreiben können.

### Das Problem mit herkömmlichen E-Mail-Diensten {#the-problem-with-traditional-email-services}

Herkömmliche E-Mail-Dienste stellen datenschutzbewusste Benutzer vor mehrere grundlegende Herausforderungen:

1. **Vertrauensvoraussetzungen**: Sie müssen darauf vertrauen, dass der Anbieter nicht auf Ihre Daten zugreift, diese analysiert oder weitergibt.
2. **Zentralisierte Kontrolle**: Ihr Zugriff kann jederzeit und aus beliebigen Gründen widerrufen werden.
3. **Überwachungsschwachstelle**: Zentralisierte Dienste sind bevorzugte Ziele für Überwachung.
4. **Eingeschränkte Transparenz**: Die meisten Dienste verwenden proprietäre Closed-Source-Software.
5. **Anbieterabhängigkeit**: Die Migration von diesen Diensten kann schwierig oder unmöglich sein.

Selbst datenschutzorientierte E-Mail-Anbieter scheitern oft, indem sie ihre Frontend-Anwendungen nur als Open Source anbieten, während ihre Backend-Systeme proprietär und geschlossen bleiben. Dies schafft eine erhebliche Vertrauenslücke: Man soll ihren Datenschutzversprechen Glauben schenken, ohne sie überprüfen zu können.

### Die selbstgehostete Alternative {#the-self-hosted-alternative}

Das Self-Hosting Ihrer E-Mails bietet einen grundlegend anderen Ansatz:

1. **Vollständige Kontrolle**: Sie besitzen und kontrollieren die gesamte E-Mail-Infrastruktur.
2. **Überprüfbarer Datenschutz**: Das gesamte System ist transparent und überprüfbar.
3. **Kein Vertrauen erforderlich**: Sie müssen Ihre Kommunikation keinem Dritten anvertrauen.
4. **Anpassungsfreiheit**: Passen Sie das System an Ihre spezifischen Bedürfnisse an.
5. **Ausfallsicherheit**: Ihr Service bleibt unabhängig von Unternehmensentscheidungen bestehen.

Ein Benutzer drückte es so aus: „Das Selbsthosting meiner E-Mails ist das digitale Äquivalent zum Anbau meiner eigenen Lebensmittel – es macht mehr Arbeit, aber ich weiß genau, was drin ist.“

## Unsere selbstgehostete Implementierung: Technische Übersicht {#our-self-hosted-implementation-technical-overview}

Unsere selbst gehostete E-Mail-Lösung basiert auf denselben Datenschutzprinzipien wie alle unsere Produkte. Sehen wir uns die technische Umsetzung an, die dies ermöglicht.

### Docker-basierte Architektur für Einfachheit und Portabilität {#docker-based-architecture-for-simplicity-and-portability}

Wir haben unsere gesamte E-Mail-Infrastruktur mit Docker gepackt und können sie so problemlos auf praktisch jedem Linux-System bereitstellen. Dieser containerisierte Ansatz bietet mehrere wichtige Vorteile:

1. **Vereinfachte Bereitstellung**: Ein einziger Befehl richtet die gesamte Infrastruktur ein.
2. **Konsistente Umgebung**: Beseitigt Probleme mit der Verfügbarkeit auf meinem Rechner.
3. **Isolierte Komponenten**: Jeder Dienst läuft aus Sicherheitsgründen in einem eigenen Container.
4. **Einfache Updates**: Einfache Befehle zum Aktualisieren des gesamten Stacks.
5. **Minimale Abhängigkeiten**: Erfordert nur Docker und Docker Compose.

Die Architektur umfasst Container für:

* Weboberfläche zur Verwaltung
* SMTP-Server für ausgehende E-Mails
* IMAP/POP3-Server für den E-Mail-Abruf
* CalDAV-Server für Kalender
* CardDAV-Server für Kontakte
* Datenbank zur Konfigurationsspeicherung
* Redis für Caching und Performance
* SQLite für sichere, verschlüsselte Postfachspeicherung

> \[!NOTE]
> Schauen Sie sich unbedingt unseren [selbstgehostetes Entwicklerhandbuch](https://forwardemail.net/self-hosted) an

### Bash-Skriptinstallation: Zugänglichkeit trifft Sicherheit {#bash-script-installation-accessibility-meets-security}

Wir haben den Installationsprozess so einfach wie möglich gestaltet und gleichzeitig die bewährten Sicherheitspraktiken eingehalten:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Dieser einzelne Befehl:

1. Überprüft die Systemanforderungen
2. Führt Sie durch die Konfiguration
3. Richtet DNS-Einträge ein
4. Konfiguriert TLS-Zertifikate
5. Stellt die Docker-Container bereit
6. Führt eine erste Sicherheitshärtung durch

Wenn Sie Bedenken hinsichtlich der Weiterleitung von Skripten an Bash haben (und das sollten Sie auch!), empfehlen wir Ihnen, das Skript vor der Ausführung zu überprüfen. Es ist vollständig Open Source und steht zur Einsichtnahme zur Verfügung.

### Quantensichere Verschlüsselung für zukunftssicheren Datenschutz {#quantum-safe-encryption-for-future-proof-privacy}

Wie unser gehosteter Dienst implementiert auch unsere selbstgehostete Lösung eine quantenresistente Verschlüsselung mit ChaCha20-Poly1305 als Chiffre für SQLite-Datenbanken. Dieser Ansatz schützt Ihre E-Mail-Daten nicht nur vor aktuellen Bedrohungen, sondern auch vor zukünftigen Quantencomputer-Angriffen.

Jedes Postfach wird in einer eigenen verschlüsselten SQLite-Datenbankdatei gespeichert, wodurch eine vollständige Isolierung zwischen den Benutzern gewährleistet wird – ein erheblicher Sicherheitsvorteil gegenüber herkömmlichen Ansätzen mit gemeinsam genutzten Datenbanken.

### Automatisierte Wartung und Updates {#automated-maintenance-and-updates}

Wir haben umfassende Wartungsprogramme direkt in die selbstgehostete Lösung integriert:

1. **Automatische Backups**: Geplante Backups aller wichtigen Daten
2. **Zertifikatserneuerung**: Automatisierte Let’s Encrypt-Zertifikatsverwaltung
3. **Systemupdates**: Einfaches Update auf die neueste Version
4. **Systemüberwachung**: Integrierte Prüfungen zur Gewährleistung der Systemintegrität

Auf diese Dienstprogramme kann über ein einfaches interaktives Menü zugegriffen werden:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Das Open-Source-Engagement {#the-open-source-commitment}

Unsere selbst gehostete E-Mail-Lösung ist, wie alle unsere Produkte, zu 100 % Open Source – sowohl im Frontend als auch im Backend. Das bedeutet:

1. **Vollständige Transparenz**: Jede Codezeile, die Ihre E-Mails verarbeitet, ist öffentlich einsehbar.
2. **Community-Beiträge**: Jeder kann Verbesserungen beitragen oder Probleme beheben.
3. **Sicherheit durch Offenheit**: Schwachstellen können von einer globalen Community identifiziert und behoben werden.
4. **Keine Abhängigkeit von einem Anbieter**: Sie sind nicht von der Existenz unseres Unternehmens abhängig.

Die gesamte Codebasis ist auf GitHub unter <https://github.com/forwardemail/forwardemail.net>. verfügbar

## Selbst gehostet vs. verwaltet: Die richtige Wahl treffen {#self-hosted-vs-managed-making-the-right-choice}

Wir sind stolz darauf, eine selbst gehostete Option anbieten zu können, wissen aber, dass sie nicht für jeden die richtige Wahl ist. Selbst gehostete E-Mails bringen echte Verantwortung und Herausforderungen mit sich:

### Die Realität des Self-Hosting von E-Mails {#the-reality-of-self-hosting-email}

#### Technische Überlegungen {#technical-considerations}

* **Serververwaltung**: Sie müssen einen VPS oder dedizierten Server verwalten.
* **DNS-Konfiguration**: Eine korrekte DNS-Einrichtung ist entscheidend für die Zustellbarkeit.
* **Sicherheitsupdates**: Die Verwendung aktueller Sicherheitspatches ist unerlässlich.
* **Spam-Management**: Sie müssen sich um die Spam-Filterung kümmern.
* **Backup-Strategie**: Die Implementierung zuverlässiger Backups liegt in Ihrer Verantwortung.

#### Zeitaufwand {#time-investment}

* **Ersteinrichtung**: Zeitaufwand für Einrichtung, Überprüfung und Lesen der Dokumentation
* **Laufende Wartung**: Gelegentliche Updates und Überwachung
* **Fehlerbehebung**: Gelegentliche Zeitaufwand für die Problembehebung

#### Finanzielle Überlegungen {#financial-considerations}

* **Serverkosten**: 5–20 $/Monat für einen Basis-VPS
* **Domainregistrierung**: 10–20 $/Jahr
* **Zeitwert**: Ihre Zeitinvestition hat einen echten Mehrwert

### Wann Sie sich für unseren Managed Service entscheiden sollten {#when-to-choose-our-managed-service}

Für viele Benutzer bleibt unser Managed Service die beste Option:

1. **Komfort**: Wir kümmern uns um Wartung, Updates und Überwachung.
2. **Zuverlässigkeit**: Profitieren Sie von unserer etablierten Infrastruktur und Expertise.
3. **Support**: Erhalten Sie Hilfe bei Problemen.
4. **Zustellbarkeit**: Profitieren Sie von unserem etablierten Ruf im Bereich IP.
5. **Kosteneffizienz**: Unter Berücksichtigung der Zeitkosten ist unser Service oft wirtschaftlicher.

Beide Optionen bieten dieselben Datenschutzvorteile und die gleiche Open-Source-Transparenz – der Unterschied besteht lediglich darin, wer die Infrastruktur verwaltet.

## Erste Schritte mit selbst gehosteter E-Mail-Weiterleitung {#getting-started-with-self-hosted-forward-email}

Sind Sie bereit, die Kontrolle über Ihre E-Mail-Infrastruktur zu übernehmen? So starten Sie:

### Systemanforderungen {#system-requirements}

* Ubuntu 20.04 LTS oder neuer (empfohlen)
* Mindestens 1 GB RAM (2 GB+ empfohlen)
* 20 GB Speicherplatz empfohlen
* Ein Domänenname Ihrer Wahl
* Öffentliche IP-Adresse mit Unterstützung für Port 25
* Möglichkeit, [umgekehrter PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) festzulegen
* IPv4- und IPv6-Unterstützung

> \[!TIP]
> Wir empfehlen verschiedene Mailserver-Anbieter unter <https://forwardemail.net/blog/docs/best-mail-server-providers> (Quelle unter <https://github.com/forwardemail/awesome-mail-server-providers>)

### Installationsschritte {#installation-steps}

1. **Installationsskript ausführen**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Folgen Sie den interaktiven Anweisungen**:
* Geben Sie Ihren Domänennamen ein.
* Konfigurieren Sie die Administratoranmeldeinformationen.
* Richten Sie die DNS-Einträge wie angegeben ein.
* Wählen Sie Ihre bevorzugten Konfigurationsoptionen.

3. **Installation überprüfen**:
Nach Abschluss der Installation können Sie die Funktionsfähigkeit folgendermaßen überprüfen:
* Überprüfen des Containerstatus: `docker ps`
* Senden einer Test-E-Mail
* Anmelden an der Weboberfläche

## Die Zukunft selbstgehosteter E-Mails {#the-future-of-self-hosted-email}

Unsere selbst gehostete Lösung ist nur der Anfang. Wir sind bestrebt, dieses Angebot kontinuierlich zu verbessern:

1. **Verbesserte Administrationstools**: Leistungsstärkere webbasierte Verwaltung
2. **Zusätzliche Authentifizierungsoptionen**: Inklusive Unterstützung für Hardware-Sicherheitsschlüssel
3. **Erweiterte Überwachung**: Bessere Einblicke in Systemzustand und -leistung
4. **Multiserver-Bereitstellung**: Optionen für Hochverfügbarkeitskonfigurationen
5. **Community-orientierte Verbesserungen**: Berücksichtigung von Nutzerbeiträgen

## Fazit: E-Mail-Freiheit für alle {#conclusion-email-freedom-for-everyone}

Die Einführung unserer selbstgehosteten E-Mail-Lösung stellt einen wichtigen Meilenstein in unserem Bestreben dar, datenschutzorientierte und transparente E-Mail-Dienste anzubieten. Egal, ob Sie sich für unseren Managed Service oder die selbstgehostete Option entscheiden, profitieren Sie von unserem unerschütterlichen Engagement für Open-Source-Prinzipien und ein datenschutzorientiertes Design.

E-Mail ist zu wichtig, um von geschlossenen, proprietären Systemen kontrolliert zu werden, die Datenerfassung über die Privatsphäre der Nutzer stellen. Mit der selbstgehosteten Lösung von Forward Email bieten wir Ihnen eine echte Alternative – eine Lösung, die Ihnen die volle Kontrolle über Ihre digitale Kommunikation gibt.

Wir glauben, dass Datenschutz nicht nur ein Feature ist, sondern ein Grundrecht. Und mit unserer selbst gehosteten E-Mail-Option machen wir dieses Recht zugänglicher als je zuvor.

Bereit, die Kontrolle über Ihre E-Mails zu übernehmen? [Starten Sie noch heute](https://forwardemail.net/self-hosted) oder erkunden Sie unseren [GitHub-Repository](https://github.com/forwardemail/forwardemail.net), um mehr zu erfahren.

## Referenzen {#references}

\[1] E-Mail weiterleiten GitHub-Repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Selbstgehostete Dokumentation: <https://forwardemail.net/en/self-hosted>

\[3] Technische Implementierung des E-Mail-Datenschutzes: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Warum Open-Source-E-Mail wichtig ist: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>