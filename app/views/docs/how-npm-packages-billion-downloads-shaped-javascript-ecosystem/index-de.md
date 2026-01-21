# Ein Jahrzehnt voller Einfluss: Wie unsere npm-Pakete 1 Milliarde Downloads erreichten und JavaScript prägten {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Die Pioniere, die uns vertrauen: Isaac Z. Schlueter und Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Von der Entwicklung von npm zur Node.js-Führung](#from-npms-creation-to-nodejs-leadership)
* [Der Architekt hinter dem Code: Nick Baughs Reise](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express-Technikausschuss und Kernbeiträge](#express-technical-committee-and-core-contributions)
  * [Beiträge zum Koa-Framework](#koa-framework-contributions)
  * [Vom einzelnen Mitarbeiter zum Leiter einer Organisation](#from-individual-contributor-to-organization-leader)
* [Unsere GitHub-Organisationen: Ökosysteme der Innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturiertes Logging für moderne Anwendungen](#cabin-structured-logging-for-modern-applications)
  * [Spam-Scanner: E-Mail-Missbrauch bekämpfen](#spam-scanner-fighting-email-abuse)
  * [Bree: Modernes Job Scheduling mit Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [E-Mail weiterleiten: Open Source-E-Mail-Infrastruktur](#forward-email-open-source-email-infrastructure)
  * [Lad: Wichtige Koa-Dienstprogramme und -Tools](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open Source-Uptime-Überwachung](#upptime-open-source-uptime-monitoring)
* [Unsere Beiträge zum Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem)
  * [Von Paketen zur Produktion](#from-packages-to-production)
  * [Die Rückkopplungsschleife](#the-feedback-loop)
* [Die Grundprinzipien von Forward Email: Eine Grundlage für Exzellenz](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Immer entwicklerfreundlich, sicherheitsorientiert und transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Einhaltung bewährter Prinzipien der Softwareentwicklung](#adherence-to-time-tested-software-development-principles)
  * [Zielgruppe sind kämpferische, eigeninitiativbegabte Entwickler](#targeting-the-scrappy-bootstrapped-developer)
  * [Prinzipien in der Praxis: Die Forward Email Codebase](#principles-in-practice-the-forward-email-codebase)
  * [Datenschutz durch Technikgestaltung](#privacy-by-design)
  * [Nachhaltige Open Source](#sustainable-open-source)
* [Die Zahlen lügen nicht: Unsere atemberaubenden npm-Download-Statistiken](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Unsere Wirkung aus der Vogelperspektive](#a-birds-eye-view-of-our-impact)
  * [Tägliche Wirkung im großen Maßstab](#daily-impact-at-scale)
  * [Mehr als nur Zahlen](#beyond-the-raw-numbers)
* [Unterstützung des Ökosystems: Unsere Open-Source-Sponsorings](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionier der E-Mail-Infrastruktur](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility-Paket-Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Aufdecken von Sicherheitslücken im JavaScript-Ökosystem](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Die Koa-Router-Rettung](#the-koa-router-rescue)
  * [Beheben von ReDoS-Schwachstellen](#addressing-redos-vulnerabilities)
  * [Eintreten für die Sicherheit von Node.js und Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Sicherung der npm-Infrastruktur](#securing-npm-infrastructure)
* [Unsere Beiträge zum Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Verbesserung der Kernfunktionalität von Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Erweiterte E-Mail-Authentifizierung mit Mailauth](#advancing-email-authentication-with-mailauth)
  * [Wichtige Upptime-Verbesserungen](#key-upptime-enhancements)
* [Der Klebstoff, der alles zusammenhält: Benutzerdefinierter Code im großen Maßstab](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Ein massiver Entwicklungsaufwand](#a-massive-development-effort)
  * [Integration von Kernabhängigkeiten](#core-dependencies-integration)
  * [DNS-Infrastruktur mit Tangerine und mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Auswirkungen auf Unternehmen: Von Open Source zu unternehmenskritischen Lösungen](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Fallstudien zur unternehmenskritischen E-Mail-Infrastruktur](#case-studies-in-mission-critical-email-infrastructure)
* [Ein Jahrzehnt Open Source: Ein Blick in die Zukunft](#a-decade-of-open-source-looking-forward)

## Vorwort {#foreword}

In der Welt von [JavaScript](https://en.wikipedia.org/wiki/JavaScript) und [Node.js](https://en.wikipedia.org/wiki/Node.js) sind einige Pakete unverzichtbar – sie werden täglich millionenfach heruntergeladen und treiben Apps weltweit an. Hinter diesen Tools stehen Entwickler, die auf Open-Source-Qualität setzen. Heute zeigen wir, wie unser Team npm-Pakete entwickelt und pflegt, die zu wichtigen Bestandteilen des JavaScript-Ökosystems geworden sind.

## Die Pioniere, die uns vertrauen: Isaac Z. Schlueter und E-Mail weiterleiten {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Wir sind stolz, [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) als Nutzer zu haben. Isaac hat [npm](https://en.wikipedia.org/wiki/Npm_\(software\) erstellt und [Node.js](https://en.wikipedia.org/wiki/Node.js) mitgestaltet. Sein Vertrauen in Forward Email zeigt, wie wichtig Qualität und Sicherheit für uns sind. Isaac nutzt Forward Email für verschiedene Domains, darunter izs.me.

Isaacs Einfluss auf JavaScript ist enorm. 2009 erkannte er als einer der Ersten das Potenzial von Node.js und arbeitete mit [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl) zusammen, dem Entwickler der Plattform. Wie Isaac in einem [Interview mit dem Increment Magazin](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) sagte: „Inmitten dieser sehr kleinen Community, die versuchte, serverseitiges JS zu entwickeln, präsentierte Ryan Dahl Node.js, was eindeutig der richtige Ansatz war. Ich habe mich darauf eingelassen und war Mitte 2009 stark involviert.“

> \[!NOTE]
> Für alle, die sich für die Geschichte von Node.js interessieren, gibt es hervorragende Dokumentationen, die die Entwicklung dokumentieren, darunter [Die Geschichte von Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) und [10 Dinge, die ich an Node.js bereue – Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Auch Ryan Dahls [persönliche Website](https://tinyclouds.org/) bietet wertvolle Einblicke in seine Arbeit.

### Von der Entwicklung von npm zur Führung von Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac entwickelte npm im September 2009, die erste nutzbare Version erschien Anfang 2010. Dieser Paketmanager erfüllte eine wichtige Anforderung von Node.js und ermöglichte Entwicklern die einfache gemeinsame Nutzung und Wiederverwendung von Code. Laut [Node.js Wikipedia-Seite](https://en.wikipedia.org/wiki/Node.js) wurde im Januar 2010 ein Paketmanager namens npm für die Node.js-Umgebung eingeführt. Der Paketmanager ermöglicht es Programmierern, Node.js-Pakete zusammen mit dem zugehörigen Quellcode zu veröffentlichen und zu teilen und vereinfacht die Installation, Aktualisierung und Deinstallation von Paketen.

Als Ryan Dahl im Januar 2012 Node.js verließ, übernahm Isaac die Projektleitung. Wie auf [seine Zusammenfassung](https://izs.me/resume) erwähnt, leitete er die Entwicklung mehrerer grundlegender Node.js-Kern-APIs, darunter das CommonJS-Modulsystem, Dateisystem-APIs und Streams. Außerdem fungierte er zwei Jahre lang als BDFL (Benevolent Dictator For Life) des Projekts und sorgte für eine stetig steigende Qualität und einen zuverlässigen Build-Prozess für die Node.js-Versionen v0.6 bis v0.10.

Isaac führte Node.js durch eine entscheidende Wachstumsphase und setzte Standards, die die Plattform bis heute prägen. Später gründete er 2014 npm, Inc., um das npm-Register zu unterstützen, das er zuvor selbst betrieben hatte.

Wir danken Isaac für seine großen Beiträge zu JavaScript und nutzen weiterhin viele seiner Pakete. Seine Arbeit hat die Art und Weise verändert, wie wir Software entwickeln und wie Millionen von Entwicklern weltweit Code teilen.

## Der Architekt hinter dem Code: Nick Baughs Reise {#the-architect-behind-the-code-nick-baughs-journey}

Im Mittelpunkt unseres Open-Source-Erfolgs steht Nick Baugh, Gründer und Inhaber von Forward Email. Seine fast 20-jährige Arbeit mit JavaScript hat die Entwicklung unzähliger Apps geprägt. Sein Open-Source-Erfolg zeugt von technischem Können und Community-Führung.

### Express Technical Committee und Kernbeiträge {#express-technical-committee-and-core-contributions}

Nicks Expertise im Bereich Web-Frameworks sicherte ihm einen Platz im [Technischer Ausschuss für Expressdienste](https://expressjs.com/en/resources/community.html), wo er an einem der meistgenutzten Node.js-Frameworks mitwirkte. Nick ist nun als inaktives Mitglied im [Express-Community-Seite](https://expressjs.com/en/resources/community.html) gelistet.

> \[!IMPORTANT]
> Express wurde ursprünglich von TJ Holowaychuk entwickelt, einem produktiven Open-Source-Entwickler, der das Node.js-Ökosystem maßgeblich geprägt hat. Wir sind dankbar für TJs grundlegende Arbeit und respektieren seine [Entscheidung, eine Pause einzulegen](https://news.ycombinator.com/item?id=37687017) und seine umfangreichen Open-Source-Beiträge.

Als Mitglied von [Technischer Ausschuss für Expressdienste](https://expressjs.com/en/resources/community.html) zeigte Nick große Liebe zum Detail bei Themen wie der Klärung der `req.originalUrl`-Dokumentation und der Behebung von Problemen bei der Handhabung mehrteiliger Formulare.

### Koa Framework-Beiträge {#koa-framework-contributions}

Nicks Arbeit mit [Koa-Rahmen](https://github.com/koajs/koa) – einer modernen, leichteren Alternative zu Express, die ebenfalls von TJ Holowaychuk entwickelt wurde – unterstreicht sein Engagement für bessere Webentwicklungstools. Seine Koa-Beiträge umfassen sowohl Issues als auch Code über Pull Requests, die sich mit Fehlerbehandlung, Inhaltstypverwaltung und Dokumentationsverbesserungen befassen.

Seine Arbeit mit Express und Koa verschafft ihm einen einzigartigen Einblick in die Node.js-Webentwicklung und hilft unserem Team, Pakete zu erstellen, die mit mehreren Framework-Ökosystemen gut funktionieren.

### Vom einzelnen Mitarbeiter zum Leiter der Organisation {#from-individual-contributor-to-organization-leader}

Was mit der Unterstützung bestehender Projekte begann, entwickelte sich zur Entwicklung und Pflege ganzer Paket-Ökosysteme. Nick gründete mehrere GitHub-Organisationen – darunter [Kabine](https://github.com/cabinjs), [Spam-Scanner](https://github.com/spamscanner), [E-Mail weiterleiten](https://github.com/forwardemail), [Junge](https://github.com/ladjs) und [Bree](https://github.com/breejs) –, die jeweils spezifische Bedürfnisse der JavaScript-Community lösten.

Dieser Wechsel vom Mitwirkenden zum Leiter zeigt Nicks Vision von gut konzipierter Software, die echte Probleme löst. Durch die Organisation verwandter Pakete in fokussierten GitHub-Organisationen hat er Tool-Ökosysteme geschaffen, die zusammenarbeiten und gleichzeitig modular und flexibel für die breitere Entwickler-Community bleiben.

## Unsere GitHub-Organisationen: Ökosysteme der Innovation {#our-github-organizations-ecosystems-of-innovation}

Wir organisieren unsere Open-Source-Arbeit in fokussierten GitHub-Organisationen, die jeweils spezifische Anforderungen in JavaScript erfüllen. Diese Struktur schafft zusammenhängende Paketfamilien, die gut zusammenarbeiten und gleichzeitig modular bleiben.

### Cabin: Strukturiertes Logging für moderne Anwendungen {#cabin-structured-logging-for-modern-applications}

Der [Kabinenorganisation](https://github.com/cabinjs) ist unsere Version einer einfachen, leistungsstarken App-Protokollierung. Das Hauptpaket [`cabin`](https://github.com/cabinjs/cabin) hat fast 900 GitHub-Sterne und wird wöchentlich über 100.000 Mal heruntergeladen. Cabin bietet strukturierte Protokollierung, die mit gängigen Diensten wie Sentry, LogDNA und Papertrail kompatibel ist.

Das Besondere an Cabin ist sein durchdachtes API- und Plugin-System. Unterstützende Pakete wie [`axe`](https://github.com/cabinjs/axe) für Express-Middleware und [`parse-request`](https://github.com/cabinjs/parse-request) für HTTP-Anforderungsanalyse zeigen unser Engagement für Komplettlösungen statt isolierter Tools.

Besonders hervorzuheben ist das Paket [`bson-objectid`](https://github.com/cabinjs/bson-objectid), das in nur zwei Monaten über 1,7 Millionen Mal heruntergeladen wurde.[^2] Diese einfache MongoDB ObjectID-Implementierung ist zur ersten Wahl für Entwickler geworden, die IDs ohne vollständige MongoDB-Abhängigkeiten benötigen.

### Spam-Scanner: Bekämpfung von E-Mail-Missbrauch {#spam-scanner-fighting-email-abuse}

Das [Spam-Scanner-Organisation](https://github.com/spamscanner)-Paket zeigt unser Engagement für die Lösung realer Probleme. Das Hauptpaket [`spamscanner`](https://github.com/spamscanner/spamscanner) bietet erweiterte E-Mail-Spam-Erkennung, aber das Paket [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) erfreut sich einer erstaunlichen Akzeptanz.

Mit über 1,2 Millionen Downloads in zwei Monaten[^3] behebt `url-regex-safe` kritische Sicherheitsprobleme in anderen regulären Ausdrücken zur URL-Erkennung. Dieses Paket veranschaulicht unseren Open-Source-Ansatz: Wir finden ein häufiges Problem (in diesem Fall [Wiederholen](https://en.wikipedia.org/wiki/ReDoS)-Schwachstellen in der URL-Validierung), entwickeln eine solide Lösung und pflegen diese sorgfältig.

### Bree: Modernes Job Scheduling mit Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

[Bree-Organisation](https://github.com/breejs) ist unsere Antwort auf eine häufige Node.js-Herausforderung: zuverlässige Jobplanung. Das Hauptpaket [`bree`](https://github.com/breejs/bree) mit über 3.100 GitHub-Sternen bietet einen modernen Jobplaner mit Node.js-Worker-Threads für bessere Leistung und Zuverlässigkeit.

> \[!NOTE]
> Bree entstand, nachdem wir [Agenda](https://github.com/agenda/agenda) mitgepflegt und die gewonnenen Erkenntnisse genutzt hatten, um einen besseren Job-Scheduler zu entwickeln. Unsere Beiträge zur Agenda halfen uns, Wege zur Verbesserung der Job-Scheduling zu finden.

Was Bree von anderen Planern wie Agenda unterscheidet:

* **Keine externen Abhängigkeiten**: Im Gegensatz zu Agenda, das MongoDB benötigt, benötigt Bree weder Redis noch MongoDB zur Verwaltung des Jobstatus.
* **Worker-Threads**: Bree verwendet Node.js-Worker-Threads für Sandbox-Prozesse und sorgt so für bessere Isolation und Leistung.
* **Einfache API**: Bree bietet detaillierte und einfache Steuerungsmöglichkeiten und erleichtert so die Umsetzung komplexer Planungsanforderungen.
* **Integrierte Unterstützung**: Funktionen wie reibungsloses Neuladen, Cron-Jobs, Datumsangaben und benutzerfreundliche Uhrzeiten sind standardmäßig enthalten.

Bree ist ein wichtiger Bestandteil von [forwardemail.net](https://github.com/forwardemail/forwardemail.net) und übernimmt kritische Hintergrundaufgaben wie E-Mail-Verarbeitung, Bereinigung und geplante Wartung. Der Einsatz von Bree in Forward Email unterstreicht unser Engagement für den Einsatz unserer eigenen Tools in der Produktion und stellt sicher, dass diese hohe Zuverlässigkeitsstandards erfüllen.

Wir nutzen und schätzen auch andere hervorragende Worker-Thread-Pakete wie [Pool](https://github.com/piscinajs/piscina) und HTTP-Clients wie [elf](https://github.com/nodejs/undici). Piscina nutzt wie Bree Node.js-Worker-Threads für eine effiziente Aufgabenverarbeitung. Wir danken [Matthew Hill](https://github.com/mcollina), der sowohl undici als auch piscina betreut, für seine wichtigen Beiträge zu Node.js. Matteo ist Mitglied des Node.js Technical Steering Committee und hat die HTTP-Client-Funktionen in Node.js erheblich verbessert.

### E-Mail weiterleiten: Open Source-E-Mail-Infrastruktur {#forward-email-open-source-email-infrastructure}

Unser ambitioniertestes Projekt ist [E-Mail weiterleiten](https://github.com/forwardemail), ein Open-Source-E-Mail-Dienst, der E-Mail-Weiterleitung, -Speicherung und API-Dienste bietet. Das Hauptrepository verfügt über über 1.100 GitHub-Sterne[^4], was die Wertschätzung der Community für diese Alternative zu proprietären E-Mail-Diensten zeigt.

Das Paket [`preview-email`](https://github.com/forwardemail/preview-email) dieser Organisation wurde in zwei Monaten über 2,5 Millionen Mal heruntergeladen[^5] und ist zu einem unverzichtbaren Tool für Entwickler geworden, die mit E-Mail-Vorlagen arbeiten. Durch die einfache Möglichkeit, E-Mails während der Entwicklung in der Vorschau anzuzeigen, löst es ein häufiges Problem bei der Erstellung E-Mail-fähiger Anwendungen.

### Lad: Wichtige Koa-Dienstprogramme und -Tools {#lad-essential-koa-utilities-and-tools}

Der [Jungenorganisation](https://github.com/ladjs) bietet eine Sammlung wichtiger Dienstprogramme und Tools, die sich in erster Linie auf die Verbesserung des Koa-Framework-Ökosystems konzentrieren. Diese Pakete lösen häufige Herausforderungen in der Webentwicklung und sind so konzipiert, dass sie nahtlos zusammenarbeiten und gleichzeitig unabhängig voneinander nützlich bleiben.

#### koa-better-error-handler: Verbesserte Fehlerbehandlung für Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) bietet eine bessere Fehlerbehandlungslösung für Koa-Anwendungen. Mit über 50 GitHub-Sternen ermöglicht dieses Paket `ctx.throw` die Ausgabe benutzerfreundlicher Fehlermeldungen und behebt gleichzeitig einige Einschränkungen des integrierten Fehlerhandlers von Koa:

* Erkennt und behandelt Node.js-DNS-Fehler, Mongoose-Fehler und Redis-Fehler.
* Verwendet [Boom](https://github.com/hapijs/boom) für konsistente, gut formatierte Fehlerantworten.
* Behält Header bei (im Gegensatz zum integrierten Handler von Koa).
* Behält die entsprechenden Statuscodes bei, anstatt standardmäßig 500 zu verwenden.
* Unterstützt Flash-Nachrichten und Sitzungserhaltung.
* Bietet HTML-Fehlerlisten für Validierungsfehler.
* Unterstützt mehrere Antworttypen (HTML, JSON und einfacher Text).

Dieses Paket ist besonders wertvoll, wenn es zusammen mit [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) für ein umfassendes Fehlermanagement in Koa-Anwendungen verwendet wird.

#### Reisepass: Authentifizierung für Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) erweitert die beliebte Authentifizierungs-Middleware Passport.js um spezifische Verbesserungen für moderne Webanwendungen. Dieses Paket unterstützt sofort mehrere Authentifizierungsstrategien:

* Lokale Authentifizierung per E-Mail
* Anmeldung mit Apple
* GitHub-Authentifizierung
* Google-Authentifizierung
* Einmalpasswort-Authentifizierung (OTP)

Das Paket ist hochgradig anpassbar und ermöglicht Entwicklern, Feldnamen und Ausdrücke an die Anforderungen ihrer Anwendung anzupassen. Es lässt sich nahtlos in Mongoose zur Benutzerverwaltung integrieren und ist somit die ideale Lösung für Koa-basierte Anwendungen, die eine robuste Authentifizierung benötigen.

#### graceful: Elegantes Herunterfahren der Anwendung {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) löst die kritische Herausforderung, Node.js-Anwendungen ordnungsgemäß zu beenden. Mit über 70 GitHub-Sternen stellt dieses Paket sicher, dass Ihre Anwendung sauber beendet werden kann, ohne dass Daten verloren gehen oder Verbindungen unterbrochen werden. Zu den wichtigsten Funktionen gehören:

* Unterstützung für das ordnungsgemäße Schließen von HTTP-Servern (Express/Koa/Fastify)
* Sauberes Herunterfahren von Datenbankverbindungen (MongoDB/Mongoose)
* Ordnungsgemäßes Schließen von Redis-Clients
* Handhabung von Bree-Job-Schedulern
* Unterstützung für benutzerdefinierte Shutdown-Handler
* Konfigurierbare Timeout-Einstellungen
* Integration mit Protokollierungssystemen

Dieses Paket ist unerlässlich für Produktionsanwendungen, bei denen unerwartete Abschaltungen zu Datenverlust oder -beschädigung führen können. Durch die Implementierung geeigneter Abschaltverfahren trägt `@ladjs/graceful` zur Gewährleistung der Zuverlässigkeit und Stabilität Ihrer Anwendung bei.

### Upptime: Open Source-Uptime-Überwachung {#upptime-open-source-uptime-monitoring}

Der [Upptime-Organisation](https://github.com/upptime) steht für unser Engagement für transparentes Open-Source-Monitoring. Das Hauptrepository [`upptime`](https://github.com/upptime/upptime) verfügt über mehr als 13.000 GitHub-Sterne und ist damit eines der beliebtesten Projekte, zu denen wir beitragen. Upptime bietet einen GitHub-basierten Uptime-Monitor und eine Statusseite, die vollständig ohne Server funktioniert.

Wir verwenden Upptime für unsere eigene Statusseite unter <https://status.forwardemail.net> mit dem Quellcode, der unter <https://github.com/forwardemail/status.forwardemail.net>. verfügbar ist

Das Besondere an Upptime ist seine Architektur:

* **100 % Open Source**: Jede Komponente ist vollständig Open Source und anpassbar.
* **Powered by GitHub**: Nutzt GitHub-Aktionen, -Probleme und -Seiten für eine serverlose Überwachungslösung.
* **Kein Server erforderlich**: Im Gegensatz zu herkömmlichen Überwachungstools benötigen Sie für Upptime keinen Server.
* **Automatische Statusseite**: Generiert eine ansprechende Statusseite, die auf GitHub Pages gehostet werden kann.
* **Leistungsstarke Benachrichtigungen**: Integriert sich in verschiedene Benachrichtigungskanäle wie E-Mail, SMS und Slack.

Um das Benutzererlebnis zu verbessern, haben wir [@octokit/core](https://github.com/octokit/core.js/) in die Codebasis von forwardemail.net integriert, um Statusaktualisierungen und Vorfälle in Echtzeit direkt auf unserer Website anzuzeigen. Diese Integration bietet unseren Benutzern klare Transparenz bei Problemen in unserem gesamten Stack (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree usw.) mit sofortigen Toast-Benachrichtigungen, Änderungen der Badge-Symbole, Warnfarben und mehr.

Die @octokit/core-Bibliothek ermöglicht es uns, Echtzeitdaten aus unserem Upptime GitHub-Repository abzurufen, zu verarbeiten und benutzerfreundlich darzustellen. Bei einem Ausfall oder einer Leistungseinbuße eines Dienstes werden Benutzer sofort durch visuelle Indikatoren benachrichtigt, ohne die Hauptanwendung verlassen zu müssen. Diese nahtlose Integration stellt sicher, dass unsere Benutzer stets über aktuelle Informationen zum Systemstatus verfügen, was Transparenz und Vertrauen stärkt.

Upptime wird von Hunderten von Organisationen eingesetzt, die nach einer transparenten und zuverlässigen Möglichkeit suchen, ihre Dienste zu überwachen und den Status an Benutzer zu kommunizieren. Der Erfolg des Projekts zeigt, wie leistungsstark Tools sind, die die vorhandene Infrastruktur (in diesem Fall GitHub) nutzen, um häufige Probleme auf neue Weise zu lösen.

## Unsere Beiträge zum Forward-E-Mail-Ökosystem {#our-contributions-to-the-forward-email-ecosystem}

Unsere Open-Source-Pakete werden von Entwicklern weltweit genutzt und bilden gleichzeitig die Grundlage unseres eigenen Forward Email-Dienstes. Diese Doppelrolle – sowohl als Entwickler als auch als Nutzer dieser Tools – verschafft uns einen einzigartigen Einblick in ihre praktische Anwendung und fördert kontinuierliche Verbesserungen.

### Von Paketen zur Produktion {#from-packages-to-production}

Der Weg von einzelnen Paketen zu einem zusammenhängenden Produktionssystem erfordert sorgfältige Integration und Erweiterung. Für Forward Email umfasst dieser Prozess:

* **Benutzerdefinierte Erweiterungen**: Entwicklung von Forward-E-Mail-spezifischen Erweiterungen für unsere Open-Source-Pakete, die unseren individuellen Anforderungen gerecht werden.
* **Integrationsmuster**: Entwicklung von Mustern für die Interaktion dieser Pakete in einer Produktionsumgebung.
* **Leistungsoptimierungen**: Identifizierung und Behebung von Leistungsengpässen, die erst bei größerem Umfang auftreten.
* **Sicherheitshärtung**: Hinzufügen zusätzlicher Sicherheitsebenen speziell für die E-Mail-Verarbeitung und den Schutz von Nutzerdaten.

Diese Arbeit umfasst Tausende von Entwicklungsstunden, die über die eigentlichen Kernpakete hinausgehen. Das Ergebnis ist ein robuster, sicherer E-Mail-Dienst, der das Beste aus unseren Open-Source-Beiträgen herausholt.

### Die Feedback-Schleife {#the-feedback-loop}

Der vielleicht wertvollste Aspekt der Verwendung unserer eigenen Pakete in der Produktion ist die dadurch entstehende Feedbackschleife. Wenn wir bei Forward Email auf Einschränkungen oder Sonderfälle stoßen, beheben wir diese nicht nur lokal, sondern verbessern die zugrunde liegenden Pakete, was sowohl unserem Service als auch der Community zugutekommt.

Dieser Ansatz hat zu zahlreichen Verbesserungen geführt:

* **Brees ordnungsgemäßes Herunterfahren**: Der Bedarf von Forward Email an Bereitstellungen ohne Ausfallzeiten führte zu verbesserten ordnungsgemäßen Herunterfahren-Funktionen in Bree.
* **Mustererkennung des Spam-Scanners**: Reale Spam-Muster, die in Forward Email gefunden wurden, flossen in die Erkennungsalgorithmen des Spam-Scanners ein.
* **Leistungsoptimierungen von Cabin**: Umfangreiche Protokollierungsvorgänge in der Produktion ergaben Optimierungsmöglichkeiten in Cabin, die allen Nutzern zugutekommen.

Indem wir diesen positiven Kreislauf zwischen unserer Open-Source-Arbeit und unserem Produktionsservice aufrechterhalten, stellen wir sicher, dass unsere Pakete praktische, praxiserprobte Lösungen bleiben und keine theoretischen Implementierungen sind.

## Die Grundprinzipien von Forward Email: Eine Grundlage für Exzellenz {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email basiert auf einer Reihe von Grundprinzipien, die alle unsere Entwicklungsentscheidungen bestimmen. Diese Prinzipien, die in unserem [Webseite](/blog/docs/best-quantum-safe-encrypted-email-service#principles) detailliert beschrieben sind, gewährleisten, dass unser Service entwicklerfreundlich, sicher und datenschutzorientiert bleibt.

### Immer entwicklerfreundlich, sicherheitsorientiert und transparent {#always-developer-friendly-security-focused-and-transparent}

Unser oberstes Ziel ist es, entwicklerfreundliche Software zu entwickeln und gleichzeitig höchste Sicherheits- und Datenschutzstandards einzuhalten. Wir sind überzeugt, dass technische Exzellenz niemals auf Kosten der Benutzerfreundlichkeit gehen sollte und dass Transparenz das Vertrauen unserer Community stärkt.

Dieses Prinzip spiegelt sich in unserer ausführlichen Dokumentation, klaren Fehlermeldungen und einer offenen Kommunikation über Erfolge und Herausforderungen wider. Indem wir unseren gesamten Code als Open Source bereitstellen, fördern wir die Überprüfung und Zusammenarbeit und stärken so sowohl unsere Software als auch das gesamte Ökosystem.

### Einhaltung bewährter Prinzipien der Softwareentwicklung {#adherence-to-time-tested-software-development-principles}

Wir folgen mehreren etablierten Prinzipien der Softwareentwicklung, die sich über Jahrzehnte bewährt haben:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Trennung von Belangen durch das Model-View-Controller-Muster
* **[Unix-Philosophie](https://en.wikipedia.org/wiki/Unix_philosophy)**: Entwicklung modularer Komponenten, die eine bestimmte Funktion gut erfüllen
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Einfachheit und Übersichtlichkeit
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Wiederholen Sie sich nicht, fördern Sie die Wiederverwendung von Code
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Sie werden es nicht brauchen, vermeiden Sie vorzeitige Optimierung
* **[Zwölf Faktor](https://12factor.net/)**: Befolgen von Best Practices für die Entwicklung moderner, skalierbarer Anwendungen
* **[Ockhams Rasiermesser](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Auswahl der einfachsten Lösung, die die Anforderungen erfüllt
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Intensive Nutzung unserer eigenen Produkte

Diese Prinzipien sind nicht nur theoretische Konzepte, sondern fester Bestandteil unserer täglichen Entwicklungspraxis. Unsere Orientierung an der Unix-Philosophie zeigt sich beispielsweise in der Struktur unserer npm-Pakete: kleine, fokussierte Module, die sich zur Lösung komplexer Probleme zusammensetzen lassen.

### Zielgruppe sind kämpferische, eigeninitiativbegabte Entwickler {#targeting-the-scrappy-bootstrapped-developer}

Wir richten uns speziell an kämpferische, engagierte und [Ramen-profitabel](https://www.paulgraham.com/ramenprofitable.html)-Entwickler. Dieser Fokus prägt alles, von unserem Preismodell bis hin zu unseren technischen Entscheidungen. Wir kennen die Herausforderungen der Produktentwicklung mit begrenzten Ressourcen, denn wir haben das selbst erlebt.

Dieses Prinzip ist besonders wichtig für unseren Open-Source-Ansatz. Wir erstellen und pflegen Pakete, die echte Probleme für Entwickler ohne Unternehmensbudget lösen und leistungsstarke Tools für alle zugänglich machen, unabhängig von ihren Ressourcen.

### Prinzipien in der Praxis: Die Codebasis zum Weiterleiten von E-Mails {#principles-in-practice-the-forward-email-codebase}

Diese Prinzipien sind im Forward Email-Code deutlich erkennbar. Unsere package.json-Datei zeigt eine sorgfältige Auswahl von Abhängigkeiten, die jeweils unseren Grundwerten entsprechen:

* Sicherheitsorientierte Pakete wie `mailauth` für die E-Mail-Authentifizierung
* Entwicklerfreundliche Tools wie `preview-email` für einfacheres Debuggen
* Modulare Komponenten wie die verschiedenen `p-*`-Dienstprogramme von Sindre Sorhus

Durch die konsequente Einhaltung dieser Grundsätze haben wir einen Dienst aufgebaut, dem Entwickler ihre E-Mail-Infrastruktur anvertrauen können – sicher, zuverlässig und im Einklang mit den Werten der Open-Source-Community.

### Datenschutz durch Technikgestaltung {#privacy-by-design}

Datenschutz ist für Forward Email kein nachträglicher Einfall oder Marketingmerkmal – es ist ein grundlegendes Designprinzip, das jeden Aspekt unseres Dienstes und Codes beeinflusst:

* **Zero-Access-Verschlüsselung**: Wir haben Systeme implementiert, die es uns technisch unmöglich machen, die E-Mails unserer Nutzer zu lesen.
* **Minimale Datenerhebung**: Wir erheben nur die für die Bereitstellung unseres Dienstes notwendigen Daten, nicht mehr.
* **Transparente Richtlinien**: Unsere Datenschutzrichtlinie ist klar und verständlich formuliert und verzichtet auf juristische Fachbegriffe.
* **Open-Source-Verifizierung**: Unsere Open-Source-Codebasis ermöglicht es Sicherheitsforschern, unsere Datenschutzangaben zu überprüfen.

Dieses Engagement erstreckt sich auch auf unsere Open-Source-Pakete, die von Grund auf mit den besten Praktiken für Sicherheit und Datenschutz entwickelt wurden.

### Nachhaltige Open Source {#sustainable-open-source}

Wir sind überzeugt, dass Open-Source-Software nachhaltige Modelle braucht, um langfristig erfolgreich zu sein. Unser Ansatz umfasst:

* **Kommerzieller Support**: Wir bieten Premium-Support und -Services rund um unsere Open-Source-Tools.
* **Ausgewogene Lizenzierung**: Wir verwenden Lizenzen, die sowohl die Freiheit der Nutzer als auch die Nachhaltigkeit des Projekts schützen.
* **Community-Engagement**: Wir arbeiten aktiv mit Mitwirkenden zusammen, um eine unterstützende Community aufzubauen.
* **Transparente Roadmaps**: Wir geben unsere Entwicklungspläne bekannt, damit Nutzer entsprechend planen können.

Indem wir uns auf Nachhaltigkeit konzentrieren, stellen wir sicher, dass unsere Open-Source-Beiträge im Laufe der Zeit weiter wachsen und sich verbessern können, anstatt in Vernachlässigung zu geraten.

## Die Zahlen lügen nicht: Unsere atemberaubenden npm-Download-Statistiken {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Wenn wir über die Wirkung von Open-Source-Software sprechen, liefern Download-Statistiken ein konkretes Maß für Akzeptanz und Vertrauen. Viele der von uns betreuten Pakete haben eine Größenordnung erreicht, die nur wenige Open-Source-Projekte erreichen: Die Downloadzahlen liegen insgesamt in den Milliarden.

![Top npm-Pakete nach Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Wir sind stolz darauf, einige häufig heruntergeladene Pakete im JavaScript-Ökosystem zu pflegen. Gleichzeitig möchten wir anerkennen, dass viele dieser Pakete ursprünglich von anderen talentierten Entwicklern erstellt wurden. Pakete wie Superagent und Supertest stammen ursprünglich von TJ Holowaychuk, dessen umfangreiche Beiträge zu Open Source maßgeblich zur Gestaltung des Node.js-Ökosystems beigetragen haben.

### Eine Vogelperspektive unserer Wirkung {#a-birds-eye-view-of-our-impact}

Allein im zweimonatigen Zeitraum von Februar bis März 2025 verzeichneten die Top-Pakete, zu denen wir beitragen und die wir aufrechterhalten, atemberaubende Downloadzahlen:

* **[Superagent](https://www.npmjs.com/package/superagent)**: 84.575.829 Downloads [^7] (ursprünglich erstellt von TJ Holowaychuk)
* **[Supertest](https://www.npmjs.com/package/supertest)**: 76.432.591 Downloads [^8] (ursprünglich erstellt von TJ Holowaychuk)
* **[Auch](https://www.npmjs.com/package/koa)**: 28.539.295 Downloads [^34] (ursprünglich erstellt von TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11.007.327 Downloads [^35]
* **[Koa-Router](https://www.npmjs.com/package/koa-router)**: 3.498.918 Downloads [^36]
* **[URL-Regex](https://www.npmjs.com/package/url-regex)**: 2.819.520 Downloads [^37]
* **[Vorschau-E-Mail](https://www.npmjs.com/package/preview-email)**: 2.500.000 Downloads [^9]
* **[Kabine](https://www.npmjs.com/package/cabin)**: 1.800.000 Downloads [^10]
* **[@breejs/später](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 Downloads [^38]
* **[E-Mail-Vorlagen](https://www.npmjs.com/package/email-templates)**: 1.128.139 Downloads [^39]
* **__PROTECTED_LINK_259__0**: 1.124.686 Downloads [^40]
* **__PROTECTED_LINK_259__1**: 1.200.000 Downloads [^11]
* **__PROTECTED_LINK_259__2**: 894.666 Downloads [^41]
* **__PROTECTED_LINK_259__3**: 839.585 Downloads [^42]
* **__PROTECTED_LINK_259__4**: 145.000 Downloads\[^12]
* **__PROTECTED_LINK_259__5**: 24.270 Downloads\[^30]

> \[!NOTE]
> Mehrere andere Pakete, die wir mitgestalten, aber nicht selbst erstellt haben, haben sogar noch höhere Downloadzahlen, darunter `form-data` (über 738 Millionen Downloads), `toidentifier` (über 309 Millionen Downloads), `stackframe` (über 116 Millionen Downloads) und `error-stack-parser` (über 113 Millionen Downloads). Wir freuen uns, zu diesen Paketen beitragen zu dürfen und gleichzeitig die Arbeit ihrer ursprünglichen Autoren zu respektieren.

Das sind nicht nur beeindruckende Zahlen – sie repräsentieren echte Entwickler, die echte Probleme mit Code lösen, den wir pflegen. Jeder Download zeigt, wie diese Pakete jemandem geholfen haben, etwas Sinnvolles zu entwickeln – von Hobbyprojekten bis hin zu millionenfach genutzten Unternehmensanwendungen.

![Verteilung der Paketkategorien](/img/art/category_pie_chart.svg)

### Tägliche Wirkung im großen Maßstab {#daily-impact-at-scale}

Die täglichen Downloadmuster zeigen eine konstant hohe Nutzung mit Spitzenwerten von mehreren Millionen Downloads pro Tag[^13]. Diese Konsistenz spricht für die Stabilität und Zuverlässigkeit dieser Pakete – Entwickler testen sie nicht nur, sondern integrieren sie in ihre Kern-Workflows und verlassen sich Tag für Tag auf sie.

Die wöchentlichen Download-Muster zeigen sogar noch beeindruckendere Zahlen und bewegen sich konstant um die zehn Millionen Downloads pro Woche[^14]. Dies stellt einen massiven Einfluss auf das JavaScript-Ökosystem dar, da diese Pakete in Produktionsumgebungen weltweit laufen.

### Mehr als nur Zahlen {#beyond-the-raw-numbers}

Die Download-Statistiken sind zwar an sich schon beeindruckend, sie verraten aber auch viel über das Vertrauen, das die Community in diese Pakete setzt. Die Pflege von Paketen in dieser Größenordnung erfordert unermüdliches Engagement für:

* **Abwärtskompatibilität**: Änderungen müssen sorgfältig abgewogen werden, um bestehende Implementierungen nicht zu beeinträchtigen.
* **Sicherheit**: Da Millionen von Anwendungen von diesen Paketen abhängen, können Sicherheitslücken weitreichende Folgen haben.
* **Leistung**: In diesem Umfang können selbst geringfügige Leistungsverbesserungen erhebliche Gesamtvorteile bringen.
* **Dokumentation**: Eine klare und umfassende Dokumentation ist für Pakete, die von Entwicklern aller Erfahrungsstufen verwendet werden, unerlässlich.

Das stetige Wachstum der Downloadzahlen im Laufe der Zeit spiegelt den Erfolg bei der Erfüllung dieser Verpflichtungen wider und zeigt, dass durch zuverlässige, gut gepflegte Pakete Vertrauen in der Entwickler-Community aufgebaut wurde.

## Unterstützung des Ökosystems: Unsere Open-Source-Sponsorings {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Nachhaltigkeit bei Open Source bedeutet nicht nur, Code beizutragen, sondern auch die Entwickler zu unterstützen, die kritische Infrastrukturen pflegen.

Neben unseren direkten Beiträgen zum JavaScript-Ökosystem sind wir stolz darauf, prominente Node.js-Mitwirkende zu unterstützen, deren Arbeit die Grundlage vieler moderner Anwendungen bildet. Zu unseren Sponsorings gehören:

### Andris Reinman: Pionier der E-Mail-Infrastruktur {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) ist der Entwickler von [Nodemailer](https://github.com/nodemailer/nodemailer), der beliebtesten E-Mail-Versandbibliothek für Node.js mit über 14 Millionen wöchentlichen Downloads[^15]. Seine Arbeit erstreckt sich auch auf andere kritische E-Mail-Infrastrukturkomponenten wie [SMTP-Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) und [WildDuck](https://github.com/nodemailer/wildduck).

Unser Sponsoring trägt dazu bei, die kontinuierliche Wartung und Entwicklung dieser wichtigen Tools sicherzustellen, die die E-Mail-Kommunikation für unzählige Node.js-Anwendungen ermöglichen, einschließlich unseres eigenen Forward Email-Dienstes.

### Sindre Sorhus: Utility-Paket-Mastermind {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) ist einer der produktivsten Open-Source-Mitwirkenden im JavaScript-Ökosystem und hat über 1.000 npm-Pakete entwickelt. Seine Dienstprogramme wie [p-Karte](https://github.com/sindresorhus/p-map), [p-Wiederholung](https://github.com/sindresorhus/p-retry) und [is-stream](https://github.com/sindresorhus/is-stream) sind grundlegende Bausteine, die im gesamten Node.js-Ökosystem verwendet werden.

Indem wir Sindres Arbeit sponsern, tragen wir zur Entwicklung dieser wichtigen Dienstprogramme bei, die die JavaScript-Entwicklung effizienter und zuverlässiger machen.

Diese Sponsorings spiegeln unser Engagement für das Open-Source-Ökosystem wider. Wir sind uns bewusst, dass unser Erfolg auf dem Fundament dieser und anderer Mitwirkender beruht, und setzen uns für die Nachhaltigkeit des gesamten Ökosystems ein.

## Aufdecken von Sicherheitslücken im JavaScript-Ökosystem {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Unser Engagement für Open Source geht über die Funktionsentwicklung hinaus und umfasst auch die Identifizierung und Behebung von Sicherheitslücken, die Millionen von Entwicklern betreffen könnten. Einige unserer wichtigsten Beiträge zum JavaScript-Ökosystem liegen im Bereich Sicherheit.

### Die Koa-Router-Rettung {#the-koa-router-rescue}

Im Februar 2019 entdeckte Nick ein kritisches Problem bei der Wartung des beliebten Pakets koa-router. Wie er [berichtete auf Hacker News](https://news.ycombinator.com/item?id=19156707) nannte, wurde das Paket von seinem ursprünglichen Betreuer aufgegeben, wodurch Sicherheitslücken unbehoben blieben und die Community ohne Updates blieb.

> \[!WARNING]
> Verlassene Pakete mit Sicherheitslücken stellen ein erhebliches Risiko für das gesamte Ökosystem dar, insbesondere wenn sie wöchentlich millionenfach heruntergeladen werden.

Als Reaktion darauf erstellte Nick [@koa/router](https://github.com/koajs/router) und half, die Community auf die Situation aufmerksam zu machen. Seitdem pflegt er dieses wichtige Paket und stellt sicher, dass Koa-Benutzer über eine sichere und gut gepflegte Routing-Lösung verfügen.

### Beheben von ReDoS-Sicherheitslücken {#addressing-redos-vulnerabilities}

Im Jahr 2020 identifizierte und behob Nick eine kritische [Regulärer Ausdruck Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS)-Sicherheitslücke im weit verbreiteten `url-regex`-Paket. Diese Sicherheitslücke ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) könnte es Angreifern ermöglichen, einen Denial-of-Service-Angriff auszulösen, indem sie speziell gestaltete Eingaben bereitstellen, die zu katastrophalen Backtracking-Versuchen im regulären Ausdruck führen.

Anstatt einfach das bestehende Paket zu patchen, erstellte Nick [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), eine komplett neu geschriebene Implementierung, die die Schwachstelle behebt und gleichzeitig die Kompatibilität mit der ursprünglichen API aufrechterhält. Er veröffentlichte außerdem ein [umfassender Blogbeitrag](/blog/docs/url-regex-javascript-node-js), das die Schwachstelle und ihre Behebung erläutert.

Diese Arbeit zeigt unseren Sicherheitsansatz: Wir beheben nicht nur Probleme, sondern schulen die Community und bieten robuste Alternativen, die ähnliche Probleme in der Zukunft verhindern.

### Befürwortung der Sicherheit von Node.js und Chromium {#advocating-for-nodejs-and-chromium-security}

Nick engagiert sich auch aktiv für Sicherheitsverbesserungen im gesamten Ökosystem. Im August 2020 entdeckte er ein erhebliches Sicherheitsproblem in Node.js im Zusammenhang mit der Verarbeitung von HTTP-Headern, das in [Das Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) gemeldet wurde.

Dieses Problem, das auf einen Patch in Chromium zurückzuführen war, könnte es Angreifern ermöglichen, Sicherheitsmaßnahmen zu umgehen. Nicks Engagement trug dazu bei, dass das Problem umgehend behoben wurde und Millionen von Node.js-Anwendungen vor potenzieller Ausnutzung geschützt wurden.

### Sichern der npm-Infrastruktur {#securing-npm-infrastructure}

Später im selben Monat entdeckte Nick ein weiteres kritisches Sicherheitsproblem, diesmal in der E-Mail-Infrastruktur von npm. Wie in [Das Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) berichtet, implementierte npm die E-Mail-Authentifizierungsprotokolle DMARC, SPF und DKIM nicht ordnungsgemäß. Dies ermöglichte es Angreifern möglicherweise, Phishing-E-Mails zu versenden, die scheinbar von npm stammten.

Nicks Bericht führte zu Verbesserungen der E-Mail-Sicherheitslage von npm und schützte die Millionen von Entwicklern, die sich bei der Paketverwaltung auf npm verlassen, vor potenziellen Phishing-Angriffen.

## Unsere Beiträge zum Forward-E-Mail-Ökosystem {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email basiert auf mehreren wichtigen Open-Source-Projekten, darunter Nodemailer, WildDuck und Mailauth. Unser Team hat maßgeblich zu diesen Projekten beigetragen und dabei geholfen, schwerwiegende Probleme zu identifizieren und zu beheben, die die E-Mail-Zustellung und -Sicherheit beeinträchtigen.

### Verbesserung der Kernfunktionalität von Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) ist das Rückgrat des E-Mail-Versands in Node.js und unsere Beiträge haben dazu beigetragen, es robuster zu machen:

* **SMTP-Server-Verbesserungen**: Wir haben Parsing-Fehler, Probleme mit der Stream-Verarbeitung und TLS-Konfigurationsprobleme in der SMTP-Serverkomponente behoben\[^16]\[^17].
* **Mail-Parser-Verbesserungen**: Wir haben Fehler bei der Zeichenfolgendekodierung und Parser-Probleme behoben, die zu Fehlern bei der E-Mail-Verarbeitung führen konnten\[^18]\[^19].

Diese Beiträge stellen sicher, dass Nodemailer eine zuverlässige Grundlage für die E-Mail-Verarbeitung in Node.js-Anwendungen, einschließlich Forward Email, bleibt.

### E-Mail-Authentifizierung mit Mailauth verbessern {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) bietet wichtige Funktionen zur E-Mail-Authentifizierung und unsere Beiträge haben seine Fähigkeiten erheblich verbessert:

* **Verbesserungen bei der DKIM-Verifizierung**: Wir haben festgestellt und gemeldet, dass es bei X/Twitter Probleme mit dem DNS-Cache gab, die zu DKIM-Fehlern bei ausgehenden Nachrichten führten. Dies haben wir auf Hacker One gemeldet [^20].
* **Verbesserungen bei DMARC und ARC**: Wir haben Probleme bei der DMARC- und ARC-Verifizierung behoben, die zu falschen Authentifizierungsergebnissen führen konnten [^21] [^22].
* **Leistungsoptimierungen**: Wir haben Optimierungen vorgenommen, die die Leistung von E-Mail-Authentifizierungsprozessen verbessern [^23] [^24] [^25] [^26].

Diese Verbesserungen tragen dazu bei, dass die E-Mail-Authentifizierung genau und zuverlässig ist und Benutzer vor Phishing- und Spoofing-Angriffen geschützt sind.

### Wichtige Upptime-Verbesserungen {#key-upptime-enhancements}

Unsere Beiträge zu Upptime umfassen:

* **SSL-Zertifikatsüberwachung**: Wir haben eine Funktion zur Überwachung des Ablaufs von SSL-Zertifikaten hinzugefügt, um unerwartete Ausfallzeiten aufgrund abgelaufener Zertifikate zu vermeiden [^27].
* **Unterstützung mehrerer SMS-Nummern**: Wir haben die Möglichkeit implementiert, mehrere Teammitglieder bei Vorfällen per SMS zu benachrichtigen, um die Reaktionszeiten zu verbessern [^28].
* **Fehlerbehebungen bei IPv6-Prüfungen**: Wir haben Probleme mit IPv6-Konnektivitätsprüfungen behoben und gewährleisten so eine genauere Überwachung in modernen Netzwerkumgebungen [^29].
* **Unterstützung für Dunkel-/Hellmodus**: Wir haben Theme-Unterstützung hinzugefügt, um die Benutzerfreundlichkeit von Statusseiten zu verbessern [^31].
* **Verbesserte TCP-Ping-Unterstützung**: Wir haben die TCP-Ping-Funktionalität verbessert, um zuverlässigere Verbindungstests zu ermöglichen [^32].

Diese Verbesserungen kommen nicht nur der Statusüberwachung von Forward Email zugute, sondern stehen der gesamten Community der Upptime-Benutzer zur Verfügung und zeigen unser Engagement für die Verbesserung der Tools, auf die wir angewiesen sind.

## Der Klebstoff, der alles zusammenhält: Benutzerdefinierter Code im großen Maßstab {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Unsere npm-Pakete und Beiträge zu bestehenden Projekten sind zwar bedeutend, doch erst der benutzerdefinierte Code, der diese Komponenten integriert, zeigt unser technisches Know-how. Die Codebasis von Forward Email repräsentiert ein Jahrzehnt Entwicklungsarbeit und reicht bis ins Jahr 2017 zurück, als das Projekt als [kostenlose E-Mail-Weiterleitung](https://github.com/forwardemail/free-email-forwarding) begann und anschließend in ein Monorepo integriert wurde.

### Ein enormer Entwicklungsaufwand {#a-massive-development-effort}

Der Umfang dieses benutzerdefinierten Integrationscodes ist beeindruckend:

* **Gesamtbeiträge**: Über 3.217 Commits
* **Codebasisgröße**: Über 421.545 Codezeilen in JavaScript-, Pug-, CSS- und JSON-Dateien [^33]

Darin stecken Tausende Stunden Entwicklungsarbeit, Debugging-Sitzungen und Leistungsoptimierungen. Es ist die „geheime Zutat“, die aus einzelnen Paketen einen zusammenhängenden, zuverlässigen Dienst macht, den Tausende von Kunden täglich nutzen.

### Integration der Kernabhängigkeiten {#core-dependencies-integration}

Die Forward Email-Codebasis integriert zahlreiche Abhängigkeiten zu einem nahtlosen Ganzen:

* **E-Mail-Verarbeitung**: Integriert Nodemailer zum Senden, SMTP-Server zum Empfangen und Mailparser zum Parsen.
* **Authentifizierung**: Verwendet Mailauth für DKIM-, SPF-, DMARC- und ARC-Verifizierung.
* **DNS-Auflösung**: Nutzt Tangerine für DNS-over-HTTPS mit globalem Caching.
* **MX-Verbindung**: Nutzt mx-connect mit Tangerine-Integration für zuverlässige Mailserver-Verbindungen.
* **Jobplanung**: Nutzt Bree für die zuverlässige Verarbeitung von Hintergrundaufgaben mit Worker-Threads.
* **Templating**: Verwendet E-Mail-Vorlagen, um Stylesheets der Website in der Kundenkommunikation wiederzuverwenden.
* **E-Mail-Speicher**: Implementiert individuell verschlüsselte SQLite-Postfächer mit better-sqlite3-multiple-ciphers und ChaCha20-Poly1305-Verschlüsselung für quantensicheren Datenschutz. Dadurch wird die vollständige Isolierung der Benutzer gewährleistet und sichergestellt, dass nur der Benutzer Zugriff auf sein Postfach hat.

Jede dieser Integrationen erfordert eine sorgfältige Berücksichtigung von Randfällen, Leistungseinbußen und Sicherheitsbedenken. Das Ergebnis ist ein robustes System, das Millionen von E-Mail-Transaktionen zuverlässig abwickelt. Unsere SQLite-Implementierung nutzt außerdem msgpackr für eine effiziente binäre Serialisierung und WebSockets (über WS) für Echtzeit-Statusaktualisierungen unserer gesamten Infrastruktur.

### DNS-Infrastruktur mit Tangerine und mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Eine kritische Komponente der Infrastruktur von Forward Email ist unser DNS-Auflösungssystem, das auf zwei Schlüsselpaketen basiert:

* **[Mandarine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Unsere Node.js DNS-over-HTTPS-Implementierung bietet einen Drop-In-Ersatz für den Standard-DNS-Resolver mit integrierten Wiederholungsversuchen, Timeouts, intelligenter Serverrotation und Caching-Unterstützung.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Dieses Paket stellt TCP-Verbindungen zu MX-Servern her, indem es eine Zieldomäne oder E-Mail-Adresse übernimmt, entsprechende MX-Server auflöst und in der Reihenfolge ihrer Priorität eine Verbindung zu ihnen herstellt.

Wir haben Tangerine über [Pull Request #4](https://github.com/zone-eu/mx-connect/pull/4), wodurch DNS-over-HTTP-Anfragen auf Anwendungsebene in Forward Email sichergestellt werden. Dies ermöglicht globales DNS-Caching im großen Maßstab mit 1:1-Konsistenz über alle Regionen, Anwendungen und Prozesse hinweg – entscheidend für die zuverlässige E-Mail-Zustellung in einem verteilten System.

## Auswirkungen auf Unternehmen: Von Open Source zu unternehmenskritischen Lösungen {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Dank unserer jahrzehntelangen Erfahrung in der Open-Source-Entwicklung kann Forward Email nicht nur einzelne Entwickler, sondern auch große Unternehmen und Bildungseinrichtungen bedienen, die das Rückgrat der Open-Source-Bewegung bilden.

### Fallstudien zu unternehmenskritischer E-Mail-Infrastruktur {#case-studies-in-mission-critical-email-infrastructure}

Unser Engagement für Zuverlässigkeit, Datenschutz und Open-Source-Prinzipien hat Forward Email zur vertrauenswürdigen Wahl für Unternehmen mit hohen E-Mail-Anforderungen gemacht:

* **Bildungseinrichtungen**: Wie in unserer Fallstudie zur E-Mail-Weiterleitung von Alumni beschrieben](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study) mit mx-connect integriert. Große Universitäten verlassen sich auf unsere Infrastruktur, um über zuverlässige E-Mail-Weiterleitungsdienste lebenslange Verbindungen zu Hunderttausenden von Alumni aufrechtzuerhalten.

* **Enterprise-Linux-Lösungen**: Der [Canonical Ubuntu E-Mail Enterprise-Fallstudie](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) zeigt, wie unser Open-Source-Ansatz perfekt auf die Anforderungen von Enterprise-Linux-Anbietern abgestimmt ist und ihnen die Transparenz und Kontrolle bietet, die sie benötigen.

* **Open Source Foundations**: Die größte Bestätigung bietet vielleicht unsere Partnerschaft mit der Linux Foundation, wie im [Fallstudie zur E-Mail-Unternehmensentwicklung der Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study) dokumentiert, wo unser Dienst die Kommunikation für genau die Organisation ermöglicht, die die Linux-Entwicklung verwaltet.

Es ist eine wunderbare Symmetrie, wie unsere über viele Jahre hinweg sorgfältig gepflegten Open-Source-Pakete es uns ermöglicht haben, einen E-Mail-Dienst aufzubauen, der nun genau die Communities und Organisationen unterstützt, die sich für Open-Source-Software einsetzen. Dieser umfassende Weg – vom Bereitstellen einzelner Pakete bis hin zur Bereitstellung einer unternehmenstauglichen E-Mail-Infrastruktur für Open-Source-Vorreiter – stellt die ultimative Bestätigung unseres Softwareentwicklungsansatzes dar.

## Ein Jahrzehnt Open Source: Ein Blick in die Zukunft {#a-decade-of-open-source-looking-forward}

Wenn wir auf ein Jahrzehnt voller Open-Source-Beiträge zurückblicken und auf die nächsten zehn Jahre blicken, sind wir voller Dankbarkeit gegenüber der Community, die unsere Arbeit unterstützt hat, und voller Vorfreude auf das, was noch kommt.

Unser Weg vom einzelnen Paketentwickler zum Betreuer einer umfassenden E-Mail-Infrastruktur, die von großen Unternehmen und Open-Source-Stiftungen genutzt wird, war bemerkenswert. Er ist ein Beweis für die Leistungsfähigkeit der Open-Source-Entwicklung und den Einfluss, den durchdachte, gut gepflegte Software auf das gesamte Ökosystem haben kann.

In den kommenden Jahren haben wir uns verpflichtet:

* **Kontinuierliche Pflege und Verbesserung unserer bestehenden Pakete**, um sicherzustellen, dass sie weiterhin zuverlässige Tools für Entwickler weltweit bleiben.
* **Ausbau unserer Beiträge zu kritischen Infrastrukturprojekten**, insbesondere in den Bereichen E-Mail und Sicherheit.
* **Verbesserung der Funktionen von Forward Email** unter Beibehaltung unseres Engagements für Datenschutz, Sicherheit und Transparenz.
* **Unterstützung der nächsten Generation von Open-Source-Mitwirkenden** durch Mentoring, Sponsoring und Community-Engagement.

Wir glauben, dass die Zukunft der Softwareentwicklung offen, kollaborativ und auf Vertrauen basiert. Indem wir weiterhin hochwertige, sicherheitsorientierte Pakete zum JavaScript-Ökosystem beitragen, hoffen wir, einen kleinen Beitrag zur Gestaltung dieser Zukunft zu leisten.

Vielen Dank an alle, die unsere Pakete genutzt, zu unseren Projekten beigetragen, Probleme gemeldet oder einfach nur unsere Arbeit weiterempfohlen haben. Ihre Unterstützung hat dieses Jahrzehnt der Wirkung ermöglicht, und wir sind gespannt, was wir in den nächsten zehn Jahren gemeinsam erreichen können.

\[^1]: NPM-Download-Statistik für cabin, April 2025
\[^2]: NPM-Download-Statistik für bson-objectid, Februar-März 2025
\[^3]: NPM-Download-Statistik für url-regex-safe, April 2025
\[^4]: GitHub-Sterne-Anzahl für forwardemail/forwardemail.net (Stand: April 2025)
\[^5]: NPM-Download-Statistik für preview-email, April 2025
\[^7]: NPM-Download-Statistik für superagent, Februar-März 2025
\[^8]: NPM-Download-Statistik für supertest, Februar-März 2025
\[^9]: NPM-Download-Statistik für preview-email, Februar-März 2025
\[^10]: NPM-Download-Statistik für cabin, Februar-März 2025
\[^11]: NPM Download-Statistiken für URL-Regex-sicher, Februar/März 2025
\[^12]: NPM-Download-Statistiken für Spamscanner, Februar/März 2025
\[^13]: Tägliche Download-Muster aus NPM-Statistiken, April 2025
\[^14]: Wöchentliche Download-Muster aus NPM-Statistiken, April 2025
\[^15]: NPM-Download-Statistiken für Nodemailer, April 2025
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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Basierend auf GitHub-Problemen im Upptime-Repository
\[^28]: Basierend auf GitHub-Problemen im Upptime-Repository
\[^29]: Basierend auf GitHub-Problemen im Upptime-Repository
\[^30]: NPM-Download-Statistiken für Bree, Februar-März 2025
\[^31]: Basierend auf GitHub-Pull-Requests an Upptime
\[^32]: Basierend auf GitHub-Pull-Requests an Upptime
\[^34]: NPM-Download-Statistiken für Koa, Februar-März 2025
\[^35]: NPM-Download Statistiken für @koa/router, Februar-März 2025
\[^36]: NPM-Download-Statistiken für koa-router, Februar-März 2025
\[^37]: NPM-Download-Statistiken für url-regex, Februar-März 2025
\[^38]: NPM-Download-Statistiken für @breejs/later, Februar-März 2025
\[^39]: NPM-Download-Statistiken für email-templates, Februar-März 2025
\[^40]: NPM-Download-Statistiken für get-paths, Februar-März 2025
\[^41]: NPM-Download-Statistiken für dotenv-parse-variables, Februar-März 2025
\[^42]: NPM-Download-Statistiken für @koa/multer, Februar-März 2025