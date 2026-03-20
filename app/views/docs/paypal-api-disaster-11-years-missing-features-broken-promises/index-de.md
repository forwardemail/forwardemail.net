# PayPals 11-jähriges API-Desaster: Wie wir Workarounds bauten, während sie Entwickler ignorierten {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Erfolg! PayPal hat endlich den `GET /v1/billing/subscriptions` Endpunkt hinzugefügt.**
>
> Nachdem wir diesen Beitrag veröffentlicht und an die Führungsebene von PayPal gemailt hatten, implementierten ihre Teams den dringend benötigten Endpunkt zur Auflistung von Abonnements. Die Änderung erschien irgendwann zwischen dem [25. Juni 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) und dem [9. Juli 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Allerdings, ganz im typischen PayPal-Stil, wurden wir nie benachrichtigt. Wir entdeckten dieses Update erst im Dezember 2025 selbst, Monate nachdem die Funktion still veröffentlicht wurde.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Bei Forward Email beschäftigen wir uns seit über einem Jahrzehnt mit den kaputten APIs von PayPal. Was als kleine Frustrationen begann, entwickelte sich zu einem kompletten Desaster, das uns zwang, eigene Workarounds zu bauen, ihre Phishing-Vorlagen zu blockieren und letztlich alle PayPal-Zahlungen während einer kritischen Kontomigration zu stoppen.</p>
<p class="lead mt-3">Dies ist die Geschichte von 11 Jahren, in denen PayPal grundlegende Entwicklerbedürfnisse ignorierte, während wir alles versuchten, um ihre Plattform zum Laufen zu bringen.</p>


## Inhaltsverzeichnis {#table-of-contents}

* [Das fehlende Stück: Keine Möglichkeit, Abonnements aufzulisten](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Das Problem taucht auf](#2014-2017-the-problem-emerges)
* [2020: Wir geben umfangreiches Feedback](#2020-we-give-them-extensive-feedback)
  * [Die 27-Punkte-Feedback-Liste](#the-27-item-feedback-list)
  * [Teams wurden involviert, Versprechen wurden gemacht](#teams-got-involved-promises-were-made)
  * [Das Ergebnis? Nichts.](#the-result-nothing)
* [Der Exodus der Führungsebene: Wie PayPal jegliches institutionelles Wissen verlor](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Neue Führung, gleiche Probleme](#2025-new-leadership-same-problems)
  * [Der neue CEO mischt sich ein](#the-new-ceo-gets-involved)
  * [Michelle Gills Antwort](#michelle-gills-response)
  * [Unsere Antwort: Keine weiteren Meetings](#our-response-no-more-meetings)
  * [Marty Brodbecks Überengineering-Antwort](#marty-brodbecks-overengineering-response)
  * [Der Widerspruch des „einfachen CRUD“](#the-simple-crud-contradiction)
  * [Die Diskrepanz wird klar](#the-disconnect-becomes-clear)
* [Jahre von Bug-Reports, die ignoriert wurden](#years-of-bug-reports-they-ignored)
  * [2016: Frühe UI/UX-Beschwerden](#2016-early-uiux-complaints)
  * [2021: Bug-Report zum Business-E-Mail](#2021-business-email-bug-report)
  * [2021: Vorschläge zur UI-Verbesserung](#2021-ui-improvement-suggestions)
  * [2021: Sandbox-Umgebungsausfälle](#2021-sandbox-environment-failures)
  * [2021: Berichtssystem komplett kaputt](#2021-reports-system-completely-broken)
  * [2022: Kern-API-Funktion fehlt (wieder)](#2022-core-api-feature-missing-again)
* [Der Albtraum der Entwicklererfahrung](#the-developer-experience-nightmare)
  * [Kaputte Benutzeroberfläche](#broken-user-interface)
  * [SDK-Probleme](#sdk-problems)
  * [Verstöße gegen die Content Security Policy](#content-security-policy-violations)
  * [Dokumentationschaos](#documentation-chaos)
  * [Sicherheitslücken](#security-vulnerabilities)
  * [Katastrophe im Sitzungsmanagement](#session-management-disaster)
* [Juli 2025: Der letzte Tropfen](#july-2025-the-final-straw)
* [Warum wir PayPal nicht einfach fallen lassen können](#why-we-cant-just-drop-paypal)
* [Der Community-Workaround](#the-community-workaround)
* [Blockierung von PayPal-Vorlagen wegen Phishing](#blocking-paypal-templates-due-to-phishing)
  * [Das eigentliche Problem: PayPals Vorlagen sehen aus wie Betrug](#the-real-problem-paypals-templates-look-like-scams)
  * [Unsere Umsetzung](#our-implementation)
  * [Warum wir PayPal blockieren mussten](#why-we-had-to-block-paypal)
  * [Das Ausmaß des Problems](#the-scale-of-the-problem)
  * [Die Ironie](#the-irony)
  * [Reale Auswirkungen: Neue PayPal-Betrugsmaschen](#real-world-impact-novel-paypal-scams)
* [PayPals rückwärtsgewandter KYC-Prozess](#paypals-backwards-kyc-process)
  * [Wie es funktionieren sollte](#how-it-should-work)
  * [Wie PayPal tatsächlich funktioniert](#how-paypal-actually-works)
  * [Die realen Auswirkungen](#the-real-world-impact)
  * [Die Kontomigrationskatastrophe im Juli 2025](#the-july-2025-account-migration-disaster)
  * [Warum das wichtig ist](#why-this-matters)
* [Wie jeder andere Zahlungsanbieter es richtig macht](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Der Industriestandard](#the-industry-standard)
  * [Was andere Anbieter bieten vs. PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematische Vertuschung: 6 Millionen Stimmen zum Schweigen bringen](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Das große Auslöschen](#the-great-erasure)
  * [Die Rettung durch Dritte](#the-third-party-rescue)
* [Das 11-jährige Capture-Bug-Desaster: 1.899 $ und es geht weiter](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Emails Verlust von 1.899 $](#forward-emails-1899-loss)
  * [Der ursprüngliche Bericht von 2013: 11+ Jahre Vernachlässigung](#the-2013-original-report-11-years-of-negligence)
  * [Das Eingeständnis von 2016: PayPal zerstört sein eigenes SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Die Eskalation 2024: Immer noch kaputt](#the-2024-escalation-still-broken)
  * [Die Katastrophe der Webhook-Zuverlässigkeit](#the-webhook-reliability-disaster)
  * [Das Muster systematischer Vernachlässigung](#the-pattern-of-systematic-negligence)
  * [Die undokumentierte Anforderung](#the-undocumented-requirement)
* [PayPals breiteres Täuschungsmuster](#paypals-broader-pattern-of-deception)
  * [Die Aktion des New Yorker Finanzdienstleistungsamts](#the-new-york-department-of-financial-services-action)
  * [Die Honey-Klage: Umschreiben von Affiliate-Links](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Die Kosten von PayPals Nachlässigkeit](#the-cost-of-paypals-negligence)
  * [Die Dokumentationslüge](#the-documentation-lie)
* [Was das für Entwickler bedeutet](#what-this-means-for-developers)
## Das fehlende Stück: Keine Möglichkeit, Abonnements aufzulisten {#the-missing-piece-no-way-to-list-subscriptions}

Hier ist das, was uns umhaut: PayPal bietet seit 2014 Abonnementabrechnung an, aber sie haben nie eine Möglichkeit bereitgestellt, damit Händler ihre eigenen Abonnements auflisten können.

Denk mal kurz darüber nach. Du kannst Abonnements erstellen, du kannst sie kündigen, wenn du die ID hast, aber du kannst keine Liste aller aktiven Abonnements für dein Konto erhalten. Es ist, als hätte man eine Datenbank ohne SELECT-Anweisung.

Wir brauchen das für grundlegende Geschäftsabläufe:

* Kundensupport (wenn jemand per E-Mail wegen seines Abonnements anfragt)
* Finanzberichterstattung und Abstimmung
* Automatisiertes Abrechnungsmanagement
* Compliance und Prüfung

Aber PayPal? Die haben es einfach... nie gebaut.


## 2014-2017: Das Problem taucht auf {#2014-2017-the-problem-emerges}

Das Problem mit der Abonnementauflistung tauchte erstmals 2017 in den PayPal-Community-Foren auf. Entwickler stellten die offensichtliche Frage: „Wie bekomme ich eine Liste aller meiner Abonnements?“

PayPals Antwort? Schweigen.

Community-Mitglieder wurden zunehmend frustriert:

> „Sehr merkwürdiges Versäumnis, wenn ein Händler nicht alle aktiven Vereinbarungen auflisten kann. Wenn die Vereinbarungs-ID verloren geht, bedeutet das, dass nur der Nutzer eine Vereinbarung kündigen oder aussetzen kann.“ – leafspider

> „+1. Es sind fast 3 Jahre.“ – laudukang (was bedeutet, dass das Problem seit ca. 2014 besteht)

Der [ursprüngliche Community-Beitrag](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) von 2017 zeigt Entwickler, die um diese grundlegende Funktionalität bitten. PayPals Reaktion war, das Repository zu archivieren, in dem die Probleme gemeldet wurden.


## 2020: Wir geben umfangreiches Feedback {#2020-we-give-them-extensive-feedback}

Im Oktober 2020 hat PayPal uns für eine formelle Feedback-Sitzung kontaktiert. Das war kein lockeres Gespräch – sie organisierten einen 45-minütigen Microsoft Teams-Anruf mit 8 PayPal-Führungskräften, darunter Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze und andere.

### Die 27-Punkte-Feedback-Liste {#the-27-item-feedback-list}

Wir waren vorbereitet. Nach 6 Stunden Versuch, ihre APIs zu integrieren, hatten wir 27 spezifische Probleme zusammengestellt. Mark Stuart vom PayPal Checkout-Team sagte:

> Hey Nick, danke, dass du heute mit allen geteilt hast! Ich denke, das wird der Auslöser sein, um mehr Unterstützung und Investitionen für unser Team zu bekommen, damit wir diese Dinge beheben können. Es war schwierig, so fundiertes Feedback zu bekommen wie das, was du uns bisher gegeben hast.

Das Feedback war nicht theoretisch – es kam aus echten Integrationsversuchen:

1. **Zugriffstoken-Generierung funktioniert nicht**:

> Die Zugriffstoken-Generierung funktioniert nicht. Außerdem sollte es mehr als nur cURL-Beispiele geben.

2. **Keine Web-Oberfläche zur Erstellung von Abonnements**:

> Wie zum Teufel soll man Abonnements erstellen, ohne cURL zu benutzen? Es scheint keine Web-Oberfläche dafür zu geben (wie Stripe sie hat).

Mark Stuart fand das Problem mit der Zugriffstoken-Generierung besonders besorgniserregend:

> Normalerweise hören wir nicht von Problemen bei der Zugriffstoken-Generierung.

### Teams wurden eingebunden, Versprechen gemacht {#teams-got-involved-promises-were-made}

Als wir weitere Probleme entdeckten, fügte PayPal immer mehr Teams zum Gespräch hinzu. Darshan Raju vom Team für die Verwaltung der Abonnements-UI kam hinzu und sagte:

> Wir erkennen die Lücke an. Wir werden das verfolgen und beheben. Nochmals danke für dein Feedback!

Die Sitzung wurde als eine

> offene Durchsicht deiner Erfahrungen

beschrieben, um

> PayPal zu dem zu machen, was es für Entwickler sein sollte.

### Das Ergebnis? Nichts. {#the-result-nothing}

Trotz der formellen Feedback-Sitzung, der umfangreichen 27-Punkte-Liste, der Beteiligung mehrerer Teams und der Versprechen,

> das zu verfolgen und zu beheben,

wurde absolut nichts behoben.


## Der Exodus der Führungskräfte: Wie PayPal das gesamte institutionelle Wissen verlor {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Hier wird es richtig interessant. Jede einzelne Person, die unser Feedback von 2020 erhalten hat, hat PayPal verlassen:

**Führungswechsel:**

* [Dan Schulman (CEO für 9 Jahre) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (September 2023)
* [Sri Shivananda (CTO, der das Feedback organisiert hat) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Januar 2024)
**Technische Führungskräfte, die Versprechen machten und dann gingen:**

* **Mark Stuart** (versprach, dass Feedback ein "Katalysator" sein würde) → [Jetzt bei Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-jähriger PayPal-Veteran) → [CEO von MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Im Ruhestand](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (einer der letzten Verbliebenen) → [Gerade zu Nasdaq gewechselt](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Januar 2025)

PayPal ist zu einer Drehtür geworden, bei der Führungskräfte Entwicklerfeedback sammeln, Versprechen machen und dann zu besseren Unternehmen wie JPMorgan, Ripple und anderen Fintech-Firmen wechseln.

Das erklärt, warum die Antwort auf das GitHub-Issue 2025 völlig losgelöst von unserem Feedback aus 2020 wirkte – buchstäblich jeder, der dieses Feedback erhalten hatte, hat PayPal verlassen.


## 2025: Neue Führung, gleiche Probleme {#2025-new-leadership-same-problems}

Schneller Vorlauf ins Jahr 2025, und dasselbe Muster zeigt sich erneut. Nach Jahren ohne Fortschritt meldet sich die neue Führung von PayPal wieder.

### Der neue CEO mischt sich ein {#the-new-ceo-gets-involved}

Am 30. Juni 2025 haben wir direkt den neuen PayPal-CEO Alex Chriss kontaktiert. Seine Antwort war kurz:

> Hi Nick – Danke, dass du dich gemeldet hast und für das Feedback. Michelle (im cc) ist mit ihrem Team zuständig, um sich mit dir auszutauschen und das zu bearbeiten. Danke -A

### Michelles Gills Antwort {#michelle-gills-response}

Michelle Gill, EVP und General Manager für Small Business und Financial Services, antwortete:

> Vielen Dank, Nick, ich setze Alex in Bcc. Wir beschäftigen uns seit deinem früheren Beitrag damit. Wir rufen dich an, bevor die Woche vorbei ist. Kannst du mir bitte deine Kontaktdaten schicken, damit sich einer meiner Kollegen melden kann. Michelle

### Unsere Antwort: Keine weiteren Meetings {#our-response-no-more-meetings}

Wir lehnten ein weiteres Meeting ab und erklärten unsere Frustration:

> Danke. Allerdings habe ich nicht das Gefühl, dass ein Anruf etwas bewirken wird. Hier ist warum... Ich hatte in der Vergangenheit einen Anruf und es führte zu absolut nichts. Ich habe über 2 Stunden meiner Zeit damit verschwendet, mit dem gesamten Team und der Führung zu sprechen, und es wurde nichts erledigt... Unzählige E-Mails hin und her. Absolut nichts erledigt. Feedback ging ins Leere. Ich habe jahrelang versucht, gehört zu werden, und dann passiert nichts.

### Marty Brodbecks Überengineering-Antwort {#marty-brodbecks-overengineering-response}

Dann meldete sich Marty Brodbeck, der die Consumer-Entwicklung bei PayPal leitet:

> Hi Nick, hier ist Marty Brodbeck. Ich leite die gesamte Consumer-Entwicklung hier bei PayPal und habe die API-Entwicklung für das Unternehmen vorangetrieben. Können wir uns über das Problem, das du hast, austauschen und wie wir hier helfen können?

Als wir den einfachen Bedarf an einem Endpunkt für die Auflistung von Abonnements erklärten, offenbarte seine Antwort genau das Problem:

> Danke Nick, wir sind dabei, eine einzelne Subscription-API mit vollständigem SDK zu erstellen (unterstützt vollständige Fehlerbehandlung, ereignisbasierte Abonnementverfolgung, robuste Verfügbarkeit), wobei die Abrechnung auch als separate API für Händler ausgelagert wird, damit diese nicht über mehrere Endpunkte orchestrieren müssen, um eine einzige Antwort zu erhalten.

Das ist genau der falsche Ansatz. Wir brauchen keine monatelange komplexe Architektur. Wir brauchen einen einfachen REST-Endpunkt, der Abonnements auflistet – etwas, das es seit 2014 geben sollte.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Der Widerspruch zum "einfachen CRUD" {#the-simple-crud-contradiction}

Als wir darauf hinwiesen, dass dies grundlegende CRUD-Funktionalität ist, die es seit 2014 geben sollte, war Martys Antwort aufschlussreich:

> Einfache CRUD-Operationen sind Teil der Kern-API, mein Freund, daher wird die Entwicklung nicht Monate dauern

Das PayPal TypeScript SDK, das nach monatelanger Entwicklung derzeit nur drei Endpunkte unterstützt, zusammen mit seinem historischen Zeitverlauf, zeigt deutlich, dass solche Projekte mehr als ein paar Monate benötigen.
Diese Antwort zeigt, dass er seine eigene API nicht versteht. Wenn „einfache CRUD-Operationen Teil der Kern-API sind“, wo ist dann der Endpunkt zur Auflistung von Abonnements? Wir antworteten:

> Wenn „einfache CRUD-Operationen Teil der Kern-API sind“, wo ist dann der Endpunkt zur Auflistung von Abonnements? Entwickler fordern diese „einfache CRUD-Operation“ seit 2014. Es sind 11 Jahre vergangen. Jeder andere Zahlungsanbieter hat diese Grundfunktionalität seit dem ersten Tag.

### Die Diskrepanz wird deutlich {#the-disconnect-becomes-clear}

Die Austausche im Jahr 2025 mit Alex Chriss, Michelle Gill und Marty Brodbeck zeigen dieselbe organisatorische Dysfunktion:

1. **Die neue Führung hat keine Kenntnis von vorherigen Feedback-Sitzungen**
2. **Sie schlagen dieselben überkomplizierten Lösungen vor**
3. **Sie verstehen die eigenen API-Beschränkungen nicht**
4. **Sie wollen mehr Meetings statt das Problem einfach zu beheben**

Dieses Muster erklärt, warum die PayPal-Teams im Jahr 2025 scheinbar völlig von dem umfangreichen Feedback aus 2020 abgeschnitten sind – die Personen, die dieses Feedback erhalten haben, sind nicht mehr da, und die neue Führung wiederholt dieselben Fehler.


## Jahre von Bug-Reports, die ignoriert wurden {#years-of-bug-reports-they-ignored}

Wir haben uns nicht nur über fehlende Funktionen beschwert. Wir haben aktiv Bugs gemeldet und versucht, bei der Verbesserung zu helfen. Hier ist eine umfassende Zeitleiste der dokumentierten Probleme:

### 2016: Frühe UI/UX-Beschwerden {#2016-early-uiux-complaints}

Schon 2016 haben wir öffentlich die PayPal-Führung, einschließlich Dan Schulman, auf Interface-Probleme und Usability-Schwächen aufmerksam gemacht. Das war vor 9 Jahren, und dieselben UI/UX-Probleme bestehen bis heute.

### 2021: Bug-Report zum Geschäftsemail-System {#2021-business-email-bug-report}

Im März 2021 meldeten wir, dass das Geschäftsemail-System von PayPal falsche Stornierungsbenachrichtigungen versendet. Die E-Mail-Vorlage enthielt falsch gerenderte Variablen, die den Kunden verwirrende Nachrichten zeigten.

Mark Stuart bestätigte das Problem:

> Danke Nick! Wechsel zu BCC. @Prasy, ist dein Team für diese E-Mail verantwortlich oder weißt du, wer es ist? Das „Niftylettuce, LLC, wir werden dich nicht mehr belasten“ lässt mich vermuten, dass es eine Verwechslung gibt, an wen die E-Mail gerichtet ist und was ihr Inhalt ist.

**Ergebnis**: Diesen Fehler haben sie tatsächlich behoben! Mark Stuart bestätigte:

> Gerade von den Benachrichtigungsteams gehört, dass die E-Mail-Vorlage korrigiert und ausgerollt wurde. Danke, dass du dich gemeldet hast. Vielen Dank!

Das zeigt, dass sie Dinge beheben KÖNNEN, wenn sie wollen – sie entscheiden sich nur meistens dagegen.

### 2021: Vorschläge zur UI-Verbesserung {#2021-ui-improvement-suggestions}

Im Februar 2021 gaben wir detailliertes Feedback zur Dashboard-Benutzeroberfläche, speziell zum Abschnitt „PayPal Recent Activity“:

> Ich denke, das Dashboard auf paypal.com, speziell „PayPal Recent Activity“, muss verbessert werden. Ich finde, man sollte die $0 wiederkehrenden Zahlungen mit dem Status „Created“ nicht anzeigen – das fügt einfach viele zusätzliche Zeilen hinzu und man kann nicht auf einen Blick sehen, wie viel Einkommen an dem Tag bzw. in den letzten Tagen generiert wurde.

Mark Stuart leitete es an das Consumer-Products-Team weiter:

> Danke! Ich weiß nicht, welches Team für Activity zuständig ist, aber ich habe es an den Leiter der Consumer Products weitergeleitet, um das richtige Team zu finden. Eine wiederkehrende Zahlung von $0,00 scheint ein Bug zu sein. Sollte wahrscheinlich herausgefiltert werden.

**Ergebnis**: Nie behoben. Die UI zeigt diese nutzlosen $0-Einträge immer noch an.

### 2021: Ausfälle der Sandbox-Umgebung {#2021-sandbox-environment-failures}

Im November 2021 meldeten wir kritische Probleme mit der Sandbox-Umgebung von PayPal:

* Sandbox-Secret-API-Schlüssel wurden zufällig geändert und deaktiviert
* Alle Sandbox-Testkonten wurden ohne Vorwarnung gelöscht
* Fehlermeldungen beim Versuch, Sandbox-Kontodetails anzusehen
* Intermittierende Ladefehler

> Aus irgendeinem Grund wurde mein Sandbox-Secret-API-Schlüssel geändert und deaktiviert. Außerdem wurden alle meine alten Sandbox-Testkonten gelöscht.

> Manchmal laden sie und manchmal nicht. Das ist extrem frustrierend.

**Ergebnis**: Keine Antwort, keine Behebung. Entwickler haben weiterhin Probleme mit der Zuverlässigkeit der Sandbox.

### 2021: Berichtssystem komplett defekt {#2021-reports-system-completely-broken}
Im Mai 2021 berichteten wir, dass das Download-System von PayPal für Transaktionsberichte komplett kaputt war:

> Es scheint, dass das Herunterladen von Berichten gerade nicht funktioniert und den ganzen Tag nicht funktioniert hat. Außerdem sollte man wahrscheinlich eine E-Mail-Benachrichtigung erhalten, wenn es fehlschlägt.

Wir wiesen auch auf das Desaster im Sitzungsmanagement hin:

> Außerdem wirst du ausgeloggt, wenn du etwa 5 Minuten inaktiv bist, während du bei PayPal eingeloggt bist. Wenn du dann den Button neben dem Bericht, dessen Status du überprüfen möchtest, erneut aktualisierst (nachdem du ewig gewartet hast), ist es eine Qual, sich wieder einzuloggen.

Mark Stuart bestätigte das Problem mit dem Sitzungs-Timeout:

> Ich erinnere mich, dass du das in der Vergangenheit gemeldet hast, dass deine Sitzung oft abläuft und deinen Entwicklungsfluss stört, während du zwischen deiner IDE und developer.paypal.com oder deinem Händler-Dashboard wechselst, und dann kommst du zurück und bist wieder ausgeloggt.

**Ergebnis**: Sitzungs-Timeouts sind immer noch 60 Sekunden. Das Berichtssystem fällt weiterhin regelmäßig aus.

### 2022: Kern-API-Funktion fehlt (wieder) {#2022-core-api-feature-missing-again}

Im Januar 2022 eskalierten wir das Problem mit der Auflistung von Abonnements erneut, diesmal mit noch mehr Details darüber, wie falsch deren Dokumentation war:

> Es gibt kein GET, das alle Abonnements auflistet (früher als Abrechnungsvereinbarungen bezeichnet)

Wir entdeckten, dass ihre offizielle Dokumentation komplett ungenau war:

> Die API-Dokumentation ist ebenfalls völlig ungenau. Wir dachten, wir könnten einen Workaround machen, indem wir eine fest codierte Liste von Abonnement-IDs herunterladen. Aber das funktioniert nicht einmal!

> Aus der offiziellen Dokumentation hier... Es steht, dass man das machen kann... Der Clou ist – es gibt überhaupt kein "Subscription ID"-Feld, das man abhaken könnte.

Christina Monti von PayPal antwortete:

> Entschuldigen Sie die Frustrationen, die durch diese falschen Schritte verursacht wurden, wir werden das diese Woche beheben.

Sri Shivananda (CTO) dankte uns:

> Danke für eure fortwährende Hilfe, uns zu verbessern. Sehr geschätzt.

**Ergebnis**: Die Dokumentation wurde nie korrigiert. Der Endpunkt zur Auflistung von Abonnements wurde nie erstellt.


## Der Albtraum der Entwicklererfahrung {#the-developer-experience-nightmare}

Die Arbeit mit den PayPal-APIs ist wie eine Zeitreise vor 10 Jahre. Hier sind die technischen Probleme, die wir dokumentiert haben:

### Kaputte Benutzeroberfläche {#broken-user-interface}

Das PayPal-Entwickler-Dashboard ist eine Katastrophe. Hiermit haben wir täglich zu kämpfen:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Die UI von PayPal ist so kaputt, dass man nicht einmal Benachrichtigungen wegklicken kann
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Das Entwickler-Dashboard zwingt dich buchstäblich, einen Schieberegler zu ziehen, und loggt dich dann nach 60 Sekunden aus
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Weitere UI-Desaster in der PayPal-Entwickleroberfläche, die kaputte Workflows zeigen
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Die Abonnement-Verwaltungsoberfläche – die Oberfläche ist so schlecht, dass wir auf Code angewiesen waren, um Produkte und Abonnementpläne zu erstellen
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Eine Ansicht der kaputten Abonnement-Oberfläche mit fehlender Funktionalität (du kannst nicht einfach Produkte/Pläne/Abonnements erstellen – und es scheint überhaupt keine Möglichkeit zu geben, Produkte oder Pläne nach der Erstellung in der UI zu löschen)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typische PayPal-Fehlermeldungen – kryptisch und wenig hilfreich
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-Probleme {#sdk-problems}

* Kann nicht sowohl Einmalzahlungen als auch Abonnements ohne komplexe Umgehungslösungen handhaben, die das Austauschen und Neurendern von Buttons beim erneuten Laden des SDK mit Skript-Tags erfordern
* JavaScript SDK verstößt gegen grundlegende Konventionen (Klassennamen in Kleinbuchstaben, keine Instanzprüfung)
* Fehlermeldungen geben nicht an, welche Felder fehlen
* Inkonsistente Datentypen (erfordern Beträge als Strings statt Zahlen)

### Verstöße gegen die Content Security Policy {#content-security-policy-violations}

Ihr SDK erfordert unsafe-inline und unsafe-eval in Ihrer CSP, **was Sie zwingt, die Sicherheit Ihrer Website zu kompromittieren**.

### Dokumentationschaos {#documentation-chaos}

Mark Stuart selbst gab zu:

> Es stimmt, dass es eine absurde Menge an Legacy- und neuen APIs gibt. Wirklich schwer zu finden, wonach man suchen muss (selbst für uns, die hier arbeiten).

### Sicherheitslücken {#security-vulnerabilities}

**PayPals 2FA-Implementierung ist rückständig**. Selbst mit aktivierten TOTP-Apps erzwingen sie SMS-Verifizierung – was Konten anfällig für SIM-Swap-Angriffe macht. Wenn TOTP aktiviert ist, sollte dies ausschließlich verwendet werden. Der Fallback sollte E-Mail sein, nicht SMS.

### Katastrophales Sitzungsmanagement {#session-management-disaster}

**Ihr Entwickler-Dashboard loggt Sie nach 60 Sekunden Inaktivität aus**. Versuchen Sie, etwas Produktives zu tun, und Sie durchlaufen ständig: Login → Captcha → 2FA → Logout → Wiederholung. VPN in Benutzung? Viel Glück.


## Juli 2025: Der letzte Tropfen {#july-2025-the-final-straw}

Nach 11 Jahren der gleichen Probleme kam der Wendepunkt während einer routinemäßigen Kontomigration. Wir mussten auf ein neues PayPal-Konto umstellen, das unserem Firmennamen „Forward Email LLC“ entspricht, um die Buchhaltung zu vereinfachen.

Was einfach hätte sein sollen, wurde zur kompletten Katastrophe:

* Erste Tests zeigten, dass alles korrekt funktionierte
* Stunden später blockierte PayPal plötzlich alle Abonnementzahlungen ohne Vorwarnung
* Kunden konnten nicht bezahlen, was Verwirrung und Supportaufwand verursachte
* Der PayPal-Support gab widersprüchliche Antworten und behauptete, die Konten seien verifiziert
* Wir waren gezwungen, PayPal-Zahlungen komplett einzustellen

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Der Fehler, den Kunden beim Versuch zu zahlen sahen – keine Erklärung, keine Protokolle, nichts
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal-Support behauptet, alles sei in Ordnung, während Zahlungen komplett ausgefallen sind. Die letzte Nachricht zeigt, dass sie sagen, sie hätten „einige Funktionen wiederhergestellt“, aber weiterhin nach weiteren nicht spezifizierten Informationen fragen – klassisches PayPal-Support-Theater
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Der Identitätsprüfungsprozess, der angeblich „nichts behoben“ hat
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Vage Nachricht und immer noch keine Lösung. Keine Informationen, Hinweise oder irgendetwas darüber, welche zusätzlichen Informationen benötigt werden. Der Kundensupport schweigt.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Warum wir PayPal nicht einfach fallen lassen können {#why-we-cant-just-drop-paypal}

Trotz all dieser Probleme können wir PayPal nicht vollständig aufgeben, da einige Kunden nur PayPal als Zahlungsmöglichkeit haben. Wie ein Kunde auf unserer [Statusseite](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) sagte:

> PayPal ist meine einzige Zahlungsmöglichkeit

**Wir sind gezwungen, eine kaputte Plattform zu unterstützen, weil PayPal für bestimmte Nutzer ein Zahlungsmonopol geschaffen hat.**


## Die Community-Lösung {#the-community-workaround}

Da PayPal keine grundlegende Funktion zur Auflistung von Abonnements bereitstellt, hat die Entwickler-Community Workarounds geschaffen. Wir haben ein Skript erstellt, das bei der Verwaltung von PayPal-Abonnements hilft: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dieses Skript verweist auf einen [Community-Gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), in dem Entwickler Lösungen teilen. Nutzer bedanken sich tatsächlich [bei uns](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) dafür, dass wir bereitstellen, was PayPal vor Jahren hätte bauen sollen.


## Sperrung von PayPal-Vorlagen wegen Phishing {#blocking-paypal-templates-due-to-phishing}

Die Probleme gehen über APIs hinaus. Die E-Mail-Vorlagen von PayPal sind so schlecht gestaltet, dass wir in unserem E-Mail-Dienst spezifische Filter implementieren mussten, weil sie von Phishing-Versuchen nicht zu unterscheiden sind.

### Das eigentliche Problem: PayPal-Vorlagen sehen aus wie Betrug {#the-real-problem-paypals-templates-look-like-scams}

Wir erhalten regelmäßig Meldungen über PayPal-E-Mails, die genau wie Phishing-Versuche aussehen. Hier ist ein echtes Beispiel aus unseren Missbrauchsmeldungen:

**Betreff:** `[Sandbox] TEST - Neue Rechnung von PaypalBilling434567 sandbox #A4D369E8-0001`

Diese E-Mail wurde an `abuse@microsoft.com` weitergeleitet, weil sie wie ein Phishing-Versuch erschien. Das Problem? Sie stammte tatsächlich aus der Sandbox-Umgebung von PayPal, aber das Design ihrer Vorlage ist so schlecht, dass es Phishing-Erkennungssysteme auslöst.

### Unsere Umsetzung {#our-implementation}

Unsere PayPal-spezifische Filterung ist in unserem [E-Mail-Filtercode](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) implementiert:

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Aufgrund anhaltenden PayPal-Rechnungsspams müssen Sie einen Rechnungslink manuell senden'
  );
  err.isCodeBug = true; // alarmiert Admins zur Überprüfung
  throw err;
}
```

### Warum wir PayPal sperren mussten {#why-we-had-to-block-paypal}

Wir haben dies implementiert, weil PayPal trotz unserer wiederholten Meldungen an deren Abuse-Teams massive Spam-/Phishing-/Betrugsprobleme nicht behoben hat. Die spezifischen E-Mail-Typen, die wir blockieren, umfassen:

* **RT000238** - Verdächtige Rechnungsbenachrichtigungen
* **PPC001017** - Problematische Zahlungsbestätigungen
* **RT000542** - Versuche eines Geschenknachrichten-Hacks

### Das Ausmaß des Problems {#the-scale-of-the-problem}

Unsere Spam-Filter-Logs zeigen das enorme Volumen an PayPal-Rechnungsspam, das wir täglich verarbeiten. Beispiele für blockierte Betreffzeilen sind:

* "Rechnung vom PayPal Billing Team:- Dieser Betrag wird automatisch von Ihrem Konto abgebucht. Bitte kontaktieren Sie uns umgehend unter \[PHONE]"
* "Rechnung von \[COMPANY NAME] (\[ORDER-ID])"
* Mehrere Varianten mit unterschiedlichen Telefonnummern und gefälschten Bestellnummern
Diese E-Mails stammen oft von `outlook.com` Hosts, scheinen aber von den legitimen Systemen von PayPal zu kommen, was sie besonders gefährlich macht. Die E-Mails bestehen SPF-, DKIM- und DMARC-Authentifizierungen, weil sie über die tatsächliche Infrastruktur von PayPal gesendet werden.

Unsere technischen Protokolle zeigen, dass diese Spam-E-Mails legitime PayPal-Header enthalten:

* `X-Email-Type-Id: RT000238` (die gleiche ID, die wir blockieren)
* `From: "service@paypal.com" <service@paypal.com>`
* Gültige DKIM-Signaturen von `paypal.com`
* Korrekte SPF-Einträge, die die Mailserver von PayPal zeigen

Das schafft eine unmögliche Situation: legitime PayPal-E-Mails und Spam haben identische technische Merkmale.

### Die Ironie {#the-irony}

PayPal, ein Unternehmen, das eigentlich im Kampf gegen Finanzbetrug führend sein sollte, hat E-Mail-Vorlagen, die so schlecht gestaltet sind, dass sie Anti-Phishing-Systeme auslösen. Wir sind gezwungen, legitime PayPal-E-Mails zu blockieren, weil sie von Betrugsversuchen nicht zu unterscheiden sind.

Dies ist in Sicherheitsforschungen dokumentiert: [Vorsicht vor PayPal neuer Adressbetrug](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – die zeigen, wie PayPals eigene Systeme für Betrug ausgenutzt werden.

### Reale Auswirkungen: Neue PayPal-Betrugsmaschen {#real-world-impact-novel-paypal-scams}

Das Problem geht über schlechtes Vorlagendesign hinaus. Das Rechnungssystem von PayPal ist so leicht ausnutzbar, dass Betrüger es regelmäßig missbrauchen, um echt aussehende betrügerische Rechnungen zu versenden. Der Sicherheitsforscher Gavin Anderegg dokumentierte [Eine neue PayPal-Betrugsmasche](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), bei der Betrüger echte PayPal-Rechnungen senden, die alle Authentifizierungsprüfungen bestehen:

> „Beim Prüfen des Quelltexts sah die E-Mail tatsächlich so aus, als käme sie von PayPal (SPF, DKIM und DMARC wurden alle bestanden). Der Button führte auch zu einer URL, die wie eine legitime PayPal-Adresse aussah... Es dauerte einen Moment, bis mir klar wurde, dass es eine legitime E-Mail war. Ich hatte gerade eine zufällige ‚Rechnung‘ von einem Betrüger erhalten.“

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Screenshot zeigt mehrere betrügerische PayPal-Rechnungen, die ein Postfach überschwemmen, alle erscheinen legitim, weil sie tatsächlich von PayPals Systemen stammen
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Der Forscher bemerkte:

> „Es scheint auch eine Komfortfunktion zu sein, die PayPal in Betracht ziehen sollte, zu sperren. Ich ging sofort davon aus, dass es sich um eine Betrugsform handelt und war nur an den technischen Details interessiert. Es scheint viel zu einfach durchzuführen zu sein, und ich befürchte, dass andere darauf hereinfallen könnten.“

Dies illustriert das Problem perfekt: PayPals eigene legitime Systeme sind so schlecht gestaltet, dass sie Betrug ermöglichen und gleichzeitig legitime Kommunikation verdächtig erscheinen lassen.

Um das Ganze noch schlimmer zu machen, beeinträchtigte dies unsere Zustellbarkeit bei Yahoo, was zu Kundenbeschwerden und stundenlangem akribischem Testen und Musterprüfen führte.


## PayPals rückwärtsgewandter KYC-Prozess {#paypals-backwards-kyc-process}

Einer der frustrierendsten Aspekte von PayPals Plattform ist ihr rückwärtsgewandter Ansatz bei Compliance- und Know-Your-Customer-(KYC)-Verfahren. Im Gegensatz zu allen anderen Zahlungsanbietern erlaubt PayPal Entwicklern, ihre APIs zu integrieren und Zahlungen in der Produktion zu sammeln, bevor eine ordnungsgemäße Verifizierung abgeschlossen ist.

### Wie es funktionieren sollte {#how-it-should-work}

Jeder legitime Zahlungsanbieter folgt dieser logischen Reihenfolge:

1. **Zuerst KYC-Verifizierung abschließen**
2. **Das Händlerkonto genehmigen**
3. **Produktions-API-Zugang bereitstellen**
4. **Zahlungseingänge erlauben**

Dies schützt sowohl den Zahlungsanbieter als auch den Händler, indem die Einhaltung der Vorschriften sichergestellt wird, bevor Geld den Besitzer wechselt.

### Wie PayPal tatsächlich funktioniert {#how-paypal-actually-works}

PayPals Prozess ist komplett rückwärts:

1. **Sofort Produktions-API-Zugang bereitstellen**
2. **Zahlungseingänge für Stunden oder Tage erlauben**
3. **Plötzlich Zahlungen ohne Vorwarnung blockieren**
4. **KYC-Dokumentation erst nach Kundenbeeinträchtigung verlangen**
5. **Keine Benachrichtigung an den Händler senden**
6. **Kunden das Problem entdecken und melden lassen**
### Die Auswirkungen in der Praxis {#the-real-world-impact}

Dieser rückwärts gerichtete Prozess verursacht Katastrophen für Unternehmen:

* **Kunden können während Spitzenverkaufszeiten keine Einkäufe abschließen**
* **Keine Vorwarnung**, dass eine Verifizierung erforderlich ist
* **Keine E-Mail-Benachrichtigungen**, wenn Zahlungen blockiert werden
* **Händler erfahren von Problemen durch verwirrte Kunden**
* **Umsatzeinbußen** in kritischen Geschäftsphasen
* **Vertrauensverlust bei Kunden**, wenn Zahlungen unerklärlich fehlschlagen

### Die Katastrophe bei der Kontomigration im Juli 2025 {#the-july-2025-account-migration-disaster}

Dieses genaue Szenario spielte sich während unserer routinemäßigen Kontomigration im Juli 2025 ab. PayPal erlaubte zunächst Zahlungen, blockierte sie dann plötzlich ohne jegliche Benachrichtigung. Wir entdeckten das Problem erst, als Kunden meldeten, dass sie nicht bezahlen konnten.

Als wir den Support kontaktierten, erhielten wir widersprüchliche Antworten darüber, welche Dokumentation benötigt wird, ohne einen klaren Zeitplan für die Lösung. Dies zwang uns, PayPal-Zahlungen komplett einzustellen, was Kunden verwirrte, die keine anderen Zahlungsmöglichkeiten hatten.

### Warum das wichtig ist {#why-this-matters}

PayPals Ansatz zur Compliance zeigt ein grundlegendes Missverständnis darüber, wie Unternehmen arbeiten. Eine ordnungsgemäße KYC sollte **vor** der Produktionsintegration erfolgen, nicht nachdem Kunden bereits versuchen zu bezahlen. Das Fehlen proaktiver Kommunikation bei Problemen zeigt PayPals Entkopplung von den Bedürfnissen der Händler.

Dieser rückwärts gerichtete Prozess ist symptomatisch für die größeren organisatorischen Probleme bei PayPal: Sie priorisieren ihre internen Abläufe über die Händler- und Kundenerfahrung, was zu betrieblichen Katastrophen führt, die Unternehmen von ihrer Plattform vertreiben.


## Wie alle anderen Zahlungsanbieter es richtig machen {#how-every-other-payment-processor-does-it-right}

Die Funktion zur Auflistung von Abonnements, die PayPal nicht implementieren will, ist in der Branche seit über einem Jahrzehnt Standard. So handhaben andere Zahlungsanbieter diese grundlegende Anforderung:

### Stripe {#stripe}

Stripe bietet die Auflistung von Abonnements seit dem Start ihrer API an. Ihre Dokumentation zeigt klar, wie man alle Abonnements für einen Kunden- oder Händleraccount abruft. Dies gilt als grundlegende CRUD-Funktionalität.

### Paddle {#paddle}

Paddle stellt umfassende APIs für das Abonnementmanagement bereit, einschließlich Auflistung, Filterung und Paginierung. Sie verstehen, dass Händler ihre wiederkehrenden Einnahmequellen sehen müssen.

### Coinbase Commerce {#coinbase-commerce}

Sogar Kryptowährungs-Zahlungsanbieter wie Coinbase Commerce bieten ein besseres Abonnementmanagement als PayPal.

### Square {#square}

Die API von Square beinhaltet die Auflistung von Abonnements als grundlegende Funktion, nicht als nachträglichen Gedanken.

### Der Branchenstandard {#the-industry-standard}

Jeder moderne Zahlungsanbieter bietet:

* Auflistung aller Abonnements
* Filterung nach Status, Datum, Kunde
* Paginierung für große Datensätze
* Webhook-Benachrichtigungen bei Abonnementänderungen
* Umfassende Dokumentation mit funktionierenden Beispielen

### Was andere Anbieter bieten vs. PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Alle Abonnements auflisten:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Nach Kunde filtern:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Nach Status filtern:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Was Sie tatsächlich bekommen:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Sie können NUR EIN Abonnement abrufen, wenn Sie die ID bereits kennen
# Es gibt KEINEN Endpunkt, um alle Abonnements aufzulisten
# Es gibt KEINE Möglichkeit zu suchen oder zu filtern
# Sie müssen alle Abonnement-IDs selbst verfolgen
```

**Verfügbare PayPal-Endpunkte:**

* `POST /v1/billing/subscriptions` - Ein Abonnement erstellen
* `GET /v1/billing/subscriptions/{id}` - EIN Abonnement abrufen (wenn Sie die ID kennen)
* `PATCH /v1/billing/subscriptions/{id}` - Ein Abonnement aktualisieren
* `POST /v1/billing/subscriptions/{id}/cancel` - Abonnement kündigen
* `POST /v1/billing/subscriptions/{id}/suspend` - Abonnement aussetzen
**Was PayPal fehlt:**

* ❌ Kein `GET /v1/billing/subscriptions` (alle auflisten)
* ❌ Keine Suchfunktion
* ❌ Keine Filterung nach Status, Kunde, Datum
* ❌ Keine Unterstützung für Paginierung

PayPal ist der einzige große Zahlungsanbieter, der Entwickler zwingt, Abonnement-IDs manuell in ihren eigenen Datenbanken zu verfolgen.


## PayPals systematische Vertuschung: 6 Millionen Stimmen zum Schweigen bringen {#paypals-systematic-cover-up-silencing-6-million-voices}

In einem Schritt, der PayPals Umgang mit Kritik perfekt zusammenfasst, haben sie kürzlich ihr gesamtes Community-Forum offline genommen, wodurch über 6 Millionen Mitglieder zum Schweigen gebracht und Hunderttausende von Beiträgen, die ihre Fehler dokumentierten, gelöscht wurden.

### Das große Löschen {#the-great-erasure}

Die ursprüngliche PayPal-Community unter `paypal-community.com` beherbergte **6.003.558 Mitglieder** und enthielt Hunderttausende von Beiträgen, Fehlerberichten, Beschwerden und Diskussionen über PayPals API-Fehler. Dies stellte über ein Jahrzehnt dokumentierter Beweise für PayPals systematische Probleme dar.

Am 30. Juni 2025 hat PayPal das gesamte Forum stillschweigend offline genommen. Alle Links zu `paypal-community.com` führen jetzt zu 404-Fehlern. Dies war keine Migration oder ein Upgrade.

### Die Rettung durch Dritte {#the-third-party-rescue}

Glücklicherweise hat ein Drittanbieterdienst unter [ppl.lithium.com](https://ppl.lithium.com/) einige Inhalte bewahrt, sodass wir auf die Diskussionen zugreifen können, die PayPal zu verbergen versuchte. Diese Drittanbietersicherung ist jedoch unvollständig und könnte jederzeit verschwinden.

Dieses Muster, Beweise zu verbergen, ist für PayPal nicht neu. Sie haben eine dokumentierte Geschichte von:

* Entfernen kritischer Fehlerberichte aus der öffentlichen Sicht
* Einstellung von Entwickler-Tools ohne Vorankündigung
* Änderung von APIs ohne ordnungsgemäße Dokumentation
* Zum Schweigen bringen von Community-Diskussionen über ihre Fehler

Die Abschaltung des Forums stellt den bisher dreistesten Versuch dar, ihre systematischen Fehler der öffentlichen Kontrolle zu entziehen.


## Die 11-jährige Capture-Bug-Katastrophe: 1.899 $ und es wird mehr {#the-11-year-capture-bug-disaster-1899-and-counting}

Während PayPal damit beschäftigt war, Feedback-Sitzungen zu organisieren und Versprechen zu machen, ist ihr Kernzahlungssystem seit über 11 Jahren grundlegend fehlerhaft. Die Beweise sind verheerend.

### Forward Emails Verlust von 1.899 $ {#forward-emails-1899-loss}

In unseren Produktionssystemen entdeckten wir 108 PayPal-Zahlungen im Gesamtwert von **1.899 $**, die aufgrund von PayPals Capture-Fehlern verloren gingen. Diese Zahlungen zeigen ein konsistentes Muster:

* `CHECKOUT.ORDER.APPROVED` Webhooks wurden empfangen
* PayPals Capture-API gab 404-Fehler zurück
* Bestellungen wurden über PayPals API unzugänglich

Es ist unmöglich zu bestimmen, ob Kunden belastet wurden, da PayPal Debug-Logs nach 14 Tagen vollständig verbirgt und alle Daten im Dashboard für nicht erfasste Bestell-IDs löscht.

Dies betrifft nur ein Unternehmen. **Die kollektiven Verluste über Tausende von Händlern in mehr als 11 Jahren belaufen sich wahrscheinlich auf Millionen von Dollar.**

**Wir sagen es noch einmal: Die kollektiven Verluste über Tausende von Händlern in mehr als 11 Jahren belaufen sich wahrscheinlich auf Millionen von Dollar.**

Der einzige Grund, warum wir das entdeckt haben, ist, dass wir unglaublich sorgfältig und datengetrieben sind.

### Der ursprüngliche Bericht von 2013: Über 11 Jahre Vernachlässigung {#the-2013-original-report-11-years-of-negligence}

Der früheste dokumentierte Bericht dieses genauen Problems erscheint auf [Stack Overflow im November 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archiviert](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Erhalte immer wieder 404-Fehler mit der REST-API beim Versuch einer Capture"

Der 2013 gemeldete Fehler ist **identisch** mit dem, was Forward Email 2024 erlebt hat:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "Die angeforderte Ressourcen-ID wurde nicht gefunden",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Die Community-Reaktion im Jahr 2013 war aufschlussreich:

> "Es gibt momentan ein gemeldetes Problem mit der REST-API. PayPal arbeitet daran."
**Mehr als 11 Jahre später „arbeiten sie immer noch daran.“**

### Das Eingeständnis von 2016: PayPal zerstört ihr eigenes SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

Im Jahr 2016 dokumentierte PayPals eigenes GitHub-Repository [massive Capture-Fehler](https://github.com/paypal/PayPal-PHP-SDK/issues/660), die ihr offizielles PHP SDK betrafen. Das Ausmaß war erschreckend:

> „Seit dem 20.09.2016 schlagen alle PayPal-Capture-Versuche mit 'INVALID_RESOURCE_ID - Requested resource ID was not found.' fehl. Zwischen dem 19.09. und 20.09. wurde an der API-Integration nichts geändert. **100 % der Capture-Versuche seit dem 20.09. haben diesen Fehler zurückgegeben.**“

Ein Händler berichtete:

> „Ich hatte **über 1.400 fehlgeschlagene Capture-Versuche in den letzten 24 Stunden**, alle mit der Fehlermeldung INVALID_RESOURCE_ID.“

PayPals erste Reaktion war, den Händler zu beschuldigen und ihn an den technischen Support zu verweisen. Erst nach massivem Druck gaben sie Fehler zu:

> „Ich habe ein Update von unseren Produktentwicklern. Sie stellen in den gesendeten Headern fest, dass die PayPal-Request-ID mit 42 Zeichen gesendet wird, aber **es scheint eine kürzliche Änderung gegeben zu haben, die diese ID auf nur 38 Zeichen begrenzt.**“

Dieses Eingeständnis offenbart PayPals systematische Nachlässigkeit:

1. **Sie haben undokumentierte Breaking Changes eingeführt**
2. **Sie haben ihr eigenes offizielles SDK kaputt gemacht**
3. **Sie haben zuerst die Händler beschuldigt**
4. **Sie haben den Fehler erst unter Druck zugegeben**

Selbst nach der „Behebung“ des Problems berichteten Händler:

> „SDK auf v1.7.4 aktualisiert und **das Problem tritt immer noch auf.**“

### Die Eskalation 2024: Immer noch kaputt {#the-2024-escalation-still-broken}

Aktuelle Berichte aus der archivierten PayPal-Community zeigen, dass sich das Problem tatsächlich verschärft hat. Eine [Diskussion aus September 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archiviert](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentiert exakt dieselben Probleme:

> „Das Problem trat erst vor etwa 2 Wochen auf und betrifft nicht alle Bestellungen. **Das viel häufigere Problem scheinen 404-Fehler bei Capture zu sein.**“

Der Händler beschreibt dasselbe Muster, das Forward Email erlebt hat:

> „Nach dem Versuch, die Bestellung zu erfassen, gibt PayPal einen 404 zurück. Beim Abrufen der Details der Bestellung: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **ohne jegliche Spur eines erfolgreichen Captures auf unserer Seite.**“

### Die Katastrophe der Webhook-Zuverlässigkeit {#the-webhook-reliability-disaster}

Eine weitere [archivierte Community-Diskussion](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) zeigt, dass PayPals Webhook-System grundsätzlich unzuverlässig ist:

> „Theoretisch sollte es zwei Events geben (CHECKOUT.ORDER.APPROVED und PAYMENT.CAPTURE.COMPLETED) vom Webhook-Event. Tatsächlich **werden diese beiden Events selten sofort empfangen, PAYMENT.CAPTURE.COMPLETED wird meistens nicht empfangen oder erst nach einigen Stunden.**“

Bei Abonnementzahlungen:

> „**'PAYMENT.SALE.COMPLETED' wurde manchmal nicht empfangen oder erst nach einigen Stunden.**“

Die Fragen des Händlers offenbaren die Tiefe von PayPals Zuverlässigkeitsproblemen:

1. **„Warum passiert das?“** – PayPals Webhook-System ist grundsätzlich kaputt
2. **„Wenn der Bestellstatus 'COMPLETED' ist, kann ich dann davon ausgehen, dass ich das Geld erhalten habe?“** – Händler können PayPals API-Antworten nicht vertrauen
3. **„Warum findet man unter 'Event Logs->Webhook Events' keine Logs?“** – Selbst PayPals eigenes Logging-System funktioniert nicht

### Das Muster systematischer Nachlässigkeit {#the-pattern-of-systematic-negligence}

Die Beweise erstrecken sich über mehr als 11 Jahre und zeigen ein klares Muster:

* **2013**: „PayPal arbeitet daran“
* **2016**: PayPal gibt einen Breaking Change zu, liefert eine kaputte Lösung
* **2024**: Dieselben Fehler treten weiterhin auf, betreffen Forward Email und unzählige andere

Dies ist kein Bug – **das ist systematische Nachlässigkeit.** PayPal kennt diese kritischen Zahlungsabwicklungsfehler seit über einem Jahrzehnt und hat konsequent:
1. **Schuldzuweisungen an Händler für PayPals Fehler**
2. **Un-dokumentierte Breaking Changes eingeführt**
3. **Unzureichende Fehlerbehebungen bereitgestellt, die nicht funktionieren**
4. **Finanzielle Auswirkungen auf Unternehmen ignoriert**
5. **Beweise durch Abschaltung von Community-Foren verborgen**

### Die un-dokumentierte Anforderung {#the-undocumented-requirement}

Nirgendwo in der offiziellen PayPal-Dokumentation wird erwähnt, dass Händler eine Retry-Logik für Capture-Operationen implementieren müssen. Ihre Dokumentation besagt, Händler sollten „sofort nach der Genehmigung erfassen“, erwähnt jedoch nicht, dass ihre API zufällig 404-Fehler zurückgibt, die komplexe Retry-Mechanismen erfordern.

Dies zwingt jeden Händler dazu:

* Eine exponentielle Backoff-Retry-Logik zu implementieren
* Unzuverlässige Webhook-Zustellung zu handhaben
* Komplexe Zustandsverwaltungssysteme zu bauen
* Fehlgeschlagene Captures manuell zu überwachen

**Jeder andere Zahlungsanbieter stellt zuverlässige Capture-APIs bereit, die beim ersten Mal funktionieren.**


## PayPals breiteres Täuschungsmuster {#paypals-broader-pattern-of-deception}

Die Capture-Bug-Katastrophe ist nur ein Beispiel für PayPals systematischen Ansatz, Kunden zu täuschen und ihre Fehler zu verbergen.

### Die Maßnahme des New Yorker Finanzdienstleistungsamts {#the-new-york-department-of-financial-services-action}

Im Januar 2025 erließ das New Yorker Finanzdienstleistungsamt eine [Durchsetzungsmaßnahme gegen PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) wegen irreführender Praktiken, was zeigt, dass PayPals Täuschungsmuster weit über ihre APIs hinausgeht.

Diese regulatorische Maßnahme zeigt PayPals Bereitschaft, irreführende Praktiken im gesamten Unternehmen anzuwenden, nicht nur in ihren Entwickler-Tools.

### Die Honey-Klage: Umschreiben von Affiliate-Links {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals Übernahme von Honey hat zu [Klagen geführt, die behaupten, Honey schreibe Affiliate-Links um](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) und stehle Provisionen von Content-Erstellern und Influencern. Dies stellt eine weitere Form systematischer Täuschung dar, bei der PayPal durch Umleitung von Einnahmen profitiert, die anderen zustehen.

Das Muster ist klar:

1. **API-Ausfälle**: Defekte Funktionalität verbergen, Händler beschuldigen
2. **Community-Sperrung**: Beweise für Probleme entfernen
3. **Regulatorische Verstöße**: Irreführende Praktiken anwenden
4. **Affiliate-Diebstahl**: Provisionen durch technische Manipulation stehlen

### Die Kosten von PayPals Nachlässigkeit {#the-cost-of-paypals-negligence}

Der Verlust von Forward Email in Höhe von 1.899 $ ist nur die Spitze des Eisbergs. Betrachten Sie die breiteren Auswirkungen:

* **Einzelne Händler**: Tausende verlieren jeweils Hunderte bis Tausende von Dollar
* **Unternehmenskunden**: Potenziell Millionen an entgangenem Umsatz
* **Entwicklerzeit**: Unzählige Stunden für Workarounds bei PayPals fehlerhaften APIs
* **Kundenvertrauen**: Unternehmen verlieren Kunden aufgrund von PayPals Zahlungsfehlern

Wenn ein kleiner E-Mail-Dienst fast 2.000 $ verlor und dieses Problem seit über 11 Jahren existiert und Tausende Händler betrifft, beläuft sich der kollektive finanzielle Schaden wahrscheinlich auf **Hunderte Millionen Dollar**.

### Die Dokumentationslüge {#the-documentation-lie}

PayPals offizielle Dokumentation erwähnt konsequent nicht die kritischen Einschränkungen und Fehler, auf die Händler stoßen werden. Zum Beispiel:

* **Capture-API**: Keine Erwähnung, dass 404-Fehler häufig sind und Retry-Logik erfordern
* **Webhook-Zuverlässigkeit**: Keine Erwähnung, dass Webhooks oft um Stunden verzögert sind
* **Abonnementauflistung**: Dokumentation suggeriert, dass eine Auflistung möglich ist, obwohl kein Endpunkt existiert
* **Sitzungs-Timeouts**: Keine Erwähnung aggressiver 60-Sekunden-Timeouts

Dieses systematische Weglassen kritischer Informationen zwingt Händler dazu, PayPals Einschränkungen durch Trial-and-Error in Produktionssystemen zu entdecken, was oft zu finanziellen Verlusten führt.


## Was das für Entwickler bedeutet {#what-this-means-for-developers}

PayPals systematisches Versagen, grundlegende Entwicklerbedürfnisse zu adressieren, während umfangreiches Feedback gesammelt wird, zeigt ein grundlegendes organisatorisches Problem. Sie behandeln das Sammeln von Feedback als Ersatz dafür, Probleme tatsächlich zu beheben.
Das Muster ist klar:

1. Entwickler melden Probleme
2. PayPal organisiert Feedback-Sitzungen mit Führungskräften
3. Umfangreiches Feedback wird gegeben
4. Teams erkennen Lücken an und versprechen, diese "zu verfolgen und zu beheben"
5. Nichts wird umgesetzt
6. Führungskräfte wechseln zu besseren Unternehmen
7. Neue Teams fragen nach demselben Feedback
8. Der Zyklus wiederholt sich

In der Zwischenzeit sind Entwickler gezwungen, Workarounds zu bauen, Kompromisse bei der Sicherheit einzugehen und mit fehlerhaften Benutzeroberflächen umzugehen, nur um Zahlungen zu akzeptieren.

Wenn Sie ein Zahlungssystem bauen, lernen Sie aus unserer Erfahrung: Bauen Sie Ihren [Trifecta-Ansatz](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) mit mehreren Prozessoren auf, aber erwarten Sie nicht, dass PayPal die grundlegende Funktionalität bereitstellt, die Sie benötigen. Planen Sie von Anfang an, Workarounds zu entwickeln.

> Dieser Beitrag dokumentiert unsere 11-jährige Erfahrung mit den PayPal-APIs bei Forward Email. Alle Codebeispiele und Links stammen aus unseren tatsächlichen Produktionssystemen. Wir unterstützen weiterhin PayPal-Zahlungen trotz dieser Probleme, weil einige Kunden keine andere Wahl haben

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
