# Om Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Om Forward Email {#about-forward-email-1}


## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [Grundlægger og Mission](#founder-and-mission)
* [Tidslinje](#timeline)
  * [2017 - Grundlæggelse og Lancering](#2017---founding-and-launch)
  * [2018 - Infrastruktur og Integration](#2018---infrastructure-and-integration)
  * [2019 - Performance Revolution](#2019---performance-revolution)
  * [2020 - Fokus på Privatliv og Sikkerhed](#2020---privacy-and-security-focus)
  * [2021 - Platform Modernisering](#2021---platform-modernization)
  * [2023 - Infrastruktur og Funktionsudvidelse](#2023---infrastructure-and-feature-expansion)
  * [2024 - Serviceoptimering og Avancerede Funktioner](#2024---service-optimization-and-advanced-features)
  * [2025 - Forbedringer af Privatliv og Protokolunderstøttelse {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC Overholdelse og Avanceret Filtrering {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Kerneprincipper](#core-principles)
* [Nuværende Status](#current-status)


## Oversigt {#overview}

> \[!TIP]
> For tekniske detaljer om vores arkitektur, sikkerhedsimplementeringer og køreplan, se [Teknisk Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email er en [gratis og open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") tjeneste med fokus på brugerens [ret til privatliv](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Hvad der begyndte som en simpel email-videresendelsesløsning i 2017, er udviklet til en omfattende email-platform, der tilbyder ubegrænsede brugerdefinerede domænenavne, ubegrænsede emailadresser og aliaser, ubegrænsede engangsemailadresser, spam- og phishingbeskyttelse, krypteret postkasseopbevaring og adskillige avancerede funktioner.

Tjenesten vedligeholdes og ejes af det oprindelige grundlæggerteam bestående af designere og udviklere. Den er bygget med 100% open-source software ved brug af [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") og [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Grundlægger og Mission {#founder-and-mission}

Forward Email blev grundlagt af **Nicholas Baugh** i 2017. Ifølge [Forward Email Teknisk Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) søgte Baugh oprindeligt en omkostningseffektiv og simpel løsning til at aktivere email på domænenavne til sine sideprojekter. Efter at have undersøgt tilgængelige muligheder begyndte han at kode sin egen løsning og købte domænet `forwardemail.net` den 2. oktober 2017.

Forward Emails mission går ud over at levere email-tjenester—den sigter mod at ændre, hvordan branchen tilgår email-privatliv og sikkerhed. Virksomhedens kerneværdier inkluderer gennemsigtighed, bruger kontrol og beskyttelse af privatliv gennem teknisk implementering fremfor blot politiske løfter.


## Tidslinje {#timeline}

### 2017 - Grundlæggelse og Lancering {#2017---founding-and-launch}

**2. oktober 2017**: Nicholas Baugh købte domænet `forwardemail.net` efter at have undersøgt omkostningseffektive email-løsninger til sine sideprojekter.

**5. november 2017**: Baugh skabte en 634-linjers JavaScript-fil ved brug af [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") til at videresende emails for ethvert brugerdefineret domænenavn. Denne første implementering blev udgivet som open-source på [GitHub](https://github.com/forwardemail), og tjenesten blev lanceret ved brug af GitHub Pages.
**November 2017**: Forward Email blev officielt lanceret efter en indledende udgivelse. Den tidlige version var rent DNS-baseret uden konto-registrering eller tilmeldingsproces—simpelthen en README-fil skrevet i Markdown med instruktioner. Brugere kunne opsætte e-mail videresendelse ved at konfigurere MX-poster til at pege på `mx1.forwardemail.net` og `mx2.forwardemail.net`, og tilføje en TXT-post med `forward-email=user@gmail.com`.

Enkeltheden og effektiviteten af denne løsning tiltrak opmærksomhed fra fremtrædende udviklere, herunder [David Heinemeier Hansson](https://dhh.dk) (skaberen af Ruby on Rails), som stadig bruger Forward Email på sit domæne `dhh.dk` den dag i dag.

### 2018 - Infrastruktur og Integration {#2018---infrastructure-and-integration}

**April 2018**: Da [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lancerede deres [privacy-first forbruger DNS-service](https://blog.cloudflare.com/announcing-1111/), skiftede Forward Email fra at bruge [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") til [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") til håndtering af [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") opslag, hvilket demonstrerede virksomhedens engagement i privatlivsfokuserede infrastrukturløsninger.

**Oktober 2018**: Forward Email tillod brugere at "Send Mail As" med [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") og [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), hvilket udvidede integrationsmulighederne med populære e-mailudbydere.

### 2019 - Performance Revolution {#2019---performance-revolution}

**Maj 2019**: Forward Email udgav v2, som repræsenterede en større omskrivning fra de oprindelige versioner. Denne opdatering fokuserede på [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") forbedringer gennem brug af [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams"), hvilket lagde fundamentet for platformens skalerbarhed.

### 2020 - Fokus på Privatliv og Sikkerhed {#2020---privacy-and-security-focus}

**Februar 2020**: Forward Email udgav Enhanced Privacy Protection-planen, som tillod brugere at slå fra for at sætte offentlige DNS-postindgange med deres e-mail videresendelses konfigurationsaliaser. Gennem denne plan skjules en brugers e-mail alias information fra at være offentligt søgbar på internettet. Virksomheden udgav også en funktion til at aktivere eller deaktivere specifikke aliaser, mens de stadig kunne fremstå som gyldige e-mailadresser og returnere succesfulde [SMTP statuskoder](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), hvor e-mails straks blev kasseret (svarende til at pipe output til [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Efter at have stødt på utallige forhindringer med eksisterende spam-detekteringsløsninger, der ikke respekterede Forward Emails privatlivspolitik, udgav virksomheden deres første alpha-version af Spam Scanner. Denne helt gratis og open-source [anti-spam filtrerings](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") løsning bruger en [Naive Bayes spam filter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") tilgang kombineret med [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") og [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") beskyttelse. Forward Email udgav også [to-faktor autentificering](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) ved brug af [engangsadgangskoder](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for forbedret kontosikkerhed.

**Maj 2020**: Forward Email tillod brugerdefineret [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") som en løsning for brugere til at omgå portblokering fra deres [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Virksomheden udgav også deres [Free Email Forwarding RESTful API](email-api) med komplet dokumentation og realtids eksempler på forespørgsler og svar, samt understøttelse af webhooks.
**August 2020**: Forward Email tilføjede support for [Authenticated Received Chain](arc) ("ARC") e-mail autentificeringssystemet, hvilket yderligere styrkede e-mail sikkerhed og leveringsmuligheder.

**23. november 2020**: Forward Email blev offentligt lanceret ud af deres beta-program, hvilket markerede en betydningsfuld milepæl i platformens udvikling.

### 2021 - Platform Modernisering {#2021---platform-modernization}

**Februar 2021**: Forward Email omstrukturerede deres kodebase for at fjerne alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programmeringssprog)") afhængigheder, hvilket gjorde deres stack 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") og [Node.js](https://en.wikipedia.org/wiki/Node.js). Denne arkitektoniske beslutning var i tråd med virksomhedens engagement i at opretholde en konsistent, open-source teknologistak.

**27. september 2021**: Forward Email [tilføjede support](email-forwarding-regex-pattern-filter) for e-mail videresendelsesaliaser, der matcher [regulære udtryk](https://en.wikipedia.org/wiki/Regular_expression "Regulært udtryk"), hvilket gav brugerne mere avancerede muligheder for e-mail routing.

### 2023 - Infrastruktur og Funktionsudvidelse {#2023---infrastructure-and-feature-expansion}

**Januar 2023**: Forward Email lancerede en redesignet og sidehastighedsoptimeret hjemmeside, der forbedrede brugeroplevelsen og ydeevnen.

**Februar 2023**: Virksomheden tilføjede support for [fejllogs](/faq#do-you-store-error-logs) og implementerede et [dark mode](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) farveskema på hjemmesiden, som svar på brugerpræferencer og tilgængelighedsbehov.

**Marts 2023**: Forward Email udgav [Tangerine](https://github.com/forwardemail/tangerine#readme) og integrerede det i hele deres infrastruktur, hvilket muliggør brug af [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationslaget. Virksomheden tilføjede også support for [MTA-STS](/faq#do-you-support-mta-sts) og skiftede fra [hCaptcha](/) til [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementerede og automatiserede helt ny infrastruktur. Hele servicen kørte nu på globalt load-balanseret og nærhedsbaseret DNS med sundhedstjek og failover ved brug af [Cloudflare](https://cloudflare.com), som erstattede den tidligere round-robin DNS tilgang. Virksomheden skiftede til **bare metal servere** hos flere udbydere, herunder [Vultr](https://www.vultr.com/?ref=429848) og [Digital Ocean](https://m.do.co/c/a7cecd27e071), begge SOC 2 Type 1-kompatible udbydere. MongoDB og Redis databaser blev flyttet til klyngede konfigurationer med primære og standby noder for høj tilgængelighed, end-to-end SSL kryptering, kryptering i hvile og point-in-time recovery (PITR).

**Maj 2023**: Forward Email lancerede deres **udgående SMTP** funktion til [afsendelse af e-mail med SMTP](/faq#do-you-support-sending-email-with-smtp) og [afsendelse af e-mail med API](/faq#do-you-support-sending-email-with-api) forespørgsler. Denne funktion inkluderer indbyggede sikkerhedsforanstaltninger for at sikre høj leveringsrate, et moderne og robust kø- og genforsøgsystem, og [understøtter fejllogs i realtid](/faq#do-you-store-error-logs).

**November 2023**: Forward Email lancerede deres [**krypterede postkasseopbevaring**](/blog/docs/best-quantum-safe-encrypted-email-service) funktion for [IMAP support](/faq#do-you-support-receiving-email-with-imap), hvilket repræsenterer et betydeligt fremskridt inden for e-mail privatliv og sikkerhed.

**December 2023**: Virksomheden [tilføjede support](/faq#do-you-support-pop3) for [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys og WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [tid til indbakke](/faq#i) overvågning, og [OpenPGP til IMAP opbevaring](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Serviceoptimering og Avancerede Funktioner {#2024---service-optimization-and-advanced-features}

**Februar 2024**: Forward Email [tilføjede kalender (CalDAV) support](/faq#do-you-support-calendars-caldav), hvilket udvidede platformens muligheder ud over e-mail til også at inkludere kalendersynkronisering.
**Marts til juli 2024**: Forward Email udgav store optimeringer og forbedringer til deres IMAP-, POP3- og CalDAV-tjenester med målet om at gøre deres service lige så hurtig som, hvis ikke hurtigere end, alternativer.

**Juli 2024**: Virksomheden [tilføjede iOS Push-support](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) for at løse Apple Mails manglende IMAP `IDLE`-kommando support på iOS, hvilket muliggør realtidsnotifikationer for Apple iOS-enheder. Forward Email tilføjede også overvågning af tid til indbakke ("TTI") for deres egen service samt Yahoo/AOL, og begyndte at tillade brugere at kryptere hele deres DNS TXT-record selv på gratisplanen. Som anmodet i [Privacy Guides diskussioner](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og [GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) tilføjede virksomheden muligheden for, at aliaser enten stille og roligt kan afvise med `250`, blødt afvise med `421` eller hårdt afvise med `550`, når de er deaktiverede.

**August 2024**: Forward Email tilføjede support til eksport af postkasser som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) og [Mbox](https://en.wikipedia.org/wiki/Mbox) formater (udover det eksisterende [SQLite](https://en.wikipedia.org/wiki/SQLite) eksportformat). [Webhook-signatur support blev tilføjet](https://forwardemail.net/faq#do-you-support-bounce-webhooks), og virksomheden begyndte at tillade brugere at sende nyhedsbreve, annonceringer og e-mail marketing gennem deres udgående SMTP-service. Domæneomfattende og alias-specifikke lagerkvoter for IMAP/POP3/CalDAV blev også implementeret.

### 2025 - Privatlivsforbedringer og protokolunderstøttelse {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**September 2024 til januar 2025**: Forward Email [tilføjede en meget efterspurgt ferieautomatisk svar-funktion og OpenPGP/WKD-kryptering til e-mail videresendelse](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), som bygger videre på deres allerede implementerede krypterede postkasselagringsmuligheder.

**21. januar 2025**: Grundlæggerens bedste ven "Jack", hans loyale hundekammerat, gik fredeligt bort i næsten 11-års alderen. Jack [vil altid blive husket](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) for sit urokkelige selskab, som støttede skabelsen af Forward Email. [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) er dedikeret til Jack og anerkender hans rolle i tjenestens udvikling.

**Februar 2025**: Forward Email skiftede til [DataPacket](https://www.datapacket.com) som deres nye primære datacenterudbyder og implementerede specialtilpasset, ydelsesfokuseret bare-metal hardware for yderligere at forbedre servicepålidelighed og hastighed.

**Marts 2025**: Version 1.0 af Forward Email blev officielt udgivet.

**April 2025**: Den første version af [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) blev offentliggjort, og virksomheden begyndte at acceptere kryptovalutabetalinger.

**Maj 2025**: Servicen lancerede ny API-dokumentation ved brug af [Scalar](https://github.com/scalar/scalar).

**Juni 2025**: Forward Email lancerede support for [CardDAV-protokollen](/faq#do-you-support-contacts-carddav), hvilket udvidede platformens kapaciteter til også at inkludere kontaktsynkronisering ud over eksisterende e-mail- og kalenderfunktioner.

**August 2025**: Platformen tilføjede [CalDAV VTODO/opgave-support](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), hvilket muliggør opgavestyring sammen med kalenderbegivenheder.

**November 2025**: Platformens sikkerhed blev forbedret med en migration fra PBKDF2 til [Argon2id](https://en.wikipedia.org/wiki/Argon2) til password hashing, og infrastrukturen blev migreret fra Redis til [Valkey](https://github.com/valkey-io/valkey).

**December 2025**: Version 2.0 blev udgivet, med introduktion af [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) support for håndhævet TLS-kryptering på e-mail transport og opgradering til [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - RFC-overholdelse og avanceret filtrering {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Januar 2026**: Forward Email udgav et omfattende [RFC-protokoloverholdelsesdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) og tilføjede support for [S/MIME-kryptering (RFC 8551)](/faq#do-you-support-smime-encryption) samt omfattende [Sieve e-mailfiltrering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) med [ManageSieve-protokol (RFC 5804)](/faq#do-you-support-sieve-email-filtering) support. REST API’en blev også udvidet til 39 endpoints.

**Februar 2026**: Den officielle, open-source webmail-klient blev lanceret på [mail.forwardemail.net](https://mail.forwardemail.net) ([kildekode på GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Platformen tilføjede også support for [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) og [Domain Connect](https://domainconnect.org) til 1-klik DNS-opsætning. Realtids push-notifikationer for IMAP, CalDAV og CardDAV blev lanceret ved brug af WebSockets.

**Marts 2026**: Support for per-domæne tilpasset S3-kompatibel lagring blev tilføjet, sammen med et kommandolinjeværktøj til administration. Arbejdet begyndte på tværplatforms desktop- og mobilapplikationer til macOS, Windows, Linux, iOS og Android ved brug af den samme open-source webmail-kodebase, bygget med [Tauri](https://tauri.app).


## Kerneprincipper {#core-principles}

Siden starten har Forward Email fastholdt en urokkelig forpligtelse til privatlivs- og sikkerhedsprincipper:

**100% Open-Source Filosofi**: I modsætning til konkurrenter, der kun open-sourcer deres frontend, mens backend holdes lukket, har Forward Email gjort hele sin kodebase—både frontend og backend—tilgængelig for offentlig inspektion på [GitHub](https://github.com/forwardemail).

**Privatliv-først Design**: Fra dag ét implementerede Forward Email en unik in-memory behandlingsmetode, der undgår at skrive e-mails til disk, hvilket adskiller det fra konventionelle e-mailtjenester, der gemmer beskeder i databaser eller filsystemer.

**Kontinuerlig Innovation**: Tjenesten har udviklet sig fra en simpel e-mail videresendelsesløsning til en omfattende e-mailplatform med funktioner som krypterede postkasser, kvante-resistent kryptering og support for standardprotokoller inklusive SMTP, IMAP, POP3 og CalDAV.

**Gennemsigtighed**: Al kode er open-source og tilgængelig for inspektion, hvilket sikrer, at brugere kan verificere privatlivspåstande i stedet for blot at stole på markedsføringsudsagn.

**Brugerkontrol**: Brugerne gives muligheder, herunder muligheden for selv at hoste hele platformen, hvis ønsket.


## Nuværende Status {#current-status}

Pr. marts 2026 betjener Forward Email over 500.000 domæner verden over, inklusive bemærkelsesværdige organisationer og brancheledere som:

* **Teknologivirksomheder**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medieorganisationer**: Fox News Radio, Disney Ad Sales
* **Uddannelsesinstitutioner**: University of Cambridge, University of Maryland, University of Washington, Tufts University, Swarthmore College
* **Offentlige myndigheder**: Regeringen i South Australia, Regeringen i Den Dominikanske Republik
* **Andre organisationer**: RCD Hotels, Fly<span>.</span>io
* **Bemærkelsesværdige udviklere**: Isaac Z. Schlueter (npm-skaber), David Heinemeier Hansson (Ruby on Rails-skaber)

Platformen fortsætter med at udvikle sig med regelmæssige funktionsudgivelser og infrastrukturforbedringer, og opretholder sin position som den eneste 100% open-source, krypterede, privatlivsfokuserede, gennemsigtige og kvante-resistente e-mailtjeneste, der findes i dag.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
