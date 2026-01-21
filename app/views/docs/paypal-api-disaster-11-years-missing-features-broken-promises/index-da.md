# PayPals 11 år lange API-katastrofe: Hvordan vi byggede løsninger, mens de ignorerede udviklere {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Hos Forward Email har vi i over et årti haft at gøre med PayPals defekte API'er. Det, der startede som mindre frustrationer, har udviklet sig til en komplet katastrofe, der tvang os til at bygge vores egne løsninger, blokere deres phishing-skabeloner og i sidste ende stoppe alle PayPal-betalinger under en kritisk kontomigrering.</p>
<p class="lead mt-3">Dette er historien om 11 år, hvor PayPal ignorerer grundlæggende udviklerbehov, mens vi prøvede alt for at få deres platform til at fungere.</p>

## Indholdsfortegnelse {#table-of-contents}

* [Den manglende brik: Ingen måde at liste abonnementer på](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problemet opstår](#2014-2017-the-problem-emerges)
* [2020: Vi giver dem omfattende feedback](#2020-we-give-them-extensive-feedback)
  * [Feedbacklisten med 27 punkter](#the-27-item-feedback-list)
  * [Holdene blev involveret, løfter blev afgivet](#teams-got-involved-promises-were-made)
  * [Resultatet? Intet.](#the-result-nothing)
* [Den ledende udvandring: Hvordan PayPal mistede al institutionel hukommelse](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Ny ledelse, samme problemer](#2025-new-leadership-same-problems)
  * [Den nye administrerende direktør bliver involveret](#the-new-ceo-gets-involved)
  * [Michelle Gills svar](#michelle-gills-response)
  * [Vores svar: Ingen flere møder](#our-response-no-more-meetings)
  * [Marty Brodbecks overdrevne ingeniørmæssige reaktion](#marty-brodbecks-overengineering-response)
  * [Den "enkle CRUD"-modsigelse](#the-simple-crud-contradiction)
  * [Afbrydelsen bliver tydelig](#the-disconnect-becomes-clear)
* [Årevis af fejlrapporter, de ignorerede](#years-of-bug-reports-they-ignored)
  * [2016: Tidlige UI/UX-klager](#2016-early-uiux-complaints)
  * [2021: Fejlrapport om virksomheds-e-mail](#2021-business-email-bug-report)
  * [2021: Forslag til forbedring af brugergrænsefladen](#2021-ui-improvement-suggestions)
  * [2021: Fejl i sandkassemiljøet](#2021-sandbox-environment-failures)
  * [2021: Rapportsystem fuldstændig ødelagt](#2021-reports-system-completely-broken)
  * [2022: Core API-funktion mangler (igen)](#2022-core-api-feature-missing-again)
* [Udvikleroplevelsens mareridt](#the-developer-experience-nightmare)
  * [Defekt brugergrænseflade](#broken-user-interface)
  * [SDK-problemer](#sdk-problems)
  * [Overtrædelser af indholdssikkerhedspolitikker](#content-security-policy-violations)
  * [Dokumentationskaos](#documentation-chaos)
  * [Sikkerhedssårbarheder](#security-vulnerabilities)
  * [Sessionshåndteringskatastrofe](#session-management-disaster)
* [Juli 2025: Den sidste dråbe](#july-2025-the-final-straw)
* [Hvorfor vi ikke bare kan droppe PayPal](#why-we-cant-just-drop-paypal)
* [Løsningen i fællesskabet](#the-community-workaround)
* [Blokering af PayPal-skabeloner på grund af phishing](#blocking-paypal-templates-due-to-phishing)
  * [Det virkelige problem: PayPals skabeloner ligner svindel](#the-real-problem-paypals-templates-look-like-scams)
  * [Vores implementering](#our-implementation)
  * [Hvorfor vi måtte blokere PayPal](#why-we-had-to-block-paypal)
  * [Problemets omfang](#the-scale-of-the-problem)
  * [Ironien](#the-irony)
  * [Virkelig effekt: Nye PayPal-svindelnumre](#real-world-impact-novel-paypal-scams)
* [PayPals baglæns KYC-proces](#paypals-backwards-kyc-process)
  * [Sådan skal det fungere](#how-it-should-work)
  * [Sådan fungerer PayPal rent faktisk](#how-paypal-actually-works)
  * [Virkelighedens indflydelse](#the-real-world-impact)
  * [Kontomigreringskatastrofen i juli 2025](#the-july-2025-account-migration-disaster)
  * [Hvorfor dette er vigtigt](#why-this-matters)
* [Hvordan alle andre betalingsudbydere gør det rigtigt](#how-every-other-payment-processor-does-it-right)
  * [Stribe](#stripe)
  * [Padle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Firkant](#square)
  * [Branchestandarden](#the-industry-standard)
  * [Hvad andre processorer tilbyder vs. PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematiske cover-up: Tavshed for 6 millioner stemmer](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Den store udslettelse](#the-great-erasure)
  * [Tredjepartsredningen](#the-third-party-rescue)
* [Den 11 år lange Capture Bug-katastrofe: $1.899 og det bliver flere](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Tab på $1.899 på videresendte e-mails](#forward-emails-1899-loss)
  * [Den oprindelige rapport fra 2013: 11+ års uagtsomhed](#the-2013-original-report-11-years-of-negligence)
  * [2016-indrømmelsen: PayPal bryder deres eget SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskaleringen i 2024: Stadig ødelagt](#the-2024-escalation-still-broken)
  * [Webhook-pålidelighedskatastrofen](#the-webhook-reliability-disaster)
  * [Mønsteret af systematisk uagtsomhed](#the-pattern-of-systematic-negligence)
  * [Det udokumenterede krav](#the-undocumented-requirement)
* [PayPals bredere mønster af bedrag](#paypals-broader-pattern-of-deception)
  * [New York Department of Financial Services' handling](#the-new-york-department-of-financial-services-action)
  * [Honning-retssagen: Omskrivning af affilierede links](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Omkostningerne ved PayPals uagtsomhed](#the-cost-of-paypals-negligence)
  * [Dokumentationsløgnen](#the-documentation-lie)
* [Hvad dette betyder for udviklere](#what-this-means-for-developers)

## Den manglende brik: Ingen måde at liste abonnementer på {#the-missing-piece-no-way-to-list-subscriptions}

Her er det, der blæser os bagover: PayPal har haft abonnementsfakturering siden 2014, men de har aldrig givet forhandlere en måde at liste deres egne abonnementer på.

Tænk over det et øjeblik. Du kan oprette abonnementer, du kan annullere dem, hvis du har ID'et, men du kan ikke få en liste over alle aktive abonnementer for din konto. Det er ligesom at have en database uden en SELECT-sætning.

Vi har brug for dette til grundlæggende forretningsdrift:

* Kundesupport (når nogen mailer med spørgsmål om deres abonnement)
* Finansiel rapportering og afstemning
* Automatiseret faktureringsstyring
* Overholdelse af regler og revision

Men PayPal? De har bare... aldrig bygget det.

## 2014-2017: Problemet opstår {#2014-2017-the-problem-emerges}

Problemet med abonnementslister opstod første gang i PayPals communityfora tilbage i 2017. Udviklerne stillede det åbenlyse spørgsmål: "Hvordan får jeg en liste over alle mine abonnementer?"

PayPals svar? Fårekyllinger.

Medlemmer af lokalsamfundet begyndte at blive frustrerede:

> "Meget mærkelig udeladelse, hvis en forhandler ikke kan liste alle aktive aftaler. Hvis aftale-ID'et går tabt, betyder det, at kun brugeren kan annullere eller suspendere en aftale." - leafspider

> "+1. Det er næsten 3 år siden." - laudukang (hvilket betyder at problemet har eksisteret siden \~2014)

[originalt fællesskabsindlæg](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) fra 2017 viser udviklere, der tigger om denne grundlæggende funktionalitet. PayPals svar var at arkivere det lager, hvor folk rapporterede problemet.

## 2020: Vi giver dem omfattende feedback {#2020-we-give-them-extensive-feedback}

I oktober 2020 kontaktede PayPal os for en formel feedbacksession. Dette var ikke en afslappet snak - de arrangerede et 45-minutters Microsoft Teams-opkald med 8 PayPal-chefer, herunder Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze og andre.

### Feedbacklisten med 27 elementer {#the-27-item-feedback-list}

Vi var forberedte. Efter 6 timers forsøg på at integrere med deres API'er havde vi samlet 27 specifikke problemer. Mark Stuart fra PayPal Checkout-teamet sagde:

> Hej Nick, tak fordi du delte med alle i dag! Jeg tror, at dette vil være katalysatoren for at få mere støtte og investering til vores team, så de kan gå i gang med at løse disse ting. Det har været svært at få så fyldestgørende feedback som den, du har givet os indtil videre.

Feedbacken var ikke teoretisk - den kom fra virkelige integrationsforsøg:

1. **Generering af adgangstoken virker ikke**:

> Generering af adgangstoken virker ikke. Der bør også være mere end blot cURL-eksempler.

2. **Ingen webgrænseflade til oprettelse af abonnement**:

> Hvordan i alverden kan man oprette abonnementer uden at skulle gøre det ved hjælp af cURL? Der ser ikke ud til at være en webgrænseflade til at gøre dette (som Stripe har)

Mark Stuart fandt problemet med adgangstoken særligt bekymrende:

> Vi hører typisk ikke om problemer omkring generering af adgangstokener.

### Holdene blev involveret, der blev givet løfter {#teams-got-involved-promises-were-made}

Efterhånden som vi opdagede flere problemer, blev PayPal ved med at tilføje flere teams til samtalen. Darshan Raju fra abonnementsstyringsteamet sluttede sig til og sagde:

> Anerkend hullet. Vi vil spore og adressere dette. Tak igen for din feedback!

Mødet blev beskrevet som et forsøg på at:

> ærlig gennemgang af din oplevelse

til:

> gøre PayPal til det, det burde være for udviklere.

### Resultatet? Intet. {#the-result-nothing}

Trods den formelle feedbacksession, den omfattende liste med 27 punkter, flere teams involvering og løfter om at:

> spor og adresse

problemer, absolut intet blev løst.

## Den ledende udvandring: Hvordan PayPal mistede al institutionel hukommelse {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Det er her, det bliver rigtig interessant. Alle, der modtog vores feedback i 2020, har forladt PayPal:

**Lederskabsændringer:**

* [Dan Schulman (administrerende direktør i 9 år) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO, der organiserede feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januar 2024)

**Tekniske ledere, der gav løfter og derefter forlod virksomheden:**

* **Mark Stuart** (lovede at feedback ville være "katalysator") → [Nu hos Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 års PayPal-veteran) → [Administrerende direktør for MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Pensioneret](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (en af de sidste tilbageværende) → [Lige taget afsted til Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januar 2025)

PayPal er blevet en svingdør, hvor ledere indsamler feedback fra udviklere, giver løfter og derefter forlader virksomheden til fordel for bedre virksomheder som JPMorgan, Ripple og andre fintech-firmaer.

Dette forklarer, hvorfor svaret på GitHub-problemet i 2025 virkede fuldstændig afkoblet fra vores feedback fra 2020 - bogstaveligt talt alle, der modtog den feedback, har forladt PayPal.

## 2025: Ny ledelse, samme problemer {#2025-new-leadership-same-problems}

Spol frem til 2025, og præcis det samme mønster viser sig. Efter år uden fremskridt rækker PayPals nye ledelse ud igen.

### Den nye administrerende direktør bliver involveret {#the-new-ceo-gets-involved}

Den 30. juni 2025 eskalerede vi direkte til PayPals nye administrerende direktør, Alex Chriss. Hans svar var kort:

> Hej Nick – Tak for din henvendelse og din feedback. Michelle (cc'et) er lige ved hånden med sit team til at engagere sig og arbejde med dig på dette. Tak -A

### Michelle Gills svar {#michelle-gills-response}

Michelle Gill, EVP og administrerende direktør for små virksomheder og finansielle tjenester, svarede:

> Mange tak, Nick, jeg flytter Alex til bcc. Vi har undersøgt dette siden dit tidligere indlæg. Vi ringer til dig inden ugen er omme. Kan du sende mig dine kontaktoplysninger, så en af mine kolleger kan kontakte dig? Michelle

### Vores svar: Ingen flere møder {#our-response-no-more-meetings}

Vi afslog et nyt møde og forklarede vores frustration:

> Tak. Men jeg føler ikke, at det at besvare et opkald vil gøre noget. Her er hvorfor... Jeg blev besvaret et opkald før, og det førte absolut ingen vegne. Jeg spildte 2+ timer af min tid på at tale med hele teamet og ledelsen, og intet blev gjort... Tonsvis af e-mails frem og tilbage. Absolut intet blev gjort. Feedback førte ingen vegne. Jeg prøvede i årevis, blev lyttet til, og så førte det ingen vegne.

### Marty Brodbecks svar på overengineering {#marty-brodbecks-overengineering-response}

Så kontaktede Marty Brodbeck, der leder forbrugerteknik hos PayPal, ham:

> Hej Nick, det er Marty Brodbeck. Jeg leder al forbrugerteknik her hos PayPal og har stået i spidsen for virksomhedens API-udvikling. Kan du og jeg tale om det problem, du står over for, og hvordan vi kan hjælpe her?

Da vi forklarede det simple behov for et slutpunkt for abonnementslister, afslørede hans svar det præcise problem:

> Tak, Nick. Vi er i gang med at oprette en enkelt abonnements-API med fuld SDK (understøtter fuld fejlhåndtering, hændelsesbaseret abonnementssporing og robust oppetid), hvor fakturering også er opdelt som en separat API, som forhandlere kan bruge, i stedet for at skulle orkestrere på tværs af flere slutpunkter for at få et enkelt svar.

Det er præcis den forkerte tilgang. Vi har ikke brug for måneder med kompleks arkitektur. Vi har brug for ét simpelt REST-slutpunkt, der viser abonnementer - noget, der burde have eksisteret siden 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Den "enkle CRUD"-modsigelse {#the-simple-crud-contradiction}

Da vi påpegede, at dette var grundlæggende CRUD-funktionalitet, der burde have eksisteret siden 2014, var Martys svar sigende:

> Enkle Crud-operationer er en del af kerne-API'en, min ven, så det tager ikke måneder med udvikling

PayPal TypeScript SDK'et, som i øjeblikket kun understøtter tre endpoints efter måneders udvikling, viser sammen med dets historiske tidslinje tydeligt, at sådanne projekter kræver mere end et par måneder at færdiggøre.

Dette svar viser, at han ikke forstår sin egen API. Hvis "enkle CRUD-operationer er en del af kerne-API'en", hvor er så slutpunktet for abonnementslisten? Vi svarede:

> Hvis 'enkle CRUD-operationer er en del af kerne-API'et', hvor er så slutpunktet for abonnementslisten? Udviklere har efterspurgt denne 'enkle CRUD-operation' siden 2014. Det er 11 år siden. Alle andre betalingsudbydere har haft denne grundlæggende funktionalitet siden dag ét.

### Afbrydelsen bliver tydelig {#the-disconnect-becomes-clear}

Samtalerne med Alex Chriss, Michelle Gill og Marty Brodbeck i 2025 viser den samme organisatoriske dysfunktion:

1. **Den nye ledelse har intet kendskab til tidligere feedbacksessioner**
2. **De foreslår de samme overkonstruerede løsninger**
3. **De forstår ikke deres egne API-begrænsninger**
4. **De ønsker flere møder i stedet for blot at løse problemet**

Dette mønster forklarer, hvorfor PayPal-teams i 2025 synes fuldstændig afkoblet fra den omfattende feedback, der blev givet i 2020 - de personer, der modtog den feedback, er væk, og den nye ledelse gentager de samme fejl.

## År med fejlrapporter, de ignorerede {#years-of-bug-reports-they-ignored}

Vi klagede ikke kun over manglende funktioner. Vi rapporterede aktivt fejl og forsøgte at hjælpe dem med at forbedre dem. Her er en omfattende tidslinje over de problemer, vi dokumenterede:

### 2016: Tidlige UI/UX-klager {#2016-early-uiux-complaints}

Selv tilbage i 2016 kontaktede vi offentligt PayPals ledelse, inklusive Dan Schulman, om problemer med brugergrænsefladen og brugervenligheden. Dette var for 9 år siden, og de samme UI/UX-problemer fortsætter i dag.

### 2021: Fejlrapport om virksomheds-e-mail {#2021-business-email-bug-report}

I marts 2021 rapporterede vi, at PayPals virksomheds-e-mailsystem sendte forkerte annulleringsmeddelelser. E-mailskabelonen havde variabler, der blev gengivet forkert, hvilket viste forvirrende meddelelser til kunderne.

Mark Stuart anerkendte problemet:

> Tak, Nick! Jeg skifter til BCC. @Prasy, er dit team ansvarligt for denne e-mail, eller ved I hvem det er? Meddelelsen "Niftylettuce, LLC, vi fakturerer dig ikke længere" får mig til at tro, at der er en forveksling i, hvem den er adresseret til, og indholdet af e-mailen.

**Resultat**: De fiksede faktisk denne! Mark Stuart bekræftede:

> Jeg har lige hørt fra notifikationsteamet, at e-mailskabelonen er blevet rettet og implementeret. Tak for, at du kontaktede os for at rapportere det. Tak!

Dette viser, at de KAN ordne ting, når de vil - de vælger bare ikke at gøre det i de fleste tilfælde.

### 2021: Forslag til forbedring af brugergrænsefladen {#2021-ui-improvement-suggestions}

I februar 2021 gav vi detaljeret feedback om deres dashboard-brugergrænseflade, specifikt afsnittet "PayPals seneste aktivitet":

> Jeg synes, at dashboardet på paypal.com, især "PayPal Seneste aktivitet", trænger til forbedring. Jeg synes ikke, du skal vise statuslinjerne "Oprettet" for $0 tilbagevendende betaling - det tilføjer bare en masse ekstra linjer, og du kan ikke nemt se med et øjeblik, hvor meget indkomst der genereres for dagen/de seneste par dage.

Mark Stuart videresendte det til forbrugerproduktteamet:

> Tak! Jeg er ikke sikker på, hvilket team der er ansvarlig for Aktivitet, men jeg videresendte det til chefen for forbrugerprodukter for at finde det rigtige team. En tilbagevendende betaling på 0,00 USD virker som en fejl. Burde nok filtreres fra.

**Resultat**: Aldrig rettet. Brugergrænsefladen viser stadig disse ubrugelige $0-poster.

### 2021: Fejl i sandkassemiljøet {#2021-sandbox-environment-failures}

I november 2021 rapporterede vi kritiske problemer med PayPals sandbox-miljø:

* Hemmelige sandbox-API-nøgler blev tilfældigt ændret og deaktiveret
* Alle sandbox-testkonti blev slettet uden varsel
* Fejlmeddelelser ved forsøg på at se sandbox-kontooplysninger
* Periodiske indlæsningsfejl

> Af en eller anden grund blev min hemmelige sandbox-API-nøgle ændret, og den blev deaktiveret. Alle mine gamle Sandbox-testkonti blev også slettet.

> Nogle gange indlæses de, og andre gange gør de det ikke så godt. Det er sindssygt frustrerende.

**Resultat**: Intet svar, ingen løsning. Udviklere oplever stadig problemer med sandkassens pålidelighed.

### 2021: Rapporterer, at systemet er fuldstændig ødelagt {#2021-reports-system-completely-broken}

I maj 2021 rapporterede vi, at PayPals downloadsystem til transaktionsrapporter var fuldstændig i stykker:

> Det ser ud til, at rapportering af downloads ikke virker lige nu, og det har jeg ikke gjort hele dagen. Burde nok også få en e-mail-besked, hvis det fejler.

Vi påpegede også katastrofen med sessionsstyring:

> Hvis du er inaktiv, mens du er logget ind på PayPal i omkring 5 minutter, bliver du logget ud. Så når du opdaterer knappen igen ud for den rapport, du vil tjekke status for (efter du har ventet i en evighed), er det ærgerligt at skulle logge ind igen.

Mark Stuart anerkendte problemet med timeout af sessionen:

> Jeg kan huske, at du tidligere rapporterede, at din session ofte udløb og forstyrrede dit udviklingsflow, mens du skiftede mellem dit IDE og developer.paypal.com eller dit handelsdashboard, og så kom du tilbage og blev logget ud igen.

**Resultat**: Sessionstimeouts er stadig 60 sekunder. Rapportsystemet fejler stadig regelmæssigt.

### 2022: Core API-funktion mangler (igen) {#2022-core-api-feature-missing-again}

I januar 2022 eskalerede vi problemet med abonnementslisten igen, denne gang med endnu flere detaljer om, hvordan deres dokumentation var forkert:

> Der er ingen GET, som viser alle abonnementer (tidligere kaldet faktureringsaftaler)

Vi opdagede, at deres officielle dokumentation var fuldstændig unøjagtig:

> API-dokumentationen er også fuldstændig unøjagtig. Vi troede, vi kunne finde en løsning ved at downloade en hardcodet liste over abonnements-ID'er. Men det virker ikke engang!

> Fra de officielle dokumenter her... Der står, at du kan gøre dette... Her er pointen - der er slet ikke noget felt for "Abonnements-ID" nogen steder, der kan afkrydses.

Christina Monti fra PayPal svarede:

> Undskyld frustrationerne forårsaget af, at disse trin var forkerte. Vi retter det i denne uge.

Sri Shivananda (CTO) takkede os:

> Tak for din fortsatte hjælp til at gøre os bedre. Det sætter vi stor pris på.

**Resultat**: Dokumentationen blev aldrig rettet. Slutpunktet for abonnementslisten blev aldrig oprettet.

## Udvikleroplevelsens mareridt {#the-developer-experience-nightmare}

At arbejde med PayPals API'er er som at rejse 10 år tilbage i tiden. Her er de tekniske problemer, vi har dokumenteret:

### Brugergrænsefladen er defekt {#broken-user-interface}

PayPals udviklerdashboard er en katastrofe. Her er hvad vi håndterer dagligt:

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal's brugergrænseflade er så ødelagt, at du ikke engang kan afvise notifikationer
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Din browser understøtter ikke video-tagget.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Udviklerdashboardet får dig bogstaveligt talt til at trække i en skyder og logger dig derefter ud efter 60 sekunder.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Din browser understøtter ikke video-tagget.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Flere brugergrænsefladeproblemer i PayPals udviklergrænseflade, der viser ødelagte arbejdsgange
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Din browser understøtter ikke video-tagget.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Grænsefladen til abonnementsadministration - grænsefladen er så dårlig, at vi var nødt til at stole på kode for at generere produkter og abonnementsplaner
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
En visning af den defekte abonnementsgrænseflade med manglende funktionalitet (du kan ikke nemt oprette produkter/planer/abonnementer – og der ser slet ikke ud til at være en måde at slette produkter eller planer på, når de først er oprettet i brugergrænsefladen)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typiske PayPal-fejlmeddelelser - kryptiske og uhensigtsmæssige
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problemer {#sdk-problems}

* Kan ikke håndtere både engangsbetalinger og abonnementer uden komplekse løsninger, der involverer udskiftning og gengivelse af knapper, mens SDK'et genindlæses med script-tags
* JavaScript SDK overtræder grundlæggende konventioner (klassenavne med små bogstaver, ingen instanskontrol)
* Fejlmeddelelser angiver ikke, hvilke felter der mangler
* Inkonsistente datatyper (kræver strengbeløb i stedet for tal)

### Overtrædelser af indholdssikkerhedspolitikker {#content-security-policy-violations}

Deres SDK kræver unsafe-inline og unsafe-eval i din CSP, **hvilket tvinger dig til at kompromittere din hjemmesides sikkerhed**.

### Dokumentationskaos {#documentation-chaos}

Mark Stuart indrømmede selv:

> Enig i, at der er en absurd mængde af ældre og nye API'er. Det er virkelig svært at finde ud af, hvad man skal lede efter (selv for os, der arbejder her).

### Sikkerhedssårbarheder {#security-vulnerabilities}

**PayPals 2FA-implementering er bagvendt**. Selv med TOTP-apps aktiveret, gennemtvinger de SMS-verifikation - hvilket gør konti sårbare over for SIM-swap-angreb. Hvis du har TOTP aktiveret, bør den udelukkende bruge det. Alternativet bør være e-mail, ikke SMS.

### Sessionshåndteringskatastrofe {#session-management-disaster}

**Deres udviklerdashboard logger dig ud efter 60 sekunders inaktivitet**. Hvis du prøver at lave noget produktivt, skal du konstant igennem: login → captcha → 2FA → log ud → gentag. Bruger du en VPN? Held og lykke.

## Juli 2025: Den sidste dråbe {#july-2025-the-final-straw}

Efter 11 år med de samme problemer kom bristepunktet under en rutinemæssig kontomigrering. Vi var nødt til at skifte til en ny PayPal-konto, der matchede vores firmanavn "Forward Email LLC", for at opnå en renere regnskabsføring.

Hvad der burde have været simpelt, endte i en komplet katastrofe:

* Indledende test viste, at alt fungerede korrekt
* Timer senere blokerede PayPal pludselig alle abonnementsbetalinger uden varsel
* Kunder kunne ikke betale, hvilket skabte forvirring og supportbyrde
* PayPal-support gav modstridende svar, der hævdede, at kontiene var verificeret
* Vi blev tvunget til at stoppe PayPal-betalinger fuldstændigt

<figure>
<figcaption><div class="alert alert-danger small text-center">
Fejlen kunderne oplevede, da de forsøgte at betale - ingen forklaring, ingen logfiler, ingenting
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal-support hævder, at alt var fint, mens betalingerne var fuldstændig afbrudt. Den sidste besked viser dem, at de siger, at de "gendannede nogle funktioner", men stadig beder om mere uspecificeret information - klassisk PayPal supportteater
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
Identitetsbekræftelsesprocessen, der angiveligt ikke "fiksede" noget
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
Vag besked og stadig ingen løsning. Ingen information, meddelelser eller noget om, hvilke yderligere oplysninger der kræves. Kundesupporten er tavs.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Hvorfor vi ikke bare kan droppe PayPal {#why-we-cant-just-drop-paypal}

Trods alle disse problemer kan vi ikke helt opgive PayPal, fordi nogle kunder kun har PayPal som betalingsmulighed. Som en kunde sagde på vores [statusside](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal er min eneste betalingsmulighed

Vi er gået i stå med at understøtte en defekt platform, fordi PayPal har skabt et betalingsmonopol for visse brugere.

## Løsningen i fællesskabet {#the-community-workaround}

Da PayPal ikke tilbyder grundlæggende funktionalitet til abonnementslister, har udviklerfællesskabet fundet løsninger. Vi har oprettet et script, der hjælper med at administrere PayPal-abonnementer: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dette script refererer til en [fællesskabsresumé](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), hvor udviklere deler løsninger. Brugerne er faktisk [takker os](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) for at levere, hvad PayPal burde have bygget for år tilbage.

## Blokerer PayPal-skabeloner på grund af phishing {#blocking-paypal-templates-due-to-phishing}

Problemerne går ud over API'er. PayPals e-mailskabeloner er så dårligt designet, at vi var nødt til at implementere specifik filtrering i vores e-mailtjeneste, fordi de ikke kan skelnes fra phishing-forsøg.

### Det virkelige problem: PayPals skabeloner ligner svindel {#the-real-problem-paypals-templates-look-like-scams}

Vi modtager regelmæssigt rapporter om PayPal-e-mails, der ligner præcis phishing-forsøg. Her er et konkret eksempel fra vores misbrugsrapporter:

**Emne:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Denne e-mail blev videresendt til `abuse@microsoft.com`, fordi det så ud til at være et phishing-forsøg. Problemet? Den var faktisk fra PayPals sandbox-miljø, men deres skabelondesign er så dårligt, at det udløser phishing-detektionssystemer.

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

### Hvorfor vi måtte blokere PayPal {#why-we-had-to-block-paypal}

Vi implementerede dette, fordi PayPal nægtede at løse massive spam-/phishing-/svindelproblemer på trods af vores gentagne rapporter til deres misbrugsteams. De specifikke e-mailtyper, vi blokerer, omfatter:

* **RT000238** - Mistænkelige fakturameddelelser
* **PPC001017** - Problematiske betalingsbekræftelser
* **RT000542** - Forsøg på hacking af gavebeskeder

### Problemets omfang {#the-scale-of-the-problem}

Vores spamfiltreringslogfiler viser den enorme mængde PayPal-fakturaspam, vi behandler dagligt. Eksempler på blokerede emner inkluderer:

* "Faktura fra PayPals faktureringsteam: - Denne betaling vil blive automatisk debiteret fra din konto. Kontakt os venligst med det samme på \[TELEFON]"
* "Faktura fra \[VIRKSOMHEDSNAVN] (\[ORDRE-ID])"
* Flere variationer med forskellige telefonnumre og falske ordre-ID'er

Disse e-mails kommer ofte fra `outlook.com`-værter, men ser ud til at stamme fra PayPals legitime systemer, hvilket gør dem særligt farlige. E-mailsene passerer SPF-, DKIM- og DMARC-godkendelse, fordi de sendes via PayPals faktiske infrastruktur.

Vores tekniske logfiler viser, at disse spam-e-mails indeholder legitime PayPal-headere:

* `X-Email-Type-Id: RT000238` (det samme ID, som vi blokerer)
* `From: "service@paypal.com" <service@paypal.com>`
* Gyldige DKIM-signaturer fra `paypal.com`
* Korrekte SPF-poster, der viser PayPals mailservere

Dette skaber en umulig situation: legitime PayPal-e-mails og spam har begge identiske tekniske egenskaber.

### Ironien {#the-irony}

PayPal, en virksomhed der burde føre an i kampen mod økonomisk svindel, har e-mailskabeloner, der er så dårligt designet, at de udløser anti-phishing-systemer. Vi er tvunget til at blokere legitime PayPal-e-mails, fordi de ikke kan skelnes fra svindel.

Dette er dokumenteret i sikkerhedsforskning: [Pas på PayPals nye adressesvindel](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - som viser, hvordan PayPals egne systemer udnyttes til svindel.

### Virkelig effekt: Nye PayPal-svindelnumre {#real-world-impact-novel-paypal-scams}

Problemet rækker ud over blot dårligt skabelondesign. PayPals fakturasystem er så let at udnytte, at svindlere regelmæssigt misbruger det til at sende falske fakturaer, der ser legitime ud. Sikkerhedsforsker Gavin Anderegg dokumenterede [En ny PayPal-svindel](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), hvor svindlere sender rigtige PayPal-fakturaer, der består alle godkendelseskontroller:

> "Da jeg undersøgte kilden, så det ud til, at e-mailen faktisk kom fra PayPal (SPF, DKIM og DMARC bestod alle). Knappen linkede også til noget, der lignede en legitim PayPal-URL... Det tog et øjeblik, før jeg gik op for, at det var en legitim e-mail. Jeg havde lige fået tilsendt en tilfældig 'faktura' fra en svindler."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Skærmbillede, der viser flere falske PayPal-fakturaer, der oversvømmer en indbakke. Alle ser ud til at være legitime, fordi de rent faktisk kommer fra PayPals systemer.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Forskeren bemærkede:

> "Det virker også som en bekvemmelighedsfunktion, som PayPal burde overveje at lukke ned for. Jeg antog straks, at det var en form for svindel, og var kun interesseret i de tekniske detaljer. Det virker alt for nemt at udføre, og jeg er bekymret for, at andre måske falder for det."

Dette illustrerer problemet perfekt: PayPals egne legitime systemer er så dårligt designet, at de muliggør svindel, samtidig med at de får legitim kommunikation til at se mistænkelig ud.

For at gøre tingene værre påvirkede dette vores leveringsevne med Yahoo, hvilket resulterede i kundeklager og timevis af omhyggelig testning og mønsterkontrol.

## PayPals baglæns KYC-proces {#paypals-backwards-kyc-process}

Et af de mest frustrerende aspekter ved PayPals platform er deres bagvendte tilgang til compliance og Know Your Customer (KYC)-procedurer. I modsætning til alle andre betalingsudbydere giver PayPal udviklere mulighed for at integrere deres API'er og begynde at indsamle betalinger i produktion, før de har gennemført korrekt verifikation.

### Sådan skal det fungere {#how-it-should-work}

Enhver legitim betalingsudbyder følger denne logiske rækkefølge:

1. **Udfør KYC-verifikation først**
2. **Godkend handelskontoen**
3. **Giv adgang til produktions-API**
4. **Tillad betalingsopkrævning**

Dette beskytter både betalingsbehandleren og forhandleren ved at sikre overholdelse af regler, før pengene skifter hænder.

### Sådan fungerer PayPal rent faktisk {#how-paypal-actually-works}

PayPals proces er fuldstændig omvendt:

1. **Giv øjeblikkelig adgang til produktions-API**
2. **Tillad betalingsopkrævning i timer eller dage**
3. **Bloker pludselig betalinger uden varsel**
4. **Kræv KYC-dokumentation, efter kunder allerede er berørt**
5. **Giv ingen underretning til forhandleren**
6. **Lad kunderne opdage problemet og rapportere det**

### Virkelighedens påvirkning {#the-real-world-impact}

Denne baglæns proces skaber katastrofer for virksomheder:

* **Kunder kan ikke gennemføre køb** i perioder med høj salgstid
* **Ingen forhåndsvarsel** om, at verifikation er nødvendig
* **Ingen e-mail-notifikationer**, når betalinger blokeres
* **Forhandlere lærer om problemer fra forvirrede kunder**
* **Omsætningstab** i kritiske forretningsperioder
* **Skade på kundernes tillid**, når betalinger på mystisk vis mislykkes

### Kontomigreringskatastrofen i juli 2025 {#the-july-2025-account-migration-disaster}

Præcis dette scenarie udspillede sig under vores rutinemæssige kontomigrering i juli 2025. PayPal tillod betalinger i starten, men blokerede dem pludselig uden nogen varsel. Vi opdagede først problemet, da kunderne begyndte at rapportere, at de ikke kunne betale.

Da vi kontaktede support, modtog vi modstridende svar om, hvilken dokumentation der var nødvendig, uden en klar tidslinje for løsning. Dette tvang os til helt at stoppe PayPal-betalinger, hvilket forvirrede kunder, der ikke havde andre betalingsmuligheder.

### Hvorfor dette er vigtigt {#why-this-matters}

PayPals tilgang til compliance viser en fundamental misforståelse af, hvordan virksomheder fungerer. Korrekt KYC bør ske **før** produktionsintegration, ikke efter kunderne allerede forsøger at betale. Manglen på proaktiv kommunikation, når der opstår problemer, demonstrerer PayPals manglende forbindelse til forhandlernes behov.

Denne baglæns proces er symptomatisk for PayPals bredere organisatoriske problemer: de prioriterer deres interne processer over forhandler- og kundeoplevelsen, hvilket fører til den slags driftskatastrofer, der driver virksomheder væk fra deres platform.

## Sådan gør alle andre betalingsudbydere det rigtigt {#how-every-other-payment-processor-does-it-right}

Funktionen til abonnementslister, som PayPal nægter at implementere, har været standard i branchen i over et årti. Sådan håndterer andre betalingsudbydere dette grundlæggende krav:

### Stripe {#stripe}

Stripe har haft abonnementslister siden deres API blev lanceret. Deres dokumentation viser tydeligt, hvordan man henter alle abonnementer for en kunde- eller handelskonto. Dette betragtes som grundlæggende CRUD-funktionalitet.

### Padle {#paddle}

Paddle tilbyder omfattende API'er til abonnementsadministration, herunder listeopslag, filtrering og paginering. De forstår, at handlende har brug for at se deres tilbagevendende indtægtsstrømme.

### Coinbase Commerce {#coinbase-commerce}

Selv kryptovalutabetalingsudbydere som Coinbase Commerce tilbyder bedre abonnementsstyring end PayPal.

### Kvadrat {#square}

Squares API inkluderer abonnementsliste som en grundlæggende funktion, ikke en eftertanke.

### Branchestandarden {#the-industry-standard}

Enhver moderne betalingsudbyder tilbyder:

* Liste over alle abonnementer
* Filtrer efter status, dato, kunde
* Paginering for store datasæt
* Webhook-notifikationer for abonnementsændringer
* Omfattende dokumentation med fungerende eksempler

### Hvad andre processorer tilbyder vs. PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Vis alle abonnementer:**

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

**Stribe - Filtrer efter kunde:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrer efter status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Hvad du rent faktisk får:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPals tilgængelige slutpunkter:**

* `POST /v1/billing/subscriptions` - Opret et abonnement
* `GET /v1/billing/subscriptions/{id}` - Få ÉT abonnement (hvis du kender ID'et)
* `PATCH /v1/billing/subscriptions/{id}` - Opdater et abonnement
* `POST /v1/billing/subscriptions/{id}/cancel` - Annuller abonnement
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspender abonnement

**Hvad mangler der fra PayPal:**

* ❌ Ingen `GET /v1/billing/subscriptions` (angiv alle)
* ❌ Ingen søgefunktion
* ❌ Ingen filtrering efter status, kunde, dato
* ❌ Ingen understøttelse af paginering

PayPal er den eneste større betalingsudbyder, der tvinger udviklere til manuelt at spore abonnements-ID'er i deres egne databaser.

## PayPals systematiske cover-up: Tavshed for 6 millioner stemmer {#paypals-systematic-cover-up-silencing-6-million-voices}

I et træk, der perfekt indkapsler PayPals tilgang til håndtering af kritik, tog de for nylig hele deres communityforum offline, hvilket effektivt lukkede over 6 millioner medlemmer ned og slettede hundredtusindvis af opslag, der dokumenterede deres fiaskoer.

### Den store udslettelse {#the-great-erasure}

Det oprindelige PayPal-fællesskab på `paypal-community.com` havde **6.003.558 medlemmer** og indeholdt hundredtusindvis af indlæg, fejlrapporter, klager og diskussioner om PayPals API-fejl. Dette repræsenterede over et årtis dokumenteret bevis på PayPals systematiske problemer.

Den 30. juni 2025 tog PayPal stille og roligt hele forummet offline. Alle `paypal-community.com` links returnerer nu 404-fejl. Dette var ikke en migrering eller opgradering.

### Tredjepartsredning {#the-third-party-rescue}

Heldigvis har en tredjepartstjeneste på [ppl.lithium.com](https://ppl.lithium.com/) bevaret noget af indholdet, hvilket giver os adgang til de diskussioner, som PayPal forsøgte at skjule. Denne tredjepartsbeskyttelse er dog ufuldstændig og kan forsvinde når som helst.

Dette mønster med at skjule beviser er ikke nyt for PayPal. De har en dokumenteret historie med:

* Fjernelse af kritiske fejlrapporter fra offentligheden
* Afbrydelse af udviklerværktøjer uden varsel
* Ændring af API'er uden korrekt dokumentation
* Undertrykkelse af diskussioner i fællesskabet om deres fejl

Fjernelsen af forummet repræsenterer det hidtil mest skamløse forsøg på at skjule deres systematiske fejl fra offentlighedens søgelys.

## Den 11 år lange Capture Bug-katastrofe: $1.899 og vi taler med det {#the-11-year-capture-bug-disaster-1899-and-counting}

Mens PayPal havde travlt med at organisere feedbackmøder og give løfter, har deres kernebetalingssystem været fundamentalt i stykker i over 11 år. Beviserne er ødelæggende.

### Videresend e-mails tab på $1.899 {#forward-emails-1899-loss}

I vores produktionssystemer opdagede vi 108 PayPal-betalinger på i alt **1.899 USD**, som gik tabt på grund af PayPals fejl i betalingsprocessen. Disse betalinger viser et ensartet mønster:

* `CHECKOUT.ORDER.APPROVED` webhooks blev modtaget
* PayPals capture API returnerede 404 fejl
* Ordrer blev utilgængelige via PayPals API

Det er umuligt at afgøre, om kunderne er blevet opkrævet betaling, da PayPal fuldstændigt skjuler fejlfindingslogfiler efter 14 dage og sletter alle data fra dashboardet for ordre-ID'er, der ikke blev registreret.

Dette repræsenterer kun én virksomhed. **De samlede tab på tværs af tusindvis af handlende over 11+ år beløber sig sandsynligvis til millioner af dollars.**

**Vi gentager det: De samlede tab på tværs af tusindvis af handlende over 11+ år beløber sig sandsynligvis til millioner af dollars.**

Den eneste grund til, at vi opdagede dette, er, at vi er utroligt omhyggelige og datadrevne.

### Den oprindelige rapport fra 2013: 11+ års uagtsomhed {#the-2013-original-report-11-years-of-negligence}

Den tidligste dokumenterede rapport om netop dette problem findes på [Stack Overflow i november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkiveret](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Bliver ved med at modtage 404-fejl med Rest API, når der udføres en optagelse"

Fejlen, der blev rapporteret i 2013, er **identisk** med den, der blev oplevet i Forward Email i 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Reaktionen fra lokalsamfundet i 2013 var sigende:

> "Der er rapporteret et problem med REST API i øjeblikket. PayPal arbejder på det."

**11+ år senere arbejder de stadig på det.**

### 2016-optagelsen: PayPal bryder deres eget SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

I 2016 dokumenterede PayPals eget GitHub-lager, at [massive fangstfejl](https://github.com/paypal/PayPal-PHP-SDK/issues/660) påvirkede deres officielle PHP SDK. Omfanget var svimlende:

> "Siden 20/9/2016 har alle PayPal-indsamlingsforsøg mislykkedes med 'INVALID_RESOURCE_ID - Anmodet ressource-ID blev ikke fundet.'. Intet blev ændret mellem 19/9 og 20/9 i API-integrationen. **100% af indsamlingsforsøgene siden 20/9 har returneret denne fejl.**"

En købmand rapporterede:

> "Jeg har haft **over 1.400 mislykkede forsøg på at optage data i løbet af de sidste 24 timer**, alle med fejlsvaret INVALID_RESOURCE_ID."

PayPals første reaktion var at give forhandleren skylden og henvise dem til teknisk support. Først efter massivt pres indrømmede de skylden:

> "Jeg har en opdatering fra vores produktudviklere. De bemærker i de headere, der sendes, at PayPal-anmodnings-ID'et sendes med 42 tegn, men **det ser ud til, at der for nylig er sket en ændring, der begrænser dette ID til kun 38 tegn.**"

Denne indrømmelse afslører PayPals systematiske uagtsomhed:

1. **De lavede udokumenterede, fejlslagne ændringer**
2. **De ødelagde deres eget officielle SDK**
3. **De gav først handlende skylden**
4. **De indrømmede kun fejl under pres**

Selv efter at have "løst" problemet, rapporterede handlende:

> "Opgraderede SDK'et til v1.7.4, og **problemet opstår stadig.**"

### Eskaleringen i 2024: Stadig i stykker {#the-2024-escalation-still-broken}

Nylige rapporter fra det bevarede PayPal-fællesskab viser, at problemet faktisk er blevet værre. En [Diskussion i september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkiveret](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumenterer præcis de samme problemer:

> "Problemet begyndte først at opstå for omkring 2 uger siden og påvirker ikke alle ordrer. **Det meget mere almindelige problem ser ud til at være 404'er ved registrering.**"

Forhandleren beskriver det samme mønster, som han oplevede ved at videresende e-mail:

> "Efter at have forsøgt at registrere ordren, returnerer PayPal en 404-fejl. Ved hentning af ordreoplysninger: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dette er uden spor af en vellykket registrering fra vores side.**"

### Webhook-pålidelighedskatastrofen {#the-webhook-reliability-disaster}

En anden [bevaret fællesskabsdiskussion](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) afslører, at PayPals webhook-system fundamentalt er upålideligt:

> "Teoretisk set burde den have to hændelser (CHECKOUT.ORDER.APPROVED og PAYMENT.CAPTURE.COMPLETED) fra Webhook-hændelser. Faktisk modtages disse to hændelser sjældent med det samme. PAYMENT.CAPTURE.COMPLETED kan ikke modtages det meste af tiden, eller det ville ske inden for et par timer."

For abonnementsbetalinger:

> "**'BETALING.SALG.AFSLUTNING' blev ikke modtaget nogle gange eller før efter et par timer."

Forhandlerens spørgsmål afslører omfanget af PayPals pålidelighedsproblemer:

1. **"Hvorfor sker dette?"** - PayPals webhook-system er fundamentalt defekt
2. **"Hvis ordrestatus er 'AFSLUTET', kan jeg så gå ud fra, at jeg har modtaget pengene?"** - Forhandlere kan ikke stole på PayPals API-svar
3. **"Hvorfor kan 'Hændelseslogge->Webhook-hændelser' ikke finde nogen logfiler?"** - Selv PayPals eget logføringssystem fungerer ikke

### Mønsteret af systematisk uagtsomhed {#the-pattern-of-systematic-negligence}

Beviserne strækker sig over 11+ år og viser et tydeligt mønster:

* **2013**: "PayPal arbejder på det"
* **2016**: PayPal indrømmer fejl i ændringen, og tilbyder en fejlrettelse
* **2024**: Præcis de samme fejl opstår stadig, hvilket påvirker videresendelse af e-mails og utallige andre.

Dette er ikke en fejl - **dette er systematisk uagtsomhed.** PayPal har kendt til disse kritiske fejl i betalingsbehandlingen i over et årti og har konsekvent:

1. **Gav forhandlere skylden for PayPals fejl**
2. **Foretog udokumenterede ændringer, der ikke fungerede korrekt**
3. **Foretog utilstrækkelige rettelser, der ikke virker**
4. **Ignorerede den økonomiske indvirkning på virksomheder**
5. **Skjult bevismateriale ved at fjerne fællesskabsfora**

### Det udokumenterede krav {#the-undocumented-requirement}

Ingen steder i PayPals officielle dokumentation nævner de, at forhandlere skal implementere gentagne forsøgslogik til indsamlingsoperationer. Deres dokumentation angiver, at forhandlere skal "indsamle øjeblikkeligt efter godkendelse", men nævner ikke, at deres API tilfældigt returnerer 404-fejl, der kræver komplekse gentagne forsøgsmekanismer.

Dette tvinger enhver handlende til at:

* Implementer eksponentiel backoff-gentagelseslogik
* Håndter inkonsekvent webhook-levering
* Byg komplekse tilstandsstyringssystemer
* Overvåg manuelt for mislykkede optagelser

**Alle andre betalingsudbydere tilbyder pålidelige API'er til indsamling, der virker første gang.**

## PayPals bredere mønster af bedrag {#paypals-broader-pattern-of-deception}

Capture-fejlkatastrofen er blot ét eksempel på PayPals systematiske tilgang til at bedrage kunder og skjule deres fejl.

### Handling fra New York Department of Financial Services {#the-new-york-department-of-financial-services-action}

I januar 2025 udstedte New York Department of Financial Services en [håndhævelsesaktion mod PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf)-certificering for vildledende praksis, hvilket demonstrerede, at PayPals mønster af bedrag strækker sig langt ud over deres API'er.

Denne lovgivningsmæssige handling viser PayPals villighed til at anvende vildledende praksis på tværs af hele deres forretning, ikke kun deres udviklerværktøjer.

### Honning-sagen: Omskrivning af affilierede links {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals opkøb af Honey har resulteret i, at [Retssager om, at Honey omskriver affilierede links](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) stjæler provisioner fra indholdsskabere og influencers. Dette repræsenterer endnu en form for systematisk bedrag, hvor PayPal profiterer ved at omdirigere indtægter, der burde gå til andre.

Mønsteret er tydeligt:

1. **API-fejl**: Skjul defekt funktionalitet, giv forhandlere skylden
2. **Silencing af fællesskabet**: Fjern beviser for problemer
3. **Overtrædelser af regler**: Deltag i vildledende praksis
4. **Tyveri af affilierede**: Stjæl provisioner gennem teknisk manipulation

### Omkostningerne ved PayPals uagtsomhed {#the-cost-of-paypals-negligence}

Tabet på 1.899 dollars for videresendelse af e-mails repræsenterer kun toppen af isbjerget. Overvej den bredere effekt:

* **Individuelle forhandlere**: Tusindvis af mennesker mister hundredvis til tusindvis af dollars hver
* **Virksomhedskunder**: Potentielt millioner i tabt omsætning
* **Udviklertid**: Utallige timer med at udvikle løsninger til PayPals defekte API'er
* **Kundetillid**: Virksomheder mister kunder på grund af PayPals betalingsfejl

Hvis én lille e-mailtjeneste tabte næsten 2.000 dollars, og dette problem har eksisteret i over 11 år og påvirket tusindvis af forhandlere, beløber det samlede økonomiske tab sig sandsynligvis til **hundredvis af millioner af dollars**.

### Dokumentationsløgnen {#the-documentation-lie}

PayPals officielle dokumentation nævner konsekvent ikke de kritiske begrænsninger og fejl, som forhandlere vil støde på. For eksempel:

* **Capture API**: Ingen omtale af, at 404-fejl er almindelige og kræver logik for gentagne forsøg
* **Webhook-pålidelighed**: Ingen omtale af, at webhooks ofte er forsinkede med timer
* **Abonnementsliste**: Dokumentationen antyder, at liste er mulig, når der ikke findes et slutpunkt
* **Sessionstimeouts**: Ingen omtale af aggressive 60-sekunders timeouts

Denne systematiske udeladelse af kritiske oplysninger tvinger handlende til at opdage PayPals begrænsninger gennem trial and error i produktionssystemer, hvilket ofte resulterer i økonomiske tab.

## Hvad dette betyder for udviklere {#what-this-means-for-developers}

PayPals systematiske undladelse af at imødekomme grundlæggende udviklernes behov, samtidig med at de indsamler omfattende feedback, viser et fundamentalt organisatorisk problem. De behandler feedbackindsamling som en erstatning for rent faktisk at løse problemer.

Mønsteret er tydeligt:

1. Udviklere rapporterer problemer
2. PayPal organiserer feedbacksessioner med ledere
3. Der gives omfattende feedback
4. Teams anerkender mangler og lover at "spore og adressere"
5. Intet bliver implementeret
6. Ledere forlader virksomheden
7. Nye teams beder om den samme feedback
8. Gentagelser

I mellemtiden er udviklere tvunget til at bygge løsninger, kompromittere sikkerheden og håndtere ødelagte brugergrænseflader bare for at acceptere betalinger.

Hvis du er ved at opbygge et betalingssystem, så lær af vores erfaring: Byg din [trifecta-tilgangen](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) med flere processorer, men forvent ikke, at PayPal leverer den grundlæggende funktionalitet, du har brug for. Planlæg at bygge løsninger fra dag ét.

> Dette indlæg dokumenterer vores 11-årige erfaring med PayPals API'er til videresendelse af e-mail. Alle kodeeksempler og links er fra vores faktiske produktionssystemer. Vi fortsætter med at understøtte PayPal-betalinger på trods af disse problemer, fordi nogle kunder ikke har andre muligheder.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />