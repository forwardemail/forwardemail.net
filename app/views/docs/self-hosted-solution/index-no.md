# Selvhostet e-post: Forpliktelse til åpen kildekode {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Hvorfor selvhostet e-post er viktig](#why-self-hosted-email-matters)
  * [Problemet med tradisjonelle e-posttjenester](#the-problem-with-traditional-email-services)
  * [Det selvhostede alternativet](#the-self-hosted-alternative)
* [Vår selvhostede implementering: Teknisk oversikt](#our-self-hosted-implementation-technical-overview)
  * [Docker-basert arkitektur for enkelhet og portabilitet](#docker-based-architecture-for-simplicity-and-portability)
  * [Installasjon av Bash-skript: Tilgjengelighet møter sikkerhet](#bash-script-installation-accessibility-meets-security)
  * [Kvantesikker kryptering for fremtidssikkert personvern](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatisert vedlikehold og oppdateringer](#automated-maintenance-and-updates)
* [Åpen kildekode-forpliktelse](#the-open-source-commitment)
* [Selvhostet vs. administrert: Ta det riktige valget](#self-hosted-vs-managed-making-the-right-choice)
  * [Realiteten med selvhosting av e-post](#the-reality-of-self-hosting-email)
  * [Når du bør velge vår administrerte tjeneste](#when-to-choose-our-managed-service)
* [Komme i gang med selvhostet videresendt e-post](#getting-started-with-self-hosted-forward-email)
  * [Systemkrav](#system-requirements)
  * [Installasjonstrinn](#installation-steps)
* [Fremtiden for selvhostet e-post](#the-future-of-self-hosted-email)
* [Konklusjon: E-postfrihet for alle](#conclusion-email-freedom-for-everyone)
* [Referanser](#references)

## Forord {#foreword}

I dagens digitale landskap er e-post fortsatt ryggraden i vår identitet og kommunikasjon på nett. Likevel, etter hvert som bekymringene rundt personvern vokser, står mange brukere overfor et vanskelig valg: bekvemmelighet på bekostning av personvern, eller personvern på bekostning av bekvemmelighet. Hos Forward Email har vi alltid ment at du ikke burde måtte velge mellom de to.

I dag er vi glade for å kunne kunngjøre en viktig milepæl i reisen vår: lanseringen av vår selvhostede e-postløsning. Denne funksjonen representerer vår dypeste forpliktelse til prinsipper om åpen kildekode, personvernfokusert design og brukermyndighet. Med vårt selvhostede alternativ gir vi deg full makt og kontroll over e-postkommunikasjonen din.

Dette blogginnlegget utforsker filosofien bak vår selvhostede løsning, den tekniske implementeringen og hvorfor den er viktig for brukere som prioriterer både personvern og eierskap i sin digitale kommunikasjon.

## Hvorfor selvhostet e-post er viktig {#why-self-hosted-email-matters}

Vår selvhostede e-postløsning er det tydeligste uttrykket for vår tro på at ekte personvern betyr kontroll, og kontroll starter med åpen kildekode. For brukere som krever fullt eierskap over sin digitale kommunikasjon, er selvhosting ikke lenger en marginal idé – det er en essensiell rettighet. Vi er stolte av å stå bak denne troen med en fullstendig åpen, verifiserbar plattform du kan kjøre på dine egne premisser.

### Problemet med tradisjonelle e-posttjenester {#the-problem-with-traditional-email-services}

Tradisjonelle e-posttjenester presenterer flere grunnleggende utfordringer for personvernbevisste brukere:

1. **Tillitskrav**: Du må stole på at leverandøren ikke får tilgang til, analyserer eller deler dataene dine.
2. **Sentralisert kontroll**: Tilgangen din kan tilbakekalles når som helst og uansett grunn.
3. **Sårbarhet i overvåking**: Sentraliserte tjenester er primære mål for overvåking.
4. **Begrenset åpenhet**: De fleste tjenester bruker proprietær programvare med lukket kildekode.
5. **Leverandørbinding**: Det kan være vanskelig eller umulig å migrere bort fra disse tjenestene.

Selv e-postleverandører med fokus på personvern kommer ofte til kort ved kun å bruke frontend-applikasjonene sine som åpen kildekode, samtidig som backend-systemene holdes proprietære og lukkede. Dette skaper et betydelig tillitsgap – du blir bedt om å tro på personvernløftene deres uten å kunne bekrefte dem.

### Det selvhostede alternativet {#the-self-hosted-alternative}

Å hoste e-posten din selv gir en fundamentalt annerledes tilnærming:

1. **Full kontroll**: Du eier og kontrollerer hele e-postinfrastrukturen
2. **Verifiserbart personvern**: Hele systemet er transparent og reviderbart
3. **Ingen tillit kreves**: Du trenger ikke å stole på en tredjepart med kommunikasjonen din
4. **Tilpasningsfrihet**: Tilpass systemet til dine spesifikke behov
5. **Motstandskraft**: Tjenesten din fortsetter uavhengig av selskapets beslutninger

Som en bruker uttrykte det: «Å være selvhostende for e-posten min er den digitale ekvivalenten til å dyrke min egen mat – det krever mer arbeid, men jeg vet nøyaktig hva som er i den.»

## Vår selvhostede implementering: Teknisk oversikt {#our-self-hosted-implementation-technical-overview}

Vår selvhostede e-postløsning er bygget på de samme personvernprinsippene som veileder alle produktene våre. La oss utforske den tekniske implementeringen som gjør dette mulig.

### Docker-basert arkitektur for enkelhet og portabilitet {#docker-based-architecture-for-simplicity-and-portability}

Vi har pakket hele e-postinfrastrukturen vår med Docker, noe som gjør det enkelt å distribuere den på så godt som alle Linux-baserte systemer. Denne containeriserte tilnærmingen gir flere viktige fordeler:

1. **Forenklet distribusjon**: Én enkelt kommando setter opp hele infrastrukturen
2. **Konsistent miljø**: Eliminerer problemer med at «fungerer på maskinen min»
3. **Isolerte komponenter**: Hver tjeneste kjører i sin egen container for sikkerhet
4. **Enkle oppdateringer**: Enkle kommandoer for å oppdatere hele stakken
5. **Minimale avhengigheter**: Krever bare Docker og Docker Compose

Arkitekturen inkluderer containere for:

* Webgrensesnitt for administrasjon
* SMTP-server for utgående e-post
* IMAP/POP3-servere for henting av e-post
* CalDAV-server for kalendere
* CardDAV-server for kontakter
* Database for konfigurasjonslagring
* Redis for mellomlagring og ytelse
* SQLite for sikker, kryptert postbokslagring

> \[!NOTE]
> Sørg for å sjekke ut vår [veiledning for utviklere med egen hosting](https://forwardemail.net/self-hosted)

### Bash-skriptinstallasjon: Tilgjengelighet møter sikkerhet {#bash-script-installation-accessibility-meets-security}

Vi har utformet installasjonsprosessen slik at den skal være så enkel som mulig, samtidig som vi opprettholder beste sikkerhetspraksis:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Denne ene kommandoen:

1. Verifiserer systemkrav
2. Veileder deg gjennom konfigurasjonen
3. Setter opp DNS-oppføringer
4. Konfigurerer TLS-sertifikater
5. Distribuerer Docker-containerne
6. Utfører innledende sikkerhetsherding

For de som er bekymret for å kunne bruke skript som piping til bash (noe dere burde være!), oppfordrer vi til å gjennomgå skriptet før det kjøres. Det er fullstendig åpen kildekode og tilgjengelig for inspeksjon.

### Kvantesikker kryptering for fremtidssikkert personvern {#quantum-safe-encryption-for-future-proof-privacy}

I likhet med vår hostede tjeneste implementerer vår selvhostede løsning kvantebestandig kryptering ved hjelp av ChaCha20-Poly1305 som kryptering for SQLite-databaser. Denne tilnærmingen beskytter e-postdataene dine ikke bare mot nåværende trusler, men også mot fremtidige kvantedatamaskinangrep.

Hver postboks lagres i sin egen krypterte SQLite-databasefil, noe som gir fullstendig isolasjon mellom brukere – en betydelig sikkerhetsfordel i forhold til tradisjonelle delte databasemetoder.

### Automatisert vedlikehold og oppdateringer {#automated-maintenance-and-updates}

Vi har bygget omfattende vedlikeholdsverktøy direkte inn i den selvhostede løsningen:

1. **Automatiske sikkerhetskopier**: Planlagte sikkerhetskopier av alle kritiske data
2. **Sertifikatfornyelse**: Automatisert administrasjon av Let's Encrypt-sertifikater
3. **Systemoppdateringer**: Enkel kommando for å oppdatere til den nyeste versjonen
4. **Helseovervåking**: Innebygde kontroller for å sikre systemintegritet

Disse verktøyene er tilgjengelige via en enkel interaktiv meny:

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

## Forpliktelsen til åpen kildekode {#the-open-source-commitment}

Vår selvhostede e-postløsning, som alle våre produkter, er 100 % åpen kildekode – både frontend og backend. Dette betyr:

1. **Fullstendig åpenhet**: Hver kodelinje som behandler e-postene dine er tilgjengelig for offentlig gransking.
2. **Bidrag fra fellesskapet**: Alle kan bidra med forbedringer eller fikse problemer.
3. **Sikkerhet gjennom åpenhet**: Sårbarheter kan identifiseres og fikses av et globalt fellesskap.
4. **Ingen leverandørbinding**: Du er aldri avhengig av selskapets eksistens.

Hele kodebasen er tilgjengelig på GitHub på <https://github.com/forwardemail/forwardemail.net>.

## Selvhostet vs. administrert: Ta det riktige valget {#self-hosted-vs-managed-making-the-right-choice}

Selv om vi er stolte av å tilby et selvhostet alternativ, erkjenner vi at det ikke er det riktige valget for alle. Selvhosting av e-post kommer med reelle ansvar og utfordringer:

### Realiteten med selvhosting av e-post {#the-reality-of-self-hosting-email}

#### Tekniske hensyn {#technical-considerations}

* **Serveradministrasjon**: Du må vedlikeholde en VPS eller dedikert server
* **DNS-konfigurasjon**: Riktig DNS-oppsett er avgjørende for levering
* **Sikkerhetsoppdateringer**: Det er viktig å holde seg oppdatert med sikkerhetsoppdateringer
* **Spamhåndtering**: Du må håndtere spamfiltrering
* **Sikkerhetskopieringsstrategi**: Implementering av pålitelige sikkerhetskopier er ditt ansvar

#### Tidsinvestering {#time-investment}

* **Førstegangsoppsett**: Tid for å sette opp, bekrefte og lese dokumentasjonen
* **Løpende vedlikehold**: Sporadiske oppdateringer og overvåking
* **Feilsøking**: Sporadisk tid for å løse problemer

#### Finansielle hensyn {#financial-considerations}

* **Serverkostnader**: $5–$20/måned for en grunnleggende VPS
* **Domeneregistrering**: $10–$20/år
* **Tidsverdi**: Tidsinvesteringen din har reell verdi

### Når du bør velge vår administrerte tjeneste {#when-to-choose-our-managed-service}

For mange brukere er vår administrerte tjeneste fortsatt det beste alternativet:

1. **Bekvemmelighet**: Vi håndterer alt vedlikehold, oppdateringer og overvåking
2. **Pålitelighet**: Dra nytte av vår etablerte infrastruktur og ekspertise
3. **Support**: Få hjelp når problemer oppstår
4. **Leverbarhet**: Utnytt vårt etablerte IP-rykte
5. **Kostnadseffektivitet**: Når du tar hensyn til tidskostnader, er tjenesten vår ofte mer økonomisk

Begge alternativene gir de samme personvernfordelene og åpenheten som åpen kildekode – forskjellen er rett og slett hvem som administrerer infrastrukturen.

## Komme i gang med selvhostet videresending av e-post {#getting-started-with-self-hosted-forward-email}

Klar til å ta kontroll over e-postinfrastrukturen din? Slik kommer du i gang:

### Systemkrav {#system-requirements}

* Ubuntu 20.04 LTS eller nyere (anbefales)
* Minimum 1 GB RAM (2 GB+ anbefales)
* 20 GB lagringsplass anbefales
* Et domenenavn du kontrollerer
* Offentlig IP-adresse med støtte for port 25
* Mulighet for å angi [omvendt PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Støtte for IPv4 og IPv6

> \[!TIP]
> Vi anbefaler flere e-postserverleverandører på <https://forwardemail.net/blog/docs/best-mail-server-providers> (kilde på <https://github.com/forwardemail/awesome-mail-server-providers>)

### Installasjonstrinn {#installation-steps}

1. **Kjør installasjonsskriptet**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Følg de interaktive instruksjonene**:
* Skriv inn domenenavnet ditt
* Konfigurer administratorlegitimasjon
* Sett opp DNS-oppføringer som anvist
* Velg dine foretrukne konfigurasjonsalternativer

3. **Bekreft installasjon**:
Når installasjonen er fullført, kan du bekrefte at alt fungerer ved å:
* Sjekke containerstatus: `docker ps`
* Sende en test-e-post
* Logge inn på webgrensesnittet

## Fremtiden for selvhostet e-post {#the-future-of-self-hosted-email}

Vår selvhostede løsning er bare begynnelsen. Vi er forpliktet til kontinuerlig å forbedre dette tilbudet med:

1. **Forbedrede administrasjonsverktøy**: Kraftigere nettbasert administrasjon
2. **Ytterligere autentiseringsalternativer**: Inkludert støtte for maskinvaresikkerhetsnøkler
3. **Avansert overvåking**: Bedre innsikt i systemtilstand og ytelse
4. **Implementering av flere servere**: Alternativer for konfigurasjoner med høy tilgjengelighet
5. **Fellesskapsdrevne forbedringer**: Inkludering av bidrag fra brukere

## Konklusjon: E-postfrihet for alle {#conclusion-email-freedom-for-everyone}

Lanseringen av vår selvhostede e-postløsning representerer en viktig milepæl i vårt oppdrag om å tilby personvernfokuserte og transparente e-posttjenester. Enten du velger vår administrerte tjeneste eller selvhostede alternativ, drar du nytte av vår urokkelige forpliktelse til prinsipper om åpen kildekode og design med personvern først.

E-post er for viktig til å bli kontrollert av lukkede, proprietære systemer som prioriterer datainnsamling fremfor brukernes personvern. Med Forward Emails selvhostede løsning er vi stolte av å kunne tilby et ekte alternativ – et som gir deg full kontroll over din digitale kommunikasjon.

Vi mener at personvern ikke bare er en funksjon; det er en grunnleggende rettighet. Og med vårt selvhostede e-postalternativ gjør vi denne retten mer tilgjengelig enn noen gang før.

Klar til å ta kontroll over e-posten din? [Kom i gang i dag](https://forwardemail.net/self-hosted) eller utforsk [GitHub-depotet](https://github.com/forwardemail/forwardemail.net) for å finne ut mer.

## Referanser {#references}

\[1] Videresend e-post GitHub-arkiv: <https://github.com/forwardemail/forwardemail.net>

\[2] Selvhostet dokumentasjon: <https://forwardemail.net/en/self-hosted>

\[3] Teknisk implementering av personvern for e-post: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Hvorfor åpen kildekode-e-post er viktig: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>