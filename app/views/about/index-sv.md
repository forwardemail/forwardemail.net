# Om Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Om Forward Email {#about-forward-email-1}


## Innehållsförteckning {#table-of-contents}

* [Översikt](#overview)
* [Grundare och uppdrag](#founder-and-mission)
* [Tidslinje](#timeline)
  * [2017 - Grundande och lansering](#2017---founding-and-launch)
  * [2018 - Infrastruktur och integration](#2018---infrastructure-and-integration)
  * [2019 - Prestandarevolution](#2019---performance-revolution)
  * [2020 - Fokus på integritet och säkerhet](#2020---privacy-and-security-focus)
  * [2021 - Plattformmodernisering](#2021---platform-modernization)
  * [2023 - Infrastruktur och funktionsutvidgning](#2023---infrastructure-and-feature-expansion)
  * [2024 - Tjänsteoptimering och avancerade funktioner](#2024---service-optimization-and-advanced-features)
  * [2025 - Integritetsförbättringar och protokollstöd {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-efterlevnad och avancerad filtrering {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Kärnprinciper](#core-principles)
* [Aktuell status](#current-status)


## Översikt {#overview}

> \[!TIP]
> För tekniska detaljer om vår arkitektur, säkerhetsimplementeringar och färdplan, se [Tekniskt Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email är en [gratis och öppen källkod](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [e-post vidarebefordran](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") tjänst med fokus på användarens [rätt till integritet](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Det som började som en enkel lösning för vidarebefordran av e-post 2017 har utvecklats till en omfattande e-postplattform som erbjuder obegränsade anpassade domännamn, obegränsade e-postadresser och alias, obegränsade engångsadresser, skydd mot skräppost och nätfiske, krypterad brevlådelagring och många avancerade funktioner.

Tjänsten underhålls och ägs av dess ursprungliga grundarteam av designers och utvecklare. Den är byggd med 100 % öppen källkod med hjälp av [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") och [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Grundare och uppdrag {#founder-and-mission}

Forward Email grundades av **Nicholas Baugh** 2017. Enligt [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) sökte Baugh initialt efter en kostnadseffektiv och enkel lösning för att möjliggöra e-post på domännamn för sina sidoprojekt. Efter att ha undersökt tillgängliga alternativ började han koda sin egen lösning och köpte domänen `forwardemail.net` den 2 oktober 2017.

Forward Emails uppdrag sträcker sig bortom att tillhandahålla e-posttjänster—det syftar till att förändra hur branschen närmar sig e-postintegritet och säkerhet. Företagets kärnvärden inkluderar transparens, användarkontroll och integritetsskydd genom teknisk implementering snarare än bara policylöften.


## Tidslinje {#timeline}

### 2017 - Grundande och lansering {#2017---founding-and-launch}

**2 oktober 2017**: Nicholas Baugh köpte domänen `forwardemail.net` efter att ha undersökt kostnadseffektiva e-postlösningar för sina sidoprojekt.

**5 november 2017**: Baugh skapade en 634-radig JavaScript-fil med hjälp av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") för att vidarebefordra e-post för valfritt anpassat domännamn. Denna initiala implementation publicerades som öppen källkod på [GitHub](https://github.com/forwardemail) och tjänsten lanserades med GitHub Pages.
**November 2017**: Forward Email lanserades officiellt efter en initial release. Den tidiga versionen var helt DNS-baserad utan något konto- eller registreringsförfarande—bara en README-fil skriven i Markdown med instruktioner. Användare kunde ställa in e-post vidarebefordran genom att konfigurera MX-poster för att peka på `mx1.forwardemail.net` och `mx2.forwardemail.net`, samt lägga till en TXT-post med `forward-email=user@gmail.com`.

Enkelheten och effektiviteten i denna lösning drog till sig uppmärksamhet från framstående utvecklare, inklusive [David Heinemeier Hansson](https://dhh.dk) (skaparen av Ruby on Rails), som fortfarande använder Forward Email på sin domän `dhh.dk` än idag.

### 2018 - Infrastruktur och Integration {#2018---infrastructure-and-integration}

**April 2018**: När [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lanserade sin [integritetsfokuserade konsument-DNS-tjänst](https://blog.cloudflare.com/announcing-1111/), bytte Forward Email från att använda [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") till [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") för hantering av [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-uppslagningar, vilket visade företagets engagemang för integritetsfokuserade infrastrukturalternativ.

**Oktober 2018**: Forward Email tillät användare att "Skicka mail som" med [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") och [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), vilket utökade integrationsmöjligheterna med populära e-postleverantörer.

### 2019 - Prestandarevolution {#2019---performance-revolution}

**Maj 2019**: Forward Email släppte v2, som representerade en stor omskrivning från de initiala versionerna. Denna uppdatering fokuserade på [prestanda](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")-förbättringar genom användning av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")'s [streams](https://en.wikipedia.org/wiki/Streams "Streams"), vilket lade grunden för plattformens skalbarhet.

### 2020 - Fokus på Integritet och Säkerhet {#2020---privacy-and-security-focus}

**Februari 2020**: Forward Email lanserade planen Enhanced Privacy Protection, som tillåter användare att stänga av inställningen för offentliga DNS-postinlägg med sina e-postvidarebefordringsalias. Genom denna plan döljs en användares e-postaliasinformation från att vara offentligt sökbar över Internet. Företaget släppte också en funktion för att aktivera eller inaktivera specifika alias samtidigt som de fortfarande kan visas som giltiga e-postadresser och returnera framgångsrika [SMTP-statuskoder](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), där e-postmeddelanden omedelbart kasseras (liknande att dirigera utdata till [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Efter att ha stött på otaliga hinder med befintliga spamdetekteringslösningar som inte respekterade Forward Emails integritetspolicy, släppte företaget sin initiala alfa-version av Spam Scanner. Denna helt fria och open-source [anti-spam filtrerings](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")-lösning använder en [Naive Bayes spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-metod kombinerad med [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") och skydd mot [IDN homografattacker](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email lanserade också [tvåfaktorsautentisering](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) med hjälp av [engångslösenord](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) för förbättrad kontosäkerhet.

**Maj 2020**: Forward Email tillät anpassad [portvidarebefordran](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") som en lösning för användare att kringgå portblockering från deras [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Företaget släppte också sin [Free Email Forwarding RESTful API](email-api) med fullständig dokumentation och realtids-exempel på förfrågningar och svar, tillsammans med stöd för webhooks.
**Augusti 2020**: Forward Email lade till stöd för [Authenticated Received Chain](arc) ("ARC") e-postautentiseringssystem, vilket ytterligare stärkte e-postsäkerheten och leveransbarheten.

**23 november 2020**: Forward Email lanserades offentligt utanför deras betaprogram, vilket markerade en betydande milstolpe i plattformens utveckling.

### 2021 - Plattformmodernisering {#2021---platform-modernization}

**Februari 2021**: Forward Email omstrukturerade sin kodbas för att ta bort alla [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)")-beroenden, vilket gjorde att deras stack blev 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") och [Node.js](https://en.wikipedia.org/wiki/Node.js). Detta arkitektoniska beslut stämde överens med företagets åtagande att upprätthålla en konsekvent, öppen källkodsteknologisk stack.

**27 september 2021**: Forward Email [lade till stöd](email-forwarding-regex-pattern-filter) för e-postvidarebefordringsalias som matchar [reguljära uttryck](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), vilket gav användarna mer avancerade möjligheter för e-postdirigering.

### 2023 - Infrastruktur och funktionsutvidgning {#2023---infrastructure-and-feature-expansion}

**Januari 2023**: Forward Email lanserade en omdesignad och sidladdningsoptimerad webbplats, vilket förbättrade användarupplevelsen och prestandan.

**Februari 2023**: Företaget lade till stöd för [fel-loggar](/faq#do-you-store-error-logs) och implementerade ett [mörkt läge](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) för webbplatsens färgschema, som svar på användarpreferenser och tillgänglighetsbehov.

**Mars 2023**: Forward Email släppte [Tangerine](https://github.com/forwardemail/tangerine#readme) och integrerade det i hela sin infrastruktur, vilket möjliggjorde användning av [DNS över HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationsnivå. Företaget lade också till stöd för [MTA-STS](/faq#do-you-support-mta-sts) och bytte från [hCaptcha](/) till [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**April 2023**: Forward Email implementerade och automatiserade helt ny infrastruktur. Hela tjänsten började köras på globalt lastbalanserad och närhetsbaserad DNS med hälsokontroller och failover via [Cloudflare](https://cloudflare.com), vilket ersatte den tidigare round-robin DNS-metoden. Företaget bytte till **bare metal-servrar** hos flera leverantörer, inklusive [Vultr](https://www.vultr.com/?ref=429848) och [Digital Ocean](https://m.do.co/c/a7cecd27e071), båda SOC 2 Typ 1-kompatibla leverantörer. MongoDB- och Redis-databaser flyttades till klustrade konfigurationer med primära och standby-noder för hög tillgänglighet, end-to-end SSL-kryptering, kryptering i vila och punkt-i-tid-återställning (PITR).

**Maj 2023**: Forward Email lanserade sin **utgående SMTP**-funktion för [att skicka e-post med SMTP](/faq#do-you-support-sending-email-with-smtp) och [att skicka e-post med API](/faq#do-you-support-sending-email-with-api)-förfrågningar. Denna funktion inkluderar inbyggda skydd för att säkerställa hög leveransbarhet, ett modernt och robust kö- och återförsökssystem, och [stöder fel-loggar i realtid](/faq#do-you-store-error-logs).

**November 2023**: Forward Email lanserade sin [**krypterade brevlådelagring**](/blog/docs/best-quantum-safe-encrypted-email-service)-funktion för [IMAP-stöd](/faq#do-you-support-receiving-email-with-imap), vilket representerar ett betydande framsteg inom e-postsekretess och säkerhet.

**December 2023**: Företaget [lade till stöd](/faq#do-you-support-pop3) för [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys och WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [övervakning av tid till inkorg](/faq#i) och [OpenPGP för IMAP-lagring](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Tjänsteoptimering och avancerade funktioner {#2024---service-optimization-and-advanced-features}

**Februari 2024**: Forward Email [lade till kalenderstöd (CalDAV)](/faq#do-you-support-calendars-caldav), vilket utökade plattformens kapabiliteter bortom e-post till att inkludera kalendersynkronisering.
**Mars till juli 2024**: Forward Email släppte stora optimeringar och förbättringar av sina IMAP-, POP3- och CalDAV-tjänster, med målet att göra sin tjänst lika snabb som, om inte snabbare än, alternativen.

**Juli 2024**: Företaget [lade till iOS Push-stöd](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) för att åtgärda Apple Mails brist på stöd för IMAP `IDLE`-kommandot på iOS, vilket möjliggör realtidsnotifikationer för Apple iOS-enheter. Forward Email lade också till övervakning av tid till inkorg ("TTI") för sin egen tjänst samt Yahoo/AOL, och började tillåta användare att kryptera hela sin DNS TXT-post även på gratisplanen. Som efterfrågats i [Privacy Guides-diskussioner](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) och [GitHub-ärenden](https://github.com/forwardemail/forwardemail.net/issues/254) lade företaget till möjligheten för alias att antingen tyst avvisa med `250`, mjukt avvisa med `421` eller hårt avvisa med `550` när de är inaktiverade.

**Augusti 2024**: Forward Email lade till stöd för export av brevlådor som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) och [Mbox](https://en.wikipedia.org/wiki/Mbox)-format (utöver det befintliga [SQLite](https://en.wikipedia.org/wiki/SQLite)-exportformatet). [Webhook-signaturstöd lades till](https://forwardemail.net/faq#do-you-support-bounce-webhooks), och företaget började tillåta användare att skicka nyhetsbrev, meddelanden och e-postmarknadsföring via sin utgående SMTP-tjänst. Domänomfattande och alias-specifika lagringskvoter för IMAP/POP3/CalDAV implementerades också.

### 2025 - Integritetsförbättringar och protokollstöd {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**September 2024 till januari 2025**: Forward Email [lade till en mycket efterfrågad semesterresponder-funktion och OpenPGP/WKD-kryptering för e-postvidarebefordran](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), som bygger vidare på deras redan implementerade krypterade brevlådelagringsmöjligheter.

**21 januari 2025**: Grundarens bästa vän "Jack", hans lojala hundkompanjon, gick fridfullt bort vid nästan 11 års ålder. Jack [kommer alltid att bli ihågkommen](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) för sin orubbliga följeslagarskap som stödde skapandet av Forward Email. [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) är tillägnad Jack, med erkännande för hans roll i tjänstens utveckling.

**Februari 2025**: Forward Email bytte till [DataPacket](https://www.datapacket.com) som sin nya primära datacenterleverantör och implementerade specialanpassad, prestandafokuserad bare-metal-hårdvara för att ytterligare förbättra tjänstens tillförlitlighet och hastighet.

**Mars 2025**: Version 1.0 av Forward Email släpptes officiellt.

**April 2025**: Den första versionen av [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) publicerades, och företaget började acceptera kryptovalutabetalningar.

**Maj 2025**: Tjänsten lanserade ny API-dokumentation med hjälp av [Scalar](https://github.com/scalar/scalar).

**Juni 2025**: Forward Email lanserade stöd för [CardDAV-protokollet](/faq#do-you-support-contacts-carddav), vilket utökade plattformens möjligheter att inkludera kontaktsynkronisering tillsammans med befintliga e-post- och kalendertjänster.

**Augusti 2025**: Plattformen lade till [CalDAV VTODO/uppgiftssupport](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), vilket möjliggör uppgiftshantering tillsammans med kalenderhändelser.

**November 2025**: Plattformens säkerhet förbättrades med en migrering från PBKDF2 till [Argon2id](https://en.wikipedia.org/wiki/Argon2) för lösenordshashning, och infrastrukturen migrerades från Redis till [Valkey](https://github.com/valkey-io/valkey).

**December 2025**: Version 2.0 släpptes, med introduktion av [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) stöd för tvångsmässig TLS-kryptering vid e-posttransport och uppgradering till [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - RFC-efterlevnad och avancerad filtrering {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Januari 2026**: Forward Email släppte ett omfattande [RFC-protokoll efterlevnadsdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) och lade till stöd för [S/MIME-kryptering (RFC 8551)](/faq#do-you-support-smime-encryption) samt omfattande [Sieve e-postfiltrering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) med stöd för [ManageSieve-protokollet (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API:et utökades också till 39 endpoints.

**Februari 2026**: Den officiella, open-source webmail-klienten lanserades på [mail.forwardemail.net](https://mail.forwardemail.net) ([källkod på GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Plattformen lade även till stöd för [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) och [Domain Connect](https://domainconnect.org) för 1-klicks DNS-inställning. Realtids push-notiser för IMAP, CalDAV och CardDAV lanserades med WebSockets.

**Mars 2026**: Stöd för per-domän anpassad S3-kompatibel lagring lades till, tillsammans med ett kommandoradsverktyg för hantering. Arbete påbörjades för plattformsoberoende desktop- och mobilapplikationer för macOS, Windows, Linux, iOS och Android med samma open-source webmail-kodbas, byggd med [Tauri](https://tauri.app).


## Kärnprinciper {#core-principles}

Sedan starten har Forward Email hållit fast vid en orubblig princip om integritet och säkerhet:

**100% Open-Source-filosofi**: Till skillnad från konkurrenter som bara gör sina frontend öppna medan backend hålls stängd, har Forward Email gjort hela sin kodbas – både frontend och backend – tillgänglig för allmän insyn på [GitHub](https://github.com/forwardemail).

**Integritetsfokuserad design**: Från dag ett implementerade Forward Email en unik minnesbaserad bearbetningsmetod som undviker att skriva e-post till disk, vilket skiljer den från konventionella e-posttjänster som lagrar meddelanden i databaser eller filsystem.

**Kontinuerlig innovation**: Tjänsten har utvecklats från en enkel vidarebefordringslösning till en omfattande e-postplattform med funktioner som krypterade brevlådor, kvantresistent kryptering och stöd för standardprotokoll inklusive SMTP, IMAP, POP3 och CalDAV.

**Transparens**: All kod är öppen och tillgänglig för granskning, vilket säkerställer att användare kan verifiera integritetskrav istället för att bara lita på marknadsföringspåståenden.

**Användarkontroll**: Ger användare valmöjligheter, inklusive möjligheten att själv hosta hela plattformen om så önskas.


## Nuvarande status {#current-status}

Från och med mars 2026 betjänar Forward Email över 500 000 domäner världen över, inklusive framstående organisationer och branschledare såsom:

* **Teknikföretag**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medieorganisationer**: Fox News Radio, Disney Ad Sales
* **Utbildningsinstitutioner**: University of Cambridge, University of Maryland, University of Washington, Tufts University, Swarthmore College
* **Statliga myndigheter**: Regeringen i South Australia, Regeringen i Dominikanska republiken
* **Andra organisationer**: RCD Hotels, Fly<span>.</span>io
* **Framstående utvecklare**: Isaac Z. Schlueter (skapare av npm), David Heinemeier Hansson (skapare av Ruby on Rails)

Plattformen fortsätter att utvecklas med regelbundna funktionsuppdateringar och förbättringar av infrastrukturen, och behåller sin position som den enda 100% open-source, krypterade, integritetsfokuserade, transparenta och kvantresistenta e-posttjänsten som finns tillgänglig idag.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
