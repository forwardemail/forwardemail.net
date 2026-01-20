# Gegevensverwerkingsovereenkomst {#data-processing-agreement}

<!-- v1.0 van <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Belangrijke termen](#key-terms)
* [Wijzigingen in de Overeenkomst](#changes-to-the-agreement)
* [1. Relaties tussen verwerkers en subverwerkers](#1-processor-and-subprocessor-relationships)
  * [1. Leverancier als verwerker](#1-provider-as-processor)
  * [2. Leverancier als subverwerker](#2-provider-as-subprocessor)
* [2. Verwerking](#2-processing)
  * [1. Verwerkingsgegevens](#1-processing-details)
  * [2. Verwerkingsinstructies](#2-processing-instructions)
  * [3. Verwerking door Provider](#3-processing-by-provider)
  * [4. Klantverwerking](#4-customer-processing)
  * [5. Toestemming voor verwerking](#5-consent-to-processing)
  * [6. Subverwerkers](#6-subprocessors)
* [3. Beperkte overdrachten](#3-restricted-transfers)
  * [1. Autorisatie](#1-authorization)
  * [2. Overdrachten buiten de EER](#2-ex-eea-transfers)
  * [3. Overdrachten buiten het VK](#3-ex-uk-transfers)
  * [4. Andere internationale overdrachten](#4-other-international-transfers)
* [4. Reactie op beveiligingsincidenten](#4-security-incident-response)
* [5. Audit en rapportages](#5-audit--reports)
  * [1. Auditrechten](#1-audit-rights)
  * [2. Beveiligingsrapporten](#2-security-reports)
  * [3. Veiligheidsonderzoek](#3-security-due-diligence)
* [6. Coördinatie en samenwerking](#6-coordination--cooperation)
  * [1. Reactie op vragen](#1-response-to-inquiries)
  * [2. DPIA's en DTIA's](#2-dpias-and-dtias)
* [7. Verwijdering van persoonlijke gegevens van klanten](#7-deletion-of-customer-personal-data)
  * [1. Verwijdering door Klant](#1-deletion-by-customer)
  * [2. Verwijdering bij het verlopen van de DPA](#2-deletion-at-dpa-expiration)
* [8. Beperking van aansprakelijkheid](#8-limitation-of-liability)
  * [1. Aansprakelijkheidslimieten en schadevrijstelling](#1-liability-caps-and-damages-waiver)
  * [2. Claims van verbonden partijen](#2-related-party-claims)
  * [3. Uitzonderingen](#3-exceptions)
* [9. Conflicten tussen documenten](#9-conflicts-between-documents)
* [10. Looptijd van de overeenkomst](#10-term-of-agreement)
* [11. Toepasselijk recht en gekozen rechtbanken](#11-governing-law-and-chosen-courts)
* [12. Relatie met dienstverlener](#12-service-provider-relationship)
* [13. Definities](#13-definitions)
* [Credits](#credits)

## Belangrijkste termen {#key-terms}

| Termijn | Waarde |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Overeenkomst</strong> | Deze DPA is een aanvulling op de [Terms of Service](/terms) |
| <strong>Goedgekeurde subverwerkers</strong> | [Cloudflare](https://cloudflare.com) (VS; DNS-, netwerk- en beveiligingsprovider), [DataPacket](https://www.datapacket.com/) (VS/VK; hostingprovider), [Digital Ocean](https://digitalocean.com) (VS; hostingprovider), [Vultr](https://www.vultr.com) (VS; hostingprovider), [Stripe](https://stripe.com) (VS; betalingsverwerker), [PayPal](https://paypal.com) (VS; betalingsverwerker) |
| <strong>Contactpersoon voor de beveiliging van de provider</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Beveiligingsbeleid</strong> | Bekijk [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Regerende Staat</strong> | De staat Delaware, Verenigde Staten |

## Wijzigingen in de overeenkomst {#changes-to-the-agreement}

Dit document is een afgeleide van [Standaardvoorwaarden Common Paper DPA (versie 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) en de volgende wijzigingen zijn aangebracht:

1. [Toepasselijk recht en gekozen rechtbanken](#11-governing-law-and-chosen-courts) is hieronder opgenomen, terwijl `Governing State` hierboven is geïdentificeerd.
2. [Relatie met serviceprovider](#12-service-provider-relationship) is hieronder opgenomen.

## 1. Relaties tussen verwerkers en subverwerkers {#1-processor-and-subprocessor-relationships}

### 1. Leverancier als verwerker {#1-provider-as-processor}

In situaties waarin <strong>Klant</strong> de verwerkingsverantwoordelijke is van de Persoonsgegevens van de Klant, wordt <strong>Provider</strong> beschouwd als een Verwerker die Persoonsgegevens verwerkt namens <strong>Klant</strong>.

### 2. Leverancier als subverwerker {#2-provider-as-subprocessor}

In situaties waarin <strong>Klant</strong> een Verwerker is van de Persoonsgegevens van Klant, wordt <strong>Provider</strong> beschouwd als een Subverwerker van de Persoonsgegevens van Klant.

## 2. Verwerken {#2-processing}

### 1. Verwerkingsdetails {#1-processing-details}

In Bijlage I(B) op het voorblad worden het onderwerp, de aard, het doel en de duur van deze verwerking beschreven, evenals de <strong>categorieën persoonsgegevens</strong> die worden verzameld en de <strong>categorieën betrokkenen</strong>.

### 2. Verwerkingsinstructies {#2-processing-instructions}

<strong>Klant</strong> geeft <strong>Provider</strong> opdracht om Persoonsgegevens van Klant te Verwerken: (a) om de Dienst te verlenen en te onderhouden; (b) zoals nader gespecificeerd via het gebruik van de Dienst door <strong>Klant</strong>; (c) zoals vastgelegd in de <strong>Overeenkomst</strong>; en (d) zoals vastgelegd in andere schriftelijke instructies van <strong>Klant</strong> en erkend door <strong>Provider</strong> over het Verwerken van Persoonsgegevens van Klant onder deze DPA. <strong>Provider</strong> zal zich aan deze instructies houden, tenzij dit verboden is door de Toepasselijke Wetgeving. <strong>Provider</strong> zal <strong>Klant</strong> onmiddellijk informeren indien hij de Verwerkingsinstructies niet kan opvolgen. <strong>Klant</strong> heeft instructies gegeven en zal deze alleen geven die voldoen aan de Toepasselijke Wetgeving.

### 3. Verwerking door provider {#3-processing-by-provider}

<strong>Provider</strong> verwerkt Persoonsgegevens van Klant uitsluitend in overeenstemming met deze Gegevensverwerkingsovereenkomst (DPA), inclusief de details op de voorpagina. Indien <strong>Provider</strong> de Dienst bijwerkt om bestaande producten, functies of functionaliteiten bij te werken of nieuwe producten, functies of functionaliteiten toe te voegen, kan <strong>Provider</strong> de <strong>Categorieën van Betrokkenen</strong>, <strong>Categorieën van Persoonsgegevens</strong>, <strong>Speciale Gegevenscategorieën</strong>, <strong>Beperkingen of Waarborgen voor Speciale Gegevenscategorieën</strong>, <strong>Frequentie van Doorgifte</strong>, <strong>Aard en Doel van de Verwerking</strong> en <strong>Duur van de Verwerking</strong> naar behoefte wijzigen om de updates te weerspiegelen door <strong>Klant</strong> op de hoogte te stellen van de updates en wijzigingen.

### 4. Klantverwerking {#4-customer-processing}

Wanneer <strong>Klant</strong> een Verwerker is en <strong>Provider</strong> een Subverwerker, zal <strong>Klant</strong> voldoen aan alle Toepasselijke Wetten die van toepassing zijn op de Verwerking van Persoonsgegevens door <strong>Klant</strong>. De overeenkomst van <strong>Klant</strong> met zijn Verwerkingsverantwoordelijke vereist eveneens dat <strong>Klant</strong> voldoet aan alle Toepasselijke Wetten die van toepassing zijn op <strong>Klant</strong> als Verwerker. Daarnaast zal <strong>Klant</strong> voldoen aan de Subverwerkersvereisten in de overeenkomst van <strong>Klant</strong> met zijn Verwerkingsverantwoordelijke.

### 5. Toestemming voor verwerking {#5-consent-to-processing}

<strong>Klant</strong> heeft voldaan aan en zal blijven voldoen aan alle Toepasselijke Wetgeving inzake Gegevensbescherming met betrekking tot het verstrekken van Persoonsgegevens van Klant aan <strong>Provider</strong> en/of de Dienst, waaronder het doen van alle openbaarmakingen, het verkrijgen van alle toestemmingen, het bieden van voldoende keuzemogelijkheden en het implementeren van relevante waarborgen die vereist zijn onder de Toepasselijke Wetgeving inzake Gegevensbescherming.

### 6. Subverwerkers {#6-subprocessors}

a. <strong>Provider</strong> zal geen Persoonsgegevens van de Klant aan een Subverwerker verstrekken, overdragen of overhandigen, tenzij <strong>Klant</strong> de Subverwerker heeft goedgekeurd. De huidige lijst met <strong>Goedgekeurde Subverwerkers</strong> bevat de identiteit van de Subverwerkers, hun land van vestiging en hun verwachte Verwerkingstaken. <strong>Provider</strong> zal <strong>Klant</strong> ten minste 10 werkdagen van tevoren schriftelijk informeren over eventuele voorgenomen wijzigingen in de <strong>Goedgekeurde Subverwerkers</strong>, ongeacht of dit door toevoeging of vervanging van een Subverwerker gaat, zodat <strong>Klant</strong> voldoende tijd heeft om bezwaar te maken tegen de wijzigingen voordat <strong>Provider</strong> de nieuwe Subverwerker(s) in gebruik neemt. <strong>Provider</strong> zal <strong>Klant</strong> de informatie verstrekken die nodig is om <strong>Klant</strong> in staat te stellen zijn recht uit te oefenen om bezwaar te maken tegen de wijziging in <strong>Goedgekeurde Subverwerkers</strong>. <strong>Klant</strong> heeft 30 dagen na kennisgeving van een wijziging aan de <strong>Goedgekeurde Subverwerkers</strong> de tijd om bezwaar aan te tekenen, anders wordt <strong>Klant</strong> geacht de wijzigingen te accepteren. Indien <strong>Klant</strong> binnen 30 dagen na kennisgeving bezwaar maakt tegen de wijziging, zullen <strong>Klant</strong> en <strong>Provider</strong> te goeder trouw samenwerken om het bezwaar of de zorg van <strong>Klant</strong> op te lossen.

b. Bij het inschakelen van een Subverwerker heeft <strong>Provider</strong> een schriftelijke overeenkomst met de Subverwerker waarin wordt gewaarborgd dat de Subverwerker alleen toegang heeft tot en gebruikmaakt van Persoonsgegevens van de Klant (i) voor zover dat nodig is om de aan hem uitbesteedde verplichtingen na te komen, en (ii) in overeenstemming met de voorwaarden van de <strong>Overeenkomst</strong>.

c. Indien de AVG van toepassing is op de verwerking van Persoonsgegevens van Klant, (i) worden de in deze DPA beschreven verplichtingen inzake gegevensbescherming (zoals bedoeld in artikel 28(3) van de AVG, indien van toepassing) ook opgelegd aan de Subverwerker, en (ii) zal de overeenkomst van <strong>Provider</strong> met de Subverwerker deze verplichtingen omvatten, inclusief details over hoe <strong>Provider</strong> en zijn Subverwerker zullen samenwerken om te reageren op vragen of verzoeken over de Verwerking van Persoonsgegevens van Klant. Daarnaast zal <strong>Provider</strong> op verzoek van <strong>Klant</strong> een kopie van zijn overeenkomsten (inclusief eventuele wijzigingen) met zijn Subverwerkers delen. Voor zover noodzakelijk om bedrijfsgeheimen of andere vertrouwelijke informatie, waaronder persoonsgegevens, te beschermen, mag <strong>Provider</strong> de tekst van zijn overeenkomst met zijn Subverwerker redigeren voordat een kopie wordt gedeeld.

d. <strong>Provider</strong> blijft volledig aansprakelijk voor alle verplichtingen die zijn uitbesteed aan zijn Subverwerkers, met inbegrip van de handelingen en omissies van zijn Subverwerkers bij het Verwerken van Persoonsgegevens van Klant. <strong>Provider</strong> zal Klant op de hoogte stellen van enig verzuim van zijn Subverwerkers om een materiële verplichting met betrekking tot Persoonsgegevens van Klant na te komen op grond van de overeenkomst tussen <strong>Provider</strong> en de Subverwerker.

## 3. Beperkte overdrachten {#3-restricted-transfers}

### 1. Autorisatie {#1-authorization}

<strong>Klant</strong> stemt ermee in dat <strong>Provider</strong> Persoonsgegevens van Klant mag overdragen buiten de EER, het Verenigd Koninkrijk of een ander relevant geografisch gebied, indien nodig om de Dienst te leveren. Indien <strong>Provider</strong> Persoonsgegevens van Klant overdraagt naar een gebied waarvoor de Europese Commissie of een andere relevante toezichthoudende autoriteit geen adequaatheidsbesluit heeft uitgevaardigd, zal <strong>Provider</strong> passende waarborgen implementeren voor de overdracht van Persoonsgegevens van Klant naar dat gebied, in overeenstemming met de Toepasselijke Wetgeving inzake Gegevensbescherming.

### 2. Overdrachten buiten de EER {#2-ex-eea-transfers}

<strong>Klant</strong> en <strong>Provider</strong> komen overeen dat indien de AVG de overdracht van Persoonsgegevens van Klant beschermt, de overdracht plaatsvindt van <strong>Klant</strong> binnen de EER naar <strong>Provider</strong> buiten de EER, en de overdracht niet wordt beheerst door een adequaatheidsbesluit van de Europese Commissie, <strong>Klant</strong> en <strong>Provider</strong> door het aangaan van deze DPA geacht worden de EER-SCC's en de bijlagen daarbij, die bij verwijzing zijn opgenomen, te hebben ondertekend. Een dergelijke overdracht vindt plaats overeenkomstig de EER-SCC's, die als volgt zijn ingevuld:

a. Module twee (Verwerkingsverantwoordelijke naar Verwerker) van de EER-SCC's is van toepassing wanneer <strong>Klant</strong> een verwerkingsverantwoordelijke is en <strong>Aanbieder</strong> Persoonsgegevens van Klant verwerkt voor <strong>Klant</strong> als Verwerker.

b. Module drie (Verwerker naar subverwerker) van de EER-SCC's is van toepassing wanneer <strong>Klant</strong> een verwerker is en <strong>Provider</strong> Persoonsgegevens van Klant verwerkt namens <strong>Klant</strong> als subverwerker.

c. Voor elke module geldt (indien van toepassing) het volgende:

1. De optionele dokclausule in clausule 7 is niet van toepassing;

2. In Clausule 9 is Optie 2 (algemene schriftelijke toestemming) van toepassing en bedraagt de minimale termijn voor voorafgaande kennisgeving van wijzigingen in de Subprocessor 10 werkdagen;

3. In clausule 11 is de optionele taal niet van toepassing;

4. Alle vierkante haken in clausule 13 worden verwijderd;

5. In clausule 17 (optie 1) worden de EER-SCC's beheerst door de wetten van de <strong>besturende lidstaat</strong>;

6. In artikel 18(b) worden geschillen beslecht door de rechtbanken van de <strong>regerende lidstaat</strong>; en

7. De voorpagina van deze DPA bevat de informatie die vereist is in Bijlage I, Bijlage II en Bijlage III van de EER-SCC's.

### 3. Ex-VK-overdrachten {#3-ex-uk-transfers}

<strong>Klant</strong> en <strong>Provider</strong> komen overeen dat, indien de Britse AVG de overdracht van Persoonsgegevens van Klant beschermt, de overdracht plaatsvindt van <strong>Klant</strong> vanuit het Verenigd Koninkrijk naar <strong>Provider</strong> buiten het Verenigd Koninkrijk, en de overdracht niet wordt beheerst door een adequaatheidsbesluit van de Britse minister van Buitenlandse Zaken, <strong>Klant</strong> en <strong>Provider</strong> door het aangaan van deze DPA geacht worden het Britse Addendum en de bijbehorende Bijlagen te hebben ondertekend, die door middel van verwijzing zijn opgenomen. Een dergelijke overdracht vindt plaats overeenkomstig het Britse Addendum, dat als volgt is ingevuld:

a. Paragraaf 3.2 van deze Gegevensbeschermingsovereenkomst bevat de informatie die vereist is in Tabel 2 van het Britse Addendum.

b. Tabel 4 van het Britse Addendum wordt als volgt gewijzigd: Geen van beide partijen mag het Britse Addendum beëindigen zoals uiteengezet in Artikel 19 van het Britse Addendum; voor zover de ICO een herzien Goedgekeurd Addendum uitgeeft op grond van Artikel 18 van het Britse Addendum, zullen de partijen te goeder trouw samenwerken om deze DPA dienovereenkomstig te herzien.

c. De voorpagina bevat de informatie die vereist is in Bijlage 1A, Bijlage 1B, Bijlage II en Bijlage III van het Britse addendum.

### 4. Andere internationale overboekingen {#4-other-international-transfers}

Voor de overdracht van persoonsgegevens waarbij het Zwitserse recht (en niet het recht van een EER-lidstaat of het Verenigd Koninkrijk) van toepassing is op het internationale karakter van de overdracht, worden verwijzingen naar de AVG in clausule 4 van de EER-SCC's, voor zover wettelijk vereist, gewijzigd zodat er wordt verwezen naar de Zwitserse federale wet inzake gegevensbescherming of de opvolger daarvan. Het begrip toezichthoudende autoriteit omvat dan ook de Zwitserse federale commissaris voor gegevensbescherming en informatie.

## 4. Reactie op beveiligingsincident {#4-security-incident-response}

1. Zodra <strong>Provider</strong> op de hoogte is van een Beveiligingsincident, zal <strong>Provider</strong>: (a) <strong>Klant</strong> onverwijld op de hoogte stellen, indien mogelijk, maar uiterlijk binnen 72 uur nadat <strong>Klant</strong> op de hoogte is gesteld van het Beveiligingsincident; (b) tijdig informatie verstrekken over het Beveiligingsincident zodra dit bekend wordt of redelijkerwijs door <strong>Klant</strong> wordt verzocht; en (c) onmiddellijk redelijke stappen ondernemen om het Beveiligingsincident te beperken en te onderzoeken. De melding van of reactie van <strong>Provider</strong> op een Beveiligingsincident, zoals vereist door deze Gegevensverwerkingsovereenkomst, zal niet worden opgevat als een erkenning door <strong>Provider</strong> van enige schuld of aansprakelijkheid voor het Beveiligingsincident.

## 5. Audit en rapporten {#5-audit--reports}

### 1. Auditrechten {#1-audit-rights}

<strong>Provider</strong> verstrekt <strong>Klant</strong> alle informatie die redelijkerwijs nodig is om aan te tonen dat <strong>deze DPA naleeft. <strong>Provider</strong> zal audits, inclusief inspecties door <strong>Klant</strong>, toestaan en hieraan bijdragen om de naleving van <strong>Provider</strong> door <strong>Provider</strong> van deze DPA te beoordelen. <strong>Provider</strong> kan de toegang tot gegevens of informatie echter beperken als de toegang van <strong>Klant</strong> tot de informatie een negatieve invloed zou hebben op de intellectuele-eigendomsrechten, geheimhoudingsverplichtingen of andere verplichtingen van <strong>Provider</strong> onder de Toepasselijke Wetgeving. <strong>Klant</strong> erkent en stemt ermee in dat hij zijn auditrechten onder deze DPA en alle auditrechten die worden verleend door de Toepasselijke Wetgeving inzake Gegevensbescherming alleen zal uitoefenen door <strong>Provider</strong> te instrueren te voldoen aan de onderstaande rapportage- en due diligence-vereisten. <strong>Provider</strong> bewaart gegevens over zijn naleving van deze DPA gedurende drie jaar na afloop van de DPA.

### 2. Beveiligingsrapporten {#2-security-reports}

<strong>Klant</strong> erkent dat <strong>Provider</strong> regelmatig wordt gecontroleerd op basis van de normen die zijn vastgelegd in het <strong>Beveiligingsbeleid</strong> door onafhankelijke externe auditors. Op schriftelijk verzoek zal <strong>Provider</strong> <strong>Klant</strong> vertrouwelijk een samenvatting van het actuele rapport verstrekken, zodat <strong>Klant</strong> kan controleren of <strong>Provider</strong> voldoet aan de normen die zijn vastgelegd in het <strong>Beveiligingsbeleid</strong>.

### 3. Beveiligingsonderzoek {#3-security-due-diligence}

Naast het Rapport zal <strong>Provider</strong> reageren op redelijke verzoeken om informatie van <strong>Klant</strong> om de naleving van deze DPA door <strong>Provider</strong> te bevestigen, inclusief antwoorden op vragenlijsten over informatiebeveiliging, due diligence en audits, of door aanvullende informatie te verstrekken over zijn informatiebeveiligingsprogramma. Al dergelijke verzoeken moeten schriftelijk worden ingediend bij de <strong>Contactpersoon Beveiliging van de Provider</strong> en mogen slechts eenmaal per jaar worden ingediend.

## 6. Coördinatie en samenwerking {#6-coordination--cooperation}

### 1. Reactie op vragen {#1-response-to-inquiries}

Indien <strong>Provider</strong> een vraag of verzoek van iemand anders ontvangt over de verwerking van Persoonsgegevens van Klant, zal <strong>Provider</strong> <strong>Klant</strong> hiervan op de hoogte stellen en zal <strong>Provider</strong> niet op het verzoek reageren zonder voorafgaande toestemming van <strong>Klant</strong>. Voorbeelden van dit soort vragen en verzoeken zijn onder meer een bevel van een rechterlijke, administratieve of regelgevende instantie over Persoonsgegevens van Klant, waarbij het informeren van <strong>Klant</strong> niet verboden is door de Toepasselijke Wetgeving, of een verzoek van een betrokkene. Indien toegestaan door de Toepasselijke Wetgeving, zal <strong>Provider</strong> de redelijke instructies van <strong>Klant</strong> over deze verzoeken opvolgen, inclusief het verstrekken van statusupdates en andere informatie die redelijkerwijs door <strong>Klant</strong> wordt gevraagd. Indien een betrokkene een geldig verzoek indient op grond van de Toepasselijke Wetgeving inzake Gegevensbescherming om Persoonsgegevens van Klant te verwijderen of om zich af te melden voor het verstrekken van Persoonsgegevens van Klant door <strong>Klant</strong> aan <strong>Provider</strong>, zal <strong>Provider</strong> <strong>Klant</strong> bijstaan bij het voldoen aan het verzoek in overeenstemming met de Toepasselijke Wetgeving inzake Gegevensbescherming. <strong>Provider</strong> zal op kosten van <strong>Klant</strong> samenwerken met en redelijke bijstand verlenen aan <strong>Klant</strong> in enig juridisch antwoord of andere procedurele actie die door <strong>Klant</strong> wordt ondernomen naar aanleiding van een verzoek van een derde partij over de Verwerking van Persoonsgegevens van Klant door <strong>Provider</strong> op grond van deze Gegevensverwerkingsovereenkomst.

### 2. DPIA's en DTIA's {#2-dpias-and-dtias}

Indien vereist door de toepasselijke wetgeving inzake gegevensbescherming, zal <strong>Provider</strong> <strong>Klant</strong> redelijkerwijs bijstaan bij het uitvoeren van verplichte gegevensbeschermingseffectbeoordelingen of gegevensoverdrachtseffectbeoordelingen en overleg met relevante gegevensbeschermingsautoriteiten, rekening houdend met de aard van de Verwerking en de Persoonsgegevens van de Klant.

## 7. Verwijdering van persoonlijke gegevens van klanten {#7-deletion-of-customer-personal-data}

### 1. Verwijdering door klant {#1-deletion-by-customer}

<strong>Provider</strong> stelt <strong>Klant</strong> in staat om Persoonsgegevens van Klant te verwijderen op een manier die consistent is met de functionaliteit van de Diensten. <strong>Provider</strong> zal zo spoedig als redelijkerwijs mogelijk is aan deze instructie voldoen, behalve wanneer verdere opslag van Persoonsgegevens van Klant vereist is door de Toepasselijke Wetgeving.

### 2. Verwijdering bij DPA-vervaldatum {#2-deletion-at-dpa-expiration}

a. Na afloop van de DPA zal <strong>Provider</strong> de Persoonsgegevens van de Klant retourneren of verwijderen op verzoek van <strong>Klant</strong>, tenzij verdere opslag van de Persoonsgegevens van de Klant vereist of toegestaan is door de Toepasselijke Wetgeving. Indien retourneren of vernietigen onuitvoerbaar of verboden is door de Toepasselijke Wetgeving, zal <strong>Provider</strong> redelijke inspanningen leveren om verdere Verwerking van de Persoonsgegevens van de Klant te voorkomen en zal <strong>Provider</strong> de Persoonsgegevens van de Klant die nog in haar bezit, beheer of controle zijn, blijven beschermen. Toepasselijke Wetgeving kan bijvoorbeeld vereisen dat <strong>Provider</strong> de Persoonsgegevens van de Klant blijft hosten of verwerken.

b. Indien <strong>Klant</strong> en <strong>Provider</strong> de EER-SCC's of het VK-addendum zijn aangegaan als onderdeel van deze Gegevensverwerkingsovereenkomst (DPA), zal <strong>Provider</strong> <strong>Klant</strong> alleen de certificering van verwijdering van Persoonsgegevens verstrekken zoals beschreven in Clausule 8.1(d) en Clausule 8.5 van de EER-SCC's indien <strong>Klant</strong> daarom vraagt.

## 8. Beperking van aansprakelijkheid {#8-limitation-of-liability}

### 1. Aansprakelijkheidslimieten en schadevrijstelling {#1-liability-caps-and-damages-waiver}

**Voor zover maximaal toegestaan volgens de toepasselijke wetgeving inzake gegevensbescherming, is de totale cumulatieve aansprakelijkheid van elke partij jegens de andere partij die voortvloeit uit of verband houdt met deze DPA onderworpen aan de vrijstellingen, uitsluitingen en beperkingen van aansprakelijkheid zoals vermeld in de <strong>Overeenkomst</strong>.**

### 2. Claims van verbonden partijen {#2-related-party-claims}

**Eventuele claims tegen <strong>Provider</strong> of haar gelieerde ondernemingen die voortvloeien uit of verband houden met deze DPA, kunnen uitsluitend worden ingediend door de <strong>Klant</strong>-entiteit die partij is bij de <strong>Overeenkomst</strong>.**

### 3. Uitzonderingen {#3-exceptions}

1. Deze Gegevensverwerkingsovereenkomst (DPA) beperkt geen enkele aansprakelijkheid jegens een individu met betrekking tot diens gegevensbeschermingsrechten onder de toepasselijke wetgeving inzake gegevensbescherming. Bovendien beperkt deze Gegevensverwerkingsovereenkomst (DPA) geen enkele aansprakelijkheid tussen partijen voor schendingen van de EER-SCC's of het Britse Addendum.

## 9. Conflicten tussen documenten {#9-conflicts-between-documents}

1. Deze Gegevensverwerkingsovereenkomst (DPA) maakt deel uit van en vormt een aanvulling op de Overeenkomst. Indien er sprake is van een inconsistentie tussen deze Gegevensverwerkingsovereenkomst, de <strong>Overeenkomst</strong> of een van de onderdelen daarvan, heeft het eerder genoemde onderdeel voorrang op het later vermelde onderdeel voor die inconsistentie: (1) de EER-overeenkomsten of het VK-addendum, (2) deze Gegevensverwerkingsovereenkomst, en vervolgens (3) de <strong>Overeenkomst</strong>.

## 10. Looptijd van de overeenkomst {#10-term-of-agreement}

Deze DPA gaat in wanneer <strong>Provider</strong> en <strong>Klant</strong> akkoord gaan met een voorpagina voor de DPA en de <strong>Overeenkomst</strong> ondertekenen of elektronisch accepteren, en blijft van kracht totdat de <strong>Overeenkomst</strong> afloopt of wordt beëindigd. <strong>Provider</strong> en <strong>Klant</strong> blijven echter beiden onderworpen aan de verplichtingen in deze DPA en de toepasselijke wetgeving inzake gegevensbescherming totdat <strong>Klant</strong> stopt met het doorgeven van Persoonsgegevens van Klant aan <strong>Provider</strong> en <strong>Provider</strong> stopt met het Verwerken van Persoonsgegevens van Klant.

## 11. Toepasselijk recht en gekozen rechtbanken {#11-governing-law-and-chosen-courts}

Onverminderd het toepasselijk recht of vergelijkbare bepalingen in de <strong>Overeenkomst</strong>, zijn alle interpretaties en geschillen over deze Gegevensverwerkingsovereenkomst onderworpen aan het recht van de <strong>Regerende Staat</strong>, ongeacht de bepalingen inzake conflictenrecht. Bovendien, en onverminderd de forumkeuze, jurisdictie of vergelijkbare bepalingen in de <strong>Overeenkomst</strong>, komen de partijen overeen om alle rechtszaken, gerechtelijke stappen of procedures met betrekking tot deze Gegevensverwerkingsovereenkomst aanhangig te maken bij de rechtbanken van de <strong>Regerende Staat</strong>, en elke partij onderwerpt zich onherroepelijk aan de exclusieve jurisdictie van deze rechtbanken.

## 12. Serviceproviderrelatie {#12-service-provider-relationship}

Voor zover de California Consumer Privacy Act, Cal. Civ. Code § 1798.100 e.v. ("CCPA") van toepassing is, erkennen en komen partijen overeen dat <strong>Provider</strong> een dienstverlener is en Persoonsgegevens van <strong>Klant</strong> ontvangt om de Dienst te verlenen zoals overeengekomen in de <strong>Overeenkomst</strong>, hetgeen een zakelijk doel vormt. <strong>Provider</strong> zal geen Persoonsgegevens verkopen die door <strong>Klant</strong> onder de <strong>Overeenkomst</strong> zijn verstrekt. Bovendien zal <strong>Provider</strong> geen Persoonsgegevens bewaren, gebruiken of openbaar maken die door <strong>Klant</strong> onder de <strong>Overeenkomst</strong> zijn verstrekt, behalve voor zover noodzakelijk voor het verlenen van de Dienst aan <strong>Klant</strong>, zoals vermeld in de <strong>Overeenkomst</strong> of zoals toegestaan door de Toepasselijke Wetgeving inzake Gegevensbescherming. <strong>Provider</strong> verklaart de beperkingen van deze paragraaf te begrijpen.

## 13. Definities {#13-definitions}

1. **"Toepasselijke wetten"** betekent de wetten, regels, voorschriften, gerechtelijke bevelen en andere bindende vereisten van een relevante overheidsinstantie die van toepassing zijn op een partij of die hierop van toepassing zijn.

2. **"Toepasselijke wetten inzake gegevensbescherming"** betekent de toepasselijke wetten die bepalen hoe de Service de persoonlijke informatie, persoonlijke gegevens, persoonlijk identificeerbare informatie of andere soortgelijke termen van een individu kan verwerken of gebruiken.

3. **"Verantwoordelijke voor de verwerking"** heeft de betekenis(sen) die daaraan worden toegekend in de toepasselijke wetgeving inzake gegevensbescherming voor het bedrijf dat het doel en de omvang van de verwerking van persoonsgegevens bepaalt.

4. **"Voorblad"** betekent een document dat door de partijen is ondertekend of elektronisch is geaccepteerd, waarin deze standaardvoorwaarden voor de gegevensbescherming zijn opgenomen en waarin <strong>Provider</strong>, <strong>Klant</strong> en het onderwerp en de details van de gegevensverwerking worden geïdentificeerd.

5. **"Persoonsgegevens van de Klant"** betekent Persoonsgegevens die <strong>Klant</strong> uploadt of verstrekt aan <strong>Provider</strong> als onderdeel van de Dienst en die worden beheerd door deze Gegevensverwerkingsovereenkomst.

6. **"DPA"** betekent deze standaard DPA-voorwaarden, de voorpagina tussen <strong>Provider</strong> en <strong>Klant</strong> en het beleid en de documenten waarnaar op de voorpagina wordt verwezen of die daaraan zijn gehecht.

7. **"EER-SCC's"** betekent de standaardcontractbepalingen die zijn gehecht aan Uitvoeringsbesluit 2021/914 van de Europese Commissie van 4 juni 2021 betreffende standaardcontractbepalingen voor de doorgifte van persoonsgegevens naar derde landen overeenkomstig Verordening (EU) 2016/679 van het Europees Parlement en de Europese Raad.

8. **"Europese Economische Ruimte"** of **"EER"** betekent de lidstaten van de Europese Unie, Noorwegen, IJsland en Liechtenstein.

9. **"AVG"** betekent Verordening 2016/679 van de Europese Unie, zoals geïmplementeerd door de lokale wetgeving in de relevante EER-lidstaat.

10. **"Persoonsgegevens"** heeft de betekenis(sen) die daaraan worden toegekend in de toepasselijke wetgeving inzake gegevensbescherming voor persoonlijke informatie, persoonlijke gegevens of een andere soortgelijke term.

11. **"Verwerken"** of **"Verwerken"** heeft de betekenis(sen) die daaraan worden toegekend in de Toepasselijke Wetgeving inzake Gegevensbescherming voor elk gebruik van Persoonsgegevens of de uitvoering van een computerbewerking op Persoonsgegevens, inclusief via geautomatiseerde procedés.

12. **"Verwerker"** heeft de betekenis(sen) die daaraan worden toegekend in de toepasselijke wetgeving inzake gegevensbescherming voor het bedrijf dat Persoonsgegevens verwerkt namens de Verwerkingsverantwoordelijke.

13. **"Rapport"** betekent auditrapporten die door een ander bedrijf zijn opgesteld volgens de normen die zijn vastgelegd in het Beveiligingsbeleid namens Provider.

14. **"Beperkte overdracht"** betekent (a) waar de AVG van toepassing is, een overdracht van persoonsgegevens vanuit de EER naar een land buiten de EER dat niet onderworpen is aan een adequaatheidsbeoordeling door de Europese Commissie; en (b) waar de Britse AVG van toepassing is, een overdracht van persoonsgegevens vanuit het Verenigd Koninkrijk naar een ander land dat niet onderworpen is aan adequaatheidsregelgeving die is vastgesteld krachtens artikel 17A van de Britse Data Protection Act 2018.

15. **"Beveiligingsincident"** betekent een inbreuk op persoonsgegevens zoals gedefinieerd in artikel 4 van de AVG.

16. **"Dienst"** betekent het product en/of de diensten beschreven in de <strong>Overeenkomst</strong>.

17. **"Bijzondere categoriegegevens"** heeft de betekenis die daaraan wordt gegeven in Artikel 9 van de AVG.

18. **"Subverwerker"** heeft de betekenis(sen) die daaraan worden toegekend in de toepasselijke wetgeving inzake gegevensbescherming voor een bedrijf dat, met de goedkeuring en acceptatie van de Verwerkingsverantwoordelijke, de Verwerker helpt bij het Verwerken van Persoonsgegevens namens de Verwerkingsverantwoordelijke.

19. **"UK GDPR"** betekent Verordening 2016/679 van de Europese Unie, zoals geïmplementeerd door artikel 3 van de European Union (Withdrawal) Act van 2018 van het Verenigd Koninkrijk in het Verenigd Koninkrijk.

20. **"UK Addendum"** betekent het internationale gegevensoverdrachtsaddendum bij de EER-SCC's uitgegeven door de Information Commissioner voor Partijen die Beperkte Overdrachten doen onder S119A(1) Data Protection Act 2018.

## Credits {#credits}

Dit document is een afgeleide van [Standaardvoorwaarden Common Paper DPA (versie 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) en valt onder de licentie [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).