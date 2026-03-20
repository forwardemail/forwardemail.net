# Databehandlingsaftale {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Nøglebegreber](#key-terms)
* [Ændringer i aftalen](#changes-to-the-agreement)
* [1. Behandler- og underbehandlerforhold](#1-processor-and-subprocessor-relationships)
  * [1. Udbyder som behandler](#1-provider-as-processor)
  * [2. Udbyder som underbehandler](#2-provider-as-subprocessor)
* [2. Behandling](#2-processing)
  * [1. Behandlingsdetaljer](#1-processing-details)
  * [2. Behandlingsinstruktioner](#2-processing-instructions)
  * [3. Behandling af udbyder](#3-processing-by-provider)
  * [4. Kundens behandling](#4-customer-processing)
  * [5. Samtykke til behandling](#5-consent-to-processing)
  * [6. Underbehandlere](#6-subprocessors)
* [3. Begrænsede overførsler](#3-restricted-transfers)
  * [1. Autorisation](#1-authorization)
  * [2. Overførsler uden for EØS](#2-ex-eea-transfers)
  * [3. Overførsler uden for UK](#3-ex-uk-transfers)
  * [4. Andre internationale overførsler](#4-other-international-transfers)
* [4. Håndtering af sikkerhedshændelser](#4-security-incident-response)
* [5. Revision og rapporter](#5-audit--reports)
  * [1. Revisionsrettigheder](#1-audit-rights)
  * [2. Sikkerhedsrapporter](#2-security-reports)
  * [3. Sikkerhedsmæssig due diligence](#3-security-due-diligence)
* [6. Koordination og samarbejde](#6-coordination--cooperation)
  * [1. Respons på forespørgsler](#1-response-to-inquiries)
  * [2. DPIA'er og DTIA'er](#2-dpias-and-dtias)
* [7. Sletning af kundens personoplysninger](#7-deletion-of-customer-personal-data)
  * [1. Sletning af kunde](#1-deletion-by-customer)
  * [2. Sletning ved DPA-udløb](#2-deletion-at-dpa-expiration)
* [8. Ansvarsbegrænsning](#8-limitation-of-liability)
  * [1. Ansvarstak og frafald af erstatning](#1-liability-caps-and-damages-waiver)
  * [2. Krav fra relaterede parter](#2-related-party-claims)
  * [3. Undtagelser](#3-exceptions)
* [9. Konflikter mellem dokumenter](#9-conflicts-between-documents)
* [10. Aftalens løbetid](#10-term-of-agreement)
* [11. Gældende lov og valgte domstole](#11-governing-law-and-chosen-courts)
* [12. Forhold til tjenesteudbyder](#12-service-provider-relationship)
* [13. Definitioner](#13-definitions)
* [Credits](#credits)


## Nøglebegreber {#key-terms}

| Term                                       | Værdi                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Aftale</strong>                     | Denne DPA supplerer [Servicevilkårene](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| <strong>Godkendte underbehandlere</strong> | [Cloudflare](https://cloudflare.com) (USA; DNS, netværk og sikkerhedsudbyder), [DataPacket](https://www.datapacket.com/) (USA/UK; hostingudbyder), [Digital Ocean](https://digitalocean.com) (USA; hostingudbyder), [GitHub](https://github.com) (USA; kildekodehosting, CI/CD og projektstyring), [Vultr](https://www.vultr.com) (USA; hostingudbyder), [Stripe](https://stripe.com) (USA; betalingsbehandler), [PayPal](https://paypal.com) (USA; betalingsbehandler) |
| <strong>Udbyders sikkerhedskontakt</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Sikkerhedspolitik</strong>          | Se [vores sikkerhedspolitik på GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                           |
| <strong>Gældende stat</strong>               | Delaware, USA                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
## Ændringer til Aftalen {#changes-to-the-agreement}

Dette dokument er en afledning af [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) og følgende ændringer er foretaget:

1. [Lovvalg og Valgte Domstole](#11-governing-law-and-chosen-courts) er inkluderet som en sektion nedenfor med `Governing State` identificeret ovenfor.
2. [Serviceudbyderforhold](#12-service-provider-relationship) er inkluderet som en sektion nedenfor.


## 1. Behandler- og Underbehandlerforhold {#1-processor-and-subprocessor-relationships}

### 1. Udbyder som Behandler {#1-provider-as-processor}

I situationer hvor <strong>Kunden</strong> er en Dataansvarlig for Kundens Personoplysninger, vil <strong>Udbyderen</strong> blive betragtet som en Behandler, der behandler Personoplysninger på vegne af <strong>Kunden</strong>.

### 2. Udbyder som Underbehandler {#2-provider-as-subprocessor}

I situationer hvor <strong>Kunden</strong> er en Behandler af Kundens Personoplysninger, vil <strong>Udbyderen</strong> blive betragtet som en Underbehandler af Kundens Personoplysninger.


## 2. Behandling {#2-processing}

### 1. Behandlingsdetaljer {#1-processing-details}

Bilag I(B) på Forsiden beskriver genstanden, arten, formålet og varigheden af denne Behandling samt <strong>Kategorier af Personoplysninger</strong> indsamlet og <strong>Kategorier af Registrerede</strong>.

### 2. Behandlingsinstruktioner {#2-processing-instructions}

<strong>Kunden</strong> instruerer <strong>Udbyderen</strong> til at behandle Kundens Personoplysninger: (a) for at levere og vedligeholde Tjenesten; (b) som yderligere kan specificeres gennem <strong>Kundens</strong> brug af Tjenesten; (c) som dokumenteret i <strong>Aftalen</strong>; og (d) som dokumenteret i andre skriftlige instruktioner givet af <strong>Kunden</strong> og anerkendt af <strong>Udbyderen</strong> om behandling af Kundens Personoplysninger under denne DPA. <strong>Udbyderen</strong> vil overholde disse instruktioner, medmindre det er forbudt ved gældende lovgivning. <strong>Udbyderen</strong> vil straks informere <strong>Kunden</strong>, hvis det ikke er muligt at følge behandlingsinstruktionerne. <strong>Kunden</strong> har givet og vil kun give instruktioner, der overholder gældende lovgivning.

### 3. Behandling af Udbyderen {#3-processing-by-provider}

<strong>Udbyderen</strong> vil kun behandle Kundens Personoplysninger i overensstemmelse med denne DPA, inklusive detaljerne på Forsiden. Hvis <strong>Udbyderen</strong> opdaterer Tjenesten for at opdatere eksisterende eller inkludere nye produkter, funktioner eller funktionaliteter, kan <strong>Udbyderen</strong> ændre <strong>Kategorier af Registrerede</strong>, <strong>Kategorier af Personoplysninger</strong>, <strong>Særlige Kategorier af Data</strong>, <strong>Begrænsninger eller Sikkerhedsforanstaltninger for Særlige Kategorier af Data</strong>, <strong>Overførselsfrekvens</strong>, <strong>Arten og Formålet med Behandlingen</strong> og <strong>Varigheden af Behandlingen</strong> efter behov for at afspejle opdateringerne ved at underrette <strong>Kunden</strong> om opdateringerne og ændringerne.

### 4. Kundens Behandling {#4-customer-processing}

Hvor <strong>Kunden</strong> er en Behandler og <strong>Udbyderen</strong> er en Underbehandler, vil <strong>Kunden</strong> overholde alle gældende love, der gælder for <strong>Kundens</strong> behandling af Kundens Personoplysninger. <strong>Kundens</strong> aftale med sin Dataansvarlige vil tilsvarende kræve, at <strong>Kunden</strong> overholder alle gældende love, der gælder for <strong>Kunden</strong> som Behandler. Derudover vil <strong>Kunden</strong> overholde kravene til Underbehandler i <strong>Kundens</strong> aftale med sin Dataansvarlige.

### 5. Samtykke til Behandling {#5-consent-to-processing}

<strong>Kunden</strong> har overholdt og vil fortsat overholde alle gældende databeskyttelseslove vedrørende sin levering af Kundens Personoplysninger til <strong>Udbyderen</strong> og/eller Tjenesten, herunder at foretage alle nødvendige oplysninger, indhente alle samtykker, give tilstrækkeligt valg og implementere relevante sikkerhedsforanstaltninger krævet under gældende databeskyttelseslove.
### 6. Underleverandører {#6-subprocessors}

a. <strong>Udbyder</strong> vil ikke levere, overføre eller udlevere nogen Kunders Personoplysninger til en Underleverandør, medmindre <strong>Kunden</strong> har godkendt Underleverandøren. Den aktuelle liste over <strong>Godkendte Underleverandører</strong> indeholder identiteten af Underleverandørerne, deres landebeliggenhed og deres forventede Behandlingsopgaver. <strong>Udbyder</strong> vil informere <strong>Kunden</strong> mindst 10 arbejdsdage i forvejen og skriftligt om enhver planlagt ændring af de <strong>Godkendte Underleverandører</strong>, hvad enten det er ved tilføjelse eller udskiftning af en Underleverandør, hvilket giver <strong>Kunden</strong> tilstrækkelig tid til at gøre indsigelse mod ændringerne, før <strong>Udbyder</strong> begynder at anvende den nye Underleverandør(er). <strong>Udbyder</strong> vil give <strong>Kunden</strong> de nødvendige oplysninger, så <strong>Kunden</strong> kan udøve sin ret til at gøre indsigelse mod ændringen af de <strong>Godkendte Underleverandører</strong>. <strong>Kunden</strong> har 30 dage efter meddelelse om en ændring af de <strong>Godkendte Underleverandører</strong> til at gøre indsigelse, ellers anses <strong>Kunden</strong> for at acceptere ændringerne. Hvis <strong>Kunden</strong> gør indsigelse mod ændringen inden for 30 dage efter meddelelse, vil <strong>Kunden</strong> og <strong>Udbyder</strong> samarbejde i god tro for at løse <strong>Kundens</strong> indsigelse eller bekymring.

b. Når <strong>Udbyder</strong> engagerer en Underleverandør, vil <strong>Udbyder</strong> have en skriftlig aftale med Underleverandøren, der sikrer, at Underleverandøren kun får adgang til og bruger Kundens Personoplysninger (i) i det omfang det er nødvendigt for at udføre de underleverede forpligtelser, og (ii) i overensstemmelse med vilkårene i <strong>Aftalen</strong>.

c. Hvis GDPR gælder for Behandlingen af Kundens Personoplysninger, (i) pålægges databeskyttelsesforpligtelserne beskrevet i denne DPA (som henvist til i artikel 28, stk. 3 i GDPR, hvis relevant) også Underleverandøren, og (ii) vil <strong>Udbyders</strong> aftale med Underleverandøren indeholde disse forpligtelser, herunder detaljer om, hvordan <strong>Udbyder</strong> og dens Underleverandør vil koordinere for at besvare forespørgsler eller anmodninger om Behandlingen af Kundens Personoplysninger. Derudover vil <strong>Udbyder</strong> på <strong>Kundens</strong> anmodning dele en kopi af sine aftaler (inklusive eventuelle ændringer) med sine Underleverandører. I det omfang det er nødvendigt for at beskytte forretningshemmeligheder eller andre fortrolige oplysninger, herunder personoplysninger, kan <strong>Udbyder</strong> redigere teksten i sin aftale med sin Underleverandør, inden en kopi deles.

d. <strong>Udbyder</strong> forbliver fuldt ansvarlig for alle forpligtelser, der er underleveret til sine Underleverandører, herunder handlinger og undladelser fra sine Underleverandørers side i forbindelse med Behandlingen af Kundens Personoplysninger. <strong>Udbyder</strong> vil underrette Kunden om enhver fejl fra sine Underleverandørers side i opfyldelsen af en væsentlig forpligtelse vedrørende Kundens Personoplysninger under aftalen mellem <strong>Udbyder</strong> og Underleverandøren.


## 3. Begrænsede Overførsler {#3-restricted-transfers}

### 1. Autorisation {#1-authorization}

<strong>Kunden</strong> accepterer, at <strong>Udbyder</strong> kan overføre Kundens Personoplysninger uden for EØS, Storbritannien eller andet relevant geografisk område, som nødvendigt for at levere Tjenesten. Hvis <strong>Udbyder</strong> overfører Kundens Personoplysninger til et område, for hvilket Europa-Kommissionen eller anden relevant tilsynsmyndighed ikke har udstedt en afgørelse om tilstrækkelighed, vil <strong>Udbyder</strong> implementere passende garantier for overførslen af Kundens Personoplysninger til dette område i overensstemmelse med gældende databeskyttelseslovgivning.

### 2. Overførsler uden for EØS {#2-ex-eea-transfers}

<strong>Kunden</strong> og <strong>Udbyder</strong> er enige om, at hvis GDPR beskytter overførslen af Kundens Personoplysninger, overførslen sker fra <strong>Kunden</strong> inden for EØS til <strong>Udbyder</strong> uden for EØS, og overførslen ikke er reguleret af en afgørelse om tilstrækkelighed truffet af Europa-Kommissionen, så anses <strong>Kunden</strong> og <strong>Udbyder</strong> ved indgåelsen af denne DPA for at have underskrevet EØS SCC'erne og deres bilag, som er indarbejdet ved henvisning. Enhver sådan overførsel sker i henhold til EØS SCC'erne, som udfyldes som følger:
a. Modul To (Dataansvarlig til Databehandler) i EØS SCC'erne gælder, når <strong>Kunden</strong> er Dataansvarlig, og <strong>Udbyderen</strong> behandler Kundens Personoplysninger for <strong>Kunden</strong> som Databehandler.

b. Modul Tre (Databehandler til Underdatabehandler) i EØS SCC'erne gælder, når <strong>Kunden</strong> er Databehandler, og <strong>Udbyderen</strong> behandler Kundens Personoplysninger på vegne af <strong>Kunden</strong> som Underdatabehandler.

c. For hvert modul gælder følgende (når relevant):

1. Den valgfrie dockingklausul i Klausul 7 gælder ikke;

2. I Klausul 9 gælder Mulighed 2 (generel skriftlig tilladelse), og den minimale varslingsperiode for ændringer af Underdatabehandler er 10 arbejdsdage;

3. I Klausul 11 gælder den valgfrie sprogtekst ikke;

4. Alle firkantede parenteser i Klausul 13 fjernes;

5. I Klausul 17 (Mulighed 1) vil EØS SCC'erne være underlagt lovgivningen i <strong>Den Styrende Medlemsstat</strong>;

6. I Klausul 18(b) vil tvister blive afgjort ved domstolene i <strong>Den Styrende Medlemsstat</strong>; og

7. Forsiden til denne DPA indeholder de oplysninger, der kræves i Bilag I, Bilag II og Bilag III til EØS SCC'erne.

### 3. Overførsler uden for Storbritannien {#3-ex-uk-transfers}

<strong>Kunden</strong> og <strong>Udbyderen</strong> er enige om, at hvis UK GDPR beskytter overførslen af Kundens Personoplysninger, og overførslen sker fra <strong>Kunden</strong> inden for Det Forenede Kongerige til <strong>Udbyderen</strong> uden for Det Forenede Kongerige, og overførslen ikke er omfattet af en tilstrækkelighedsafgørelse truffet af den britiske udenrigsminister, så anses <strong>Kunden</strong> og <strong>Udbyderen</strong> ved indgåelsen af denne DPA for at have underskrevet UK-tilføjelsen og dens bilag, som er indarbejdet ved henvisning. Enhver sådan overførsel sker i henhold til UK-tilføjelsen, som udfyldes som følger:

a. Afsnit 3.2 i denne DPA indeholder de oplysninger, der kræves i Tabel 2 i UK-tilføjelsen.

b. Tabel 4 i UK-tilføjelsen ændres som følger: Ingen af parterne kan opsige UK-tilføjelsen som angivet i Afsnit 19 i UK-tilføjelsen; i det omfang ICO udsteder en revideret godkendt tilføjelse i henhold til Afsnit ‎18 i UK-tilføjelsen, vil parterne i god tro arbejde på at revidere denne DPA i overensstemmelse hermed.

c. Forsiden indeholder de oplysninger, der kræves i Bilag 1A, Bilag 1B, Bilag II og Bilag III til UK-tilføjelsen.

### 4. Andre internationale overførsler {#4-other-international-transfers}

For overførsler af Personoplysninger, hvor schweizisk lovgivning (og ikke lovgivningen i en EØS-medlemsstat eller Det Forenede Kongerige) gælder for den internationale karakter af overførslen, ændres henvisninger til GDPR i Klausul 4 i EØS SCC'erne, i det omfang det er juridisk påkrævet, til i stedet at henvise til den schweiziske føderale databeskyttelseslov eller dens efterfølger, og begrebet tilsynsmyndighed vil inkludere den schweiziske føderale databeskyttelses- og informationskommissær.

## 4. Håndtering af sikkerhedshændelser {#4-security-incident-response}

1. Når <strong>Udbyderen</strong> bliver opmærksom på en sikkerhedshændelse, vil <strong>Udbyderen</strong>: (a) underrette <strong>Kunden</strong> uden unødig forsinkelse, når det er muligt, men senest 72 timer efter at være blevet opmærksom på sikkerhedshændelsen; (b) give rettidig information om sikkerhedshændelsen, efterhånden som den bliver kendt eller efter rimeligt ønske fra <strong>Kunden</strong>; og (c) straks tage rimelige skridt til at begrænse og undersøge sikkerhedshændelsen. <strong>Udbyderens</strong> underretning om eller reaktion på en sikkerhedshændelse som krævet i denne DPA skal ikke fortolkes som en anerkendelse fra <strong>Udbyderen</strong> af nogen skyld eller ansvar for sikkerhedshændelsen.

## 5. Revision og rapporter {#5-audit--reports}

### 1. Revisionsrettigheder {#1-audit-rights}

<strong>Udbyderen</strong> vil give <strong>Kunden</strong> alle oplysninger, der med rimelighed er nødvendige for at demonstrere overholdelse af denne DPA, og <strong>Udbyderen</strong> vil tillade og bidrage til revisioner, herunder inspektioner foretaget af <strong>Kunden</strong>, for at vurdere <strong>Udbyderens</strong> overholdelse af denne DPA. Dog kan <strong>Udbyderen</strong> begrænse adgangen til data eller oplysninger, hvis <strong>Kundens</strong> adgang til oplysningerne negativt ville påvirke <strong>Udbyderens</strong> immaterielle rettigheder, fortrolighedsforpligtelser eller andre forpligtelser i henhold til gældende lovgivning. <strong>Kunden</strong> anerkender og accepterer, at den kun vil udøve sine revisionsrettigheder i henhold til denne DPA og eventuelle revisionsrettigheder, der er givet i henhold til gældende databeskyttelseslovgivning, ved at instruere <strong>Udbyderen</strong> om at overholde rapporterings- og due diligence-kravene nedenfor. <strong>Udbyderen</strong> vil opbevare dokumentation for sin overholdelse af denne DPA i 3 år efter DPA'ens ophør.
### 2. Sikkerhedsrapporter {#2-security-reports}

<strong>Kunden</strong> anerkender, at <strong>Udbyderen</strong> regelmæssigt revideres i forhold til de standarder, der er defineret i <strong>Sikkerhedspolitikken</strong> af uafhængige tredjepartsrevisorer. Efter skriftlig anmodning vil <strong>Udbyderen</strong> give <strong>Kunden</strong>, på fortrolig basis, en sammendraget kopi af sin daværende Rapport, så <strong>Kunden</strong> kan verificere <strong>Udbyderens</strong> overholdelse af de standarder, der er defineret i <strong>Sikkerhedspolitikken</strong>.

### 3. Sikkerhedsmæssig Due Diligence {#3-security-due-diligence}

Ud over Rapporten vil <strong>Udbyderen</strong> svare på rimelige informationsanmodninger fra <strong>Kunden</strong> for at bekræfte <strong>Udbyderens</strong> overholdelse af denne DPA, herunder svar på informationssikkerhed, due diligence og revisionsspørgeskemaer, eller ved at give yderligere oplysninger om sit informationssikkerhedsprogram. Alle sådanne anmodninger skal være skriftlige og rettes til <strong>Udbyderens Sikkerhedskontakt</strong> og må kun foretages én gang om året.


## 6. Koordination & Samarbejde {#6-coordination--cooperation}

### 1. Svar på Forespørgsler {#1-response-to-inquiries}

Hvis <strong>Udbyderen</strong> modtager en forespørgsel eller anmodning fra andre om Behandlingen af Kundens Personoplysninger, vil <strong>Udbyderen</strong> underrette <strong>Kunden</strong> om anmodningen, og <strong>Udbyderen</strong> vil ikke svare på anmodningen uden <strong>Kundens</strong> forudgående samtykke. Eksempler på denne slags forespørgsler og anmodninger inkluderer en retslig, administrativ eller regulatorisk myndighedsordre vedrørende Kundens Personoplysninger, hvor underretning af <strong>Kunden</strong> ikke er forbudt ved gældende lovgivning, eller en anmodning fra en registreret person. Hvis det er tilladt efter gældende lovgivning, vil <strong>Udbyderen</strong> følge <strong>Kundens</strong> rimelige instruktioner vedrørende disse anmodninger, herunder at give statusopdateringer og anden information, som <strong>Kunden</strong> rimeligt anmoder om. Hvis en registreret person fremsætter en gyldig anmodning i henhold til gældende databeskyttelseslove om at slette eller fravælge <strong>Kundens</strong> videregivelse af Kundens Personoplysninger til <strong>Udbyderen</strong>, vil <strong>Udbyderen</strong> bistå <strong>Kunden</strong> med at opfylde anmodningen i overensstemmelse med gældende databeskyttelseslovgivning. <strong>Udbyderen</strong> vil samarbejde med og yde rimelig bistand til <strong>Kunden</strong>, på <strong>Kundens</strong> regning, i ethvert juridisk svar eller anden proceduremæssig handling, som <strong>Kunden</strong> foretager som svar på en tredjepartsanmodning vedrørende <strong>Udbyderens</strong> Behandling af Kundens Personoplysninger under denne DPA.

### 2. DPIA'er og DTIA'er {#2-dpias-and-dtias}

Hvis det kræves af gældende databeskyttelseslove, vil <strong>Udbyderen</strong> rimeligt bistå <strong>Kunden</strong> med at gennemføre eventuelle påkrævede konsekvensanalyser for databeskyttelse eller konsekvensanalyser for dataoverførsel samt konsultationer med relevante databeskyttelsesmyndigheder, under hensyntagen til arten af Behandlingen og Kundens Personoplysninger.


## 7. Sletning af Kundens Personoplysninger {#7-deletion-of-customer-personal-data}

### 1. Sletning af Kunden {#1-deletion-by-customer}

<strong>Udbyderen</strong> vil gøre det muligt for <strong>Kunden</strong> at slette Kundens Personoplysninger på en måde, der er i overensstemmelse med funktionaliteten af Tjenesterne. <strong>Udbyderen</strong> vil efterkomme denne instruktion så hurtigt som rimeligt muligt, undtagen hvor yderligere opbevaring af Kundens Personoplysninger kræves ved gældende lovgivning.

### 2. Sletning ved DPA-udløb {#2-deletion-at-dpa-expiration}

a. Efter DPA'ens udløb vil <strong>Udbyderen</strong> returnere eller slette Kundens Personoplysninger efter <strong>Kundens</strong> instruktion, medmindre yderligere opbevaring af Kundens Personoplysninger kræves eller er tilladt ved gældende lovgivning. Hvis returnering eller destruktion er upraktisk eller forbudt ved gældende lovgivning, vil <strong>Udbyderen</strong> gøre rimelige bestræbelser på at forhindre yderligere Behandling af Kundens Personoplysninger og vil fortsat beskytte de Kundens Personoplysninger, der er tilbage i dens besiddelse, varetægt eller kontrol. For eksempel kan gældende lovgivning kræve, at <strong>Udbyderen</strong> fortsætter med at hoste eller behandle Kundens Personoplysninger.
b. Hvis <strong>Kunden</strong> og <strong>Udbyderen</strong> har indgået EØS SCC'erne eller den britiske tillægsaftale som en del af denne DPA, vil <strong>Udbyderen</strong> kun give <strong>Kunden</strong> den certificering af sletning af personoplysninger, der er beskrevet i klausul 8.1(d) og klausul 8.5 i EØS SCC'erne, hvis <strong>Kunden</strong> anmoder om det.


## 8. Ansvarsbegrænsning {#8-limitation-of-liability}

### 1. Ansvarsloft og frafald af erstatning {#1-liability-caps-and-damages-waiver}

**I det omfang det er tilladt under gældende databeskyttelseslovgivning, vil hver parts samlede kumulative ansvar over for den anden part, som opstår som følge af eller i forbindelse med denne DPA, være underlagt de frafald, undtagelser og ansvarsbegrænsninger, der er angivet i <strong>Aftalen</strong>.**

### 2. Krav fra relaterede parter {#2-related-party-claims}

**Eventuelle krav mod <strong>Udbyderen</strong> eller dets tilknyttede selskaber, som opstår som følge af eller i forbindelse med denne DPA, kan kun rejses af den <strong>Kunde</strong>-enhed, der er part i <strong>Aftalen</strong>.**

### 3. Undtagelser {#3-exceptions}

1. Denne DPA begrænser ikke noget ansvar over for en enkeltperson vedrørende den enkeltes databeskyttelsesrettigheder under gældende databeskyttelseslovgivning. Derudover begrænser denne DPA ikke noget ansvar mellem parterne for overtrædelser af EØS SCC'erne eller den britiske tillægsaftale.


## 9. Konflikter mellem dokumenter {#9-conflicts-between-documents}

1. Denne DPA udgør en del af og supplerer Aftalen. Hvis der er nogen uoverensstemmelse mellem denne DPA, <strong>Aftalen</strong> eller nogen af deres dele, vil den tidligere nævnte del have forrang frem for den senere nævnte del for den pågældende uoverensstemmelse: (1) EØS SCC'erne eller den britiske tillægsaftale, (2) denne DPA, og derefter (3) <strong>Aftalen</strong>.


## 10. Aftalens løbetid {#10-term-of-agreement}

Denne DPA træder i kraft, når <strong>Udbyderen</strong> og <strong>Kunden</strong> accepterer en forside til DPA'en og underskriver eller elektronisk accepterer <strong>Aftalen</strong>, og fortsætter indtil <strong>Aftalen</strong> udløber eller opsiges. Dog vil både <strong>Udbyderen</strong> og <strong>Kunden</strong> fortsat være underlagt forpligtelserne i denne DPA og gældende databeskyttelseslovgivning, indtil <strong>Kunden</strong> ophører med at overføre kundens personoplysninger til <strong>Udbyderen</strong>, og <strong>Udbyderen</strong> ophører med at behandle kundens personoplysninger.


## 11. Lovvalg og værneting {#11-governing-law-and-chosen-courts}

Uanset lovvalgsklausuler eller lignende i <strong>Aftalen</strong>, vil alle fortolkninger og tvister vedrørende denne DPA være underlagt lovgivningen i <strong>Lovvalgsstaten</strong> uden hensyn til dens regler om lovkonflikter. Derudover, og uanset forumvalg, jurisdiktion eller lignende klausuler i <strong>Aftalen</strong>, accepterer parterne at anlægge enhver retssag, handling eller procedure vedrørende denne DPA ved, og hver part underkaster sig uigenkaldeligt den eksklusive jurisdiktion for, domstolene i <strong>Lovvalgsstaten</strong>.


## 12. Forholdet som tjenesteudbyder {#12-service-provider-relationship}

I det omfang California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq ("CCPA") finder anvendelse, anerkender og accepterer parterne, at <strong>Udbyderen</strong> er en tjenesteudbyder og modtager personoplysninger fra <strong>Kunden</strong> for at levere tjenesten som aftalt i <strong>Aftalen</strong>, hvilket udgør et forretningsformål. <strong>Udbyderen</strong> vil ikke sælge nogen personoplysninger leveret af <strong>Kunden</strong> under <strong>Aftalen</strong>. Derudover vil <strong>Udbyderen</strong> ikke opbevare, bruge eller videregive nogen personoplysninger leveret af <strong>Kunden</strong> under <strong>Aftalen</strong> undtagen som nødvendigt for at levere tjenesten til <strong>Kunden</strong>, som angivet i <strong>Aftalen</strong>, eller som tilladt af gældende databeskyttelseslovgivning. <strong>Udbyderen</strong> bekræfter, at den forstår begrænsningerne i dette afsnit.
## 13. Definitioner {#13-definitions}

1. **"Gældende love"** betyder de love, regler, forskrifter, retskendelser og andre bindende krav fra en relevant myndighed, som gælder for eller regulerer en part.

2. **"Gældende databeskyttelseslove"** betyder de gældende love, der regulerer, hvordan Tjenesten må behandle eller bruge en persons personlige oplysninger, persondata, personligt identificerbare oplysninger eller andet lignende udtryk.

3. **"Dataansvarlig"** vil have den betydning, der gives i de gældende databeskyttelseslove for det selskab, der bestemmer formålet og omfanget af behandlingen af persondata.

4. **"Forside"** betyder et dokument, der er underskrevet eller elektronisk accepteret af parterne, som inkorporerer disse DPA Standardbetingelser og identificerer <strong>Udbyder</strong>, <strong>Kunde</strong> og emnet samt detaljer om databehandlingen.

5. **"Kundens persondata"** betyder persondata, som <strong>Kunden</strong> uploader eller leverer til <strong>Udbyderen</strong> som en del af Tjenesten, og som er omfattet af denne DPA.

6. **"DPA"** betyder disse DPA Standardbetingelser, Forsiden mellem <strong>Udbyder</strong> og <strong>Kunde</strong> samt de politikker og dokumenter, der henvises til i eller er vedhæftet Forsiden.

7. **"EEA SCCs"** betyder de standardkontraktbestemmelser, der er bilagt Europa-Kommissionens gennemførelsesbeslutning 2021/914 af 4. juni 2021 om standardkontraktbestemmelser for overførsel af persondata til tredjelande i henhold til forordning (EU) 2016/679 fra Europa-Parlamentet og Rådet.

8. **"Det Europæiske Økonomiske Samarbejdsområde"** eller **"EØS"** betyder medlemsstaterne i Den Europæiske Union, Norge, Island og Liechtenstein.

9. **"GDPR"** betyder EU-forordning 2016/679 som implementeret i lokal lovgivning i den relevante EØS-medlemsstat.

10. **"Persondata"** vil have den betydning, der gives i de gældende databeskyttelseslove for personlige oplysninger, persondata eller andet lignende udtryk.

11. **"Behandling"** eller **"Behandle"** vil have den betydning, der gives i de gældende databeskyttelseslove for enhver anvendelse af eller udførelse af en computeroperation på persondata, herunder ved automatiske metoder.

12. **"Databehandler"** vil have den betydning, der gives i de gældende databeskyttelseslove for det selskab, der behandler persondata på vegne af den dataansvarlige.

13. **"Rapport"** betyder revisionsrapporter udarbejdet af et andet selskab i henhold til standarderne defineret i Sikkerhedspolitikken på vegne af Udbyderen.

14. **"Begrænset overførsel"** betyder (a) hvor GDPR gælder, en overførsel af persondata fra EØS til et land uden for EØS, som ikke er omfattet af en tilstrækkelighedsvurdering foretaget af Europa-Kommissionen; og (b) hvor UK GDPR gælder, en overførsel af persondata fra Storbritannien til ethvert andet land, som ikke er omfattet af tilstrækkelighedsregler vedtaget i henhold til afsnit 17A i Storbritanniens Data Protection Act 2018.

15. **"Sikkerhedshændelse"** betyder et brud på persondata som defineret i artikel 4 i GDPR.

16. **"Tjeneste"** betyder det produkt og/eller de tjenester, der er beskrevet i <strong>Aftalen</strong>.

17. **"Særlige kategorier af data"** vil have den betydning, der gives i artikel 9 i GDPR.

18. **"Underdatabehandler"** vil have den betydning, der gives i de gældende databeskyttelseslove for et selskab, som med godkendelse og accept fra den dataansvarlige assisterer databehandleren med at behandle persondata på vegne af den dataansvarlige.

19. **"UK GDPR"** betyder EU-forordning 2016/679 som implementeret af afsnit 3 i Storbritanniens European Union (Withdrawal) Act af 2018 i Storbritannien.

20. **"UK Addendum"** betyder tillægget til internationale dataoverførsler til EEA SCCs udstedt af Information Commissioner for parter, der foretager begrænsede overførsler i henhold til S119A(1) i Data Protection Act 2018.


## Credits {#credits}

Dette dokument er en afledning af [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) og er licenseret under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
