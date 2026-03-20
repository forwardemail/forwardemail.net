# Rapportér misbrug {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Rapportér misbrug og spam til Forward Email" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Sådan indsender du en misbrugsrapport](#how-to-submit-an-abuse-report)
* [For offentligheden](#for-the-general-public)
* [For retshåndhævelse](#for-law-enforcement)
  * [Hvilke oplysninger er tilgængelige](#what-information-is-available)
  * [Hvilke oplysninger er ikke tilgængelige](#what-information-is-not-available)
  * [Retshåndhævelse baseret i USA](#law-enforcement-based-in-the-united-states)
  * [Retshåndhævelse baseret uden for USA](#law-enforcement-based-outside-of-the-united-states)
  * [Nødanmodninger fra retshåndhævelse](#law-enforcement-emergency-requests)
  * [Anmodninger fra retshåndhævelse kan udløse kontobeskeder](#law-enforcement-requests-may-trigger-account-notices)
  * [Anmodninger fra retshåndhævelse om at bevare oplysninger](#law-enforcement-requests-to-preserve-information)
  * [Retshåndhævelse der udfører retslige skridt](#law-enforcement-serving-process)


## Ansvarsfraskrivelse {#disclaimer}

Se venligst vores [Vilkår](/terms), da de gælder på hele siden.


## Sådan indsender du en misbrugsrapport {#how-to-submit-an-abuse-report}

Vi gennemgår misbrugsrapporter og behandler anmodninger om oplysninger for [offentligheden](#for-the-general-public) og [retshåndhævelse](#for-law-enforcement) fra sag til sag via e-mail.

Misbrugsrapporter og anmodninger om oplysninger vedrørende brugere, e-mails, IP-adresser og/eller domæner omtales samlet som en "Konto" nedenfor.

Vores e-mailadresser til kontakt med din anmodning eller rapport vedrørende misbrug er: `support@forwardemail.net`, `abuse@forwardemail.net` og `security@forwardemail.net`.

Send venligst en kopi til alle disse e-mailadresser, hvis muligt, og send også påmindelses-e-mails, hvis vi ikke følger op inden for 24-48+ timer.

Læs afsnittene nedenfor for mere information, der kan være relevant for dig.


## For offentligheden {#for-the-general-public}

<u>**Hvis du eller en anden er i umiddelbar fare, så kontakt straks politi og nødtjenester.**</u>

<u>**Du bør søge professionel juridisk rådgivning for at genvinde tabt adgang til din Konto eller for at hjælpe med at stoppe en ondsindet aktør.**</u>

Hvis du er offer for misbrug fra en Konto, der bruger vores tjeneste, så send os venligst din rapport via e-mail til ovenstående adresse. Hvis din Konto er blevet overtaget af en ondsindet aktør (f.eks. hvis dit domæne for nylig er udløbet og er blevet genregistreret af en tredjepart og derefter brugt til misbrug), så send os en rapport til ovenstående adresse med dine præcise Kontooplysninger (f.eks. dit domænenavn). Vi kan hjælpe med at [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) Kontoen efter validering af dit tidligere ejerskab. Bemærk, at vi ikke har beføjelse til at hjælpe dig med at genvinde adgang til din Konto.

Din juridiske repræsentant kan råde dig til at kontakte retshåndhævelse, din Konto-ejer (f.eks. domæneregistratoren; hjemmesiden hvor du registrerede domænenavnet) og/eller henvise dig til [ICANNs side om mistede domæner](https://www.icann.org/resources/pages/lost-domain-names).


## For retshåndhævelse {#for-law-enforcement}

For størstedelen af anmodninger er vores mulighed for at videregive oplysninger reguleret af [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) m.fl. ("ECPA"). ECPA pålægger os kun at videregive visse brugeroplysninger til retshåndhævelse som svar på specifikke typer juridiske anmodninger, herunder stævninger, retskendelser og ransagningskendelser.

Hvis du er medlem af retshåndhævelse og søger oplysninger om en Konto, bør Kontooplysninger samt dato- og tidsinterval inkluderes i din anmodning. Vi kan ikke behandle alt for brede og/eller vage anmodninger – dette er for at beskytte vores brugeres data og tillid, og vigtigst af alt for at holde deres data sikre.
Hvis din anmodning signalerer en overtrædelse af vores [Vilkår](/terms), vil vi behandle den i henhold til vores interne bedste praksis for håndtering af misbrug – bemærk, at dette i nogle tilfælde kan resultere i suspension og/eller udelukkelse af kontoen.

**Da vi ikke er en domæneregistrator**, hvis du ønsker at søge historiske DNS-postoplysninger vedrørende et domænenavn, bør du kontakte den specifikke domæneregistrator, der svarer til domænet. Tjenester som [Security Trails]() kan tilbyde opslag af historiske poster, men mere specifik og nøjagtig information kan leveres af registratoren. For at bestemme, hvem domæneregistratoren og/eller DNS-navneserver-ejerne er for et domæne, kan værktøjerne `dig` og `whois` være nyttige (f.eks. `whois example.com` eller `dig example.com ns`). Du kan afgøre, om en konto er på en betalt plan eller gratis plan på vores tjeneste ved at foretage et DNS-postopslag (f.eks. `dig example.com mx` og `dig example.com txt`). Hvis MX-posterne ikke returnerer værdier som `mx1.forwardemail.net` og `mx2.forwardemail.net`, bruger domænet ikke vores tjeneste. Hvis TXT-posterne returnerer en almindelig tekst e-mailadresse (f.eks. `forward-email=user@example.com`), angiver det e-mailvideresendelsesdestinationen for et domæne. Hvis den i stedet returnerer en værdi som `forward-email-site-verification=XXXXXXXXXX`, angiver det, at det er på en betalt plan, og videresendelseskonfigurationen er gemt i vores database under ID'et `XXXXXXXXXX`. For mere information om, hvordan vores tjeneste fungerer på DNS-niveau, henvises til vores [FAQ](/faq).

### Hvilke oplysninger er tilgængelige {#what-information-is-available}

Se venligst vores afsnit om privatlivspolitik for [Indsamlede oplysninger](/privacy#information-collected). Konti har tilladelse til at fjerne deres oplysninger fra vores system i overensstemmelse med datalagrings- og privatlivslove; se vores afsnit om privatlivspolitik for [Fjernelse af oplysninger](/privacy#information-removal). Dette betyder, at oplysninger, der anmodes om, muligvis ikke er tilgængelige på tidspunktet for anmodningen på grund af sletning af kontoen.

### Hvilke oplysninger er ikke tilgængelige {#what-information-is-not-available}

Se venligst vores afsnit om privatlivspolitik for [Ikke indsamlede oplysninger](/privacy#information-not-collected).

### Retshåndhævelse baseret i USA {#law-enforcement-based-in-the-united-states}

Med [undtagelse af nødsituationer](#law-enforcement-emergency-requests) deler vi kun kontooplysninger ved modtagelse af en gyldig stævning, ECPA amerikansk retskendelse og/eller ransagningskendelse.

Vi kan desuden [underrette en konto](#law-enforcement-requests-may-trigger-account-notices) om en anmodning fra retshåndhævelse, medmindre vi er forhindret i at gøre det ved lov eller retskendelse.

Hvis vi modtager en gyldig stævning, ECPA retskendelse og/eller ransagningskendelse, vil vi give relevante og tilgængelige oplysninger efter bedste evne.

### Retshåndhævelse baseret uden for USA {#law-enforcement-based-outside-of-the-united-states}

Vi kræver, at anmodninger fra retshåndhævelse baseret uden for USA bliver serveret via en af følgende:

* En amerikansk domstol.
* En håndhævelsesmyndighed under procedurerne i en [amerikansk traktat om gensidig retshjælp](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* En ordre fra en udenlandsk regering, som er underlagt en udøvende aftale, som den amerikanske justitsminister har fastslået og certificeret over for Kongressen opfylder kravene i [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Nødanmodninger fra retshåndhævelse {#law-enforcement-emergency-requests}

Som loven tillader i USA (f.eks. i overensstemmelse med [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) og [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), kan vi i god tro og med uafhængig verifikation af anmoder – videregive og dele kontooplysninger med retshåndhævelse uden stævning, ECPA retskendelse og/eller ransagningskendelse, når vi mener, at det uden forsinkelse er nødvendigt for at forhindre død eller alvorlig fysisk skade.
Vi kræver, at nødanmodninger om data ("EDR") sendes via e-mail og indeholder alle relevante oplysninger for at sikre en rettidig og hurtig behandling.

Bemærk, at vi er opmærksomme på sofistikerede spoofing-, phishing- og efterligningsangreb via e-mail (f.eks. se [denne artikel fra The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Vores politik for behandling af EDR'er er som følger:

1. Uafhængigt undersøge e-mail header metadata (f.eks. DKIM/SPF/DMARC) (eller mangel på samme) til verifikation.

2. Gøre vores bedste forsøg i god tro (med gentagne forsøg om nødvendigt) på at kontakte anmoder telefonisk – for at bekræfte anmodningens ægthed. For eksempel kan vi undersøge `.gov`-webstedet relateret til den jurisdiktion, anmodningen kommer fra, og derefter ringe til kontoret på deres offentligt oplyste officielle telefonnummer for at verificere anmodningen.

### Anmodninger fra retshåndhævelse kan udløse kontobeskeder {#law-enforcement-requests-may-trigger-account-notices}

Vi kan underrette en konto og give dem en kopi af en anmodning fra retshåndhævelse vedrørende dem, medmindre vi er forhindret ved lov eller retskendelse i at gøre det (f.eks. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). I sådanne tilfælde, hvis relevant, kan vi underrette en konto, når tavshedskravet er udløbet.

Hvis en anmodning om oplysninger fra retshåndhævelse er gyldig, vil vi [bevare nødvendige og anmodede kontooplysninger](#law-enforcement-requests-to-preserve-information) og gøre en rimelig indsats for at kontakte kontoens ejer via deres registrerede og verificerede e-mailadresse (f.eks. inden for 7 kalenderdage). Hvis vi modtager en rettidig indsigelse (f.eks. inden for 7 kalenderdage), vil vi tilbageholde deling af kontooplysninger og fortsætte den juridiske proces efter behov.

### Anmodninger fra retshåndhævelse om at bevare oplysninger {#law-enforcement-requests-to-preserve-information}

Vi vil efterkomme gyldige anmodninger fra retshåndhævelse om at bevare oplysninger vedrørende en konto i henhold til [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Bemærk, at bevarelse af data kun er begrænset til det, der specifikt er anmodet om og aktuelt tilgængeligt.

### Retshåndhævelse der leverer processer {#law-enforcement-serving-process}

Vi kræver, at alle gyldige anmodninger fra retshåndhævelse indeholder en gyldig og funktionel e-mailadresse, som vi kan korrespondere med og elektronisk levere de anmodede oplysninger til.

Alle anmodninger skal sendes til den e-mailadresse, der er angivet under [Sådan indsendes en misbrugsrapport](#how-to-submit-an-abuse-report) ovenfor.

Alle anmodninger fra retshåndhævelse skal sendes på agenturets eller afdelingens brevpapir (f.eks. som en PDF-scannet vedhæftning), fra en officiel og relevant e-mailadresse og være underskrevet.

Hvis det vedrører en [nødanmodning](#law-enforcement-emergency-requests), bedes du skrive "Emergency law enforcement request" i emnefeltet på e-mailen.

Bemærk venligst, at det kan tage os mindst to uger at kunne gennemgå og svare på din anmodning.
