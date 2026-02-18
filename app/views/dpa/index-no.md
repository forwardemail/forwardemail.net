# Databehandleravtale {#data-processing-agreement}

<!-- v1.0 fra <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Nøkkelbegreper](#key-terms)
* [Endringer i avtalen](#changes-to-the-agreement)
* [1. Forhold mellom databehandlere og underdatabehandlere](#1-processor-and-subprocessor-relationships)
  * [1. Leverandør som databehandler](#1-provider-as-processor)
  * [2. Leverandør som underdatabehandler](#2-provider-as-subprocessor)
* [2. Bearbeiding](#2-processing)
  * [1. Behandlingsdetaljer](#1-processing-details)
  * [2. Behandlingsinstruksjoner](#2-processing-instructions)
  * [3. Behandling av leverandør](#3-processing-by-provider)
  * [4. Kundebehandling](#4-customer-processing)
  * [5. Samtykke til behandling](#5-consent-to-processing)
  * [6. Underdatabehandlere](#6-subprocessors)
* [3. Begrensede overføringer](#3-restricted-transfers)
  * [1. Autorisasjon](#1-authorization)
  * [2. Overføringer utenfor EØS](#2-ex-eea-transfers)
  * [3. Overføringer utenfor Storbritannia](#3-ex-uk-transfers)
  * [4. Andre internasjonale overføringer](#4-other-international-transfers)
* [4. Respons på sikkerhetshendelser](#4-security-incident-response)
* [5. Revisjon og rapporter](#5-audit--reports)
  * [1. Revisjonsrettigheter](#1-audit-rights)
  * [2. Sikkerhetsrapporter](#2-security-reports)
  * [3. Sikkerhetsmessig due diligence](#3-security-due-diligence)
* [6. Koordinering og samarbeid](#6-coordination--cooperation)
  * [1. Svar på henvendelser](#1-response-to-inquiries)
  * [2. DPIA-er og DTIA-er](#2-dpias-and-dtias)
* [7. Sletting av kundens personopplysninger](#7-deletion-of-customer-personal-data)
  * [1. Sletting av kunden](#1-deletion-by-customer)
  * [2. Sletting ved utløp av DPA](#2-deletion-at-dpa-expiration)
* [8. Ansvarsbegrensning](#8-limitation-of-liability)
  * [1. Ansvarsgrenser og fraskrivelse av erstatning](#1-liability-caps-and-damages-waiver)
  * [2. Krav fra nærstående parter](#2-related-party-claims)
  * [3. Unntak](#3-exceptions)
* [9. Konflikter mellom dokumenter](#9-conflicts-between-documents)
* [10. Avtaleperiode](#10-term-of-agreement)
* [11. Gjeldende lov og valgte domstoler](#11-governing-law-and-chosen-courts)
* [12. Forholdet mellom tjenesteleverandøren](#12-service-provider-relationship)
* [13. Definisjoner](#13-definitions)
* [Studiepoeng](#credits)

## Viktige begreper {#key-terms}

| Periode | Verdi |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Avtale** | Denne databehandleravtalen (DPA) supplerer [Terms of Service](/terms) |
| Godkjente underdatabehandlere | [Cloudflare](https://cloudflare.com) (USA; DNS-, nettverks- og sikkerhetsleverandør), [DataPacket](https://www.datapacket.com/) (USA/Storbritannia; hostingleverandør), [Digital Ocean](https://digitalocean.com) (USA; hostingleverandør), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (USA; hostingleverandør), [Stripe](https://stripe.com) (USA; betalingsbehandler), [PayPal](https://paypal.com) (USA; betalingsbehandler) |
| <strong>Kontaktperson for leverandørsikkerhet</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| **Sikkerhetspolicy** | Vis [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| **Styrende stat** | Staten Delaware, USA |

## Endringer i avtalen {#changes-to-the-agreement}

Dette dokumentet er en avledning av [Vanlige standardvilkår for DPA-dokumenter (versjon 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0), og følgende endringer er gjort:

1. [Gjeldende lov og valgte domstoler](#11-governing-law-and-chosen-courts) er inkludert som en seksjon nedenfor, med `Governing State` identifisert ovenfor.

2. [Forholdet mellom tjenesteleverandører](#12-service-provider-relationship) er inkludert som en seksjon nedenfor.

## 1. Forhold mellom prosessor og underprosessor {#1-processor-and-subprocessor-relationships}

### 1. Leverandør som databehandler {#1-provider-as-processor}

I situasjoner der <strong>Kunden</strong> er behandlingsansvarlig for kundens personopplysninger, vil <strong>Leverandøren</strong> bli ansett som databehandler som behandler personopplysninger på vegne av <strong>Kunden</strong>.

### 2. Leverandør som underbehandler {#2-provider-as-subprocessor}

I situasjoner der <strong>Kunden</strong> er databehandler av kundens personopplysninger, vil <strong>Leverandøren</strong> bli ansett som underdatabehandler av kundens personopplysninger.

## 2. Behandler {#2-processing}

### 1. Behandlingsdetaljer {#1-processing-details}

Vedlegg I(B) på forsiden beskriver innholdet, arten, formålet og varigheten av denne behandlingen, samt <strong>kategoriene av personopplysninger</strong> som samles inn og <strong>kategoriene av registrerte</strong>.

### 2. Behandlingsinstruksjoner {#2-processing-instructions}

Kunden instruerer Leverandøren til å behandle kundens personopplysninger: (a) for å levere og vedlikeholde Tjenesten; (b) som kan være ytterligere spesifisert gjennom Kundens bruk av Tjenesten; (c) som dokumentert i Avtalen; og (d) som dokumentert i andre skriftlige instruksjoner gitt av Kunden og bekreftet av Leverandøren om behandling av kundens personopplysninger i henhold til denne databehandleravtalen. Leverandøren skal følge disse instruksjonene med mindre gjeldende lover forbyr det. Leverandøren skal umiddelbart informere Kunden hvis den ikke er i stand til å følge behandlingsinstruksjonene. Kunden har gitt og vil kun gi instruksjoner som er i samsvar med gjeldende lover.

### 3. Behandling av leverandør {#3-processing-by-provider}

Leverandøren vil kun behandle kundens personopplysninger i samsvar med denne databehandleravtalen, inkludert detaljene på forsiden. Hvis leverandøren oppdaterer tjenesten for å oppdatere eksisterende eller inkludere nye produkter, funksjoner eller funksjonalitet, kan leverandøren endre kategoriene for registrerte, kategoriene for personopplysninger, spesielle kategoridata, begrensninger eller sikkerhetstiltak for spesielle kategoridata, overføringsfrekvens, behandlingens art og formål og behandlingens varighet etter behov for å gjenspeile oppdateringene ved å varsle kunden om oppdateringene og endringene.

### 4. Kundebehandling {#4-customer-processing}

Der Kunden er en databehandler og Leverandøren er en underdatabehandler, skal Kunden overholde alle gjeldende lover som gjelder for Kundens behandling av Kundens personopplysninger. Kundens avtale med sin behandlingsansvarlige vil på samme måte kreve at Kunden overholder alle gjeldende lover som gjelder for Kunden som databehandler. I tillegg skal Kunden overholde underdatabehandlerkravene i Kundens avtale med sin behandlingsansvarlige.

### 5. Samtykke til behandling {#5-consent-to-processing}

Kunden har overholdt og vil fortsette å overholde alle gjeldende personvernlover angående levering av kundens personopplysninger til Leverandøren og/eller Tjenesten, inkludert å foreta alle opplysninger, innhente alle samtykker, gi tilstrekkelig valgfrihet og implementere relevante sikkerhetstiltak som kreves i henhold til gjeldende personvernlover.

### 6. Underprosessorer {#6-subprocessors}

a. <strong>Leverandøren</strong> vil ikke gi, overføre eller utlevere noen kundepersonopplysninger til en underdatabehandler med mindre <strong>Kunden</strong> har godkjent underdatabehandleren. Den nåværende listen over <strong>Godkjente underdatabehandlere</strong> inkluderer identiteten til underdatabehandlerne, deres land og deres forventede behandlingsoppgaver. <strong>Leverandøren</strong> vil informere <strong>Kunden</strong> minst 10 virkedager i forveien og skriftlig om eventuelle planlagte endringer av de <strong>Godkjente underdatabehandlerne</strong>, enten ved tillegg eller erstatning av en underdatabehandler, noe som gir <strong>Kunden</strong> nok tid til å protestere mot endringene før <strong>Leverandøren</strong> begynner å bruke den/de nye underdatabehandleren(e). <strong>Leverandøren</strong> vil gi <strong>Kunden</strong> den informasjonen som er nødvendig for at <strong>Kunden</strong> skal kunne utøve sin rett til å protestere mot endringen av <strong>Godkjente underdatabehandlere</strong>. Kunden har 30 dager etter varsel om en endring av de godkjente underdatabehandlerne til å protestere. Ellers anses kunden å ha akseptert endringene. Hvis kunden protesterer mot endringen innen 30 dager etter varsel, skal kunden og leverandøren samarbeide i god tro for å løse kundens innsigelse eller bekymring.

b. Når Leverandøren engasjerer en underdatabehandler, skal denne ha en skriftlig avtale med underdatabehandleren som sikrer at underdatabehandleren kun får tilgang til og bruker kundens personopplysninger (i) i den grad det er nødvendig for å utføre forpliktelsene som er gitt til underdatabehandleren, og (ii) i samsvar med vilkårene i avtalen.

c. Dersom GDPR gjelder for behandling av kundens personopplysninger, (i) pålegges databeskyttelsesforpliktelsene beskrevet i denne databehandleravtalen (som referert til i artikkel 28(3) i GDPR, hvis aktuelt) også underdatabehandleren, og (ii) Leverandørens avtale med underdatabehandleren vil innlemme disse forpliktelsene, inkludert detaljer om hvordan Leverandøren og underdatabehandleren vil koordinere for å svare på henvendelser eller forespørsler om behandling av kundens personopplysninger. I tillegg vil Leverandøren, på Kundens forespørsel, dele en kopi av sine avtaler (inkludert eventuelle endringer) med sine underdatabehandlere. I den grad det er nødvendig for å beskytte forretningshemmeligheter eller annen konfidensiell informasjon, inkludert personopplysninger, kan Leverandøren redigere teksten i avtalen med underdatabehandleren før en kopi deles.

d. <strong>Leverandøren</strong> er fortsatt fullt ansvarlig for alle forpliktelser som er underlevert til sine underdatabehandlere, inkludert handlinger og unnlatelser fra sine underdatabehandlere i behandlingen av kundens personopplysninger. <strong>Leverandøren</strong> skal varsle kunden om eventuelle underdatabehandleres manglende oppfyllelse av en vesentlig forpliktelse angående kundens personopplysninger i henhold til avtalen mellom <strong>Leverandøren</strong> og underdatabehandleren.

## 3. Begrensede overføringer {#3-restricted-transfers}

### 1. Autorisasjon {#1-authorization}

Kunden samtykker i at Leverandøren kan overføre Kundens personopplysninger utenfor EØS, Storbritannia eller annet relevant geografisk territorium etter behov for å levere Tjenesten. Dersom Leverandøren overfører Kundens personopplysninger til et territorium der EU-kommisjonen eller annen relevant tilsynsmyndighet ikke har truffet en tilstrekkelighetsbeslutning, skal Leverandøren implementere passende sikkerhetstiltak for overføring av Kundens personopplysninger til det territoriet i samsvar med gjeldende personvernlover.

### 2. Overføringer utenfor EØS {#2-ex-eea-transfers}

Kunden og leverandøren er enige om at dersom GDPR beskytter overføring av kundens personopplysninger, overføringen skjer fra kunden innenfor EØS til leverandør utenfor EØS, og overføringen ikke er underlagt en tilstrekkelighetsbeslutning truffet av EU-kommisjonen, anses kunden og leverandøren, ved å inngå denne databehandleravtalen, å ha signert EØS-standardkontraktsklausulene og vedleggene deres, som er innlemmet ved referanse. Enhver slik overføring skjer i samsvar med EØS-standardkontraktsklausulene, som er utfylt som følger:

a. Modul to (behandlingsansvarlig til databehandler) i EØS-standardkontraktsklausulene gjelder når kunden er behandlingsansvarlig og leverandøren behandler kundens personopplysninger for kunden som databehandler.

b. Modul tre (databehandler til underdatabehandler) i EØS-standardkontraktsklausulene gjelder når <strong>kunden</strong> er en databehandler og <strong>leverandøren</strong> behandler kundens personopplysninger på vegne av <strong>kunden</strong> som en underdatabehandler.

c. For hver modul gjelder følgende (når det er aktuelt):

1. Den valgfrie dokkingsklausulen i klausul 7 gjelder ikke;

2. I punkt 9 gjelder alternativ 2 (generell skriftlig fullmakt), og minimumsperioden for forhåndsvarsel om endringer hos underdatabehandlere er 10 virkedager;

3. I punkt 11 gjelder ikke den valgfrie formuleringen;

4. Alle hakeparenteser i paragraf 13 fjernes;

5. I punkt 17 (alternativ 1) vil EØS-standardkontraktene være underlagt lovgivningen i den *styrende medlemsstaten*;

6. I punkt 18(b) skal tvister avgjøres i domstolene i den *styrende* medlemsstaten; og

7. Forsiden til denne databehandleravtalen inneholder informasjonen som kreves i vedlegg I, vedlegg II og vedlegg III til EØS-standardkontraktene.

### 3. Overføringer utenfor Storbritannia {#3-ex-uk-transfers}

Kunden og leverandøren er enige om at dersom den britiske GDPR beskytter overføring av kundens personopplysninger, overføringen skjer fra kunden innen Storbritannia til leverandør utenfor Storbritannia, og overføringen ikke er underlagt en tilstrekkelighetsbeslutning truffet av Storbritannias utenriksminister, anses kunden og leverandøren, ved å inngå denne databehandleravtalen, å ha signert det britiske tillegget og vedleggene, som er innlemmet ved referanse. Enhver slik overføring skjer i henhold til det britiske tillegget, som er utfylt som følger:

a. Avsnitt 3.2 i denne databehandleravtalen inneholder informasjonen som kreves i tabell 2 i det britiske tillegget.

b. Tabell 4 i det britiske tillegget endres som følger: Ingen av partene kan avslutte det britiske tillegget som angitt i paragraf 19 i det britiske tillegget. I den grad ICO utsteder et revidert godkjent tillegg i henhold til paragraf ‎18 i det britiske tillegget, skal partene i god tro revidere denne databehandleravtalen deretter.

c. Forsiden inneholder informasjonen som kreves i vedlegg 1A, vedlegg 1B, vedlegg II og vedlegg III i det britiske tillegget.

### 4. Andre internasjonale overføringer {#4-other-international-transfers}

For overføringer av personopplysninger der sveitsisk lov (og ikke loven i noen EØS-medlemsstat eller Storbritannia) gjelder for overføringens internasjonale karakter, endres henvisninger til GDPR i punkt 4 i EØS-standardkontraktene, i den grad det er lovpålagt, til å referere til den sveitsiske føderale databeskyttelsesloven eller dens etterfølger i stedet, og konseptet tilsynsmyndighet vil omfatte den sveitsiske føderale databeskyttelses- og informasjonskommissæren.

## 4. Respons på sikkerhetshendelse {#4-security-incident-response}

1. Når Leverandøren blir oppmerksom på en sikkerhetshendelse, skal vedkommende: (a) varsle Kunden uten unødig forsinkelse når det er mulig, men senest 72 timer etter at vedkommende ble oppmerksom på sikkerhetshendelsen; (b) gi rettidig informasjon om sikkerhetshendelsen etter hvert som den blir kjent eller som Kunden med rimelighet ber om; og (c) omgående iverksette rimelige tiltak for å begrense og undersøke sikkerhetshendelsen. Leverandørens varsling om eller svar på en sikkerhetshendelse som kreves av denne databehandleravtalen skal ikke tolkes som en bekreftelse fra Leverandøren av noen feil eller ansvar for sikkerhetshendelsen.

## 5. Revisjon og rapporter {#5-audit--reports}

### 1. Revisjonsrettigheter {#1-audit-rights}

Leverandøren skal gi Kunden all informasjon som er rimelig nødvendig for å demonstrere samsvar med denne databehandleravtalen, og Leverandøren skal tillate og bidra til revisjoner, inkludert inspeksjoner utført av Kunden, for å vurdere Leverandørens samsvar med denne databehandleravtalen. Leverandøren kan imidlertid begrense tilgangen til data eller informasjon dersom Kundens tilgang til informasjonen ville ha en negativ innvirkning på Leverandørens immaterielle rettigheter, konfidensialitetsforpliktelser eller andre forpliktelser i henhold til gjeldende lover. Kunden erkjenner og samtykker i at den kun vil utøve sine revisjonsrettigheter i henhold til denne databehandleravtalen og eventuelle revisjonsrettigheter gitt av gjeldende personvernlover ved å instruere Leverandøren om å overholde rapporterings- og due diligence-kravene nedenfor. Leverandøren skal oppbevare registre over sin samsvar med denne databehandleravtalen i 3 år etter at databehandleravtalen er opphørt.

### 2. Sikkerhetsrapporter {#2-security-reports}

Kunden erkjenner at Leverandøren regelmessig revideres av uavhengige tredjepartsrevisorer i henhold til standardene som er definert i sikkerhetspolicyen. Leverandøren skal på skriftlig forespørsel gi Kunden, konfidensielt, et sammendrag av sin gjeldende rapport, slik at Kunden kan bekrefte Leverandørens overholdelse av standardene som er definert i sikkerhetspolicyen.

### 3. Sikkerhetsaktsomhet {#3-security-due-diligence}

I tillegg til rapporten vil Leverandøren svare på rimelige forespørsler om informasjon fra Kunden for å bekrefte Leverandørens overholdelse av denne datatilsynsavtalen, inkludert svar på spørreskjemaer for informasjonssikkerhet, due diligence og revisjon, eller ved å gi ytterligere informasjon om sitt informasjonssikkerhetsprogram. Alle slike forespørsler må være skriftlige og rettes til Leverandørens sikkerhetskontakt, og kan kun gjøres én gang i året.

## 6. Koordinering og samarbeid {#6-coordination--cooperation}

### 1. Svar på forespørsler {#1-response-to-inquiries}

Hvis Leverandøren mottar en forespørsel eller henvendelse fra noen andre om behandling av kundens personopplysninger, vil Leverandøren varsle Kunden om forespørselen, og Leverandøren vil ikke svare på forespørselen uten Kundens forhåndssamtykke. Eksempler på slike forespørsler og henvendelser inkluderer en rettslig, administrativ eller regulatorisk ordre om Kundens personopplysninger der det ikke er forbudt å varsle Kunden i henhold til gjeldende lov, eller en forespørsel fra en registrert. Hvis det er tillatt i henhold til gjeldende lov, vil Leverandøren følge Kundens rimelige instruksjoner om disse forespørslene, inkludert å gi statusoppdateringer og annen informasjon som Kunden med rimelighet ber om. Dersom en registrert person fremsetter en gyldig forespørsel i henhold til gjeldende personvernlovgivning om å slette eller reservere seg mot at <strong>kunden</strong> gir kundens personopplysninger til <strong>leverandøren</strong>, skal <strong>leverandøren</strong> bistå <strong>kunden</strong> med å oppfylle forespørselen i henhold til gjeldende personvernlovgivning. <strong>leverandøren</strong> skal samarbeide med og gi rimelig bistand til <strong>kunden</strong>, på <strong>kundens</strong> regning, i ethvert juridisk svar eller andre prosedyremessige tiltak som <strong>kunden</strong> iverksetter som svar på en tredjepartsforespørsel om <strong>leverandørens</strong> behandling av kundens personopplysninger i henhold til denne databehandleravtalen.

### 2. DPIA-er og DTIA-er {#2-dpias-and-dtias}

Hvis det kreves av gjeldende personvernlover, skal <strong>Leverandøren</strong> på rimelig vis bistå <strong>Kunden</strong> med å gjennomføre obligatoriske konsekvensvurderinger for personvern eller dataoverføring og konsultasjoner med relevante personvernmyndigheter, tatt i betraktning behandlingens art og kundens personopplysninger.

## 7. Sletting av kundens personopplysninger {#7-deletion-of-customer-personal-data}

### 1. Sletting av kunde {#1-deletion-by-customer}

Leverandøren vil gjøre det mulig for kunden å slette kundens personopplysninger på en måte som er i samsvar med tjenestenes funksjonalitet. Leverandøren vil følge denne instruksjonen så snart som det er rimelig praktisk mulig, med mindre ytterligere lagring av kundens personopplysninger er påkrevd i henhold til gjeldende lov.

### 2. Sletting ved utløp av DPA {#2-deletion-at-dpa-expiration}

a. Etter at databehandleravtalen utløper, vil <strong>Leverandøren</strong> returnere eller slette kundens personopplysninger etter <strong>kundens</strong> instruksjoner, med mindre ytterligere lagring av kundens personopplysninger er påkrevd eller godkjent av gjeldende lov. Dersom retur eller destruksjon er umulig eller forbudt av gjeldende lov, vil <strong>Leverandøren</strong> gjøre rimelige anstrengelser for å forhindre ytterligere behandling av kundens personopplysninger og vil fortsette å beskytte kundens personopplysninger som fortsatt er i dens besittelse, forvaring eller kontroll. Gjeldende lover kan for eksempel kreve at <strong>Leverandøren</strong> fortsetter å være vert for eller behandle kundens personopplysninger.

b. Dersom <strong>Kunden</strong> og <strong>Leverandøren</strong> har inngått EØS-standardkontraktsklausulene eller det britiske tillegget som en del av denne databehandleravtalen, vil <strong>Leverandøren</strong> kun gi <strong>Kunden</strong> bekreftelse på sletting av personopplysninger beskrevet i klausul 8.1(d) og klausul 8.5 i EØS-standardkontraktsklausulene dersom <strong>Kunden</strong> ber om det.

## 8. Ansvarsbegrensning {#8-limitation-of-liability}

### 1. Ansvarsgrenser og fraskrivelse av erstatning {#1-liability-caps-and-damages-waiver}

**I den grad det er tillatt i henhold til gjeldende personvernlover, skal hver parts samlede kumulative ansvar overfor den andre parten som følge av eller er relatert til denne databeskyttelsesavtalen være underlagt fraskrivelsene, utelukkelsene og ansvarsbegrensningene som er angitt i **avtalen**.**

### 2. Krav fra nærstående parter {#2-related-party-claims}

**Eventuelle krav mot **Leverandøren** eller dennes tilknyttede selskaper som følge av eller er relatert til denne databehandleravtalen, kan kun fremmes av **Kundeenheten** som er part i **Avtalen**.**

### 3. Unntak {#3-exceptions}

1. Denne databeskyttelsesavtalen begrenser ikke noe ansvar for en enkeltperson angående personens rettigheter til databeskyttelse i henhold til gjeldende personvernlover. I tillegg begrenser ikke denne databeskyttelsesavtalen noe ansvar mellom partene for brudd på EØS-standardkontraktsklausulene eller det britiske tillegget.

## 9. Konflikter mellom dokumenter {#9-conflicts-between-documents}

1. Denne databehandleravtalen er en del av og utfyller avtalen. Dersom det er noen uoverensstemmelse mellom denne databehandleravtalen, **avtalen** eller noen av delene av den, skal den delen som er oppført tidligere, ha forrang over den delen som er oppført senere for den uoverensstemmelsen: (1) EØS-standardkontraktsklausulene eller det britiske tillegget, (2) denne databehandleravtalen, og deretter (3) **avtalen**.

## 10. Avtalevilkår {#10-term-of-agreement}

Denne databehandleravtalen (DPA) vil tre i kraft når <strong>leverandøren</strong> og <strong>kunden</strong> blir enige om en forside for DPA-en og signerer eller elektronisk godtar <strong>avtalen</strong>, og vil fortsette inntil <strong>avtalen</strong> utløper eller sies opp. Imidlertid vil <strong>leverandøren</strong> og <strong>kunden</strong> begge forbli underlagt forpliktelsene i denne DPA-en og gjeldende personvernlover inntil <strong>kunden</strong> slutter å overføre kundens personopplysninger til <strong>leverandøren</strong> og <strong>leverandøren</strong> slutter å behandle kundens personopplysninger.

## 11. Gjeldende lov og valgte domstoler {#11-governing-law-and-chosen-courts}

Uavhengig av gjeldende lov eller lignende klausuler i **avtalen**, skal alle tolkninger og tvister om denne databehandleravtalen reguleres av lovene i **styrende stat** uten hensyn til dens bestemmelser om lovkonflikt. I tillegg, og uavhengig av forumvalg, jurisdiksjon eller lignende klausuler i **avtalen**, samtykker partene i å anlegge ethvert søksmål, saksbehandling eller prosedyre angående denne databehandleravtalen i, og hver part underkaster seg ugjenkallelig den eksklusive jurisdiksjonen til, domstolene i **styrende stat**.

## 12. Forhold til tjenesteleverandør {#12-service-provider-relationship}

I den grad California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq ("CCPA") gjelder, erkjenner og samtykker partene i at <strong>Leverandøren</strong> er en tjenesteleverandør og mottar personopplysninger fra <strong>kunden</strong> for å levere tjenesten som avtalt i <strong>avtalen</strong>, som utgjør et forretningsformål. <strong>Leverandøren</strong> vil ikke selge noen personopplysninger levert av <strong>kunden</strong> i henhold til <strong>avtalen</strong>. I tillegg vil <strong>Leverandøren</strong> ikke beholde, bruke eller utlevere noen personopplysninger levert av <strong>kunden</strong> i henhold til <strong>avtalen</strong>, unntatt det som er nødvendig for å levere tjenesten til <strong>kunden</strong>, som angitt i <strong>avtalen</strong>, eller som tillatt i henhold til gjeldende personvernlover. <strong>Leverandøren</strong> bekrefter at den forstår begrensningene i dette avsnittet.

## 13. Definisjoner {#13-definitions}

1. **«Gjeldende lover»** betyr lover, regler, forskrifter, rettskjennelser og andre bindende krav fra en relevant myndighet som gjelder for eller styrer en part.

2. **«Gjeldende personvernlover»** betyr gjeldende lover som styrer hvordan Tjenesten kan behandle eller bruke en persons personopplysninger, personopplysninger, personlig identifiserbar informasjon eller andre lignende begreper.

3. **«Behandlingsansvarlig»** skal ha den(de) betydningen(e) som er gitt i gjeldende personvernlover for selskapet som bestemmer formålet med og omfanget av behandlingen av personopplysninger.

4. **«Forside»** betyr et dokument som er signert eller elektronisk akseptert av partene, som innlemmer disse standardvilkårene for databehandling og identifiserer **Leverandør**, **Kunde**, samt innholdet og detaljene for databehandlingen.

5. **«Kundens personopplysninger»** betyr personopplysninger som **Kunden** laster opp eller gir til **Leverandøren** som en del av Tjenesten, og som er underlagt denne databehandleravtalen.

6. **«DPA»** betyr disse standardvilkårene for DPA, forsiden mellom <strong>leverandøren</strong> og <strong>kunden</strong>, og retningslinjene og dokumentene som det refereres til i eller er vedlagt forsiden.

7. **«EØS-standardkontraktsklausuler»** betyr standardkontraktsklausulene som er vedlagt Europakommisjonens gjennomføringsbeslutning 2021/914 av 4. juni 2021 om standardkontraktsklausuler for overføring av personopplysninger til tredjestater i henhold til Europaparlamentets og Det europeiske råds forordning (EU) 2016/679.

8. **«Det europeiske økonomiske samarbeidsområdet»** eller **«EØS»** betyr medlemslandene i Den europeiske union, Norge, Island og Liechtenstein.

9. **«GDPR»** betyr EU-forordning 2016/679 slik den er implementert i lokal lov i det relevante EØS-landet.

10. **«Personopplysninger»** skal ha den(de) betydningen(e) som er gitt i gjeldende personvernlover for personopplysninger, personopplysninger eller andre lignende begreper.

11. **«Behandling»** eller **«Prosess»** skal ha den(de) betydningen(e) som er gitt i gjeldende personvernlover for enhver bruk av, eller utførelse av en datamaskinoperasjon på, personopplysninger, inkludert ved automatiske metoder.

12. **«Databehandler»** skal ha den(de) betydningen(e) som er gitt i gjeldende personvernlover for selskapet som behandler personopplysninger på vegne av den behandlingsansvarlige.

13. **«Rapport»** betyr revisjonsrapporter utarbeidet av et annet selskap i henhold til standardene definert i sikkerhetspolicyen på vegne av leverandøren.

14. **«Begrenset overføring»** betyr (a) der GDPR gjelder, en overføring av personopplysninger fra EØS til et land utenfor EØS som ikke er underlagt en tilstrekkelighetsvurdering av Europakommisjonen; og (b) der den britiske GDPR gjelder, en overføring av personopplysninger fra Storbritannia til ethvert annet land som ikke er underlagt tilstrekkelighetsforskrifter vedtatt i henhold til paragraf 17A i den britiske databeskyttelsesloven av 2018.

15. **«Sikkerhetshendelse»** betyr et brudd på personopplysninger som definert i artikkel 4 i GDPR.

16. **«Tjeneste»** betyr produktet og/eller tjenestene som er beskrevet i **Avtalen**.

17. **«Spesiell kategoridata»** skal ha den betydningen som er gitt i artikkel 9 i GDPR.

18. **«Underdatabehandler»** skal ha den(de) betydningen(e) som er gitt i gjeldende personvernlover for et selskap som, med godkjenning og aksept fra behandlingsansvarlig, bistår databehandleren med å behandle personopplysninger på vegne av behandlingsansvarlig.

19. **«UK GDPR»** betyr EU-forordning 2016/679 slik den er implementert i Storbritannia ved paragraf 3 i Storbritannias EU-lov (utmeldingsloven) av 2018.

20. **«Tillegg til Storbritannia»** betyr tillegget for internasjonal dataoverføring til standardkontraktsklausulene i EØS, utstedt av informasjonskommissæren for parter som foretar begrensede overføringer i henhold til paragraf S119A(1) i personvernloven av 2018.

## Krediteringer {#credits}

Dette dokumentet er et derivat av [Vanlige standardvilkår for DPA-dokumenter (versjon 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) og er lisensiert under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).