# Über Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email Team- und Firmengeschichte" class="rounded-lg" />

# Über Forward Email {#about-forward-email-1}


## Inhaltsverzeichnis {#table-of-contents}

* [Überblick](#overview)
* [Gründer und Mission](#founder-and-mission)
* [Zeitachse](#timeline)
  * [2017 - Gründung und Start](#2017---founding-and-launch)
  * [2018 - Infrastruktur und Integration](#2018---infrastructure-and-integration)
  * [2019 - Leistungsrevolution](#2019---performance-revolution)
  * [2020 - Fokus auf Datenschutz und Sicherheit](#2020---privacy-and-security-focus)
  * [2021 - Plattformmodernisierung](#2021---platform-modernization)
  * [2023 - Infrastruktur- und Feature-Erweiterung](#2023---infrastructure-and-feature-expansion)
  * [2024 - Serviceoptimierung und erweiterte Funktionen](#2024---service-optimization-and-advanced-features)
  * [2025 - Datenschutzverbesserungen und Protokollunterstützung {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-Konformität und erweiterte Filterung {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Grundprinzipien](#core-principles)
* [Aktueller Status](#current-status)


## Überblick {#overview}

> \[!TIP]
> Für technische Details zu unserer Architektur, Sicherheitsimplementierungen und Roadmap siehe das [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email ist ein [kostenloser und Open-Source](https://de.wikipedia.org/wiki/Open_Source "Open Source") [E-Mail-Weiterleitungsdienst](https://de.wikipedia.org/wiki/E-Mail-Weiterleitung "E-Mail-Weiterleitung"), der sich auf das [Recht auf Privatsphäre](https://de.wikipedia.org/wiki/Recht_auf_privatsph%C3%A4re "Recht auf Privatsphäre") der Nutzer konzentriert. Was 2017 als einfache Lösung zur E-Mail-Weiterleitung begann, hat sich zu einer umfassenden E-Mail-Plattform entwickelt, die unbegrenzte benutzerdefinierte Domainnamen, unbegrenzte E-Mail-Adressen und Aliase, unbegrenzte Wegwerf-E-Mail-Adressen, Spam- und Phishing-Schutz, verschlüsselte Postfachspeicherung und zahlreiche erweiterte Funktionen bietet.

Der Dienst wird von seinem ursprünglichen Gründerteam aus Designern und Entwicklern gepflegt und betrieben. Er basiert zu 100 % auf Open-Source-Software unter Verwendung von [JavaScript](https://de.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://de.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://de.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://de.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://de.wikipedia.org/wiki/Transport_Layer_Security "TLS") und [SMTP](https://de.wikipedia.org/wiki/SMTP "SMTP").


## Gründer und Mission {#founder-and-mission}

Forward Email wurde 2017 von **Nicholas Baugh** gegründet. Laut dem [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) suchte Baugh ursprünglich nach einer kostengünstigen und einfachen Lösung, um E-Mail für seine Nebenprojekte auf Domainnamen zu ermöglichen. Nach der Recherche verfügbarer Optionen begann er, seine eigene Lösung zu programmieren, und kaufte am 2. Oktober 2017 die Domain `forwardemail.net`.

Die Mission von Forward Email geht über die Bereitstellung von E-Mail-Diensten hinaus – sie will die Art und Weise verändern, wie die Branche E-Mail-Datenschutz und -Sicherheit angeht. Die Kernwerte des Unternehmens umfassen Transparenz, Nutzerkontrolle und Datenschutz durch technische Umsetzung statt nur durch politische Versprechen.


## Zeitachse {#timeline}

### 2017 - Gründung und Start {#2017---founding-and-launch}

**2. Oktober 2017**: Nicholas Baugh kaufte die Domain `forwardemail.net`, nachdem er kostengünstige E-Mail-Lösungen für seine Nebenprojekte recherchiert hatte.

**5. November 2017**: Baugh erstellte eine 634-zeilige JavaScript-Datei mit [Node.js](https://de.wikipedia.org/wiki/Node.js "Node.js"), um E-Mails für beliebige benutzerdefinierte Domainnamen weiterzuleiten. Diese erste Implementierung wurde als Open Source auf [GitHub](https://github.com/forwardemail) veröffentlicht und der Dienst wurde über GitHub Pages gestartet.
**November 2017**: Forward Email wurde offiziell nach einer ersten Veröffentlichung gestartet. Die frühe Version basierte ausschließlich auf DNS, ohne Konto-Registrierung oder Anmeldeprozess – einfach eine README-Datei, die in Markdown mit Anweisungen geschrieben war. Benutzer konnten die E-Mail-Weiterleitung einrichten, indem sie MX-Einträge auf `mx1.forwardemail.net` und `mx2.forwardemail.net` konfigurierten und einen TXT-Eintrag mit `forward-email=user@gmail.com` hinzufügten.

Die Einfachheit und Effektivität dieser Lösung zog die Aufmerksamkeit prominenter Entwickler auf sich, darunter [David Heinemeier Hansson](https://dhh.dk) (Schöpfer von Ruby on Rails), der Forward Email bis heute auf seiner Domain `dhh.dk` verwendet.

### 2018 - Infrastruktur und Integration {#2018---infrastructure-and-integration}

**April 2018**: Als [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") ihren [datenschutzorientierten Consumer-DNS-Dienst](https://blog.cloudflare.com/announcing-1111/) starteten, wechselte Forward Email von der Nutzung von [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") zu [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") für die Handhabung von [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-Abfragen, was das Engagement des Unternehmens für datenschutzorientierte Infrastrukturentscheidungen demonstrierte.

**Oktober 2018**: Forward Email ermöglichte es Benutzern, „Mail senden als“ mit [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") und [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook") zu verwenden und erweiterte damit die Integrationsmöglichkeiten mit beliebten E-Mail-Anbietern.

### 2019 - Performance-Revolution {#2019---performance-revolution}

**Mai 2019**: Forward Email veröffentlichte v2, die eine umfassende Neufassung der anfänglichen Versionen darstellte. Dieses Update konzentrierte sich auf [Leistungs](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")verbesserungen durch die Nutzung von [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [Streams](https://en.wikipedia.org/wiki/Streams "Streams") und legte damit die Grundlage für die Skalierbarkeit der Plattform.

### 2020 - Fokus auf Datenschutz und Sicherheit {#2020---privacy-and-security-focus}

**Februar 2020**: Forward Email veröffentlichte den Enhanced Privacy Protection-Plan, der es Benutzern ermöglicht, das Setzen öffentlicher DNS-Einträge mit ihren E-Mail-Weiterleitungs-Aliasen zu deaktivieren. Durch diesen Plan werden die E-Mail-Alias-Informationen eines Benutzers vor der öffentlichen Suche im Internet verborgen. Das Unternehmen veröffentlichte außerdem eine Funktion, mit der bestimmte Aliase aktiviert oder deaktiviert werden können, während sie weiterhin als gültige E-Mail-Adressen erscheinen und erfolgreiche [SMTP-Statuscodes](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") zurückgeben, wobei E-Mails sofort verworfen werden (ähnlich wie das Umleiten der Ausgabe zu [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Nach zahlreichen Hindernissen mit bestehenden Spam-Erkennungslösungen, die die Datenschutzrichtlinie von Forward Email nicht respektierten, veröffentlichte das Unternehmen die erste Alpha-Version des Spam Scanners. Diese komplett kostenlose und Open-Source-[Anti-Spam-Filter](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")-Lösung verwendet einen [Naive Bayes Spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-Ansatz kombiniert mit [Anti-Phishing](https://en.wikipedia.org/wiki/Phishing "Phishing")- und [IDN-Homograph-Angriff](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-Schutz. Forward Email veröffentlichte außerdem [Zwei-Faktor-Authentifizierung](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) mit [One-Time Passwords](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) für erhöhte Kontosicherheit.

**Mai 2020**: Forward Email ermöglichte benutzerdefinierte [Portweiterleitung](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") als Workaround für Benutzer, um Port-Blockierungen durch ihren [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") zu umgehen. Das Unternehmen veröffentlichte außerdem ihre [kostenlose E-Mail-Weiterleitungs-RESTful-API](email-api) mit vollständiger Dokumentation und Echtzeit-Beispielen für Anfragen und Antworten sowie Unterstützung für Webhooks.
**August 2020**: Forward Email fügte Unterstützung für das [Authenticated Received Chain](arc) ("ARC") E-Mail-Authentifizierungssystem hinzu, was die E-Mail-Sicherheit und Zustellbarkeit weiter stärkte.

**23. November 2020**: Forward Email wurde offiziell aus dem Beta-Programm gestartet, was einen bedeutenden Meilenstein in der Entwicklung der Plattform markierte.

### 2021 - Plattformmodernisierung {#2021---platform-modernization}

**Februar 2021**: Forward Email überarbeitete ihren Codebestand, um alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)")-Abhängigkeiten zu entfernen, wodurch ihr Stack zu 100 % aus [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") und [Node.js](https://en.wikipedia.org/wiki/Node.js) besteht. Diese architektonische Entscheidung entsprach dem Engagement des Unternehmens, einen konsistenten, Open-Source-Technologie-Stack beizubehalten.

**27. September 2021**: Forward Email [fügte Unterstützung](email-forwarding-regex-pattern-filter) für E-Mail-Weiterleitungs-Aliase hinzu, die mit [regulären Ausdrücken](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") übereinstimmen, und bot den Nutzern damit ausgefeiltere E-Mail-Routing-Funktionen.

### 2023 - Infrastruktur- und Funktionsausbau {#2023---infrastructure-and-feature-expansion}

**Januar 2023**: Forward Email startete eine neu gestaltete und für Seitenladegeschwindigkeit optimierte Website, die Benutzererfahrung und Leistung verbesserte.

**Februar 2023**: Das Unternehmen fügte Unterstützung für [Fehlerprotokolle](/faq#do-you-store-error-logs) hinzu und implementierte ein [Dark Mode](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) Website-Farbschema, um auf Nutzerpräferenzen und Barrierefreiheitsanforderungen zu reagieren.

**März 2023**: Forward Email veröffentlichte [Tangerine](https://github.com/forwardemail/tangerine#readme) und integrierte es in ihre gesamte Infrastruktur, wodurch die Nutzung von [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") auf Anwendungsebene ermöglicht wurde. Das Unternehmen fügte außerdem Unterstützung für [MTA-STS](/faq#do-you-support-mta-sts) hinzu und wechselte von [hCaptcha](/) zu [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementierte und automatisierte eine völlig neue Infrastruktur. Der gesamte Dienst läuft nun auf global lastverteiltem und proximitätsbasiertem DNS mit Gesundheitsprüfungen und Failover unter Verwendung von [Cloudflare](https://cloudflare.com), was den bisherigen Round-Robin-DNS-Ansatz ersetzte. Das Unternehmen wechselte zu **Bare-Metal-Servern** bei mehreren Anbietern, darunter [Vultr](https://www.vultr.com/?ref=429848) und [Digital Ocean](https://m.do.co/c/a7cecd27e071), beide SOC 2 Typ 1 konforme Anbieter. MongoDB- und Redis-Datenbanken wurden in Cluster-Konfigurationen mit primären und Standby-Knoten für hohe Verfügbarkeit, Ende-zu-Ende-SSL-Verschlüsselung, Verschlüsselung im Ruhezustand und Point-in-Time-Wiederherstellung (PITR) migriert.

**Mai 2023**: Forward Email startete ihre **Outbound SMTP**-Funktion für [das Senden von E-Mails per SMTP](/faq#do-you-support-sending-email-with-smtp) und [das Senden von E-Mails per API](/faq#do-you-support-sending-email-with-api). Diese Funktion beinhaltet integrierte Schutzmechanismen zur Sicherstellung hoher Zustellbarkeit, ein modernes und robustes Warteschlangen- und Wiederholsystem sowie [Unterstützung für Fehlerprotokolle in Echtzeit](/faq#do-you-store-error-logs).

**November 2023**: Forward Email startete ihre [**verschlüsselte Postfachspeicherung**](/blog/docs/best-quantum-safe-encrypted-email-service) Funktion für [IMAP-Unterstützung](/faq#do-you-support-receiving-email-with-imap), was einen bedeutenden Fortschritt in Sachen E-Mail-Datenschutz und Sicherheit darstellt.

**Dezember 2023**: Das Unternehmen [fügte Unterstützung](/faq#do-you-support-pop3) für [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [Passkeys und WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [Zeit bis zum Posteingang](/faq#i) Überwachung und [OpenPGP für IMAP-Speicherung](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) hinzu.

### 2024 - Serviceoptimierung und erweiterte Funktionen {#2024---service-optimization-and-advanced-features}

**Februar 2024**: Forward Email [fügte Kalender-(CalDAV)-Unterstützung](/faq#do-you-support-calendars-caldav) hinzu und erweiterte damit die Plattformfunktionen über E-Mails hinaus um Kalender-Synchronisation.
**März bis Juli 2024**: Forward Email veröffentlichte bedeutende Optimierungen und Verbesserungen ihrer IMAP-, POP3- und CalDAV-Dienste, mit dem Ziel, ihren Service so schnell wie, wenn nicht schneller als Alternativen zu machen.

**Juli 2024**: Das Unternehmen [fügte iOS Push-Unterstützung hinzu](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016), um das Fehlen des IMAP-`IDLE`-Befehls in Apple Mail auf iOS zu adressieren und Echtzeit-Benachrichtigungen für Apple iOS-Geräte zu ermöglichen. Forward Email fügte außerdem eine Überwachung der Zeit bis zum Posteingang ("TTI") für ihren eigenen Dienst sowie Yahoo/AOL hinzu und begann, Nutzern zu erlauben, ihren gesamten DNS TXT-Eintrag auch im kostenlosen Tarif zu verschlüsseln. Wie in den [Privacy Guides Diskussionen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) und [GitHub Issues](https://github.com/forwardemail/forwardemail.net/issues/254) gewünscht, fügte das Unternehmen die Möglichkeit hinzu, dass Aliase beim Deaktivieren entweder still `250` ablehnen, soft `421` ablehnen oder hart `550` ablehnen.

**August 2024**: Forward Email fügte Unterstützung für den Export von Postfächern im [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) und [Mbox](https://en.wikipedia.org/wiki/Mbox)-Format hinzu (zusätzlich zum bestehenden [SQLite](https://en.wikipedia.org/wiki/SQLite)-Exportformat). [Webhook-Signaturunterstützung wurde hinzugefügt](https://forwardemail.net/faq#do-you-support-bounce-webhooks), und das Unternehmen begann, Nutzern zu erlauben, Newsletter, Ankündigungen und E-Mail-Marketing über ihren ausgehenden SMTP-Dienst zu versenden. Domainweite und alias-spezifische Speicherquoten für IMAP/POP3/CalDAV wurden ebenfalls implementiert.

### 2025 - Datenschutzverbesserungen und Protokollunterstützung {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**September 2024 bis Januar 2025**: Forward Email [fügte eine stark nachgefragte Abwesenheitsnotiz-Funktion und OpenPGP/WKD-Verschlüsselung für E-Mail-Weiterleitungen hinzu](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) und baute damit auf ihren bereits implementierten verschlüsselten Postfachspeicherfähigkeiten auf.

**21. Januar 2025**: Der beste Freund des Gründers „Jack“, sein treuer Hundebegleiter, verstarb friedlich im Alter von fast 11 Jahren. Jack [wird immer in Erinnerung bleiben](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) für seine unerschütterliche Kameradschaft, die die Entstehung von Forward Email unterstützte. Das [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) ist Jack gewidmet und würdigt seine Rolle bei der Entwicklung des Dienstes.

**Februar 2025**: Forward Email wechselte zu [DataPacket](https://www.datapacket.com) als neuen primären Rechenzentrumsanbieter und implementierte maßgeschneiderte, leistungsorientierte Bare-Metal-Hardware, um die Zuverlässigkeit und Geschwindigkeit des Dienstes weiter zu verbessern.

**März 2025**: Version 1.0 von Forward Email wurde offiziell veröffentlicht.

**April 2025**: Die erste Version des [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) wurde veröffentlicht, und das Unternehmen begann, Kryptowährungszahlungen zu akzeptieren.

**Mai 2025**: Der Dienst startete neue API-Dokumentation mit [Scalar](https://github.com/scalar/scalar).

**Juni 2025**: Forward Email führte Unterstützung für das [CardDAV-Protokoll](/faq#do-you-support-contacts-carddav) ein und erweiterte damit die Plattform um Kontakt-Synchronisation neben den bestehenden E-Mail- und Kalenderdiensten.

**August 2025**: Die Plattform fügte [CalDAV VTODO/Aufgaben-Unterstützung](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)) hinzu, wodurch Aufgabenverwaltung neben Kalenderereignissen möglich wurde.

**November 2025**: Die Sicherheit der Plattform wurde durch eine Migration von PBKDF2 zu [Argon2id](https://en.wikipedia.org/wiki/Argon2) für das Passwort-Hashing verbessert, und die Infrastruktur wurde von Redis zu [Valkey](https://github.com/valkey-io/valkey) migriert.

**Dezember 2025**: Version 2.0 wurde veröffentlicht, mit Unterstützung für [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) zur erzwungenen TLS-Verschlüsselung beim E-Mail-Transport und einem Upgrade auf [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - RFC-Konformität und erweiterte Filterung {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Januar 2026**: Forward Email veröffentlichte ein umfassendes [RFC-Protokollkonformitätsdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) und fügte Unterstützung für [S/MIME-Verschlüsselung (RFC 8551)](/faq#do-you-support-smime-encryption) sowie umfassende [Sieve-E-Mail-Filterung (RFC 5228)](/faq#do-you-support-sieve-email-filtering) mit Unterstützung des [ManageSieve-Protokolls (RFC 5804)](/faq#do-you-support-sieve-email-filtering) hinzu. Die REST-API wurde ebenfalls auf 39 Endpunkte erweitert.

**Februar 2026**: Der offizielle, quelloffene Webmail-Client wurde unter [mail.forwardemail.net](https://mail.forwardemail.net) gestartet ([Quellcode auf GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Die Plattform fügte außerdem Unterstützung für [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) und [Domain Connect](https://domainconnect.org) für die 1-Klick-DNS-Einrichtung hinzu. Echtzeit-Push-Benachrichtigungen für IMAP, CalDAV und CardDAV wurden mittels WebSockets eingeführt.

**März 2026**: Unterstützung für pro-Domain benutzerdefinierten S3-kompatiblen Speicher wurde hinzugefügt, zusammen mit einem Kommandozeilen-Tool zur Verwaltung. Die Arbeit an plattformübergreifenden Desktop- und mobilen Anwendungen für macOS, Windows, Linux, iOS und Android begann, basierend auf derselben quelloffenen Webmail-Codebasis, entwickelt mit [Tauri](https://tauri.app).


## Grundprinzipien {#core-principles}

Seit seiner Gründung hält Forward Email an einem festen Bekenntnis zu Datenschutz- und Sicherheitsprinzipien fest:

**100 % Open-Source-Philosophie**: Im Gegensatz zu Wettbewerbern, die nur ihre Frontends als Open Source veröffentlichen und Backends geschlossen halten, hat Forward Email seinen gesamten Code – sowohl Frontend als auch Backend – öffentlich auf [GitHub](https://github.com/forwardemail) zugänglich gemacht.

**Datenschutzorientiertes Design**: Von Anfang an implementierte Forward Email einen einzigartigen In-Memory-Verarbeitungsansatz, der das Schreiben von E-Mails auf die Festplatte vermeidet und sich damit von herkömmlichen E-Mail-Diensten unterscheidet, die Nachrichten in Datenbanken oder Dateisystemen speichern.

**Kontinuierliche Innovation**: Der Dienst hat sich von einer einfachen E-Mail-Weiterleitungslösung zu einer umfassenden E-Mail-Plattform mit Funktionen wie verschlüsselten Postfächern, quantensicherer Verschlüsselung und Unterstützung für Standardprotokolle wie SMTP, IMAP, POP3 und CalDAV entwickelt.

**Transparenz**: Durch die Offenlegung des gesamten Codes zur Einsichtnahme wird sichergestellt, dass Nutzer Datenschutzversprechen überprüfen können, anstatt sich nur auf Marketingaussagen zu verlassen.

**Benutzerkontrolle**: Nutzer werden mit Optionen ausgestattet, einschließlich der Möglichkeit, die gesamte Plattform bei Bedarf selbst zu hosten.


## Aktueller Stand {#current-status}

Stand März 2026 bedient Forward Email weltweit über 500.000 Domains, darunter namhafte Organisationen und Branchenführer wie:

* **Technologieunternehmen**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medienorganisationen**: Fox News Radio, Disney Ad Sales
* **Bildungseinrichtungen**: Die Universität Cambridge, Die Universität von Maryland, Die Universität von Washington, Tufts University, Swarthmore College
* **Regierungsstellen**: Regierung von Südaustralien, Regierung der Dominikanischen Republik
* **Weitere Organisationen**: RCD Hotels, Fly<span>.</span>io
* **Bekannte Entwickler**: Isaac Z. Schlueter (npm-Erfinder), David Heinemeier Hansson (Ruby on Rails-Erfinder)

Die Plattform entwickelt sich mit regelmäßigen Feature-Releases und Infrastrukturverbesserungen weiter und behauptet ihre Position als einziger 100 % quelloffener, verschlüsselter, datenschutzorientierter, transparenter und quantensicherer E-Mail-Dienst, der heute verfügbar ist.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
