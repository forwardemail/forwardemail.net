# Hvorfor open source-e-mail er fremtiden: Fordelen ved videresendelse af e-mail {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Open Source-fordel: Mere end bare markedsføring](#the-open-source-advantage-more-than-just-marketing)
  * [Hvad Ægte Open-Source betyder](#what-true-open-source-means)
  * [Backend-problemet: Hvor de fleste "open source" e-mail-tjenester kommer til kort](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Videresend e-mail: 100 % Open-Source, Frontend OG Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Vores unikke tekniske tilgang](#our-unique-technical-approach)
* [Selvværtsmuligheden: Valgfrihed](#the-self-hosting-option-freedom-of-choice)
  * [Hvorfor vi støtter Self-Hosting](#why-we-support-self-hosting)
  * [Virkeligheden af selvhostende e-mail](#the-reality-of-self-hosting-email)
* [Hvorfor vores betalte service giver mening (selv om vi er open source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Omkostningssammenligning](#cost-comparison)
  * [Det bedste fra begge verdener](#the-best-of-both-worlds)
* [Bedraget med lukket kilde: Hvad Proton og Tutanota ikke fortæller dig](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mails open source-krav](#proton-mails-open-source-claims)
  * [Tutanotas lignende tilgang](#tutanotas-similar-approach)
  * [Debatten om privatlivsguider](#the-privacy-guides-debate)
* [Fremtiden er Open Source](#the-future-is-open-source)
  * [Hvorfor Open-Source vinder](#why-open-source-is-winning)
* [Skift til videresend e-mail](#making-the-switch-to-forward-email)
* [Konklusion: Open-Source e-mail til en privat fremtid](#conclusion-open-source-email-for-a-private-future)

## Forord {#foreword}

I en æra, hvor bekymringer om digitalt privatliv er på et rekordhøjt niveau, betyder de e-mailtjenester, vi vælger, mere end nogensinde. Mens mange udbydere hævder at prioritere dit privatliv, er der en grundlæggende forskel mellem dem, der blot taler om privatlivets fred, og dem, der virkelig går turen. Hos Forward Email har vi bygget vores service på et grundlag af fuldstændig gennemsigtighed gennem open source-udvikling – ikke kun i vores frontend-applikationer, men i hele vores infrastruktur.

Dette blogindlæg udforsker, hvorfor open source-e-mail-løsninger er overlegne i forhold til lukkede kilde-alternativer, hvordan vores tilgang adskiller sig fra konkurrenter som Proton Mail og Tutanota, og hvorfor – på trods af vores forpligtelse til muligheder for selvhosting – tilbyder vores betalte tjeneste den bedste værdi for de fleste brugere.

## Fordelen ved open source: Mere end blot markedsføring {#the-open-source-advantage-more-than-just-marketing}

Udtrykket "open source" er blevet et populært marketing-buzzword i de senere år, hvor det globale marked for open source-tjenester forventes at vokse med en årlig vækstrate (CAGR) på over 16 % mellem 2024 og 2032. Men hvad vil det sige at være ægte open source, og hvorfor er det vigtigt for dit privatliv i forbindelse med e-mails?

### Hvad ægte open source betyder {#what-true-open-source-means}

Open source-software gør hele dens kildekode frit tilgængelig for enhver at inspicere, ændre og forbedre. Denne gennemsigtighed skaber et miljø, hvor:

* Sikkerhedssårbarheder kan identificeres og rettes af et globalt fællesskab af udviklere
* Privatlivskrav kan verificeres gennem uafhængig kodegennemgang
* Brugere er ikke bundet til proprietære økosystemer
* Innovation sker hurtigere gennem fælles forbedring

Når det kommer til e-mail – rygraden i din online identitet – er denne gennemsigtighed ikke bare rar at have; det er afgørende for ægte privatliv og sikkerhed.

### Backend-problemet: Hvor de fleste "open source" e-mailtjenester ikke lever op til forventningerne {#the-backend-problem-where-most-open-source-email-services-fall-short}

Det er her, det bliver interessant. Mange populære "privatlivsfokuserede" e-mailudbydere reklamerer for at være open source, men der er en afgørende forskel, som de håber, du ikke vil bemærke: **de open source kun deres frontends, mens de holder deres backends lukkede**.

Hvad betyder det? Frontend er det, du ser og interagerer med – webgrænsefladen eller mobilappen. Backend er der, hvor den faktiske e-mail-behandling finder sted - hvor dine beskeder gemmes, krypteres og transmitteres. Når en udbyder beholder deres backend lukket kildekode:

1. Du kan ikke verificere, hvordan dine e-mails rent faktisk behandles.
2. Du kan ikke bekræfte, om deres påstande om beskyttelse af personlige oplysninger er legitime.
3. Du stoler på markedsføringspåstande snarere end verificerbar kode.
4. Sikkerhedssårbarheder kan forblive skjult for offentlighedens indsigt.

Som diskussioner på Privacy Guides-fora har fremhævet, hævder både Proton Mail og Tutanota at være open source, men deres backends forbliver lukkede og proprietære\[^2]. Dette skaber et betydeligt tillidskløft – du bliver bedt om at tro på deres løfter om privatliv uden muligheden for at verificere dem.

## Videresend e-mail: 100% open source, frontend OG backend {#forward-email-100-open-source-frontend-and-backend}

Hos Forward Email har vi valgt en fundamentalt anderledes tilgang. Hele vores kodebase – både frontend og backend – er open source og tilgængelig for alle at inspicere på <https://github.com/forwardemail/forwardemail.net>.

Dette betyder:

1. **Fuldstændig gennemsigtighed**: Hver linje kode, der behandler dine e-mails, er tilgængelig for offentlighedens gennemsyn.

2. **Verificerbar privatlivspolitik**: Vores privatlivspolitik er ikke marketingsprog – de er verificerbare fakta, som alle kan bekræfte ved at undersøge vores kode.

3. **Fællesskabsdrevet sikkerhed**: Vores sikkerhed styrkes af den kollektive ekspertise i det globale udviklerfællesskab.

4. **Ingen skjult funktionalitet**: Det, du ser, er det, du får – ingen skjult sporing, ingen hemmelige bagdøre.

### Vores unikke tekniske tilgang {#our-unique-technical-approach}

Vores forpligtelse til privatliv rækker ud over blot at være open source. Vi har implementeret flere tekniske innovationer, der adskiller os:

#### Individuelt krypterede SQLite-postkasser {#individually-encrypted-sqlite-mailboxes}

I modsætning til traditionelle e-mail-udbydere, der bruger delte relationelle databaser (hvor et enkelt brud kunne afsløre alle brugeres data), bruger vi individuelt krypterede SQLite-filer til hver postkasse. Det betyder:

* Hver postkasse er en separat krypteret fil
* Adgang til én brugers data giver ikke adgang til andre
* Selv vores egne medarbejdere kan ikke få adgang til dine data – det er en central designbeslutning

Som vi forklarede i diskussioner i Privacy Guides:

> "Delt relationsdatabaser (f.eks. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL osv.) kræver alle et login (med brugernavn/adgangskode) for at etablere databaseforbindelsen. Det betyder, at alle med denne adgangskode kan forespørge databasen om hvad som helst. Hvad enten det er et angreb fra en skurk eller en ondsindet tjenestepige. Det betyder også, at adgang til én brugers data betyder, at du også har adgang til alle andres. På den anden side kan SQLite betragtes som en delt database, men den måde, vi bruger den på (hver postkasse = individuel SQLite-fil), gør den til en sandkasse."\[^3]

#### Kvantebestandig kryptering {#quantum-resistant-encryption}

Mens andre udbydere stadig indhenter det, har vi allerede implementeret kvanteresistente krypteringsmetoder for at fremtidssikre dit e-mail-privatliv mod nye trusler fra kvantecomputere.

#### Ingen afhængigheder fra tredjeparter {#no-third-party-dependencies}

I modsætning til konkurrenter, der er afhængige af tjenester som Amazon SES til levering af e-mail, har vi bygget hele vores infrastruktur internt. Dette eliminerer potentielle privatlivslækager gennem tredjepartstjenester og giver os fuld kontrol over hele e-mail-pipeline.

## Selvhosting-muligheden: Valgfrihed {#the-self-hosting-option-freedom-of-choice}

Et af de mest kraftfulde aspekter ved open source-software er den frihed, den giver. Med Videresend e-mail er du aldrig låst - du kan selv hoste hele vores platform, hvis du vælger det.

### Hvorfor vi understøtter selvhosting {#why-we-support-self-hosting}

Vi tror på at give brugerne fuld kontrol over deres data. Derfor har vi gjort hele vores platform selvstændig med omfattende dokumentation og opsætningsvejledninger. Denne tilgang:

* Giver maksimal kontrol for teknisk erfarne brugere
* Eliminerer ethvert behov for at stole på os som serviceudbyder
* Muliggør tilpasning for at opfylde specifikke krav
* Sikrer, at tjenesten kan fortsætte, selvom vores virksomhed ikke gør det

### Virkeligheden ved selvhosting af e-mail {#the-reality-of-self-hosting-email}

Selvom selvhosting er en effektiv mulighed, er det vigtigt at forstå de reelle omkostninger, der er involveret:

#### Finansielle omkostninger {#financial-costs}

* VPS- eller serveromkostninger: $5-$50/måned for en basisopsætning\[^4]
* Domæneregistrering og fornyelse: $10-20/år
* SSL-certifikater (dog tilbyder Let's Encrypt gratis muligheder)
* Potentielle omkostninger til overvågningstjenester og backupløsninger

#### Tidsomkostninger {#time-costs}

* Indledende opsætning: Flere timer til dage afhængigt af teknisk ekspertise
* Løbende vedligeholdelse: 5-10 timer/måned til opdateringer, sikkerhedsrettelser og fejlfinding\[^5]
* Læringskurve: Forståelse af e-mailprotokoller, bedste praksis inden for sikkerhed og serveradministration

#### Tekniske udfordringer {#technical-challenges}

* Problemer med e-maillevering (meddelelser markeres som spam)
* Holde sig ajour med udviklende sikkerhedsstandarder
* Sikre høj tilgængelighed og pålidelighed
* Effektiv håndtering af spamfiltrering

Som en erfaren selvhoster udtrykte det: "E-mail er en almindelig service... Det er billigere at hoste min e-mail hos \[en udbyder] end at bruge penge *og* tid på selv at hoste den."\[^6]

## Hvorfor vores betalte tjeneste giver mening (selvom vi er open source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

I betragtning af udfordringerne ved selvhosting tilbyder vores betalte tjeneste det bedste fra begge verdener: gennemsigtigheden og sikkerheden ved open source med bekvemmeligheden og pålideligheden af en administreret tjeneste.

### Prissammenligning {#cost-comparison}

Når du medregner både økonomiske og tidsmæssige omkostninger, tilbyder vores betalte service enestående værdi:

* **Samlede omkostninger for selvhosting**: $56-$252/måned (inklusive serveromkostninger og tidsvurdering)
* **Betalte abonnementer for videresendelse af e-mails**: $3-$9/måned

Vores betalte service giver:

* Professionel administration og vedligeholdelse
* Etableret IP-omdømme for bedre leveringsevne
* Regelmæssige sikkerhedsopdateringer og overvågning
* Support, når der opstår problemer
* Alle privatlivsfordelene ved vores open source-tilgang

### Det bedste fra begge verdener {#the-best-of-both-worlds}

Ved at vælge Videresend e-mail får du:

1. **Verificerbar privatliv**: Vores open source-kodebase betyder, at du kan stole på vores privatlivskrav.
2. **Professionel administration**: Ingen grund til at blive ekspert i e-mailservere.
3. **Omkostningseffektivitet**: Lavere samlede omkostninger end selvhosting.
4. **Frihed fra binding**: Muligheden for selvhosting er altid tilgængelig.

## Bedrag med lukket kildekode: Hvad Proton og Tutanota ikke fortæller dig {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Lad os se nærmere på, hvordan vores tilgang adskiller sig fra populære "privatlivsfokuserede" e-mail-udbydere.

### Proton Mails påstande om open source {#proton-mails-open-source-claims}

Proton Mail markedsfører sig selv som open source, men dette gælder kun for deres frontend-applikationer. Deres backend – hvor dine e-mails faktisk behandles og gemmes – forbliver closed source\[^7]. Det betyder:

* Du kan ikke verificere, hvordan dine e-mails håndteres
* Du skal stole på deres privatlivskrav uden verifikation
* Sikkerhedssårbarheder i deres backend forbliver skjult for offentlighedens kontrol
* Du er låst fast i deres økosystem uden selvhostingmuligheder

### Tutanotas lignende tilgang {#tutanotas-similar-approach}

Ligesom Proton Mail open source-udbyder Tutanota kun deres frontend, mens de beholder deres backend proprietært\[^8]. De står over for de samme tillidsproblemer:

* Ingen mulighed for at verificere backend-privatlivskrav
* Begrænset gennemsigtighed i den faktiske e-mailbehandling
* Potentielle sikkerhedsproblemer skjult for offentligheden
* Leverandørbinding uden mulighed for selvhosting

### Debatten om privatlivsvejledninger {#the-privacy-guides-debate}

Disse begrænsninger er ikke gået ubemærket hen i privatlivsfællesskabet. I diskussioner om Privacy Guides fremhævede vi denne kritiske skelnen:

> "Der står, at både Protonmail og Tuta er lukket kildekode. Fordi deres backend faktisk er lukket kildekode."\[^9]

Vi sagde også:

> "Der har ikke været nogen offentligt delte revisioner af backend-infrastrukturer hos nogen af de aktuelt opførte PG-e-mailudbydere, og der er heller ikke delt open source-kodestykker om, hvordan de behandler indgående e-mail."\[^10]

Denne mangel på gennemsigtighed skaber et grundlæggende tillidsproblem. Uden open source-backends er brugere tvunget til at tage privatlivskrav på tro frem for bekræftelse.

## Fremtiden er open source {#the-future-is-open-source}

Tendensen mod open source-løsninger accelererer på tværs af softwareindustrien. Ifølge nyere forskning:

* Markedet for open source-software vokser fra 41,83 milliarder dollars i 2024 til 48,92 milliarder dollars i 2025\[^11]
* 80 % af virksomhederne rapporterer øget brug af open source i løbet af det seneste år\[^12]
* Indførelsen af open source forventes at fortsætte sin hurtige ekspansion.

Denne vækst afspejler et grundlæggende skift i, hvordan vi tænker om softwaresikkerhed og privatliv. Efterhånden som brugerne bliver mere privatlivsbevidste, vil efterspørgslen efter verificerbart privatliv gennem open source-løsninger kun stige.

### Hvorfor open source vinder {#why-open-source-is-winning}

Fordelene ved open source bliver mere og mere tydelige:

1. **Sikkerhed gennem gennemsigtighed**: Open source-kode kan gennemgås af tusindvis af eksperter, ikke kun et internt team.**
2. **Hurtigere innovation**: Samarbejdsbaseret udvikling accelererer forbedringer.**
3. **Tillid gennem verifikation**: Påstande kan verificeres i stedet for at blive taget på tro.**
4. **Frihed fra leverandørbinding**: Brugere bevarer kontrollen over deres data og tjenester.**
5. **Fællesskabsstøtte**: Et globalt fællesskab hjælper med at identificere og løse problemer.

## Skift til videresendelse af e-mail {#making-the-switch-to-forward-email}

At flytte til Videresend e-mail er ligetil, uanset om du kommer fra en almindelig udbyder som Gmail eller en anden privatlivsfokuseret tjeneste som Proton Mail eller Tutanota.

Vores service tilbyder:

* Ubegrænsede domæner og aliasser
* Standardprotokolunderstøttelse (SMTP, IMAP, POP3) uden proprietære broer
* Problemfri integration med eksisterende e-mailklienter
* Enkel opsætningsproces med omfattende dokumentation
* Overkommelige prisplaner fra kun $3/måned

## Konklusion: Open source-e-mail til en privat fremtid {#conclusion-open-source-email-for-a-private-future}

I en verden, hvor det digitale privatliv i stigende grad er truet, er gennemsigtigheden af open source-løsninger en afgørende beskyttelse. Hos Forward Email er vi stolte af at være førende med vores fuldt åbne kildekode til e-mailbeskyttelse.

I modsætning til konkurrenter, der kun delvist omfavner open source, har vi gjort hele vores platform – frontend og backend – tilgængelig for offentlig kontrol. Denne forpligtelse til gennemsigtighed, kombineret med vores innovative tekniske tilgang, giver et niveau af verificerbart privatliv, som lukkede kilder-alternativer simpelthen ikke kan matche.

Uanset om du vælger at bruge vores administrerede service eller selv hoste vores platform, nyder du godt af den sikkerhed, privatliv og ro i sindet, der kommer fra ægte open source-e-mail.

Fremtiden for e-mail er åben, gennemsigtig og privatlivsfokuseret. Fremtiden er Videresend e-mail.

\[^1]: SNS Insider. "Markedet for open source-tjenester blev vurderet til 28,6 milliarder USD i 2023 og vil nå 114,8 milliarder USD i 2032 med en årlig vækstrate på 16,70 % i 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privatlivsvejledningsfællesskab. "Videresend e-mail (e-mailudbyder) - Udvikling af websted / Forslag til værktøjer." [Diskussion om privatlivsguider](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privatlivsvejledningsfællesskab. "Videresend e-mail (e-mailudbyder) - Udvikling af websted / Forslag til værktøjer." [Diskussion om privatlivsguider](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generelt kan du forvente at bruge alt fra $5 til $50 om måneden på en grundlæggende virtuel privat server (VPS) til at køre din e-mailserver." [10 bedste selvhostede e-mailserverplatforme til brug i 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Vedligeholdelse tog mig måske 16 timer i den periode..." [Selvhostende mailserver ilde set](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Som alt selvhostet VIL DET KRÆVE DIN TID. Hvis du ikke har tid til at bruge på det, er det altid bedre at holde sig til en hostet..." [Selvvært for en e-mail-server? Hvorfor eller hvorfor ikke? Hvad er populært?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Videresend e-mail. "Proton Mail hævder at være open source, men deres backend er faktisk closed source." [Tutanota vs Proton Mail sammenligning (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Videresend e-mail. "Tutanota hævder at være open source, men deres backend er faktisk closed source." [Sammenligning af Proton Mail vs Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privatlivsvejledningsfællesskab. "Der står, at både Protonmail og Tuta er lukket kildekode. Fordi deres backend faktisk er lukket kildekode." [Videresend e-mail (e-mail-udbyder) - Udvikling af websted / værktøjsforslag](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Der har ikke været nogen offentligt delte revisioner af backend-infrastrukturer fra nogen af de aktuelt listede PG-e-mailudbydere, og der er heller ikke delt open source-kodestykker om, hvordan de behandler indgående e-mail." [Videresend e-mail (e-mail-udbyder) - Udvikling af websted / værktøjsforslag](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Markedet for open source-software vil vokse fra 41,83 milliarder USD i 2024 til 48,92 milliarder USD i 2025 med en samlet..." [Hvad er Open Source Software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Med 80% af virksomheder, der rapporterer øget brug af open source-teknologier i løbet af det seneste år, er det..." [Nye tendenser i Open Source-fællesskaber 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)