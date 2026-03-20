# PayPals 11-årige API-katastrofe: Hvordan vi byggede løsninger, mens de ignorerede udviklere {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Succes! PayPal har endelig tilføjet `GET /v1/billing/subscriptions` endpointet.**
>
> Efter vi offentliggjorde dette indlæg og sendte det til PayPals ledende ledelse, implementerede deres teams det længe ventede endpoint til at liste abonnementer. Ændringen dukkede op et sted mellem [25. juni 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) og [9. juli 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Men i ægte PayPal-stil underrettede de os aldrig. Vi opdagede først denne opdatering selv i december 2025, måneder efter funktionen blev stille frigivet.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Hos Forward Email har vi arbejdet med PayPals ødelagte API’er i over et årti. Hvad der startede som mindre frustrationer, er blevet til en komplet katastrofe, der tvang os til at bygge vores egne løsninger, blokere deres phishing-skabeloner og i sidste ende stoppe alle PayPal-betalinger under en kritisk kontomigration.</p>
<p class="lead mt-3">Dette er historien om 11 år, hvor PayPal ignorerede basale udviklerbehov, mens vi prøvede alt for at få deres platform til at fungere.</p>


## Indholdsfortegnelse {#table-of-contents}

* [Det manglende led: Ingen måde at liste abonnementer på](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problemet opstår](#2014-2017-the-problem-emerges)
* [2020: Vi giver dem omfattende feedback](#2020-we-give-them-extensive-feedback)
  * [Den 27-punkts feedbackliste](#the-27-item-feedback-list)
  * [Teams blev involveret, løfter blev givet](#teams-got-involved-promises-were-made)
  * [Resultatet? Intet.](#the-result-nothing)
* [Den ledelsesmæssige udvandring: Hvordan PayPal mistede al institutionel hukommelse](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Ny ledelse, samme problemer](#2025-new-leadership-same-problems)
  * [Den nye CEO bliver involveret](#the-new-ceo-gets-involved)
  * [Michelle Gills svar](#michelle-gills-response)
  * [Vores svar: Ikke flere møder](#our-response-no-more-meetings)
  * [Marty Brodbecks overengineering-svar](#marty-brodbecks-overengineering-response)
  * [“Simple CRUD”-modsigelsen](#the-simple-crud-contradiction)
  * [Frakoblingen bliver tydelig](#the-disconnect-becomes-clear)
* [År med fejlrapporter de ignorerede](#years-of-bug-reports-they-ignored)
  * [2016: Tidlige UI/UX-klager](#2016-early-uiux-complaints)
  * [2021: Fejlrapport om forretnings-e-mail](#2021-business-email-bug-report)
  * [2021: Forslag til UI-forbedringer](#2021-ui-improvement-suggestions)
  * [2021: Sandbox-miljøfejl](#2021-sandbox-environment-failures)
  * [2021: Rapportsystemet er helt ødelagt](#2021-reports-system-completely-broken)
  * [2022: Kerne-API-funktion mangler (igen)](#2022-core-api-feature-missing-again)
* [Udvikleroplevelsens mareridt](#the-developer-experience-nightmare)
  * [Ødelagt brugergrænseflade](#broken-user-interface)
  * [SDK-problemer](#sdk-problems)
  * [Overtrædelser af Content Security Policy](#content-security-policy-violations)
  * [Dokumentationskaos](#documentation-chaos)
  * [Sikkerhedssårbarheder](#security-vulnerabilities)
  * [Session management-katastrofe](#session-management-disaster)
* [Juli 2025: Den sidste dråbe](#july-2025-the-final-straw)
* [Hvorfor vi ikke bare kan droppe PayPal](#why-we-cant-just-drop-paypal)
* [Fællesskabets løsning](#the-community-workaround)
* [Blokering af PayPal-skabeloner på grund af phishing](#blocking-paypal-templates-due-to-phishing)
  * [Det reelle problem: PayPals skabeloner ligner svindel](#the-real-problem-paypals-templates-look-like-scams)
  * [Vores implementering](#our-implementation)
  * [Hvorfor vi måtte blokere PayPal](#why-we-had-to-block-paypal)
  * [Omfanget af problemet](#the-scale-of-the-problem)
  * [Ironien](#the-irony)
  * [Virkelighedens konsekvenser: Nye PayPal-svindelnumre](#real-world-impact-novel-paypal-scams)
* [PayPals omvendte KYC-proces](#paypals-backwards-kyc-process)
  * [Hvordan det burde fungere](#how-it-should-work)
  * [Hvordan PayPal faktisk fungerer](#how-paypal-actually-works)
  * [De virkelige konsekvenser](#the-real-world-impact)
  * [Juli 2025-kontomigrationskatastrofen](#the-july-2025-account-migration-disaster)
  * [Hvorfor det betyder noget](#why-this-matters)
* [Hvordan alle andre betalingsprocessorer gør det rigtigt](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Branchestandarden](#the-industry-standard)
  * [Hvad andre processorer tilbyder vs PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematiske cover-up: Tavshed over 6 millioner stemmer](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Den store udviskning](#the-great-erasure)
  * [Tredjepartsredningen](#the-third-party-rescue)
* [Den 11-årige capture-bug-katastrofe: $1.899 og stigende](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Emails tab på $1.899](#forward-emails-1899-loss)
  * [Den oprindelige rapport fra 2013: 11+ års forsømmelse](#the-2013-original-report-11-years-of-negligence)
  * [Erkendelsen i 2016: PayPal ødelægger deres eget SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskaleringsrapporten fra 2024: Stadig ødelagt](#the-2024-escalation-still-broken)
  * [Webhook-pålidelighedskatastrofen](#the-webhook-reliability-disaster)
  * [Mønstret af systematisk forsømmelse](#the-pattern-of-systematic-negligence)
  * [Det udokumenterede krav](#the-undocumented-requirement)
* [PayPals bredere mønster af bedrag](#paypals-broader-pattern-of-deception)
  * [New York Department of Financial Services’ aktion](#the-new-york-department-of-financial-services-action)
  * [Honey-retssagen: Omskrivning af affiliate-links](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Omkostningerne ved PayPals forsømmelse](#the-cost-of-paypals-negligence)
  * [Dokumentationsløgn](#the-documentation-lie)
* [Hvad det betyder for udviklere](#what-this-means-for-developers)
## Det Manglende Stykke: Ingen Måder at Liste Abonnementer {#the-missing-piece-no-way-to-list-subscriptions}

Her er det, der forbløffer os: PayPal har haft abonnementbetaling siden 2014, men de har aldrig givet handlende en måde at liste deres egne abonnementer på.

Tænk over det et øjeblik. Du kan oprette abonnementer, du kan annullere dem, hvis du har ID'et, men du kan ikke få en liste over alle aktive abonnementer for din konto. Det er som at have en database uden en SELECT-sætning.

Vi har brug for dette til grundlæggende forretningsdrift:

* Kundesupport (når nogen sender en e-mail og spørger om deres abonnement)
* Finansiel rapportering og afstemning
* Automatiseret fakturahåndtering
* Overholdelse og revision

Men PayPal? De har bare... aldrig bygget det.


## 2014-2017: Problemet Opstår {#2014-2017-the-problem-emerges}

Problemet med abonnementsliste dukkede først op i PayPals community-fora tilbage i 2017. Udviklere stillede det oplagte spørgsmål: "Hvordan får jeg en liste over alle mine abonnementer?"

PayPals svar? Stilhed.

Community-medlemmer begyndte at blive frustrerede:

> "Meget mærkelig udeladelse, hvis en handlende ikke kan liste alle aktive aftaler. Hvis aftale-ID'et mistes, betyder det, at kun brugeren kan annullere eller suspendere en aftale." - leafspider

> "+1. Det har været næsten 3 år." - laudukang (hvilket betyder, at problemet har eksisteret siden ca. 2014)

Det [oprindelige community-indlæg](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) fra 2017 viser udviklere, der beder om denne grundlæggende funktionalitet. PayPals svar var at arkivere det repository, hvor folk rapporterede problemet.


## 2020: Vi Giver Dem Omfattende Feedback {#2020-we-give-them-extensive-feedback}

I oktober 2020 kontaktede PayPal os for en formel feedback-session. Det var ikke en tilfældig samtale – de arrangerede et 45-minutters Microsoft Teams-opkald med 8 PayPal-ledere inklusive Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze og andre.

### Den 27-Punkts Feedbackliste {#the-27-item-feedback-list}

Vi var forberedte. Efter 6 timers forsøg på at integrere med deres API'er havde vi samlet 27 specifikke problemer. Mark Stuart fra PayPal Checkout-teamet sagde:

> Hej Nick, tak fordi du delte med alle i dag! Jeg tror, dette vil være katalysatoren for at få mere støtte og investering til vores team, så vi kan gå i gang med at løse disse ting. Det har været svært at få så detaljeret feedback som den, du har givet os indtil nu.

Feedbacken var ikke teoretisk – den kom fra reelle integrationsforsøg:

1. **Adgangstoken-generering virker ikke**:

> Adgangstoken-generering virker ikke. Der burde også være mere end bare cURL-eksempler.

2. **Ingen web-UI til oprettelse af abonnementer**:

> Hvordan pokker kan man oprette abonnementer uden at skulle gøre det via cURL? Der ser ikke ud til at være en web-UI til dette (som Stripe har)

Mark Stuart fandt adgangstoken-problemet særligt bekymrende:

> Vi hører normalt ikke om problemer med adgangstoken-generering.

### Teams Blev Involveret, Løfter Blev Givet {#teams-got-involved-promises-were-made}

Efterhånden som vi opdagede flere problemer, tilføjede PayPal flere teams til samtalen. Darshan Raju fra abonnementshåndterings-UI-teamet deltog og sagde:

> Anerkender hullet. Vi vil følge op og løse det. Tak igen for din feedback!

Sessionen blev beskrevet som en:

> ærlig gennemgang af din oplevelse

for at:

> gøre PayPal til det, det burde være for udviklere.

### Resultatet? Intet. {#the-result-nothing}

På trods af den formelle feedback-session, den omfattende 27-punkts liste, involvering af flere teams og løfter om at:

> følge op og løse

problemer, blev absolut intet fikset.


## Den Ledelsesmæssige Exodus: Hvordan PayPal Mistede Al Institutionel Hukommelse {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Her bliver det virkelig interessant. Hver eneste person, der modtog vores feedback i 2020, har forladt PayPal:

**Lederskifte:**

* [Dan Schulman (CEO i 9 år) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO, der organiserede feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januar 2024)
**Tekniske ledere, der gav løfter og så forlod:**

* **Mark Stuart** (lovede, at feedback ville være en "katalysator") → [Nu hos Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-årig PayPal-veteran) → [CEO for MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Pensioneret](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (en af de sidste tilbageværende) → [Netop forladt til Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januar 2025)

PayPal er blevet en roterende dør, hvor ledere indsamler udviklerfeedback, giver løfter og så forlader for bedre virksomheder som JPMorgan, Ripple og andre fintech-firmaer.

Dette forklarer, hvorfor GitHub-issue-responsen i 2025 virkede fuldstændig afkoblet fra vores feedback i 2020 – bogstaveligt talt er alle, der modtog den feedback, forladt PayPal.


## 2025: Ny ledelse, samme problemer {#2025-new-leadership-same-problems}

Spol frem til 2025, og det samme mønster opstår igen. Efter år uden fremskridt tager PayPals nye ledelse igen kontakt.

### Den nye CEO involverer sig {#the-new-ceo-gets-involved}

Den 30. juni 2025 eskalerede vi direkte til PayPals nye CEO Alex Chriss. Hans svar var kort:

> Hej Nick – Tak for at du tog kontakt og for feedbacken. Michelle (cc'd) er ansvarlig med sit team for at engagere sig og arbejde igennem dette med dig. Tak -A

### Michelle Gills svar {#michelle-gills-response}

Michelle Gill, EVP og General Manager for Small Business and Financial Services, svarede:

> Mange tak Nick, flytter Alex til bcc. Vi har kigget på dette siden dit tidligere opslag. Vi ringer til dig inden ugen er omme. Kan du sende mig dine kontaktoplysninger, så en af mine kolleger kan tage kontakt. Michelle

### Vores svar: Ingen flere møder {#our-response-no-more-meetings}

Vi afslog endnu et møde og forklarede vores frustration:

> Tak. Men jeg føler ikke, at det at tage en opringning vil gøre nogen forskel. Her er hvorfor... Jeg har tidligere været på et opkald, og det førte absolut ingen vegne. Jeg spildte over 2 timer af min tid på at tale med hele teamet og ledelsen, og der blev ikke gjort noget... Masser af e-mails frem og tilbage. Absolut intet blev gjort. Feedback gik ingen vegne. Jeg har prøvet i årevis, blevet lyttet til, og så fører det ingen vegne.

### Marty Brodbecks overengineering-svar {#marty-brodbecks-overengineering-response}

Så tog Marty Brodbeck, der leder consumer engineering hos PayPal, kontakt:

> Hej Nick, det er Marty Brodbeck. Jeg leder al consumer engineering her hos PayPal og har drevet API-udviklingen for virksomheden. Kan du og jeg tage en snak om det problem, du står overfor, og hvordan vi kan hjælpe her.

Da vi forklarede det simple behov for et endpoint til abonnementsliste, afslørede hans svar det præcise problem:

> Tak Nick, vi er i gang med at skabe en enkelt subscription API med fuldt SDK (understøtter fuld fejlhåndtering, event-baseret abonnementssporing, robust oppetid), hvor fakturering også er opdelt som en separat API, som handlende kan gå til i stedet for at skulle orkestrere på tværs af flere endpoints for at få et enkelt svar.

Dette er præcis den forkerte tilgang. Vi har ikke brug for måneders kompleks arkitektur. Vi har brug for ét simpelt REST-endpoint, der viser abonnementer – noget, der burde have eksisteret siden 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### "Simple CRUD"-modsigelsen {#the-simple-crud-contradiction}

Da vi påpegede, at dette var grundlæggende CRUD-funktionalitet, som burde have eksisteret siden 2014, var Martys svar sigende:

> Simple Crud-operationer er en del af kerne-API'en, min ven, så det vil ikke tage måneder at udvikle

PayPals TypeScript SDK, som i øjeblikket kun understøtter tre endpoints efter måneders udvikling, sammen med dens historiske tidslinje, demonstrerer tydeligt, at sådanne projekter kræver mere end et par måneder at færdiggøre.
Dette svar viser, at han ikke forstår sin egen API. Hvis "simple CRUD-operationer er en del af kerne-API'en," hvor er så endpointet til abonnementsoversigten? Vi svarede:

> Hvis 'simple CRUD-operationer er en del af kerne-API'en', hvor er så endpointet til abonnementsoversigten? Udviklere har efterspurgt denne 'simple CRUD-operation' siden 2014. Det er 11 år siden. Alle andre betalingsprocessorer har haft denne grundlæggende funktionalitet fra dag ét.

### The Disconnect Becomes Clear {#the-disconnect-becomes-clear}

Udvekslingerne i 2025 med Alex Chriss, Michelle Gill og Marty Brodbeck viser den samme organisatoriske dysfunktion:

1. **Ny ledelse har ingen viden om tidligere feedback-sessioner**
2. **De foreslår de samme overkomplicerede løsninger**
3. **De forstår ikke deres egne API-begrænsninger**
4. **De ønsker flere møder i stedet for bare at løse problemet**

Dette mønster forklarer, hvorfor PayPal-teams i 2025 virker fuldstændig afkoblet fra den omfattende feedback, der blev givet i 2020 – de personer, der modtog den feedback, er væk, og den nye ledelse gentager de samme fejl.


## År med fejlrapporter de ignorerede {#years-of-bug-reports-they-ignored}

Vi klagede ikke bare over manglende funktioner. Vi rapporterede aktivt fejl og forsøgte at hjælpe dem med at forbedre sig. Her er en omfattende tidslinje over de problemer, vi dokumenterede:

### 2016: Tidlige UI/UX-klager {#2016-early-uiux-complaints}

Allerede i 2016 henvendte vi os offentligt til PayPals ledelse, inklusive Dan Schulman, om interfaceproblemer og brugervenlighedsproblemer. Det var for 9 år siden, og de samme UI/UX-problemer består stadig i dag.

### 2021: Fejlrapport om forretnings-e-mail {#2021-business-email-bug-report}

I marts 2021 rapporterede vi, at PayPals forretnings-e-mailsystem sendte forkerte afbestillingsmeddelelser. E-mail-skabelonen havde variabler, der blev gengivet forkert, hvilket viste forvirrende beskeder til kunderne.

Mark Stuart anerkendte problemet:

> Tak Nick! Skifter til BCC. @Prasy, er dit team ansvarligt for denne e-mail eller ved I, hvem der er? "Niftylettuce, LLC, we'll no longer bill you" får mig til at tro, at der er en forveksling i, hvem den er adresseret til, og indholdet af e-mailen.

**Resultat**: De fik faktisk løst denne! Mark Stuart bekræftede:

> Har lige hørt fra notifikationsteamet, at e-mail-skabelonen er blevet rettet og udrullet. Vi værdsætter, at du tog dig tid til at rapportere det. Tak!

Dette viser, at de KAN løse ting, når de vil – de vælger bare ikke at gøre det for de fleste problemer.

### 2021: Forslag til UI-forbedringer {#2021-ui-improvement-suggestions}

I februar 2021 gav vi detaljeret feedback på deres dashboard-UI, specifikt sektionen "PayPal Recent Activity":

> Jeg synes, dashboardet på paypal.com, specifikt "PayPal Recent Activity", trænger til forbedring. Jeg synes ikke, I skal vise $0 tilbagevendende betalinger med status "Created" – det tilføjer bare en masse ekstra linjer, og man kan ikke nemt se med et blik, hvor meget indkomst der genereres for dagen/de sidste par dage.

Mark Stuart videresendte det til teamet for forbrugerprodukter:

> Tak! Jeg er ikke sikker på, hvilket team der er ansvarligt for Activity, men jeg har videresendt det til lederen af forbrugerprodukter for at finde det rette team. En tilbagevendende betaling på $0,00 virker som en fejl. Den burde nok filtreres fra.

**Resultat**: Aldrig løst. UI viser stadig disse ubrugelige $0-poster.

### 2021: Fejl i sandbox-miljøet {#2021-sandbox-environment-failures}

I november 2021 rapporterede vi kritiske problemer med PayPals sandbox-miljø:

* Sandbox hemmelige API-nøgler blev tilfældigt ændret og deaktiveret
* Alle sandbox-testkonti blev slettet uden varsel
* Fejlmeddelelser ved forsøg på at se sandbox-kontodetaljer
* Intermitterende indlæsningsfejl

> Af en eller anden grund blev min sandbox hemmelige API-nøgle ændret og deaktiveret. Også alle mine gamle sandbox-testkonti blev slettet.

> Nogle gange loader de, og nogle gange gør de ikke. Det er vanvittigt frustrerende.

**Resultat**: Intet svar, ingen løsning. Udviklere oplever stadig pålidelighedsproblemer med sandbox.

### 2021: Rapportsystemet er fuldstændig ødelagt {#2021-reports-system-completely-broken}
I maj 2021 rapporterede vi, at PayPals downloadsystem til transaktionsrapporter var fuldstændig ødelagt:

> Det ser ud til, at rapportdownloads ikke virker lige nu og ikke har gjort det hele dagen. Man burde også nok få en email-notifikation, hvis det fejler.

Vi påpegede også katastrofen med sessionstyringen:

> Hvis du også er inaktiv, mens du er logget ind på PayPal i cirka 5 minutter, bliver du logget ud. Så når du opdaterer knappen igen ved siden af den rapport, du vil tjekke status på (efter du har ventet evigheder), er det en pest at skulle logge ind igen.

Mark Stuart anerkendte problemet med session timeout:

> Jeg kan huske, at du tidligere havde rapporteret, at din session ofte udløb og forstyrrede din udviklingsflow, mens du skiftede mellem din IDE og developer.paypal.com eller dit merchant dashboard, og så kom du tilbage og var logget ud igen.

**Resultat**: Session timeouts er stadig 60 sekunder. Rapportsystemet fejler stadig regelmæssigt.

### 2022: Kerne-API-funktion mangler (igen) {#2022-core-api-feature-missing-again}

I januar 2022 eskalerede vi igen problemet med abonnementsliste, denne gang med endnu flere detaljer om, hvordan deres dokumentation var forkert:

> Der findes ikke en GET, som lister alle abonnementer (tidligere kaldet billing agreements)

Vi opdagede, at deres officielle dokumentation var helt unøjagtig:

> API-dokumenterne er også helt unøjagtige. Vi troede, vi kunne lave en workaround ved at downloade en hardkodet liste over abonnement-ID'er. Men det virker ikke engang!

> Fra de officielle docs her... Der står, at man kan gøre dette... Her er det sjove – der findes slet ikke noget "Subscription ID"-felt nogen steder, som kan krydses af.

Christina Monti fra PayPal svarede:

> Vi beklager de frustrationer, som disse forkerte trin har forårsaget, vi vil rette det i denne uge.

Sri Shivananda (CTO) takkede os:

> Tak for din fortsatte hjælp til at gøre os bedre. Meget værdsat.

**Resultat**: Dokumentationen blev aldrig rettet. Endpointet til abonnementsliste blev aldrig oprettet.


## Udvikleroplevelsens mareridt {#the-developer-experience-nightmare}

At arbejde med PayPals API'er er som at træde 10 år tilbage i tiden. Her er de tekniske problemer, vi har dokumenteret:

### Ødelagt brugerflade {#broken-user-interface}

PayPals udviklerdashboard er et mareridt. Her er, hvad vi dagligt må håndtere:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPals UI er så ødelagt, at du ikke engang kan afvise notifikationer
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Udviklerdashboardet tvinger dig bogstaveligt talt til at trække en slider og logger dig ud efter 60 sekunder
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Flere UI-katastrofer i PayPals udviklerinterface, der viser ødelagte workflows
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Abonnementsstyringsinterfacet – interfacet er så dårligt, at vi måtte stole på kode til at generere produkter og abonnementsplaner
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Et kig på det ødelagte abonnementsinterface med manglende funktionalitet (du kan ikke nemt oprette produkter/planer/abonnementer – og der ser slet ikke ud til at være nogen måde at slette produkter eller planer, når de først er oprettet i UI)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typiske PayPal-fejlmeddelelser - kryptiske og ubrugelige
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problemer {#sdk-problems}

* Kan ikke håndtere både engangsbetalinger og abonnementer uden komplekse løsninger, der involverer udskiftning og genindlæsning af knapper samtidig med genindlæsning af SDK'en med script-tags
* JavaScript SDK bryder grundlæggende konventioner (små bogstaver i klassenavne, ingen instanskontrol)
* Fejlmeddelelser angiver ikke, hvilke felter der mangler
* Inkonsistente datatyper (kræver beløb som strenge i stedet for tal)

### Overtrædelser af Content Security Policy {#content-security-policy-violations}

Deres SDK kræver unsafe-inline og unsafe-eval i din CSP, **tvinger dig til at gå på kompromis med dit sites sikkerhed**.

### Dokumentationskaos {#documentation-chaos}

Mark Stuart indrømmede selv:

> Enig i, at der er en absurd mængde af både gamle og nye API'er. Virkelig svært at finde det, man leder efter (selv for os, der arbejder her).

### Sikkerhedssårbarheder {#security-vulnerabilities}

**PayPals 2FA-implementering er bagvendt**. Selv med TOTP-apps aktiveret tvinger de SMS-verifikation - hvilket gør konti sårbare over for SIM-swap-angreb. Hvis du har TOTP aktiveret, burde det bruges eksklusivt. Fald tilbage-metoden burde være e-mail, ikke SMS.

### Katastrofe i sessionstyring {#session-management-disaster}

**Deres udviklerdashboard logger dig ud efter 60 sekunders inaktivitet**. Prøv at gøre noget produktivt, og du går konstant igennem: login → captcha → 2FA → logout → gentag. Bruger du VPN? Held og lykke.


## Juli 2025: Den sidste dråbe {#july-2025-the-final-straw}

Efter 11 år med de samme problemer kom bristepunktet under en rutinemæssig kontomigration. Vi skulle overgå til en ny PayPal-konto for at matche vores firmanavn "Forward Email LLC" for renere regnskab.

Hvad der skulle have været enkelt, blev til en komplet katastrofe:

* Indledende test viste, at alt fungerede korrekt
* Timer senere blokerede PayPal pludselig alle abonnementsbetalinger uden varsel
* Kunder kunne ikke betale, hvilket skabte forvirring og supportbyrde
* PayPal-support gav modstridende svar og hævdede, at konti var verificerede
* Vi blev tvunget til helt at stoppe PayPal-betalinger

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Fejlen kunderne så, når de prøvede at betale - ingen forklaring, ingen logs, intet
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal-support hævdede, at alt var fint, mens betalingerne var helt ødelagte. Den sidste besked viser, at de siger, de "gendannede nogle funktioner", men stadig beder om mere uspecificeret information - klassisk PayPal-support teater
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
  Identitetsbekræftelsesprocessen, som angiveligt "fik løst" intet
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
  Uklar besked og stadig ingen løsning. Ingen information, meddelelser eller noget som helst om, hvilken yderligere information der kræves. Kundesupport går i stå.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Hvorfor vi ikke bare kan droppe PayPal {#why-we-cant-just-drop-paypal}

På trods af alle disse problemer kan vi ikke helt opgive PayPal, fordi nogle kunder kun har PayPal som betalingsmulighed. Som en kunde sagde på vores [statusside](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal er min eneste betalingsmulighed

**Vi er tvunget til at støtte en defekt platform, fordi PayPal har skabt et betalingsmonopol for visse brugere.**


## Community-løsningen {#the-community-workaround}

Da PayPal ikke vil levere grundlæggende funktionalitet til visning af abonnementer, har udviklerfællesskabet lavet løsninger. Vi har lavet et script, der hjælper med at administrere PayPal-abonnementer: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dette script refererer til en [community gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), hvor udviklere deler løsninger. Brugere takker os faktisk [for at levere det, som PayPal burde have bygget for år siden](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775).


## Blokering af PayPal-skabeloner på grund af phishing {#blocking-paypal-templates-due-to-phishing}

Problemerne går ud over API’er. PayPals e-mail-skabeloner er så dårligt designet, at vi måtte implementere specifik filtrering i vores e-mail-tjeneste, fordi de er umulige at skelne fra phishingforsøg.

### Det reelle problem: PayPals skabeloner ligner svindel {#the-real-problem-paypals-templates-look-like-scams}

Vi modtager regelmæssigt rapporter om PayPal-e-mails, der ser præcis ud som phishingforsøg. Her er et faktisk eksempel fra vores misbrugsrapporter:

**Emne:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Denne e-mail blev videresendt til `abuse@microsoft.com`, fordi den lignede et phishingforsøg. Problemet? Den var faktisk fra PayPals sandbox-miljø, men deres skabelondesign er så dårligt, at det udløser phishingdetektionssystemer.

### Vores implementering {#our-implementation}

Du kan se vores PayPal-specifikke filtrering implementeret i vores [e-mail-filtreringskode](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

### Hvorfor vi var nødt til at blokere PayPal {#why-we-had-to-block-paypal}

Vi implementerede dette, fordi PayPal nægtede at løse massive spam-/phishing-/bedrageriproblemer på trods af vores gentagne rapporter til deres misbrugsteams. De specifikke e-mail-typer, vi blokerer, inkluderer:

* **RT000238** - Mistænkelige fakturameddelelser
* **PPC001017** - Problematisk betalingsbekræftelse
* **RT000542** - Forsøg på hack af gavebeskeder

### Omfanget af problemet {#the-scale-of-the-problem}

Vores spamfiltreringslogs viser det enorme antal PayPal-fakturaspam, vi behandler dagligt. Eksempler på blokerede emner inkluderer:

* "Invoice from PayPal Billing Team:- This charge will be auto-debited from your account. Please contact us immediately at \[PHONE]"
* "Invoice from \[COMPANY NAME] (\[ORDER-ID])"
* Flere variationer med forskellige telefonnumre og falske ordre-ID’er
Disse e-mails kommer ofte fra `outlook.com` værter, men ser ud til at stamme fra PayPals legitime systemer, hvilket gør dem særligt farlige. E-mailsene passerer SPF, DKIM og DMARC autentificering, fordi de sendes gennem PayPals faktiske infrastruktur.

Vores tekniske logs viser, at disse spam-e-mails indeholder legitime PayPal-headere:

* `X-Email-Type-Id: RT000238` (samme ID som vi blokerer)
* `From: "service@paypal.com" <service@paypal.com>`
* Gyldige DKIM-signaturer fra `paypal.com`
* Korrekte SPF-poster, der viser PayPals mailservere

Dette skaber en umulig situation: legitime PayPal-e-mails og spam har begge identiske tekniske karakteristika.

### Ironien {#the-irony}

PayPal, en virksomhed der burde føre kampen mod finansiel svindel, har e-mail-skabeloner, der er så dårligt designet, at de udløser anti-phishing-systemer. Vi er tvunget til at blokere legitime PayPal-e-mails, fordi de er umulige at skelne fra svindel.

Dette er dokumenteret i sikkerhedsforskning: [Pas på PayPals nye adresse-svindel](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – der viser, hvordan PayPals egne systemer udnyttes til svindel.

### Virkelige konsekvenser: Nye PayPal-svindelmetoder {#real-world-impact-novel-paypal-scams}

Problemet går ud over blot dårligt skabelondesign. PayPals fakturasystem er så let at udnytte, at svindlere regelmæssigt misbruger det til at sende legitime udseende falske fakturaer. Sikkerhedsforsker Gavin Anderegg dokumenterede [En ny PayPal-svindel](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), hvor svindlere sender ægte PayPal-fakturaer, der passerer alle autentificeringstjek:

> "Ved at inspicere kilden lignede e-mailen faktisk, at den kom fra PayPal (SPF, DKIM og DMARC bestod alle). Knappen linkede også til, hvad der lignede en legitim PayPal-URL... Det tog et øjeblik at gå op for mig, at det var en legitim e-mail. Jeg havde netop modtaget en tilfældig 'faktura' fra en svindler."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Skærmbillede, der viser flere falske PayPal-fakturaer, der oversvømmer en indbakke, alle ser legitime ud, fordi de faktisk kommer fra PayPals systemer
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Forskeren bemærkede:

> "Det virker også som en bekvemmelighedsfunktion, som PayPal burde overveje at låse ned. Jeg antog straks, at det var en form for svindel og var kun interesseret i de tekniske detaljer. Det virker alt for let at gennemføre, og jeg frygter, at andre kan falde for det."

Dette illustrerer perfekt problemet: PayPals egne legitime systemer er så dårligt designet, at de muliggør svindel, samtidig med at de får legitime kommunikationer til at se mistænkelige ud.

For at gøre det værre påvirkede dette vores leveringsrate med Yahoo, hvilket resulterede i kundeklager og mange timers omhyggelig test og mønstergenkendelse.


## PayPals omvendte KYC-proces {#paypals-backwards-kyc-process}

En af de mest frustrerende aspekter ved PayPals platform er deres omvendte tilgang til compliance og Know Your Customer (KYC)-procedurer. I modsætning til alle andre betalingsudbydere tillader PayPal udviklere at integrere deres API’er og begynde at modtage betalinger i produktion, før korrekt verifikation er gennemført.

### Sådan burde det fungere {#how-it-should-work}

Hver legitim betalingsudbyder følger denne logiske rækkefølge:

1. **Fuldfør KYC-verifikation først**
2. **Godkend forhandlerkontoen**
3. **Giv adgang til produktions-API**
4. **Tillad betalinger**

Dette beskytter både betalingsudbyderen og forhandleren ved at sikre compliance, før penge skifter hænder.

### Sådan fungerer PayPal faktisk {#how-paypal-actually-works}

PayPals proces er fuldstændig omvendt:

1. **Giv straks adgang til produktions-API**
2. **Tillad betalinger i timer eller dage**
3. **Bloker pludseligt betalinger uden varsel**
4. **Krav om KYC-dokumentation efter kunder allerede er berørt**
5. **Giv ingen meddelelse til forhandleren**
6. **Lad kunder opdage problemet og rapportere det**
### Den Virkelige Indvirkning {#the-real-world-impact}

Denne bagvendte proces skaber katastrofer for virksomheder:

* **Kunder kan ikke gennemføre køb** i perioder med højt salg
* **Ingen forudgående advarsel** om at verifikation er nødvendig
* **Ingen e-mail notifikationer** når betalinger blokeres
* **Handlende får besked om problemer fra forvirrede kunder**
* **Indtægtstab** i kritiske forretningsperioder
* **Skadet kundetillid** når betalinger mystisk fejler

### Katastrofen ved Konto-migreringen i juli 2025 {#the-july-2025-account-migration-disaster}

Dette præcise scenarie udspillede sig under vores rutinemæssige konto-migrering i juli 2025. PayPal tillod betalinger at fungere i starten, men blokerede dem pludseligt uden nogen form for notifikation. Vi opdagede først problemet, da kunder begyndte at rapportere, at de ikke kunne betale.

Da vi kontaktede support, modtog vi modstridende svar om, hvilken dokumentation der var nødvendig, uden nogen klar tidsplan for løsning. Dette tvang os til helt at stoppe PayPal-betalinger, hvilket forvirrede kunder, der ikke havde andre betalingsmuligheder.

### Hvorfor Det Betyder Noget {#why-this-matters}

PayPals tilgang til compliance viser en grundlæggende misforståelse af, hvordan virksomheder opererer. Korrekt KYC bør ske **før** produktionsintegration, ikke efter at kunder allerede forsøger at betale. Manglen på proaktiv kommunikation, når problemer opstår, demonstrerer PayPals frakobling fra handlendes behov.

Denne bagvendte proces er symptomatisk for PayPals bredere organisatoriske problemer: de prioriterer deres interne processer over handlendes og kunders oplevelse, hvilket fører til den slags operationelle katastrofer, der driver virksomheder væk fra deres platform.


## Hvordan Alle Andre Betalingsprocessorer Gør Det Rigtigt {#how-every-other-payment-processor-does-it-right}

Den funktionalitet til abonnementsliste, som PayPal nægter at implementere, har været standard i branchen i over et årti. Sådan håndterer andre betalingsprocessorer dette grundlæggende krav:

### Stripe {#stripe}

Stripe har haft abonnementsliste siden deres API blev lanceret. Deres dokumentation viser tydeligt, hvordan man henter alle abonnementer for en kunde eller handelskonto. Dette betragtes som grundlæggende CRUD-funktionalitet.

### Paddle {#paddle}

Paddle tilbyder omfattende API’er til abonnementshåndtering inklusive listevisning, filtrering og paginering. De forstår, at handlende har brug for at se deres tilbagevendende indtægtsstrømme.

### Coinbase Commerce {#coinbase-commerce}

Selv kryptovalutabaserede betalingsprocessorer som Coinbase Commerce tilbyder bedre abonnementshåndtering end PayPal.

### Square {#square}

Squares API inkluderer abonnementsliste som en grundlæggende funktion, ikke en eftertanke.

### Branchestandarden {#the-industry-standard}

Hver moderne betalingsprocessor tilbyder:

* Liste over alle abonnementer
* Filtrering efter status, dato, kunde
* Paginering for store datasæt
* Webhook-notifikationer ved ændringer i abonnementer
* Omfattende dokumentation med fungerende eksempler

### Hvad Andre Processorer Tilbyder vs PayPal {#what-other-processors-provide-vs-paypal}

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

**Stripe - Filtrer efter kunde:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrer efter status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Hvad du faktisk får:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Du kan KUN hente ÉT abonnement, hvis du allerede kender ID'et
# Der findes INGEN endpoint til at liste alle abonnementer
# Der findes INGEN måde at søge eller filtrere på
# Du skal selv holde styr på alle abonnement-ID'er
```

**PayPals tilgængelige endpoints:**

* `POST /v1/billing/subscriptions` - Opret et abonnement
* `GET /v1/billing/subscriptions/{id}` - Hent ÉT abonnement (hvis du kender ID)
* `PATCH /v1/billing/subscriptions/{id}` - Opdater et abonnement
* `POST /v1/billing/subscriptions/{id}/cancel` - Annuller abonnement
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspendér abonnement
**Hvad der mangler fra PayPal:**

* ❌ Ingen `GET /v1/billing/subscriptions` (liste over alle)
* ❌ Ingen søgefunktionalitet
* ❌ Ingen filtrering efter status, kunde, dato
* ❌ Ingen understøttelse af paginering

PayPal er den eneste store betalingsprocessor, der tvinger udviklere til manuelt at spore abonnements-ID'er i deres egne databaser.


## PayPals systematiske tilsløring: Tavshed over 6 millioner stemmer {#paypals-systematic-cover-up-silencing-6-million-voices}

I et træk, der perfekt indkapsler PayPals tilgang til håndtering af kritik, tog de for nylig hele deres community-forum offline, hvilket effektivt tavsede over 6 millioner medlemmer og slettede hundredtusindvis af indlæg, der dokumenterede deres fejl.

### Den store udslettelse {#the-great-erasure}

Det oprindelige PayPal Community på `paypal-community.com` havde **6.003.558 medlemmer** og indeholdt hundredtusindvis af indlæg, fejlrapporter, klager og diskussioner om PayPals API-fejl. Dette repræsenterede over et årtis dokumenterede beviser på PayPals systematiske problemer.

Den 30. juni 2025 tog PayPal stille og roligt hele forumet offline. Alle `paypal-community.com` links returnerer nu 404-fejl. Dette var hverken en migration eller en opgradering.

### Tredjepartsredningen {#the-third-party-rescue}

Heldigvis har en tredjepartstjeneste på [ppl.lithium.com](https://ppl.lithium.com/) bevaret noget af indholdet, hvilket giver os adgang til de diskussioner, som PayPal forsøgte at skjule. Denne tredjepartsbevarelse er dog ufuldstændig og kan forsvinde når som helst.

Dette mønster med at skjule beviser er ikke nyt for PayPal. De har en dokumenteret historie med:

* At fjerne kritiske fejlrapporter fra offentligheden
* At afvikle udviklerværktøjer uden varsel
* At ændre API'er uden ordentlig dokumentation
* At tavse fællesskabsdiskussioner om deres fejl

Nedlukningen af forumet repræsenterer det mest dristige forsøg hidtil på at skjule deres systematiske fejl for offentligheden.


## Den 11-årige Capture-fejlskatastrofe: $1.899 og stigende {#the-11-year-capture-bug-disaster-1899-and-counting}

Mens PayPal var optaget af at organisere feedback-sessioner og afgive løfter, har deres kernebetalingssystem været fundamentalt defekt i over 11 år. Beviserne er ødelæggende.

### Forward Emails tab på $1.899 {#forward-emails-1899-loss}

I vores produktionssystemer opdagede vi 108 PayPal-betalinger til en samlet værdi af **$1.899**, som gik tabt på grund af PayPals capture-fejl. Disse betalinger viser et konsekvent mønster:

* `CHECKOUT.ORDER.APPROVED` webhooks blev modtaget
* PayPals capture-API returnerede 404-fejl
* Ordrer blev utilgængelige via PayPals API

Det er umuligt at afgøre, om kunderne blev opkrævet, da PayPal fuldstændigt skjuler debug-logs efter 14 dage og sletter alle data fra dashboardet for ordre-ID'er, der ikke blev captured.

Dette repræsenterer kun én virksomhed. **De samlede tab på tværs af tusindvis af handlende over 11+ år løber sandsynligvis op i millioner af dollars.**

**Vi gentager det: de samlede tab på tværs af tusindvis af handlende over 11+ år løber sandsynligvis op i millioner af dollars.**

Den eneste grund til, at vi opdagede dette, er, at vi er utroligt grundige og datadrevne.

### Den oprindelige rapport fra 2013: 11+ års forsømmelse {#the-2013-original-report-11-years-of-negligence}

Den tidligste dokumenterede rapport om dette præcise problem findes på [Stack Overflow i november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkiveret](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Bliver ved med at modtage 404-fejl med Rest API ved capture"

Fejlen rapporteret i 2013 er **identisk** med den, Forward Email oplevede i 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Fællesskabets respons i 2013 var sigende:

> "Der er et rapporteret problem i øjeblikket med REST API. PayPal arbejder på det."
**11+ år senere arbejder de stadig "på det."**

### Tilståelsen fra 2016: PayPal bryder deres egen SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

I 2016 dokumenterede PayPals egen GitHub-repository [massive capture-fejl](https://github.com/paypal/PayPal-PHP-SDK/issues/660), der påvirkede deres officielle PHP SDK. Omfanget var overvældende:

> "Siden 20/9/2016 er alle PayPal capture-forsøg fejlet med 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Intet blev ændret mellem 19/9 og 20/9 i API-integrationen. **100% af capture-forsøgene siden 20/9 har returneret denne fejl.**"

En forhandler rapporterede:

> "Jeg har haft **over 1.400 mislykkede capture-forsøg inden for de sidste 24 timer**, alle med INVALID_RESOURCE_ID fejlrespons."

PayPals første respons var at bebrejde forhandleren og henvise dem til teknisk support. Først efter massiv pres indrømmede de fejl:

> "Jeg har en opdatering fra vores produktudviklere. De bemærker i de headers, der sendes, at PayPal-Request-ID sendes med 42 tegn, men **det ser ud til, at der for nylig er sket en ændring, der begrænser dette ID til kun 38 tegn.**"

Denne tilståelse afslører PayPals systematiske forsømmelse:

1. **De lavede uanmeldte breaking changes**
2. **De brød deres egen officielle SDK**
3. **De bebrejdede først forhandlerne**
4. **De indrømmede kun fejl under pres**

Selv efter at have "fikset" problemet rapporterede forhandlere:

> "Opgraderede SDK til v1.7.4 og **problemet sker stadig.**"

### Eskaleringen i 2024: Stadig ødelagt {#the-2024-escalation-still-broken}

Nylige rapporter fra den bevarede PayPal Community viser, at problemet faktisk er blevet værre. En [diskussion fra september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkiveret](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumenterer de helt samme problemer:

> "Problemet er først begyndt at opstå for omkring 2 uger siden og påvirker ikke alle ordrer. **Den langt mere almindelige er 404-fejl ved capture.**"

Forhandleren beskriver det samme mønster, som Forward Email oplevede:

> "Efter at have forsøgt at capture ordren returnerer PayPal en 404. Når man henter detaljer om ordren: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dette er uden nogen spor af en succesfuld capture på vores side.**"

### Webhook-pålideligheds-katastrofen {#the-webhook-reliability-disaster}

En anden [bevaret community-diskussion](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) afslører, at PayPals webhook-system er fundamentalt upålideligt:

> "Teoretisk set burde der være to events (CHECKOUT.ORDER.APPROVED og PAYMENT.CAPTURE.COMPLETED) fra webhook-eventet. Faktisk **modtages de to events sjældent med det samme, PAYMENT.CAPTURE.COMPLETED modtages som regel ikke eller først efter flere timer.**"

For abonnementsbetalinger:

> "**'PAYMENT.SALE.COMPLETED' blev nogle gange ikke modtaget eller først efter flere timer.**"

Forhandlerens spørgsmål afslører dybden af PayPals pålidelighedsproblemer:

1. **"Hvorfor sker dette?"** - PayPals webhook-system er fundamentalt ødelagt
2. **"Hvis ordrestatus er 'COMPLETED', kan jeg så antage, at jeg har modtaget pengene?"** - Forhandlere kan ikke stole på PayPals API-responser
3. **"Hvorfor kan 'Event Logs->Webhook Events' ikke finde nogen logs?"** - Selv PayPals eget logningssystem virker ikke

### Mønstret af systematisk forsømmelse {#the-pattern-of-systematic-negligence}

Beviserne strækker sig over 11+ år og viser et klart mønster:

* **2013**: "PayPal arbejder på det"
* **2016**: PayPal indrømmer breaking change, leverer en ødelagt løsning
* **2024**: De samme fejl opstår stadig, påvirker Forward Email og utallige andre

Dette er ikke en fejl - **det er systematisk forsømmelse.** PayPal har kendt til disse kritiske betalingsbehandlingsfejl i over et årti og har konsekvent:
1. **Bebrejdede handlende for PayPals fejl**
2. **Foretog uregistrerede brydende ændringer**
3. **Leverede utilstrækkelige rettelser, der ikke virker**
4. **Ignorerede den økonomiske påvirkning på virksomheder**
5. **Skjulte beviser ved at lukke community-fora**

### Det uregistrerede krav {#the-undocumented-requirement}

Ingen steder i PayPals officielle dokumentation nævner de, at handlende skal implementere retry-logik for capture-operationer. Deres dokumentation angiver, at handlende bør "capture straks efter godkendelse," men nævner ikke, at deres API tilfældigt returnerer 404-fejl, som kræver komplekse retry-mekanismer.

Dette tvinger hver handlende til at:

* Implementere eksponentiel backoff retry-logik
* Håndtere inkonsistent webhook-levering
* Bygge komplekse tilstandsstyringssystemer
* Overvåge mislykkede captures manuelt

**Alle andre betalingsprocessorer leverer pålidelige capture-API'er, der virker første gang.**


## PayPals bredere mønster af bedrag {#paypals-broader-pattern-of-deception}

Capture-fejlkatastrofen er blot et eksempel på PayPals systematiske tilgang til at bedrage kunder og skjule deres fejl.

### New York Department of Financial Services' handling {#the-new-york-department-of-financial-services-action}

I januar 2025 udstedte New York Department of Financial Services en [håndhævelsesaktion mod PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) for vildledende praksis, hvilket viser, at PayPals mønster af bedrag rækker langt ud over deres API'er.

Denne regulatoriske handling viser PayPals villighed til at engagere sig i vildledende praksis på tværs af hele deres forretning, ikke kun deres udviklerværktøjer.

### Honey-retssagen: Omskrivning af affiliate-links {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals opkøb af Honey har resulteret i [retssager, der hævder, at Honey omskriver affiliate-links](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), og stjæler kommissioner fra indholdsskabere og influencere. Dette repræsenterer en anden form for systematisk bedrag, hvor PayPal tjener penge ved at omdirigere indtægter, der burde gå til andre.

Mønstret er klart:

1. **API-fejl**: Skjul brudt funktionalitet, bebrejd handlende
2. **Community-silencing**: Fjern beviser på problemer
3. **Regulatoriske overtrædelser**: Engager dig i vildledende praksis
4. **Affiliate-tyveri**: Stjæl kommissioner gennem teknisk manipulation

### Omkostningerne ved PayPals forsømmelighed {#the-cost-of-paypals-negligence}

Forward Emails tab på $1.899 repræsenterer kun toppen af isbjerget. Overvej den bredere påvirkning:

* **Individuelle handlende**: Tusinder mister hundredvis til tusinder af dollars hver
* **Enterprise-kunder**: Potentielt millioner i tabt omsætning
* **Udviklertid**: Utallige timer brugt på at bygge workarounds til PayPals ødelagte API'er
* **Kundernes tillid**: Virksomheder mister kunder på grund af PayPals betalingsfejl

Hvis en lille email-tjeneste mistede næsten $2.000, og dette problem har eksisteret i over 11 år og påvirker tusinder af handlende, er den samlede økonomiske skade sandsynligvis **hundreder af millioner af dollars**.

### Dokumentationsløgnene {#the-documentation-lie}

PayPals officielle dokumentation undlader konsekvent at nævne de kritiske begrænsninger og fejl, som handlende vil støde på. For eksempel:

* **Capture API**: Ingen omtale af, at 404-fejl er almindelige og kræver retry-logik
* **Webhook-pålidelighed**: Ingen omtale af, at webhooks ofte forsinkes med timer
* **Subscription listing**: Dokumentationen antyder, at listing er muligt, når der ikke findes noget endpoint
* **Session timeouts**: Ingen omtale af aggressive 60-sekunders timeouts

Denne systematiske udeladelse af kritisk information tvinger handlende til at opdage PayPals begrænsninger gennem forsøg og fejl i produktionssystemer, hvilket ofte resulterer i økonomiske tab.


## Hvad det betyder for udviklere {#what-this-means-for-developers}

PayPals systematiske undladelse af at adressere grundlæggende udviklerbehov, samtidig med at de indsamler omfattende feedback, viser et fundamentalt organisatorisk problem. De behandler feedbackindsamling som en erstatning for faktisk at løse problemer.
Mønstret er klart:

1. Udviklere rapporterer problemer  
2. PayPal organiserer feedback-sessioner med ledelsen  
3. Omfattende feedback gives  
4. Teams anerkender mangler og lover at "spore og løse"  
5. Intet bliver implementeret  
6. Ledelsen forlader virksomheden til bedre firmaer  
7. Nye teams beder om den samme feedback  
8. Cirklen gentager sig  

I mellemtiden er udviklere tvunget til at bygge løsninger, gå på kompromis med sikkerheden og håndtere ødelagte brugerflader bare for at acceptere betalinger.

Hvis du bygger et betalingssystem, så lær af vores erfaring: byg din [trifecta tilgang](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) med flere processorer, men forvent ikke at PayPal leverer den grundlæggende funktionalitet, du har brug for. Planlæg at bygge løsninger fra dag ét.

> Dette indlæg dokumenterer vores 11-årige erfaring med PayPals API'er hos Forward Email. Alle kodeeksempler og links er fra vores faktiske produktionssystemer. Vi fortsætter med at understøtte PayPal-betalinger trods disse problemer, fordi nogle kunder ikke har andre muligheder

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
