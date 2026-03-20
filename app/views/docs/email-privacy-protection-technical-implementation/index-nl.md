# Hoe E-mail Doorsturen Werkt met Forward Email: De Ultieme Gids {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Technische implementatie van e-mail privacybescherming" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Wat is E-mail Doorsturen](#what-is-email-forwarding)
* [Hoe E-mail Doorsturen Werkt: De Technische Uitleg](#how-email-forwarding-works-the-technical-explanation)
  * [Het Proces van E-mail Doorsturen](#the-email-forwarding-process)
  * [De Rol van SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Hoe E-mail Doorsturen Werkt: De Simpele Uitleg](#how-email-forwarding-works-the-simple-explanation)
* [E-mail Doorsturen Instellen met Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Maak een Account aan](#1-sign-up-for-an-account)
  * [2. Voeg Je Domein Toe](#2-add-your-domain)
  * [3. Configureer DNS Records](#3-configure-dns-records)
  * [4. Maak E-mail Doorstuuradressen aan](#4-create-email-forwards)
  * [5. Begin met het Gebruik van Je Nieuwe E-mailadressen](#5-start-using-your-new-email-addresses)
* [Geavanceerde Functies van Forward Email](#advanced-features-of-forward-email)
  * [Wegwerpadressen](#disposable-addresses)
  * [Meerdere Ontvangers en Wildcards](#multiple-recipients-and-wildcards)
  * ["Verzend Mail Als" Integratie](#send-mail-as-integration)
  * [Quantum-Resistente Beveiliging](#quantum-resistant-security)
  * [Individueel Versleutelde SQLite Mailboxen](#individually-encrypted-sqlite-mailboxes)
* [Waarom Kiezen voor Forward Email boven Concurrenten](#why-choose-forward-email-over-competitors)
  * [1. 100% Open-Source](#1-100-open-source)
  * [2. Privacygericht](#2-privacy-focused)
  * [3. Geen Afhankelijkheid van Derden](#3-no-third-party-reliance)
  * [4. Kosteneffectieve Prijzen](#4-cost-effective-pricing)
  * [5. Onbeperkte Middelen](#5-unlimited-resources)
  * [6. Vertrouwd door Grote Organisaties](#6-trusted-by-major-organizations)
* [Veelvoorkomende Gebruikssituaties voor E-mail Doorsturen](#common-use-cases-for-email-forwarding)
  * [Voor Bedrijven](#for-businesses)
  * [Voor Ontwikkelaars](#for-developers)
  * [Voor Privacybewuste Personen](#for-privacy-conscious-individuals)
* [Beste Praktijken voor E-mail Doorsturen](#best-practices-for-email-forwarding)
  * [1. Gebruik Beschrijvende Adressen](#1-use-descriptive-addresses)
  * [2. Implementeer Juiste Authenticatie](#2-implement-proper-authentication)
  * [3. Beoordeel Je Doorstuuradressen Regelmatig](#3-regularly-review-your-forwards)
  * [4. Stel "Verzend Mail Als" in voor Naadloze Antwoorden](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Gebruik Catch-All Adressen Voorzichtig](#5-use-catch-all-addresses-cautiously)
* [Conclusie](#conclusion)


## Voorwoord {#foreword}

E-mail doorsturen is een krachtig hulpmiddel dat kan transformeren hoe je je online communicatie beheert. Of je nu een ondernemer bent die professionele e-mailadressen met je eigen domein wil creëren, een privacybewuste persoon die je primaire e-mail wil beschermen, of een ontwikkelaar die flexibele e-mailbeheer nodig heeft, het begrijpen van e-mail doorsturen is essentieel in het digitale tijdperk van vandaag.

Bij Forward Email hebben we 's werelds meest veilige, private en flexibele e-mail doorstuurservice gebouwd. In deze uitgebreide gids leggen we uit hoe e-mail doorsturen werkt (zowel technisch als praktisch), begeleiden we je door ons eenvoudige installatieproces, en benadrukken we waarom onze service zich onderscheidt van concurrenten.


## Wat is E-mail Doorsturen {#what-is-email-forwarding}

E-mail doorsturen is een proces dat automatisch e-mails die naar één e-mailadres worden gestuurd, doorstuurt naar een ander bestemmingsadres. Bijvoorbeeld, wanneer iemand een e-mail stuurt naar <contact@yourdomain.com>, kan dat bericht automatisch worden doorgestuurd naar je persoonlijke Gmail-, Outlook- of een ander e-mailaccount.

Deze ogenschijnlijk eenvoudige functie biedt krachtige voordelen:

* **Professionele Branding**: Gebruik e-mailadressen met je eigen domein (<you@yourdomain.com>) terwijl je alles beheert vanuit je bestaande persoonlijke inbox
* **Privacybescherming**: Maak wegwerp- of doelgerichte adressen die je primaire e-mail afschermen
* **Vereenvoudigd Beheer**: Consolideer meerdere e-mailadressen in één enkele inbox
* **Flexibiliteit**: Maak onbeperkte adressen voor verschillende doeleinden zonder meerdere accounts te beheren
## Hoe E-mail Doorsturen Werkt: De Technische Uitleg {#how-email-forwarding-works-the-technical-explanation}

Voor degenen die geïnteresseerd zijn in de technische details, laten we eens bekijken wat er achter de schermen gebeurt wanneer een e-mail wordt doorgestuurd.

### Het Proces van E-mail Doorsturen {#the-email-forwarding-process}

1. **DNS-configuratie**: Het proces begint met de DNS-records van je domein. Wanneer je e-maildoorsturen instelt, configureer je MX (Mail Exchange) records die het internet vertellen waar e-mails voor jouw domein afgeleverd moeten worden. Deze records wijzen naar onze e-mailservers.

2. **Ontvangst van e-mail**: Wanneer iemand een e-mail stuurt naar je aangepaste domeinadres (bijv. <you@yourdomain.com>), zoekt hun e-mailserver de MX-records van jouw domein op en levert het bericht af bij onze servers.

3. **Verwerking en authenticatie**: Onze servers ontvangen de e-mail en voeren verschillende kritieke functies uit:
   * Verifiëren de authenticiteit van de afzender met protocollen zoals SPF, DKIM en DMARC
   * Scannen op kwaadaardige inhoud
   * Controleren de ontvanger aan de hand van jouw doorstuurregels

4. **Afzender herschrijven**: Hier gebeurt de magie. We implementeren Sender Rewriting Scheme (SRS) om het return path van de e-mail aan te passen. Dit is cruciaal omdat veel e-mailproviders doorgestuurde e-mails zonder correcte SRS-implementatie weigeren, omdat ze als spoofing kunnen worden gezien.

5. **Doorsturen**: De e-mail wordt vervolgens verzonden naar je bestemmingsadres met de originele inhoud intact.

6. **Bezorging**: De e-mail komt aan in je inbox, en lijkt alsof deze rechtstreeks naar je doorstuuradres is gestuurd, waardoor het professionele uiterlijk van je aangepaste domein behouden blijft.

### De Rol van SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

SRS verdient speciale aandacht omdat het essentieel is voor betrouwbare e-maildoorsturing. Wanneer een e-mail wordt doorgestuurd, moet het afzenderadres worden herschreven om ervoor te zorgen dat de e-mail de SPF-controles op de uiteindelijke bestemming doorstaat.

Zonder SRS falen doorgestuurde e-mails vaak de SPF-verificatie en worden ze als spam gemarkeerd of helemaal geweigerd. Onze implementatie van SRS zorgt ervoor dat je doorgestuurde e-mails betrouwbaar worden afgeleverd, terwijl de originele afzenderinformatie op een transparante manier behouden blijft.


## Hoe E-mail Doorsturen Werkt: De Simpele Uitleg {#how-email-forwarding-works-the-simple-explanation}

Als de technische details overweldigend lijken, is hier een eenvoudigere manier om e-maildoorsturen te begrijpen:

Denk aan e-maildoorsturen als het doorsturen van fysieke post. Wanneer je verhuist naar een nieuw huis, kun je de postdienst vragen om alle post van je oude adres naar je nieuwe adres door te sturen. E-maildoorsturen werkt op een vergelijkbare manier, maar dan voor digitale berichten.

Met Forward Email:

1. Je vertelt ons welke e-mailadressen op je domein je wilt instellen (zoals <sales@yourdomain.com> of <contact@yourdomain.com>)
2. Je vertelt ons waar je die e-mails wilt ontvangen (zoals je Gmail- of Outlook-account)
3. Wij regelen alle technische details zodat e-mails die naar je aangepaste adressen worden gestuurd veilig in je opgegeven inbox aankomen

Zo simpel is het! Je kunt professionele e-mailadressen gebruiken zonder je bestaande e-mailworkflow te veranderen.


## E-mail Doorsturen Instellen met Forward Email {#setting-up-email-forwarding-with-forward-email}

Een van de grootste voordelen van Forward Email is hoe eenvoudig het is om in te stellen. Hier is een stapsgewijze handleiding:

### 1. Maak een Account aan {#1-sign-up-for-an-account}

Bezoek [forwardemail.net](https://forwardemail.net) en maak een gratis account aan. Ons aanmeldproces duurt minder dan een minuut.

### 2. Voeg je Domein toe {#2-add-your-domain}

Eenmaal ingelogd, voeg je het domein toe dat je wilt gebruiken voor e-maildoorsturen. Als je nog geen domein bezit, moet je er eerst een kopen bij een domeinregistrar.

### 3. Configureer DNS-records {#3-configure-dns-records}

We geven je de exacte DNS-records die je aan je domein moet toevoegen. Dit houdt meestal in:

* MX-records toevoegen die naar onze e-mailservers wijzen
* TXT-records toevoegen voor verificatie en beveiliging

De meeste domeinregistrars hebben een eenvoudige interface om deze records toe te voegen. We bieden gedetailleerde handleidingen voor alle grote domeinregistrars om dit proces zo soepel mogelijk te maken.
### 4. Maak E-mail Doorstuuradressen aan {#4-create-email-forwards}

Nadat je DNS-records zijn geverifieerd (wat meestal slechts een paar minuten duurt), kun je e-mail doorstuuradressen aanmaken. Geef eenvoudig op:

* Het e-mailadres op je domein (bijv. <contact@yourdomain.com>)
* De bestemming waar je e-mails naartoe wilt laten sturen (bijv. je persoonlijke Gmail-adres)

### 5. Begin met het Gebruiken van Je Nieuwe E-mailadressen {#5-start-using-your-new-email-addresses}

Dat is alles! E-mails die naar je aangepaste domeinadressen worden gestuurd, worden nu doorgestuurd naar de door jou opgegeven bestemming. Je kunt zoveel doorstuuradressen aanmaken als je nodig hebt, inclusief catch-all adressen die alle e-mails doorsturen die naar elk adres op je domein worden gestuurd.


## Geavanceerde Functies van Forward Email {#advanced-features-of-forward-email}

Hoewel basis e-maildoorsturing op zichzelf al krachtig is, biedt Forward Email verschillende geavanceerde functies die ons onderscheiden:

### Wegwerpadressen {#disposable-addresses}

Maak specifieke of anonieme e-mailadressen aan die doorsturen naar je hoofdaccount. Je kunt labels aan deze adressen toewijzen en ze op elk moment in- of uitschakelen om je inbox georganiseerd te houden. Je werkelijke e-mailadres wordt nooit blootgesteld.

### Meerdere Ontvangers en Wildcards {#multiple-recipients-and-wildcards}

Stuur een enkel adres door naar meerdere ontvangers, zodat je gemakkelijk informatie met een team kunt delen. Je kunt ook wildcard-adressen gebruiken (catch-all doorsturing) om e-mails te ontvangen die naar elk adres op je domein worden gestuurd.

### "Verstuur Mail Als" Integratie {#send-mail-as-integration}

Je hoeft je inbox nooit te verlaten om e-mails te versturen vanaf je aangepaste domein. Verstuur en beantwoord berichten alsof ze van <you@yourdomain.com> komen, rechtstreeks vanuit je Gmail- of Outlook-account.

### Kwantumbestendige Beveiliging {#quantum-resistant-security}

Wij zijn de eerste en enige e-mailservice ter wereld die kwantumbestendige encryptie gebruikt, waardoor je communicatie beschermd is tegen zelfs de meest geavanceerde toekomstige bedreigingen.

### Individueel Versleutelde SQLite Mailboxes {#individually-encrypted-sqlite-mailboxes}

In tegenstelling tot andere providers die alle gebruikersmails in gedeelde databases opslaan, gebruiken wij individueel versleutelde SQLite-mailboxes voor ongeëvenaarde privacy en beveiliging.


## Waarom Kiezen voor Forward Email boven Concurrenten {#why-choose-forward-email-over-competitors}

De markt voor e-maildoorsturing kent verschillende aanbieders, maar Forward Email onderscheidt zich op een aantal belangrijke manieren:

### 1. 100% Open-Source {#1-100-open-source}

Wij zijn de enige e-maildoorstuurservice die volledig open-source is, inclusief onze backend-code. Deze transparantie bouwt vertrouwen op en maakt onafhankelijke beveiligingsaudits mogelijk. Andere diensten beweren open-source te zijn, maar publiceren hun backend-code niet.

### 2. Privacygericht {#2-privacy-focused}

We hebben deze service gemaakt omdat je recht hebt op privacy. We gebruiken sterke encryptie met TLS, slaan geen SMTP-logs op (behalve bij fouten en uitgaande SMTP), en schrijven je e-mails niet naar schijfopslag.

### 3. Geen Afhankelijkheid van Derden {#3-no-third-party-reliance}

In tegenstelling tot concurrenten die afhankelijk zijn van Amazon SES of andere derden, behouden wij volledige controle over onze infrastructuur, wat zowel de betrouwbaarheid als de privacy verbetert.

### 4. Kosteneffectieve Prijsstelling {#4-cost-effective-pricing}

Ons prijsmodel stelt je in staat kosteneffectief te schalen. We rekenen niet per gebruiker en je betaalt alleen voor opslag naar gebruik. Voor $3/maand bieden wij meer functies tegen een lagere prijs dan concurrenten zoals Gandi ($3,99/maand).

### 5. Onbeperkte Middelen {#5-unlimited-resources}

Wij stellen geen kunstmatige limieten aan domeinen, aliassen of e-mailadressen zoals veel concurrenten doen.

### 6. Vertrouwd door Grote Organisaties {#6-trusted-by-major-organizations}

Onze service wordt gebruikt door meer dan 500.000 domeinen, waaronder bekende organisaties zoals [The U.S. Naval Academy](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [The Linux Foundation](/blog/docs/linux-foundation-email-enterprise-case-study), [Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales en vele anderen.


## Veelvoorkomende Gebruikssituaties voor E-maildoorsturing {#common-use-cases-for-email-forwarding}
E-mail doorsturen lost tal van uitdagingen op voor verschillende soorten gebruikers:

### Voor bedrijven {#for-businesses}

* Maak professionele e-mailadressen aan voor verschillende afdelingen (sales@, support@, info@)
* Beheer eenvoudig team-e-mailcommunicatie
* Behoud merkconsistentie in alle communicatie
* Vereenvoudig e-mailbeheer tijdens personeelswisselingen

### Voor ontwikkelaars {#for-developers}

* Stel geautomatiseerde notificatiesystemen in
* Maak doelgerichte adressen aan voor verschillende projecten
* Integreer met webhooks voor geavanceerde automatisering
* Maak gebruik van onze API voor maatwerkimplementaties

### Voor privacybewuste personen {#for-privacy-conscious-individuals}

* Maak aparte e-mailadressen aan voor verschillende diensten om te volgen wie uw informatie deelt
* Gebruik wegwerpadressen voor eenmalige aanmeldingen
* Behoud privacy door uw primaire e-mailadres te beschermen
* Schakel eenvoudig adressen uit die spam beginnen te ontvangen


## Beste praktijken voor e-mail doorsturen {#best-practices-for-email-forwarding}

Om het meeste uit e-mail doorsturen te halen, overweeg deze beste praktijken:

### 1. Gebruik beschrijvende adressen {#1-use-descriptive-addresses}

Maak e-mailadressen die duidelijk hun doel aangeven (bijv. <newsletter@yourdomain.com>, <shopping@yourdomain.com>) om uw inkomende mail te organiseren.

### 2. Implementeer juiste authenticatie {#2-implement-proper-authentication}

Zorg dat uw domein correcte SPF-, DKIM- en DMARC-records heeft om de afleverbaarheid te maximaliseren. Forward Email maakt dit eenvoudig met onze begeleide setup.

### 3. Controleer uw doorstuuradressen regelmatig {#3-regularly-review-your-forwards}

Audit periodiek uw e-maildoorstuuradressen om adressen uit te schakelen die niet langer nodig zijn of te veel spam ontvangen.

### 4. Stel "Verzenden als" in voor naadloze antwoorden {#4-set-up-send-mail-as-for-seamless-replies}

Configureer uw hoofd-e-mailclient om te verzenden als uw aangepaste domeinadressen voor een consistente ervaring bij het beantwoorden van doorgestuurde e-mails.

### 5. Gebruik catch-all adressen met voorzichtigheid {#5-use-catch-all-addresses-cautiously}

Hoewel catch-all adressen handig zijn, kunnen ze mogelijk meer spam ontvangen. Overweeg specifieke doorstuuradressen aan te maken voor belangrijke communicatie.


## Conclusie {#conclusion}

E-mail doorsturen is een krachtig hulpmiddel dat professionaliteit, privacy en eenvoud brengt in uw e-mailcommunicatie. Met Forward Email krijgt u de meest veilige, private en flexibele e-maildoorstuurservice die beschikbaar is.

Als de enige 100% open-source provider met kwantumveilige encryptie en een focus op privacy, hebben we een dienst gebouwd die uw rechten respecteert en tegelijkertijd uitzonderlijke functionaliteit levert.

Of u nu professionele e-mailadressen voor uw bedrijf wilt aanmaken, uw privacy wilt beschermen met wegwerpadressen, of het beheer van meerdere e-mailaccounts wilt vereenvoudigen, Forward Email biedt de perfecte oplossing.

Klaar om uw e-mailervaring te transformeren? [Meld u vandaag gratis aan](https://forwardemail.net) en sluit u aan bij meer dan 500.000 domeinen die al profiteren van onze service.

---

*Deze blogpost is geschreven door het Forward Email-team, makers van 's werelds meest veilige, private en flexibele e-maildoorstuurservice. Bezoek [forwardemail.net](https://forwardemail.net) om meer te leren over onze service en begin met vertrouwen e-mails door te sturen.*
