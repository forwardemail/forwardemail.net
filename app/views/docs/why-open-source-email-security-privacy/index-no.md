# Hvorfor åpen kildekode-e-post er fremtiden: Fordelen med videresendt e-post {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Fordelen med åpen kildekode: Mer enn bare markedsføring](#the-open-source-advantage-more-than-just-marketing)
  * [Hva ekte åpen kildekode betyr](#what-true-open-source-means)
  * [Backend-problemet: Hvor de fleste "åpen kildekode" e-posttjenester kommer til kort](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Videresend e-post: 100 % åpen kildekode, frontend OG backend](#forward-email-100-open-source-frontend-and-backend)
  * [Vår unike tekniske tilnærming](#our-unique-technical-approach)
* [Alternativet for selvhosting: Valgfrihet](#the-self-hosting-option-freedom-of-choice)
  * [Hvorfor vi støtter Self-Hosting](#why-we-support-self-hosting)
  * [Realiteten til selvhostende e-post](#the-reality-of-self-hosting-email)
* [Hvorfor vår betalte tjeneste gir mening (selv om vi er åpen kildekode)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Kostnadssammenligning](#cost-comparison)
  * [Det beste fra begge verdener](#the-best-of-both-worlds)
* [Lukket kildebedrag: Hva Proton og Tutanota ikke forteller deg](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mails åpen kildekode-påstander](#proton-mails-open-source-claims)
  * [Tutanotas lignende tilnærming](#tutanotas-similar-approach)
  * [Debatten om personvernguider](#the-privacy-guides-debate)
* [Fremtiden er åpen kildekode](#the-future-is-open-source)
  * [Hvorfor åpen kildekode vinner](#why-open-source-is-winning)
* [Gjør bytte til å videresende e-post](#making-the-switch-to-forward-email)
* [Konklusjon: E-post med åpen kildekode for en privat fremtid](#conclusion-open-source-email-for-a-private-future)

## Forord {#foreword}

I en tid hvor bekymringer for digitalt personvern er på et rekordhøyt nivå, betyr e-posttjenestene vi velger mer enn noen gang. Mens mange leverandører hevder å prioritere personvernet ditt, er det en grunnleggende forskjell mellom de som bare snakker om personvern og de som virkelig går på tur. Hos Forward Email har vi bygget tjenesten vår på et grunnlag av fullstendig åpenhet gjennom åpen kildekode-utvikling – ikke bare i frontend-applikasjonene våre, men i hele infrastrukturen vår.

Dette blogginnlegget utforsker hvorfor åpen kildekode-e-postløsninger er overlegne alternativer med lukket kildekode, hvordan vår tilnærming skiller seg fra konkurrenter som Proton Mail og Tutanota, og hvorfor – til tross for vår forpliktelse til alternativer for selvhosting – gir vår betalte tjeneste den beste verdien for de fleste brukere.

## Fordelen med åpen kildekode: Mer enn bare markedsføring {#the-open-source-advantage-more-than-just-marketing}

Begrepet «åpen kildekode» har blitt et populært markedsføringsbudskap de siste årene, og det globale markedet for åpne kildekode-tjenester forventes å vokse med en årlig vekstrate (CAGR) på over 16 % mellom 2024 og 2032. Men hva betyr det å være virkelig åpen kildekode, og hvorfor er det viktig for personvernet ditt innen e-post?

### Hva ekte åpen kildekode betyr {#what-true-open-source-means}

Programvare med åpen kildekode gjør hele kildekoden fritt tilgjengelig for alle å inspisere, modifisere og forbedre. Denne åpenheten skaper et miljø der:

* Sikkerhetssårbarheter kan identifiseres og fikses av et globalt fellesskap av utviklere
* Personvernkrav kan verifiseres gjennom uavhengig kodegjennomgang
* Brukere er ikke låst til proprietære økosystemer
* Innovasjon skjer raskere gjennom samarbeidende forbedringer

Når det gjelder e-post – ryggraden i din online identitet – er denne åpenheten ikke bare fin å ha; det er avgjørende for ekte personvern og sikkerhet.

### Problemet med backend: Der de fleste e-posttjenester med «åpen kildekode» kommer til kort {#the-backend-problem-where-most-open-source-email-services-fall-short}

Det er her ting blir interessante. Mange populære «personvernfokuserte» e-postleverandører annonserer seg selv som åpen kildekode, men det er en kritisk forskjell de håper du ikke legger merke til: **de har bare åpen kildekode for frontend-ene sine, mens backend-ene holdes lukket**.

Hva betyr dette? Frontend er det du ser og samhandler med – nettgrensesnittet eller mobilappen. Backend er der selve e-postbehandlingen skjer - hvor meldingene dine lagres, krypteres og overføres. Når en leverandør beholder sin backend lukket kildekode:

1. Du kan ikke bekrefte hvordan e-postene dine faktisk behandles.
2. Du kan ikke bekrefte om personvernpåstandene deres er legitime.
3. Du stoler på markedsføringspåstander i stedet for verifiserbar kode.
4. Sikkerhetssårbarheter kan forbli skjult for offentlig innsyn.

Som diskusjoner på forumene for personvernguider har fremhevet, hevder både Proton Mail og Tutanota å være åpen kildekode, men backend-systemene deres forblir lukkede og proprietære\[^2]. Dette skaper et betydelig tillitsgap – du blir bedt om å tro på personvernløftene deres uten muligheten til å bekrefte dem.

## Videresend e-post: 100 % åpen kildekode, frontend OG backend {#forward-email-100-open-source-frontend-and-backend}

Hos Forward Email har vi tatt en fundamentalt annerledes tilnærming. Hele kodebasen vår – både frontend og backend – er åpen kildekode og tilgjengelig for alle å inspisere på <https://github.com/forwardemail/forwardemail.net>.

Dette betyr:

1. **Fullstendig åpenhet**: Hver kodelinje som behandler e-postene dine er tilgjengelig for offentlig gransking.

2. **Verifiserbart personvern**: Våre personvernpåstander er ikke markedsføringsspråk – de er verifiserbare fakta som alle kan bekrefte ved å undersøke koden vår.

3. **Fellesskapsdrevet sikkerhet**: Vår sikkerhet styrkes av den kollektive ekspertisen til det globale utviklerfellesskapet.

4. **Ingen skjult funksjonalitet**: Det du ser er det du får – ingen skjult sporing, ingen hemmelige bakdører.

### Vår unike tekniske tilnærming {#our-unique-technical-approach}

Vår forpliktelse til personvern går utover bare å være åpen kildekode. Vi har implementert flere tekniske nyvinninger som skiller oss ut:

#### Individuelt krypterte SQLite-postbokser {#individually-encrypted-sqlite-mailboxes}

I motsetning til tradisjonelle e-postleverandører som bruker delte relasjonsdatabaser (hvor et enkelt brudd kan avsløre alle brukernes data), bruker vi individuelt krypterte SQLite-filer for hver postboks. Dette betyr:

* Hver postboks er en separat kryptert fil
* Tilgang til én brukers data gir ikke tilgang til andre
* Selv våre egne ansatte kan ikke få tilgang til dataene dine – det er en sentral designbeslutning

Som vi forklarte i diskusjonene i Privacy Guides:

> "Delt relasjonsdatabaser (f.eks. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL osv.) krever alle en pålogging (med brukernavn/passord) for å opprette databasetilkoblingen. Dette betyr at alle med dette passordet kan spørre databasen om hva som helst. Enten det er et angrep fra en useriøs ansatt eller en ond tjenestepike. Dette betyr også at det å ha tilgang til én brukers data betyr at du også har tilgang til alle andres. På den annen side kan SQLite betraktes som en delt database, men måten vi bruker den på (hver postboks = individuell SQLite-fil) gjør den til en sandkasse."\[^3]

#### Kvantebestandig kryptering {#quantum-resistant-encryption}

Mens andre leverandører fortsatt tar igjen, har vi allerede implementert kvantebestandige krypteringsmetoder for å fremtidssikre e-postens personvern mot nye trusler fra kvantedatabehandling.

#### Ingen tredjepartsavhengigheter {#no-third-party-dependencies}

I motsetning til konkurrenter som er avhengige av tjenester som Amazon SES for e-postlevering, har vi bygget hele infrastrukturen vår internt. Dette eliminerer potensielle personvernlekkasjer gjennom tredjepartstjenester og gir oss full kontroll over hele e-postrørledningen.

## Selvhostingsalternativet: Valgfrihet {#the-self-hosting-option-freedom-of-choice}

En av de kraftigste aspektene ved åpen kildekode-programvare er friheten den gir. Med Videresend e-post er du aldri låst – du kan være vert for hele plattformen vår hvis du velger det.

### Hvorfor vi støtter egenhosting {#why-we-support-self-hosting}

Vi tror på å gi brukere full kontroll over dataene sine. Det er derfor vi har gjort hele plattformen vår selvhostbar med omfattende dokumentasjon og oppsettveiledninger. Denne tilnærmingen:

* Gir maksimal kontroll for teknisk anlagte brukere
* Eliminerer behovet for å stole på oss som tjenesteleverandør
* Tillater tilpasning for å møte spesifikke krav
* Sikrer at tjenesten kan fortsette selv om selskapet vårt ikke gjør det

### Realiteten med selvhosting av e-post {#the-reality-of-self-hosting-email}

Selv om selvhosting er et kraftig alternativ, er det viktig å forstå de reelle kostnadene som er involvert:

#### Finansielle kostnader {#financial-costs}

* VPS- eller serverkostnader: $5–$50/måned for et grunnleggende oppsett\[^4]
* Domeneregistrering og fornyelse: $10–20/år
* SSL-sertifikater (men Let's Encrypt tilbyr gratis alternativer)
* Potensielle kostnader for overvåkingstjenester og sikkerhetskopieringsløsninger

#### Tidskostnader {#time-costs}

* Første oppsett: Flere timer til dager avhengig av teknisk ekspertise
* Løpende vedlikehold: 5–10 timer/måned for oppdateringer, sikkerhetsoppdateringer og feilsøking\[^5]
* Læringskurve: Forstå e-postprotokoller, beste sikkerhetspraksis og serveradministrasjon

#### Tekniske utfordringer {#technical-challenges}

* Problemer med levering av e-post (meldinger merkes som spam)
* Holde seg oppdatert på utviklende sikkerhetsstandarder
* Sikre høy tilgjengelighet og pålitelighet
* Administrere spamfiltrering effektivt

Som en erfaren selvhosting-leverandør uttrykte det: «E-post er en vanlig tjeneste ... Det er billigere å hoste e-posten min hos \[en leverandør] enn det er å bruke penger *og* tid på å hoste den selv.»\[^6]

## Hvorfor vår betalte tjeneste gir mening (selv om vi er åpen kildekode) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Gitt utfordringene med selvhosting, tilbyr vår betalte tjeneste det beste fra begge verdener: åpenheten og sikkerheten til åpen kildekode med bekvemmeligheten og påliteligheten til en administrert tjeneste.

### Kostnadssammenligning {#cost-comparison}

Når du tar med både økonomiske og tidsmessige kostnader, tilbyr vår betalte tjeneste eksepsjonell verdi:

* **Total kostnad for egenhosting**: $56–$252/måned (inkludert serverkostnader og tidsverdivurdering)
* **Betalte abonnementer for videresending av e-post**: $3–$9/måned

Vår betalte tjeneste gir:

* Profesjonell administrasjon og vedlikehold
* Etablert IP-rykte for bedre leveringsevne
* Regelmessige sikkerhetsoppdateringer og overvåking
* Støtte når problemer oppstår
* Alle personvernfordelene med vår åpen kildekode-tilnærming

### Det beste fra begge verdener {#the-best-of-both-worlds}

Ved å velge Videresend e-post får du:

1. **Verifiserbart personvern**: Vår åpen kildekodebase betyr at du kan stole på våre personvernkrav
2. **Profesjonell administrasjon**: Ingen grunn til å bli ekspert på e-postservere
3. **Kostnadseffektivitet**: Lavere totalkostnad enn selvhosting
4. **Frihet fra binding**: Muligheten til selvhosting er alltid tilgjengelig

## Lukket kildekode-bedrag: Hva Proton og Tutanota ikke forteller deg {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

La oss se nærmere på hvordan vår tilnærming skiller seg fra populære «personvernfokuserte» e-postleverandører.

### Proton Mails påstander om åpen kildekode {#proton-mails-open-source-claims}

Proton Mail markedsfører seg som åpen kildekode, men dette gjelder bare frontend-applikasjonene deres. Backend-applikasjonene deres – der e-postene dine faktisk behandles og lagres – forblir lukket kildekode\[^7]. Dette betyr:

* Du kan ikke bekrefte hvordan e-postene dine håndteres
* Du må stole på personvernpåstandene deres uten bekreftelse
* Sikkerhetssårbarheter i backend-systemet deres forblir skjult for offentlig gransking
* Du er låst til økosystemet deres uten alternativer for egenhosting

### Tutanotas lignende tilnærming {#tutanotas-similar-approach}

I likhet med Proton Mail bruker Tutanota kun åpen kildekode for frontend, mens backend-en er proprietær\[^8]. De står overfor de samme tillitsproblemene:

* Ingen måte å bekrefte personvernkrav på baksiden
* Begrenset åpenhet i faktisk e-postbehandling
* Potensielle sikkerhetsproblemer skjult for offentligheten
* Leverandørbinding uten mulighet for egenhosting

### Debatten om personvernveiledningene {#the-privacy-guides-debate}

Disse begrensningene har ikke gått ubemerket hen i personvernfellesskapet. I diskusjoner om personvernveiledninger fremhevet vi denne kritiske forskjellen:

> "Det står at både Protonmail og Tuta er lukket kildekode. Fordi backend-en deres faktisk er lukket kildekode."\[^9]

Vi uttalte også:

> "Det har ikke vært noen offentlig delte revisjoner av noen av de nåværende listede PG-e-posttjenesteleverandørenes backend-infrastrukturer, og det har heller ikke delt åpen kildekode om hvordan de behandler innkommende e-post."\[^10]

Denne mangelen på åpenhet skaper et grunnleggende tillitsproblem. Uten åpen kildekode-backends, er brukere tvunget til å ta personvernkrav på tro i stedet for bekreftelse.

## Fremtiden er åpen kildekode {#the-future-is-open-source}

Trenden mot åpen kildekode-løsninger akselererer over hele programvareindustrien. I følge nyere forskning:

* Markedet for åpen kildekode-programvare vokser fra 41,83 milliarder dollar i 2024 til 48,92 milliarder dollar i 2025\[^11]
* 80 % av selskapene rapporterer økt bruk av åpen kildekode det siste året\[^12]
* Adopsjonen av åpen kildekode forventes å fortsette sin raske ekspansjon.

Denne veksten reflekterer et grunnleggende skifte i hvordan vi tenker på programvaresikkerhet og personvern. Etter hvert som brukerne blir mer personvernbevisste, vil etterspørselen etter verifiserbart personvern gjennom åpen kildekode-løsninger bare øke.

### Hvorfor åpen kildekode vinner {#why-open-source-is-winning}

Fordelene med åpen kildekode blir stadig tydeligere:

1. **Sikkerhet gjennom åpenhet**: Åpen kildekode kan gjennomgås av tusenvis av eksperter, ikke bare et internt team
2. **Raskere innovasjon**: Samarbeidsutvikling akselererer forbedring
3. **Tillit gjennom verifisering**: Påstander kan verifiseres i stedet for å tas på tro
4. **Frihet fra leverandørbinding**: Brukere beholder kontroll over sine data og tjenester
5. **Fellesskapsstøtte**: Et globalt fellesskap bidrar til å identifisere og løse problemer

## Overgang til videresending av e-post {#making-the-switch-to-forward-email}

Det er enkelt å flytte til videresend e-post, enten du kommer fra en vanlig leverandør som Gmail eller en annen personvernfokusert tjeneste som Proton Mail eller Tutanota.

Vår tjeneste tilbyr:

* Ubegrenset antall domener og aliaser
* Støtte for standard protokoller (SMTP, IMAP, POP3) uten proprietære broer
* Sømløs integrasjon med eksisterende e-postklienter
* Enkel oppsettprosess med omfattende dokumentasjon
* Rimelige prisplaner fra kun $3/måned

## Konklusjon: Åpen kildekode-e-post for en privat fremtid {#conclusion-open-source-email-for-a-private-future}

I en verden der digitalt personvern i økende grad er truet, gir åpen kildekodeløsninger en avgjørende beskyttelse. Hos Forward Email er vi stolte over å være ledende med vår fullstendig åpen kildekode til e-postvern.

I motsetning til konkurrenter som bare delvis omfavner åpen kildekode, har vi gjort hele plattformen vår – frontend og backend – tilgjengelig for offentlig gransking. Denne forpliktelsen til åpenhet, kombinert med vår innovative tekniske tilnærming, gir et nivå av verifiserbart personvern som lukkede kildealternativer rett og slett ikke kan matche.

Enten du velger å bruke vår administrerte tjeneste eller selv hoste plattformen vår, drar du nytte av sikkerheten, personvernet og tryggheten som kommer fra virkelig åpen kildekode-e-post.

Fremtiden til e-post er åpen, gjennomsiktig og personvernfokusert. Fremtiden er Videresend e-post.

\[^1]: SNS Insider. «Markedet for åpen kildekode-tjenester ble verdsatt til 28,6 milliarder USD i 2023 og vil nå 114,8 milliarder USD innen 2032, med en årlig vekstrate på 16,70 % innen 2032.» [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Personvernveiledningsfellesskap. "Videresend e-post (e-postleverandør) - Nettstedsutvikling / Verktøyforslag." [Personvernguider Diskusjon](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Personvernveiledningsfellesskap. "Videresend e-post (e-postleverandør) - Nettstedsutvikling / Verktøyforslag." [Personvernguider Diskusjon](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Vanligvis kan du forvente å bruke alt fra $5 til $50 i måneden for en grunnleggende virtuell privat server (VPS) for å kjøre e-postserveren din." [10 beste selvvertsbaserte e-postserverplattformer å bruke i 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box-forum. "Vedlikehold tok meg kanskje 16 timer i den perioden..." [Selvhostende e-postserver ble mislikt](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Som alt som er selvhostet, VIL DET KREVE DIN TID. Hvis du ikke har tid til å bruke på det, er det alltid bedre å holde seg til en hostet..." [Selvvert for en e-postserver? Hvorfor eller hvorfor ikke? Hva er populært?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Videresend e-post. "Proton Mail hevder å være åpen kildekode, men backend-systemet deres er faktisk lukket kildekode." [Tutanota vs Proton Mail Sammenligning (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Videresend e-post. "Tutanota hevder å være åpen kildekode, men backend-systemet deres er faktisk lukket kildekode." [Sammenligning av Proton Mail vs Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Personvernveiledningsfellesskapet. "Det står at både Protonmail og Tuta er lukket kildekode. Fordi backend-en deres faktisk er lukket kildekode." [Videresend e-post (e-postleverandør) - Nettstedutvikling / verktøyforslag](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Personvernveiledningsfellesskapet. «Det har ikke vært noen offentlig delte revisjoner av noen av de nåværende listede PG-e-posttjenesteleverandørenes backend-infrastrukturer, og det har heller ikke delt åpen kildekode om hvordan de behandler innkommende e-post.» [Videresend e-post (e-postleverandør) - Nettstedutvikling / verktøyforslag](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. «Markedet for åpen kildekode-programvare vil vokse fra 41,83 milliarder USD i 2024 til 48,92 milliarder USD i 2025 med en sammensatt ...» [Hva er åpen kildekode-programvare?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. «Med 80 % av selskapene som rapporterer økt bruk av åpen kildekode-teknologier det siste året, er det ...» [Nye trender i fellesskap med åpen kildekode 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)