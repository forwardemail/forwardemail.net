# So optimieren Sie die Node.js-Produktionsinfrastruktur: Best Practices {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Unsere Revolution der Single-Core-Leistungsoptimierung um 573 %](#our-573-single-core-performance-optimization-revolution)
  * [Warum die Single-Core-Leistungsoptimierung für Node.js wichtig ist](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Verwandte Inhalte](#related-content)
* [Einrichtung der Node.js-Produktionsumgebung: Unser Technologie-Stack](#nodejs-production-environment-setup-our-technology-stack)
  * [Paketmanager: pnpm für Produktionseffizienz](#package-manager-pnpm-for-production-efficiency)
  * [Web-Framework: Koa für die moderne Node.js-Produktion](#web-framework-koa-for-modern-nodejs-production)
  * [Hintergrund-Jobverarbeitung: Bree für Produktionszuverlässigkeit](#background-job-processing-bree-for-production-reliability)
  * [Fehlerbehandlung: @hapi/boom für Produktionszuverlässigkeit](#error-handling-hapiboom-for-production-reliability)
* [So überwachen Sie Node.js-Anwendungen in der Produktion](#how-to-monitor-nodejs-applications-in-production)
  * [Node.js-Produktionsüberwachung auf Systemebene](#system-level-nodejs-production-monitoring)
  * [Überwachung auf Anwendungsebene für die Node.js-Produktion](#application-level-monitoring-for-nodejs-production)
  * [Anwendungsspezifisches Monitoring](#application-specific-monitoring)
* [Node.js-Produktionsüberwachung mit PM2-Integritätschecks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Unser PM2 Health Check System](#our-pm2-health-check-system)
  * [Unsere PM2-Produktionskonfiguration](#our-pm2-production-configuration)
  * [Automatisierte PM2-Bereitstellung](#automated-pm2-deployment)
* [System zur Handhabung und Klassifizierung von Produktionsfehlern](#production-error-handling-and-classification-system)
  * [Unsere isCodeBug-Implementierung für die Produktion](#our-iscodebug-implementation-for-production)
  * [Integration mit unserer Produktionsprotokollierung](#integration-with-our-production-logging)
  * [Verwandte Inhalte](#related-content-1)
* [Erweitertes Performance-Debugging mit v8-profiler-next und cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Unser Profiling-Ansatz für die Node.js-Produktion](#our-profiling-approach-for-nodejs-production)
  * [So implementieren wir die Heap-Snapshot-Analyse](#how-we-implement-heap-snapshot-analysis)
  * [Leistungsdebugging-Workflow](#performance-debugging-workflow)
  * [Empfohlene Implementierung für Ihre Node.js-Anwendung](#recommended-implementation-for-your-nodejs-application)
  * [Integration mit unserer Produktionsüberwachung](#integration-with-our-production-monitoring)
* [Sicherheit der Node.js-Produktionsinfrastruktur](#nodejs-production-infrastructure-security)
  * [Sicherheit auf Systemebene für die Node.js-Produktion](#system-level-security-for-nodejs-production)
  * [Anwendungssicherheit für Node.js-Anwendungen](#application-security-for-nodejs-applications)
  * [Automatisierung der Infrastruktursicherheit](#infrastructure-security-automation)
  * [Unsere Sicherheitsinhalte](#our-security-content)
* [Datenbankarchitektur für Node.js-Anwendungen](#database-architecture-for-nodejs-applications)
  * [SQLite-Implementierung für die Node.js-Produktion](#sqlite-implementation-for-nodejs-production)
  * [MongoDB-Implementierung für die Node.js-Produktion](#mongodb-implementation-for-nodejs-production)
* [Node.js-Produktions-Hintergrundjobverarbeitung](#nodejs-production-background-job-processing)
  * [Unser Bree-Server-Setup für die Produktion](#our-bree-server-setup-for-production)
  * [Beispiele für Produktionsjobs](#production-job-examples)
  * [Unsere Job-Scheduling-Muster für die Node.js-Produktion](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatisierte Wartung für Node.js-Produktionsanwendungen](#automated-maintenance-for-production-nodejs-applications)
  * [Unsere Cleanup-Implementierung](#our-cleanup-implementation)
  * [Speicherplatzverwaltung für die Node.js-Produktion](#disk-space-management-for-nodejs-production)
  * [Automatisierung der Infrastrukturwartung](#infrastructure-maintenance-automation)
* [Implementierungshandbuch für die Node.js-Produktionsbereitstellung](#nodejs-production-deployment-implementation-guide)
  * [Studieren Sie unseren aktuellen Code für Best Practices in der Produktion](#study-our-actual-code-for-production-best-practices)
  * [Lernen Sie aus unseren Blogbeiträgen](#learn-from-our-blog-posts)
  * [Infrastrukturautomatisierung für die Node.js-Produktion](#infrastructure-automation-for-nodejs-production)
  * [Unsere Fallstudien](#our-case-studies)
* [Fazit: Best Practices für die Node.js-Produktionsbereitstellung](#conclusion-nodejs-production-deployment-best-practices)
* [Vollständige Ressourcenliste für die Node.js-Produktion](#complete-resource-list-for-nodejs-production)
  * [Unsere wichtigsten Implementierungsdateien](#our-core-implementation-files)
  * [Unsere Serverimplementierungen](#our-server-implementations)
  * [Unsere Infrastrukturautomatisierung](#our-infrastructure-automation)
  * [Unsere technischen Blogbeiträge](#our-technical-blog-posts)
  * [Unsere Enterprise-Fallstudien](#our-enterprise-case-studies)

## Vorwort {#foreword}

Bei Forward Email haben wir jahrelang an der Perfektionierung unserer Node.js-Produktionsumgebung gearbeitet. Dieser umfassende Leitfaden stellt unsere bewährten Best Practices für die Node.js-Produktionsbereitstellung vor und konzentriert sich dabei auf Leistungsoptimierung, Überwachung und die Erkenntnisse, die wir bei der Skalierung von Node.js-Anwendungen für die Verarbeitung von Millionen täglicher Transaktionen gewonnen haben.

## Unsere Revolution der Single-Core-Leistungsoptimierung um 573 % {#our-573-single-core-performance-optimization-revolution}

Durch die Migration von Intel- auf AMD Ryzen-Prozessoren konnten wir die Leistung unserer Node.js-Anwendungen um 573 % steigern. Dies war keine geringfügige Optimierung – sie veränderte die Leistung unserer Node.js-Anwendungen in der Produktion grundlegend und verdeutlicht die Bedeutung der Single-Core-Leistungsoptimierung für jede Node.js-Anwendung.

> \[!TIP]
> Für die Best Practices der Node.js-Produktionsbereitstellung ist die Hardwareauswahl entscheidend. Wir haben uns aufgrund der Verfügbarkeit von AMD Ryzen für DataPacket Hosting entschieden, da Single-Core-Leistung für Node.js-Anwendungen entscheidend ist, da die JavaScript-Ausführung Single-Threaded ist.

### Warum die Single-Core-Leistungsoptimierung für Node.js wichtig ist {#why-single-core-performance-optimization-matters-for-nodejs}

Unsere Migration von Intel zu AMD Ryzen führte zu:

* **573 % Leistungssteigerung** bei der Anfrageverarbeitung (dokumentiert in [GitHub-Problem #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 unserer Statusseite
* **Beseitigung von Verarbeitungsverzögerungen** für nahezu sofortige Antworten (erwähnt in [GitHub-Problem #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Besseres Preis-Leistungs-Verhältnis** für Node.js-Produktionsumgebungen
* **Verbesserte Reaktionszeiten** für alle unsere Anwendungsendpunkte

Die Leistungssteigerung war so deutlich, dass wir AMD Ryzen Prozessoren nun für jede ernsthafte Node.js-Produktionsumgebung als unverzichtbar erachten, egal ob Sie Webanwendungen, APIs, Microservices oder andere Node.js-Workloads ausführen.

### Verwandte Inhalte {#related-content}

Weitere Informationen zu unseren Infrastrukturoptionen finden Sie hier:

* [Bester E-Mail-Weiterleitungsdienst](https://forwardemail.net/blog/docs/best-email-forwarding-service) – Leistungsvergleiche)
* [Selbstgehostete Lösung](https://forwardemail.net/blog/docs/self-hosted-solution) – Hardwareempfehlungen

## Einrichtung der Node.js-Produktionsumgebung: Unser Technologie-Stack {#nodejs-production-environment-setup-our-technology-stack}

Unsere Best Practices für die Node.js-Produktionsbereitstellung basieren auf der bewussten Auswahl der Technologie, die auf jahrelanger Produktionserfahrung basiert. Hier erfahren Sie, welche Technologien wir verwenden und warum diese für jede Node.js-Anwendung gelten:

### Paketmanager: pnpm für Produktionseffizienz {#package-manager-pnpm-for-production-efficiency}

**Was wir verwenden:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (angeheftete Version)

Wir haben uns für die Einrichtung unserer Node.js-Produktionsumgebung für pnpm statt npm und yarn entschieden, weil:

* **Schnellere Installationszeiten** in CI/CD-Pipelines
* **Speicherplatzeffizienz** durch Hardlinking
* **Strenge Abhängigkeitsauflösung** zur Vermeidung von Phantomabhängigkeiten
* **Bessere Leistung** in Produktionsbereitstellungen

> \[!NOTE]
> Im Rahmen unserer Best Practices für die Node.js-Produktionsbereitstellung fixieren wir exakte Versionen kritischer Tools wie pnpm, um ein konsistentes Verhalten in allen Umgebungen und auf allen Rechnern der Teammitglieder zu gewährleisten.

**Implementierungsdetails:**

* [Unsere package.json-Konfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Unser Blogbeitrag zum NPM-Ökosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Web Framework: Koa für moderne Node.js-Produktion {#web-framework-koa-for-modern-nodejs-production}

**Was wir verwenden:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Wir haben uns für unsere Node.js-Produktionsinfrastruktur für Koa statt Express entschieden, da es moderne Async/Await-Unterstützung und eine sauberere Middleware-Komposition bietet. Unser Gründer Nick Baugh hat sowohl zu Express als auch zu Koa beigetragen und uns tiefe Einblicke in beide Frameworks für den Produktionseinsatz gegeben.

Diese Muster gelten unabhängig davon, ob Sie REST-APIs, GraphQL-Server, Webanwendungen oder Microservices erstellen.

**Unsere Umsetzungsbeispiele:**

* [Webserver-Setup](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-Serverkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Leitfaden zur Implementierung von Kontaktformularen](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Hintergrundjobverarbeitung: Bree für Produktionszuverlässigkeit {#background-job-processing-bree-for-production-reliability}

**Was wir verwenden:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)-Scheduler

Wir haben Bree entwickelt und pflegen es, weil vorhandene Job-Scheduler unsere Anforderungen an Worker-Thread-Unterstützung und moderne JavaScript-Funktionen in produktiven Node.js-Umgebungen nicht erfüllten. Dies gilt für alle Node.js-Anwendungen, die Hintergrundverarbeitung, geplante Aufgaben oder Worker-Threads benötigen.

**Unsere Umsetzungsbeispiele:**

* [Bree-Server-Setup](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Alle unsere Stellenbeschreibungen](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2-Integritätscheck-Job](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementierung von Bereinigungsaufträgen](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Fehlerbehandlung: @hapi/boom für Produktionszuverlässigkeit {#error-handling-hapiboom-for-production-reliability}

**Was wir verwenden:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Wir verwenden @hapi/boom für strukturierte Fehlerantworten in unseren Node.js-Produktionsanwendungen. Dieses Muster funktioniert für alle Node.js-Anwendungen, die eine konsistente Fehlerbehandlung benötigen.

**Unsere Umsetzungsbeispiele:**

* [Fehlerklassifizierungshilfe](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Logger-Implementierung](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## So überwachen Sie Node.js-Anwendungen in der Produktion {#how-to-monitor-nodejs-applications-in-production}

Unser Ansatz zur Überwachung von Node.js-Anwendungen in der Produktion hat sich durch jahrelange Erfahrung im Einsatz von Anwendungen im großen Maßstab weiterentwickelt. Wir implementieren die Überwachung auf mehreren Ebenen, um Zuverlässigkeit und Leistung für jede Art von Node.js-Anwendung zu gewährleisten.

### Node.js-Produktionsüberwachung auf Systemebene {#system-level-nodejs-production-monitoring}

**Unsere Kernimplementierung:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Was wir verwenden:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Unsere Produktionsüberwachungsschwellenwerte (aus unserem tatsächlichen Produktionscode):

* **2 GB Heap-Größenlimit** mit automatischen Warnmeldungen
* **25 % Speicherauslastung** Warnschwelle
* **80 % CPU-Auslastung** Warnschwelle
* **75 % Festplattenauslastung** Warnschwelle

> \[!WARNING]
> Diese Schwellenwerte gelten für unsere spezifische Hardwarekonfiguration. Wenn Sie die Node.js-Produktionsüberwachung implementieren, überprüfen Sie unsere monitor-server.js-Implementierung, um die genaue Logik zu verstehen und die Werte an Ihr Setup anzupassen.

### Überwachung auf Anwendungsebene für die Node.js-Produktion {#application-level-monitoring-for-nodejs-production}

**Unsere Fehlerklassifizierung:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Dieser Helfer unterscheidet zwischen:

* **Tatsächliche Codefehler**, die sofortiger Aufmerksamkeit bedürfen
* **Benutzerfehler**, die dem erwarteten Verhalten entsprechen
* **Externe Dienstfehler**, die wir nicht beeinflussen können

Dieses Muster gilt für alle Node.js-Anwendungen – Web-Apps, APIs, Microservices oder Hintergrunddienste.

**Unsere Protokollierungsimplementierung:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Wir implementieren eine umfassende Feldredaktion, um vertrauliche Informationen zu schützen und gleichzeitig nützliche Debugfunktionen in unserer Node.js-Produktionsumgebung aufrechtzuerhalten.

### Anwendungsspezifische Überwachung {#application-specific-monitoring}

**Unsere Serverimplementierungen:**

* [SMTP-Server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-Server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-Server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Warteschlangenüberwachung:** Wir implementieren Warteschlangenlimits von 5 GB und Timeouts von 180 Sekunden für die Anforderungsverarbeitung, um eine Ressourcenüberlastung zu verhindern. Diese Muster gelten für alle Node.js-Anwendungen mit Warteschlangen oder Hintergrundverarbeitung.

## Node.js-Produktionsüberwachung mit PM2-Integritätsprüfungen {#nodejs-production-monitoring-with-pm2-health-checks}

Wir haben unsere Node.js-Produktionsumgebung mit PM2 über Jahre hinweg optimiert. Unsere PM2-Integritätschecks sind unerlässlich für die Zuverlässigkeit jeder Node.js-Anwendung.

### Unser PM2-Gesundheitschecksystem {#our-pm2-health-check-system}

**Unsere Kernimplementierung:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Unsere Node.js-Produktionsüberwachung mit PM2-Integritätschecks umfasst:

* **Läuft alle 20 Minuten** über Cron-Planung
* **Erfordert mindestens 15 Minuten Betriebszeit**, bevor ein Prozess als fehlerfrei gilt
* **Überprüft Prozessstatus und Speichernutzung**
* **Automatischer Neustart fehlgeschlagener Prozesse**
* **Verhindert Neustartschleifen** durch intelligente Integritätsprüfung

> \[!CAUTION]
> Für die Best Practices der Node.js-Produktionsbereitstellung benötigen wir mindestens 15 Minuten Betriebszeit, bevor ein Prozess als fehlerfrei gilt, um Neustartschleifen zu vermeiden. Dies verhindert kaskadierende Fehler bei Prozessen mit Speicherproblemen oder anderen Problemen.

### Unsere PM2-Produktionskonfiguration {#our-pm2-production-configuration}

**Setup unseres Ökosystems:** Sehen Sie sich die Startdateien unseres Servers für das Setup der Node.js-Produktionsumgebung an:

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-Server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-Scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-Server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Diese Muster gelten unabhängig davon, ob Sie Express-Apps, Koa-Server, GraphQL-APIs oder andere Node.js-Anwendungen ausführen.

### Automatisierte PM2-Bereitstellung {#automated-pm2-deployment}

**PM2-Bereitstellung:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Wir automatisieren unser gesamtes PM2-Setup über Ansible, um konsistente Node.js-Produktionsbereitstellungen auf allen unseren Servern sicherzustellen.

## Produktionsfehlerbehandlungs- und Klassifizierungssystem {#production-error-handling-and-classification-system}

Eine unserer wertvollsten Best Practices für die Produktionsbereitstellung von Node.js ist die intelligente Fehlerklassifizierung, die für jede Node.js-Anwendung gilt:

### Unsere isCodeBug-Implementierung für die Produktion {#our-iscodebug-implementation-for-production}

**Quelle:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Dieser Helfer bietet eine intelligente Fehlerklassifizierung für Node.js-Anwendungen in der Produktion, um:

* **Priorisierung tatsächlicher Fehler** gegenüber Benutzerfehlern
* **Verbesserung unserer Incident-Reaktion** durch Fokussierung auf echte Probleme
* **Reduzierung der Warnmüdigkeit** aufgrund erwarteter Benutzerfehler
* **Besseres Verständnis** von Anwendungs- und Benutzerproblemen

Dieses Muster funktioniert für jede Node.js-Anwendung – egal, ob Sie E-Commerce-Sites, SaaS-Plattformen, APIs oder Microservices erstellen.

### Integration mit unserer Produktionsprotokollierung {#integration-with-our-production-logging}

**Unsere Logger-Integration:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Unser Logger verwendet `isCodeBug`, um Warnstufen und Feldredaktionen zu bestimmen und sicherzustellen, dass wir über echte Probleme benachrichtigt werden, während gleichzeitig Rauschen in unserer Node.js-Produktionsumgebung herausgefiltert wird.

### Ähnliche Inhalte {#related-content-1}

Erfahren Sie mehr über unsere Fehlerbehandlungsmuster:

* [Aufbau eines zuverlässigen Zahlungssystems](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) – Fehlerbehandlungsmuster
* [E-Mail-Datenschutz](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) – Sicherheitsfehlerbehandlung

## Erweitertes Performance-Debugging mit v8-profiler-next und cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Wir verwenden erweiterte Profiling-Tools, um Heap-Snapshots zu analysieren und OOM-Probleme (Out of Memory), Leistungsengpässe und Node.js-Speicherprobleme in unserer Produktionsumgebung zu beheben. Diese Tools sind für jede Node.js-Anwendung mit Speicherlecks oder Leistungsproblemen unerlässlich.

### Unser Profiling-Ansatz für die Node.js-Produktion {#our-profiling-approach-for-nodejs-production}

**Von uns empfohlene Tools:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) – Zum Generieren von Heap-Snapshots und CPU-Profilen
* [`cpupro`](https://github.com/discoveryjs/cpupro) – Zum Analysieren von CPU-Profilen und Heap-Snapshots

> \[!TIP]
> Wir nutzen v8-profiler-next und cpupro gemeinsam, um einen umfassenden Performance-Debugging-Workflow für unsere Node.js-Anwendungen zu erstellen. Diese Kombination hilft uns, Speicherlecks und Performance-Engpässe zu identifizieren und unseren Produktionscode zu optimieren.

### So implementieren wir die Heap-Snapshot-Analyse {#how-we-implement-heap-snapshot-analysis}

**Unsere Überwachungsimplementierung:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Unsere Produktionsüberwachung umfasst die automatische Generierung von Heap-Snapshots, wenn Speicherschwellenwerte überschritten werden. Dies hilft uns, OOM-Probleme zu beheben, bevor sie zu Anwendungsabstürzen führen.

**Wichtige Implementierungsmuster:**

* **Automatische Snapshots**, wenn die Heap-Größe den Schwellenwert von 2 GB überschreitet
* **Signalbasiertes Profiling** für On-Demand-Analysen in der Produktion
* **Aufbewahrungsrichtlinien** für die Verwaltung des Snapshot-Speichers
* **Integration mit unseren Bereinigungsjobs** für automatisierte Wartung

### Leistungsdebugging-Workflow {#performance-debugging-workflow}

**Studieren Sie unsere tatsächliche Implementierung:**

* [Überwachung der Serverimplementierung](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) – Heap-Überwachung und Snapshot-Erstellung
* [Bereinigungsauftrag](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) – Snapshot-Aufbewahrung und -Bereinigung
* [Logger-Integration](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) – Leistungsprotokollierung

### Empfohlene Implementierung für Ihre Node.js-Anwendung {#recommended-implementation-for-your-nodejs-application}

**Für die Heap-Snapshot-Analyse:**

1. **Installieren Sie v8-profiler-next** zur Snapshot-Generierung.
2. **Verwenden Sie cpupro** zur Analyse der generierten Snapshots.
3. **Implementieren Sie Überwachungsschwellenwerte** ähnlich wie in unserer Datei monitor-server.js.
4. **Einrichten einer automatischen Bereinigung** zur Verwaltung des Snapshot-Speichers.
5. **Erstellen Sie Signalhandler** für die On-Demand-Profilerstellung in der Produktion.

**Für die CPU-Profilerstellung:**

1. **CPU-Profile erstellen** während Hochlastzeiten
2. **Mit cpupro analysieren**, um Engpässe zu identifizieren
3. **Hot Paths** und Optimierungsmöglichkeiten im Fokus
4. **Leistungsverbesserungen vor/nach** überwachen

> \[!WARNING]
> Das Erstellen von Heap-Snapshots und CPU-Profilen kann die Leistung beeinträchtigen. Wir empfehlen, eine Drosselung zu implementieren und die Profilerstellung nur bei der Untersuchung spezifischer Probleme oder während Wartungsfenstern zu aktivieren.

### Integration mit unserer Produktionsüberwachung {#integration-with-our-production-monitoring}

Unsere Profiling-Tools lassen sich in unsere umfassendere Überwachungsstrategie integrieren:

* **Automatische Auslösung** basierend auf Speicher-/CPU-Schwellenwerten
* **Alarmintegration** bei erkannten Leistungsproblemen
* **Historische Analyse** zur Verfolgung von Leistungstrends im Zeitverlauf
* **Korrelation mit Anwendungsmetriken** für umfassendes Debugging

Dieser Ansatz hat uns dabei geholfen, Speicherlecks zu identifizieren und zu beheben, Hotcode-Pfade zu optimieren und eine stabile Leistung in unserer Node.js-Produktionsumgebung aufrechtzuerhalten.

## Sicherheit der Node.js-Produktionsinfrastruktur {#nodejs-production-infrastructure-security}

Wir implementieren umfassende Sicherheit für unsere Node.js-Produktionsinfrastruktur durch Ansible-Automatisierung. Diese Praktiken gelten für alle Node.js-Anwendungen:

### Sicherheit auf Systemebene für die Node.js-Produktion {#system-level-security-for-nodejs-production}

**Unsere Ansible-Implementierung:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Unsere wichtigsten Sicherheitsmaßnahmen für Node.js-Produktionsumgebungen:

* **Swap deaktiviert**, um das Schreiben sensibler Daten auf die Festplatte zu verhindern.
* **Core Dumps deaktiviert**, um Speicherauszüge mit sensiblen Informationen zu verhindern.
* **USB-Speicher blockiert**, um unbefugten Datenzugriff zu verhindern.
* **Kernel-Parameter-Optimierung** für Sicherheit und Leistung.

> \[!WARNING]
> Bei der Implementierung von Best Practices für die Node.js-Produktionsbereitstellung kann die Deaktivierung des Swap-Speichers zu Abstürzen aufgrund von Speichermangel führen, wenn Ihre Anwendung den verfügbaren RAM überschreitet. Wir überwachen die Speichernutzung sorgfältig und dimensionieren unsere Server entsprechend.

### Anwendungssicherheit für Node.js-Anwendungen {#application-security-for-nodejs-applications}

**Unsere Protokollfeldredaktion:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Wir entfernen sensible Felder aus Protokollen, darunter Passwörter, Token, API-Schlüssel und persönliche Informationen. Dies schützt die Privatsphäre der Benutzer und gewährleistet gleichzeitig die Debugging-Funktionen in jeder Node.js-Produktionsumgebung.

### Automatisierung der Infrastruktursicherheit {#infrastructure-security-automation}

**Unser komplettes Ansible-Setup für die Node.js-Produktion:**

* [Sicherheits-Playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH-Schlüsselverwaltung](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Zertifikatsverwaltung](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM-Einrichtung](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Unser Sicherheitsinhalt {#our-security-content}

Erfahren Sie mehr über unseren Sicherheitsansatz:

* [Die besten Sicherheitsaudit-Unternehmen](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Quantensichere verschlüsselte E-Mail](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Warum Open Source-E-Mail-Sicherheit?](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Datenbankarchitektur für Node.js-Anwendungen {#database-architecture-for-nodejs-applications}

Wir verwenden einen hybriden Datenbankansatz, der für unsere Node.js-Anwendungen optimiert ist. Diese Muster können für jede Node.js-Anwendung angepasst werden:

### SQLite-Implementierung für Node.js-Produktion {#sqlite-implementation-for-nodejs-production}

**Was wir verwenden:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Unsere Konfiguration:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Wir verwenden SQLite für benutzerspezifische Daten in unseren Node.js-Anwendungen, weil es Folgendes bietet:

* **Datenisolierung** pro Benutzer/Mandant
* **Bessere Leistung** bei Einzelbenutzerabfragen
* **Vereinfachte Sicherung** und Migration
* **Geringere Komplexität** im Vergleich zu gemeinsam genutzten Datenbanken

Dieses Muster eignet sich gut für SaaS-Anwendungen, Multi-Tenant-Systeme oder jede Node.js-Anwendung, die eine Datenisolierung benötigt.

### MongoDB-Implementierung für Node.js-Produktion {#mongodb-implementation-for-nodejs-production}

**Was wir verwenden:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Unsere Setup-Implementierung:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Unsere Konfiguration:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Wir verwenden MongoDB für Anwendungsdaten in unserer Node.js-Produktionsumgebung, weil es Folgendes bietet:

* **Flexibles Schema** für sich entwickelnde Datenstrukturen
* **Bessere Leistung** für komplexe Abfragen
* **Horizontale Skalierung**
* **Umfangreiche Abfragesprache**

> \[!NOTE]
> Unser hybrider Ansatz ist optimal auf unseren spezifischen Anwendungsfall abgestimmt. Analysieren Sie die tatsächlichen Datenbanknutzungsmuster in der Codebasis, um zu verstehen, ob dieser Ansatz für Ihre Node.js-Anwendung geeignet ist.

## Node.js-Produktions-Hintergrundjobverarbeitung {#nodejs-production-background-job-processing}

Wir haben unsere Hintergrundjob-Architektur um Bree herum aufgebaut, um eine zuverlässige Node.js-Produktionsbereitstellung zu gewährleisten. Dies gilt für alle Node.js-Anwendungen, die Hintergrundverarbeitung benötigen:

### Unser Bree-Server-Setup für die Produktion {#our-bree-server-setup-for-production}

**Unsere Hauptimplementierung:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Unsere Ansible-Bereitstellung:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Beispiele für Produktionsjobs {#production-job-examples}

**Integritätsüberwachung:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisierung der Bereinigung:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Alle unsere Jobs:** [Durchsuchen Sie unser vollständiges Stellenverzeichnis](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Diese Muster gelten für jede Node.js-Anwendung, die Folgendes benötigt:

* Geplante Aufgaben (Datenverarbeitung, Berichte, Bereinigung)
* Hintergrundverarbeitung (Bildgrößenänderung, E-Mail-Versand, Datenimport)
* Zustandsüberwachung und Wartung
* Worker-Thread-Auslastung für CPU-intensive Aufgaben

### Unsere Job-Scheduling-Muster für die Node.js-Produktion {#our-job-scheduling-patterns-for-nodejs-production}

Sehen Sie sich unsere tatsächlichen Jobplanungsmuster in unserem Jobverzeichnis an, um Folgendes zu verstehen:

* Wie wir Cron-ähnliches Scheduling in der Node.js-Produktion implementieren
* Unsere Fehlerbehandlungs- und Wiederholungslogik
* Wie wir Worker-Threads für rechenintensive Aufgaben nutzen

## Automatisierte Wartung für Node.js-Produktionsanwendungen {#automated-maintenance-for-production-nodejs-applications}

Wir implementieren proaktive Wartung, um häufige Produktionsprobleme in Node.js zu vermeiden. Diese Muster gelten für jede Node.js-Anwendung:

### Unsere Bereinigungsimplementierung {#our-cleanup-implementation}

**Quelle:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Unsere automatisierte Wartung für Node.js-Produktionsanwendungen zielt auf Folgendes ab:

* **Temporäre Dateien**, die älter als 24 Stunden sind
* **Protokolldateien**, die die Aufbewahrungsfrist überschreiten
* **Cache-Dateien** und temporäre Daten
* **Hochgeladene Dateien**, die nicht mehr benötigt werden
* **Heap-Snapshots** aus der Leistungsbereinigung

Diese Muster gelten für jede Node.js-Anwendung, die temporäre Dateien, Protokolle oder zwischengespeicherte Daten generiert.

### Speicherplatzverwaltung für Node.js-Produktion {#disk-space-management-for-nodejs-production}

**Unsere Überwachungsschwellenwerte:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Warteschlangenlimits** für die Hintergrundverarbeitung
* **Warnschwelle für 75 % Festplattenauslastung**
* **Automatische Bereinigung** bei Überschreitung der Schwellenwerte

### Automatisierung der Infrastrukturwartung {#infrastructure-maintenance-automation}

**Unsere Ansible-Automatisierung für die Node.js-Produktion:**

* [Umgebungsbereitstellung](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Verwaltung von Bereitstellungsschlüsseln](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Implementierungshandbuch für die Produktionsbereitstellung von Node.js {#nodejs-production-deployment-implementation-guide}

### Studieren Sie unseren aktuellen Code für Best Practices in der Produktion {#study-our-actual-code-for-production-best-practices}

**Beginnen Sie mit diesen Schlüsseldateien für die Einrichtung der Node.js-Produktionsumgebung:**

1. **Konfiguration:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Überwachung:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Fehlerbehandlung:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Protokollierung:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Prozesszustand:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Lernen Sie aus unseren Blogbeiträgen {#learn-from-our-blog-posts}

**Unsere technischen Implementierungsleitfäden für die Node.js-Produktion:**

* [NPM-Paket-Ökosystem](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Aufbau von Zahlungssystemen](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementierung des E-Mail-Datenschutzes](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-Kontaktformulare](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React-E-Mail-Integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastrukturautomatisierung für die Node.js-Produktion {#infrastructure-automation-for-nodejs-production}

**Unsere Ansible-Playbooks zum Lernen für die Node.js-Produktionsbereitstellung:**

* [Vollständiges Playbook-Verzeichnis](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sicherheitshärtung](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-Setup](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Unsere Fallstudien {#our-case-studies}

**Unsere Unternehmensimplementierungen:**

* [Fallstudie der Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu-Fallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Alumni-E-Mail-Weiterleitung](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Fazit: Best Practices für die Node.js-Produktionsbereitstellung {#conclusion-nodejs-production-deployment-best-practices}

Unsere Node.js-Produktionsinfrastruktur zeigt, dass Node.js-Anwendungen durch Folgendes eine Zuverlässigkeit auf Unternehmensniveau erreichen können:

* **Bewährte Hardware** (AMD Ryzen für 573 % Single-Core-Leistungsoptimierung)
* **Erprobtes Node.js-Produktionsmonitoring** mit spezifischen Schwellenwerten und automatisierten Reaktionen
* **Intelligente Fehlerklassifizierung** für eine verbesserte Reaktion auf Vorfälle in Produktionsumgebungen
* **Erweitertes Performance-Debugging** mit v8-profiler-next und cpupro zur OOM-Prävention
* **Umfassende Sicherheitshärtung** durch Ansible-Automatisierung
* **Hybride Datenbankarchitektur**, optimiert für Anwendungsanforderungen
* **Automatisierte Wartung** zur Vermeidung häufiger Node.js-Produktionsprobleme

**Wichtige Erkenntnis:** Studieren Sie unsere aktuellen Implementierungsdateien und Blogbeiträge, anstatt allgemeinen Best Practices zu folgen. Unsere Codebasis bietet praxisnahe Muster für die Node.js-Produktionsbereitstellung, die für jede Node.js-Anwendung angepasst werden können – Web-Apps, APIs, Microservices oder Hintergrunddienste.

## Vollständige Ressourcenliste für die Node.js-Produktion {#complete-resource-list-for-nodejs-production}

### Unsere Kernimplementierungsdateien {#our-core-implementation-files}

* [Hauptkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Paketabhängigkeiten](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Serverüberwachung](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Fehlerklassifizierung](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Protokollierungssystem](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2-Gesundheitschecks](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatisierte Bereinigung](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Unsere Serverimplementierungen {#our-server-implementations}

* [Webserver](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [API-Server](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Bree-Scheduler](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTP-Server](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAP-Server](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3-Server](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Unsere Infrastrukturautomatisierung {#our-infrastructure-automation}

* [Alle unsere Ansible-Playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Sicherheitshärtung](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.js-Setup](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Datenbankkonfiguration](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Unsere technischen Blogbeiträge {#our-technical-blog-posts}

* [NPM-Ökosystemanalyse](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementierung des Zahlungssystems](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Technischer Leitfaden zum E-Mail-Datenschutz](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript-Kontaktformulare](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [React-E-Mail-Integration](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Leitfaden zur selbstgehosteten Lösung](https://forwardemail.net/blog/docs/self-hosted-solution)

### Unsere Unternehmensfallstudien {#our-enterprise-case-studies}

* [Linux Foundation-Implementierung](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu-Fallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Einhaltung der Vorschriften durch die Bundesregierung](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Alumni-E-Mail-Systeme](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)