# Overeenkomst voor Gegevensverwerking {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Belangrijke Begrippen](#key-terms)
* [Wijzigingen in de Overeenkomst](#changes-to-the-agreement)
* [1. Relaties tussen Verwerker en Subverwerker](#1-processor-and-subprocessor-relationships)
  * [1. Provider als Verwerker](#1-provider-as-processor)
  * [2. Provider als Subverwerker](#2-provider-as-subprocessor)
* [2. Verwerking](#2-processing)
  * [1. Verwerkingsdetails](#1-processing-details)
  * [2. Verwerkingsinstructies](#2-processing-instructions)
  * [3. Verwerking door Provider](#3-processing-by-provider)
  * [4. Verwerking door Klant](#4-customer-processing)
  * [5. Toestemming voor Verwerking](#5-consent-to-processing)
  * [6. Subverwerkers](#6-subprocessors)
* [3. Beperkte Overdrachten](#3-restricted-transfers)
  * [1. Autorisatie](#1-authorization)
  * [2. Overdrachten buiten de EER](#2-ex-eea-transfers)
  * [3. Overdrachten buiten het VK](#3-ex-uk-transfers)
  * [4. Andere Internationale Overdrachten](#4-other-international-transfers)
* [4. Reactie op Beveiligingsincidenten](#4-security-incident-response)
* [5. Audit & Rapportages](#5-audit--reports)
  * [1. Auditrechten](#1-audit-rights)
  * [2. Beveiligingsrapporten](#2-security-reports)
  * [3. Beveiligingsdue Diligence](#3-security-due-diligence)
* [6. Coördinatie & Samenwerking](#6-coordination--cooperation)
  * [1. Reactie op Vragen](#1-response-to-inquiries)
  * [2. DPIA's en DTIA's](#2-dpias-and-dtias)
* [7. Verwijdering van Persoonsgegevens van Klanten](#7-deletion-of-customer-personal-data)
  * [1. Verwijdering door Klant](#1-deletion-by-customer)
  * [2. Verwijdering bij Verloop van de DPA](#2-deletion-at-dpa-expiration)
* [8. Beperking van Aansprakelijkheid](#8-limitation-of-liability)
  * [1. Aansprakelijkheidslimieten en Afstand van Schadevergoeding](#1-liability-caps-and-damages-waiver)
  * [2. Claims van Verwante Partijen](#2-related-party-claims)
  * [3. Uitzonderingen](#3-exceptions)
* [9. Conflicten tussen Documenten](#9-conflicts-between-documents)
* [10. Looptijd van de Overeenkomst](#10-term-of-agreement)
* [11. Toepasselijk Recht en Gekozen Rechtbanken](#11-governing-law-and-chosen-courts)
* [12. Relatie met Dienstverlener](#12-service-provider-relationship)
* [13. Definities](#13-definitions)
* [Credits](#credits)


## Belangrijke Begrippen {#key-terms}

| Term                                       | Waarde                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Overeenkomst</strong>               | Deze DPA vult de [Servicevoorwaarden](/terms) aan                                                                                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Goedgekeurde Subverwerkers</strong> | [Cloudflare](https://cloudflare.com) (VS; DNS-, netwerk- en beveiligingsprovider), [DataPacket](https://www.datapacket.com/) (VS/UK; hostingprovider), [Digital Ocean](https://digitalocean.com) (VS; hostingprovider), [GitHub](https://github.com) (VS; broncodehosting, CI/CD en projectbeheer), [Vultr](https://www.vultr.com) (VS; hostingprovider), [Stripe](https://stripe.com) (VS; betalingsverwerker), [PayPal](https://paypal.com) (VS; betalingsverwerker) |
| <strong>Provider Beveiligingscontact</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Beveiligingsbeleid</strong>         | Bekijk [ons Beveiligingsbeleid op GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Toepasselijke Staat</strong>         | De staat Delaware, Verenigde Staten                                                                                                                                                                                                                                                                                                                                                                                                                                               |
## Wijzigingen in de Overeenkomst {#changes-to-the-agreement}

Dit document is een afgeleide van de [Common Paper DPA Standard Terms (Versie 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) en de volgende wijzigingen zijn aangebracht:

1. [Toepasselijk recht en bevoegde rechtbanken](#11-governing-law-and-chosen-courts) is als sectie hieronder opgenomen met `Governing State` hierboven vermeld.
2. [Relatie Dienstverlener](#12-service-provider-relationship) is als sectie hieronder opgenomen.


## 1. Verwerker- en Subverwerkerrelaties {#1-processor-and-subprocessor-relationships}

### 1. Dienstverlener als Verwerker {#1-provider-as-processor}

In situaties waarin <strong>Klant</strong> een Verantwoordelijke is van de Klant Persoonsgegevens, wordt <strong>Dienstverlener</strong> beschouwd als een Verwerker die Persoonsgegevens verwerkt namens <strong>Klant</strong>.

### 2. Dienstverlener als Subverwerker {#2-provider-as-subprocessor}

In situaties waarin <strong>Klant</strong> een Verwerker is van de Klant Persoonsgegevens, wordt <strong>Dienstverlener</strong> beschouwd als een Subverwerker van de Klant Persoonsgegevens.


## 2. Verwerking {#2-processing}

### 1. Verwerkingsdetails {#1-processing-details}

Bijlage I(B) op de Voorpagina beschrijft het onderwerp, de aard, het doel en de duur van deze Verwerking, evenals de <strong>Categorieën Persoonsgegevens</strong> die worden verzameld en de <strong>Categorieën Betrokkenen</strong>.

### 2. Verwerkingsinstructies {#2-processing-instructions}

<strong>Klant</strong> geeft <strong>Dienstverlener</strong> de instructie om Klant Persoonsgegevens te verwerken: (a) om de Dienst te leveren en te onderhouden; (b) zoals verder gespecificeerd door het gebruik van de Dienst door <strong>Klant</strong>; (c) zoals gedocumenteerd in de <strong>Overeenkomst</strong>; en (d) zoals gedocumenteerd in andere schriftelijke instructies gegeven door <strong>Klant</strong> en erkend door <strong>Dienstverlener</strong> over de verwerking van Klant Persoonsgegevens onder deze DPA. <strong>Dienstverlener</strong> zal deze instructies opvolgen tenzij dit verboden is door Toepasselijke Wetten. <strong>Dienstverlener</strong> zal <strong>Klant</strong> onmiddellijk informeren indien het niet in staat is de verwerkingsinstructies op te volgen. <strong>Klant</strong> heeft instructies gegeven en zal alleen instructies geven die voldoen aan de Toepasselijke Wetten.

### 3. Verwerking door Dienstverlener {#3-processing-by-provider}

<strong>Dienstverlener</strong> zal Klant Persoonsgegevens alleen verwerken in overeenstemming met deze DPA, inclusief de details op de Voorpagina. Indien <strong>Dienstverlener</strong> de Dienst bijwerkt om bestaande of nieuwe producten, functies of functionaliteiten toe te voegen, kan <strong>Dienstverlener</strong> de <strong>Categorieën Betrokkenen</strong>, <strong>Categorieën Persoonsgegevens</strong>, <strong>Bijzondere Categorieën van Gegevens</strong>, <strong>Beperkingen of Waarborgen voor Bijzondere Categorieën van Gegevens</strong>, <strong>Frequentie van Overdracht</strong>, <strong>Aard en Doel van Verwerking</strong> en <strong>Duur van Verwerking</strong> aanpassen indien nodig om de updates te weerspiegelen door <strong>Klant</strong> van de updates en wijzigingen op de hoogte te stellen.

### 4. Verwerking door Klant {#4-customer-processing}

Indien <strong>Klant</strong> een Verwerker is en <strong>Dienstverlener</strong> een Subverwerker, zal <strong>Klant</strong> voldoen aan alle Toepasselijke Wetten die van toepassing zijn op de verwerking van Klant Persoonsgegevens door <strong>Klant</strong>. De overeenkomst van <strong>Klant</strong> met zijn Verantwoordelijke zal vergelijkbaar vereisen dat <strong>Klant</strong> voldoet aan alle Toepasselijke Wetten die van toepassing zijn op <strong>Klant</strong> als Verwerker. Daarnaast zal <strong>Klant</strong> voldoen aan de Subverwerkervereisten in de overeenkomst van <strong>Klant</strong> met zijn Verantwoordelijke.

### 5. Toestemming voor Verwerking {#5-consent-to-processing}

<strong>Klant</strong> heeft voldaan aan en zal blijven voldoen aan alle Toepasselijke Gegevensbeschermingswetten met betrekking tot het verstrekken van Klant Persoonsgegevens aan <strong>Dienstverlener</strong> en/of de Dienst, inclusief het doen van alle bekendmakingen, verkrijgen van alle toestemmingen, bieden van adequate keuze en implementeren van relevante waarborgen die vereist zijn onder de Toepasselijke Gegevensbeschermingswetten.
### 6. Subverwerkers {#6-subprocessors}

a. <strong>Provider</strong> zal geen Klant Persoonsgegevens verstrekken, overdragen of overhandigen aan een Subverwerker tenzij <strong>Klant</strong> de Subverwerker heeft goedgekeurd. De huidige lijst van <strong>Goedgekeurde Subverwerkers</strong> bevat de identiteit van de Subverwerkers, hun land van vestiging en hun verwachte Verwerkingstaken. <strong>Provider</strong> zal <strong>Klant</strong> ten minste 10 werkdagen van tevoren en schriftelijk informeren over voorgenomen wijzigingen in de <strong>Goedgekeurde Subverwerkers</strong>, hetzij door toevoeging of vervanging van een Subverwerker, zodat <strong>Klant</strong> voldoende tijd heeft om bezwaar te maken tegen de wijzigingen voordat <strong>Provider</strong> de nieuwe Subverwerker(s) gaat gebruiken. <strong>Provider</strong> zal <strong>Klant</strong> de benodigde informatie verstrekken om <strong>Klant</strong> in staat te stellen zijn recht uit te oefenen om bezwaar te maken tegen de wijziging van de <strong>Goedgekeurde Subverwerkers</strong>. <strong>Klant</strong> heeft 30 dagen na kennisgeving van een wijziging in de <strong>Goedgekeurde Subverwerkers</strong> om bezwaar te maken, anders wordt <strong>Klant</strong> geacht de wijzigingen te accepteren. Indien <strong>Klant</strong> binnen 30 dagen na kennisgeving bezwaar maakt tegen de wijziging, zullen <strong>Klant</strong> en <strong>Provider</strong> te goeder trouw samenwerken om het bezwaar of de zorg van <strong>Klant</strong> op te lossen.

b. Bij het inschakelen van een Subverwerker zal <strong>Provider</strong> een schriftelijke overeenkomst hebben met de Subverwerker die ervoor zorgt dat de Subverwerker alleen toegang heeft tot en gebruik maakt van Klant Persoonsgegevens (i) voor zover nodig om de aan hem uitbestede verplichtingen uit te voeren, en (ii) in overeenstemming met de voorwaarden van de <strong>Overeenkomst</strong>.

c. Indien de AVG van toepassing is op de Verwerking van Klant Persoonsgegevens, (i) worden de in deze DPA beschreven gegevensbeschermingsverplichtingen (zoals bedoeld in artikel 28, lid 3 van de AVG, indien van toepassing) ook opgelegd aan de Subverwerker, en (ii) zal de overeenkomst van <strong>Provider</strong> met de Subverwerker deze verplichtingen bevatten, inclusief details over hoe <strong>Provider</strong> en zijn Subverwerker zullen coördineren om te reageren op vragen of verzoeken over de Verwerking van Klant Persoonsgegevens. Daarnaast zal <strong>Provider</strong> op verzoek van <strong>Klant</strong> een kopie van zijn overeenkomsten (inclusief eventuele wijzigingen) met zijn Subverwerkers delen. Voor zover nodig om bedrijfsgeheimen of andere vertrouwelijke informatie, inclusief persoonsgegevens, te beschermen, mag <strong>Provider</strong> de tekst van zijn overeenkomst met zijn Subverwerker redigeren voordat een kopie wordt gedeeld.

d. <strong>Provider</strong> blijft volledig aansprakelijk voor alle verplichtingen die aan zijn Subverwerkers zijn uitbesteed, inclusief de handelingen en nalatigheden van zijn Subverwerkers bij de Verwerking van Klant Persoonsgegevens. <strong>Provider</strong> zal <strong>Klant</strong> informeren over elke tekortkoming van zijn Subverwerkers bij het nakomen van een materiële verplichting met betrekking tot Klant Persoonsgegevens onder de overeenkomst tussen <strong>Provider</strong> en de Subverwerker.


## 3. Beperkte Overdrachten {#3-restricted-transfers}

### 1. Autorisatie {#1-authorization}

<strong>Klant</strong> stemt ermee in dat <strong>Provider</strong> Klant Persoonsgegevens buiten de EER, het Verenigd Koninkrijk of ander relevant geografisch gebied mag overdragen indien nodig om de Dienst te leveren. Indien <strong>Provider</strong> Klant Persoonsgegevens overdraagt aan een gebied waarvoor de Europese Commissie of een andere relevante toezichthoudende autoriteit geen adequaatheidsbesluit heeft afgegeven, zal <strong>Provider</strong> passende waarborgen implementeren voor de overdracht van Klant Persoonsgegevens naar dat gebied in overeenstemming met de toepasselijke gegevensbeschermingswetten.

### 2. Overdrachten buiten de EER {#2-ex-eea-transfers}

<strong>Klant</strong> en <strong>Provider</strong> komen overeen dat indien de AVG de overdracht van Klant Persoonsgegevens beschermt, de overdracht plaatsvindt van <strong>Klant</strong> binnen de EER naar <strong>Provider</strong> buiten de EER, en de overdracht niet wordt geregeld door een adequaatheidsbesluit van de Europese Commissie, dat door het aangaan van deze DPA <strong>Klant</strong> en <strong>Provider</strong> geacht worden de EER SCC's en hun Bijlagen te hebben ondertekend, die hierbij door verwijzing zijn opgenomen. Elke dergelijke overdracht vindt plaats overeenkomstig de EER SCC's, die als volgt worden ingevuld:
a. Module Twee (Controller naar Verwerker) van de EER SCC's is van toepassing wanneer <strong>Klant</strong> een Controller is en <strong>Provider</strong> Persoonsgegevens van de Klant verwerkt voor <strong>Klant</strong> als Verwerker.

b. Module Drie (Verwerker naar Subverwerker) van de EER SCC's is van toepassing wanneer <strong>Klant</strong> een Verwerker is en <strong>Provider</strong> Persoonsgegevens van de Klant verwerkt namens <strong>Klant</strong> als Subverwerker.

c. Voor elke module geldt het volgende (indien van toepassing):

1. De optionele docking-clausule in Clausule 7 is niet van toepassing;

2. In Clausule 9 geldt Optie 2 (algemene schriftelijke toestemming), en de minimale termijn voor voorafgaande kennisgeving van wijzigingen in Subverwerkers is 10 werkdagen;

3. In Clausule 11 is de optionele taal niet van toepassing;

4. Alle vierkante haken in Clausule 13 worden verwijderd;

5. In Clausule 17 (Optie 1) worden de EER SCC's beheerst door de wetten van de <strong>Bevoegde Lidstaat</strong>;

6. In Clausule 18(b) worden geschillen beslecht door de rechtbanken van de <strong>Bevoegde Lidstaat</strong>; en

7. De Voorpagina van deze DPA bevat de informatie die vereist is in Bijlage I, Bijlage II en Bijlage III van de EER SCC's.

### 3. Ex-UK Transfers {#3-ex-uk-transfers}

<strong>Klant</strong> en <strong>Provider</strong> komen overeen dat indien de UK GDPR de overdracht van Persoonsgegevens van de Klant beschermt, de overdracht plaatsvindt van <strong>Klant</strong> binnen het Verenigd Koninkrijk naar <strong>Provider</strong> buiten het Verenigd Koninkrijk, en de overdracht niet wordt beheerst door een adequaatheidsbesluit van de Britse Secretary of State, dat door het aangaan van deze DPA <strong>Klant</strong> en <strong>Provider</strong> geacht worden de UK Addendum en hun Bijlagen te hebben ondertekend, die door verwijzing zijn opgenomen. Elke dergelijke overdracht vindt plaats overeenkomstig de UK Addendum, die als volgt wordt ingevuld:

a. Sectie 3.2 van deze DPA bevat de informatie die vereist is in Tabel 2 van de UK Addendum.

b. Tabel 4 van de UK Addendum wordt als volgt aangepast: Geen van beide partijen mag de UK Addendum beëindigen zoals uiteengezet in Sectie 19 van de UK Addendum; voor zover de ICO een herziene Goedgekeurde Addendum uitgeeft onder Sectie ‎18 van de UK Addendum, zullen de partijen te goeder trouw samenwerken om deze DPA dienovereenkomstig te herzien.

c. De Voorpagina bevat de informatie die vereist is door Bijlage 1A, Bijlage 1B, Bijlage II en Bijlage III van de UK Addendum.

### 4. Other International Transfers {#4-other-international-transfers}

Voor overdrachten van Persoonsgegevens waarbij de Zwitserse wetgeving (en niet de wetgeving van een EER-lidstaat of het Verenigd Koninkrijk) van toepassing is op het internationale karakter van de overdracht, worden verwijzingen naar de GDPR in Clausule 4 van de EER SCC's, voor zover wettelijk vereist, aangepast om te verwijzen naar de Zwitserse Federale Wet op de Bescherming van Persoonsgegevens of diens opvolger, en omvat het begrip toezichthoudende autoriteit de Zwitserse Federale Commissaris voor de Bescherming van Persoonsgegevens en voor de Informatieverwerking.

## 4. Security Incident Response {#4-security-incident-response}

1. Zodra <strong>Provider</strong> op de hoogte is van een Beveiligingsincident, zal <strong>Provider</strong>: (a) <strong>Klant</strong> zonder onnodige vertraging informeren wanneer dit haalbaar is, maar uiterlijk binnen 72 uur na het bekend worden van het Beveiligingsincident; (b) tijdig informatie verstrekken over het Beveiligingsincident zodra dit bekend wordt of redelijkerwijs door <strong>Klant</strong> wordt gevraagd; en (c) onmiddellijk redelijke stappen ondernemen om het Beveiligingsincident te beperken en te onderzoeken. De melding of reactie van <strong>Provider</strong> op een Beveiligingsincident zoals vereist door deze DPA zal niet worden opgevat als een erkenning door <strong>Provider</strong> van enige schuld of aansprakelijkheid voor het Beveiligingsincident.

## 5. Audit & Reports {#5-audit--reports}

### 1. Audit Rights {#1-audit-rights}

<strong>Provider</strong> zal <strong>Klant</strong> alle informatie verstrekken die redelijkerwijs nodig is om de naleving van deze DPA aan te tonen en <strong>Provider</strong> zal audits, inclusief inspecties door <strong>Klant</strong>, toestaan en daaraan bijdragen om de naleving van deze DPA door <strong>Provider</strong> te beoordelen. <strong>Provider</strong> kan echter de toegang tot gegevens of informatie beperken indien de toegang van <strong>Klant</strong> tot de informatie een negatieve invloed zou hebben op de intellectuele eigendomsrechten van <strong>Provider</strong>, vertrouwelijkheidsverplichtingen of andere verplichtingen onder toepasselijke wetgeving. <strong>Klant</strong> erkent en stemt ermee in dat het zijn auditrechten onder deze DPA en eventuele auditrechten verleend door toepasselijke gegevensbeschermingswetten alleen zal uitoefenen door <strong>Provider</strong> te instrueren te voldoen aan de onderstaande rapportage- en due diligence-vereisten. <strong>Provider</strong> zal gedurende 3 jaar na het einde van de DPA de nalevingsdocumentatie van deze DPA bewaren.
### 2. Beveiligingsrapporten {#2-security-reports}

<strong>Klant</strong> erkent dat <strong>Provider</strong> regelmatig wordt geaudit volgens de normen die zijn vastgelegd in het <strong>Beveiligingsbeleid</strong> door onafhankelijke externe auditors. Op schriftelijk verzoek zal <strong>Provider</strong> aan <strong>Klant</strong>, op vertrouwelijke basis, een samenvattende kopie van het dan geldende Rapport verstrekken, zodat <strong>Klant</strong> de naleving van de normen zoals vastgelegd in het <strong>Beveiligingsbeleid</strong> door <strong>Provider</strong> kan verifiëren.

### 3. Beveiligingsdue diligence {#3-security-due-diligence}

Naast het Rapport zal <strong>Provider</strong> redelijke verzoeken om informatie van <strong>Klant</strong> beantwoorden om de naleving van deze DPA door <strong>Provider</strong> te bevestigen, inclusief antwoorden op vragenlijsten over informatiebeveiliging, due diligence en audits, of door aanvullende informatie te verstrekken over het informatiebeveiligingsprogramma. Alle dergelijke verzoeken moeten schriftelijk worden ingediend bij de <strong>Provider Security Contact</strong> en mogen slechts eenmaal per jaar worden gedaan.


## 6. Coördinatie & Samenwerking {#6-coordination--cooperation}

### 1. Reactie op verzoeken {#1-response-to-inquiries}

Indien <strong>Provider</strong> een verzoek of vraag ontvangt van iemand anders over de verwerking van persoonsgegevens van de klant, zal <strong>Provider</strong> <strong>Klant</strong> hierover informeren en zal <strong>Provider</strong> niet reageren op het verzoek zonder voorafgaande toestemming van <strong>Klant</strong>. Voorbeelden van dit soort verzoeken zijn een gerechtelijk, administratief of toezichthoudend bevel over persoonsgegevens van de klant waarbij het informeren van <strong>Klant</strong> niet verboden is volgens de toepasselijke wetgeving, of een verzoek van een betrokkene. Indien toegestaan door de toepasselijke wetgeving, zal <strong>Provider</strong> redelijke instructies van <strong>Klant</strong> opvolgen met betrekking tot deze verzoeken, inclusief het verstrekken van statusupdates en andere door <strong>Klant</strong> redelijk gevraagde informatie. Indien een betrokkene een geldig verzoek indient op grond van toepasselijke gegevensbeschermingswetten om persoonsgegevens van <strong>Klant</strong> te verwijderen of zich af te melden voor het verstrekken van persoonsgegevens aan <strong>Provider</strong>, zal <strong>Provider</strong> <strong>Klant</strong> assisteren bij het voldoen aan het verzoek volgens de toepasselijke gegevensbeschermingswetgeving. <strong>Provider</strong> zal samenwerken met en redelijke assistentie verlenen aan <strong>Klant</strong>, op kosten van <strong>Klant</strong>, bij elke juridische reactie of andere procedurele actie die <strong>Klant</strong> onderneemt als reactie op een verzoek van een derde partij over de verwerking van persoonsgegevens van <strong>Provider</strong> onder deze DPA.

### 2. DPIA's en DTIA's {#2-dpias-and-dtias}

Indien vereist door toepasselijke gegevensbeschermingswetten, zal <strong>Provider</strong> <strong>Klant</strong> redelijkerwijs assisteren bij het uitvoeren van verplichte gegevensbeschermingseffectbeoordelingen of gegevensoverdrachtseffectbeoordelingen en consultaties met relevante gegevensbeschermingsautoriteiten, rekening houdend met de aard van de verwerking en de persoonsgegevens van de klant.


## 7. Verwijdering van persoonsgegevens van de klant {#7-deletion-of-customer-personal-data}

### 1. Verwijdering door klant {#1-deletion-by-customer}

<strong>Provider</strong> zal <strong>Klant</strong> in staat stellen om persoonsgegevens van de klant te verwijderen op een wijze die consistent is met de functionaliteit van de diensten. <strong>Provider</strong> zal deze instructie zo spoedig mogelijk opvolgen, behalve wanneer verdere opslag van persoonsgegevens van de klant vereist is volgens toepasselijke wetgeving.

### 2. Verwijdering bij afloop van de DPA {#2-deletion-at-dpa-expiration}

a. Na afloop van de DPA zal <strong>Provider</strong> persoonsgegevens van de klant retourneren of verwijderen op instructie van <strong>Klant</strong>, tenzij verdere opslag van persoonsgegevens van de klant vereist of toegestaan is volgens toepasselijke wetgeving. Indien retourneren of vernietigen niet uitvoerbaar of verboden is volgens toepasselijke wetgeving, zal <strong>Provider</strong> redelijke inspanningen leveren om verdere verwerking van persoonsgegevens van de klant te voorkomen en zal het de persoonsgegevens van de klant die nog in zijn bezit, bewaring of controle zijn, blijven beschermen. Bijvoorbeeld, toepasselijke wetgeving kan vereisen dat <strong>Provider</strong> blijft hosten of verwerken van persoonsgegevens van de klant.
b. Als <strong>Klant</strong> en <strong>Provider</strong> de EER SCC's of de UK Addendum als onderdeel van deze DPA zijn aangegaan, zal <strong>Provider</strong> alleen de certificering van verwijdering van Persoonsgegevens zoals beschreven in Clausule 8.1(d) en Clausule 8.5 van de EER SCC's aan <strong>Klant</strong> verstrekken indien <strong>Klant</strong> hierom verzoekt.


## 8. Beperking van Aansprakelijkheid {#8-limitation-of-liability}

### 1. Aansprakelijkheidsplafonds en Afstand van Schadevergoeding {#1-liability-caps-and-damages-waiver}

**Voor zover toegestaan onder de toepasselijke gegevensbeschermingswetten, is de totale cumulatieve aansprakelijkheid van elke partij jegens de andere partij voortvloeiend uit of gerelateerd aan deze DPA onderworpen aan de afstandsverklaringen, uitsluitingen en aansprakelijkheidsbeperkingen zoals vermeld in de <strong>Overeenkomst</strong>.**

### 2. Claims van Derden {#2-related-party-claims}

**Eventuele claims tegen <strong>Provider</strong> of haar Gelieerde Ondernemingen voortvloeiend uit of gerelateerd aan deze DPA kunnen alleen worden ingediend door de <strong>Klant</strong>-entiteit die partij is bij de <strong>Overeenkomst</strong>.**

### 3. Uitzonderingen {#3-exceptions}

1. Deze DPA beperkt geen aansprakelijkheid jegens een individu met betrekking tot de gegevensbeschermingsrechten van dat individu onder toepasselijke gegevensbeschermingswetten. Daarnaast beperkt deze DPA geen aansprakelijkheid tussen de partijen voor schendingen van de EER SCC's of de UK Addendum.


## 9. Tegenstrijdigheden tussen Documenten {#9-conflicts-between-documents}

1. Deze DPA maakt deel uit van en vult de Overeenkomst aan. Indien er enige inconsistentie bestaat tussen deze DPA, de <strong>Overeenkomst</strong> of enige van hun onderdelen, heeft het eerder genoemde onderdeel voorrang op het later genoemde onderdeel voor die inconsistentie: (1) de EER SCC's of de UK Addendum, (2) deze DPA, en vervolgens (3) de <strong>Overeenkomst</strong>.


## 10. Looptijd van de Overeenkomst {#10-term-of-agreement}

Deze DPA gaat in wanneer <strong>Provider</strong> en <strong>Klant</strong> akkoord gaan met een Voorblad voor de DPA en de <strong>Overeenkomst</strong> ondertekenen of elektronisch accepteren en loopt door totdat de <strong>Overeenkomst</strong> verloopt of wordt beëindigd. Echter, <strong>Provider</strong> en <strong>Klant</strong> blijven elk gebonden aan de verplichtingen in deze DPA en toepasselijke gegevensbeschermingswetten totdat <strong>Klant</strong> stopt met het overdragen van Klant Persoonsgegevens aan <strong>Provider</strong> en <strong>Provider</strong> stopt met het Verwerken van Klant Persoonsgegevens.


## 11. Toepasselijk Recht en Gekozen Rechtbanken {#11-governing-law-and-chosen-courts}

Ongeacht de toepasselijkheids- of soortgelijke clausules in de <strong>Overeenkomst</strong>, worden alle interpretaties en geschillen over deze DPA beheerst door de wetten van de <strong>Toepasselijke Staat</strong> zonder rekening te houden met diens conflictenrechtelijke bepalingen. Daarnaast, en ongeacht de forumkeuze-, jurisdictie- of soortgelijke clausules in de <strong>Overeenkomst</strong>, stemmen de partijen ermee in om elke juridische procedure, actie of procedure met betrekking tot deze DPA aan te spannen bij, en elke partij onherroepelijk onderwerpt zich aan de exclusieve jurisdictie van, de rechtbanken van de <strong>Toepasselijke Staat</strong>.


## 12. Relatie Dienstverlener {#12-service-provider-relationship}

Voor zover de California Consumer Privacy Act, Cal. Civ. Code § 1798.100 e.v. ("CCPA") van toepassing is, erkennen en stemmen de partijen ermee in dat <strong>Provider</strong> een dienstverlener is en Persoonsgegevens ontvangt van <strong>Klant</strong> om de Dienst te leveren zoals overeengekomen in de <strong>Overeenkomst</strong>, wat een zakelijk doel vormt. <strong>Provider</strong> zal geen Persoonsgegevens verkopen die door <strong>Klant</strong> zijn verstrekt onder de <strong>Overeenkomst</strong>. Daarnaast zal <strong>Provider</strong> geen Persoonsgegevens die door <strong>Klant</strong> zijn verstrekt onder de <strong>Overeenkomst</strong> bewaren, gebruiken of bekendmaken behalve voor zover noodzakelijk voor het leveren van de Dienst aan <strong>Klant</strong>, zoals vermeld in de <strong>Overeenkomst</strong>, of zoals toegestaan door toepasselijke gegevensbeschermingswetten. <strong>Provider</strong> verklaart dat zij de beperkingen van deze paragraaf begrijpt.
## 13. Definities {#13-definitions}

1. **"Toepasselijke Wetten"** betekent de wetten, regels, voorschriften, gerechtelijke bevelen en andere bindende vereisten van een relevante overheidsinstantie die van toepassing zijn op of een partij reguleren.

2. **"Toepasselijke Gegevensbeschermingswetten"** betekent de Toepasselijke Wetten die bepalen hoe de Dienst persoonsgegevens, persoonlijke gegevens, persoonlijk identificeerbare informatie of een andere soortgelijke term mag verwerken of gebruiken.

3. **"Verantwoordelijke"** heeft de betekenis zoals gegeven in de Toepasselijke Gegevensbeschermingswetten voor het bedrijf dat het doel en de omvang van de verwerking van persoonsgegevens bepaalt.

4. **"Voorblad"** betekent een document dat door de partijen is ondertekend of elektronisch is geaccepteerd en dat deze DPA Standaardvoorwaarden bevat en <strong>Provider</strong>, <strong>Klant</strong> en het onderwerp en de details van de gegevensverwerking identificeert.

5. **"Klant Persoonsgegevens"** betekent Persoonsgegevens die <strong>Klant</strong> uploadt of aan <strong>Provider</strong> verstrekt als onderdeel van de Dienst en die onder deze DPA vallen.

6. **"DPA"** betekent deze DPA Standaardvoorwaarden, het Voorblad tussen <strong>Provider</strong> en <strong>Klant</strong>, en de beleidslijnen en documenten die in het Voorblad worden genoemd of eraan zijn gehecht.

7. **"EEA SCCs"** betekent de standaardcontractbepalingen die zijn bijgevoegd bij de Uitvoeringsbeslissing 2021/914 van de Europese Commissie van 4 juni 2021 over standaardcontractbepalingen voor de doorgifte van persoonsgegevens aan derde landen krachtens Verordening (EU) 2016/679 van het Europees Parlement en de Raad.

8. **"Europese Economische Ruimte"** of **"EER"** betekent de lidstaten van de Europese Unie, Noorwegen, IJsland en Liechtenstein.

9. **"AVG"** betekent Verordening (EU) 2016/679 zoals geïmplementeerd door lokale wetgeving in de relevante EER-lidstaat.

10. **"Persoonsgegevens"** heeft de betekenis zoals gegeven in de Toepasselijke Gegevensbeschermingswetten voor persoonlijke informatie, persoonsgegevens of een andere soortgelijke term.

11. **"Verwerking"** of **"Verwerken"** heeft de betekenis zoals gegeven in de Toepasselijke Gegevensbeschermingswetten voor elk gebruik van, of het uitvoeren van een computerbewerking op, Persoonsgegevens, inclusief door automatische methoden.

12. **"Verwerker"** heeft de betekenis zoals gegeven in de Toepasselijke Gegevensbeschermingswetten voor het bedrijf dat Persoonsgegevens verwerkt namens de Verantwoordelijke.

13. **"Rapport"** betekent auditrapporten opgesteld door een ander bedrijf volgens de normen gedefinieerd in het Beveiligingsbeleid namens Provider.

14. **"Beperkte Doorgifte"** betekent (a) waar de AVG van toepassing is, een doorgifte van persoonsgegevens vanuit de EER naar een land buiten de EER dat niet onder een adequaatheidsbesluit van de Europese Commissie valt; en (b) waar de UK AVG van toepassing is, een doorgifte van persoonsgegevens vanuit het Verenigd Koninkrijk naar elk ander land dat niet onder adequaatheidsregels valt die zijn aangenomen krachtens Sectie 17A van de United Kingdom Data Protection Act 2018.

15. **"Beveiligingsincident"** betekent een Persoonsgegevensinbreuk zoals gedefinieerd in Artikel 4 van de AVG.

16. **"Dienst"** betekent het product en/of de diensten beschreven in de <strong>Overeenkomst</strong>.

17. **"Bijzondere Categorieën van Gegevens"** heeft de betekenis zoals gegeven in Artikel 9 van de AVG.

18. **"Subverwerker"** heeft de betekenis zoals gegeven in de Toepasselijke Gegevensbeschermingswetten voor een bedrijf dat, met goedkeuring en acceptatie van de Verantwoordelijke, de Verwerker helpt bij het verwerken van Persoonsgegevens namens de Verantwoordelijke.

19. **"UK AVG"** betekent Verordening (EU) 2016/679 zoals geïmplementeerd door sectie 3 van de United Kingdom's European Union (Withdrawal) Act van 2018 in het Verenigd Koninkrijk.

20. **"UK Addendum"** betekent de internationale gegevensdoorgifte-addendum bij de EEA SCCs uitgegeven door de Information Commissioner voor partijen die Beperkte Doorgiften uitvoeren onder S119A(1) Data Protection Act 2018.


## Credits {#credits}

Dit document is een afgeleide van de [Common Paper DPA Standard Terms (Versie 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) en is gelicenseerd onder [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
