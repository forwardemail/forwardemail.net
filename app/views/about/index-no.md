# Om videresending av e-post {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Om videresending av e-post {#about-forward-email-1}

## Innholdsfortegnelse {#table-of-contents}

* [Oversikt](#overview)
* [Grunnlegger og oppdrag](#founder-and-mission)
* [Tidslinje](#timeline)
  * [2017 - Grunnleggelse og lansering](#2017---founding-and-launch)
  * [2018 - Infrastruktur og integrasjon](#2018---infrastructure-and-integration)
  * [2019 – Ytelsesrevolusjonen](#2019---performance-revolution)
  * [2020 - Fokus på personvern og sikkerhet](#2020---privacy-and-security-focus)
  * [2021 - Plattformmodernisering](#2021---platform-modernization)
  * [2023 – Utvidelse av infrastruktur og funksjoner](#2023---infrastructure-and-feature-expansion)
  * [2024 – Tjenesteoptimalisering og avanserte funksjoner](#2024---service-optimization-and-advanced-features)
  * [2025 - Personvernforbedringer og protokollstøtte](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-samsvar og avansert filtrering](#2026---rfc-compliance-and-advanced-filtering)
* [Kjerneprinsipper](#core-principles)
* [Nåværende status](#current-status)

## Oversikt {#overview}

> \[!TIP]
> For tekniske detaljer om arkitekturen vår, sikkerhetsimplementeringer og veikart, se [Teknisk hvitbok](https://forwardemail.net/technical-whitepaper.pdf).

Videresend e-post er en [gratis og åpen kildekode](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [videresending av e-post](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding")-tjeneste som fokuserer på en brukers [retten til privatliv](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Det som startet som en enkel løsning for videresending av e-post i 2017 har utviklet seg til en omfattende e-postplattform som tilbyr ubegrensede tilpassede domenenavn, ubegrensede e-postadresser og aliaser, ubegrensede engangs-e-postadresser, beskyttelse mot spam og phishing, kryptert postkasselagring og en rekke avanserte funksjoner.

Tjenesten vedlikeholdes og eies av det opprinnelige grunnleggerteamet av designere og utviklere. Den er bygget med 100 % åpen kildekode-programvare ved hjelp av [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") og [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Grunnlegger og misjon {#founder-and-mission}

Forward Email ble grunnlagt av **Nicholas Baugh** i 2017. Ifølge [Teknisk hvitbok for videresending av e-post](https://forwardemail.net/technical-whitepaper.pdf) lette Baugh i utgangspunktet etter en kostnadseffektiv og enkel løsning for å aktivere e-post på domenenavn for sideprosjektene sine. Etter å ha undersøkt tilgjengelige alternativer begynte han å kode sin egen løsning og kjøpte domenet `forwardemail.net` 2. oktober 2017.

Forward Emails oppdrag strekker seg utover å tilby e-posttjenester – det har som mål å forandre hvordan bransjen håndterer personvern og sikkerhet for e-post. Selskapets kjerneverdier inkluderer åpenhet, brukerkontroll og personvernbeskyttelse gjennom teknisk implementering snarere enn bare løfter om retningslinjer.

## Tidslinje {#timeline}

### 2017 – Grunnleggelse og lansering {#2017---founding-and-launch}

**2. oktober 2017**: Nicholas Baugh kjøpte domenet `forwardemail.net` etter å ha undersøkt kostnadseffektive e-postløsninger for sideprosjektene sine.

**5. november 2017**: Baugh opprettet en JavaScript-fil på 634 linjer ved hjelp av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") for å videresende e-poster for alle tilpassede domenenavn. Denne første implementeringen ble publisert som åpen kildekode til [GitHub](https://github.com/forwardemail), og tjenesten ble lansert ved hjelp av GitHub Pages.

**November 2017**: Videresend e-post ble offisielt lansert etter en første utgivelse. Den tidlige versjonen var utelukkende DNS-basert uten kontoregistrering eller registreringsprosess – bare en README-fil skrevet i Markdown med instruksjoner. Brukere kunne sette opp videresending av e-post ved å konfigurere MX-poster til å peke til `mx1.forwardemail.net` og `mx2.forwardemail.net`, og legge til en TXT-post med `forward-email=user@gmail.com`.

Enkelheten og effektiviteten til denne løsningen tiltrakk seg oppmerksomhet fra fremtredende utviklere, inkludert [David Heinemeier Hansson](https://dhh.dk) (skaperen av Ruby on Rails), som fortsatt bruker videresendt e-post på domenet sitt `dhh.dk` den dag i dag.

### 2018 – Infrastruktur og integrasjon {#2018---infrastructure-and-integration}

**April 2018**: Da [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lanserte sin [personvern-først forbruker-DNS-tjeneste](https://blog.cloudflare.com/announcing-1111/), byttet Videresend e-post fra å bruke [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") til [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") for håndtering av [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-oppslag, noe som demonstrerer selskapets forpliktelse til personvernfokuserte infrastrukturvalg.

**Oktober 2018**: Videresend e-post tillot brukere å «Send e-post som» med [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") og [Utsikter](https://en.wikipedia.org/wiki/Outlook "Outlook"), noe som utvidet integrasjonsmulighetene med populære e-postleverandører.

### 2019 – Ytelsesrevolusjon {#2019---performance-revolution}

**Mai 2019**: V2 av Videresendt e-post ble utgitt, som representerte en større omskriving fra de første versjonene. Denne oppdateringen fokuserte på forbedringer av [ytelse](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") gjennom bruk av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")s [strømmer](https://en.wikipedia.org/wiki/Streams "Streams"), som la grunnlaget for plattformens skalerbarhet.

### 2020 – Fokus på personvern og sikkerhet {#2020---privacy-and-security-focus}

**Februar 2020**: Videresend e-post lanserte planen for forbedret personvern, som lar brukere slå av angivelse av offentlige DNS-postoppføringer med konfigurasjonsaliasene for e-postvideresending. Gjennom denne planen skjules en brukers e-postaliasinformasjon fra offentlig søkbarhet over Internett. Selskapet lanserte også en funksjon for å aktivere eller deaktivere spesifikke aliaser, samtidig som de fortsatt tillater at de vises som gyldige e-postadresser og returnerer vellykket [SMTP-statuskoder](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), hvor e-poster umiddelbart forkastes (ligner på å sende utdata til [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Etter å ha møtt utallige hindringer med eksisterende spamdeteksjonsløsninger som ikke overholdt personvernreglene for Forward Email, lanserte selskapet sin første alfaversjon av Spam Scanner. Denne helt gratis og åpen kildekode-løsningen [anti-spamfiltrering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") bruker en [Naive Bayes spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-tilnærming kombinert med [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing")- og [IDN-homografangrep](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-beskyttelse. Forward Email lanserte også [tofaktorautentisering](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) ved bruk av [engangspassord](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) for forbedret kontosikkerhet.

**Mai 2020**: Videresendt e-post tillot tilpasset [portvideresending](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") som en midlertidig løsning for brukere å omgå portblokkering med [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Selskapet ga også ut [Gratis RESTful API for videresending av e-post](email-api) med fullstendig dokumentasjon og eksempler på forespørsler og svar i sanntid, samt støtte for webhooks.

**August 2020**: Videresendt e-post har lagt til støtte for e-postautentiseringssystemet [Autentisert mottatt kjede](arc) ("ARC"), noe som ytterligere styrker e-postsikkerheten og -leveringsmuligheten.

**23. november 2020**: Videresendt e-post ble offentlig lansert etter betaprogrammet, noe som markerer en betydelig milepæl i plattformens utvikling.

### 2021 – Plattformmodernisering {#2021---platform-modernization}

**Februar 2021**: Forward Email refaktorerte kodebasen sin for å fjerne alle [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) «Python (programmeringsspråk)»-avhengigheter, slik at stacken deres ble 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") og [Node.js](https://en.wikipedia.org/wiki/Node.js). Denne arkitekturavgjørelsen var i tråd med selskapets forpliktelse til å opprettholde en konsistent teknologistabel med åpen kildekode.

**27. september 2021**: Videresend e-post [ekstra støtte](email-forwarding-regex-pattern-filter) for aliaser for videresending av e-post som samsvarer med [regulære uttrykk](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), noe som gir brukerne mer sofistikerte muligheter for e-postruting.

### 2023 – Utvidelse av infrastruktur og funksjoner {#2023---infrastructure-and-feature-expansion}

**Januar 2023**: Forward Email lanserte et redesignet og optimalisert nettsted for sidehastighet, noe som forbedret brukeropplevelsen og ytelsen.

**Februar 2023**: Selskapet la til støtte for [feillogger](/faq#do-you-store-error-logs) og implementerte et [mørk modus](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)-fargeskjema for nettstedet, som svarer på brukerpreferanser og tilgjengelighetsbehov.

**Mars 2023**: Videresendt e-post lanserte [Mandarin](https://github.com/forwardemail/tangerine#readme) og integrerte den i hele infrastrukturen, noe som muliggjør bruk av [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikasjonslaget. Selskapet la også til støtte for [MTA-STS](/faq#do-you-support-mta-sts) og byttet fra [hCaptcha](/) til [Cloudflare-svingkorset](https://developers.cloudflare.com/turnstile).

**April 2023**: Implementering og automatisering av helt ny infrastruktur for videresending av e-post. Hele tjenesten begynte å kjøre på globalt lastbalansert og nærhetsbasert DNS med helsesjekker og failover ved bruk av [Cloudflare](https://cloudflare.com), som erstattet den tidligere round-robin DNS-tilnærmingen. Selskapet byttet til **bare metal-servere** på tvers av flere leverandører, inkludert [Vultr](https://www.vultr.com/?ref=429848) og [Digitalt hav](https://m.do.co/c/a7cecd27e071), begge SOC 2 Type 1-kompatible leverandører. MongoDB- og Redis-databaser ble flyttet til klyngekonfigurasjoner med primære og standby-noder for høy tilgjengelighet, ende-til-ende SSL-kryptering, kryptering i ro og gjenoppretting på tidspunktet (PITR).

**Mai 2023**: Videresend e-post lanserte sin **utgående SMTP**-funksjon for [sende e-post med SMTP](/faq#do-you-support-sending-email-with-smtp)- og [sende e-post med API](/faq#do-you-support-sending-email-with-api)-forespørsler. Denne funksjonen inkluderer innebygde sikkerhetstiltak for å sikre høy leveringsevne, et moderne og robust kø- og nytt forsøkssystem, og [støtter feillogger i sanntid](/faq#do-you-store-error-logs).

**November 2023**: Videresend e-post lanserte [**kryptert postkasselagring**](/blog/docs/best-quantum-safe-encrypted-email-service)-funksjonen for [IMAP-støtte](/faq#do-you-support-receiving-email-with-imap), noe som representerer et betydelig fremskritt innen personvern og sikkerhet for e-post.

**Desember 2023**: Selskapet [ekstra støtte](/faq#do-you-support-pop3) for overvåking av [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passord og WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [tid til innboksen](/faq#i) og [OpenPGP for IMAP-lagring](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 – Tjenesteoptimalisering og avanserte funksjoner {#2024---service-optimization-and-advanced-features}

**Februar 2024**: Videresend e-post [lagt til støtte for kalender (CalDAV)](/faq#do-you-support-calendars-caldav), som utvider plattformens muligheter utover e-post til å inkludere kalendersynkronisering.

**Mars til juli 2024**: Videresendt e-post lanserte store optimaliseringer og forbedringer av IMAP-, POP3- og CalDAV-tjenestene sine, med mål om å gjøre tjenesten like rask som, om ikke raskere enn, alternativer.

**Juli 2024**: Selskapet [lagt til iOS Push-støtte](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) skal ta tak i Apple Mails manglende støtte for IMAP `IDLE`-kommandoer i iOS, noe som muliggjør varsler i sanntid for Apple iOS-enheter. Videresend e-post la også til overvåking av tid til innboksen ("TTI") for sin egen tjeneste og Yahoo/AOL, og begynte å la brukere kryptere hele DNS TXT-oppføringen selv på gratisabonnementet. Som forespurt i [Diskusjoner om personvernveiledninger](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) og [GitHub-problemer](https://github.com/forwardemail/forwardemail.net/issues/254), la selskapet til muligheten for at aliaser enten stille avviser `250`, mykt avviser `421` eller fullstendig avviser `550` når det er deaktivert.

**August 2024**: Videresendt e-post la til støtte for eksport av postbokser som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)- og [Mbox](https://en.wikipedia.org/wiki/Mbox)-formater (i tillegg til det eksisterende eksportformatet [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Støtte for webhook-signaturer ble lagt til](https://forwardemail.net/faq#do-you-support-bounce-webhooks), og selskapet begynte å tillate brukere å sende nyhetsbrev, kunngjøringer og e-postmarkedsføring gjennom sin utgående SMTP-tjeneste. Domeneomfattende og aliasspesifikke lagringskvoter for IMAP/POP3/CalDAV ble også implementert.

### 2025 – Fortsatt innovasjon {#2025---continued-innovation}

**September 2024 til januar 2025**: Videresend e-post [lagt til en svært etterspurt feriesvarfunksjon og OpenPGP/WKD-kryptering for videresending av e-post](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), basert på deres allerede implementerte lagringsmuligheter for krypterte postkasser.

**21. januar 2025**: Grunnleggerens beste venn «Jack», hans lojale hundekamerat, gikk fredelig bort i en alder av nesten 11 år. Jack [vil alltid bli husket](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) for hans urokkelige vennskap som støttet opprettelsen av Videresendt e-post. [Teknisk hvitbok for videresending av e-post](https://forwardemail.net/technical-whitepaper.pdf) er dedikert til Jack, som en anerkjennelse av hans rolle i tjenestens utvikling.

**Februar 2025**: Videresendt e-post byttet til [Datapakke](https://www.datapacket.com) som deres nye primære datasenterleverandør, og implementerte tilpasset, ytelsesfokusert, bare-metal-maskinvare for å forbedre tjenestens pålitelighet og hastighet ytterligere.

**Juni 2025**: Videresend e-post lanserte støtte for [CardDAV-protokoll](/faq#do-you-support-contacts-carddav), og utvidet plattformens muligheter til å inkludere kontaktsynkronisering i tillegg til eksisterende e-post- og kalendertjenester.

### 2026 - RFC-samsvar og avansert filtrering {#2026---rfc-compliance-and-advanced-filtering}

**Januar 2026**: Forward Email ga ut et omfattende [RFC-protokoll samsvarsdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) som beskriver fullstendig standardstøtte for SMTP, IMAP, POP3 og CalDAV. Plattformen la også til [REQUIRETLS-støtte (RFC 8689)](/faq#requiretls-support) for tvungen TLS-kryptering ved e-posttransport, [S/MIME-kryptering (RFC 8551)](/faq#do-you-support-smime-encryption) for sikker meldingssignering og kryptering, og omfattende [Sieve e-postfiltrering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) med [ManageSieve-protokoll (RFC 5804)](/faq#do-you-support-sieve-email-filtering)-støtte for serverside e-postfiltrering. [REST API](/email-api) ble utvidet til 39 endepunkter som dekker meldinger, mapper, kontakter, kalendere og kalenderhendelser.

## Kjerneprinsipper {#core-principles}

Siden oppstarten har Forward Email opprettholdt en standhaftig forpliktelse til personvern- og sikkerhetsprinsipper:

**100 % åpen kildekode-filosofi**: I motsetning til konkurrenter som kun bruker åpen kildekode for frontend-ene sine mens backend-ene holdes lukket, har Forward Email gjort hele kodebasen sin – både frontend og backend – tilgjengelig for offentlig gransking på [GitHub](https://github.com/forwardemail).

**Design med personvern først**: Fra dag én implementerte Forward Email en unik prosesseringsmetode i minnet som unngår å skrive e-poster til disk, noe som skiller den fra konvensjonelle e-posttjenester som lagrer meldinger i databaser eller filsystemer.

**Kontinuerlig innovasjon**: Tjenesten har utviklet seg fra en enkel løsning for videresending av e-post til en omfattende e-postplattform med funksjoner som krypterte postkasser, kvantebestandig kryptering og støtte for standardprotokoller, inkludert SMTP, IMAP, POP3 og CalDAV.

**Åpenhet**: All kode gjøres åpen kildekode og tilgjengelig for inspeksjon, slik at brukerne kan bekrefte personvernpåstander i stedet for bare å stole på markedsføringspåstander.

**Brukerkontroll**: Gir brukerne muligheten til å være vert for hele plattformen selv om ønskelig.

## Nåværende status {#current-status}

Fra og med 2025 betjener Forward Email over 500 000 domener over hele verden, inkludert kjente organisasjoner og bransjeledere som:

* **Teknologiselskaper**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medieorganisasjoner**: Fox News Radio, Disney Ad Sales
* **Utdanningsinstitusjoner**: The University of Cambridge, The University of Maryland, The University of Washington, Tufts University, Swarthmore College
* **Offentlige enheter**: Government of South Australia, Government of the Dominican Republic
* **Andre organisasjoner**: RCD Hotels, Fly<span>.</span>io
* **Kjente utviklere**: Isaac Z. Schlueter (skaper av npm), David Heinemeier Hansson (skaper av Ruby on Rails)

Plattformen fortsetter å utvikle seg med regelmessige funksjonsutgivelser og forbedringer av infrastrukturen, og opprettholder sin posisjon som den eneste 100 % åpen kildekode, krypterte, personvernfokuserte, transparente og kvantebestandige e-posttjenesten som er tilgjengelig i dag.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />