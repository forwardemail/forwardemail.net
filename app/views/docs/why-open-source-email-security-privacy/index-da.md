# Hvorfor open source-e-mail er fremtiden: Fordelen ved videresendelse af e-mail {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Fordelen ved open source: Mere end blot markedsføring](#the-open-source-advantage-more-than-just-marketing)
  * [Hvad ægte open source betyder](#what-true-open-source-means)
  * [Backend-problemet: Hvor de fleste "open source" e-mailtjenester ikke lever op til forventningerne](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Videresend e-mail: 100% open source, frontend OG backend](#forward-email-100-open-source-frontend-and-backend)
  * [Vores unikke tekniske tilgang](#our-unique-technical-approach)
* [Selvhosting-muligheden: Valgfrihed](#the-self-hosting-option-freedom-of-choice)
  * [Hvorfor vi understøtter selvhosting](#why-we-support-self-hosting)
  * [Virkeligheden ved selvhosting af e-mails](#the-reality-of-self-hosting-email)
* [Hvorfor vores betalte tjeneste giver mening (selvom vi er open source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Omkostningssammenligning](#cost-comparison)
  * [Det bedste fra begge verdener](#the-best-of-both-worlds)
* [Bedrag med lukket kildekode: Hvad Proton og Tutanota ikke fortæller dig](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Proton Mails påstande om open source](#proton-mails-open-source-claims)
  * [Tutanotas lignende tilgang](#tutanotas-similar-approach)
  * [Debatten om privatlivsvejledninger](#the-privacy-guides-debate)
* [Fremtiden er open source](#the-future-is-open-source)
  * [Hvorfor open source vinder](#why-open-source-is-winning)
* [Skift til videresendelse af e-mail](#making-the-switch-to-forward-email)
* [Konklusion: Open source-e-mail til en privat fremtid](#conclusion-open-source-email-for-a-private-future)

## Forord {#foreword}

I en tid, hvor bekymringer om digital privatliv er på et rekordhøjt niveau, er de e-mailtjenester, vi vælger, vigtigere end nogensinde. Selvom mange udbydere hævder at prioritere dit privatliv, er der en fundamental forskel på dem, der blot taler om privatliv, og dem, der virkelig går på den rigtige vej. Hos Forward Email har vi bygget vores tjeneste på et fundament af fuldstændig gennemsigtighed gennem open source-udvikling – ikke kun i vores frontend-applikationer, men i hele vores infrastruktur.

Dette blogindlæg undersøger, hvorfor open source-e-mailløsninger er bedre end closed source-alternativer, hvordan vores tilgang adskiller sig fra konkurrenter som Proton Mail og Tutanota, og hvorfor – på trods af vores engagement i selvhosting – vores betalte tjeneste tilbyder den bedste værdi for de fleste brugere.

## Fordelen ved open source: Mere end blot markedsføring {#the-open-source-advantage-more-than-just-marketing}

Udtrykket "open source" er blevet et populært marketing-buzzword i de senere år, hvor det globale marked for open source-tjenester forventes at vokse med en årlig vækstrate (CAGR) på over 16 % mellem 2024 og 2032. Men hvad vil det sige at være ægte open source, og hvorfor er det vigtigt for dit privatliv i forbindelse med e-mails?

### Hvad ægte open source betyder {#what-true-open-source-means}

Open source-software gør hele sin kildekode frit tilgængelig for alle at inspicere, ændre og forbedre. Denne gennemsigtighed skaber et miljø, hvor:

* Sikkerhedssårbarheder kan identificeres og rettes af et globalt fællesskab af udviklere
* Privatlivskrav kan verificeres gennem uafhængig kodegennemgang
* Brugere er ikke bundet til proprietære økosystemer
* Innovation sker hurtigere gennem fælles forbedring

Når det kommer til e-mail – rygraden i din onlineidentitet – er denne gennemsigtighed ikke bare rar at have; den er afgørende for ægte privatliv og sikkerhed.

### Backend-problemet: Hvor de fleste "open source" e-mailtjenester ikke lever op til forventningerne {#the-backend-problem-where-most-open-source-email-services-fall-short}

Det er her, det bliver interessant. Mange populære "privatlivsfokuserede" e-mailudbydere reklamerer for at være open source, men der er en afgørende forskel, som de håber, du ikke vil bemærke: **de open source kun deres frontends, mens de holder deres backends lukkede**.

Hvad betyder det? Frontend er det, du ser og interagerer med – webgrænsefladen eller mobilappen. Backend er der, hvor den faktiske e-mailbehandling finder sted – hvor dine beskeder gemmes, krypteres og transmitteres. Når en udbyder holder deres backend lukket:

1. Du kan ikke verificere, hvordan dine e-mails rent faktisk behandles.
2. Du kan ikke bekræfte, om deres påstande om beskyttelse af personlige oplysninger er legitime.
3. Du stoler på markedsføringspåstande snarere end verificerbar kode.
4. Sikkerhedssårbarheder kan forblive skjult for offentlighedens indsigt.

Som diskussioner på Privacy Guides-fora har fremhævet, hævder både Proton Mail og Tutanota at være open source, men deres backends forbliver lukkede og proprietære\[^2]. Dette skaber et betydeligt tillidskløft – du bliver bedt om at tro på deres løfter om privatliv uden muligheden for at verificere dem.

## Videresend e-mail: 100% open source, frontend OG backend {#forward-email-100-open-source-frontend-and-backend}

Hos Forward Email har vi taget en fundamentalt anderledes tilgang. Hele vores kodebase – både frontend og backend – er open source og tilgængelig for alle at inspicere på <https://github.com/forwardemail/forwardemail.net>.

Det betyder:

1. **Fuldstændig gennemsigtighed**: Hver linje kode, der behandler dine e-mails, er tilgængelig for offentlighedens gennemsyn.

2. **Verificerbar privatlivspolitik**: Vores privatlivspolitik er ikke marketingsprog – de er verificerbare fakta, som alle kan bekræfte ved at undersøge vores kode.

3. **Fællesskabsdrevet sikkerhed**: Vores sikkerhed styrkes af den kollektive ekspertise i det globale udviklerfællesskab.

4. **Ingen skjult funktionalitet**: Det, du ser, er det, du får – ingen skjult sporing, ingen hemmelige bagdøre.

### Vores unikke tekniske tilgang {#our-unique-technical-approach}

Vores engagement i privatlivets fred går ud over blot at være open source. Vi har implementeret adskillige tekniske innovationer, der adskiller os fra andre:

#### Individuelt krypterede SQLite-postkasser {#individually-encrypted-sqlite-mailboxes}

I modsætning til traditionelle e-mailudbydere, der bruger delte relationsdatabaser (hvor et enkelt brud kan eksponere alle brugeres data), bruger vi individuelt krypterede SQLite-filer til hver postkasse. Det betyder:

* Hver postkasse er en separat krypteret fil
* Adgang til én brugers data giver ikke adgang til andre
* Selv vores egne medarbejdere kan ikke få adgang til dine data – det er en central designbeslutning

Som vi forklarede i diskussionerne om privatlivsvejledninger:

> "Delt relationsdatabaser (f.eks. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL osv.) kræver alle et login (med brugernavn/adgangskode) for at etablere databaseforbindelsen. Det betyder, at alle med denne adgangskode kan forespørge databasen om hvad som helst. Hvad enten det er et angreb fra en skurk eller en ondsindet tjenestepige. Det betyder også, at adgang til én brugers data betyder, at du også har adgang til alle andres. På den anden side kan SQLite betragtes som en delt database, men den måde, vi bruger den på (hver postkasse = individuel SQLite-fil), gør den til en sandkasse."\[^3]

#### Kvantebestandig kryptering {#quantum-resistant-encryption}

Mens andre udbydere stadig er ved at indhente det forsømte, har vi allerede implementeret kvanteresistente krypteringsmetoder for at fremtidssikre dit e-mail-privatliv mod nye trusler fra kvanteberegning.

#### Ingen tredjepartsafhængigheder {#no-third-party-dependencies}

I modsætning til konkurrenter, der bruger tjenester som Amazon SES til levering af e-mails, har vi bygget hele vores infrastruktur internt. Dette eliminerer potentielle privatlivslækager gennem tredjepartstjenester og giver os fuld kontrol over hele e-mail-pipelinen.

## Selvhosting-muligheden: Valgfrihed {#the-self-hosting-option-freedom-of-choice}

Et af de mest kraftfulde aspekter ved open source-software er den frihed, det giver. Med Videresend Email er du aldrig bundet af det – du kan selv hoste hele vores platform, hvis du ønsker det.

### Hvorfor vi understøtter selvhosting {#why-we-support-self-hosting}

Vi tror på at give brugerne fuld kontrol over deres data. Derfor har vi gjort hele vores platform selvhostbar med omfattende dokumentation og opsætningsvejledninger. Denne tilgang:

* Giver maksimal kontrol for teknisk erfarne brugere
* Eliminerer ethvert behov for at stole på os som serviceudbyder
* Muliggør tilpasning for at opfylde specifikke krav
* Sikrer, at tjenesten kan fortsætte, selvom vores virksomhed ikke gør det

### Virkeligheden ved selvhosting af e-mail {#the-reality-of-self-hosting-email}

Selvom selvhosting er en effektiv mulighed, er det vigtigt at forstå de reelle omkostninger:

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

Som en erfaren selvhoster udtrykte det: "E-mail er en almindelig service... Det er billigere at hoste min e-mail hos \[en udbyder] end det er at bruge penge *og* tid på selv at hoste den."\[^6]

## Hvorfor vores betalte tjeneste giver mening (selvom vi er open source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

I betragtning af udfordringerne ved selvhosting tilbyder vores betalte tjeneste det bedste fra begge verdener: gennemsigtigheden og sikkerheden ved open source med bekvemmeligheden og pålideligheden ved en administreret tjeneste.

### Omkostningssammenligning {#cost-comparison}

Når du tager højde for både økonomiske og tidsmæssige omkostninger, tilbyder vores betalte service enestående værdi:

* **Samlede omkostninger for selvhosting**: $56-$252/måned (inklusive serveromkostninger og tidsvurdering)
* **Betalte abonnementer for videresendelse af e-mails**: $3-$9/måned

Vores betalte service tilbyder:

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

## Bedraget med lukket kildekode: Hvad Proton og Tutanota ikke fortæller dig {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Lad os se nærmere på, hvordan vores tilgang adskiller sig fra populære "privatlivsfokuserede" e-mailudbydere.

### Proton Mails krav om open source {#proton-mails-open-source-claims}

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

Disse begrænsninger er ikke gået ubemærket hen i privatlivsmiljøet. I diskussioner om privatlivsvejledninger fremhævede vi denne kritiske sondring:

> "Der står, at både Protonmail og Tuta er lukket kildekode. Fordi deres backend faktisk er lukket kildekode."\[^9]

Vi udtalte også:

> "Der har ikke været nogen offentligt delte revisioner af backend-infrastrukturer hos nogen af de aktuelt opførte PG-e-mailudbydere, og der er heller ikke delt open source-kodestykker om, hvordan de behandler indgående e-mail."\[^10]

Denne mangel på gennemsigtighed skaber et fundamentalt tillidsproblem. Uden open source-backends er brugerne tvunget til at tage privatlivskrav på tro i stedet for verifikation.

## Fremtiden er open source {#the-future-is-open-source}

Tendensen mod open source-løsninger accelererer i hele softwarebranchen. Ifølge nyere forskning:

* Markedet for open source-software vokser fra 41,83 milliarder dollars i 2024 til 48,92 milliarder dollars i 2025\[^11]
* 80 % af virksomhederne rapporterer øget brug af open source i løbet af det seneste år\[^12]
* Indførelsen af open source forventes at fortsætte sin hurtige ekspansion.

Denne vækst afspejler et fundamentalt skift i, hvordan vi tænker på softwaresikkerhed og privatliv. Efterhånden som brugerne bliver mere privatlivsbevidste, vil efterspørgslen efter verificerbar privatliv gennem open source-løsninger kun stige.

### Hvorfor open source vinder {#why-open-source-is-winning}

Fordelene ved open source bliver mere og mere tydelige:

1. **Sikkerhed gennem gennemsigtighed**: Open source-kode kan gennemgås af tusindvis af eksperter, ikke kun et internt team.**
2. **Hurtigere innovation**: Samarbejdsbaseret udvikling accelererer forbedringer.**
3. **Tillid gennem verifikation**: Påstande kan verificeres i stedet for at blive taget på tro.**
4. **Frihed fra leverandørbinding**: Brugere bevarer kontrollen over deres data og tjenester.**
5. **Fællesskabsstøtte**: Et globalt fællesskab hjælper med at identificere og løse problemer.

## Skifter til videresendelse af e-mail {#making-the-switch-to-forward-email}

Det er ligetil at skifte til videresendelse af e-mail, uanset om du kommer fra en almindelig udbyder som Gmail eller en anden privatlivsfokuseret tjeneste som Proton Mail eller Tutanota.

Vores service tilbyder:

* Ubegrænsede domæner og aliasser
* Standardprotokolunderstøttelse (SMTP, IMAP, POP3) uden proprietære broer
* Problemfri integration med eksisterende e-mailklienter
* Enkel opsætningsproces med omfattende dokumentation
* Overkommelige prisplaner fra kun $3/måned

## Konklusion: Open source-e-mail til en privat fremtid {#conclusion-open-source-email-for-a-private-future}

I en verden, hvor digitalt privatliv i stigende grad er truet, udgør gennemsigtigheden af open source-løsninger en afgørende sikkerhedsforanstaltning. Hos Forward Email er vi stolte af at være førende med vores fuldt open source-tilgang til e-mail-privatliv.

I modsætning til konkurrenter, der kun delvist anvender open source, har vi gjort hele vores platform – frontend og backend – tilgængelig for offentlighedens indsigt. Denne forpligtelse til gennemsigtighed, kombineret med vores innovative tekniske tilgang, giver et niveau af verificerbar privatliv, som closed source-alternativer simpelthen ikke kan matche.

Uanset om du vælger at bruge vores administrerede tjeneste eller selv hoste vores platform, drager du fordel af den sikkerhed, det privatliv og den ro i sindet, der følger med ægte open source-e-mail.

Fremtiden for e-mail er åben, transparent og privatlivsfokuseret. Fremtiden er videresendelse af e-mail.

\[^1]: SNS Insider. "Markedet for open source-tjenester blev vurderet til 28,6 milliarder USD i 2023 og vil nå 114,8 milliarder USD i 2032 med en årlig vækstrate på 16,70 % i 2032." [Markedsstørrelse og analyserapport for open source-tjenester 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privatlivsvejledningsfællesskab. "Videresend e-mail (e-mailudbyder) - Udvikling af websted / Forslag til værktøjer." [Diskussion om privatlivsvejledninger](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privatlivsvejledningsfællesskab. "Videresend e-mail (e-mailudbyder) - Udvikling af websted / Forslag til værktøjer." [Diskussion om privatlivsvejledninger](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generelt kan du forvente at bruge alt fra $5 til $50 om måneden på en grundlæggende virtuel privat server (VPS) til at køre din e-mailserver." [10 bedste selvhostede e-mailserverplatforme at bruge i 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Vedligeholdelse tog mig måske 16 timer i den periode..." [Selvhostende mailserver ikke set på](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "TL:DR: Som alt selvhostet VIL DET KRÆVE DIN TID. Hvis du ikke har tid til at bruge på det, er det altid bedre at holde sig til en hostet..." [Selvhosting af en e-mailserver? Hvorfor eller hvorfor ikke? Hvad er populært?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Videresend e-mail. "Proton Mail hævder at være open source, men deres backend er faktisk closed source." [Sammenligning af Tutanota og Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Videresend e-mail. "Tutanota hævder at være open source, men deres backend er faktisk closed source." [Proton Mail vs Tutanota-sammenligning (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privatlivsvejledningsfællesskab. "Der står, at både Protonmail og Tuta er lukket kildekode. Fordi deres backend faktisk er lukket kildekode." [Videresend e-mail (e-mailudbyder) - Udvikling af websted / Forslag til værktøjer](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privatlivsvejledningsfællesskab. "Der har ikke været nogen offentligt delte revisioner af nogen af de aktuelt listede PG-e-mailudbyderes backend-infrastrukturer, og der er heller ikke delt open source-kodestykker om, hvordan de behandler indgående e-mail." [Videresend e-mail (e-mailudbyder) - Udvikling af websted / Forslag til værktøjer](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Markedet for open source-software vil vokse fra 41,83 milliarder USD i 2024 til 48,92 milliarder USD i 2025 med en samlet..." [Hvad er open source-software?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Med 80% af virksomheder, der rapporterer øget brug af open source-teknologier i løbet af det seneste år, er det..." [Nye tendenser i open source-fællesskaber 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)