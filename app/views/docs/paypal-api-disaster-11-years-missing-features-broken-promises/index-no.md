# PayPals 11-årige API-katastrofe: Hvordan vi bygde omveier mens de ignorerte utviklere {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Suksess! PayPal har endelig lagt til `GET /v1/billing/subscriptions` endepunktet.**
>
> Etter at vi publiserte dette innlegget og sendte det på e-post til PayPals ledelse, implementerte teamene deres det etterlengtede endepunktet for å liste abonnementer. Endringen dukket opp en gang mellom [25. juni 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) og [9. juli 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Men i ekte PayPal-stil varslet de oss aldri. Vi oppdaget denne oppdateringen på egen hånd i desember 2025, måneder etter at funksjonen ble stille lansert.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Hos Forward Email har vi håndtert PayPals ødelagte API-er i over et tiår. Det som startet som mindre frustrasjoner, har utviklet seg til en fullstendig katastrofe som tvang oss til å bygge våre egne omveier, blokkere deres phishing-maler, og til slutt stoppe alle PayPal-betalinger under en kritisk kontomigrering.</p>
<p class="lead mt-3">Dette er historien om 11 år med at PayPal ignorerte grunnleggende utviklerbehov mens vi prøvde alt for å få plattformen deres til å fungere.</p>


## Innholdsfortegnelse {#table-of-contents}

* [Den manglende brikken: Ingen måte å liste abonnementer på](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problemet oppstår](#2014-2017-the-problem-emerges)
* [2020: Vi gir dem omfattende tilbakemeldinger](#2020-we-give-them-extensive-feedback)
  * [Den 27-punkts tilbakemeldingslisten](#the-27-item-feedback-list)
  * [Teamene ble involvert, løfter ble gitt](#teams-got-involved-promises-were-made)
  * [Resultatet? Ingenting.](#the-result-nothing)
* [Den ledende utvandringen: Hvordan PayPal mistet all institusjonell hukommelse](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Ny ledelse, de samme problemene](#2025-new-leadership-same-problems)
  * [Den nye CEO-en blir involvert](#the-new-ceo-gets-involved)
  * [Michelle Gills svar](#michelle-gills-response)
  * [Vårt svar: Ingen flere møter](#our-response-no-more-meetings)
  * [Marty Brodbecks overengineering-svar](#marty-brodbecks-overengineering-response)
  * [«Enkel CRUD»-motsetningen](#the-simple-crud-contradiction)
  * [Frakoblingen blir tydelig](#the-disconnect-becomes-clear)
* [År med feilrapporter de ignorerte](#years-of-bug-reports-they-ignored)
  * [2016: Tidlige UI/UX-klager](#2016-early-uiux-complaints)
  * [2021: Feilrapport for bedrifts-e-post](#2021-business-email-bug-report)
  * [2021: Forslag til UI-forbedringer](#2021-ui-improvement-suggestions)
  * [2021: Feil i sandbox-miljøet](#2021-sandbox-environment-failures)
  * [2021: Rapportsystemet helt ødelagt](#2021-reports-system-completely-broken)
  * [2022: Kjerne-API-funksjon mangler (igjen)](#2022-core-api-feature-missing-again)
* [Utvikleropplevelsens mareritt](#the-developer-experience-nightmare)
  * [Ødelagt brukergrensesnitt](#broken-user-interface)
  * [SDK-problemer](#sdk-problems)
  * [Brudd på Content Security Policy](#content-security-policy-violations)
  * [Dokumentasjonskaos](#documentation-chaos)
  * [Sikkerhetssårbarheter](#security-vulnerabilities)
  * [Katastrofe i sesjonshåndtering](#session-management-disaster)
* [Juli 2025: Den siste dråpen](#july-2025-the-final-straw)
* [Hvorfor vi ikke bare kan droppe PayPal](#why-we-cant-just-drop-paypal)
* [Fellesskapets omvei](#the-community-workaround)
* [Blokkering av PayPal-maler på grunn av phishing](#blocking-paypal-templates-due-to-phishing)
  * [Det virkelige problemet: PayPals maler ser ut som svindel](#the-real-problem-paypals-templates-look-like-scams)
  * [Vår implementering](#our-implementation)
  * [Hvorfor vi måtte blokkere PayPal](#why-we-had-to-block-paypal)
  * [Omfanget av problemet](#the-scale-of-the-problem)
  * [Ironien](#the-irony)
  * [Reell påvirkning: Nye PayPal-svindler](#real-world-impact-novel-paypal-scams)
* [PayPals bakvendte KYC-prosess](#paypals-backwards-kyc-process)
  * [Hvordan det burde fungere](#how-it-should-work)
  * [Hvordan PayPal faktisk fungerer](#how-paypal-actually-works)
  * [Den virkelige påvirkningen](#the-real-world-impact)
  * [Kontomigreringskatastrofen i juli 2025](#the-july-2025-account-migration-disaster)
  * [Hvorfor dette betyr noe](#why-this-matters)
* [Hvordan alle andre betalingsprosessorer gjør det riktig](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Bransjestandarden](#the-industry-standard)
  * [Hva andre prosessorer tilbyr vs PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematiske tildekking: Tause 6 millioner stemmer](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Den store utslettelsen](#the-great-erasure)
  * [Tredjepartsredningen](#the-third-party-rescue)
* [Den 11-årige capture-feilkatastrofen: $1,899 og teller videre](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Emails tap på $1,899](#forward-emails-1899-loss)
  * [Den opprinnelige rapporten fra 2013: 11+ år med forsømmelse](#the-2013-original-report-11-years-of-negligence)
  * [Innrømmelsen i 2016: PayPal ødelegger sin egen SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Opptrappingen i 2024: Fortsatt ødelagt](#the-2024-escalation-still-broken)
  * [Webhook-pålitelighetskatastrofen](#the-webhook-reliability-disaster)
  * [Mønsteret av systematisk forsømmelse](#the-pattern-of-systematic-negligence)
  * [Det udokumenterte kravet](#the-undocumented-requirement)
* [PayPals bredere mønster av bedrag](#paypals-broader-pattern-of-deception)
  * [New York Department of Financial Services-aksjonen](#the-new-york-department-of-financial-services-action)
  * [Honey-søksmålet: Omskriving av affiliate-lenker](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Kostnaden av PayPals forsømmelse](#the-cost-of-paypals-negligence)
  * [Dokumentasjonsløgn](#the-documentation-lie)
* [Hva dette betyr for utviklere](#what-this-means-for-developers)
## Den Manglende Brikken: Ingen Mulighet til å Liste Abonnementer {#the-missing-piece-no-way-to-list-subscriptions}

Her er tingen som blåser oss av banen: PayPal har hatt abonnementfakturering siden 2014, men de har aldri gitt en måte for selgere å liste sine egne abonnementer.

Tenk på det et øyeblikk. Du kan opprette abonnementer, du kan kansellere dem hvis du har ID-en, men du kan ikke få en liste over alle aktive abonnementer for kontoen din. Det er som å ha en database uten en SELECT-setning.

Vi trenger dette for grunnleggende forretningsdrift:

* Kundestøtte (når noen sender e-post og spør om abonnementet sitt)
* Finansrapportering og avstemming
* Automatisert fakturahåndtering
* Overholdelse og revisjon

Men PayPal? De bare... bygde det aldri.


## 2014-2017: Problemet Oppstår {#2014-2017-the-problem-emerges}

Problemet med abonnementsliste dukket først opp i PayPals community-fora tilbake i 2017. Utviklere stilte det åpenbare spørsmålet: "Hvordan får jeg en liste over alle mine abonnementer?"

PayPals svar? Stillhet.

Community-medlemmer begynte å bli frustrerte:

> "Veldig merkelig utelatelse hvis en selger ikke kan liste alle aktive avtaler. Hvis avtale-ID er tapt betyr det at bare brukeren kan kansellere eller suspendere en avtale." - leafspider

> "+1. Det har gått nesten 3 år." - laudukang (som betyr at problemet har eksistert siden ca. 2014)

[Det opprinnelige community-innlegget](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) fra 2017 viser utviklere som ber om denne grunnleggende funksjonaliteten. PayPals respons var å arkivere depotet hvor folk rapporterte problemet.


## 2020: Vi Gir Dem Omfattende Tilbakemeldinger {#2020-we-give-them-extensive-feedback}

I oktober 2020 tok PayPal kontakt med oss for en formell tilbakemeldingssesjon. Dette var ikke en tilfeldig prat – de organiserte en 45-minutters Microsoft Teams-samtale med 8 PayPal-ledere inkludert Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze, og andre.

### Den 27-Punkts Tilbakemeldingslisten {#the-27-item-feedback-list}

Vi kom forberedt. Etter 6 timer med forsøk på å integrere med deres API-er, hadde vi samlet 27 spesifikke problemer. Mark Stuart fra PayPal Checkout-teamet sa:

> Hei Nick, takk for at du delte med alle i dag! Jeg tror dette vil være katalysatoren for å få mer støtte og investering for teamet vårt til å gå og fikse disse tingene. Det har vært vanskelig å få så grundige tilbakemeldinger som det du har gitt oss så langt.

Tilbakemeldingene var ikke teoretiske – de kom fra reelle integrasjonsforsøk:

1. **Generering av tilgangstoken fungerer ikke**:

> Generering av tilgangstoken fungerer ikke. Det burde også være mer enn bare cURL-eksempler.

2. **Ingen web-UI for opprettelse av abonnement**:

> Hvordan i all verden kan man opprette abonnementer uten å måtte gjøre det med cURL? Det ser ikke ut til å være noe web-UI for dette (som Stripe har)

Mark Stuart syntes tilgangstoken-problemet var spesielt bekymringsfullt:

> Vi hører vanligvis ikke om problemer rundt generering av tilgangstoken.

### Flere Team Ble Involvert, Løfter Ble Gitt {#teams-got-involved-promises-were-made}

Etter hvert som vi oppdaget flere problemer, fortsatte PayPal å legge til flere team i samtalen. Darshan Raju fra abonnementshåndterings-UI-teamet ble med og sa:

> Anerkjenner gapet. Vi vil følge opp og ta tak i dette. Takk igjen for tilbakemeldingen!

Sesjonen ble beskrevet som en:

> ærlig gjennomgang av din erfaring

for å:

> gjøre PayPal til det det burde være for utviklere.

### Resultatet? Ingenting. {#the-result-nothing}

Til tross for den formelle tilbakemeldingssesjonen, den omfattende 27-punkts listen, involvering av flere team, og løfter om å:

> følge opp og ta tak i

problemene, ble absolutt ingenting fikset.


## Lederflukten: Hvordan PayPal Mistet All Institusjonell Hukommelse {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Her blir det virkelig interessant. Hver eneste person som mottok vår tilbakemelding i 2020 har forlatt PayPal:

**Lederskapsendringer:**

* [Dan Schulman (CEO i 9 år) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO som organiserte tilbakemeldingen) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januar 2024)
**Tekniske ledere som ga løfter, men så sluttet:**

* **Mark Stuart** (lovet at tilbakemeldinger skulle være en "katalysator") → [Nå hos Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-årig PayPal-veteran) → [Administrerende direktør i MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Pensjonert](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (en av de siste gjenværende) → [Sluttet nettopp for Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januar 2025)

PayPal har blitt en roterende dør hvor ledere samler inn tilbakemeldinger fra utviklere, gir løfter, og så forlater selskapet for bedre muligheter hos selskaper som JPMorgan, Ripple og andre fintech-firmaer.

Dette forklarer hvorfor GitHub-svaret i 2025 virket helt frakoblet fra vår tilbakemelding i 2020 – bokstavelig talt har alle som mottok den tilbakemeldingen forlatt PayPal.


## 2025: Ny ledelse, de samme problemene {#2025-new-leadership-same-problems}

Spol frem til 2025, og det samme mønsteret dukker opp igjen. Etter år uten fremgang tar PayPals nye ledelse kontakt igjen.

### Den nye administrerende direktøren involverer seg {#the-new-ceo-gets-involved}

Den 30. juni 2025 eskalerte vi direkte til PayPals nye administrerende direktør Alex Chriss. Hans svar var kort:

> Hei Nick – Takk for at du tok kontakt og for tilbakemeldingen. Michelle (kopiert) har ansvaret med sitt team for å engasjere seg og jobbe gjennom dette med deg. Takk -A

### Michelle Gills svar {#michelle-gills-response}

Michelle Gill, EVP og General Manager for Small Business and Financial Services, svarte:

> Tusen takk Nick, flytter Alex til bcc. Vi har sett på dette siden ditt tidligere innlegg. Vi ringer deg før uken er omme. Kan du sende meg kontaktinformasjonen din slik at en av mine kolleger kan ta kontakt. Michelle

### Vårt svar: Ingen flere møter {#our-response-no-more-meetings}

Vi takket nei til et nytt møte og forklarte vår frustrasjon:

> Takk. Men jeg føler ikke at det å ta en samtale vil føre til noe. Her er hvorfor... Jeg har vært med på en samtale tidligere, og det førte absolutt ingen vei. Jeg kastet bort over 2 timer av tiden min på å snakke med hele teamet og ledelsen, og ingenting ble gjort... Masse e-poster fram og tilbake. Absolutt ingenting ble gjort. Tilbakemeldingene førte ingen vei. Jeg har prøvd i årevis, blitt hørt, og så fører det ingen vei.

### Marty Brodbecks overkompliserte svar {#marty-brodbecks-overengineering-response}

Så tok Marty Brodbeck, som leder forbrukerteknologi hos PayPal, kontakt:

> Hei Nick, dette er Marty Brodbeck. Jeg leder all forbrukerteknologi her hos PayPal og har drevet API-utviklingen for selskapet. Kan du og jeg ta en prat om problemet du står overfor og hvordan vi kan hjelpe her.

Da vi forklarte det enkle behovet for et endepunkt som viser abonnementer, avslørte hans svar det eksakte problemet:

> Takk Nick, vi er i ferd med å lage en enkelt abonnement-API med full SDK (støtter full feilhåndtering, hendelsesbasert abonnementssporing, robust oppetid) hvor fakturering også er delt ut som en egen API for handelsmenn å gå til i stedet for å måtte orkestrere på tvers av flere endepunkter for å få ett enkelt svar.

Dette er akkurat feil tilnærming. Vi trenger ikke måneder med kompleks arkitektur. Vi trenger ett enkelt REST-endepunkt som viser abonnementer – noe som burde ha eksistert siden 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Motsetningen i "Enkel CRUD" {#the-simple-crud-contradiction}

Da vi påpekte at dette var grunnleggende CRUD-funksjonalitet som burde ha eksistert siden 2014, var Martys svar avslørende:

> Enkle CRUD-operasjoner er en del av kjerne-API-et min venn, så det vil ikke ta måneder med utvikling

PayPals TypeScript SDK, som for øyeblikket støtter kun tre endepunkter etter måneder med utvikling, sammen med dens historiske tidslinje, viser tydelig at slike prosjekter krever mer enn noen få måneder å fullføre.
Dette svaret viser at han ikke forstår sin egen API. Hvis "enkle CRUD-operasjoner er en del av kjerne-API-en," hvor er da endepunktet for abonnementsliste? Vi svarte:

> Hvis 'enkle CRUD-operasjoner er en del av kjerne-API-en' hvor er da endepunktet for abonnementsliste? Utviklere har etterspurt denne 'enkle CRUD-operasjonen' siden 2014. Det har gått 11 år. Alle andre betalingsprosessorer har hatt denne grunnleggende funksjonaliteten siden dag én.

### The Disconnect Becomes Clear {#the-disconnect-becomes-clear}

Utvekslingene i 2025 med Alex Chriss, Michelle Gill og Marty Brodbeck viser den samme organisatoriske dysfunksjonen:

1. **Ny ledelse har ingen kunnskap om tidligere tilbakemeldingsøkter**
2. **De foreslår de samme overkompliserte løsningene**
3. **De forstår ikke sine egne API-begrensninger**
4. **De ønsker flere møter i stedet for bare å fikse problemet**

Dette mønsteret forklarer hvorfor PayPal-teamene i 2025 virker helt frakoblet den omfattende tilbakemeldingen som ble gitt i 2020 – de som mottok den tilbakemeldingen er borte, og den nye ledelsen gjentar de samme feilene.


## År med feilrapporter de ignorerte {#years-of-bug-reports-they-ignored}

Vi klaget ikke bare på manglende funksjoner. Vi rapporterte aktivt feil og prøvde å hjelpe dem med å forbedre seg. Her er en omfattende tidslinje over problemene vi dokumenterte:

### 2016: Tidlige UI/UX-klager {#2016-early-uiux-complaints}

Allerede i 2016 tok vi offentlig kontakt med PayPal-ledelsen, inkludert Dan Schulman, om grensesnittproblemer og brukervennlighetsproblemer. Dette var for 9 år siden, og de samme UI/UX-problemene vedvarer i dag.

### 2021: Feilrapport for forretnings-e-post {#2021-business-email-bug-report}

I mars 2021 rapporterte vi at PayPals forretnings-e-postsystem sendte feilaktige kanselleringsvarsler. E-postmalen hadde variabler som ble gjengitt feil, noe som viste forvirrende meldinger til kundene.

Mark Stuart bekreftet problemet:

> Takk Nick! Går over til BCC. @Prasy, er teamet ditt ansvarlig for denne e-posten eller vet du hvem som er? "Niftylettuce, LLC, we'll no longer bill you" får meg til å tro at det er en forveksling i hvem den er adressert til og innholdet i e-posten.

**Resultat**: De fikset faktisk denne! Mark Stuart bekreftet:

> Hørte nettopp fra varslingsteamet at e-postmalen er fikset og rullet ut. Setter pris på at du tok kontakt for å rapportere det. Takk!

Dette viser at de KAN fikse ting når de vil – de velger bare å ikke gjøre det for de fleste problemer.

### 2021: Forslag til UI-forbedringer {#2021-ui-improvement-suggestions}

I februar 2021 ga vi detaljert tilbakemelding på deres dashbord-UI, spesielt delen "PayPal Recent Activity":

> Jeg synes dashbordet på paypal.com, spesielt "PayPal Recent Activity", trenger forbedring. Jeg synes ikke dere bør vise $0 tilbakevendende betalinger med status "Created" – det legger bare til mange ekstra linjer, og man kan ikke enkelt se på et blikk hvor mye inntekt som genereres for dagen/de siste dagene.

Mark Stuart videresendte det til teamet for forbrukerprodukter:

> Takk! Jeg er ikke sikker på hvilket team som er ansvarlig for Activity, men jeg videresendte det til lederen for forbrukerprodukter for å finne riktig team. En tilbakevendende betaling på $0,00 virker som en feil. Bør sannsynligvis filtreres ut.

**Resultat**: Aldri fikset. UI viser fortsatt disse ubrukelige $0-oppføringene.

### 2021: Feil i sandbox-miljøet {#2021-sandbox-environment-failures}

I november 2021 rapporterte vi kritiske problemer med PayPals sandbox-miljø:

* Sandbox hemmelige API-nøkler ble tilfeldig endret og deaktivert
* Alle sandbox testkontoer ble slettet uten varsel
* Feilmeldinger ved forsøk på å se sandbox-kontodetaljer
* Intermitterende lastfeil

> Av en eller annen grunn ble min sandbox hemmelige API-nøkkel endret og deaktivert. Også alle mine gamle sandbox testkontoer ble slettet.

> Noen ganger lastes de og noen ganger ikke. Dette er utrolig frustrerende.

**Resultat**: Ingen respons, ingen løsning. Utviklere opplever fortsatt pålitelighetsproblemer med sandbox.

### 2021: Rapportsystemet er helt ødelagt {#2021-reports-system-completely-broken}
I mai 2021 rapporterte vi at PayPals nedlastingssystem for transaksjonsrapporter var helt ødelagt:

> Det ser ut som rapportnedlastinger ikke fungerer akkurat nå og har ikke gjort det hele dagen. Man burde også sannsynligvis få en e-postvarsling hvis det feiler.

Vi påpekte også katastrofen med sesjonshåndteringen:

> Også, hvis du er inaktiv mens du er logget inn i PayPal i omtrent 5 minutter, blir du logget ut. Så når du oppdaterer knappen igjen ved siden av rapporten du vil sjekke statusen på (etter at du har ventet evigheter), er det et ork å måtte logge inn igjen.

Mark Stuart anerkjente problemet med sesjonsutløp:

> Jeg husker du hadde rapportert det tidligere med at sesjonen din ofte utløp og forstyrret utviklingsflyten din mens du byttet mellom IDE-en din og developer.paypal.com eller handelsdashbordet ditt, så kom du tilbake og var logget ut igjen.

**Resultat**: Sesjonsutløp er fortsatt 60 sekunder. Rapportsystemet feiler fortsatt regelmessig.

### 2022: Kjerne-API-funksjon mangler (igjen) {#2022-core-api-feature-missing-again}

I januar 2022 eskalerte vi abonnementslisteproblemet igjen, denne gangen med enda mer detaljer om hvordan dokumentasjonen deres var feil:

> Det finnes ingen GET som lister opp alle abonnementer (tidligere kalt faktureringsavtaler)

Vi oppdaget at deres offisielle dokumentasjon var helt unøyaktig:

> API-dokumentasjonen er også helt unøyaktig. Vi trodde vi kunne gjøre en omgåelse ved å laste ned en hardkodet liste over abonnement-ID-er. Men det fungerer ikke engang!

> Fra den offisielle dokumentasjonen her... Det står at du kan gjøre dette... Her er poenget – det finnes ikke noe "Subscription ID"-felt noe sted som kan krysses av.

Christina Monti fra PayPal svarte:

> Beklager frustrasjonene forårsaket av at disse stegene var feil, vi skal fikse det denne uken.

Sri Shivananda (CTO) takket oss:

> Takk for din fortsatte hjelp med å gjøre oss bedre. Veldig verdsatt.

**Resultat**: Dokumentasjonen ble aldri fikset. Endepunktet for abonnementsliste ble aldri opprettet.


## Utvikleropplevelsens mareritt {#the-developer-experience-nightmare}

Å jobbe med PayPals API-er er som å gå ti år tilbake i tid. Her er de tekniske problemene vi har dokumentert:

### Ødelagt brukergrensesnitt {#broken-user-interface}

PayPal utviklerdashbord er en katastrofe. Her er hva vi håndterer daglig:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPals brukergrensesnitt er så ødelagt at du ikke engang kan avvise varsler
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Nettleseren din støtter ikke videotaggen.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Utviklerdashbordet får deg bokstavelig talt til å dra en skyveknapp, så logger det deg ut etter 60 sekunder
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Nettleseren din støtter ikke videotaggen.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Flere UI-katastrofer i PayPals utviklergrensesnitt som viser ødelagte arbeidsflyter
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Nettleseren din støtter ikke videotaggen.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Abonnementsadministrasjonsgrensesnittet – grensesnittet er så dårlig at vi måtte stole på kode for å generere produkter og abonnementsplaner
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  En visning av det ødelagte abonnementsgrensesnittet med manglende funksjonalitet (du kan ikke enkelt opprette produkter/planer/abonnementer – og det ser ikke ut til å være noen måte å slette produkter eller planer etter at de er opprettet i UI)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typiske PayPal-feilmeldinger - kryptiske og ubrukelige
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problemer {#sdk-problems}

* Kan ikke håndtere både engangsbetalinger og abonnementer uten komplekse omveier som involverer bytting og gjengivelse av knapper samtidig som SDK lastes på nytt med skript-tagger
* JavaScript SDK bryter grunnleggende konvensjoner (små bokstaver i klassenavn, ingen instanssjekking)
* Feilmeldinger indikerer ikke hvilke felt som mangler
* Uensartede datatyper (krever beløp som strenger i stedet for tall)

### Brudd på Content Security Policy {#content-security-policy-violations}

Deres SDK krever unsafe-inline og unsafe-eval i din CSP, **noe som tvinger deg til å kompromittere sikkerheten på nettstedet ditt**.

### Dokumentasjonskaos {#documentation-chaos}

Mark Stuart selv innrømmet:

> Enig i at det finnes en absurd mengde av både gamle og nye API-er. Veldig vanskelig å finne det man leter etter (selv for oss som jobber her).

### Sikkerhetssårbarheter {#security-vulnerabilities}

**PayPals 2FA-implementering er bakvendt**. Selv med TOTP-apper aktivert, tvinger de SMS-verifisering – noe som gjør kontoer sårbare for SIM-swap-angrep. Hvis du har TOTP aktivert, burde det brukes eksklusivt. Tilbakefallsmetoden burde være e-post, ikke SMS.

### Katastrofe i sesjonshåndtering {#session-management-disaster}

**Deres utviklerdashboard logger deg ut etter 60 sekunder uten aktivitet**. Prøv å gjøre noe produktivt, og du må stadig gjennom: innlogging → captcha → 2FA → utlogging → gjenta. Bruker du VPN? Lykke til.


## Juli 2025: Den siste dråpen {#july-2025-the-final-straw}

Etter 11 år med de samme problemene, kom bristepunktet under en rutinemessig kontomigrering. Vi måtte bytte til en ny PayPal-konto for å matche firmanavnet vårt "Forward Email LLC" for ryddigere regnskap.

Det som skulle vært enkelt, ble en komplett katastrofe:

* Innledende testing viste at alt fungerte korrekt
* Timer senere blokkerte PayPal plutselig alle abonnementbetalinger uten varsel
* Kunder kunne ikke betale, noe som skapte forvirring og økt supportbelastning
* PayPal-support ga motstridende svar og hevdet at kontoene var verifisert
* Vi ble tvunget til å stoppe PayPal-betalinger helt

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Feilen kundene så når de prøvde å betale – ingen forklaring, ingen logger, ingenting
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal-support som hevder alt var i orden mens betalingene var helt ødelagt. Den siste meldingen viser at de sier de "gjenopprettet noen funksjoner" men fortsatt ber om mer uspesifisert informasjon – klassisk PayPal-supportteater
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
  Identitetsverifiseringsprosessen som angivelig "fikset" ingenting
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
  Vagt budskap og fortsatt ingen løsning. Null informasjon, varsler eller noe som helst om hvilken tilleggsinformasjon som kreves. Kundestøtte blir stille.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Hvorfor vi ikke bare kan droppe PayPal {#why-we-cant-just-drop-paypal}

Til tross for alle disse problemene kan vi ikke helt forlate PayPal fordi noen kunder kun har PayPal som betalingsalternativ. Som en kunde sa på vår [statusside](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal er mitt eneste betalingsalternativ

**Vi sitter fast med å støtte en ødelagt plattform fordi PayPal har skapt et betalingsmonopol for visse brukere.**


## Fellesskapets løsning {#the-community-workaround}

Siden PayPal ikke tilbyr grunnleggende funksjonalitet for oversikt over abonnementer, har utviklermiljøet laget løsninger. Vi har laget et skript som hjelper med å administrere PayPal-abonnementer: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dette skriptet refererer til en [community gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) hvor utviklere deler løsninger. Brukere takker oss faktisk [for at vi tilbyr det PayPal burde ha laget for år siden](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775).


## Blokkering av PayPal-maler på grunn av phishing {#blocking-paypal-templates-due-to-phishing}

Problemene går utover API-er. PayPals e-postmaler er så dårlig designet at vi måtte implementere spesifikk filtrering i vår e-posttjeneste fordi de er umulige å skille fra phishing-forsøk.

### Det virkelige problemet: PayPals maler ser ut som svindel {#the-real-problem-paypals-templates-look-like-scams}

Vi mottar jevnlig rapporter om PayPal-e-poster som ser helt ut som phishing-forsøk. Her er et ekte eksempel fra våre misbruksrapporter:

**Emne:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Denne e-posten ble videresendt til `abuse@microsoft.com` fordi den så ut som et phishing-forsøk. Problemet? Den var faktisk fra PayPals sandbox-miljø, men maldesignet deres er så dårlig at det utløser phishing-deteksjonssystemer.

### Vår implementering {#our-implementation}

Du kan se vår PayPal-spesifikke filtrering implementert i vår [kode for e-postfiltrering](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

### Hvorfor vi måtte blokkere PayPal {#why-we-had-to-block-paypal}

Vi implementerte dette fordi PayPal nektet å fikse massive problemer med spam/phishing/svindel til tross for våre gjentatte rapporter til deres misbruksteam. De spesifikke e-posttypene vi blokkerer inkluderer:

* **RT000238** - Mistenkelige fakturavarsler
* **PPC001017** - Problematisk betalingsbekreftelser
* **RT000542** - Forsøk på gave-meldings-hack

### Omfanget av problemet {#the-scale-of-the-problem}

Våre logger for spamfiltrering viser det enorme volumet av PayPal-fakturaspam vi behandler daglig. Eksempler på blokkerte emner inkluderer:

* "Faktura fra PayPal Billing Team:- Denne belastningen vil automatisk trekkes fra kontoen din. Vennligst kontakt oss umiddelbart på \[PHONE]"
* "Faktura fra \[COMPANY NAME] (\[ORDER-ID])"
* Flere varianter med forskjellige telefonnumre og falske ordre-IDer
Disse e-postene kommer ofte fra `outlook.com`-verter, men ser ut til å stamme fra PayPals legitime systemer, noe som gjør dem spesielt farlige. E-postene passerer SPF-, DKIM- og DMARC-autentisering fordi de sendes gjennom PayPals faktiske infrastruktur.

Våre tekniske logger viser at disse spam-e-postene inneholder legitime PayPal-headere:

* `X-Email-Type-Id: RT000238` (samme ID som vi blokkerer)
* `From: "service@paypal.com" <service@paypal.com>`
* Gyldige DKIM-signaturer fra `paypal.com`
* Korrekte SPF-poster som viser PayPals e-postservere

Dette skaper en umulig situasjon: legitime PayPal-e-poster og spam har begge identiske tekniske kjennetegn.

### Ironien {#the-irony}

PayPal, et selskap som burde lede kampen mot økonomisk svindel, har e-postmaler som er så dårlig utformet at de utløser anti-phishing-systemer. Vi blir tvunget til å blokkere legitime PayPal-e-poster fordi de er umulige å skille fra svindel.

Dette er dokumentert i sikkerhetsforskning: [Pass på PayPals nye adresse-svindel](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – som viser hvordan PayPals egne systemer blir utnyttet til svindel.

### Virkelige konsekvenser: Nye PayPal-svindler {#real-world-impact-novel-paypal-scams}

Problemet går utover bare dårlig maldesign. PayPals fakturasystem er så lett å utnytte at svindlere regelmessig misbruker det til å sende legitime utseende falske fakturaer. Sikkerhetsforsker Gavin Anderegg dokumenterte [En ny PayPal-svindel](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) hvor svindlere sender ekte PayPal-fakturaer som passerer alle autentiseringskontroller:

> "Ved å inspisere kilden så e-posten ut som den faktisk kom fra PayPal (SPF, DKIM og DMARC passerte alle). Knappen lenket også til det som så ut som en legitim PayPal-URL... Det tok et øyeblikk før jeg skjønte at det var en ekte e-post. Jeg hadde nettopp fått tilsendt en tilfeldig 'faktura' fra en svindler."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Skjermbilde som viser flere falske PayPal-fakturaer som oversvømmer en innboks, alle ser legitime ut fordi de faktisk kommer fra PayPals systemer
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Forskeren bemerket:

> "Det virker også som en bekvemmelighetsfunksjon som PayPal burde vurdere å låse ned. Jeg antok umiddelbart at dette var en form for svindel og var bare interessert i de tekniske detaljene. Det virker altfor lett å gjennomføre, og jeg er bekymret for at andre kan gå på limpinnen."

Dette illustrerer problemet perfekt: PayPals egne legitime systemer er så dårlig utformet at de muliggjør svindel samtidig som de gjør legitime kommunikasjoner mistenkelige.

For å gjøre saken verre, påvirket dette vår leveringsgrad med Yahoo, noe som resulterte i kunde-klager og mange timer med nøye testing og mønstergjennomgang.


## PayPals bakvendte KYC-prosess {#paypals-backwards-kyc-process}

En av de mest frustrerende aspektene ved PayPals plattform er deres bakvendte tilnærming til samsvar og Know Your Customer (KYC)-prosedyrer. I motsetning til alle andre betalingsprosessorer, lar PayPal utviklere integrere sine API-er og begynne å motta betalinger i produksjon før riktig verifisering er fullført.

### Slik burde det fungere {#how-it-should-work}

Hver legitim betalingsprosessor følger denne logiske rekkefølgen:

1. **Fullfør KYC-verifisering først**
2. **Godkjenn selgerkontoen**
3. **Gi tilgang til produksjons-API**
4. **Tillat innkreving av betalinger**

Dette beskytter både betalingsprosessoren og selgeren ved å sikre samsvar før penger skifter hender.

### Slik fungerer PayPal faktisk {#how-paypal-actually-works}

PayPals prosess er helt bakvendt:

1. **Gi umiddelbart tilgang til produksjons-API**
2. **Tillat innkreving av betalinger i timer eller dager**
3. **Blokker plutselig betalinger uten varsel**
4. **Krev KYC-dokumentasjon etter at kundene allerede er berørt**
5. **Gi ingen varsling til selgeren**
6. **La kundene oppdage problemet og rapportere det**
### Den virkelige påvirkningen {#the-real-world-impact}

Denne bakvendte prosessen skaper katastrofer for bedrifter:

* **Kunder kan ikke fullføre kjøp** i perioder med høyt salg
* **Ingen forhåndsvarsling** om at verifisering er nødvendig
* **Ingen e-postvarsler** når betalinger blir blokkert
* **Selgere får vite om problemer fra forvirrede kunder**
* **Inntektstap** i kritiske forretningsperioder
* **Skade på kundetillit** når betalinger mystisk feiler

### Katastrofen med kontomigreringen i juli 2025 {#the-july-2025-account-migration-disaster}

Dette eksakte scenariet utspilte seg under vår rutinemessige kontomigrering i juli 2025. PayPal tillot betalinger å fungere i starten, for så plutselig å blokkere dem uten noen varsling. Vi oppdaget problemet først da kunder begynte å rapportere at de ikke kunne betale.

Da vi kontaktet support, fikk vi motstridende svar om hvilken dokumentasjon som var nødvendig, uten noen klar tidslinje for løsning. Dette tvang oss til å stoppe PayPal-betalinger helt, noe som forvirret kunder som ikke hadde andre betalingsalternativer.

### Hvorfor dette er viktig {#why-this-matters}

PayPals tilnærming til samsvar viser en grunnleggende misforståelse av hvordan bedrifter opererer. Korrekt KYC bør skje **før** produksjonsintegrasjon, ikke etter at kundene allerede prøver å betale. Mangelen på proaktiv kommunikasjon når problemer oppstår, viser PayPals frakobling fra selgernes behov.

Denne bakvendte prosessen er symptomatisk for PayPals bredere organisatoriske problemer: de prioriterer sine interne prosesser over selger- og kundeopplevelsen, noe som fører til den typen operasjonelle katastrofer som driver bedrifter bort fra plattformen deres.


## Hvordan alle andre betalingsprosessorer gjør det riktig {#how-every-other-payment-processor-does-it-right}

Funksjonaliteten for abonnementslister som PayPal nekter å implementere, har vært standard i bransjen i over et tiår. Slik håndterer andre betalingsprosessorer dette grunnleggende kravet:

### Stripe {#stripe}

Stripe har hatt abonnementslister siden deres API ble lansert. Dokumentasjonen deres viser tydelig hvordan man henter alle abonnementer for en kunde eller selgerkonto. Dette regnes som grunnleggende CRUD-funksjonalitet.

### Paddle {#paddle}

Paddle tilbyr omfattende API-er for abonnementshåndtering inkludert listing, filtrering og paginering. De forstår at selgere trenger å se sine tilbakevendende inntektsstrømmer.

### Coinbase Commerce {#coinbase-commerce}

Selv kryptovalutabaserte betalingsprosessorer som Coinbase Commerce tilbyr bedre abonnementshåndtering enn PayPal.

### Square {#square}

Squares API inkluderer abonnementslister som en grunnleggende funksjon, ikke en ettertanke.

### Bransjestandarden {#the-industry-standard}

Hver moderne betalingsprosessor tilbyr:

* Liste over alle abonnementer
* Filtrering etter status, dato, kunde
* Paginering for store datasett
* Webhook-varsler for endringer i abonnementer
* Omfattende dokumentasjon med fungerende eksempler

### Hva andre prosessorer tilbyr vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Liste over alle abonnementer:**

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

**Stripe - Filtrer etter kunde:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrer etter status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Hva du faktisk får:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Du kan KUN hente ETT abonnement hvis du allerede kjenner ID-en
# Det finnes INGEN endepunkt for å liste alle abonnementer
# Det finnes INGEN måte å søke eller filtrere på
# Du må selv holde oversikt over alle abonnement-ID-er
```

**PayPals tilgjengelige endepunkter:**

* `POST /v1/billing/subscriptions` - Opprett et abonnement
* `GET /v1/billing/subscriptions/{id}` - Hent ETT abonnement (hvis du kjenner ID)
* `PATCH /v1/billing/subscriptions/{id}` - Oppdater et abonnement
* `POST /v1/billing/subscriptions/{id}/cancel` - Avbryt abonnement
* `POST /v1/billing/subscriptions/{id}/suspend` - Sett abonnement på pause
**Hva som mangler fra PayPal:**

* ❌ Ingen `GET /v1/billing/subscriptions` (liste alle)
* ❌ Ingen søkefunksjonalitet
* ❌ Ingen filtrering etter status, kunde, dato
* ❌ Ingen støtte for paginering

PayPal er den eneste store betalingsprosessoren som tvinger utviklere til å manuelt spore abonnement-IDer i sine egne databaser.


## PayPals systematiske tildekking: Tause 6 millioner stemmer {#paypals-systematic-cover-up-silencing-6-million-voices}

I et grep som perfekt oppsummerer PayPals tilnærming til håndtering av kritikk, tok de nylig hele sitt fellesskapsforum offline, og stilte effektivt over 6 millioner medlemmer i taushet og slettet hundretusener av innlegg som dokumenterte deres feil.

### Den store utslettelsen {#the-great-erasure}

Det opprinnelige PayPal Community på `paypal-community.com` hadde **6 003 558 medlemmer** og inneholdt hundretusener av innlegg, feilrapporter, klager og diskusjoner om PayPals API-feil. Dette representerte over et tiår med dokumenterte bevis på PayPals systematiske problemer.

Den 30. juni 2025 tok PayPal stille hele forumet offline. Alle `paypal-community.com`-lenker gir nå 404-feil. Dette var ikke en migrering eller oppgradering.

### Tredjepartsredningen {#the-third-party-rescue}

Heldigvis har en tredjepartstjeneste på [ppl.lithium.com](https://ppl.lithium.com/) bevart noe av innholdet, noe som lar oss få tilgang til diskusjonene PayPal prøvde å skjule. Denne tredjepartsbevaringen er imidlertid ufullstendig og kan forsvinne når som helst.

Dette mønsteret med å skjule bevis er ikke nytt for PayPal. De har en dokumentert historie med:

* Å fjerne kritiske feilrapporter fra offentligheten
* Å avvikle utviklerverktøy uten varsel
* Å endre API-er uten ordentlig dokumentasjon
* Å tie ned fellesskapsdiskusjoner om deres feil

Nedstengningen av forumet representerer det mest dristige forsøket hittil på å skjule deres systematiske feil fra offentlig gransking.


## Den 11 år lange Capture-feilen: $1 899 og teller {#the-11-year-capture-bug-disaster-1899-and-counting}

Mens PayPal var opptatt med å organisere tilbakemeldingsmøter og komme med løfter, har deres kjernebetaling system vært fundamentalt ødelagt i over 11 år. Bevisene er ødeleggende.

### Forward Emails tap på $1 899 {#forward-emails-1899-loss}

I våre produksjonssystemer oppdaget vi 108 PayPal-betalinger til sammen **$1 899** som gikk tapt på grunn av PayPals capture-feil. Disse betalingene viser et konsekvent mønster:

* `CHECKOUT.ORDER.APPROVED` webhooks ble mottatt
* PayPals capture-API returnerte 404-feil
* Ordrene ble utilgjengelige gjennom PayPals API

Det er umulig å avgjøre om kundene ble belastet siden PayPal fullstendig skjuler debug-logger etter 14 dager og sletter all data fra dashbordet for ordre-IDer som ikke ble capturert.

Dette representerer bare én virksomhet. **De samlede tapene på tvers av tusenvis av selgere over 11+ år er sannsynligvis på millioner av dollar.**

**Vi sier det igjen: de samlede tapene på tvers av tusenvis av selgere over 11+ år er sannsynligvis på millioner av dollar.**

Den eneste grunnen til at vi oppdaget dette er fordi vi er utrolig grundige og datadrevne.

### Den originale rapporten fra 2013: 11+ år med forsømmelse {#the-2013-original-report-11-years-of-negligence}

Den tidligste dokumenterte rapporten om dette eksakte problemet finnes på [Stack Overflow i november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkivert](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Keep receiving 404 Error with Rest API when doing a capture"

Feilen rapportert i 2013 er **identisk** med det Forward Email opplevde i 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Fellesskapets respons i 2013 var talende:

> "There is a reported problem at the moment with REST API. PayPal are working on it."
**11+ år senere, de "jobber fortsatt med det."**

### Inrømmelsen i 2016: PayPal ødelegger sin egen SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

I 2016 dokumenterte PayPals egen GitHub-repositorium [massive capture-feil](https://github.com/paypal/PayPal-PHP-SDK/issues/660) som påvirket deres offisielle PHP SDK. Omfanget var overveldende:

> "Siden 20.09.2016 har alle PayPal capture-forsøk feilet med 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Ingenting ble endret mellom 19.09 og 20.09 i API-integrasjonen. **100 % av capture-forsøkene siden 20.09 har returnert denne feilen.**"

En selger rapporterte:

> "Jeg har hatt **over 1 400 mislykkede capture-forsøk de siste 24 timene**, alle med INVALID_RESOURCE_ID feilmeldingen."

PayPals første respons var å skylde på selgeren og henvise dem til teknisk support. Først etter massiv press innrømmet de feil:

> "Jeg har en oppdatering fra våre produktutviklere. De legger merke til i headerne som sendes over at PayPal-Request-ID sendes med 42 tegn, men **det ser ut til at en nylig endring har begrenset denne ID-en til bare 38 tegn.**"

Denne innrømmelsen avslører PayPals systematiske forsømmelse:

1. **De gjorde udokumenterte brytende endringer**
2. **De ødela sin egen offisielle SDK**
3. **De skyldte først på selgere**
4. **De innrømmet bare feil under press**

Selv etter å ha "fikset" problemet rapporterte selgere:

> "Oppgradert SDK til v1.7.4 og **problemet skjer fortsatt.**"

### Eskaleringen i 2024: Fortsatt ødelagt {#the-2024-escalation-still-broken}

Nylige rapporter fra det bevarte PayPal Community viser at problemet faktisk har blitt verre. En [diskusjon fra september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkivert](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumenterer de samme problemene:

> "Problemet har bare begynt å dukke opp for omtrent 2 uker siden og påvirker ikke alle ordre. **Den mye vanligere feilen ser ut til å være 404 på capture.**"

Selgeren beskriver det samme mønsteret som Forward Email opplevde:

> "Etter å ha forsøkt å capture ordren, returnerer PayPal en 404. Når jeg henter detaljer om ordren: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dette er uten noe spor av en vellykket capture på vår side.**"

### Katastrofen med webhook-pålitelighet {#the-webhook-reliability-disaster}

En annen [bevart community-diskusjon](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) avslører at PayPals webhook-system er fundamentalt upålitelig:

> "Teoretisk sett skal det være to hendelser (CHECKOUT.ORDER.APPROVED og PAYMENT.CAPTURE.COMPLETED) fra webhook-hendelser. Faktisk **mottas disse to hendelsene sjelden umiddelbart, PAYMENT.CAPTURE.COMPLETED mottas som regel ikke eller først etter noen timer.**"

For abonnementbetalinger:

> "**'PAYMENT.SALE.COMPLETED' ble noen ganger ikke mottatt eller først etter noen timer.**"

Selgerens spørsmål avslører dybden i PayPals pålitelighetsproblemer:

1. **"Hvorfor skjer dette?"** - PayPals webhook-system er fundamentalt ødelagt
2. **"Hvis ordrestatus er 'COMPLETED', kan jeg da anta at jeg har mottatt pengene?"** - Selgere kan ikke stole på PayPals API-svar
3. **"Hvorfor kan ikke 'Event Logs->Webhook Events' finne noen logger?"** - Selv PayPals eget loggsystem fungerer ikke

### Mønsteret av systematisk forsømmelse {#the-pattern-of-systematic-negligence}

Bevisene strekker seg over 11+ år og viser et klart mønster:

* **2013**: "PayPal jobber med det"
* **2016**: PayPal innrømmer brytende endring, leverer ødelagt fiks
* **2024**: De samme feilene skjer fortsatt, påvirker Forward Email og utallige andre

Dette er ikke en feil - **dette er systematisk forsømmelse.** PayPal har kjent til disse kritiske betalingsbehandlingsfeilene i over et tiår og har konsekvent:
1. **Skyldte på handelsmenn for PayPals feil**
2. **Gjorde utdatertende bruddendringer uten dokumentasjon**
3. **Ga utilstrekkelige løsninger som ikke fungerer**
4. **Ignorerte den økonomiske påvirkningen på bedrifter**
5. **Skjulte bevis ved å ta ned fellesskapsfora**

### Det udokumenterte kravet {#the-undocumented-requirement}

Ingen steder i PayPals offisielle dokumentasjon nevnes det at handelsmenn må implementere retry-logikk for capture-operasjoner. Deres dokumentasjon sier at handelsmenn bør "capture umiddelbart etter godkjenning," men nevner ikke at API-et deres tilfeldig returnerer 404-feil som krever komplekse retry-mekanismer.

Dette tvinger hver handelsmann til å:

* Implementere eksponentiell backoff retry-logikk
* Håndtere inkonsistent webhook-levering
* Bygge komplekse tilstandsstyringssystemer
* Overvåke mislykkede captures manuelt

**Alle andre betalingsprosessorer tilbyr pålitelige capture-APIer som fungerer første gang.**


## PayPals bredere mønster av bedrag {#paypals-broader-pattern-of-deception}

Capture-feilen er bare ett eksempel på PayPals systematiske tilnærming til å bedra kunder og skjule sine feil.

### New York Department of Financial Services sin aksjon {#the-new-york-department-of-financial-services-action}

I januar 2025 utstedte New York Department of Financial Services en [håndhevelsesaksjon mot PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) for villedende praksis, noe som viser at PayPals mønster av bedrag strekker seg langt utover deres APIer.

Denne regulatoriske aksjonen viser PayPals vilje til å engasjere seg i villedende praksis på tvers av hele virksomheten, ikke bare deres utviklerverktøy.

### Honey-søksmålet: Omskriving av affiliate-lenker {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals oppkjøp av Honey har resultert i [søksmål som hevder at Honey omskriver affiliate-lenker](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), og stjeler provisjoner fra innholdsskapere og influencere. Dette representerer en annen form for systematisk bedrag hvor PayPal tjener penger ved å omdirigere inntekter som skulle gått til andre.

Mønsteret er klart:

1. **API-feil**: Skjuler ødelagt funksjonalitet, skylder på handelsmenn
2. **Fellesskapssensur**: Fjerner bevis på problemer
3. **Regulatoriske brudd**: Engasjerer seg i villedende praksis
4. **Affiliate-tyveri**: Stjeler provisjoner gjennom teknisk manipulering

### Kostnaden av PayPals uaktsomhet {#the-cost-of-paypals-negligence}

Forward Emails tap på $1,899 representerer bare toppen av isfjellet. Vurder den bredere påvirkningen:

* **Enkeltstående handelsmenn**: Tusenvis som taper hundrevis til tusenvis av dollar hver
* **Bedriftskunder**: Potensielt millioner i tapt inntekt
* **Utviklertid**: Utallige timer brukt på å bygge omgåelser for PayPals ødelagte APIer
* **Kundetroverdighet**: Bedrifter mister kunder på grunn av PayPals betalingsfeil

Hvis en liten e-posttjeneste mistet nesten $2,000, og dette problemet har eksistert i over 11 år og påvirket tusenvis av handelsmenn, er den samlede økonomiske skaden sannsynligvis **hundrevis av millioner dollar**.

### Dokumentasjonsløgnene {#the-documentation-lie}

PayPals offisielle dokumentasjon unnlater konsekvent å nevne kritiske begrensninger og feil som handelsmenn vil møte. For eksempel:

* **Capture API**: Ingen nevner at 404-feil er vanlige og krever retry-logikk
* **Webhook-pålitelighet**: Ingen nevner at webhooks ofte forsinkes med timer
* **Abonnementslisting**: Dokumentasjonen antyder at listing er mulig når det ikke finnes noe endepunkt
* **Session timeouts**: Ingen nevner aggressive 60-sekunders tidsavbrudd

Denne systematiske utelatelsen av kritisk informasjon tvinger handelsmenn til å oppdage PayPals begrensninger gjennom prøving og feiling i produksjonssystemer, noe som ofte resulterer i økonomiske tap.


## Hva dette betyr for utviklere {#what-this-means-for-developers}

PayPals systematiske unnlatelse av å adressere grunnleggende utviklerbehov samtidig som de samler omfattende tilbakemeldinger, viser et fundamentalt organisatorisk problem. De behandler tilbakemeldingsinnsamling som en erstatning for faktisk å fikse problemer.
Mønsteret er klart:

1. Utviklere rapporterer problemer  
2. PayPal organiserer tilbakemeldingsmøter med ledelsen  
3. Omfattende tilbakemeldinger gis  
4. Teamene erkjenner mangler og lover å "spore opp og løse"  
5. Ingenting blir implementert  
6. Ledelsen forlater for bedre selskaper  
7. Nye team ber om de samme tilbakemeldingene  
8. Syklusen gjentar seg  

I mellomtiden blir utviklere tvunget til å lage omveier, gå på kompromiss med sikkerheten og håndtere ødelagte brukergrensesnitt bare for å kunne akseptere betalinger.

Hvis du bygger et betalingssystem, lær av vår erfaring: bygg din [trifecta-tilnærming](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) med flere prosessorer, men forvent ikke at PayPal skal tilby den grunnleggende funksjonaliteten du trenger. Planlegg å bygge omveier fra dag én.

> Dette innlegget dokumenterer vår 11-årige erfaring med PayPals API-er hos Forward Email. Alle kodeeksempler og lenker er fra våre faktiske produksjonssystemer. Vi fortsetter å støtte PayPal-betalinger til tross for disse problemene fordi noen kunder ikke har noe annet valg

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
