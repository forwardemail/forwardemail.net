# Privatlivspolitik {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" /> -->


## Indholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Information Ikke Indsamlet](#information-not-collected)
* [Information Indsamlet](#information-collected)
  * [Kontooplysninger](#account-information)
  * [E-mail Opbevaring](#email-storage)
  * [Fejllogs](#error-logs)
  * [Serverlogs](#server-logs)
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
* [Apps og webmail](#apps-and-webmail)
  * [Data på din enhed](#data-on-your-device)
  * [Data, som appsene sender til os](#data-the-apps-send-us)
  * [Push-notifikationer](#push-notifications)
  * [Billeder og links i e-mails](#images-and-links-in-emails)
  * [Andre forbindelser](#other-connections)
* [Delte Oplysninger](#information-shared)
* [Fjernelse af Oplysninger](#information-removal)
* [Yderligere Oplysninger](#additional-disclosures)


## Ansvarsfraskrivelse {#disclaimer}

Se venligst vores [Vilkår](/terms), da de gælder på hele siden.


## Information Ikke Indsamlet {#information-not-collected}

**Med undtagelse af de oplysninger, der udtrykkeligt er beskrevet i denne politik (herunder [fejllogs](#error-logs), [serverlogs](#server-logs), [udgående SMTP-e-mails](#outbound-smtp-emails), [kontoinformation](#account-information), [midlertidig databehandling](#temporary-data-processing), [revisionslogs](#audit-logs), [cookies og sessioner](#cookies-and-sessions), [analyse](#analytics) og [apps og webmail](#apps-and-webmail)):**

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
* Den første side, du besøgte på vores site, med værdier i dens sti såsom domænenavne, id'er og tokens erstattet af pladsholdere
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
* Vi gemmer også fejllogs for web- og API-anmodninger, der fejler eller tager for lang tid, og for fejl på vores IMAP-, POP3-, CalDAV- og CardDAV-servere, i 7 dage.
* Disse logs kan indeholde IP-adressen, anmodningens URL (herunder forespørgselsstrenge såsom søgeord), anmodningsheadere som f.eks. user agent samt den konto eller det alias, der er involveret.
* Adgangskoder, API-tokens, cookies og anmodningsindhold fjernes fra disse logs, før de gemmes.

### Serverlogs {#server-logs}

* For hver web- og API-anmodning skriver vores servere en loglinje, som kan indeholde IP-adressen, anmodningens metode og URL (herunder forespørgselsstrenge), anmodningsheadere, svarstatus og den konto, der er logget ind.
* Vi bruger disse logs til at finde og løse problemer og til at stoppe misbrug, og vi opbevarer dem i op til 30 dage.

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
  * [Analyse](#analytics): den første side under dit besøg, henvisningsdomænet, kampagneparametre (UTM) og et sideantal


## Analytics {#analytics}

Vi bruger vores eget privatlivsfokuserede analyssystem til at forstå, hvordan vores tjenester bruges. Dette system er designet med privatliv som et kerneprincip:

**Hvad vi IKKE indsamler:**

* Vi gemmer ikke IP-adresser
* Vi sætter ikke en separat cookie til analyse
* Vi bruger ikke nogen tredjeparts analysetjenester
* Vi sporer ikke besøgende på tværs af dage eller sessioner, når de ikke er logget ind

**Hvad vi GØR indsamle:**

* Aggregerede sidevisninger og tjenestebrug (SMTP, IMAP, POP3, API osv.)
* Browser- og operativsystemtype og -version (udtrukket fra user agent, rådata kasseres)
* Enhedstype (desktop, mobil, tablet)
* Henvisningsdomæne (ikke fuld URL) og kampagneparametre (UTM)
* E-mailklienttype for mailprotokoller (f.eks. Thunderbird, Outlook)
* Den anmodede side eller API-sti, hvor værdier såsom domænenavne, id'er og tokens er erstattet af pladsholdere, og om anmodningen lykkedes
* Ved besøg på webstedet: den første side under besøget og et sideantal, som opbevares i din session (se [Cookies og Sessioner](#cookies-and-sessions))
* Når du er logget ind, ID'et for din konto, dit alias eller dit domæne, så vi kan se, hvordan hver tjeneste bruges, og fejlfinde problemer

**Dataopbevaring:**

* Analysehændelser slettes automatisk efter 30 dage
* Samlede tal pr. time, som ikke er knyttet til nogen konto, opbevares i 90 dage
* Sessionsidentifikatorer roteres dagligt og kan ikke bruges til at spore besøgende på tværs af dage


## Apps og webmail {#apps-and-webmail}

Dette afsnit dækker vores e-mailapps til iOS, Android, macOS, Windows og Linux samt vores webmail på <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, som alle deler den samme kode. Appsene indeholder ingen reklame- eller sporingskode og ingen tredjepartsanalyse.

### Data på din enhed {#data-on-your-device}

* Appsene gemmer dine e-mails, kontakter, kalendere, indstillinger og loginoplysninger på din enhed, så de indlæses hurtigt og fungerer offline.
* Hvis du slår App Lock til, krypterer appen gemt e-mailindhold, kontakter og loginoplysninger med en nøgle, der er beskyttet af din PIN-kode eller adgangsnøgle. Datoer, mapper, etiketter og flag forbliver ukrypterede, så appen kan sortere og tælle dine e-mails.
* Når du logger ud af en konto, fjernes dens data fra din enhed.

### Data, som appsene sender til os {#data-the-apps-send-us}

* E-mailadressen og adgangskoden til dit alias sendes med hver anmodning for at logge dig ind.
* De e-mails, kontakter, kalendere, etiketter og filtre, du sender, opretter eller ændrer. Vi gemmer e-mails, kontakter og kalendere som beskrevet i [E-mail Opbevaring](#email-storage), og e-mails, du sender, som beskrevet i [Udgående SMTP-e-mails](#outbound-smtp-emails).
* Dine søgeord, så vi kan søge i din postkasse på vores servere. Søgeord er en del af anmodningens URL, så de kan optræde i [fejllogs](#error-logs) og [serverlogs](#server-logs).
* Feedback, du vælger at sende fra appen. Den sendes som e-mail fra dit alias til vores supportteam sammen med eventuelle diagnostiske oplysninger, du vælger at medtage.
* E-mails, du rapporterer som spam. Appen videresender dem til vores team, der håndterer misbrug (eller til en anden adresse, du angiver under Settings).

### Push-notifikationer {#push-notifications}

* Når du tillader notifikationer, registrerer appen et push-token hos os. Vi gemmer det sammen med platformen, det alias og den konto, det hører til, tidspunktet for dets seneste levering og et enhedsnavn fra appens user agent, som indeholder versionen af dit operativsystem og, på Android, din enhedsmodel.
* Vi opbevarer et push-token i op til et år efter sidste brug. Vi sletter det tidligere, når du logger ud af appen, når leveringen fejler tre gange i træk, når adgangskoden til aliaset ændres, når du sletter aliaset eller din konto, eller når aliaset overgår til en anden ejer.
* På iOS og macOS sendes notifikationer via Apple Push Notification service. I vores Android-app fra Google Play sendes de via Firebase Cloud Messaging. Notifikationer om nye e-mails indeholder afsenderens navn og adresse, emnet, en kort forhåndsvisning og mappenavnet, også for e-mails, der ankommer uden en synlig notifikation, såsom e-mails, der lægges i mappen Uønsket eller Sendt. Når e-mails, kalendere eller kontakter ændres, sender vi også lydløse notifikationer med id'er, men uden e-mailindhold, så appen forbliver opdateret.
* Med [UnifiedPush](https://unifiedpush.org/) på Android og med notifikationer i en webbrowser krypteres hver notifikation, så kun din enhed kan læse den.
* Vores Android-app fra Google Play indeholder Firebase Cloud Messaging, som sender Google et Firebase-installations-ID, appversionen samt enheds- og SDK-oplysninger. Vores Google-frie Android-app fra GitHub indeholder ikke Firebase.

### Billeder og links i e-mails {#images-and-links-in-emails}

* Billeder i e-mails indlæses fra afsenderens servere, som kan se din IP-adresse, og hvornår billederne blev indlæst.
* Appsene blokerer sporingspixels som standard. Du kan også blokere alle eksterne billeder under Settings > Privacy & Security og derefter indlæse dem for én e-mail ad gangen.
* Links i e-mails åbnes i din webbrowser.

### Andre forbindelser {#other-connections}

* Vores webmail spørger GitHub om sin seneste version, når den indlæses, når du vender tilbage til den, og hvert 10. minut, mens den er åben. About & Help spørger GitHub om den seneste desktopversion, og desktopappsene søger efter opdateringer på GitHub. GitHub modtager din IP-adresse med disse anmodninger.


## Information Shared {#information-shared}

Vi deler ikke dine oplysninger med nogen tredjepart, undtagen tjenesteudbydere, der driver dele af vores tjeneste, såsom Cloudflare (beskyttelse af webstedet og krypterede backups), Stripe og PayPal (betalinger), og de tjenester, der leverer push-notifikationer til dine enheder (se [Push-notifikationer](#push-notifications)).

Vi kan være nødt til og vil efterkomme retskendte juridiske anmodninger (men husk [vi indsamler ikke oplysninger nævnt ovenfor under "Information Not Collected"](#information-not-collected), så vi vil ikke kunne levere dem til at begynde med).


## Information Removal {#information-removal}

Hvis du på noget tidspunkt ønsker at fjerne oplysninger, som du har givet os, så gå til <a href="/my-account/security">Min Konto > Sikkerhed</a> og klik på "Slet Konto".

På grund af misbrugsforebyggelse og -afhjælpning kan din konto kræve manuel sletningsgennemgang af vores administratorer, hvis du sletter den inden for 5 dage efter din første betaling.

Denne proces tager normalt mindre end 24 timer og blev implementeret, fordi brugere spammede med vores tjeneste og derefter hurtigt slettede deres konti – hvilket forhindrede os i at blokere deres betalingsmetodefingeraftryk i Stripe.

Når du sletter din konto, slettes også de domæner, du administrerer, dine aliaser og de push-tokens, der er registreret til dem. Selve kontoposten bevares, men dens e-mailadresse, faktureringsoplysninger, adgangskode og adgangsnøgler fjernes, og dens tofaktorgodkendelse og API-token tilbagekaldes, og vi opbevarer dens betalingsposter til refusioner og regnskab. Logs og analysedata, der henviser til din konto, slettes inden for de tidsfrister, der er angivet ovenfor.

For at fjerne appsenes data fra en enhed skal du logge ud af appen eller afinstallere den.


## Additional Disclosures {#additional-disclosures}

Dette site er beskyttet af Cloudflare, og dets [Privacy Policy](https://www.cloudflare.com/privacypolicy/) og [Terms of Service](https://www.cloudflare.com/website-terms/) gælder.
