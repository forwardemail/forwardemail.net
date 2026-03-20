# Avtal om Databehandling {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Viktiga Termer](#key-terms)
* [Ändringar i Avtalet](#changes-to-the-agreement)
* [1. Förhållanden mellan Personuppgiftsbiträde och Underbiträde](#1-processor-and-subprocessor-relationships)
  * [1. Leverantör som Personuppgiftsbiträde](#1-provider-as-processor)
  * [2. Leverantör som Underbiträde](#2-provider-as-subprocessor)
* [2. Behandling](#2-processing)
  * [1. Behandlingsdetaljer](#1-processing-details)
  * [2. Behandlingsinstruktioner](#2-processing-instructions)
  * [3. Behandling av Leverantör](#3-processing-by-provider)
  * [4. Kundens Behandling](#4-customer-processing)
  * [5. Samtycke till Behandling](#5-consent-to-processing)
  * [6. Underbiträden](#6-subprocessors)
* [3. Begränsade Överföringar](#3-restricted-transfers)
  * [1. Auktorisation](#1-authorization)
  * [2. Överföringar utanför EES](#2-ex-eea-transfers)
  * [3. Överföringar utanför Storbritannien](#3-ex-uk-transfers)
  * [4. Andra Internationella Överföringar](#4-other-international-transfers)
* [4. Säkerhetsincidenthantering](#4-security-incident-response)
* [5. Revision & Rapporter](#5-audit--reports)
  * [1. Revisionsrättigheter](#1-audit-rights)
  * [2. Säkerhetsrapporter](#2-security-reports)
  * [3. Säkerhetsgranskning](#3-security-due-diligence)
* [6. Samordning & Samarbete](#6-coordination--cooperation)
  * [1. Svar på Förfrågningar](#1-response-to-inquiries)
  * [2. DPIA och DTIA](#2-dpias-and-dtias)
* [7. Radering av Kundens Personuppgifter](#7-deletion-of-customer-personal-data)
  * [1. Radering av Kund](#1-deletion-by-customer)
  * [2. Radering vid Avtalets Uppsägning](#2-deletion-at-dpa-expiration)
* [8. Ansvarsbegränsning](#8-limitation-of-liability)
  * [1. Ansvarstak och Avstående från Skadestånd](#1-liability-caps-and-damages-waiver)
  * [2. Anspråk från Relaterade Parter](#2-related-party-claims)
  * [3. Undantag](#3-exceptions)
* [9. Konflikter Mellan Dokument](#9-conflicts-between-documents)
* [10. Avtalets Längd](#10-term-of-agreement)
* [11. Tillämplig Lag och Valda Domstolar](#11-governing-law-and-chosen-courts)
* [12. Förhållande till Tjänsteleverantör](#12-service-provider-relationship)
* [13. Definitioner](#13-definitions)
* [Krediter](#credits)


## Viktiga Termer {#key-terms}

| Term                                       | Värde                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Avtal</strong>                      | Detta DPA kompletterar [Användarvillkoren](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Godkända Underbiträden</strong>     | [Cloudflare](https://cloudflare.com) (USA; DNS, nätverk och säkerhetsleverantör), [DataPacket](https://www.datapacket.com/) (USA/Storbritannien; hosting-leverantör), [Digital Ocean](https://digitalocean.com) (USA; hosting-leverantör), [GitHub](https://github.com) (USA; källkodshantering, CI/CD och projektledning), [Vultr](https://www.vultr.com) (USA; hosting-leverantör), [Stripe](https://stripe.com) (USA; betalningshanterare), [PayPal](https://paypal.com) (USA; betalningshanterare) |
| <strong>Leverantörens Säkerhetskontakt</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Säkerhetspolicy</strong>            | Se [vår Säkerhetspolicy på GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                             |
| <strong>Tillämplig Stat</strong>            | Delstaten Delaware, USA                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
## Changes to the Agreement {#changes-to-the-agreement}

Detta dokument är en härledning av [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) och följande ändringar har gjorts:

1. [Governing Law and Chosen Courts](#11-governing-law-and-chosen-courts) har inkluderats som en sektion nedan med `Governing State` identifierad ovan.
2. [Service Provider Relationship](#12-service-provider-relationship) har inkluderats som en sektion nedan.


## 1. Processor and Subprocessor Relationships {#1-processor-and-subprocessor-relationships}

### 1. Provider as Processor {#1-provider-as-processor}

I situationer där <strong>Customer</strong> är en Registeransvarig för Kundens Personuppgifter, kommer <strong>Provider</strong> att anses vara en Personuppgiftsbiträde som behandlar personuppgifter för <strong>Customer</strong>s räkning.

### 2. Provider as Subprocessor {#2-provider-as-subprocessor}

I situationer där <strong>Customer</strong> är en Personuppgiftsbiträde för Kundens Personuppgifter, kommer <strong>Provider</strong> att anses vara en Underbiträde för Kundens Personuppgifter.


## 2. Processing {#2-processing}

### 1. Processing Details {#1-processing-details}

Bilaga I(B) på omslagssidan beskriver ämnet, naturen, syftet och varaktigheten för denna behandling, samt <strong>Kategorier av Personuppgifter</strong> som samlas in och <strong>Kategorier av Registrerade</strong>.

### 2. Processing Instructions {#2-processing-instructions}

<strong>Customer</strong> instruerar <strong>Provider</strong> att behandla Kundens Personuppgifter: (a) för att tillhandahålla och underhålla Tjänsten; (b) som kan specificeras ytterligare genom <strong>Customer's</strong> användning av Tjänsten; (c) som dokumenteras i <strong>Avtalet</strong>; och (d) som dokumenteras i andra skriftliga instruktioner givna av <strong>Customer</strong> och bekräftade av <strong>Provider</strong> om behandling av Kundens Personuppgifter enligt denna DPA. <strong>Provider</strong> kommer att följa dessa instruktioner såvida det inte är förbjudet enligt tillämpliga lagar. <strong>Provider</strong> kommer omedelbart att informera <strong>Customer</strong> om det inte kan följa behandlingsinstruktionerna. <strong>Customer</strong> har gett och kommer endast att ge instruktioner som följer tillämpliga lagar.

### 3. Processing by Provider {#3-processing-by-provider}

<strong>Provider</strong> kommer endast att behandla Kundens Personuppgifter i enlighet med denna DPA, inklusive detaljerna på omslagssidan. Om <strong>Provider</strong> uppdaterar Tjänsten för att uppdatera befintliga eller inkludera nya produkter, funktioner eller funktionalitet, kan <strong>Provider</strong> ändra <strong>Kategorier av Registrerade</strong>, <strong>Kategorier av Personuppgifter</strong>, <strong>Särskilda Kategorier av Uppgifter</strong>, <strong>Begränsningar eller Skyddsåtgärder för Särskilda Kategorier av Uppgifter</strong>, <strong>Frekvens för Överföring</strong>, <strong>Behandlingens Natur och Syfte</strong> och <strong>Behandlingens Varaktighet</strong> efter behov för att återspegla uppdateringarna genom att meddela <strong>Customer</strong> om uppdateringarna och ändringarna.

### 4. Customer Processing {#4-customer-processing}

Där <strong>Customer</strong> är en Personuppgiftsbiträde och <strong>Provider</strong> är ett Underbiträde, kommer <strong>Customer</strong> att följa alla tillämpliga lagar som gäller för <strong>Customer's</strong> behandling av Kundens Personuppgifter. <strong>Customer's</strong> avtal med sin Registeransvarige kommer på liknande sätt att kräva att <strong>Customer</strong> följer alla tillämpliga lagar som gäller för <strong>Customer</strong> som Personuppgiftsbiträde. Dessutom kommer <strong>Customer</strong> att följa kraven för Underbiträde i <strong>Customer's</strong> avtal med sin Registeransvarige.

### 5. Consent to Processing {#5-consent-to-processing}

<strong>Customer</strong> har följt och kommer att fortsätta följa alla tillämpliga dataskyddslagar avseende sin överlämning av Kundens Personuppgifter till <strong>Provider</strong> och/eller Tjänsten, inklusive att göra alla upplysningar, inhämta alla samtycken, erbjuda adekvat valmöjlighet och implementera relevanta skyddsåtgärder som krävs enligt tillämpliga dataskyddslagar.
### 6. Underleverantörer {#6-subprocessors}

a. <strong>Leverantören</strong> kommer inte att tillhandahålla, överföra eller lämna ut några Kundpersonuppgifter till en Underleverantör om inte <strong>Kunden</strong> har godkänt Underleverantören. Den aktuella listan över <strong>Godkända Underleverantörer</strong> inkluderar identiteterna för Underleverantörerna, deras land för placering och deras förväntade Behandlingsuppgifter. <strong>Leverantören</strong> kommer att informera <strong>Kunden</strong> minst 10 arbetsdagar i förväg och skriftligen om eventuella avsedda ändringar av <strong>Godkända Underleverantörer</strong> vare sig genom tillägg eller ersättning av en Underleverantör, vilket ger <strong>Kunden</strong> tillräckligt med tid att invända mot ändringarna innan <strong>Leverantören</strong> börjar använda den nya Underleverantören/-arna. <strong>Leverantören</strong> kommer att ge <strong>Kunden</strong> den information som krävs för att möjliggöra för <strong>Kunden</strong> att utöva sin rätt att invända mot ändringen av <strong>Godkända Underleverantörer</strong>. <strong>Kunden</strong> har 30 dagar efter meddelande om en ändring av <strong>Godkända Underleverantörer</strong> på sig att invända, annars anses <strong>Kunden</strong> ha accepterat ändringarna. Om <strong>Kunden</strong> invänder mot ändringen inom 30 dagar efter meddelandet, ska <strong>Kunden</strong> och <strong>Leverantören</strong> samarbeta i god tro för att lösa <strong>Kundens</strong> invändning eller oro.

b. När <strong>Leverantören</strong> anlitar en Underleverantör ska denne ha ett skriftligt avtal med Underleverantören som säkerställer att Underleverantören endast får tillgång till och använder Kundpersonuppgifter (i) i den utsträckning som krävs för att utföra de åtaganden som underentreprenören har fått, och (ii) i enlighet med villkoren i <strong>Avtalet</strong>.

c. Om GDPR är tillämplig på Behandlingen av Kundpersonuppgifter, (i) ska de dataskyddsåtaganden som beskrivs i denna DPA (som avses i artikel 28.3 i GDPR, om tillämpligt) också åläggas Underleverantören, och (ii) ska <strong>Leverantörens</strong> avtal med Underleverantören inkludera dessa åtaganden, inklusive detaljer om hur <strong>Leverantören</strong> och dess Underleverantör ska samordna sig för att svara på förfrågningar eller begäran om Behandling av Kundpersonuppgifter. Dessutom ska <strong>Leverantören</strong> på <strong>Kundens</strong> begäran dela en kopia av sina avtal (inklusive eventuella ändringar) med sina Underleverantörer. I den mån det är nödvändigt för att skydda affärshemligheter eller annan konfidentiell information, inklusive personuppgifter, kan <strong>Leverantören</strong> maskera texten i sitt avtal med sin Underleverantör innan en kopia delas.

d. <strong>Leverantören</strong> förblir fullt ansvarig för alla åtaganden som underentreprenörerna har, inklusive handlingar och underlåtenheter från dess Underleverantörer vid Behandling av Kundpersonuppgifter. <strong>Leverantören</strong> ska meddela Kunden om någon av dess Underleverantörer inte uppfyller ett väsentligt åtagande avseende Kundpersonuppgifter enligt avtalet mellan <strong>Leverantören</strong> och Underleverantören.


## 3. Begränsade överföringar {#3-restricted-transfers}

### 1. Auktorisation {#1-authorization}

<strong>Kunden</strong> samtycker till att <strong>Leverantören</strong> kan överföra Kundpersonuppgifter utanför EES, Storbritannien eller annat relevant geografiskt område i den mån det är nödvändigt för att tillhandahålla Tjänsten. Om <strong>Leverantören</strong> överför Kundpersonuppgifter till ett område för vilket Europeiska kommissionen eller annan relevant tillsynsmyndighet inte har utfärdat ett beslut om adekvat skyddsnivå, ska <strong>Leverantören</strong> implementera lämpliga skyddsåtgärder för överföringen av Kundpersonuppgifter till det området i enlighet med tillämpliga dataskyddslagar.

### 2. Överföringar utanför EES {#2-ex-eea-transfers}

<strong>Kunden</strong> och <strong>Leverantören</strong> är överens om att om GDPR skyddar överföringen av Kundpersonuppgifter, överföringen sker från <strong>Kunden</strong> inom EES till <strong>Leverantören</strong> utanför EES, och överföringen inte regleras av ett beslut om adekvat skyddsnivå från Europeiska kommissionen, så anses <strong>Kunden</strong> och <strong>Leverantören</strong> genom att ingå denna DPA ha undertecknat EES:s standardavtalsklausuler (EEA SCCs) och deras bilagor, vilka införlivas genom hänvisning. Varje sådan överföring sker enligt EES:s standardavtalsklausuler, som fylls i enligt följande:
a. Modul Två (Personuppgiftsansvarig till Personuppgiftsbiträde) i EES:s standardavtalsklausuler gäller när <strong>Kund</strong> är personuppgiftsansvarig och <strong>Leverantör</strong> behandlar Kundens personuppgifter för <strong>Kund</strong> som personuppgiftsbiträde.

b. Modul Tre (Personuppgiftsbiträde till Underbiträde) i EES:s standardavtalsklausuler gäller när <strong>Kund</strong> är personuppgiftsbiträde och <strong>Leverantör</strong> behandlar Kundens personuppgifter för <strong>Kund</strong> som underbiträde.

c. För varje modul gäller följande (när tillämpligt):

1. Den frivilliga anslutningsklausulen i klausul 7 gäller inte;

2. I klausul 9 gäller alternativ 2 (allmän skriftlig auktorisation), och minsta tidsperiod för förhandsmeddelande om ändringar av underbiträde är 10 arbetsdagar;

3. I klausul 11 gäller inte det frivilliga språket;

4. Alla hakparenteser i klausul 13 tas bort;

5. I klausul 17 (alternativ 1) ska EES:s standardavtalsklausuler styras av lagarna i <strong>Styrande medlemsstat</strong>;

6. I klausul 18(b) ska tvister lösas i domstolarna i <strong>Styrande medlemsstat</strong>; och

7. Omslagssidan till detta DPA innehåller den information som krävs i bilaga I, bilaga II och bilaga III till EES:s standardavtalsklausuler.

### 3. Ex-UK Transfers {#3-ex-uk-transfers}

<strong>Kund</strong> och <strong>Leverantör</strong> är överens om att om UK GDPR skyddar överföringen av Kundens personuppgifter, överföringen sker från <strong>Kund</strong> inom Storbritannien till <strong>Leverantör</strong> utanför Storbritannien, och överföringen inte styrs av ett adekvansbeslut fattat av Storbritanniens Secretary of State, så anses <strong>Kund</strong> och <strong>Leverantör</strong> genom att ingå detta DPA ha undertecknat UK-tillägget och dess bilagor, vilka införlivas genom hänvisning. Sådan överföring sker enligt UK-tillägget, som fylls i enligt följande:

a. Avsnitt 3.2 i detta DPA innehåller den information som krävs i tabell 2 i UK-tillägget.

b. Tabell 4 i UK-tillägget ändras enligt följande: Ingen part får avsluta UK-tillägget enligt avsnitt 19 i UK-tillägget; i den mån ICO utfärdar ett reviderat godkänt tillägg enligt avsnitt ‎18 i UK-tillägget, ska parterna i god tro arbeta för att revidera detta DPA i enlighet därmed.

c. Omslagssidan innehåller den information som krävs enligt bilaga 1A, bilaga 1B, bilaga II och bilaga III i UK-tillägget.

### 4. Other International Transfers {#4-other-international-transfers}

För överföringar av personuppgifter där schweizisk lag (och inte lagstiftningen i någon EES-medlemsstat eller Storbritannien) gäller för den internationella karaktären av överföringen, ändras hänvisningar till GDPR i klausul 4 i EES:s standardavtalsklausuler, i den mån det är juridiskt nödvändigt, till att istället avse den schweiziska federala dataskyddslagen eller dess efterföljare, och begreppet tillsynsmyndighet kommer att inkludera den schweiziska federala dataskydds- och informationskommissionären.


## 4. Security Incident Response {#4-security-incident-response}

1. När <strong>Leverantör</strong> blir medveten om någon säkerhetsincident ska denne: (a) underrätta <strong>Kund</strong> utan onödigt dröjsmål när det är möjligt, men senast 72 timmar efter att ha blivit medveten om säkerhetsincidenten; (b) tillhandahålla aktuell information om säkerhetsincidenten när den blir känd eller när <strong>Kund</strong> rimligen begär det; och (c) omedelbart vidta rimliga åtgärder för att begränsa och undersöka säkerhetsincidenten. <strong>Leverantörs</strong> underrättelse om eller svar på en säkerhetsincident enligt detta DPA ska inte tolkas som ett erkännande från <strong>Leverantör</strong> av något fel eller ansvar för säkerhetsincidenten.


## 5. Audit & Reports {#5-audit--reports}

### 1. Audit Rights {#1-audit-rights}

<strong>Leverantör</strong> ska ge <strong>Kund</strong> all information som rimligen krävs för att visa efterlevnad av detta DPA och <strong>Leverantör</strong> ska tillåta och bidra till revisioner, inklusive inspektioner av <strong>Kund</strong>, för att bedöma <strong>Leverantörs</strong> efterlevnad av detta DPA. Dock kan <strong>Leverantör</strong> begränsa tillgång till data eller information om <strong>Kunds</strong> tillgång till informationen skulle påverka <strong>Leverantörs</strong> immateriella rättigheter, sekretessåtaganden eller andra skyldigheter enligt tillämpliga lagar negativt. <strong>Kund</strong> bekräftar och godkänner att denne endast kommer att utöva sina revisionsrättigheter enligt detta DPA och eventuella revisionsrättigheter som beviljas enligt tillämpliga dataskyddslagar genom att instruera <strong>Leverantör</strong> att uppfylla rapporterings- och due diligence-kraven nedan. <strong>Leverantör</strong> ska behålla register över sin efterlevnad av detta DPA i 3 år efter att DPA upphör.
### 2. Säkerhetsrapporter {#2-security-reports}

<strong>Kunden</strong> erkänner att <strong>Leverantören</strong> regelbundet granskas mot de standarder som definieras i <strong>Säkerhetspolicyn</strong> av oberoende tredjepartsrevisorer. På skriftlig begäran kommer <strong>Leverantören</strong> att ge <strong>Kunden</strong>, på konfidentiell basis, en sammanfattande kopia av sin då gällande Rapport så att <strong>Kunden</strong> kan verifiera <strong>Leverantörens</strong> efterlevnad av de standarder som definieras i <strong>Säkerhetspolicyn</strong>.

### 3. Säkerhetsdue diligence {#3-security-due-diligence}

Utöver Rapporten kommer <strong>Leverantören</strong> att svara på rimliga informationsförfrågningar från <strong>Kunden</strong> för att bekräfta <strong>Leverantörens</strong> efterlevnad av detta DPA, inklusive svar på informationssäkerhets-, due diligence- och revisionsenkäter, eller genom att ge ytterligare information om sitt informationssäkerhetsprogram. Alla sådana förfrågningar måste vara skriftliga och riktas till <strong>Leverantörens säkerhetskontakt</strong> och får endast göras en gång per år.


## 6. Samordning & Samarbete {#6-coordination--cooperation}

### 1. Svar på förfrågningar {#1-response-to-inquiries}

Om <strong>Leverantören</strong> mottar någon förfrågan eller begäran från någon annan angående behandlingen av Kundens personuppgifter, kommer <strong>Leverantören</strong> att underrätta <strong>Kunden</strong> om förfrågan och <strong>Leverantören</strong> kommer inte att svara på förfrågan utan <strong>Kundens</strong> föregående samtycke. Exempel på sådana förfrågningar och begäranden inkluderar en rättslig eller administrativ eller regulatorisk myndighetsorder om Kundens personuppgifter där det inte är förbjudet enligt tillämplig lag att underrätta <strong>Kunden</strong>, eller en begäran från en registrerad person. Om det är tillåtet enligt tillämplig lag kommer <strong>Leverantören</strong> att följa <strong>Kundens</strong> rimliga instruktioner om dessa förfrågningar, inklusive att tillhandahålla statusuppdateringar och annan information som rimligen begärs av <strong>Kunden</strong>. Om en registrerad person gör en giltig begäran enligt tillämpliga dataskyddslagar om att radera eller avstå från att <strong>Kunden</strong> lämnar ut Kundens personuppgifter till <strong>Leverantören</strong>, kommer <strong>Leverantören</strong> att bistå <strong>Kunden</strong> med att uppfylla begäran enligt tillämplig dataskyddslag. <strong>Leverantören</strong> kommer att samarbeta med och ge rimligt bistånd till <strong>Kunden</strong>, på <strong>Kundens</strong> bekostnad, i varje rättsligt svar eller annan processuell åtgärd som <strong>Kunden</strong> vidtar som svar på en tredje parts begäran om <strong>Leverantörens</strong> behandling av Kundens personuppgifter enligt detta DPA.

### 2. DPIA:er och DTIA:er {#2-dpias-and-dtias}

Om det krävs enligt tillämpliga dataskyddslagar kommer <strong>Leverantören</strong> att rimligen bistå <strong>Kunden</strong> vid genomförandet av eventuella obligatoriska konsekvensbedömningar av dataskydd eller konsekvensbedömningar av dataöverföringar samt samråd med relevanta dataskyddsmyndigheter, med hänsyn till behandlingens och Kundens personuppgifters natur.


## 7. Radering av Kundens personuppgifter {#7-deletion-of-customer-personal-data}

### 1. Radering av Kunden {#1-deletion-by-customer}

<strong>Leverantören</strong> kommer att möjliggöra för <strong>Kunden</strong> att radera Kundens personuppgifter på ett sätt som är förenligt med tjänsternas funktionalitet. <strong>Leverantören</strong> kommer att följa denna instruktion så snart det är rimligen genomförbart, förutom där ytterligare lagring av Kundens personuppgifter krävs enligt tillämplig lag.

### 2. Radering vid DPA:s utgång {#2-deletion-at-dpa-expiration}

a. Efter att DPA har upphört kommer <strong>Leverantören</strong> att returnera eller radera Kundens personuppgifter enligt <strong>Kundens</strong> instruktion, såvida inte ytterligare lagring av Kundens personuppgifter krävs eller är tillåten enligt tillämplig lag. Om återlämnande eller förstöring är opraktiskt eller förbjudet enligt tillämpliga lagar, kommer <strong>Leverantören</strong> att göra rimliga ansträngningar för att förhindra ytterligare behandling av Kundens personuppgifter och kommer att fortsätta skydda de Kundens personuppgifter som finns kvar i dess besittning, förvar eller kontroll. Till exempel kan tillämpliga lagar kräva att <strong>Leverantören</strong> fortsätter att vara värd för eller behandla Kundens personuppgifter.
b. Om <strong>Kund</strong> och <strong>Leverantör</strong> har ingått EES SCC eller UK-tillägget som en del av denna DPA, kommer <strong>Leverantör</strong> endast att ge <strong>Kund</strong> certifikatet för radering av personuppgifter som beskrivs i klausul 8.1(d) och klausul 8.5 i EES SCC om <strong>Kund</strong> begär det.


## 8. Ansvarsbegränsning {#8-limitation-of-liability}

### 1. Ansvarsgränser och avstående från skadestånd {#1-liability-caps-and-damages-waiver}

**I den mån det är tillåtet enligt tillämpliga dataskyddslagar, ska varje parts totala kumulativa ansvar gentemot den andra parten som uppstår ur eller är relaterat till denna DPA vara föremål för de avståenden, undantag och ansvarsbegränsningar som anges i <strong>Avtalet</strong>.**

### 2. Anspråk från närstående parter {#2-related-party-claims}

**Eventuella anspråk mot <strong>Leverantör</strong> eller dess närstående bolag som uppstår ur eller är relaterade till denna DPA får endast väckas av den <strong>Kund</strong>-enhet som är part i <strong>Avtalet</strong>.**

### 3. Undantag {#3-exceptions}

1. Denna DPA begränsar inte något ansvar gentemot en individ avseende individens dataskyddsrättigheter enligt tillämpliga dataskyddslagar. Dessutom begränsar denna DPA inte något ansvar mellan parterna för överträdelser av EES SCC eller UK-tillägget.


## 9. Konflikter mellan dokument {#9-conflicts-between-documents}

1. Denna DPA utgör en del av och kompletterar Avtalet. Om det finns någon inkonsekvens mellan denna DPA, <strong>Avtalet</strong> eller någon av deras delar, ska den del som anges tidigare ha företräde framför den del som anges senare för den inkonsekvensen: (1) EES SCC eller UK-tillägget, (2) denna DPA, och sedan (3) <strong>Avtalet</strong>.


## 10. Avtalets löptid {#10-term-of-agreement}

Denna DPA börjar gälla när <strong>Leverantör</strong> och <strong>Kund</strong> godkänner en omslagssida för DPA och undertecknar eller elektroniskt accepterar <strong>Avtalet</strong> och fortsätter tills <strong>Avtalet</strong> upphör eller sägs upp. Dock ska både <strong>Leverantör</strong> och <strong>Kund</strong> fortsätta att vara bundna av skyldigheterna i denna DPA och tillämpliga dataskyddslagar tills <strong>Kund</strong> upphör med att överföra kundpersonuppgifter till <strong>Leverantör</strong> och <strong>Leverantör</strong> upphör med att behandla kundpersonuppgifter.


## 11. Tillämplig lag och valda domstolar {#11-governing-law-and-chosen-courts}

Oavsett tillämplig lag eller liknande klausuler i <strong>Avtalet</strong>, ska all tolkning och tvister om denna DPA styras av lagarna i <strong>Governing State</strong> utan hänsyn till dess lagkonfliktsregler. Dessutom, och oavsett forumval, jurisdiktions- eller liknande klausuler i <strong>Avtalet</strong>, samtycker parterna till att föra varje rättslig stämning, åtgärd eller förfarande om denna DPA i, och varje part underkastar sig härmed oåterkalleligt den exklusiva jurisdiktionen för, domstolarna i <strong>Governing State</strong>.


## 12. Förhållande till tjänsteleverantör {#12-service-provider-relationship}

I den mån California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq ("CCPA") är tillämplig, erkänner och samtycker parterna till att <strong>Leverantör</strong> är en tjänsteleverantör och mottar personuppgifter från <strong>Kund</strong> för att tillhandahålla tjänsten enligt <strong>Avtalet</strong>, vilket utgör ett affärssyfte. <strong>Leverantör</strong> kommer inte att sälja några personuppgifter som tillhandahålls av <strong>Kund</strong> enligt <strong>Avtalet</strong>. Dessutom kommer <strong>Leverantör</strong> inte att behålla, använda eller avslöja några personuppgifter som tillhandahålls av <strong>Kund</strong> enligt <strong>Avtalet</strong> utom i den mån det är nödvändigt för att tillhandahålla tjänsten för <strong>Kund</strong>, som anges i <strong>Avtalet</strong>, eller som tillåts enligt tillämpliga dataskyddslagar. <strong>Leverantör</strong> intygar att de förstår begränsningarna i detta stycke.
## 13. Definitioner {#13-definitions}

1. **"Gällande lagar"** avser lagar, regler, förordningar, domstolsbeslut och andra bindande krav från relevant myndighet som gäller för eller styr en part.

2. **"Gällande dataskyddslagar"** avser de Gällande lagar som reglerar hur Tjänsten får behandla eller använda en individs personliga information, personuppgifter, personligt identifierbar information eller annan liknande term.

3. **"Personuppgiftsansvarig"** har den betydelse som anges i de Gällande dataskyddslagarna för det företag som bestämmer ändamålet och omfattningen av behandlingen av personuppgifter.

4. **"Omslagssida"** avser ett dokument som undertecknas eller elektroniskt accepteras av parterna och som införlivar dessa DPA-standardvillkor och identifierar <strong>Leverantör</strong>, <strong>Kund</strong> samt ämnet och detaljerna för databehandlingen.

5. **"Kundens personuppgifter"** avser personuppgifter som <strong>Kund</strong> laddar upp eller tillhandahåller till <strong>Leverantör</strong> som en del av Tjänsten och som regleras av denna DPA.

6. **"DPA"** avser dessa DPA-standardvillkor, Omslagssidan mellan <strong>Leverantör</strong> och <strong>Kund</strong> samt de policyer och dokument som refereras till eller bifogas Omslagssidan.

7. **"EEA SCCs"** avser de standardavtalsklausuler som är bilagda Europeiska kommissionens genomförandebeslut 2021/914 av den 4 juni 2021 om standardavtalsklausuler för överföring av personuppgifter till tredjeländer enligt förordning (EU) 2016/679 från Europaparlamentet och Europeiska rådet.

8. **"Europeiska ekonomiska samarbetsområdet"** eller **"EES"** avser medlemsstaterna i Europeiska unionen, Norge, Island och Liechtenstein.

9. **"GDPR"** avser Europeiska unionens förordning 2016/679 som implementerats genom lokal lag i relevant EES-medlemsland.

10. **"Personuppgifter"** har den betydelse som anges i de Gällande dataskyddslagarna för personlig information, personuppgifter eller annan liknande term.

11. **"Behandling"** eller **"Behandla"** har den betydelse som anges i de Gällande dataskyddslagarna för all användning av, eller utförande av datoroperation på, personuppgifter, inklusive med automatiska metoder.

12. **"Personuppgiftsbiträde"** har den betydelse som anges i de Gällande dataskyddslagarna för det företag som behandlar personuppgifter för Personuppgiftsansvarigs räkning.

13. **"Rapport"** avser revisionsrapporter som upprättats av ett annat företag enligt de standarder som definieras i säkerhetspolicyn för Leverantörs räkning.

14. **"Begränsad överföring"** avser (a) när GDPR är tillämplig, en överföring av personuppgifter från EES till ett land utanför EES som inte omfattas av ett adekvat beslut från Europeiska kommissionen; och (b) när UK GDPR är tillämplig, en överföring av personuppgifter från Storbritannien till något annat land som inte omfattas av adekvansbestämmelser antagna enligt avsnitt 17A i Storbritanniens dataskyddslag 2018.

15. **"Säkerhetsincident"** avser ett personuppgiftsbrott enligt definitionen i artikel 4 i GDPR.

16. **"Tjänst"** avser produkten och/eller tjänsterna som beskrivs i <strong>Avtalet</strong>.

17. **"Känsliga personuppgifter"** har den betydelse som anges i artikel 9 i GDPR.

18. **"Underbiträde"** har den betydelse som anges i de Gällande dataskyddslagarna för ett företag som, med godkännande och acceptans från Personuppgiftsansvarig, bistår Personuppgiftsbiträdet med att behandla personuppgifter för Personuppgiftsansvarigs räkning.

19. **"UK GDPR"** avser Europeiska unionens förordning 2016/679 som implementerats genom avsnitt 3 i Storbritanniens European Union (Withdrawal) Act från 2018 i Storbritannien.

20. **"UK-tillägg"** avser det internationella tillägget för dataöverföring till EEA SCCs utfärdat av Information Commissioner för parter som gör Begränsade överföringar enligt S119A(1) i Data Protection Act 2018.


## Credits {#credits}

Detta dokument är en härledning av [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) och är licensierat under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
