# Om videresendelse af e-mail {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Om videresendelse af e-mail {#about-forward-email-1}

## Indholdsfortegnelse {#table-of-contents}

* [Oversigt](#overview)
* [Grundlægger og mission](#founder-and-mission)
* [Tidslinje](#timeline)
  * [2017 - Grundlæggelse og lancering](#2017---founding-and-launch)
  * [2018 - Infrastruktur og integration](#2018---infrastructure-and-integration)
  * [2019 - Præstationsrevolution](#2019---performance-revolution)
  * [2020 - Fokus på privatliv og sikkerhed](#2020---privacy-and-security-focus)
  * [2021 - Platformmodernisering](#2021---platform-modernization)
  * [2023 - Udvidelse af infrastruktur og funktioner](#2023---infrastructure-and-feature-expansion)
  * [2024 - Serviceoptimering og avancerede funktioner](#2024---service-optimization-and-advanced-features)
  * [2025 - Privatlivsforbedringer og protokolunderstøttelse](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-overholdelse og avanceret filtrering](#2026---rfc-compliance-and-advanced-filtering)
* [Kerneprincipper](#core-principles)
* [Aktuel status](#current-status)

## Oversigt {#overview}

> \[!TIP]
> For tekniske detaljer om vores arkitektur, sikkerhedsimplementeringer og køreplan, se [Teknisk hvidbog](https://forwardemail.net/technical-whitepaper.pdf).

Videresend e-mail er en [gratis og open source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [videresendelse af e-mails](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") tjeneste, der fokuserer på en brugers [retten til privatliv](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Det, der startede som en simpel løsning til videresendelse af e-mail i 2017, har udviklet sig til en omfattende e-mailplatform, der tilbyder ubegrænsede brugerdefinerede domænenavne, ubegrænsede e-mailadresser og aliasser, ubegrænsede engangs-e-mailadresser, spam- og phishing-beskyttelse, krypteret postkasselagring og adskillige avancerede funktioner.

Tjenesten vedligeholdes og ejes af det oprindelige grundlæggerteam af designere og udviklere. Den er bygget med 100% open source-software ved hjælp af [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") og [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Grundlægger og mission {#founder-and-mission}

Forward Email blev grundlagt af **Nicholas Baugh** i 2017. Ifølge [Teknisk hvidbog om videresendelse af e-mail](https://forwardemail.net/technical-whitepaper.pdf) søgte Baugh oprindeligt efter en omkostningseffektiv og simpel løsning til at aktivere e-mail på domænenavne til sine sideprojekter. Efter at have undersøgt tilgængelige muligheder begyndte han at kode sin egen løsning og købte domænet `forwardemail.net` den 2. oktober 2017.

Forward Emails mission rækker ud over at levere e-mailtjenester – den sigter mod at transformere den måde, branchen håndterer e-mail-privatliv og -sikkerhed. Virksomhedens kerneværdier omfatter gennemsigtighed, brugerkontrol og beskyttelse af privatlivets fred gennem teknisk implementering snarere end blot politiske løfter.

## Tidslinje {#timeline}

### 2017 - Grundlæggelse og lancering {#2017---founding-and-launch}

**2. oktober 2017**: Nicholas Baugh købte domænet `forwardemail.net` efter at have undersøgt omkostningseffektive e-mailløsninger til sine sideprojekter.

**5. november 2017**: Baugh oprettede en JavaScript-fil på 634 linjer ved hjælp af [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") til at videresende e-mails for ethvert brugerdefineret domænenavn. Denne første implementering blev udgivet som open source til [GitHub](https://github.com/forwardemail), og tjenesten blev lanceret ved hjælp af GitHub Pages.

**November 2017**: Videresendelse af e-mail blev officielt lanceret efter en første udgivelse. Den tidlige version var udelukkende DNS-baseret uden kontoregistrering eller tilmeldingsproces – blot en README-fil skrevet i Markdown med instruktioner. Brugere kunne konfigurere videresendelse af e-mail ved at konfigurere MX-poster til at pege på `mx1.forwardemail.net` og `mx2.forwardemail.net` og tilføje en TXT-post med `forward-email=user@gmail.com`.

Enkelheden og effektiviteten af denne løsning tiltrak opmærksomhed fra fremtrædende udviklere, herunder [David Heinemeier Hansson](https://dhh.dk) (skaberen af Ruby on Rails), der fortsat bruger videresendt e-mail på sit domæne `dhh.dk` den dag i dag.

### 2018 - Infrastruktur og integration {#2018---infrastructure-and-integration}

**April 2018**: Da [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lancerede deres [Privatlivsfokuseret forbruger-DNS-tjeneste](https://blog.cloudflare.com/announcing-1111/), skiftede Videresend Email fra at bruge [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") til [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") til håndtering af [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-opslag, hvilket demonstrerer virksomhedens engagement i privatlivsfokuserede infrastrukturvalg.

**Oktober 2018**: Videresend e-mail tillod brugere at "Send e-mail som" med [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") og [Udsigter](https://en.wikipedia.org/wiki/Outlook "Outlook"), hvilket udvidede integrationsmulighederne med populære e-mailudbydere.

### 2019 - Ydelsesrevolution {#2019---performance-revolution}

**Maj 2019**: V2 af Videresend Email blev udgivet, hvilket repræsenterede en større omskrivning af de oprindelige versioner. Denne opdatering fokuserede på forbedringer af [præstation](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") gennem brugen af [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [vandløb](https://en.wikipedia.org/wiki/Streams "Streams"), hvilket etablerede fundamentet for platformens skalerbarhed.

### 2020 - Fokus på privatliv og sikkerhed {#2020---privacy-and-security-focus}

**Februar 2020**: Forward Email har udgivet planen Enhanced Privacy Protection, der giver brugerne mulighed for at deaktivere indstilling af offentlige DNS-poster med deres konfigurationsaliasser for videresendelse af e-mails. Med denne plan skjules en brugers e-mailaliasoplysninger fra offentlig søgning på internettet. Virksomheden har også udgivet en funktion til at aktivere eller deaktivere specifikke aliasser, samtidig med at de stadig kan vises som gyldige e-mailadresser og returnere vellykket [SMTP-statuskoder](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), hvor e-mails straks kasseres (svarende til at sende output til [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Efter at have stødt på utallige forhindringer med eksisterende spamdetektionsløsninger, der ikke overholdt Forward Emails privatlivspolitik, udgav virksomheden deres første alfaversion af Spam Scanner. Denne helt gratis og open source [anti-spam-filtrering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")-løsning bruger en [Naive Bayes spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-tilgang kombineret med [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing")- og [IDN-homografangreb](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-beskyttelse. Forward Email udgav også [tofaktorgodkendelse](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) ved hjælp af [engangsadgangskoder](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for forbedret kontosikkerhed.

**Maj 2020**: Videresend e-mail tillod brugerdefineret [portvideresendelse](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") som en løsning for brugere til at omgå portblokering med deres [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Virksomheden udgav også deres [Gratis RESTful API til videresendelse af e-mails](email-api) med komplet dokumentation og eksempler på anmodninger og svar i realtid, sammen med understøttelse af webhooks.

**August 2020**: Videresendt e-mail har tilføjet understøttelse af e-mail-godkendelsessystemet [Autentificeret modtaget kæde](arc) ("ARC"), hvilket yderligere styrker e-mailsikkerheden og -leveringsmulighederne.

**23. november 2020**: Videresend e-mail blev offentligt lanceret efter deres betaprogram, hvilket markerer en vigtig milepæl i platformens udvikling.

### 2021 - Platformmodernisering {#2021---platform-modernization}

**Februar 2021**: Forward Email refaktorerede deres kodebase for at fjerne alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programmeringssprog)") afhængigheder, hvilket gjorde det muligt for deres stak at blive 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") og [Node.js](https://en.wikipedia.org/wiki/Node.js). Denne arkitekturbeslutning var i overensstemmelse med virksomhedens forpligtelse til at opretholde en ensartet, open source-teknologistak.

**27. september 2021**: Videresend e-mail [ekstra støtte](email-forwarding-regex-pattern-filter) for e-mail-videresendelsesaliasser, der matcher [regulære udtryk](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), hvilket giver brugerne mere sofistikerede e-mail-routingfunktioner.

### 2023 - Udvidelse af infrastruktur og funktioner {#2023---infrastructure-and-feature-expansion}

**Januar 2023**: Forward Email lancerede et redesignet og hastighedsoptimeret websted, der forbedrer brugeroplevelsen og ydeevnen.

**Februar 2023**: Virksomheden tilføjede understøttelse af [fejllogge](/faq#do-you-store-error-logs) og implementerede et [mørk tilstand](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)-farveskema til hjemmesiden, der imødekom brugerpræferencer og tilgængelighedsbehov.

**Marts 2023**: Videresendt e-mail udgav [Mandarin](https://github.com/forwardemail/tangerine#readme) og integrerede det i hele deres infrastruktur, hvilket muliggjorde brugen af [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationslaget. Virksomheden tilføjede også understøttelse af [MTA-STS](/faq#do-you-support-mta-sts) og skiftede fra [hCaptcha](/) til [Cloudflare tællekors](https://developers.cloudflare.com/turnstile).

**April 2023**: Implementering og automatisering af en helt ny infrastruktur til videresendelse af e-mail. Hele tjenesten begyndte at køre på globalt load-balanced og proximity-baseret DNS med sundhedstjek og failover ved hjælp af [Cloudflare](https://cloudflare.com), hvilket erstattede den tidligere round-robin DNS-tilgang. Virksomheden skiftede til **bare metal-servere** på tværs af flere udbydere, herunder [Vultr](https://www.vultr.com/?ref=429848) og [Det digitale hav](https://m.do.co/c/a7cecd27e071), begge SOC 2 Type 1-kompatible udbydere. MongoDB- og Redis-databaser blev flyttet til klyngekonfigurationer med primære og standby-noder for høj tilgængelighed, end-to-end SSL-kryptering, kryptering i hvile og point-in-time recovery (PITR).

**Maj 2023**: Videresend e-mail lancerede deres **udgående SMTP**-funktion til [afsendelse af e-mail med SMTP](/faq#do-you-support-sending-email-with-smtp)- og [afsendelse af e-mail med API](/faq#do-you-support-sending-email-with-api)-anmodninger. Denne funktion inkluderer indbyggede sikkerhedsforanstaltninger, der sikrer høj leveringsevne, et moderne og robust kø- og gentagelsessystem og [understøtter fejllogfiler i realtid](/faq#do-you-store-error-logs).

**November 2023**: Videresend e-mail lancerede deres [**krypteret postkasseopbevaring**](/blog/docs/best-quantum-safe-encrypted-email-service)-funktion til [IMAP-understøttelse](/faq#do-you-support-receiving-email-with-imap), hvilket repræsenterer en betydelig forbedring inden for e-mail-fortrolighed og -sikkerhed.

**December 2023**: Virksomheden [ekstra støtte](/faq#do-you-support-pop3) til [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [adgangsnøgler og WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [tid til indbakke](/faq#i) overvågning og [OpenPGP til IMAP-lagring](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Serviceoptimering og avancerede funktioner {#2024---service-optimization-and-advanced-features}

**Februar 2024**: Videresend e-mail [tilføjet kalenderunderstøttelse (CalDAV)](/faq#do-you-support-calendars-caldav), hvilket udvider platformens muligheder ud over e-mail til også at omfatte kalendersynkronisering.

**Marts til juli 2024**: Forward Email udgav større optimeringer og forbedringer af deres IMAP-, POP3- og CalDAV-tjenester med det mål at gøre deres tjeneste lige så hurtig som, hvis ikke hurtigere end, alternativer.

**Juli 2024**: Virksomheden [tilføjet iOS Push-understøttelse](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) skal adressere Apple Mails manglende understøttelse af IMAP `IDLE`-kommandoer i iOS, hvilket muliggør notifikationer i realtid for Apple iOS-enheder. Videresend e-mail tilføjede også overvågning af tid til indbakke ("TTI") for deres egen tjeneste og Yahoo/AOL og begyndte at give brugerne mulighed for at kryptere hele deres DNS TXT-post, selv på gratisabonnementet. Som anmodet i [Diskussioner om privatlivsvejledninger](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og [GitHub-problemer](https://github.com/forwardemail/forwardemail.net/issues/254) tilføjede virksomheden muligheden for, at aliasser enten stille og roligt kan afvise `250`, soft-afvise `421` eller hard-afvise `550`, når det er deaktiveret.

**August 2024**: Videresendt e-mail har tilføjet understøttelse af eksport af postkasser som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)- og [Mbox](https://en.wikipedia.org/wiki/Mbox)-formater (ud over det eksisterende [SQLite](https://en.wikipedia.org/wiki/SQLite)-eksportformat). [Understøttelse af webhook-signaturer blev tilføjet](https://forwardemail.net/faq#do-you-support-bounce-webhooks), og virksomheden begyndte at give brugerne mulighed for at sende nyhedsbreve, meddelelser og e-mailmarkedsføring via deres udgående SMTP-tjeneste. Domæneomfattende og aliasspecifikke lagerkvoter for IMAP/POP3/CalDAV blev også implementeret.

### 2025 - Privatlivsforbedringer og protokolunderstøttelse {#2025---privacy-enhancements-and-protocol-support}

**September 2024 til januar 2025**: Videresend e-mail [tilføjede en meget efterspurgt feriesvarfunktion og OpenPGP/WKD-kryptering til videresendelse af e-mails](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), baseret på deres allerede implementerede krypterede postkasselagringsfunktioner.

**21. januar 2025**: Grundlæggerens bedste ven "Jack", hans loyale hundekammerat, gik fredeligt bort i en alder af næsten 11 år. Jack [vil altid blive husket](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) for hans urokkelige kammeratskab, der støttede oprettelsen af Forward Email. [Teknisk hvidbog om videresendelse af e-mail](https://forwardemail.net/technical-whitepaper.pdf) er dedikeret til Jack og anerkender hans rolle i tjenestens udvikling.

**Februar 2025**: Videresendt e-mail skiftede til [Datapakke](https://www.datapacket.com) som deres nye primære datacenterudbyder og implementerede brugerdefineret, ydeevnefokuseret bare-metal-hardware for yderligere at forbedre tjenestens pålidelighed og hastighed.

**Juni 2025**: Videresend e-mail lancerede understøttelse af [CardDAV-protokol](/faq#do-you-support-contacts-carddav), hvilket udvider platformens muligheder til at omfatte kontaktsynkronisering sammen med eksisterende e-mail- og kalendertjenester.

### 2026 - RFC-overholdelse og avanceret filtrering {#2026---rfc-compliance-and-advanced-filtering}

**Januar 2026**: Forward Email udgav et omfattende [RFC-protokol overensstemmelsesdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) med detaljer om komplet standardunderstøttelse på tværs af SMTP, IMAP, POP3 og CalDAV. Platformen tilføjede også [REQUIRETLS-understøttelse (RFC 8689)](/faq#requiretls-support) for tvungen TLS-kryptering på e-mail-transport, [S/MIME-kryptering (RFC 8551)](/faq#do-you-support-smime-encryption) til sikker beskedsignering og kryptering, og omfattende [Sieve e-mail-filtrering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) med [ManageSieve-protokol (RFC 5804)](/faq#do-you-support-sieve-email-filtering)-understøttelse til server-side e-mail-filtrering. [REST API](/email-api)'et blev udvidet til 39 endpoints der dækker beskeder, mapper, kontakter, kalendere og kalenderbegivenheder.

## Kerneprincipper {#core-principles}

Siden starten har Forward Email opretholdt en urokkelig forpligtelse til privatlivs- og sikkerhedsprincipper:

**100% open source-filosofi**: I modsætning til konkurrenter, der kun open source deres frontends og holder backends lukkede, har Forward Email gjort hele sin kodebase – både frontend og backend – tilgængelig for offentlig gennemsyn på [GitHub](https://github.com/forwardemail).

**Design med fokus på privatliv**: Fra dag ét implementerede Forward Email en unik in-memory-behandlingsmetode, der undgår at skrive e-mails til disk, hvilket adskiller den fra konventionelle e-mailtjenester, der gemmer beskeder i databaser eller filsystemer.

**Kontinuerlig innovation**: Tjenesten har udviklet sig fra en simpel løsning til videresendelse af e-mails til en omfattende e-mailplatform med funktioner som krypterede postkasser, kvanteresistent kryptering og understøttelse af standardprotokoller, herunder SMTP, IMAP, POP3 og CalDAV.

**Gennemsigtighed**: Al kode gøres open source og tilgængelig for inspektion, hvilket sikrer, at brugerne kan verificere privatlivskrav i stedet for blot at stole på markedsføringsudsagn.

**Brugerkontrol**: Giver brugerne muligheder, herunder muligheden for selv at hoste hele platformen, hvis det ønskes.

## Aktuel status {#current-status}

Fra 2025 betjener Forward Email over 500.000 domæner verden over, herunder bemærkelsesværdige organisationer og brancheledere såsom:

* **Teknologivirksomheder**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medieorganisationer**: Fox News Radio, Disney Ad Sales
* **Uddannelsesinstitutioner**: The University of Cambridge, The University of Maryland, The University of Washington, Tufts University, Swarthmore College
* **Offentlige enheder**: South Australias regering, Den Dominikanske Republiks regering
* **Andre organisationer**: RCD Hotels, Fly<span>.</span>io
* **Bemærkelsesværdige udviklere**: Isaac Z. Schlueter (skaber af npm), David Heinemeier Hansson (skaber af Ruby on Rails)

Platformen udvikler sig fortsat med regelmæssige funktionsudgivelser og infrastrukturforbedringer og fastholder sin position som den eneste 100 % open source, krypterede, privatlivsfokuserede, transparente og kvantebestandige e-mailtjeneste, der er tilgængelig i dag.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />