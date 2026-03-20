# PayPals 11-åriga API-katastrof: Hur vi byggde lösningar medan de ignorerade utvecklare {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Framgång! PayPal har äntligen lagt till `GET /v1/billing/subscriptions`-endpointen.**
>
> Efter att vi publicerade detta inlägg och skickade det till PayPals ledning implementerade deras team den mycket efterlängtade endpointen för att lista prenumerationer. Ändringen dök upp någon gång mellan [25 juni 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) och [9 juli 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Men i sann PayPal-anda meddelade de oss aldrig. Vi upptäckte denna uppdatering på egen hand först i december 2025, månader efter att funktionen tyst släppts.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">På Forward Email har vi hanterat PayPals trasiga API:er i över ett decennium. Vad som började som mindre frustrationer har förvandlats till en fullständig katastrof som tvingade oss att bygga egna lösningar, blockera deras phishing-mallar och slutligen stoppa alla PayPal-betalningar under en kritisk kontomigrering.</p>
<p class="lead mt-3">Det här är berättelsen om 11 år av att PayPal ignorerat grundläggande utvecklarbehov medan vi försökte allt för att få deras plattform att fungera.</p>


## Innehållsförteckning {#table-of-contents}

* [Den saknade biten: Ingen möjlighet att lista prenumerationer](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problemet uppstår](#2014-2017-the-problem-emerges)
* [2020: Vi ger dem omfattande feedback](#2020-we-give-them-extensive-feedback)
  * [Den 27-punkters feedbacklistan](#the-27-item-feedback-list)
  * [Team involverades, löften gavs](#teams-got-involved-promises-were-made)
  * [Resultatet? Inget.](#the-result-nothing)
* [Den verkställande exodusen: Hur PayPal förlorade allt institutionellt minne](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Ny ledning, samma problem](#2025-new-leadership-same-problems)
  * [Den nya VD:n engagerar sig](#the-new-ceo-gets-involved)
  * [Michelle Gills svar](#michelle-gills-response)
  * [Vårt svar: Inga fler möten](#our-response-no-more-meetings)
  * [Marty Brodbecks överkomplicerade svar](#marty-brodbecks-overengineering-response)
  * [Den "enkla CRUD"-motsägelsen](#the-simple-crud-contradiction)
  * [Frånkopplingen blir tydlig](#the-disconnect-becomes-clear)
* [År av buggrapporter de ignorerade](#years-of-bug-reports-they-ignored)
  * [2016: Tidiga UI/UX-klagomål](#2016-early-uiux-complaints)
  * [2021: Buggrapport för företagsmail](#2021-business-email-bug-report)
  * [2021: Förslag på UI-förbättringar](#2021-ui-improvement-suggestions)
  * [2021: Sandbox-miljöer fungerar inte](#2021-sandbox-environment-failures)
  * [2021: Rapportsystemet helt trasigt](#2021-reports-system-completely-broken)
  * [2022: Kärn-API-funktion saknas (igen)](#2022-core-api-feature-missing-again)
* [Utvecklarupplevelsen: En mardröm](#the-developer-experience-nightmare)
  * [Trasigt användargränssnitt](#broken-user-interface)
  * [SDK-problem](#sdk-problems)
  * [Brott mot Content Security Policy](#content-security-policy-violations)
  * [Dokumentationskaos](#documentation-chaos)
  * [Säkerhetssårbarheter](#security-vulnerabilities)
  * [Katastrof i sessionshantering](#session-management-disaster)
* [Juli 2025: Droppen som fick bägaren att rinna över](#july-2025-the-final-straw)
* [Varför vi inte bara kan släppa PayPal](#why-we-cant-just-drop-paypal)
* [Communityns lösning](#the-community-workaround)
* [Blockering av PayPal-mallar på grund av phishing](#blocking-paypal-templates-due-to-phishing)
  * [Det verkliga problemet: PayPals mallar ser ut som bedrägerier](#the-real-problem-paypals-templates-look-like-scams)
  * [Vår implementation](#our-implementation)
  * [Varför vi var tvungna att blockera PayPal](#why-we-had-to-block-paypal)
  * [Problemets omfattning](#the-scale-of-the-problem)
  * [Ironin](#the-irony)
  * [Verklig påverkan: Nya PayPal-bedrägerier](#real-world-impact-novel-paypal-scams)
* [PayPals bakvända KYC-process](#paypals-backwards-kyc-process)
  * [Hur det borde fungera](#how-it-should-work)
  * [Hur PayPal faktiskt fungerar](#how-paypal-actually-works)
  * [Den verkliga påverkan](#the-real-world-impact)
  * [Kontomigreringskatastrofen i juli 2025](#the-july-2025-account-migration-disaster)
  * [Varför detta är viktigt](#why-this-matters)
* [Hur alla andra betalningsleverantörer gör rätt](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Branschstandarden](#the-industry-standard)
  * [Vad andra leverantörer erbjuder vs PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematiska mörkläggning: Tystar 6 miljoner röster](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Den stora utplåningen](#the-great-erasure)
  * [Tredjepartsräddningen](#the-third-party-rescue)
* [Den 11-åriga capture-buggen: $1,899 och räknar](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Emails förlust på $1,899](#forward-emails-1899-loss)
  * [Den ursprungliga rapporten från 2013: 11+ år av försummelse](#the-2013-original-report-11-years-of-negligence)
  * [2016-erkännandet: PayPal bryter sitt eget SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [2024-eskaleringen: Fortfarande trasigt](#the-2024-escalation-still-broken)
  * [Webhook-pålitlighetskatastrofen](#the-webhook-reliability-disaster)
  * [Mönstret av systematisk försummelse](#the-pattern-of-systematic-negligence)
  * [Det odokumenterade kravet](#the-undocumented-requirement)
* [PayPals bredare mönster av bedrägeri](#paypals-broader-pattern-of-deception)
  * [New York Department of Financial Services åtgärd](#the-new-york-department-of-financial-services-action)
  * [Honey-rättegången: Omskrivning av affiliate-länkar](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Kostnaden för PayPals försummelse](#the-cost-of-paypals-negligence)
  * [Dokumentationslögn](#the-documentation-lie)
* [Vad detta betyder för utvecklare](#what-this-means-for-developers)
## Den Saknade Bit: Ingen Möjlighet att Lista Prenumerationer {#the-missing-piece-no-way-to-list-subscriptions}

Här är det som förbluffar oss: PayPal har haft prenumerationsfakturering sedan 2014, men de har aldrig tillhandahållit ett sätt för handlare att lista sina egna prenumerationer.

Tänk på det en sekund. Du kan skapa prenumerationer, du kan avbryta dem om du har ID:t, men du kan inte få en lista över alla aktiva prenumerationer för ditt konto. Det är som att ha en databas utan en SELECT-sats.

Vi behöver detta för grundläggande affärsverksamhet:

* Kundsupport (när någon mejlar och frågar om sin prenumeration)
* Finansiell rapportering och avstämning
* Automatiserad fakturahantering
* Efterlevnad och revision

Men PayPal? De bara... byggde det aldrig.


## 2014-2017: Problemet Uppstår {#2014-2017-the-problem-emerges}

Problemet med prenumerationslistning dök först upp i PayPals community-forum redan 2017. Utvecklare ställde den uppenbara frågan: "Hur får jag en lista över alla mina prenumerationer?"

PayPals svar? Tystnad.

Community-medlemmar började bli frustrerade:

> "Mycket märkligt utelämnande om en handlare inte kan lista alla aktiva avtal. Om avtals-ID:t förloras betyder det att bara användaren kan avbryta eller pausa ett avtal." - leafspider

> "+1. Det har gått nästan 3 år." - laudukang (vilket betyder att problemet funnits sedan ungefär 2014)

[Det ursprungliga community-inlägget](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) från 2017 visar utvecklare som ber om denna grundläggande funktionalitet. PayPals svar var att arkivera det repository där folk rapporterade problemet.


## 2020: Vi Ger Dem Omfattande Feedback {#2020-we-give-them-extensive-feedback}

I oktober 2020 kontaktade PayPal oss för en formell feedback-session. Det var inget avslappnat samtal – de organiserade ett 45-minuters Microsoft Teams-möte med 8 PayPal-chefer inklusive Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze och andra.

### Den 27-Punkters Feedbacklistan {#the-27-item-feedback-list}

Vi kom förberedda. Efter 6 timmar av försök att integrera med deras API:er hade vi sammanställt 27 specifika problem. Mark Stuart från PayPal Checkout-teamet sa:

> Hej Nick, tack för att du delade med alla idag! Jag tror detta kommer bli katalysatorn för att få mer stöd och investeringar för vårt team att gå vidare och fixa dessa saker. Det har varit svårt att få så rik feedback som den du lämnat hittills.

Feedbacken var inte teoretisk – den kom från verkliga integrationsförsök:

1. **Access token-generering fungerar inte**:

> Access token-generering fungerar inte. Dessutom borde det finnas mer än bara cURL-exempel.

2. **Ingen webb-UI för att skapa prenumerationer**:

> Hur i hela friden kan man skapa prenumerationer utan att behöva göra det med cURL? Det verkar inte finnas något webb-UI för detta (som Stripe har)

Mark Stuart fann access token-problemet särskilt oroande:

> Vi hör vanligtvis inte om problem med access token-generering.

### Flera Team Involverades, Löften Gavs {#teams-got-involved-promises-were-made}

När vi upptäckte fler problem fortsatte PayPal att lägga till fler team i samtalet. Darshan Raju från teamet för prenumerationshantering UI anslöt sig och sa:

> Vi erkänner gapet. Vi kommer att följa upp och åtgärda detta. Tack igen för din feedback!

Sessionen beskrevs som en:

> ärlig genomgång av din upplevelse

för att:

> göra PayPal till vad det borde vara för utvecklare.

### Resultatet? Inget. {#the-result-nothing}

Trots den formella feedback-sessionen, den omfattande 27-punkterslistan, flera team involverade och löften om att:

> följa upp och åtgärda

problemen, blev absolut ingenting fixat.


## Ledningens Exodus: Hur PayPal Förlorade All Institutionell Kunskap {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Här blir det riktigt intressant. Varenda person som mottog vår feedback 2020 har lämnat PayPal:

**Ledarskapsförändringar:**

* [Dan Schulman (VD i 9 år) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO som organiserade feedbacken) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januari 2024)
**Tekniska ledare som gav löften, sedan lämnade:**

* **Mark Stuart** (lovade att feedback skulle vara en "katalysator") → [Nu på Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-årig PayPal-veteran) → [VD för MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Pensionerad](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (en av de sista kvarvarande) → [Lämnade just för Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januari 2025)

PayPal har blivit en snurrdörr där chefer samlar in utvecklarfeedback, ger löften, och sedan lämnar för bättre företag som JPMorgan, Ripple och andra fintech-företag.

Det förklarar varför GitHub-ärenderesponsen 2025 verkade helt frånkopplad från vår feedback 2020 – bokstavligen alla som tog emot den feedbacken har lämnat PayPal.


## 2025: Ny ledning, samma problem {#2025-new-leadership-same-problems}

Spola fram till 2025, och exakt samma mönster uppstår. Efter år av ingen framgång tar PayPals nya ledning återigen kontakt.

### Den nya VD:n engagerar sig {#the-new-ceo-gets-involved}

Den 30 juni 2025 eskalerade vi direkt till PayPals nya VD Alex Chriss. Hans svar var kort:

> Hej Nick – Tack för att du hörde av dig och för feedbacken. Michelle (cc:ad) är ansvarig med sitt team för att engagera sig och arbeta igenom detta med dig. Tack -A

### Michelle Gills svar {#michelle-gills-response}

Michelle Gill, EVP och General Manager för Small Business och Financial Services, svarade:

> Tack så mycket Nick, flyttar Alex till bcc. Vi har undersökt detta sedan ditt tidigare inlägg. Vi ringer dig innan veckan är slut. Kan du skicka dina kontaktuppgifter så att en av mina kollegor kan ta kontakt. Michelle

### Vårt svar: Inga fler möten {#our-response-no-more-meetings}

Vi tackade nej till ytterligare ett möte och förklarade vår frustration:

> Tack. Men jag känner inte att ett samtal kommer att leda till något. Så här är det... Jag har varit med på ett samtal tidigare och det ledde absolut ingenstans. Jag slösade över 2 timmar av min tid på att prata med hela teamet och ledningen och inget blev gjort... Massor av mejl fram och tillbaka. Absolut inget gjort. Feedbacken ledde ingenstans. Jag har försökt i åratal, blivit lyssnad på, och sedan leder det ingenstans.

### Marty Brodbecks överkomplicerade svar {#marty-brodbecks-overengineering-response}

Sedan tog Marty Brodbeck, som leder konsumentteknik på PayPal, kontakt:

> Hej Nick, det här är Marty Brodbeck. Jag leder all konsumentteknik här på PayPal och har drivit API-utvecklingen för företaget. Kan du och jag prata om problemet du står inför och hur vi kan hjälpa till här.

När vi förklarade det enkla behovet av en endpoint för prenumerationslista avslöjade hans svar exakt problemet:

> Tack Nick, vi håller på att skapa ett enda prenumerations-API med full SDK (stöder full felhantering, händelsebaserad prenumerationsspårning, robust drifttid) där fakturering också delas ut som ett separat API för handlare att använda istället för att behöva orkestrera över flera endpoints för att få ett enda svar.

Detta är precis fel tillvägagångssätt. Vi behöver inte månader av komplex arkitektur. Vi behöver en enkel REST-endpoint som listar prenumerationer – något som borde ha funnits sedan 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "Enkel CRUD"-motsägelsen {#the-simple-crud-contradiction}

När vi påpekade att detta var grundläggande CRUD-funktionalitet som borde ha funnits sedan 2014, var Martys svar talande:

> Enkla CRUD-operationer är en del av kärn-API:t min vän, så det kommer inte ta månader av utveckling

PayPals TypeScript SDK, som för närvarande bara stödjer tre endpoints efter månader av utveckling, tillsammans med dess historiska tidslinje, visar tydligt att sådana projekt kräver mer än några månader för att slutföras.
Det här svaret visar att han inte förstår sin egen API. Om "enkla CRUD-operationer är en del av kärn-API:et," var är då slutpunkten för prenumerationslistning? Vi svarade:

> Om 'enkla CRUD-operationer är en del av kärn-API:et' var är då slutpunkten för prenumerationslistning? Utvecklare har efterfrågat denna 'enkla CRUD-operation' sedan 2014. Det har gått 11 år. Alla andra betalningsprocessorer har haft denna grundläggande funktionalitet från dag ett.

### The Disconnect Becomes Clear {#the-disconnect-becomes-clear}

Utbytena 2025 med Alex Chriss, Michelle Gill och Marty Brodbeck visar samma organisatoriska dysfunktion:

1. **Ny ledning har ingen kunskap om tidigare feedbacksessioner**
2. **De föreslår samma överarbetade lösningar**
3. **De förstår inte sina egna API-begränsningar**
4. **De vill ha fler möten istället för att bara åtgärda problemet**

Detta mönster förklarar varför PayPal-team 2025 verkar helt frånkopplade från den omfattande feedback som gavs 2020 – de personer som tog emot den feedbacken är borta, och den nya ledningen upprepar samma misstag.


## Years of Bug Reports They Ignored {#years-of-bug-reports-they-ignored}

Vi klagade inte bara på saknade funktioner. Vi rapporterade aktivt buggar och försökte hjälpa dem att förbättras. Här är en omfattande tidslinje över de problem vi dokumenterade:

### 2016: Early UI/UX Complaints {#2016-early-uiux-complaints}

Redan 2016 kontaktade vi offentligt PayPals ledning inklusive Dan Schulman om gränssnittsproblem och användbarhetsproblem. Det var för 9 år sedan, och samma UI/UX-problem kvarstår idag.

### 2021: Business Email Bug Report {#2021-business-email-bug-report}

I mars 2021 rapporterade vi att PayPals affärsmejlsystem skickade felaktiga avbokningsmeddelanden. E-postmallen hade variabler som renderades felaktigt, vilket visade förvirrande meddelanden till kunder.

Mark Stuart bekräftade problemet:

> Tack Nick! Flyttar till BCC. @Prasy, är ditt team ansvarigt för detta e-postmeddelande eller vet vem som är det? "Niftylettuce, LLC, we'll no longer bill you" får mig att tro att det är en förväxling i vem det är adresserat till och innehållet i e-postmeddelandet.

**Resultat**: De fixade faktiskt detta! Mark Stuart bekräftade:

> Fick precis höra från notifikationsteamet att e-postmallen har blivit fixad och rullats ut. Tack för att du hörde av dig och rapporterade det. Tack!

Detta visar att de KAN fixa saker när de vill – de väljer bara att inte göra det för de flesta problem.

### 2021: UI Improvement Suggestions {#2021-ui-improvement-suggestions}

I februari 2021 gav vi detaljerad feedback på deras dashboard-UI, specifikt sektionen "PayPal Recent Activity":

> Jag tycker att dashboarden på paypal.com, specifikt "PayPal Recent Activity", behöver förbättras. Jag tycker inte att ni ska visa $0 återkommande betalningar med status "Created" – det lägger bara till en massa extra rader och man kan inte enkelt se på en gång hur mycket inkomster som genereras för dagen/de senaste dagarna.

Mark Stuart vidarebefordrade det till teamet för konsumentprodukter:

> Tack! Jag är inte säker på vilket team som ansvarar för Activity, men jag vidarebefordrade det till chefen för konsumentprodukter för att hitta rätt team. En återkommande betalning på $0.00 verkar vara en bugg. Bör nog filtreras bort.

**Resultat**: Aldrig fixat. UI visar fortfarande dessa värdelösa $0-poster.

### 2021: Sandbox Environment Failures {#2021-sandbox-environment-failures}

I november 2021 rapporterade vi kritiska problem med PayPals sandbox-miljö:

* Sandbox hemliga API-nycklar ändrades slumpmässigt och inaktiverades
* Alla sandbox-testkonton raderades utan förvarning
* Felmeddelanden vid försök att visa sandbox-kontodetaljer
* Intermittenta laddningsfel

> Av någon anledning ändrades min sandbox hemliga API-nyckel och den blev inaktiverad. Dessutom raderades alla mina gamla sandbox-testkonton.

> Ibland laddar de och ibland inte heller. Detta är otroligt frustrerande.

**Resultat**: Inget svar, ingen fix. Utvecklare möter fortfarande problem med sandboxens tillförlitlighet.

### 2021: Reports System Completely Broken {#2021-reports-system-completely-broken}
I maj 2021 rapporterade vi att PayPals nedladdningssystem för transaktionsrapporter var helt trasigt:

> Det verkar som att rapportnedladdningar inte fungerar just nu och har inte gjort det hela dagen. Man borde nog också få ett e-postmeddelande om det misslyckas.

Vi påpekade också katastrofen med sessionshanteringen:

> Om du är inaktiv medan du är inloggad på PayPal i ungefär 5 minuter loggas du ut. Så när du uppdaterar knappen bredvid rapporten du vill kolla status på (efter att du väntat i evigheter), är det ett elände att behöva logga in igen.

Mark Stuart bekräftade problemet med sessionstidsgränsen:

> Jag minns att du rapporterat det tidigare med att din session ofta gick ut och störde ditt utvecklingsflöde när du växlade mellan din IDE och developer.paypal.com eller din handlardashboard, och sedan kom tillbaka och var utloggad igen.

**Resultat**: Sessionstidsgränserna är fortfarande 60 sekunder. Rapportsystemet misslyckas fortfarande regelbundet.

### 2022: Kärn-API-funktion saknas (igen) {#2022-core-api-feature-missing-again}

I januari 2022 eskalerade vi problemet med prenumerationslistningen igen, denna gång med ännu mer detaljer om hur deras dokumentation var felaktig:

> Det finns ingen GET som listar alla prenumerationer (tidigare kallade faktureringsavtal)

Vi upptäckte att deras officiella dokumentation var helt felaktig:

> API-dokumentationen är också helt felaktig. Vi trodde vi kunde göra en workaround genom att ladda ner en hårdkodad lista med prenumerations-ID:n. Men det fungerar inte ens!

> Från den officiella dokumentationen här... Det står att du kan göra detta... Här är grejen – det finns inget "Subscription ID"-fält alls någonstans att kryssa i.

Christina Monti från PayPal svarade:

> Vi ber om ursäkt för frustrationen som orsakats av att dessa steg är fel, vi kommer att fixa det den här veckan.

Sri Shivananda (CTO) tackade oss:

> Tack för din fortsatta hjälp med att göra oss bättre. Mycket uppskattat.

**Resultat**: Dokumentationen fixades aldrig. Endpointen för prenumerationslistning skapades aldrig.


## Utvecklarupplevelsen – en mardröm {#the-developer-experience-nightmare}

Att arbeta med PayPals API:er är som att resa tillbaka i tiden 10 år. Här är de tekniska problemen vi dokumenterat:

### Trasigt användargränssnitt {#broken-user-interface}

PayPals utvecklardashboard är en katastrof. Så här ser vi på det dagligen:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPals UI är så trasigt att du inte ens kan stänga aviseringar
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Din webbläsare stödjer inte videotaggen.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Utvecklardashboarden tvingar dig bokstavligen att dra en reglage och loggar sedan ut dig efter 60 sekunder
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Din webbläsare stödjer inte videotaggen.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Fler UI-katastrofer i PayPals utvecklargränssnitt som visar trasiga arbetsflöden
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Din webbläsare stödjer inte videotaggen.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Prenumerationshanteringsgränssnittet – gränssnittet är så dåligt att vi var tvungna att förlita oss på kod för att skapa produkter och prenumerationsplaner
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  En vy av det trasiga prenumerationsgränssnittet med saknad funktionalitet (du kan inte enkelt skapa produkter/planer/prenumerationer – och det verkar inte finnas något sätt alls att ta bort produkter eller planer när de väl skapats i UI)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typiska PayPal-felmeddelanden - kryptiska och otydliga
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problem {#sdk-problems}

* Kan inte hantera både engångsbetalningar och prenumerationer utan komplexa lösningar som involverar att byta och återrendera knappar samtidigt som SDK:n laddas om med skript-taggar
* JavaScript SDK bryter mot grundläggande konventioner (gemener för klassnamn, ingen instanskontroll)
* Felmeddelanden anger inte vilka fält som saknas
* Inkonsekventa datatyper (kräver strängbelopp istället för nummer)

### Brott mot Content Security Policy {#content-security-policy-violations}

Deras SDK kräver unsafe-inline och unsafe-eval i din CSP, **vilket tvingar dig att kompromissa med din webbplats säkerhet**.

### Dokumentationskaos {#documentation-chaos}

Mark Stuart själv erkände:

> Instämmer i att det finns en absurd mängd av både gamla och nya API:er. Verkligen svårt att hitta vad man ska leta efter (även för oss som jobbar här).

### Säkerhetssårbarheter {#security-vulnerabilities}

**PayPals 2FA-implementering är bakvänd**. Även med TOTP-appar aktiverade tvingar de SMS-verifiering – vilket gör konton sårbara för SIM-swap-attacker. Om du har TOTP aktiverat borde det användas exklusivt. Reservmetoden borde vara e-post, inte SMS.

### Katastrof i sessionshantering {#session-management-disaster}

**Deras utvecklardashboard loggar ut dig efter 60 sekunders inaktivitet**. Försök göra något produktivt och du går ständigt igenom: inloggning → captcha → 2FA → utloggning → upprepa. Använder du VPN? Lycka till.

## Juli 2025: Droppen som fick bägaren att rinna över {#july-2025-the-final-straw}

Efter 11 år med samma problem kom brytpunkten under en rutinmässig kontomigrering. Vi behövde byta till ett nytt PayPal-konto för att matcha vårt företagsnamn "Forward Email LLC" för renare bokföring.

Vad som borde varit enkelt blev en fullständig katastrof:

* Inledande tester visade att allt fungerade korrekt
* Timmar senare blockerade PayPal plötsligt alla prenumerationsbetalningar utan förvarning
* Kunder kunde inte betala, vilket skapade förvirring och supportbelastning
* PayPals support gav motsägelsefulla svar och hävdade att kontona var verifierade
* Vi tvingades helt stoppa PayPal-betalningar

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Felet kunderna såg när de försökte betala – ingen förklaring, inga loggar, ingenting
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPals support hävdar att allt var okej medan betalningarna var helt trasiga. Det sista meddelandet visar att de säger att de "återställde vissa funktioner" men fortfarande ber om mer ospecificerad information – klassiskt PayPal-supportteater
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Identitetsverifieringsprocessen som påstås ha "fixat" ingenting
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Vagt meddelande och fortfarande ingen lösning. Ingen information, meddelanden eller något om vilken ytterligare information som krävs. Kundsupporten tystnar.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Varför vi inte bara kan sluta använda PayPal {#why-we-cant-just-drop-paypal}

Trots alla dessa problem kan vi inte helt överge PayPal eftersom vissa kunder endast har PayPal som betalningsalternativ. Som en kund sa på vår [statussida](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal är mitt enda betalningsalternativ

**Vi är fast i att stödja en trasig plattform eftersom PayPal har skapat ett betalningsmonopol för vissa användare.**


## Community-lösningen {#the-community-workaround}

Eftersom PayPal inte tillhandahåller grundläggande funktionalitet för att lista prenumerationer har utvecklargemenskapen byggt lösningar. Vi skapade ett skript som hjälper till att hantera PayPal-prenumerationer: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Detta skript refererar till en [community gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) där utvecklare delar lösningar. Användare tackar oss faktiskt [för att vi tillhandahåller vad PayPal borde ha byggt för år sedan](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775).


## Blockering av PayPal-mallar på grund av nätfiske {#blocking-paypal-templates-due-to-phishing}

Problemen går bortom API:er. PayPals e-postmallar är så dåligt utformade att vi var tvungna att implementera specifik filtrering i vår e-posttjänst eftersom de är omöjliga att skilja från nätfiskeattacker.

### Det verkliga problemet: PayPals mallar ser ut som bedrägerier {#the-real-problem-paypals-templates-look-like-scams}

Vi får regelbundet rapporter om PayPal-e-post som ser exakt ut som nätfiskeattacker. Här är ett faktiskt exempel från våra missbruksrapporter:

**Ämne:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Denna e-post vidarebefordrades till `abuse@microsoft.com` eftersom den verkade vara ett nätfiske. Problemet? Den kom faktiskt från PayPals sandbox-miljö, men deras mall är så dåligt designad att den triggar nätfiskedetekteringssystem.

### Vår implementation {#our-implementation}

Du kan se vår PayPal-specifika filtrering implementerad i vår [kod för e-postfiltrering](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'På grund av pågående PayPal-fakturaspam måste du manuellt skicka en fakturalänk'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Varför vi var tvungna att blockera PayPal {#why-we-had-to-block-paypal}

Vi implementerade detta eftersom PayPal vägrade åtgärda massiva problem med spam/nätfiske/bedrägeri trots våra upprepade rapporter till deras missbruksteam. De specifika e-posttyper vi blockerar inkluderar:

* **RT000238** - Misstänkta fakturavisningar
* **PPC001017** - Problematiska betalningsbekräftelser
* **RT000542** - Försök till hack av gåvomeddelanden

### Problemets omfattning {#the-scale-of-the-problem}

Våra loggar för spamfiltrering visar den enorma mängden PayPal-fakturaspam vi hanterar dagligen. Exempel på blockerade ämnen inkluderar:

* "Faktura från PayPal Billing Team:- Denna avgift kommer att dras automatiskt från ditt konto. Vänligen kontakta oss omedelbart på \[PHONE]"
* "Faktura från \[COMPANY NAME] (\[ORDER-ID])"
* Flera varianter med olika telefonnummer och falska order-ID:n
Dessa e-postmeddelanden kommer ofta från `outlook.com`-värdar men verkar härstamma från PayPals legitima system, vilket gör dem särskilt farliga. E-postmeddelandena passerar SPF-, DKIM- och DMARC-autentisering eftersom de skickas via PayPals faktiska infrastruktur.

Våra tekniska loggar visar att dessa spammejl innehåller legitima PayPal-huvuden:

* `X-Email-Type-Id: RT000238` (samma ID som vi blockerar)
* `From: "service@paypal.com" <service@paypal.com>`
* Giltiga DKIM-signaturer från `paypal.com`
* Korrekt SPF-poster som visar PayPals e-postservrar

Detta skapar en omöjlig situation: legitima PayPal-mejl och spam har båda identiska tekniska egenskaper.

### Ironin {#the-irony}

PayPal, ett företag som borde leda kampen mot finansiellt bedrägeri, har e-postmallar som är så dåligt utformade att de triggar anti-phishing-system. Vi tvingas blockera legitima PayPal-mejl eftersom de är omöjliga att skilja från bedrägerier.

Detta är dokumenterat i säkerhetsforskning: [Akta dig för PayPals nya adressbedrägeri](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – som visar hur PayPals egna system utnyttjas för bedrägeri.

### Verklig påverkan: Nya PayPal-bedrägerier {#real-world-impact-novel-paypal-scams}

Problemet sträcker sig bortom dålig mallutformning. PayPals fakturasystem är så lätt att utnyttja att bedragare regelbundet missbrukar det för att skicka legitima utseende bedrägliga fakturor. Säkerhetsforskaren Gavin Anderegg dokumenterade [Ett nytt PayPal-bedrägeri](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) där bedragare skickar riktiga PayPal-fakturor som klarar alla autentiseringskontroller:

> "När jag granskade källan såg e-postmeddelandet ut att faktiskt komma från PayPal (SPF, DKIM och DMARC passerade alla). Knappen länkar också till vad som såg ut som en legitim PayPal-URL... Det tog en stund innan jag insåg att det var ett legitimt mejl. Jag hade precis fått en slumpmässig 'faktura' från en bedragare."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Skärmdump som visar flera bedrägliga PayPal-fakturor som översvämmar en inkorg, alla ser legitima ut eftersom de faktiskt kommer från PayPals system
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Forskaren noterade:

> "Det verkar också vara en bekvämlighetsfunktion som PayPal borde överväga att låsa ner. Jag antog genast att detta var någon form av bedrägeri och var bara intresserad av de tekniska detaljerna. Det verkar alldeles för lätt att genomföra, och jag oroar mig för att andra kan gå på det."

Detta illustrerar problemet perfekt: PayPals egna legitima system är så dåligt utformade att de möjliggör bedrägeri samtidigt som de gör legitima kommunikationer misstänkta.

För att göra saken värre påverkade detta vår leveransbarhet med Yahoo vilket resulterade i kundklagomål och timmar av noggrann testning och mönsterkontroll.


## PayPals bakvända KYC-process {#paypals-backwards-kyc-process}

En av de mest frustrerande aspekterna av PayPals plattform är deras bakvända syn på efterlevnad och Know Your Customer (KYC)-procedurer. Till skillnad från alla andra betalningsförmedlare tillåter PayPal utvecklare att integrera deras API:er och börja ta emot betalningar i produktion innan korrekt verifiering är slutförd.

### Hur det borde fungera {#how-it-should-work}

Varje legitim betalningsförmedlare följer denna logiska sekvens:

1. **Slutför KYC-verifiering först**
2. **Godkänn handlarens konto**
3. **Ge tillgång till produktions-API**
4. **Tillåt betalningsinsamling**

Detta skyddar både betalningsförmedlaren och handlaren genom att säkerställa efterlevnad innan några pengar byter händer.

### Hur PayPal faktiskt fungerar {#how-paypal-actually-works}

PayPals process är helt bakvänd:

1. **Ge omedelbart tillgång till produktions-API**
2. **Tillåt betalningsinsamling i timmar eller dagar**
3. **Blockera plötsligt betalningar utan förvarning**
4. **Kräv KYC-dokumentation efter att kunder redan påverkats**
5. **Ge ingen avisering till handlaren**
6. **Låt kunder upptäcka problemet och rapportera det**
### Den verkliga påverkan {#the-real-world-impact}

Denna bakvända process skapar katastrofer för företag:

* **Kunder kan inte slutföra köp** under högsäsong
* **Ingen förvarning** om att verifiering krävs
* **Inga e-postmeddelanden** när betalningar blockeras
* **Handlare får reda på problem från förvirrade kunder**
* **Intäktsförlust** under kritiska affärsperioder
* **Skadat kundförtroende** när betalningar mystiskt misslyckas

### Katastrofen vid kontomigreringen i juli 2025 {#the-july-2025-account-migration-disaster}

Detta exakta scenario utspelade sig under vår rutinmässiga kontomigrering i juli 2025. PayPal tillät betalningar att fungera initialt, men blockerade dem plötsligt utan någon förvarning. Vi upptäckte problemet först när kunder började rapportera att de inte kunde betala.

När vi kontaktade support fick vi motstridiga svar om vilken dokumentation som krävdes, utan någon tydlig tidsplan för lösning. Detta tvingade oss att helt stoppa PayPal-betalningar, vilket förvirrade kunder som inte hade några andra betalningsalternativ.

### Varför detta är viktigt {#why-this-matters}

PayPals syn på efterlevnad visar en grundläggande missuppfattning om hur företag fungerar. Korrekt KYC bör ske **innan** produktionsintegration, inte efter att kunder redan försöker betala. Bristen på proaktiv kommunikation när problem uppstår visar på PayPals frånkoppling från handlarens behov.

Denna bakvända process är symptomatisk för PayPals bredare organisatoriska problem: de prioriterar sina interna processer framför handlar- och kundupplevelsen, vilket leder till den typ av operativa katastrofer som driver företag bort från deras plattform.


## Hur alla andra betalningsleverantörer gör rätt {#how-every-other-payment-processor-does-it-right}

Funktionen för att lista prenumerationer som PayPal vägrar implementera har varit standard i branschen i över ett decennium. Så här hanterar andra betalningsleverantörer detta grundläggande krav:

### Stripe {#stripe}

Stripe har haft prenumerationslistning sedan deras API lanserades. Deras dokumentation visar tydligt hur man hämtar alla prenumerationer för en kund eller handlarkonto. Detta anses vara grundläggande CRUD-funktionalitet.

### Paddle {#paddle}

Paddle erbjuder omfattande API:er för prenumerationshantering inklusive listning, filtrering och paginering. De förstår att handlare behöver se sina återkommande intäktsströmmar.

### Coinbase Commerce {#coinbase-commerce}

Även kryptovalutabetalningsleverantörer som Coinbase Commerce erbjuder bättre prenumerationshantering än PayPal.

### Square {#square}

Squares API inkluderar prenumerationslistning som en grundläggande funktion, inte en eftertanke.

### Branschstandarden {#the-industry-standard}

Varje modern betalningsleverantör erbjuder:

* Lista alla prenumerationer
* Filtrera efter status, datum, kund
* Paginering för stora datamängder
* Webhook-notifikationer för prenumerationsändringar
* Omfattande dokumentation med fungerande exempel

### Vad andra leverantörer erbjuder vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Lista alla prenumerationer:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtrera efter kund:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrera efter status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Vad du faktiskt får:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Du kan ENDAST hämta EN prenumeration om du redan känner till ID
# Det finns INGEN endpoint för att lista alla prenumerationer
# Det finns INGET sätt att söka eller filtrera
# Du måste själv hålla reda på alla prenumerations-ID:n
```

**PayPals tillgängliga endpoints:**

* `POST /v1/billing/subscriptions` - Skapa en prenumeration
* `GET /v1/billing/subscriptions/{id}` - Hämta EN prenumeration (om du känner till ID)
* `PATCH /v1/billing/subscriptions/{id}` - Uppdatera en prenumeration
* `POST /v1/billing/subscriptions/{id}/cancel` - Avbryt prenumeration
* `POST /v1/billing/subscriptions/{id}/suspend` - Pausa prenumeration
**Vad som saknas från PayPal:**

* ❌ Ingen `GET /v1/billing/subscriptions` (lista alla)
* ❌ Ingen sökfunktionalitet
* ❌ Ingen filtrering efter status, kund, datum
* ❌ Ingen stöd för paginering

PayPal är den enda stora betalningsprocessorn som tvingar utvecklare att manuellt spåra prenumerations-ID:n i sina egna databaser.


## PayPals systematiska mörkläggning: Tystar 6 miljoner röster {#paypals-systematic-cover-up-silencing-6-million-voices}

I ett drag som perfekt sammanfattar PayPals sätt att hantera kritik tog de nyligen ner hela sitt communityforum, vilket effektivt tystade över 6 miljoner medlemmar och raderade hundratusentals inlägg som dokumenterade deras misslyckanden.

### Den stora utraderingen {#the-great-erasure}

Det ursprungliga PayPal Community på `paypal-community.com` hade **6 003 558 medlemmar** och innehöll hundratusentals inlägg, bugg-rapporter, klagomål och diskussioner om PayPals API-misslyckanden. Detta representerade över ett decennium av dokumenterade bevis på PayPals systematiska problem.

Den 30 juni 2025 tog PayPal tyst ner hela forumet. Alla länkar till `paypal-community.com` ger nu 404-fel. Detta var inte en migrering eller uppgradering.

### Tredjepartsräddningen {#the-third-party-rescue}

Som tur är har en tredjepartstjänst på [ppl.lithium.com](https://ppl.lithium.com/) bevarat en del av innehållet, vilket gör att vi kan komma åt diskussionerna som PayPal försökte dölja. Dock är denna tredjepartsbevarande ofullständig och kan försvinna när som helst.

Detta mönster av att dölja bevis är inte nytt för PayPal. De har en dokumenterad historia av att:

* Ta bort kritiska bugg-rapporter från allmän vy
* Avsluta utvecklarverktyg utan förvarning
* Ändra API:er utan korrekt dokumentation
* Tysta communitydiskussioner om deras misslyckanden

Nertagningen av forumet är det mest fräcka försöket hittills att dölja deras systematiska misslyckanden från allmän granskning.


## Den 11-åriga Capture-buggkatastrofen: $1,899 och räknar {#the-11-year-capture-bug-disaster-1899-and-counting}

Medan PayPal var upptagna med att organisera feedback-sessioner och ge löften har deras kärnbetalningssystem varit fundamentalt trasigt i över 11 år. Bevisen är förödande.

### Forward Emails förlust på $1,899 {#forward-emails-1899-loss}

I våra produktionssystem upptäckte vi 108 PayPal-betalningar totalt **$1,899** som gick förlorade på grund av PayPals capture-fel. Dessa betalningar visar ett konsekvent mönster:

* `CHECKOUT.ORDER.APPROVED` webhooks mottogs
* PayPals capture-API returnerade 404-fel
* Order blev otillgängliga via PayPals API

Det är omöjligt att avgöra om kunderna debiterades eftersom PayPal helt döljer debug-loggar efter 14 dagar och raderar all data från dashboarden för order-ID:n som inte fångades.

Detta representerar bara ett företag. **De samlade förlusterna över tusentals handlare under 11+ år uppgår sannolikt till miljontals dollar.**

**Vi säger det igen: de samlade förlusterna över tusentals handlare under 11+ år uppgår sannolikt till miljontals dollar.**

Den enda anledningen till att vi upptäckte detta är att vi är otroligt noggranna och datadrivna.

### Den ursprungliga rapporten från 2013: 11+ år av försummelse {#the-2013-original-report-11-years-of-negligence}

Den tidigaste dokumenterade rapporten om detta exakta problem finns på [Stack Overflow i november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkiverad](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Keep receiving 404 Error with Rest API when doing a capture"

Felet som rapporterades 2013 är **identiskt** med vad Forward Email upplevde 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Communitysvar från 2013 var talande:

> "There is a reported problem at the moment with REST API. PayPal are working on it."
**11+ år senare, de "jobbar fortfarande på det."**

### Bekännelsen 2016: PayPal bryter sin egen SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

År 2016 dokumenterade PayPals egen GitHub-repository [massiva capture-fel](https://github.com/paypal/PayPal-PHP-SDK/issues/660) som påverkade deras officiella PHP SDK. Omfattningen var häpnadsväckande:

> "Sedan 2016-09-20 har alla PayPal capture-försök misslyckats med 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Inget ändrades mellan 2016-09-19 och 2016-09-20 i API-integrationen. **100% av capture-försöken sedan 2016-09-20 har gett detta fel.**"

En handlare rapporterade:

> "Jag har haft **över 1 400 misslyckade capture-försök under de senaste 24 timmarna**, alla med INVALID_RESOURCE_ID felmeddelande."

PayPals initiala svar var att skylla på handlaren och hänvisa till teknisk support. Först efter massiv press erkände de fel:

> "Jag har en uppdatering från våra produktutvecklare. De märker i headers som skickas att PayPal-Request-ID skickas med 42 tecken, men **det verkar ha skett en nylig ändring som begränsar detta ID till endast 38 tecken.**"

Denna bekännelse avslöjar PayPals systematiska försummelse:

1. **De gjorde odokumenterade brytande ändringar**
2. **De bröt sin egen officiella SDK**
3. **De skyllde först på handlarna**
4. **De erkände bara fel under press**

Även efter att ha "fixat" problemet rapporterade handlare:

> "Uppgraderade SDK till v1.7.4 och **problemet händer fortfarande.**"

### Eskaleringen 2024: Fortfarande trasigt {#the-2024-escalation-still-broken}

Nya rapporter från den bevarade PayPal Community visar att problemet faktiskt har blivit värre. En [diskussion från september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkiverad](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumenterar exakt samma problem:

> "Problemet började bara dyka upp för ungefär 2 veckor sedan och påverkar inte alla ordrar. **Det mycket vanligare verkar vara 404-fel vid capture.**"

Handlaren beskriver samma mönster som Forward Email upplevde:

> "Efter att ha försökt capture ordern returnerar PayPal en 404. När man hämtar detaljer om ordern: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Detta är utan något spår av en lyckad capture från vår sida.**"

### Katastrofen med webhook-pålitlighet {#the-webhook-reliability-disaster}

En annan [bevarad community-diskussion](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) avslöjar att PayPals webhook-system är fundamentalt opålitligt:

> "Teoretiskt borde det finnas två event (CHECKOUT.ORDER.APPROVED och PAYMENT.CAPTURE.COMPLETED) från webhook-event. Faktiskt **mottas dessa två event sällan omedelbart, PAYMENT.CAPTURE.COMPLETED tas oftast inte emot eller kommer först efter några timmar.**"

För prenumerationsbetalningar:

> "**'PAYMENT.SALE.COMPLETED' mottogs ibland inte alls eller först efter några timmar.**"

Handlarens frågor visar djupet av PayPals pålitlighetsproblem:

1. **"Varför händer detta?"** - PayPals webhook-system är fundamentalt trasigt
2. **"Om orderstatus är 'COMPLETED', kan jag då anta att jag har fått pengarna?"** - Handlare kan inte lita på PayPals API-svar
3. **"Varför kan 'Event Logs->Webhook Events' inte hitta några loggar?"** - Inte ens PayPals egna loggsystem fungerar

### Mönstret av systematisk försummelse {#the-pattern-of-systematic-negligence}

Bevisen sträcker sig över 11+ år och visar ett tydligt mönster:

* **2013**: "PayPal jobbar på det"
* **2016**: PayPal erkänner brytande ändring, levererar trasig fix
* **2024**: Samma exakta fel uppstår fortfarande, påverkar Forward Email och otaliga andra

Detta är inte en bugg - **detta är systematisk försummelse.** PayPal har känt till dessa kritiska fel i betalningshanteringen i över ett decennium och har konsekvent:
1. **Skylde handlare för PayPals buggar**  
2. **Gjort odokumenterade brytande förändringar**  
3. **Tillhandahållit otillräckliga lösningar som inte fungerar**  
4. **Ignorerat den ekonomiska påverkan på företag**  
5. **Dolt bevis genom att ta ner communityforum**  

### The Undocumented Requirement {#the-undocumented-requirement}

Ingenstans i PayPals officiella dokumentation nämns att handlare måste implementera retry-logik för capture-operationer. Deras dokumentation säger att handlare ska "capture omedelbart efter godkännande," men nämner inte att deras API slumpmässigt returnerar 404-fel som kräver komplexa retry-mekanismer.

Detta tvingar varje handlare att:

* Implementera exponentiell backoff retry-logik  
* Hantera inkonsekvent webhook-leverans  
* Bygga komplexa system för tillståndshantering  
* Manuellt övervaka misslyckade captures  

**Alla andra betalningsprocessorer tillhandahåller pålitliga capture-API:er som fungerar första gången.**  


## PayPals bredare mönster av bedrägeri {#paypals-broader-pattern-of-deception}

Capture-buggen är bara ett exempel på PayPals systematiska tillvägagångssätt för att vilseleda kunder och dölja sina misslyckanden.

### The New York Department of Financial Services Action {#the-new-york-department-of-financial-services-action}

I januari 2025 utfärdade New York Department of Financial Services en [åtgärd mot PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) för vilseledande metoder, vilket visar att PayPals bedrägliga mönster sträcker sig långt bortom deras API:er.

Denna regleringsåtgärd visar PayPals vilja att ägna sig åt vilseledande metoder i hela sin verksamhet, inte bara i deras utvecklarverktyg.

### The Honey Lawsuit: Rewriting Affiliate Links {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals förvärv av Honey har resulterat i [rättstvister som hävdar att Honey skriver om affiliate-länkar](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), och stjäl provisioner från innehållsskapare och influencers. Detta är en annan form av systematiskt bedrägeri där PayPal tjänar pengar genom att omdirigera intäkter som borde gå till andra.

Mönstret är tydligt:

1. **API-fel**: Dölja trasig funktionalitet, skylla på handlare  
2. **Tysta communityn**: Ta bort bevis på problem  
3. **Regelöverträdelser**: Engagera sig i vilseledande metoder  
4. **Affiliate-stöld**: Stjäla provisioner genom teknisk manipulation  

### The Cost of PayPal's Negligence {#the-cost-of-paypals-negligence}

Forward Emails förlust på 1 899 dollar är bara toppen av isberget. Tänk på den bredare påverkan:

* **Enskilda handlare**: Tusentals som förlorar hundratals till tusentals dollar var  
* **Företagskunder**: Potentiellt miljoner i förlorade intäkter  
* **Utvecklartid**: Otaliga timmar som läggs på att bygga lösningar för PayPals trasiga API:er  
* **Kundförtroende**: Företag som förlorar kunder på grund av PayPals betalningsfel  

Om en liten e-posttjänst förlorade nästan 2 000 dollar, och detta problem har funnits i över 11 år och påverkat tusentals handlare, är den samlade ekonomiska skadan sannolikt **hundratals miljoner dollar**.

### The Documentation Lie {#the-documentation-lie}

PayPals officiella dokumentation misslyckas konsekvent med att nämna de kritiska begränsningarna och buggarna som handlare kommer att stöta på. Till exempel:

* **Capture API**: Ingen nämning av att 404-fel är vanliga och kräver retry-logik  
* **Webhook-pålitlighet**: Ingen nämning av att webhooks ofta försenas med timmar  
* **Prenumerationslistning**: Dokumentationen antyder att listning är möjlig när ingen endpoint finns  
* **Sessionstidsgränser**: Ingen nämning av aggressiva 60-sekunders timeouter  

Denna systematiska utelämning av kritisk information tvingar handlare att upptäcka PayPals begränsningar genom trial and error i produktionssystem, vilket ofta resulterar i ekonomiska förluster.  


## What This Means for Developers {#what-this-means-for-developers}

PayPals systematiska misslyckande att ta itu med grundläggande utvecklarbehov samtidigt som de samlar in omfattande feedback visar på ett fundamentalt organisatoriskt problem. De behandlar feedbackinsamling som en ersättning för att faktiskt åtgärda problem.
Mönstret är tydligt:

1. Utvecklare rapporterar problem
2. PayPal organiserar feedbacksessioner med chefer
3. Omfattande feedback ges
4. Teamen erkänner brister och lovar att "spåra och åtgärda"
5. Ingenting implementeras
6. Chefer lämnar för bättre företag
7. Nya team efterfrågar samma feedback
8. Cykeln upprepas

Under tiden tvingas utvecklare bygga lösningar, kompromissa med säkerheten och hantera trasiga användargränssnitt bara för att ta emot betalningar.

Om du bygger ett betalningssystem, lär av vår erfarenhet: bygg din [trifecta approach](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) med flera processorer, men förvänta dig inte att PayPal ska tillhandahålla den grundläggande funktionalitet du behöver. Planera att bygga lösningar från dag ett.

> Detta inlägg dokumenterar vår 11-åriga erfarenhet med PayPals API:er på Forward Email. Alla kodexempel och länkar är från våra faktiska produktionssystem. Vi fortsätter att stödja PayPal-betalningar trots dessa problem eftersom vissa kunder inte har något annat alternativ

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
