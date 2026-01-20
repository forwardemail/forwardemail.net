# Privatlivspolitik {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Oplysninger, der ikke er indsamlet](#information-not-collected)
* [Indsamlede oplysninger](#information-collected)
* [Information delt](#information-shared)
* [Fjernelse af oplysninger](#information-removal)
* [Yderligere oplysninger](#additional-disclosures)

## Ansvarsfraskrivelse {#disclaimer}

Venligst overhold vores [Vilkår](/terms), da den gælder for hele webstedet.

## Oplysninger ikke indsamlet {#information-not-collected}

**Med undtagelse af [fejl](/faq#do-you-store-error-logs), [udgående SMTP-e-mails](/faq#do-you-support-sending-email-with-smtp), og/eller når spam eller ondsindet aktivitet registreres (f.eks. til hastighedsbegrænsning):**

* Vi gemmer ikke videresendte e-mails på disk eller i databaser.
* Vi gemmer ikke metadata om e-mails på disk eller i databaser.
* Vi gemmer ikke logfiler eller IP-adresser på disk eller i databaser.

## Oplysninger indsamlet {#information-collected}

For at sikre gennemsigtighed kan du til enhver tid <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">se vores kildekode</a> for at se, hvordan nedenstående oplysninger indsamles og bruges:

**Udelukkende af funktionalitetsmæssige årsager og for at forbedre vores service indsamler og opbevarer vi følgende oplysninger sikkert:**

* Vi gemmer e-mails og kalenderoplysninger i din [krypteret SQLite-database](/blog/docs/best-quantum-safe-encrypted-email-service) udelukkende for din IMAP/POP3/CalDAV/CardDAV-adgang og postkassefunktionalitet.
* Bemærk, at hvis du kun bruger vores e-mail-videresendelsestjenester, gemmes ingen e-mails på disk eller databaselager som beskrevet i [Oplysninger, der ikke er indsamlet](#information-not-collected).
* Vores e-mail-videresendelsestjenester fungerer kun i hukommelsen (ingen skrivning til disklager eller databaser).
* IMAP/POP3/CalDAV/CardDAV-lager er krypteret i hvile, krypteret under transport og gemt på en LUKS-krypteret disk.
* Sikkerhedskopier til dit IMAP/POP3/CalDAV/CardDAV-lager er krypteret i hvile, krypteret under transport og gemt på [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Vi gemmer en cookie i en session for din hjemmesidetrafik.
* Vi gemmer den e-mailadresse, du giver os.
* Vi gemmer dine domænenavne, aliasser og konfigurationer, som du giver os.
* Vi gemmer `4xx` og `5xx` SMTP-svarkoden [fejllogge](/faq#do-you-store-error-logs) i 7 dage.
* Vi gemmer [udgående SMTP-e-mails](/faq#do-you-support-sending-email-with-smtp) i ~30 dage.
* Denne længde varierer afhængigt af "Date"-headeren, da vi tillader, at e-mails sendes i fremtiden, hvis der findes en fremtidig "Date"-header.
* **Bemærk, at når en e-mail er leveret eller har permanente fejl, redigerer og fjerner vi beskedens brødtekst.**
* Hvis du vil konfigurere din udgående SMTP-e-mail-besked til at blive opbevaret længere end standardværdien på 0 dage (efter vellykket levering eller permanent fejl), skal du gå til Avancerede indstillinger for dit domæne og indtaste en værdi mellem `0` og `30`.
* Nogle brugere kan lide at bruge [Min konto > E-mails](/my-account/emails)-forhåndsvisningsfunktionen til at se, hvordan deres e-mails gengives, derfor understøtter vi en konfigurerbar opbevaringsperiode.
* Bemærk, at vi også understøtter __PROTECTED_LINK_30__0.
* Eventuelle yderligere oplysninger, som du frivilligt giver os, såsom kommentarer eller spørgsmål, der sendes til os via e-mail eller på vores <a href="/help">hjælpeside</a>.

## Oplysninger delt {#information-shared}

Vi deler ikke dine oplysninger med tredjeparter. Vi bruger heller ikke tredjepartsanalyse- eller telemetrisoftwaretjenester.

Vi kan være nødt til at efterkomme retslige anmodninger, og vil gøre det (men husk [Vi indsamler ikke oplysninger nævnt ovenfor under "Oplysninger, der ikke indsamles"](#information-not-collected), så vi vil ikke være i stand til at levere den til at begynde med).

## Fjernelse af oplysninger {#information-removal}

Hvis du på noget tidspunkt ønsker at slette oplysninger, som du har givet os, skal du gå til <a href="/my-account/security">Min konto > Sikkerhed</a> og klikke på "Slet konto".

På grund af forebyggelse og afhjælpning af misbrug kan din konto kræve manuel sletning gennemgang af vores administratorer, hvis du sletter den inden for 5 dage efter din første betaling.

Denne proces tager normalt mindre end 24 timer og blev implementeret, fordi brugerne spammede med vores tjeneste og derefter hurtigt slettede deres konti – hvilket forhindrede os i at blokere deres betalingsmetodefingeraftryk i Stripe.

## Yderligere oplysninger {#additional-disclosures}

Dette websted er beskyttet af Cloudflare, og dets [Privatlivspolitik](https://www.cloudflare.com/privacypolicy/) og [Servicevilkår](https://www.cloudflare.com/website-terms/) gælder.