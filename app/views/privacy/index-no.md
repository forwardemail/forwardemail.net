# Personvernregler {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email personvernregler" class="rounded-lg" /> -->


## Innholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Informasjon som ikke samles inn](#information-not-collected)
* [Informasjon som samles inn](#information-collected)
  * [Kontoinformasjon](#account-information)
  * [E-postlagring](#email-storage)
  * [Feillogger](#error-logs)
  * [Serverlogger](#server-logs)
  * [Utgående SMTP-e-poster](#outbound-smtp-emails)
* [Midlertidig databehandling](#temporary-data-processing)
  * [Begrensning av hastighet](#rate-limiting)
  * [Sporing av tilkoblinger](#connection-tracking)
  * [Autentiseringsforsøk](#authentication-attempts)
* [Revisjonslogger](#audit-logs)
  * [Endringer i konto](#account-changes)
  * [Endringer i domeninnstillinger](#domain-settings-changes)
* [Informasjonskapsler og økter](#cookies-and-sessions)
* [Analyse](#analytics)
* [Apper og webmail](#apps-and-webmail)
  * [Data på enheten din](#data-on-your-device)
  * [Data som appene sender til oss](#data-the-apps-send-us)
  * [Push-varsler](#push-notifications)
  * [Bilder og lenker i e-poster](#images-and-links-in-emails)
  * [Andre tilkoblinger](#other-connections)
* [Informasjon som deles](#information-shared)
* [Fjerning av informasjon](#information-removal)
* [Ytterligere opplysninger](#additional-disclosures)


## Ansvarsfraskrivelse {#disclaimer}

Vennligst se våre [Vilkår](/terms) da disse gjelder for hele nettstedet.


## Informasjon som ikke samles inn {#information-not-collected}

**Med unntak av informasjonen som uttrykkelig er beskrevet i denne personvernerklæringen (inkludert [feillogger](#error-logs), [serverlogger](#server-logs), [utgående SMTP-e-poster](#outbound-smtp-emails), [kontoinformasjon](#account-information), [midlertidig databehandling](#temporary-data-processing), [revisjonslogger](#audit-logs), [informasjonskapsler og økter](#cookies-and-sessions), [analyse](#analytics), og [apper og webmail](#apps-and-webmail)):**

* Vi lagrer ingen videresendte e-poster på disk eller i databaser.
* Vi lagrer ingen metadata om videresendte e-poster på disk eller i databaser.
* Med unntak av det som uttrykkelig er beskrevet i denne personvernerklæringen, lagrer vi ikke logger eller IP-adresser på disk eller i databaser.
* Vi bruker ingen tredjeparts analyse- eller telemetritjenester.


## Informasjon som samles inn {#information-collected}

For å være transparente kan du når som helst <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">se vår kildekode</a> for å forstå hvordan informasjonen nedenfor samles inn og brukes.

**Strengt for funksjonalitet og for å forbedre tjenesten vår, samler vi inn og lagrer sikkert følgende informasjon:**

### Kontoinformasjon {#account-information}

* Vi lagrer e-postadressen du oppgir til oss.
* Vi lagrer domenenavn, aliaser og konfigurasjoner du oppgir til oss.
* Vi lagrer begrensede sikkerhetsmetadata for kontoen som er nødvendige for å beskytte kontoen din og administrere tilgang, inkludert aktive nettstedsøktidentifikatorer, tellere for mislykkede påloggingsforsøk og tidsstempelet for det siste påloggingsforsøket.
* All tilleggsinformasjon du frivillig gir oss, for eksempel kommentarer eller spørsmål sendt til oss via e-post eller på vår <a href="/help">hjelp</a>-side.


**Registreringsattribusjon** (lagres permanent på kontoen din):

Når du oppretter en konto, lagrer vi følgende informasjon for å forstå hvordan brukere finner tjenesten vår:

* Henvisende nettsteddomene (ikke full URL)
* Den første siden du besøkte på nettstedet vårt, der verdier som domenenavn, ID-er og tokens i stien er erstattet med plassholdere
* UTM-kampanjeparametere hvis de er til stede i URL-en

### E-postlagring {#email-storage}

* Vi lagrer e-poster og kalenderinformasjon i din [krypterte SQLite-database](/blog/docs/best-quantum-safe-encrypted-email-service) strengt for din IMAP/POP3/CalDAV/CardDAV-tilgang og postkassefunksjonalitet.
  * Merk at hvis du kun bruker våre e-postvideresendingstjenester, lagres ingen e-poster på disk eller i database som beskrevet i [Informasjon som ikke samles inn](#information-not-collected).
  * Våre e-postvideresendingstjenester opererer kun i minnet (ingen skriving til disk eller databaser).
  * IMAP/POP3/CalDAV/CardDAV-lagring er kryptert i hvile, kryptert under overføring, og lagres på en LUKS-kryptert disk.
  * Sikkerhetskopier for din IMAP/POP3/CalDAV/CardDAV-lagring er kryptert i hvile, kryptert under overføring, og lagres på [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Feillogger {#error-logs}

* Vi lagrer `4xx` og `5xx` SMTP-responskode [feillogger](/faq#do-you-store-error-logs) i 7 dager.
* Feillogger inneholder SMTP-feil, konvolutt og e-postoverskrifter (vi **lagrer ikke** e-postinnhold eller vedlegg).
* Feillogger kan inneholde IP-adresser og vertsnavn til sendende servere for feilsøkingsformål.
* Feillogger for [hastighetsbegrensning](/faq#do-you-have-rate-limiting) og [grålisting](/faq#do-you-have-a-greylist) er ikke tilgjengelige siden tilkoblingen avsluttes tidlig (f.eks. før `RCPT TO` og `MAIL FROM`-kommandoer kan overføres).
* Vi lagrer også feillogger i 7 dager for nettsteds- og API-forespørsler som mislykkes eller tar for lang tid, og for feil på IMAP-, POP3-, CalDAV- og CardDAV-serverne våre.
* Disse loggene kan inneholde IP-adressen, forespørselens URL (inkludert spørrestrenger, for eksempel søkeord), forespørselsheadere som brukeragenten, og kontoen eller aliaset som er involvert.
* Passord, API-tokens, informasjonskapsler og forespørselsinnhold fjernes fra disse loggene før de lagres.

### Serverlogger {#server-logs}

* For hver nettsteds- og API-forespørsel skriver serverne våre en logglinje som kan inneholde IP-adressen, forespørselsmetoden og URL-en (inkludert spørrestrenger), forespørselsheadere, svarstatusen og den påloggede kontoen.
* Vi bruker disse loggene til å finne og løse problemer og til å stoppe misbruk, og vi beholder dem i opptil 30 dager.

### Utgående SMTP-e-poster {#outbound-smtp-emails}

* Vi lagrer [utgående SMTP-e-poster](/faq#do-you-support-sending-email-with-smtp) i \~30 dager.
  * Denne lengden varierer basert på "Date"-headeren; siden vi tillater at e-poster kan sendes i fremtiden hvis en fremtidig "Date"-header finnes.
  * **Merk at når en e-post er vellykket levert eller har fått en permanent feil, vil vi redigere og slette meldingsinnholdet.**
  * Hvis du ønsker å konfigurere at innholdet i utgående SMTP-e-post skal beholdes lenger enn standard 0 dager (etter vellykket levering eller permanent feil), gå til Avanserte innstillinger for domenet ditt og angi en verdi mellom `0` og `30`.
  * Noen brukere liker å bruke [Min konto > E-poster](/my-account/emails) forhåndsvisningsfunksjonen for å se hvordan e-postene deres vises, derfor støtter vi en konfigurerbar lagringsperiode.
  * Merk at vi også støtter [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Midlertidig databehandling {#temporary-data-processing}

Følgende data behandles midlertidig i minnet eller Redis og lagres **ikke** permanent:

### Hastighetsbegrensning {#rate-limiting}

* IP-adresser brukes midlertidig i Redis for hastighetsbegrensning.
* Data for hastighetsbegrensning utløper automatisk (vanligvis innen 24 timer).
* Dette forhindrer misbruk og sikrer rettferdig bruk av tjenestene våre.

### Tilkoblingssporing {#connection-tracking}

* Antall samtidige tilkoblinger spores per IP-adresse i Redis.
* Disse dataene utløper automatisk når tilkoblinger lukkes eller etter en kort tidsavbrudd.
* Brukes for å forhindre misbruk av tilkoblinger og sikre tjenestens tilgjengelighet.

### Autentiseringsforsøk {#authentication-attempts}

* Mislykkede autentiseringsforsøk spores per IP-adresse i Redis.
* Vi lagrer også begrensede autentiseringsmetadata på kontonivå, inkludert tellere for mislykkede påloggingsforsøk og tidsstempelet for det siste påloggingsforsøket.
* Redis-baserte data om autentiseringsforsøk utløper automatisk (vanligvis innen 24 timer).
* Brukes for å forhindre brute-force-angrep på brukerkontoer.


## Revisjonslogger {#audit-logs}

For å hjelpe deg med å overvåke og sikre kontoen og domenene dine, opprettholder vi revisjonslogger for visse endringer. Disse loggene brukes til å sende varslings-e-poster til kontoeiere og domenadministratorer.

### Kontoendringer {#account-changes}

* Vi sporer endringer i viktige kontoinnstillinger (f.eks. tofaktorautentisering, visningsnavn, tidssone).
* Når endringer oppdages, sender vi en e-postvarsling til din registrerte e-postadresse.
* Sensitive felt (f.eks. passord, API-nøkler, gjenopprettingsnøkler) spores, men verdiene deres redigeres i varslingene.
* Revisjonsloggoppføringer slettes etter at varslings-e-posten er sendt.

### Endringer i domeninnstillinger {#domain-settings-changes}

For domener med flere administratorer tilbyr vi detaljert revisjonslogging for å hjelpe team med å spore konfigurasjonsendringer:

**Hva vi sporer:**

* Endringer i domeninnstillinger (f.eks. bounce-webhooks, spamfiltrering, DKIM-konfigurasjon)
* Hvem som gjorde endringen (brukerens e-postadresse)
* Når endringen ble gjort (tidsstempel)
* IP-adressen endringen ble gjort fra
* Nettleser-/klient user-agent-strengen

**Hvordan det fungerer:**

* Alle domenadministratorer mottar en samlet e-postvarsling når innstillinger endres.
* Varslingen inkluderer en tabell som viser hver endring med brukeren som gjorde den, deres IP-adresse og tidsstempel.
* Sensitive felt (f.eks. webhook-nøkler, API-nøkler, DKIM private nøkler) spores, men verdiene redigeres.
* User-agent-informasjon inkluderes i en sammenleggbar seksjon kalt "Tekniske detaljer".
* Revisjonsloggoppføringer slettes etter at varslings-e-posten er sendt.

**Hvorfor vi samler dette:**

* For å hjelpe domenadministratorer med å opprettholde sikkerhetsovervåkning
* For å gjøre det mulig for team å revidere hvem som gjorde konfigurasjonsendringer
* For å bistå med feilsøking hvis uventede endringer oppstår
* For å gi ansvarlighet ved delt domenestyring


## Informasjonskapsler og økter {#cookies-and-sessions}

* Vi lagrer HTTP-only, signerte informasjonskapsler og øktdata på serversiden for din nettstedstrafikk.
* Informasjonskapsler bruker SameSite-beskyttelse.
* Vi lagrer aktive nettstedsøktidentifikatorer på kontoen din for å støtte funksjoner som `"log out other devices"` og sikkerhetsrelatert ugyldiggjøring av økter.
* Økt-informasjonskapsler utløper etter 30 dagers inaktivitet.
* Vi oppretter ikke økter for roboter eller gjennomsøkere.
* Vi bruker informasjonskapsler og økter for:
  * Autentisering og påloggingsstatus
  * Tofaktorautentisering "husk meg"-funksjonalitet
  * Flash-meldinger og varsler
  * [Analyse](#analytics): den første siden under besøket ditt, henvisningsdomenet, kampanjeparametere (UTM) og et sideantall


## Analytics {#analytics}

Vi bruker vårt eget personvernfokuserte analyssystem for å forstå hvordan tjenestene våre brukes. Dette systemet er designet med personvern som et kjerneprinsipp:

**Hva vi IKKE samler inn:**

* Vi lagrer ikke IP-adresser
* Vi setter ikke en separat informasjonskapsel for analyse
* Vi bruker ingen tredjeparts analysetjenester
* Vi sporer ikke besøkende over dager eller økter når de ikke er logget inn

**Hva vi samler inn:**

* Aggregert sidevisninger og tjenestebruk (SMTP, IMAP, POP3, API, osv.)
* Nettleser- og operativsystemtype og -versjon (tolket fra brukeragent, rådata slettes)
* Enhetstype (stasjonær, mobil, nettbrett)
* Henvisningsdomene (ikke full URL) og kampanjeparametere (UTM)
* E-postklienttype for e-postprotokoller (f.eks. Thunderbird, Outlook)
* Den forespurte siden eller API-stien, der verdier som domenenavn, ID-er og tokens er erstattet med plassholdere, og om forespørselen lyktes
* Ved besøk på nettstedet: den første siden under besøket og et sideantall, som lagres i økten din (se [Informasjonskapsler og økter](#cookies-and-sessions))
* Når du er logget inn, ID-en til kontoen din, aliaset ditt eller domenet ditt, slik at vi kan se hvordan hver tjeneste brukes og feilsøke problemer

**Databevaring:**

* Analysehendelser slettes automatisk etter 30 dager
* Samlede tall per time, som ikke er knyttet til noen konto, beholdes i 90 dager
* Øktidentifikatorer roteres daglig og kan ikke brukes til å spore besøkende over dager


## Apper og webmail {#apps-and-webmail}

Denne delen gjelder e-postappene våre for iOS, Android, macOS, Windows og Linux, samt webmailen vår på <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, som alle deler den samme koden. Appene inneholder ingen reklame- eller sporingskode og ingen tredjepartsanalyse.

### Data på enheten din {#data-on-your-device}

* Appene lagrer e-postene, kontaktene, kalenderne, innstillingene og påloggingsopplysningene dine på enheten din, slik at de lastes inn raskt og fungerer uten nett.
* Hvis du slår på App Lock, krypterer appen lagret e-postinnhold, kontakter og påloggingsopplysninger med en nøkkel som er beskyttet av PIN-koden eller tilgangsnøkkelen din. Datoer, mapper, etiketter og flagg forblir ukrypterte, slik at appen kan sortere og telle e-postene dine.
* Når du logger ut av en konto, fjernes kontoens data fra enheten din.

### Data som appene sender til oss {#data-the-apps-send-us}

* E-postadressen og passordet til aliaset ditt sendes med hver forespørsel for å logge deg inn.
* E-postene, kontaktene, kalenderne, etikettene og filtrene du sender, oppretter eller endrer. Vi lagrer e-poster, kontakter og kalendere som beskrevet i [E-postlagring](#email-storage), og e-poster du sender, som beskrevet i [Utgående SMTP-e-poster](#outbound-smtp-emails).
* Søkeordene dine, slik at vi kan søke i postkassen din på serverne våre. Søkeord er en del av forespørselens URL, så de kan forekomme i [feillogger](#error-logs) og [serverlogger](#server-logs).
* Tilbakemeldinger du velger å sende fra appen. De sendes på e-post fra aliaset ditt til supportteamet vårt, sammen med eventuelle diagnostiske detaljer du velger å ta med.
* E-poster du rapporterer som spam. Appen videresender dem til teamet vårt som håndterer misbruk (eller til en annen adresse du angir under Settings).

### Push-varsler {#push-notifications}

* Når du tillater varsler, registrerer appen et push-token hos oss. Vi lagrer det sammen med plattformen, aliaset og kontoen det gjelder, tidspunktet for siste levering og et enhetsnavn fra appens brukeragent, som inneholder versjonen av operativsystemet ditt og, på Android, enhetsmodellen din.
* Vi beholder et push-token i opptil ett år etter at det sist ble brukt. Vi sletter det tidligere hvis du logger ut av appen, hvis leveringen mislykkes tre ganger på rad, hvis aliaspassordet endres, hvis du sletter aliaset eller kontoen din, eller hvis aliaset går over til en annen eier.
* På iOS og macOS går varslene gjennom Apple Push Notification service. I Android-appen vår fra Google Play går de gjennom Firebase Cloud Messaging. Varsler om ny e-post inneholder avsenderens navn og adresse, emnet, en kort forhåndsvisning og mappenavnet, også for e-post som kommer inn uten et synlig varsel, for eksempel e-post som legges i mappen Søppelpost eller Sendt. Når e-poster, kalendere eller kontakter endres, sender vi også stille varsler med identifikatorer, men uten e-postinnhold, slik at appen holder seg oppdatert.
* Med [UnifiedPush](https://unifiedpush.org/) på Android, og med varsler i en nettleser, krypteres hvert varsel slik at bare enheten din kan lese det.
* Android-appen vår fra Google Play inneholder Firebase Cloud Messaging, som sender Google en Firebase-installasjons-ID, appversjonen samt enhets- og SDK-detaljer. Den Google-frie Android-appen vår fra GitHub inneholder ikke Firebase.

### Bilder og lenker i e-poster {#images-and-links-in-emails}

* Bilder i e-poster lastes inn fra avsenderens servere, som kan se IP-adressen din og når bildene ble lastet inn.
* Appene blokkerer sporingspiksler som standard. Du kan også blokkere alle eksterne bilder under Settings > Privacy & Security, og deretter laste dem inn for én e-post om gangen.
* Lenker i e-poster åpnes i nettleseren din.

### Andre tilkoblinger {#other-connections}

* Webmailen vår spør GitHub om sin nyeste versjon når den lastes inn, når du går tilbake til den, og hvert 10. minutt mens den er åpen. About & Help spør GitHub om den nyeste skrivebordsversjonen, og skrivebordsappene ser etter oppdateringer på GitHub. GitHub mottar IP-adressen din med disse forespørslene.


## Informasjon som deles {#information-shared}

Vi deler ikke informasjonen din med noen tredjepart, bortsett fra tjenesteleverandører som driver deler av tjenesten vår, for eksempel Cloudflare (beskyttelse av nettstedet og krypterte sikkerhetskopier), Stripe og PayPal (betalinger), og tjenestene som leverer push-varsler til enhetene dine (se [Push-varsler](#push-notifications)).

Vi kan bli nødt til å og vil etterkomme rettslige pålegg (men husk at [vi ikke samler inn informasjon nevnt ovenfor under "Informasjon som ikke samles inn"](#information-not-collected), så vi vil ikke kunne gi den i utgangspunktet).


## Fjerning av informasjon {#information-removal}

Hvis du når som helst ønsker å fjerne informasjon du har gitt oss, gå til <a href="/my-account/security">Min konto > Sikkerhet</a> og klikk "Slett konto".

På grunn av misbruksforebygging og -begrensning kan kontoen din kreve manuell sletting gjennomgang av våre administratorer hvis du sletter den innen 5 dager etter din første betaling.

Denne prosessen tar vanligvis mindre enn 24 timer og ble innført fordi brukere spredte spam med tjenesten vår, for så raskt å slette kontoene sine – noe som hindret oss i å blokkere betalingsmetodefingeravtrykkene deres i Stripe.

Når du sletter kontoen din, slettes også domenene du administrerer, aliasene dine og push-tokens som er registrert for dem. Selve kontooppføringen blir værende, men e-postadressen, faktureringsopplysningene, passordet og tilgangsnøklene fjernes, og tofaktorautentiseringen og API-tokenet tilbakekalles, og vi beholder betalingsoppføringene dens for refusjoner og regnskap. Logger og analysedata som viser til kontoen din, slettes i henhold til tidsrammene ovenfor.

For å fjerne appenes data fra en enhet, logg ut av appen eller avinstaller den.


## Tilleggsopplysninger {#additional-disclosures}

Dette nettstedet er beskyttet av Cloudflare og deres [Privacy Policy](https://www.cloudflare.com/privacypolicy/) og [Terms of Service](https://www.cloudflare.com/website-terms/) gjelder.
