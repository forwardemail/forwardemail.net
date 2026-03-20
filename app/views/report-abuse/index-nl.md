# Misbruik rapporteren {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Misbruik en spam melden bij Forward Email" class="rounded-lg" />


## Inhoudsopgave {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Hoe een misbruiksrapport in te dienen](#how-to-submit-an-abuse-report)
* [Voor het algemene publiek](#for-the-general-public)
* [Voor wetshandhaving](#for-law-enforcement)
  * [Welke informatie beschikbaar is](#what-information-is-available)
  * [Welke informatie niet beschikbaar is](#what-information-is-not-available)
  * [Wetshandhaving gevestigd in de Verenigde Staten](#law-enforcement-based-in-the-united-states)
  * [Wetshandhaving gevestigd buiten de Verenigde Staten](#law-enforcement-based-outside-of-the-united-states)
  * [Spoedverzoeken van wetshandhaving](#law-enforcement-emergency-requests)
  * [Verzoeken van wetshandhaving kunnen accountmeldingen veroorzaken](#law-enforcement-requests-may-trigger-account-notices)
  * [Verzoeken van wetshandhaving om informatie te bewaren](#law-enforcement-requests-to-preserve-information)
  * [Betekening van proces door wetshandhaving](#law-enforcement-serving-process)


## Disclaimer {#disclaimer}

Raadpleeg onze [Voorwaarden](/terms) aangezien deze sitebreed van toepassing zijn.


## Hoe een misbruiksrapport in te dienen {#how-to-submit-an-abuse-report}

Wij beoordelen misbruiksrapporten en behandelen informatieverzoeken voor het [algemene publiek](#for-the-general-public) en [wetshandhaving](#for-law-enforcement) per geval via e-mail.

Misbruiksrapporten en informatieverzoeken met betrekking tot gebruikers, e-mails, IP-adressen en/of domeinen worden hieronder gezamenlijk aangeduid als een "Account".

Onze e-mailadressen om contact op te nemen met uw verzoek of rapport over misbruik zijn: `support@forwardemail.net`, `abuse@forwardemail.net` en `security@forwardemail.net`.

Stuur indien mogelijk een kopie naar al deze e-mailadressen en stuur ook herinneringsmails als wij niet binnen 24-48+ uur reageren.

Lees de onderstaande secties voor meer informatie die voor u van toepassing kan zijn.


## Voor het algemene publiek {#for-the-general-public}

<u>**Als u of iemand anders acuut gevaar loopt, neem dan onmiddellijk contact op met de politie en de hulpdiensten.**</u>

<u>**U dient professioneel juridisch advies in te winnen om verloren toegang tot uw Account te herstellen of om een kwaadwillende actor te stoppen.**</u>

Als u het slachtoffer bent van misbruik door een Account dat onze dienst gebruikt, stuur ons dan uw rapport per e-mail naar het bovenstaande adres. Als uw Account is overgenomen door een kwaadwillende actor (bijv. uw domein is recent verlopen en opnieuw geregistreerd door een derde partij en vervolgens gebruikt voor misbruik), stuur ons dan een rapport per e-mail naar het bovenstaande adres met uw exacte Accountgegevens (bijv. uw domeinnaam). Wij kunnen helpen om het Account te [shadow bannen](https://en.wikipedia.org/wiki/Shadow_banning) na validatie van uw eerdere eigendom. Houd er rekening mee dat wij niet bevoegd zijn om u te helpen de toegang tot uw Account te herstellen.

Uw juridisch vertegenwoordiger kan u adviseren contact op te nemen met wetshandhaving, de eigenaar van uw Account (bijv. de registrar van de domeinnaam; de website waar u de domeinnaam heeft geregistreerd), en/of u doorverwijzen naar de [ICANN-pagina over verloren domeinen](https://www.icann.org/resources/pages/lost-domain-names).


## Voor wetshandhaving {#for-law-enforcement}

Voor de meeste verzoeken wordt onze mogelijkheid om informatie te verstrekken geregeld door de [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), et seq. ("ECPA"). De ECPA verplicht ons om bepaalde gebruikersinformatie alleen aan wetshandhaving te verstrekken als reactie op specifieke soorten juridische verzoeken, waaronder dagvaardingen, gerechtelijke bevelen en huiszoekingsbevelen.

Als u lid bent van de wetshandhaving en informatie zoekt over een Account, dan dienen Accountinformatie evenals datum- en tijdsbereik bij uw verzoek te worden opgenomen. Wij kunnen geen te brede en/of vage verzoeken verwerken – dit is om de gegevens en het vertrouwen van onze gebruikers te beschermen en vooral om hun gegevens veilig te houden.
Als uw verzoek ons een schending van onze [Voorwaarden](/terms) signaleert, zullen wij dit verwerken volgens onze interne best practices voor het omgaan met misbruik – houd er rekening mee dat dit in sommige gevallen kan resulteren in het opschorten en/of verbannen van het Account.

**Aangezien wij geen domeinnaamregistrar zijn**, als u historische DNS-recordinformatie over een domeinnaam wilt opvragen, dient u contact op te nemen met de specifieke domeinnaamregistrar die bij het domein hoort. Diensten zoals [Security Trails]() kunnen historische recordopzoekingen bieden, maar meer specifieke en nauwkeurige informatie kan worden verstrekt door de registrar. Om te bepalen wie de domeinnaamregistrar en/of DNS-nameserver-eigenaren zijn voor een domein, kunnen de tools `dig` en `whois` nuttig zijn (bijv. `whois example.com` of `dig example.com ns`). U kunt bepalen of een Account een betaald plan of gratis plan op onze dienst heeft door een DNS-recordopzoeking uit te voeren (bijv. `dig example.com mx` en `dig example.com txt`). Als de MX-records geen waarden retourneren zoals `mx1.forwardemail.net` en `mx2.forwardemail.net`, dan gebruikt het domein onze dienst niet. Als de TXT-records een platte tekst e-mailadres retourneren (bijv. `forward-email=user@example.com`), dan geeft dat de e-maildoorstuuradresbestemming voor een domein aan. Als het in plaats daarvan een waarde retourneert zoals `forward-email-site-verification=XXXXXXXXXX`, dan betekent dit dat het op een betaald plan staat en de doorstuurconfiguratie is opgeslagen in onze database onder de ID `XXXXXXXXXX`. Voor meer informatie over hoe onze dienst op DNS-niveau werkt, verwijzen wij u naar onze [FAQ](/faq).

### Welke informatie beschikbaar is {#what-information-is-available}

Verwijs naar onze Privacybeleid-sectie voor [Verzamelde Informatie](/privacy#information-collected). Accounts mogen hun informatie uit ons systeem verwijderen in overeenstemming met gegevensbewaar- en privacywetten; zie onze Privacybeleid-sectie voor [Informatie Verwijdering](/privacy#information-removal). Dit betekent dat opgevraagde informatie mogelijk niet beschikbaar is op het moment van het verzoek vanwege verwijdering van het Account.

### Welke informatie niet beschikbaar is {#what-information-is-not-available}

Verwijs naar onze Privacybeleid-sectie voor [Niet Verzamelde Informatie](/privacy#information-not-collected).

### Wetshandhaving gevestigd in de Verenigde Staten {#law-enforcement-based-in-the-united-states}

Met uitzondering van [noodgevallen](#law-enforcement-emergency-requests), delen wij Accountinformatie alleen na ontvangst van een geldige dagvaarding, ECPA Amerikaanse gerechtelijke beschikking en/of huiszoekingsbevel.

Wij kunnen daarnaast [een Account informeren](#law-enforcement-requests-may-trigger-account-notices) over een verzoek van wetshandhaving, tenzij wij wettelijk of door een gerechtelijk bevel verboden zijn dit te doen.

Als wij een geldige dagvaarding, ECPA gerechtelijke beschikking en/of huiszoekingsbevel ontvangen, zullen wij relevante en beschikbare informatie verstrekken naar beste vermogen.

### Wetshandhaving gevestigd buiten de Verenigde Staten {#law-enforcement-based-outside-of-the-united-states}

Wij vereisen dat verzoeken voor wetshandhaving buiten de Verenigde Staten worden ingediend via een van de volgende:

* Een Amerikaanse rechtbank.
* Een handhavingsinstantie onder de procedures van een [Verenigde Staten verdrag inzake wederzijdse rechtshulp](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Een bevel van een buitenlandse overheid dat onderworpen is aan een uitvoeringsakkoord dat de procureur-generaal van de Verenigde Staten heeft vastgesteld en aan het Congres heeft gecertificeerd dat het voldoet aan de vereisten van [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Noodverzoeken van wetshandhaving {#law-enforcement-emergency-requests}

Zoals de wet toestaat in de Verenigde Staten (bijv. in overeenstemming met [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) en [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), kunnen wij, wanneer wij te goeder trouw en met onafhankelijke verificatie van de verzoeker geloven dat het zonder uitstel nodig is om overlijden of ernstig lichamelijk letsel te voorkomen, Accountinformatie aan wetshandhaving verstrekken en delen zonder dagvaarding, ECPA gerechtelijke beschikking en/of huiszoekingsbevel.
We vereisen dat noodgegevensverzoeken ("EDR") per e-mail worden verzonden en alle relevante informatie bevatten om een tijdig en versneld proces te kunnen bieden.

Houd er rekening mee dat wij op de hoogte zijn van geavanceerde spoofing-, phishing- en identiteitsfraude-aanvallen via e-mail (zie bijvoorbeeld [dit artikel van The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Ons beleid voor het verwerken van EDR's is als volgt:

1. Onderzoek onafhankelijk de e-mailheadermetadata (bijv. DKIM/SPF/DMARC) (of het ontbreken daarvan) ter verificatie.

2. Doe onze uiterste best in goed vertrouwen (met herhaalde pogingen indien nodig) om de aanvrager telefonisch zelfstandig te contacteren – om de authenticiteit van het verzoek te bevestigen. Bijvoorbeeld, we kunnen de `.gov`-website onderzoeken die gerelateerd is aan de jurisdictie van waar het verzoek afkomstig is, en vervolgens het kantoor bellen via het officieel openbaar vermelde telefoonnummer om het verzoek te verifiëren.

### Verzoeken van wetshandhaving kunnen accountmeldingen activeren {#law-enforcement-requests-may-trigger-account-notices}

We kunnen een Account op de hoogte stellen en hen een kopie van een verzoek van wetshandhaving verstrekken dat op hen betrekking heeft, tenzij we wettelijk of door een gerechtelijk bevel verboden zijn dit te doen (bijv. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). In die gevallen kunnen we, indien van toepassing, een Account informeren wanneer het zwijgorder is verlopen.

Als een verzoek om informatie door wetshandhaving geldig is, zullen we [noodzakelijke en gevraagde Accountinformatie bewaren](#law-enforcement-requests-to-preserve-information) en redelijke inspanningen leveren om contact op te nemen met de accounteigenaar via hun geregistreerde en geverifieerde e-mailadres (bijv. binnen 7 kalenderdagen). Als we tijdig bezwaar ontvangen (bijv. binnen 7 kalenderdagen), zullen we het delen van Accountinformatie achterhouden en het juridische proces voortzetten zoals nodig.

### Verzoeken van wetshandhaving om informatie te bewaren {#law-enforcement-requests-to-preserve-information}

We zullen geldige verzoeken van wetshandhaving om informatie over een Account te bewaren honoreren volgens [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Houd er rekening mee dat het bewaren van gegevens beperkt is tot wat specifiek wordt gevraagd en momenteel beschikbaar is.

### Betekening van proces door wetshandhaving {#law-enforcement-serving-process}

We vereisen dat alle geldige verzoeken van wetshandhaving ons een geldig en functioneel e-mailadres verstrekken waar we op kunnen corresponderen en gevraagde informatie elektronisch kunnen verstrekken.

Alle verzoeken dienen te worden gestuurd naar het e-mailadres dat hierboven is vermeld onder [Hoe een misbruikmelding in te dienen](#how-to-submit-an-abuse-report).

Alle verzoeken van wetshandhaving moeten worden verzonden op briefpapier van het agentschap of departement (bijv. als een PDF-scanbijlage), van een officieel en relevant e-mailadres, en ondertekend.

Als het betrekking heeft op een [noodverzoek](#law-enforcement-emergency-requests), schrijf dan "Emergency law enforcement request" in de onderwerpregel van de e-mail.

Houd er rekening mee dat het ons ten minste twee weken kan kosten om uw verzoek te kunnen beoordelen en beantwoorden.
