# Ofte Stillede Spørgsmål {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email frequently asked questions" class="rounded-lg" />


## Indholdsfortegnelse {#table-of-contents}

* [Hurtig Start](#quick-start)
* [Introduktion](#introduction)
  * [Hvad er Forward Email](#what-is-forward-email)
  * [Hvem bruger Forward Email](#who-uses-forward-email)
  * [Hvad er Forward Emails historie](#what-is-forward-emails-history)
  * [Hvor hurtigt er denne tjeneste](#how-fast-is-this-service)
* [Email-klienter](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobile Enheder](#mobile-devices)
  * [Sendmail SMTP Relay Konfiguration](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay Konfiguration](#exim4-smtp-relay-configuration)
  * [msmtp SMTP Client Konfiguration](#msmtp-smtp-client-configuration)
  * [Kommandolinje Email-klienter](#command-line-email-clients)
  * [Windows Email Konfiguration](#windows-email-configuration)
  * [Postfix SMTP Relay Konfiguration](#postfix-smtp-relay-configuration)
  * [Hvordan sender jeg mail som ved brug af Gmail](#how-to-send-mail-as-using-gmail)
  * [Hvad er den gamle gratis guide til Send Mail As ved brug af Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Avanceret Gmail Routing Konfiguration](#advanced-gmail-routing-configuration)
  * [Avanceret Outlook Routing Konfiguration](#advanced-outlook-routing-configuration)
* [Fejlfinding](#troubleshooting)
  * [Hvorfor modtager jeg ikke mine testemails](#why-am-i-not-receiving-my-test-emails)
  * [Hvordan konfigurerer jeg min email-klient til at arbejde med Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Hvorfor lander mine emails i Spam og Junk, og hvordan kan jeg tjekke mit domænes omdømme](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Hvad skal jeg gøre, hvis jeg modtager spamemails](#what-should-i-do-if-i-receive-spam-emails)
  * [Hvorfor vises mine testemails sendt til mig selv i Gmail som "mistænkelige"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan jeg fjerne via forwardemail dot net i Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datahåndtering](#data-management)
  * [Hvor er jeres servere placeret](#where-are-your-servers-located)
  * [Hvordan eksporterer og sikkerhedskopierer jeg min postkasse](#how-do-i-export-and-backup-my-mailbox)
  * [Hvordan importerer og migrerer jeg min eksisterende postkasse](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Hvordan bruger jeg min egen S3-kompatible lagerplads til sikkerhedskopier](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Hvordan konverterer jeg SQLite-sikkerhedskopier til EML-filer](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Understøtter I selvhosting](#do-you-support-self-hosting)
* [Email Konfiguration](#email-configuration)
  * [Hvordan kommer jeg i gang og opsætter email videresendelse](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan jeg bruge flere MX-udvekslinger og servere til avanceret videresendelse](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hvordan opsætter jeg en ferieautomatisk svar (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hvordan opsætter jeg SPF for Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Hvordan opsætter jeg DKIM for Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Hvordan opsætter jeg DMARC for Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hvordan ser jeg DMARC-rapporter](#how-do-i-view-dmarc-reports)
  * [Hvordan forbinder og konfigurerer jeg mine kontakter](#how-do-i-connect-and-configure-my-contacts)
  * [Hvordan forbinder og konfigurerer jeg mine kalendere](#how-do-i-connect-and-configure-my-calendars)
  * [Hvordan tilføjer jeg flere kalendere og administrerer eksisterende kalendere](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hvordan forbinder og konfigurerer jeg opgaver og påmindelser](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Hvorfor kan jeg ikke oprette opgaver i macOS Påmindelser](#why-cant-i-create-tasks-in-macos-reminders)
  * [Hvordan opsætter jeg Tasks.org på Android](#how-do-i-set-up-tasksorg-on-android)
  * [Hvordan opsætter jeg SRS for Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Hvordan opsætter jeg MTA-STS for Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hvordan tilføjer jeg et profilbillede til min emailadresse](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Avancerede Funktioner](#advanced-features)
  * [Understøtter I nyhedsbreve eller mailinglister til markedsføringsrelateret email](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Understøtter I at sende email med API](#do-you-support-sending-email-with-api)
  * [Understøtter I at modtage email med IMAP](#do-you-support-receiving-email-with-imap)
  * [Understøtter I POP3](#do-you-support-pop3)
  * [Understøtter I kalendere (CalDAV)](#do-you-support-calendars-caldav)
  * [Understøtter I opgaver og påmindelser (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Understøtter I kontakter (CardDAV)](#do-you-support-contacts-carddav)
  * [Understøtter I at sende email med SMTP](#do-you-support-sending-email-with-smtp)
  * [Understøtter I OpenPGP/MIME, end-to-end kryptering ("E2EE") og Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Understøtter I S/MIME kryptering](#do-you-support-smime-encryption)
  * [Understøtter I Sieve email filtrering](#do-you-support-sieve-email-filtering)
  * [Understøtter I MTA-STS](#do-you-support-mta-sts)
  * [Understøtter I passkeys og WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Understøtter I email bedste praksis](#do-you-support-email-best-practices)
  * [Understøtter I bounce webhooks](#do-you-support-bounce-webhooks)
  * [Understøtter I webhooks](#do-you-support-webhooks)
  * [Understøtter I regulære udtryk eller regex](#do-you-support-regular-expressions-or-regex)
  * [Hvad er jeres udgående SMTP-grænser](#what-are-your-outbound-smtp-limits)
  * [Skal jeg have godkendelse for at aktivere SMTP](#do-i-need-approval-to-enable-smtp)
  * [Hvad er jeres SMTP server konfigurationsindstillinger](#what-are-your-smtp-server-configuration-settings)
  * [Hvad er jeres IMAP server konfigurationsindstillinger](#what-are-your-imap-server-configuration-settings)
  * [Hvad er jeres POP3 server konfigurationsindstillinger](#what-are-your-pop3-server-configuration-settings)
  * [Hvordan opsætter jeg email autodiscovery for mit domæne](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Sikkerhed](#security-1)
  * [Avancerede serverhærde teknikker](#advanced-server-hardening-techniques)
  * [Har I SOC 2 eller ISO 27001 certificeringer](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Bruger I TLS kryptering til email videresendelse](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bevarer I email autentificeringsheaders](#do-you-preserve-email-authentication-headers)
  * [Bevarer I originale email headers og forhindrer spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hvordan beskytter I mod spam og misbrug](#how-do-you-protect-against-spam-and-abuse)
  * [Gemmer I email indhold på disk](#do-you-store-email-content-on-disk)
  * [Kan email indhold blive eksponeret under systemnedbrud](#can-email-content-be-exposed-during-system-crashes)
  * [Hvem har adgang til jeres email infrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Hvilke infrastrukturudbydere bruger I](#what-infrastructure-providers-do-you-use)
  * [Tilbyder I en databehandleraftale (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hvordan håndterer I databrudsmeddelelser](#how-do-you-handle-data-breach-notifications)
  * [Tilbyder I et testmiljø](#do-you-offer-a-test-environment)
  * [Tilbyder I overvågnings- og alarmeringsværktøjer](#do-you-provide-monitoring-and-alerting-tools)
  * [Hvordan sikrer I høj tilgængelighed](#how-do-you-ensure-high-availability)
  * [Er I compliant med Section 889 af National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- og Tekniske Detaljer](#system-and-technical-details)
  * [Gemmer I emails og deres indhold](#do-you-store-emails-and-their-contents)
  * [Hvordan fungerer jeres email videresendelsessystem](#how-does-your-email-forwarding-system-work)
  * [Hvordan behandler I en email til videresendelse](#how-do-you-process-an-email-for-forwarding)
  * [Hvordan håndterer I email leveringsproblemer](#how-do-you-handle-email-delivery-issues)
  * [Hvordan håndterer I, at jeres IP-adresser bliver blokeret](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Hvad er postmaster-adresser](#what-are-postmaster-addresses)
  * [Hvad er no-reply-adresser](#what-are-no-reply-addresses)
  * [Hvad er jeres servers IP-adresser](#what-are-your-servers-ip-addresses)
  * [Har I en tilladelsesliste](#do-you-have-an-allowlist)
  * [Hvilke domæneendelser er som standard tilladte](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Hvad er jeres kriterier for tilladelseslisten](#what-is-your-allowlist-criteria)
  * [Hvilke domæneendelser kan bruges gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Har I en gråliste](#do-you-have-a-greylist)
  * [Har I en afvisningsliste](#do-you-have-a-denylist)
  * [Har I ratebegrænsning](#do-you-have-rate-limiting)
  * [Hvordan beskytter I mod backscatter](#how-do-you-protect-against-backscatter)
  * [Forhindre afvisninger fra kendte MAIL FROM spammere](#prevent-bounces-from-known-mail-from-spammers)
  * [Forhindre unødvendige afvisninger for at beskytte mod backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hvordan bestemmer I et email fingeraftryk](#how-do-you-determine-an-email-fingerprint)
  * [Kan jeg videresende emails til porte andre end 25 (f.eks. hvis min ISP har blokeret port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Understøtter det plus + symbolet for Gmail aliaser](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Understøtter det subdomæner](#does-it-support-sub-domains)
  * [Videresender dette mine emails headers](#does-this-forward-my-emails-headers)
  * [Er dette veltestet](#is-this-well-tested)
  * [Videregiver I SMTP svarbeskeder og koder](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hvordan forhindrer I spammere og sikrer godt email videresendelsesomdømme](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hvordan udfører I DNS opslag på domænenavne](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto og Fakturering](#account-and-billing)
  * [Tilbyder I pengene tilbage garanti på betalte planer](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Hvis jeg skifter planer, pro-rater og refunderer I forskellen](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan jeg bare bruge denne email videresendelsestjeneste som en "fallback" eller "fallover" MX-server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan jeg deaktivere specifikke aliaser](#can-i-disable-specific-aliases)
  * [Kan jeg videresende emails til flere modtagere](#can-i-forward-emails-to-multiple-recipients)
  * [Kan jeg have flere globale catch-all modtagere](#can-i-have-multiple-global-catch-all-recipients)
  * [Er der en maksimal grænse for antallet af emailadresser, jeg kan videresende til pr. alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan jeg videresende emails rekursivt](#can-i-recursively-forward-emails)
  * [Kan folk afmelde eller tilmelde min email videresendelse uden min tilladelse](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hvordan er det gratis](#how-is-it-free)
  * [Hvad er den maksimale emailstørrelsesgrænse](#what-is-the-max-email-size-limit)
  * [Gemmer I logs af emails](#do-you-store-logs-of-emails)
  * [Gemmer I fejl-logs](#do-you-store-error-logs)
  * [Læser I mine emails](#do-you-read-my-emails)
  * [Kan jeg "sende mail som" i Gmail med dette](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan jeg "sende mail som" i Outlook med dette](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan jeg "sende mail som" i Apple Mail og iCloud Mail med dette](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan jeg videresende ubegrænsede emails med dette](#can-i-forward-unlimited-emails-with-this)
  * [Tilbyder I ubegrænsede domæner for én pris](#do-you-offer-unlimited-domains-for-one-price)
  * [Hvilke betalingsmetoder accepterer I](#which-payment-methods-do-you-accept)
* [Yderligere Ressourcer](#additional-resources)
## Kom godt i gang {#quick-start}

For at komme i gang med Forward Email:

1. **Opret en konto** på [forwardemail.net/register](https://forwardemail.net/register)

2. **Tilføj og verificer dit domæne** under [Min konto → Domæner](/my-account/domains)

3. **Tilføj og konfigurer e-mail aliaser/postkasser** under [Min konto → Domæner](/my-account/domains) → Aliaser

4. **Test din opsætning** ved at sende en e-mail til et af dine nye aliaser

> \[!TIP]
> DNS-ændringer kan tage op til 24-48 timer at propagere globalt, selvom de ofte træder i kraft meget hurtigere.

> \[!VIGTIGT]
> For forbedret leveringssikkerhed anbefaler vi at opsætte [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) og [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.


## Introduktion {#introduction}

### Hvad er Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email er perfekt til enkeltpersoner, små virksomheder og udviklere, der ønsker professionelle e-mailadresser uden omkostningerne og vedligeholdelsen af en fuld e-mailhosting-løsning.

Forward Email er en **fuldt udstyret e-mailtjenesteudbyder** og **e-mailhosting-udbyder for brugerdefinerede domænenavne**.

Det er den eneste gratis og open source-tjeneste, som lader dig bruge brugerdefinerede domæne-e-mailadresser uden kompleksiteten ved at opsætte og vedligeholde din egen e-mailserver.

Vores tjeneste videresender e-mails sendt til dit brugerdefinerede domæne til din eksisterende e-mailkonto – og du kan endda bruge os som din dedikerede e-mailhosting-udbyder.

Nøglefunktioner i Forward Email:

* **Brugerdefineret domæne-e-mail**: Brug professionelle e-mailadresser med dit eget domænenavn
* **Gratis niveau**: Grundlæggende e-mailvideresendelse uden omkostninger
* **Forbedret privatliv**: Vi læser ikke dine e-mails eller sælger dine data
* **Open Source**: Hele vores kodebase er tilgængelig på GitHub
* **SMTP, IMAP og POP3 support**: Fuld e-mail afsendelses- og modtagelsesfunktionalitet
* **End-to-End kryptering**: Support for OpenPGP/MIME
* **Brugerdefinerede catch-all aliaser**: Opret ubegrænsede e-mailaliaser

Du kan sammenligne os med 56+ andre e-mailtjenesteudbydere på [vores Email Comparison side](/blog/best-email-service).

> \[!TIP]
> Lær mere om Forward Email ved at læse vores gratis [Tekniske Whitepaper](/technical-whitepaper.pdf)

### Hvem bruger Forward Email {#who-uses-forward-email}

Vi leverer e-mailhosting og e-mailvideresendelsestjeneste til 500.000+ domæner og disse bemærkelsesværdige brugere:

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
### Hvad er Forward Emails historie {#what-is-forward-emails-history}

Du kan lære mere om Forward Email på [vores Om-side](/about).

### Hvor hurtigt er denne tjeneste {#how-fast-is-this-service}

> \[!NOTE]
> Vores system er designet til hastighed og pålidelighed med flere redundante servere for at sikre, at dine e-mails leveres hurtigt.

Forward Email leverer beskeder med minimal forsinkelse, typisk inden for få sekunder efter modtagelse.

Ydelsesmålinger:

* **Gennemsnitlig leveringstid**: Mindre end 5-10 sekunder fra modtagelse til videresendelse ([se vores Time to Inbox "TTI" overvågningsside](/tti))
* **Oppetid**: 99,9%+ tjenestetilgængelighed
* **Global infrastruktur**: Servere strategisk placeret for optimal routing
* **Automatisk skalering**: Vores system skalerer under spidsbelastningsperioder for e-mails

Vi opererer i realtid, i modsætning til andre udbydere, der benytter forsinkede køer.

Vi skriver ikke til disk eller gemmer logs – med [undtagelse af fejl](#do-you-store-error-logs) og [udgående SMTP](#do-you-support-sending-email-with-smtp) (se vores [Privatlivspolitik](/privacy)).

Alt sker i hukommelsen, og [vores kildekode er på GitHub](https://github.com/forwardemail).


## E-mailklienter {#email-clients}

### Thunderbird {#thunderbird}

1. Opret et nyt alias og generer en adgangskode i dit Forward Email-dashboard
2. Åbn Thunderbird og gå til **Rediger → Konti → Kontohandlinger → Tilføj mailkonto**
3. Indtast dit navn, Forward Email-adresse og adgangskode
4. Klik på **Konfigurer manuelt** og indtast:
   * Indgående: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Udgående: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (anbefalet; port 587 med STARTTLS understøttes også)
5. Klik på **Færdig**

### Microsoft Outlook {#microsoft-outlook}

1. Opret et nyt alias og generer en adgangskode i dit Forward Email-dashboard
2. Gå til **Filer → Tilføj konto**
3. Indtast din Forward Email-adresse og klik på **Opret forbindelse**
4. Vælg **Avancerede indstillinger** og vælg **Lad mig opsætte min konto manuelt**
5. Vælg **IMAP** og indtast:
   * Indgående: `imap.forwardemail.net`, port 993, SSL
   * Udgående: `smtp.forwardemail.net`, port 465, SSL/TLS (anbefalet; port 587 med STARTTLS understøttes også)
   * Brugernavn: Din fulde e-mailadresse
   * Adgangskode: Din genererede adgangskode
6. Klik på **Opret forbindelse**

### Apple Mail {#apple-mail}

1. Opret et nyt alias og generer en adgangskode i dit Forward Email-dashboard
2. Gå til **Mail → Indstillinger → Konti → +**
3. Vælg **Anden mailkonto**
4. Indtast dit navn, Forward Email-adresse og adgangskode
5. For serverindstillinger, indtast:
   * Indgående: `imap.forwardemail.net`
   * Udgående: `smtp.forwardemail.net`
   * Brugernavn: Din fulde e-mailadresse
   * Adgangskode: Din genererede adgangskode
6. Klik på **Log ind**

### eM Client {#em-client}

1. Opret et nyt alias og generer en adgangskode i dit Forward Email-dashboard
2. Åbn eM Client og gå til **Menu → Konti → + Tilføj konto**
3. Klik på **Mail** og vælg derefter **Andet**
4. Indtast din Forward Email-adresse og klik på **Næste**
5. Indtast følgende serverindstillinger:
   * **Indgående server**: `imap.forwardemail.net`
   * **Udgående server**: `smtp.forwardemail.net`
6. Indtast din fulde e-mailadresse som **Brugernavn** og din genererede adgangskode som **Adgangskode** for både indgående og udgående servere.
7. eM Client tester forbindelsen. Når den er godkendt, klik på **Næste**.
8. Indtast dit navn og vælg et kontonavn.
9. Klik på **Afslut**.

### Mobile enheder {#mobile-devices}

For iOS:

1. Gå til **Indstillinger → Mail → Konti → Tilføj konto → Andet**
2. Tryk på **Tilføj mailkonto** og indtast dine oplysninger
3. For serverindstillinger, brug de samme IMAP- og SMTP-indstillinger som ovenfor

For Android:

1. Gå til **Indstillinger → Konti → Tilføj konto → Personlig (IMAP)**
2. Indtast din Forward Email-adresse og adgangskode
3. For serverindstillinger, brug de samme IMAP- og SMTP-indstillinger som ovenfor

### Sendmail SMTP Relay-konfiguration {#sendmail-smtp-relay-configuration}

Du kan konfigurere Sendmail til at videresende e-mails gennem Forward Emails SMTP-servere. Dette er en almindelig opsætning for ældre systemer eller applikationer, der er afhængige af Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Under 20 minutter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Dette kræver en betalt plan med SMTP-adgang aktiveret.
  </span>
</div>

#### Konfiguration {#configuration}

1. Rediger din `sendmail.mc` fil, som typisk findes i `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Tilføj følgende linjer for at definere smart host og autentificering:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Opret autentificeringsfilen `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Tilføj dine Forward Email legitimationsoplysninger til `authinfo` filen:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Generer autentificeringsdatabasen og sikr filerne:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Genopbyg Sendmail konfigurationen og genstart servicen:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Test {#testing}

Send en test-email for at verificere konfigurationen:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay Konfiguration {#exim4-smtp-relay-configuration}

Exim4 er en populær MTA på Debian-baserede systemer. Du kan konfigurere den til at bruge Forward Email som smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Under 15 minutter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Dette kræver en betalt plan med SMTP-adgang aktiveret.
  </span>
</div>

#### Konfiguration {#configuration-1}

1. Kør Exim4 konfigurationsværktøjet:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Vælg følgende muligheder:
   * **Generel type af mailkonfiguration:** mail sendt via smarthost; modtaget via SMTP eller fetchmail
   * **System mail navn:** your.hostname
   * **IP-adresser at lytte på for indkommende SMTP-forbindelser:** 127.0.0.1 ; ::1
   * **Andre destinationer som mail accepteres for:** (lad stå tomt)
   * **Domæner at videresende mail for:** (lad stå tomt)
   * **IP-adresse eller værtsnavn på den udgående smarthost:** smtp.forwardemail.net::465
   * **Skjul lokalt mailnavn i udgående mail?** Nej
   * **Hold antallet af DNS-forespørgsler minimale (Dial-on-Demand)?** Nej
   * **Leveringsmetode for lokal mail:** Mbox format i /var/mail/
   * **Opdel konfiguration i små filer?** Nej

3. Rediger `passwd.client` filen for at tilføje dine legitimationsoplysninger:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Tilføj følgende linje:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Opdater konfigurationen og genstart Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Test {#testing-1}

Send en test-email:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP Client Konfiguration {#msmtp-smtp-client-configuration}

msmtp er en letvægts SMTP-klient, som er nyttig til at sende emails fra scripts eller kommandolinjeapplikationer.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Under 10 minutter</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Dette kræver en betalt plan med SMTP-adgang aktiveret.
  </span>
</div>

#### Konfiguration {#configuration-2}

1. Opret eller rediger msmtp konfigurationsfilen på `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Tilføj følgende konfiguration:

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

3. Sæt de korrekte tilladelser for konfigurationsfilen:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Test {#testing-2}

Send en test-email:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Kommandolinje Email-klienter {#command-line-email-clients}

Populære kommandolinje email-klienter som [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), og [Alpine](https://alpine.x10.mx/alpine/release/) kan konfigureres til at bruge Forward Emails SMTP-servere til at sende mail. Konfigurationen vil være lignende `msmtp` opsætningen, hvor du angiver SMTP-server detaljer og dine legitimationsoplysninger i de respektive konfigurationsfiler (`.muttrc`, `.neomuttrc`, eller `.pinerc`).

### Windows Email Konfiguration {#windows-email-configuration}

For Windows-brugere kan du konfigurere populære email-klienter som **Microsoft Outlook** og **eM Client** ved hjælp af IMAP og SMTP indstillingerne, der er angivet i din Forward Email konto. Til kommandolinje- eller scriptingbrug kan du bruge PowerShells `Send-MailMessage` cmdlet (selvom den anses for forældet) eller et letvægts SMTP-relæ værktøj som [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP Relay Konfiguration {#postfix-smtp-relay-configuration}

Du kan konfigurere Postfix til at relæe emails gennem Forward Emails SMTP-servere. Dette er nyttigt for serverapplikationer, der skal sende emails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Under 15 minutter</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Dette kræver en betalt plan med SMTP-adgang aktiveret.
  </span>
</div>

#### Installation {#installation}

1. Installer Postfix på din server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Under installationen, vælg "Internet Site" når du bliver spurgt om konfigurationstype.

#### Konfiguration {#configuration-3}

1. Rediger hovedkonfigurationsfilen for Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Tilføj eller ændr disse indstillinger:

```
# SMTP relay konfiguration
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Opret SASL password-filen:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Tilføj dine Forward Email legitimationsoplysninger:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Sikr og hash password-filen:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Genstart Postfix:

```bash
sudo systemctl restart postfix
```

#### Test {#testing-3}

Test din konfiguration ved at sende en test-email:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Sådan sender du mail som ved brug af Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Mindre end 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kom godt i gang:
  </strong>
  <span>
    Hvis du har fulgt instruktionerne ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og opsætter videresendelse af e-mail</a>, kan du fortsætte med at læse nedenfor.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Sørg venligst for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Udgående SMTP-grænser</a> &ndash; din brug betragtes som anerkendelse og accept.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du er udvikler, henvises der til vores <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API-dokumentation</a>.
  </span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsinstruktionerne

2. Opret et nyt alias for dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser (f.eks. <code><hello@example.com></code>)

3. Klik på <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> ved siden af det nyligt oprettede alias. Kopiér til dit udklipsholder og gem sikkert den genererede adgangskode, der vises på skærmen.

4. Gå til [Gmail](https://gmail.com) og under [Indstillinger <i class="fa fa-angle-right"></i> Konti og import <i class="fa fa-angle-right"></i> Send mail som](https://mail.google.com/mail/u/0/#settings/accounts), klik på "Tilføj en anden e-mailadresse"

5. Når du bliver bedt om "Navn", indtast det navn, du ønsker, at din e-mail skal vises som "Fra" (f.eks. "Linus Torvalds").

6. Når du bliver bedt om "E-mailadresse", indtast den fulde e-mailadresse på et alias, du har oprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser (f.eks. <code><hello@example.com></code>)

7. Fjern markeringen i "Behandl som et alias"

8. Klik på "Næste trin" for at fortsætte

9. Når du bliver bedt om "SMTP-server", indtast <code>smtp.forwardemail.net</code> og ændr porten til <code>465</code>

10. Når du bliver bedt om "Brugernavn", indtast den fulde e-mailadresse på et alias, du har oprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser (f.eks. <code><hello@example.com></code>)

11. Når du bliver bedt om "Adgangskode", indsæt adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> i trin 3 ovenfor

12. Vælg radioknappen for "Sikret forbindelse ved hjælp af SSL"

13. Klik på "Tilføj konto" for at fortsætte

14. Åbn en ny fane til [Gmail](https://gmail.com) og vent på, at din bekræftelsesmail ankommer (du vil modtage en bekræftelseskode, der bekræfter, at du er ejer af den e-mailadresse, du forsøger at "Sende mail som")

15. Når den ankommer, kopier og indsæt bekræftelseskoden ved prompten, du modtog i det foregående trin
16. Når du har gjort det, skal du gå tilbage til e-mailen og klikke på linket for at "bekræfte anmodningen". Du skal sandsynligvis udføre dette trin og det foregående trin for, at e-mailen bliver korrekt konfigureret.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

</div>

### Hvad er den legacy gratis guide til Send Mail As ved brug af Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Vigtigt:</strong> Denne legacy gratis guide er forældet fra maj 2023, da <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">vi nu understøtter udgående SMTP</a>. Hvis du bruger guiden nedenfor, vil <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">det få din udgående e-mail</a> til at vise "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" i Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Mindre end 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kom godt i gang:
  </strong>
  <span>
    Hvis du har fulgt instruktionerne ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og opsætter e-mail videresendelse</a>, kan du fortsætte med at læse nedenfor.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Du skal have [Gmails tofaktorautentificering][gmail-2fa] aktiveret for at dette kan fungere. Besøg <https://www.google.com/landing/2step/> hvis du ikke har det aktiveret.

2. Når tofaktorautentificering er aktiveret (eller hvis du allerede havde det aktiveret), skal du besøge <https://myaccount.google.com/apppasswords>.

3. Når du bliver bedt om "Vælg app og enhed, du vil generere app-adgangskoden til":
   * Vælg "Mail" under dropdown-menuen for "Vælg app"
   * Vælg "Andet" under dropdown-menuen for "Vælg enhed"
   * Når du bliver bedt om tekstinput, indtast den e-mailadresse på dit brugerdefinerede domæne, som du videresender fra (f.eks. <code><hello@example.com></code> - dette hjælper dig med at holde styr, hvis du bruger denne tjeneste til flere konti)

4. Kopiér den adgangskode til udklipsholderen, som automatisk genereres
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vigtigt:
     </strong>
     <span>
       Hvis du bruger G Suite, skal du besøge din adminpanel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Indstillinger for Gmail <i class="fa fa-angle-right"></i> Indstillinger</a> og sørge for at markere "Tillad brugere at sende mail gennem en ekstern SMTP-server...". Der vil være en vis forsinkelse, før denne ændring træder i kraft, så vent venligst et par minutter.
     </span>
   </div>

5. Gå til [Gmail](https://gmail.com) og under [Indstillinger <i class="fa fa-angle-right"></i> Konti og import <i class="fa fa-angle-right"></i> Send mail som](https://mail.google.com/mail/u/0/#settings/accounts), klik på "Tilføj en anden e-mailadresse"

6. Når du bliver bedt om "Navn", indtast det navn, du ønsker, at din e-mail skal vises som "Fra" (f.eks. "Linus Torvalds")

7. Når du bliver bedt om "E-mailadresse", indtast den e-mailadresse med det brugerdefinerede domæne, du brugte ovenfor (f.eks. <code><hello@example.com></code>)
8. Fjern markeringen i "Behandl som et alias"

9. Klik på "Næste trin" for at fortsætte

10. Når du bliver bedt om "SMTP-server", indtast <code>smtp.gmail.com</code> og lad porten være <code>587</code>

11. Når du bliver bedt om "Brugernavn", indtast den del af din Gmail-adresse uden <span>gmail.com</span>-delen (f.eks. kun "user", hvis min e-mail er <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Vigtigt:
      </strong>
      <span>
        Hvis "Brugernavn"-delen udfyldes automatisk, så <u><strong>skal du ændre dette</strong></u> til brugernavnsdelen af din Gmail-adresse i stedet.
      </span>
    </div>

12. Når du bliver bedt om "Adgangskode", indsæt fra dit udklipsholder den adgangskode, du genererede i trin 2 ovenfor

13. Lad radioknappen være markeret for "Sikret forbindelse ved hjælp af TLS"

14. Klik på "Tilføj konto" for at fortsætte

15. Åbn en ny fane til [Gmail](https://gmail.com) og vent på, at din bekræftelsesmail ankommer (du vil modtage en bekræftelseskode, der bekræfter, at du er ejer af den e-mailadresse, du forsøger at "Sende mail som")

16. Når den ankommer, kopier og indsæt bekræftelseskoden ved prompten, du modtog i det foregående trin

17. Når du har gjort det, gå tilbage til e-mailen og klik på linket for at "bekræfte anmodningen". Du skal sandsynligvis udføre dette trin og det foregående trin for, at e-mailen bliver korrekt konfigureret.

</div>

### Avanceret Gmail-routingkonfiguration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>15-30 minutter</span>
</div>

Hvis du vil opsætte avanceret routing i Gmail, så aliaser, der ikke matcher en postkasse, videresendes til Forward Emails mailudvekslinger, skal du følge disse trin:

1. Log ind på din Google Admin-konsol på [admin.google.com](https://admin.google.com)
2. Gå til **Apps → Google Workspace → Gmail → Routing**
3. Klik på **Tilføj rute** og konfigurer følgende indstillinger:

**Indstillinger for enkelt modtager:**

* Vælg "Skift konvolutmodtager" og indtast din primære Gmail-adresse
* Marker "Tilføj X-Gm-Original-To-header med original modtager"

**Mønstre for konvolutmodtager:**

* Tilføj et mønster, der matcher alle ikke-eksisterende postkasser (f.eks. `.*@yourdomain.com`)

**E-mailserverindstillinger:**

* Vælg "Ruter til vært" og indtast `mx1.forwardemail.net` som primær server
* Tilføj `mx2.forwardemail.net` som backupserver
* Sæt port til 25
* Vælg "Krav TLS" for sikkerhed

4. Klik på **Gem** for at oprette ruten

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Denne konfiguration virker kun for Google Workspace-konti med brugerdefinerede domæner, ikke for almindelige Gmail-konti.
  </span>
</div>

### Avanceret Outlook-routingkonfiguration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>15-30 minutter</span>
</div>

For Microsoft 365 (tidligere Office 365) brugere, der ønsker at opsætte avanceret routing, så aliaser, der ikke matcher en postkasse, videresendes til Forward Emails mailudvekslinger:

1. Log ind på Microsoft 365 administrationscenteret på [admin.microsoft.com](https://admin.microsoft.com)
2. Gå til **Exchange → Mail flow → Regler**
3. Klik på **Tilføj en regel** og vælg **Opret en ny regel**
4. Navngiv din regel (f.eks. "Videresend ikke-eksisterende postkasser til Forward Email")
5. Under **Anvend denne regel, hvis**, vælg:
   * "Modtageradressen matcher..."
   * Indtast et mønster, der matcher alle adresser på dit domæne (f.eks. `*@yourdomain.com`)
6. Under **Gør følgende**, vælg:
   * "Omdiriger beskeden til..."
   * Vælg "Følgende mailserver"
   * Indtast `mx1.forwardemail.net` og port 25
   * Tilføj `mx2.forwardemail.net` som backupserver
7. Under **Undtagen hvis**, vælg:
   * "Modtageren er..."
   * Tilføj alle dine eksisterende postkasser, som ikke skal videresendes
8. Indstil regelprioriteten, så den kører efter andre mailflow-regler
9. Klik på **Gem** for at aktivere reglen
## Fejlfinding {#troubleshooting}

### Hvorfor modtager jeg ikke mine testemails {#why-am-i-not-receiving-my-test-emails}

Hvis du sender en testemail til dig selv, kan den muligvis ikke dukke op i din indbakke, fordi den har samme "Message-ID" header.

Dette er et velkendt problem, og det påvirker også tjenester som Gmail.  <a href="https://support.google.com/a/answer/1703601">Her er det officielle Gmail svar vedrørende dette problem</a>.

Hvis du fortsat har problemer, er det højst sandsynligt et problem med DNS-propagation. Du bliver nødt til at vente lidt længere og prøve igen (eller prøve at sætte en lavere TTL-værdi på dine <strong class="notranslate">TXT</strong> records).

**Har du stadig problemer?**  Venligst <a href="/help">kontakt os</a>, så vi kan hjælpe med at undersøge problemet og finde en hurtig løsning.

### Hvordan konfigurerer jeg min email-klient til at fungere med Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Vores service fungerer med populære email-klienter såsom:
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
  Dit brugernavn er din alias' emailadresse, og adgangskoden kommer fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normal Password").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>Hvis du bruger Thunderbird, skal du sikre dig, at "Connection security" er sat til "SSL/TLS" og autentificeringsmetoden er sat til "Normal password".</span>
</div>

| Type |         Hostnavn        |         Protokol        |                                            Porte                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Foretrukket**  |                                      `993` og `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Anbefalet** | `465` og `2465` for SSL/TLS (anbefalet) eller `587`, `2587`, `2525` og `25` for STARTTLS |

### Hvorfor lander mine emails i Spam og Junk, og hvordan kan jeg tjekke mit domænes omdømme {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Denne sektion guider dig, hvis din udgående mail bruger vores SMTP-servere (f.eks. `smtp.forwardemail.net`) (eller videresendt via `mx1.forwardemail.net` eller `mx2.forwardemail.net`) og den bliver leveret i modtageres Spam- eller Junk-mappe.

Vi overvåger rutinemæssigt vores [IP-adresser](#what-are-your-servers-ip-addresses) mod [alle anerkendte DNS-denylister](#how-do-you-handle-your-ip-addresses-becoming-blocked), **derfor er det højst sandsynligt et domæne-rygspecifikt problem**.

Emails kan lande i spam-mapper af flere grunde:

1. **Manglende autentificering**: Opsæt [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) og [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

2. **Domæneomdømme**: Nye domæner har ofte neutral omdømme, indtil de etablerer en afsendelseshistorik.

3. **Indholdstriggere**: Visse ord eller sætninger kan udløse spamfiltre.

4. **Afsendelsesmønstre**: Pludselige stigninger i email-volumen kan se mistænkelige ud.

Du kan prøve at bruge et eller flere af disse værktøjer til at tjekke dit domænes omdømme og kategorisering:

#### Værktøjer til kontrol af omdømme og blokliste {#reputation-and-blocklist-check-tools}

| Værktøjsnavn                                | URL                                                          | Type                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Kategorisering         |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Omdømme                |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Blacklist              |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Omdømme                |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Omdømme                |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Omdømme                |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Backscatter Protection |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (requires a fee)              | DNSWL                  |

#### Formularer til fjernelse af IP-blokering efter udbyder {#ip-removal-request-forms-by-provider}

Hvis din IP-adresse er blevet blokeret af en specifik email-udbyder, brug den relevante fjernelsesformular eller kontakt nedenfor:

| Udbyder                               | Fjernelsesformular / Kontakt                                                                                 | Noter                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                      | Formular til kontakt for bulk-afsendere      |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                  | Office 365 IP delist portal                   |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                              | Yahoo Sender Hub                              |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                            | Apple bruger Proofpoint til IP-rygsbedømmelse |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                            | Proofpoint IP-tjek og fjernelse               |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                 | Barracuda omdømmeopslag og fjernelse          |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                        | Cloudmark CSI nulstillingsanmodning           |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                           | GoDaddy IP-oplåsningsformular                  |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                             | Comcast IP-fjernelsesanmodning                 |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                  | Kontakt Spectrum support for fjernelse         |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                    | Email til fjernelsesanmodning                  |
| Cox Communications                     | `unblock.request@cox.net`                                                                                    | Email til fjernelsesanmodning                  |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                      | Bruger Cloudfilter                             |
| Windstream                             | `abuse@windstream.net`                                                                                       | Email til fjernelsesanmodning                  |
| t-online.de (Tyskland)                 | `tobr@rx.t-online.de`                                                                                        | Email til fjernelsesanmodning                  |
| Orange France                          | <https://postmaster.orange.fr/>                                                                              | Brug kontaktformular eller email `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                      | GMX postmaster kontaktformular                  |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                                | Mail.ru postmaster portal                      |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                              | Yandex postmaster portal                       |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                  | QQ Mail whitelist ansøgning (kinesisk)         |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                           | Netease postmaster portal                      |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                         | Kontakt via Alibaba Cloud-konsol               |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                 | AWS SES konsol > Blacklist fjernelse           |
| SendGrid                               | <https://support.sendgrid.com/>                                                                              | Kontakt SendGrid support                       |
| Mimecast                               | <https://community.mimecast.com/>                                                                            | Bruger tredjeparts RBL'er - kontakt specifik RBL |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                          | Kontakt Fastmail support                       |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>   | Kontakt Zoho support                           |
| ProtonMail                             | <https://proton.me/support/contact>                                                                          | Kontakt Proton support                         |
| Tutanota                               | <https://tutanota.com/support>                                                                               | Kontakt Tutanota support                       |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                          | Kontakt Hushmail support                       |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                             | Kontakt Mailbox.org support                    |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                          | Kontakt Posteo support                         |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                       | Kontakt DuckDuckGo support                     |
| Sonic.net                              | <https://www.sonic.com/support>                                                                              | Kontakt Sonic support                          |
| Telus                                  | <https://www.telus.com/en/support>                                                                           | Kontakt Telus support                          |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                             | Kontakt Vodafone support                       |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                              | Kontakt Spark NZ support                       |
| UOL/BOL (Brasilien)                   | <https://ajuda.uol.com.br/>                                                                                  | Kontakt UOL support (portugisisk)              |
| Libero (Italien)                      | <https://aiuto.libero.it/>                                                                                   | Kontakt Libero support (italiensk)             |
| Telenet (Belgien)                     | <https://www2.telenet.be/en/support/>                                                                        | Kontakt Telenet support                        |
| Facebook/WhatsApp                     | <https://www.facebook.com/business/help>                                                                     | Kontakt Facebook business support              |
| LinkedIn                             | <https://www.linkedin.com/help/linkedin>                                                                     | Kontakt LinkedIn support                       |
| Groups.io                            | <https://groups.io/helpcenter>                                                                               | Kontakt Groups.io support                      |
| Earthlink/Vade Secure                | <https://sendertool.vadesecure.com/en/>                                                                      | Vade Secure afsenderværktøj                    |
| Cloudflare Email Security            | <https://www.cloudflare.com/products/zero-trust/email-security/>                                             | Kontakt Cloudflare support                     |
| Hornetsecurity/Expurgate             | <https://www.hornetsecurity.com/>                                                                            | Kontakt Hornetsecurity support                 |
| SpamExperts/Antispamcloud            | <https://www.spamexperts.com/>                                                                               | Kontakt via hostingudbyder                     |
| Mail2World                         | <https://www.mail2world.com/support/>                                                                        | Kontakt Mail2World support                     |
> \[!TIP]
> Start med et lavt volumen af e-mails af høj kvalitet for at opbygge et positivt ry, før du sender i større mængder.

> \[!IMPORTANT]
> Hvis dit domæne er på en sortliste, har hver sortliste sin egen fjernelsesproces. Tjek deres hjemmesider for instruktioner.

> \[!TIP]
> Hvis du har brug for yderligere hjælp eller opdager, at vi fejlagtigt er markeret som spam af en bestemt e-mailudbyder, så <a href="/help">kontakt os</a> venligst.

### Hvad skal jeg gøre, hvis jeg modtager spam-mails {#what-should-i-do-if-i-receive-spam-emails}

Du bør afmelde dig mailinglisten (hvis muligt) og blokere afsenderen.

Rapporter venligst ikke beskeden som spam, men videresend den i stedet til vores manuelt kuraterede og privatlivsfokuserede misbrugsforebyggelsessystem.

**E-mailadressen til at videresende spam til er:** <abuse@forwardemail.net>

### Hvorfor vises mine test-mails sendt til mig selv i Gmail som "mistænkelige" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Hvis du ser denne fejlmeddelelse i Gmail, når du sender en test til dig selv, eller når en person, du sender e-mail til med dit alias, ser en e-mail fra dig for første gang, så **vær venlig ikke bekymret** – da dette er en indbygget sikkerhedsfunktion i Gmail.

Du kan blot klikke på "Ser sikkert ud". For eksempel, hvis du sender en testbesked ved hjælp af funktionen send mail som (til en anden), vil de ikke se denne besked.

Hvis de alligevel ser denne besked, er det fordi de normalt er vant til at se dine e-mails komme fra <john@gmail.com> i stedet for <john@customdomain.com> (bare et eksempel). Gmail advarer brugerne for at sikre, at tingene er sikre, bare for en sikkerheds skyld, og der findes ingen løsning.

### Kan jeg fjerne via forwardemail dot net i Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dette emne relaterer til et [bredt kendt problem i Gmail, hvor ekstra info vises ved siden af en afsenders navn](https://support.google.com/mail/answer/1311182).

Fra maj 2023 understøtter vi afsendelse af e-mail med SMTP som et tillægsmodul for alle betalende brugere – hvilket betyder, at du kan fjerne <span class="notranslate">via forwardemail dot net</span> i Gmail.

Bemærk, at dette FAQ-emne er specifikt for dem, der bruger funktionen [Sådan sender du mail som ved hjælp af Gmail](#how-to-send-mail-as-using-gmail).

Se venligst afsnittet om [Understøtter I afsendelse af e-mail med SMTP](#do-you-support-sending-email-with-smtp) for konfigurationsinstruktioner.


## Datahåndtering {#data-management}

### Hvor er jeres servere placeret {#where-are-your-servers-located}

> \[!TIP]
> Vi vil snart annoncere vores EU-datacenterlokation hostet under [forwardemail.eu](https://forwardemail.eu). Abonner på diskussionen på <https://github.com/orgs/forwardemail/discussions/336> for opdateringer.

Vores servere er primært placeret i Denver, Colorado – se <https://forwardemail.net/ips> for vores komplette liste over IP-adresser.

Du kan læse om vores databehandlere på vores [GDPR](/gdpr), [DPA](/dpa), og [Privatliv](/privacy) sider.

### Hvordan eksporterer og sikkerhedskopierer jeg min postkasse {#how-do-i-export-and-backup-my-mailbox}

Du kan til enhver tid eksportere dine postkasser som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), eller krypterede [SQLite](https://en.wikipedia.org/wiki/SQLite) formater.

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser <i class="fa fa-angle-right"></i> Download backup og vælg din foretrukne eksportformattype.

Du vil modtage et link til at downloade eksporten, når den er færdig.

Bemærk, at dette eksport-downloadlink udløber efter 4 timer af sikkerhedshensyn.

Hvis du har brug for at inspicere dine eksporterede EML- eller Mbox-formater, kan disse open-source værktøjer være nyttige:

| Navn            | Format | Platform      | GitHub URL                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Alle platforme| <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Alle platforme| <https://github.com/s0ph1e/eml-reader>              |
Additionally if you need to convert a Mbox file to EML file, then you can use <https://github.com/noelmartinon/mboxzilla>.

### Hvordan importerer og migrerer jeg min eksisterende postkasse {#how-do-i-import-and-migrate-my-existing-mailbox}

Du kan nemt importere din e-mail til Forward Email (f.eks. ved at bruge [Thunderbird](https://www.thunderbird.net)) med instruktionerne nedenfor:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Du skal følge alle følgende trin for at importere din eksisterende e-mail.
  </span>
</div>

1. Eksporter din e-mail fra din nuværende e-mailudbyder:

   | E-mailudbyder | Eksportformat                                  | Eksportinstruktioner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Hvis du bruger Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST eksportformat</a>), kan du blot følge instruktionerne under "Andet" nedenfor. Vi har dog også inkluderet links til at konvertere PST til MBOX/EML format baseret på dit operativsystem:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba til Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst til Windows cygwin</a> – (f.eks. <code>readpst -u -o $OUT_DIR $IN_DIR</code> hvor <code>$OUT_DIR</code> og <code>$IN_DIR</code> erstattes med output- og inputmappestierne).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst til Ubuntu/Linux</a> – (f.eks. <code>sudo apt-get install readpst</code> og derefter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, hvor <code>$OUT_DIR</code> og <code>$IN_DIR</code> erstattes med output- og inputmappestierne).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst til macOS (via brew)</a> – (f.eks. <code>brew install libpst</code> og derefter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, hvor <code>$OUT_DIR</code> og <code>$IN_DIR</code> erstattes med output- og inputmappestierne).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter til Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Other          | [Brug Thunderbird](https://www.thunderbird.net) | Opsæt din eksisterende e-mailkonto i Thunderbird og brug derefter [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) plugin'et til at eksportere og importere din e-mail.  **Du kan muligvis også blot kopiere/indsætte eller trække/sætte e-mails mellem konti.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Download, installer og åbn [Thunderbird](https://www.thunderbird.net).

3. Opret en ny konto ved at bruge dit alias’ fulde e-mailadresse (f.eks. <code><you@yourdomain.com></code>) og din genererede adgangskode.  <strong>Hvis du endnu ikke har en genereret adgangskode, så <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">se vores opsætningsvejledning</a></strong>.

4. Download og installer [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-plugin'et.

5. Opret en ny lokal mappe i Thunderbird, og højreklik derefter på den → vælg `ImportExportTools NG`-muligheden → vælg `Import mbox file` (for MBOX eksportformat) – eller – `Import messages` / `Import all messages from a directory` (for EML eksportformat).

6. Træk/slip fra den lokale mappe til en ny (eller eksisterende) IMAP-mappe i Thunderbird, som du ønsker at uploade beskeder til i IMAP-lageret med vores service.  Dette sikrer, at de bliver sikkerhedskopieret online med vores SQLite-krypterede lager.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       Hvis du er i tvivl om, hvordan du importerer til Thunderbird, kan du se de officielle instruktioner på <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> og <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Når du har gennemført eksport- og importprocessen, vil du måske også aktivere videresendelse på din eksisterende e-mailkonto og opsætte en autosvar, der underretter afsendere om, at du har en ny e-mailadresse (f.eks. hvis du tidligere brugte Gmail og nu bruger en e-mail med dit eget domænenavn).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

### Hvordan bruger jeg mit eget S3-kompatible lager til sikkerhedskopier {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Betalte brugere kan konfigurere deres egen [S3](https://en.wikipedia.org/wiki/Amazon_S3)-kompatible lagerudbyder på domæneniveau til IMAP/SQLite-sikkerhedskopier.  Det betyder, at dine krypterede postkassesikkerhedskopier kan gemmes på din egen infrastruktur i stedet for (eller som supplement til) vores standardlager.

Understøttede udbydere inkluderer [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) og enhver anden S3-kompatibel tjeneste.

#### Opsætning {#setup}

1. Opret en **privat** bucket hos din S3-kompatible udbyder. Bucketen må ikke være offentligt tilgængelig.
2. Opret adgangsoplysninger (access key ID og secret access key) med læse-/skriveadgang til bucketen.
3. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Avancerede indstillinger <i class="fa fa-angle-right"></i> Tilpasset S3-kompatibelt lager.
4. Marker **"Aktivér tilpasset S3-kompatibelt lager"** og udfyld din endpoint-URL, access key ID, secret access key, region og bucket-navn.
5. Klik på **"Test forbindelse"** for at verificere dine legitimationsoplysninger, bucket-adgang og skriveadgang.
6. Klik på **"Gem"** for at anvende indstillingerne.

#### Hvordan sikkerhedskopier fungerer {#how-backups-work}

Sikkerhedskopier udløses automatisk for hver tilsluttet IMAP-alias. IMAP-serveren tjekker alle aktive forbindelser en gang i timen og igangsætter en sikkerhedskopi for hver tilsluttet alias. En Redis-baseret lås forhindrer, at dublerede sikkerhedskopier kører inden for 30 minutter af hinanden, og den faktiske sikkerhedskopi springes over, hvis en succesfuld sikkerhedskopi allerede er gennemført inden for de sidste 24 timer (medmindre sikkerhedskopien eksplicit er anmodet af en bruger til download).
Backups kan også udløses manuelt ved at klikke på **"Download Backup"** for enhver alias i dashboardet. Manuelle backups kører altid uanset 24-timers vinduet.

Backup-processen fungerer som følger:

1. SQLite-databasen kopieres ved hjælp af `VACUUM INTO`, som skaber et konsistent snapshot uden at afbryde aktive forbindelser og bevarer databasekrypteringen.
2. Backup-filen verificeres ved at åbne den for at bekræfte, at krypteringen stadig er gyldig.
3. En SHA-256-hash beregnes og sammenlignes med den eksisterende backup i lageret. Hvis hashen matcher, springes upload over (ingen ændringer siden sidste backup).
4. Backuppen uploades til S3 ved hjælp af multipart upload via [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) biblioteket.
5. En signeret download-URL (gyldig i 4 timer) genereres og sendes til brugeren via e-mail.

#### Backup Formats {#backup-formats}

Tre backup-formater understøttes:

| Format   | Extension | Beskrivelse                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Rå krypteret SQLite database snapshot (standard for automatiske IMAP-backups) |
| `mbox`   | `.zip`    | Adgangskodebeskyttet ZIP indeholdende postkasse i mbox-format               |
| `eml`    | `.zip`    | Adgangskodebeskyttet ZIP indeholdende individuelle `.eml` filer pr. besked  |

> **Tip:** Hvis du har `.sqlite` backup-filer og ønsker at konvertere dem til `.eml` filer lokalt, brug vores standalone CLI-værktøj **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Det virker på Windows, Linux og macOS og kræver ikke netværksforbindelse.

#### File Naming and Key Structure {#file-naming-and-key-structure}

Når du bruger **custom S3 storage**, gemmes backup-filer med et [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) tidsstempel-præfiks, så hver backup bevares som et separat objekt. Dette giver dig en fuld backup-historik i din egen bucket.

Nøgleformatet er:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

For eksempel:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` er MongoDB ObjectId for aliaset. Du kan finde det på aliasindstillingssiden eller via API'en.

Når du bruger **standard (system) lager**, er nøglen flad (f.eks. `65a31c53c36b75ed685f3fda.sqlite`) og hver backup overskriver den forrige.

> **Bemærk:** Da custom S3 storage bevarer alle backup-versioner, vil lagerforbruget vokse over tid. Vi anbefaler at konfigurere [lifecycle rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) på din bucket for automatisk at udløbe gamle backups (f.eks. slette objekter ældre end 30 eller 90 dage).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Din custom S3 bucket er fuldstændig under din kontrol. Vi **sletter eller ændrer aldrig** filer i din custom S3 bucket – hverken når et alias slettes, en domæne fjernes, eller under nogen oprydningsoperationer. Vi skriver kun nye backup-filer til din bucket.

Det betyder:

* **Alias-sletning** — Når du sletter et alias, fjerner vi kun backupen fra vores standard systemlager. Eventuelle backups tidligere skrevet til din custom S3 bucket forbliver uberørte.
* **Domænefjernelse** — Fjernelse af et domæne påvirker ikke filer i din custom bucket.
* **Retention management** — Du er ansvarlig for at administrere lagerplads i din egen bucket, inklusive at konfigurere lifecycle rules til at udløbe gamle backups.

Hvis du deaktiverer custom S3 storage eller skifter tilbage til vores standardlager, bevares eksisterende filer i din bucket. Fremtidige backups vil blot blive skrevet til vores standardlager i stedet.

#### Security {#security}

* Dit access key ID og secret access key er **krypteret i hvile** ved hjælp af [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) før de gemmes i vores database. De dekrypteres kun ved kørsel, når backup-operationer udføres.
* Vi validerer automatisk, at din bucket **ikke er offentligt tilgængelig**. Hvis en offentlig bucket opdages, afvises konfigurationen ved gemning. Hvis offentlig adgang opdages ved backup-tidspunktet, falder vi tilbage til vores standardlager og underretter alle domæneadministratorer via e-mail.
* Legitimation valideres ved gemning via et [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) kald for at sikre, at bucketen eksisterer og legitimationsoplysningerne er korrekte. Hvis validering fejler, deaktiveres custom S3 storage automatisk.
* Hver backup-fil inkluderer en SHA-256-hash i sin S3 metadata, som bruges til at opdage uændrede databaser og springe over overflødige uploads.
#### Fejlmeddelelser {#error-notifications}

Hvis en backup fejler ved brug af din tilpassede S3-lagring (f.eks. på grund af udløbne legitimationsoplysninger eller et forbindelsesproblem), vil alle domæneadministratorer blive underrettet via e-mail. Disse meddelelser er ratebegrænsede til én gang hver 6. time for at forhindre dublerede advarsler. Hvis din bucket opdages som offentligt tilgængelig på backup-tidspunktet, vil administratorer blive underrettet én gang dagligt.

#### API {#api}

Du kan også konfigurere tilpasset S3-lagring via API'en:

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

For at teste forbindelsen via API'en:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Hvordan konverterer jeg SQLite-backups til EML-filer {#how-do-i-convert-sqlite-backups-to-eml-files}

Hvis du downloader eller gemmer SQLite-backups (enten fra vores standardlagring eller din egen [tilpassede S3-bucket](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), kan du konvertere dem til standard `.eml`-filer ved hjælp af vores selvstændige CLI-værktøj **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. EML-filer kan åbnes med enhver e-mail-klient ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) osv.) eller importeres til andre mailservere.

#### Installation {#installation-1}

Du kan enten downloade en færdigbygget binær fil (ingen [Node.js](https://github.com/nodejs/node) krævet) eller køre den direkte med [Node.js](https://github.com/nodejs/node):

**Færdigbyggede binærfiler** — Download den seneste udgivelse til din platform fra [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Platform | Arkitektur   | Fil                                   |
| -------- | ------------ | ------------------------------------ |
| Linux    | x64          | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64        | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon| `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64          | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS-brugere:** Efter download kan det være nødvendigt at fjerne karantæneattributten, før du kører den binære fil:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Erstat `./convert-sqlite-to-eml-darwin-arm64` med den faktiske sti til den downloadede fil.)

> **Linux-brugere:** Efter download kan det være nødvendigt at gøre den binære fil eksekverbar:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Erstat `./convert-sqlite-to-eml-linux-x64` med den faktiske sti til den downloadede fil.)

**Fra kildekode** (kræver [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Brug {#usage}

Værktøjet understøtter både interaktiv og ikke-interaktiv tilstand.

**Interaktiv tilstand** — kør uden argumenter, og du vil blive bedt om alle input:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Konverter SQLite Backup til EML
  ===============================================

  Sti til SQLite-backupfil: /path/to/backup.sqlite
  IMAP/alias adgangskode: ********
  Output ZIP sti [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Ikke-interaktiv tilstand** — angiv argumenter via kommandolinjeflag til scripting og automatisering:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Flag                | Beskrivelse                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Sti til den krypterede SQLite-backupfil                                      |
| `--password <pass>` | IMAP/alias adgangskode til dekryptering                                      |
| `--output <path>`   | Outputsti for ZIP-filen (standard: automatisk genereret med ISO 8601-tidsstempel) |
| `--help`            | Vis hjælpetekst                                                              |
#### Output Format {#output-format}

Værktøjet producerer et adgangskodebeskyttet ZIP-arkiv (AES-256 krypteret), der indeholder:

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

EML-filer er organiseret efter postkassemappe. ZIP-adgangskoden er den samme som din IMAP/alias-adgangskode. Hver `.eml` fil er en standard [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) e-mailbesked med fulde headers, brødtekst og vedhæftede filer rekonstrueret fra SQLite-databasen.

#### How It Works {#how-it-works}

1. Åbner den krypterede SQLite-database ved hjælp af din IMAP/alias-adgangskode (understøtter både [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) og [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) cifre).
2. Læser Mailboxes-tabellen for at opdage mappestrukturen.
3. For hver besked dekoder mimeTree (gemt som [Brotli](https://github.com/google/brotli)-komprimeret JSON) fra Messages-tabellen.
4. Rekonstruerer den fulde EML ved at gennemgå MIME-træet og hente vedhæftede filers indhold fra Attachments-tabellen.
5. Pakker alt sammen i et adgangskodebeskyttet ZIP-arkiv ved hjælp af [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Do you support self-hosting {#do-you-support-self-hosting}

Ja, fra marts 2025 understøtter vi en selvhostet mulighed. Læs bloggen [her](https://forwardemail.net/blog/docs/self-hosted-solution). Se [selvhostet guide](https://forwardemail.net/self-hosted) for at komme i gang. Og for dem, der er interesserede i en mere opdelt trin-for-trin version, se vores [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserede guider.


## Email Configuration {#email-configuration}

### How do I get started and set up email forwarding {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Anslået opsætningstid:</strong>
  <span>Mindre end 10 minutter</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kom godt i gang:
  </strong>
  <span>
    Læs og følg omhyggeligt trin et til otte nedenfor. Sørg for at erstatte e-mailadressen <code>user@gmail.com</code> med den e-mailadresse, du ønsker at videresende e-mails til (hvis den ikke allerede er korrekt). Sørg ligeledes for at erstatte <code>example.com</code> med dit eget domænenavn (hvis det ikke allerede er korrekt).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Hvis du allerede har registreret dit domænenavn et sted, skal du helt springe dette trin over og gå til trin to! Ellers kan du <a href="/domain-registration" rel="noopener noreferrer">klikke her for at registrere dit domænenavn</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Kan du huske, hvor du registrerede dit domæne? Når du husker det, skal du følge instruktionerne nedenfor:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Du skal åbne en ny fane og logge ind hos din domæneregistrator. Du kan nemt klikke på din "Registrar" nedenfor for automatisk at gøre dette. I denne nye fane skal du navigere til DNS-administrationssiden hos din registrator – og vi har angivet trin-for-trin navigationsvejledninger nedenfor under kolonnen "Steps to Configure". Når du har navigeret til denne side i den nye fane, kan du vende tilbage til denne fane og fortsætte til trin tre nedenfor.
    <strong class="font-weight-bold">Luk ikke den åbnede fane endnu; du får brug for den til fremtidige trin!</strong>
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
      <td>Log ind <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Rediger DNS-indstillinger</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Vælg dit domæne)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FOR ROCK: Log ind <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klik på ▼-ikonet ved siden af administrer) <i class="fa fa-angle-right"></i> DNS
      <br />
      FOR LEGACY: Log ind <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Vælg dit domæne)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Vælg dit domæne)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Manage</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> I kortvisning, klik på administrer på dit domæne <i class="fa fa-angle-right"></i> I listevisning, klik på
tandhjulsikonet <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> (klik på tandhjulsikon) <i class="fa fa-angle-right"></i> Klik på DNS &amp; Nameservers i venstremenuen</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Rediger zonen</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Log ind <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Konfigurer DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Log ind <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Setup Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Change Where Domain Points <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Se</a>
      </td>
      <td>Log ind <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> DNS Settings</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Home menu <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i>
Avancerede indstillinger <i class="fa fa-angle-right"></i> Custom Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Brug "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Domains page <i class="fa fa-angle-right"></i> (Klik på <i class="fa fa-ellipsis-h"></i> ikonet) <i class="fa fa-angle-right"></i> Vælg Manage DNS Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Log ind <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> My Domains</td>
    </tr>
    <tr>
      <td>Andet</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Vigtigt:</strong> Kan du ikke se navnet på din registrator her? Søg blot på internettet efter "how to change DNS records on $REGISTRAR" (erstat $REGISTRAR med navnet på din registrator – f.eks. "how to change DNS records on GoDaddy", hvis du bruger GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Brug din registrators DNS-administrationsside (den anden fane, du har åbnet), og indstil følgende "MX"-poster:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Bemærk, at der IKKE må være andre MX-poster sat. Begge poster vist nedenfor SKAL eksistere. Sørg for, at der ikke er stavefejl; og at du har både mx1 og mx2 stavet korrekt. Hvis der allerede fandtes MX-poster, skal de slettes helt.
    "TTL"-værdien behøver ikke at være 3600, det kan være en lavere eller højere værdi, hvis nødvendigt.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Prioritet</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Brug din registrators DNS-administrationsside (den anden fane du har åbnet), og sæt følgende <strong class="notranslate">TXT</strong>-post(er):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du er på en betalt plan, skal du helt springe dette trin over og gå til trin fem! Hvis du ikke er på en betalt plan, vil dine videresendte adresser være offentligt søgbare – gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> og opgrader dit domæne til en betalt plan, hvis ønsket. Hvis du vil lære mere om betalte planer, se vores <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Priser</a>-side. Ellers kan du fortsætte med at vælge en eller flere kombinationer fra Option A til Option F listet nedenfor.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option A:
  </strong>
  <span>
    Hvis du videresender alle e-mails fra dit domæne, (f.eks. "all@example.com", "hello@example.com", osv.) til en specifik adresse "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
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
    Tip:
  </strong>
  <span>
    Sørg for at erstatte værdierne ovenfor i "Værdi"-kolonnen med din egen e-mailadresse. "TTL"-værdien behøver ikke at være 3600, det kan være en lavere eller højere værdi, hvis nødvendigt. En lavere time to live ("TTL") værdi sikrer, at eventuelle fremtidige ændringer foretaget i dine DNS-poster bliver udbredt hurtigere på internettet – tænk på det som hvor længe det vil blive cachet i hukommelsen (i sekunder). Du kan lære mere om <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL på Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option B:
  </strong>
  <span>
    Hvis du kun skal videresende en enkelt e-mailadresse (f.eks. <code>hello@example.com</code> til <code>user@gmail.com</code>; dette vil også automatisk videresende "hello+test@example.com" til "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
    Mulighed C:
  </strong>
  <span>
    Hvis du videresender flere e-mails, skal du adskille dem med et komma:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
    Mulighed D:
  </strong>
  <span>
    Du kan opsætte et uendeligt antal videresendelses-e-mails – sørg bare for ikke at overskride 255 tegn på en enkelt linje, og start hver linje med "forward-email=". Et eksempel er vist nedenfor:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
    Mulighed E:
  </strong>
  <span>
    Du kan også angive et domænenavn i din <strong class="notranslate">TXT</strong>-post for at have global alias-videresendelse (f.eks. vil "user@example.com" blive videresendt til "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
    Mulighed F:
  </strong>
  <span>
    Du kan endda bruge webhooks som et globalt eller individuelt alias til at videresende e-mails til. Se eksemplet og hele afsnittet om webhooks med titlen <a href="#do-you-support-webhooks" class="alert-link">Understøtter I webhooks</a> nedenfor.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
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
    Mulighed G:
  </strong>
  <span>
    Du kan endda bruge regulære udtryk ("regex") til at matche aliaser og til at håndtere substitutioner for at videresende e-mails til. Se eksemplerne og hele afsnittet om regex med titlen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Understøtter I regulære udtryk eller regex</a> nedenfor.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Brug for avanceret regex med substitution?</strong> Se eksemplerne og hele afsnittet om regex med titlen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Understøtter I regulære udtryk eller regex</a> nedenfor.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Enkelt eksempel:</strong> Hvis jeg vil have, at alle e-mails, der går til `linus@example.com` eller `torvalds@example.com`, skal videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
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
    Vigtigt:
  </strong>
  <span>
    Catch-all videresendelsesregler kan også beskrives som "fall-through".
    Det betyder, at indkommende e-mails, som matcher mindst én specifik videresendelsesregel, vil blive brugt i stedet for catch-all.
    Specifikke regler inkluderer e-mailadresser og regulære udtryk.
    <br /><br />
    For eksempel:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-mails sendt til <code>hello@example.com</code> vil **ikke** blive videresendt til <code>second@gmail.com</code> (catch-all) med denne konfiguration, og vil i stedet kun blive leveret til <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Brug din registrators DNS-administrationsside (den anden fane du har åbnet), og tilføj desuden følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
    Vigtigt:
  </strong>
  <span>
    Hvis du bruger Gmail (f.eks. Send Mail As) eller G Suite, skal du tilføje <code>include:_spf.google.com</code> til værdien ovenfor, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Hvis du allerede har en lignende linje med "v=spf1", skal du tilføje <code>include:spf.forwardemail.net</code> lige før eventuelle eksisterende "include:host.com"-poster og før "-all" på samme linje, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Bemærk, at der er forskel på "-all" og "~all". "-" angiver, at SPF-tjekket skal FEJLE, hvis det ikke matcher, og "~" angiver, at SPF-tjekket skal SOFTFAIL. Vi anbefaler at bruge "-all" for at forhindre domæneforfalskning.
    <br /><br />
    Du kan også have brug for at inkludere SPF-posten for den vært, du sender mail fra (f.eks. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Bekræft dine DNS-poster ved hjælp af vores "Verify Records" værktøj, som findes på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Opsætning.

</li><li class="mb-2 mb-md-3 mb-lg-5">Send en testemail for at bekræfte, at det virker. Bemærk, at det kan tage noget tid, før dine DNS-poster er udbredt.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
  </span>
    Hvis du ikke modtager testemails, eller modtager en testemail, der siger "Vær forsigtig med denne besked", så se svarene for <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Hvorfor modtager jeg ikke mine testemails</a> og <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Hvorfor vises mine testemails sendt til mig selv i Gmail som "mistænkelige"</a> henholdsvis.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Hvis du ønsker at "Sende mail som" fra Gmail, skal du <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">se denne video</a></strong>, eller følge trinene under <a href="#how-to-send-mail-as-using-gmail">Sådan sender du mail som ved brug af Gmail</a> nedenfor.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Valgfrie tilføjelser er listet nedenfor. Bemærk, at disse tilføjelser er helt valgfrie og måske ikke er nødvendige. Vi ønskede i det mindste at give dig yderligere information, hvis det er nødvendigt.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Valgfri tilføjelse:
  </strong>
  <span>
    Hvis du bruger funktionen <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Sådan sender du mail som ved brug af Gmail</a>, kan det være en god idé at tilføje dig selv til en tilladelsesliste. Se <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">disse instruktioner fra Gmail</a> om dette emne.
  </span>
</div>

### Kan jeg bruge flere MX-udvekslinger og servere til avanceret videresendelse {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, men **du bør kun have én MX-udveksling opført i dine DNS-poster**.

Forsøg ikke at bruge "Prioritet" som en måde at konfigurere flere MX-udvekslinger på.

I stedet skal du konfigurere din eksisterende MX-udveksling til at videresende mail for alle ikke-matchende aliaser til vores tjenestes udvekslinger (`mx1.forwardemail.net` og/eller `mx2.forwardemail.net`).

Hvis du bruger Google Workspace og ønsker at videresende alle ikke-matchende aliaser til vores tjeneste, så se <https://support.google.com/a/answer/6297084>.

Hvis du bruger Microsoft 365 (Outlook) og ønsker at videresende alle ikke-matchende aliaser til vores tjeneste, så se <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> og <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hvordan opsætter jeg en ferieautomatisk svar (out of office auto-responder) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser og opret eller rediger det alias, du ønsker at konfigurere en ferieautomatisk svar for.
Du har mulighed for at konfigurere en startdato, slutdato, emne og besked, og aktivere eller deaktivere det når som helst:

* Almindeligt tekst-emne og besked understøttes i øjeblikket (vi bruger `striptags`-pakken internt til at fjerne eventuel HTML).
* Emnet er begrænset til 100 tegn.
* Beskeden er begrænset til 1000 tegn.
* Opsætning kræver Outbound SMTP-konfiguration (f.eks. skal du opsætte DKIM, DMARC og Return-Path DNS-poster).
  * Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Outbound SMTP-konfiguration og følg opsætningsinstruktionerne.
* Ferieautomat kan ikke aktiveres på globale vanity-domænenavne (f.eks. understøttes [engangsadresser](/disposable-addresses) ikke).
* Ferieautomat kan ikke aktiveres for aliaser med wildcard/catch-all (`*`) eller regulære udtryk.

I modsætning til mailsystemer som `postfix` (f.eks. der bruger `sieve` feriefilter-udvidelsen) – tilføjer Forward Email automatisk din DKIM-signatur, sikrer mod forbindelsesproblemer ved afsendelse af ferie-svar (f.eks. på grund af almindelige SSL/TLS-forbindelsesproblemer og ældre vedligeholdte servere), og understøtter endda Open WKD og PGP-kryptering for ferie-svar.

<!--
* For at forhindre misbrug trækkes 1 outbound SMTP-kredit for hver afsendt ferieautomatbesked.
  * Alle betalte konti inkluderer som standard 300 kreditter pr. dag. Hvis du har brug for et større antal, så kontakt os venligst.
-->

1. Vi sender kun én gang per [tilladt](#do-you-have-an-allowlist) afsender hver 4. dag (hvilket svarer til Gmail's adfærd).

   * Vores Redis-cache bruger et fingeraftryk af `alias_id` og `sender`, hvor `alias_id` er aliasets MongoDB-ID og `sender` enten er Fra-adressen (hvis tilladt) eller roddomænet i Fra-adressen (hvis ikke tilladt). For enkelhedens skyld er udløbstiden for dette fingeraftryk i cachen sat til 4 dage.

   * Vores tilgang med at bruge roddomænet udtrukket fra Fra-adressen for ikke-tilladte afsendere forhindrer misbrug fra relativt ukendte afsendere (f.eks. ondsindede aktører) i at oversvømme ferieautomatbeskeder.

2. Vi sender kun, når MAIL FROM og/eller Fra ikke er tomme og ikke indeholder (case-insensitivt) et [postmaster-brugernavn](#what-are-postmaster-addresses) (delen før @ i en e-mail).

3. Vi sender ikke, hvis den oprindelige besked havde nogen af følgende headers (case-insensitivt):

   * Headeren `auto-submitted` med en værdi forskellig fra `no`.
   * Headeren `x-auto-response-suppress` med værdien `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`.
   * Headeren `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (uanset værdi).
   * Headeren `precedence` med værdien `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

4. Vi sender ikke, hvis MAIL FROM eller Fra e-mail-adressen ender på `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

5. Vi sender ikke, hvis Fra e-mail-adressens brugernavn var `mdaemon` og den havde en case-insensitiv header `X-MDDSN-Message`.

6. Vi sender ikke, hvis der var en case-insensitiv `content-type` header med værdien `multipart/report`.

### Hvordan opsætter jeg SPF for Forward Email {#how-do-i-set-up-spf-for-forward-email}

Brug din registrators DNS-administrationsside til at sætte følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
    Vigtigt:
  </strong>
  <span>
    Hvis du bruger Gmail (f.eks. Send Mail As) eller G Suite, skal du tilføje <code>include:_spf.google.com</code> til værdien ovenfor, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du bruger Microsoft Outlook eller Live.com, skal du tilføje <code>include:spf.protection.outlook.com</code> til din SPF <strong class="notranslate">TXT</strong>-post, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Hvis du allerede har en lignende linje med "v=spf1", skal du tilføje <code>include:spf.forwardemail.net</code> lige før eventuelle eksisterende "include:host.com"-poster og før "-all" på samme linje, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Bemærk, at der er forskel på "-all" og "~all". "-" angiver, at SPF-tjekket skal FEJLE, hvis det ikke matcher, og "~" angiver, at SPF-tjekket skal SOFTFAIL. Vi anbefaler at bruge "-all"-metoden for at forhindre domæneforfalskning.
    <br /><br />
    Du skal muligvis også inkludere SPF-posten for den vært, du sender mail fra (f.eks. Outlook).
  </span>
</div>

### Hvordan opsætter jeg DKIM for Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsinstruktionerne.

### Hvordan opsætter jeg DMARC for Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsinstruktionerne.

### Hvordan ser jeg DMARC-rapporter {#how-do-i-view-dmarc-reports}

Forward Email tilbyder et omfattende DMARC-rapporteringsdashboard, der giver dig mulighed for at overvåge din e-mail-autentificeringsydelse på tværs af alle dine domæner fra en enkelt grænseflade.

**Hvad er DMARC-rapporter?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) rapporter er XML-filer sendt af modtagende mailservere, som fortæller dig, hvordan dine e-mails bliver autentificeret. Disse rapporter hjælper dig med at forstå:

* Hvor mange e-mails der sendes fra dit domæne
* Om disse e-mails består SPF- og DKIM-autentificering
* Hvilke handlinger modtagende servere foretager (accepterer, karantænerer eller afviser)
* Hvilke IP-adresser der sender e-mail på vegne af dit domæne

**Sådan får du adgang til DMARC-rapporter**

Gå til <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> DMARC-rapporter</a> for at se dit dashboard. Du kan også få adgang til domænespecifikke rapporter fra <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> ved at klikke på "DMARC"-knappen ved siden af et hvilket som helst domæne.

**Dashboard-funktioner**

DMARC-rapporteringsdashboardet tilbyder:

* **Oversigtsmålinger**: Samlede rapporter modtaget, samlede analyserede beskeder, SPF-justeringsrate, DKIM-justeringsrate og samlet beståelsesrate
* **Beskeder over tid-diagram**: Visuel trend af e-mail-volumen og autentificeringsrater over de sidste 30 dage
* **Justeringsoverblik**: Donut-diagram, der viser fordelingen mellem SPF- og DKIM-justering
* **Beskeddisposition**: Stablet søjlediagram, der viser, hvordan modtagende servere håndterede dine e-mails (accepteret, karantæneret eller afvist)
* **Seneste rapporter-tabel**: Detaljeret liste over individuelle DMARC-rapporter med filtrering og paginering
* **Domænefiltrering**: Filtrer rapporter efter specifikt domæne, når du administrerer flere domæner
**Hvorfor dette er vigtigt**

For organisationer, der administrerer flere domæner (som virksomheder, non-profit organisationer eller bureauer), er DMARC-rapporter essentielle for:

* **At identificere uautoriserede afsendere**: Opdage om nogen forfalsker dit domæne
* **At forbedre leveringsraten**: Sikre at dine legitime e-mails passerer autentificering
* **At overvåge e-mailinfrastrukturen**: Spore hvilke tjenester og IP’er der sender på dine vegne
* **Overholdelse**: Opretholde synlighed i e-mailautentificering til sikkerhedsrevisioner

I modsætning til andre tjenester, der kræver separate DMARC-overvågningsværktøjer, inkluderer Forward Email DMARC-rapportbehandling og visualisering som en del af din konto uden ekstra omkostninger.

**Krav**

* DMARC-rapporter er kun tilgængelige for betalte planer
* Dit domæne skal have DMARC konfigureret (se [Hvordan opsætter jeg DMARC for Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Rapporter indsamles automatisk, når modtagende mailservere sender dem til din konfigurerede DMARC-rapporteringsadresse

**Ugentlige e-mailrapporter**

Brugere med betalte planer modtager automatisk ugentlige DMARC-rapportoversigter via e-mail. Disse e-mails inkluderer:

* Oversigtsstatistikker for alle dine domæner
* SPF- og DKIM-justeringsrater
* Opdeling af meddelelsesdisposition (accepteret, karantæne, afvist)
* Top rapporterende organisationer (Google, Microsoft, Yahoo osv.)
* IP-adresser med justeringsproblemer, der muligvis kræver opmærksomhed
* Direkte links til dit DMARC-rapporteringsdashboard

Ugentlige rapporter sendes automatisk og kan ikke deaktiveres separat fra andre e-mailnotifikationer.

### Hvordan forbinder og konfigurerer jeg mine kontakter {#how-do-i-connect-and-configure-my-contacts}

**For at konfigurere dine kontakter, brug CardDAV-URL’en:** `https://carddav.forwardemail.net` (eller blot `carddav.forwardemail.net`, hvis din klient tillader det)

### Hvordan forbinder og konfigurerer jeg mine kalendere {#how-do-i-connect-and-configure-my-calendars}

**For at konfigurere din kalender, brug CalDAV-URL’en:** `https://caldav.forwardemail.net` (eller blot `caldav.forwardemail.net`, hvis din klient tillader det)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Hvordan tilføjer jeg flere kalendere og administrerer eksisterende kalendere {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Hvis du ønsker at tilføje flere kalendere, skal du blot tilføje en ny kalender-URL: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**vær sikker på at erstatte `calendar-name` med det ønskede kaldenavn**)

Du kan ændre en kalenders navn og farve efter oprettelse – brug blot din foretrukne kalenderapplikation (f.eks. Apple Mail eller [Thunderbird](https://thunderbird.net)).

### Hvordan forbinder og konfigurerer jeg opgaver og påmindelser {#how-do-i-connect-and-configure-tasks-and-reminders}

**For at konfigurere opgaver og påmindelser, brug samme CalDAV-URL som til kalendere:** `https://caldav.forwardemail.net` (eller blot `caldav.forwardemail.net`, hvis din klient tillader det)

Opgaver og påmindelser vil automatisk blive adskilt fra kalenderbegivenheder i deres egen "Påmindelser" eller "Opgaver" kalenderkollektion.

**Opsætningsinstruktioner efter platform:**

**macOS/iOS:**

1. Tilføj en ny CalDAV-konto i Systemindstillinger > Internetkonti (eller Indstillinger > Konti på iOS)
2. Brug `caldav.forwardemail.net` som server
3. Indtast dit Forward Email-alias og genererede kodeord
4. Efter opsætning vil du se både "Kalender" og "Påmindelser" kollektioner
5. Brug Påmindelser-appen til at oprette og administrere opgaver

**Android med Tasks.org:**

1. Installer Tasks.org fra Google Play Butik eller F-Droid
2. Gå til Indstillinger > Synkronisering > Tilføj konto > CalDAV
3. Indtast server: `https://caldav.forwardemail.net`
4. Indtast dit Forward Email-alias og genererede kodeord
5. Tasks.org vil automatisk finde dine opgavekalendere

**Thunderbird:**

1. Installer Lightning-tilføjelsen, hvis den ikke allerede er installeret
2. Opret en ny kalender med typen "CalDAV"
3. Brug URL: `https://caldav.forwardemail.net`
4. Indtast dine Forward Email-legitimationsoplysninger
5. Både begivenheder og opgaver vil være tilgængelige i kalendergrænsefladen

### Hvorfor kan jeg ikke oprette opgaver i macOS Påmindelser {#why-cant-i-create-tasks-in-macos-reminders}
Hvis du har problemer med at oprette opgaver i macOS Påmindelser, så prøv disse fejlfindingstrin:

1. **Tjek kontoopsætning**: Sørg for, at din CalDAV-konto er korrekt konfigureret med `caldav.forwardemail.net`

2. **Bekræft separate kalendere**: Du bør se både "Kalender" og "Påmindelser" i din konto. Hvis du kun ser "Kalender", er opgavestøtten muligvis ikke fuldt aktiveret endnu.

3. **Opdater konto**: Prøv at fjerne og genindsætte din CalDAV-konto i Systemindstillinger > Internetkonti

4. **Tjek serverforbindelse**: Test at du kan få adgang til `https://caldav.forwardemail.net` i din browser

5. **Bekræft legitimationsoplysninger**: Sørg for, at du bruger den korrekte alias-email og det genererede kodeord (ikke din kontoadgangskode)

6. **Tving synkronisering**: I Påmindelser-appen, prøv at oprette en opgave og derefter manuelt opdatere synkroniseringen

**Almindelige problemer:**

* **"Påmindelseskalender ikke fundet"**: Serveren kan have brug for et øjeblik til at oprette Påmindelser-samlingen ved første adgang
* **Opgaver synkroniseres ikke**: Tjek at begge enheder bruger de samme CalDAV-konto legitimationsoplysninger
* **Blandet indhold**: Sørg for, at opgaver oprettes i "Påmindelser"-kalenderen, ikke den generelle "Kalender"

### Hvordan opsætter jeg Tasks.org på Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org er en populær open source opgavestyringsapp, der fungerer fremragende med Forward Emails CalDAV-opgavestøtte.

**Installation og opsætning:**

1. **Installer Tasks.org**:
   * Fra Google Play Butik: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Fra F-Droid: [Tasks.org på F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Konfigurer CalDAV-synkronisering**:
   * Åbn Tasks.org
   * Gå til ☰ Menu > Indstillinger > Synkronisering
   * Tryk på "Tilføj konto"
   * Vælg "CalDAV"

3. **Indtast Forward Email-indstillinger**:
   * **Server-URL**: `https://caldav.forwardemail.net`
   * **Brugernavn**: Dit Forward Email-alias (f.eks. `you@yourdomain.com`)
   * **Adgangskode**: Dit alias-specifikke genererede kodeord
   * Tryk på "Tilføj konto"

4. **Kontoopdagelse**:
   * Tasks.org vil automatisk finde dine opgavekalendere
   * Du bør se din "Påmindelser"-samling dukke op
   * Tryk på "Abonner" for at aktivere synkronisering for opgavekalenderen

5. **Test synkronisering**:
   * Opret en testopgave i Tasks.org
   * Tjek at den vises i andre CalDAV-klienter (som macOS Påmindelser)
   * Bekræft at ændringer synkroniseres begge veje

**Tilgængelige funktioner:**

* ✅ Oprettelse og redigering af opgaver
* ✅ Forfaldsdatoer og påmindelser
* ✅ Fuldførelse og status for opgaver
* ✅ Prioritetsniveauer
* ✅ Underopgaver og opgavehierarki
* ✅ Tags og kategorier
* ✅ To-vejs synkronisering med andre CalDAV-klienter

**Fejlfinding:**

* Hvis ingen opgavekalendere vises, prøv at opdatere manuelt i Tasks.org-indstillinger
* Sørg for, at du har mindst én opgave oprettet på serveren (du kan oprette en i macOS Påmindelser først)
* Tjek netværksforbindelsen til `caldav.forwardemail.net`

### Hvordan opsætter jeg SRS for Forward Email {#how-do-i-set-up-srs-for-forward-email}

Vi konfigurerer automatisk [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – du behøver ikke gøre dette selv.

### Hvordan opsætter jeg MTA-STS for Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Se venligst [vores sektion om MTA-STS](#do-you-support-mta-sts) for mere information.

### Hvordan tilføjer jeg et profilbillede til min emailadresse {#how-do-i-add-a-profile-picture-to-my-email-address}

Hvis du bruger Gmail, så følg disse trin nedenfor:

1. Gå til <https://google.com> og log ud af alle emailkonti
2. Klik på "Log ind" og i dropdown-menuen klik på "anden konto"
3. Vælg "Brug en anden konto"
4. Vælg "Opret konto"
5. Vælg "Brug i stedet min nuværende emailadresse"
6. Indtast din emailadresse med dit eget domæne
7. Hent bekræftelsesemailen sendt til din emailadresse
8. Indtast bekræftelseskoden fra denne email
9. Udfyld profiloplysninger for din nye Google-konto
10. Accepter alle privatlivs- og brugsbetingelser
11. Gå til <https://google.com> og klik øverst til højre på dit profilikon, og klik på "ændre"-knappen
12. Upload et nyt foto eller avatar til din konto
13. Ændringerne tager cirka 1-2 timer at slå igennem, men kan nogle gange ske meget hurtigt.
14. Send en testemail, og profilbilledet skulle nu vises.
## Avancerede funktioner {#advanced-features}

### Understøtter I nyhedsbreve eller mailinglister til markedsføringsrelateret email {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, du kan læse mere på <https://forwardemail.net/guides/newsletter-with-listmonk>.

Bemærk venligst, at for at opretholde IP-omdømme og sikre leveringsdygtighed, har Forward Email en manuel gennemgangsproces pr. domæne for **godkendelse af nyhedsbreve**. Send en email til <support@forwardemail.net> eller åbn en [hjælpeanmodning](https://forwardemail.net/help) for godkendelse. Dette tager typisk mindre end 24 timer, hvor de fleste anmodninger bliver godkendt inden for 1-2 timer. I den nærmeste fremtid sigter vi mod at gøre denne proces øjeblikkelig med yderligere spamkontroller og alarmering. Denne proces sikrer, at dine emails når indbakken, og at dine beskeder ikke bliver markeret som spam.

### Understøtter I afsendelse af email via API {#do-you-support-sending-email-with-api}

Ja, fra maj 2023 understøtter vi afsendelse af email via API som et tillæg for alle betalende brugere.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a>, og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Udgående SMTP-grænser</a> &ndash; din brug betragtes som anerkendelse og accept.
  </span>
</div>

Se venligst vores afsnit om [Emails](/email-api#outbound-emails) i vores API-dokumentation for muligheder, eksempler og mere indsigt.

For at sende udgående email med vores API skal du bruge dit API-token, som findes under [Min Sikkerhed](/my-account/security).

### Understøtter I modtagelse af email via IMAP {#do-you-support-receiving-email-with-imap}

Ja, fra den 16. oktober 2023 understøtter vi modtagelse af email via IMAP som et tillæg for alle betalende brugere.  **Læs venligst vores dybdegående artikel** om [hvordan vores krypterede SQLite-mailboksfunktion fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> &ndash; din brug betragtes som anerkendelse og accept.
  </span>
</div>

1. Opret en ny alias for dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser (f.eks. <code><hello@example.com></code>)

2. Klik på <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> ved siden af den nyligt oprettede alias. Kopiér til dit udklipsholder og gem sikkert den genererede adgangskode, der vises på skærmen.

3. Brug din foretrukne email-applikation til at tilføje eller konfigurere en konto med din nyligt oprettede alias (f.eks. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Vi anbefaler at bruge <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, eller <a href="/blog/open-source" class="alert-link" target="_blank">et open-source og privatlivsfokuseret alternativ</a>.</span>
   </div>

4. Når du bliver bedt om IMAP-servernavn, indtast `imap.forwardemail.net`

5. Når du bliver bedt om IMAP-serverport, indtast `993` (SSL/TLS) – se [alternative IMAP-porte](/faq#what-are-your-imap-server-configuration-settings) om nødvendigt
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Hvis du bruger Thunderbird, skal du sikre, at "Forbindelsessikkerhed" er sat til "SSL/TLS" og godkendelsesmetoden er sat til "Normal adgangskode".</span>
   </div>
6. Når du bliver bedt om IMAP-serveradgangskode, indsæt adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i trin 2 ovenfor

7. **Gem dine indstillinger** – hvis du har problemer, så <a href="/help">kontakt os</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

</div>

### Understøtter I POP3 {#do-you-support-pop3}

Ja, fra og med den 4. december 2023 understøtter vi [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) som et tillægsmodul for alle betalende brugere.  **Læs venligst vores dybdegående artikel** om [hvordan vores krypterede SQLite-mailboksfunktion fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> &ndash; din brug betragtes som anerkendelse og accept.
  </span>
</div>

1. Opret et nyt alias for dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

2. Klik på <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ved siden af det nyligt oprettede alias.  Kopiér til dit udklipsholder og gem sikkert den viste adgangskode.

3. Brug din foretrukne e-mail-applikation til at tilføje eller konfigurere en konto med dit nyligt oprettede alias (f.eks. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Vi anbefaler at bruge <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et open source og privatlivsfokuseret alternativ</a>.</span>
   </div>

4. Når du bliver bedt om POP3-servernavn, indtast `pop3.forwardemail.net`

5. Når du bliver bedt om POP3-serverport, indtast `995` (SSL/TLS) – se [alternative POP3-porte](/faq#what-are-your-pop3-server-configuration-settings) om nødvendigt
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Hvis du bruger Thunderbird, skal du sikre, at "Forbindelsessikkerhed" er sat til "SSL/TLS" og godkendelsesmetoden er sat til "Normal adgangskode".</span>
   </div>

6. Når du bliver bedt om POP3-serveradgangskode, indsæt adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> i trin 2 ovenfor

7. **Gem dine indstillinger** – hvis du har problemer, så <a href="/help">kontakt os</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

</div>

### Understøtter I kalendere (CalDAV) {#do-you-support-calendars-caldav}

Ja, fra og med den 5. februar 2024 har vi tilføjet denne funktion.  Vores server er `caldav.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.
Det understøtter både IPv4 og IPv6 og er tilgængeligt over port `443` (HTTPS).

| Login    | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com`         | E-mailadresse på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>.       |
| Adgangskode | `************************` | Alias-specifikt genereret adgangskode.                                                                                                                                                     |

For at bruge kalenderunderstøttelse skal **brugeren** være e-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **adgangskoden** skal være et alias-specifikt genereret kodeord.

### Understøtter I opgaver og påmindelser (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ja, fra og med den 14. oktober 2025 har vi tilføjet CalDAV VTODO-understøttelse for opgaver og påmindelser. Dette bruger den samme server som vores kalenderunderstøttelse: `caldav.forwardemail.net`.

Vores CalDAV-server understøtter både kalenderbegivenheder (VEVENT) og opgaver (VTODO) komponenter ved brug af **forenede kalendere**. Det betyder, at hver kalender kan indeholde både begivenheder og opgaver, hvilket giver maksimal fleksibilitet og kompatibilitet på tværs af alle CalDAV-klienter.

**Sådan fungerer kalendere og lister:**

* **Hver kalender understøtter både begivenheder og opgaver** - Du kan tilføje begivenheder, opgaver eller begge dele til enhver kalender
* **Apple Påmindelser-lister** - Hver liste, du opretter i Apple Påmindelser, bliver en separat kalender på serveren
* **Flere kalendere** - Du kan oprette så mange kalendere, som du har brug for, hver med sit eget navn, farve og organisering
* **Synkronisering på tværs af klienter** - Opgaver og begivenheder synkroniseres problemfrit mellem alle kompatible klienter

**Understøttede opgaveklienter:**

* **macOS Påmindelser** - Fuld native understøttelse af oprettelse, redigering, færdiggørelse og synkronisering af opgaver
* **iOS Påmindelser** - Fuld native understøttelse på alle iOS-enheder
* **Tasks.org (Android)** - Populær open source opgavestyringsapp med CalDAV-synkronisering
* **Thunderbird** - Opgave- og kalenderunderstøttelse i desktop e-mail-klient
* **Enhver CalDAV-kompatibel opgavestyringsapp** - Standard VTODO-komponentunderstøttelse

**Understøttede opgavefunktioner:**

* Oprettelse, redigering og sletning af opgaver
* Forfaldsdatoer og startdatoer
* Opgavens færdiggørelsesstatus (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Prioritetsniveauer for opgaver
* Gentagne opgaver
* Opgavebeskrivelser og noter
* Synkronisering på tværs af flere enheder
* Underopgaver med RELATED-TO-egenskab
* Opgavepåmindelser med VALARM

Loginoplysningerne er de samme som for kalenderunderstøttelse:

| Login    | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com`         | E-mailadresse på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>.       |
| Adgangskode | `************************` | Alias-specifikt genereret adgangskode.                                                                                                                                                     |

**Vigtige bemærkninger:**

* **Hver Påmindelser-liste er en separat kalender** - Når du opretter en ny liste i Apple Påmindelser, oprettes der en ny kalender på CalDAV-serveren
* **Thunderbird-brugere** - Du skal manuelt abonnere på hver kalender/liste, du ønsker at synkronisere, eller bruge kalenderens hjem-URL: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple-brugere** - Kalenderopdagelse sker automatisk, så alle dine kalendere og lister vises i Kalender.app og Påmindelser.app
* **Forenede kalendere** - Alle kalendere understøtter både begivenheder og opgaver, hvilket giver dig fleksibilitet i, hvordan du organiserer dine data
### Understøtter I kontakter (CardDAV) {#do-you-support-contacts-carddav}

Ja, fra den 12. juni 2025 har vi tilføjet denne funktion. Vores server er `carddav.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig over port `443` (HTTPS).

| Login    | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com`         | E-mailadresse på et alias, der findes for domænet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a>. |
| Adgangskode | `************************` | Alias-specifik genereret adgangskode.                                                                                                                                                      |

For at bruge kontaktunderstøttelse skal **brugeren** være e-mailadressen på et alias, der findes for domænet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> – og **adgangskoden** skal være en alias-specifik genereret adgangskode.

### Understøtter I afsendelse af e-mail med SMTP {#do-you-support-sending-email-with-smtp}

Ja, fra maj 2023 understøtter vi afsendelse af e-mail med SMTP som et tillæg for alle betalende brugere.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Sørg venligst for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Udgående SMTP-grænser</a> &ndash; din brug betragtes som anerkendelse og accept.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du bruger Gmail, henvises til vores <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Send Mail As med Gmail guide</a>. Hvis du er udvikler, henvises til vores <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API-dokumentation</a>.
  </span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsinstruktionerne

2. Opret et nyt alias for dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

3. Klik på <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> ved siden af det nyligt oprettede alias. Kopiér til dit udklipsholder og gem sikkert den viste genererede adgangskode.

4. Brug din foretrukne e-mailapplikation til at tilføje eller konfigurere en konto med dit nyligt oprettede alias (f.eks. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Vi anbefaler at bruge <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et open source og privatlivsfokuseret alternativ</a>.</span>
   </div>
5. Når du bliver bedt om SMTP-servernavn, indtast `smtp.forwardemail.net`

6. Når du bliver bedt om SMTP-serverport, indtast `465` (SSL/TLS) – se [alternative SMTP-porte](/faq#what-are-your-smtp-server-configuration-settings) om nødvendigt
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Hvis du bruger Thunderbird, skal du sikre dig, at "Forbindelsessikkerhed" er sat til "SSL/TLS" og godkendelsesmetoden er sat til "Normal adgangskode".</span>
   </div>

7. Når du bliver bedt om SMTP-serveradgangskode, indsæt adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> i trin 3 ovenfor

8. **Gem dine indstillinger og send din første testmail** – hvis du har problemer, så <a href="/help">kontakt os</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Bemærk venligst, at for at opretholde IP-ry og sikre leveringsdygtighed har vi en manuel gennemgangsproces på domæneniveau for godkendelse af udgående SMTP. Dette tager typisk mindre end 24 timer, hvor de fleste anmodninger bliver godkendt inden for 1-2 timer. I den nærmeste fremtid sigter vi mod at gøre denne proces øjeblikkelig med yderligere spamkontroller og alarmering. Denne proces sikrer, at dine e-mails når indbakken, og at dine beskeder ikke bliver markeret som spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

</div>

### Understøtter I OpenPGP/MIME, end-to-end kryptering ("E2EE") og Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, vi understøtter [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end kryptering ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) og opdagelse af offentlige nøgler ved hjælp af [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Du kan konfigurere OpenPGP ved hjælp af [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) eller [hoste dine egne nøgler](https://wiki.gnupg.org/WKDHosting) (se [denne gist for WKD-serveropsætning](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-opslag caches i 1 time for at sikre rettidig levering af e-mail → derfor, hvis du tilføjer, ændrer eller fjerner din WKD-nøgle, så send os venligst en e-mail på `support@forwardemail.net` med din e-mailadresse, så vi manuelt kan rydde cachen.
* Vi understøtter PGP-kryptering for beskeder, der videresendes via WKD-opslag eller ved brug af en uploadet PGP-nøgle i vores interface.
* Uploadede nøgler har forrang, så længe PGP-afkrydsningsfeltet er aktiveret/afkrydset.
* Beskeder sendt til webhooks er i øjeblikket ikke krypteret med PGP.
* Hvis du har flere aliaser, der matcher en given videresendelsesadresse (f.eks. regex/wildcard/præcis kombination), og hvis mere end én af disse indeholder en uploadet PGP-nøgle og har PGP markeret → så sender vi dig en fejlmeddelelse via e-mail og krypterer ikke beskeden med din uploadede PGP-nøgle. Dette er meget sjældent og gælder normalt kun avancerede brugere med komplekse aliasregler.
* **PGP-kryptering vil ikke blive anvendt på e-mail-videresendelse gennem vores MX-servere, hvis afsenderen havde en DMARC-politik om afvisning. Hvis du har brug for PGP-kryptering på *alle* mails, foreslår vi at bruge vores IMAP-service og konfigurere din PGP-nøgle for dit alias til indgående mail.**

**Du kan validere din Web Key Directory-opsætning på <https://wkd.chimbosonic.com/> (open-source) eller <https://www.webkeydirectory.com/> (proprietær).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatisk kryptering:
  </strong>
  <span>Hvis du bruger vores <a href="#do-you-support-sending-email-with-smtp" class="alert-link">udgående SMTP-service</a> og sender ukrypterede beskeder, vil vi automatisk forsøge at kryptere beskeder på modtagerbasis ved hjælp af <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Du skal følge alle nedenstående trin for at aktivere OpenPGP for dit brugerdefinerede domænenavn.
  </span>
</div>

1. Download og installer din e-mailklients anbefalede plugin nedenfor:

   | Email Client    | Platform | Recommended Plugin                                                                                                                                                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop  | [Konfigurer OpenPGP i Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird har indbygget support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | Browser  | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens)                                                                            | Gmail understøtter ikke OpenPGP, men du kan downloade den open source plugin [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail understøtter ikke OpenPGP, men du kan downloade den open source plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietær licens)                           | Apple Mail understøtter ikke OpenPGP, men du kan downloade den open source plugin [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Outlooks desktop-mailklient understøtter ikke OpenPGP, men du kan downloade den open source plugin [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook         | Browser  | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens)                                                                            | Outlooks webbaserede mailklient understøtter ikke OpenPGP, men du kan downloade den open source plugin [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android         | Mobile   | [OpenKeychain](https://www.openkeychain.org/) eller [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Android mailklienter](/blog/open-source/android-email-clients) såsom [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) og [FairEmail](https://github.com/M66B/FairEmail) understøtter begge den open source plugin [OpenKeychain](https://www.openkeychain.org/). Du kan alternativt bruge den open source (proprietær licens) plugin [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Browser  | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens)                                                                            | Du kan downloade den open source browserudvidelse [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | Browser  | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens)                                                                            | Du kan downloade den open source browserudvidelse [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | Browser  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Du kan downloade den open source browserudvidelse [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | Browser  | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens)                                                                            | Du kan downloade den open source browserudvidelse [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Balsa           | Desktop  | [Konfigurer OpenPGP i Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa har indbygget support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | Desktop  | [Konfigurer OpenPGP i KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail har indbygget support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | Desktop  | [Konfigurer OpenPGP i Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution har indbygget support for OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | Desktop  | [Konfigurer gpg i Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Du kan bruge det open source [gpg kommandolinjeværktøj](https://www.gnupg.org/download/) til at generere en ny nøgle fra kommandolinjen.                                                                                                                                                                                                                                                                                                            |
2. Åbn plugin'et, opret din offentlige nøgle, og konfigurer din e-mailklient til at bruge den.

3. Upload din offentlige nøgle på <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Du kan besøge <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> for at administrere din nøgle i fremtiden.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Valgfrit tilføjelsesmodul:
     </strong>
     <span>
       Hvis du bruger vores <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">krypterede lager (IMAP/POP3)</a> service og ønsker, at <i>alle</i> e-mails, der er gemt i din (allerede krypterede) SQLite-database, skal krypteres med din offentlige nøgle, så gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser (f.eks. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Rediger <i class="fa fa-angle-right"></i> OpenPGP og upload din offentlige nøgle.
     </span>
   </div>

4. Tilføj en ny `CNAME`-post til dit domænenavn (f.eks. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Navn/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Type</th>
         <th>Svar/Værdi</th>
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
       Tip:
     </strong>
     <span>Hvis dit alias bruger vores <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable domæner</a> (f.eks. <code>hideaddress.net</code>), kan du springe dette trin over.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har gennemført alle trin med succes.
    </span>
  </div>
</div>

### Understøtter I S/MIME-kryptering {#do-you-support-smime-encryption}

Ja, vi understøtter [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) kryptering som defineret i [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME giver end-to-end kryptering ved brug af X.509-certifikater, som er bredt understøttet af virksomheders e-mailklienter.

Vi understøtter både RSA- og ECC (Elliptic Curve Cryptography) certifikater:

* **RSA-certifikater**: minimum 2048-bit, anbefalet 4096-bit
* **ECC-certifikater**: P-256, P-384 og P-521 NIST-kurver

For at konfigurere S/MIME-kryptering for dit alias:

1. Skaff et S/MIME-certifikat fra en betroet certifikatmyndighed (CA) eller generer et selvsigneret certifikat til test.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Gratis S/MIME-certifikater er tilgængelige fra udbydere som <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> eller <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Eksporter dit certifikat i PEM-format (kun det offentlige certifikat, ikke den private nøgle).

3. Gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser (f.eks. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Rediger <i class="fa fa-angle-right"></i> S/MIME og upload dit offentlige certifikat.
4. Når det er konfigureret, vil alle indkommende e-mails til dit alias blive krypteret ved hjælp af dit S/MIME-certifikat, før de gemmes eller videresendes.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Bemærk:
     </strong>
     <span>
       S/MIME-kryptering anvendes på indkommende beskeder, der ikke allerede er krypterede. Hvis en besked allerede er krypteret med OpenPGP eller S/MIME, vil den ikke blive genkrypteret.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vigtigt:
     </strong>
     <span>
       S/MIME-kryptering vil ikke blive anvendt på e-mail-videresendelse gennem vores MX-servere, hvis afsenderen havde en DMARC-politik om afvisning. Hvis du har brug for S/MIME-kryptering på <em>alle</em> mails, foreslår vi at bruge vores IMAP-service og konfigurere dit S/MIME-certifikat for dit alias til indgående mail.
     </span>
   </div>

Følgende e-mail-klienter har indbygget S/MIME-understøttelse:

| E-mail-klient     | Platform | Noter                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Indbygget S/MIME-understøttelse. Gå til Mail > Preferences > Accounts > din konto > Trust for at konfigurere certifikater.      |
| Apple Mail        | iOS      | Indbygget S/MIME-understøttelse. Gå til Settings > Mail > Accounts > din konto > Advanced > S/MIME for at konfigurere.          |
| Microsoft Outlook | Windows  | Indbygget S/MIME-understøttelse. Gå til File > Options > Trust Center > Trust Center Settings > Email Security for at konfigurere. |
| Microsoft Outlook | macOS    | Indbygget S/MIME-understøttelse. Gå til Tools > Accounts > Advanced > Security for at konfigurere.                                 |
| Thunderbird       | Desktop  | Indbygget S/MIME-understøttelse. Gå til Account Settings > End-To-End Encryption > S/MIME for at konfigurere.                      |
| GNOME Evolution   | Desktop  | Indbygget S/MIME-understøttelse. Gå til Edit > Preferences > Mail Accounts > din konto > Security for at konfigurere.           |
| KMail             | Desktop  | Indbygget S/MIME-understøttelse. Gå til Settings > Configure KMail > Identities > din identitet > Cryptography for at konfigurere. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Tillykke!
    </strong>
    <span>
      Du har med succes konfigureret S/MIME-kryptering for dit alias.
    </span>
  </div>
</div>

### Understøtter I Sieve e-mail filtrering {#do-you-support-sieve-email-filtering}

Ja! Vi understøtter [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) e-mail filtrering som defineret i [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve er et kraftfuldt, standardiseret scriptsprog til server-side e-mail filtrering, som gør det muligt automatisk at organisere, filtrere og svare på indkommende beskeder.

#### Understøttede Sieve-udvidelser {#supported-sieve-extensions}

Vi understøtter et omfattende sæt af Sieve-udvidelser:

| Udvidelse                   | RFC                                                                                    | Beskrivelse                                      |
| --------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Fil beskeder ind i specifikke mapper             |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Afvis beskeder med en fejl                        |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatisk ferie-/fraværsbesvarelse               |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Finmasket ferie-respons intervaller               |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Sæt IMAP-flags (\Seen, \Flagged, osv.)            |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Test af afsender/modtager i kuvert                |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Test af beskedens indhold                          |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Gem og brug variabler i scripts                    |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Relationelle sammenligninger (større end, mindre end) |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Numeriske sammenligninger                          |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Kopier beskeder under omdirigering                 |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Tilføj eller slet beskedhoveder                    |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Test dato/tid værdier                              |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Adgang til specifikke header-forekomster           |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Regulære udtryk matchning                          |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Send notifikationer (f.eks. mailto:)               |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Adgang til miljøinformation                        |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Test postkasseeksistens, opret postkasser          |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Fil ind i special-use postkasser (\Junk, \Trash)  |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Opdag dublerede beskeder                           |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Test for udvidelses tilgængelighed                 |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Adgang til bruger+detalje adressedele              |
#### Extensions Ikke Understøttet {#extensions-not-supported}

Følgende extensions understøttes ikke i øjeblikket:

| Extension                                                       | Årsag                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | Sikkerhedsrisiko (script-injektion) og kræver global script-lagring |
| `mboxmetadata` / `servermetadata`                               | Kræver IMAP METADATA extension-understøttelse                       |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Kompleks MIME-træ-manipulation er endnu ikke implementeret          |

#### Eksempel på Sieve Scripts {#example-sieve-scripts}

**Filtrer nyhedsbreve til en mappe:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatisk svar ved ferie:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Jeg er i øjeblikket ude af kontoret og vil svare, når jeg er tilbage.";
```

**Marker beskeder fra vigtige afsendere:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Afvis spam med specifikke emner:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Besked afvist på grund af spam-indhold.";
}
```

#### Håndtering af Sieve Scripts {#managing-sieve-scripts}

Du kan håndtere dine Sieve scripts på flere måder:

1. **Web Interface**: Gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser <i class="fa fa-angle-right"></i> Sieve Scripts for at oprette og administrere scripts.

2. **ManageSieve Protokol**: Forbind med en hvilken som helst ManageSieve-kompatibel klient (som Thunderbirds Sieve-tilføjelse eller [sieve-connect](https://github.com/philpennock/sieve-connect)) til `imap.forwardemail.net`. Brug port `2190` med STARTTLS (anbefales til de fleste klienter) eller port `4190` med implicit TLS.

3. **API**: Brug vores [REST API](/api#sieve-scripts) til programmatisk at administrere scripts.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bemærk:
  </strong>
  <span>
    Sieve-filtrering anvendes på indkommende beskeder, før de gemmes i din postkasse. Scripts udføres i prioriteret rækkefølge, og den første matchende handling bestemmer, hvordan beskeden håndteres.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Sikkerhed:
  </strong>
  <span>
    Af sikkerhedshensyn er videresendelseshandlinger begrænset til 10 pr. script og 100 pr. dag. Feriesvar er ratebegrænset for at forhindre misbrug.
  </span>
</div>

### Understøtter I MTA-STS {#do-you-support-mta-sts}

Ja, fra den 2. marts 2023 understøtter vi [MTA-STS](https://www.hardenize.com/blog/mta-sts). Du kan bruge [denne skabelon](https://github.com/jpawlowski/mta-sts.template), hvis du ønsker at aktivere det på dit domæne.

Vores konfiguration kan findes offentligt på GitHub på <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Understøtter I passkeys og WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Fra den 13. december 2023 har vi tilføjet understøttelse af passkeys [på grund af stor efterspørgsel](https://github.com/orgs/forwardemail/discussions/182).

Passkeys giver dig mulighed for sikkert at logge ind uden at kræve adgangskode og tofaktorautentificering.

Du kan bekræfte din identitet med berøring, ansigtsgenkendelse, enhedsbaseret adgangskode eller PIN-kode.

Vi tillader, at du administrerer op til 30 passkeys på én gang, så du nemt kan logge ind med alle dine enheder.

Lær mere om passkeys på følgende links:

* [Log ind på dine applikationer og hjemmesider med passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Brug passkeys til at logge ind på apps og hjemmesider på iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikel om Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Understøtter I bedste praksis for e-mail {#do-you-support-email-best-practices}

Ja. Vi har indbygget understøttelse for SPF, DKIM, DMARC, ARC og SRS på alle planer. Vi har også arbejdet intensivt sammen med de oprindelige forfattere af disse specifikationer og andre e-mail-eksperter for at sikre perfektion og høj leveringsrate.

### Understøtter I bounce webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Leder du efter dokumentation om e-mail webhooks? Se <a href="/faq#do-you-support-webhooks" class="alert-link">Understøtter I webhooks?</a> for mere indsigt.
  <span>
  </span>
</div>

Ja, fra og med den 14. august 2024 har vi tilføjet denne funktion. Du kan nu gå til Min Konto → Domæner → Indstillinger → Bounce Webhook URL og konfigurere en `http://` eller `https://` URL, som vi sender en `POST`-anmodning til, hver gang udgående SMTP-e-mails afvises.

Dette er nyttigt for dig til at administrere og overvåge din udgående SMTP – og kan bruges til at vedligeholde abonnenter, afmeldinger og opdage, når bounces opstår.

Bounce webhook payloads sendes som JSON med disse egenskaber:

* `email_id` (String) - e-mail ID, der svarer til en e-mail i Min Konto → E-mails (udgående SMTP)
* `list_id` (String) - værdien af `List-ID` headeren (case-insensitive), hvis nogen, fra den oprindelige udgående e-mail
* `list_unsubscribe` (String) - værdien af `List-Unsubscribe` headeren (case-insensitive), hvis nogen, fra den oprindelige udgående e-mail
* `feedback_id` (String) - værdien af `Feedback-ID` headeren (case-insensitive), hvis nogen, fra den oprindelige udgående e-mail
* `recipient` (String) - e-mailadressen på modtageren, der blev afvist eller fik fejl
* `message` (String) - en detaljeret fejlmeddelelse for bounce
* `response` (String) - SMTP-responsmeddelelsen
* `response_code` (Number) - den fortolkede SMTP-responskode
* `truth_source` (String) - hvis responskoden kom fra en betroet kilde, vil denne værdi være udfyldt med roddomænenavnet (f.eks. `google.com` eller `yahoo.com`)
* `bounce` (Object) - et objekt med følgende egenskaber, der detaljerer bounce- og afvisningsstatus
  * `action` (String) - bounce-handling (f.eks. `"reject"`)
  * `message` (String) - bounce-årsag (f.eks. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - bounce-kategori (f.eks. `"block"`)
  * `code` (Number) - bounce-statuskode (f.eks. `554`)
  * `status` (String) - bounce-kode fra responsmeddelelsen (f.eks. `5.7.1`)
  * `line` (Number) - fortolket linjenummer, hvis nogen, [fra Zone-MTA bounce parse listen](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (f.eks. `526`)
* `headers` (Object) - nøgle-værdi par af headers for den udgående e-mail
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formateret dato for, hvornår bounce-fejlen opstod

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

Her er et par yderligere noter vedrørende bounce webhooks:

* Hvis webhook payload indeholder en `list_id`, `list_unsubscribe` eller `feedback_id` værdi, bør du tage passende handling for at fjerne `recipient` fra listen, hvis nødvendigt.
  * Hvis `bounce.category` værdien var en af `"block"`, `"recipient"`, `"spam"` eller `"virus"`, bør du helt sikkert fjerne brugeren fra listen.
* Hvis du har brug for at verificere webhook payloads (for at sikre, at de faktisk kommer fra vores server), kan du [opslå den eksterne klient IP-adresse klient hostname ved hjælp af en reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det burde være `smtp.forwardemail.net`.
  * Du kan også tjekke IP'en mod [vores offentliggjorte IP-adresser](#what-are-your-servers-ip-addresses).
  * Gå til Min Konto → Domæner → Indstillinger → Webhook Signature Payload Verification Key for at hente din webhook-nøgle.
    * Du kan rotere denne nøgle når som helst af sikkerhedsmæssige årsager.
    * Beregn og sammenlign `X-Webhook-Signature` værdien fra vores webhook-anmodning med den beregnede body-værdi ved hjælp af denne nøgle. Et eksempel på, hvordan man gør dette, findes i [dette Stack Overflow-indlæg](https://stackoverflow.com/a/68885281).
  * Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mere indsigt.
* Vi venter op til `5` sekunder på, at din webhook-endpoint svarer med en `200` statuskode, og vi vil forsøge igen op til `1` gang.
* Hvis vi opdager, at din bounce webhook URL har en fejl, mens vi prøver at sende en anmodning til den, sender vi dig en høfligheds-e-mail en gang om ugen.
### Understøtter I webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Leder du efter dokumentation om bounce webhooks? Se <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Understøtter I bounce webhooks?</a> for mere indsigt.
  <span>
  </span>
</div>

Ja, fra den 15. maj 2020 har vi tilføjet denne funktion. Du kan ganske enkelt tilføje webhook(s) præcis som du ville med enhver modtager! Sørg venligst for, at du har "http" eller "https" protokollen foran webhook'ens URL.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Forbedret privatlivsbeskyttelse:
  </strong>
  <span>
    Hvis du er på en betalt plan (som har forbedret privatlivsbeskyttelse), så gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> og klik på "Aliasser" ved siden af dit domæne for at konfigurere dine webhooks. Hvis du vil lære mere om betalte planer, se vores <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Priser</a> side. Ellers kan du fortsætte med at følge instruktionerne nedenfor.
  </span>
</div>

Hvis du er på gratis planen, så tilføj blot en ny DNS <strong class="notranslate">TXT</strong> post som vist nedenfor:

For eksempel, hvis jeg ønsker at alle e-mails, der går til `alias@example.com`, skal videresendes til en ny [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) test-endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Eller måske ønsker du, at alle e-mails, der går til `example.com`, skal videresendes til dette endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Her er yderligere noter vedrørende webhooks:**

* Hvis du har brug for at verificere webhook payloads (for at sikre, at de faktisk kommer fra vores server), kan du [opløse den eksterne klient IP-adresse klient hostname ved hjælp af et reverse lookup](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal være enten `mx1.forwardemail.net` eller `mx2.forwardemail.net`.
  * Du kan også tjekke IP'en mod [vores offentliggjorte IP-adresser](#what-are-your-servers-ip-addresses).
  * Hvis du er på en betalt plan, så gå til Min Konto → Domæner → Indstillinger → Webhook Signature Payload Verification Key for at få din webhook-nøgle.
    * Du kan rotere denne nøgle når som helst af sikkerhedsmæssige årsager.
    * Beregn og sammenlign `X-Webhook-Signature` værdien fra vores webhook-anmodning med den beregnede body-værdi ved hjælp af denne nøgle. Et eksempel på, hvordan man gør dette, findes i [dette Stack Overflow indlæg](https://stackoverflow.com/a/68885281).
  * Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mere indsigt.
* Hvis en webhook ikke svarer med en `200` statuskode, gemmer vi dens svar i [fejlloggen oprettet](#do-you-store-error-logs) – hvilket er nyttigt til fejlfinding.
* Webhook HTTP-anmodninger vil forsøge op til 3 gange ved hver SMTP-forbindelsesforsøg, med en maksimal timeout på 60 sekunder pr. endpoint POST-anmodning. **Bemærk at dette ikke betyder, at den kun prøver 3 gange**, den vil faktisk prøve kontinuerligt over tid ved at sende en SMTP-kode 421 (som indikerer til afsenderen at prøve igen senere) efter det 3. mislykkede HTTP POST-anmodningsforsøg. Det betyder, at e-mailen vil blive forsøgt kontinuerligt i dage, indtil en 200 statuskode opnås.
* Vi vil automatisk prøve igen baseret på standard status- og fejlkoder brugt i [superagents retry metode](https://ladjs.github.io/superagent/#retrying-requests) (vi er vedligeholdere).
* Vi grupperer webhook HTTP-anmodninger til samme endpoint i én anmodning i stedet for flere for at spare ressourcer og øge svartiden. For eksempel, hvis du sender en e-mail til <webhook1@example.com>, <webhook2@example.com>, og <webhook3@example.com>, og alle disse er konfigureret til at ramme det samme *præcise* endpoint URL, vil kun én anmodning blive lavet. Vi grupperer efter præcis endpoint-match med streng lighed.
* Bemærk, at vi bruger [mailparser](https://nodemailer.com/extras/mailparser/) bibliotekets "simpleParser" metode til at parse beskeden til et JSON-venligt objekt.
* Rå e-mail værdi som en String gives som egenskaben "raw".
* Autentificeringsresultater gives som egenskaberne "dkim", "spf", "arc", "dmarc", og "bimi".
* De parserede e-mail headers gives som egenskaben "headers" – men bemærk også, at du kan bruge "headerLines" for nemmere iteration og parsing.
* De grupperede modtagere for denne webhook er grupperet sammen og gives som egenskaben "recipients".
* SMTP session information gives som egenskaben "session". Dette indeholder information om afsenderen af beskeden, ankomsttidspunkt for beskeden, HELO, og klient hostname. Klient hostname værdien som `session.clientHostname` er enten FQDN (fra et reverse PTR lookup) eller det er `session.remoteAddress` indpakket i parenteser (f.eks. `"[127.0.0.1]"`).
* Hvis du har brug for en hurtig måde at få værdien af `X-Original-To`, kan du bruge værdien af `session.recipient` (se eksempel nedenfor). Headeren `X-Original-To` er en header vi tilføjer til beskeder til fejlfinding med den oprindelige modtager (før maskeret videresendelse) for beskeden.
* Hvis du har brug for at fjerne `attachments` og/eller `raw` egenskaber fra payload body, tilføj blot `?attachments=false`, `?raw=false`, eller `?attachments=false&raw=false` til dit webhook endpoint som en querystring parameter (f.eks. `https://example.com/webhook?attachments=false&raw=false`).
* Hvis der er vedhæftninger, vil de blive tilføjet til `attachments` Arrayet med Buffer værdier. Du kan parse dem tilbage til indhold ved hjælp af en tilgang med JavaScript som:
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

### Understøtter I regulære udtryk eller regex {#do-you-support-regular-expressions-or-regex}

Ja, fra den 27. september 2021 har vi tilføjet denne funktion. Du kan ganske enkelt skrive regulære udtryk ("regex") til at matche aliaser og udføre substitutioner.

Regulære udtryk understøttede aliaser er dem, der starter med en `/` og slutter med `/`, og deres modtagere er e-mailadresser eller webhooks. Modtagerne kan også inkludere regex-substitutionssupport (f.eks. `$1`, `$2`).

Vi understøtter to regulære udtryksflag, herunder `i` og `g`. Det case-insensitive flag `i` er en permanent standard og håndhæves altid. Det globale flag `g` kan tilføjes af dig ved at sætte afslutningen `/` til `/g`.

Bemærk, at vi også understøtter vores <a href="#can-i-disable-specific-aliases">deaktiverede alias-funktion</a> for modtagerdelen med vores regex-understøttelse.

Regulære udtryk understøttes ikke på <a href="/disposable-addresses" target="_blank">globale vanity-domæner</a> (da dette kan være en sikkerhedsrisiko).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Forbedret privatlivsbeskyttelse:
  </strong>
  <span>
    Hvis du er på en betalt plan (som har forbedret privatlivsbeskyttelse), så gå venligst til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> og klik på "Aliaser" ved siden af dit domæne for at konfigurere aliaser, inklusive dem med regulære udtryk. Hvis du vil lære mere om betalte planer, se vores <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Priser</a> side.
  </span>
</div>

#### Eksempler på forbedret privatlivsbeskyttelse {#examples-for-enhanced-privacy-protection}

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
      <td>E-mails til `linus@example.com` eller `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">se test på RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-mails til `24highst@example.com` eller `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">se test på RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    For at teste disse på <a href="https://regexr.com" class="alert-link">RegExr</a>, skriv udtrykket i den øverste boks, og skriv derefter et eksempel på et alias i tekstboksen nedenfor. Hvis det matcher, bliver det blåt.
  <span>
  </span>
</div>

#### Eksempler for gratisplanen {#examples-for-the-free-plan}

Hvis du er på gratisplanen, så tilføj blot en ny DNS <strong class="notranslate">TXT</strong>-post ved hjælp af et eller flere af de angivne eksempler nedenfor:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Enkelt eksempel:</strong> Hvis jeg ønsker, at alle e-mails, der går til `linus@example.com` eller `torvalds@example.com`, skal videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Eksempel på substitution af fornavn efternavn:</strong> Forestil dig, at alle dine firmamailadresser følger mønsteret `fornavn.efternavn@example.com`. Hvis jeg ønsker, at alle e-mails, der går til mønsteret `fornavn.efternavn@example.com`, skal videresendes til `fornavn.efternavn@company.com` med substitutionssupport (<a href="https://regexr.com/66hnu" class="alert-link">se test på RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
  <strong>Eksempel på plus-symbol filtreringssubstitution:</strong> Hvis jeg ønsker, at alle e-mails, der går til `info@example.com` eller `support@example.com`, skal videresendes til henholdsvis `user+info@gmail.com` eller `user+support@gmail.com` (med substitutionsunderstøttelse) (<a href="https://regexr.com/66ho7" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
  <strong>Eksempel på webhook querystring-substitution:</strong> Måske ønsker du, at alle e-mails, der går til `example.com`, skal gå til en <a href="#do-you-support-webhooks" class="alert-link">webhook</a> og have en dynamisk querystring-nøgle "to" med værdien af brugernavnsdelen af e-mailadressen (<a href="https://regexr.com/66ho4" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
  <strong>Eksempel på stille afvisning:</strong> Hvis du ønsker, at alle e-mails, der matcher et bestemt mønster, skal deaktiveres og stille afvises (senderen får det til at se ud som om, beskeden blev sendt succesfuldt, men den går faktisk ingen steder) med statuskode `250` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere specifikke aliaser</a>), så brug blot samme tilgang med et enkelt udråbstegn "!". Dette angiver til afsenderen, at beskeden blev leveret succesfuldt, men den gik faktisk ingen steder (f.eks. sort hul eller `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
  <strong>Eksempel på blød afvisning:</strong> Hvis du ønsker, at alle e-mails, der matcher et bestemt mønster, skal deaktiveres og blødt afvises med statuskode `421` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere specifikke aliaser</a>), så brug blot samme tilgang med et dobbelt udråbstegn "!!". Dette angiver til afsenderen at prøve at sende e-mailen igen, og e-mails til dette alias vil blive forsøgt igen i cirka 5 dage og derefter afvist permanent.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Vært/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
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
  <strong>Eksempel på hård afvisning:</strong> Hvis du vil have, at alle e-mails, der matcher et bestemt mønster, skal deaktiveres og hårdt afvises med statuskode `550` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere specifikke aliaser</a>), så brug blot samme tilgang med et tredobbelt udråbstegn "!!!". Dette angiver en permanent fejl til afsenderen, og e-mails vil ikke blive forsøgt igen, de vil blive afvist for dette alias.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Nysgerrig efter, hvordan man skriver et regulært udtryk eller har brug for at teste din erstatning? Du kan gå til den gratis hjemmeside for test af regulære udtryk <a href="https://regexr.com" class="alert-link">RegExr</a> på <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Hvad er dine grænser for udgående SMTP {#what-are-your-outbound-smtp-limits}

Vi begrænser brugere og domæner til 300 udgående SMTP-beskeder pr. 1 dag. Dette svarer til i gennemsnit over 9000 e-mails på en kalender måned. Hvis du har brug for at overskride dette antal eller har konsekvent store e-mails, så [kontakt os](https://forwardemail.net/help).

### Skal jeg have godkendelse for at aktivere SMTP {#do-i-need-approval-to-enable-smtp}

Ja, bemærk venligst, at for at opretholde IP-ry og sikre leveringsdygtighed har Forward Email en manuel gennemgangsproces pr. domæne for godkendelse af udgående SMTP. Send en e-mail til <support@forwardemail.net> eller åbn en [hjælpeanmodning](https://forwardemail.net/help) for godkendelse. Dette tager typisk mindre end 24 timer, hvor de fleste anmodninger bliver godkendt inden for 1-2 timer. I den nærmeste fremtid sigter vi mod at gøre denne proces øjeblikkelig med yderligere spamkontroller og alarmering. Denne proces sikrer, at dine e-mails når indbakken, og at dine beskeder ikke bliver markeret som spam.

### Hvad er dine SMTP-server konfigurationsindstillinger {#what-are-your-smtp-server-configuration-settings}

Vores server er `smtp.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig over portene `465` og `2465` for SSL/TLS (anbefalet) og `587`, `2587`, `2525` og `25` for TLS (STARTTLS).

**Fra oktober 2025** understøtter vi nu **legacy TLS 1.0** forbindelser på portene `2455` (SSL/TLS) og `2555` (STARTTLS) for ældre enheder såsom printere, scannere, kameraer og legacy e-mail-klienter, der ikke kan understøtte moderne TLS-versioner. Disse porte tilbydes som et alternativ til Gmail, Yahoo, Outlook og andre udbydere, der har ophørt med at understøtte ældre TLS-protokoller.

> \[!CAUTION]
> **Legacy TLS 1.0 Support (Portene 2455 og 2555)**: Disse porte bruger den forældede TLS 1.0-protokol, som har kendte sikkerhedssårbarheder (BEAST, POODLE). Brug kun disse porte, hvis din enhed absolut ikke kan understøtte TLS 1.2 eller højere. Vi anbefaler kraftigt at opgradere din enheds firmware eller skifte til moderne e-mail-klienter, når det er muligt. Disse porte er udelukkende beregnet til kompatibilitet med legacy hardware (gamle printere, scannere, kameraer, IoT-enheder).

|                                     Protokol                                     | Værtsnavn               |            Porte            |        IPv4        |        IPv6        | Noter                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Foretrukket**                           | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Moderne TLS 1.2+ (Anbefalet)           |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Understøttet (foretræk SSL/TLS port `465`) |
|                             `SSL/TLS` **Kun Legacy**                             | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 kun til gamle enheder |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Kun Legacy**  | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 kun til gamle enheder |
| Login    | Eksempel                  | Beskrivelse                                                                                                                                                                               |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brugernavn | `user@example.com`       | Email-adresse på et alias, der findes for domænet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>.       |
| Adgangskode | `************************` | Alias                                                                                                                                                                                     |

For at sende udgående email med SMTP skal **SMTP-brugeren** være email-adressen på et alias, der findes for domænet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **SMTP-adgangskoden** skal være en alias-specifik genereret adgangskode.

Se venligst [Understøtter I afsendelse af email med SMTP](#do-you-support-sending-email-with-smtp) for trin-for-trin instruktioner.

### Hvad er jeres IMAP-server konfigurationsindstillinger {#what-are-your-imap-server-configuration-settings}

Vores server er `imap.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig på portene `993` og `2993` for SSL/TLS.

|         Protokol         | Værtsnavn               |     Porte     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Eksempel                  | Beskrivelse                                                                                                                                                                               |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brugernavn | `user@example.com`       | Email-adresse på et alias, der findes for domænet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>.       |
| Adgangskode | `************************` | Alias-specifik genereret adgangskode.                                                                                                                                                      |

For at oprette forbindelse med IMAP skal **IMAP-brugeren** være email-adressen på et alias, der findes for domænet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **IMAP-adgangskoden** skal være en alias-specifik genereret adgangskode.

Se venligst [Understøtter I modtagelse af email med IMAP](#do-you-support-receiving-email-with-imap) for trin-for-trin instruktioner.

### Hvad er jeres POP3-server konfigurationsindstillinger {#what-are-your-pop3-server-configuration-settings}

Vores server er `pop3.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig på portene `995` og `2995` for SSL/TLS.

|         Protokol         | Værtsnavn               |     Porte     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Eksempel                   | Beskrivelse                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com`         | Emailadresse på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>.          |
| Adgangskode | `************************` | Alias-specifik genereret adgangskode.                                                                                                                                                      |

For at oprette forbindelse med POP3 skal **POP3-brugeren** være emailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **IMAP-adgangskoden** skal være en alias-specifik genereret adgangskode.

Se venligst [Understøtter I POP3](#do-you-support-pop3) for trin-for-trin instruktioner.

### Hvordan opsætter jeg email-autodiscovery for mit domæne {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Email-autodiscovery gør det muligt for emailklienter som **Thunderbird**, **Apple Mail**, **Microsoft Outlook** og mobile enheder automatisk at finde de korrekte IMAP-, SMTP-, POP3-, CalDAV- og CardDAV-serverindstillinger, når en bruger tilføjer deres emailkonto. Dette er defineret af [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (email) og [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) og bruger DNS SRV-poster.

Forward Email offentliggør autodiscovery-poster på `forwardemail.net`. Du kan enten tilføje SRV-poster direkte til dit domæne eller bruge en enklere CNAME-metode.

#### Mulighed A: CNAME-poster (nemmest) {#option-a-cname-records-simplest}

Tilføj disse to CNAME-poster til dit domænes DNS. Dette delegerer autodiscovery til Forward Emails servere:

|  Type | Navn/Host     | Mål/Værdi                      |
| :---: | ------------- | ------------------------------ |
| CNAME | `autoconfig`  | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover`| `autodiscover.forwardemail.net`|

`autoconfig`-posten bruges af **Thunderbird** og andre Mozilla-baserede klienter. `autodiscover`-posten bruges af **Microsoft Outlook**.

#### Mulighed B: SRV-poster (direkte) {#option-b-srv-records-direct}

Hvis du foretrækker at tilføje posterne direkte (eller din DNS-udbyder ikke understøtter CNAME på underdomæner), tilføj disse SRV-poster til dit domæne:

| Type | Navn/Host           | Prioritet | Vægt | Port | Mål/Værdi                  | Formål                                |
| :--: | ------------------- | :-------: | :---:| :--: | -------------------------- | ------------------------------------ |
|  SRV | `_imaps._tcp`       |     0     |  1   |  993 | `imap.forwardemail.net`    | IMAP over SSL/TLS (foretrukket)      |
|  SRV | `_imap._tcp`        |     0     |  0   |   0  | `.`                        | Almindelig tekst IMAP deaktiveret    |
|  SRV | `_submissions._tcp` |     0     |  1   |  465 | `smtp.forwardemail.net`    | SMTP submission (SSL/TLS, anbefalet) |
|  SRV | `_submission._tcp`  |     5     |  1   |  587 | `smtp.forwardemail.net`    | SMTP submission (STARTTLS)            |
|  SRV | `_pop3s._tcp`       |    10     |  1   |  995 | `pop3.forwardemail.net`    | POP3 over SSL/TLS                    |
|  SRV | `_pop3._tcp`        |     0     |  0   |   0  | `.`                        | Almindelig tekst POP3 deaktiveret    |
|  SRV | `_caldavs._tcp`     |     0     |  1   |  443 | `caldav.forwardemail.net`  | CalDAV over TLS (kalendere)           |
|  SRV | `_caldav._tcp`      |     0     |  0   |   0  | `.`                        | Almindelig tekst CalDAV deaktiveret  |
|  SRV | `_carddavs._tcp`    |     0     |  1   |  443 | `carddav.forwardemail.net` | CardDAV over TLS (kontakter)          |
|  SRV | `_carddav._tcp`     |     0     |  0   |   0  | `.`                        | Almindelig tekst CardDAV deaktiveret |
> \[!NOTE]
> IMAP har en lavere prioritetsværdi (0) end POP3 (10), hvilket fortæller e-mail-klienter at foretrække IMAP frem for POP3, når begge er tilgængelige. Poster med et mål på `.` (et enkelt punktum) angiver, at de ukrypterede (plaintext) versioner af disse protokoller bevidst er deaktiveret i henhold til [RFC 6186 Section 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). CalDAV- og CardDAV-SRV-poster følger [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) for kalender- og kontakt-autodiscovery.

#### Hvilke e-mail-klienter understøtter autodiscovery? {#which-email-clients-support-autodiscovery}

| Klient             | E-mail                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME- eller SRV-poster             | `autoconfig` XML- eller SRV-poster (RFC 6764) |
| Apple Mail (macOS) | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| Apple Mail (iOS)   | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| Microsoft Outlook  | `autodiscover` CNAME eller `_autodiscover._tcp` SRV | Ikke understøttet                         |
| GNOME (Evolution)  | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| KDE (KMail)        | SRV-poster (RFC 6186)                            | SRV-poster (RFC 6764)                      |
| eM Client          | `autoconfig` eller `autodiscover`                | SRV-poster (RFC 6764)                      |

> \[!TIP]
> For den bedste kompatibilitet på tværs af alle klienter anbefaler vi at bruge **Mulighed A** (CNAME-poster) kombineret med SRV-posterne fra **Mulighed B**. CNAME-tilgangen alene dækker størstedelen af e-mail-klienterne. CalDAV/CardDAV SRV-posterne sikrer, at kalender- og kontaktklienter også automatisk kan finde dine serverindstillinger.


## Sikkerhed {#security-1}

### Avancerede teknikker til serverhærde {#advanced-server-hardening-techniques}

> \[!TIP]
> Lær mere om vores sikkerhedsinfrastruktur på [vores sikkerhedsside](/security).

Forward Email implementerer adskillige teknikker til serverhærde for at sikre sikkerheden af vores infrastruktur og dine data:

1. **Netværkssikkerhed**:
   * IP tables firewall med strenge regler
   * Fail2ban til beskyttelse mod brute force
   * Regelmæssige sikkerhedsrevisioner og penetrationstest
   * VPN-only administrativ adgang

2. **Systemhærde**:
   * Minimal pakkeinstallation
   * Regelmæssige sikkerhedsopdateringer
   * SELinux i enforcing mode
   * Deaktiveret root SSH-adgang
   * Kun nøglebaseret autentificering

3. **Applikationssikkerhed**:
   * Content Security Policy (CSP) headers
   * HTTPS Strict Transport Security (HSTS)
   * XSS-beskyttelsesheaders
   * Frame options og referrer policy headers
   * Regelmæssige afhængighedsrevisioner

4. **Databeskyttelse**:
   * Fuld disk-kryptering med LUKS
   * Sikker nøglehåndtering
   * Regelmæssige backups med kryptering
   * Data-minimeringspraksis

5. **Overvågning og respons**:
   * Realtids indtrængningsdetektion
   * Automatiseret sikkerhedsscanning
   * Centraliseret logning og analyse
   * Incident response procedurer

> \[!IMPORTANT]
> Vores sikkerhedspraksis opdateres løbende for at imødekomme nye trusler og sårbarheder.

> \[!TIP]
> For maksimal sikkerhed anbefaler vi at bruge vores service med end-to-end kryptering via OpenPGP.

### Har I SOC 2 eller ISO 27001 certificeringer {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email kører på infrastruktur leveret af certificerede underleverandører for at sikre overholdelse af branchestandarder.

Forward Email har ikke direkte SOC 2 Type II eller ISO 27001 certificeringer. Tjenesten kører dog på infrastruktur leveret af certificerede underleverandører:

* **DigitalOcean**: SOC 2 Type II og SOC 3 Type II certificeret (auditeret af Schellman & Company LLC), ISO 27001 certificeret på flere datacentre. Detaljer: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) certificeret, ISO/IEC certificeringer: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaljer: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-kompatibel (kontakt DataPacket direkte for at opnå certificering), infrastrukturudbyder i virksomhedsklasse (Denver-lokation). Detaljer: <https://www.datapacket.com/datacenters/denver>

Forward Email følger branchens bedste praksis for sikkerhedsrevisioner og samarbejder regelmæssigt med uafhængige sikkerhedsforskere. Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Bruger I TLS-kryptering til e-mail videresendelse {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Forward Email håndhæver strengt TLS 1.2+ for alle forbindelser (HTTPS, SMTP, IMAP, POP3) og implementerer MTA-STS for forbedret TLS-understøttelse. Implementeringen inkluderer:

* Håndhævelse af TLS 1.2+ for alle e-mail-forbindelser
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) nøgleudveksling for perfekt fremadrettet hemmeligholdelse
* Moderne cipher suites med regelmæssige sikkerhedsopdateringer
* HTTP/2-understøttelse for forbedret ydeevne og sikkerhed
* HSTS (HTTP Strict Transport Security) med preloading i større browsere
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** for streng TLS-håndhævelse

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementering**: Forward Email implementerer streng MTA-STS-håndhævelse i kodebasen. Når TLS-fejl opstår, og MTA-STS håndhæves, returnerer systemet 421 SMTP-statuskoder for at sikre, at e-mails forsøges sendt igen senere i stedet for at blive leveret usikkert. Implementeringsdetaljer:

* TLS-fejldetektion: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-håndhævelse i send-email helper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Tredjepartsvalidering: <https://www.hardenize.com/report/forwardemail.net/1750312779> viser "Good" vurderinger for alle TLS- og transport-sikkerhedsforanstaltninger.

### Bevarer I e-mail autentificeringsoverskrifter {#do-you-preserve-email-authentication-headers}

Ja. Forward Email implementerer og bevarer omfattende e-mail autentificeringsoverskrifter:

* **SPF (Sender Policy Framework)**: Korrekt implementeret og bevaret
* **DKIM (DomainKeys Identified Mail)**: Fuld understøttelse med korrekt nøglehåndtering
* **DMARC**: Politik håndhævelse for e-mails, der fejler SPF- eller DKIM-validering
* **ARC**: Selvom det ikke er eksplicit detaljeret, antyder tjenestens perfekte compliance-scores omfattende håndtering af autentificeringsoverskrifter

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validering: Internet.nl Mail Test viser 100/100 score specifikt for "SPF, DKIM og DMARC" implementering. Hardenize vurdering bekræfter "Good" vurderinger for SPF og DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bevarer I originale e-mail overskrifter og forhindrer spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementerer avanceret anti-spoofing beskyttelse for at forhindre misbrug af e-mail.

Forward Email bevarer originale e-mail overskrifter samtidig med, at der implementeres omfattende anti-spoofing beskyttelse gennem MX-kodebasen:

* **Overskriftsbevarelse**: Originale autentificeringsoverskrifter bevares under videresendelse
* **Anti-Spoofing**: DMARC-politikhåndhævelse forhindrer overskriftsforfalskning ved at afvise e-mails, der fejler SPF- eller DKIM-validering
* **Forebyggelse af overskriftsinjektion**: Inputvalidering og sanitering ved brug af striptags-biblioteket
* **Avanceret beskyttelse**: Sofistikeret phishing-detektion med spoofing-detektion, forebyggelse af identitetstyveri og brugernotifikationssystemer

**MX-implementeringsdetaljer**: Den centrale e-mail behandlingslogik håndteres af MX-serverens kodebase, specifikt:

* Hoved MX datahandler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Vilkårlig e-mail filtrering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary` helperen implementerer avancerede anti-spoofing regler inklusive detektion af domæneefterligning, blokerede fraser og forskellige phishing-mønstre.
### Hvordan beskytter I mod spam og misbrug {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementerer omfattende flerlaget beskyttelse:

* **Ratebegrænsning**: Anvendes på autentificeringsforsøg, API-endpoints og SMTP-forbindelser
* **Ressourceisolering**: Mellem brugere for at forhindre påvirkning fra brugere med højt volumen
* **DDoS-beskyttelse**: Flerlaget beskyttelse gennem DataPackets Shield-system og Cloudflare
* **Automatisk skalering**: Dynamisk ressourcejustering baseret på efterspørgsel
* **Misbrugsforebyggelse**: Bruger-specifikke misbrugsforebyggende kontroller og hash-baseret blokering af ondsindet indhold
* **Email-autentificering**: SPF, DKIM, DMARC-protokoller med avanceret phishing-detektion

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detaljer om DDoS-beskyttelse)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Gemmer I email-indhold på disk {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email bruger en zero-knowledge arkitektur, der forhindrer, at email-indhold skrives til disk.

* **Zero-Knowledge Arkitektur**: Individuelt krypterede SQLite-mailbokse betyder, at Forward Email ikke kan få adgang til email-indhold
* **Behandling i hukommelsen**: Email-behandling foregår udelukkende i hukommelsen og undgår disk-lagring
* **Ingen logning af indhold**: "Vi logger eller gemmer ikke email-indhold eller metadata på disk"
* **Sandboxed kryptering**: Krypteringsnøgler gemmes aldrig i klartekst på disk

**MX-kodebasebevis**: MX-serveren behandler emails fuldstændigt i hukommelsen uden at skrive indhold til disk. Den primære email-behandlingshandler demonstrerer denne in-memory tilgang: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Resumé)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detaljer om zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxed kryptering)

### Kan email-indhold blive eksponeret under systemnedbrud {#can-email-content-be-exposed-during-system-crashes}

Nej. Forward Email implementerer omfattende sikkerhedsforanstaltninger mod dataeksponering ved nedbrud:

* **Core dumps deaktiveret**: Forhindrer hukommelseseksponering under nedbrud
* **Swap-hukommelse deaktiveret**: Fuldstændigt deaktiveret for at forhindre udtræk af følsomme data fra swap-filer
* **In-memory arkitektur**: Email-indhold findes kun i flygtig hukommelse under behandling
* **Beskyttelse af krypteringsnøgler**: Nøgler gemmes aldrig i klartekst på disk
* **Fysisk sikkerhed**: LUKS v2-krypterede diske forhindrer fysisk adgang til data
* **USB-lagring deaktiveret**: Forhindrer uautoriseret dataudtræk

**Fejlhåndtering ved systemproblemer**: Forward Email bruger hjælpefunktionerne `isCodeBug` og `isTimeoutError` for at sikre, at hvis der opstår databaseforbindelsesproblemer, DNS-netværks-/bloklistproblemer eller upstream-forbindelsesproblemer, returnerer systemet 421 SMTP-statuskoder for at sikre, at emails bliver forsøgt sendt igen senere i stedet for at gå tabt eller blive eksponeret.

Implementeringsdetaljer:

* Fejlklassificering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout-fejlhåndtering i MX-behandling: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Hvem har adgang til jeres email-infrastruktur {#who-has-access-to-your-email-infrastructure}

Forward Email implementerer omfattende adgangskontroller for sit minimale ingeniørteam på 2-3 personer med strenge 2FA-krav:

* **Rollebaseret adgangskontrol**: For teamkonti med ressourcebaserede tilladelser
* **Mindste privilegium-princippet**: Anvendes i alle systemer
* **Adskillelse af opgaver**: Mellem operationelle roller
* **Brugeradministration**: Separate deploy- og devops-brugere med forskellige tilladelser
* **Root-login deaktiveret**: Tvinger adgang gennem korrekt autentificerede konti
* **Streng 2FA**: Ingen SMS-baseret 2FA på grund af risiko for MiTM-angreb – kun app-baserede eller hardware-tokens
* **Omfattende revisionslogning**: Med redigering af følsomme data
* **Automatisk anomali-detektion**: For usædvanlige adgangsmønstre
* **Regelmæssige sikkerhedsgennemgange**: Af adgangslogs
* **Forebyggelse af Evil Maid-angreb**: USB-lagring deaktiveret og andre fysiske sikkerhedsforanstaltninger
Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autoriseringskontroller)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Netværkssikkerhed)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Forebyggelse af ond tjeners angreb)

### Hvilke infrastrukturudbydere bruger I {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email bruger flere infrastruktur-underbehandlere med omfattende overholdelsescertificeringer.

Fuldstændige oplysninger findes på vores GDPR-overholdelsesside: <https://forwardemail.net/gdpr>

**Primære infrastruktur-underbehandlere:**

| Udbyder         | Certificeret efter databeskyttelsesramme | GDPR-overholdelsesside                                                                    |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Cloudflare**   | ✅ Ja                                    | <https://www.cloudflare.com/trust-hub/gdpr/>                                               |
| **DataPacket**   | ❌ Nej                                   | <https://www.datapacket.com/privacy-policy>                                                |
| **DigitalOcean** | ❌ Nej                                   | <https://www.digitalocean.com/legal/gdpr>                                                  |
| **GitHub**       | ✅ Ja                                    | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Nej                                   | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                            |

**Detaljerede certificeringer:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (revideret af Schellman & Company LLC)
* ISO 27001 certificeret på flere datacentre
* PCI-DSS kompatibel
* CSA STAR Niveau 1 certificeret
* APEC CBPR PRP certificeret
* Detaljer: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) certificeret
* PCI Merchant kompatibel
* CSA STAR Niveau 1 certificeret
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaljer: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 kompatibel (kontakt DataPacket direkte for at få certificering)
* Infrastruktur i virksomhedsklasse (Denver-lokation)
* DDoS-beskyttelse via Shield cybersikkerhedsstak
* 24/7 teknisk support
* Globalt netværk på tværs af 58 datacentre
* Detaljer: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certificeret efter Data Privacy Framework (EU-USA, Schweiz-USA og UK Extension)
* Hosting af kildekode, CI/CD og projektstyring
* GitHub Data Protection Agreement tilgængelig
* Detaljer: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Betalingsbehandlere:**

* **Stripe**: Certificeret efter Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Ikke DPF-certificeret - <https://www.paypal.com/uk/legalhub/privacy-full>

### Tilbyder I en databehandleraftale (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email tilbyder en omfattende databehandleraftale (DPA), som kan underskrives sammen med vores enterprise-aftale. En kopi af vores DPA er tilgængelig på: <https://forwardemail.net/dpa>

**DPA-detaljer:**

* Omfatter GDPR-overholdelse og EU-USA/Schweiz-USA Privacy Shield-rammer
* Accepteres automatisk ved accept af vores Servicevilkår
* Ingen separat underskrift nødvendig for standard DPA
* Tilpassede DPA-aftaler tilgængelige via Enterprise-licens

**GDPR-overholdelsesramme:**
Vores DPA beskriver overholdelse af GDPR samt internationale krav til dataoverførsel. Fuldstændige oplysninger findes på: <https://forwardemail.net/gdpr>

For enterprise-kunder, der har brug for tilpassede DPA-vilkår eller specifikke kontraktlige aftaler, kan disse håndteres gennem vores **Enterprise License ($250/month)** program.

### Hvordan håndterer I underretninger om databrud {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Emails zero-knowledge-arkitektur begrænser væsentligt bruddets omfang.
* **Begrænset dataeksponering**: Kan ikke få adgang til krypteret e-mailindhold på grund af nul-viden-arkitektur
* **Minimal dataindsamling**: Kun grundlæggende abonnentoplysninger og begrænsede IP-logs til sikkerhed
* **Underbehandler-rammer**: DigitalOcean, GitHub og Vultr opretholder GDPR-kompatible hændelsesresponsprocedurer

**GDPR-repræsentantoplysninger:**
Forward Email har udpeget GDPR-repræsentanter i overensstemmelse med artikel 27:

**EU-repræsentant:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**UK-repræsentant:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

For erhvervskunder, der kræver specifikke brudvarsler SLA'er, bør disse drøftes som en del af en **Enterprise License**-aftale.

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Tilbyder I et testmiljø {#do-you-offer-a-test-environment}

Forward Emails tekniske dokumentation beskriver ikke eksplicit en dedikeret sandbox-tilstand. Mulige testmetoder inkluderer dog:

* **Mulighed for selvhosting**: Omfattende selvhostingsmuligheder til oprettelse af testmiljøer
* **API-interface**: Mulighed for programmatisk test af konfigurationer
* **Open Source**: 100% open source-kode giver kunder mulighed for at undersøge videresendelseslogikken
* **Flere domæner**: Understøttelse af flere domæner kan muliggøre oprettelse af testdomæner

For erhvervskunder, der kræver formelle sandbox-funktioner, bør dette drøftes som en del af en **Enterprise License**-aftale.

Kilde: <https://github.com/forwardemail/forwardemail.net> (Udviklingsmiljødetaljer)

### Tilbyder I overvågnings- og alarmeringsværktøjer {#do-you-provide-monitoring-and-alerting-tools}

Forward Email tilbyder realtidsmonitorering med visse begrænsninger:

**Tilgængeligt:**

* **Realtidsleveringsmonitorering**: Offentligt synlige ydelsesmetrikker for større e-mailudbydere
* **Automatisk alarmering**: Ingeniørteamet alarmeres, når leveringstider overstiger 10 sekunder
* **Transparent overvågning**: 100% open source-overvågningssystemer
* **Infrastrukturmonitorering**: Automatisk anomaliopdagelse og omfattende revisionslogning

**Begrænsninger:**

* Kundevendte webhooks eller API-baserede leveringsstatusnotifikationer er ikke eksplicit dokumenteret

For erhvervskunder, der kræver detaljerede leveringsstatus-webhooks eller tilpassede overvågningsintegrationer, kan disse funktioner være tilgængelige gennem **Enterprise License**-aftaler.

Kilder:

* <https://forwardemail.net> (Realtidsmonitoreringsvisning)
* <https://github.com/forwardemail/forwardemail.net> (Implementering af overvågning)

### Hvordan sikrer I høj tilgængelighed {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementerer omfattende redundans på tværs af flere infrastrukturudbydere.

* **Distribueret infrastruktur**: Flere udbydere (DigitalOcean, Vultr, DataPacket) på tværs af geografiske regioner
* **Geografisk belastningsbalancering**: Cloudflare-baseret geo-lokaliseret belastningsbalancering med automatisk failover
* **Automatisk skalering**: Dynamisk ressourcejustering baseret på efterspørgsel
* **Flerlags DDoS-beskyttelse**: Gennem DataPackets Shield-system og Cloudflare
* **Serverredundans**: Flere servere pr. region med automatisk failover
* **Database-replikering**: Realtidssynkronisering af data på tværs af flere lokationer
* **Overvågning og alarmering**: 24/7 overvågning med automatisk hændelsesrespons

**Oppetidsgaranti**: 99,9%+ service tilgængelighed med transparent overvågning tilgængelig på <https://forwardemail.net>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Er I i overensstemmelse med afsnit 889 i National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email er fuldt ud i overensstemmelse med afsnit 889 gennem omhyggeligt valg af infrastrukturpartnere.

Ja, Forward Email er **Section 889 compliant**. Afsnit 889 i National Defense Authorization Act (NDAA) forbyder offentlige myndigheder at bruge eller indgå kontrakt med enheder, der anvender telekommunikations- og videoovervågningsudstyr fra specifikke virksomheder (Huawei, ZTE, Hikvision, Dahua og Hytera).
**Hvordan Forward Email opnår overholdelse af Section 889:**

Forward Email er udelukkende afhængig af to nøgleinfrastrukturudbydere, som ingen af dem bruger udstyr, der er forbudt under Section 889:

1. **Cloudflare**: Vores primære partner for netværkstjenester og email-sikkerhed  
2. **DataPacket**: Vores primære leverandør af serverinfrastruktur (bruger udelukkende Arista Networks og Cisco-udstyr)  
3. **Backup-udbydere**: Vores backup-udbydere Digital Ocean og Vultr er desuden skriftligt bekræftet som værende Section 889-kompatible.

**Cloudflares forpligtelse**: Cloudflare angiver eksplicit i deres Third Party Code of Conduct, at de ikke bruger telekommunikationsudstyr, videoovervågningsprodukter eller tjenester fra nogen enheder, der er forbudt under Section 889.

**Regeringens brugssag**: Vores overholdelse af Section 889 blev valideret, da **US Naval Academy** valgte Forward Email til deres sikre email-videresendelsesbehov, hvilket krævede dokumentation af vores føderale overholdelsesstandarder.

For fulde detaljer om vores regerings-overholdelsesramme, inklusive bredere føderale regler, læs vores omfattende casestudie: [Federal Government Email Service Section 889 Compliant](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## System- og tekniske detaljer {#system-and-technical-details}

### Gemmer I emails og deres indhold {#do-you-store-emails-and-their-contents}

Nej, vi skriver ikke til disk eller gemmer logs – med [undtagelse af fejl](#do-you-store-error-logs) og [udgående SMTP](#do-you-support-sending-email-with-smtp) (se vores [Privacy Policy](/privacy)).

Alt foregår i hukommelsen, og [vores kildekode er på GitHub](https://github.com/forwardemail).

### Hvordan fungerer jeres email-videresendelsessystem {#how-does-your-email-forwarding-system-work}

Email er baseret på [SMTP-protokollen](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Denne protokol består af kommandoer sendt til en server (som oftest kører på port 25). Der er en indledende forbindelse, derefter angiver afsenderen, hvem mailen er fra ("MAIL FROM"), efterfulgt af hvor den skal hen ("RCPT TO"), og til sidst headerne og selve emailens indhold ("DATA"). Flowet i vores email-videresendelsessystem beskrives i forhold til hver SMTP-protokolkommando nedenfor:

* Indledende forbindelse (ingen kommando navn, f.eks. `telnet example.com 25`) - Dette er den indledende forbindelse. Vi tjekker afsendere, der ikke er på vores [allowlist](#do-you-have-an-allowlist), mod vores [denylist](#do-you-have-a-denylist). Endelig, hvis en afsender ikke er på vores allowlist, tjekker vi, om de er blevet [greylistet](#do-you-have-a-greylist).

* `HELO` - Dette angiver en hilsen for at identificere afsenderens FQDN, IP-adresse eller mailhandler-navn. Denne værdi kan forfalskes, så vi stoler ikke på disse data, men bruger i stedet reverse hostname-opslag på forbindelsens IP-adresse.

* `MAIL FROM` - Dette angiver konvolutmailens afsenderadresse. Hvis der indtastes en værdi, skal det være en gyldig RFC 5322 emailadresse. Tomme værdier er tilladt. Vi [tjekker for backscatter](#how-do-you-protect-against-backscatter) her, og vi tjekker også MAIL FROM mod vores [denylist](#do-you-have-a-denylist). Endelig tjekker vi afsendere, der ikke er på allowlisten, for ratebegrænsning (se afsnittet om [Rate Limiting](#do-you-have-rate-limiting) og [allowlist](#do-you-have-an-allowlist) for mere information).

* `RCPT TO` - Dette angiver modtager(e) af emailen. Disse skal være gyldige RFC 5322 emailadresser. Vi tillader kun op til 50 konvolutmodtagere pr. besked (dette er forskelligt fra "To"-headeren i en email). Vi tjekker også for en gyldig [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-adresse her for at beskytte mod spoofing med vores SRS-domænenavn.

* `DATA` - Dette er kernen i vores service, som behandler en email. Se afsnittet [Hvordan behandler I en email til videresendelse](#how-do-you-process-an-email-for-forwarding) nedenfor for mere indsigt.
### Hvordan behandler du en e-mail til videresendelse {#how-do-you-process-an-email-for-forwarding}

Denne sektion beskriver vores proces relateret til SMTP-protokolkommandoen `DATA` i afsnittet [Hvordan fungerer dit e-mail-videresendelsessystem](#how-does-your-email-forwarding-system-work) ovenfor – det er, hvordan vi behandler en e-mails headers, indhold, sikkerhed, bestemmer hvor den skal leveres, og hvordan vi håndterer forbindelser.

1. Hvis beskeden overskrider den maksimale størrelse på 50mb, afvises den med en 552-fejlkode.

2. Hvis beskeden ikke indeholdt en "From"-header, eller hvis nogen af værdierne i "From"-headeren ikke var gyldige RFC 5322 e-mailadresser, afvises den med en 550-fejlkode.

3. Hvis beskeden havde mere end 25 "Received"-headers, blev det vurderet, at den var fanget i en omdirigeringssløjfe, og den afvises med en 550-fejlkode.

4. Ved hjælp af e-mailens fingeraftryk (se afsnittet om [Fingerprinting](#how-do-you-determine-an-email-fingerprint)) vil vi kontrollere, om beskeden har været forsøgt genleveret i mere end 5 dage (hvilket svarer til [standard postfix-adfærd](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), og hvis det er tilfældet, afvises den med en 550-fejlkode.

5. Vi gemmer i hukommelsen resultaterne fra scanning af e-mailen ved hjælp af [Spam Scanner](https://spamscanner.net).

6. Hvis der var nogen arbitrære resultater fra Spam Scanner, afvises den med en 554-fejlkode. Arbitrære resultater inkluderer kun GTUBE-testen på tidspunktet for denne skrivning. Se <https://spamassassin.apache.org/gtube/> for mere indsigt.

7. Vi tilføjer følgende headers til beskeden til fejlfinding og misbrugsforebyggelse:

   * `Received` - vi tilføjer denne standard Received-header med oprindelses-IP og host, transmissionstype, TLS-forbindelsesinformation, dato/tid og modtager.
   * `X-Original-To` - den oprindelige modtager af beskeden:
     * Dette er nyttigt til at bestemme, hvor en e-mail oprindeligt blev leveret (udover "Received"-headeren).
     * Dette tilføjes pr. modtager ved tidspunktet for IMAP og/eller maskeret videresendelse (for at beskytte privatliv).
   * `X-Forward-Email-Website` - indeholder et link til vores hjemmeside <https://forwardemail.net>
   * `X-Forward-Email-Version` - den aktuelle [SemVer](https://semver.org/) version fra `package.json` i vores kodebase.
   * `X-Forward-Email-Session-ID` - en session-ID-værdi brugt til fejlfinding (gælder kun i ikke-produktionsmiljøer).
   * `X-Forward-Email-Sender` - en kommasepareret liste indeholdende den oprindelige envelope MAIL FROM-adresse (hvis den ikke var tom), den omvendte PTR-klient FQDN (hvis den findes), og afsenderens IP-adresse.
   * `X-Forward-Email-ID` - dette gælder kun for udgående SMTP og korrelerer til e-mail-ID'et gemt i Min Konto → E-mails
   * `X-Report-Abuse` - med værdien `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - med værdien `abuse@forwardemail.net`.
   * `X-Complaints-To` - med værdien `abuse@forwardemail.net`.

8. Vi tjekker derefter beskeden for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) og [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Hvis beskeden fejlede DMARC, og domænet havde en afvisningspolitik (f.eks. `p=reject` [var i DMARC-politikken](https://wikipedia.org/wiki/DMARC)), afvises den med en 550-fejlkode. Typisk kan en DMARC-politik for et domæne findes i `_dmarc` subdomænets <strong class="notranslate">TXT</strong>-record, (f.eks. `dig _dmarc.example.com txt`).
   * Hvis beskeden fejlede SPF, og domænet havde en hård fejlpolitik (f.eks. `-all` var i SPF-politikken i stedet for `~all` eller ingen politik overhovedet), afvises den med en 550-fejlkode. Typisk kan en SPF-politik for et domæne findes i <strong class="notranslate">TXT</strong>-recorden for roddomænet (f.eks. `dig example.com txt`). Se dette afsnit for mere information om [at sende mail som med Gmail](#can-i-send-mail-as-in-gmail-with-this) vedrørende SPF.
9. Nu behandler vi modtagerne af beskeden, som er indsamlet fra `RCPT TO`-kommandoen i afsnittet [Hvordan fungerer dit email-videresendelsessystem](#how-does-your-email-forwarding-system-work) ovenfor. For hver modtager udfører vi følgende operationer:

   * Vi slår <strong class="notranslate">TXT</strong>-poster op for domænenavnet (delen efter `@`-symbolet, f.eks. `example.com` hvis emailadressen var `test@example.com`). For eksempel, hvis domænet er `example.com`, laver vi en DNS-opslag som `dig example.com txt`.
   * Vi parser alle <strong class="notranslate">TXT</strong>-poster, der starter med enten `forward-email=` (gratis planer) eller `forward-email-site-verification=` (betalte planer). Bemærk, at vi parser begge for at kunne behandle emails, mens en bruger opgraderer eller nedgraderer planer.
   * Fra disse parserede <strong class="notranslate">TXT</strong>-poster itererer vi over dem for at udtrække videresendelseskonfigurationen (som beskrevet i afsnittet [Hvordan kommer jeg i gang og opsætter email-videresendelse](#how-do-i-get-started-and-set-up-email-forwarding) ovenfor). Bemærk, at vi kun understøtter én `forward-email-site-verification=` værdi, og hvis der leveres mere end én, vil der opstå en 550-fejl, og afsenderen vil modtage en afvisning for denne modtager.
   * Rekursivt itererer vi over den udtrukne videresendelseskonfiguration for at bestemme global videresendelse, regex-baseret videresendelse og alle andre understøttede videresendelseskonfigurationer – som nu er kendt som vores "Videresendelsesadresser".
   * For hver Videresendelsesadresse understøtter vi ét rekursivt opslag (som vil starte denne serie af operationer for den givne adresse). Hvis der findes et rekursivt match, fjernes forældreresultatet fra Videresendelsesadresser, og børnene tilføjes.
   * Videresendelsesadresser parses for unikke værdier (da vi ikke ønsker at sende dubletter til én adresse eller oprette unødvendige ekstra SMTP-klientforbindelser).
   * For hver Videresendelsesadresse slår vi dens domænenavn op mod vores API-endpoint `/v1/max-forwarded-addresses` (for at bestemme, hvor mange adresser domænet må videresende email til per alias, f.eks. 10 som standard – se afsnittet om [maksimalt antal videresendelser per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Hvis denne grænse overskrides, opstår en 550-fejl, og afsenderen modtager en afvisning for denne modtager.
   * Vi slår indstillingerne for den oprindelige modtager op mod vores API-endpoint `/v1/settings`, som understøtter opslag for betalende brugere (med fallback for gratis brugere). Dette returnerer et konfigurationsobjekt for avancerede indstillinger for `port` (Tal, f.eks. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) og `has_virus_protection` (Boolean).
   * Baseret på disse indstillinger tjekker vi derefter mod Spam Scanner-resultater, og hvis der opstår fejl, afvises beskeden med en 554-fejlkode (f.eks. hvis `has_virus_protection` er aktiveret, tjekker vi Spam Scanner-resultater for vira). Bemærk, at alle brugere på gratis planer automatisk er tilmeldt tjek for voksenindhold, phishing, eksekverbare filer og vira. Som standard er alle betalende brugere også tilmeldt, men denne konfiguration kan ændres under Indstillinger-siden for et domæne i Forward Email-dashboardet).

10. For hver behandlede modtagers Videresendelsesadresser udfører vi derefter følgende operationer:

    * Adressen tjekkes mod vores [denylist](#do-you-have-a-denylist), og hvis den er opført, opstår en 421-fejlkode (indikerer til afsender at prøve igen senere).
    * Hvis adressen er en webhook, sætter vi en Boolean for fremtidige operationer (se nedenfor – vi grupperer lignende webhooks for at lave én POST-anmodning i stedet for flere ved levering).
    * Hvis adressen er en emailadresse, parser vi hosten for fremtidige operationer (se nedenfor – vi grupperer lignende hosts for at lave én forbindelse i stedet for flere individuelle forbindelser ved levering).
11. Hvis der ikke er nogen modtagere, og der ikke er nogen afvisninger, svarer vi med en 550-fejl "Ugyldige modtagere".

12. Hvis der er modtagere, gennemgår vi dem (grupperet efter samme vært) og leverer e-mails. Se afsnittet [Hvordan håndterer I problemer med e-mail levering](#how-do-you-handle-email-delivery-issues) nedenfor for mere indsigt.

    * Hvis der opstår fejl under afsendelse af e-mails, gemmer vi dem i hukommelsen til senere behandling.
    * Vi tager den laveste fejlkode (hvis nogen) fra afsendelsen af e-mails – og bruger den som svarstatuskode til `DATA`-kommandoen. Det betyder, at e-mails, der ikke blev leveret, typisk vil blive forsøgt sendt igen af den oprindelige afsender, mens e-mails, der allerede er leveret, ikke vil blive sendt igen næste gang beskeden sendes (da vi bruger [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Hvis der ikke opstod fejl, sender vi en 250 succesfuld SMTP-svarstatuskode.
    * En afvisning defineres som enhver leveringsforsøg, der resulterer i en statuskode >= 500 (permanente fejl).

13. Hvis der ikke opstod afvisninger (permanente fejl), returnerer vi en SMTP-svarstatuskode med den laveste fejlkode fra ikke-permanente fejl (eller en 250 succesfuld statuskode, hvis der ikke var nogen).

14. Hvis der opstod afvisninger, sender vi afvisnings-e-mails i baggrunden efter at have returneret den laveste af alle fejlkoder til afsenderen. Men hvis den laveste fejlkode er >= 500, sender vi ikke nogen afvisnings-e-mails. Dette skyldes, at hvis vi gjorde det, ville afsendere modtage en dobbelt afvisnings-e-mail (f.eks. en fra deres udgående MTA, såsom Gmail – og også en fra os). Se afsnittet om [Hvordan beskytter I mod backscatter](#how-do-you-protect-against-backscatter) nedenfor for mere indsigt.

### Hvordan håndterer I problemer med e-mail levering {#how-do-you-handle-email-delivery-issues}

Bemærk, at vi kun laver en "Friendly-From"-omskrivning på e-mails, hvis og kun hvis afsenderens DMARC-politik ikke blev bestået OG ingen DKIM-signaturer var justeret med "From"-headeren. Det betyder, at vi ændrer "From"-headeren på beskeden, sætter "X-Original-From" og også sætter en "Reply-To", hvis den ikke allerede var sat. Vi forsegler også ARC-siglen på beskeden igen efter at have ændret disse headers.

Vi bruger også smart-parsing af fejlmeddelelser på alle niveauer i vores stack – i vores kode, DNS-forespørgsler, Node.js-internals, HTTP-forespørgsler (f.eks. 408, 413 og 429 mappes til SMTP-svarkode 421, hvis modtageren er en webhook) og mailserver-svar (f.eks. svar med "defer" eller "slowdown" vil blive forsøgt igen som 421-fejl).

Vores logik er idiot-sikker, og den vil også forsøge igen ved SSL/TLS-fejl, forbindelsesproblemer og mere. Målet med idiot-sikring er at maksimere leveringsmulighederne til alle modtagere for en videresendelseskonfiguration.

Hvis modtageren er en webhook, tillader vi en timeout på 60 sekunder for, at forespørgslen kan fuldføres med op til 3 forsøg (altså 4 forespørgsler i alt før en fejl). Bemærk, at vi korrekt parser fejlkoderne 408, 413 og 429 og mapper dem til en SMTP-svarkode 421.

Hvis modtageren derimod er en e-mailadresse, forsøger vi at sende e-mailen med opportunistisk TLS (vi forsøger at bruge STARTTLS, hvis det er tilgængeligt på modtagerens mailserver). Hvis der opstår en SSL/TLS-fejl under afsendelsen, forsøger vi at sende e-mailen uden TLS (uden at bruge STARTTLS).

Hvis der opstår DNS- eller forbindelsesfejl, returnerer vi til `DATA`-kommandoen en SMTP-svarkode 421, ellers hvis der er >= 500 niveau fejl, sendes afvisninger.

Hvis vi opdager, at en mailserver, vi forsøger at levere til, har blokeret en eller flere af vores mailudvekslings-IP-adresser (f.eks. via den teknologi, de bruger til at udsætte spammere), sender vi en SMTP-svarkode 421, så afsenderen kan prøve at sende beskeden igen senere (og vi bliver alarmeret om problemet, så vi forhåbentlig kan løse det inden næste forsøg).

### Hvordan håndterer I, at jeres IP-adresser bliver blokeret {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Vi overvåger rutinemæssigt alle større DNS-afvisningslister, og hvis nogen af vores mailudvekslings ("MX") IP-adresser er opført på en større afvisningsliste, vil vi, hvis muligt, fjerne den fra den relevante DNS A-posts round robin, indtil problemet er løst.

På tidspunktet for denne skrivning er vi også opført på flere DNS-tilladelseslister, og vi tager overvågning af afvisningslister alvorligt. Hvis du oplever problemer, før vi har haft mulighed for at løse dem, bedes du underrette os skriftligt på <support@forwardemail.net>.

Vores IP-adresser er offentligt tilgængelige, [se denne sektion nedenfor for mere indsigt](#what-are-your-servers-ip-addresses).

### Hvad er postmaster-adresser {#what-are-postmaster-addresses}

For at forhindre fejlsendte afvisninger og afsendelse af ferieautomatiske svar til uovervågede eller ikke-eksisterende postkasser, vedligeholder vi en liste over mailer-daemon-lignende brugernavne:

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

Se [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) for mere indsigt i, hvordan lister som disse bruges til at skabe effektive emailsystemer.

### Hvad er no-reply-adresser {#what-are-no-reply-addresses}

Email-brugernavne, der svarer til nogen af følgende (case-insensitive), betragtes som no-reply-adresser:

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

Denne liste vedligeholdes [som et open source-projekt på GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Hvad er dine servers IP-adresser {#what-are-your-servers-ip-addresses}

Vi offentliggør vores IP-adresser på <https://forwardemail.net/ips>.

### Har I en tilladelsesliste {#do-you-have-an-allowlist}

Ja, vi har en [liste over domænenavnsendelser](#what-domain-name-extensions-are-allowlisted-by-default), som som standard er tilladte, samt en dynamisk, cachet og rullende tilladelsesliste baseret på [strenge kriterier](#what-is-your-allowlist-criteria).

Alle domæner, emails og IP-adresser, der bruges af betalende kunder, bliver automatisk tjekket mod vores afvisningsliste hver time – hvilket alarmerer administratorer, som manuelt kan gribe ind, hvis nødvendigt.

Derudover, hvis et af dine domæner eller dets emailadresser bliver afvist (f.eks. for at sende spam, vira eller på grund af efterligningsangreb) – vil domæneadministratorerne (dig) og vores teamadministratorer straks blive underrettet via email. Vi anbefaler kraftigt, at du [konfigurerer DMARC](#how-do-i-set-up-dmarc-for-forward-email) for at forhindre dette.

### Hvilke domænenavnsendelser er som standard tilladte {#what-domain-name-extensions-are-allowlisted-by-default}

Følgende domænenavnsendelser betragtes som som standard tilladte (uanset om de er på Umbrella Popularity List eller ej):

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
Derudover er disse [brand- og virksomhedstoplevelsesdomæner](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) som standard på hvidlisten (f.eks. `apple` for `applecard.apple` til Apple Card bankudtog):

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
Pr. 18. marts 2025 har vi også tilføjet disse franske oversøiske territorier til denne liste ([ifølge denne GitHub-anmodning](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Pr. 8. juli 2025 har vi tilføjet disse europæiske lande:

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

I oktober 2025 har vi også tilføjet <code class="notranslate">cz</code> (Tjekkiet) på grund af efterspørgsel.

Vi inkluderede specifikt ikke `ru` og `ua` på grund af høj spamaktivitet.

### Hvad er dine kriterier for tilladelseslisten {#what-is-your-allowlist-criteria}

Vi har en statisk liste over [domænenavnsendelser, der som standard er tilladte](#what-domain-name-extensions-are-allowlisted-by-default) – og vi vedligeholder også en dynamisk, cachet, rullende tilladelsesliste baseret på følgende strenge kriterier:

* Afsenderens roddomæne skal være af en [domænenavnsendelse, der matcher listen, vi tilbyder på vores gratis plan](#what-domain-name-extensions-can-be-used-for-free) (med tillæg af `biz` og `info`). Vi inkluderer også delvise match for `edu`, `gov` og `mil`, såsom `xyz.gov.au` og `xyz.edu.au`.
* Afsenderens roddomæne skal være inden for de 100.000 mest populære unikke roddomæner ifølge [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Afsenderens roddomæne skal være blandt de 50.000 mest populære unikke roddomæner, der har optrådt i mindst 4 af de sidste 7 dage i UPL's (\~50%+).
* Afsenderens roddomæne må ikke være [kategoriseret](https://radar.cloudflare.com/categorization-feedback/) som voksenindhold eller malware af Cloudflare.
* Afsenderens roddomæne skal have enten A- eller MX-poster sat op.
* Afsenderens roddomæne skal have enten A-poster, MX-poster, DMARC-post med `p=reject` eller `p=quarantine`, eller en SPF-post med `-all` eller `~all` kvalifikator.

Hvis disse kriterier er opfyldt, vil afsenderens roddomæne blive cachet i 7 dage. Bemærk, at vores automatiserede job kører dagligt – derfor er dette en rullende cache for tilladelseslisten, der opdateres dagligt.

Vores automatiserede job downloader de foregående 7 dages UPL'er i hukommelsen, pakker dem ud og parser dem i hukommelsen i henhold til de strenge kriterier ovenfor.

Populære domæner på tidspunktet for denne skrivning såsom Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify og flere – er naturligvis inkluderet.
Hvis du er en afsender, der ikke er på vores tilladelsesliste, vil du første gang, dit FQDN-roddomæne eller IP-adresse sender en e-mail, blive [ratebegrænset](#do-you-have-rate-limiting) og [grålistet](#do-you-have-a-greylist). Bemærk, at dette er standardpraksis, der er vedtaget som en e-mail-standard. De fleste e-mailserverklienter vil forsøge at sende igen, hvis de modtager en ratebegrænsnings- eller grålistefejl (f.eks. en 421- eller 4xx-fejlkode).

**Bemærk, at specifikke afsendere som `a@gmail.com`, `b@xyz.edu` og `c@gov.au` stadig kan blive [blokeret](#do-you-have-a-denylist)** (f.eks. hvis vi automatisk opdager spam, phishing eller malware fra disse afsendere).

### Hvilke domæneendelser kan bruges gratis {#what-domain-name-extensions-can-be-used-for-free}

Fra den 31. marts 2023 håndhævede vi en ny generel spamregel for at beskytte vores brugere og service.

Denne nye regel tillader kun følgende domæneendelser at blive brugt på vores gratis plan:

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
### Har I en greylist {#do-you-have-a-greylist}

Ja, vi har en meget lempelig [email greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) politik i brug. Greylisting gælder kun for afsendere, der ikke er på vores allowlist, og varer i vores cache i 30 dage.

For enhver ny afsender gemmer vi en nøgle i vores Redis-database i 30 dage med en værdi sat til den oprindelige ankomsttid for deres første anmodning. Vi afviser derefter deres email med en retry statuskode 450 og tillader kun, at den går igennem, når der er gået 5 minutter.

Hvis de med succes har ventet i 5 minutter fra denne oprindelige ankomsttid, vil deres emails blive accepteret, og de vil ikke modtage denne 450 statuskode.

Nøglen består enten af FQDN root-domænet eller afsenderens IP-adresse. Det betyder, at ethvert subdomæne, der passerer greylisten, også vil passere for root-domænet, og omvendt (det er det, vi mener med en "meget lempelig" politik).

For eksempel, hvis en email kommer fra `test.example.com` før vi ser en email komme fra `example.com`, så skal enhver email fra `test.example.com` og/eller `example.com` vente 5 minutter fra den oprindelige ankomsttid for forbindelsen. Vi får ikke både `test.example.com` og `example.com` til hver at vente deres egne 5 minutters perioder (vores greylisting-politik gælder på root-domæneniveau).

Bemærk, at greylisting ikke gælder for nogen afsender på vores [allowlist](#do-you-have-an-allowlist) (f.eks. Meta, Amazon, Netflix, Google, Microsoft på tidspunktet for denne skrivning).

### Har I en denylist {#do-you-have-a-denylist}

Ja, vi driver vores egen denylist og opdaterer den automatisk i realtid og manuelt baseret på spam og ondsindet aktivitet, der opdages.

Vi henter også alle IP-adresser fra UCEPROTECT Level 1 denylist på <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> hver time og føder dem ind i vores denylist med en udløbstid på 7 dage.

Afsendere, der findes i denylisten, vil modtage en 421 fejlkode (angiver til afsenderen at prøve igen senere), hvis de [ikke er allowlistede](#do-you-have-an-allowlist).

Ved at bruge en 421 statuskode i stedet for en 554 statuskode kan potentielle falske positiver afhjælpes i realtid, og så kan beskeden leveres succesfuldt ved næste forsøg.

**Dette er designet anderledes end andre mailtjenester**, hvor hvis du bliver sat på en blocklist, opstår der en hård og permanent fejl. Det er ofte svært at få afsendere til at prøve at sende beskeder igen (især fra store organisationer), og derfor giver denne tilgang cirka 5 dage fra det oprindelige emailforsøg til enten afsender, modtager eller os kan gribe ind og afhjælpe problemet (ved at anmode om fjernelse fra denylist).

Alle anmodninger om fjernelse fra denylist overvåges i realtid af administratorer (f.eks. så tilbagevendende falske positiver kan blive permanent allowlistet af administratorer).

Anmodninger om fjernelse fra denylist kan anmodes om på <https://forwardemail.net/denylist>. Betalte brugere får deres anmodninger om fjernelse fra denylist behandlet øjeblikkeligt, mens ikke-betalende brugere skal vente på, at administratorer behandler deres anmodning.

Afsendere, der opdages at sende spam eller virusindhold, vil blive tilføjet til denylisten efter følgende fremgangsmåde:

1. Det [oprindelige beskedfingeraftryk](#how-do-you-determine-an-email-fingerprint) greylistes ved påvisning af spam eller blocklist fra en "betroet" afsender (f.eks. `gmail.com`, `microsoft.com`, `apple.com`).
   * Hvis afsenderen var allowlistet, greylistes beskeden i 1 time.
   * Hvis afsenderen ikke er allowlistet, greylistes beskeden i 6 timer.
2. Vi parser denylist-nøgler fra information fra afsenderen og beskeden, og for hver af disse nøgler opretter vi (hvis den ikke allerede findes) en tæller, øger den med 1 og cacher den i 24 timer.
   * For allowlistede afsendere:
     * Tilføj en nøgle for kuvertens "MAIL FROM" emailadresse, hvis den havde bestået SPF eller ingen SPF, og den ikke var [en postmaster-brugernavn](#what-are-postmaster-addresses) eller [et no-reply-brugernavn](#what-are-no-reply-addresses).
     * Hvis "From"-headeren var allowlistet, så tilføj en nøgle for "From"-headerens emailadresse, hvis den havde bestået SPF eller bestået og justeret DKIM.
     * Hvis "From"-headeren ikke var allowlistet, så tilføj en nøgle for "From"-headerens emailadresse og dens rodparsede domænenavn.
   * For ikke-allowlistede afsendere:
     * Tilføj en nøgle for kuvertens "MAIL FROM" emailadresse, hvis den havde bestået SPF.
     * Hvis "From"-headeren var allowlistet, så tilføj en nøgle for "From"-headerens emailadresse, hvis den havde bestået SPF eller bestået og justeret DKIM.
     * Hvis "From"-headeren ikke var allowlistet, så tilføj en nøgle for "From"-headerens emailadresse og dens rodparsede domænenavn.
     * Tilføj en nøgle for afsenderens fjern-IP-adresse.
     * Tilføj en nøgle for klientens løste værtsnavn ved reverse lookup fra afsenderens IP-adresse (hvis nogen).
     * Tilføj en nøgle for rod-domænet af klientens løste værtsnavn (hvis nogen, og hvis det adskiller sig fra klientens løste værtsnavn).
3. Hvis tælleren når 5 for en ikke-allowlistet afsender og nøgle, så denylistes nøglen i 30 dage, og en email sendes til vores abuse-team. Disse tal kan ændre sig, og opdateringer vil blive afspejlet her, efterhånden som vi overvåger misbrug.
4. Hvis tælleren når 10 for en allowlistet afsender og nøgle, så denylistes nøglen i 7 dage, og en email sendes til vores abuse-team. Disse tal kan ændre sig, og opdateringer vil blive afspejlet her, efterhånden som vi overvåger misbrug.
> **BEMÆRK:** I den nærmeste fremtid vil vi introducere rygtetilsyn. Rygtetilsyn vil i stedet beregne, hvornår en afsender skal på sortlisten baseret på en procentgrænse (i stedet for en simpel tæller som nævnt ovenfor).

### Har I ratebegrænsning {#do-you-have-rate-limiting}

Afsenderratebegrænsning sker enten efter roddomænet udtrukket fra et reverse PTR-opslag på afsenderens IP-adresse – eller hvis det ikke giver resultat, bruges afsenderens IP-adresse. Bemærk, at vi nedenfor omtaler dette som `Sender`.

Vores MX-servere har daglige grænser for indgående mail modtaget til [krypteret IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service):

* I stedet for at ratebegrænse indgående mail modtaget på individuel alias-basis (f.eks. `you@yourdomain.com`) – ratebegrænser vi efter aliasets domænenavn (f.eks. `yourdomain.com`). Dette forhindrer, at `Senders` oversvømmer indbakkerne for alle aliaser på dit domæne på én gang.
* Vi har generelle grænser, der gælder for alle `Senders` på tværs af vores service uanset modtager:
  * `Senders`, som vi anser for at være "pålidelige" som sandhedskilde (f.eks. `gmail.com`, `microsoft.com`, `apple.com`) er begrænset til at sende 100 GB pr. dag.
  * `Senders`, der er [tilladte](#do-you-have-an-allowlist), er begrænset til at sende 10 GB pr. dag.
  * Alle andre `Senders` er begrænset til at sende 1 GB og/eller 1000 beskeder pr. dag.
* Vi har en specifik grænse pr. `Sender` og `yourdomain.com` på 1 GB og/eller 1000 beskeder dagligt.

MX-serverne begrænser også beskeder, der videresendes til en eller flere modtagere gennem ratebegrænsning – men dette gælder kun for `Senders`, der ikke er på [tilladelseslisten](#do-you-have-an-allowlist):

* Vi tillader kun op til 100 forbindelser pr. time, pr. `Sender` løst FQDN-roddomæne (eller) `Sender` fjern-IP-adresse (hvis der ikke er reverse PTR), og pr. kuvertmodtager. Vi gemmer nøglen til ratebegrænsning som et kryptografisk hash i vores Redis-database.

* Hvis du sender e-mail gennem vores system, skal du sikre, at du har en reverse PTR opsat for alle dine IP-adresser (ellers vil hver unik FQDN-roddomæne eller IP-adresse, du sender fra, blive ratebegrænset).

* Bemærk, at hvis du sender gennem et populært system som Amazon SES, vil du ikke blive ratebegrænset, da Amazon SES (på tidspunktet for denne skrivning) er på vores tilladelsesliste.

* Hvis du sender fra et domæne som `test.abc.123.example.com`, vil ratebegrænsningen blive pålagt `example.com`. Mange spammere bruger hundredevis af subdomæner for at omgå almindelige spamfiltre, der kun ratebegrænser unikke værtsnavne i stedet for unikke FQDN-roddomæner.

* `Senders`, der overskrider ratebegrænsningen, vil blive afvist med en 421-fejl.

Vores IMAP- og SMTP-servere begrænser dine aliaser til ikke at have mere end `60` samtidige forbindelser på én gang.

Vores MX-servere begrænser [ikke-tilladte](#do-you-have-an-allowlist) afsendere fra at etablere mere end 10 samtidige forbindelser (med 3 minutters cache-udløb for tælleren, hvilket svarer til vores socket timeout på 3 minutter).

### Hvordan beskytter I mod backscatter {#how-do-you-protect-against-backscatter}

Fejlsendte returmeddelelser eller bounce-spam (kendt som "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") kan forårsage negativt ry for afsender-IP-adresser.

Vi tager to skridt for at beskytte mod backscatter, som er detaljeret i følgende sektioner [Forhindre bounces fra kendte MAIL FROM-spammere](#prevent-bounces-from-known-mail-from-spammers) og [Forhindre unødvendige bounces for at beskytte mod backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) nedenfor.

### Forhindre bounces fra kendte MAIL FROM-spammere {#prevent-bounces-from-known-mail-from-spammers}

Vi henter listen fra [Backscatter.org](https://www.backscatterer.org/) (drevet af [UCEPROTECT](https://www.uceprotect.net/)) på <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> hver time og indlæser den i vores Redis-database (vi sammenligner også forskellen på forhånd; i tilfælde af at IP'er er fjernet, som skal respekteres).
Hvis MAIL FROM er tom ELLER er lig med (case-insensitivt) en af [postmaster-adresserne](#what-are-postmaster-addresses) (delen før @ i en e-mail), så tjekker vi, om afsenderens IP matcher en fra denne liste.

Hvis afsenderens IP er opført (og ikke i vores [allowlist](#do-you-have-an-allowlist)), sender vi en 554-fejl med beskeden `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Vi vil blive alarmeret, hvis en afsender er både på Backscatterer-listen og i vores allowlist, så vi kan løse problemet om nødvendigt.

De teknikker, der beskrives i dette afsnit, overholder "SAFE MODE"-anbefalingen på <https://www.backscatterer.org/?target=usage> – hvor vi kun tjekker afsender-IP, hvis visse betingelser allerede er opfyldt.

### Forhindre unødvendige afvisninger for at beskytte mod backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Afvisninger er e-mails, der indikerer, at videresendelse af e-mail fuldstændigt mislykkedes over for modtageren, og e-mailen vil ikke blive forsøgt igen.

En almindelig årsag til at blive opført på Backscatterer-listen er fejlagtigt dirigerede afvisninger eller bounce-spam, så vi skal beskytte mod dette på flere måder:

1. Vi sender kun, når >= 500 statuskodefejl opstår (når e-mails, der forsøges videresendt, er fejlet, f.eks. Gmail svarer med en 500-niveau fejl).

2. Vi sender kun én gang og kun én gang (vi bruger en beregnet bounce-fingeraftryksnøgle og gemmer den i cache for at forhindre dubletter). Bounce-fingeraftrykket er en nøgle, der er meddelelsens fingeraftryk kombineret med en hash af bounce-adressen og dens fejlkode). Se afsnittet om [Fingerprinting](#how-do-you-determine-an-email-fingerprint) for mere indsigt i, hvordan meddelelsens fingeraftryk beregnes. Succesfuldt sendte bounce-fingeraftryk udløber efter 7 dage i vores Redis-cache.

3. Vi sender kun, når MAIL FROM og/eller From ikke er tom og ikke indeholder (case-insensitivt) et [postmaster-brugernavn](#what-are-postmaster-addresses) (delen før @ i en e-mail).

4. Vi sender ikke, hvis den oprindelige meddelelse havde nogen af følgende headers (case-insensitivt):

   * Header `auto-submitted` med en værdi, der ikke er lig med `no`.
   * Header `x-auto-response-suppress` med en værdi af `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (uanset værdi).
   * Header `precedence` med en værdi af `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

5. Vi sender ikke, hvis MAIL FROM eller From e-mailadressen ender med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

6. Vi sender ikke, hvis From e-mailadressen brugernavn var `mdaemon` og den havde en case-insensitiv header `X-MDDSN-Message`.

7. Vi sender ikke, hvis der var en case-insensitiv `content-type` header med værdien `multipart/report`.

### Hvordan bestemmer I et e-mails fingeraftryk {#how-do-you-determine-an-email-fingerprint}

Et e-mails fingeraftryk bruges til at bestemme unikheden af en e-mail og forhindre, at dublerede meddelelser leveres og [dublerede afvisninger](#prevent-unnecessary-bounces-to-protect-against-backscatter) sendes.

Fingeraftrykket beregnes ud fra følgende liste:

* Klientens opløste FQDN-hostnavn eller IP-adresse
* `Message-ID` header-værdi (hvis nogen)
* `Date` header-værdi (hvis nogen)
* `From` header-værdi (hvis nogen)
* `To` header-værdi (hvis nogen)
* `Cc` header-værdi (hvis nogen)
* `Subject` header-værdi (hvis nogen)
* `Body` værdi (hvis nogen)

### Kan jeg videresende e-mails til porte andre end 25 (f.eks. hvis min ISP har blokeret port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, fra den 5. maj 2020 har vi tilføjet denne funktion. Lige nu er funktionen domænespecifik, i modsætning til alias-specifik. Hvis du har brug for, at det skal være alias-specifikt, bedes du kontakte os for at fortælle om dine behov.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Forbedret beskyttelse af privatliv:
  </strong>
  <span>
    Hvis du er på en betalt plan (som har forbedret beskyttelse af privatliv), så gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a>, klik på "Opsæt" ved siden af dit domæne, og klik derefter på "Indstillinger". Hvis du vil vide mere om betalte planer, se vores <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Priser</a>-side. Ellers kan du fortsætte med at følge instruktionerne nedenfor.
  </span>
</div>
Hvis du er på gratisplanen, skal du blot tilføje en ny DNS <strong class="notranslate">TXT</strong>-post som vist nedenfor, men ændre porten fra 25 til den port, du ønsker.

For eksempel, hvis jeg vil have alle e-mails, der går til `example.com`, til at videresende til aliasmodtageres SMTP-port 1337 i stedet for 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Det mest almindelige scenarie for opsætning af brugerdefineret portvideresendelse er, når du vil videresende alle e-mails, der går til example.com, til en anden port på example.com end SMTP-standarden port 25. For at sætte dette op skal du blot tilføje følgende <strong class="notranslate">TXT</strong> catch-all-post.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Understøtter det plus + symbolet for Gmail-aliaser {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, helt sikkert.

### Understøtter det subdomæner {#does-it-support-sub-domains}

Ja, helt sikkert. I stedet for at bruge "@", ".", eller tom som navn/host/alias, bruger du blot subdomænenavnet som værdien i stedet.

Hvis du vil have `foo.example.com` til at videresende e-mails, skal du indtaste `foo` som navn/host/alias-værdi i dine DNS-indstillinger (både for MX og <strong class="notranslate">TXT</strong>-poster).

### Videresender dette mine e-mails headers {#does-this-forward-my-emails-headers}

Ja, helt sikkert.

### Er dette veltestet {#is-this-well-tested}

Ja, der er skrevet tests med [ava](https://github.com/avajs/ava) og der er også kode-dækning.

### Videregiver I SMTP-responsbeskeder og -koder {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, helt sikkert. For eksempel, hvis du sender en e-mail til `hello@example.com` og den er registreret til at videresende til `user@gmail.com`, vil SMTP-responsbeskeden og koden fra "gmail.com" SMTP-serveren blive returneret i stedet for proxy-serveren på "mx1.forwardemail.net" eller "mx2.forwardemail.net".

### Hvordan forhindrer I spammere og sikrer et godt ry for e-mail videresendelse {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Se vores afsnit om [Hvordan fungerer jeres e-mail videresendelsessystem](#how-does-your-email-forwarding-system-work), [Hvordan håndterer I problemer med e-mail levering](#how-do-you-handle-email-delivery-issues), og [Hvordan håndterer I, at jeres IP-adresser bliver blokeret](#how-do-you-handle-your-ip-addresses-becoming-blocked) ovenfor.

### Hvordan udfører I DNS-opslag på domænenavne {#how-do-you-perform-dns-lookups-on-domain-names}

Vi har lavet et open source softwareprojekt :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) og bruger det til DNS-opslag. De standard DNS-servere, der bruges, er `1.1.1.1` og `1.0.0.1`, og DNS-forespørgsler sker via [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationslaget.

:tangerine: [Tangerine](https://github.com/tangerine) bruger som standard [CloudFlares privacy-første forbruger DNS-service][cloudflare-dns].


## Konto og Fakturering {#account-and-billing}

### Tilbyder I pengene tilbage garanti på betalte planer {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatiske refunderinger sker, når du opgraderer, nedgraderer eller annullerer din konto inden for 30 dage fra, din plan startede. Dette gælder kun for førstegangskunder.
### Hvis jeg skifter planer, pro-rater I så og refunderer forskellen {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Vi pro-rater ikke og refunderer ikke forskellen, når du skifter planer. I stedet konverterer vi den resterende varighed fra din eksisterende plans udløbsdato til den nærmeste relative varighed for din nye plan (afrundet ned til måned).

Bemærk, at hvis du opgraderer eller nedgraderer mellem betalte planer inden for en 30-dages periode siden du først startede en betalt plan, så refunderer vi automatisk det fulde beløb fra din eksisterende plan.

### Kan jeg bare bruge denne e-mail videresendelsestjeneste som en "fallback" eller "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nej, det anbefales ikke, da du kun kan bruge én mailudvekslingsserver ad gangen. Fallbacks bliver som regel aldrig forsøgt igen på grund af prioriteringsfejlkonfigurationer og mailservere, der ikke respekterer MX-udvekslingsprioritetskontrol.

### Kan jeg deaktivere specifikke aliaser {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du er på en betalt plan, skal du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Rediger Alias <i class="fa fa-angle-right"></i> Fjern markeringen i "Aktiv" afkrydsningsfeltet <i class="fa fa-angle-right"></i> Fortsæt.
  </span>
</div>

Ja, rediger blot din DNS <strong class="notranslate">TXT</strong>-post og præfiks aliaset med enten ét, to eller tre udråbstegn (se nedenfor).

Bemærk, at du *bør* bevare ":"-mappingsformatet, da dette er nødvendigt, hvis du nogensinde beslutter at slå dette fra igen (og det bruges også til import, hvis du opgraderer til en af vores betalte planer).

**For stille afvisning (senderen får det at vide, som om beskeden blev sendt succesfuldt, men den går faktisk ingen steder) (statuskode `250`):** Hvis du præfiksere et alias med "!" (enkelt udråbstegn), vil det returnere en succesfuld statuskode `250` til afsendere, der forsøger at sende til denne adresse, men e-mails vil ikke blive leveret nogen steder (f.eks. et sort hul eller `/dev/null`).

**For blød afvisning (statuskode `421`):** Hvis du præfiksere et alias med "!!" (dobbelt udråbstegn), vil det returnere en blød fejlstatuskode `421` til afsendere, der forsøger at sende til denne adresse, og e-mails vil ofte blive forsøgt igen i op til 5 dage før afvisning og afvisningsmeddelelse.

**For hård afvisning (statuskode `550`):** Hvis du præfiksere et alias med "!!!" (triple udråbstegn), vil det returnere en permanent fejlstatuskode `550` til afsendere, der forsøger at sende til denne adresse, og e-mails vil blive afvist og afvist med bounce.

For eksempel, hvis jeg ønsker, at alle e-mails, der går til `alias@example.com`, skal stoppe med at blive videresendt til `user@gmail.com` og blive afvist og bounce (f.eks. brug tre udråbstegn):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Du kan også omskrive den videresendte modtagers adresse til blot "nobody@forwardemail.net", som vil rute den til nobody som i eksemplet nedenfor.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Hvis du ønsker øget sikkerhed, kan du også fjerne ":user@gmail.com" (eller ":nobody@forwardemail.net") delen, så der kun står "!!!alias" som i eksemplet nedenfor.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Kan jeg videresende e-mails til flere modtagere {#can-i-forward-emails-to-multiple-recipients}

Ja, helt sikkert. Angiv blot flere modtagere i dine <strong class="notranslate">TXT</strong> poster.

For eksempel, hvis jeg vil have en e-mail, der går til `hello@example.com`, til at blive videresendt til `user+a@gmail.com` og `user+b@gmail.com`, så vil min <strong class="notranslate">TXT</strong> post se sådan ud:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Eller du kan angive dem på to separate linjer, som dette:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Det er op til dig!

### Kan jeg have flere globale catch-all modtagere {#can-i-have-multiple-global-catch-all-recipients}

Ja, det kan du. Angiv blot flere globale catch-all modtagere i dine <strong class="notranslate">TXT</strong> poster.

For eksempel, hvis jeg vil have, at hver e-mail, der går til `*@example.com` (asterisk betyder wildcard aka catch-all), skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, så vil min <strong class="notranslate">TXT</strong> post se sådan ud:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Eller du kan angive dem på to separate linjer, som dette:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Navn/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Svar/Værdi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", eller tom</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Det er op til dig!

### Er der en maksimal grænse for antallet af e-mailadresser, jeg kan videresende til pr. alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, standardgrænsen er 10. Dette betyder IKKE, at du kun kan have 10 aliaser på dit domænenavn. Du kan have så mange aliaser, som du vil (et ubegrænset antal). Det betyder, at du kun kan videresende ét alias til 10 unikke e-mailadresser. Du kunne have `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (fra 1-10) – og alle e-mails til `hello@example.com` ville blive videresendt til `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (fra 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Har du brug for mere end 10 modtagere pr. alias? Send os en e-mail, og vi vil med glæde øge din kontos grænse.
  </span>
</div>

### Kan jeg videresende e-mails rekursivt {#can-i-recursively-forward-emails}

Ja, det kan du, men du skal stadig overholde den maksimale grænse. Hvis du har `hello:linus@example.com` og `linus:user@gmail.com`, så vil e-mails til `hello@example.com` blive videresendt til `linus@example.com` og `user@gmail.com`. Bemærk, at der vil blive vist en fejl, hvis du forsøger at videresende e-mails rekursivt ud over den maksimale grænse.

### Kan folk afmelde eller tilmelde min e-mailvideresendelse uden min tilladelse {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Vi bruger MX- og <strong class="notranslate">TXT</strong>-postverifikation, så hvis du tilføjer denne tjenestes respektive MX- og <strong class="notranslate">TXT</strong>-poster, så er du tilmeldt. Hvis du fjerner dem, er du afmeldt. Du ejer dit domæne og DNS-administration, så hvis nogen har adgang til det, er det et problem.

### Hvordan er det gratis {#how-is-it-free}

Forward Email tilbyder en gratis plan gennem en kombination af open source-udvikling, effektiv infrastruktur og valgfrie betalte planer, der understøtter tjenesten.

Vores gratis plan understøttes af:

1. **Open Source-udvikling**: Vores kodebase er open source, hvilket tillader bidrag fra fællesskabet og gennemsigtig drift.

2. **Effektiv infrastruktur**: Vi har optimeret vores systemer til at håndtere e-mailvideresendelse med minimale ressourcer.

3. **Betalte premium-planer**: Brugere, der har brug for ekstra funktioner som SMTP-afsendelse, IMAP-modtagelse eller forbedrede privatlivsindstillinger, abonnerer på vores betalte planer.

4. **Rimelige brugsgrænser**: Den gratis plan har fair brugsregler for at forhindre misbrug.

> \[!NOTE]
> Vi er forpligtet til at holde grundlæggende e-mailvideresendelse gratis, samtidig med at vi tilbyder premium-funktioner til brugere med mere avancerede behov.

> \[!TIP]
> Hvis du finder vores tjeneste værdifuld, overvej at opgradere til en betalt plan for at støtte løbende udvikling og vedligeholdelse.

### Hvad er den maksimale e-mailstørrelsesgrænse {#what-is-the-max-email-size-limit}

Vi har som standard en grænse på 50MB, som inkluderer indhold, headers og vedhæftede filer. Bemærk, at tjenester som Gmail og Outlook kun tillader en grænse på 25MB, og hvis du overskrider denne grænse, når du sender til adresser hos disse udbydere, vil du modtage en fejlmeddelelse.

Der returneres en fejl med den korrekte svar kode, hvis filstørrelsesgrænsen overskrides.

### Gemmer I logfiler over e-mails {#do-you-store-logs-of-emails}

Nej, vi skriver ikke til disk eller gemmer logfiler – med [undtagelse af fejl](#do-you-store-error-logs) og [udgående SMTP](#do-you-support-sending-email-with-smtp) (se vores [Privatlivspolitik](/privacy)).

Alt foregår i hukommelsen, og [vores kildekode er på GitHub](https://github.com/forwardemail).

### Gemmer I fejl-logfiler {#do-you-store-error-logs}

**Ja. Du kan få adgang til fejl-logfiler under [Min Konto → Logs](/my-account/logs) eller [Min Konto → Domæner](/my-account/domains).**

Fra februar 2023 gemmer vi fejl-logfiler for `4xx` og `5xx` SMTP-svarskoder i en periode på 7 dage – som indeholder SMTP-fejlen, konvolutten og e-mailheaders (vi **gemmer ikke** e-mailens indhold eller vedhæftede filer).
Fejllogs giver dig mulighed for at tjekke for manglende vigtige e-mails og mindske spam falske positiver for [dine domæner](/my-account/domains). De er også en fremragende ressource til fejlfinding af problemer med [email webhooks](#do-you-support-webhooks) (da fejllogs indeholder webhook-endpointets svar).

Fejllogs for [ratebegrænsning](#do-you-have-rate-limiting) og [greylisting](#do-you-have-a-greylist) er ikke tilgængelige, da forbindelsen afsluttes tidligt (f.eks. før `RCPT TO` og `MAIL FROM` kommandoer kan sendes).

Se vores [Privatlivspolitik](/privacy) for mere indsigt.

### Læser I mine e-mails {#do-you-read-my-emails}

Nej, absolut ikke. Se vores [Privatlivspolitik](/privacy).

Mange andre e-mail videresendelsestjenester gemmer og kan potentielt læse dine e-mails. Der er ingen grund til, at videresendte e-mails skal gemmes på disk – og derfor har vi designet den første open source-løsning, der håndterer det hele i hukommelsen.

Vi mener, at du skal have ret til privatliv, og vi respekterer det strengt. Koden, der er implementeret på serveren, er [open source-software på GitHub](https://github.com/forwardemail) for gennemsigtighed og for at opbygge tillid.

### Kan jeg "sende mail som" i Gmail med dette {#can-i-send-mail-as-in-gmail-with-this}

Ja! Fra den 2. oktober 2018 har vi tilføjet denne funktion. Se [Hvordan man sender mail som ved brug af Gmail](#how-to-send-mail-as-using-gmail) ovenfor!

Du bør også sætte SPF-posten for Gmail i din DNS-konfiguration <strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du bruger Gmail (f.eks. Send Mail As) eller G Suite, skal du tilføje <code>include:_spf.google.com</code> til din SPF <strong class="notranslate">TXT</strong>-post, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Kan jeg "sende mail som" i Outlook med dette {#can-i-send-mail-as-in-outlook-with-this}

Ja! Fra den 2. oktober 2018 har vi tilføjet denne funktion. Se blot disse to links fra Microsoft nedenfor:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Du bør også sætte SPF-posten for Outlook i din DNS-konfiguration <strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vigtigt:
  </strong>
  <span>
    Hvis du bruger Microsoft Outlook eller Live.com, skal du tilføje <code>include:spf.protection.outlook.com</code> til din SPF <strong class="notranslate">TXT</strong>-post, for eksempel:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Kan jeg "sende mail som" i Apple Mail og iCloud Mail med dette {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Hvis du er abonnent på iCloud+, kan du bruge et brugerdefineret domæne. [Vores tjeneste er også kompatibel med Apple Mail](#apple-mail).

Se venligst <https://support.apple.com/en-us/102540> for mere information.

### Kan jeg videresende ubegrænsede e-mails med dette {#can-i-forward-unlimited-emails-with-this}

Ja, dog er "relativt ukendte" afsendere ratebegrænset til 100 forbindelser per time per værtsnavn eller IP. Se afsnittet om [Ratebegrænsning](#do-you-have-rate-limiting) og [Greylisting](#do-you-have-a-greylist) ovenfor.

Med "relativt ukendte" mener vi afsendere, der ikke optræder på [tilladelisten](#do-you-have-an-allowlist).

Hvis denne grænse overskrides, sender vi en 421 svar kode, som fortæller afsenderens mailserver at prøve igen senere.

### Tilbyder I ubegrænsede domæner for én pris {#do-you-offer-unlimited-domains-for-one-price}

Ja. Uanset hvilken plan du er på, betaler du kun én månedlig pris – som dækker alle dine domæner.
### Hvilke betalingsmetoder accepterer I {#which-payment-methods-do-you-accept}

Forward Email accepterer følgende engangs- eller månedlige/kvartalsvise/årlige betalingsmetoder:

1. **Kredit-/Debitkort/Bankoverførsler**: Visa, Mastercard, American Express, Discover, JCB, Diners Club osv.
2. **PayPal**: Tilslut din PayPal-konto for nemme betalinger
3. **Kryptovaluta**: Vi accepterer betalinger via Stripes stablecoin-betalinger på Ethereum-, Polygon- og Solana-netværk

> \[!NOTE]
> Vi gemmer begrænsede betalingsoplysninger på vores servere, som kun inkluderer betalingsidentifikatorer og referencer til [Stripe](https://stripe.com/global) og [PayPal](https://www.paypal.com) transaktions-, kunde-, abonnements- og betalings-ID'er.

> \[!TIP]
> For maksimal privatliv, overvej at bruge kryptovalutabegalinger.

Alle betalinger behandles sikkert gennem Stripe eller PayPal. Dine betalingsoplysninger gemmes aldrig på vores servere.


## Yderligere ressourcer {#additional-resources}

> \[!TIP]
> Vores artikler nedenfor opdateres regelmæssigt med nye vejledninger, tips og teknisk information. Tjek ofte for det nyeste indhold.

* [Case Studies & Udviklerdokumentation](/blog/docs)
* [Ressourcer](/resources)
* [Vejledninger](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
