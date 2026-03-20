# PayPal's 11-jarige API-ramp: Hoe wij workarounds bouwden terwijl zij ontwikkelaars negeerden {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Succes! PayPal heeft eindelijk de `GET /v1/billing/subscriptions` endpoint toegevoegd.**
>
> Nadat we deze post publiceerden en naar de leiding van PayPal stuurden, implementeerden hun teams de langverwachte endpoint om abonnementen te kunnen opvragen. De wijziging verscheen ergens tussen [25 juni 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) en [9 juli 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Echter, in ware PayPal-stijl, hebben ze ons hier nooit over geïnformeerd. We ontdekten deze update pas zelf in december 2025, maanden nadat de functie stilletjes was uitgebracht.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Bij Forward Email hebben we al meer dan tien jaar te maken met de kapotte API's van PayPal. Wat begon als kleine frustraties, is uitgegroeid tot een complete ramp die ons dwong om onze eigen workarounds te bouwen, hun phishing-sjablonen te blokkeren en uiteindelijk alle PayPal-betalingen stop te zetten tijdens een kritieke accountmigratie.</p>
<p class="lead mt-3">Dit is het verhaal van 11 jaar waarin PayPal de basisbehoeften van ontwikkelaars negeerde terwijl wij alles probeerden om hun platform werkend te krijgen.</p>


## Inhoudsopgave {#table-of-contents}

* [Het ontbrekende stuk: geen manier om abonnementen op te vragen](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Het probleem doet zich voor](#2014-2017-the-problem-emerges)
* [2020: We geven uitgebreide feedback](#2020-we-give-them-extensive-feedback)
  * [De feedbacklijst van 27 punten](#the-27-item-feedback-list)
  * [Teams raakten betrokken, beloften werden gedaan](#teams-got-involved-promises-were-made)
  * [Het resultaat? Niets.](#the-result-nothing)
* [De executive-exodus: hoe PayPal alle institutionele kennis verloor](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nieuwe leiding, dezelfde problemen](#2025-new-leadership-same-problems)
  * [De nieuwe CEO raakt betrokken](#the-new-ceo-gets-involved)
  * [Michelle Gill's reactie](#michelle-gills-response)
  * [Onze reactie: geen vergaderingen meer](#our-response-no-more-meetings)
  * [Marty Brodbeck's overengineerde reactie](#marty-brodbecks-overengineering-response)
  * [De "simpele CRUD" tegenstrijdigheid](#the-simple-crud-contradiction)
  * [De disconnectie wordt duidelijk](#the-disconnect-becomes-clear)
* [Jarenlange bugrapporten die ze negeerden](#years-of-bug-reports-they-ignored)
  * [2016: Vroege UI/UX-klachten](#2016-early-uiux-complaints)
  * [2021: Bugrapport over zakelijke e-mail](#2021-business-email-bug-report)
  * [2021: Suggesties voor UI-verbeteringen](#2021-ui-improvement-suggestions)
  * [2021: Falen van sandbox-omgeving](#2021-sandbox-environment-failures)
  * [2021: Rapportagesysteem volledig kapot](#2021-reports-system-completely-broken)
  * [2022: Kern-API-functie ontbreekt (weer)](#2022-core-api-feature-missing-again)
* [De nachtmerrie van de ontwikkelaarservaring](#the-developer-experience-nightmare)
  * [Kapotte gebruikersinterface](#broken-user-interface)
  * [SDK-problemen](#sdk-problems)
  * [Content Security Policy-overtredingen](#content-security-policy-violations)
  * [Documentatiechaos](#documentation-chaos)
  * [Beveiligingslekken](#security-vulnerabilities)
  * [Rampzalig sessiebeheer](#session-management-disaster)
* [Juli 2025: De druppel](#july-2025-the-final-straw)
* [Waarom we PayPal niet zomaar kunnen laten vallen](#why-we-cant-just-drop-paypal)
* [De community-workaround](#the-community-workaround)
* [PayPal-sjablonen blokkeren vanwege phishing](#blocking-paypal-templates-due-to-phishing)
  * [Het echte probleem: PayPal-sjablonen lijken op scams](#the-real-problem-paypals-templates-look-like-scams)
  * [Onze implementatie](#our-implementation)
  * [Waarom we PayPal moesten blokkeren](#why-we-had-to-block-paypal)
  * [De omvang van het probleem](#the-scale-of-the-problem)
  * [De ironie](#the-irony)
  * [Impact in de praktijk: nieuwe PayPal-scams](#real-world-impact-novel-paypal-scams)
* [PayPal's omgekeerde KYC-proces](#paypals-backwards-kyc-process)
  * [Hoe het zou moeten werken](#how-it-should-work)
  * [Hoe PayPal het daadwerkelijk doet](#how-paypal-actually-works)
  * [De impact in de praktijk](#the-real-world-impact)
  * [De accountmigratieramp van juli 2025](#the-july-2025-account-migration-disaster)
  * [Waarom dit belangrijk is](#why-this-matters)
* [Hoe elke andere betalingsverwerker het goed doet](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [De industriestandaard](#the-industry-standard)
  * [Wat andere verwerkers bieden versus PayPal](#what-other-processors-provide-vs-paypal)
* [PayPal's systematische doofpot: het zwijgen van 6 miljoen stemmen](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [De grote uitwissing](#the-great-erasure)
  * [De redding door derden](#the-third-party-rescue)
* [De 11-jarige capture-bug ramp: $1.899 en het loopt door](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Forward Email's verlies van $1.899](#forward-emails-1899-loss)
  * [Het originele rapport uit 2013: 11+ jaar nalatigheid](#the-2013-original-report-11-years-of-negligence)
  * [De erkenning in 2016: PayPal breekt hun eigen SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [De escalatie in 2024: nog steeds kapot](#the-2024-escalation-still-broken)
  * [De webhook betrouwbaarheid-ramp](#the-webhook-reliability-disaster)
  * [Het patroon van systematische nalatigheid](#the-pattern-of-systematic-negligence)
  * [De ongedocumenteerde vereiste](#the-undocumented-requirement)
* [PayPal's bredere patroon van misleiding](#paypals-broader-pattern-of-deception)
  * [De actie van het New York Department of Financial Services](#the-new-york-department-of-financial-services-action)
  * [De Honey-rechtszaak: affiliate links herschrijven](#the-honey-lawsuit-rewriting-affiliate-links)
  * [De kosten van PayPal's nalatigheid](#the-cost-of-paypals-negligence)
  * [De leugen in de documentatie](#the-documentation-lie)
* [Wat dit betekent voor ontwikkelaars](#what-this-means-for-developers)
## Het Ontbrekende Stuk: Geen Manier om Abonnementen te Lijsten {#the-missing-piece-no-way-to-list-subscriptions}

Hier is iets wat ons verbaast: PayPal heeft sinds 2014 abonnementenfacturering, maar ze hebben nooit een manier geboden voor handelaren om hun eigen abonnementen te kunnen weergeven.

Denk daar eens over na. Je kunt abonnementen aanmaken, je kunt ze annuleren als je de ID hebt, maar je kunt geen lijst krijgen van alle actieve abonnementen voor je account. Het is alsof je een database hebt zonder SELECT statement.

We hebben dit nodig voor basis bedrijfsvoering:

* Klantenservice (wanneer iemand mailt met vragen over zijn abonnement)
* Financiële rapportage en reconciliatie
* Geautomatiseerd facturatiebeheer
* Naleving en auditing

Maar PayPal? Die hebben het gewoon... nooit gebouwd.


## 2014-2017: Het Probleem Doemt Op {#2014-2017-the-problem-emerges}

Het probleem met het weergeven van abonnementen verscheen voor het eerst in de PayPal community forums in 2017. Ontwikkelaars stelden de voor de hand liggende vraag: "Hoe krijg ik een lijst van al mijn abonnementen?"

PayPal's reactie? Geen reactie.

Communityleden raakten gefrustreerd:

> "Erg vreemde weglating als een handelaar niet alle actieve overeenkomsten kan weergeven. Als de overeenkomst-ID verloren is, betekent dit dat alleen de gebruiker een overeenkomst kan annuleren of opschorten." - leafspider

> "+1. Het is bijna 3 jaar geleden." - laudukang (wat betekent dat het probleem al sinds \~2014 bestaat)

De [originele community post](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) uit 2017 toont ontwikkelaars die smeken om deze basisfunctionaliteit. PayPal's reactie was om de repository waar mensen het probleem meldden te archiveren.


## 2020: We Geven Ze Uitgebreide Feedback {#2020-we-give-them-extensive-feedback}

In oktober 2020 nam PayPal contact met ons op voor een formele feedbacksessie. Dit was geen informeel gesprek - ze organiseerden een 45 minuten durende Microsoft Teams call met 8 PayPal executives waaronder Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze en anderen.

### De 27-Punten Feedbacklijst {#the-27-item-feedback-list}

We kwamen goed voorbereid. Na 6 uur proberen te integreren met hun API's hadden we 27 specifieke problemen verzameld. Mark Stuart van het PayPal Checkout team zei:

> Hey Nick, bedankt dat je het vandaag met iedereen hebt gedeeld! Ik denk dat dit de katalysator zal zijn om meer ondersteuning en investering voor ons team te krijgen om deze dingen te repareren. Het is moeilijk geweest om zulke gedetailleerde feedback te krijgen als wat je ons tot nu toe hebt gegeven.

De feedback was niet theoretisch - het kwam uit echte integratiepogingen:

1. **Access token generatie werkt niet**:

> Access token generatie werkt niet. Ook zouden er meer voorbeelden dan alleen cURL moeten zijn.

2. **Geen web UI voor het aanmaken van abonnementen**:

> Hoe kun je in hemelsnaam abonnementen aanmaken zonder cURL te gebruiken? Er lijkt geen web UI te zijn om dit te doen (zoals Stripe dat heeft)

Mark Stuart vond het access token probleem bijzonder zorgwekkend:

> We horen normaal gesproken geen problemen rond access token generatie.

### Teams Werden Betrokken, Beloftes Werden Gemaakt {#teams-got-involved-promises-were-made}

Naarmate we meer problemen ontdekten, bleef PayPal meer teams aan het gesprek toevoegen. Darshan Raju van het Subscriptions management UI team sloot zich aan en zei:

> Erkenning van de kloof. We zullen dit bijhouden en aanpakken. Nogmaals bedankt voor je feedback!

De sessie werd beschreven als een:

> openhartige doorloop van je ervaring

om:

> PayPal te maken tot wat het zou moeten zijn voor ontwikkelaars.

### Het Resultaat? Niets. {#the-result-nothing}

Ondanks de formele feedbacksessie, de uitgebreide lijst van 27 punten, de betrokkenheid van meerdere teams en beloften om:

> bij te houden en aan te pakken

werden er absoluut geen problemen opgelost.


## De Uittocht van Executives: Hoe PayPal Alle Institutionele Kennis Verloor {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Hier wordt het echt interessant. Iedereen die onze feedback van 2020 ontving, is PayPal inmiddels verlaten:

**Leiderschapswisselingen:**

* [Dan Schulman (CEO voor 9 jaar) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (september 2023)
* [Sri Shivananda (CTO die de feedback organiseerde) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (januari 2024)
**Technische Leiders Die Beloften Maakten, Toen Vertrokken:**

* **Mark Stuart** (beloofde dat feedback een "katalysator" zou zijn) → [Nu bij Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 jaar PayPal-veteraan) → [CEO van MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Met pensioen](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (een van de laatste overgeblevenen) → [Net vertrokken naar Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (januari 2025)

PayPal is een draaideur geworden waar leidinggevenden ontwikkelaarsfeedback verzamelen, beloften maken, en dan vertrekken naar betere bedrijven zoals JPMorgan, Ripple en andere fintechbedrijven.

Dit verklaart waarom de reactie op de GitHub-issue van 2025 volledig los leek te staan van onze feedback uit 2020 – letterlijk iedereen die die feedback ontving is PayPal inmiddels verlaten.


## 2025: Nieuwe Leiding, Zelfde Problemen {#2025-new-leadership-same-problems}

Spoel door naar 2025, en hetzelfde patroon doet zich voor. Na jaren zonder vooruitgang neemt de nieuwe leiding van PayPal opnieuw contact op.

### De Nieuwe CEO Raakt Betrokken {#the-new-ceo-gets-involved}

Op 30 juni 2025 hebben we direct contact gezocht met PayPal's nieuwe CEO Alex Chriss. Zijn reactie was kort:

> Hi Nick – Thank you for reaching out and the feedback. Michelle (cc'd) is on point with her team to engage and work through this with you. Thanks -A

### Reactie van Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP en General Manager van Small Business and Financial Services, reageerde:

> Thanks very much Nick, moving Alex to bcc. We have been looking into this since your earlier post. We will give you a call before the week is out. Can you please send me your contact info so one of my colleagues can reach out. Michelle

### Onze Reactie: Geen Vergaderingen Meer {#our-response-no-more-meetings}

We hebben een nieuwe vergadering geweigerd en onze frustratie uitgelegd:

> Thank you. However I don't feel like getting on a call is going to do anything. Here's why... I got on a call in the past and it went absolutely nowhere. I wasted 2+ hours of my time talking to the entire team and leadership and nothing got done... Tons of emails back and forth. Absolutely nothing done. Feedback went nowhere. I tried for years, get listened to, and then it goes nowhere.

### Overengineeren door Marty Brodbeck {#marty-brodbecks-overengineering-response}

Vervolgens nam Marty Brodbeck, hoofd consumententechniek bij PayPal, contact op:

> Hi Nick, this is Marty Brodbeck. I head up all consumer engineering here at PayPal and have been driving the api development for the company. Can you and I connect on the problem you are facing and how we may help here.

Toen we het eenvoudige verzoek voor een endpoint om abonnementen te tonen uitlegden, onthulde zijn reactie het exacte probleem:

> Thanks Nick, we are in the process of creating a single subscription api with full SDK (supports full error handling, event-based subscription tracking, robust uptime) where billing is also split out as a separate API for merchants to go to rather than having to orchestrate across multiple endpoints to get a single response.

Dit is precies de verkeerde aanpak. We hebben geen maanden complexe architectuur nodig. We hebben één eenvoudige REST-endpoint nodig die abonnementen toont – iets wat er al sinds 2014 had moeten zijn.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### De Tegenstrijdigheid van "Eenvoudige CRUD" {#the-simple-crud-contradiction}

Toen we aangaven dat dit basis CRUD-functionaliteit is die er al sinds 2014 had moeten zijn, was Marty's reactie veelzeggend:

> Simple Crud operations are part of the core API my friend, so it won't take months of development

De PayPal TypeScript SDK, die na maanden ontwikkeling momenteel slechts drie endpoints ondersteunt, samen met de historische tijdlijn, toont duidelijk aan dat dergelijke projecten meer dan een paar maanden vergen om te voltooien.
Deze reactie toont aan dat hij zijn eigen API niet begrijpt. Als "eenvoudige CRUD-bewerkingen deel uitmaken van de kern-API," waar is dan het eindpunt voor het weergeven van abonnementen? Wij reageerden:

> Als 'eenvoudige CRUD-bewerkingen deel uitmaken van de kern-API' waar is dan het eindpunt voor het weergeven van abonnementen? Ontwikkelaars vragen hier al sinds 2014 om. Het is nu 11 jaar geleden. Elke andere betalingsverwerker heeft deze basisfunctionaliteit sinds dag één.

### De disconnectie wordt duidelijk {#the-disconnect-becomes-clear}

De uitwisselingen in 2025 met Alex Chriss, Michelle Gill en Marty Brodbeck tonen dezelfde organisatorische disfunctie:

1. **Nieuw leiderschap heeft geen kennis van eerdere feedbacksessies**
2. **Ze stellen dezelfde overgecompliceerde oplossingen voor**
3. **Ze begrijpen hun eigen API-beperkingen niet**
4. **Ze willen meer vergaderingen in plaats van het probleem gewoon op te lossen**

Dit patroon verklaart waarom PayPal-teams in 2025 volledig losstaan van de uitgebreide feedback die in 2020 is gegeven – de mensen die die feedback ontvingen zijn weg, en het nieuwe leiderschap herhaalt dezelfde fouten.


## Jarenlange bugrapporten die ze negeerden {#years-of-bug-reports-they-ignored}

We klaagden niet alleen over ontbrekende functies. We rapporteerden actief bugs en probeerden hen te helpen verbeteren. Hier is een uitgebreide tijdlijn van de gedocumenteerde problemen:

### 2016: Vroege UI/UX-klachten {#2016-early-uiux-complaints}

Al in 2016 namen we publiekelijk contact op met PayPal-leiderschap, waaronder Dan Schulman, over interfaceproblemen en gebruiksvriendelijkheidsproblemen. Dit was 9 jaar geleden, en dezelfde UI/UX-problemen bestaan nog steeds.

### 2021: Bugrapport zakelijke e-mail {#2021-business-email-bug-report}

In maart 2021 meldden we dat het zakelijke e-mailsysteem van PayPal onjuiste annuleringsmeldingen verstuurde. De e-mailsjabloon had verkeerd weergegeven variabelen, waardoor klanten verwarrende berichten kregen.

Mark Stuart erkende het probleem:

> Bedankt Nick! Overstappen op BCC. @Prasy, is jouw team verantwoordelijk voor deze e-mail of weet je wie dat is? De "Niftylettuce, LLC, we zullen je niet langer factureren" doet me vermoeden dat er een verwarring is over aan wie het gericht is en de inhoud van de e-mail.

**Resultaat**: Ze hebben deze daadwerkelijk opgelost! Mark Stuart bevestigde:

> Zojuist gehoord van het notificatieteam dat de e-mailsjabloon is gerepareerd en uitgerold. Waarderen dat je het hebt gemeld. Dank je!

Dit toont aan dat ze dingen KUNNEN oplossen als ze willen – ze kiezen er alleen meestal niet voor.

### 2021: Suggesties voor UI-verbeteringen {#2021-ui-improvement-suggestions}

In februari 2021 gaven we gedetailleerde feedback over hun dashboard-UI, specifiek de sectie "PayPal Recent Activity":

> Ik denk dat het dashboard op paypal.com, specifiek "PayPal Recent Activity", verbeterd moet worden. Ik vind niet dat je de $0 terugkerende betaling "Created" statusregels moet tonen – het voegt gewoon een hoop extra regels toe en je kunt niet in één oogopslag zien hoeveel inkomen er voor de dag/de afgelopen dagen wordt gegenereerd.

Mark Stuart stuurde het door naar het team consumentenproducten:

> Bedankt! Ik weet niet welk team verantwoordelijk is voor Activity, maar ik heb het doorgestuurd naar het hoofd van consumentenproducten om het juiste team te vinden. Een terugkerende betaling van $0,00 lijkt een bug. Zou waarschijnlijk gefilterd moeten worden.

**Resultaat**: Nooit opgelost. De UI toont nog steeds deze nutteloze $0 vermeldingen.

### 2021: Fouten in sandbox-omgeving {#2021-sandbox-environment-failures}

In november 2021 meldden we kritieke problemen met de sandbox-omgeving van PayPal:

* Sandbox geheime API-sleutels werden willekeurig gewijzigd en uitgeschakeld
* Alle sandbox-testaccounts werden zonder kennisgeving verwijderd
* Foutmeldingen bij het bekijken van sandbox-accountgegevens
* Intermitterende laadfouten

> Om de een of andere reden werd mijn sandbox geheime API-sleutel gewijzigd en uitgeschakeld. Ook zijn al mijn oude sandbox-testaccounts verwijderd.

> Soms laden ze wel en soms niet. Dit is ontzettend frustrerend.

**Resultaat**: Geen reactie, geen oplossing. Ontwikkelaars hebben nog steeds problemen met de betrouwbaarheid van de sandbox.

### 2021: Rapportagesysteem volledig kapot {#2021-reports-system-completely-broken}
In mei 2021 meldden we dat het downloadsysteem van PayPal voor transactierapporten volledig kapot was:

> Het lijkt erop dat rapportdownloads momenteel niet werken en dat al de hele dag niet doen. Ook zou je waarschijnlijk een e-mailmelding moeten krijgen als het mislukt.

We wezen ook op de rampzalige sessiebeheer:

> Ook als je 5 minuten inactief bent terwijl je bent ingelogd bij PayPal, word je uitgelogd. Dus als je dan de knop naast het rapport dat je wilt controleren opnieuw ververst (na een eeuwigheid wachten), is het een gedoe om weer in te loggen.

Mark Stuart erkende het probleem met de sessietimeout:

> Ik herinner me dat je dat in het verleden had gemeld met je sessie die vaak verloopt en je ontwikkelproces verstoort terwijl je schakelt tussen je IDE en developer.paypal.com of je merchant dashboard, waarna je weer uitgelogd bent als je terugkomt.

**Resultaat**: Sessietimeouts zijn nog steeds 60 seconden. Het rapportensysteem faalt nog steeds regelmatig.

### 2022: Kern-API-functie ontbreekt (weer) {#2022-core-api-feature-missing-again}

In januari 2022 hebben we het probleem met het abonnementenoverzicht opnieuw geëscaleerd, dit keer met nog meer details over hoe hun documentatie onjuist was:

> Er is geen GET die alle abonnementen (voorheen billing agreements genoemd) opsomt

We ontdekten dat hun officiële documentatie volledig onjuist was:

> De API-documentatie is ook totaal onjuist. We dachten dat we een workaround konden doen door een hardcoded lijst van abonnement-ID's te downloaden. Maar dat werkt zelfs niet!

> Uit de officiële docs hier... Er staat dat je dit kunt doen... Hier komt het op neer - er is helemaal geen "Subscription ID" veld te vinden om aan te vinken.

Christina Monti van PayPal reageerde:

> Onze excuses voor de frustraties veroorzaakt door deze foutieve stappen, we zullen dat deze week oplossen.

Sri Shivananda (CTO) bedankte ons:

> Bedankt voor je voortdurende hulp om ons beter te maken. Zeer gewaardeerd.

**Resultaat**: Documentatie is nooit aangepast. De endpoint voor het opsommen van abonnementen is nooit gemaakt.


## De nachtmerrie van de ontwikkelaarservaring {#the-developer-experience-nightmare}

Werken met de API's van PayPal is alsof je 10 jaar terug in de tijd stapt. Hier zijn de technische problemen die we hebben gedocumenteerd:

### Kapotte gebruikersinterface {#broken-user-interface}

Het PayPal developer dashboard is een ramp. Dit is wat we dagelijks meemaken:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  De UI van PayPal is zo kapot dat je meldingen niet eens kunt wegklikken
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Het developer dashboard laat je letterlijk een schuifregelaar slepen en logt je dan uit na 60 seconden
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Meer UI-rampen in de PayPal developer interface die kapotte workflows tonen
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  De interface voor abonnementenbeheer - de interface is zo slecht dat we op code moesten vertrouwen om producten en abonnementenplannen te genereren
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Een weergave van de kapotte abonnementeninterface met ontbrekende functionaliteit (je kunt niet eenvoudig producten/plannen/abonnementen aanmaken – en er lijkt helemaal geen manier te zijn om producten of plannen te verwijderen zodra ze in de UI zijn aangemaakt)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typische PayPal foutmeldingen - cryptisch en niet behulpzaam
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### SDK Problemen {#sdk-problems}

* Kan niet zowel eenmalige betalingen als abonnementen aan zonder complexe omwegen waarbij knoppen worden verwisseld en opnieuw gerenderd terwijl de SDK opnieuw wordt geladen met script tags
* JavaScript SDK overtreedt basisconventies (kleine letters voor klassenamen, geen instantiecontrole)
* Foutmeldingen geven niet aan welke velden ontbreken
* Inconsistente datatypes (vereist stringbedragen in plaats van nummers)

### Content Security Policy Overtredingen {#content-security-policy-violations}

Hun SDK vereist unsafe-inline en unsafe-eval in je CSP, **waardoor je de beveiliging van je site moet opofferen**.

### Documentatie Chaos {#documentation-chaos}

Mark Stuart zelf gaf toe:

> Mee eens dat er een absurde hoeveelheid legacy en nieuwe API's is. Echt moeilijk om te vinden waar je naar moet zoeken (zelfs voor ons die hier werken).

### Beveiligingslekken {#security-vulnerabilities}

**PayPal's 2FA-implementatie is achterhaald**. Zelfs met TOTP-apps ingeschakeld, verplichten ze SMS-verificatie - waardoor accounts kwetsbaar zijn voor SIM-swapping aanvallen. Als je TOTP hebt ingeschakeld, zou dat exclusief gebruikt moeten worden. De fallback zou e-mail moeten zijn, niet SMS.

### Sessiebeheer Ramp {#session-management-disaster}

**Hun ontwikkelaarsdashboard logt je uit na 60 seconden inactiviteit**. Probeer iets productiefs te doen en je gaat constant door: inloggen → captcha → 2FA → uitloggen → herhalen. Gebruik je een VPN? Succes.


## Juli 2025: De Drup die de Emmer deed Overlopen {#july-2025-the-final-straw}

Na 11 jaar van dezelfde problemen kwam het breekpunt tijdens een routine accountmigratie. We moesten overstappen naar een nieuw PayPal-account dat overeenkomt met onze bedrijfsnaam "Forward Email LLC" voor een schonere boekhouding.

Wat eenvoudig had moeten zijn, veranderde in een complete ramp:

* Initiële tests toonden aan dat alles correct werkte
* Uren later blokkeerde PayPal plotseling alle abonnementbetalingen zonder waarschuwing
* Klanten konden niet betalen, wat verwarring en een zware supportlast veroorzaakte
* PayPal support gaf tegenstrijdige antwoorden en beweerde dat accounts geverifieerd waren
* We werden gedwongen om PayPal-betalingen volledig stop te zetten

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  De fout die klanten zagen bij het proberen te betalen - geen uitleg, geen logs, niets
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  PayPal support beweert dat alles in orde was terwijl betalingen volledig kapot waren. Het laatste bericht toont dat ze zeggen dat ze "enkele functies hebben hersteld" maar nog steeds om meer ongespecificeerde informatie vragen - klassieke PayPal support theater
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
  Het identiteitsverificatieproces dat zogenaamd "niets heeft opgelost"
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
  Vage boodschap en nog steeds geen oplossing. Geen enkele informatie, kennisgevingen of iets over welke aanvullende informatie nodig is. Klantenservice zwijgt.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Waarom We PayPal Niet Gewoon Kunnen Stoppen {#why-we-cant-just-drop-paypal}

Ondanks al deze problemen kunnen we PayPal niet volledig verlaten omdat sommige klanten alleen PayPal als betaaloptie hebben. Zoals een klant zei op onze [statuspagina](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal is mijn enige betaaloptie

**We zitten vast aan het ondersteunen van een kapot platform omdat PayPal een betalingsmonopolie heeft gecreëerd voor bepaalde gebruikers.**


## De Community Oplossing {#the-community-workaround}

Omdat PayPal geen basisfunctionaliteit voor het weergeven van abonnementen biedt, heeft de ontwikkelaarscommunity workarounds gebouwd. Wij hebben een script gemaakt dat helpt bij het beheren van PayPal-abonnementen: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Dit script verwijst naar een [community gist](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) waar ontwikkelaars oplossingen delen. Gebruikers bedanken ons zelfs [ervoor](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) dat wij bieden wat PayPal jaren geleden had moeten bouwen.


## PayPal-sjablonen Blokkeren Vanwege Phishing {#blocking-paypal-templates-due-to-phishing}

De problemen gaan verder dan API's. De e-mailsjablonen van PayPal zijn zo slecht ontworpen dat we specifieke filtering in onze e-mailservice moesten implementeren omdat ze niet te onderscheiden zijn van phishingpogingen.

### Het Echte Probleem: PayPal-sjablonen Lijken Op Oplichting {#the-real-problem-paypals-templates-look-like-scams}

We ontvangen regelmatig meldingen van PayPal-e-mails die er precies uitzien als phishingpogingen. Hier is een echt voorbeeld uit onze misbruikrapporten:

**Onderwerp:** `[Sandbox] TEST - Nieuwe factuur van PaypalBilling434567 sandbox #A4D369E8-0001`

Deze e-mail werd doorgestuurd naar `abuse@microsoft.com` omdat het leek op een phishingpoging. Het probleem? Het kwam eigenlijk uit de sandbox-omgeving van PayPal, maar hun sjabloonontwerp is zo slecht dat het phishingdetectiesystemen activeert.

### Onze Implementatie {#our-implementation}

Je kunt onze PayPal-specifieke filtering zien in onze [e-mailfiltercode](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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
    'Vanwege aanhoudende PayPal factuurspam moet je handmatig een factuurlink versturen'
  );
  err.isCodeBug = true; // waarschuw admins voor inspectie
  throw err;
}
```

### Waarom We PayPal Moesten Blokkeren {#why-we-had-to-block-paypal}

We hebben dit geïmplementeerd omdat PayPal weigerde enorme spam/phishing/fraudeproblemen op te lossen ondanks onze herhaalde meldingen aan hun abuse-teams. De specifieke e-mailtypes die we blokkeren zijn onder andere:

* **RT000238** - Verdachte factuurmeldingen
* **PPC001017** - Problematische betalingsbevestigingen
* **RT000542** - Pogingen tot hacken van cadeauboodschappen

### De Omvang Van Het Probleem {#the-scale-of-the-problem}

Onze spamfilterlogs tonen het enorme volume PayPal factuurspam dat we dagelijks verwerken. Voorbeelden van geblokkeerde onderwerpen zijn:

* "Factuur van PayPal Billing Team:- Dit bedrag wordt automatisch van uw rekening afgeschreven. Neem onmiddellijk contact met ons op via \[TELEFOON]"
* "Factuur van \[BEDRIJFSNAAM] (\[ORDER-ID])"
* Meerdere variaties met verschillende telefoonnummers en nep order-ID's
Deze e-mails komen vaak van `outlook.com` hosts maar lijken afkomstig te zijn van de legitieme systemen van PayPal, waardoor ze bijzonder gevaarlijk zijn. De e-mails slagen voor SPF-, DKIM- en DMARC-authenticatie omdat ze via de daadwerkelijke infrastructuur van PayPal worden verzonden.

Onze technische logs tonen aan dat deze spam-e-mails legitieme PayPal-headers bevatten:

* `X-Email-Type-Id: RT000238` (dezelfde ID die wij blokkeren)
* `From: "service@paypal.com" <service@paypal.com>`
* Geldige DKIM-handtekeningen van `paypal.com`
* Juiste SPF-records die de mailservers van PayPal tonen

Dit creëert een onmogelijke situatie: legitieme PayPal-e-mails en spam hebben beide identieke technische kenmerken.

### The Irony {#the-irony}

PayPal, een bedrijf dat voorop zou moeten lopen in de strijd tegen financiële fraude, heeft e-mailsjablonen die zo slecht zijn ontworpen dat ze anti-phishing systemen activeren. We worden gedwongen legitieme PayPal-e-mails te blokkeren omdat ze niet te onderscheiden zijn van scams.

Dit is gedocumenteerd in beveiligingsonderzoek: [Pas op voor PayPal nieuwe adresfraude](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – waarin wordt getoond hoe de eigen systemen van PayPal worden misbruikt voor fraude.

### Real-World Impact: Novel PayPal Scams {#real-world-impact-novel-paypal-scams}

Het probleem gaat verder dan alleen slecht sjabloonontwerp. Het factureringssysteem van PayPal is zo gemakkelijk te misbruiken dat oplichters het regelmatig gebruiken om legitiem ogende frauduleuze facturen te versturen. Beveiligingsonderzoeker Gavin Anderegg documenteerde [Een nieuwe PayPal-scam](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) waarbij oplichters echte PayPal-facturen sturen die alle authenticatiecontroles doorstaan:

> "Bij het inspecteren van de bron leek de e-mail daadwerkelijk van PayPal te komen (SPF, DKIM en DMARC slaagden allemaal). De knop verwees ook naar wat leek op een legitieme PayPal-URL... Het duurde even voordat het tot me doordrong dat het een legitieme e-mail was. Ik had net een willekeurige 'factuur' van een oplichter ontvangen."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Screenshot die meerdere frauduleuze PayPal-facturen toont die een inbox overspoelen, allemaal legitiem lijkend omdat ze daadwerkelijk van de systemen van PayPal komen
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

De onderzoeker merkte op:

> "Het lijkt ook een handige functie te zijn die PayPal zou moeten overwegen te beperken. Ik ging er meteen vanuit dat dit een vorm van oplichting was en was alleen geïnteresseerd in de technische details. Het lijkt veel te makkelijk te zijn om uit te voeren, en ik maak me zorgen dat anderen erin zullen trappen."

Dit illustreert het probleem perfect: de eigen legitieme systemen van PayPal zijn zo slecht ontworpen dat ze fraude mogelijk maken terwijl ze tegelijkertijd legitieme communicatie verdacht doen lijken.

Om het nog erger te maken, beïnvloedde dit onze afleverbaarheid bij Yahoo, wat resulteerde in klachten van klanten en urenlang nauwkeurig testen en patrooncontrole.


## PayPals achterhaalde KYC-proces {#paypals-backwards-kyc-process}

Een van de meest frustrerende aspecten van het PayPal-platform is hun achterhaalde aanpak van compliance en Know Your Customer (KYC)-procedures. In tegenstelling tot elke andere betalingsverwerker staat PayPal ontwikkelaars toe hun API's te integreren en betalingen in productie te gaan innen voordat de juiste verificatie is voltooid.

### Hoe het zou moeten werken {#how-it-should-work}

Elke legitieme betalingsverwerker volgt deze logische volgorde:

1. **Eerst KYC-verificatie voltooien**
2. **De handelaar goedkeuren**
3. **Toegang tot productie-API verlenen**
4. **Betalingsinning toestaan**

Dit beschermt zowel de betalingsverwerker als de handelaar door naleving te garanderen voordat er geld wordt overgemaakt.

### Hoe PayPal het eigenlijk doet {#how-paypal-actually-works}

Het proces van PayPal is volledig achterstevoren:

1. **Onmiddellijk toegang tot productie-API verlenen**
2. **Betalingsinning uren of dagen toestaan**
3. **Plotseling betalingen blokkeren zonder waarschuwing**
4. **KYC-documentatie eisen nadat klanten al zijn getroffen**
5. **Geen melding aan de handelaar geven**
6. **Klanten het probleem laten ontdekken en melden**
### De Impact in de Praktijk {#the-real-world-impact}

Dit omgekeerde proces veroorzaakt rampen voor bedrijven:

* **Klanten kunnen aankopen niet afronden** tijdens piekverkoopperiodes
* **Geen voorafgaande waarschuwing** dat verificatie nodig is
* **Geen e-mailmeldingen** wanneer betalingen worden geblokkeerd
* **Handelaren horen over problemen van verwarde klanten**
* **Omzetverlies** tijdens kritieke bedrijfsperiodes
* **Schade aan klantvertrouwen** wanneer betalingen op mysterieuze wijze mislukken

### De Rampscenario van de Accountmigratie in Juli 2025 {#the-july-2025-account-migration-disaster}

Dit exacte scenario speelde zich af tijdens onze routinematige accountmigratie in juli 2025. PayPal liet betalingen aanvankelijk werken, maar blokkeerde ze plotseling zonder enige melding. We ontdekten het probleem pas toen klanten begonnen te melden dat ze niet konden betalen.

Toen we contact opnamen met de ondersteuning, kregen we tegenstrijdige antwoorden over welke documentatie nodig was, zonder duidelijke tijdlijn voor oplossing. Dit dwong ons om PayPal-betalingen volledig stop te zetten, wat klanten in verwarring bracht die geen andere betaalopties hadden.

### Waarom Dit Belangrijk Is {#why-this-matters}

De aanpak van PayPal voor compliance toont een fundamenteel misverstand van hoe bedrijven opereren. Juiste KYC moet **voor** productie-integratie plaatsvinden, niet nadat klanten al proberen te betalen. Het gebrek aan proactieve communicatie wanneer problemen zich voordoen, toont PayPal's disconnectie met de behoeften van handelaren.

Dit omgekeerde proces is symptomatisch voor de bredere organisatorische problemen van PayPal: ze geven prioriteit aan hun interne processen boven de ervaring van handelaren en klanten, wat leidt tot operationele rampen die bedrijven van hun platform wegdrijven.


## Hoe Alle Andere Betaalverwerkers Het Goed Doen {#how-every-other-payment-processor-does-it-right}

De functionaliteit voor het weergeven van abonnementen die PayPal weigert te implementeren, is al meer dan tien jaar standaard in de industrie. Zo gaan andere betaalverwerkers om met deze basisvereiste:

### Stripe {#stripe}

Stripe heeft abonnementen weergeven sinds hun API werd gelanceerd. Hun documentatie toont duidelijk hoe je alle abonnementen voor een klant of handelaaraccount kunt ophalen. Dit wordt beschouwd als basis CRUD-functionaliteit.

### Paddle {#paddle}

Paddle biedt uitgebreide API's voor abonnementbeheer, inclusief weergeven, filteren en paginering. Ze begrijpen dat handelaren hun terugkerende inkomstenstromen moeten kunnen zien.

### Coinbase Commerce {#coinbase-commerce}

Zelfs cryptovalutabetalingsverwerkers zoals Coinbase Commerce bieden beter abonnementbeheer dan PayPal.

### Square {#square}

De API van Square bevat abonnementen weergeven als een fundamentele functie, niet als een bijzaak.

### De Industriestandaard {#the-industry-standard}

Elke moderne betaalverwerker biedt:

* Alle abonnementen weergeven
* Filteren op status, datum, klant
* Paginering voor grote datasets
* Webhook-meldingen voor abonnementswijzigingen
* Uitgebreide documentatie met werkende voorbeelden

### Wat Andere Verwerkers Bieden vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Alle Abonnementen Weergeven:**

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

**Stripe - Filteren op Klant:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filteren op Status:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Wat Je Eigenlijk Krijgt:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Je kunt ALLEEN ÉÉN abonnement ophalen als je de ID al weet
# Er is GEEN endpoint om alle abonnementen te tonen
# Er is GEEN manier om te zoeken of filteren
# Je moet alle abonnement-ID's zelf bijhouden
```

**Beschikbare Endpoints van PayPal:**

* `POST /v1/billing/subscriptions` - Maak een abonnement aan
* `GET /v1/billing/subscriptions/{id}` - Haal ÉÉN abonnement op (als je de ID weet)
* `PATCH /v1/billing/subscriptions/{id}` - Werk een abonnement bij
* `POST /v1/billing/subscriptions/{id}/cancel` - Annuleer abonnement
* `POST /v1/billing/subscriptions/{id}/suspend` - Schort abonnement op
**Wat mist bij PayPal:**

* ❌ Geen `GET /v1/billing/subscriptions` (alles opvragen)
* ❌ Geen zoekfunctionaliteit
* ❌ Geen filteren op status, klant, datum
* ❌ Geen ondersteuning voor paginering

PayPal is de enige grote betalingsverwerker die ontwikkelaars dwingt om abonnement-ID's handmatig bij te houden in hun eigen databases.


## PayPals systematische doofpot: 6 miljoen stemmen het zwijgen opleggen {#paypals-systematic-cover-up-silencing-6-million-voices}

In een zet die perfect de aanpak van PayPal bij het omgaan met kritiek samenvat, hebben ze onlangs hun hele communityforum offline gehaald, waardoor meer dan 6 miljoen leden effectief het zwijgen werd opgelegd en honderdduizenden berichten die hun fouten documenteerden werden gewist.

### De grote uitwissing {#the-great-erasure}

De oorspronkelijke PayPal Community op `paypal-community.com` had **6.003.558 leden** en bevatte honderdduizenden berichten, bugrapporten, klachten en discussies over de API-fouten van PayPal. Dit vertegenwoordigde meer dan een decennium aan gedocumenteerd bewijs van de systematische problemen van PayPal.

Op 30 juni 2025 heeft PayPal stilletjes het hele forum offline gehaald. Alle `paypal-community.com` links geven nu 404-fouten. Dit was geen migratie of upgrade.

### De redding door derden {#the-third-party-rescue}

Gelukkig heeft een derde partij op [ppl.lithium.com](https://ppl.lithium.com/) een deel van de inhoud bewaard, waardoor we toegang hebben tot de discussies die PayPal probeerde te verbergen. Deze derde partij bewaring is echter onvolledig en kan op elk moment verdwijnen.

Dit patroon van het verbergen van bewijs is niet nieuw voor PayPal. Ze hebben een gedocumenteerde geschiedenis van:

* Het verwijderen van kritische bugrapporten uit het publieke zicht
* Het zonder waarschuwing stopzetten van ontwikkelaarstools
* Het wijzigen van API's zonder goede documentatie
* Het het zwijgen opleggen aan communitydiscussies over hun fouten

Het offline halen van het forum is de meest brutale poging tot nu toe om hun systematische fouten aan het publieke oog te onttrekken.


## De 11-jarige capture-bug ramp: $1.899 en het loopt door {#the-11-year-capture-bug-disaster-1899-and-counting}

Terwijl PayPal druk was met het organiseren van feedbacksessies en het doen van beloften, is hun kernbetalingssysteem al meer dan 11 jaar fundamenteel kapot. Het bewijs is vernietigend.

### Forward Email's verlies van $1.899 {#forward-emails-1899-loss}

In onze productiesystemen ontdekten we 108 PayPal-betalingen ter waarde van **$1.899** die verloren gingen door de capture-fouten van PayPal. Deze betalingen vertonen een consistent patroon:

* `CHECKOUT.ORDER.APPROVED` webhooks werden ontvangen
* PayPals capture-API gaf 404-fouten terug
* Bestellingen werden ontoegankelijk via PayPals API

Het is onmogelijk te bepalen of klanten zijn belast, omdat PayPal debuglogs na 14 dagen volledig verbergt en alle gegevens van het dashboard wist voor order-ID's die niet zijn gecaptured.

Dit vertegenwoordigt slechts één bedrijf. **De collectieve verliezen bij duizenden handelaren over meer dan 11 jaar bedragen waarschijnlijk miljoenen dollars.**

**We zeggen het nogmaals: de collectieve verliezen bij duizenden handelaren over meer dan 11 jaar bedragen waarschijnlijk miljoenen dollars.**

De enige reden dat wij dit ontdekten is omdat wij ongelooflijk nauwkeurig en datagedreven zijn.

### Het originele rapport uit 2013: meer dan 11 jaar nalatigheid {#the-2013-original-report-11-years-of-negligence}

Het vroegst gedocumenteerde rapport van dit exacte probleem verschijnt op [Stack Overflow in november 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([gearchiveerd](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Blijf 404-fout ontvangen met Rest API bij het uitvoeren van een capture"

De in 2013 gerapporteerde fout is **identiek** aan wat Forward Email in 2024 ervoer:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

De reactie van de community in 2013 was veelzeggend:

> "Er is op dit moment een gemeld probleem met de REST API. PayPal werkt eraan."
**Meer dan 11 jaar later zijn ze nog steeds "ermee bezig."**

### De Bekentenis van 2016: PayPal Breekt Hun Eigen SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

In 2016 documenteerde PayPal's eigen GitHub-repository [massale capture-fouten](https://github.com/paypal/PayPal-PHP-SDK/issues/660) die hun officiële PHP SDK troffen. De omvang was verbijsterend:

> "Sinds 20-09-2016 falen alle PayPal capture pogingen met 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Er is niets veranderd tussen 19-09 en 20-09 aan de API-integratie. **100% van de capture pogingen sinds 20-09 geven deze fout terug.**"

Een handelaar meldde:

> "Ik heb **meer dan 1.400 mislukte capture pogingen in de afgelopen 24 uur gehad**, allemaal met de INVALID_RESOURCE_ID foutmelding."

PayPal's eerste reactie was om de handelaar de schuld te geven en hen door te verwijzen naar de technische ondersteuning. Pas na enorme druk gaven ze schuld toe:

> "Ik heb een update van onze Productontwikkelaars. Ze merken in de headers die worden verzonden dat de PayPal-Request-ID met 42 tekens wordt verzonden, maar **het lijkt erop dat er recent een wijziging is doorgevoerd die deze ID beperkt tot slechts 38 tekens.**"

Deze bekentenis onthult PayPal's systematische nalatigheid:

1. **Ze hebben ongedocumenteerde brekende wijzigingen doorgevoerd**
2. **Ze hebben hun eigen officiële SDK kapot gemaakt**
3. **Ze gaven eerst de handelaren de schuld**
4. **Ze gaven alleen schuld toe onder druk**

Zelfs na het "oplossen" van het probleem meldden handelaren:

> "SDK geüpgraded naar v1.7.4 en **het probleem doet zich nog steeds voor.**"

### De Escalatie van 2024: Nog Steeds Kapot {#the-2024-escalation-still-broken}

Recente meldingen uit de bewaarde PayPal Community tonen aan dat het probleem eigenlijk erger is geworden. Een [discussie van september 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([gearchiveerd](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documenteert exact dezelfde problemen:

> "Het probleem is pas ongeveer 2 weken geleden begonnen en treft niet alle bestellingen. **De veel vaker voorkomende fout lijkt 404's bij capture te zijn.**"

De handelaar beschrijft hetzelfde patroon dat Forward Email ervoer:

> "Na het proberen te capturen van de bestelling, geeft PayPal een 404 terug. Bij het ophalen van Details van de bestelling: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Dit is zonder enige aanwijzing van een succesvolle capture aan onze kant.**"

### De Webhook Betrouwbaarheidsramp {#the-webhook-reliability-disaster}

Een andere [bewaarde community-discussie](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) onthult dat PayPal's webhook-systeem fundamenteel onbetrouwbaar is:

> "Theoretisch zouden er twee events moeten zijn (CHECKOUT.ORDER.APPROVED en PAYMENT.CAPTURE.COMPLETED) van Webhook events. In werkelijkheid **worden die twee events zelden direct ontvangen, PAYMENT.CAPTURE.COMPLETED wordt meestal niet ontvangen of pas na enkele uren.**"

Voor abonnementbetalingen:

> "**'PAYMENT.SALE.COMPLETED' werd soms niet ontvangen of pas na enkele uren.**"

De vragen van de handelaar onthullen de diepte van PayPal's betrouwbaarheidsproblemen:

1. **"Waarom gebeurt dit?"** - PayPal's webhook-systeem is fundamenteel kapot
2. **"Als de orderstatus 'COMPLETED' is, mag ik dan aannemen dat ik het geld heb ontvangen?"** - Handelaren kunnen PayPal's API-responses niet vertrouwen
3. **"Waarom kan ik in 'Event Logs->Webhook Events' geen logs vinden?"** - Zelfs PayPal's eigen loggingsysteem werkt niet

### Het Patroon van Systematische Nalatigheid {#the-pattern-of-systematic-negligence}

Het bewijs strekt zich uit over meer dan 11 jaar en toont een duidelijk patroon:

* **2013**: "PayPal is ermee bezig"
* **2016**: PayPal geeft een brekende wijziging toe, levert een kapotte oplossing
* **2024**: Exact dezelfde fouten doen zich nog steeds voor, treffen Forward Email en talloze anderen

Dit is geen bug - **dit is systematische nalatigheid.** PayPal weet al meer dan tien jaar van deze kritieke betalingsverwerkingsfouten en heeft consequent:
1. **Handelde handelaren de schuld toe voor PayPal's bugs**
2. **Maakte ongedocumenteerde brekende wijzigingen**
3. **Bood inadequate oplossingen die niet werken**
4. **Negeerde de financiële impact op bedrijven**
5. **Verborgen bewijs door communityforums offline te halen**

### De Ongedocumenteerde Vereiste {#the-undocumented-requirement}

Nergens in de officiële documentatie van PayPal wordt vermeld dat handelaren retry-logica moeten implementeren voor capture-operaties. Hun documentatie stelt dat handelaren "direct na goedkeuring moeten capturen," maar vermeldt niet dat hun API willekeurig 404-fouten retourneert die complexe retry-mechanismen vereisen.

Dit dwingt elke handelaar om:

* Exponentiële backoff retry-logica te implementeren
* Om te gaan met inconsistente webhook-levering
* Complexe state management systemen te bouwen
* Handmatig te monitoren op mislukte captures

**Elke andere betalingsverwerker biedt betrouwbare capture-API's die de eerste keer werken.**


## Het Brede Patroon van Misleiding van PayPal {#paypals-broader-pattern-of-deception}

De capture-bug ramp is slechts één voorbeeld van PayPal's systematische aanpak om klanten te misleiden en hun fouten te verbergen.

### De Actie van het New York Department of Financial Services {#the-new-york-department-of-financial-services-action}

In januari 2025 heeft het New York Department of Financial Services een [handhavingsactie tegen PayPal uitgevaardigd](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) wegens misleidende praktijken, wat aantoont dat PayPal's patroon van misleiding veel verder gaat dan alleen hun API's.

Deze regelgevende actie toont PayPal's bereidheid om misleidende praktijken toe te passen in hun gehele bedrijfsvoering, niet alleen in hun ontwikkelaarstools.

### De Honey-rechtszaak: Het herschrijven van affiliate-links {#the-honey-lawsuit-rewriting-affiliate-links}

De overname van Honey door PayPal heeft geleid tot [rechtszaken waarin wordt beweerd dat Honey affiliate-links herschrijft](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), waardoor commissies van contentmakers en influencers worden gestolen. Dit is een andere vorm van systematische misleiding waarbij PayPal winst maakt door inkomsten om te leiden die aan anderen zouden moeten toekomen.

Het patroon is duidelijk:

1. **API-fouten**: Verborgen gebroken functionaliteit, handelaren de schuld geven
2. **Community het zwijgen opleggen**: Bewijs van problemen verwijderen
3. **Regelgevende overtredingen**: Misleidende praktijken toepassen
4. **Affiliate-diefstal**: Commissies stelen via technische manipulatie

### De Kosten van PayPal's Nalaten {#the-cost-of-paypals-negligence}

Het verlies van Forward Email van $1.899 is slechts het topje van de ijsberg. Overweeg de bredere impact:

* **Individuele handelaren**: Duizenden die honderden tot duizenden dollars verliezen
* **Enterprise-klanten**: Mogelijk miljoenen aan gemiste omzet
* **Ontwikkelaarstijd**: Ontelbare uren besteed aan het bouwen van workarounds voor PayPal's kapotte API's
* **Klantvertrouwen**: Bedrijven verliezen klanten door PayPal's betalingsfouten

Als één kleine e-mailservice bijna $2.000 verloor, en dit probleem al meer dan 11 jaar bestaat en duizenden handelaren treft, bedraagt de totale financiële schade waarschijnlijk **honderden miljoenen dollars**.

### De Leugen in de Documentatie {#the-documentation-lie}

De officiële documentatie van PayPal vermeldt consequent niet de kritieke beperkingen en bugs die handelaren zullen tegenkomen. Bijvoorbeeld:

* **Capture API**: Geen vermelding dat 404-fouten vaak voorkomen en retry-logica vereisen
* **Webhook betrouwbaarheid**: Geen vermelding dat webhooks vaak uren vertraagd zijn
* **Subscription listing**: Documentatie suggereert dat listing mogelijk is terwijl er geen endpoint bestaat
* **Sessie time-outs**: Geen vermelding van agressieve time-outs van 60 seconden

Deze systematische weglating van cruciale informatie dwingt handelaren om PayPal's beperkingen door trial-and-error in productiesystemen te ontdekken, wat vaak leidt tot financiële verliezen.


## Wat Dit Betekent voor Ontwikkelaars {#what-this-means-for-developers}

PayPal's systematische falen om basisbehoeften van ontwikkelaars aan te pakken terwijl ze uitgebreide feedback verzamelen, toont een fundamenteel organisatorisch probleem. Ze behandelen het verzamelen van feedback als een vervanging voor het daadwerkelijk oplossen van problemen.
Het patroon is duidelijk:

1. Ontwikkelaars melden problemen
2. PayPal organiseert feedbacksessies met leidinggevenden
3. Uitgebreide feedback wordt gegeven
4. Teams erkennen tekortkomingen en beloven deze te "volgen en aan te pakken"
5. Er wordt niets geïmplementeerd
6. Leidinggevenden vertrekken naar betere bedrijven
7. Nieuwe teams vragen om dezelfde feedback
8. De cyclus herhaalt zich

Ondertussen worden ontwikkelaars gedwongen om omwegen te bouwen, concessies te doen aan de beveiliging en te werken met kapotte gebruikersinterfaces alleen maar om betalingen te accepteren.

Als je een betalingssysteem bouwt, leer dan van onze ervaring: bouw je [trifecta-aanpak](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) met meerdere verwerkers, maar verwacht niet dat PayPal de basisfunctionaliteit levert die je nodig hebt. Plan vanaf dag één om omwegen te bouwen.

> Dit bericht documenteert onze 11-jarige ervaring met de PayPal-API's bij Forward Email. Alle codevoorbeelden en links zijn afkomstig van onze daadwerkelijke productiesystemen. We blijven PayPal-betalingen ondersteunen ondanks deze problemen omdat sommige klanten geen andere optie hebben

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
