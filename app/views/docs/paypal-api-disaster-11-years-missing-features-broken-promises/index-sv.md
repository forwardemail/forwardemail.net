# PayPals 11 år långa API-katastrof: Hur vi byggde lösningar medan de ignorerade utvecklare {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">På Forward Email har vi haft problem med PayPals trasiga API:er i över ett decennium. Det som började som mindre frustrationer har förvandlats till en fullständig katastrof som tvingade oss att bygga våra egna lösningar, blockera deras nätfiskemallar och slutligen stoppa alla PayPal-betalningar under en kritisk kontomigrering.</p>
<p class="lead mt-3">Detta är berättelsen om 11 år av PayPal som ignorerar grundläggande utvecklarbehov medan vi försökte allt för att få deras plattform att fungera.</p>

## Innehållsförteckning {#table-of-contents}

* [Den saknade delen: Inget sätt att lista prenumerationer](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problemet uppstår](#2014-2017-the-problem-emerges)
* [2020: Vi ger dem omfattande feedback](#2020-we-give-them-extensive-feedback)
  * [Feedbacklistan med 27 punkter](#the-27-item-feedback-list)
  * [Lagen engagerade sig, löften gavs](#teams-got-involved-promises-were-made)
  * [Resultatet? Ingenting.](#the-result-nothing)
* [Exodus för ledningen: Hur PayPal förlorade allt institutionellt minne](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nytt ledarskap, samma problem](#2025-new-leadership-same-problems)
  * [Den nya VD:n engagerar sig](#the-new-ceo-gets-involved)
  * [Michelle Gills svar](#michelle-gills-response)
  * [Vårt svar: Inga fler möten](#our-response-no-more-meetings)
  * [Marty Brodbecks överdrivna respons](#marty-brodbecks-overengineering-response)
  * [Den "enkla CRUD"-motsägelsen](#the-simple-crud-contradiction)
  * [Kopplingen blir tydlig](#the-disconnect-becomes-clear)
* [Åratal av felrapporter som de ignorerade](#years-of-bug-reports-they-ignored)
  * [2016: Tidiga UI/UX-klagomål](#2016-early-uiux-complaints)
  * [2021: Felrapport om företags-e-post](#2021-business-email-bug-report)
  * [2021: Förslag på förbättringar av användargränssnittet](#2021-ui-improvement-suggestions)
  * [2021: Misslyckanden i sandlådemiljön](#2021-sandbox-environment-failures)
  * [2021: Rapportsystemet är helt trasigt](#2021-reports-system-completely-broken)
  * [2022: Kärn-API-funktion saknas (igen)](#2022-core-api-feature-missing-again)
* [Utvecklarupplevelsens mardröm](#the-developer-experience-nightmare)
  * [Trasigt användargränssnitt](#broken-user-interface)
  * [SDK-problem](#sdk-problems)
  * [Överträdelser av innehållssäkerhetspolicyn](#content-security-policy-violations)
  * [Dokumentationskaos](#documentation-chaos)
  * [Säkerhetsproblem](#security-vulnerabilities)
  * [Katastrof i sessionshanteringen](#session-management-disaster)
* [Juli 2025: Droppen som får bägaren att rinna ut](#july-2025-the-final-straw)
* [Varför vi inte bara kan sluta använda PayPal](#why-we-cant-just-drop-paypal)
* [Lösningen för gemenskapen](#the-community-workaround)
* [Blockera PayPal-mallar på grund av nätfiske](#blocking-paypal-templates-due-to-phishing)
  * [Det verkliga problemet: PayPals mallar ser ut som bedrägerier](#the-real-problem-paypals-templates-look-like-scams)
  * [Vår implementering](#our-implementation)
  * [Varför vi var tvungna att blockera PayPal](#why-we-had-to-block-paypal)
  * [Problemets omfattning](#the-scale-of-the-problem)
  * [Ironin](#the-irony)
  * [Verkliga effekter: Nya PayPal-bedrägerier](#real-world-impact-novel-paypal-scams)
* [PayPals bakåtriktade KYC-process](#paypals-backwards-kyc-process)
  * [Hur det borde fungera](#how-it-should-work)
  * [Hur PayPal faktiskt fungerar](#how-paypal-actually-works)
  * [Den verkliga effekten](#the-real-world-impact)
  * [Kontomigreringskatastrofen i juli 2025](#the-july-2025-account-migration-disaster)
  * [Varför detta är viktigt](#why-this-matters)
* [Hur alla andra betalningsleverantörer gör det rätt](#how-every-other-payment-processor-does-it-right)
  * [Rand](#stripe)
  * [Paddla](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Fyrkant](#square)
  * [Branschstandarden](#the-industry-standard)
  * [Vad andra betalningsleverantörer erbjuder jämfört med PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematiska mörkläggning: Tystar 6 miljoner röster](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Den stora utraderingen](#the-great-erasure)
  * [Räddningen från tredje part](#the-third-party-rescue)
* [Den 11 år långa Capture Bug-katastrofen: 1 899 dollar och vi fortsätter](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Förlust på 1 899 dollar för vidarebefordran av e-post](#forward-emails-1899-loss)
  * [Ursprunglig rapport från 2013: 11+ år av försummelse](#the-2013-original-report-11-years-of-negligence)
  * [2016 års erkännande: PayPal bryter mot sitt eget SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskaleringen 2024: Fortfarande trasig](#the-2024-escalation-still-broken)
  * [Webhooks tillförlitlighetskatastrof](#the-webhook-reliability-disaster)
  * [Mönstret av systematisk försummelse](#the-pattern-of-systematic-negligence)
  * [Det odokumenterade kravet](#the-undocumented-requirement)
* [PayPals bredare mönster av bedrägeri](#paypals-broader-pattern-of-deception)
  * [New York Department of Financial Services-åtgärden](#the-new-york-department-of-financial-services-action)
  * [Honungsrättegången: Omskrivning av affilialänkar](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Kostnaden för PayPals försumlighet](#the-cost-of-paypals-negligence)
  * [Dokumentationslögnen](#the-documentation-lie)
* [Vad detta innebär för utvecklare](#what-this-means-for-developers)

## Den saknade delen: Inget sätt att lista prenumerationer {#the-missing-piece-no-way-to-list-subscriptions}

Här är det som slår oss: PayPal har haft prenumerationsfakturering sedan 2014, men de har aldrig erbjudit ett sätt för handlare att lista sina egna prenumerationer.

Tänk på det en sekund. Du kan skapa prenumerationer, du kan avbryta dem om du har ID:t, men du kan inte få en lista över alla aktiva prenumerationer för ditt konto. Det är som att ha en databas utan SELECT-sats.

Vi behöver detta för grundläggande affärsverksamhet:

* Kundsupport (när någon mejlar och frågar om sin prenumeration)
* Finansiell rapportering och avstämning
* Automatiserad faktureringshantering
* Regelefterlevnad och revision

Men PayPal? De byggde det bara... aldrig.

## 2014-2017: Problemet uppstår {#2014-2017-the-problem-emerges}

Problemet med prenumerationslistor dök först upp i PayPals communityforum 2017. Utvecklarna ställde den uppenbara frågan: "Hur får jag en lista över alla mina prenumerationer?"

PayPals svar? Syrsor.

Medlemmar i samhället började bli frustrerade:

> "Mycket märkligt utelämnande om en handlare inte kan lista alla aktiva avtal. Om avtals-ID:t förloras innebär det att endast användaren kan avbryta eller tillfälligt upphäva ett avtal." - leafspider

> "+1. Det har gått nästan 3 år." - laudukang (vilket betyder att problemet har funnits sedan ~2014)

[ursprungligt communityinlägg](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) från 2017 visar utvecklare som vädjar om denna grundläggande funktionalitet. PayPals svar var att arkivera arkivet där folk rapporterade problemet.

## 2020: Vi ger dem omfattande feedback {#2020-we-give-them-extensive-feedback}

I oktober 2020 kontaktade PayPal oss för en formell feedbacksession. Detta var inte ett vanligt samtal – de organiserade ett 45-minuters Microsoft Teams-samtal med åtta PayPal-chefer, inklusive Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze och andra.

### Feedbacklistan med 27 punkter {#the-27-item-feedback-list}

Vi var förberedda. Efter 6 timmars försök att integrera med deras API:er hade vi sammanställt 27 specifika problem. Mark Stuart från PayPal Checkout-teamet sa:

> Hej Nick, tack för att du delar med dig till alla idag! Jag tror att detta kommer att bli katalysatorn för att få mer stöd och investeringar för vårt team att åtgärda de här sakerna. Det har varit svårt att få så bra feedback som den du har lämnat hittills.

Feedbacken var inte teoretisk – den kom från verkliga integrationsförsök:

1. **Generering av åtkomsttoken fungerar inte**:

> Generering av åtkomsttoken fungerar inte. Det borde också finnas fler än bara cURL-exempel.

2. **Inget webbgränssnitt för att skapa prenumerationer**:

> Hur i hela friden kan man skapa prenumerationer utan att behöva göra det med cURL? Det verkar inte finnas ett webbgränssnitt för att göra detta (som Stripe har)

Mark Stuart tyckte särskilt att problemet med åtkomsttoken oroande:

> Vi hör vanligtvis inte talas om problem kring generering av åtkomsttokens.

### Team engagerade sig, löften gavs {#teams-got-involved-promises-were-made}

Allt eftersom vi upptäckte fler problem lade PayPal till fler team i diskussionen. Darshan Raju från UI-teamet för prenumerationshantering anslöt sig och sa:

> Erkänn bristen. Vi kommer att spåra och åtgärda detta. Tack igen för din feedback!

Sessionen beskrevs som att den sökte en:

> uppriktig genomgång av din upplevelse

till:

> göra PayPal till vad det borde vara för utvecklare.

### Resultatet? Ingenting. {#the-result-nothing}

Trots den formella feedbacksessionen, den omfattande listan med 27 punkter, flera teams engagemang och löften om att:

> spår och adress

problem, absolut ingenting åtgärdades.

## Exodus ur ledningen: Hur PayPal förlorade allt institutionellt minne {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Det är här det blir riktigt intressant. Varenda person som fick vår feedback för 2020 har lämnat PayPal:

**Ledarskapsförändringar:**

* [Dan Schulman (VD i 9 år) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO som organiserade feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januari 2024)

**Tekniska ledare som gav löften och sedan lämnade:**

* **Mark Stuart** (utlovad feedback skulle vara "katalysator") → [Nu på Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-årig PayPal-veteran) → [VD för MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Pensionerad](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (en av de sista kvarvarande) → [Just åkt till Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januari 2025)

PayPal har blivit en svängdörr där chefer samlar in feedback från utvecklare, ger löften och sedan lämnar företaget för bättre företag som JPMorgan, Ripple och andra fintech-företag.

Detta förklarar varför svaret på GitHub-problemet från 2025 verkade helt frånkopplat från vår feedback från 2020 – bokstavligen alla som fick den feedbacken har lämnat PayPal.

## 2025: Nytt ledarskap, samma problem {#2025-new-leadership-same-problems}

Snabbspola fram till 2025, och exakt samma mönster framträder. Efter år utan framsteg sträcker sig PayPals nya ledning ut igen.

### Den nya VD:n engagerar sig {#the-new-ceo-gets-involved}

Den 30 juni 2025 kontaktade vi PayPals nya VD Alex Chriss. Hans svar var kortfattat:

> Hej Nick – Tack för att du kontaktade oss och gav oss feedbacken. Michelle (cc'd) är på plats med sitt team för att engagera sig och arbeta igenom detta med dig. Tack -A

### Michelle Gills svar {#michelle-gills-response}

Michelle Gill, vice vd och chef för småföretag och finansiella tjänster, svarade:

> Tack så mycket Nick, jag flyttar Alex till bcc. Vi har undersökt detta sedan ditt tidigare inlägg. Vi ringer dig innan veckan är slut. Kan du skicka mig dina kontaktuppgifter så att en av mina kollegor kan nå dig? Michelle

### Vårt svar: Inga fler möten {#our-response-no-more-meetings}

Vi tackade nej till ytterligare ett möte och förklarade vår frustration:

> Tack. Men jag känner inte att det kommer att göra någonting att ringa ett samtal. Här är anledningen... Jag fick ett samtal tidigare och det ledde absolut ingenstans. Jag slösade bort över 2 timmar av min tid på att prata med hela teamet och ledningen och ingenting blev gjort... Massor av mejl fram och tillbaka. Absolut ingenting blev gjort. Feedback ledde ingenstans. Jag försökte i åratal, bli lyssnad på, och sedan leder det ingenstans.

### Marty Brodbecks svar på överengineering {#marty-brodbecks-overengineering-response}

Sedan kontaktade Marty Brodbeck, som är chef för konsumentteknik på PayPal:

> Hej Nick, det här är Marty Brodbeck. Jag ansvarar för all konsumentutveckling här på PayPal och har drivit API-utvecklingen för företaget. Kan du och jag diskutera problemet du har och hur vi kan hjälpa till här?

När vi förklarade det enkla behovet av en slutpunkt för prenumerationslistning, avslöjade hans svar exakt vad problemet var:

> Tack Nick, vi håller på att skapa ett enda prenumerations-API med fullständig SDK (stöder fullständig felhantering, händelsebaserad prenumerationsspårning, robust drifttid) där faktureringen också delas upp som ett separat API för handlare att gå till istället för att behöva orkestrera över flera slutpunkter för att få ett enda svar.

Det här är helt fel tillvägagångssätt. Vi behöver inte månader av komplex arkitektur. Vi behöver en enkel REST-slutpunkt som listar prenumerationer – något som borde ha funnits sedan 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Motsägelsen om den "enkla CRUD" {#the-simple-crud-contradiction}

När vi påpekade att detta var grundläggande CRUD-funktionalitet som borde ha funnits sedan 2014, var Martys svar talande:

> Enkla Crud-operationer är en del av kärn-API:et min vän, så det kommer inte att ta månader av utveckling

PayPal TypeScript SDK, som för närvarande endast stöder tre slutpunkter efter månaders utveckling, tillsammans med dess historiska tidslinje, visar tydligt att sådana projekt kräver mer än några månader att slutföra.

Det här svaret visar att han inte förstår sitt eget API. Om "enkla CRUD-åtgärder är en del av kärn-API:et", var är då slutpunkten för prenumerationslistningen? Vi svarade:

> Om "enkla CRUD-åtgärder är en del av kärn-API:et", var är då slutpunkten för prenumerationslistning? Utvecklare har efterfrågat denna "enkla CRUD-åtgärd" sedan 2014. Det har gått 11 år. Alla andra betalningsleverantörer har haft denna grundläggande funktionalitet sedan dag ett.

### Frånkopplingen blir tydlig {#the-disconnect-becomes-clear}

Utbytena med Alex Chriss, Michelle Gill och Marty Brodbeck 2025 visar samma organisatoriska dysfunktion:

1. **Den nya ledningen har ingen kännedom om tidigare feedbacksessioner**
2. **De föreslår samma överkonstruerade lösningar**
3. **De förstår inte sina egna API-begränsningar**
4. **De vill ha fler möten istället för att bara åtgärda problemet**

Detta mönster förklarar varför PayPal-teamen år 2025 verkar helt bortkopplade från den omfattande feedback som gavs 2020 – de personer som fick den feedbacken är borta, och det nya ledarskapet upprepar samma misstag.

## År av felrapporter som de ignorerade {#years-of-bug-reports-they-ignored}

Vi klagade inte bara på saknade funktioner. Vi rapporterade aktivt buggar och försökte hjälpa dem att förbättras. Här är en omfattande tidslinje över de problem vi dokumenterade:

### 2016: Tidiga klagomål gällande UI/UX {#2016-early-uiux-complaints}

Redan 2016 kontaktade vi PayPals ledning offentligt, inklusive Dan Schulman, om gränssnittsproblem och användbarhetsproblem. Detta var för 9 år sedan, och samma UI/UX-problem kvarstår än idag.

### 2021: Felrapport för företags-e-post {#2021-business-email-bug-report}

I mars 2021 rapporterade vi att PayPals e-postsystem för företag skickade felaktiga aviseringsmeddelanden. E-postmallen hade variabler som återgavs felaktigt, vilket visade förvirrande meddelanden för kunderna.

Mark Stuart erkände problemet:

> Tack Nick! Byter till BCC. @Prasy, är ditt team ansvarigt för det här e-postmeddelandet eller vet ni vem som är det? Meddelandet "Niftylettuce, LLC, vi fakturerar dig inte längre" får mig att tro att det är en förväxling mellan vem det är adresserat till och innehållet i e-postmeddelandet.

**Resultat**: De fixade faktiskt den här! Mark Stuart bekräftade:

> Har precis hört från aviseringsteamet att e-postmallen har åtgärdats och lanserats. Tack för att du kontaktade oss för att rapportera det!

Detta visar att de KAN fixa saker när de vill – de väljer bara att inte göra det för de flesta problem.

### 2021: Förslag på förbättringar av användargränssnittet {#2021-ui-improvement-suggestions}

I februari 2021 gav vi detaljerad feedback om deras instrumentpanelsgränssnitt, särskilt avsnittet "Senaste aktiviteten hos PayPal":

> Jag tycker att instrumentpanelen på paypal.com, särskilt "PayPal Senaste aktivitet", behöver förbättras. Jag tycker inte att du ska visa statusraderna "Skapad" för $0 Återkommande betalning - det lägger bara till massor av extra rader och du kan inte enkelt se hur mycket inkomst som genereras för dagen/de senaste dagarna.

Mark Stuart vidarebefordrade det till konsumentproduktteamet:

> Tack! Jag är inte säker på vilket team som ansvarar för Aktivitet, men jag vidarebefordrade det till chefen för konsumentprodukter för att hitta rätt team. En återkommande betalning på 0,00 USD verkar vara en bugg. Borde förmodligen filtreras bort.

**Resultat**: Åtgärdat. Användargränssnittet visar fortfarande dessa värdelösa $0-poster.

### 2021: Fel i sandlådemiljön {#2021-sandbox-environment-failures}

I november 2021 rapporterade vi kritiska problem med PayPals sandbox-miljö:

* Hemliga API-nycklar för sandbox ändrades slumpmässigt och inaktiverades
* Alla testkonton för sandbox raderades utan föregående meddelande
* Felmeddelanden vid försök att visa information om sandboxkonton
* Intermittenta laddningsfel

> Av någon anledning ändrades min hemliga API-nyckel för sandbox och inaktiverades. Dessutom raderades alla mina gamla testkonton för sandbox.

> Ibland laddas de och ibland inte lika bra. Det här är vansinnigt frustrerande.

**Resultat**: Inget svar, ingen lösning. Utvecklare har fortfarande problem med sandboxens tillförlitlighet.

### 2021: Rapporterar att systemet är helt trasigt {#2021-reports-system-completely-broken}

I maj 2021 rapporterade vi att PayPals nedladdningssystem för transaktionsrapporter var helt trasigt:

> Verkar som att rapportering av nedladdningar inte fungerar just nu och har inte gjort det på hela dagen. Borde förmodligen också få ett e-postmeddelande om det misslyckas.

Vi påpekade också sessionshanteringskatastrofen:

> Om du är inaktiv medan du är inloggad på PayPal i ungefär 5 minuter loggas du ut. Så när du uppdaterar knappen igen bredvid rapporten du vill kontrollera statusen för (efter att du har väntat en evighet) är det synd att behöva logga in igen.

Mark Stuart bekräftade problemet med timeout-sessionen:

> Jag minns att du rapporterade det tidigare när din session ofta löpte ut och störde ditt utvecklingsflöde när du växlade mellan din IDE och developer.paypal.com eller din handelspanel, och sedan kom du tillbaka och loggades ut igen.

**Resultat**: Sessionstimeouts är fortfarande 60 sekunder. Rapportsystemet misslyckas fortfarande regelbundet.

### 2022: Kärn-API-funktion saknas (igen) {#2022-core-api-feature-missing-again}

I januari 2022 eskalerade vi problemet med prenumerationslistningen igen, den här gången med ännu mer detaljer om hur deras dokumentation var felaktig:

> Det finns ingen GET som listar alla prenumerationer (tidigare kallade faktureringsavtal)

Vi upptäckte att deras officiella dokumentation var helt felaktig:

> API-dokumentationen är också helt felaktig. Vi trodde att vi kunde göra en lösning genom att ladda ner en hårdkodad lista med prenumerations-ID:n. Men det fungerar inte ens!

> Från den officiella dokumentationen här... Det står att du kan göra detta... Det viktiga är att det inte finns något "Prenumerations-ID"-fält någonstans som kan bockas av.

Christina Monti från PayPal svarade:

> Ber om ursäkt för frustrationen som orsakats av att dessa steg var felaktiga, vi åtgärdar det den här veckan.

Sri Shivananda (teknikchef) tackade oss:

> Tack för din fortsatta hjälp med att göra oss bättre. Mycket uppskattat.

**Resultat**: Dokumentationen åtgärdades aldrig. Slutpunkten för prenumerationslistan skapades aldrig.

## Utvecklarupplevelsens mardröm {#the-developer-experience-nightmare}

Att arbeta med PayPals API:er är som att ta en resa tillbaka i tiden 10 år. Här är de tekniska problemen vi har dokumenterat:

### Trasigt användargränssnitt {#broken-user-interface}

PayPals utvecklarpanel är en katastrof. Här är vad vi hanterar dagligen:

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPals användargränssnitt är så trasigt att det inte ens går att stänga av aviseringar
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Din webbläsare stöder inte videotaggen.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Utvecklarens instrumentpanel gör att du bokstavligen drar ett reglage och sedan loggar ut dig efter 60 sekunder.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Din webbläsare stöder inte videotaggen.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Fler UI-katastrofer i PayPals utvecklargränssnitt som visar trasiga arbetsflöden
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Din webbläsare stöder inte videotaggen.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Gränssnittet för prenumerationshantering - gränssnittet är så dåligt att vi var tvungna att förlita oss på kod för att generera produkter och prenumerationsplaner
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
En vy över det trasiga prenumerationsgränssnittet med saknad funktionalitet (du kan inte enkelt skapa produkter/planer/prenumerationer &ndash; och det verkar inte finnas något sätt alls att ta bort produkter eller planer när de väl har skapats i gränssnittet)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typiska PayPal-felmeddelanden - kryptiska och ohjälpsamma
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problem {#sdk-problems}

* Kan inte hantera både engångsbetalningar och prenumerationer utan komplexa lösningar som involverar byte och omrendering av knappar när SDK:t laddas om med skripttaggar
* JavaScript SDK bryter mot grundläggande konventioner (klassnamn med gemener, ingen instanskontroll)
* Felmeddelanden anger inte vilka fält som saknas
* Inkonsekventa datatyper (kräver strängbelopp istället för siffror)

### Överträdelser av säkerhetspolicyn för innehåll {#content-security-policy-violations}

Deras SDK kräver unsafe-inline och unsafe-eval i din CSP, **vilket tvingar dig att kompromissa med din webbplats säkerhet**.

### Dokumentationskaos {#documentation-chaos}

Mark Stuart själv erkände:

> Håller med om att det finns en absurd mängd äldre och nya API:er. Riktigt svårt att hitta vad man ska leta efter (även för oss som jobbar här).

### Säkerhetsproblem {#security-vulnerabilities}

**PayPals 2FA-implementering är bakvänt**. Även med TOTP-appar aktiverade tvingar de fram SMS-verifiering, vilket gör konton sårbara för SIM-swap-attacker. Om du har TOTP aktiverat bör den använda exklusivt det. Reservalternativet bör vara e-post, inte SMS.

### Sessionshanteringskatastrof {#session-management-disaster}

**Deras utvecklarpanel loggar ut dig efter 60 sekunders inaktivitet**. Försöker du göra något produktivt får du hela tiden: inloggning → captcha → 2FA → utloggning → upprepa. Använder du VPN? Lycka till.

## Juli 2025: Droppen som får bägaren att rinna ut {#july-2025-the-final-straw}

Efter 11 år med samma problem kom brytpunkten under en rutinmässig kontomigrering. Vi behövde övergå till ett nytt PayPal-konto som matchade vårt företagsnamn "Forward Email LLC" för en renare redovisning.

Det som borde ha varit enkelt förvandlades till en fullständig katastrof:

* Inledande tester visade att allt fungerade korrekt
* Timmar senare blockerade PayPal plötsligt alla prenumerationsbetalningar utan förvarning
* Kunder kunde inte betala, vilket skapade förvirring och supportbörda
* PayPals support gav motstridiga svar som påstod att kontona var verifierade
* Vi tvingades helt stoppa PayPal-betalningar

<figure>
<figcaption><div class="alert alert-danger small text-center">
Felet som kunderna såg när de försökte betala - ingen förklaring, inga loggar, ingenting
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPals support hävdade att allt var bra medan betalningarna var helt avbrutna. Det sista meddelandet visar att de säger att de "återställt vissa funktioner" men fortfarande ber om mer ospecificerad information - klassisk PayPal-supportteater
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
Vagt meddelande och fortfarande ingen lösning. Ingen information, meddelanden eller något om vilken ytterligare information som krävs. Kundsupporten är tyst.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Varför vi inte bara kan slopa PayPal {#why-we-cant-just-drop-paypal}

Trots alla dessa problem kan vi inte helt överge PayPal eftersom vissa kunder bara har PayPal som betalningsalternativ. Som en kund sa på vår [statussida](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal är mitt enda betalningsalternativ

Vi har fastnat med att stödja en trasig plattform eftersom PayPal har skapat ett betalningsmonopol för vissa användare.

## Lösningen för communityn {#the-community-workaround}

Eftersom PayPal inte tillhandahåller grundläggande funktioner för prenumerationslistning har utvecklarcommunityn skapat lösningar. Vi skapade ett skript som hjälper till att hantera PayPal-prenumerationer: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Det här skriptet refererar till en [gemenskapskärnan](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) där utvecklare delar lösningar. Användare är faktiskt [tackar oss](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) för att de tillhandahåller det som PayPal borde ha byggt för flera år sedan.

## Blockerar PayPal-mallar på grund av nätfiske {#blocking-paypal-templates-due-to-phishing}

Problemen går bortom API:erna. PayPals e-postmallar är så dåligt utformade att vi var tvungna att implementera specifik filtrering i vår e-posttjänst eftersom de inte går att skilja från nätfiskeförsök.

### Det verkliga problemet: PayPals mallar ser ut som bedrägerier {#the-real-problem-paypals-templates-look-like-scams}

Vi får regelbundet rapporter om PayPal-mejl som ser exakt ut som nätfiskeförsök. Här är ett faktiskt exempel från våra rapporter om missbruk:

**Ämne:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Det här e-postmeddelandet vidarebefordrades till `abuse@microsoft.com` eftersom det verkade vara ett nätfiskeförsök. Problemet? Det kom faktiskt från PayPals sandbox-miljö, men deras malldesign är så dålig att den utlöser system för att upptäcka nätfiske.

### Vår implementering {#our-implementation}

Du kan se vår PayPal-specifika filtrering implementerad i vår [e-postfiltreringskod](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Varför vi var tvungna att blockera PayPal {#why-we-had-to-block-paypal}

Vi implementerade detta eftersom PayPal vägrade att åtgärda omfattande problem med spam/nätfiske/bedrägerier trots våra upprepade rapporter till deras team för missbruk. De specifika e-posttyper vi blockerar inkluderar:

* **RT000238** - Misstänkta fakturameddelanden
* **PPC001017** - Problematiska betalningsbekräftelser
* **RT000542** - Försök att hacka presentmeddelanden

### Problemets omfattning {#the-scale-of-the-problem}

Våra loggar för skräppostfiltrering visar den enorma mängden PayPal-fakturaskräppost som vi hanterar dagligen. Exempel på blockerade ämnen inkluderar:

* "Faktura från PayPals faktureringsteam: - Denna avgift kommer att debiteras automatiskt från ditt konto. Kontakta oss omedelbart på \[TELEFON]"
* "Faktura från \[FÖRETAGSNAMN] (\[ORDER-ID])"
* Flera varianter med olika telefonnummer och falska order-ID:n

Dessa e-postmeddelanden kommer ofta från `outlook.com`-värdar men verkar komma från PayPals legitima system, vilket gör dem särskilt farliga. E-postmeddelandena klarar SPF-, DKIM- och DMARC-autentisering eftersom de skickas via PayPals faktiska infrastruktur.

Våra tekniska loggar visar att dessa spam-mejl innehåller legitima PayPal-rubriker:

* `X-Email-Type-Id: RT000238` (samma ID som vi blockerar)
* `From: "service@paypal.com" <service@paypal.com>`
* Giltiga DKIM-signaturer från `paypal.com`
* Korrekta SPF-poster som visar PayPals e-postservrar

Detta skapar en omöjlig situation: legitima PayPal-mejl och skräppost har båda identiska tekniska egenskaper.

### Ironin {#the-irony}

PayPal, ett företag som borde leda kampen mot ekonomiskt bedrägeri, har e-postmallar som är så dåligt utformade att de utlöser anti-phishing-system. Vi tvingas blockera legitima PayPal-e-postmeddelanden eftersom de inte går att skilja från bedrägerier.

Detta är dokumenterat i säkerhetsforskning: [Se upp för PayPals nya adressbedrägerier](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - som visar hur PayPals egna system utnyttjas för bedrägerier.

### Verkliga effekter: Nya PayPal-bedrägerier {#real-world-impact-novel-paypal-scams}

Problemet sträcker sig bortom bara dålig malldesign. PayPals faktureringssystem är så lättutnyttjat att bedragare regelbundet missbrukar det för att skicka falska fakturor som ser legitima ut. Säkerhetsforskaren Gavin Anderegg dokumenterade [En ny PayPal-bluff](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) där bedragare skickar riktiga PayPal-fakturor som klarar alla autentiseringskontroller:

> "Vid en kontroll av källan såg det ut som att e-postmeddelandet faktiskt kom från PayPal (SPF, DKIM och DMARC godkändes alla). Knappen länkade också till vad som såg ut som en legitim PayPal-URL... Det tog en sekund innan jag insåg att det var ett legitimt e-postmeddelande. Jag hade precis fått en slumpmässig 'faktura' från en bedragare."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Skärmdump som visar flera falska PayPal-fakturor som översvämmar en inkorg, alla ser legitima ut eftersom de faktiskt kommer från PayPals system
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Forskaren noterade:

> "Det verkar också vara en bekvämlighetsfunktion som PayPal borde överväga att stänga av. Jag antog omedelbart att det här var någon form av bluff och var bara intresserad av de tekniska detaljerna. Det verkar alldeles för enkelt att genomföra, och jag oroar mig för att andra ska gå på det."

Detta illustrerar problemet perfekt: PayPals egna legitima system är så dåligt utformade att de möjliggör bedrägerier samtidigt som de får legitim kommunikation att se misstänksam ut.

För att göra saken värre påverkade detta vår leveransförmåga med Yahoo, vilket resulterade i kundklagomål och timmar av noggrann testning och mönsterkontroll.

## PayPals bakåtriktade KYC-process {#paypals-backwards-kyc-process}

En av de mest frustrerande aspekterna av PayPals plattform är deras bakvända tillvägagångssätt för efterlevnad och KYC-procedurer (Know Your Customer). Till skillnad från alla andra betalningsleverantörer tillåter PayPal utvecklare att integrera deras API:er och börja samla in betalningar i produktion innan de har slutfört korrekt verifiering.

### Så här ska det fungera {#how-it-should-work}

Varje legitim betalningsleverantör följer denna logiska sekvens:

1. **Slutför KYC-verifiering först**
2. **Godkänn handelskontot**
3. **Ge åtkomst till produktions-API**
4. **Tillåt betalningsinkasso**

Detta skyddar både betalningsbehandlaren och handlaren genom att säkerställa efterlevnad innan pengar byter ägare.

### Så fungerar PayPal egentligen {#how-paypal-actually-works}

PayPals process är helt omvänd:

1. **Ge omedelbar åtkomst till produktions-API**
2. **Tillåt betalningsinsamling i timmar eller dagar**
3. **Blockera plötsligt betalningar utan förvarning**
4. **Kräv KYC-dokumentation efter att kunder redan är drabbade**
5. **Ge ingen anmälan till handlaren**
6. **Låt kunderna upptäcka problemet och rapportera det**

### Den verkliga effekten {#the-real-world-impact}

Denna bakvända process skapar katastrofer för företag:

* **Kunder kan inte slutföra köp** under perioder med hög försäljningstakt**
* **Ingen förvarning** om att verifiering behövs
* **Inga e-postmeddelanden** när betalningar blockeras
* **Handlare får information om problem från förvirrade kunder**
* **Intäktsförlust** under kritiska affärsperioder
* **Kundförtroendet skadas** när betalningar mystiskt misslyckas

### Kontomigreringskatastrofen i juli 2025 {#the-july-2025-account-migration-disaster}

Exakt detta scenario utspelade sig under vår rutinmässiga kontomigrering i juli 2025. PayPal tillät betalningar att fungera initialt, men blockerade dem sedan plötsligt utan någon förvarning. Vi upptäckte problemet först när kunder började rapportera att de inte kunde betala.

När vi kontaktade supporten fick vi motstridiga svar om vilken dokumentation som behövdes, utan någon tydlig tidslinje för lösning. Detta tvingade oss att helt stoppa PayPal-betalningar, vilket förvirrade kunder som inte hade några andra betalningsalternativ.

### Varför detta är viktigt {#why-this-matters}

PayPals tillvägagångssätt för efterlevnad visar på ett grundläggande missförstånd om hur företag fungerar. Korrekt KYC bör ske **före** produktionsintegration, inte efter att kunderna redan har försökt betala. Bristen på proaktiv kommunikation när problem uppstår visar på PayPals brist på förståelse för handlarnas behov.

Denna bakåtriktade process är symptomatisk för PayPals bredare organisatoriska problem: de prioriterar sina interna processer framför handlarnas och kundupplevelsen, vilket leder till den typ av operativa katastrofer som driver företag bort från deras plattform.

## Hur alla andra betalningsbehandlare gör det rätt {#how-every-other-payment-processor-does-it-right}

Funktionen för prenumerationslistning som PayPal vägrar att implementera har varit standard i branschen i över ett decennium. Så här hanterar andra betalningsleverantörer detta grundläggande krav:

### Rand {#stripe}

Stripe har haft prenumerationslistor sedan deras API lanserades. Deras dokumentation visar tydligt hur man hämtar alla prenumerationer för ett kund- eller handelskonto. Detta anses vara grundläggande CRUD-funktionalitet.

### Paddel {#paddle}

Paddle erbjuder omfattande API:er för prenumerationshantering, inklusive listning, filtrering och paginering. De förstår att handlare behöver se sina återkommande intäktsströmmar.

### Coinbase Commerce {#coinbase-commerce}

Även kryptovalutabetalningsleverantörer som Coinbase Commerce erbjuder bättre prenumerationshantering än PayPal.

### Kvadrat {#square}

Squares API inkluderar prenumerationslistning som en grundläggande funktion, inte en eftertanke.

### Branschstandarden {#the-industry-standard}

Varje modern betalningsleverantör erbjuder:

* Lista alla prenumerationer
* Filtrera efter status, datum, kund
* Sidnumrering för stora datamängder
* Webhook-meddelanden för prenumerationsändringar
* Omfattande dokumentation med fungerande exempel

### Vad andra betalningsleverantörer erbjuder jämfört med PayPal {#what-other-processors-provide-vs-paypal}

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

**Rand - Filtrera efter kund:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Rand - Filtrera efter status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Vad du faktiskt får:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPals tillgängliga slutpunkter:**

* `POST /v1/billing/subscriptions` - Skapa en prenumeration
* `GET /v1/billing/subscriptions/{id}` - Skaffa EN prenumeration (om du vet ID:t)
* `PATCH /v1/billing/subscriptions/{id}` - Uppdatera en prenumeration
* `POST /v1/billing/subscriptions/{id}/cancel` - Avsluta prenumerationen
* `POST /v1/billing/subscriptions/{id}/suspend` - Pausa prenumerationen

**Vad saknas från PayPal:**

* ❌ Ingen `GET /v1/billing/subscriptions` (lista alla)
* ❌ Ingen sökfunktion
* ❌ Ingen filtrering efter status, kund, datum
* ❌ Inget stöd för paginering

PayPal är den enda större betalningsleverantören som tvingar utvecklare att manuellt spåra prenumerations-ID:n i sina egna databaser.

## PayPals systematiska mörkläggning: Tystnad av 6 miljoner röster {#paypals-systematic-cover-up-silencing-6-million-voices}

I ett drag som perfekt sammanfattar PayPals sätt att hantera kritik, tog de nyligen hela sitt communityforum offline, vilket effektivt tystade över 6 miljoner medlemmar och raderade hundratusentals inlägg som dokumenterade deras misslyckanden.

### Den stora utraderingen {#the-great-erasure}

Den ursprungliga PayPal-communityn på `paypal-community.com` hade **6 003 558 medlemmar** och innehöll hundratusentals inlägg, felrapporter, klagomål och diskussioner om PayPals API-fel. Detta representerade över ett decennium av dokumenterade bevis på PayPals systematiska problem.

Den 30 juni 2025 tog PayPal i tysthet hela forumet offline. Alla `paypal-community.com`-länkar returnerar nu 404-fel. Detta var inte en migrering eller uppgradering.

### Räddningstjänst från tredje part {#the-third-party-rescue}

Lyckligtvis har en tredjepartstjänst på [ppl.lithium.com](https://ppl.lithium.com/) bevarat en del av innehållet, vilket gör att vi kan komma åt diskussionerna som PayPal försökte dölja. Denna tredjepartsbevaring är dock ofullständig och kan försvinna när som helst.

Detta mönster att dölja bevis är inte nytt för PayPal. De har en dokumenterad historia av:

* Ta bort kritiska felrapporter från allmänheten
* Avsluta utvecklingsverktyg utan föregående meddelande
* Ändra API:er utan korrekt dokumentation
* Tysta diskussioner i communityn om deras brister

Nedtagningen av forumet representerar det mest fräcka försöket hittills att dölja deras systematiska misslyckanden från offentlig granskning.

## Den 11 år långa katastrofen med Capture-buggar: 1 899 dollar och vi fortsätter {#the-11-year-capture-bug-disaster-1899-and-counting}

Medan PayPal var upptagna med att organisera feedbacksessioner och ge löften, har deras grundläggande betalningssystem varit fundamentalt trasigt i över 11 år. Bevisen är förödande.

### Vidarebefordra e-postmeddelandets förlust på 1 899 USD {#forward-emails-1899-loss}

I våra produktionssystem upptäckte vi 108 PayPal-betalningar på totalt **1 899 USD** som förlorades på grund av PayPals insamlingsfel. Dessa betalningar visar ett konsekvent mönster:

* `CHECKOUT.ORDER.APPROVED` webhooks mottogs
* PayPals API för insamling returnerade 404-fel
* Beställningar blev oåtkomliga via PayPals API

Det är omöjligt att avgöra om kunder debiterades eftersom PayPal helt döljer felsökningsloggar efter 14 dagar och raderar all data från instrumentpanelen för order-ID:n som inte registrerades.

Detta representerar bara en verksamhet. **De samlade förlusterna för tusentals handlare under 11+ år uppgår sannolikt till miljontals dollar.**

**Vi upprepar det: de samlade förlusterna för tusentals handlare under 11+ år uppgår sannolikt till miljontals dollar.**

Den enda anledningen till att vi upptäckte detta är att vi är otroligt noggranna och datadrivna.

### Ursprunglig rapport från 2013: 11+ år av försummelse {#the-2013-original-report-11-years-of-negligence}

Den tidigaste dokumenterade rapporten om just detta problem finns på [Stack Overflow i november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkiverad](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Får 404-felmeddelandet med Rest API när en inspelning görs"

Felet som rapporterades 2013 är **identiskt** med vad Vidarebefordra e-post upplevde 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Samhällets reaktioner 2013 var talande:

> "Det finns ett rapporterat problem med REST API just nu. PayPal arbetar med det."

**11+ år senare, de "jobbar fortfarande på det".**

### 2016 års erkännande: PayPal bryter mot sitt eget SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

År 2016 dokumenterade PayPals eget GitHub-arkiv att [massiva misslyckanden med att fånga in](https://github.com/paypal/PayPal-PHP-SDK/issues/660) påverkade deras officiella PHP SDK. Omfattningen var häpnadsväckande:

> "Sedan 2016-09-20 har alla PayPal-insamlingsförsök misslyckats med 'INVALID_RESOURCE_ID - Begärt resurs-ID hittades inte.'. Ingenting ändrades mellan 19/9 och 20/9 i API-integrationen. **100 % av insamlingsförsöken sedan 20/9 har returnerat detta fel.**"

En handlare rapporterade:

> "Jag har haft **över 1 400 misslyckade infångningsförsök under de senaste 24 timmarna**, alla med felsvaret INVALID_RESOURCE_ID."

PayPals första svar var att skylla på handlaren och hänvisa dem till teknisk support. Först efter massiva påtryckningar erkände de fel:

> "Jag har en uppdatering från våra produktutvecklare. De märker i rubrikerna som skickas att PayPal-förfrågan-ID skickas med 42 tecken, men **det verkar som att en nyligen genomförd ändring har skett som begränsar detta ID till bara 38 tecken.**"

Detta medgivande avslöjar PayPals systematiska försummelse:

1. **De gjorde odokumenterade, felaktiga ändringar**
2. **De förstörde sitt eget officiella SDK**
3. **De skyllde först på handlarna**
4. **De erkände bara fel under press**

Även efter att ha "åtgärdat" problemet rapporterade handlarna:

> "Uppgraderade SDK:et till v1.7.4 och **problemet kvarstår.**"

### Eskaleringen 2024: Fortfarande trasig {#the-2024-escalation-still-broken}

Nyligen publicerade rapporter från den bevarade PayPal-communityn visar att problemet faktiskt har förvärrats. En [Diskussion i september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkiverad](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumenterar exakt samma problem:

> "Problemet började bara uppstå för ungefär två veckor sedan och påverkar inte alla beställningar. **Det mycket vanligare problemet verkar vara 404-fel vid insamling.**"

Handlaren beskriver samma mönster som Vidarebefordra e-post upplevde:

> "Efter att ha försökt hämta beställningen returnerar PayPal ett 404-fel. Vid hämtning av orderuppgifter: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Detta är utan spår av en lyckad inspelning från vår sida.**"

### Webhookens tillförlitlighetskatastrof {#the-webhook-reliability-disaster}

En annan [bevarad samhällsdiskussion](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) avslöjar att PayPals webhook-system är fundamentalt opålitligt:

> "Teoretiskt sett borde den ha två händelser (CHECKOUT.ORDER.APPROVED och PAYMENT.CAPTURE.COMPLETED) från Webhook-händelsen. Egentligen tas dessa två händelser sällan emot omedelbart, PAYMENT.CAPTURE.COMPLETED kan oftast inte tas emot eller så tas det emot inom några timmar."

För prenumerationsbetalningar:

> "**'BETALNING.FÖRSÄLJNING.SLUTFÖRD' mottogs inte ibland eller förrän efter några timmar.**"

Handlarens frågor avslöjar omfattningen av PayPals tillförlitlighetsproblem:

1. **"Varför händer detta?"** - PayPals webhook-system är fundamentalt trasigt
2. **"Om orderstatusen är 'SLUTFÖRD', kan jag anta att jag har mottagit pengarna?"** - Handlare kan inte lita på PayPals API-svar
3. **"Varför kan 'Händelseloggar->Webhook-händelser' inte hitta några loggar?"** - Inte ens PayPals eget loggsystem fungerar

### Mönstret av systematisk försummelse {#the-pattern-of-systematic-negligence}

Bevisen sträcker sig över 11+ år och visar ett tydligt mönster:

* **2013**: "PayPal jobbar på det"
* **2016**: PayPal medger att ändringen är felaktig, men tillhandahåller en felaktig lösning
* **2024**: Samma fel uppstår fortfarande, vilket påverkar vidarebefordran av e-post och otaliga andra fel.

Detta är inte en bugg – **detta är systematisk försummelse.** PayPal har känt till dessa kritiska fel i betalningsbehandlingen i över ett decennium och har konsekvent:

1. **Skyllde handlare för PayPals buggar**
2. **Gjorde odokumenterade, dåliga ändringar**
3. **Tillhandahöll otillräckliga korrigeringar som inte fungerar**
4. **Ignorerade den ekonomiska påverkan på företag**
5. **Dolde bevis genom att ta ner communityforum**

### Det odokumenterade kravet {#the-undocumented-requirement}

Ingenstans i PayPals officiella dokumentation nämns det att handlare måste implementera återförsökslogik för insamlingsåtgärder. Deras dokumentation anger att handlare ska "insamla omedelbart efter godkännande", men nämner inte att deras API slumpmässigt returnerar 404-fel som kräver komplexa återförsöksmekanismer.

Detta tvingar varje handlare att:

* Implementera exponentiell backoff-återförsökslogik
* Hantera inkonsekvent webhook-leverans
* Bygg komplexa tillståndshanteringssystem
* Övervaka misslyckade infångningar manuellt

**Varje annan betalningsleverantör erbjuder pålitliga API:er för insamling av betalningar som fungerar första gången.**

## PayPals bredare mönster av bedrägeri {#paypals-broader-pattern-of-deception}

Katastrofen med infångningsbuggen är bara ett exempel på PayPals systematiska tillvägagångssätt för att lura kunder och dölja deras misslyckanden.

### Åtgärder från New York Department of Financial Services {#the-new-york-department-of-financial-services-action}

I januari 2025 utfärdade New York Department of Financial Services en [verkställighetsåtgärder mot PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)-förklaring för vilseledande metoder, vilket visar att PayPals bedrägerimönster sträcker sig långt bortom deras API:er.

Denna regleringsåtgärd visar PayPals villighet att använda vilseledande metoder i hela sin verksamhet, inte bara i sina utvecklarverktyg.

### Honungsrättegången: Omskrivning av affilialänkar {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals förvärv av Honey har resulterat i att [stämningar som påstår att Honey skriver om affiliate-länkar](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) stjäl provisioner från innehållsskapare och influencers. Detta representerar ytterligare en form av systematiskt bedrägeri där PayPal tjänar pengar genom att omdirigera intäkter som borde gå till andra.

Mönstret är tydligt:

1. **API-fel**: Dölj trasig funktionalitet, skyll på handlare
2. **Tystning av community**: Ta bort bevis på problem
3. **Regleringsöverträdelser**: Delta i vilseledande metoder
4. **Affiliate-stöld**: Stjäl provisioner genom teknisk manipulation

### Kostnaden för PayPals försumlighet {#the-cost-of-paypals-negligence}

Förlusten på 1 899 dollar för vidarebefordrade e-postmeddelanden representerar bara toppen av isberget. Tänk på den bredare effekten:

* **Enskilda handlare**: Tusentals förlorar hundratals till tusentals dollar var
* **Företagskunder**: Potentiellt miljontals i förlorade intäkter
* **Utvecklartid**: Oräkneliga timmar på att bygga lösningar för PayPals trasiga API:er
* **Kundförtroende**: Företag förlorar kunder på grund av PayPals betalningsmisslyckanden

Om en liten e-posttjänst förlorade nästan 2 000 dollar, och detta problem har funnits i över 11 år och drabbat tusentals handlare, uppgår den sammanlagda ekonomiska skadan sannolikt till **hundratals miljoner dollar**.

### Dokumentationslögnen {#the-documentation-lie}

PayPals officiella dokumentation nämner konsekvent inte de kritiska begränsningar och buggar som handlare kan stöta på. Till exempel:

* **Capture API**: Inget omnämnande av att 404-fel är vanliga och kräver logik för återförsök
* **Webhooks tillförlitlighet**: Inget omnämnande av att webhooks ofta är försenade med timmar
* **Prenumerationslistning**: Dokumentationen antyder att listning är möjlig när ingen slutpunkt finns
* **Sessionstimeouts**: Inget omnämnande av aggressiva 60-sekunders timeouts

Denna systematiska utelämnande av kritisk information tvingar handlare att upptäcka PayPals begränsningar genom trial and error i produktionssystem, vilket ofta resulterar i ekonomiska förluster.

## Vad detta innebär för utvecklare {#what-this-means-for-developers}

PayPals systematiska misslyckande med att tillgodose grundläggande utvecklares behov samtidigt som de samlar in omfattande feedback visar på ett grundläggande organisatoriskt problem. De behandlar feedbackinsamling som en ersättning för att faktiskt åtgärda problem.

Mönstret är tydligt:

1. Utvecklare rapporterar problem
2. PayPal organiserar feedbacksessioner med chefer
3. Omfattande feedback ges
4. Team erkänner brister och lovar att "spåra och åtgärda"
5. Ingenting implementeras
6. Chefer slutar för bättre företag
7. Nya team ber om samma feedback
8. Cykelupprepningar

Samtidigt tvingas utvecklare bygga lösningar, äventyra säkerheten och hantera trasiga användargränssnitt bara för att acceptera betalningar.

Om du bygger ett betalningssystem, lär dig av vår erfarenhet: bygg din [trifecta-metoden](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) med flera processorer, men förvänta dig inte att PayPal tillhandahåller den grundläggande funktionalitet du behöver. Planera att bygga lösningar från dag ett.

> Det här inlägget dokumenterar vår 11-åriga erfarenhet av PayPals API:er för vidarebefordran av e-post. Alla kodexempel och länkar kommer från våra faktiska produktionssystem. Vi fortsätter att stödja PayPal-betalningar trots dessa problem eftersom vissa kunder inte har något annat alternativ.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />