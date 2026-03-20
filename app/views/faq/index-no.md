# Ofte stilte spørsmål {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email frequently asked questions" class="rounded-lg" />


## Innholdsfortegnelse {#table-of-contents}

* [Rask start](#quick-start)
* [Introduksjon](#introduction)
  * [Hva er Forward Email](#what-is-forward-email)
  * [Hvem bruker Forward Email](#who-uses-forward-email)
  * [Hva er Forward Emails historie](#what-is-forward-emails-history)
  * [Hvor rask er denne tjenesten](#how-fast-is-this-service)
* [E-postklienter](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobile enheter](#mobile-devices)
  * [Sendmail SMTP Relay-konfigurasjon](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay-konfigurasjon](#exim4-smtp-relay-configuration)
  * [msmtp SMTP-klientkonfigurasjon](#msmtp-smtp-client-configuration)
  * [Kommandolinje e-postklienter](#command-line-email-clients)
  * [Windows e-postkonfigurasjon](#windows-email-configuration)
  * [Postfix SMTP Relay-konfigurasjon](#postfix-smtp-relay-configuration)
  * [Hvordan sende e-post som ved bruk av Gmail](#how-to-send-mail-as-using-gmail)
  * [Hva er den gratis veiledningen for Send Mail As ved bruk av Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Avansert Gmail-rutingskonfigurasjon](#advanced-gmail-routing-configuration)
  * [Avansert Outlook-rutingskonfigurasjon](#advanced-outlook-routing-configuration)
* [Feilsøking](#troubleshooting)
  * [Hvorfor mottar jeg ikke test-e-postene mine](#why-am-i-not-receiving-my-test-emails)
  * [Hvordan konfigurerer jeg e-postklienten min til å fungere med Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Hvorfor havner e-postene mine i Spam og Søppel, og hvordan kan jeg sjekke domenets omdømme](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Hva bør jeg gjøre hvis jeg mottar spam-e-poster](#what-should-i-do-if-i-receive-spam-emails)
  * [Hvorfor vises test-e-postene jeg sender til meg selv i Gmail som "mistenkelige"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan jeg fjerne via forwardemail dot net i Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Databehandling](#data-management)
  * [Hvor er serverne deres lokalisert](#where-are-your-servers-located)
  * [Hvordan eksporterer og sikkerhetskopierer jeg postboksen min](#how-do-i-export-and-backup-my-mailbox)
  * [Hvordan importerer og migrerer jeg min eksisterende postboks](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Hvordan bruker jeg min egen S3-kompatible lagring for sikkerhetskopier](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Hvordan konverterer jeg SQLite-sikkerhetskopier til EML-filer](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Støtter dere selvhosting](#do-you-support-self-hosting)
* [E-postkonfigurasjon](#email-configuration)
  * [Hvordan kommer jeg i gang og setter opp e-postvideresending](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan jeg bruke flere MX-utvekslinger og servere for avansert videresending](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hvordan setter jeg opp et feriesvar (automatisk fraværsmelding)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hvordan setter jeg opp SPF for Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Hvordan setter jeg opp DKIM for Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Hvordan setter jeg opp DMARC for Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hvordan ser jeg DMARC-rapporter](#how-do-i-view-dmarc-reports)
  * [Hvordan kobler og konfigurerer jeg kontaktene mine](#how-do-i-connect-and-configure-my-contacts)
  * [Hvordan kobler og konfigurerer jeg kalenderne mine](#how-do-i-connect-and-configure-my-calendars)
  * [Hvordan legger jeg til flere kalendere og administrerer eksisterende kalendere](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hvordan kobler og konfigurerer jeg oppgaver og påminnelser](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Hvorfor kan jeg ikke opprette oppgaver i macOS Påminnelser](#why-cant-i-create-tasks-in-macos-reminders)
  * [Hvordan setter jeg opp Tasks.org på Android](#how-do-i-set-up-tasksorg-on-android)
  * [Hvordan setter jeg opp SRS for Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Hvordan setter jeg opp MTA-STS for Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hvordan legger jeg til et profilbilde til e-postadressen min](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Avanserte funksjoner](#advanced-features)
  * [Støtter dere nyhetsbrev eller mailinglister for markedsføringsrelatert e-post](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Støtter dere sending av e-post med API](#do-you-support-sending-email-with-api)
  * [Støtter dere mottak av e-post med IMAP](#do-you-support-receiving-email-with-imap)
  * [Støtter dere POP3](#do-you-support-pop3)
  * [Støtter dere kalendere (CalDAV)](#do-you-support-calendars-caldav)
  * [Støtter dere oppgaver og påminnelser (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Støtter dere kontakter (CardDAV)](#do-you-support-contacts-carddav)
  * [Støtter dere sending av e-post med SMTP](#do-you-support-sending-email-with-smtp)
  * [Støtter dere OpenPGP/MIME, ende-til-ende-kryptering ("E2EE") og Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Støtter dere S/MIME-kryptering](#do-you-support-smime-encryption)
  * [Støtter dere Sieve e-postfiltrering](#do-you-support-sieve-email-filtering)
  * [Støtter dere MTA-STS](#do-you-support-mta-sts)
  * [Støtter dere passordnøkler og WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Støtter dere beste praksis for e-post](#do-you-support-email-best-practices)
  * [Støtter dere bounce webhooks](#do-you-support-bounce-webhooks)
  * [Støtter dere webhooks](#do-you-support-webhooks)
  * [Støtter dere regulære uttrykk eller regex](#do-you-support-regular-expressions-or-regex)
  * [Hva er deres utgående SMTP-begrensninger](#what-are-your-outbound-smtp-limits)
  * [Trenger jeg godkjenning for å aktivere SMTP](#do-i-need-approval-to-enable-smtp)
  * [Hva er deres SMTP-server konfigurasjonsinnstillinger](#what-are-your-smtp-server-configuration-settings)
  * [Hva er deres IMAP-server konfigurasjonsinnstillinger](#what-are-your-imap-server-configuration-settings)
  * [Hva er deres POP3-server konfigurasjonsinnstillinger](#what-are-your-pop3-server-configuration-settings)
  * [Hvordan setter jeg opp e-post autodiscovery for mitt domene](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Sikkerhet](#security-1)
  * [Avanserte teknikker for serverherding](#advanced-server-hardening-techniques)
  * [Har dere SOC 2 eller ISO 27001-sertifiseringer](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Bruker dere TLS-kryptering for e-postvideresending](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bevarer dere e-postautentiseringsoverskrifter](#do-you-preserve-email-authentication-headers)
  * [Bevarer dere originale e-postoverskrifter og forhindrer spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hvordan beskytter dere mot spam og misbruk](#how-do-you-protect-against-spam-and-abuse)
  * [Lagrer dere e-postinnhold på disk](#do-you-store-email-content-on-disk)
  * [Kan e-postinnhold eksponeres under systemkrasj](#can-email-content-be-exposed-during-system-crashes)
  * [Hvem har tilgang til deres e-postinfrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Hvilke infrastrukturleverandører bruker dere](#what-infrastructure-providers-do-you-use)
  * [Tilbyr dere en databehandleravtale (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hvordan håndterer dere varsler om datainnbrudd](#how-do-you-handle-data-breach-notifications)
  * [Tilbyr dere et testmiljø](#do-you-offer-a-test-environment)
  * [Tilbyr dere overvåkings- og varslingsverktøy](#do-you-provide-monitoring-and-alerting-tools)
  * [Hvordan sikrer dere høy tilgjengelighet](#how-do-you-ensure-high-availability)
  * [Er dere i samsvar med Seksjon 889 i National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- og tekniske detaljer](#system-and-technical-details)
  * [Lagrer dere e-poster og deres innhold](#do-you-store-emails-and-their-contents)
  * [Hvordan fungerer deres e-postvideresendingssystem](#how-does-your-email-forwarding-system-work)
  * [Hvordan behandler dere en e-post for videresending](#how-do-you-process-an-email-for-forwarding)
  * [Hvordan håndterer dere problemer med e-postlevering](#how-do-you-handle-email-delivery-issues)
  * [Hvordan håndterer dere at IP-adressene deres blir blokkert](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Hva er postmaster-adresser](#what-are-postmaster-addresses)
  * [Hva er no-reply-adresser](#what-are-no-reply-addresses)
  * [Hva er deres servers IP-adresser](#what-are-your-servers-ip-addresses)
  * [Har dere en tillatelsesliste](#do-you-have-an-allowlist)
  * [Hvilke domenenavnforlengelser er tillatt som standard](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Hva er kriteriene for deres tillatelsesliste](#what-is-your-allowlist-criteria)
  * [Hvilke domenenavnforlengelser kan brukes gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Har dere en gråliste](#do-you-have-a-greylist)
  * [Har dere en nekteliste](#do-you-have-a-denylist)
  * [Har dere hastighetsbegrensning](#do-you-have-rate-limiting)
  * [Hvordan beskytter dere mot backscatter](#how-do-you-protect-against-backscatter)
  * [Forhindre avvisninger fra kjente MAIL FROM-spammere](#prevent-bounces-from-known-mail-from-spammers)
  * [Forhindre unødvendige avvisninger for å beskytte mot backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hvordan bestemmer dere et e-postfingeravtrykk](#how-do-you-determine-an-email-fingerprint)
  * [Kan jeg videresende e-poster til porter andre enn 25 (f.eks. hvis min ISP har blokkert port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Støtter det plusstegnet + for Gmail-aliaser](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Støtter det underdomener](#does-it-support-sub-domains)
  * [Videresender dette e-postens overskrifter](#does-this-forward-my-emails-headers)
  * [Er dette godt testet](#is-this-well-tested)
  * [Sender dere videre SMTP-responsmeldinger og -koder](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hvordan forhindrer dere spammere og sikrer godt omdømme for e-postvideresending](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hvordan utfører dere DNS-oppslag på domenenavn](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto og fakturering](#account-and-billing)
  * [Tilbyr dere pengene tilbake-garanti på betalte planer](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Hvis jeg bytter plan, pro-rater dere og refunderer differansen](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan jeg bare bruke denne e-postvideresendingstjenesten som en "fallback" eller "fallover" MX-server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan jeg deaktivere spesifikke aliaser](#can-i-disable-specific-aliases)
  * [Kan jeg videresende e-poster til flere mottakere](#can-i-forward-emails-to-multiple-recipients)
  * [Kan jeg ha flere globale catch-all-mottakere](#can-i-have-multiple-global-catch-all-recipients)
  * [Er det en maksimal grense for antall e-postadresser jeg kan videresende til per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan jeg videresende e-poster rekursivt](#can-i-recursively-forward-emails)
  * [Kan folk avregistrere eller registrere min e-postvideresending uten min tillatelse](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hvordan er det gratis](#how-is-it-free)
  * [Hva er maksimal e-poststørrelsesgrense](#what-is-the-max-email-size-limit)
  * [Lagrer dere logger av e-poster](#do-you-store-logs-of-emails)
  * [Lagrer dere feillogger](#do-you-store-error-logs)
  * [Leser dere e-postene mine](#do-you-read-my-emails)
  * [Kan jeg "sende e-post som" i Gmail med dette](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan jeg "sende e-post som" i Outlook med dette](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan jeg "sende e-post som" i Apple Mail og iCloud Mail med dette](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan jeg videresende ubegrenset med dette](#can-i-forward-unlimited-emails-with-this)
  * [Tilbyr dere ubegrensede domener for én pris](#do-you-offer-unlimited-domains-for-one-price)
  * [Hvilke betalingsmetoder aksepterer dere](#which-payment-methods-do-you-accept)
* [Ytterligere ressurser](#additional-resources)
## Komme i gang raskt {#quick-start}

For å komme i gang med Forward Email:

1. **Opprett en konto** på [forwardemail.net/register](https://forwardemail.net/register)

2. **Legg til og verifiser domenet ditt** under [Min konto → Domener](/my-account/domains)

3. **Legg til og konfigurer e-postaliaser/postbokser** under [Min konto → Domener](/my-account/domains) → Aliaser

4. **Test oppsettet ditt** ved å sende en e-post til en av dine nye aliaser

> \[!TIP]
> DNS-endringer kan ta opptil 24-48 timer å propagere globalt, selv om de ofte trer i kraft mye raskere.

> \[!IMPORTANT]
> For bedre leveringsgrad anbefaler vi å sette opp [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) og [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-poster.


## Introduksjon {#introduction}

### Hva er Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email er perfekt for enkeltpersoner, små bedrifter og utviklere som ønsker profesjonelle e-postadresser uten kostnadene og vedlikeholdet av en full e-posthostingløsning.

Forward Email er en **fullverdig e-posttjenesteleverandør** og **e-posthostingleverandør for egendefinerte domenenavn**.

Det er den eneste gratis og åpen kildekode-tjenesten, og lar deg bruke egendefinerte domenee-postadresser uten kompleksiteten ved å sette opp og vedlikeholde din egen e-postserver.

Vår tjeneste videresender e-poster sendt til ditt egendefinerte domene til din eksisterende e-postkonto – og du kan til og med bruke oss som din dedikerte e-posthostingleverandør.

Nøkkelfunksjoner i Forward Email:

* **Egendefinert domenee-post**: Bruk profesjonelle e-postadresser med ditt eget domenenavn
* **Gratisnivå**: Grunnleggende e-postvideresending uten kostnad
* **Forbedret personvern**: Vi leser ikke e-postene dine eller selger dataene dine
* **Åpen kildekode**: Hele kodebasen vår er tilgjengelig på GitHub
* **SMTP-, IMAP- og POP3-støtte**: Full e-postsending og mottak
* **Ende-til-ende-kryptering**: Støtte for OpenPGP/MIME
* **Egendefinerte catch-all aliaser**: Opprett ubegrensede e-postaliaser

Du kan sammenligne oss med 56+ andre e-posttjenesteleverandører på [vår e-postsammenligningsside](/blog/best-email-service).

> \[!TIP]
> Lær mer om Forward Email ved å lese vårt gratis [Tekniske Whitepaper](/technical-whitepaper.pdf)

### Hvem bruker Forward Email {#who-uses-forward-email}

Vi tilbyr e-posthosting og e-postvideresending til 500 000+ domener og disse bemerkelsesverdige brukerne:

| Kunde                                   | Case Study                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                       | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| The University of Cambridge              | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Maryland               | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Washington             | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                         | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Government of South Australia            |                                                                                                          |
| Government of Dominican Republic         |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Hva er Forward Emails historie {#what-is-forward-emails-history}

Du kan lære mer om Forward Email på [vår Om-side](/about).

### Hvor rask er denne tjenesten {#how-fast-is-this-service}

> \[!NOTE]
> Systemet vårt er designet for hastighet og pålitelighet, med flere redundante servere for å sikre at e-postene dine leveres raskt.

Forward Email leverer meldinger med minimal forsinkelse, vanligvis innen sekunder etter mottak.

Ytelsesmålinger:

* **Gjennomsnittlig leveringstid**: Mindre enn 5-10 sekunder fra mottak til videresending ([se vår Time to Inbox "TTI" overvåkingsside](/tti))
* **Oppetid**: 99,9 %+ tjenestetilgjengelighet
* **Global infrastruktur**: Servere strategisk plassert for optimal ruting
* **Automatisk skalering**: Systemet vårt skalerer under perioder med mye e-posttrafikk

Vi opererer i sanntid, i motsetning til andre leverandører som er avhengige av forsinkede køer.

Vi skriver ikke til disk eller lagrer logger – med [unntak av feil](#do-you-store-error-logs) og [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Personvernerklæring](/privacy)).

Alt gjøres i minnet og [vår kildekode er på GitHub](https://github.com/forwardemail).


## E-postklienter {#email-clients}

### Thunderbird {#thunderbird}

1. Opprett et nytt alias og generer et passord i Forward Email-dashbordet ditt
2. Åpne Thunderbird og gå til **Rediger → Kontoinnstillinger → Kontohandlinger → Legg til e-postkonto**
3. Skriv inn navnet ditt, Forward Email-adressen og passordet
4. Klikk **Konfigurer manuelt** og skriv inn:
   * Inngående: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Utgående: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (anbefalt; port 587 med STARTTLS støttes også)
5. Klikk **Ferdig**

### Microsoft Outlook {#microsoft-outlook}

1. Opprett et nytt alias og generer et passord i Forward Email-dashbordet ditt
2. Gå til **Fil → Legg til konto**
3. Skriv inn Forward Email-adressen din og klikk **Koble til**
4. Velg **Avanserte alternativer** og merk av for **La meg sette opp kontoen manuelt**
5. Velg **IMAP** og skriv inn:
   * Inngående: `imap.forwardemail.net`, port 993, SSL
   * Utgående: `smtp.forwardemail.net`, port 465, SSL/TLS (anbefalt; port 587 med STARTTLS støttes også)
   * Brukernavn: Din fullstendige e-postadresse
   * Passord: Ditt genererte passord
6. Klikk **Koble til**

### Apple Mail {#apple-mail}

1. Opprett et nytt alias og generer et passord i Forward Email-dashbordet ditt
2. Gå til **Mail → Valg → Kontoer → +**
3. Velg **Annen e-postkonto**
4. Skriv inn navnet ditt, Forward Email-adressen og passordet
5. For serverinnstillinger, skriv inn:
   * Inngående: `imap.forwardemail.net`
   * Utgående: `smtp.forwardemail.net`
   * Brukernavn: Din fullstendige e-postadresse
   * Passord: Ditt genererte passord
6. Klikk **Logg inn**

### eM Client {#em-client}

1. Opprett et nytt alias og generer et passord i Forward Email-dashbordet ditt
2. Åpne eM Client og gå til **Meny → Kontoer → + Legg til konto**
3. Klikk på **E-post** og velg deretter **Annet**
4. Skriv inn Forward Email-adressen din og klikk **Neste**
5. Skriv inn følgende serverinnstillinger:
   * **Innkommende server**: `imap.forwardemail.net`
   * **Utgående server**: `smtp.forwardemail.net`
6. Skriv inn din fullstendige e-postadresse som **Brukernavn** og ditt genererte passord som **Passord** for både innkommende og utgående servere.
7. eM Client vil teste tilkoblingen. Når den er godkjent, klikker du **Neste**.
8. Skriv inn navnet ditt og velg et kontonavn.
9. Klikk **Fullfør**.

### Mobile enheter {#mobile-devices}

For iOS:

1. Gå til **Innstillinger → Mail → Kontoer → Legg til konto → Annet**
2. Trykk på **Legg til e-postkonto** og skriv inn detaljene dine
3. For serverinnstillinger, bruk de samme IMAP- og SMTP-innstillingene som ovenfor

For Android:

1. Gå til **Innstillinger → Kontoer → Legg til konto → Personlig (IMAP)**
2. Skriv inn Forward Email-adressen og passordet ditt
3. For serverinnstillinger, bruk de samme IMAP- og SMTP-innstillingene som ovenfor

### Sendmail SMTP-relékonfigurasjon {#sendmail-smtp-relay-configuration}

Du kan konfigurere Sendmail til å videresende e-post gjennom Forward Emails SMTP-servere. Dette er en vanlig oppsett for eldre systemer eller applikasjoner som er avhengige av Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 20 minutter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Dette krever en betalt plan med SMTP-tilgang aktivert.
  </span>
</div>

#### Konfigurasjon {#configuration}

1. Rediger `sendmail.mc`-filen din, vanligvis plassert i `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Legg til følgende linjer for å definere smart host og autentisering:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Opprett autentiseringsfilen `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Legg til dine Forward Email-legitimasjoner i `authinfo`-filen:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Generer autentiseringsdatabasen og sikre filene:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Bygg Sendmail-konfigurasjonen på nytt og start tjenesten på nytt:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testing {#testing}

Send en test-e-post for å verifisere konfigurasjonen:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay-konfigurasjon {#exim4-smtp-relay-configuration}

Exim4 er en populær MTA på Debian-baserte systemer. Du kan konfigurere den til å bruke Forward Email som smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 15 minutter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Dette krever en betalt plan med SMTP-tilgang aktivert.
  </span>
</div>

#### Konfigurasjon {#configuration-1}

1. Kjør Exim4-konfigurasjonsverktøyet:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Velg følgende alternativer:
   * **Generell type e-postkonfigurasjon:** e-post sendt via smarthost; mottatt via SMTP eller fetchmail
   * **Systemets e-postnavn:** your.hostname
   * **IP-adresser som skal lytte etter innkommende SMTP-tilkoblinger:** 127.0.0.1 ; ::1
   * **Andre destinasjoner som e-post aksepteres for:** (la stå tomt)
   * **Domener som skal videresende e-post for:** (la stå tomt)
   * **IP-adresse eller vertsnavn til utgående smarthost:** smtp.forwardemail.net::465
   * **Skjule lokalt e-postnavn i utgående e-post?** Nei
   * **Beholde antall DNS-forespørsler minimalt (Dial-on-Demand)?** Nei
   * **Leveringsmetode for lokal e-post:** Mbox-format i /var/mail/
   * **Splitte konfigurasjonen i små filer?** Nei

3. Rediger `passwd.client`-filen for å legge til dine legitimasjoner:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Legg til følgende linje:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Oppdater konfigurasjonen og start Exim4 på nytt:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testing {#testing-1}

Send en test-e-post:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP-klientkonfigurasjon {#msmtp-smtp-client-configuration}

msmtp er en lettvekts SMTP-klient som er nyttig for å sende e-post fra skript eller kommandolinjeapplikasjoner.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 10 minutter</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Dette krever en betalt plan med SMTP-tilgang aktivert.
  </span>
</div>

#### Konfigurasjon {#configuration-2}

1. Opprett eller rediger msmtp-konfigurasjonsfilen på `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Legg til følgende konfigurasjon:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Sett riktige tillatelser for konfigurasjonsfilen:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testing {#testing-2}

Send en test-epost:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Kommandolinje-epostklienter {#command-line-email-clients}

Populære kommandolinje-epostklienter som [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), og [Alpine](https://alpine.x10.mx/alpine/release/) kan konfigureres til å bruke Forward Emails SMTP-servere for å sende e-post. Konfigurasjonen vil være lik `msmtp`-oppsettet, hvor du oppgir SMTP-serverdetaljer og dine legitimasjoner i de respektive konfigurasjonsfilene (`.muttrc`, `.neomuttrc`, eller `.pinerc`).

### Windows e-postkonfigurasjon {#windows-email-configuration}

For Windows-brukere kan du konfigurere populære e-postklienter som **Microsoft Outlook** og **eM Client** ved å bruke IMAP- og SMTP-innstillingene som er oppgitt i din Forward Email-konto. For kommandolinje- eller skriptingbruk kan du bruke PowerShells `Send-MailMessage` cmdlet (selv om den anses som utdatert) eller et lettvekts SMTP-relay-verktøy som [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP-relay-konfigurasjon {#postfix-smtp-relay-configuration}

Du kan konfigurere Postfix til å videresende e-post gjennom Forward Emails SMTP-servere. Dette er nyttig for serverapplikasjoner som trenger å sende e-post.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 15 minutter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Dette krever en betalt plan med SMTP-tilgang aktivert.
  </span>
</div>

#### Installasjon {#installation}

1. Installer Postfix på serveren din:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Under installasjonen, velg "Internet Site" når du blir spurt om konfigurasjonstype.

#### Konfigurasjon {#configuration-3}

1. Rediger hovedkonfigurasjonsfilen for Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Legg til eller endre disse innstillingene:

```
# SMTP relay-konfigurasjon
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Opprett SASL-passordfilen:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Legg til dine Forward Email-legitimasjoner:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Sikre og hashe passordfilen:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Start Postfix på nytt:

```bash
sudo systemctl restart postfix
```

#### Testing {#testing-3}

Test konfigurasjonen ved å sende en test-epost:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Hvordan sende e-post som ved bruk av Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Komme i gang:
  </strong>
  <span>
    Hvis du har fulgt instruksjonene ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og setter opp e-postvideresending</a>, kan du fortsette å lese nedenfor.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Vennligst sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Personvernregler</a>, og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Utgående SMTP-begrensninger</a> &ndash; din bruk anses som bekreftelse og aksept.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du er utvikler, henvises det til våre <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-post API-dokumenter</a>.
  </span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg oppsettsinstruksjonene

2. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

3. Klikk på <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> ved siden av det nylig opprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet sikkert som vist på skjermen.

4. Gå til [Gmail](https://gmail.com) og under [Innstillinger <i class="fa fa-angle-right"></i> Kontoer og import <i class="fa fa-angle-right"></i> Send e-post som](https://mail.google.com/mail/u/0/#settings/accounts), klikk "Legg til en annen e-postadresse"

5. Når du blir bedt om "Navn", skriv inn navnet du ønsker at e-posten din skal vises som "Fra" (f.eks. "Linus Torvalds").

6. Når du blir bedt om "E-postadresse", skriv inn hele e-postadressen til et alias du opprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

7. Fjern merket for "Behandle som et alias"

8. Klikk "Neste trinn" for å fortsette

9. Når du blir bedt om "SMTP-server", skriv inn <code>smtp.forwardemail.net</code> og endre porten til <code>465</code>

10. Når du blir bedt om "Brukernavn", skriv inn hele e-postadressen til et alias du opprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

11. Når du blir bedt om "Passord", lim inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> i trinn 3 ovenfor

12. Velg radioknappen for "Sikret tilkobling med SSL"

13. Klikk "Legg til konto" for å fortsette

14. Åpne en ny fane til [Gmail](https://gmail.com) og vent på at verifiserings-e-posten din skal komme (du vil motta en verifiseringskode som bekrefter at du er eieren av e-postadressen du prøver å "Sende e-post som")

15. Når den kommer, kopier og lim inn verifiseringskoden i prompten du mottok i forrige trinn
16. Når du har gjort det, gå tilbake til e-posten og klikk på lenken for å "bekrefte forespørselen". Du må mest sannsynlig gjøre dette trinnet og det forrige trinnet for at e-posten skal være riktig konfigurert.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle trinnene.
    </span>
  </div>
</div>

</div>

### Hva er den legacy gratis guiden for Send Mail As ved bruk av Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktig:</strong> Denne legacy gratis guiden er utdatert fra og med mai 2023 siden <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">vi nå støtter utgående SMTP</a>. Hvis du bruker guiden nedenfor, vil <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">dette føre til at utgående e-post</a> sier "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" i Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Komme i gang:
  </strong>
  <span>
    Hvis du har fulgt instruksjonene ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan komme i gang og sette opp e-postvideresending</a>, kan du fortsette å lese nedenfor.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Du må ha [Gmails tofaktorautentisering][gmail-2fa] aktivert for at dette skal fungere. Besøk <https://www.google.com/landing/2step/> hvis du ikke har det aktivert.

2. Når tofaktorautentisering er aktivert (eller hvis du allerede hadde det aktivert), besøk <https://myaccount.google.com/apppasswords>.

3. Når du blir bedt om "Velg app og enhet du vil generere app-passord for":
   * Velg "Mail" under nedtrekksmenyen for "Velg app"
   * Velg "Annet" under nedtrekksmenyen for "Velg enhet"
   * Når du blir bedt om tekstinput, skriv inn e-postadressen til ditt egendefinerte domene som du videresender fra (f.eks. <code><hello@example.com></code> - dette hjelper deg å holde oversikt hvis du bruker denne tjenesten for flere kontoer)

4. Kopier passordet som automatisk genereres til utklippstavlen din
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Viktig:
     </strong>
     <span>
       Hvis du bruker G Suite, gå til adminpanelet ditt <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apper <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Innstillinger for Gmail <i class="fa fa-angle-right"></i> Innstillinger</a> og sørg for å krysse av for "Tillat brukere å sende e-post gjennom en ekstern SMTP-server...". Det vil være en forsinkelse før denne endringen aktiveres, så vennligst vent noen minutter.
     </span>
   </div>

5. Gå til [Gmail](https://gmail.com) og under [Innstillinger <i class="fa fa-angle-right"></i> Kontoer og import <i class="fa fa-angle-right"></i> Send e-post som](https://mail.google.com/mail/u/0/#settings/accounts), klikk "Legg til en annen e-postadresse"

6. Når du blir bedt om "Navn", skriv inn navnet du ønsker at e-posten din skal vises som "Fra" (f.eks. "Linus Torvalds")

7. Når du blir bedt om "E-postadresse", skriv inn e-postadressen med det egendefinerte domenet du brukte ovenfor (f.eks. <code><hello@example.com></code>)
8. Fjern merket for "Behandle som et alias"

9. Klikk "Neste trinn" for å fortsette

10. Når du blir bedt om "SMTP-server", skriv inn <code>smtp.gmail.com</code> og la porten stå som <code>587</code>

11. Når du blir bedt om "Brukernavn", skriv inn delen av Gmail-adressen din uten <span>gmail.com</span>-delen (f.eks. bare "bruker" hvis e-posten min er <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Viktig:
      </strong>
      <span>
        Hvis "Brukernavn"-delen fylles ut automatisk, må du <u><strong>endre dette</strong></u> til brukernavnet i Gmail-adressen din i stedet.
      </span>
    </div>

12. Når du blir bedt om "Passord", lim inn passordet du genererte i trinn 2 ovenfor fra utklippstavlen din

13. La radioknappen være merket for "Sikret tilkobling med TLS"

14. Klikk "Legg til konto" for å fortsette

15. Åpne en ny fane til [Gmail](https://gmail.com) og vent på at verifiserings-e-posten skal komme (du vil motta en verifiseringskode som bekrefter at du er eieren av e-postadressen du prøver å "Sende e-post som")

16. Når den kommer, kopier og lim inn verifiseringskoden i prompten du fikk i forrige trinn

17. Når du har gjort det, gå tilbake til e-posten og klikk på lenken for å "bekrefte forespørselen". Du må mest sannsynlig gjøre dette trinnet og det forrige for at e-posten skal bli riktig konfigurert.

</div>

### Avansert Gmail-rutingkonfigurasjon {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>15-30 minutter</span>
</div>

Hvis du vil sette opp avansert ruting i Gmail slik at aliaser som ikke samsvarer med en postkasse videresendes til Forward Emails mailutvekslinger, følg disse trinnene:

1. Logg inn på Google Admin-konsollen din på [admin.google.com](https://admin.google.com)
2. Gå til **Apper → Google Workspace → Gmail → Ruting**
3. Klikk på **Legg til rute** og konfigurer følgende innstillinger:

**Innstillinger for enkeltmottaker:**

* Velg "Endre konvoluttmottaker" og skriv inn din primære Gmail-adresse
* Merk av for "Legg til X-Gm-Original-To-header med opprinnelig mottaker"

**Mønstre for konvoluttmottaker:**

* Legg til et mønster som matcher alle ikke-eksisterende postkasser (f.eks. `.*@dittdomene.com`)

**Innstillinger for e-postserver:**

* Velg "Rute til vert" og skriv inn `mx1.forwardemail.net` som primærserver
* Legg til `mx2.forwardemail.net` som backup-server
* Sett port til 25
* Velg "Krev TLS" for sikkerhet

4. Klikk **Lagre** for å opprette ruten

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Denne konfigurasjonen fungerer kun for Google Workspace-kontoer med egendefinerte domener, ikke for vanlige Gmail-kontoer.
  </span>
</div>

### Avansert Outlook-rutingkonfigurasjon {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>15-30 minutter</span>
</div>

For Microsoft 365 (tidligere Office 365)-brukere som ønsker å sette opp avansert ruting slik at aliaser som ikke samsvarer med en postkasse videresendes til Forward Emails mailutvekslinger:

1. Logg inn på Microsoft 365 administrasjonssenter på [admin.microsoft.com](https://admin.microsoft.com)
2. Gå til **Exchange → E-postflyt → Regler**
3. Klikk **Legg til en regel** og velg **Opprett en ny regel**
4. Gi regelen et navn (f.eks. "Videresend ikke-eksisterende postkasser til Forward Email")
5. Under **Bruk denne regelen hvis**, velg:
   * "Mottakeradressen samsvarer med..."
   * Skriv inn et mønster som matcher alle adresser på domenet ditt (f.eks. `*@dittdomene.com`)
6. Under **Gjør følgende**, velg:
   * "Omdiriger meldingen til..."
   * Velg "Følgende e-postserver"
   * Skriv inn `mx1.forwardemail.net` og port 25
   * Legg til `mx2.forwardemail.net` som backup-server
7. Under **Unntatt hvis**, velg:
   * "Mottakeren er..."
   * Legg til alle eksisterende postkasser som ikke skal videresendes
8. Sett regelprioritet for å sikre at den kjøres etter andre e-postflytregler
9. Klikk **Lagre** for å aktivere regelen
## Feilsøking {#troubleshooting}

### Hvorfor mottar jeg ikke test-e-postene mine {#why-am-i-not-receiving-my-test-emails}

Hvis du sender en test-e-post til deg selv, kan det hende den ikke vises i innboksen din fordi den har samme "Message-ID"-header.

Dette er et velkjent problem, og påvirker også tjenester som Gmail.  <a href="https://support.google.com/a/answer/1703601">Her er den offisielle Gmail-svaret angående dette problemet</a>.

Hvis du fortsatt har problemer, er det mest sannsynlig et problem med DNS-propagasjon. Du må vente litt lenger og prøve igjen (eller prøve å sette en lavere TTL-verdi på dine <strong class="notranslate">TXT</strong>-poster).

**Fortsatt problemer?**  Vennligst <a href="/help">kontakt oss</a> så vi kan hjelpe med å undersøke problemet og finne en rask løsning.

### Hvordan konfigurerer jeg e-postklienten min til å fungere med Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Vår tjeneste fungerer med populære e-postklienter som:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Brukernavnet ditt er aliasets e-postadresse og passordet er fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normal Password").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>Hvis du bruker Thunderbird, må du sørge for at "Connection security" er satt til "SSL/TLS" og at autentiseringsmetoden er satt til "Normal password".</span>
</div>

| Type |         Hostnavn        |         Protokoll        |                                            Porter                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Foretrukket**  |                                      `993` og `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Anbefalt** | `465` og `2465` for SSL/TLS (anbefalt) eller `587`, `2587`, `2525` og `25` for STARTTLS |

### Hvorfor havner e-postene mine i Spam og Søppelpost, og hvordan kan jeg sjekke domenets omdømme {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Denne seksjonen veileder deg hvis utgående e-post bruker våre SMTP-servere (f.eks. `smtp.forwardemail.net`) (eller videresendt via `mx1.forwardemail.net` eller `mx2.forwardemail.net`) og den blir levert i Spam- eller Søppelpost-mappen til mottakere.

Vi overvåker rutinemessig våre [IP-adresser](#what-are-your-servers-ip-addresses) mot [alle anerkjente DNS-denylister](#how-do-you-handle-your-ip-addresses-becoming-blocked), **derfor er det mest sannsynlig et domeneomdømme-spesifikt problem**.

E-poster kan havne i spam-mapper av flere grunner:

1. **Manglende autentisering**: Sett opp [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), og [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-poster.

2. **Domeneomdømme**: Nye domener har ofte nøytralt omdømme inntil de etablerer en sendehistorikk.

3. **Innholdstriggere**: Enkelte ord eller uttrykk kan utløse spamfiltre.

4. **Sendemønstre**: Plutselige økninger i e-postvolum kan virke mistenkelig.

Du kan prøve å bruke ett eller flere av disse verktøyene for å sjekke domenets omdømme og kategorisering:

#### Verktøy for sjekk av omdømme og blokklistinger {#reputation-and-blocklist-check-tools}

| Verktøynavn                                | URL                                                          | Type                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Kategorisering         |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Omdømme                |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Svarteliste            |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Omdømme                |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Omdømme                |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Omdømme                |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Backscatter-beskyttelse |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (krever avgift)               | DNSWL                  |

#### Skjemaer for fjerning av IP-adresse hos leverandør {#ip-removal-request-forms-by-provider}

Hvis IP-adressen din er blitt blokkert av en spesifikk e-postleverandør, bruk det aktuelle fjerningsskjemaet eller kontaktinformasjonen nedenfor:

| Leverandør                             | Fjerningsskjema / Kontakt                                                                                 | Notater                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Kontaktformular for bulk-avsendere           |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Office 365 IP-fjerningsportal                 |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                          | Apple bruker Proofpoint for IP-omdømme        |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                          | Proofpoint IP-sjekk og fjerning               |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Barracuda omdømmesjekk og fjerning            |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                      | Cloudmark CSI tilbakestillingsforespørsel    |
| GoDaddy/SecureServer             | <https://unblock.secureserver.net>                                                                         | GoDaddy IP-opplåsingsskjema                   |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                           | Comcast IP-fjerningsforespørsel               |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Kontakt Spectrum support for fjerning         |
| AT&T                             | `abuse_rbl@abuse-att.net`                                                                                  | E-post for fjerningforespørsel                |
| Cox Communications               | `unblock.request@cox.net`                                                                                  | E-post for fjerningforespørsel                |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                                    | Bruker Cloudfilter                            |
| Windstream                     | `abuse@windstream.net`                                                                                     | E-post for fjerningforespørsel                |
| t-online.de (Tyskland)          | `tobr@rx.t-online.de`                                                                                      | E-post for fjerningforespørsel                |
| Orange France                  | <https://postmaster.orange.fr/>                                                                            | Bruk kontaktskjema eller e-post `abuse@orange.fr` |
| GMX                            | <https://postmaster.gmx.net/en/contact>                                                                    | GMX postmaster kontaktskjema                   |
| Mail.ru                        | <https://postmaster.mail.ru/>                                                                              | Mail.ru postmaster portal                      |
| Yandex                         | <https://postmaster.yandex.ru/>                                                                            | Yandex postmaster portal                       |
| QQ Mail (Tencent)              | <https://open.mail.qq.com/>                                                                                | QQ Mail hviteliste-søknad (kinesisk)          |
| Netease (163.com)              | <https://mail.163.com/postmaster/>                                                                         | Netease postmaster portal                      |
| Alibaba/Aliyun/HiChina         | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Kontakt via Alibaba Cloud-konsoll              |
| Amazon SES                     | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | AWS SES-konsoll > Svartelistefjerning         |
| SendGrid                      | <https://support.sendgrid.com/>                                                                            | Kontakt SendGrid support                       |
| Mimecast                      | <https://community.mimecast.com/>                                                                          | Bruker tredjeparts RBL-er - kontakt spesifikk RBL |
| Fastmail                      | <https://www.fastmail.com/support/>                                                                        | Kontakt Fastmail support                       |
| Zoho                          | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Kontakt Zoho support                           |
| ProtonMail                    | <https://proton.me/support/contact>                                                                        | Kontakt Proton support                         |
| Tutanota                      | <https://tutanota.com/support>                                                                             | Kontakt Tutanota support                       |
| Hushmail                     | <https://www.hushmail.com/support/>                                                                        | Kontakt Hushmail support                       |
| Mailbox.org                  | <https://mailbox.org/en/support>                                                                           | Kontakt Mailbox.org support                    |
| Posteo                       | <https://posteo.de/en/site/contact>                                                                        | Kontakt Posteo support                         |
| DuckDuckGo Email             | <https://duckduckgo.com/email/support>                                                                     | Kontakt DuckDuckGo support                     |
| Sonic.net                    | <https://www.sonic.com/support>                                                                            | Kontakt Sonic support                          |
| Telus                        | <https://www.telus.com/en/support>                                                                         | Kontakt Telus support                          |
| Vodafone Germany             | <https://www.vodafone.de/hilfe/>                                                                           | Kontakt Vodafone support                       |
| Xtra (Spark NZ)              | <https://www.spark.co.nz/help/>                                                                            | Kontakt Spark NZ support                       |
| UOL/BOL (Brasil)             | <https://ajuda.uol.com.br/>                                                                                | Kontakt UOL support (portugisisk)              |
| Libero (Italia)              | <https://aiuto.libero.it/>                                                                                 | Kontakt Libero support (italiensk)             |
| Telenet (Belgia)             | <https://www2.telenet.be/en/support/>                                                                      | Kontakt Telenet support                        |
| Facebook/WhatsApp            | <https://www.facebook.com/business/help>                                                                   | Kontakt Facebook business support              |
| LinkedIn                    | <https://www.linkedin.com/help/linkedin>                                                                   | Kontakt LinkedIn support                       |
| Groups.io                   | <https://groups.io/helpcenter>                                                                             | Kontakt Groups.io support                      |
| Earthlink/Vade Secure       | <https://sendertool.vadesecure.com/en/>                                                                    | Vade Secure sender-verktøy                     |
| Cloudflare Email Security   | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Kontakt Cloudflare support                     |
| Hornetsecurity/Expurgate    | <https://www.hornetsecurity.com/>                                                                          | Kontakt Hornetsecurity support                 |
| SpamExperts/Antispamcloud   | <https://www.spamexperts.com/>                                                                             | Kontakt via hosting-leverandør                 |
| Mail2World                 | <https://www.mail2world.com/support/>                                                                      | Kontakt Mail2World support                     |
> \[!TIP]
> Start med et lavt volum av e-poster av høy kvalitet for å bygge et positivt omdømme før du sender i større volum.

> \[!IMPORTANT]
> Hvis domenet ditt er på en svarteliste, har hver svarteliste sin egen fjerningsprosess. Sjekk deres nettsider for instruksjoner.

> \[!TIP]
> Hvis du trenger ekstra hjelp eller oppdager at vi er feilaktig oppført som spam av en bestemt e-postleverandør, vennligst <a href="/help">kontakt oss</a>.

### Hva bør jeg gjøre hvis jeg mottar spam-e-poster {#what-should-i-do-if-i-receive-spam-emails}

Du bør melde deg av e-postlisten (hvis mulig) og blokkere avsenderen.

Vennligst ikke rapporter meldingen som spam, men videresend den til vårt manuelt kuraterte og personvernfokuserte system for misbruksforebygging.

**E-postadressen for å videresende spam til er:** <abuse@forwardemail.net>

### Hvorfor vises mine test-e-poster sendt til meg selv i Gmail som "mistenkelige" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Hvis du ser denne feilmeldingen i Gmail når du sender en test til deg selv, eller når en person du sender e-post til med aliaset ditt ser en e-post fra deg for første gang, så **vær så snill å ikke bekymre deg** – dette er en innebygd sikkerhetsfunksjon i Gmail.

Du kan enkelt klikke "Ser trygt ut". For eksempel, hvis du sender en testmelding ved å bruke funksjonen send mail as (til en annen), vil de ikke se denne meldingen.

Hvis de derimot ser denne meldingen, er det fordi de vanligvis er vant til å se e-postene dine komme fra <john@gmail.com> i stedet for <john@customdomain.com> (bare et eksempel). Gmail varsler brukerne for å være sikre på at alt er trygt, og det finnes ingen løsning for å omgå dette.

### Kan jeg fjerne via forwardemail dot net i Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dette emnet er relatert til et [velkjent problem i Gmail hvor ekstra informasjon vises ved siden av avsenderens navn](https://support.google.com/mail/answer/1311182).

Fra og med mai 2023 støtter vi sending av e-post med SMTP som et tillegg for alle betalende brukere – noe som betyr at du kan fjerne <span class="notranslate">via forwardemail dot net</span> i Gmail.

Merk at dette FAQ-emnet er spesifikt for de som bruker funksjonen [Hvordan sende e-post som ved bruk av Gmail](#how-to-send-mail-as-using-gmail).

Se seksjonen om [Støtter dere sending av e-post med SMTP](#do-you-support-sending-email-with-smtp) for konfigurasjonsinstruksjoner.


## Databehandling {#data-management}

### Hvor er serverne deres lokalisert {#where-are-your-servers-located}

> \[!TIP]
> Vi kan snart kunngjøre vår EU-datacenters lokasjon som hostes under [forwardemail.eu](https://forwardemail.eu). Abonner på diskusjonen på <https://github.com/orgs/forwardemail/discussions/336> for oppdateringer.

Våre servere er primært lokalisert i Denver, Colorado – se <https://forwardemail.net/ips> for vår komplette liste over IP-adresser.

Du kan lære om våre underleverandører på våre [GDPR](/gdpr), [DPA](/dpa), og [Personvern](/privacy) sider.

### Hvordan eksporterer og sikkerhetskopierer jeg postboksen min {#how-do-i-export-and-backup-my-mailbox}

Når som helst kan du eksportere postboksene dine som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), eller krypterte [SQLite](https://en.wikipedia.org/wiki/SQLite) formater.

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Last ned sikkerhetskopi og velg ønsket eksportformat.

Du vil motta en e-post med en lenke for å laste ned eksporten når den er ferdig.

Merk at denne nedlastingslenken for eksport utløper etter 4 timer av sikkerhetsgrunner.

Hvis du trenger å inspisere dine eksporterte EML- eller Mbox-formater, kan disse open-source verktøyene være nyttige:

| Navn            | Format | Plattform    | GitHub URL                                          |
| --------------- | :----: | ----------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows     | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Alle plattformer | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows     | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode      | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Alle plattformer | <https://github.com/s0ph1e/eml-reader>              |
I tillegg, hvis du trenger å konvertere en Mbox-fil til EML-fil, kan du bruke <https://github.com/noelmartinon/mboxzilla>.

### Hvordan importerer og migrerer jeg min eksisterende postboks {#how-do-i-import-and-migrate-my-existing-mailbox}

Du kan enkelt importere e-posten din til Forward Email (f.eks. ved å bruke [Thunderbird](https://www.thunderbird.net)) med instruksjonene nedenfor:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Du må følge alle de følgende trinnene for å importere din eksisterende e-post.
  </span>
</div>

1. Eksporter e-posten din fra din eksisterende e-postleverandør:

   | E-postleverandør | Eksportformat                                  | Eksportinstruksjoner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tips:</strong> <span>Hvis du bruker Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST eksportformat</a>), kan du ganske enkelt følge instruksjonene under "Annet" nedenfor. Vi har imidlertid lagt ved lenker nedenfor for å konvertere PST til MBOX/EML-format basert på operativsystemet ditt:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba for Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst for Windows cygwin</a> – (f.eks. <code>readpst -u -o $OUT_DIR $IN_DIR</code> der du erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med henholdsvis utdata- og inndatakatalogbaner).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst for Ubuntu/Linux</a> – (f.eks. <code>sudo apt-get install readpst</code> og deretter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, der du erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med henholdsvis utdata- og inndatakatalogbaner).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst for macOS (via brew)</a> – (f.eks. <code>brew install libpst</code> og deretter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, der du erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med henholdsvis utdata- og inndatakatalogbaner).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter for Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Annet          | [Bruk Thunderbird](https://www.thunderbird.net) | Sett opp din eksisterende e-postkonto i Thunderbird og bruk deretter [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) plugin for å eksportere og importere e-posten din.  **Du kan også muligens bare kopiere/lim inn eller dra/slippe e-poster mellom kontoer.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Last ned, installer og åpne [Thunderbird](https://www.thunderbird.net).

3. Opprett en ny konto ved å bruke aliasets fulle e-postadresse (f.eks. <code><you@yourdomain.com></code>) og ditt genererte passord.  <strong>Hvis du ennå ikke har et generert passord, så <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">se våre oppsettsinstruksjoner</a></strong>.

4. Last ned og installer [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-pluginen.

5. Opprett en ny lokal mappe i Thunderbird, og høyreklikk deretter på den → velg `ImportExportTools NG`-alternativet → velg `Import mbox file` (for MBOX eksportformat) – eller – `Import messages` / `Import all messages from a directory` (for EML eksportformat).

6. Dra/slipp fra den lokale mappen til en ny (eller eksisterende) IMAP-mappe i Thunderbird som du ønsker å laste opp meldinger til i IMAP-lagring med vår tjeneste.  Dette sikrer at de blir sikkerhetskopiert online med vår SQLite-krypterte lagring.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>
       Hvis du er usikker på hvordan du importerer til Thunderbird, kan du se offisielle instruksjoner på <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> og <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Når du har fullført eksport- og importprosessen, kan du også ønske å aktivere videresending på din eksisterende e-postkonto og sette opp et autosvar for å varsle avsendere om at du har en ny e-postadresse (f.eks. hvis du tidligere brukte Gmail og nå bruker en e-post med ditt eget domenenavn).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle trinnene.
    </span>
  </div>
</div>

### Hvordan bruker jeg min egen S3-kompatible lagring for sikkerhetskopier {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Betalte brukere kan konfigurere sin egen [S3](https://en.wikipedia.org/wiki/Amazon_S3)-kompatible lagringsleverandør på domenenivå for IMAP/SQLite-sikkerhetskopier.  Dette betyr at dine krypterte postkassesikkerhetskopier kan lagres på din egen infrastruktur i stedet for (eller i tillegg til) vår standardlagring.

Støttede leverandører inkluderer [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces), og andre S3-kompatible tjenester.

#### Oppsett {#setup}

1. Opprett en **privat** bucket hos din S3-kompatible leverandør. Bucketen må ikke være offentlig tilgjengelig.
2. Opprett tilgangslegitimasjon (access key ID og secret access key) med lese-/skrive-tillatelser til bucketen.
3. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Avanserte innstillinger <i class="fa fa-angle-right"></i> Egendefinert S3-kompatibel lagring.
4. Kryss av for **"Aktiver egendefinert S3-kompatibel lagring"** og fyll inn endepunkt-URL, access key ID, secret access key, region og bucket-navn.
5. Klikk **"Test tilkobling"** for å verifisere legitimasjon, bucket-tilgang og skrivetillatelser.
6. Klikk **"Lagre"** for å bruke innstillingene.

#### Hvordan sikkerhetskopier fungerer {#how-backups-work}

Sikkerhetskopier utløses automatisk for hver tilkoblede IMAP-alias. IMAP-serveren sjekker alle aktive tilkoblinger en gang i timen og starter en sikkerhetskopi for hver tilkoblet alias. En Redis-basert lås hindrer at dupliserte sikkerhetskopier kjører innen 30 minutter av hverandre, og den faktiske sikkerhetskopien hoppes over hvis en vellykket sikkerhetskopi allerede er fullført innen de siste 24 timene (med mindre sikkerhetskopien eksplisitt ble forespurt av en bruker for nedlasting).
Sikkerhetskopier kan også utløses manuelt ved å klikke **"Last ned sikkerhetskopi"** for en hvilken som helst alias i dashbordet. Manuelle sikkerhetskopier kjøres alltid uavhengig av 24-timersvinduet.

Sikkerhetskopieringsprosessen fungerer som følger:

1. SQLite-databasen kopieres ved hjelp av `VACUUM INTO`, som lager et konsistent øyeblikksbilde uten å avbryte aktive tilkoblinger og bevarer databasekrypteringen.
2. Sikkerhetskopifilen verifiseres ved å åpne den for å bekrefte at krypteringen fortsatt er gyldig.
3. En SHA-256-hash beregnes og sammenlignes med den eksisterende sikkerhetskopien i lagringen. Hvis hashen stemmer, hoppes opplastingen over (ingen endringer siden siste sikkerhetskopi).
4. Sikkerhetskopien lastes opp til S3 ved hjelp av multipart-opplasting via [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage)-biblioteket.
5. En signert nedlastings-URL (gyldig i 4 timer) genereres og sendes på e-post til brukeren.

#### Backup Formats {#backup-formats}

Tre sikkerhetskopiformater støttes:

| Format   | Extension | Beskrivelse                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Rå kryptert SQLite-databaseøyeblikksbilde (standard for automatiske IMAP-sikkerhetskopier) |
| `mbox`   | `.zip`    | Passordbeskyttet ZIP som inneholder postkasse i mbox-format                 |
| `eml`    | `.zip`    | Passordbeskyttet ZIP som inneholder individuelle `.eml` filer per melding   |

> **Tips:** Hvis du har `.sqlite` sikkerhetskopifiler og ønsker å konvertere dem til `.eml` filer lokalt, bruk vårt frittstående CLI-verktøy **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Det fungerer på Windows, Linux og macOS og krever ikke nettverkstilkobling.

#### File Naming and Key Structure {#file-naming-and-key-structure}

Når du bruker **tilpasset S3-lagring**, lagres sikkerhetskopifiler med et [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)-tidsstempel-prefiks slik at hver sikkerhetskopi bevares som et eget objekt. Dette gir deg full sikkerhetskopihistorikk i din egen bucket.

Nøkkelformatet er:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

For eksempel:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` er MongoDB ObjectId for aliaset. Du finner det på aliasinnstillingssiden eller via API-et.

Når du bruker **standard (system) lagring**, er nøkkelen flat (f.eks. `65a31c53c36b75ed685f3fda.sqlite`) og hver sikkerhetskopi overskriver den forrige.

> **Merk:** Siden tilpasset S3-lagring beholder alle sikkerhetskopiversjoner, vil lagringsbruken øke over tid. Vi anbefaler å konfigurere [livssyklusregler](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) på din bucket for automatisk å slette gamle sikkerhetskopier (f.eks. slette objekter eldre enn 30 eller 90 dager).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Din tilpassede S3-bucket er helt under din kontroll. Vi **sletter eller endrer aldri** filer i din tilpassede S3-bucket — ikke når et alias slettes, ikke når et domene fjernes, og ikke under noen oppryddingsoperasjoner. Vi skriver kun nye sikkerhetskopifiler til din bucket.

Dette betyr:

* **Sletting av alias** — Når du sletter et alias, fjerner vi sikkerhetskopien kun fra vår standard systemlagring. Eventuelle sikkerhetskopier som tidligere er skrevet til din tilpassede S3-bucket forblir urørt.
* **Fjerning av domene** — Fjerning av et domene påvirker ikke filer i din tilpassede bucket.
* **Beholdningshåndtering** — Du er ansvarlig for å administrere lagring i din egen bucket, inkludert å konfigurere livssyklusregler for å slette gamle sikkerhetskopier.

Hvis du deaktiverer tilpasset S3-lagring eller bytter tilbake til vår standardlagring, bevares eksisterende filer i din bucket. Fremtidige sikkerhetskopier vil enkelt bli skrevet til vår standardlagring i stedet.

#### Security {#security}

* Din access key ID og secret access key er **kryptert i ro** ved bruk av [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) før de lagres i vår database. De dekrypteres kun under kjøring når sikkerhetskopieringsoperasjoner utføres.
* Vi validerer automatisk at din bucket **ikke er offentlig tilgjengelig**. Hvis en offentlig bucket oppdages, vil konfigurasjonen bli avvist ved lagring. Hvis offentlig tilgang oppdages ved sikkerhetskopiering, faller vi tilbake til vår standardlagring og varsler alle domenadministratorer via e-post.
* Legitimationsopplysninger valideres ved lagring via et [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html)-kall for å sikre at bucketen eksisterer og at legitimasjonen er korrekt. Hvis valideringen feiler, deaktiveres tilpasset S3-lagring automatisk.
* Hver sikkerhetskopifil inkluderer en SHA-256-hash i sin S3-metadata, som brukes for å oppdage uendrede databaser og hoppe over unødvendige opplastinger.
#### Feilmeldinger {#error-notifications}

Hvis en sikkerhetskopi mislykkes når du bruker din tilpassede S3-lagring (f.eks. på grunn av utløpte legitimasjoner eller et tilkoblingsproblem), vil alle domenadministratorer bli varslet via e-post. Disse varslene er begrenset til én gang hver 6. time for å forhindre dupliserte varsler. Hvis bøtten din oppdages som offentlig tilgjengelig ved sikkerhetskopieringstidspunktet, vil administratorer bli varslet én gang daglig.

#### API {#api}

Du kan også konfigurere tilpasset S3-lagring via API-et:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

For å teste tilkoblingen via API-et:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Hvordan konverterer jeg SQLite-sikkerhetskopier til EML-filer {#how-do-i-convert-sqlite-backups-to-eml-files}

Hvis du laster ned eller lagrer SQLite-sikkerhetskopier (enten fra vår standardlagring eller din egen [tilpassede S3-bøtte](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), kan du konvertere dem til standard `.eml`-filer ved hjelp av vårt frittstående CLI-verktøy **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. EML-filer kan åpnes med hvilken som helst e-postklient ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), osv.) eller importeres til andre e-postservere.

#### Installasjon {#installation-1}

Du kan enten laste ned en forhåndskompilert binærfil (ingen [Node.js](https://github.com/nodejs/node) kreves) eller kjøre den direkte med [Node.js](https://github.com/nodejs/node):

**Forhåndskompilerte binærfiler** — Last ned siste versjon for din plattform fra [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Plattform | Arkitektur   | Fil                                  |
| --------- | ------------ | ----------------------------------- |
| Linux     | x64          | `convert-sqlite-to-eml-linux-x64`    |
| Linux     | arm64        | `convert-sqlite-to-eml-linux-arm64`  |
| macOS     | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64` |
| Windows   | x64          | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS-brukere:** Etter nedlasting kan det hende du må fjerne karantenen før du kjører binærfilen:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Bytt ut `./convert-sqlite-to-eml-darwin-arm64` med den faktiske banen til den nedlastede filen.)

> **Linux-brukere:** Etter nedlasting kan det hende du må gjøre binærfilen kjørbar:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Bytt ut `./convert-sqlite-to-eml-linux-x64` med den faktiske banen til den nedlastede filen.)

**Fra kildekode** (krever [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Bruk {#usage}

Verktøyet støtter både interaktiv og ikke-interaktiv modus.

**Interaktiv modus** — kjør uten argumenter, og du vil bli spurt om alle input:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Konverter SQLite-sikkerhetskopi til EML
  =============================================

  Sti til SQLite-sikkerhetskopifil: /path/to/backup.sqlite
  IMAP/alias-passord: ********
  Utdata ZIP-sti [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Ikke-interaktiv modus** — send argumenter via kommandolinjeflagg for skripting og automatisering:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "ditt-imap-passord" \
  --output /path/to/output.zip
```

| Flagg               | Beskrivelse                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Sti til den krypterte SQLite-sikkerhetskopifilen                             |
| `--password <pass>` | IMAP/alias-passord for dekryptering                                          |
| `--output <path>`   | Utdata-sti for ZIP-filen (standard: automatisk generert med ISO 8601-tidsstempel) |
| `--help`            | Vis hjelpetekst                                                              |
#### Output Format {#output-format}

Verktøyet produserer et passordbeskyttet ZIP-arkiv (AES-256 kryptert) som inneholder:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EML-filer er organisert etter postkassemappe. ZIP-passordet er det samme som ditt IMAP/alias-passord. Hver `.eml`-fil er en standard [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) e-postmelding med fullstendige overskrifter, brødtekst og vedlegg rekonstruert fra SQLite-databasen.

#### How It Works {#how-it-works}

1. Åpner den krypterte SQLite-databasen ved hjelp av ditt IMAP/alias-passord (støtter både [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) og [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) krypteringsalgoritmer).
2. Leser Mailboxes-tabellen for å oppdage mappestrukturen.
3. For hver melding dekoder mimeTree (lagret som [Brotli](https://github.com/google/brotli)-komprimert JSON) fra Messages-tabellen.
4. Rekonstruerer full EML ved å gå gjennom MIME-treet og hente vedleggsinnhold fra Attachments-tabellen.
5. Pakker alt inn i et passordbeskyttet ZIP-arkiv ved bruk av [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Do you support self-hosting {#do-you-support-self-hosting}

Ja, fra og med mars 2025 støtter vi en selvhostet løsning. Les bloggen [her](https://forwardemail.net/blog/docs/self-hosted-solution). Sjekk ut [selvhostet guide](https://forwardemail.net/self-hosted) for å komme i gang. Og for de som er interessert i en mer detaljert steg-for-steg versjon, se våre [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserte guider.


## Email Configuration {#email-configuration}

### How do I get started and set up email forwarding {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Estimert oppsettstid:</strong>
  <span>Under 10 minutter</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Komme i gang:
  </strong>
  <span>
    Les nøye og følg trinn én til åtte listet nedenfor. Sørg for å erstatte e-postadressen <code>user@gmail.com</code> med e-postadressen du ønsker å videresende e-post til (hvis den ikke allerede er korrekt). På samme måte må du erstatte <code>example.com</code> med ditt egendefinerte domenenavn (hvis det ikke allerede er korrekt).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Hvis du allerede har registrert domenenavnet ditt et sted, må du hoppe helt over dette trinnet og gå til trinn to! Ellers kan du <a href="/domain-registration" rel="noopener noreferrer">klikke her for å registrere domenenavnet ditt</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Husker du hvor du registrerte domenet ditt? Når du husker dette, følg instruksjonene nedenfor:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Du må åpne en ny fane og logge inn hos din domeneregistrar. Du kan enkelt klikke på din "Registrar" nedenfor for å gjøre dette automatisk. I denne nye fanen må du navigere til DNS-administrasjonssiden hos registrar &ndash; og vi har gitt trinnvise navigasjonsinstruksjoner under kolonnen "Steps to Configure". Når du har navigert til denne siden i den nye fanen, kan du gå tilbake til denne fanen og fortsette til trinn tre nedenfor.
    <strong class="font-weight-bold">Ikke lukk den åpne fanen ennå; du vil trenge den for fremtidige trinn!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Steps to Configure</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Rediger DNS-innstillinger</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Velg ditt domene)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Mine servere <i class="fa fa-angle-right"></i> Domenestyring <i class="fa fa-angle-right"></i> DNS-administrator</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FOR ROCK: Logg inn <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> (Klikk på ▼-ikonet ved siden av administrer) <i class="fa fa-angle-right"></i> DNS
      <br />
      FOR LEGACY: Logg inn <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> Soneeditor <i class="fa fa-angle-right"></i> (Velg ditt domene)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Velg ditt domene)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> (Velg ditt domene)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Administrer</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Nettverk <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Mer <i class="fa fa-angle-right"></i> Administrer domene</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> I kortvisning, klikk administrer på ditt domene <i class="fa fa-angle-right"></i> I listevisning, klikk
tannhjulikonet <i class="fa fa-angle-right"></i> DNS & Navneservere <i class="fa fa-angle-right"></i> DNS-poster</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Logg inn <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> (klikk tannhjulikon) <i class="fa fa-angle-right"></i> Klikk på DNS &amp; Navneservere i venstremenyen</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> Administrer domener <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Oversikt <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Enkel redigerer <i class="fa fa-angle-right"></i> Poster</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Administrasjon <i class="fa fa-angle-right"></i> Rediger sonen</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Administrer mine domener <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Administrer DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Logg inn <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Konfigurer DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Domeneliste <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Avansert DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Sett opp Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Kontoadministrator <i class="fa fa-angle-right"></i> Mine domenenavn <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Endre hvor domenet peker <i class="fa fa-angle-right"></i> Avansert DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Administrerte domener <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> DNS-innstillinger</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Hjem-meny <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i>
Avanserte innstillinger <i class="fa fa-angle-right"></i> Egne poster</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Bruker "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Domener-side <i class="fa fa-angle-right"></i> (Velg ditt domene) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Domener-side <i class="fa fa-angle-right"></i> (Klikk på <i class="fa fa-ellipsis-h"></i>-ikonet) <i class="fa fa-angle-right"></i> Velg Administrer DNS-poster</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Logg inn <i class="fa fa-angle-right"></i> Domener <i class="fa fa-angle-right"></i> Mine domener</td>
    </tr>
    <tr>
      <td>Andre</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Viktig:</strong> Ser du ikke navnet på din registrar her? Søk enkelt på Internett etter "hvordan endre DNS-poster på $REGISTRAR" (erstatt $REGISTRAR med navnet på din registrar &ndash; f.eks. "hvordan endre DNS-poster på GoDaddy" hvis du bruker GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Bruk registrarens DNS-administrasjonsside (den andre fanen du har åpnet) til å sette følgende "MX"-poster:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Merk at det ikke skal være noen andre MX-poster satt. Begge postene vist nedenfor MÅ eksistere. Sørg for at det ikke er noen skrivefeil; og at du har både mx1 og mx2 stavet riktig. Hvis det allerede fantes MX-poster, vennligst slett dem helt.
    "TTL"-verdien trenger ikke å være 3600, den kan være lavere eller høyere om nødvendig.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Prioritet</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Bruk registratorens DNS-administrasjonsside (den andre fanen du har åpnet), og sett følgende <strong class="notranslate">TXT</strong>-post(er):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du er på en betalt plan, må du hoppe helt over dette steget og gå til steg fem! Hvis du ikke er på en betalt plan, vil dine videresendte adresser være offentlig søkbare – gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> og oppgrader domenet ditt til en betalt plan om ønskelig. Hvis du vil lære mer om betalte planer, se vår <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Priser</a>-side. Ellers kan du fortsette å velge en eller flere kombinasjoner fra Alternativ A til Alternativ F listet nedenfor.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ A:
  </strong>
  <span>
    Hvis du videresender alle e-poster fra ditt domene, (f.eks. "all@example.com", "hello@example.com", osv.) til en spesifikk adresse "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Pass på å erstatte verdiene ovenfor i "Verdi"-kolonnen med din egen e-postadresse. "TTL"-verdien trenger ikke å være 3600, den kan være lavere eller høyere om nødvendig. En lavere "time to live" ("TTL")-verdi vil sikre at eventuelle fremtidige endringer i DNS-postene dine blir propagert raskere på Internett – tenk på dette som hvor lenge det vil bli bufret i minnet (i sekunder). Du kan lære mer om <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL på Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ B:
  </strong>
  <span>
    Hvis du bare trenger å videresende en enkelt e-postadresse (f.eks. <code>hello@example.com</code> til <code>user@gmail.com</code>; dette vil også automatisk videresende "hello+test@example.com" til "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ C:
  </strong>
  <span>
    Hvis du videresender flere e-poster, må du skille dem med komma:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ D:
  </strong>
  <span>
    Du kan sette opp et uendelig antall videresendingsadresser – bare sørg for at du ikke overskrider 255 tegn på en enkelt linje, og start hver linje med "forward-email=". Et eksempel er gitt nedenfor:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ E:
  </strong>
  <span>
    Du kan også spesifisere et domenenavn i din <strong class="notranslate">TXT</strong>-post for å ha global alias-videresending (f.eks. "user@example.com" vil bli videresendt til "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ F:
  </strong>
  <span>
    Du kan til og med bruke webhooks som en global eller individuell alias for å videresende e-poster til. Se eksemplet og hele seksjonen om webhooks med tittelen <a href="#do-you-support-webhooks" class="alert-link">Støtter dere webhooks</a> nedenfor.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Alternativ G:
  </strong>
  <span>
    Du kan til og med bruke regulære uttrykk ("regex") for å matche aliaser og for å håndtere substitusjoner for å videresende e-poster til. Se eksemplene og hele seksjonen om regex med tittelen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Støtter dere regulære uttrykk eller regex</a> nedenfor.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Trenger du avansert regex med substitusjon?</strong> Se eksemplene og hele seksjonen om regex med tittelen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Støtter dere regulære uttrykk eller regex</a> nedenfor.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Enkelt eksempel:</strong> Hvis jeg vil at alle e-poster som går til `linus@example.com` eller `torvalds@example.com` skal videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Fang-alle videresendingsregler kan også beskrives som "fall-through".
    Dette betyr at innkommende e-poster som matcher minst én spesifikk videresendingsregel vil bli brukt i stedet for fang-alle.
    Spesifikke regler inkluderer e-postadresser og regulære uttrykk.
    <br /><br />
    For eksempel:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-poster sendt til <code>hello@example.com</code> vil **ikke** bli videresendt til <code>second@gmail.com</code> (fang-alle) med denne konfigurasjonen, og vil i stedet kun bli levert til <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Bruk registratorens DNS-administrasjonsside (den andre fanen du har åpnet), og sett i tillegg følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du bruker Gmail (f.eks. Send Mail As) eller G Suite, må du legge til <code>include:_spf.google.com</code> til verdien ovenfor, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Hvis du allerede har en lignende linje med "v=spf1", må du legge til <code>include:spf.forwardemail.net</code> rett før eventuelle eksisterende "include:host.com"-poster og før "-all" på samme linje, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Merk at det er forskjell på "-all" og "~all". "-" indikerer at SPF-sjekken skal FEILE hvis den ikke matcher, og "~" indikerer at SPF-sjekken skal SOFTFAIL. Vi anbefaler å bruke "-all" for å forhindre domeneforfalskning.
    <br /><br />
    Du må kanskje også inkludere SPF-posten for hvilken som helst vert du sender e-post fra (f.eks. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Bekreft DNS-postene dine ved å bruke vårt verktøy "Verify Records" tilgjengelig på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Oppsett.

</li><li class="mb-2 mb-md-3 mb-lg-5">Send en test-e-post for å bekrefte at det fungerer. Merk at det kan ta litt tid før DNS-postene dine har propagert.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
  </span>
    Hvis du ikke mottar test-e-poster, eller mottar en test-e-post som sier "Vær forsiktig med denne meldingen", se svarene for <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Hvorfor mottar jeg ikke test-e-postene mine</a> og <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Hvorfor vises test-e-postene mine sendt til meg selv i Gmail som "mistenkelige"</a> henholdsvis.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Hvis du ønsker å "Send Mail As" fra Gmail, må du <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">se denne videoen</a></strong>, eller følge trinnene under <a href="#how-to-send-mail-as-using-gmail">Hvordan sende e-post som ved bruk av Gmail</a> nedenfor.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle trinnene.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Valgfrie tillegg er listet nedenfor. Merk at disse tilleggene er helt valgfrie og kanskje ikke er nødvendige. Vi ønsket i det minste å gi deg ekstra informasjon om nødvendig.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Valgfritt tillegg:
  </strong>
  <span>
    Hvis du bruker funksjonen <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Hvordan sende e-post som ved bruk av Gmail</a>, kan det være lurt å legge deg selv til en tillatelsesliste. Se <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">disse instruksjonene fra Gmail</a> om dette emnet.
  </span>
</div>

### Kan jeg bruke flere MX-utvekslinger og servere for avansert videresending {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, men **du bør bare ha én MX-utveksling oppført i DNS-postene dine**.

Ikke prøv å bruke "Prioritet" som en måte å konfigurere flere MX-utvekslinger på.

I stedet må du konfigurere din eksisterende MX-utveksling til å videresende e-post for alle ikke-matchende aliaser til tjenestens utvekslinger (`mx1.forwardemail.net` og/eller `mx2.forwardemail.net`).

Hvis du bruker Google Workspace og ønsker å videresende alle ikke-matchende aliaser til tjenesten vår, se <https://support.google.com/a/answer/6297084>.

Hvis du bruker Microsoft 365 (Outlook) og ønsker å videresende alle ikke-matchende aliaser til tjenesten vår, se <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> og <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hvordan setter jeg opp en feriesvar (automatisk fraværsmelding) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias og opprett eller rediger aliaset du ønsker å konfigurere en feriesvar for.
Du har muligheten til å konfigurere startdato, sluttdato, emne og melding, og aktivere eller deaktivere det når som helst:

* Ren tekst for emne og melding støttes for øyeblikket (vi bruker `striptags`-pakken internt for å fjerne eventuell HTML).
* Emnet er begrenset til 100 tegn.
* Meldingen er begrenset til 1000 tegn.
* Oppsett krever utgående SMTP-konfigurasjon (f.eks. må du sette opp DKIM, DMARC og Return-Path DNS-poster).
  * Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg oppsettsinstruksjonene.
* Ferieautomat svar kan ikke aktiveres på globale vanity-domener (f.eks. støttes ikke [engangsadresser](/disposable-addresses)).
* Ferieautomat svar kan ikke aktiveres for aliaser med jokertegn/catch-all (`*`) eller regulære uttrykk.

I motsetning til e-postsystemer som `postfix` (f.eks. som bruker `sieve` feriefilterutvidelsen) – legger Forward Email automatisk til din DKIM-signatur, sikrer mot tilkoblingsproblemer ved sending av ferieautomat svar (f.eks. på grunn av vanlige SSL/TLS-tilkoblingsproblemer og eldre vedlikeholdte servere), og støtter til og med Open WKD og PGP-kryptering for ferieautomat svar.

<!--
* For å forhindre misbruk, trekkes 1 utgående SMTP-kreditt for hver sendte ferieautomat svar-melding.
  * Alle betalte kontoer inkluderer som standard 300 kreditter per dag. Hvis du trenger et større antall, vennligst kontakt oss.
-->

1. Vi sender kun én gang per [tillatt liste](#do-you-have-an-allowlist) avsender hver 4. dag (noe som ligner på Gmail sin oppførsel).

   * Vår Redis-cache bruker et fingeravtrykk av `alias_id` og `sender`, hvor `alias_id` er aliasets MongoDB-ID og `sender` enten er Fra-adressen (hvis tillatt) eller rot-domenet i Fra-adressen (hvis ikke tillatt). For enkelhets skyld er utløpstiden for dette fingeravtrykket i cachen satt til 4 dager.

   * Vår tilnærming med å bruke rot-domenet analysert fra Fra-adressen for ikke-tillatte avsendere forhindrer misbruk fra relativt ukjente avsendere (f.eks. ondsinnede aktører) som oversvømmer ferieautomat svar-meldinger.

2. Vi sender kun når MAIL FROM og/eller Fra ikke er tom og ikke inneholder (case-insensitivt) et [postmester-brukernavn](#what-are-postmaster-addresses) (delen før @ i en e-post).

3. Vi sender ikke hvis den opprinnelige meldingen hadde noen av følgende overskrifter (case-insensitivt):

   * Overskrift `auto-submitted` med en verdi ulik `no`.
   * Overskrift `x-auto-response-suppress` med verdi `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`.
   * Overskrift `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (uansett verdi).
   * Overskrift `precedence` med verdi `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

4. Vi sender ikke hvis MAIL FROM eller Fra e-postadresse slutter med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

5. Vi sender ikke hvis brukerdelen av Fra e-postadresse var `mdaemon` og den hadde en case-insensitiv overskrift `X-MDDSN-Message`.

6. Vi sender ikke hvis det var en case-insensitiv `content-type`-overskrift med verdi `multipart/report`.

### Hvordan setter jeg opp SPF for Forward Email {#how-do-i-set-up-spf-for-forward-email}

Bruk registrarens DNS-administrasjonsside og sett følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du bruker Gmail (f.eks. Send Mail As) eller G Suite, må du legge til <code>include:_spf.google.com</code> til verdien ovenfor, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du bruker Microsoft Outlook eller Live.com, må du legge til <code>include:spf.protection.outlook.com</code> i din SPF <strong class="notranslate">TXT</strong>-post, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Hvis du allerede har en lignende linje med "v=spf1", må du legge til <code>include:spf.forwardemail.net</code> rett før eventuelle eksisterende "include:host.com"-poster og før "-all" på samme linje, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Merk at det er forskjell på "-all" og "~all". "-" indikerer at SPF-sjekken skal FEILE hvis den ikke stemmer, og "~" indikerer at SPF-sjekken skal SOFTFAIL. Vi anbefaler å bruke "-all"-tilnærmingen for å forhindre domeneforfalskning.
    <br /><br />
    Du må kanskje også inkludere SPF-posten for den verten du sender e-post fra (f.eks. Outlook).
  </span>
</div>

### Hvordan setter jeg opp DKIM for Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg oppsettsinstruksjonene.

### Hvordan setter jeg opp DMARC for Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon og følg oppsettsinstruksjonene.

### Hvordan ser jeg DMARC-rapporter {#how-do-i-view-dmarc-reports}

Forward Email tilbyr et omfattende DMARC-rapporteringsdashbord som lar deg overvåke e-postautentiseringsytelsen på tvers av alle dine domener fra ett enkelt grensesnitt.

**Hva er DMARC-rapporter?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) rapporter er XML-filer sendt av mottakende e-postservere som forteller deg hvordan e-postene dine blir autentisert. Disse rapportene hjelper deg å forstå:

* Hvor mange e-poster som sendes fra domenet ditt
* Om disse e-postene passerer SPF- og DKIM-autentisering
* Hvilke tiltak mottakende servere tar (aksepterer, karantenerer eller avviser)
* Hvilke IP-adresser som sender e-post på vegne av domenet ditt

**Hvordan få tilgang til DMARC-rapporter**

Gå til <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> DMARC-rapporter</a> for å se dashbordet ditt. Du kan også få tilgang til domene-spesifikke rapporter fra <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> ved å klikke på "DMARC"-knappen ved siden av et hvilket som helst domene.

**Dashbordfunksjoner**

DMARC-rapporteringsdashbordet tilbyr:

* **Oppsummeringsmålinger**: Totalt mottatte rapporter, totalt analyserte meldinger, SPF-justeringsrate, DKIM-justeringsrate og total bestått-rate
* **Meldinger over tid-diagram**: Visuell trend av e-postvolum og autentiseringsrater de siste 30 dagene
* **Justering-oppsummering**: Donut-diagram som viser fordeling av SPF vs DKIM-justering
* **Meldingens behandling**: Stablet stolpediagram som viser hvordan mottakende servere håndterte e-postene dine (akseptert, karantenerte eller avvist)
* **Tabell over nylige rapporter**: Detaljert liste over individuelle DMARC-rapporter med filtrering og paginering
* **Domene-filtrering**: Filtrer rapporter etter spesifikt domene når du administrerer flere domener
**Hvorfor dette er viktig**

For organisasjoner som administrerer flere domener (som bedrifter, ideelle organisasjoner eller byråer), er DMARC-rapporter essensielle for:

* **Å identifisere uautoriserte avsendere**: Oppdage om noen forfalsker domenet ditt
* **Å forbedre leveringsdyktighet**: Sikre at dine legitime e-poster passerer autentisering
* **Å overvåke e-postinfrastrukturen**: Spore hvilke tjenester og IP-adresser som sender på dine vegne
* **Samsvar**: Opprettholde synlighet i e-postautentisering for sikkerhetsrevisjoner

I motsetning til andre tjenester som krever separate DMARC-overvåkingsverktøy, inkluderer Forward Email DMARC-rapportbehandling og visualisering som en del av kontoen din uten ekstra kostnad.

**Krav**

* DMARC-rapporter er kun tilgjengelig for betalte planer
* Domenet ditt må ha DMARC konfigurert (se [Hvordan setter jeg opp DMARC for Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Rapporter samles automatisk inn når mottakende e-postservere sender dem til din konfigurerte DMARC-rapporteringsadresse

**Ukentlige e-postrapporter**

Brukere med betalt plan mottar automatisk ukentlige DMARC-rapportoppsummeringer via e-post. Disse e-postene inkluderer:

* Oppsummeringsstatistikk for alle dine domener
* SPF- og DKIM-justeringsrater
* Fordeling av meldingsdisposisjon (akseptert, karantene, avvist)
* Topp rapporterende organisasjoner (Google, Microsoft, Yahoo, osv.)
* IP-adresser med justeringsproblemer som kan trenge oppmerksomhet
* Direkte lenker til ditt DMARC-rapporteringsdashbord

Ukentlige rapporter sendes automatisk og kan ikke deaktiveres separat fra andre e-postvarsler.

### Hvordan kobler jeg til og konfigurerer kontaktene mine {#how-do-i-connect-and-configure-my-contacts}

**For å konfigurere kontaktene dine, bruk CardDAV-URL-en:** `https://carddav.forwardemail.net` (eller bare `carddav.forwardemail.net` hvis klienten din tillater det)

### Hvordan kobler jeg til og konfigurerer kalenderne mine {#how-do-i-connect-and-configure-my-calendars}

**For å konfigurere kalenderen din, bruk CalDAV-URL-en:** `https://caldav.forwardemail.net` (eller bare `caldav.forwardemail.net` hvis klienten din tillater det)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Hvordan legger jeg til flere kalendere og administrerer eksisterende kalendere {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Hvis du ønsker å legge til flere kalendere, legg bare til en ny kalender-URL: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**pass på å erstatte `calendar-name` med ønsket kalendernavn**)

Du kan endre kalenderens navn og farge etter opprettelse – bruk bare din foretrukne kalenderapplikasjon (f.eks. Apple Mail eller [Thunderbird](https://thunderbird.net)).

### Hvordan kobler jeg til og konfigurerer oppgaver og påminnelser {#how-do-i-connect-and-configure-tasks-and-reminders}

**For å konfigurere oppgaver og påminnelser, bruk samme CalDAV-URL som for kalendere:** `https://caldav.forwardemail.net` (eller bare `caldav.forwardemail.net` hvis klienten din tillater det)

Oppgaver og påminnelser vil automatisk bli separert fra kalenderhendelser i sin egen "Påminnelser" eller "Oppgaver" kalenderkolleksjon.

**Oppsettsinstruksjoner etter plattform:**

**macOS/iOS:**

1. Legg til en ny CalDAV-konto i Systemvalg > Internett-kontoer (eller Innstillinger > Kontoer på iOS)
2. Bruk `caldav.forwardemail.net` som server
3. Skriv inn ditt Forward Email-alias og genererte passord
4. Etter oppsett vil du se både "Kalender" og "Påminnelser"-kolleksjoner
5. Bruk Påminnelser-appen for å opprette og administrere oppgaver

**Android med Tasks.org:**

1. Installer Tasks.org fra Google Play Store eller F-Droid
2. Gå til Innstillinger > Synkronisering > Legg til konto > CalDAV
3. Skriv inn server: `https://caldav.forwardemail.net`
4. Skriv inn ditt Forward Email-alias og genererte passord
5. Tasks.org vil automatisk oppdage dine oppgavekalendere

**Thunderbird:**

1. Installer Lightning-tillegget hvis det ikke allerede er installert
2. Opprett en ny kalender med typen "CalDAV"
3. Bruk URL: `https://caldav.forwardemail.net`
4. Skriv inn dine Forward Email-legitimasjoner
5. Både hendelser og oppgaver vil være tilgjengelige i kalendergrensesnittet

### Hvorfor kan jeg ikke opprette oppgaver i macOS Påminnelser {#why-cant-i-create-tasks-in-macos-reminders}
Hvis du har problemer med å opprette oppgaver i macOS Påminnelser, prøv disse feilsøkingstrinnene:

1. **Sjekk kontoinnstillinger**: Sørg for at CalDAV-kontoen din er riktig konfigurert med `caldav.forwardemail.net`

2. **Bekreft separate kalendere**: Du bør se både "Kalender" og "Påminnelser" i kontoen din. Hvis du bare ser "Kalender", kan det hende at oppgavestøtten ikke er fullstendig aktivert ennå.

3. **Oppdater konto**: Prøv å fjerne og legge til CalDAV-kontoen din på nytt i Systemvalg > Internett-kontoer

4. **Sjekk servertilkobling**: Test at du kan få tilgang til `https://caldav.forwardemail.net` i nettleseren din

5. **Bekreft legitimasjon**: Sørg for at du bruker riktig alias-epost og generert passord (ikke kontopassordet ditt)

6. **Tving synkronisering**: I Påminnelser-appen, prøv å opprette en oppgave og deretter manuelt oppdatere synkroniseringen

**Vanlige problemer:**

* **"Påminnelseskalender ikke funnet"**: Serveren kan trenge et øyeblikk for å opprette Påminnelser-samlingen ved første tilgang
* **Oppgaver synkroniseres ikke**: Sjekk at begge enhetene bruker samme CalDAV-kontolegitimasjon
* **Blandet innhold**: Sørg for at oppgaver opprettes i "Påminnelser"-kalenderen, ikke i den generelle "Kalender"

### Hvordan setter jeg opp Tasks.org på Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org er en populær åpen kildekode oppgavebehandler som fungerer utmerket med Forward Emails CalDAV-oppgavestøtte.

**Installasjon og oppsett:**

1. **Installer Tasks.org**:
   * Fra Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Fra F-Droid: [Tasks.org på F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Konfigurer CalDAV-synkronisering**:
   * Åpne Tasks.org
   * Gå til ☰ Meny > Innstillinger > Synkronisering
   * Trykk "Legg til konto"
   * Velg "CalDAV"

3. **Skriv inn Forward Email-innstillinger**:
   * **Server-URL**: `https://caldav.forwardemail.net`
   * **Brukernavn**: Ditt Forward Email-alias (f.eks. `du@dittdomene.com`)
   * **Passord**: Ditt alias-spesifikke genererte passord
   * Trykk "Legg til konto"

4. **Kontofunn**:
   * Tasks.org vil automatisk finne oppgavekalenderne dine
   * Du bør se "Påminnelser"-samlingen dukke opp
   * Trykk "Abonner" for å aktivere synk for oppgavekalenderen

5. **Test synk**:
   * Opprett en testoppgave i Tasks.org
   * Sjekk at den vises i andre CalDAV-klienter (som macOS Påminnelser)
   * Bekreft at endringer synkroniseres begge veier

**Tilgjengelige funksjoner:**

* ✅ Opprettelse og redigering av oppgaver
* ✅ Forfallsdatoer og påminnelser
* ✅ Fullføring og status for oppgaver
* ✅ Prioritetsnivåer
* ✅ Underoppgaver og oppgavehierarki
* ✅ Merker og kategorier
* ✅ To-veis synk med andre CalDAV-klienter

**Feilsøking:**

* Hvis ingen oppgavekalendere vises, prøv å oppdatere manuelt i Tasks.org-innstillinger
* Sørg for at du har minst én oppgave opprettet på serveren (du kan opprette en i macOS Påminnelser først)
* Sjekk nettverkstilkobling til `caldav.forwardemail.net`

### Hvordan setter jeg opp SRS for Forward Email {#how-do-i-set-up-srs-for-forward-email}

Vi konfigurerer automatisk [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – du trenger ikke å gjøre dette selv.

### Hvordan setter jeg opp MTA-STS for Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Vennligst se [vår seksjon om MTA-STS](#do-you-support-mta-sts) for mer informasjon.

### Hvordan legger jeg til et profilbilde til e-postadressen min {#how-do-i-add-a-profile-picture-to-my-email-address}

Hvis du bruker Gmail, følg disse trinnene nedenfor:

1. Gå til <https://google.com> og logg ut av alle e-postkontoer
2. Klikk "Logg inn" og i rullegardinmenyen klikk på "annen konto"
3. Velg "Bruk en annen konto"
4. Velg "Opprett konto"
5. Velg "Bruk min nåværende e-postadresse i stedet"
6. Skriv inn e-postadressen med ditt egendefinerte domenenavn
7. Hent verifiserings-e-posten som er sendt til e-postadressen din
8. Skriv inn verifiseringskoden fra denne e-posten
9. Fullfør profilinformasjonen for din nye Google-konto
10. Godta alle personvern- og bruksvilkår
11. Gå til <https://google.com> og øverst til høyre, klikk på profilikonet ditt, og klikk på "endre"-knappen
12. Last opp et nytt bilde eller avatar for kontoen din
13. Endringene vil ta omtrent 1-2 timer å tre i kraft, men kan noen ganger gå veldig raskt.
14. Send en test-epost og profilbildet skal vises.
## Avanserte funksjoner {#advanced-features}

### Støtter dere nyhetsbrev eller e-postlister for markedsføringsrelatert e-post {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, du kan lese mer på <https://forwardemail.net/guides/newsletter-with-listmonk>.

Vennligst merk at for å opprettholde IP-omdømme og sikre leveringsdyktighet, har Forward Email en manuell gjennomgangsprosess per domene for **godkjenning av nyhetsbrev**. Send e-post til <support@forwardemail.net> eller åpne en [hjelpeforespørsel](https://forwardemail.net/help) for godkjenning. Dette tar vanligvis mindre enn 24 timer, med de fleste forespørsler behandlet innen 1-2 timer. I nær fremtid har vi som mål å gjøre denne prosessen umiddelbar med ekstra spamkontroller og varsling. Denne prosessen sikrer at e-postene dine når innboksen og at meldingene dine ikke blir merket som spam.

### Støtter dere sending av e-post med API {#do-you-support-sending-email-with-api}

Ja, fra og med mai 2023 støtter vi sending av e-post med API som et tillegg for alle betalende brukere.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Vennligst sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Personvernregler</a>, og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Utgående SMTP-begrensninger</a> &ndash; din bruk anses som bekreftelse og aksept.
  </span>
</div>

Se vår seksjon om [E-poster](/email-api#outbound-emails) i vår API-dokumentasjon for alternativer, eksempler og mer innsikt.

For å sende utgående e-post med vår API må du bruke din API-token som er tilgjengelig under [Min sikkerhet](/my-account/security).

### Støtter dere mottak av e-post med IMAP {#do-you-support-receiving-email-with-imap}

Ja, fra 16. oktober 2023 støtter vi mottak av e-post over IMAP som et tillegg for alle betalende brukere.  **Vennligst les vår grundige artikkel** om [hvordan vår krypterte SQLite-postkassefunksjon fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Vennligst sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">Vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">Personvernregler</a> &ndash; din bruk anses som bekreftelse og aksept.
  </span>
</div>

1. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias (f.eks. <code><hello@example.com></code>)

2. Klikk på <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> ved siden av det nylig opprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet sikkert som vist på skjermen.

3. Bruk din foretrukne e-postapplikasjon, legg til eller konfigurer en konto med ditt nylig opprettede alias (f.eks. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Vi anbefaler å bruke <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, eller <a href="/blog/open-source" class="alert-link" target="_blank">et åpen kildekode- og personvernfokusert alternativ</a>.</span>
   </div>

4. Når du blir bedt om IMAP-servernavn, skriv inn `imap.forwardemail.net`

5. Når du blir bedt om IMAP-serverport, skriv inn `993` (SSL/TLS) – se [alternative IMAP-porter](/faq#what-are-your-imap-server-configuration-settings) om nødvendig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Hvis du bruker Thunderbird, må du sørge for at "Tilkoblingssikkerhet" er satt til "SSL/TLS" og at autentiseringsmetoden er satt til "Vanlig passord".</span>
   </div>
6. Når du blir bedt om IMAP-serverpassord, lim inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i trinn 2 ovenfor

7. **Lagre innstillingene dine** – hvis du har problemer, vennligst <a href="/help">kontakt oss</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle trinnene.
    </span>
  </div>
</div>

</div>

### Støtter dere POP3 {#do-you-support-pop3}

Ja, fra og med 4. desember 2023 støtter vi [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) som et tillegg for alle betalende brukere.  **Vennligst les vår grundige artikkel** om [hvordan vår krypterte SQLite-postkassefunksjon fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Vennligst sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">Vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">Personvernregler</a> &ndash; din bruk anses som bekreftelse og aksept.
  </span>
</div>

1. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias (f.eks. <code><hello@example.com></code>)

2. Klikk på <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ved siden av det nylig opprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet sikkert som vist på skjermen.

3. Bruk din foretrukne e-postapplikasjon, legg til eller konfigurer en konto med ditt nylig opprettede alias (f.eks. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Vi anbefaler å bruke <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, eller <a href="/blog/open-source" class="alert-link" target="_blank">et åpen kildekode- og personvernfokusert alternativ</a>.</span>
   </div>

4. Når du blir bedt om POP3-servernavn, skriv inn `pop3.forwardemail.net`

5. Når du blir bedt om POP3-serverport, skriv inn `995` (SSL/TLS) – se [alternative POP3-porter](/faq#what-are-your-pop3-server-configuration-settings) om nødvendig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Hvis du bruker Thunderbird, må du sørge for at "Connection security" er satt til "SSL/TLS" og at autentiseringsmetoden er satt til "Normal password".</span>
   </div>

6. Når du blir bedt om POP3-serverpassord, lim inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i trinn 2 ovenfor

7. **Lagre innstillingene dine** – hvis du har problemer, vennligst <a href="/help">kontakt oss</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle trinnene.
    </span>
  </div>
</div>

</div>

### Støtter dere kalendere (CalDAV) {#do-you-support-calendars-caldav}

Ja, fra og med 5. februar 2024 har vi lagt til denne funksjonen. Vår server er `caldav.forwardemail.net` og overvåkes også på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.
Den støtter både IPv4 og IPv6 og er tilgjengelig over port `443` (HTTPS).

| Innlogging | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com`         | E-postadresse til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>.       |
| Passord   | `************************` | Alias-spesifikt generert passord.                                                                                                                                                        |

For å bruke kalenderstøtte må **brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **passordet** må være et alias-spesifikt generert passord.

### Støtter dere oppgaver og påminnelser (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ja, fra og med 14. oktober 2025 har vi lagt til CalDAV VTODO-støtte for oppgaver og påminnelser. Dette bruker samme server som vår kalenderstøtte: `caldav.forwardemail.net`.

Vår CalDAV-server støtter både kalenderhendelser (VEVENT) og oppgavekomponenter (VTODO) ved bruk av **unified calendars**. Dette betyr at hver kalender kan inneholde både hendelser og oppgaver, noe som gir maksimal fleksibilitet og kompatibilitet på tvers av alle CalDAV-klienter.

**Hvordan kalendere og lister fungerer:**

* **Hver kalender støtter både hendelser og oppgaver** – Du kan legge til hendelser, oppgaver eller begge deler i hvilken som helst kalender
* **Apple Reminders-lister** – Hver liste du oppretter i Apple Reminders blir en egen kalender på serveren
* **Flere kalendere** – Du kan opprette så mange kalendere du trenger, hver med sitt eget navn, farge og organisering
* **Synkronisering på tvers av klienter** – Oppgaver og hendelser synkroniseres sømløst mellom alle kompatible klienter

**Støttede oppgaveklienter:**

* **macOS Reminders** – Full native støtte for opprettelse, redigering, fullføring og synkronisering av oppgaver
* **iOS Reminders** – Full native støtte på alle iOS-enheter
* **Tasks.org (Android)** – Populær åpen kildekode oppgavebehandler med CalDAV-synk
* **Thunderbird** – Oppgave- og kalenderstøtte i skrivebords e-postklient
* **Enhver CalDAV-kompatibel oppgavebehandler** – Standard VTODO-komponentstøtte

**Støttede oppgavefunksjoner:**

* Opprettelse, redigering og sletting av oppgaver
* Forfallsdatoer og startdatoer
* Oppgavefullføringsstatus (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Oppgaveprioritetsnivåer
* Gjentakende oppgaver
* Oppgavebeskrivelser og notater
* Synkronisering på flere enheter
* Underoppgaver med RELATED-TO-egenskap
* Oppgavepåminnelser med VALARM

Innloggingsinformasjonen er den samme som for kalenderstøtte:

| Innlogging | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com`         | E-postadresse til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>.       |
| Passord   | `************************` | Alias-spesifikt generert passord.                                                                                                                                                        |

**Viktige merknader:**

* **Hver Reminders-liste er en egen kalender** – Når du oppretter en ny liste i Apple Reminders, opprettes en ny kalender på CalDAV-serveren
* **Thunderbird-brukere** – Du må manuelt abonnere på hver kalender/liste du vil synkronisere, eller bruke kalenderhjem-URL-en: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple-brukere** – Kalenderoppdagelse skjer automatisk, så alle dine kalendere og lister vil vises i Calendar.app og Reminders.app
* **Unified calendars** – Alle kalendere støtter både hendelser og oppgaver, noe som gir deg fleksibilitet i hvordan du organiserer dataene dine
### Støtter dere kontakter (CardDAV) {#do-you-support-contacts-carddav}

Ja, fra og med 12. juni 2025 har vi lagt til denne funksjonen. Vår server er `carddav.forwardemail.net` og overvåkes også på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den støtter både IPv4 og IPv6 og er tilgjengelig over port `443` (HTTPS).

| Innlogging | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com`         | E-postadresse til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>.       |
| Passord    | `************************` | Alias-spesifikt generert passord.                                                                                                                                                         |

For å bruke støtte for kontakter må **brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **passordet** må være et alias-spesifikt generert passord.

### Støtter dere sending av e-post med SMTP {#do-you-support-sending-email-with-smtp}

Ja, fra mai 2023 støtter vi sending av e-post med SMTP som et tillegg for alle betalende brukere.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Vennligst sørg for at du har lest våre <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Personvernregler</a>, og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Grenser for utgående SMTP</a> &ndash; din bruk anses som bekreftelse og aksept.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du bruker Gmail, se vår <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Send Mail As med Gmail-veiledning</a>. Hvis du er utvikler, se vår <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-post-API-dokumentasjon</a>.
  </span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Innstillinger <i class="fa fa-angle-right"></i> Konfigurasjon for utgående SMTP og følg oppsettsinstruksjonene

2. Opprett et nytt alias for domenet ditt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias (f.eks. <code><hello@example.com></code>)

3. Klikk på <strong class="text-success"><i class="fa fa-key"></i> Generer passord</strong> ved siden av det nylig opprettede aliaset. Kopier til utklippstavlen og lagre det genererte passordet sikkert.

4. Bruk din foretrukne e-postapplikasjon, legg til eller konfigurer en konto med ditt nylig opprettede alias (f.eks. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Vi anbefaler å bruke <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, eller <a href="/blog/open-source" class="alert-link" target="_blank">et åpen kildekode- og personvernfokusert alternativ</a>.</span>
   </div>
5. Når du blir bedt om SMTP-servernavn, skriv inn `smtp.forwardemail.net`

6. Når du blir bedt om SMTP-serverport, skriv inn `465` (SSL/TLS) – se [alternative SMTP-porter](/faq#what-are-your-smtp-server-configuration-settings) om nødvendig
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Hvis du bruker Thunderbird, må du sørge for at "Connection security" er satt til "SSL/TLS" og at autentiseringsmetoden er satt til "Normal password".</span>
   </div>

7. Når du blir bedt om SMTP-serverpassord, lim inn passordet fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i trinn 3 ovenfor

8. **Lagre innstillingene dine og send din første test-epost** – hvis du har problemer, vennligst <a href="/help">kontakt oss</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Vennligst merk at for å opprettholde IP-omdømme og sikre leveringsdyktighet, har vi en manuell gjennomgangsprosess per domene for godkjenning av utgående SMTP. Dette tar vanligvis mindre enn 24 timer, med de fleste forespørsler behandlet innen 1-2 timer. I nær fremtid har vi som mål å gjøre denne prosessen umiddelbar med ekstra spamkontroller og varsling. Denne prosessen sikrer at e-postene dine når innboksen og at meldingene dine ikke blir merket som spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle trinnene.
    </span>
  </div>
</div>

</div>

### Støtter dere OpenPGP/MIME, ende-til-ende-kryptering ("E2EE") og Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, vi støtter [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [ende-til-ende-kryptering ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), og oppdagelse av offentlige nøkler ved bruk av [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Du kan konfigurere OpenPGP ved å bruke [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) eller [hoste dine egne nøkler selv](https://wiki.gnupg.org/WKDHosting) (se [denne gist for WKD-serveroppsett](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-oppslag blir bufret i 1 time for å sikre rask e-postlevering → derfor, hvis du legger til, endrer eller fjerner din WKD-nøkkel, vennligst send oss en e-post til `support@forwardemail.net` med din e-postadresse slik at vi manuelt kan tømme bufferen.
* Vi støtter PGP-kryptering for meldinger som videresendes via WKD-oppslag eller ved bruk av en opplastet PGP-nøkkel i vårt grensesnitt.
* Opplastede nøkler har forrang så lenge PGP-avkrysningsboksen er aktivert/avhuket.
* Meldinger sendt til webhooks er for øyeblikket ikke kryptert med PGP.
* Hvis du har flere aliaser som matcher en gitt videresendingsadresse (f.eks. regex/wildcard/eksakt kombinasjon) og hvis mer enn én av disse inneholder en opplastet PGP-nøkkel og har PGP avhuket → vil vi sende deg en feilmelding via e-post og vil ikke kryptere meldingen med din opplastede PGP-nøkkel. Dette er svært sjeldent og gjelder vanligvis bare avanserte brukere med komplekse alias-regler.
* **PGP-kryptering vil ikke bli brukt på e-postvideresending gjennom våre MX-servere hvis avsender har en DMARC-policy satt til reject. Hvis du trenger PGP-kryptering på *all* e-post, anbefaler vi å bruke vår IMAP-tjeneste og konfigurere din PGP-nøkkel for ditt alias for innkommende e-post.**

**Du kan validere ditt Web Key Directory-oppsett på <https://wkd.chimbosonic.com/> (open-source) eller <https://www.webkeydirectory.com/> (proprietær).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatisk kryptering:
  </strong>
  <span>Hvis du bruker vår <a href="#do-you-support-sending-email-with-smtp" class="alert-link">utgående SMTP-tjeneste</a> og sender ukrypterte meldinger, vil vi automatisk forsøke å kryptere meldinger på mottakernivå ved bruk av <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Du må følge alle de følgende trinnene for å aktivere OpenPGP for ditt egendefinerte domenenavn.
  </span>
</div>

1. Last ned og installer din e-postklients anbefalte plugin nedenfor:

   | E-postklient   | Plattform | Anbefalt plugin                                                                                                                                                                      | Notater                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird    | Desktop  | [Konfigurer OpenPGP i Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird har innebygd støtte for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail          | Nettleser| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens)                                                                         | Gmail støtter ikke OpenPGP, men du kan laste ned den åpen kildekode-pluginen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                       |
   | Apple Mail     | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                        | Apple Mail støtter ikke OpenPGP, men du kan laste ned den åpen kildekode-pluginen [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                           |
   | Apple Mail     | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietær lisens)                       | Apple Mail støtter ikke OpenPGP, men du kan laste ned den åpen kildekode-pluginen [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                      |
   | Outlook        | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                        | Outlooks skrivebords-e-postklient støtter ikke OpenPGP, men du kan laste ned den åpen kildekode-pluginen [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook        | Nettleser| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens)                                                                         | Outlooks nettbaserte e-postklient støtter ikke OpenPGP, men du kan laste ned den åpen kildekode-pluginen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android        | Mobil    | [OpenKeychain](https://www.openkeychain.org/) eller [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                 | [Android e-postklienter](/blog/open-source/android-email-clients) som [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) og [FairEmail](https://github.com/M66B/FairEmail) støtter begge den åpen kildekode-pluginen [OpenKeychain](https://www.openkeychain.org/). Du kan alternativt bruke den åpen kildekode (proprietær lisensiering) pluginen [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome  | Nettleser| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens)                                                                         | Du kan laste ned den åpen kildekode-nettleserutvidelsen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                           |
   | Mozilla Firefox| Nettleser| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens)                                                                         | Du kan laste ned den åpen kildekode-nettleserutvidelsen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                           |
   | Microsoft Edge | Nettleser| [Mailvelope](https://mailvelope.com/)                                                                                                                                               | Du kan laste ned den åpen kildekode-nettleserutvidelsen [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                            |
   | Brave          | Nettleser| [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær lisens)                                                                         | Du kan laste ned den åpen kildekode-nettleserutvidelsen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                           |
   | Balsa          | Desktop  | [Konfigurer OpenPGP i Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                          | Balsa har innebygd støtte for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail          | Desktop  | [Konfigurer OpenPGP i KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                               | KMail har innebygd støtte for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution| Desktop  | [Konfigurer OpenPGP i Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                             | GNOME Evolution har innebygd støtte for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal       | Desktop  | [Konfigurer gpg i Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                       | Du kan bruke det åpen kildekode [gpg kommandolinjeverktøyet](https://www.gnupg.org/download/) for å generere en ny nøkkel fra kommandolinjen.                                                                                                                                                                                                                                                                                            |
2. Åpne pluginen, opprett din offentlige nøkkel, og konfigurer e-postklienten din til å bruke den.

3. Last opp din offentlige nøkkel på <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Du kan besøke <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> for å administrere nøkkelen din i fremtiden.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Valgfritt tillegg:
     </strong>
     <span>
       Hvis du bruker vår <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">krypterte lagring (IMAP/POP3)</a>-tjeneste og ønsker at <i>all</i> e-post lagret i din (allerede krypterte) SQLite-database skal krypteres med din offentlige nøkkel, gå da til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias (f.eks. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Rediger <i class="fa fa-angle-right"></i> OpenPGP og last opp din offentlige nøkkel.
     </span>
   </div>

4. Legg til en ny `CNAME`-post til domenenavnet ditt (f.eks. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Navn/Vert/Alias</th>
         <th class="text-center">TTL</th>
         <th>Type</th>
         <th>Svar/Verdi</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Hvis aliaset ditt bruker våre <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable-domener</a> (f.eks. <code>hideaddress.net</code>), kan du hoppe over dette steget.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har fullført alle stegene.
    </span>
  </div>
</div>

### Støtter dere S/MIME-kryptering {#do-you-support-smime-encryption}

Ja, vi støtter [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME)-kryptering som definert i [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME gir ende-til-ende-kryptering ved bruk av X.509-sertifikater, som er bredt støttet av bedrifts-e-postklienter.

Vi støtter både RSA- og ECC (Elliptic Curve Cryptography)-sertifikater:

* **RSA-sertifikater**: minimum 2048-bit, anbefalt 4096-bit
* **ECC-sertifikater**: P-256, P-384 og P-521 NIST-kurver

For å konfigurere S/MIME-kryptering for ditt alias:

1. Skaff et S/MIME-sertifikat fra en pålitelig sertifikatutsteder (CA) eller generer et selvsignert sertifikat for testing.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tips:
     </strong>
     <span>Gratis S/MIME-sertifikater er tilgjengelige fra leverandører som <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> eller <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Eksporter sertifikatet ditt i PEM-format (kun det offentlige sertifikatet, ikke den private nøkkelen).

3. Gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias (f.eks. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Rediger <i class="fa fa-angle-right"></i> S/MIME og last opp ditt offentlige sertifikat.
4. Når det er konfigurert, vil alle innkommende e-poster til ditt alias bli kryptert med ditt S/MIME-sertifikat før de lagres eller videresendes.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Merk:
     </strong>
     <span>
       S/MIME-kryptering brukes på innkommende meldinger som ikke allerede er kryptert. Hvis en melding allerede er kryptert med OpenPGP eller S/MIME, vil den ikke bli kryptert på nytt.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Viktig:
     </strong>
     <span>
       S/MIME-kryptering vil ikke bli brukt på e-postvideresending gjennom våre MX-servere hvis avsender hadde en DMARC-policy med reject. Hvis du trenger S/MIME-kryptering på <em>all</em> e-post, anbefaler vi å bruke vår IMAP-tjeneste og konfigurere ditt S/MIME-sertifikat for ditt alias for innkommende e-post.
     </span>
   </div>

Følgende e-postklienter har innebygd støtte for S/MIME:

| E-postklient     | Plattform | Notater                                                                                                            |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail       | macOS    | Innebygd støtte for S/MIME. Gå til Mail > Preferences > Accounts > din konto > Trust for å konfigurere sertifikater. |
| Apple Mail       | iOS      | Innebygd støtte for S/MIME. Gå til Settings > Mail > Accounts > din konto > Advanced > S/MIME for å konfigurere.   |
| Microsoft Outlook| Windows  | Innebygd støtte for S/MIME. Gå til File > Options > Trust Center > Trust Center Settings > Email Security for å konfigurere. |
| Microsoft Outlook| macOS    | Innebygd støtte for S/MIME. Gå til Tools > Accounts > Advanced > Security for å konfigurere.                      |
| Thunderbird      | Desktop  | Innebygd støtte for S/MIME. Gå til Account Settings > End-To-End Encryption > S/MIME for å konfigurere.           |
| GNOME Evolution  | Desktop  | Innebygd støtte for S/MIME. Gå til Edit > Preferences > Mail Accounts > din konto > Security for å konfigurere.   |
| KMail            | Desktop  | Innebygd støtte for S/MIME. Gå til Settings > Configure KMail > Identities > din identitet > Cryptography for å konfigurere. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulerer!
    </strong>
    <span>
      Du har konfigurert S/MIME-kryptering for ditt alias.
    </span>
  </div>
</div>

### Støtter dere Sieve e-postfiltrering {#do-you-support-sieve-email-filtering}

Ja! Vi støtter [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) e-postfiltrering som definert i [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve er et kraftig, standardisert skriptspråk for serverbasert e-postfiltrering som lar deg automatisk organisere, filtrere og svare på innkommende meldinger.

#### Støttede Sieve-utvidelser {#supported-sieve-extensions}

Vi støtter et omfattende sett med Sieve-utvidelser:

| Utvidelse                   | RFC                                                                                     | Beskrivelse                                     |
| --------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Plasser meldinger i spesifikke mapper           |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Avvis meldinger med en feil                      |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatisk ferie-/fraværsvar                      |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Finmasket intervall for ferievarsler             |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Sett IMAP-flagg (\Seen, \Flagged, osv.)          |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Test avsender/mottaker i konvolutt               |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Test innhold i meldingskropp                      |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Lagre og bruk variabler i skript                  |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Relasjonelle sammenligninger (større enn, mindre enn) |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Numeriske sammenligninger                         |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Kopier meldinger ved videresending                |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Legg til eller slett meldingsoverskrifter         |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Test dato-/tidsverdier                            |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Tilgang til spesifikke forekomster av overskrifter |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Regulære uttrykk-matching                         |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Send varsler (f.eks. mailto:)                     |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Tilgang til miljøinformasjon                       |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Test om postkasse finnes, opprett postkasser     |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Plasser i spesialbruk-postkasser (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Oppdag duplikate meldinger                        |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Test for tilgjengelighet av utvidelser            |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Tilgang til bruker+detalj-adressedeler            |
#### Utvidelser som ikke støttes {#extensions-not-supported}

Følgende utvidelser støttes for øyeblikket ikke:

| Utvidelse                                                      | Årsak                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Sikkerhetsrisiko (script-injeksjon) og krever global skriptlagring |
| `mboxmetadata` / `servermetadata`                              | Krever støtte for IMAP METADATA-utvidelsen                         |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Kompleks MIME-tre-manipulering er ennå ikke implementert           |

#### Eksempel på Sieve-skript {#example-sieve-scripts}

**Sorter nyhetsbrev i en mappe:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatisk svar når du er på ferie:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**Marker meldinger fra viktige avsendere:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Avvis spam med spesifikke emner:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### Administrere Sieve-skript {#managing-sieve-scripts}

Du kan administrere dine Sieve-skript på flere måter:

1. **Nettgrensesnitt**: Gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Sieve-skript for å opprette og administrere skript.

2. **ManageSieve-protokoll**: Koble til med en hvilken som helst ManageSieve-kompatibel klient (som Thunderbirds Sieve-tillegg eller [sieve-connect](https://github.com/philpennock/sieve-connect)) til `imap.forwardemail.net`. Bruk port `2190` med STARTTLS (anbefalt for de fleste klienter) eller port `4190` med implicit TLS.

3. **API**: Bruk vår [REST API](/api#sieve-scripts) for å programmere administrasjon av skript.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Merk:
  </strong>
  <span>
    Sieve-filtrering anvendes på innkommende meldinger før de lagres i postkassen din. Skriptene kjøres i prioritert rekkefølge, og den første matchende handlingen bestemmer hvordan meldingen håndteres.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Sikkerhet:
  </strong>
  <span>
    Av sikkerhetsgrunner er videresendingshandlinger begrenset til 10 per skript og 100 per dag. Feriesvar er hastighetsbegrenset for å forhindre misbruk.
  </span>
</div>

### Støtter dere MTA-STS {#do-you-support-mta-sts}

Ja, fra og med 2. mars 2023 støtter vi [MTA-STS](https://www.hardenize.com/blog/mta-sts). Du kan bruke [denne malen](https://github.com/jpawlowski/mta-sts.template) hvis du ønsker å aktivere det på ditt domene.

Vår konfigurasjon er offentlig tilgjengelig på GitHub på <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Støtter dere passkeys og WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Fra og med 13. desember 2023 har vi lagt til støtte for passkeys [på grunn av stor etterspørsel](https://github.com/orgs/forwardemail/discussions/182).

Passkeys lar deg logge inn sikkert uten å måtte bruke passord og tofaktorautentisering.

Du kan bekrefte identiteten din med berøring, ansiktsgjenkjenning, enhetsbasert passord eller PIN-kode.

Vi lar deg administrere opptil 30 passkeys samtidig, slik at du enkelt kan logge inn med alle dine enheter.

Lær mer om passkeys på følgende lenker:

* [Logg inn på apper og nettsteder med passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Bruk passkeys for å logge inn på apper og nettsteder på iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikkel om Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Støtter dere beste praksis for e-post {#do-you-support-email-best-practices}

Ja. Vi har innebygd støtte for SPF, DKIM, DMARC, ARC og SRS i alle planer. Vi har også jobbet tett med de opprinnelige forfatterne av disse spesifikasjonene og andre e-posteksperter for å sikre perfeksjon og høy leveringsgrad.

### Støtter dere bounce webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Ser du etter dokumentasjon om e-post webhooks? Se <a href="/faq#do-you-support-webhooks" class="alert-link">Støtter dere webhooks?</a> for mer innsikt.
  <span>
  </span>
</div>

Ja, fra og med 14. august 2024 har vi lagt til denne funksjonen. Du kan nå gå til Min konto → Domener → Innstillinger → Bounce Webhook URL og konfigurere en `http://` eller `https://` URL som vi vil sende en `POST`-forespørsel til hver gang utgående SMTP-e-poster spretter.

Dette er nyttig for deg for å administrere og overvåke din utgående SMTP – og kan brukes til å vedlikeholde abonnenter, avmeldinger og oppdage når spretter oppstår.

Bounce webhook-payloads sendes som JSON med disse egenskapene:

* `email_id` (String) - e-post-ID som tilsvarer en e-post i Min konto → E-poster (utgående SMTP)
* `list_id` (String) - verdien av `List-ID`-headeren (case-insensitive), hvis noen, fra den opprinnelige utgående e-posten
* `list_unsubscribe` (String) - verdien av `List-Unsubscribe`-headeren (case-insensitive), hvis noen, fra den opprinnelige utgående e-posten
* `feedback_id` (String) - verdien av `Feedback-ID`-headeren (case-insensitive), hvis noen, fra den opprinnelige utgående e-posten
* `recipient` (String) - e-postadressen til mottakeren som spretter eller feilet
* `message` (String) - en detaljert feilmelding for sprettefeilen
* `response` (String) - SMTP-responsmeldingen
* `response_code` (Number) - den analyserte SMTP-responskoden
* `truth_source` (String) - hvis responskoden kom fra en pålitelig kilde, vil denne verdien være fylt med rot-domenenavnet (f.eks. `google.com` eller `yahoo.com`)
* `bounce` (Object) - et objekt som inneholder følgende egenskaper som detaljerer sprette- og avvisningsstatus
  * `action` (String) - bounce-handling (f.eks. `"reject"`)
  * `message` (String) - bounce-grunn (f.eks. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - bounce-kategori (f.eks. `"block"`)
  * `code` (Number) - bounce-statuskode (f.eks. `554`)
  * `status` (String) - bounce-kode fra responsmeldingen (f.eks. `5.7.1`)
  * `line` (Number) - analysert linjenummer, hvis noen, [fra Zone-MTA bounce parse list](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (f.eks. `526`)
* `headers` (Object) - nøkkel-verdi-par av headere for den utgående e-posten
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formatert dato for når sprettefeilen oppstod

For eksempel:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Her er noen ekstra notater angående bounce webhooks:

* Hvis webhook-payloaden inneholder en `list_id`, `list_unsubscribe` eller `feedback_id`-verdi, bør du ta passende tiltak for å fjerne `recipient` fra listen om nødvendig.
  * Hvis `bounce.category`-verdien var en av `"block"`, `"recipient"`, `"spam"` eller `"virus"`, bør du definitivt fjerne brukeren fra listen.
* Hvis du trenger å verifisere webhook-payloads (for å sikre at de faktisk kommer fra vår server), kan du [løse opp den eksterne klientens IP-adresse til klientens vertsnavn ved hjelp av en omvendt oppslag](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal være `smtp.forwardemail.net`.
  * Du kan også sjekke IP-en mot [våre publiserte IP-adresser](#what-are-your-servers-ip-addresses).
  * Gå til Min konto → Domener → Innstillinger → Webhook Signature Payload Verification Key for å hente din webhook-nøkkel.
    * Du kan rotere denne nøkkelen når som helst av sikkerhetsgrunner.
    * Beregn og sammenlign `X-Webhook-Signature`-verdien fra vår webhook-forespørsel med den beregnede body-verdien ved bruk av denne nøkkelen. Et eksempel på hvordan du gjør dette finnes i [dette Stack Overflow-innlegget](https://stackoverflow.com/a/68885281).
  * Se diskusjonen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mer innsikt.
* Vi vil vente opptil `5` sekunder på at webhook-endepunktet ditt svarer med statuskode `200`, og vi vil prøve på nytt opptil `1` gang.
* Hvis vi oppdager at bounce webhook-URL-en din har en feil mens vi prøver å sende en forespørsel til den, vil vi sende deg en høflighets-e-post en gang i uken.
### Støtter dere webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Ser du etter dokumentasjon om bounce webhooks? Se <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Støtter dere bounce webhooks?</a> for mer innsikt.
  <span>
  </span>
</div>

Ja, fra og med 15. mai 2020 har vi lagt til denne funksjonen. Du kan enkelt legge til webhook(s) akkurat som du ville gjort med en hvilken som helst mottaker! Vennligst sørg for at du har "http" eller "https" protokollen foran webhookens URL.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Forbedret personvern:
  </strong>
  <span>
    Hvis du er på en betalt plan (som har forbedret personvern), vennligst gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> og klikk på "Aliaser" ved siden av domenet ditt for å konfigurere webhookene dine. Hvis du vil lære mer om betalte planer, se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prisside</a>. Ellers kan du fortsette å følge instruksjonene nedenfor.
  </span>
</div>

Hvis du er på gratisplanen, legg ganske enkelt til en ny DNS <strong class="notranslate">TXT</strong>-post som vist nedenfor:

For eksempel, hvis jeg vil at alle e-poster som går til `alias@example.com` skal videresendes til en ny [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test-endepunkt:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Eller kanskje du vil at alle e-poster som går til `example.com` skal videresendes til dette endepunktet:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Her er flere notater angående webhooks:**

* Hvis du trenger å verifisere webhook-payloads (for å sikre at de faktisk kommer fra vår server), kan du [løse opp den eksterne klientens IP-adresse og klientvertsnavn ved hjelp av en omvendt oppslag](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal være enten `mx1.forwardemail.net` eller `mx2.forwardemail.net`.
  * Du kan også sjekke IP-en mot [våre publiserte IP-adresser](#what-are-your-servers-ip-addresses).
  * Hvis du er på en betalt plan, gå til Min konto → Domener → Innstillinger → Webhook Signature Payload Verification Key for å hente webhook-nøkkelen din.
    * Du kan rotere denne nøkkelen når som helst av sikkerhetsgrunner.
    * Beregn og sammenlign `X-Webhook-Signature`-verdien fra vår webhook-forespørsel med den beregnede kroppverdien ved hjelp av denne nøkkelen. Et eksempel på hvordan du gjør dette finnes i [dette Stack Overflow-innlegget](https://stackoverflow.com/a/68885281).
  * Se diskusjonen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mer innsikt.
* Hvis en webhook ikke svarer med statuskode `200`, lagrer vi svaret i [feilloggen som opprettes](#do-you-store-error-logs) – noe som er nyttig for feilsøking.
* Webhook HTTP-forespørsler vil prøve opptil 3 ganger ved hver SMTP-tilkoblingsforsøk, med en maksimal timeout på 60 sekunder per endepunkt POST-forespørsel. **Merk at dette ikke betyr at den bare prøver 3 ganger**, den vil faktisk prøve kontinuerlig over tid ved å sende en SMTP-kode 421 (som indikerer til avsenderen å prøve igjen senere) etter det tredje mislykkede HTTP POST-forespørselsforsøket. Dette betyr at e-posten vil prøve kontinuerlig i flere dager til en 200-statuskode oppnås.
* Vi prøver automatisk på nytt basert på standard status- og feilkoder brukt i [superagents retry-metode](https://ladjs.github.io/superagent/#retrying-requests) (vi er vedlikeholdere).
* Vi grupperer sammen webhook HTTP-forespørsler til samme endepunkt i én forespørsel i stedet for flere for å spare ressurser og øke responstiden. For eksempel, hvis du sender en e-post til <webhook1@example.com>, <webhook2@example.com>, og <webhook3@example.com>, og alle er konfigurert til å treffe det samme *eksakte* endepunkt-URL, vil bare én forespørsel bli gjort. Vi grupperer etter eksakt endepunkt samsvar med streng likhet.
* Merk at vi bruker [mailparser](https://nodemailer.com/extras/mailparser/) bibliotekets "simpleParser"-metode for å analysere meldingen til et JSON-vennlig objekt.
* Rå e-postverdi som en streng gis som egenskapen "raw".
* Autentiseringsresultater gis som egenskapene "dkim", "spf", "arc", "dmarc" og "bimi".
* De analyserte e-postoverskriftene gis som egenskapen "headers" – men merk også at du kan bruke "headerLines" for enklere iterasjon og parsing.
* De grupperte mottakerne for denne webhooken er gruppert sammen og gitt som egenskapen "recipients".
* SMTP-øktinformasjonen gis som egenskapen "session". Denne inneholder informasjon om avsenderen av meldingen, ankomsttidspunkt for meldingen, HELO og klientvertsnavn. Klientvertsnavnverdien som `session.clientHostname` er enten FQDN (fra et omvendt PTR-oppslag) eller det er `session.remoteAddress` pakket inn i parenteser (f.eks. `"[127.0.0.1]"`).
* Hvis du trenger en rask måte å få verdien av `X-Original-To`, kan du bruke verdien av `session.recipient` (se eksempel nedenfor). Overskriften `X-Original-To` er en overskrift vi legger til meldinger for feilsøking med den opprinnelige mottakeren (før maskert videresending) for meldingen.
* Hvis du trenger å fjerne `attachments` og/eller `raw` egenskaper fra payload-kroppen, legg ganske enkelt til `?attachments=false`, `?raw=false`, eller `?attachments=false&raw=false` til webhook-endepunktet ditt som en spørringsstrengparameter (f.eks. `https://example.com/webhook?attachments=false&raw=false`).
* Hvis det finnes vedlegg, vil de bli lagt til i `attachments`-arrayet med Buffer-verdier. Du kan analysere dem tilbake til innhold ved å bruke en tilnærming med JavaScript som:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Støtter dere regulære uttrykk eller regex {#do-you-support-regular-expressions-or-regex}

Ja, fra og med 27. september 2021 har vi lagt til denne funksjonen. Du kan enkelt skrive regulære uttrykk ("regex") for å matche aliaser og utføre substitusjoner.

Regulære uttrykk-støttede aliaser er de som starter med en `/` og slutter med `/`, og deres mottakere er e-postadresser eller webhooks. Mottakerne kan også inkludere regex-substitusjonsstøtte (f.eks. `$1`, `$2`).

Vi støtter to regulære uttrykksflagg, inkludert `i` og `g`. Det store-/småbokstav-ufølsomme flagget `i` er en permanent standard og håndheves alltid. Det globale flagget `g` kan legges til av deg ved å feste slutt-`/` med `/g`.

Merk at vi også støtter vår <a href="#can-i-disable-specific-aliases">deaktiverte alias-funksjon</a> for mottakerdelen med vår regex-støtte.

Regulære uttrykk støttes ikke på <a href="/disposable-addresses" target="_blank">globale vanity-domener</a> (da dette kan være en sikkerhetssårbarhet).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Forbedret personvern:
  </strong>
  <span>
    Hvis du er på en betalt plan (som har forbedret personvern), vennligst gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> og klikk på "Alias" ved siden av domenet ditt for å konfigurere aliaser, inkludert de med regulære uttrykk. Hvis du vil lære mer om betalte planer, se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Priser</a>-side.
  </span>
</div>

#### Eksempler for forbedret personvern {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Aliasnavn</th>
      <th>Effekt</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-poster til `linus@example.com` eller `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">se test på RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-poster til `24highst@example.com` eller `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">se test på RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    For å teste disse på <a href="https://regexr.com" class="alert-link">RegExr</a>, skriv uttrykket i toppboksen, og skriv deretter et eksempelalias i tekstboksen under. Hvis det matcher, blir det blått.
  <span>
  </span>
</div>

#### Eksempler for gratisplanen {#examples-for-the-free-plan}

Hvis du er på gratisplanen, legg ganske enkelt til en ny DNS <strong class="notranslate">TXT</strong>-post ved å bruke ett eller flere av de oppgitte eksemplene nedenfor:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Enkelt eksempel:</strong> Hvis jeg vil at alle e-poster som går til `linus@example.com` eller `torvalds@example.com` skal videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på substitusjon av fornavn etternavn:</strong> Tenk deg at alle e-postadressene i firmaet ditt har mønsteret `fornavn.etternavn@example.com`. Hvis jeg vil at alle e-poster som går til mønsteret `fornavn.etternavn@example.com` skal videresendes til `fornavn.etternavn@company.com` med substitusjonsstøtte (<a href="https://regexr.com/66hnu" class="alert-link">se test på RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på substitusjon med plussymbolfiltrering:</strong> Hvis jeg vil at alle e-poster som går til `info@example.com` eller `support@example.com` skal videresendes til `user+info@gmail.com` eller `user+support@gmail.com` henholdsvis (med støtte for substitusjon) (<a href="https://regexr.com/66ho7" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på substitusjon i webhook-spørringsstreng:</strong> Kanskje du vil at alle e-poster som går til `example.com` skal gå til en <a href="#do-you-support-webhooks" class="alert-link">webhook</a> og ha en dynamisk spørringsstrengnøkkel "to" med verdien av brukernavndelen av e-postadressen (<a href="https://regexr.com/66ho4" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på stille avvisning:</strong> Hvis du vil at alle e-poster som matcher et bestemt mønster skal deaktiveres og stille avvises (ser ut for avsender som om meldingen ble sendt vellykket, men går faktisk ingen steder) med statuskode `250` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere spesifikke aliaser</a>), bruk da samme tilnærming med et enkelt utropstegn "!". Dette indikerer for avsender at meldingen ble levert, men den gikk faktisk ingen steder (f.eks. svart hull eller `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på myk avvisning:</strong> Hvis du vil at alle e-poster som matcher et bestemt mønster skal deaktiveres og mykt avvises med statuskode `421` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere spesifikke aliaser</a>), bruk da samme tilnærming med dobbelt utropstegn "!!". Dette indikerer for avsender å prøve å sende e-posten på nytt, og e-poster til dette aliaset vil bli forsøkt sendt på nytt i omtrent 5 dager før de avvises permanent.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på hard avvisning:</strong> Hvis du vil at alle e-poster som matcher et bestemt mønster skal deaktiveres og hard avvises med statuskode `550` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere spesifikke aliaser</a>), bruk ganske enkelt samme tilnærming med en trippel utropstegn "!!!". Dette indikerer for avsenderen en permanent feil, og e-postene vil ikke forsøkes sendt på nytt, de vil bli avvist for dette aliaset.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Nysgjerrig på hvordan du skriver et regulært uttrykk eller trenger å teste erstatningen din? Du kan gå til den gratis nettsiden for testing av regulære uttrykk <a href="https://regexr.com" class="alert-link">RegExr</a> på <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Hva er dine utgående SMTP-begrensninger {#what-are-your-outbound-smtp-limits}

Vi begrenser brukere og domener til 300 utgående SMTP-meldinger per 1 dag. Dette tilsvarer i gjennomsnitt over 9000 e-poster i en kalender måned. Hvis du trenger å overskride dette beløpet eller har konsekvent store e-poster, vennligst [kontakt oss](https://forwardemail.net/help).

### Trenger jeg godkjenning for å aktivere SMTP {#do-i-need-approval-to-enable-smtp}

Ja, vær oppmerksom på at for å opprettholde IP-omdømme og sikre leveringsdyktighet, har Forward Email en manuell gjennomgangsprosess per domene for godkjenning av utgående SMTP. Send e-post til <support@forwardemail.net> eller åpne en [hjelpeforespørsel](https://forwardemail.net/help) for godkjenning. Dette tar vanligvis mindre enn 24 timer, med de fleste forespørsler behandlet innen 1-2 timer. I nær fremtid har vi som mål å gjøre denne prosessen umiddelbar med ekstra spamkontroller og varsling. Denne prosessen sikrer at e-postene dine når innboksen og at meldingene dine ikke blir merket som spam.

### Hva er dine SMTP-server konfigurasjonsinnstillinger {#what-are-your-smtp-server-configuration-settings}

Vår server er `smtp.forwardemail.net` og overvåkes også på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den støtter både IPv4 og IPv6 og er tilgjengelig over portene `465` og `2465` for SSL/TLS (anbefalt) og `587`, `2587`, `2525` og `25` for TLS (STARTTLS).

**Fra og med oktober 2025** støtter vi nå **legacy TLS 1.0**-tilkoblinger på portene `2455` (SSL/TLS) og `2555` (STARTTLS) for eldre enheter som skrivere, skannere, kameraer og eldre e-postklienter som ikke kan støtte moderne TLS-versjoner. Disse portene tilbys som et alternativ til Gmail, Yahoo, Outlook og andre leverandører som har avsluttet støtten for eldre TLS-protokoller.

> \[!CAUTION]
> **Legacy TLS 1.0-støtte (porter 2455 og 2555)**: Disse portene bruker den utdaterte TLS 1.0-protokollen som har kjente sikkerhetssårbarheter (BEAST, POODLE). Bruk kun disse portene hvis enheten din absolutt ikke kan støtte TLS 1.2 eller høyere. Vi anbefaler sterkt å oppgradere enhetens fastvare eller bytte til moderne e-postklienter når det er mulig. Disse portene er kun ment for kompatibilitet med legacy maskinvare (gamle skrivere, skannere, kameraer, IoT-enheter).

|                                     Protokoll                                     | Vertnavn                |            Porter            |        IPv4        |        IPv6        | Notater                                |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Foretrukket**                           | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Moderne TLS 1.2+ (Anbefalt)            |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Støttet (foretrekk SSL/TLS-port `465`) |
|                             `SSL/TLS` **Kun legacy**                             | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 kun for gamle enheter |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Kun legacy**  | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 kun for gamle enheter |
| Innlogging | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com`         | E-postadresse til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>.       |
| Passord   | `************************` | Alias                                                                                                                                                                                     |

For å sende utgående e-post med SMTP, må **SMTP-brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **SMTP-passordet** må være et alias-spesifikt generert passord.

Se [Støtter dere sending av e-post med SMTP](#do-you-support-sending-email-with-smtp) for trinnvise instruksjoner.

### Hva er dine IMAP-server konfigurasjonsinnstillinger {#what-are-your-imap-server-configuration-settings}

Vår server er `imap.forwardemail.net` og overvåkes også på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den støtter både IPv4 og IPv6 og er tilgjengelig over portene `993` og `2993` for SSL/TLS.

|         Protokoll        | Vertnavn                 |     Porter    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Innlogging | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brukernavn | `user@example.com`         | E-postadresse til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>.       |
| Passord   | `************************` | Alias-spesifikt generert passord.                                                                                                                                                         |

For å koble til med IMAP, må **IMAP-brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **IMAP-passordet** må være et alias-spesifikt generert passord.

Se [Støtter dere mottak av e-post med IMAP](#do-you-support-receiving-email-with-imap) for trinnvise instruksjoner.

### Hva er dine POP3-server konfigurasjonsinnstillinger {#what-are-your-pop3-server-configuration-settings}

Vår server er `pop3.forwardemail.net` og overvåkes også på vår <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den støtter både IPv4 og IPv6 og er tilgjengelig over portene `995` og `2995` for SSL/TLS.

|         Protokoll        | Vertnavn                 |     Porter    |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Innlogging | Eksempel                  | Beskrivelse                                                                                                                                                                               |
| --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brukernavn | `user@example.com`        | E-postadresse til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a>.         |
| Passord   | `************************` | Alias-spesifikt generert passord.                                                                                                                                                         |

For å koble til med POP3 må **POP3-brukeren** være e-postadressen til et alias som finnes for domenet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domener</a> – og **IMAP-passordet** må være et alias-spesifikt generert passord.

Se [Støtter dere POP3](#do-you-support-pop3) for trinnvise instruksjoner.

### Hvordan setter jeg opp e-postautodiscovery for mitt domene {#how-do-i-set-up-email-autodiscovery-for-my-domain}

E-postautodiscovery gjør at e-postklienter som **Thunderbird**, **Apple Mail**, **Microsoft Outlook** og mobile enheter automatisk kan finne riktige IMAP-, SMTP-, POP3-, CalDAV- og CardDAV-serverinnstillinger når en bruker legger til sin e-postkonto. Dette er definert av [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (e-post) og [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) og bruker DNS SRV-poster.

Forward Email publiserer autodiscovery-poster på `forwardemail.net`. Du kan enten legge til SRV-poster direkte på domenet ditt, eller bruke en enklere CNAME-metode.

#### Alternativ A: CNAME-poster (enklest) {#option-a-cname-records-simplest}

Legg til disse to CNAME-postene i domenets DNS. Dette delegerer autodiscovery til Forward Emails servere:

|  Type | Navn/Vert       | Mål/Verdi                      |
| :---: | --------------- | ------------------------------ |
| CNAME | `autoconfig`    | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover`  | `autodiscover.forwardemail.net` |

`autoconfig`-posten brukes av **Thunderbird** og andre Mozilla-baserte klienter. `autodiscover`-posten brukes av **Microsoft Outlook**.

#### Alternativ B: SRV-poster (direkte) {#option-b-srv-records-direct}

Hvis du foretrekker å legge til postene direkte (eller DNS-leverandøren din ikke støtter CNAME på underdomener), legg til disse SRV-postene på domenet ditt:

| Type | Navn/Vert           | Prioritet | Vekt | Port | Mål/Verdi                  | Formål                                  |
| :--: | ------------------- | :-------: | :---:| :--: | -------------------------- | --------------------------------------- |
|  SRV | `_imaps._tcp`       |     0     |  1   |  993 | `imap.forwardemail.net`    | IMAP over SSL/TLS (foretrukket)         |
|  SRV | `_imap._tcp`        |     0     |  0   |   0  | `.`                        | Klartekst IMAP deaktivert                |
|  SRV | `_submissions._tcp` |     0     |  1   |  465 | `smtp.forwardemail.net`    | SMTP-innsending (SSL/TLS, anbefalt)     |
|  SRV | `_submission._tcp`  |     5     |  1   |  587 | `smtp.forwardemail.net`    | SMTP-innsending (STARTTLS)               |
|  SRV | `_pop3s._tcp`       |    10     |  1   |  995 | `pop3.forwardemail.net`    | POP3 over SSL/TLS                        |
|  SRV | `_pop3._tcp`        |     0     |  0   |   0  | `.`                        | Klartekst POP3 deaktivert                |
|  SRV | `_caldavs._tcp`     |     0     |  1   |  443 | `caldav.forwardemail.net`  | CalDAV over TLS (kalendere)              |
|  SRV | `_caldav._tcp`      |     0     |  0   |   0  | `.`                        | Klartekst CalDAV deaktivert              |
|  SRV | `_carddavs._tcp`    |     0     |  1   |  443 | `carddav.forwardemail.net` | CardDAV over TLS (kontakter)             |
|  SRV | `_carddav._tcp`     |     0     |  0   |   0  | `.`                        | Klartekst CardDAV deaktivert             |
> \[!NOTE]
> IMAP har en lavere prioritetsverdi (0) enn POP3 (10), noe som forteller e-postklienter å foretrekke IMAP fremfor POP3 når begge er tilgjengelige. Postene med mål `.` (et enkelt punktum) indikerer at de ukrypterte (ikke-krypterte) versjonene av disse protokollene er bevisst deaktivert i henhold til [RFC 6186 Seksjon 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). CalDAV- og CardDAV SRV-postene følger [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) for kalender- og kontaktautodiscovery.

#### Hvilke e-postklienter støtter autodiscovery? {#which-email-clients-support-autodiscovery}

| Klient             | E-post                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME- eller SRV-poster             | `autoconfig` XML- eller SRV-poster (RFC 6764) |
| Apple Mail (macOS) | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| Apple Mail (iOS)   | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| Microsoft Outlook  | `autodiscover` CNAME eller `_autodiscover._tcp` SRV | Ikke støttet                              |
| GNOME (Evolution)  | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| KDE (KMail)        | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| eM Client          | `autoconfig` eller `autodiscover`                | SRV-poster (RFC 6764)                      |

> \[!TIP]
> For best kompatibilitet på tvers av alle klienter anbefaler vi å bruke **Alternativ A** (CNAME-poster) kombinert med SRV-postene fra **Alternativ B**. CNAME-tilnærmingen alene dekker flertallet av e-postklienter. CalDAV/CardDAV SRV-postene sikrer at kalender- og kontaktklienter også kan oppdage serverinnstillingene dine automatisk.


## Sikkerhet {#security-1}

### Avanserte teknikker for serverherding {#advanced-server-hardening-techniques}

> \[!TIP]
> Lær mer om vår sikkerhetsinfrastruktur på [vår sikkerhetsside](/security).

Forward Email implementerer en rekke teknikker for serverherding for å sikre sikkerheten til vår infrastruktur og dine data:

1. **Nettverkssikkerhet**:
   * IP tables-brannmur med strenge regler
   * Fail2ban for beskyttelse mot brute force-angrep
   * Regelmessige sikkerhetsrevisjoner og penetrasjonstesting
   * Kun VPN-basert administrativ tilgang

2. **Systemherding**:
   * Minimal pakkeinstallasjon
   * Regelmessige sikkerhetsoppdateringer
   * SELinux i håndhevende modus
   * Deaktivert root SSH-tilgang
   * Kun nøkkelbasert autentisering

3. **Applikasjonssikkerhet**:
   * Content Security Policy (CSP)-headere
   * HTTPS Strict Transport Security (HSTS)
   * XSS-beskyttelsesheadere
   * Frame options og referrer policy-headere
   * Regelmessige avhengighetsrevisjoner

4. **Databeskyttelse**:
   * Full disk-kryptering med LUKS
   * Sikker nøkkelhåndtering
   * Regelmessige sikkerhetskopier med kryptering
   * Praksis for dataminimering

5. **Overvåking og respons**:
   * Sanntids inntrengingsdeteksjon
   * Automatisert sikkerhetsskanning
   * Sentralisert logging og analyse
   * Prosedyre for hendelsesrespons

> \[!IMPORTANT]
> Våre sikkerhetsrutiner oppdateres kontinuerlig for å håndtere nye trusler og sårbarheter.

> \[!TIP]
> For maksimal sikkerhet anbefaler vi å bruke tjenesten vår med ende-til-ende-kryptering via OpenPGP.

### Har dere SOC 2 eller ISO 27001-sertifiseringer {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email opererer på infrastruktur levert av sertifiserte underleverandører for å sikre samsvar med bransjestandarder.

Forward Email har ikke direkte SOC 2 Type II eller ISO 27001-sertifiseringer. Tjenesten opererer imidlertid på infrastruktur levert av sertifiserte underleverandører:

* **DigitalOcean**: SOC 2 Type II og SOC 3 Type II-sertifisert (revidert av Schellman & Company LLC), ISO 27001-sertifisert ved flere datasentre. Detaljer: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) sertifisert, ISO/IEC-sertifiseringer: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaljer: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-kompatibel (kontakt DataPacket direkte for å få sertifisering), leverandør av infrastruktur på bedriftsnivå (Denver-lokasjon). Detaljer: <https://www.datapacket.com/datacenters/denver>

Forward Email følger bransjens beste praksis for sikkerhetsrevisjoner og samarbeider jevnlig med uavhengige sikkerhetsforskere. Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Bruker dere TLS-kryptering for e-postvideresending {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email håndhever strengt TLS 1.2+ for alle tilkoblinger (HTTPS, SMTP, IMAP, POP3) og implementerer MTA-STS for forbedret TLS-støtte. Implementeringen inkluderer:

* Håndheving av TLS 1.2+ for alle e-posttilkoblinger
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) nøkkelutveksling for perfekt fremoverhemmelighold
* Moderne chifferpakker med regelmessige sikkerhetsoppdateringer
* HTTP/2-støtte for forbedret ytelse og sikkerhet
* HSTS (HTTP Strict Transport Security) med forhåndslasting i store nettlesere
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** for streng TLS-håndheving

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementering**: Forward Email implementerer streng MTA-STS-håndheving i kodebasen. Når TLS-feil oppstår og MTA-STS håndheves, returnerer systemet 421 SMTP-statuskoder for å sikre at e-poster blir forsøkt sendt på nytt senere i stedet for å bli levert usikkert. Implementasjonsdetaljer:

* TLS-feildeteksjon: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-håndheving i send-email-hjelper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Tredjepartsvalidering: <https://www.hardenize.com/report/forwardemail.net/1750312779> viser "Good" vurderinger for alle TLS- og transport-sikkerhetstiltak.

### Bevarer dere e-postautentiseringsoverskrifter {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementerer og bevarer e-postautentiseringsoverskrifter grundig:

* **SPF (Sender Policy Framework)**: Korrekt implementert og bevart
* **DKIM (DomainKeys Identified Mail)**: Full støtte med korrekt nøkkelhåndtering
* **DMARC**: Policyhåndheving for e-poster som feiler SPF- eller DKIM-validering
* **ARC**: Selv om det ikke er eksplisitt detaljert, antyder tjenestens perfekte samsvarspoeng omfattende håndtering av autentiseringsoverskrifter

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validering: Internet.nl Mail Test viser 100/100 poeng spesielt for implementering av "SPF, DKIM og DMARC". Hardenize-vurdering bekrefter "Good" vurderinger for SPF og DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bevarer dere originale e-postoverskrifter og forhindrer spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementerer sofistikert anti-spoofing-beskyttelse for å forhindre misbruk av e-post.

Forward Email bevarer originale e-postoverskrifter samtidig som det implementeres omfattende anti-spoofing-beskyttelse gjennom MX-kodebasen:

* **Bevaring av overskrifter**: Opprinnelige autentiseringsoverskrifter opprettholdes under videresending
* **Anti-spoofing**: DMARC-policyhåndheving forhindrer overskriftsforfalskning ved å avvise e-poster som feiler SPF- eller DKIM-validering
* **Forebygging av overskriftsinjeksjon**: Inndata-validering og sanitering ved bruk av striptags-biblioteket
* **Avansert beskyttelse**: Sofistikert phishingdeteksjon med spoofingdeteksjon, forebygging av utgi seg for noen, og brukervarslingssystemer

**MX-implementasjonsdetaljer**: Kjernen i e-postbehandlingen håndteres av MX-serverens kodebase, spesielt:

* Hoved-MX-datahåndterer: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Vilkårlig e-postfiltrering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary`-hjelperen implementerer sofistikerte anti-spoofing-regler inkludert deteksjon av domeneutgi seg for, blokkerte fraser og ulike phishing-mønstre.
### Hvordan beskytter du mot spam og misbruk {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementerer omfattende flerlagssikring:

* **Ratebegrensning**: Anvendt på autentiseringsforsøk, API-endepunkter og SMTP-tilkoblinger
* **Ressursisolasjon**: Mellom brukere for å forhindre påvirkning fra brukere med høyt volum
* **DDoS-beskyttelse**: Flerlagsbeskyttelse gjennom DataPackets Shield-system og Cloudflare
* **Automatisk skalering**: Dynamisk ressursjustering basert på etterspørsel
* **Misbrukforebygging**: Brukerspesifikke misbrukssjekker og hash-basert blokkering for ondsinnet innhold
* **E-postautentisering**: SPF, DKIM, DMARC-protokoller med avansert phishingdeteksjon

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detaljer om DDoS-beskyttelse)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Lagrer dere e-postinnhold på disk {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email bruker en null-kunnskapsarkitektur som forhindrer at e-postinnhold skrives til disk.

* **Null-kunnskapsarkitektur**: Individuelt krypterte SQLite-postbokser betyr at Forward Email ikke kan få tilgang til e-postinnhold
* **Behandling i minnet**: E-postbehandling skjer helt i minnet, uten lagring på disk
* **Ingen innholdslogging**: "Vi logger eller lagrer ikke e-postinnhold eller metadata på disk"
* **Sandboxet kryptering**: Krypteringsnøkler lagres aldri i klartekst på disk

**Bevis i MX-kodebasen**: MX-serveren behandler e-poster helt i minnet uten å skrive innhold til disk. Hovedbehandleren for e-postbehandling demonstrerer denne minnebaserte tilnærmingen: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Sammendrag)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detaljer om null-kunnskap)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxet kryptering)

### Kan e-postinnhold bli eksponert ved systemkrasj {#can-email-content-be-exposed-during-system-crashes}

Nei. Forward Email implementerer omfattende sikkerhetstiltak mot datalekkasjer ved krasj:

* **Core dumps deaktivert**: Forhindrer minneeksponering ved krasj
* **Swap-minne deaktivert**: Fullstendig deaktivert for å forhindre utvinning av sensitiv data fra swap-filer
* **Minnebasert arkitektur**: E-postinnhold eksisterer kun i flyktig minne under behandling
* **Beskyttelse av krypteringsnøkler**: Nøkler lagres aldri i klartekst på disk
* **Fysisk sikkerhet**: LUKS v2-krypterte disker forhindrer fysisk tilgang til data
* **USB-lagring deaktivert**: Forhindrer uautorisert datautvinning

**Feilhåndtering ved systemproblemer**: Forward Email bruker hjelpefunksjonene `isCodeBug` og `isTimeoutError` for å sikre at hvis det oppstår database-tilkoblingsproblemer, DNS-nettverks-/blokklistproblemer eller oppstrøms tilkoblingsproblemer, returnerer systemet 421 SMTP-statuskoder for å sikre at e-poster blir forsøkt sendt på nytt senere i stedet for å gå tapt eller eksponeres.

Implementasjonsdetaljer:

* Feilklassifisering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout-feilhåndtering i MX-behandling: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Hvem har tilgang til e-postinfrastrukturen din {#who-has-access-to-your-email-infrastructure}

Forward Email implementerer omfattende tilgangskontroller for sitt minimale ingeniørteam på 2-3 personer med strenge 2FA-krav:

* **Rollebasert tilgangskontroll**: For teamkontoer med ressursbaserte tillatelser
* **Prinsippet om minste privilegium**: Anvendt i alle systemer
* **Segregering av oppgaver**: Mellom operative roller
* **Brukeradministrasjon**: Separate deploy- og devops-brukere med distinkte tillatelser
* **Root-innlogging deaktivert**: Tvinger tilgang gjennom korrekt autentiserte kontoer
* **Streng 2FA**: Ingen SMS-basert 2FA på grunn av risiko for MiTM-angrep – kun app-basert eller hardware-token
* **Omfattende revisjonslogging**: Med sensur av sensitiv data
* **Automatisk anomalioppdagelse**: For uvanlige tilgangsmønstre
* **Regelmessige sikkerhetsgjennomganger**: Av tilgangslogger
* **Forebygging av Evil Maid-angrep**: USB-lagring deaktivert og andre fysiske sikkerhetstiltak
Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisasjonskontroller)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Nettverkssikkerhet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Forebygging av ond tjeners angrep)

### Hvilke infrastrukturleverandører bruker du {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email bruker flere infrastrukturunderleverandører med omfattende samsvarsertifiseringer.

Fullstendige detaljer er tilgjengelige på vår GDPR-samsvarsside: <https://forwardemail.net/gdpr>

**Primære infrastrukturunderleverandører:**

| Leverandør       | Sertifisert for rammeverk for datavern | GDPR-samsvarsside                                                                       |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Ja                                  | <https://www.cloudflare.com/trust-hub/gdpr/>                                            |
| **DataPacket**   | ❌ Nei                                 | <https://www.datapacket.com/privacy-policy>                                             |
| **DigitalOcean** | ❌ Nei                                 | <https://www.digitalocean.com/legal/gdpr>                                               |
| **GitHub**       | ✅ Ja                                  | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Nei                                 | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                         |

**Detaljerte sertifiseringer:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (revidert av Schellman & Company LLC)
* ISO 27001-sertifisert ved flere datasentre
* PCI-DSS-kompatibel
* CSA STAR nivå 1-sertifisert
* APEC CBPR PRP-sertifisert
* Detaljer: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) sertifisert
* PCI Merchant-kompatibel
* CSA STAR nivå 1-sertifisert
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaljer: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2-kompatibel (kontakt DataPacket direkte for å få sertifisering)
* Infrastruktur i bedriftsklasse (Denver-lokasjon)
* DDoS-beskyttelse gjennom Shield cybersikkerhetsstabel
* Teknisk støtte 24/7
* Globalt nettverk med 58 datasentre
* Detaljer: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Sertifisert for rammeverk for datavern (EU-USA, Sveits-USA og UK-utvidelse)
* Vert for kildekode, CI/CD og prosjektstyring
* GitHub Data Protection Agreement tilgjengelig
* Detaljer: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Betalingsprosessorer:**

* **Stripe**: Sertifisert for rammeverk for datavern - <https://stripe.com/legal/privacy-center>
* **PayPal**: Ikke DPF-sertifisert - <https://www.paypal.com/uk/legalhub/privacy-full>

### Tilbyr dere en databehandleravtale (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email tilbyr en omfattende databehandleravtale (DPA) som kan signeres sammen med vår bedriftsavtale. En kopi av vår DPA er tilgjengelig på: <https://forwardemail.net/dpa>

**DPA-detaljer:**

* Dekker GDPR-samsvar og EU-US/Sveits-US Privacy Shield-rammeverk
* Aksepteres automatisk ved godkjenning av våre bruksvilkår
* Ingen separat signatur kreves for standard DPA
* Tilpassede DPA-avtaler tilgjengelig gjennom Enterprise-lisens

**GDPR-samsvarsrammeverk:**
Vår DPA beskriver samsvar med GDPR samt internasjonale krav til dataoverføring. Fullstendig informasjon er tilgjengelig på: <https://forwardemail.net/gdpr>

For bedriftskunder som krever tilpassede DPA-vilkår eller spesifikke kontraktsmessige ordninger, kan dette håndteres gjennom vårt **Enterprise License ($250/month)**-program.

### Hvordan håndterer dere varsler om datainnbrudd {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Emails null-kunnskapsarkitektur begrenser betydelig virkningen av brudd.
* **Begrenset dataeksponering**: Kan ikke få tilgang til kryptert e-postinnhold på grunn av null-kunnskapsarkitektur
* **Minimal datainnsamling**: Kun grunnleggende abonnentinformasjon og begrensede IP-logger for sikkerhet
* **Underleverandør-rammeverk**: DigitalOcean, GitHub og Vultr opprettholder GDPR-kompatible hendelsesresponsprosedyrer

**GDPR-representantinformasjon:**
Forward Email har utnevnt GDPR-representanter i samsvar med artikkel 27:

**EU-representant:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**UK-representant:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

For bedriftskunder som krever spesifikke varslingstjenestenivåavtaler (SLA) ved brudd, bør disse diskuteres som en del av en **Enterprise License**-avtale.

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Tilbyr dere et testmiljø {#do-you-offer-a-test-environment}

Forward Emails tekniske dokumentasjon beskriver ikke eksplisitt en dedikert sandkassemodus. Mulige testtilnærminger inkluderer imidlertid:

* **Egenhosting-alternativ**: Omfattende egenhostingmuligheter for å opprette testmiljøer
* **API-grensesnitt**: Mulighet for programmatisk testing av konfigurasjoner
* **Åpen kildekode**: 100 % åpen kildekode lar kunder undersøke videresendingslogikken
* **Flere domener**: Støtte for flere domener kan muliggjøre opprettelse av testdomener

For bedriftskunder som krever formelle sandkassefunksjoner, bør dette diskuteres som en del av en **Enterprise License**-avtale.

Kilde: <https://github.com/forwardemail/forwardemail.net> (Utviklingsmiljødetaljer)

### Tilbyr dere overvåkings- og varslingsverktøy {#do-you-provide-monitoring-and-alerting-tools}

Forward Email tilbyr sanntidsovervåking med noen begrensninger:

**Tilgjengelig:**

* **Sanntidsovervåking av levering**: Offentlig synlige ytelsesmetrikker for store e-postleverandører
* **Automatisk varsling**: Ingeniørteam varsles når leveringstider overstiger 10 sekunder
* **Transparent overvåking**: 100 % åpen kildekode overvåkingssystemer
* **Infrastruktur-overvåking**: Automatisk anomalioppdagelse og omfattende revisjonslogging

**Begrensninger:**

* Kundevendte webhooks eller API-baserte leveringsstatusvarsler er ikke eksplisitt dokumentert

For bedriftskunder som krever detaljerte leveringsstatus-webhooks eller tilpassede overvåkingsintegrasjoner, kan disse funksjonene være tilgjengelige gjennom **Enterprise License**-avtaler.

Kilder:

* <https://forwardemail.net> (Sanntidsovervåkingsvisning)
* <https://github.com/forwardemail/forwardemail.net> (Overvåkingsimplementasjon)

### Hvordan sikrer dere høy tilgjengelighet {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementerer omfattende redundans på tvers av flere infrastrukturleverandører.

* **Distribuert infrastruktur**: Flere leverandører (DigitalOcean, Vultr, DataPacket) på tvers av geografiske regioner
* **Geografisk lastbalansering**: Cloudflare-basert geo-lokalisert lastbalansering med automatisk failover
* **Automatisk skalering**: Dynamisk ressursjustering basert på etterspørsel
* **Flerlags DDoS-beskyttelse**: Gjennom DataPackets Shield-system og Cloudflare
* **Serverredundans**: Flere servere per region med automatisk failover
* **Database-replikasjon**: Sanntidssynkronisering av data på tvers av flere lokasjoner
* **Overvåking og varsling**: 24/7 overvåking med automatisk hendelsesrespons

**Oppetidsgaranti**: 99,9 %+ tjenestetilgjengelighet med transparent overvåking tilgjengelig på <https://forwardemail.net>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Er dere i samsvar med seksjon 889 i National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email er fullt ut i samsvar med seksjon 889 gjennom nøye utvalg av infrastrukturpartnere.

Ja, Forward Email er **seksjon 889-kompatibel**. Seksjon 889 i National Defense Authorization Act (NDAA) forbyr offentlige etater å bruke eller inngå kontrakter med enheter som bruker telekommunikasjons- og videoovervåkingsutstyr fra spesifikke selskaper (Huawei, ZTE, Hikvision, Dahua og Hytera).
**Hvordan Forward Email oppnår samsvar med Seksjon 889:**

Forward Email er avhengig utelukkende av to sentrale infrastrukturleverandører, ingen av dem bruker utstyr som er forbudt under Seksjon 889:

1. **Cloudflare**: Vår primære partner for nettverkstjenester og e-postsikkerhet
2. **DataPacket**: Vår primære leverandør for serverinfrastruktur (bruker utelukkende Arista Networks og Cisco-utstyr)
3. **Backup-leverandører**: Våre backup-leverandører Digital Ocean og Vultr er i tillegg bekreftet skriftlig som samsvarende med Seksjon 889.

**Cloudflares forpliktelse**: Cloudflare oppgir eksplisitt i sin tredjepartskodeks at de ikke bruker telekommunikasjonsutstyr, videoovervåkningsprodukter eller tjenester fra noen enheter som er forbudt under Seksjon 889.

**Brukstilfelle for myndigheter**: Vår samsvar med Seksjon 889 ble validert da **US Naval Academy** valgte Forward Email for deres sikre e-postvideresending, som krevde dokumentasjon på våre føderale samsvarsstandarder.

For fullstendige detaljer om vår myndighetssamsvarsramme, inkludert bredere føderale forskrifter, les vår omfattende casestudie: [Føderal myndighets e-posttjeneste Seksjon 889 samsvarende](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## System- og tekniske detaljer {#system-and-technical-details}

### Lagrer dere e-poster og innholdet i dem {#do-you-store-emails-and-their-contents}

Nei, vi skriver ikke til disk eller lagrer logger – med [unntak av feil](#do-you-store-error-logs) og [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Personvernerklæring](/privacy)).

Alt gjøres i minnet og [vår kildekode er på GitHub](https://github.com/forwardemail).

### Hvordan fungerer e-postvideresendingssystemet deres {#how-does-your-email-forwarding-system-work}

E-post er avhengig av [SMTP-protokollen](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Denne protokollen består av kommandoer sendt til en server (som oftest kjører på port 25). Det er en innledende tilkobling, deretter angir avsender hvem e-posten er fra ("MAIL FROM"), etterfulgt av hvor den skal til ("RCPT TO"), og til slutt headerne og selve e-postens innhold ("DATA"). Flyten i vårt e-postvideresendingssystem beskrives i forhold til hver SMTP-protokollkommando nedenfor:

* Innledende tilkobling (ingen kommando, f.eks. `telnet example.com 25`) – Dette er den innledende tilkoblingen. Vi sjekker avsendere som ikke er på vår [tillatliste](#do-you-have-an-allowlist) mot vår [blokkliste](#do-you-have-a-denylist). Til slutt, hvis en avsender ikke er på tillatlisten, sjekker vi om de er [grålistet](#do-you-have-a-greylist).

* `HELO` – Dette indikerer en hilsen for å identifisere avsenderens FQDN, IP-adresse eller mailhandler-navn. Denne verdien kan forfalskes, så vi stoler ikke på denne informasjonen, men bruker i stedet omvendt vertsnavnsoppslag av tilkoblingens IP-adresse.

* `MAIL FROM` – Dette angir konvoluttens avsenderadresse for e-posten. Hvis en verdi oppgis, må det være en gyldig RFC 5322 e-postadresse. Tomme verdier er tillatt. Vi [sjekker for backscatter](#how-do-you-protect-against-backscatter) her, og vi sjekker også MAIL FROM mot vår [blokkliste](#do-you-have-a-denylist). Til slutt sjekker vi avsendere som ikke er på tillatlisten for hastighetsbegrensning (se seksjonen om [Rate Limiting](#do-you-have-rate-limiting) og [tillatliste](#do-you-have-an-allowlist) for mer informasjon).

* `RCPT TO` – Dette angir mottaker(e) av e-posten. Disse må være gyldige RFC 5322 e-postadresser. Vi tillater kun opptil 50 konvoluttmottakere per melding (dette er forskjellig fra "Til"-headeren i en e-post). Vi sjekker også for en gyldig [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-adresse her for å beskytte mot forfalskning med vårt SRS-domene.

* `DATA` – Dette er kjernen i vår tjeneste som behandler en e-post. Se seksjonen [Hvordan behandler dere en e-post for videresending](#how-do-you-process-an-email-for-forwarding) nedenfor for mer innsikt.
### Hvordan behandler du en e-post for videresending {#how-do-you-process-an-email-for-forwarding}

Denne seksjonen beskriver vår prosess knyttet til SMTP-protokollkommandoen `DATA` i seksjonen [Hvordan fungerer e-postvideresendingssystemet ditt](#how-does-your-email-forwarding-system-work) ovenfor – det er hvordan vi behandler en e-posts overskrifter, innhold, sikkerhet, bestemmer hvor den må leveres, og hvordan vi håndterer tilkoblinger.

1. Hvis meldingen overskrider maksimal størrelse på 50mb, blir den avvist med feilkode 552.

2. Hvis meldingen ikke inneholdt en "From"-overskrift, eller hvis noen av verdiene i "From"-overskriften ikke var gyldige RFC 5322 e-postadresser, blir den avvist med feilkode 550.

3. Hvis meldingen hadde mer enn 25 "Received"-overskrifter, ble det bestemt at den hadde satt seg fast i en omdirigeringssløyfe, og den blir avvist med feilkode 550.

4. Ved å bruke e-postens fingeravtrykk (se seksjonen om [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), vil vi sjekke om meldingen har blitt forsøkt sendt på nytt i mer enn 5 dager (som samsvarer med [standard postfix-adferd](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), og hvis så er tilfelle, blir den avvist med feilkode 550.

5. Vi lagrer i minnet resultatene fra skanning av e-posten ved bruk av [Spam Scanner](https://spamscanner.net).

6. Hvis det var noen vilkårlige resultater fra Spam Scanner, blir den avvist med feilkode 554. Vilkårlige resultater inkluderer kun GTUBE-testen på tidspunktet for denne skrivingen. Se <https://spamassassin.apache.org/gtube/> for mer innsikt.

7. Vi legger til følgende overskrifter i meldingen for feilsøking og misbruksforebygging:

   * `Received` - vi legger til denne standard Received-overskriften med opprinnelses-IP og vert, overføringstype, TLS-tilkoblingsinformasjon, dato/tid, og mottaker.
   * `X-Original-To` - den opprinnelige mottakeren for meldingen:
     * Dette er nyttig for å bestemme hvor en e-post opprinnelig ble levert (i tillegg til "Received"-overskriften).
     * Dette legges til per mottaker ved tidspunktet for IMAP og/eller maskert videresending (for å beskytte personvern).
   * `X-Forward-Email-Website` - inneholder en lenke til vårt nettsted <https://forwardemail.net>
   * `X-Forward-Email-Version` - den nåværende [SemVer](https://semver.org/) versjonen fra `package.json` i vår kodebase.
   * `X-Forward-Email-Session-ID` - en sesjons-ID-verdi brukt til feilsøking (gjelder kun i ikke-produksjonsmiljøer).
   * `X-Forward-Email-Sender` - en kommaseparert liste som inneholder den opprinnelige konvoluttens MAIL FROM-adresse (hvis den ikke var tom), den omvendte PTR-klientens FQDN (hvis den finnes), og avsenderens IP-adresse.
   * `X-Forward-Email-ID` - dette gjelder kun for utgående SMTP og korrelerer til e-post-ID lagret i Min Konto → E-poster
   * `X-Report-Abuse` - med verdien `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - med verdien `abuse@forwardemail.net`.
   * `X-Complaints-To` - med verdien `abuse@forwardemail.net`.

8. Vi sjekker deretter meldingen for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), og [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Hvis meldingen feilet DMARC og domenet hadde en avvisningspolicy (f.eks. `p=reject` [var i DMARC-policyen](https://wikipedia.org/wiki/DMARC)), blir den avvist med feilkode 550. Vanligvis kan en DMARC-policy for et domene finnes i `_dmarc` subdomenets <strong class="notranslate">TXT</strong>-post, (f.eks. `dig _dmarc.example.com txt`).
   * Hvis meldingen feilet SPF og domenet hadde en hard feil-policy (f.eks. `-all` var i SPF-policyen i motsetning til `~all` eller ingen policy i det hele tatt), blir den avvist med feilkode 550. Vanligvis kan en SPF-policy for et domene finnes i <strong class="notranslate">TXT</strong>-posten for rotdomenet (f.eks. `dig example.com txt`). Se denne seksjonen for mer informasjon om [å sende e-post som med Gmail](#can-i-send-mail-as-in-gmail-with-this) angående SPF.
9. Nå behandler vi mottakerne av meldingen som er samlet inn fra `RCPT TO`-kommandoen i seksjonen [Hvordan fungerer e-postvideresendingssystemet ditt](#how-does-your-email-forwarding-system-work) ovenfor. For hver mottaker utfører vi følgende operasjoner:

   * Vi slår opp <strong class="notranslate">TXT</strong>-postene til domenenavnet (delen etter `@`-symbolet, f.eks. `example.com` hvis e-postadressen var `test@example.com`). For eksempel, hvis domenet er `example.com`, gjør vi et DNS-oppslag som `dig example.com txt`.
   * Vi analyserer alle <strong class="notranslate">TXT</strong>-poster som starter med enten `forward-email=` (gratisplaner) eller `forward-email-site-verification=` (betalte planer). Merk at vi analyserer begge for å kunne behandle e-poster mens en bruker oppgraderer eller nedgraderer planer.
   * Fra disse analyserte <strong class="notranslate">TXT</strong>-postene går vi gjennom dem for å hente videresendingskonfigurasjonen (som beskrevet i seksjonen [Hvordan kommer jeg i gang og setter opp e-postvideresending](#how-do-i-get-started-and-set-up-email-forwarding) ovenfor). Merk at vi kun støtter én `forward-email-site-verification=`-verdi, og hvis mer enn én oppgis, vil en 550-feil oppstå og avsenderen vil motta en avvisning for denne mottakeren.
   * Rekursivt går vi gjennom den hentede videresendingskonfigurasjonen for å bestemme global videresending, regex-basert videresending og alle andre støttede videresendingskonfigurasjoner – som nå er kjent som våre "Videresendingsadresser".
   * For hver Videresendingsadresse støtter vi ett rekursivt oppslag (som vil starte denne serien av operasjoner på den gitte adressen). Hvis et rekursivt treff ble funnet, vil foreldreresultatet bli fjernet fra Videresendingsadresser, og barna lagt til.
   * Videresendingsadresser blir analysert for unikhet (siden vi ikke ønsker å sende duplikater til én adresse eller opprette unødvendige ekstra SMTP-klienttilkoblinger).
   * For hver Videresendingsadresse slår vi opp domenenavnet mot vårt API-endepunkt `/v1/max-forwarded-addresses` (for å avgjøre hvor mange adresser domenet har lov til å videresende e-post til per alias, f.eks. 10 som standard – se seksjonen om [maksgrense for videresending per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Hvis denne grensen overskrides, vil en 550-feil oppstå og avsenderen vil motta en avvisning for denne mottakeren.
   * Vi slår opp innstillingene til den opprinnelige mottakeren mot vårt API-endepunkt `/v1/settings`, som støtter oppslag for betalende brukere (med fallback for gratisbrukere). Dette returnerer et konfigurasjonsobjekt for avanserte innstillinger for `port` (Nummer, f.eks. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), og `has_virus_protection` (Boolean).
   * Basert på disse innstillingene sjekker vi deretter mot Spam Scanner-resultater, og hvis noen feil oppstår, blir meldingen avvist med en 554-feilkode (f.eks. hvis `has_virus_protection` er aktivert, vil vi sjekke Spam Scanner-resultatene for virus). Merk at alle brukere på gratisplan automatisk er med på sjekker mot vokseninnhold, phishing, kjørbare filer og virus. Som standard er alle betalende brukere også med, men denne konfigurasjonen kan endres under Innstillinger-siden for et domene i Forward Email-dashboardet).

10. For hver behandlede mottakers Videresendingsadresser utfører vi deretter følgende operasjoner:

    * Adressen sjekkes mot vår [denylist](#do-you-have-a-denylist), og hvis den er oppført, vil en 421-feilkode oppstå (indikerer til avsender at de bør prøve igjen senere).
    * Hvis adressen er en webhook, setter vi en Boolean for fremtidige operasjoner (se nedenfor – vi grupperer sammen lignende webhooks for å gjøre én POST-forespørsel i stedet for flere ved levering).
    * Hvis adressen er en e-postadresse, analyserer vi verten for fremtidige operasjoner (se nedenfor – vi grupperer sammen lignende verter for å opprette én tilkobling i stedet for flere individuelle tilkoblinger ved levering).
11. Hvis det ikke er noen mottakere og det ikke er noen avvisninger, svarer vi med en 550-feil med meldingen "Ugyldige mottakere".

12. Hvis det er mottakere, går vi gjennom dem (gruppert etter samme vert) og leverer e-postene. Se seksjonen [Hvordan håndterer dere problemer med e-postlevering](#how-do-you-handle-email-delivery-issues) nedenfor for mer innsikt.

    * Hvis det oppstår feil under sending av e-post, lagrer vi dem i minnet for senere behandling.
    * Vi tar den laveste feilkoden (hvis noen) fra sendingen av e-post – og bruker den som svarstatuskode på `DATA`-kommandoen. Dette betyr at e-poster som ikke ble levert vanligvis vil bli forsøkt sendt på nytt av den opprinnelige avsenderen, mens e-poster som allerede ble levert ikke vil bli sendt på nytt neste gang meldingen sendes (da vi bruker [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Hvis ingen feil oppstod, sender vi en 250 vellykket SMTP-svarstatuskode.
    * En avvisning defineres som ethvert leveringsforsøk som resulterer i en statuskode som er >= 500 (permanente feil).

13. Hvis det ikke oppstod noen avvisninger (permanente feil), returnerer vi en SMTP-svarstatuskode med den laveste feilkoden fra ikke-permanente feil (eller en 250 vellykket statuskode hvis det ikke var noen).

14. Hvis det oppstod avvisninger, sender vi avvisnings-e-poster i bakgrunnen etter å ha returnert den laveste av alle feilkodene til avsenderen. Hvis den laveste feilkoden er >= 500, sender vi imidlertid ingen avvisnings-e-poster. Dette er fordi hvis vi gjorde det, ville avsendere motta en dobbel avvisnings-e-post (f.eks. en fra deres utgående MTA, som Gmail – og også en fra oss). Se seksjonen om [Hvordan beskytter dere mot backscatter](#how-do-you-protect-against-backscatter) nedenfor for mer innsikt.

### Hvordan håndterer dere problemer med e-postlevering {#how-do-you-handle-email-delivery-issues}

Merk at vi gjør en "Friendly-From"-omskriving på e-postene kun hvis DMARC-policyen til avsenderen ikke besto OG ingen DKIM-signaturer var justert med "From"-headeren. Dette betyr at vi endrer "From"-headeren i meldingen, setter "X-Original-From", og også setter en "Reply-To" hvis den ikke allerede var satt. Vi forsegler også ARC-forseglingen på meldingen på nytt etter å ha endret disse headerne.

Vi bruker også smart-parsing av feilmeldinger på alle nivåer i vår stack – i vår kode, DNS-forespørsler, Node.js-internals, HTTP-forespørsler (f.eks. 408, 413 og 429 mappes til SMTP-svarkode 421 hvis mottakeren er en webhook), og svar fra e-postservere (f.eks. svar med "defer" eller "slowdown" vil bli forsøkt på nytt som 421-feil).

Vår logikk er idiot-sikker og vil også prøve på nytt ved SSL/TLS-feil, tilkoblingsproblemer og mer. Målet med idiot-sikring er å maksimere leveringsdyktigheten til alle mottakere for en videresendingskonfigurasjon.

Hvis mottakeren er en webhook, tillater vi en 60 sekunders timeout for at forespørselen skal fullføres med opptil 3 forsøk (altså 4 forespørsler totalt før en feil). Merk at vi korrekt parser feilkodene 408, 413 og 429 og mapper dem til SMTP-svarkode 421.

Hvis mottakeren derimot er en e-postadresse, forsøker vi å sende e-posten med opportunistisk TLS (vi forsøker å bruke STARTTLS hvis det er tilgjengelig på mottakerens e-postserver). Hvis det oppstår en SSL/TLS-feil under sendingen, forsøker vi å sende e-posten uten TLS (uten å bruke STARTTLS).

Hvis det oppstår DNS- eller tilkoblingsfeil, returnerer vi en SMTP-svarkode 421 til `DATA`-kommandoen, ellers hvis det er >= 500-nivå feil, vil avvisninger bli sendt.

Hvis vi oppdager at en e-postserver vi forsøker å levere til har blokkert en eller flere av våre mail exchange IP-adresser (f.eks. ved hjelp av hvilken som helst teknologi de bruker for å utsette spammere), sender vi en SMTP-svarkode 421 slik at avsenderen kan prøve meldingen på nytt senere (og vi blir varslet om problemet slik at vi forhåpentligvis kan løse det før neste forsøk).

### Hvordan håndterer dere at IP-adressene deres blir blokkert {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Vi overvåker rutinemessig alle større DNS-blokklister, og hvis noen av våre mail exchange ("MX") IP-adresser er oppført i en større blokkliste, vil vi trekke den ut av den relevante DNS A-postens rundtur hvis mulig inntil problemet er løst.

På tidspunktet for denne skrivingen er vi også oppført i flere DNS-tillatelister, og vi tar overvåkning av blokklister på alvor. Hvis du ser noen problemer før vi har mulighet til å løse dem, vennligst gi oss beskjed skriftlig på <support@forwardemail.net>.

Våre IP-adresser er offentlig tilgjengelige, [se denne seksjonen nedenfor for mer innsikt](#what-are-your-servers-ip-addresses).

### Hva er postmaster-adresser {#what-are-postmaster-addresses}

For å forhindre feilrettede avvisninger og sending av feriesvarmeldinger til uovervåkede eller ikke-eksisterende postbokser, opprettholder vi en liste over mailer-daemon-lignende brukernavn:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [og enhver no-reply-adresse](#what-are-no-reply-addresses)

Se [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) for mer innsikt i hvordan lister som disse brukes for å skape effektive e-postsystemer.

### Hva er no-reply-adresser {#what-are-no-reply-addresses}

E-postbrukernavn som er lik noen av følgende (case-insensitivt) anses som no-reply-adresser:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Denne listen vedlikeholdes [som et åpen kildekode-prosjekt på GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Hva er IP-adressene til serveren din {#what-are-your-servers-ip-addresses}

Vi publiserer våre IP-adresser på <https://forwardemail.net/ips>.

### Har dere en tillatelsesliste {#do-you-have-an-allowlist}

Ja, vi har en [liste over domenenavnutvidelser](#what-domain-name-extensions-are-allowlisted-by-default) som er tillatt som standard og en dynamisk, bufret og rullerende tillatelsesliste basert på [strenge kriterier](#what-is-your-allowlist-criteria).

Alle domener, e-poster og IP-adresser brukt av betalende kunder sjekkes automatisk mot vår blokkliste hver time – noe som varsler administratorer som kan gripe inn manuelt om nødvendig.

I tillegg, hvis et av dine domener eller dets e-postadresser er blokkert (f.eks. for sending av spam, virus eller på grunn av etterligningsangrep) – vil domenets administratorer (deg) og våre teamadministratorer bli varslet umiddelbart via e-post. Vi anbefaler sterkt at du [konfigurerer DMARC](#how-do-i-set-up-dmarc-for-forward-email) for å forhindre dette.

### Hvilke domenenavnutvidelser er tillatt som standard {#what-domain-name-extensions-are-allowlisted-by-default}

Følgende domenenavnutvidelser anses som tillatt som standard (uavhengig av om de er på Umbrella Popularity List eller ikke):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
I tillegg er disse [merkevare- og bedrifts-toppnivådomener](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) som standard på hvitelisten (f.eks. `apple` for `applecard.apple` for Apple Card bankutskrifter):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
Fra og med 18. mars 2025 har vi også lagt til disse franske oversjøiske territoriene i denne listen ([ifølge denne GitHub-forespørselen](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Fra og med 8. juli 2025 har vi lagt til disse Europa-spesifikke landene:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

I oktober 2025 har vi også lagt til <code class="notranslate">cz</code> (Tsjekkia) på grunn av etterspørsel.

Vi inkluderte bevisst ikke `ru` og `ua` på grunn av høy spamaktivitet.

### Hva er dine kriterier for tillatelseslisten {#what-is-your-allowlist-criteria}

Vi har en statisk liste over [domeneendelser som er tillatt som standard](#what-domain-name-extensions-are-allowlisted-by-default) – og vi opprettholder også en dynamisk, bufret, rullerende tillatelsesliste basert på følgende strenge kriterier:

* Avsenderens rot-domene må være av en [domeneendelse som samsvarer med listen vi tilbyr på vår gratisplan](#what-domain-name-extensions-can-be-used-for-free) (med tillegg av `biz` og `info`). Vi inkluderer også delvise treff for `edu`, `gov` og `mil`, slik som `xyz.gov.au` og `xyz.edu.au`.
* Avsenderens rot-domene må være innenfor topp 100 000 unike rot-domener i de analyserte resultatene fra [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Avsenderens rot-domene må være innenfor topp 50 000 resultater fra unike rot-domener som har dukket opp i minst 4 av de siste 7 dagene i UPL (ca. 50 %+).
* Avsenderens rot-domene må ikke være [kategorisert](https://radar.cloudflare.com/categorization-feedback/) som vokseninnhold eller malware av Cloudflare.
* Avsenderens rot-domene må ha enten A- eller MX-poster satt.
* Avsenderens rot-domene må ha enten A-poster, MX-poster, DMARC-post med `p=reject` eller `p=quarantine`, eller en SPF-post med `-all` eller `~all` kvalifikator.

Hvis disse kriteriene er oppfylt, vil avsenderens rot-domene bli bufret i 7 dager. Merk at vår automatiserte jobb kjører daglig – derfor er dette en rullerende tillatelsesliste som oppdateres daglig.

Vår automatiserte jobb laster ned de siste 7 dagene av UPL i minnet, pakker dem ut, og analyserer deretter i minnet i henhold til de strenge kriteriene ovenfor.

Populære domener på tidspunktet for denne skrivingen som Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify og flere – er selvfølgelig inkludert.
Hvis du er en avsender som ikke er på vår tillatte liste, vil du første gang ditt FQDN-rotdomene eller IP-adresse sender en e-post, bli [ratebegrenset](#do-you-have-rate-limiting) og [grålistet](#do-you-have-a-greylist). Merk at dette er standard praksis som er vedtatt som en e-poststandard. De fleste e-postserverklienter vil forsøke å sende på nytt hvis de mottar en ratebegrensnings- eller grålistefeil (f.eks. en 421- eller 4xx-feilkode).

**Merk at spesifikke avsendere som `a@gmail.com`, `b@xyz.edu` og `c@gov.au` fortsatt kan bli [avvist](#do-you-have-a-denylist)** (f.eks. hvis vi automatisk oppdager spam, phishing eller skadelig programvare fra disse avsenderne).

### Hvilke domenenavnutvidelser kan brukes gratis {#what-domain-name-extensions-can-be-used-for-free}

Fra og med 31. mars 2023 håndhevet vi en ny generell spamregel for å beskytte våre brukere og tjenesten vår.

Denne nye regelen tillater kun følgende domenenavnutvidelser å brukes på vår gratisplan:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Har du en gråliste {#do-you-have-a-greylist}

Ja, vi har en veldig lempelig [e-post grålisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) policy i bruk. Grålisting gjelder kun for avsendere som ikke er på vår tillatelsesliste og varer i vår cache i 30 dager.

For enhver ny avsender lagrer vi en nøkkel i vår Redis-database i 30 dager med en verdi satt til den første ankomsttiden for deres første forespørsel. Vi avviser deretter e-posten deres med en retry statuskode 450 og tillater den kun å passere når 5 minutter har gått.

Hvis de har ventet i 5 minutter fra denne første ankomsttiden, vil e-postene deres bli akseptert og de vil ikke motta denne 450 statuskoden.

Nøkkelen består av enten FQDN rot-domenet eller avsenderens IP-adresse. Dette betyr at ethvert subdomene som passerer grålisten også vil passere for rotdomenet, og omvendt (dette er hva vi mener med en "veldig lempelig" policy).

For eksempel, hvis en e-post kommer fra `test.example.com` før vi ser en e-post fra `example.com`, må enhver e-post fra `test.example.com` og/eller `example.com` vente 5 minutter fra den første ankomsttiden for tilkoblingen. Vi får ikke både `test.example.com` og `example.com` til å vente sine egne 5-minutters perioder (vår grålistingspolicy gjelder på rotdomenenivå).

Merk at grålisting ikke gjelder for noen avsender på vår [tillatelsesliste](#do-you-have-an-allowlist) (f.eks. Meta, Amazon, Netflix, Google, Microsoft på tidspunktet for denne skrivingen).

### Har du en nekteliste {#do-you-have-a-denylist}

Ja, vi driver vår egen nekteliste og oppdaterer den automatisk i sanntid og manuelt basert på spam og ondsinnet aktivitet som oppdages.

Vi henter også alle IP-adresser fra UCEPROTECT Level 1 nekteliste på <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> hver time og legger dem inn i vår nekteliste med en utløpstid på 7 dager.

Avsendere som finnes i nektelisten vil motta en 421 feilkode (indikerer til avsender å prøve igjen senere) hvis de [ikke er på tillatelseslisten](#do-you-have-an-allowlist).

Ved å bruke en 421 statuskode i stedet for en 554 statuskode, kan potensielle falske positiver avhjelpes i sanntid, og meldingen kan deretter leveres vellykket ved neste forsøk.

**Dette er designet ulikt andre e-posttjenester**, hvor hvis du blir satt på en blokkering, oppstår en hard og permanent feil. Det er ofte vanskelig å be avsendere om å prøve meldinger på nytt (spesielt fra store organisasjoner), og derfor gir denne tilnærmingen omtrent 5 dager fra første e-postforsøk for enten avsender, mottaker eller oss til å gripe inn og løse problemet (ved å be om fjerning fra nektelisten).

Alle forespørsler om fjerning fra nektelisten overvåkes i sanntid av administratorer (f.eks. slik at gjentakende falske positiver kan permanent legges til på tillatelseslisten av administratorer).

Forespørsler om fjerning fra nektelisten kan sendes inn på <https://forwardemail.net/denylist>. Betalte brukere får sine forespørsler om fjerning fra nektelisten behandlet umiddelbart, mens ikke-betalende brukere må vente på at administratorer behandler forespørselen.

Avsendere som oppdages å sende spam eller virusinnhold vil bli lagt til nektelisten etter følgende fremgangsmåte:

1. Det [opprinnelige meldingens fingeravtrykk](#how-do-you-determine-an-email-fingerprint) blir grålistet ved påvisning av spam eller blokkering fra en "pålitelig" avsender (f.eks. `gmail.com`, `microsoft.com`, `apple.com`).
   * Hvis avsenderen var på tillatelseslisten, blir meldingen grålistet i 1 time.
   * Hvis avsenderen ikke er på tillatelseslisten, blir meldingen grålistet i 6 timer.
2. Vi analyserer nekteliste-nøkler fra informasjon fra avsender og melding, og for hver av disse nøklene oppretter vi (hvis den ikke allerede finnes) en teller, øker den med 1, og cacher den i 24 timer.
   * For avsendere på tillatelseslisten:
     * Legg til en nøkkel for konvoluttens "MAIL FROM" e-postadresse hvis den hadde bestått SPF eller ingen SPF, og den ikke var [en postmester-bruker](#what-are-postmaster-addresses) eller [en no-reply-bruker](#what-are-no-reply-addresses).
     * Hvis "From"-headeren var på tillatelseslisten, legg til en nøkkel for "From"-headerens e-postadresse hvis den hadde bestått SPF eller bestått og justert DKIM.
     * Hvis "From"-headeren ikke var på tillatelseslisten, legg til en nøkkel for "From"-headerens e-postadresse og dens rot-parsede domenenavn.
   * For avsendere som ikke er på tillatelseslisten:
     * Legg til en nøkkel for konvoluttens "MAIL FROM" e-postadresse hvis den hadde bestått SPF.
     * Hvis "From"-headeren var på tillatelseslisten, legg til en nøkkel for "From"-headerens e-postadresse hvis den hadde bestått SPF eller bestått og justert DKIM.
     * Hvis "From"-headeren ikke var på tillatelseslisten, legg til en nøkkel for "From"-headerens e-postadresse og dens rot-parsede domenenavn.
     * Legg til en nøkkel for avsenderens eksterne IP-adresse.
     * Legg til en nøkkel for klientens oppslåtte vertsnavn ved omvendt oppslag fra avsenderens IP-adresse (hvis noen).
     * Legg til en nøkkel for rotdomenet til klientens oppslåtte vertsnavn (hvis noen, og hvis det er forskjellig fra klientens oppslåtte vertsnavn).
3. Hvis telleren når 5 for en ikke-tillatelseslistet avsender og nøkkel, blir nøkkelen nektet i 30 dager og en e-post sendes til vårt abuse-team. Disse tallene kan endres og oppdateringer vil bli reflektert her etter hvert som vi overvåker misbruk.
4. Hvis telleren når 10 for en tillatelseslistet avsender og nøkkel, blir nøkkelen nektet i 7 dager og en e-post sendes til vårt abuse-team. Disse tallene kan endres og oppdateringer vil bli reflektert her etter hvert som vi overvåker misbruk.
> **MERK:** I nær fremtid vil vi introdusere omdømmeovervåking. Omdømmeovervåking vil i stedet beregne når en avsender skal nektes basert på en prosentgrense (i motsetning til en enkel teller som nevnt ovenfor).

### Har dere hastighetsbegrensning {#do-you-have-rate-limiting}

Avsenderhastighetsbegrensning skjer enten basert på rot-domenet hentet fra en omvendt PTR-oppslag på avsenderens IP-adresse – eller hvis det ikke gir resultat, brukes avsenderens IP-adresse direkte. Merk at vi refererer til dette som `Sender` nedenfor.

Våre MX-servere har daglige grenser for innkommende e-post mottatt for [kryptert IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service):

* I stedet for å begrense innkommende e-post på individuell alias-basis (f.eks. `you@yourdomain.com`) – begrenser vi etter aliasets domenenavn (f.eks. `yourdomain.com`). Dette forhindrer at `Senders` oversvømmer innboksene til alle aliaser på domenet ditt samtidig.
* Vi har generelle grenser som gjelder for alle `Senders` på tvers av tjenesten vår uavhengig av mottaker:
  * `Senders` som vi anser som "pålitelig" som sannhetskilde (f.eks. `gmail.com`, `microsoft.com`, `apple.com`) er begrenset til å sende 100 GB per dag.
  * `Senders` som er [tillatelseslistet](#do-you-have-an-allowlist) er begrenset til å sende 10 GB per dag.
  * Alle andre `Senders` er begrenset til å sende 1 GB og/eller 1000 meldinger per dag.
* Vi har en spesifikk grense per `Sender` og `yourdomain.com` på 1 GB og/eller 1000 meldinger daglig.

MX-serverne begrenser også meldinger som videresendes til en eller flere mottakere gjennom hastighetsbegrensning – men dette gjelder kun `Senders` som ikke er på [tillatelseslisten](#do-you-have-an-allowlist):

* Vi tillater kun opptil 100 tilkoblinger per time, per `Sender` løst FQDN rot-domene (eller) `Sender` ekstern IP-adresse (hvis ingen omvendt PTR er tilgjengelig), og per konvoluttmottaker. Vi lagrer nøkkelen for hastighetsbegrensning som en kryptografisk hash i vår Redis-database.

* Hvis du sender e-post gjennom vårt system, vennligst sørg for at du har satt opp omvendt PTR for alle dine IP-adresser (ellers vil hver unike FQDN rot-domene eller IP-adresse du sender fra bli hastighetsbegrenset).

* Merk at hvis du sender gjennom et populært system som Amazon SES, vil du ikke bli hastighetsbegrenset siden (på tidspunktet for denne skrivingen) Amazon SES er oppført i vår tillatelsesliste.

* Hvis du sender fra et domene som `test.abc.123.example.com`, vil hastighetsbegrensningen bli pålagt `example.com`. Mange spammere bruker hundrevis av underdomener for å omgå vanlige spamfiltre som kun begrenser unike vertsnavn i stedet for unike FQDN rot-domener.

* `Senders` som overskrider hastighetsbegrensningen vil bli avvist med en 421-feil.

Våre IMAP- og SMTP-servere begrenser aliasene dine til ikke å ha mer enn `60` samtidige tilkoblinger samtidig.

Våre MX-servere begrenser [ikke-tillatelseslistede](#do-you-have-an-allowlist) sendere fra å etablere mer enn 10 samtidige tilkoblinger (med 3 minutters cache-utløp for telleren, som speiler vår socket timeout på 3 minutter).

### Hvordan beskytter dere mot backscatter {#how-do-you-protect-against-backscatter}

Feilrettede avvisninger eller avvisningsspam (kjent som "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") kan føre til negativt omdømme for avsender-IP-adresser.

Vi tar to steg for å beskytte mot backscatter, som er detaljert i de følgende seksjonene [Forhindre avvisninger fra kjente MAIL FROM-spammere](#prevent-bounces-from-known-mail-from-spammers) og [Forhindre unødvendige avvisninger for å beskytte mot backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) nedenfor.

### Forhindre avvisninger fra kjente MAIL FROM-spammere {#prevent-bounces-from-known-mail-from-spammers}

Vi henter listen fra [Backscatter.org](https://www.backscatterer.org/) (drevet av [UCEPROTECT](https://www.uceprotect.net/)) på <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> hver time og mater den inn i vår Redis-database (vi sammenligner også forskjellen på forhånd; i tilfelle noen IP-er ble fjernet som må respekteres).
Hvis MAIL FROM er tom ELLER er lik (case-insensitivt) noen av [postmesteradressene](#what-are-postmaster-addresses) (delen før @ i en e-post), sjekker vi om avsenderens IP samsvarer med en fra denne listen.

Hvis avsenderens IP er oppført (og ikke i vår [tillateliste](#do-you-have-an-allowlist)), sender vi en 554-feil med meldingen `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Vi vil bli varslet hvis en avsender er både på Backscatterer-listen og i vår tillateliste slik at vi kan løse problemet om nødvendig.

Teknikkene beskrevet i denne seksjonen følger "SAFE MODE"-anbefalingen på <https://www.backscatterer.org/?target=usage> – hvor vi kun sjekker avsender-IP hvis visse betingelser allerede er oppfylt.

### Forhindre unødvendige avvisninger for å beskytte mot backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Avvisninger er e-poster som indikerer at e-postvideresendingen fullstendig mislyktes til mottakeren og e-posten vil ikke bli forsøkt sendt på nytt.

En vanlig grunn til å bli oppført på Backscatterer-listen er feilrettede avvisninger eller avvisningsspam, så vi må beskytte mot dette på flere måter:

1. Vi sender kun når det oppstår >= 500 statuskodefeil (når e-poster som forsøkes videresendt har feilet, f.eks. Gmail svarer med en 500-nivå feil).

2. Vi sender kun én gang og kun én gang (vi bruker en kalkulert avvisningsfingeravtrykk-nøkkel og lagrer den i cache for å forhindre duplikater). Avvisningsfingeravtrykket er en nøkkel som er meldingens fingeravtrykk kombinert med en hash av avvisningsadressen og dens feilkode). Se seksjonen om [Fingerprinting](#how-do-you-determine-an-email-fingerprint) for mer innsikt i hvordan meldingens fingeravtrykk beregnes. Vellykket sendte avvisningsfingeravtrykk utløper etter 7 dager i vår Redis-cache.

3. Vi sender kun når MAIL FROM og/eller From ikke er tom og ikke inneholder (case-insensitivt) et [postmesterbrukernavn](#what-are-postmaster-addresses) (delen før @ i en e-post).

4. Vi sender ikke hvis den opprinnelige meldingen hadde noen av følgende headere (case-insensitivt):

   * Header `auto-submitted` med en verdi ulik `no`.
   * Header `x-auto-response-suppress` med verdi `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (uavhengig av verdi).
   * Header `precedence` med verdi `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

5. Vi sender ikke hvis MAIL FROM eller From e-postadresse slutter med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

6. Vi sender ikke hvis From e-postadresse brukernavnsdel var `mdaemon` og den hadde en case-insensitiv header `X-MDDSN-Message`.

7. Vi sender ikke hvis det var en case-insensitiv `content-type` header med verdi `multipart/report`.

### Hvordan bestemmer dere et e-postfingeravtrykk {#how-do-you-determine-an-email-fingerprint}

Et e-postfingeravtrykk brukes for å bestemme unikheten til en e-post og for å forhindre at duplikatmeldinger blir levert og [duplikatavvisninger](#prevent-unnecessary-bounces-to-protect-against-backscatter) blir sendt.

Fingeravtrykket beregnes ut fra følgende liste:

* Klientens oppløste FQDN vertsnavn eller IP-adresse
* `Message-ID` headerverdi (hvis noen)
* `Date` headerverdi (hvis noen)
* `From` headerverdi (hvis noen)
* `To` headerverdi (hvis noen)
* `Cc` headerverdi (hvis noen)
* `Subject` headerverdi (hvis noen)
* `Body` verdi (hvis noen)

### Kan jeg videresende e-poster til porter andre enn 25 (f.eks. hvis min ISP har blokkert port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, fra og med 5. mai 2020 har vi lagt til denne funksjonen. Akkurat nå er funksjonen domenespesifikk, i motsetning til alias-spesifikk. Hvis du trenger at den skal være alias-spesifikk, vennligst kontakt oss for å informere om dine behov.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Forbedret personvern:
  </strong>
  <span>
    Hvis du er på en betalt plan (som har forbedret personvern), vennligst gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a>, klikk på "Oppsett" ved siden av ditt domene, og deretter klikk på "Innstillinger". Hvis du ønsker å lære mer om betalte planer, se vår <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prisside</a>. Ellers kan du fortsette å følge instruksjonene nedenfor.
  </span>
</div>
Hvis du er på gratisplanen, legger du ganske enkelt til en ny DNS <strong class="notranslate">TXT</strong>-post som vist nedenfor, men endrer porten fra 25 til den porten du ønsker.

For eksempel, hvis jeg vil at alle e-poster som går til `example.com` skal videresendes til alias-mottakeres SMTP-port 1337 i stedet for 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
    Det vanligste scenariet for tilpasset portvideresending er når du vil videresende alle e-poster som går til example.com til en annen port på example.com, enn SMTP-standarden port 25. For å sette opp dette, legger du ganske enkelt til følgende <strong class="notranslate">TXT</strong> catch-all-post.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Støtter det plusstegnet + for Gmail-aliaser {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absolutt.

### Støtter det underdomener {#does-it-support-sub-domains}

Ja, absolutt. I stedet for å bruke "@", ".", eller tomt som navn/vert/alias, bruker du bare underdomenavnet som verdi i stedet.

Hvis du vil at `foo.example.com` skal videresende e-poster, skriver du inn `foo` som navn/vert/alias-verdi i DNS-innstillingene dine (for både MX- og <strong class="notranslate">TXT</strong>-poster).

### Videresender dette e-postens overskrifter {#does-this-forward-my-emails-headers}

Ja, absolutt.

### Er dette godt testet {#is-this-well-tested}

Ja, det har tester skrevet med [ava](https://github.com/avajs/ava) og har også kode-dekning.

### Sender dere videre SMTP-responsmeldinger og -koder {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolutt. For eksempel, hvis du sender en e-post til `hello@example.com` og den er registrert for å videresende til `user@gmail.com`, vil SMTP-responsmeldingen og koden fra "gmail.com" SMTP-serveren bli returnert i stedet for proxy-serveren på "mx1.forwardemail.net" eller "mx2.forwardemail.net".

### Hvordan forhindrer dere spammere og sikrer god e-postvideresendingsomdømme {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Se våre seksjoner om [Hvordan fungerer e-postvideresendingssystemet deres](#how-does-your-email-forwarding-system-work), [Hvordan håndterer dere leveringsproblemer med e-post](#how-do-you-handle-email-delivery-issues), og [Hvordan håndterer dere at IP-adressene deres blir blokkert](#how-do-you-handle-your-ip-addresses-becoming-blocked) ovenfor.

### Hvordan utfører dere DNS-oppslag på domenenavn {#how-do-you-perform-dns-lookups-on-domain-names}

Vi har laget et åpen kildekode-programvareprosjekt :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) og bruker det til DNS-oppslag. Standard DNS-servere som brukes er `1.1.1.1` og `1.0.0.1`, og DNS-forespørsler går gjennom [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikasjonslaget.

:tangerine: [Tangerine](https://github.com/tangerine) bruker [CloudFlares personvern-første forbruker-DNS-tjeneste som standard][cloudflare-dns].


## Konto og fakturering {#account-and-billing}

### Tilbyr dere pengene tilbake-garanti på betalte planer {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatiske refusjoner skjer når du oppgraderer, nedgraderer eller kansellerer kontoen din innen 30 dager fra planen startet. Dette gjelder kun for førstegangskunder.
### Hvis jeg bytter planer, pro-rater dere og refunderer differansen {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Vi pro-rater ikke og refunderer ikke differansen når du bytter planer. I stedet konverterer vi den gjenværende varigheten fra utløpsdatoen for din eksisterende plan til den nærmeste relative varigheten for din nye plan (avrundet ned til måned).

Merk at hvis du oppgraderer eller nedgraderer mellom betalte planer innen en 30-dagers periode siden du først startet en betalt plan, vil vi automatisk refundere hele beløpet fra din eksisterende plan.

### Kan jeg bare bruke denne e-postvideresendingstjenesten som en "fallback" eller "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nei, det anbefales ikke, da du kun kan bruke én mail exchange-server om gangen. Fallbacks blir vanligvis aldri forsøkt på nytt på grunn av prioriteringsfeilkonfigurasjoner og mailservere som ikke respekterer MX exchange-prioritetskontroll.

### Kan jeg deaktivere spesifikke aliaser {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du er på en betalt plan, må du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Rediger alias <i class="fa fa-angle-right"></i> Fjern merket for "Aktiv" <i class="fa fa-angle-right"></i> Fortsett.
  </span>
</div>

Ja, rediger ganske enkelt din DNS <strong class="notranslate">TXT</strong>-post og prefiks aliaset med enten ett, to eller tre utropstegn (se nedenfor).

Merk at du *bør* bevare ":"-mappingen, da dette er nødvendig hvis du noen gang bestemmer deg for å slå dette av igjen (og det brukes også ved import hvis du oppgraderer til en av våre betalte planer).

**For stille avvisning (ser ut for avsender som om meldingen ble sendt vellykket, men går faktisk ingen steder) (statuskode `250`):** Hvis du prefikser et alias med "!" (enkelt utropstegn), vil det returnere en vellykket statuskode `250` til avsendere som prøver å sende til denne adressen, men e-postene vil ikke komme fram (f.eks. et svart hull eller `/dev/null`).

**For myk avvisning (statuskode `421`):** Hvis du prefikser et alias med "!!" (dobbelt utropstegn), vil det returnere en myk feilkode `421` til avsendere som prøver å sende til denne adressen, og e-postene vil ofte bli forsøkt sendt på nytt i opptil 5 dager før avvisning og retur.

**For hard avvisning (statuskode `550`):** Hvis du prefikser et alias med "!!!" (trippelt utropstegn), vil det returnere en permanent feilkode `550` til avsendere som prøver å sende til denne adressen, og e-postene vil bli avvist og returnert.

For eksempel, hvis jeg vil at alle e-poster som går til `alias@example.com` skal slutte å flyte videre til `user@gmail.com` og bli avvist og returnert (f.eks. bruk tre utropstegn):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Du kan også omskrive den videresendte mottakerens adresse til rett og slett "nobody@forwardemail.net", som vil rute den til nobody som i eksemplet nedenfor.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Hvis du ønsker økt sikkerhet, kan du også fjerne delen ":user@gmail.com" (eller ":nobody@forwardemail.net"), slik at det bare står "!!!alias" som i eksemplet nedenfor.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Kan jeg videresende e-poster til flere mottakere {#can-i-forward-emails-to-multiple-recipients}

Ja, absolutt. Bare spesifiser flere mottakere i dine <strong class="notranslate">TXT</strong>-poster.

For eksempel, hvis jeg vil at en e-post som går til `hello@example.com` skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, vil min <strong class="notranslate">TXT</strong>-post se slik ut:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Eller, du kan spesifisere dem i to separate linjer, slik som dette:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Det er opp til deg!

### Kan jeg ha flere globale catch-all mottakere {#can-i-have-multiple-global-catch-all-recipients}

Ja, det kan du. Bare spesifiser flere globale catch-all mottakere i dine <strong class="notranslate">TXT</strong>-poster.

For eksempel, hvis jeg vil at hver e-post som går til `*@example.com` (stjernen betyr at det er en jokertegn, altså catch-all) skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, vil min <strong class="notranslate">TXT</strong>-post se slik ut:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Eller, du kan spesifisere dem i to separate linjer, slik som dette:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vert/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Verdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", eller tomt</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Det er opp til deg!

### Finnes det en maksimal grense for antall e-postadresser jeg kan videresende til per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, standardgrensen er 10. Dette betyr IKKE at du bare kan ha 10 aliaser på domenet ditt. Du kan ha så mange aliaser du vil (et ubegrenset antall). Det betyr at du bare kan videresende ett alias til 10 unike e-postadresser. Du kan ha `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (fra 1-10) – og alle e-poster til `hello@example.com` vil bli videresendt til `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (fra 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tips:
  </strong>
  <span>
    Trenger du mer enn 10 mottakere per alias? Send oss en e-post, så øker vi gjerne grensen på kontoen din.
  </span>
</div>

### Kan jeg videresende e-poster rekursivt {#can-i-recursively-forward-emails}

Ja, det kan du, men du må fortsatt overholde maksimalgrensen. Hvis du har `hello:linus@example.com` og `linus:user@gmail.com`, vil e-poster til `hello@example.com` bli videresendt til `linus@example.com` og `user@gmail.com`. Merk at det vil oppstå en feil hvis du prøver å videresende e-poster rekursivt utover maksimalgrensen.

### Kan folk avregistrere eller registrere min e-postvideresending uten min tillatelse {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Vi bruker MX- og <strong class="notranslate">TXT</strong>-postverifisering, så hvis du legger til denne tjenestens respektive MX- og <strong class="notranslate">TXT</strong>-poster, er du registrert. Hvis du fjerner dem, er du avregistrert. Du eier domenet ditt og DNS-administrasjonen, så hvis noen har tilgang til det, er det et problem.

### Hvordan er det gratis {#how-is-it-free}

Forward Email tilbyr et gratis nivå gjennom en kombinasjon av åpen kildekode-utvikling, effektiv infrastruktur og valgfrie betalte planer som støtter tjenesten.

Vårt gratisnivå støttes av:

1. **Åpen kildekode-utvikling**: Vår kodebase er åpen kildekode, noe som tillater bidrag fra fellesskapet og transparent drift.

2. **Effektiv infrastruktur**: Vi har optimalisert systemene våre for å håndtere e-postvideresending med minimale ressurser.

3. **Betalte premiumplaner**: Brukere som trenger ekstra funksjoner som SMTP-sending, IMAP-mottak eller forbedrede personvernvalg abonnerer på våre betalte planer.

4. **Rimelige bruksgrenser**: Gratisnivået har rettferdige bruksregler for å forhindre misbruk.

> \[!NOTE]
> Vi er forpliktet til å holde grunnleggende e-postvideresending gratis samtidig som vi tilbyr premiumfunksjoner for brukere med mer avanserte behov.

> \[!TIP]
> Hvis du synes tjenesten vår er verdifull, vurder å oppgradere til en betalt plan for å støtte kontinuerlig utvikling og vedlikehold.

### Hva er maksimal e-poststørrelsesgrense {#what-is-the-max-email-size-limit}

Vi har som standard en grense på 50MB, som inkluderer innhold, overskrifter og vedlegg. Merk at tjenester som Gmail og Outlook kun tillater en grense på 25MB, og hvis du overskrider denne grensen når du sender til adresser hos disse leverandørene, vil du motta en feilmelding.

En feil med riktig responskode returneres hvis filstørrelsesgrensen overskrides.

### Lagrer dere logger av e-poster {#do-you-store-logs-of-emails}

Nei, vi skriver ikke til disk eller lagrer logger – med [unntak av feil](#do-you-store-error-logs) og [utgående SMTP](#do-you-support-sending-email-with-smtp) (se vår [Personvernpolicy](/privacy)).

Alt gjøres i minnet, og [vår kildekode er på GitHub](https://github.com/forwardemail).

### Lagrer dere feillogger {#do-you-store-error-logs}

**Ja. Du kan få tilgang til feillogger under [Min konto → Logger](/my-account/logs) eller [Min konto → Domener](/my-account/domains).**

Fra og med februar 2023 lagrer vi feillogger for `4xx` og `5xx` SMTP-responskoder i en periode på 7 dager – som inneholder SMTP-feilen, konvolutten og e-postoverskriftene (vi **lagrer ikke** e-postens innhold eller vedlegg).
Feillogger lar deg sjekke etter manglende viktige e-poster og redusere falske positive spam for [dine domener](/my-account/domains). De er også en flott ressurs for feilsøking av problemer med [e-post webhooks](#do-you-support-webhooks) (siden feilloggene inneholder webhook-endepunktets respons).

Feillogger for [ratebegrensning](#do-you-have-rate-limiting) og [greylisting](#do-you-have-a-greylist) er ikke tilgjengelige siden tilkoblingen avsluttes tidlig (f.eks. før `RCPT TO` og `MAIL FROM`-kommandoer kan sendes).

Se vår [Personvernerklæring](/privacy) for mer innsikt.

### Leser dere e-postene mine {#do-you-read-my-emails}

Nei, absolutt ikke. Se vår [Personvernerklæring](/privacy).

Mange andre e-postvideresendingstjenester lagrer og kan potensielt lese e-posten din. Det er ingen grunn til at videresendte e-poster må lagres på disk – derfor har vi utviklet den første åpen kildekode-løsningen som gjør alt i minnet.

Vi mener du skal ha rett til privatliv, og vi respekterer det strengt. Koden som kjøres på serveren er [åpen kildekode på GitHub](https://github.com/forwardemail) for åpenhet og for å bygge tillit.

### Kan jeg "sende e-post som" i Gmail med dette {#can-i-send-mail-as-in-gmail-with-this}

Ja! Fra og med 2. oktober 2018 har vi lagt til denne funksjonen. Se [Hvordan sende e-post som ved bruk av Gmail](#how-to-send-mail-as-using-gmail) ovenfor!

Du bør også sette SPF-posten for Gmail i DNS-konfigurasjonen din som en <strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du bruker Gmail (f.eks. Send Mail As) eller G Suite, må du legge til <code>include:_spf.google.com</code> i SPF-<strong class="notranslate">TXT</strong>-posten din, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Kan jeg "sende e-post som" i Outlook med dette {#can-i-send-mail-as-in-outlook-with-this}

Ja! Fra og med 2. oktober 2018 har vi lagt til denne funksjonen. Se disse to lenkene fra Microsoft nedenfor:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Du bør også sette SPF-posten for Outlook i DNS-konfigurasjonen din som en <strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Viktig:
  </strong>
  <span>
    Hvis du bruker Microsoft Outlook eller Live.com, må du legge til <code>include:spf.protection.outlook.com</code> i SPF-<strong class="notranslate">TXT</strong>-posten din, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Kan jeg "sende e-post som" i Apple Mail og iCloud Mail med dette {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Hvis du er abonnent på iCloud+, kan du bruke et egendefinert domene. [Vår tjeneste er også kompatibel med Apple Mail](#apple-mail).

Se <https://support.apple.com/en-us/102540> for mer informasjon.

### Kan jeg videresende ubegrenset med dette {#can-i-forward-unlimited-emails-with-this}

Ja, men "relativt ukjente" avsendere er begrenset til 100 tilkoblinger per time per vertsnavn eller IP. Se seksjonen om [Ratebegrensning](#do-you-have-rate-limiting) og [Greylisting](#do-you-have-a-greylist) ovenfor.

Med "relativt ukjente" mener vi avsendere som ikke finnes i [tillatelisten](#do-you-have-an-allowlist).

Hvis denne grensen overskrides, sender vi en 421-responskode som forteller avsenderens mailserver å prøve igjen senere.

### Tilbyr dere ubegrensede domener for én pris {#do-you-offer-unlimited-domains-for-one-price}

Ja. Uansett hvilken plan du har, betaler du kun én månedlig pris – som dekker alle dine domener.
### Hvilke betalingsmetoder godtar dere {#which-payment-methods-do-you-accept}

Forward Email godtar følgende engangs- eller månedlige/kvartalsvise/årlige betalingsmetoder:

1. **Kreditt-/Debetkort/Bankoverføringer**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, osv.
2. **PayPal**: Koble til PayPal-kontoen din for enkle betalinger
3. **Kryptovaluta**: Vi godtar betalinger via Stripes stablecoin-betalinger på Ethereum-, Polygon- og Solana-nettverkene

> \[!NOTE]
> Vi lagrer begrenset betalingsinformasjon på våre servere, som kun inkluderer betalingsidentifikatorer og referanser til [Stripe](https://stripe.com/global) og [PayPal](https://www.paypal.com) transaksjons-, kunde-, abonnement- og betalings-ID'er.

> \[!TIP]
> For maksimal personvern, vurder å bruke kryptovalutabetalinger.

Alle betalinger behandles sikkert gjennom Stripe eller PayPal. Dine betalingsdetaljer lagres aldri på våre servere.


## Ytterligere ressurser {#additional-resources}

> \[!TIP]
> Våre artikler nedenfor oppdateres jevnlig med nye guider, tips og teknisk informasjon. Sjekk tilbake ofte for det nyeste innholdet.

* [Case-studier og utviklerdokumentasjon](/blog/docs)
* [Ressurser](/resources)
* [Guider](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
