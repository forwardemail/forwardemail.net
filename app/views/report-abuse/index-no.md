# Rapporter misbruk {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Rapporter misbruk og spam til Forward Email" class="rounded-lg" />


## Innholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Hvordan sende inn en misbruksrapport](#how-to-submit-an-abuse-report)
* [For allmennheten](#for-the-general-public)
* [For rettshåndhevelse](#for-law-enforcement)
  * [Hvilken informasjon er tilgjengelig](#what-information-is-available)
  * [Hvilken informasjon er ikke tilgjengelig](#what-information-is-not-available)
  * [Rettsvesen basert i USA](#law-enforcement-based-in-the-united-states)
  * [Rettsvesen basert utenfor USA](#law-enforcement-based-outside-of-the-united-states)
  * [Nødanmodninger fra rettshåndhevelse](#law-enforcement-emergency-requests)
  * [Rettsvesen-forespørsler kan utløse kontovarsler](#law-enforcement-requests-may-trigger-account-notices)
  * [Rettsvesen-forespørsler om å bevare informasjon](#law-enforcement-requests-to-preserve-information)
  * [Rettsvesen som leverer prosess](#law-enforcement-serving-process)


## Ansvarsfraskrivelse {#disclaimer}

Vennligst se våre [Vilkår](/terms) som gjelder på hele nettstedet.


## Hvordan sende inn en misbruksrapport {#how-to-submit-an-abuse-report}

Vi gjennomgår misbruksrapporter og behandler informasjonsforespørsler for [allmennheten](#for-the-general-public) og [rettshåndhevelse](#for-law-enforcement) fra sak til sak via e-post.

Misbruksrapporter og informasjonsforespørsler angående brukere, e-poster, IP-adresser og/eller domener omtales samlet som en "Konto" nedenfor.

Våre e-postadresser for å kontakte oss med din forespørsel eller rapport om misbruk er: `support@forwardemail.net`, `abuse@forwardemail.net`, og `security@forwardemail.net`.

Vennligst send en kopi til alle disse e-postadressene om mulig, og send også påminnelses-e-poster hvis vi ikke følger opp innen 24-48+ timer.

Les seksjonene nedenfor for mer informasjon som kan være relevant for deg.


## For allmennheten {#for-the-general-public}

<u>**Hvis du eller noen andre er i umiddelbar fare, vennligst kontakt politi og nødetater umiddelbart.**</u>

<u>**Du bør søke profesjonell juridisk rådgivning for å gjenvinne tapt tilgang til din Konto eller for å hjelpe til med å stoppe en ondsinnet aktør.**</u>

Hvis du er offer for misbruk fra en Konto som bruker vår tjeneste, vennligst send oss din rapport på e-post til adressen ovenfor. Hvis din Konto ble overtatt av en ondsinnet aktør (f.eks. at domenet ditt nylig utløp og ble registrert på nytt av en tredjepart og deretter brukt til misbruk), vennligst send oss en rapport til adressen ovenfor med din eksakte Kontoinformasjon (f.eks. domenenavnet ditt). Vi kan hjelpe med å [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) Kontoen etter validering av ditt tidligere eierskap. Merk at vi ikke har myndighet til å hjelpe deg med å gjenvinne tilgang til din Konto.

Din juridiske representant kan råde deg til å kontakte rettshåndhevelse, din Konto-eier (f.eks. domenenavnets registrar; nettstedet hvor du registrerte domenet), og/eller henvise deg til [ICANNs side om tapte domener](https://www.icann.org/resources/pages/lost-domain-names).


## For rettshåndhevelse {#for-law-enforcement}

For de fleste forespørsler er vår mulighet til å utlevere informasjon regulert av [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), m.fl. ("ECPA"). ECPA pålegger oss å utlevere visse brukeropplysninger til rettshåndhevelse kun som svar på spesifikke typer juridiske forespørsler, inkludert stevninger, rettsordrer og ransakingsordre.

Hvis du er medlem av rettshåndhevelse og søker informasjon om en Konto, bør Kontoinformasjon samt dato- og tidsperiode inkluderes i forespørselen din. Vi kan ikke behandle altfor brede og/eller vage forespørsler – dette er for å beskytte våre brukeres data og tillit, og viktigst av alt for å holde deres data sikre.
Hvis forespørselen din signaliserer et brudd på våre [Vilkår](/terms), vil vi behandle den i henhold til våre interne beste praksiser for håndtering av misbruk – merk at dette i noen tilfeller kan resultere i suspendering og/eller utestengelse av Kontoen.

**Siden vi ikke er en domeneregistrar**, hvis du ønsker å søke etter historisk DNS-postinformasjon om et domenenavn, bør du kontakte den spesifikke domeneregistraren som tilsvarer domenet. Tjenester som [Security Trails]() kan tilby historisk oppslag av poster, men mer spesifikk og nøyaktig informasjon kan gis av registrar. For å finne ut hvem som er domeneregistrar og/eller DNS-navneserver-eiere for et domene, kan verktøyene `dig` og `whois` være nyttige (f.eks. `whois example.com` eller `dig example.com ns`). Du kan finne ut om en Konto er på en betalt plan eller gratisplan på vår tjeneste ved å utføre et DNS-postoppslag (f.eks. `dig example.com mx` og `dig example.com txt`). Hvis MX-postene ikke returnerer verdier som `mx1.forwardemail.net` og `mx2.forwardemail.net`, bruker ikke domenet vår tjeneste. Hvis TXT-postene returnerer en ren tekst e-postadresse (f.eks. `forward-email=user@example.com`), indikerer det e-postvideresendingsadressen for et domene. Hvis den i stedet returnerer en verdi som `forward-email-site-verification=XXXXXXXXXX`, indikerer det at det er på en betalt plan og videresendingskonfigurasjonen er lagret i vår database under ID-en `XXXXXXXXXX`. For mer informasjon om hvordan vår tjeneste fungerer på DNS-nivå, vennligst se vår [FAQ](/faq).

### Hvilken informasjon er tilgjengelig {#what-information-is-available}

Vennligst se vår personvernerklæring for [Innsamlet informasjon](/privacy#information-collected). Kontoer har tillatelse til å fjerne sin informasjon fra vårt system i samsvar med lover om datalagring og personvern; se vår personvernerklæring for [Fjerning av informasjon](/privacy#information-removal). Dette betyr at informasjon som etterspørres kanskje ikke er tilgjengelig på tidspunktet for forespørselen på grunn av sletting av Konto.

### Hvilken informasjon er ikke tilgjengelig {#what-information-is-not-available}

Vennligst se vår personvernerklæring for [Informasjon som ikke samles inn](/privacy#information-not-collected).

### Rettshåndhevelse basert i USA {#law-enforcement-based-in-the-united-states}

Med [unntak av nødstilfeller](#law-enforcement-emergency-requests), deler vi kontoinformasjon kun ved mottak av en gyldig stevning, ECPA amerikansk rettsordre, og/eller ransakingsordre.

Vi kan i tillegg [varsle en Konto](#law-enforcement-requests-may-trigger-account-notices) om en forespørsel fra rettshåndhevelse, med mindre vi er forhindret fra å gjøre det ved lov eller rettsordre.

Hvis vi mottar en gyldig stevning, ECPA-rettsordre, og/eller ransakingsordre, vil vi gi relevant og tilgjengelig informasjon etter beste evne.

### Rettshåndhevelse basert utenfor USA {#law-enforcement-based-outside-of-the-united-states}

Vi krever at forespørsler fra rettshåndhevelse basert utenfor USA blir levert via en av følgende:

* En amerikansk domstol.
* En håndhevelsesmyndighet under prosedyrene i en [amerikansk traktat om gjensidig rettshjelp](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* En ordre fra en utenlandsk regjering som er underlagt en utøvende avtale som USAs justisminister har fastslått og sertifisert for Kongressen oppfyller kravene i [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Nødsituasjonsforespørsler fra rettshåndhevelse {#law-enforcement-emergency-requests}

Som loven tillater i USA (f.eks. i samsvar med [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) og [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), når vi i god tro og med uavhengig verifisering av forespørreren – kan vi utlevere og dele kontoinformasjon til rettshåndhevelse uten stevning, ECPA-rettsordre, og/eller ransakingsordre når vi mener at dette uten forsinkelse er nødvendig for å forhindre død eller alvorlig fysisk skade.
Vi krever at nødhendelsesdataforespørsler ("EDR") sendes via e-post og inkluderer all relevant informasjon for å kunne tilby en rask og effektiv prosess.

Merk at vi er klar over sofistikerte spoofing-, phishing- og etterligningsangrep via e-post (f.eks. se [denne artikkelen fra The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Vår policy for behandling av EDR-er er som følger:

1. Undersøke e-posthodemetadata (f.eks. DKIM/SPF/DMARC) (eller mangel på dette) uavhengig for verifisering.

2. Gjøre vårt beste forsøk i god tro (med gjentatte forsøk om nødvendig) på å kontakte forespørreren uavhengig via telefon – for å bekrefte ektheten av forespørselen. For eksempel kan vi undersøke `.gov`-nettstedet relatert til jurisdiksjonen forespørselen kommer fra, og deretter ringe kontoret fra deres offentlig oppførte offisielle telefonnummer for å verifisere forespørselen.

### Forespørsler fra rettshåndhevelse kan utløse kontovarsler {#law-enforcement-requests-may-trigger-account-notices}

Vi kan varsle en konto og gi dem en kopi av en forespørsel fra rettshåndhevelse som gjelder dem med mindre vi er forhindret ved lov eller rettsordre fra å gjøre det (f.eks. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). I slike tilfeller, hvis aktuelt, kan vi varsle en konto når taushetspliktsordren er utløpt.

Hvis en forespørsel om informasjon fra rettshåndhevelse er gyldig, vil vi [bevare nødvendig og forespurt kontoinformasjon](#law-enforcement-requests-to-preserve-information) og gjøre en rimelig innsats for å kontakte kontoeieren via deres registrerte og verifiserte e-postadresse (f.eks. innen 7 kalenderdager). Hvis vi mottar en rettidig innsigelse (f.eks. innen 7 kalenderdager), vil vi holde tilbake deling av kontoinformasjon og fortsette den juridiske prosessen etter behov.

### Forespørsler fra rettshåndhevelse om å bevare informasjon {#law-enforcement-requests-to-preserve-information}

Vi vil etterkomme gyldige forespørsler fra rettshåndhevelse om å bevare informasjon om en konto i henhold til [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Merk at bevaring av data kun er begrenset til det som spesifikt er forespurt og som for øyeblikket er tilgjengelig.

### Rettshåndhevelse som leverer prosess {#law-enforcement-serving-process}

Vi krever at alle gyldige forespørsler fra rettshåndhevelse gir oss en gyldig og funksjonell e-postadresse som vi kan korrespondere med og sende forespurt informasjon elektronisk til.

Alle forespørsler skal sendes til e-postadressen spesifisert under [Hvordan sende inn en misbruksrapport](#how-to-submit-an-abuse-report) ovenfor.

Alle forespørsler fra rettshåndhevelse må sendes på byrå- eller avdelingsbrevpapir (f.eks. som et PDF-skannet vedlegg), fra en offisiell og relevant e-postadresse, og være signert.

Hvis det gjelder en [nødhendelsesforespørsel](#law-enforcement-emergency-requests), vennligst skriv "Nødhendelsesforespørsel fra rettshåndhevelse" i emnefeltet på e-posten.

Vennligst merk at det kan ta oss minst to uker å kunne gjennomgå og svare på forespørselen din.
