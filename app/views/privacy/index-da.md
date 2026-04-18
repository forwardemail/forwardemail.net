# Privatlivspolitik {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Information Ikke Indsamlet](#information-not-collected)
* [Information Indsamlet](#information-collected)
  * [Kontooplysninger](#account-information)
  * [E-mail Opbevaring](#email-storage)
  * [Fejllogs](#error-logs)
  * [Udgående SMTP E-mails](#outbound-smtp-emails)
* [Midlertidig Databehandling](#temporary-data-processing)
  * [Ratebegrænsning](#rate-limiting)
  * [Forbindelsessporing](#connection-tracking)
  * [Autentificeringsforsøg](#authentication-attempts)
* [Revisionslogs](#audit-logs)
  * [Kontoændringer](#account-changes)
  * [Domæneindstillingsændringer](#domain-settings-changes)
* [Cookies og Sessioner](#cookies-and-sessions)
* [Analyse](#analytics)
* [Delte Oplysninger](#information-shared)
* [Fjernelse af Oplysninger](#information-removal)
* [Yderligere Oplysninger](#additional-disclosures)


## Ansvarsfraskrivelse {#disclaimer}

Se venligst vores [Vilkår](/terms), da de gælder på hele siden.


## Information Ikke Indsamlet {#information-not-collected}

**Med undtagelse af de oplysninger, der udtrykkeligt er beskrevet i denne politik — herunder [fejllogs](#error-logs), [udgående SMTP-e-mails](#outbound-smtp-emails), [kontoinformation](#account-information), [midlertidig databehandling](#temporary-data-processing), [revisionslogs](#audit-logs) og [cookies og sessioner](#cookies-og-sessions):**

* Vi gemmer ikke videresendte e-mails på disk eller i databaser.
* Vi gemmer ikke metadata om videresendte e-mails på disk eller i databaser.
* Med undtagelse af hvad der udtrykkeligt er beskrevet i denne politik, gemmer vi ikke logs eller IP-adresser på disk eller i databaser.
* Vi bruger ikke tredjepartsanalyse- eller telemetritjenester.


## Information Indsamlet {#information-collected}

For gennemsigtighed kan du til enhver tid <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">se vores kildekode</a> for at se, hvordan nedenstående information indsamles og bruges.

**Strengt til funktionalitet og for at forbedre vores service indsamler og gemmer vi sikkert følgende information:**

### Kontooplysninger {#account-information}

* Vi gemmer din e-mailadresse, som du giver os.
* Vi gemmer dine domænenavne, aliaser og konfigurationer, som du giver os.
* Vi gemmer begrænsede kontosikkerhedsmetadata, der er nødvendige for at beskytte din konto og administrere adgang, herunder aktive websteds-session-id'er, tællere for mislykkede loginforsøg og tidsstemplet for det sidste loginforsøg.
* Enhver yderligere information, du frivilligt giver os, såsom kommentarer eller spørgsmål, der sendes til os via e-mail eller på vores <a href="/help">hjælpeside</a>.


**Tilmeldingsattribution** (gemt permanent på din konto):

Når du opretter en konto, gemmer vi følgende information for at forstå, hvordan brugere finder vores service:

* Det henvisende websteds domæne (ikke fuld URL)
* Den første side, du besøgte på vores site
* UTM-kampagneparametre, hvis de er til stede i URL'en

### E-mail Opbevaring {#email-storage}

* Vi gemmer e-mails og kalenderinformation i din [krypterede SQLite-database](/blog/docs/best-quantum-safe-encrypted-email-service) udelukkende til din IMAP/POP3/CalDAV/CardDAV adgang og postkassefunktionalitet.
  * Bemærk, at hvis du kun bruger vores e-mail videresendelsestjenester, gemmes der ingen e-mails på disk eller i database som beskrevet i [Information Ikke Indsamlet](#information-not-collected).
  * Vores e-mail videresendelsestjenester kører kun i hukommelsen (ingen skrivning til disk eller databaser).
  * IMAP/POP3/CalDAV/CardDAV lagring er krypteret i hvile, krypteret under overførsel og gemt på en LUKS-krypteret disk.
  * Backups af din IMAP/POP3/CalDAV/CardDAV lagring er krypteret i hvile, krypteret under overførsel og gemt på [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Fejllogs {#error-logs}

* Vi gemmer `4xx` og `5xx` SMTP svar kode [fejllogs](/faq#do-you-store-error-logs) i 7 dage.
* Fejllogs indeholder SMTP-fejlen, konvolutten og e-mail headers (vi **gemmer ikke** e-mailens indhold eller vedhæftninger).
* Fejllogs kan indeholde IP-adresser og værtsnavne på afsendende servere til fejlfinding.
* Fejllogs for [ratebegrænsning](/faq#do-you-have-rate-limiting) og [greylisting](/faq#do-you-have-a-greylist) er ikke tilgængelige, da forbindelsen afsluttes tidligt (f.eks. før `RCPT TO` og `MAIL FROM` kommandoer kan sendes).
### Udgående SMTP-e-mails {#outbound-smtp-emails}

* Vi gemmer [udgående SMTP-e-mails](/faq#do-you-support-sending-email-with-smtp) i ca. 30 dage.
  * Denne periode varierer baseret på "Date"-headeren; da vi tillader, at e-mails kan sendes i fremtiden, hvis en fremtidig "Date"-header findes.
  * **Bemærk, at når en e-mail er blevet leveret succesfuldt eller permanent fejler, vil vi redigere og slette meddelelsens indhold.**
  * Hvis du ønsker at konfigurere, at din udgående SMTP-e-mails meddelelsesindhold skal gemmes længere end standarden på 0 dage (efter succesfuld levering eller permanent fejl), så gå til Avancerede Indstillinger for dit domæne og indtast en værdi mellem `0` og `30`.
  * Nogle brugere nyder at bruge [Min Konto > E-mails](/my-account/emails) preview-funktionen for at se, hvordan deres e-mails vises, derfor understøtter vi en konfigurerbar opbevaringsperiode.
  * Bemærk også, at vi understøtter [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Midlertidig Databehandling {#temporary-data-processing}

Følgende data behandles midlertidigt i hukommelsen eller Redis og gemmes **ikke** permanent:

### Ratebegrænsning {#rate-limiting}

* IP-adresser bruges midlertidigt i Redis til ratebegrænsningsformål.
* Ratebegrænsningsdata udløber automatisk (typisk inden for 24 timer).
* Dette forhindrer misbrug og sikrer fair brug af vores tjenester.

### Forbindelsessporing {#connection-tracking}

* Samtidige forbindelsestællinger spores pr. IP-adresse i Redis.
* Disse data udløber automatisk, når forbindelser lukkes eller efter en kort timeout.
* Bruges til at forhindre forbindelsesmisbrug og sikre tjenestens tilgængelighed.

### Autentificeringsforsøg {#authentication-attempts}

* Mislykkede godkendelsesforsøg spores pr. IP-adresse i Redis.
* Vi gemmer også begrænset konto-niveau godkendelsesmetadata, herunder tællere for mislykkede loginforsøg og tidsstemplet for det sidste loginforsøg.
* Redis-baserede data om godkendelsesforsøg udløber automatisk (typisk inden for 24 timer).
* Bruges til at forhindre brute-force angreb på brugerkonti.


## Revisionslogfiler {#audit-logs}

For at hjælpe dig med at overvåge og sikre din konto og domæner, opretholder vi revisionslogfiler for visse ændringer. Disse logfiler bruges til at sende notifikations-e-mails til kontoejere og domæneadministratorer.

### Kontoændringer {#account-changes}

* Vi sporer ændringer i vigtige kontoindstillinger (f.eks. tofaktorautentificering, visningsnavn, tidszone).
* Når ændringer opdages, sender vi en e-mail-notifikation til din registrerede e-mailadresse.
* Følsomme felter (f.eks. adgangskode, API-tokens, gendannelsesnøgler) spores, men deres værdier redigeres i notifikationerne.
* Revisionslogposter slettes efter, at notifikations-e-mailen er sendt.

### Ændringer i domæneindstillinger {#domain-settings-changes}

For domæner med flere administratorer tilbyder vi detaljeret revisionslogning for at hjælpe teams med at spore konfigurationsændringer:

**Hvad vi sporer:**

* Ændringer i domæneindstillinger (f.eks. bounce-webhooks, spamfiltrering, DKIM-konfiguration)
* Hvem der foretog ændringen (brugerens e-mailadresse)
* Hvornår ændringen blev foretaget (tidsstempel)
* IP-adressen, hvorfra ændringen blev foretaget
* Browser-/klient-user-agent-strengen

**Hvordan det fungerer:**

* Alle domæneadministratorer modtager en enkelt samlet e-mail-notifikation, når indstillinger ændres.
* Notifikationen inkluderer en tabel, der viser hver ændring med brugeren, der foretog den, deres IP-adresse og tidsstempel.
* Følsomme felter (f.eks. webhook-nøgler, API-tokens, DKIM-private nøgler) spores, men deres værdier redigeres.
* User-agent-information inkluderes i en sammenklappelig sektion "Tekniske Detaljer".
* Revisionslogposter slettes efter, at notifikations-e-mailen er sendt.

**Hvorfor vi indsamler dette:**

* For at hjælpe domæneadministratorer med at opretholde sikkerhedsoverblik
* For at gøre det muligt for teams at revidere, hvem der foretog konfigurationsændringer
* For at assistere med fejlfinding, hvis uventede ændringer opstår
* For at sikre ansvarlighed ved delt domænestyring


## Cookies og Sessioner {#cookies-and-sessions}

* Vi gemmer HTTP-only, signerede cookies og serverside sessionsdata for din webtrafik.
* Cookies bruger SameSite-beskyttelse.
* Vi gemmer aktive websessions-id'er på din konto for at understøtte funktioner som "log ud af andre enheder" og sikkerhedsrelateret sessionsinvalidering.
* Sessionscookies udløber efter 30 dages inaktivitet.
* Vi opretter ikke sessioner for bots eller crawlere.
* Vi bruger cookies og sessioner til:
  * Autentificering og loginstatus
  * To-faktor-autentificerings "huske mig"-funktionalitet
  * Flash-beskeder og notifikationer


## Analytics {#analytics}

Vi bruger vores eget privatlivsfokuserede analyssystem til at forstå, hvordan vores tjenester bruges. Dette system er designet med privatliv som et kerneprincip:

**Hvad vi IKKE indsamler:**

* Vi gemmer ikke IP-adresser
* Vi bruger ikke cookies eller vedvarende identifikatorer til analyse
* Vi bruger ikke nogen tredjeparts analysetjenester
* Vi sporer ikke brugere på tværs af dage eller sessioner

**Hvad vi GØR indsamle (anonymiseret):**

* Aggregerede sidevisninger og tjenestebrug (SMTP, IMAP, POP3, API osv.)
* Browser- og operativsystemtype (udtrukket fra user agent, rådata kasseres)
* Enhedstype (desktop, mobil, tablet)
* Henvisningsdomæne (ikke fuld URL)
* E-mailklienttype for mailprotokoller (f.eks. Thunderbird, Outlook)

**Dataopbevaring:**

* Analyse-data slettes automatisk efter 30 dage
* Sessionsidentifikatorer roteres dagligt og kan ikke bruges til at spore brugere på tværs af dage


## Information Shared {#information-shared}

Vi deler ikke dine oplysninger med nogen tredjepart.

Vi kan være nødt til og vil efterkomme retskendte juridiske anmodninger (men husk [vi indsamler ikke oplysninger nævnt ovenfor under "Information Not Collected"](#information-not-collected), så vi vil ikke kunne levere dem til at begynde med).


## Information Removal {#information-removal}

Hvis du på noget tidspunkt ønsker at fjerne oplysninger, som du har givet os, så gå til <a href="/my-account/security">Min Konto > Sikkerhed</a> og klik på "Slet Konto".

På grund af misbrugsforebyggelse og -afhjælpning kan din konto kræve manuel sletningsgennemgang af vores administratorer, hvis du sletter den inden for 5 dage efter din første betaling.

Denne proces tager normalt mindre end 24 timer og blev implementeret, fordi brugere spammede med vores tjeneste og derefter hurtigt slettede deres konti – hvilket forhindrede os i at blokere deres betalingsmetodefingeraftryk i Stripe.


## Additional Disclosures {#additional-disclosures}

Dette site er beskyttet af Cloudflare, og dets [Privacy Policy](https://www.cloudflare.com/privacypolicy/) og [Terms of Service](https://www.cloudflare.com/website-terms/) gælder.
