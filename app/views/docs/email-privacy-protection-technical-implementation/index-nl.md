# Hoe e-mail doorsturen werkt met Forward Email: De ultieme gids {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Email privacy protection technical implementation" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Voorwoord](#foreword)
* [Wat is e-mail doorsturen?](#what-is-email-forwarding)
* [Hoe e-mail doorsturen werkt: de technische uitleg](#how-email-forwarding-works-the-technical-explanation)
  * [Het e-mail doorstuurproces](#the-email-forwarding-process)
  * [De rol van SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Hoe e-mail doorsturen werkt: de eenvoudige uitleg](#how-email-forwarding-works-the-simple-explanation)
* [E-mail doorsturen instellen met Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Meld u aan voor een account](#1-sign-up-for-an-account)
  * [2. Voeg uw domein toe](#2-add-your-domain)
  * [3. DNS-records configureren](#3-configure-dns-records)
  * [4. E-mail doorsturen aanmaken](#4-create-email-forwards)
  * [5. Begin met het gebruiken van uw nieuwe e-mailadressen](#5-start-using-your-new-email-addresses)
* [Geavanceerde functies van e-mail doorsturen](#advanced-features-of-forward-email)
  * [Wegwerpadressen](#disposable-addresses)
  * [Meerdere ontvangers en jokers](#multiple-recipients-and-wildcards)
  * [Integratie van 'E-mail verzenden als'](#send-mail-as-integration)
  * [Quantum-resistente beveiliging](#quantum-resistant-security)
  * [Individueel versleutelde SQLite-mailboxen](#individually-encrypted-sqlite-mailboxes)
* [Waarom Forward Email kiezen boven concurrenten](#why-choose-forward-email-over-competitors)
  * [1. 100% open source](#1-100-open-source)
  * [2. Privacygericht](#2-privacy-focused)
  * [3. Geen afhankelijkheid van derden](#3-no-third-party-reliance)
  * [4. Kosteneffectieve prijzen](#4-cost-effective-pricing)
  * [5. Onbeperkte hulpbronnen](#5-unlimited-resources)
  * [6. Vertrouwd door grote organisaties](#6-trusted-by-major-organizations)
* [Veelvoorkomende gebruiksscenario's voor e-maildoorsturen](#common-use-cases-for-email-forwarding)
  * [Voor bedrijven](#for-businesses)
  * [Voor ontwikkelaars](#for-developers)
  * [Voor privacybewuste personen](#for-privacy-conscious-individuals)
* [Aanbevolen procedures voor e-maildoorsturen](#best-practices-for-email-forwarding)
  * [1. Gebruik beschrijvende adressen](#1-use-descriptive-addresses)
  * [2. Implementeer de juiste authenticatie](#2-implement-proper-authentication)
  * [3. Bekijk uw forwards regelmatig](#3-regularly-review-your-forwards)
  * [4. Stel 'E-mail verzenden als' in voor naadloze antwoorden](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Gebruik catch-all-adressen met voorzichtigheid](#5-use-catch-all-addresses-cautiously)
* [Conclusie](#conclusion)

## Voorwoord {#foreword}

E-maildoorsturing is een krachtige tool die de manier waarop u uw online communicatie beheert, kan transformeren. Of u nu een bedrijfseigenaar bent die professionele e-mailadressen met uw eigen domein wilt aanmaken, een privacybewuste persoon die zijn primaire e-mailadres wil beschermen, of een ontwikkelaar die flexibel e-mailbeheer nodig heeft, inzicht in e-maildoorsturing is essentieel in het huidige digitale landschap.

Bij Forward Email hebben we 's werelds veiligste, meest private en flexibele e-maildoorstuurservice ontwikkeld. In deze uitgebreide handleiding leggen we uit hoe e-maildoorsturen werkt (zowel vanuit technisch als praktisch perspectief), begeleiden we je door ons eenvoudige installatieproces en benadrukken we waarom onze service zich onderscheidt van de concurrentie.

## Wat is e-mail doorsturen {#what-is-email-forwarding}

E-mail doorsturen is een proces waarbij e-mails die naar het ene e-mailadres worden verzonden, automatisch worden doorgestuurd naar een ander bestemmingsadres. Wanneer iemand bijvoorbeeld een e-mail stuurt naar <contact@uwdomein.com>, kan dat bericht automatisch worden doorgestuurd naar uw persoonlijke Gmail-, Outlook- of een ander e-mailaccount.

Deze ogenschijnlijk eenvoudige mogelijkheid biedt krachtige voordelen:

* **Professionele branding**: Gebruik e-mailadressen met uw eigen domein (<u@uwdomein.com>) terwijl u alles beheert vanuit uw bestaande persoonlijke inbox.
* **Privacybescherming**: Maak wegwerp- of doelspecifieke adressen aan die uw primaire e-mailadres afschermen.
* **Vereenvoudigd beheer**: Consolideer meerdere e-mailadressen in één inbox.
* **Flexibiliteit**: Maak een onbeperkt aantal adressen aan voor verschillende doeleinden zonder meerdere accounts te hoeven beheren.

## Hoe e-mail doorsturen werkt: de technische uitleg {#how-email-forwarding-works-the-technical-explanation}

Als u geïnteresseerd bent in de technische details, gaan we kijken wat er achter de schermen gebeurt wanneer een e-mail wordt doorgestuurd.

### Het e-maildoorstuurproces {#the-email-forwarding-process}

1. **DNS-configuratie**: Het proces begint met de DNS-records van uw domein. Wanneer u e-mailforwarding instelt, configureert u MX-records (Mail Exchange) die het internet laten weten waar e-mails voor uw domein moeten worden afgeleverd. Deze records verwijzen naar onze e-mailservers.

2. **E-mailontvangst**: Wanneer iemand een e-mail naar uw aangepaste domeinadres stuurt (bijvoorbeeld <u@uwdomein.com>), zoekt zijn e-mailserver de MX-records van uw domein op en bezorgt het bericht aan onze servers.

3. **Verwerking en authenticatie**: Onze servers ontvangen de e-mail en voeren verschillende belangrijke functies uit:
* Verifiëren de authenticiteit van de afzender met behulp van protocollen zoals SPF, DKIM en DMARC
* Scannen op schadelijke content
* Controleren of de ontvanger voldoet aan uw doorstuurregels

4. **Sender Rewriting**: Dit is waar de magie gebeurt. We implementeren Sender Rewriting Scheme (SRS) om het retourpad van de e-mail aan te passen. Dit is cruciaal, omdat veel e-mailproviders doorgestuurde e-mails zonder correcte SRS-implementatie afwijzen, omdat ze dan vervalst lijken.

5. **Doorsturen**: De e-mail wordt vervolgens naar uw bestemmingsadres verzonden, met de originele inhoud intact.

6. **Levering**: De e-mail arriveert in uw inbox en ziet eruit alsof deze naar uw doorstuuradres is verzonden. Hierdoor blijft de professionele uitstraling van uw aangepaste domein behouden.

### De rol van SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

SRS verdient speciale aandacht omdat het essentieel is voor betrouwbare e-maildoorsturing. Wanneer een e-mail wordt doorgestuurd, moet het adres van de afzender worden herschreven om ervoor te zorgen dat de e-mail de SPF-controles op de eindbestemming doorstaat.

Zonder SRS komen doorgestuurde e-mails vaak niet door de SPF-verificatie en worden ze als spam gemarkeerd of zelfs helemaal afgewezen. Onze SRS-implementatie zorgt ervoor dat uw doorgestuurde e-mails betrouwbaar worden afgeleverd, terwijl de oorspronkelijke afzendergegevens op een voor u transparante manier behouden blijven.

## Hoe e-mail doorsturen werkt: de eenvoudige uitleg {#how-email-forwarding-works-the-simple-explanation}

Als de technische details te overweldigend lijken, volgt hier een eenvoudigere manier om e-mail doorsturen te begrijpen:

Beschouw e-maildoorsturen als het doorsturen van fysieke post. Wanneer u naar een nieuw huis verhuist, kunt u de postdienst vragen om alle post van uw oude adres door te sturen naar uw nieuwe adres. E-maildoorsturen werkt op een vergelijkbare manier, maar dan voor digitale berichten.

Met doorsturen van e-mail:

1. U geeft aan welke e-mailadressen u op uw domein wilt instellen (zoals <verkoop@uwdomein.com> of <contact@uwdomein.com>).
2. U geeft aan waar u deze e-mails wilt laten bezorgen (bijvoorbeeld uw Gmail- of Outlook-account).
3. Wij regelen alle technische details om ervoor te zorgen dat e-mails die naar uw aangepaste adressen worden verzonden, veilig in uw opgegeven inbox aankomen.

Zo eenvoudig is het! U kunt professionele e-mailadressen gebruiken zonder uw bestaande e-mailworkflow te wijzigen.

## E-mail doorsturen instellen met Forward Email {#setting-up-email-forwarding-with-forward-email}

Een van de grootste voordelen van Forward Email is hoe eenvoudig het is in te stellen. Hier is een stapsgewijze handleiding:

### 1. Registreer voor een account {#1-sign-up-for-an-account}

Bezoek [forwardemail.net](https://forwardemail.net) en maak een gratis account aan. Het aanmelden duurt minder dan een minuut.

### 2. Voeg uw domein toe {#2-add-your-domain}

Nadat u bent ingelogd, voegt u het domein toe dat u wilt gebruiken voor e-maildoorsturing. Als u nog geen domein heeft, moet u er eerst een aanschaffen bij een domeinregistrar.

### 3. DNS-records configureren {#3-configure-dns-records}

We geven u de exacte DNS-records die u aan uw domein moet toevoegen. Dit houdt doorgaans het volgende in:

* MX-records toevoegen die naar onze e-mailservers verwijzen
* TXT-records toevoegen voor verificatie en beveiliging

De meeste domeinregistrars hebben een eenvoudige interface voor het toevoegen van deze records. We bieden gedetailleerde handleidingen voor alle grote domeinregistrars om dit proces zo soepel mogelijk te laten verlopen.

### 4. E-mail doorsturen maken {#4-create-email-forwards}

Nadat uw DNS-records zijn geverifieerd (wat meestal slechts een paar minuten duurt), kunt u e-mail doorsturen instellen. Geef hiervoor het volgende op:

* Het e-mailadres op uw domein (bijv. <contact@uwdomein.com>)
* De bestemming waar u e-mails naartoe wilt sturen (bijv. uw persoonlijke Gmail-adres)

### 5. Begin met het gebruiken van uw nieuwe e-mailadressen {#5-start-using-your-new-email-addresses}

Dat is alles! E-mails die naar uw eigen domeinadressen worden verzonden, worden nu doorgestuurd naar de door u opgegeven bestemming. U kunt zoveel doorsturingen aanmaken als u nodig hebt, inclusief catch-all-adressen die alle e-mails doorsturen die naar elk adres binnen uw domein worden verzonden.

## Geavanceerde functies van doorsturen van e-mail {#advanced-features-of-forward-email}

Hoewel de basisfunctionaliteit voor het doorsturen van e-mail op zichzelf al krachtig is, biedt Forward Email verschillende geavanceerde functies waarmee we ons onderscheiden:

### Wegwerpadressen {#disposable-addresses}

Maak specifieke of anonieme e-mailadressen aan die berichten doorsturen naar je hoofdaccount. Je kunt labels aan deze adressen toewijzen en ze op elk moment in- of uitschakelen om je inbox overzichtelijk te houden. Je echte e-mailadres wordt nooit zichtbaar.

### Meerdere ontvangers en jokers {#multiple-recipients-and-wildcards}

Stuur één adres door naar meerdere ontvangers, zodat u eenvoudig informatie met een team kunt delen. U kunt ook wildcardadressen (catch-all forwarding) gebruiken om e-mails te ontvangen die naar elk adres binnen uw domein zijn verzonden.

### Integratie van "E-mail verzenden als" {#send-mail-as-integration}

Je hoeft je inbox nooit te verlaten om e-mails te versturen vanaf je eigen domein. Verstuur en beantwoord berichten alsof ze afkomstig zijn van <jij@jedomein.com>, rechtstreeks vanuit je Gmail- of Outlook-account.

### Quantum-resistente beveiliging {#quantum-resistant-security}

Wij zijn de eerste en enige e-mailservice ter wereld die gebruikmaakt van kwantumbestendige encryptie. Zo bent u beschermd tegen zelfs de meest geavanceerde toekomstige bedreigingen.

### Individueel gecodeerde SQLite-mailboxen {#individually-encrypted-sqlite-mailboxes}

In tegenstelling tot andere aanbieders, die de e-mailadressen van alle gebruikers in gedeelde databases opslaan, gebruiken wij individueel gecodeerde SQLite-mailboxen voor ongeëvenaarde privacy en beveiliging.

## Waarom Forward Email kiezen boven concurrenten {#why-choose-forward-email-over-competitors}

Er zijn meerdere spelers op de markt voor e-mail doorsturen, maar Forward Email onderscheidt zich op een aantal belangrijke punten:

### 1. 100% open source {#1-100-open-source}

Wij zijn de enige e-maildoorstuurservice die volledig open source is, inclusief onze backendcode. Deze transparantie schept vertrouwen en maakt onafhankelijke beveiligingsaudits mogelijk. Andere services beweren misschien open source te zijn, maar geven hun backendcode niet vrij.

### 2. Privacygerichte {#2-privacy-focused}

We hebben deze service ontwikkeld omdat u recht hebt op privacy. We gebruiken robuuste encryptie met TLS, slaan geen SMTP-logs op (behalve fouten en uitgaande SMTP) en schrijven uw e-mails niet naar schijfruimte.

### 3. Geen afhankelijkheid van derden {#3-no-third-party-reliance}

In tegenstelling tot concurrenten die afhankelijk zijn van Amazon SES of andere externe diensten, behouden wij de volledige controle over onze infrastructuur, waardoor zowel de betrouwbaarheid als de privacy worden verbeterd.

### 4. Kosteneffectieve prijsstelling {#4-cost-effective-pricing}

Met ons prijsmodel kunt u kosteneffectief schalen. We rekenen geen kosten per gebruiker en u kunt betalen voor opslag naar gebruik. Voor $ 3 per maand bieden we meer functionaliteit voor een lagere prijs dan concurrenten zoals Gandi ($ 3,99 per maand).

### 5. Onbeperkte bronnen {#5-unlimited-resources}

Wij leggen geen kunstmatige limieten op voor domeinen, aliassen of e-mailadressen, zoals veel concurrenten doen.

### 6. Vertrouwd door grote organisaties {#6-trusted-by-major-organizations}

Onze service wordt gebruikt door meer dan 500.000 domeinen, waaronder bekende organisaties zoals [De Amerikaanse Marine Academie](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [De Linux Foundation](/blog/docs/linux-foundation-email-enterprise-case-study), [Canoniek/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales en vele anderen.

## Veelvoorkomende use cases voor e-maildoorsturen {#common-use-cases-for-email-forwarding}

E-mail doorsturen is de oplossing voor talloze uitdagingen voor verschillende soorten gebruikers:

### Voor bedrijven {#for-businesses}

* Maak professionele e-mailadressen aan voor verschillende afdelingen (sales@, support@, info@)
* Beheer eenvoudig e-mailcommunicatie binnen uw team
* Behoud merkconsistentie in alle communicatie
* Vereenvoudig e-mailbeheer tijdens personeelswisselingen

### Voor ontwikkelaars {#for-developers}

* Stel geautomatiseerde meldingssystemen in
* Creëer doelspecifieke adressen voor verschillende projecten
* Integreer met webhooks voor geavanceerde automatisering
* Maak gebruik van onze API voor aangepaste implementaties

### Voor privacybewuste personen {#for-privacy-conscious-individuals}

* Maak aparte e-mailadressen aan voor verschillende diensten om bij te houden wie uw gegevens deelt
* Gebruik wegwerpadressen voor eenmalige aanmeldingen
* Behoud uw privacy door uw primaire e-mailadres af te schermen
* Schakel adressen die spam beginnen te ontvangen eenvoudig uit

## Aanbevolen procedures voor e-maildoorsturen {#best-practices-for-email-forwarding}

Om het maximale uit e-maildoorsturing te halen, kunt u de volgende best practices volgen:

### 1. Gebruik beschrijvende adressen {#1-use-descriptive-addresses}

Maak e-mailadressen aan waarvan het doel duidelijk is aangegeven (bijvoorbeeld <nieuwsbrief@uwdomein.com>, <shoppen@uwdomein.com>). Zo kunt u uw inkomende e-mail beter organiseren.

### 2. Implementeer de juiste authenticatie {#2-implement-proper-authentication}

Zorg ervoor dat je domein de juiste SPF-, DKIM- en DMARC-records heeft om de afleverbaarheid te maximaliseren. Forward Email maakt dit eenvoudig met onze begeleide installatie.

### 3. Controleer regelmatig uw forwards {#3-regularly-review-your-forwards}

Controleer regelmatig of uw e-mail doorsturingen kloppen en schakel de doorsturingen uit die niet langer nodig zijn of die veel spam ontvangen.

### 4. Stel 'E-mail verzenden als' in voor naadloze antwoorden {#4-set-up-send-mail-as-for-seamless-replies}

Configureer uw belangrijkste e-mailclient om e-mails te versturen als uw aangepaste domeinadressen. Zo krijgt u een consistente ervaring bij het beantwoorden van doorgestuurde e-mails.

### 5. Gebruik catch-all-adressen voorzichtig {#5-use-catch-all-addresses-cautiously}

Hoewel verzameladressen handig zijn, kunnen ze mogelijk meer spam ontvangen. Overweeg om specifieke doorstuuradressen in te stellen voor belangrijke berichten.

## Conclusie {#conclusion}

E-maildoorsturen is een krachtige tool die professionaliteit, privacy en eenvoud in uw e-mailcommunicatie brengt. Met Forward Email krijgt u de veiligste, meest persoonlijke en flexibele e-maildoorstuurservice die er is.

Als enige 100% open-sourceprovider met kwantumbestendige encryptie en een focus op privacy, hebben we een service ontwikkeld die uw rechten respecteert en tegelijkertijd uitzonderlijke functionaliteit biedt.

Of u nu professionele e-mailadressen voor uw bedrijf wilt maken, uw privacy wilt beschermen met wegwerpadressen of het beheer van meerdere e-mailaccounts wilt vereenvoudigen: Forward Email biedt de perfecte oplossing.

Klaar om uw e-mailervaring te transformeren? [Meld je gratis aan](https://forwardemail.net) vandaag nog en sluit u aan bij de meer dan 500.000 domeinen die al profiteren van onze service.

---

*Deze blogpost is geschreven door het Forward Email-team, de makers van 's werelds veiligste, meest privé en flexibele e-maildoorstuurservice. Ga naar [forwardemail.net](https://forwardemail.net) voor meer informatie over onze service en begin vol vertrouwen met het doorsturen van e-mails.*