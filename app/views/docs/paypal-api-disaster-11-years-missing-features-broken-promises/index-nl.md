# PayPal's 11-jarige API-ramp: hoe we oplossingen bouwden terwijl zij ontwikkelaars negeerden {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Bij Forward Email hebben we al meer dan tien jaar te maken met de defecte API's van PayPal. Wat begon met kleine frustraties, is uitgegroeid tot een complete ramp die ons dwong om onze eigen oplossingen te ontwikkelen, hun phishingsjablonen te blokkeren en uiteindelijk alle PayPal-betalingen stop te zetten tijdens een kritieke accountmigratie.</p>
<p class="lead mt-3">Dit is het verhaal van 11 jaar waarin PayPal de basisbehoeften van ontwikkelaars negeerde, terwijl wij er alles aan deden om hun platform werkend te krijgen.</p>

## Inhoudsopgave {#table-of-contents}

* [Het ontbrekende stukje: geen manier om abonnementen te vermelden](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Het probleem komt naar voren](#2014-2017-the-problem-emerges)
* [2020: We geven ze uitgebreide feedback](#2020-we-give-them-extensive-feedback)
  * [De feedbacklijst met 27 items](#the-27-item-feedback-list)
  * [Teams raakten betrokken, er werden beloftes gedaan](#teams-got-involved-promises-were-made)
  * [Het resultaat? Niets.](#the-result-nothing)
* [De exodus van de directie: hoe PayPal al haar institutionele geheugen kwijtraakte](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nieuw leiderschap, dezelfde problemen](#2025-new-leadership-same-problems)
  * [De nieuwe CEO raakt betrokken](#the-new-ceo-gets-involved)
  * [De reactie van Michelle Gill](#michelle-gills-response)
  * [Onze reactie: geen vergaderingen meer](#our-response-no-more-meetings)
  * [Marty Brodbecks overengineering-reactie](#marty-brodbecks-overengineering-response)
  * [De "Simple CRUD"-tegenstelling](#the-simple-crud-contradiction)
  * [De kloof wordt duidelijk](#the-disconnect-becomes-clear)
* [Jarenlange bugmeldingen die ze negeerden](#years-of-bug-reports-they-ignored)
  * [2016: Vroege klachten over UI/UX](#2016-early-uiux-complaints)
  * [2021: Bugrapport voor zakelijke e-mails](#2021-business-email-bug-report)
  * [2021: Suggesties voor verbetering van de gebruikersinterface](#2021-ui-improvement-suggestions)
  * [2021: Sandbox-omgevingsfouten](#2021-sandbox-environment-failures)
  * [2021: Rapportagesysteem volledig kapot](#2021-reports-system-completely-broken)
  * [2022: Kern API-functie ontbreekt (opnieuw)](#2022-core-api-feature-missing-again)
* [De nachtmerrie van de ontwikkelaarservaring](#the-developer-experience-nightmare)
  * [Kapotte gebruikersinterface](#broken-user-interface)
  * [SDK-problemen](#sdk-problems)
  * [Schendingen van het inhoudsbeveiligingsbeleid](#content-security-policy-violations)
  * [Documentatiechaos](#documentation-chaos)
  * [Beveiligingsproblemen](#security-vulnerabilities)
  * [Sessiebeheerramp](#session-management-disaster)
* [Juli 2025: De druppel](#july-2025-the-final-straw)
* [Waarom we PayPal niet zomaar kunnen laten vallen](#why-we-cant-just-drop-paypal)
* [De community-oplossing](#the-community-workaround)
* [PayPal-sjablonen blokkeren vanwege phishing](#blocking-paypal-templates-due-to-phishing)
  * [Het echte probleem: PayPal-sjablonen lijken op oplichting](#the-real-problem-paypals-templates-look-like-scams)
  * [Onze implementatie](#our-implementation)
  * [Waarom we PayPal moesten blokkeren](#why-we-had-to-block-paypal)
  * [De omvang van het probleem](#the-scale-of-the-problem)
  * [De ironie](#the-irony)
  * [Impact in de echte wereld: nieuwe PayPal-zwendels](#real-world-impact-novel-paypal-scams)
* [Het omgekeerde KYC-proces van PayPal](#paypals-backwards-kyc-process)
  * [Hoe het zou moeten werken](#how-it-should-work)
  * [Hoe PayPal eigenlijk werkt](#how-paypal-actually-works)
  * [De impact in de echte wereld](#the-real-world-impact)
  * [De ramp met de accountmigratie in juli 2025](#the-july-2025-account-migration-disaster)
  * [Waarom dit belangrijk is](#why-this-matters)
* [Hoe elke andere betalingsverwerker het goed doet](#how-every-other-payment-processor-does-it-right)
  * [Streep](#stripe)
  * [Peddelen](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Vierkant](#square)
  * [De industriestandaard](#the-industry-standard)
  * [Wat andere processors bieden vs PayPal](#what-other-processors-provide-vs-paypal)
* [De systematische doofpotaffaire van PayPal: 6 miljoen stemmen het zwijgen opgelegd](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [De Grote Uitwissing](#the-great-erasure)
  * [De reddingsactie van derden](#the-third-party-rescue)
* [De 11 jaar durende bugvangstramp: $ 1.899 en meer](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Verlies van $ 1.899 voor Forward Email](#forward-emails-1899-loss)
  * [Het originele rapport uit 2013: meer dan 11 jaar nalatigheid](#the-2013-original-report-11-years-of-negligence)
  * [De toelating van 2016: PayPal breekt met hun eigen SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [De escalatie van 2024: nog steeds kapot](#the-2024-escalation-still-broken)
  * [De ramp met de betrouwbaarheid van webhooks](#the-webhook-reliability-disaster)
  * [Het patroon van systematische nalatigheid](#the-pattern-of-systematic-negligence)
  * [De ongedocumenteerde eis](#the-undocumented-requirement)
* [Het bredere patroon van misleiding van PayPal](#paypals-broader-pattern-of-deception)
  * [Actie van het New York Department of Financial Services](#the-new-york-department-of-financial-services-action)
  * [De honingrechtszaak: het herschrijven van affiliate links](#the-honey-lawsuit-rewriting-affiliate-links)
  * [De kosten van de nalatigheid van PayPal](#the-cost-of-paypals-negligence)
  * [De documentatieleugen](#the-documentation-lie)
* [Wat dit betekent voor ontwikkelaars](#what-this-means-for-developers)

## Het ontbrekende stukje: geen manier om abonnementen te vermelden {#the-missing-piece-no-way-to-list-subscriptions}

Wat ons verbaast is dit: PayPal biedt al sinds 2014 abonnementsfacturering aan, maar heeft nooit een manier geboden aan verkopers om hun eigen abonnementen te vermelden.

Denk daar eens even over na. Je kunt abonnementen aanmaken en annuleren als je de ID hebt, maar je kunt geen lijst met alle actieve abonnementen voor je account opvragen. Het is alsof je een database hebt zonder SELECT-instructie.

Dit hebben we nodig voor de basisbedrijfsvoering:

* Klantenservice (wanneer iemand een e-mail stuurt met een vraag over zijn/haar abonnement)
* Financiële rapportage en afstemming
* Geautomatiseerd factureringsbeheer
* Naleving en auditing

Maar PayPal? Ze hebben het gewoon nooit gebouwd.

## 2014-2017: Het probleem duikt op {#2014-2017-the-problem-emerges}

Het probleem met de abonnementenlijst verscheen voor het eerst in 2017 in de communityforums van PayPal. Ontwikkelaars stelden toen de voor de hand liggende vraag: "Hoe krijg ik een lijst met al mijn abonnementen?"

De reactie van PayPal? Krekels.

De leden van de gemeenschap raakten gefrustreerd:

> "Een zeer vreemde omissie als een handelaar niet alle actieve overeenkomsten kan weergeven. Als de overeenkomst-ID verloren gaat, betekent dit dat alleen de gebruiker een overeenkomst kan annuleren of opschorten." - leafspider

> "+1. Het is bijna 3 jaar geleden." - laudukang (wat betekent dat het probleem al sinds 2014 bestaat)

De [originele communitypost](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) uit 2017 laat zien dat ontwikkelaars smeken om deze basisfunctionaliteit. PayPal reageerde hierop door de repository te archiveren waar mensen het probleem meldden.

## 2020: We geven ze uitgebreide feedback {#2020-we-give-them-extensive-feedback}

In oktober 2020 nam PayPal contact met ons op voor een formele feedbacksessie. Dit was geen informeel gesprek: ze organiseerden een Microsoft Teams-gesprek van 45 minuten met acht leidinggevenden van PayPal, waaronder Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze en anderen.

### De feedbacklijst met 27 items {#the-27-item-feedback-list}

We kwamen voorbereid. Na 6 uur proberen te integreren met hun API's, hadden we 27 specifieke problemen ontdekt. Mark Stuart van het PayPal Checkout-team zei:

> Hé Nick, bedankt dat je dit vandaag met iedereen hebt gedeeld! Ik denk dat dit de katalysator zal zijn voor meer steun en investeringen voor ons team om deze problemen op te lossen. Het is moeilijk geweest om tot nu toe zoveel waardevolle feedback te krijgen als jij ons hebt gegeven.

De feedback was niet theoretisch van aard, maar kwam van echte integratiepogingen:

1. **Generatie van toegangstoken werkt niet**:

Het genereren van toegangstokens werkt niet. Bovendien zouden er meer dan alleen cURL-voorbeelden moeten zijn.

2. **Geen webinterface voor het aanmaken van abonnementen**:

Hoe kun je in vredesnaam abonnementen aanmaken zonder dat je cURL hoeft te gebruiken? Er lijkt geen webinterface te zijn om dit te doen (zoals Stripe die wel heeft).

Mark Stuart vond het probleem met de toegangstokens bijzonder zorgwekkend:

> We horen doorgaans geen problemen met het genereren van toegangstokens.

### Teams raakten betrokken, er werden beloftes gedaan {#teams-got-involved-promises-were-made}

Naarmate we meer problemen ontdekten, voegde PayPal steeds meer teams toe aan het gesprek. Darshan Raju van het UI-team voor abonnementenbeheer kwam erbij en zei:

> Erken de kloof. We zullen dit volgen en aanpakken. Nogmaals bedankt voor je feedback!

De sessie werd beschreven als een streven naar:

> openhartige wandeling door uw ervaring

naar:

> PayPal maken tot wat het hoort te zijn voor ontwikkelaars.

### Het resultaat? Niets. {#the-result-nothing}

Ondanks de formele feedbacksessie, de uitgebreide lijst met 27 items, de betrokkenheid van meerdere teams en de beloften om:

> volgen en adresseren

problemen, er is absoluut niets opgelost.

## De exodus van leidinggevenden: hoe PayPal al zijn institutionele geheugen kwijtraakte {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Hier wordt het echt interessant. Iedereen die onze feedback uit 2020 heeft ontvangen, heeft PayPal verlaten:

**Leiderschapsveranderingen:**

* [Dan Schulman (CEO gedurende 9 jaar) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO die feedback organiseerde) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januari 2024)

**Technische leiders die beloftes deden en vervolgens vertrokken:**

* **Mark Stuart** (beloofde feedback zou "katalysator" zijn) → [Nu bij Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 jaar PayPal-veteraan) → [CEO van MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Gepensioneerd](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (een van de laatst overgeblevenen) → [Net vertrokken naar Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januari 2025)

PayPal is een draaideur geworden waar leidinggevenden feedback van ontwikkelaars verzamelen, beloftes doen en vervolgens vertrekken naar betere bedrijven als JPMorgan, Ripple en andere fintechbedrijven.

Dit verklaart waarom de reactie op het GitHub-probleem uit 2025 totaal los lijkt te staan van onze feedback uit 2020: letterlijk iedereen die die feedback heeft ontvangen, heeft PayPal verlaten.

## 2025: Nieuw leiderschap, dezelfde problemen {#2025-new-leadership-same-problems}

Spoel door naar 2025 en zie precies hetzelfde patroon. Na jaren van gebrek aan vooruitgang neemt de nieuwe leiding van PayPal opnieuw contact op.

### De nieuwe CEO raakt betrokken {#the-new-ceo-gets-involved}

Op 30 juni 2025 hebben we het probleem rechtstreeks aan Alex Chriss, de nieuwe CEO van PayPal, gemeld. Zijn reactie was kort:

> Hoi Nick, bedankt voor je reactie en je feedback. Michelle (in cc) staat klaar om samen met haar team dit probleem aan te pakken en samen met jou te bespreken. Bedankt -A

### Reactie van Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP en General Manager van Small Business and Financial Services, antwoordde:

> Hartelijk dank Nick, ik verplaats Alex naar bcc. We hebben hiernaar gekeken sinds je eerdere bericht. We bellen je nog voor het einde van de week. Kun je me je contactgegevens sturen zodat een van mijn collega's contact met je kan opnemen? Michelle

### Ons antwoord: geen vergaderingen meer {#our-response-no-more-meetings}

We weigerden een nieuwe afspraak en legden onze frustraties uit:

> Dank je wel. Maar ik heb niet het gevoel dat een gesprek iets uithaalt. Dit is waarom... Ik heb in het verleden een gesprek gehad en het leidde absoluut tot niets. Ik verspilde meer dan 2 uur van mijn tijd aan gesprekken met het hele team en de leiding en er werd niets gedaan... Talloze e-mails heen en weer. Absoluut niets gedaan. Feedback leverde niets op. Ik heb het jarenlang geprobeerd, er werd naar me geluisterd, en toen liep het op niets uit.

### Marty Brodbeck's overengineering-reactie {#marty-brodbecks-overengineering-response}

Toen nam Marty Brodbeck, hoofd consumententechniek bij PayPal, contact met ons op:

> Hallo Nick, dit is Marty Brodbeck. Ik ben hoofd consumententechnologie hier bij PayPal en ben verantwoordelijk voor de API-ontwikkeling voor het bedrijf. Kunnen jij en ik contact opnemen over het probleem waar je tegenaan loopt en hoe we je hierbij kunnen helpen?

Toen we de simpele noodzaak van een eindpunt voor abonnementsvermeldingen uitlegden, onthulde zijn antwoord het exacte probleem:

> Bedankt Nick, we zijn bezig met het creëren van één enkele abonnement-API met een volledige SDK (ondersteunt volledige foutverwerking, gebeurtenisgebaseerde abonnementstracking en robuuste uptime). Ook wordt de facturering opgesplitst in een aparte API waar verkopers naartoe kunnen gaan, in plaats van dat ze alles via meerdere eindpunten moeten regelen om één antwoord te krijgen.

Dit is precies de verkeerde aanpak. We hebben geen maandenlange complexe architectuur nodig. We hebben één eenvoudig REST-eindpunt nodig dat abonnementen weergeeft – iets dat al sinds 2014 zou moeten bestaan.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### De "Simpele CRUD"-tegenstelling {#the-simple-crud-contradiction}

Toen wij erop wezen dat dit basisfunctionaliteit voor CRUD betrof die al sinds 2014 had moeten bestaan, was Marty's reactie veelzeggend:

> Eenvoudige Crud-bewerkingen maken deel uit van de kern-API, mijn vriend, dus het zal geen maanden aan ontwikkeling kosten

De PayPal TypeScript SDK, die op dit moment na maandenlange ontwikkeling slechts drie eindpunten ondersteunt, laat samen met de historische tijdlijn duidelijk zien dat dergelijke projecten meer dan een paar maanden nodig hebben om te voltooien.

Dit antwoord laat zien dat hij zijn eigen API niet begrijpt. Als "eenvoudige CRUD-bewerkingen deel uitmaken van de kern-API", waar is dan het eindpunt voor abonnementslijsten? Wij antwoordden:

Als 'eenvoudige CRUD-bewerkingen deel uitmaken van de kern-API', waar is dan het eindpunt voor abonnementslijsten? Ontwikkelaars vragen al sinds 2014 om deze 'eenvoudige CRUD-bewerking'. Dat is al 11 jaar zo. Elke andere betalingsverwerker beschikt al vanaf dag één over deze basisfunctionaliteit.

### De verbinding wordt verbroken {#the-disconnect-becomes-clear}

De uitwisselingen met Alex Chriss, Michelle Gill en Marty Brodbeck uit 2025 laten dezelfde organisatorische disfunctie zien:

1. **Nieuwe leidinggevenden hebben geen kennis van eerdere feedbacksessies**
2. **Ze stellen dezelfde overontwikkelde oplossingen voor**
3. **Ze begrijpen hun eigen API-beperkingen niet**
4. **Ze willen meer vergaderingen in plaats van alleen het probleem op te lossen**

Dit patroon verklaart waarom PayPal-teams in 2025 totaal niet verbonden lijken te zijn met de uitgebreide feedback uit 2020. De mensen die die feedback ontvingen, zijn verdwenen en de nieuwe leiding herhaalt dezelfde fouten.

## Jarenlange bugmeldingen die ze negeerden {#years-of-bug-reports-they-ignored}

We hebben niet alleen geklaagd over ontbrekende functies. We hebben actief bugs gemeld en geprobeerd deze te verbeteren. Hier is een uitgebreide tijdlijn van de problemen die we hebben gedocumenteerd:

### 2016: Vroege UI/UX-klachten {#2016-early-uiux-complaints}

Zelfs in 2016 namen we publiekelijk contact op met de leiding van PayPal, waaronder Dan Schulman, over interface- en bruikbaarheidsproblemen. Dit was negen jaar geleden, en dezelfde UI/UX-problemen bestaan nog steeds.

### 2021: Bugrapport voor zakelijke e-mail {#2021-business-email-bug-report}

In maart 2021 meldden we dat het zakelijke e-mailsysteem van PayPal onjuiste annuleringsmeldingen verstuurde. De e-mailsjabloon bevatte onjuist weergegeven variabelen, waardoor klanten verwarrende berichten te zien kregen.

Mark Stuart erkende het probleem:

> Bedankt Nick! Ik ga naar BCC. @Prasy, is jouw team verantwoordelijk voor deze e-mail of weet je wie dat is? De zin "Niftylettuce, LLC, we factureren u niet meer" doet me vermoeden dat er iets mis is met de geadresseerde en de inhoud van de e-mail.

**Resultaat**: Ze hebben dit probleem daadwerkelijk opgelost! Mark Stuart bevestigde:

> Ik heb net van het notificatieteam gehoord dat de e-mailsjabloon is gerepareerd en uitgerold. Fijn dat je contact met ons hebt opgenomen om dit te melden. Dank je wel!

Dit laat zien dat ze dingen WEL kunnen repareren als ze dat willen. In de meeste gevallen kiezen ze er alleen voor om dat niet te doen.

### 2021: Suggesties voor verbetering van de gebruikersinterface {#2021-ui-improvement-suggestions}

In februari 2021 gaven we gedetailleerde feedback over de gebruikersinterface van hun dashboard, met name het gedeelte 'Recente PayPal-activiteit':

> Ik denk dat het dashboard op paypal.com, met name "Recente PayPal-activiteit", verbeterd moet worden. Ik denk niet dat je de statusregels "Aangemaakt" van de terugkerende betaling van $0 moet weergeven - het voegt alleen maar een hoop extra regels toe en je kunt niet in één oogopslag zien hoeveel inkomsten er de afgelopen dag/dagen zijn gegenereerd.

Mark Stuart stuurde het door naar het team consumentenproducten:

> Bedankt! Ik weet niet zeker welk team verantwoordelijk is voor Activity, maar ik heb het doorgestuurd naar het hoofd consumentenproducten om het juiste team te vinden. Een terugkerende betaling van $ 0,00 lijkt een bug. Zou er waarschijnlijk uit gefilterd moeten worden.

**Resultaat**: Nooit opgelost. De gebruikersinterface toont nog steeds deze nutteloze $0-items.

### 2021: Sandbox-omgevingsfouten {#2021-sandbox-environment-failures}

In november 2021 meldden we kritieke problemen met de sandboxomgeving van PayPal:

* Geheime API-sleutels van de sandbox zijn willekeurig gewijzigd en uitgeschakeld
* Alle sandbox-testaccounts zijn zonder voorafgaande kennisgeving verwijderd
* Foutmeldingen bij het bekijken van sandbox-accountgegevens
* Af en toe mislukt het laden

Om een of andere reden werd mijn geheime API-sleutel voor de sandbox gewijzigd en uitgeschakeld. Ook werden al mijn oude sandbox-testaccounts verwijderd.

Soms laden ze wel en soms niet. Dit is waanzinnig frustrerend.

**Resultaat**: Geen reactie, geen oplossing. Ontwikkelaars ondervinden nog steeds problemen met de betrouwbaarheid van de sandbox.

### 2021: Rapportensysteem volledig kapot {#2021-reports-system-completely-broken}

In mei 2021 meldden we dat het downloadsysteem van PayPal voor transactierapporten volledig kapot was:

Het lijkt erop dat het melden van downloads momenteel niet werkt en dat al de hele dag niet. Je zou waarschijnlijk ook een e-mailmelding moeten krijgen als het mislukt.

We wezen ook op de ramp met het sessiebeheer:

> Ook als je 5 minuten inactief bent terwijl je ingelogd bent bij PayPal, word je uitgelogd. Dus als je de knop naast het rapport waarvan je de status wilt controleren opnieuw vernieuwt (nadat je eindeloos hebt gewacht), is het jammer dat je weer opnieuw moet inloggen.

Mark Stuart erkende het probleem met de sessie-time-out:

> Ik kan me herinneren dat je in het verleden hebt gemeld dat je sessie vaak verliep en dat je ontwikkelproces werd verstoord als je schakelde tussen je IDE en developer.paypal.com of je merchant dashboard. Als je dan terugkwam en weer werd uitgelogd,

**Resultaat**: Sessietime-outs duren nog steeds 60 seconden. Het rapportsysteem faalt nog steeds regelmatig.

### 2022: Kern API-functie ontbreekt (opnieuw) {#2022-core-api-feature-missing-again}

In januari 2022 hebben we het probleem met de abonnementsvermeldingen opnieuw aangekaart, ditmaal met nog meer details over hoe hun documentatie onjuist was:

> Er is geen GET die alle abonnementen weergeeft (voorheen factureringsovereenkomsten genoemd)

We ontdekten dat hun officiële documentatie volkomen onjuist was:

> De API-documentatie klopt ook totaal niet. We dachten dat we een tijdelijke oplossing konden vinden door een hardgecodeerde lijst met abonnements-ID's te downloaden. Maar zelfs dat werkt niet!

> Uit de officiële documentatie hier... Daar staat dat je dit kunt doen... En dit is het probleem: er is nergens een veld "Abonnement-ID" te vinden dat kan worden aangevinkt.

Christina Monti van PayPal antwoordde:

Onze excuses voor de frustraties die zijn ontstaan doordat deze stappen verkeerd waren. We zullen dit deze week oplossen.

Sri Shivananda (CTO) bedankte ons:

> Bedankt voor je voortdurende hulp om ons te verbeteren. Ik waardeer het enorm.

**Resultaat**: De documentatie is nooit hersteld. Het eindpunt voor de abonnementslijst is nooit aangemaakt.

## De nachtmerrie voor ontwikkelaars {#the-developer-experience-nightmare}

Werken met de API's van PayPal is alsof je tien jaar terug in de tijd gaat. Dit zijn de technische problemen die we hebben gedocumenteerd:

### Kapotte gebruikersinterface {#broken-user-interface}

Het PayPal-ontwikkelaarsdashboard is een ramp. Dit is waar we dagelijks mee te maken hebben:

<figure>
<figcaption><div class="alert alert-danger small text-center">
De gebruikersinterface van PayPal is zo kapot dat je zelfs meldingen niet kunt negeren.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Je browser ondersteunt de videotag niet.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Het ontwikkelaarsdashboard laat je letterlijk een schuifregelaar verslepen en logt je na 60 seconden uit.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Je browser ondersteunt de videotag niet.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Meer UI-rampen in de PayPal-ontwikkelaarsinterface die kapotte workflows laten zien
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Uw browser ondersteunt de videotag niet.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
De interface voor abonnementsbeheer - de interface is zo slecht dat we op code moesten vertrouwen om producten en abonnementen te genereren.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Een weergave van de defecte abonnementsinterface met ontbrekende functionaliteit (je kunt niet eenvoudig producten/abonnementen/abonnementen aanmaken – en er lijkt helemaal geen manier te zijn om producten of abonnementen te verwijderen nadat ze in de gebruikersinterface zijn aangemaakt).
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typische PayPal-foutmeldingen - cryptisch en nutteloos
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK-problemen {#sdk-problems}

* Kan zowel eenmalige betalingen als abonnementen niet verwerken zonder complexe oplossingen, zoals het omwisselen en opnieuw renderen van knoppen tijdens het opnieuw laden van de SDK met scripttags.
* JavaScript SDK schendt basisconventies (kleine letters klassenamen, geen instantiecontrole).
* Foutmeldingen geven niet aan welke velden ontbreken.
* Inconsistente gegevenstypen (tekenreeksbedragen vereist in plaats van getallen).

### Schendingen van het inhoudsbeveiligingsbeleid {#content-security-policy-violations}

Hun SDK vereist unsafe-inline en unsafe-eval in uw CSP, **waardoor u de beveiliging van uw site in gevaar kunt brengen**.

### Documentatiechaos {#documentation-chaos}

Mark Stuart gaf zelf toe:

> Akkoord dat er een absurde hoeveelheid oude en nieuwe API's is. Het is echt lastig om te vinden waar je naar moet zoeken (zelfs voor ons die hier werken).

### Beveiligingsproblemen {#security-vulnerabilities}

**De 2FA-implementatie van PayPal is achterhaald**. Zelfs met TOTP-apps ingeschakeld, dwingen ze sms-verificatie af, waardoor accounts kwetsbaar zijn voor simkaart-swap-aanvallen. Als je TOTP hebt ingeschakeld, zou dit exclusief via sms moeten gebeuren. De terugvaloptie zou e-mail moeten zijn, niet sms.

### Sessiebeheerramp {#session-management-disaster}

**Hun ontwikkelaarsdashboard logt je uit na 60 seconden inactiviteit.** Probeer iets productiefs te doen en je herhaalt constant: inloggen → captcha → 2FA → uitloggen → herhalen. Gebruik je een VPN? Succes.

## Juli 2025: De druppel {#july-2025-the-final-straw}

Na 11 jaar met dezelfde problemen kwam het breekpunt tijdens een routinematige accountmigratie. We moesten overstappen naar een nieuw PayPal-account dat overeenkwam met onze bedrijfsnaam "Forward Email LLC" voor een overzichtelijkere boekhouding.

Wat eenvoudig had moeten zijn, veranderde in een complete ramp:

* De eerste tests lieten zien dat alles correct werkte
* Uren later blokkeerde PayPal plotseling alle abonnementsbetalingen zonder voorafgaande kennisgeving
* Klanten konden niet betalen, wat leidde tot verwarring en een zware ondersteuningslast
* De PayPal-ondersteuning gaf tegenstrijdige antwoorden en beweerde dat accounts geverifieerd waren
* We waren gedwongen PayPal-betalingen volledig stop te zetten

<figure>
<figcaption><div class="alert alert-danger small text-center">
De fout die klanten zagen toen ze probeerden te betalen: geen uitleg, geen logs, niets
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
De ondersteuning van PayPal beweerde dat alles in orde was, terwijl de betalingen volledig mislukten. In het laatste bericht staat dat ze "enkele functies hebben hersteld", maar dat ze nog steeds om meer, niet-gespecificeerde informatie vragen - klassiek PayPal-ondersteuningstheater.
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
Het identiteitsverificatieproces dat zogenaamd niets "oploste"
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
Vage melding en nog steeds geen oplossing. Geen informatie, meldingen of wat dan ook over welke aanvullende informatie nodig is. De klantenservice blijft stil.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Waarom we PayPal niet zomaar kunnen laten vallen {#why-we-cant-just-drop-paypal}

Ondanks al deze problemen kunnen we PayPal niet helemaal afschaffen, omdat sommige klanten PayPal alleen als betaaloptie hebben. Zoals een klant op onze [statuspagina](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) zei:

> PayPal is mijn enige optie voor betaling

**We moeten een kapot platform blijven ondersteunen, omdat PayPal een betalingsmonopolie heeft gecreëerd voor bepaalde gebruikers.**

## De community-oplossing {#the-community-workaround}

Omdat PayPal geen basisfunctionaliteit voor het weergeven van abonnementen biedt, heeft de ontwikkelaarscommunity een oplossing bedacht. We hebben een script gemaakt dat helpt bij het beheren van PayPal-abonnementen: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dit script verwijst naar een [gemeenschapsgist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) waar ontwikkelaars oplossingen delen. Gebruikers zijn eigenlijk [ons bedanken](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) omdat ze leveren wat PayPal jaren geleden al had moeten bouwen.

## PayPal-sjablonen blokkeren vanwege phishing {#blocking-paypal-templates-due-to-phishing}

De problemen gaan verder dan API's. De e-mailsjablonen van PayPal zijn zo slecht ontworpen dat we specifieke filters in onze e-mailservice moesten implementeren, omdat ze niet te onderscheiden zijn van phishingpogingen.

### Het echte probleem: PayPal-sjablonen lijken op oplichting {#the-real-problem-paypals-templates-look-like-scams}

We ontvangen regelmatig meldingen van PayPal-e-mails die sprekend lijken op phishingpogingen. Hier is een concreet voorbeeld uit onze misbruikrapporten:

**Onderwerp:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Deze e-mail werd doorgestuurd naar `abuse@microsoft.com` omdat het een phishingpoging leek te zijn. Het probleem? De e-mail kwam eigenlijk uit de sandboxomgeving van PayPal, maar hun templateontwerp is zo slecht dat het phishingdetectiesystemen activeert.

### Onze implementatie {#our-implementation}

U kunt onze PayPal-specifieke filtering geïmplementeerd zien in onze [e-mailfiltercode](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

### Waarom we PayPal moesten blokkeren {#why-we-had-to-block-paypal}

We hebben dit geïmplementeerd omdat PayPal weigerde de enorme spam-/phishing-/fraudeproblemen op te lossen, ondanks onze herhaalde meldingen aan hun misbruikteams. De specifieke e-mailtypen die we blokkeren, zijn onder andere:

* **RT000238** - Meldingen van verdachte facturen
* **PPC001017** - Problematische betalingsbevestigingen
* **RT000542** - Pogingen tot hacken van cadeauberichten

### De omvang van het probleem {#the-scale-of-the-problem}

Onze spamfilterlogs tonen de enorme hoeveelheid PayPal-factuurspam die we dagelijks verwerken. Voorbeelden van geblokkeerde onderwerpen zijn:

* "Factuur van het PayPal-factureringsteam: - Deze kosten worden automatisch van uw rekening afgeschreven. Neem direct contact met ons op via \[TELEFOONNUMMER]"
* "Factuur van \[BEDRIJFSNAAM] (\[ORDER-ID])"
* Meerdere variaties met verschillende telefoonnummers en valse order-ID's

Deze e-mails komen vaak van `outlook.com` hosts, maar lijken afkomstig te zijn van de legitieme systemen van PayPal, waardoor ze bijzonder gevaarlijk zijn. De e-mails voldoen aan SPF-, DKIM- en DMARC-authenticatie omdat ze via de infrastructuur van PayPal worden verzonden.

Uit onze technische logs blijkt dat deze spam-e-mails legitieme PayPal-headers bevatten:

* `X-Email-Type-Id: RT000238` (dezelfde ID die we blokkeren)
* `From: "service@paypal.com" <service@paypal.com>`
* Geldige DKIM-handtekeningen van `paypal.com`
* Correcte SPF-records die de mailservers van PayPal weergeven

Hierdoor ontstaat een onmogelijke situatie: legitieme PayPal-e-mails en spam hebben beide identieke technische kenmerken.

### De ironie {#the-irony}

PayPal, een bedrijf dat de strijd tegen financiële fraude zou moeten leiden, heeft e-mailsjablonen die zo slecht zijn ontworpen dat ze antiphishingsystemen activeren. We zijn gedwongen om legitieme PayPal-e-mails te blokkeren omdat ze niet te onderscheiden zijn van oplichting.

Dit is gedocumenteerd in beveiligingsonderzoek: [Pas op voor fraude met het nieuwe adres van PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - laat zien hoe PayPal's eigen systemen worden misbruikt voor fraude.

### Impact in de echte wereld: nieuwe PayPal-zwendels {#real-world-impact-novel-paypal-scams}

Het probleem gaat verder dan alleen een slecht templateontwerp. PayPals factuursysteem is zo gemakkelijk te misbruiken dat oplichters het regelmatig misbruiken om legitiem ogende frauduleuze facturen te versturen. Beveiligingsonderzoeker Gavin Anderegg documenteerde [Een nieuwe PayPal-zwendel](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), waarbij oplichters echte PayPal-facturen versturen die alle authenticatiecontroles doorstaan:

> "Toen ik de bron inspecteerde, leek de e-mail daadwerkelijk van PayPal afkomstig te zijn (SPF, DKIM en DMARC waren allemaal goedgekeurd). De knop verwees ook naar wat een legitieme PayPal-URL leek... Het duurde even voordat ik besefte dat het een legitieme e-mail was. Ik had net een willekeurige 'factuur' van een oplichter ontvangen."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Screenshot van meerdere frauduleuze PayPal-facturen die een inbox overspoelen. Ze lijken allemaal legitiem, omdat ze in werkelijkheid afkomstig zijn van de systemen van PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

De onderzoeker merkte op:

> "Het lijkt me ook een handige functie die PayPal zou moeten overwegen te blokkeren. Ik ging er meteen van uit dat dit een vorm van oplichting was en was alleen geïnteresseerd in de technische details. Het lijkt veel te makkelijk om uit te voeren, en ik vrees dat anderen erin trappen."

Dit illustreert het probleem perfect: de legitieme systemen van PayPal zijn zo slecht ontworpen dat ze fraude mogelijk maken en tegelijkertijd legitieme communicatie verdacht laten lijken.

Om het nog erger te maken, had dit gevolgen voor onze leverbaarheid bij Yahoo, wat resulteerde in klachten van klanten en urenlang nauwkeurig testen en patrooncontroles.

## PayPal's achterwaartse KYC-proces {#paypals-backwards-kyc-process}

Een van de meest frustrerende aspecten van PayPal's platform is hun achterhaalde aanpak van compliance en Know Your Customer (KYC)-procedures. In tegenstelling tot andere betalingsverwerkers stelt PayPal ontwikkelaars in staat om hun API's te integreren en betalingen in productie te innen voordat de verificatie is voltooid.

### Hoe het zou moeten werken {#how-it-should-work}

Elke legitieme betalingsverwerker volgt deze logische volgorde:

1. **Voltooi eerst de KYC-verificatie**
2. **Keur het verkopersaccount goed**
3. **Bied toegang tot de productie-API**
4. **Sta incasso toe**

Hiermee worden zowel de betalingsverwerker als de handelaar beschermd, doordat naleving van de regels wordt gegarandeerd voordat er geld van eigenaar wisselt.

### Hoe PayPal eigenlijk werkt {#how-paypal-actually-works}

Het proces bij PayPal is compleet andersom:

1. **Direct toegang tot de productie-API verlenen**
2. **Incasso van betalingen toestaan voor uren of dagen**
3. **Betalingen plotseling blokkeren zonder voorafgaande kennisgeving**
4. **KYC-documentatie opvragen nadat klanten al getroffen zijn**
5. **De verkoper geen melding sturen**
6. **Klanten het probleem laten ontdekken en melden**

### De impact in de echte wereld {#the-real-world-impact}

Dit omgekeerde proces veroorzaakt rampen voor bedrijven:

* **Klanten kunnen hun aankopen niet afronden** tijdens piekperiodes
* **Geen voorafgaande waarschuwing** dat verificatie nodig is
* **Geen e-mailmeldingen** wanneer betalingen worden geblokkeerd
* **Verkopers krijgen problemen van verwarde klanten**
* **Omzetverlies** tijdens kritieke periodes
* **Schade aan het vertrouwen van klanten** wanneer betalingen op mysterieuze wijze mislukken

### De accountmigratieramp van juli 2025 {#the-july-2025-account-migration-disaster}

Dit scenario speelde zich af tijdens onze routinematige accountmigratie in juli 2025. PayPal stond betalingen aanvankelijk toe, maar blokkeerde ze plotseling zonder enige kennisgeving. We ontdekten het probleem pas toen klanten begonnen te melden dat ze niet konden betalen.

Toen we contact opnamen met de support, kregen we tegenstrijdige antwoorden over welke documentatie nodig was, zonder een duidelijke tijdlijn voor een oplossing. Dit dwong ons om PayPal-betalingen volledig stop te zetten, wat tot verwarring leidde bij klanten die geen andere betaalmogelijkheden hadden.

### Waarom dit belangrijk is {#why-this-matters}

PayPal's aanpak van compliance getuigt van een fundamenteel misverstand over hoe bedrijven opereren. Goede KYC zou **vóór** de productie-integratie moeten plaatsvinden, niet nadat klanten al proberen te betalen. Het gebrek aan proactieve communicatie wanneer er problemen ontstaan, toont aan dat PayPal zich niet kan vinden in de behoeften van verkopers.

Dit omgekeerde proces is symptomatisch voor de bredere organisatorische problemen van PayPal: ze geven prioriteit aan hun interne processen boven de ervaring van verkopers en klanten, wat leidt tot operationele rampen waardoor bedrijven weggaan van hun platform.

## Hoe elke andere betalingsverwerker het goed doet {#how-every-other-payment-processor-does-it-right}

De functionaliteit voor abonnementslijsten die PayPal weigert te implementeren, is al meer dan tien jaar standaard in de branche. Zo gaan andere betalingsverwerkers om met deze basisvereiste:

### Streep {#stripe}

Stripe biedt abonnementen aan sinds de lancering van hun API. Hun documentatie laat duidelijk zien hoe je alle abonnementen voor een klant- of handelaarsaccount kunt ophalen. Dit wordt beschouwd als basisfunctionaliteit voor CRUD.

### Peddel {#paddle}

Paddle biedt uitgebreide API's voor abonnementsbeheer, inclusief listings, filtering en paginering. Ze begrijpen dat handelaren inzicht moeten hebben in hun terugkerende inkomstenstromen.

### Coinbase Commerce {#coinbase-commerce}

Zelfs cryptovalutabetalingsverwerkers zoals Coinbase Commerce bieden beter abonnementbeheer dan PayPal.

### Vierkant {#square}

De API van Square biedt een basisfunctie voor abonnementsvermeldingen, en geen bijzaak.

### De industriestandaard {#the-industry-standard}

Elke moderne betalingsverwerker biedt:

* Alle abonnementen weergeven
* Filteren op status, datum en klant
* Paginering voor grote datasets
* Webhookmeldingen voor abonnementswijzigingen
* Uitgebreide documentatie met werkende voorbeelden

### Wat andere verwerkers bieden versus PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Bekijk alle abonnementen:**

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

**Stripe - Filter op klant:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filter op status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Wat u daadwerkelijk krijgt:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Beschikbare eindpunten van PayPal:**

* `POST /v1/billing/subscriptions` - Een abonnement aanmaken
* `GET /v1/billing/subscriptions/{id}` - ÉÉN abonnement afsluiten (als je de ID weet)
* `PATCH /v1/billing/subscriptions/{id}` - Een abonnement bijwerken
* `POST /v1/billing/subscriptions/{id}/cancel` - Abonnement opzeggen
* `POST /v1/billing/subscriptions/{id}/suspend` - Abonnement opschorten

**Wat ontbreekt er in PayPal:**

* ❌ Geen `GET /v1/billing/subscriptions` (alles weergeven)
* ❌ Geen zoekfunctionaliteit
* ❌ Geen filtering op status, klant, datum
* ❌ Geen ondersteuning voor paginering

PayPal is de enige grote betalingsverwerker die ontwikkelaars dwingt om abonnements-ID's handmatig bij te houden in hun eigen databases.

## De systematische doofpotaffaire van PayPal: het tot zwijgen brengen van 6 miljoen stemmen {#paypals-systematic-cover-up-silencing-6-million-voices}

In een stap die perfect illustreert hoe PayPal met kritiek omgaat, hebben ze onlangs hun volledige communityforum offline gehaald. Daarmee hebben ze ruim 6 miljoen leden het zwijgen opgelegd en honderdduizenden berichten waarin hun mislukkingen werden beschreven, verwijderd.

### De Grote Uitwissing {#the-great-erasure}

De oorspronkelijke PayPal-community op `paypal-community.com` telde **6.003.558 leden** en bevatte honderdduizenden berichten, bugmeldingen, klachten en discussies over de API-storingen van PayPal. Dit vertegenwoordigde meer dan tien jaar aan gedocumenteerd bewijs van de systematische problemen van PayPal.

Op 30 juni 2025 haalde PayPal in stilte het hele forum offline. Alle `paypal-community.com`-links geven nu een 404-foutmelding. Dit was geen migratie of upgrade.

### De reddingsactie van derden {#the-third-party-rescue}

Gelukkig heeft een externe service op [ppl.lithium.com](https://ppl.lithium.com/) een deel van de inhoud bewaard, waardoor we toegang hebben tot de discussies die PayPal probeerde te verbergen. Deze externe service is echter onvolledig en kan op elk moment verdwijnen.

Dit patroon van het verbergen van bewijsmateriaal is niet nieuw voor PayPal. Ze hebben een gedocumenteerde geschiedenis van:

* Kritieke bugrapporten verwijderen uit het publieke zicht
* Developer tools stopzetten zonder voorafgaande kennisgeving
* API's wijzigen zonder de juiste documentatie
* Discussies in de community over hun fouten de kop indrukken

Het offline halen van het forum is de meest schaamteloze poging tot nu toe om hun systematische mislukkingen te verbergen voor het publieke oog.

## De 11 jaar durende vangst-bug-ramp: $ 1.899 en meer {#the-11-year-capture-bug-disaster-1899-and-counting}

Terwijl PayPal druk bezig was met het organiseren van feedbacksessies en het doen van beloftes, is hun kernbetalingssysteem al meer dan elf jaar fundamenteel kapot. De bewijzen zijn vernietigend.

### Stuur e-mail door met verlies van $ 1.899 {#forward-emails-1899-loss}

In onze productiesystemen ontdekten we 108 PayPal-betalingen met een totaalbedrag van **$ 1.899** die verloren gingen door fouten bij het vastleggen van gegevens bij PayPal. Deze betalingen vertonen een consistent patroon:

* `CHECKOUT.ORDER.APPROVED` webhooks zijn ontvangen
* De capture API van PayPal gaf een 404-foutmelding
* Bestellingen waren niet meer toegankelijk via de API van PayPal

Het is onmogelijk om te bepalen of klanten kosten in rekening zijn gebracht, omdat PayPal debug-logs na 14 dagen volledig verbergt en alle gegevens van het dashboard wist voor order-ID's die niet zijn vastgelegd.

Dit vertegenwoordigt slechts één bedrijf. **De gezamenlijke verliezen van duizenden handelaren over een periode van meer dan 11 jaar bedragen waarschijnlijk miljoenen dollars.**

**We herhalen het nog maar eens: de gezamenlijke verliezen van duizenden handelaren over een periode van meer dan 11 jaar bedragen waarschijnlijk in totaal miljoenen dollars.**

De enige reden dat we dit ontdekten, is omdat we ongelooflijk nauwkeurig en datagestuurd te werk gaan.

### Het originele rapport uit 2013: 11+ jaar nalatigheid {#the-2013-original-report-11-years-of-negligence}

Het eerste gedocumenteerde rapport over dit exacte probleem staat op [Stack Overflow in november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([gearchiveerd](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Blijf 404-foutmelding ontvangen met REST API bij het vastleggen"

De fout die in 2013 werd gemeld, is **identiek** aan wat Forward Email in 2024 ondervond:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

De reactie van de gemeenschap in 2013 was veelzeggend:

> Er is momenteel een probleem gemeld met de REST API. PayPal werkt eraan.

**11+ jaar later zijn ze er nog steeds mee bezig.**

### De toelating van 2016: PayPal breekt met hun eigen SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

In 2016 documenteerde PayPal's eigen GitHub-repository dat [massale vangstmislukkingen](https://github.com/paypal/PayPal-PHP-SDK/issues/660) hun officiële PHP SDK beïnvloedde. De omvang was duizelingwekkend:

> "Sinds 20-9-2016 mislukken alle PayPal-incassopogingen met de foutmelding 'INVALID_RESOURCE_ID - Requested resource ID was not found'. Er is tussen 19 en 20 september niets gewijzigd aan de API-integratie. **100% van de incassopogingen sinds 20 september hebben deze foutmelding opgeleverd.**"

Een handelaar meldde:

> "Ik heb **meer dan 1.400 mislukte pogingen gedaan om gegevens vast te leggen in de afgelopen 24 uur**, allemaal met de foutmelding INVALID_RESOURCE_ID."

PayPal's eerste reactie was om de verkoper de schuld te geven en hem door te verwijzen naar de technische ondersteuning. Pas na enorme druk gaven ze toe dat ze de fout hadden gemaakt:

> "Ik heb een update van onze productontwikkelaars. Ze zien in de headers die worden verzonden dat de PayPal-aanvraag-ID wordt verzonden met 42 tekens, maar **er lijkt een recente wijziging te zijn doorgevoerd waardoor deze ID beperkt is tot slechts 38 tekens.**"

Deze bekentenis onthult de systematische nalatigheid van PayPal:

1. **Ze hebben ongedocumenteerde, ingrijpende wijzigingen aangebracht**
2. **Ze hebben hun eigen officiële SDK gekraakt**
3. **Ze gaven eerst de verkopers de schuld**
4. **Ze hebben pas onder druk schuld erkend**

Zelfs nadat het probleem was 'opgelost', meldden handelaren:

> "SDK geüpgraded naar v1.7.4 en **het probleem doet zich nog steeds voor.**"

### De escalatie van 2024: nog steeds kapot {#the-2024-escalation-still-broken}

Recente rapporten van de bewaard gebleven PayPal-community laten zien dat het probleem zelfs erger is geworden. Een [Discussie september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([gearchiveerd](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenteert exact dezelfde problemen:

> "Het probleem is pas ongeveer twee weken geleden ontstaan en heeft niet op alle bestellingen invloed. **Het meest voorkomende probleem lijkt 404-meldingen bij het vastleggen te zijn.**"

De handelaar beschrijft hetzelfde patroon dat Forward Email ervoer:

> "Nadat we de bestelling probeerden vast te leggen, geeft PayPal een 404-fout. Bij het ophalen van de details van de bestelling: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dit is zonder enig spoor van een succesvolle vastlegging aan onze kant.**"

### De webhook-betrouwbaarheidsramp {#the-webhook-reliability-disaster}

Een andere [bewaarde gemeenschapsdiscussie](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) laat zien dat PayPal's webhook-systeem fundamenteel onbetrouwbaar is:

> "Theoretisch gezien zou er twee gebeurtenissen (CHECKOUT.ORDER.APPROVED en PAYMENT.CAPTURE.COMPLETED) moeten zijn vanuit de webhookgebeurtenis. In werkelijkheid worden deze twee gebeurtenissen zelden direct ontvangen. PAYMENT.CAPTURE.COMPLETED kan meestal niet worden ontvangen, of pas na een paar uur."

Voor abonnementsbetalingen:

> "**'BETALING.VERKOOP.VOLTOOID' werd soms pas na een paar uur ontvangen.**"

De vragen van de verkoper laten zien hoe groot de betrouwbaarheidsproblemen van PayPal zijn:

1. **"Waarom gebeurt dit?"** - Het webhooksysteem van PayPal is fundamenteel defect.
2. **"Als de orderstatus 'VOLTOOID' is, mag ik er dan van uitgaan dat ik het geld heb ontvangen?"** - Verkopers kunnen de API-reacties van PayPal niet vertrouwen.
3. **"Waarom kan 'Gebeurtenislogboeken->Webhookgebeurtenissen' geen logs vinden?"** - Zelfs PayPal's eigen logsysteem werkt niet.

### Het patroon van systematische nalatigheid {#the-pattern-of-systematic-negligence}

Het bewijsmateriaal beslaat meer dan 11 jaar en laat een duidelijk patroon zien:

* **2013**: "PayPal werkt eraan"
* **2016**: PayPal geeft toe de wijziging te hebben doorbroken en biedt een defecte oplossing
* **2024**: Dezelfde fouten komen nog steeds voor, met gevolgen voor Forward Email en talloze andere

Dit is geen fout - **dit is systematische nalatigheid.** PayPal is al meer dan tien jaar op de hoogte van deze kritieke fouten in de betalingsverwerking en heeft consequent:

1. **Beschuldigde handelaren van PayPal-bugs**
2. **Niet-gedocumenteerde, ingrijpende wijzigingen aangebracht**
3. **Ontoereikende oplossingen aangedragen die niet werken**
4. **De financiële impact op bedrijven genegeerd**
5. **Bewijs verborgen door communityforums offline te halen**

### De ongedocumenteerde vereiste {#the-undocumented-requirement}

Nergens in de officiële documentatie van PayPal wordt vermeld dat verkopers retry-logica moeten implementeren voor capture-operaties. Hun documentatie stelt dat verkopers "direct na goedkeuring moeten capturen", maar vermeldt niet dat hun API willekeurig 404-fouten retourneert die complexe retry-mechanismen vereisen.

Dit dwingt elke handelaar om:

* Implementeer exponentiële backoff-herhalingslogica
* Verwerk inconsistente webhook-levering
* Bouw complexe statusbeheersystemen
* Controleer handmatig op mislukte vastleggingen

**Elke andere betalingsverwerker biedt betrouwbare API's die vanaf het begin werken.**

## PayPal's bredere patroon van misleiding {#paypals-broader-pattern-of-deception}

De capture bug-ramp is slechts één voorbeeld van PayPal's systematische aanpak om klanten te misleiden en hun fouten te verbergen.

### Het New York Department of Financial Services Actie {#the-new-york-department-of-financial-services-action}

In januari 2025 heeft het New York Department of Financial Services een rapport van [handhavingsactie tegen PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) uitgegeven voor misleidende praktijken, waaruit blijkt dat PayPal's patroon van misleiding veel verder reikt dan hun API's.

Deze regelgevende maatregel laat zien dat PayPal bereid is om misleidende praktijken toe te passen in hun gehele bedrijfsvoering, en niet alleen op het gebied van hulpmiddelen voor ontwikkelaars.

### De honingrechtszaak: het herschrijven van affiliate links {#the-honey-lawsuit-rewriting-affiliate-links}

De overname van Honey door PayPal heeft geresulteerd in [rechtszaken waarin wordt beweerd dat Honey affiliate-links herschrijft](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), waarmee commissies worden gestolen van contentmakers en influencers. Dit is een andere vorm van systematische misleiding, waarbij PayPal winst maakt door inkomsten die eigenlijk naar anderen zouden moeten gaan, om te leiden.

Het patroon is duidelijk:

1. **API-storingen**: Verberg defecte functionaliteit en geef verkopers de schuld
2. **Community de mond snoeren**: Verwijder bewijs van problemen
3. **Overtredingen van de regelgeving**: Deelname aan misleidende praktijken
4. **Diefstal van affiliates**: Commissies stelen door middel van technische manipulatie

### De kosten van de nalatigheid van PayPal {#the-cost-of-paypals-negligence}

Het verlies van $ 1.899 van Forward Email is slechts het topje van de ijsberg. Kijk eens naar de bredere impact:

* **Individuele handelaren**: Duizenden verliezen elk honderden tot duizenden dollars
* **Zakelijke klanten**: Potentieel miljoenen aan omzetverlies
* **Ontwikkelingstijd**: Talloze uren aan het ontwikkelen van oplossingen voor de defecte API's van PayPal
* **Klantvertrouwen**: Bedrijven verliezen klanten door de mislukte betalingen van PayPal

Stel dat één kleine e-mailservice bijna $ 2.000 verliest en dit probleem al meer dan 11 jaar bestaat en duizenden handelaren treft, dan bedraagt de totale financiële schade waarschijnlijk **honderden miljoenen dollars**.

### De documentatieleugen {#the-documentation-lie}

De officiële documentatie van PayPal vermeldt consequent niet de kritieke beperkingen en bugs waar verkopers mee te maken kunnen krijgen. Bijvoorbeeld:

* **Capture API**: Er wordt niet vermeld dat 404-fouten vaak voorkomen en logica voor opnieuw proberen vereisen.
* **Webhook-betrouwbaarheid**: Er wordt niet vermeld dat webhooks vaak uren vertraagd zijn.
* **Abonnementsvermelding**: Documentatie geeft aan dat vermelding mogelijk is wanneer er geen eindpunt bestaat.
* **Sessietime-outs**: Er wordt niet verwezen naar agressieve time-outs van 60 seconden.

Deze systematische omissie van belangrijke informatie dwingt handelaren om de beperkingen van PayPal te ontdekken door middel van trial-and-error in productiesystemen, wat vaak resulteert in financiële verliezen.

## Wat dit betekent voor ontwikkelaars {#what-this-means-for-developers}

PayPal's systematische falen om te voldoen aan de basisbehoeften van ontwikkelaars en tegelijkertijd uitgebreide feedback te verzamelen, wijst op een fundamenteel organisatorisch probleem. Ze beschouwen het verzamelen van feedback als een vervanging voor het daadwerkelijk oplossen van problemen.

Het patroon is duidelijk:

1. Ontwikkelaars melden problemen
2. PayPal organiseert feedbacksessies met leidinggevenden
3. Er wordt uitgebreide feedback gegeven
4. Teams erkennen hiaten en beloven deze te "volgen en aan te pakken"
5. Er wordt niets geïmplementeerd
6. Leidinggevenden vertrekken naar betere bedrijven
7. Nieuwe teams vragen om dezelfde feedback
8. De cyclus herhaalt zich

Ondertussen worden ontwikkelaars gedwongen om oplossingen te bedenken, de beveiliging in gevaar te brengen en te dealen met kapotte gebruikersinterfaces, alleen maar om betalingen te kunnen accepteren.

Als je een betalingssysteem bouwt, leer dan van onze ervaring: bouw je [trifecta-benadering](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) met meerdere processors, maar verwacht niet dat PayPal de basisfunctionaliteit biedt die je nodig hebt. Plan om vanaf dag één workarounds te bouwen.

Dit bericht documenteert onze 11-jarige ervaring met de API's van PayPal bij Forward Email. Alle codevoorbeelden en links zijn afkomstig van onze daadwerkelijke productiesystemen. We blijven PayPal-betalingen ondersteunen ondanks deze problemen, omdat sommige klanten geen andere optie hebben.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />