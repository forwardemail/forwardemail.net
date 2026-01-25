# Om vidarebefordran av e-post {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Om vidarebefordran av e-post {#about-forward-email-1}

## Innehållsförteckning {#table-of-contents}

* [Översikt](#overview)
* [Grundare och uppdrag](#founder-and-mission)
* [Tidslinje](#timeline)
  * [2017 - Grundande och lansering](#2017---founding-and-launch)
  * [2018 - Infrastruktur och integration](#2018---infrastructure-and-integration)
  * [2019 - Prestandarevolutionen](#2019---performance-revolution)
  * [2020 - Fokus på integritet och säkerhet](#2020---privacy-and-security-focus)
  * [2021 - Plattformsmodernisering](#2021---platform-modernization)
  * [2023 - Infrastruktur och funktionsutbyggnad](#2023---infrastructure-and-feature-expansion)
  * [2024 - Tjänsteoptimering och avancerade funktioner](#2024---service-optimization-and-advanced-features)
  * [2025 - Fortsatt innovation](#2025---continued-innovation)
* [Kärnprinciper](#core-principles)
* [Nuvarande status](#current-status)

## Översikt {#overview}

> \[!TIP]
> För teknisk information om vår arkitektur, säkerhetsimplementeringar och färdplan, se [Teknisk vitbok](https://forwardemail.net/technical-whitepaper.pdf).

Vidarebefordra e-post är en [fri och öppen källkod](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [vidarebefordran av e-post](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding")-tjänst som fokuserar på en användares [rätten till integritet](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Det som började som en enkel lösning för vidarebefordran av e-post 2017 har utvecklats till en omfattande e-postplattform som erbjuder obegränsat antal anpassade domännamn, obegränsat antal e-postadresser och alias, obegränsat antal engångs-e-postadresser, skydd mot skräppost och nätfiske, krypterad brevlådelagring och många avancerade funktioner.

Tjänsten underhålls och ägs av dess ursprungliga grundarteam av designers och utvecklare. Den är byggd med 100 % öppen källkodsprogramvara med hjälp av [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") och [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Grundare och uppdrag {#founder-and-mission}

Forward Email grundades av **Nicholas Baugh** år 2017. Enligt [Teknisk whitepaper om vidarebefordran av e-post](https://forwardemail.net/technical-whitepaper.pdf) sökte Baugh inledningsvis efter en kostnadseffektiv och enkel lösning för att aktivera e-post på domännamn för sina sidoprojekt. Efter att ha undersökt tillgängliga alternativ började han koda sin egen lösning och köpte domänen `forwardemail.net` den 2 oktober 2017.

Forward Emails uppdrag sträcker sig bortom att tillhandahålla e-posttjänster – det syftar till att förändra hur branschen ser på e-postsekretess och säkerhet. Företagets kärnvärden inkluderar transparens, användarkontroll och integritetsskydd genom teknisk implementering snarare än bara policylöften.

## Tidslinje {#timeline}

### 2017 - Grundande och lansering {#2017---founding-and-launch}

**2 oktober 2017**: Nicholas Baugh köpte domänen `forwardemail.net` efter att ha undersökt kostnadseffektiva e-postlösningar för sina sidoprojekt.

**5 november 2017**: Baugh skapade en 634-raders JavaScript-fil med hjälp av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") för att vidarebefordra e-postmeddelanden för alla anpassade domännamn. Denna initiala implementering publicerades som öppen källkod till [GitHub](https://github.com/forwardemail) och tjänsten lanserades med hjälp av GitHub Pages.

**November 2017**: Vidarebefordra e-post lanserades officiellt efter en första utgåva. Den tidiga versionen var helt DNS-baserad utan kontoregistrering eller registreringsprocess – helt enkelt en README-fil skriven i Markdown med instruktioner. Användare kunde konfigurera vidarebefordran av e-post genom att konfigurera MX-poster så att de pekade på `mx1.forwardemail.net` och `mx2.forwardemail.net`, och lägga till en TXT-post med `forward-email=user@gmail.com`.

Enkelheten och effektiviteten hos denna lösning väckte uppmärksamhet från framstående utvecklare, inklusive [David Heinemeier Hansson](https://dhh.dk) (skaparen av Ruby on Rails), som fortsätter att använda vidarebefordran av e-post på sin domän `dhh.dk` än idag.

### 2018 - Infrastruktur och integration {#2018---infrastructure-and-integration}

**April 2018**: När [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lanserade sin [integritetsfokuserad konsument-DNS-tjänst](https://blog.cloudflare.com/announcing-1111/), bytte Vidarebefordra e-post från att använda [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") till [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") för att hantera [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-sökningar, vilket visar företagets engagemang för integritetsfokuserade infrastrukturval.

**Oktober 2018**: Vidarebefordra e-post gjorde det möjligt för användare att "Skicka e-post som" med [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") och [Syn](https://en.wikipedia.org/wiki/Outlook "Outlook"), vilket utökade integrationsmöjligheterna med populära e-postleverantörer.

### 2019 - Prestandarevolution {#2019---performance-revolution}

**Maj 2019**: V2 av Vidarebefordra e-post släpptes, vilket innebar en större omskrivning från de ursprungliga versionerna. Denna uppdatering fokuserade på förbättringar av [prestanda](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") genom användning av [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"):s [strömmar](https://en.wikipedia.org/wiki/Streams "Streams"), vilket lade grunden för plattformens skalbarhet.

### 2020 - Fokus på integritet och säkerhet {#2020---privacy-and-security-focus}

**Februari 2020**: Vidarebefordra e-post släppte planen Enhanced Privacy Protection, vilket gör det möjligt för användare att stänga av att ställa in offentliga DNS-postposter med sina aliaskonfigurationer för e-postvidarebefordran. Genom denna plan döljs en användares e-postaliasinformation från att vara offentligt sökbar över internet. Företaget släppte också en funktion för att aktivera eller inaktivera specifika alias samtidigt som de fortfarande tillåts visas som giltiga e-postadresser och returnera lyckade [SMTP-statuskoder](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), varvid e-postmeddelanden omedelbart kasseras (liknande som att skicka utdata till [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**April 2020**: Efter att ha stött på otaliga hinder med befintliga lösningar för skräppostdetektering som inte respekterade Forward Emails integritetspolicy, släppte företaget sin första alfaversion av Spam Scanner. Denna helt kostnadsfria och öppen källkodsbaserade [anti-spamfiltrering](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")-lösning använder en [Naive Bayes spamfilter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-metod kombinerad med [anti-nätfiske](https://en.wikipedia.org/wiki/Phishing "Phishing")- och [IDN-homografattack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-skydd. Forward Email släppte också [tvåfaktorsautentisering](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) med [engångslösenord](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) för förbättrad kontosäkerhet.

**Maj 2020**: Vidarebefordran av e-post tillät anpassad [portvidarebefordran](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") som en lösning för användare att kringgå portblockering med sin [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Företaget släppte också sin [Gratis RESTful API för vidarebefordran av e-post](email-api) med fullständig dokumentation och exempel på begäran och svar i realtid, tillsammans med stöd för webhooks.

**Augusti 2020**: Vidarebefordra e-post har lagt till stöd för e-postautentiseringssystemet [Autentiserad mottagen kedja](arc) ("ARC"), vilket ytterligare stärker e-postsäkerheten och leveransbarheten.

**23 november 2020**: Vidarebefordra e-post lanserades offentligt efter sitt betaprogram, vilket markerar en viktig milstolpe i plattformens utveckling.

### 2021 - Plattformsmodernisering {#2021---platform-modernization}

**Februari 2021**: Vidarebefordra e-post omstrukturerade sin kodbas för att ta bort alla [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\)-beroenden av typen "Python (programmeringsspråk)", vilket gjorde att deras stack kunde bli 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") och [Node.js](https://en.wikipedia.org/wiki/Node.js). Detta arkitekturbeslut överensstämde med företagets åtagande att upprätthålla en konsekvent teknikstack med öppen källkod.

**27 september 2021**: Vidarebefordra e-post [extra stöd](email-forwarding-regex-pattern-filter) för alias för vidarebefordran av e-post som matchar [reguljära uttryck](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), vilket ger användarna mer sofistikerade funktioner för e-postdirigering.

### 2023 - Infrastruktur och funktionsutbyggnad {#2023---infrastructure-and-feature-expansion}

**Januari 2023**: Forward Email lanserade en omdesignad och hastighetsoptimerad webbplats, vilket förbättrar användarupplevelsen och prestandan.

**Februari 2023**: Företaget lade till stöd för [felloggar](/faq#do-you-store-error-logs) och implementerade ett [mörkt läge](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)-färgschema för webbplatsen, vilket motsvarar användarnas preferenser och tillgänglighetsbehov.

**Mars 2023**: Vidarebefordra e-post släppte [Mandarin](https://github.com/forwardemail/tangerine#readme) och integrerade det i hela sin infrastruktur, vilket möjliggjorde användning av [DNS över HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationslagret. Företaget lade också till stöd för [MTA-STS](/faq#do-you-support-mta-sts) och bytte från [hCaptcha](/) till [Cloudflare-vändkorset](https://developers.cloudflare.com/turnstile).

**April 2023**: Vidarebefordran av e-post implementerades och automatiserades helt ny infrastruktur. Hela tjänsten började köras på globalt lastbalanserad och närhetsbaserad DNS med hälsokontroller och redundans med hjälp av [Cloudflare](https://cloudflare.com), vilket ersatte den tidigare round-robin DNS-metoden. Företaget bytte till **bare metal-servrar** över flera leverantörer, inklusive [Vultr](https://www.vultr.com/?ref=429848) och [Digitalt hav](https://m.do.co/c/a7cecd27e071), båda SOC 2 Type 1-kompatibla leverantörer. MongoDB- och Redis-databaser flyttades till klustrade konfigurationer med primära och standby-noder för hög tillgänglighet, end-to-end SSL-kryptering, kryptering i vila och point-in-time-återställning (PITR).

**Maj 2023**: Vidarebefordra e-post lanserade sin **utgående SMTP**-funktion för [skicka e-post med SMTP](/faq#do-you-support-sending-email-with-smtp)- och [skicka e-post med API](/faq#do-you-support-sending-email-with-api)-förfrågningar. Denna funktion inkluderar inbyggda skyddsåtgärder för att säkerställa hög leveransbarhet, ett modernt och robust kö- och återförsökssystem samt [stöder felloggar i realtid](/faq#do-you-store-error-logs).

**November 2023**: Vidarebefordra e-post lanserade sin [**krypterad brevlådelagring**](/blog/docs/best-quantum-safe-encrypted-email-service)-funktion för [IMAP-stöd](/faq#do-you-support-receiving-email-with-imap), vilket representerar ett betydande framsteg inom e-postsekretess och säkerhet.

**December 2023**: Företaget [extra stöd](/faq#do-you-support-pop3) för övervakning av [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [lösenord och WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [dags att inkorga](/faq#i) och [OpenPGP för IMAP-lagring](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Tjänsteoptimering och avancerade funktioner {#2024---service-optimization-and-advanced-features}

**Februari 2024**: Vidarebefordra e-post [lagt till stöd för kalender (CalDAV)](/faq#do-you-support-calendars-caldav), vilket utökar plattformens funktioner utöver e-post till att inkludera kalendersynkronisering.

**Mars till juli 2024**: Vidarebefordra e-post släppte större optimeringar och förbättringar av sina IMAP-, POP3- och CalDAV-tjänster, med målet att göra tjänsten lika snabb som, om inte snabbare än, alternativen.

**Juli 2024**: Företaget [lagt till stöd för iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) åtgärdar Apple Mails brist på stöd för IMAP-kommandot `IDLE` i iOS, vilket möjliggör realtidsaviseringar för Apple iOS-enheter. Vidarebefordra e-post lade också till övervakning av inkorgen ("TTI") för sin egen tjänst och Yahoo/AOL, och började tillåta användare att kryptera hela sin DNS TXT-post även med gratisplanen. Som begärts i [Diskussioner om sekretessguider](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) och [GitHub-problem](https://github.com/forwardemail/forwardemail.net/issues/254) lade företaget till möjligheten för alias att antingen tyst avvisa `250`, mjukt avvisa `421` eller helt avvisa `550` när det är inaktiverat.

**Augusti 2024**: Vidarebefordra e-post lade till stöd för export av postlådor i formaten [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) och [Mbox](https://en.wikipedia.org/wiki/Mbox) (utöver det befintliga exportformatet [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Stöd för webhook-signaturer har lagts till](https://forwardemail.net/faq#do-you-support-bounce-webhooks), och företaget började tillåta användare att skicka nyhetsbrev, meddelanden och e-postmarknadsföring via sin utgående SMTP-tjänst. Domänövergripande och aliasspecifika lagringskvoter för IMAP/POP3/CalDAV implementerades också.

### 2025 - Fortsatt innovation {#2025---continued-innovation}

**September 2024 till januari 2025**: Vidarebefordra e-post [lade till en mycket efterfrågad funktion för semestersvar och OpenPGP/WKD-kryptering för vidarebefordran av e-post](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), baserat på deras redan implementerade lagringsmöjligheter för krypterade brevlådor.

**21 januari 2025**: Grundarens bästa vän "Jack", hans lojala hundkompis, gick fridfullt bort vid nästan 11 års ålder. Jack [kommer alltid att bli ihågkommen](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) för hans orubbliga sällskap som stödde skapandet av Vidarebefordra e-post. [Teknisk whitepaper om vidarebefordran av e-post](https://forwardemail.net/technical-whitepaper.pdf) är tillägnad Jack, som ett erkännande av hans roll i tjänstens utveckling.

**Februari 2025**: Vidarebefordran av e-post bytte till [Datapaket](https://www.datapacket.com) som sin nya primära datacenterleverantör, och implementerade anpassad, prestandafokuserad, bare-metal-hårdvara för att ytterligare förbättra tjänstens tillförlitlighet och hastighet.

**Juni 2025**: Vidarebefordra e-post lanserade stöd för [CardDAV-protokoll](/faq#do-you-support-contacts-carddav), vilket utökar plattformens funktioner till att inkludera kontaktsynkronisering utöver befintliga e-post- och kalendertjänster.

### 2026 - RFC-efterlevnad och avancerad filtrering {#2026---rfc-compliance-and-advanced-filtering}

**Januari 2026**: Forward Email släppte ett omfattande [RFC-protokoll efterlevnadsdokument](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) som beskriver fullständigt standardstöd för SMTP, IMAP, POP3 och CalDAV. Plattformen lade också till [REQUIRETLS-stöd (RFC 8689)](/faq#requiretls-support) för tvingad TLS-kryptering vid e-posttransport, [S/MIME-kryptering (RFC 8551)](/faq#do-you-support-smime-encryption) för säker meddelandesignering och kryptering, och omfattande [Sieve e-postfiltrering (RFC 5228)](/faq#do-you-support-sieve-email-filtering) med [ManageSieve-protokoll (RFC 5804)](/faq#do-you-support-sieve-email-filtering)-stöd för serversides e-postfiltrering. [REST API](/email-api) utökades till 39 slutpunkter som täcker meddelanden, mappar, kontakter, kalendrar och kalenderhändelser.

## Kärnprinciper {#core-principles}

Sedan starten har Forward Email upprätthållit ett orubbligt engagemang för integritets- och säkerhetsprinciper:

**100 % öppen källkodsfilosofi**: Till skillnad från konkurrenter som bara använder öppen källkod för sina frontends och håller backends stängda, har Forward Email gjort hela sin kodbas – både frontend och backend – tillgänglig för offentlig granskning på [GitHub](https://github.com/forwardemail).

**Integritetsfokuserad design**: Från dag ett implementerade Forward Email en unik metod för minneshantering som undviker att e-postmeddelanden skrivs till disk, vilket skiljer den från konventionella e-posttjänster som lagrar meddelanden i databaser eller filsystem.

**Kontinuerlig innovation**: Tjänsten har utvecklats från en enkel lösning för vidarebefordran av e-post till en omfattande e-postplattform med funktioner som krypterade brevlådor, kvantresistent kryptering och stöd för standardprotokoll inklusive SMTP, IMAP, POP3 och CalDAV.

**Transparens**: All kod ska vara öppen källkod och tillgänglig för inspektion, vilket säkerställer att användare kan verifiera integritetspåståenden snarare än att bara lita på marknadsföringsuttalanden.

**Användarkontroll**: Ger användarna möjlighet att hantera hela plattformen själv om så önskas.

## Nuvarande status {#current-status}

Från och med 2025 betjänar Forward Email över 500 000 domäner världen över, inklusive kända organisationer och branschledare som:

* **Teknikföretag**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Medieorganisationer**: Fox News Radio, Disney Ad Sales
* **Utbildningsinstitutioner**: The University of Cambridge, The University of Maryland, The University of Washington, Tufts University, Swarthmore College
* **Myndigheter**: Government of South Australia, Government of Dominican Republic
* **Andra organisationer**: RCD Hotels, Fly<span>.</span>io
* **Anmärkningsvärda utvecklare**: Isaac Z. Schlueter (skapare av npm), David Heinemeier Hansson (skapare av Ruby on Rails)

Plattformen fortsätter att utvecklas med regelbundna funktionslanseringar och infrastrukturförbättringar, och behåller sin position som den enda e-posttjänsten med 100 % öppen källkod, krypterad, integritetsfokuserad, transparent och kvantumresistent som finns tillgänglig idag.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />