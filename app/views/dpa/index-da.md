# Databehandleraftale {#data-processing-agreement}

<!-- v1.0 fra <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Nøgleord](#key-terms)
* [Ændringer i aftalen](#changes-to-the-agreement)
* [1. Forholdet mellem databehandlere og underdatabehandlere](#1-processor-and-subprocessor-relationships)
  * [1. Udbyder som databehandler](#1-provider-as-processor)
  * [2. Udbyder som underdatabehandler](#2-provider-as-subprocessor)
* [2. Forarbejdning](#2-processing)
  * [1. Behandlingsoplysninger](#1-processing-details)
  * [2. Forarbejdningsinstruktioner](#2-processing-instructions)
  * [3. Behandling af udbyder](#3-processing-by-provider)
  * [4. Kundebehandling](#4-customer-processing)
  * [5. Samtykke til behandling](#5-consent-to-processing)
  * [6. Underdatabehandlere](#6-subprocessors)
* [3. Begrænsede overførsler](#3-restricted-transfers)
  * [1. Autorisation](#1-authorization)
  * [2. Overførsler fra lande uden for EØS](#2-ex-eea-transfers)
  * [3. Overførsler uden for Storbritannien](#3-ex-uk-transfers)
  * [4. Andre internationale overførsler](#4-other-international-transfers)
* [4. Reaktion på sikkerhedshændelser](#4-security-incident-response)
* [5. Revision og rapporter](#5-audit--reports)
  * [1. Revisionsrettigheder](#1-audit-rights)
  * [2. Sikkerhedsrapporter](#2-security-reports)
  * [3. Sikkerhedsmæssig due diligence](#3-security-due-diligence)
* [6. Koordinering og samarbejde](#6-coordination--cooperation)
  * [1. Svar på forespørgsler](#1-response-to-inquiries)
  * [2. DPIA'er og DTIA'er](#2-dpias-and-dtias)
* [7. Sletning af kundens personoplysninger](#7-deletion-of-customer-personal-data)
  * [1. Sletning foretaget af kunden](#1-deletion-by-customer)
  * [2. Sletning ved udløb af databeskyttelsesaftalen](#2-deletion-at-dpa-expiration)
* [8. Ansvarsbegrænsning](#8-limitation-of-liability)
  * [1. Ansvarsgrænser og ansvarsfraskrivelse](#1-liability-caps-and-damages-waiver)
  * [2. Krav fra nærtstående parter](#2-related-party-claims)
  * [3. Undtagelser](#3-exceptions)
* [9. Konflikter mellem dokumenter](#9-conflicts-between-documents)
* [10. Aftalens løbetid](#10-term-of-agreement)
* [11. Gældende lov og valgte domstole](#11-governing-law-and-chosen-courts)
* [12. Forholdet mellem tjenesteudbyderen](#12-service-provider-relationship)
* [13. Definitioner](#13-definitions)
* [Kreditter](#credits)

## Nøgleord {#key-terms}

| Semester | Værdi |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aftale** | Denne databehandleraftale supplerer [Terms of Service](/terms) |
| Godkendte underdatabehandlere | [Cloudflare](https://cloudflare.com) (USA; DNS-, netværks- og sikkerhedsudbyder), [DataPacket](https://www.datapacket.com/) (USA/Storbritannien; hostingudbyder), [Digital Ocean](https://digitalocean.com) (USA; hostingudbyder), [Vultr](https://www.vultr.com) (USA; hostingudbyder), [Stripe](https://stripe.com) (USA; betalingsudbyder), [PayPal](https://paypal.com) (USA; betalingsudbyder) |
| <strong>Kontaktperson for udbydersikkerhed</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| Sikkerhedspolitik | Vis [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| **Styrende stat** | Staten Delaware, USA |

## Ændringer i aftalen {#changes-to-the-agreement}

Dette dokument er en afledning af [Fælles standardvilkår for databeskyttelsesaftaler (version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0), og følgende ændringer er foretaget:

1. [Gældende lov og valgte domstole](#11-governing-law-and-chosen-courts) er blevet inkluderet som et afsnit nedenfor med `Governing State` identificeret ovenfor.

2. [Forholdet mellem tjenesteudbydere](#12-service-provider-relationship) er blevet inkluderet som et afsnit nedenfor.

## 1. Forhold mellem processorer og underprocessorer {#1-processor-and-subprocessor-relationships}

### 1. Udbyder som databehandler {#1-provider-as-processor}

I situationer hvor <strong>Kunden</strong> er dataansvarlig for kundens personoplysninger, vil <strong>Udbyderen</strong> blive betragtet som databehandler, der behandler personoplysninger på vegne af <strong>Kunden</strong>.

### 2. Udbyder som underdatabehandler {#2-provider-as-subprocessor}

I situationer hvor <strong>Kunden</strong> er databehandler af kundens personoplysninger, vil <strong>Leverandøren</strong> blive betragtet som underdatabehandler af kundens personoplysninger.

## 2. Behandling af {#2-processing}

### 1. Behandlingsdetaljer {#1-processing-details}

Bilag I(B) på forsiden beskriver genstanden, arten, formålet og varigheden af denne behandling samt de <strong>kategorier af personoplysninger</strong>, der indsamles, og de <strong>kategorier af registrerede</strong>.

### 2. Behandlingsinstruktioner {#2-processing-instructions}

Kunden instruerer Udbyderen i at behandle Kundens Personoplysninger: (a) for at levere og vedligeholde Tjenesten; (b) som yderligere specificeret gennem Kundens brug af Tjenesten; (c) som dokumenteret i Aftalen; og (d) som dokumenteret i andre skriftlige instruktioner givet af Kunden og anerkendt af Udbyderen om Behandling af Kundens Personoplysninger i henhold til denne Databeskyttelsesaftale. Udbyderen skal overholde disse instruktioner, medmindre det er forbudt i henhold til gældende love. Udbyderen skal straks informere Kunden, hvis denne ikke er i stand til at følge Behandlingsinstruktionerne. Kunden har givet og vil kun give instruktioner, der overholder gældende love.

### 3. Behandling af udbyder {#3-processing-by-provider}

<strong>Udbyderen</strong> behandler kun kundens personoplysninger i overensstemmelse med denne databeskyttelsesaftale, herunder detaljerne på forsiden. Hvis <strong>Udbyderen</strong> opdaterer tjenesten for at opdatere eksisterende eller inkludere nye produkter, funktioner eller funktionalitet, kan <strong>Udbyderen</strong> ændre <strong>Kategorierne af registrerede</strong>, <strong>Kategorierne af personoplysninger</strong>, <strong>Særlige kategoridata</strong>, <strong>Restriktioner eller sikkerhedsforanstaltninger for særlige kategoridata</strong>, <strong>Overførselshyppigheden</strong>, <strong>Behandlingens art og formål</strong> og <strong>Behandlingens varighed</strong> efter behov for at afspejle opdateringerne ved at underrette <strong>Kunden</strong> om opdateringerne og ændringerne.

### 4. Kundebehandling {#4-customer-processing}

Hvor Kunden er Databehandler, og Leverandøren er Underdatabehandler, skal Kunden overholde alle Gældende Lovgivning, der gælder for Kundens Behandling af Kundens Personoplysninger. Kundens aftale med sin Dataansvarlige vil ligeledes kræve, at Kunden overholder alle Gældende Lovgivning, der gælder for Kunden som Databehandler. Derudover skal Kunden overholde Underdatabehandlerkravene i Kundens aftale med sin Dataansvarlige.

### 5. Samtykke til behandling {#5-consent-to-processing}

Kunden har overholdt og vil fortsat overholde alle gældende databeskyttelseslove vedrørende levering af kundens personoplysninger til Leverandøren og/eller Tjenesten, herunder at foretage alle videregivelser, indhente alle samtykker, give tilstrækkelige valgmuligheder og implementere relevante sikkerhedsforanstaltninger, der kræves i henhold til gældende databeskyttelseslove.

### 6. Underprocessorer {#6-subprocessors}

a. <strong>Udbyderen</strong> vil ikke videregive, overføre eller overdrage Kundens Personoplysninger til en Underdatabehandler, medmindre <strong>Kunden</strong> har godkendt Underdatabehandleren. Den nuværende liste over <strong>Godkendte Underdatabehandlere</strong> inkluderer Underdatabehandlernes identitet, deres land og deres forventede Behandlingsopgaver. <strong>Udbyderen</strong> vil informere <strong>Kunden</strong> mindst 10 hverdage i forvejen og skriftligt om eventuelle planlagte ændringer af de <strong>Godkendte Underdatabehandlere</strong>, uanset om det er ved tilføjelse eller udskiftning af en Underdatabehandler, hvilket giver <strong>Kunden</strong> tilstrækkelig tid til at gøre indsigelse mod ændringerne, før <strong>Udbyderen</strong> begynder at bruge den/de nye Underdatabehandler(e). <strong>Udbyderen</strong> vil give <strong>Kunden</strong> de oplysninger, der er nødvendige for, at <strong>Kunden</strong> kan udøve sin ret til at gøre indsigelse mod ændringen af <strong>Godkendte Underdatabehandlere</strong>. Kunden har 30 dage efter meddelelse om en ændring af de <strong>Godkendte underdatabehandlere</strong> til at gøre indsigelse, ellers anses Kunden for at acceptere ændringerne. Hvis Kunden gør indsigelse mod ændringen inden for 30 dage efter meddelelsen, skal Kunden og Leverandøren samarbejde i god tro for at løse Kundens indsigelse eller bekymring.

b. Når Leverandøren engagerer en underdatabehandler, skal denne have en skriftlig aftale med underdatabehandleren, der sikrer, at underdatabehandleren kun tilgår og bruger Kundens Personoplysninger (i) i det omfang, det er nødvendigt for at udføre de forpligtelser, der er givet til underdatabehandleren, og (ii) i overensstemmelse med vilkårene i <strong>Aftalen</strong>.

c. Hvis GDPR finder anvendelse på behandling af kunders personoplysninger, (i) pålægges databeskyttelsesforpligtelserne beskrevet i denne databeskyttelsesaftale (som omhandlet i artikel 28(3) i GDPR, hvis relevant) også underdatabehandleren, og (ii) vil <strong>Leverandørens</strong> aftale med underdatabehandleren inkorporere disse forpligtelser, herunder detaljer om, hvordan <strong>Leverandøren</strong> og dennes underdatabehandler vil koordinere for at besvare forespørgsler eller anmodninger om behandling af kunders personoplysninger. Derudover vil <strong>Leverandøren</strong> på <strong>Kundens</strong> anmodning dele en kopi af sine aftaler (herunder eventuelle ændringer) med sine underdatabehandlere. I det omfang det er nødvendigt for at beskytte forretningshemmeligheder eller andre fortrolige oplysninger, herunder personoplysninger, kan <strong>Leverandøren</strong> redigere teksten i sin aftale med sin underdatabehandler, inden en kopi deles.

d. <strong>Udbyderen</strong> forbliver fuldt ansvarlig for alle forpligtelser, der er udliciteret til sine underdatabehandlere, herunder handlinger og undladelser fra sine underdatabehandlere i forbindelse med behandling af kunders personoplysninger. <strong>Udbyderen</strong> skal underrette kunden om enhver undladelse fra sine underdatabehandleres side med at opfylde en væsentlig forpligtelse vedrørende kunders personoplysninger i henhold til aftalen mellem <strong>Udbyderen</strong> og underdatabehandleren.

## 3. Begrænsede overførsler {#3-restricted-transfers}

### 1. Godkendelse {#1-authorization}

Kunden accepterer, at Udbyderen må overføre Kundens Personoplysninger uden for EØS, Storbritannien eller andet relevant geografisk område, hvis det er nødvendigt for at levere Tjenesten. Hvis Udbyderen overfører Kundens Personoplysninger til et område, hvor Europa-Kommissionen eller anden relevant tilsynsmyndighed ikke har udstedt en tilstrækkelighedsafgørelse, vil Udbyderen implementere passende sikkerhedsforanstaltninger for overførsel af Kundens Personoplysninger til dette område i overensstemmelse med gældende databeskyttelseslovgivning.

### 2. Overførsler uden for EØS {#2-ex-eea-transfers}

Kunden og Udbyderen er enige om, at hvis GDPR beskytter overførslen af Kundens Personoplysninger, og overførslen sker fra Kunden inden for EØS til Udbyderen uden for EØS, og overførslen ikke er underlagt en tilstrækkelighedsafgørelse truffet af Europa-Kommissionen, anses Kunden og Udbyderen ved at indgå denne databeskyttelsesaftale for at have underskrevet EØS-standardkontraktbetingelserne og deres bilag, som er indarbejdet ved henvisning. Enhver sådan overførsel foretages i henhold til EØS-standardkontraktbetingelserne, som er udfyldt som følger:

a. Modul to (dataansvarlig til databehandler) i EØS-standardkontraktbetingelserne gælder, når <strong>kunden</strong> er dataansvarlig, og <strong>udbyderen</strong> behandler kundens personoplysninger for <strong>kunden</strong> som databehandler.

b. Modul tre (databehandler til underdatabehandler) i EØS-standardkontraktbetingelserne gælder, når <strong>kunden</strong> er databehandler, og <strong>leverandøren</strong> behandler kundens personoplysninger på vegne af <strong>kunden</strong> som underdatabehandler.

c. For hvert modul gælder følgende (hvis relevant):

1. Den valgfrie dockingklausul i paragraf 7 finder ikke anvendelse;

2. I punkt 9 gælder mulighed 2 (generel skriftlig bemyndigelse), og minimumsperioden for forudgående varsel om ændringer af underdatabehandlere er 10 hverdage;

3. I paragraf 11 finder den valgfrie formulering ikke anvendelse;

4. Alle firkantede parenteser i paragraf 13 fjernes;

5. I paragraf 17 (mulighed 1) vil EØS-standardkontraktselskaberne være underlagt lovgivningen i den **regerende medlemsstat**;

6. I henhold til paragraf 18(b) skal tvister afgøres ved domstolene i den **regerende medlemsstat**; og

7. Forsiden til denne databeskyttelsesaftale indeholder de oplysninger, der kræves i bilag I, bilag II og bilag III til EØS-standardkontraktbestemmelserne.

### 3. Overførsler uden for Storbritannien {#3-ex-uk-transfers}

Kunden og Udbyderen er enige om, at hvis den britiske GDPR beskytter overførslen af Kundens Personoplysninger, og overførslen sker fra Kunden inden for Storbritannien til Udbyderen uden for Storbritannien, og overførslen ikke er underlagt en tilstrækkelighedsbeslutning truffet af Storbritanniens udenrigsminister, anses Kunden og Udbyderen ved at indgå denne databeskyttelsesaftale for at have underskrevet det britiske tillæg og dets bilag, som er indarbejdet ved henvisning. Enhver sådan overførsel foretages i henhold til det britiske tillæg, som er udfyldt som følger:

a. Afsnit 3.2 i denne databehandleraftale indeholder de oplysninger, der kræves i tabel 2 i det britiske tillæg.

b. Tabel 4 i det britiske tillæg ændres som følger: Ingen af parterne må ophæve det britiske tillæg som angivet i afsnit 19 i det britiske tillæg; i det omfang ICO udsteder et revideret godkendt tillæg i henhold til afsnit ‎18 i det britiske tillæg, skal parterne i god tro arbejde for at revidere denne databehandleraftale i overensstemmelse hermed.

c. Forsiden indeholder de oplysninger, der kræves i henhold til bilag 1A, bilag 1B, bilag II og bilag III i det britiske tillæg.

### 4. Andre internationale overførsler {#4-other-international-transfers}

For overførsler af personoplysninger, hvor schweizisk lov (og ikke lovgivningen i nogen EØS-medlemsstat eller Storbritannien) finder anvendelse på overførslens internationale karakter, ændres henvisninger til GDPR i paragraf 4 i EØS-standardkontraktbestemmelserne, i det omfang det er lovmæssigt påkrævet, til i stedet at henvise til den schweiziske føderale databeskyttelseslov eller dens efterfølger, og begrebet tilsynsmyndighed vil omfatte den schweiziske føderale databeskyttelses- og informationskommissær.

## 4. Respons på sikkerhedshændelse {#4-security-incident-response}

1. Når Leverandøren bliver opmærksom på en sikkerhedshændelse, skal denne: (a) underrette Kunden uden unødig forsinkelse, når det er muligt, men senest 72 timer efter at være blevet opmærksom på sikkerhedshændelsen; (b) give rettidig information om sikkerhedshændelsen, så snart den bliver kendt, eller som Kunden med rimelighed anmoder om; og (c) straks tage rimelige skridt til at inddæmme og undersøge sikkerhedshændelsen. Leverandørens underretning om eller reaktion på en sikkerhedshændelse som krævet i denne databeskyttelsesaftale skal ikke fortolkes som en anerkendelse fra Leverandørens side af nogen fejl eller ansvar for sikkerhedshændelsen.

## 5. Revision og rapporter {#5-audit--reports}

### 1. Revisionsrettigheder {#1-audit-rights}

Leverandøren vil give Kunden alle oplysninger, der med rimelighed er nødvendige for at påvise overholdelse af denne databehandleraftale, og Leverandøren vil tillade og bidrage til revisioner, herunder inspektioner foretaget af Kunden, for at vurdere Leverandørens overholdelse af denne databehandleraftale. Leverandøren kan dog begrænse adgangen til data eller oplysninger, hvis Kundens adgang til oplysningerne ville have en negativ indvirkning på Leverandørens intellektuelle ejendomsrettigheder, fortrolighedsforpligtelser eller andre forpligtelser i henhold til gældende love. Kunden anerkender og accepterer, at Kunden kun vil udøve sine revisionsrettigheder i henhold til denne databehandleraftale og eventuelle revisionsrettigheder, der er givet i henhold til gældende databeskyttelseslove, ved at instruere Leverandøren i at overholde nedenstående rapporterings- og due diligence-krav. Leverandøren vil opbevare registre over sin overholdelse af denne databehandleraftale i 3 år efter, at databehandleraftalen udløber.

### 2. Sikkerhedsrapporter {#2-security-reports}

Kunden anerkender, at Leverandøren regelmæssigt revideres i forhold til de standarder, der er defineret i Sikkerhedspolitikken, af uafhængige tredjepartsrevisorer. Efter skriftlig anmodning vil Leverandøren fortroligt give Kunden en opsummerende kopi af sin daværende rapport, så Kunden kan verificere Leverandørens overholdelse af de standarder, der er defineret i Sikkerhedspolitikken.

### 3. Sikkerhedsmæssig due diligence {#3-security-due-diligence}

Ud over rapporten vil <strong>Udbyderen</strong> besvare rimelige anmodninger om oplysninger fra <strong>Kunden</strong> for at bekræfte <strong>Udbyderens</strong> overholdelse af denne databeskyttelsesaftale, herunder svar på spørgeskemaer om informationssikkerhed, due diligence og revision, eller ved at give yderligere oplysninger om sit informationssikkerhedsprogram. Alle sådanne anmodninger skal være skriftlige og fremsættes til <strong>Udbyderens sikkerhedskontakt</strong> og må kun fremsættes én gang om året.

## 6. Koordinering og samarbejde {#6-coordination--cooperation}

### 1. Svar på forespørgsler {#1-response-to-inquiries}

Hvis <strong>Udbyderen</strong> modtager en forespørgsel eller anmodning fra andre vedrørende behandling af kundens personoplysninger, vil <strong>Udbyderen</strong> underrette <strong>Kunden</strong> om anmodningen, og <strong>Udbyderen</strong> vil ikke svare på anmodningen uden <strong>Kundens</strong> forudgående samtykke. Eksempler på denne type forespørgsler og anmodninger omfatter en retslig, administrativ eller regulerende myndighedskendelse vedrørende kundens personoplysninger, hvor det ikke er forbudt at underrette <strong>Kunden</strong> i henhold til gældende lov, eller en anmodning fra en registreret. Hvis det er tilladt i henhold til gældende lov, vil <strong>Udbyderen</strong> følge <strong>Kundens</strong> rimelige instruktioner vedrørende disse anmodninger, herunder at give statusopdateringer og andre oplysninger, som <strong>Kunden</strong> med rimelighed anmoder om. Hvis en registreret person fremsætter en gyldig anmodning i henhold til gældende databeskyttelseslovgivning om at slette eller fravælge Kundens videregivelse af Kundens Personoplysninger til Leverandøren, vil Leverandøren hjælpe Kunden med at opfylde anmodningen i henhold til gældende databeskyttelseslovgivning. Leverandøren vil samarbejde med og yde rimelig bistand til Kunden, på Kundens regning, i forbindelse med ethvert juridisk svar eller anden proceduremæssig handling, som Kunden træffer som svar på en tredjepartsanmodning om Leverandørens behandling af Kundens Personoplysninger i henhold til denne databeskyttelsesaftale.

### 2. DPIA'er og DTIA'er {#2-dpias-and-dtias}

Hvis det kræves af gældende databeskyttelseslovgivning, vil <strong>Leverandøren</strong> i rimelig grad bistå <strong>Kunden</strong> med at udføre obligatoriske konsekvensanalyser vedrørende databeskyttelse eller konsekvensanalyser vedrørende dataoverførsel og konsultationer med relevante databeskyttelsesmyndigheder under hensyntagen til behandlingens art og kundens personoplysninger.

## 7. Sletning af kundens personlige data {#7-deletion-of-customer-personal-data}

### 1. Sletning af kunde {#1-deletion-by-customer}

<strong>Udbyderen</strong> vil give <strong>Kunden</strong> mulighed for at slette Kundens Personoplysninger på en måde, der er i overensstemmelse med Tjenesternes funktionalitet. <strong>Udbyderen</strong> vil overholde denne instruktion så hurtigt som rimeligt praktisk muligt, medmindre yderligere opbevaring af Kundens Personoplysninger er påkrævet i henhold til gældende lov.

### 2. Sletning ved DPA-udløb {#2-deletion-at-dpa-expiration}

a. Efter udløbet af databehandleraftalen vil <strong>Udbyderen</strong> returnere eller slette kundens personoplysninger efter <strong>kunden</strong>s instruktion, medmindre yderligere opbevaring af kundens personoplysninger er påkrævet eller tilladt i henhold til gældende lov. Hvis returnering eller destruktion er umulig eller forbudt i henhold til gældende lov, vil <strong>Udbyderen</strong> gøre en rimelig indsats for at forhindre yderligere behandling af kundens personoplysninger og vil fortsat beskytte de kundes personoplysninger, der forbliver i dens besiddelse, varetægt eller kontrol. For eksempel kan gældende lov kræve, at <strong>Udbyderen</strong> fortsætter med at hoste eller behandle kundens personoplysninger.

b. Hvis <strong>Kunden</strong> og <strong>Udbyderen</strong> har indgået EØS-standardkontraktbetingelserne eller det britiske tillæg som en del af denne databeskyttelsesaftale, vil <strong>Udbyderen</strong> kun give <strong>Kunden</strong> den bekræftelse på sletning af personoplysninger, der er beskrevet i punkt 8.1(d) og punkt 8.5 i EØS-standardkontraktbetingelserne, hvis <strong>Kunden</strong> anmoder om en sådan.

## 8. Ansvarsbegrænsning {#8-limitation-of-liability}

### 1. Ansvarsgrænser og ansvarsfraskrivelse {#1-liability-caps-and-damages-waiver}

**I det maksimale omfang, det er tilladt i henhold til gældende databeskyttelseslovgivning, vil hver parts samlede kumulative ansvar over for den anden part, der opstår som følge af eller i forbindelse med denne databeskyttelsesaftale, være underlagt de fraskrivelser, udelukkelser og ansvarsbegrænsninger, der er angivet i **Aftalen**.**

### 2. Krav fra nærtstående parter {#2-related-party-claims}

**Eventuelle krav mod **Udbyderen** eller dennes tilknyttede selskaber, der udspringer af eller er relateret til denne databehandleraftale, må kun fremsættes af den **Kunde**-enhed, der er part i **Aftalen**.**

### 3. Undtagelser {#3-exceptions}

1. Denne databeskyttelsesaftale begrænser ikke noget ansvar for en person vedrørende personens databeskyttelsesrettigheder i henhold til gældende databeskyttelseslovgivning. Derudover begrænser denne databeskyttelsesaftale ikke noget ansvar mellem parterne for overtrædelser af EØS-standardkontraktbestemmelserne eller det britiske tillæg.

## 9. Konflikter mellem dokumenter {#9-conflicts-between-documents}

1. Denne databeskyttelsesaftale er en del af og supplerer aftalen. Hvis der er uoverensstemmelse mellem denne databeskyttelsesaftale, **aftalen** eller nogen af deres dele, vil den del, der er anført tidligere, have forrang over den del, der er anført senere, i tilfælde af den pågældende uoverensstemmelse: (1) EØS-standardkontraktbestemmelserne eller UK-tillægget, (2) denne databeskyttelsesaftale og derefter (3) **aftalen**.

## 10. Aftaleperiode {#10-term-of-agreement}

Denne databeskyttelsesaftale træder i kraft, når <strong>Udbyderen</strong> og <strong>Kunden</strong> aftaler en forside til databeskyttelsesaftalen og underskriver eller elektronisk accepterer <strong>Aftalen</strong>, og fortsætter, indtil <strong>Aftalen</strong> udløber eller opsiges. Dog forbliver <strong>Udbyderen</strong> og <strong>Kunden</strong> begge underlagt forpligtelserne i denne databeskyttelsesaftale og gældende databeskyttelseslovgivning, indtil <strong>Kunden</strong> ophører med at overføre kundens personoplysninger til <strong>Udbyderen</strong>, og <strong>Udbyderen</strong> ophører med at behandle kundens personoplysninger.

## 11. Gældende lov og valgte domstole {#11-governing-law-and-chosen-courts}

Uanset gældende lov eller lignende klausuler i **Aftalen** skal alle fortolkninger og tvister vedrørende denne databeskyttelsesaftale være underlagt lovgivningen i **Styrelsesstaten** uden hensyn til dens bestemmelser om lovvalg. Derudover, og uanset forumvalg, jurisdiktion eller lignende klausuler i **Aftalen**, accepterer parterne at anlægge enhver retssag, handling eller procedure vedrørende denne databeskyttelsesaftale ved, og hver part underkaster sig uigenkaldeligt den eksklusive jurisdiktion for, domstolene i **Styrelsesstaten**.

## 12. Forhold til tjenesteudbyder {#12-service-provider-relationship}

I det omfang California Consumer Privacy Act, Cal. Civ. Code § 1798.100 ff. ("CCPA") finder anvendelse, anerkender og accepterer parterne, at <strong>Udbyderen</strong> er en tjenesteudbyder og modtager personoplysninger fra <strong>Kunden</strong> for at levere tjenesten som aftalt i <strong>Aftalen</strong>, hvilket udgør et forretningsformål. <strong>Udbyderen</strong> vil ikke sælge nogen personoplysninger, der er leveret af <strong>Kunden</strong> i henhold til <strong>Aftalen</strong>. Derudover vil <strong>Udbyderen</strong> ikke opbevare, bruge eller videregive nogen personoplysninger, der er leveret af <strong>Kunden</strong> i henhold til <strong>Aftalen</strong>, undtagen i det omfang det er nødvendigt for at levere tjenesten til <strong>Kunden</strong>, som angivet i <strong>Aftalen</strong>, eller som tilladt i henhold til gældende databeskyttelseslovgivning. <strong>Udbyderen</strong> bekræfter, at den forstår begrænsningerne i dette afsnit.

## 13. Definitioner {#13-definitions}

1. **"Gældende love"** betyder love, regler, bestemmelser, retskendelser og andre bindende krav fra en relevant myndighed, der gælder for eller styrer en part.

2. **"Gældende databeskyttelseslove"** betyder de gældende love, der regulerer, hvordan Tjenesten må behandle eller bruge en persons personlige oplysninger, personoplysninger, personligt identificerbare oplysninger eller andre lignende udtryk.

3. **"Ansvarlig"** har den(de) betydning(er), der er angivet i gældende databeskyttelseslovgivning for den virksomhed, der bestemmer formålet med og omfanget af behandlingen af personoplysninger.

4. **"Forside"** betyder et dokument, der er underskrevet eller elektronisk accepteret af parterne, som inkorporerer disse standardvilkår for databehandling og identificerer **Leverandør**, **Kunde** samt emnet og detaljerne for databehandlingen.

5. **"Kundens personoplysninger"** betyder personoplysninger, som **Kunden** uploader eller leverer til **Udbyderen** som en del af Tjenesten, og som er underlagt denne databeskyttelsesaftale.

6. **"DPA"** betyder disse DPA-standardvilkår, forsiden mellem <strong>Udbyder</strong> og <strong>Kunde</strong> samt de politikker og dokumenter, der henvises til i eller er vedhæftet forsiden.

7. **"EØS-standardkontraktbestemmelser"** betyder de standardkontraktbestemmelser, der er knyttet som bilag til Europa-Kommissionens gennemførelsesafgørelse 2021/914 af 4. juni 2021 om standardkontraktbestemmelser for overførsel af personoplysninger til tredjelande i henhold til Europa-Parlamentets og Det Europæiske Råds forordning (EU) 2016/679.

8. **"Det Europæiske Økonomiske Samarbejdsområde"** eller **"EØS"** betyder medlemsstaterne i Den Europæiske Union, Norge, Island og Liechtenstein.

9. **"GDPR"** betyder Den Europæiske Unions forordning 2016/679 som implementeret ved lokal lovgivning i den relevante EØS-medlemsstat.

10. **"Personoplysninger"** har den(de) betydning(er), der er angivet i gældende databeskyttelseslovgivning for personlige oplysninger, personoplysninger eller andre lignende udtryk.

11. **"Behandling"** eller **"Proces"** har den(de) betydning(er), der er angivet i gældende databeskyttelseslovgivning, for enhver brug af eller udførelse af en computerhandling på personoplysninger, herunder ved automatiske metoder.

12. **"Databehandler"** har den(de) betydning(er), der er angivet i gældende databeskyttelseslovgivning for den virksomhed, der behandler personoplysninger på vegne af den dataansvarlige.

13. **"Rapport"** betyder revisionsrapporter udarbejdet af en anden virksomhed i henhold til de standarder, der er defineret i sikkerhedspolitikken på vegne af udbyderen.

14. **"Begrænset overførsel"** betyder (a) hvor GDPR finder anvendelse, en overførsel af personoplysninger fra EØS til et land uden for EØS, som ikke er underlagt en tilstrækkelighedsvurdering fra Europa-Kommissionen; og (b) hvor den britiske GDPR finder anvendelse, en overførsel af personoplysninger fra Storbritannien til ethvert andet land, som ikke er underlagt tilstrækkelighedsbestemmelser vedtaget i henhold til afsnit 17A i den britiske databeskyttelseslov fra 2018.

15. **"Sikkerhedshændelse"** betyder et brud på persondatasikkerheden som defineret i artikel 4 i GDPR.

16. **"Tjenesteydelse"** betyder det produkt og/eller de tjenester, der er beskrevet i **Aftalen**.

17. **"Særlige kategoridata"** har den betydning, der er angivet i artikel 9 i GDPR.

18. **"Underdatabehandler"** har den(de) betydning(er), der er angivet i gældende databeskyttelseslovgivning for en virksomhed, der med den dataansvarliges godkendelse og accept bistår databehandleren med at behandle personoplysninger på vegne af den dataansvarlige.

19. **"UK GDPR"** betyder Den Europæiske Unions forordning 2016/679 som implementeret ved afsnit 3 i Det Forenede Kongeriges lov om Den Europæiske Union (Udtrædelseslov) af 2018 i Det Forenede Kongerige.

20. **"UK-tillæg"** betyder det internationale tillæg til dataoverførsel til EØS-standardkontraktbetingelserne udstedt af Information Commissioner for Parties making Restricted Transfers i henhold til S119A(1) Data Protection Act 2018.

## Krediteringer {#credits}

Dette dokument er en afledning af [Fælles standardvilkår for databeskyttelsesaftaler (version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) og er licenseret under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).