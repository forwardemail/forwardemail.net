# Rapportér misbrug {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Sådan indsender du en misbrugsrapport](#how-to-submit-an-abuse-report)
* [Til den brede offentlighed](#for-the-general-public)
* [Til retshåndhævelse](#for-law-enforcement)
  * [Hvilke oplysninger er tilgængelige](#what-information-is-available)
  * [Hvilke oplysninger er ikke tilgængelige](#what-information-is-not-available)
  * [Retshåndhævelse med base i USA](#law-enforcement-based-in-the-united-states)
  * [Retshåndhævelse baseret uden for USA](#law-enforcement-based-outside-of-the-united-states)
  * [Anmodninger om nødsituationer hos politiet](#law-enforcement-emergency-requests)
  * [Anmodninger fra politiet kan udløse kontomeddelelser](#law-enforcement-requests-may-trigger-account-notices)
  * [Politiets anmodninger om at bevare oplysninger](#law-enforcement-requests-to-preserve-information)
  * [Procedure for forkyndelse af retshåndhævelse](#law-enforcement-serving-process)

## Ansvarsfraskrivelse {#disclaimer}

Venligst overhold vores [Vilkår](/terms), da den gælder for hele webstedet.

## Sådan indsender du en misbrugsrapport {#how-to-submit-an-abuse-report}

Vi gennemgår misbrugsrapporter og sender anmodninger om information for [offentligheden](#for-the-general-public) og [retshåndhævelse](#for-law-enforcement) fra sag til sag via e-mail.

Misbrugsrapporter og anmodninger om information vedrørende brugere, e-mails, IP-adresser og/eller domæner betegnes samlet som en "Konto" nedenfor.

Vores e-mailadresse, som du kan kontakte os med din anmodning eller rapport vedrørende misbrug, er: `abuse@forwardemail.net`

Læs afsnittene nedenfor for at få flere oplysninger, der kan være relevante for dig.

## Til den brede offentlighed {#for-the-general-public}

<u>**Hvis du eller en anden er i overhængende fare, bedes du straks kontakte politiet og redningstjenesterne.**</u>

<u>**Du bør søge professionel juridisk rådgivning for at genvinde mistet adgang til din konto eller for at hjælpe med at stoppe en ondsindet aktør.**</u>

Hvis du er offer for misbrug fra en konto, der bruger vores tjeneste, bedes du sende os din rapport via e-mail til ovenstående adresse. Hvis din konto er blevet overtaget af en ondsindet aktør (f.eks. hvis dit domæne for nylig er udløbet og er blevet genregistreret af en tredjepart og derefter brugt til misbrug), bedes du sende os en rapport via e-mail til ovenstående adresse med dine nøjagtige kontooplysninger (f.eks. dit domænenavn). Vi kan hjælpe med at [skyggeforbud](https://en.wikipedia.org/wiki/Shadow_banning) kontoen efter validering af dit tidligere ejerskab. Bemærk, at vi ikke har bemyndigelse til at hjælpe dig med at genvinde adgangen til din konto.

Din juridiske repræsentant kan råde dig til at kontakte politiet, din kontoejer (f.eks. domænenavnets registrator; det websted, hvor du registrerede domænenavnet) og/eller udsætte dig til [ICANNs side om mistede domæner](https://www.icann.org/resources/pages/lost-domain-names).

## Til politiet {#for-law-enforcement}

For de fleste anmodninger er vores mulighed for at videregive oplysninger reguleret af [Lov om beskyttelse af personlige oplysninger i elektronisk kommunikation](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) osv. ("ECPA"). ECPA pålægger os kun at videregive visse brugeroplysninger til retshåndhævende myndigheder som svar på specifikke typer juridiske anmodninger, herunder stævninger, retskendelser og ransagningskendelser.

Hvis du er medlem af politiet og søger oplysninger vedrørende en konto, skal kontooplysninger samt dato- og tidsinterval inkluderes i din anmodning. Vi kan ikke behandle alt for brede og/eller vage anmodninger – dette er for at beskytte vores brugeres data og tillid, og vigtigst af alt for at holde deres data sikre.

Hvis din anmodning signalerer en overtrædelse af vores [Vilkår](/terms), behandler vi den i henhold til vores interne bedste praksis for håndtering af misbrug – bemærk, at dette i nogle tilfælde kan resultere i suspendering og/eller udelukkelse af kontoen.

**Da vi ikke er en domænenavnsregistrator**, skal du, hvis du ønsker at søge historiske DNS-postoplysninger vedrørende et domænenavn, kontakte den specifikke domænenavnsregistrator, der svarer til domænet. Tjenester som [Security Trails]() kan muligvis give mulighed for at søge historiske poster, men mere specifikke og præcise oplysninger kan gives fra registratoren. For at bestemme, hvem domænenavnsregistratoren og/eller DNS-navneserverne ejer for et domæne, kan værktøjerne `dig` og `whois` være nyttige (f.eks. `whois example.com` eller `dig example.com ns`). Du kan afgøre, om en konto er på et betalt abonnement eller et gratis abonnement på vores tjeneste ved at udføre et DNS-postopslag (f.eks. `dig example.com mx` og `dig example.com txt`). Hvis MX-posterne ikke returnerer værdier som `mx1.forwardemail.net` og `mx2.forwardemail.net`, bruger domænet ikke vores tjeneste. Hvis TXT-posterne returnerer en e-mailadresse i almindelig tekst (f.eks. `forward-email=user@example.com`), angiver det destinationen for videresendelse af e-mailadressen for et domæne. Hvis den i stedet returnerer en værdi som `forward-email-site-verification=XXXXXXXXXX`, angiver det, at domænet er på et betalt abonnement, og videresendelseskonfigurationen er gemt i vores database under ID'et `whois`0. For mere information om, hvordan vores tjeneste fungerer på DNS-niveau, henvises til vores `whois`1.

### Hvilke oplysninger er tilgængelige {#what-information-is-available}

Se venligst afsnittet om privatlivspolitik for [Indsamlede oplysninger](/privacy#information-collected). Konti har tilladelse til at fjerne deres oplysninger fra vores system i overensstemmelse med lovgivningen om dataopbevaring og privatlivsbeskyttelse. Se venligst afsnittet om privatlivspolitik for [Fjernelse af oplysninger](/privacy#information-removal). Det betyder, at de ønskede oplysninger muligvis ikke er tilgængelige på anmodningstidspunktet på grund af sletning af kontoen.

### Hvilke oplysninger er ikke tilgængelige {#what-information-is-not-available}

Se venligst afsnittet om vores privatlivspolitik for [Oplysninger, der ikke er indsamlet](/privacy#information-not-collected).

### Politi med base i USA {#law-enforcement-based-in-the-united-states}

Med [undtagelse af nødsituationer](#law-enforcement-emergency-requests) deler vi kun kontooplysninger efter modtagelse af en gyldig stævning, en amerikansk ECPA-retskendelse og/eller en ransagningskendelse.

Vi kan desuden [underret en konto](#law-enforcement-requests-may-trigger-account-notices) kontakte os vedrørende en anmodning fra politiet, medmindre vi er forhindret i at gøre det ved lov eller retskendelse.

Hvis vi modtager en gyldig stævning, en ECPA-retskendelse og/eller en ransagningskendelse, vil vi levere relevante og tilgængelige oplysninger efter bedste evne.

### Politi med base uden for USA {#law-enforcement-based-outside-of-the-united-states}

Vi kræver, at anmodninger til retshåndhævende myndigheder uden for USA sendes via en af følgende:

* En domstol i USA.
* En håndhævelsesmyndighed i henhold til procedurerne i en [Den amerikanske traktat om gensidig retshjælp](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* En ordre fra en udenlandsk regering, der er underlagt en eksekutivaftale, som den amerikanske justitsminister har fastslået og bekræftet over for Kongressen opfylder kravene i [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Anmodninger fra politiet om nødsituationer {#law-enforcement-emergency-requests}

Som loven tillader det i USA (f.eks. i overensstemmelse med TEMP_PLACEHOLDER_to%20a%20governmental%20entity%20if%20the%20provider%20in%20good%20faith%20believes%20that%20an%20needsaging%20involverer%20fare%20for%20død%20eller%20alvorlig%20fysisk%20skade%20for%20enhver%20person%20kræver%20offentliggørelse%20uden%20forsinkelse%20af%20kommunikation%20vedrørende%20nødsituationen%20eller) og [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Undtagelser%20for%20Videregivelse%20af%20Kunde%20Optegnelser.%E2%80%94En%20udbyder%20beskrevet%20i%20underafsnit%20\(a\)%20kan%20videregive%20en%20optegnelse%20eller%20andre%20oplysninger%20vedrørende%20en%20abonnent%20til%20eller%20kunde%20af%20sådan%20tjeneste%20\(ikke%20inklusive%20indholdet%20af%20kommunikation%20dækket%20af%20underafsnit%20\(a\)\(1\)%20eller%20\(a\)\(2\)\)%E2%80%94)), når det er i god tro og med uafhængig verifikation fra anmoderen – vi kan videregive og dele kontooplysninger til politiet uden en stævning, ECPA-retskendelse og/eller ransagningskendelse, når vi mener, at det er nødvendigt at gøre det uden forsinkelse for at forhindre død eller alvorlig fysisk skade.

Vi kræver, at anmodninger om data i nødstilfælde ("EDR") sendes via e-mail og indeholder alle relevante oplysninger for at sikre en rettidig og fremskyndet proces.

Bemærk, at vi er opmærksomme på sofistikerede spoofing-, phishing- og personefterligningsangreb med e-mail (se f.eks. [denne artikel fra The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Vores politik for behandling af EDR'er er som følger:

1. Undersøg uafhængigt metadataene i e-mailheaderen (f.eks. DKIM/SPF/DMARC) (eller manglen på samme) for at verificere dem.

2. Vi vil i god tro (med gentagne forsøg om nødvendigt) gøre vores bedste for at kontakte anmoderen telefonisk – for at bekræfte anmodningens ægthed. For eksempel kan vi undersøge `.gov`-webstedet relateret til den jurisdiktion, anmodningen kommer fra, og derefter ringe til kontoret fra deres offentligt anførte officielle telefonnummer for at bekræfte anmodningen.

### Anmodninger fra politiet kan udløse kontomeddelelser {#law-enforcement-requests-may-trigger-account-notices}

Vi kan underrette en konto og give dem en kopi af en anmodning fra retshåndhævelsesorganer vedrørende dem, medmindre vi er forhindret i at gøre det ved lov eller retskendelse (f.eks. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). I disse tilfælde kan vi, hvis det er relevant, underrette en konto, når fortrolighedsordren er udløbet.

Hvis en anmodning om oplysninger fra politiet er gyldig, vil vi [opbevar nødvendige og anmodede kontooplysninger](#law-enforcement-requests-to-preserve-information) og gøre en rimelig indsats for at kontakte kontoejeren via deres registrerede og verificerede e-mailadresse (f.eks. inden for 7 kalenderdage). Hvis vi modtager en rettidig indsigelse (f.eks. inden for 7 kalenderdage), vil vi tilbageholde deling af kontooplysninger og fortsætte den juridiske proces efter behov.

### Anmodninger fra politiet om at bevare oplysninger {#law-enforcement-requests-to-preserve-information}

Vi vil imødekomme gyldige anmodninger fra politiet om at bevare oplysninger vedrørende en konto i henhold til [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Bemærk, at opbevaring af data kun er begrænset til det, der specifikt anmodes om og er tilgængeligt på nuværende tidspunkt.

### Forkyndelsesproces for retshåndhævende myndigheder {#law-enforcement-serving-process}

Vi kræver, at alle gyldige anmodninger fra politiet giver os en gyldig og funktionel e-mailadresse, som vi kan kontakte og sende de ønskede oplysninger elektronisk til.

Alle anmodninger skal sendes til den e-mailadresse, der er angivet under [Sådan indsender du en misbrugsrapport](#how-to-submit-an-abuse-report) ovenfor.

Alle anmodninger fra retshåndhævelse skal sendes på brevpapir fra en myndighed eller afdeling (f.eks. som en scannet PDF-vedhæftning), fra en officiel og relevant e-mailadresse og underskrives.

Hvis det drejer sig om en [nødanmodning](#law-enforcement-emergency-requests), bedes du skrive "Anmodning fra politiet i nødstilfælde" i emnefeltet i e-mailen.

Bemærk venligst, at det kan tage os mindst to uger at gennemgå og besvare din anmodning.