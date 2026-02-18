# Databehandlingsavtal {#data-processing-agreement}

<!-- v1.0 från <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Viktiga termer](#key-terms)
* [Ändringar i avtalet](#changes-to-the-agreement)
* [1. Relationer mellan personuppgiftsbehandlare och underpersonuppgiftsbehandlare](#1-processor-and-subprocessor-relationships)
  * [1. Leverantör som personuppgiftsbehandlare](#1-provider-as-processor)
  * [2. Leverantör som underbiträde](#2-provider-as-subprocessor)
* [2. Bearbetning](#2-processing)
  * [1. Bearbetningsuppgifter](#1-processing-details)
  * [2. Bearbetningsinstruktioner](#2-processing-instructions)
  * [3. Behandling av leverantören](#3-processing-by-provider)
  * [4. Kundhantering](#4-customer-processing)
  * [5. Samtycke till behandling](#5-consent-to-processing)
  * [6. Underbiträden](#6-subprocessors)
* [3. Begränsade överföringar](#3-restricted-transfers)
  * [1. Auktorisering](#1-authorization)
  * [2. Överföringar utanför EES](#2-ex-eea-transfers)
  * [3. Överföringar utanför Storbritannien](#3-ex-uk-transfers)
  * [4. Andra internationella överföringar](#4-other-international-transfers)
* [4. Svar på säkerhetsincidenter](#4-security-incident-response)
* [5. Revision och rapporter](#5-audit--reports)
  * [1. Revisionsrättigheter](#1-audit-rights)
  * [2. Säkerhetsrapporter](#2-security-reports)
  * [3. Säkerhetskontroll](#3-security-due-diligence)
* [6. Samordning och samarbete](#6-coordination--cooperation)
  * [1. Svar på förfrågningar](#1-response-to-inquiries)
  * [2. DPIA och DTIA](#2-dpias-and-dtias)
* [7. Radering av kundens personuppgifter](#7-deletion-of-customer-personal-data)
  * [1. Borttagning av kund](#1-deletion-by-customer)
  * [2. Radering vid dataskyddsavtalets utgång](#2-deletion-at-dpa-expiration)
* [8. Ansvarsbegränsning](#8-limitation-of-liability)
  * [1. Ansvarstak och avstående från skadestånd](#1-liability-caps-and-damages-waiver)
  * [2. Krav från närstående parter](#2-related-party-claims)
  * [3. Undantag](#3-exceptions)
* [9. Konflikter mellan dokument](#9-conflicts-between-documents)
* [10. Avtalstid](#10-term-of-agreement)
* [11. Tillämplig lag och valda domstolar](#11-governing-law-and-chosen-courts)
* [12. Relation mellan tjänsteleverantörer](#12-service-provider-relationship)
* [13. Definitioner](#13-definitions)
* [Krediter](#credits)

## Viktiga termer {#key-terms}

| Kalla | Värde |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Avtal** | Detta dataskyddsavtal kompletterar [Terms of Service](/terms) |
| Godkända underleverantörer | [Cloudflare](https://cloudflare.com) (USA; DNS-, nätverks- och säkerhetsleverantör), [DataPacket](https://www.datapacket.com/) (USA/Storbritannien; webbhotellsleverantör), [Digital Ocean](https://digitalocean.com) (USA; webbhotellsleverantör), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (USA; webbhotellsleverantör), [Stripe](https://stripe.com) (USA; betalningsleverantör), [PayPal](https://paypal.com) (USA; betalningsleverantör) |
| <strong>Kontaktperson för leverantörssäkerhet</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| Säkerhetspolicy | Visa [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| **Styrande stat** | Delstaten Delaware, USA |

## Ändringar i avtalet {#changes-to-the-agreement}

Detta dokument är en derivation av [Vanliga standardvillkor för dataskyddsavtal (version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) och följande ändringar har gjorts:

1. [Tillämplig lag och valda domstolar](#11-governing-law-and-chosen-courts) har inkluderats som ett avsnitt nedan, med `Governing State` identifierad ovan.

2. [Relation till tjänsteleverantör](#12-service-provider-relationship) har inkluderats som ett avsnitt nedan.

## 1. Relationer mellan processorer och underprocessorer {#1-processor-and-subprocessor-relationships}

### 1. Leverantör som personuppgiftsbehandlare {#1-provider-as-processor}

I situationer där **Kunden** är registeransvarig för kundens personuppgifter, kommer **Leverantören** att anses vara en personuppgiftsbiträde som behandlar personuppgifter för **Kundens** räkning.

### 2. Leverantör som underleverantör {#2-provider-as-subprocessor}

I situationer där **Kunden** är personuppgiftsbehandlare för kundens personuppgifter, kommer **Leverantören** att anses vara underpersonuppgiftsbehandlare för kundens personuppgifter.

## 2. Bearbetning av {#2-processing}

### 1. Bearbetningsdetaljer {#1-processing-details}

Bilaga I(B) på försättsbladet beskriver föremålet för, arten, syftet och varaktigheten av denna behandling, samt de **kategorier av personuppgifter** som samlas in och de **kategorier av registrerade**.

### 2. Bearbetningsinstruktioner {#2-processing-instructions}

Kunden instruerar Leverantören att Behandla Kundens Personuppgifter: (a) för att tillhandahålla och underhålla Tjänsten; (b) enligt vad som kan specificeras ytterligare genom Kundens användning av Tjänsten; (c) enligt vad som dokumenteras i Avtalet; och (d) enligt andra skriftliga instruktioner som givits av Kunden och bekräftats av Leverantören om Behandling av Kundens Personuppgifter enligt detta DPA. Leverantören ska följa dessa instruktioner om inte tillämplig lag förbjuder det. Leverantören ska omedelbart informera Kunden om denne inte kan följa Behandlingsinstruktionerna. Kunden har gett och kommer endast att ge instruktioner som överensstämmer med tillämplig lag.

### 3. Bearbetning av leverantör {#3-processing-by-provider}

Leverantören kommer endast att behandla kundens personuppgifter i enlighet med detta databehandlingsavtal, inklusive informationen på försättsbladet. Om Leverantören uppdaterar Tjänsten för att uppdatera befintliga eller inkludera nya produkter, funktioner eller funktionalitet, kan Leverantören ändra <strong>Kategorier av registrerade</strong>, <strong>Kategorier av personuppgifter</strong>, <strong>Särskild kategori av uppgifter</strong>, <strong>Begränsningar eller skyddsåtgärder för särskild kategori av uppgifter</strong>, <strong>Överfrågningsfrekvens</strong>, <strong>Behandlingens art och syfte</strong> och <strong>Behandlingens varaktighet</strong> efter behov för att återspegla uppdateringarna genom att meddela Kunden om uppdateringarna och ändringarna.

### 4. Kundbearbetning {#4-customer-processing}

Om <strong>Kunden</strong> är ett personuppgiftsbehandlare och <strong>Leverantören</strong> är ett underpersonuppgiftsbehandlare, ska <strong>Kunden</strong> följa alla tillämpliga lagar som gäller för <strong>Kundens</strong> behandling av kundens personuppgifter. <strong>Kundens</strong> avtal med sin personuppgiftsbehandlare kommer på liknande sätt att kräva att <strong>Kunden</strong> följer alla tillämpliga lagar som gäller för <strong>Kunden</strong> som personuppgiftsbehandlare. Dessutom ska <strong>Kunden</strong> följa kraven för underpersonuppgiftsbehandlare i <strong>Kundens</strong> avtal med sin personuppgiftsbehandlare.

### 5. Samtycke till behandling {#5-consent-to-processing}

Kunden har följt och kommer att fortsätta att följa alla tillämpliga dataskyddslagar avseende tillhandahållandet av kundens personuppgifter till Leverantören och/eller Tjänsten, inklusive att göra alla upplysningar, inhämta alla samtycken, tillhandahålla lämpliga valmöjligheter och implementera relevanta skyddsåtgärder som krävs enligt tillämpliga dataskyddslagar.

### 6. Underprocessorer {#6-subprocessors}

a. Leverantören kommer inte att tillhandahålla, överföra eller överlämna några kundpersonuppgifter till en underbiträde om inte Kunden har godkänt underbiträdet. Den nuvarande listan över Godkända underbiträden inkluderar underbiträdenas identiteter, deras land och deras förväntade behandlingsuppgifter. Leverantören kommer att informera Kunden minst 10 arbetsdagar i förväg och skriftligen om eventuella planerade ändringar av Godkända underbiträden, oavsett om det sker genom tillägg eller ersättning av en underbiträde, vilket ger Kunden tillräckligt med tid att invända mot ändringarna innan Leverantören börjar använda den/de nya underbiträdena. Leverantören kommer att ge Kunden den information som krävs för att Kunden ska kunna utöva sin rätt att invända mot ändringen av Godkända underbiträden. Kunden har 30 dagar efter meddelande om en ändring av de godkända underleverantörerna att invända, annars anses Kunden ha accepterat ändringarna. Om Kunden invänder mot ändringen inom 30 dagar efter meddelandet ska Kunden och Leverantören samarbeta i god tro för att lösa Kundens invändning eller farhåga.

b. Vid anlitande av en underleverantör ska Leverantören ha ett skriftligt avtal med underleverantören som säkerställer att underleverantören endast får åtkomst till och använder Kundens personuppgifter (i) i den utsträckning som krävs för att fullgöra de skyldigheter som avtalats med underleverantören, och (ii) i enlighet med villkoren i <strong>avtalet</strong>.

c. Om GDPR gäller för behandling av kunders personuppgifter, (i) åläggs även underbiträdet de dataskyddsskyldigheter som beskrivs i detta dataskyddsavtal (enligt artikel 28(3) i GDPR, om tillämpligt), och (ii) Leverantörens avtal med underbiträdet ska innefatta dessa skyldigheter, inklusive detaljer om hur Leverantören och dess underbiträde ska samordna för att svara på förfrågningar eller begäranden om behandling av kunders personuppgifter. Dessutom ska Leverantören, på Kundens begäran, dela en kopia av sina avtal (inklusive eventuella ändringar) med sina underbiträden. I den utsträckning det är nödvändigt för att skydda affärshemligheter eller annan konfidentiell information, inklusive personuppgifter, kan Leverantören redigera texten i sitt avtal med sin underbiträde innan en kopia delas.

d. <strong>Leverantören</strong> förblir fullt ansvarig för alla skyldigheter som läggs ut på sina underleverantörer, inklusive handlingar och underlåtenheter från sina underleverantörer vid behandling av kunders personuppgifter. <strong>Leverantören</strong> ska meddela Kunden om sina underleverantörer underlåter att uppfylla en väsentlig skyldighet gällande kunders personuppgifter enligt avtalet mellan <strong>Leverantören</strong> och underleverantören.

## 3. Begränsade överföringar {#3-restricted-transfers}

### 1. Auktorisering {#1-authorization}

Kunden samtycker till att Leverantören får överföra Kundens Personuppgifter utanför EES, Storbritannien eller annat relevant geografiskt territorium i den utsträckning det är nödvändigt för att tillhandahålla Tjänsten. Om Leverantören överför Kundens Personuppgifter till ett territorium för vilket Europeiska kommissionen eller annan relevant tillsynsmyndighet inte har utfärdat ett beslut om adekvat skyddsnivå, ska Leverantören genomföra lämpliga skyddsåtgärder för överföring av Kundens Personuppgifter till det territoriet i enlighet med tillämpliga dataskyddslagar.

### 2. Överföringar utanför EES {#2-ex-eea-transfers}

Kunden och Leverantören är överens om att om GDPR skyddar överföring av Kundens Personuppgifter, överföringen sker från Kunden inom EES till Leverantören utanför EES, och överföringen inte regleras av ett beslut om adekvat skydd av säkerheten fattat av Europeiska kommissionen, så anses Kunden och Leverantören, genom att ingå detta DPA, ha undertecknat EES-standardkontraktsklausulerna och deras bilagor, vilka införlivas genom hänvisning. Varje sådan överföring görs i enlighet med EES-standardkontraktsklausulerna, vilka är ifyllda enligt följande:

a. Modul två (personuppgiftsansvarig till personuppgiftsbiträde) i EES-standardkontraktets villkor gäller när **Kunden** är personuppgiftsansvarig och **Leverantören** behandlar kundens personuppgifter för **Kunden** i egenskap av personuppgiftsbiträde.

b. Modul tre (Personuppgiftsbiträde till underpersonuppgiftsbiträde) i EES-standardkontraktets villkor gäller när **Kunden** är personuppgiftsbiträde och **Leverantören** behandlar kundens personuppgifter för **Kundens** räkning som underpersonuppgiftsbiträde.

c. För varje modul gäller följande (i förekommande fall):

1. Den valfria dockningsklausulen i klausul 7 gäller inte;

2. I klausul 9 gäller alternativ 2 (allmän skriftlig fullmakt), och den kortaste tidsperioden för förhandsmeddelande om ändringar av underleverantörer är 10 arbetsdagar;

3. I klausul 11 gäller inte den valfria formuleringen;

4. Alla hakparenteser i klausul 13 tas bort;

5. I klausul 17 (alternativ 1) ska EES-standardkontraktskolor regleras av lagarna i den **styrande medlemsstaten**;

6. I klausul 18(b) ska tvister avgöras i domstolarna i den **styrande medlemsstaten**; och

7. Försättsbladet till detta dataskyddsavtal innehåller den information som krävs i bilaga I, bilaga II och bilaga III till EES-standardkontraktsklausulerna.

### 3. Överföringar utanför Storbritannien {#3-ex-uk-transfers}

Kunden och Leverantören är överens om att om den brittiska GDPR skyddar överföringen av kundens personuppgifter, överföringen sker från Kunden inom Storbritannien till Leverantören utanför Storbritannien, och överföringen inte regleras av ett beslut om adekvat skydd av personuppgifter fattat av Storbritanniens utrikesminister, så anses Kunden och Leverantören, genom att ingå detta DPA, ha undertecknat det brittiska tillägget och dess bilagor, vilka införlivas genom hänvisning. Varje sådan överföring görs i enlighet med det brittiska tillägget, som är ifyllt enligt följande:

a. Avsnitt 3.2 i detta databearbetningsavtal innehåller den information som krävs i tabell 2 i det brittiska tillägget.

b. Tabell 4 i det brittiska tillägget ändras enligt följande: Ingen av parterna får säga upp det brittiska tillägget enligt avsnitt 19 i det brittiska tillägget; i den utsträckning ICO utfärdar ett reviderat godkänt tillägg enligt avsnitt ‎18 i det brittiska tillägget, ska parterna i god tro arbeta för att revidera detta dataskyddsavtal i enlighet därmed.

c. Försättsbladet innehåller den information som krävs enligt bilaga 1A, bilaga 1B, bilaga II och bilaga III till det brittiska tillägget.

### 4. Andra internationella överföringar {#4-other-international-transfers}

För överföringar av personuppgifter där schweizisk lag (och inte lagen i någon EES-medlemsstat eller Storbritannien) gäller för överföringens internationella karaktär, ändras hänvisningar till GDPR i klausul 4 i EES-standardkontraktsklausulerna, i den utsträckning det är lagligt krävs, för att istället hänvisa till den schweiziska federala dataskyddslagen eller dess efterföljare, och begreppet tillsynsmyndighet kommer att inkludera den schweiziska federala dataskydds- och informationskommissionären.

## 4. Svar på säkerhetsincidenter {#4-security-incident-response}

1. När Leverantören blir medveten om en säkerhetsincident ska denne: (a) meddela Kunden utan onödigt dröjsmål när så är möjligt, men senast 72 timmar efter att ha blivit medveten om säkerhetsincidenten; (b) tillhandahålla information om säkerhetsincidenten i rätt tid så snart den blir känd eller som Kunden rimligen begär; och (c) omedelbart vidta rimliga åtgärder för att begränsa och utreda säkerhetsincidenten. Leverantörens anmälan av eller svar på en säkerhetsincident enligt detta dataskyddsavtal ska inte tolkas som ett erkännande från Leverantörens sida av något fel eller ansvar för säkerhetsincidenten.

## 5. Granskning och rapporter {#5-audit--reports}

### 1. Granskningsrättigheter {#1-audit-rights}

Leverantören ska ge Kunden all information som rimligen är nödvändig för att visa att Leverantören följer detta DPA och Leverantören ska tillåta och bidra till revisioner, inklusive inspektioner av Kunden, för att bedöma Leverantörens efterlevnad av detta DPA. Leverantören kan dock begränsa åtkomsten till data eller information om Kundens åtkomst till informationen negativt skulle påverka Leverantörens immateriella rättigheter, sekretessskyldigheter eller andra skyldigheter enligt tillämplig lag. Kunden bekräftar och samtycker till att den endast kommer att utöva sina revisionsrättigheter enligt detta DPA och eventuella revisionsrättigheter som beviljas av tillämplig dataskyddslag genom att instruera Leverantören att följa rapporterings- och due diligence-kraven nedan. Leverantören ska behålla register över sin efterlevnad av detta DPA i 3 år efter att DPA upphör.

### 2. Säkerhetsrapporter {#2-security-reports}

Kunden bekräftar att Leverantören regelbundet granskas av oberoende tredjepartsrevisorer mot de standarder som definieras i Säkerhetspolicyn. På skriftlig begäran ska Leverantören, konfidentiellt, ge Kunden en sammanfattande kopia av sin då aktuella rapport så att Kunden kan verifiera Leverantörens efterlevnad av de standarder som definieras i Säkerhetspolicyn.

### 3. Säkerhetskontroll {#3-security-due-diligence}

Utöver rapporten kommer Leverantören att svara på rimliga begäranden om information från Kunden för att bekräfta Leverantörens efterlevnad av detta DPA, inklusive svar på frågeformulär om informationssäkerhet, due diligence och revision, eller genom att ge ytterligare information om sitt informationssäkerhetsprogram. Alla sådana begäranden måste vara skriftliga och göras till Leverantörens säkerhetskontakt och får endast göras en gång om året.

## 6. Samordning och samarbete {#6-coordination--cooperation}

### 1. Svar på förfrågningar {#1-response-to-inquiries}

Om Leverantören får någon förfrågan eller begäran från någon annan om behandling av kundens personuppgifter, kommer Leverantören att meddela Kunden om begäran och Leverantören kommer inte att svara på begäran utan Kundens föregående samtycke. Exempel på dessa typer av förfrågningar och begäranden inkluderar ett rättsligt, administrativt eller tillsynsmyndighetsbeslut om Kundens personuppgifter där det inte är förbjudet enligt tillämplig lag att meddela Kunden, eller en begäran från en registrerad. Om det är tillåtet enligt tillämplig lag, kommer Leverantören att följa Kundens rimliga instruktioner om dessa förfrågningar, inklusive att tillhandahålla statusuppdateringar och annan information som Kunden rimligen begär. Om en registrerad person gör en giltig begäran enligt tillämpliga dataskyddslagar om att radera eller välja bort att Kunden lämnar Kundens Personuppgifter till Leverantören, kommer Leverantören att bistå Kunden med att uppfylla begäran i enlighet med tillämplig dataskyddslag. Leverantören ska samarbeta med och ge rimligt bistånd till Kunden, på Kundens bekostnad, i alla rättsliga åtgärder eller andra processuella åtgärder som Kunden vidtar som svar på en begäran från tredje part om Leverantörens behandling av Kundens Personuppgifter enligt detta DPA.

### 2. DPIA och DTIA {#2-dpias-and-dtias}

Om det krävs enligt tillämpliga dataskyddslagar ska Leverantören rimligen bistå Kunden med att genomföra obligatoriska konsekvensbedömningar avseende dataskydd eller konsekvensbedömningar avseende dataöverföring och samråd med relevanta dataskyddsmyndigheter, med beaktande av behandlingens art och Kundens personuppgifter.

## 7. Radering av kundpersonuppgifter {#7-deletion-of-customer-personal-data}

### 1. Borttagning av kund {#1-deletion-by-customer}

Leverantören kommer att göra det möjligt för kunden att radera kundens personuppgifter på ett sätt som överensstämmer med tjänsternas funktionalitet. Leverantören kommer att följa denna instruktion så snart som det är rimligen möjligt, förutom i de fall där ytterligare lagring av kundens personuppgifter krävs enligt tillämplig lag.

### 2. Borttagning vid DPA-utgång {#2-deletion-at-dpa-expiration}

a. Efter att dataskyddsavtalet löper ut kommer Leverantören att återlämna eller radera Kundens Personuppgifter på Kundens instruktioner, såvida inte ytterligare lagring av Kundens Personuppgifter krävs eller är godkänt enligt tillämplig lag. Om återlämnande eller förstöring är ogenomförbart eller förbjudet enligt tillämplig lag kommer Leverantören att vidta rimliga åtgärder för att förhindra ytterligare Behandling av Kundens Personuppgifter och fortsätta att skydda de Kundens Personuppgifter som finns kvar i Leverantörens besittning, förvar eller kontroll. Till exempel kan tillämplig lag kräva att Leverantören fortsätter att lagra eller behandla Kundens Personuppgifter.

b. Om **Kunden** och **Leverantören** har ingått EES-standardkontraktsklausulerna eller det brittiska tillägget som en del av detta dataskyddsavtal, kommer **Leverantören** endast att ge **Kunden** det intyg om radering av personuppgifter som beskrivs i klausul 8.1(d) och klausul 8.5 i EES-standardkontraktsklausulerna om **Kunden** begär ett sådant.

## 8. Ansvarsbegränsning {#8-limitation-of-liability}

### 1. Ansvarstak och avstående från skadestånd {#1-liability-caps-and-damages-waiver}

**I den utsträckning det är tillåtet enligt tillämpliga dataskyddslagar, ska varje parts totala kumulativa ansvar gentemot den andra parten som uppstår på grund av eller i samband med detta dataskyddsavtal vara föremål för de avståenden, undantag och ansvarsbegränsningar som anges i **Avtalet**.**

### 2. Anspråk från närstående parter {#2-related-party-claims}

**Eventuella krav som riktas mot **Leverantören** eller dess dotterbolag som härrör från eller är relaterade till detta dataskyddsavtal får endast framföras av den **Kund**-enhet som är part i **Avtalet**.**

### 3. Undantag {#3-exceptions}

1. Detta dataskyddsavtal begränsar inte något ansvar för en enskild person avseende dennes rättigheter till dataskydd enligt tillämplig dataskyddslag. Dessutom begränsar detta dataskyddsavtal inte något ansvar mellan parterna för brott mot EES-standardkontraktsklausulerna eller brittiskt tillägg.

## 9. Konflikter mellan dokument {#9-conflicts-between-documents}

1. Detta dataskyddsavtal utgör en del av och kompletterar avtalet. Om det finns någon inkonsekvens mellan detta dataskyddsavtal, **avtalet** eller någon av deras delar, ska den del som anges tidigare ha företräde framför den del som anges senare för den inkonsekvensen: (1) EES-standardkontraktsklausulerna eller tillägget till Storbritannien, (2) detta dataskyddsavtal och sedan (3) **avtalet**.

## 10. Avtalsvillkor {#10-term-of-agreement}

Detta DPA (Data Procedure Procedure) träder i kraft när **Leverantören** och **Kunden** överenskommer om ett försättsblad för DPA:t och undertecknar eller elektroniskt accepterar **Avtalet** och fortsätter att gälla tills **Avtalet** löper ut eller upphör. **Leverantören** och **Kunden** ska dock fortsätta att omfattas av skyldigheterna i detta DPA och tillämpliga dataskyddslagar tills **Kunden** upphör att överföra Kundens Personuppgifter till **Leverantören** och **Leverantören** upphör att Behandla Kundens Personuppgifter.

## 11. Tillämplig lag och valda domstolar {#11-governing-law-and-chosen-courts}

Oaktat gällande lag eller liknande klausuler i **Avtalet** ska alla tolkningar och tvister gällande detta dataskyddsavtal regleras av lagarna i **Styrande staten** utan hänsyn till dess bestämmelser om lagkonflikter. Dessutom, och utan hinder av forumval, jurisdiktion eller liknande klausuler i **Avtalet**, samtycker parterna till att väcka talan, talan eller förfaranden gällande detta dataskyddsavtal i, och varje part underkastar sig oåterkalleligen domstolarnas exklusiva jurisdiktion.

## 12. Relation till tjänsteleverantör {#12-service-provider-relationship}

I den utsträckning California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq ("CCPA") är tillämplig, bekräftar och samtycker parterna till att Leverantören är en tjänsteleverantör och tar emot personuppgifter från Kunden för att tillhandahålla Tjänsten enligt överenskommelsen i Avtalet, vilket utgör ett affärssyfte. Leverantören kommer inte att sälja några personuppgifter som tillhandahålls av Kunden enligt Avtalet. Dessutom kommer Leverantören inte att behålla, använda eller lämna ut några personuppgifter som tillhandahålls av Kunden enligt Avtalet, förutom i den utsträckning det är nödvändigt för att tillhandahålla Tjänsten för Kunden, enligt vad som anges i Avtalet, eller enligt vad som är tillåtet enligt tillämpliga dataskyddslagar. Leverantören intygar att den förstår begränsningarna i detta stycke.

## 13. Definitioner {#13-definitions}

1. **"Tillämpliga lagar"** avser lagar, regler, förordningar, domstolsbeslut och andra bindande krav från en relevant myndighet som gäller för eller styr en part.

2. **"Tillämpliga dataskyddslagar"** avser de tillämpliga lagar som styr hur Tjänsten får behandla eller använda en individs personuppgifter, personuppgifter, personligt identifierbar information eller andra liknande termer.

3. **"Registreringsansvarig"** ska ha den/de betydelse(r) som anges i tillämpliga dataskyddslagar för det företag som fastställer syftet med och omfattningen av behandlingen av personuppgifter.

4. **"Försättsblad"** avser ett dokument som är undertecknat eller elektroniskt accepterat av parterna och som innehåller dessa DPA-standardvillkor och identifierar **Leverantör**, **Kund** samt föremålet för och detaljerna i databehandlingen.

5. **"Kundens personuppgifter"** avser personuppgifter som **Kunden** laddar upp eller tillhandahåller **Leverantören** som en del av Tjänsten och som regleras av detta dataskyddsavtal.

6. **"Databehandlingsavtal"** avser dessa standardvillkor för databehandlingsavtal, försättsbladet mellan **Leverantören** och **Kunden**, samt de policyer och dokument som det hänvisas till i eller bifogas försättsbladet.

7. **"EES-standardkontraktsklausuler"** avser de standardavtalsklausuler som bifogas Europeiska kommissionens genomförandebeslut 2021/914 av den 4 juni 2021 om standardavtalsklausuler för överföring av personuppgifter till tredjeländer i enlighet med Europaparlamentets och Europeiska rådets förordning (EU) 2016/679.

8. **"Europeiska ekonomiska samarbetsområdet"** eller **"EES"** avser medlemsstaterna i Europeiska unionen, Norge, Island och Liechtenstein.

9. **”GDPR”** avser Europeiska unionens förordning 2016/679 såsom den implementerats genom lokal lagstiftning i relevant EES-medlemsstat.

10. **"Personuppgifter"** ska ha den betydelse som anges i tillämpliga dataskyddslagar för personuppgifter, personuppgifter eller andra liknande termer.

11. **"Behandling"** eller **"Bearbetning"** ska ha den betydelse som anges i tillämpliga dataskyddslagar för all användning av, eller utförande av en datoriserad åtgärd på, personuppgifter, inklusive med automatiska metoder.

12. **"Personuppgiftsbehandlare"** ska ha den betydelse som anges i tillämpliga dataskyddslagar för det företag som behandlar personuppgifter för den personuppgiftsbehandlarens räkning.

13. **"Rapport"** avser revisionsrapporter som utarbetats av ett annat företag enligt de standarder som definieras i säkerhetspolicyn för Leverantörens räkning.

14. **"Begränsad överföring"** avser (a) där GDPR gäller, en överföring av personuppgifter från EES till ett land utanför EES som inte omfattas av en bedömning av adekvat skydd av Europeiska kommissionen; och (b) där den brittiska GDPR gäller, en överföring av personuppgifter från Storbritannien till något annat land som inte omfattas av adekvat skyddsregler som antagits i enlighet med avsnitt 17A i Storbritanniens dataskyddslag 2018.

15. **”Säkerhetsincident”** avser ett personuppgiftsintrång enligt definitionen i artikel 4 i GDPR.

16. **"Tjänst"** avser den produkt och/eller tjänster som beskrivs i **Avtalet**.

17. **"Särskild kategoriserad data"** har den betydelse som anges i artikel 9 i GDPR.

18. **"Underbiträde"** ska ha den betydelse som anges i tillämpliga dataskyddslagar för ett företag som, med godkännande och godkännande av den registeransvarige, bistår biträdet med att behandla personuppgifter för den registeransvariges räkning.

19. **”UK GDPR”** avser Europeiska unionens förordning 2016/679 såsom den genomförts genom avsnitt 3 i Storbritanniens utträdeslag från 2018 i Storbritannien.

20. **"Tillägg till Storbritannien"** avser det internationella tillägget för dataöverföring till EES-standardkontraktsklausulerna utfärdat av informationskommissionären för parter som gör begränsade överföringar enligt S119A(1) i dataskyddslagen från 2018.

## Krediter {#credits}

Detta dokument är en derivation av [Vanliga standardvillkor för dataskyddsavtal (version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) och är licensierat under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).