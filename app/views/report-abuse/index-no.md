# Rapporter misbruk {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Slik sender du inn en rapport om misbruk](#how-to-submit-an-abuse-report)
* [For allmennheten](#for-the-general-public)
* [For rettshåndhevelse](#for-law-enforcement)
  * [Hvilken informasjon er tilgjengelig](#what-information-is-available)
  * [Hvilken informasjon er ikke tilgjengelig](#what-information-is-not-available)
  * [Rettshåndhevelse basert i USA](#law-enforcement-based-in-the-united-states)
  * [Politi basert utenfor USA](#law-enforcement-based-outside-of-the-united-states)
  * [Nødforespørsler fra politiet](#law-enforcement-emergency-requests)
  * [Forespørsler fra politiet kan utløse kontovarsler](#law-enforcement-requests-may-trigger-account-notices)
  * [Politiets forespørsler om å bevare informasjon](#law-enforcement-requests-to-preserve-information)
  * [Prosessen med å forkynne for politiet](#law-enforcement-serving-process)

## Ansvarsfraskrivelse {#disclaimer}

Vennligst overhold vår [Vilkår](/terms), da den gjelder for hele nettstedet.

## Slik sender du inn en rapport om misbruk {#how-to-submit-an-abuse-report}

Vi gjennomgår rapporter om misbruk og sender informasjonsforespørsler for [allmennheten](#for-the-general-public) og [rettshåndhevelse](#for-law-enforcement) fra sak til sak via e-post.

Rapporter om misbruk og informasjonsforespørsler angående brukere, e-postadresser, IP-adresser og/eller domener omtales samlet som en «konto» nedenfor.

E-postadressen vår for å kontakte deg angående forespørsel eller rapport om misbruk er: `abuse@forwardemail.net`

Les avsnittene nedenfor for mer informasjon som kan være relevant for deg.

## For allmennheten {#for-the-general-public}

<u>**Hvis du eller noen andre er i overhengende fare, vennligst kontakt politiet og nødetatene umiddelbart.**</u>

<u>**Du bør søke profesjonell juridisk rådgivning for å få tilbake tapt tilgang til kontoen din eller for å stoppe en ondsinnet aktør.**</u>

Hvis du er offer for misbruk fra en konto som bruker tjenesten vår, kan du sende oss rapporten din via e-post til adressen ovenfor. Hvis kontoen din har blitt overtatt av en ondsinnet aktør (f.eks. domenet ditt nylig utløp og ble registrert på nytt av en tredjepart og deretter brukt til misbruk), kan du sende oss en rapport via e-post til adressen ovenfor med din nøyaktige kontoinformasjon (f.eks. domenenavnet ditt). Vi kan hjelpe deg med å [skyggeforbud](https://en.wikipedia.org/wiki/Shadow_banning) kontoen etter at ditt tidligere eierskap er bekreftet. Merk at vi ikke har myndighet til å hjelpe deg med å få tilbake tilgang til kontoen din.

Din juridiske representant kan råde deg til å kontakte politiet, kontoeieren din (f.eks. domenenavnets registrar; nettstedet der du registrerte domenenavnet), og/eller utsette deg til [ICANNs side om tapte domener](https://www.icann.org/resources/pages/lost-domain-names).

## For politiet {#for-law-enforcement}

For de fleste forespørsler er vår mulighet til å utlevere informasjon regulert av [Lov om personvern i elektronisk kommunikasjon](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), et seq. («ECPA»). ECPA pålegger oss å utlevere visse brukeropplysninger til politiet kun som svar på bestemte typer juridiske forespørsler, inkludert stevninger, rettskjennelser og ransakingsordrer.

Hvis du er ansatt i politiet og søker informasjon om en konto, bør kontoinformasjon samt dato- og tidsrom inkluderes i forespørselen din. Vi kan ikke behandle altfor brede og/eller vage forespørsler – dette er for å beskytte brukernes data og tillit, og viktigst av alt for å holde dataene deres sikre.

Hvis forespørselen din signaliserer et brudd på [Vilkår](/terms), vil vi behandle den i henhold til våre interne beste praksiser for håndtering av misbruk – merk at dette i noen tilfeller kan føre til suspensjon og/eller utestengelse av kontoen.

**Siden vi ikke er en domenenavnregistrator**, bør du kontakte den spesifikke domenenavnregistratoren som korresponderer med domenet hvis du ønsker å søke etter historisk DNS-postinformasjon angående et domenenavn. Tjenester som [Security Trails]() kan gi søk etter historiske poster, men mer spesifikk og nøyaktig informasjon kan gis fra registratoren. For å finne ut hvem domenenavnregistratoren og/eller DNS-navneserverne er for et domene, kan verktøyene `dig` og `whois` være nyttige (f.eks. `whois example.com` eller `dig example.com ns`). Du kan finne ut om en konto er på et betalt abonnement eller et gratis abonnement på tjenesten vår ved å utføre et DNS-postsøk (f.eks. `dig example.com mx` og `dig example.com txt`). Hvis MX-postene ikke returnerer verdier som `mx1.forwardemail.net` og `mx2.forwardemail.net`, bruker ikke domenet tjenesten vår. Hvis TXT-oppføringene returnerer en e-postadresse i ren tekst (f.eks. `forward-email=user@example.com`), indikerer det destinasjonen for videresending av e-post for et domene. Hvis den i stedet returnerer en verdi som `forward-email-site-verification=XXXXXXXXXX`, indikerer det at domenet er på et betalt abonnement, og videresendingskonfigurasjonen er lagret i databasen vår under ID-en `whois`0. Hvis du vil ha mer informasjon om hvordan tjenesten vår fungerer på DNS-nivå, kan du se `whois`1.

### Hvilken informasjon er tilgjengelig {#what-information-is-available}

Se vår personvernerklæring for [Informasjon innsamlet](/privacy#information-collected). Kontoer har lov til å fjerne informasjonen sin fra systemet vårt i samsvar med lover om datalagring og personvern. Se vår personvernerklæring for [Fjerning av informasjon](/privacy#information-removal). Dette betyr at informasjonen som forespurtes kanskje ikke er tilgjengelig på forespørselstidspunktet på grunn av sletting av kontoen.

### Hvilken informasjon er ikke tilgjengelig {#what-information-is-not-available}

Se avsnittet om personvernregler for [Informasjon ikke samlet inn](/privacy#information-not-collected).

### Politi basert i USA {#law-enforcement-based-in-the-united-states}

Med [unntak av nødsituasjoner](#law-enforcement-emergency-requests) deler vi kun kontoinformasjon etter mottak av en gyldig stevning, en amerikansk rettskjennelse i henhold til ECPA og/eller en ransakingsordre.

Vi kan i tillegg [varsle en konto](#law-enforcement-requests-may-trigger-account-notices) bruke en forespørsel fra politiet, med mindre vi er forhindret fra å gjøre det ved lov eller rettskjennelse.

Hvis vi mottar en gyldig stevning, en ECPA-rettskjennelse og/eller en ransakingsordre, vil vi gi relevant og tilgjengelig informasjon etter beste evne.

### Politi utenfor USA {#law-enforcement-based-outside-of-the-united-states}

Vi krever at forespørsler sendes til politimyndigheter utenfor USA via en av følgende:

* En domstol i USA.
* Et håndhevingsorgan under prosedyrene til en [USAs traktat om gjensidig rettshjelp](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* En ordre fra en utenlandsk regjering som er underlagt en utøvende avtale som USAs justisminister har fastslått og bekreftet overfor Kongressen oppfyller kravene i [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Forespørsler fra politiet om nødstilfeller {#law-enforcement-emergency-requests}

Som loven tillater i USA (f.eks. i samsvar med [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%20if%20the%20provider%20in%20good%20faith%20believes%20that%20an%20emergency%20involverer%20fare%20for%20død%20eller%20alvorlig%20fysisk%20skade%20for%20enhver%20person%20krever%20opplysning%20uten%20forsinkelse%20av%20kommunikasjon%20relatert%20nødsituasjonen%20eller) og [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Unntak%20for%20Offentliggjøring%20av%20kunde%20oppføringer.%20En%20leverandør%20beskrevet%20i%20underavsnitt%20\(a\)%20kan%20avsløre%20en%20oppføring%20eller%20annen%20informasjon%20som%20vedrører%20en%20abonnent%20til%20eller%20kunde%20av%20slik%20tjeneste%20\(ikke%20inkludert%20innholdet%20av%20kommunikasjon%20dekket%20av%20underavsnitt%20\(a\)\(1\)%20eller%20\(a\)\(2\)\)%2%80%94)), når det er i god tro og med uavhengig verifisering av forespørselen – vi kan utlevere og dele kontoinformasjon til politiet uten stevning, ECPA-rettskjennelse og/eller ransakingsordre når vi mener at det er nødvendig å gjøre det uten forsinkelse for å forhindre død eller alvorlig fysisk skade.

Vi krever at forespørsler om nøddata («EDR») sendes via e-post og inkluderer all relevant informasjon for å kunne tilby en rask og rask prosess.

Merk at vi er klar over sofistikerte forfalsknings-, phishing- og etterligningsangrep med e-post (se f.eks. [denne artikkelen fra The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Våre retningslinjer for behandling av EDR-er er som følger:

1. Undersøk metadataene for e-posthodet (f.eks. DKIM/SPF/DMARC) (eller mangelen på sådan) uavhengig for bekreftelse.

2. Vi skal i god tro (med gjentatte forsøk om nødvendig) gjøre vårt beste for å kontakte forespørselen uavhengig via telefon – for å bekrefte forespørselens ekthet. Vi kan for eksempel undersøke nettstedet `.gov` som er relatert til jurisdiksjonen forespørselen kommer fra, og deretter ringe kontoret fra deres offentlig oppførte offisielle telefonnummer for å bekrefte forespørselen.

### Forespørsler fra politiet kan utløse kontovarsler {#law-enforcement-requests-may-trigger-account-notices}

Vi kan varsle en konto og gi dem en kopi av en forespørsel fra politiet som gjelder dem, med mindre vi er forbudt ved lov eller rettskjennelse (f.eks. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). I slike tilfeller, hvis aktuelt, kan vi varsle en konto når taushetsplikten er utløpt.

Hvis en forespørsel om informasjon fra politiet er gyldig, vil vi [beholde nødvendig og forespurt kontoinformasjon](#law-enforcement-requests-to-preserve-information) og gjøre en rimelig innsats for å kontakte kontoeieren via deres registrerte og bekreftede e-postadresse (f.eks. innen 7 kalenderdager). Hvis vi mottar en rettidig innsigelse (f.eks. innen 7 kalenderdager), vil vi holde tilbake deling av kontoinformasjon og fortsette den juridiske prosessen etter behov.

### Forespørsler fra politiet om å bevare informasjon {#law-enforcement-requests-to-preserve-information}

Vi vil imøtekomme gyldige forespørsler fra politiet om å bevare informasjon om en konto i henhold til [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Merk at bevaring av data kun er begrenset til det som er spesifikt forespurt og tilgjengelig for øyeblikket.

### Forkynnelsesprosess for politiet {#law-enforcement-serving-process}

Vi krever at alle gyldige forespørsler fra politiet gir oss en gyldig og fungerende e-postadresse som vi kan korrespondere med og sende forespurt informasjon elektronisk til.

Alle forespørsler skal sendes til e-postadressen som er angitt under [Slik sender du inn en rapport om misbruk](#how-to-submit-an-abuse-report) ovenfor.

Alle forespørsler fra politiet må sendes på brevpapir fra etaten eller avdelingen (f.eks. som et skannet PDF-vedlegg), fra en offisiell og relevant e-postadresse, og signeres.

Hvis det gjelder en [nødforespørsel](#law-enforcement-emergency-requests), vennligst skriv «Forespørsel fra politimyndigheter i nødstilfeller» i emnefeltet i e-posten.

Vær oppmerksom på at det kan ta minst to uker før vi kan gjennomgå og svare på forespørselen din.