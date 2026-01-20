# Misbruik melden {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Vrijwaring](#disclaimer)
* [Hoe u een misbruikrapport indient](#how-to-submit-an-abuse-report)
* [Voor het grote publiek](#for-the-general-public)
* [Voor wetshandhaving](#for-law-enforcement)
  * [Welke informatie is beschikbaar](#what-information-is-available)
  * [Welke informatie is niet beschikbaar](#what-information-is-not-available)
  * [Rechtshandhaving gevestigd in de Verenigde Staten](#law-enforcement-based-in-the-united-states)
  * [Wetshandhaving buiten de Verenigde Staten](#law-enforcement-based-outside-of-the-united-states)
  * [Noodverzoeken van wetshandhaving](#law-enforcement-emergency-requests)
  * [Verzoeken van wetshandhavingsinstanties kunnen leiden tot accountmeldingen](#law-enforcement-requests-may-trigger-account-notices)
  * [Verzoeken van wetshandhavingsinstanties om informatie te bewaren](#law-enforcement-requests-to-preserve-information)
  * [Betekeningsproces van de wetshandhaving](#law-enforcement-serving-process)

## Vrijwaring {#disclaimer}

Raadpleeg onze [Voorwaarden](/terms) aangezien deze sitebreed van toepassing is.

## Hoe een misbruikrapport indienen {#how-to-submit-an-abuse-report}

Wij beoordelen misbruikmeldingen en dienen per geval verzoeken om informatie voor [algemeen publiek](#for-the-general-public) en [wetshandhaving](#for-law-enforcement) per e-mail in.

Misbruikmeldingen en informatieverzoeken met betrekking tot gebruikers, e-mailadressen, IP-adressen en/of domeinen worden hieronder gezamenlijk aangeduid als een 'Account'.

Ons e-mailadres waar u contact met ons kunt opnemen met uw verzoek of melding over misbruik is: `abuse@forwardemail.net`

Lees de onderstaande paragrafen voor meer informatie die voor u van toepassing kan zijn.

## Voor het grote publiek {#for-the-general-public}

**Als u of iemand anders in acuut gevaar verkeert, neem dan onmiddellijk contact op met de politie en de hulpdiensten.**

**U dient professioneel juridisch advies in te winnen om de verloren toegang tot uw account te herstellen of om kwaadwillenden te stoppen.**

Als u slachtoffer bent van misbruik van een account dat gebruikmaakt van onze service, stuur ons dan uw melding per e-mail naar bovenstaand adres. Als uw account is overgenomen door een kwaadwillende partij (bijvoorbeeld als uw domein onlangs is verlopen en opnieuw is geregistreerd door een derde partij en vervolgens is gebruikt voor misbruik), stuur ons dan een melding per e-mail naar bovenstaand adres met uw exacte accountgegevens (bijvoorbeeld uw domeinnaam). We kunnen u helpen om het account te [schaduwverbod](https://en.wikipedia.org/wiki/Shadow_banning) nadat uw vorige eigenaarschap is gevalideerd. Houd er rekening mee dat we niet bevoegd zijn om u te helpen weer toegang te krijgen tot uw account.

Uw juridisch vertegenwoordiger kan u adviseren contact op te nemen met de politie, de eigenaar van uw account (bijvoorbeeld de registrar van de domeinnaam; de website waar u de domeinnaam hebt geregistreerd) en/of u doorverwijzen naar [ICANN's pagina over verloren domeinen](https://www.icann.org/resources/pages/lost-domain-names).

## Voor wetshandhaving {#for-law-enforcement}

Voor de meeste verzoeken wordt onze bevoegdheid om informatie vrij te geven, beheerst door de [Wet op de privacy van elektronische communicatie](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) en volgende ('ECPA'). De ECPA verplicht ons om bepaalde gebruikersinformatie alleen aan wetshandhavingsinstanties vrij te geven in reactie op specifieke soorten juridische verzoeken, waaronder dagvaardingen, gerechtelijke bevelen en huiszoekingsbevelen.

Bent u werkzaam bij de politie en zoekt u informatie over een account? Vermeld dan de accountgegevens en de datum en tijdsperiode in uw verzoek. We kunnen geen te brede en/of vage verzoeken verwerken. Dit doen we om de gegevens en het vertrouwen van onze gebruikers te beschermen, en vooral om hun gegevens veilig te houden.

Als uw verzoek ons wijst op een schending van onze [Voorwaarden](/terms), zullen wij dit verwerken volgens onze interne best practices voor het omgaan met misbruik. Houd er rekening mee dat dit in sommige gevallen kan leiden tot opschorting en/of blokkering van het account.

**Aangezien wij geen domeinnaamregistrar zijn**, kunt u contact opnemen met de domeinnaamregistrar die bij het domein hoort als u historische DNS-recordinformatie wilt opvragen. Diensten zoals [Security Trails]() bieden mogelijk een opzoekfunctie voor historische records, maar de registrar kan u ook meer specifieke en nauwkeurige informatie verstrekken. Om te bepalen wie de domeinnaamregistrar en/of DNS-naamservers van een domein zijn, kunnen de tools `dig` en `whois` nuttig zijn (bijv. `whois example.com` of `dig example.com ns`). U kunt bepalen of een account een betaald of gratis abonnement heeft op onze service door een DNS-recordopzoeking uit te voeren (bijv. `dig example.com mx` en `dig example.com txt`). Als de MX-records geen waarden zoals `mx1.forwardemail.net` en `mx2.forwardemail.net` retourneren, maakt het domein geen gebruik van onze service. Als de TXT-records een e-mailadres in platte tekst retourneren (bijv. `forward-email=user@example.com`), geeft dat het e-maildoorstuuradres voor een domein aan. Als er in plaats daarvan een waarde zoals `forward-email-site-verification=XXXXXXXXXX` wordt geretourneerd, geeft dat aan dat het domein een betaald abonnement heeft en dat de doorstuurconfiguratie in onze database is opgeslagen onder de ID `whois`0. Raadpleeg onze `whois`1-pagina voor meer informatie over hoe onze service op DNS-niveau werkt.

### Welke informatie is beschikbaar {#what-information-is-available}

Raadpleeg ons privacybeleid voor [Verzamelde informatie](/privacy#information-collected). Accounts mogen hun gegevens uit ons systeem verwijderen in overeenstemming met de wetgeving inzake gegevensbewaring en privacy; raadpleeg ons privacybeleid voor [Informatie verwijderen](/privacy#information-removal). Dit betekent dat de gevraagde informatie mogelijk niet beschikbaar is op het moment van aanvraag vanwege het verwijderen van het account.

### Welke informatie is niet beschikbaar {#what-information-is-not-available}

Raadpleeg ons Privacybeleid voor [Informatie niet verzameld](/privacy#information-not-collected).

### Wetshandhaving gevestigd in de Verenigde Staten {#law-enforcement-based-in-the-united-states}

Met [uitzondering van noodgevallen](#law-enforcement-emergency-requests) delen wij accountgegevens alleen na ontvangst van een geldige dagvaarding, ECPA US gerechtelijk bevel en/of huiszoekingsbevel.

Wij kunnen daarnaast [een account melden](#law-enforcement-requests-may-trigger-account-notices) informeren over een verzoek van wetshandhavingsinstanties, tenzij ons dit door de wet of een gerechtelijk bevel wordt verboden.

Als wij een geldige dagvaarding, een gerechtelijk bevel conform de ECPA en/of een huiszoekingsbevel ontvangen, zullen wij de relevante en beschikbare informatie zo goed mogelijk verstrekken.

### Wetshandhaving buiten de Verenigde Staten {#law-enforcement-based-outside-of-the-united-states}

Wij vereisen dat verzoeken voor rechtshandhavingsinstanties buiten de Verenigde Staten worden ingediend via een van de volgende methoden:

* Een Amerikaanse rechtbank.
* Een handhavingsinstantie volgens de procedures van een [Verdrag inzake wederzijdse rechtshulp van de Verenigde Staten](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Een bevel van een buitenlandse overheid dat onderworpen is aan een uitvoeringsovereenkomst die de procureur-generaal van de Verenigde Staten heeft vastgesteld en aan het Congres heeft gecertificeerd, voldoet aan de vereisten van [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Noodverzoeken van wetshandhaving {#law-enforcement-emergency-requests}

Zoals de wet dit toestaat in de Verenigde Staten (bijvoorbeeld in overeenstemming met [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\) voor een overheidsinstantie als de aanbieder te goeder trouw gelooft dat een noodsituatie waarbij sprake is van gevaar voor de dood of ernstig lichamelijk letsel aan een persoon, openbaarmaking zonder vertraging vereist van communicatie met betrekking tot de noodsituatie) en [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Uitzonderingen%20voor%20openbaarmaking%20van%20klantgegevens.%E2%80%94Een%20provider%20die%20wordt%20beschreven%20in%20subsectie%20\(a\)%20mag%20een%20record%20of%20andere%20informatie%20openbaarmaken%20met%20betrekking%20tot%20een%20abonnee%20of%20klant%20van%20dergelijke%20dienst%20(niet%20inclusief%20de%20inhoud%20van%20communicaties%20die%20worden%20bedekt%20door%20subsectie%20\(a\)\(1\)%20of%20\(a\)\(2\)\)%E2%80%94)), wanneer te goeder trouw en met onafhankelijke verificatie van de aanvrager – we kunnen accountgegevens bekendmaken en delen met wetshandhavingsinstanties zonder dagvaarding, gerechtelijk bevel van de ECPA en/of huiszoekingsbevel wanneer we van mening zijn dat dit onverwijld nodig is om overlijden of ernstig lichamelijk letsel te voorkomen.

Wij eisen dat noodverzoeken om gegevens ("EDR") per e-mail worden verzonden en alle relevante informatie bevatten, zodat wij het proces tijdig en versneld kunnen uitvoeren.

Houd er rekening mee dat we op de hoogte zijn van geavanceerde spoofing-, phishing- en imitatieaanvallen op e-mail (zie bijvoorbeeld [dit artikel van The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Ons beleid voor het verwerken van EDR's is als volgt:

1. Doe onafhankelijk onderzoek naar de metadata van de e-mailheader (bijv. DKIM/SPF/DMARC) (of het ontbreken daarvan) ter verificatie.

2. We doen ons uiterste best om te goeder trouw (indien nodig met herhaalde pogingen) de aanvrager onafhankelijk telefonisch te contacteren om de authenticiteit van het verzoek te bevestigen. We kunnen bijvoorbeeld de website van `.gov` raadplegen die betrekking heeft op het rechtsgebied waar het verzoek vandaan komt, en vervolgens het kantoor bellen via het openbare officiële telefoonnummer om het verzoek te verifiëren.

### Verzoeken van wetshandhavingsinstanties kunnen accountmeldingen activeren {#law-enforcement-requests-may-trigger-account-notices}

We kunnen een account op de hoogte stellen en een kopie van een op hen betrekking hebbend verzoek van de wetshandhavingsinstanties verstrekken, tenzij we daartoe wettelijk of op last van een rechterlijk bevel worden verboden (bijv. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). In die gevallen kunnen we, indien van toepassing, een account op de hoogte stellen wanneer het geheimhoudingsbevel is verlopen.

Indien een verzoek om informatie door de wetshandhaving terecht is, zullen we [noodzakelijke en gevraagde accountgegevens bewaren](#law-enforcement-requests-to-preserve-information) en ons redelijkerwijs inspannen om contact op te nemen met de accounteigenaar via het geregistreerde en geverifieerde e-mailadres (bijvoorbeeld binnen 7 kalenderdagen). Indien we tijdig bezwaar ontvangen (bijvoorbeeld binnen 7 kalenderdagen), zullen we de accountgegevens niet meer delen en de juridische procedure indien nodig voortzetten.

### Verzoeken van wetshandhaving om informatie te bewaren {#law-enforcement-requests-to-preserve-information}

Wij zullen geldige verzoeken van wetshandhavingsinstanties om informatie over een account te bewaren honoreren conform [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Houd er rekening mee dat de bewaring van gegevens beperkt is tot wat specifiek wordt gevraagd en momenteel beschikbaar is.

### Betekeningsproces van wetshandhaving {#law-enforcement-serving-process}

Wij eisen dat alle geldige verzoeken van wetshandhavingsinstanties ons voorzien van een geldig en functioneel e-mailadres, zodat we hiermee kunnen corresponderen en de gevraagde informatie elektronisch kunnen verstrekken.

Alle verzoeken moeten worden verzonden naar het e-mailadres dat hierboven bij [Hoe u een misbruikrapport indient](#how-to-submit-an-abuse-report) is opgegeven.

Alle verzoeken van wetshandhavingsinstanties moeten op briefpapier van de instantie of afdeling worden verzonden (bijvoorbeeld als een gescande PDF-bijlage), vanaf een officieel en relevant e-mailadres en ondertekend.

Als het om een [noodverzoek](#law-enforcement-emergency-requests) gaat, vermeld dan "Verzoek van wetshandhaving bij noodgevallen" in de onderwerpregel van de e-mail.

Houd er rekening mee dat het minimaal twee weken kan duren voordat we uw verzoek kunnen beoordelen en beantwoorden.