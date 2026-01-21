# Warum Open-Source-E-Mail die Zukunft ist: Der Vorteil der E-Mail-Weiterleitung {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Inhaltsverzeichnis {#table-of-contents}

* [Vorwort](#foreword)
* [Der Open-Source-Vorteil: Mehr als nur Marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Was echte Open Source bedeutet](#what-true-open-source-means)
  * [Das Backend-Problem: Wo die meisten „Open-Source“-E-Mail-Dienste versagen](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [E-Mail weiterleiten: 100 % Open Source, Frontend UND Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Unser einzigartiger technischer Ansatz](#our-unique-technical-approach)
* [Die Self-Hosting-Option: Wahlfreiheit](#the-self-hosting-option-freedom-of-choice)
  * [Warum wir Self-Hosting unterstützen](#why-we-support-self-hosting)
  * [Die Realität des Self-Hosting von E-Mails](#the-reality-of-self-hosting-email)
* [Warum unser kostenpflichtiger Service sinnvoll ist (obwohl wir Open Source sind)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Kostenvergleich](#cost-comparison)
  * [Das Beste aus beiden Welten](#the-best-of-both-worlds)
* [Die Closed-Source-Täuschung: Was Proton und Tutanota Ihnen nicht sagen](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Die Open-Source-Ansprüche von Proton Mail](#proton-mails-open-source-claims)
  * [Tutanotas ähnlicher Ansatz](#tutanotas-similar-approach)
  * [Die Debatte um Datenschutzleitfäden](#the-privacy-guides-debate)
* [Die Zukunft ist Open Source](#the-future-is-open-source)
  * [Warum Open Source gewinnt](#why-open-source-is-winning)
* [Umstellung auf E-Mail-Weiterleitung](#making-the-switch-to-forward-email)
* [Fazit: Open-Source-E-Mail für eine private Zukunft](#conclusion-open-source-email-for-a-private-future)

## Vorwort {#foreword}

In einer Zeit, in der Datenschutzbedenken so groß wie nie zuvor sind, ist die Wahl unseres E-Mail-Dienstes wichtiger denn je. Viele Anbieter behaupten zwar, Ihre Privatsphäre zu schützen, doch es besteht ein grundlegender Unterschied zwischen denen, die nur über Datenschutz reden, und denen, die ihn auch wirklich umsetzen. Bei Forward Email haben wir unseren Service auf der Grundlage vollständiger Transparenz durch Open-Source-Entwicklung aufgebaut – nicht nur in unseren Frontend-Anwendungen, sondern in unserer gesamten Infrastruktur.

In diesem Blogbeitrag wird untersucht, warum Open-Source-E-Mail-Lösungen Closed-Source-Alternativen überlegen sind, wie sich unser Ansatz von Wettbewerbern wie Proton Mail und Tutanota unterscheidet und warum – trotz unseres Engagements für Self-Hosting-Optionen – unser kostenpflichtiger Dienst für die meisten Benutzer das beste Preis-Leistungs-Verhältnis bietet.

## Der Open-Source-Vorteil: Mehr als nur Marketing {#the-open-source-advantage-more-than-just-marketing}

Der Begriff „Open Source“ hat sich in den letzten Jahren zu einem beliebten Marketing-Schlagwort entwickelt. Der globale Markt für Open-Source-Dienste wird zwischen 2024 und 2032 voraussichtlich mit einer durchschnittlichen jährlichen Wachstumsrate von über 16 % wachsen[^1]. Doch was bedeutet „Open Source“ wirklich und warum ist es für Ihren E-Mail-Datenschutz wichtig?

### Was echte Open Source bedeutet {#what-true-open-source-means}

Bei Open-Source-Software ist der gesamte Quellcode frei zugänglich und kann von jedem eingesehen, geändert und erweitert werden. Diese Transparenz schafft eine Umgebung, in der:

* Sicherheitslücken können von einer globalen Entwickler-Community identifiziert und behoben werden.
* Datenschutzansprüche können durch unabhängige Code-Überprüfungen überprüft werden.
* Nutzer sind nicht an proprietäre Ökosysteme gebunden.
* Innovationen entstehen schneller durch gemeinschaftliche Verbesserung.

Wenn es um E-Mail geht – das Rückgrat Ihrer Online-Identität – ist diese Transparenz nicht nur schön, sondern für echte Privatsphäre und Sicherheit unerlässlich.

### Das Backend-Problem: Wo die meisten „Open-Source“-E-Mail-Dienste zu kurz kommen {#the-backend-problem-where-most-open-source-email-services-fall-short}

Und hier wird es interessant. Viele beliebte, datenschutzorientierte E-Mail-Anbieter werben mit Open Source-Angeboten, aber es gibt einen entscheidenden Unterschied, von dem sie hoffen, dass Sie ihn nicht bemerken: **Sie stellen nur ihre Frontends als Open Source zur Verfügung, während ihre Backends geschlossen bleiben**.

Was bedeutet das? Das Frontend ist das, was Sie sehen und womit Sie interagieren – die Weboberfläche oder die mobile App. Im Backend findet die eigentliche E-Mail-Verarbeitung statt – hier werden Ihre Nachrichten gespeichert, verschlüsselt und übertragen. Wenn ein Anbieter sein Backend Closed Source hält:

1. Sie können nicht überprüfen, wie Ihre E-Mails tatsächlich verarbeitet werden.
2. Sie können nicht bestätigen, ob die Datenschutzangaben berechtigt sind.
3. Sie vertrauen Marketingaussagen statt verifizierbarem Code.
4. Sicherheitslücken bleiben möglicherweise vor der Öffentlichkeit verborgen.

Wie Diskussionen in den Foren von Privacy Guides gezeigt haben, geben sowohl Proton Mail als auch Tutanota an, Open Source zu sein, ihre Backends bleiben jedoch geschlossen und proprietär[^2]. Dies schafft eine erhebliche Vertrauenslücke – man wird gebeten, ihren Datenschutzversprechen Glauben zu schenken, ohne sie überprüfen zu können.

## E-Mail weiterleiten: 100 % Open Source, Frontend UND Backend {#forward-email-100-open-source-frontend-and-backend}

Bei Forward Email verfolgen wir einen grundlegend anderen Ansatz. Unsere gesamte Codebasis – sowohl Frontend als auch Backend – ist Open Source und steht jedem zur Einsicht unter <https://github.com/forwardemail/forwardemail.net>. zur Verfügung.

Das heisst:

1. **Vollständige Transparenz**: Jede Codezeile, die Ihre E-Mails verarbeitet, ist öffentlich einsehbar.
2. **Nachprüfbarer Datenschutz**: Unsere Datenschutzversprechen sind kein Marketing-Sprech – sie sind nachprüfbare Fakten, die jeder durch Prüfung unseres Codes bestätigen kann.
3. **Community-gesteuerte Sicherheit**: Unsere Sicherheit wird durch das gesammelte Fachwissen der globalen Entwickler-Community gestärkt.
4. **Keine versteckten Funktionen**: Was Sie sehen, ist das, was Sie bekommen – kein verstecktes Tracking, keine geheimen Hintertüren.

### Unser einzigartiger technischer Ansatz {#our-unique-technical-approach}

Unser Engagement für den Datenschutz geht über die Open-Source-Technologie hinaus. Wir haben mehrere technische Innovationen implementiert, die uns von anderen abheben:

#### Individuell verschlüsselte SQLite-Postfächer {#individually-encrypted-sqlite-mailboxes}

Im Gegensatz zu herkömmlichen E-Mail-Anbietern, die gemeinsam genutzte relationale Datenbanken verwenden (bei denen ein einziger Datendiebstahl alle Benutzerdaten preisgeben könnte), verwenden wir für jedes Postfach individuell verschlüsselte SQLite-Dateien. Das bedeutet:

* Jedes Postfach ist eine separate verschlüsselte Datei.
* Der Zugriff auf die Daten eines Nutzers berechtigt nicht zu deren Zugriff.
* Selbst unsere eigenen Mitarbeiter haben keinen Zugriff auf Ihre Daten – das ist eine zentrale Designentscheidung.

Wie wir in den Diskussionen zu den Datenschutzleitfäden erklärt haben:

> „Gemeinsam genutzte relationale Datenbanken (z. B. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL usw.) erfordern alle eine Anmeldung (mit Benutzername/Passwort), um eine Verbindung zur Datenbank herzustellen. Das bedeutet, dass jeder mit diesem Passwort die Datenbank nach allem Möglichen abfragen kann – sei es ein betrügerischer Mitarbeiter oder ein bösartiger Angriff. Das bedeutet auch, dass der Zugriff auf die Daten eines Benutzers auch Zugriff auf die Daten aller anderen Benutzer hat. SQLite hingegen könnte als gemeinsam genutzte Datenbank betrachtet werden, aber die Art und Weise, wie wir es verwenden (jedes Postfach = eine einzelne SQLite-Datei), macht es zu einer Sandbox.“\[^3]

#### Quantenresistente Verschlüsselung {#quantum-resistant-encryption}

Während andere Anbieter noch aufholen müssen, haben wir bereits quantenresistente Verschlüsselungsmethoden implementiert, um Ihre E-Mail-Privatsphäre zukunftssicher gegen neue Bedrohungen durch Quantencomputer zu machen.

#### Keine Abhängigkeiten von Drittanbietern {#no-third-party-dependencies}

Im Gegensatz zu Wettbewerbern, die für die E-Mail-Zustellung auf Dienste wie Amazon SES angewiesen sind, haben wir unsere gesamte Infrastruktur selbst entwickelt. Dadurch werden potenzielle Datenschutzverletzungen durch Drittanbieterdienste ausgeschlossen und wir haben die vollständige Kontrolle über die gesamte E-Mail-Pipeline.

## Die Self-Hosting-Option: Wahlfreiheit {#the-self-hosting-option-freedom-of-choice}

Einer der größten Vorteile von Open-Source-Software ist die Freiheit, die sie bietet. Mit Forward Email sind Sie nie gebunden – Sie können unsere gesamte Plattform auf Wunsch selbst hosten.

### Warum wir Self-Hosting unterstützen {#why-we-support-self-hosting}

Wir legen Wert darauf, Nutzern die volle Kontrolle über ihre Daten zu geben. Deshalb haben wir unsere gesamte Plattform selbsthostbar gestaltet und bieten umfassende Dokumentation und Einrichtungsanleitungen. Dieser Ansatz:

* Bietet technisch versierten Nutzern maximale Kontrolle.
* Macht Vertrauen zu uns als Dienstleister überflüssig.
* Ermöglicht individuelle Anpassungen an spezifische Anforderungen.
* Stellt sicher, dass der Service auch dann weiterlaufen kann, wenn unser Unternehmen nicht mehr

### Die Realität des Self-Hosting von E-Mails {#the-reality-of-self-hosting-email}

Obwohl Self-Hosting eine leistungsstarke Option ist, ist es wichtig, die tatsächlichen Kosten zu verstehen:

#### Finanzielle Kosten {#financial-costs}

* VPS- oder Serverkosten: 5–50 $/Monat für eine Basiskonfiguration [^4]
* Domainregistrierung und -verlängerung: 10–20 $/Jahr
* SSL-Zertifikate (Let’s Encrypt bietet jedoch kostenlose Optionen an)
* Mögliche Kosten für Überwachungsdienste und Backup-Lösungen

#### Zeitkosten {#time-costs}

* Ersteinrichtung: Mehrere Stunden bis Tage, je nach technischem Fachwissen
* Laufende Wartung: 5–10 Stunden/Monat für Updates, Sicherheitspatches und Fehlerbehebung [^5]
* Lernaufwand: Verständnis von E-Mail-Protokollen, bewährten Sicherheitspraktiken und Serveradministration

#### Technische Herausforderungen {#technical-challenges}

* Probleme mit der E-Mail-Zustellbarkeit (als Spam markierte Nachrichten)
* Einhaltung der sich entwickelnden Sicherheitsstandards
* Gewährleistung hoher Verfügbarkeit und Zuverlässigkeit
* Effektive Verwaltung der Spam-Filterung

Ein erfahrener Self-Hoster drückte es so aus: „E-Mail ist ein Massendienst... Es ist günstiger, meine E-Mails bei \[einem Anbieter] zu hosten, als Geld *und* Zeit für das eigene Hosting aufzuwenden.“\[^6]

## Warum unser kostenpflichtiger Service sinnvoll ist (obwohl wir Open Source sind) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Angesichts der Herausforderungen des Self-Hostings bietet unser kostenpflichtiger Service das Beste aus beiden Welten: die Transparenz und Sicherheit von Open Source mit dem Komfort und der Zuverlässigkeit eines verwalteten Dienstes.

### Kostenvergleich {#cost-comparison}

Wenn Sie sowohl die finanziellen als auch die zeitlichen Kosten berücksichtigen, bietet unser kostenpflichtiger Service einen außergewöhnlichen Mehrwert:

* **Gesamtkosten für Self-Hosting**: 56–252 $/Monat (inkl. Serverkosten und Zeitbewertung)
* **Kostenpflichtige E-Mail-Weiterleitungstarife**: 3–9 $/Monat

Unser kostenpflichtiger Service bietet:

* Professionelle Verwaltung und Wartung
* Etablierte IP-Reputation für bessere Zustellbarkeit
* Regelmäßige Sicherheitsupdates und -überwachung
* Support bei Problemen
* Alle Datenschutzvorteile unseres Open-Source-Ansatzes

### Das Beste aus beiden Welten {#the-best-of-both-worlds}

Wenn Sie „E-Mail weiterleiten“ wählen, erhalten Sie:

1. **Nachprüfbarer Datenschutz**: Dank unserer Open-Source-Codebasis können Sie unseren Datenschutzbestimmungen vertrauen.
2. **Professionelles Management**: Sie müssen kein E-Mail-Server-Experte werden.
3. **Kostengünstig**: Niedrigere Gesamtkosten als beim Self-Hosting.
4. **Frei von Lock-in-Situationen**: Die Option zum Self-Hosting bleibt jederzeit verfügbar.

## Die Closed-Source-Täuschung: Was Proton und Tutanota Ihnen nicht sagen {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Sehen wir uns genauer an, wie sich unser Ansatz von dem beliebter, auf Datenschutz ausgerichteter E-Mail-Anbieter unterscheidet.

### Open-Source-Ansprüche von Proton Mail {#proton-mails-open-source-claims}

Proton Mail wirbt zwar mit Open Source, dies gilt jedoch nur für die Frontend-Anwendungen. Das Backend – wo Ihre E-Mails tatsächlich verarbeitet und gespeichert werden – bleibt weiterhin Closed Source [^7]. Das bedeutet:

* Sie können nicht überprüfen, wie Ihre E-Mails verarbeitet werden.
* Sie müssen den Datenschutzbestimmungen ohne Überprüfung vertrauen.
* Sicherheitslücken im Backend bleiben der Öffentlichkeit verborgen.
* Sie sind an das Ökosystem gebunden und haben keine Self-Hosting-Optionen.

### Tutanotas ähnlicher Ansatz {#tutanotas-similar-approach}

Wie Proton Mail stellt Tutanota nur sein Frontend als Open Source zur Verfügung, während das Backend proprietär bleibt. [^8] Sie stehen vor den gleichen Vertrauensproblemen:

* Keine Möglichkeit, Backend-Datenschutzansprüche zu überprüfen
* Eingeschränkte Transparenz der tatsächlichen E-Mail-Verarbeitung
* Mögliche Sicherheitsprobleme werden der Öffentlichkeit verborgen
* Anbieterabhängigkeit ohne Self-Hosting-Option

### Die Debatte um Datenschutzleitfäden {#the-privacy-guides-debate}

Diese Einschränkungen sind in der Datenschutz-Community nicht unbemerkt geblieben. In Diskussionen zu Datenschutzleitfäden haben wir diesen kritischen Unterschied hervorgehoben:

> "Hier steht, dass sowohl Protonmail als auch Tuta Closed Source sind. Weil ihr Backend tatsächlich Closed Source ist."\[^9]

Wir haben außerdem erklärt:

> „Es gibt weder öffentlich zugängliche Audits der Backend-Infrastrukturen der derzeit aufgeführten PG-E-Mail-Dienstanbieter noch wurden Open-Source-Codeausschnitte zur Verarbeitung eingehender E-Mails veröffentlicht.“\[^10]

Dieser Mangel an Transparenz führt zu einem grundlegenden Vertrauensproblem. Ohne Open-Source-Backends sind Nutzer gezwungen, Datenschutzansprüche auf Treu und Glauben zu akzeptieren, anstatt sie zu überprüfen.

## Die Zukunft ist Open Source {#the-future-is-open-source}

Der Trend zu Open-Source-Lösungen beschleunigt sich in der gesamten Softwarebranche. Aktuellen Studien zufolge:

* Der Markt für Open-Source-Software wächst von 41,83 Milliarden US-Dollar im Jahr 2024 auf 48,92 Milliarden US-Dollar im Jahr 2025. [^11]
* 80 % der Unternehmen berichten von einer verstärkten Nutzung von Open Source im vergangenen Jahr. [^12]
* Die Nutzung von Open Source wird voraussichtlich weiter rasant zunehmen.

Dieses Wachstum spiegelt einen grundlegenden Wandel in unserem Denken über Softwaresicherheit und Datenschutz wider. Da die Nutzer zunehmend datenschutzbewusster werden, wird die Nachfrage nach nachweisbarem Datenschutz durch Open-Source-Lösungen weiter steigen.

### Warum Open Source gewinnt {#why-open-source-is-winning}

Die Vorteile von Open Source werden immer deutlicher:

1. **Sicherheit durch Transparenz**: Open-Source-Code kann von Tausenden von Experten geprüft werden, nicht nur von einem internen Team.
2. **Schnellere Innovation**: Gemeinsame Entwicklung beschleunigt Verbesserungen.
3. **Vertrauen durch Verifizierung**: Aussagen können überprüft werden, anstatt einfach so übernommen zu werden.
4. **Freiheit von Anbieterabhängigkeit**: Nutzer behalten die Kontrolle über ihre Daten und Dienste.
5. **Community-Support**: Eine globale Community hilft bei der Identifizierung und Behebung von Problemen.

## Umstellung auf E-Mail-Weiterleitung {#making-the-switch-to-forward-email}

Der Wechsel zu Forward Email ist unkompliziert, egal ob Sie von einem Mainstream-Anbieter wie Gmail oder einem anderen datenschutzorientierten Dienst wie Proton Mail oder Tutanota kommen.

Unsere Serviceangebote:

* Unbegrenzte Anzahl an Domains und Aliasen
* Standardprotokollunterstützung (SMTP, IMAP, POP3) ohne proprietäre Bridges
* Nahtlose Integration mit bestehenden E-Mail-Clients
* Einfache Einrichtung mit umfassender Dokumentation
* Günstige Tarife ab nur 3 $/Monat

## Fazit: Open-Source-E-Mail für eine private Zukunft {#conclusion-open-source-email-for-a-private-future}

In einer Welt, in der die digitale Privatsphäre zunehmend bedroht ist, bietet die Transparenz von Open-Source-Lösungen einen entscheidenden Schutz. Wir bei Forward Email sind stolz darauf, mit unserem vollständig Open-Source-Ansatz für E-Mail-Datenschutz eine Vorreiterrolle einzunehmen.

Im Gegensatz zu Wettbewerbern, die Open Source nur teilweise nutzen, haben wir unsere gesamte Plattform – Frontend und Backend – öffentlich zugänglich gemacht. Dieses Engagement für Transparenz, kombiniert mit unserem innovativen technischen Ansatz, bietet ein Maß an nachweisbarem Datenschutz, das Closed-Source-Alternativen einfach nicht bieten können.

Unabhängig davon, ob Sie unseren verwalteten Dienst nutzen oder unsere Plattform selbst hosten, profitieren Sie von der Sicherheit, dem Datenschutz und der Sicherheit, die Ihnen echte Open-Source-E-Mail bietet.

Die Zukunft der E-Mail ist offen, transparent und datenschutzorientiert. Die Zukunft heißt Forward Email.

\[^1]: SNS Insider. „Der Markt für Open-Source-Dienste wurde im Jahr 2023 auf 28,6 Milliarden US-Dollar geschätzt und wird bis 2032 114,8 Milliarden US-Dollar erreichen, was einer jährlichen Wachstumsrate von 16,70 % entspricht.“ [Marktgröße und Analysebericht für Open-Source-Dienste 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Community für Datenschutzleitfäden. "E-Mail weiterleiten (E-Mail-Anbieter) - Website-Entwicklung / Tool-Vorschläge." [Diskussion zu Datenschutzleitfäden](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Community für Datenschutzleitfäden. "E-Mail weiterleiten (E-Mail-Anbieter) - Website-Entwicklung / Tool-Vorschläge." [Diskussion zu Datenschutzleitfäden](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. „Normalerweise müssen Sie mit monatlichen Kosten zwischen 5 und 50 US-Dollar für einen einfachen virtuellen privaten Server (VPS) für Ihren E-Mail-Server rechnen.“ [Die 10 besten selbstgehosteten E-Mail-Server-Plattformen für 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box-Forum. "Die Wartung hat mich in diesem Zeitraum vielleicht 16 Stunden gekostet..." [Selbst gehosteter Mailserver verpönt](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Da alles selbst gehostet wird, wird es Ihre Zeit in Anspruch nehmen. Wenn Sie keine Zeit dafür haben, ist es immer besser, bei einem gehosteten zu bleiben..." [Einen E-Mail-Server selbst hosten? Warum oder warum nicht? Was ist beliebt?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: E-Mail weiterleiten. "Proton Mail behauptet, Open Source zu sein, aber das Backend ist tatsächlich Closed Source." [Vergleich von Tutanota und Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: E-Mail weiterleiten. "Tutanota behauptet, Open Source zu sein, aber ihr Backend ist tatsächlich Closed Source." [Vergleich von Proton Mail und Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Datenschutzleitfaden-Community. "Es wird behauptet, dass sowohl Protonmail als auch Tuta Closed Source sind. Weil ihr Backend tatsächlich Closed Source ist." [E-Mail weiterleiten (E-Mail-Anbieter) - Site-Entwicklung / Tool-Vorschläge](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Community für Datenschutzleitfäden. „Es gibt weder öffentlich zugängliche Audits der Backend-Infrastrukturen der aktuell aufgeführten PG-E-Mail-Dienstanbieter noch wurden Open-Source-Code-Ausschnitte zur Verarbeitung eingehender E-Mails veröffentlicht.“ [E-Mail weiterleiten (E-Mail-Anbieter) - Site-Entwicklung / Tool-Vorschläge](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. „Der Markt für Open-Source-Software wird von 41,83 Milliarden US-Dollar im Jahr 2024 auf 48,92 Milliarden US-Dollar im Jahr 2025 wachsen, und zwar mit einer durchschnittlichen jährlichen Wachstumsrate von …“ [Was ist Open-Source-Software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. „80 % der Unternehmen berichten von einer verstärkten Nutzung von Open-Source-Technologien im letzten Jahr. Das ist...“ [Neue Trends in Open-Source-Communitys 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)