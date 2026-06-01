# Om Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Om Forward Email {#about-forward-email-1}


## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Grunnlegger og misjon](#founder-and-mission)
* [Tidslinje](#timeline)
  * [2017 - Grunnleggelse og lansering](#2017---founding-and-launch)
  * [2018 - Infrastruktur og integrasjon](#2018---infrastructure-and-integration)
  * [2019 - Ytelsesrevolusjon](#2019---performance-revolution)
  * [2020 - Fokus på personvern og sikkerhet](#2020---privacy-and-security-focus)
  * [2021 - Plattformmodernisering](#2021---platform-modernization)
  * [2023 - Infrastruktur og funksjonsutvidelse](#2023---infrastructure-and-feature-expansion)
  * [2024 - Tjenesteoptimalisering og avanserte funksjoner](#2024---service-optimization-and-advanced-features)
  * [2025 - Forbedringer av personvern og protokollstøtte {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-kompatibilitet og avansert filtrering {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Kjerneprinsipper](#core-principles)
* [Nåværende status](#current-status)


## Oversikt {#overview}

> \[!TIP]
> For tekniske detaljer om vår arkitektur, sikkerhetsimplementeringer og veikart, se [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email er en [gratis og åpen kildekode](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [e-postvideresending](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") tjeneste med fokus på brukerens [rett til personvern](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Det som begynte som en enkel løsning for e-postvideresending i 2017, har utviklet seg til en omfattende e-postplattform som tilbyr ubegrensede egendefinerte domenenavn, ubegrensede e-postadresser og aliaser, ubegrensede engangse-postadresser, beskyttelse mot spam og phishing, kryptert postkasselagring og mange avanserte funksjoner.

Tjenesten vedlikeholdes og eies av det opprinnelige grunnleggerteamet av designere og utviklere. Den er bygget med 100 % åpen kildekode-programvare ved bruk av [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") og [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Grunnlegger og misjon {#founder-and-mission}

Forward Email ble grunnlagt av **Nicholas Baugh** i 2017. Ifølge [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) lette Baugh opprinnelig etter en kostnadseffektiv og enkel løsning for å aktivere e-post på domenenavn for sine sideprosjekter. Etter å ha undersøkt tilgjengelige alternativer, begynte han å kode sin egen løsning og kjøpte domenet `forwardemail.net` 2. oktober 2017.

Forward Emails misjon strekker seg utover å tilby e-posttjenester—den har som mål å endre hvordan bransjen tilnærmer seg e-postpersonvern og sikkerhet. Selskapets kjerneverdier inkluderer åpenhet, brukerkontroll og personvernvern gjennom teknisk implementering snarere enn bare policy-løfter.


## Tidslinje {#timeline}

### 2017 - Grunnleggelse og lansering {#2017---founding-and-launch}

**2. oktober 2017**: Nicholas Baugh kjøpte domenet `forwardemail.net` etter å ha undersøkt kostnadseffektive e-postløsninger for sine sideprosjekter.

**5. november 2017**: Baugh laget en JavaScript-fil på 634 linjer ved bruk av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") for å videresende e-post for ethvert egendefinert domenenavn. Denne første implementeringen ble publisert som åpen kildekode på [GitHub](https://github.com/forwardemail) og tjenesten ble lansert ved bruk av GitHub Pages.
**November 2017**: Forward Email ble offisielt lansert etter en innledende utgivelse. Den tidlige versjonen var rent DNS-basert uten konto-registrering eller påmeldingsprosess—bare en README-fil skrevet i Markdown med instruksjoner. Brukere kunne sette opp e-postvideresending ved å konfigurere MX-poster til å peke til `mx1.forwardemail.net` og `mx2.forwardemail.net`, og legge til en TXT-post med `forward-email=user@gmail.com`.

Enkelheten og effektiviteten i denne løsningen tiltrakk seg oppmerksomhet fra fremtredende utviklere, inkludert [David Heinemeier Hansson](https://dhh.dk) (skaperen av Ruby on Rails), som fortsatt bruker Forward Email på sitt domene `dhh.dk` den dag i dag.

### 2018 - Infrastruktur og Integrasjon {#2018---infrastructure-and-integration}

**April 2018**: Da [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lanserte sin [personvern-første forbruker DNS-tjeneste](https://blog.cloudflare.com/announcing-1111/), byttet Forward Email fra å bruke [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") til [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") for håndtering av [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") oppslag, noe som demonstrerte selskapets forpliktelse til personvernfokuserte infrastrukturløsninger.

**Oktober 2018**: Forward Email tillot brukere å "Sende e-post som" med [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") og [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), og utvidet integrasjonsmulighetene med populære e-postleverandører.

### 2019 - Ytelsesrevolusjon {#2019---performance-revolution}

**Mai 2019**: Forward Email lanserte v2, som representerte en stor omskriving fra de første versjonene. Denne oppdateringen fokuserte på [ytelses](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")forbedringer gjennom bruk av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") sine [streams](https://en.wikipedia.org/wiki/Streams "Streams"), og etablerte grunnlaget for plattformens skalerbarhet.

### 2020 - Fokus på personvern og sikkerhet {#2020---privacy-and-security-focus}

**Februar 2020**: Forward Email lanserte Enhanced Privacy Protection-planen, som tillot brukere å slå av opprettelsen av offentlige DNS-postoppføringer med sine e-postvideresendingskonfigurasjonsaliaser. Gjennom denne planen skjules en brukers e-postaliasinformasjon fra å være offentlig søkbar på Internett. Selskapet lanserte også en funksjon for å aktivere eller deaktivere spesifikke aliaser samtidig som de fortsatt kan vises som gyldige e-postadresser og returnere vellykkede [SMTP-statuskoder](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), med e-poster som umiddelbart kastes (likt å sende utdata til [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Etter å ha støtt på utallige hindringer med eksisterende spamdeteksjonsløsninger som ikke respekterte Forward Emails personvernpolicy, lanserte selskapet sin første alpha-versjon av Spam Scanner. Denne helt gratis og åpen kildekode [anti-spam filtrerings](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") løsningen bruker en [Naive Bayes spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") tilnærming kombinert med [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") og [IDN homografangrep](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") beskyttelse. Forward Email lanserte også [to-faktor autentisering](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) ved bruk av [engangspassord](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for forbedret kontosikkerhet.

**Mai 2020**: Forward Email tillot tilpasset [portvideresending](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") som en løsning for brukere til å omgå portblokkering fra sin [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Selskapet lanserte også sin [Gratis E-postvideresending RESTful API](email-api) med full dokumentasjon og sanntidseksempler på forespørsler og svar, sammen med støtte for webhooks.
**August 2020**: Forward Email la til støtte for [Authenticated Received Chain](arc) ("ARC") e-postautentiseringssystemet, noe som styrket e-postsikkerheten og leveringsmuligheten ytterligere.

**23. november 2020**: Forward Email ble offentlig lansert ut av beta-programmet, noe som markerte en viktig milepæl i plattformens utvikling.

### 2021 - Plattformmodernisering {#2021---platform-modernization}

**Februar 2021**: Forward Email refaktorerte kodebasen sin for å fjerne alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programmeringsspråk)")-avhengigheter, noe som gjorde at stakken deres ble 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") og [Node.js](https://en.wikipedia.org/wiki/Node.js). Denne arkitektoniske beslutningen samsvarte med selskapets forpliktelse til å opprettholde en konsistent, åpen kildekode-teknologistakk.

**27. september 2021**: Forward Email [la til støtte](email-forwarding-regex-pattern-filter) for e-postvideresending aliaser som matcher [regulære uttrykk](https://en.wikipedia.org/wiki/Regular_expression "Regulært uttrykk"), og ga brukerne mer sofistikerte muligheter for e-postruting.

### 2023 - Infrastruktur og funksjonsutvidelse {#2023---infrastructure-and-feature-expansion}

**Januar 2023**: Forward Email lanserte et redesignet og sidehastighetsoptimalisert nettsted, som forbedret brukeropplevelsen og ytelsen.

**Februar 2023**: Selskapet la til støtte for [feillogger](/faq#do-you-store-error-logs) og implementerte et [mørkt modus](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) fargeskjema på nettstedet, som svar på brukerpreferanser og tilgjengelighetsbehov.

**Mars 2023**: Forward Email lanserte [Tangerine](https://github.com/forwardemail/tangerine#readme) og integrerte det i hele infrastrukturen, noe som muliggjorde bruk av [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikasjonslaget. Selskapet la også til støtte for [MTA-STS](/faq#do-you-support-mta-sts) og byttet fra [hCaptcha](/) til [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementerte og automatiserte helt ny infrastruktur. Hele tjenesten kjørte nå på globalt lastbalanserte og nærhetsbaserte DNS med helsesjekker og failover ved bruk av [Cloudflare](https://cloudflare.com), og erstattet den tidligere round-robin DNS-tilnærmingen. Selskapet byttet til **bare metal-servere** hos flere leverandører, inkludert [Vultr](https://www.vultr.com/?ref=429848) og [Digital Ocean](https://m.do.co/c/a7cecd27e071), begge SOC 2 Type 1-kompatible leverandører. MongoDB- og Redis-databaser ble flyttet til klynger med primære og standby-noder for høy tilgjengelighet, ende-til-ende SSL-kryptering, kryptering i hvilemodus og punkt-i-tid-gjenoppretting (PITR).

**Mai 2023**: Forward Email lanserte sin **utgående SMTP**-funksjon for [å sende e-post med SMTP](/faq#do-you-support-sending-email-with-smtp) og [å sende e-post med API](/faq#do-you-support-sending-email-with-api) forespørsler. Denne funksjonen inkluderer innebygde sikkerhetstiltak for å sikre høy leveringsgrad, et moderne og robust kø- og retry-system, og [støtter feillogger i sanntid](/faq#do-you-store-error-logs).

**November 2023**: Forward Email lanserte sin [**krypterte postkasselagring**](/blog/docs/best-quantum-safe-encrypted-email-service) funksjon for [IMAP-støtte](/faq#do-you-support-receiving-email-with-imap), som representerer et betydelig fremskritt innen e-postpersonvern og sikkerhet.

**Desember 2023**: Selskapet [la til støtte](/faq#do-you-support-pop3) for [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passordnøkler og WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [tid til innboks](/faq#i) overvåking, og [OpenPGP for IMAP-lagring](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Tjenesteoptimalisering og avanserte funksjoner {#2024---service-optimization-and-advanced-features}

**Februar 2024**: Forward Email [la til kalender (CalDAV) støtte](/faq#do-you-support-calendars-caldav), og utvidet plattformens muligheter utover e-post til å inkludere kalendersynkronisering.
**Mars til juli 2024**: Forward Email lanserte store optimaliseringer og forbedringer av sine IMAP-, POP3- og CalDAV-tjenester, med mål om å gjøre tjenesten like rask, om ikke raskere, enn alternativer.

**Juli 2024**: Selskapet [la til iOS Push-støtte](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) for å løse mangelen på IMAP `IDLE`-kommando-støtte i Apple Mail på iOS, noe som muliggjør sanntidsvarsler for Apple iOS-enheter. Forward Email la også til overvåking av tid til innboks ("TTI") for sin egen tjeneste og Yahoo/AOL, og begynte å tillate brukere å kryptere hele DNS TXT-posten sin selv på gratisplanen. Som forespurt i [Privacy Guides-diskusjoner](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og [GitHub-issues](https://github.com/forwardemail/forwardemail.net/issues/254), la selskapet til muligheten for aliaser til enten stille avvisning `250`, myk avvisning `421` eller hard avvisning `550` når deaktivert.

**August 2024**: Forward Email la til støtte for eksport av postbokser som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) og [Mbox](https://en.wikipedia.org/wiki/Mbox)-formater (i tillegg til det eksisterende [SQLite](https://en.wikipedia.org/wiki/SQLite)-eksportformatet). [Webhook-signaturstøtte ble lagt til](https://forwardemail.net/faq#do-you-support-bounce-webhooks), og selskapet begynte å tillate brukere å sende nyhetsbrev, kunngjøringer og e-postmarkedsføring gjennom sin utgående SMTP-tjeneste. Kvoter for lagring på domenenivå og alias-spesifikke kvoter for IMAP/POP3/CalDAV ble også implementert.

### 2025 - Personvernforbedringer og protokollstøtte {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**September 2024 til januar 2025**: Forward Email [la til en etterspurt ferieresponder-funksjon og OpenPGP/WKD-kryptering for e-postvideresending](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), som bygger videre på deres allerede implementerte krypterte postboks-lagringsmuligheter.

**21. januar 2025**: Grunnleggerens beste venn "Jack", hans lojale hundekamerat, gikk fredelig bort i nesten 11-årsalderen. Jack [vil alltid bli husket](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) for sitt urokkelige kameratskap som støttet opprettelsen av Forward Email. [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) er dedikert til Jack, og anerkjenner hans rolle i tjenestens utvikling.

**Februar 2025**: Forward Email byttet til [DataPacket](https://www.datapacket.com) som sin nye primære datasenterleverandør, og implementerte tilpasset, ytelsesfokusert, bare-metal maskinvare for å ytterligere forbedre tjenestens pålitelighet og hastighet.

**Mars 2025**: Versjon 1.0 av Forward Email ble offisielt lansert.

**April 2025**: Den første versjonen av [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) ble publisert, og selskapet begynte å akseptere kryptovalutabetalinger.

**Mai 2025**: Tjenesten lanserte ny API-dokumentasjon ved bruk av [Scalar](https://github.com/scalar/scalar).

**Juni 2025**: Forward Email lanserte støtte for [CardDAV-protokollen](/faq#do-you-support-contacts-carddav), og utvidet plattformens muligheter til å inkludere kontaktsynkronisering i tillegg til eksisterende e-post- og kalenderfunksjoner.

**August 2025**: Plattformen la til [CalDAV VTODO/oppgave-støtte](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), som muliggjør oppgavehåndtering sammen med kalenderhendelser.

**November 2025**: Plattformens sikkerhet ble forbedret med en migrering fra PBKDF2 til [Argon2id](https://en.wikipedia.org/wiki/Argon2) for passordhashing, og infrastrukturen ble migrert fra Redis til [Valkey](https://github.com/valkey-io/valkey).

**Desember 2025**: Versjon 2.0 ble lansert, med introduksjon av [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) støtte for påtvunget TLS-kryptering på e-posttransport og oppgradering til [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - RFC-kompatibilitet og avansert filtrering {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Januar 2026**: Forward Email ga ut et omfattende [RFC-protokollkompatibilitetsdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) og la til støtte for [S/MIME-kryptering (RFC 8551)](/faq#do-you-support-smime-encryption) og omfattende [Sieve e-postfiltrering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) med støtte for [ManageSieve-protokollen (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API-et ble også utvidet til 39 endepunkter.

**Februar 2026**: Den offisielle, åpen kildekode webmail-klienten ble lansert på [mail.forwardemail.net](https://mail.forwardemail.net) ([kildekode på GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Plattformen la også til støtte for [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities), og [Domain Connect](https://domainconnect.org) for 1-klikk DNS-oppsett. Sanntids push-varsler for IMAP, CalDAV og CardDAV ble lansert ved bruk av WebSockets.

**Mars 2026**: Støtte for per-domene tilpasset S3-kompatibel lagring ble lagt til, sammen med et kommandolinjeverktøy for administrasjon. Arbeidet startet på tverrplattform skrivebords- og mobilapplikasjoner for macOS, Windows, Linux, iOS og Android ved bruk av samme åpen kildekode webmail-kodebase, bygget med [Tauri](https://tauri.app).


## Kjerneprinsipper {#core-principles}

Siden oppstarten har Forward Email opprettholdt et sterkt engasjement for personvern- og sikkerhetsprinsipper:

**100 % Åpen kildekode-filosofi**: I motsetning til konkurrenter som kun åpner kildekoden til frontend mens backend holdes lukket, har Forward Email gjort hele kodebasen – både frontend og backend – tilgjengelig for offentlig innsyn på [GitHub](https://github.com/forwardemail).

**Personvern-først design**: Fra dag én implementerte Forward Email en unik prosessering i minnet som unngår å skrive e-poster til disk, noe som skiller det fra konvensjonelle e-posttjenester som lagrer meldinger i databaser eller filsystemer.

**Kontinuerlig innovasjon**: Tjenesten har utviklet seg fra en enkel e-postvideresending til en omfattende e-postplattform med funksjoner som krypterte postbokser, kvantesikker kryptering, og støtte for standardprotokoller inkludert SMTP, IMAP, POP3 og CalDAV.

**Åpenhet**: All kode gjøres åpen kildekode og tilgjengelig for inspeksjon, slik at brukere kan verifisere personvernpåstander i stedet for bare å stole på markedsføringsutsagn.

**Brukerkontroll**: Gir brukerne valgmuligheter, inkludert muligheten til å selvhoste hele plattformen om ønskelig.


## Nåværende status {#current-status}

Per mars 2026 betjener Forward Email over 500 000 domener verden over, inkludert bemerkelsesverdige organisasjoner og bransjeledere som:

* **Teknologiselskaper**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medieorganisasjoner**: Fox News Radio, Disney Ad Sales
* **Utdanningsinstitusjoner**: University of Cambridge, University of Maryland, University of Washington, Tufts University, Swarthmore College
* **Offentlige etater**: Regjeringen i Sør-Australia, Regjeringen i Den dominikanske republikk
* **Andre organisasjoner**: RCD Hotels, Fly<span>.</span>io
* **Merkbare utviklere**: Isaac Z. Schlueter (npm-skaper), David Heinemeier Hansson (Ruby on Rails-skaper)

Plattformen fortsetter å utvikle seg med regelmessige funksjonsutgivelser og infrastrukturforbedringer, og opprettholder sin posisjon som den eneste 100 % åpen kildekode, krypterte, personvernfokuserte, transparente og kvantesikre e-posttjenesten som er tilgjengelig i dag.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
