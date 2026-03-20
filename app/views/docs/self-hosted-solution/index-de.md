# Selbstgehostete E-Mail: Verpflichtung zu Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Illustration einer selbstgehosteten E-Mail-Lösung" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Warum selbstgehostete E-Mail wichtig ist](#why-self-hosted-email-matters)
  * [Das Problem mit traditionellen E-Mail-Diensten](#the-problem-with-traditional-email-services)
  * [Die selbstgehostete Alternative](#the-self-hosted-alternative)
* [Unsere selbstgehostete Implementierung: Technischer Überblick](#our-self-hosted-implementation-technical-overview)
  * [Docker-basierte Architektur für Einfachheit und Portabilität](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-Skript-Installation: Zugänglichkeit trifft Sicherheit](#bash-script-installation-accessibility-meets-security)
  * [Quanten-sichere Verschlüsselung für zukunftssichere Privatsphäre](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatisierte Wartung und Updates](#automated-maintenance-and-updates)
* [Das Open-Source-Versprechen](#the-open-source-commitment)
* [Selbstgehostet vs. Managed: Die richtige Wahl treffen](#self-hosted-vs-managed-making-the-right-choice)
  * [Die Realität des Selbsthostings von E-Mails](#the-reality-of-self-hosting-email)
  * [Wann man unseren Managed Service wählen sollte](#when-to-choose-our-managed-service)
* [Erste Schritte mit selbstgehostetem Forward Email](#getting-started-with-self-hosted-forward-email)
  * [Systemanforderungen](#system-requirements)
  * [Installationsschritte](#installation-steps)
* [Die Zukunft der selbstgehosteten E-Mail](#the-future-of-self-hosted-email)
* [Fazit: E-Mail-Freiheit für alle](#conclusion-email-freedom-for-everyone)
* [Quellen](#references)


## Vorwort {#foreword}

In der heutigen digitalen Landschaft bleibt E-Mail das Rückgrat unserer Online-Identität und Kommunikation. Doch mit wachsendem Datenschutzbewusstsein stehen viele Nutzer vor einer schwierigen Wahl: Bequemlichkeit auf Kosten der Privatsphäre oder Privatsphäre auf Kosten der Bequemlichkeit. Bei Forward Email waren wir schon immer der Meinung, dass man sich nicht zwischen beidem entscheiden muss.

Heute freuen wir uns, einen bedeutenden Meilenstein auf unserem Weg bekannt zu geben: die Einführung unserer selbstgehosteten E-Mail-Lösung. Dieses Feature steht für unser tiefstes Engagement für Open-Source-Prinzipien, datenschutzorientiertes Design und Nutzerermächtigung. Mit unserer selbstgehosteten Option geben wir die volle Macht und Kontrolle über Ihre E-Mail-Kommunikation direkt in Ihre Hände.

Dieser Blogbeitrag beleuchtet die Philosophie hinter unserer selbstgehosteten Lösung, deren technische Umsetzung und warum sie für Nutzer wichtig ist, die sowohl Privatsphäre als auch Eigentum an ihrer digitalen Kommunikation priorisieren.


## Warum selbstgehostete E-Mail wichtig ist {#why-self-hosted-email-matters}

Unsere selbstgehostete E-Mail-Lösung ist der klarste Ausdruck unseres Glaubens, dass echte Privatsphäre Kontrolle bedeutet und Kontrolle mit Open Source beginnt. Für Nutzer, die vollständiges Eigentum an ihrer digitalen Kommunikation verlangen, ist Selbsthosting keine Randidee mehr – es ist ein grundlegendes Recht. Wir sind stolz darauf, hinter diesem Glauben mit einer vollständig offenen, überprüfbaren Plattform zu stehen, die Sie nach Ihren eigenen Bedingungen betreiben können.

### Das Problem mit traditionellen E-Mail-Diensten {#the-problem-with-traditional-email-services}

Traditionelle E-Mail-Dienste stellen für datenschutzbewusste Nutzer mehrere grundlegende Herausforderungen dar:

1. **Vertrauensvoraussetzungen**: Sie müssen dem Anbieter vertrauen, dass er nicht auf Ihre Daten zugreift, sie analysiert oder weitergibt
2. **Zentralisierte Kontrolle**: Ihr Zugang kann jederzeit und aus beliebigem Grund entzogen werden
3. **Überwachungsanfälligkeit**: Zentralisierte Dienste sind Hauptziele für Überwachung
4. **Begrenzte Transparenz**: Die meisten Dienste verwenden proprietäre, Closed-Source-Software
5. **Anbietersperre**: Der Wechsel von diesen Diensten kann schwierig oder unmöglich sein

Selbst "datenschutzorientierte" E-Mail-Anbieter bleiben oft hinter den Erwartungen zurück, indem sie nur ihre Frontend-Anwendungen als Open Source bereitstellen, während ihre Backend-Systeme proprietär und geschlossen bleiben. Dies schafft eine erhebliche Vertrauenslücke – Sie sollen ihren Datenschutzversprechen glauben, ohne sie überprüfen zu können.

### Die selbstgehostete Alternative {#the-self-hosted-alternative}
Das Selbst-Hosting Ihrer E-Mails bietet einen grundlegend anderen Ansatz:

1. **Vollständige Kontrolle**: Sie besitzen und kontrollieren die gesamte E-Mail-Infrastruktur
2. **Verifizierbare Privatsphäre**: Das gesamte System ist transparent und prüfbar
3. **Kein Vertrauen erforderlich**: Sie müssen keiner dritten Partei Ihre Kommunikation anvertrauen
4. **Freiheit zur Anpassung**: Passen Sie das System an Ihre spezifischen Bedürfnisse an
5. **Resilienz**: Ihr Dienst läuft unabhängig von Entscheidungen eines Unternehmens weiter

Wie ein Nutzer es ausdrückte: „Das Selbst-Hosting meiner E-Mails ist das digitale Äquivalent dazu, mein eigenes Essen anzubauen – es erfordert mehr Arbeit, aber ich weiß genau, was drin ist.“


## Unsere selbst-gehostete Implementierung: Technischer Überblick {#our-self-hosted-implementation-technical-overview}

Unsere selbst-gehostete E-Mail-Lösung basiert auf denselben Datenschutzprinzipien, die alle unsere Produkte leiten. Lassen Sie uns die technische Umsetzung erkunden, die dies ermöglicht.

### Docker-basierte Architektur für Einfachheit und Portabilität {#docker-based-architecture-for-simplicity-and-portability}

Wir haben unsere gesamte E-Mail-Infrastruktur mit Docker verpackt, was die Bereitstellung auf nahezu jedem Linux-basierten System erleichtert. Dieser containerisierte Ansatz bietet mehrere wesentliche Vorteile:

1. **Vereinfachte Bereitstellung**: Ein einziger Befehl richtet die gesamte Infrastruktur ein
2. **Konsistente Umgebung**: Vermeidet „funktioniert nur auf meinem Rechner“-Probleme
3. **Isolierte Komponenten**: Jeder Dienst läuft in seinem eigenen Container für Sicherheit
4. **Einfache Updates**: Einfache Befehle zum Aktualisieren des gesamten Stacks
5. **Minimale Abhängigkeiten**: Erfordert nur Docker und Docker Compose

Die Architektur umfasst Container für:

* Weboberfläche zur Administration
* SMTP-Server für ausgehende E-Mails
* IMAP/POP3-Server für den E-Mail-Abruf
* CalDAV-Server für Kalender
* CardDAV-Server für Kontakte
* Datenbank zur Konfigurationsspeicherung
* Redis für Caching und Performance
* SQLite für sichere, verschlüsselte Postfachspeicherung

> \[!NOTE]
> Schauen Sie sich unbedingt unseren [Entwicklerleitfaden für Selbst-Hosting](https://forwardemail.net/self-hosted) an

### Bash-Skript-Installation: Zugänglichkeit trifft Sicherheit {#bash-script-installation-accessibility-meets-security}

Wir haben den Installationsprozess so einfach wie möglich gestaltet und gleichzeitig bewährte Sicherheitspraktiken eingehalten:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Dieser einzelne Befehl:

1. Überprüft die Systemvoraussetzungen
2. Führt Sie durch die Konfiguration
3. Richtet DNS-Einträge ein
4. Konfiguriert TLS-Zertifikate
5. Setzt die Docker-Container ein
6. Führt erste Sicherheits-Härtungen durch

Für diejenigen, die Bedenken haben, Skripte direkt an bash zu übergeben (was auch sinnvoll ist!), empfehlen wir, das Skript vor der Ausführung zu prüfen. Es ist vollständig Open Source und einsehbar.

### Quanten-sichere Verschlüsselung für zukunftssicheren Datenschutz {#quantum-safe-encryption-for-future-proof-privacy}

Wie unser gehosteter Dienst verwendet unsere selbst-gehostete Lösung quantenresistente Verschlüsselung mit ChaCha20-Poly1305 als Verschlüsselungsverfahren für SQLite-Datenbanken. Dieser Ansatz schützt Ihre E-Mail-Daten nicht nur vor aktuellen Bedrohungen, sondern auch vor zukünftigen Angriffen durch Quantencomputer.

Jedes Postfach wird in einer eigenen verschlüsselten SQLite-Datenbankdatei gespeichert, was eine vollständige Isolation zwischen den Nutzern gewährleistet – ein bedeutender Sicherheitsvorteil gegenüber herkömmlichen gemeinsam genutzten Datenbankansätzen.

### Automatisierte Wartung und Updates {#automated-maintenance-and-updates}

Wir haben umfassende Wartungswerkzeuge direkt in die selbst-gehostete Lösung integriert:

1. **Automatische Backups**: Geplante Sicherungen aller kritischen Daten
2. **Zertifikatserneuerung**: Automatisches Management von Let's Encrypt-Zertifikaten
3. **Systemupdates**: Einfacher Befehl zum Aktualisieren auf die neueste Version
4. **Gesundheitsüberwachung**: Eingebaute Prüfungen zur Sicherstellung der Systemintegrität

Diese Werkzeuge sind über ein einfaches interaktives Menü zugänglich:

```bash
# script prompt

1. Initiale Einrichtung
2. Backups einrichten
3. Automatische Updates einrichten
4. Zertifikate erneuern
5. Von Backup wiederherstellen
6. Hilfe
7. Beenden
```


## Das Open-Source-Versprechen {#the-open-source-commitment}

Unsere selbst-gehostete E-Mail-Lösung ist wie alle unsere Produkte zu 100 % Open Source – sowohl Frontend als auch Backend. Das bedeutet:
1. **Vollständige Transparenz**: Jede Codezeile, die Ihre E-Mails verarbeitet, ist öffentlich einsehbar  
2. **Beiträge aus der Community**: Jeder kann Verbesserungen beitragen oder Probleme beheben  
3. **Sicherheit durch Offenheit**: Schwachstellen können von einer globalen Gemeinschaft erkannt und behoben werden  
4. **Kein Vendor Lock-in**: Sie sind niemals von der Existenz unseres Unternehmens abhängig  

Der gesamte Code ist auf GitHub verfügbar unter <https://github.com/forwardemail/forwardemail.net>.


## Selbst gehostet vs. Managed: Die richtige Wahl treffen {#self-hosted-vs-managed-making-the-right-choice}

Obwohl wir stolz sind, eine selbst gehostete Option anzubieten, erkennen wir an, dass sie nicht für jeden die richtige Wahl ist. Das Selbst-Hosting von E-Mails bringt echte Verantwortlichkeiten und Herausforderungen mit sich:

### Die Realität des Selbst-Hostings von E-Mails {#the-reality-of-self-hosting-email}

#### Technische Überlegungen {#technical-considerations}

* **Serververwaltung**: Sie müssen einen VPS oder dedizierten Server warten  
* **DNS-Konfiguration**: Eine korrekte DNS-Einrichtung ist entscheidend für die Zustellbarkeit  
* **Sicherheitsupdates**: Es ist essenziell, Sicherheitsupdates aktuell zu halten  
* **Spam-Management**: Sie müssen die Spam-Filterung selbst übernehmen  
* **Backup-Strategie**: Die Implementierung zuverlässiger Backups liegt in Ihrer Verantwortung  

#### Zeitaufwand {#time-investment}

* **Erstinstallation**: Zeit für Einrichtung, Verifizierung und das Lesen der Dokumentation  
* **Laufende Wartung**: Gelegentliche Updates und Überwachung  
* **Fehlerbehebung**: Zeit für die Lösung von Problemen  

#### Finanzielle Überlegungen {#financial-considerations}

* **Serverkosten**: 5–20 $/Monat für einen einfachen VPS  
* **Domain-Registrierung**: 10–20 $/Jahr  
* **Zeitwert**: Ihr Zeitaufwand hat einen realen Wert  

### Wann Sie unseren Managed Service wählen sollten {#when-to-choose-our-managed-service}

Für viele Nutzer bleibt unser Managed Service die beste Option:

1. **Bequemlichkeit**: Wir übernehmen Wartung, Updates und Überwachung  
2. **Zuverlässigkeit**: Profitieren Sie von unserer etablierten Infrastruktur und Expertise  
3. **Support**: Erhalten Sie Hilfe bei Problemen  
4. **Zustellbarkeit**: Nutzen Sie unseren etablierten IP-Ruf  
5. **Kosten-Effektivität**: Berücksichtigt man die Zeitkosten, ist unser Service oft wirtschaftlicher  

Beide Optionen bieten dieselben Datenschutzvorteile und Open-Source-Transparenz – der Unterschied liegt lediglich darin, wer die Infrastruktur verwaltet.


## Einstieg in Self-Hosted Forward Email {#getting-started-with-self-hosted-forward-email}

Bereit, die Kontrolle über Ihre E-Mail-Infrastruktur zu übernehmen? So starten Sie:

### Systemanforderungen {#system-requirements}

* Ubuntu 20.04 LTS oder neuer (empfohlen)  
* Mindestens 1 GB RAM (2 GB+ empfohlen)  
* 20 GB Speicher empfohlen  
* Eine Domain, die Sie kontrollieren  
* Öffentliche IP-Adresse mit Port-25-Unterstützung  
* Möglichkeit, einen [Reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) einzurichten  
* Unterstützung für IPv4 und IPv6  

> \[!TIP]  
> Wir empfehlen mehrere Mailserver-Anbieter unter <https://forwardemail.net/blog/docs/best-mail-server-providers> (Quelle: <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Installationsschritte {#installation-steps}

1. **Führen Sie das Installationsskript aus**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Folgen Sie den interaktiven Eingabeaufforderungen**:  
   * Geben Sie Ihren Domainnamen ein  
   * Konfigurieren Sie Administrator-Zugangsdaten  
   * Richten Sie die DNS-Einträge wie angegeben ein  
   * Wählen Sie Ihre bevorzugten Konfigurationsoptionen  

3. **Installation überprüfen**:  
   Nach Abschluss der Installation können Sie die Funktionalität prüfen durch:  
   * Überprüfen des Container-Status: `docker ps`  
   * Senden einer Test-E-Mail  
   * Anmeldung im Webinterface  


## Die Zukunft von Self-Hosted Email {#the-future-of-self-hosted-email}

Unsere selbst gehostete Lösung ist erst der Anfang. Wir sind bestrebt, dieses Angebot kontinuierlich zu verbessern mit:

1. **Erweiterten Verwaltungstools**: Leistungsfähigere webbasierte Verwaltung  
2. **Zusätzlichen Authentifizierungsoptionen**: Einschließlich Unterstützung für Hardware-Sicherheitsschlüssel  
3. **Fortschrittlichem Monitoring**: Bessere Einblicke in Systemgesundheit und Leistung  
4. **Multi-Server-Bereitstellung**: Optionen für hochverfügbare Konfigurationen  
5. **Community-getriebenen Verbesserungen**: Einbindung von Beiträgen der Nutzer
## Fazit: E-Mail-Freiheit für alle {#conclusion-email-freedom-for-everyone}

Die Einführung unserer selbstgehosteten E-Mail-Lösung stellt einen bedeutenden Meilenstein in unserer Mission dar, datenschutzorientierte, transparente E-Mail-Dienste anzubieten. Egal, ob Sie unseren verwalteten Service oder die selbstgehostete Option wählen, Sie profitieren von unserem unerschütterlichen Engagement für Open-Source-Prinzipien und datenschutzorientiertes Design.

E-Mail ist zu wichtig, um von geschlossenen, proprietären Systemen kontrolliert zu werden, die Datensammlung über den Schutz der Privatsphäre der Nutzer stellen. Mit der selbstgehosteten Lösung von Forward Email sind wir stolz darauf, eine echte Alternative anzubieten – eine, die Ihnen die vollständige Kontrolle über Ihre digitale Kommunikation gibt.

Wir sind der Überzeugung, dass Datenschutz nicht nur ein Feature ist; es ist ein grundlegendes Recht. Und mit unserer selbstgehosteten E-Mail-Option machen wir dieses Recht zugänglicher als je zuvor.

Bereit, die Kontrolle über Ihre E-Mails zu übernehmen? [Starten Sie noch heute](https://forwardemail.net/self-hosted) oder erkunden Sie unser [GitHub-Repository](https://github.com/forwardemail/forwardemail.net), um mehr zu erfahren.


## Quellen {#references}

\[1] Forward Email GitHub Repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Selbstgehostete Dokumentation: <https://forwardemail.net/en/self-hosted>

\[3] Technische Umsetzung des E-Mail-Datenschutzes: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Warum Open-Source-E-Mail wichtig ist: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
