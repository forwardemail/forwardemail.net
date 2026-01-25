# Over het doorsturen van e-mail {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Over het doorsturen van e-mail {#about-forward-email-1}

## Inhoudsopgave {#table-of-contents}

* [Overzicht](#overview)
* [Oprichter en Missie](#founder-and-mission)
* [Tijdlijn](#timeline)
  * [2017 - Oprichting en lancering](#2017---founding-and-launch)
  * [2018 - Infrastructuur en integratie](#2018---infrastructure-and-integration)
  * [2019 - Prestatierevolutie](#2019---performance-revolution)
  * [2020 - Focus op privacy en beveiliging](#2020---privacy-and-security-focus)
  * [2021 - Platformmodernisering](#2021---platform-modernization)
  * [2023 - Uitbreiding van infrastructuur en functies](#2023---infrastructure-and-feature-expansion)
  * [2024 - Service-optimalisatie en geavanceerde functies](#2024---service-optimization-and-advanced-features)
  * [2025 - Privacyverbeteringen en protocolondersteuning](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-naleving en geavanceerde filtering](#2026---rfc-compliance-and-advanced-filtering)
* [Kernprincipes](#core-principles)
* [Huidige status](#current-status)

## Overzicht {#overview}

> \[!TIP]
> Zie [Technisch whitepaper](https://forwardemail.net/technical-whitepaper.pdf) voor technische details over onze architectuur, beveiligingsimplementaties en roadmap.

Forward Email is een [gratis en open source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [e-mail doorsturen](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") service, gericht op de [recht op privacy](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") van een gebruiker. Wat in 2017 begon als een eenvoudige oplossing voor het doorsturen van e-mails, is uitgegroeid tot een uitgebreid e-mailplatform met onbeperkte aangepaste domeinnamen, onbeperkte e-mailadressen en aliassen, onbeperkte wegwerpadressen, spam- en phishingbeveiliging, versleutelde mailboxopslag en talloze geavanceerde functies.

De dienst wordt onderhouden en beheerd door het oorspronkelijke team van ontwerpers en ontwikkelaars. De dienst is gebouwd met 100% open-source software, met behulp van [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") en [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Oprichter en Missie {#founder-and-mission}

Forward Email werd in 2017 opgericht door **Nicholas Baugh**. Volgens [Technisch whitepaper over het doorsturen van e-mails](https://forwardemail.net/technical-whitepaper.pdf) was Baugh aanvankelijk op zoek naar een kosteneffectieve en eenvoudige oplossing om e-mail op domeinnamen mogelijk te maken voor zijn zijprojecten. Na onderzoek naar de beschikbare opties begon hij zijn eigen oplossing te coderen en kocht hij op 2 oktober 2017 het domein `forwardemail.net`.

De missie van Forward Email reikt verder dan het leveren van e-maildiensten: het wil de manier waarop de sector omgaat met e-mailprivacy en -beveiliging transformeren. De kernwaarden van het bedrijf omvatten transparantie, gebruikerscontrole en privacybescherming door middel van technische implementatie, in plaats van alleen beleidsbeloftes.

## Tijdlijn {#timeline}

### 2017 - Oprichting en lancering {#2017---founding-and-launch}

**2 oktober 2017**: Nicholas Baugh kocht het domein `forwardemail.net` nadat hij onderzoek had gedaan naar kosteneffectieve e-mailoplossingen voor zijn zijprojecten.

**5 november 2017**: Baugh creëerde een JavaScript-bestand van 634 regels met behulp van [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") om e-mails voor elke aangepaste domeinnaam door te sturen. Deze eerste implementatie werd als open source gepubliceerd op [GitHub](https://github.com/forwardemail) en de service werd gelanceerd via GitHub Pages.

**November 2017**: Forward Email werd officieel gelanceerd na een eerste release. De eerste versie was puur DNS-gebaseerd, zonder accountregistratie of aanmeldingsproces – er was gewoon een README-bestand in Markdown met instructies. Gebruikers konden e-mailforwarding instellen door MX-records te configureren die naar `mx1.forwardemail.net` en `mx2.forwardemail.net` verwezen, en een TXT-record met `forward-email=user@gmail.com` toe te voegen.

De eenvoud en effectiviteit van deze oplossing trokken de aandacht van vooraanstaande ontwikkelaars, waaronder [David Heinemeier Hansson](https://dhh.dk) (maker van Ruby on Rails), die tot op de dag van vandaag Forward Email gebruikt op zijn domein `dhh.dk`.

### 2018 - Infrastructuur en integratie {#2018---infrastructure-and-integration}

**April 2018**: Toen [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") hun [privacy-first consumenten-DNS-service](https://blog.cloudflare.com/announcing-1111/) lanceerde, schakelde Forward Email over van [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") naar [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") voor het verwerken van [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-lookups, wat de toewijding van het bedrijf aan infrastructuurkeuzes met een focus op privacy aantoont.

**Oktober 2018**: Met Forward Email konden gebruikers 'E-mail verzenden als' met [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") en [Vooruitzichten](https://en.wikipedia.org/wiki/Outlook "Outlook"), waarmee de integratiemogelijkheden met populaire e-mailproviders werden uitgebreid.

### 2019 - Prestatierevolutie {#2019---performance-revolution}

**Mei 2019**: Forward Email bracht v2 uit, een ingrijpende herschrijving ten opzichte van de eerste versies. Deze update richtte zich op verbeteringen in [prestatie](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") door gebruik te maken van [stromen](https://en.wikipedia.org/wiki/Streams "Streams") van [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), waarmee de basis werd gelegd voor de schaalbaarheid van het platform.

### 2020 - Focus op privacy en beveiliging {#2020---privacy-and-security-focus}

**Februari 2020**: Forward Email heeft het Enhanced Privacy Protection-abonnement uitgebracht, waarmee gebruikers het instellen van openbare DNS-records met hun aliassen voor e-maildoorstuurconfiguratie kunnen uitschakelen. Dankzij dit abonnement zijn de e-mailaliassen van een gebruiker niet openbaar vindbaar op internet. Het bedrijf heeft ook een functie uitgebracht om specifieke aliassen in of uit te schakelen, terwijl ze nog steeds als geldige e-mailadressen worden weergegeven en succesvolle [SMTP-statuscodes](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")-berichten retourneren, waarbij e-mails direct worden verwijderd (vergelijkbaar met het doorsturen van de uitvoer naar [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Nadat het bedrijf talloze obstakels had ondervonden met bestaande spamdetectieoplossingen die het privacybeleid van Forward Email niet respecteerden, bracht het bedrijf de eerste alfaversie van Spam Scanner uit. Deze volledig gratis en open-source [anti-spamfiltering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")-oplossing maakt gebruik van een [Naïeve Bayes-spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-aanpak in combinatie met [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing")- en [IDN-homograafaanval](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-beveiliging. Forward Email bracht ook [tweefactorauthenticatie](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) uit met [eenmalige wachtwoorden](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) voor verbeterde accountbeveiliging.

**Mei 2020**: Forward Email maakte een aangepaste [poortdoorschakeling](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") mogelijk als tijdelijke oplossing voor gebruikers om poortblokkering door hun [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") te omzeilen. Het bedrijf bracht ook hun [Gratis RESTful API voor e-maildoorsturen](email-api) uit met volledige documentatie en voorbeelden van realtime aanvragen en reacties, evenals ondersteuning voor webhooks.

**Augustus 2020**: Forward Email heeft ondersteuning toegevoegd voor het e-mailauthenticatiesysteem [Geverifieerde ontvangen keten](arc) ("ARC"), waarmee de beveiliging en leverbaarheid van e-mails verder worden versterkt.

**23 november 2020**: Forward Email is officieel gelanceerd na het bètaprogramma, wat een belangrijke mijlpaal markeert in de ontwikkeling van het platform.

### 2021 - Platformmodernisering {#2021---platform-modernization}

**Februari 2021**: Forward Email heeft hun codebase gerefactored om alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) (Python (programmeertaal))) afhankelijkheden te verwijderen, waardoor hun stack 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") en [Node.js](https://en.wikipedia.org/wiki/Node.js) is. Deze architectuurbeslissing sloot aan bij de toewijding van het bedrijf aan het onderhouden van een consistente, open-source technologiestack.

**27 september 2021**: Stuur e-mail [extra ondersteuning](email-forwarding-regex-pattern-filter) door voor e-maildoorstuuraliassen die overeenkomen met [reguliere expressies](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"). Zo krijgen gebruikers geavanceerdere e-mailrouteringsmogelijkheden.

### 2023 - Uitbreiding van infrastructuur en functies {#2023---infrastructure-and-feature-expansion}

**Januari 2023**: Forward Email lanceerde een vernieuwde website met geoptimaliseerde paginasnelheid, waarmee de gebruikerservaring en prestaties werden verbeterd.

**Februari 2023**: Het bedrijf heeft ondersteuning voor [foutlogboeken](/faq#do-you-store-error-logs) toegevoegd en een [donkere modus](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)-kleurenschema voor de website geïmplementeerd, waarmee wordt ingespeeld op de voorkeuren van gebruikers en de behoeften op het gebied van toegankelijkheid.

**Maart 2023**: Forward Email heeft [Mandarijn](https://github.com/forwardemail/tangerine#readme) uitgebracht en geïntegreerd in hun infrastructuur, waardoor het gebruik van [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") op applicatieniveau mogelijk is. Het bedrijf heeft ook ondersteuning voor [MTA-STS](/faq#do-you-support-mta-sts) toegevoegd en is overgestapt van [hCaptcha](/) naar [Cloudflare draaikruis](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementeerde en automatiseerde een volledig nieuwe infrastructuur. De volledige service begon te draaien op wereldwijd load-balanced en proximity-gebaseerde DNS met health checks en failover via [Cloudflare](https://cloudflare.com), ter vervanging van de eerdere round-robin DNS-aanpak. Het bedrijf stapte over op **bare-metal servers** bij meerdere providers, waaronder [Vultr](https://www.vultr.com/?ref=429848) en [Digitale Oceaan](https://m.do.co/c/a7cecd27e071), beide SOC 2 Type 1-conforme providers. MongoDB- en Redis-databases werden verplaatst naar geclusterde configuraties met primaire en standby-knooppunten voor hoge beschikbaarheid, end-to-end SSL-encryptie, encryptie-at-rest en point-in-time recovery (PITR).

**Mei 2023**: Forward Email lanceerde hun **outbound SMTP**-functie voor [e-mail verzenden met SMTP](/faq#do-you-support-sending-email-with-smtp) en [e-mail verzenden met API](/faq#do-you-support-sending-email-with-api) verzoeken. Deze functie bevat ingebouwde beveiligingen om een hoge leverbaarheid te garanderen, een modern en robuust wachtrij- en herhaalsysteem, en [ondersteunt foutlogboeken in realtime](/faq#do-you-store-error-logs).

**November 2023**: Forward Email heeft de functie [**gecodeerde mailboxopslag**](/blog/docs/best-quantum-safe-encrypted-email-service) voor [IMAP-ondersteuning](/faq#do-you-support-receiving-email-with-imap) gelanceerd, wat een aanzienlijke vooruitgang betekent op het gebied van e-mailprivacy en -beveiliging.

**December 2023**: Het bedrijf [extra ondersteuning](/faq#do-you-support-pop3) voor [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [wachtwoorden en WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [tijd om in te posten](/faq#i) monitoring en [OpenPGP voor IMAP-opslag](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Service-optimalisatie en geavanceerde functies {#2024---service-optimization-and-advanced-features}

**Februari 2024**: E-mail doorsturen [toegevoegde kalender (CalDAV) ondersteuning](/faq#do-you-support-calendars-caldav), waarmee de mogelijkheden van het platform worden uitgebreid met meer dan alleen e-mail, inclusief agendasynchronisatie.

**Maart tot en met juli 2024**: Forward Email heeft belangrijke optimalisaties en verbeteringen aan hun IMAP-, POP3- en CalDAV-services uitgebracht, met als doel om hun service net zo snel, of zelfs sneller, te maken dan alternatieven.

**Juli 2024**: Het bedrijf [iOS Push-ondersteuning toegevoegd](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) pakt het gebrek aan ondersteuning voor IMAP `IDLE` commando's in Apple Mail op iOS aan, waardoor realtime meldingen voor Apple iOS-apparaten mogelijk worden. Forward Email heeft ook time-to-inbox ("TTI") monitoring toegevoegd voor hun eigen dienst en Yahoo/AOL, en gebruikers de mogelijkheid gegeven om hun volledige DNS TXT-record te versleutelen, zelfs met het gratis abonnement. Zoals gevraagd in [Discussies over privacygidsen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) en [GitHub-problemen](https://github.com/forwardemail/forwardemail.net/issues/254), heeft het bedrijf de mogelijkheid toegevoegd voor aliassen om `250` stilzwijgend, `421` zacht of `550` hard te weigeren wanneer deze functie is uitgeschakeld.

**Augustus 2024**: Forward Email heeft ondersteuning toegevoegd voor het exporteren van mailboxen in de formaten [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) en [Mbox](https://en.wikipedia.org/wiki/Mbox) (naast het bestaande exportformaat [SQLite](https://en.wikipedia.org/wiki/SQLite)). Ook [Ondersteuning voor webhook-handtekeningen is toegevoegd](https://forwardemail.net/faq#do-you-support-bounce-webhooks) werd toegevoegd en het bedrijf begon gebruikers toe te staan nieuwsbrieven, aankondigingen en e-mailmarketing te versturen via hun uitgaande SMTP-service. Domeinbrede en aliasspecifieke opslagquota voor IMAP/POP3/CalDAV werden eveneens geïmplementeerd.

### 2025 - Privacyverbeteringen en protocolondersteuning {#2025---privacy-enhancements-and-protocol-support}

**September 2024 tot januari 2025**: Stuur e-mail [een veelgevraagde functie voor het beantwoorden van vakantieberichten en OpenPGP/WKD-encryptie voor het doorsturen van e-mails toegevoegd](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) door, voortbouwend op de reeds geïmplementeerde mogelijkheden voor versleutelde mailboxopslag.

**21 januari 2025**: De beste vriend van de oprichter, "Jack", zijn trouwe viervoeter, is vredig overleden op bijna 11-jarige leeftijd. Jack [zal altijd herinnerd worden](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) voor zijn onwrikbare steun bij de ontwikkeling van Forward Email. De [Technisch whitepaper over het doorsturen van e-mails](https://forwardemail.net/technical-whitepaper.pdf) is opgedragen aan Jack, als erkenning voor zijn rol in de ontwikkeling van de dienst.

**Februari 2025**: Forward Email is overgestapt naar [Datapakket](https://www.datapacket.com) als hun nieuwe primaire datacenterprovider. Hierbij is aangepaste, prestatiegerichte, bare-metal hardware geïmplementeerd om de betrouwbaarheid en snelheid van de service verder te verbeteren.

**Juni 2025**: Forward Email heeft ondersteuning gelanceerd voor [CardDAV-protocol](/faq#do-you-support-contacts-carddav), waarmee de mogelijkheden van het platform worden uitgebreid met contactsynchronisatie naast bestaande e-mail- en agendaservices.

### 2026 - RFC-naleving en geavanceerde filtering {#2026---rfc-compliance-and-advanced-filtering}

**Januari 2026**: Forward Email heeft een uitgebreid [RFC-protocol nalevingsdocument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) uitgebracht met details over volledige standaardondersteuning voor SMTP, IMAP, POP3 en CalDAV. Het platform heeft ook [REQUIRETLS-ondersteuning (RFC 8689)](/faq#requiretls-support) toegevoegd voor afgedwongen TLS-encryptie bij e-mailtransport, [S/MIME-encryptie (RFC 8551)](/faq#do-you-support-smime-encryption) voor veilige berichtondertekening en -encryptie, en uitgebreide [Sieve e-mailfiltering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) met [ManageSieve-protocol (RFC 5804)](/faq#do-you-support-sieve-email-filtering)-ondersteuning voor server-side e-mailfiltering. De [REST API](/email-api) is uitgebreid naar 39 eindpunten die berichten, mappen, contacten, agenda's en agenda-evenementen dekken.

## Kernprincipes {#core-principles}

Sinds de oprichting heeft Forward Email zich altijd trouw gehouden aan de principes van privacy en beveiliging:

**100% open-sourcefilosofie**: In tegenstelling tot concurrenten die alleen hun front-ends open sourcen en de back-ends gesloten houden, heeft Forward Email zijn volledige codebase, zowel front-end als back-end, beschikbaar gesteld voor openbare inzage op [GitHub](https://github.com/forwardemail).

**Privacy-First-ontwerp**: Forward Email heeft vanaf dag één een unieke in-memory verwerkingsaanpak geïmplementeerd, waardoor e-mails niet naar schijf worden geschreven. Daarmee onderscheidt Forward Email zich van conventionele e-mailservices, die berichten opslaan in databases of bestandssystemen.

**Voortdurende innovatie**: De service is geëvolueerd van een eenvoudige oplossing voor het doorsturen van e-mails tot een uitgebreid e-mailplatform met functies zoals versleutelde mailboxen, kwantumbestendige versleuteling en ondersteuning voor standaardprotocollen, waaronder SMTP, IMAP, POP3 en CalDAV.

**Transparantie**: Alle code open source maken en ter inzage beschikbaar stellen, zodat gebruikers privacyclaims kunnen verifiëren in plaats van alleen maar te vertrouwen op marketingverklaringen.

**Gebruikerscontrole**: Gebruikers krijgen opties, waaronder de mogelijkheid om het hele platform zelf te hosten als dat gewenst is.

## Huidige status {#current-status}

Forward Email bedient in 2025 wereldwijd meer dan 500.000 domeinen, waaronder bekende organisaties en marktleiders zoals:

* **Technologiebedrijven**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Media-organisaties**: Fox News Radio, Disney Ad Sales
* **Onderwijsinstellingen**: De Universiteit van Cambridge, De Universiteit van Maryland, De Universiteit van Washington, Tufts University, Swarthmore College
* **Overheidsinstellingen**: Overheid van Zuid-Australië, Overheid van de Dominicaanse Republiek
* **Andere organisaties**: RCD Hotels, Fly<span>.</span>io
* **Belangrijke ontwikkelaars**: Isaac Z. Schlueter (maker van npm), David Heinemeier Hansson (maker van Ruby on Rails)

Het platform blijft zich ontwikkelen met regelmatige nieuwe functies en verbeteringen aan de infrastructuur. Zo behoudt het zijn positie als de enige 100% open-source, gecodeerde, privacygerichte, transparante en kwantumbestendige e-mailservice die vandaag de dag beschikbaar is.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />