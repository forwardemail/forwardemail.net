# Selvhostet e-mail: Forpligtelse til open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Hvorfor selvhostede e-mails er vigtige](#why-self-hosted-email-matters)
  * [Problemet med traditionelle e-mailtjenester](#the-problem-with-traditional-email-services)
  * [Det selvhostede alternativ](#the-self-hosted-alternative)
* [Vores selvhostede implementering: Teknisk oversigt](#our-self-hosted-implementation-technical-overview)
  * [Docker-baseret arkitektur for enkelhed og bærbarhed](#docker-based-architecture-for-simplicity-and-portability)
  * [Installation af Bash-script: Tilgængelighed møder sikkerhed](#bash-script-installation-accessibility-meets-security)
  * [Kvantesikker kryptering for fremtidssikret privatliv](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatiseret vedligeholdelse og opdateringer](#automated-maintenance-and-updates)
* [Open source-forpligtelsen](#the-open-source-commitment)
* [Selvhostet vs. administreret: Træf det rigtige valg](#self-hosted-vs-managed-making-the-right-choice)
  * [Virkeligheden ved selvhosting af e-mails](#the-reality-of-self-hosting-email)
  * [Hvornår skal du vælge vores administrerede service](#when-to-choose-our-managed-service)
* [Kom godt i gang med selvhostet videresendelse af e-mail](#getting-started-with-self-hosted-forward-email)
  * [Systemkrav](#system-requirements)
  * [Installationstrin](#installation-steps)
* [Fremtiden for selvhostet e-mail](#the-future-of-self-hosted-email)
* [Konklusion: E-mailfrihed for alle](#conclusion-email-freedom-for-everyone)
* [Referencer](#references)

## Forord {#foreword}

I dagens digitale landskab er e-mail stadig rygraden i vores online identitet og kommunikation. Men i takt med at bekymringerne om privatlivets fred vokser, står mange brugere over for et vanskeligt valg: bekvemmelighed på bekostning af privatlivets fred eller privatliv på bekostning af bekvemmelighed. Hos Forward Email har vi altid ment, at du ikke burde skulle vælge mellem de to.

I dag er vi glade for at kunne annoncere en vigtig milepæl i vores rejse: lanceringen af vores selvhostede e-mailløsning. Denne funktion repræsenterer vores dybeste engagement i open source-principper, privatlivsfokuseret design og brugerindflydelse. Med vores selvhostede løsning giver vi dig den fulde magt og kontrol over din e-mailkommunikation direkte.

Dette blogindlæg udforsker filosofien bag vores selvhostede løsning, dens tekniske implementering, og hvorfor den er vigtig for brugere, der prioriterer både privatliv og ejerskab i deres digitale kommunikation.

## Hvorfor selvhostede e-mails er vigtige {#why-self-hosted-email-matters}

Vores selvhostede e-mailløsning er det klareste udtryk for vores overbevisning om, at ægte privatliv betyder kontrol, og kontrol starter med open source. For brugere, der kræver fuldt ejerskab over deres digitale kommunikation, er selvhosting ikke længere en marginal idé – det er en essentiel rettighed. Vi er stolte af at stå bag denne overbevisning med en fuldt åben, verificerbar platform, du kan køre på dine egne præmisser.

### Problemet med traditionelle e-mailtjenester {#the-problem-with-traditional-email-services}

Traditionelle e-mailtjenester præsenterer flere grundlæggende udfordringer for privatlivsbevidste brugere:

1. **Tillidskrav**: Du skal have tillid til, at udbyderen ikke tilgår, analyserer eller deler dine data.
2. **Centraliseret kontrol**: Din adgang kan til enhver tid tilbagekaldes af en hvilken som helst grund.
3. **Overvågningssårbarhed**: Centraliserede tjenester er primære mål for overvågning.
4. **Begrænset gennemsigtighed**: De fleste tjenester bruger proprietær, lukket software.
5. **Leverandørfastlåsning**: Det kan være vanskeligt eller umuligt at migrere væk fra disse tjenester.

Selv "privatlivsfokuserede" e-mailudbydere kommer ofte til kort ved kun at open-source deres frontend-applikationer, mens de holder deres backend-systemer proprietære og lukkede. Dette skaber et betydeligt tillidskløft – du bliver bedt om at tro på deres privatlivsløfter uden muligheden for at verificere dem.

### Det selvhostede alternativ {#the-self-hosted-alternative}

Selvhosting af din e-mail giver en fundamentalt anderledes tilgang:

1. **Fuld kontrol**: Du ejer og kontrollerer hele e-mailinfrastrukturen
2. **Verificerbar privatlivsbeskyttelse**: Hele systemet er transparent og kan revideres
3. **Ingen tillid kræves**: Du behøver ikke at stole på en tredjepart med din kommunikation
4. **Tilpasningsfrihed**: Tilpas systemet til dine specifikke behov
5. **Modstandsdygtighed**: Din service fortsætter uanset virksomhedens beslutninger

Som en bruger udtrykte det: "At hoste min e-mail selv er den digitale ækvivalent til at dyrke min egen mad – det kræver mere arbejde, men jeg ved præcis, hvad der er i det."

## Vores selvhostede implementering: Teknisk oversigt {#our-self-hosted-implementation-technical-overview}

Vores selvhostede e-mailløsning er bygget på de samme principper om privatliv først, som styrer alle vores produkter. Lad os udforske den tekniske implementering, der gør dette muligt.

### Docker-baseret arkitektur for enkelhed og bærbarhed {#docker-based-architecture-for-simplicity-and-portability}

Vi har pakket hele vores e-mailinfrastruktur ved hjælp af Docker, hvilket gør det nemt at implementere det på stort set alle Linux-baserede systemer. Denne containeriserede tilgang giver flere vigtige fordele:

1. **Forenklet implementering**: En enkelt kommando konfigurerer hele infrastrukturen
2. **Konsistent miljø**: Eliminerer problemer med "virker på min maskine"
3. **Isolerede komponenter**: Hver tjeneste kører i sin egen container for sikkerhed
4. **Nemme opdateringer**: Enkle kommandoer til at opdatere hele stakken
5. **Minimale afhængigheder**: Kræver kun Docker og Docker Compose

Arkitekturen inkluderer containere til:

* Webgrænseflade til administration
* SMTP-server til udgående e-mail
* IMAP/POP3-servere til hentning af e-mail
* CalDAV-server til kalendere
* CardDAV-server til kontakter
* Database til konfigurationslagring
* Redis til caching og ydeevne
* SQLite til sikker, krypteret postkasselagring

> \[!NOTE]
> Sørg for at tjekke vores [guide til selvhostede udviklere](https://forwardemail.net/self-hosted)

### Bash-scriptinstallation: Tilgængelighed møder sikkerhed {#bash-script-installation-accessibility-meets-security}

Vi har designet installationsprocessen til at være så enkel som muligt, samtidig med at vi opretholder bedste praksis for sikkerhed:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Denne ene kommando:

1. Bekræfter systemkrav
2. Guider dig gennem konfigurationen
3. Opsætter DNS-poster
4. Konfigurerer TLS-certifikater
5. Implementerer Docker-containere
6. Udfører indledende sikkerhedshærdning

For dem der er bekymrede for at manipulere scripts med piping til bash (som I burde være!), opfordrer vi til at gennemgå scriptet før udførelse. Det er fuldt open source og tilgængeligt til inspektion.

### Kvantesikker kryptering for fremtidssikret privatliv {#quantum-safe-encryption-for-future-proof-privacy}

Ligesom vores hostede tjeneste implementerer vores selvhostede løsning kvanteresistent kryptering ved hjælp af ChaCha20-Poly1305 som kryptering til SQLite-databaser. Denne tilgang beskytter dine e-maildata ikke kun mod aktuelle trusler, men også mod fremtidige kvanteberegningsangreb.

Hver postkasse gemmes i sin egen krypterede SQLite-databasefil, hvilket giver fuldstændig isolation mellem brugerne – en betydelig sikkerhedsfordel i forhold til traditionelle delte databasemetoder.

### Automatiseret vedligeholdelse og opdateringer {#automated-maintenance-and-updates}

Vi har indbygget omfattende vedligeholdelsesværktøjer direkte i den selvhostede løsning:

1. **Automatiske sikkerhedskopier**: Planlagte sikkerhedskopier af alle kritiske data
2. **Certifikatfornyelse**: Automatiseret Let's Encrypt-certifikatadministration
3. **Systemopdateringer**: Enkel kommando til at opdatere til den nyeste version
4. **Sundhedsovervågning**: Indbyggede kontroller for at sikre systemintegritet

Disse værktøjer er tilgængelige via en simpel interaktiv menu:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Forpligtelsen til åben kildekode {#the-open-source-commitment}

Vores selvhostede e-mailløsning er, ligesom alle vores produkter, 100% open source – både frontend og backend. Det betyder:

1. **Fuldstændig gennemsigtighed**: Hver linje kode, der behandler dine e-mails, er tilgængelig for offentlighedens gennemsyn.
2. **Bidrag fra fællesskabet**: Alle kan bidrage med forbedringer eller løse problemer.
3. **Sikkerhed gennem åbenhed**: Sårbarheder kan identificeres og rettes af et globalt fællesskab.
4. **Ingen leverandørbinding**: Du er aldrig afhængig af vores virksomheds eksistens.

Hele kodebasen er tilgængelig på GitHub på <https://github.com/forwardemail/forwardemail.net>.

## Selvhostet vs. administreret: Det rigtige valg {#self-hosted-vs-managed-making-the-right-choice}

Selvom vi er stolte af at kunne tilbyde en selvhostet løsning, erkender vi, at det ikke er det rigtige valg for alle. Selvhosting af e-mails indebærer et reelt ansvar og udfordringer:

### Virkeligheden ved selvhosting af e-mail {#the-reality-of-self-hosting-email}

#### Tekniske overvejelser {#technical-considerations}

* **Serveradministration**: Du skal vedligeholde en VPS eller dedikeret server
* **DNS-konfiguration**: Korrekt DNS-opsætning er afgørende for levering
* **Sikkerhedsopdateringer**: Det er vigtigt at holde sig opdateret med sikkerhedsrettelser
* **Spamhåndtering**: Du skal håndtere spamfiltrering
* **Backupstrategi**: Implementering af pålidelige backups er dit ansvar

#### Tidsinvestering {#time-investment}

* **Indledende opsætning**: Tid til opsætning, verificering og læsning af dokumentationen
* **Løbende vedligeholdelse**: Lejlighedsvise opdateringer og overvågning
* **Fejlfinding**: Lejlighedsvis tid til at løse problemer

#### Finansielle overvejelser {#financial-considerations}

* **Serveromkostninger**: $5-$20/måned for en basis VPS
* **Domæneregistrering**: $10-$20/år
* **Tidsværdi**: Din tidsinvestering har reel værdi

### Hvornår skal man vælge vores administrerede tjeneste {#when-to-choose-our-managed-service}

For mange brugere er vores administrerede tjeneste stadig den bedste løsning:

1. **Bekvemmelighed**: Vi håndterer al vedligeholdelse, opdateringer og overvågning
2. **Pålidelighed**: Drag fordel af vores etablerede infrastruktur og ekspertise
3. **Support**: Få hjælp, når der opstår problemer
4. **Leverbarhed**: Udnyt vores etablerede IP-omdømme
5. **Omkostningseffektivitet**: Når man tager tidsomkostninger med i betragtning, er vores service ofte mere økonomisk

Begge muligheder giver de samme fordele ved privatlivets fred og open source-transparens – forskellen er blot, hvem der administrerer infrastrukturen.

## Introduktion til selvhostet videresendelse af e-mail {#getting-started-with-self-hosted-forward-email}

Klar til at tage kontrol over din e-mailinfrastruktur? Sådan kommer du i gang:

### Systemkrav {#system-requirements}

* Ubuntu 20.04 LTS eller nyere (anbefales)
* Minimum 1 GB RAM (2 GB+ anbefales)
* 20 GB lagerplads anbefales
* Et domænenavn, du kontrollerer
* Offentlig IP-adresse med port 25-understøttelse
* Mulighed for at indstille [omvendt PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4- og IPv6-understøttelse

> \[!TIP]
> Vi anbefaler flere mailserverudbydere på <https://forwardemail.net/blog/docs/best-mail-server-providers> (kilde på <https://github.com/forwardemail/awesome-mail-server-providers>)

### Installationstrin {#installation-steps}

1. **Kør installationsscriptet**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Følg de interaktive instruktioner**:
* Indtast dit domænenavn
* Konfigurer administratoroplysninger
* Opsæt DNS-poster som anvist
* Vælg dine foretrukne konfigurationsmuligheder

3. **Bekræft installation**:** Når installationen er færdig, kan du bekræfte, at alt fungerer ved at:**
* Tjekke containerstatus: `docker ps`
* Sende en test-e-mail
* Logge ind på webgrænsefladen

## Fremtiden for selvhostet e-mail {#the-future-of-self-hosted-email}

Vores selvhostede løsning er kun begyndelsen. Vi er forpligtet til løbende at forbedre dette tilbud med:

1. **Forbedrede administrationsværktøjer**: Mere kraftfuld webbaseret administration
2. **Yderligere godkendelsesmuligheder**: Inklusive understøttelse af hardwaresikkerhedsnøgler
3. **Avanceret overvågning**: Bedre indsigt i systemets tilstand og ydeevne
4. **Multi-server implementering**: Muligheder for konfigurationer med høj tilgængelighed
5. **Forbedringer drevet af fællesskabet**: Inkorporering af bidrag fra brugere

## Konklusion: E-mailfrihed for alle {#conclusion-email-freedom-for-everyone}

Lanceringen af vores selvhostede e-mailløsning repræsenterer en vigtig milepæl i vores mission om at levere privatlivsfokuserede, transparente e-mailtjenester. Uanset om du vælger vores administrerede tjeneste eller selvhostede løsning, drager du fordel af vores urokkelige engagement i open source-principper og design, der sætter privatlivets fred først.

E-mail er for vigtig til at blive kontrolleret af lukkede, proprietære systemer, der prioriterer dataindsamling over brugernes privatliv. Med Forward Emails selvhostede løsning er vi stolte af at kunne tilbyde et ægte alternativ – et alternativ, der giver dig fuld kontrol over din digitale kommunikation.

Vi mener, at privatliv ikke bare er en funktion; det er en grundlæggende rettighed. Og med vores selvhostede e-mail-mulighed gør vi denne rettighed mere tilgængelig end nogensinde før.

Klar til at tage kontrol over din e-mail? [Kom i gang i dag](https://forwardemail.net/self-hosted) eller udforsk vores [GitHub-arkivet](https://github.com/forwardemail/forwardemail.net) for at få mere at vide.

## Referencer {#references}

\[1] Videresend e-mail GitHub-arkiv: <https://github.com/forwardemail/forwardemail.net>

\[2] Selvhostet dokumentation: <https://forwardemail.net/en/self-hosted>

\[3] Teknisk implementering af e-mail-privatliv: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Hvorfor open source-e-mail er vigtig: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>