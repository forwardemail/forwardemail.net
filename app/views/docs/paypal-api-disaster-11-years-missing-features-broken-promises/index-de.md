# PayPals elfjähriges API-Desaster: Wie wir Workarounds erstellten, während sie die Entwickler ignorierten {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Wir bei Forward Email beschäftigen uns seit über einem Jahrzehnt mit den fehlerhaften APIs von PayPal. Was zunächst als kleine Frustration begann, entwickelte sich zu einem kompletten Desaster. Wir mussten unsere eigenen Workarounds entwickeln, die Phishing-Vorlagen blockieren und schließlich während einer kritischen Kontomigration alle PayPal-Zahlungen einstellen.</p>
<p class="lead mt-3">Dies ist die Geschichte von elf Jahren, in denen PayPal grundlegende Entwicklerbedürfnisse ignorierte, während wir alles versuchten, um die Plattform zum Laufen zu bringen.</p>

## Inhaltsverzeichnis {#table-of-contents}

* [Das fehlende Stück: Keine Möglichkeit, Abonnements aufzulisten](#the-missing-piece-no-way-to-list-subscriptions)
* [2014–2017: Das Problem tritt zutage](#2014-2017-the-problem-emerges)
* [2020: Wir geben ihnen umfassendes Feedback](#2020-we-give-them-extensive-feedback)
  * [Die 27-Punkte-Feedbackliste](#the-27-item-feedback-list)
  * [Teams beteiligten sich, Versprechen wurden gemacht](#teams-got-involved-promises-were-made)
  * [Das Ergebnis? Nichts.](#the-result-nothing)
* [Der Exodus der Führungskräfte: Wie PayPal jegliches institutionelle Gedächtnis verlor](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Neue Führung, gleiche Probleme](#2025-new-leadership-same-problems)
  * [Der neue CEO mischt mit](#the-new-ceo-gets-involved)
  * [Michelle Gills Antwort](#michelle-gills-response)
  * [Unsere Antwort: Keine weiteren Treffen](#our-response-no-more-meetings)
  * [Marty Brodbecks Reaktion auf Übertechnik](#marty-brodbecks-overengineering-response)
  * [Der „Simple CRUD“-Widerspruch](#the-simple-crud-contradiction)
  * [Die Trennung wird deutlich](#the-disconnect-becomes-clear)
* [Jahrelange Fehlerberichte, die sie ignoriert haben](#years-of-bug-reports-they-ignored)
  * [2016: Erste UI/UX-Beschwerden](#2016-early-uiux-complaints)
  * [2021: Fehlerbericht zu geschäftlichen E-Mails](#2021-business-email-bug-report)
  * [2021: Vorschläge zur Verbesserung der Benutzeroberfläche](#2021-ui-improvement-suggestions)
  * [2021: Fehler in der Sandbox-Umgebung](#2021-sandbox-environment-failures)
  * [2021: Berichtssystem völlig kaputt](#2021-reports-system-completely-broken)
  * [2022: Kern-API-Funktion fehlt (erneut)](#2022-core-api-feature-missing-again)
* [Der Albtraum der Entwicklererfahrung](#the-developer-experience-nightmare)
  * [Defekte Benutzeroberfläche](#broken-user-interface)
  * [SDK-Probleme](#sdk-problems)
  * [Verstöße gegen die Inhaltssicherheitsrichtlinie](#content-security-policy-violations)
  * [Dokumentationschaos](#documentation-chaos)
  * [Sicherheitslücken](#security-vulnerabilities)
  * [Sitzungsverwaltungs-Desaster](#session-management-disaster)
* [Juli 2025: Der Tropfen, der das Fass zum Überlaufen bringt](#july-2025-the-final-straw)
* [Warum wir PayPal nicht einfach abschaffen können](#why-we-cant-just-drop-paypal)
* [Der Community-Workaround](#the-community-workaround)
* [Blockieren von PayPal-Vorlagen aufgrund von Phishing](#blocking-paypal-templates-due-to-phishing)
  * [Das eigentliche Problem: Die Vorlagen von PayPal sehen aus wie Betrug](#the-real-problem-paypals-templates-look-like-scams)
  * [Unsere Umsetzung](#our-implementation)
  * [Warum wir PayPal sperren mussten](#why-we-had-to-block-paypal)
  * [Das Ausmaß des Problems](#the-scale-of-the-problem)
  * [Die Ironie](#the-irony)
  * [Auswirkungen in der realen Welt: Neuartige PayPal-Betrügereien](#real-world-impact-novel-paypal-scams)
* [Der rückwärts gerichtete KYC-Prozess von PayPal](#paypals-backwards-kyc-process)
  * [So sollte es funktionieren](#how-it-should-work)
  * [Wie PayPal tatsächlich funktioniert](#how-paypal-actually-works)
  * [Die Auswirkungen in der realen Welt](#the-real-world-impact)
  * [Die Account-Migrationskatastrophe vom Juli 2025](#the-july-2025-account-migration-disaster)
  * [Warum das wichtig ist](#why-this-matters)
* [Wie jeder andere Zahlungsabwickler es richtig macht](#how-every-other-payment-processor-does-it-right)
  * [Streifen](#stripe)
  * [Paddeln](#paddle)
  * [Coinbase Handel](#coinbase-commerce)
  * [Quadrat](#square)
  * [Der Industriestandard](#the-industry-standard)
  * [Was andere Prozessoren im Vergleich zu PayPal bieten](#what-other-processors-provide-vs-paypal)
* [PayPals systematische Vertuschung: Sechs Millionen Stimmen werden zum Schweigen gebracht](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Die große Auslöschung](#the-great-erasure)
  * [Die Rettung durch Dritte](#the-third-party-rescue)
* [Das 11-jährige Capture-Bug-Desaster: 1.899 US-Dollar und es geht weiter](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Der Verlust von 1.899 US-Dollar durch die Weiterleitung von E-Mails](#forward-emails-1899-loss)
  * [Der Originalbericht von 2013: Über 11 Jahre Fahrlässigkeit](#the-2013-original-report-11-years-of-negligence)
  * [Das Eingeständnis von 2016: PayPal bricht sein eigenes SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Die Eskalation 2024: Immer noch gebrochen](#the-2024-escalation-still-broken)
  * [Die Webhook-Zuverlässigkeitskatastrophe](#the-webhook-reliability-disaster)
  * [Das Muster systematischer Fahrlässigkeit](#the-pattern-of-systematic-negligence)
  * [Die undokumentierte Anforderung](#the-undocumented-requirement)
* [PayPals umfassenderes Täuschungsmuster](#paypals-broader-pattern-of-deception)
  * [Maßnahmen des New Yorker Finanzministeriums](#the-new-york-department-of-financial-services-action)
  * [Der Honey-Prozess: Affiliate-Links umschreiben](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Die Kosten der Nachlässigkeit von PayPal](#the-cost-of-paypals-negligence)
  * [Die Dokumentationslüge](#the-documentation-lie)
* [Was das für Entwickler bedeutet](#what-this-means-for-developers)

## Das fehlende Stück: Keine Möglichkeit, Abonnements aufzulisten {#the-missing-piece-no-way-to-list-subscriptions}

Was uns wirklich verblüfft: PayPal bietet seit 2014 Abonnementabrechnungen an, hat den Händlern jedoch nie die Möglichkeit gegeben, ihre eigenen Abonnements aufzulisten.

Denken Sie kurz darüber nach. Sie können Abonnements erstellen und kündigen, wenn Sie die ID haben, aber Sie erhalten keine Liste aller aktiven Abonnements für Ihr Konto. Es ist, als hätten Sie eine Datenbank ohne SELECT-Anweisung.

Dies benötigen wir für den grundlegenden Geschäftsbetrieb:

* Kundensupport (bei E-Mail-Anfragen zu Abonnements)
* Finanzberichterstattung und -abgleich
* Automatisierte Rechnungsverwaltung
* Compliance und Auditing

Aber PayPal? Die haben es einfach nie gebaut.

## 2014-2017: Das Problem tritt auf {#2014-2017-the-problem-emerges}

Das Problem mit der Abonnementliste tauchte erstmals 2017 in den Community-Foren von PayPal auf. Die Entwickler stellten die naheliegende Frage: „Wie erhalte ich eine Liste aller meiner Abonnements?“

Die Antwort von PayPal? Grillen.

Die Community-Mitglieder wurden allmählich frustriert:

> „Sehr merkwürdig, wenn ein Händler nicht alle aktiven Verträge auflisten kann. Wenn die Vertrags-ID verloren geht, bedeutet dies, dass nur der Benutzer einen Vertrag kündigen oder aussetzen kann.“ – leafspider

> „+1. Es sind fast 3 Jahre vergangen.“ – laudukang (was bedeutet, dass das Problem seit ~2014 besteht)

Der [ursprünglicher Community-Beitrag](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) aus dem Jahr 2017 zeigt, wie Entwickler um diese grundlegende Funktionalität bettelten. PayPal reagierte darauf mit der Archivierung des Repositorys, in dem das Problem gemeldet wurde.

## 2020: Wir geben ihnen umfassendes Feedback {#2020-we-give-them-extensive-feedback}

Im Oktober 2020 kontaktierte uns PayPal für eine formelle Feedback-Sitzung. Es handelte sich nicht um ein lockeres Gespräch – es wurde ein 45-minütiger Microsoft Teams-Anruf mit acht PayPal-Führungskräften organisiert, darunter Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze und andere.

### Die 27-Punkte-Feedbackliste {#the-27-item-feedback-list}

Wir waren gut vorbereitet. Nach sechs Stunden Integrationsversuchen mit den APIs hatten wir 27 spezifische Probleme identifiziert. Mark Stuart vom PayPal Checkout-Team sagte:

> Hey Nick, danke, dass du es heute mit allen geteilt hast! Ich denke, das wird der Katalysator für mehr Unterstützung und Investitionen für unser Team sein, um diese Probleme zu beheben. Es war schwierig, so umfassendes Feedback wie das von dir bisher zu bekommen.

Das Feedback war nicht theoretischer Natur, sondern beruhte auf realen Integrationsversuchen:

1. **Zugriffstoken-Generierung funktioniert nicht**:

> Die Generierung von Zugriffstoken funktioniert nicht. Außerdem sollten mehr als nur cURL-Beispiele vorhanden sein.

2. **Keine Web-Benutzeroberfläche zum Erstellen von Abonnements**:

> Wie zum Teufel kann man Abonnements erstellen, ohne cURL verwenden zu müssen? Es scheint keine Web-Benutzeroberfläche dafür zu geben (wie bei Stripe).

Mark Stuart fand das Problem mit dem Zugriffstoken besonders besorgniserregend:

> Normalerweise hören wir nichts von Problemen im Zusammenhang mit der Generierung von Zugriffstoken.

### Teams haben sich beteiligt, Versprechen wurden gemacht {#teams-got-involved-promises-were-made}

Als wir weitere Probleme entdeckten, beteiligten sich weitere Teams bei PayPal an der Diskussion. Darshan Raju vom UI-Team für Abonnementverwaltung beteiligte sich ebenfalls und sagte:

> Bitte nehmen Sie die Lücke zur Kenntnis. Wir werden sie verfolgen und beheben. Nochmals vielen Dank für Ihr Feedback!

Die Sitzung wurde wie folgt beschrieben:

> offener Rundgang durch Ihre Erfahrung

Zu:

> Machen Sie PayPal zu dem, was es für Entwickler sein sollte.

### Das Ergebnis? Nichts. {#the-result-nothing}

Trotz der formellen Feedback-Sitzung, der umfangreichen Liste mit 27 Punkten, der Beteiligung mehrerer Teams und der Versprechen,

> Sendungsverfolgung und Adresse

Probleme, absolut nichts wurde behoben.

## Der Exodus der Führungskräfte: Wie PayPal jegliches institutionelle Gedächtnis verlor {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Und jetzt wird es richtig interessant. Jede einzelne Person, die unser Feedback für 2020 erhalten hat, hat PayPal verlassen:

**Führungswechsel:**

* [Dan Schulman (CEO seit 9 Jahren) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (September 2023)
* [Sri Shivananda (CTO, der Feedback organisiert hat) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Januar 2024)

**Technische Führungskräfte, die Versprechungen machten und dann gingen:**

* **Mark Stuart** (versprochenes Feedback wäre ein Katalysator) → [Jetzt bei Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 Jahre PayPal-Erfahrung) → [CEO von MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (Vizepräsident Global Consumer Product) → [Im Ruhestand](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (einer der letzten Verbliebenen) → [Bin gerade zum Nasdaq aufgebrochen](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Januar 2025)

PayPal ist zu einer Drehtür geworden, wo Führungskräfte Feedback von Entwicklern sammeln, Versprechungen machen und dann zu besseren Unternehmen wie JPMorgan, Ripple und anderen Fintech-Unternehmen wechseln.

Dies erklärt, warum die Antwort auf das GitHub-Problem von 2025 scheinbar überhaupt nichts mit unserem Feedback von 2020 zu tun hatte – buchstäblich jeder, der dieses Feedback erhalten hat, hat PayPal verlassen.

## 2025: Neue Führung, gleiche Probleme {#2025-new-leadership-same-problems}

Im Jahr 2025 zeigt sich genau dasselbe Muster. Nach Jahren ohne Fortschritte versucht die neue PayPal-Führung erneut, neue Wege zu gehen.

### Der neue CEO mischt mit {#the-new-ceo-gets-involved}

Am 30. Juni 2025 haben wir uns direkt an den neuen CEO von PayPal, Alex Chriss, gewandt. Seine Antwort war kurz:

> Hallo Nick – Danke für deine Kontaktaufnahme und dein Feedback. Michelle (CC) und ihr Team sind bereit, sich mit dir in Verbindung zu setzen und das Problem gemeinsam zu lösen. Danke – A

### Michelle Gills Antwort {#michelle-gills-response}

Michelle Gill, EVP und General Manager für Kleinunternehmen und Finanzdienstleistungen, antwortete:

Vielen Dank, Nick, dass du Alex in BCC verschoben hast. Wir haben uns seit deinem letzten Beitrag damit befasst. Wir werden dich noch vor Ende der Woche anrufen. Könntest du mir bitte deine Kontaktdaten schicken, damit sich einer meiner Kollegen melden kann? Michelle

### Unsere Antwort: Keine weiteren Meetings {#our-response-no-more-meetings}

Wir lehnten ein weiteres Treffen ab und begründeten unsere Frustration wie folgt:

> Danke. Ich glaube jedoch nicht, dass ein Anruf etwas bringt. Der Grund dafür ist: Ich habe in der Vergangenheit an einem Anruf teilgenommen, der absolut nichts gebracht hat. Ich habe über zwei Stunden mit dem gesamten Team und der Geschäftsleitung gesprochen, und nichts ist passiert. Unzählige E-Mails hin und her. Absolut nichts. Feedback führte zu nichts. Ich habe es jahrelang versucht, wurde angehört, und dann hat es nichts gebracht.

### Marty Brodbecks Overengineering-Antwort {#marty-brodbecks-overengineering-response}

Dann meldete sich Marty Brodbeck, Leiter der Verbrauchertechnik bei PayPal:

> Hallo Nick, hier ist Marty Brodbeck. Ich leite die gesamte Kundenentwicklung hier bei PayPal und treibe die API-Entwicklung für das Unternehmen voran. Können wir uns mit Ihnen über Ihr Problem austauschen und wie wir Ihnen helfen können?

Als wir die einfache Notwendigkeit eines Endpunkts für die Abonnementliste erklärten, offenbarte seine Antwort das genaue Problem:

> Danke, Nick, wir sind dabei, eine einzelne Abonnement-API mit vollständigem SDK zu erstellen (unterstützt vollständige Fehlerbehandlung, ereignisbasierte Abonnementverfolgung, robuste Betriebszeit), bei der die Abrechnung auch als separate API für Händler aufgeteilt wird, anstatt sie über mehrere Endpunkte orchestrieren zu müssen, um eine einzelne Antwort zu erhalten.

Das ist genau der falsche Ansatz. Wir brauchen keine monatelange, komplexe Architektur. Wir brauchen einen einfachen REST-Endpunkt, der Abonnements auflistet – etwas, das es eigentlich schon seit 2014 geben sollte.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Der „Simple CRUD“-Widerspruch {#the-simple-crud-contradiction}

Als wir darauf hinwiesen, dass es sich hierbei um eine grundlegende CRUD-Funktionalität handele, die es eigentlich schon seit 2014 geben sollte, war Martys Antwort vielsagend:

> Einfache Crud-Operationen sind Teil der Kern-API, mein Freund, also wird die Entwicklung keine Monate dauern

Das PayPal TypeScript SDK, das nach monatelanger Entwicklung derzeit nur drei Endpunkte unterstützt, zeigt zusammen mit seiner historischen Zeitleiste deutlich, dass die Fertigstellung solcher Projekte mehr als nur ein paar Monate in Anspruch nimmt.

Diese Antwort zeigt, dass er seine eigene API nicht versteht. Wenn „einfache CRUD-Operationen Teil der Kern-API sind“, wo ist dann der Endpunkt für die Abonnementliste? Wir antworteten:

> Wenn „einfache CRUD-Operationen Teil der Kern-API sind“, wo ist dann der Endpunkt für die Abonnementliste? Entwickler fordern diese „einfache CRUD-Operation“ seit 2014. Das ist elf Jahre her. Jeder andere Zahlungsprozessor verfügt seit dem ersten Tag über diese grundlegende Funktionalität.

### Die Trennung wird klar {#the-disconnect-becomes-clear}

Der Austausch mit Alex Chriss, Michelle Gill und Marty Brodbeck im Jahr 2025 zeigt die gleiche organisatorische Dysfunktion:

1. **Die neue Führung hat keine Kenntnis von früheren Feedback-Sitzungen.**
2. **Sie schlägt dieselben überentwickelten Lösungen vor.**
3. **Sie versteht die Einschränkungen ihrer eigenen API nicht.**
4. **Sie möchte mehr Meetings, anstatt das Problem einfach zu beheben.**

Dieses Muster erklärt, warum die PayPal-Teams im Jahr 2025 scheinbar überhaupt keinen Bezug mehr zu dem umfangreichen Feedback aus dem Jahr 2020 haben – die Leute, die dieses Feedback erhalten haben, sind weg und die neue Führung wiederholt dieselben Fehler.

## Jahrelange Fehlerberichte, die sie ignoriert haben {#years-of-bug-reports-they-ignored}

Wir haben uns nicht nur über fehlende Funktionen beschwert. Wir haben aktiv Fehler gemeldet und versucht, bei deren Verbesserung zu helfen. Hier ist eine umfassende Zeitleiste der von uns dokumentierten Probleme:

### 2016: Erste UI/UX-Beschwerden {#2016-early-uiux-complaints}

Bereits 2016 haben wir uns öffentlich an die PayPal-Führung, darunter auch Dan Schulman, gewandt, um Probleme mit der Benutzeroberfläche und der Benutzerfreundlichkeit zu besprechen. Das war vor neun Jahren, und die gleichen UI/UX-Probleme bestehen auch heute noch.

### 2021: Fehlerbericht zu geschäftlichen E-Mails {#2021-business-email-bug-report}

Im März 2021 berichteten wir, dass das Geschäfts-E-Mail-System von PayPal falsche Kündigungsbenachrichtigungen versendete. Die E-Mail-Vorlage enthielt fehlerhaft dargestellte Variablen, was den Kunden verwirrende Nachrichten lieferte.

Mark Stuart erkannte das Problem an:

> Danke, Nick! Ich stelle auf BCC um. @Prasy, ist Ihr Team für diese E-Mail zuständig oder wissen Sie, wer es ist? Die Nachricht „Niftylettuce, LLC, wir werden Ihnen keine Rechnungen mehr stellen“ lässt mich vermuten, dass es eine Verwechslung zwischen Adressat und Inhalt der E-Mail gibt.

**Ergebnis**: Das Problem wurde tatsächlich behoben! Mark Stuart bestätigte:

> Ich habe gerade vom Benachrichtigungsteam erfahren, dass die E-Mail-Vorlage repariert und eingeführt wurde. Vielen Dank für Ihre Meldung.

Dies zeigt, dass sie Dinge reparieren KÖNNEN, wenn sie wollen – bei den meisten Problemen entscheiden sie sich jedoch dagegen.

### 2021: Vorschläge zur Verbesserung der Benutzeroberfläche {#2021-ui-improvement-suggestions}

Im Februar 2021 haben wir ausführliches Feedback zur Benutzeroberfläche ihres Dashboards gegeben, insbesondere zum Abschnitt „Letzte PayPal-Aktivitäten“:

> Ich denke, das Dashboard auf paypal.com, insbesondere die „Letzte PayPal-Aktivität“, muss verbessert werden. Ich finde, die Statuszeilen für wiederkehrende Zahlungen (0 $) „Erstellt“ sollten nicht angezeigt werden – das führt nur zu einer Menge zusätzlicher Zeilen, und man sieht nicht auf einen Blick, wie viel Einnahmen am Tag/in den letzten Tagen generiert wurden.

Mark Stuart hat es an das Team für Verbraucherprodukte weitergeleitet:

> Danke! Ich bin mir nicht sicher, welches Team für die Aktivität zuständig ist, aber ich habe es an den Leiter der Verbraucherprodukte weitergeleitet, um das richtige Team zu finden. Eine wiederkehrende Zahlung von 0,00 $ scheint ein Fehler zu sein. Sollte wahrscheinlich herausgefiltert werden.

**Ergebnis**: Nie behoben. Die Benutzeroberfläche zeigt weiterhin diese nutzlosen $0-Einträge an.

### 2021: Fehler in der Sandbox-Umgebung {#2021-sandbox-environment-failures}

Im November 2021 haben wir kritische Probleme mit der Sandbox-Umgebung von PayPal gemeldet:

* Geheime API-Schlüssel der Sandbox wurden zufällig geändert und deaktiviert.
* Alle Sandbox-Testkonten wurden ohne Benachrichtigung gelöscht.
* Fehlermeldungen beim Aufrufen der Sandbox-Kontodetails.
* Zeitweise Ladefehler.

> Aus irgendeinem Grund wurde mein geheimer Sandbox-API-Schlüssel geändert und deaktiviert. Außerdem wurden alle meine alten Sandbox-Testkonten gelöscht.

> Manchmal werden sie geladen und manchmal nicht. Das ist wahnsinnig frustrierend.

**Ergebnis**: Keine Antwort, keine Lösung. Entwickler haben weiterhin Probleme mit der Zuverlässigkeit der Sandbox.

### 2021: Meldet, dass das System völlig kaputt ist {#2021-reports-system-completely-broken}

Im Mai 2021 berichteten wir, dass das Download-System von PayPal für Transaktionsberichte völlig kaputt war:

> Das Melden von Downloads funktioniert anscheinend momentan nicht und schon den ganzen Tag nicht. Außerdem sollte man wahrscheinlich eine E-Mail-Benachrichtigung erhalten, wenn es fehlschlägt.

Wir haben auch auf das Desaster bei der Sitzungsverwaltung hingewiesen:

> Wenn Sie etwa 5 Minuten lang inaktiv sind, während Sie bei PayPal angemeldet sind, werden Sie abgemeldet. Wenn Sie also die Schaltfläche neben dem Bericht, dessen Status Sie überprüfen möchten, erneut aktualisieren (nachdem Sie ewig gewartet haben), ist es ärgerlich, sich erneut anmelden zu müssen.

Mark Stuart bestätigte das Problem mit dem Sitzungs-Timeout:

> Ich erinnere mich, dass Sie in der Vergangenheit berichtet haben, dass Ihre Sitzung häufig ablief und Ihr Entwicklungsfluss unterbrochen wurde, während Sie zwischen Ihrer IDE und developer.paypal.com oder Ihrem Händler-Dashboard wechselten. Anschließend kamen Sie zurück und wurden wieder abgemeldet.

**Ergebnis**: Die Sitzungs-Timeouts betragen weiterhin 60 Sekunden. Das Berichtssystem schlägt weiterhin regelmäßig fehl.

### 2022: Kern-API-Funktion fehlt (erneut) {#2022-core-api-feature-missing-again}

Im Januar 2022 haben wir das Problem mit der Abonnementliste erneut eskaliert, dieses Mal mit noch mehr Details darüber, welche Fehler in ihrer Dokumentation auftraten:

> Es gibt kein GET, das alle Abonnements auflistet (früher Abrechnungsvereinbarungen genannt)

Wir stellten fest, dass ihre offizielle Dokumentation völlig ungenau war:

> Die API-Dokumente sind außerdem völlig ungenau. Wir dachten, wir könnten das Problem umgehen, indem wir eine fest codierte Liste mit Abonnement-IDs herunterladen. Aber das funktioniert nicht!

> In den offiziellen Dokumenten hier steht: „Das können Sie tun.“ Und hier ist der Haken: Es gibt nirgendwo ein Feld „Abonnement-ID“, das man abhaken könnte.

Christina Monti von PayPal antwortete:

> Entschuldigen Sie die Frustration, die durch die falschen Schritte entsteht. Wir werden das diese Woche beheben.

Sri Shivananda (CTO) dankte uns:

> Vielen Dank für Ihre kontinuierliche Hilfe, uns zu verbessern. Wir wissen das sehr zu schätzen.

**Ergebnis**: Die Dokumentation wurde nie repariert. Der Endpunkt für die Abonnementliste wurde nie erstellt.

## Der Albtraum der Entwicklererfahrung {#the-developer-experience-nightmare}

Die Arbeit mit den APIs von PayPal ist wie eine Zeitreise um 10 Jahre. Hier sind die technischen Probleme, die wir dokumentiert haben:

### Defekte Benutzeroberfläche {#broken-user-interface}

Das PayPal-Entwickler-Dashboard ist eine Katastrophe. Hier sind die Probleme, mit denen wir täglich zu kämpfen haben:

<figure>
<figcaption><div class="alert alert-danger small text-center">
Die Benutzeroberfläche von PayPal ist so fehlerhaft, dass man Benachrichtigungen nicht einmal schließen kann.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Ihr Browser unterstützt das Video-Tag nicht.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Das Entwickler-Dashboard lässt Sie einfach einen Schieberegler ziehen und meldet Sie nach 60 Sekunden ab.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Ihr Browser unterstützt das Video-Tag nicht.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Weitere UI-Probleme in der PayPal-Entwickleroberfläche zeigen fehlerhafte Workflows.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Ihr Browser unterstützt das Video-Tag nicht.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Die Oberfläche zur Abonnementverwaltung – sie ist so schlecht, dass wir uns auf Code verlassen mussten, um Produkte und Abonnements zu generieren.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Ein Blick auf die fehlerhafte Abonnementoberfläche mit fehlender Funktionalität (Produkte/Pläne/Abonnements lassen sich nicht einfach erstellen – und es scheint keine Möglichkeit zu geben, einmal erstellte Produkte oder Pläne in der Benutzeroberfläche zu löschen).
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

* Einmalzahlungen und Abonnements können nicht gleichzeitig verarbeitet werden, ohne dass komplexe Workarounds erforderlich sind, die das Austauschen und erneute Rendern von Schaltflächen beim erneuten Laden des SDK mit Skript-Tags erfordern.
* Das JavaScript SDK verstößt gegen grundlegende Konventionen (Klassennamen in Kleinbuchstaben, keine Instanzprüfung).
* Fehlermeldungen geben nicht an, welche Felder fehlen.
* Inkonsistente Datentypen (Beträge werden als Zeichenfolgen statt als Zahlen angegeben).

### Verstöße gegen die Inhaltssicherheitsrichtlinie {#content-security-policy-violations}

Ihr SDK erfordert unsafe-inline und unsafe-eval in Ihrem CSP, **was Sie dazu zwingt, die Sicherheit Ihrer Site zu gefährden**.

### Dokumentationschaos {#documentation-chaos}

Mark Stuart selbst gab zu:

> Stimmt, es gibt eine absurde Menge an alten und neuen APIs. Es ist wirklich schwierig, das zu finden, wonach man suchen soll (selbst für uns, die wir hier arbeiten).

### Sicherheitslücken {#security-vulnerabilities}

**Die 2FA-Implementierung von PayPal ist fehlerhaft.** Selbst mit aktivierten TOTP-Apps erzwingen sie eine SMS-Verifizierung, was Konten anfällig für SIM-Swapping-Angriffe macht. Wenn Sie TOTP aktiviert haben, sollte ausschließlich dieses verwendet werden. Als Ersatz sollte E-Mail und nicht SMS dienen.

### Sitzungsverwaltungs-Katastrophe {#session-management-disaster}

**Ihr Entwickler-Dashboard meldet Sie nach 60 Sekunden Inaktivität ab.** Versuchen Sie, etwas Produktives zu tun, und Sie müssen ständig Folgendes tun: Anmelden → Captcha → 2FA → Abmelden → wiederholen. Sie verwenden ein VPN? Viel Glück.

## Juli 2025: Der Tropfen, der das Fass zum Überlaufen bringt {#july-2025-the-final-straw}

Nach elf Jahren mit denselben Problemen kam der Knackpunkt während einer routinemäßigen Kontomigration. Wir mussten auf ein neues PayPal-Konto umsteigen, das unserem Firmennamen „Forward Email LLC“ entsprach, um eine übersichtlichere Buchhaltung zu gewährleisten.

Was einfach hätte sein sollen, wurde zu einer kompletten Katastrophe:

* Erste Tests zeigten, dass alles einwandfrei funktionierte.
* Stunden später blockierte PayPal plötzlich und ohne Vorankündigung alle Abonnementzahlungen.
* Kunden konnten nicht zahlen, was zu Verwirrung und Support-Belastung führte.
* Der PayPal-Support gab widersprüchliche Antworten und behauptete, die Konten seien verifiziert.
* Wir waren gezwungen, PayPal-Zahlungen vollständig einzustellen.

<figure>
<figcaption><div class="alert alert-danger small text-center">
Der Fehler, den Kunden beim Bezahlen sahen – keine Erklärung, keine Protokolle, nichts.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Der PayPal-Support behauptete, alles sei in Ordnung, obwohl die Zahlungen völlig unterbrochen waren. In der letzten Nachricht heißt es zwar, dass einige Funktionen wiederhergestellt wurden, aber es werden noch weitere, nicht näher spezifizierte Informationen verlangt – klassisches PayPal-Support-Theater.
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
Der Identitätsprüfungsprozess, der angeblich nichts „behoben“ hat
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
Unklare Nachricht und immer noch keine Lösung. Keine Informationen, Hinweise oder Hinweise darauf, welche zusätzlichen Informationen erforderlich sind. Der Kundensupport meldet sich nicht.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Warum wir PayPal nicht einfach fallen lassen können {#why-we-cant-just-drop-paypal}

Trotz all dieser Probleme können wir PayPal nicht vollständig aufgeben, da einige Kunden nur PayPal als Zahlungsoption nutzen. Wie ein Kunde auf unserer [Statusseite](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515)-Seite schrieb:

> PayPal ist meine einzige Zahlungsmöglichkeit

**Wir müssen eine kaputte Plattform unterstützen, weil PayPal für bestimmte Benutzer ein Zahlungsmonopol geschaffen hat.**

## Der Community-Workaround {#the-community-workaround}

Da PayPal keine grundlegende Abonnementliste bereitstellt, hat die Entwickler-Community Workarounds entwickelt. Wir haben ein Skript zur Verwaltung von PayPal-Abonnements erstellt: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dieses Skript verweist auf einen [Gemeinschaftskern](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), wo Entwickler Lösungen teilen. Benutzer sind tatsächlich [dankt uns](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775), weil sie das bereitstellen, was PayPal schon vor Jahren hätte entwickeln sollen.

## Blockieren von PayPal-Vorlagen aufgrund von Phishing {#blocking-paypal-templates-due-to-phishing}

Die Probleme gehen über APIs hinaus. Die E-Mail-Vorlagen von PayPal sind so schlecht gestaltet, dass wir spezielle Filter in unseren E-Mail-Dienst implementieren mussten, da sie nicht von Phishing-Versuchen zu unterscheiden sind.

### Das eigentliche Problem: Die Vorlagen von PayPal sehen aus wie Betrug {#the-real-problem-paypals-templates-look-like-scams}

Wir erhalten regelmäßig Berichte über PayPal-E-Mails, die genau wie Phishing-Versuche aussehen. Hier ist ein konkretes Beispiel aus unseren Missbrauchsmeldungen:

**Betreff:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Diese E-Mail wurde an `abuse@microsoft.com` weitergeleitet, da es sich offenbar um einen Phishing-Versuch handelte. Das Problem? Sie stammte tatsächlich aus der Sandbox-Umgebung von PayPal, deren Vorlagendesign jedoch so schlecht ist, dass es Phishing-Erkennungssysteme auslöst.

### Unsere Implementierung {#our-implementation}

Sie können unsere PayPal-spezifische Filterung sehen, die in unserem [E-Mail-Filtercode](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) implementiert ist:

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
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Warum wir PayPal sperren mussten {#why-we-had-to-block-paypal}

Wir haben dies eingeführt, weil PayPal sich trotz wiederholter Meldungen an die Missbrauchsteams weigerte, massive Spam-, Phishing- und Betrugsprobleme zu beheben. Zu den von uns blockierten E-Mail-Typen gehören:

* **RT000238** – Verdächtige Rechnungsbenachrichtigungen
* **PPC001017** – Problematische Zahlungsbestätigungen
* **RT000542** – Hackerangriffe auf Geschenknachrichten

### Das Ausmaß des Problems {#the-scale-of-the-problem}

Unsere Spamfilter-Protokolle zeigen die enorme Menge an PayPal-Rechnungs-Spam, den wir täglich verarbeiten. Beispiele für blockierte Betreffzeilen:

* „Rechnung vom PayPal-Abrechnungsteam: Dieser Betrag wird automatisch von Ihrem Konto abgebucht. Bitte kontaktieren Sie uns umgehend unter \[TELEFON].“
* „Rechnung von \[FIRMENNAME] (\[BESTELL-ID])“
* Mehrere Varianten mit unterschiedlichen Telefonnummern und gefälschten Bestell-IDs

Diese E-Mails stammen oft von `outlook.com`-Hosts, scheinen aber aus den legitimen Systemen von PayPal zu stammen, was sie besonders gefährlich macht. Die E-Mails bestehen die SPF-, DKIM- und DMARC-Authentifizierung, da sie über die eigentliche Infrastruktur von PayPal gesendet werden.

Unsere technischen Protokolle zeigen, dass diese Spam-E-Mails legitime PayPal-Header enthalten:

* `X-Email-Type-Id: RT000238` (dieselbe ID, die wir blockieren)
* `From: "service@paypal.com" <service@paypal.com>`
* Gültige DKIM-Signaturen von `paypal.com`
* Korrekte SPF-Einträge, die die Mailserver von PayPal anzeigen

Dies führt zu einer unmöglichen Situation: Legitime PayPal-E-Mails und Spam weisen beide identische technische Merkmale auf.

### Die Ironie {#the-irony}

PayPal, ein Unternehmen, das im Kampf gegen Finanzbetrug führend sein sollte, verwendet so schlecht gestaltete E-Mail-Vorlagen, dass sie Anti-Phishing-Systeme auslösen. Wir sind gezwungen, legitime PayPal-E-Mails zu blockieren, da sie nicht von Betrugsversuchen zu unterscheiden sind.

Dies ist in der Sicherheitsforschung dokumentiert: [Vorsicht vor PayPal-Adressbetrug](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – zeigt, wie PayPals eigene Systeme für Betrug missbraucht werden.

### Auswirkungen auf die reale Welt: Neuartige PayPal-Betrügereien {#real-world-impact-novel-paypal-scams}

Das Problem geht über das schlechte Design der Vorlagen hinaus. Das Rechnungssystem von PayPal ist so leicht auszunutzen, dass Betrüger es regelmäßig missbrauchen, um legitim aussehende betrügerische Rechnungen zu versenden. Der Sicherheitsforscher Gavin Anderegg dokumentierte [Ein neuartiger PayPal-Betrug](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), wo Betrüger echte PayPal-Rechnungen versenden, die alle Authentifizierungsprüfungen bestehen:

> „Bei genauerer Betrachtung der Quelle sah die E-Mail so aus, als käme sie tatsächlich von PayPal (SPF, DKIM und DMARC wurden alle bestanden). Der Button verlinkte außerdem auf eine scheinbar legitime PayPal-URL … Erst nach einer Sekunde dämmerte mir, dass es sich um eine seriöse E-Mail handelte. Ich hatte gerade eine zufällige ‚Rechnung‘ von einem Betrüger erhalten.“

<figure>
<figcaption><div class="alert alert-danger small text-center">
Screenshot zeigt mehrere betrügerische PayPal-Rechnungen, die einen Posteingang überfluten. Alle scheinen legitim, da sie tatsächlich aus den Systemen von PayPal stammen.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Der Forscher stellte fest:

> „Es scheint auch eine Komfortfunktion zu sein, die PayPal sperren sollte. Ich ging sofort davon aus, dass es sich um eine Art Betrug handelte und war nur an den technischen Details interessiert. Es scheint viel zu einfach, und ich befürchte, dass andere darauf hereinfallen könnten.“

Dies veranschaulicht das Problem perfekt: Die eigenen legitimen Systeme von PayPal sind so schlecht konzipiert, dass sie Betrug ermöglichen und gleichzeitig legitime Kommunikation verdächtig erscheinen lassen.

Um die Sache noch schlimmer zu machen, beeinträchtigte dies unsere Zustellbarkeit bei Yahoo, was zu Kundenbeschwerden und stundenlangen sorgfältigen Tests und Musterprüfungen führte.

## PayPals rückwärts gerichteter KYC-Prozess {#paypals-backwards-kyc-process}

Einer der frustrierendsten Aspekte der PayPal-Plattform ist ihr rückständiger Ansatz in Bezug auf Compliance und Know-Your-Customer-Verfahren (KYC). Im Gegensatz zu anderen Zahlungsabwicklern ermöglicht PayPal Entwicklern, ihre APIs zu integrieren und Zahlungen in der Produktion einzuziehen, bevor die ordnungsgemäße Verifizierung abgeschlossen ist.

### So sollte es funktionieren {#how-it-should-work}

Jeder legitime Zahlungsabwickler folgt dieser logischen Abfolge:

1. **Führen Sie zuerst die KYC-Verifizierung durch**
2. **Genehmigen Sie das Händlerkonto**
3. **Ermöglichen Sie den Zugriff auf die Produktions-API**
4. **Ermöglichen Sie den Zahlungseinzug**

Dies schützt sowohl den Zahlungsabwickler als auch den Händler, indem die Einhaltung der Vorschriften sichergestellt wird, bevor Geld den Besitzer wechselt.

### So funktioniert PayPal tatsächlich {#how-paypal-actually-works}

Der Prozess von PayPal ist völlig verkehrt herum:

1. **Sofortiger Zugriff auf die Produktions-API**
2. **Zahlungseinzug stunden- oder tagelang zulassen**
3. **Zahlungen plötzlich und ohne Vorankündigung sperren**
4. **KYC-Dokumentation verlangen, nachdem Kunden bereits betroffen sind**
5. **Händler nicht benachrichtigen**
6. **Kunden das Problem erkennen und melden lassen**

### Die Auswirkungen in der realen Welt {#the-real-world-impact}

Dieser rückwärts gerichtete Prozess führt zu Katastrophen für Unternehmen:

* **Kunden können in Spitzenverkaufszeiten keine Käufe abschließen**
* **Keine Vorwarnung**, dass eine Verifizierung erforderlich ist
* **Keine E-Mail-Benachrichtigung** bei Zahlungssperren
* **Händler erfahren von Problemen durch verwirrte Kunden**
* **Umsatzverlust** in kritischen Geschäftsphasen
* **Vertrauensverlust der Kunden**, wenn Zahlungen auf mysteriöse Weise fehlschlagen

### Das Kontomigrationsdesaster vom Juli 2025 {#the-july-2025-account-migration-disaster}

Genau dieses Szenario spielte sich während unserer routinemäßigen Kontomigration im Juli 2025 ab. PayPal ließ Zahlungen zunächst zu, blockierte sie dann aber plötzlich ohne Benachrichtigung. Wir entdeckten das Problem erst, als Kunden meldeten, dass sie nicht zahlen konnten.

Als wir den Support kontaktierten, erhielten wir widersprüchliche Antworten zu den benötigten Unterlagen und keinen klaren Zeitplan für die Lösung. Dies zwang uns, PayPal-Zahlungen komplett einzustellen, was die Kunden, die keine anderen Zahlungsmöglichkeiten hatten, verwirrte.

### Warum das wichtig ist {#why-this-matters}

PayPals Compliance-Ansatz zeugt von einem grundlegenden Missverständnis der Geschäftsabläufe. Eine ordnungsgemäße KYC-Prüfung sollte **vor** der Produktionsintegration erfolgen, nicht erst, wenn Kunden bereits mit der Zahlung beginnen. Der Mangel an proaktiver Kommunikation bei auftretenden Problemen zeigt, dass PayPal die Bedürfnisse der Händler nicht berücksichtigt.

Dieser rückständige Prozess ist symptomatisch für die umfassenderen organisatorischen Probleme von PayPal: Das Unternehmen priorisiert seine internen Prozesse gegenüber der Erfahrung von Händlern und Kunden, was zu Betriebskatastrophen führt, die viele Unternehmen von seiner Plattform abbringen.

## Wie jeder andere Zahlungsabwickler es richtig macht {#how-every-other-payment-processor-does-it-right}

Die von PayPal abgelehnte Abonnementlistenfunktion ist seit über einem Jahrzehnt Branchenstandard. So gehen andere Zahlungsabwickler mit dieser Grundanforderung um:

### Streifen {#stripe}

Stripe bietet seit dem Start der API eine Abonnementliste an. Die Dokumentation zeigt deutlich, wie alle Abonnements für ein Kunden- oder Händlerkonto abgerufen werden. Dies gilt als grundlegende CRUD-Funktionalität.

### Paddel {#paddle}

Paddle bietet umfassende APIs zur Abonnementverwaltung, einschließlich Auflistung, Filterung und Paginierung. Das Unternehmen weiß, dass Händler ihre wiederkehrenden Einnahmequellen im Blick behalten müssen.

### Coinbase Commerce {#coinbase-commerce}

Sogar Kryptowährungs-Zahlungsabwickler wie Coinbase Commerce bieten eine bessere Abonnementverwaltung als PayPal.

### Quadrat {#square}

Die API von Square umfasst die Abonnementliste als grundlegende Funktion und nicht als nachträglichen Einfall.

### Der Industriestandard {#the-industry-standard}

Jeder moderne Zahlungsabwickler bietet:

* Alle Abonnements auflisten
* Filtern nach Status, Datum, Kunde
* Paginierung für große Datensätze
* Webhook-Benachrichtigungen bei Abonnementänderungen
* Umfassende Dokumentation mit praktischen Beispielen

### Was andere Prozessoren im Vergleich zu PayPal bieten {#what-other-processors-provide-vs-paypal}

**Stripe – Alle Abonnements auflisten:**

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

**Stripe – Filtern nach Kunde:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe – Filtern nach Status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal – Was Sie tatsächlich bekommen:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Verfügbare Endpunkte von PayPal:**

* `POST /v1/billing/subscriptions` – Abonnement erstellen
* `GET /v1/billing/subscriptions/{id}` – EIN Abonnement abschließen (falls Sie die ID kennen)
* `PATCH /v1/billing/subscriptions/{id}` – Abonnement aktualisieren
* `POST /v1/billing/subscriptions/{id}/cancel` – Abonnement kündigen
* `POST /v1/billing/subscriptions/{id}/suspend` – Abonnement pausieren

**Was bei PayPal fehlt:**

* ❌ Kein `GET /v1/billing/subscriptions` (alle auflisten)
* ❌ Keine Suchfunktion
* ❌ Keine Filterung nach Status, Kunde, Datum
* ❌ Keine Paginierungsunterstützung

PayPal ist der einzige große Zahlungsabwickler, der Entwickler dazu zwingt, Abonnement-IDs manuell in ihren eigenen Datenbanken zu verfolgen.

## PayPals systematische Vertuschung: 6 Millionen Stimmen werden zum Schweigen gebracht {#paypals-systematic-cover-up-silencing-6-million-voices}

In einem Schritt, der PayPals Ansatz im Umgang mit Kritik perfekt verkörpert, hat das Unternehmen vor Kurzem sein gesamtes Community-Forum offline genommen, wodurch über sechs Millionen Mitglieder effektiv zum Schweigen gebracht und Hunderttausende von Posts gelöscht wurden, die seine Fehler dokumentierten.

### Die große Auslöschung {#the-great-erasure}

Die ursprüngliche PayPal-Community unter `paypal-community.com` hatte **6.003.558 Mitglieder** und enthielt Hunderttausende von Beiträgen, Fehlerberichten, Beschwerden und Diskussionen über PayPals API-Fehler. Dies entspricht über einem Jahrzehnt dokumentierter Beweise für die systematischen Probleme von PayPal.

Am 30. Juni 2025 hat PayPal das gesamte Forum stillschweigend offline genommen. Alle `paypal-community.com`-Links geben nun 404-Fehler zurück. Dies war keine Migration oder Aktualisierung.

### Die Rettung durch Drittanbieter {#the-third-party-rescue}

Glücklicherweise hat ein Drittanbieterdienst unter [ppl.lithium.com](https://ppl.lithium.com/) einen Teil der Inhalte gespeichert, sodass wir auf die Diskussionen zugreifen können, die PayPal zu verbergen versuchte. Diese Speicherung durch den Drittanbieter ist jedoch unvollständig und könnte jederzeit verloren gehen.

Dieses Muster der Beweisverschleierung ist für PayPal nichts Neues. Das Unternehmen verfügt über eine dokumentierte Geschichte von:

* Kritische Fehlerberichte werden aus der öffentlichen Ansicht entfernt.
* Entwicklertools werden ohne Vorankündigung eingestellt.
* APIs werden ohne entsprechende Dokumentation geändert.
* Community-Diskussionen über ihre Fehler werden unterdrückt.

Die Abschaltung des Forums stellt den bislang dreistesten Versuch dar, ihre systematischen Fehler vor der Öffentlichkeit zu verbergen.

## Das 11-jährige Capture-Bug-Desaster: 1.899 $ und es geht weiter {#the-11-year-capture-bug-disaster-1899-and-counting}

Während PayPal eifrig Feedback-Sitzungen organisierte und Versprechungen machte, ist das zentrale Zahlungsabwicklungssystem seit über elf Jahren grundlegend kaputt. Die Beweise sind verheerend.

### Verlust von 1.899 $ durch Weiterleitung der E-Mail {#forward-emails-1899-loss}

In unseren Produktionssystemen entdeckten wir 108 PayPal-Zahlungen im Gesamtwert von **1.899 US-Dollar**, die aufgrund von Erfassungsfehlern bei PayPal verloren gingen. Diese Zahlungen weisen ein einheitliches Muster auf:

* `CHECKOUT.ORDER.APPROVED` Webhooks wurden empfangen.
* Die Erfassungs-API von PayPal gab 404-Fehler zurück.
* Bestellungen waren über die PayPal-API nicht mehr zugänglich.

Es ist unmöglich festzustellen, ob den Kunden Kosten in Rechnung gestellt wurden, da PayPal die Debug-Protokolle nach 14 Tagen vollständig verbirgt und alle Daten für nicht erfasste Bestellnummern aus dem Dashboard löscht.

Dies betrifft nur ein einziges Unternehmen. **Die Gesamtverluste Tausender Händler über mehr als 11 Jahre belaufen sich wahrscheinlich auf mehrere Millionen Dollar.**

**Wir sagen es noch einmal: Die Gesamtverluste Tausender Händler über einen Zeitraum von mehr als 11 Jahren belaufen sich wahrscheinlich auf mehrere Millionen Dollar.**

Der einzige Grund, warum wir das herausgefunden haben, ist, dass wir unglaublich akribisch und datenorientiert vorgehen.

### Der Originalbericht von 2013: Über 11 Jahre Fahrlässigkeit {#the-2013-original-report-11-years-of-negligence}

Der früheste dokumentierte Bericht zu genau diesem Problem erscheint auf [Stack Overflow im November 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archiviert](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> „Beim Erfassen einer Aufnahme wird weiterhin der 404-Fehler mit der Rest-API angezeigt.“

Der im Jahr 2013 gemeldete Fehler ist **identisch** mit dem, was Forward Email im Jahr 2024 erlebt hat:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Die Reaktion der Community im Jahr 2013 war aufschlussreich:

> „Derzeit liegt ein gemeldetes Problem mit der REST-API vor. PayPal arbeitet daran.“

**Über 11 Jahre später arbeiten sie immer noch daran.**

### Das Eingeständnis von 2016: PayPal macht sein eigenes SDK kaputt {#the-2016-admission-paypal-breaks-their-own-sdk}

Im Jahr 2016 dokumentierte PayPals GitHub-Repository den Fehler [massive Erfassungsfehler](https://github.com/paypal/PayPal-PHP-SDK/issues/660), der das offizielle PHP SDK beeinträchtigte. Das Ausmaß war erschütternd:

> „Seit dem 20.09.2016 schlagen alle PayPal-Erfassungsversuche mit der Fehlermeldung ‚INVALID_RESOURCE_ID – Die angeforderte Ressourcen-ID wurde nicht gefunden.‘ fehl. Zwischen dem 19.09. und dem 20.09. wurde an der API-Integration nichts geändert. **100 % der Erfassungsversuche seit dem 20.09. haben diesen Fehler zurückgegeben.**“

Ein Händler berichtete:

> „Ich hatte **in den letzten 24 Stunden über 1.400 fehlgeschlagene Erfassungsversuche**, alle mit der Fehlerantwort INVALID_RESOURCE_ID.“

PayPal reagierte zunächst darauf, dem Händler die Schuld zu geben und ihn an den technischen Support zu verweisen. Erst nach massivem Druck gaben sie den Fehler zu:

> „Ich habe ein Update von unseren Produktentwicklern. Ihnen ist in den gesendeten Headern aufgefallen, dass die PayPal-Anforderungs-ID mit 42 Zeichen gesendet wird, aber **es scheint, als hätte es kürzlich eine Änderung gegeben, die diese ID auf nur 38 Zeichen begrenzt.**“

Dieses Eingeständnis offenbart die systematische Fahrlässigkeit von PayPal:

1. **Sie nahmen undokumentierte, schwerwiegende Änderungen vor.**
2. **Sie beschädigten ihr eigenes offizielles SDK.**
3. **Sie gaben zuerst den Händlern die Schuld.**
4. **Sie gaben den Fehler erst unter Druck zu.**

Selbst nachdem das Problem „behoben“ war, berichteten die Händler:

> „SDK auf v1.7.4 aktualisiert und **das Problem besteht weiterhin.**“

### Die Eskalation 2024: Immer noch gebrochen {#the-2024-escalation-still-broken}

Aktuelle Berichte der PayPal-Community zeigen, dass sich das Problem sogar noch verschärft hat. Ein [Diskussion im September 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archiviert](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentiert genau dieselben Probleme:

> „Das Problem ist erst seit etwa zwei Wochen aufgetreten und betrifft nicht alle Bestellungen. **Das viel häufigere Problem scheinen 404-Fehler bei der Erfassung zu sein.**“

Der Händler beschreibt dasselbe Muster, das bei der Weiterleitung von E-Mails aufgetreten ist:

> „Nach dem Versuch, die Bestellung zu erfassen, gibt PayPal eine 404-Fehlermeldung zurück. Beim Abrufen der Bestelldetails: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dies geschieht ohne jegliche Spur einer erfolgreichen Erfassung unsererseits.**“

### Die Webhook-Zuverlässigkeitskatastrophe {#the-webhook-reliability-disaster}

Ein weiterer [erhaltene Community-Diskussion](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) zeigt, dass das Webhook-System von PayPal grundsätzlich unzuverlässig ist:

> „Theoretisch sollte es zwei Ereignisse (CHECKOUT.ORDER.APPROVED und PAYMENT.CAPTURE.COMPLETED) vom Webhook-Ereignis geben. Tatsächlich **werden diese beiden Ereignisse selten sofort empfangen, PAYMENT.CAPTURE.COMPLETED kann meistens nicht empfangen werden oder würde erst nach ein paar Stunden empfangen werden.“

Für Abonnementzahlungen:

> „**‚PAYMENT.SALE.COMPLETED‘ wurde manchmal oder erst nach einigen Stunden empfangen.**“

Die Fragen des Händlers offenbaren das Ausmaß der Zuverlässigkeitsprobleme von PayPal:

1. **„Warum passiert das?“** – Das Webhook-System von PayPal ist grundsätzlich defekt.
2. **„Wenn der Bestellstatus ‚ABGESCHLOSSEN‘ lautet, kann ich dann davon ausgehen, dass ich das Geld erhalten habe?“** – Händler können den API-Antworten von PayPal nicht vertrauen.
3. **„Warum findet ‚Ereignisprotokolle -> Webhook-Ereignisse‘ keine Protokolle?“** – Selbst PayPals eigenes Protokollierungssystem funktioniert nicht.

### Das Muster systematischer Fahrlässigkeit {#the-pattern-of-systematic-negligence}

Die Beweise erstrecken sich über mehr als 11 Jahre und zeigen ein klares Muster:

* **2013**: „PayPal arbeitet daran.“
* **2016**: PayPal gibt schwerwiegende Änderungen zu und stellt fehlerhafte Lösung bereit.
* **2024**: Dieselben Fehler treten weiterhin auf und betreffen die Funktion „E-Mail weiterleiten“ und zahlreiche andere Funktionen.

Dies ist kein Fehler – **das ist systematische Fahrlässigkeit.** PayPal kennt diese kritischen Fehler bei der Zahlungsabwicklung seit über einem Jahrzehnt und hat konsequent:

1. **Händler für PayPal-Fehler verantwortlich gemacht**
2. **Undokumentierte, schwerwiegende Änderungen vorgenommen**
3. **Unzureichende, nicht funktionierende Fehlerbehebungen bereitgestellt**
4. **Finanzielle Auswirkungen auf Unternehmen ignoriert**
5. **Beweise durch die Sperrung von Community-Foren versteckt**

### Die undokumentierte Anforderung {#the-undocumented-requirement}

Nirgendwo in der offiziellen PayPal-Dokumentation wird erwähnt, dass Händler eine Wiederholungslogik für Erfassungsvorgänge implementieren müssen. In der Dokumentation heißt es zwar, Händler sollten „sofort nach der Genehmigung erfassen“, aber es wird nicht erwähnt, dass ihre API zufällig 404-Fehler zurückgibt, die komplexe Wiederholungsmechanismen erfordern.

Dies zwingt jeden Händler dazu:

* Implementierung einer exponentiellen Backoff-Wiederholungslogik
* Umgang mit inkonsistenter Webhook-Auslieferung
* Aufbau komplexer Zustandsverwaltungssysteme
* Manuelle Überwachung fehlgeschlagener Erfassungen

**Jeder andere Zahlungsabwickler bietet zuverlässige Erfassungs-APIs, die beim ersten Mal funktionieren.**

## PayPals umfassenderes Täuschungsmuster {#paypals-broader-pattern-of-deception}

Das Capture-Bug-Desaster ist nur ein Beispiel für die systematische Vorgehensweise von PayPal, Kunden zu täuschen und ihre Fehler zu vertuschen.

### Maßnahmen des New York Department of Financial Services {#the-new-york-department-of-financial-services-action}

Im Januar 2025 verhängte das New York Department of Financial Services eine [Zwangsmaßnahmen gegen PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)-Strafanzeige wegen betrügerischer Praktiken. Dies zeigt, dass das Betrugsmuster von PayPal weit über die APIs hinausgeht.

Diese Regulierungsmaßnahme zeigt, dass PayPal bereit ist, im gesamten Unternehmen irreführende Praktiken anzuwenden, nicht nur bei seinen Entwicklertools.

### Der Honey-Prozess: Affiliate-Links umschreiben {#the-honey-lawsuit-rewriting-affiliate-links}

Die Übernahme von Honey durch PayPal hat dazu geführt, dass Content-Erstellern und Influencern Provisionen gestohlen wurden. Dies stellt eine weitere Form systematischer Täuschung dar, bei der PayPal durch die Umleitung von Einnahmen profitiert, die anderen zugutekommen sollten.

Das Muster ist klar:

1. **API-Fehler**: Defekte Funktionen verbergen, Händler beschuldigen
2. **Community zum Schweigen bringen**: Hinweise auf Probleme beseitigen
3. **Verstöße gegen Vorschriften**: Täuschende Praktiken
4. **Affiliate-Diebstahl**: Provisionen durch technische Manipulation stehlen

### Die Kosten der Nachlässigkeit von PayPal {#the-cost-of-paypals-negligence}

Der Verlust von Forward Email in Höhe von 1.899 US-Dollar stellt nur die Spitze des Eisbergs dar. Betrachten wir die weitreichenderen Auswirkungen:

* **Einzelhändler**: Tausende verlieren jeweils Hunderte bis Tausende von Dollar.
* **Unternehmenskunden**: Potenziell Millionen an Umsatzeinbußen.
* **Entwicklerzeit**: Unzählige Stunden für die Entwicklung von Workarounds für die fehlerhaften PayPal-APIs.
* **Kundenvertrauen**: Unternehmen verlieren Kunden aufgrund von Zahlungsausfällen bei PayPal.

Wenn ein kleiner E-Mail-Dienst fast 2.000 US-Dollar verloren hat und dieses Problem seit über 11 Jahren besteht und Tausende von Händlern betrifft, beläuft sich der gesamte finanzielle Schaden wahrscheinlich auf **Hunderte Millionen Dollar**.

### Die Dokumentationslüge {#the-documentation-lie}

In der offiziellen Dokumentation von PayPal werden die kritischen Einschränkungen und Fehler, auf die Händler stoßen werden, nicht erwähnt. Zum Beispiel:

* **Capture API**: Kein Hinweis darauf, dass 404-Fehler häufig sind und eine Wiederholungslogik erfordern.
* **Webhook-Zuverlässigkeit**: Kein Hinweis darauf, dass Webhooks oft stundenlang verzögert sind.
* **Abonnement-Listing**: Die Dokumentation legt nahe, dass ein Listing möglich ist, wenn kein Endpunkt vorhanden ist.
* **Sitzungs-Timeouts**: Kein Hinweis auf aggressive 60-Sekunden-Timeouts.

Dieses systematische Weglassen wichtiger Informationen zwingt Händler dazu, die Grenzen von PayPal durch Ausprobieren in Produktionssystemen zu entdecken, was oft zu finanziellen Verlusten führt.

## Was das für Entwickler bedeutet {#what-this-means-for-developers}

Das systematische Versäumnis von PayPal, auf die grundlegenden Bedürfnisse der Entwickler einzugehen und gleichzeitig umfassendes Feedback einzuholen, zeigt ein grundlegendes organisatorisches Problem. Das Sammeln von Feedback wird als Ersatz für die tatsächliche Problembehebung betrachtet.

Das Muster ist klar:

1. Entwickler melden Probleme.
2. PayPal organisiert Feedback-Sitzungen mit Führungskräften.
3. Umfangreiches Feedback wird bereitgestellt.
4. Teams erkennen Lücken an und versprechen, diese zu verfolgen und zu beheben.
5. Nichts wird umgesetzt.
6. Führungskräfte wechseln zu besseren Unternehmen.
7. Neue Teams bitten um dasselbe Feedback.
8. Der Zyklus wiederholt sich.

In der Zwischenzeit sind Entwickler gezwungen, Workarounds zu erstellen, die Sicherheit zu gefährden und mit defekten Benutzeroberflächen zu kämpfen, nur um Zahlungen akzeptieren zu können.

Wenn Sie ein Zahlungssystem entwickeln, profitieren Sie von unserer Erfahrung: Bauen Sie Ihren [Trifecta-Ansatz](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) mit mehreren Prozessoren auf, erwarten Sie jedoch nicht, dass PayPal die benötigten Grundfunktionen bereitstellt. Planen Sie von Anfang an Workarounds ein.

> Dieser Beitrag dokumentiert unsere elfjährige Erfahrung mit den PayPal-APIs bei Forward Email. Alle Codebeispiele und Links stammen aus unseren aktuellen Produktionssystemen. Wir unterstützen PayPal-Zahlungen trotz dieser Probleme weiterhin, da manche Kunden keine andere Wahl haben.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />