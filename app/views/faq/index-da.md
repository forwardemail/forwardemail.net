# Ofte stillede spørgsmål {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Indholdsfortegnelse {#table-of-contents}

* [Hurtig start](#quick-start)
* [Indledning](#introduction)
  * [Hvad er videresendt e-mail](#what-is-forward-email)
  * [Hvem bruger videresendt e-mail](#who-uses-forward-email)
  * [Hvad er historikken for videresendelse af e-mails](#what-is-forward-emails-history)
  * [Hvor hurtig er denne service](#how-fast-is-this-service)
* [E-mailklienter](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobile enheder](#mobile-devices)
  * [Sådan sender du e-mail som ved hjælp af Gmail](#how-to-send-mail-as-using-gmail)
  * [Hvad er den gratis, ældre guide til Send mail som ved hjælp af Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Avanceret Gmail-routingkonfiguration](#advanced-gmail-routing-configuration)
  * [Avanceret Outlook-routingkonfiguration](#advanced-outlook-routing-configuration)
* [Fejlfinding](#troubleshooting)
  * [Hvorfor modtager jeg ikke mine testmails](#why-am-i-not-receiving-my-test-emails)
  * [Hvordan konfigurerer jeg min e-mailklient til at fungere med videresendelse af e-mail](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Hvorfor lander mine e-mails i spam og junk, og hvordan kan jeg tjekke mit domæneomdømme?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Hvad skal jeg gøre, hvis jeg modtager spam-e-mails](#what-should-i-do-if-i-receive-spam-emails)
  * [Hvorfor vises mine testmails, der er sendt til mig selv, som "mistænkelige" i Gmail?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Kan jeg fjerne via forwardemail punktum .net i Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Datahåndtering](#data-management)
  * [Hvor er jeres servere placeret](#where-are-your-servers-located)
  * [Hvordan eksporterer og sikkerhedskopierer jeg min postkasse](#how-do-i-export-and-backup-my-mailbox)
  * [Hvordan importerer og migrerer jeg min eksisterende postkasse](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Støtter du selv-hosting](#do-you-support-self-hosting)
* [E-mailkonfiguration](#email-configuration)
  * [Hvordan kommer jeg i gang og konfigurerer videresendelse af e-mails](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Kan jeg bruge flere MX-udvekslinger og servere til avanceret videresendelse?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hvordan konfigurerer jeg et feriesvar (automatisk svar uden for kontoret)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hvordan konfigurerer jeg SPF til videresendelse af e-mails](#how-do-i-set-up-spf-for-forward-email)
  * [Hvordan konfigurerer jeg DKIM til videresendelse af e-mails](#how-do-i-set-up-dkim-for-forward-email)
  * [Hvordan konfigurerer jeg DMARC til videresendelse af e-mail](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hvordan forbinder og konfigurerer jeg mine kontakter](#how-do-i-connect-and-configure-my-contacts)
  * [Hvordan forbinder og konfigurerer jeg mine kalendere](#how-do-i-connect-and-configure-my-calendars)
  * [Hvordan tilføjer jeg flere kalendere og administrerer eksisterende kalendere?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hvordan konfigurerer jeg SRS til videresendelse af e-mail](#how-do-i-set-up-srs-for-forward-email)
  * [Hvordan konfigurerer jeg MTA-STS til videresendelse af e-mails](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hvordan tilføjer jeg et profilbillede til min e-mailadresse](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Avancerede funktioner](#advanced-features)
  * [Understøtter I nyhedsbreve eller mailinglister til markedsføringsrelaterede e-mails?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Understøtter I afsendelse af e-mails med API](#do-you-support-sending-email-with-api)
  * [Understøtter I modtagelse af e-mails med IMAP](#do-you-support-receiving-email-with-imap)
  * [Understøtter du POP3](#do-you-support-pop3)
  * [Understøtter I kalendere (CalDAV)?](#do-you-support-calendars-caldav)
  * [Understøtter du kontakter (CardDAV)](#do-you-support-contacts-carddav)
  * [Understøtter I afsendelse af e-mail med SMTP](#do-you-support-sending-email-with-smtp)
  * [Understøtter I OpenPGP/MIME, end-to-end-kryptering ("E2EE") og Web Key Directory ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Støtter du MTA-STS](#do-you-support-mta-sts)
  * [Understøtter I adgangsnøgler og WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Støtter du bedste praksis for e-mail](#do-you-support-email-best-practices)
  * [Understøtter I bounce webhooks](#do-you-support-bounce-webhooks)
  * [Understøtter I webhooks?](#do-you-support-webhooks)
  * [Understøtter du regulære udtryk eller regex?](#do-you-support-regular-expressions-or-regex)
  * [Hvad er jeres udgående SMTP-grænser](#what-are-your-outbound-smtp-limits)
  * [Har jeg brug for godkendelse for at aktivere SMTP](#do-i-need-approval-to-enable-smtp)
  * [Hvad er dine SMTP-serverkonfigurationsindstillinger](#what-are-your-smtp-server-configuration-settings)
  * [Hvad er dine IMAP-serverkonfigurationsindstillinger](#what-are-your-imap-server-configuration-settings)
  * [Hvad er dine POP3-serverkonfigurationsindstillinger](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP-relækonfiguration](#postfix-smtp-relay-configuration)
* [Sikkerhed](#security)
  * [Avancerede serverhærdningsteknikker](#advanced-server-hardening-techniques)
  * [Har du SOC 2- eller ISO 27001-certificeringer?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Bruger du TLS-kryptering til videresendelse af e-mails](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bevarer du e-mail-godkendelsesheadere](#do-you-preserve-email-authentication-headers)
  * [Bevarer I de originale e-mail-overskrifter og forhindrer I spoofing?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hvordan beskytter du dig mod spam og misbrug](#how-do-you-protect-against-spam-and-abuse)
  * [Gemmer du e-mailindhold på disk?](#do-you-store-email-content-on-disk)
  * [Kan e-mailindhold blive eksponeret under systemnedbrud](#can-email-content-be-exposed-during-system-crashes)
  * [Hvem har adgang til din e-mailinfrastruktur](#who-has-access-to-your-email-infrastructure)
  * [Hvilke infrastrukturudbydere bruger I](#what-infrastructure-providers-do-you-use)
  * [Tilbyder I en databehandleraftale (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hvordan håndterer I anmeldelser af databrud](#how-do-you-handle-data-breach-notifications)
  * [Tilbyder I et testmiljø](#do-you-offer-a-test-environment)
  * [Tilbyder I overvågnings- og alarmeringsværktøjer?](#do-you-provide-monitoring-and-alerting-tools)
  * [Hvordan sikrer du høj tilgængelighed](#how-do-you-ensure-high-availability)
  * [Overholder du paragraf 889 i National Defense Authorization Act (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [System- og tekniske detaljer](#system-and-technical-details)
  * [Gemmer du e-mails og deres indhold](#do-you-store-emails-and-their-contents)
  * [Hvordan fungerer jeres system til videresendelse af e-mails](#how-does-your-email-forwarding-system-work)
  * [Hvordan behandler du en e-mail til videresendelse](#how-do-you-process-an-email-for-forwarding)
  * [Hvordan håndterer du problemer med e-maillevering](#how-do-you-handle-email-delivery-issues)
  * [Hvordan håndterer du blokering af dine IP-adresser](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Hvad er postmesteradresser](#what-are-postmaster-addresses)
  * [Hvad er adresser uden svar](#what-are-no-reply-addresses)
  * [Hvad er din servers IP-adresser](#what-are-your-servers-ip-addresses)
  * [Har du en tilladelsesliste](#do-you-have-an-allowlist)
  * [Hvilke domænenavnsudvidelser er som standard tilladt på listen](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Hvad er dine kriterier for tilladelsesliste](#what-is-your-allowlist-criteria)
  * [Hvilke domænenavnsudvidelser kan bruges gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Har du en gråliste](#do-you-have-a-greylist)
  * [Har du en afvisningsliste](#do-you-have-a-denylist)
  * [Har du en hastighedsbegrænsning](#do-you-have-rate-limiting)
  * [Hvordan beskytter du dig mod tilbagespredning](#how-do-you-protect-against-backscatter)
  * [Forhindr afvisninger fra kendte spammere af MAIL FRA](#prevent-bounces-from-known-mail-from-spammers)
  * [Forhindr unødvendige bounces for at beskytte mod backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hvordan bestemmer man et e-mail-fingeraftryk](#how-do-you-determine-an-email-fingerprint)
  * [Kan jeg videresende e-mails til andre porte end 25 (f.eks. hvis min internetudbyder har blokeret port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Understøtter det plus + symbolet for Gmail-aliasser](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Understøtter det underdomæner](#does-it-support-sub-domains)
  * [Videresender dette mine e-mails headere?](#does-this-forward-my-emails-headers)
  * [Er dette velafprøvet](#is-this-well-tested)
  * [Videregiver du SMTP-svarmeddelelser og -koder](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hvordan forhindrer du spammere og sikrer et godt omdømme for videresendelse af e-mails](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hvordan udfører du DNS-opslag på domænenavne](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto og fakturering](#account-and-billing)
  * [Tilbyder I en pengene-tilbage-garanti på betalte planer](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Hvis jeg skifter abonnement, betaler I så forholdsmæssigt og refunderer differencen?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Kan jeg bare bruge denne e-mail-videresendelsestjeneste som en "fallback" eller "fallover" MX-server?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Kan jeg deaktivere specifikke aliasser](#can-i-disable-specific-aliases)
  * [Kan jeg videresende e-mails til flere modtagere](#can-i-forward-emails-to-multiple-recipients)
  * [Kan jeg have flere globale catch-all-modtagere](#can-i-have-multiple-global-catch-all-recipients)
  * [Er der en maksimal grænse for antallet af e-mailadresser, jeg kan videresende til per alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Kan jeg videresende e-mails rekursivt](#can-i-recursively-forward-emails)
  * [Kan folk afregistrere eller registrere min videresendelse af e-mails uden min tilladelse](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hvordan er det gratis](#how-is-it-free)
  * [Hvad er den maksimale størrelse på e-mails](#what-is-the-max-email-size-limit)
  * [Gemmer du logfiler over e-mails](#do-you-store-logs-of-emails)
  * [Gemmer du fejllogfiler](#do-you-store-error-logs)
  * [Læser du mine e-mails](#do-you-read-my-emails)
  * [Kan jeg "sende mail som" i Gmail med dette?](#can-i-send-mail-as-in-gmail-with-this)
  * [Kan jeg "sende mail som" i Outlook med dette?](#can-i-send-mail-as-in-outlook-with-this)
  * [Kan jeg "sende mail som" i Apple Mail og iCloud Mail med dette?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Kan jeg videresende et ubegrænset antal e-mails med dette](#can-i-forward-unlimited-emails-with-this)
  * [Tilbyder I et ubegrænset antal domæner til én pris](#do-you-offer-unlimited-domains-for-one-price)
  * [Hvilke betalingsmetoder accepterer I](#which-payment-methods-do-you-accept)
* [Yderligere ressourcer](#additional-resources)

## Hurtigstart {#quick-start}

Sådan kommer du i gang med at videresende e-mail:

1. **Opret en konto** på [forwardemail.net/register](https://forwardemail.net/register)

2. **Tilføj og bekræft dit domæne** under [Min konto → Domæner](/my-account/domains)

3. **Tilføj og konfigurer e-mail-aliasser/postkasser** under [Min konto → Domæner](/my-account/domains) → Aliaser

4. **Test din opsætning** ved at sende en e-mail til et af dine nye aliaser

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Introduktion {#introduction}

### Hvad er videresendelsesmail {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email er en **fuldt udstyret e-mailudbyder** og **e-mailhostingudbyder til brugerdefinerede domænenavne**.

Det er den eneste gratis og open source-tjeneste, og den giver dig mulighed for at bruge brugerdefinerede domæne-e-mailadresser uden kompleksiteten ved at oprette og vedligeholde din egen e-mailserver.

Vores tjeneste videresender e-mails sendt til dit brugerdefinerede domæne til din eksisterende e-mailkonto – og du kan endda bruge os som din dedikerede e-mailhostingudbyder.

Nøglefunktioner i Videresend e-mail:

* **Brugerdefineret domæne-e-mail**: Brug professionelle e-mailadresser med dit eget domænenavn
* **Gratis niveau**: Grundlæggende videresendelse af e-mails uden omkostninger
* **Udvidet privatliv**: Vi læser ikke dine e-mails eller sælger dine data
* **Open Source**: Hele vores kodebase er tilgængelig på GitHub
* **SMTP-, IMAP- og POP3-understøttelse**: Fuld mulighed for at sende og modtage e-mails
* **End-to-End-kryptering**: Understøttelse af OpenPGP/MIME
* **Brugerdefinerede Catch-All-aliasser**: Opret et ubegrænset antal e-mail-aliasser

Du kan sammenligne os med mere end 56 andre e-mailudbydere på [vores side om e-mailsammenligning](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Hvem bruger videresendelse af e-mail {#who-uses-forward-email}

Vi tilbyder e-mailhosting og e-mailvideresendelse til over 500.000 domæner og disse bemærkelsesværdige brugere:

| Kunde | Casestudie |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Det amerikanske flådeakademi | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanonisk | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix-spil |  |
| Linux Foundation | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP-fonden |  |
| Fox News Radio |  |
| Disney-reklamesalg |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| I menneskeheden | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| University of Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitetet i Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universitetet i Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts Universitet | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Sydaustraliens regering |  |
| Den Dominikanske Republiks regering |  |
| Flyv<span>.</span>io |  |
| RCD-hoteller |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Hvad er historikken for videresendelse af e-mails {#what-is-forward-emails-history}

Du kan få mere at vide om videresendelse af e-mail på [vores Om-side](/about).

### Hvor hurtig er denne tjeneste {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Videresend e-mail leverer beskeder med minimal forsinkelse, typisk inden for få sekunder efter modtagelsen.

Præstationsmålinger:

* **Gennemsnitlig leveringstid**: Mindre end 5-10 sekunder fra modtagelse til videresendelse ([se vores side med "TTI"-overvågning af tid til indbakke](/tti))
* **Oppetid**: 99,9%+ servicetilgængelighed
* **Global infrastruktur**: Servere strategisk placeret for optimal routing
* **Automatisk skalering**: Vores system skalerer i perioder med spidsbelastning på e-mail

Vi opererer i realtid, i modsætning til andre udbydere, der er afhængige af forsinkede køer.

Vi skriver ikke til disk eller gemmer logs – med [undtagelse af fejl](#do-you-store-error-logs) og [udgående SMTP](#do-you-support-sending-email-with-smtp) (se vores [Privatlivspolitik](/privacy)).

Alt gøres i hukommelsen og [vores kildekode er på GitHub](https://github.com/forwardemail).

## E-mailklienter {#email-clients}

### Thunderbird {#thunderbird}

1. Opret et nyt alias og generer en adgangskode i dit dashboard til videresendelse af e-mail.
2. Åbn Thunderbird, og gå til **Rediger → Kontoindstillinger → Kontohandlinger → Tilføj e-mailkonto**.
3. Indtast dit navn, din e-mailadresse og din adgangskode.
4. Klik på **Konfigurer manuelt**, og indtast:
* Indgående: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Udgående: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Klik på **Udført**

### Microsoft Outlook {#microsoft-outlook}

1. Opret et nyt alias og generer en adgangskode i dit dashboard til videresendelse af e-mail.
2. Gå til **Fil → Tilføj konto**
3. Indtast din videresendelses-e-mailadresse, og klik på **Opret forbindelse**
4. Vælg **Avancerede indstillinger**, og vælg **Lad mig oprette min konto manuelt**
5. Vælg **IMAP**, og indtast:
* Indgående: `imap.forwardemail.net`, port 993, SSL
* Udgående: `smtp.forwardemail.net`, port 587, TLS
* Brugernavn: Din fulde e-mailadresse
* Adgangskode: Din genererede adgangskode
6. Klik på **Opret forbindelse**

### Apple Mail {#apple-mail}

1. Opret et nyt alias og generer en adgangskode i dit dashboard til videresendelse af e-mail.
2. Gå til **Mail → Indstillinger → Konti → +**
3. Vælg **Anden mailkonto**
4. Indtast dit navn, din adresse til videresendelse af e-mail og din adgangskode.
5. For serverindstillinger skal du indtaste:
* Indgående: `imap.forwardemail.net`
* Udgående: `smtp.forwardemail.net`
* Brugernavn: Din fulde e-mailadresse.
* Adgangskode: Din genererede adgangskode.
6. Klik på **Log ind**

### Mobilenheder {#mobile-devices}

Til iOS:

1. Gå til **Indstillinger → Mail → Konti → Tilføj konto → Andet**
2. Tryk på **Tilføj mailkonto** og indtast dine oplysninger
3. Brug de samme IMAP- og SMTP-indstillinger som ovenfor for serverindstillinger

Til Android:

1. Gå til **Indstillinger → Konti → Tilføj konto → Personlig (IMAP)**
2. Indtast din videresendelses-e-mailadresse og adgangskode
3. Brug de samme IMAP- og SMTP-indstillinger som ovenfor for serverindstillinger

### Sådan sender du e-mails som Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Forventet opsætningstid:</strong>
<span>Mindre end 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Kom godt i gang:
</strong>
<span>
Hvis du har fulgt instruktionerne ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og konfigurerer videresendelse af e-mails</a>, kan du fortsætte med at læse nedenfor.
</span>
</div>

<div id="send-mail-som-indhold">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Udgående SMTP-begrænsninger</a> – din brug betragtes som anerkendelse og samtykke.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du er udvikler, kan du læse vores <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API-dokumentation</a>.
</span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsvejledningen.

2. Opret et nyt alias til dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

3. Klik på <strong class="text-success"><i class="fa fa-key"></i>Generer adgangskode</strong> ud for det nyoprettede alias. Kopier den genererede adgangskode, der vises på skærmen, til din udklipsholder, og gem den sikkert.

4. Gå til [Gmail](https://gmail.com) og under [Indstillinger <i class="fa fa-angle-right"></i> Konti og import <i class="fa fa-angle-right"></i> Send mail som](https://mail.google.com/mail/u/0/#settings/accounts) skal du klikke på "Tilføj en anden e-mailadresse".

5. Når du bliver bedt om "Navn", skal du indtaste det navn, som din e-mail skal vises som "Fra" (f.eks. "Linus Torvalds").

6. Når du bliver bedt om "E-mailadresse", skal du indtaste den fulde e-mailadresse på et alias, du har oprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

7. Fjern markeringen i "Behandl som et alias"

8. Klik på "Næste trin" for at fortsætte

9. Når du bliver bedt om at angive "SMTP-server", skal du indtaste <code>smtp.forwardemail.net</code> og lade porten være <code>587</code>

10. Når du bliver bedt om "Brugernavn", skal du indtaste den fulde e-mailadresse på et alias, du har oprettet under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

11. Når du bliver bedt om "Adgangskode", skal du indsætte adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> i trin 3 ovenfor.

12. Lad alternativknappen være markeret ud for "Sikker forbindelse ved hjælp af TLS"

13. Klik på "Tilføj konto" for at fortsætte

14. Åbn en ny fane i [Gmail](https://gmail.com) og vent på, at din bekræftelsesmail ankommer (du modtager en bekræftelseskode, der bekræfter, at du er ejeren af den e-mailadresse, du forsøger at "Sende mail som").

15. Når den ankommer, skal du kopiere og indsætte bekræftelseskoden ved den prompt, du modtog i det forrige trin.

16. Når du har gjort det, skal du gå tilbage til e-mailen og klikke på linket for at "bekræfte anmodningen". Du skal højst sandsynligt udføre dette trin og det foregående trin for at e-mailen kan konfigureres korrekt.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tillykke!
</strong>
<span>
Du har gennemført alle trin.
</span>
</div>
</div>

</div>

### Hvad er den gratis guide til Send mail som med Gmail? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Vigtigt:</strong> Denne gratis guide er udfaset fra maj 2023, da <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we nu understøtter udgående SMTP</a>. Hvis du bruger guiden nedenfor, vil <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this få din udgående e-mail</a> til at vise "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" i Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Forventet opsætningstid:</strong>
<span>Mindre end 10 minutter</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Kom godt i gang:
</strong>
<span>
Hvis du har fulgt instruktionerne ovenfor under <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hvordan kommer jeg i gang og konfigurerer videresendelse af e-mails</a>, kan du fortsætte med at læse nedenfor.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Sådan sender du mails som Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>"

<div id="legacy-free-guide">

1. Du skal have [Gmails tofaktorgodkendelse][gmail-2fa] aktiveret for at dette kan virke. Besøg <https://www.google.com/landing/2step/>, hvis du ikke har det aktiveret.

2. Når tofaktorgodkendelse er aktiveret (eller hvis du allerede har aktiveret det), skal du besøge <https://myaccount.google.com/apppasswords>.

3. Når du bliver bedt om at vælge "Vælg den app og enhed, du vil generere app-adgangskoden til":
* Vælg "Mail" i rullemenuen for "Vælg app"
* Vælg "Andet" i rullemenuen for "Vælg enhed"
* Når du bliver bedt om at indtaste tekst, skal du indtaste den e-mailadresse på dit brugerdefinerede domæne, som du videresender fra (f.eks. <kode><hello@example.com></kode> - dette vil hjælpe dig med at holde styr på, hvis du bruger denne tjeneste til flere konti)

4. Kopier adgangskoden til dit udklipsholder, der genereres automatisk.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du bruger G Suite, skal du besøge dit administrationspanel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Indstillinger for Gmail <i class="fa fa-angle-right"></i> Indstillinger</a> og sørge for at markere "Tillad brugere at sende mail via en ekstern SMTP-server...". Der vil være en vis forsinkelse, før denne ændring aktiveres, så vent et par minutter.
</span>
</div>

5. Gå til [Gmail](https://gmail.com) og under [Indstillinger <i class="fa fa-angle-right"></i> Konti og import <i class="fa fa-angle-right"></i> Send mail som](https://mail.google.com/mail/u/0/#settings/accounts) skal du klikke på "Tilføj en anden e-mailadresse".

6. Når du bliver bedt om "Navn", skal du indtaste det navn, som din e-mail skal vises som "Fra" (f.eks. "Linus Torvalds").

7. Når du bliver bedt om "E-mailadresse", skal du indtaste e-mailadressen med det brugerdefinerede domæne, du brugte ovenfor (f.eks. <kode><hello@example.com></kode>)

8. Fjern markeringen i "Behandl som et alias"

9. Klik på "Næste trin" for at fortsætte

10. Når du bliver bedt om at angive "SMTP-server", skal du indtaste <code>smtp.gmail.com</code> og lade porten være <code>587</code>

11. Når du bliver bedt om "Brugernavn", skal du indtaste den del af din Gmail-adresse uden <span>gmail.com</span>-delen (f.eks. bare "bruger", hvis min e-mail er <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis "Brugernavn"-delen udfyldes automatisk, skal du <u><strong>ændre dette</strong></u> til brugernavnsdelen af din Gmail-adresse i stedet.
</span>
</div>

12. Når du bliver bedt om "Adgangskode", skal du indsætte den adgangskode, du genererede i trin 2 ovenfor, fra din udklipsholder.

13. Lad alternativknappen være markeret ud for "Sikker forbindelse ved hjælp af TLS"

14. Klik på "Tilføj konto" for at fortsætte

15. Åbn en ny fane i [Gmail](https://gmail.com) og vent på, at din bekræftelsesmail ankommer (du modtager en bekræftelseskode, der bekræfter, at du er ejeren af den e-mailadresse, du forsøger at "Sende mail som").

16. Når den ankommer, skal du kopiere og indsætte bekræftelseskoden ved den prompt, du modtog i det forrige trin.

17. Når du har gjort det, skal du gå tilbage til e-mailen og klikke på linket for at "bekræfte anmodningen". Du skal højst sandsynligt udføre dette trin og det foregående trin for at e-mailen kan konfigureres korrekt.

</div>

### Avanceret Gmail-routingkonfiguration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Forventet opsætningstid:</strong> <span>15-30 minutter</span>
</div>

Hvis du vil konfigurere avanceret routing i Gmail, så aliasser, der ikke matcher en postkasse, videresender til mailudvekslinger i Videresend e-mail, skal du følge disse trin:

1. Log ind på din Google-administrationskonsol på [admin.google.com](https://admin.google.com)
2. Gå til **Apps → Google Workspace → Gmail → Routing**
3. Klik på **Tilføj rute** og konfigurer følgende indstillinger:

**Indstillinger for enkeltmodtager:**

* Vælg "Skift kuvertmodtager" og indtast din primære Gmail-adresse
* Markér "Tilføj X-Gm-Original-To-header med original modtager"

**Modtagermønstre for kuverter:**

* Tilføj et mønster, der matcher alle ikke-eksisterende postkasser (f.eks. `.*@yourdomain.com`)

**Indstillinger for e-mailserver:**

* Vælg "Route to host" og indtast `mx1.forwardemail.net` som primær server
* Tilføj `mx2.forwardemail.net` som backupserver
* Indstil port til 25
* Vælg "Kræv TLS" af sikkerhedsmæssige årsager

4. Klik på **Gem** for at oprette ruten

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Denne konfiguration fungerer kun for Google Workspace-konti med brugerdefinerede domæner, ikke for almindelige Gmail-konti.
</span>
</div>

### Avanceret Outlook-routingkonfiguration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Forventet opsætningstid:</strong> <span>15-30 minutter</span>
</div>

For Microsoft 365-brugere (tidligere Office 365), der ønsker at konfigurere avanceret routing, så aliasser, der ikke matcher en postkasse, videresender til mailudvekslinger i Videresend mail:

1. Log ind på Microsoft 365 Administration på [admin.microsoft.com](https://admin.microsoft.com)
2. Gå til **Exchange → Mailflow → Regler**
3. Klik på **Tilføj en regel** og vælg **Opret en ny regel**
4. Navngiv din regel (f.eks. "Videresend ikke-eksisterende postkasser til Videresend e-mail")
5. Under **Anvend denne regel, hvis** skal du vælge:
* "Modtageradressen matcher..."
* Indtast et mønster, der matcher alle adresser på dit domæne (f.eks. `*@yourdomain.com`)
6. Under **Gør følgende** skal du vælge:
* "Omdiriger beskeden til..."
* Vælg "Følgende mailserver"
* Indtast `mx1.forwardemail.net` og port 25
* Tilføj `mx2.forwardemail.net` som en backupserver
7. Under **Medmindre hvis** skal du vælge:
* "Modtageren er..."
* Tilføj alle dine eksisterende postkasser, der ikke skal videresendt
8. Indstil regelprioriteten for at sikre, at den kører efter andre regler for mailflow
9. Klik på **Gem** for at aktivere reglen

## Fejlfinding {#troubleshooting}

### Hvorfor modtager jeg ikke mine test-e-mails {#why-am-i-not-receiving-my-test-emails}

Hvis du sender en testmail til dig selv, vises den muligvis ikke i din indbakke, fordi den har den samme "Message-ID"-header.

Dette er et alment kendt problem, og det påvirker også tjenester som Gmail. <a href="https://support.google.com/a/answer/1703601">Here" er det officielle Gmail-svar vedrørende dette problem</a>.

Hvis du fortsætter med at have problemer, er det højst sandsynligt et problem med DNS-udbredelsen. Du skal vente lidt længere og prøve igen (eller prøve at indstille en lavere TTL-værdi på dine <strong class="notranslate">TXT</strong>-poster).

**Har du stadig problemer?** <a href="/help">kontakt os</a>, så vi kan hjælpe med at undersøge problemet og finde en hurtig løsning.

### Hvordan konfigurerer jeg min e-mailklient til at fungere med videresendelse af e-mail {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Vores tjeneste fungerer med populære e-mailklienter såsom:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux™</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i>Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i>Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Dit brugernavn er dit alias' e-mailadresse, og adgangskoden er fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> ("Normal adgangskode").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Hvis du bruger Thunderbird, skal du sørge for, at "Forbindelsessikkerhed" er indstillet til "SSL/TLS", og at godkendelsesmetoden er indstillet til "Normal adgangskode".</span>
</div>

| Type | Værtsnavn | Protokol | Havne |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Foretrukket** | `993` og `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Foretrukket** eller TLS (STARTTLS) | `465` og `2465` for SSL/TLS (eller) `587`, `2587`, `2525` og `25` for TLS (STARTTLS) |

### Hvorfor lander mine e-mails i spam og uønsket mail, og hvordan kan jeg tjekke mit domæneomdømme {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Dette afsnit viser dig, om din udgående mail bruger vores SMTP-servere (f.eks. `smtp.forwardemail.net`) (eller videresendes via `mx1.forwardemail.net` eller `mx2.forwardemail.net`), og den leveres i modtagernes spam- eller junk-mappe.

Vi overvåger rutinemæssigt vores [IP-adresser](#what-are-your-servers-ip-addresses) i forhold til [alle velrenommerede DNS-afvisningslister](#how-do-you-handle-your-ip-addresses-becoming-blocked), **derfor er det højst sandsynligt et domæneomdømmespecifikt problem**.

E-mails kan lande i spam-mapper af flere årsager:

1. **Mangler godkendelse**: Opsæt [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) og [DMARC](#how-do-i-set-up-dmarc-for-forward-email) poster.

2. **Domæneomdømme**: Nye domæner har ofte et neutralt omdømme, indtil de etablerer en afsendelseshistorik.

3. **Indholdsudløsere**: Visse ord eller sætninger kan udløse spamfiltre.

4. **Sendemønstre**: Pludselige stigninger i e-mailmængden kan virke mistænkelige.

Du kan prøve at bruge et eller flere af disse værktøjer til at tjekke dit domænes omdømme og kategorisering:

| Værktøjsnavn | URL | Type |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Feedback om Cloudflare-domænekategorisering | <https://radar.cloudflare.com/domains/feedback> | Kategorisering |
| Spamhaus IP- og domæneomdømmetjekker | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP- og domæneomdømmecenter | <https://talosintelligence.com/reputation_center> | Omdømme |
| Barracuda IP og domæneomdømmeopslag | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox Blacklist Check | <https://mxtoolbox.com/blacklists.aspx> | Sortliste |
| Google Postmaster Tools | <https://www.gmail.com/postmaster/> | Omdømme |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Omdømme |
| MultiRBL.valli.org Blacklist Check | <https://multirbl.valli.org/lookup/> | DNSBL |
| Afsenderscore | <https://senderscore.org/act/blocklist-remover/> | Omdømme |
| Vurdering | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP fjernelse | <https://ipcheck.proofpoint.com/> | Fjernelse |
| Cloudmark IP fjernelse | <https://csi.cloudmark.com/en/reset/> | Fjernelse |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Fjernelse af Microsoft Outlook og Office 365 IP | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Fjernelse |
| UCEPROTECTs niveauer 1, 2 og 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECTs backscatterer.org | <https://www.backscatterer.org/> | Beskyttelse mod tilbagespredning |
| UCEPROTECT's whitelisted.org | <https://www.whitelisted.org/> (kræver et gebyr) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Fjernelse |
| AOL/Verizon (f.eks. `[IPTS04]`) | <https://senders.yahooinc.com/> | Fjernelse |
| Cox Communications | `unblock.request@cox.net` | Fjernelse |
| t-online.de (tysk/T-Mobile) | `tobr@rx.t-online.de` | Fjernelse |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### Hvad skal jeg gøre, hvis jeg modtager spam-e-mails {#what-should-i-do-if-i-receive-spam-emails}

Du bør afmelde dig fra e-maillisten (hvis muligt) og blokere afsenderen.

Rapportér venligst ikke beskeden som spam, men videresend den i stedet til vores manuelt kuraterede og privatlivsfokuserede system til forebyggelse af misbrug.

**E-mailadressen, som spam skal videresendes til, er:** <abuse@forwardemail.net>

### Hvorfor vises mine testmails, der sendes til mig selv i Gmail, som "mistænkelige" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Hvis du ser denne fejlmeddelelse i Gmail, når du sender en test til dig selv, eller når en person, du sender en e-mail til med dit alias, ser en e-mail fra dig for første gang, så **bare rolig** – da dette er en indbygget sikkerhedsfunktion i Gmail.

Du kan blot klikke på "Ser sikkert ud". Hvis du for eksempel sender en testbesked ved hjælp af funktionen "Send e-mail som" (til en anden), vil de ikke se denne besked.

Men hvis de ser denne besked, skyldes det, at de normalt var vant til at se dine e-mails komme fra <john@gmail.com> i stedet for <john@customdomain.com> (bare et eksempel). Gmail vil advare brugerne for at sikre, at tingene er sikre, i tilfælde af at der ikke er nogen løsning.

### Kan jeg fjerne via forwardemail punktum net i Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Dette emne er relateret til en [et alment kendt problem i Gmail, hvor ekstra information vises ud for afsenderens navn](https://support.google.com/mail/answer/1311182).

Fra maj 2023 understøtter vi afsendelse af e-mail med SMTP som et tilføjelsesprogram for alle betalende brugere – hvilket betyder, at du kan fjerne <span class="notranslate">via forwardemail dot net</span> i Gmail.

Bemærk, at dette ofte stillede spørgsmål er specifikt for dem, der bruger [Sådan sender du e-mail som ved hjælp af Gmail](#how-to-send-mail-as-using-gmail)-funktionen.

Se venligst afsnittet om [Understøtter I afsendelse af e-mail med SMTP](#do-you-support-sending-email-with-smtp) for konfigurationsvejledning.

## Datahåndtering {#data-management}

### Hvor er dine servere placeret {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Vores servere er primært placeret i Denver, Colorado – se <https://forwardemail.net/ips> for vores komplette liste over IP-adresser.

Du kan få mere at vide om vores underdatabehandlere på vores sider [GDPR](/gdpr), [DPA](/dpa) og [Privatliv](/privacy).

### Hvordan eksporterer og sikkerhedskopierer jeg min postkasse {#how-do-i-export-and-backup-my-mailbox}

Du kan til enhver tid eksportere dine postkasser som [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) eller krypterede [SQLite](https://en.wikipedia.org/wiki/SQLite) formater.

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Download sikkerhedskopi, og vælg din foretrukne eksportformattype.

Du vil modtage et link til download af eksporten via e-mail, når den er færdig.

Bemærk, at dette eksportlink til download udløber efter 4 timer af sikkerhedsmæssige årsager.

Hvis du har brug for at inspicere dine eksporterede EML- eller Mbox-formater, kan disse open-source-værktøjer være nyttige:

| Navn | Format | Platform | GitHub URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer | Mbox | Windows | <https://github.com/ename/mboxviewer> |
| mbox-web-viewer | Mbox | Alle platforme | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Windows | <https://github.com/ayamadori/EmlReader> |
| E-mail-fremviser | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-læser | EML | Alle platforme | <https://github.com/s0ph1e/eml-reader> |

Hvis du desuden har brug for at konvertere en Mbox-fil til en EML-fil, kan du bruge <https://github.com/noelmartinon/mboxzilla>.

### Hvordan importerer og migrerer jeg min eksisterende postkasse {#how-do-i-import-and-migrate-my-existing-mailbox}

Du kan nemt importere din e-mail til Videresend e-mail (f.eks. ved hjælp af [Thunderbird](https://www.thunderbird.net)) med instruktionerne nedenfor:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Du skal følge alle følgende trin for at importere din eksisterende e-mail.
</span>
</div>

1. Eksporter din e-mail fra din eksisterende e-mailudbyder:

| E-mailudbyder | Eksportformat | Eksportinstruktioner |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Outlook | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Hvis du bruger Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-eksportformat</a>), kan du blot følge instruktionerne under "Andet" nedenfor. Vi har dog nedenfor angivet links til at konvertere PST til MBOX/EML-format baseret på dit operativsystem:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba til Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst til Windows cygwin</a> – (f.eks. <code>readpst -u -o $OUT_DIR $IN_DIR</code> erstatter <code>$OUT_DIR</code> og <code>$IN_DIR</code> med outputmappen og inputmappen) stier henholdsvis).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst til Ubuntu/Linux</a> – (f.eks. <code>sudo apt-get install readpst</code> og derefter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, hvor <code>$OUT_DIR</code> og <code>$IN_DIR</code> erstattes med henholdsvis outputmappe- og inputmappestierne).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst til macOS (via brew)</a> – (f.eks. <code>brew install libpst</code> og derefter <code>readpst -u -o $OUT_DIR $IN_DIR</code>, hvor <code>$OUT_DIR</code> erstattes og <code>$IN_DIR</code> med henholdsvis outputmappe- og inputmappestierne).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST-konverter til Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanata> |
| Tænke | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#indhold> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Andre | [Use Thunderbird](https://www.thunderbird.net) | Opsæt din eksisterende e-mailkonto i Thunderbird, og brug derefter [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/)-pluginnet til at eksportere og importere dine e-mails. **Du kan muligvis også blot kopiere/indsætte eller trække/slippe e-mails mellem én konto og en anden.** |

2. Download, installer og åbn [Thunderbird](https://www.thunderbird.net).

3. Opret en ny konto ved hjælp af dit alias' fulde e-mailadresse (f.eks. <kode><du@ditdomæne.com></kode>) og din genererede adgangskode. <strong>Hvis du endnu ikke har en genereret adgangskode, kan du <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">se vores opsætningsvejledning</a></strong>.

4. Download og installer [ImportEksportVærktøjer OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-pluginnet.

5. Opret en ny lokal mappe i Thunderbird, og højreklik derefter på den → vælg indstillingen `ImportExportTools NG` → vælg `Import mbox file` (for MBOX-eksportformat) – eller – `Import messages` / `Import all messages from a directory` (for EML-eksportformat).

6. Træk/slip fra den lokale mappe til en ny (eller eksisterende) IMAP-mappe i Thunderbird, som du ønsker at uploade beskeder til i IMAP-lageret med vores tjeneste. Dette sikrer, at de sikkerhedskopieres online med vores SQLite-krypterede lager.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Hvis du er forvirret over, hvordan du importerer til Thunderbird, kan du se de officielle instruktioner på <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> og <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Når du har gennemført eksport- og importprocessen, kan du også aktivere videresendelse på din eksisterende e-mailkonto og oprette en autoresponder for at give afsendere besked om, at du har en ny e-mailadresse (f.eks. hvis du tidligere brugte Gmail og nu bruger en e-mail med dit brugerdefinerede domænenavn).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tillykke!
</strong>
<span>
Du har gennemført alle trin.
</span>
</div>
</div>

### Understøtter du selvhosting? {#do-you-support-self-hosting}

Ja, fra marts 2025 understøtter vi en selvhostet mulighed. Læs bloggen [her](https://forwardemail.net/blog/docs/self-hosted-solution). Tjek [selvvært guide](https://forwardemail.net/self-hosted) for at komme i gang. Og for dem, der er interesserede i en mere opdelt trin-for-trin version, kan du se vores [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserede vejledninger.

## E-mailkonfiguration {#email-configuration}

### Hvordan kommer jeg i gang og konfigurerer videresendelse af e-mails {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Forventet opsætningstid:</strong>
<span>Mindre end 10 minutter</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Kom godt i gang:
</strong>
<span>
Læs og følg trin et til otte nedenfor omhyggeligt. Sørg for at erstatte e-mailadressen <code>bruger@gmail.com</code> med den e-mailadresse, du vil videresende e-mails til (hvis den ikke allerede er korrekt). Sørg ligeledes for at erstatte <code>eksempel.com</code> med dit brugerdefinerede domænenavn (hvis det ikke allerede er korrekt).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Hvis du allerede har registreret dit domænenavn et sted, skal du springe dette trin helt over og gå til trin to! Ellers kan du <a href="/domain-registration" rel="noopener noreferrer">klikke her for at registrere dit domænenavn</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Kan du huske, hvor du registrerede dit domæne? Når du husker dette, skal du følge instruktionerne nedenfor:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Du skal åbne en ny fane og logge ind på din domæneregistrator. Du kan nemt klikke på din "Registrator" nedenfor for at gøre dette automatisk. I denne nye fane skal du navigere til DNS-administrationssiden hos din registrator – og vi har angivet de trinvise navigationstrin nedenfor under kolonnen "Trin til konfiguration". Når du har navigeret til denne side i den nye fane, kan du vende tilbage til denne fane og fortsætte til trin tre nedenfor.
<strong class="font-weight-bold">Luk ikke den åbne fane endnu; du skal bruge den til fremtidige trin!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Registrator</th> <th>Trin til konfiguration</th>
</tr> </thead> <tbody> <tr> <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Domænecenter <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Rediger DNS-indstillinger</td>
</tr> <tr> <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Rute 53</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Hostede zoner <i class="fa fa-angle-right"></i> (Vælg dit domæne)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Mine servere <i class="fa fa-angle-right"></i> Domæneadministration <i class="fa fa-angle-right"></i> DNS-administrator</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>FOR ROCK: Log ind <i class="fa fa-angle-right"></i> Domæner <i class="fa fa-angle-right"></i> (Klik på ikonet ▼ ud for at administrere) <i class="fa fa-angle-right"></i> DNS
<br />
TIL ÆLDRE VERSIGER: Log ind <i class="fa fa-angle-right"></i> Domæner <i class="fa fa-angle-right"></i> Zone-editor <i class="fa fa-angle-right"></i> (Vælg dit domæne)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Gjort nemt</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Vælg dit domæne)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Administrer</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Netværk <i class="fa fa-angle-right"></i> Domæner <i class="fa fa-angle-right"></i> (Vælg (dit domæne) <i class="fa fa-angle-right"></i> Mere <i class="fa fa-angle-right"></i> Administrer domæne</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> I kortvisning skal du klikke på administrer på dit domæne <i class="fa fa-angle-right"></i> I listevisning skal du klikke på
tandhjulsikonet <i class="fa fa-angle-right"></i> DNS og navneservere <i class="fa fa-angle-right"></i> DNS-poster</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Overvågning</a>
</td>
<td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> (klik på tandhjulsikonet) <i class="fa fa-angle-right"></i> Klik på DNS og navneservere i menuen til venstre</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domæner <i class="fa fa-angle-right"></i> Administrer domæner <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Oversigt <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Simpel editor <i class="fa fa-angle-right"></i> Poster</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Administration <i class="fa fa-angle-right"></i> Rediger zonen</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Se</a>
</td>
<td>Log ind <i class="fa fa-angle-right"></i> Administrer mine domæner <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Administrer DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domæner</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Overvågning</a>
</td>
<td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Konfigurer DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Overvågning</a>
</td>
<td>Log ind <i class="fa fa-angle-right"></i> Domæneliste <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Avanceret DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Opsæt Netlify DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Løsninger</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Kontoadministrator <i class="fa fa-angle-right"></i> Mine domænenavne <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> Administrer <i class="fa fa-angle-right"></i> Skift hvor domænet peger <i class="fa fa-angle-right"></i> Avanceret DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Overvåg</a>
</td>
<td>Log ind <i class="fa fa-angle-right"></i> Administrerede domæner <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> DNS Indstillinger</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Hjemmemenu <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Domæner <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i>
Avancerede indstillinger <i class="fa fa-angle-right"></i> Brugerdefinerede poster</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Nu</a></td>
<td>Brug af "now" CLI <i class="fa fa-angle-right"></i> <code>now dns tilføj [domæne] '@' MX [record-value] [prioritet]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Domæneside <i class="fa fa-angle-right"></i> (Vælg dit domæne) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Domæneside <i class="fa fa-angle-right"></i> (Klik på ikonet <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Vælg Administrer DNS-poster</td>
</tr>
<tr> <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Log ind <i class="fa fa-angle-right"></i> Domæner <i class="fa fa-angle-right"></i> Mine domæner</td>
</tr>
<tr> <td>Andet</td> <td> <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Vigtigt:</strong> Kan du ikke se dit registratornavn angivet her? Søg blot på internettet efter "hvordan man ændrer DNS-poster på $REGISTRAR" (erstat $REGISTRAR med navnet på din registrator &ndash; f.eks. "hvordan man ændrer DNS-poster på GoDaddy" (hvis du bruger GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Brug din registrators DNS-administrationsside (den anden fane, du har åbnet), og angiv følgende "MX"-poster:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Bemærk, at der IKKE må være andre MX-poster angivet. Begge poster vist nedenfor SKAL eksistere. Sørg for, at der ikke er nogen stavefejl, og at du har stavet både mx1 og mx2 korrekt. Hvis der allerede var MX-poster, skal du slette dem helt.

"TTL"-værdien behøver ikke at være 3600, den kan være en lavere eller højere værdi, hvis det er nødvendigt.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Prioritet</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td>MX</td> <td>0</td> <td><code>mx1.forwardemail.net</code></td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td>
<td>MX</td> <td>0</td> <td><code>mx2.forwardemail.net</code></td> </tr> </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Brug din registrators DNS-administrationsside (den anden fane, du har åbnet), og angiv følgende <strong class="notranslate">TXT</strong>-post(er):

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du har et betalt abonnement, skal du springe dette trin helt over og gå til trin fem! Hvis du ikke har et betalt abonnement, vil dine videresendte adresser være offentligt søgbare – gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> og opgrader dit domæne til et betalt abonnement, hvis det ønskes. Hvis du vil vide mere om betalte abonnementer, kan du se vores <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Pris</a>-side. Ellers kan du fortsætte med at vælge en eller flere kombinationer fra mulighed A til mulighed F nedenfor. </span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mulighed A:
</strong>
<span>
Hvis du videresender alle e-mails fra dit domæne (f.eks. "all@example.com", "hello@example.com" osv.) til en bestemt adresse "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=bruger@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Sørg for at erstatte værdierne ovenfor i kolonnen "Værdi" med din egen e-mailadresse. "TTL"-værdien behøver ikke at være 3600, den kan være en lavere eller højere værdi, hvis det er nødvendigt. En lavere "time to live" ("TTL")-værdi vil sikre, at fremtidige ændringer, der foretages i dine DNS-poster, spredes hurtigere over hele internettet – tænk på dette som, hvor længe det vil blive cachelagret i hukommelsen (i sekunder). Du kan lære mere om <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL på Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mulighed B:
</strong>
<span>
Hvis du kun skal videresende en enkelt e-mailadresse (f.eks. <code>hello@example.com</code> til <code>user@gmail.com</code>; dette vil også automatisk videresende "hello+test@example.com" til "user+test@gmail.com"):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com</code> </td> </tr> </tbody>
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

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mulighed D:
</strong>
<span>
Du kan have et uendeligt antal videresendelsesmails – sørg bare for ikke at ombryde mere end 255 tegn på en enkelt linje og start hver linje med "forward-email=". Et eksempel er givet nedenfor:
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td>
<td class="notranslate">TXT</td> <td> <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller tom</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code> </td> </tr> <tr> <td><em>"@", ".", eller tom</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mulighed E:
</strong>
<span>
Du kan også angive et domænenavn i din <strong class="notranslate">TXT</strong>-post for at få global alias-videresendelse (f.eks. vil "bruger@eksempel.com" blive videresendt til "bruger@eksempel.net"):
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=example.net</code> </td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mulighed F:
</strong>
<span>
Du kan endda bruge webhooks som et globalt eller individuelt alias at videresende e-mails til. Se eksemplet og det fulde afsnit om webhooks med titlen <a href="#do-you-support-webhooks" class="alert-link">Understøtter I webhooks</a> nedenfor?
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td> </tr> </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mulighed G:
</strong>
<span>
Du kan endda bruge regulære udtryk ("regex") til at matche aliasser og til at håndtere erstatninger, som e-mails skal videresendes til. Se eksemplerne og det fulde afsnit om regex med titlen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Understøtter I regulære udtryk eller regex</a> nedenfor?
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Har du brug for avanceret regex med substitution?</strong> Se eksemplerne og det fulde afsnit om regex med titlen <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Understøtter I regulære udtryk eller regex</a> nedenfor.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Simpelt eksempel:</strong> Hvis jeg vil have alle e-mails, der går til `linus@example.com` eller `torvalds@example.com`, videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td> <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code> </td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Opsamlingsregler for videresendelse kan også beskrives som "gennemløbsregler".
Det betyder, at indgående e-mails, der matcher mindst én specifik videresendelsesregel, vil blive brugt i stedet for opsamlingsreglerne.
Specifikke regler omfatter e-mailadresser og regulære udtryk.
<br /><br />
For eksempel:
<br /> <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-mails sendt til <code>hello@example.com</code> vil **ikke** blive videresendt til <code>second@gmail.com</code> (opsamlingsregler) med denne konfiguration, og i stedet kun blive leveret til <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Brug din registrators DNS-administrationsside (den anden fane, du har åbnet), og angiv desuden følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du bruger Gmail (f.eks. Send mail som) eller G Suite, skal du tilføje <code>include:_spf.google.com</code> til værdien ovenfor, for eksempel:
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
Hvis du allerede har en lignende linje med "v=spf1", skal du tilføje <code>include:spf.forwardemail.net</code> lige før eventuelle eksisterende "include:host.com"-poster og før "-all" i samme linje, for eksempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Bemærk, at der er forskel på "-all" og "~all". "-" angiver, at SPF-tjekket skal FEJLES, hvis det ikke matcher, og "~" angiver, at SPF-tjekket skal SOFTFAILES. Vi anbefaler at bruge "-all"-tilgangen for at forhindre domæneforfalskning.
<br /><br />
Du skal muligvis også inkludere SPF-posten for den vært, du sender mails fra (f.eks. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Bekræft dine DNS-poster ved hjælp af vores værktøj "Bekræft poster", som er tilgængeligt under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Opsætning.

Send en test-e-mail for at bekræfte, at det virker. Bemærk, at det kan tage lidt tid, før dine DNS-poster udbredes.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
</span>
Hvis du ikke modtager test-e-mails, eller modtager en test-e-mail, der siger "Vær forsigtig med denne besked", så se svarene på henholdsvis <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Hvorfor modtager jeg ikke mine test-e-mails</a> og <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Hvorfor vises mine test-e-mails, der sendes til mig selv i Gmail, som "mistænkelige"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Hvis du ønsker at "Send mail som" fra Gmail, skal du <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">se denne video</a></strong> eller følge trinnene under <a href="#how-to-send-mail-as-using-gmail">How for at sende mail som ved hjælp af Gmail</a> nedenfor.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tillykke!
</strong>
<span>
Du har gennemført alle trin.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Valgfrie tilføjelser er anført nedenfor. Bemærk, at disse tilføjelser er helt valgfrie og muligvis ikke nødvendige. Vi ville i det mindste give dig yderligere oplysninger, hvis det er nødvendigt.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Valgfri tilføjelse:
</strong>
<span>
Hvis du bruger funktionen <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How til at sende mails som ved hjælp af Gmail</a>, kan du tilføje dig selv til en tilladelsesliste. Se <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">disse instruktioner fra Gmail</a> om dette emne.
</span>
</div>

### Kan jeg bruge flere MX-udvekslinger og -servere til avanceret videresendelse {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ja, men **du bør kun have én MX-udveksling angivet i dine DNS-poster**.

Forsøg ikke at bruge "Prioritet" som en måde at konfigurere flere MX-udvekslinger på.

I stedet skal du konfigurere din eksisterende MX-udveksling til at videresende mail for alle ikke-matchende aliasser til vores tjenestes udvekslinger (`mx1.forwardemail.net` og/eller `mx2.forwardemail.net`).

Hvis du bruger Google Workspace og vil videresende alle ikke-matchende aliasser til vores tjeneste, kan du se <https://support.google.com/a/answer/6297084>.

Hvis du bruger Microsoft 365 (Outlook), og du vil videresende alle ikke-matchende aliasser til vores tjeneste, skal du se <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> og <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Hvordan opretter jeg en feriesvar (autosvar ved fravær) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser, og opret eller rediger enten det alias, du vil konfigurere en ferie-autoresponder for.

Du har mulighed for at konfigurere en startdato, slutdato, emne og besked og aktivere eller deaktivere den når som helst:

* Emne og besked i almindelig tekst understøttes i øjeblikket (vi bruger `striptags`-pakken internt for at fjerne HTML).

* Emnet er begrænset til 100 tegn.

* Beskeden er begrænset til 1000 tegn.

* Opsætning kræver udgående SMTP-konfiguration (f.eks. skal du konfigurere DKIM-, DMARC- og Return-Path DNS-poster).

* Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration, og følg opsætningsvejledningen.

* Feriesvar kan ikke aktiveres på globale vanity-domænenavne (f.eks. understøttes [engangsadresser](/disposable-addresses) ikke).
* Feriesvar kan ikke aktiveres for aliasser med wildcard/catch-all (`*`) eller regulære udtryk.

I modsætning til mailsystemer som `postfix` (f.eks. der bruger feriefilterudvidelsen `sieve`) – tilføjer Videresend e-mail automatisk din DKIM-signatur, dummy-sikrer forbindelsesproblemer, når du sender feriesvar (f.eks. på grund af almindelige SSL/TLS-forbindelsesproblemer og ældre servere) og understøtter endda Open WKD- og PGP-kryptering til feriesvar.

<!--
* For at forhindre misbrug fratrækkes 1 udgående SMTP-kredit for hver sendt feriesvarbesked.
* Alle betalte konti inkluderer som standard 300 kreditter pr. dag. Hvis du har brug for et større beløb, bedes du kontakte os.
-->

1. Vi sender kun én gang pr. [tilladt på listen](#do-you-have-an-allowlist) afsender hver 4. dag (hvilket svarer til Gmails funktionsmåde).

* Vores Redis-cache bruger et fingeraftryk på `alias_id` og `sender`, hvor `alias_id` er alias MongoDB ID, og `sender` er enten Fra-adressen (hvis den er på tilladelseslisten) eller roddomænet i Fra-adressen (hvis den ikke er på tilladelseslisten). For enkelhedens skyld er udløbet af dette fingeraftryk i cachen sat til 4 dage.

* Vores tilgang med at bruge roddomænet, der er parset i Fra-adressen, for afsendere, der ikke er på tilladelseslisten, forhindrer misbrug fra relativt ukendte afsendere (f.eks. ondsindede aktører) i at oversvømme feriesvarsmeddelelser.

2. Vi sender kun, når MAIL FROM og/eller From ikke er blanke og ikke indeholder (uafhængig af store og små bogstaver) en [postmaster brugernavn](#what-are-postmaster-addresses) (delen før @ i en e-mail).

3. Vi sender ikke, hvis den oprindelige besked havde en af følgende overskrifter (ikke store og små bogstaver):

* Header af `auto-submitted` med en værdi, der ikke er lig med `no`. * Header af `x-auto-response-suppress` med en værdi af `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
* Header af `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (uanset værdi).
* Header af `precedence` med en værdi af `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

4. Vi sender ikke, hvis MAIL FROM- eller Fra-e-mailadressen slutter med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

5. Vi sender ikke, hvis den del af Fra-e-mailadressen med brugernavn var `mdaemon` og den havde en header på `X-MDDSN-Message`, der ikke skelner mellem store og små bogstaver.

6. Vi sender ikke, hvis der var en `content-type` header, der ikke skelner mellem store og små bogstaver, i `multipart/report`.

### Hvordan konfigurerer jeg SPF til videresendelse af e-mail {#how-do-i-set-up-spf-for-forward-email}

Brug din registrators DNS-administrationsside til at indstille følgende <strong class="notranslate">TXT</strong>-post:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du bruger Gmail (f.eks. Send mail som) eller G Suite, skal du tilføje <code>include:_spf.google.com</code> til værdien ovenfor, for eksempel:
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
Hvis du allerede har en lignende linje med "v=spf1", skal du tilføje <code>include:spf.forwardemail.net</code> lige før eventuelle eksisterende "include:host.com"-poster og før "-all" i samme linje, for eksempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Bemærk, at der er forskel på "-all" og "~all". "-" angiver, at SPF-tjekket skal FEJLES, hvis det ikke matcher, og "~" angiver, at SPF-tjekket skal SOFTFAILES. Vi anbefaler at bruge "-all"-tilgangen for at forhindre domæneforfalskning.
<br /><br />
Du skal muligvis også inkludere SPF-posten for den vært, du sender mails fra (f.eks. Outlook).
</span>
</div>

### Hvordan konfigurerer jeg DKIM til videresendelse af e-mail {#how-do-i-set-up-dkim-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsvejledningen.

### Hvordan konfigurerer jeg DMARC til videresendelse af e-mail {#how-do-i-set-up-dmarc-for-forward-email}

Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsvejledningen.

### Hvordan forbinder og konfigurerer jeg mine kontakter {#how-do-i-connect-and-configure-my-contacts}

**For at konfigurere dine kontakter skal du bruge CardDAV-URL'en:** `https://carddav.forwardemail.net` (eller blot `carddav.forwardemail.net` hvis din klient tillader det)**

### Hvordan forbinder og konfigurerer jeg mine kalendere {#how-do-i-connect-and-configure-my-calendars}

**For at konfigurere din kalender skal du bruge CalDAV-URL'en:** `https://caldav.forwardemail.net` (eller blot `caldav.forwardemail.net` hvis din klient tillader det)**

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Videresend e-mail-kalender CalDAV Thunderbird eksempelopsætning" />

### Hvordan tilføjer jeg flere kalendere og administrerer eksisterende kalendere {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Hvis du vil tilføje yderligere kalendere, skal du blot tilføje en ny kalender-URL: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**sørg for at erstatte `calendar-name` med dit ønskede kalendernavn**)

Du kan ændre en kalenders navn og farve efter oprettelsen – brug blot dit foretrukne kalenderprogram (f.eks. Apple Mail eller [Thunderbird](https://thunderbird.net)).

### Hvordan konfigurerer jeg SRS til videresendelse af e-mail {#how-do-i-set-up-srs-for-forward-email}

Vi konfigurerer automatisk [Afsenderomskrivningsordning](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – du behøver ikke at gøre dette selv.

### Hvordan konfigurerer jeg MTA-STS til videresendelse af e-mail {#how-do-i-set-up-mta-sts-for-forward-email}

Se venligst [vores sektion om MTA-STS](#do-you-support-mta-sts) for yderligere information.

### Hvordan tilføjer jeg et profilbillede til min e-mailadresse {#how-do-i-add-a-profile-picture-to-my-email-address}

Hvis du bruger Gmail, skal du følge disse trin nedenfor:

1. Gå til <https://google.com> og log ud af alle e-mailkonti.
2. Klik på "Log ind", og klik på "anden konto" i rullemenuen.
3. Vælg "Brug en anden konto".
4. Vælg "Opret konto".
5. Vælg "Brug min nuværende e-mailadresse i stedet".
6. Indtast din brugerdefinerede domænenavns e-mailadresse.
7. Hent den bekræftelses-e-mail, der er sendt til din e-mailadresse.
8. Indtast bekræftelseskoden fra denne e-mail.
9. Udfyld profiloplysningerne for din nye Google-konto.
10. Accepter alle politikker for beskyttelse af personlige oplysninger og brugsbetingelser.
11. Gå til <https://google.com>, og klik på dit profilikon i øverste højre hjørne, og klik på knappen "ændre".
12. Upload et nyt billede eller en ny avatar til din konto.
13. Ændringer tager cirka 1-2 timer at implementere, men nogle gange kan de være meget hurtige.
14. Send en test-e-mail, og profilbilledet burde vises.

## Avancerede funktioner {#advanced-features}

### Understøtter I nyhedsbreve eller mailinglister til marketingrelaterede e-mails? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ja, du kan læse mere på <https://forwardemail.net/guides/newsletter-with-listmonk>.

Bemærk venligst, at Forward Email har en manuel gennemgangsproces på domænebasis for **godkendelse af nyhedsbreve** for at opretholde IP-omdømme og sikre leveringsevne. Send en e-mail til <support@forwardemail.net> eller åbn en [anmodning om hjælp](https://forwardemail.net/help) til godkendelse. Dette tager typisk mindre end 24 timer, og de fleste anmodninger bliver imødekommet inden for 1-2 timer. I den nærmeste fremtid sigter vi mod at gøre denne proces øjeblikkelig med yderligere spamkontroller og advarsler. Denne proces sikrer, at dine e-mails når indbakken, og at dine beskeder ikke markeres som spam.

### Understøtter I afsendelse af e-mail med API {#do-you-support-sending-email-with-api}

Ja, fra maj 2023 understøtter vi afsendelse af e-mail med API som et tilføjelsesprogram for alle betalende brugere.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Udgående SMTP-begrænsninger</a> – din brug betragtes som anerkendelse og samtykke.
</span>
</div>

Se venligst vores afsnit om [E-mails](/email-api#outbound-emails) i vores API-dokumentation for muligheder, eksempler og mere indsigt.

For at kunne sende udgående e-mails med vores API, skal du bruge din API-token, der er tilgængelig under [Min sikkerhed](/my-account/security).

### Understøtter I modtagelse af e-mail med IMAP {#do-you-support-receiving-email-with-imap}

Ja, fra 16. oktober 2023 understøtter vi modtagelse af e-mail via IMAP som et tilføjelsesprogram for alle betalende brugere. **Læs venligst vores dybdegående artikel** om [hvordan vores krypterede SQLite-postkasselagringsfunktion fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instruktioner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> – din brug betragtes som anerkendelse og samtykke.
</span>
</div>

1. Opret et nyt alias til dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

2. Klik på <strong class="text-success"><i class="fa fa-key"></i>Generer adgangskode</strong> ud for det nyoprettede alias. Kopier den genererede adgangskode, der vises på skærmen, til din udklipsholder, og gem den sikkert.

3. Brug dit foretrukne e-mailprogram til at tilføje eller konfigurere en konto med dit nyoprettede alias (f.eks. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Vi anbefaler at bruge <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et open source og privatlivsfokuseret alternativ</a>.</span>
</div>

4. Når du bliver bedt om at angive IMAP-servernavnet, skal du indtaste `imap.forwardemail.net`

5. Når du bliver bedt om IMAP-serverporten, skal du indtaste `993` (SSL/TLS) – se [alternative IMAP-porte](/faq#what-are-your-imap-server-configuration-settings) om nødvendigt
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Hvis du bruger Thunderbird, skal du sørge for, at "Forbindelsessikkerhed" er indstillet til "SSL/TLS", og at godkendelsesmetoden er indstillet til "Normal adgangskode".</span>
</div>

6. Når du bliver bedt om at indtaste en IMAP-serveradgangskode, skal du indsætte adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> i trin 2 ovenfor.

7. **Gem dine indstillinger** – hvis du har problemer, bedes du <a href="/help">kontakte os</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tillykke!
</strong>
<span>
Du har gennemført alle trin.
</span>
</div>
</div>

</div>

### Understøtter du POP3 {#do-you-support-pop3}

Ja, fra 4. december 2023 understøtter vi [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) som et tilføjelsesprogram for alle betalende brugere. **Læs venligst vores dybdegående artikel** om [hvordan vores krypterede SQLite-postkasselagringsfunktion fungerer](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instruktioner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a> og <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> – din brug betragtes som anerkendelse og samtykke.
</span>
</div>

1. Opret et nyt alias til dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

2. Klik på <strong class="text-success"><i class="fa fa-key"></i>Generer adgangskode</strong> ud for det nyoprettede alias. Kopier den genererede adgangskode, der vises på skærmen, til din udklipsholder, og gem den sikkert.

3. Brug dit foretrukne e-mailprogram til at tilføje eller konfigurere en konto med dit nyoprettede alias (f.eks. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Vi anbefaler at bruge <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et open source og privatlivsfokuseret alternativ</a>.</span>
</div>

4. Når du bliver bedt om at angive POP3-servernavnet, skal du indtaste `pop3.forwardemail.net`

5. Når du bliver bedt om POP3-serverporten, skal du indtaste `995` (SSL/TLS) – se [alternative POP3-porte](/faq#what-are-your-pop3-server-configuration-settings) om nødvendigt
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Hvis du bruger Thunderbird, skal du sørge for, at "Forbindelsessikkerhed" er indstillet til "SSL/TLS", og at godkendelsesmetoden er indstillet til "Normal adgangskode".</span>
</div>

6. Når du bliver bedt om POP3-serveradgangskoden, skal du indsætte adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> i trin 2 ovenfor.

7. **Gem dine indstillinger** – hvis du har problemer, bedes du <a href="/help">kontakte os</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tillykke!
</strong>
<span>
Du har gennemført alle trin.
</span>
</div>
</div>

</div>

### Understøtter I kalendere (CalDAV) {#do-you-support-calendars-caldav}

Ja, fra den 5. februar 2024 har vi tilføjet denne funktion. Vores server er `caldav.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig over port `443` (HTTPS).

| Log ind | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com` | E-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>. |
| Adgangskode | `************************` | Aliasspecifik genereret adgangskode. |

For at bruge kalenderunderstøttelse skal **brugeren** være e-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **adgangskoden** skal være en aliasspecifik genereret adgangskode.

### Understøtter du kontakter (CardDAV) {#do-you-support-contacts-carddav}

Ja, fra den 12. juni 2025 har vi tilføjet denne funktion. Vores server er `carddav.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig over port `443` (HTTPS).

| Log ind | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com` | E-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>. |
| Adgangskode | `************************` | Aliasspecifik genereret adgangskode. |

For at bruge kontaktsupport skal **brugeren** være e-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **adgangskoden** skal være en aliasspecifik genereret adgangskode.

### Understøtter I afsendelse af e-mail med SMTP {#do-you-support-sending-email-with-smtp}

Ja, fra maj 2023 understøtter vi afsendelse af e-mail med SMTP som et tilføjelsesprogram for alle betalende brugere.

<div id="smtp-instruktioner">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Sørg for, at du har læst vores <a href="/terms" class="alert-link" target="_blank">Vilkår</a>, <a href="/privacy" class="alert-link" target="_blank">Privatlivspolitik</a> og <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Udgående SMTP-begrænsninger</a> – din brug betragtes som anerkendelse og samtykke.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du bruger Gmail, kan du læse vores <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">vejledning til Send Mail Som med Gmail</a>. Hvis du er udvikler, kan du læse vores <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentation til e-mail-API'er</a>.
</span>
</div>

1. Gå til <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration og følg opsætningsvejledningen.

2. Opret et nyt alias til dit domæne under <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code><hello@example.com></code>)

3. Klik på <strong class="text-success"><i class="fa fa-key"></i>Generer adgangskode</strong> ud for det nyoprettede alias. Kopier den genererede adgangskode, der vises på skærmen, til din udklipsholder, og gem den sikkert.

4. Brug dit foretrukne e-mailprogram til at tilføje eller konfigurere en konto med dit nyoprettede alias (f.eks. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Vi anbefaler at bruge <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> eller <a href="/blog/open-source" class="alert-link" target="_blank">et open source og privatlivsfokuseret alternativ</a>.</span>
</div>

5. Når du bliver bedt om SMTP-servernavnet, skal du indtaste `smtp.forwardemail.net`

6. Når du bliver bedt om SMTP-serverporten, skal du indtaste `465` (SSL/TLS) – se [alternative SMTP-porte](/faq#what-are-your-smtp-server-configuration-settings) om nødvendigt
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Hvis du bruger Thunderbird, skal du sørge for, at "Forbindelsessikkerhed" er indstillet til "SSL/TLS", og at godkendelsesmetoden er indstillet til "Normal adgangskode".</span>
</div>

7. Når du bliver bedt om at indtaste en SMTP-serveradgangskode, skal du indsætte adgangskoden fra <strong class="text-success"><i class="fa fa-key"></i> Generer adgangskode</strong> i trin 3 ovenfor.

8. **Gem dine indstillinger og send din første test-e-mail** – hvis du har problemer, bedes du <a href="/help">kontakte os</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Bemærk venligst, at vi for at opretholde IP-omdømme og sikre levering har en manuel gennemgangsproces på domænebasis for udgående SMTP-godkendelse. Dette tager typisk mindre end 24 timer, og de fleste anmodninger bliver imødekommet inden for 1-2 timer. I den nærmeste fremtid sigter vi mod at gøre denne proces øjeblikkelig med yderligere spamkontroller og advarsler. Denne proces sikrer, at dine e-mails når indbakken, og at dine beskeder ikke markeres som spam.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tillykke!
</strong>
<span>
Du har gennemført alle trin.
</span>
</div>
</div>

</div>

### Understøtter du OpenPGP/MIME, end-to-end-kryptering ("E2EE") og Web Key Directory ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ja, vi understøtter [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end-kryptering ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) og registrering af offentlige nøgler ved hjælp af [Webnøglekatalog ("WKD")](https://wiki.gnupg.org/WKD). Du kan konfigurere OpenPGP ved hjælp af [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) eller [selvhost dine egne nøgler](https://wiki.gnupg.org/WKDHosting) (se [denne vejledning til WKD-serveropsætning](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-opslag caches i 1 time for at sikre rettidig e-maillevering → derfor, hvis du tilføjer, ændrer eller fjerner din WKD-nøgle, bedes du sende os en e-mail på `support@forwardemail.net` med din e-mailadresse, så vi manuelt kan tømme cachen.

* Vi understøtter PGP-kryptering for meddelelser, der videresendes via WKD-opslag eller ved hjælp af en uploadet PGP-nøgle på vores brugerflade.

* Uploadede nøgler har forrang, så længe PGP-afkrypteringsfeltet er aktiveret/markeret.

* Beskeder sendt til webhooks er i øjeblikket ikke krypteret med PGP.

* Hvis du har flere aliasser, der matcher en given videresendelsesadresse (f.eks. regex/wildcard/exact combo), og hvis mere end et af disse indeholder en uploadet PGP-nøgle og har PGP markeret →, sender vi dig en fejlalarm-e-mail og krypterer ikke meddelelsen med din uploadede PGP-nøgle. Dette er meget sjældent og gælder normalt kun for avancerede brugere med komplekse aliasregler.
* **PGP-kryptering vil ikke blive anvendt til videresendelse af e-mails via vores MX-servere, hvis afsenderen havde en DMARC-politik om afvisning. Hvis du har brug for PGP-kryptering på *al* mail, foreslår vi, at du bruger vores IMAP-tjeneste og konfigurerer din PGP-nøgle til dit alias for indgående mail.**

**Du kan validere din opsætning af webnøglekataloget på <https://wkd.chimbosonic.com/> (open source) eller <https://www.webkeydirectory.com/> (proprietært).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatisk kryptering:
</strong>
<span>Hvis du bruger vores <a href="#do-you-support-sending-email-with-smtp" class="alert-link">udgående SMTP-tjeneste</a> og sender ukrypterede beskeder, vil vi automatisk forsøge at kryptere beskeder pr. modtager ved hjælp af <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Du skal følge alle følgende trin for at aktivere OpenPGP for dit brugerdefinerede domænenavn.
</span>
</div>

1. Download og installer din e-mailklients anbefalede plugin nedenfor:

| E-mail-klient | Platform | Anbefalet plugin | Noter |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Desktop | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird har indbygget understøttelse af OpenPGP. |
| Gmail | Browser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens) | Gmail understøtter ikke OpenPGP, men du kan downloade open source-pluginnet [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail understøtter ikke OpenPGP, men du kan downloade open source-pluginnet [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietær licens) | Apple Mail understøtter ikke OpenPGP, men du kan downloade open source-pluginnet [PGPro](https://github.com/opensourceios/PGPro/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Outlook | Windows | [gpg4win](https://www.gpg4win.de/index.html) | Outlooks desktop-mailklient understøtter ikke OpenPGP, men du kan downloade open source-plugin'et [gpg4win](https://www.gpg4win.de/index.html). |
| Outlook | Browser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens) | Outlooks webbaserede mailklient understøtter ikke OpenPGP, men du kan downloade open source-plugin'et [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Android | Mobil | [OpenKeychain](https://www.openkeychain.org/) eller [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) såsom [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) og [FairEmail](https://github.com/M66B/FairEmail) understøtter begge open source-pluginnet [OpenKeychain](https://www.openkeychain.org/). Du kan alternativt bruge open source-pluginnet (med proprietær licens) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Browser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens) | Du kan downloade open source-browserudvidelsen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Browser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens) | Du kan downloade open source-browserudvidelsen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Browser | [Mailvelope](https://mailvelope.com/) | Du kan downloade open source-browserudvidelsen [Mailvelope](https://mailvelope.com/). |
| Modig | Browser | [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download) (proprietær licens) | Du kan downloade open source-browserudvidelsen [Mailvelope](https://mailvelope.com/) eller [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Desktop | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa har indbygget understøttelse af OpenPGP. |
| KMail | Desktop | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail har indbygget understøttelse af OpenPGP. |
| GNOME Evolution | Desktop | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution har indbygget understøttelse af OpenPGP. |
| Terminal | Desktop | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Du kan bruge open source-filen [gpg command line tool](https://www.gnupg.org/download/) til at generere en ny nøgle fra kommandolinjen. |

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
Valgfri tilføjelse:
</strong>
<span>
Hvis du bruger vores <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">krypterede lagringstjenester (IMAP/POP3)</a> og ønsker, at <i>alle</i> e-mails, der er gemt i din (allerede krypterede) SQLite-database, skal krypteres med din offentlige nøgle, skal du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser (f.eks. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Rediger <i class="fa fa-angle-right"></i> OpenPGP og upload din offentlige nøgle.
</span>
</div>

4. Tilføj en ny `CNAME`-post til dit domænenavn (f.eks. `example.com`):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><code>openpgpkey</code></td> <td class="text-center">3600</td> <td class="notranslate">CNAME</td> <td><code>wkd.keys.openpgp.org</code></td> </tr> </tbody> </table>

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
Du har gennemført alle trin.
</span>
</div>
</div>

### Støtter du MTA-STS {#do-you-support-mta-sts}

Ja, fra 2. marts 2023 understøtter vi [MTA-STS](https://www.hardenize.com/blog/mta-sts). Du kan bruge [denne skabelon](https://github.com/jpawlowski/mta-sts.template), hvis du ønsker at aktivere det på dit domæne.

Vores konfiguration kan findes offentligt på GitHub på <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Understøtter I adgangsnøgler og WebAuthn {#do-you-support-passkeys-and-webauthn}

Ja! Fra den 13. december 2023 har vi tilføjet understøttelse af adgangsnøgler [på grund af stor efterspørgsel](https://github.com/orgs/forwardemail/discussions/182).

Adgangsnøgler giver dig mulighed for sikkert at logge ind uden at kræve en adgangskode og tofaktorgodkendelse.

Du kan bekræfte din identitet med berøring, ansigtsgenkendelse, enhedsbaseret adgangskode eller pinkode.

Vi giver dig mulighed for at administrere op til 30 adgangskoder på én gang, så du nemt kan logge ind med alle dine enheder.

Få mere at vide om adgangsnøgler på følgende links:

* [Log ind på dine applikationer og websteder med adgangsnøgler](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Brug adgangsnøgler til at logge ind på apps og websteder på iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikel om adgangsnøgler](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Støtter I bedste praksis for e-mail? {#do-you-support-email-best-practices}

Ja. Vi har indbygget understøttelse af SPF, DKIM, DMARC, ARC og SRS på tværs af alle abonnementer. Vi har også arbejdet grundigt sammen med de oprindelige forfattere af disse specifikationer og andre e-mail-eksperter for at sikre perfektion og høj leveringsevne.

### Understøtter I bounce webhooks {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Leder du efter dokumentation om e-mail-webhooks? Se <a href="/faq#do-you-support-webhooks" class="alert-link">Understøtter I webhooks?</a> for mere indsigt.
<span>
</span>
</div>

Ja, fra den 14. august 2024 har vi tilføjet denne funktion. Du kan nu gå til Min konto → Domæner → Indstillinger → Bounce Webhook URL og konfigurere en `http://` eller `https://` URL, som vi sender en `POST` anmodning til, når udgående SMTP-e-mails afvises.

Dette er nyttigt for dig til at administrere og overvåge din udgående SMTP – og kan bruges til at vedligeholde abonnenter, framelde sig og registrere, når der opstår afvisninger.

Bounce webhook-nyttelaster sendes som en JSON med disse egenskaber:

* `email_id` (Streng) - e-mail-ID, der svarer til en e-mail i Min konto → E-mails (udgående SMTP)
* `list_id` (Streng) - `List-ID` headerværdien (uafhængig af store og små bogstaver), hvis nogen, fra den oprindelige udgående e-mail
* `list_unsubscribe` (Streng) - `List-Unsubscribe` headerværdien (uafhængig af store og små bogstaver), hvis nogen, fra den oprindelige udgående e-mail
* `feedback_id` (Streng) - `Feedback-ID` headerværdien (uafhængig af store og små bogstaver), hvis nogen, fra den oprindelige udgående e-mail
* `recipient` (Streng) - e-mailadressen på den modtager, der blev afvist eller fik en fejl
* `message` (Streng) - en detaljeret fejlmeddelelse for afvisningen
* `response` (Streng) - SMTP-svarmeddelelsen
* `response_code` (Tal) - den parsede SMTP-svarkode
* `truth_source` (Streng) - hvis svarkoden var fra en betroet kilde, vil denne værdi blive udfyldt med roddomænenavnet (f.eks. `google.com` eller `yahoo.com`)
* `bounce` (Objekt) - et objekt, der indeholder følgende egenskaber, der beskriver afvisnings- og afvisningsstatus
* `action` (Streng) - afvisningshandling (f.eks. `"reject"`)
* `message` (Streng) - årsag til afvisning (f.eks. `"Message Sender Blocked By Receiving Server"`)
* `category` (Streng) - afvisningskategori (f.eks. `"block"`)
* `code` (Tal) - afvisningsstatuskode (f.eks. `554`)
* `status` (Streng) - afvisningskode fra svarbesked (f.eks. `5.7.1`)
* `line` (Tal) - analyseret linjenummer, hvis relevant, [fra Zone-MTA afvisningsanalyseliste](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (f.eks. `526`)
* `headers` (Objekt) - nøgleværdipar af headere for den udgående e-mail
* `bounced_at` (Streng) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formateret dato for, hvornår afvisningsfejlen opstod

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

Her er et par yderligere bemærkninger vedrørende bounce webhooks:

* Hvis webhook-nyttelasten indeholder en `list_id`, `list_unsubscribe` eller `feedback_id` værdi, skal du om nødvendigt træffe passende foranstaltninger for at fjerne `recipient` fra listen.

* Hvis `bounce.category` værdien var én af følgende: `"block"`, `"recipient"`, `"spam"` eller `"virus"`, skal du helt sikkert fjerne brugeren fra listen.

* Hvis du har brug for at verificere webhook-nyttelast (for at sikre, at de rent faktisk kommer fra vores server), kan du [finde den eksterne klients IP-adresse, klientens værtsnavn, ved hjælp af et omvendt opslag](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal være `smtp.forwardemail.net`.
* Du kan også tjekke IP-adressen mod [vores offentliggjorte IP-adresser](#what-are-your-servers-ip-addresses).
* Gå til Min konto → Domæner → Indstillinger → Webhook Signature Payload Verification Key for at få din webhook-nøgle.
* Du kan rotere denne nøgle når som helst af sikkerhedsmæssige årsager.
* Beregn og sammenlign `X-Webhook-Signature`-værdien fra vores webhook-anmodning med den beregnede body-værdi ved hjælp af denne nøgle. Et eksempel på, hvordan du gør dette, er tilgængeligt på [dette Stack Overflow-indlæg](https://stackoverflow.com/a/68885281).
* Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mere indsigt.
* Vi venter i op til `5` sekunder på, at dit webhook-slutpunkt svarer med statuskoden `200`, og vi prøver igen i op til `1` sekunder.
* Hvis vi registrerer, at din afviste webhook-URL indeholder en fejl, mens vi forsøger at sende en anmodning til den, sender vi dig en høflighedsmail én gang om ugen.

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

Ja, fra den 15. maj 2020 har vi tilføjet denne funktion. Du kan blot tilføje webhook(s) præcis som du ville gøre med enhver anden modtager! Sørg for, at du har protokollen "http" eller "https" præfikset i webhookens URL.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Forbedret privatlivsbeskyttelse:
</strong>
<span>
Hvis du har et betalt abonnement (som inkluderer forbedret privatlivsbeskyttelse), skal du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> og klikke på "Aliasser" ud for dit domæne for at konfigurere dine webhooks. Hvis du vil vide mere om betalte abonnementer, kan du se vores <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Pris</a>-side. Ellers kan du fortsætte med at følge instruktionerne nedenfor.
</span>
</div>

Hvis du har gratisabonnementet, skal du blot tilføje en ny DNS-<strong class="notranslate">TXT</strong>-post som vist nedenfor:

For eksempel, hvis jeg vil have, at alle e-mails, der går til `alias@example.com`, videresendes til et nyt [anmodningsbakke](https://requestbin.com/r/en8pfhdgcculn?inspect) test-slutpunkt:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

Eller måske ønsker du, at alle e-mails, der går til `example.com`, skal videresendes til dette slutpunkt:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr> </tbody>
</table>

**Her er yderligere bemærkninger vedrørende webhooks:**

* Hvis du har brug for at verificere webhook-nyttelast (for at sikre, at de rent faktisk kommer fra vores server), kan du [finde den eksterne klients IP-adresse, klientens værtsnavn, ved hjælp af et omvendt opslag](https://nodejs.org/api/dns.html#dnspromisesreverseip) – det skal enten være `mx1.forwardemail.net` eller `mx2.forwardemail.net`.
* Du kan også tjekke IP-adressen mod [vores offentliggjorte IP-adresser](#what-are-your-servers-ip-addresses).
* Hvis du har et betalt abonnement, skal du gå til Min konto → Domæner → Indstillinger → Webhook Signature Payload Verification Key for at få din webhook-nøgle.
* Du kan rotere denne nøgle når som helst af sikkerhedsmæssige årsager.
* Beregn og sammenlign `X-Webhook-Signature`-værdien fra vores webhook-anmodning med den beregnede body-værdi ved hjælp af denne nøgle. Et eksempel på, hvordan du gør dette, er tilgængeligt på [dette Stack Overflow-indlæg](https://stackoverflow.com/a/68885281).
* Se diskussionen på <https://github.com/forwardemail/free-email-forwarding/issues/235> for mere indsigt.
* Hvis en webhook ikke svarer med statuskoden `200`, gemmer vi dens svar i [fejllog oprettet](#do-you-store-error-logs) – hvilket er nyttigt til fejlfinding.
* Webhook HTTP-anmodninger vil forsøge igen op til 3 gange for hvert SMTP-forbindelsesforsøg, med en maksimal timeout på 60 sekunder pr. endpoint POST-anmodning. **Bemærk, at dette ikke betyder, at den kun forsøger igen 3 gange**, den vil faktisk forsøge igen kontinuerligt over tid ved at sende en SMTP-kode på 421 (som indikerer til afsenderen, at den forsøger igen senere) efter det 3. mislykkede HTTP POST-anmodningsforsøg. Det betyder, at e-mailen vil forsøge igen kontinuerligt i dagevis, indtil en statuskode på 200 opnås.
* Vi forsøger igen automatisk baseret på standardstatus- og fejlkoderne, der bruges i [superagentens gentagelsesmetode](https://ladjs.github.io/superagent/#retrying-requests) (vi er vedligeholdere).
* Vi grupperer webhook HTTP-anmodninger til det samme endpoint i én anmodning i stedet for flere) for at spare ressourcer og fremskynde svartid. Hvis du for eksempel sender en e-mail til <webhook1@example.com>, <webhook2@example.com> og <webhook3@example.com>, og alle disse er konfigureret til at ramme den samme *nøjagtige* slutpunkts-URL, vil der kun blive foretaget én anmodning. Vi grupperer efter nøjagtig slutpunktsmatchning med streng lighed.
* Bemærk, at vi bruger [mailparser](https://nodemailer.com/extras/mailparser/)-bibliotekets "simpleParser"-metode til at parse beskeden til et JSON-venligt objekt.
* Rå e-mailværdi som en streng angives som egenskaben "raw".
* Godkendelsesresultater angives som egenskaberne "dkim", "spf", "arc", "dmarc" og "bimi".
* De parsede e-mail-headere angives som egenskaben "headers" – men bemærk også, at du kan bruge "headerLines" for nemmere iteration og parsing.
* De grupperede modtagere for denne webhook grupperes sammen og angives som egenskaben "recipients".
* SMTP-sessionsoplysningerne angives som egenskaben "session". Denne indeholder oplysninger om afsenderen af beskeden, beskedens ankomsttidspunkt, HELO og klientens værtsnavn. Klientens værtsnavnsværdi som `session.clientHostname` er enten FQDN (fra et omvendt PTR-opslag) eller `session.remoteAddress` omkranset af parenteser (f.eks. `"[127.0.0.1]"`).

* Hvis du har brug for en hurtig måde at få værdien af `X-Original-To`, kan du bruge værdien af `session.recipient` (se eksemplet nedenfor). Headeren `X-Original-To` er en header, vi tilføjer til beskeder for at debugge med den oprindelige modtager (før maskeret videresendelse) for beskeden.

* Hvis du har brug for at fjerne egenskaberne `attachments` og/eller `raw` fra payload-delen, skal du blot tilføje `?attachments=false`, `?raw=false` eller `?attachments=false&raw=false` til dit webhook-slutpunkt som en forespørgselsstrengparameter (f.eks. `https://example.com/webhook?attachments=false&raw=false`).
* Hvis der er vedhæftede filer, vil de blive tilføjet til `attachments`-arrayet med bufferværdier. Du kan parse dem tilbage til indhold ved hjælp af en tilgang med JavaScript, f.eks.:

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
Nysgerrig efter, hvordan webhook-anmodningen ser ud fra videresendte e-mails? Vi har inkluderet et eksempel nedenfor til dig!
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

### Understøtter du regulære udtryk eller regex {#do-you-support-regular-expressions-or-regex}

Ja, fra den 27. september 2021 har vi tilføjet denne funktion. Du kan blot skrive regulære udtryk ("regex") til at matche aliasser og udføre substitutioner.

Aliaser, der understøttes af regulære udtryk, er dem, der starter med `/` og slutter med `/`, og deres modtagere er e-mailadresser eller webhooks. Modtagerne kan også inkludere understøttelse af regex-substitution (f.eks. `$1`, `$2`).

Vi understøtter to regulære udtryksflag, herunder `i` og `g`. Det store- og småbogstavsflag `i` er en permanent standard og håndhæves altid. Det globale flag `g` kan tilføjes af dig ved at tilføje `/` til slutningen `/g`.

Bemærk, at vi også understøtter vores <a href="#can-i-disable-specific-aliases">disabled aliasfunktion</a> for modtagerdelen med vores regex-understøttelse.

Regulære udtryk understøttes ikke på <a href="/disposable-addresses" target="_blank">globale vanity-domæner</a> (da dette kan være en sikkerhedssårbarhed).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Forbedret privatlivsbeskyttelse:
</strong>
<span>
Hvis du har et betalt abonnement (som har forbedret privatlivsbeskyttelse), skal du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> og klikke på "Aliasser" ud for dit domæne for at konfigurere regulære udtryk. Hvis du vil vide mere om betalte abonnementer, kan du se vores <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Pris</a>-side. Ellers kan du fortsætte med at følge instruktionerne nedenfor.
</span>
</div>

Hvis du har gratisabonnementet, skal du blot tilføje en ny DNS-<strong class="notranslate">TXT</strong>-post ved hjælp af et eller flere af de angivne eksempler nedenfor:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Simpelt eksempel:</strong> Hvis jeg vil have alle e-mails, der går til `linus@example.com` eller `torvalds@example.com`, videresendes til `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på erstatning af fornavn og efternavn:</strong> Forestil dig, at alle dine firmas e-mailadresser er af mønsteret `firstname.lastname@example.com`. Hvis jeg vil have, at alle e-mails, der går til mønsteret `firstname.lastname@example.com`, videresendes til `firstname.lastname@company.com` med understøttelse af erstatning (<a href="https://regexr.com/66hnu" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på substitution med plussymbolfiltrering:</strong> Hvis jeg ønsker, at alle e-mails, der går til `info@example.com` eller `support@example.com`, skal videresendes til henholdsvis `user+info@gmail.com` eller `user+support@gmail.com` (med understøttelse af substitution) (<a href="https://regexr.com/66ho7" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på webhook-forespørgselsstrengsubstitution:</strong> Måske ønsker du, at alle e-mails, der går til `example.com`, skal gå til en <a href="#do-you-support-webhooks" class="alert-link">webhook</a> og have en dynamisk forespørgselsstrengnøgle på "til" med en værdi af brugernavnsdelen af e-mailadressen (<a href="https://regexr.com/66ho4" class="alert-link">se test på RegExr</a>):
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på lydløs afvisning:</strong> Hvis du ønsker, at alle e-mails, der matcher et bestemt mønster, skal deaktiveres og lydløst afvises (vises for afsenderen, som om beskeden blev sendt, men faktisk ikke fører nogen vegne) med statuskoden `250` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere specifikke aliasser</a>), skal du blot bruge den samme fremgangsmåde med et enkelt udråbstegn "!". Dette indikerer for afsenderen, at beskeden blev leveret, men faktisk ikke førte nogen vegne (f.eks. sort hul eller `/dev/null`).
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på blød afvisning:</strong> Hvis du ønsker, at alle e-mails, der matcher et bestemt mønster, skal deaktiveres og afvises blødt med statuskoden `421` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere specifikke aliasser</a>), skal du blot bruge den samme fremgangsmåde med et dobbelt udråbstegn "!!". Dette indikerer, at afsenderen skal prøve at sende sin e-mail igen, og e-mails til dette alias vil blive forsøgt igen i cirka 5 dage og derefter afvist permanent.
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Eksempel på fuldstændig afvisning:</strong> Hvis du ønsker, at alle e-mails, der matcher et bestemt mønster, skal deaktiveres og fuldstændig afvises med statuskoden `550` (se <a href="#can-i-disable-specific-aliases" class="alert-link">Kan jeg deaktivere specifikke aliasser</a>), skal du blot bruge den samme fremgangsmåde med et tredobbelt udråbstegn "!!!". Dette indikerer en permanent fejl for afsenderen, og e-mails vil ikke blive forsøgt igen, de vil blive afvist for dette alias.

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Nysgerrig efter, hvordan man skriver et regulært udtryk, eller har du brug for at teste din erstatning? Du kan gå til den gratis hjemmeside til test af regulære udtryk <a href="https://regexr.com" class="alert-link">RegExr</a> på <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Hvad er dine udgående SMTP-grænser {#what-are-your-outbound-smtp-limits}

Vi begrænser brugere og domæner til 300 udgående SMTP-beskeder pr. dag. Dette giver i gennemsnit 9000+ e-mails i en kalendermåned. Hvis du har brug for at overskride dette antal eller har konstant store e-mails, bedes du [kontakt os](https://forwardemail.net/help).

### Skal jeg have godkendelse for at aktivere SMTP {#do-i-need-approval-to-enable-smtp}

Ja, bemærk venligst, at Forward Email har en manuel gennemgangsproces på domænebasis for udgående SMTP-godkendelse for at opretholde IP-omdømme og sikre leveringsevne. Send en e-mail til <support@forwardemail.net> eller åbn en [anmodning om hjælp](https://forwardemail.net/help) til godkendelse. Dette tager typisk mindre end 24 timer, og de fleste anmodninger bliver imødekommet inden for 1-2 timer. I den nærmeste fremtid sigter vi mod at gøre denne proces øjeblikkelig med yderligere spamkontroller og advarsler. Denne proces sikrer, at dine e-mails når indbakken, og at dine beskeder ikke markeres som spam.

### Hvad er dine SMTP-serverkonfigurationsindstillinger {#what-are-your-smtp-server-configuration-settings}

Vores server er `smtp.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig over portene `465` og `2465` for SSL/TLS og `587`, `2587`, `2525` og `25` for TLS (STARTTLS).

| Protokol | Værtsnavn | Havne | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `smtp.forwardemail.net` | `465`, `2465` | :hvidt_flueben: | :hvidt_flueben: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :hvidt_flueben: | :hvidt_flueben: |

| Log ind | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com` | E-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>. |
| Adgangskode | `************************` | Aliasspecifik genereret adgangskode. |

For at kunne sende udgående e-mails med SMTP skal **SMTP-brugeren** være e-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **SMTP-adgangskoden** skal være en aliasspecifik genereret adgangskode.

Se venligst [Understøtter I afsendelse af e-mail med SMTP](#do-you-support-sending-email-with-smtp) for trinvise instruktioner.

### Hvad er dine IMAP-serverkonfigurationsindstillinger {#what-are-your-imap-server-configuration-settings}

Vores server er `imap.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig via portene `993` og `2993` for SSL/TLS.

| Protokol | Værtsnavn | Havne | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `imap.forwardemail.net` | `993`, `2993` | :hvidt_flueben: | :hvidt_flueben: |

| Log ind | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com` | E-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>. |
| Adgangskode | `************************` | Aliasspecifik genereret adgangskode. |

For at oprette forbindelse med IMAP skal **IMAP-brugeren** være e-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **IMAP-adgangskoden** skal være en aliasspecifik genereret adgangskode.

Se venligst [Understøtter I modtagelse af e-mails med IMAP](#do-you-support-receiving-email-with-imap) for trinvise instruktioner.

### Hvad er dine POP3-serverkonfigurationsindstillinger {#what-are-your-pop3-server-configuration-settings}

Vores server er `pop3.forwardemail.net` og overvåges også på vores <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statusside</a>.

Den understøtter både IPv4 og IPv6 og er tilgængelig via portene `995` og `2995` for SSL/TLS.

| Protokol | Værtsnavn | Havne | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Foretrukket** | `pop3.forwardemail.net` | `995`, `2995` | :hvidt_flueben: | :hvidt_flueben: |

| Log ind | Eksempel | Beskrivelse |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brugernavn | `user@example.com` | E-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a>. |
| Adgangskode | `************************` | Aliasspecifik genereret adgangskode. |

For at oprette forbindelse til POP3 skal **POP3-brugeren** være e-mailadressen på et alias, der findes for domænet på <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Min Konto <i class="fa fa-angle-right"></i> Domæner</a> – og **IMAP-adgangskoden** skal være en aliasspecifik genereret adgangskode.

Se venligst [Understøtter du POP3](#do-you-support-pop3) for trinvise instruktioner.

### Postfix SMTP Relay-konfiguration {#postfix-smtp-relay-configuration}

Du kan konfigurere Postfix til at videresende e-mails via Forward Emails SMTP-servere. Dette er nyttigt for serverapplikationer, der skal sende e-mails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Forventet opsætningstid:</strong>
<span>Mindre end 15 minutter</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Dette kræver en betalt plan med aktiveret SMTP-adgang.
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

2. Vælg "Internetside" under installationen, når du bliver bedt om at angive konfigurationstype.

#### Konfiguration {#configuration}

1. Rediger den primære Postfix-konfigurationsfil:

```bash
sudo nano /etc/postfix/main.cf
```

2. Tilføj eller rediger disse indstillinger:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Opret SASL-adgangskodefilen:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Tilføj dine loginoplysninger til videresendelse af e-mail:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Sikre og hash-kodekodefilen:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Genstart Postfix:

```bash
sudo systemctl restart postfix
```

#### Testning af {#testing}

Test din konfiguration ved at sende en test-e-mail:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Sikkerhed {#security}

### Avancerede serverhærdningsteknikker {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Videresend e-mail implementerer adskillige serverhærdningsteknikker for at sikre sikkerheden af vores infrastruktur og dine data:

1. **Netværkssikkerhed**:
* IP-tabeller, firewall med strenge regler
* Fail2ban for brute force-beskyttelse
* Regelmæssige sikkerhedsrevisioner og penetrationstest
* Kun VPN-administratoradgang

2. **Systemhærdning**:**:** Minimal pakkeinstallation
* Regelmæssige sikkerhedsopdateringer
* SELinux i håndhævelsestilstand
* Deaktiveret root SSH-adgang
* Kun nøglebaseret godkendelse

3. **Applikationssikkerhed**:
* CSP-headere (Content Security Policy)
* HTTPS Strict Transport Security (HSTS)
* XSS-beskyttelsesheadere
* Frame-indstillinger og referrer-policy-headere
* Regelmæssige afhængighedsrevisioner

4. **Databeskyttelse**:** Fuld diskkryptering med LUKS
* Sikker nøglehåndtering
* Regelmæssige sikkerhedskopier med kryptering
* Dataminimeringspraksis

5. **Overvågning og respons**:
* Indtrængningsdetektion i realtid
* Automatiseret sikkerhedsscanning
* Centraliseret logføring og analyse
* Procedurer for håndtering af hændelser

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Har du SOC 2- eller ISO 27001-certificeringer? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Videresendt e-mail har ikke direkte SOC 2 Type II- eller ISO 27001-certificeringer. Tjenesten fungerer dog på infrastruktur leveret af certificerede underdatabehandlere:

* **DigitalOcean**: SOC 2 Type II og SOC 3 Type II certificeret (revideret af Schellman & Company LLC), ISO 27001 certificeret i flere datacentre. Detaljer: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) certificeret, ISO/IEC-certificeringer: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detaljer: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2-kompatibel (kontakt DataPacket direkte for at få certificering), infrastrukturudbyder i virksomhedsklasse (Denver-lokation). Detaljer: <https://www.datapacket.com/datacenters/denver>

Videresend e-mail følger branchens bedste praksis for sikkerhedsrevisioner og samarbejder regelmæssigt med uafhængige sikkerhedsforskere. Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Bruger du TLS-kryptering til videresendelse af e-mails? {#do-you-use-tls-encryption-for-email-forwarding}

Ja. Videresend e-mail håndhæver strengt TLS 1.2+ for alle forbindelser (HTTPS, SMTP, IMAP, POP3) og implementerer MTA-STS for forbedret TLS-understøttelse. Implementeringen inkluderer:

* TLS 1.2+ håndhævelse for alle e-mailforbindelser
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) nøgleudveksling for perfekt fremadrettet hemmeligholdelse
* Moderne krypteringspakker med regelmæssige sikkerhedsopdateringer
* HTTP/2-understøttelse for forbedret ydeevne og sikkerhed
* HSTS (HTTP Strict Transport Security) med forudindlæsning i større browsere
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** for streng TLS-håndhævelse

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-implementering**: Videresendt e-mail implementerer streng MTA-STS-håndhævelse i kodebasen. Når der opstår TLS-fejl, og MTA-STS håndhæves, returnerer systemet 421 SMTP-statuskoder for at sikre, at e-mails forsøges igen senere i stedet for at blive leveret usikkert. Implementeringsdetaljer:

* TLS-fejldetektion: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-håndhævelse i send-e-mail-hjælper: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Tredjepartsvalidering: <https://www.hardenize.com/report/forwardemail.net/1750312779> viser "God" vurderinger for alle TLS- og transportsikkerhedsforanstaltninger.

### Bevarer du e-mail-godkendelsesheadere {#do-you-preserve-email-authentication-headers}

Ja. Videresend e-mail implementerer og bevarer omfattende e-mail-godkendelsesheadere:

* **SPF (Sender Policy Framework)**: Korrekt implementeret og bevaret
* **DKIM (DomainKeys Identified Mail)**: Fuld understøttelse med korrekt nøglehåndtering
* **DMARC**: Politikhåndhævelse for e-mails, der ikke opfylder SPF- eller DKIM-valideringen
* **ARC**: Selvom det ikke er eksplicit beskrevet, tyder tjenestens perfekte compliance-scorer på omfattende håndtering af godkendelsesheadere

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validering: Internet.nl Mail Test viser en score på 100/100 specifikt for implementeringen af "SPF, DKIM og DMARC". Hardenize-vurderingen bekræfter "God" vurdering for SPF og DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bevarer I de originale e-mail-overskrifter og forhindrer I spoofing? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Videresend e-mail bevarer originale e-mail-overskrifter, samtidig med at den implementerer omfattende anti-spoofing-beskyttelse gennem MX-kodebasen:

* **Bevarelse af header**: Originale godkendelsesheadere bevares under videresendelse.** **Anti-spoofing**: Håndhævelse af DMARC-politik forhindrer header-spoofing ved at afvise e-mails, der ikke består SPF- eller DKIM-validering.** **Forebyggelse af header-injektion**: Inputvalidering og -rensning ved hjælp af striptags-bibliotek.** **Avanceret beskyttelse**: Sofistikeret phishing-detektion med spoofing-detektion, personefterligningsforebyggelse og brugermeddelelsessystemer.

**MX-implementeringsdetaljer**: Den centrale e-mailbehandlingslogik håndteres af MX-serverens kodebase, nærmere bestemt:

* Primær MX-databehandler: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Vilkårlig e-mailfiltrering (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Hjælperen `isArbitrary` implementerer sofistikerede anti-spoofing-regler, herunder detektion af domæneefterligning, blokerede sætninger og forskellige phishing-mønstre.

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Hvordan beskytter du dig mod spam og misbrug {#how-do-you-protect-against-spam-and-abuse}

Videresend e-mail implementerer omfattende flerlagsbeskyttelse:

* **Hastighedsbegrænsning**: Anvendes til godkendelsesforsøg, API-slutpunkter og SMTP-forbindelser
* **Ressourceisolering**: Mellem brugere for at forhindre påvirkning fra brugere med stor volumen
* **DDoS-beskyttelse**: Flerlagsbeskyttelse gennem DataPackets Shield-system og Cloudflare
* **Automatisk skalering**: Dynamisk ressourcejustering baseret på efterspørgsel
* **Misbrugsforebyggelse**: Brugerspecifikke misbrugsforebyggelseskontroller og hashbaseret blokering for skadeligt indhold
* **E-mailgodkendelse**: SPF-, DKIM-, DMARC-protokoller med avanceret phishing-detektion

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS-beskyttelsesoplysninger)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Gemmer du e-mailindhold på disken {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Zero-Knowledge-arkitektur**: Individuelt krypterede SQLite-postkasser betyder, at videresendt e-mail ikke kan få adgang til e-mailindhold
* **In-Memory-behandling**: E-mailbehandling foregår udelukkende i hukommelsen og undgår disklagring
* **Ingen indholdslogning**: "Vi logger eller gemmer ikke e-mailindhold eller metadata på disk"
* **Sandboxed Encryption**: Krypteringsnøgler gemmes aldrig på disk i klartekst

**MX-kodebasebevis**: MX-serveren behandler e-mails udelukkende i hukommelsen uden at skrive indhold til disken. Den primære e-mailbehandlingshåndterer demonstrerer denne in-memory-tilgang: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstrakt)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detaljer uden viden)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandbox-kryptering)

### Kan e-mailindhold eksponeres under systemnedbrud {#can-email-content-be-exposed-during-system-crashes}

Nej. Videresend e-mail implementerer omfattende sikkerhedsforanstaltninger mod dataeksponering relateret til nedbrud:

* **Core Dumps Deaktiveret**: Forhindrer hukommelseseksponering under nedbrud
* **Swap Memory Deaktiveret**: Helt deaktiveret for at forhindre udtrækning af følsomme data fra swap-filer
* **In-Memory Architecture**: E-mail-indhold findes kun i flygtig hukommelse under behandling
* **Beskyttelse af krypteringsnøgler**: Nøgler gemmes aldrig på disken i klartekst
* **Fysisk sikkerhed**: LUKS v2-krypterede diske forhindrer fysisk adgang til data
* **USB-lagring Deaktiveret**: Forhindrer uautoriseret dataudtrækning

**Fejlhåndtering af systemproblemer**: Videresend e-mail bruger hjælpefunktionerne `isCodeBug` og `isTimeoutError` til at sikre, at hvis der opstår problemer med databaseforbindelse, DNS-netværk/blokeringsliste eller upstream-forbindelse, returnerer systemet 421 SMTP-statuskoder for at sikre, at e-mails forsøges igen senere i stedet for at blive tabt eller eksponeret.

Implementeringsdetaljer:

* Fejlklassificering: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Håndtering af timeout-fejl i MX-behandling: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Kilde: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Hvem har adgang til din e-mailinfrastruktur {#who-has-access-to-your-email-infrastructure}

Forward Email implementerer omfattende adgangskontroller for sit minimale 2-3-personers tekniske team med strenge 2FA-krav:

* **Rollebaseret adgangskontrol**: For teamkonti med ressourcebaserede tilladelser
* **Princippet om mindste rettigheder**: Anvendes på tværs af alle systemer
* **Opdeling af opgaver**: Mellem operationelle roller
* **Brugeradministration**: Separat implementering og devop af brugere med forskellige tilladelser
* **Root Login deaktiveret**: Tvinger adgang gennem korrekt autentificerede konti
* **Strict 2FA**: Ingen SMS-baseret 2FA på grund af risiko for MiTM-angreb - kun app-baserede eller hardware-tokens
* **Omfattende revisionslogning**: Med redigering af følsomme data
* **Automatiseret anomalidetektion**: For usædvanlige adgangsmønstre
* **Regelmæssige sikkerhedsgennemgange**: Af adgangslogfiler
* **Forebyggelse af Evil Maid-angreb**: USB-lager deaktiveret og andre fysiske sikkerhedsforanstaltninger

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Autorisationskontroller)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Netværkssikkerhed)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Forebyggelse af Evil Maid-angreb)

### Hvilke infrastrukturudbydere bruger du {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Du kan finde alle detaljer på vores side om GDPR-overholdelse: <https://forwardemail.net/gdpr>

**Primære infrastrukturunderdatabehandlere:**

| Udbyder | Certificeret ramme for databeskyttelse | GDPR-overholdelsesside |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ja | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datapakke** | ❌ Nej | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Nej | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nej | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Detaljerede certificeringer:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (revideret af Schellman & Company LLC)
* ISO 27001-certificeret i flere datacentre
* PCI-DSS-kompatibel
* CSA STAR Level 1-certificeret
* APEC CBPR PRP-certificeret
* Detaljer: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) certificeret
* PCI Merchant-kompatibel
* CSA STAR Level 1-certificeret
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detaljer: <https://www.vultr.com/legal/compliance/>

**Datapakke**

* SOC 2-kompatibel (kontakt DataPacket direkte for at få certificering)
* Virksomhedsbaseret infrastruktur (Denver-lokation)
* DDoS-beskyttelse gennem Shield cybersikkerhedsstakken
* Teknisk support døgnet rundt
* Globalt netværk på tværs af 58 datacentre
* Detaljer: <https://www.datapacket.com/datacenters/denver>

**Betalingsudbydere:**

* **Stripe**: Certificeret i henhold til Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Ikke DPF-certificeret - <https://www.paypal.com/uk/legalhub/privacy-full>

### Tilbyder I en databehandleraftale (DPA)? {#do-you-offer-a-data-processing-agreement-dpa}

Ja, Forward Email tilbyder en omfattende databehandleraftale (DPA), der kan underskrives sammen med vores virksomhedsaftale. En kopi af vores DPA er tilgængelig på: <https://forwardemail.net/dpa>

**DPA-oplysninger:**

* Dækker GDPR-overholdelse og EU-US/Schweiz-US Privacy Shield-rammer
* Automatisk accept ved accept af vores servicevilkår
* Ingen separat underskrift kræves for standard DPA
* Tilpassede DPA-aftaler tilgængelige via Enterprise License

**GDPR-overholdelsesramme:**
Vores databeskyttelsesaftale beskriver overholdelse af GDPR samt internationale krav til dataoverførsel. Fuldstændige oplysninger er tilgængelige på: <https://forwardemail.net/gdpr>

For virksomhedskunder, der kræver brugerdefinerede DPA-vilkår eller specifikke kontraktlige aftaler, kan disse håndteres via vores **Enterprise License ($250/måned)**-program.

### Hvordan håndterer I meddelelser om databrud {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Begrænset dataeksponering**: Kan ikke få adgang til krypteret e-mailindhold på grund af nul-viden-arkitektur
* **Minimal dataindsamling**: Kun grundlæggende abonnentoplysninger og begrænsede IP-logfiler af sikkerhedsmæssige årsager
* **Underprocessor-rammer**: DigitalOcean og Vultr opretholder GDPR-kompatible procedurer for hændelsesrespons

**Oplysninger om GDPR-repræsentant:**
Forward Email har udpeget GDPR-repræsentanter i overensstemmelse med artikel 27:

**EU-repræsentant:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Repræsentant i Storbritannien:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

For virksomhedskunder, der kræver specifikke SLA'er for notifikation om brud, bør disse drøftes som en del af en **Virksomhedslicens**-aftale.

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Tilbyder I et testmiljø? {#do-you-offer-a-test-environment}

Den tekniske dokumentation for Videresend Email beskriver ikke eksplicit en dedikeret sandkassetilstand. Potentielle testmetoder omfatter dog:

* **Selvhostingmulighed**: Omfattende selvhostingfunktioner til oprettelse af testmiljøer
* **API-grænseflade**: Potentiale for programmatisk test af konfigurationer
* **Open Source**: 100 % open source-kode giver kunderne mulighed for at undersøge videresendelseslogik
* **Flere domæner**: Understøttelse af flere domæner kan muliggøre oprettelse af testdomæner

For virksomhedskunder, der kræver formelle sandbox-funktioner, bør dette drøftes som en del af en **Virksomhedslicens**-aftale.

Kilde: <https://github.com/forwardemail/forwardemail.net> (Detaljer om udviklingsmiljø)

### Tilbyder I overvågnings- og alarmeringsværktøjer? {#do-you-provide-monitoring-and-alerting-tools}

Videresend e-mail giver overvågning i realtid med visse begrænsninger:

**Tilgængelig:**

* **Overvågning af levering i realtid**: Offentligt synlige præstationsmålinger for større e-mailudbydere
* **Automatisk alarmering**: Ingeniørteamet får besked, når leveringstiderne overstiger 10 sekunder
* **Transparent overvågning**: 100 % open source-overvågningssystemer
* **Infrastrukturovervågning**: Automatiseret anomalidetektion og omfattende revisionslogning

**Begrænsninger:**

* Kundevendte webhooks eller API-baserede leveringsstatusmeddelelser er ikke eksplicit dokumenteret.

For virksomhedskunder, der kræver detaljerede webhooks med leveringsstatus eller brugerdefinerede overvågningsintegrationer, kan disse funktioner være tilgængelige via **Virksomhedslicens**-aftaler.

Kilder:

* <https://forwardemail.net> (Overvågningsvisning i realtid)
* <https://github.com/forwardemail/forwardemail.net> (Implementering af overvågning)

### Hvordan sikrer du høj tilgængelighed {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Distribueret infrastruktur**: Flere udbydere (DigitalOcean, Vultr, DataPacket) på tværs af geografiske områder
* **Geografisk belastningsbalancering**: Cloudflare-baseret geolokaliseret belastningsbalancering med automatisk failover
* **Automatisk skalering**: Dynamisk ressourcejustering baseret på efterspørgsel
* **Multi-Layer DDoS-beskyttelse**: Gennem DataPackets Shield-system og Cloudflare
* **Serverredundans**: Flere servere pr. region med automatisk failover
* **Databasereplikering**: Datasynkronisering i realtid på tværs af flere lokationer
* **Overvågning og alarmering**: 24/7 overvågning med automatisk hændelsesrespons

**Oppetidsforpligtelse**: 99,9%+ servicetilgængelighed med transparent overvågning tilgængelig på <https://forwardemail.net>

Kilder:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Overholder du paragraf 889 i National Defense Authorization Act (NDAA)? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Ja, videresendelse af e-mail er **kompatibel med paragraf 889**. Paragraf 889 i National Defense Authorization Act (NDAA) forbyder offentlige myndigheder at bruge eller indgå kontrakter med enheder, der bruger telekommunikations- og videoovervågningsudstyr fra bestemte virksomheder (Huawei, ZTE, Hikvision, Dahua og Hytera).

**Sådan opnår videresendt e-mail overholdelse af paragraf 889:**

Videresend e-mail er udelukkende afhængig af to centrale infrastrukturudbydere, hvoraf ingen bruger udstyr, der er forbudt i henhold til paragraf 889:

1. **Cloudflare**: Vores primære partner for netværkstjenester og e-mailsikkerhed
2. **DataPacket**: Vores primære leverandør af serverinfrastruktur (uden brug af Arista Networks og Cisco-udstyr)
3. **Backup-udbydere**: Vores backup-udbydere af Digital Ocean og Vultr er desuden skriftligt bekræftet som værende i overensstemmelse med Section 889.

**Cloudflares forpligtelse**: Cloudflare angiver eksplicit i deres tredjepartsadfærdskodeks, at de ikke bruger telekommunikationsudstyr, videoovervågningsprodukter eller tjenester fra enheder, der er forbudt i henhold til paragraf 889.

**Offentligt brugsscenario**: Vores overholdelse af paragraf 889 blev valideret, da **US Naval Academy** valgte Videresend Email til deres behov for sikker videresendelse af e-mail, hvilket krævede dokumentation af vores føderale overholdelsesstandarder.

For fuldstændige oplysninger om vores ramme for overholdelse af regler og regler for myndigheder, herunder bredere føderale bestemmelser, kan du læse vores omfattende casestudie: [Overholder paragraf 889 i den føderale regerings e-mailtjeneste](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## System- og tekniske detaljer {#system-and-technical-details}

### Gemmer I e-mails og deres indhold? {#do-you-store-emails-and-their-contents}

Nej, vi skriver ikke til disk eller gemmer logs – med [undtagelse af fejl](#do-you-store-error-logs) og [udgående SMTP](#do-you-support-sending-email-with-smtp) (se vores [Privatlivspolitik](/privacy)).

Alt gøres i hukommelsen og [vores kildekode er på GitHub](https://github.com/forwardemail).

### Hvordan fungerer jeres system til videresendelse af e-mails? {#how-does-your-email-forwarding-system-work}

E-mail er afhængig af [SMTP-protokol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Denne protokol består af kommandoer, der sendes til en server (og kører oftest på port 25). Der er en indledende forbindelse, derefter angiver afsenderen, hvem mailen er fra ("MAIL FROM"), efterfulgt af hvor den skal hen ("RCPT TO"), og endelig headerne og selve mailens brødtekst ("DATA"). Processen i vores system til videresendelse af e-mails er beskrevet i forhold til hver SMTP-protokolkommando nedenfor:

* Indledende forbindelse (intet kommandonavn, f.eks. `telnet example.com 25`) - Dette er den indledende forbindelse. Vi kontrollerer afsendere, der ikke er i vores [tilladelsesliste](#do-you-have-an-allowlist), mod vores [denylist](#do-you-have-a-denylist). Endelig, hvis en afsender ikke er på vores tilladelsesliste, kontrollerer vi, om de er blevet [grålistet](#do-you-have-a-greylist).

* `HELO` - Dette angiver en hilsen, der identificerer afsenderens FQDN, IP-adresse eller navn på e-mailbehandler. Denne værdi kan forfalskes, så vi er ikke afhængige af disse data og bruger i stedet omvendt opslag af værtsnavne for forbindelsens IP-adresse.

* `MAIL FROM` - Dette angiver e-mailens kuvertadresse. Hvis der indtastes en værdi, skal den være en gyldig RFC 5322-e-mailadresse. Tomme værdier er tilladt. Vi [tjek for tilbagespredning](#how-do-you-protect-against-backscatter) her, og vi kontrollerer også MAIL FROM mod vores [denylist](#do-you-have-a-denylist). Vi kontrollerer endelig afsendere, der ikke er på tilladelseslisten, for hastighedsbegrænsning (se afsnittet om [Hastighedsbegrænsende](#do-you-have-rate-limiting) og [tilladelsesliste](#do-you-have-an-allowlist) for mere information).

* `RCPT TO` - Dette angiver modtageren(e) af e-mailen. Disse skal være gyldige RFC 5322-e-mailadresser. Vi tillader kun op til 50 kuvertmodtagere pr. besked (dette er forskelligt fra "Til"-headeren i en e-mail). Vi kontrollerer også for en gyldig [Afsenderomskrivningsordning](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS")-adresse her for at beskytte mod forfalskning med vores SRS-domænenavn.

* `DATA` - Dette er den centrale del af vores tjeneste, som behandler en e-mail. Se afsnittet [Hvordan behandler du en e-mail til videresendelse](#how-do-you-process-an-email-for-forwarding) nedenfor for mere indsigt.

### Hvordan videresender man en e-mail? {#how-do-you-process-an-email-for-forwarding}

Dette afsnit beskriver vores proces relateret til SMTP-protokolkommandoen `DATA` i afsnittet [Hvordan fungerer jeres system til videresendelse af e-mails](#how-does-your-email-forwarding-system-work) ovenfor – det handler om, hvordan vi behandler en e-mails headere, brødtekst, sikkerhed, bestemmer, hvor den skal leveres til, og hvordan vi håndterer forbindelser.

1. Hvis beskeden overstiger den maksimale størrelse på 50 MB, afvises den med fejlkoden 552.

2. Hvis beskeden ikke indeholdt en "Fra"-header, eller hvis nogen af værdierne i "Fra"-headeren ikke var gyldige RFC 5322-e-mailadresser, afvises den med en 550-fejlkode.

3. Hvis beskeden havde mere end 25 "Modtaget"-headere, blev det konstateret, at den sad fast i en omdirigeringsløkke, og den blev afvist med en 550-fejlkode.

4. Ved hjælp af e-mailens fingeraftryk (se afsnittet om [Fingeraftryk](#how-do-you-determine-an-email-fingerprint)) kontrollerer vi, om beskeden har været forsøgt sendt igen i mere end 5 dage (hvilket matcher [standard postfix-adfærd](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), og hvis det er tilfældet, vil den blive afvist med en 550-fejlkode.

5. Vi gemmer resultaterne fra scanningen af e-mailen i hukommelsen ved hjælp af [Spamscanner](https://spamscanner.net).

6. Hvis der var vilkårlige resultater fra Spam Scanner, afvises den med en 554-fejlkode. Vilkårlige resultater inkluderer kun GTUBE-testen på tidspunktet for denne skrivning. Se <https://spamassassin.apache.org/gtube/> for mere indsigt.

7. Vi tilføjer følgende overskrifter til beskeden med henblik på fejlfinding og forebyggelse af misbrug:

* `Received` - vi tilføjer denne standard Received-header med oprindelses-IP og vært, transmissionstype, TLS-forbindelsesoplysninger, dato/klokkeslæt og modtager.

* `X-Original-To` - den oprindelige modtager af beskeden:

* Dette er nyttigt til at bestemme, hvor en e-mail oprindeligt blev leveret til (ud over headeren "Received").

* Dette tilføjes pr. modtager på tidspunktet for IMAP og/eller maskeret videresendelse (for at beskytte privatlivets fred).

* `X-Forward-Email-Website` - indeholder et link til vores hjemmeside <https://forwardemail.net>

* `X-Forward-Email-Version` - den nuværende [SemVer](https://semver.org/) version fra `package.json` af vores kodebase.

* `X-Forward-Email-Session-ID` - en sessions-ID-værdi, der bruges til fejlfindingsformål (gælder kun i ikke-produktionsmiljøer).
* `X-Forward-Email-Sender` - en kommasepareret liste, der indeholder den originale MAIL FROM-adresse (hvis den ikke var tom), den omvendte PTR-klient FQDN (hvis den findes) og afsenderens IP-adresse.
* `X-Forward-Email-ID` - dette gælder kun for udgående SMTP og korrelerer med det e-mail-ID, der er gemt i Min konto → E-mails.
* `X-Report-Abuse` - med en værdi på `abuse@forwardemail.net`.
* `X-Report-Abuse-To` - med en værdi på `abuse@forwardemail.net`.
* `X-Complaints-To` - med en værdi på `abuse@forwardemail.net`.

8. Vi tjekker derefter beskeden for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) og [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Hvis beskeden ikke bestod DMARC, og domænet havde en afvisningspolitik (f.eks. `p=reject` [var i DMARC-politikken](https://wikipedia.org/wiki/DMARC)), afvises den med en 550-fejlkode. Typisk kan en DMARC-politik for et domæne findes i `_dmarc` underdomæne <strong class="notranslate">TXT</strong>-posten (f.eks. `dig _dmarc.example.com txt`).
* Hvis beskeden ikke bestod SPF, og domænet havde en hard fail-politik (f.eks. `-all` var i SPF-politikken i modsætning til `~all` eller slet ingen politik), afvises den med en 550-fejlkode. Typisk kan en SPF-politik for et domæne findes i <strong class="notranslate">TXT</strong>-posten for roddomænet (f.eks. `dig example.com txt`). Se dette afsnit for mere information om [afsendelse af mails som med Gmail](#can-i-send-mail-as-in-gmail-with-this) vedrørende SPF.

9. Nu behandler vi modtagerne af beskeden, som de er indsamlet fra kommandoen `RCPT TO` i afsnittet [Hvordan fungerer jeres system til videresendelse af e-mails](#how-does-your-email-forwarding-system-work) ovenfor. For hver modtager udfører vi følgende handlinger:

* Vi slår <strong class="notranslate">TXT</strong>-posterne op for domænenavnet (delen efter symbolet `@`, f.eks. `example.com`, hvis e-mailadressen var `test@example.com`). Hvis domænet f.eks. er `example.com`, foretager vi et DNS-opslag, f.eks. `dig example.com txt`.

* Vi analyserer alle <strong class="notranslate">TXT</strong>-poster, der starter med enten `forward-email=` (gratis abonnementer) eller `forward-email-site-verification=` (betalte abonnementer). Bemærk, at vi analyserer begge for at behandle e-mails, mens en bruger opgraderer eller nedgraderer abonnementer.
* Fra disse parsede <strong class="notranslate">TXT</strong>-poster itererer vi over dem for at udtrække videresendelseskonfigurationen (som beskrevet i afsnittet [Hvordan kommer jeg i gang og konfigurerer videresendelse af e-mails](#how-do-i-get-started-and-set-up-email-forwarding) ovenfor). Bemærk, at vi kun understøtter én `forward-email-site-verification=`-værdi, og hvis mere end én angives, vil der opstå en 550-fejl, og afsenderen vil modtage en afvisning for denne modtager.

* Rekursivt itererer vi over den udtrukne videresendelseskonfiguration for at bestemme global videresendelse, regex-baseret videresendelse og alle andre understøttede videresendelseskonfigurationer – som nu er kendt som vores "videresendelsesadresser".

* For hver videresendelsesadresse understøtter vi ét rekursivt opslag (som starter denne serie af operationer forfra på den givne adresse). Hvis der blev fundet et rekursivt match, fjernes det overordnede resultat fra videresendelsesadresserne, og underresultaterne tilføjes.
* Videresendelsesadresser analyseres for unikke oplysninger (da vi ikke ønsker at sende dubletter til én adresse eller skabe yderligere unødvendige SMTP-klientforbindelser).

* For hver videresendelsesadresse slår vi dens domænenavn op mod vores API-slutpunkt `/v1/max-forwarded-addresses` (for at bestemme, hvor mange adresser domænet har tilladelse til at videresende e-mails til pr. alias, f.eks. 10 som standard – se afsnittet om [maksimal grænse for videresendelse pr. alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Hvis denne grænse overskrides, vil der opstå en 550-fejl, og afsenderen vil modtage en afvisning for denne modtager.

* Vi slår indstillingerne for den oprindelige modtager op mod vores API-slutpunkt `/v1/settings`, som understøtter et opslag for betalende brugere (med et fallback for gratis brugere). Dette returnerer et konfigurationsobjekt for avancerede indstillinger for `port` (tal, f.eks. `25`), `has_adult_content_protection` (boolsk), `has_phishing_protection` (boolsk), `has_executable_protection` (boolsk) og `has_virus_protection` (boolsk).
* Baseret på disse indstillinger kontrollerer vi derefter mod Spam Scanner-resultater, og hvis der opstår fejl, afvises beskeden med en 554-fejlkode (f.eks. hvis `has_virus_protection` er aktiveret, kontrollerer vi Spam Scanner-resultaterne for virus). Bemærk, at alle brugere af gratisplanen vil blive tilmeldt kontroller mod voksenindhold, phishing, eksekverbare filer og virus. Som standard er alle brugere af et betalt abonnement også tilmeldt, men denne konfiguration kan ændres under siden Indstillinger for et domæne i dashboardet til videresendelse af e-mail.

10. For hver behandlet modtagers videresendelsesadresser udfører vi derefter følgende handlinger:

* Adressen kontrolleres mod vores [denylist](#do-you-have-a-denylist), og hvis den var angivet, vil der opstå en 421-fejlkode (indikerer for afsenderen, at han skal prøve igen senere).
* Hvis adressen er en webhook, sætter vi en boolsk værdi for fremtidige operationer (se nedenfor – vi grupperer lignende webhooks for at lave én POST-anmodning i stedet for flere til levering).
* Hvis adressen er en e-mailadresse, analyserer vi værten til fremtidige operationer (se nedenfor – vi grupperer lignende værter for at lave én forbindelse i stedet for flere individuelle forbindelser til levering).

11. Hvis der ikke er nogen modtagere, og der ikke er nogen afvisninger, svarer vi med en 550-fejlmeddelelse med teksten "Ugyldige modtagere".

12. Hvis der er modtagere, gennemgår vi dem (grupperet af den samme vært) og leverer e-mailsene. Se afsnittet [Hvordan håndterer du problemer med e-maillevering](#how-do-you-handle-email-delivery-issues) nedenfor for mere indsigt.

* Hvis der opstår fejl under afsendelse af e-mails, gemmer vi dem i hukommelsen til senere behandling.
* Vi tager den laveste fejlkode (hvis nogen) fra afsendelse af e-mails – og bruger den som svarkode til kommandoen `DATA`. Det betyder, at e-mails, der ikke er leveret, typisk vil blive forsøgt at sende igen af den oprindelige afsender, men e-mails, der allerede er leveret, vil ikke blive sendt igen næste gang beskeden sendes (da vi bruger [Fingeraftryk](#how-do-you-determine-an-email-fingerprint)).
* Hvis der ikke opstod fejl, sender vi en 250 succesfuld SMTP-svarstatuskode.
* En afvisning bestemmes som ethvert forsøg på levering, der resulterer i en statuskode, der er >= 500 (permanente fejl).

13. Hvis der ikke opstod nogen afvisninger (permanente fejl), returnerer vi en SMTP-svarstatuskode med den laveste fejlkode fra ikke-permanente fejl (eller en statuskode på 250 succesfulde fejl, hvis der ikke var nogen).

14. Hvis der opstår afvisninger, sender vi afvisningsmails i baggrunden efter at have returneret den laveste af alle fejlkoder til afsenderen. Hvis den laveste fejlkode er >= 500, sender vi dog ingen afvisningsmails. Dette skyldes, at hvis vi gjorde det, ville afsenderne modtage en dobbelt afvisningsmail (f.eks. en fra deres udgående MTA, f.eks. Gmail – og også en fra os). Se afsnittet om [Hvordan beskytter du dig mod tilbagespredning](#how-do-you-protect-against-backscatter) nedenfor for mere indsigt.

### Hvordan håndterer I problemer med e-maillevering {#how-do-you-handle-email-delivery-issues}

Bemærk, at vi vil lave en "Venlig-Fra"-omskrivning af e-mails, hvis og kun hvis afsenderens DMARC-politik ikke passerede, OG ingen DKIM-signaturer var justeret med "Fra"-headeren.  Det betyder, at vi vil ændre "Fra"-headeren på meddelelsen, indstille "X-Original-Fra", og også indstille en "Svar-Til", hvis den ikke allerede var indstillet.  Vi vil også genforsegle ARC-seglet på meddelelsen efter at have ændret disse overskrifter.

Vi bruger også smart-parsing af fejlmeddelelser på alle niveauer i vores stak – i vores kode, DNS-anmodninger, Node.js-internals, HTTP-anmodninger (f.eks. er 408, 413 og 429 knyttet til SMTP-svarkoden 421, hvis modtageren er en webhook) og mailserversvar (f.eks. ville svar med "defer" eller "slowdown" blive gentaget som 421-fejl).

Vores logik er dummy-proof, og den vil også forsøge igen for SSL/TLS-fejl, forbindelsesproblemer og mere. Målet med dummy-proofing er at maksimere leveringsevnen til alle modtagere af en videresendelseskonfiguration.

Hvis modtageren er en webhook, tillader vi en timeout på 60 sekunder for at anmodningen kan fuldføres med op til 3 genforsøg (så i alt 4 anmodninger før en fejl). Bemærk, at vi korrekt analyserer fejlkoderne 408, 413 og 429 og knytter dem til en SMTP-svarkode på 421.

Hvis modtageren er en e-mailadresse, forsøger vi at sende e-mailen med opportunistisk TLS (vi forsøger at bruge STARTTLS, hvis det er tilgængeligt på modtagerens mailserver). Hvis der opstår en SSL/TLS-fejl under forsøget på at sende e-mailen, forsøger vi at sende e-mailen uden TLS (uden at bruge STARTTLS).

Hvis der opstår DNS- eller forbindelsesfejl, returnerer vi en SMTP-svarkode på 421 til kommandoen `DATA`. Ellers sendes der afvisninger, hvis der er fejl på niveauet >= 500.

Hvis vi opdager, at en e-mailserver, vi forsøger at levere til, har en eller flere af vores IP-adresser til mailudveksling blokeret (f.eks. af den teknologi, de bruger til at udsætte spammere), sender vi en SMTP-svarkode på 421, så afsenderen kan prøve at sende beskeden igen senere (og vi bliver advaret om problemet, så vi forhåbentlig kan løse det inden næste forsøg).

### Hvordan håndterer du blokering af dine IP-adresser? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Vi overvåger rutinemæssigt alle større DNS-afvisningslister, og hvis nogen af vores mail exchange ("MX") IP-adresser er angivet på en større afvisningsliste, fjerner vi den fra den relevante DNS A-post round robin, hvis det er muligt, indtil problemet er løst.

I skrivende stund er vi også opført på flere DNS-tilladelseslister, og vi tager overvågning af afvisningslister alvorligt. Hvis du ser problemer, før vi har mulighed for at løse dem, bedes du underrette os skriftligt på <support@forwardemail.net>.

Vores IP-adresser er offentligt tilgængelige, [se dette afsnit nedenfor for mere indsigt](#what-are-your-servers-ip-addresses).

### Hvad er postmasteradresser {#what-are-postmaster-addresses}

For at forhindre forkerte afvisninger og afsendelse af feriesvar-beskeder til uovervågede eller ikke-eksisterende postkasser, vedligeholder vi en liste over mailer-daemon-lignende brugernavne:

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
* [og enhver adresse uden svar](#what-are-no-reply-addresses)

Se [RFC 5320 Afsnit 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) for mere indsigt i, hvordan lister som disse bruges til at oprette effektive e-mailsystemer.

### Hvad er adresser, der ikke kan besvares? {#what-are-no-reply-addresses}

E-mail-brugernavne svarende til et af følgende (uafhængig af store og små bogstaver) betragtes som adresser, der ikke må svare:

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

### Hvad er din servers IP-adresser? {#what-are-your-servers-ip-addresses}

Vi offentliggør vores IP-adresser på <https://forwardemail.net/ips>.

### Har du en tilladelsesliste {#do-you-have-an-allowlist}

Ja, vi har en [liste over domænenavnsudvidelser](#what-domain-name-extensions-are-allowlisted-by-default), der som standard er på tilladelseslisten, og en dynamisk, cachelagret og rullende tilladelsesliste baseret på [strenge kriterier](#what-is-your-allowlist-criteria).

Alle e-mails, domæner og modtagere fra kunder med betalte abonnementer føjes automatisk til vores tilladelsesliste.

### Hvilke domænenavnsudvidelser er som standard tilladt {#what-domain-name-extensions-are-allowlisted-by-default}

Følgende domænenavnsudvidelser anses som standard for at være på tilladelseslisten (uanset om de er på Umbrella Popularity List eller ej):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">edu</code></li> <li class="list-inline-item"><code class="notranslate">gov</code></li> <li class="list-inline-item"><code class="notranslate">mil</code></li> <li class="list-inline-item"><code class="notranslate">int</code></li> <li class="list-inline-item"><code class="notranslate">arpa</code></li> <li class="list-inline-item"><code class="notranslate">dni.us</code></li> <li class="list-inline-item"><code class="notranslate">fed.us</code></li> <li class="list-inline-item"><code class="notranslate">isa.us</code></li> <li class="list-inline-item"><code class="notranslate">kids.us</code></li> <li class="list-inline-item"><code class="notranslate">nsn.us</code></li> <li class="list-inline-item"><code class="notranslate">ak.us</code></li> <li class="list-inline-item"><code class="notranslate">al.us</code></li> <li class="list-inline-item"><code class="notranslate">ar.us</code></li> <li class="list-inline-item"><code class="notranslate">as.us</code></li> <li class="list-inline-item"><code class="notranslate">az.us</code></li> <li class="list-inline-item"><code class="notranslate">ca.us</code></li> <li class="list-inline-item"><code class="notranslate">co.us</code></li> <li class="list-inline-item"><code class="notranslate">ct.us</code></li> <li class="list-inline-item"><code class="notranslate">dc.us</code></li> <li class="list-inline-item"><code class="notranslate">de.us</code></li> <li class="list-inline-item"><code class="notranslate">fl.us</code></li> <li class="list-inline-item"><code class="notranslate">ga.us</code></li> <li class="list-inline-item"><code class="notranslate">gu.us</code></li> <li class="list-inline-item"><code class="notranslate">hi.us</code></li> <li class="list-inline-item"><code class="notranslate">ia.us</code></li> <li class="list-inline-item"><code class="notranslate">id.us</code></li> <li class="list-inline-item"><code class="notranslate">il.us</code></li> <li class="list-inline-item"><code class="notranslate">in.us</code></li> <li class="list-inline-item"><code class="notranslate">ks.us</code></li> <li class="list-inline-item"><code class="notranslate">ky.us</code></li> <li class="list-inline-item"><code class="notranslate">la.us</code></li> <li class="list-inline-item"><code class="notranslate">ma.us</code></li> <li class="list-inline-item"><code class="notranslate">md.us</code></li> <li class="list-inline-item"><code class="notranslate">me.us</code></li> <li class="list-inline-item"><code class="notranslate">mi.us</code></li> <li class="list-inline-item"><code class="notranslate">mn.us</code></li> <li class="list-inline-item"><code class="notranslate">mo.us</code></li> <li class="list-inline-item"><code class="notranslate">ms.us</code></li> <li class="list-inline-item"><code class="notranslate">mt.us</code></li> <li class="list-inline-item"><code class="notranslate">nc.us</code></li> <li class="list-inline-item"><code class="notranslate">nd.us</code></li> <li class="list-inline-item"><code class="notranslate">ne.us</code></li> <li class="list-inline-item"><code class="notranslate">nh.us</code></li> <li class="list-inline-item"><code class="notranslate">nm.us</code></li> <li class="list-inline-item"><code class="notranslate">nv.us</code></li> <li class="list-inline-item"><code class="notranslate">ny.us</code></li> <li class="list-inline-item"><code class="notranslate">oh.us</code></li> <li class="list-inline-item"><code class="notranslate">ok.us</code></li> <li class="list-inline-item"><code class="notranslate">or.us</code></li> <li class="list-inline-item"><code class="notranslate">pa.us</code></li> <li class="list-inline-item"><code class="notranslate">pr.us</code></li> <li class="list-inline-item"><code class="notranslate">ri.us</code></li> <li class="list-inline-item"><code class="notranslate">sc.us</code></li> <li class="list-inline-item"><code class="notranslate">sd.us</code></li> <li class="list-inline-item"><code class="notranslate">tn.us</code></li> <li class="list-inline-item"><code class="notranslate">tx.us</code></li> <li class="list-inline-item"><code class="notranslate">ut.us</code></li> <li class="list-inline-item"><code class="notranslate">va.us</code></li> <li class="list-inline-item"><code class="notranslate">vi.us</code></li> <li class="list-inline-item"><code class="notranslate">vt.us</code></li> <li class="list-inline-item"><code class="notranslate">wa.us</code></li> <li class="list-inline-item"><code class="notranslate">wi.us</code></li> <li class="list-inline-item"><code class="notranslate">wv.us</code></li> <li class="list-inline-item"><code class="notranslate">wy.us</code></li> <li class="list-inline-item"><code class="notranslate">mil.tt</code></li> <li class="list-inline-item"><code class="notranslate">edu.tt</code></li> <li class="list-inline-item"><code class="notranslate">edu.tr</code></li> <li class="list-inline-item"><code class="notranslate">edu.ua</code></li> <li class="list-inline-item"><code class="notranslate">edu.au</code></li> <li class="list-inline-item"><code class="notranslate">ac.at</code></li> <li class="list-inline-item"><code class="notranslate">edu.br</code></li> <li class="list-inline-item"><code class="notranslate">ac.nz</code></li> <li class="list-inline-item"><code class="notranslate">school.nz</code></li> <li class="list-inline-item"><code class="notranslate">cri.nz</code></li> <li class="list-inline-item"><code class="notranslate">health.nz</code></li> <li class="list-inline-item"><code class="notranslate">mil.nz</code></li> <li class="list-inline-item"><code class="notranslate">parlament.nz</code></li> <li class="list-inline-item"><code class="notranslate">ac.in</code></li> <li class="list-inline-item"><code class="notranslate">edu.in</code></li> <li class="list-inline-item"><code class="notranslate">mil.in</code></li> <li class="list-inline-item"><code class="notranslate">ac.jp</code></li> <li class="list-inline-item"><code class="notranslate">ed.jp</code></li> <li class="list-inline-item"><code class="notranslate">lg.jp</code></li> <li class="list-inline-item"><code class="notranslate">ac.za</code></li> <li class="list-inline-item"><code class="notranslate">edu.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.za</code></li> <li class="list-inline-item"><code class="notranslate">skole.za</code></li> <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li> <li class="list-inline-item"><code class="notranslate">sch.lk</code></li> <li class="list-inline-item"><code class="notranslate">edu.lk</code></li> <li class="list-inline-item"><code class="notranslate">ac.th</code></li> <li class="list-inline-item"><code class="notranslate">mi.th</code></li> <li class="list-inline-item"><code class="notranslate">admin.ch</code></li> <li class="list-inline-item"><code class="notranslate">canada.ca</code></li> <li class="list-inline-item"><code class="notranslate">gc.ca</code></li> <li class="list-inline-item"><code class="notranslate">go.id</code></li>
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
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li> <li class="list-inline-item"><code class="notranslate">gov.af</code></li> <li class="list-inline-item"><code class="notranslate">gov.ai</code></li> <li class="list-inline-item"><code class="notranslate">gov.al</code></li> <li class="list-inline-item"><code class="notranslate">gov.am</code></li> <li class="list-inline-item"><code class="notranslate">gov.ao</code></li> <li class="list-inline-item"><code class="notranslate">gov.au</code></li> <li class="list-inline-item"><code class="notranslate">gov.aw</code></li> <li class="list-inline-item"><code class="notranslate">gov.ax</code></li> <li class="list-inline-item"><code class="notranslate">gov.az</code></li> <li class="list-inline-item"><code class="notranslate">gov.bd</code></li> <li class="list-inline-item"><code class="notranslate">gov.be</code></li> <li class="list-inline-item"><code class="notranslate">gov.bg</code></li> <li class="list-inline-item"><code class="notranslate">gov.bm</code></li> <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>--> <li class="list-inline-item"><code class="notranslate">gov.by</code></li> <li class="list-inline-item"><code class="notranslate">gov.cl</code></li> <li class="list-inline-item"><code class="notranslate">gov.cn</code></li> <li class="list-inline-item"><code class="notranslate">gov.co</code></li> <li class="list-inline-item"><code class="notranslate">gov.cy</code></li> <li class="list-inline-item"><code class="notranslate">gov.cz</code></li> <li class="list-inline-item"><code class="notranslate">gov.dz</code></li> <li class="list-inline-item"><code class="notranslate">gov.eg</code></li> <li class="list-inline-item"><code class="notranslate">gov.fi</code></li> <li class="list-inline-item"><code class="notranslate">gov.fk</code></li> <li class="list-inline-item"><code class="notranslate">gov.gg</code></li> <li class="list-inline-item"><code class="notranslate">gov.gr</code></li> <li class="list-inline-item"><code class="notranslate">gov.hk</code></li> <li class="list-inline-item"><code class="notranslate">gov.hr</code></li> <li class="list-inline-item"><code class="notranslate">gov.hu</code></li> <li class="list-inline-item"><code class="notranslate">gov.ie</code></li> <li class="list-inline-item"><code class="notranslate">gov.il</code></li> <li class="list-inline-item"><code class="notranslate">gov.im</code></li> <li class="list-inline-item"><code class="notranslate">gov.in</code></li> <li class="list-inline-item"><code class="notranslate">gov.iq</code></li> <li class="list-inline-item"><code class="notranslate">gov.ir</code></li> <li class="list-inline-item"><code class="notranslate">gov.it</code></li> <li class="list-inline-item"><code class="notranslate">gov.je</code></li> <li class="list-inline-item"><code class="notranslate">gov.kp</code></li> <li class="list-inline-item"><code class="notranslate">gov.krd</code></li> <li class="list-inline-item"><code class="notranslate">gov.ky</code></li> <li class="list-inline-item"><code class="notranslate">gov.kz</code></li> <li class="list-inline-item"><code class="notranslate">gov.lb</code></li> <li class="list-inline-item"><code class="notranslate">gov.lk</code></li> <li class="list-inline-item"><code class="notranslate">gov.lt</code></li> <li class="list-inline-item"><code class="notranslate">gov.lv</code></li> <li class="list-inline-item"><code class="notranslate">gov.ma</code></li> <li class="list-inline-item"><code class="notranslate">gov.mm</code></li> <li class="list-inline-item"><code class="notranslate">gov.mo</code></li> <li class="list-inline-item"><code class="notranslate">gov.mt</code></li> <li class="list-inline-item"><code class="notranslate">gov.my</code></li> <li class="list-inline-item"><code class="notranslate">gov.ng</code></li> <li class="list-inline-item"><code class="notranslate">gov.np</code></li> <li class="list-inline-item"><code class="notranslate">gov.ph</code></li> <li class="list-inline-item"><code class="notranslate">gov.pk</code></li> <li class="list-inline-item"><code class="notranslate">gov.pl</code></li> <li class="list-inline-item"><code class="notranslate">gov.pt</code></li> <li class="list-inline-item"><code class="notranslate">gov.py</code></li> <li class="list-inline-item"><code class="notranslate">gov.ro</code></li> <li class="list-inline-item"><code class="notranslate">gov.ru</code></li> <li class="list-inline-item"><code class="notranslate">gov.scot</code></li> <li class="list-inline-item"><code class="notranslate">gov.se</code></li> <li class="list-inline-item"><code class="notranslate">gov.sg</code></li> <li class="list-inline-item"><code class="notranslate">gov.si</code></li> <li class="list-inline-item"><code class="notranslate">gov.sk</code></li> <li class="list-inline-item"><code class="notranslate">gov.tr</code></li> <li class="list-inline-item"><code class="notranslate">gov.tt</code></li> <li class="list-inline-item"><code class="notranslate">gov.tw</code></li> <li class="list-inline-item"><code class="notranslate">gov.ua</code></li> <li class="list-inline-item"><code class="notranslate">gov.uk</code></li> <li class="list-inline-item"><code class="notranslate">gov.vn</code></li> <li class="list-inline-item"><code class="notranslate">gov.wales</code></li> <li class="list-inline-item"><code class="notranslate">gov.za</code></li> <li class="list-inline-item"><code class="notranslate">government.pn</code></li> <li class="list-inline-item"><code class="notranslate">govt.nz</code></li> <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>--> <li class="list-inline-item"><code class="notranslate">gv.at</code></li> <li class="list-inline-item"><code class="notranslate">ac.uk</code></li> <li class="list-inline-item"><code class="notranslate">bl.uk</code></li> <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li> <li class="list-inline-item"><code class="notranslate">mod.uk</code></li> <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li> <li class="list-inline-item"><code class="notranslate">parlament.uk</code></li> <li class="list-inline-item"><code class="notranslate">police.uk</code></li> <li class="list-inline-item"><code class="notranslate">rct.uk</code></li> <li class="list-inline-item"><code class="notranslate">royal.uk</code></li> <li class="list-inline-item"><code class="notranslate">sch.uk</code></li> <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Derudover er disse [brand- og virksomhedsdomæner på topniveau](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) som standard tilladte (f.eks. `apple` for `applecard.apple` for Apple Card-kontoudtog):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">aaa</code></li> <li class="list-inline-item"><code class="notranslate">aarp</code></li> <li class="list-inline-item"><code class="notranslate">abarth</code></li> <li class="list-inline-item"><code class="notranslate">abb</code></li> <li class="list-inline-item"><code class="notranslate">abbott</code></li> <li class="list-inline-item"><code class="notranslate">abbvie</code></li> <li class="list-inline-item"><code class="notranslate">abc</code></li> <li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li> <li class="list-inline-item"><code class="notranslate">aeg</code></li> <li class="list-inline-item"><code class="notranslate">aetna</code></li> <li class="list-inline-item"><code class="notranslate">afl</code></li> <li class="list-inline-item"><code class="notranslate">agakhan</code></li> <li class="list-inline-item"><code class="notranslate">aig</code></li> <li class="list-inline-item"><code class="notranslate">aigo</code></li> <li class="list-inline-item"><code class="notranslate">airbus</code></li> <li class="list-inline-item"><code class="notranslate">airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">alipay</code></li>
<li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li> <li class="list-inline-item"><code class="notranslate">amazon</code></li> <li class="list-inline-item"><code class="notranslate">americanexpress</code></li> <li class="list-inline-item"><code class="notranslate">amex</code></li> <li class="list-inline-item"><code class="notranslate">amica</code></li> <li class="list-inline-item"><code class="notranslate">android</code></li> <li class="list-inline-item"><code class="notranslate">anz</code></li> <li class="list-inline-item"><code class="notranslate">aol</code></li> <li class="list-inline-item"><code class="notranslate">apple</code></li> <li class="list-inline-item"><code class="notranslate">aquarelle</code></li> <li class="list-inline-item"><code class="notranslate">aramco</code></li> <li class="list-inline-item"><code class="notranslate">audi</code></li> <li class="list-inline-item"><code class="notranslate">auspost</code></li> <li class="list-inline-item"><code class="notranslate">aws</code></li> <li class="list-inline-item"><code class="notranslate">axa</code></li> <li class="list-inline-item"><code class="notranslate">azure</code></li> <li class="list-inline-item"><code class="notranslate">baidu</code></li> <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li> <li class="list-inline-item"><code class="notranslate">barclaycard</code></li> <li class="list-inline-item"><code class="notranslate">barclays</code></li> <li class="list-inline-item"><code class="notranslate">basketball</code></li> <li class="list-inline-item"><code class="notranslate">bauhaus</code></li> <li class="list-inline-item"><code class="notranslate">bbc</code></li> <li class="list-inline-item"><code class="notranslate">bbt</code></li> <li class="list-inline-item"><code class="notranslate">bbva</code></li> <li class="list-inline-item"><code class="notranslate">bcg</code></li> <li class="list-inline-item"><code class="notranslate">bentley</code></li> <li class="list-inline-item"><code class="notranslate">bharti</code></li> <li class="list-inline-item"><code class="notranslate">bing</code></li> <li class="list-inline-item"><code class="notranslate">blanco</code></li> <li class="list-inline-item"><code class="notranslate">bloomberg</code></li> <li class="list-inline-item"><code class="notranslate">bms</code></li> <li class="list-inline-item"><code class="notranslate">BMW</code></li> <li class="list-inline-item"><code class="notranslate">bnl</code></li> <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li> <li class="list-inline-item"><code class="notranslate">boehringer</code></li> <li class="list-inline-item"><code class="notranslate">bond</code></li> <li class="list-inline-item"><code class="notranslate">booking</code></li> <li class="list-inline-item"><code class="notranslate">bosch</code></li> <li class="list-inline-item"><code class="notranslate">bostik</code></li> <li class="list-inline-item"><code class="notranslate">bradesco</code></li> <li class="list-inline-item"><code class="notranslate">bridgestone</code></li> <li class="list-inline-item"><code class="notranslate">brother</code></li> <li class="list-inline-item"><code class="notranslate">bugatti</code></li> <li class="list-inline-item"><code class="notranslate">cal</code></li> <li class="list-inline-item"><code class="notranslate">calvinklein</code></li> <li class="list-inline-item"><code class="notranslate">canon</code></li> <li class="list-inline-item"><code class="notranslate">capitalone</code></li> <li class="list-inline-item"><code class="notranslate">campingvogn</code></li> <li class="list-inline-item"><code class="notranslate">cartier</code></li> <li class="list-inline-item"><code class="notranslate">cba</code></li> <li class="list-inline-item"><code class="notranslate">cbn</code></li> <li class="list-inline-item"><code class="notranslate">cbre</code></li> <li class="list-inline-item"><code class="notranslate">cbs</code></li> <li class="list-inline-item"><code class="notranslate">cern</code></li> <li class="list-inline-item"><code class="notranslate">cfa</code></li> <li class="list-inline-item"><code class="notranslate">Chanel</code></li> <li class="list-inline-item"><code class="notranslate">Chase</code></li> <li class="list-inline-item"><code class="notranslate">Chintai</code></li> <li class="list-inline-item"><code class="notranslate">Chrysler</code></li> <li class="list-inline-item"><code class="notranslate">Cipriani</code></li> <li class="list-inline-item"><code class="notranslate">Cisco</code></li> <li class="list-inline-item"><code class="notranslate">Citadel</code></li> <li class="list-inline-item"><code class="notranslate">citi</code></li> <li class="list-inline-item"><code class="notranslate">citic</code></li> <li class="list-inline-item"><code class="notranslate">clubmed</code></li> <li class="list-inline-item"><code class="notranslate">comcast</code></li> <li class="list-inline-item"><code class="notranslate">commbank</code></li> <li class="list-inline-item"><code class="notranslate">kreditforening</code></li> <li class="list-inline-item"><code class="notranslate">krone</code></li> <li class="list-inline-item"><code class="notranslate">crs</code></li> <li class="list-inline-item"><code class="notranslate">csc</code></li> <li class="list-inline-item"><code class="notranslate">cuisinella</code></li> <li class="list-inline-item"><code class="notranslate">dabur</code></li> <li class="list-inline-item"><code class="notranslate">datsun</code></li> <li class="list-inline-item"><code class="notranslate">forhandler</code></li> <li class="list-inline-item"><code class="notranslate">dell</code></li> <li class="list-inline-item"><code class="notranslate">deloitte</code></li> <li class="list-inline-item"><code class="notranslate">delaitte</code></li> <li class="list-inline-item"><code class="notranslate">delaitte</code></li> <li class="list-inline-item"><code class="notranslate">dhl</code></li> <li class="list-inline-item"><code class="notranslate">discover</code></li> <li class="list-inline-item"><code class="notranslate">dish</code></li> <li class="list-inline-item"><code class="notranslate">dnp</code></li> <li class="list-inline-item"><code class="notranslate">dodge</code></li> <li class="list-inline-item"><code class="notranslate">dunlop</code></li> <li class="list-inline-item"><code class="notranslate">dupont</code></li> <li class="list-inline-item"><code class="notranslate">dvag</code></li> <li class="list-inline-item"><code class="notranslate">edeka</code></li> <li class="list-inline-item"><code class="notranslate">emerck</code></li> <li class="list-inline-item"><code class="notranslate">epson</code></li> <li class="list-inline-item"><code class="notranslate">ericsson</code></li> <li class="list-inline-item"><code class="notranslate">erni</code></li> <li class="list-inline-item"><code class="notranslate">forsikring</code></li> <li class="list-inline-item"><code class="notranslate">etisalat</code></li> <li class="list-inline-item"><code class="notranslate">eurovision</code></li> <li class="list-inline-item"><code class="notranslate">everbank</code></li> <li class="list-inline-item"><code class="notranslate">extraspace</code></li> <li class="list-inline-item"><code class="notranslate">fage</code></li> <li class="list-inline-item"><code class="notranslate">fairwinds</code></li> <li class="list-inline-item"><code class="notranslate">farmers</code></li> <li class="list-inline-item"><code class="notranslate">fedex</code></li> <li class="list-inline-item"><code class="notranslate">ferrari</code></li> <li class="list-inline-item"><code class="notranslate">ferrero</code></li> <li class="list-inline-item"><code class="notranslate">fiat</code></li> <li class="list-inline-item"><code class="notranslate">fidelity</code></li> <li class="list-inline-item"><code class="notranslate">firestone</code></li> <li class="list-inline-item"><code class="notranslate">firmdale</code></li> <li class="list-inline-item"><code class="notranslate">flickr</code></li> <li class="list-inline-item"><code class="notranslate">flir</code></li> <li class="list-inline-item"><code class="notranslate">flsmidth</code></li> <li class="list-inline-item"><code class="notranslate">ford</code></li> <li class="list-inline-item"><code class="notranslate">fox</code></li> <li class="list-inline-item"><code class="notranslate">fresenius</code></li> <li class="list-inline-item"><code class="notranslate">forex</code></li> <li class="list-inline-item"><code class="notranslate">frogans</code></li> <li class="list-inline-item"><code class="notranslate">frontier</code></li> <li class="list-inline-item"><code class="notranslate">fujitsu</code></li> <li class="list-inline-item"><code class="notranslate">fujixerox</code></li> <li class="list-inline-item"><code class="notranslate">gallo</code></li> <li class="list-inline-item"><code class="notranslate">gallup</code></li> <li class="list-inline-item"><code class="notranslate">gab</code></li> <li class="list-inline-item"><code class="notranslate">gbiz</code></li> <li class="list-inline-item"><code class="notranslate">gea</code></li> <li class="list-inline-item"><code class="notranslate">genting</code></li> <li class="list-inline-item"><code class="notranslate">giving</code></li> <li class="list-inline-item"><code class="notranslate">gle</code></li> <li class="list-inline-item"><code class="notranslate">globo</code></li> <li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li> <li class="list-inline-item"><code class="notranslate">gmx</code></li> <li class="list-inline-item"><code class="notranslate">godaddy</code></li> <li class="list-inline-item"><code class="notranslate">goldpoint</code></li> <li class="list-inline-item"><code class="notranslate">goodyear</code></li> <li class="list-inline-item"><code class="notranslate">goog</code></li> <li class="list-inline-item"><code class="notranslate">google</code></li> <li class="list-inline-item"><code class="notranslate">grainger</code></li> <li class="list-inline-item"><code class="notranslate">guardian</code></li> <li class="list-inline-item"><code class="notranslate">gucci</code></li> <li class="list-inline-item"><code class="notranslate">hbo</code></li> <li class="list-inline-item"><code class="notranslate">hdfc</code></li> <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li> <li class="list-inline-item"><code class="notranslate">hermes</code></li> <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li> <li class="list-inline-item"><code class="notranslate">hitachi</code></li> <li class="list-inline-item"><code class="notranslate">hkt</code></li> <li class="list-inline-item"><code class="notranslate">honda</code></li> <li class="list-inline-item"><code class="notranslate">honeywell</code></li> <li class="list-inline-item"><code class="notranslate">hotmail</code></li> <li class="list-inline-item"><code class="notranslate">hsbc</code></li> <li class="list-inline-item"><code class="notranslate">hughes</code></li> <li class="list-inline-item"><code class="notranslate">hyatt</code></li> <li class="list-inline-item"><code class="notranslate">hyundai</code></li> <li class="list-inline-item"><code class="notranslate">ibm</code></li> <li class="list-inline-item"><code class="notranslate">ieee</code></li> <li class="list-inline-item"><code class="notranslate">ifm</code></li> <li class="list-inline-item"><code class="notranslate">ikano</code></li> <li class="list-inline-item"><code class="notranslate">imdb</code></li> <li class="list-inline-item"><code class="notranslate">infiniti</code></li> <li class="list-inline-item"><code class="notranslate">intel</code></li> <li class="list-inline-item"><code class="notranslate">intuit</code></li> <li class="list-inline-item"><code class="notranslate">ipiranga</code></li> <li class="list-inline-item"><code class="notranslate">iselect</code></li> <li class="list-inline-item"><code class="notranslate">Italia</code></li> <li class="list-inline-item"><code class="notranslate">itv</code></li> <li class="list-inline-item"><code class="notranslate">iveco</code></li> <li class="list-inline-item"><code class="notranslate">jaguar</code></li> <li class="list-inline-item"><code class="notranslate">java</code></li> <li class="list-inline-item"><code class="notranslate">jcb</code></li> <li class="list-inline-item"><code class="notranslate">jcp</code></li> <li class="list-inline-item"><code class="notranslate">jeep</code></li> <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li> <li class="list-inline-item"><code class="notranslate">juniper</code></li> <li class="list-inline-item"><code class="notranslate">kddi</code></li> <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li> <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li> <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li> <li class="list-inline-item"><code class="notranslate">kfh</code></li> <li class="list-inline-item"><code class="notranslate">kia</code></li> <li class="list-inline-item"><code class="notranslate">kinder</code></li> <li class="list-inline-item"><code class="notranslate">kindle</code></li> <li class="list-inline-item"><code class="notranslate">komatsu</code></li> <li class="list-inline-item"><code class="notranslate">kpmg</code></li> <li class="list-inline-item"><code class="notranslate">kred</code></li> <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li> <li class="list-inline-item"><code class="notranslate">lacaixa</code></li> <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li> <li class="list-inline-item"><code class="notranslate">lamborghini</code></li> <li class="list-inline-item"><code class="notranslate">lancaster</code></li> <li class="list-inline-item"><code class="notranslate">lancia</code></li> <li class="list-inline-item"><code class="notranslate">lancome</code></li> <li class="list-inline-item"><code class="notranslate">landrover</code></li> <li class="list-inline-item"><code class="notranslate">lanxess</code></li> <li class="list-inline-item"><code class="notranslate">lasalle</code></li> <li class="list-inline-item"><code class="notranslate">latrobe</code></li> <li class="list-inline-item"><code class="notranslate">lds</code></li> <li class="list-inline-item"><code class="notranslate">leclerc</code></li> <li class="list-inline-item"><code class="notranslate">lego</code></li> <li class="list-inline-item"><code class="notranslate">liaison</code></li> <li class="list-inline-item"><code class="notranslate">lexus</code></li> <li class="list-inline-item"><code class="notranslate">lidl</code></li> <li class="list-inline-item"><code class="notranslate">livsstil</code></li> <li class="list-inline-item"><code class="notranslate">lilly</code></li> <li class="list-inline-item"><code class="notranslate">lincoln</code></li> <li class="list-inline-item"><code class="notranslate">linde</code></li> <li class="list-inline-item"><code class="notranslate">lipsy</code></li> <li class="list-inline-item"><code class="notranslate">lixil</code></li> <li class="list-inline-item"><code class="notranslate">locus</code></li> <li class="list-inline-item"><code class="notranslate">lotte</code></li> <li class="list-inline-item"><code class="notranslate">lpl</code></li> <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li> <li class="list-inline-item"><code class="notranslate">lundbeck</code></li> <li class="list-inline-item"><code class="notranslate">lupin</code></li> <li class="list-inline-item"><code class="notranslate">macys</code></li> <li class="list-inline-item"><code class="notranslate">maif</code></li> <li class="list-inline-item"><code class="notranslate">mand</code></li> <li class="list-inline-item"><code class="notranslate">mango</code></li> <li class="list-inline-item"><code class="notranslate">Marriott</code></li> <li class="list-inline-item"><code class="notranslate">Maserati</code></li> <li class="list-inline-item"><code class="notranslate">Mattel</code></li> <li class="list-inline-item"><code class="notranslate">McKinsey</code></li> <li class="list-inline-item"><code class="notranslate">MetLife</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> <li class="list-inline-item"><code class="notranslate">Mini</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> <li class="list-inline-item"><code class="notranslate">Microsoft</code></li> class="notranslate">mitsubishi</code></li> <li class="list-inline-item"><code class="notranslate">mlb</code></li> <li class="list-inline-item"><code class="notranslate">mma</code></li> <li class="list-inline-item"><code class="notranslate">monash</code></li> <li class="list-inline-item"><code class="notranslate">mormon</code></li> <li class="list-inline-item"><code class="notranslate">moto</code></li> <li class="list-inline-item"><code class="notranslate">movistar</code></li> <li class="list-inline-item"><code class="notranslate">msd</code></li> <li class="list-inline-item"><code class="notranslate">mtn</code></li> <li class="list-inline-item"><code class="notranslate">mtr</code></li> <li class="list-inline-item"><code class="notranslate">gensidig</code></li> <li class="list-inline-item"><code class="notranslate">nadex</code></li> <li class="list-inline-item"><code class="notranslate">landsdækkende</code></li> <li class="list-inline-item"><code class="notranslate">natura</code></ li> <li class="list-inline-item"><code class="notranslate">nba</code></li> <li class="list-inline-item"><code class="notranslate">nec</code></li> <li class="list-inline-item"><code class="notranslate">netflix</code></li> <li class="list-inline-item"><code class="notranslate">neustar</code></li> <li class="list-inline-item"><code class="notranslate">newholland</code></li> <li class="list-inline-item"><code class="notranslate">nfl</code></li> <li class="list-inline-item"><code class="notranslate">nhk</code></li> <li class="list-inline-item"><code class="notranslate">nico</code></li> <li class="list-inline-item"><code class="notranslate">nike</code></li> <li class="list-inline-item"><code class="notranslate">nikon</code></li> <li class="list-inline-item"><code class="notranslate">nissan</code></li> <li class="list-inline-item"><code class="notranslate">nissay</code></li> <li class="list-inline-item"><code class="notranslate">nokia</code></li> <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li> <li class="list-inline-item"><code class="notranslate">norton</code></li> <li class="list-inline-item"><code class="notranslate">nra</code></li> <li class="list-inline-item"><code class="notranslate">ntt</code></li> <li class="list-inline-item"><code class="notranslate">obi</code></li> <li class="list-inline-item"><code class="notranslate">office</code></li> <li class="list-inline-item"><code class="notranslate">omega</code></li> <li class="list-inline-item"><code class="notranslate">oracle</code></li> <li class="list-inline-item"><code class="notranslate">orange</code></li> <li class="list-inline-item"><code class="notranslate">otsuka</code></li> <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>--> <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
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
<li class="list-inline-item"><code class="notranslate">politi</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressiv</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li> <li class="list-inline-item"><code class="notranslate">pwc</code></li> <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>--> <li class="list-inline-item"><code class="notranslate">qvc</code></li> <li class="list-inline-item"><code class="notranslate">redstone</code></li> <li class="list-inline-item"><code class="notranslate">reliance</code></li> <li class="list-inline-item"><code class="notranslate">rexroth</code></li> <li class="list-inline-item"><code class="notranslate">ricoh</code></li> <li class="list-inline-item"><code class="notranslate">garanti</code></li> <li class="list-inline-item"><code class="notranslate">rocher</code></li> <li class="list-inline-item"><code class="notranslate">rogers</code></li> <li class="list-inline-item"><code class="notranslate">rwe</code></li> <li class="list-inline-item"><code class="notranslate">sikkerhed</code></li> <li class="list-inline-item"><code class="notranslate">sakura</code></li> <li class="list-inline-item"><code class="notranslate">samsung</code></li> <li class="list-inline-item"><code class="notranslate">sandvik</code></li> <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li> <li class="list-inline-item"><code class="notranslate">sanofi</code></li> <li class="list-inline-item"><code class="notranslate">sap</code></li> <li class="list-inline-item"><code class="notranslate">saxo</code></li> <li class="list-inline-item"><code class="notranslate">sbi</code></li> <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>--> <li class="list-inline-item"><code class="notranslate">sca</code></li> <li class="list-inline-item"><code class="notranslate">scb</code></li> <li class="list-inline-item"><code class="notranslate">Schaeffler</code></li> <li class="list-inline-item"><code class="notranslate">Schmidt</code></li> <li class="list-inline-item"><code class="notranslate">Schwarz</code></li> <li class="list-inline-item"><code class="notranslate">Schoolman</code></li> <li class="list-inline-item"><code class="notranslate">Scor</code></li> <li class="list-inline-item"><code class="notranslate">Sæde</code></li> <li class="list-inline-item"><code class="notranslate">Sener</code></li> <li class="list-inline-item"><code class="notranslate">Ses</code></li> <li class="list-inline-item"><code class="notranslate">sy</code></li> <li class="list-inline-item"><code class="notranslate">syv</code></li> <li class="list-inline-item"><code class="notranslate">sfr</code></li> <li class="list-inline-item"><code class="notranslate">søge</code></li> <li class="list-inline-item"><code class="notranslate">shangrila</code></li> <li class="list-inline-item"><code class="notranslate">skarp</code></li> <li class="list-inline-item"><code class="notranslate">shaw</code></li> <li class="list-inline-item"><code class="notranslate">skal</code></li> <li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li> <li class="list-inline-item"><code class="notranslate">sky</code></li> <li class="list-inline-item"><code class="notranslate">skype</code></li> <li class="list-inline-item"><code class="notranslate">smart</code></li> <li class="list-inline-item"><code class="notranslate">sncf</code></li> <li class="list-inline-item"><code class="notranslate">softbank</code></li> <li class="list-inline-item"><code class="notranslate">sohu</code></li> <li class="list-inline-item"><code class="notranslate">sony</code></li> <li class="list-inline-item"><code class="notranslate">Spejl</code></li> <li class="list-inline-item"><code class="notranslate">Stada</code></li> <li class="list-inline-item"><code class="notranslate">Hæfteklammer</code></li> <li class="list-inline-item"><code class="notranslate">Star</code></li> <li class="list-inline-item"><code class="notranslate">Starhub</code></li> <li class="list-inline-item"><code class="notranslate">Statebank</code></li> <li class="list-inline-item"><code class="notranslate">StateFarm</code></li> <li class="list-inline-item"><code class="notranslate">Statoil</code></li> <li class="list-inline-item"><code class="notranslate">stc</code></li> <li class="list-inline-item"><code class="notranslate">stcgroup</code></li> <li class="list-inline-item"><code class="notranslate">suzuki</code></li> <li class="list-inline-item"><code class="notranslate">swatch</code></li> <li class="list-inline-item"><code class="notranslate">swintcover</code></li> <li class="list-inline-item"><code class="notranslate">symantec</code></li> <li class="list-inline-item"><code class="notranslate">taobao</code></li> <li class="list-inline-item"><code class="notranslate">target</code></li> <li class="list-inline-item"><code class="notranslate">tatamotors</code></li> <li class="list-inline-item"><code class="notranslate">tdk</code></li> <li class="list-inline-item"><code class="notranslate">telecity</code></li> <li class="list-inline-item"><code class="notranslate">telefonica</code></li> <li class="list-inline-item"><code class="notranslate">temasek</code></li> <li class="list-inline-item"><code class="notranslate">teva</code></li> <li class="list-inline-item"><code class="notranslate">tiffany</code></li> <li class="list-inline-item"><code class="notranslate">tjx</code></li> <li class="list-inline-item"><code class="notranslate">Toray</code></li> <li class="list-inline-item"><code class="notranslate">Toshiba</code></li> <li class="list-inline-item"><code class="notranslate">total</code></li> <li class="list-inline-item"><code class="notranslate">Toyota</code></li> <li class="list-inline-item"><code class="notranslate">rejsende</code></li> <li class="list-inline-item"><code class="notranslate">tui</code></li> <li class="list-inline-item"><code class="notranslate">tv'er</code></li> <li class="list-inline-item"><code class="notranslate">tv'er</code></li> class="notranslate">ubs</code></li> <li class="list-inline-item"><code class="notranslate">unicom</code></li> <li class="list-inline-item"><code class="notranslate">uol</code></li> <li class="list-inline-item"><code class="notranslate">ups</code></li> <li class="list-inline-item"><code class="notranslate">vanguard</code></li> <li class="list-inline-item"><code class="notranslate">verisign</code></li> <li class="list-inline-item"><code class="notranslate">vig</code></li> <li class="list-inline-item"><code class="notranslate">viking</code></li> <li class="list-inline-item"><code class="notranslate">jomfru</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li> <li class="list-inline-item"><code class="notranslate">vista</code></li> <li class="list-inline-item"><code class="notranslate">vistaprint</code></li> <li class="list-inline-item"><code class="notranslate">vivo</code></li> <li class="list-inline-item"><code class="notranslate">volvo</code></li> <li class="list-inline-item"><code class="notranslate">walmart</code></li> <li class="list-inline-item"><code class="notranslate">walter</code></li> <li class="list-inline-item"><code class="notranslate">vejrkanal</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">dæmningsværk</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">windows</code></li>
<li class="list-inline-item"><code class="notranslate">wme</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">woodside</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li> <li class="list-inline-item"><code class="notranslate">xbox</code></li> <li class="list-inline-item"><code class="notranslate">xerox</code></li> <li class="list-inline-item"><code class="notranslate">xfinity</code></li> <li class="list-inline-item"><code class="notranslate">yahoo</code></li> <li class="list-inline-item"><code class="notranslate">yamaxun</code></li> <li class="list-inline-item"><code class="notranslate">yandex</code></li> <li class="list-inline-item"><code class="notranslate">yodobashi</code></li> <li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

Fra den 18. marts 2025 har vi også tilføjet disse franske oversøiske territorier til denne liste ([efter denne GitHub-anmodning](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">bzh</code></li> <li class="list-inline-item"><code class="notranslate">gf</code></li> <li class="list-inline-item"><code class="notranslate">gp</code></li> <li class="list-inline-item"><code class="notranslate">mq</code></li> <li class="list-inline-item"><code class="notranslate">nc</code></li> <li class="list-inline-item"><code class="notranslate">pf</code></li> <li class="list-inline-item"><code class="notranslate">pm</code></li> <li class="list-inline-item"><code class="notranslate">re</code></li> <li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Fra den 8. juli 2025 har vi tilføjet disse Europa-specifikke lande:

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">ax</code></li> <li class="list-inline-item"><code class="notranslate">bg</code></li> <li class="list-inline-item"><code class="notranslate">fo</code></li> <li class="list-inline-item"><code class="notranslate">gi</code></li> <li class="list-inline-item"><code class="notranslate">gr</code></li> <li class="list-inline-item"><code class="notranslate">hr</code></li> <li class="list-inline-item"><code class="notranslate">hu</code></li> <li class="list-inline-item"><code class="notranslate">lt</code></li> <li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Vi har specifikt ikke inkluderet `cz`, `ru` og `ua` på grund af høj spamaktivitet.

### Hvad er dine kriterier for tilladelseslisten {#what-is-your-allowlist-criteria}

Vi har en statisk liste over [domænenavnsudvidelser er som standard tilladt på listen](#what-domain-name-extensions-are-allowlisted-by-default) – og vi vedligeholder også en dynamisk, cachelagret, rullende tilladelsesliste baseret på følgende strenge kriterier:

* Afsenderens roddomæne skal være af typen [domænenavnsudvidelse, der matcher den liste, vi tilbyder på vores gratisplan](#what-domain-name-extensions-can-be-used-for-free) (med tilføjelsen af `biz` og `info`). Vi inkluderer også delvise matches af `edu`, `gov` og `mil`, såsom `xyz.gov.au` og `xyz.edu.au`.

* Afsenderens roddomæne skal være blandt de 100.000 unikke roddomæner, der er parset i resultaterne fra [Paraply Popularitetsliste](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").

* Afsenderens roddomæne skal være blandt de 50.000 unikke roddomæner, der optræder i mindst 4 af de seneste 7 dages UPL'er (\~50%+).

* Afsenderens roddomæne må ikke være [kategoriseret](https://radar.cloudflare.com/categorization-feedback/) markeret som voksenindhold eller malware af Cloudflare.

* Afsenderens roddomæne skal have enten A- eller MX-poster angivet.

* Afsenderens roddomæne skal have enten A-post(er), MX-post(er), DMARC-post med `p=reject` eller `p=quarantine`, eller en SPF-post med kvalifikator `-all` eller `~all`.

Hvis dette kriterium er opfyldt, vil afsenderens roddomæne blive cachelagret i 7 dage. Bemærk, at vores automatiserede job kører dagligt – derfor er dette en rullende tilladelseslistecache, der opdateres dagligt.

Vores automatiserede job vil downloade de foregående 7 dages UPL'er i hukommelsen, udpakke dem og derefter analysere hukommelsen i henhold til de strenge kriterier ovenfor.

Populære domæner på tidspunktet for denne skrivning, såsom Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify og flere – er naturligvis inkluderet.

Hvis du er en afsender, der ikke er på vores tilladelsesliste, vil du blive [begrænset sats](#do-you-have-rate-limiting) og [grålistet](#do-you-have-a-greylist) første gang dit FQDN-roddomæne eller din IP-adresse sender en e-mail. Bemærk, at dette er standardpraksis, der er vedtaget som en e-mailstandard. De fleste e-mailserverklienter vil forsøge at prøve igen, hvis de modtager en hastighedsgrænse- eller grålistefejl (f.eks. en fejlstatuskode på niveau 421 eller 4xx).

**Bemærk at specifikke afsendere som `a@gmail.com`, `b@xyz.edu` og `c@gov.au` stadig kan være [afvist](#do-you-have-a-denylist)** (f.eks. hvis vi automatisk registrerer spam, phishing eller malware fra disse afsendere).**

### Hvilke domænenavnsudvidelser kan bruges gratis {#what-domain-name-extensions-can-be-used-for-free}

Fra den 31. marts 2023 har vi håndhævet en ny generel spamregel for at beskytte vores brugere og tjeneste.

Denne nye regel tillader kun brug af følgende domænenavnsudvidelser på vores gratis abonnement:

<ul class="list-inline"> <li class="list-inline-item"><code class="notranslate">ac</code></li> <li class="list-inline-item"><code class="notranslate">annonce</code></li> <li class="list-inline-item"><code class="notranslate">ag</code></li> <li class="list-inline-item"><code class="notranslate">ai</code></li> <li class="list-inline-item"><code class="notranslate">al</code></li> <li class="list-inline-item"><code class="notranslate">am</code></li> <li class="list-inline-item"><code class="notranslate">app</code></li> <li class="list-inline-item"><code class="notranslate">as</code></li> <li class="list-inline-item"><code class="notranslate">ved</code></li> <li class="list-inline-item"><code class="notranslate">au</code></li> <li class="list-inline-item"><code class="notranslate">ba</code></li> <li class="list-inline-item"><code class="notranslate">være</code></li> <li class="list-inline-item"><code class="notranslate">br</code></li> <li class="list-inline-item"><code class="notranslate">af</code></li> <li class="list-inline-item"><code class="notranslate">ca</code></li> <li class="list-inline-item"><code class="notranslate">cc</code></li> <li class="list-inline-item"><code class="notranslate">cd</code></li> <li class="list-inline-item"><code class="notranslate">ch</code></li> <li class="list-inline-item"><code class="notranslate">ck</code></li> <li class="list-inline-item"><code class="notranslate">co</code></li> <li class="list-inline-item"><code class="notranslate">com</code></li> <li class="list-inline-item"><code class="notranslate">de</code></li> <li class="list-inline-item"><code class="notranslate">dev</code></li> <li class="list-inline-item"><code class="notranslate">dj</code></li> <li class="list-inline-item"><code class="notranslate">dk</code></li> <li class="list-inline-item"><code class="notranslate">ee</code></li> <li class="list-inline-item"><code class="notranslate">es</code></li> <li class="list-inline-item"><code class="notranslate">eu</code></li> <li class="list-inline-item"><code class="notranslate">family</code></li> <li class="list-inline-item"><code class="notranslate">fi</code></li> <li class="list-inline-item"><code class="notranslate">fm</code></li> <li class="list-inline-item"><code class="notranslate">fr</code></li> <li class="list-inline-item"><code class="notranslate">gg</code></li> <li class="list-inline-item"><code class="notranslate">gl</code></li> <li class="list-inline-item"><code class="notranslate">id</code></li> <li class="list-inline-item"><code class="notranslate">ie</code></li> <li class="list-inline-item"><code class="notranslate">il</code></li> <li class="list-inline-item"><code class="notranslate">im</code></li> <li class="list-inline-item"><code class="notranslate">in</code></li> <li class="list-inline-item"><code class="notranslate">io</code></li> <li class="list-inline-item"><code class="notranslate">ir</code></li> <li class="list-inline-item"><code class="notranslate">er</code></li> <li class="list-inline-item"><code class="notranslate">det</code></li> <li class="list-inline-item"><code class="notranslate">je</code></li> <li class="list-inline-item"><code class="notranslate">jp</code></li> <li class="list-inline-item"><code class="notranslate">ke</code></li> <li class="list-inline-item"><code class="notranslate">kr</code></li> <li class="list-inline-item"><code class="notranslate">la</code></li> <li class="list-inline-item"><code class="notranslate">li</code></li> <li class="list-inline-item"><code class="notranslate">lv</code></li> <li class="list-inline-item"><code class="notranslate">ly</code></li> <li class="list-inline-item"><code class="notranslate">md</code></li> <li class="list-inline-item"><code class="notranslate">mig</code></li> <li class="list-inline-item"><code class="notranslate">mn</code></li> <li class="list-inline-item"><code class="notranslate">ms</code></li> <li class="list-inline-item"><code class="notranslate">mu</code></li> <li class="list-inline-item"><code class="notranslate">mx</code></li> <li class="list-inline-item"><code class="notranslate">net</code></li> <li class="list-inline-item"><code class="notranslate">ni</code></li> <li class="list-inline-item"><code class="notranslate">nl</code></li> <li class="list-inline-item"><code class="notranslate">nej</code></li> <li class="list-inline-item"><code class="notranslate">nu</code></li> <li class="list-inline-item"><code class="notranslate">nz</code></li> <li class="list-inline-item"><code class="notranslate">org</code></li> <li class="list-inline-item"><code class="notranslate">pl</code></li> <li class="list-inline-item"><code class="notranslate">pr</code></li> <li class="list-inline-item"><code class="notranslate">pt</code></li> <li class="list-inline-item"><code class="notranslate">pw</code></li> <li class="list-inline-item"><code class="notranslate">rs</code></li> <li class="list-inline-item"><code class="notranslate">sc</code></li> <li class="list-inline-item"><code class="notranslate">se</code></li> <li class="list-inline-item"><code class="notranslate">sh</code></li> <li class="list-inline-item"><code class="notranslate">si</code></li> <li class="list-inline-item"><code class="notranslate">sm</code></li> <li class="list-inline-item"><code class="notranslate">sr</code></li> <li class="list-inline-item"><code class="notranslate">st</code></li> <li class="list-inline-item"><code class="notranslate">tc</code></li> <li class="list-inline-item"><code class="notranslate">tm</code></li> <li class="list-inline-item"><code class="notranslate">til</code></li> <li class="list-inline-item"><code class="notranslate">tv</code></li> <li class="list-inline-item"><code class="notranslate">uk</code></li> <li class="list-inline-item"><code class="notranslate">us</code></li> <li class="list-inline-item"><code class="notranslate">uz</code></li> <li class="list-inline-item"><code class="notranslate">vc</code></li> <li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Har du en gråliste {#do-you-have-a-greylist}

Ja, vi har en meget lempelig [e-mail gråliste](https://en.wikipedia.org/wiki/Greylisting_\(email\)) politik. Grålistning gælder kun for afsendere, der ikke er på vores tilladelsesliste, og gemmes i vores cache i 30 dage.

For enhver ny afsender gemmer vi en nøgle i vores Redis-database i 30 dage med en værdi sat til det oprindelige ankomsttidspunkt for deres første anmodning. Vi afviser derefter deres e-mail med en statuskode for gentagelse på 450 og tillader den først at passere, når der er gået 5 minutter.

Hvis de har ventet i 5 minutter fra dette oprindelige ankomsttidspunkt, vil deres e-mails blive accepteret, og de vil ikke modtage denne 450-statuskode.

Nøglen består enten af FQDN-roddomænet eller afsenderens IP-adresse. Det betyder, at ethvert underdomæne, der passerer grålisten, også vil passere for roddomænet, og omvendt (dette er, hvad vi mener med en "meget lempelig" politik).

Hvis for eksempel en e-mail kommer fra `test.example.com`, før vi ser en e-mail komme fra `example.com`, så skal enhver e-mail fra `test.example.com` og/eller `example.com` vente 5 minutter fra forbindelsens oprindelige ankomsttidspunkt. Vi lader ikke både `test.example.com` og `example.com` vente hver deres 5-minutters periode (vores grålistningspolitik gælder på roddomæneniveau).

Bemærk, at grålistning ikke gælder for nogen afsendere på vores [tilladelsesliste](#do-you-have-an-allowlist) (f.eks. Meta, Amazon, Netflix, Google, Microsoft på tidspunktet for denne skrivning).

### Har du en afvisningsliste {#do-you-have-a-denylist}

Ja, vi driver vores egen afvisningsliste og opdaterer den automatisk i realtid og manuelt baseret på spam og ondsindet aktivitet, der opdages.

Vi henter også alle IP-adresser fra UCEPROTECT Level 1-afvisningslisten på <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> hver time og indsætter dem i vores afvisningsliste med en udløbsdato på 7 dage.

Afsendere, der findes på afvisningslisten, vil modtage en 421-fejlkode (indikerer, at afsenderen skal prøve igen senere), hvis de [er ikke på tilladelseslisten](#do-you-have-an-allowlist).

Ved at bruge en 421-statuskode i stedet for en 554-statuskode kan potentielle falske positiver afhjælpes i realtid, og derefter kan beskeden leveres ved næste forsøg.

**Dette er designet i modsætning til andre mailtjenester**, hvor der opstår en permanent fejl, hvis du bliver sat på en blokeringsliste. Det er ofte vanskeligt at bede afsendere om at forsøge at sende beskeder igen (især fra store organisationer), og derfor giver denne tilgang cirka 5 dage fra det første forsøg på at sende en e-mail, så enten afsenderen, modtageren eller vi kan gribe ind og afhjælpe problemet (ved at anmode om fjernelse af afvisningslisten).

Alle anmodninger om fjernelse fra afvisningslister overvåges i realtid af administratorer (f.eks. så tilbagevendende falske positiver permanent kan sættes på godkendelseslisten af administratorer).

Anmodninger om fjernelse af afvisningslister kan anmodes på <https://forwardemail.net/denylist>. Betalende brugeres anmodninger om fjernelse af afvisningslister behandles øjeblikkeligt, mens ikke-betalende brugere skal vente på, at administratorer behandler deres anmodning.

Afsendere, der registreres som værende i færd med at sende spam eller virusindhold, vil blive føjet til afvisningslisten på følgende måde:

1. [fingeraftryk fra den første besked](#how-do-you-determine-an-email-fingerprint) grålistes ved detektion af spam eller blokeringsliste fra en "betroet" afsender (f.eks. `gmail.com`, `microsoft.com`, `apple.com`).
* Hvis afsenderen var på tilladelseslisten, grålistes beskeden i 1 time.
* Hvis afsenderen ikke er på tilladelseslisten, grålistes beskeden i 6 timer.

2. Vi analyserer afvisningslistenøgler fra information fra afsenderen og beskeden, og for hver af disse nøgler opretter vi (hvis en ikke allerede findes) en tæller, øger den med 1 og cacher den i 24 timer.
* For afsendere på tilladelseslisten:
* Tilføj en nøgle til e-mailadressen "MAIL FROM" i kuverten, hvis den havde eller ingen SPF, og den ikke var [et postmaster brugernavn](#what-are-postmaster-addresses) eller [et ikke-svar brugernavn](#what-are-no-reply-addresses).
* Hvis "Fra"-headeren var på tilladelseslisten, skal du tilføje en nøgle til e-mailadressen i "Fra"-headeren, hvis den havde SPF eller DKIM, der blev justeret.

* Hvis "Fra"-headeren ikke var på tilladelseslisten, skal du tilføje en nøgle til e-mailadressen i "Fra"-headeren og dens rodparsede domænenavn.
* For afsendere, der ikke er på tilladelseslisten:
* Tilføj en nøgle til e-mailadressen i kuverten "MAIL FROM", hvis den havde SPF.
* Hvis "Fra"-headeren var på tilladelseslisten, skal du tilføje en nøgle til e-mailadressen i "Fra"-headeren, hvis den havde SPF, der blev justeret og DKIM.

* Hvis "Fra"-headeren ikke var på tilladelseslisten, skal du tilføje en nøgle til e-mailadressen i "Fra"-headeren og dens rodparsede domænenavn.
* Tilføj en nøgle til afsenderens eksterne IP-adresse.
* Tilføj en nøgle til klientens løste værtsnavn ved omvendt opslag fra afsenderens IP-adresse (hvis relevant).
* Tilføj en nøgle til roddomænet for klientens løste værtsnavn (hvis relevant, og hvis det adskiller sig fra klientens løste værtsnavn).
3. Hvis tælleren når 5 for en afsender og nøgle, der ikke er på tilladelseslisten, afviser vi nøglen i 30 dage, og der sendes en e-mail til vores misbrugsteam. Disse tal kan ændres, og opdateringer vil blive afspejlet her, mens vi overvåger misbrug.

4. Hvis tælleren når 10 for en afsender og nøgle på tilladelseslisten, afviser vi nøglen i 7 dage, og der sendes en e-mail til vores misbrugsteam. Disse tal kan ændres, og opdateringer vil blive afspejlet her, mens vi overvåger misbrug.

> **BEMÆRK:** I den nærmeste fremtid vil vi introducere omdømmeovervågning. Omdømmeovervågning vil i stedet beregne, hvornår en afsender skal afvises, baseret på en procenttærskel (i modsætning til en rudimentær tæller som nævnt ovenfor).

### Har du en hastighedsbegrænsning {#do-you-have-rate-limiting}

Begrænsning af afsenderhastighed sker enten via roddomænet, der er parset fra et omvendt PTR-opslag på afsenderens IP-adresse – eller hvis det ikke giver et resultat, bruger den blot afsenderens IP-adresse. Bemærk, at vi refererer til dette som `Sender` nedenfor.

Vores MX-servere har daglige grænser for indgående mail modtaget for [krypteret IMAP-lagring](/blog/docs/best-quantum-safe-encrypted-email-service):

* I stedet for at begrænse hastigheden for indgående mail modtaget på individuelt alias (f.eks. `you@yourdomain.com`) – begrænser vi hastigheden ud fra selve aliasets domænenavn (f.eks. `yourdomain.com`). Dette forhindrer `Senders` i at oversvømme indbakkerne for alle aliasser på tværs af dit domæne på én gang.

* Vi har generelle grænser, der gælder for alle `Senders` på tværs af vores tjeneste, uanset modtager:

* `Senders`, som vi anser for at være "betroede" som en kilde til sandhed (f.eks. `gmail.com`, `microsoft.com`, `apple.com`), er begrænset til at sende 100 GB pr. dag.

* `Senders`, der er [tilladt på listen](#do-you-have-an-allowlist), er begrænset til at sende 10 GB pr. dag.
* Alle andre `Senders` er begrænset til at sende 1 GB og/eller 1000 beskeder pr. dag.
* Vi har en specifik grænse pr. `Sender` og `yourdomain.com` på 1 GB og/eller 1000 beskeder dagligt.

MX-serverne begrænser også videresendelse af beskeder til en eller flere modtagere gennem hastighedsbegrænsning – men dette gælder kun for `Senders`, der ikke er på [tilladelsesliste](#do-you-have-an-allowlist):

* Vi tillader kun op til 100 forbindelser i timen, pr. `Sender` opløst FQDN-roddomæne (eller) `Sender` fjern-IP-adresse (hvis ingen omvendt PTR er tilgængelig) og pr. kuvertmodtager. Vi gemmer nøglen til hastighedsbegrænsning som en kryptografisk hash i vores Redis-database.

* Hvis du sender e-mails via vores system, skal du sørge for at have en omvendt PTR konfigureret for alle dine IP-adresser (ellers vil hvert unikke FQDN-roddomæne eller IP-adresse, du sender fra, være hastighedsbegrænset).

* Bemærk, at hvis du sender via et populært system som Amazon SES, vil du ikke være takstbegrænset, da Amazon SES (på tidspunktet for denne skrivning) er opført på vores tilladelsesliste.

* Hvis du sender fra et domæne som `test.abc.123.example.com`, vil hastighedsgrænsen blive pålagt `example.com`. Mange spammere bruger hundredvis af underdomæner til at omgå almindelige spamfiltre, der kun hastighedsbegrænser unikke værtsnavne i modsætning til unikke FQDN-roddomæner.

* `Senders`, der overskrider hastighedsgrænsen, vil blive afvist med en 421-fejl.

Vores IMAP- og SMTP-servere begrænser dine aliasser fra at have mere end `60` samtidige forbindelser på én gang.

Vores MX-servere begrænser [ikke på tilladelseslisten](#do-you-have-an-allowlist) afsendere fra at oprette mere end 10 samtidige forbindelser (med en cacheudløbstid på 3 minutter for tælleren, hvilket afspejler vores socket-timeout på 3 minutter).

### Hvordan beskytter du mod backscatter {#how-do-you-protect-against-backscatter}

Fejladresserede afvisninger eller afvisningsspam (kendt som "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") kan forårsage et negativt omdømme for afsenderens IP-adresser.

Vi tager to skridt for at beskytte mod tilbagespredning, hvilket er beskrevet i de følgende afsnit [Forhindr afvisninger fra kendte spammere af MAIL FRA](#prevent-bounces-from-known-mail-from-spammers) og [Forhindr unødvendige bounces for at beskytte mod backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) nedenfor.

### Forhindrer afvisninger fra kendte MAIL FRA spammere {#prevent-bounces-from-known-mail-from-spammers}

Vi henter listen fra [Backscatter.org](https://www.backscatterer.org/) (leveret af [UCEPROTECT](https://www.uceprotect.net/)) på <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> hver time og indtaster den i vores Redis-database (vi sammenligner også forskellen på forhånd; i tilfælde af at der er fjernet IP-adresser, der skal respekteres).

Hvis MAIL FROM er tom ELLER er lig med (uafhængig af store og små bogstaver) en af [postmester adresser](#what-are-postmaster-addresses) (delen før @ i en e-mail), kontrollerer vi, om afsenderens IP-adresse matcher en fra denne liste.

Hvis afsenderens IP-adresse er angivet (og ikke i vores [tilladelsesliste](#do-you-have-an-allowlist)), sender vi en 554-fejl med meddelelsen `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Vi får besked, hvis en afsender er på både Backscatterer-listen og på vores tilladelsesliste, så vi kan løse problemet, hvis det er nødvendigt.

Teknikkerne beskrevet i dette afsnit overholder anbefalingen "SAFE MODE" på <https://www.backscatterer.org/?target=usage> – hvor vi kun kontrollerer afsenderens IP-adresse, hvis visse betingelser allerede er opfyldt.

### Forhindr unødvendige bounces for at beskytte mod backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Afviste e-mails er e-mails, der indikerer, at videresendelse af e-mails til modtageren mislykkedes fuldstændigt, og at e-mailen ikke vil blive forsøgt igen.

En almindelig årsag til at blive opført på Backscatterer-listen er fejladresserede bounces eller bounce spam, så vi skal beskytte os mod dette på et par måder:

1. Vi sender kun, når der opstår >= 500 statuskodefejl (når e-mails, der er forsøgt videresendt, mislykkedes, f.eks. hvis Gmail svarer med en fejl på niveau 500).

2. Vi sender kun én gang (vi bruger en beregnet nøgle til et afvist fingeraftryk og gemmer den i cachen for at forhindre afsendelse af dubletter). Afvist fingeraftrykket er en nøgle, der er beskedens fingeraftryk kombineret med en hash af afvist adressen og dens fejlkode). Se afsnittet om [Fingeraftryk](#how-do-you-determine-an-email-fingerprint) for mere indsigt i, hvordan beskedens fingeraftryk beregnes. Vellykket sendte afviste fingeraftryk udløber efter 7 dage i vores Redis-cache.

3. Vi sender kun, når MAIL FROM og/eller From ikke er blanke og ikke indeholder (ikke-sanskel) en [postmaster brugernavn](#what-are-postmaster-addresses) (delen før @ i en e-mail).

4. Vi sender ikke, hvis den oprindelige besked havde en af følgende overskrifter (ikke store og små bogstaver):

* Header af `auto-submitted` med en værdi, der ikke er lig med `no`. * Header af `x-auto-response-suppress` med en værdi af `dr`, `autoreply`, `auto-reply`, `auto_reply` eller `all`
* Header af `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` eller `x-auto-respond` (uanset værdi).
* Header af `precedence` med en værdi af `bulk`, `autoreply`, `auto-reply`, `auto_reply` eller `list`.

5. Vi sender ikke, hvis MAIL FROM- eller Fra-e-mailadressen slutter med `+donotreply`, `-donotreply`, `+noreply` eller `-noreply`.

6. Vi sender ikke, hvis den del af Fra-e-mailadressen med brugernavnet var `mdaemon` og den havde en header på `X-MDDSN-Message`, der ikke skelner mellem store og små bogstaver.

7. Vi sender ikke, hvis der var en `content-type` header i `multipart/report`, hvor der ikke skelnes mellem store og små bogstaver.

### Hvordan bestemmer man et e-mail-fingeraftryk {#how-do-you-determine-an-email-fingerprint}

En e-mails fingeraftryk bruges til at bestemme en e-mails unikhed og til at forhindre, at dubletter leveres, og at [duplikerede afvisninger](#prevent-unnecessary-bounces-to-protect-against-backscatter) sendes.

Fingeraftrykket beregnes ud fra følgende liste:

* Klientens FQDN-værtsnavn eller IP-adresse er løst
* `Message-ID` headerværdi (hvis relevant)
* `Date` headerværdi (hvis relevant)
* `From` headerværdi (hvis relevant)
* `To` headerværdi (hvis relevant)
* `Cc` headerværdi (hvis relevant)
* `Subject` headerværdi (hvis relevant)
* `Body` værdi (hvis relevant)

### Kan jeg videresende e-mails til andre porte end 25 (f.eks. hvis min internetudbyder har blokeret port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ja, fra den 5. maj 2020 har vi tilføjet denne funktion. Lige nu er funktionen domænespecifik i modsætning til aliasspecifik. Hvis du ønsker, at den skal være aliasspecifik, bedes du kontakte os for at fortælle os om dine behov.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Forbedret privatlivsbeskyttelse:
</strong>
<span>
Hvis du har et betalt abonnement (som inkluderer forbedret privatlivsbeskyttelse), skal du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a>, klikke på "Opsætning" ud for dit domæne og derefter klikke på "Indstillinger". Hvis du vil vide mere om betalte abonnementer, kan du se vores <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Pris</a>-side. Ellers kan du fortsætte med at følge instruktionerne nedenfor.
</span>
</div>

Hvis du har gratisabonnementet, skal du blot tilføje en ny DNS-<strong class="notranslate">TXT</strong>-post som vist nedenfor, men ændre porten fra 25 til den port, du ønsker.

For eksempel, hvis jeg vil have, at alle e-mails, der går til `example.com`, videresendes til aliasmodtagernes SMTP-port på 1337 i stedet for 25:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email-port=1337</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Det mest almindelige scenarie for opsætning af brugerdefineret portvideresendelse er, når du vil videresende alle e-mails, der går til example.com, til en anden port på example.com, end SMTP-standarden på port 25. For at konfigurere dette skal du blot tilføje følgende <strong class="notranslate">TXT</strong> catch-all-post.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=example.com</code></td> </tr> </tbody>
</table>

### Understøtter den plustegnet + for Gmail-aliasser {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ja, absolut.

### Understøtter den underdomæner {#does-it-support-sub-domains}

Ja, absolut. I stedet for at bruge "@", "." eller blank som navn/vært/alias, bruger du bare underdomænenavnet som værdi i stedet.

Hvis du vil have `foo.example.com` til at videresende e-mails, skal du indtaste `foo` som navn/vært/alias-værdi i dine DNS-indstillinger (for både MX- og <strong class="notranslate">TXT</strong>-poster).

### Videresender dette mine e-mails headere {#does-this-forward-my-emails-headers}

Ja, absolut.

### Er dette velafprøvet {#is-this-well-tested}

Ja, den har tests skrevet med [ava](https://github.com/avajs/ava) og har også kodedækning.

### Videregiver du SMTP-svarbeskeder og -koder? {#do-you-pass-along-smtp-response-messages-and-codes}

Ja, absolut. Hvis du for eksempel sender en e-mail til `hello@example.com`, og den er registreret til at videresende til `user@gmail.com`, så returneres SMTP-svarmeddelelsen og koden fra SMTP-serveren "gmail.com" i stedet for proxyserveren på "mx1.forwardemail.net" eller "mx2.forwardemail.net".

### Hvordan forhindrer du spammere og sikrer et godt omdømme for videresendelse af e-mails {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Se vores afsnit om [Hvordan fungerer jeres system til videresendelse af e-mails](#how-does-your-email-forwarding-system-work), [Hvordan håndterer du problemer med e-maillevering](#how-do-you-handle-email-delivery-issues) og [Hvordan håndterer du blokering af dine IP-adresser](#how-do-you-handle-your-ip-addresses-becoming-blocked) ovenfor.

### Hvordan udfører du DNS-opslag på domænenavne {#how-do-you-perform-dns-lookups-on-domain-names}

Vi har oprettet et open source-softwareprojekt :tangerine: [Mandarin](https://github.com/forwardemail/tangerine) og bruger det til DNS-opslag. Standard-DNS-serverne, der bruges, er `1.1.1.1` og `1.0.0.1`, og DNS-forespørgsler går via [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") på applikationslaget.

:tangerine: [Mandarin](https://github.com/tangerine) bruger [CloudFlares privatlivsfokuserede forbruger-DNS-tjeneste som standard][cloudflare-dns].

## Konto og fakturering {#account-and-billing}

### Tilbyder I en pengene-tilbage-garanti på betalte abonnementer? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ja! Automatiske refusioner sker, når du opgraderer, nedgraderer eller annullerer din konto inden for 30 dage fra, hvornår dit abonnement først startede. Dette gælder kun for førstegangskunder.

### Hvis jeg skifter abonnement, betaler I så forholdsmæssigt og refunderer differencen? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Vi hverken forholdsmæssigt beregner eller refunderer differencen, når du skifter abonnement. I stedet konverterer vi den resterende varighed fra din eksisterende plans udløbsdato til den nærmeste relative varighed for din nye plan (rundet ned efter måned).

Bemærk, at hvis du opgraderer eller nedgraderer mellem betalte abonnementer inden for et vindue på 30 dage siden du startede et betalt abonnement, refunderer vi automatisk det fulde beløb fra dit eksisterende abonnement.

### Kan jeg bare bruge denne e-mail-videresendelsestjeneste som en "fallback" eller "fallover" MX-server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nej, det anbefales ikke, da du kun kan bruge én mail exchange-server ad gangen. Fallbacks forsøges normalt aldrig igen på grund af fejlkonfigurationer i prioritet og mailservere, der ikke respekterer MX exchange-prioritetskontrol.

### Kan jeg deaktivere specifikke aliasser {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du har et betalt abonnement, skal du gå til <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliaser <i class="fa fa-angle-right"></i> Rediger alias <i class="fa fa-angle-right"></i> Fjern markeringen i afkrydsningsfeltet "Aktiv" <i class="fa fa-angle-right"></i> Fortsæt.
</span>
</div>

Ja, du skal blot redigere din DNS-<strong class="notranslate">TXT</strong>-post og sætte enten et, to eller tre udråbstegn foran aliaset (se nedenfor).

Bemærk at du *bør* bevare ":"-tilknytningen, da dette er påkrævet, hvis du nogensinde beslutter dig for at slå det fra (og det bruges også til import, hvis du opgraderer til et af vores betalte abonnementer).

**Ved stille afvisning (ser ud til afsenderen, som om beskeden blev sendt, men fører faktisk ingen vegne) (statuskode `250`):** Hvis du sætter "!" (et enkelt udråbstegn) foran et alias, returneres statuskoden `250` til afsendere, der forsøger at sende til denne adresse, men selve e-mailsene fører ingen vegne (f.eks. et sort hul eller `/dev/null`).

**Ved blød afvisning (statuskode `421`):** Hvis du sætter "!!" (dobbelt udråbstegn) foran et alias, returneres en blød fejlkode på `421` til afsendere, der forsøger at sende til denne adresse, og e-mails vil ofte blive forsøgt at sende igen i op til 5 dage, før de afvises og returneres.

**Ved fuldstændig afvisning (statuskode `550`):** Hvis du sætter "!!!" (tredobbelt udråbstegn) foran et alias, returneres en permanent fejlstatuskode på `550` til afsendere, der forsøger at sende til denne adresse, og e-mails vil blive afvist og returneret.

For eksempel, hvis jeg ønsker, at alle e-mails, der går til `alias@example.com`, skal stoppe med at flyde videre til `user@gmail.com` og blive afvist og returneret (f.eks. brug tre udråbstegn):

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias:bruger@gmail.com</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Du kan også omskrive den videresendte modtagers adresse til blot "nobody@forwardemail.net", hvilket vil sende den til nobody som i eksemplet nedenfor.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td> </tr> </tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Hvis du ønsker øget sikkerhed, kan du også fjerne ":user@gmail.com" (eller ":nobody@forwardemail.net")-delen, så kun "!!!alias" står tilbage, som i eksemplet nedenfor.
</span>
</div>

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=!!!alias</code></td> </tr> </tbody>
</table>

### Kan jeg videresende e-mails til flere modtagere {#can-i-forward-emails-to-multiple-recipients}

Ja, absolut. Angiv blot flere modtagere i dine <strong class="notranslate">TXT</strong>-poster.

Hvis jeg for eksempel ønsker, at en e-mail, der går til `hello@example.com`, skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, så vil min <strong class="notranslate">TXT</strong>-post se sådan ud:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:bruger+a@gmail.com,hello:bruger+b@gmail.com</code></td>
</tr> </tbody>
</table>

Eller du kan angive dem i to separate linjer, f.eks. denne:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller tom</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=hello:user+a@gmail.com</code></td> </tr> <tr> <td><em>"@", ".", eller tom</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresend-email=hello:bruger+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Det er op til dig!

### Kan jeg have flere globale catch-all-modtagere {#can-i-have-multiple-global-catch-all-recipients}

Ja, det kan du. Angiv blot flere globale catch-all-modtagere i dine <strong class="notranslate">TXT</strong>-poster.

Hvis jeg for eksempel ønsker, at alle e-mails, der går til `*@example.com` (stjernen betyder, at det er et jokertegn, også kendt som en "catch-all"), skal videresendes til `user+a@gmail.com` og `user+b@gmail.com`, så ville min <strong class="notranslate">TXT</strong>-post se sådan ud:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=bruger+a@gmail.com,bruger+b@gmail.com</code></td> </tr> </tbody>
</table>

Eller du kan angive dem i to separate linjer, f.eks. denne:

<table class="table table-striped table-hover my-3"> <thead class="thead-dark"> <tr> <th>Navn/Vært/Alias</th> <th class="text-center">TTL</th> <th>Type</th> <th>Svar/Værdi</th> </tr> </thead> <tbody> <tr> <td><em>"@", ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>forward-email=bruger+a@gmail.com</code></td> </tr> <tr> <td><em>@, ".", eller blank</em></td> <td class="text-center">3600</td> <td class="notranslate">TXT</td> <td><code>videresend-email=bruger+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Det er op til dig!

### Er der en maksimal grænse for antallet af e-mailadresser, jeg kan videresende til via alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ja, standardgrænsen er 10. Det betyder IKKE, at du kun kan have 10 aliasser på dit domænenavn. Du kan have så mange aliasser, som du vil (et ubegrænset antal). Det betyder, at du kun kan videresende ét alias til 10 unikke e-mailadresser. Du kan have `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (fra 1-10) – og alle e-mails til `hello@example.com` vil blive videresendt til `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (fra 1-10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong> <span>
Har du brug for mere end 10 modtagere pr. alias? Send os en e-mail, så øger vi gerne din kontogrænse.
</span>
</div>

### Kan jeg videresende e-mails rekursivt {#can-i-recursively-forward-emails}

Ja, det kan du, men du skal stadig overholde den maksimale grænse. Hvis du har `hello:linus@example.com` og `linus:user@gmail.com`, vil e-mails til `hello@example.com` blive videresendt til `linus@example.com` og `user@gmail.com`. Bemærk, at der vil blive udløst en fejl, hvis du forsøger at videresende e-mails rekursivt ud over den maksimale grænse.

### Kan folk afregistrere eller registrere min videresendelse af e-mails uden min tilladelse {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Vi bruger MX- og <strong class="notranslate">TXT</strong>-postverifikation, så hvis du tilføjer denne tjenestes respektive MX- og <strong class="notranslate">TXT</strong>-poster, så er du registreret. Hvis du fjerner dem, så er du afregistreret. Du ejer dit domæne og DNS-administration, så hvis nogen har adgang til det, er det et problem.

### Hvordan er det gratis {#how-is-it-free}

Forward Email tilbyder et gratis niveau gennem en kombination af open source-udvikling, effektiv infrastruktur og valgfrie betalte planer, der understøtter tjenesten.

Vores gratis niveau understøttes af:

1. **Open source-udvikling**: Vores kodebase er open source, hvilket muliggør bidrag fra fællesskabet og transparent drift.

2. **Effektiv infrastruktur**: Vi har optimeret vores systemer til at håndtere videresendelse af e-mails med minimale ressourcer.

3. **Betalte premium-abonnementer**: Brugere, der har brug for yderligere funktioner som SMTP-afsendelse, IMAP-modtagelse eller forbedrede privatlivsindstillinger, abonnerer på vores betalte abonnementer.

4. **Rimelige forbrugsgrænser**: Gratisniveauet har politikker for rimelig brug for at forhindre misbrug.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Hvad er den maksimale størrelsesgrænse for e-mails {#what-is-the-max-email-size-limit}

Vi har som standard en størrelsesgrænse på 50 MB, som inkluderer indhold, headere og vedhæftede filer. Bemærk, at tjenester som Gmail og Outlook kun tillader en størrelsesgrænse på 25 MB, og hvis du overskrider grænsen, når du sender til adresser hos disse udbydere, vil du modtage en fejlmeddelelse.

Der returneres en fejl med den korrekte svarkode, hvis filstørrelsesgrænsen overskrides.

### Gemmer I logfiler over e-mails? {#do-you-store-logs-of-emails}

Nej, vi skriver ikke til disk eller gemmer logs – med [undtagelse af fejl](#do-you-store-error-logs) og [udgående SMTP](#do-you-support-sending-email-with-smtp) (se vores [Privatlivspolitik](/privacy)).

Alt gøres i hukommelsen og [vores kildekode er på GitHub](https://github.com/forwardemail).

### Gemmer I fejllogfiler {#do-you-store-error-logs}

**Ja. Du kan få adgang til fejllogfiler under [Min konto → Logfiler](/my-account/logs) eller [Min konto → Domæner](/my-account/domains).**

Fra februar 2023 opbevarer vi fejllogfiler for SMTP-svarkoderne `4xx` og `5xx` i en periode på 7 dage – som indeholder SMTP-fejlen, kuverten og e-mail-headerne (vi **opbevarer** ikke e-mailens brødtekst eller vedhæftede filer).

Fejllogge giver dig mulighed for at kontrollere for manglende vigtige e-mails og afbøde falske positiver i forbindelse med spam for [dine domæner](/my-account/domains). De er også en god ressource til fejlfinding af problemer med [e-mail webhooks](#do-you-support-webhooks) (da fejlloggene indeholder webhook-slutpunktssvaret).

Fejllogge for [hastighedsbegrænsende](#do-you-have-rate-limiting) og [gråliste](#do-you-have-a-greylist) er ikke tilgængelige, da forbindelsen afsluttes tidligt (f.eks. før kommandoerne `RCPT TO` og `MAIL FROM` kan overføres).

Se vores [Privatlivspolitik](/privacy) for mere indsigt.

### Læser du mine e-mails {#do-you-read-my-emails}

Nej, absolut ikke. Se vores [Privatlivspolitik](/privacy).

Mange andre e-mail-videresendelsestjenester gemmer og kan potentielt læse dine e-mails. Der er ingen grund til, at videresendte e-mails skal gemmes på disken – og derfor har vi udviklet den første open source-løsning, der gør det hele i hukommelsen.

Vi mener, at du har ret til privatliv, og vi respekterer det nøje. Koden, der installeres på serveren, er [open source-software på GitHub](https://github.com/forwardemail) for at sikre gennemsigtighed og opbygge tillid.

### Kan jeg "sende mail som" i Gmail med denne {#can-i-send-mail-as-in-gmail-with-this}

Ja! Fra den 2. oktober 2018 har vi tilføjet denne funktion. Se [Sådan sender du e-mail som ved hjælp af Gmail](#how-to-send-mail-as-using-gmail) ovenfor!

Du bør også indstille SPF-posten for Gmail i din DNS-konfigurations-<strong class="notranslate">TXT</strong>-post.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vigtigt:
</strong>
<span>
Hvis du bruger Gmail (f.eks. Send mail som) eller G Suite, skal du tilføje <code>include:_spf.google.com</code> til din SPF <strong class="notranslate">TXT</strong>-post, for eksempel:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Kan jeg "sende mail som" i Outlook med denne {#can-i-send-mail-as-in-outlook-with-this}

Ja! Fra den 2. oktober 2018 har vi tilføjet denne funktion. Se blot disse to links fra Microsoft nedenfor:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Du bør også indstille SPF-posten for Outlook i din DNS-konfigurations-<strong class="notranslate">TXT</strong>-post.

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

### Kan jeg "sende mail som" i Apple Mail og iCloud Mail med denne {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Hvis du abonnerer på iCloud+, kan du bruge et brugerdefineret domæne. [Vores tjeneste er også kompatibel med Apple Mail](#apple-mail).

Se venligst <https://support.apple.com/en-us/102540> for yderligere information.

### Kan jeg videresende et ubegrænset antal e-mails med denne {#can-i-forward-unlimited-emails-with-this}

Ja, men "relativt ukendte" afsendere er begrænset til 100 forbindelser i timen pr. værtsnavn eller IP-adresse. Se afsnittet om [Hastighedsbegrænsende](#do-you-have-rate-limiting) og [Gråliste](#do-you-have-a-greylist) ovenfor.

Med "relativt ukendt" mener vi afsendere, der ikke vises i [tilladelsesliste](#do-you-have-an-allowlist).

Hvis denne grænse overskrides, sender vi en 421-svarkode, der beder afsenderens mailserver om at forsøge igen senere.

### Tilbyder I ubegrænsede domæner til én pris {#do-you-offer-unlimited-domains-for-one-price}

Ja. Uanset hvilket abonnement du har, betaler du kun én månedlig pris – som dækker alle dine domæner.

### Hvilke betalingsmetoder accepterer I? {#which-payment-methods-do-you-accept}

Videresend e-mail accepterer følgende engangs- eller månedlige/kvartalsvise/årlige betalingsmetoder:

1. **Kredit-/betalingskort/bankoverførsler**: Visa, Mastercard, American Express, Discover, JCB, Diners Club osv.

2. **PayPal**: Forbind din PayPal-konto for nem betaling

3. **Kryptovaluta**: Vi accepterer betalinger via Stripes stablecoin-betalinger på Ethereum-, Polygon- og Solana-netværk

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Alle betalinger behandles sikkert via Stripe eller PayPal. Dine betalingsoplysninger gemmes aldrig på vores servere.

## Yderligere ressourcer {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Casestudier og udviklerdokumentation](/blog/docs)
* [Ressourcer](/resources)
* [Guider](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/