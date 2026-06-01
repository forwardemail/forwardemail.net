# Over Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team en bedrijfsverhaal" class="rounded-lg" />

# Over Forward Email {#about-forward-email-1}


## Inhoudsopgave {#table-of-contents}

* [Overzicht](#overview)
* [Oprichter en Missie](#founder-and-mission)
* [Tijdlijn](#timeline)
  * [2017 - Oprichting en Lancering](#2017---founding-and-launch)
  * [2018 - Infrastructuur en Integratie](#2018---infrastructure-and-integration)
  * [2019 - Prestatierevolutie](#2019---performance-revolution)
  * [2020 - Focus op Privacy en Beveiliging](#2020---privacy-and-security-focus)
  * [2021 - Modernisering van het Platform](#2021---platform-modernization)
  * [2023 - Uitbreiding van Infrastructuur en Functies](#2023---infrastructure-and-feature-expansion)
  * [2024 - Serviceoptimalisatie en Geavanceerde Functies](#2024---service-optimization-and-advanced-features)
  * [2025 - Privacyverbeteringen en Protocolondersteuning {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-naleving en Geavanceerde Filtering {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Kernprincipes](#core-principles)
* [Huidige Status](#current-status)


## Overzicht {#overview}

> \[!TIP]
> Voor technische details over onze architectuur, beveiligingsimplementaties en roadmap, zie het [Technisch Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email is een [gratis en open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Gratis en open-source") [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") dienst gericht op het [recht op privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Recht op privacy") van de gebruiker. Wat begon als een eenvoudige e-mail doorstuuroplossing in 2017 is uitgegroeid tot een uitgebreid e-mailplatform dat onbeperkte aangepaste domeinnamen, onbeperkte e-mailadressen en aliassen, onbeperkte wegwerp-e-mailadressen, spam- en phishingbescherming, versleutelde mailboxopslag en tal van geavanceerde functies biedt.

De dienst wordt onderhouden en is eigendom van het oorspronkelijke oprichtersteam van ontwerpers en ontwikkelaars. Het is gebouwd met 100% open-source software met gebruik van [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") en [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Oprichter en Missie {#founder-and-mission}

Forward Email is opgericht door **Nicholas Baugh** in 2017. Volgens het [Forward Email Technisch Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) was Baugh aanvankelijk op zoek naar een kosteneffectieve en eenvoudige oplossing om e-mail op domeinnamen mogelijk te maken voor zijn nevenprojecten. Na het onderzoeken van beschikbare opties begon hij zijn eigen oplossing te coderen en kocht hij op 2 oktober 2017 het domein `forwardemail.net`.

De missie van Forward Email gaat verder dan het leveren van e-maildiensten—het streeft ernaar de manier waarop de industrie omgaat met e-mailprivacy en beveiliging te transformeren. De kernwaarden van het bedrijf omvatten transparantie, gebruikerscontrole en privacybescherming door technische implementatie in plaats van alleen beleidsbeloften.


## Tijdlijn {#timeline}

### 2017 - Oprichting en Lancering {#2017---founding-and-launch}

**2 oktober 2017**: Nicholas Baugh kocht het domein `forwardemail.net` na het onderzoeken van kosteneffectieve e-mailoplossingen voor zijn nevenprojecten.

**5 november 2017**: Baugh maakte een JavaScript-bestand van 634 regels met behulp van [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") om e-mails door te sturen voor elke aangepaste domeinnaam. Deze eerste implementatie werd als open-source gepubliceerd op [GitHub](https://github.com/forwardemail) en de dienst werd gelanceerd met GitHub Pages.
**November 2017**: Forward Email werd officieel gelanceerd na een initiële release. De vroege versie was puur DNS-gebaseerd zonder accountregistratie of aanmeldproces—gewoon een README-bestand geschreven in Markdown met instructies. Gebruikers konden e-mail doorsturen instellen door MX-records te configureren die naar `mx1.forwardemail.net` en `mx2.forwardemail.net` verwezen, en een TXT-record toe te voegen met `forward-email=user@gmail.com`.

De eenvoud en effectiviteit van deze oplossing trok de aandacht van vooraanstaande ontwikkelaars, waaronder [David Heinemeier Hansson](https://dhh.dk) (maker van Ruby on Rails), die Forward Email tot op de dag van vandaag op zijn domein `dhh.dk` blijft gebruiken.

### 2018 - Infrastructuur en Integratie {#2018---infrastructure-and-integration}

**April 2018**: Toen [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") hun [privacy-first consumenten DNS-service](https://blog.cloudflare.com/announcing-1111/) lanceerde, schakelde Forward Email over van het gebruik van [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") naar [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") voor het afhandelen van [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-opzoekingen, waarmee het bedrijf zijn inzet voor privacygerichte infrastructuurkeuzes aantoonde.

**Oktober 2018**: Forward Email stelde gebruikers in staat om "Mail te Verzenden Als" met [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") en [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), waarmee de integratiemogelijkheden met populaire e-mailproviders werden uitgebreid.

### 2019 - Prestatie Revolutie {#2019---performance-revolution}

**Mei 2019**: Forward Email bracht versie 2 uit, die een grote herschrijving was van de initiële versies. Deze update richtte zich op [prestatie](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")-verbeteringen door gebruik te maken van [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams"), waarmee de basis werd gelegd voor de schaalbaarheid van het platform.

### 2020 - Focus op Privacy en Beveiliging {#2020---privacy-and-security-focus}

**Februari 2020**: Forward Email bracht het Enhanced Privacy Protection-plan uit, waarmee gebruikers het instellen van publieke DNS-recordvermeldingen met hun e-maildoorstuurconfiguratie-aliases konden uitschakelen. Via dit plan wordt de e-mailaliasinformatie van een gebruiker verborgen voor publieke zoekopdrachten op het internet. Het bedrijf bracht ook een functie uit om specifieke aliassen in- of uit te schakelen terwijl ze nog steeds als geldige e-mailadressen verschijnen en succesvolle [SMTP-statuscodes](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") retourneren, waarbij e-mails onmiddellijk worden weggegooid (vergelijkbaar met het doorsturen van output naar [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Na talloze obstakels met bestaande spamdetectieoplossingen die de privacyverklaring van Forward Email niet respecteerden, bracht het bedrijf hun eerste alpha-versie van Spam Scanner uit. Deze volledig gratis en open-source [anti-spam filtering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") oplossing gebruikt een [Naive Bayes spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-benadering gecombineerd met [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") en [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") bescherming. Forward Email bracht ook [twee-factor authenticatie](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) uit met gebruik van [eenmalige wachtwoorden](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) voor verbeterde accountbeveiliging.

**Mei 2020**: Forward Email maakte aangepaste [poortdoorsturing](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") mogelijk als een workaround voor gebruikers om poortblokkades door hun [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") te omzeilen. Het bedrijf bracht ook hun [Gratis E-mail Doorstuur RESTful API](email-api) uit met volledige documentatie en realtime voorbeelden van verzoeken en antwoorden, samen met ondersteuning voor webhooks.
**Augustus 2020**: Forward Email voegde ondersteuning toe voor het [Authenticated Received Chain](arc) ("ARC") e-mailauthenticatiesysteem, waarmee de e-mailbeveiliging en afleverbaarheid verder werden versterkt.

**23 november 2020**: Forward Email werd publiekelijk gelanceerd uit hun bètaprogramma, wat een belangrijke mijlpaal markeerde in de ontwikkeling van het platform.

### 2021 - Platformmodernisering {#2021---platform-modernization}

**Februari 2021**: Forward Email refactorde hun codebase om alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)") afhankelijkheden te verwijderen, waardoor hun stack 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") en [Node.js](https://en.wikipedia.org/wiki/Node.js) werd. Deze architecturale beslissing sloot aan bij de toewijding van het bedrijf om een consistente, open-source technologiestack te behouden.

**27 september 2021**: Forward Email [voegde ondersteuning toe](email-forwarding-regex-pattern-filter) voor e-maildoorstuuraliassen die overeenkomen met [reguliere expressies](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), waardoor gebruikers meer geavanceerde e-mailrouteringsmogelijkheden kregen.

### 2023 - Infrastructuur en Functie-uitbreiding {#2023---infrastructure-and-feature-expansion}

**Januari 2023**: Forward Email lanceerde een herontworpen en pagina-snelheid geoptimaliseerde website, wat de gebruikerservaring en prestaties verbeterde.

**Februari 2023**: Het bedrijf voegde ondersteuning toe voor [foutlogboeken](/faq#do-you-store-error-logs) en implementeerde een [donkere modus](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) website kleurenschema, als reactie op gebruikersvoorkeuren en toegankelijkheidsbehoeften.

**Maart 2023**: Forward Email bracht [Tangerine](https://github.com/forwardemail/tangerine#readme) uit en integreerde het door hun infrastructuur, waardoor het gebruik van [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") op applicatieniveau mogelijk werd. Het bedrijf voegde ook ondersteuning toe voor [MTA-STS](/faq#do-you-support-mta-sts) en schakelde over van [hCaptcha](/) naar [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementeerde en automatiseerde volledig nieuwe infrastructuur. De gehele dienst draaide voortaan op wereldwijd load-balanced en nabijheidsgebaseerde DNS met health checks en failover via [Cloudflare](https://cloudflare.com), ter vervanging van de eerdere round-robin DNS aanpak. Het bedrijf schakelde over naar **bare metal servers** bij meerdere providers, waaronder [Vultr](https://www.vultr.com/?ref=429848) en [Digital Ocean](https://m.do.co/c/a7cecd27e071), beide SOC 2 Type 1 conforme providers. MongoDB- en Redis-databases werden verplaatst naar geclusterde configuraties met primaire en standby nodes voor hoge beschikbaarheid, end-to-end SSL-encryptie, encryptie-at-rest en point-in-time recovery (PITR).

**Mei 2023**: Forward Email lanceerde hun **uitgaande SMTP** functie voor [e-mail verzenden met SMTP](/faq#do-you-support-sending-email-with-smtp) en [e-mail verzenden met API](/faq#do-you-support-sending-email-with-api) verzoeken. Deze functie bevat ingebouwde beveiligingen om hoge afleverbaarheid te garanderen, een modern en robuust wachtrij- en retry-systeem, en [ondersteunt foutlogboeken in realtime](/faq#do-you-store-error-logs).

**November 2023**: Forward Email lanceerde hun [**versleutelde mailboxopslag**](/blog/docs/best-quantum-safe-encrypted-email-service) functie voor [IMAP-ondersteuning](/faq#do-you-support-receiving-email-with-imap), wat een belangrijke vooruitgang betekent in e-mailprivacy en beveiliging.

**December 2023**: Het bedrijf [voegde ondersteuning toe](/faq#do-you-support-pop3) voor [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys en WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [time to inbox](/faq#i) monitoring, en [OpenPGP voor IMAP-opslag](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Serviceoptimalisatie en Geavanceerde Functies {#2024---service-optimization-and-advanced-features}

**Februari 2024**: Forward Email [voegde kalender (CalDAV) ondersteuning toe](/faq#do-you-support-calendars-caldav), waarmee de mogelijkheden van het platform werden uitgebreid voorbij e-mail naar kalendersynchronisatie.
**Maart tot juli 2024**: Forward Email bracht grote optimalisaties en verbeteringen uit voor hun IMAP-, POP3- en CalDAV-diensten, met als doel hun service net zo snel, zo niet sneller dan alternatieven te maken.

**Juli 2024**: Het bedrijf [voegde iOS Push-ondersteuning toe](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) om het ontbreken van IMAP `IDLE`-commando-ondersteuning in Apple Mail op iOS aan te pakken, waardoor realtime meldingen voor Apple iOS-apparaten mogelijk werden. Forward Email voegde ook tijd tot inbox ("TTI") monitoring toe voor hun eigen service en Yahoo/AOL, en begon gebruikers toe te staan hun gehele DNS TXT-record te versleutelen, zelfs op het gratis abonnement. Zoals gevraagd in [Privacy Guides discussies](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) en [GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254), voegde het bedrijf de mogelijkheid toe voor aliassen om uitgeschakeld te worden met een stille afwijzing `250`, zachte afwijzing `421`, of harde afwijzing `550`.

**Augustus 2024**: Forward Email voegde ondersteuning toe voor het exporteren van mailboxen als [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) en [Mbox](https://en.wikipedia.org/wiki/Mbox) formaten (naast het bestaande [SQLite](https://en.wikipedia.org/wiki/SQLite) exportformaat). [Webhook-handtekeningondersteuning werd toegevoegd](https://forwardemail.net/faq#do-you-support-bounce-webhooks), en het bedrijf begon gebruikers toe te staan nieuwsbrieven, aankondigingen en e-mailmarketing te versturen via hun uitgaande SMTP-service. Domeinbrede en alias-specifieke opslagquota voor IMAP/POP3/CalDAV werden ook geïmplementeerd.

### 2025 - Privacyverbeteringen en protocolondersteuning {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**September 2024 tot januari 2025**: Forward Email [voegde een veelgevraagde afwezigheidsassistent en OpenPGP/WKD-versleuteling voor e-mail forwarding toe](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), voortbouwend op hun reeds geïmplementeerde versleutelde mailboxopslagmogelijkheden.

**21 januari 2025**: De beste vriend van de oprichter "Jack", zijn trouwe viervoeter, is vredig overleden op bijna 11-jarige leeftijd. Jack [zal altijd herinnerd worden](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) voor zijn onwankelbare gezelschap dat de creatie van Forward Email ondersteunde. Het [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) is aan Jack opgedragen, als erkenning van zijn rol in de ontwikkeling van de service.

**Februari 2025**: Forward Email stapte over op [DataPacket](https://www.datapacket.com) als hun nieuwe primaire datacenterprovider, waarbij ze aangepaste, prestatiegerichte bare-metal hardware implementeerden om de betrouwbaarheid en snelheid van de service verder te verbeteren.

**Maart 2025**: Versie 1.0 van Forward Email werd officieel uitgebracht.

**April 2025**: De eerste versie van het [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) werd gepubliceerd, en het bedrijf begon cryptocurrency-betalingen te accepteren.

**Mei 2025**: De service lanceerde nieuwe API-documentatie met behulp van [Scalar](https://github.com/scalar/scalar).

**Juni 2025**: Forward Email lanceerde ondersteuning voor het [CardDAV-protocol](/faq#do-you-support-contacts-carddav), waarmee de mogelijkheden van het platform werden uitgebreid met contactensynchronisatie naast de bestaande e-mail- en kalenderservices.

**Augustus 2025**: Het platform voegde [CalDAV VTODO/tasks-ondersteuning](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)) toe, waarmee taakbeheer naast kalendergebeurtenissen mogelijk werd.

**November 2025**: De beveiliging van het platform werd verbeterd met een migratie van PBKDF2 naar [Argon2id](https://en.wikipedia.org/wiki/Argon2) voor wachtwoordhashing, en de infrastructuur werd gemigreerd van Redis naar [Valkey](https://github.com/valkey-io/valkey).

**December 2025**: Versie 2.0 werd uitgebracht, met introductie van [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) ondersteuning voor afgedwongen TLS-versleuteling bij e-mailtransport en een upgrade naar [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - RFC-naleving en geavanceerde filtering {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Januari 2026**: Forward Email bracht een uitgebreid [RFC-protocol nalevingsdocument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) uit en voegde ondersteuning toe voor [S/MIME-encryptie (RFC 8551)](/faq#do-you-support-smime-encryption) en uitgebreide [Sieve e-mailfiltering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) met ondersteuning voor het [ManageSieve-protocol (RFC 5804)](/faq#do-you-support-sieve-email-filtering). De REST API werd ook uitgebreid naar 39 eindpunten.

**Februari 2026**: De officiële, open-source webmailclient werd gelanceerd op [mail.forwardemail.net](https://mail.forwardemail.net) ([broncode op GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Het platform voegde ook ondersteuning toe voor [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) en [Domain Connect](https://domainconnect.org) voor 1-klik DNS-configuratie. Real-time pushmeldingen voor IMAP, CalDAV en CardDAV werden gelanceerd met behulp van WebSockets.

**Maart 2026**: Ondersteuning voor per-domein aangepaste S3-compatibele opslag werd toegevoegd, samen met een commandoregeltool voor beheer. Er werd begonnen met het ontwikkelen van cross-platform desktop- en mobiele applicaties voor macOS, Windows, Linux, iOS en Android, gebruikmakend van dezelfde open-source webmailcodebasis, gebouwd met [Tauri](https://tauri.app).


## Kernprincipes {#core-principles}

Sinds de oprichting heeft Forward Email een onwankelbare toewijding aan privacy- en beveiligingsprincipes gehandhaafd:

**100% Open-Source Filosofie**: In tegenstelling tot concurrenten die alleen hun frontends open-source maken terwijl ze backends gesloten houden, heeft Forward Email de volledige codebasis—zowel frontend als backend—beschikbaar gesteld voor publieke controle op [GitHub](https://github.com/forwardemail).

**Privacy-First Ontwerp**: Vanaf dag één implementeerde Forward Email een unieke in-memory verwerkingsmethode die voorkomt dat e-mails naar de schijf worden geschreven, wat het onderscheidt van conventionele e-mailservices die berichten opslaan in databases of bestandssystemen.

**Continue Innovatie**: De dienst is geëvolueerd van een eenvoudige e-maildoorstuuroplossing naar een uitgebreid e-mailplatform met functies zoals versleutelde mailboxen, kwantumresistente encryptie en ondersteuning voor standaardprotocollen zoals SMTP, IMAP, POP3 en CalDAV.

**Transparantie**: Alle code open-source en beschikbaar maken voor inspectie, zodat gebruikers privacyclaims kunnen verifiëren in plaats van alleen op marketinguitspraken te vertrouwen.

**Gebruikerscontrole**: Gebruikers de mogelijkheid bieden om zelf keuzes te maken, inclusief de optie om het volledige platform zelf te hosten indien gewenst.


## Huidige status {#current-status}

Vanaf maart 2026 bedient Forward Email meer dan 500.000 domeinen wereldwijd, waaronder bekende organisaties en marktleiders zoals:

* **Technologiebedrijven**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Media-organisaties**: Fox News Radio, Disney Ad Sales
* **Onderwijsinstellingen**: De Universiteit van Cambridge, De Universiteit van Maryland, De Universiteit van Washington, Tufts University, Swarthmore College
* **Overheidsinstanties**: Regering van Zuid-Australië, Regering van de Dominicaanse Republiek
* **Andere organisaties**: RCD Hotels, Fly<span>.</span>io
* **Bekende ontwikkelaars**: Isaac Z. Schlueter (npm-maker), David Heinemeier Hansson (maker van Ruby on Rails)

Het platform blijft zich ontwikkelen met regelmatige functiereleases en verbeteringen aan de infrastructuur, en behoudt daarmee zijn positie als de enige 100% open-source, versleutelde, privacygerichte, transparante en kwantumresistente e-mailservice die vandaag beschikbaar is.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
