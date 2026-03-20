# Databehandleravtale {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email databehandleravtale" class="rounded-lg" />


## Innholdsfortegnelse {#table-of-contents}

* [Nøkkelbegreper](#key-terms)
* [Endringer i avtalen](#changes-to-the-agreement)
* [1. Behandler- og underbehandlerforhold](#1-processor-and-subprocessor-relationships)
  * [1. Leverandør som behandler](#1-provider-as-processor)
  * [2. Leverandør som underbehandler](#2-provider-as-subprocessor)
* [2. Behandling](#2-processing)
  * [1. Behandlingsdetaljer](#1-processing-details)
  * [2. Behandlingsinstruksjoner](#2-processing-instructions)
  * [3. Behandling av leverandør](#3-processing-by-provider)
  * [4. Kundebehandling](#4-customer-processing)
  * [5. Samtykke til behandling](#5-consent-to-processing)
  * [6. Underbehandlere](#6-subprocessors)
* [3. Begrensede overføringer](#3-restricted-transfers)
  * [1. Autorisasjon](#1-authorization)
  * [2. Overføringer utenfor EØS](#2-ex-eea-transfers)
  * [3. Overføringer utenfor Storbritannia](#3-ex-uk-transfers)
  * [4. Andre internasjonale overføringer](#4-other-international-transfers)
* [4. Sikkerhetshendelsesrespons](#4-security-incident-response)
* [5. Revisjon og rapporter](#5-audit--reports)
  * [1. Revisjonsrettigheter](#1-audit-rights)
  * [2. Sikkerhetsrapporter](#2-security-reports)
  * [3. Sikkerhetsdue diligence](#3-security-due-diligence)
* [6. Koordinering og samarbeid](#6-coordination--cooperation)
  * [1. Respons på forespørsler](#1-response-to-inquiries)
  * [2. DPIA-er og DTIA-er](#2-dpias-and-dtias)
* [7. Sletting av kundens personopplysninger](#7-deletion-of-customer-personal-data)
  * [1. Sletting av kunde](#1-deletion-by-customer)
  * [2. Sletting ved DPA-utløp](#2-deletion-at-dpa-expiration)
* [8. Ansvarsbegrensning](#8-limitation-of-liability)
  * [1. Ansvarsgrenser og frafall av erstatning](#1-liability-caps-and-damages-waiver)
  * [2. Krav fra tilknyttede parter](#2-related-party-claims)
  * [3. Unntak](#3-exceptions)
* [9. Konflikter mellom dokumenter](#9-conflicts-between-documents)
* [10. Avtalens varighet](#10-term-of-agreement)
* [11. Gjeldende lov og valgte domstoler](#11-governing-law-and-chosen-courts)
* [12. Forhold til tjenesteleverandør](#12-service-provider-relationship)
* [13. Definisjoner](#13-definitions)
* [Kreditter](#credits)


## Nøkkelbegreper {#key-terms}

| Begrep                                     | Verdi                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Avtale</strong>                     | Denne DPA supplerer [Vilkår for bruk](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| <strong>Godkjente underbehandlere</strong> | [Cloudflare](https://cloudflare.com) (USA; DNS, nettverk og sikkerhetsleverandør), [DataPacket](https://www.datapacket.com/) (USA/UK; hosting-leverandør), [Digital Ocean](https://digitalocean.com) (USA; hosting-leverandør), [GitHub](https://github.com) (USA; kildekodehosting, CI/CD og prosjektstyring), [Vultr](https://www.vultr.com) (USA; hosting-leverandør), [Stripe](https://stripe.com) (USA; betalingsbehandler), [PayPal](https://paypal.com) (USA; betalingsbehandler) |
| <strong>Leverandørens sikkerhetskontakt</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Sikkerhetspolicy</strong>           | Se [vår sikkerhetspolicy på GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                             |
| <strong>Gjeldende stat</strong>              | Delstaten Delaware, USA                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
## Endringer i avtalen {#changes-to-the-agreement}

Dette dokumentet er en avledning av [Common Paper DPA Standard Terms (Versjon 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) og følgende endringer er gjort:

1. [Lovvalg og valgte domstoler](#11-governing-law-and-chosen-courts) er inkludert som en seksjon nedenfor med `Governing State` identifisert ovenfor.
2. [Tjenesteleverandørforhold](#12-service-provider-relationship) er inkludert som en seksjon nedenfor.


## 1. Behandler- og underbehandlerforhold {#1-processor-and-subprocessor-relationships}

### 1. Leverandør som behandler {#1-provider-as-processor}

I situasjoner hvor <strong>Kunden</strong> er en behandlingsansvarlig for kundens personopplysninger, vil <strong>Leverandøren</strong> anses som en behandler som behandler personopplysninger på vegne av <strong>Kunden</strong>.

### 2. Leverandør som underbehandler {#2-provider-as-subprocessor}

I situasjoner hvor <strong>Kunden</strong> er en behandler av kundens personopplysninger, vil <strong>Leverandøren</strong> anses som en underbehandler av kundens personopplysninger.


## 2. Behandling {#2-processing}

### 1. Behandlingsdetaljer {#1-processing-details}

Vedlegg I(B) på forsiden beskriver gjenstanden, arten, formålet og varigheten av denne behandlingen, samt <strong>Kategorier av personopplysninger</strong> som samles inn og <strong>Kategorier av registrerte</strong>.

### 2. Behandlingsinstruksjoner {#2-processing-instructions}

<strong>Kunden</strong> instruerer <strong>Leverandøren</strong> til å behandle kundens personopplysninger: (a) for å levere og vedlikeholde tjenesten; (b) som kan spesifiseres ytterligere gjennom <strong>Kundens</strong> bruk av tjenesten; (c) som dokumentert i <strong>Avtalen</strong>; og (d) som dokumentert i andre skriftlige instruksjoner gitt av <strong>Kunden</strong> og bekreftet av <strong>Leverandøren</strong> om behandling av kundens personopplysninger under denne DPA. <strong>Leverandøren</strong> vil følge disse instruksjonene med mindre det er forbudt av gjeldende lover. <strong>Leverandøren</strong> vil umiddelbart informere <strong>Kunden</strong> hvis den ikke kan følge behandlingsinstruksjonene. <strong>Kunden</strong> har gitt og vil kun gi instruksjoner som er i samsvar med gjeldende lover.

### 3. Behandling av Leverandør {#3-processing-by-provider}

<strong>Leverandøren</strong> vil kun behandle kundens personopplysninger i samsvar med denne DPA, inkludert detaljene på forsiden. Hvis <strong>Leverandøren</strong> oppdaterer tjenesten for å oppdatere eksisterende eller inkludere nye produkter, funksjoner eller funksjonalitet, kan <strong>Leverandøren</strong> endre <strong>Kategorier av registrerte</strong>, <strong>Kategorier av personopplysninger</strong>, <strong>Spesielle kategorier av data</strong>, <strong>Begrensninger eller sikkerhetstiltak for spesielle kategorier av data</strong>, <strong>Overføringsfrekvens</strong>, <strong>Art og formål med behandlingen</strong> og <strong>Varighet av behandlingen</strong> etter behov for å reflektere oppdateringene ved å varsle <strong>Kunden</strong> om oppdateringene og endringene.

### 4. Kundens behandling {#4-customer-processing}

Der <strong>Kunden</strong> er en behandler og <strong>Leverandøren</strong> er en underbehandler, vil <strong>Kunden</strong> overholde alle gjeldende lover som gjelder for <strong>Kundens</strong> behandling av kundens personopplysninger. <strong>Kundens</strong> avtale med sin behandlingsansvarlige vil på tilsvarende måte kreve at <strong>Kunden</strong> overholder alle gjeldende lover som gjelder for <strong>Kunden</strong> som behandler. I tillegg vil <strong>Kunden</strong> overholde kravene til underbehandler i <strong>Kundens</strong> avtale med sin behandlingsansvarlige.

### 5. Samtykke til behandling {#5-consent-to-processing}

<strong>Kunden</strong> har overholdt og vil fortsette å overholde alle gjeldende personvernlovgivninger angående sin overlevering av kundens personopplysninger til <strong>Leverandøren</strong> og/eller tjenesten, inkludert å gi alle opplysninger, innhente alle samtykker, tilby tilstrekkelig valg og implementere relevante sikkerhetstiltak som kreves under gjeldende personvernlovgivning.
### 6. Underleverandører {#6-subprocessors}

a. <strong>Leverandør</strong> vil ikke levere, overføre eller overlate noen Kundens Personopplysninger til en Underleverandør med mindre <strong>Kunden</strong> har godkjent Underleverandøren. Den nåværende listen over <strong>Godkjente Underleverandører</strong> inkluderer identiteten til Underleverandørene, deres land for lokalisering, og deres forventede Behandlingsoppgaver. <strong>Leverandør</strong> vil informere <strong>Kunden</strong> minst 10 virkedager i forveien og skriftlig om eventuelle planlagte endringer i <strong>Godkjente Underleverandører</strong>, enten ved tillegg eller utskifting av en Underleverandør, noe som gir <strong>Kunden</strong> nok tid til å motsette seg endringene før <strong>Leverandør</strong> begynner å bruke den nye Underleverandøren(e). <strong>Leverandør</strong> vil gi <strong>Kunden</strong> den informasjon som er nødvendig for at <strong>Kunden</strong> skal kunne utøve sin rett til å motsette seg endringen av <strong>Godkjente Underleverandører</strong>. <strong>Kunden</strong> har 30 dager etter varsel om en endring i <strong>Godkjente Underleverandører</strong> til å motsette seg, ellers anses <strong>Kunden</strong> å akseptere endringene. Hvis <strong>Kunden</strong> motsetter seg endringen innen 30 dager etter varsel, vil <strong>Kunden</strong> og <strong>Leverandør</strong> samarbeide i god tro for å løse <strong>Kundens</strong> innsigelse eller bekymring.

b. Når <strong>Leverandør</strong> engasjerer en Underleverandør, vil <strong>Leverandør</strong> ha en skriftlig avtale med Underleverandøren som sikrer at Underleverandøren kun får tilgang til og bruker Kundens Personopplysninger (i) i den grad det er nødvendig for å utføre de underleverte forpliktelsene, og (ii) i samsvar med vilkårene i <strong>Avtalen</strong>.

c. Hvis GDPR gjelder for Behandlingen av Kundens Personopplysninger, (i) pålegges også databeskyttelsesforpliktelsene beskrevet i denne DPA (som referert til i artikkel 28(3) i GDPR, hvis aktuelt) Underleverandøren, og (ii) vil <strong>Leverandørs</strong> avtale med Underleverandøren inkorporere disse forpliktelsene, inkludert detaljer om hvordan <strong>Leverandør</strong> og dens Underleverandør vil koordinere for å svare på henvendelser eller forespørsler om Behandlingen av Kundens Personopplysninger. I tillegg vil <strong>Leverandør</strong> dele, på <strong>Kundens</strong> forespørsel, en kopi av sine avtaler (inkludert eventuelle endringer) med sine Underleverandører. I den grad det er nødvendig for å beskytte forretningshemmeligheter eller annen konfidensiell informasjon, inkludert personopplysninger, kan <strong>Leverandør</strong> sensurere teksten i sin avtale med Underleverandøren før deling av en kopi.

d. <strong>Leverandør</strong> forblir fullt ansvarlig for alle forpliktelser som er underleverandert til sine Underleverandører, inkludert handlinger og unnlatelser fra sine Underleverandører i Behandlingen av Kundens Personopplysninger. <strong>Leverandør</strong> vil varsle Kunden om enhver svikt fra sine Underleverandørers side i å oppfylle en vesentlig forpliktelse om Kundens Personopplysninger under avtalen mellom <strong>Leverandør</strong> og Underleverandøren.


## 3. Begrensede Overføringer {#3-restricted-transfers}

### 1. Autorisasjon {#1-authorization}

<strong>Kunden</strong> samtykker i at <strong>Leverandør</strong> kan overføre Kundens Personopplysninger utenfor EØS, Storbritannia eller annet relevant geografisk område etter behov for å levere Tjenesten. Hvis <strong>Leverandør</strong> overfører Kundens Personopplysninger til et område hvor Europakommisjonen eller annen relevant tilsynsmyndighet ikke har utstedt en beslutning om tilstrekkelig beskyttelse, vil <strong>Leverandør</strong> implementere passende sikkerhetstiltak for overføringen av Kundens Personopplysninger til dette området i samsvar med gjeldende personvernlovgivning.

### 2. Overføringer utenfor EØS {#2-ex-eea-transfers}

<strong>Kunden</strong> og <strong>Leverandør</strong> er enige om at dersom GDPR beskytter overføringen av Kundens Personopplysninger, overføringen skjer fra <strong>Kunden</strong> innenfor EØS til <strong>Leverandør</strong> utenfor EØS, og overføringen ikke reguleres av en tilstrekkelighetsbeslutning fra Europakommisjonen, så anses det ved inngåelse av denne DPA at <strong>Kunden</strong> og <strong>Leverandør</strong> har signert EØS SCC-ene og deres Vedlegg, som er innlemmet ved henvisning. Enhver slik overføring skjer i henhold til EØS SCC-ene, som utfylles som følger:
a. Modul To (Behandlingsansvarlig til Databehandler) i EØS SCC-ene gjelder når <strong>Kunden</strong> er Behandlingsansvarlig og <strong>Leverandøren</strong> behandler Kundens personopplysninger for <strong>Kunden</strong> som Databehandler.

b. Modul Tre (Databehandler til Underdatabehandler) i EØS SCC-ene gjelder når <strong>Kunden</strong> er Databehandler og <strong>Leverandøren</strong> behandler Kundens personopplysninger på vegne av <strong>Kunden</strong> som Underdatabehandler.

c. For hver modul gjelder følgende (når aktuelt):

1. Den valgfrie tilknytningsklausulen i Klausul 7 gjelder ikke;

2. I Klausul 9 gjelder Alternativ 2 (generell skriftlig godkjenning), og minimumsperioden for forhåndsvarsel om endringer i Underdatabehandler er 10 virkedager;

3. I Klausul 11 gjelder ikke det valgfrie språket;

4. Alle hakeparenteser i Klausul 13 fjernes;

5. I Klausul 17 (Alternativ 1) skal EØS SCC-ene være underlagt lovene i <strong>Styrende medlemsstat</strong>;

6. I Klausul 18(b) skal tvister avgjøres i domstolene i <strong>Styrende medlemsstat</strong>; og

7. Forsiden til denne DPA inneholder informasjonen som kreves i Vedlegg I, Vedlegg II og Vedlegg III til EØS SCC-ene.

### 3. Overføringer fra Storbritannia {#3-ex-uk-transfers}

<strong>Kunden</strong> og <strong>Leverandøren</strong> er enige om at dersom UK GDPR beskytter overføringen av Kundens personopplysninger, og overføringen skjer fra <strong>Kunden</strong> innenfor Storbritannia til <strong>Leverandøren</strong> utenfor Storbritannia, og overføringen ikke er regulert av en tilstrekkelighetsbeslutning fattet av Storbritannias Secretary of State, så anses <strong>Kunden</strong> og <strong>Leverandøren</strong> ved inngåelse av denne DPA å ha signert UK-tillegget og deres vedlegg, som innarbeides ved henvisning. Enhver slik overføring skjer i henhold til UK-tillegget, som fullføres som følger:

a. Seksjon 3.2 i denne DPA inneholder informasjonen som kreves i Tabell 2 i UK-tillegget.

b. Tabell 4 i UK-tillegget endres som følger: Ingen av partene kan avslutte UK-tillegget som angitt i Seksjon 19 i UK-tillegget; i den grad ICO utsteder et revidert godkjent tilleggsdokument under Seksjon ‎18 i UK-tillegget, skal partene samarbeide i god tro for å revidere denne DPA tilsvarende.

c. Forsiden inneholder informasjonen som kreves av Vedlegg 1A, Vedlegg 1B, Vedlegg II og Vedlegg III i UK-tillegget.

### 4. Andre internasjonale overføringer {#4-other-international-transfers}

For overføringer av personopplysninger hvor sveitsisk lov (og ikke loven i noen EØS-medlemsstat eller Storbritannia) gjelder for den internasjonale karakteren av overføringen, endres henvisninger til GDPR i Klausul 4 i EØS SCC-ene, i den grad det er juridisk påkrevd, til å referere til den sveitsiske føderale databeskyttelsesloven eller dens etterfølger i stedet, og begrepet tilsynsmyndighet vil inkludere den sveitsiske føderale databeskyttelses- og informasjonskommissæren.


## 4. Respons på sikkerhetshendelser {#4-security-incident-response}

1. Når <strong>Leverandøren</strong> blir oppmerksom på en sikkerhetshendelse, skal <strong>Leverandøren</strong>: (a) varsle <strong>Kunden</strong> uten unødig opphold når det er mulig, men senest 72 timer etter å ha blitt oppmerksom på sikkerhetshendelsen; (b) gi rettidig informasjon om sikkerhetshendelsen etter hvert som den blir kjent eller etter rimelig forespørsel fra <strong>Kunden</strong>; og (c) raskt iverksette rimelige tiltak for å begrense og undersøke sikkerhetshendelsen. <strong>Leverandørens</strong> varsling om eller respons på en sikkerhetshendelse som kreves av denne DPA skal ikke tolkes som en erkjennelse fra <strong>Leverandøren</strong> av skyld eller ansvar for sikkerhetshendelsen.


## 5. Revisjon og rapporter {#5-audit--reports}

### 1. Revisjonsrettigheter {#1-audit-rights}

<strong>Leverandøren</strong> skal gi <strong>Kunden</strong> all informasjon som med rimelighet er nødvendig for å demonstrere overholdelse av denne DPA, og <strong>Leverandøren</strong> skal tillate og bidra til revisjoner, inkludert inspeksjoner av <strong>Kunden</strong>, for å vurdere <strong>Leverandørens</strong> overholdelse av denne DPA. <strong>Leverandøren</strong> kan imidlertid begrense tilgangen til data eller informasjon dersom <strong>Kundens</strong> tilgang til informasjonen vil ha negativ innvirkning på <strong>Leverandørens</strong> immaterielle rettigheter, konfidensialitetsforpliktelser eller andre forpliktelser under gjeldende lover. <strong>Kunden</strong> erkjenner og godtar at den kun vil utøve sine revisjonsrettigheter under denne DPA og eventuelle revisjonsrettigheter gitt av gjeldende personvernlovgivning ved å instruere <strong>Leverandøren</strong> om å overholde rapporterings- og aktsomhetskravene nedenfor. <strong>Leverandøren</strong> skal oppbevare dokumentasjon på sin overholdelse av denne DPA i 3 år etter at DPA-en opphører.
### 2. Sikkerhetsrapporter {#2-security-reports}

<strong>Kunden</strong> erkjenner at <strong>Leverandøren</strong> jevnlig revideres i henhold til standardene definert i <strong>Sikkerhetspolicyen</strong> av uavhengige tredjepartsrevisorer. På skriftlig forespørsel vil <strong>Leverandøren</strong> gi <strong>Kunden</strong>, på konfidensiell basis, en sammendragkopi av sin da gjeldende rapport slik at <strong>Kunden</strong> kan verifisere <strong>Leverandørens</strong> overholdelse av standardene definert i <strong>Sikkerhetspolicyen</strong>.

### 3. Sikkerhetsdue diligence {#3-security-due-diligence}

I tillegg til rapporten vil <strong>Leverandøren</strong> svare på rimelige forespørsler om informasjon fra <strong>Kunden</strong> for å bekrefte <strong>Leverandørens</strong> overholdelse av denne DPA, inkludert svar på informasjonssikkerhet, due diligence og revisjonsspørreskjemaer, eller ved å gi tilleggsinformasjon om sitt informasjonssikkerhetsprogram. Alle slike forespørsler må være skriftlige og rettes til <strong>Leverandørens sikkerhetskontakt</strong> og kan kun gjøres én gang i året.


## 6. Koordinering og samarbeid {#6-coordination--cooperation}

### 1. Respons på henvendelser {#1-response-to-inquiries}

Hvis <strong>Leverandøren</strong> mottar en henvendelse eller forespørsel fra noen andre om behandlingen av kundens personopplysninger, vil <strong>Leverandøren</strong> varsle <strong>Kunden</strong> om forespørselen, og <strong>Leverandøren</strong> vil ikke svare på forespørselen uten <strong>Kundens</strong> forhåndssamtykke. Eksempler på slike henvendelser og forespørsler inkluderer en rettslig, administrativ eller regulatorisk pålegg om kundens personopplysninger der varsling av <strong>Kunden</strong> ikke er forbudt av gjeldende lovgivning, eller en forespørsel fra en registrert person. Hvis det er tillatt etter gjeldende lovgivning, vil <strong>Leverandøren</strong> følge <strong>Kundens</strong> rimelige instruksjoner om disse forespørslene, inkludert å gi statusoppdateringer og annen informasjon som rimelig etterspørres av <strong>Kunden</strong>. Hvis en registrert person fremsetter en gyldig forespørsel i henhold til gjeldende personvernlovgivning om å slette eller reservere seg mot at <strong>Kunden</strong> gir kundens personopplysninger til <strong>Leverandøren</strong>, vil <strong>Leverandøren</strong> bistå <strong>Kunden</strong> med å oppfylle forespørselen i henhold til gjeldende personvernlovgivning. <strong>Leverandøren</strong> vil samarbeide med og gi rimelig assistanse til <strong>Kunden</strong>, på <strong>Kundens</strong> bekostning, i enhver juridisk respons eller annen prosedyremessig handling som <strong>Kunden</strong> iverksetter som svar på en tredjepartsforespørsel om <strong>Leverandørens</strong> behandling av kundens personopplysninger under denne DPA.

### 2. DPIA-er og DTIA-er {#2-dpias-and-dtias}

Hvis påkrevd av gjeldende personvernlovgivning, vil <strong>Leverandøren</strong> rimelig bistå <strong>Kunden</strong> med å gjennomføre eventuelle pålagte konsekvensutredninger for personvern eller konsekvensutredninger for dataoverføring og konsultasjoner med relevante datatilsynsmyndigheter, med hensyn til behandlingen og kundens personopplysninger.


## 7. Sletting av kundens personopplysninger {#7-deletion-of-customer-personal-data}

### 1. Sletting av kunden {#1-deletion-by-customer}

<strong>Leverandøren</strong> vil gjøre det mulig for <strong>Kunden</strong> å slette kundens personopplysninger på en måte som er i samsvar med funksjonaliteten til tjenestene. <strong>Leverandøren</strong> vil etterkomme denne instruksjonen så snart det er rimelig praktisk, unntatt der videre lagring av kundens personopplysninger kreves av gjeldende lovgivning.

### 2. Sletting ved DPA-utløp {#2-deletion-at-dpa-expiration}

a. Etter at DPA-en utløper, vil <strong>Leverandøren</strong> returnere eller slette kundens personopplysninger etter <strong>Kundens</strong> instruksjon, med mindre videre lagring av kundens personopplysninger kreves eller er tillatt av gjeldende lovgivning. Hvis retur eller destruksjon er upraktisk eller forbudt av gjeldende lovgivning, vil <strong>Leverandøren</strong> gjøre rimelige anstrengelser for å forhindre ytterligere behandling av kundens personopplysninger og vil fortsette å beskytte kundens personopplysninger som fortsatt er i dens besittelse, varetekt eller kontroll. For eksempel kan gjeldende lovgivning kreve at <strong>Leverandøren</strong> fortsetter å være vert for eller behandle kundens personopplysninger.
b. Hvis <strong>Kunden</strong> og <strong>Leverandøren</strong> har inngått EØS SCC-ene eller UK-tillegget som en del av denne DPA-en, vil <strong>Leverandøren</strong> kun gi <strong>Kunden</strong> sertifisering av sletting av personopplysninger som beskrevet i klausul 8.1(d) og klausul 8.5 i EØS SCC-ene dersom <strong>Kunden</strong> ber om det.


## 8. Ansvarsbegrensning {#8-limitation-of-liability}

### 1. Ansvarsgrenser og frafall av erstatning {#1-liability-caps-and-damages-waiver}

**I den grad det er tillatt under gjeldende personvernlovgivning, vil hver parts totale kumulative ansvar overfor den andre parten som oppstår fra eller er relatert til denne DPA-en være underlagt frafall, unntak og ansvarsbegrensninger angitt i <strong>Avtalen</strong>.**

### 2. Krav fra relaterte parter {#2-related-party-claims}

**Eventuelle krav rettet mot <strong>Leverandøren</strong> eller dets tilknyttede selskaper som oppstår fra eller er relatert til denne DPA-en kan kun fremsettes av <strong>Kunden</strong> som er part i <strong>Avtalen</strong>.**

### 3. Unntak {#3-exceptions}

1. Denne DPA-en begrenser ikke noe ansvar overfor en enkeltperson angående dennes rettigheter etter gjeldende personvernlovgivning. I tillegg begrenser ikke denne DPA-en noe ansvar mellom partene for brudd på EØS SCC-ene eller UK-tillegget.


## 9. Konflikter mellom dokumenter {#9-conflicts-between-documents}

1. Denne DPA-en utgjør en del av og supplerer Avtalen. Dersom det oppstår inkonsistens mellom denne DPA-en, <strong>Avtalen</strong> eller noen av deres deler, vil den delen som er oppført først ha forrang over den som er oppført senere for den inkonsistensen: (1) EØS SCC-ene eller UK-tillegget, (2) denne DPA-en, og deretter (3) <strong>Avtalen</strong>.


## 10. Avtalens varighet {#10-term-of-agreement}

Denne DPA-en trer i kraft når <strong>Leverandøren</strong> og <strong>Kunden</strong> godtar et forsideark for DPA-en og signerer eller elektronisk aksepterer <strong>Avtalen</strong>, og vil fortsette til <strong>Avtalen</strong> utløper eller sies opp. Imidlertid vil både <strong>Leverandøren</strong> og <strong>Kunden</strong> fortsatt være bundet av forpliktelsene i denne DPA-en og gjeldende personvernlovgivning inntil <strong>Kunden</strong> slutter å overføre kundens personopplysninger til <strong>Leverandøren</strong> og <strong>Leverandøren</strong> slutter å behandle kundens personopplysninger.


## 11. Gjeldende lov og valgte domstoler {#11-governing-law-and-chosen-courts}

Uavhengig av lovvalgsklausulen eller lignende klausuler i <strong>Avtalen</strong>, skal all tolkning og tvister om denne DPA-en reguleres av lovene i <strong>Styringsstaten</strong> uten hensyn til dens regler om lovkonflikter. I tillegg, og uavhengig av forumvalg, jurisdiksjon eller lignende klausuler i <strong>Avtalen</strong>, samtykker partene i å bringe enhver rettssak, handling eller prosedyre om denne DPA-en for, og hver part underkaster seg ugjenkallelig den eksklusive jurisdiksjonen til, domstolene i <strong>Styringsstaten</strong>.


## 12. Forholdet som tjenesteleverandør {#12-service-provider-relationship}

I den grad California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq ("CCPA") gjelder, erkjenner og godtar partene at <strong>Leverandøren</strong> er en tjenesteleverandør og mottar personopplysninger fra <strong>Kunden</strong> for å levere tjenesten som avtalt i <strong>Avtalen</strong>, noe som utgjør et forretningsformål. <strong>Leverandøren</strong> vil ikke selge noen personopplysninger levert av <strong>Kunden</strong> under <strong>Avtalen</strong>. I tillegg vil <strong>Leverandøren</strong> ikke beholde, bruke eller avsløre noen personopplysninger levert av <strong>Kunden</strong> under <strong>Avtalen</strong> unntatt i den grad det er nødvendig for å levere tjenesten for <strong>Kunden</strong>, som angitt i <strong>Avtalen</strong>, eller som tillatt av gjeldende personvernlovgivning. <strong>Leverandøren</strong> bekrefter at den forstår begrensningene i dette avsnittet.
## 13. Definisjoner {#13-definitions}

1. **"Gjeldende lover"** betyr lover, regler, forskrifter, rettsavgjørelser og andre bindende krav fra en relevant myndighet som gjelder for eller regulerer en part.

2. **"Gjeldende personvernlovgivning"** betyr de gjeldende lover som regulerer hvordan Tjenesten kan behandle eller bruke en persons personopplysninger, persondata, personlig identifiserbar informasjon eller annet lignende begrep.

3. **"Behandlingsansvarlig"** vil ha den betydning som gis i den gjeldende personvernlovgivningen for selskapet som bestemmer formålet og omfanget av behandlingen av personopplysninger.

4. **"Forside"** betyr et dokument som er signert eller elektronisk akseptert av partene, som innlemmer disse DPA Standardvilkårene og identifiserer <strong>Leverandør</strong>, <strong>Kunde</strong>, samt emnet og detaljene for databehandlingen.

5. **"Kundes personopplysninger"** betyr personopplysninger som <strong>Kunde</strong> laster opp eller gir til <strong>Leverandør</strong> som en del av Tjenesten og som reguleres av denne DPA.

6. **"DPA"** betyr disse DPA Standardvilkårene, Forsiden mellom <strong>Leverandør</strong> og <strong>Kunde</strong>, samt retningslinjer og dokumenter som refereres til i eller er vedlagt Forsiden.

7. **"EØS SCC"** betyr standard kontraktsklausuler vedlagt Europakommisjonens gjennomføringsbeslutning 2021/914 av 4. juni 2021 om standard kontraktsklausuler for overføring av personopplysninger til tredjeland i henhold til forordning (EU) 2016/679 fra Europaparlamentet og Rådet.

8. **"Det europeiske økonomiske samarbeidsområde"** eller **"EØS"** betyr medlemsstatene i Den europeiske union, Norge, Island og Liechtenstein.

9. **"GDPR"** betyr EUs forordning 2016/679 som implementert i lokal lovgivning i den relevante EØS-medlemsstaten.

10. **"Personopplysninger"** vil ha den betydning som gis i den gjeldende personvernlovgivningen for personopplysninger, persondata eller annet lignende begrep.

11. **"Behandling"** eller **"Behandle"** vil ha den betydning som gis i den gjeldende personvernlovgivningen for enhver bruk av, eller utførelse av en datamaskinoperasjon på, personopplysninger, inkludert ved automatiske metoder.

12. **"Databehandler"** vil ha den betydning som gis i den gjeldende personvernlovgivningen for selskapet som behandler personopplysninger på vegne av den behandlingsansvarlige.

13. **"Rapport"** betyr revisjonsrapporter utarbeidet av et annet selskap i henhold til standardene definert i Sikkerhetspolicyen på vegne av Leverandør.

14. **"Begrenset overføring"** betyr (a) der GDPR gjelder, en overføring av personopplysninger fra EØS til et land utenfor EØS som ikke er underlagt en tilstrekkelighetsavgjørelse fra Europakommisjonen; og (b) der UK GDPR gjelder, en overføring av personopplysninger fra Storbritannia til et annet land som ikke er underlagt tilstrekkelighetsreguleringer vedtatt i henhold til seksjon 17A i Storbritannias Data Protection Act 2018.

15. **"Sikkerhetshendelse"** betyr et brudd på personopplysninger som definert i artikkel 4 i GDPR.

16. **"Tjeneste"** betyr produktet og/eller tjenestene beskrevet i <strong>Avtalen</strong>.

17. **"Spesielle kategorier av data"** vil ha den betydning som gis i artikkel 9 i GDPR.

18. **"Underbehandler"** vil ha den betydning som gis i den gjeldende personvernlovgivningen for et selskap som, med godkjenning og aksept fra Behandlingsansvarlig, bistår Databehandleren i behandlingen av personopplysninger på vegne av Behandlingsansvarlig.

19. **"UK GDPR"** betyr EUs forordning 2016/679 som implementert av seksjon 3 i Storbritannias European Union (Withdrawal) Act av 2018 i Storbritannia.

20. **"UK tillegg"** betyr det internasjonale datatransfertillegget til EØS SCC utstedt av Information Commissioner for parter som foretar begrensede overføringer under S119A(1) Data Protection Act 2018.


## Credits {#credits}

Dette dokumentet er en avledning av [Common Paper DPA Standard Terms (Version 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) og er lisensiert under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
