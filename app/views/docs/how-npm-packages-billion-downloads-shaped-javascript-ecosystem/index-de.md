# Ein Jahrzehnt Wirkung: Wie Unsere npm-Pakete 1 Milliarde Downloads Erreichten und JavaScript Prägten {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Die Pioniere, Die Uns Vertrauen: Isaac Z. Schlueter und Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Von der Entstehung von npm bis zur Node.js-Führung](#from-npms-creation-to-nodejs-leadership)
* [Der Architekt Hinter Dem Code: Nick Baughs Reise](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express Technical Committee und Core-Beiträge](#express-technical-committee-and-core-contributions)
  * [Beiträge zum Koa Framework](#koa-framework-contributions)
  * [Vom Einzelbeitragenden zum Organisationsleiter](#from-individual-contributor-to-organization-leader)
* [Unsere GitHub-Organisationen: Ökosysteme der Innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturierte Protokollierung für Moderne Anwendungen](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Kampf gegen E-Mail-Missbrauch](#spam-scanner-fighting-email-abuse)
  * [Bree: Modernes Job Scheduling mit Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Open Source E-Mail-Infrastruktur](#forward-email-open-source-email-infrastructure)
  * [Lad: Essentielle Koa-Dienstprogramme und Werkzeuge](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open Source Uptime Monitoring](#upptime-open-source-uptime-monitoring)
* [Unsere Beiträge zum Forward Email Ökosystem](#our-contributions-to-the-forward-email-ecosystem)
  * [Von Paketen zur Produktion](#from-packages-to-production)
  * [Der Feedback-Kreislauf](#the-feedback-loop)
* [Die Kernprinzipien von Forward Email: Eine Grundlage für Exzellenz](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Immer Entwicklerfreundlich, Sicherheitsorientiert und Transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Einhaltung Bewährter Software-Entwicklungsprinzipien](#adherence-to-time-tested-software-development-principles)
  * [Zielgruppe: Der Hartnäckige, Selbstfinanzierte Entwickler](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinzipien in der Praxis: Der Forward Email Codebase](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Nachhaltiger Open Source](#sustainable-open-source)
* [Die Zahlen Lügen Nicht: Unsere Erstaunlichen npm Download-Statistiken](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Ein Überblick aus der Vogelperspektive](#a-birds-eye-view-of-our-impact)
  * [Tägliche Wirkung im großen Maßstab](#daily-impact-at-scale)
  * [Über die Rohzahlen hinaus](#beyond-the-raw-numbers)
* [Unterstützung des Ökosystems: Unsere Open Source Förderungen](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionier der E-Mail-Infrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mastermind der Utility-Pakete](#sindre-sorhus-utility-package-mastermind)
* [Aufdeckung von Sicherheitslücken im JavaScript-Ökosystem](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Die Koa-Router Rettung](#the-koa-router-rescue)
  * [Behebung von ReDoS-Schwachstellen](#addressing-redos-vulnerabilities)
  * [Eintreten für Node.js- und Chromium-Sicherheit](#advocating-for-nodejs-and-chromium-security)
  * [Absicherung der npm-Infrastruktur](#securing-npm-infrastructure)
* [Unsere Beiträge zum Forward Email Ökosystem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Verbesserung der Kernfunktionalität von Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Fortschritte bei der E-Mail-Authentifizierung mit Mailauth](#advancing-email-authentication-with-mailauth)
  * [Wichtige Upptime-Verbesserungen](#key-upptime-enhancements)
* [Der Klebstoff, Der Alles Zusammenhält: Maßgeschneiderter Code im großen Maßstab](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Ein Umfangreiches Entwicklungsprojekt](#a-massive-development-effort)
  * [Integration von Kernabhängigkeiten](#core-dependencies-integration)
  * [DNS-Infrastruktur mit Tangerine und mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Unternehmenswirkung: Von Open Source zu Geschäftskritischen Lösungen](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Fallstudien zur Geschäftskritischen E-Mail-Infrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Ein Jahrzehnt Open Source: Ein Blick in die Zukunft](#a-decade-of-open-source-looking-forward)
## Vorwort {#foreword}

In der [JavaScript](https://en.wikipedia.org/wiki/JavaScript)- und [Node.js](https://en.wikipedia.org/wiki/Node.js)-Welt sind einige Pakete unverzichtbar – sie werden täglich millionenfach heruntergeladen und treiben weltweit Apps an. Hinter diesen Tools stehen Entwickler, die sich auf Open-Source-Qualität konzentrieren. Heute zeigen wir, wie unser Team dabei hilft, npm-Pakete zu erstellen und zu pflegen, die zu wichtigen Bestandteilen des JavaScript-Ökosystems geworden sind.

## Die Pioniere, die uns vertrauen: Isaac Z. Schlueter und Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Wir sind stolz darauf, [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) als Nutzer zu haben. Isaac hat [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) geschaffen und beim Aufbau von [Node.js](https://en.wikipedia.org/wiki/Node.js) mitgewirkt. Sein Vertrauen in Forward Email zeigt unseren Fokus auf Qualität und Sicherheit. Isaac nutzt Forward Email für mehrere Domains, darunter izs.me.

Isaacs Einfluss auf JavaScript ist enorm. Im Jahr 2009 gehörte er zu den Ersten, die das Potenzial von Node.js erkannten, und arbeitete mit [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl) zusammen, der die Plattform erschuf. Wie Isaac in einem [Interview mit dem Increment-Magazin](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) sagte: „Mitten in dieser sehr kleinen Gemeinschaft von Leuten, die versuchten herauszufinden, wie man serverseitiges JS möglich macht, kam Ryan Dahl mit Node heraus, was einfach sehr klar der richtige Ansatz war. Ich habe darauf gesetzt und mich etwa Mitte 2009 sehr engagiert.“

> \[!NOTE]
> Für diejenigen, die sich für die Geschichte von Node.js interessieren, gibt es hervorragende Dokumentationen, die seine Entwicklung nachzeichnen, darunter [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) und [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahls [persönliche Webseite](https://tinyclouds.org/) enthält ebenfalls wertvolle Einblicke in seine Arbeit.

### Von der Entstehung von npm bis zur Führung von Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac gründete npm im September 2009, mit der ersten nutzbaren Version Anfang 2010. Dieser Paketmanager erfüllte ein zentrales Bedürfnis in Node.js, indem er Entwicklern das einfache Teilen und Wiederverwenden von Code ermöglichte. Laut der [Node.js Wikipedia-Seite](https://en.wikipedia.org/wiki/Node.js) „wurde im Januar 2010 ein Paketmanager für die Node.js-Umgebung namens npm eingeführt. Der Paketmanager ermöglicht es Programmierern, Node.js-Pakete zusammen mit dem zugehörigen Quellcode zu veröffentlichen und zu teilen und ist darauf ausgelegt, die Installation, Aktualisierung und Deinstallation von Paketen zu vereinfachen.“

Als Ryan Dahl sich im Januar 2012 von Node.js zurückzog, übernahm Isaac die Projektleitung. Wie in [seinem Lebenslauf](https://izs.me/resume) vermerkt ist, „leitete er die Entwicklung mehrerer grundlegender Node.js-Core-APIs, einschließlich des CommonJS-Modulsystems, der Dateisystem-APIs und Streams“ und „fungierte 2 Jahre lang als BDFL (Benevolent Dictator For Life) des Projekts, wodurch eine stetig steigende Qualität und ein zuverlässiger Build-Prozess für Node.js-Versionen von v0.6 bis v0.10 sichergestellt wurden.“

Isaac führte Node.js durch eine wichtige Wachstumsphase und setzte Standards, die die Plattform bis heute prägen. Später gründete er 2014 npm, Inc., um das npm-Registry zu unterstützen, das er zuvor alleine betrieben hatte.

Wir danken Isaac für seine enormen Beiträge zu JavaScript und nutzen weiterhin viele von ihm erstellte Pakete. Seine Arbeit hat verändert, wie wir Software entwickeln und wie Millionen Entwickler weltweit Code teilen.

## Der Architekt hinter dem Code: Nick Baughs Weg {#the-architect-behind-the-code-nick-baughs-journey}

Im Zentrum unseres Open-Source-Erfolgs steht Nick Baugh, Gründer und Inhaber von Forward Email. Seine Arbeit in JavaScript erstreckt sich über fast 20 Jahre und hat geprägt, wie unzählige Entwickler Apps bauen. Sein Open-Source-Weg zeigt sowohl technisches Können als auch Führungsqualitäten in der Community.

### Express Technical Committee und Core-Beiträge {#express-technical-committee-and-core-contributions}

Nicks Expertise im Web-Framework brachte ihm einen Platz im [Express Technical Committee](https://expressjs.com/en/resources/community.html) ein, wo er bei einem der meistgenutzten Node.js-Frameworks mitwirkte. Nick ist jetzt als inaktives Mitglied auf der [Express-Community-Seite](https://expressjs.com/en/resources/community.html) gelistet.
> \[!IMPORTANT]
> Express wurde ursprünglich von TJ Holowaychuk erstellt, einem produktiven Open-Source-Beitragenden, der einen großen Teil des Node.js-Ökosystems geprägt hat. Wir sind dankbar für TJs grundlegende Arbeit und respektieren seine [Entscheidung, eine Pause einzulegen](https://news.ycombinator.com/item?id=37687017) von seinen umfangreichen Open-Source-Beiträgen.

Als Mitglied des [Express Technical Committee](https://expressjs.com/en/resources/community.html) zeigte Nick große Detailgenauigkeit bei Themen wie der Klärung der `req.originalUrl`-Dokumentation und der Behebung von Problemen bei der Verarbeitung von Multipart-Formularen.

### Koa Framework Beiträge {#koa-framework-contributions}

Nicks Arbeit mit dem [Koa Framework](https://github.com/koajs/koa) – einer modernen, leichteren Alternative zu Express, die ebenfalls von TJ Holowaychuk erstellt wurde – zeigt sein Engagement für bessere Webentwicklungstools. Seine Koa-Beiträge umfassen sowohl Issues als auch Code über Pull Requests, die Fehlerbehandlung, Content-Type-Verwaltung und Verbesserungen der Dokumentation betreffen.

Seine Arbeit sowohl bei Express als auch bei Koa verschafft ihm eine einzigartige Sicht auf die Node.js-Webentwicklung und hilft unserem Team, Pakete zu erstellen, die gut mit mehreren Framework-Ökosystemen funktionieren.

### Vom einzelnen Beitragenden zum Organisationsleiter {#from-individual-contributor-to-organization-leader}

Was als Hilfe für bestehende Projekte begann, entwickelte sich zu der Erstellung und Pflege ganzer Paket-Ökosysteme. Nick gründete mehrere GitHub-Organisationen – darunter [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) und [Bree](https://github.com/breejs) – die jeweils spezifische Bedürfnisse in der JavaScript-Community lösen.

Dieser Wandel vom Beitragenden zum Leiter zeigt Nicks Vision für gut gestaltete Software, die reale Probleme löst. Durch die Organisation verwandter Pakete unter fokussierten GitHub-Organisationen hat er Tool-Ökosysteme aufgebaut, die zusammenarbeiten und gleichzeitig modular und flexibel für die breitere Entwicklergemeinschaft bleiben.


## Unsere GitHub-Organisationen: Ökosysteme der Innovation {#our-github-organizations-ecosystems-of-innovation}

Wir organisieren unsere Open-Source-Arbeit rund um fokussierte GitHub-Organisationen, die jeweils spezifische Bedürfnisse in JavaScript lösen. Diese Struktur schafft zusammenhängende Paketfamilien, die gut zusammenarbeiten und gleichzeitig modular bleiben.

### Cabin: Strukturierte Protokollierung für moderne Anwendungen {#cabin-structured-logging-for-modern-applications}

Die [Cabin-Organisation](https://github.com/cabinjs) ist unser Ansatz für einfache, leistungsstarke App-Protokollierung. Das Hauptpaket [`cabin`](https://github.com/cabinjs/cabin) hat fast 900 GitHub-Sterne und über 100.000 wöchentliche Downloads\[^1]. Cabin bietet strukturierte Protokollierung, die mit beliebten Diensten wie Sentry, LogDNA und Papertrail funktioniert.

Was Cabin besonders macht, ist seine durchdachte API und das Pluginsystem. Unterstützende Pakete wie [`axe`](https://github.com/cabinjs/axe) für Express-Middleware und [`parse-request`](https://github.com/cabinjs/parse-request) für HTTP-Anfrage-Parsing zeigen unser Engagement für vollständige Lösungen statt isolierter Werkzeuge.

Das Paket [`bson-objectid`](https://github.com/cabinjs/bson-objectid) verdient besondere Erwähnung mit über 1,7 Millionen Downloads in nur zwei Monaten\[^2]. Diese leichte MongoDB ObjectID-Implementierung ist zur bevorzugten Lösung für Entwickler geworden, die IDs ohne vollständige MongoDB-Abhängigkeiten benötigen.

### Spam Scanner: Kampf gegen E-Mail-Missbrauch {#spam-scanner-fighting-email-abuse}

Die [Spam Scanner-Organisation](https://github.com/spamscanner) zeigt unser Engagement, reale Probleme zu lösen. Das Hauptpaket [`spamscanner`](https://github.com/spamscanner/spamscanner) bietet fortschrittliche E-Mail-Spam-Erkennung, aber es ist das Paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), das eine erstaunliche Verbreitung erfahren hat.

Mit über 1,2 Millionen Downloads in zwei Monaten\[^3] behebt `url-regex-safe` kritische Sicherheitsprobleme in anderen regulären Ausdrücken zur URL-Erkennung. Dieses Paket zeigt unseren Ansatz für Open Source: ein häufiges Problem finden (in diesem Fall [ReDoS](https://en.wikipedia.org/wiki/ReDoS)-Schwachstellen bei der URL-Validierung), eine solide Lösung schaffen und diese sorgfältig pflegen.
### Bree: Modernes Job Scheduling mit Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

Die [Bree-Organisation](https://github.com/breejs) ist unsere Antwort auf eine häufige Node.js-Herausforderung: zuverlässiges Job Scheduling. Das Hauptpaket [`bree`](https://github.com/breejs/bree), mit über 3.100 GitHub-Sternen, bietet einen modernen Job Scheduler, der Node.js Worker Threads für bessere Leistung und Zuverlässigkeit nutzt.

> \[!NOTE]
> Bree wurde entwickelt, nachdem wir bei der Wartung von [Agenda](https://github.com/agenda/agenda) geholfen haben und die dabei gewonnenen Erkenntnisse genutzt haben, um einen besseren Job Scheduler zu bauen. Unsere Beiträge zu Agenda halfen uns, Wege zur Verbesserung des Job Schedulings zu finden.

Was Bree von anderen Scheduler wie Agenda unterscheidet:

* **Keine externen Abhängigkeiten**: Im Gegensatz zu Agenda, das MongoDB benötigt, erfordert Bree weder Redis noch MongoDB zur Verwaltung des Job-Status.
* **Worker Threads**: Bree verwendet Node.js Worker Threads für sandboxed Prozesse, was bessere Isolation und Leistung bietet.
* **Einfache API**: Bree bietet detaillierte Kontrolle bei gleichzeitiger Einfachheit, was die Umsetzung komplexer Scheduling-Anforderungen erleichtert.
* **Integrierte Unterstützung**: Funktionen wie sanftes Neuladen, Cron-Jobs, Datumsangaben und benutzerfreundliche Zeiten sind standardmäßig enthalten.

Bree ist ein wichtiger Bestandteil von [forwardemail.net](https://github.com/forwardemail/forwardemail.net) und übernimmt kritische Hintergrundaufgaben wie E-Mail-Verarbeitung, Bereinigung und geplante Wartung. Der Einsatz von Bree in Forward Email zeigt unser Engagement, unsere eigenen Werkzeuge produktiv zu nutzen und sicherzustellen, dass sie hohe Zuverlässigkeitsstandards erfüllen.

Wir verwenden und schätzen auch andere großartige Worker Thread-Pakete wie [piscina](https://github.com/piscinajs/piscina) und HTTP-Clients wie [undici](https://github.com/nodejs/undici). Piscina nutzt wie Bree Node.js Worker Threads für effiziente Aufgabenverarbeitung. Wir danken [Matteo Collina](https://github.com/mcollina), der sowohl undici als auch piscina pflegt, für seine bedeutenden Beiträge zu Node.js. Matteo ist Mitglied des Node.js Technical Steering Committee und hat die HTTP-Client-Fähigkeiten in Node.js erheblich verbessert.

### Forward Email: Open Source E-Mail-Infrastruktur {#forward-email-open-source-email-infrastructure}

Unser ehrgeizigstes Projekt ist [Forward Email](https://github.com/forwardemail), ein Open Source E-Mail-Dienst, der E-Mail-Weiterleitung, Speicherung und API-Dienste anbietet. Das Haupt-Repository hat über 1.100 GitHub-Sterne\[^4], was die Wertschätzung der Community für diese Alternative zu proprietären E-Mail-Diensten zeigt.

Das [`preview-email`](https://github.com/forwardemail/preview-email) Paket dieser Organisation, mit über 2,5 Millionen Downloads in zwei Monaten\[^5], ist zu einem unverzichtbaren Werkzeug für Entwickler geworden, die mit E-Mail-Vorlagen arbeiten. Es bietet eine einfache Möglichkeit, E-Mails während der Entwicklung vorzuschauen und löst damit ein häufiges Problem beim Aufbau von E-Mail-fähigen Anwendungen.

### Lad: Essentielle Koa-Dienstprogramme und Werkzeuge {#lad-essential-koa-utilities-and-tools}

Die [Lad-Organisation](https://github.com/ladjs) stellt eine Sammlung essentieller Dienstprogramme und Werkzeuge bereit, die sich hauptsächlich auf die Verbesserung des Koa-Framework-Ökosystems konzentrieren. Diese Pakete lösen häufige Herausforderungen in der Webentwicklung und sind so konzipiert, dass sie nahtlos zusammenarbeiten und gleichzeitig unabhängig nützlich bleiben.

#### koa-better-error-handler: Verbesserte Fehlerbehandlung für Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) bietet eine verbesserte Fehlerbehandlungslösung für Koa-Anwendungen. Mit über 50 GitHub-Sternen sorgt dieses Paket dafür, dass `ctx.throw` benutzerfreundliche Fehlermeldungen erzeugt und dabei mehrere Einschränkungen des eingebauten Koa-Fehlerhandlers adressiert:

* Erkennt und behandelt Node.js DNS-Fehler, Mongoose-Fehler und Redis-Fehler korrekt
* Verwendet [Boom](https://github.com/hapijs/boom) zur Erstellung konsistenter, gut formatierter Fehlerantworten
* Bewahrt Header (im Gegensatz zum eingebauten Koa-Handler)
* Erhält angemessene Statuscodes statt standardmäßig 500 zu verwenden
* Unterstützt Flash-Nachrichten und Sitzungs-Erhaltung
* Bietet HTML-Fehlerlisten für Validierungsfehler
* Unterstützt mehrere Antworttypen (HTML, JSON und Klartext)
Dieses Paket ist besonders wertvoll in Kombination mit [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) für ein umfassendes Fehlermanagement in Koa-Anwendungen.

#### passport: Authentifizierung für Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) erweitert die beliebte Passport.js-Authentifizierungs-Middleware mit spezifischen Verbesserungen für moderne Webanwendungen. Dieses Paket unterstützt mehrere Authentifizierungsstrategien direkt out-of-the-box:

* Lokale Authentifizierung mit E-Mail
* Anmeldung mit Apple
* GitHub-Authentifizierung
* Google-Authentifizierung
* Einmalpasswort (OTP)-Authentifizierung

Das Paket ist hochgradig anpassbar und ermöglicht Entwicklern, Feldnamen und Formulierungen an die Anforderungen ihrer Anwendung anzupassen. Es ist so konzipiert, dass es nahtlos mit Mongoose für die Benutzerverwaltung integriert werden kann, was es zu einer idealen Lösung für Koa-basierte Anwendungen macht, die eine robuste Authentifizierung benötigen.

#### graceful: Elegantes Herunterfahren der Anwendung {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) löst die kritische Herausforderung, Node.js-Anwendungen sauber herunterzufahren. Mit über 70 GitHub-Sternen stellt dieses Paket sicher, dass Ihre Anwendung sauber beendet werden kann, ohne Daten zu verlieren oder Verbindungen offen zu lassen. Wichtige Funktionen umfassen:

* Unterstützung für das saubere Schließen von HTTP-Servern (Express/Koa/Fastify)
* Sauberes Herunterfahren von Datenbankverbindungen (MongoDB/Mongoose)
* Ordnungsgemäßes Schließen von Redis-Clients
* Verwaltung von Bree-Job-Schedulern
* Unterstützung für benutzerdefinierte Shutdown-Handler
* Konfigurierbare Timeout-Einstellungen
* Integration mit Logging-Systemen

Dieses Paket ist für Produktionsanwendungen unerlässlich, bei denen unerwartete Abschaltungen zu Datenverlust oder -beschädigung führen könnten. Durch die Implementierung ordnungsgemäßer Shutdown-Verfahren hilft `@ladjs/graceful`, die Zuverlässigkeit und Stabilität Ihrer Anwendung sicherzustellen.

### Upptime: Open Source Uptime Monitoring {#upptime-open-source-uptime-monitoring}

Die [Upptime-Organisation](https://github.com/upptime) steht für unser Engagement für transparente, Open-Source-Überwachung. Das Haupt-Repository [`upptime`](https://github.com/upptime/upptime) hat über 13.000 GitHub-Sterne und ist damit eines der beliebtesten Projekte, zu denen wir beitragen. Upptime bietet einen GitHub-basierten Uptime-Monitor und eine Statusseite, die vollständig ohne Server betrieben wird.

Wir verwenden Upptime für unsere eigene Statusseite unter <https://status.forwardemail.net> mit dem Quellcode verfügbar unter <https://github.com/forwardemail/status.forwardemail.net>.

Was Upptime besonders macht, ist seine Architektur:

* **100 % Open Source**: Jede Komponente ist vollständig Open Source und anpassbar.
* **Angetrieben von GitHub**: Nutzt GitHub Actions, Issues und Pages für eine serverlose Überwachungslösung.
* **Kein Server erforderlich**: Im Gegensatz zu herkömmlichen Überwachungstools müssen Sie keinen Server betreiben oder warten.
* **Automatische Statusseite**: Generiert eine schöne Statusseite, die auf GitHub Pages gehostet werden kann.
* **Leistungsstarke Benachrichtigungen**: Integration mit verschiedenen Benachrichtigungskanälen, einschließlich E-Mail, SMS und Slack.

Um das Nutzererlebnis zu verbessern, haben wir [@octokit/core](https://github.com/octokit/core.js/) in den forwardemail.net-Code integriert, um Echtzeit-Statusupdates und Vorfälle direkt auf unserer Website anzuzeigen. Diese Integration bietet unseren Nutzern klare Transparenz im Falle von Problemen über unseren gesamten Stack hinweg (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree usw.) mit sofortigen Toast-Benachrichtigungen, Badge-Icon-Änderungen, Warnfarben und mehr.

Die @octokit/core-Bibliothek ermöglicht es uns, Echtzeitdaten aus unserem Upptime-GitHub-Repository abzurufen, zu verarbeiten und benutzerfreundlich darzustellen. Wenn ein Dienst eine Störung oder eine verschlechterte Leistung hat, werden die Nutzer sofort durch visuelle Indikatoren benachrichtigt, ohne die Hauptanwendung verlassen zu müssen. Diese nahtlose Integration stellt sicher, dass unsere Nutzer stets aktuelle Informationen über den Systemstatus erhalten, was Transparenz und Vertrauen erhöht.

Upptime wurde von Hunderten von Organisationen übernommen, die nach einer transparenten, zuverlässigen Möglichkeit suchen, ihre Dienste zu überwachen und den Status an Nutzer zu kommunizieren. Der Erfolg des Projekts zeigt die Stärke, Werkzeuge zu entwickeln, die bestehende Infrastruktur (in diesem Fall GitHub) nutzen, um gängige Probleme auf neue Weise zu lösen.
## Unsere Beiträge zum Forward Email Ökosystem {#our-contributions-to-the-forward-email-ecosystem}

Während unsere Open-Source-Pakete von Entwicklern weltweit genutzt werden, bilden sie auch die Grundlage unseres eigenen Forward Email Dienstes. Diese doppelte Rolle – sowohl als Schöpfer als auch als Nutzer dieser Werkzeuge – verschafft uns eine einzigartige Perspektive auf deren praktische Anwendung und treibt kontinuierliche Verbesserungen voran.

### Von Paketen zur Produktion {#from-packages-to-production}

Der Weg von einzelnen Paketen zu einem kohärenten Produktionssystem erfordert sorgfältige Integration und Erweiterung. Für Forward Email umfasst dieser Prozess:

* **Benutzerdefinierte Erweiterungen**: Entwicklung Forward Email-spezifischer Erweiterungen unserer Open-Source-Pakete, die unsere besonderen Anforderungen adressieren.
* **Integrationsmuster**: Entwicklung von Mustern, wie diese Pakete in einer Produktionsumgebung zusammenwirken.
* **Leistungsoptimierungen**: Identifikation und Behebung von Leistungsengpässen, die erst im großen Maßstab auftreten.
* **Sicherheitsverstärkung**: Hinzufügen zusätzlicher Sicherheitsschichten, die speziell auf die E-Mail-Verarbeitung und den Schutz von Benutzerdaten ausgerichtet sind.

Diese Arbeit repräsentiert tausende Stunden Entwicklung über die Kernpakete hinaus und führt zu einem robusten, sicheren E-Mail-Dienst, der das Beste unserer Open-Source-Beiträge nutzt.

### Der Feedback-Loop {#the-feedback-loop}

Vielleicht der wertvollste Aspekt der Nutzung unserer eigenen Pakete in der Produktion ist der Feedback-Loop, den dies erzeugt. Wenn wir in Forward Email auf Einschränkungen oder Randfälle stoßen, beheben wir diese nicht nur lokal – wir verbessern die zugrundeliegenden Pakete, wovon sowohl unser Dienst als auch die breitere Community profitieren.

Dieser Ansatz hat zu zahlreichen Verbesserungen geführt:

* **Brees sanfte Abschaltung**: Forward Emails Bedarf an Deployments ohne Ausfallzeiten führte zu verbesserten sanften Abschaltfunktionen in Bree.
* **Spam Scanners Mustererkennung**: In der Praxis auftretende Spam-Muster in Forward Email haben die Erkennungsalgorithmen von Spam Scanner beeinflusst.
* **Cabins Leistungsoptimierungen**: Hochvolumiges Logging in der Produktion offenbarte Optimierungsmöglichkeiten in Cabin, die allen Nutzern zugutekommen.

Indem wir diesen positiven Kreislauf zwischen unserer Open-Source-Arbeit und dem Produktionsdienst aufrechterhalten, stellen wir sicher, dass unsere Pakete praktische, erprobte Lösungen bleiben und keine theoretischen Implementierungen.

## Forward Emails Kernprinzipien: Eine Grundlage für Exzellenz {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email ist nach einer Reihe von Kernprinzipien gestaltet, die alle unsere Entwicklungsentscheidungen leiten. Diese Prinzipien, ausführlich beschrieben auf unserer [Website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), sorgen dafür, dass unser Dienst entwicklerfreundlich, sicher und auf den Schutz der Privatsphäre der Nutzer fokussiert bleibt.

### Immer entwicklerfreundlich, sicherheitsorientiert und transparent {#always-developer-friendly-security-focused-and-transparent}

Unser erstes und wichtigstes Prinzip ist es, Software zu schaffen, die entwicklerfreundlich ist und gleichzeitig die höchsten Standards in Sicherheit und Datenschutz einhält. Wir sind überzeugt, dass technische Exzellenz niemals auf Kosten der Benutzerfreundlichkeit gehen darf und dass Transparenz Vertrauen in unserer Community aufbaut.

Dieses Prinzip zeigt sich in unserer ausführlichen Dokumentation, klaren Fehlermeldungen und offener Kommunikation über Erfolge und Herausforderungen. Indem wir unseren gesamten Code offenlegen, laden wir zu Prüfung und Zusammenarbeit ein, was sowohl unsere Software als auch das gesamte Ökosystem stärkt.

### Einhaltung bewährter Softwareentwicklungsprinzipien {#adherence-to-time-tested-software-development-principles}

Wir folgen mehreren etablierten Softwareentwicklungsprinzipien, die sich über Jahrzehnte bewährt haben:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Trennung der Verantwortlichkeiten durch das Model-View-Controller-Muster
* **[Unix-Philosophie](https://en.wikipedia.org/wiki/Unix_philosophy)**: Erstellung modularer Komponenten, die eine Sache gut machen
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Keep It Simple and Straightforward (Halte es einfach und unkompliziert)
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Don't Repeat Yourself, Förderung der Wiederverwendung von Code
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: You Aren't Gonna Need It, Vermeidung vorzeitiger Optimierung
* **[Twelve Factor](https://12factor.net/)**: Befolgung bewährter Praktiken zum Aufbau moderner, skalierbarer Anwendungen
* **[Ockhams Rasiermesser](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Wahl der einfachsten Lösung, die die Anforderungen erfüllt
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Intensive Nutzung unserer eigenen Produkte
Diese Prinzipien sind nicht nur theoretische Konzepte – sie sind in unseren täglichen Entwicklungspraktiken verankert. Zum Beispiel zeigt sich unsere Einhaltung der Unix-Philosophie darin, wie wir unsere npm-Pakete strukturiert haben: kleine, fokussierte Module, die zusammengesetzt werden können, um komplexe Probleme zu lösen.

### Zielgruppe: Der engagierte, selbstfinanzierte Entwickler {#targeting-the-scrappy-bootstrapped-developer}

Wir richten uns speziell an den engagierten, selbstfinanzierten und [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) Entwickler. Dieser Fokus prägt alles, von unserem Preismodell bis zu unseren technischen Entscheidungen. Wir verstehen die Herausforderungen, Produkte mit begrenzten Ressourcen zu entwickeln, weil wir selbst diese Erfahrung gemacht haben.

Dieses Prinzip ist besonders wichtig für unseren Umgang mit Open Source. Wir erstellen und pflegen Pakete, die reale Probleme für Entwickler ohne Unternehmensbudgets lösen und leistungsstarke Werkzeuge für alle zugänglich machen, unabhängig von deren Ressourcen.

### Prinzipien in der Praxis: Der Forward Email Codebase {#principles-in-practice-the-forward-email-codebase}

Diese Prinzipien sind im Forward Email Codebase deutlich sichtbar. Unsere package.json-Datei zeigt eine durchdachte Auswahl an Abhängigkeiten, die alle mit unseren Kernwerten übereinstimmen:

* Sicherheitsorientierte Pakete wie `mailauth` für E-Mail-Authentifizierung
* Entwicklerfreundliche Tools wie `preview-email` für einfacheres Debugging
* Modulare Komponenten wie die verschiedenen `p-*` Utilities von Sindre Sorhus

Indem wir diese Prinzipien konsequent über die Zeit befolgen, haben wir einen Dienst aufgebaut, dem Entwickler ihre E-Mail-Infrastruktur anvertrauen können – sicher, zuverlässig und im Einklang mit den Werten der Open-Source-Community.

### Datenschutz durch Design {#privacy-by-design}

Datenschutz ist für Forward Email kein nachträglicher Gedanke oder Marketingfeature – es ist ein grundlegendes Designprinzip, das jeden Aspekt unseres Dienstes und Codes prägt:

* **Zero-Access-Verschlüsselung**: Wir haben Systeme implementiert, die es uns technisch unmöglich machen, die E-Mails der Nutzer zu lesen.
* **Minimale Datenerhebung**: Wir erfassen nur die Daten, die notwendig sind, um unseren Dienst bereitzustellen, nicht mehr.
* **Transparente Richtlinien**: Unsere Datenschutzrichtlinie ist in klarer, verständlicher Sprache ohne juristisches Fachchinesisch verfasst.
* **Open Source Verifikation**: Unser Open-Source-Code ermöglicht es Sicherheitsforschern, unsere Datenschutzansprüche zu überprüfen.

Dieses Engagement erstreckt sich auf unsere Open-Source-Pakete, die von Grund auf mit Sicherheits- und Datenschutzbest-Practices gestaltet sind.

### Nachhaltiger Open Source {#sustainable-open-source}

Wir sind der Meinung, dass Open-Source-Software nachhaltige Modelle braucht, um langfristig zu gedeihen. Unser Ansatz umfasst:

* **Kommerzieller Support**: Angebot von Premium-Support und Dienstleistungen rund um unsere Open-Source-Tools.
* **Ausgewogene Lizenzierung**: Verwendung von Lizenzen, die sowohl die Freiheit der Nutzer als auch die Nachhaltigkeit des Projekts schützen.
* **Community-Engagement**: Aktive Einbindung von Mitwirkenden zum Aufbau einer unterstützenden Gemeinschaft.
* **Transparente Roadmaps**: Teilen unserer Entwicklungspläne, damit Nutzer entsprechend planen können.

Indem wir auf Nachhaltigkeit setzen, stellen wir sicher, dass unsere Open-Source-Beiträge über die Zeit wachsen und sich verbessern können, anstatt vernachlässigt zu werden.

## Die Zahlen lügen nicht: Unsere beeindruckenden npm-Download-Statistiken {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Wenn wir über die Wirkung von Open-Source-Software sprechen, bieten Download-Statistiken ein greifbares Maß für Akzeptanz und Vertrauen. Viele der Pakete, die wir mitbetreuen, haben eine Größenordnung erreicht, die nur wenige Open-Source-Projekte jemals erreichen, mit kombinierten Downloads in Milliardenhöhe.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Während wir stolz darauf sind, mehrere stark heruntergeladene Pakete im JavaScript-Ökosystem mitzuverwalten, möchten wir anerkennen, dass viele dieser Pakete ursprünglich von anderen talentierten Entwicklern erstellt wurden. Pakete wie superagent und supertest wurden ursprünglich von TJ Holowaychuk entwickelt, dessen produktive Beiträge zu Open Source maßgeblich zur Gestaltung des Node.js-Ökosystems beigetragen haben.
### Ein Überblick über unsere Wirkung {#a-birds-eye-view-of-our-impact}

Allein im zweimonatigen Zeitraum von Februar bis März 2025 verzeichneten die wichtigsten Pakete, zu denen wir beitragen und die wir mitbetreuen, beeindruckende Downloadzahlen:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 Downloads\[^7] (ursprünglich erstellt von TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 Downloads\[^8] (ursprünglich erstellt von TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28.539.295 Downloads\[^34] (ursprünglich erstellt von TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 Downloads\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 Downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 Downloads\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 Downloads\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1.800.000 Downloads\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 Downloads\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1.128.139 Downloads\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1.124.686 Downloads\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 Downloads\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 Downloads\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839.585 Downloads\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145.000 Downloads\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24.270 Downloads\[^30]

> \[!NOTE]
> Mehrere andere Pakete, die wir mitbetreuen, aber nicht erstellt haben, verzeichnen noch höhere Downloadzahlen, darunter `form-data` (über 738 Mio. Downloads), `toidentifier` (über 309 Mio. Downloads), `stackframe` (über 116 Mio. Downloads) und `error-stack-parser` (über 113 Mio. Downloads). Wir fühlen uns geehrt, zu diesen Paketen beizutragen und dabei die Arbeit ihrer ursprünglichen Autoren zu respektieren.

Diese Zahlen sind nicht nur beeindruckend – sie repräsentieren echte Entwickler, die reale Probleme mit Code lösen, den wir mitbetreuen. Jeder Download ist ein Fall, in dem diese Pakete jemandem geholfen haben, etwas Bedeutungsvolles zu bauen, von Hobbyprojekten bis hin zu Unternehmensanwendungen, die von Millionen genutzt werden.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Tägliche Wirkung im großen Maßstab {#daily-impact-at-scale}

Die täglichen Downloadmuster zeigen eine konstante, hochvolumige Nutzung, mit Spitzenwerten von mehreren Millionen Downloads pro Tag\[^13]. Diese Beständigkeit spricht für die Stabilität und Zuverlässigkeit dieser Pakete – Entwickler probieren sie nicht nur aus, sie integrieren sie in ihre Kernarbeitsabläufe und verlassen sich Tag für Tag darauf.

Wöchentliche Downloadmuster zeigen noch beeindruckendere Zahlen, die konstant im Bereich von mehreren zehn Millionen Downloads pro Woche liegen\[^14]. Dies stellt eine massive Präsenz im JavaScript-Ökosystem dar, mit diesen Paketen, die in Produktionsumgebungen weltweit eingesetzt werden.

### Über die reinen Zahlen hinaus {#beyond-the-raw-numbers}

Während die Downloadstatistiken für sich genommen beeindruckend sind, erzählen sie eine tiefere Geschichte über das Vertrauen, das die Community in diese Pakete setzt. Die Pflege von Paketen in diesem Umfang erfordert ein unerschütterliches Engagement für:

* **Abwärtskompatibilität**: Änderungen müssen sorgfältig abgewogen werden, um bestehende Implementierungen nicht zu brechen.
* **Sicherheit**: Da Millionen von Anwendungen auf diese Pakete angewiesen sind, könnten Sicherheitslücken weitreichende Folgen haben.
* **Performance**: In diesem Maßstab können selbst kleine Leistungsverbesserungen erhebliche kumulative Vorteile bringen.
* **Dokumentation**: Klare, umfassende Dokumentation ist unerlässlich für Pakete, die von Entwicklern aller Erfahrungsstufen genutzt werden.

Das stetige Wachstum der Downloadzahlen im Laufe der Zeit spiegelt den Erfolg wider, diese Verpflichtungen zu erfüllen und durch zuverlässige, gut gepflegte Pakete Vertrauen in der Entwickler-Community aufzubauen.
## Unterstützung des Ökosystems: Unsere Open-Source-Sponsorings {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Nachhaltigkeit im Open Source Bereich bedeutet nicht nur, Code beizutragen – es geht auch darum, die Entwickler zu unterstützen, die kritische Infrastruktur pflegen.

Neben unseren direkten Beiträgen zum JavaScript-Ökosystem sind wir stolz darauf, prominente Node.js-Mitwirkende zu sponsern, deren Arbeit die Grundlage vieler moderner Anwendungen bildet. Unsere Sponsorings umfassen:

### Andris Reinman: Pionier der E-Mail-Infrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) ist der Schöpfer von [Nodemailer](https://github.com/nodemailer/nodemailer), der beliebtesten Bibliothek zum Versenden von E-Mails für Node.js mit über 14 Millionen wöchentlichen Downloads\[^15]. Seine Arbeit erstreckt sich auf weitere kritische Komponenten der E-Mail-Infrastruktur wie [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) und [WildDuck](https://github.com/nodemailer/wildduck).

Unser Sponsoring hilft, die fortlaufende Wartung und Entwicklung dieser essenziellen Werkzeuge sicherzustellen, die die E-Mail-Kommunikation für unzählige Node.js-Anwendungen ermöglichen, einschließlich unseres eigenen Forward Email-Dienstes.

### Sindre Sorhus: Mastermind der Utility-Pakete {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) ist einer der produktivsten Open-Source-Beitragsleistenden im JavaScript-Ökosystem mit über 1.000 npm-Paketen auf seinem Konto. Seine Utilities wie [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) und [is-stream](https://github.com/sindresorhus/is-stream) sind grundlegende Bausteine, die im gesamten Node.js-Ökosystem verwendet werden.

Durch die Unterstützung von Sindres Arbeit tragen wir zur nachhaltigen Entwicklung dieser wichtigen Utilities bei, die die JavaScript-Entwicklung effizienter und zuverlässiger machen.

Diese Sponsorings spiegeln unser Engagement für das breitere Open-Source-Ökosystem wider. Wir erkennen an, dass unser eigener Erfolg auf dem Fundament beruht, das diese und andere Mitwirkende gelegt haben, und wir setzen uns dafür ein, die Nachhaltigkeit des gesamten Ökosystems zu gewährleisten.


## Aufdeckung von Sicherheitslücken im JavaScript-Ökosystem {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Unser Engagement für Open Source geht über die Feature-Entwicklung hinaus und umfasst die Identifizierung und Behebung von Sicherheitslücken, die Millionen von Entwicklern betreffen könnten. Einige unserer bedeutendsten Beiträge zum JavaScript-Ökosystem liegen im Bereich Sicherheit.

### Die Rettung des Koa-Routers {#the-koa-router-rescue}

Im Februar 2019 entdeckte Nick ein kritisches Problem bei der Wartung des beliebten koa-router-Pakets. Wie er [auf Hacker News berichtete](https://news.ycombinator.com/item?id=19156707), war das Paket vom ursprünglichen Maintainer aufgegeben worden, wodurch Sicherheitslücken unbehandelt blieben und die Community keine Updates erhielt.

> \[!WARNING]
> Aufgegebene Pakete mit Sicherheitslücken stellen erhebliche Risiken für das gesamte Ökosystem dar, besonders wenn sie millionenfach wöchentlich heruntergeladen werden.

Als Reaktion darauf erstellte Nick [@koa/router](https://github.com/koajs/router) und half, die Community über die Situation zu informieren. Seitdem pflegt er dieses kritische Paket und stellt sicher, dass Koa-Nutzer eine sichere, gut gewartete Routing-Lösung haben.

### Behebung von ReDoS-Sicherheitslücken {#addressing-redos-vulnerabilities}

Im Jahr 2020 identifizierte und behob Nick eine kritische [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-Sicherheitslücke im weit verbreiteten `url-regex`-Paket. Diese Schwachstelle ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) konnte Angreifern ermöglichen, durch speziell gestaltete Eingaben einen Denial of Service zu verursachen, indem sie katastrophales Backtracking im regulären Ausdruck auslösten.

Anstatt das bestehende Paket nur zu patchen, entwickelte Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), eine komplett neu geschriebene Implementierung, die die Schwachstelle behebt und gleichzeitig mit der ursprünglichen API kompatibel bleibt. Außerdem veröffentlichte er einen [umfassenden Blogbeitrag](/blog/docs/url-regex-javascript-node-js), der die Sicherheitslücke erklärt und zeigt, wie man sie mindert.
Diese Arbeit zeigt unseren Ansatz zur Sicherheit: nicht nur Probleme zu beheben, sondern die Gemeinschaft zu informieren und robuste Alternativen bereitzustellen, die ähnliche Probleme in der Zukunft verhindern.

### Einsatz für Node.js- und Chromium-Sicherheit {#advocating-for-nodejs-and-chromium-security}

Nick war auch aktiv darin, Verbesserungen der Sicherheit im weiteren Ökosystem zu fördern. Im August 2020 identifizierte er ein bedeutendes Sicherheitsproblem in Node.js im Zusammenhang mit der Verarbeitung von HTTP-Headern, das in [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) berichtet wurde.

Dieses Problem, das auf einen Patch in Chromium zurückging, konnte potenziell Angreifern erlauben, Sicherheitsmaßnahmen zu umgehen. Nicks Einsatz half sicherzustellen, dass das Problem schnell behoben wurde, wodurch Millionen von Node.js-Anwendungen vor möglicher Ausnutzung geschützt wurden.

### Absicherung der npm-Infrastruktur {#securing-npm-infrastructure}

Im selben Monat entdeckte Nick ein weiteres kritisches Sicherheitsproblem, diesmal in der E-Mail-Infrastruktur von npm. Wie in [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) berichtet, implementierte npm die E-Mail-Authentifizierungsprotokolle DMARC, SPF und DKIM nicht korrekt, was Angreifern potenziell erlaubte, Phishing-E-Mails zu versenden, die scheinbar von npm stammten.

Nicks Bericht führte zu Verbesserungen in der E-Mail-Sicherheitslage von npm, wodurch die Millionen von Entwicklern, die npm für das Paketmanagement nutzen, vor möglichen Phishing-Angriffen geschützt wurden.


## Unsere Beiträge zum Forward Email-Ökosystem {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email basiert auf mehreren wichtigen Open-Source-Projekten, darunter Nodemailer, WildDuck und mailauth. Unser Team hat bedeutende Beiträge zu diesen Projekten geleistet und dabei geholfen, tiefgreifende Probleme zu identifizieren und zu beheben, die die E-Mail-Zustellung und Sicherheit betreffen.

### Verbesserung der Kernfunktionalität von Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) ist das Rückgrat des E-Mail-Versands in Node.js, und unsere Beiträge haben dazu beigetragen, es robuster zu machen:

* **Verbesserungen des SMTP-Servers**: Wir haben Parsing-Fehler, Probleme bei der Stream-Verarbeitung und TLS-Konfigurationsprobleme in der SMTP-Server-Komponente behoben\[^16]\[^17].
* **Verbesserungen des Mail-Parsers**: Wir haben Fehler bei der Dekodierung von Zeichenfolgen und Probleme im Adressparser behoben, die zu Fehlern bei der E-Mail-Verarbeitung führen konnten\[^18]\[^19].

Diese Beiträge stellen sicher, dass Nodemailer eine zuverlässige Grundlage für die E-Mail-Verarbeitung in Node.js-Anwendungen bleibt, einschließlich Forward Email.

### Fortschritte bei der E-Mail-Authentifizierung mit Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) bietet wichtige Funktionen zur E-Mail-Authentifizierung, und unsere Beiträge haben seine Fähigkeiten deutlich verbessert:

* **Verbesserungen der DKIM-Verifikation**: Wir entdeckten und meldeten, dass X/Twitter DNS-Cache-Probleme hatte, die zu DKIM-Fehlern bei ausgehenden Nachrichten führten, und meldeten dies bei Hacker One\[^20].
* **Verbesserungen bei DMARC und ARC**: Wir haben Probleme bei der Verifikation von DMARC und ARC behoben, die zu falschen Authentifizierungsergebnissen führen konnten\[^21]\[^22].
* **Leistungsoptimierungen**: Wir haben Optimierungen beigetragen, die die Leistung der E-Mail-Authentifizierungsprozesse verbessern\[^23]\[^24]\[^25]\[^26].

Diese Verbesserungen helfen sicherzustellen, dass die E-Mail-Authentifizierung genau und zuverlässig ist und Benutzer vor Phishing- und Spoofing-Angriffen schützt.

### Wichtige Verbesserungen bei Upptime {#key-upptime-enhancements}

Unsere Beiträge zu Upptime umfassen:

* **Überwachung von SSL-Zertifikaten**: Wir haben eine Funktion hinzugefügt, um das Ablaufdatum von SSL-Zertifikaten zu überwachen und so unerwartete Ausfallzeiten durch abgelaufene Zertifikate zu verhindern\[^27].
* **Unterstützung mehrerer SMS-Nummern**: Wir haben die Unterstützung für Benachrichtigungen an mehrere Teammitglieder per SMS bei Vorfällen implementiert, was die Reaktionszeiten verbessert\[^28].
* **Fehlerbehebungen bei IPv6-Checks**: Wir haben Probleme bei der Überprüfung der IPv6-Konnektivität behoben, um eine genauere Überwachung in modernen Netzwerkumgebungen zu gewährleisten\[^29].
* **Unterstützung für Dunkel-/Hellmodus**: Wir haben Theme-Unterstützung hinzugefügt, um die Benutzererfahrung von Statusseiten zu verbessern\[^31].
* **Verbesserte TCP-Ping-Unterstützung**: Wir haben die TCP-Ping-Funktionalität verbessert, um zuverlässigere Verbindungstests zu ermöglichen\[^32].
Diese Verbesserungen kommen nicht nur der Statusüberwachung von Forward Email zugute, sondern stehen der gesamten Community der Upptime-Nutzer zur Verfügung und zeigen unser Engagement für die Verbesserung der Werkzeuge, auf die wir angewiesen sind.


## Der Klebstoff, der alles zusammenhält: Maßgeschneiderter Code in großem Maßstab {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Während unsere npm-Pakete und Beiträge zu bestehenden Projekten bedeutend sind, ist es der maßgeschneiderte Code, der diese Komponenten integriert und unsere technische Expertise wirklich unter Beweis stellt. Der Forward Email-Codebestand repräsentiert ein Jahrzehnt Entwicklungsarbeit, die bis ins Jahr 2017 zurückreicht, als das Projekt als [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) begann, bevor es in ein Monorepo zusammengeführt wurde.

### Ein gewaltiger Entwicklungsaufwand {#a-massive-development-effort}

Das Ausmaß dieses maßgeschneiderten Integrationscodes ist beeindruckend:

* **Gesamtbeiträge**: Über 3.217 Commits
* **Codebasis-Größe**: Über 421.545 Codezeilen in JavaScript-, Pug-, CSS- und JSON-Dateien\[^33]

Dies entspricht Tausenden von Entwicklungsstunden, Debugging-Sitzungen und Performance-Optimierungen. Es ist die „geheime Zutat“, die einzelne Pakete in einen kohärenten, zuverlässigen Dienst verwandelt, der täglich von Tausenden von Kunden genutzt wird.

### Integration der Kernabhängigkeiten {#core-dependencies-integration}

Der Forward Email-Codebestand integriert zahlreiche Abhängigkeiten zu einem nahtlosen Ganzen:

* **E-Mail-Verarbeitung**: Integriert Nodemailer zum Senden, SMTP Server zum Empfangen und Mailparser zum Parsen
* **Authentifizierung**: Verwendet Mailauth für DKIM-, SPF-, DMARC- und ARC-Verifizierung
* **DNS-Auflösung**: Nutzt Tangerine für DNS-over-HTTPS mit globalem Caching
* **MX-Verbindung**: Verwendet mx-connect mit Tangerine-Integration für zuverlässige Mailserver-Verbindungen
* **Job-Scheduling**: Setzt Bree für zuverlässige Hintergrundaufgaben mit Worker Threads ein
* **Templating**: Verwendet email-templates, um Stylesheets von der Website in Kundenkommunikationen wiederzuverwenden
* **E-Mail-Speicherung**: Implementiert individuell verschlüsselte SQLite-Mailboxen mit better-sqlite3-multiple-ciphers und ChaCha20-Poly1305-Verschlüsselung für quantensichere Privatsphäre, die vollständige Isolation zwischen Nutzern gewährleistet und sicherstellt, dass nur der Nutzer Zugriff auf seine Mailbox hat

Jede dieser Integrationen erfordert sorgfältige Berücksichtigung von Randfällen, Performance-Auswirkungen und Sicherheitsaspekten. Das Ergebnis ist ein robustes System, das Millionen von E-Mail-Transaktionen zuverlässig verarbeitet. Unsere SQLite-Implementierung nutzt außerdem msgpackr für effiziente binäre Serialisierung und WebSockets (über ws) für Echtzeit-Statusupdates in unserer Infrastruktur.

### DNS-Infrastruktur mit Tangerine und mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Ein kritischer Bestandteil der Forward Email-Infrastruktur ist unser DNS-Auflösungssystem, das auf zwei Schlüsselpaketen basiert:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Unsere Node.js-DNS-over-HTTPS-Implementierung bietet einen Drop-in-Ersatz für den Standard-DNS-Resolver mit eingebauten Wiederholungen, Timeouts, intelligenter Serverrotation und Caching-Unterstützung.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Dieses Paket stellt TCP-Verbindungen zu MX-Servern her, nimmt eine Ziel-Domain oder E-Mail-Adresse, löst die passenden MX-Server auf und verbindet sich in Prioritätsreihenfolge mit ihnen.

Wir haben Tangerine mit mx-connect durch [Pull Request #4](https://github.com/zone-eu/mx-connect/pull/4) integriert, um DNS-over-HTTP-Anfragen auf Anwendungsebene in Forward Email sicherzustellen. Dies ermöglicht globales DNS-Caching im großen Maßstab mit 1:1-Konsistenz über jede Region, App oder jeden Prozess hinweg – entscheidend für zuverlässige E-Mail-Zustellung in einem verteilten System.


## Unternehmenswirkung: Von Open Source zu geschäftskritischen Lösungen {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Der Höhepunkt unserer zehnjährigen Reise in der Open-Source-Entwicklung hat es Forward Email ermöglicht, nicht nur einzelne Entwickler, sondern auch große Unternehmen und Bildungseinrichtungen zu bedienen, die das Rückgrat der Open-Source-Bewegung selbst bilden.
### Fallstudien zur unternehmenskritischen E-Mail-Infrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Unser Engagement für Zuverlässigkeit, Datenschutz und Open-Source-Prinzipien hat Forward Email zur vertrauenswürdigen Wahl für Organisationen mit anspruchsvollen E-Mail-Anforderungen gemacht:

* **Bildungseinrichtungen**: Wie in unserer [Fallstudie zum Alumni-E-Mail-Weiterleitung](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) beschrieben, verlassen sich große Universitäten auf unsere Infrastruktur, um lebenslange Verbindungen mit Hunderttausenden von Alumni durch zuverlässige E-Mail-Weiterleitungsdienste aufrechtzuerhalten.

* **Enterprise-Linux-Lösungen**: Die [Canonical Ubuntu E-Mail Enterprise-Fallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) zeigt, wie unser Open-Source-Ansatz perfekt mit den Bedürfnissen von Enterprise-Linux-Anbietern übereinstimmt und ihnen die Transparenz und Kontrolle bietet, die sie benötigen.

* **Open-Source-Stiftungen**: Vielleicht am aussagekräftigsten ist unsere Partnerschaft mit der Linux Foundation, wie in der [Linux Foundation E-Mail Enterprise-Fallstudie](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) dokumentiert, bei der unser Dienst die Kommunikation für genau die Organisation unterstützt, die die Linux-Entwicklung betreut.

Es gibt eine schöne Symmetrie darin, wie unsere Open-Source-Pakete, die über viele Jahre mit Sorgfalt gepflegt wurden, es uns ermöglicht haben, einen E-Mail-Dienst aufzubauen, der nun genau die Gemeinschaften und Organisationen unterstützt, die Open-Source-Software fördern. Diese vollständige Kreisreise – vom Beitrag einzelner Pakete bis hin zur Bereitstellung einer E-Mail-Infrastruktur auf Unternehmensniveau für Open-Source-Führer – stellt die ultimative Bestätigung unseres Ansatzes zur Softwareentwicklung dar.


## Ein Jahrzehnt Open Source: Ein Blick nach vorn {#a-decade-of-open-source-looking-forward}

Wenn wir auf ein Jahrzehnt Open-Source-Beiträge zurückblicken und auf die nächsten zehn Jahre vorausblicken, sind wir voller Dankbarkeit für die Gemeinschaft, die unsere Arbeit unterstützt hat, und voller Vorfreude auf das, was noch kommt.

Unsere Reise vom einzelnen Paketbeitragenden zu Maintainer einer umfassenden E-Mail-Infrastruktur, die von großen Unternehmen und Open-Source-Stiftungen genutzt wird, war bemerkenswert. Sie ist ein Beweis für die Kraft der Open-Source-Entwicklung und den Einfluss, den durchdachte, gut gepflegte Software auf das breitere Ökosystem haben kann.

In den kommenden Jahren verpflichten wir uns dazu:

* **Unsere bestehenden Pakete weiterhin zu pflegen und zu verbessern**, um sicherzustellen, dass sie zuverlässige Werkzeuge für Entwickler weltweit bleiben.
* **Unsere Beiträge zu kritischen Infrastrukturprojekten auszuweiten**, insbesondere in den Bereichen E-Mail und Sicherheit.
* **Die Fähigkeiten von Forward Email zu erweitern**, während wir unser Engagement für Datenschutz, Sicherheit und Transparenz beibehalten.
* **Die nächste Generation von Open-Source-Beitragenden zu unterstützen** durch Mentoring, Sponsoring und Community-Engagement.

Wir glauben, dass die Zukunft der Softwareentwicklung offen, kollaborativ und auf einer Vertrauensbasis aufgebaut ist. Indem wir weiterhin hochwertige, sicherheitsorientierte Pakete zum JavaScript-Ökosystem beitragen, hoffen wir, einen kleinen Beitrag zum Aufbau dieser Zukunft zu leisten.

Danke an alle, die unsere Pakete genutzt, zu unseren Projekten beigetragen, Probleme gemeldet oder einfach nur unsere Arbeit weiterempfohlen haben. Eure Unterstützung hat dieses Jahrzehnt des Einflusses möglich gemacht, und wir sind gespannt, was wir in den nächsten zehn Jahren gemeinsam erreichen können.

\[^1]: npm Download-Statistiken für cabin, April 2025  
\[^2]: npm Download-Statistiken für bson-objectid, Februar-März 2025  
\[^3]: npm Download-Statistiken für url-regex-safe, April 2025  
\[^4]: GitHub-Sterne für forwardemail/forwardemail.net im April 2025  
\[^5]: npm Download-Statistiken für preview-email, April 2025  
\[^7]: npm Download-Statistiken für superagent, Februar-März 2025  
\[^8]: npm Download-Statistiken für supertest, Februar-März 2025  
\[^9]: npm Download-Statistiken für preview-email, Februar-März 2025  
\[^10]: npm Download-Statistiken für cabin, Februar-März 2025  
\[^11]: npm Download-Statistiken für url-regex-safe, Februar-März 2025  
\[^12]: npm Download-Statistiken für spamscanner, Februar-März 2025  
\[^13]: Tägliche Download-Muster aus npm-Statistiken, April 2025  
\[^14]: Wöchentliche Download-Muster aus npm-Statistiken, April 2025  
\[^15]: npm Download-Statistiken für nodemailer, April 2025  
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>  
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>  
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>  
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>  
\[^20]: <https://github.com/postalsys/mailauth/issues/30>  
\[^21]: <https://github.com/postalsys/mailauth/issues/58>  
\[^22]: <https://github.com/postalsys/mailauth/issues/48>  
\[^23]: <https://github.com/postalsys/mailauth/issues/74>  
\[^24]: <https://github.com/postalsys/mailauth/issues/75>  
\[^25]: <https://github.com/postalsys/mailauth/issues/60>  
\[^26]: <https://github.com/postalsys/mailauth/issues/73>  
\[^27]: Basierend auf GitHub-Issues im Upptime-Repository  
\[^28]: Basierend auf GitHub-Issues im Upptime-Repository  
\[^29]: Basierend auf GitHub-Issues im Upptime-Repository  
\[^30]: npm Download-Statistiken für bree, Februar-März 2025  
\[^31]: Basierend auf GitHub-Pull-Requests zu Upptime  
\[^32]: Basierend auf GitHub-Pull-Requests zu Upptime  
\[^34]: npm Download-Statistiken für koa, Februar-März 2025  
\[^35]: npm Download-Statistiken für @koa/router, Februar-März 2025  
\[^36]: npm Download-Statistiken für koa-router, Februar-März 2025  
\[^37]: npm Download-Statistiken für url-regex, Februar-März 2025  
\[^38]: npm Download-Statistiken für @breejs/later, Februar-März 2025  
\[^39]: npm Download-Statistiken für email-templates, Februar-März 2025  
\[^40]: npm Download-Statistiken für get-paths, Februar-März 2025  
\[^41]: npm Download-Statistiken für dotenv-parse-variables, Februar-März 2025  
\[^42]: npm Download-Statistiken für @koa/multer, Februar-März 2025
