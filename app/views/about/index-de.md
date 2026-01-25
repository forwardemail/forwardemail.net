# Informationen zur E-Mail-Weiterleitung {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Informationen zur E-Mail-Weiterleitung {#about-forward-email-1}

## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [Gründer und Mission](#founder-and-mission)
* [Zeitleiste](#timeline)
  * [2017 – Gründung und Start](#2017---founding-and-launch)
  * [2018 – Infrastruktur und Integration](#2018---infrastructure-and-integration)
  * [2019 – Performance-Revolution](#2019---performance-revolution)
  * [2020 – Schwerpunkt Datenschutz und Sicherheit](#2020---privacy-and-security-focus)
  * [2021 – Plattformmodernisierung](#2021---platform-modernization)
  * [2023 – Infrastruktur- und Funktionserweiterung](#2023---infrastructure-and-feature-expansion)
  * [2024 – Serviceoptimierung und erweiterte Funktionen](#2024---service-optimization-and-advanced-features)
  * [2025 – Kontinuierliche Innovation](#2025---continued-innovation)
* [Grundprinzipien](#core-principles)
* [Aktueller Status](#current-status)

## Übersicht {#overview}

> \[!TIP]
> Technische Details zu unserer Architektur, unseren Sicherheitsimplementierungen und unserer Roadmap finden Sie unter [Technisches Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email ist ein [kostenlos und Open Source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [E-Mail-Weiterleitung](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding")-Dienst, der sich auf die [Recht auf Privatsphäre](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy")-Daten des Benutzers konzentriert. Was 2017 als einfache Lösung zur E-Mail-Weiterleitung begann, hat sich zu einer umfassenden E-Mail-Plattform entwickelt, die eine unbegrenzte Anzahl an benutzerdefinierten Domänennamen, E-Mail-Adressen und Aliasnamen, Wegwerf-E-Mail-Adressen, Spam- und Phishing-Schutz, verschlüsselten Postfachspeicher und zahlreiche erweiterte Funktionen bietet.

Der Dienst wird von seinem ursprünglichen Gründerteam aus Designern und Entwicklern gepflegt und betrieben. Er basiert zu 100 % auf Open-Source-Software und verwendet die folgenden Elemente: [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") und [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Gründer und Mission {#founder-and-mission}

Forward Email wurde 2017 von **Nicholas Baugh** gegründet. Laut [Technisches Whitepaper zur E-Mail-Weiterleitung](https://forwardemail.net/technical-whitepaper.pdf) suchte Baugh zunächst nach einer kostengünstigen und einfachen Lösung, um E-Mail über Domänennamen für seine Nebenprojekte zu aktivieren. Nachdem er die verfügbaren Optionen geprüft hatte, begann er mit der Entwicklung seiner eigenen Lösung und kaufte am 2. Oktober 2017 die Domäne `forwardemail.net`.

Die Mission von Forward Email geht über die Bereitstellung von E-Mail-Diensten hinaus – sie zielt darauf ab, den Umgang der Branche mit E-Mail-Datenschutz und -Sicherheit zu verändern. Zu den Grundwerten des Unternehmens gehören Transparenz, Benutzerkontrolle und Datenschutz durch technische Umsetzung statt nur durch politische Versprechen.

## Zeitleiste {#timeline}

### 2017 – Gründung und Start {#2017---founding-and-launch}

**2. Oktober 2017**: Nicholas Baugh hat die Domäne `forwardemail.net` gekauft, nachdem er nach kostengünstigen E-Mail-Lösungen für seine Nebenprojekte gesucht hatte.

**5. November 2017**: Baugh erstellte eine 634-zeilige JavaScript-Datei mit [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), um E-Mails für beliebige benutzerdefinierte Domänennamen weiterzuleiten. Diese erste Implementierung wurde als Open Source für [GitHub](https://github.com/forwardemail) veröffentlicht und der Dienst über GitHub Pages gestartet.

**November 2017**: Forward Email wurde nach einer ersten Veröffentlichung offiziell eingeführt. Die frühe Version war rein DNS-basiert und erforderte weder eine Kontoregistrierung noch einen Anmeldevorgang – lediglich eine in Markdown geschriebene README-Datei mit Anweisungen. Benutzer konnten die E-Mail-Weiterleitung einrichten, indem sie MX-Einträge so konfigurierten, dass sie auf `mx1.forwardemail.net` und `mx2.forwardemail.net` zeigten, und einen TXT-Eintrag mit `forward-email=user@gmail.com` hinzufügten.

Die Einfachheit und Effektivität dieser Lösung erregte die Aufmerksamkeit namhafter Entwickler, darunter [David Heinemeier Hansson](https://dhh.dk) (Erfinder von Ruby on Rails), der Forward Email bis heute auf seiner Domäne `dhh.dk` verwendet.

### 2018 – Infrastruktur und Integration {#2018---infrastructure-and-integration}

**April 2018**: Als [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") seinen [Datenschutz-orientierter DNS-Dienst für Verbraucher](https://blog.cloudflare.com/announcing-1111/) einführte, wechselte Forward Email von [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") zu [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") für die Verarbeitung von [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-Lookups und demonstrierte damit das Engagement des Unternehmens für datenschutzorientierte Infrastrukturentscheidungen.

**Oktober 2018**: Mit der Funktion „E-Mail weiterleiten“ konnten Benutzer E-Mails mit [Google Mail](https://en.wikipedia.org/wiki/Gmail "Gmail") und [Ausblick](https://en.wikipedia.org/wiki/Outlook "Outlook") senden, wodurch die Integrationsmöglichkeiten mit gängigen E-Mail-Anbietern erweitert wurden.

### 2019 – Performance-Revolution {#2019---performance-revolution}

**Mai 2019**: Forward Email hat Version 2 veröffentlicht, die eine umfassende Überarbeitung der ersten Versionen darstellt. Dieses Update konzentrierte sich auf Verbesserungen von [Leistung](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") durch die Verwendung von [Streams](https://en.wikipedia.org/wiki/Streams "Streams") von [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") und legte damit den Grundstein für die Skalierbarkeit der Plattform.

### 2020 – Schwerpunkt Datenschutz und Sicherheit {#2020---privacy-and-security-focus}

**Februar 2020**: Forward Email hat den Plan „Enhanced Privacy Protection“ veröffentlicht. Dieser ermöglicht es Nutzern, öffentliche DNS-Einträge mit ihren Aliasen für die E-Mail-Weiterleitungskonfiguration zu deaktivieren. Dadurch werden die E-Mail-Alias-Informationen eines Nutzers vor der öffentlichen Suche im Internet verborgen. Das Unternehmen hat außerdem eine Funktion veröffentlicht, mit der bestimmte Aliase aktiviert oder deaktiviert werden können. Diese bleiben jedoch weiterhin als gültige E-Mail-Adressen sichtbar und geben erfolgreich [SMTP-Statuscodes](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") zurück. E-Mails werden dann sofort verworfen (ähnlich der Weiterleitung der Ausgabe an [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Nachdem Forward Email mit bestehenden Spam-Erkennungslösungen, die die Datenschutzrichtlinien von Forward Email nicht einhielten, auf zahlreiche Hindernisse gestoßen war, veröffentlichte das Unternehmen die erste Alpha-Version seines Spam Scanners. Diese völlig kostenlose und Open-Source-Lösung [Anti-Spam-Filter](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") nutzt einen [Naive Bayes-Spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-Ansatz kombiniert mit [Anti-Phishing](https://en.wikipedia.org/wiki/Phishing "Phishing")- und [IDN-Homograph-Angriff](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-Schutz. Forward Email veröffentlichte außerdem [Zwei-Faktor-Authentifizierung](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) mit [Einmalkennwörter](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) für verbesserte Kontosicherheit.

**Mai 2020**: Forward Email ermöglichte die Verwendung des benutzerdefinierten [Portweiterleitung](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") als Workaround, um die Portblockierung durch den [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") zu umgehen. Das Unternehmen veröffentlichte außerdem den [Kostenlose RESTful-API zur E-Mail-Weiterleitung](email-api) mit vollständiger Dokumentation, Beispielen für Echtzeitanfragen und -antworten sowie Unterstützung für Webhooks.

**August 2020**: Forward Email hat Unterstützung für das E-Mail-Authentifizierungssystem [Authentifizierte Empfangskette](arc) („ARC“) hinzugefügt, wodurch die E-Mail-Sicherheit und -Zustellbarkeit weiter verbessert wird.

**23. November 2020**: Forward Email wurde öffentlich aus seinem Betaprogramm herausgeführt und markierte damit einen wichtigen Meilenstein in der Entwicklung der Plattform.

### 2021 – Plattformmodernisierung {#2021---platform-modernization}

**Februar 2021**: Forward Email hat seine Codebasis überarbeitet, um alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\)-Abhängigkeiten (Python (Programmiersprache)) zu entfernen. Dadurch besteht der Stack nun zu 100 % aus [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") und [Node.js](https://en.wikipedia.org/wiki/Node.js). Diese architektonische Entscheidung steht im Einklang mit dem Engagement des Unternehmens, einen konsistenten Open-Source-Technologie-Stack zu pflegen.

**27. September 2021**: Leiten Sie die E-Mail [zusätzliche Unterstützung](email-forwarding-regex-pattern-filter) weiter, damit die E-Mail-Weiterleitungsaliase mit [reguläre Ausdrücke](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") übereinstimmen, und bieten Sie den Benutzern so ausgefeiltere Funktionen zur E-Mail-Weiterleitung.

### 2023 – Infrastruktur- und Funktionserweiterung {#2023---infrastructure-and-feature-expansion}

**Januar 2023**: Forward Email hat eine neu gestaltete und hinsichtlich der Seitengeschwindigkeit optimierte Website gestartet, die das Benutzererlebnis und die Leistung verbessert.

**Februar 2023**: Das Unternehmen hat Unterstützung für [Fehlerprotokolle](/faq#do-you-store-error-logs) hinzugefügt und ein [Dunkelmodus](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)-Website-Farbschema implementiert, das den Benutzerpräferenzen und Zugänglichkeitsanforderungen entspricht.

**März 2023**: Forward Email veröffentlichte [Mandarine](https://github.com/forwardemail/tangerine#readme) und integrierte es in seine gesamte Infrastruktur. Dadurch wurde die Verwendung von [DNS über HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH“) auf Anwendungsebene ermöglicht. Das Unternehmen fügte außerdem Unterstützung für [MTA-STS](/faq#do-you-support-mta-sts) hinzu und wechselte von [hCaptcha](/) zu [Cloudflare-Drehkreuz](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementierte und automatisierte eine komplett neue Infrastruktur. Der gesamte Dienst lief auf global lastausgeglichenem und proximitätsbasiertem DNS mit Integritätsprüfungen und Failover über [Cloudflare](https://cloudflare.com) und ersetzte damit den bisherigen Round-Robin-DNS-Ansatz. Das Unternehmen wechselte zu **Bare-Metal-Servern** verschiedener Anbieter, darunter [Vultr](https://www.vultr.com/?ref=429848) und [Digitaler Ozean](https://m.do.co/c/a7cecd27e071), beides SOC 2 Typ 1-konforme Anbieter. MongoDB- und Redis-Datenbanken wurden in Clusterkonfigurationen mit Primär- und Standby-Knoten migriert, um Hochverfügbarkeit, End-to-End-SSL-Verschlüsselung, Verschlüsselung im Ruhezustand und Point-in-Time-Recovery (PITR) zu gewährleisten.

**Mai 2023**: Forward Email hat die **Outbound-SMTP**-Funktion für [E-Mail mit SMTP senden](/faq#do-you-support-sending-email-with-smtp)- und [Senden von E-Mails mit API](/faq#do-you-support-sending-email-with-api)-Anfragen eingeführt. Diese Funktion umfasst integrierte Sicherheitsvorkehrungen für eine hohe Zustellbarkeit, ein modernes und robustes Warteschlangen- und Wiederholungssystem sowie [unterstützt Fehlerprotokolle in Echtzeit](/faq#do-you-store-error-logs).

**November 2023**: Forward Email hat die Funktion [**verschlüsselter Postfachspeicher**](/blog/docs/best-quantum-safe-encrypted-email-service) für [IMAP-Unterstützung](/faq#do-you-support-receiving-email-with-imap) eingeführt, die einen bedeutenden Fortschritt in Sachen E-Mail-Datenschutz und -Sicherheit darstellt.

**Dezember 2023**: Das Unternehmen [zusätzliche Unterstützung](/faq#do-you-support-pop3) für die Überwachung von [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [Passkeys und WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [Zeit bis zum Posteingang](/faq#i) und [OpenPGP für IMAP-Speicher](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 – Serviceoptimierung und erweiterte Funktionen {#2024---service-optimization-and-advanced-features}

**Februar 2024**: E-Mail-Weiterleitung [Kalenderunterstützung (CalDAV) hinzugefügt](/faq#do-you-support-calendars-caldav), wodurch die Funktionen der Plattform über E-Mail hinaus um die Kalendersynchronisierung erweitert werden.

**März bis Juli 2024**: Forward Email hat wichtige Optimierungen und Verbesserungen an seinen IMAP-, POP3- und CalDAV-Diensten veröffentlicht, mit dem Ziel, seinen Dienst genauso schnell wie, wenn nicht sogar schneller als Alternativen zu machen.

**Juli 2024**: Das Unternehmen [iOS Push-Unterstützung hinzugefügt](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) behebt den Mangel an Unterstützung für den IMAP-Befehl `IDLE` in Apple Mail auf iOS und ermöglicht so Echtzeitbenachrichtigungen für Apple iOS-Geräte. Forward Email hat außerdem die Überwachung der Posteingangszeit („TTI“) für den eigenen Dienst und Yahoo/AOL erweitert und ermöglicht Nutzern nun auch im kostenlosen Tarif die Verschlüsselung ihres gesamten DNS-TXT-Eintrags. Wie in [Diskussionen zu Datenschutzleitfäden](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) und [GitHub-Probleme](https://github.com/forwardemail/forwardemail.net/issues/254) gefordert, hat das Unternehmen die Möglichkeit für Aliase hinzugefügt, `250` stillschweigend abzulehnen, `421` sanft abzulehnen oder `550` bei Deaktivierung hart abzulehnen.

**August 2024**: Forward Email unterstützt nun den Export von Postfächern in den Formaten [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) und [Mbox](https://en.wikipedia.org/wiki/Mbox) (zusätzlich zum bestehenden Exportformat [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Unterstützung für Webhook-Signaturen wurde hinzugefügt](https://forwardemail.net/faq#do-you-support-bounce-webhooks), und das Unternehmen ermöglicht Benutzern nun den Versand von Newslettern, Ankündigungen und E-Mail-Marketing über seinen ausgehenden SMTP-Dienst. Domänenweite und aliasspezifische Speicherkontingente für IMAP/POP3/CalDAV wurden ebenfalls implementiert.

### 2025 - Datenschutzverbesserungen und Protokollunterstützung {#2025---privacy-enhancements-and-protocol-support}

**September 2024 bis Januar 2025**: Leiten Sie E-Mails [Eine häufig nachgefragte Abwesenheitsnotizfunktion und OpenPGP/WKD-Verschlüsselung für die E-Mail-Weiterleitung wurden hinzugefügt.](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) weiter, aufbauend auf den bereits implementierten Funktionen zur verschlüsselten Postfachspeicherung.

**21. Januar 2025**: Der beste Freund des Gründers, sein treuer vierbeiniger Begleiter „Jack“, ist im Alter von fast elf Jahren friedlich verstorben. Jack [wird immer in Erinnerung bleiben](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) für seine unerschütterliche Kameradschaft, die die Entwicklung von Forward Email unterstützt hat. Der [Technisches Whitepaper zur E-Mail-Weiterleitung](https://forwardemail.net/technical-whitepaper.pdf) ist Jack gewidmet und würdigt seine Rolle bei der Entwicklung des Dienstes.

**Februar 2025**: Forward Email wechselte zu [Datenpaket](https://www.datapacket.com) als neuem primären Rechenzentrumsanbieter und implementierte benutzerdefinierte, leistungsorientierte Bare-Metal-Hardware, um die Servicezuverlässigkeit und -geschwindigkeit weiter zu verbessern.

**Juni 2025**: Forward Email hat die Unterstützung für [CardDAV-Protokoll](/faq#do-you-support-contacts-carddav) eingeführt und erweitert damit die Funktionen der Plattform um die Kontaktsynchronisierung neben vorhandenen E-Mail- und Kalenderdiensten.

### 2026 - RFC-Konformität und erweiterte Filterung {#2026---rfc-compliance-and-advanced-filtering}

**Januar 2026**: Forward Email veröffentlichte ein umfassendes [RFC-Protokoll-Compliance-Dokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) mit Details zur vollständigen Standardunterstützung für SMTP, IMAP, POP3 und CalDAV. Die Plattform fügte außerdem [REQUIRETLS-Unterstützung (RFC 8689)](/faq#requiretls-support) für erzwungene TLS-Verschlüsselung beim E-Mail-Transport, [S/MIME-Verschlüsselung (RFC 8551)](/faq#do-you-support-smime-encryption) für sichere Nachrichtensignierung und -verschlüsselung sowie umfassende [Sieve-E-Mail-Filterung (RFC 5228)](/faq#do-you-support-sieve-email-filtering) mit [ManageSieve-Protokoll (RFC 5804)](/faq#do-you-support-sieve-email-filtering)-Unterstützung für serverseitige E-Mail-Filterung hinzu. Die [REST-API](/email-api) wurde auf 39 Endpunkte erweitert, die Nachrichten, Ordner, Kontakte, Kalender und Kalenderereignisse abdecken.

## Grundprinzipien {#core-principles}

Seit seiner Gründung hat sich Forward Email konsequent den Grundsätzen des Datenschutzes und der Sicherheit verpflichtet:

**100 % Open-Source-Philosophie**: Anders als Wettbewerber, die nur ihre Frontends als Open Source zur Verfügung stellen und die Backends geschlossen halten, hat Forward Email seine gesamte Codebasis – sowohl Frontend als auch Backend – auf [GitHub](https://github.com/forwardemail) zur öffentlichen Einsichtnahme verfügbar gemacht.

**Datenschutz-orientiertes Design**: Vom ersten Tag an hat Forward Email einen einzigartigen In-Memory-Verarbeitungsansatz implementiert, der das Schreiben von E-Mails auf die Festplatte vermeidet und sich damit von herkömmlichen E-Mail-Diensten unterscheidet, die Nachrichten in Datenbanken oder Dateisystemen speichern.

**Kontinuierliche Innovation**: Der Dienst hat sich von einer einfachen E-Mail-Weiterleitungslösung zu einer umfassenden E-Mail-Plattform mit Funktionen wie verschlüsselten Postfächern, quantenresistenter Verschlüsselung und Unterstützung für Standardprotokolle wie SMTP, IMAP, POP3 und CalDAV entwickelt.

**Transparenz**: Der gesamte Code wird als Open Source bereitgestellt und zur Überprüfung verfügbar gemacht, um sicherzustellen, dass Benutzer Datenschutzansprüche überprüfen können, anstatt einfach nur Marketingaussagen zu vertrauen.

**Benutzerkontrolle**: Benutzern werden Optionen geboten, einschließlich der Möglichkeit, die gesamte Plattform bei Bedarf selbst zu hosten.

## Aktueller Status {#current-status}

Ab 2025 bedient Forward Email über 500.000 Domänen weltweit, darunter namhafte Organisationen und Branchenführer wie:

* **Technologieunternehmen**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medienorganisationen**: Fox News Radio, Disney Ad Sales
* **Bildungseinrichtungen**: University of Cambridge, University of Maryland, University of Washington, Tufts University, Swarthmore College
* **Behörden**: Regierung von Südaustralien, Regierung der Dominikanischen Republik
* **Weitere Organisationen**: RCD Hotels, Fly<span>.</span>io
* **Bemerkenswerte Entwickler**: Isaac Z. Schlueter (npm-Entwickler), David Heinemeier Hansson (Ruby on Rails-Entwickler)

Die Plattform entwickelt sich durch regelmäßige Funktionsveröffentlichungen und Infrastrukturverbesserungen ständig weiter und behauptet ihre Position als einziger heute verfügbarer, zu 100 % Open Source-, verschlüsselter, datenschutzorientierter, transparenter und quantenresistenter E-Mail-Dienst.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />