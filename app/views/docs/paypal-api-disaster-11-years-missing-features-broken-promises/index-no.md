# PayPals 11 år lange API-katastrofe: Hvordan vi bygde løsninger mens de ignorerte utviklere {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Hos Forward Email har vi hatt problemer med PayPals ødelagte API-er i over et tiår. Det som startet som mindre frustrasjoner har utviklet seg til en fullstendig katastrofe som tvang oss til å bygge våre egne løsninger, blokkere phishing-malene deres og til slutt stoppe alle PayPal-betalinger under en kritisk kontomigrering.</p>
<p class="lead mt-3">Dette er historien om 11 år der PayPal ignorerer grunnleggende utviklerbehov mens vi prøvde alt for å få plattformen deres til å fungere.</p>

## Innholdsfortegnelse {#table-of-contents}

* [Den manglende brikken: Ingen måte å liste opp abonnementer på](#the-missing-piece-no-way-to-list-subscriptions)
* [2014–2017: Problemet dukker opp](#2014-2017-the-problem-emerges)
* [2020: Vi gir dem omfattende tilbakemeldinger](#2020-we-give-them-extensive-feedback)
  * [Tilbakemeldingslisten med 27 elementer](#the-27-item-feedback-list)
  * [Lagene ble involvert, løfter ble gitt](#teams-got-involved-promises-were-made)
  * [Resultatet? Ingenting.](#the-result-nothing)
* [Den utadvendte ledelsen: Hvordan PayPal mistet all institusjonell hukommelse](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nytt lederskap, samme problemer](#2025-new-leadership-same-problems)
  * [Den nye administrerende direktøren blir involvert](#the-new-ceo-gets-involved)
  * [Michelle Gills svar](#michelle-gills-response)
  * [Vårt svar: Ingen flere møter](#our-response-no-more-meetings)
  * [Marty Brodbecks overfortolkede respons](#marty-brodbecks-overengineering-response)
  * [Den «enkle CRUD»-motsigelsen](#the-simple-crud-contradiction)
  * [Frakoblingen blir tydelig](#the-disconnect-becomes-clear)
* [Årevis med feilrapporter de ignorerte](#years-of-bug-reports-they-ignored)
  * [2016: Tidlige UI/UX-klager](#2016-early-uiux-complaints)
  * [2021: Feilrapport for bedrifts-e-post](#2021-business-email-bug-report)
  * [2021: Forslag til forbedring av brukergrensesnitt](#2021-ui-improvement-suggestions)
  * [2021: Feil i sandkassemiljøet](#2021-sandbox-environment-failures)
  * [2021: Rapportsystemet er fullstendig ødelagt](#2021-reports-system-completely-broken)
  * [2022: Kjerne-API-funksjon mangler (igjen)](#2022-core-api-feature-missing-again)
* [Utvikleropplevelsens mareritt](#the-developer-experience-nightmare)
  * [Ødelagt brukergrensesnitt](#broken-user-interface)
  * [SDK-problemer](#sdk-problems)
  * [Brudd på retningslinjer for innholdssikkerhet](#content-security-policy-violations)
  * [Dokumentasjonskaos](#documentation-chaos)
  * [Sikkerhetsproblemer](#security-vulnerabilities)
  * [Katastrofe i økthåndtering](#session-management-disaster)
* [Juli 2025: Den siste dråpen](#july-2025-the-final-straw)
* [Hvorfor vi ikke bare kan droppe PayPal](#why-we-cant-just-drop-paypal)
* [Løsningen for fellesskapet](#the-community-workaround)
* [Blokkering av PayPal-maler på grunn av phishing](#blocking-paypal-templates-due-to-phishing)
  * [Det virkelige problemet: PayPals maler ser ut som svindel](#the-real-problem-paypals-templates-look-like-scams)
  * [Vår implementering](#our-implementation)
  * [Hvorfor vi måtte blokkere PayPal](#why-we-had-to-block-paypal)
  * [Problemets omfang](#the-scale-of-the-problem)
  * [Ironien](#the-irony)
  * [Virkelig innvirkning: Nye PayPal-svindelforsøk](#real-world-impact-novel-paypal-scams)
* [PayPals baklengs KYC-prosess](#paypals-backwards-kyc-process)
  * [Hvordan det skal fungere](#how-it-should-work)
  * [Hvordan PayPal faktisk fungerer](#how-paypal-actually-works)
  * [Virkelighetens innvirkning](#the-real-world-impact)
  * [Kontomigreringskatastrofen i juli 2025](#the-july-2025-account-migration-disaster)
  * [Hvorfor dette er viktig](#why-this-matters)
* [Hvordan alle andre betalingsbehandlere gjør det riktig](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Padle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Kvadrat](#square)
  * [Bransjestandarden](#the-industry-standard)
  * [Hva andre betalingssystemer tilbyr kontra PayPal](#what-other-processors-provide-vs-paypal)
* [PayPals systematiske tildekking: Demper 6 millioner stemmer](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Den store utslettelsen](#the-great-erasure)
  * [Tredjepartsredningen](#the-third-party-rescue)
* [Den 11 år lange Capture Bug-katastrofen: $ 1899 og fortsetter](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Tap på 1 899 dollar på videresendt e-post](#forward-emails-1899-loss)
  * [Den opprinnelige rapporten fra 2013: Over 11 år med uaktsomhet](#the-2013-original-report-11-years-of-negligence)
  * [Innrømmelsen i 2016: PayPal bryter sin egen SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskaleringen i 2024: Fortsatt ødelagt](#the-2024-escalation-still-broken)
  * [Webhooks pålitelighetskatastrofe](#the-webhook-reliability-disaster)
  * [Mønsteret av systematisk uaktsomhet](#the-pattern-of-systematic-negligence)
  * [Det udokumenterte kravet](#the-undocumented-requirement)
* [PayPals bredere mønster av bedrag](#paypals-broader-pattern-of-deception)
  * [Tiltakene fra New York Department of Financial Services](#the-new-york-department-of-financial-services-action)
  * [Honningsøksmålet: Omskriving av affiliate-lenker](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Kostnaden for PayPals uaktsomhet](#the-cost-of-paypals-negligence)
  * [Dokumentasjonsløgnen](#the-documentation-lie)
* [Hva dette betyr for utviklere](#what-this-means-for-developers)

## Den manglende brikken: Ingen måte å liste opp abonnementer på {#the-missing-piece-no-way-to-list-subscriptions}

Her er det som slår oss helt igjennom: PayPal har hatt abonnementsfakturering siden 2014, men de har aldri gitt selgere en måte å liste opp sine egne abonnementer.

Tenk litt over det. Du kan opprette abonnementer, du kan kansellere dem hvis du har ID-en, men du kan ikke få en liste over alle aktive abonnementer for kontoen din. Det er som å ha en database uten en SELECT-setning.

Vi trenger dette for grunnleggende forretningsdrift:

* Kundesupport (når noen spør om abonnementet sitt via e-post)
* Finansiell rapportering og avstemming
* Automatisert faktureringshåndtering
* Samsvar og revisjon

Men PayPal? De bare ... aldri bygde det.

## 2014–2017: Problemet dukker opp {#2014-2017-the-problem-emerges}

Problemet med abonnementslisten dukket først opp i PayPals fellesskapsforum tilbake i 2017. Utviklerne stilte det åpenbare spørsmålet: «Hvordan får jeg en liste over alle abonnementene mine?»

PayPals svar? Sirisser.

Medlemmer av lokalsamfunnet begynte å bli frustrerte:

> "En veldig merkelig unnlatelse hvis en selger ikke kan liste opp alle aktive avtaler. Hvis avtale-ID-en går tapt, betyr det at bare brukeren kan kansellere eller suspendere en avtale." - leafspider

> "+1. Det har gått nesten 3 år." - laudukang (som betyr at problemet har eksistert siden \~2014)

[originalt fellesskapsinnlegg](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) fra 2017 viser utviklere som ber om denne grunnleggende funksjonaliteten. PayPals svar var å arkivere depotet der folk rapporterte problemet.

## 2020: Vi gir dem omfattende tilbakemeldinger {#2020-we-give-them-extensive-feedback}

I oktober 2020 kontaktet PayPal oss for en formell tilbakemeldingssesjon. Dette var ikke en uformell prat – de organiserte en 45-minutters Microsoft Teams-samtale med åtte PayPal-ledere, inkludert Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze og andre.

### Tilbakemeldingslisten med 27 elementer {#the-27-item-feedback-list}

Vi kom forberedt. Etter seks timer med forsøk på å integrere med API-ene deres, hadde vi samlet 27 spesifikke problemer. Mark Stuart fra PayPal Checkout-teamet sa:

> Hei Nick, takk for at du delte med alle i dag! Jeg tror dette vil være katalysatoren for å få mer støtte og investeringer fra teamet vårt, slik at de kan fikse disse tingene. Det har vært vanskelig å få så gode tilbakemeldinger som det du har gitt oss så langt.

Tilbakemeldingene var ikke teoretiske – de kom fra reelle integrasjonsforsøk:

1. **Generering av tilgangstoken fungerer ikke**:

> Generering av tilgangstoken fungerer ikke. Det bør også være mer enn bare cURL-eksempler.

2. **Ingen nettgrensesnitt for opprettelse av abonnement**:

> Hvordan i all verden kan man opprette abonnementer uten å måtte gjøre det med cURL? Det ser ikke ut til å finnes et webgrensesnitt for å gjøre dette (slik som Stripe har)

Mark Stuart syntes problemet med tilgangstoken var spesielt bekymringsfullt:

> Vi hører vanligvis ikke om problemer rundt generering av tilgangstoken.

### Lagene ble involvert, løfter ble gitt {#teams-got-involved-promises-were-made}

Etter hvert som vi oppdaget flere problemer, fortsatte PayPal å legge til flere team i samtalen. Darshan Raju fra abonnementsadministrasjonsgrensesnittteamet ble med og sa:

> Erkjenn gapet. Vi vil spore og ta tak i dette. Takk igjen for tilbakemeldingen din!

Møtet ble beskrevet som å søke en:

> ærlig gjennomgang av opplevelsen din

til:

> gjøre PayPal til det det burde være for utviklere.

### Resultatet? Ingenting. {#the-result-nothing}

Til tross for den formelle tilbakemeldingssesjonen, den omfattende listen på 27 punkter, flere teamdeltakelser og løfter om å:

> spor og adresse

problemer, absolutt ingenting ble fikset.

## Ledelsens eksodus: Hvordan PayPal mistet all institusjonell hukommelse {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Det er her det virkelig blir interessant. Alle som mottok tilbakemeldingene våre for 2020 har forlatt PayPal:

**Lederendringer:**

* [Dan Schulman (administrerende direktør i 9 år) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (teknologidirektør som organiserte tilbakemeldinger) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januar 2024)

**Tekniske ledere som ga løfter, og deretter dro:**

* **Mark Stuart** (lovet at tilbakemeldingen ville være "katalysator") → [Nå hos Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 år med PayPal-veteran) → [Administrerende direktør i MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP for globalt forbrukerprodukt) → [Pensjonert](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (en av de siste gjenværende) → [Nettopp dro til Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januar 2025)

PayPal har blitt en svingdør der ledere samler tilbakemeldinger fra utviklere, gir løfter, og deretter drar til bedre selskaper som JPMorgan, Ripple og andre fintech-firmaer.

Dette forklarer hvorfor svaret på GitHub-problemet i 2025 virket fullstendig frakoblet tilbakemeldingene våre fra 2020 – bokstavelig talt alle som mottok den tilbakemeldingen har forlatt PayPal.

## 2025: Nytt lederskap, samme problemer {#2025-new-leadership-same-problems}

Spoler vi frem til 2025, viser det samme mønsteret seg. Etter år uten fremgang tar PayPals nye ledelse kontakt igjen.

### Den nye administrerende direktøren blir involvert {#the-new-ceo-gets-involved}

30. juni 2025 eskalerte vi direkte til PayPals nye administrerende direktør, Alex Chriss. Svaret hans var kort:

> Hei Nick – Takk for at du tok kontakt og for tilbakemeldingen. Michelle (kopi) er på topp med teamet sitt for å engasjere seg og jobbe gjennom dette med deg. Takk -A

### Michelle Gills svar {#michelle-gills-response}

Michelle Gill, konserndirektør og daglig leder for småbedrifter og finansielle tjenester, svarte:

> Tusen takk, Nick, jeg flytter Alex til bcc. Vi har undersøkt dette siden det forrige innlegget ditt. Vi ringer deg før uken er omme. Kan du sende meg kontaktinformasjonen din, slik at en av kollegene mine kan ta kontakt med deg? Michelle

### Vårt svar: Ingen flere møter {#our-response-no-more-meetings}

Vi takket nei til et nytt møte, og forklarte frustrasjonen vår:

> Takk. Men jeg føler ikke at det å ta en telefonsamtale kommer til å gjøre noe. Her er hvorfor... Jeg hadde en telefonsamtale tidligere, og den førte absolutt ingen vei. Jeg kastet bort over to timer av tiden min på å snakke med hele teamet og ledelsen, og ingenting ble gjort... Massevis av e-poster frem og tilbake. Absolutt ingenting ble gjort. Tilbakemeldinger førte ingen vei. Jeg prøvde i årevis, ble lyttet til, og så førte det ingen vei.

### Marty Brodbecks svar på overengineering {#marty-brodbecks-overengineering-response}

Så kontaktet Marty Brodbeck, som leder forbrukerteknikk hos PayPal:

> Hei Nick, dette er Marty Brodbeck. Jeg leder all forbrukerutvikling her hos PayPal og har drevet API-utviklingen for selskapet. Kan du og jeg snakke om problemet du står overfor og hvordan vi kan hjelpe deg her?

Da vi forklarte det enkle behovet for et endepunkt for abonnementsoppføring, avslørte svaret hans det eksakte problemet:

> Takk Nick, vi er i ferd med å lage et enkelt abonnements-API med full SDK (støtter full feilhåndtering, hendelsesbasert abonnementssporing, robust oppetid) der fakturering også er delt opp som et separat API som selgere kan gå til, i stedet for å måtte orkestrere på tvers av flere endepunkter for å få ett enkelt svar.

Dette er helt feil tilnærming. Vi trenger ikke måneder med kompleks arkitektur. Vi trenger ett enkelt REST-endepunkt som viser abonnementer – noe som burde ha eksistert siden 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Selvmotsigelsen om den «enkle CRUD» {#the-simple-crud-contradiction}

Da vi påpekte at dette var grunnleggende CRUD-funksjonalitet som burde ha eksistert siden 2014, var Martys svar talende:

> Enkle Crud-operasjoner er en del av kjerne-API-et, min venn, så det vil ikke ta måneder med utvikling

PayPal TypeScript SDK, som for øyeblikket bare støtter tre endepunkter etter måneder med utvikling, sammen med den historiske tidslinjen, viser tydelig at slike prosjekter krever mer enn noen få måneder å fullføre.

Dette svaret viser at han ikke forstår sitt eget API. Hvis «enkle CRUD-operasjoner er en del av kjerne-API-et», hvor er da endepunktet for abonnementsoppføringen? Vi svarte:

> Hvis «enkle CRUD-operasjoner er en del av kjerne-API-et», hvor er da endepunktet for abonnementsoppføringen? Utviklere har bedt om denne «enkle CRUD-operasjonen» siden 2014. Det har gått 11 år. Alle andre betalingsbehandlere har hatt denne grunnleggende funksjonaliteten siden dag én.

### Frakoblingen blir tydelig {#the-disconnect-becomes-clear}

Samtalene med Alex Chriss, Michelle Gill og Marty Brodbeck i 2025 viser den samme organisatoriske dysfunksjonen:

1. **Ny ledelse har ingen kjennskap til tidligere tilbakemeldingsmøter**
2. **De foreslår de samme overforutviklede løsningene**
3. **De forstår ikke sine egne API-begrensninger**
4. **De ønsker flere møter i stedet for bare å fikse problemet**

Dette mønsteret forklarer hvorfor PayPal-teamene i 2025 virker fullstendig frakoblet fra den omfattende tilbakemeldingen som ble gitt i 2020 – menneskene som mottok tilbakemeldingen er borte, og den nye ledelsen gjentar de samme feilene.

## År med feilrapporter de ignorerte {#years-of-bug-reports-they-ignored}

Vi klaget ikke bare over manglende funksjoner. Vi rapporterte aktivt feil og prøvde å hjelpe dem med å forbedre seg. Her er en omfattende tidslinje over problemene vi dokumenterte:

### 2016: Tidlige UI/UX-klager {#2016-early-uiux-complaints}

Selv tilbake i 2016 kontaktet vi PayPals ledelse offentlig, inkludert Dan Schulman, om grensesnittproblemer og brukervennlighetsproblemer. Dette var for ni år siden, og de samme UI/UX-problemene vedvarer i dag.

### 2021: Feilrapport for bedrifts-e-post {#2021-business-email-bug-report}

I mars 2021 rapporterte vi at PayPals e-postsystem for bedrifter sendte feilaktige varsler om kansellering. E-postmalen hadde variabler som ble gjengitt feil, noe som viste forvirrende meldinger til kundene.

Mark Stuart erkjente problemet:

> Takk Nick! Går over til BCC. @Prasy, er teamet ditt ansvarlig for denne e-posten, eller vet dere hvem som er det? Meldingen «Niftylettuce, LLC, vi fakturerer dere ikke lenger» får meg til å tro at det er en forveksling i hvem den er adressert til og innholdet i e-posten.

**Resultat**: De fikset faktisk denne! Mark Stuart bekreftet:

> Jeg hørte nettopp fra varslingsteamet at e-postmalen er fikset og rullet ut. Setter pris på at du tok kontakt for å rapportere det. Takk!

Dette viser at de KAN fikse ting når de vil – de velger bare å ikke gjøre det for de fleste problemer.

### 2021: Forslag til forbedring av brukergrensesnitt {#2021-ui-improvement-suggestions}

I februar 2021 ga vi detaljert tilbakemelding om brukergrensesnittet deres for dashbordet, nærmere bestemt delen «Nylig aktivitet på PayPal»:

> Jeg synes dashbordet på paypal.com, spesielt «PayPal Nylig aktivitet», trenger forbedring. Jeg synes ikke du bør vise statuslinjene «Opprettet» for $0 Gjentakende betaling – det legger bare til massevis av ekstra linjer, og du kan ikke enkelt se med et øyekast hvor mye inntekt som genereres for dagen/de siste dagene.

Mark Stuart videresendte den til forbrukerproduktteamet:

> Takk! Jeg er ikke sikker på hvilket team som er ansvarlig for Aktivitet, men jeg videresendte det til lederen for forbrukerprodukter for å finne riktig team. En gjentakende betaling på 0,00 dollar virker som en feil. Burde sannsynligvis filtreres ut.

**Resultat**: Aldri fikset. Brukergrensesnittet viser fortsatt disse ubrukelige $0-oppføringene.

### 2021: Feil i sandkassemiljøet {#2021-sandbox-environment-failures}

I november 2021 rapporterte vi kritiske problemer med PayPals sandkassemiljø:

* Hemmelige API-nøkler for sandkassen ble endret tilfeldig og deaktivert
* Alle testkontoer for sandkassen ble slettet uten varsel
* Feilmeldinger ved forsøk på å vise detaljer om sandkassekontoen
* Periodiske innlastingsfeil

> Av en eller annen grunn ble den hemmelige API-nøkkelen for sandkassen min endret og deaktivert. I tillegg ble alle de gamle Sandbox-testkontoene mine slettet.

> Noen ganger laster de, og noen ganger ikke like bra. Dette er vanvittig frustrerende.

**Resultat**: Ingen respons, ingen løsning. Utviklere har fortsatt problemer med påliteligheten til sandkassen.

### 2021: Rapporterer at systemet er fullstendig ødelagt {#2021-reports-system-completely-broken}

I mai 2021 rapporterte vi at PayPals nedlastingssystem for transaksjonsrapporter var fullstendig ødelagt:

> Det virker som om rapportering av nedlastinger ikke fungerer akkurat nå, og det har ikke vært tilfelle i hele dag. Burde nok også få et e-postvarsel hvis det mislykkes.

Vi påpekte også katastrofen med økthåndtering:

> Hvis du er inaktiv mens du er logget inn på PayPal i omtrent fem minutter, blir du logget ut. Så når du oppdaterer knappen ved siden av rapporten du vil sjekke statusen til (etter at du har ventet en evighet), er det synd å måtte logge inn igjen.

Mark Stuart erkjente problemet med timeout-økten:

> Jeg husker at du rapporterte det tidligere, da økten din ofte utløp og forstyrret utviklingsflyten mens du byttet mellom IDE-en din og developer.paypal.com eller selgerdashbordet ditt, og så kom du tilbake og ble logget ut igjen.

**Resultat**: Timeout-tiden for økter er fortsatt 60 sekunder. Rapportsystemet feiler fortsatt regelmessig.

### 2022: Kjerne-API-funksjon mangler (igjen) {#2022-core-api-feature-missing-again}

I januar 2022 eskalerte vi problemet med abonnementsoppføringen igjen, denne gangen med enda flere detaljer om hvordan dokumentasjonen deres var feil:

> Det finnes ingen GET som viser alle abonnementer (tidligere kalt faktureringsavtaler)

Vi oppdaget at den offisielle dokumentasjonen deres var fullstendig unøyaktig:

> API-dokumentasjonen er også fullstendig unøyaktig. Vi trodde vi kunne finne en løsning ved å laste ned en hardkodet liste over abonnements-ID-er. Men det fungerer ikke engang!

> Fra den offisielle dokumentasjonen her ... Det står at du kan gjøre dette ... Her er det overraskende - det finnes ikke noe "Abonnements-ID"-felt noe sted som kan krysses av.

Christina Monti fra PayPal svarte:

> Beklager frustrasjonene som forårsakes av at disse trinnene var feil. Vi fikser det denne uken.

Sri Shivananda (teknologidirektør) takket oss:

> Takk for din fortsatte hjelp med å gjøre oss bedre. Setter stor pris på det.

**Resultat**: Dokumentasjonen ble aldri rettet. Endepunktet for abonnementsoppføringen ble aldri opprettet.

## Utvikleropplevelsens mareritt {#the-developer-experience-nightmare}

Å jobbe med PayPals API-er er som å reise 10 år tilbake i tid. Her er de tekniske problemene vi har dokumentert:

### Brukergrensesnittet er ødelagt {#broken-user-interface}

PayPals utviklerdashbord er en katastrofe. Her er hva vi håndterer daglig:

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal sitt brukergrensesnitt er så ødelagt at du ikke engang kan avvise varsler
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Nettleseren din støtter ikke videotaggen.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Utviklerdashbordet lar deg bokstavelig talt dra en glidebryter og logger deg deretter ut etter 60 sekunder
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Nettleseren din støtter ikke videotaggen.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Flere UI-katastrofer i PayPal-utviklergrensesnittet som viser ødelagte arbeidsflyter
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Nettleseren din støtter ikke videotaggen.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Grensesnittet for abonnementsadministrasjon – grensesnittet er så dårlig at vi måtte stole på kode for å generere produkter og abonnementsplaner
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
En oversikt over det ødelagte abonnementsgrensesnittet med manglende funksjonalitet (du kan ikke enkelt opprette produkter/planer/abonnementer – og det ser ikke ut til å være noen måte å slette produkter eller planer når de først er opprettet i brukergrensesnittet)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typiske PayPal-feilmeldinger – kryptiske og lite nyttige
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problemer {#sdk-problems}

* Kan ikke håndtere både engangsbetalinger og abonnementer uten komplekse løsninger som involverer bytte og gjengivelse av knapper på nytt mens SDK-en lastes inn på nytt med skriptkoder
* JavaScript SDK bryter med grunnleggende konvensjoner (små klassenavn, ingen instanskontroll)
* Feilmeldinger indikerer ikke hvilke felt som mangler
* Inkonsistente datatyper (krever strengmengder i stedet for tall)

### Brudd på sikkerhetspolicyer for innhold {#content-security-policy-violations}

SDK-en deres krever unsafe-inline og unsafe-eval i CSP-en din, **noe som tvinger deg til å kompromittere nettstedets sikkerhet**.

### Dokumentasjonskaos {#documentation-chaos}

Mark Stuart selv innrømmet:

> Enig i at det finnes en absurd mengde eldre og nye API-er. Veldig vanskelig å finne det man skal se etter (selv for oss som jobber her).

### Sikkerhetsproblemer {#security-vulnerabilities}

**PayPals 2FA-implementering er baklengs.** Selv med TOTP-apper aktivert, tvinger de frem SMS-verifisering – noe som gjør kontoer sårbare for SIM-bytteangrep. Hvis du har TOTP aktivert, bør den bruke utelukkende det. Alternativet bør være e-post, ikke SMS.

### Katastrofe ved økthåndtering {#session-management-disaster}

**Utviklerdashbordet deres logger deg ut etter 60 sekunder med inaktivitet.** Hvis du prøver å gjøre noe produktivt, må du stadig gå gjennom: logg inn → captcha → 2FA → logg ut → gjenta. Bruker du VPN? Lykke til.

## Juli 2025: Dråpen som får dråpen til å renne over {#july-2025-the-final-straw}

Etter 11 år med de samme problemene kom bristepunktet under en rutinemessig kontooverføring. Vi måtte gå over til en ny PayPal-konto som samsvarte med firmanavnet vårt «Forward Email LLC» for å få en renere regnskapsføring.

Det som skulle vært enkelt, ble til en fullstendig katastrofe:

* Innledende testing viste at alt fungerte som det skulle
* Timer senere blokkerte PayPal plutselig alle abonnementsbetalinger uten varsel
* Kunder kunne ikke betale, noe som skapte forvirring og belastning på kundestøtten
* PayPal-kundestøtten ga motstridende svar som hevdet at kontoene var bekreftet
* Vi ble tvunget til å stanse PayPal-betalinger fullstendig

<figure>
<figcaption><div class="alert alert-danger small text-center">
Feilen kundene så da de prøvde å betale - ingen forklaring, ingen logger, ingenting
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
PayPal-kundestøtte hevdet at alt var i orden, mens betalingene var fullstendig ødelagte. Den siste meldingen viser at de sier at de har «gjenopprettet noen funksjoner», men fortsatt ber om mer uspesifisert informasjon - klassisk PayPal-støtteteater
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
Identitetsverifiseringsprosessen som visstnok ikke «fikset» noe
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
Vag melding og fortsatt ingen løsning. Ingen informasjon, varsler eller noe om hvilken tilleggsinformasjon som kreves. Kundesupporten er stille.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Hvorfor vi ikke bare kan droppe PayPal {#why-we-cant-just-drop-paypal}

Til tross for alle disse problemene kan vi ikke helt forlate PayPal, fordi noen kunder bare har PayPal som betalingsalternativ. Som en kunde sa på vår [statusside](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal er mitt eneste betalingsalternativ

**Vi har stått fast med å støtte en ødelagt plattform fordi PayPal har skapt et betalingsmonopol for visse brukere.**

## Løsningen for fellesskapet {#the-community-workaround}

Siden PayPal ikke tilbyr grunnleggende funksjonalitet for abonnementsoppføring, har utviklerfellesskapet laget løsninger. Vi har laget et skript som hjelper med å administrere PayPal-abonnementer: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dette skriptet refererer til en [fellesskapskjerne](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) der utviklere deler løsninger. Brukere er faktisk [takker oss](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) for å ha levert det PayPal burde ha bygget for mange år siden.

## Blokkerer PayPal-maler på grunn av phishing {#blocking-paypal-templates-due-to-phishing}

Problemene går utover API-er. PayPals e-postmaler er så dårlig utformet at vi måtte implementere spesifikk filtrering i e-posttjenesten vår fordi de ikke kan skilles fra phishing-forsøk.

### Det virkelige problemet: PayPals maler ser ut som svindel {#the-real-problem-paypals-templates-look-like-scams}

Vi mottar jevnlig rapporter om PayPal-e-poster som ser ut akkurat som phishing-forsøk. Her er et faktisk eksempel fra våre misbruksrapporter:

**Emne:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Denne e-posten ble videresendt til `abuse@microsoft.com` fordi det så ut til å være et phishing-forsøk. Problemet? Den kom faktisk fra PayPals sandkassemiljø, men maldesignet deres er så dårlig at det utløser phishing-deteksjonssystemer.

### Vår implementering {#our-implementation}

Du kan se vår PayPal-spesifikke filtrering implementert i [e-postfiltreringskode](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

Vi implementerte dette fordi PayPal nektet å fikse massive spam-/nettfiske-/svindelproblemer til tross for gjentatte rapporter til misbruksteamene deres. De spesifikke e-posttypene vi blokkerer inkluderer:

* **RT000238** - Mistenkelige fakturavarsler
* **PPC001017** - Problematiske betalingsbekreftelser
* **RT000542** - Forsøk på hacking av gavemeldinger

### Omfanget av problemet {#the-scale-of-the-problem}

Våre spamfiltreringslogger viser den enorme mengden PayPal-fakturaspam vi behandler daglig. Eksempler på blokkerte emner inkluderer:

* "Faktura fra PayPals faktureringsteam: – Denne belastningen vil bli automatisk belastet kontoen din. Ta kontakt med oss umiddelbart på \[TELEFON]"
* "Faktura fra \[FIRMANAVN] (\[BESTILLINGS-ID])"
* Flere varianter med forskjellige telefonnumre og falske bestillings-ID-er

Disse e-postene kommer ofte fra `outlook.com`-verter, men ser ut til å stamme fra PayPals legitime systemer, noe som gjør dem spesielt farlige. E-postene passerer SPF-, DKIM- og DMARC-autentisering fordi de sendes gjennom PayPals faktiske infrastruktur.

Våre tekniske logger viser at disse spam-e-postene inneholder legitime PayPal-overskrifter:

* `X-Email-Type-Id: RT000238` (samme ID som vi blokkerer)
* `From: "service@paypal.com" <service@paypal.com>`
* Gyldige DKIM-signaturer fra `paypal.com`
* Riktige SPF-oppføringer som viser PayPals e-postservere

Dette skaper en umulig situasjon: legitime PayPal-e-poster og spam har begge identiske tekniske egenskaper.

### Ironien {#the-irony}

PayPal, et selskap som burde lede an i kampen mot økonomisk svindel, har e-postmaler som er så dårlig utformet at de utløser anti-phishing-systemer. Vi er tvunget til å blokkere legitime PayPal-e-poster fordi de ikke kan skilles fra svindel.

Dette er dokumentert i sikkerhetsforskning: [Vær oppmerksom på PayPals nye adressesvindel](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – som viser hvordan PayPals egne systemer utnyttes til svindel.

### Virkelig innvirkning: Nye PayPal-svindelforsøk {#real-world-impact-novel-paypal-scams}

Problemet strekker seg utover bare dårlig maldesign. PayPals fakturasystem er så lett å utnytte at svindlere regelmessig misbruker det til å sende falske fakturaer som ser legitime ut. Sikkerhetsforsker Gavin Anderegg dokumenterte [En ny PayPal-svindel](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) der svindlere sender ekte PayPal-fakturaer som består alle autentiseringskontroller:

> «Da jeg undersøkte kilden, så det ut som om e-posten faktisk kom fra PayPal (SPF, DKIM og DMARC bestod alle). Knappen lenket også til det som så ut som en legitim PayPal-URL ... Det tok et sekund før jeg gikk opp for at det var en legitim e-post. Jeg hadde nettopp fått tilsendt en tilfeldig «faktura» fra en svindler.»

<figure>
<figcaption><div class="alert alert-danger small text-center">
Skjermbilde som viser flere falske PayPal-fakturaer som oversvømmer en innboks, alle ser ut til å være legitime fordi de faktisk kommer fra PayPals systemer
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Forskeren bemerket:

> «Det virker også som en praktisk funksjon som PayPal burde vurdere å låse ned. Jeg antok umiddelbart at dette var en form for svindel og var bare interessert i de tekniske detaljene. Det virker altfor enkelt å få til, og jeg er bekymret for at andre kan falle for det.»

Dette illustrerer problemet perfekt: PayPals egne legitime systemer er så dårlig utformet at de muliggjør svindel samtidig som de får legitim kommunikasjon til å virke mistenkelig.

For å gjøre vondt verre påvirket dette leveransen vår med Yahoo, noe som resulterte i kundeklager og timevis med grundig testing og mønstersjekk.

## PayPals bakoverrettede KYC-prosess {#paypals-backwards-kyc-process}

Et av de mest frustrerende aspektene ved PayPals plattform er deres bakvendte tilnærming til samsvar og KYC-prosedyrer (Know Your Customer). I motsetning til alle andre betalingsbehandlere lar PayPal utviklere integrere API-ene deres og begynne å samle inn betalinger i produksjon før de fullfører riktig verifisering.

### Slik skal det fungere {#how-it-should-work}

Alle legitime betalingsbehandlere følger denne logiske rekkefølgen:

1. **Fullfør KYC-verifisering først**
2. **Godkjenn selgerkontoen**
3. **Gi tilgang til produksjons-API**
4. **Tillat betalingsinnkreving**

Dette beskytter både betalingsbehandleren og selgeren ved å sikre samsvar før penger bytter hender.

### Slik fungerer PayPal egentlig {#how-paypal-actually-works}

PayPals prosess er fullstendig bakvendt:

1. **Gi tilgang til produksjons-API umiddelbart**
2. **Tillat betalingsinnkreving i timer eller dager**
3. **Blokker plutselig betalinger uten varsel**
4. **Krev KYC-dokumentasjon etter at kunder allerede er berørt**
5. **Ikke gi varsel til selgeren**
6. **La kundene oppdage problemet og rapportere det**

### Virkelighetens innvirkning {#the-real-world-impact}

Denne baklengsgående prosessen skaper katastrofer for bedrifter:

* **Kunder kan ikke fullføre kjøp** i perioder med høy salgsrate
* **Ingen forhåndsvarsel** om at bekreftelse er nødvendig
* **Ingen e-postvarsler** når betalinger blokkeres
* **Forhandlere får vite om problemer fra forvirrede kunder**
* **Tap av inntekter** i kritiske forretningsperioder
* **Skade på kundenes tillit** når betalinger på mystisk vis mislykkes

### Kontooverføringskatastrofen i juli 2025 {#the-july-2025-account-migration-disaster}

Dette nøyaktige scenariet utspilte seg under vår rutinemessige kontooverføring i juli 2025. PayPal tillot betalinger i utgangspunktet, men blokkerte dem plutselig uten varsel. Vi oppdaget problemet først da kunder begynte å rapportere at de ikke kunne betale.

Da vi kontaktet kundestøtte, fikk vi motstridende svar om hvilken dokumentasjon som var nødvendig, uten en klar tidslinje for løsning. Dette tvang oss til å stanse PayPal-betalinger fullstendig, noe som forvirret kunder som ikke hadde andre betalingsalternativer.

### Hvorfor dette er viktig {#why-this-matters}

PayPals tilnærming til samsvar viser en fundamental misforståelse av hvordan bedrifter opererer. Riktig KYC bør skje **før** produksjonsintegrasjon, ikke etter at kundene allerede prøver å betale. Mangelen på proaktiv kommunikasjon når problemer oppstår, demonstrerer PayPals frakobling fra selgernes behov.

Denne baklengsgående prosessen er symptomatisk for PayPals bredere organisatoriske problemer: de prioriterer sine interne prosesser fremfor selger- og kundeopplevelse, noe som fører til den typen driftskatastrofer som driver bedrifter bort fra plattformen deres.

## Hvordan alle andre betalingsbehandlere gjør det riktig {#how-every-other-payment-processor-does-it-right}

Funksjonaliteten for abonnementsoppføring som PayPal nekter å implementere har vært standard i bransjen i over et tiår. Slik håndterer andre betalingsbehandlere dette grunnleggende kravet:

### Stripe {#stripe}

Stripe har hatt abonnementslister siden API-et deres ble lansert. Dokumentasjonen deres viser tydelig hvordan man henter alle abonnementer for en kunde- eller selgerkonto. Dette regnes som grunnleggende CRUD-funksjonalitet.

### Padle {#paddle}

Paddle tilbyr omfattende API-er for abonnementsadministrasjon, inkludert oppføring, filtrering og paginering. De forstår at selgere trenger å se sine gjentakende inntektsstrømmer.

### Coinbase Commerce {#coinbase-commerce}

Selv kryptovalutabetalingsbehandlere som Coinbase Commerce tilbyr bedre abonnementsadministrasjon enn PayPal.

### Kvadrat {#square}

Squares API inkluderer abonnementsoppføring som en grunnleggende funksjon, ikke en ettertanke.

### Bransjestandarden {#the-industry-standard}

Alle moderne betalingsbehandlere tilbyr:

* List opp alle abonnementer
* Filtrer etter status, dato, kunde
* Paginering for store datasett
* Webhook-varsler for abonnementsendringer
* Omfattende dokumentasjon med fungerende eksempler

### Hva andre betalingstjenester tilbyr sammenlignet med PayPal {#what-other-processors-provide-vs-paypal}

**Stripe – List opp alle abonnementer:**

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

**PayPal – Hva du faktisk får:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**PayPals tilgjengelige endepunkter:**

* `POST /v1/billing/subscriptions` - Opprett et abonnement
* `GET /v1/billing/subscriptions/{id}` - Skaff deg ETT abonnement (hvis du vet ID-en)
* `PATCH /v1/billing/subscriptions/{id}` - Oppdater et abonnement
* `POST /v1/billing/subscriptions/{id}/cancel` - Avbryt abonnementet
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspender abonnementet

**Hva mangler fra PayPal:**

* ❌ Ingen `GET /v1/billing/subscriptions` (liste alle)
* ❌ Ingen søkefunksjonalitet
* ❌ Ingen filtrering etter status, kunde, dato
* ❌ Ingen støtte for paginering

PayPal er den eneste store betalingsbehandleren som tvinger utviklere til å spore abonnements-ID-er manuelt i sine egne databaser.

## PayPals systematiske tildekking: Demper 6 millioner stemmer {#paypals-systematic-cover-up-silencing-6-million-voices}

I et trekk som perfekt innkapsler PayPals tilnærming til håndtering av kritikk, tok de nylig hele forumet sitt offline, og stilnet effektivt over 6 millioner medlemmer og slettet hundretusenvis av innlegg som dokumenterte feilene deres.

### Den store utslettelsen {#the-great-erasure}

Det opprinnelige PayPal-fellesskapet på `paypal-community.com` hadde **6 003 558 medlemmer** og inneholdt hundretusenvis av innlegg, feilrapporter, klager og diskusjoner om PayPals API-feil. Dette representerte over et tiår med dokumenterte bevis på PayPals systematiske problemer.

30. juni 2025 tok PayPal i stillhet hele forumet offline. Alle `paypal-community.com`-lenker returnerer nå 404-feil. Dette var ikke en migrering eller oppgradering.

### Tredjepartsredning {#the-third-party-rescue}

Heldigvis har en tredjepartstjeneste på [ppl.lithium.com](https://ppl.lithium.com/) bevart noe av innholdet, slik at vi har tilgang til diskusjonene som PayPal prøvde å skjule. Denne tredjepartsbevaringen er imidlertid ufullstendig og kan forsvinne når som helst.

Dette mønsteret med å skjule bevis er ikke nytt for PayPal. De har en dokumentert historie med:

* Fjerne kritiske feilrapporter fra offentligheten
* Avvikle utviklerverktøy uten varsel
* Endre API-er uten skikkelig dokumentasjon
* Dempe diskusjoner i fellesskapet om feilene deres

Fjerningen av forumet representerer det mest frekke forsøket hittil på å skjule deres systematiske feil fra offentlighetens gransking.

## Den 11 år lange katastrofen med Capture Bug: 1899 dollar og det kommer snart {#the-11-year-capture-bug-disaster-1899-and-counting}

Mens PayPal var travelt opptatt med å organisere tilbakemeldingsmøter og komme med løfter, har kjernesystemet deres for betalingsbehandling vært fundamentalt ødelagt i over 11 år. Bevisene er knusende.

### Videresendt e-post med tap på 1899 dollar {#forward-emails-1899-loss}

I produksjonssystemene våre oppdaget vi 108 PayPal-betalinger på til sammen **1899 dollar** som gikk tapt på grunn av PayPals feil med betalingen. Disse betalingene viser et gjennomgående mønster:

* `CHECKOUT.ORDER.APPROVED` webhooks ble mottatt
* PayPals API for registrering returnerte 404-feil
* Bestillinger ble utilgjengelige via PayPals API

Det er umulig å avgjøre om kunder ble belastet, siden PayPal skjuler feilsøkingslogger fullstendig etter 14 dager og sletter alle data fra dashbordet for bestillings-ID-er som ikke ble registrert.

Dette representerer bare én bedrift. **De samlede tapene på tvers av tusenvis av selgere over 11 år utgjør sannsynligvis millioner av dollar.**

**Vi gjentar det: de samlede tapene på tvers av tusenvis av selgere over 11 år utgjør sannsynligvis millioner av dollar.**

Den eneste grunnen til at vi oppdaget dette er fordi vi er utrolig nøyaktige og datadrevne.

### Den opprinnelige rapporten fra 2013: Over 11 år med uaktsomhet {#the-2013-original-report-11-years-of-negligence}

Den tidligste dokumenterte rapporten om akkurat dette problemet finnes på [Stack Overflow i november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([arkivert](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Får stadig 404-feilmelding med Rest API når jeg utfører en opptak"

Feilen som ble rapportert i 2013 er **identisk** med det som opplevdes i Videresendt e-post i 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Samfunnets respons i 2013 var talende:

> "Det er rapportert et problem med REST API for øyeblikket. PayPal jobber med det."

**11+ år senere, jobber de fortsatt med det.**

### Innrømmelsen i 2016: PayPal bryter med sin egen SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

I 2016 dokumenterte PayPals eget GitHub-repository at [massive fangstfeil](https://github.com/paypal/PayPal-PHP-SDK/issues/660) påvirket deres offisielle PHP SDK. Omfanget var svimlende:

> "Siden 20.09.2016 har alle PayPal-innhentingsforsøk mislyktes med 'INVALID_RESOURCE_ID - Forespurt ressurs-ID ble ikke funnet.'. Ingenting ble endret mellom 19.09 og 20.09 i API-integrasjonen. **100 % av innhentingsforsøkene siden 20.09 har returnert denne feilen.**"

En kjøpmann rapporterte:

> "Jeg har hatt **over 1400 mislykkede forsøk på å fange opp data de siste 24 timene**, alle med feilsvaret INVALID_RESOURCE_ID."

PayPals første reaksjon var å legge skylden på selgeren og henvise dem til teknisk støtte. Først etter massivt press innrømmet de feil:

> «Jeg har en oppdatering fra produktutviklerne våre. De legger merke til at PayPal-forespørsels-ID-en sendes med 42 tegn i overskriftene, men **det ser ut til at det nylig har skjedd en endring som begrenser denne ID-en til bare 38 tegn.**»

Denne innrømmelsen avslører PayPals systematiske uaktsomhet:

1. **De gjorde udokumenterte endringer som ikke var effektive**
2. **De ødela sitt eget offisielle SDK**
3. **De skyldte først på selgere**
4. **De innrømmet bare feil under press**

Selv etter å ha «fikset» problemet, rapporterte selgerne:

> "Oppgraderte SDK-en til v1.7.4, og **problemet oppstår fortsatt.**"

### Eskaleringen i 2024: Fortsatt ødelagt {#the-2024-escalation-still-broken}

Nylige rapporter fra det bevarte PayPal-fellesskapet viser at problemet faktisk har blitt verre. En [Diskusjon i september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([arkivert](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumenterer nøyaktig de samme problemene:

> "Problemet begynte først å dukke opp for rundt to uker siden og påvirker ikke alle bestillinger. **Det mye vanligere problemet ser ut til å være 404-feil ved registrering.**"

Selgeren beskriver det samme mønsteret som Videresend e-post opplevde:

> "Etter å ha forsøkt å registrere bestillingen, returnerer PayPal en 404-feil. Ved henting av bestillingsdetaljer: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dette er uten spor av vellykket registrering fra vår side.**"

### Webhooks pålitelighetskatastrofe {#the-webhook-reliability-disaster}

En annen [bevart samfunnsdiskusjon](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) avslører at PayPals webhook-system er fundamentalt upålitelig:

> "Teoretisk sett burde den ha to hendelser (CHECKOUT.ORDER.APPROVED og PAYMENT.CAPTURE.COMPLETED) fra Webhook-hendelsen. Faktisk blir disse to hendelsene sjelden mottatt umiddelbart. PAYMENT.CAPTURE.COMPLETED kan vanligvis ikke mottas, eller vil bli mottatt i løpet av noen få timer."

For abonnementsbetalinger:

> "**'BETALING.SALG.FULLFØRT' ble ikke mottatt noen ganger eller før om noen få timer.**"

Selgerens spørsmål avslører omfanget av PayPals pålitelighetsproblemer:

1. **"Hvorfor skjer dette?"** - PayPals webhook-system er fundamentalt ødelagt
2. **"Hvis ordrestatusen er 'FULLFØRT', kan jeg anta at jeg har mottatt pengene?"** - Selgere kan ikke stole på PayPals API-svar
3. **"Hvorfor finner ikke 'Hendelseslogger->Webhook-hendelser' noen logger?"** - Selv PayPals eget loggføringssystem fungerer ikke

### Mønsteret av systematisk uaktsomhet {#the-pattern-of-systematic-negligence}

Bevisene strekker seg over 11+ år og viser et tydelig mønster:

* **2013**: «PayPal jobber med det»
* **2016**: PayPal innrømmer at endringen har gått galt, og tilbyr en feilretting
* **2024**: De samme feilene oppstår fortsatt, og påvirker videresendt e-post og utallige andre.

Dette er ikke en feil – **dette er systematisk uaktsomhet.** PayPal har visst om disse kritiske feilene i betalingsbehandlingen i over et tiår og har konsekvent:

1. **Skyldte selgere for PayPals feil**
2. **Gjorde udokumenterte endringer som ikke fungerte**
3. **Ga utilstrekkelige rettelser som ikke fungerer**
4. **Ignorerte den økonomiske virkningen på bedrifter**
5. **Skjult bevis ved å ta ned fellesskapsforum**

### Det udokumenterte kravet {#the-undocumented-requirement}

Ingen steder i PayPals offisielle dokumentasjon nevner de at selgere må implementere logikk for nye forsøk for innsamlingsoperasjoner. Dokumentasjonen deres sier at selgere skal "innsamle umiddelbart etter godkjenning", men nevner ikke at API-et deres returnerer tilfeldig 404-feil som krever komplekse mekanismer for nye forsøk.

Dette tvinger alle selgere til å:

* Implementer eksponentiell tilbakekallingslogikk for nye forsøk
* Håndter inkonsekvent webhook-levering
* Bygg komplekse tilstandsstyringssystemer
* Overvåk manuelt for mislykkede registreringer

**Alle andre betalingsbehandlere tilbyr pålitelige API-er for innsamling som fungerer første gang.**

## PayPals bredere mønster av bedrag {#paypals-broader-pattern-of-deception}

Feilkatastrofen med opptaksfeilen er bare ett eksempel på PayPals systematiske tilnærming til å lure kunder og skjule feilene deres.

### Tiltak fra New York Department of Financial Services {#the-new-york-department-of-financial-services-action}

I januar 2025 utstedte New York Department of Financial Services en [håndhevingstiltak mot PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) for villedende praksis, noe som viser at PayPals bedragerimønster strekker seg langt utover API-ene deres.

Dette regulatoriske tiltaket viser PayPals vilje til å bruke villedende praksis i hele virksomheten, ikke bare i utviklerverktøyene sine.

### Søksmålet om honning: Omskriving av affiliatelenker {#the-honey-lawsuit-rewriting-affiliate-links}

PayPals oppkjøp av Honey har ført til at [søksmål som påstår at Honey omskriver affiliate-lenker](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer) stjeler provisjoner fra innholdsskapere og influencere. Dette representerer en annen form for systematisk bedrag der PayPal tjener penger på å omdirigere inntekter som burde gått til andre.

Mønsteret er tydelig:

1. **API-feil**: Skjul ødelagt funksjonalitet, skyld på selgere
2. **Stilling av fellesskapet**: Fjern bevis på problemer
3. **Brudd på regelverk**: Delta i villedende praksis
4. **Tyveri av tilknyttede selskaper**: Stjel provisjoner gjennom teknisk manipulasjon

### Kostnaden for PayPals uaktsomhet {#the-cost-of-paypals-negligence}

Tapet på 1899 dollar for videresendt e-post representerer bare toppen av isfjellet. Tenk på den bredere effekten:

* **Enkeltkunder**: Tusenvis taper hundrevis til tusenvis av dollar hver
* **Bedriftskunder**: Potensielt millioner i tapte inntekter
* **Utviklertid**: Utallige timer med å bygge løsninger for PayPals ødelagte API-er
* **Kundetillit**: Bedrifter mister kunder på grunn av PayPals betalingsfeil

Hvis én liten e-posttjeneste tapte nesten 2000 dollar, og dette problemet har eksistert i over 11 år og rammet tusenvis av selgere, vil den samlede økonomiske skaden sannsynligvis beløpe seg til **hundrevis av millioner dollar**.

### Dokumentasjonsløgnen {#the-documentation-lie}

PayPals offisielle dokumentasjon nevner konsekvent ikke de kritiske begrensningene og feilene som selgere vil støte på. For eksempel:

* **Capture API**: Ingen omtale av at 404-feil er vanlige og krever logikk for nye forsøk
* **Webhook-pålitelighet**: Ingen omtale av at webhooks ofte er forsinket med timer
* **Abonnementsliste**: Dokumentasjonen antyder at liste er mulig når det ikke finnes noe endepunkt
* **Økttidsavbrudd**: Ingen omtale av aggressive 60-sekunders tidsavbrudd

Denne systematiske utelatelsen av kritisk informasjon tvinger selgere til å oppdage PayPals begrensninger gjennom prøving og feiling i produksjonssystemer, noe som ofte resulterer i økonomiske tap.

## Hva dette betyr for utviklere {#what-this-means-for-developers}

PayPals systematiske unnlatelse av å imøtekomme grunnleggende utviklerbehov samtidig som de samler inn omfattende tilbakemeldinger, viser et grunnleggende organisatorisk problem. De behandler innsamling av tilbakemeldinger som en erstatning for å faktisk fikse problemer.

Mønsteret er tydelig:

1. Utviklere rapporterer problemer
2. PayPal organiserer tilbakemeldingsmøter med ledere
3. Omfattende tilbakemeldinger gis
4. Team erkjenner mangler og lover å "spore og adressere"
5. Ingenting blir implementert
6. Ledere slutter hos bedre selskaper
7. Nye team ber om den samme tilbakemeldingen
8. Syklusgjentakelser

I mellomtiden blir utviklere tvunget til å bygge løsninger, kompromittere sikkerheten og håndtere ødelagte brukergrensesnitt bare for å godta betalinger.

Hvis du bygger et betalingssystem, lær av vår erfaring: bygg din [trifecta-tilnærming](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) med flere prosessorer, men ikke forvent at PayPal gir deg den grunnleggende funksjonaliteten du trenger. Planlegg å bygge løsninger fra dag én.

> Dette innlegget dokumenterer vår 11-årige erfaring med PayPals API-er for videresending av e-post. Alle kodeeksempler og lenker er fra våre faktiske produksjonssystemer. Vi fortsetter å støtte PayPal-betalinger til tross for disse problemene fordi noen kunder ikke har noe annet alternativ.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />