# Selvhostet e-post: Forpliktelse til åpen kildekode {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Hvorfor selvbetjent e-post er viktig](#why-self-hosted-email-matters)
  * [Problemet med tradisjonelle e-posttjenester](#the-problem-with-traditional-email-services)
  * [Alternativet selvvert](#the-self-hosted-alternative)
* [Vår selvhostede implementering: Teknisk oversikt](#our-self-hosted-implementation-technical-overview)
  * [Docker-basert arkitektur for enkelhet og portabilitet](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash-skriptinstallasjon: Tilgjengelighet møter sikkerhet](#bash-script-installation-accessibility-meets-security)
  * [Kvantesikker kryptering for fremtidssikkert personvern](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatisert vedlikehold og oppdateringer](#automated-maintenance-and-updates)
* [Åpen kildekode-forpliktelsen](#the-open-source-commitment)
* [Self-hosted vs. Managed: Ta det riktige valget](#self-hosted-vs-managed-making-the-right-choice)
  * [Realiteten til selvhostende e-post](#the-reality-of-self-hosting-email)
  * [Når skal du velge vår administrerte tjeneste](#when-to-choose-our-managed-service)
* [Komme i gang med Self-Hosted Forward Email](#getting-started-with-self-hosted-forward-email)
  * [Systemkrav](#system-requirements)
  * [Installasjonstrinn](#installation-steps)
* [Fremtiden for selvhostet e-post](#the-future-of-self-hosted-email)
* [Konklusjon: E-postfrihet for alle](#conclusion-email-freedom-for-everyone)
* [Referanser](#references)

## Forord {#foreword}

I dagens digitale landskap er e-post fortsatt ryggraden i vår online identitet og kommunikasjon. Likevel, ettersom bekymringene for personvern vokser, står mange brukere overfor et vanskelig valg: bekvemmelighet på bekostning av personvern, eller personvern på bekostning av bekvemmelighet. Hos Forward Email har vi alltid ment at du ikke burde måtte velge mellom de to.

I dag er vi glade for å kunngjøre en betydelig milepæl i reisen vår: lanseringen av vår selvdrevne e-postløsning. Denne funksjonen representerer vår dypeste forpliktelse til åpen kildekode-prinsipper, personvernfokusert design og brukerstyrking. Med vårt selvhostede alternativ legger vi full kraft og kontroll over e-postkommunikasjonen din direkte i dine hender.

Dette blogginnlegget utforsker filosofien bak vår selvdrevne løsning, dens tekniske implementering, og hvorfor det er viktig for brukere som prioriterer både personvern og eierskap i sin digitale kommunikasjon.

## Hvorfor selvhostet e-post er viktig {#why-self-hosted-email-matters}

Vår selvhostede e-postløsning er det klareste uttrykket for vår tro på at ekte personvern betyr kontroll, og kontroll starter med åpen kildekode. For brukere som krever fullt eierskap over sin digitale kommunikasjon, er selvhosting ikke lenger en utkantside – det er en viktig rettighet. Vi er stolte av å stå bak denne troen med en helt åpen, verifiserbar plattform du kan kjøre på dine egne premisser.

### Problemet med tradisjonelle e-posttjenester {#the-problem-with-traditional-email-services}

Tradisjonelle e-posttjenester byr på flere grunnleggende utfordringer for personvernbevisste brukere:

1. **Tillitskrav**: Du må stole på at leverandøren ikke får tilgang til, analyserer eller deler dataene dine.
2. **Sentralisert kontroll**: Tilgangen din kan tilbakekalles når som helst og uansett grunn.
3. **Sårbarhet i overvåking**: Sentraliserte tjenester er primære mål for overvåking.
4. **Begrenset åpenhet**: De fleste tjenester bruker proprietær programvare med lukket kildekode.
5. **Leverandørbinding**: Det kan være vanskelig eller umulig å migrere bort fra disse tjenestene.

Selv "personvernfokuserte" e-postleverandører kommer ofte til kort ved kun å åpne frontend-applikasjonene sine mens de holder backendsystemene proprietære og lukkede. Dette skaper et betydelig tillitsgap – du blir bedt om å tro på personvernløftene deres uten å kunne bekrefte dem.

### Det selvhostede alternativet {#the-self-hosted-alternative}

Å være vert for e-posten din gir en fundamentalt annen tilnærming:

1. **Full kontroll**: Du eier og kontrollerer hele e-postinfrastrukturen
2. **Verifiserbart personvern**: Hele systemet er transparent og reviderbart
3. **Ingen tillit kreves**: Du trenger ikke å stole på en tredjepart med kommunikasjonen din
4. **Tilpasningsfrihet**: Tilpass systemet til dine spesifikke behov
5. **Motstandskraft**: Tjenesten din fortsetter uavhengig av selskapets beslutninger

Som en bruker sa det: "Selvvert for e-posten min er den digitale ekvivalenten med å dyrke min egen mat - det krever mer arbeid, men jeg vet nøyaktig hva som er i det."

## Vår selvhostede implementering: Teknisk oversikt {#our-self-hosted-implementation-technical-overview}

Vår selvhostede e-postløsning er bygget på de samme personvern-først-prinsippene som styrer alle produktene våre. La oss utforske den tekniske implementeringen som gjør dette mulig.

### Docker-basert arkitektur for enkelhet og portabilitet {#docker-based-architecture-for-simplicity-and-portability}

Vi har pakket hele e-postinfrastrukturen vår ved hjelp av Docker, noe som gjør det enkelt å distribuere på praktisk talt alle Linux-baserte systemer. Denne containeriserte tilnærmingen gir flere viktige fordeler:

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
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Installasjon av Bash-skript: Tilgjengelighet møter sikkerhet {#bash-script-installation-accessibility-meets-security}

Vi har designet installasjonsprosessen for å være så enkel som mulig, samtidig som vi opprettholder beste praksis for sikkerhet:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Denne enkle kommandoen:

1. Verifiserer systemkrav
2. Veileder deg gjennom konfigurasjonen
3. Setter opp DNS-oppføringer
4. Konfigurerer TLS-sertifikater
5. Distribuerer Docker-containerne
6. Utfører innledende sikkerhetsherding

For de som er bekymret for å sende skript til bash (som du burde være!), oppfordrer vi til å gjennomgå skriptet før utførelse. Den er fullstendig åpen kildekode og tilgjengelig for inspeksjon.

### Kvantesikker kryptering for fremtidssikkert personvern {#quantum-safe-encryption-for-future-proof-privacy}

I likhet med vår vertstjeneste implementerer vår selvvertsbaserte løsning kvantebestandig kryptering ved å bruke ChaCha20-Poly1305 som chiffer for SQLite-databaser. Denne tilnærmingen beskytter e-postdataene dine ikke bare mot nåværende trusler, men også mot fremtidige kvantedataangrep.

Hver postboks er lagret i sin egen krypterte SQLite-databasefil, noe som gir fullstendig isolasjon mellom brukere – en betydelig sikkerhetsfordel i forhold til tradisjonelle delte databasetilnærminger.

### Automatisert vedlikehold og oppdateringer {#automated-maintenance-and-updates}

Vi har bygget omfattende vedlikeholdsverktøy direkte inn i den selvdrevne løsningen:

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

Vår selvhostede e-postløsning, som alle produktene våre, er 100 % åpen kildekode – både frontend og backend. Dette betyr:

1. **Fullstendig åpenhet**: Hver kodelinje som behandler e-postene dine er tilgjengelig for offentlig gransking.
2. **Bidrag fra fellesskapet**: Alle kan bidra med forbedringer eller fikse problemer.
3. **Sikkerhet gjennom åpenhet**: Sårbarheter kan identifiseres og fikses av et globalt fellesskap.
4. **Ingen leverandørbinding**: Du er aldri avhengig av selskapets eksistens.

Hele kodebasen er tilgjengelig på GitHub på <https://github.com/forwardemail/forwardemail.net>.

## Selvhostet vs. administrert: Ta det riktige valget {#self-hosted-vs-managed-making-the-right-choice}

Selv om vi er stolte over å tilby et selvvertsbasert alternativ, innser vi at det ikke er det riktige valget for alle. Selvhostende e-post kommer med reelle ansvar og utfordringer:

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

Begge alternativene gir de samme personvernfordelene og åpen kildekode - forskjellen er ganske enkelt hvem som administrerer infrastrukturen.

## Komme i gang med selvhostet videresendt e-post {#getting-started-with-self-hosted-forward-email}

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
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

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

Vår selvhostede løsning er bare begynnelsen. Vi er forpliktet til å kontinuerlig forbedre dette tilbudet med:

1. **Forbedrede administrasjonsverktøy**: Kraftigere nettbasert administrasjon
2. **Ytterligere autentiseringsalternativer**: Inkludert støtte for maskinvaresikkerhetsnøkler
3. **Avansert overvåking**: Bedre innsikt i systemtilstand og ytelse
4. **Implementering av flere servere**: Alternativer for konfigurasjoner med høy tilgjengelighet
5. **Fellesskapsdrevne forbedringer**: Inkludering av bidrag fra brukere

## Konklusjon: E-postfrihet for alle {#conclusion-email-freedom-for-everyone}

Lanseringen av vår selvdrevne e-postløsning representerer en betydelig milepæl i vårt mål om å tilby personvernfokuserte, transparente e-posttjenester. Enten du velger vår administrerte tjeneste eller selvvertsbaserte alternativ, drar du nytte av vår urokkelige forpliktelse til åpen kildekode-prinsipper og design først og fremst på personvern.

E-post er for viktig til å bli kontrollert av lukkede, proprietære systemer som prioriterer datainnsamling fremfor brukernes personvern. Med Forward Emails selvhostede løsning er vi stolte av å tilby et genuint alternativ – et som gir deg full kontroll over din digitale kommunikasjon.

Vi tror at personvern ikke bare er en funksjon; det er en grunnleggende rettighet. Og med vårt selvhostede e-postalternativ gjør vi denne rettigheten mer tilgjengelig enn noen gang før.

Klar til å ta kontroll over e-posten din? [Kom i gang i dag](https://forwardemail.net/self-hosted) eller utforsk [GitHub-depot](https://github.com/forwardemail/forwardemail.net) for å finne ut mer.

## Referanser {#references}

\[1] Videresend e-post GitHub-arkiv: <https://github.com/forwardemail/forwardemail.net>

\[2] Selvhostet dokumentasjon: <https://forwardemail.net/en/self-hosted>

\[3] Teknisk implementering av personvern for e-post: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Hvorfor åpen kildekode-e-post er viktig: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>